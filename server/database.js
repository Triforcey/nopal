var { MongoClient, ObjectID } = require('mongodb');

function setObjectId(object) {
  if (typeof object._id == 'undefined') return object;
  try {
    object._id = new ObjectID(object._id);
  } catch (e) {
    return null;
  }
  return object;
}

exports.connect = options => {
  return new Promise((resolve, reject) => {
    var { url, dbName } = options;
    if (typeof url == 'undefined') url = 'mongodb://localhost:27017';
    if (typeof dbName == 'undefined') dbName = 'nopal';
    MongoClient.connect(url, {
      useNewUrlParser: true
    }).then((client) => {
      var db = client.db(dbName);
      resolve({
        db: db,
        saveUser: user => {
          return new Promise((resolve, reject) => {
            db.collection('users').save(user).then(resolve);
          });
        },
        getUser: (user, options) => {
          return new Promise((resolve, reject) => {
            var objectId = user._id;
            setObjectId(user);
            if (user == null) reject(new Error(`Invalid ObjectID: ${objectId}`));
            db.collection('users').findOne(user, options).then(resolve);
          });
        },
        usernameTaken: name => {
          return new Promise((resolve, reject) => {
            var size = db.collection('users').find({ username: name }).limit(1).count().then(count => {
              resolve(count ? true : false);
            });
          });
        }
      });
    });
  });
};
