var React = require('react');
var Fluxxor = require('fluxxor');
var FlatButton = require('material-ui').FlatButton;
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Dialog = require('material-ui').Dialog;
var Navigation = require('react-router').Navigation
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var TextField = require('material-ui').TextField;
var Avatar = require('material-ui').Avatar;


var SideMenu = React.createClass({
	mixins: [ FluxMixin, StoreWatchMixin("AssetsStore"), Navigation ],

	getInitialState: function() {
		return { open: false, selectedItems: [], scopeName: "" }
	},

	onRowSelect: function(row, isSelected) {
		var currentRows = this.state.selectedItems;
		currentRows.push(row);
		this.setState({selectedItems: currentRows});
	},

	onSelectAll: function() {

	},

	componentWillMount: function() {
		if (!this.state.assetsLoaded) {
			this.getFlux().actions.loadAssets();
		}
	},

	handleNewScope: function(e) {
		this.setState({ open: true });
	},

	handleClose: function() {
		this.setState({open: false});
	},

	handleCreate: function() {
		this.getFlux().actions.createContext(this.state.scopeName, this.state.selectedItems);
		this.setState({open: false});
		this.transitionTo('scope');
	},

	getStateFromFlux: function() {
		return this.getFlux().store("AssetsStore").getState();
	},

	handleScopeName: function(event) {
		this.setState({scopeName: event.target.value});
	},

	render: function() {
		var actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.handleClose}
				/>,
			<FlatButton
				label="Create"
				primar={true}
				onTouchTap={this.handleCreate}
				/>
		];
		var selectRowProp = {
			mode: "checkbox",
			clickToSelect: true,
			onSelect: this.onRowSelect,
			onSelectAll: this.onSelectAll
		};

		return (
			<div style={{marginTop: 18, width: '100%'}}>
				<img style={{height: 24, display: 'block', margin: 'auto'}} src={'/images/login/full-logo.svg'} />
				<Dialog
					title="Create new scope"
					actions={actions}
					modal={true}
					open={this.state.open}
					>
					<TextField
						hintText="Scope Name"
						value={this.state.scopeName}
						onChange={this.handleScopeName}
						/>
					<BootstrapTable
						selectRow={selectRowProp}
						data={this.state.assets}
						height={"420"}
						hover={true}
						bordered={false}
						striped={false}
						search={true}
						>
						<TableHeaderColumn dataField="id" isKey={true} hidden={true}>ID</TableHeaderColumn>
						<TableHeaderColumn
							dataField="name"
							dataSort={true}
							>
							Property
						</TableHeaderColumn>
					</BootstrapTable>
				</Dialog>
				<FlatButton onTouchTap={this.handleNewScope}>Create Scope</FlatButton>
			</div>
		);
	}

});

module.exports = SideMenu;
