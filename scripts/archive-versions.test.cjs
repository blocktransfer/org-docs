'use strict';

const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {archivedVersions, generateManifest} = require('./archive-versions.cjs');
const {syncVersionedDocs} = require('./sync-versioned-docs.cjs');
const {cleanVersionedDocs} = require('./clean-versioned-docs.cjs');

function fixture(run) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'org-docs-versions-'));
  try { return run(dir); }
  finally { fs.rmSync(dir, {recursive: true, force: true}); }
}
function addArchive(siteDir, version) {
  const archive = path.join(siteDir, 'versions', 'archive-' + version);
  fs.mkdirSync(archive, {recursive: true});
  fs.writeFileSync(path.join(archive, 'intro.md'), '# ' + version + '\n');
  const sidebarDir = path.join(siteDir, 'versions', 'sidebars');
  fs.mkdirSync(sidebarDir, {recursive: true});
  fs.writeFileSync(path.join(sidebarDir, 'version-' + version + '.json'), '[]\n');
}

test('derives newest-first versions numerically from directory suffixes only', () => fixture(siteDir => {
  addArchive(siteDir, '0.9.0');
  addArchive(siteDir, '0.10.0');
  addArchive(siteDir, '1.0.0');
  fs.writeFileSync(path.join(siteDir, 'versions', 'archive-2.0.0'), 'not a directory');
  fs.mkdirSync(path.join(siteDir, 'versions', 'sidebars', 'archive-3.0.0'));
  assert.deepEqual(archivedVersions(path.join(siteDir, 'versions')), ['1.0.0', '0.10.0', '0.9.0']);
  assert.deepEqual(generateManifest(siteDir), ['1.0.0', '0.10.0', '0.9.0']);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(siteDir, 'versions.json'))), ['1.0.0', '0.10.0', '0.9.0']);
}));

test('materializes Docusaurus inputs then removes them, never touching archived sources', () => fixture(siteDir => {
  addArchive(siteDir, '0.1.0');
  const sourcePath = path.join(siteDir, 'versions', 'archive-0.1.0', 'intro.md');
  assert.deepEqual(syncVersionedDocs(siteDir), ['0.1.0']);
  assert.equal(fs.readFileSync(path.join(siteDir, 'versioned_docs', 'version-0.1.0', 'intro.md'), 'utf8'), '# 0.1.0\n');
  assert.equal(fs.readFileSync(path.join(siteDir, 'versioned_sidebars', 'version-0.1.0-sidebars.json'), 'utf8'), '[]\n');
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(siteDir, 'versions.json'))), ['0.1.0']);
  cleanVersionedDocs(siteDir);
  assert.equal(fs.existsSync(path.join(siteDir, 'versions.json')), false);
  assert.equal(fs.existsSync(path.join(siteDir, 'versioned_docs')), false);
  assert.equal(fs.existsSync(path.join(siteDir, 'versioned_sidebars')), false);
  assert.equal(fs.readFileSync(sourcePath, 'utf8'), '# 0.1.0\n');
}));

test('missing sidebar fails closed and cleans all generated paths', () => fixture(siteDir => {
  addArchive(siteDir, '0.1.0');
  fs.rmSync(path.join(siteDir, 'versions', 'sidebars', 'version-0.1.0.json'));
  assert.throws(() => syncVersionedDocs(siteDir), /Missing archived sidebar/);
  assert.equal(fs.existsSync(path.join(siteDir, 'versions.json')), false);
  assert.equal(fs.existsSync(path.join(siteDir, 'versioned_docs')), false);
}));

test('handles repository with no archived versions', () => fixture(siteDir => {
  assert.deepEqual(syncVersionedDocs(siteDir), []);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(siteDir, 'versions.json'))), []);
  cleanVersionedDocs(siteDir);
}));
