'use strict';

const {spawnSync} = require('node:child_process');
const path = require('node:path');
const {syncVersionedDocs} = require('./sync-versioned-docs.cjs');
const {cleanVersionedDocs} = require('./clean-versioned-docs.cjs');

const siteDir = path.resolve(__dirname, '..');
try {
  syncVersionedDocs(siteDir);
  const result = spawnSync(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['docusaurus', 'build', ...process.argv.slice(2)],
    {cwd: siteDir, stdio: 'inherit'}
  );
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  // Always delete generated Docusaurus inputs, including on failed builds.
  cleanVersionedDocs(siteDir);
}
