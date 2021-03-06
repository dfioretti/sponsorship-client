var React = require('react');
var uuid = require('node-uuid');
var ComponentOverlay = require('./ComponentOverlay.jsx');
var Navigation = require('react-router').Navigation;
var Fluxxor = require('fluxxor');
var DataFormatter = require('../../../utils/DataFormatter.js');
///var DataFomatter = require('../../../utils/DataFormatter.js');
var FluxMixin = Fluxxor.FluxMixin(React);

var ScoreView = React.createClass({
	mixins: [Navigation, FluxMixin],

	getInitialState: function() {
		return { scoreId: uuid.v4(), sliderId: uuid.v4() };
	},
	componentDidMount: function() {
		console.log("DID MT", this.props);
		var val = 0.0;
		if (typeof(this.props.component.state) !== 'undefined' &&
		this.props.component.state.data.length > 0) {
			val = this.props.component.state.data[0].value;// / 100;
		}
		var pos = (292 * val / 1) -8;
		console.log("pos", pos);
		$('#' + this.state.sliderId).animate({left: pos}, 1000);
	},
	componentWillReceiveProps: function(newProps) {
		var val = 0.0;
		if (typeof(newProps.component.state) !== 'undefined'
			&& newProps.component.state.data.length > 0) {
				val = newProps.component.state.data[0].value;// / 100;
		}
		var pos = (292 * val / 1) - 8;
		$('#' + this.state.sliderId).animate({left:pos}, 1000);
	},
	showTooltip: function(e) {
		$('#' + this.state.scoreId).show();
	},
	hideTooltip: function(e) {
		$('#' + this.state.scoreId).hide();
	},
	handleComponentEdit: function() {
		this.getFlux().actions.configureComponentEditor(this.props.component);
		this.transitionTo('/apt/editor_component/' + this.props.component.id);
	},
	handleScoreView: function() {
		var score_id = this.props.component.state.data[0].score_id
		var score = this.getFlux().store("ScoresStore").getScore(score_id);
	  this.getFlux().actions.loadSavedScore(score);
	  this.transitionTo('/apt/editor_score/' + score_id);
	},
	render: function() {

		var arrowStyle = { borderTop: "20px solid " + "#97c93c" };
		var metric = "";
		var score = "#";
		if (typeof(this.props.component.state) !== 'undefined'
		&& this.props.component.state.data.length > 0) {
			metric = this.props.component.state.data[0].metric.split("_").join(" ");
			score = this.props.component.state.data[0].value;
		}
		var left = score * 300 - 30;
		var tooltipStyle = { left: left, top: -66, backgroundColor: "#97c93c" };
		//score = Math.floor(Math.random() * 30) + 70;
		return (
			<div id="risk_assessment" className="dashboard-module">
				<div className="top">
					<ComponentOverlay
						handlePrimaryClick={this.handleComponentEdit}
						primaryAction={"EDIT COMPONENT"}
						handleSecondaryClick={this.handleScoreView}
						secondaryAction={"VIEW SCORE"}
						component={this.props.component}
						dashboards={this.getFlux().store("DashboardHomeStore").getCustomDashboards()}
						/>
					<div className="drag-handle" />
					<div className="top-title">{this.props.component.name}</div>
				</div>
				<div className="main">
					<div className="risk">{Math.round(DataFormatter(score) * 10) / 10}</div>
					<div className="subheader">{metric}</div>
					<div className="slider-bar" onMouseOver={this.showTooltip} onMouseLeave={this.hideTooltip}>
						<div id={this.state.sliderId} className="slider-button"></div>
						<div id={this.state.scoreId} className="custom-tooltip" style={tooltipStyle}>
							<span className="risk-label">{Math.round(DataFormatter(score))}/100</span>
							<div className="custom-tooltip-arrow" style={arrowStyle}></div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = ScoreView;
