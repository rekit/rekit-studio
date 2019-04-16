const git = require('simple-git')(process.cwd());
// git.cwd('/Users/pwang7/workspace4/abc')
git.status(console.log);

git.checkIsRepo((...args) => {console.log(args)});

git.diff((err, stat) => console.log(stat));