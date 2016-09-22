var Fluxxor = require("fluxxor"),
    constants = require("../constants/constants.js"),
    _ = require('underscore'),
    AssetsStore = Fluxxor.createStore({
        initialize: function() {
            this.assets = [],
            this.assetsMap = [],
            this.assetsLoaded = !1,
            this.loading = !1,
            this.bindActions(constants.LOAD_ASSETS_SUCCESS,
              this.onLoadAssetsSuccess,
              constants.LOAD_ASSETS,
              this.onLoadAssets)
        },
        onLoadAssets: function() {
            this.loading = !0
        },
        onLoadAssetsSuccess: function(s) {
            this.assets = s.assets,
            this.assetsLoaded = !0,
            this.loading = !1,
            _.each(s.assets, function(asset) {
              var metricKeys = {};
              _.each(asset.metrics, function(metric) {
                metricKeys[metric.metric] = metric;
              });
              asset['metric_keys'] = metricKeys;
              this.assetsMap[asset.entity_key] = asset;
            }.bind(this));
            this.emit("change")
        },
        getOwnedAssets: function() {
            var s = [];
            return $.each(this.assets, function(t, e) {
                1 == e.owned && s.push(e)
            }), s
        },
        getAssetByKey: function(entity_key) {
          return this.assetsMap[entity_key];
        },
        getAsset: function(aid) {
          for (var i = 0; i < this.assets.length; i++) {
            if (this.assets[i].id == aid) {
              return this.assets[i];
            }
          }
        },
        getAssetData: function() {
            return {
                assetsLoaded: this.assetsLoaded,
                assets: this.assets
            }
        },
        getState: function() {
            return {
                assets: this.assets,
                assetsLoaded: this.assetsLoaded,
                filteredList: this.assets,
                loading: this.loading
            }
        }
    });
module.exports = AssetsStore;
