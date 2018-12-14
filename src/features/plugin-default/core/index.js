const studio = require('./studio');
const file = require('./file');
const folder = require('./folder');

module.exports = {
  studio,
  app: require('./app'),
  elements: {
    file,
    folder,
  },
};
