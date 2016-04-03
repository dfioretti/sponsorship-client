var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		Link = require('react-router').Link,
		Tabs = require('material-ui').Tabs,
		Tab = require('material-ui').Tab,
		StyleIcon = require('react-icons/lib/md/style'),
		TypeIcon = require('react-icons/lib/md/collections'),
		DataIcon = require('react-icons/lib/fa/database'),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var GeneralPane = require('./general_pane.jsx');
var ChartTypePane = require('./chart_type_pane.jsx');
var AppearancePane = require('./appearance_pane.jsx');
var DataPane = require('./data_pane.jsx');
var ConfigurationPane = require('./configuration_pane.jsx');

var EditorPane = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ComponentEditorStore")],

	handleChange: function(value) {
		// this is really dumb and it gets triggered by onChange by any watched store
		if (value == 'a') this.getFlux().actions.changePane(value);
		if (value == 'b') this.getFlux().actions.changePane(value);
	},
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
				break;
      case 'configuration':
        return <ConfigurationPane />;
        break;
    }
  },
  render: function() {
		/*
		<div>
			{this.renderPaneForState()}
		</div>
		*/
    return (
			<Tabs
				value={this.getStateFromFlux().editorPane}
				onChange={this.handleChange}
				tabItemContainerStyle={{
					backgroundColor: "#3c88d1",
				}}
				inkBarStyle={{
					backgroundColor: "rgb(0, 188, 212)",
				}}
				>
				<Tab
					value="a"
					icon={<TypeIcon />}
					>
					<GeneralPane />
				</Tab>
				<Tab value="b" icon={<DataIcon />}>
					<DataPane />
				</Tab>
			</Tabs>

    );
  },
});
module.exports = EditorPane;
