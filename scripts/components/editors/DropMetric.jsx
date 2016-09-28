var React = require('react');
var PropTypes = React.PropTypes;
var DropTarget = require('react-dnd').DropTarget;

var dropRules = {
	formula: ['value'],
	value: ['function', 'operation', 'parens'],

}

var metricTarget = {
	canDrop: function(props, monitor) {
		return true;
	},
	drop: function(props, monitor) {
		props.onDrop(monitor.getItem());
	},
}

function collect(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop(),
		isOverCurrent: monitor.isOver({ shallow: true})
	};
}

var DropMetric = React.createClass({
	getInitialState: function() {
		return { inputs:[] }
	},
	propTypes: {
		//lastDroppedItem: PropTypes.object,
		dropType: PropTypes.string.isRequired,
		onDrop: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		isOverCurrent: PropTypes.bool.isRequired,
		isOver: PropTypes.bool.isRequired
		//canDrop: PropTypes.bool.isRequired
	},

	render: function() {
		var connectDropTarget = this.props.connectDropTarget;
		return connectDropTarget(
			<div title={this.props.title} style={this.props.style}>
				{this.props.children}
			</div>
		)
	}
});

module.exports = DropTarget('drag-metric', metricTarget, collect)(DropMetric);
