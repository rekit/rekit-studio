const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const http = require('http');
const express = require('express');
const compression = require('compression');
const fallback = require('express-history-api-fallback');
const rekit = require('rekit-core');
const configStudio = require('./configStudio');

process.on('uncaughtException', function(err) {
  if (process.send) process.send({ type: 'rekit-studio-error', error: err && err.stack }); // used by Rekit App
  process.exit(1);
});

function initPlugins() {
  rekit.core.plugin.addPlugin(require('../src/features/plugin-default/core')); // common app
  rekit.core.plugin.addPlugin(require('../src/features/plugin-terminal/core'));
  rekit.core.plugin.addPlugin(require('../src/features/plugin-scripts/core'));

  const allPlugins = ['../src/features/plugin-cra', '../src/features/plugin-node'];
  let appType = rekit.core.config.getRekitConfig().appType;

  allPlugins.forEach(p => {
    const pkgPath = path.join(__dirname, p, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      console.warn(`Failed to load plugin: no package.json: ${p}`);
      return;
    }
    try {
      const pkgJson = require(pkgPath);
      // Auto detect app type by folder structure.
      if (
        !appType &&
        pkgJson.isAppPlugin &&
        pkgJson.appType &&
        _.isArray(pkgJson.featureFiles) &&
        pkgJson.featureFiles.every(f => fs.existsSync(rekit.core.paths.map(f)))
      ) {
        appType = pkgJson.appType;
        rekit.core.config.setAppType(appType);
        console.log('app type detected: ', appType);
      }
      if (!pkgJson.appType || (appType && _.castArray(pkgJson.appType).includes(appType))) {
        const pluginInstance = require(path.join(__dirname, p, 'core'));
        pluginInstance.root = path.join(__dirname, p);
        rekit.core.plugin.addPlugin(pluginInstance);
      }
    } catch (err) {
      console.warn('Failed to load plugin:', err);
      return;
    }
  });
}

function start(options) {
  initPlugins();
  const app = express();
  const server = http.createServer(app);
  const studioRoot = path.join(__dirname, '../build');
  app.use(compression());

  app.get('/rekit-plugins.js', (req, res) => {
    const links = [];
    rekit.core.plugin.getPlugins().forEach(p => {
      if (typeof p === 'object') {
        if (p.name && p.root) {
          try {
            const mainJs = require(path.join(p.root, 'build/asset-manifest.json'))['main.js'];
            links.push(`/plugin-${p.name}/build/${mainJs}`);
          } catch (err) {
            console.log('Error: failed to find plugin mainifest: ', p.name, p.root);
          }
        }
        if (p.link) {
          links.push(p.link);
        }
      }
    });
    res.send(links.map(link => `document.write('<script src="${link}"></script>');`).join(''));
  });

  app.use(express.static(studioRoot)); // access files in Rekit Studio
  app.use(express.static(options.projectRoot)); // access files in project

  rekit.core.plugin.getPlugins().forEach(p => {
    if (typeof p === 'object') {
      if (p.name && p.root) {
        app.use(`/plugin-${p.name}`, express.static(p.root));
      }
    }
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
