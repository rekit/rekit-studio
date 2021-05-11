const crypto = require('crypto');
const os = require('os');
const path = require('path');
const fs = require('fs-extra');

const TOKEN_FILE = path.join(os.homedir(), '.rekit/.token');

const genSid = len =>
  crypto
    .randomBytes(len)
    .toString('base64')
    .replace(/\+/g, 'a')
    .replace(/\//g, 'b')
    .replace(/=/g, 'c');

module.exports = {
  getToken: () => {
    let token;
    let invalid = false;

    if (fs.existsSync(TOKEN_FILE)) {
      // If token file exist, check if it's already expired
      // If expired or failed to read json, mark invalid = true
      try {
        const json = fs.readJSONSync(TOKEN_FILE);
        if (json.expires < Date.now()) {
          invalid = true;
        } else {
          token = json.token;
        }
      } catch (err) {
        invalid = true;
      }
    }

    if (!fs.existsSync(TOKEN_FILE) || invalid) {
      token = genSid(32);
      fs.writeJSONSync(TOKEN_FILE, {
        expires: Date.now() + 3 * 30 * 24 * 3600 * 1000, // expires every 90 days
        token,
      });
    }
    return token;
  },
  validator: token => {
    return (req, res, next) => {
      if (!req.originalUrl || !req.originalUrl.match(/^\/(api|terminals)\//)) {
        next();
        return;
      }
      // Sec-WebSocket-Protocol is a workaround for passing authorization header for websocket connection
      const t = req.headers && (req.headers.authorization || req.headers['sec-websocket-protocol']);

      if (!t || t !== token) {
        res.statusCode = 403;
        res.write('Forbidden.');
        res.end();
        return;
      }
      next();
    };
  },
};
