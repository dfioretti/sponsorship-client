var React = require('react');

var Drawer = React.createClass({
	render: function() {
		return (
			<div className={this.props.open ? "drawer" : "drawer closed"}>
				{ this.props.children }
			</div>
		);
	}
});
module.exports = Drawer;
