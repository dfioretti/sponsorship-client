var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AppSidebar = require('../sidebar/app_sidebar.jsx');
var ComponentEditor = require('./component_editor.jsx');

var EditorComponent = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ComponentsStore")],
  getInitialState: function() {
    return { loaded: false };
  },
	getStateFromFlux: function() {
		return this.getFlux().store("ComponentsStore").getState();
	},
  componentDidMount: function() {
		if (!this.getFlux().store("ComponentsStore").getState().componentsLoaded
				&& !this.getFlux().store("ComponentsStore").getState().loading) {
			this.getFlux().actions.loadComponents();
			return;
		}
		this.loadPreview();
  },
	componentDidUpdate: function() {
		if (!this.getFlux().store("ComponentsStore").getState().componentsLoaded
				&& !this.getFlux().store("ComponentsStore").getState().loading) {
			this.getFlux().actions.loadComponents();
			return;
		}

		this.loadPreview();
	},
	loadPreview: function() {
		if (this.getFlux().store("ComponentsStore").getState().previewLoaded === true) return;
		if (this.props.params.id) {
			console.log("load 2");
			var editComponent = this.getFlux().store("ComponentsStore").getComponent(this.props.params.id);
			this.getFlux().actions.loadComponentUpdate(editComponent);
			this.getFlux().actions.generatePreviewData();
		}
	},
  render: function() {
		if (!this.getFlux().store("ComponentsStore").getState().componentsLoaded)
			return ( <div className="editor"><AppSidebar context="component" /></div>);

    return (
      <div className="editor">
        <AppSidebar context="component" />
        <ComponentEditor />
      </div>
    );
  }
});
module.exports = EditorComponent;
