var React = require('react');
var Highcharts = require('highcharts/highmaps');
var ChartTooltipHandler = require('../../mixins/ChartTooltipHandler.jsx');
var mapData = require('../../../vendor/us-all.js');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var DataFormatter = require('../../../utils/DataFormatter.js');

var PortfolioMap = React.createClass({
  mixins: [
    ChartTooltipHandler,
    FluxMixin
  ],
  getInitialState: function () {
    return {};
  },
  componentDidMount: function() {
    this.renderChart();
  },
  buildChart: function (props) {
    this.renderChart();
  },
  renderChart: function () {
    var assets = this.getFlux().store("AssetsStore").getOwnedAssets();

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=us-capitals.json&callback=?', function (json) {
      var data = [];
      //$.each(json, function () {
          //this.z = this.population;
        //  data.push(this);
    //var data = [];
    for (var i = 0; i < assets.length; i++) {
      var a = assets[i];
      data.push(
        {
          "abbrev": a.subcategory,
          "parentState": "",
          "capital": a.name,
          "lat": a.latitude,
          "lon": a.longitude,
          "population": DataFormatter((a.facebook_fans + a.twitter_followers ))
        }
      );
    }

    var H = Highcharts,
          map = mapData,//H.maps['countries/us/us-all'],
          chart;

//            $('#container').ddhighcharts('Map', {

    chart = new H.Map({
            chart: {
                style: {
                  fontFamily: 'Avenir-Book'
                },
                renderTo: 'map',
                spacing: [2, 0, 0, 0],
                backgroundColor: "#2d64a5",
                mapZoom: (2, 100, 100)
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                map: {
                  color: "#3c88d1",
                }
            },
            title: {
                text: null
            },
            mapNavigation: {
                enableButtons: true
                //enableDoubleClickZoom: true
            },
            tooltip: {
                pointFormat: '{point.capital}, {point.parentState}<br>' +
                    'Lat: {point.lat}<br>' +
                    'Lon: {point.lon}<br>' +
                    'Social Reach: {point.population}'
            },

            xAxis: {
                crosshair: {
                    zIndex: 5,
                    dashStyle: 'dot',
                    snap: false,
                    color: 'gray'
                }
            },

            yAxis: {
                crosshair: {
                    zIndex: 5,
                    dashStyle: 'dot',
                    snap: false,
                    color: 'gray'
                }
            },

            series: [{
                name: 'Basemap',
                mapData: map,
                color: "#3c88d1",
                borderColor: '#606060',
                nullColor: "#3c88d1",
                //nullColor: 'rgba(200, 200, 200, 0.2)',
                showInLegend: false
            }, {
                name: 'Separators',
                type: 'mapline',
                data: H.geojson(map, 'mapline'),
                color: '#4a4a4a',
                enableMouseTracking: false,
                showInLegend: false
            }, {
                type: 'mapbubble',
                dataLabels: {
                    enabled: true,
                    format: '{point.capital}'
                },
                name: 'Owned',
                data: data,
                maxSize: '12%',
                color: "#50e3c2"//H.getOptions().colors[0]
            }]
        });

        //chart = $('#container').highcharts();
    });

  },
  render: function() {
    var hiddenStyle = this.props.hidden ? {display: 'none'} : {};
    return (
      <div id="global_hotspots" className="dashboard-module" style={hiddenStyle}>
        <div className="top">
          <a className="expand-handle"></a>
          <div className="drag-handle"></div>
          <div className="top-title">Portfolio Map</div>
        </div>
        <div style={{paddingLeft: "0px", paddingRight: "0px", paddingBottom: "0px"}}className="main">
          <div className="legend">
            <div className="legend-item"><div className="legend-point legend-color-6"></div>Portfolio Reach</div>
          </div>
          <div style={{height: "230px", width: "400px", marginTop: "0px"}} id="map">
            {this.renderChart()}
          </div>
        </div>
      </div>
    );
  }
});
module.exports = PortfolioMap
