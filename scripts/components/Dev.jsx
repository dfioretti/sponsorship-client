var React = require('react'),
		Fluxxor = require('fluxxor'),
		FluxMixin = Fluxxor.FluxMixin(React),
		StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AppSidebar = require('./sidebar/app_sidebar.jsx');
var Nav = require('./common/nav.jsx');
var ComponentEditor = require('./editors/component_editor.jsx');
var ScoreTab = require("./common/ScoreTab.jsx");
var ModelBuilder = require('./editors/ModelBuilder.jsx');
var PouchDB = require('pouchdb');
var MetricsAnalytics = require('./common/MetricsAnalytics.jsx');
var ReactEcharts = require('react-echarts-component');
var go = require('gojs');
var $ = go.GraphObject.make;

var myDiagram;

function canDrop(node1, node2) {
	if (!(node1 instanceof go.Node)) return false; // must be a Node
  if (node1 === node2) return false; // cannot work for yourself
  if (node2.isInTreeOf(node1)) return false; // cannot work for someone who works for you
  return true;
}

function closeNode(e, obj) {
	if (myDiagram.nodes.count == 1) {
		console.log('cant delete only node');
		return;
	}
	var clicked = obj.part;
	myDiagram.remove(clicked);
	myDiagram.commandHandler.zoomToFit();
	myDiagram.contentAlignment = go.Spot.Center;
}

function textStyle() {
	return {
		font: "9pt Avenir-Medium",
		stroke: "white"
	};
}

function findIcon(icon) {
	return '/images/icons-blue/contract.png';
}

var Dev = React.createClass({
	handleDoubleClick: function (e, obj) {
		console.log("did double click", e, obj);
	},
	onSelectionChanged: function(e) {
		console.log("on selection changed", e);
	},
	componentDidMount: function () {
		myDiagram = $(go.Diagram, "scoreModel",
			{
				initialContentAlignment: go.Spot.Center,
				initialAutoScale: go.Diagram.Uniform,
				allowDelete: false,
				"undoManager.isEnabled": true,
				validCycle: go.Diagram.CycleDestinationTree,
				maxSelectionCount: 1,
				layout: $(go.TreeLayout, {
					treeStyle: go.TreeLayout.StyleLastParents,
					arrangement: go.TreeLayout.ArrangementHorizontal,
					angle: 90,
					layerSpacing: 35,
					alternateAngle: 90,
					alternateLayerSpacing: 35,
					alternateAlignment: go.TreeLayout.AlignmentBus,
					alternateNodeSpacing: 20
				}),
				"ChangedSelection": this.onSelectionChanged,
			});
	myDiagram.addDiagramListener("Modified", function(e) {
		console.log('in listner?');
		return;
    var button = document.getElementById("SaveButton");
    if (button) button.disabled = !myDiagram.isModified;
    var idx = document.title.indexOf("*");
    if (myDiagram.isModified) {
      if (idx < 0) document.title += "*";
    } else {
      if (idx >= 0) document.title = document.title.substr(0, idx);
    }
  });
	myDiagram.addDiagramListener("BackgroundSingleClicked", function(e) {
		console.log("what the fack", e);
	});
		myDiagram.layout.commitNodes = function() {
			go.TreeLayout.prototype.commitNodes.call(myDiagram.layout);
			myDiagram.layout.network.vertexes.each(function(v) {
				if (v.node) {
					var shape = v.node.findObject("SHAPE");
					var colors = ["#87AFDE", "#87AFDE"];
					if (shape) shape.fill = $(go.Brush, "Linear", {
						0: colors[0],
						1: colors[1],
						start: go.Spot.Left,
						end: go.Spot.Right
					});
				}
			});
		}

		
		myDiagram.nodeTemplate =
			$(go.Node, "Auto", {
				},
				{ selectionAdornmentTemplate: $(go.Adornment, "Auto", 
					$(go.Shape, "RoundedRectangle", {
						fill: null,
						stroke: "dodgerblue",
						strokeWidth: 4
					},
					new go.Binding("stroke", "color")),
					$(go.Placeholder)
				)
			},
				{ doubleClick: this.handleDoubleClick },
				{ 
					mouseDragEnter: function(e, node, prev) {
						var diagram = node.diagram;
						var selnode = diagram.selection.first();
						if (!canDrop(selnode, node)) return;
						var shape = node.findObject("SHAPE");
						if (shape) {
							shape._prevFill = shape.fill;
							shape.fill = "#03387A";
						}
					}
				},
				{
					mouseDragLeave: function(e, node, next) {
						var shape = node.findObject("SHAPE");
						if (shape && shape._prevFill) {
							shape.fill = shape._prevFill;
						}
					}
				},
				{
					mouseDrop: function(e, node) {
						var diagram = node.diagram;
						var selnode = diagram.selection.first();
						var position = selnode.position;
						if (canDrop(selnode, node)) {
							var link = selnode.findTreeParentLink();
							if (link !== null) {
								link.fromNode = node;
								if (link.fromNode == node) {

								} else {
									setAlert("Component relationship updated!", "notice");
								}
							}
						} else {
							setAlert("Updated component link!", "notice");
							diagram.toolManager.linkingTool.insertLink(node, node.port, selnode, selnode.port);
						}
						myDiagram.contentAlignment = go.Spot.Center;
					}
				},
				new go.Binding("text", "name"),
				new go.Binding("layerName", "isSelected", function(sel) {
					return sel ? "Foreground" : "";
				}).ofObject(),
				$(go.Shape, "RoundedRectangle", {
					width: 200,
					height: 100,
					name: "SHAPE",
					fill: "white",
					stroke: null,
					portId: "",
					fromLinkable: false,
					toLinkable: false,
					cursor: "move",
				}),
				$(go.Panel ,{
					width: 200,
					height: 100
				},
				$(go.Picture, {
					click: closeNode
				}, {
					position: new go.Point(175, 5), 
					desiredSize: new go.Size(16, 16),
					source: '/images/cancel-button.png'
				}),
				$(go.TextBlock, textStyle(), {
					position: new go.Point(10, 10),
					desiredSize: new go.Size(170, 20),
					font: "12pt Avenir-Medium",
					textAlign: "center"
				},
				new go.Binding("text", "component").makeTwoWay()),
				$(go.Picture, {
					name: '/divide.png',
					position: new go.Point(79, 44),
					desiredSize: new go.Size(32, 32),

				}, new go.Binding("source", "name", findIcon)),
				$(go.TextBlock, "", textStyle(), {
					position: new go.Point(10, 80),
					desiredSize: new go.Size(85, 20),
					font: "11pt Avenir-Medium",
				},
				new go.Binding("text", "weight").makeTwoWay())
				)
			);
			myDiagram.linkTemplate = 
			$(go.Link, go.Link.Orthogonal, {
				corner: 5,
				relinkableFrom: true,
				relinkableTo: true
			},
			$(go.Shape, {
				strokeWidth: 4,
				stroke: "#E7E7E7"
			}));

		/*var model = $(go.Model);
		model.nodeDataArray = [
			{ name: "Test 1" },
			{ name: "Test 2" }
		];
		*/
		var nodeDataArray = [];
		var node = {
			key: 1,
			component: 'New Component',
			weight: "100",
			mode: "",
			operation: ""
		};
		nodeDataArray.push(node);
		var model = {
			class: 'go.TreeModel',
			nodeDataArray: nodeDataArray,
		}
		myDiagram.model = go.Model.fromJson(JSON.stringify(model));
		window.myDiagram = myDiagram;
	},
	getInitialState: function () {
		return { data: [], config: {} }
	},
	render: function () {
		return (
			<div id="scoreModel" style={{ width: 800, height: 500}}></div>
		);
	}
});

module.exports = Dev;
