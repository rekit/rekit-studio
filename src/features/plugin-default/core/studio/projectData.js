module.exports = (req, res, next) => {
  res.type('json');
  const force = req.query.force;
  res.write(JSON.stringify(rekit.core.app.getProjectData({ force: !!force })));
  res.end();
};
