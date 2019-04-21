// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import { PtyOutput } from './';

export default {
  path: 'pty',
  childRoutes: [{ path: '/pty-output', name: 'Web terminal', component: PtyOutput }],
};
