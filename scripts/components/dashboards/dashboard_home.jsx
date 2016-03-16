var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		Immutable = require('immutable'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AppSidebar = require('../sidebar/app_sidebar.jsx');
var DynamicComponent = require('../common/DynamicComponent.jsx');
require('../../vendor/shapeshift.js');
//require('jquery-ui');

var DashboardHome = React.createClass({
  mixins: [
    FluxMixin,
		StoreWatchMixin("ComponentsStore"),
    StoreWatchMixin("DashboardHomeStore"),
  ],
	getInitialState: function() {
		return Immutable.Map();
	},
  setupGrid: function() {
    $('.modules-container').shapeshift({
      selector: ".dashboard-module",
      handle: ".drag-handle",
      align: "left",
      minColumns: 2,
      autoHeight: false,
      gutterX: 20,
      gutterY: 20,
      paddingX: 20,
      paddingY: 20
    });

/*
    $('.modules-container').on('ss-drop-complete', function(e, selected) {
      //this.updateDashboardState(this.getDashboardState());
    }.bind(this));
*/
  },
  getDashboardFromFlux: function() {
    return this.getFlux().store("DashboardHomeStore").getDashboard(this.props.params.id);
  },
	getStateFromFlux: function() {
		return {
			//stateFromDashboardHomeStore: this.getFlux().store("DashboardHomeStore").getState(),
			//stateFromComponentsStore: this.getFlux().store("ComponentsStore").getState()
		};
	},
  getComponentFromFlux: function(cid) {
    return this.getFlux().store("ComponentsStore").getComponent(cid);
  },
  componentWillMount: function() {
  },
	isDashboardLoaded: function() {
		return this.getFlux().store("DashboardHomeStore").getState().dashboardLoaded;
	},
  componentWillReceiveProps: function(newProps) {
		if (this.isDashboardLoaded())
    	this.setupGrid();
  },
  componentWillUpdate: function() {
		if (this.isDashboardLoaded())
    	this.setupGrid();
  },
  componentDidUpdate: function() {
		if (this.isDashboardLoaded())
    	this.setupGrid();
  },
	areComponentsLoaded: function() {
		return this.getFlux().store("ComponentsStore").getState().componentsLoaded;
	},
  mapModule: function(name, state) {
    if (name.indexOf('custom_component') > -1) {
      var component = this.getComponentFromFlux(parseInt(name.split("_").pop(-1)));
      el = <DynamicComponent key={component.id} component={component} />
    }
    return el;
  },
  renderModules: function(dashboardState) {
    var modules = $.map(dashboardState, function(v, k){
      return this.mapModule(k, v.toggle);
    }.bind(this));

    return (
      <div className="modules-container">
        {modules}
      </div>
    );
  },
  render: function() {
		if (!this.isDashboardLoaded() || !this.areComponentsLoaded()) {
			return (
				<div className="dashboard">
					<AppSidebar view="dashboard" />
				</div>
			);
		} else {
      return (
        <div className="dashboard">
          <AppSidebar view="dashboard" />
          <div className="modules-box">
            {this.renderModules(this.getDashboardFromFlux().state)}
          </div>
        </div>
      );
		}
  }
});
module.exports = DashboardHome;
