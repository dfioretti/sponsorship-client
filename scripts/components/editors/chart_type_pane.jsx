var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ChartTypePane = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ComponentEditorStore")],

  getStateFromFlux: function() {
    return this.getFlux().store("ComponentEditorStore").getState();
  },
  handleChartTypeChange: function(e) {
    this.getFlux().actions.updateType(e.target.value);
    this.getFlux().actions.generatePreviewData();
  },
  render: function() {
    var chartTypes = [{id: 'lineChart', name: 'Line Chart'},
                      {id: 'barChart', name: "Bar Chart"},
                      {id: 'pieChart', name: "Pie Chart"},
                      {id: 'doughnutChart', name: "Doughnut Chart"},
                      {id: 'dataList', name: "Data List"},
                    ];
    var typeList = [];
    chartTypes.map(function(item) {
      typeList.push(<option key={item.id} value={item.id}>{item.name}</option>);
    }.bind(this));
    var chartImage = "/edit/line.png";
    if (this.getStateFromFlux().view === 'barChart') {
      chartImage = "/edit/bar.png";
    }
    return (
      <div className="editor-pane">
        <div className="input-heading">
          Chart Type
        </div>
        <div className="form-content">
          <div className="form-group">
            <label>Chart Type &nbsp;&nbsp;&nbsp;</label>
            <select onChange={this.handleChartTypeChange} value={this.getStateFromFlux().view}>
              {typeList}
            </select>
          </div>
          <div className="form-group">
            <img src={chartImage} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ChartTypePane;
