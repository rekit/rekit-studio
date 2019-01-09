import _ from 'lodash';

// This is temporialy used for Rekit Studio development.
// In future plugins are dynamically loaded.

// For built in plugins, defined here, internal plugins could depend others easily
import '../features/plugin-default/entry';
import '../features/plugin-terminal/entry';
import '../features/plugin-scripts/entry';
import '../features/plugin-test/entry';
// import '../features/plugin-cra/plugin'; // dev time
// if (process.env.NODE_ENV === 'development') {
  import '../features/rekit-react/entry';
// }

if (!_.find(window.__REKIT_PLUGINS, { name: 'default' })) {
  // window.__REKIT_PLUGINS.push(defaultPlugin, terminal, scripts);
}

// Use global variable to store module state for workaround of HMR.
// if (!window.__REKIT_pluginNames) window.__REKIT_pluginNames = [];
export default {
  // setPluginNames(names) {
  //   window.__REKIT_pluginNames = names;
  // },
  _plugins: null,
  getPlugins(prop) {
    if (!this._plugins) this._plugins = window.__REKIT_PLUGINS;
    if (!prop) return _.compact(this._plugins);
    console.log('all plugins: ', this._plugins);
    return this._plugins.filter(_.property(prop));
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
