const path = require('path');
const _ = require('lodash');
const entry = require('./entry');
const route = require('./route');
const style = require('./style');
const utils = require('./utils');
const test = require('./test');

const { vio, template, refactor } = rekit.core;
const { parseElePath } = utils;

// Add a component
// elePath format: home/MyComponent, home/subFolder/MyComponent
function add(elePath, args) {
  const { connect, urlPath } = args;
  const ele = parseElePath(elePath, 'component');
  const tplFile = connect ? './templates/ConnectedComponent.js.tpl' : './templates/Component.js.tpl';
  template.generate(ele.modulePath, {
    templateFile: path.join(__dirname, tplFile),
    context: Object.assign({ ele }, args.context || {}),
  });

  style.add(ele, args);
  entry.addToIndex(ele, args);
  if (urlPath) {
    route.add(ele.path, args);
  }
}

function remove(elePath, args) {
  // Remove component module
  const ele = parseElePath(elePath, 'component');
  vio.del(ele.modulePath);

  style.remove(ele, args);
  entry.removeFromIndex(ele, args);
  route.remove(ele.path, args);
}

function move(source, target, args) {
  console.log('moving component: ', source, target);
  const sourceEle = parseElePath(source, 'component');
  const targetEle = parseElePath(target, 'component');
  vio.move(sourceEle.modulePath, targetEle.modulePath); 

  const oldCssClass = `${sourceEle.feature}-${_.kebabCase(sourceEle.name)}`;
  const newCssClass = `${targetEle.feature}-${_.kebabCase(targetEle.name)}`;

  refactor.updateFile(targetEle.modulePath, ast => [].concat(
    refactor.renameClassName(ast, sourceEle.name, targetEle.name),
    refactor.renameCssClassName(ast, oldCssClass, newCssClass)
  ));


  if (sourceEle.feature === targetEle.feature) {
    entry.renameInIndex(sourceEle.feature, sourceEle.name, targetEle.name);
  } else {
    entry.removeFromIndex(sourceEle);
    entry.addToIndex(targetEle);
  }

  style.move(sourceEle, targetEle, args);
  route.move(source, target, args);
}

module.exports = {
  add,
  remove,
  move,
};
