import {
  HOME_REMOVE_FILE_CONTENT,
} from '../../../../src/features/home/redux/constants';

import {
  removeFileContent,
  reducer,
} from '../../../../src/features/home/redux/removeFileContent';

describe('home/redux/removeFileContent', () => {
  it('returns correct action by removeFileContent', () => {
    expect(removeFileContent()).toHaveProperty('type', HOME_REMOVE_FILE_CONTENT);
  });

  it('handles action type HOME_REMOVE_FILE_CONTENT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_REMOVE_FILE_CONTENT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
