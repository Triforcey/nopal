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

class NotFoundError {
  constructor(msg) {
    this.message = msg;
  }
}

exports.connect = options => {
  return new Promise((resolve, reject) => {
    var { url, dbName } = options;
    if (typeof url == 'undefined') url = 'mongodb://localhost';
    if (typeof dbName == 'undefined') dbName = 'nopal';
    MongoClient.connect(url).then((client) => {
      var db = client.db(dbName);
      var users = db.collection('users');
      var rememberMeTokens = db.collection('rememberMeTokens');
      resolve({
        db: db,
        saveUser: user => {
          return new Promise((resolve, reject) => {
            users.insertOne(user).then(resolve);
          });
        },
        getUser: (user, options) => {
          return new Promise((resolve, reject) => {
            var objectId = user._id;
            setObjectId(user);
            if (user == null) reject(new Error(`Invalid ObjectID: ${objectId}`));
            users.findOne(user, options).then(resolve);
          });
        },
        usernameTaken: name => {
          return new Promise((resolve, reject) => {
            users.find({ username: name }).limit(1).count().then(count => {
              resolve(count ? true : false);
            });
          });
        },
        rememberMeTokens: {
          setTTL: (milliseconds) => {
            rememberMeTokens.ensureIndex({ createdAt: 1 }, { expireAfterSeconds: milliseconds / 1000 });
          },
          save: (id, token) => {
            return rememberMeTokens.insertOne({
              user: id,
              token: token,
              createdAt: new Date()
            });
          },
          consume: token => {
            return new Promise((resolve, reject) => {
              rememberMeTokens.findOneAndDelete({ token: token }).then(result => {
                result = result.value;
                if (!result) {
                  resolve(null);
                  throw new NotFoundError('No such token');
                }
                return users.findOne({ _id: result.user });
              }).then(resolve).catch(err => {
                if (err instanceof NotFoundError) return;
                throw err;
              });
            });
          }
        }
      });
    });
  });
};
