'use strict';

const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const configFactory = require('../config/webpack.config');

function buildPlugin(pluginName) {
  console.log(`Building plugin: ${pluginName}`);
  const pluginDir = path.join(__dirname, '../src/features', pluginName);
  const buildDir = path.join(pluginDir, 'build');
  const indexJs = path.join(pluginDir, 'entry.js');
  const indexStyle = path.join(pluginDir, 'style.less');
  const originalConfig = configFactory('production');
  const config = {
    ...originalConfig,
    entry: [indexJs, indexStyle],
    output: {
      ...originalConfig.output,
      filename: 'main.js',
      path: buildDir,
    },
  };
  fs.emptyDirSync(buildDir);
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
          stats.toJson({ all: false, warnings: true, errors: true })
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
      const publicDir = path.join(pluginDir, 'public');
      if (fs.existsSync(publicDir)) fs.copySync(publicDir, buildDir);
      console.log(`🎉${pluginName} done.`);

      return resolve();
    });
  });
}

module.exports = buildPlugin;
