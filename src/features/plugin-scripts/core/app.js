const { getRunning } = require('./studio');

module.exports = {
  getProjectData() {
    return {
      pluginScripts: {
        scripts: rekit.core.config.getPkgJson(true).scripts,
        running: getRunning(),
      },
    };
  },
};
