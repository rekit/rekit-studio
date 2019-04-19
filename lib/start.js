process.on('uncaughtException', function(err) {
  console.error('[Fatal Error] Rekit Studio teminated unexpectly:');
  console.error(err);
  if (process.send) process.send({ type: 'rekit-studio-error', error: err && err.stack }); // used by Rekit App
  // Timeout ensures winston writes to log files.
  setTimeout(() => process.exit(2), 100);
});

const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const compression = require('compression');
const fallback = require('express-history-api-fallback');
const rekit = require('rekit-core');
const configStudio = require('./configStudio');
const initPlugins = require('./initPlugins');
const configPluginsServer = require('./configPluginsServer');
const logger = require('./logger');

// Start rekit studio in production.
function start(options) {
  logger.info('Starting Rekit Studio: ', options);
  if (!fs.existsSync(options.projectRoot)) {
    throw new Error(`Project not exists: ${options.projectRoot}`);
  }
  rekit.core.paths.setProjectRoot(options.projectRoot);
  initPlugins(options);
  const app = express();
  const server = http.createServer(app);
  const studioRoot = path.join(__dirname, '../build');
  app.use(compression());

  configPluginsServer(app);

  app.use(express.static(studioRoot)); // access files in Rekit Studio
  app.use(express.static(options.projectRoot)); // access files in project

  configStudio(server, app);
  app.use(fallback('index.html', { root: studioRoot }));

  const port = options.port || rekit.core.config.getRekitConfig().studioPort || 3002;
  return new Promise(resolve => {
    server.listen(parseInt(port, 10), err => {
      if (err) {
        console.error(err);
      }
      resolve({ app });
      logger.info(`Rekit Studio is running at http://localhost:${port}/`);
      if (process.send) process.send({ type: 'rekit-studio-started' }); // used by Rekit App
    });
  });
}

module.exports = start;
