var React = require('react');
var Sidebar = require('react-sidebar');
var Button = require('react-bootstrap').Button;
var Toolbar = require('material-ui').Toolbar;
var ToolbarGroup = require('material-ui').ToolbarGroup;
var MenuIcon = require('react-icons/lib/md/menu');
//var DataDrawer = require('../elements/Drawer.jsx');
var ButtonIcon = require('material-ui/svg-icons/av/library-books');
var Drawer = require('rc-drawer');
var MuiThemeProvider = require('material-ui').MuiThemeProvider;
var Sidebar = require('react-sidebar').default;
var SlideMenu = require('react-ui-component').SlideMenu;
var AppBar = require('material-ui').AppBar;
var IconButton = require('material-ui').IconButton;
var NavigationClose = require('material-ui').NavigationClose;
var IconMenu = require('material-ui').IconMenu;
var MoreVertIcon = require('material-ui').MoreVertIcon;
var MenuItem = require('material-ui').MenuItem;
var Select = require('react-select');
var FloatingActionButton = require('material-ui').FloatingActionButton;
var Fluxxor = require('fluxxor');
//var MenuIcon = require('react-icons/lib/md/menu');
var FluxMixin = Fluxxor.FluxMixin(React);
var SlideDock = require('../common/SlideDock.jsx');
var DataContainer = require('../data-search/DataContainer.jsx');
var Colors = require('../../constants/colors.js');
var SideMenu = require('../../components/common/SideMenu.jsx');
var FixedSide = require('../../components/common/FixedSide.jsx');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var SearchIcon = require('react-icons/lib/md/search');
var AutoComplete = require('material-ui').AutoComplete;
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Avatar = require('material-ui').Avatar;
var Navigation = require('react-router').Navigation;

var Workspace = React.createClass({
	mixins: [Navigation, FluxMixin, StoreWatchMixin("DocumentStore")],//, StoreWatchMixin("DashboardHomeStore", "AssetsStore")],
	componentWillMount: function() {
		console.log("state in worspace", this.state);
		//this.getFlux().actions.syncData();
		//this.getFlux().actions.loadDashboards();
		//this.getFlux().actions.loadAssets();
	},
	getInitialState: function() {
		return {open: false, searchText: "", fullSearch: true, docked: false, drawerOpen: false, buttonBottom: 10};
	},
	toggleMenu: function(e) {
		this.setState({open: !this.state.open, docked: !this.state.docked});
	},
	onSetSidebarOpen: function(open) {
		this.setState({open: open});
	},
	handleDrawer: function() {
		var buttonBottom = this.state.buttonBottom;
		if (buttonBottom == 10) {
			buttonBottom = 560;
		} else {
			buttonBottom = 10
		}
		this.setState({drawerOpen: !this.state.drawerOpen, buttonBottom: buttonBottom});
	},
	getSearchItems: function() {
		var data = [];
		this.state.propertiesColl.find().forEach(function(asset) {
			data.push({
				text: asset.name,
				entity_key: asset.entity_key,
				id: asset.id,
				image: asset.image_url,
				value: (
					<MenuItem
						leftIcon={<Avatar src={asset.image_url} />}
						primaryText={asset.name}
						key={asset.id}
						/>
				)
			});
		});
		return data;
	},
	onBarSearch: function(searchText, dataSource) {
		this.setState({searchText: searchText});
	},
	onSearchBlur: function() {
		this.setState({
			fullSearch: true
		});
	},
	getStateFromFlux: function() {
		return this.getFlux().store("DocumentStore").getState();
	},
	onSearchFocus: function() {
		this.setState({
			fullSearch: true
		});
	},
	handleItemSelect: function(item, index) {
		this.setState({
			searchText: ""
		});
		this.transitionTo("/apt/asset/dashboard/" + item.id);
	},
	render: function() {
		console.log('doing render', this.state);
		if (!this.state.propertiesLoaded || !this.state.databaseLoaded)  {// || !this.state.dashboardsLoaded) {
			return (
				<div>wait</div>
			);
		}
		var topStyle = {
			backgroundColor: Colors.MAIN,
		}
		var sidebarContent = <SideMenu />;
		var drawerContent = <SlideDock />;//<div style={{height: "200px", backgroundColor: "white"}}>sup bro</div>;

			var sidebarProps = {
				sidebar: sidebarContent,
				docked: true,
				sidebarClassName: 'slide-bar',
				open: this.state.open,
				shadow: false,
				onSetOpen: this.setSetSidebarOpen
			}
			//				<img style={{height: 30, width: 30}} src={'/images/login/teneo-white.png'} />
			var thinSide = <FixedSide contextCollection={this.state.contextCollection} />;//;<div style={{width: "100%", marginTop: "10px"}}><img  style={{display: 'block', margin: 'auto', width: "37px", height: "36px"}} src={'/images/login/teneo-white.png'} /></div>;
				var textStyle = {
					style: {
						color: 'white',
						fontFamily: 'Avenir-Book'
					}
				}
				//transitions={this.state.open}

				return (
					<MuiThemeProvider>

						<Sidebar
							sidebar={sidebarContent}
							open={this.state.open}
							sidebarClassName="slide-bar"
							docked={this.state.docked}
							shadow={false}
							transitions={false}
							onSetOpen={this.onSetSidebarOpen}
							>
							<Sidebar
								sidebar={thinSide}
								open={!this.state.open}
								sidebarClassName="fixed-side"
								docked={!this.state.docked}
								shadow={false}
								transitions={false}
								>
								<Toolbar style={{backgroundColor: Colors.MAIN}}>
									<ToolbarGroup firstChild={true}>
										<IconButton onTouchTap={this.toggleMenu} style={{color: Colors.WHITE, height: 56, width: 56}}>
											<MenuIcon size={28} />
										</IconButton>
										<IconButton onTouchTap={this.expandSearch} style={{color: Colors.WHITE, height: 56, width: 56}}>
										<SearchIcon size={28} />
										</IconButton>
										<div style={{width: '400px'}}>
											<AutoComplete
												hintText=""
												id="propert_search"
												dataSource={this.getSearchItems()}
												onUpdateInput={this.onBarSearch}
												onNewRequest={this.handleItemSelect}
												searchText={this.state.searchText}
												value={this.state.searchText}
												style={{fontFamily: "Avenir-Book", color: 'white'}}
												menuStyle={{fontFamily: 'Avenir-Book', color: 'white'}}
												textFieldStyle={textStyle}
												filter={AutoComplete.caseInsensitiveFilter}
												onFocus={this.onSearchFocus}
												onBlur={this.onSearchBlur}
												fullWidth={this.state.fullSearch}
												/>
										</div>
									</ToolbarGroup>
									<ToolbarGroup>
									</ToolbarGroup>
								</Toolbar>
								{this.props.children}
							</Sidebar>
						</Sidebar>
					</MuiThemeProvider>
				);
			}
		});

module.exports = Workspace;