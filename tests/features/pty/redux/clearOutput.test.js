import {
  PTY_CLEAR_OUTPUT,
} from '../../../../src/features/pty/redux/constants';

import {
  clearOutput,
  reducer,
} from '../../../../src/features/pty/redux/clearOutput';

describe('pty/redux/clearOutput', () => {
  it('returns correct action by clearOutput', () => {
    expect(clearOutput()).toHaveProperty('type', PTY_CLEAR_OUTPUT);
  });

  it('handles action type PTY_CLEAR_OUTPUT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: PTY_CLEAR_OUTPUT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
