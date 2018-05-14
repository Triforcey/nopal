var passport = require('passport');
var LocalStategy = require('passport-local').Strategy;
var db = require('./database.js');
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

exports.init = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStategy((username, password, done) => {
    db.getUser({username: username}).then(user => {
      if (user == null) {
        done(null, false, { message: 'Invalid username' });
        return;
      }
      if (password != user.password) {
        done(null, false, { message: 'Incorrect password' });
      }
      done(null, user);
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
    if (!validate.signup(req.body)) {
      res.status(401).end();
      return;
    }
    db.usernameTaken(req.body.username).then(taken => {
      if (taken) return res.status(401).json({
        message: 'Username taken'
      });
      db.saveUser(req.body).then(() => {
        next();
      });
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
