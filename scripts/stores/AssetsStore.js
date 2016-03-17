var Fluxxor = require('fluxxor');
var constants = require('../constants/constants.js');

var AssetsStore = Fluxxor.createStore({
	initialize: function() {
		this.assets = [];
		this.assetsLoaded = false;
		this.loading = false;
		this.bindActions(
			constants.LOAD_ASSETS_SUCCESS, this.onLoadAssetsSuccess,
			constants.LOAD_ASSETS, this.onLoadAssets
		)
	},
	onLoadAssets: function() {
		this.loading = true;
	},
	onLoadAssetsSuccess: function(payload) {
		console.log("here");
		this.assets = payload.assets;
		this.assetsLoaded = true;
		this.loading = false;
		this.emit("change");
	},
	getOwnedAssets: function () {
		var ownedAssets = [];
		$.each(this.assets, function (i, a) {
			if (a.owned == true) {
				ownedAssets.push(a);
			}
		});
		return ownedAssets;
	},
	getState: function() {
		return {
			assets: this.assets,
			assetsLoaded: this.assetsLoaded,
			loading: this.loading
		};
	}
});

module.exports = AssetsStore;
