var React = require('react');
var TopNav = require('../common/TopNav');

var Workspace = React.createClass({
	getInitialState: function() {
		return { sideMenuOpen: false }
	},


	toggleSideMenu: function() {
		console.log("called it")
	},

	render: function() {
		return (
			<TopNav toggleSideMenu={this.toggleSideMenu} />
		);
	}
});

module.exports = Workspace;
