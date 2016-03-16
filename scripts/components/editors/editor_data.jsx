var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AddedData = require('./added_data.jsx');

var EditorData = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ComponentEditorStore")],
  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("ComponentEditorStore").getState();
  },
  render: function() {
    return (
      <div className="editor-data">
        <div className="input-heading">
          Selected Data
        </div>
        <AddedData />
      </div>
    );
  }
});

module.exports = EditorData;
