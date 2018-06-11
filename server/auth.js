var passport = require('passport');
var LocalStategy = require('passport-local').Strategy;
var hash = require('./hash.js');
var validate = require('./validate.js');
var User = require('./user.js');
var RememberMe = require('./remember-me.js');

exports.init = (app, db) => {
  app.use(passport.initialize());
  app.use(passport.session());

  var rememberMe = RememberMe.connect(app, passport, db, parseInt(process.env.COOKIE_MAX_AGE) || 604800000);

  function login(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json(info);
      new Promise(function(resolve, reject) {
        req.login(user, err => {
          if (err) return reject(err);
          resolve();
        });
      }).then(() => {
        if (!req.body.rememberMe) return res.end();
        rememberMe.saveToken(user._id, res).then(() => {
          res.end();
        });
      }).catch(next);
    })(req, res, next);
  }

  passport.use(new LocalStategy((username, password, done) => {
    db.getUser({ username: username }).then(user => {
      if (user == null) {
        let err = new User.Error('Invalid username');
        done(null, false, err);
        throw err;
      }
      hash.verify(password, user.password).then(verified => {
        if (!verified) {
          let err = new User.Error('Incorrect password');
          done(null, false, err);
          throw err;
        }
        done(null, user);
      }).catch(err => {
        if (err instanceof User.Error) return;
        throw err;
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    var projection = {};
    for (var i = 0; i < User.secretValues.length; i++) {
      projection[User.secretValues[i]] = false;
    }
    db.getUser({ _id: id }, {
      fields: projection
    }).then(user => {
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
    res.clearCookie('remember_me');
    res.redirect('/');
  });

  app.get('/user', (req, res) => {
    if (!req.user) return res.status(401).json(new User.Error('Not logged in'));
    res.json(req.user);
  });
};
