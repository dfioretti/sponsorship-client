var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ConfigurationPane = React.createClass({
  mixins: [FluxMixin],
  getStateFromFlux: function() {
    return flux.store("ComponentEditorStore").getState();
  },
  render: function() {
    return (
      <div className="editor-pane">
        <div className="input-heading">
          Configuration
        </div>
        <div className="form-content">
          <div className="form-group">
            <label>Configuration Unavailable</label>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ConfigurationPane;
