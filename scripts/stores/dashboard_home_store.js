var Fluxxor = require("fluxxor"),
    DashboardClient = require("../clients/dashboard_client.js"),
    constants = require("../constants/constants.js"),

DashboardHomeStore = Fluxxor.createStore({
    initialize: function() {
        this.dashboards = [],
        this.customDashboards = [],
        this.dashboardsLoaded = false,
        this.loading = false,
        this.currentDashboard = null,
        this.bindActions(
          constants.DASHBOARD_CREATE_SUCCESS, this.onDashboardCreateSuccess,
          constants.LOAD_DASHBOARDS, this.onLoadDashboards,
          constants.LOAD_DASHBOARDS_SUCCESS, this.onLoadDashboardsSuccess,
          constants.DASHBOARD_UPDATE_SUCCESS, this.onDashboardUpdateSuccess
        )
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
    setCustomDashboard: function() {
        this.customDashboards = [], this.dashboards.forEach(function(s) {
            "custom" == s.kind && this.customDashboards.push(s)
        }.bind(this))
    },
    fetchDashboards: function() {
        DashboardClient.getDashboards(function(s) {
            this.dashboards = s, this.getCustomDashboards(), this.loaded = !0, this.emit("change")
        }.bind(this))
    },
    onLoadDashboards: function() {
        this.loading = true;
    },
    onLoadDashboardsSuccess: function(payload) {
      this.dashboards = payload.dashboards;
      this.loading = false;
      this.dashboardsLoaded = true;
      this.setCustomDashboard();
      this.emit("change");
    },
    getState: function() {
        return {
            dashboardsLoaded: this.dashboardsLoaded,
            customDashboards: this.customDashboards,
            loading: this.loading
        }
    },
    onDashboardCreateSuccess: function(payload) {
      this.dashboards.push(payload.dashboard);
      this.setCustomDashboard();
      this.emit("change");
    },
    onDashboardUpdateSuccess: function(payload) {
      for (var i = 0; i < this.dashboards.length; i++) {
        if (this.dashboards[i].id == payload.dashboard.id) {
          this.dashboards[i] = payload;
          break;
        }
      }
      this.setCustomDashboard();
      this.emit("change");
    }
});
module.exports = DashboardHomeStore;
