var Fluxxor = require('fluxxor');
var constants = require('../constants/constants.js');


var ScoresStore = Fluxxor.createStore({
	initialize: function() {
		this.scores = [];
		this.scoresLoaded = false;
		this.loading = false;
		this.bindActions(
			constants.LOAD_SCORES_SUCCESS, this.onLoadScoresSuccess,
			constants.LOAD_SCORES, this.onLoadScores
		)
	},
	onLoadScores: function() {
		this.loading = true;
	},
	onLoadScoresSuccess: function(payload) {
		this.scores = payload.scores;
		this.scoresLoaded = true;
		this.loading = false;
		this.emit("change");
	},
	getState: function() {
		return {
			scores: this.scores,
			scoresLoaded: this.scoresLoaded,
			loading: this.loading
		};
	}
});

module.exports = ScoresStore;
