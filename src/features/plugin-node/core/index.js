const _ = require('lodash');
_.pascalCase = _.flow(
  _.camelCase,
  _.upperFirst
);

module.exports = {
  app: require('./app'),
  deps: require('./deps'),
  elements: {
    page: require('./page'),
    'ui-module': require('./uiModule'),
    service: require('./service'),
    layout: require('./layout'),
  },
};