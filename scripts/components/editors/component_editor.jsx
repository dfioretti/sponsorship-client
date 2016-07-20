var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
//		Toolbar = require('material-ui').Toolbar,
		SaveIcon = require('react-icons/lib/md/save'),
		EditorToolbar = require('../sidebar/EditorToolbar.jsx'),
		AddIcon = require('react-icons/lib/md/add-circle-outline'),
		ToolbarTitle = require('material-ui').ToolbarTitle,
		RaisedButton = require('material-ui').RaisedButton,
		FlatButton = require('material-ui').FlatButton,
		ToolbarGroup = require('material-ui').ToolbarGroup,
		ToolbarSeparator = require('material-ui').ToolbarSeparator,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var DynamicComponent = require('../common/DynamicComponent.jsx');
//var EditorPreview = require('./editor_preview.jsx');
var EditorPane = require('./editor_pane.jsx');
var EditorSubNav = require('./editor_subnav.jsx');
var EditorData = require('./editor_data.jsx');

var EditorPreview = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("EditorPreviewStore", "ComponentEditorStore")],

  getStateFromFlux: function() {
    return this.getFlux().store("EditorPreviewStore").getState();
  },
  render: function() {
    var component = this.state.component;
		if (false && component === null) {
			return (
				<div className='editor-preview'>
					<div className="preview-heading">
						Component Preview
					</div>
				</div>
			);
		}
    return (
      <div className="editor-preview">
        <div className="preview-heading">
          Component Preview
        </div>
        <div style={{display: 'flex', justifyContent: 'center' }} className="preview-component">
					<DynamicComponent component={component}  />
        </div>
      </div>
    );
  }
});


var ComponentEditor = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("EditorPreviewStore")],

	handleSaveClick: function() {
		if (this.getStateFromFlux().id !== null) {
			this.getFlux().actions.updateComponent(this.getStateFromFlux().id);
		} else {
			this.getFlux().actions.saveComponent();
		}
	},
	handleNewClick: function() {
		this.getFlux().actions.resetComponentEditor();
	},
  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("ComponentEditorStore").getState();
  },
//        <EditorSubNav {...this.props} />
//						<ToolbarTitle style={{fontFamily: 'Avenir-Book' }}text="Actions" />
//						<ToolbarSeparator />
//<ToolbarTitle text="Menu" />

  render: function() {
    /* TODO: clean up these styles */
    var component = this.getFlux().store("EditorPreviewStore").getState().component;
    return (
      <div className="editor-box">
				<EditorToolbar handleNewClick={this.handleNewClick} handleSaveClick={this.handleSaveClick} />
        <div className="editor-container">
            <div className="row editor-2-col">
              <div className="col-md-4 editor-pane">
                <EditorPane />
              </div>
              <div className="col-md-6 editor-views">
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
