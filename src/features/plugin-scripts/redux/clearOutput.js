// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  PLUGIN_SCRIPTS_CLEAR_OUTPUT,
} from './constants';

export function clearOutput(name) {
  return {
    type: PLUGIN_SCRIPTS_CLEAR_OUTPUT,
    data: { name },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case PLUGIN_SCRIPTS_CLEAR_OUTPUT:
      return {
        ...state,
        output: {
          ...state.output,
          [action.data.name]: null,
        },
      };

    default:
      return state;
  }
}
