var React = require('react'),
		ResponsiveReactGridLayout = require('react-grid-layout').Responsive,
		PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin'),
		_ = require('lodash'),
		ResponsiveReactGridLayout = require('react-grid-layout').Responsive;

var GridView = React.createClass({
	mixins: [PureRenderMixin],

	getDefaultProps: function() {
		return {
			className: "layout",
			rowHeight: 30,
			cols: 12,
		};
	},
	getInitialState: function() {
		var layout = this.generateLayout();
		return {
			layout: layout
		}
	},
	generateLayout: function() {
		return [{ h: 5, w: 5, x: 0, y: 0, k: "0" }];
	},
	onLayoutChange: function() {
		// nothing for now..
	},
	generateDOM: function() {
		return _.map(this.state.layout, function(l, i) {
			return (
				<div key={i} className="component">
					<span className="text">Component</span>
				</div>
			);
		})
	},
	render: function() {
		<div className="grid-view">
			<ResponsiveReactGridLayout
				{...this.props}
				layout={this.state.layout}
				onLayoutChange={this.onLayoutChange}
				useCSSTransforms={true}>
				{this.generateDOM()}
			</ResponsiveReactGridLayout>
		</div>
	}

});

module.exports = GridView;
