process.env.NODE_ENV = 'development';

const fs = require('fs-extra');
const webpack = require('webpack');
const paths = require('../config/paths');

function buildDevDll() {
  const dllName = 'rsdevdll';

  console.log('Building Rekit Studio dev dll...');
  fs.emptyDirSync(paths.resolveApp('dev-dll'));

  const config = require('../config/webpack.config')('development', { isDll: true });
  config.output.filename = `${dllName}.js`;
  config.output.library = dllName;
  config.output.path = paths.resolveApp('dev-dll');
  config.plugins.push(
    new webpack.DllPlugin({
      path: paths.devDllManifest,
      name: dllName,
      context: paths.appSrc,
    }),
  );

  console.time('Rekit Studio dev dll build success');

  return new Promise((resolve, reject) => {
    webpack(config, err => {
      if (err) {
        console.log('Rekit Studio dev dll build failed:');
        console.log(err.stack || err);
        reject();
        return;
      }
      console.timeEnd('Rekit Studio dev dll build success');
      resolve();
    });
  });
}

buildDevDll();

module.exports = buildDevDll;
