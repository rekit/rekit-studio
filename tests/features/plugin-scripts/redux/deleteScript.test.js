import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  PLUGIN_SCRIPTS_DELETE_SCRIPT_BEGIN,
  PLUGIN_SCRIPTS_DELETE_SCRIPT_SUCCESS,
  PLUGIN_SCRIPTS_DELETE_SCRIPT_FAILURE,
  PLUGIN_SCRIPTS_DELETE_SCRIPT_DISMISS_ERROR,
} from '../../../../src/features/plugin-scripts/redux/constants';

import {
  deleteScript,
  dismissDeleteScriptError,
  reducer,
} from '../../../../src/features/plugin-scripts/redux/deleteScript';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('plugin-scripts/redux/deleteScript', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteScript succeeds', () => {
    const store = mockStore({});

    return store.dispatch(deleteScript())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', PLUGIN_SCRIPTS_DELETE_SCRIPT_BEGIN);
        expect(actions[1]).toHaveProperty('type', PLUGIN_SCRIPTS_DELETE_SCRIPT_SUCCESS);
      });
  });

  it('dispatches failure action when deleteScript fails', () => {
    const store = mockStore({});

    return store.dispatch(deleteScript({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', PLUGIN_SCRIPTS_DELETE_SCRIPT_BEGIN);
        expect(actions[1]).toHaveProperty('type', PLUGIN_SCRIPTS_DELETE_SCRIPT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteScriptError', () => {
    const expectedAction = {
      type: PLUGIN_SCRIPTS_DELETE_SCRIPT_DISMISS_ERROR,
    };
    expect(dismissDeleteScriptError()).toEqual(expectedAction);
  });

  it('handles action type PLUGIN_SCRIPTS_DELETE_SCRIPT_BEGIN correctly', () => {
    const prevState = { deleteScriptPending: false };
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_DELETE_SCRIPT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteScriptPending).toBe(true);
  });

  it('handles action type PLUGIN_SCRIPTS_DELETE_SCRIPT_SUCCESS correctly', () => {
    const prevState = { deleteScriptPending: true };
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_DELETE_SCRIPT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteScriptPending).toBe(false);
  });

  it('handles action type PLUGIN_SCRIPTS_DELETE_SCRIPT_FAILURE correctly', () => {
    const prevState = { deleteScriptPending: true };
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_DELETE_SCRIPT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteScriptPending).toBe(false);
    expect(state.deleteScriptError).toEqual(expect.anything());
  });

  it('handles action type PLUGIN_SCRIPTS_DELETE_SCRIPT_DISMISS_ERROR correctly', () => {
    const prevState = { deleteScriptError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_DELETE_SCRIPT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteScriptError).toBe(null);
  });
});

