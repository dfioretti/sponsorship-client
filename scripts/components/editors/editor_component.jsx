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
		if (!this.getFlux().store("ComponentsStore").getState().componentsLoaded)
			return;
		this.loadPreview();
  },
	componentDidUpdate: function() {
		if (!this.getFlux().store("ComponentsStore").getState().componentsLoaded)
			return;

		this.loadPreview();
	},
	loadPreview: function() {
		console.log("load 1");
		if (this.props.params.id) {
			console.log("load 2");
			var editComponent = this.props.flux.store("ComponentsStore").getComponent(this.props.params.id);
			this.getFlux().actions.loadComponentUpdate(editComponent);
			this.getFlux().actions.generatePreviewData();
			this.setState({loaded: true});
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
