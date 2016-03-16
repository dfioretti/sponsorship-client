var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		ScoreClient = require('../../clients/score_client.js'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;


var EditorTree = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ScoreEditorStore")],
  componentDidMount: function() {
    var score = null;
    if (this.props.params.id) {
      ScoreClient.viewScore(this.props.params.id, function(data) {
        // lazy - should use action
        this.getFlux().store("ScoreEditorStore").loadSavedScore(data);
        score = data.score
      }.bind(this));
    }
    initilizeScoreCanvas(score);
  },
  getStateFromFlux: function() {
    return this.getFlux().store("ScoreEditorStore").getState();
  },
  zoomIn: function() {
    zoomIn();
  },
  zoomOut: function() {
    zoomOut();
  },
  render: function() {
    return (
      <div className="editor-score">
        <div className="score-heading">
          {this.getStateFromFlux().scoreTitle}
        </div>
        <div className="editor-tree">
          <div className="editor-commands">
            <span onClick={this.zoomIn} style={{fontSize: "20px"}} className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
            <br />
            <span onClick={this.zoomOut} style={{fontSize: "20px"}} className="glyphicon glyphicon-minus-sign" aria-hidden="true"></span>
          </div>
          <div id="myDiagram">
          </div>
          <textarea style={{display: "none"}} id="mySavedModel"></textarea>
        </div>
      </div>
    );
  }
});
module.exports = EditorTree;
