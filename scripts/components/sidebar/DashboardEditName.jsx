var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
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
        </div>
				<hr />
				<label>Add Views</label>
      </div>
    );
  }
});
module.exports = DashboardEditName;
