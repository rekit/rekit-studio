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

    // const cols = parseInt(req.query.cols, 10),
    //   rows = parseInt(req.query.rows, 10),
    //   term = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
    //     name: 'xterm-color',
    //     cols: cols || 80,
    //     rows: rows || 24,
    //     cwd: rekit.core.paths.getProjectRoot(),
    //     env: process.env,
    //   });

    // console.log('Created terminal with PID: ' + term.pid);
    // terminals[term.pid] = term;
    // logs[term.pid] = '';
    // term.on('data', function(data) {
    //   logs[term.pid] += data;
    // });
    // res.send(term.pid.toString());
    res.send('haha');
    res.end();
  });

  app.post('/api/stop-script', (req, res) => {});

  // app.post('/terminals/:pid/size', function(req, res) {
  //   var pid = parseInt(req.params.pid, 10),
  //     cols = parseInt(req.query.cols, 10),
  //     rows = parseInt(req.query.rows, 10),
  //     term = terminals[pid];

  //   term.resize(cols, rows);
  //   console.log('Resized terminal ' + pid + ' to ' + cols + ' cols and ' + rows + ' rows.');
  //   res.end();
  // });

  // app.ws('/terminals/:pid', function(ws, req) {
  //   var term = terminals[parseInt(req.params.pid, 10)];
  //   console.log('Connected to terminal ' + term.pid);
  //   ws.send(logs[term.pid]);

  //   term.on('data', function(data) {
  //     try {
  //       ws.send(data);
  //     } catch (ex) {
  //       // The WebSocket is not open, ignore
  //     }
  //   });
  //   ws.on('message', function(msg) {
  //     term.write(msg);
  //   });
  //   ws.on('close', function() {
  //     term.kill();
  //     console.log('Closed terminal ' + term.pid);
  //     // Clean things up
  //     delete terminals[term.pid];
  //     delete logs[term.pid];
  //   });
  // });
}

module.exports = {
  config,
  getRunning() {
    const running = {};
    Object.keys(processes).forEach(k => (running[k] = true));
    return running;
  },
};
