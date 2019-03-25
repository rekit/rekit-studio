const _ = require('lodash');
const entry = require('./entry');
const utils = require('./utils');
const constant = require('./constant');
const app = require('./app');

const { vio, template, refactor } = rekit.core;
const { pascalCase, getTplPath, parseElePath, getActionType, getAsyncActionTypes } = utils;

function add(elePath, args) {
  if (args.async) return addAsync(elePath, args);
  const ele = parseElePath(elePath, 'action');
  if (vio.fileExists(ele.modulePath)) {
    throw new Error(`Failed to add action: target file already exsited: ${ele.modulePath}`)
  }
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

function move(source, target) {
  // if (args.async) return moveAsync(source, target, args);
  console.log('moving action: ', source, target);
  const sourceEle = parseElePath(source, 'action');
  const fileProps = app.getFileProps(sourceEle.modulePath);
  if (fileProps.action && fileProps.action.isAsync) return moveAsync(source, target);

  const targetEle = parseElePath(target, 'action');

  vio.move(sourceEle.modulePath, targetEle.modulePath);

  const oldActionType = utils.getActionType(sourceEle.feature, sourceEle.name);
  const newActionType = utils.getActionType(targetEle.feature, targetEle.name);

  refactor.updateFile(targetEle.modulePath, ast =>
    [].concat(
      refactor.renameFunctionName(ast, sourceEle.name, targetEle.name),
      refactor.renameImportSpecifier(ast, oldActionType, newActionType),
    ),
  );

  if (sourceEle.feature === targetEle.feature) {
    entry.renameInActions(sourceEle.feature, sourceEle.name, targetEle.name);
    entry.renameInReducer(sourceEle.feature, sourceEle.name, targetEle.name);
    constant.rename(sourceEle.feature, oldActionType, newActionType);
  } else {
    entry.removeFromActions(sourceEle.feature, sourceEle.name);
    entry.addToActions(targetEle.feature, targetEle.name);

    entry.removeFromReducer(sourceEle.feature, sourceEle.name);
    entry.addToReducer(targetEle.feature, targetEle.name);

    constant.remove(sourceEle.feature, oldActionType);
    constant.add(targetEle.feature, newActionType);
  }
}

function addAsync(elePath, args = {}) {
  const ele = parseElePath(elePath, 'action');
  if (vio.fileExists(ele.modulePath)) {
    throw new Error(`Failed to add action: target file already exsited: ${ele.modulePath}`)
  }
  const actionTypes = getAsyncActionTypes(ele.feature, ele.name);
  const tplFile = getTplPath('redux/asyncAction.js.tpl');

  template.generate(ele.modulePath, {
    templateFile: tplFile,
    ...args,
    context: {
      ele,
      actionTypes,
      utils,
      ...args.context,
    },
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

function moveAsync(source, target, args) {
  const sourceEle = parseElePath(source, 'action');
  const targetEle = parseElePath(target, 'action');

  vio.move(sourceEle.modulePath, targetEle.modulePath);

  const oldActionTypes = utils.getAsyncActionTypes(sourceEle.feature, sourceEle.name);
  const newActionTypes = utils.getAsyncActionTypes(targetEle.feature, targetEle.name);

  // Update the action file: rename function name and action types
  refactor.updateFile(targetEle.modulePath, ast =>
    [].concat(
      refactor.renameFunctionName(ast, sourceEle.name, targetEle.name),
      refactor.renameFunctionName(
        ast,
        `dismiss${pascalCase(sourceEle.name)}Error`,
        `dismiss${pascalCase(targetEle.name)}Error`,
      ),
      refactor.renameImportSpecifier(ast, oldActionTypes.begin, newActionTypes.begin),
      refactor.renameImportSpecifier(ast, oldActionTypes.success, newActionTypes.success),
      refactor.renameImportSpecifier(ast, oldActionTypes.failure, newActionTypes.failure),
      refactor.renameImportSpecifier(ast, oldActionTypes.dismissError, newActionTypes.dismissError),
      refactor.renameIdentifier(ast, `${sourceEle.name}Pending`, `${targetEle.name}Pending`),
      refactor.renameIdentifier(ast, `${sourceEle.name}Error`, `${targetEle.name}Error`),
    ),
  );
  if (sourceEle.feature === targetEle.feature) {
    // Update names in actions.js
    entry.renameInActions(sourceEle.feature, sourceEle.name, targetEle.name);
    entry.renameInActions(
      sourceEle.feature,
      `dismiss${pascalCase(sourceEle.name)}Error`,
      `dismiss${pascalCase(targetEle.name)}Error`,
      targetEle.name,
    );

    // Update names in reducer.js
    entry.renameInReducer(sourceEle.feature, sourceEle.name, targetEle.name);

    // Update names in initialState.js
    entry.renameInInitialState(
      sourceEle.feature,
      `${sourceEle.name}Pending`,
      `${targetEle.name}Pending`,
    );
    entry.renameInInitialState(
      sourceEle.feature,
      `${sourceEle.name}Error`,
      `${targetEle.name}Error`,
    );

    constant.rename(sourceEle.feature, oldActionTypes.begin, newActionTypes.begin);
    constant.rename(sourceEle.feature, oldActionTypes.success, newActionTypes.success);
    constant.rename(sourceEle.feature, oldActionTypes.failure, newActionTypes.failure);
    constant.rename(sourceEle.feature, oldActionTypes.dismissError, newActionTypes.dismissError);
  } else {
    // If moved to another feature, remove from entries first, then add to the new entry files
    entry.removeFromActions(sourceEle.feature, null, sourceEle.name);
    entry.removeFromReducer(sourceEle.feature, sourceEle.name);
    entry.removeFromInitialState(sourceEle.feature, `${sourceEle.name}Pending`, 'false');
    entry.removeFromInitialState(sourceEle.feature, `${sourceEle.name}Error`, 'null');

    entry.addToActions(targetEle.feature, targetEle.name);
    entry.addToActions(
      targetEle.feature,
      `dismiss${pascalCase(targetEle.name)}Error`,
      targetEle.name,
    );
    entry.addToReducer(targetEle.feature, targetEle.name);
    entry.addToInitialState(targetEle.feature, `${targetEle.name}Pending`, 'false');
    entry.addToInitialState(targetEle.feature, `${targetEle.name}Error`, 'null');

    constant.remove(sourceEle.feature, oldActionTypes.begin);
    constant.remove(sourceEle.feature, oldActionTypes.success);
    constant.remove(sourceEle.feature, oldActionTypes.failure);
    constant.remove(sourceEle.feature, oldActionTypes.dismissError);

    constant.add(targetEle.feature, newActionTypes.begin);
    constant.add(targetEle.feature, newActionTypes.success);
    constant.add(targetEle.feature, newActionTypes.failure);
    constant.add(targetEle.feature, newActionTypes.dismissError);
  }
}

module.exports = {
  add,
  move,
  remove,
};
