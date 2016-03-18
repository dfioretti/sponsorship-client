var React = require('react');
var Col = require('react-bootstrap').Col;
//var Card = require('material-ui/lib/card');
var Panel = require('react-bootstrap').Panel;

var Stat = React.createClass({
	render: function() {
		return (
				<Col md={this.props.col}>
					<Panel bsClass="panel stat-panel">
						<div className="stat-heading">
							{this.props.heading}
						</div>
						<div className="stat-subheading">
							{this.props.subheading}
						</div>
						<div className="stat-value">
							{this.props.value}
						</div>
					</Panel>
				</Col>
		);
	}
});
module.exports = Stat;
