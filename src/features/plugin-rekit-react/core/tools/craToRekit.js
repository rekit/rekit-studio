// Convert a create-react-app to Rekit.
// This tool is only used for generating react-rekit-boilerplate

// 1. Create react app
// 2. Eject
// 3. Update index.js, webpack config
// 4. Creating folders/files
// 5.

const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;
const _ = require('lodash');

const srcPrjDir = path.join(__dirname, '../../../../../../rekit-boilerplate-cra');
const destPrjDir = path.join(__dirname, '../../../../../../cra3');

function createApp(dir) {}

function convertApp(destPrjDir) {
  console.log('Converting project to Rekit: ', destPrjDir);
  // Copy files
  [
    'src/features',
    'src/common',
    'src/styles',
    'src/images',
    'src/Root.js',
    'tests',
    'postCreate.js',
    'babel.config.js',
    // '.babelrc',
    '.prettierrc',
  ].forEach(file => {
    const absSrcPath = path.join(srcPrjDir, file);
    const absDestPath = path.join(destPrjDir, file);
    if (fs.existsSync(absDestPath)) {
      console.warn('Dest file exists: ', absDestPath);
      return;
    }
    if (fs.existsSync(absSrcPath)) {
      console.log('Creating file(s): ', absDestPath);
      fs.copy(absSrcPath, absDestPath);
    } else {
      console.warn('Src file(s) does not exist: ', absSrcPath);
    }
  });

  // Update index.js
  // 1. Enable react-hot-loader
  
  // Update config/webpack.config.js
  // 1. Enable react-hot-loader


  // Install deps
  console.log('Installing dependencies...');
  const destDeps = Object.keys(require(path.join(destPrjDir, 'package.json')).dependencies);
  const srcDeps = Object.keys(require(path.join(srcPrjDir, 'package.json')).dependencies);
  const diffDeps = _.difference(srcDeps, destDeps);
  console.log('diff deps: ', diffDeps);
  // const args = [
  //   'add',
  //   'axios',
  //   'less',
  //   'less-loader',
  //   'nock',
  //   'redux',
  //   'redux-logger',
  //   'redux-thunk',
  //   'react-router-dom',
  //   'react-redux',
  //   '--dev',
  // ];
  // spawn('yarn', args, {
  //   cwd: destPrjDir,
  //   stdio: 'pipe',
  // });
}

if (!fs.existsSync(destPrjDir)) createApp(destPrjDir);

if (fs.existsSync(destPrjDir)) convertApp(destPrjDir);
