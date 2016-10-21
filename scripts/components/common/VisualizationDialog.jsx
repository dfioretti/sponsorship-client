var React = require('react');
var AutoComplete = require('material-ui').AutoComplete;
var MenuItem = require('material-ui').MenuItem;
var SearchIcon = require('material-ui/svg-icons/action/search');
var LineChart = require('react-icons/lib/fa/line-chart');
var BarChart = require('react-icons/lib/fa/bar-chart');
var PieChart = require('react-icons/lib/fa/pie-chart');
var AreaChart = require('react-icons/lib/fa/area-chart');
var CalcIcon = require('react-icons/lib/fa/calculator');
var TableIcon = require('react-icons/lib/fa/list');
var RadarIcon = require('react-icons/lib/md/gps-fixed');
var Avatar = require('material-ui').Avatar;
var Chip = require('material-ui').Chip;
var Grid = require('react-bootstrap').Grid;
var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;
var Colors = require('../../constants/colors.js');
var titleize = require('underscore.string/titleize');
var Step = require('material-ui').Step;
var Stepper = require('material-ui').Stepper;
var StepLabel = require('material-ui').StepLabel;
var RaisedButton = require('material-ui').RaisedButton;
var FlatButton = require('material-ui').FlatButton;
var Divider = require('material-ui').Divider;
var TextField = require("material-ui").TextField;
var Paper = require('material-ui').Paper;
var IconButton = require('material-ui').IconButton;
var CircularProgress = require('material-ui').CircularProgress;
var uuid = require('node-uuid');
var Tabs = require('material-ui').Tabs;
var Tab = require('material-ui').Tab;

var VisualizationDialog = React.createClass({
	getInitialState: function() {
		return { charts: ['Bar', 'Line', 'Radar', 'Pie', 'Table'], uuid: uuid.v4(), chartType: "Bar", chartName: "", chipData: [], searchText: "", dataChips: [], dataSearchText: ""};
	},
	getDataSearchItems: function() {
		var data = [];
		var metrics = this.props.assets[0].metrics;
		metrics.forEach(function(m) {
			data.push({
				text: titleize(m.metric.split("_").join(" ")),
				metric: m.metric,
				image: '/images/' + m.icon,
				value: (
					<MenuItem
						leftIcon={<Avatar backgroundColor={Colors.WHITE} src={'/images/' + m.icon} />}
						primaryText={titleize(m.metric.split("_").join(" "))}
						key={m.metric}
						/>
				)
			});
		});
		return data;
	},
	getSearchItems: function() {
		var data = [];
		this.props.assets.forEach(function(asset) {
			data.push({
				text: asset.name,
				entity_key: asset.entity_key,
				image: asset.image_url,
				value: (
					<MenuItem
						leftIcon={<Avatar src={asset.image_url} />}
						primaryText={asset.name}
						key={asset.id}
						/>
				)
			});
		});
		return data;
	},
	onUpdateDataInput: function(searchText, dataSource) {
		this.setState({dataSearchText: searchText});
	},
	onUpdateInput: function(searchText, dataSource) {
		this.setState({searchText: searchText});
	},
	handleItemSelect: function(item, index) {
		this.setState({
			chipData: this.state.chipData.concat({
				key: item.entity_key,
				label: item.text,
				img: item.image
			}),
			searchText: ""
		});
	},
	handleDataItemSelect: function(item, index) {
		this.setState({
			dataChips: this.state.dataChips.concat({
				key: item.metric,
				label: item.text,
				img: item.image
			}),
			dataSearchText: ""
		});
	},
	handleRequestDelete: function(key) {
		this.chipData = this.state.chipData;
		var chipToDelete = this.chipData.map((chip) => chip.key).indexOf(key);
		this.chipData.splice(chipToDelete, 1);
		this.setState({chipData: this.chipData});
	},
	handleRequestDataDelete: function(key) {
		this.dataChips = this.state.dataChips;
		var chipToDelete = this.dataChips.map((chip) => chip.key).indexOf(key);
		this.dataChips.splice(chipToDelete, 1);
		this.setState({dataChips: this.dataChips});
	},
	renderDataChip: function(data) {
		return (
			<Chip
				key={data.key}
				style={{margin: 4}}
				backgroundColor={Colors.LIGHT}
				onRequestDelete={() => this.handleRequestDataDelete(data.key)}
				>
				<Avatar src={data.img} backgroundColor={Colors.LIGHT}/>
				{data.label}
			</Chip>
		);
	},
	renderChip: function(data) {
		return (
			<Chip
				key={data.key}
				style={{margin: 4}}
				onRequestDelete={() => this.handleRequestDelete(data.key)}
				id={data.key}
				>
				<Avatar src={data.img} />
				{data.label}
			</Chip>
		);
	},
	setChartType: function(event) {
		event.preventDefault();
		this.setState({ chartType: event.currentTarget.id});
	},
	handleNameChange: function(event) {
		this.setState({chartName: event.target.value});
	},
	renderIcons: function(c) {
		var iconSize = 100;
		var buttonStyle = {
			margin: "10px",
			height:  100,
			width: 100,
			color: Colors.LIGHT
		};
		var selectedStyle = {
			margin: "10px",
			height: 100,
			width: 100,
			color: Colors.MAIN
		};
		switch(c) {
			case "Bar":
			return (
				<IconButton id="Bar" key="Bar" onTouchTap={this.setChartType} style={(this.state.chartType == c) ? selectedStyle : buttonStyle} tooltip="Bar Chart">
					<BarChart size={iconSize} />
				</IconButton>
			);
			break;
			case "Line":
			return (
				<IconButton id="Line" key="Line" onTouchTap={this.setChartType} style={(this.state.chartType == c) ? selectedStyle : buttonStyle}  tooltip="Line Chart">
					<LineChart  size={iconSize} />
				</IconButton>
			);
			break;
			case "Radar":
			return (
				<IconButton id="Radar" key="Radar" onTouchTap={this.setChartType} style={(this.state.chartType == c) ? selectedStyle : buttonStyle}  tooltip="Radar Chart">
					<RadarIcon size={iconSize} />
				</IconButton>
			);
			break;
			case "Pie":
			return (
				<IconButton id="Pie" key="Pie" onTouchTap={this.setChartType} style={(this.state.chartType == c) ? selectedStyle : buttonStyle}  tooltip="Pie Chart">
					<PieChart size={iconSize} />
				</IconButton>
			);
			break;
			case "Table":
			return (
				<IconButton id="Table" key="Table" onTouchTap={this.setChartType} style={(this.state.chartType == c) ? selectedStyle : buttonStyle}  tooltip="Data Table">
					<TableIcon size={iconSize} />
				</IconButton>
			);
		}
	},
	handleSave: function(event) {
		this.props.doSave(this.state);
	},
	render: function() {
		var iconSize = 125;
		var iconPad = "0px";
		return (
			<div>
					<Row>
						<Col md={5}>
							<h4 style={{textTransform: "uppercase", letterSpacing: "1.5px"}}>Enter Title</h4>
							<TextField
								hintText="Title"
								value={this.state.chartName}
								onChange={this.handleNameChange}
								fullWidth={true}
								/>
						</Col>
						<Col md={7}>
							<h4 style={{textTransform: "uppercase", letterSpacing: "1.5px"}}>Select Type</h4>
							{this.state.charts.map(this.renderIcons, this)}
						</Col>
					</Row>
					<h4 style={{textTransform: "uppercase", letterSpacing: "1.5px"}}>Select Chart Data</h4>
					<Row>
						<Col md={5}>
							<AutoComplete
								hintText="Add Properties"
								filter={AutoComplete.caseInsensitiveFilter}
								onUpdateInput={this.onUpdateInput}
								searchText={this.state.searchText}
								value={this.state.searchText}
								onNewRequest={this.handleItemSelect}
								menuStyle={{height: 250}}
								fullWidth={true}
								dataSource={this.getSearchItems()}
								/>

						</Col>
						<Col md={7}>
							<h6 style={{textTransform: "uppercase", letterSpacing: "1.5px"}}>Selected Properties</h6>
							<div style={{display: 'flex', flexWrap: 'wrap'}}>
								{this.state.chipData.map(this.renderChip, this)}
							</div>
						</Col>
					</Row>
					<Row style={{height: "20px"}}></Row>
					<Row>
						<Col md={5}>
							<AutoComplete
								hintText="Add Data Points"
								filter={AutoComplete.caseInsensitiveFilter}
								onUpdateInput={this.onUpdateDataInput}
								searchText={this.state.dataSearchText}
								value={this.state.dataSearchText}
								onNewRequest={this.handleDataItemSelect}
								menuStyle={{height: 250}}
								fullWidth={true}
								dataSource={this.getDataSearchItems()}
								/>
						</Col>
						<Col md={7}>
							<h6 style={{textTransform: "uppercase", letterSpacing: "1.5px"}}>Selected Data</h6>
							<div style={{display: 'flex', flexWrap: 'wrap'}}>
								{this.state.dataChips.map(this.renderDataChip, this)}
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
								onTouchTap={this.handleSave}
								/>
						</Col>
					</Row>
			</div>
		);
	}
});

module.exports = VisualizationDialog;
