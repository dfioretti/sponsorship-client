var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		StoreWatchMixin = Fluxxor.StoreWatchMixin,
		DashIcon = require('react-icons/lib/fa/dashboard'),
		DashboardCard = require('../dashboards/modules/DashboardCard.jsx'),
	//	DashboardMixin = require('../mixins/dashboard_mixin.jsx'),
//		ScoreCard = require('./ScoreCard.jsx'),
		Link = require('react-router').Link;


var DashboardIndex = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("DashboardHomeStore")],

	getStateFromFlux: function() {
		return this.getFlux().store("DashboardHomeStore").getState();
	},
	componentDidMount: function() {
		this.getFlux().actions.setCurrentNav("dashboard", null);
		this.getFlux().actions.setBreadcrumb("Dashboards");
		if (!this.state.dashboardsLoaded && !this.state.loading) {
			this.getFlux().actions.loadDashboards();
		}
		if (this.state.dashboardsLoaded)
			this.setupGrid();
	},
	componentDidUpdate: function() {
		//this.getFlux().actions.setCurrentNav("dashboard", null);
		//this.getFlux().actions.setBreadcrumb("Dashboards");
		if (this.state.dashboardsLoaded)
			this.setupGrid();
	},
	setupGrid: function() {
		$('.modules-container').shapeshift({
			selector: ".dashboard-module",
			handle: ".drag-handle",
			align: "left",
			minColumns: 2,
			autoHeight: false,
			gutterX: 20,
			gutterY: 20,
			paddingX: 20,
			paddingY: 20
		});
	},
	render: function() {
		return (
			<div className="dashboard">
				<div className="modules-box">
					<div className="modules-container">
						{this.state.customDashboards.map(function(dash) {
							return <DashboardCard key={dash.id} dashboard={dash} />
						})}
					</div>
				</div>
			</div>
		)
	}
});

module.exports = DashboardIndex;
