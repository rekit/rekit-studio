import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PLUGIN_SCRIPTS_SET_CURRENT } from './constants';

export function setCurrent(name) {
  return {
    type: PLUGIN_SCRIPTS_SET_CURRENT,
    data: { current: name },
  };
}
export function useSetCurrent() {
  const dispatch = useDispatch();
  const current = useSelector(state => state.pluginScripts.current);
  const boundAction = useCallback((...args) => dispatch(setCurrent(...args)), [dispatch]);
  return { current, setCurrent: boundAction };
}
export function reducer(state, action) {
  switch (action.type) {
    case PLUGIN_SCRIPTS_SET_CURRENT:
      return {
        ...state,
        current: action.data.current,
      };

    default:
      return state;
  }
}
