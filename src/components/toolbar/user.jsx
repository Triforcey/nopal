var React = require('react');

module.exports = class Nav extends React.Component {
  render() {
    return (
      <div className='user'>
        <span>{this.props.user.username}</span>
      </div>
    );
  }
};
