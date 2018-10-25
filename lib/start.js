const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const compression = require('compression');
const fallback = require('express-history-api-fallback');
const rekit = require('rekit-core');
const configStudio = require('./configStudio');

rekit.core.plugin.addPlugin({
  name: 'boilerplate',
  root: '/Users/pwang7/workspace/rekit-plugin-boilerplate',
});

function start(options) {
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
  server.listen(parseInt(port, 10), err => {
    if (err) {
      console.error(err);
    }

    console.log(`Rekit Studio is running at http://localhost:${port}/`);
  });
}

module.exports = start;
