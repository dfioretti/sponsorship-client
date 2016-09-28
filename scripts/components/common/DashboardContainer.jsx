var React = require('react');
var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;
var Grid = require('react-bootstrap').Grid;
var Card = require('material-ui').Card;
var FlatButton = require('material-ui').FlatButton;
var CardHeader = require('material-ui').CardHeader;
var CardTitle = require('material-ui').CardTitle;
var CardText = require('material-ui').CardText;
var Divider = require('material-ui').Divider;

var DashboardContainer = React.createClass({
	getInitialState: function() {
		return { expanded: true }
	},
	handleExpandChange: function(expanded) {
		this.setState({ expanded: expanded });
	},
	render: function() {
		var padding = 0;
		if (this.props.pad) {
			padding = 10;
		}
		return (
			<Col md={this.props.cols}>
				<Card
					expanded={this.state.expanded}
					onExpandChange={this.handleExpandChange}
					>
					<span style={{marginLeft: 10, marginTop: 10, height: 40}} className="text-fix medium dark">{this.props.title}</span>
					<div style={{marginLeft: 10}}>
						{this.props.children}
					</div>
				</Card>
			</Col>
		);
	}
});
//style={{margin: "0px 0px 0px 0px", padding: 10}}>
// style={{margin: 0}}
module.exports = DashboardContainer;
