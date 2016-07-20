var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		TextField = require('material-ui').TextField,
		ChartTypePane = require('./chart_type_pane.jsx'),
        RadioButton = require('material-ui').RadioButton,
        RadioButtonGroup = require('material-ui').RadioButtonGroup,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var GeneralPane = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ComponentEditorStore")],
  getStateFromFlux: function() {
    return this.getFlux().store("ComponentEditorStore").getState();
  },
  handleTitleChange: function(e) {
    this.getFlux().actions.updateTitle(e.target.value);
  },
  handleIconChange: function(e) {
      this.getFlux().actions.updateDisplayIcon(e.target.value);
  },
  handleLabelChange: function(e) {
    this.getFlux().actions.updateDisplayLabel(e.target.value);
  },
  render: function() {
		/*
		<div className="form-group">
			<label>Description</label>
			<textarea></textarea>
		</div>
		*/
      var radioStyle = {
          display: "inline-block",
          width: "50%",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          color: "#4a4a4a",
          fontFamily: "Avenir-Medium",
          marginTop: "10px"
      }

    return (
      <div className="editor-pane">
        <div className="input-heading">
          General
        </div>
        <div className="form-content">
            <label style={{textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: 16}}>Module Title</label>
			    <br />
			    <TextField fullWidth={true} value={this.getStateFromFlux().title} onChange={this.handleTitleChange} hintText="Enter Title" />
			    <ChartTypePane />
            <div className="from-group">
                <label style={{textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: 16}}>Display Icon</label>
                <RadioButtonGroup onChange={this.handleIconChange} valueSelected={this.state.icon} name="icon">
                    <RadioButton style={radioStyle} value="entity" label="Property" />
                    <RadioButton style={radioStyle} value="metric" label="Data" />
                </RadioButtonGroup>
            </div>
            <div className="from-group">
                <label style={{textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: 16}}>Display Label</label>
                <RadioButtonGroup onChange={this.handleLabelChange} valueSelected={this.state.label} name="label">
                    <RadioButton style={radioStyle} value="entity" label="Property" />
                    <RadioButton style={radioStyle} value="metric" label="Data" />
                </RadioButtonGroup>
            </div>

        </div>

      </div>
    );
  }
});
module.exports = GeneralPane;
