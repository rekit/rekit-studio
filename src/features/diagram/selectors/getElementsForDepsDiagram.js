import { createSelector } from 'reselect';

export default createSelector(
  a => a,
  elementById => {
    const byId = id => elementById[id];
    return Object.values(elementById)
      .filter(
        ele =>
          ele.deps ||
          (ele.parts && ele.parts.some && ele.parts.some(pid => byId(pid) && byId(pid).deps)),
      )
      .map(ele => ele.id);
  },
);
