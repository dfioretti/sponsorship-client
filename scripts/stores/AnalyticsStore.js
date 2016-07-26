var Fluxxor = require('fluxxor');
var constants = require('../constants/constants');
var _ = require('underscore');

var AnalyticsStore = Fluxxor.createStore({
    initialize: function() {
        this.assets = {};
        this.scores = {};
        this.scoreMetrics = {};
        this.scoresLoaded = false;
        this.scoreMetricsLoaded = false;
        this.assetsLoaded = false;
        this.bindActions(
            constants.LOAD_SCORES_SUCCESS, this.onLoadScoresSuccess,
            constants.LOAD_ASSETS_SUCCESS, this.onLoadAssetsSuccess,
            constants.LOAD_SCORE_METRICS_SUCCESS, this.onLoadScoreMetricsSuccess
        );
    },
    onLoadScoresSuccess: function(payload) {
        var scores = payload.scores;
        _.each(scores, function(score) {
            this.scores[score['name']] = score;
        }.bind(this));
        this.scoresLoaded = true;
        this.emit("change");
    },
    onLoadAssetsSuccess: function(payload) {
         var assets = payload.assets;
         _.each(assets, function(asset) {
             this.assets[asset['entity_key']] = asset;
         }.bind(this))
         this.assetsLoaded = true;
         this.emit("change");
    },
    onLoadScoreMetricsSuccess: function(payload) {
        var scoreMetrics = payload.metrics;
        _.each(scoreMetrics, function(metric) {
            var key = metric['metric'] + "_" + metric['entity_key'];
            this.scoreMetrics[key] = metric;
        }.bind(this))
        this.scoreMetricsLoaded = true;
        this.emit("change");
    },
    getState: function() {
        return {
            scoreMetrics: this.scoreMetrics,
            assets: this.assets,
            scores: this.scores,
            assetsLoaded: this.assetsLoaded,
            scoresLoaded: this.scoresLoaded,
            scoreMetricsLoaded: this.scoreMetricsLoaded
        }
    }


});

module.exports = AnalyticsStore;
