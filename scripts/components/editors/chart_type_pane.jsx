var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		LineIcon = require('react-icons/lib/fa/line-chart');
		BarIcon = require('react-icons/lib/fa/bar-chart');
		PieIcon = require('react-icons/lib/fa/pie-chart');
		DIcon = require('react-icons/lib/fa/circle-o-notch');
		ListIcon = require('react-icons/lib/fa/list-ul');
		ScoreIcon = require('react-icons/lib/fa/calculator');
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ChartTypePane = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ComponentEditorStore")],

  getStateFromFlux: function() {
    return this.getFlux().store("ComponentEditorStore").getState();
  },
  handleChartTypeChange: function(e) {
    this.getFlux().actions.updateType(e.target.value);
    this.getFlux().actions.generatePreviewData(this.getFlux().store("ComponentEditorStore").getObject());
  },
	renderChartImage: function() {
		var style = {
			height: "300px",
			width: "300px",
			paddingLeft: "80px",
			color: "#03387a"
		}
		switch (this.getStateFromFlux().view) {
			case 'barChart':
				return <BarIcon style={style}/>
				break;
			case 'lineChart':
				return <LineIcon style={style}/>
				break;
			case 'pieChart':
				return <PieIcon style={style}/>
				break;
			case 'doughnutChart':
				return <DIcon style={style}/>
				break;
			case 'dataList':
				return <ListIcon style={style}/>
				break;
			case 'scoreView':
				return <ScoreIcon style={style} />
				break;
			}
	},
  render: function() {
    var chartTypes = [{ id: 'lineChart', name: 'Line Chart' },
                      { id: 'barChart', name: "Bar Chart" },
                      { id: 'pieChart', name: "Pie Chart" },
                      { id: 'doughnutChart', name: "Doughnut Chart" },
                      { id: 'dataList', name: "Data List" },
											{ id: 'scoreView', name: "Score View" },
                    ];
    var typeList = [];
    chartTypes.map(function(item) {
      typeList.push(<option key={item.id} value={item.id}>{item.name}</option>);
    }.bind(this));
    var chartImage = BarIcon;
    if (this.getStateFromFlux().view === 'barChart') {
			chartImage = BarIcon;
    }
    return (
        <div className="form-content">
            <label>Chart Type &nbsp;&nbsp;&nbsp;</label>
            <select onChange={this.handleChartTypeChange} value={this.getStateFromFlux().view}>
              {typeList}
            </select>
          <div className="form-group">
						{this.renderChartImage()}
          </div>
      </div>
    );
  }
});

module.exports = ChartTypePane;
