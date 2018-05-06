var React = require('react');
var Home = require('./home.js');
var Clock = require('./clock.js');
var {BrowserRouter, Route, Link} = require('react-router-dom');
module.exports = class Navigator extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/clock">Clock</Link></li>
        </ul>
        <Route exact path="/" component={Home} />
        <Route path="/clock" component={Clock} />
      </div>
    );
  }
}
