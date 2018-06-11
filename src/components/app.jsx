var React = require('react');
var Home = require('./home.jsx');
var Login = require('./login.jsx');
var Clock = require('./clock.jsx');
var Toolbar = require('./toolbar/toolbar.jsx');
var { BrowserRouter, Switch, Route, Link, withRouter, Redirect } = require('react-router-dom');
var path = require('path');
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      user: this.props.user
    };
    this.getUser = this.getUser.bind(this);
    this.logout = this.logout.bind(this);
  }
  componentDidMount() {
    this.unlisten = this.props.history.listen((location) => {
      this.setState({
        data: undefined
      });
      fetch(path.join('/api', location.pathname), {
        credentials: 'same-origin'
      }).then(res => {
        // prevents race conditions
        if (window.location.pathname != location.pathname) return;
        res.json().then(data => {
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
  getUser() {
    fetch('/user', {
      credentials: 'same-origin'
    }).then(res => {
      if (res.status == 401) return new Promise((resolve, reject) => {
        resolve(undefined);
      });
      return res.json();
    }).then(data => {
      this.setState({
        user: data
      });
    });
  }
  logout() {
    fetch('/logout', {
      credentials: 'same-origin'
    }).then(res => {
      this.setState({
        user: undefined
      });
      this.props.history.push('/');
    });
  }
  render() {
    return (
      <div>
        <Toolbar user={this.state.user} logout={this.logout} />
        <Route component={() => (
          <p>{typeof this.state.data != 'undefined' ? this.state.data : '...'}</p>
        )} />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={() => (<Login getUser={this.getUser} />)} />
          <Route exact path='/signup' component={() => (<Login getUser={this.getUser} signup={true} />)} />
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
