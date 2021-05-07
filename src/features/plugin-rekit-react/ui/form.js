import React from 'react';
import { Input, Checkbox, Switch, Select, Radio } from 'antd';
import store from 'rs/common/store';

const Option = Select.Option;

const createSelectOptions = options =>
  options.map(opt => <Option key={opt.value || opt.name}>{opt.name}</Option>);

const byId = id => store.getState().home.elementById[id];
const parentElement = id => byId(byId(id).parent);

const getFeatures = () =>
  byId('v:features')
    .children.map(byId)
    .filter(ele => ele.type === 'feature')
    .map(f => ({ name: f.name, value: f.name }));

const getInitialFeature = args => {
  const { context } = args;
  if (context && context.targetId && byId(context.targetId)) {
    const targetEle = byId(context.targetId);

    if (targetEle.type === 'feature') {
      return targetEle.name;
    }
    if (/^actions|components$/.test(targetEle.type)) {
      return parentElement(targetEle.id).name;
    }
    if (/^action|component$/.test(targetEle.type)) {
      return targetEle.feature;
    }
  }

  return '';
};

const featureMeta = args => ({
  key: 'feature',
  label: 'Feature',
  widget: Select,
  required: true,
  children: createSelectOptions(getFeatures()),
  initialValue: getInitialFeature(args),
});

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
  initialValue: args.initialValue,
});

export default {
  fillMeta(args) {
    switch (args.formId) {
      case 'core.element.add.feature':
        args.meta.elements.push(nameMeta(args));
        break;
      case 'core.element.move.feature':
        args.meta.elements.push(newNameMeta({ initialValue: byId(args.context.targetId).name }));
        break;
      case 'core.element.add.component':
        args.meta.elements.push(featureMeta(args), nameMeta(args), {
          key: 'componentType',
          label: 'Component Type',
          tooltip: 'Since React 16.8, you can choose functional component with hooks.',
          widget: 'radio-group',
          options: [['functional', 'Functional'], ['class', 'Class']],
          initialValue: 'functional',
        });
        if (!args.values.componentType || args.values.componentType === 'functional') {
          args.meta.elements.push({
            key: 'hooks',
            label: 'Hooks',
            widget: 'checkbox-group',
            tooltip:
              'Which hooks to import in the component, here is a list of frequently used hooks, you can mannually import others in the code.',
            options: [
              ['useEffect', 'useEffect'],
              ['useState', 'useState'],
              ['useCallback', 'useCallback'],
            ],
            initialValue: [],
          });
        }
        args.meta.elements.push(
          {
            key: 'connect',
            label: 'Connect to Store',
            tooltip: 'Whether to connect to redux store, for class component, use connect, for functional component, use hooks.',
            widget: Checkbox,
            initialValue: false,
          },
          {
            key: 'urlPath',
            label: 'Url Path',
            widget: Input,
          },
        );

        break;
      case 'core.element.move.component-action': {
        const ele = byId(args.context.targetId);
        if (!ele) return;
        args.meta.elements.push(featureMeta(args), newNameMeta({ initialValue: ele.name }));

        break;
      }
      case 'core.element.add.action':
        args.meta.elements.push(
          featureMeta(args),
          nameMeta(args),
          {
            key: 'async',
            label: 'Async',
            widget: Checkbox,
            initialValue: false,
          },
          args.values.async
            ? {
                key: 'allowAutoEffect',
                label: 'Auto Effect',
                widget: Checkbox,
                initialValue: false,
                tooltip: 'Whether to allow auto effect in the hook.',
              }
            : null,
          {
            key: 'selector',
            label: 'Selector',
            tooltip: 'Export values from store in the hook. Use comma to separate values.',
            widget: Input,
            // widgetProps: { mode: 'tags', open: false, tokenSeparators: [' '] },
          },
        );

        break;
      default:
        break;
    }
  },
  processValues(args) {
    const { context, values, formId } = args;
    switch (formId) {
      case 'core.element.add.component':
        Object.assign(args, {
          name: `${values.feature}/${values.name}`.replace(/\/+/g, '/'),
        });
        break;
      case 'core.element.add.action':
        Object.assign(args, {
          name: `${values.feature}/${values.name}`.replace(/\/+/g, '/'),
        });
        break;
      case 'core.element.move.component-action': {
        const ele = byId(context.targetId);
        Object.assign(args, {
          source: `${ele.feature}/${ele.name}`,
          target: `${values.feature}/${values.name}`,
        });
        break;
      }
      case 'core.element.move.feature': {
        const ele = byId(context.targetId);
        Object.assign(args, {
          source: ele.name,
          target: values.name,
        });
        break;
      }
      default:
        break;
    }
  },
};
