var React = require('react');
var RadarChart = require('react-chartjs').Radar;

var Radar = React.createClass({

    render: function() {
        var chartData = {};
        var chartOptions = {};
        return <RadarChart data={chartData} options={chartOptions} />
    }
});

module.exports = Radar;
