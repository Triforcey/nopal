var React = require('react');
<<<<<<< HEAD:src/components/app.jsx
var Home = require('./home.jsx');
var Login = require('./login.jsx');
var Logout = require('./logout.jsx');
var Clock = require('./clock.jsx');
var Toolbar = require('./toolbar.jsx');
=======
var Home = require('./home.js');
var Login = require('./login.js');
var Logout = require('./logout.js');
var Clock = require('./clock.js');
var Toolbar = require('./toolbar.js');
>>>>>>> eaa0b549de0f788b84d03e12ab941cd3489d38ab:src/components/app.js
var { BrowserRouter, Switch, Route, Link, withRouter, Redirect } = require('react-router-dom');
var path = require('path');
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    };
  }
  componentDidMount() {
    this.unlisten = this.props.history.listen((location) => {
      this.setState({
        data: undefined
      });
      fetch(path.join('/api', location.pathname), {
        credentials: 'same-origin'
      }).then((res) => {
        // prevents race conditions
        if (window.location.pathname != location.pathname) return;
        res.json().then((data) => {
          this.setState({
            data: data
          });
        });
      });
    });
  }
  componentWillUnmount() {
    this.unlisten();
  }
  render() {
    return (
      <div>
        {/*<ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/login'>Login</Link></li>
          <li><Link to='/signup'>Sign up</Link></li>
          <li><Link to='/logout'>Logout</Link></li>
          <li><Link to='/clock'>Clock</Link></li>
        </ul>*/}
        <Toolbar />
        <Route component={() => (
          <p>{typeof this.state.data != 'undefined' ? this.state.data : '...'}</p>
        )} />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={() => (<Login signup={true} />)} />
          <Route exact path='/logout' component={Logout} />
          <Route path='/clock' component={Clock} />
          <Route component={() => (
            <p>404</p>
          )} />
        </Switch>
      </div>
    );
  }
}
module.exports = withRouter(App);
