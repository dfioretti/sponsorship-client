var React = require('react'),
		uuid = require('node-uuid'),
		Link = require('react-router').Link;


var GenericValueListItem = React.createClass({
  getInitialState: function() {
    return {loaded: false};
  },
  componentWillMount: function() {
    this.itemId = uuid.v4();
  },
  componentDidMount: function() {
    this.animate(this.props);
  },
  componentWillReceiveProps: function(newProps) {
    if(newProps.value !== this.props.value) {
      if (newProps.reAnimate)
        this.animate(newProps);
    }
  },
  animate: function(newProps) {
    var itemId = "#value-list-item-" + newProps.key;
    $("#" + this.itemId).effect("highlight", {"color": "#50e3c2"}, 1500, function() {
      //this.setState({loaded: true});
    }.bind(this));
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.value != this.props.value;
  },
  showTooltip: function() {

  },
  hideToolip: function() {

  },
  getTrendIconClass: function () {
    if (!this.props.trend) return "";
    var trendCN = "trend-image ";
    if (this.props.trend > 0) {
      trendCN += "up";
    } else if (this.props.trend < 0) {
      trendCN += "down";
    } else {
      trendCN += "no-change";
    }

    return trendCN;
  },
  render: function() {
    var liStyle = this.props.styleOverride ? this.props.styleOverride : {};

    return (
      <li style={liStyle} onMouseOver={this.showTooltip} onMouseLeave={this.hideToolip}>
        <Link to={this.props.link} >
          <div className="stat-image">
            <img src={this.props.statImage} />
          </div>
          <div className="stat-header">{this.props.statHeader.split("_").join(" ")}</div>
          <div id="iconOverride" className={this.getTrendIconClass()}></div>
          <div id={this.itemId} className="stat-metric">{this.props.statMetric}</div>

        </Link>
      </li>
    )
  }

});
module.exports = GenericValueListItem
