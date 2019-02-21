// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {
  DefaultPage2,
} from './';

export default {
  path: 'tasks',
  name: 'Tasks',
  childRoutes: [
    { path: 'default-page-2', name: 'Default page', component: DefaultPage2, isIndex: true },
  ],
};
