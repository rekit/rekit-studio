/* global rekit */
const { getRunning } = require('./studio');

module.exports = {
  getProjectData() {
    const pkgJson = rekit.core.config.getPkgJson();
    return {
      pluginScripts: {
        scripts: (pkgJson && pkgJson.scripts) || {},
        running: getRunning(),
      },
    };
  },
};
