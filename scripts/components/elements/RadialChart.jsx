var React = require('react');
var Tooltip = require('recharts').Tooltip;
var RadialBar = require('recharts').RadialBar;
var RadialBarChart = require('recharts').RadialBarChart;
var Legend = require('recharts').Legend;
var _ = require('underscore');
var titleize = require('underscore.string/titleize');
var Avatar = require('material-ui').Avatar;

var RadialChart = React.createClass({
    buildData: function() {
        var colors = [
            "#2F4B98",
            "#4C309B",
            "#208089",
            "#E2A933",
            "#6F85C1",
            "#8671C3"
        ];
        var data = [];
        var i = 0;
        _.each(this.props.metricKeys, function(key) {
            if (key != 'team_score') {
                var mKey = key + "_" + this.props.asset.entity_key;
                var metric = this.props.metrics[mKey];
                data.push(
                    {
                        name: titleize(metric.metric.split("_").join(" ")),
                        uv: Math.round((metric.value * 100)),
                        fill: colors[i]
                    }
                )
                i++;
            }
        }.bind(this));
        return data;
    },
    render: function() {
        if (!this.props.asset) {
            return (
                <h1>Error!</h1>
            )
        }
        var data = this.buildData();
        return (
            <div>
                <RadialBarChart width={400} height={200} cx={200} cy={150} innerRadius={50} outerRadius={140} barSize={10} data={data}>
                    <RadialBar  label background clockwise={true} dataKey='uv' />
                    <Tooltip />
                </RadialBarChart>
                <Avatar size={60} style={{marginTop: "-150px"}} src={this.props.asset.image_url} />
                <h3 style={{textTransform: "uppercase", letterSpacing: "1.5px", marginTop: "-50px"}}>{this.props.asset.name}</h3>
            </div>
        )
    }
});

module.exports = RadialChart;

