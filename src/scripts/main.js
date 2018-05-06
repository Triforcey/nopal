var React = require('react');
var ReactDOM = require('react-dom');
/*var Clock = require('../components/clock.js');
clock.innerHTML = '';
ReactDOM.render(<Clock />, clock);
*/
var Router = require('../components/router.js');
ReactDOM.hydrate(<Router />, router);
