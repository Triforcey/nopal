var React = require('react');
var ReactDOM = require('react-dom');
var {BrowserRouter, Route, Link} = require('react-router-dom');
var App = require('../components/app.js');
var path = require('path');
fetch(path.join('/api', location.pathname)).then((res) => {
  res.json().then((data) => {
    ReactDOM.hydrate(
      <BrowserRouter>
        <App data={data} />
      </BrowserRouter>,
      router
    );
  });
});
