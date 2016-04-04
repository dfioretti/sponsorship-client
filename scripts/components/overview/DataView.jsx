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
var API_ROOT = require('../../constants/environment.js').API_ROOT;
var Spinner = require('react-spinkit');
var DataFormatter = require('../../utils/DataFormatter.js');


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
	getInitialState: function() {
		return { data: null }
	},
	componentWillMount: function() {
		$.ajax({
			type: "GET",
			contentType: "application/json",
			url: API_ROOT + 'api/v1/apt/data?metrics=true',
			success: function(data, status, xhr) {
				this.setState( { data: data })
			}.bind(this),
			error: function(xhr, status, error) {
				console.log(status);
				console.log(error);
			}
		});
	},
	tableForEntity: function() {
		if (!this.state.data) return null;
		console.log("in table", this.state);
		var colFilter = {type: "TextFilter" };
			return (
				<BootstrapTable data={this.state.data}
												striped={true}
												hover={true}
												height="600"
												condensed={false}
												search={true}
				>
					<TableHeaderColumn  dataSort={true} dataField="id" isKey={true}>ID</TableHeaderColumn>
					<TableHeaderColumn filter={colFilter} dataSort={true} dataField="source">Source</TableHeaderColumn>
					<TableHeaderColumn filter={colFilter} dataSort={true} dataField="entity_key">Entity</TableHeaderColumn>
					<TableHeaderColumn filter={colFilter} dataSort={true} dataField="metric">Metric</TableHeaderColumn>
					<TableHeaderColumn filter={colFilter} dataSort={true} dataField="value">Value</TableHeaderColumn>
					<TableHeaderColumn filter={colFilter} dataSort={true} dataField="norm_value">Noramlized</TableHeaderColumn>
					<TableHeaderColumn filter={colFilter} dataSort={true} dataField="rank">Rank</TableHeaderColumn>

				</BootstrapTable>
			);
	},
	render: function() {
		console.log("STATE", this.state);
		if (this.state.data == null) {
			return (
				<div className=''>
					<div style={{marginTop: "20%", display: 'flex', justifyContent: 'center'}}>
						<Spinner style={{height: 200, width: 200}} overrideSpinnerClassName={'loader'} spinnerName='circle' noFadeIn />
					</div>
				</div>
			)
		}
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
