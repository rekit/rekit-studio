const path = require('path');
const rekit = require('rekit-core');

function initPlugins(args) {
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
  // if (args.devPluginsDir) {
  //   args.devPluginsDir
  //     .split(',')
  //     .map(p => p.trim())
  //     .forEach(rekit.core.plugin.loadDevPlugins);
  // }

  if (args.pluginsDir) {
    args.pluginsDir
      .split(',')
      .map(p => p.trim())
      .forEach(rekit.core.plugin.loadPlugins);
  }
}

module.exports = initPlugins;
