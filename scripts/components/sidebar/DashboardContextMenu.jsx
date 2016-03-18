var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Navigation = require('react-router').Navigation,
		ReactBootstrap = require('react-bootstrap'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var DashboardContextMenu = React.createClass({
  mixins: [FluxMixin, Navigation, StoreWatchMixin("DashboardHomeStore")],
  componentWillMount: function() {
    if (!this.getStateFromFlux().loaded) {
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
		this.getFlux().actions.dashboardEditLoad(null);
		$('#dashboard-edit-modal').click();
	},
  render: function() {
    if (this.getStateFromFlux().dashboardLoaded) {
      return (
        <div className="editor-menu">
					<button style={{margin: "10px -10px 10px 10px", width: "calc(100% - 20px)", letterSpacing: "1.5px"}}onClick={this.createDashboard()} className="btn btn-primary form-control">
						CREATE DASHBOARD
					</button>
          <ReactBootstrap.NavDropdown key='nav-drop' style={{width: "100%"}}eventKey={1} title="Dashboards" id="dashbard-nav-dropdown">
           {this.getStateFromFlux().customDashboards.map(function(d) {
             return (
               <div className="dropdown-item-wrapper">
                 <ReactBootstrap.MenuItem
                   onSelect={ function(e) { this.handleMenuSelect(e); }.bind(this) }
                   style={{padding: "5px 0px 5px 0px"}}
                   key={d.id}
                 >
                   <div key={'row-' + d.id} className="row">
                     <div key={'view-link-' + d.id} data-action="view" id={d.id} className="col-md-9 bs-col navdrop">
                       {d.name}
                     </div>
                     <div key={'edit-link' + d.id} className="col-md-1 bs-col navdrop">
                       <span key={'icon-' + d.id} data-action="edit" id={d.id} className="glyphicon glyphicon-cog" aria-hidden="true"></span>
                     </div>
                   </div>
                 </ReactBootstrap.MenuItem>
               </div>
             );
           }.bind(this))}
         </ReactBootstrap.NavDropdown>
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
