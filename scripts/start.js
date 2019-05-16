const path = require('path');
const ArgumentParser = require('argparse').ArgumentParser;
const startDevServer = require('../lib/startDevServer');

const parser = new ArgumentParser({
  addHelp: true,
  description: 'Start express server for dev or build result.',
});

parser.addArgument(['--port', '-p'], {
  help: 'The port to run Rekit Studio.',
});

parser.addArgument(['--dir', '-d'], {
  dest: 'projectRoot',
  help: 'The project dir to be managed by Rekit Studio.',
});

parser.addArgument(['--plugin-dir'], {
  dest: 'pluginDir',
  help: 'When starting a project, if load plugins in dev time from plugin projects.',
  defaultValue: null,
});

// parser.addArgument(['--plugins-dir'], {
//   dest: 'pluginsDir',
//   help: 'When starting a project, load plugins from these dirs.',
//   defaultValue: null,
// });

const args = parser.parseArgs();
process.stdout.isTTY = true;

if (args.projectRoot && !path.isAbsolute(args.projectRoot))
  args.projectRoot = path.join(process.cwd(), args.projectRoot);
if (!args.port) args.port = require('../rekit.json').devPort || 3000;

startDevServer(args);
