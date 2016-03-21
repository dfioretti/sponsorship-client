var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		Navigation = require('react-router').Navigation,
		StoreWatchMixin = Fluxxor.StoreWatchMixin

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
		console.log(this.props);
    if (this.props != null && this.props.handleSave != null) {
      this.props.handleSave();
      return;
    }
    if (this.props.params.id !== null) {
			console.log("id?");
      this.getFlux().actions.updateComponent(this.props.params.id);
    }
    else {
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
          <div style={{cursor: "pointer", float: "right", height: "70px", opacity: "1"}} className="col-md-3">
            {message}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = EditorSubNav;
