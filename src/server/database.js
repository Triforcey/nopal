var { MongoClient, ObjectID } = require('mongodb');
var db;

function setObjectId(object) {
  if (typeof object._id == 'undefined') return object;
  try {
    object._id = new ObjectID(object._id);
  } catch (e) {
    console.error(e);
    return null;
  }
  return object;
}

exports.connect = (options, callback) => {
  var {url, dbName} = options;
  if (typeof url == 'undefined') url = 'mongodb://localhost';
  if (typeof dbName == 'undefined') dbName = 'nopal';
  MongoClient.connect(url, (err, client) => {
    if (err) throw err;
    db = client.db(dbName);
    if (callback) callback();
  });
};

exports.saveUser = async (user, callback) => {
  await db.collection('users').save(user);
  if (callback) callback();
};

exports.getUser = async (user, callback) => {
  user = setObjectId(user);
  if (user === null) return;
  var user = await db.collection('users').findOne(user);
  if (callback) callback(user);
};
