process.env.NODE_ENV = 'production';

const fs = require('fs-extra');
const webpack = require('webpack');
const paths = require('../config/paths');

function buildProdDll() {
  const dllName = 'rsdll';
  // const dllManifestPath = paths.resolveApp('build/static/rsdll-manifest.json');

  console.log('Building Altus dll...');
  fs.emptyDirSync(paths.resolveApp('dll'));

  let wpConfig = require('../config/webpack.config')('production');
  wpConfig = {
    ...wpConfig,
    output: { ...wpConfig.output },
    plugins: [...wpConfig.plugins],
  };
  wpConfig.output.filename = `${dllName}.js`;
  wpConfig.output.library = dllName;
  wpConfig.output.path = paths.resolveApp('dll');
  wpConfig.plugins.push(
    new webpack.DllPlugin({
      path: paths.dllManifest,
      name: dllName,
      context: paths.appSrc,
    }),
  );

  console.time('Altus dll build success');

  return new Promise((resolve, reject) => {
    webpack(wpConfig, err => {
      if (err) {
        console.log('Altus dll build failed:');
        console.log(err.stack || err);
        reject();
        return;
      }
      console.timeEnd('Altus dll build success');
      resolve();
    });
  });
}

buildProdDll();

module.exports = buildProdDll;
