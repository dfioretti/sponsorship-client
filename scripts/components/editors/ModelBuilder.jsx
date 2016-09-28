var React = require('react');
var MetricBuilder = require('./MetricBuilder.jsx');

var ModelBuilder = React.createClass({

	render: function() {
		return (
			<div>
				<MetricBuilder />
			</div>
		);
	}

});

module.exports = ModelBuilder;
