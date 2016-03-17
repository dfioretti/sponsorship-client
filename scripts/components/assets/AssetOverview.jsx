var React = require('react');

var AssetOverview = React.createClass({
  componentDidMount: function() {
//    $(this.refs.flipper).flip();
  },
  componentWillReceiveProps: function(newProps) {
  },
  render: function() {
    var hiddenStyle = this.props.hidden ? {display: 'none'} : {};
    var asset = this.props.asset;
    var imageUrl = "/images/" + asset.id + ".jpg";
    var description = (asset.description == null) ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." : asset.description;
    var subcat = "N/A";
    if (asset.subcategory.length > 0)
      subcat = asset.subcategory;
    return (
      <div id="asset_overview" className="dashboard-module" style={hiddenStyle}>
        <div className="top">
          <div className="drag-handle"></div>
          <div className="top-title">{asset.name}</div>
        </div>
        <div className="main" ref="flipper">
          <div id="card">
            <div className="large-logo front">
              <img src={imageUrl} />
              <ul className="card-metrics">
                <li>
                  <div className="metric">{asset.scope}</div>
                  <div className="metric-label">Scope</div>
                </li>
                <li>
                  <div className="metric">{asset.category}</div>
                  <div className="metric-label">Category</div>
                </li>
                <li>
                  <div className="metric">{subcat}</div>
                  <div className="metric-label">Subcategory</div>
                </li>
              </ul>
            </div>
            <div className="back small-padding">
              <h4>Asset Bio</h4>
              <p>
              {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = AssetOverview;
