var React = require('react');
var ReactBsTable = require('react-bootstrap-table');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Panel = require('react-bootstrap').Panel;


var DataHeading = React.createClass({

	render: function() {
		var title = "";
		if (this.props.entity === 'portfolio') {
			title = "Portfolio Data";
		} else if (this.props.entity === 'entity') {
			title = "Asset Data";
		}
		return (
			<Row>
				<Col md={12}>
					<Panel className="panel stat-panel">
						<div className="stat-title">
							{title}
						</div>
					</Panel>
				</Col>
			</Row>
		);
	}
});

var DataView = React.createClass({
	mixins: [FluxMixin],
	tableForEntity: function() {
		if (this.props.data.length == 0) return null;
		var colFilter = {type: "TextFilter" };
		if (this.props.entity === 'portfolio') {
			return (
				<BootstrapTable data={this.props.data}
												striped={true}
												hover={true}
												height="600"
												condensed={false}
												search={true}
				>
					<TableHeaderColumn  dataSort={true} dataField="id" isKey={true}>ID</TableHeaderColumn>
					<TableHeaderColumn filter={colFilter} dataSort={true} dataField="name">Name</TableHeaderColumn>
					<TableHeaderColumn filter={colFilter} dataSort={true} dataField="scope">Scope</TableHeaderColumn>
					<TableHeaderColumn filter={colFilter} dataSort={true} dataField="category">Category</TableHeaderColumn>
					<TableHeaderColumn filter={colFilter} dataSort={true} dataField="subcategory">Type</TableHeaderColumn>
					<TableHeaderColumn filter={colFilter} dataSort={true} dataField="renewal">Renewal</TableHeaderColumn>
					<TableHeaderColumn filter={colFilter} dataSort={true} dataField="pretty_cost">Cost</TableHeaderColumn>
				</BootstrapTable>

			);
		} else if (this.props.entity === 'entity') {
			return (
				<BootstrapTable data={this.props.data}
												striped={true}
												hover={true}
												height="600"
												condensed={false}
												search={true}
				>
					<TableHeaderColumn  dataSort={true} dataField="id" isKey={true}>ID</TableHeaderColumn>
					<TableHeaderColumn filter={colFilter} dataSort={true} dataField="source">Source</TableHeaderColumn>
					<TableHeaderColumn filter={colFilter} dataSort={true} dataField="kind">Type</TableHeaderColumn>
					<TableHeaderColumn filter={colFilter} dataSort={true} dataField="point">Metric</TableHeaderColumn>
					<TableHeaderColumn filter={colFilter} dataSort={true} dataField="value">Value</TableHeaderColumn>
				</BootstrapTable>
			);
		}
	},
	render: function() {
//		<DataHeading {...this.props} />

		return (
			<div className="overview-container overview-data">
				<Grid>
					<Row>
						<Col md={12}>
							<Panel bsClass="panel stat-panel">
								<div className="stat-title">
									Data
								</div>
							</Panel>
						</Col>
					</Row>
					{this.tableForEntity()}
				</Grid>
			</div>
		);
	}
});

module.exports = DataView;
