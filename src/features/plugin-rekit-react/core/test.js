const path = require('path');
const _ = require('lodash');
const utils = require('./utils');

const { vio, template, refactor } = rekit.core;
const { parseElePath, getActionType, getAsyncActionTypes, getTplPath } = utils;

function add(type, name, args) {
  switch (type) {
    case 'component':
      addComponentTest(name, args);
      break;
    case 'action':
      addActionTest(name, args);
      break;
    default:
      break;
  }
}

function remove(type, name, args) {
  switch (type) {
    case 'component':
      removeComponentTest(name, args);
      break;
    case 'action':
      removeActionTest(name, args);
      break;
    default:
      break;
  }
}

function move(type, source, target) {
  switch (type) {
    case 'component':
      moveComponentTest(source, target);
      break;
    case 'action':
      moveActionTest(source, target);
      break;
    default:
      break;
  }
}

function addComponentTest(name, args) {
  console.log('add component test: ', name);
  const { connect } = args;
  const ele = parseElePath(name, 'component');
  if (vio.fileExists(ele.testPath)) {
    throw new Error(`Failed to add component: target file already exsited: ${ele.testPath}`)
  }
  const tplFile = getTplPath(connect ? 'ConnectedComponent.test.js.tpl' : 'Component.test.js.tpl');
  template.generate(ele.testPath, {
    templateFile: tplFile,
    context: Object.assign({ ele }, args.context || {}),
  });
}

function removeComponentTest(elePath, args) {
  const ele = parseElePath(elePath, 'component');
  vio.del(ele.testPath);
}

function moveComponentTest(source, target) {
  const sourceEle = parseElePath(source, 'component');
  const targetEle = parseElePath(target, 'component');
  vio.move(sourceEle.testPath, targetEle.testPath);

  const oldCssClass = `.${source.feature}-${_.kebabCase(sourceEle.name)}`;
  const newCssClass = `.${target.feature}-${_.kebabCase(targetEle.name)}`;

  // Note: below string pattern binds to the test template, update here if template is changed.
  // Two styles of imports for component and high order component like page.
  const oldImportPath1 = `src/features/${sourceEle.feature}`;
  const newImportPath1 = `src/features/${targetEle.feature}`;

  const oldImportPath2 = `src/features/${sourceEle.feature}/${sourceEle.name}`;
  const newImportPath2 = `src/features/${targetEle.feature}/${targetEle.name}`;

  // Those without module alias
  const oldImportPath3 = `../../../src/features/${sourceEle.feature}`;
  const newImportPath3 = `../../../src/features/${targetEle.feature}`;

  const oldImportPath4 = `../../../src/features/${sourceEle.feature}/${source.name}`;
  const newImportPath4 = `../../../src/features/${targetEle.feature}/${target.name}`;

  // Try to update describe('xxx')
  const oldDescribe = `${sourceEle.feature}/${sourceEle.name}`;
  const newDescribe = `${targetEle.feature}/${targetEle.name}`;

  refactor.updateFile(targetEle.testPath, ast =>
    [].concat(
      refactor.renameImportSpecifier(ast, sourceEle.name, targetEle.name),
      refactor.renameStringLiteral(ast, oldImportPath1, newImportPath1),
      refactor.renameStringLiteral(ast, oldImportPath2, newImportPath2),
      refactor.renameStringLiteral(ast, oldImportPath3, newImportPath3),
      refactor.renameStringLiteral(ast, oldImportPath4, newImportPath4),
      refactor.renameStringLiteral(ast, oldDescribe, newDescribe),
      refactor.renameStringLiteral(ast, oldCssClass, newCssClass),
    ),
  );
}

function addActionTest(elePath, args) {
  const ele = parseElePath(elePath, 'action');
  if (vio.fileExists(ele.testPath)) {
    throw new Error(`Failed to add action: target file already exsited: ${ele.testPath}`)
  }
  const tplFile = getTplPath(
    args.async ? 'redux/asyncAction.test.js.tpl' : 'redux/action.test.js.tpl',
  );

  const actionType = getActionType(ele.feature, ele.name);
  const asyncActionTypes = getAsyncActionTypes(ele.feature, ele.name);

  template.generate(ele.testPath, {
    templateFile: tplFile,
    context: Object.assign({ ele, actionType, asyncActionTypes }, args.context || {}),
  });
}

function removeActionTest(elePath, args) {
  const ele = parseElePath(elePath, 'action');
  vio.del(ele.testPath);
}

function moveActionTest(source, target) {
  const sourceEle = parseElePath(source, 'action');
  const targetEle = parseElePath(target, 'action');
  vio.move(sourceEle.testPath, targetEle.testPath);

  // Note: below string pattern binds to the test template, update here if template is changed.
  // For action/reducer import
  const oldImportPath1 = `src/features/${sourceEle.feature}/redux/${sourceEle.name}`;
  const newImportPath1 = `src/features/${targetEle.feature}/redux/${targetEle.name}`;

  // For constant import
  const oldImportPath2 = `src/features/${sourceEle.feature}/redux/constants`;
  const newImportPath2 = `src/features/${targetEle.feature}/redux/constants`;

  // For action/reducer import
  const oldImportPath3 = `../../../../src/features/${sourceEle.feature}/redux/${sourceEle.name}`;
  const newImportPath3 = `../../../../src/features/${targetEle.feature}/redux/${targetEle.name}`;

  // For constant import
  const oldImportPath4 = `../../../../src/features/${sourceEle.feature}/redux/constants`;
  const newImportPath4 = `../../../../src/features/${targetEle.feature}/redux/constants`;

  // Try to update describe('xxx')
  const oldDescribe = `${sourceEle.feature}/redux/${sourceEle.name}`;
  const newDescribe = `${targetEle.feature}/redux/${targetEle.name}`;

  // Sync action
  const oldActionType = utils.getActionType(sourceEle.feature, sourceEle.name);
  const newActionType = utils.getActionType(targetEle.feature, targetEle.name);
  const oldIt1 = `returns correct action by ${sourceEle.name}`;
  const newIt1 = `returns correct action by ${targetEle.name}`;

  const oldIt2 = `handles action type ${oldActionType} correctly`;
  const newIt2 = `handles action type ${newActionType} correctly`;

  // Async action
  const oldActionTypes = utils.getAsyncActionTypes(sourceEle.feature, sourceEle.name);
  const newActionTypes = utils.getAsyncActionTypes(targetEle.feature, targetEle.name);

  const asyncOldIt1 = `dispatches success action when ${sourceEle.name} succeeds`;
  const asyncNewIt1 = `dispatches success action when ${targetEle.name} succeeds`;

  const asyncOldIt2 = `dispatches failure action when ${sourceEle.name} fails`;
  const asyncNewIt2 = `dispatches failure action when ${targetEle.name} fails`;

  const asyncOldIt3 = `returns correct action by dismiss${_.pascalCase(sourceEle.name)}Error`;
  const asyncNewIt3 = `returns correct action by dismiss${_.pascalCase(targetEle.name)}Error`;

  const asyncOldIt4 = `handles action type ${oldActionTypes.begin} correctly`;
  const asyncNewIt4 = `handles action type ${newActionTypes.begin} correctly`;

  const asyncOldIt5 = `handles action type ${oldActionTypes.success} correctly`;
  const asyncNewIt5 = `handles action type ${newActionTypes.success} correctly`;

  const asyncOldIt6 = `handles action type ${oldActionTypes.failure} correctly`;
  const asyncNewIt6 = `handles action type ${newActionTypes.failure} correctly`;

  const asyncOldIt7 = `handles action type ${oldActionTypes.dismissError} correctly`;
  const asyncNewIt7 = `handles action type ${newActionTypes.dismissError} correctly`;

  refactor.updateFile(targetEle.testPath, ast =>
    [].concat(
      refactor.renameImportSpecifier(ast, sourceEle.name, targetEle.name),
      refactor.renameStringLiteral(ast, oldImportPath1, newImportPath1),
      refactor.renameStringLiteral(ast, oldImportPath2, newImportPath2),
      refactor.renameStringLiteral(ast, oldImportPath3, newImportPath3),
      refactor.renameStringLiteral(ast, oldImportPath4, newImportPath4),
      refactor.renameStringLiteral(ast, oldDescribe, newDescribe),
      refactor.renameStringLiteral(ast, oldIt1, newIt1),
      refactor.renameStringLiteral(ast, oldIt2, newIt2),
      refactor.renameImportSpecifier(ast, oldActionType, newActionType),

      refactor.renameImportSpecifier(
        ast,
        `dismiss${_.pascalCase(sourceEle.name)}Error`,
        `dismiss${_.pascalCase(targetEle.name)}Error`,
      ),
      refactor.renameImportSpecifier(ast, `${oldActionTypes.begin}`, `${newActionTypes.begin}`),
      refactor.renameImportSpecifier(ast, `${oldActionTypes.success}`, `${newActionTypes.success}`),
      refactor.renameImportSpecifier(ast, `${oldActionTypes.failure}`, `${newActionTypes.failure}`),
      refactor.renameImportSpecifier(
        ast,
        `${oldActionTypes.dismissError}`,
        `${newActionTypes.dismissError}`,
      ),
      refactor.renameIdentifier(ast, `${sourceEle.name}Pending`, `${targetEle.name}Pending`),
      refactor.renameIdentifier(ast, `${sourceEle.name}Error`, `${targetEle.name}Error`),
      refactor.renameStringLiteral(ast, asyncOldIt1, asyncNewIt1),
      refactor.renameStringLiteral(ast, asyncOldIt2, asyncNewIt2),
      refactor.renameStringLiteral(ast, asyncOldIt3, asyncNewIt3),
      refactor.renameStringLiteral(ast, asyncOldIt4, asyncNewIt4),
      refactor.renameStringLiteral(ast, asyncOldIt5, asyncNewIt5),
      refactor.renameStringLiteral(ast, asyncOldIt6, asyncNewIt6),
      refactor.renameStringLiteral(ast, asyncOldIt7, asyncNewIt7),
    ),
  );
}

module.exports = {
  add,
  remove,
  move,
};
