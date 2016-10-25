'use strict';
var React = require('react');
var PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
var _ = require('lodash');
var WidthProvider = require('react-grid-layout').WidthProvider;
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);
var DashModule = require('./DashModule.jsx');
var Card = require("material-ui").Card;
var DashboardChart = require('./DashboardChart.jsx');

/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */
var DashboardGrid = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return { items: this.props.items, elements: this.props.elements }
  },
  componentWillReceiveProps: function(newProps) {
    this.setState({
      items: newProps.items,
      elements: newProps.elements
    });
  },
  createElement: function(el) {
    var removeStyle = {
      position: 'absolute',
      right: '2px',
      top: 0,
      cursor: 'pointer'
    };

    var height = (el.h * this.props.rowHeight);
    var updatedHeight = height - (10 * el.h);
		return (
			<div key={el.i} _grid={el} >
        <DashboardChart metricsColl={this.props.metricsColl} data={this.state.elements[el.i]} height={height} />
			</div>
		)
  },

  // TODO: port to parent..
  onRemoveItem: function(i) {
    this.setState({items: _.reject(this.state.items, {i: i})});
  },
  layoutChanged: function(layout) {
    this.setState({items: layout});
    this.props.persistDashboard(layout);
  },
  commitUpdate: function(layout) {
    this.props.persistDashboard(layout);
  },
  render: function() {
    return (
      <div>
        <ResponsiveReactGridLayout onResizeStop={this.commitUpdate} onDragStop={this.commitUpdate}  style={{marginTop: 10, paddingTop: 0}} onLayoutChange={this.layoutChanged} onBreakpointChange={this.props.onBreakpointChange}
            {...this.props}>
          {_.map(this.state.items, this.createElement)}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
});

module.exports = DashboardGrid;
