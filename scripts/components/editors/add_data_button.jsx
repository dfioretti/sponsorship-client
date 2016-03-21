var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AddDataButton = React.createClass({
  mixins: [FluxMixin],
  getStateFromFlux: function() {
    return flux.store("ComponentEditorStore").getState();
  },
  handleAddData: function(e) {
    this.getFlux().actions.addData();
    this.getFlux().actions.generatePreviewData(this.getFlux().store("ComponentEditorStore").getObject());
  },
  render: function() {
    if (this.getStateFromFlux().selectedData !== null) {
      return (
        <button onClick={this.handleAddData} className="btn btn-primary editor-button">
          Add Data
        </button>
      );
    } else {
      return null;
    }
  }
});

module.exports = AddDataButton;
