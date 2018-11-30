const _ = require('lodash');
const path = require('path');
const traverse = require('babel-traverse').default;

const entry = require('./entry');
const utils = require('./utils');
const constant = require('./constant');

const { vio, refactor, config, template, ast } = rekit.core;
const { getTplPath, upperSnakeCase } = utils;

function add(feature) {
  feature = _.kebabCase(feature);
  const targetDir = `src/features/${feature}`;
  if (vio.dirExists(targetDir)) throw new Error('Feature folder has been existed: ' + targetDir);

  vio.mkdir(targetDir);
  vio.mkdir(`${targetDir}/redux`);
  vio.mkdir(`tests/features/${feature}`);
  vio.mkdir(`tests/features/${feature}/redux`);

  // Create files from template
  [
    'index.js',
    'route.js',
    'style.' + config.style,
    'redux/actions.js',
    'redux/reducer.js',
    'redux/constants.js',
    'redux/initialState.js',
  ].forEach(fileName => {
    template.generate(`src/features/${feature}/${fileName}`, {
      templateFile: getTplPath(fileName + '.tpl'),
      context: { feature },
    });
  });

  // Create wrapper reducer for the feature
  // template.generate(utils.joinPath(utils.getProjectRoot(), `tests/features/${name}/redux/reducer.test.js`), {
  //   templateFile: 'redux/reducer.test.js',
  //   context: { feature: name }
  // });

  entry.addToRootReducer(feature);
  entry.addToRouteConfig(feature);
  entry.addToRootStyle(feature);
}

function move(oldName, newName) {
  // assert.notEmpty(oldName);
  // assert.notEmpty(newName);
  // assert.featureExist(oldName);
  // assert.featureNotExist(newName);

  oldName = _.kebabCase(oldName);
  newName = _.kebabCase(newName);

  // const prjRoot = paths.getProjectRoot();

  // Move feature folder
  const oldFolder = `src/features/${oldName}`;//paths.map('src/features', oldName);
  const newFolder = `src/features/${newName}`;
  vio.moveDir(oldFolder, newFolder);
  console.log('vio.exist: ', `${newFolder}/route.js`, vio.fileExists(`${newFolder}/route.js`))

  // Update common/routeConfig
  entry.renameInRouteConfig(oldName, newName);

  // Update common/rootReducer
  entry.renameInRootReducer(oldName, newName);

  // Update styles/index.less
  entry.renameInRootStyle(oldName, newName);

  // Update feature/route.js for path if they bind to feature name
  refactor.replaceStringLiteral(`src/features/${newName}/route.js`, oldName, newName); // Rename path

  // Try to rename css class names for components
  const folder = `src/features/${newName}`; // utils.joinPath(prjRoot, 'src/features', newName);
  vio
    .ls(folder)
    // It simply assumes component file name is pascal case
    .filter(f => /^[A-Z]/.test(path.basename(f)))
    .forEach(filePath => {
      const moduleName = path.basename(filePath).split('.')[0];

      if (/\.jsx?$/.test(filePath)) {
        // For components, update the css class name inside
        refactor.updateFile(filePath, ast =>
          [].concat(
            refactor.replaceStringLiteral(
              ast,
              `${oldName}-${_.kebabCase(moduleName)}`,
              `${newName}-${_.kebabCase(moduleName)}`,
              false
            ) // rename css class name
          )
        );
      } else if (/\.less$|\.scss$/.test(filePath)) {
        // For style update
        let lines = vio.getLines(filePath);
        const oldCssClass = `${oldName}-${_.kebabCase(moduleName)}`;
        const newCssClass = `${newName}-${_.kebabCase(moduleName)}`;

        lines = lines.map(line => line.replace(`.${oldCssClass}`, `.${newCssClass}`));
        vio.save(filePath, lines);
      }
    });

  // Rename action constants
  const constantsFile = `src/features/${newName}/redux/constants.js`;
  const constants = [];
  const ast2 = ast.getAst(constantsFile, true);
  // vio.assertAst(ast, constantsFile);
  traverse(ast2, {
    VariableDeclarator(p) {
      const name = _.get(p, 'node.id.name');
      if (
        name &&
        _.startsWith(name, `${upperSnakeCase(oldName)}_`) &&
        name === _.get(p, 'node.init.value')
      ) {
        constants.push(name);
      }
    },
  });

  constants.forEach(name => {
    const oldConstant = name;
    const newConstant = name.replace(
      new RegExp(`^${upperSnakeCase(oldName)}`),
      upperSnakeCase(newName)
    );
    constant.rename(newName, oldConstant, newConstant);
  });

  // Rename actions
  vio.ls(`src/features/${newName}/redux`)
    // It simply assumes component file name is pascal case
    .forEach((filePath) => {
      if (/\.js$/.test(filePath)) {
        refactor.updateFile(filePath, (ast) => {
          let changes = [];
          constants.forEach((name) => {
            const oldConstant = name;
            const newConstant = name.replace(new RegExp(`^${upperSnakeCase(oldName)}`), upperSnakeCase(newName));
            changes = changes.concat(refactor.renameImportSpecifier(ast, oldConstant, newConstant));
          });
          return changes;
        });
      }
    });
}

function remove(feature) {
  feature = _.kebabCase(feature);
  vio.del(`src/features/${feature}`);
  vio.del(`tests/features/${feature}`);

  entry.removeFromRootReducer(feature);
  entry.removeFromRouteConfig(feature);
  entry.removeFromRootStyle(feature);
}

module.exports = {
  add,
  remove,
  move,
};
