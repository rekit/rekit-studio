import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { HOME_REMOVE_FILE_CONTENT } from './constants';
import { CORE_EXEC_CORE_COMMAND_SUCCESS } from '../../core/redux/constants';

export function removeFileContent(ids) {
  return {
    type: HOME_REMOVE_FILE_CONTENT,
    data: _.castArray(ids),
  };
}

export function useRemoveFileContent() {
  const dispatch = useDispatch();
  const boundAction = useCallback((...params) => dispatch(removeFileContent(...params)), [
    dispatch,
  ]);
  return { removeFileContent: boundAction };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_REMOVE_FILE_CONTENT:
      const fileContentById = { ...state.fileContentById };
      action.data.forEach(id => delete fileContentById[id]);
      return {
        ...state,
        fileContentById,
      };

    default:
      return state;
  }
}
