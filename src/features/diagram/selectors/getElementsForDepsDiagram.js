import { createSelector } from 'reselect';

export default createSelector(
  a => a,
  elementById => {
    return Object.values(elementById)
      .filter(ele => ele.deps)
      .map(ele => ele.id);
  },
);
