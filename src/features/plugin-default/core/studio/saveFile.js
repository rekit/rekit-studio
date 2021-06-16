const _ = require('lodash');

const { paths, vio } = rekit.core;

module.exports = (req, res) => {
  const file = req.body.file;
  const absPath = paths.map(file);
  if (!_.startsWith(absPath, paths.getProjectRoot())) {
    // prevent ../.. in req.query.file
    res.statusCode = 403;
    res.write('Forbidden: not allowed to access file out of the project.');
    res.end();
    return;
  }

  if (!vio.fileExists(file)) {
    res.statusCode = 404;
    res.write(JSON.stringify({ error: 'Not found.', file, absPath: absPath }));
    res.end();
  } else {
    try {
      vio.save(file, req.body.content);
      vio.flush();
      res.write(JSON.stringify({ success: true }));
    } catch (err) {
      res.write(JSON.stringify({ error: err }));
    }
    res.end();
  }
};
