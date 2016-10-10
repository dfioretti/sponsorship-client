var Fluxxor = require('fluxxor');
var constants = require('../constants/constants');

var ModelingStore = Fluxxor.createStore({
	initialize: function() {
		this.bindActions(
				"TEST_ACTION", this.onTestAction
		)
	},
	onTestAction: function(payload) {
		console.log('in test actions!');
	},
	getState: function() {
		return {}
	}
});

module.exports = ModelingStore;
