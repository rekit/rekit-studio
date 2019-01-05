// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  PLUGIN_TEST_REMOVE_TEST_FROM_LIST,
} from './constants';

export function removeTestFromList() {
  return {
    type: PLUGIN_TEST_REMOVE_TEST_FROM_LIST,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case PLUGIN_TEST_REMOVE_TEST_FROM_LIST:
      return {
        ...state,
      };

    default:
      return state;
  }
}
