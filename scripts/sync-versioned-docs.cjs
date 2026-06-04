const fs = require('fs');
const path = require('path');

const siteDir = path.resolve(__dirname, '..');
const sourceDir = path.join(siteDir, 'versions');
const docusaurusDir = path.join(siteDir, 'versioned_docs');

if (!fs.existsSync(sourceDir)) {
  process.exit(0);
}

fs.rmSync(docusaurusDir, {recursive: true, force: true});
fs.cpSync(sourceDir, docusaurusDir, {recursive: true});
