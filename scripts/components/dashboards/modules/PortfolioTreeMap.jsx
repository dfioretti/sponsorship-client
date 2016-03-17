var React = require('react');
var ChartTooltipHandler = require('../../mixins/ChartTooltipHandler.jsx');
var Highcharts = require('highcharts');
require('highcharts/modules/treemap')(Highcharts);

var PortfolioTreemap = React.createClass({
  mixins: [
    ChartTooltipHandler
  ],
  getInitialState: function () {
    return {};
  },
  componentDidMount: function() {
    this.renderChart();
  },
  buildChart: function (props) {
    this.renderChart();
  },
  renderChart: function () {
    var colors = ["#3c88d1", "#e76959", "#f5a623", "#124c93", "#50e3c2", "#03387a", "#738694"];
    var H = Highcharts;
    var chart = new H.Chart({
      chart: {
            style: {
                fontFamily: 'Avenir-Book'
            },
            renderTo: 'treemap',
            height: 270,
            spacing: [0, 0, 0, 0],
            backgroundColor: "#2d64a5",
            borderColor: "#2d64a5"
        },
        series: [{
            borderColor: "#2d64a5",
            type: "treemap",
            layoutAlgorithm: 'squarified',
            levels: [{
                level: 1,
                layoutAlgorithm: 'squarified'
            }],
            allowDrillToNode: true,
            data: [{
                id: 'S',
                name: 'Sport',
                color: colors[3]
            }, {
                id: 'E',
                name: 'Entertainment',
                color: colors[4]
            }, {
                id: 'O',
                name: 'Oranges',
                color: '#EC9800'
            }, {
                id: 'H',
                name: 'Hockey',
                parent: 'S',
                value: 7
            }, {
                name: 'H-Athletes',
                parent: 'H',
                value: 3
            }, {
                name: 'H-Teams',
                parent: 'H',
                value: 4
            }, {
                id: 'B',
                name: 'Baseball',
                parent: 'S',
                value: 8
            }, {
                name: 'B-Teams',
                parent: 'B',
                value: 2
            }, {
                name: 'B-Athletes',
                parent: 'B',
                value: 6
            }, {
                id: 'M',
                name: 'Music',
                parent: 'E',
                value: 9
            }, {
                name: 'Artists',
                parent: 'M',
                value: 3
            }, {
                name: 'Events',
                parent: 'M',
                value: 6
            }]
    }],
    title: {
        text: null
    }
    });


  },
  render: function() {
    var hiddenStyle = this.props.hidden ? {display: 'none'} : {};
    return (
      <div id="global_hotspots" className="dashboard-module" style={hiddenStyle}>
        <div className="top">
          <a className="expand-handle"></a>
          <div className="drag-handle"></div>
          <div className="top-title">Portfolio Allocation</div>
        </div>
        <div className="main">
          <div style={{paddingTop: "0px"}} id="treemap">
          </div>
        </div>
      </div>
    );
  }
});

module.exports = PortfolioTreemap
