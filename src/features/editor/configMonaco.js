import plugin from '../../common/plugin';

// Config Monaco Editor to support JSX and ESLint
function configureMonaco(monaco) {
  window.monaco = monaco;
  monaco.languages.register({
    id: 'javascript',
    extensions: ['.js', '.es6', '.jsx'],
    firstLine: '^#!.*\\bnode',
    filenames: ['jakefile'],
    aliases: ['JavaScript', 'javascript', 'js'],
    mimetypes: ['text/javascript'],
  });
  monaco.languages.register({
    id: 'typescript',
    extensions: ['.ts', '.tsx'],
    aliases: ['TypeScript', 'ts', 'typescript'],
    mimetypes: ['text/typescript'],
    loader: function () { return import('./languages/typescript.js'); }
  });
  // const compilerDefaults = {
  // jsxFactory: 'React.createElement',
  // reactNamespace: 'React',
  // jsx: monaco.languages.typescript.JsxEmit.React,
  // target: monaco.languages.typescript.ScriptTarget.ES2016,
  // allowNonTsExtensions: true,
  // moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  // experimentalDecorators: true,
  // noEmit: true,
  // allowJs: true,
  // typeRoots: ['node_modules/@types']
  // };

  // monaco.languages.typescript.javascriptDefaults.setCompilerOptions({ noLib: true, allowNonTsExtensions: true });

  // monaco.languages.typescript.typescriptDefaults.setMaximumWorkerIdleTime(-1);
  // monaco.languages.typescript.javascriptDefaults.setMaximumWorkerIdleTime(-1);
  // monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
  //   compilerDefaults
  // );
  // monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
  //   compilerDefaults
  // );

  // monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  // monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

  // monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  //   noSemanticValidation: true,
  //   noSyntaxValidation: true
  // });
  // monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  //   noSemanticValidation: true,
  //   noSyntaxValidation: true
  // });

  // monaco.languages.typescript.typescriptDefaults.addExtraLib(content, "")

  plugin.getPlugins('editor.configMonaco').forEach(p => p.editor.configMonaco(monaco));
}

export default configureMonaco;
