// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da
import _ from 'lodash';
import { storage } from '../../common/utils';
import { HOME_REMOVE_PATHS } from './constants';

export function removePaths(paths) {
  if (!paths.length) return;
  return {
    type: HOME_REMOVE_PATHS,
    data: { paths },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_REMOVE_PATHS: {
      const newOpenPaths = state.openPaths.slice();
      _.pullAll(newOpenPaths, action.data.paths);
      const newHistoryPaths = _.intersection(state.historyPaths, newOpenPaths);
      storage.session.setItem('openPaths', newOpenPaths);
      storage.session.setItem('historyPaths', newHistoryPaths);

      return {
        ...state,
        openPaths: newOpenPaths,
        historyPaths: newHistoryPaths,
      };
    }

    default:
      return state;
  }
}
