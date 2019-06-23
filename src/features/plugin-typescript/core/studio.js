const fs = require('fs');

function config(server, app, args) {
  app.get('/api/types', (req, res) => {
    const typesArr = [];

    const file = 'node_modules/@types/react/index.d.ts';
    const content = fs.readFileSync(file).toString();
    typesArr.push({
      file,
      content,
    });
    res.write(JSON.stringify(typesArr));
    res.end();
  });
}

module.exports = { config };
