var React = require('react');
var App = require('./app.js');
var {BrowserRouter, Route, Link} = require('react-router-dom');
module.exports = class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  }
};
