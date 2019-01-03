const path = require('path');
const rekit = require('rekit-core');

function initPlugins(options) {
  // This logic should be changed for production time.
  const allPlugins = [
    '../src/features/plugin-default',
    '../src/features/plugin-terminal',
    '../src/features/plugin-scripts',
    '../src/features/plugin-test',
  ].map(p => path.join(__dirname, p));
  allPlugins.forEach(p => rekit.core.plugin.addPluginByPath(p)); // core only

  // adding plugin in dev time
  // rekit.core.plugin.addPlugin();
  if (options.devPluginsDir) {
    options.devPluginsDir
      .split(',')
      .map(p => p.trim())
      .forEach(rekit.core.plugin.loadDevPlugins);
  }

  if (options.pluginsDir) {
    options.pluginsDir
      .split(',')
      .map(p => p.trim())
      .forEach(rekit.core.plugin.loadPlugins);
  }
}

module.exports = initPlugins;