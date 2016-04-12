var React = require('react'),
    Fluxxor = require('fluxxor'),
    FluxMixin = Fluxxor.FluxMixin(React),
    Link = require('react-router').Link,
    StoreWatchMixin = Fluxxor.StoreWatchMixin,
    AppSidebar = require('../sidebar/app_sidebar.jsx'),
    ComponentEditor = require('./component_editor.jsx');

var EditorComponent = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("EditorPreviewStore")],
    componentWillMount: function() {
        var title = this.getFlux().store("ComponentEditorStore").getState().title;
        if (title.length > 1) {
            this.getFlux().actions.setBreadcrumb("modules > " + title);
            this.getFlux().actions.setCurrentNav("component_editor", this.getFlux().store("ComponentEditorStore").getState().id);
        } else {
            this.getFlux().actions.setBreadcrumb("modules > create");
            this.getFlux().actions.setCurrentNav("component_editor", null);
        }
        this.dataLoaded();
    },
    getInitialState: function() {
        return { loaded: false };
    },
    componentWillMount: function() {
        this.getFlux().actions.loadData();
    },
    getStateFromFlux: function() {
        return this.getFlux().store("EditorPreviewStore").getState();
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
            if (this.state.component === null) {
                this.getFlux().actions.generatePreviewData(this.getFlux().store("ComponentsStore").getComponent(this.props.params.id));
            }
        } else {
            //this.getFlux().actions.resetComponentEditor();
        }
    },
    render: function() {
        /*
           if (!this.getFlux().store("ComponentsStore").getState().componentsLoaded)
           return ( <div className="editor"><AppSidebar context="component" /></div>);
                //this.loadPreview();
                //        <AppSidebar context="component" />
                */

        return (
            <div className="editor">
            <ComponentEditor {...this.props} />
            </div>
        );
    }
});
module.exports = EditorComponent;
