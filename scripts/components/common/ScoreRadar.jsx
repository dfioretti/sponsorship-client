var React = require('react');
var API_ROOT = require('../../constants/environment.js').API_ROOT;
var RadarChart = require('react-chartjs').Radar;
var CircularProgress = require('material-ui').CircularProgress;
var _ = require('underscore');
var titleize = require('underscore.string/titleize');
var numberFormat = require('underscore.string/numberFormat');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);


var ScoreRadar = React.createClass({
    mixins: [FluxMixin],
    getInitialState: function() {
        var colors = [ "rgba(220, 220, 220, 0.4)",
            "rgba(63, 191, 191, 0.4)",
            "rgba(63, 191, 63, 0.4)",
            "rgba(191, 127, 63, 0.4)",
            "rgba(63, 63, 191, 0.4)",
            "rgba(191, 63, 127, 0.4)",
            "rgba(191, 191, 63, 0.4)",
            "rgba(89, 127, 165, 0.4)",
            "rgba(165, 89, 127, 0.4)",
            "rgba(127, 89, 165, 0.4)",
            "rgba(165, 89, 89, 0.4)"
        ]
        var names = [];
        var points = [];
        if (this.props.asset == null) {
            var assets = this.getFlux().store("AssetsStore").getState().assets;
            _.each(assets, function(asset) {
                var vals = [];
                _.each(asset.metrics, function(m) {
                    if (m.source == 'score' && m.metric != 'team_score') {
                        names.push(titleize(m.metric.split('_').join(' ')));
                        vals.push(numberFormat((m.value * 100), 2));
                    }
                }.bind(this));
                points.push(vals);
            }.bind(this));
            var radarData = {
                labels: names,
                datasets: [

                ]
            }
            var i = 0;
            _.each(points, function(p) {
                radarData.datasets.push({
                    //fillColor: "rgba(220, 220, 220, 0.4)",
                    //strokeColor: "rgba(220, 220, 220, 0.2)",
                    label: titleize(assets[i].entity_key.split('_').pop(-1)),
                    fillColor: colors[i],
                    strokeColor: colors[i],
                    pointStrokeColor: colors[i],
                    pointColor: colors[i],
                    data: p
                });
                i += 1;
            }.bind(this));
            return { chartData: radarData }
        }
        _.each(this.props.asset.metrics, function(m) {
            if (m.source == 'score' && m.metric != 'team_score') {
                names.push(titleize(m.metric.split('_').join(' ')));
                points.push(numberFormat((m.value * 100), 2));
            }
        });
        var radarData = {
            labels: names,
            datasets: [
                {
                    //fillColor: "#50e3c2",
                    //fillColor: "rgba(220, 220, 220, 0.4)",
                    //strokeColor: "rgba(220, 220, 220, 0.2)",
                    fillColor: colors[2],
                    strokeColor: colors[2],
                    data: points
                }
            ]
        }
        return { chartData: radarData }
    },
    renderContent: function() {
        var radarOptions = {
            pointLabelFontSize: 14,
            pointLabelFontColor: "#FFF",
            scaleFontColor: "#fff"

        }
        return (
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <RadarChart data={this.state.chartData} width="380" height="310" style={{marginTop:"-30px"}} options={radarOptions} />
            </div>
        )

    },
    render: function() {
        return (
            <div className="dashboard-module">
                <div className="top">
                    <div className="drag-handle"></div>
                    <div className="top-title">Score Radar</div>
                </div>
                <div className="main">
                    {this.renderContent()}
                </div>
            </div>
        );
    }
});

module.exports = ScoreRadar;
