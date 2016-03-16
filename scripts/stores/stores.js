/**
 * Holds all stores added to Fluxxor
 */

var ComponentEditorStore = require('./component_editor_store.js');
var ComponentsStore = require('./components_store.js');
var EditorPreviewStore = require('./editor_preview_store.js');
var DashboardEditStore = require('./dashboard_edit_store.js');
var DashboardHomeStore = require('./dashboard_home_store.js');
var ScoreEditorStore = require('./score_editor_store.js');

var stores = {
  ComponentEditorStore: new ComponentEditorStore(),
  ComponentsStore: new ComponentsStore(),
  EditorPreviewStore: new EditorPreviewStore(),
  DashboardEditStore: new DashboardEditStore(),
  DashboardHomeStore: new DashboardHomeStore(),
  ScoreEditorStore: new ScoreEditorStore()
};

module.exports = stores;

/*
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

window.FluxMixin = FluxMixin;
window.StoreWatchMixin = StoreWatchMixin;
window.stores = stores;
*/
