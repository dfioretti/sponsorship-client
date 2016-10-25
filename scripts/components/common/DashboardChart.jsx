var React = require('react');
var ReactEcharts = require('echarts-for-react');
var Colors = require('../../constants/colors.js');
var echarts = require('echarts');
var theme = require('../../constants/macarons.js');
var theme2 = require('../../constants/walden.js');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var DashboardTable = require('./DashboardTable.jsx');
var Card = require('material-ui').Card;
var SearchIcon = require('material-ui/svg-icons/action/search');
var LineChart = require('react-icons/lib/fa/line-chart');
var BarChart = require('react-icons/lib/fa/bar-chart');
var PieChart = require('react-icons/lib/fa/pie-chart');
var AreaChart = require('react-icons/lib/fa/area-chart');
var CalcIcon = require('react-icons/lib/fa/calculator');
var TableIcon = require('react-icons/lib/fa/list');
var RadarIcon = require('react-icons/lib/md/gps-fixed');
var CardHeader = require('material-ui').CardHeader;
var IconMenu = require('material-ui').IconMenu;
var IconButton = require('material-ui').IconButton;
var MenuItem = require('material-ui').MenuItem;
var ExpandIcon = require('react-icons/lib/md/expand-more');


var DashboardChart = React.createClass({
	mixins: [FluxMixin],
	buildPropertiesFromProps: function() {
		var properties = {};
		this.props.data.properties.forEach(function(prop) {
			properties[prop.key] = this.getFlux().store("DocumentStore").getProperty({entity_key: prop.key });
		}.bind(this));
		return properties;
	},
	propTypes: {
	},
	getLegend: function() {
		if (this.props.data.chartType == 'line' || this.props.data.chartType == 'bar') {
			return (
				null
			);
		}
	},
	getOtion: function() {
		var properties = this.buildPropertiesFromProps();
		var legend = [];
		var series = [];
		var xAxis = [];
		var metrics = [];
		var masterData = {};
		this.props.data.dataPoints.forEach(function(point) {
			xAxis.push(point.label);
			metrics.push(point.key);
		});
		//console.log('xaxis', xAxis, 'metrics', metrics);
		this.props.data.properties.forEach(function(prop) {
			legend.push(properties[prop.key].name);
			var data = [];
			metrics.forEach(function(m) {
				data.push(properties[prop.key].metric_keys[m].value);
			});
			masterData[properties[prop.key].name] = data;
		}.bind(this));

		legend.forEach(function(s) {
			//console.log('in legend loop', s);
			series.push({
				name: s,
				type: this.props.data.chartType,
				data: masterData[s]
			})
		}.bind(this));

		const option = {
			title: {
				show: false,
				text: this.props.data.title
			},
			tooltip : {
				trigger: 'axis'
			},
			legend: {
				orient: 'horizontal',
				x: 'top',
				y: 'left',
				data: legend
			},
			toolbox: {
				show: true,
				feature: {
					saveAsImage: {
						show: true,
						title: 'Save'
					},
					//magicType: { show: true, type: ['line', 'bar']}
				}
			},
			grid: {
				//containLabel: true,
				bottom: 50,
			},
			calculable: true,
			xAxis: [
				{
					type: 'category',
					data: xAxis
				}
			],
			yAxis: [
				{
					type: 'value'
				}
			]
		}
		option['series'] = series;
		return option;
	},
	registerTheme: function() {
		echarts.registerTheme('theme', theme);
		echarts.registerTheme('theme2', theme2);
	},
	buildLabels: function() {
		var labels = [];
		this.props.data.dataPoints.map(function(point) {
			labels.push(point.label);
		});
		return labels;
	},
	buildData: function() {
		var data = [];
		var properties = this.buildPropertiesFromProps();
		this.props.data.properties.map(function(prop) {
			this.props.data.dataPoints.map(function(point) {
				data.push( properties[prop.key].metric_keys[point.key].value);
			}.bind(this));
		}.bind(this))
		return data;
	},
	buildSeries: function() {
		var data = [];
		var properties = this.buildPropertiesFromProps();
		this.props.data.properties.map(function(prop) {
			this.props.data.dataPoints.map(function(point) {
				data.push({ value: properties[prop.key].metric_keys[point.key].value, name: point.label } );
			}.bind(this));
		}.bind(this))
		return data;
	},
	buildIndicators: function() {
		var labels = [];
		this.props.data.dataPoints.map(function(point) {
			labels.push({ text: point.label, max: 1 });
		});
		return labels;
	},
	getRadarOptions: function() {
		var indicators = this.buildIndicators();
		var options = {
			title: {
				show: false,
				text: this.props.data.title
			},
			radar: [
				{
					indicator: indicators,
					radius: '60%',
					scale: true
				}
			],
			tooltip: {
				trigger: 'item'
			},
			toolbox: {
				show: true,
				feature: {
					saveAsImage: {
						show: true,
						title: 'Save'
					},
				}
			},
			legend: {
				orient: 'horizontal',
				x: 'left',
				y: 'top',
				data: this.getLegend()
			},
			series: [
				{
					name: this.props.data.title,
					type: 'radar',
					itemStyle: {
						normal: {
							areaStyle: {
								type: 'default'
							}
						}
					},
					data: [
						{
							value: this.buildData(),
							name: 'Data'
						}
					]
				}
			],
		}
		return options;
	},
	getPieOptions: function() {
		var dataSeries = [];

		var options = {
			title: {
				show: false,
				text: this.props.data.title
			},
			calculable: true,
			tooltip: {
				trigger: 'item'
			},
			grid: {
				//top: 15
				//containLabel: true
			},
			legend: {
				orient: 'horizontal',
				x: 'left',
				y: 'top',
				data: this.buildLabels()
			},
			toolbox: {
				show: true,
				feature: {
					saveAsImage: {
						show: true,
						title: 'Save'
					},
				}
			},
			series: [
				{
					name: 'Series',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					data: this.buildSeries()
				}
			]
		}
		return options;
	},
	renderBar: function() {
		//				//style={{height: this.props.height, width: '100%'}}

		return (
			<ReactEcharts
				option={this.getOtion()}
				height={this.props.height}
				theme="theme2"
				/>
		);
	},
	renderPie: function() {
		//style={{height: this.props.height, width: '100%'}}

		return (
			<ReactEcharts
				option={this.getPieOptions()}
				height={this.props.height}
				theme="theme2"
				/>
		);
	},
	renderRadar: function() {
		//				style={{height: this.props.height, width: '100%'}}

		return (
			<ReactEcharts
				option={this.getRadarOptions()}
				height={this.props.height}
				theme="theme2"
				/>
		);
	},
	renderTable: function() {
		return (
			<DashboardTable metricsColl={this.props.metricsColl} height={this.props.height - 50} />
		);
	},
	renderChart: function() {
		var options = null;
		var width = "100%";
		switch (this.props.data.chartType) {
			case 'bar':
				options = this.getOtion();
				break;
			case 'pie':
				options = this.getPieOptions();
				width = "80%"
				break;
			case 'line':
				options = this.getOtion();
				break;
			case 'radar':
				width = "80%"
				options = this.getRadarOptions();
				break;
			case 'table':
				return this.renderTable();
				break;
		}
		width = "100%";
		var chartHeight = (this.props.height - 50);
		return (
			<div style={{margin: "0px 20px 0px 20px", height: "100%"}}>
			<ReactEcharts
				option={options}
				style={{height: this.props.height , width: "100%", margin: 0, padding: 0}}
				theme="theme2"
				/>
			</div>
		);
	},
	render: function() {
		this.registerTheme();
		var avatar;

		var size = 20;
		switch (this.props.data.chartType) {
			case 'bar':
			avatar = <BarChart style={{color: Colors.MAIN}} size={size} />
			break;
			case 'line':
			avatar = <LineChart style={{color: Colors.MAIN}} size={size} />
			break;
			case 'radar':
			avatar = <RadarIcon style={{color: Colors.MAIN}} size={size} />
			break;
			case 'table':
			avatar = <TableIcon style={{color: Colors.MAIN}} size={size} />
			break;
			case 'pie':
			avatar = <PieChart style={{color: Colors.MAIN}} size={size} />
			break;
		}
		var height = this.props.height;
		return (
					<Card style={{height: '100%'}}>
						<CardHeader titleStyle={{fontWeight: 500 }} avatar={avatar} title={this.props.data.title}>
							<div style={{float: 'right', position: 'relative', top: -15}}>
								<IconMenu
									iconButtonElement={<IconButton><ExpandIcon size={20}/></IconButton>}
								  anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      						targetOrigin={{horizontal: 'left', vertical: 'top'}}
								>
									<MenuItem primaryText="Test" />
								</IconMenu>
							</div>
						</CardHeader>
						{this.renderChart()}
					</Card>
		);
	}
});

module.exports = DashboardChart;
