import _ from 'lodash';
import { storage } from '../../common/utils';
import { HOME_CLOSE_TAB } from './constants';

export function closeTab(tab) {
  return {
    type: HOME_CLOSE_TAB,
    data: { paths: [tab.urlPath, ...(tab.subTabs || []).map(t => t.urlPath)] },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_CLOSE_TAB: {
      const openPaths = state.openPaths.slice();
      const historyPaths = state.historyPaths.slice();
      _.pullAll(openPaths, action.data.paths);
      _.pullAll(historyPaths, action.data.paths);

      storage.session.setItem('openPaths', openPaths);
      storage.session.setItem('historyPaths', historyPaths);
      return { ...state, openPaths, historyPaths };
    }

    default:
      return state;
  }
}
