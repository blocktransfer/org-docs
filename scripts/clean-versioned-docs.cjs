'use strict';

const fs = require('node:fs');
const path = require('node:path');
const defaultSiteDir = path.resolve(__dirname, '..');

function cleanVersionedDocs(siteDir = defaultSiteDir) {
  fs.rmSync(path.join(siteDir, 'versioned_docs'), {recursive: true, force: true});
  fs.rmSync(path.join(siteDir, 'versioned_sidebars'), {recursive: true, force: true});
  fs.rmSync(path.join(siteDir, 'versions.json'), {force: true});
}

if (require.main === module) cleanVersionedDocs();
module.exports = {cleanVersionedDocs};
