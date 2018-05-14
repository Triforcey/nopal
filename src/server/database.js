var { MongoClient, ObjectID } = require('mongodb');
var db;

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
    var {url, dbName} = options;
    if (typeof url == 'undefined') url = 'mongodb://localhost';
    if (typeof dbName == 'undefined') dbName = 'nopal';
    MongoClient.connect(url).then((client) => {
      db = client.db(dbName);
      resolve(db);
    });
  });
};

exports.saveUser = user => {
  return new Promise((resolve, reject) => {
    db.collection('users').save(user).then(resolve);
  });
};

exports.getUser = user => {
  return new Promise((resolve, reject) => {
    var objectId = user._id;
    user = setObjectId(user);
    if (user == null) reject(new Error(`Invalid ObjectID: ${objectId}`));
    db.collection('users').findOne(user).then(resolve);
  });
};

exports.usernameTaken = name => {
  return new Promise((resolve, reject) => {
    var size = db.collection('users').find({ username: name }).limit(1).count().then(count => {
      resolve(count ? true : false);
    });
  });
};
