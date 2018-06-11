require('babel-register')({
  extensions: ['.jsx'],
  presets: ['react']
});

var path = require('path');
var db = require('./server/database.js');

var express = require('express');
var app = express();

if (process.env.NODE_ENV == 'production') {
  app.use('/scripts', express.static('dist/scripts'));
} else {
  let webpack = require('webpack');
  let middleware = require('webpack-dev-middleware');
  let config = require('./webpack.config.js');
  app.use('/scripts', middleware(webpack(config)));
}

var helmet = require('helmet');

var sessionSecret = 'keyboard cat';

var secure = false;
if (process.env.SECURE == 'true') {
  secure = true;
  app.use(helmet());
  app.set('trust proxy', true);
  sessionSecret = process.env.SESSION_SECRETS.split(',');
  app.use((req, res, next) => {
    if (req.get('X-Forwarded-Proto') == 'http') {
      res.redirect('https://' + req.get('host') + req.originalUrl);
      return;
    }
    next();
  });
}

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var cookieParser = require('cookie-parser')
app.use(cookieParser(sessionSecret, {
  secure: process.env.SECURE == 'true' ? true : false
}));

var session = require('express-session');

var MongoStore = require('connect-mongo')(session);

var auth = require('./server/auth.js');

var mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

var server = require('http').createServer(app);

var React = require('react');
var reactDOMServer = require('react-dom/server');
var { StaticRouter } = require('react-router');
var App = require('./src/components/app.jsx');

var api = require('./server/api.js');

var port = process.env.PORT || 3000;

db.connect({
  url: process.env.DB_URL,
  dbName: process.env.DB_NAME
}).then(db => {
  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: secure
    },
    store: new MongoStore({
      db: db.db
    })
  }));

  app.use(express.static('public'));

  auth.init(app, db, secure);

  app.use('/api', (req, res) => {
    api(req).then(data => {
      res.json(data);
    });
  });

  app.get('*', function (req, res) {
    api(req).then(data => {
      var context = {};
      var router = reactDOMServer.renderToString(
        React.createElement(StaticRouter, {
          location: req.url,
          context: context
        }, React.createElement(App, { data: data, user: req.user }))
      );
      if (context.url) {
        res.redirect(context.status, context.url);
      }
      res.render('index', {
        router: router
      });
    });
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('500');
  });

  server.listen(port, function () {
    console.log(`Listening on port ${port}!`);
  });
});
