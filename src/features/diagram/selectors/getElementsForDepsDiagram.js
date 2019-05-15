import _ from 'lodash';
import { createSelector } from 'reselect';

export default createSelector(
  a => a,
  elementById => {
    const byId = id => elementById[id];
    const ids = Object.values(elementById)
      .filter(ele => ele.deps)
      .map(ele => ele.id);

    // For grouped element, use it instead of its parts.
    Object.values(elementById)
      .filter(
        ele => ele.parts && ele.parts.some && ele.parts.some(pid => byId(pid) && byId(pid).deps),
      )
      .forEach(ele => {
        _.pullAll(ids, ele.parts);
        ids.push(ele.id);
      });
    return ids;
  },
);
