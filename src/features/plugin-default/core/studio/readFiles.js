const _ = require('lodash');

const { paths, vio } = rekit.core;

module.exports = (req, res) => {
  const files = req.body.files;
  const result = [];
  files.forEach(file => {
    const absPath = paths.map(file);
    if (!_.startsWith(absPath, paths.getProjectRoot())) {
      return;
    }
    console.log('read file', file);

    if (vio.fileExists(file)) {
      console.log('push', file);
      result.push({
        file,
        content: vio.getContent(file),
      });
    }
  });
  res.write(JSON.stringify(result));
  res.end();
};
