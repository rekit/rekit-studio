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
console.time('loading modules...');
// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');
const ArgumentParser = require('argparse').ArgumentParser;
const paths = require('../config/paths');
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

initPlugins(args);

process.stdout.isTTY = true;

// Tools like Cloud9 rely on this.
const DEFAULT_PORT =
  parseInt(process.env.PORT, 10) || require(paths.appPackageJson).rekit.devPort || 3000;
const HOST = process.env.HOST || '0.0.0.0';

if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Attempting to bind to HOST environment variable: ${chalk.yellow(
        chalk.bold(process.env.HOST)
      )}`
    )
  );
  console.log(`If this was unintentional, check that you haven't mistakenly set it in your shell.`);
  console.log(`Learn more here: ${chalk.yellow('http://bit.ly/2mwWSwH')}`);
  console.log();
}

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `choosePort()` Promise resolves to the next free port.
if (args.port) startDevServer(args.port);
else
  choosePort(HOST, DEFAULT_PORT)
    .then(port => {
      if (port == null) {
        // We have not found a port.
        return;
      }

      startDevServer(args.port || port);
    })
    .catch(err => {
      if (err && err.message) {
        console.log(err.message);
        console.log(err.stack);
      }
      process.exit(1);
    });
