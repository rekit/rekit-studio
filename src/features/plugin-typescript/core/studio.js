const fs = require('fs');

function config(server, app, args) {
  app.get('/api/types', (req, res) => {
    const typesArr = [];

    const files = ['node_modules/@types/react/index.d.ts', 'node_modules/@types/lodash/index.d.ts'];
    files.forEach(file => {
      const content = fs.readFileSync(rekit.core.paths.map(file)).toString();
      typesArr.push({
        file,
        content,
      });
    });
    res.write(JSON.stringify(typesArr));
    res.end();
  });
}

module.exports = { config };
