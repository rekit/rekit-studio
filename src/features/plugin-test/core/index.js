/* global rekit */
module.exports = {
  name: 'test',
  studio: require('./studio'),
  shouldUse() {
    return !!rekit.core.config.getRekitConfig().rekitTest;
  }
};
