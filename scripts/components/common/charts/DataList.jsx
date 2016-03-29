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
	componentDidUpdate: function() {
	},
  componentWillMount: function() {
    this.setState({ viewData: this.props.state });
    this.setState({ dataLoaded: true});
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
		//  if (this.props.component.state.date == null) return;
  	//  var valueList = this.props.component.state.data;

    var i = 0;
    return (
        <ul className="generic-list">
          {this.props.component.state.data.map(function(d){
						var defaultImage = d.metric_icon;
						var defaultText = d.metric;
						var link = "/apt/asset/dashboard/" + d.entity_id;
						if (this.props.component.data !== null && this.props.component.data.view === 'entity') {
							defaultImage = d.entity_icon;
							defaultText = d.entity;
						}
            return (
              <GenericValueListItem key={i++} link={link} statImage={defaultImage} statHeader={defaultText} statMetric={d.value} />
            );
          }.bind(this))}
        </ul>
    );
  },
  renderList: function() {
		if (this.props.type === "dataList") return this.renderValues();
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
