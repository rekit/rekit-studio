const rpc = require('@sourcegraph/vscode-ws-jsonrpc');
const server = require('@sourcegraph/vscode-ws-jsonrpc/lib/server');
const lsp = require('vscode-languageserver');

function launch(socket) {
  const { WebSocketMessageReader, WebSocketMessageWriter } = rpc;
  const reader = new WebSocketMessageReader(socket);
  const writer = new WebSocketMessageWriter(socket);
  const tsServerPath = require.resolve('javascript-typescript-langserver/lib/language-server-stdio.js');
  const socketConnection = server.createConnection(reader, writer, () => socket.dispose());
  const serverConnection = server.createServerProcess('typescript', 'node', [tsServerPath]);
  server.forward(socketConnection, serverConnection, message => {
    if (rpc.isRequestMessage(message)) {
      if (message.method === lsp.InitializeRequest.type.method) {
        message.params.rootUri = `file://${rekit.core.paths.getProjectRoot()}`;
        // message.rootUri = '/Users/pwang7/rekit-org/my-ts';
        const initializeParams = message.params;
        initializeParams.processId = process.pid;
      }
    }
    return message;
  });
}

function config(server, app, ss) {
  app.ws('/lsp-socket/typescript', (ws, req) => {
    const socket = {
      send: content => {
        ws.send(content, error => {
          if (error) {
            throw error;
          }
        });
      },
      onMessage: cb => ws.on('message', cb),
      onError: cb => ws.on('error', cb),
      onClose: cb => ws.on('close', cb),
      dispose: () => ws.close(),
    };
    // launch the server when the web socket is opened
    if (ws.readyState === ws.OPEN) {
      launch(socket);
    } else {
      ws.on('open', () => launch(socket));
    }
  });
};

module.exports = { config };
