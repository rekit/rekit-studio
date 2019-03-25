import { RoutesView } from './';
// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

export default {
  path: 'plugin-rekit-react',
  childRoutes: [{ path: '/routes/:feature', component: RoutesView }],
};
