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
  _handledInherit: false,
  _inheritedPlugins: [],
  getPlugins(prop) {
    if (!this._handledInherit) {
      window.__REKIT_PLUGINS = window.__REKIT_PLUGINS.map(p => {
        if (p.uiInherit) {
          const newPlugin = {
            __uiInherit: p.uiInherit,
          };
          _.castArray(p.uiInherit).forEach(pp=> {
            _.merge(newPlugin, pp);
            this._inheritedPlugins.push(pp);
          });
          _.merge(newPlugin, p);
          delete p.uiInherit;
          return newPlugin;
        }
        return p;
      });
      this._handledInherit = true;
    }
    if (!this._plugins) this._plugins = window.__REKIT_PLUGINS;
    if (!prop) return _.compact(this._plugins);
    return this._plugins.filter(_.property(prop));
  },
  addPlugin(p) {
    if (this._handledInherit) throw new Error('Should not add a plugin after getPlugins called.');
    window.__REKIT_PLUGINS.push(p);
  },
  getPlugin(name) {
    return _.find([window.__REKIT_PLUGINS].concat(this._inheritedPlugins), { name });
  },
  removePlugin(name) {
    _.remove(window.__REKIT_PLUGINS, { name });
  },
};
