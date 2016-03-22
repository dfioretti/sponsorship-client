var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		ChartTooltipHandler = require('../mixins/ChartTooltipHandler.jsx'),
		SeriesChart = require('./charts/SeriesChart.jsx'),
		RoundChart = require('./charts/RoundChart.jsx'),
		DataList = require('./charts/DataList.jsx'),
		Navigation = require('react-router').Navigation,
		Cog = require('react-icons/lib/fa/cog'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var DynamicComponent = React.createClass({
  mixins: [
    FluxMixin,
    ChartTooltipHandler,
		Navigation,
    StoreWatchMixin("EditorPreviewStore")
  ],

  getStateFromFlux: function() {
    return this.getFlux().store("EditorPreviewStore").getState();
  },
  renderContent: function() {
    switch(this.props.component.view) {
      case 'barChart':
      case 'lineChart':
        return <SeriesChart {...this.props}  />
        break;
      case 'doughnutChart':
      case 'pieChart':
        return <RoundChart {...this.props} />
        break;
      case 'dataList':
      case 'valueList':
      case 'barList':
        return <DataList {...this.props} />
        break;
    }
  },
	handleComponentEdit: function(e) {
		this.getFlux().actions.configureComponentEditor(this.props.component);
		this.transitionTo('/apt/editor_component/' + this.props.component.id);
	},
  render: function() {
		if (this.props.component === null) {
			return (
				<div className="dashboard-module">
				</div>
			);
		}
    var editLink = "/apt/editor_component/" + this.props.component.id;
    //          <Link to={editLink} className="expand-handle"></Link>

    var componentStyle = "top_global_issues";
    if (this.props.component.view === 'lineChart' ||
          this.props.component.view === 'barChart') {
      componentStyle="chart-view";
    }
		//						<Cog id={this.props.component.id} className="cog-handle" />

    return (
      <div id={componentStyle} className="dashboard-module">
        <div className="top">
						<Cog id={this.props.component.id} className="cog-handle" onClick={this.handleComponentEdit} />
          <div className="drag-handle"></div>
          <div className="top-title">{this.props.component.name}</div>
        </div>
        <div className="main">
          {this.renderContent()}
        </div>
      </div>
    );
  }
});
module.exports = DynamicComponent;
