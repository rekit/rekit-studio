/* global rekit */
const pty = require('node-pty');
const _ = require('lodash');
const terminate = require('terminate');

const terms = {};
function config(server, app, args) {
  app.post('/api/run-script', (req, res) => {
    const name = req.body.name;

    if (terms[name]) {
      res.send(JSON.stringify({ alreadyRun: true }));
      return;
    }
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    const term = pty.spawn(npmCmd, ['run', name], {
      name: 'xterm-color',
      cwd: rekit.core.paths.getProjectRoot(),
      env: process.env,
    });
    terms[name] = term;
    const arr = [];
    const flush = _.throttle(data => {
      args.io.emit({
        type: 'PLUGIN_PTY_OUTPUT',
        data: {
          id: `run_script_${name}`,
          output: arr,
        },
      });
      arr.length = 0;
    }, 100);
    term.on('data', function(data) {
      arr.push(data);
      flush();
    });
    term.on('exit', () => {
      console.log('term exit: ', name);
      flush();
      args.io.emit({
        type: 'PLUGIN_SCRIPTS_EXIT',
        data: { name },
      });
      delete terms[name];
    });

    res.send(name);
  });

  app.post('/api/stop-script', (req, res) => {
    const name = req.body.name;
    const term = terms[name];
    if (term) {
      terminate(term.pid);
      delete terms[name];
    }
    res.send(JSON.stringify({ name }));
    res.end();
  });
}

module.exports = {
  config,
  getRunning() {
    const running = {};
    Object.keys(terms).forEach(k => (running[k] = true));
    return running;
  },
};

// const spawn = require('child_process').spawn;
// // const rekit = require('rekit-core');
// const terminate = require('terminate');

// const processes = {};
// function config(server, app, args) {
//   const io = args.io;

//   const onData = (chunk, name) => {
//     const out = chunk.toString('utf8');
//     io.emit('script-status', {
//       type: 'output',
//       name,
//       output: out,
//     });
//   };
//   app.post('/api/run-script', function(req, res) {
//     const name = req.body.name;
//     if (processes[name]) {
//       res.send('already-running');
//       res.end();
//       return;
//     }
//     const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
//     const child = spawn(npmCmd, ['run', name, '--', '--colors'], {
//       cwd: rekit.core.paths.getProjectRoot(),
//       stdio: 'pipe',
//     });
//     processes[name] = child;

//     child.stdout.on('data', chunk => onData(chunk, name));
//     child.stderr.on('data', chunk => onData(chunk, name));
//     child.on('exit', () => {
//       io.emit('script-status', {
//         type: 'exit',
//         name,
//       });
//       delete processes[name];
//     });

//     res.send(JSON.stringify({ name }));
//     res.end();
//   });

//   app.post('/api/stop-script', (req, res) => {
//     const name = req.body.name;
//     const p = processes[name];
//     if (p) {
//       terminate(p.pid);
//       delete processes[name];
//     }
//     res.send(JSON.stringify({ name }));
//     res.end();
//   });
// }

// module.exports = {
//   config,
//   getRunning() {
//     const running = {};
//     Object.keys(processes).forEach(k => (running[k] = true));
//     return running;
//   },
// };
