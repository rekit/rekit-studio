import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PLUGIN_SCRIPTS_STOP_SCRIPT_BEGIN,
  PLUGIN_SCRIPTS_STOP_SCRIPT_SUCCESS,
  PLUGIN_SCRIPTS_STOP_SCRIPT_FAILURE,
  PLUGIN_SCRIPTS_STOP_SCRIPT_DISMISS_ERROR,
} from './constants';
import axios from 'axios';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function stopScript(name) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: PLUGIN_SCRIPTS_STOP_SCRIPT_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
      const doRequest = axios.post('/api/stop-script', { name });
      doRequest.then(
        res => {
          dispatch({
            type: PLUGIN_SCRIPTS_STOP_SCRIPT_SUCCESS,
            data: { name },
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: PLUGIN_SCRIPTS_STOP_SCRIPT_FAILURE,
            data: { error: err },
          });
          reject(err);
        }
      );
    });

    return promise;
  };
}

export function useStopScript() {
  const dispatch = useDispatch();
  const running = useSelector(state => state.pluginScripts.running);
  const boundAction = useCallback((...args) => dispatch(stopScript(...args)), [dispatch]);
  return { running, stopScript: boundAction };
}

// Async action saves request error by default, this method is used to dismiss the error info.
// If you don't want errors to be saved in Redux store, just ignore this method.
export function dismissStopScriptError() {
  return {
    type: PLUGIN_SCRIPTS_STOP_SCRIPT_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case PLUGIN_SCRIPTS_STOP_SCRIPT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        stopScriptPending: true,
        stopScriptError: null,
      };

    case PLUGIN_SCRIPTS_STOP_SCRIPT_SUCCESS:
      // The request is success
      const running = state.running;
      delete running[action.data.name];
      return {
        ...state,
        stopScriptPending: false,
        stopScriptError: null,
        running: running,
      };

    case PLUGIN_SCRIPTS_STOP_SCRIPT_FAILURE:
      // The request is failed
      return {
        ...state,
        stopScriptPending: false,
        stopScriptError: action.data.error,
      };

    case PLUGIN_SCRIPTS_STOP_SCRIPT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        stopScriptError: null,
      };

    default:
      return state;
  }
}
