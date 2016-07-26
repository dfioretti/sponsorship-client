var Fluxxor = require('fluxxor');
var constants = require('../constants/constants');
var _ = require('underscore');
var titleize = require('underscore.string/titleize');

var AnalyticsStore = Fluxxor.createStore({
    initialize: function() {
        this.assets = {};
        this.scores = {};
        this.scoreMetrics = {};
        this.scoresLoaded = false;
        this.scoreMetricsLoaded = false;
        this.chartDataLoaded = false;
        this.assetsLoaded = false;
        this.chartData = [];
        this.assetOptions = {};
        this.scoreOptions = {};
        this.bindActions(
            constants.LOAD_SCORES_SUCCESS, this.onLoadScoresSuccess,
            constants.LOAD_ASSETS_SUCCESS, this.onLoadAssetsSuccess,
            constants.LOAD_SCORE_METRICS_SUCCESS, this.onLoadScoreMetricsSuccess,
            constants.RESET_ANALYTICS, this.onResetAnalytics
        );
    },
    onResetAnalytics: function() {
        this.scoresLoaded = false;
        this.assetsLoaded = false;
        this.chartDataLoaded = false;
        this.scoreMetricsLoaded = false;
        this.assets = {};
        this.scores = {};
        this.scoreMetrics = {};
        this.chartData = [];
        this.assetOptions = {};
        this.scoreOptions = {};

        this.emit("change");
    },
    onLoadScoresSuccess: function(payload) {
        var scores = payload.scores;
        _.each(scores, function(score) {
            this.scores[score['name']] = score;
        }.bind(this));
        this.scoresLoaded = true;
        this.buildChartData();
        this.emit("change");
    },
    onLoadAssetsSuccess: function(payload) {
         var assets = payload.assets;
         _.each(assets, function(asset) {
             this.assets[asset['entity_key']] = asset;
         }.bind(this))
         this.assetsLoaded = true;
         this.buildChartData();
         this.emit("change");
    },
    onLoadScoreMetricsSuccess: function(payload) {
        var scoreMetrics = payload.metrics;
        _.each(scoreMetrics, function(metric) {
            var key = metric['metric'] + "_" + metric['entity_key'];
            this.scoreMetrics[key] = metric;
        }.bind(this))
        this.scoreMetricsLoaded = true;
        this.buildChartData();
        this.emit("change");
    },
    getState: function() {
        return {
            scoreMetrics: this.scoreMetrics,
            assets: this.assets,
            scores: this.scores,
            assetsLoaded: this.assetsLoaded,
            scoresLoaded: this.scoresLoaded,
            scoreMetricsLoaded: this.scoreMetricsLoaded,
            chartData: this.chartData,
            assetOptions: this.assetOptions,
            scoreOptions: this.scoreOptions,
            chartDataLoaded: this.chartDataLoaded
        }
    },
    buildChartData: function() {
        if (this.assetsLoaded && this.scoresLoaded && this.scoreMetricsLoaded) {
            var scores = {};
            var scoreNames = [];
            var metricNames = [];
            _.each(this.scores, function(score) {
                var scoreName = score.name;
                scoreNames.push(score.name);
                _.each(score.score.nodeDataArray, function(node) {
                    var parent = _.findWhere(score.score.nodeDataArray, { key: node.parent });
                    var display = "";
                    if (parent != null && typeof(parent) != 'undefined') {
                        display = parent.component;
                    }
                    metricNames.push(node.dataname);
                    scores[node.dataname] = {
                        score: scoreName,
                        weight: node.weight,
                        group: display
                    }
                });
            });
            var assetOptions = {};
            var metricOptions = {};
            var scoreOptions = {};
            var assetNames = [];
            var data = [];
            _.each(this.scoreMetrics, function(metric) {
                if (metric.metric != 'team_score') {
                    var entry = {
                        id: metric.id,
                        entity_key: this.assets[metric.entity_key].name,
                        source: metric.source,
                        metric: metric.metric,
                        value: metric.value,
                        icon: metric.icon,
                        norm_value: metric.norm_value,
                        rank: metric.rank,
                        entity_image: this.assets[metric.entity_key].image_url,
                        score: scores[metric.metric].score,
                        weight: scores[metric.metric].weight,
                        group: scores[metric.metric].group
                    }
                    data.push(entry);
                }
            }.bind(this))

            _.each(_.keys(this.assets), function(key) {
                var fmt = titleize(key.split("_").join(" "));
                 assetOptions[fmt] = fmt;
            })
            _.each(scoreNames, function(score) {
                 scoreOptions[score] = score;
            })
            this.chartData = data;
            this.assetOptions = assetOptions;
            this.scoreOptions = scoreOptions;
            this.chartDataLoaded = true;
            this.emit("change");
        }
    }
});

module.exports = AnalyticsStore;
