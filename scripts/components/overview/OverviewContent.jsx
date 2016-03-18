var React = require('react');
var CalendarView = require('./CalendarView.jsx');
var FinancialsView = require('./FinancialsView.jsx');
var DataView = require('./DataView.jsx');

var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);


var OverviewContent = React.createClass({
	mixins: [FluxMixin],
	getDataForView: function () {
		if (this.props.entity === 'portfolio') {
			return this.getFlux().store("AssetsStore").getState().assets;
		} else {
			return this.getFlux().store("DataStore").getState().data;
		}
	},
	getFinancialData: function() {
		if (this.props.entity === 'portfolio') {
			return {
				statOneHeading: "Portfolio Spend",
				statOneSub: "Annual",
				statOneValue: "$100M",
				statTwoHeading: "Activation Spend",
				statTwoSub: "Month",
				statTwoValue: "$350K",
				statTwoValue: "$2M",
				statThreeHeading: "Remaining Budget",
				statThreeSub: "12/31/2016",
				statThreeValue: "$2M"
			}
		} else if (this.props.entity === 'entity') {
			return {
				statOneHeading: "Asset Cost",
				statOneSub: "Annual",
				statOneValue: "$300K",
				statTwoHeading: "Activation Spend",
				statTwoSub: "Month",
				statTwoValue: "$25K",
				statThreeHeading: "Remaining Budget",
				statThreeSub: "12/31/2016",
				statThreeValue: "$100M"
			};
		}

	},
	contentForState: function() {
		switch(this.props.view) {
			case 'Overview':
				return <FinancialsView data={this.getFinancialData()} entity={this.props.entity} />
				break;
			case 'Data':
				return <DataView entity={this.props.entity} data={this.getDataForView()}/>
				break;
			case 'Calendar':
				return <CalendarView />
				break;
			case 'Financials':
				return <FinancialsView data={this.getFinancialData()} entity={this.props.entity} />
				break;
			}
	},
	render: function() {
		return (
			<div className="overview-content">
				{this.contentForState()}
			</div>
		);
	}
});
module.exports = OverviewContent;
