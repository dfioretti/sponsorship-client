var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Navigation = require('react-router').Navigation;

var ScoreCard = React.createClass({
	mixins: [FluxMixin, Navigation],

	handleScoreClick: function(e) {
		this.getFlux().actions.loadSavedScore(this.props.score);
		this.transitionTo('/apt/editor_score/' + this.props.score.id);
	},
  render: function() {
    var id = "asset_card_" + this.props.score.id;
    var imageSize = {
      height: "220px",
      width: "290px",
      marginLeft: "55px",
      marginTop: "5px"
    };
    var setStyle = {
      zIndex: "1000",
      width: "100%",
      textAlign: "center",
      color: "white",
      marginTop: "0px"
    };
    var link = "/apt/editor_score/" + this.props.score.id;
    return (
      <div id={id} className="dashboard-module">
        <div className="top">
          <div className="drag-handle">
          </div>
          <div className="top-title">
            {this.props.score.name}
          </div>
        </div>
        <div onClick={this.handleScoreClick} className="main">
          <img style={imageSize} src={this.props.score.image} />
          <h4 style={setStyle}>{this.props.score.asset_set_name}</h4>
        </div>
      </div>
    );
  }
});
module.exports = ScoreCard
