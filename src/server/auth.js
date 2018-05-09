var passport = require('passport');
var LocalStategy = require('passport-local').Strategy;
var db = require('./database.js');
var validate = require('./validate.js');

exports.init = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStategy((username, password, done) => {
    db.getUser({username: username}, user => {
      if (password != user.password) {
        done(null, false);
      }
      done(null, user);
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    db.getUser({_id: id}, user => {
      done(null, user);
    });
  });

  app.post('/signup', (req, res, next) => {
    if (!validate.signup(req.body)) {
      res.redirect('/');
      return;
    }
    db.saveUser(req.body, () => {
      next();
    });
  }, passport.authenticate('local', {
    successRedirect: '/clock',
    failureRedirect: '/'
  }));

  app.post('/login', passport.authenticate('local', {
    successRedirect: '/clock',
    failureRedirect: '/'
  }));

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};
