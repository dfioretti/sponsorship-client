var Fluxxor = require("fluxxor"),
    DataClient = require("../clients/data_client.js"),
    ComponentClient = require("../clients/component_client"),
    constants = require("../constants/constants.js"),
    ComponentsStore = Fluxxor.createStore({
        initialize: function() {
            this.components = {}, this.loaded = !1, this.bindActions(constants.SAVE_SUCCESS, this.loadComponents, constants.UPDATE_SUCCESS, this.loadComponents), this.loadComponents()
        },
        loadComponents: function() {
            this.loaded = !1, ComponentClient.getComponents(function(t) {
                t.forEach(function(t) {
                    this.components[t.id] = t
                }.bind(this)), this.loaded = !0, this.emit("change")
            }.bind(this)), this.emit("change")
        },
        getState: function() {
            return {
                componentsLoaded: this.loaded
            }
        },
        getComponent: function(t) {
            return this.components[t]
        },
        getComponents: function() {
            return this.components
        }
    });
module.exports = ComponentsStore;