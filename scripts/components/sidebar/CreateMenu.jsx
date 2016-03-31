var React = require('react'),
	DropdownButton = require('react-bootstrap').DropdownButton,
	MenuItem = require('react-bootstrap').MenuItem,
	Fluxxor = require('fluxxor'),
	Navigation = require('react-router').Navigation,
	FluxMixin = Fluxxor.FluxMixin(React);

var CreateMenu = React.createClass({
	mixins: [FluxMixin, Navigation],

	handleCreateSelect: function(e, eventKey) {
		if (eventKey == "1") {
			this.getFlux().actions.dashboardEditLoad(null);
			$('#dashboard-edit-modal').click();
		} else if (eventKey == "2") {
			this.getFlux().actions.resetComponentEditor();
			this.transitionTo('/apt/editor_component');
		} else if (eventKey == "3") {
			this.getFlux().actions.resetScoreEditor();
			this.transitionTo('/apt/editor_score');
		}
	},
	render: function() {
		return (
			<DropdownButton
				block={true}
				id={"create-drop"}
				bsStyle={"primary"}
				style={{ margin: "10px -10px 10px 10px", width: "230px", letterSpacing: "1.5px" }}
				onSelect={this.handleCreateSelect}
				title={"CREATE"}>
				<MenuItem eventKey="1">Dashboard</MenuItem>
				<MenuItem eventKey="2">Module</MenuItem>
				<MenuItem eventKey="3">Score</MenuItem>
			</DropdownButton>
		);
	}
});

module.exports = CreateMenu;
