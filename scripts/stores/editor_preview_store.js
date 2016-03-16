/**
 * EditorPreviewStore watches the ComponentEditorStore
 * for events that trigger updates on the preview
 * view container
 */
var Fluxxor = require('fluxxor');
var constants = require('../constants/constants.js');

var EditorPreviewStore = Fluxxor.createStore({
  initialize: function() {
    this.name = "test";
    this.previewComponent = null;
    this.bindActions(
      constants.UPDATE_TITLE, this.onUpdateTitle,
      constants.UPDATE_TYPE, this.onUpdateType,
      constants.PREVIEW_SUCCESS, this.onPreviewSuccess
    )
  },
  /**
   * Trigger chart render on updated chart data
   * from the server
   */
  onPreviewSuccess: function(payload) {
    console.log("success? da faq");
    console.log(payload.component);
    this.previewComponent = payload.component;
    this.emit("change");
  },
  onUpdateType: function(payload) {
    if (this.previewComponent !== null)
      this.previewComponent.view = payload.view;
    this.emit("change");
  },
  onUpdateTitle: function(payload) {
    if (this.previewComponent !== null) {
      // need to cleanup db on naming
      this.previewComponent.title = payload.title;
      this.previewComponent.name = payload.title;
    }
    this.emit("change");
  },
  getState: function() {
    return {
      component: this.previewComponent
    }
  }
});

module.exports = EditorPreviewStore;
