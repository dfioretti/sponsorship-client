var React = require('react');
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var Avatar = require('material-ui').Avatar;
var titleize = require('underscore.string/titleize');
var numberFormat = require('underscore.string/numberFormat');
var _ = require('underscore');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Colors = require('../../constants/colors.js');
var ListItem = require('material-ui').ListItem;
var sorty = require('sorty');
var FloatingActionButton = require('material-ui').FloatingActionButton;
var ButtonIcon = require('material-ui/svg-icons/av/playlist-add');
var IconButton = require('material-ui').IconButton;
var IconMenu = require('material-ui').IconMenu;
var MenuItem = require('material-ui').MenuItem;
var Toolbar = require('material-ui').Toolbar;
var DropDownMenu = require('material-ui').DropDownMenu;
var uuid = require('node-uuid');


var SlideDock = React.createClass({
	mixins: [ FluxMixin, StoreWatchMixin("ContextStore") ],

	getInitialState: function() {
		return { selectedItems: [] }
	},

	onRowSelect: function(row, isSelected) {
		var currentRows = this.state.selectedItems;
		currentRows.push(row);
		this.setState({selectedItems: currentRows});
	},
	onSelectAll: function() {

	},
	getStateFromFlux: function() {
		return this.getFlux().store("EntityDashboardStore").getState();
	},
	formatProperty: function(cell, row) {
		var property = this.getFlux().store("AssetsStore").getAssetByKey(row['entity_key']);
		return (
			<ListItem
				leftAvatar={<Avatar src={property.image_url} backgroundColor="#fff" />}
				disabled={true}
				key={uuid.v4()}
				>
				{titleize(cell.split("_").join(" "))}
			</ListItem>
		)
	},
	formatMetric: function(cell, row) {
		return (
			<ListItem
				leftAvatar={<Avatar src={'images' + row['icon']} backgroundColor="#fff" />}
				disabled={true}
				key={uuid.v4()}
				>{titleize(cell.split("_").join(" "))}
			</ListItem>
		);
	},

	formatNumber: function(cell, row) {
		if (cell == null) return "";
		var number = parseFloat(cell.toString() );
		var text = cell.toString();
		// has decimal
		if (number % 1 != 0) {
			if (number < 1) {
				return <ListItem key={uuid.v4()} disabled={true}>{numberFormat(number, 3)}</ListItem>
			}
			if (number < 100) {
				return <ListItem key={uuid.v4()} disabled={true}>{numberFormat(number, 2)}</ListItem>
			}
		}
		return <ListItem key={uuid.v4()} disabled={true}>{numberFormat(number, 0)}</ListItem>
	},

	handleAdd: function(event, child) {
		//console.log("selected:", event, child);
		//this.getFlux().actions.updateContextView(child, this.state.selectedItems);
		this.props.addHandler(child, this.state.selectedItems);
		//console.log(this.state.selectedItems);
	},

	render: function() {
		console.log("rendering slide dock?");
		var selectRowProp = {
			mode: "checkbox",
			clickToSelect: true,
			onSelect: this.onRowSelect,
			onSelectAll: this.onSelectAll
		}

		var tableData = [];
		if (this.state.contextProperties != null) {
			_.each(this.state.contextProperties, function(prop) {
				tableData = tableData.concat(this.getFlux().store("AssetsStore").getAsset(prop).metrics);
			}.bind(this));
		} else {
			if (this.state.asset == null) return null;
			tableData = this.state.asset.metrics;
		}

		if (tableData.length == 0) return null;

		return (
			<div style={{height: "550px", backgroundColor: "transparent"}}>

				<Grid style={{height: "100%"}}>
					<Row style={{height: "100%"}}>
						<Col md={2}>
						</Col>
						<Col md={8} style={{backgroundColor: "white", height: "100%", width: "100%"}}>
								<IconMenu
									onItemTouchTap={this.handleAdd}
									iconButtonElement={
										<FloatingActionButton style={{float: "right"}} mini={true}>
											<ButtonIcon />
										</FloatingActionButton>
									}
									>
										<MenuItem key={"list"} primaryText="List" />
										<MenuItem key={"line"} primaryText="Line" />
										<MenuItem key={"bar"} primaryText="Bar" />
										<MenuItem key={"pie"} primaryText="Pie" />
										<MenuItem key={"Doughnut"} primaryText="Doughnut" />
								</IconMenu>
							<div id="my-grid" style={{padding: "10px"}}>
								<BootstrapTable
									pagination={true}
									selectRow={selectRowProp}
									data={tableData}
									height={"420"}
									hover={true}
									bordered={false}
									condensed={false}
									striped={false}
									search={true}
									style={{fontFamily: 'Avenir-Book', textTransform: "uppercase"}}
									>
									<TableHeaderColumn dataField="id" isKey={true} hidden={true}>ID</TableHeaderColumn>
									<TableHeaderColumn
										dataField="entity_key"
										dataSort={true}
										dataFormat={this.formatProperty}
										>Property
									</TableHeaderColumn>
									<TableHeaderColumn
										dataField="metric"
										dataSort={true}
										dataFormat={this.formatMetric}
										>Metric
									</TableHeaderColumn>
									<TableHeaderColumn
										dataField="value"
										dataSort={true}
										dataFormat={this.formatNumber}
										>
										Value
									</TableHeaderColumn>
								</BootstrapTable>
							</div>
						</Col>
						<Col md={2} />
					</Row>
				</Grid>
			</div>
		);
	}

});
module.exports = SlideDock;
