function config(server, app, args) {
  require('./watch')(args.io);

  app.get('/api/project-data', require('./projectData'));
  app.post('/api/core-command', require('./coreCommand')(args.io));
  app.post('/api/lint', require('./lint'));
  app.get('/api/read-file', require('./readFile'));
  app.post('/api/read-files', require('./readFiles'));
  app.post('/api/save-file', require('./saveFile'));
  app.post('/api/format-code', require('./formatCode'));
  app.post('/api/include-file', require('./includeFile'));
}

module.exports = { config };
