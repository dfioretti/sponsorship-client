var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Navigation = require('react-router').Navigation,
		ReactBootstrap = require('react-bootstrap'),
		Col = require('react-bootstrap').Col,
		Row = require('react-bootstrap').Row,
		Link = require('react-router').Link,
		Cog = require('react-icons/lib/fa/cog'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var DashboardContextMenu = React.createClass({
  mixins: [FluxMixin, Navigation, StoreWatchMixin("DashboardHomeStore")],
  componentWillMount: function() {
		return;
    if (!this.getStateFromFlux().dashboardsLoaded
					&& !this.getStateFromFlux().loading) {
      this.getFlux().actions.loadDashboards();
    }
  },
  getInitialState: function() {
    return {};
  },
  getStateFromFlux: function() {
    return this.getFlux().store("DashboardHomeStore").getState();
  },
  /**
   * Handles dashboard dropdown selected.
   * Navigates to dashboard view or launches edit modal
   *
   * @param {e} item click event
   */
  handleMenuSelect: function(e) {
		console.log("hee");
		console.log(e.target);
    if (e.target.dataset.action === 'view') {
      this.transitionTo('/apt/dashboard/' + e.target.id);
    } else if (e.target.dataset.action === 'edit'){
      this.getFlux().actions.dashboardEditLoad(e.target.id);
      $('#dashboard-edit-modal').click();
    }
  },
	createDashboard: function() {
		//this.getFlux().actions.dashboardEditLoad(null);
		//$('#dashboard-edit-modal').click();
	},
  render: function() {
    if (this.getStateFromFlux().dashboardsLoaded) {
      return (
        <div className="editor-menu">
					<Link to={"/apt/editor_component"}>
					<button style={{margin: "10px -10px 10px 10px", width: "calc(100% - 20px)", letterSpacing: "1.5px"}} onClick={this.createComponent} className="btn btn-primary form-control">
						CREATE COMPONENT
					</button>
				</Link>
       </div>
      );
    } else {
      return (
        <div className="dashboard-context-menu">
        </div>
      );
    }
  }
});
module.exports = DashboardContextMenu;
