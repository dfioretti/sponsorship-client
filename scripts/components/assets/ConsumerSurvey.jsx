var React = require('react');
var GenericBarListItem = require('../common/charts/GenericBarListItem.jsx');
var API_ROOT = require("../../constants/environment.js").API_ROOT;
var CircularProgress = require('material-ui').CircularProgress;




var ConsumerSurvey = React.createClass({
  getInitialState: function() {
    return {}
    //return { consumerSurvey: null };
  },
  componentDidMount: function() {
    //if (this.props.asset != null && this.isMounted())
    //  this.loadData();
  },
  componentWillReceiveProps: function(newProps) {
    console.log("p", this.props, newProps);
    //if (newProps.asset.id != this.props.asset.id) {
    //  this.loadData();
    //}
  },

  renderList: function() {
    if (this.props.asset == null) {
      return (
        <div style={{marginTop: 50, display: 'flex', justifyContent: 'center'}}>
          <CircularProgress size={2} />
        </div>
      )
    }
    var overrideMargin = {
        marginLeft: "-20px"
    };
    var cssOverride = {
      paddingTop: "20px",
      paddingBottom: "15px"
    };
    var consumerSurvey = this.props.consumerSurvey
    var list = $.map(consumerSurvey, function(item, i) {
      var dataType = item['data_type_display_name'];
      var probability = item['importance'];
      var value = item['value']
      return <GenericBarListItem
        key={i}
        id={this.props.asset.id}
        link={true}
        rightText={value}
        title={dataType}
        probability={probability}
        companyId={70} />
    }.bind(this));

    return (
      <div className="risk-indicator-list-container">
        <ul style={overrideMargin} className="probability-list risk-indicator-list">
          {list}
        </ul>
      </div>
    );
  },
  render: function() {
    var survey = this.props.consumerSurvey;
    var hiddenStyle = this.props.hidden ? {display: 'none'} : {};
    var asset = this.props.asset;
    console.log("HUH", survey, asset);

    return (
      <div id="consumer_survey" className="dashboard-module tall" style={hiddenStyle}>
        <div className="top">
          <div className="drag-handle"></div>
          <div className="top-title">Consumer Survey</div>
        </div>
        <div style={{paddingTop: "12px"}} className="main">
          {this.renderList()}
        </div>
      </div>
    );
  }
});
module.exports = ConsumerSurvey;
