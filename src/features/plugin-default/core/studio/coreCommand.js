module.exports = io => (req, res) => {
  let error = null;
  try {
    rekit.core.handleCommand(req.body);
    rekit.core.vio.flush();
  } catch (err) {
    error = {
      error: err.message,
    }
  }

  rekit.core.vio.reset();
  // if (io) io.emit('fileChanged', []);

  res.type('json');
  res.write(JSON.stringify(error || req.body));
  res.end();
};
