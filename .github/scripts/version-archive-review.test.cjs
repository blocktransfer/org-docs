'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { run, protectedFiles, approvedReviewers, exactNewArchive, parseSidebarSource } = require('./version-archive-review.cjs');

test('detects all protected version paths and historic rename sources', () => {
  assert.deepEqual(protectedFiles([
    { filename: 'docs/intro.md' },
    { filename: 'versions/archive-0.1.0/intro.md' },
    { filename: 'new/location.md', previous_filename: 'versions/archive-0.1.0/old.md' },
    { filename: 'versions/sidebars/version-0.1.0.json' },
    { filename: '.github/scripts/version-archive-review.cjs' },
    { filename: '.github/workflows/version-archive-review.yml' },
    { filename: '.github/version_protection.md' }
  ]), [
    '.github/scripts/version-archive-review.cjs',
    '.github/version_protection.md',
    '.github/workflows/version-archive-review.yml',
    'versions/archive-0.1.0/intro.md',
    'versions/archive-0.1.0/old.md',
    'versions/sidebars/version-0.1.0.json'
  ]);
  assert.deepEqual(protectedFiles([{ filename: 'docs/intro.md' }]), []);
});

test('only most recent independent human approval on exact head counts', () => {
  assert.deepEqual(approvedReviewers([
    { id: 1, user: { login: 'author', type: 'User' }, state: 'APPROVED', commit_id: 'new' },
    { id: 2, user: { login: 'stale', type: 'User' }, state: 'APPROVED', commit_id: 'old' },
    { id: 3, user: { login: 'dismissed', type: 'User' }, state: 'APPROVED', commit_id: 'new' },
    { id: 4, user: { login: 'dismissed', type: 'User' }, state: 'DISMISSED', commit_id: 'new' },
    { id: 5, user: { login: 'github-actions[bot]', type: 'Bot' }, state: 'APPROVED', commit_id: 'new' },
    { id: 6, user: { login: 'real', type: 'User' }, state: 'APPROVED', commit_id: 'new' }
  ], 'new', 'author'), ['real']);
});

function fake({ files = [], reviews = [], permission = 'write', throwFiles = false, throwPermissions = false } = {}) {
  const statuses = [];
  const gh = {
    statuses,
    rest: {
      pulls: {
        get: async () => ({ data: {
          state: 'open',
          base: { ref: 'main' },
          head: { sha: 'head' },
          user: { login: 'author' }
        }}),
        listFiles() {}, listReviews() {}
      },
      repos: {
        createCommitStatus: async item => { statuses.push(item); },
        getCollaboratorPermissionLevel: async () => {
          if (throwPermissions) throw new Error('permission API failed');
          return { data: { permission } };
        }
      }
    }
  };
  gh.paginate = async method => {
    if (method === gh.rest.pulls.listFiles) {
      if (throwFiles) throw new Error('files API failed');
      return files;
    }
    return reviews;
  };
  return gh;
}
const context = {
  repo: { owner: 'blocktransfer', repo: 'org-docs' },
  payload: { pull_request: { number: 1 } },
  serverUrl: 'https://github.com',
  runId: 10
};

test('unrelated docs changes pass automatically without fetching reviews', async () => {
  const gh = fake({ files: [{ filename: 'docs/intro.md' }] });
  gh.rest.pulls.listReviews = () => { throw new Error('should not inspect reviews'); };
  await run({ github: gh, context, core: { setFailed: () => { throw new Error('unexpected'); } } });
  assert.deepEqual(gh.statuses.map(x => x.state), ['success']);
  assert.equal(gh.statuses[0].context, 'version-archives');
});

for (const filename of [
  'versions/archive-0.1.0/intro.md', 'versions/sidebars/version-0.1.0.json',
  '.github/scripts/version-archive-review.cjs',
  '.github/version_protection.md'
]) {
  test('unapproved protected change fails: ' + filename, async () => {
    const gh = fake({ files: [{ filename }] });
    const errors = [];
    await run({ github: gh, context, core: { setFailed: x => errors.push(x) } });
    assert.deepEqual(gh.statuses.map(x => x.state), ['pending', 'failure']);
    assert.equal(errors.length, 1);
  });
}

test('renaming a file out of versions still requires approval', async () => {
  const gh = fake({ files: [{ filename: 'docs/old.md', previous_filename: 'versions/archive-0.1.0/old.md' }] });
  const errors = [];
  await run({ github: gh, context, core: { setFailed: x => errors.push(x) } });
  assert.deepEqual(gh.statuses.map(x => x.state), ['pending', 'failure']);
  assert.equal(errors.length, 1);
});

test('fresh independent contributor approval passes', async () => {
  const gh = fake({
    files: [{ filename: 'versions/sidebars/version-0.1.0.json' }],
    reviews: [{ id: 1, user: { login: 'reviewer', type: 'User' }, state: 'APPROVED', commit_id: 'head' }]
  });
  await run({ github: gh, context, core: { setFailed: () => { throw new Error('unexpected'); } } });
  assert.deepEqual(gh.statuses.map(x => x.state), ['pending', 'success']);
});

test('stale review, bot review, self approval, or read-only reviewer fail', async () => {
  for (const [reviewer, permission] of [
    [{ id: 1, user: { login: 'author', type: 'User' }, state: 'APPROVED', commit_id: 'head' }, 'write'],
    [{ id: 1, user: { login: 'other', type: 'User' }, state: 'APPROVED', commit_id: 'old' }, 'write'],
    [{ id: 1, user: { login: 'foo[bot]', type: 'Bot' }, state: 'APPROVED', commit_id: 'head' }, 'admin'],
    [{ id: 1, user: { login: 'other', type: 'User' }, state: 'APPROVED', commit_id: 'head' }, 'read']
  ]) {
    const gh = fake({ files: [{ filename: 'versions/sidebars/version-0.1.0.json' }], reviews: [reviewer], permission });
    const failures = [];
    await run({ github: gh, context, core: { setFailed: x => failures.push(x) } });
    assert.deepEqual(gh.statuses.map(x => x.state), ['pending', 'failure']);
    assert.equal(failures.length, 1);
  }
});

test('GitHub API errors fail closed, not pass', async () => {
  const gh = fake({ throwFiles: true });
  await assert.rejects(
    run({ github: gh, context, core: { setFailed() {} } }), /files API failed/
  );
  assert.deepEqual(gh.statuses.map(x => x.state), ['failure']);

  const gh2 = fake({
    files: [{ filename: 'versions/sidebars/version-0.1.0.json' }],
    reviews: [{ id: 1, user: { login: 'reviewer', type: 'User' }, state: 'APPROVED', commit_id: 'head' }],
    throwPermissions: true
  });
  await assert.rejects(
    run({ github: gh2, context, core: { setFailed() {} } }), /permission API failed/
  );
  assert.deepEqual(gh2.statuses.map(x => x.state), ['pending', 'failure']);
});

test('fails closed when GitHub caps changed files at 3000', async () => {
  const gh = fake({ files: Array.from({ length: 3000 }, (_, i) => ({ filename: 'docs/' + i })) });
  await assert.rejects(
    run({ github: gh, context, core: { setFailed() {} } }), /3000/
  );
  assert.deepEqual(gh.statuses.map(x => x.state), ['failure']);
});

test('protects version-generation scripts and archives', () => {
  assert.deepEqual(protectedFiles([
    {filename: 'scripts/archive-versions.cjs'},
    {filename: 'scripts/build-docusaurus.cjs'},
    {filename: '.gitignore'},
    {filename: 'versions/sidebars/version-0.1.0.json'},
    {filename: 'docs/ordinary.md'}
  ]), [
    '.gitignore',
    'scripts/archive-versions.cjs',
    'scripts/build-docusaurus.cjs',
    'versions/sidebars/version-0.1.0.json'
  ]);
});

test('generated root manifest does not require archive reviewer approval', () => {
  assert.deepEqual(protectedFiles([{filename: 'versions.json'}]), []);
});

function snapshotFixture() {
  const entry = (path, sha, type = 'tree') => ({ path, sha, type, mode: type === 'tree' ? '040000' : '100644' });
  const source = "const sidebars: SidebarsConfig = { docsSidebar: ['intro', { type: 'doc', id: 'bylaws', },], }; export default sidebars;";
  const blobs = new Map([['source', source], ['snapshot', JSON.stringify({docsSidebar: ['intro', {id: 'bylaws', type: 'doc'}]})]]);
  const trees = new Map([
    ['base', [entry('docs', 'docs'), entry('sidebars.ts', 'source', 'blob'), entry('versions', 'oldVersions')]],
    ['head', [entry('docs', 'docs'), entry('sidebars.ts', 'source', 'blob'), entry('versions', 'newVersions')]],
    ['oldVersions', [entry('archive-0.2.0', 'oldDocs'), entry('sidebars', 'oldSidebars')]],
    ['newVersions', [entry('archive-0.2.0', 'oldDocs'), entry('archive-0.3.0', 'docs'), entry('sidebars', 'newSidebars')]],
    ['oldSidebars', [entry('version-0.2.0.json', 'oldSidebar', 'blob')]],
    ['newSidebars', [entry('version-0.2.0.json', 'oldSidebar', 'blob'), entry('version-0.3.0.json', 'snapshot', 'blob')]]
  ]);
  const files = [
    { filename: 'versions/archive-0.3.0/intro.md', status: 'added' },
    { filename: 'versions/archive-0.3.0/bylaws.md', status: 'added' },
    { filename: 'versions/sidebars/version-0.3.0.json', status: 'added' },
    { filename: 'docusaurus.config.ts', status: 'modified' }
  ];
  const pr = { state: 'open', base: { ref: 'main', sha: 'base' }, head: { sha: 'head' }, user: { login: 'author' } };
  const github = fake({ files });
  github.rest.pulls.get = async () => ({ data: pr });
  github.rest.git = {
    getCommit: async ({ commit_sha }) => ({ data: { tree: { sha: commit_sha } } }),
    getTree: async ({ tree_sha }) => ({ data: { tree: trees.get(tree_sha), truncated: false } }),
    getBlob: async ({ file_sha }) => ({ data: { encoding: 'base64', content: Buffer.from(blobs.get(file_sha)).toString('base64') } })
  };
  return { github, owner: 'blocktransfer', repo: 'org-docs', pr, files, trees, blobs, entry };
}

test('static sidebar parser does not evaluate code', () => {
  assert.deepEqual(parseSidebarSource("const sidebars: SidebarsConfig = { docsSidebar: ['a', {type: 'doc', id: 'b',},], }; export default sidebars;"),
    { docsSidebar: ['a', {type: 'doc', id: 'b'}] });
  assert.throws(() => parseSidebarSource("const sidebars: SidebarsConfig = { docsSidebar: [process.exit()] }; export default sidebars;"), SyntaxError);
});

test('exact new snapshot passes without an independent reviewer', async () => {
  const f = snapshotFixture();
  assert.equal(await exactNewArchive(f), true);
  await run({ github: f.github, context, core: { setFailed: () => { throw new Error('unexpected'); } } });
  assert.deepEqual(f.github.statuses.map(x => x.state), ['pending', 'success']);
  assert.match(f.github.statuses.at(-1).description, /exactly matches/);
});

for (const [label, mutate] of [
  ['partial or altered snapshot', f => { f.trees.get('newVersions')[1].sha = 'different'; }],
  ['changed live docs', f => { f.trees.get('head')[0].sha = 'different'; }],
  ['changed live sidebar', f => { f.trees.get('head')[1].sha = 'different'; }],
  ['incorrect sidebar', f => { f.blobs.set('snapshot', '{"docsSidebar":[]}'); }],
  ['missing sidebar', f => { f.trees.get('newSidebars').pop(); }],
  ['new files in an existing version', f => { f.trees.get('oldVersions').push(f.entry('archive-0.3.0', 'oldDocs')); }],
  ['existing sidebar version', f => { f.trees.get('oldSidebars').push(f.entry('version-0.3.0.json', 'oldSidebar', 'blob')); }],
  ['mixed archive modifications', f => { f.files.push({filename: 'versions/archive-0.2.0/intro.md', status: 'modified'}); }],
  ['mixed policy modifications', f => { f.files.push({filename: '.github/scripts/version-archive-review.cjs', status: 'modified'}); }],
  ['rename from an older archive', f => { f.files[0].previous_filename = 'versions/archive-0.2.0/intro.md'; f.files[0].status = 'renamed'; }],
  ['unexpected old archive tree change', f => { f.trees.get('newVersions')[0].sha = 'different'; }],
  ['unexpected old sidebar change', f => { f.trees.get('newSidebars')[0].sha = 'different'; }],
  ['multiple new versions', f => { f.files.push({filename: 'versions/archive-0.4.0/intro.md', status: 'added'}); }]
]) {
  test('new snapshot exemption rejects ' + label, async () => {
    const f = snapshotFixture();
    mutate(f);
    assert.equal(await exactNewArchive(f), false);
    const failures = [];
    await run({ github: f.github, context, core: { setFailed: x => failures.push(x) } });
    assert.equal(f.github.statuses.at(-1).state, 'failure');
    assert.equal(failures.length, 1);
  });
}

test('new snapshot Git API failure fails closed', async () => {
  const f = snapshotFixture();
  f.github.rest.git.getTree = async () => ({ data: { tree: [], truncated: true } });
  await assert.rejects(run({ github: f.github, context, core: { setFailed() {} } }), /Incomplete Git tree/);
  assert.equal(f.github.statuses.at(-1).state, 'failure');
});
