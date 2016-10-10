'use strict';
var React = require('react');
var Grid = require('react-grid-layout');
var PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
var _ = require('lodash');
var Pie = require('react-chartjs').Pie;
var uuid = require('node-uuid');
var WidthProvider = require('react-grid-layout').WidthProvider;
var Card = require('material-ui').Card;
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;
var DashModule = require('./DashModule.jsx');
var DashboardChart = require('./DashboardChart.jsx');
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);
Chart.defaults.global.responsive = true;

var data = [
	{
    value: 30,
    color: "#F7464A"
  }, {
    value: 50,
    color: "#E2EAE9"
  }, {
    value: 100,
    color: "#D4CCC5"
  }, {
    value: 40,
    color: "#949FB1"
  }, {
    value: 100,
    color: "#4D5360"
  }
];

var options = {
  animation: true,
  animationEasing: 'easeInOutQuart',
  animationSteps: 80,
	responsive: true
};
/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */
var InteractiveDashboard = React.createClass({

	getInitialState: function() {
		var layout = [
		];

		return {
			layout: layout,
			newLayout: layout,
			newCounter: 0,
			changedLayout: null
		}
	},

	onAddItem: function() {
		this.setState({
			newLayout: this.state.newLayout.concat({
				i: 'n' + this.state.newCounter,
				x: this.state.newLayout.length * 2 % (12),
				y: Infinity,
				w: 6,
				h: 1
			}),
			newCounter: this.state.newCounter + 1
		});
	},

	renderLayout: function() {
		{this.state.layout.map(function(i) {
			console.log("render", i);
			return (
				<div key={i.i} data-grid={i}>this is it: {i}</div>
			);
		}.bind(this))}
	},
	onLayoutChange: function(layout) {
		//console.log("param", layout);
		//console.log("newloy", this.state.newLayout);
		if (this.isMounted())
			this.setState({ changedLayout: layout});

		console.log("layout change??", layout);
		//this.setState({layout: layout});
	},

  render: function() {
		console.log("render", this.state.newLayout);
		var rowHeight = 150;
		var cols = 12;
		var gridWidth = window.innerWidth;
    return (
      <div>
        <button onClick={this.onAddItem}>Add Item</button>
				<Grid className="layout" cols={cols}  layout={this.state.newLayout} onLayoutChange={this.onLayoutChange} rowHeight={rowHeight} width={gridWidth}>
					{this.state.newLayout.map(function(l) {
						return (
							<div key={uuid.v4()} style={{width: "100%", height: rowHeight * l.h}} _grid={{h: l.h, w: l.w, x: l.x, y: l.y}}>
								<Card style={{height: rowHeight * l.h}}>
									<DashboardChart />
								</Card>
							</div>
						);
					})}
				</Grid>
      </div>
    );
  }
});

module.exports = InteractiveDashboard;

//									<DashModule height={rowHeight * l.h}/>
