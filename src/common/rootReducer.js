// This file is auto maintained by Rekit, you usually don't need to edit it manually.

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import _ from 'lodash';
import plugin from './plugin';
import history from './history';
import homeReducer from '../features/home/redux/reducer';
import commonReducer from '../features/common/redux/reducer';
import diagramReducer from '../features/diagram/redux/reducer';
import configReducer from '../features/config/redux/reducer';
import editorReducer from '../features/editor/redux/reducer';
import coreReducer from '../features/core/redux/reducer';
import gitManagerReducer from '../features/git-manager/redux/reducer';
import ptyReducer from '../features/pty/redux/reducer';

// NOTE 1: DO NOT CHANGE the 'reducerMap' name and the declaration pattern.
// This is used for Rekit cmds to register new features, remove features, etc.

// NOTE 2: always use the camel case of the feature folder name as the store branch name
// So that it's easy for others to understand it and Rekit could manage theme.

const reducerMap = {
  router: connectRouter(history),
  home: homeReducer,
  common: commonReducer,
  diagram: diagramReducer,
  config: configReducer,
  editor: editorReducer,
  core: coreReducer,
  gitManager: gitManagerReducer,
  pty: ptyReducer,
};

export default () => {
  plugin.getPlugins('reducer').forEach(p => {
    const k = _.camelCase(`plugin-${p.name}`);
    if (!reducerMap[k]) {
      reducerMap[k] = p.reducer;
    } else {
      console.error('Duplicated reducer key for plugin: ', p.name);
    }
  });

  return combineReducers(reducerMap);
};
