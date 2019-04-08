const dllManifest = require('rekit-studio/build/dll-manifest.json');
const paths = require('./paths');

// This plugin resolve Rekit Studio modules in dll.

function ResolveRSModulePlugin(alias) {
  this.alias = alias || 'rs';
}
console.log('number of dll modules', Object.keys(dllManifest.content).length);
ResolveRSModulePlugin.prototype.apply = function(resolver) {
  resolver.plugin('file', (request, callback) => {
    const rsKey = `/node_modules/${this.alias}/`;
    if (request.path.indexOf(rsKey) >= 0) {
      const rsPath = request.path.replace(rsKey, '/src/');
      const mid = rsPath.replace(paths.appSrc, '.');
      if (dllManifest.content[mid]) {
        request.path = rsPath;
        resolver.doResolve(
          'existing-file',
          request,
          'existing file: ' + request.path,
          callback,
          true,
        );
      }
    }
    //  else if (request.path.indexOf('/node_modules/') >= 0) {
    //   // console.log('file: ', request.path);
    //   const mid = request.path.replace(paths.appRoot, '../../..');
    //   console.log('middd:', mid);
    //   if (dllManifest.content[mid]) {
    //     const rsPath = request.path.replace(
    //       paths.appRoot,
    //       '../..',
    //       request.path.replace(paths.appRoot + '/', ''),
    //     );
    //     console.log('rsPath: ', rsPath);
    //     request.path = rsPath;
    //     resolver.doResolve(
    //       'existing-file',
    //       request,
    //       'existing file: ' + request.path,
    //       callback,
    //       true,
    //     );
    //   }
    // }
    return callback();
  });
};

module.exports = ResolveRSModulePlugin;
