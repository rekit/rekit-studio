import { GroupedDepsDiagramView } from './';

export default {
  path: 'diagram',
  name: 'Diagram',
  childRoutes: [
    { path: '/deps-diagram', component: GroupedDepsDiagramView },
  ],
};
