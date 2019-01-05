// const fs = require('fs');
// const path = require('path');
const _ = require('lodash');
// const rekit = require('rekit-core');

// const utils = rekitCore.utils;
// let usingYarn = false;
// let prjRoot = rekit.core.paths.getProjectRoot();
// let lastDir;
// while (prjRoot && prjRoot !== lastDir && fs.existsSync(prjRoot)) {
//   if (fs.existsSync(rekit.core.paths.join(prjRoot, 'yarn.lock'))) {
//     usingYarn = true;
//     break;
//   }
//   lastDir = prjRoot;
//   prjRoot = path.join(prjRoot, '..');
// }

const originalWrite = process.stdout.write;
let seed = 0;

const output = [];
const emit = _.debounce(io => {
  let toClient = output.length > 300 ? output.slice(-300) : output;
  toClient = toClient.map(text => {
    seed++;
    seed %= 1000000;
    return { text, key: seed };
  });
  io.emit('output', toClient); // max to 300 lines flush to client
  output.length = 0;
}, 100);

function debouncedOutput(text, io) {
  output.push(text);
  emit(io);
}
function startOutputToClient(io) {
  process.stdout.write = function() {
    originalWrite.apply(process.stdout, arguments);
    _.forEach(arguments, text => {
      text.split('\n').forEach(s => debouncedOutput(s, io));
    });
  };
}
function stopOutputToClient() {
  process.stdout.write = originalWrite;
}

module.exports = {
  forceRequire(modulePath) {
    // Avoid cache for require.
    delete require.cache[require.resolve(modulePath)];
    return require(modulePath); // eslint-disable-line
  },

  // usingYarn,
  startOutputToClient,
  stopOutputToClient,
  debouncedOutput,
};
