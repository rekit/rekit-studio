import axios from 'axios';

export default {
  configMonaco(monaco) {
    monaco.languages.registerLinkProvider('typescript', {
      provideLinks(model, tokens) {}
    });
  },

  lsp: {
    name: 'typescript',
    documentSelector: ['typescript', 'javascript'],
    socketPath: 'typescript',
  }
};
