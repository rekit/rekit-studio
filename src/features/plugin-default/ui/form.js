import { Input } from 'antd';
import store from '../../../common/store';

const byId = id => store.getState().home.elementById[id];
const nameMeta = () => ({
  key: 'name',
  label: 'Name',
  widget: Input,
  autoFocus: true,
  required: true,
});

const newNameMeta = args => ({
  key: 'name',
  label: 'New Name',
  widget: Input,
  autoFocus: true,
  autoSelect: true,
  required: true,
  initialValue: args.initialValue || '',
});

export default {
  fillMeta(args) {
    switch (args.formId) {
      case 'core.element.add.file':
      case 'core.element.add.folder':
        args.meta.elements.push(nameMeta());
        break;
      case 'core.element.rename.file-folder':
        const targetEle = byId(args.context.targetId);
        args.meta.elements.push(
          newNameMeta({ ...args, initialValue: targetEle && targetEle.name }),
        );
        break;
      default:
        break;
    }
  },
  preSubmit(args) {
    return Promise.resolve();
  },
  processValues(args) {
    const { context, values, formId } = args;
    switch (formId) {
      case 'core.element.add.file':
      case 'core.element.add.folder': {
        let target = context.targetId ? byId(context.targetId) : null;
        let name = values.name;
        if (target) {
          if (target.type === 'folder') name = target.id + '/' + values.name;
          else if (target.type === 'file') name = target.id.replace(/\/[^/]$/, '/' + values.name);
          else if (target.type === 'folder-alias' && target.target)
            name = target.target + '/' + values.name;
          else throw new Error('Unkonwn target type to add a file: ', target.type);
        }
        Object.assign(args, { name });
        break;
      }
      case 'core.element.rename.file-folder':
        const target = byId(context.targetId);
        const arr = context.targetId.split('/');
        arr.pop();
        arr.push(values.name);
        Object.assign(args, {
          type: target.type,
          source: context.targetId,
          target: arr.join('/'),
        });
        break;
      default:
        break;
    }
  },
};
