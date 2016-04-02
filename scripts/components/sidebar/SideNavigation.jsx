var React = require('react'),
		LeftNav = require('material-ui').LeftNav,
		AssetSearch = require('./AssetSearch.jsx'),
		Divider = require('material-ui').Divider,
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		ScoreEditContextMenu = require('./ScoreEditContextMenu.jsx'),
		Link = require('react-router').Link,
		MainNav = require('./MainNav.jsx'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;


var SideNavigation = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("AssetsStore")],

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
	render: function() {
		//<div className="brand-title">Teneo</div>
//	<Divider style={{marginLeft: "10px", marginRight: "10px"}}/>

		//					<Divider style={{marginLeft: "10px", marginRight: "10px"}}/>
/*

*/
		return (
			<LeftNav className="sidenav-top" open={true}>
				<div className='sidenav-top'>
					<Link to={'/'}><img className="brand-image" src="/images/login/logo-white.png" /></Link>
					<div className="brand-name">Teneo OutPerform</div>
				</div>
				<div style={{padding: 5, backgroundColor: "#33363b"}} className='sidenav-search'>
					<AssetSearch assets={this.state.assets} />
				</div>
				<div className='sidenav-main'>
					<MainNav />
					<Divider style={{marginLeft: "10px", marginRight: "10px"}}/>
				</div>
			</LeftNav>
		);
	}
});

module.exports = SideNavigation;
