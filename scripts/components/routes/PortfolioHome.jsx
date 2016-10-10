var React = require('react');
var Analytics = require('../containers/Analytics.jsx');

var PortfolioHome = React.createClass({

	render: function() {
		return (
			<Analytics wide={true} />
		);
	}

});

module.exports = PortfolioHome;
