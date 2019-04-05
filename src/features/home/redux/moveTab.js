import _ from 'lodash';
import { storage } from '../../common/utils';
import { HOME_MOVE_TAB } from './constants';

const getPaths = tab => _.uniq([tab.urlPath, ...(tab.subTabs || []).map(t => t.urlPath)]);

export function moveTab(sourceTab, destTab, leftToRight) {
  // When move a tab, it means move all paths belong to the tab
  // to the destination tab's first sub path.
  return {
    type: HOME_MOVE_TAB,
    data: {
      sourcePaths: getPaths(sourceTab),
      destPaths: getPaths(destTab),
      leftToRight,
    },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_MOVE_TAB: {
      let { sourcePaths, destPaths, leftToRight } = action.data;
      sourcePaths = _.intersection(sourcePaths, state.openPaths);
      destPaths = _.intersection(destPaths, state.openPaths);
      const newOpenPaths = state.openPaths.slice();
      _.pullAll(newOpenPaths, sourcePaths);
      let insertTo = _.findIndex(newOpenPaths, p => destPaths.indexOf(p) >= 0);
      if (leftToRight) insertTo += 1;
      newOpenPaths.splice(insertTo, 0, ...sourcePaths);
      storage.session.setItem('openPaths', newOpenPaths);
      return {
        ...state,
        openPaths: newOpenPaths,
      };
    }

    default:
      return state;
  }
}
