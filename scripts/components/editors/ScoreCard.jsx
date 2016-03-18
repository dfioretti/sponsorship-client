var React = require('react'),
		Link = require('react-router').Link;

var ScoreCard = React.createClass({
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
        <div className="main">
					<Link to={link}>
            <img style={imageSize} src={this.props.score.image} />
            <h4 style={setStyle}>{this.props.score.asset_set_name}</h4>
					</Link>
        </div>
      </div>
    );
  }
});
module.exports = ScoreCard
