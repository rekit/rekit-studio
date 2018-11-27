// This is the root reducer of the feature. It is used for:
//   1. Load reducers from each action in the feature and process them one by one.
//      Note that this part of code is mainly maintained by Rekit, you usually don't need to edit them.
//   2. Write cross-topic reducers. If a reducer is not bound to some specific action.
//      Then it could be written here.
// Learn more from the introduction of this approach:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da.

import initialState from './initialState';
import { reducer as runTaskReducer } from './runTask';
import { reducer as stopTaskReducer } from './stopTask';
import { reducer as clearOutputReducer } from './clearOutput';

const reducers = [runTaskReducer, stopTaskReducer, clearOutputReducer];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    case 'ON_SOCKET_MESSAGE':
      if (action.data.type === 'task-status') {
        const payload = action.data.payload;
        if (payload.type === 'exit') {
          newState = {
            ...state,
            running: {
              ...state.running,
              [payload.command]: false,
            },
          };
        }
        if (payload.type === 'output') {
          let arr = (state.output[payload.command] || []).slice();
          arr.push(payload.output);
          if (arr.length > 200) arr = arr.slice(-200);
          newState = {
            ...state,
            output: {
              ...state.output,
              [payload.command]: arr,
            },
          };
        }
      }
      break;
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
