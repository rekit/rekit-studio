// This is the root reducer of the feature. It is used for:
//   1. Load reducers from each action in the feature and process them one by one.
//      Note that this part of code is mainly maintained by Rekit, you usually don't need to edit them.
//   2. Write cross-topic reducers. If a reducer is not bound to some specific action.
//      Then it could be written here.
// Learn more from the introduction of this approach:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da.

import initialState from './initialState';
import { reducer as setOutlineWidthReducer } from './setOutlineWidth';
import { reducer as codeChangeReducer } from './codeChange';
import { reducer as doSyncReducer } from './doSync';
import { CORE_EXEC_CORE_COMMAND_SUCCESS } from '../../core/redux/constants';
import store from '../../../common/store';
import modelManager from '../modelManager';
import editorStateMap from '../editorStateMap';
import element from '../../../common/element';

const reducers = [setOutlineWidthReducer, codeChangeReducer, doSyncReducer];

function cleanEditorState(data) {
  if (['remove', 'move'].includes(data.args.commandName)) {
    // when delete elements, clean editor state and models
    const idsToRemove = element.getChildrenRecursively(data.targetElement);
    const elementById = store.getState().home.elementById;
    idsToRemove.forEach(id => {
      const ele = elementById[id];
      if (ele && ele.type === 'file') {
        delete editorStateMap[ele.id];
        const model = modelManager.getModel(id, '', true);
        if (model && model.dispose) {
          console.log('dispose model: ', id);
          model.dispose();
        }
      }
    });
  }
}
export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    case CORE_EXEC_CORE_COMMAND_SUCCESS: {
      // after delete content, should remove edit models for the element.
      console.log('exe cmd success action: ', action);
      setTimeout(() => cleanEditorState(action.data), 50);
      newState = state;
      break;
    }
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
