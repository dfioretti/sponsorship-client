var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;


var ScoreEditContextMenu = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ScoreEditorStore")],

  handleScoreContextChange: function(e) {
    this.getFlux().actions.changeScorePane(e.target.id);
  },
  getStateFromFlux: function() {
    return this.getFlux().store("ScoreEditorStore").getState();
  },
  renderContextListItems: function() {

  },
  render: function() {
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
