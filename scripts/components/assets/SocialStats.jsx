var React = require('react');
var ReactDOM = require('react-dom');


var SocialStats = React.createClass({
  getInitialState: function() {
    return {socialStats: {}};
  },
  componentDidMount: function() {
      this.animate();
  },
  componentDidUpdate: function() {
    this.animate();
  },
  animate: function() {
    var stats = ReactDOM.findDOMNode(this.refs.stats);
    $('.stat-metric', stats).effect("highlight", {"color": "#50e3c2"}, 1500, function() {
      this.setState({loaded: true});
    }.bind(this));
  },
  commaSeparateNumber: function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.asset.id != this.props.asset.id;
  },
  loadData: function() {
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: "http://localhost:4000/api/v1/apt/asset/mock_data",
      data: {"type":"social", "id": this.props.asset.id},
      success: function(data, status, xhr) {
        this.setState({socialStats: data.stats});
        this.renderChart(data.stats);
      }.bind(this),
      error: function(xhr, status, error) {
        console.log("ERROR");
        console.log(status);
        console.log(error);
      }
    });
  },
  renderChart: function(stats) {
    var barData = {
      labels : ["January","February","March","April","May","June"],
      datasets : [
        {
          label: "My First dataset",
          fillColor: "rgba(80,227,194,1)",
          strokeColor: "rgba(80,227,194,1)",
          data : [456,479,324,569,702,600]
        },
        {
          label: "My Second dataset",
          fillColor: "rgba(245,166,35,1)",
          strokeColor: "rgba(245,166,35,1)",
          data : [364,504,605,400,345,320]
        }

      ]
    }
    var socialChart = document.getElementById("social-chart").getContext("2d");
    new Chart(socialChart).Bar(barData, {
      animation: true,
      tooltipFontSize: 11,
      tooltipFillColor: 'rgba(255,255,255,0.6)',
      tooltipFontStyle: 'Avenir-Book',
      tooltipFontColor: '#333',
      tooltipTitleFontFamily: 'Avenir-Book',
      tooltipTitleFontColor: '#738694',
      tooltipTitleFontSize: 11,
      tooltipTitleFontStyle: 'normal',
      scaleFontColor: "#fff",
      scaleLineColor: "rgba(255,255,255,0.3)",
      scaleGridLineColor: "rga(255,255,255,0.3)",
      scaleFontSize: 11,
      scaleShowVerticalLines: false,
      scaleLabel: "<%= ' ' + value%>"
    });
  },
  render: function() {
    var stats = this.state.socialStats;
    var hiddenStyle = this.props.hidden ? {display: 'none'} : {};
    var asset = this.props.asset;

    var twitter = asset.twitter_followers ? (this.commaSeparateNumber(asset.twitter_followers)) : "N/A";
    var facebook = asset.facebook_fans ? (this.commaSeparateNumber(asset.facebook_fans)) : "N/A"
    var klout = asset.klout_score ? (asset.klout_score) : "N/A"
    var convo = asset.facebook_conversation ? (this.commaSeparateNumber(asset.facebook_conversation)) : "N/A"


    return (
      <div id="social_stats" className="dashboard-module" ref="flipper" style={hiddenStyle}>
        <div className="top">
          <div className="drag-handle"></div>
          <div className="top-title">Socal Stats</div>
        </div>
        <div className="front">
          <div className="main social-stats-list" ref="stats">
            <ul>
              <li>
                <div className="stat-image">
                  <img src="https://logo.clearbit.com/www.twitter.com"/>
                </div>
                <div className="stat-header">Twitter Followers</div>
                <div className="stat-metric">{twitter}</div>
              </li>
              <li>
                <div className="stat-image">
                  <img src="https://logo.clearbit.com/www.facebook.com" />
                </div>
                <div className="stat-header">Facebook Fans</div>
                <div className="stat-metric">{facebook}</div>
              </li>
              <li>
                <div className="stat-image">
                  <img src="https://logo.clearbit.com/www.klout.com" />
                </div>
                <div className="stat-header">Klout Score</div>
                <div className="stat-metric">{klout}</div>
              </li>
              <li>
                <div className="stat-image">
                  <img src="https://logo.clearbit.com/www.facebook.com" />
                </div>
                <div className="stat-header">Talking About</div>
                <div className="stat-metric">{convo}</div>
              </li>
            </ul>
          </div>
        </div>
        <div className="back chart-wrapper">
          <div className="main chart-wrapper">
            <canvas width="380px" height="240px" id="social-chart"></canvas>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = SocialStats;
