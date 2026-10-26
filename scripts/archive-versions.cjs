'use strict';

const fs = require('node:fs');
const path = require('node:path');

// Archive directory names are the source of truth for Docusaurus versions.
function archivedVersions(versionsDir) {
  if (!fs.existsSync(versionsDir)) return [];
  return fs.readdirSync(versionsDir, {withFileTypes: true})
    .filter(entry => entry.isDirectory() && /^archive-(.+)$/.test(entry.name))
    .map(entry => entry.name.slice('archive-'.length))
    .sort((a, b) => b.localeCompare(a, 'en', {numeric: true}));
}

function generateManifest(siteDir) {
  const versions = archivedVersions(path.join(siteDir, 'versions'));
  fs.writeFileSync(path.join(siteDir, 'versions.json'), JSON.stringify(versions, null, 2) + '\n');
  return versions;
}

module.exports = {archivedVersions, generateManifest};
