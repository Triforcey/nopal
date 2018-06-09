var React = require('react');
var { Link } = require('react-router-dom');

module.exports = class Nav extends React.Component {
  render() {
    return (
      <div className='nav'>
        <Link to='/'>Home</Link>
        <Link to='/clock'>Clock</Link>
        {this.props.loggedIn ? (
          <span>
            <span className='link' onClick={this.props.logout}>Logout</span>
          </span>
        ) : (
          <span>
            <Link to='/login'>Login</Link>
            <Link to='/signup'>Sign Up</Link>
          </span>
        )}
      </div>
    );
  }
};
