import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_INCLUDE_FILE_BEGIN,
  HOME_INCLUDE_FILE_SUCCESS,
  HOME_INCLUDE_FILE_FAILURE,
  HOME_INCLUDE_FILE_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  includeFile,
  dismissIncludeFileError,
  reducer,
} from '../../../../src/features/home/redux/includeFile';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/includeFile', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when includeFile succeeds', () => {
    const store = mockStore({});

    return store.dispatch(includeFile())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_INCLUDE_FILE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_INCLUDE_FILE_SUCCESS);
      });
  });

  it('dispatches failure action when includeFile fails', () => {
    const store = mockStore({});

    return store.dispatch(includeFile({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_INCLUDE_FILE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_INCLUDE_FILE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissIncludeFileError', () => {
    const expectedAction = {
      type: HOME_INCLUDE_FILE_DISMISS_ERROR,
    };
    expect(dismissIncludeFileError()).toEqual(expectedAction);
  });

  it('handles action type HOME_INCLUDE_FILE_BEGIN correctly', () => {
    const prevState = { includeFilePending: false };
    const state = reducer(
      prevState,
      { type: HOME_INCLUDE_FILE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.includeFilePending).toBe(true);
  });

  it('handles action type HOME_INCLUDE_FILE_SUCCESS correctly', () => {
    const prevState = { includeFilePending: true };
    const state = reducer(
      prevState,
      { type: HOME_INCLUDE_FILE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.includeFilePending).toBe(false);
  });

  it('handles action type HOME_INCLUDE_FILE_FAILURE correctly', () => {
    const prevState = { includeFilePending: true };
    const state = reducer(
      prevState,
      { type: HOME_INCLUDE_FILE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.includeFilePending).toBe(false);
    expect(state.includeFileError).toEqual(expect.anything());
  });

  it('handles action type HOME_INCLUDE_FILE_DISMISS_ERROR correctly', () => {
    const prevState = { includeFileError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_INCLUDE_FILE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.includeFileError).toBe(null);
  });
});

