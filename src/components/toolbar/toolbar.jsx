var React = require('react');
var Nav = require('./nav.jsx');
var User = require('./user.jsx');

module.exports = class Toolbar extends React.Component {
  render() {
    return (
      <div className='toolbar'>
        <Nav loggedIn={this.props.user != undefined} logout={this.props.logout} />
        {this.props.user ? <User user={this.props.user} /> : undefined}
      </div>
    );
  }
};
