// This is the root reducer of the feature. It is used for:
//   1. Load reducers from each action in the feature and process them one by one.
//      Note that this part of code is mainly maintained by Rekit, you usually don't need to edit them.
//   2. Write cross-topic reducers. If a reducer is not bound to some specific action.
//      Then it could be written here.
// Learn more from the introduction of this approach:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da.

import initialState from './initialState';
import { reducer as listAllTestReducer } from './listAllTest';
import { reducer as clearTestListReducer } from './clearTestList';
import { reducer as removeTestFromListReducer } from './removeTestFromList';
import { reducer as runTestReducer } from './runTest';
import { reducer as selectTestReducer } from './selectTest';

const reducers = [
  listAllTestReducer,
  clearTestListReducer,
  removeTestFromListReducer,
  runTestReducer,
  selectTestReducer,
];

export default function reducer(state = initialState, action) {
  let newState = state;
  switch (action.type) {
    // Handle cross-topic actions here
    case 'ON_SOCKET_MESSAGE':
      if (action.data.type === 'run-test-status') {
        const payload = action.data.payload;
        if (payload.type === 'exit') {
          if (payload.data) {
            const testResult = { ...state.testResult };
            payload.data.testResults.forEach(res => {
              const id = res.name.replace(payload.projectRoot, '').replace(/^\/+/, '');
              testResult[id] = res;
            });
            newState = {
              ...state,
              testResult,
            };
          }
        }
      }

      break;
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
