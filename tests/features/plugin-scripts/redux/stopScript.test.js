import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  PLUGIN_SCRIPTS_STOP_SCRIPT_BEGIN,
  PLUGIN_SCRIPTS_STOP_SCRIPT_SUCCESS,
  PLUGIN_SCRIPTS_STOP_SCRIPT_FAILURE,
  PLUGIN_SCRIPTS_STOP_SCRIPT_DISMISS_ERROR,
} from '../../../../src/features/plugin-scripts/redux/constants';

import {
  stopScript,
  dismissStopScriptError,
  reducer,
} from '../../../../src/features/plugin-scripts/redux/stopScript';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('plugin-scripts/redux/stopScript', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when stopScript succeeds', () => {
    const store = mockStore({});

    return store.dispatch(stopScript())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', PLUGIN_SCRIPTS_STOP_SCRIPT_BEGIN);
        expect(actions[1]).toHaveProperty('type', PLUGIN_SCRIPTS_STOP_SCRIPT_SUCCESS);
      });
  });

  it('dispatches failure action when stopScript fails', () => {
    const store = mockStore({});

    return store.dispatch(stopScript({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', PLUGIN_SCRIPTS_STOP_SCRIPT_BEGIN);
        expect(actions[1]).toHaveProperty('type', PLUGIN_SCRIPTS_STOP_SCRIPT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissStopScriptError', () => {
    const expectedAction = {
      type: PLUGIN_SCRIPTS_STOP_SCRIPT_DISMISS_ERROR,
    };
    expect(dismissStopScriptError()).toEqual(expectedAction);
  });

  it('handles action type PLUGIN_SCRIPTS_STOP_SCRIPT_BEGIN correctly', () => {
    const prevState = { stopScriptPending: false };
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_STOP_SCRIPT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.stopScriptPending).toBe(true);
  });

  it('handles action type PLUGIN_SCRIPTS_STOP_SCRIPT_SUCCESS correctly', () => {
    const prevState = { stopScriptPending: true };
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_STOP_SCRIPT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.stopScriptPending).toBe(false);
  });

  it('handles action type PLUGIN_SCRIPTS_STOP_SCRIPT_FAILURE correctly', () => {
    const prevState = { stopScriptPending: true };
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_STOP_SCRIPT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.stopScriptPending).toBe(false);
    expect(state.stopScriptError).toEqual(expect.anything());
  });

  it('handles action type PLUGIN_SCRIPTS_STOP_SCRIPT_DISMISS_ERROR correctly', () => {
    const prevState = { stopScriptError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_STOP_SCRIPT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.stopScriptError).toBe(null);
  });
});

