var React = require('react');
module.exports = class Clock extends React.Component {
  render() {
    return (
      <p>Hello world! {Date.now()}</p>
    );
  }
}
