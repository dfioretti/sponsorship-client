var React = require('react');
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;

var ScoreTab = React.createClass({

	getInitialState: function() {
		return { network: null, layoutMethod: "directed", nodes: [], edges: [], container: document.getElementById("score-vis"), options: {}, data: {}}
	},
	destroyTree: function() {
		if (this.state.network !== null) {
			var network = this.state.network;
			network.destroy();
			this.setState({
				network: null
			});
		}
	},
	addNode: function(event) {

	},
	onSelectNode: function(params) {
		console.log("called on select", params);
	},
	onDeselectNode: function(params) {
		console.log("called on deselect", params);
	},
	componentDidMount: function() {
		///this.nodes.push();
		var network = null;
		var nodes = [];
		var edges = [];
		var layoutMethod = "directed";
		var container = document.getElementById('score-vis');


		var svgData = '<svg xmlns="http://www.w3.org/2000/svg" width="390" height="65">' +
		'<rect x="0" y="0" width="100%" height="100%" fill="#7890A7" stroke-width="20" stroke="#ffffff" ></rect>' +
		'<foreignObject x="15" y="10" width="100%" height="100%">' +
		'<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">' +
		' <em>I</em> am' +
		'<span style="color:white; text-shadow:0 0 20px #000000;">' +
		' HTML in SVG!</span>' +
		'</div>' +
		'</foreignObject>' +
		'</svg>';

		var DOMURL = window.URL || window.webkitURL || window;

		var s = Snap(200, 200);
		console.log('snap', s);

		var bigCircle = s.circle(150, 150, 100);
		console.log('circle', bigCircle);
		console.log("data", svgData);
		console.log('outer s', s.outerSVG());

		var img = new Image();
		var svg = new Blob([s.outerSVG()], {type: 'image/svg+xml;charset=utf-8'});
		console.log("svg img", svg);
		var url = DOMURL.createObjectURL(svg);
		console.log("url", url);

		nodes.push({id: 1, label: 'Root', image: url, shape: 'image', other: 'yes', test: 'new'});



		console.log('outer circle', bigCircle.outerSVG());
		s.remove();



		var data = {
			nodes: nodes,
			edges: edges
		};

		var options = {
			layout: {
				hierarchical: {
					direction: 'UD',
					sortMethod: 'directed'
				}
			},
			edges: {
				smooth: {
					type: 'cubicBezier',
					roundness: 0.4
				}
			}
		};
		network = new vis.Network(container, data, options);
		network.on("dragEnd", this.onSelectNode);
		network.on("deselectNode", this.onDeselectNode)
	},

	/*
	network.on("selectNode", function(params) {
	console.log('select event', params);
	});
	network.on("deselectNode", function(params) {
	console.log("deslect event", params);
	});
	},
	*/

	render: function() {
		return (
			<div>
				<div id="score-vis"
					style={{width: 600, height: 400, border: "1px solid lightgray"}}
					>
				</div>
				<button onClick={this.addNode}>add</button>
			</div>
		);
	}




});

module.exports = ScoreTab;
