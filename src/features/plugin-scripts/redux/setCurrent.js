// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import { PLUGIN_SCRIPTS_SET_CURRENT } from './constants';

export function setCurrent(name) {
  return {
    type: PLUGIN_SCRIPTS_SET_CURRENT,
    data: { current: name },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case PLUGIN_SCRIPTS_SET_CURRENT:
      return {
        ...state,
        current: action.data.current,
      };

    default:
      return state;
  }
}
