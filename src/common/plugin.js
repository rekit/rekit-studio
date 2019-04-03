import _ from 'lodash';

// This is temporialy used for Rekit Studio development.
// In future plugins are dynamically loaded.

// For built in plugins, defined here, internal plugins could depend others easily
import '../features/plugin-default/entry';
import '../features/plugin-terminal/entry';
import '../features/plugin-scripts/entry';
import '../features/plugin-test/entry';
import '../features/plugin-rekit-react/entry';

// Use global variable to store module state for workaround of HMR.
export default {
  _plugins: null,
  getPlugins(prop) {
    if (!this._plugins) this._plugins = window.__REKIT_PLUGINS;
    if (!prop) return _.compact(this._plugins);
    return this._plugins.filter(_.property(prop));
  },
  addPlugin(p) {
    window.__REKIT_PLUGINS.push(p);
  },
  removePlugin(name) {
    _.remove(window.__REKIT_PLUGINS, { name });
  },
};
