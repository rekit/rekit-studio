const _ = require('lodash');

module.exports = {
  getProjectData() {
    return {
      // plugins: rekit.core.plugin.getPlugins().map(p => _.pick(p, ['name', 'uiInherit'])),
      projectName: rekit.core.config.getAppName(),
      projectRoot: rekit.core.paths.getProjectRoot(),
      appType: rekit.core.config.getRekitConfig().appType,
      config: rekit.core.config.getRekitConfig(),
    };
  },
};
