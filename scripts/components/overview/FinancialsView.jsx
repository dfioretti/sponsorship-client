var React = require('react');
var Stat = require('../elements/Stat.jsx');
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Panel = require('react-bootstrap').Panel;
var LineChart = require('react-chartjs').Line;
var Chart = require('../elements/Chart.jsx');

var FinancialsView = React.createClass({
	getChartData: function() {
		return {
			labels: ["January", "February", "March", "April", "May", "June", "July"],
			datasets: [
				{
					 label: "Sales",
					 fillColor: "rgba(220,220,220,0.2)",
					 strokeColor: "rgba(220,220,220,1)",
					 pointColor: "rgba(220,220,220,1)",
					 pointStrokeColor: "#fff",
					 pointHighlightFill: "#fff",
					 pointHighlightStroke: "rgba(220,220,220,1)",
					 data: [65, 59, 80, 81, 56, 55, 40]
 			 	},
 		 		{
					 label: "Activation Spend",
					 fillColor: "rgba(151,187,205,0.2)",
					 strokeColor: "rgba(151,187,205,1)",
					 pointColor: "rgba(151,187,205,1)",
					 pointStrokeColor: "#fff",
					 pointHighlightFill: "#fff",
					 pointHighlightStroke: "rgba(151,187,205,1)",
					 data: [28, 48, 40, 19, 86, 27, 90]
 		 		}
			]
		};
	},
	getPieChartData: function () {
		return [
	    {
	        value: 300,
	        color:"#F7464A",
	        highlight: "#50e3c2",
	        label: "Working"
	    },
	    {
	        value: 100,
	        color: "#46BFBD",
	        highlight: "#f5a623",
	        label: "Non Working"
	    },
		];
	},
	getChartOptions: function() {
		return {
			responsive: true,
		};
		return {
			animation: true,
			responsive: true,
			tooltipFontSize: 11,
			tooltipFillColor: 'rgba(255,255,255,0.6)',
			tooltipFontStyle: 'Avenir-Book',
			tooltipFontColor: '#333',
			tooltipTitleFontFamily: 'Avenir-Book',
			tooltipTitleFontColor: '#738694',
			tooltipTitleFontSize: 11,
			tooltipTitleFontStyle: 'normal',
			showScale: true,

			scaleFontColor: "#fff",
			//scaleLineColor: "rgba(255,255,255,0.3)",
			//scaleGridLineColor: "rga(255,255,255,0.3)",
			scaleLabel: "<%= ' ' + value%>",
			scaleFontSize: 11,
			scaleShowVerticalLines: false,
			scaleOverride : false,
			pointDotRadius : 3
		};
	},
	render: function() {
		if (this.props.entity === 'portfolio') {
		}
		return (
			<div className='overview-container'>
				<Grid bsClass="content-grid">
					<Row>
						<Stat col={4}
							heading={this.props.data.statOneHeading}
							subheading={this.props.data.statOneSub}
							value={this.props.data.statOneValue} />
						<Stat col={4}
							heading={this.props.data.statTwoHeading}
							subheading={this.props.data.statTwoSub}
							value={this.props.data.statTwoValue} />
						<Stat col={4}
							heading={this.props.data.statThreeHeading}
							subheading={this.props.data.statThreeSub}
							value={this.props.data.statThreeValue} />
					</Row>
					<Row>
						<Chart col={12}
									 heading="Sales vs. Activation Spend"
									 chartType="line"
									 data={this.getChartData()}
									 options={{}} />
					</Row>
					<Row>
						<Chart col={4}
									heading="Working vs. Non-Working"
									chartType="pie"
									data={this.getPieChartData()}
									options={{}} />
						<Chart col={4}
									heading="Spend"
									chartType="bar"
									data={this.getChartData()}
									options={{}} />
						<Chart col={4}
									heading="Sales"
									chartType="bar"
									data={this.getChartData()}
									options={{}} />
					</Row>
				</Grid>
			</div>
		);
	}
});
module.exports = FinancialsView;
