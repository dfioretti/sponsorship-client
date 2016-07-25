var React = require('react');
var _ = require('underscore');
var BarChart = require('react-chartjs').Bar;
var ComposedChart = require('recharts').ComposedChart;
var Line = require('recharts').Line;
var Bar = require('recharts').Bar;
var XAxis = require('recharts').XAxis;
var YAxis = require('recharts').YAxis;
var Legend = require('recharts').Legend;
var Tooltip = require('recharts').Tooltip;
var titleize = require('underscore.string/titleize');
var Avatar = require('material-ui').Avatar;

var CustomizedLabel = React.createClass({
    getValueOfLabel: function() {
        return "/some/link";
    },
    render: function() {
        var label, payload = this.props;
        return (
            <img src={this.getValueOfLabel(label)}>
            </img>
        )
    }
});


var ScoreBar = React.createClass({
    buildData: function(assets, metric) {
        var data = [];
        var metricFormat = titleize(metric.split("_").join(" "));
        _.each(assets, function(a) {
            var input = {};
            input['name'] = a.name.split(" ").pop(-1);
            input[metricFormat] = null;
            input['Team Score'] = null;
            _.each(a.metrics, function(m) {
                if (m.source == 'score') {
                    if (m.metric == metric) {
                        input[metricFormat] = Math.round(m.value * 100.0, 2);
                    }
                    if (m.metric == 'team_score') {
                        input['Team Score'] = Math.round(m.value * 100.0, 2);
                    }
                }
            })
            data.push(input);
        });
        return data;
    },
    render: function() {
        var rawData = this.buildData(this.props.assets, this.props.metric);
        var metricFormat = titleize(this.props.metric.split("_").join(" "));

        return (
            <ComposedChart margin={{top: 40, right: 10, bottom: 30, left: 10}}width={900} height={550} data={rawData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={metricFormat} barSize={50} fill="#208089" />
                <Line type="monotone" dataKey="Team Score" strokeWidth={4} stroke="#8671C3" />
            </ComposedChart>
        )
    }
});

module.exports = ScoreBar;
/*
 *
 *
 *         var labels = [];
        _.each(assets, function(a) {
            labels.push(a.name);
        })
        var dataSets = {};
        _.each(assets, function(a) {
            _.each(a.metrics, function(m) {
                if (m.source == 'score') {
                    if (!_.has(dataSets, m.metric)) {
                        dataSets[m.metric] = [];
                    }
                    dataSets[m.metric].push(Math.round(m.value * 100), 2);
                }
            })
        });
        return { labels: labels, dataSets: dataSets };


 * */
