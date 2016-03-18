var React = require('react');
var AppSidebar = require('../sidebar/app_sidebar.jsx');
var OverviewContent = require('../overview/OverviewContent.jsx');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Immutable = require('immutable');

var EntityOverview = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("OverviewStore"), StoreWatchMixin("DataStore")],
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
		return (
			<div className="overview">
				<AppSidebar context="overview" />
				<OverviewContent entity="entity" view={this.getViewFromFlux().selectedPane} />
			</div>
		)
	}
});
module.exports = EntityOverview;
