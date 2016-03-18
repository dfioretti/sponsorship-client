var Fluxxor = require("fluxxor"),
    DataClient = require("../clients/data_client.js"),
    constants = require("../constants/constants.js"),


OverviewStore = Fluxxor.createStore({
	initialize: function () {
		this.selectedPane = "Overview";
		this.bindActions (
			constants.OVERVIEW_PANE_CHANGE, this.onOverviewPaneChange
		)
	},
	onOverviewPaneChange: function(payload) {
		this.selectedPane = payload.pane;
		this.emit("change");
	},
	getState: function() {
		return {
			menuItems: ["Overview", "Calendar", "Financials", "Data"],
			selectedPane: this.selectedPane
		};
	}
});
module.exports = OverviewStore;
