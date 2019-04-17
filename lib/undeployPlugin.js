// Remove the plugin from local Rekit plugins folder
const fs = require('fs-extra');
const { paths } = require('rekit-core').core;

function undeploy(pluginRoot) {
  const pkgJson = require(paths.join(pluginRoot, 'package.json'));
  const name = pkgJson.name;
  const destPluginDir = paths.configFile(`plugins/${name}`);
  if (!fs.existsSync(destPluginDir)) {
    fs.removeSync(destPluginDir);
    console.warn(`Done. Rekit plugin undeployed: ${name}.`);
  }
  else console.warn(`Rekit plugin not deployed: ${name}. Did nothing.`);
}

module.exports = undeploy;
