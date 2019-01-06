// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da
import _ from 'lodash';
import { PLUGIN_TEST_REMOVE_TEST_FROM_LIST } from './constants';

export function removeTestFromList(test) {
  return {
    type: PLUGIN_TEST_REMOVE_TEST_FROM_LIST,
    payload: { test },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case PLUGIN_TEST_REMOVE_TEST_FROM_LIST:
      const tests = _.without(state.testList, action.payload.test);
      let current = state.currentTest;
      if (state.currentTest === action.payload.test) {
        current = tests.length ? tests[0] : null;
      }
      return {
        ...state,
        testList: tests,
        currentTest: current,
      };

    default:
      return state;
  }
}
