var React = require('react');
var _ = require('underscore');
var LineChart = require('react-chartjs').Line;
var SelectField = require('material-ui').SelectField;
var MenuItem = require('material-ui').MenuItem;
var uuid = require('node-uuid');
var numberFormat = require('underscore.string/numberFormat');
var titleize = require('underscore.string/titleize');

//<LineChart data={chartData} width="350" height="225" style={{marginTop: "15px"}} options={chartSettings} />

var DynamicChart = React.createClass({
    getInitialState: function() {
        var series = [];
        var dataSets = [];
        var labels = [];
        if (this.props.asset.historicals !== 'undefined') {
            _.each(this.props.asset.historicals, function(h) {
                series.push(titleize(h.metric.split("_").join(" ")));
                labels.push(_.keys(h.data));
                dataSets.push(_.values(h.data));
            });
        }
        return { dataSets: dataSets, labels: labels, series: series, index: 0 }
    },
    handleChartChange: function(e, i, v) {
        console.log(e, i, v);
        this.setState({index: i});
    },
    format: function(number) {
        return numberFormat(number, 0);
    },
    render: function() {
        if (this.state.series.length == 0) {
            return (
                <div className="dashboard-module">
                    <div className="top">
                        <div className="drag-handle"></div>
                        <div className="top-title"></div>
                    </div>
                    <div className="main">
                    <h1>lol</h1>
                    </div>
                </div>

            )
        }
        var chartData = {
            labels: this.state.labels[this.state.index],
            datasets: [
                {
                    data: this.state.dataSets[this.state.index],
                    fillColor: "rgba(26, 54, 127, 0.2)",
                    strokeColor: "#250D67",
                    pointColor: "#250D67",
                    pointStrokeColor: "#6F85C1"
                }
            ]
        }
        var chartSettings = {
            scaleFontColor: "#fff",
            scaleLabel: function(valuePayload) {
                var val = parseFloat(valuePayload.value);
                if (val < 1000) {
                    if (val < 1)
                        return numberFormat(val, 3);
                    return numberFormat(val, 2);
                } else {
                    return numberFormat(val, 0);
                }
            }
        }
        var i = 0;
        return (
            <div className="dashboard-module">
                <div className="top">
                    <div className="drag-handle"></div>
                    <div className="top-title" style={{marginTop: "-15px"}}>
                        <SelectField
                            onChange={this.handleChartChange}
                            value={this.state.series[this.state.index]}
                            labelStyle={{color: "white"}}
                            underlineStyle={{display: "none"}}
                            >
                            {this.state.series.map(function(s) {
                                return (
                                    <MenuItem
                                        primaryText={s}
                                        value={s}
                                        key={uuid.v4()}
                                        id={i++}
                                        />
                                )
                            })}
                        </SelectField>
                    </div>
                </div>
                <div className="main" style={{display: 'flex', justifyContent: 'center'}}>
                    <LineChart data={chartData} width="350" height="225" style={{marginTop: "15px"}} options={chartSettings} />
                </div>
            </div>

        );
    }
});

module.exports = DynamicChart;
