const _ = require('lodash');
const chokidar = require('chokidar');
const { paths } = require('rekit-core').core;
const git = require('simple-git')();

let watcher;
const track = _.debounce(io => {
  git.status((err, status) => {
    if (!err) {
      io.emit('GIT_MANAGER_GIT_STATUS', {
        status,
      });
    }
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
    git.checkIsRepo((err, isRepo) => {
      if (isRepo) {
        startTrack(args.io);
        res.send(JSON.stringify({ success: true }));
      } else {
        res.send(JSON.stringify({ success: false }));
      }
    });
  });
}
module.exports = { config };
