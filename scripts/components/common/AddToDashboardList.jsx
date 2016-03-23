var React = require('react');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var AddIcon = require('react-icons/lib/fa/plus');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);

var AddDashboardListItem = React.createClass({
	mixins: [FluxMixin],
	handleAddToDash: function(e) {
		this.getFlux().actions.addComponentToDashboard(this.props.dashboard, this.props.component.id);
	},
	render: function() {
		return (
			<Row>
				<Col md={9}>
					{this.props.dashboard.name}
				</Col>
				<Col onClick={this.handleAddToDash} md={2}>
					<AddIcon id={this.props.dashboard.id} style={{cursor: "pointer", color: "#50e3c2", height: "25px", width: "25px", pointerEvents: "none", padding: "5px", cursor: "pointer"}} />
				</Col>
			</Row>
		)
	}
});
var AddToDashboardList = React.createClass({
	mixins: [FluxMixin],
	render: function() {
		return (
			<div>
			{ this.props.dashboards.map(function(dashboard) {
					return (
						<AddDashboardListItem
							key={dashboard.id}
							component={this.props.component}
							dashboard={dashboard} />
					);
			}.bind(this))}
			</div>
		);
	}
});

module.exports = AddToDashboardList;
