var React = require('react');
var withRouter = require('react-router-dom').withRouter;
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      pwd: '',
      rememberMe: true,
      err: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.send = this.send.bind(this);
  }
  handleChange(e) {
    var newState = {};
    var value = e.target.type == 'checkbox' ? e.target.checked : e.target.value;
    newState[e.target.name] = value;
    this.setState(newState);
  }
  send() {
    fetch(this.props.signup ? '/signup' : '/login', {
      method: 'post',
      body: JSON.stringify({
        username: this.state.name,
        password: this.state.pwd,
        rememberMe: this.state.rememberMe
      }),
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'same-origin'
    }).then(res => {
      if (res.status != 200) {
        res.json().then(data => this.setState({
          err: data.message
        }));
        return;
      };
      this.props.getUser();
      this.props.history.push('/');
    });
  }
  render() {
    return (
      <div>
        <input name='name' value={this.state.name} onChange={this.handleChange} />
        <input name='pwd' type='password' value={this.state.pwd} onChange={this.handleChange} />
        <input name='rememberMe' type='checkbox' checked={this.state.rememberMe} onChange={this.handleChange} />
        <button onClick={this.send}>{this.props.signup ? 'Sign Up' : 'Login'}</button>
        <p>{this.state.err}</p>
      </div>
    );
  }
}
module.exports = withRouter(Login);
