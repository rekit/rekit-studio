import * as ui from './ui';
import route from './route';
import reducer from './redux/reducer';

window.__REKIT_PLUGINS.push({ ...ui, route, reducer, name: 'ebay-node' });
