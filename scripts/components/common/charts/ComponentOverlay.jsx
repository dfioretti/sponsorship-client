var React = require('react');
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Popover = require('react-bootstrap').Popover;
var AddToDashboardList = require('../AddToDashboardList.jsx');
var Cog = require('react-icons/lib/fa/cog');

var ComponentOverlay = React.createClass({
	render: function() {
		var secondaryStyle = {};
		if (this.props.handleSecondaryClick !== null) {
			secondaryStyle = { display: "none" };
		}
		var dashStyle = {
			textTransform: "uppercase",
			letterSpacing: "1.5px",
			width: "100%",
			fontSize: "11px",
			color: "#03387a",
			textAlign: "center",
			paddingTop: "9px",
			borderTop: "1px solid #3c88d1"
		};
		return (
			<OverlayTrigger
				trigger="click"
				rootClose
				placement="bottom"
				overlay={
					<Popover
						id={Math.random().toString()}
						arrowOffsetLeft={500}
						>
						<div style={{width: "200px"}} className="component-configure">
							<button style={{fontSize: "12px", margin: "5px -5px 5px 5px", width: "calc(100% - 10px)", letterSpacing: "1.5px"}}
								onClick={this.props.handlePrimaryClick}
								className="btn btn-primary form-control"
								>
							{this.props.primaryAction}
							</button>
							<button style={{fontSize: "12px", margin: "5px -5px 5px 5px", width: "calc(100% - 10px)", letterSpacing: "1.5px" }}
								onClick={this.props.handleSecondaryClick}
								className="btn btn-info form-control"
								>
								{this.props.secondaryAction}
							</button>
							<h5 style={dashStyle}>Add to Dashboard</h5>
							<AddToDashboardList component={this.props.component} dashboards={this.props.dashboards} />
						</div>
					</Popover>
				}>
				<Cog className="cog-handle" />
			</OverlayTrigger>
		);
	}
});

module.exports = ComponentOverlay;
