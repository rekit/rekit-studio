// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { PLUGIN_TEST_SELECT_TEST } from './constants';

export function selectTest(test) {
  return {
    type: PLUGIN_TEST_SELECT_TEST,
    payload: { test },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case PLUGIN_TEST_SELECT_TEST:
      return {
        ...state,
        currentTest: action.payload.test,
      };

    default:
      return state;
  }
}
