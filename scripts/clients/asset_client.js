var asset_url = {
  ASSET_URL: "http://localhost:4000/api/v1/assets/",
};

var AssetClient = {
  getAssets: function(successCallback) {
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: asset_url.ASSET_URL,
      success: function(data) {
        successCallback(data);
      },
      error: function(xhr, status, error) {
        console.log(status);
        console.log(error);
      }
    });
  }
};

module.exports = AssetClient;
