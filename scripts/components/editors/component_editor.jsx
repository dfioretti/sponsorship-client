var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var DynamicComponent = require('../common/DynamicComponent.jsx');
//var EditorPreview = require('./editor_preview.jsx');
var EditorPane = require('./editor_pane.jsx');
var EditorSubNav = require('./editor_subnav.jsx');
var EditorData = require('./editor_data.jsx');

var EditorPreview = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("EditorPreviewStore")],

  getStateFromFlux: function() {
    return this.getFlux().store("EditorPreviewStore").getState();
  },
  render: function() {
    var component = this.getStateFromFlux().component;
    if (component == null) {
      component = this.getFlux().store("ComponentEditorStore").getPreview();
    }

    return (
      <div className="editor-preview">
        <div className="preview-heading">
          Component Preview
        </div>
        <div className="preview-component">
					<DynamicComponent component={component}  />
        </div>
      </div>
    );
  }
});


var ComponentEditor = React.createClass({
  mixins: [FluxMixin],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("ComponentEditorStore").getState();
  },

  render: function() {
    /* TODO: clean up these styles */
    var component = this.getFlux().store("ComponentEditorStore").getPreview();
    return (
      <div className="editor-box">
        <EditorSubNav />
        <div className="editor-container">
            <div className="row editor-2-col">
              <div className="col-md-4 editor-pane">
                <EditorPane />
              </div>
              <div className="col-md-5 editor-views">
                <EditorPreview component={component} />
                <EditorData />
              </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ComponentEditor;
