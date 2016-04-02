var Fluxxor = require('fluxxor'),
		constants = require('../constants/constants.js'),

NavigationStore = Fluxxor.createStore({
	initialize: function() {
		//this.title = "My Portfolio";
		this.title = "";
		this.currentView = "";
		this.currentId = "";
		this.bindActions(
			constants.SET_BREADCRUMB, this.onSetBreadcrumb,
			constants.SET_CURRENT_NAV, this.onSetCurrentNav
		)
	},
	onSetCurrentNav: function(payload) {
		this.currentView = payload.view;
		this.currentId = payload.id;
		this.emit("change");
	},
	onSetBreadcrumb: function(payload) {
		this.title = payload.breadcrumb;
		this.emit("change");
	},
	getState: function() {
		return {
			title: this.title,
			currentView: this.currentView,
			currentId: this.currentId
		}
	}

});

module.exports = NavigationStore;
