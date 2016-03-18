var Fluxxor = require("fluxxor"),
    DataClient = require("../clients/data_client.js"),
    ComponentClient = require("../clients/component_client"),
    constants = require("../constants/constants.js"),


ComponentsStore = Fluxxor.createStore({
  initialize: function() {
    this.components = {},
    this.componentsLoaded = false,
    this.loading = false;
    this.bindActions(
      constants.LOAD_COMPONETS, this.onLoadComponents,
      constants.LOAD_COMPONENTS_SUCCESS, this.onLoadComponentsSuccess,
      constants.SAVE_SUCCESS, this.updateComponent,
      constants.UPDATE_SUCCESS, this.updateComponent
    )
  },
  onLoadComponents: function() {
    this.loading = true;
  },
  onLoadComponentsSuccess: function(payload) {
    this.loading = false;
    payload.components.forEach(function(c) {
      this.components[c.id] = c;
    }.bind(this));
    this.componentsLoaded = true;
    this.emit("change");
  },
  updateComponent: function(payload) {
    this.components[payload.component.id] = payload.component;
    this.emit("change");
  },
  getState: function() {
    return {
      componentsLoaded: this.componentsLoaded,
      loading: this.loading
    }
  },
  getComponent: function(t) {
    return this.components[t];
  },
  getComponents: function() {
    return this.components;
  }
});
module.exports = ComponentsStore;
