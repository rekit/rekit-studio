// Deploy the plugin to local Rekit plugins folder
const { spawn } = require('child_process');
const fs = require('fs-extra');
const { paths } = require('rekit-core').core;
global.__REKIT_NO_WATCH = true;
function deploy(pluginRoot) {
  const pkgJson = require(paths.join(pluginRoot, 'package.json'));
  const name = pkgJson.name;
  const pluginDir = paths.configFile(`plugins/${name}`);

  fs.ensureDirSync(pluginDir);
  console.log('Copying files to the plugin folder: ', pluginDir);
  ['build', 'core', 'package.json'].forEach(file => {
    const srcFile = paths.join(pluginRoot, file);
    if (fs.existsSync(srcFile)) fs.copySync(srcFile, paths.join(pluginDir, file));
  });

  console.log('Installing dependencies of the plugin...');
  
  // const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  // spawn(npmCmd, ['-v'], {
  //   stdio: 'inherit',
  // })
  // console.log('Done.');
  // Should run npm install?
}

module.exports = deploy;
