import store from 'rs/common/store';

export default {
  getTab(urlPath) {
    const { elementById } = store.getState().home;

    if (!elementById) return null;

    if (urlPath.includes('deps-diagram')){
      return {
        name: 'Deps',
        key: 'deps-diagram',
        urlPath,
      }
    }

    return null;
  },
};
