var content = require('./content.js');

module.exports = (req) => {
  return new Promise((resolve, reject) => {
    content.test(req.path).then(resolve);
  });
};
