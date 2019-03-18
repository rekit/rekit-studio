// This file is for UI build
import * as ui from './ui';
import route from './route';
import reducer from './redux/reducer';

const toExport = {
  ...ui,
  route,
  reducer,
  name: 'rekit-react',
};

window.__REKIT_PLUGINS.push(toExport);
