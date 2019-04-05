// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  HOME_SET_TEMP_TAB,
} from './constants';

export function setTempTab(tabKey) {
  return {
    type: HOME_SET_TEMP_TAB,
    data: {tabKey},
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_SET_TEMP_TAB:
      return {
        ...state,
        tempTabKey: action.data.tabKey,
      };

    default:
      return state;
  }
}
