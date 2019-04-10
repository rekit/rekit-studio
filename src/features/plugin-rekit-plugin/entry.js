// This file is for UI build
import * as ui from './ui';
import route from './route';
import reducer from './redux/reducer';
import './style.less';

const toExport = {
  ...ui,
  route,
  reducer,
  name: 'rekit-plugin-ui',
  appType: 'rekit-plugin',
  uiInherit: 'rekit-react-ui',
};

window.__REKIT_PLUGINS.push(toExport);
