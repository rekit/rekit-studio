const ArgumentParser = require('argparse').ArgumentParser;
const rekit = require('rekit-core');
const initPlugins = require('../lib/initPlugins');
const startDevServer = require('../lib/startDevServer');

const parser = new ArgumentParser({
  addHelp: true,
  description: 'Start express server for dev or build result.',
});

parser.addArgument(['--port', '-p'], {
  help: 'The port to run Rekit Studio.',
});

parser.addArgument(['--dir', '-d'], {
  help: 'The project dir to be managed by Rekit Studio.',
});

parser.addArgument(['--plugin-prj-dir'], {
  dest: 'pluginPrjDir',
  help: 'When starting a project, if load plugins in dev time from plugin projects.',
  defaultValue: null,
});

parser.addArgument(['--plugins-dir'], {
  dest: 'pluginsDir',
  help: 'When starting a project, load plugins from these dirs.',
  defaultValue: null,
});

const args = parser.parseArgs();

if (args.dir) rekit.core.paths.setProjectRoot(args.dir);

process.stdout.isTTY = true;

// Tools like Cloud9 rely on this.
if (!args.port) args.port = rekit.core.config.getRekitConfig().devPort || 3000;

startDevServer(args);
