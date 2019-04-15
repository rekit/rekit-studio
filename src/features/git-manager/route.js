// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import { OverviewWidget } from './';

export default {
  path: 'git-manager',
  childRoutes: [
    { path: '/git/overview', component: OverviewWidget },
  ],
};
