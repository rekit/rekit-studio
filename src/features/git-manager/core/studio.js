const _ = require('lodash');
const chokidar = require('chokidar');
const { paths } = require('rekit-core').core;
const git = require('simple-git')();

let watcher;
const notifyRekitApp = (status) => {
  if (process.send) process.send({ type: 'update-git-status', data: status }); // used by Rekit App
}
const track = _.debounce(io => {
  git.checkIsRepo((err1, isRepo) => {
    if (err1) return;
    if (!isRepo) {
      io.emit({
        type: 'GIT_MANAGER_GIT_STATUS',
        data: null,
      });
      notifyRekitApp(null);
      return;
    }
    git.status((err, status) => {
      if (!err) {
        io.emit({
          type: 'GIT_MANAGER_GIT_STATUS',
          data: status,
        });
        notifyRekitApp(status);
      }
    });
  });
}, 1000);
function startTrack(io) {
  if (!watcher) {
    watcher = chokidar.watch(paths.getProjectRoot(), { persist: true, ignored: ['node_modules'] });
    watcher.on('all', () => track(io));
  }
  track(io);
}

function config(server, app, args) {
  git.cwd(paths.getProjectRoot());
  app.get('/api/git-manager/status', function(req, res) {
    startTrack(args.io);
    res.send(JSON.stringify({ success: true }));
  });
}
module.exports = { config };
