

module.exports = {
  name: 'ebay-node',
  app: require('./app'),
  deps: require('./deps'),
  isAppPlugin: true,
  appType: 'ebay-node',
  elements: {
    page: require('./page'),
    'ui-module': require('./uiModule'),
    service: require('./service'),
    layout: require('./layout'),
  },
};