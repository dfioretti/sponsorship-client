var React = require('react'),
		uuid = require('node-uuid');


var RoundChart = React.createClass({
  getInitialState: function() {
    return { chartId: uuid.v4() };
  },
  componentWillMount: function() {
    this.buildDataState(this.props.component);
  },
  buildDataState: function(params) {
    var dataSets = [],
        i = 0;
    params.state.data.forEach(function(d) {
      dataSets.push(this.dataSetForIndex(i, d.metric, d.value));
      i++
    }.bind(this));
    this.setState({ dataSets: dataSets });
  },
  componentDidMount: function() {
    this.renderChart();
  },
  componentDidUpdate: function() {
  },
  componentWillReceiveProps: function(newProps) {
  },
  componentDidUpdate: function() {
  },
  componentDidReceiveProps: function() {
  },
  backgroundColor: [
    '#2096f3',
    '#e76959',
    '#50e3c2',
    '#f5a623',
    '#2d64a5'
  ],
  renderChart: function() {
    var strokeWidth = 1;
    var ctx = $("#" + this.state.chartId).get(0).getContext("2d");
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

    var roundChart;
    if(this.props.component.view === "doughnutChart") {
      roundChart = new Chart(ctx).Doughnut(this.state.dataSets, chartDetail);
    } else {
      roundChart = new Chart(ctx).Pie(this.state.dataSets, chartDetail);
    }
    roundChart.outerRadius -= (strokeWidth/2);
    this.chart = roundChart;
  },
  dataSetForIndex: function(index, label, value) {
    return {
      label: label.split("_").join(" "),
      value: value,
      color: this.backgroundColor[index]
    };
  },
  renderLegend: function() {
    var data = this.props.component.state.data;
    return $.map(data, function(pt, i) {
      var backgroundColor = this.backgroundColor[i];
      var label = pt.metric.split("_").join(" ");
      return (
        <li key={i}>
          <span className="legend-droplet" style={{borderColor: backgroundColor}}></span>
          <span>{label}</span>
        </li>
      );
    }.bind(this));
  },
  render: function() {
    return (
      <div style={{paddingTop: "35px", paddingLeft: "20px"}}>
        <div className="" style={{display: "inline-block", padding: "5px"}}>
          <canvas id={this.state.chartId} width="190" height="190" style={{width: "190px", height: "190px", padding: "5px"}}></canvas>
        </div>
        <ul className="chart-legend" style={{display: "inline-block", background: "#3c88d1", borderRadius: "3px", paddingRight: "5px", paddingLeft: "15px", paddingTop: "5px", paddingBottom: "15px", position: "absolute", top: "100px", left: "225px", fontSize: "12px", width: "155px", textTransform: "capitalize"}}>
          <h5>Legend</h5>
          {this.renderLegend()}
        </ul>
      </div>
    )
  }
});
module.exports = RoundChart;
