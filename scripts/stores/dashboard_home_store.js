var Fluxxor = require('fluxxor');
var DashboardClient = require('../clients/dashboard_client.js');
var constants = require('../constants/constants.js')

var DashboardHomeStore = Fluxxor.createStore({
  initialize: function() {
    this.dashboards = [];
    this.customDashboards = [];
    this.loaded = false;
    this.currentDashboard = null;
    this.bindActions(
      constants.DASHBOARD_CREATE_SUCCESS, this.onDashboardCreated,
      constants.LOAD_DASHBOARDS, this.onLoadDashboards
      //constants.SAVE_SCORE, this.onLoadDashboards,
      //constants.UPDATE_SUCCESS, this.onLoadDashboards
    ),
    this.fetchDashboards();
  },

  /**
   * Why the fuck are things strings sometimes and
   * ints other times?
   */
  getDashboard: function(did) {
    for (var i = 0; i < this.dashboards.length; i++) {
      if (this.dashboards[i].id.toString() == did.toString()) {
        return this.dashboards[i];
      }
    }
  },
  getPortoflioDashboard: function () {
    for (var i = 0; i < this.dashboards.length; i++) {
      if (this.dashboards[i].kind === 'portoflio') {
        return this.dashboards[i];
      }
    }
  },
  getCustomDashboards: function() {
    this.customDashboards = [];
    this.dashboards.forEach(function(d){
      if (d.kind == 'custom') {
        this.customDashboards.push(d);
      }
    }.bind(this));
    this.emit("change");
  },
  fetchDashboards: function() {
    DashboardClient.getDashboards(function(data) {
      this.dashboards = data;
      this.getCustomDashboards();
      this.loaded = true;
      this.emit("change");
    }.bind(this));
  },
  onLoadDashboards: function() {
    this.fetchDashboards();
    this.emit("change");
  },
  getState: function() {
    return {
      dashboardLoaded: this.loaded,
      customDashboards: this.customDashboards
    }
  },
  onDashboardCreated: function() {
    this.fetchDashboards();
    this.emit("change");
  },

});
module.exports = DashboardHomeStore;
