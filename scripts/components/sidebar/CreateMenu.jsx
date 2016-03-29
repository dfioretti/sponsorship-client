var React = require('react'),
	DropdownButton = require('react-bootstrap').DropdownButton,
	MenuItem = require('react-bootstrap').MenuItem,
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React);

var CreateMenu = React.createClass({
	handleCreateSelect: function(e, eventKey) {
		if (eventKey == "1") {

		} else if (eventKey == "2") {

		} else if (eventKey == "3") {

		}
	},
	render: function() {
		return (
			<DropdownButton id={"create-drop"} onSelect={this.handleCreateSelect} title={"CREATE"}>
				<MenuItem eventKey="1">Dashboard</MenuItem>
				<MenuItem eventKey="2">Module</MenuItem>
				<MenuItem eventKey="3">Score</MenuItem>
			</DropdownButton>
		);
	}
});

module.exports = CreateMenu;
