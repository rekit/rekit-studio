import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ${asyncActionTypes.begin},
  ${asyncActionTypes.success},
  ${asyncActionTypes.failure},
  ${asyncActionTypes.dismissError},
} from '../../../../src/features/${ele.feature}/redux/constants';

import {
  ${ele.name},
  dismiss${_.pascalCase(ele.name)}Error,
  reducer,
} from '../../../../src/features/${ele.feature}/redux/${ele.name}';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('${ele.feature}/redux/${ele.name}', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when ${ele.name} succeeds', () => {
    const store = mockStore({});

    return store.dispatch(${ele.name}())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ${asyncActionTypes.begin});
        expect(actions[1]).toHaveProperty('type', ${asyncActionTypes.success});
      });
  });

  it('dispatches failure action when ${ele.name} fails', () => {
    const store = mockStore({});

    return store.dispatch(${ele.name}({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ${asyncActionTypes.begin});
        expect(actions[1]).toHaveProperty('type', ${asyncActionTypes.failure});
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismiss${_.pascalCase(ele.name)}Error', () => {
    const expectedAction = {
      type: ${asyncActionTypes.dismissError},
    };
    expect(dismiss${_.pascalCase(ele.name)}Error()).toEqual(expectedAction);
  });

  it('handles action type ${asyncActionTypes.begin} correctly', () => {
    const prevState = { ${ele.name}Pending: false };
    const state = reducer(
      prevState,
      { type: ${asyncActionTypes.begin} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.${ele.name}Pending).toBe(true);
  });

  it('handles action type ${asyncActionTypes.success} correctly', () => {
    const prevState = { ${ele.name}Pending: true };
    const state = reducer(
      prevState,
      { type: ${asyncActionTypes.success}, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.${ele.name}Pending).toBe(false);
  });

  it('handles action type ${asyncActionTypes.failure} correctly', () => {
    const prevState = { ${ele.name}Pending: true };
    const state = reducer(
      prevState,
      { type: ${asyncActionTypes.failure}, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.${ele.name}Pending).toBe(false);
    expect(state.${ele.name}Error).toEqual(expect.anything());
  });

  it('handles action type ${asyncActionTypes.dismissError} correctly', () => {
    const prevState = { ${ele.name}Error: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ${asyncActionTypes.dismissError} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.${ele.name}Error).toBe(null);
  });
});

