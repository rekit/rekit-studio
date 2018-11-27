// const pty = require('node-pty');
const spawn = require('child_process').spawn;
// const rekit = require('rekit-core');

const processes = {};
function config(server, app, args) {
  const io = args.io;

  const onData = (chunk, name) => {
    const out = chunk.toString('utf8');
    io.emit('task-status', {
      type: 'output',
      name,
      output: out,
    });
  };
  app.post('/api/run-task', function(req, res) {
    const command = req.body.command;
    if (processes[command]) {
      res.send('already-running');
      res.end();
      return;
    }
    const arr = command.split(' ');
    const child = spawn(arr.pop(), arr, {
      cwd: rekit.core.paths.getProjectRoot(),
      stdio: 'pipe',
    });
    processes[command] = child;

    child.stdout.on('data', chunk => onData(chunk, command));
    child.stderr.on('data', chunk => onData(chunk, command));
    child.on('exit', () => {
      io.emit('task-status', {
        type: 'exit',
        command,
      });
      delete processes[command];
    });

    res.send(JSON.stringify({ command }));
    res.end();
  });

  app.post('/api/stop-task', (req, res) => {
    const command = req.body.command;
    const p = processes[command];
    if (p) {
      p.kill();
      delete processes[command];
    }
    res.send(JSON.stringify({ command }));
    res.end();
  });
}

module.exports = {
  config,
  getRunning() {
    const running = {};
    Object.keys(processes).forEach(k => (running[k] = true));
    return running;
  },
};
