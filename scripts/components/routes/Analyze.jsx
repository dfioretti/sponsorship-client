var React = require('react');
var FloatingActionButton = require('material-ui').FloatingActionButton;
var AddIcon = require('react-icons/lib/md/add');
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Dialog = require('material-ui').Dialog;
var VisualizationDialog = require('../common/VisualizationDialog.jsx');
var KpiDialog = require('../common/KpiDialog.jsx');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var DashboardGrid = require('../common/DashboardGrid.jsx');
var Tabs = require('material-ui').Tabs;
var CircularProgress =  require('material-ui').CircularProgress;
var Tab = require('material-ui').Tab;
var Colors = require('../../constants/colors.js');
var ScopeTab = require('../common/ScopeTab.jsx');
var ScoreTab = require('../common/ScoreTab.jsx');
var FlatButton = require('material-ui').FlatButton;
var uuid = require('node-uuid');
var TextField = require('material-ui').TextField;
var SaveIcon = require('react-icons/lib/md/done');
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var CircularProgress =  require('material-ui').CircularProgress;
var MetricBuilder = require('../editors/MetricBuilder.jsx');
var DashboardClient = require('../../clients/dashboard_client.js');
var constants = require('../../constants/constants.js');
var StatEngine = require('../../utils/StatEngine.js');
var MetricsAnalytics  = require('../common/MetricsAnalytics.jsx');
var loki = require('lokijs');
var LokiIndexedAdapter = require('lokijs/src/loki-indexed-adapter');
var idbAdapter = new LokiIndexedAdapter('loki-db');

var Analyze = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("DocumentStore")],
	getInitialState: function() {
		return {  dbLoaded: true, scopeMetrics: [], models: [], formulas: [], id: null, scopeName: "", kpis: [], scopeProperties: [], showError: false, activeTab: 'scope', kpiEdit: null, dialogOpen: false, kpiDialogOpen: false, items: [], elements: {}, newCounter: 0, breakpoint: 'lg', cols: 12 }
	},
	componentWillMount: function() {
		this.loadData(this.props);
		return;
		console.log("will mt");
		if (this.props.params.id) {
			var dashboard = this.getFlux().store("DashboardHomeStore").getDashboard(this.props.params.id);
			//var dashboard = this.state.contextCollection.findOne({ 'id': this.props.params.id });//='id' : )//this.getFlux().store("DashboardHomeStore").getDashboard(this.props.params.id);
			console.log('dashboard', dashboard);
			var rawMetrics = [];
			if (dashboard)
				rawMetrics = this.state.metricsColl.find({'entity_key' : { '$in' : dashboard.state.context }});
			//rawMetrics = this.getFlux().store("DocumentStore").getMetrics({'entity_key' : { '$in' : dashboard.state.context }});

			if (dashboard) {
				this.setState({
					scopeName: dashboard.name,
					scopeProperties: (dashboard.state.context) ? dashboard.state.context : [],
					items: (dashboard.state.layout) ? dashboard.state.layout : [],
					elements: dashboard.state.elements,
					id: this.props.params.id,
					newCounter: dashboard.state.elements.length,
					formulas: (dashboard.state.formulas) ? dashboard.state.formulas : [],
					activeTab: dashboard.state.activeTab,
					models: (dashboard.state.models) ? dashboard.state.models : [],
					scopeMetrics: rawMetrics
				});
			}
		}
		else {
			this.setState({
				scopeName: "NEED NAME",
				scopeProperties: [],
				items: [],
				elements: {},
				id: null,
				newCounter: 0,
				formulas: [],
				activeTab: 'scope',
				models: [],
				scopeMetrics: []
			});
		}
	},
	loadData: function(props) {
		if (props.params.id) {
			//var dashboard = this.getFlux().store("DashboardHomeStore").getDashboard(this.props.params.id);

			var dashboard = this.state.contextCollection.findOne({ 'id': parseInt(props.params.id) });//='id' : )//this.getFlux().store("DashboardHomeStore").getDashboard(this.props.params.id);
			console.log('dashboard', dashboard);
			var rawMetrics = [];
			if (dashboard && dashboard.state.context != null)
				rawMetrics = this.state.metricsColl.find({'entity_key' : { '$in' : dashboard.state.context }});
			//rawMetrics = this.getFlux().store("DocumentStore").getMetrics({'entity_key' : { '$in' : dashboard.state.context }});

			if (dashboard) {
				this.setState({
					scopeName: dashboard.name,
					scopeProperties: (dashboard.state.context) ? dashboard.state.context : [],
					items: (dashboard.state.layout) ? dashboard.state.layout : [],
					elements: dashboard.state.elements,
					id: this.props.params.id,
					newCounter: dashboard.state.elements.length,
					formulas: (dashboard.state.formulas) ? dashboard.state.formulas : [],
					activeTab: dashboard.state.activeTab,
					models: (dashboard.state.models) ? dashboard.state.models : [],
					scopeMetrics: rawMetrics
				});
			}
		}
		else {
			this.setState({
				scopeName: "NEED NAME",
				scopeProperties: [],
				items: [],
				elements: {},
				id: null,
				newCounter: 0,
				formulas: [],
				activeTab: 'scope',
				models: [],
				scopeMetrics: []
			});
		}
	},
	componentWillReceiveProps: function(nextProps) {
		this.loadData(nextProps);
		return;
		if (nextProps.params.id) {
			var dashboard = this.getFlux().store("DashboardHomeStore").getDashboard(nextProps.params.id);
			var rawMetrics = [];
			if (dashboard)
			rawMetrics = this.getFlux().store("DocumentStore").getMetrics({'entity_key' : { '$in' : dashboard.state.context }});
			if (dashboard) {
				this.setState({
					scopeName: dashboard.name,
					scopeProperties: (dashboard.state.context) ? dashboard.state.context : [],
					items: (dashboard.state.layout) ? dashboard.state.layout : [],
					elements: dashboard.state.elements,
					id: nextProps.params.id,
					newCounter: dashboard.state.elements.length,
					formulas: (dashboard.state.formulas) ? dashboard.state.formulas : [],
					activeTab: dashboard.state.activeTab,
					models: (dashboard.state.models) ? dashboard.state.models : [],
					scopeMetrics: rawMetrics
				});
			}
		} else {
			this.setState({
				scopeName: "NEED NAME2",
				scopeProperties: [],
				items: [],
				elements: {},
				id: null,
				newCounter: 0,
				formulas: [],
				activeTab: 'scope',
				models: [],
				scopeMetrics: []
			});
		}
	},
	getStateFromFlux: function() {
		return this.getFlux().store("DocumentStore").getState();
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
		if (this.state.scopeProperties !== null && this.state.scopeProperties.length == 0) {
			this.setState({
				showError: true
			});
		} else {
			this.setState({dialogOpen: true});
		}
	},
	onModelChange: function(data) {
		this.models = this.state.models;
		var idx = this.models.map((m) => m.key).indexOf(data.key);
		if (idx < 0) {
			this.setState({
				models: this.state.models.concat(data)
			});
		} else {
			this.models[idx] = data;
			this.setState({
				models: this.models
			});
		}
	},
	onKpiAdd: function(ev) {
		if (this.state.scopeProperties.length == 0) {
			this.setState({
				showError: true
			});
		} else {
			this.setState({kpiDialogOpen: true});
		}
	},
	handleClose: function() {
		this.setState({dialogOpen: !this.state.dialogOpen});
	},
	handleKpiClose: function() {
		this.setState({kpiDialogOpen: !this.state.kpiDialogOpen, kpiEdit: null});
	},
	onBreakpointChange: function(breakpoint, cols) {
		this.setState({
			breakpoint: breakpoint,
			cols: cols
		});
	},
	doKpiSave: function(data) {
		var formulas = this.state.formulas;
		var stats = new StatEngine(data);
		//var collection = this.getFlux().store("DocumentStore").getCollection('metrics');
		var collection = this.getFlux().store("DocumentStore").getMetricsCollection();
		stats.setCollection(collection);
		//stats.setCollection(this.getFlux().store("DocumentStore").getCollection('metrics'));
		stats.runFormula();
		formulas.push(data);
		this.setState({
			kpiDialogOpen: false,
			formulas: formulas
		});
		this.saveScope(this.state.layout);
	},
	doSave: function(data) {
		var elements = this.state.elements;
		var id = uuid.v4();
		//elements['key-' + this.state.newCounter] = {
		elements['key-' + id] = {
			chartType: data.chartType.toLowerCase(),
			properties: data.chipData,
			dataPoints: data.dataChips,
			title: data.chartName
		};
		this.setState({
			elements: elements,
			items: this.state.items.concat({
				i: 'key-' + id,
				//i: 'key-' + this.state.newCounter,
				x: this.state.items.length * 2 % (this.state.cols || 12),
				y: Infinity,
				w: 4,
				h: 6,
				data: data
			}),
			newCounter: this.state.newCounter + 1,
			dialogOpen: false
		});
	},
	onLayoutChange: function(layout) {
		console.log('layout change parent');
		this.setState({items: layout});
	},
	onScopeChanged: function(scopeKeys) {
		this.setState({
			scopeProperties: scopeKeys
		});
		this.saveScope(this.state.layout);
	},
	commitDashboardUpdate: function(layout) {
		this.saveScope(layout);
	},
	tabChange: function(key, e) {
		this.setState({
			activeTab: key
		});
	},
	closeError: function() {
		this.setState({showError: false})
	},
	saveScope: function(layout) {
		var dashboard = {
			company_id: 5555,
			id: this.props.params.id,
			name: this.state.scopeName,
			kind: 'context',
			state: {
				context: this.state.scopeProperties,
				layout: layout,//this.state.items,
				elements: this.state.elements,
				formulas: this.state.formulas,
				activeTab: this.state.activeTab,
				models: this.state.models
			}
		}
		if (this.props.params.id) {
			this.getFlux().actions.updateDashboard(dashboard);
			//DashboardClient.updateDashboard(dashboard, function(data) {
			//this.getFlux().store("DashboardHomeStore").updateDashboard(data);
			//}.bind(this));
			//this.getFlux().actions.contextCreate(dashboard);
		} else {
			this.getFlux().actions.createDashboard(dashboard);
			//DashboardClient.createDashboard(dashboard, function(data) {
			//	this.getFlux().store("DashboardHomeStore").updateDashboard({dashboard: data});
			//}.bind(this));
			//this.getFlux().actions.contextUpdate(dashboard);
		}
	},
	renderContent: function(currentAssets) {
		if (this.state.activeTab == 'scope') {
			return (
				<Grid fluid={true}>
					<FloatingActionButton backgroundColor={Colors.SECONDARY} style={{float: 'right', marginTop: -30}} mini={false} onTouchTap={this.saveScope}>
						<SaveIcon size={30} />
					</FloatingActionButton>
					<ScopeTab scopeProperties={this.state.scopeProperties} currentAssets={this.state.propertiesColl.find({'entity_key' : { '$in' : this.state.scopeProperties }})} onScopeChanged={this.onScopeChanged} allProperties={this.state.propertiesColl.find()} />
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
						<VisualizationDialog handleClose={this.handleClose} doSave={this.doSave} assets={this.state.propertiesColl.find({'entity_key' : { '$in' : this.state.scopeProperties } })} />
					</Dialog>
					<FloatingActionButton backgroundColor={Colors.SECONDARY} style={{float: 'right', marginTop: -30}} mini={false} onTouchTap={this.onAnalyzeAdd}>
						<AddIcon size={30} />
					</FloatingActionButton>
					<Row>
						<Col md={12} style={{marginTop: 10, paddingTop: 0, position: 'absolute'}}>
							<DashboardGrid persistDashboard={this.commitDashboardUpdate} metricsColl={this.state.metricsColl} elements={this.state.elements} items={this.state.items} className="layout" rowHeight={50} cols={{lg: 24, md: 18, sm: 12, xs: 10, xxs: 6}} onBreakpointChange={this.onBreakpointChange}  />
						</Col>
					</Row>
				</Grid>
			);
		} else {
			//						<MetricBuilder kpiEdit={this.state.kpiEdit} handleClose={this.handleKpiClose} doKpiSave={this.doKpiSave} assets={currentAssets} />

			return (
				<div>
					<Dialog
						modal={true}
						open={this.state.kpiDialogOpen}
						onRequestClose={this.handleKpiClose}
						autoScrollBodyContent={true}
						contentStyle={{height: "95vh", maxWidth: 'none'}}
						>
						<MetricsAnalytics scopeProperties={this.state.scopeProperties} contextId={this.props.params.id} kpiEdit={this.state.kpiEdit} metricsColl={this.state.metricsColl} formulasColl={this.state.formulasColl} doKpiSave={this.doKpiSave} handleClose={this.handleKpiClose}/>
					</Dialog>
					<Row style={{marginLeft: 10, marginRight: 10, marginTop: 0, padding: 0}}>
						<FloatingActionButton backgroundColor={Colors.SECONDARY} style={{float: 'right', marginTop: -30}} mini={false} onTouchTap={this.onKpiAdd}>
							<SaveIcon size={30} />
						</FloatingActionButton>
					</Row>
					<Row style={{marginTop: -10, paddingTop: 0}}>
						<ScoreTab scopeProperties={this.state.scopeProperties} modelsColl={this.state.modelsColl} contextId={this.props.params.id} metricsColl={this.state.metricsColl} formulasColl={this.state.formulasColl} onKpiUpdate={this.onKpiUpdate} models={this.state.models} onModelChange={this.onModelChange} formulas={this.state.formulas} onKpiAdd={this.onKpiAdd} />
					</Row>
				</div>
			);
		}
	},
	onKpiUpdate: function(id) {
		//var formula = this.getFlux().store("DocumentStore").getFormula({ uuid: uuid });
		this.setState({
			kpiEdit: id,
			kpiDialogOpen: true
		});
	},
	render: function() {
		/*
		if (this.state.assetsLoaded && this.state.dbLoaded) {
			var coll = this.state.db.getCollection('metrics');
			if (coll.find().length == 0) {
				this.state.assets.map(function(asset) {
					asset.metrics.map(function(metric) {
						var insert = metric;
						insert.value = parseFloat(metric.value);
						coll.insert(insert);
					});
				});
			}
		}*/
		if (!(this.state.dashboardsLoaded && this.state.propertiesLoaded)) {// && this.getFlux().store("DashboardHomeStore").getState().dashboardsLoaded)) {
			return (
				<Row style={{marginTop: "25%"}}>
					<Col md={5}></Col>
					<Col md={2}>
						<CircularProgress size={3} />
					</Col>
					<Col md={5}></Col>
				</Row>
			);
		}
		var tabStyle = {
			fontSize: 12,
			letterSpacing: 1.5
		}
		var scopeKey = "scope";
		var colStyle={
			backgroundColor: Colors.WHITE,
			margin: 0,
			padding: 0
		}
		var buttonStyle = {
			color: "white",
			width: "100%"
		}
		var inactiveStyle = {
			height: 2,
			backgroundColor: Colors.MAIN,
			width: "100%"
		}
		var activeStyle = {
			height: 2,
			backgroundColor: Colors.SECONDARY,
			width: "100%"
		}
		var currentAssets = [];
		/*
		if (this.state.scopeProperties != null) {
			this.state.scopeProperties.forEach(function(p) {
				currentAssets.push(this.getFlux().store("AssetsStore").getAssetByKey(p))
			}.bind(this));
		}
		*/
		var labelStyle = {
			fontSize: 12,
			letterSpacing: 1.5,
			textTransform: 'uppercase',
			paddingTop: 0
		}
		if (this.state.id !== null) {
			//this.saveScope();
		}
		return (
			<div>
				<Row style={{margin: 0, padding: 0}}>
					<div style={{textTransform: 'uppercase', fontSize: 16, fontWeight: 700, letterSpacing: '1.5px', backgroundColor: 'white', paddingTop: 7, paddingBottom: 0, paddingLeft: 20, marginBottom: -1, color: Colors.MAIN}}>{this.state.scopeName}</div>
					<Col style={{backgroundColor: Colors.WHITE, margin: 0, padding: 0}} key={scopeKey}  md={4}>
						<FlatButton rippleColor="transparent" backgroundColor={Colors.WHITE} labelStyle={labelStyle} hoverColor={Colors.WHITE} style={{color: Colors.MAIN, width: "100%", padding: 0, margin: 0, marginTop: 0, height: 30, fontSize: 10}} onTouchTap={this.tabChange.bind(this, scopeKey)} label="Scope" />
						<div style={(this.state.activeTab == 'scope') ? activeStyle : inactiveStyle} />
					</Col>
					<Col md={4} style={colStyle}>
						<FlatButton rippleColor="transparent" backgroundColor={Colors.WHITE} labelStyle={labelStyle} hoverColor={Colors.WHITE} style={{color: Colors.MAIN, padding: 0, margin: 0, height: 30, marginTop: 0, width: "100%"}} onTouchTap={this.tabChange.bind(this, "evaluate")} label="Evaluate" />
						<div style={(this.state.activeTab == 'evaluate') ? activeStyle : inactiveStyle} />
					</Col>
					<Col style={colStyle} md={4}>
						<FlatButton rippleColor="transparent" backgroundColor={Colors.WHITE} labelStyle={labelStyle} hoverColor={Colors.WHITE} style={{color: Colors.MAIN, width: "100%", padding: 0, margin: 0, marginTop: 0, height: 30, fontSize: 10}} onTouchTap={this.tabChange.bind(this, "analyze")} label="Analyze" />
						<div style={(this.state.activeTab == 'analyze') ? activeStyle : inactiveStyle} />
					</Col>
				</Row>
				{this.renderContent(currentAssets)}
			</div>
		);
	}
});

module.exports = Analyze;
