import { DepsOverviewDiagramView } from './';

export default {
  path: 'diagram',
  name: 'Diagram',
  childRoutes: [
    { path: '/deps-diagram', component: DepsOverviewDiagramView },
  ],
};
