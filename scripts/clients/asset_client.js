var API_ROOT = require("../constants/environment.js").API_ROOT;
var asset_url = { ASSET_URL: API_ROOT + "api/v1/assets/" };

var AssetClient = {
  getAssets: function(callback) {
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: asset_url.ASSET_URL,
      success: function(data) {
        callback(data);
      },
      error: function(s, t, e) {
        console.log(t);
        console.log(e);
      }
    });
  },
  getAsset: function(asset_id, callback) {
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: asset_url.ASSET_URL + asset_id,
      success: function(data) {
        callback(data);
      },
      error: function(o, c, n) {
        console.log(c);
        console.log(n);
      }
    });
  }
};
module.exports = AssetClient;
