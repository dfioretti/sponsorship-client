var React = require('react');


var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		Immutable = require('immutable'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AppSidebar = require('../sidebar/app_sidebar.jsx');
var DynamicComponent = require('../common/DynamicComponent.jsx');
require('../../vendor/shapeshift.js');

var ComponentsIndex = React.createClass({
  mixins: [
    FluxMixin,
		StoreWatchMixin("ComponentsStore"),
  ],
	componentWillMount: function() {
		this.ensureLoaded();
		this.getFlux().actions.setBreadcrumb("modules")
		this.getFlux().actions.setCurrentNav("components", null);
	},
	getInitialState: function() {
		return Immutable.Map();
	},
	componentDidMount: function() {
		this.setupGrid('');
	},
	ensureLoaded: function() {
		if (!this.getFlux().store("ComponentsStore").getState().componentsLoaded
		&& !this.getFlux().store("ComponentsStore").getState().loading) {
			this.getFlux().actions.loadComponents();
		}
	},
  setupGrid: function(caller) {
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
		};
	},
  getComponentFromFlux: function(cid) {
    return this.getFlux().store("ComponentsStore").getComponent(cid);
  },
  componentWillReceiveProps: function(newProps) {
		if (this.areComponentsLoaded())
    	this.setupGrid("");
  },
  componentWillUpdate: function() {
		if (this.areComponentsLoaded())
    	this.setupGrid("");
  },
  componentDidUpdate: function() {
		if (this.areComponentsLoaded())
    	this.setupGrid("did up");
  },
	areComponentsLoaded: function() {
		return this.getFlux().store("ComponentsStore").getState().componentsLoaded;
	},
  mapModule: function(component) {
   	return <DynamicComponent key={component.id} component={component} />
  },
  renderModules: function(componentsList) {
    var modules = $.map(componentsList, function(c){
      return this.mapModule(c);
    }.bind(this));

    return (
      <div className="modules-container">
        {modules}
      </div>
    );
  },
  render: function() {
		if (!this.areComponentsLoaded()) {
			return (
				<div className="dashboard">
					<AppSidebar context="dashboard" />
				</div>
			);
		} else {
      return (
        <div className="dashboard">
          <AppSidebar context="component-index" />
          <div className="modules-box">
            {this.renderModules(this.getFlux().store("ComponentsStore").getComponentsList())}
          </div>
        </div>
      );
		}
  }
});
module.exports = ComponentsIndex;
