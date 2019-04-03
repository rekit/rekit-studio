import _ from 'lodash';
import { matchPath } from 'react-router-dom';

export default {
  getTab(urlPath, homeState = {}) {
    const { elementById } = homeState;

    if (!elementById) return null;

    let match;
    // Find build page
    match = matchPath(urlPath, {
      path: '/tools/build',
      exact: true,
    });
    if (match) {
      return {
        name: 'Build',
        key: '#build',
      };
    }

    return null;
  },
};
