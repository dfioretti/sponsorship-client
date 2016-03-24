var API_ROOT = require("../constants/environment.js").API_ROOT;
var data_url = {
        DATA_URL: API_ROOT + "api/v1/apt/data/"
    },
    DataClient = {
        getData: function(t) {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: data_url.DATA_URL,
                success: function(a) {
                    t(a)
                },
                error: function(t, a, o) {
                    console.log(a), console.log(o)
                }
            })
        }
    };
module.exports = DataClient;
