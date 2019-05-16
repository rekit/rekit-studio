const _ = require('lodash');

module.exports = {
  processProjectData(prjData) {
    Object.assign(prjData, {
      projectName: rekit.core.config.getAppName(),
      projectRoot: rekit.core.paths.getProjectRoot(),
      appType: rekit.core.config.getRekitConfig().appType,
      config: rekit.core.config.getRekitConfig(),
    });
  },
};
