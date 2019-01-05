// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  PLUGIN_TEST_CLEAR_TEST_LIST,
} from './constants';

export function clearTestList() {
  return {
    type: PLUGIN_TEST_CLEAR_TEST_LIST,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case PLUGIN_TEST_CLEAR_TEST_LIST:
      return {
        ...state,
        testList: [],
        testResult: {},
      };

    default:
      return state;
  }
}
