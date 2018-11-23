import {
  PLUGIN_SCRIPTS_CLEAR_OUTPUT,
} from '../../../../src/features/plugin-scripts/redux/constants';

import {
  clearOutput,
  reducer,
} from '../../../../src/features/plugin-scripts/redux/clearOutput';

describe('plugin-scripts/redux/clearOutput', () => {
  it('returns correct action by clearOutput', () => {
    expect(clearOutput()).toHaveProperty('type', PLUGIN_SCRIPTS_CLEAR_OUTPUT);
  });

  it('handles action type PLUGIN_SCRIPTS_CLEAR_OUTPUT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_CLEAR_OUTPUT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
