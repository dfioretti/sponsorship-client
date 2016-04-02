var Fluxxor = require('fluxxor'),
		constants = require('../constants/constants.js'),

NavigationStore = Fluxxor.createStore({
	initialize: function() {
		//this.title = "My Portfolio";
		this.title = "";
		this.bindActions(
			constants.SET_BREADCRUMB, this.onSetBreadcrumb
		)
	},
	onSetBreadcrumb: function(payload) {
		this.title = payload.breadcrumb;
		this.emit("change");
	},
	getState: function() {
		return {
			title: this.title
		}
	}

});

module.exports = NavigationStore;
