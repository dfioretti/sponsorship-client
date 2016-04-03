var React = require('react'),
		AppBar = require('material-ui').AppBar,
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		IconMenu = require('material-ui').IconMenu,
		IconButton = require('material-ui').IconButton,
		AccountIcon = require('react-icons/lib/md/account-circle'),
		MenuItem = require('material-ui').MenuItem,
		Link = require('react-router').Link,
//		Navigation = require('react-router').Navigation,
//		Link = require(react-router).Link,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var TopNavigation = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("NavigationStore")],

	getStateFromFlux: function() {
		return this.getFlux().store("NavigationStore").getState();
	},

	render: function() {
		var link = '/';
		switch (this.state.currentView) {
			case 'dashboard':
				link = 'dashboard_index';
				break;
			case 'score':
			case 'score_editor':
				link = 'score_index';
				break;
			case 'component_editor':
			case 'component':
				link = 'components_index';
				break;
		}
		var navState = this.getFlux().store("NavigationStore").getState();
		var marginLeft = 256;
		if (this.getFlux().store("NavigationStore").getState().currentView === 'home') {
			this.getFlux().actions.setBreadcrumb("teneo");
			//marginLeft = 0;
		}
			//return <div style={{height: 80, width: "100%", backgroundColor: "green"}}></div>
		return (
			<AppBar
				title={<span style={{color: '#4a4a4a', textTransform: 'uppercase', letterSpacing: '3px' }}><Link style={{textDecoration: 'none', color: '#4a4a4a'}} to={link}>{this.state.title}</Link></span>}
				showMenuIconButton={false}
				style={{ backgroundColor: "white", marginLeft: 256, width: "calc(100% - 256)"}}
				iconElementRight={
					<IconMenu
						iconButtonElement={
							<IconButton style={{marginRight: 20}}> <AccountIcon style={{color: "#33363b",  marginTop: -10,  height: 50, width: 50}}/> </IconButton>
						}
						targetOrigin={{horizontal: 'right', vertical: 'top'}}
						anchorOrigin={{horizontal: 'right', vertical: 'top'}}
					>
						<MenuItem primaryText="Sign Out" />
					</IconMenu>
				}
				/>
		);
	}

});

module.exports = TopNavigation;
