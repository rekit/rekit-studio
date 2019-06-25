const rpc = require('@sourcegraph/vscode-ws-jsonrpc');
const server = require('@sourcegraph/vscode-ws-jsonrpc/lib/server');
const lsp = require('vscode-languageserver');
// const ws = require('ws');
// const url = require('url');

function launch(socket) {
  const { WebSocketMessageReader, WebSocketMessageWriter } = rpc;
  const reader = new WebSocketMessageReader(socket);
  const writer = new WebSocketMessageWriter(socket);
  const tsserverPath = require.resolve('typescript/lib/tsserver.js');
  const socketConnection = server.createConnection(reader, writer, () => socket.dispose());
  const serverConnection = server.createServerProcess('TypeScript', 'node', [tsserverPath, '--logFile','/Users/pwang7/ts.log']);
  server.forward(socketConnection, serverConnection, message => {
    if (rpc.isRequestMessage(message)) {
      if (message.method === lsp.InitializeRequest.type.method) {
        const initializeParams = message.params;
        initializeParams.processId = process.pid;
      }
    }
    return message;
  });
}

module.exports = function setupLsp(server, app, ss) {
  app.ws('/monaco-lsp-socket', (ws, req) => {
    const socket = {
      send: content =>{
        ws.send(content, error => {
          if (error) {
            throw error;
          }
        });
      },
      onMessage: cb => ws.on('message', msg => {
        console.log('msg:');
        console.log(msg);
        return cb(msg);
      }),
      // onError: cb => ws.on('error', msg => {
      //   console.log('error:');
      //   console.log(msg);
      //   return cb(msg);
      // }),
      // onError: cb => ws.on('error', msg => {
      //   consocb),
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

  // const wss = new ws.Server({
  //   noServer: true,
  //   perMessageDeflate: false,
  // });
  // ss.on('upgrade', (request, socket, head) => {console.log('upgrade');
  //   const pathname = request.url ? url.parse(request.url).pathname : undefined;
  //   if (pathname === '/monaco-lsp-socket') {
  //     wss.handleUpgrade(request, socket, head, webSocket => {
  //       const socket = {
  //         send: content =>
  //           webSocket.send(content, error => {
  //             if (error) {
  //               throw error;
  //             }
  //           }),
  //         onMessage: cb =>
  //           webSocket.on('message', msg => {
  //             console.log(msg);
  //             cb(msg);
  //           }),
  //         onError: cb => webSocket.on('error', cb),
  //         onClose: cb => webSocket.on('close', cb),
  //         dispose: () => webSocket.close(),
  //       };
  //       // launch the server when the web socket is opened
  //       if (webSocket.readyState === webSocket.OPEN) {
  //         launch(socket);
  //       } else {
  //         webSocket.on('open', () => launch(socket));
  //       }
  //     });
  //   }
  // });
};
