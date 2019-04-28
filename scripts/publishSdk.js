// Publish rekit-studio-dev
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

const prjRoot = path.join(__dirname, '..');
const tmpDir = path.join(prjRoot, '.tmp/dev-pkg');
const pkgJson = require(path.join(prjRoot, 'package.json'));

fs.emptyDirSync(tmpDir);
fs.ensureDirSync(tmpDir);

pkgJson.name = 'rekit-studio-sdk';
Object.assign(pkgJson.dependencies, pkgJson.devDependencies);
delete pkgJson.devDependencies;
delete pkgJson.files;
delete pkgJson.scripts;
delete pkgJson.nyc;

fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify(pkgJson, null, '  '));

[
  'src',
  'build',
  'dev-dll',
  'lib',
  'public',
  'config',
  'bin',
  '.eslintrc',
  '.prettierrc',
  'babel.config.js',
  'rekit.json',
  'LICENSE',
].forEach(file => {
  fs.copySync(path.join(prjRoot, file), path.join(tmpDir, file));
});

if (process.argv.indexOf('--npm-publish') >= 0) {
  // Publish to npm
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const isBeta = pkgJson.version.indexOf('beta') >= 0;
  const args = ['publish'];
  if (isBeta) {
    args.push('--tag', 'next');
  }
  console.log('publish: ', args);
  spawn(npmCmd, args, {
    stdio: 'inherit',
    cwd: tmpDir,
  });
} else {
  console.log('Done.');
}
