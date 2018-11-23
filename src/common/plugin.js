import _ from 'lodash';

// This is temporialy used for Rekit Studio development.
// In future plugins are dynamically loaded.

import * as defaultPlugin from '../features/plugin-default/ui';
import * as cra from '../features/plugin-cra/ui';
import * as terminal from '../features/plugin-terminal/ui';
import * as scripts from '../features/plugin-scripts/ui';
// import * as node from '../features/plugin-node/ui';

// const pluginMap = {
//   default: defaultPlugin,
//   cra,
//   terminal,
//   node,
// };
if (!_.find(window.__REKIT_PLUGINS, { name: 'default' })) {
  window.__REKIT_PLUGINS.push(defaultPlugin, cra, terminal, scripts);
}

// Use global variable to store module state for workaround of HMR.
// if (!window.__REKIT_pluginNames) window.__REKIT_pluginNames = [];
export default {
  // setPluginNames(names) {
  //   window.__REKIT_pluginNames = names;
  // },
  getPlugins(prop) {
    const plugins = window.__REKIT_PLUGINS;
    if (!prop) return _.compact(plugins);
    return plugins.filter(_.property(prop));
  },
  // addPlugin(p) {
  //   window.__REKIT_PLUGINS.push(p);
  // }
  // getColor(type) {
  //   const colors = this.getPlugins('colors').reduce((prev, curr) => {
  //     Object.assign(prev, curr.colors);
  //     return prev;
  //   }, {});
  //   return colors[type] || '#78909C';
  // },
  // getIcon(type) {
  //   const icons = this.getPlugins('icons').reduce((prev, curr) => {
  //     Object.assign(prev, curr.icons);
  //     return prev;
  //   }, {});
  //   return icons[type] || 'file';
  // },
};
