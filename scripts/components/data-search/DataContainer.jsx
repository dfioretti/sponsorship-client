var React = require('react');
var ReactBsTable = require('react-bootstrap-table');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Panel = require('react-bootstrap').Panel;

var DataContainer = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("DataStore"), StoreWatchMixin("AssetsStore")],
	getStateFromFlux: function() {
		return {};
	},
	componentWillMount: function() {
		this.getFlux().actions.loadAssets();
		this.getFlux().actions.loadData();
	},
	render: function() {
		return (
			<div style={{ width: "100%" }}>
					<Row>
						<Col md={6}>
							<BootstrapTable
								data={this.getFlux().store("DataStore").getState().data}
								height="300"
								bordered={false}
								>
								<TableHeaderColumn  dataSort={true} isKey={true} dataField="id">ID</TableHeaderColumn>
								<TableHeaderColumn  dataSort={true} dataField="kind">Type</TableHeaderColumn>
								<TableHeaderColumn 	dataSort={true} dataField="source">Source</TableHeaderColumn>
								<TableHeaderColumn 	dataSort={true} dataField="point">Metric</TableHeaderColumn>
							</BootstrapTable>
						</Col>
						<Col md={6}>
							<BootstrapTable
								data={this.getFlux().store("AssetsStore").getState().assets}
								height="300"
								>
								<TableHeaderColumn  dataSort={true} isKey={true} dataField="id">ID</TableHeaderColumn>
								<TableHeaderColumn  dataSort={true} dataField="name">Name</TableHeaderColumn>
								<TableHeaderColumn  dataSort={true} dataField="scope">Scope</TableHeaderColumn>
								<TableHeaderColumn  dataSort={true} dataField="category">Category</TableHeaderColumn>
								<TableHeaderColumn  dataSort={true} dataField="subcategory">Subcategory</TableHeaderColumn>
								<TableHeaderColumn dataSort={true} dataField="owned">Owned</TableHeaderColumn>
							</BootstrapTable>
						</Col>
					</Row>
			</div>
		);
	}
});

module.exports = DataContainer;
