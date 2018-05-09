var content = require('./content.js');

/*exports.init = app => {
  app.use('/api', (req, res) => {
    var apiPath = req.path.split('/');
    apiPath.splice(0, 1);
    apiPath = apiPath.join('/');
    data.test(apiPath).then(data => {
      res.json(data);
    });
  });
};*/

module.exports = (apiPath, callback) => {
  return new Promise(async (resolve, reject) => {
    var data = await content.test(apiPath);
    resolve(data);
  });
};
