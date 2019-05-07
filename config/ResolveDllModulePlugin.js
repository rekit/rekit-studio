// This plugin update module's request path so that it's matched in dll for plugin build.
function ResolveDllModulePlugin(prjDir, isDev) {
  this.prjDir = prjDir.replace(/[/\\]*$/, '');
  this.isDev = !!isDev;
  this.dllManifest = isDev
    ? require('../dev-dll/manifest.json')
    : require('../build/dll-manifest.json');
}

ResolveDllModulePlugin.prototype.apply = function(resolver) {
  const target = resolver.ensureHook('existing-file');
  resolver.getHook('file').tapAsync('ResolveDllModulePlugin', (request, resolveContext, callback) => {
    if (
      request.path.indexOf('/node_modules/') >= 0 &&
      !(this.isDev && request.path.includes('/webpack/buildin/'))
    ) {
      const mid = request.path.replace(this.prjDir, '..');
      if (this.dllManifest.content[mid]) {
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
