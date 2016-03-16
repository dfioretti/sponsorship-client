var React = require('react');
var ChartTooltipHandler = require('../../mixins/ChartTooltipHandler.jsx');
require('highcharts');


var PortfolioTreemap = React.createClass({
  mixins: [
    ChartTooltipHandler
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
    var colors = ["#3c88d1", "#e76959", "#f5a623", "#124c93", "#50e3c2", "#03387a", "#738694"];
    // TODO: http://www.highcharts.com/demo/treemap-large-dataset
    // levels

    var content = {
      "Sports" : {
        "Hockey" : {
          'Teams' : 6
        },
        "Baseball" : {
          'Teams' : 12,
          'Athletes' : 4
        },
        "Football" : {
          'Teams' : 3,
          'Athletes' : 4
        },
        "Basketball" : {
          'Teams' : 2,
          'Athletes' : 5
        },
        "Nascar" : {
          'Drivers' : 4,
          'Cars' : 2
        }
      },
      "Entertainment" : {
        "Music" : {
          "Artists" : 4,
          "Events" : 2
        },
        "Film" : {
          "Actors" : 3,
          "Events" : 2
        },
        "Television" : {
          "Actors" : 5,
          "Shows" : 3
        }
      }
    };


        $('#tree-map').highcharts({
                chart: {
                    style: {
                        fontFamily: 'Avenir-Book'
                    },
                    height: 270,
                    spacing: [0, 0, 0, 0],
                    backgroundColor: "#2d64a5",
                    borderColor: "#2d64a5"
                },
                series: [{
                    borderColor: "#2d64a5",
                    type: "treemap",
                    layoutAlgorithm: 'squarified',
                    levels: [{
                        level: 1,
                        layoutAlgorithm: 'squarified'
                    }],
                    allowDrillToNode: true,
                    data: [{
                        id: 'S',
                        name: 'Sport',
                        color: colors[3]
                    }, {
                        id: 'E',
                        name: 'Entertainment',
                        color: colors[4]
                    }, {
                        id: 'O',
                        name: 'Oranges',
                        color: '#EC9800'
                    }, {
                        id: 'H',
                        name: 'Hockey',
                        parent: 'S',
                        value: 7
                    }, {
                        name: 'H-Athletes',
                        parent: 'H',
                        value: 3
                    }, {
                        name: 'H-Teams',
                        parent: 'H',
                        value: 4
                    }, {
                        id: 'B',
                        name: 'Baseball',
                        parent: 'S',
                        value: 8
                    }, {
                        name: 'B-Teams',
                        parent: 'B',
                        value: 2
                    }, {
                        name: 'B-Athletes',
                        parent: 'B',
                        value: 6
                    }, {
                        id: 'M',
                        name: 'Music',
                        parent: 'E',
                        value: 9
                    }, {
                        name: 'Artists',
                        parent: 'M',
                        value: 3
                    }, {
                        name: 'Events',
                        parent: 'M',
                        value: 6
                    }]
            }],
            title: {
                text: null //'Portfolio Allocation',
                    //margin: 2
            }
        });/*
    $('#tree-map').highcharts({
        chart: {
          style: {
              fontFamily:'Avenir-Book'
          },
          height: 270,
          spacing: [0, 0, 0, 0],
          backgroundColor: "#2d64a5",
          borderColor: "#2d64a5",
        },
        series: [{
            borderColor: "#2d64a5",
            type: "treemap",
            layoutAlgorithm: 'squarified',
            levels: [{
              level: 1,
              layoutAlgorithm: 'squarified'
            }]
        ,
        data: [{
         id: 'S',
         name: 'Sport',
         color: colors[0]
      }, {
         id:'E',
         name: 'Entertainment',
         color: colors[1]
      }, {
         id: 'O',
         name: 'Oranges',
         color: '#EC9800'
      }, {
         name: 'Hockey',
         parent: 'S',
         value: 5
      }, {
         name: 'Athletes',
         parent: 'Hockey',
         value: 3
      }, {
         name: 'Teams',
         parent: 'Hockey',
         value: 4
      }, {
         name: 'Baseball',
         parent: 'S',
         value: 8
      }, {
         name: 'Teams',
         parent: 'Baseball',
         value: 2
      }, {
         name: 'Athletes',
         parent: 'Baseball',
         value: 7
      }, {
         name: 'Music',
         parent: 'E',
         value: 9
      }, {
         name: 'Artists',
         parent: 'Music',
         value: 3
      }, {
         name: 'Events',
         parent: 'Music',
         value: 1
      }]
   }];
            /*    data: [{
                name: 'Sports',
                value: 6,
                color: colors[0]
            }, {
                name: 'Ent',
                value: 6,
                color: colors[1]
            }, {
                name: 'MLB',
                value: 4,
                color: colors[2]
            }, {
                name: 'NASCAR',
                value: 3,
                color: colors[3]
            }, {
                name: 'NFL',
                value: 2,
                color: colors[4]
            }, {
                name: 'Music',
                value: 2,
                color: colors[5]
            }, {
                name: 'NHL',
                value: 1,
                color: colors[6]
            }]*//*
        }],
        title: {
            text: null//'Portfolio Allocation',
            //margin: 2
        }
    });*/
  },
  render: function() {
    var hiddenStyle = this.props.hidden ? {display: 'none'} : {};
    return (
      <div id="global_hotspots" className="dashboard-module" style={hiddenStyle}>
        <div className="top">
          <a className="expand-handle"></a>
          <div className="drag-handle"></div>
          <div className="top-title">Portfolio Allocation</div>
        </div>
        <div className="main">
          <div style={{paddingTop: "0px"}}id="tree-map">
            {this.renderChart()}
          </div>
        </div>
      </div>
    );
  }
});
