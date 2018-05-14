var path = require('path');
var db = require('./database.js');

var express = require('express');
var app = express();

if (process.env.SECURE == 'true') {
  app.use((req, res) => {
    if (req.get('X-Forwarded-Proto') == 'http') {
      res.redirect('https://' + req.get('host') + req.originalUrl);
    }
  });
}

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var session = require('express-session');

var MongoStore = require('connect-mongo')(session);

var auth = require('./auth.js');

var mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

var server = require('http').createServer(app);

var React = require('react');
var reactDOMServer = require('react-dom/server');
var { StaticRouter } = require('react-router');
var App = require('../components/app.js');

var api = require('./api.js');

var port = process.env.PORT || 3000;

db.connect({
  url: process.env.DB_URL,
  dbName: process.env.DB_NAME
}).then(db => {
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.SECURE == 'true' ? true : false
    },
    store: new MongoStore({
      db: db
    })
  }));

  app.use(express.static('public'));

  auth.init(app);

  app.use('/api', (req, res) => {
    api(req).then(data => {
      res.json(data);
    });
  });

  app.get('*', function (req, res) {
    api(req).then(data => {
      var context = {};
      var router = reactDOMServer.renderToString(
        <StaticRouter location={req.url} context={context}>
          <App data={data} />
        </StaticRouter>
      );
      if (context.url) {
        res.redirect(context.status, context.url);
      }
      res.render('index', {
        router: router
      });
    });
  });

  app.use((req, res, next) => {
    res.status(404).send('404');
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('500');
  });

  server.listen(port, function () {
    console.log(`Listening on port ${port}!`);
  });
});
