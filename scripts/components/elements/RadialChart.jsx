var React = require('react');
var Tooltip = require('recharts').Tooltip;
var RadialBar = require('recharts').RadialBar;
var RadialBarChart = require('recharts').RadialBarChart;
var Legend = require('recharts').Legend;
var _ = require('underscore');
var titleize = require('underscore.string/titleize');
var Avatar = require('material-ui').Avatar;

var RadialChart = React.createClass({
    buildData: function(asset) {
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
        _.each(asset.metrics, function(m) {
            if (m.source == 'score' && m.metric != 'team_score') {
                data.push({
                    name: titleize(m.metric.split("_").join(" ")),
                    uv: Math.round((m.value * 100)),
                    fill: colors[i]
                })
                i++;
            }
        });
        return data;
    },
    render: function() {
        if (!this.props.asset) {
            return (
                <h1>Error!</h1>
            )
        }
        var data = this.buildData(this.props.asset);
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

