import _ from 'lodash';
import axios from 'axios';
import {
  PLUGIN_TEST_RUN_TEST_BEGIN,
  PLUGIN_TEST_RUN_TEST_SUCCESS,
  PLUGIN_TEST_RUN_TEST_FAILURE,
  PLUGIN_TEST_RUN_TEST_DISMISS_ERROR,
} from './constants';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function runTest(tests = []) {
  return dispatch => {
    // optionally you can have getState as the second argument
    tests = _.castArray(tests);
    dispatch({
      type: PLUGIN_TEST_RUN_TEST_BEGIN,
      payload: { tests },
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
      const doRequest = axios.post('/api/run-test', { args: tests });
      doRequest.then(
        res => {
          dispatch({
            type: PLUGIN_TEST_RUN_TEST_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: PLUGIN_TEST_RUN_TEST_FAILURE,
            data: { error: err },
          });
          reject(err);
        }
      );
    });

    return promise;
  };
}

// Async action saves request error by default, this method is used to dismiss the error info.
// If you don't want errors to be saved in Redux store, just ignore this method.
export function dismissRunTestError() {
  return {
    type: PLUGIN_TEST_RUN_TEST_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case PLUGIN_TEST_RUN_TEST_BEGIN:
      // Just after a request is sent
      const testResult = { ...state.testResult };
      const tests = action.payload.tests.length > 0 ? action.payload.tests : state.testList;
      tests.forEach(test => {
        testResult[test] = {
          running: true,
        };
      });

      return {
        ...state,
        testResult,
        runTestPending: true,
        runTestError: null,
      };

    case PLUGIN_TEST_RUN_TEST_SUCCESS:
      // The request is success
      return {
        ...state,
        runTestPending: false,
        runTestError: null,
      };

    case PLUGIN_TEST_RUN_TEST_FAILURE:
      // The request is failed
      return {
        ...state,
        runTestPending: false,
        runTestError: action.data.error,
      };

    case PLUGIN_TEST_RUN_TEST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        runTestError: null,
      };

    default:
      return state;
  }
}
