var React = require('react');

var ReactDataGrid = require('react-data-grid');
var ReactDataGridPlugins = require('react-data-grid/addons');
var Toolbar = ReactDataGridPlugins.Toolbar;
var Selectors = ReactDataGridPlugins.Data.Selectors;
var IconButton = require('material-ui').IconButton;
var AddIcon = require('react-icons/lib/md/add');
var Colors = require('../../constants/colors.js');
var Col = require('react-bootstrap').Col;
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Chip = require('material-ui').Chip;
var Avatar = require('material-ui').Avatar;
var DragSource = require('react-dnd').DragSource;
var SortIcon = require('react-icons/lib/md/sort');
var PropTypes = React.PropTypes;
var DragMetric = require('./DragMetric.jsx');
var FormulaContainer = require('./FormulaContainer.jsx');
var uuid = require('node-uuid');
var PlusIcon = require('react-icons/lib/ti/plus');
var AutoComplete = require('material-ui').AutoComplete;
var titleize = require('underscore.string/titleize');
var FlatButton = require('material-ui').FlatButton;
var TextField = require('material-ui').TextField;
var SearchIcon = require('react-icons/lib/md/search');
var Immutable = require('immutable');
var _ = require('underscore');
var FloatingActionButton = require('material-ui').FloatingActionButton;
var AddIcon = require('react-icons/lib/md/add');
var RemoveIcon = require('react-icons/lib/md/remove');
var Table = require('material-ui').Table;
var TableBody = require('material-ui').TableBody;
var TableFooter = require('material-ui').TableFooter;
var TableHeader = require('material-ui').TableHeader;
var TableHeaderColumn = require('material-ui').TableHeaderColumn;
var TableRow = require('material-ui').TableRow;
var TableRowColumn = require('material-ui').TableRowColumn;

function createRows(numberOfRows){
	var _rows = [];
	for (var i = 1; i < numberOfRows; i++) {
		_rows.push({
			id: i,
			point: 'Point ' + i,
			icon: '/images/metrics/espn.png',
			kind: ['Survey', 'Social', 'Financial', 'Native'][Math.floor((Math.random() * 3) + 1)],
			source: ['ESPN', 'Twitter', 'Facebook', 'Instagram'][Math.floor((Math.random() * 3) + 1)],
		});
	}
	return _rows;
}

var rowGetter = function(i){
	return _rows[i];
};

var MetricBuilder = React.createClass({
	getDataSearchItems: function() {
		var data = [];
		var metrics = this.props.assets[0].metrics;
		metrics.forEach(function(m) {
			data.push({
				text: titleize(m.metric.split("_").join(" ")),
				metric: m.metric,
				icon: '/images' + m.icon,
				value: (
					<MenuItem
						leftIcon={<Avatar backgroundColor={Colors.WHITE} src={m.icon} />}
						primaryText={titleize(m.metric.split("_").join(" "))}
						key={m.metric}
						/>
				)
			});
		});
		return data
	},
	componentWillReceiveProps(newProps) {
		this.loadStateData(newProps);
	},
	componentWillMount: function() {
		this.loadStateData(this.props);
	},
	loadStateData: function(props) {
		var data = [];
		var metrics = props.assets[0].metrics;
		metrics.forEach(function(m) {
			data.push({
				text: titleize(m.metric.split("_").join(" ")),
				metric: m.metric,
				icon: '/images' + m.icon,
			});
		});
		this.setState({
			data: Immutable.fromJS(data).toList(),
			filteredData: Immutable.fromJS(data).toList(),
			displayData: Immutable.fromJS(data).toList()
		});
	},
	getInitialState : function(){
		return { formula: [], inputData: [], outputData: [] , data: Immutable.List(), filteredData: Immutable.List(), displayData: Immutable.List(), dataSearchText: "", searchText: "", fullWidth: false}
		/*var columns = [
		{
		key: 'id',
		name: '',
		width: 50,
		formatter: this.addFormatter
		},
		{
		key: 'source',
		name: 'Source',
		filterable: true,
		sortable: true
		},
		{
		key: 'point',
		name: 'Value',
		filterable: true,
		sortable: true
		},
		]
		var rows = createRows(100);
		return {columns: columns, inputData: [], outputData: [], rows : rows, filters : {}};
		*/
	},
	filterData:  function(event) {
		event.preventDefault();
		const regex = new RegExp(event.target.value, 'i');
		const filtered = this.state.data.filter(function(datum) {
			return (datum.get('text').search(regex) > -1);
		});
		var displayData = filtered.sort(
			(a, b) => a.get('text').localeCompare(b.get('text'))
		);
		/*else {
		displayData = filtered.sort(
		(a, b) => b.get(this.state.sortKey).localeCompare(a.get(this.state.sortKey))
		)
		}*/
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
	addFormatter: function(data) {
		return (
			<IconButton style={{color: Colors.GREEN_BASE}} onTouchTap={this.addInput.bind(this, data.value)}>
				<AddIcon size={20} />
			</IconButton>
		);
	},
	onUpdateDataInput: function(searchText, dataSource) {
		this.setState({dataSearchText: searchText});
	},
	addInput: function(obj, event) {
		var row = {
			key: uuid.v4(),
			text: obj.get('text'),
			metric: obj.get('metric'),
			icon: obj.get('icon'),
			image: obj.get('icon'),
			popover: true
		};
		//var row = this.rowGetter(key);
		this.setState({
			inputData: this.state.inputData.concat(row)
		});
	},
	handleDataItemSelect: function(item, index) {
		item['key'] = uuid.v4();
		this.setState({
			inputData: this.state.inputData.concat(item)
		});
	},
	getRows : function() {
		return Selectors.getRows(this.state);
	},

	getSize : function() {
		return this.getRows().length;
	},

	rowGetter : function(rowIdx){
		var rows = this.getRows();
		return rows[rowIdx];
	},
	doSave: function(event) {
		this.props.doSave(this.state.formula);
	},
	handleFilterChange : function(filter){
		var newFilters = Object.assign({}, this.state.filters);
		if (filter.filterTerm) {
			newFilters[filter.column.key] = filter;
		} else {
			delete newFilters[filter.column.key];
		}
		this.setState({filters: newFilters});
	},
	onClearFilters: function(){
		this.setState({filters: {} });
	},
	handleRequestDelete: function(key) {
		this.inputData = this.state.inputData;
		var inputToDelete = this.inputData.map((input) => input.key).indexOf(key);
		this.inputData.splice(inputToDelete, 1);
		this.setState({inputData: this.inputData});
	},
	renderInput: function(data) {
		return (
			<DragMetric dragType="value" key={uuid.v4()} iid={data.key} text={data.point}>
				{data.text}
			</DragMetric>
		);
	},
	renderOperationToolbar: function() {

		return (
			<div>
				<DragMetric dragType="operation"  key={uuid.v4()} iid="plus" text="+">
					<PlusIcon size={20} />
				</DragMetric>
			</div>
		);
	},
	sortTable: function(key, event) {
		var sortDir = 'asc';
		var filtered = this.state.displayData;
		/*
		if (key == this.state.sortKey) {
		sortDir = (this.state.sortDir == 'asc') ? 'desc' : 'asc';
		}
		*/
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
	renderActionButton: function(row) {
		return (
			<IconButton
				style={{color: Colors.GREEN_BASE}}
				onTouchTap={this.addInput.bind(this, row)}
				>
				<AddIcon size={20} />
			</IconButton>
		);
	},
	updateOutput: function(formula) {
		this.setState({
			formula: formula
		});
	},
	render:function(){
		var sortStyle = {
			color: Colors.DARK,
		};
		var iconSize = 15;
		return(
			<div>
				<Row>
					<Col md={4}>
						<h4 style={{paddingTop: "10px", textTransform: "uppercase", letterSpacing: "1.5px"}}>Browse</h4>
						<Row>
							<Col md={1} style={{marginTop: 10, marginRight: 0}}>
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
							height={"400"}
							fixedHeader={true}
							fixedFooter={false}
							selectable={false}
							multiSelectable={false}
							>

							<TableBody
								displayRowCheckbox={false}
								deselectOnClickaway={false}
								showRowHover={false}
								stripedRows={false}
								>
								{this.state.displayData.map( (row, index) => (
									<TableRow style={{height: 75}} key={index} >
										<TableRowColumn style={{width: "70px"}}>
											{this.renderActionButton(row)}

										</TableRowColumn>
										<TableRowColumn style={{width: "70px"}}><Avatar src={row.get('icon')} /></TableRowColumn>
										<TableRowColumn>{row.get('text')}</TableRowColumn>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Col>
					<Col md={8}>
						<h4 style={{paddingTop: "10px", textTransform: "uppercase", letterSpacing: "1.5px"}}>Build</h4>
						<h6 style={{paddingTop: "10px", textTransform: "uppercase", letterSpacing: '1.5px'}}>Operators</h6>
						<div style={{display: 'flex', flexWrap: 'flex'}}>
							<FormulaContainer outputData={this.state.outputData} inputData={this.state.inputData} updateOutput={this.updateOutput} />
						</div>
					</Col>
				</Row>
				<Row style={{marginTop: "50px"}}>
					<Col md={9}>
					</Col>
					<Col md={1}>
						<FlatButton
							label="Cancel"
							primary={false}
							onTouchTap={this.props.handleClose}
							/>
					</Col>
					<Col md={1}>
						<FlatButton
							label="Save"
							primary={false}
							onTouchTap={this.doSave}
							/>
					</Col>
				</Row>
			</div>
		)
	}
});

//								{this.state.inputData.map(this.renderInput, this)}
;

module.exports = MetricBuilder;
/*
<TableHeader
displaySelectAll={false}
adjustForCheckbox={false}
enableSelectAll={false}
>
<TableRow>
<TableHeaderColumn style={{width: "70px"}}>
</TableHeaderColumn>
<TableHeaderColumn style={{width: "70px"}}>
</TableHeaderColumn>
<TableHeaderColumn >

</TableHeaderColumn>
</TableRow>
</TableHeader>
<Row style={{margin: 0, padding: 0}}>
<Col style={{margin: 0, padding: 0, lineHeight: '48px', height: 48}} md={6}>
Property
</Col>
<Col md={6}>
<IconButton key="text" style={sortStyle} onTouchTap={this.sortTable.bind(this, "name")}>
<SortIcon size={iconSize} />
</IconButton>
</Col>
</Row>
<div style={{padding: 5}}>
<ReactDataGrid
columns={this.state.columns}
rowGetter={this.rowGetter}
enableCellSelect={false}
style={{fontFamily: 'Avenir-Book', letterSpacing: '1.5', textTransform: 'uppercase'}}
rowsCount={this.getSize()}
minHeight={500}
toolbar={<Toolbar enableFilter={true}/>}
onAddFilter={this.handleFilterChange}
onClearFilters={this.onClearFilters}
/>
<AutoComplete
hintText="Search Data"
filter={AutoComplete.caseInsensitiveFilter}
onUpdateInput={this.onUpdateDataInput}
searchText={this.state.dataSearchText}
value={this.state.dataSearchText}
onNewRequest={this.handleDataItemSelect}
menuStyle={{height: 500}}
fullWidth={true}
dataSource={this.getDataSearchItems()}
/>
</div>
*/
