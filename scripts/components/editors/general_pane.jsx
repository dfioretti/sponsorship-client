var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		TextField = require('material-ui').TextField,
		ChartTypePane = require('./chart_type_pane.jsx'),
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
		/*
		<div className="form-group">
			<label>Description</label>
			<textarea></textarea>
		</div>
		*/
    return (
      <div className="editor-pane">
        <div className="input-heading">
          General
        </div>
        <div className="form-content">
            <label>Component Title</label>
						<br />
						<TextField value={this.getStateFromFlux().title} onChange={this.handleTitleChange} hintText="Enter Title" />
						<ChartTypePane />
        </div>
      </div>
    );
  }
});
module.exports = GeneralPane;
