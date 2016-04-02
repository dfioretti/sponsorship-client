var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Dialog = require('material-ui').Dialog,
		ReactBootstrap = require('react-bootstrap'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin,
		DashboardEditName = require('./DashboardEditName.jsx'),
		DashboardEditBody = require('./DashboardEditBody.jsx'),
		DashboardEditFooter = require('./DashboardEditFooter.jsx');

var CreateDashboardModal = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("DashboardEditStore")],

  componentDidMount: function() {
  },
  getStateFromFlux: function() {
    return this.getFlux().store("DashboardEditStore").getState();
  },
  close: function(e) {
    // clean up on close
    //this.setState({ showModal: false });
    //this.getFlux().actions.dashboardEditLoad(null);
  },
  open: function() {
		//console.log("hmm");
    //this.setState({showModal: true});
  },
  render: function() {
		return (
			<Dialog
				title={this.getStateFromFlux().heading}
				open={this.state.showModal}
				modal={true}
				>
				<DashboardEditName mode={this.props.mode} dashboardId={this.props.dashboardId} />
				<DashboardEditBody mode={this.props.mode} dashboardId={this.props.dashboardId} />
				<DashboardEditFooter modal={this} />
			</Dialog>
		)
  }
});
module.exports = CreateDashboardModal;
