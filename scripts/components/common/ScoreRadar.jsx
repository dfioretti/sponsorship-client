var React = require('react');
var API_ROOT = require('../../constants/environment.js').API_ROOT;
var RadarChart = require('react-chartjs').Radar;
var CircularProgress = require('material-ui').CircularProgress;
var _ = require('underscore');
var titleize = require('underscore.string/titleize');
var numberFormat = require('underscore.string/numberFormat');


var ScoreRadar = React.createClass({
    getInitialState: function() {
        var names = [];
        var points = [];
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
                    fillColor: "rgba(220, 220, 220, 0.4)",
                    strokeColor: "rgba(220, 220, 220, 0.2)",
                    data: points
                }
            ]
        }
        return { chartData: radarData }
    },
    renderContent: function() {
        var radarOptions = {
            pointLabelFontSize: 14,
            pointLabelFontColor: "#FFF"
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
