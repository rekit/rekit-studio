const express = require('express');
const _ = require('lodash');
const rekit = require('rekit-core');
const logger = require('./logger');

function configPluginsServer(app) {
  const uiPlugins = rekit.core.plugin.getPlugins('ui.root');
  logger.info('Remote ui plugins:', uiPlugins.map(p => p.name));
  const links = [];
  uiPlugins.forEach(p => {
    if (p.ui.rootLink) links.push(p.ui.rootLink);
    else links.push(`/plugin-${p.name}/main.js`);
  });

  app.get('/rekit-plugins.js', (req, res) => {
    const arr = links.map(link => `document.write('<script src="${link}"></script>');`);
    arr.push(
      `var __REKIT_APPLIED_PLUGINS=${JSON.stringify(
        rekit.core.plugin.getPlugins().map(p => _.pick(p, ['name', 'uiInherit'])),
      )};`,
    );
    res.send(_.compact(arr).join(''));
  });

  uiPlugins.forEach(p => {
    app.use(`/plugin-${p.name}`, express.static(p.ui.root));
  });
}

module.exports = configPluginsServer;
