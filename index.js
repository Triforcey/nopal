var express = require('express');
var app = express();
var mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
var server = require('http').createServer(app);

var React = require('react');
var reactDOM = require('react-dom');
console.log(reactDOM.renderToString);
var Clock = require('./components/clock.js');

var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.render('index');
});

server.listen(port, function () {
  console.log(`Listening on port ${port}!`);
});
