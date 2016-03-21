var React = require('react'),
		uuid = require('node-uuid'),
		ChartTooltipHandler = require('../../mixins/ChartTooltipHandler.jsx');

var SeriesChart = React.createClass({
  mixins: [
    ChartTooltipHandler
  ],
  getInitialState: function() {
    return { chartId: uuid.v4() };
  },
  componentDidUpdate: function() {
    if(!this.state.chart) return;
    this.state.chart.update();
  },
  componentDidMount: function() {
    if (typeof(this.props.component) === 'undefined'
          || this.props.component.state === null
					|| this.props.component.state.type === 'doughnutChart'
					|| this.props.component.state.type === 'pieChart'
          || this.props.component.state.type === 'dataList') return;
    this.buildChart(this.props);
  },
  componentWillReceiveProps: function(newProps) {
    if (this.state.chart) this.state.chart.destroy();
    this.buildChart(newProps)
  },
  buildChart: function(props) {
    if (!props.component.state) return;
    var labels = props.component.state.labels;
    var dataSets = [],
        i = 0;
    props.component.state.data.forEach(function(d){
      dataSets.push(this.dataSetForIndex(i, d.entity, d.values));
      i++;
    }.bind(this));
    this.renderChart(labels, dataSets);
  },
  renderLegend: function () {
    if (typeof(this.params) === 'undefined' || typeof(this.params.component.state) === 'undefined') return;
    return _.map(this.state.data.datasets, function (dataset, i) {
      return(
        <div key={i} className="company-legend">
          <span className="legend-color" style={{backgroundColor: dataset.pointStrokeColor}}></span><span>{dataset.label}</span>
        </div>
      );
    });
  },
  renderChart: function(labels, dataSets) {
		if (typeof(labels) === 'undefined') return;
    var self = this;
		if (typeof($("#" + this.state.chartId).get(0)) === 'undefined') return;
    var chart = $("#" + this.state.chartId).get(0);
    if (typeof(chart) === 'undefined') { return; }
    var ctx = chart.getContext("2d");

    var data = {
      labels: labels,
      datasets: dataSets
    };

    var chartSettings = {
      animation: true,
      tooltipFontSize: 11,
      tooltipFillColor: 'rgba(255,255,255,0.6)',
      tooltipFontStyle: 'Avenir-Book',
      tooltipFontColor: '#333',
      tooltipTitleFontFamily: 'Avenir-Book',
      tooltipTitleFontColor: '#738694',
      tooltipTitleFontSize: 11,
      tooltipTitleFontStyle: 'normal',
      scaleFontColor: "#fff",
      scaleLineColor: "rgba(255,255,255,0.3)",
      scaleGridLineColor: "rga(255,255,255,0.3)",
      scaleLabel: "<%= ' ' + value%>",
      scaleFontSize: 11,
      scaleShowVerticalLines: false,
      scaleOverride : false,
      pointDotRadius : 3,
      customTooltips: function (tooltip) {
        if (!self.isTooltip(tooltip)) return;
        self.renderTooltip(tooltip, "", self.state.data);
      }
    };
    if (this.props.component.view === 'lineChart') {
      this.chart = new Chart(ctx).Line(data, chartSettings);
    } else {
      this.chart = new Chart(ctx).Bar(data, chartSettings);
    }
    this.setState({
      chart: this.chart,
      data: data
    });
  },
  dataSetForIndex: function(index, label, dataSet) {
    colors = ["#50e3c2", "#f5a623", "#e76959", "#ffd300" ,"#97c93c"];
    var fillColor = "rgba(0,0,0,0)";
    if (this.props.component.view === 'barChart') {
      fillColor = colors[index];
    }
    return {
        label: label,
        fillColor: fillColor,
        strokeColor: colors[index],
        pointColor: "#fff",
        pointStrokeColor: colors[index],
        pointHighlightFill: "#fff",
        pointHighlightStroke: colors[index],
        data: dataSet,
        summaryNumber: 38.2
    };
  },
  render: function() {
      return (
        <div>
          <div className="chart-legend">
            {this.renderLegend()}
          </div>
          <canvas id={this.state.chartId} width="380px" height="240px"></canvas>
          <div ref="chartjsTooltip" id="linechart-tooltip"></div>
       </div>
      );
  }
});
module.exports = SeriesChart;
