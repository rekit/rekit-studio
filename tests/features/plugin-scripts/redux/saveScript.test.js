import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  PLUGIN_SCRIPTS_SAVE_SCRIPT_BEGIN,
  PLUGIN_SCRIPTS_SAVE_SCRIPT_SUCCESS,
  PLUGIN_SCRIPTS_SAVE_SCRIPT_FAILURE,
  PLUGIN_SCRIPTS_SAVE_SCRIPT_DISMISS_ERROR,
} from '../../../../src/features/plugin-scripts/redux/constants';

import {
  saveScript,
  dismissSaveScriptError,
  reducer,
} from '../../../../src/features/plugin-scripts/redux/saveScript';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('plugin-scripts/redux/saveScript', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when saveScript succeeds', () => {
    const store = mockStore({});

    return store.dispatch(saveScript())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', PLUGIN_SCRIPTS_SAVE_SCRIPT_BEGIN);
        expect(actions[1]).toHaveProperty('type', PLUGIN_SCRIPTS_SAVE_SCRIPT_SUCCESS);
      });
  });

  it('dispatches failure action when saveScript fails', () => {
    const store = mockStore({});

    return store.dispatch(saveScript({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', PLUGIN_SCRIPTS_SAVE_SCRIPT_BEGIN);
        expect(actions[1]).toHaveProperty('type', PLUGIN_SCRIPTS_SAVE_SCRIPT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissSaveScriptError', () => {
    const expectedAction = {
      type: PLUGIN_SCRIPTS_SAVE_SCRIPT_DISMISS_ERROR,
    };
    expect(dismissSaveScriptError()).toEqual(expectedAction);
  });

  it('handles action type PLUGIN_SCRIPTS_SAVE_SCRIPT_BEGIN correctly', () => {
    const prevState = { saveScriptPending: false };
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_SAVE_SCRIPT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.saveScriptPending).toBe(true);
  });

  it('handles action type PLUGIN_SCRIPTS_SAVE_SCRIPT_SUCCESS correctly', () => {
    const prevState = { saveScriptPending: true };
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_SAVE_SCRIPT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.saveScriptPending).toBe(false);
  });

  it('handles action type PLUGIN_SCRIPTS_SAVE_SCRIPT_FAILURE correctly', () => {
    const prevState = { saveScriptPending: true };
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_SAVE_SCRIPT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.saveScriptPending).toBe(false);
    expect(state.saveScriptError).toEqual(expect.anything());
  });

  it('handles action type PLUGIN_SCRIPTS_SAVE_SCRIPT_DISMISS_ERROR correctly', () => {
    const prevState = { saveScriptError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_SAVE_SCRIPT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.saveScriptError).toBe(null);
  });
});

