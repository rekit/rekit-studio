import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  PLUGIN_SCRIPTS_RUN_SCRIPT_BEGIN,
  PLUGIN_SCRIPTS_RUN_SCRIPT_SUCCESS,
  PLUGIN_SCRIPTS_RUN_SCRIPT_FAILURE,
  PLUGIN_SCRIPTS_RUN_SCRIPT_DISMISS_ERROR,
} from '../../../../src/features/plugin-scripts/redux/constants';

import {
  runScript,
  dismissRunScriptError,
  reducer,
} from '../../../../src/features/plugin-scripts/redux/runScript';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('plugin-scripts/redux/runScript', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when runScript succeeds', () => {
    const store = mockStore({});

    return store.dispatch(runScript())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', PLUGIN_SCRIPTS_RUN_SCRIPT_BEGIN);
        expect(actions[1]).toHaveProperty('type', PLUGIN_SCRIPTS_RUN_SCRIPT_SUCCESS);
      });
  });

  it('dispatches failure action when runScript fails', () => {
    const store = mockStore({});

    return store.dispatch(runScript({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', PLUGIN_SCRIPTS_RUN_SCRIPT_BEGIN);
        expect(actions[1]).toHaveProperty('type', PLUGIN_SCRIPTS_RUN_SCRIPT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissRunScriptError', () => {
    const expectedAction = {
      type: PLUGIN_SCRIPTS_RUN_SCRIPT_DISMISS_ERROR,
    };
    expect(dismissRunScriptError()).toEqual(expectedAction);
  });

  it('handles action type PLUGIN_SCRIPTS_RUN_SCRIPT_BEGIN correctly', () => {
    const prevState = { runScriptPending: false };
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_RUN_SCRIPT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.runScriptPending).toBe(true);
  });

  it('handles action type PLUGIN_SCRIPTS_RUN_SCRIPT_SUCCESS correctly', () => {
    const prevState = { runScriptPending: true };
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_RUN_SCRIPT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.runScriptPending).toBe(false);
  });

  it('handles action type PLUGIN_SCRIPTS_RUN_SCRIPT_FAILURE correctly', () => {
    const prevState = { runScriptPending: true };
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_RUN_SCRIPT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.runScriptPending).toBe(false);
    expect(state.runScriptError).toEqual(expect.anything());
  });

  it('handles action type PLUGIN_SCRIPTS_RUN_SCRIPT_DISMISS_ERROR correctly', () => {
    const prevState = { runScriptError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_RUN_SCRIPT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.runScriptError).toBe(null);
  });
});

