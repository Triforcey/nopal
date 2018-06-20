var Uuid = require('../uuid.js');
var crypto = require('../crypto.js');
var RememberMeStrategy = require('passport-remember-me').Strategy;

function createToken() {
  return new Promise((resolve, reject) => {
    var uuid = Uuid.createUUID();
    var token = crypto.createToken(64);
    Promise.all([uuid, token]).then(values => {
      resolve(values.join('-'));
    });
  });
}

exports.connect = (app, passport, db, maxAge, secure) => {
  var tokens = db.rememberMeTokens;
  var cookieOptions = {
    path: '/',
    httpOnly: true,
    maxAge: maxAge,
    secure: secure
  };

  passport.use(new RememberMeStrategy({
    cookie: cookieOptions
  }, (token, done) => {
    tokens.consume(token).then(user => {
      if (!user) return done(null, false);
      done(null, user);
    }).catch(done);
  }, (user, done) => {
    createToken().then(token => {
      tokens.save(user._id, token).then(() => done(null, token));
    }).catch(done);
  }));

  app.use(passport.authenticate('remember-me'));

  tokens.setTTL(maxAge);

  return {
    saveToken: (id, res) => {
      return new Promise((resolve, reject) => {
        createToken().then(token => {
          return tokens.save(id, token).then(() => {
            res.cookie('remember_me', token, cookieOptions);
            resolve();
          });
        });
      });
    }
  };
};
