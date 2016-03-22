var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		ReactRouter = require('react-router'),
		Navigation = require('react-router').Navigation,
		StoreWatchMixin = Fluxxor.StoreWatchMixin

window.ReactRouter = ReactRouter;
var EditorSubNav = React.createClass({
  mixins: [FluxMixin, Navigation, StoreWatchMixin("ComponentEditorStore")],

  getStateFromFlux: function() {
    return this.getFlux().store("ComponentEditorStore").getState();
  },
  handleNewClick: function() {
    if (this.props.handleNew !== null) {
      this.props.handleNew();
      return;
    }
    this.getFlux().actions.newComponent();
  },
  handleSaveClick: function() {
    if (this.props != null && this.props.handleSave != null) {
      this.props.handleSave();
      return;
    }
    if (this.state.id !== null) {
			console.log("ID CHECK");
      this.getFlux().actions.updateComponent(this.state.id);
    }
    else {
			console.log("SAVE CHECK");
      this.getFlux().actions.saveComponent();
    }
  },
  handleBackClick: function() {
		this.getFlux().actions.resetComponentEditor();
    this.goBack();
    //ReactRouter.HashLocation.pop();
  },
  render: function() {
    var message = ""
    if (this.props.message === null || typeof(this.props.message) === 'undefined') {
      message = this.getStateFromFlux().message;
    } else {
      message = this.props.message;
    }
	/*
	old message alerts before i implemented snackbar
		<div style={{cursor: "pointer", float: "right", height: "70px", opacity: "1"}} className="col-md-3">
			{message}
		</div>
	*/
    return (
      <div className="subnav">
        <div className="filter-row">
          <div onClick={this.handleBackClick} style={{cursor: "pointer", height: "70px", borderRight: "1px solid #b9c3ca", opacity: "0.6"}} className="col-md-1">
            <img style={{height: "20px", width: "20px", marginRight: "8px", marginTop: "-4px"}}src="/images/edit/arrows.png" />
            Back
          </div>
          <div onClick={this.handleNewClick} style={{cursor: "pointer", height: "70px", borderRight: "1px solid #b9c3ca", opacity: "0.6"}} className="col-md-1">
            New
            <img style={{height: "20px", width: "20px", marginLeft: "8px", marginTop: "-4px"}}src="/images/edit/interface.png" />
          </div>
          <div onClick={this.handleSaveClick} style={{cursor: "pointer", height: "70px", borderRight: "1px solid #b9c3ca", opacity: "0.6"}} className="col-md-1">
            Save
            <img style={{height: "20px", width: "20px", marginLeft: "8px", marginTop: "-4px"}}src="/images/edit/vintage.png" />
          </div>
          <div className="col-md-5">
          </div>

        </div>
      </div>
    );
  }
});

module.exports = EditorSubNav;
