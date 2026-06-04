const fs = require('fs');
const path = require('path');

const siteDir = path.resolve(__dirname, '..');

fs.rmSync(path.join(siteDir, 'versioned_docs'), {recursive: true, force: true});
fs.rmSync(path.join(siteDir, 'versioned_sidebars'), {
  recursive: true,
  force: true,
});
