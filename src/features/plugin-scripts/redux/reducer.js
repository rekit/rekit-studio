// This is the root reducer of the feature. It is used for:
//   1. Load reducers from each action in the feature and process them one by one.
//      Note that this part of code is mainly maintained by Rekit, you usually don't need to edit them.
//   2. Write cross-topic reducers. If a reducer is not bound to some specific action.
//      Then it could be written here.
// Learn more from the introduction of this approach:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da.

import initialState from './initialState';
import Convert from 'ansi-to-html';
import { reducer as runScriptReducer } from './runScript';
import { reducer as stopScriptReducer } from './stopScript';
import { reducer as clearOutputReducer } from './clearOutput';
import { reducer as setCurrentReducer } from './setCurrent';

const reducers = [runScriptReducer, stopScriptReducer, clearOutputReducer, setCurrentReducer];

const convert = new Convert();

export default function reducer(state = initialState, action) {
  let newState = state;
  switch (action.type) {
    // Handle cross-topic actions here
    case 'HOME_FETCH_PROJECT_DATA_SUCCESS':
      if (action.data.pluginScripts) {
        let scripts = action.data.pluginScripts.scripts || {};
        scripts = Object.keys(scripts).map(k => ({ name: k, script: scripts[k] }));
        newState = {
          ...state,
          running: action.data.pluginScripts.running,
          scripts,
        };
      }
      break;

    case 'ON_SOCKET_MESSAGE':
      if (action.data.type === 'script-status') {
        const payload = action.data.payload;
        if (payload.type === 'exit') {
          newState = {
            ...state,
            running: {
              ...state.running,
              [payload.name]: false,
            },
          };
        }
        if (payload.type === 'output') {
          let arr = (state.output[payload.name] || []).slice();
          arr.push.apply(
            arr,
            payload.output.split(/[\r\n]+/).map(text =>
              convert
                .toHtml(
                  text
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/ /g, '&nbsp;'),
                )
                .replace('#00A', '#1565C0')
                .replace(/color:#555/g, 'color:#777'),
            ),
          );
          if (arr.length > 200) arr = arr.slice(-200);
          newState = {
            ...state,
            output: {
              ...state.output,
              [payload.name]: arr,
            },
          };
        }
      } else {
        newState = state;
      }

      break;

    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
