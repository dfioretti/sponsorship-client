var React = require('react'),
		Fluxxor = require('fluxxor'),
		AppSidebar = require('../sidebar/app_sidebar.jsx'),
		ScoreEditor = require('./ScoreEditor.jsx'),
		FluxMixin = Fluxxor.FluxMixin(React);

var EditorScore = React.createClass({
  mixins: [FluxMixin],
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <div className="editor">
        <ScoreEditor params={this.props.params} />
      </div>
    );
  }
});

module.exports = EditorScore;
