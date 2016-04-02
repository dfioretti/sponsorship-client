var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Navigation = require('react-router').Navigation,
		ReactBootstrap = require('react-bootstrap'),
		HomeIcon = require('react-icons/lib/fa/home'),
		DataIcon = require('react-icons/lib/fa/database'),
		CalIcon = require('react-icons/lib/fa/calendar'),
		List = require('material-ui').List,
		ListItem = require('material-ui').ListItem,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var OverviewContextMenu = React.createClass({
  mixins: [FluxMixin, Navigation, StoreWatchMixin("OverviewStore")],

	handleHomeTap: function() {
		this.getFlux().actions.changeOverviewPane('Overview');
		var navState = this.getFlux().store("NavigationStore").getState();
		if (navState.currentId === null) {
			this.transitionTo('portfolio_dashboard');
		} else {
			this.transitionTo('apt/asset/dashboard' + currentId);
		}
	},
	handleDataTap: function() {
		this.getFlux().actions.changeOverviewPane("Data");
		var navState = this.getFlux().store("NavigationStore").getState();
		if (navState.currentId === null) {
			this.transitionTo('portfolio_overview');
		} else {
			this.transitionTo('asset_overview');
		}

	},
	handleCalendarTap: function() {
		this.getFlux().actions.changeOverviewPane("Calendar");
		var navState = this.getFlux().store("NavigationStore").getState();
		if (navState.currentId === null) {
			this.transitionTo('portfolio_overview');
		} else {
			this.transitionTo('asset_overview');
		}
	},
  getStateFromFlux: function() {
		return this.getFlux().store("OverviewStore").getState();
  },
  render: function() {
		var itemStyle = {
			color: '#9e9e9e',
			textTransform: 'uppercase',
			letterSpacing: '1.5px'
		}
		var itemStyleActive = {
			color: '#4a4a4a',
			backgroundColor: "#e7e7e7",
			textTransform: 'uppercase',
			letterSpacing: '1.5px'
		}
		return (
			<div className="context-menu">
				<div className="editor-menu">
					<List>
						{this.getStateFromFlux().menuItems.map(function(i) {
							var icon = null;
							var tap = null;
							switch (i) {
								case 'Overview':
										icon = <HomeIcon />
										tap = this.handleHomeTap;
										break;
								case 'Data':
										icon = <DataIcon />
										tap = this.handleDataTap;
										break;
								case 'Calendar':
										icon = <CalIcon />
										tap = this.handleCalendarTap;
										break;
							}
							if (this.getStateFromFlux().selectedPane == i) {
								return (
									<ListItem ref={i} onTouchTap={tap} style={itemStyleActive} leftIcon={icon} key={i} primaryText={i} />
								)
							} else {
								return (
									<ListItem ref={i} onTouchTap={tap} style={itemStyle} leftIcon={icon} key={i} primaryText={i} />
								);
							}
						}.bind(this))}
					</List>
				</div>
			</div>
	);
  }
});
module.exports = OverviewContextMenu;
