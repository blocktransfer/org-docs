const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');

const siteDir = path.resolve(__dirname, '..');
const docusaurusDir = path.join(siteDir, 'versioned_docs');
const docusaurusBin = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = ['docusaurus', 'start', ...process.argv.slice(2)];
const useShell = process.platform === 'win32';

function cleanup() {
  fs.rmSync(docusaurusDir, {recursive: true, force: true});
}

require('./sync-versioned-docs.cjs');

const child = spawn(docusaurusBin, args, {
  cwd: siteDir,
  shell: useShell,
  stdio: 'inherit',
});

child.on('error', (error) => {
  cleanup();
  console.error(error);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  cleanup();

  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    child.kill(signal);
  });
}
