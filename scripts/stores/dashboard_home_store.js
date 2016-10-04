var Fluxxor = require("fluxxor"),
    DashboardClient = require("../clients/dashboard_client.js"),
    constants = require("../constants/constants.js"),

DashboardHomeStore = Fluxxor.createStore({
    initialize: function() {
        this.dashboards = [],
        this.dashboardsLoaded = false,
        this.loading = false,
        this.currentDashboard = null,
        this.bindActions(
          constants.DASHBOARD_CREATE_SUCCESS, this.onDashboardCreateSuccess,
          constants.LOAD_DASHBOARDS, this.onLoadDashboards,
          constants.LOAD_DASHBOARDS_SUCCESS, this.onLoadDashboardsSuccess,
          constants.DASHBOARD_UPDATE_SUCCESS, this.onDashboardUpdateSuccess,
          constants.ADD_COMPONENT_TO_DASHBOARD_SUCCESS, this.onDashboardUpdateSuccess,
          constants.CONTEXT_CREATE_SUCCESS, this.onContextCreateSuccess,
          constants.CONTEXT_UPDATE_SUCCESS, this.onDashboardUpdateSuccess
        )
    },
    getDashboard: function(s) {
        for (var t = 0; t < this.dashboards.length; t++)
            if (this.dashboards[t].id.toString() == s.toString()) return this.dashboards[t]
        return null;
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
      var customDashboards = [];
        this.dashboards.forEach(function(s) {
          if (typeof(s) === 'undefined') return;
            "custom" == s.kind && customDashboards.push(s)
        }.bind(this))
        return customDashboards;
    },
    getContextDashboards: function() {
      var contextDashboards = [];
      this.dashboards.forEach(function(d) {
        if ("context" == d.kind) {
          contextDashboards.push(d);
        }
      }.bind(this))
      return contextDashboards;
    },
    fetchDashboards: function() {
        DashboardClient.getDashboards(function(s) {
            this.dashboards = s, this.getCustomDashboards(), this.loaded = !0, this.emit("change") }.bind(this))
    },
    onLoadDashboards: function() {
        this.loading = true;
    },
    onLoadDashboardsSuccess: function(payload) {
      this.dashboards = payload.dashboards;
      this.loading = false;
      this.dashboardsLoaded = true;
      this.emit("change");
    },
    getState: function() {
        return {
            dashboardsLoaded: this.dashboardsLoaded,
            customDashboards: this.getCustomDashboards(),
            loading: this.loading,
            dashboards: this.dashboards,
            assetDashboard: this.getAssetDashboard(),
            portoflioDashboard: this.getPortoflioDashboard(),
            contextDashboards: this.getContextDashboards()
        }
    },
    onDashboardCreateSuccess: function(payload) {
      this.dashboards.push(payload.dashboard);
      this.emit("change");
    },
    onContextCreateSuccess: function(payload) {
      this.dashboards.push(payload.dashboard);
      this.emit("change");
    },
    updateDashboard: function(dashboard) {
      for (var i = 0; i < this.dashboards.length; i++) {
        if (this.dashboards[i].id == dashboard.id) {
          this.dashboards[i] = dashboard;
          break;
        }
      }
    },
    onDashboardUpdateSuccess: function(payload) {
      for (var i = 0; i < this.dashboards.length; i++) {
        if (this.dashboards[i].id == payload.dashboard.id) {
          this.dashboards[i] = payload.dashboard;
          break;
        }
      }
      this.emit("change");
    }
});
module.exports = DashboardHomeStore;
