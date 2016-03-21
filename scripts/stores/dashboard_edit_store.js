var Fluxxor = require('fluxxor');
var ComponentClient = require('../clients/component_client.js');
var constants = require('../constants/constants.js');

var DashboardEditStore = Fluxxor.createStore({
    initialize: function() {
        //this.availableComponents = [];
        this.fetchComponents();
        this.dashboardName = "";
        this.heading = "Create New Dashboard";
        this.selectedComponents = [];
        this.dashboard = null;
        this.id = null;
        this.bindActions(
            constants.UPDATE_DASHBOARD_NAME, this.onUpdateName,
            constants.DASHBOARD_ITEM_ADDED, this.onItemAdded,
            constants.DASHBOARD_ITEM_REMOVED, this.onItemRemoved,
            constants.DASHBOARD_CREATE, this.onDashboardCreate,
            constants.DASHBOARD_CREATE_FAIL, this.onDashboardCreateFail,
            constants.DASHBOARD_CREATE_SUCCESS, this.onDashboardCreateSuccess,
            constants.LOAD_EDITOR_DASHBOARD, this.onLoadEditorDashboard
        );
    },

    onLoadEditorDashboard: function(payload) {
        this.selectedComponents = [];
        if (payload.dashboard_id === null) {
            this.dashboardName = '';
            this.heading = "Create New Dashboard"
            this.id = null;
        } else {
            this.dashboard = flux.store("DashboardHomeStore").getDashboard(payload.dashboard_id);
            this.dashboardName = this.dashboard.name;
            this.heading = "Edit Dashboard";
            this.id = payload.dashboard_id;
            $.map(this.dashboard.state, function(v, i) {
                if (i.indexOf('custom_component') > -1) {
                    var cid = i.split("_").pop();
                    this.selectedComponents.push(cid);
                }
            }.bind(this));
        }
    },
    isComponentSelected: function(component_id) {
        return (this.selectedComponents.indexOf(component_id) !== -1);
    },
    onItemAdded: function(payload) {
        this.selectedComponents.push(payload.component_id);
        this.emit("change");
    },
    onItemRemoved: function(payload) {
        this.selectedComponents.splice(this.selectedComponents.indexOf(payload.component_id), 1);
        this.emit("change");
    },
    onDashboardCreate: function() {},
    onDashboardCreateSuccess: function() {
        this.dashboardName = "";
        this.selectedComponents = [];
        this.emit("change");
    },
    onDashboardCreateFail: function() {
        console.log("failed dashboard create");
    },
    onDashboardCreateSuccess: function() {
        this.emit("change");
    },
    getObject: function() {
        return {
            company_id: 9999, // should clean up db
            state: this.getDashboardState(),
            id: this.id,
            kind: "custom",
            name: this.dashboardName,
            item_id: -1
        };
    },
    getDashboardState: function() {
        var i = 0;
        state = {};
        this.selectedComponents.forEach(function(c) {
            state["custom_component_" + c] = {
                index: i,
                toggle: "on"
            }
            i++;
        });
        return state;
    },
    onUpdateName: function(payload) {
        this.dashboardName = payload.name;
        this.emit("change");
    },
    fetchComponents: function() {
      return null;
        ComponentClient.getComponents(function(data) {
            this.availableComponents = data;
            this.emit("change");
        }.bind(this));
    },
    getState: function() {
        return {
            //availableComponents: this.availableComponents,
            dashboardName: this.dashboardName,
            selectedComponents: this.selectedComponents,
            heading: this.heading,
            id: this.id
        };
    }
});
module.exports = DashboardEditStore;
