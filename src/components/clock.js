var React = require('react');
module.exports = class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: Date.now()
    };
  }
  componentDidMount() {
    var self = this;
    this.timerId = setInterval(function () {
      self.setState({
        date: Date.now()
      });
    }, 1);
  }
  componentWillUnmount() {
    clearInterval(this.timerId);
  }
  render() {
    return (
      <p suppressHydrationWarning={true}>{this.state.date}</p>
    );
  }
}
