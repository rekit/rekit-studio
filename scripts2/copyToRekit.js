const fs = require('fs-extra');
const path = require('path');
const os = require('os');

['rekit-react'].forEach(name =>
  fs.copySync(
    path.join(__dirname, `../src/features/${name}`),
    path.join(os.homedir(), `.rekit/plugins/${name}`),
  ),
);

console.log('✨Done.');