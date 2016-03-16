var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var GeneralPane = React.createClass({
  mixins: [FluxMixin],
  getStateFromFlux: function() {
    return this.getFlux().store("ComponentEditorStore").getState();
  },
  handleTitleChange: function(e) {
    this.getFlux().actions.updateTitle(e.target.value);
  },
  render: function() {
    return (
      <div className="editor-pane">
        <div className="input-heading">
          General
        </div>
        <div className="form-content">
          <div className="form-group">
            <label>Component Title</label>
            <input type="text" value={this.getStateFromFlux().title} onChange={this.handleTitleChange} className="form-control" placeholder="Enter Title" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea></textarea>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = GeneralPane;
