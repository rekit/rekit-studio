#! /usr/bin/env node

const ArgumentParser = require('argparse').ArgumentParser;
const path = require('path');
const http = require('http');
const express = require('express');
const importFrom = require('import-from');
const compression = require('compression');
const fallback = require('express-history-api-fallback');
const pkgJson = require('../package.json');

const parser = new ArgumentParser({
  version: pkgJson.version,
  addHelp: true,
  allowAbbrev: false,
  description: 'Start Rekit Studio with given port and project dir.',
});

parser.addArgument(['--port', '-p'], {
  help: 'The port to run Rekit Studio.',
  defaultValue: 6076,
});

parser.addArgument(['--dir', '-d'], {
  help: 'The project dir loaded by Rekit Studio.',
  defaultValue: '.',
});

const args = parser.parseArgs();
console.log(args);

const prjRoot = path.isAbsolute(args.dir) ? args.dir : path.join(process.cwd(), args.dir);
global.rekit = importFrom(prjRoot, 'rekit-core');
console.log('abc', global.rekit);
const configStudio = require('./configStudio');

// Start Rekit Studio
const app = express();
const server = http.createServer(app);
const studioRoot = path.join(__dirname, '../build');
app.use(compression());
app.use(express.static(studioRoot));
app.use(express.static(rekit.core.paths.getProjectRoot()));
configStudio(server, app);
app.use(fallback('index.html', { root }));

const port = args.port;
server.listen(parseInt(port, 10), err => {
  if (err) {
    console.error(err);
  }

  console.log(`The build server is listening at http://localhost:${port}/`);
});
