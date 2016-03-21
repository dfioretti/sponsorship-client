var React = require('react');
var GenericBarListItem = require('../common/charts/GenericBarListItem.jsx');


/*
 *  ConsumerSurvey is meant to contain data from
 *  Simmons/MRI/Scarborough type feeds the
 *  bar color could be the "index" for
 *  fan avidity
 *
 */


var ConsumerSurvey = React.createClass({
  getInitialState: function() {
    return {consumerSurvey: {}};
  },
  componentDidMount: function() {
    this.loadData();
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.asset.id != this.props.asset.id) {
      this.loadData();
    }
  },
  loadData: function() {
    // this is going to trigger the render of componenets
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: "http://localhost:4000/api/v1/apt/asset/mock_data",
      data: {"type":"survey", "id":this.props.asset.id},
      success: function(data, status, xhr) {
        this.setState({consumerSurvey: data.survey}, function() {
          // i don't really use this state - i'm lazy
          // need to fix the animation for when changing assets?
          this.setState({wait: false});
        }.bind(this));
      }.bind(this),
      error: function(xhr, status, error) {
        console.log("ERROR");
        console.log(status);
        console.log(error);
      }
    });
  },
  renderList: function() {
    var overrideMargin = {
        marginLeft: "-20px"
    };
    var cssOverride = {
      paddingTop: "20px",
      paddingBottom: "15px"
    };
    var consumerSurvey = this.state.consumerSurvey
    var list = $.map(consumerSurvey, function(item, i) {
      var dataType = item['data_type_display_name'];
      var probability = item['importance'];
      var value = item['value']
      return <GenericBarListItem key={i} id={this.props.asset.id} link={true} rightText={value} title={dataType} probability={probability} companyId={70} />
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
    var survey = this.state.consumerSurvey;
    var hiddenStyle = this.props.hidden ? {display: 'none'} : {};
    var asset = this.props.asset;

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
