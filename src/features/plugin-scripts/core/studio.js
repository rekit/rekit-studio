/* global rekit */
const fs = require('fs-extra');
const pty = require('node-pty');
const _ = require('lodash');
const path = require('path');
const os = require('os');

const terms = {};

const notifyRekitApp = () => {
  if (process.send) process.send({ type: 'update-running-scripts', data: Object.keys(terms) }); // used by Rekit App
}

// if (process.send) process.send({ type: 'rekit-studio-error', error: err && err.stack }); // used by Rekit App

function config(server, app, args) {
  app.post('/api/run-script', (req, res) => {
    const name = req.body.name;
    const { paths } = rekit.core;
    const useYarn = fs.existsSync(paths.map('yarn.lock'));

    if (terms[name]) {
      res.send(JSON.stringify({ alreadyRun: true }));
      return;
    }
    let scriptCmd;
    const argsArray = [];
    if (process.platform === 'win32') {
      scriptCmd = useYarn ? 'yarn.cmd' : 'npm.cmd';
    } else {
      scriptCmd = useYarn ? 'yarn' : 'npm';
    }
    if (useYarn) {
      argsArray.push(name);
    } else {
      argsArray.push('run', name);
    }

    let term;
    if (process.platform === 'win32') {
      term = pty.spawn(scriptCmd, argsArray, {
        name: 'xterm-color',
        cwd: rekit.core.paths.getProjectRoot(),
        env: process.env,
      });
    } else {
      let source;
      ['.bash_profile', '.bashrc']
        .map(f => path.join(os.homedir(), f))
        .some(file => {
          if (fs.existsSync(file)) {
            source = file;
            return true;
          }
          return false;
        });
      term = pty.spawn(
        '/bin/bash',
        ['--rcfile', source, '-i', '-c', useYarn ? `yarn '${name}'` : `npm run '${name}'`],
        {
          name: 'xterm-color',
          cwd: rekit.core.paths.getProjectRoot(),
          env: process.env,
        },
      );
    }
    terms[name] = term;
    notifyRekitApp();
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
      flush();
      args.io.emit({
        type: 'PLUGIN_SCRIPTS_EXIT',
        data: { name },
      });
      delete terms[name];
      notifyRekitApp();
    });

    res.send(name);
  });

  app.post('/api/stop-script', (req, res) => {
    const name = req.body.name;
    const term = terms[name];
    if (term) {
      term.kill();
      delete terms[name];
      notifyRekitApp();
    }
    res.send(JSON.stringify({ name }));
    res.end();
  });

  app.post('/api/save-script', (req, res) => {
    const { oldName, newName, script } = req.body;
    const { paths } = rekit.core;
    const pkgJson = fs.readJsonSync(paths.map('package.json'));
    if (!pkgJson.scripts) pkgJson.scripts = {};
    if (oldName !== newName && pkgJson.scripts[newName]) {
      res.status(400).send('Script name already exists.');
    } else {
      const entries = Object.entries(pkgJson.scripts);
      const found = _.find(entries, entry => entry[0] === oldName);
      if (found) {
        found[0] = newName;
        found[1] = script;
      } else {
        entries.push([newName, script]);
      }
      pkgJson.scripts = _.fromPairs(entries);
      fs.writeFileSync(paths.map('package.json'), JSON.stringify(pkgJson, null, '  '));
      res.send(JSON.stringify({ oldName, newName, script }));
    }
    res.end();
  });

  app.post('/api/delete-script', (req, res) => {
    const { name } = req.body;
    const { paths } = rekit.core;
    const pkgJson = fs.readJsonSync(paths.map('package.json'));
    if (!pkgJson.scripts) pkgJson.scripts = {};
    delete pkgJson.scripts[name];
    fs.writeFileSync(paths.map('package.json'), JSON.stringify(pkgJson, null, '  '));
    res.send(JSON.stringify({ success: true }));
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
