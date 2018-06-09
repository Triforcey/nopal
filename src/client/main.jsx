var React = require('react');
var ReactDOM = require('react-dom');
var {BrowserRouter, Route, Link} = require('react-router-dom');
var App = require('../components/app.jsx');
var path = require('path');
var httpOptions = {
  credentials: 'same-origin'
};
var api = fetch(path.join('/api', location.pathname), httpOptions);
var user = fetch(path.join('/user'), httpOptions);
Promise.all([api, user]).then(values => (
  Promise.all(values.map(res => {
    if (res.status == 401) return new Promise((resolve, reject) => {
      resolve(undefined);
    });
    return res.json();
  }))
)).then(values => {
  ReactDOM.hydrate(
    <BrowserRouter>
      <App data={values[0]} user={values[1]} />
    </BrowserRouter>,
    router
  );
});
