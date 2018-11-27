import {
  TASKS_STOP_TASK_BEGIN,
  TASKS_STOP_TASK_SUCCESS,
  TASKS_STOP_TASK_FAILURE,
  TASKS_STOP_TASK_DISMISS_ERROR,
} from './constants';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function stopTask(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: TASKS_STOP_TASK_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
      const doRequest = args.error ? Promise.reject(new Error()) : Promise.resolve();
      doRequest.then(
        (res) => {
          dispatch({
            type: TASKS_STOP_TASK_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: TASKS_STOP_TASK_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

// Async action saves request error by default, this method is used to dismiss the error info.
// If you don't want errors to be saved in Redux store, just ignore this method.
export function dismissStopTaskError() {
  return {
    type: TASKS_STOP_TASK_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case TASKS_STOP_TASK_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        stopTaskPending: true,
        stopTaskError: null,
      };

    case TASKS_STOP_TASK_SUCCESS:
      // The request is success
      return {
        ...state,
        stopTaskPending: false,
        stopTaskError: null,
      };

    case TASKS_STOP_TASK_FAILURE:
      // The request is failed
      return {
        ...state,
        stopTaskPending: false,
        stopTaskError: action.data.error,
      };

    case TASKS_STOP_TASK_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        stopTaskError: null,
      };

    default:
      return state;
  }
}
