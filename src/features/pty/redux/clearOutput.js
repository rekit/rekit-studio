import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PTY_CLEAR_OUTPUT } from './constants';

export function clearOutput(id) {
  return {
    type: PTY_CLEAR_OUTPUT,
    data: { id },
  };
}

export function useClearOutput() {
  const dispatch = useDispatch();
  const output = useSelector(state => state.pty.output);
  const boundAction = useCallback((...args) => dispatch(clearOutput(...args)), [dispatch]);
  return { output, clearOutput: boundAction };
}

export function reducer(state, action) {
  switch (action.type) {
    case PTY_CLEAR_OUTPUT: {
      return {
        ...state,
        output: {
          ...state.output,
          // when output is null, terminal will clear its content too, this is different from removeOutputFromStore
          [action.data.id]: null,
        },
      };
    }

    default:
      return state;
  }
}
