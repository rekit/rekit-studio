import _ from 'lodash';
import store from '../../common/store';

// Use absFilePath as the uri so that LSP could use it.
const absFilePath = filePath => {
  const prjRoot = store.getState().home.projectData.projectRoot;
  if (filePath.startsWith(prjRoot)) return filePath;
  return prjRoot + filePath;
};

const getUri = _.memoize(file => monaco.Uri.file(file));
const modelManager = {
  getModel(filePath, content, noCreate) {
    const absPath = absFilePath(filePath);
    if (!window.monaco) return null;
    const uri = getUri(absPath);
    let model = monaco.editor.getModel(uri);
    if (!model && !noCreate) {
      const { fileContentById } = store.getState().home;
      model = monaco.editor.createModel(content || fileContentById[filePath] || '', null, uri);
      // TODO: respect tabSize option in .prettierrc
      model.updateOptions({ tabSize: 2 });
    }
    return model;
  },
  reset(filePath) {
    // Set the model content to initial values
    if (!filePath) return;
    const { fileContentById } = store.getState().home;
    const model = this.getModel(filePath, null, true);
    if (model && model.getValue() !== fileContentById[filePath])
      model.setValue(fileContentById[filePath] || '');
  },
  setValue(filePath, content) {
    filePath = absFilePath(filePath);
    const model = this.getModel(filePath, null, true);
    if (model && model.getValue() !== content) model.setValue(content);
  },
  getValue(filePath) {
    filePath = absFilePath(filePath);
    const model = this.getModel(filePath);
    if (model) return model.getValue();
    return null;
  },
  hasModel(filePath) {
    filePath = absFilePath(filePath);
    return !!this.getModel(filePath, null, true);
  },
  isChanged(filePath) {
    const { fileContentById } = store.getState().home;
    return (
      filePath &&
      _.has(fileContentById, filePath) &&
      this.hasModel(filePath) &&
      fileContentById[filePath] !== this.getValue(filePath)
    );
  },
};

export default modelManager;
