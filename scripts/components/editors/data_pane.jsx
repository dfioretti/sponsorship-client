var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		AssetSearch = require('./AssetSearch.jsx'),

		DataListForSelected = require('./DataListForSelected.jsx'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AddDataButton = require('./add_data_button.jsx');

var DataPane = React.createClass({
  mixins: [FluxMixin],

  getStateFromFlux: function() {
    return flux.store("ComponentEditorStore").getState();
  },

  renderSelectedAsset: function() {
    var selected = this.getStateFromFlux().selectedAsset;
    if (selected === null) return null;
    var imgStyle = {
      height: "50px",
      width: "50px",
      borderRadius: "50%",
      marginLeft: "0px"
    };
    var image = "/images" + selected.id + ".jpg";

    return (
      <div key={selected.id} className="container filter-content">
        <div style={{marginBottom: "10px", borderRadius: "3px", color: "white", background: "#3c88d1"}}id={selected.id} className="row filter-row">
          <div id={selected.id} style={{padding: "10px"}} className="col-md-3 filter-row">
            <img style={imgStyle} src={image} />
          </div>
          <div id={selected.id} style={{height: "50px", paddingTop: "20px"}} className="col-md-5 filter-row">
            {selected.name}
          </div>
        </div>
      </div>
    );
  },
  renderSelectedData: function() {
    var selected = this.getStateFromFlux().selectedData;
    if (selected === null) return null;
    var image = selected.icon;
    var name = selected.point.split("_").join(" ");

    var imgStyle = {
      height: "50px",
      width: "50px",
      borderRadius: "50%",
      marginLeft: "0px"
    };

    return (
      <div key={selected.id} className="container filter-content">
        <div style={{marginBottom: "10px", borderRadius: "3px", color: "white", background: "#3c88d1"}}id={selected.id} className="row filter-row">
          <div id={selected.id} style={{padding: "10px"}} className="col-md-3 filter-row">
            <img style={imgStyle} src={image} />
          </div>
          <div id={selected.id} style={{height: "50px", paddingTop: "20px", textTransform: "capitalize"}} className="col-md-5 filter-row">
            {name}
          </div>
        </div>
      </div>
    );
  },
  render: function() {
    return (
      <div className="editor-pane">
        <div className="input-heading">
          Data
        </div>
        <div className="form-content">
          <div className="form-group">
            <label>Select Asset</label>
            <AssetSearch />
          </div>
            {this.renderSelectedAsset()}
          <div className="form-group">
            <DataListForSelected />
          </div>
            {this.renderSelectedData()}
          <div className="form-group">
            <AddDataButton />
          </div>
        </div>
      </div>
    );
  }

});


module.exports = DataPane;
