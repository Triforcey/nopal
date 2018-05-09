var path = require('path');

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var session = require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  }
}));

var db = require('./database.js');
var auth = require('./auth.js');
auth.init(app);

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

app.use(express.static('public'));

app.use('/api', (req, res) => {
  api(req.path).then(data => {
    res.json(data);
  });
});

app.get('*', function (req, res) {
  api(req.path).then(data => {
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

db.connect({
  url: process.env.DB_URL,
  dbName: process.env.DB_NAME
}, () => {
  server.listen(port, function () {
    console.log(`Listening on port ${port}!`);
  });
});
