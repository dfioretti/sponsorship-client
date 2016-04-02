var React = require('react');
var AppSidebar = require('../sidebar/app_sidebar.jsx');
var OverviewContent = require('../overview/OverviewContent.jsx');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Navigation = require('react-router').Navigation;
var Immutable = require('immutable');

var EntityOverview = React.createClass({
	mixins: [FluxMixin, Navigation, StoreWatchMixin("OverviewStore"), StoreWatchMixin("DataStore")],
	getInitialState: function() {
		return Immutable.Map();
	},
	componentWillMount: function() {
		if (!this.getFlux().store("DataStore").getState().dataLoaded &&
				!this.getFlux().store("DataStore").getState().loading) {
				this.getFlux().actions.loadData();
		}
	},
	getStateFromFlux: function() {
		return {};
	},
	getViewFromFlux: function() {
		return this.getFlux().store("OverviewStore").getState();
	},
	render: function () {
		if (this.getStateFromFlux().selectedPane === 'Overview') this.transitionTo('/');

		return (
			<div className="overview">
				<AppSidebar context="overview" />
				<OverviewContent entity="entity" view={this.getViewFromFlux().selectedPane} />
			</div>
		)
	}
});
module.exports = EntityOverview;
