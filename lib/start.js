process.on('uncaughtException', function(err) {
  console.error('[Fatal Error] Rekit Studio teminated unexpectly:');
  console.error(err);
  if (process.send) process.send({ type: 'rekit-studio-error', error: err && err.stack }); // used by Rekit App
  // Timeout ensures winston writes to log files.
  setTimeout(() => process.exit(2), 100);
});

const fs = require('fs-extra');
const path = require('path');
const http = require('http');
const express = require('express');
const compression = require('compression');
// const fallback = require('express-history-api-fallback');
const rekit = require('rekit-core');
const configStudio = require('./configStudio');
const initPlugins = require('./initPlugins');
const configPluginsServer = require('./configPluginsServer');
const logger = require('./logger');
const cliArgs = require('./cliArgs');
const auth = require('./auth');

// Start rekit studio in production.
function start(args) {
  args = Object.assign(cliArgs, args);
  logger.info('Starting Rekit Studio: ', args);
  if (!fs.existsSync(args.projectRoot)) {
    throw new Error(`Project not exists: ${args.projectRoot}`);
  }
  rekit.core.paths.setProjectRoot(args.projectRoot);
  const port = parseInt(process.env.PORT, 10) || args.port;
  initPlugins(args);
  const app = express();
  const server = http.createServer(app);
  const studioRoot = path.join(__dirname, '../build');
  app.use(compression());

  // Authentication
  const token = auth.getToken();
  app.use(auth.validator(token));

  configPluginsServer(app);
  const indexHtml = fs
    .readFileSync(path.join(studioRoot, 'index.html'), 'utf-8')
    .replace('%REACT_APP_REKIT_TOKEN%', token);
  app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.write(indexHtml);
    res.end();
  });
  app.use(express.static(studioRoot)); // access files in Rekit Studio
  app.use(express.static(args.projectRoot)); // access files in project

  configStudio(server, app);

  app.use((req, res, next) => {
    if ((req.method === 'GET' || req.method === 'HEAD') && req.accepts('html')) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.write(indexHtml);
      res.end();
    } else next();
  });
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
