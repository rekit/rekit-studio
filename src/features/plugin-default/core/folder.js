const { vio, refactor } = rekit.core;

function add(folder) {
  if (vio.fileExists(folder)) throw new Error('Folder already exists: ' + folder);
  vio.mkdir(folder);
}

function move(source, target) {
  if (vio.fileExists(target)) throw new Error('Folder already exists: ' + target);
  if (!vio.fileExists(source)) throw new Error('Folder doesn\'t exist: ' + source);
  vio.move(source, target);
}

function remove(folder) {
  vio.del(folder);
}

module.exports = {
  add,
  remove,
  move,
};
