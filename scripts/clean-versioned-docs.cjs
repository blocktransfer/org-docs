const fs = require('fs');
const path = require('path');

const docusaurusDir = path.resolve(__dirname, '..', 'versioned_docs');

fs.rmSync(docusaurusDir, {recursive: true, force: true});
