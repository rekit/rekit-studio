const _ = require('lodash');
const entry = require('./entry');
const utils = require('./utils');
const constant = require('./constant');
const app = require('./app');

const { vio, template } = rekit.core;
const { pascalCase, getTplPath, parseElePath, getActionType, getAsyncActionTypes } = utils;

function add(elePath, args) {
  if (args.async) return addAsync(elePath, args);
  const ele = parseElePath(elePath, 'action');
  const actionType = getActionType(ele.feature, ele.name);
  const tplFile = getTplPath('redux/action.js.tpl');
  template.generate(ele.modulePath, {
    templateFile: tplFile,
    context: Object.assign({ ele, actionType }, args.context || {}),
  });

  constant.add(ele.feature, actionType);
  entry.addToActions(ele.feature, ele.name);
  entry.addToReducer(ele.feature, ele.name);
}

function remove(elePath, args) {
  const ele = parseElePath(elePath, 'action');
  if (_.get(app.getFileProps(ele.modulePath), 'action.isAsync')) {
    return removeAsync(elePath, args);
  }

  const actionType = getActionType(ele.feature, ele.name);  
  vio.del(ele.modulePath);
  constant.remove(ele.feature, actionType);
  entry.removeFromActions(ele.feature, ele.name);
  entry.removeFromReducer(ele.feature, ele.name);
}

function move(source, target, args) {
  if (args.async) return moveAsync(source, target, args);
  console.log('moving action: ', source, target, args);
  const sourceEle = parseElePath(source, 'action');
  assert.notEmpty(source.feature, 'feature');
  assert.notEmpty(source.name, 'action name');
  assert.featureExist(source.feature);
  assert.notEmpty(target.feature, 'feature');
  assert.notEmpty(target.name, 'action name');
  assert.featureExist(target.feature);

  // const targetPath = utils.mapReduxFile(source.feature, source.name);
  // if (_.get(refactor.getRekitProps(targetPath), 'action.isAsync')) {
  //   moveAsync(source, target);
  //   return;
  // }

  source.feature = _.kebabCase(source.feature);
  source.name = _.camelCase(source.name);
  target.feature = _.kebabCase(target.feature);
  target.name = _.camelCase(target.name);

  const srcPath = utils.mapReduxFile(source.feature, source.name);
  const destPath = utils.mapReduxFile(target.feature, target.name);
  vio.move(srcPath, destPath);

  const oldActionType = utils.getActionType(source.feature, source.name);
  const newActionType = utils.getActionType(target.feature, target.name);

  refactor.updateFile(destPath, ast => [].concat(
    refactor.renameFunctionName(ast, source.name, target.name),
    refactor.renameImportSpecifier(ast, oldActionType, newActionType)
  ));

  if (source.feature === target.feature) {
    entry.renameInActions(source.feature, source.name, target.name);
    // update the import path in actions.js
    // const targetPath = utils.mapReduxFile(source.feature, 'actions');
    // refactor.renameModuleSource(targetPath, `./${source.name}`, `./${target.name}`);

    entry.renameInReducer(source.feature, source.name, target.name);
    constant.rename(source.feature, oldActionType, newActionType);
  } else {
    entry.removeFromActions(source.feature, source.name);
    entry.addToActions(target.feature, target.name);

    entry.removeFromReducer(source.feature, source.name);
    entry.addToReducer(target.feature, target.name);

    constant.remove(source.feature, oldActionType);
    constant.add(target.feature, newActionType);
  }
}

function addAsync(elePath, args = {}) {
  const ele = parseElePath(elePath, 'action');
  const actionTypes = getAsyncActionTypes(ele.feature, ele.name);
  const tplFile = getTplPath('redux/async_action.js.tpl');

  template.generate(ele.modulePath, {
    templateFile: tplFile,
    ...args,
    context: {
      ele,
      actionTypes,
      utils,
      ...args.context
    }
  });

  constant.add(ele.feature, actionTypes.begin);
  constant.add(ele.feature, actionTypes.success);
  constant.add(ele.feature, actionTypes.failure);
  constant.add(ele.feature, actionTypes.dismissError);

  entry.addToActions(ele.feature, ele.name);
  entry.addToActions(ele.feature, `dismiss${pascalCase(ele.name)}Error`, ele.name);
  entry.addToReducer(ele.feature, ele.name);
  entry.addToInitialState(ele.feature, `${ele.name}Pending`, 'false');
  entry.addToInitialState(ele.feature, `${ele.name}Error`, 'null');
}

function removeAsync(elePath, args = {}) {
  const ele = parseElePath(elePath, 'action');
  const actionTypes = getAsyncActionTypes(ele.feature, ele.name);

  vio.del(ele.modulePath);

  constant.remove(ele.feature, actionTypes.begin);
  constant.remove(ele.feature, actionTypes.success);
  constant.remove(ele.feature, actionTypes.failure);
  constant.remove(ele.feature, actionTypes.dismissError);

  entry.removeFromActions(ele.feature, ele.name);
  entry.removeFromReducer(ele.feature, ele.name);
  entry.removeFromInitialState(ele.feature, `${ele.name}Pending`, 'false');
  entry.removeFromInitialState(ele.feature, `${ele.name}Error`, 'null');
}

function moveAsync() {}

module.exports = {
  add,
  move,
  remove,
};
