var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Navigation = require('react-router').Navigation,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;


var ScoreEditContextMenu = React.createClass({
  mixins: [FluxMixin, Navigation, StoreWatchMixin("ScoreEditorStore")],

  handleScoreContextChange: function(e) {
    this.getFlux().actions.changeScorePane(e.target.id);
  },
  getStateFromFlux: function() {
    return this.getFlux().store("ScoreEditorStore").getState();
  },
	handleCreateClick: function() {
		this.getFlux().actions.resetScoreEditor();
		this.transitionTo('/apt/editor_score');
	},
  renderContextListItems: function() {
  },
  render: function() {
		if (this.props.mode === 'index') {
			return (
				<div className="context-menu">
					<div className="editor-menu">
						<button
							style={{margin: "10px -10px 10px 10px", width: "calc(100% - 20px)", letterSpacing: "1.5px"}}
							onClick={this.handleCreateClick}
							className="btn btn-primary form-control"
							>
							CREATE SCORE
						</button>
					</div>
				</div>
			)
		}
    return (
      <div className="context-menu">
        <div className="editor-menu">
          <ul onClick={this.handleScoreContextChange}>
            {this.getStateFromFlux().menuItems.map(function(i) {
              if (this.getStateFromFlux().selectedPane == i) {
                return (
                  <li key={i} id={i} className="active-item">
                    {i}
                  </li>
                );
              } else {
                return (
                  <li key={i} id={i}>
                    {i}
                  </li>
                );
              }
            }.bind(this))}
          </ul>
        </div>
      </div>
    );
  }
});
module.exports = ScoreEditContextMenu;
