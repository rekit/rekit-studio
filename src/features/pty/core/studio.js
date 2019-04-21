/* global rekit */
const pty = require('node-pty');

function config(server, app, args) {
  app.get('/api/plugin-pty/npm-list', function(ws, req) {
    const term = pty.spawn('npm', ['list'], {
      name: 'xterm-color',
      cwd: rekit.core.paths.getProjectRoot(),
      env: process.env,
    });
    term.on('data', function(data) {
      args.io.emit({
        type: 'PLUGIN_PTY_OUTPUT',
        data: {
          id: '_pty_default_output_terminal',
          output: [data],
        },
      });
    });
  });
}
module.exports = { config };
