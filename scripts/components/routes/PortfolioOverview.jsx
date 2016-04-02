var React = require('react');
var AppSidebar = require('../sidebar/app_sidebar.jsx');
var OverviewContent = require('../overview/OverviewContent.jsx');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var Navigation = require('react-router').Navigation;
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var PortfolioOverview = React.createClass({
	mixins: [FluxMixin, Navigation, StoreWatchMixin("OverviewStore")],
	getStateFromFlux: function() {
		return this.getFlux().store("OverviewStore").getState();
	},
	render: function () {
		if (this.getStateFromFlux().selectedPane === 'Overview') this.transitionTo('/');
		return (
			<div className="overview">
				<OverviewContent entity="portfolio" view={this.getStateFromFlux().selectedPane} />
			</div>
		)
	}
});
module.exports = PortfolioOverview;
