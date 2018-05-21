var passport = require('passport');
var LocalStategy = require('passport-local').Strategy;
var hash = require('./hash.js');
var validate = require('./validate.js');

function login(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json(info);
    req.login(user, err => {
      if (err) return next(err);
      res.end();
    });
  })(req, res, next);
}

exports.init = (app, db) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStategy((username, password, done) => {
    db.getUser({username: username}).then(user => {
      if (user == null) {
        done(null, false, { message: 'Invalid username' });
        return;
      }
      hash.verify(password, user.password).then(verified => {
        if (!verified) return done(null, false, { message: 'Incorrect password' });
        done(null, user);
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    db.getUser({_id: id}).then(user => {
      done(null, user);
    });
  });

  app.post('/signup', (req, res, next) => {
    var user = {
      username: req.body.username,
      password: req.body.password
    };
    if (!validate.signup(user)) {
      res.status(401).json({
        message: 'Invalid credentials'
      });
      return;
    }
    db.usernameTaken(user.username).then(taken => {
      if (taken) {
        res.status(401).json({
          message: 'Username taken'
        });
        throw new Error('User input error');
      }
      return hash.encrypt(user.password);
    }).then(hash => {
      user.password = hash;
      db.saveUser(user).then(() => next());
    }).catch(err => {
      if (err.message == 'User input error') return;
      throw err;
    });
  }, passport.authenticate('local'), (req, res) => {
    res.end();
  });

  app.post('/login', login);

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};
