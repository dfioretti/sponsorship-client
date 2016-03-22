var asset_url = {
        ASSET_URL: "http://localhost:4000/api/v1/assets/"
    },
    AssetClient = {
        getAssets: function(s) {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: asset_url.ASSET_URL,
                success: function(t) {
                    s(t)
                },
                error: function(s, t, e) {
                    console.log(t), console.log(e)
                }
            })
        }
    };
module.exports = AssetClient;