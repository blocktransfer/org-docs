'use strict';

const STATUS_CONTEXT = 'version-archives';
const POLICY_PATHS = new Set([
  '.github/version_protection.md',
  '.github/workflows/version-archive-review.yml',
  '.github/workflows/version-archive-review-signal.yml',
  '.github/scripts/version-archive-review.cjs',
  '.github/scripts/version-archive-review.test.cjs',
  '.gitignore',
  'package.json',
  'scripts/archive-versions.cjs',
  'scripts/archive-versions.test.cjs',
  'scripts/sync-versioned-docs.cjs',
  'scripts/clean-versioned-docs.cjs',
  'scripts/build-docusaurus.cjs',
  'scripts/start-docusaurus.cjs',
  'scripts/create-docs-version.cjs'
]);

function protectedFiles(files) {
  const matches = new Set();
  for (const file of files) {
    // Check both locations to prevent rename-based approval bypasses.
    for (const path of [file.filename, file.previous_filename]) {
      if (typeof path !== 'string') continue;
      if (path.startsWith('versions/') || POLICY_PATHS.has(path)) {
        matches.add(path);
      }
    }
  }
  return [...matches].sort();
}

// Parse only the static object/array/string literal used by sidebars.ts.
// Never execute pull-request code or evaluate JavaScript expressions.
function parseSidebarSource(source) {
  const match = source.match(/const sidebars: SidebarsConfig = (\{[\s\S]*\});\s*export default sidebars;\s*$/);
  if (!match) throw new SyntaxError('Unsupported sidebar declaration');
  const input = match[1];
  const token = /\s*(?:('([^'\\\r\n]*)')|("(?:[^"\\\r\n]|\\.)*")|([A-Za-z_$][\w$]*)(?=\s*:)|([{}\[\],:]))/y;
  const parts = [];
  let offset = 0;
  while (offset < input.length) {
    token.lastIndex = offset;
    const item = token.exec(input);
    if (!item) throw new SyntaxError('Unsupported sidebar literal');
    offset = token.lastIndex;
    const next = item[1] ? JSON.stringify(item[2]) :
      item[3] ? item[3] : item[4] ? JSON.stringify(item[4]) : item[5];
    if ((next === '}' || next === ']') && parts.at(-1) === ',') parts.pop();
    parts.push(next);
  }
  return JSON.parse(parts.join(''));
}

function sameJson(a, b) {
  if (a === b) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object' ||
      Array.isArray(a) !== Array.isArray(b)) return false;
  const ak = Object.keys(a).sort();
  const bk = Object.keys(b).sort();
  return ak.length === bk.length && ak.every((key, i) =>
    key === bk[i] && sameJson(a[key], b[key]));
}

function sameEntry(a, b) {
  return !!a && !!b && a.sha === b.sha && a.type === b.type && a.mode === b.mode;
}

function unchangedExcept(before, after, omitted) {
  const keys = new Set([...before.keys(), ...after.keys()]);
  return [...keys].every(key => key === omitted || sameEntry(before.get(key), after.get(key)));
}

async function exactNewArchive({ github, owner, repo, pr, files }) {
  const protectedChanges = files.filter(file => protectedFiles([file]).length);
  if (!protectedChanges.length || protectedChanges.some(file =>
    file.status !== 'added' || file.previous_filename)) return false;

  const versions = new Set();
  for (const { filename } of protectedChanges) {
    const match = filename.match(/^versions\/(?:archive-([0-9A-Za-z][0-9A-Za-z._-]*)\/.+|sidebars\/version-([0-9A-Za-z][0-9A-Za-z._-]*)\.json)$/);
    if (!match) return false;
    versions.add(match[1] || match[2]);
  }
  // One release per PR; no edits to verifier code or existing archives.
  if (versions.size !== 1) return false;
  const [version] = versions;
  const archive = 'archive-' + version;
  const sidebar = 'version-' + version + '.json';
  if (!pr.base.sha || !pr.head.sha) throw new Error('Missing pinned commit SHA');

  async function tree(sha) {
    const { data } = await github.rest.git.getTree({ owner, repo, tree_sha: sha });
    if (data.truncated || !Array.isArray(data.tree)) throw new Error('Incomplete Git tree');
    return new Map(data.tree.map(entry => [entry.path, entry]));
  }
  async function root(sha) {
    const { data } = await github.rest.git.getCommit({ owner, repo, commit_sha: sha });
    return tree(data.tree.sha);
  }
  async function directory(entries, name) {
    const entry = entries.get(name);
    if (!entry) return new Map();
    if (entry.type !== 'tree' || entry.mode !== '040000') throw new Error('Not a directory: ' + name);
    return tree(entry.sha);
  }
  async function blob(entry) {
    if (!entry || entry.type !== 'blob' || entry.mode !== '100644') return null;
    const { data } = await github.rest.git.getBlob({ owner, repo, file_sha: entry.sha });
    if (data.encoding !== 'base64' || typeof data.content !== 'string') throw new Error('Unsupported Git blob');
    return Buffer.from(data.content, 'base64').toString('utf8');
  }

  const [base, head] = await Promise.all([root(pr.base.sha), root(pr.head.sha)]);
  const docs = base.get('docs');
  if (docs?.type !== 'tree' || !sameEntry(docs, head.get('docs')) ||
      !sameEntry(base.get('sidebars.ts'), head.get('sidebars.ts'))) return false;
  const [before, after] = await Promise.all([directory(base, 'versions'), directory(head, 'versions')]);
  if (before.has(archive) || !sameEntry(docs, after.get(archive))) return false;
  if (!unchangedExcept(before, after, archive)) {
    // The only other permissible change is the addition to versions/sidebars.
    const left = new Map(before); left.delete('sidebars');
    const right = new Map(after); right.delete('sidebars');
    if (!unchangedExcept(left, right, archive)) return false;
  }
  const [oldSidebars, newSidebars] = await Promise.all([
    directory(before, 'sidebars'), directory(after, 'sidebars')
  ]);
  if (oldSidebars.has(sidebar) || !unchangedExcept(oldSidebars, newSidebars, sidebar)) return false;
  const [source, snapshot] = await Promise.all([blob(base.get('sidebars.ts')), blob(newSidebars.get(sidebar))]);
  if (source === null || snapshot === null) return false;
  try {
    return sameJson(parseSidebarSource(source), JSON.parse(snapshot));
  } catch (error) {
    if (error instanceof SyntaxError) return false;
    throw error;
  }
}

function approvedReviewers(reviews, headSha, author) {
  const decisions = new Map();
  for (const review of [...reviews].sort((a, b) => a.id - b.id)) {
    const login = review.user?.login;
    if (!login || login.toLowerCase() === author.toLowerCase()) continue;
    if (['APPROVED', 'CHANGES_REQUESTED', 'DISMISSED'].includes(review.state)) {
      decisions.set(login.toLowerCase(), review);
    }
  }
  return [...decisions.values()].filter(review =>
    review.state === 'APPROVED' && review.commit_id === headSha &&
    review.user.type !== 'Bot' && !review.user.login.endsWith('[bot]')
  ).map(review => review.user.login);
}

async function run({ github, context, core, pull_number }) {
  const { owner, repo } = context.repo;
  const prNumber = pull_number || context.payload.pull_request?.number;
  if (!prNumber) throw new Error('No PR associated with event');
  const { data: pr } = await github.rest.pulls.get({ owner, repo, pull_number: prNumber });
  if (pr.base.ref !== 'main' || pr.state === 'closed') return;
  const sha = pr.head.sha;
  async function status(state, description) {
    await github.rest.repos.createCommitStatus({
      owner, repo, sha, context: STATUS_CONTEXT, state,
      description: description.slice(0, 140),
      target_url: context.serverUrl + '/' + owner + '/' + repo + '/actions/runs/' + context.runId
    });
  }
  try {
    const files = await github.paginate(github.rest.pulls.listFiles, {
      owner, repo, pull_number: prNumber, per_page: 100
    });
    if (files.length >= 3000) throw new Error('PR has 3000+ files; cannot verify complete changes');
    const paths = protectedFiles(files);
    if (!paths.length) {
      await status('success', 'No archive approval required');
      return;
    }
    await status('pending', 'Checking archive integrity and approvals');
    if (await exactNewArchive({ github, owner, repo, pr, files })) {
      await status('success', 'New archive exactly matches current documentation and sidebar');
      return;
    }
    const reviews = await github.paginate(github.rest.pulls.listReviews, {
      owner, repo, pull_number: prNumber, per_page: 100
    });
    const eligible = [];
    for (const reviewer of approvedReviewers(reviews, sha, pr.user.login)) {
      const { data } = await github.rest.repos.getCollaboratorPermissionLevel({
        owner, repo, username: reviewer
      });
      if (['admin', 'write'].includes(data.permission)) eligible.push(reviewer);
    }
    if (eligible.length) {
      await status('success', 'Archive changes approved by ' + eligible[0]);
    } else {
      await status('failure', 'Archived documentation changes require approval');
      core.setFailed('Changes to ' + paths.join(', ') +
        ' require a fresh APPROVED review from a different human with write/admin access on SHA ' + sha);
    }
  } catch (error) {
    await status('failure', 'Unable to verify version archive approvals');
    throw error;
  }
}

module.exports = { run, protectedFiles, approvedReviewers, exactNewArchive, parseSidebarSource };
