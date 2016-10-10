var React = require('react');
var ReactDOM = require('react-dom');
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
var NormalizeIcon = require('react-icons/lib/fa/magic')
var WeightIcon = require('react-icons/lib/fa/balance-scale');
var Slider = require('material-ui').Slider;
var Chip = require('material-ui').Chip;
var Avatar = require('material-ui').Avatar;
var DragSource = require('react-dnd').DragSource;
var SortIcon = require('react-icons/lib/md/sort');
var PropTypes = React.PropTypes;
var DragMetric = require('./DragMetric.jsx');
var FormulaContainer = require('./FormulaContainer.jsx');
var uuid = require('node-uuid');
var Toggle = require('material-ui').Toggle;
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
var Popover = require('material-ui').Popover;
var List = require('material-ui').List;
var ListItem = require('material-ui').ListItem;
var Divider = require('material-ui').ListItem;
var StatEngine = require('../../utils/StatEngine.js');

var currentElementWeight;

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
	componentWillReceiveProps: function(newProps) {
		this.loadStateData(newProps);
	},
	componentWillMount: function() {
		this.loadStateData(this.props);
	},
	loadStateData: function(props) {
		console.log('props yo', props);
		console.log('props', props.kpiEdit);
		var data = [];
		var metrics = props.assets[0].metrics;
		if (props.kpiEdit) {
			this.setState({
				formulaName: props.kpiEdit.name,
				uuid: props.kpiEdit.uuid,
				formula: props.kpiEdit.formula,
				outputData: props.kpiEdit.formula
			});
		}
		if (typeof(metrics) === 'undefined') return;
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
			displayData: Immutable.fromJS(data).toList(),
		});
	},
	getInitialState : function(){
		return { currentIndex: -1, anchorEl: null, uuid: uuid.v4(), currentNode: null, currentSliderValue: 1, formulaName: "", showPopover: false, formula: [], inputData: [], outputData: [] , data: Immutable.List(), filteredData: Immutable.List(), displayData: Immutable.List(), dataSearchText: "", searchText: "", fullWidth: false}
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
	addInput: function(obj, event) {
		var row = {
			key: uuid.v4(),
			text: obj.get('text'),
			metric: obj.get('metric'),
			icon: obj.get('icon'),
			image: obj.get('icon'),
			popover: true,
			weight: 1,
			normalize: true
		};
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
	getRows: function() {
		return Selectors.getRows(this.state);
	},

	getSize: function() {
		return this.getRows().length;
	},
	rowGetter: function(rowIdx){
		var rows = this.getRows();
		return rows[rowIdx];
	},
	doKpiSave: function(event) {
		this.props.doKpiSave({ name: this.kpiName.input.value, inputData: this.state.inputData, formula: this.state.formula, uuid: this.state.uuid });
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
	updateFormulaName: function(event) {
		this.setState({
			formulaName: event.target.value
		});
	},
	handleClose: function() {
		this.setState({
			showPopover: false
		});
	},
	renderPopover: function() {
		var popoverStyle = {
			height: 200,
			width: 300,
			zIndex: 9999999,
			top: (this.state.y -200) + 'px',
			left: (this.state.x - 175) + 'px',
			position: 'absolute'
			//marginBottom: this.state.y,
			//marginRight: this.state.x,
			//backgroundColor: 'green'
			//style={popoverStyle}

		}
		if (this.state.currentNode == null) return null;
		//console.log('uh', network, nodes, edges);
		//console.log('nodes', nodes);
		//console.log('wtf', nodes.get(this.state.currentNode));
		//var currentObject = nodes.get(this.state.currentNode);
		console.log('anchor', this.state.anchorEl);
		return (
			<Popover
				open={this.state.showPopover}
				style={popoverStyle}
				anchorEl={this.state.anchorEl}
				key={uuid.v4()}
				anchorOrigin={{horizontal: 'left', vertical: 'top'}}
				targetOrigin={{horizontal: 'left', vertical: 'top'}}
				onRequestClose={this.handleClose}
				animation={Popover.PopoverAnimationVertical}
				>
				<div className="title med center">Configure</div>
				<Divider />
				<List>
					<ListItem
						primaryText="Normalize"
						disabled={true}
						rightToggle={<Toggle onToggle={this.onNormalizeToggle.bind(this, this.state.currentNode)} toggled={this.state.currentNode.normalize} />}
						leftIcon={<NormalizeIcon />}
						/>
						<ListItem
							primaryText={
							<Row>
									<Col md={9}>
										<Slider defaultValue={1} value={this.state.currentSliderValue} onChange={this.onWeightChange} style={{maring: 0, padding: 0}} sliderStyle={{margin: 0, padding: 0}}/>
									</Col>
									<Col md={2}>
										{Math.round(currentElementWeight * 100, 0)}
									</Col>
									<Col md={1}></Col>
							</Row>}
							leftIcon={<WeightIcon />}
							disabled={true}
							/>
				</List>
			</Popover>
		);
		//value={nodes.get(this.state.currentNode).weight
	},
	onNormalizeToggle: function(currentNode, event, isToggled) {
		console.log('toggle', currentNode, event, isToggled);
		this.inputData = this.state.inputData;
		this.inputData[this.state.currentIndex].normalize = !this.inputData[this.state.currentIndex].normalize;
		this.setState({
			inputData: this.inputData
		});
		/*
		this.setState({
			doUpdate: true
		});
		*/
		//nodes.update({id: currentNode, normalize: !isToggled});
		//this.forceUpdate();
	},
	onWeightChange: function(event, value) {
		this.inputData = this.state.inputData;
		this.inputData[this.state.currentIndex].weight = value;
		this.currentNode = this.state.currentNode;
		this.currentNode.weight = value;
		currentElementWeight = value;
		//this.forceUpdate();
		this.setState({
			currentSliderValue: value,
			inputData: this.inputData
		});
		/*
		this.setState({
			currentNode: this.currentNode
			//inputData: this.inputData
		});
		//this.state.inputData[this.state.currentIndex].weight = value;
		//nodes.update({id: currentNode, weight: value});
		//this.forceUpdate();
		//*/
	},
	onSelectInput: function(nativeEvent, nodeId) {
		this.inputData = this.state.inputData;
		var idx = this.inputData.map((input) => input.key).indexOf(nodeId);
		///console.log('on select input', input, event, event);
		//var element = document.getElementById(input.key);
		//console.log('el', element);
		//console.log('event', event.target);
		currentElementWeight = this.inputData[idx].weight;
		this.setState({
			currentNode: this.inputData[idx],
			currentSliderValue: this.inputData[idx].weight,
			showPopover: true,
			x: nativeEvent.clientX,
			currentIndex: idx,
			y: nativeEvent.clientY,
			anchorEl: document.getElementById(nodeId)
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
					<Col md={8}>
							<TextField
								ref={(ref) => this.kpiName = ref}
								hintText="KPI Name"
								defaultValue={this.state.formulaName}
								fullWidth={this.state.fullWidth}
								/>
					</Col>
				</Row>
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
									hintText="Data Search"
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
							<FormulaContainer outputData={this.state.outputData} inputData={this.state.inputData} onSelectInput={this.onSelectInput} updateOutput={this.updateOutput} />
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
							onTouchTap={this.doKpiSave}
							/>
					</Col>
				</Row>
				{this.renderPopover()}
			</div>
		)
	}
});

module.exports = MetricBuilder;
