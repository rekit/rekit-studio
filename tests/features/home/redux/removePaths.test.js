import {
  HOME_REMOVE_PATHS,
} from '../../../../src/features/home/redux/constants';

import {
  removePaths,
  reducer,
} from '../../../../src/features/home/redux/removePaths';

describe('home/redux/removePaths', () => {
  it('returns correct action by removePaths', () => {
    expect(removePaths()).toHaveProperty('type', HOME_REMOVE_PATHS);
  });

  it('handles action type HOME_REMOVE_PATHS correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_REMOVE_PATHS }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
