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
        this.chartDataLoaded = false;
        this.scoreMetricsLoaded = false;

        this.emit("change");
    },
    onLoadScoresSuccess: function(payload) {
        var oldScores = this.scores;
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
            var assetOptions = {};
            var metricOptions = {};
            var scoreOptions = {};
            var assetNames = [];
            var data = [];

            var scoreData = {};
            _.each(this.scores, function(score) {
                scoreOptions[score.name] = score.name;
                _.each(score.score.nodeDataArray, function(node) {
                    if (node.mode == 'value') {
                        node['scoreName'] = score.name;
                        scoreData[node.dataname] = node;
                    } else {
                        if (!_.has(scoreData, score.name)) {
                            scoreData[score.name] = {};
                        }
                        scoreData[score.name][node.key] = node.component;
                    }
                });
            });
            _.each(this.scoreMetrics, function(m) {
                if (m.metric != 'team_score') {
                    var entityName = titleize(m.entity_key.split("_").join(" "));
                    var scoreName = scoreData[m.metric].scoreName;
                    assetOptions[entityName] = entityName;
                    var entry = {
                        id: m.id,
                        entity_key: entityName,
                        source: m.source,
                        metric: m.metric,
                        value: m.value,
                        icon: m.icon,
                        norm_value: m.norm_value,
                        rank: (m.rank * 100),
                        entity_image: this.assets[m.entity_key].image_url,
                        score: scoreName,
                        weight: scoreData[m.metric].weight,
                        group: scoreData[scoreName][scoreData[m.metric].parent],
                    }
                    data.push(entry);
                }
            }.bind(this));

            this.chartData = data;
            this.assetOptions = assetOptions;
            this.scoreOptions = scoreOptions;
            this.chartDataLoaded = true;
            this.emit("change");
        }
    }
});

module.exports = AnalyticsStore;
