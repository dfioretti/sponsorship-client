var React = require('react');
var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;
var Grid = require('react-bootstrap').Grid;
var Card = require('material-ui').Card;
var FlatButton = require('material-ui').FlatButton;
var Colors = require('../../constants/colors.js');
var CardHeader = require('material-ui').CardHeader;
var CardTitle = require('material-ui').CardTitle;
var CardText = require('material-ui').CardText;
var Divider = require('material-ui').Divider;
var LineChart = require('react-icons/lib/fa/line-chart');

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
		var rightMenu = null;
		if (typeof(this.props.rightMenu) !== 'undefined') {
			//rightMenu = <div style={{float: 'right', position: 'relative', top: -15}}>
		}
		return (
			<Col md={this.props.cols}>
				<Card>
					<CardHeader titleStyle={{fontWeight: 500}} avatar={this.props.avatar} title={this.props.title}>
					<div style={{float: 'right', position: 'relative', top: -15}}>
						{this.props.rightMenu}
					</div>
					</CardHeader>
					<div style={{marginLeft: 10}}>
						{this.props.children}
					</div>
				</Card>
			</Col>
		);
	}
});
/*
<Card
					expanded={this.state.expanded}
					onExpandChange={this.handleExpandChange}
					>
					<span style={{marginLeft: 10, marginTop: 10, marginBottom: 20, lineHeight: '50px'}} className="text-fix medium dark">{this.props.title}</span>
					<div style={{marginLeft: 10}}>
						{this.props.children}
					</div>
				</Card>
*/
//style={{margin: "0px 0px 0px 0px", padding: 10}}>
// style={{margin: 0}}
module.exports = DashboardContainer;
