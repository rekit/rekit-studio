import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_FETCH_FILES_BEGIN,
  HOME_FETCH_FILES_SUCCESS,
  HOME_FETCH_FILES_FAILURE,
  HOME_FETCH_FILES_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  fetchFiles,
  dismissFetchFilesError,
  reducer,
} from '../../../../src/features/home/redux/fetchFiles';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/fetchFiles', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchFiles succeeds', () => {
    const store = mockStore({});

    return store.dispatch(fetchFiles())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FETCH_FILES_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FETCH_FILES_SUCCESS);
      });
  });

  it('dispatches failure action when fetchFiles fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchFiles({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FETCH_FILES_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FETCH_FILES_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchFilesError', () => {
    const expectedAction = {
      type: HOME_FETCH_FILES_DISMISS_ERROR,
    };
    expect(dismissFetchFilesError()).toEqual(expectedAction);
  });

  it('handles action type HOME_FETCH_FILES_BEGIN correctly', () => {
    const prevState = { fetchFilesPending: false };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_FILES_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchFilesPending).toBe(true);
  });

  it('handles action type HOME_FETCH_FILES_SUCCESS correctly', () => {
    const prevState = { fetchFilesPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_FILES_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchFilesPending).toBe(false);
  });

  it('handles action type HOME_FETCH_FILES_FAILURE correctly', () => {
    const prevState = { fetchFilesPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_FILES_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchFilesPending).toBe(false);
    expect(state.fetchFilesError).toEqual(expect.anything());
  });

  it('handles action type HOME_FETCH_FILES_DISMISS_ERROR correctly', () => {
    const prevState = { fetchFilesError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_FILES_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchFilesError).toBe(null);
  });
});

