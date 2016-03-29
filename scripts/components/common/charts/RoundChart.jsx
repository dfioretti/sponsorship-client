var React = require('react'),
		uuid = require('node-uuid');


var RoundChart = React.createClass({
  getInitialState: function() {
    return { chartId: uuid.v4() };
  },
	componentWillReceiveProps: function(newProps) {
		if (newProps.component.state == this.props.component.state) return;
		if (this.state.chart) this.state.chart.destroy();
		this.buildDataState(newProps);
	},
  buildDataState: function(params) {
		if (!params.component.state) return;
    var dataSets = [],
        i = 0;
    params.component.state.data.forEach(function(d) {
      dataSets.push(this.dataSetForIndex(i, d.metric, d.value));
      i++
    }.bind(this));
		this.renderChart(dataSets);
  },
	shouldComponentUpdate: function(newProps) {
		return this.props.component.state != newProps.component.state;
	},
  componentDidMount: function() {
		if (typeof(this.props.component) === 'undefined'
				|| typeof(this.props.component.state) === 'undefined'
			  || typeof(this.props.component.state.data) === 'undefined') return;
    this.buildDataState(this.props);
  },
  componentDidUpdate: function() {
		console.log("holla back", this.props, this.state);
		if (!this.state.chart) return;
		this.state.chart.update();
  },
  backgroundColor: [
    '#2096f3',
		'#03387a',
    '#50e3c2',
    '#f5a623',
    '#2d64a5',
		'#e76959'
  ],
  renderChart: function(dataSets) {
    var strokeWidth = 1;
		if (typeof($("#" + this.state.chartId).get(0)) === 'undefined') return;
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
      roundChart = new Chart(ctx).Doughnut(dataSets, chartDetail);
    } else {
      roundChart = new Chart(ctx).Pie(dataSets, chartDetail);
    }
    roundChart.outerRadius -= (strokeWidth/2);
    this.chart = roundChart;
		this.setState({
			chart: this.chart,
			data: dataSets
		});
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
		//style={{width: "190px", height: "190px", padding: "5px"}}
    return (
      <div style={{paddingTop: "35px", paddingLeft: "20px"}}>
        <div className="" style={{display: "inline-block", padding: "5px"}}>
          <canvas id={this.state.chartId} width="190" height="190" ></canvas>
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
