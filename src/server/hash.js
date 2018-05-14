var bcrypt = require('bcrypt');
var hashCost = process.env.HASH_COST || 12;

exports.encrypt = pwd => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(pwd, hashCost).then(resolve);
  });
};

exports.verify = (pwd, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pwd, hash).then(resolve);
  });
};
