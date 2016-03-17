var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
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
  getInitialState() {
    return { showModal: false };
  },

  close(e) {
    // clean up on close
    this.setState({ showModal: false });
    this.getFlux().actions.dashboardEditLoad(null);
  },
  open() {
    this.setState({showModal: true});
  },
  render() {
    //let popover = <ReactBootstrap.Popover title="popover">very popover. such engagement</ReactBootstrap.Popover>;
    //let tooltip = <ReactBootstrap.Tooltip>wow.</ReactBootstrap.Tooltip>;
    return (
      <div>
        <div>
          <li id='dashboard-edit-modal'
              style={{cursor: "pointer", fontSize: "13px"}}
              onClick={this.open}
          >
            &nbsp;&nbsp; -Create
          </li>
        </div>
        <ReactBootstrap.Modal flux={this.props.flux} show={this.state.showModal} onHide={this.close}>
          <ReactBootstrap.Modal.Header closeButton>
            <h4 className="heading-text">{this.getStateFromFlux().heading}</h4>
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body>
            <DashboardEditName mode={this.props.mode} dashboardId={this.props.dashboardId} />
            <DashboardEditBody mode={this.props.mode} dashboardId={this.props.dashboardId} />
            </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer>
            <DashboardEditFooter modal={this} />
          </ReactBootstrap.Modal.Footer>
        </ReactBootstrap.Modal>
      </div>
    );
  }
});
module.exports = CreateDashboardModal;
