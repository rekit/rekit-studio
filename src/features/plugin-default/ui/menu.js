import { Modal, message } from 'antd';
import store from '../../../common/store';
import * as actions from '../../core/redux/actions';

const showDialog = (...args) => store.dispatch(actions.showDialog(...args));
const execCoreCommand = args => store.dispatch(actions.execCoreCommand(args));

const byId = id => store.getState().home.elementById[id];

const menuItems = {
  del: { name: 'Delete', key: 'del-file-folder' },
  // move: { name: 'Move', key: 'move' },
  rename: { name: 'Rename', key: 'rename-file-folder' },
  newFile: { name: 'New File', key: 'new-file' },
  newFolder: { name: 'New Folder', key: 'new-folder' },
};

export default {
  mainMenu: {
    fillMenuItems(items) {
      items.push(
        {
          label: 'New File',
          icon: 'file',
          iconColor: '#555',
          key: 'plugin-default-new-file',
          order: 1,
        },
        {
          label: 'New Folder',
          icon: 'folder',
          iconColor: '#555',
          key: 'plugin-default-new-folder',
          order: 1,
        },
      );
    },
    handleMenuClick(key) {
      switch (key) {
        case 'plugin-default-new-file':
          showDialog('core.element.add.file', 'New File', {
            action: 'add',
            targetId: null,
            elementType: 'file',
          });
          break;
        case 'plugin-default-new-folder':
          showDialog('core.element.add.folder', 'New Folder', {
            action: 'add',
            targetId: null,
            elementType: 'folder',
          });
          break;
        default:
          break;
      }
    },
  },
  contextMenu: {
    fillMenuItems(items, { elementId }) {
      const ele = byId(elementId);
      if (!ele) return;
      switch (ele.type) {
        case 'folder':
          items.push(menuItems.newFile, menuItems.newFolder, menuItems.rename, menuItems.del);
          break;
        case 'folder-alias':
        case 'misc':
          items.push(menuItems.newFile, menuItems.newFolder, menuItems.del);
          break;
        case 'file':
          items.push(menuItems.rename, menuItems.del);
          break;
        default:
          break;
      }
    },
    handleMenuClick({ elementId, key }) {
      switch (key) {
        case 'new-file': {
          showDialog('core.element.add.file', 'New File', {
            action: 'add',
            targetId: elementId,
            elementType: 'file',
          });
          break;
        }
        case 'new-folder': {
          showDialog('core.element.add.folder', 'New Folder', {
            action: 'add',
            targetId: elementId,
            elementType: 'folder',
          });
          break;
        }
        // case 'move': {
        //   showDialog('core.element.move.component', 'Move', {
        //     action: 'move',
        //     targetId: elementId,
        //   });
        //   break;
        // }
        case 'rename-file-folder': {
          showDialog('core.element.rename.file-folder', 'Rename', {
            action: 'move',
            targetId: elementId,
            elementType: byId(elementId).type,
          });
          break;
        }
        case 'del-file-folder': {
          let ele = byId(elementId);
          if (ele.target && byId(ele.target)) ele = byId(ele.target);
          Modal.confirm({
            title: `Are you sure to delete the ${ele.type} "${ele.name}"?`,
            onOk() {
              if (!ele) {
                Modal.error({
                  title: 'No element to delete',
                  content: `Element not found: ${elementId}`,
                });
                return;
              }
              const name = ele.id;
              execCoreCommand({
                commandName: 'remove',
                type: ele.type,
                name,
              }).then(
                () => {
                  message.success(`Delete ${ele.type} success.`);
                },
                err => {
                  Modal.error({
                    title: `Failed to delete the ${ele.type}`,
                    content: err.toString(),
                  });
                },
              );
            },
          });
          break;
        }
        default:
          break;
      }
    },
  },
};
