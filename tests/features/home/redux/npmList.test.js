import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_NPM_LIST_BEGIN,
  HOME_NPM_LIST_SUCCESS,
  HOME_NPM_LIST_FAILURE,
  HOME_NPM_LIST_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  npmList,
  dismissNpmListError,
  reducer,
} from '../../../../src/features/home/redux/npmList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/npmList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when npmList succeeds', () => {
    const store = mockStore({});

    return store.dispatch(npmList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_NPM_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_NPM_LIST_SUCCESS);
      });
  });

  it('dispatches failure action when npmList fails', () => {
    const store = mockStore({});

    return store.dispatch(npmList({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_NPM_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_NPM_LIST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissNpmListError', () => {
    const expectedAction = {
      type: HOME_NPM_LIST_DISMISS_ERROR,
    };
    expect(dismissNpmListError()).toEqual(expectedAction);
  });

  it('handles action type HOME_NPM_LIST_BEGIN correctly', () => {
    const prevState = { npmListPending: false };
    const state = reducer(
      prevState,
      { type: HOME_NPM_LIST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.npmListPending).toBe(true);
  });

  it('handles action type HOME_NPM_LIST_SUCCESS correctly', () => {
    const prevState = { npmListPending: true };
    const state = reducer(
      prevState,
      { type: HOME_NPM_LIST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.npmListPending).toBe(false);
  });

  it('handles action type HOME_NPM_LIST_FAILURE correctly', () => {
    const prevState = { npmListPending: true };
    const state = reducer(
      prevState,
      { type: HOME_NPM_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.npmListPending).toBe(false);
    expect(state.npmListError).toEqual(expect.anything());
  });

  it('handles action type HOME_NPM_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { npmListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_NPM_LIST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.npmListError).toBe(null);
  });
});

