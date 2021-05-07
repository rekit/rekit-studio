import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import { Modal } from 'antd';
import axios from 'axios';
import Root from './Root';
import routeConfig from './common/routeConfig';
import store from './common/store';
import './styles/index.less';

axios.defaults.headers.common['Authorization'] = window.__REKIT_TOKEN;

if (process.env.NODE_ENV !== 'test') {
  const location = document.location;
  let protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
  const portStr = location.port ? ':' + location.port : '';
  const socketURL = `${protocol}${location.hostname}${portStr}/rekit-studio-socket`;

  const ws = new WebSocket(socketURL);
  ws.onopen = () => {
    console.log('[Rekit Studio] socket connected.');
  };

  ws.onmessage = msg => {
    const data = JSON.parse(msg.data);
    switch (data.type) {
      case 'output':
        store.dispatch({
          type: 'REKIT_STUDIO_OUTPUT',
          data: data.payload,
        });
        break;
      case 'fileChanged':
      case 'configChanged':
        store.dispatch({
          type: 'PROJECT_DATA_CHANGED',
          data: data.payload,
        });
        break;
      case 'reduxAction':
        store.dispatch(data.payload);
        break;
      default:
        store.dispatch({
          type: 'ON_SOCKET_MESSAGE',
          data,
        });
        break;
    }
  };

  ws.onclose = () => {
    console.log('[Rekit Studio] socket closed.');
  };
  ws.onerror = evt => {
    console.log(evt);
    Modal.warn({
      title: 'Socket Failed',
      content:
        "IDE failed to connect web socket to the backend service. Some features of the IDE will NOT work properly. It's usually caused by proxy settings, please turn off your proxy or by pass socket connection. Then refresh the page",
    });
    console.error('[Rekit Studio] socket failed.');
  };
}

let root = document.getElementById('react-root');
if (!root) {
  root = document.createElement('div');
  root.id = 'react-root';
  document.body.appendChild(root);
}

function renderApp(app) {
  render(<AppContainer>{app}</AppContainer>, root);
}

// Force js execution after style loaded
window.onload = () => renderApp(<Root store={store.getStore()} routeConfig={routeConfig()} />);

// if (module.hot) {
//   module.hot.accept('./common/routeConfig', () => {
//     const nextRouteConfig = require('./common/routeConfig').default; // eslint-disable-line
//     renderApp(<Root store={store.getStore()} routeConfig={nextRouteConfig()} />);
//   });
// }
