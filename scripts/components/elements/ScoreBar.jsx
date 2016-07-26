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
var ResponsiveContainer = require('recharts').ResponsiveContainer;

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
    getInitialState: function() {
        return { metric: this.props.metric }
    },
    buildData: function() {
        var data = [];
        var metricFormat = titleize(this.props.metric.split("_").join(" "));
        var entity_keys = _.keys(this.props.assets);
        _.each(entity_keys, function(key) {
            var input = {};
            if (key.indexOf('ncaa') != -1) {
                input['name'] = titleize(key.split("_").slice(0, 1)[0].substr(0, 6) + key.charAt(key.length - 1));
            } else {
                input['name'] = titleize(key.split("_").pop(-1));
            }
            input[metricFormat] = Math.round(this.props.scoreMetrics[this.props.metric + "_" + key].value * 100);
            input['Team Score'] = Math.round(this.props.scoreMetrics['team_score_' + key].value * 100);
            data.push(input);
        }.bind(this));
        return data;
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        return nextProps.metric != this.props.metric;
    },
    render: function() {
        var rawData = this.buildData();
        var metricFormat = titleize(this.props.metric.split("_").join(" "));

        return (
            <ResponsiveContainer>
                <ComposedChart width={900} height={550} data={rawData}
                    margin={{top: 20, right: 20, bottom: 20, left: 20}} >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={metricFormat} barSize={50} fill="#2F4B98" />
                    <Line type="monotone" dataKey="Team Score" strokeWidth={4} stroke="#8671C3" />
                </ComposedChart>
            </ResponsiveContainer>
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
