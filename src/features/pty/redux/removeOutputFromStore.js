// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { PTY_REMOVE_OUTPUT_FROM_STORE } from './constants';

export function removeOutputFromStore(id) {
  return {
    type: PTY_REMOVE_OUTPUT_FROM_STORE,
    data: { id },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case PTY_REMOVE_OUTPUT_FROM_STORE:
      return {
        ...state,
        output: {
          ...state.output,
          [action.data.id]: [],
        },
      };

    default:
      return state;
  }
}
