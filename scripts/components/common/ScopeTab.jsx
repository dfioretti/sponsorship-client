var React = require('react');
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Colors = require('../../constants/colors.js');
var ListItem = require('material-ui').ListItem;
var Avatar = require('material-ui').Avatar;
var TextField = require('material-ui').TextField;
var Table = require('material-ui').Table;
var TableBody = require('material-ui').TableBody;
var TableFooter = require('material-ui').TableFooter;
var TableHeader = require('material-ui').TableHeader;
var TableHeaderColumn = require('material-ui').TableHeaderColumn;
var TableRow = require('material-ui').TableRow;
var TableRowColumn = require('material-ui').TableRowColumn;
var IconButton = require('material-ui').IconButton;
var SortIcon = require('react-icons/lib/md/sort');
var SearchIcon = require('react-icons/lib/md/search');
var Immutable = require('immutable');
var _ = require('underscore');
var FloatingActionButton = require('material-ui').FloatingActionButton;
var AddIcon = require('react-icons/lib/md/add');
var RemoveIcon = require('react-icons/lib/md/remove');
var GridList = require('material-ui').GridList;
var GridTile = require('material-ui').GridTile;
var Subheader = require('material-ui').Subheader;
var Navigation = require('react-router').Navigation;
var Link = require('react-router').Link;
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);

var contextRecord;

var ScopeTab = React.createClass({
	mixins: [Navigation, FluxMixin],

	getInitialState: function () {
		//var context = this.getFlux().store("DocumentStore").getContext(this.props.cid);
		//var documentStore = this.getFlux().store("DocumentStore").getState();
		//var propertiesColl = documentStore.propertiesColl;
		contextRecord = this.getFlux().store("DocumentStore").getContext(this.props.cid);
		var currentAssets = [];
		var allProperties = this.getFlux().store("DocumentStore").getProperties({});//propertiesColl.find();
		contextRecord.scopeProperties.map(function (p) {
			currentAssets.push(this.getFlux().store("DocumentStore").getProperty({ entity_key: p }));
		}.bind(this));
		return {
			fullWidth: false,
			allProperties: allProperties,//propertiesColl.find(),
			data: Immutable.List(),
			currentAssets: currentAssets,
			filteredData: Immutable.List(),
			displayData: Immutable.List(),
			searchText: "",
			sortKey: 'name',
			sortDir: 'asc',
			fixedHeader: true,
			fixedFooter: true,
			stripedRows: false,
			showRowHover: false,
			selectable: false,
			multiSelectable: true,
			enableSelectAll: false,
			deselectOnClickaway: false,
			showCheckboxes: false,
			height: "calc(100vh - 335px)"
			//height: "calc(100vh - 150px)"
		};
	},
	componentWillMount: function () {
		this.setState({
			data: Immutable.fromJS(this.state.allProperties).toList(),
			filteredData: Immutable.fromJS(this.state.allProperties).toList(),
			displayData: Immutable.fromJS(this.state.allProperties).toList()
		});
	},
	componentWillReceiveProps: function (nextProps) {
		contextRecord = this.getFlux().store("DocumentStore").getContext(nextProps.cid);
		var currentAssets = [];
		var allProperties = this.getFlux().store("DocumentStore").getProperties({});//propertiesColl.find();
		contextRecord.scopeProperties.map(function (p) {
			currentAssets.push(this.getFlux().store("DocumentStore").getProperty({ entity_key: p }));
		}.bind(this));

		this.setState({
			data: Immutable.fromJS(this.state.allProperties).toList(),
			filteredData: Immutable.fromJS(this.state.allProperties).toList(),
			displayData: Immutable.fromJS(this.state.allProperties).toList(),
			currentAssets: currentAssets
		});
	},
	getRow: function (i) {
		return this.state.allProperties[i];
	},
	filterData: function (event) {
		event.preventDefault();
		const regex = new RegExp(event.target.value, 'i');
		const filtered = this.state.data.filter(function (datum) {
			return (datum.get('name').search(regex) > -1);
		});
		var displayData;
		if (this.state.sortDir == 'asc') {
			displayData = filtered.sort(
				(a, b) => a.get(this.state.sortKey).localeCompare(b.get(this.state.sortKey))
			)
		} else {
			displayData = filtered.sort(
				(a, b) => b.get(this.state.sortKey).localeCompare(a.get(this.state.sortKey))
			)
		}
		this.setState({
			searchText: event.target.value,
			filteredData: filtered,
			displayData: displayData
		});
	},
	focusSearch: function () {
		this.setState({ fullWidth: true });
	},
	blurSearch: function () {
		this.setState({ fullWidth: false });
	},
	addProperty: function (key, event) {
		contextRecord.scopeProperties = contextRecord.scopeProperties.concat(key);
		this.currentAssets = this.state.currentAssets;
		var addedProperty = this.getFlux().store("DocumentStore").getProperty({ entity_key: key });
		this.currentAssets = this.currentAssets.concat(addedProperty);
		this.setState({
			currentAssets: this.currentAssets
		});
		this.getFlux().store("DocumentStore").saveDatabase();
	},
	removeProperty: function (key, event) {
		var scopeProperties = contextRecord.scopeProperties;
		var currentAssets = this.state.currentAssets;
		var propertyToDelete = scopeProperties.indexOf(key);
		scopeProperties.splice(propertyToDelete, 1);
		contextRecord.scopeProperties = scopeProperties;
		currentAssets.splice(propertyToDelete, 1);

		this.setState({
			currentAssets: currentAssets
		});

		this.getFlux().store("DocumentStore").saveDatabase();
	},
	renderActionButton: function (row) {
		var key = row.get('entity_key');
		if (_.contains(contextRecord.scopeProperties, key)) {
			return (
				<IconButton style={{ color: Colors.RED_BASE }} onTouchTap={this.removeProperty.bind(this, key)}>
					<RemoveIcon size={20} />
				</IconButton>
			);
		}
		return (
			<IconButton style={{ color: Colors.GREEN_BASE }} onTouchTap={this.addProperty.bind(this, key)}>
				<AddIcon size={20} />
			</IconButton>
		);
	},
	sortTable: function (key, event) {
		var sortDir = 'asc';
		var filtered = this.state.displayData;
		if (key == this.state.sortKey) {
			sortDir = (this.state.sortDir == 'asc') ? 'desc' : 'asc';
		}
		var displayData;
		if (sortDir == 'asc') {
			displayData = filtered.sort(
				(a, b) => a.get(key).localeCompare(b.get(key))
			)
		} else {
			displayData = filtered.sort(
				(a, b) => b.get(key).localeCompare(a.get(key))
			)
		}
		this.setState({
			sortKey: key,
			sortDir: sortDir,
			displayData: displayData
		});
	},
	handleTouch: function (id, event) {
		this.transitionTo('/apt/asset/dashboard/' + id);
	},
	render: function () {
		var sortStyle = {
			color: Colors.DARK,
		}
		var iconSize = 15;
		//<Col md={6} style={{margin: 0, padding: 0, marginTop: 20}}>
		//<Col md={6} style={{margin: 0, padding: 0, marginTop: -10}}>

		return (
			<div>
				<Col className="tab-col" md={6}>
					<div style={{ backgroundColor: "white", width: "100%", height: "calc(100vh - 145px)" }}>
						<div id="md-table-sort" style={{ paddingTop: 20, paddingLeft: 20, width: "calc(100% - 5px)" }}>
							<div>
								<Row>
									<Col md={1} style={{ marginTop: 10, marginRight: -20 }}>
										<SearchIcon size={30} />
									</Col>
									<Col md={11}>
										<TextField
											value={this.state.searchText}
											onChange={this.filterData}
											hintText="Property Search"
											fullWidth={this.state.fullWidth}
											onFocus={this.focusSearch}
											onBlur={this.blurSearch}
											/>
									</Col>
								</Row>
								<Table
									height={this.state.height}
									fixedHeader={this.state.fixedHeader}
									fixedFooter={this.state.fixedFooter}
									selectable={this.state.selectable}
									multiSelectable={this.state.multiSelectable}
									>
									<TableHeader
										displaySelectAll={this.state.showCheckboxes}
										adjustForCheckbox={this.state.showCheckboxes}
										enableSelectAll={this.state.enableSelectAll}
										>
										<TableRow>
											<TableHeaderColumn style={{ width: "70px" }}>
											</TableHeaderColumn>
											<TableHeaderColumn style={{ width: "70px" }}>
											</TableHeaderColumn>
											<TableHeaderColumn >
												<Row style={{ margin: 0, padding: 0 }}>
													<Col style={{ margin: 0, padding: 0, lineHeight: '48px', height: 48 }} md={6}>
														Property
													</Col>
													<Col md={6}>
														<IconButton key="name" style={sortStyle} onTouchTap={this.sortTable.bind(this, "name")}>
															<SortIcon size={iconSize} />
														</IconButton>
													</Col>
												</Row>
											</TableHeaderColumn>
											<TableHeaderColumn>
												<Row style={{ margin: 0, padding: 0 }}>
													<Col style={{ margin: 0, padding: 0, lineHeight: '48px', height: 48 }} md={6}>
														Scope
													</Col>
													<Col md={6}>
														<IconButton key="scope" style={sortStyle} onTouchTap={this.sortTable.bind(this, "scope")}>
															<SortIcon size={iconSize} />
														</IconButton>
													</Col>
												</Row>
											</TableHeaderColumn>
											<TableHeaderColumn>
												<Row style={{ margin: 0, padding: 0 }}>
													<Col style={{ margin: 0, padding: 0, lineHeight: '48px', height: 48 }} md={6}>
														Category
													</Col>
													<Col md={6}>
														<IconButton key="category" style={sortStyle} onTouchTap={this.sortTable.bind(this, "category")}>
															<SortIcon size={iconSize} />
														</IconButton>
													</Col>
												</Row>
											</TableHeaderColumn>
											<TableHeaderColumn>
												<Row style={{ margin: 0, padding: 0 }}>
													<Col style={{ margin: 0, padding: 0, lineHeight: '48px', height: 48 }} md={6}>
														Subcategory
													</Col>
													<Col md={6}>
														<IconButton key="subcategory" style={sortStyle} onTouchTap={this.sortTable.bind(this, "subcategory")}>
															<SortIcon size={iconSize} />
														</IconButton>
													</Col>
												</Row>

											</TableHeaderColumn>
										</TableRow>
									</TableHeader>
									<TableBody
										displayRowCheckbox={this.state.showCheckboxes}
										deselectOnClickaway={this.state.deselectOnClickaway}
										showRowHover={this.state.showRowHover}
										stripedRows={this.state.stripedRows}
										>
										{this.state.displayData.map((row, index) => (
											<TableRow style={{ height: 75 }} key={index} >
												<TableRowColumn style={{ width: "70px" }}>
													{this.renderActionButton(row)}
												</TableRowColumn>
												<TableRowColumn style={{ width: "70px" }}><Avatar src={row.get('image_url')} /></TableRowColumn>
												<TableRowColumn>{row.get('name')}</TableRowColumn>
												<TableRowColumn>{row.get('scope')}</TableRowColumn>
												<TableRowColumn>{row.get('category')}</TableRowColumn>
												<TableRowColumn>{row.get('subcategory')}</TableRowColumn>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</div>
					</div>
				</Col>
				<Col className="tab-col" md={6}>
					<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
						<span style={{ fontSize: 16, paddingTop: "0px", paddingBottom: "20px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Scope Properties</span>

						<GridList
							style={{ width: "90%", height: "calc(100vh - 250px)", overflowY: 'auto', marginBottom: 24 }}
							cellHeight={200}
							>
							{this.state.currentAssets.map((tile) => (
								<GridTile
									key={tile.entity_key}
									title={tile.name}
									style={{ cursor: 'pointer' }}
									subtitle={tile.category + ' - ' + tile.subcategory}
									onTouchTap={() => this.handleTouch(tile.id)}
									>
									<img src={tile.image_url} />
								</GridTile>
							))}
						</GridList>
					</div>
				</Col>
			</div>
		)
	}

});

module.exports = ScopeTab;
