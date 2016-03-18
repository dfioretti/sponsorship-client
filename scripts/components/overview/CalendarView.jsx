var React = require('react');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var BigCalendar = require('react-big-calendar');
var Grid = require('react-bootstrap').Grid;
var moment = require('moment');
var Panel = require('react-bootstrap').Panel;

var CalendarView = React.createClass({
	render: function() {
		BigCalendar.momentLocalizer(moment);
		return (
			<div className="overview-container overview-data">
				<Grid>
					<Row>
						<Col md={12}>
							<Panel bsClass="panel stat-panel">
								<div className="stat-title">
									Events & Activations
								</div>
							</Panel>
						</Col>
					</Row>
					<BigCalendar
						startAccessor='startDate'
						events={[]}
						endAccessor='endDate'
					/>
				</Grid>
			</div>
		);
	}
});

module.exports = CalendarView;
