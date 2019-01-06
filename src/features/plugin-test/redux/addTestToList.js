// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da
import _ from 'lodash';
import { PLUGIN_TEST_ADD_TEST_TO_LIST } from './constants';

export function addTestToList(tests) {
  tests = _.castArray(tests);

  return {
    type: PLUGIN_TEST_ADD_TEST_TO_LIST,
    payload: { tests },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case PLUGIN_TEST_ADD_TEST_TO_LIST:
      return {
        ...state,
        testList: _.uniq(action.payload.tests.concat(state.testList)),
      };

    default:
      return state;
  }
}
