import {
  ${actionType},
} from '../../../../src/features/${ele.feature}/redux/constants';

import {
  ${ele.name},
  reducer,
} from '../../../../src/features/${ele.feature}/redux/${ele.name}';

describe('${ele.feature}/redux/${ele.name}', () => {
  it('returns correct action by ${ele.name}', () => {
    expect(${ele.name}()).toHaveProperty('type', ${actionType});
  });

  it('handles action type ${actionType} correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: ${actionType} }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
