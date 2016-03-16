var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		Glyphicon = require('react-bootstrap').Glyphicon,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;


var AddedDataRow = React.createClass({
  mixins: [FluxMixin],

  handleRemoveData: function(e) {
    this.getFlux().actions.removeData(e.target.id);
    this.getFlux().actions.generatePreviewData();
  },
  render: function() {
    return (
      <div className="added-data-row">
        <div className="col-md-2 medium-round-images bs-col">
          <img src={this.props.imageOne} />
        </div>
        <div className="col-md-4 bs-col">
          {this.props.labelOne}
        </div>
        <div className="col-md-2 medium-round-images bs-col">
          <img src={this.props.imageTwo} />
        </div>
        <div className="col-md-3 bs-col">
          {this.props.labelTwo}
        </div>
        <div className="col-md-1 bs-col">
          <span
            style={{
              color: "#e76959",
              padding: "5px",
              fontSize: "20px"
            }}
            onClick={this.handleRemoveData}
            id={this.props.id}
            className="glyphicon glyphicon-remove actionable"
            aria-hidden="true" />
        </div>
      </div>
    );
  }
});

module.exports = AddedDataRow;
