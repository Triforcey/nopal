var crypto = require('crypto');
exports.createToken = (bytes) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (err) return reject(err);
      resolve(buf.toString('base64'));
    });
  });
};
