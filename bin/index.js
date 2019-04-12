#! /usr/bin/env node

const ArgumentParser = require('argparse').ArgumentParser;
const path = require('path');
const pkgJson = require('../package.json');
const start = require('../lib/start');

const parser = new ArgumentParser({
  version: pkgJson.version,
  addHelp: true,
  allowAbbrev: false,
  description: 'Start Rekit Studio with given port and project dir.',
});

parser.addArgument(['--port', '-p'], {
  help: 'The port to run Rekit Studio.',
  defaultValue: 0,
});

parser.addArgument(['--dir', '-d'], {
  help: 'The project dir loaded by Rekit Studio.',
  defaultValue: '.',
});

parser.addArgument(['--plugins-dir'], {
  dest: 'pluginsDir',
  help: 'When starting a project, load plugins from these dirs.',
  defaultValue: null,
});

parser.addArgument(['--plugin-dir'], {
  dest: 'pluginDir',
  help: 'When starting a project, load one plugin from this dir.',
  defaultValue: null,
});

const args = parser.parseArgs();
const prjRoot = path.isAbsolute(args.dir) ? args.dir : path.join(process.cwd(), args.dir);

start({
  projectRoot: prjRoot,
  port: args.port,
  pluginsDir: args.pluginsDir,
  pluginDir: args.pluginDir,
});
