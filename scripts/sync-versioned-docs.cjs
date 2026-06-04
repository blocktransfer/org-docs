const fs = require('fs');
const path = require('path');

const siteDir = path.resolve(__dirname, '..');
const sourceDocsDir = path.join(siteDir, 'versions');
const docusaurusDocsDir = path.join(siteDir, 'versioned_docs');
const sourceSidebarsDir = path.join(siteDir, 'sidebars');
const docusaurusSidebarsDir = path.join(siteDir, 'versioned_sidebars');

function syncDir(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    return;
  }

  fs.rmSync(targetDir, {recursive: true, force: true});
  fs.cpSync(sourceDir, targetDir, {recursive: true});
}

function syncSidebars(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    return;
  }

  fs.rmSync(targetDir, {recursive: true, force: true});
  fs.mkdirSync(targetDir, {recursive: true});

  for (const fileName of fs.readdirSync(sourceDir)) {
    const match = /^version-(.+)\.json$/.exec(fileName);

    if (match) {
      fs.copyFileSync(
        path.join(sourceDir, fileName),
        path.join(targetDir, `version-${match[1]}-sidebars.json`),
      );
    }
  }
}

syncDir(sourceDocsDir, docusaurusDocsDir);
syncSidebars(sourceSidebarsDir, docusaurusSidebarsDir);
