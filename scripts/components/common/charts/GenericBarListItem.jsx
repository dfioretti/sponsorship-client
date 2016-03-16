var React = require('react'),
		Link = require('react-router').Link,
		ReactDOM = require('react-dom');

var GenericBarListItem = React.createClass({
  getInitialState: function() {
    return {loaded: false};
  },
  componentDidMount: function() {
    this.animate(this.props);;
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.probability != this.props.probability) {
      this.animate(newProps);
    }
  },
  animate: function(newProps) {
    var bar = ReactDOM.findDOMNode(this.refs.bar);
    $(bar).animate({width: newProps.probability * 100}, 1000, function() {
      this.setState({loaded: true});
    }.bind(this));
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.probability != this.props.probability;
  },
  showTooltip: function(e) {
    var tooltip = $('.li-tooltip');
    var top = $(e.target).offset().top - 50,
    left = $(e.target).offset().left - 45;

    if (tooltip.length < 1) {
      $('.dashboard').append(
        '<div class="li-tooltip" style="top:'+top+'px;left:'+left+'px;">' +
          'Click to see chart<div class="li-tooltip-arrow"></div>' +
        '</div>'
      );
    }
    tooltip.css({top: top, left: left});
    tooltip.show();
  },
  hideTooltip: function(e) {
    $('.li-tooltip').hide();
  },
  renderTooltip: function() {
    var tooltip;
    if (this.props.tooltip) {
      var link = '/ews/dashboard/' + this.props.companyId + '/detail';
      tooltip = (
        <Link to={link} className="li-tooltip-button" onMouseOver={this.showTooltip} onMouseLeave={this.hideTooltip}>
        </Link>
      );
    }
    return tooltip;
  },
  commaSeparateNumber: function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
  },
  renderRightText: function() {
    var text;
    if (this.props.rightText) {
      var formatText = this.commaSeparateNumber(this.props.rightText);
      text = (
        <div className="li-right-text">{formatText}</div>
      );
    }
    return text;
  },
  renderProbability: function() {
    var probabilityBar;
    if (this.props.probability) {
      var probabilityStyle = {backgroundColor: riskColor(this.props.probability)};
      if (this.state.loaded) {
        //probabilityStyle.width = this.props.probability * 100;
      }
      probabilityBar = (
        <div className="li-probability-bkg">
          <div className="li-probability-bar" ref="bar" style={probabilityStyle}></div>
        </div>
      );
    }
    return probabilityBar;
  },
  render: function() {
    //TODO: update this with better my links
    var link = '/ews/dashboard/' + this.props.companyId + '/detail',
    main;
    var liStyle = this.props.styleOverride ? this.props.styleOverride : {};

    if (this.props.link) {
      main = (
        <Link to={link}>
          {this.renderProbability()}
          {this.renderRightText()}
          <div style={liStyle} className="li-title">{this.props.title}</div>
        </Link>
      )
    } else {
      main = (
        <div>
          {this.renderProbability()}
          {this.renderRightText()}
          <div style={liStyle} className="li-title">{this.props.title}</div>
        </div>
      );
    }
    return (
      <li style={liStyle} className="probability-list-item">
        {main}
      </li>
    );
  }
});
module.exports = GenericBarListItem;
