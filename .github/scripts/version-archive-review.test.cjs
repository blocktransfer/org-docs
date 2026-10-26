'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { run, protectedFiles, approvedReviewers } = require('./version-archive-review.cjs');

test('detects all protected version paths and historic rename sources', () => {
  assert.deepEqual(protectedFiles([
    { filename: 'docs/intro.md' },
    { filename: 'versions/archive-0.1.0/intro.md' },
    { filename: 'new/location.md', previous_filename: 'versions/archive-0.1.0/old.md' },
    { filename: 'versions/history.json' },
    { filename: 'versions.json' },
    { filename: '.github/scripts/version-archive-review.cjs' },
    { filename: '.github/workflows/version-archive-review.yml' },
    { filename: '.github/VERSION_PROTECTION.md' }
  ]), [
    '.github/VERSION_PROTECTION.md',
    '.github/scripts/version-archive-review.cjs',
    '.github/workflows/version-archive-review.yml',
    'versions.json',
    'versions/archive-0.1.0/intro.md',
    'versions/archive-0.1.0/old.md',
    'versions/history.json'
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
  'versions/archive-0.1.0/intro.md', 'versions/history.json',
  'versions.json', '.github/scripts/version-archive-review.cjs',
  '.github/VERSION_PROTECTION.md'
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
    files: [{ filename: 'versions.json' }],
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
    const gh = fake({ files: [{ filename: 'versions/history.json' }], reviews: [reviewer], permission });
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
    files: [{ filename: 'versions.json' }],
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
