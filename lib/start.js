process.on('uncaughtException', function(err) {
  console.error('Failed to start Rekit Studio');
  console.error(err);
  if (process.send) process.send({ type: 'rekit-studio-error', error: err && err.stack }); // used by Rekit App
  process.exit(2);
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

// Start rekit studio in production.
function start(options) {
  console.log('Starting Rekit Studio: ', options);
  if (!fs.existsSync(options.projectRoot)) {
    throw new Error(`Project not exists: ${options.projectRoot}`);
  }
  rekit.core.paths.setProjectRoot(options.projectRoot);
  console.log('Project root: ', options.projectRoot, rekit.core.config.getRekitConfig());
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

  const port = options.port || rekit.core.config.getRekitConfig().studioPort || 3001;
  return new Promise(resolve => {
    server.listen(parseInt(port, 10), err => {
      if (err) {
        console.error(err);
      }
      resolve({ app });
      console.log(`Rekit Studio is running at http://localhost:${port}/`);
      if (process.send) process.send({ type: 'rekit-studio-started' }); // used by Rekit App
    });
  });
}

module.exports = start;
