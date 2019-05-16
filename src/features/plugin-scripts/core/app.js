/* global rekit */
const { getRunning } = require('./studio');

module.exports = {
  processProjectData(prjData) {
    const pkgJson = rekit.core.config.getPkgJson();
    Object.assign(prjData, {
      pluginScripts: {
        scripts: (pkgJson && pkgJson.scripts) || {},
        running: getRunning(),
      },
    });
  },
};
