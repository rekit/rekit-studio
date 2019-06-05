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
    else links.push(`/plugin-${p.name}/${p.ui.entry || 'main.js'}?v=${p.version}`);
  });

  app.get('/rekit-plugins.js', (req, res) => {
    const arr = [];
    if (process.env.NODE_ENV === 'development') {
      // In development time, use rsdevdll as rsdll to load 3rd party plugins
      arr.push('if (!window.rsdll) window.rsdll = window.rsdevdll;');
    }
    arr.push(...links.map(link => `document.write('<script src="${link}"></script>');`));
    const plugins = rekit.core.plugin.getPlugins();
    arr.push(
      `var __REKIT_APPLIED_PLUGINS=${JSON.stringify(
        plugins.map(p => _.pick(p, ['name', 'uiInherit', 'root'])),
      )};`,
    );

    // Check if the current app type requires plugin but it doesn't exist
    const appTypes = rekit.core.app.getAppTypes();
    const appType = rekit.core.config.getRekitConfig().appType;
    const found = _.find(appTypes, { id: appType });
    if (found && !['common', 'rekit-react', 'rekit-plugin'].includes(found.id) && found.plugin) {
      const foundPlugin = _.find(plugins, {name: found.plugin});
      if (!foundPlugin) arr.push(`var __REKIT_NO_PLUGIN_FOR_APP_TYPE = '${found.plugin}';`);
    }
    res.send(_.compact(arr).join(''));
  });

  uiPlugins.forEach(p => {
    app.use(`/plugin-${p.name}`, express.static(p.ui.root));
  });
}

module.exports = configPluginsServer;
