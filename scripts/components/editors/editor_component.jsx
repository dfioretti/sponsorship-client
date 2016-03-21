var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AppSidebar = require('../sidebar/app_sidebar.jsx');
var ComponentEditor = require('./component_editor.jsx');

var EditorComponent = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ComponentsStore")],
	componentWillMount: function() {
		this.dataLoaded();
	},
  getInitialState: function() {
    return { loaded: false };
  },
	getStateFromFlux: function() {
		return this.getFlux().store("ComponentsStore").getState();
	},
  componentDidMount: function() {
		if (this.dataLoaded())
			this.loadPreview();
  },
	dataLoaded: function() {
		if (this.getFlux().store("ComponentsStore").getState().componentsLoaded) {
			return true;
		} else {
			if (!this.getFlux().store("ComponentsStore").getState().loading) {
				this.getFlux().actions.loadComponents();
			}
		}
		return false;
		console.log(this.getFlux().store("ComponentsStore").getState());
		if (this.getFlux().store("ComponentsStore").getState().componentsLoaded
					&& !this.getFlux().store("ComponentsStore").getState().loading) {
					return false;
				}
		return true;
	},
	componentDidUpdate: function() {
		if (this.dataLoaded())
			this.loadPreview();
	},
	loadPreview: function() {
		if (this.props.params.id) {
			this.getFlux().actions.generatePreviewData(this.getFlux().store("ComponentsStore").getComponent(this.props.params.id));
		} else {
			this.getFlux().actions.resetComponentEditor();
		}
	},
  render: function() {
		if (!this.getFlux().store("ComponentsStore").getState().componentsLoaded)
			return ( <div className="editor"><AppSidebar context="component" /></div>);
		//this.loadPreview();
    return (
      <div className="editor">
        <AppSidebar context="component" />
        <ComponentEditor />
      </div>
    );
  }
});
module.exports = EditorComponent;
