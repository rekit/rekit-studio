module.exports = {
  getProjectData() {
    return {
      plugins: rekit.core.plugin.getPlugins().map(p => p.name),
      projectName: rekit.core.config.getPkgJson().name,
      projectRoot: rekit.core.paths.getProjectRoot(),
      appType: rekit.core.config.getRekitConfig().appType,
      config: rekit.core.config.getRekitConfig(),
    };
  },
};
