const { v4: uuid } = require('uuid');
exports.createUUID = () => {
  return new Promise((resolve, reject) => {
    resolve(uuid());
  });
};
