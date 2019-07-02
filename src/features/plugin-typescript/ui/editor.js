import axios from 'axios';

export default {
  configMonaco(monaco) {
    monaco.languages.registerLinkProvider('typescript', {
      provideLinks(model, tokens) {
        console.log('provide links:');
      }
    });
  },

  lsp: {
    name: 'typescript',
    documentSelector: ['typescript', 'javascript'],
    socketPath: 'typescript',
  }
};
