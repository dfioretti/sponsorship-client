var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		StoreWatchMixin = Fluxxor.StoreWatchMixin


var DataListForSelected = React.createClass({
  mixins: [FluxMixin],
  getStateFromFlux: function() {
    return this.getFlux().store("ComponentEditorStore").getState();
  },
  formatData: function(point) {
    return point.split("_").join(" ");
    //var newString = point.split("_").join(" ");
    //return newString.charAt(0).toUpperCase() + newString.slice(1);
  },
  getDataPointList: function() {
    var list = [];
    var imgStyle = {
      height: "50px",
      width: "50px",
      borderRadius: "50%",
      marginLeft: "0px"
    };
    this.getStateFromFlux().filteredDataPointList.map(function(item) {
      var image = item.icon;
      var name = this.formatData(item.point);
      list.push(
        <div key={item.id} className="container filter-content">
          <div id={item.id} className="row filter-row">
            <div id={item.id} style={{paddingTop: "10px"}} className="col-md-3 filter-row">
              <img style={imgStyle} src={image} />
            </div>
            <div id={item.id} style={{height: "50px", paddingTop: "20px"}} className="col-md-5 filter-row data-item">
              {name}
            </div>
          </div>
        </div>);
    }.bind(this));

    return list;
  },

  handleDataSelect: function(e) {
    this.getFlux().actions.dataSelected(e.target.id);
  },
  handleDataFilterChange: function(e) {
    this.getFlux().actions.filterData(e.target.value);
  },
  render: function() {
    if (this.getStateFromFlux().selectedAsset === null) {
      return null;
    } else {
      var dataPointList = this.getDataPointList();
      return (
        <div>
          <label>Select Data</label><br />
          <input type="text" placeholder="Filter avilable data" className="form-control" value={this.getStateFromFlux().dataFilterText} onChange={this.handleDataFilterChange} />
          <ul className="filter-list" onClick={this.handleDataSelect} >
            {dataPointList}
          </ul>
        </div>
      );
    }
  }
});

module.exports = DataListForSelected;
