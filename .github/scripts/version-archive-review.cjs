'use strict';

const STATUS_CONTEXT = 'version-archives';
const POLICY_PATHS = new Set([
  '.github/VERSION_PROTECTION.md',
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
    await status('pending', 'Checking approvals for archived documentation changes');
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

module.exports = { run, protectedFiles, approvedReviewers };
