var Fluxxor = require('fluxxor');
var constants = require('../constants/constants');
var loki = require('lokijs');
var LokiIndexedAdapter = require('lokijs/src/loki-indexed-adapter');
//import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter';
var uuid = require('node-uuid');
var idbAdapter = new LokiIndexedAdapter('loki-db');

var DocumentStore = Fluxxor.createStore({
	initialize: function() {
		this.db = new loki('outperform.db', {autosave: true, autosaveInterval: 10000, adapter: idbAdapter});
		this.metrics = this.db.addCollection('metrics');
		this.properties = this.db.addCollection('properties');
		this.contexts = this.db.addCollection('contexts');
		this.models = this.db.addCollection('models');
		this.formulas = this.db.addCollection('formulas');
		this.dashboardsLoaded = false;
		this.propertiesLoaded = false;
		this.bindActions(
			constants.LOAD_ASSETS_SUCCESS, this.onLoadAssetsSuccess,
			constants.LOAD_DASHBOARDS_SUCCESS, this.onLoadDashboardsSuccess,
			constants.CONTEXT_UPDATE_SUCCESS, this.onContextUpdateSuccess
		)
	},
	onLoadDashboardsSuccess: function(payload) {
		return;
		if (this.dashboardsLoaded) return;
		this.models.clear();
		this.formulas.clear();
		this.contexts.clear();
		this.contexts.insert(payload.dashboards);
		payload.dashboards.map(function(dashboard) {
			if (dashboard.state.formulas) {
				dashboard.state.formulas.map(function(formula) {
					this.formulas.insert({ name: formula.name, uuid: formula.uuid, formula: formula.formula});
				}.bind(this));
				//this.formulas.insert(dashboard.state.formulas);
			}
			if (dashboard.state.models) {
				this.models.insert(dashboard.state.models);
			}
		}.bind(this));
		this.dashboardsLoaded = true;
		this.emit("change");
	},
	onContextUpdateSuccess: function(payload) {
		return;
		this.contexts.update(payload.dashboard);
		this.emit("change");
	},
	onLoadAssetsSuccess: function(payload) {
		return;
		if (this.propertiesLoaded) return;
		this.metrics.clear();
		this.properties.clear();
		payload.assets.map(function(asset) {
			asset.metrics.map(function(metric) {
				this.metrics.insert(metric);
			}.bind(this));
			this.properties.insert(asset);
		}.bind(this));
		this.propertiesLoaded = true;
		this.emit("change");
	},
	getProperty: function(query) {
		var results = this.properties.findOne(query);
		return results;
	},
	getProperties: function(query) {
		var results = this.properties.find(query);
		return results;
	},
	getMetrics: function(query) {
		var results = this.metrics.find(query);
		return results;
	},
	getMetric: function(query) {
		var results = this.metrics.findOne(query);
		return results;
	},
	getFormulas: function(query) {
		var results = this.formulas.find(query);
		return results;
	},
	getFormula: function(query) {
		console.log('calling get formula', query);
		var results = this.formulas.findOne(query);
		console.log('results', results);
		return results;
	},
	getMetricsCollection: function() {
		return this.metrics;
	},
	getStateCollections: function() {
		return {
			metricsCollection: this.metricsCollection,
			contextsCollection: this.contexts
		}
	},
	metricsLoaded: function() {
		return this.propertiesLoaded;
	},
	getCollection: function(collection) {
		var collection = null;
		switch (collection) {
			case 'metrics':
				collection = this.metrics;
				break;
		}
		return collection;
	}
});
window.DocumentStore = DocumentStore;
module.exports = DocumentStore;
