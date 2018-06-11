var uuid = require('uuid/v4');
exports.createUUID = () => {
  return new Promise((resolve, reject) => {
    resolve(uuid());
  });
};
