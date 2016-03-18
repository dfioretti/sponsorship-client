var Fluxxor = require("fluxxor"),
    DashboardClient = require("../clients/dashboard_client.js"),
    constants = require("../constants/constants.js"),
    DashboardHomeStore = Fluxxor.createStore({
        initialize: function() {
            this.dashboards = [], this.customDashboards = [], this.loaded = !1, this.currentDashboard = null, this.bindActions(constants.DASHBOARD_CREATE_SUCCESS, this.onDashboardCreated, constants.LOAD_DASHBOARDS, this.onLoadDashboards), this.fetchDashboards()
        },
        getDashboard: function(s) {
            for (var t = 0; t < this.dashboards.length; t++)
                if (this.dashboards[t].id.toString() == s.toString()) return this.dashboards[t]
        },
        getPortoflioDashboard: function() {
            for (var s = 0; s < this.dashboards.length; s++)
                if ("portoflio" === this.dashboards[s].kind) return this.dashboards[s]
        },
        getAssetDashboard: function() {
          for (var s = 0; s < this.dashboards.length; s++)
              if ("asset" === this.dashboards[s].kind) return this.dashboards[s]
        },
        getCustomDashboards: function() {
            this.customDashboards = [], this.dashboards.forEach(function(s) {
                "custom" == s.kind && this.customDashboards.push(s)
            }.bind(this)), this.emit("change")
        },
        fetchDashboards: function() {
            DashboardClient.getDashboards(function(s) {
                this.dashboards = s, this.getCustomDashboards(), this.loaded = !0, this.emit("change")
            }.bind(this))
        },
        onLoadDashboards: function() {
            this.fetchDashboards(), this.emit("change")
        },
        getState: function() {
            return {
                dashboardLoaded: this.loaded,
                customDashboards: this.customDashboards
            }
        },
        onDashboardCreated: function() {
            this.fetchDashboards(), this.emit("change")
        }
    });
module.exports = DashboardHomeStore;
