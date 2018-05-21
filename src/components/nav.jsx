var React = require('react');
var { Link } = require('react-router-dom');

module.exports = class Nav extends React.Component {
  render() {
    return (
      <div>
        <Link to='/'>Home</Link>
        <Link to='/clock'>Clock</Link>
      </div>
    );
  }
};
