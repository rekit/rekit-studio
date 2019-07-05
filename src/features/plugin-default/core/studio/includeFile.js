const _ = require('lodash');
const fs = require('fs');

const { paths, vio, files } = rekit.core;

module.exports = (req, res) => {
  const file = req.body.file;
  const absPath = paths.map(file);
  if (!_.startsWith(absPath, paths.getProjectRoot())) {
    res.statusCode = 403;
    res.write('Forbidden: not allowed to access file out of the project.');
    res.end();
  }

  if (!fs.existsSync(absPath)) {
    res.statusCode = 404;
    res.write(JSON.stringify({ error: 'Not found.', file }));
    res.end();
  } else {
    files.include(file);
    res.write(JSON.stringify({ success: true, file: absPath }));
    res.end();
  }
};
