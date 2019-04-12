import _ from 'lodash';

// This is temporialy used for Rekit Studio development.
// In future plugins are dynamically loaded.

// For built in plugins, defined here, internal plugins could depend on others easily
import '../features/plugin-default/entry';
import '../features/plugin-terminal/entry';
import '../features/plugin-scripts/entry';
import '../features/plugin-test/entry';
import '../features/plugin-rekit-react/entry';
import '../features/plugin-rekit-plugin/entry';

// Use global variable to store module state for workaround of HMR.
export default {
  _plugins: null,
  _handledInherit: false,
  _removedPlugins: [],
  getPlugins(prop) {
    if (!this._handledInherit) {
      window.__REKIT_PLUGINS = window.__REKIT_PLUGINS.map(p => {
        if (p.uiInherit) {
          const newPlugin = {
            __uiInherit: p.uiInherit,
          };
          _.castArray(p.uiInherit).forEach(pp => {
            pp = this.getPlugin(pp);
            _.merge(newPlugin, pp);
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
    if (_.find(window.__REKIT_PLUGINS, { name: p.name })) {
      console.warn('Failed to add plugin: duplicated name: ', p.name);
      return;
    }
    if (this._handledInherit) throw new Error('Should not add a plugin after getPlugins called.');
    window.__REKIT_PLUGINS.push(p);
  },
  getPlugin(name) {
    return _.find([...window.__REKIT_PLUGINS, ...this._removedPlugins], { name });
  },
  removePlugin(name) {
    const p = this.getPlugin(name);
    if (!_.find(this._removedPlugins, { name })) this._removedPlugins.push(p);
    _.remove(window.__REKIT_PLUGINS, { name });
  },
};
