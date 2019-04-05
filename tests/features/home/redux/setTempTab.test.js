import {
  HOME_SET_TEMP_TAB,
} from '../../../../src/features/home/redux/constants';

import {
  setTempTab,
  reducer,
} from '../../../../src/features/home/redux/setTempTab';

describe('home/redux/setTempTab', () => {
  it('returns correct action by setTempTab', () => {
    expect(setTempTab()).toHaveProperty('type', HOME_SET_TEMP_TAB);
  });

  it('handles action type HOME_SET_TEMP_TAB correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_SET_TEMP_TAB }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
