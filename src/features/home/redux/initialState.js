import _ from 'lodash';
import { storage } from '../../common/utils';

const getOpenPaths = () => {
  const arr = [];
  try {
    const openPaths = storage.session.getItem('openPaths', []);
    arr.push(...openPaths);
  } catch (err) {
    storage.session.removeItem('openPaths');
  }
  arr.push(document.location.pathname || '/')
  return _.compact(_.uniq(arr));
};
const getHistoryPaths = () => {
  const arr = [document.location.pathname || '/'];
  try {
    const historyPaths = storage.session.getItem('historyPaths', []);
    arr.push(...historyPaths);
  } catch (err) {
    storage.session.removeItem('historyPaths');
  }
  return _.compact(_.uniq(arr));
};

const initialState = {
  projectData: null,
  rekit: {},
  elementById: null,
  fileContentById: {},
  oldFileContentById: {},
  fileContentNeedReload: {},
  features: null,
  projectDataNeedReload: false,
  projectFileChanged: false,
  fetchProjectDataPending: false,
  fetchProjectDataError: null,
  fetchFileContentPending: false,
  fetchFileContentError: null,
  filesHasSyntaxError: {},

  // Restore open tabs and history tabs from local storage
  // openTabs: storage.session.getItem('openTabs', []),
  // historyTabs: storage.session.getItem('historyTabs', []),

  openPaths: getOpenPaths(),
  historyPaths: getHistoryPaths(),
  tempTabKey: null,

  demoAlertVisible: false,
  saveFilePending: false,
  saveFileError: null,

  codeChange: 0, // used to trigger UI re-render when typing
  viewChanged: {},
  paneSize: {},

  bottomDrawerVisible: storage.local.getItem('bottomDrawerVisible', true),
  bottomDrawerTab: storage.local.getItem('bottomDrawerTab', 'output'),

  output: [],
  npmListPending: false,
  npmListError: null,

  termViewOutput: [],

  fatalError: null,
};

export default initialState;
