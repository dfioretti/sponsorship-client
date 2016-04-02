var React = require('react'),
		LeftNav = require('material-ui').LeftNav,
		AssetSearch = require('./AssetSearch.jsx'),
		Divider = require('material-ui').Divider,
		OverviewContextMenu = require('./OverviewContextMenu.jsx'),
		Fluxxor = require('fluxxor'),
		DashboardContextMenu = require('./DashboardContextMenu.jsx'),
		FluxMixin = Fluxxor.FluxMixin(React),
		TM = require('react-icons/lib/fa/trademark'),
		ScoreEditContextMenu = require('./ScoreEditContextMenu.jsx'),
		Link = require('react-router').Link,
		Navigation = require('react-router').Navigation,
		CreateDashboardModal = require('./CreateDashboardModal.jsx'),
		MainNav = require('./MainNav.jsx'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;


var SideNavigation = React.createClass({
	mixins: [FluxMixin, Navigation, StoreWatchMixin("AssetsStore")],

	componentWillMount: function() {
		if (!this.state.assetsLoaded && !this.state.loading) {
			this.getFlux().actions.loadAssets();
		}
	},
	getInitialState: function() {
	//	return { assets: [], assetsLoaded: false, loading: false }
	},
	getStateFromFlux: function() {
		return this.getFlux().store("AssetsStore").getState();
	},
	handleHomeClick: function() {
		this.getFlux().actions.changeOverviewPane("Overview");
		this.getFlux().actions.setCurrentNav("portfolio", null);
		this.transitionTo('/');
	},
	renderContext: function() {
		var navState = this.getFlux().store("NavigationStore").getState();
		if (navState.currentView == 'dashboard') {
			return (
				<DashboardContextMenu {...this.props} />
			);
		}
		if (navState.currentView !== 'portfolio' && navState.currentView !== 'asset') {
		}
		return (
			<OverviewContextMenu {...this.props} />
		)
	},
	render: function() {
		//<div className="brand-title">Teneo</div>
//	<Divider style={{marginLeft: "10px", marginRight: "10px"}}/>

		//					<Divider style={{marginLeft: "10px", marginRight: "10px"}}/>
/*

*/
		//console.log("path", this.context.router.getCurrentPathName());
		return (
			<LeftNav className="sidenav-top" open={true}>
				<div className='sidenav-top'>
					<CreateDashboardModal id="create-dashboard-modal" flux={this.getFlux()} />
					<img onClick={this.handleHomeClick} style={{cursor: 'pointer'}} className="brand-image" src="/images/login/logo-white.png" />
					<div className="brand-name">Teneo OutPerform <TM style={{padding: 0, marginRight: 0, marginTop: -10, marginLeft: -3, marginRight: 0, fontSize: 8}}/></div>
				</div>
				<div style={{padding: 5, backgroundColor: "#33363b"}} className='sidenav-search'>
					<AssetSearch assets={this.state.assets} />
				</div>
				<div className='sidenav-main'>
					<MainNav />
					<Divider style={{marginLeft: "10px", marginRight: "10px"}}/>
					{this.renderContext()}
				</div>
			</LeftNav>
		);
	}
});

module.exports = SideNavigation;
