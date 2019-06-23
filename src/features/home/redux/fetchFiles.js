import axios from 'axios';
import {
  HOME_FETCH_FILES_BEGIN,
  HOME_FETCH_FILES_SUCCESS,
  HOME_FETCH_FILES_FAILURE,
  HOME_FETCH_FILES_DISMISS_ERROR,
} from './constants';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function fetchFiles(files) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: HOME_FETCH_FILES_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
      const doRequest = axios.post('/api/read-files', { files });
      doRequest.then(
        res => {
          dispatch({
            type: HOME_FETCH_FILES_SUCCESS,
            data: res.data,
          });
          resolve(res.data);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: HOME_FETCH_FILES_FAILURE,
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
export function dismissFetchFilesError() {
  return {
    type: HOME_FETCH_FILES_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FETCH_FILES_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchFilesPending: true,
        fetchFilesError: null,
      };

    case HOME_FETCH_FILES_SUCCESS: {
      const fileContentNeedReload = { ...state.fileContentNeedReload };
      const fileContentById = {...state.fileContentById};
      action.data.forEach(item => {
        delete fileContentNeedReload[item.file];
        fileContentById[item.file] = item.content;
      });

      return {
        ...state,
        fileContentById,
        fileContentNeedReload,
        fetchFileContentPending: false,
        fetchFileContentError: null,
      };
    }
    case HOME_FETCH_FILES_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchFilesPending: false,
        fetchFilesError: action.data.error,
      };

    case HOME_FETCH_FILES_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchFilesError: null,
      };

    default:
      return state;
  }
}
