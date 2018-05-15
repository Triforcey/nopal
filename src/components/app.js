var React = require('react');
var Home = require('./home.js');
var Login = require('./login.js');
var Logout = require('./logout.js');
var Clock = require('./clock.js');
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
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/login'>Login</Link></li>
          <li><Link to='/signup'>Sign up</Link></li>
          <li><Link to='/logout'>Logout</Link></li>
          <li><Link to='/clock'>Clock</Link></li>
        </ul>
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
