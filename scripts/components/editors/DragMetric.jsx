var React = require('react');
var DragSource = require('react-dnd').DragSource;
var PropTypes = React.PropTypes;
var uuid = require('node-uuid');

var metricSource = {
	beginDrag: function(props) {
		return {
			text: props.text,
			id: props.id,
			point: props.point,
			type: props.type,
			dragType: props.dragType,
			icon: props.icon,
			updateDrag: props.updateDrag
		};
	},
	endDrag: function(props, monitor) {
		const item = monitor.getItem();
		const dropResult = monitor.getDropResult();
	}
}

function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	};
}

var DragMetric = React.createClass({
	propTypes: {
		text: PropTypes.string.isRequired,
		dragType: PropTypes.string.isRequired,
		id: PropTypes.string.isRequired,
		//isDragging: PropTypes.bool.isRequired,
		connectDragSource: PropTypes.func.isRequired,
		updateDrag: PropTypes.func.isRequired
	},
	render: function() {
		var isDragging = this.props.isDragging;
		var connectDragSource = this.props.connectDragSource;
		var text = this.props.text;
		return connectDragSource(
			<div key={this.props.id} style={{display: 'inline-block', opacity: isDragging ? 0.5 : 1}}>
				{this.props.children}
			</div>
		);
	}
});

module.exports = DragSource('drag-metric', metricSource, collect)(DragMetric);
