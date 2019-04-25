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
const chalk = require('react-dev-utils/chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const bfj = require('bfj');
const configFactory = require('../config/webpack.config');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Process CLI arguments
const argv = process.argv.slice(2);
const writeStatsJson = argv.indexOf('--stats') !== -1;

// Generate configuration
// const config = configFactory('production');

function build(args) {
  if (!args) args = {};
  // Generate configuration
  let outputDir = paths.appBuild;
  let publicDir = paths.appPublic;
  if (args.pluginDir) {
    outputDir = path.join(args.pluginDir, 'build');
    publicDir = path.join(args.pluginDir, 'public');
  }
  const config = configFactory('production', args);

  // We require that you explicitly set browsers and do not fall back to
  // browserslist defaults.
  const { checkBrowsers } = require('react-dev-utils/browsersHelper');
  return checkBrowsers(paths.appPath, isInteractive)
    .then(() => {
      // First, read the current file sizes in build directory.
      // This lets us display how much they changed later.
      return measureFileSizesBeforeBuild(outputDir);
    })
    .then(previousFileSizes => {
      // Remove all content but keep the directory so that
      // if you're in it, you don't end up in Trash
      fs.emptyDirSync(outputDir);
      // Merge with the public folder
      copyPublicFolder(publicDir, outputDir);
      // Start the webpack build
      return doBuild(previousFileSizes);
    })
    .then(({ stats, previousFileSizes, warnings }) => {
      return new Promise(
        (resolve, reject) => {
          if (warnings.length) {
            console.log(chalk.yellow('Compiled with warnings.\n'));
            console.log(warnings.join('\n\n'));
            console.log(
              '\nSearch for the ' +
                chalk.underline(chalk.yellow('keywords')) +
                ' to learn more about each warning.',
            );
            console.log(
              'To ignore, add ' +
                chalk.cyan('// eslint-disable-next-line') +
                ' to the line before.\n',
            );
          } else {
            console.log(chalk.green('Compiled successfully.\n'));
          }

          console.log('File sizes after gzip:\n');
          printFileSizesAfterBuild(
            stats,
            previousFileSizes,
            outputDir,
            WARN_AFTER_BUNDLE_GZIP_SIZE,
            WARN_AFTER_CHUNK_GZIP_SIZE,
          );
          console.log();
          console.log('Build success.');
          resolve();
        },
        err => {
          console.log(chalk.red('Failed to compile.\n'));
          printBuildError(err);
          process.exit(1);
        },
      ).catch(err => {
        if (err && err.message) {
          console.log(err.message);
        }
        process.exit(1);
      });
    });
  // Create the production build and print the deployment instructions.
  function doBuild(previousFileSizes) {
    console.log('Creating an optimized production build...');

    config.plugins.push(
      new webpack.DllReferencePlugin({
        context: args.pluginDir ? path.join(args.pluginDir, 'src') : paths.appSrc,
        manifest: require(path.join(__dirname, '../build/dll-manifest.json')),
      }),
    );
    if (!args.pluginDir) {
      config.plugins.push(
        new AddAssetHtmlPlugin([
          { filepath: paths.resolveApp('dll/rsdll.js') },
          { filepath: paths.resolveApp('public/rekit-plugins.js') },
        ]),
      );
    } else {
      config.entry = [path.join(args.pluginDir, 'src/index.js')];
      config.output = {
        ...config.output,
        filename: 'main.js',
        path: outputDir,
      };
    }
    let compiler = webpack(config);
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        let messages;
        if (err) {
          if (!err.message) {
            return reject(err);
          }
          messages = formatWebpackMessages({
            errors: [err.message],
            warnings: [],
          });
        } else {
          messages = formatWebpackMessages(
            stats.toJson({ all: false, warnings: true, errors: true }),
          );
        }
        if (messages.errors.length) {
          // Only keep the first error. Others are often indicative
          // of the same problem, but confuse the reader with noise.
          if (messages.errors.length > 1) {
            messages.errors.length = 1;
          }
          return reject(new Error(messages.errors.join('\n\n')));
        }
        if (
          process.env.CI &&
          (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') &&
          messages.warnings.length
        ) {
          console.log(
            chalk.yellow(
              '\nTreating warnings as errors because process.env.CI = true.\n' +
                'Most CI servers set it automatically.\n',
            ),
          );
          return reject(new Error(messages.warnings.join('\n\n')));
        }

        const resolveArgs = {
          stats,
          previousFileSizes,
          warnings: messages.warnings,
        };
        if (writeStatsJson) {
          return bfj
            .write(outputDir + '/bundle-stats.json', stats.toJson())
            .then(() => resolve(resolveArgs))
            .catch(error => reject(new Error(error)));
        }

        return resolve(resolveArgs);
      });
    });
  }
}

function copyPublicFolder(publicDir, outputDir) {
  if (outputDir === paths.appBuild) {
    // If build Rekit Studio, need to copy dll stuff to build folder.
    // This is necessary for web workers.
    fs.copySync(paths.resolveApp('dll'), paths.resolveApp('build'));
    fs.copySync(paths.resolveApp('dll/manifest.json'), paths.resolveApp('build/dll-manifest.json'));
  }
  fs.copySync(publicDir, outputDir, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}

module.exports = build;
