/* This script is used to copy SDK pkg to a plugin project to test if SDK works. */

const fs = require('fs-extra');
const path = require('path');

// build sdk first
require('./publishSdk')

let destPrj = process.argv[2];
if (!path.isAbsolute(destPrj)) destPrj = path.join(process.cwd(), destPrj);

const destSdkDir = path.join(destPrj, 'node_modules/rekit-studio-sdk');

const sdkDir = path.join(__dirname, '../.tmp/dev-pkg');

fs.copySync(sdkDir, destSdkDir, {
  filter(src, dest) {
    return !/node_modules|package\.json/.test(src);//src.includes('node_modules');
  }
})
console.log('Done. SDK copied to: ', destSdkDir);