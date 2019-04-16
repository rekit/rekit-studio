import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  GIT_MANAGER_FETCH_GIT_STATUS_BEGIN,
  GIT_MANAGER_FETCH_GIT_STATUS_SUCCESS,
  GIT_MANAGER_FETCH_GIT_STATUS_FAILURE,
  GIT_MANAGER_FETCH_GIT_STATUS_DISMISS_ERROR,
} from '../../../../src/features/git-manager/redux/constants';

import {
  fetchGitStatus,
  dismissFetchGitStatusError,
  reducer,
} from '../../../../src/features/git-manager/redux/fetchGitStatus';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('git-manager/redux/fetchGitStatus', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchGitStatus succeeds', () => {
    const store = mockStore({});

    return store.dispatch(fetchGitStatus())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', GIT_MANAGER_FETCH_GIT_STATUS_BEGIN);
        expect(actions[1]).toHaveProperty('type', GIT_MANAGER_FETCH_GIT_STATUS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchGitStatus fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchGitStatus({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', GIT_MANAGER_FETCH_GIT_STATUS_BEGIN);
        expect(actions[1]).toHaveProperty('type', GIT_MANAGER_FETCH_GIT_STATUS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchGitStatusError', () => {
    const expectedAction = {
      type: GIT_MANAGER_FETCH_GIT_STATUS_DISMISS_ERROR,
    };
    expect(dismissFetchGitStatusError()).toEqual(expectedAction);
  });

  it('handles action type GIT_MANAGER_FETCH_GIT_STATUS_BEGIN correctly', () => {
    const prevState = { fetchGitStatusPending: false };
    const state = reducer(
      prevState,
      { type: GIT_MANAGER_FETCH_GIT_STATUS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchGitStatusPending).toBe(true);
  });

  it('handles action type GIT_MANAGER_FETCH_GIT_STATUS_SUCCESS correctly', () => {
    const prevState = { fetchGitStatusPending: true };
    const state = reducer(
      prevState,
      { type: GIT_MANAGER_FETCH_GIT_STATUS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchGitStatusPending).toBe(false);
  });

  it('handles action type GIT_MANAGER_FETCH_GIT_STATUS_FAILURE correctly', () => {
    const prevState = { fetchGitStatusPending: true };
    const state = reducer(
      prevState,
      { type: GIT_MANAGER_FETCH_GIT_STATUS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchGitStatusPending).toBe(false);
    expect(state.fetchGitStatusError).toEqual(expect.anything());
  });

  it('handles action type GIT_MANAGER_FETCH_GIT_STATUS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchGitStatusError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: GIT_MANAGER_FETCH_GIT_STATUS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchGitStatusError).toBe(null);
  });
});

