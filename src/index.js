var express = require('express');
var app = express();
var mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
var server = require('http').createServer(app);
var React = require('react');
var reactDOMServer = require('react-dom/server');
var {StaticRouter} = require('react-router');
var App = require('./components/app.js');

var port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('*', function (req, res) {
  var context = {};
  var router = reactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );
  if (context.url) {
    res.redirect(context.status, context.url);
  }
  res.render('index', {
    router: router
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
