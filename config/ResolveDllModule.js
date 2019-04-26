const dllManifest = require('../build/dll-manifest.json');

// This plugin update module's request path so that it's matched in dll for plugin build.
function ResolveDllModulePlugin(alias, prjDir) {
  this.alias = alias || 'rs';
  this.prjDir = prjDir.replace(/[/\\]*$/, '');
}

ResolveDllModulePlugin.prototype.apply = function(resolver) {
  const target = resolver.ensureHook('existing-file');
  resolver.getHook('file').tapAsync('ResolveRSModule', (request, resolveContext, callback) => {
    if (request.path.indexOf('/node_modules/') >= 0) {
      const mid = request.path.replace(this.prjDir, '..');
      if (dllManifest.content[mid]) {
        const fakePath = this.prjDir + '/node_modules/rekit-studio-sdk/' + mid.replace('../', '');
        request.path = fakePath;
        resolver.doResolve(target, request, null, resolveContext, callback);
      } else {
        return callback();
      }
    } else {
      return callback();
    }
  });
};

module.exports = ResolveDllModulePlugin;
