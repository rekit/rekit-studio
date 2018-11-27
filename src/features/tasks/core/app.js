const { getRunning } = require('./studio');

module.exports = {
  getProjectData() {
    return {
      tasks: {
        running: getRunning(),
      },
    };
  },
};
