var React = require('react');
var Nav = require('./nav.jsx');

module.exports = class Toolbar extends React.Component {
  render() {
    return (
      <div className='toolbar'>
        <Nav />
      </div>
    );
  }
};
