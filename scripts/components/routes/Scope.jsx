var React = require('react');
var Tabs = require('material-ui').Tabs;
var Tab = require('material-ui').Tab;
var Grid = require('react-grid-layout');
var Fluxxor = require('fluxxor');
var FluxMix = Fluxxor.FluxMixin(React);
var PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
var WidthProvider = require('react-grid-layout').WidthProvider;
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;
var _ = require('lodash');
var DashModule = require('../common/DashModule.jsx');
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var InteractiveDashboard = require("../common/InteractiveDashboard.jsx");
var DashboardGrid = require('../common/DashboardGrid.jsx');
var Drawer = require('rc-drawer');
var SlideDock = require('../common/SlideDock.jsx');
var ButtonIcon = require('material-ui/svg-icons/av/library-books');
var FloatingActionButton = require('material-ui').FloatingActionButton;
var Colors = require('../../constants/colors.js');
//var Grid = WidthProvider(ResponsiveReactGridLayout);

var Scope = React.createClass({
	mixins: [ PureRenderMixin ],
	getInitialState: function() {
		return { drawerOpen: false, buttonBottom: 10, views: [], items: [], newCounter: 0};
	},
	handleDrawer: function() {
		var buttonBottom = this.state.buttonBottom;
		if (buttonBottom == 10) {
			buttonBottom = 560;
		} else {
			buttonBottom = 10;
		}
		this.setState({drawerOpen: !this.state.drawerOpen, buttonBottom: buttonBottom});
	},
	addHandler: function(view, items) {
		this.setState({
			views: this.state.views.concat({
				type: view,
				data: items
			}),
			items: this.state.items.concat({
				i: 'n' + this.state.newCounter,
				x: this.state.items.length * 2 % (12),
				y: Infinity,
				w: 2,
				h: 2
			}),
			newCounter: this.state.newCounter + 1
		});
		console.log("handle add", view, items);
	},
	onLayoutChange: function(layout) {
		this.setState({items: layout});
	},
	render: function() {
		var drawerContent = <SlideDock addHandler={this.addHandler}/>;
		return (
			<Drawer
				docked={false}
				open={this.state.drawerOpen}
				position="bottom"
				overlayStyle={{display: "none"}}
				sidebar={drawerContent}
				style={{overflow: "auto", backgroundColor: "transparent"}}
				>
				<Tabs
					value={this.state.tab}
					style={{marginTop: "60px"}}
					onChange={this.handleTabChange}
					>
					<Tab label="Assess" value="analyze">
						<DashboardGrid items={this.state.items} className="layout" rowHeight={100} cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}} onLayoutChange={this.onLayoutChange}/>
					</Tab>
					<Tab label="Score" value="score">
					</Tab>
				</Tabs>
				<FloatingActionButton mini={true} backgroundColor={Colors.SECONDARY} style={{position: "fixed", bottom: this.state.buttonBottom, right: 80}} onTouchTap={this.handleDrawer}>
					<ButtonIcon />
				</FloatingActionButton>
			</Drawer>
		);
	}

});

module.exports = Scope;
/*
<InteractiveDashboard />

<Grid className="layout" onLayoutChange={this.onLayoutChange} cols={6} rowHeight={200} width={1200} >
	{_.map(this.state.items, this.createElement)}
</Grid>
*/
