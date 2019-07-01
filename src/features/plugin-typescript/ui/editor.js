import axios from 'axios';

export default {
  configMonaco(monaco) {
    // axios.get('/api/types').then(res => {
    //   console.log('res data: ', res.data);
    //   res.data.forEach(({ file, content }) => {
    //     monaco.languages.typescript.typescriptDefaults.addExtraLib(content, file);
    //   });
    // });
  },

  lsp: {
    name: 'typescript',
    documentSelector: ['typescript', 'javascript'],
    socketPath: 'typescript',
  }
};
