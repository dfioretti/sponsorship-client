var React = require('react');
var DashIcon = require('react-icons/lib/fa/dashboard');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var Link = require('react-router').Link;
var Navigation = require('react-router').Navigation;

var DashboardCard = React.createClass({
	mixins: [FluxMixin, Navigation],

	handleDashClick: function(e) {
		this.getFlux().actions.setCurrentNav("dashboard", this.props.dashboard.id);
		this.transitionTo('/apt/dashboard/' + this.props.dashboard.id);
	},
	render: function() {
		return (
			<div className="dashboard-module">
				<div className="top">
					<div className="drag-handle"></div>
					<div className="top-title">
						{this.props.dashboard.name}
					</div>
				</div>
				<div className="main">
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<DashIcon onClick={this.handleDashClick} style={{cursor: 'pointer', height: 220, width: 220, color: 'white'}} />
				</div>
				</div>
			</div>
		);
	}
});

module.exports = DashboardCard;
