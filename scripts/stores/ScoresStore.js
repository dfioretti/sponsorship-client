var Fluxxor = require("fluxxor"),
    constants = require("../constants/constants.js"),
    ScoresStore = Fluxxor.createStore({
        initialize: function() {
            this.scores = [],
            this.scoresLoaded = !1,
            this.loading = !1,
            this.bindActions(
              constants.LOAD_SCORES_SUCCESS, this.onLoadScoresSuccess,
              constants.LOAD_SCORES, this.onLoadScores
            )
        },
        onLoadScores: function() {
            this.loading = !0
        },
        onLoadScoresSuccess: function(s) {
            this.scores = s.scores,
            this.scoresLoaded = !0,
            this.loading = !1,
            this.emit("change")
        },
        getState: function() {
            return {
                scores: this.scores,
                scoresLoaded: this.scoresLoaded,
                loading: this.loading
            }
        },
        getScore: function(sid) {
          for (var i = 0; i < this.scores.length; i++) {
            if (this.scores[i].id == sid) {
              return this.scores[i];
            }
          }
          return null;
        }
    });
module.exports = ScoresStore;
