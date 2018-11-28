'use strict';

const _ = require('lodash');
const traverse = require('babel-traverse').default;
const utils = require('./utils');

const { ast, refactor, vio } = rekit.core;
const { parseElePath } = utils;

function getChildRoutesNode(ast1) {
  let arrNode = null;
  traverse(ast1, {
    ObjectProperty(path) {
      const node = path.node;
      if (
        _.get(node, 'key.name') === 'childRoutes' &&
        _.get(node, 'value.type') === 'ArrayExpression'
      ) {
        arrNode = node.value;
        arrNode._filePath = ast1._filePath;
        path.stop();
      }
    },
  });
  return arrNode;
}
// Add component to a route.js under a feature.
// It imports all component from index.js
function add(elePath, args) {
  if (!args || !args.urlPath) return;
  const ele = parseElePath(elePath, 'component');
  const routePath = `src/features/${ele.feature}/route.js`;
  if (!vio.fileExists(routePath)) {
    throw new Error(`route.add failed: file not found ${routePath}`);
  }

  const { urlPath } = args;
  refactor.addImportFrom(routePath, './', '', ele.name);

  const ast1 = ast.getAst(routePath, true);
  const arrNode = getChildRoutesNode(ast1);
  if (arrNode) {
    const rule = `{ path: '${urlPath}', component: ${ele.name}${
      args.isIndex ? ', isIndex: true' : ''
    } }`;
    const changes = refactor.addToArrayByNode(arrNode, rule);
    const code = refactor.updateSourceCode(vio.getContent(routePath), changes);
    vio.save(routePath, code);
  } else {
    throw new Error(
      `You are adding a route rule, but can't find childRoutes property in '${routePath}', please check.`
    );
  }
}

function remove(elePath) {
  const ele = parseElePath(elePath, 'component');
  const routePath = `src/features/${ele.feature}/route.js`;
  if (!vio.fileExists(routePath)) {
    throw new Error(`route.add failed: file not found ${routePath}`);
  }

  refactor.removeImportSpecifier(routePath, ele.name);

  const ast1 = ast.getAst(routePath, true);
  const arrNode = getChildRoutesNode(ast1);
  if (arrNode) {
    let changes = [];
    arrNode.elements
      .filter(element =>
        _.find(
          element.properties,
          p => _.get(p, 'key.name') === 'component' && _.get(p, 'value.name') === ele.name
        )
      )
      .forEach(element => {
        changes = changes.concat(refactor.removeFromArrayByNode(arrNode, element));
      });
    const code = refactor.updateSourceCode(vio.getContent(routePath), changes);
    vio.save(routePath, code);
  } else {
    utils.fatal(
      `You are removing a route rule, but can't find childRoutes property in '${routePath}', please check.`
    );
  }
}

function move(source, target) {
  const sourceEle = parseElePath(source, 'component');
  const targetEle = parseElePath(target, 'component');

  if (sourceEle.feature === targetEle.feature) {
    // If in the same feature, rename imported component name
    const oldName = sourceEle.name;
    const newName = targetEle.name;
    const targetRoutePath = `src/features/${targetEle.feature}/route.js`;

    refactor.updateFile(targetRoutePath, ast =>
      [].concat(
        refactor.renameImportSpecifier(ast, oldName, newName),
        refactor.renameStringLiteral(ast, _.kebabCase(oldName), _.kebabCase(newName)) // Rename path roughly
      )
    );
  } else {
    add(target);
    remove(source);
  }
}

module.exports = {
  add,
  remove,
  move,
};
