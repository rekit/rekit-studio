import _ from 'lodash';

// This is temporialy used for Rekit Studio development.
// In future plugins are dynamically loaded.

// For built in plugins, defined here, internal plugins could depend others easily
import '../features/plugin-default/plugin';
import '../features/plugin-terminal/plugin';
import '../features/plugin-scripts/plugin';
import '../features/test/entry';
// import '../features/plugin-cra/plugin'; // dev time

if (!_.find(window.__REKIT_PLUGINS, { name: 'default' })) {
  // window.__REKIT_PLUGINS.push(defaultPlugin, terminal, scripts);
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
  addPlugin(p) {
    window.__REKIT_PLUGINS.push(p);
  }
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
