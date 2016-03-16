var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var GeneralPane = require('./general_pane.jsx');
var ChartTypePane = require('./chart_type_pane.jsx');
var AppearancePane = require('./appearance_pane.jsx');
var DataPane = require('./data_pane.jsx');
var ConfigurationPane = require('./configuration_pane.jsx');

var EditorPane = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ComponentEditorStore")],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("ComponentEditorStore").getState();
  },
  renderPaneForState: function() {
    switch(this.getStateFromFlux().editorPane) {
      case 'general':
        return <GeneralPane />;
        break;
      case 'chartType':
        return <ChartTypePane />;
        break;
      case 'appearance':
        return <AppearancePane />;
        break;
      case 'data':
        return <DataPane />;
      case 'configuration':
        return <ConfigurationPane />;
        break;
    }
  },
  render: function() {
    return (
      <div>
        {this.renderPaneForState()}
      </div>
    );
  },
});
module.exports = EditorPane;
