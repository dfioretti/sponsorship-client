var Fluxxor = require('fluxxor');
var interactions = require('../constants/interactions.js');
var _ = require('underscore');

var ContextStore = Fluxxor.createStore({
	initialize: function() {
		this.contexts = {};
		this.views = [];
		this.currentContext = null;
		this.layout = {};
		this.bindActions(
			interactions.CREATE_CONTEXT, this.onCreateContext,
			interactions.UPDATE_CONTEXT_VIEW, this.onUpdateContextView
		)
	},
	onUpdateContextView: function(payload) {
		this.views.push(payload);
		this.emit("change");
	},
	onCreateContext: function(payload) {
		var properties = [];
		_.each(payload.properties, function(prop) {
			properties.push(prop.id);
		});
		//this.contexts.push( { name: payload.name, properties: properties } );
		this.contexts[payload.name] = properties;
		this.currentContext = payload.name;
		this.emit("change");
	},
	getState: function() {
		var contextName = null;
		var currentProperties = null;
		if (!this.currentContext == null) {
			contextProperties = this.contexts[this.currentContext],
			contextName = this.currentContext;
		}

		return {
			contextName: this.currentContext,
			contextProperties: this.contexts[this.currentContext],
			layout: this.layout,
			views: this.views
		}
	}
});

module.exports = ContextStore;
