var React = require('react');
var Navigation = require('react-router').Navigation;
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var DashboardSpinner = require('../../common/DashboardSpinner.jsx');
var DataFormatter = require('../../../utils/DataFormatter.js');


var AssetScore = React.createClass({
  mixins: [Navigation, FluxMixin],
  componentDidMount: function() {
    var pos = (292 * 0.8 / 1) - 8;
    $('.slider-button').animate({left: pos}, 1000);
  },
  componentWillReceiveProps: function(newProps) {
    var pos = (292 * 0.8 / 1) - 8;
    $('.slider-button').animate({left: pos}, 1000);
  },
  showTooltip: function(e) {
    $('#risk-assessment-tooltip').show();
  },
  hideTooltip: function(e) {
    $('#risk-assessment-tooltip').hide();
  },
  handleScoreClick: function() {
    var score = this.getFlux().store("ScoresStore").getScore(25);
    this.getFlux().actions.loadSavedScore(score);
    this.transitionTo('/apt/editor_score/25');
  },
  render: function() {
    if (this.props.asset == null || this.props.score == null) {
      return <DashboardSpinner title={"Passion Score"} />
    }
    var hiddenStyle = this.props.hidden ? {display: 'none'} : {};
    var left = 0.8 * 300 - 30;
    var tooltipStyle = {left: left, top: -66, backgroundColor: "#97c93c"};
    var arrowStyle = {borderTop: "20px solid " + "#97c93c"};
    var score = Math.floor(Math.random() * 45) + 55;
    var rank = Math.floor(Math.random() * 23) + 30;
    return (
      <div id="risk_assessment" className="dashboard-module" style={hiddenStyle}>
        <div className="top">
          <div onClick={this.handleScoreClick} className="expand-handle" />
          <div className="drag-handle"></div>
          <div className="top-title">Passion Score</div>
        </div>
        <div className="main">
          <div className="risk">{Math.round(DataFormatter(this.props.score.value) * 10 ) / 10}</div>
          <div className="subheader">Portfolio Passion Score</div>
          <div className="slider-bar" onMouseOver={this.showTooltip} onMouseLeave={this.hideTooltip}>
            <div className="slider-button"></div>
            <div id="risk-assessment-tooltip" className="custom-tooltip" style={tooltipStyle}>
              <span className="risk-label">{Math.round(DataFormatter(this.props.score.value))}/100</span>
              <div className="custom-tooltip-arrow" style={arrowStyle}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = AssetScore;
