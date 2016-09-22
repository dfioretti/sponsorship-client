var React = require('react');
var FloatingActionButton = require('material-ui').FloatingActionButton;
var AddIcon = require('react-icons/lib/md/add');
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Dialog = require('material-ui').Dialog;
var VisualizationDialog = require('../common/VisualizationDialog.jsx');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var DashboardGrid = require('../common/DashboardGrid.jsx');
var Tabs = require('material-ui').Tabs;
var Tab = require('material-ui').Tab;
var Colors = require('../../constants/colors.js');
var ScopeTab = require('../common/ScopeTab.jsx');
var FlatButton = require('material-ui').FlatButton;
var TextField = require('material-ui').TextField;
var SaveIcon = require('react-icons/lib/md/done');
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var CircularProgress =  require('material-ui').CircularProgress;

var Analyze = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("AssetsStore")],

	componentWillMount: function() {
		if (this.props.params.id) {
			var dashboard = this.getFlux().store("DashboardHomeStore").getDashboard(this.props.params.id);
			if (dashboard) {
				this.setState({
					scopeName: dashboard.name,
					scopeProperties: dashboard.state.context,
					items: dashboard.state.layout,
					elements: dashboard.state.elements,
					id: this.props.params.id,
					newCounter: dashboard.state.elements.length
				});
			}
		}
		else {
			this.setState({
				scopeName: "",
				scopeProperties: [],
				items: [],
				elements: {},
				id: null,
				newCounter: 0
			});
		}
	},
	componentWillReceiveProps: function(nextProps) {
		if (nextProps.params.id) {
			var dashboard = this.getFlux().store("DashboardHomeStore").getDashboard(nextProps.params.id);
			if (dashboard) {
				this.setState({
					scopeName: dashboard.name,
					scopeProperties: dashboard.state.context,
					items: dashboard.state.layout,
					elements: dashboard.state.elements,
					id: nextProps.params.id,
					newCounter: dashboard.state.elements.length
				});
			}
		} else {
			this.setState({
				scopeName: "",
				scopeProperties: [],
				items: [],
				elements: {},
				id: null,
				newCounter: 0
			});
		}
	},
	getInitialState: function() {
		return { id: null, scopeName: "", scopeProperties: [], showError: false, activeTab: 'scope', dialogOpen: false, items: [], elements: {}, newCounter: 0, breakpoint: 'lg', cols: 12 }
	},
	getStateFromFlux: function() {
		return this.getFlux().store("AssetsStore").getState();
	},
	onScopeNameUpdate: function(event) {
		this.setState({
			scopeName: event.target.value
		});
	},
	handleTabChange:  function(value) {
		this.setState({activeTab: value});
	},
	onAnalyzeAdd: function(ev) {
		if (this.state.scopeProperties.length == 0) {
			this.setState({
				showError: true
			});
		} else {
			this.setState({dialogOpen: true});
		}
	},
	handleClose: function() {
		this.setState({dialogOpen: !this.state.dialogOpen});
	},
	onBreakpointChange: function(breakpoint, cols) {
		this.setState({
			breakpoint: breakpoint,
			cols: cols
		});
	},
	doSave: function(data) {
		var elements = this.state.elements;
		elements['key-' + this.state.newCounter] = {
			chartType: data.chartType.toLowerCase(),
			properties: data.chipData,
			dataPoints: data.dataChips,
			title: data.chartName
		};
		this.setState({
			elements: elements,
			items: this.state.items.concat({
				i: 'key-' + this.state.newCounter,
				x: this.state.items.length * 2 % (this.state.cols || 12),
				y: Infinity,
				w: 5,
				h: 5,
				data: data
			}),
			newCounter: this.state.newCounter + 1,
			dialogOpen: false
		});
	},
	onLayoutChange: function(layout) {
		this.setState({items: layout});
	},
	onScopeChanged: function(scopeKeys) {
		this.setState({
			scopeProperties: scopeKeys
		});
	},
	tabChange: function(key, e) {
		this.setState({
			activeTab: key
		});
	},
	closeError: function() {
		this.setState({showError: false})
	},
	saveScope: function() {
		var dashboard = {
			company_id: 5555,
			id: this.state.id,
			name: this.state.scopeName,
			kind: 'context',
			state: {
				context: this.state.scopeProperties,
				layout: this.state.items,
				elements: this.state.elements,
			}

		}
		if (this.state.new) {
			this.getFlux().actions.contextCreate(dashboard);
		} else {
			this.getFlux().actions.contextUpdate(dashboard);
		}
	},
	renderContent: function(currentAssets) {
		if (this.state.activeTab == 'scope') {
			return (
				<Grid fluid={true}>
					<Row style={{paddingTop: "3px"}}>
						<Col md={1}>
							<div style={{fontSize: '20px', lineHeight: '48px', textAlign: 'bottom', textTransform: 'uppercase', letterSpacing: '1.5', height: 48}}>
								SCOPE:
							</div>
						</Col>
						<Col md={10}>
							<TextField
								style={{textTransform: 'uppercase', letterSpacing: '1.5px'}}
								hintText='Scope Name'
								onChange={this.onScopeNameUpdate}
								value={this.state.scopeName}
								/>
						</Col>
						<Col md={1}>
							<FloatingActionButton style={{float: 'right', marginTop: -30}} mini={false} onTouchTap={this.saveScope}>
								<SaveIcon size={30} />
							</FloatingActionButton>
						</Col>
					</Row>
					<ScopeTab currentAssets={currentAssets} onScopeChanged={this.onScopeChanged} scopeProperties={this.state.scopeProperties} allProperties={this.getFlux().store("AssetsStore").getState().assets} />
				</Grid>
			);
		} else if (this.state.activeTab == 'analyze') {
			return (
				<Grid fluid={true}>
					<Dialog
						title="Error!"
						open={this.state.showError}
						actions={<FlatButton label="OK" onTouchTap={this.closeError} />}
						>
						No properties selected, please define a scope!
					</Dialog>
					<Dialog
						title="Visualization"
						modal={true}
						open={this.state.dialogOpen}
						onRequestClose={this.handleClose}
						autoScrollBodyContent={true}
						contentStyle={{width: "75%", height: "900px", maxWidth: 'none'}}
						>
						<VisualizationDialog handleClose={this.handleClose} doSave={this.doSave} assets={currentAssets} />
					</Dialog>
					<Row style={{paddingTop: "3px"}}>
						<Col md={11}>
						</Col>
						<Col md={1}>
							<FloatingActionButton style={{float: 'right', marginTop: -30}} mini={false} onTouchTap={this.onAnalyzeAdd}>
								<AddIcon size={30} />
							</FloatingActionButton>
						</Col>
						<Row>
							<Col md={12}>
								<DashboardGrid elements={this.state.elements} items={this.state.items} className="layout" rowHeight={100} cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}} onBreakpointChange={this.onBreakpointChange} onLayoutChange={this.onLayoutChange} />
							</Col>
						</Row>
					</Row>
				</Grid>
			);
		} else {
			return (
				<h1>bitch evaluate</h1>
			);
		}
	},
	render: function() {
		if (!this.state.assetsLoaded || !this.getFlux().store("DashboardHomeStore").getState().dashboardsLoaded) {
			return (
				<CircularProgress size={2} />
			);
		}
		var tabStyle = {
			fontSize: 12,
			letterSpacing: 1.5
		}
		var scopeKey = "scope";
		var colStyle={
			backgroundColor: Colors.MAIN,
			margin: 0,
			padding: 0
		}
		var buttonStyle = {
			color: "white",
			width: "100%"
		}
		var inactiveStyle = {
			height: 4,
			backgroundColor: Colors.MAIN,
			width: "100%"
		}
		var activeStyle = {
			height: 4,
			backgroundColor: Colors.SECONDARY,
			width: "100%"
		}
		var currentAssets = [];
		this.state.scopeProperties.forEach(function(p) {
			currentAssets.push(this.getFlux().store("AssetsStore").getAssetByKey(p))
		}.bind(this));
		return (
			<div>
				<Row style={{margin: 0, padding: 0}}>
					<Col style={{backgroundColor: Colors.MAIN, margin: 0, padding: 0}} key={scopeKey}  md={4}>
						<FlatButton backgroundColor={Colors.MAIN} hoverColor={Colors.MAIN} style={{color: "white", width: "100%"}} onTouchTap={this.tabChange.bind(this, scopeKey)} label="Scope" />
						<div style={(this.state.activeTab == 'scope') ? activeStyle : inactiveStyle} />
					</Col>
					<Col style={colStyle} md={4}>
						<FlatButton backgroundColor={Colors.MAIN} hoverColor={Colors.MAIN} style={{color: "white", width: "100%"}} onTouchTap={this.tabChange.bind(this, "analyze")} label="Analyze" />
						<div style={(this.state.activeTab == 'analyze') ? activeStyle : inactiveStyle} />
					</Col>
					<Col md={4} style={colStyle}>
						<FlatButton backgroundColor={Colors.MAIN} hoverColor={Colors.MAIN} style={{color: "white", width: "100%"}} onTouchTap={this.tabChange.bind(this, "evaluate")} label="Evaluate" />
						<div style={(this.state.activeTab == 'evaluate') ? activeStyle : inactiveStyle} />
					</Col>
				</Row>
				{this.renderContent(currentAssets)}
			</div>
		);
	}

});

module.exports = Analyze;
