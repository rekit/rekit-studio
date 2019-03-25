const spawn = require('child_process').spawn;
const fs = require('fs-extra');
const path = require('path');
const debouncedOutput = require('../../../../lib/helpers').debouncedOutput;

let running = null;
function config(server, app, args) {
  const io = args.io;

  const onData = (chunk, name) => {
    chunk
      .toString('utf8')
      .split('\n')
      .forEach(s => debouncedOutput(s, io));
  };
  app.post('/api/run-test', function(req, res) {
    if (running) {
      res.send({ alreadyRunning: true });
      res.end();
      return;
    }
    const args = req.body.args;//.map(file => (file.startsWith('-') ? file : `"${file}"`));
    if (args.indexOf('--no-watch') < 0) args.push('--no-watch');

    if (running) {
      res.send('already-running');
      res.end();
      return;
    }
    const tmpDir = rekit.core.paths.map('tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const child = spawn(
      npmCmd,
      ['run', 'test', '--', '--colors', '--json', '--outputFile=tmp/testOutput.json'].concat(args),
      {
        cwd: rekit.core.paths.getProjectRoot(),
        stdio: 'pipe',
      }
    );
    running = child;

    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('exit', () => {
      io.emit('run-test-status', {
        type: 'exit',
        projectRoot: rekit.core.paths.getProjectRoot(),
        data: fs.readJsonSync(path.join(tmpDir, 'testOutput.json'), { throw: false }),
      });
      running = null;
    });

    res.send(JSON.stringify({ running: true }));
    res.end();
  });

  app.post('/api/stop-run-test', (req, res) => {
    if (running) {
      running.kill();
      running = null;
    }
    res.send(JSON.stringify({ running: false }));
    res.end();
  });
}

module.exports = {
  config,
  getRunning() {
    // const running = {};
    // Object.keys(processes).forEach(k => (running[k] = true));
    return running;
  },
};
