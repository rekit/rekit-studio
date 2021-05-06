const path = require('path');
const rekit = require('rekit-core');

rekit.core.utils.addNodePath(path.join(__dirname, '../node_modules'));

function initPlugins(args) {
  // This logic should be changed for production time.
  const allPlugins = [
    '../src/features/plugin-default',
    '../src/features/plugin-terminal',
    '../src/features/plugin-scripts',
    '../src/features/plugin-test',
    // '../src/features/git-manager',
    '../src/features/pty',
    // '../src/features/plugin-typescript',
  ].map(p => path.join(__dirname, p));
  allPlugins.forEach(p => rekit.core.plugin.addPluginByPath(p)); // core only

  rekit.core.plugin.addPlugin({
    name: 'rekit-studio-info',
    app: {
      processProjectData(prjData) {
        prjData.rekitStudioVersion = require('../package.json').version;
        prjData.rekitCoreVersion = require('rekit-core/package.json').version;
      },
    },
  });

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

  if (args.pluginDir) {
    rekit.core.plugin.addPluginByPath(args.pluginDir, !!args.pluginDirNoUI);
  }
}

module.exports = initPlugins;
