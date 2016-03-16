var React = require('react'),
		GenericBarListItem = require('./GenericBarListItem.jsx'),
		GenericValueListItem = require('./GenericValueListItem.jsx'),
		uuid = require('node-uuid');

var DataList = React.createClass({
  getInitialState: function() {
    return {scrollId: uuid.v4(), scrollLoaded: false, viewData: {}};
  },
  componentDidMount: function() {
    if (!this.state.scrollLoaded) {
      this.setState({scrollLoaded: true});
    }
  },
  componentWillMount: function() {
    this.setState({ viewData: this.props.state });
    this.setState({ dataLoaded: true});
  },
  componentDidRecieveProps: function() {
  },
  componentWillReceiveProps: function(newProps) {
    /*
    if (newProps.componentId != this.props.componentId) {
    }
    if (!this.state.scrollLoaded) {
      console.log("loading scroll...");
      this.setState({scrollLoaded: true});
      $('#' + this.state.scrollId).jScrollPane();
    }
    */
  },
  renderBars: function() {
    // TODO - fix the generic bars
    var listData = this.state.listData;
    var list = $.map(listData, function(item, i) {
      var dataType = item['data_type_display_name'];
      var barData = item['importance'];
      var value = item['value'];
      return <GenericBarListItem key={i} rightText={value} title={dataType} probability={barData} />
    }.bind(this));

    var overrideMargin = {
      marginLeft: "-20px",
    };
    return (
      <div className="risk-indicator-list-container">
        <ul style={overrideMargin} className="probability-list risk-indicator-list">
          {list}
        </ul>
      </div>
    );

  },
  commaSeparateNumber: function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
  },
  renderValues: function() {
    var valueList = this.props.component.state.data;


      /*

    listData.sort(function(i1, i2){
      var order;
      var field1 = i1['metric']
      var field2 = i2['metric']
      order = field1 < field2 ? 1 : -1
      return order;
    }.bind(this));
    */
/*
    var list = $.map(listData, function(item, i) {
      var assetLink = "/apt/asset/dashboard/" + item.asset_id;
      return <GenericValueListItem key={i} trend={item.trend} link={assetLink} statImage={item.image} statHeader={item.name} statMetric={item.metric} />
    }.bind(this));
*/
    // was social-stats-list in a div
    // <ul className="trend-list light global-issues-list probability-list risk-indicator-list">
    // deleted probabilyt list..
    var i = 0;
    var link = "/apt/asset/dashboard/1114";
    return (
        <ul className="generic-list">
          {this.props.component.state.data.map(function(d){
            return (
              <GenericValueListItem key={i++} link={link} statImage={d.entity_icon} statHeader={d.metric} statMetric={d.value} />
            );
          })}
        </ul>
    );
  },
  renderList: function() {
      if(this.props.type === "bar") return this.renderBars();
      else return this.renderValues();
  },
  render: function() {
    return (
      <div id={this.state.scrollId} className="global-issues-list-container" onScroll={this.toggleScrollActive} ref="jScrollContainer" >
        {this.renderList()}
      </div>
    );
  }
});
module.exports = DataList;
