var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		StoreWatchMixin = Fluxxor.StoreWatchMixin,
		DashboardMixin = require('../mixins/dashboard_mixin.jsx'),
		ScoreCard = require('./ScoreCard.jsx'),
		AppSidebar = require('../sidebar/app_sidebar.jsx'),
		Link = require('react-router').Link;

var ScoreIndex = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ScoresStore"), DashboardMixin],
	getStateFromFlux: function() {
		return this.getFlux().store("ScoresStore").getState();
	},
	componentDidUpdate: function() {
		if (this.getStateFromFlux().scoresLoaded) {
			this.setupGrid();
		}
	},
	componentDidMount: function() {
		if (this.getStateFromFlux().scoresLoaded)
			this.setupGrid();
	},
  componentWillMount: function() {
		if (!this.getStateFromFlux().scoresLoaded && !this.getStateFromFlux().loading) {
			this.getFlux().actions.loadScores();
		}
  },
  renderModules: function() {
		var scores = this.getStateFromFlux().scores;
    // this is lazy, but i don't really feel like
    // fucking with this anymore
		//        <CreateScore />

    return (
      <div className="modules-container">
        {scores.map(function(score) {
          return <ScoreCard key={score.id} score={score} />
        })}
      </div>
    );
  },
  render: function() {
    console.log(this.state);
    if (this.state.scoresLoaded) {
      return (
        <div className="dashboard">
          <AppSidebar {...this.props} context="score-index" />
          <div className="modules-box">
            {this.renderModules()}
          </div>
        </div>
      );
    } else {
      return (
        <div className="dashboard"></div>
      );
    }
  }
});
module.exports = ScoreIndex;
