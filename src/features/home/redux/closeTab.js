import _ from 'lodash';
import update from 'immutability-helper';
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

      // const toClose = { key: action.data.key };
      // const index1 = _.findIndex(state.openTabs, toClose);
      // const index2 = _.indexOf(state.historyTabs, toClose.key);

      // const newState = update(state, {
      //   openTabs: { $splice: [[index1, 1]] },
      //   historyTabs: { $splice: [[index2, 1]] },
      // });
      // storage.session.setItem('openTabs', newState.openTabs);
      // storage.session.setItem('historyTabs', newState.historyTabs);
      return { ...state, openPaths, historyPaths };
    }

    default:
      return state;
  }
}
