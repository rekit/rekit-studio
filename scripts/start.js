'use strict';

// const ARG_PORT = process.argv[2];
// const ARG_PRJ_ROOT = process.argv[2];
// if (ARG_PRJ_ROOT) {
//   require('rekit-core').core.paths.setProjectRoot(ARG_PRJ_ROOT);
// }
// require('rekit-core').core.paths.setProjectRoot('/Users/pwang7/workspace/serenity/');
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');
const ArgumentParser = require('argparse').ArgumentParser;
const initPlugins = require('../lib/initPlugins');

const startDevServer = require('./startDevServer');

const parser = new ArgumentParser({
  addHelp: true,
  description: 'Start express server for dev or build result.',
});

parser.addArgument(['--readonly'], {
  help: 'Whether build server server is readonly',
  action: 'storeTrue',
});

parser.addArgument(['--port', '-p'], {
  help: 'The port to run Rekit Studio.',
});

parser.addArgument(['--dir', '-d'], {
  help: 'The project dir to be managed by Rekit Studio.',
});

parser.addArgument(['--dev-plugins-dir'], {
  dest: 'devPluginsDir',
  help: 'When starting a project, if load plugins in dev time from plugin projects.',
  defaultValue: null,
});

parser.addArgument(['--plugins-dir'], {
  dest: 'pluginsDir',
  help: 'When starting a project, load plugins from these dirs.',
  defaultValue: null,
});

const args = parser.parseArgs();
const rekit = require('rekit-core');

if (args.dir) rekit.core.paths.setProjectRoot(args.dir);

process.stdout.isTTY = true;

// Tools like Cloud9 rely on this.
if (!args.port) args.port = rekit.core.config.getRekitConfig().devPort || 3000;

initPlugins(args);

startDevServer(args.port);
