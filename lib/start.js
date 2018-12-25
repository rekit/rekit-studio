process.on('uncaughtException', function(err) {
  console.error('Failed to start Rekit Studio');
  console.error(err);
  if (process.send) process.send({ type: 'rekit-studio-error', error: err && err.stack }); // used by Rekit App
  process.exit(2);
});

const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');
const http = require('http');
const express = require('express');
const compression = require('compression');
const fallback = require('express-history-api-fallback');
const rekit = require('rekit-core');
const configStudio = require('./configStudio');

function initPlugins(options) {
  // This logic should be changed for production time.
  const allPlugins = [
    '../src/features/plugin-default',
    '../src/features/plugin-terminal',
    '../src/features/plugin-scripts',
  ].map(p => path.join(__dirname, p));
  allPlugins.forEach(p => rekit.core.plugin.addPluginByPath(p)); // core only

  // adding plugin in dev time
  // rekit.core.plugin.addPlugin();
  if (options.devPluginsDir) {
    options.devPluginsDir
      .split(',')
      .map(p => p.trim())
      .forEach(rekit.core.plugin.loadDevPlugins);
  }

  if (options.pluginsDir) {
    options.pluginsDir
      .split(',')
      .map(p => p.trim())
      .forEach(rekit.core.plugin.loadPlugins);
  }
}

function start(options) {
  console.log('Starting Rekit Studio: ', options);
  initPlugins(options);
  const app = express();
  const server = http.createServer(app);
  const studioRoot = path.join(__dirname, '../build');
  app.use(compression());

  const uiPlugins = rekit.core.plugin.getPlugins('ui.root');
  const links = [];
  uiPlugins.forEach(p => {
    if (p.ui.rootLink) links.push(p.ui.rootLink);
    else links.push(`/plugin-${p.name}/main.js`);
  });

  app.get('/rekit-plugins.js', (req, res) => {
    res.send(links.map(link => `document.write('<script src="${link}"></script>');`).join(''));
  });

  app.use(express.static(studioRoot)); // access files in Rekit Studio
  app.use(express.static(options.projectRoot)); // access files in project
  uiPlugins.forEach(p => {
    app.use(`/plugin-${p.name}`, express.static(p.ui.root));
  });

  configStudio(server, app);
  app.use(fallback('index.html', { root: studioRoot }));

  const port = options.port;
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
