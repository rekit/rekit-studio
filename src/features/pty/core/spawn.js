/* global rekit */
const pty = require('node-pty');

const terms = {};
const logs = {};
function spawn(app, id) {
  if (!terms[id]) {
    terms[id] = pty.spawn('npm', ['list'], {
      name: 'xterm-color',
      cwd: rekit.core.paths.getProjectRoot(),
      env: process.env,
    });
    terms[id].sockets = [];
    terms[id].theId = id;
  }
  const term = terms[id];
  const logs = {};
  logs[id] = '';
  term.on('data', function(data) {
    logs[id] += data;
  });

  

}
module.exports = spawn;
