var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		ScoreClient = require('../../clients/score_client.js'),
		ZoomIn = require('react-icons/lib/fa/search-plus'),
		ZoomOut = require('react-icons/lib/fa/search-minus'),
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
		var style = {
			height: "20px",
			width: "20px",
			color: "white",
			cursor: "pointer",
			margin: "2px"
		}
    return (
      <div className="editor-score">
        <div className="score-heading">
          {this.getStateFromFlux().scoreTitle}
        </div>
        <div className="editor-tree">
          <div className="editor-commands">
						<div>
							<ZoomIn style={style} onClick={this.zoomIn} />
						</div>
						<div>
							<ZoomOut style={style} onClick={this.zoomOut} />
						</div>
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
