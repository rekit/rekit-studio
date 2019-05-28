// General command line args parser for bin and dev.

const path = require('path');
const ArgumentParser = require('argparse').ArgumentParser;
const pkgJson = require('../package.json');

const parser = new ArgumentParser({
  addHelp: true,
  allowAbbrev: false,
  version: pkgJson.version,
  description: 'Start Rekit Studio.',
});

parser.addArgument(['--port', '-p'], {
  help: 'The port to run Rekit Studio.',
  defaultValue: 3000,
});

parser.addArgument(['--dir', '-d'], {
  dest: 'projectRoot',
  help: 'The project dir to be managed by Rekit Studio.',
  defaultValue: process.cwd(),
});

parser.addArgument(['--plugin-dir', '-l'], {
  dest: 'pluginDir',
  help: 'When starting a project, if load plugins in dev time from plugin projects.',
  defaultValue: null,
});

parser.addArgument(['--plugins-dir'], {
  dest: 'pluginsDir',
  help: 'When starting a project, load plugins from these dirs.',
  defaultValue: null,
});

const args = parser.parseArgs();

if (process.env.REKIT_PROJECT_ROOT) {
  args.projectRoot = process.env.REKIT_PROJECT_ROOT;
}

if (!path.isAbsolute(args.projectRoot)) {
  args.projectRoot = path.join(process.cwd(), args.projectRoot);
}

module.exports = parser.parseArgs();
