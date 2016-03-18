var React = require('react');
var Col = require('react-bootstrap').Col;
var Panel = require('react-bootstrap').Panel;
var LineChart = require('react-chartjs').Line;
var BarChart = require('react-chartjs').Bar;
var PieChart = require('react-chartjs').Pie;
var DoughnutChart = require('react-chartjs').Doughnut;



var Chart = React.createClass({
	renderChart: function() {
		switch (this.props.chartType) {
			case 'line':
					return <LineChart data={this.props.data} options={this.props.options} />
				break;
			case 'bar':
				return <BarChart data={this.props.data} options={this.props.options} />
				break;
			case 'pie':
				return <PieChart data={this.props.data} options={this.props.options} />
				break;
			case 'doughnut':
				return <DoughnutChart data={this.props.data} option={this.props.options} />
				break;
		}
	},
	render: function(){
		return (
			<Col md={this.props.col}>
				<Panel bsClass="panel stat-panel">
					<div className='chart-heading'>
						{this.props.heading}
					</div>
					{this.renderChart()}
				</Panel>
			</Col>
		);
	}
});

module.exports = Chart;
