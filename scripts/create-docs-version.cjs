const {spawnSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const version = process.argv[2];

if (!version) {
  console.error('Usage: npm run version:docs -- <version>');
  process.exit(1);
}

const siteDir = path.resolve(__dirname, '..');
const docusaurusVersionedDir = path.join(siteDir, 'versioned_docs');
const sourceVersionsDir = path.join(siteDir, 'versions');
const versionDirName = `version-${version}`;

const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['docusaurus', 'docs:version', version],
  {cwd: siteDir, stdio: 'inherit'},
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

fs.mkdirSync(sourceVersionsDir, {recursive: true});
fs.rmSync(path.join(sourceVersionsDir, versionDirName), {
  recursive: true,
  force: true,
});
fs.cpSync(
  path.join(docusaurusVersionedDir, versionDirName),
  path.join(sourceVersionsDir, versionDirName),
  {recursive: true},
);
fs.rmSync(docusaurusVersionedDir, {recursive: true, force: true});
