var React = require('react'),
		LeftNav = require('material-ui').LeftNav,
		AssetSearch = require('./AssetSearch.jsx'),
		Divider = require('material-ui').Divider,
		Fluxxor = require('fluxxor'),
		ToggleIcon = require('react-icons/lib/md/arrow-drop-down'),
		List = require('material-ui').List,
		ListItem = require('material-ui').ListItem,
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
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
		var iconStyle = {
			color: 'white',
			marginTop: 3
		}
		var itemStyle = {
			color: 'white',
			fontSize: 14,
			height: 30,
			textTransform: 'uppercase',
			letterSpacing: '1.5px'
		}
		var textStyle = {
			marginTop: -6
		}
		return (
			<LeftNav  open={true}>
				<div className='sidenav-top'>
					<Link to={'/'}><img className="brand-image" src="/images/login/logo-white.png" /></Link>
					<div className="brand-name">Teneo OutPerform</div>
				</div>
				<div className='sidenav-main'>
					<AssetSearch assets={this.state.assets} />
					<Divider style={{marginLeft: "10px", marginRight: "10px"}}/>
					<List>
						<ListItem
							style={itemStyle}
							primaryText={<div style={textStyle}>Dashboards</div>}
							primaryTogglesNestedList={true}
							rightIcon={<ToggleIcon style={iconStyle} />}
							nestedItems={[
								<ListItem
									key={1}
									primaryText="Dashboards Home"
									style={{color: 'white', fontSize: 14, height: 50, textTransform: 'uppercase', letterSpacing: '1.5px'}}

									/>,
								<ListItem
									key={2}
									primaryText="Create Dashboard"
									style={{color: 'white', fontSize: 14, height: 50, textTransform: 'uppercase', letterSpacing: '1.5px'}}
									/>
							]}
						/>
						<ListItem
							style={{color: 'white', fontSize: 14, height: 30, textTransform: 'uppercase', letterSpacing: '1.5px'}}
							primaryText="Scores"
							primaryTogglesNestedList={true}
							rightIcon={<ToggleIcon />}
							nestedItems={[
								<ListItem
									key={1}
									primaryText="Scores Home"
									style={{color: 'white', fontSize: 14, height: 50, textTransform: 'uppercase', letterSpacing: '1.5px'}}
									/>,
								<ListItem
									key={2}
									primaryText="Create Score"
									style={{color: 'white', fontSize: 14, height: 50, textTransform: 'uppercase', letterSpacing: '1.5px'}}
									/>
							]}
						/>
						<ListItem
							style={{color: 'white', fontSize: 14, height: 30, textTransform: 'uppercase', letterSpacing: '1.5px'}}
							primaryText="Modules"
							primaryTogglesNestedList={true}
							rightIcon={<ToggleIcon />}
							nestedItems={[
								<ListItem
									key={1}
									primaryText="Modules Home"
									style={{color: 'white', fontSize: 14, height: 50, textTransform: 'uppercase', letterSpacing: '1.5px'}}
									/>,
								<ListItem
									key={2}
									primaryText="Create Module"
									style={{color: 'white', fontSize: 14, height: 50, textTransform: 'uppercase', letterSpacing: '1.5px'}}
									/>
							]}
						/>
					</List>
				</div>
			</LeftNav>
		);
	}
});

module.exports = SideNavigation;
