var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AssetSearch = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("AssetsStore")],

  componentWillMount: function() {
    this.getFlux().actions.loadAssets();
  },
  getState: function() {
    return {};
  },
  getStateFromFlux: function() {
    return this.getFlux().store("ComponentEditorStore").getState();
  },
  handleFilterChange: function(e) {
    this.getFlux().actions.filterList(e.target.value);
  },
  getList: function() {
    var list = [];
    var imgStyle = {
      height: "50px",
      width: "50px",
      borderRadius: "50%",
      marginLeft: "0px"
    };
    this.getStateFromFlux().filteredList.map(function(item) {
      var image = "/images/" + item.id + ".jpg";
      list.push(
        <div key={item.id} className="container filter-content">
          <div id={item.id} className="row filter-row">
            <div id={item.id} style={{paddingTop: "10px"}} className="col-md-3 filter-row">
              <img style={imgStyle} src={image} />
            </div>
            <div id={item.id} style={{height: "50px", paddingTop: "20px"}} className="col-md-5 filter-row">
              {item.name}
            </div>
          </div>
        </div>);
    }.bind(this));
    return list;
  },
  render: function() {
    var list = this.getList();
    return (
      <div className="asset-search">
        <div className="form-group">
          <input placeholder="Filter asset list" type="text" className="form-control" value={this.getStateFromFlux().filterText} onChange={this.handleFilterChange} />
        </div>
        <ul onClick={this.handleAssetSelect} className="filter-list">
          {list}
        </ul>
      </div>
    );
  },
  handleAssetSelect: function(e) {
    this.getFlux().actions.selectedAsset(e.target.id);
  }
});
module.exports = AssetSearch;
