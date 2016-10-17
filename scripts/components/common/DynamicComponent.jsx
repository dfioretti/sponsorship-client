var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		ChartTooltipHandler = require('../mixins/ChartTooltipHandler.jsx'),
		OverlayTrigger = require('react-bootstrap').OverlayTrigger,
		Popover = require('react-bootstrap').Popover,
		SeriesChart = require('./charts/SeriesChart.jsx'),
		RoundChart = require('./charts/RoundChart.jsx'),
		DataList = require('./charts/DataList.jsx'),
		Navigation = require('react-router').Navigation,
		Cog = require('react-icons/lib/fa/cog'),
		ReactBsTable = require('react-bootstrap-table'),
		BootstrapTable = ReactBsTable.BootstrapTable,
		TableHeaderColumn = ReactBsTable.TableHeaderColumn,
		AddToDashboardList = require('../common/AddToDashboardList.jsx'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin,
		ScoreView = require('./charts/ScoreView.jsx'),
		AssetScore = require('../dashboards/modules/AssetScore.jsx');

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
			case 'scoreView':
				return <ScoreView {...this.props} />
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
		var selectRowProp = {
			mode: "checkbox",
			clickToSelect: true,
			bgColor: "#50e3c2",
			onSelect: this.onRowSelect,
			onSelectAll: this.onSelectAll
		}
		var linkStyle = {
			textTransform: "uppercase",
			letterSpacing: "1.5px",
			width: "100%",
			fontSize: "11px",
			color: "#03387a",
			textAlign: "center",
			paddingTop: "9px",
			borderTop: "1px solid #3c88d1"
		}
		/*
		<BootstrapTable
			data={this.getFlux().store("DashboardHomeStore").getCustomDashboards()}
			height="100"
			selectRow={selectRowProp}
			condensed={true}
			>
			<TableHeaderColumn hidden={true} dataField="id" isKey={true}></TableHeaderColumn>
			<TableHeaderColumn dataField="name">Dashboard</TableHeaderColumn>
		</BootstrapTable>
		<br />
		*/
		if (this.props.component.view === 'scoreView')
			return <ScoreView {...this.props} />

		return (
      <div id={componentStyle} className="dashboard-module">
        <div className="top">
					<OverlayTrigger
						trigger="click"
						rootClose
						placement="bottom"
						overlay={
							<Popover id={Math.random().toString()}
								arrowOffsetLeft={500}
								>
								<div style={{width: "200px"}} className="component-configure">
									<button style={{fontSize: "12px", margin: "5px -5px 5px 5px", width: "calc(100% - 10px)", letterSpacing: "1.5px"}}
										onClick={this.handleComponentEdit}
										className="btn btn-primary form-control">
										EDIT COMPONENT
									</button>
									<h5 style={linkStyle}>Add to Dashboard</h5>
									<AddToDashboardList component={this.props.component} dashboards={this.getFlux().store("DashboardHomeStore").getState().dashboards } />
								</div>
							</Popover>
							}>
						<Cog id={this.props.component.id} className="cog-handle" />
					</OverlayTrigger>
          <div className="drag-handle"></div>
          <div className="top-title">{this.props.component.name}</div>
        </div>
        <div className="main">
          {this.renderContent()}
        </div>
      </div>
    );
  },
	onRowSelect: function(row, isSelected) {
		console.log("selected");
	},
	onSelectAll: function(isSelected) {
		console.log(isSelected);
	}
});
module.exports = DynamicComponent;
