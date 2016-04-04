var React = require('react'),
		AppBar = require('material-ui').AppBar,
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		IconMenu = require('material-ui').IconMenu,
		IconButton = require('material-ui').IconButton,
		AccountIcon = require('react-icons/lib/md/account-circle'),
		MenuItem = require('material-ui').MenuItem,
		Auth = require('../../vendor/jtoker.js'),
		PubSub = require('pubsub-js'),
		Link = require('react-router').Link,
//		Navigation = require('react-router').Navigation,
//		Link = require(react-router).Link,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var TopNavigation = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("NavigationStore")],
	componentWillMount: function() {
		if (!this.getStateFromFlux().assetsLoaded && !this.getStateFromFlux().loading) {
			//this.getFlux().actions.loadAssets();
		}
		var st = PubSub.subscribe('auth.validation.success', function(ev, user) {
			this.setState({name: user.name, image: user.image, permissions: user.permissions});
		}.bind(this));
		var rt = PubSub.subscribe('auth.emailRegistration.success', function(ev, user) {
			var user = user.data;
			this.setState({name: user.name, image: user.image, permissions: user.permissions});
		}.bind(this));
		var ut = PubSub.subscribe('auth.signOut.success', function(ev, user) {
			this.setState({name: null, image: null});
		}.bind(this));
		this.setState({st: st, ut: ut, rt: rt});

		if (window.location.href.indexOf('home') > 0 || window.location.href.indexOf('account_login') > 0) {
			this.getFlux().actions.setBreadcrumb("teneo");
		}
	},
	componentWillUnmount: function() {
		PubSub.unsubscribe(this.state.st);
		PubSub.unsubscribe(this.state.ut);
		PubSub.unsubscribe(this.state.rt);
	},
	signOut: function() {
		Auth.signOut();
	},
	componentWillReceiveProps: function(nextProps) {
		if (window.location.href.indexOf('home') > 0 || window.location.href.indexOf('account_login') > 0) {
			this.getFlux().actions.setBreadcrumb("teneo");
		}
	},
	getStateFromFlux: function() {
		return this.getFlux().store("NavigationStore").getState();
	},

	render: function() {
		if (window.location.href.indexOf('home') > 0 || window.location.href.indexOf('account_login') > 0) {
			return null;
		}
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
		var barStyle = {
			backgroundColor: "white",
			marginLeft: 256,
			width: "calc(100% - 256px)"
		}
		if (window.location.href.indexOf('home') > 0 || window.location.href.indexOf('account_login') > 0) {
			barStyle = {
			backgroundColor: "white",
			marginLeft: 0,
			width: "100%"
			}
		}

		//style={{ backgroundColor: "white", marginLeft: 256, width: "calc(100% - 256px)"}}

		//if (this.getFlux().store("NavigationStore").getState().currentView === 'home') {
		//	this.getFlux().actions.setBreadcrumb("teneo");
			//marginLeft = 0;
		//}
			//return <div style={{height: 80, width: "100%", backgroundColor: "green"}}></div>
		return (
			<AppBar
				title={<span style={{color: '#4a4a4a', textTransform: 'uppercase', letterSpacing: '3px' }}><Link style={{textDecoration: 'none', color: '#4a4a4a'}} to={link}>{this.state.title}</Link></span>}
				showMenuIconButton={false}
				style={barStyle}
				iconElementRight={
					<IconMenu
						iconButtonElement={
							<IconButton style={{marginRight: 20}}> <AccountIcon style={{color: "#33363b",  marginTop: -10,  height: 50, width: 50}}/> </IconButton>
						}
						targetOrigin={{horizontal: 'right', vertical: 'top'}}
						anchorOrigin={{horizontal: 'right', vertical: 'top'}}
					>
						<MenuItem
							onTouchTap={this.signOut}
							primaryText="Sign Out" />
					</IconMenu>
				}
				/>
		);
	}

});

module.exports = TopNavigation;
