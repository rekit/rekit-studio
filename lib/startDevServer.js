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
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const cliArgs = require('./cliArgs');
const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');

const initPlugins = require('./initPlugins');
const configPluginsServer = require('./configPluginsServer');
const configStudio = require('./configStudio');

const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Tools like Cloud9 rely on this.
const HOST = process.env.HOST || '0.0.0.0';

if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Attempting to bind to HOST environment variable: ${chalk.yellow(
        chalk.bold(process.env.HOST),
      )}`,
    ),
  );
  console.log(`If this was unintentional, check that you haven't mistakenly set it in your shell.`);
  console.log(`Learn more here: ${chalk.yellow('https://bit.ly/CRA-advanced-config')}`);
  console.log();
}

// We require that you explictly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper');

function startDevServer(args) {
  args = Object.assign(cliArgs, args);
  if (!fs.existsSync(args.projectRoot)) {
    throw new Error(`Project not exists: ${args.projectRoot}`);
  }
  const rekit = require('rekit-core');
  rekit.core.paths.setProjectRoot(args.projectRoot);

  const DEFAULT_PORT = parseInt(process.env.PORT, 10) || args.port || 3000;
  const config = configFactory('development', args);

  if (args.pluginDir) {
    process.env.REKIT_PLUGIN_DIR = args.pluginDir; // For terminal to load the plugin
    args.pluginDirNoUI = true; //// UI part is defined in webpack config entry in dev time.
    config.entry.push(path.join(args.pluginDir, 'src/index.js'));
    if (!args.noDevDll) {
      // Update the manifest so that plugin could find modules in it.
      const manifest = fs.readJsonSync(paths.devDllManifest);
      manifest.content = _.mapKeys(manifest.content, (value, key) => {
        if (key.startsWith('../node_modules/')) return key.replace('../node_modules/', '../../');
        return key;
      });
      config.plugins.push(
        new webpack.DllReferencePlugin({
          context: paths.appSrc,
          manifest,
        }),
        new AddAssetHtmlPlugin([
          { filepath: paths.resolveApp('dev-dll/rsdevdll.js') },
          { filepath: paths.resolveApp('public/rekit-plugins.js') },
        ]),
        new CopyWebpackPlugin([{ from: paths.resolveApp('dev-dll'), to: '' }]),
      );
    }
  } else {
    process.env.REKIT_STUDIO_DEVELOPMENT = true;
    config.plugins.push(
      new AddAssetHtmlPlugin([{ filepath: paths.resolveApp('public/rekit-plugins.js') }]),
    );
  }
  rekit.core.plugin.addPlugin({
    name: 'dev-data',
    app: {
      processProjectData(prjData) {
        prjData.devPort = DEFAULT_PORT;
      },
    },
  });
  initPlugins(args);

  checkBrowsers(paths.appPath, isInteractive)
    .then(() => {
      const port = DEFAULT_PORT;
      const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
      const appName = require(paths.appPackageJson).name;
      const useTypeScript = fs.existsSync(paths.appTsConfig);
      const urls = prepareUrls(protocol, HOST, port);
      const devSocket = {
        warnings: warnings => devServer.sockWrite(devServer.sockets, 'warnings', warnings),
        errors: errors => devServer.sockWrite(devServer.sockets, 'errors', errors),
      };
      // Create a webpack compiler that is configured with custom messages.
      const compiler = createCompiler({
        appName,
        config,
        devSocket,
        urls,
        useYarn,
        useTypeScript,
        webpack,
      });
      // Load proxy config
      const proxySetting = require(paths.appPackageJson).proxy;
      const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
      // Serve webpack assets generated by the compiler over a web server.
      const serverConfig = createDevServerConfig(proxyConfig, urls.lanUrlForConfig);
      const oldBefore = serverConfig.before;
      serverConfig.before = (app, server) => {
        oldBefore(app, server);
        configPluginsServer(app);
      };
      const devServer = new WebpackDevServer(compiler, serverConfig);
      // should not put in devserverConfig.before, why?
      configStudio(devServer.listeningApp, devServer.app);

      // Launch WebpackDevServer.
      devServer.listen(port, HOST, err => {
        if (err) {
          return console.log(err);
        }
        if (isInteractive) {
          // clearConsole();
        }
        console.log(chalk.cyan('Starting the development server...\n'));
        // openBrowser(urls.localUrlForBrowser);
      });

      ['SIGINT', 'SIGTERM'].forEach(function(sig) {
        process.on(sig, function() {
          devServer.close();
          process.exit();
        });
      });
    })
    .catch(err => {
      if (err && err.message) {
        console.log(err.message);
      }
      process.exit(1);
    });
}

module.exports = startDevServer;
