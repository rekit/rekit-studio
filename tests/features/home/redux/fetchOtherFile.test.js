import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_FETCH_OTHER_FILE_BEGIN,
  HOME_FETCH_OTHER_FILE_SUCCESS,
  HOME_FETCH_OTHER_FILE_FAILURE,
  HOME_FETCH_OTHER_FILE_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  fetchOtherFile,
  dismissFetchOtherFileError,
  reducer,
} from '../../../../src/features/home/redux/fetchOtherFile';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/fetchOtherFile', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchOtherFile succeeds', () => {
    const store = mockStore({});

    return store.dispatch(fetchOtherFile())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FETCH_OTHER_FILE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FETCH_OTHER_FILE_SUCCESS);
      });
  });

  it('dispatches failure action when fetchOtherFile fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchOtherFile({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FETCH_OTHER_FILE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FETCH_OTHER_FILE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchOtherFileError', () => {
    const expectedAction = {
      type: HOME_FETCH_OTHER_FILE_DISMISS_ERROR,
    };
    expect(dismissFetchOtherFileError()).toEqual(expectedAction);
  });

  it('handles action type HOME_FETCH_OTHER_FILE_BEGIN correctly', () => {
    const prevState = { fetchOtherFilePending: false };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_OTHER_FILE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchOtherFilePending).toBe(true);
  });

  it('handles action type HOME_FETCH_OTHER_FILE_SUCCESS correctly', () => {
    const prevState = { fetchOtherFilePending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_OTHER_FILE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchOtherFilePending).toBe(false);
  });

  it('handles action type HOME_FETCH_OTHER_FILE_FAILURE correctly', () => {
    const prevState = { fetchOtherFilePending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_OTHER_FILE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchOtherFilePending).toBe(false);
    expect(state.fetchOtherFileError).toEqual(expect.anything());
  });

  it('handles action type HOME_FETCH_OTHER_FILE_DISMISS_ERROR correctly', () => {
    const prevState = { fetchOtherFileError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_OTHER_FILE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchOtherFileError).toBe(null);
  });
});

