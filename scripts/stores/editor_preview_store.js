var Fluxxor = require("fluxxor"),
    constants = require("../constants/constants.js"),
    EditorPreviewStore = Fluxxor.createStore({
        initialize: function() {
            this.name = "test", this.previewComponent = null, this.bindActions(constants.UPDATE_TITLE, this.onUpdateTitle, constants.UPDATE_TYPE, this.onUpdateType, constants.PREVIEW_SUCCESS, this.onPreviewSuccess)
        },
        onPreviewSuccess: function(e) {
            console.log("success? da faq"), console.log(e.component), this.previewComponent = e.component, this.emit("change")
        },
        onUpdateType: function(e) {
            null !== this.previewComponent && (this.previewComponent.view = e.view), this.emit("change")
        },
        onUpdateTitle: function(e) {
            null !== this.previewComponent && (this.previewComponent.title = e.title, this.previewComponent.name = e.title), this.emit("change")
        },
        getState: function() {
            return {
                component: this.previewComponent
            }
        }
    });
module.exports = EditorPreviewStore;