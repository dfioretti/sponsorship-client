var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React);

var DashboardEditFooter = React.createClass({
  mixins: [FluxMixin],
  getStateFromFlux: function() {
    return this.getFlux().store("DashboardEditStore").getState();
  },
  handleCreateDashboard: function() {
    if (this.getStateFromFlux().id !== null) {
      this.getFlux().actions.dashboardUpdate();
    } else {
      this.getFlux().actions.dashboardCreate();
    }
    this.props.modal.close();
  },
  render: function() {
    return (
      <div className="dashboard-edit-footer">
        <button onClick={this.handleCreateDashboard} className="btn btn-primary dashboard-create">Save</button>
      </div>
    )
  }
});
module.exports = DashboardEditFooter;
