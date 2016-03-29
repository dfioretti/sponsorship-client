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
						</div>
					</Popover>
				}>
				<Cog className="cog-handle" />
			</OverlayTrigger>
		);
	}
});

module.exports = ComponentOverlay;
