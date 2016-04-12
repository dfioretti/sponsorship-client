var React = require('react'),
    Fluxxor = require('fluxxor'),
    AppSidebar = require('../sidebar/app_sidebar.jsx'),
    ScoreEditor = require('./ScoreEditor.jsx'),
    EditorToolbar = require('../sidebar/EditorToolbar.jsx'),
    FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin,
    ScoreEditorPane = require('./ScoreEditorPane.jsx'),
    EditorTree = require('./EditorTree.jsx'),
    EditorSubNav = require('./editor_subnav.jsx');

var ScoreEditor = React.createClass({
    mixins: [
        FluxMixin,
        StoreWatchMixin("ScoreEditorStore")
    ],
    getStateFromFlux: function() {
        return this.getFlux().store("ScoreEditorStore").getState();
    },
    componentWillMount: function() {
        if (this.state.scoreTitle.length > 1) {
            this.getFlux().actions.setBreadcrumb("scores > " + this.state.scoreTitle);
            this.getFlux().actions.setCurrentNav("score_editor", this.state.id);
        } else {
            this.getFlux().actions.setBreadcrumb("scores > create");
            this.getFlux().actions.setCurrentNav("score_editor", null);
        }
    },
    handleNew: function() {
        this.getFlux().actions.resetScoreEditor();
    },
    handleSave: function() {
        // editing or new
        var score = this.getStateFromFlux().score;
        if (!score) { score = {} };

        // score data - should move this to store
        score['score'] = myDiagram.model.toJson();
        score['image'] = myDiagram.makeImageData();
        score['name'] = this.getStateFromFlux().scoreTitle;

        // update existing, create new
        if (score.id) {
            this.getFlux().actions.updateScore(score);

        } else {
            this.getFlux().actions.saveScore(score);
        }
        this.getFlux().actions.loadScores();
    },
    render: function() {
        return (
            <div className="editor-box">
            <EditorToolbar handleSaveClick={this.handleSave} handleNewClick={this.handleNewClick} />
            <div className="editor-container">
            <div className="row editor-2-col">
            <div className="col-md-4 editor-pane">
            <ScoreEditorPane />
            </div>
            <div className="col-md-7 editor-views">
            <EditorTree params={this.props.params}/>
            </div>
            </div>
            </div>
            </div>
        );
    }
});

module.exports = ScoreEditor;
