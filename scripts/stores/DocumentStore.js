var Fluxxor = require('fluxxor');
var constants = require('../constants/constants');
var loki = require('lokijs');
var LokiIndexedAdapter = require('lokijs/src/loki-indexed-adapter');
var uuid = require('node-uuid');
var idbAdapter = new LokiIndexedAdapter('loki-db');
var StatEngine = require('../utils/StatEngine.js');

var DocumentStore = Fluxxor.createStore({
	initialize: function() {
		this.db = new loki('outperform.db', {autoload: true, autoloadCallback: this.dbLoaded, autosave: true, autosaveInterval: 500, adapter: idbAdapter});
		this.dashboardsLoaded = false;
		this.propertiesLoaded = false;
		this.databaseLoaded = false;
		window.documents = this.db;
		this.bindActions(
			constants.LOAD_ASSETS_SUCCESS, this.onLoadAssetsSuccess,
			constants.LOAD_DASHBOARDS_SUCCESS, this.onLoadDashboardsSuccess,
			constants.CONTEXT_UPDATE_SUCCESS, this.onContextUpdateSuccess,
			constants.CALCULATE_FORMULA, this.onCalculateFormula,
			constants.CALCULATE_MODEL, this.onCalculateModel
		)
	},
	dbLoaded: function() {
		console.log("called db loaded");
		this.metrics = this.db.getCollection('metrics');
		if (!this.metrics)
			this.metrics = this.db.addCollection('metrics');
		this.properties = this.db.getCollection('properties');
		if (!this.properties)
			this.properties = this.db.addCollection('properties');
		this.contexts = this.db.getCollection('contexts');
		if (!this.contexts)
			this.contexts = this.db.addCollection('contexts', { unique: ['cid'], autoupdate: true});
		this.models = this.db.getCollection('models');
		if (!this.models) 
			this.models = this.db.addCollection('models', { unique: ["mid"], autoupdate: true });
		this.formulas = this.db.getCollection('formulas');
		if (!this.formulas)
			this.formulas = this.db.addCollection('formulas', { unique: ["fid"], autoupdate: true });
		this.formulaCalculations = this.db.getCollection('formulaCalculations');
		if (!this.formulaCalculations)
			this.formulaCalculations = this.db.addCollection('formulaCalculations');
		this.modelCalculations = this.db.getCollection('modelCalculations');
		if (!this.modelCalculations)
			this.modelCalculations = this.db.addCollection('modelCalculations');

		this.databaseLoaded = true;
		this.propertiesLoaded = true;
		this.emit("change");
	},
	onCalculateModel: function(payload) {
		console.log("doing on caclucalte model");
		var model = this.getScore(payload.cid);
		var context = this.getContext(payload.cid);
		var stats = new StatEngine();
		var calc = stats.calculateModel(model, this.formulaCalculations, this.modelCalculations);
//		var calc = stats.calculateModel(this.formulas, this.metrics, context.scopeProperties, );
		console.log("caluclat emodel", model);
	},
	onCalculateFormula: function(payload) {
		var formula = this.getFormula(payload.fid);
		var context = this.getContext(formula.cid);
		var stats = new StatEngine();
		var calc = stats.calculateFormula(formula, context.scopeProperties, this.metrics);
		if (this.formulaCalculations.find({fid: payload.fid}).length == 0) {
			var fc = {
				fcid: uuid.v4(),
				data: calc.data,
				stats: calc.stats,
				result: calc.result,
				fid: payload.fid
			}
			this.formulaCalculations.insert(fc);
		} else {
			var fc = this.formulaCalculations.find({fid: payload.fid})[0];
			fc.data = calc.data;
			fc.stats = calc.stats;
			fc.result = calc.result;
		}
		this.saveDatabase();
	},
	onLoadDashboardsSuccess: function(payload) {
		this.dashboardsLoaded = true;
		this.emit('change');
		return;
		if (this.dashboardsLoaded) return;
		var result = this.contexts.find();
		if (result.length > 0) {
			this.dashboardsLoaded = true;
			this.emit("change");
			return;
		}
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
		this.propertiesLoaded = true;
		this.emit('change');
		return;
		if (this.propertiesLoaded) return;
		var result = this.metrics.find();
		if (result.length > 0) {
			this.propertiesLoaded = true;
			this.emit("change");
			return;
		}
		//this.metrics.clear();
		//this.properties.clear();
		payload.assets.map(function(asset) {
			asset.metrics.map(function(metric) {
				this.metrics.insert(metric);
			}.bind(this));
			this.properties.insert(asset);
		}.bind(this));
		this.propertiesLoaded = true;
		this.emit("change");
	},
	getContext: function(cid) {
		return this.contexts.find({cid: cid})[0];
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
	getScore: function(cid) {
		var result = this.models.find({cid: cid});
		if (result.length == 0) {
			return null;
		}
		return result[0];
	},
	getFormula: function(fid) {
		return this.formulas.find({fid: fid})[0];
		console.log('calling get formula', query);
		var results = this.formulas.findOne(query);
		console.log('results', results);
		return results;
	},
	getMetricsCollection: function() {
		return this.metrics;
	},
	saveDatabase: function() {
		this.db.saveDatabase();
	},
	updateContext: function(context) {
		console.log("update contex", context);
		this.contexts.update(context);
	},
	getState: function() {
		return {
			db: this.db,
			formulasColl: this.formulas,
			databaseLoaded: this.databaseLoaded, 
			metricsColl: this.metrics,
			modelsColl: this.models,
			formulaCalculations: this.formulaCalculations,
			modelCalculations: this.modelCalculations,
			propertiesColl: this.properties,
			contextCollection: this.contexts,
			dashboardsLoaded: this.dashboardsLoaded,
			propertiesLoaded: this.propertiesLoaded
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
