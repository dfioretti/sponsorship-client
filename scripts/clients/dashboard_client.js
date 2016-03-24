var API_ROOT = require("../constants/environment.js").API_ROOT;
var dashboard_url = {
        DASH_URL: API_ROOT + "api/v1/apt/dashboards/"
    },
    DashboardClient = {
        getDashboards: function(o) {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: dashboard_url.DASH_URL,
                success: function(a) {
                    o(a)
                },
                error: function(o, a, n) {
                    console.log(a), console.log(n)
                }
            })
        },
        createDashboard: function(o, a) {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: dashboard_url.DASH_URL,
                data: JSON.stringify({
                    dashboard: o
                }),
                success: function(o) {
                    a(o)
                },
                error: function(o, a, n) {
                    console.log(a), console.log(n)
                }
            })
        },
        updateDashboard: function(o, a) {
            $.ajax({
                type: "PUT",
                contentType: "application/json",
                url: dashboard_url.DASH_URL + o.id,
                data: JSON.stringify({
                    dashboard: o
                }),
                success: function(o) {
                    a(o)
                },
                error: function(o, a, n) {
                    console.log(a), console.log(n)
                }
            })
        }
    };
module.exports = DashboardClient;
