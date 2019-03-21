import {
  PLUGIN_SCRIPTS_SET_CURRENT,
} from '../../../../src/features/plugin-scripts/redux/constants';

import {
  setCurrent,
  reducer,
} from '../../../../src/features/plugin-scripts/redux/setCurrent';

describe('plugin-scripts/redux/setCurrent', () => {
  it('returns correct action by setCurrent', () => {
    expect(setCurrent()).toHaveProperty('type', PLUGIN_SCRIPTS_SET_CURRENT);
  });

  it('handles action type PLUGIN_SCRIPTS_SET_CURRENT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: PLUGIN_SCRIPTS_SET_CURRENT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
