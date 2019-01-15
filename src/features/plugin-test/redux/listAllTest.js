// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da
import _ from 'lodash';
import { PLUGIN_TEST_LIST_ALL_TEST } from './constants';

export function listAllTest(elementById) {
  return {
    type: PLUGIN_TEST_LIST_ALL_TEST,
    payload: { elementById },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case PLUGIN_TEST_LIST_ALL_TEST: {
      const elementById = action.payload.elementById;

      return {
        ...state,
        testList: Object.values(elementById)
          .filter(ele => {
            return /\.(test|spec)\.(j|t)sx?$/.test(ele.id) && ele.type === 'file';
          })
          .map(ele => ele.id)
          .sort((a, b) => a.localeCompare(b)),
      };
    }
    default:
      return state;
  }
}
