import axios from 'axios';

export default {
  configMonaco(monaco) {
    // monaco.languages.registerLinkProvider('typescript', {
    //   provideLinks(model, token) {
    //     window.gModel = model;
    //     console.log('provide links:', model, token );
    //   }
    // });
  },

  lsp: {
    name: 'typescript',
    documentSelector: ['typescript', 'javascript'],
    socketPath: 'typescript',
  }
};
