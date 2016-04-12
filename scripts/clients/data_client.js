var API_ROOT = require("../constants/environment.js").API_ROOT;
var data_url = { DATA_URL: API_ROOT + "api/v1/data/" };
var Auth = require('../vendor/jtoker.js');
var $ = require('jquery');

var DataClient = {
    getData: function(callback) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            beforeSend: Auth.appendAuthHeaders,
            url: data_url.DATA_URL,
            success: function(data) {
                callback(data);
            },
            error: function(t, a, o) {
                console.log(a);
                console.log(t);
                console.log(o);
            }
        });
    }
};
module.exports = DataClient;
