// const pty = require('node-pty');
const spawn = require('child_process').spawn;
// const rekit = require('rekit-core');

const processes = {};
function config(server, app, args) {
  const io = args.io;

  const onData = (chunk, name) => {
    const out = chunk.toString('utf8');
    io.emit('script-status', {
      type: 'output',
      name,
      output: out,
    });
  };
  app.post('/api/run-script', function(req, res) {
    const name = req.body.name;
    if (processes[name]) {
      res.send('already-running');
      res.end();
      return;
    }
    const child = spawn('yarn', ['run', name], {
      cwd: rekit.core.paths.getProjectRoot(),
      stdio: 'pipe',
    });
    processes[name] = child;

    child.stdout.on('data', chunk => onData(chunk, name));
    child.stderr.on('data', chunk => onData(chunk, name));
    child.on('exit', () => {
      io.emit('script-status', {
        type: 'exit',
        name,
      });
      delete processes[name];
    });

    res.send(JSON.stringify({ name }));
    res.end();
  });

  app.post('/api/stop-script', (req, res) => {
    const name = req.body.name;
    const p = processes[name];
    if (p) {
      p.kill();
      delete processes[name];
    }
    res.send(JSON.stringify({ name }));
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
