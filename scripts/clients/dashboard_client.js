var API_ROOT = require("../constants/environment.js").API_ROOT;
var dashboard_url = { DASH_URL: API_ROOT + "api/v1/dashboards/" };
var Auth = require('../vendor/jtoker.js');
var $ = require('jquery');

var DashboardClient = {
    getDashboards: function(callback) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: dashboard_url.DASH_URL,
            beforeSend: Auth.appendAuthHeaders,
            success: function(data) {
                callback(data);
            },
            error: function(o, a, n) {
                console.log(o);
                console.log(a);
                console.log(n);
            }
        })
    },
    getDashboard: function(kind, callback) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: dashboard_url.DASH_URL + '?kind=' + kind,
            beforeSend: Auth.appendAuthHeaders,
            success: function(data) {
                callback(data);
            },
            error: function(o, a, n) {
                console.log(o);
                console.log(a);
                console.log(n);
            }
        })
    },
    createDashboard: function(dashboard, callback) {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: dashboard_url.DASH_URL,
            beforeSend: Auth.appendAuthHeaders,
            data: JSON.stringify({
                dashboard: dashboard
            }),
            success: function(data) {
                callback(data);
            },
            error: function(o, a, n) {
                console.log(o);
                console.log(a);
                console.log(n);
            }
        })
    },
    updateDashboard: function(dashboard, callback) {
        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: dashboard_url.DASH_URL + dashboard.id,
            beforeSend: Auth.appendAuthHeaders,
            data: JSON.stringify({
                dashboard: dashboard
            }),
            success: function(data) {
                callback(data);
            },
            error: function(o, a, n) {
                console.log(o);
                console.log(a);
                console.log(n);
            }
        })
    }
};
module.exports = DashboardClient;
