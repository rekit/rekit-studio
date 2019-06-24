import plugin from '../../common/plugin';
import setupSyntaxWorker from './setupSyntaxWorker';
// import setupLinter from './setupLinter';
// import { listen, MessageConnection } from 'vscode-ws-jsonrpc';
import {
  MonacoLanguageClient,
  CloseAction,
  ErrorAction,
  MonacoServices,
  createConnection,
} from 'monaco-languageclient';
import normalizeUrl from 'normalize-url';
const ReconnectingWebSocket = require('reconnecting-websocket');

// Config Monaco Editor to support JSX and ESLint
function configureMonacoEditor(editor, monaco) {
  MonacoServices.install(editor);
  const url = createUrl('/sampleServer');
  const webSocket = createWebSocket(url);
  // listen when the web socket is opened
  webSocket.onopen = connection => {
    console.log('LSP socket connected.');
    const languageClient = createLanguageClient(connection);
    const disposable = languageClient.start();
    connection.onClose(() => disposable.dispose());
  };
  // listen({
  //   webSocket,
  //   onConnection: connection => {
  //     // create and start the language client
  //     const languageClient = createLanguageClient(connection);
  //     const disposable = languageClient.start();
  //     connection.onClose(() => disposable.dispose());
  //   },
  // });
  plugin.getPlugins('editor.config').forEach(p => p.editor.config(editor, monaco));
  setupSyntaxWorker(editor, monaco);
  // setupLinter(editor, monaco);
}

function createLanguageClient(connection) {
  return new MonacoLanguageClient({
    name: 'Sample Language Client',
    clientOptions: {
      // use a language id as a document selector
      documentSelector: ['json'],
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
  return normalizeUrl(`${protocol}://${window.location.host}${window.location.pathname}${path}`);
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
  return new ReconnectingWebSocket(url, undefined, socketOptions);
}

export default configureMonacoEditor;
