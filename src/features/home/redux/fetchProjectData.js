import _ from 'lodash';
import axios from 'axios';
import {
  HOME_FETCH_PROJECT_DATA_BEGIN,
  HOME_FETCH_PROJECT_DATA_SUCCESS,
  HOME_FETCH_PROJECT_DATA_FAILURE,
  HOME_FETCH_PROJECT_DATA_DISMISS_ERROR,
} from './constants';
import plugin from '../../../common/plugin';

function sortChildren(c1, c2, elementById) {
  // Virtual first if no order specified
  const normalEles = { file: true, folder: true };
  const byId = id => elementById[id];
  c1 = byId(c1);
  c2 = byId(c2);
  if (c1.order !== c2.order) {
    if (c1.hasOwnProperty('order') && c2.hasOwnProperty('order')) return c1.order - c2.order;
    if (c1.hasOwnProperty('order')) return -1;
    if (c2.hasOwnProperty('order')) return 1;
  } else if (c1.type !== c2.type) {
    if (!normalEles[c1.type] && !normalEles[c2.type]) return c1.type.localeCompare(c2.type);
    if (!normalEles[c1.type]) return -1;
    if (!normalEles[c2.type]) return 1;
    if (c1.type === 'folder') return -1; // folder first
    return 1;
  }
  return c1.name.toLowerCase().localeCompare(c2.name.toLowerCase());
}

export function fetchProjectData(args = {}) {
  return dispatch => {
    dispatch({
      type: HOME_FETCH_PROJECT_DATA_BEGIN,
      force: args.force,
    });

    return new Promise((resolve, reject) => {
      axios.get(`/api/project-data${args.force ? '?force=true' : ''}`).then(
        res => {
          const prjData = res.data;
          plugin.getPlugins('app.processProjectData').forEach(p => {
            p.app.processProjectData(prjData);
          });

          // Default sort of elements
          const { elements, elementById } = prjData;
          Object.values(elementById).forEach(ele => {
            if (ele && ele.children) {
              ele.children.sort((c1, c2) => sortChildren(c1, c2, elementById));
            }
          });
          elements.sort((c1, c2) => sortChildren(c1, c2, elementById));

          dispatch({
            type: HOME_FETCH_PROJECT_DATA_SUCCESS,
            data: prjData,
            force: args.force,
          });
          resolve(prjData);
        },
        err => {
          if (window.ON_REKIT_STUDIO_LOAD) window.ON_REKIT_STUDIO_LOAD();
          dispatch({
            type: HOME_FETCH_PROJECT_DATA_FAILURE,
            data: { error: err, initial: !!args.initial },
          });
          reject(err);
        },
      );
    });
  };
}

export function dismissFetchProjectDataError() {
  return {
    type: HOME_FETCH_PROJECT_DATA_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FETCH_PROJECT_DATA_BEGIN:
      return {
        ...state,
        fetchProjectDataPending: true,
        fetchProjectDataError: null,
      };

    case HOME_FETCH_PROJECT_DATA_SUCCESS: {
      const fileContentNeedReload = _.mapValues(state.fileContentById, () => true);
      const fileContentById = { ...state.fileContentById };
      Object.keys(fileContentById).forEach(k => {
        // if file no longer exist, delete file content cache.
        if (!action.data.elementById[k]) {
          delete fileContentById[k];
        }
      });
      return {
        ...state,
        fileContentById,
        projectData: action.data,
        elements: action.data.elements,
        elementById: action.data.elementById,
        projectName: action.data.projectName || 'Unknown Name',
        config: action.data.config,
        fileContentNeedReload,
        projectDataNeedReload: false,
        fetchProjectDataPending: false,
        fetchProjectDataError: null,
      };
    }
    case HOME_FETCH_PROJECT_DATA_FAILURE:
      return {
        ...state,
        fatalError: action.data.initial
          ? 'Fetch project failed: ' + action.data.error.message
          : state.fatalError, // when initial fetch project data, it's fatal error when failed
        fetchProjectDataPending: false,
        fetchProjectDataError: action.data.error,
      };

    case HOME_FETCH_PROJECT_DATA_DISMISS_ERROR:
      return {
        ...state,
        fetchProjectDataError: null,
      };

    default:
      return state;
  }
}
