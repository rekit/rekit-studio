const { vio, files, config } = rekit.core;

function watchFileChange(io) {
  files.on('change', changes => {
    vio.reset();
    if (io) io.emit('fileChanged', { timestamp: files.lastChangeTime });
  });

  config.on('change', changes => {
    vio.reset();
    if (io) io.emit('configChanged', {});
  });
}

module.exports = watchFileChange;
