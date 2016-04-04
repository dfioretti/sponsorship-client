var React = require('react');
var PieChart = require('react-chartjs').Pie;

var Valuation = React.createClass({
	componentDidMount: function() {
		this.buildChart();
	},
	getChartData: function() {
		var data = [];
		if (this.props.asset) {
			this.props.asset.metrics.forEach(function(metric) {
				switch (metric.metric) {
					case 'team_value':
						data.push({
							value: metric.value,
							color: '#2096f3',
							label: 'Team Value'
						});
						break;
					case 'market_value':
						data.push({
							value: metric.value,
							color: '#03387a',
							label: 'Market Value'
						});
						break;
					case 'sport_value':
						data.push({
							value: metric.value,
							color: '#50e3c2',
							label: 'Sport Value'
						});
						break;
					case 'brand_value':
						data.push({
							value: metric.value,
							color: '#f5a623',
							label: 'Brand Value'
						});
						break;
				}
			})
		}
		return data;
	},
	buildChart: function() {
		var strokeWidth = 1.3;
		var ctx = $("#value-chart").get(0).getContext("2d");
		var chartDetail = {
			segmentStrokeWidth: strokeWidth,
			tooltipFontSize: 9,
			tooltipFillColor: 'rgba(255,255,255,0.8)',
			tooltipFontStyle: 'Avenir-Medium',
			tooltipFontColor: '#333',
			animationEasing : "easeOutQuart",
			animateRotate: false,
			animateScale: true,
			animationSteps: 30
		};
		var roundChart = new Chart(ctx).Pie(this.getChartData(), chartDetail);
		roundChart.outerRadius -= (strokeWidth / 1);
	},
	renderContent: function() {
		return (
			<div style={{padding: 3}}>
				<PieChart
					data={this.getChartData()}
					options={{}}
					/>
			</div>
		)
	},
	backgroundColor: [
		'#2096f3',
		'#03387a',
		'#50e3c2',
		'#f5a623',
		'#2d64a5',
		'#e76959'
	],
	renderLegend: function() {
		var data = this.getChartData()
		return $.map(data, function(pt, i) {
			var backgroundColor = this.backgroundColor[i];
			var label = pt.label;
			return (
				<li key={i}>
					<span className="legend-droplet" style={{borderColor: backgroundColor}}></span>
					<span>{label}</span>
				</li>
			);
		}.bind(this));
	},
	renderChart: function() {
		return (
			<div style={{paddingTop: "35px", paddingLeft: "20px"}}>
				<div className="" style={{display: "inline-block", padding: "0px"}}>
					<canvas style={{padding: -5}} id={'value-chart'} width="190" height="190" ></canvas>
				</div>
				<ul className="chart-legend" style={{display: "inline-block", background: "#3c88d1", borderRadius: "3px", paddingRight: "5px", paddingLeft: "15px", paddingTop: "5px", paddingBottom: "15px", position: "absolute", top: "100px", left: "225px", fontSize: "12px", width: "155px", textTransform: "capitalize"}}>
					<h5>Legend</h5>
					{this.renderLegend()}
				</ul>
			</div>
		)
	},
	render: function() {
		return (
			<div className="dashboard-module">
        <div className="top">
          <div className="drag-handle"></div>
          <div className="top-title">{this.props.title}</div>
        </div>
        <div className="main">
          {this.renderChart()}
        </div>
      </div>
		);
	}
});

module.exports = Valuation;
