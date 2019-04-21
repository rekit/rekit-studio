// This is the root reducer of the feature. It is used for:
//   1. Load reducers from each action in the feature and process them one by one.
//      Note that this part of code is mainly maintained by Rekit, you usually don't need to edit them.
//   2. Write cross-topic reducers. If a reducer is not bound to some specific action.
//      Then it could be written here.
// Learn more from the introduction of this approach:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da.

import initialState from './initialState';
import { reducer as clearOutputReducer } from './clearOutput';
import { reducer as npmListReducer } from './npmList';

const reducers = [clearOutputReducer, npmListReducer];
const MAX_OUTPUT_LINES = 1000;
export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    case 'PLUGIN_PTY_OUTPUT': {
      const output = { ...state.output };
      const { id } = action.data;
      let newOutput = [...(output[id] || []), ...action.data.output];
      if (newOutput.length >= MAX_OUTPUT_LINES) newOutput = newOutput.slice(-MAX_OUTPUT_LINES);
      newState = {
        ...state,
        output: {
          ...state.output,
          [id]: newOutput,
        },
      };
      break;
    }
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
