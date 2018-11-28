const { vio, refactor } = rekit.core;

function add(filePath) {
  if (vio.fileExists(filePath)) throw new Error('File already exists: ' + filePath);
  vio.save(filePath, '');
}

function move(source, target) {
  if (vio.fileExists(target)) throw new Error('File already exists: ' + target);
  if (!vio.fileExists(source)) throw new Error('File doesn\'t exist: ' + source);
  vio.move(source, target);
}

function remove(filePath) {
  vio.del(filePath);
}

module.exports = {
  add,
  remove,
  move,
};
