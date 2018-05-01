var express = require('express');
var app = express();
var mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
var server = require('http').createServer(app);

var React = require('react');
var reactDOMServer = require('react-dom/server');
var Clock = require('./components/clock.js');

var port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', {
    clock: reactDOMServer.renderToString(<Clock />)
  });
});

server.listen(port, function () {
  console.log(`Listening on port ${port}!`);
});
