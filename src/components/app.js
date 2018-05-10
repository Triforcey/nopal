var React = require('react');
var Home = require('./home.js');
var Clock = require('./clock.js');
var { BrowserRouter, Switch, Route, Link, withRouter } = require('react-router-dom');
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
      fetch(path.join('/api', location.pathname)).then((res) => {
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
          <li><Link to='/clock'>Clock</Link></li>
        </ul>
        <Route component={() => (
          <p>{typeof this.state.data != 'undefined' ? this.state.data : '...'}</p>
        )} />
        <Switch>
          <Route exact path='/' component={Home} />
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
