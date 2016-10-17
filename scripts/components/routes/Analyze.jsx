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
var MetricsAnalytics  =require('../common/MetricsAnalytics.jsx');
var loki = require('lokijs');
var LokiIndexedAdapter = require('lokijs/src/loki-indexed-adapter');
var idbAdapter = new LokiIndexedAdapter('loki-db');

var Analyze = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("AssetsStore", "DashboardHomeStore")],
	getInitialState: function() {
		db = new loki('outperform.db', {autosave: true, autosaveInterval: 500, adapter: idbAdapter, autoload: true, autoloadCallback: this.dbLoaded });
		window.db = db;
		return { db: db, dbLoaded: false, metricsColl: null, formualsColl: null, scopeMetrics: [], models: [], formulas: [], id: null, scopeName: "", kpis: [], scopeProperties: [], showError: false, activeTab: 'scope', kpiEdit: null, dialogOpen: false, kpiDialogOpen: false, items: [], elements: {}, newCounter: 0, breakpoint: 'lg', cols: 12 }
	},
	dbLoaded: function() {
		console.log('db loaded', this.state);
		this.setState({
			formulasColl: this.state.db.getCollection('formulas'),
			metricsColl: this.state.db.getCollection('metrics'),
			dbLoaded: true
		});
		/*
		console.log('in db loaded', this.state.db);
		var coll = this.state.db.getCollection('metrics');
		console.log('coll', coll, coll.find().length);
		if (coll.find().length == 0) {
			console.log('in here?');
			this.getFlux().store("AssetsStore").getState().assets.map(function(asset) {
				asset.metrics.map(function(metric) {
					var insert = metric;
					insert.value = parseFloat(metric.value);
					coll.insert(insert);
				});
			});
		}
		this.setState({
			formulasColl: this.state.db.getCollection('formulas'),
			metricsColl: coll,
			dbLoaded: true
		});
		*/
	},
	componentWillMount: function() {
		if (this.props.params.id) {
			var dashboard = this.getFlux().store("DashboardHomeStore").getDashboard(this.props.params.id);
			var rawMetrics = [];
			if (dashboard)
			rawMetrics = this.getFlux().store("DocumentStore").getMetrics({'entity_key' : { '$in' : dashboard.state.context }});

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
		console.log('kpi ave data', data);
		var formulas = this.state.formulas;
		var stats = new StatEngine(data);
		//var collection = this.getFlux().store("DocumentStore").getCollection('metrics');
		var collection = this.getFlux().store("DocumentStore").getMetricsCollection();
		console.log('collection', collection);
		stats.setCollection(collection);
		//stats.setCollection(this.getFlux().store("DocumentStore").getCollection('metrics'));
		stats.runFormula();
		formulas.push(data);
		this.setState({
			kpiDialogOpen: false,
			formulas: formulas
		});
		this.saveScope();
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
				w: 6,
				h: 8,
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
		this.saveScope();
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
			id: this.props.params.id,
			name: this.state.scopeName,
			kind: 'context',
			state: {
				context: this.state.scopeProperties,
				layout: this.state.items,
				elements: this.state.elements,
				formulas: this.state.formulas,
				activeTab: this.state.activeTab,
				models: this.state.models
			}
		}
		if (this.props.params.id) {
			DashboardClient.updateDashboard(dashboard, function(data) {
				this.getFlux().store("DashboardHomeStore").updateDashboard(data);
			}.bind(this));
			//this.getFlux().actions.contextCreate(dashboard);
		} else {
			DashboardClient.createDashboard(dashboard, function(data) {
				this.getFlux().store("DashboardHomeStore").updateDashboard({dashboard: data});
			}.bind(this));
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
					<FloatingActionButton backgroundColor={Colors.SECONDARY} style={{float: 'right', marginTop: -30}} mini={false} onTouchTap={this.onAnalyzeAdd}>
						<AddIcon size={30} />
					</FloatingActionButton>
					<Row>
						<Col md={12} style={{marginTop: 10, paddingTop: 0, position: 'absolute'}}>
							<DashboardGrid metricsColl={this.state.metricsColl} elements={this.state.elements} items={this.state.items} className="layout" rowHeight={25} cols={{lg: 24, md: 18, sm: 12, xs: 10, xxs: 6}} onBreakpointChange={this.onBreakpointChange} onLayoutChange={this.onLayoutChange} />
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
						<ScoreTab scopeProperties={this.state.scopeProperties} contextId={this.props.params.id} metricsColl={this.state.metricsColl} formulasColl={this.state.formulasColl} onKpiUpdate={this.onKpiUpdate} models={this.state.models} onModelChange={this.onModelChange} formulas={this.state.formulas} onKpiAdd={this.onKpiAdd} />
					</Row>
				</div>
			);
		}
	},
	onKpiUpdate: function(id) {
		console.log('on kapi edit', id);
		//var formula = this.getFlux().store("DocumentStore").getFormula({ uuid: uuid });
		this.setState({
			kpiEdit: id,
			kpiDialogOpen: true
		});
	},
	render: function() {
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
		}
		if (!(this.state.dbLoaded && this.state.assetsLoaded && this.getFlux().store("DashboardHomeStore").getState().dashboardsLoaded)) {
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
		if (this.state.scopeProperties != null) {
			this.state.scopeProperties.forEach(function(p) {
				currentAssets.push(this.getFlux().store("AssetsStore").getAssetByKey(p))
			}.bind(this));
		}
		var labelStyle = {
			fontSize: 12,
			letterSpacing: 1.5,
			textTransform: 'uppercase',
			paddingTop: 0
		}
		if (this.state.id !== null) {
			this.saveScope();
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
