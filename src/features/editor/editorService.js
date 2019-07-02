import store from '../../common/store';
import element from '../../common/element';

export default {
  doOpenEditor: function(editor, input) {
    const state = store.getState().home;
    const byId = id => store.getState().home.elementById[id];
    console.log('open editor: ', input);
    const { path, scheme } = input.resource;
    console.log(path, scheme);
    if (!path || scheme !== 'file') return;
    const eleId = path.replace(state.projectData.projectRoot, '');
    element.show(eleId, null, input.options.selection);
  },
  openerService: {
    open(...args) {
      console.log('open: ', args);
    },
  },
};
