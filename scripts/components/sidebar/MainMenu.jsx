var React = require('react');
var Panel = require('react-bootstrap').Panel;
var MenuButton = require('react-icons/lib/fa/bars');
var Link = require('react-router').Link;
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var CreateDashboardModal = require('./CreateDashboardModal.jsx');


var MainMenu = React.createClass({
	mixins: [FluxMixin],

	getInitialState: function() {
		return {open: false};
	},
	toggleOpen: function() {
		this.setState({open: !this.state.open});
	},
	render: function() {
		return (
			<div className="top-menu">
				<MenuButton className="menu-button" onClick={this.toggleOpen} />
				<CreateDashboardModal id="create-dashboard-modal" flux={this.getFlux()} />
				<Panel collapsible expanded={this.state.open} bsClass="panel menu-panel">
						<ul>
							<Link to="/"><li>Dashboards</li></Link>
							<Link to="components_index"><li>Components</li></Link>
							<Link to="score_index"><li>Scores</li></Link>
							<Link to="data_index"><li>Data</li></Link>
						</ul>
				</Panel>
			</div>
		);
	}
});

module.exports = MainMenu;
