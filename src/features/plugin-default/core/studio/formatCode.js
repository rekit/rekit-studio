const path = require('path');
const prettier = require('prettier');
const chokidar = require('chokidar');

const PRETTIER_CONFIG_FILES = [
  '.prettierrc',
  '.prettierrc.json',
  '.prettierrc.yaml',
  '.prettierrc.yml',
  '.prettierrc.js',
  'package.json',
  'prettier.config.js',
];

const DEFAULT_PRETTIER_OPTIONS = {
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 120,
};

const { paths } = rekit.core;
const rekitConfigWatcher = chokidar.watch(PRETTIER_CONFIG_FILES.map(f => paths.map(f)), {
  persistent: true,
});
rekitConfigWatcher.on('all', () => {
  prettier.clearConfigCache();
});

module.exports = (req, res) => {
  const content = req.body.content;
  const file = path.join(rekit.core.paths.getProjectRoot(), req.body.file);

  prettier
    .resolveConfig(file)
    .then(options => {
      try {
        const formatted = prettier.formatWithCursor(
          content,
          Object.assign(
            { filepath: file, cursorOffset: req.body.cursorOffset },
            options || DEFAULT_PRETTIER_OPTIONS,
          ),
        );
        res.write(JSON.stringify({ content: formatted }));
      } catch (err) {
        console.log('Failed to format code: ', err);
        res.write(JSON.stringify({ content, error: 'Failed to format code.', err }));
      }
      res.end();
    })
    .catch(err => {
      res.write(
        JSON.stringify({
          content,
          error: 'Failed to resolve prettier config.',
          err,
        }),
      );
      res.end();
    });
};
