// Include a file to project's elementById, so that it could be displayed.
// Usually used for viewing a node_module file.
import axios from 'axios';
import {
  HOME_INCLUDE_FILE_BEGIN,
  HOME_INCLUDE_FILE_SUCCESS,
  HOME_INCLUDE_FILE_FAILURE,
  HOME_INCLUDE_FILE_DISMISS_ERROR,
} from './constants';

export function includeFile(file) {
  return (dispatch) => {
    dispatch({
      type: HOME_INCLUDE_FILE_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post('/api/include-file', { file });
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_INCLUDE_FILE_SUCCESS,
            data: { file },
          });
          resolve(res);
        },
        (err) => {
          dispatch({
            type: HOME_INCLUDE_FILE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissIncludeFileError() {
  return {
    type: HOME_INCLUDE_FILE_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_INCLUDE_FILE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        includeFilePending: true,
        includeFileError: null,
      };

    case HOME_INCLUDE_FILE_SUCCESS:
      // The request is success
      return {
        ...state,
        otherFiles: {
          ...state.otherFiles,
          [action.data.file]: true,
        },
        includeFilePending: false,
        includeFileError: null,
      };

    case HOME_INCLUDE_FILE_FAILURE:
      // The request is failed
      return {
        ...state,
        includeFilePending: false,
        includeFileError: action.data.error,
      };

    case HOME_INCLUDE_FILE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        includeFileError: null,
      };

    default:
      return state;
  }
}
