'use strict';

const {spawnSync} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const {syncVersionedDocs} = require('./sync-versioned-docs.cjs');
const {cleanVersionedDocs} = require('./clean-versioned-docs.cjs');

const version = process.argv[2];
if (!version || !/^[0-9A-Za-z][0-9A-Za-z._-]*$/.test(version)) {
  console.error('Usage: npm run version:docs -- <version> (letters, digits, dots, _ or -)');
  process.exitCode = 1;
} else {
  const siteDir = path.resolve(__dirname, '..');
  const sourceVersionsDir = path.join(siteDir, 'versions');
  const sourceSidebarsDir = path.join(sourceVersionsDir, 'sidebars');
  const archivePath = path.join(sourceVersionsDir, 'archive-' + version);
  const sidebarPath = path.join(sourceSidebarsDir, 'version-' + version + '.json');
  let archiveCreated = false;
  let sidebarCreated = false;

  try {
    // Published archives are immutable unless explicitly modified by a PR.
    if (fs.existsSync(archivePath) || fs.existsSync(sidebarPath)) {
      throw new Error('Version ' + version + ' already exists in versions/');
    }
    syncVersionedDocs(siteDir);
    const result = spawnSync(
      process.platform === 'win32' ? 'npx.cmd' : 'npx',
      ['docusaurus', 'docs:version', version],
      {cwd: siteDir, stdio: 'inherit'}
    );
    if (result.error) throw result.error;
    if (result.status !== 0) {
      throw new Error('Docusaurus docs:version failed (exit ' + result.status + ')');
    }

    const generatedDocs = path.join(siteDir, 'versioned_docs', 'version-' + version);
    const generatedSidebar = path.join(siteDir, 'versioned_sidebars', 'version-' + version + '-sidebars.json');
    if (!fs.statSync(generatedDocs).isDirectory() || !fs.statSync(generatedSidebar).isFile()) {
      throw new Error('Docusaurus did not generate docs and sidebars for ' + version);
    }
    fs.mkdirSync(sourceVersionsDir, {recursive: true});
    fs.mkdirSync(sourceSidebarsDir, {recursive: true});
    archiveCreated = true;
    fs.cpSync(generatedDocs, archivePath, {recursive: true, errorOnExist: true, force: false});
    sidebarCreated = true;
    fs.copyFileSync(generatedSidebar, sidebarPath, fs.constants.COPYFILE_EXCL);
    console.log('Archived ' + version + ' in versions/archive-' + version);
  } catch (error) {
    // Only delete artifacts created by this invocation.
    if (archiveCreated) fs.rmSync(archivePath, {recursive: true, force: true});
    if (sidebarCreated) fs.rmSync(sidebarPath, {force: true});
    console.error(error);
    process.exitCode = 1;
  } finally {
    cleanVersionedDocs(siteDir);
  }
}
