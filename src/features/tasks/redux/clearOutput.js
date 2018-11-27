// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  TASKS_CLEAR_OUTPUT,
} from './constants';

export function clearOutput() {
  return {
    type: TASKS_CLEAR_OUTPUT,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case TASKS_CLEAR_OUTPUT:
      return {
        ...state,
      };

    default:
      return state;
  }
}
