var React = require('react'),
		CircularProgress = require('material-ui').CircularProgress;

var DashboardSpinner = React.createClass({
	render: function() {
		return (
			<div className="dashboard-module">
				<div className="top">
					<div className="drag-handle"></div>
					<div className="top-title">{this.props.title}</div>
				</div>
				<div className="main">
					<div style={{marginTop: 50, display: 'flex', justifyContent: 'center'}}>
						<CircularProgress size={2} />
					</div>
				</div>
			</div>
		)
	}

});

module.exports = DashboardSpinner;
