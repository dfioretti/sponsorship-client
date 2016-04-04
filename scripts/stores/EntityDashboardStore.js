var Fluxxor = require('fluxxor'),
		constants = require('../constants/constants.js');


EntityDashboardStore = Fluxxor.createStore({
	initialize: function() {
		this.mode = null;
		this.dashboard = null;
		this.asset = null;
		this.tweets = null;
		this.components = null;
		this.loadingTwitter = false;
		this.bindActions(
			constants.ASSET_LOAD_SUCCESS, this.onAssetLoadSuccess,
			constants.SET_ENTITY_DASHBOARD_MODE, this.onSetEntityDashboardMode,
			constants.DASHBOARD_LOAD_SUCCESS, this.onDashboardLoadSuccess,
			constants.LOAD_COMPONENTS_SUCCESS, this.onComponentsLoadSuccess,
			constants.RESET_DASHBOARD_ASSET, this.onResetDashboardAsset,
			constants.ASSET_LOAD, this.onAssetLoad,
			constants.LOAD_DASHBOARD, this.onLoadDashboard,
			constants.TWITTER_LOAD_SUCCESS, this.onTwitterLoadSuccess,
			constants.TWITTER_LOAD, this.onTwitterLoad
		)
	},
	onTwitterLoad: function(payload) {
		this.loadingTwitter = true;
		this.emit("change");
	},
	onLoadDashboard: function(payload) {
		// flux
	},
	onAssetLoad: function(payload) {
		// appease flux
	},
	onTwitterLoadSuccess: function(payload) {
		this.tweets = payload.tweets;
		this.loadingTwitter = false;
		this.emit('change');
	},
	onResetDashboardAsset: function(payload) {
		this.asset = payload.asset;
		this.emit("change");
	},
	onAssetLoadSuccess: function(payload) {
		this.asset = payload.asset;
		this.emit("change");
	},
	onDashboardLoadSuccess: function(payload) {
		this.dashboard = payload.dashboard;
		this.emit("change");
	},
	onComponentsLoadSuccess: function(payload) {
		this.components = payload.components;
		this.emit("change");
	},
	onSetEntityDashboardMode: function(payload) {
		this.mode = payload.mode;
		this.asset = null;
		this.dashboard = null;
		this.components = null;
		this.loadingTwitter = false;
		this.tweets = null;
		this.emit("change");
	},
	getState: function() {
		return {
			mode: this.mode,
			asset: this.asset,
			dashboard: this.dashboard,
			components: this.components,
			loadingTwitter: this.loadingTwitter,
			tweets: this.tweets
		}
	}
});

module.exports = EntityDashboardStore;
