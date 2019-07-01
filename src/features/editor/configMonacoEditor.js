import _ from 'lodash';
import plugin from '../../common/plugin';
import setupSyntaxWorker from './setupSyntaxWorker';
// import setupLinter from './setupLinter';
import { listen } from '@sourcegraph/vscode-ws-jsonrpc';
import {
  MonacoLanguageClient,
  CloseAction,
  ErrorAction,
  MonacoServices,
  createConnection,
} from 'monaco-languageclient';
import normalizeUrl from 'normalize-url';
const ReconnectingWebSocket = require('reconnecting-websocket').default;

// Config Monaco Editor to support JSX and ESLint
function configureMonacoEditor(editor, monaco) {
  // console.log('editor: ', editor);
  setTimeout(() => {
    MonacoServices.install(editor);
    const lsps = plugin.invoke('editor.lsp');
    lsps.forEach(item => {
      const url = createUrl(`/lsp-socket/${item.socketPath}`);
      const webSocket = createWebSocket(url);
      // listen when the web socket is opened
      listen({
        webSocket,
        onConnection: connection => {
          console.log('start client');
          // create and start the language client
          const languageClient = createLanguageClient(connection, item);
          const disposable = languageClient.start();
          connection.onClose(() => disposable.dispose());
        },
      });
    });
  }, 100);
  plugin.getPlugins('editor.config').forEach(p => p.editor.config(editor, monaco));
  setupSyntaxWorker(editor, monaco);
  // setupLinter(editor, monaco);
}

function createLanguageClient(connection, {name, documentSelector}) {
  // const documentSelector = _.flatten(plugin.invoke('editor.lsp.documentSelector'));
  return new MonacoLanguageClient({
    name,
    clientOptions: {
      // use a language id as a document selector
      documentSelector, //['typescript'],
      // disable the default error handler
      errorHandler: {
        error: () => ErrorAction.Continue,
        closed: () => CloseAction.DoNotRestart,
      },
    },
    // create a language client connection from the JSON RPC connection on demand
    connectionProvider: {
      get: (errorHandler, closeHandler) => {
        return Promise.resolve(createConnection(connection, errorHandler, closeHandler));
      },
    },
  });
}

function createUrl(path) {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return normalizeUrl(`${protocol}://${window.location.host}${path}`);
}

function createWebSocket(url) {
  const socketOptions = {
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1000,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 10000,
    maxRetries: Infinity,
    debug: false,
  };
  // return new WebSocket(url);
  return new ReconnectingWebSocket(url, undefined, socketOptions);
}

export default configureMonacoEditor;
