const test = require('./test');

module.exports = {
  afterAddComponent(name, args) {
    test.add('component', name, args);
  },
  afterRemoveComponent(name, args) {
    test.remove('component', name, args);
  },
  afterMoveComponent(source, target) {
    test.move('component', source, target);
  },
  afterAddAction(name, args) {
    test.add('action', name, args);
  },
  afterRemoveAction(name, args) {
    test.remove('action', name, args);
  },
  afterMoveAction(source, target) {
    test.move('action', source, target);
  },
};
