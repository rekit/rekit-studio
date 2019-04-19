// Deploy the plugin to local Rekit plugins folder
const { spawn } = require('child_process');
const fs = require('fs-extra');
const { paths } = require('rekit-core').core;

function deploy(pluginRoot, args = {}) {
  console.info('Deploy the plugin to local Rekit plugins folder so that it could be applied to all Rekit Studios.')

  const pkgJson = require(paths.join(pluginRoot, 'package.json'));
  const name = pkgJson.name;
  const destDir = paths.configFile(`plugins/${name}`);

  fs.ensureDirSync(destDir);
  console.log('Copying files to the plugin folder: ', destDir);
  ['build', 'core', 'package.json'].forEach(file => {
    const srcFile = paths.join(pluginRoot, file);
    if (fs.existsSync(srcFile)) fs.copySync(srcFile, paths.join(destDir, file));
  });

  if (!fs.existsSync(paths.join(destDir, 'node_modules'))) {
    console.log('Installing dependencies of the plugin...');
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const p = spawn(npmCmd, ['install', '--production'], {
      stdio: 'inherit',
      cwd: destDir,
    });
    p.on('exit', () => console.log('Done.'));
  } else {
    console.info('Skipped install dependencies because node_modules already exists.');
    console.info('If want to re-install them please undeploy it first then deploy it again.')
    console.log('Done.');
  }
}

module.exports = deploy;
