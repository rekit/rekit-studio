const express = require('express');
const rekit = require('rekit-core');

function configPluginsServer(app) {
  const uiPlugins = rekit.core.plugin.getPlugins('ui.root');
  console.log('remote ui plugins: ', uiPlugins.map(p => p.name));
  const links = [];
  uiPlugins.forEach(p => {
    if (p.ui.rootLink) links.push(p.ui.rootLink);
    else links.push(`/plugin-${p.name}/main.js`);
  });

  app.get('/rekit-plugins.js', (req, res) => {
    res.send(links.map(link => `document.write('<script src="${link}"></script>');`).join(''));
  });

  uiPlugins.forEach(p => {
    app.use(`/plugin-${p.name}`, express.static(p.ui.root));
  });
}

module.exports = configPluginsServer;
