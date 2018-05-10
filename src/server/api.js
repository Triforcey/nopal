var content = require('./content.js');

module.exports = (req) => {
  return new Promise((resolve, reject) => {
    var path = req.path.split('/');
    path.splice(0, 1);
    if (path[0] == '' && req.user) {
      resolve(JSON.stringify(req.user));
      return;
    }
    content.test(req.path).then(resolve);
  });
};
