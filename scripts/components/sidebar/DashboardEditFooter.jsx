var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React);

var DashboardEditFooter = React.createClass({
  mixins: [FluxMixin],
  getStateFromFlux: function() {
    return this.getFlux().store("DashboardEditStore").getState();
  },
  handleCreateDashboard: function(e) {
    if (this.getStateFromFlux().id !== null) {
      this.getFlux().actions.dashboardUpdate();
    } else {
      this.getFlux().actions.dashboardCreate();
    }
		this.getFlux().actions.toggleModal();
  },
	handleDashboardClose: function() {
		this.getFlux().actions.dashboardEditLoad(null);
		this.getFlux().actions.toggleModal();
	},
  render: function() {
    return (
      <div style={{float: "right", width: "100%", paddingTop: 0}} className="dashboard-edit-footer">
				<hr />
				<div style={{float: "right"}}>
				<button style={{marginRight: 10}} onClick={this.handleDashboardClose} className="btn dashboard-create">Close</button>
        <button onClick={this.handleCreateDashboard} className="btn btn-primary dashboard-create">Save</button>
				</div>
      </div>
    )
  }
});
module.exports = DashboardEditFooter;
