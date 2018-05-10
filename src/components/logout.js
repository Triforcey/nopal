var React = require('react');
var withRouter = require('react-router-dom').withRouter;
class Logout extends React.Component {
  constructor(props) {
    super(props);
    fetch('/logout', {
      credentials: 'same-origin'
    }).then(res => {
      this.props.history.push('/');
    });
  }
  render() {
    return (
      <p>Logging out...</p>
    );
  }
}
module.exports = withRouter(Logout);
