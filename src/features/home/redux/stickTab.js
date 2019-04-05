// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da
// import _ from 'lodash';
// import update from 'immutability-helper';
import { HOME_STICK_TAB } from './constants';
// import { getTabKey } from '../helpers';
// import { storage } from '../../common/utils';
import { tabByPathname } from '../utils';

export function stickTab(key) {
  if (!key) {
    key = tabByPathname().key;
  }
  return {
    type: HOME_STICK_TAB,
    data: { key },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_STICK_TAB: {
      if (state.tempTabKey === action.data.key) {
        return {
          ...state,
          tempTabKey: null,
        };
      }
      return state;
    }

    default:
      return state;
  }
}
