import {
  PTY_REMOVE_OUTPUT_FROM_STORE,
} from '../../../../src/features/pty/redux/constants';

import {
  removeOutputFromStore,
  reducer,
} from '../../../../src/features/pty/redux/removeOutputFromStore';

describe('pty/redux/removeOutputFromStore', () => {
  it('returns correct action by removeOutputFromStore', () => {
    expect(removeOutputFromStore()).toHaveProperty('type', PTY_REMOVE_OUTPUT_FROM_STORE);
  });

  it('handles action type PTY_REMOVE_OUTPUT_FROM_STORE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: PTY_REMOVE_OUTPUT_FROM_STORE }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
