var Fluxxor = require('fluxxor');
var constants = require('../constants/constants.js');

var ExternalApiStore = Fluxxor.createStore({
	initialize: function() {
		this.bindActions (
			constants.DISPATCH_TWITTER_LOAD, this.onDispatchTwitterLoad
		);
	},
	onDispatchTwitterLoad: function(payload) {
		console.log('depricated');
	}
});
module.exports = ExternalApiStore;
