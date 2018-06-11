var crypto = require('./crypto.js');
var RememberMeStrategy = require('passport-remember-me').Strategy;
function createToken() {
  return crypto.createToken(64);
}
exports.connect = (app, passport, db, maxAge) => {
  var tokens = db.rememberMeTokens;

  passport.use(new RememberMeStrategy((token, done) => {
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
            res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: maxAge });
            resolve();
          });
        });
      });
    }
  };
};
