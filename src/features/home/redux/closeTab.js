import _ from 'lodash';
import { storage } from '../../common/utils';
import { HOME_CLOSE_TAB } from './constants';

export function closeTab(tab) {
  const all = [tab, ...(tab.subTabs || [])];
  return {
    type: HOME_CLOSE_TAB,
    data: { paths: all.map(t => t.urlPath), files: all.map(t => t.key) },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_CLOSE_TAB: {
      const openPaths = state.openPaths.slice();
      const historyPaths = state.historyPaths.slice();
      _.pullAll(openPaths, action.data.paths);
      _.pullAll(historyPaths, action.data.paths);

      const fileContentById = { ...state.fileContentById };
      action.data.files.forEach(f => {
        if (fileContentById[f]) delete fileContentById[f];
      });

      storage.session.setItem('openPaths', openPaths);
      storage.session.setItem('historyPaths', historyPaths);
      return { ...state, fileContentById, openPaths, historyPaths };
    }

    default:
      return state;
  }
}
