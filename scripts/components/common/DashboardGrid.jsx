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

  createElement(el) {
    var removeStyle = {
      position: 'absolute',
      right: '2px',
      top: 0,
      cursor: 'pointer'
    };

    var height = (el.h * this.props.rowHeight);
    console.log("elementi", el.i);
		return (
			<div key={el.i} _grid={el}>
				<Card style={{height: "100%",width: "100%"}}>
          <DashboardChart data={this.props.elements[el.i]} height={height} />
				</Card>
			</div>
		)
  },

  // TODO: port to parent..
  onRemoveItem(i) {
    console.log('removing', i);
    this.setState({items: _.reject(this.state.items, {i: i})});
  },

  render() {
		console.log("render items", this.props.items);
    return (
      <div>
        <ResponsiveReactGridLayout style={{marginTop: 0, paddingTop: 0}} onLayoutChange={this.props.onLayoutChange} onBreakpointChange={this.props.onBreakpointChange}
            {...this.props}>
          {_.map(this.props.items, this.createElement)}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
});

module.exports = DashboardGrid;
