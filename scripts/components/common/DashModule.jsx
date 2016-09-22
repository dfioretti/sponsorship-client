var React = require('react');
var Card = require('material-ui').Card;
var BarChart = require('recharts').BarChart;
var Bar = require('recharts').Bar;
var XAxis = require('recharts').XAxis;
var YAxis = require('recharts').YAxis;
var Legend = require('recharts').Legend;
var Tooltip = require('recharts').Tooltip;
var ResponsiveContainer = require('recharts').ResponsiveContainer;
var Colors = require("../../constants/colors.js");
var PieChart = require('recharts').PieChart;
var Pie = require('recharts').Pie;
var RadarChart = require('recharts').RadarChart;
var Radar = require('recharts').Radar;
var PolarGrid = require('recharts').PolarGrid;
var PolarAngleAxis = require('recharts').PolarAngleAxis;
var PolarRadiusAxis = require('recharts').PolarRadiusAxis;
var ReactEcharts = require('echarts-for-react');



var DashModule = React.createClass({

	shouldComponentUpdate: function(nextProps, nextState) {
		return true;
		//return nextProps.height !== this.props.height || nextProps.layout.length !== this.props.layout.length;
	},

	renderChart: function(props) {
		var el = null;
		switch(this.props.chartType) {
			case 'bar':
			el = (
				<BarChart data={this.props.data}>
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey="value" fill={Colors.SECONDARY} />
				</BarChart>
			);
			break;
			case 'pie':
			el = (
				<PieChart>
					<Legend />
					<Pie data={this.props.data} fill={Colors.MAIN} />
				</PieChart>
			)
			break;
			case 'stat':
			break;
			case 'rank':
			break;
			case 'radar':
			el = (
				<RadarChart data={this.props.data}>
					<h3>hola</h3>
					<Radar name="Values" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
					<PolarGrid />
					<PolarAngleAxis dataKey="name" />
					<PolarRadiusAxis/>
				</RadarChart>
			);
			break;
		}
		return el;
	},
	renderEchart: function() {
		return (
			<ReactEcharts
				options={this.getOptions()}
				notMerge={true}
				lazyUpdate={true}
				/>
		);
	},
	getOptions: function() {
		const option = {
			title: {
				text: '堆叠区域图'
			},
			tooltip : {
				trigger: 'axis'
			},
			legend: {
				data:['邮件营销','联盟广告','视频广告']
			},
			toolbox: {
				feature: {
					saveAsImage: {}
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis : [
				{
					type : 'category',
					boundaryGap : false,
					data : ['周一','周二','周三','周四','周五','周六','周日']
				}
			],
			yAxis : [
				{
					type : 'value'
				}
			],
			series : [
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
		};
		return option;
	},
	render: function() {
		var props = this.props;
		return (
			<div>
				{this.renderEchart()}
			</div>
		);
		switch (this.props.chartType) {
			case ('stat'):
			{this.renderStat(props)}
			break;
			default:
			return (
				<ResponsiveContainer height={this.props.height}>
					{this.renderChart(props)}
				</ResponsiveContainer>
			);
		}
	}
});
module.exports = DashModule;
