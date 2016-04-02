var React = require('react'),
		AppBar = require('material-ui').AppBar,
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		IconMenu = require('material-ui').IconMenu,
		IconButton = require('material-ui').IconButton,
		AccountIcon = require('react-icons/lib/md/account-circle'),
		MenuItem = require('material-ui').MenuItem,
//		Navigation = require('react-router').Navigation,
//		Link = require(react-router).Link,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var TopNavigation = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("NavigationStore")],

	getStateFromFlux: function() {
		return this.getFlux().store("NavigationStore").getState();
	},

	render: function() {
		return (
			<AppBar
				title={<span style={{color: '#4a4a4a', textTransform: 'uppercase', letterSpacing: '3px' }}>{this.state.title}</span>}
				showMenuIconButton={false}
				style={{ backgroundColor: "white", marginLeft: 256, width: "calc(100% - 256px)"}}
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
