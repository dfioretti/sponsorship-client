var React = require('react');
var Tooltip = require('recharts').Tooltip;
var RadialBar = require('recharts').RadialBar;
var RadialBarChart = require('recharts').RadialBarChart;
var Legend = require('recharts').Legend;
var _ = require('underscore');
var titleize = require('underscore.string/titleize');

var RadialChart = React.createClass({
    buildData: function(asset) {
        /*
        console.log("WTF", asset);
        var data = [];
        _.each(asset.metrics, function(m) {
            if (m.source == 'score') {
                data.push({
                    name: titleize(m.metric.split("_").join(" ")),
                    uv: (m.value * 100),
                    pv: 100,
                    fill: "#8884d8"
                })
            }
        });
        console.log("the data", data);
        return data;
        */
        var data = [
          {name: '18-24', uv: 31.47, pv: 2400, fill: '#8884d8'},
          {name: '25-29', uv: 26.69, pv: 4567, fill: '#83a6ed'},
          {name: '30-34', uv: 15.69, pv: 1398, fill: '#8dd1e1'},
          {name: '35-39', uv: 8.22, pv: 9800, fill: '#82ca9d'},
          {name: '40-49', uv: 8.63, pv: 3908, fill: '#a4de6c'},
          {name: '50+', uv: 2.63, pv: 4800, fill: '#d0ed57'},
          {name: 'unknow', uv: 6.67, pv: 4800, fill: '#ffc658'}
        ];
        return data;
    },
    render: function() {
        if (!this.props.asset) {
            return (
                <h1>wtf</h1>
            )
        }
        var data = this.buildData(this.props.asset);
        return (
            <RadialBarChart width={500} height={300} cx={150} cy={150} innerRadius={20} outerRadius={140} barSize={10} data={data}>
                <RadialBar minAngle={15} label background clockwise={true} dataKey='uv' />
                <Tooltip />
            </RadialBarChart>
        )
    }
});

module.exports = RadialChart;

/*
 *                     <Paper style={paperStyle} zDepth={3}>
                        <RadialBarChart width={500} height={300} cx={150} cy={150} innerRadius={20} outerRadius={140} barSize={10} data={data}>
                            <RadialBar minAngle={15} label background clockwise={true} dataKey='uv' />
                            <Tooltip />
                        </RadialBarChart>
                    </Paper>
                                height: "175px",
            width: "100%",
            textAlign: 'center',
            display: 'flex',
            backgroundColor: 'green',
            marginTop: 25,
            justifyContent: 'center'


*/
