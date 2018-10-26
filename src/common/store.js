import configStore from './configStore';

export default {
  store: null,
  getStore() {
    if (!this.store) this.store = configStore();
    return this.store;
  },
  getState() {
    return this.getStore().getState();
  },
  dispatch(action) {
    return this.getStore().dispatch(action);
  },
  subscribe(listener) {
    return this.getStore().subscribe(listener);
  },
  replaceReducer(reducer) {
    return this.getStore().replaceReducer(reducer);
  }
};
