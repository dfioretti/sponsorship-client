var React = require('react');
var ReactEcharts = require('echarts-for-react');
var echarts = require('echarts');
var theme = require('../../constants/macarons.js');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);

var DashboardChart = React.createClass({
	mixins: [FluxMixin],
	buildPropertiesFromProps: function() {
		var properties = {};
		//console.log(this.props.data);
		this.props.data.properties.forEach(function(prop) {
			//console.log("in the view", prop);
			properties[prop.key] = this.getFlux().store("AssetsStore").getAssetByKey(prop.key);
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
			/*
			series.push({
			name: properties[prop.key].name,
			type: this.props.data.chartType,
			stack: "group1",
			areaStyle: {normal: {}},
			data: data
			});
			*/
		}.bind(this));

		legend.forEach(function(s) {
			//console.log('in legend loop', s);
			series.push({
				name: s,
				type: this.props.data.chartType,
				/*
				markPoint: {
					data: [
						{type: 'max', name: "Max"},
						{type: 'min', name: "Min"}
					]
				},//,
				/*
				markLine: {
					data: [
						{type: 'average', name: 'Average'}
					]
				},
				*/
				//stack: 'group1',
				//areaStyle: {normal: {}},
				data: masterData[s]
			})
		}.bind(this));

		//console.log('properties', properties);
		const option = {
			title: {
				text: this.props.data.title
			},
			tooltip : {
				trigger: 'axis'
			},
			legend: {
				orient: 'horizontal',
				x: 'top',
				y: 'left',
				padding: [40, 0, 0, 10],
				data: legend
			},
			toolbox: {
				show: true,
				feature: {
					saveAsImage: {show: true},
					dataView: {show: true},
					magicType: { show: true, type: ['line', 'bar']}
				}
			},
			grid: {
				y: 100,
				x: 90
				//left: '3%',
				//right: '4%',
				//bottom: '3%',
				//containLabel: true
			},
			calculable: true,
			xAxis : [
				{
					type : 'category',
					//boundaryGap : false,
					data : xAxis//['周一','周二','周三','周四','周五','周六','周日']
				}
			],
			yAxis : [
				{
					type : 'value'
				}
			],
			series : series
		};
		console.log('options', option);
		return option;
	},
	registerTheme: function() {
		echarts.registerTheme('theme', theme);
	},
	render: function() {
		this.registerTheme();
		var height = this.props.height;
		return (
			<div className='examples'>
				<div className='parent' style={{padding: "10px"}}>
					<ReactEcharts
						option={this.getOtion()}
						style={{height: height, width: '100%'}}
						theme="theme"
						/>
				</div>
			</div>
		);
	}
});

module.exports = DashboardChart;
/*
[
{
name:'邮件营销',
type:'line',
stack: '总量',
areaStyle: {normal: {}},
data:[120, 132, 101, 134, 90, 230, 210]
},
{
name:'联盟广告',
type:'line',
stack: '总量',
areaStyle: {normal: {}},
data:[220, 182, 191, 234, 290, 330, 310]
},
{
name:'视频广告',
type:'line',
stack: '总量',
areaStyle: {normal: {}},
data:[150, 232, 201, 154, 190, 330, 410]
}
]
*/
