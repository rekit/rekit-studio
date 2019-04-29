const fs = require('fs');
const studio = require('./studio');
const app = require('./app');

const plugin = {
  name: 'scripts',
  studio,
  app,
  shouldUse() {
    return fs.existsSync(rekit.core.paths.map('package.json'));
  }
};

module.exports = plugin;
