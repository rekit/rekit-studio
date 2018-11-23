const studio = require('./studio');
const app = require('./app');

const plugin = {
  name: 'scripts',
  studio,
  app,
};

module.exports = plugin;
