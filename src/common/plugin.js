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
import '../features/plugin-typescript/entry';

// Use global variable to store module state for workaround of HMR.
export default {
  _handledInherit: false,
  _appliedPlugins: null,
  getPlugins(prop) {
    if (!this._appliedPlugins) {
      this._appliedPlugins = window.__REKIT_APPLIED_PLUGINS.reduce((p, c) => {
        p[c.name] = c;
        return p;
      }, {});
    }
    const applied = this._appliedPlugins;
    if (!this._handledInherit) {
      window.__REKIT_PLUGINS = window.__REKIT_PLUGINS.map(p => {
        if (!applied[p.name] || !applied[p.name].uiInherit) return p;

        const newPlugin = {
          uiInherit: applied[p.name].uiInherit, // for debug purpose only?
        };
        _.castArray(applied[p.name].uiInherit).forEach(pp => {
          pp = this.getPlugin(pp);
          _.merge(newPlugin, pp);
        });
        _.merge(newPlugin, p);
        return newPlugin;
      });
      this._handledInherit = true;
    }
    return window.__REKIT_PLUGINS.filter(
      p => (!prop || _.has(p, prop)) && applied[p.name],
    );
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
    return _.find(window.__REKIT_PLUGINS, { name });
  },
  invoke(prop, ...args) {
    if (!prop) throw new Error('Invoke on plugin should have prop argument');
    const arr = prop.split('.');
    arr.pop();
    const obj = arr.join('.');
    return this.getPlugins(prop).map(p=> {
      const method = _.get(p, prop);
      if (!_.isFunction(method)) return method;//throw new Error('Invoke should be called on function extension point: ' + p.name + '.' + prop);
      return method.apply(obj, args);
    });
  },

};
