'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {generateManifest} = require('./archive-versions.cjs');
const {cleanVersionedDocs} = require('./clean-versioned-docs.cjs');

const defaultSiteDir = path.resolve(__dirname, '..');

function syncVersionedDocs(siteDir = defaultSiteDir) {
  const sourceDocsDir = path.join(siteDir, 'versions');
  const docusaurusDocsDir = path.join(siteDir, 'versioned_docs');
  const sourceSidebarsDir = path.join(sourceDocsDir, 'sidebars');
  const docusaurusSidebarsDir = path.join(siteDir, 'versioned_sidebars');

  cleanVersionedDocs(siteDir);
  try {
    const versions = generateManifest(siteDir);
    if (versions.length) {
      fs.mkdirSync(docusaurusDocsDir, {recursive: true});
      fs.mkdirSync(docusaurusSidebarsDir, {recursive: true});
    }
    for (const version of versions) {
      fs.cpSync(
        path.join(sourceDocsDir, 'archive-' + version),
        path.join(docusaurusDocsDir, 'version-' + version),
        {recursive: true}
      );
      const sidebar = path.join(sourceSidebarsDir, 'version-' + version + '.json');
      if (!fs.existsSync(sidebar)) {
        throw new Error('Missing archived sidebar for version ' + version + ': ' + sidebar);
      }
      fs.copyFileSync(
        sidebar,
        path.join(docusaurusSidebarsDir, 'version-' + version + '-sidebars.json')
      );
    }
    return versions;
  } catch (error) {
    cleanVersionedDocs(siteDir);
    throw error;
  }
}

if (require.main === module) syncVersionedDocs();
module.exports = {syncVersionedDocs};
