import {
  ElementPage,
  RoutesPage,
  Dashboard,
  WelcomePage,
  AllRoutesPage,
} from './';

export default {
  path: '',
  name: 'Home',
  childRoutes: [
    { name: 'Dashboard', component: Dashboard, isIndex: true },
    { path: '/welcome', name: 'Welcome page', component: WelcomePage },
    { path: '/all-routes', name: 'All Routes', component: AllRoutesPage },
    { path: '/element/:elementId/:view?', name: 'Element page', component: ElementPage },
    { path: '/:feature/routes/:type?', name: 'Routes page', component: RoutesPage },
  ],
};
