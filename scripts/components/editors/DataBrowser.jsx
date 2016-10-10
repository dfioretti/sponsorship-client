var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Divider = require('material-ui').Divider;
var StatEngine = require('../../utils/StatEngine.js');
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;

var DataBrowser = React.createClass({
	getInitialState: function() {
		return { data: [] }
	},
	render: function() {
		console.log('props', this.props, this.props.node);
		return (
			<div>
				<div className="title med small-pad center">Review</div>
				<Divider />
				<Row style={{marginTop: 10}}>
					<Col md={12}>
					<BootstrapTable
						data={this.state.data}
						height="500"
						>
						<TableHeaderColumn
							dataField="id"
							isKey={true}
							hidden={true}
							>ID
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="property"
							dataFormat={this.formatProperty}
							dataSort={true}
							>Property
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="value"
							dataSort={true}
							>Value
						</TableHeaderColumn>
					</BootstrapTable>
					</Col>
				</Row>
			</div>
		) ;
	}

});
module.exports = DataBrowser;
