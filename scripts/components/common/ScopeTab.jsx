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

var ScopeTab = React.createClass({
	getInitialState: function() {
		return {
			fullWidth: false,
			data: Immutable.List(),
			filteredData: Immutable.List(),
			displayData: Immutable.List(),
			searchText: "" ,
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
	componentWillMount: function() {
		this.setState({
			data: Immutable.fromJS(this.props.allProperties).toList(),
			filteredData: Immutable.fromJS(this.props.allProperties).toList(),
			displayData: Immutable.fromJS(this.props.allProperties).toList()
		});
	},
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			data: Immutable.fromJS(this.props.allProperties).toList(),
			filteredData: Immutable.fromJS(this.props.allProperties).toList(),
			displayData: Immutable.fromJS(this.props.allProperties).toList()
		});
	},
	getRow: function(i) {
		return this.props.allProperties[i];
	},
	filterData:  function(event) {
		event.preventDefault();
		const regex = new RegExp(event.target.value, 'i');
		const filtered = this.state.data.filter(function(datum) {
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
	focusSearch: function() {
		this.setState({ fullWidth: true});
	},
	blurSearch: function() {
		this.setState({fullWidth: false});
	},
	addProperty: function(key, event) {
		this.props.onScopeChanged(this.props.scopeProperties.concat(key));
	},
	removeProperty: function(key, event) {
		this.selectedKeys = this.props.scopeProperties;
		var keyToDelete = this.selectedKeys.indexOf(key);
		this.selectedKeys.splice(keyToDelete, 1);
		this.props.onScopeChanged(this.selectedKeys);
		//this.props.onScopeChanged(this.props.scopeProperties.concat(key));
	},
	renderActionButton: function(row) {
		var key = row.get('entity_key');
		if (_.contains(this.props.scopeProperties, key)) {
			return (
				<IconButton style={{color: Colors.RED_BASE}} onTouchTap={this.removeProperty.bind(this, key)}>
					<RemoveIcon size={20} />
				</IconButton>
			);
			/*
			return (
			<FloatingActionButton secondary={true} onTouchTap={this.removeProperty.bind(this, key)} mini={true}>
			<RemoveIcon size={20} />
			</FloatingActionButton>
			);
			*/
		}
		return (
			<IconButton style={{color: Colors.GREEN_BASE}} onTouchTap={this.addProperty.bind(this, key)}>
				<AddIcon size={20} />
			</IconButton>
		);
		/*
		return (
		<FloatingActionButton onTouchTap={this.addProperty.bind(this, key)} mini={true}>
		<AddIcon size={20} />
		</FloatingActionButton>
		);
		*/
	},
	sortTable: function(key, event) {
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
	render: function() {
		var sortStyle = {
			color: Colors.DARK,
		}
		//console.log('doing render tab', this.props.currentAssets);
		var iconSize = 15;
		return (
			<div>
				<Col md={6} style={{margin: 0, padding: 0}}>
					<div style={{backgroundColor: "white", width: "100%", height: "calc(100vh - 145px)"}}>
						<div id="md-table-sort" style={{paddingTop: 20, paddingLeft: 20, width: "calc(100% - 5px)" }}>
							<div>
								<Row>
									<Col md={1} style={{marginTop: 10, marginRight: -20}}>
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
											<TableHeaderColumn style={{width: "70px"}}>
											</TableHeaderColumn>
											<TableHeaderColumn style={{width: "70px"}}>
											</TableHeaderColumn>
											<TableHeaderColumn >
												<Row style={{margin: 0, padding: 0}}>
													<Col style={{margin: 0, padding: 0, lineHeight: '48px', height: 48}} md={6}>
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
												<Row style={{margin: 0, padding: 0}}>
													<Col style={{margin: 0, padding: 0, lineHeight: '48px', height: 48}} md={6}>
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
												<Row style={{margin: 0, padding: 0}}>
													<Col style={{margin: 0, padding: 0, lineHeight: '48px', height: 48}} md={6}>
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
												<Row style={{margin: 0, padding: 0}}>
													<Col style={{margin: 0, padding: 0, lineHeight: '48px', height: 48}} md={6}>
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
										{this.state.displayData.map( (row, index) => (
											<TableRow style={{height: 75}} key={index} >
												<TableRowColumn style={{width: "70px"}}>
													{this.renderActionButton(row)}
												</TableRowColumn>
												<TableRowColumn style={{width: "70px"}}><Avatar src={row.get('image_url')} /></TableRowColumn>
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
				<Col md={6}>
					<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
						<h4 style={{paddingTop: "0px", paddingBottom: "20px", textTransform: "uppercase", letterSpacing: "1.5px"}}>Scope Properties</h4>

						<GridList
							style={{width: "90%", height:"calc(100vh - 250px)", overflowY: 'auto', marginBottom: 24}}
							cellHeight={200}
							>
							{this.props.currentAssets.map((tile) => (
								<GridTile
									key={tile.entity_key}
									title={tile.name}
									subtitle={tile.category + ' - ' + tile.subcategory}
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
