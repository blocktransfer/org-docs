'use strict';

const {spawn} = require('node:child_process');
const path = require('node:path');
const {syncVersionedDocs} = require('./sync-versioned-docs.cjs');
const {cleanVersionedDocs} = require('./clean-versioned-docs.cjs');

const siteDir = path.resolve(__dirname, '..');
const docusaurusBin = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = ['docusaurus', 'start', ...process.argv.slice(2)];

syncVersionedDocs(siteDir);

const child = spawn(docusaurusBin, args, {
  cwd: siteDir,
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

child.on('error', error => {
  cleanVersionedDocs(siteDir);
  console.error(error);
  process.exitCode = 1;
});
child.on('exit', (code, signal) => {
  cleanVersionedDocs(siteDir);
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}
