var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		CloseIcon = require('react-icons/lib/fa/close'),
		AddIcon = require('react-icons/lib/fa/plus'),
		ImageHelper = require('../../utils/ImageHelper.js'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var DashboardEditName = React.createClass({
  mixins: [FluxMixin],
  componentWillMount: function() {
  },
  getStateFromFlux: function() {
    return this.getFlux().store("DashboardEditStore").getState();
  },
  handleNameChange: function(e) {
    this.getFlux().actions.updateDashboardName(e.target.value);
  },
  render: function() {

    return (
      <div className="dasboard-edit-name">
        <div className="form-group">
          <label>Dashboard Name</label>
          <input type="text" value={this.getStateFromFlux().dashboardName} onChange={this.handleNameChange} className="form-control" placeholder="Enter Name" />
						<hr />
						<label>Add Views</label>
        </div>

      </div>
    );
  }
});

var DashboardEditBody = React.createClass({
  mixins: [FluxMixin],
  getStateFromFlux: function() {
    return this.getFlux().store("ComponentsStore").getState();
  },
  render: function() {
		// lazy, but whatever
		var allComponents = this.getFlux().store("ComponentsStore").getComponents();
		var componentsList = [];
		for (var key in allComponents) {
			componentsList.push(allComponents[key]);
		}
    return (
      <div className="row dashboard-edit-body">
        {componentsList.map(function(component) {
          return <DashboardEditComponentRow key={component.id} component={component} />;
        })}
      </div>
    );
  }
});

var AddRemoveComponentButton = new React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("DashboardEditStore")],

  getStateFromFlux: function() {
    return this.getFlux().store("DashboardEditStore").getState();
  },
  handleAddComponent: function(e) {
		console.log(e.target);
    this.getFlux().actions.addDashboardComponent(e.target.id);
  },
  handleRemoveComponent: function(e) {
		console.log(e.target);
    this.getFlux().actions.removeDashboardComponent(e.target.id);
  },
  render: function() {
    if (this.getStateFromFlux().selectedComponents.indexOf(this.props.component.id.toString()) != -1) {
      return (
				<div style={{cursor: "pointer"}}onClick={this.handleRemoveComponent} id={this.props.component.id}>
					<CloseIcon id={this.props.component.id} style={{color: "#e76959", height: "40px", width: "40px", pointerEvents: "none", padding: "5px", cursor: "pointer"}} />
				</div>
      );
    } else {
      return (
				<div style={{cursor: "pointer"}}onClick={this.handleAddComponent} id={this.props.component.id}>
					<AddIcon id={this.props.component.id} style={{color: "#50e3c2", height: "40px", width: "40px", pointerEvents: "none", padding: "5px", cursor: "pointer"}} />
				</div>
      );
    }
  }

});
var DashboardEditComponentRow = React.createClass({
  mixins: [FluxMixin],
  render: function () {
    var i = 1000;
		if (this.props.component.model.data === null) { return null; }
    return (
      <div className="dash-edit-component-row">
        <div className="col-md-4 bs-col">
          {this.props.component.name.substring(0, 18) + "..." }
        </div>
        <div className="col-md-3 bs-col">
          {this.props.component.view.split(/(?=[A-Z])/).join(" ")}
        </div>
        <div className="col-md-4 small-round-images bs-col">
          {this.props.component.model.data.map(function(d) {
            return (
              <img key={i--} src={ImageHelper('', d.metric.point_image)}/>
            );
          })}
        </div>
        <div className="col-md-1 add-remove-button bs-col">
          <AddRemoveComponentButton key={this.props.component.id} component={this.props.component} />
        </div>
      </div>
    );
  }
});
module.exports = DashboardEditBody;
