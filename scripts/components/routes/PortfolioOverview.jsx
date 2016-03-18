var React = require('react');
var AppSidebar = require('../sidebar/app_sidebar.jsx');
var OverviewContent = require('../overview/OverviewContent.jsx');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var PortfolioOverview = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("OverviewStore")],
	getStateFromFlux: function() {
		return this.getFlux().store("OverviewStore").getState();
	},
	render: function () {
		return (
			<div className="overview">
				<AppSidebar context="overview" />
				<OverviewContent entity="portfolio" view={this.getStateFromFlux().selectedPane} />
			</div>
		)
	}
});
module.exports = PortfolioOverview;
