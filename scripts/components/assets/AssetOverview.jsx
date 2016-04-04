var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var CircularProgress = require('material-ui').CircularProgress;
var DashboardSpinner = require('../common/DashboardSpinner.jsx');
require('../../vendor/flip.js');


var AssetOverview = React.createClass({
  mixins: [FluxMixin ],
  componentDidMount: function() {
    $(this.refs.flipper).flip();
  },
  renderContent: function() {
    if (this.props.asset == null) {
      return (
        <div style={{marginTop: 50, display: 'flex', justifyContent: 'center'}}>
          <CircularProgress size={2} />
        </div>
      );
    }
    return (
      <div id="card">
        <div className="large-logo front">
          <img src={this.props.asset.image} />
          <ul className="card-metrics">
            <li>
              <div className="metric">{this.props.asset.scope}</div>
              <div className="metric-label">Scope</div>
            </li>
            <li>
              <div className="metric">{this.props.asset.category}</div>
              <div className="metric-label">Category</div>
            </li>
            <li>
              <div className="metric">{this.props.asset.subcategory}</div>
              <div className="metric-label">Subcategory</div>
            </li>
          </ul>
        </div>
        <div className="back small-padding">
          <h4>Asset Bio</h4>
          <p>
          {this.props.asset.description}
          </p>
        </div>
      </div>
    );
  },
  render: function() {
    if (this.props.asset == null) {
      return <DashboardSpinner title={"Asset Overview"} />
    }
    var title = (this.props.asset) ? this.props.asset.name : "";
    return (
      <div id="asset_overview" className="dashboard-module">
        <div className="top">
          <div className="drag-handle"></div>
          <div className="top-title">{title}</div>
        </div>
        <div className="main" ref="flipper">
          {this.renderContent()}
        </div>
      </div>
    );
  }
});
module.exports = AssetOverview;
