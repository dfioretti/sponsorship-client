var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Navigation = require('react-router').Navigation,
		ReactBootstrap = require('react-bootstrap'),
		Col = require('react-bootstrap').Col,
		Row = require('react-bootstrap').Row,
		Link = require('react-router').Link,
		List = require('material-ui').List,
		ListItem = require('material-ui').ListItem,
		Cog = require('react-icons/lib/fa/cog'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var DashboardContextMenu = React.createClass({
  mixins: [FluxMixin, Navigation, StoreWatchMixin("DashboardHomeStore")],
  componentWillMount: function() {
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
    if (e.target.dataset.action === 'view') {
      this.transitionTo('/apt/dashboard/' + e.target.id);
    } else if (e.target.dataset.action === 'edit'){
      this.getFlux().actions.dashboardEditLoad(e.target.id);
			this.getFlux().actions.toggleModal();
    }
  },
	createDashboard: function() {
		this.getFlux().actions.dashboardEditLoad(null);
		this.getFlux().actions.toggleModal();
	},
	editDashboard: function(e) {
		var id = this.getFlux().store("NavigationStore").getState().currentId;
		this.getFlux().actions.dashboardEditLoad(id);
		//this.getFlux().actions.dashboardEditLoad(e.target.id);
		this.getFlux().actions.toggleModal();
	},
  render: function() {
		var itemStyle = {
			//color: 'white',
			color: '#9e9e9e',
			//fontSize: 14,
			//height: 40,
			textTransform: 'uppercase',
			letterSpacing: '1.5px'
		}
		/*

		<li key={d.id}>
			<Row>
				<Link style={{color: "white"}} to={'/apt/dashboard/' + d.id}>
					<Col md={8}>
						{d.name}
					</Col>
				</Link>
				<div id={d.id} onClick={function(e) { this.editDashboard(e)}.bind(this)}>
				<Col id={d.id}  md={4}>
					<Cog id={d.id} style={{pointerEvents: "none"}}className="cog-handle"/>
				</Col>
				</div>
			</Row>
			{this.getStateFromFlux().customDashboards.map(function(d){
				return (
					<ListItem
						style="itemStyle"
						primaryText={<div><Link to='/apt/dashboard/'>{d.name}<Link></div>}
						rightIcon={<Cog id={d.id} onClick={edit} style={{pointerEvents: "none"}}className="cog-handle"/>}
						/>
				);
			}.bind(this))</div>}
		</li>
		*/
    if (this.getStateFromFlux().dashboardsLoaded) {
			var edit = this.editDashboard;
      return (
        <div className="editor-menu">
					<List>
						<ListItem
							style={itemStyle}
							leftIcon={<Cog />}
							primaryText={<div>CONFIGURE</div>}
							onTouchTap={this.editDashboard}
							/>
					</List>
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
