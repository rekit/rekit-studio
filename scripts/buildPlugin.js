'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');
const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
let config = require('../config/webpack.config.prod');
const printBuildError = require('react-dev-utils/printBuildError');

// fs.emptyDirSync(paths.appBuild);
// copyPublicFolder();
// build().catch(err => {
//   console.log(chalk.red('Failed to compile.\n'));
//   printBuildError(err);
//   process.exit(1);
// });

// Create the production build and print the deployment instructions.
function buildPlugin(pluginDir) {
  console.log('Creating an optimized production build...');

  const indexJs = path.join(pluginDir, 'plugin.js');
  const indexStyle = path.join(pluginDir, 'style.less');
  config = {
    ...config,
    entry: [indexJs, indexStyle],
    output: {
      path: path.join(pluginDir, 'build'),
    },
    plugins: [
      ...config.plugins,
      new webpack.DllReferencePlugin({
        context: path.join(pluginDir, 'src'),
        manifest: require('../build/dll-manifest.json'),
      }),
    ],
  };

  fs.emptyDirSync(path.join(pluginDir, 'build'));
  copyPublicFolder(pluginDir);

  let compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        printBuildError(err);
        return reject(err);
      }
      console.log('Done.');

      return resolve();
    });
  });
}

function copyPublicFolder(prjDir) {
  if (fs.existsSync(`${prjDir}/public`)) fs.copySync(`${prjDir}/public`, `${prjDir}/build`);
}

buildPlugin('/Users/pwang7/workspace/rekit-studio/src/features/plugin-cra');
module.exports = buildPlugin;
