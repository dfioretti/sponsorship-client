var Fluxxor = require("fluxxor"),
    constants = require("../constants/constants.js"),
    AssetsStore = Fluxxor.createStore({
        initialize: function() {
            this.assets = [],
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
            this.assets = s.assets, this.assetsLoaded = !0, this.loading = !1, this.emit("change")
        },
        getOwnedAssets: function() {
            var s = [];
            return $.each(this.assets, function(t, e) {
                1 == e.owned && s.push(e)
            }), s
        },
        getAsset: function(aid) {
          for (var i = 0; i < this.assets.length; i++) {
            console.log("check", aid, this.assets[i].id);
            if (this.assets[i].id == aid) {
              return this.assets[i];
            }
          }
        },
        getState: function() {
            return {
                assets: this.assets,
                assetsLoaded: this.assetsLoaded,
                loading: this.loading
            }
        }
    });
module.exports = AssetsStore;
