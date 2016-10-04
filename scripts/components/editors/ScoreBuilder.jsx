var React = require('react');
var Row = require('react-bootstrap').Row;
var uuid = require('node-uuid');
var Col = require('react-bootstrap').Col;
var Toolbar = require('material-ui').Toolbar;
var uuid = require('node-uuid');
var Popover = require('material-ui').Popover;
var ReactDOM = require('react-dom');
var Chip = require('material-ui').Chip;

var nodeIds, nodeList, nodes, edgeList, edges, network, options, counter;

function generateNode() {
	var data =
	'<svg xmlns="http://www.w3.org/2000/svg" width="390" height="65">'
	+ '<rect x="0" y="0" width="100%" height="100%" fill="#7890A7" stroke-width="20" stroke="#ffffff"></rect>'
	+ '<foreignObject x="15" y="10" width="100%" height="100%">'
	+ '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 40px">'
	+ '<em>TEST</em>'
	+ '</div>'
	+ '</foreignObject>'
	+ '</svg>';
	var DOMURL = window.URL || window.webkitURL || window;
	var img = new Image();
	var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
	var url = DOMURL.createObjectURL(svg);

	return url;
}

var ScoreBuilder = React.createClass({
	getInitialState: function() {
		return { showPopover: false, x: 0, y: 0, currentNode: null }
	},
	/*
	getInitialState: function() {
	return {
	network: null,
	layoutMethod: 'directed',
	nodes: [],
	edges: [],
	nodeList: [],
	edgeList: [],
	options: {},
	data: {},
	nodeIds: []
	}
	},*/
	componentDidMount: function() {
		this.loadScoreTree();
	},
	componentDidUpdate: function(prevProps, prevState) {
		this.loadScoreTree();
	},
	loadScoreTree: function() {
		nodeList = [
			{ id: 0, labelHighlightBold: false, borderWidthSelected: 1, label: 'MODEL', shape: 'circle', font:{face: 'Avenir-Book', size: 18, color: '#FFFFFF'}, size: 80, color: '#1C5D99'}
		];
		nodes = new vis.DataSet(nodeList);
		edgeList = [];
		edges = new vis.DataSet(edgeList);
		nodeIds = [];
		counter = 1;
		var container = document.getElementById('vis');

		options = {
			layout: {
				hierarchical: {
					blockShifting: true,
					direction: 'UD',
					sortMethod: 'hubsize'
				}
			},
			manipulation: {
				addEdge: function(data, callback) {
					if (data.from == data.to) {
						var r = confirm("Do you want to connect the node to itself?");
						if (r == true) {
							callback(data);
						}
					}
					else {
						callback(data);
					}
				}
			},
			interaction: {
				navigationButtons: true,
				keyboard: false
			},
			edges: {
				smooth: {
					forceDirection: 'none'
				}
			}
		};
		var data = {
			nodes: nodes,
			edges: edges
		}
		network = new vis.Network(container, data, options);
		network.on("click", function(params) {
			this.doNodeSelect(params);
		}.bind(this));
		network.on("deselectNode", function(params) {
			this.doNodeDeselect(params);
		}.bind(this));
	},
	doNodeDeselect: function(params) {
		this.setState({
			showPopover: false
		});
	},
	doNodeSelect: function(params) {
		console.log(params);
		//console.log('nodes', nodes, network);
		if (params.nodes.length == 0) return;

		var node = params.nodes[0];
		console.log('the node', node, params);
		console.log('network', network.body.nodes);
		var def = network.body.nodes[node];//;[node];
		console.log('found', node, def);
		//console.log('network', network);
		this.setState({
			showPopover: true,
			currentNode: node,
			//x: params.event.pointers[0].pageX,
			//y: params.event.pointers[0].pageY
			//x: def.body.view.translation.x,
			//y: def.body.view.translation.y
			x: params.pointer.DOM.x,
			y: params.pointer.DOM.y
		});
		console.log('doign node select!', params);
	},
	handleClick: function(event) {
		//var id = uuid.v4();
		var id = counter;
		counter = counter + 1;
		var url = generateNode();
		nodes.add({id: id, image: url, shape: 'image' });
		nodeIds.push(id);
		console.log('handle click!', event);
	},
	handleClose: function(event) {
		this.setState({
			showPopover: false
		});
	},
	renderPopover: function() {
		var popoverStyle = {
			height: 100,
			width: 100,
			position: 'relative',
			zIndex: 9999999,
			//top: this.state.y + 'px',
			//left: this.state.x + 'px',
			marginTop: this.state.y,
			marginLeft: this.state.x,
			backgroundColor: 'green'
		}
		console.log('popover style', popoverStyle);
		//				anchorOirigin={{ vertical: 'top', horizontal: 'middle' }}

		return (
			<Popover
				open={this.state.showPopover}
				style={popoverStyle}
				anchorEl={this.vis}
				key={uuid.v4()}
				anchorOrigin={{horizontal: 'left', vertical: 'top'}}
				targetOrigin={{horizontal: 'left', vertical: 'top'}}
				onRequestClose={this.handleClose}
				>
				This is my popover
			</Popover>
		);
	},
	renderMetric: function(data) {
		console.log('rnder metric', data, this.props.kpis);
		var idx = this.props.kpis.map((kpi) => kpi.uuid).indexOf(data);
		var kpi = this.props.kpis[idx];
		return (
			<Chip
				key={kpi.uuid}
				style={{margin: 4}}
				id={kpi.uuid}
				>
				{kpi.name}
			</Chip>
		);
	},
	render: function() {
		return (
			<div>
				<Col md={7}>
					<div ref={(ref) => this.vis = ref }  className="tab-content">
						<div  id="vis" style={{height: '80%'}}>
							{this.renderPopover()}
						</div>
						<div style={{height: '20%'}}>
							<div className="title med small-pad center">Available KPIs</div>
							<div style={{display: 'flex', flexWrap: 'wrap'}}>
							{this.props.loadedMetrics.map(this.renderMetric, this)}
							</div>
						</div>
					</div>
				</Col>
				<Col md={4}>
					<div style={{height: '100%', backgroundColor: 'green'}}>
						this is the editor
					</div>
				</Col>
			</div>
		);
	}
})

module.exports = ScoreBuilder;
/*
<div style={{width: '100%', height: 50, backgroundColor: 'blue'}}>
</div>
*/
