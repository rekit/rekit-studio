// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da
import _ from 'lodash';
import { PLUGIN_TEST_LIST_ALL_TEST } from './constants';

export function listAllTest(elements) {
  return {
    type: PLUGIN_TEST_LIST_ALL_TEST,
    payload: { elements },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case PLUGIN_TEST_LIST_ALL_TEST: {
      return {
        ...state,
        testList: action.payload.elements
          .filter(ele => ele.parts && _.find(ele.views, { key: 'test' }))
          .map(ele => _.find(ele.views, { key: 'test' }).target)
          .sort((a, b) => a.localeCompare(b)),
      };
    }
    default:
      return state;
  }
}
