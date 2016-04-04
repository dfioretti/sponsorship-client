var Fluxxor = require('fluxxor'),
		constants = require('../constants/constants');

var AlertStore = Fluxxor.createStore({
	initialize: function() {
		this.message = "";
		this.open = false;
		this.bindActions(
			constants.SAVE_SUCCESS, this.onSaveSuccess,
			constants.UPDATE_SUCCESS, this.onSaveSuccess,
			constants.HIDE_SNACKBAR, this.onHideSnackbar,
			constants.DASHBOARD_CREATE_SUCCESS, this.onDashboardCreateSuccess,
			constants.SAVE_SCORE_SUCCESS, this.onSaveScoreSuccess,
			constants.DASHBOARD_UPDATE_SUCCESS, this.onDashboardUpdateSuccess,
			constants.ADD_COMPONENT_TO_DASHBOARD_SUCCESS, this.onAddComponentToDashboardSuccess,
			constants.SHOW_ALERT, this.onShowAlert
		)
	},
	onShowAlert: function(payload) {
		this.open = true;
		this.message = payload.message;
		this.emit("change");
	},
	onAddComponentToDashboardSuccess: function (payload) {
		this.open = true;
		this.message = "Added to " + payload.dashboard.name + "!";
		this.emit("change");
	},
	onDashboardUpdateSuccess: function() {
		this.open = true;
		this.message = "Dashboard Updated";
		this.emit("change");
	},
	onSaveScoreSuccess: function() {
		this.open = true;
		this.message = "Score Saved!";
		this.emit("change");
	},
	onDashboardCreateSuccess: function() {
		this.open = true;
		this.message = "Dashboard Created!";
		this.emit("change");
	},
	onHideSnackbar: function() {
		this.open = false;
		this.message = "";
		this.emit("change");
	},
	onSaveSuccess: function() {
		this.message = "Save Success!";
		this.open = true;
		this.emit("change");
	},
	getState: function() {
		return {
			message: this.message,
			open: this.open
		}
	}
});
module.exports = AlertStore;
