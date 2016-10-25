var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var Toggle = require('material-ui').Toggle;
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Divider = require('material-ui').Divider;
var StatEngine = require('../../utils/StatEngine.js');
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Avatar = require('material-ui').Avatar;
var titleize = require('underscore.string/titleize');
var numberFormat = require('underscore.string/numberFormat');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var _ = require('underscore');

var DataBrowser = React.createClass({
	mixins: [FluxMixin],
	getInitialState: function() {
		return { data: [], aggregate: false }
	},
	componentWillMount: function() {
		this.loadFormulaData(this.props);
	},
	componentWillReceiveProps: function(nextProps) {
		this.loadFormulaData(nextProps);
	},
	formatMetric: function(cell, row) {
		var image = '/images/native.png';
		if (cell.indexOf("_") > -1) {
			image = '/images' + this.getFlux().store("DocumentStore").getState().metricsColl.findOne({metric: cell}).icon
		}
		return (
			<div>
				<Avatar size={20} src={image} />
				<span>&nbsp;&nbsp;&nbsp;{titleize(cell.split("_").join(" "))}</span>
			</div>
		);
	},
	formatProperty: function(cell, row) {
		return (
			<div>
				<Avatar size={20} src={this.getFlux().store("DocumentStore").getState().propertiesColl.find({entity_key: cell})[0].image_url} />
				<span>&nbsp;&nbsp;&nbsp;{titleize(cell.split("_").join(" "))}</span>
			</div>
		);
	},
	formatValue: function(cell, row) {
		return (
			<span>{numberFormat(cell, 0)}</span>
		);
	},
	clearState: function() {
		this.setState({
			data: [],
			stats: []
		});
		return;
	},
	loadFormulaData: function(props) {
		console.log('load formula data', props);
		if (props.currentNode == null) return this.clearState();
		if (props.node == null) return this.clearState();
		if (props.node.type == "formula") {
			var displayData = this.getFlux().store("DocumentStore").getState().formulaCalculations.find({fid: props.node.fid})[0];
			if (typeof(displayData) == 'undefined') return this.clearState();
			console.log('display data', displayData);
			this.setState({
				data: displayData.data,
				stats: displayData.stats
			});
			return;
		} 
		if (props.node.type == 'node') {
			var displayData = this.getFlux().store("DocumentStore").getState().modelCalculations.find({sid: props.node.sid})[0];
			if (typeof(displayData) == 'undefined') return this.clearState();
			console.log("display data", displayData);
			this.setState({
				data: displayData.result,
				stats: displayData.data
			});
			return;
		}
		console.log(props);
		return this.clearState();
		//console.log('kk load formula data', props);
		var stats = new StatEngine();
		//if (props.node == null) return this.clearState();
		if (props.currentNode == null) return this.clearState();
		// todo render full score
		if (props.currentNode == 0)
			var data = stats.calculateModel(props.formulasColl, props.metricsColl, props.scopeProperties, props.modelsColl);
		return this.clearState();
		if (props.node.fid < 0 || props.node.fid == "") return this.clearState();
		var data = stats.calculateFormula(props.node.fid, props.formulasColl, props.scopeProperties, props.metricsColl);
		this.setState({
			data: data.data,
			stats: data.stats
		});
	},
	toggleAggregate: function() {
		this.setState({
			aggregate: !this.state.aggregate
		});
	},
	renderAggregateTable: function(node) {
		if (node == null) return null;
		if (node.type == 'node') return this.renderScoreTable();
		return (
			<BootstrapTable
				data={this.state.stats}
				height="185"
				search={false}
				>
			<TableHeaderColumn
				dataField="id"
				isKey={true}
				hidden={true}
				>
				ID
			</TableHeaderColumn>
			<TableHeaderColumn
				dataField="metric"
				dataFormat={this.formatMetric}
				dataSort={true}>
					Metric
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="min"
					dataFormat={this.formatValue}
					dataSort={true}
					>Min
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="max"
					dataFormat={this.formatValue}
					dataSort={true}
					>Max
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="mean"
					dataFormat={this.formatValue}
					dataSort={true}
					>Mean
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="median"
					dataFormat={this.formatValue}
					dataSort={true}
					>Median
				</TableHeaderColumn>
			</BootstrapTable>
		)
	},
	renderScoreTable: function() {
		var tableData = [];
		_.keys(this.state.data).map(function(k) {
			tableData.push({entity_key: k, value: this.state.data[k] * 100.0});
		}.bind(this));
		return (
			<BootstrapTable
				data={tableData}
				height="185"
				search={false}
				>
				<TableHeaderColumn
					dataField="entity_key"
					dataFormat={this.formatProperty}
					dataSort={true}
					isKey={true}>
					Property
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="value"
					dataFormat={this.formatValue}
					dataSort={true}
					>
					Value
				</TableHeaderColumn>
			</BootstrapTable>
		);
	},
	renderDataTable: function(node) {
		if (node == null) return null;
		if (node.type == 'node') return this.renderScoreTable();
		return (
			<BootstrapTable
				data={this.state.data}
				height="185"
				search={false}
				>
				<TableHeaderColumn
					dataField="id"
					isKey={true}
					hidden={true}
					>ID
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="entity_key"
					dataFormat={this.formatProperty}
					dataSort={true}
					>Property
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="metric"
					width="180"
					dataFormat={this.formatMetric}
					dataSort={true}
					>Metric
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="value"
					dataFormat={this.formatValue}
					dataSort={true}
					>Value
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="rank"
					hidden={true}
					dataSort={true}
					>Ran	k
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="weight"
					dataSort={true}
					>Weight
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="rank_weight"
					dataSort={true}
					>Weighted Rank
				</TableHeaderColumn>
			</BootstrapTable>
		);
	},
	render: function() {
		//var stats = new StatEngine();
		//if (this.props.node == null) return null;
		//if (this.props.node.fid < 0) return null;
		//var output = stats.calculateFormula(this.props.node.fid, this.props.formulasColl, this.props.scopeProperties, this.props.metricsColl);
		//console.log('props', this.props, this.props.node);
		return (
			<div style={{marginTop: 20}}>
				<div className="title med small-pad center" style={{backgroundColor: 'white'}}>Browse Data</div>
				<Divider />
				<Row style={{marginTop: 0, backgroundColor: 'white', padding: 10, marginLeft: 0, marginRight: 0}}>
					<Col md={12}>
						<Toggle label="Show Aggregate Metrics" toggle={this.state.aggregate} onToggle={this.toggleAggregate} />
						{(this.state.aggregate) ? this.renderAggregateTable(this.props.node) : this.renderDataTable(this.props.node)}
					</Col>
				</Row>
			</div>
		) ;
	}

});
module.exports = DataBrowser;
