var Colors = require('../../constants/colors.js');
var React = require('react');

var go = require('gojs');

//const setAlert = require('setAlert');

var $ = go.GraphObject.make;
var kpiCount = 0;

var myDiagram;

function makeImagePath(icon) {
  if (icon == 'root') return '/images/score/root.png';
  if (icon == 'diamond') return '/images/icons/calculate.png';
  var ret = '/images/icons/presentation-' + kpiCount + '.png';
  kpiCount += 1;
  if (kpiCount == 8) {
    kpiCount = 0;
  }
  return ret;
}

function canDrop(node1, node2) {
  if (!(node1 instanceof go.Node)) return false; // must be a Node
  if (node1 === node2) return false; // cannot work for yourself
  if (node2.isInTreeOf(node1)) return false; // cannot work for someone who works for you
  return true;
}

function closeNode(e, obj) {
  if (myDiagram.nodes.count == 1) {
    //console.log('cant delete only node');
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

var ModelBuilder = React.createClass({
  handleDoubleClick: function (e, obj) {
    this.props.onDoubleClick(e, obj);
  },
  onSelectionChanged: function (e) {
  },
  componentDidMount: function () {
    console.log('hmm', this.props);
    this.updateGraph();
  },
  componentDidUpdate: function () {
    this.updateGraph();
  },
  updateGraph: function () {
    if (typeof(myDiagram) === 'undefined') {
      myDiagram = $(go.Diagram, "scoreModel",
      {
        initialContentAlignment: go.Spot.Center,
        initialAutoScale: go.Diagram.Uniform,
        allowDelete: true,
        "undoManager.isEnabled": true,
        validCycle: go.Diagram.CycleDestinationTree,
        maxSelectionCount: 1,
        layout: $(go.TreeLayout, {
          treeStyle: go.TreeLayout.StyleLastParents,
          arrangement: go.TreeLayout.ArrangementHorizontal,
          angle: 90,
          nodeSpacing: 50,
          layerSpacing: 35,
          alternateAngle: 90,
          alternateLayerSpacing: 35,
          alternateAlignment: go.TreeLayout.AlignmentBus,
          alternateNodeSpacing: 20
        }),
        "ChangedSelection": this.onSelectionChanged,
      });
      myDiagram.addDiagramListener("Modified", function (e) {
        return;
      });
      myDiagram.addDiagramListener("BackgroundSingleClicked", function (e) {
        return;
      });
      myDiagram.layout.commitNodes = function () {
        go.TreeLayout.prototype.commitNodes.call(myDiagram.layout);
        myDiagram.layout.network.vertexes.each(function (v) {
          if (v.node) {
            var shape = v.node.findObject("SHAPE");
            var colors = [Colors.LIGHT, Colors.LIGHT];//["#87AFDE", "#87AFDE"];
            if (shape) shape.fill = $(go.Brush, "Linear", {
              0: colors[0],
              1: colors[1],
              start: go.Spot.Left,
              end: go.Spot.Right
            });
          }
        });
      }

      var rootTemplate =
      $(go.Node, "Vertical",
      {
        fromSpot: go.Spot.BottomCenter,
        toSpot: go.Spot.TopCenter
      },
      { doubleClick: this.handleDoubleClick },
      $(go.Picture,
        { maxSize: new go.Size(50, 50) },
        new go.Binding("source", "category", makeImagePath)),
        $(go.TextBlock, { margin: 4 },
          new go.Binding("text", "component"))
        );
        var subTemplate =
        $(go.Node, "Auto",
        $(go.Shape, "Diamond", {
          width: 200,
          height: 100,
          name: "SHAPE",
          fill: "white",
          stroke: null,
          portId: "",
          fromLinkable: false,
          toLinkable: false,
          cursor: "move",
        },
        new go.Binding("fill", "color")),
        $(go.TextBlock,
          new go.Binding("text", "key")),
          {
            toolTip:
            $(go.Adornment, "Auto",
            $(go.Shape, { fill: "#FFFFCC" }),
            $(go.TextBlock, { margin: 4 },
              new go.Binding("text", "component"))
            )
          }
        );
        var detailtemplate =
        $(go.Node, "Auto",
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
        },
        new go.Binding("fill", "color")),
        $(go.Panel, "Table",
        { defaultAlignment: go.Spot.Left },
        $(go.TextBlock, { row: 1, column: 0, font: "11pt Avenir-Medium" }, "KPI:"),
        $(go.TextBlock, { row: 1, column: 1, font: "11pt Avenir-Medium" }, new go.Binding("text", "component")),
        $(go.TextBlock, { row: 2, column: 0, font: "11pt Avenir-Medium" }, "Weight:"),
        $(go.TextBlock, { row: 2, column: 1, font: "11pt Avenir-Medium" }, new go.Binding("text", "weight"))
      )
    );
    var metricTemplate =
    $(go.Node, "Auto", {
    },
    {
      selectionAdornmentTemplate: $(go.Adornment, "Auto",
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
    mouseDragEnter: function (e, node, prev) {
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
    mouseDragLeave: function (e, node, next) {
      var shape = node.findObject("SHAPE");
      if (shape && shape._prevFill) {
        shape.fill = shape._prevFill;
      }
    }
  },
  {
    mouseDrop: function (e, node) {
      var diagram = node.diagram;
      var selnode = diagram.selection.first();
      var position = selnode.position;
      if (canDrop(selnode, node)) {
        var link = selnode.findTreeParentLink();
        if (link !== null) {
          link.fromNode = node;
          if (link.fromNode == node) {

          } else {
            //setAlert("Component relationship updated!", "notice");
          }
        }
      } else {
        //setAlert("Updated component link!", "notice");
        diagram.toolManager.linkingTool.insertLink(node, node.port, selnode, selnode.port);
      }
      myDiagram.contentAlignment = go.Spot.Center;
    }
  },
  new go.Binding("text", "name"),
  new go.Binding("layerName", "isSelected", function (sel) {
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
  $(go.Panel, {
    width: 200,
    height: 100
  },
  $(go.Picture, {
    click: closeNode
  }, {
    position: new go.Point(175, 5),
    desiredSize: new go.Size(0, 0),
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
    position: new go.Point(75, 44),
    desiredSize: new go.Size(50, 50),

  }, new go.Binding("source", "category", makeImagePath)),
  $(go.TextBlock, "%", textStyle(), {
    position: new go.Point(10, 80),
    desiredSize: new go.Size(85, 20),
    font: "11pt Avenir-Medium",
  },
  new go.Binding("text", "weight").makeTwoWay())
)
);

  var templmap = new go.Map("string", go.Node);
  templmap.add("root", rootTemplate);
  templmap.add("score", rootTemplate);
  templmap.add("formula", rootTemplate);
  myDiagram.nodeTemplateMap = templmap;
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
  }
    //console.log('whyyy', this.props.goModelDef);
    if (typeof(this.props.goModel) !== 'undefined' && this.props.goModel !== null)
      myDiagram.model = go.Model.fromJson(JSON.stringify(this.props.goModel));
  },
  render: function () {
    return (
      <div
        id="scoreModel"
        style={{ height: 530, backgroundColor: Colors.LIGHT }}>
      </div>
    );
  }
});

module.exports = ModelBuilder;
