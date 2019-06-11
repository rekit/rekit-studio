process.env.NODE_ENV = 'production';

const fs = require('fs-extra');
const webpack = require('webpack');
const paths = require('../config/paths');

function buildProdDll() {
  const dllName = 'rsdll';

  console.log('Building Rekit Studio dll...');
  fs.emptyDirSync(paths.resolveApp('dll'));

  const config = require('../config/webpack.config')('production', { isDll: true });
  config.output.filename = `${dllName}.js`;
  config.output.library = dllName;
  config.output.path = paths.resolveApp('dll');
  config.plugins.push(
    new webpack.DllPlugin({
      path: paths.dllManifest,
      name: dllName,
      context: paths.appSrc,
    }),
  );

  console.time('Rekit Studio dll build success');

  return new Promise((resolve, reject) => {
    webpack(config, err => {
      if (err) {
        console.log('Rekit Studio dll build failed:');
        console.log(err.stack || err);
        reject();
        return;
      }
      console.timeEnd('Rekit Studio dll build success');
      resolve();
    });
  });
}

buildProdDll();

module.exports = buildProdDll;
