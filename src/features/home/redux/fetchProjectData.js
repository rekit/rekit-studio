import _ from 'lodash';
import axios from 'axios';
import {
  HOME_FETCH_PROJECT_DATA_BEGIN,
  HOME_FETCH_PROJECT_DATA_SUCCESS,
  HOME_FETCH_PROJECT_DATA_FAILURE,
  HOME_FETCH_PROJECT_DATA_DISMISS_ERROR,
} from './constants';
import plugin from '../../../common/plugin';

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
            data: { error: err },
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
      return {
        ...state,
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
