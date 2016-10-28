var React = require('react');
var Divider = require('material-ui').Divider;
var Slider = require('material-ui').Slider;
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var FlatButton = require('material-ui').FlatButton;
var SettingsIcon = require('react-icons/lib/md/settings');
var List = require('material-ui').List;
var ListItem = require('material-ui').ListItem;
var DropDownMenu = require('material-ui').DropDownMenu;
var ModelBuilder = require('./ModelBuilder.jsx');
var EditIcon = require('react-icons/lib/md/edit');
var NormalizeIcon = require('react-icons/lib/fa/magic')
var WeightIcon = require('react-icons/lib/fa/balance-scale');
var AddChild = require('react-icons/lib/fa/plus-square');
var CalcIcon = require('react-icons/lib/fa/calculator');
var NodesIcon = require('react-icons/lib/ti/flow-merge');
var IconButton = require('material-ui').IconButton;
var Avatar = require('material-ui').Avatar;
var RcSlider = require('rc-slider');
var AddIcon = require('react-icons/lib/md/add');
var Checkbox = require('material-ui').Checkbox;
var MoreIcon = require('react-icons/lib/md/more-vert');
var IconMenu = require('material-ui').IconMenu;
var Toolbar = require('material-ui').Toolbar;
var ScoreBuilder = require('../editors/ScoreBuilder.jsx');
var Chip = require('material-ui').Chip;
var uuid = require('node-uuid');
var DataBrowser = require('../editors/DataBrowser.jsx');
var Popover = require('material-ui').Popover;
var Paper = require('material-ui').Paper;
var Card = require('material-ui').Card;
var CardTitle = require('material-ui').CardTitle;
var CardHeader = require('material-ui').CardHeader;
var CardText = require('material-ui').CardText;
var Menu = require('material-ui').Menu;
var MenuItem = require('material-ui').MenuItem;
var Toggle = require('material-ui').Toggle;
var Fluxxor = require('fluxxor');
var Colors = require('../../constants/colors.js');
var FluxMixin = Fluxxor.FluxMixin(React);
var Table = require('material-ui').Table;
var TableHeader = require('material-ui').TableHeader;
var TableRow = require('material-ui').TableRow;
var DataIcon = require('react-icons/lib/md/perm-data_setting');
var _ = require('underscore');
var StatEngine = require('../../utils/StatEngine.js');
var Dialog = require('material-ui').Dialog;
var MetricsAnalytics  = require('./MetricsAnalytics.jsx');
var TextField = require('material-ui').TextField;
var go = require('gojs');

var $ = go.GraphObject.make;
var kpiCount = 0;
var myDiagram;
// graph variables
var nodeIds, nodeList, nodes, edgeList, edges, network, options, nodeCounter, edgeCounter, currentNode, nodeToggles, nodeWeights;
var scoreModel;
var goModel;
this.showValue = 100;

function makeImagePath(icon) {
  if (icon == null) return '/images/icons/calculate.jpg';
  if (icon == -1) return '/images/score/root.png';
  return '/images/score/analytics-' + icon + '.png';
}

function makeWeightPath(data) {
    var value = parseInt(data.weight * 3.6);
    var size = (data.category == 'formula') ? 30 : 35;
    return new go.Geometry()
            .add(new go.PathFigure(size, size)
                .add(new go.PathSegment(go.PathSegment.Arc, 0, value, size, size, size, size)
            .close()));
                //});
}
function handleWeightColor(data) {
    if (data.norm) {
        return "#06D6A0";
    }
    return "#EF476F";
    //console.log('handle weigh?', data);
    //return "red";
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

function nodeWeight(key) {
    return nodeWeights[parseInt(key)] + "%";
}



var ScoreTab = React.createClass({
    mixins: [ FluxMixin ],
    componentWillUnmount: function() {
      myDiagram = null;
    },
    getInitialState: function() {

        return { showIconPopover: false, subscoreName: "", editId: null, showSubscoreDialog: false, kpiDialogOpen: false, nodeToggles: [true], nodeWeights: [100], loaded: false, formulas: [], uuid: uuid.v4(), usedMetrics: [], update: false, loadedMetrics: [], showPopover: false, x: 0, y: 0, currentNode: 0, currentSliderValue: 1 }
    },
    onSelectionChanged: function (e) {

    },
    editKpi: function(name, id, event) {
        this.setState({
            kpiDialogOpen: true,
            editId: id
        });
    },
    onKpiCheck: function(event, isInputChecked) {
        if (isInputChecked) {
            this.setState({
                loadedMetrics: this.state.loadedMetrics.concat(event.target.id)
            });
        } else {
            this.loadedMetrics = this.state.loadedMetrics;
            var metricToDelete = this.loadedMetrics.indexOf(event.target.id);
            var used = this.loadedMetrics.splice(metricToDelete, 1);
            this.setState({
                loadedMetrics: this.loadedMetrics,
                usedMetrics: this.state.usedMetrics.concat(used)
            });
        }
        this.onModelChange();
    },
    onCheckMetric: function(id, name, event, isChecked) {
        if (isChecked) {
            this.setState({
                loadedMetrics: this.state.loadedMetrics.concat(id)
            });
        } else {
            this.loadedMetrics = this.state.loadedMetrics;
            var metricToDelete = this.loadedMetrics.indexOf(id);
            var used = this.loadedMetrics.splice(metricToDelete, 1);
            this.setState({
                loadedMetrics: this.loadedMetrics,
            });
        }
    },
    renderDefinedKpis: function() {
        return (
            this.getFlux().store("DocumentStore").getState().formulasColl.find({cid: this.props.cid}).map(function(kpi) {
                return (
                    <ListItem
                        primaryText={kpi.name}
                        key={kpi.fid}
                        inputStyle={{color: Colors.MAIN}}
                        rightIconButton={
                            <IconButton onTouchTap={this.editKpi.bind(this, kpi.name, kpi.fid)}><EditIcon size={20}/></IconButton>
                        }
                        onTouchTap={this.editKpi.bind(this, kpi.name, kpi.fid)}
                        leftCheckbox={<Checkbox onCheck={this.onCheckMetric.bind(this, kpi.fid, kpi.name)}/>}
                        />
                );
            }.bind(this))
        )
    },
    onModelChange: function() {
        this.getFlux().store("DocumentStore").saveDatabase();
        this.getFlux().actions.calculateModel(this.props.cid);
    },
    addSubscore: function() {
        this.setState({ showSubscoreDialog: true, subScoreIcon: null, subscoreName: "", showPopover: false});
    },
    onToggle: function() {
        this.nodeToggles = this.state.nodeToggles;
        this.nodeToggles[this.state.currentNode] = !this.nodeToggles[this.state.currentNode];
        nodeToggles[this.state.currentNode] = !nodeToggles[this.state.currentNode];
        scoreModel.nodeToggles = nodeToggles;
        scoreModel.nodeList[this.state.currentNode].weight = !this.nodeToggles[this.state.currentNode];
        var node = myDiagram.selection.first();
        if (node) {
            var model = myDiagram.model;
            var data = node.data;
            myDiagram.startTransaction('modified norm');
            myDiagram.model.setDataProperty(data, "norm", nodeToggles[this.state.currentNode]);
            myDiagram.commitTransaction('modified norm');
        }
        this.onModelChange();
        this.setState({nodeToggles: this.nodeToggles});
    },
    onSliderChange: function(value) {
        myDiagram.model.updateTargetBindings();
    },
    onAfterChange: function(value) {
        if (value == false) alert('wtf');
        //this.nodeWeights = this.state.nodeWeights;
        //this.nodeWeights[this.state.currentNode] = value;
        nodeWeights[this.state.currentNode] = value;
        scoreModel.nodeList[this.state.currentNode].weight = value;
        scoreModel.nodeWeights = nodeWeights;//;scoreModel.nodeWeights.concat(value)
        var node = myDiagram.selection.first();
        if (node) {
            var model = myDiagram.model;
            var data = node.data;
            myDiagram.startTransaction("modified weight");
            myDiagram.model.setDataProperty(data, "weight", value);
            myDiagram.commitTransaction("modified weight");
        }
        myDiagram.updateAllTargetBindings("");
        this.onModelChange();
        this.setState({nodeWeights: nodeWeights});
         myDiagram.model.updateTargetBindings();

    },
    percentFormatter: function(v) {
        return `${v} %`;
    },
    initializeDiagram: function(props) {
      scoreModel = this.getFlux().store("DocumentStore").getScore(props.cid);
      console.log('score model', scoreModel);
      //console.log('init', scoreModel, scoreModel.nodeWeight);
      var nodeDataArray = [];
      if (typeof(scoreModel) == 'undefined' || scoreModel == null) {
          var node = {
              key: 0,
              id: 0,
              sid: uuid.v4(),
              component: "Model",
              weight: 100,
              parent: -1,
              norm: true,
              category: 'root',
              icon: -1
          };
          nodeDataArray.push(node);
          goModel = {
              class: 'go.TreeModel',
              nodeDataArray: nodeDataArray
          };
          scoreModel = {
              id: uuid.v4(),
              cid: this.props.cid,
              nodeList: nodeDataArray,
              modelName: "Property Score Model",
              nodeWeights: [100],
              nodeToggles: [true],
          };
          this.getFlux().store("DocumentStore").getState().modelsColl.insert(scoreModel);
          //scoreModel = this.getFlux().store("DocumentStore").getScore(this.props.cid);
      } else {
          scoreModel.nodeList.map(function(n, i) {
              var node = {
                  key: n.key,
                  id: n.id,
                  fid: n.fid,
                  cid: n.cid,
                  sid: n.sid,
                  parent: n.parent,
                  component: n.component,
                  weight: scoreModel.nodeWeights[i],
                  norm: scoreModel.nodeToggles[i],
                  category: n.category,
                  icon: n.icon
              }
              nodeDataArray.push(node);
          });
          goModel = {
              class: 'go.TreeModel',
              nodeDataArray: nodeDataArray
          };
      }
      nodeWeights = scoreModel.nodeWeights;//[100];
      nodeToggles = scoreModel.nodeToggles;//[true];
      console.log('my diagram is:', myDiagram);
    if (typeof(myDiagram) === 'undefined' || myDiagram == null) {
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
        toSpot: go.Spot.TopCenter,
        selectionAdorned: false
      },
      { doubleClick: this.handleDoubleClick },
      $(go.Picture,
        { maxSize: new go.Size(80, 80), click: this.handleDoubleClick, cursor: "context-menu" },
        new go.Binding("source", "icon", makeImagePath)),
        $(go.TextBlock, { font: "12pt Avenir-Medium", click: this.setCurrentNode, margin: 0, cursor: "pointer" },
          new go.Binding("text", "component")),
          {
              toolTip:
                $(go.Adornment, "Auto",
                    $(go.Shape, "Circle", { stroke: null, fill: "#073B4C" }),
                    $(go.TextBlock, { margin: 2, font: '12pt Avenir-Medium', stroke: "white" },
                        new go.Binding("text", "key", nodeWeight))
                 )
          }
        );
        //                    { source: '/images/score/analytics-8.png', margin: 20, width: 50, height: 50 }

        var nodeTemplate =
            $(go.Node, "Auto", { selectionAdorned: false },
              $(go.Panel, "Vertical",
                $(go.Panel, "Spot",
                    $(go.Shape, { fill: 'green', stroke: null},//stroke: 'green', strokeWidth: 10 },//, geometry:
                        new go.Binding("fill", "", handleWeightColor),
                        new go.Binding("geometry", "", makeWeightPath)),
                    $(go.Picture, { cursor: "context-menu", height: 60, width: 60, margin: 0, click: this.handleDoubleClick},
                        new go.Binding("source", "icon", makeImagePath))
                ),
                $(go.TextBlock, { font: "12pt Avenir-Medium", click: this.setCurrentNode, cursor: "pointer" }, new go.Binding("text", "component")),
                {
                    toolTip:
                    $(go.Adornment, "Auto",
                        $(go.Shape, "Circle", { stroke: null, fill: "#073B4C"}),
                        $(go.TextBlock, { margin: 0, font: '12pt Avenir-Medium', stroke: "white" },
                            new go.Binding("text", "key", nodeWeight))
                 )
                }
              )
            );
            var scoreTemplate =
                $(go.Node, "Auto", { selectionAdorned: false },
                  $(go.Panel, "Vertical",
                    $(go.Panel, "Spot",
                        $(go.Shape, { fill: 'green', stroke: null},//stroke: 'green', strokeWidth: 10 },//, geometry:
                            new go.Binding("fill", "", handleWeightColor),
                            new go.Binding("geometry", "", makeWeightPath)),
                        $(go.Picture, { cursor: "context-menu", height: 50, width: 50, margin: 0, click: this.handleDoubleClick},
                            new go.Binding("source", "icon", makeImagePath))
                    ),
                    $(go.TextBlock, { font: "12pt Avenir-Medium", click: this.setCurrentNode, cursor: "pointer" }, new go.Binding("text", "component")),
                    {
                        toolTip:
                        $(go.Adornment, "Auto",
                            $(go.Shape, "Circle", { stroke: null, fill: "#073B4C"}),
                            $(go.TextBlock, { margin: 0, font: '12pt Avenir-Medium', stroke: "white" },
                                new go.Binding("text", "key", nodeWeight))
                     )
                    }
                  )
                );
        var formulaTemplate =
            $(go.Node, "Horizontal",
                { background: Colors.LIME_GREEN },
                $(go.Picture,
                    { margin: 20, width: 50, height: 50 },
                    new go.Binding("source", "icon", makeImagePath)
                ),
                $(go.TextBlock, "Default Text",
                    { stroke: "white", font: "bold Roboto 24px" }
                )
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
  templmap.add("score", nodeTemplate);
  templmap.add("formula", scoreTemplate);
  templmap.add("", nodeTemplate);
  myDiagram.nodeTemplate = nodeTemplate;

  myDiagram.nodeTemplateMap = templmap;
  myDiagram.toolManager.hoverDelay = 300;

  myDiagram.linkTemplate =
    $(go.Link,
        { routing: go.Link.Orthogonal, corner: 7 },//, toShortLength: -2, fromShortLength: -2 },
        $(go.Shape, { strokeWidth: 3, stroke: '#888'}));
 /*
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
*/
  }
    if (typeof(goModel) !== 'undefined' && goModel !== null)
      myDiagram.model = go.Model.fromJson(JSON.stringify(goModel));

    window.myDiagram = myDiagram;
  },
    renderPopover: function() {
        var popoverStyle = {
            width: 300,
            position: 'absolute',
            zIndex: 9999999,
            top: this.state.y + 'px',
            left: (this.state.x - 150) + 'px',
        }
        //                        primaryText={<RcSlider onAfterChange={this.onAfterChange} tipFormatter={this.percentFormatter} defaultValue={nodeWeights[this.state.currentNode]} onChange={this.onSliderChange} />}

        if (typeof(nodeWeights) == 'undefined' || typeof(myDiagram) == 'undefined' || myDiagram == null) return;
        var selectedWeight = 100;
        var node = myDiagram.selection.first();
        if (node) {
            var model = myDiagram.model;
            var data = node.data;
            selectedWeight = node.data.weight;
            //myDiagram.selection.first().data.weight;
            //model.startTransaction("modified weight");
            //model.setDataProperty(data, "weight", value);
            //model.commitTransaction("modified weight");
        }
        //this.onModelChange();
        //this.setState({nodeWeights: this.nodeWeights});
        var showValue = myDiagram.findNodeForKey(this.state.currentNode).weight;
        return (
            <Popover
                open={this.state.showPopover}
                style={popoverStyle}
                anchorEl={this.vis}
                key={uuid.v4()}
                anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={this.handleClosePopover}
                animation={Popover.PopoverAnimationVertical}
                >

                <Divider />
                <List>
                    <ListItem leftIcon={<SettingsIcon />} disabled={true}>Configure</ListItem>
                    <Divider />

                    <ListItem leftIcon={<WeightIcon />}
                        disabled={true}
                        primaryText={<RcSlider onAfterChange={this.onAfterChange} tipFormatter={this.percentFormatter} defaultValue={nodeWeights[this.state.currentNode]} onChange={this.onSliderChange} />}
                        ></ListItem>
                    <ListItem primaryText="Normalize"
                        leftIcon={<NormalizeIcon />}
                        rightToggle={<Toggle onToggle={this.onToggle} toggled={nodeToggles[this.state.currentNode]}/>}
                        ></ListItem>
                      {(myDiagram.findNodeForKey(this.state.currentNode).category !== 'formula') ?
                        <div>
                    <ListItem
                        primaryText="Add Subscore"
                        leftIcon={<NodesIcon />}
                        onTouchTap={this.addSubscore}
                        >
                    </ListItem>
                    <ListItem
                        primaryText="Add KPI"
                        initiallyOpen={false}
                        leftIcon={<CalcIcon />}
                        primaryTogglesNestedList={true}
                        nestedItems={this.state.loadedMetrics.map(function(metric) {
                            return (
                                <ListItem onTouchTap={this.addNode.bind(this, this.state.currentNode, metric)} key={uuid.v4()} primaryText={this.getFlux().store("DocumentStore").getState().formulasColl.findOne({fid: metric}).name} />
                            );
                        }.bind(this))}
                        >
                    </ListItem>
                  </div>
                    :
                    null}

                </List>
            </Popover>
        );
    },
    onCheckChange: function(parent, kpi, event, isInputChecked) {
        if (isInputChecked) {
            this.addNode(parent, kpi);
        } else {
            this.removeNode(parent, kpi);
        }
        this.onModelChange();
    },
    addNode: function(parent, kpi) {
        var label = this.state.subscoreName;
        var type = "node";
        var id = 0;
        var shape = 'diamond';
        var icon = "0";
        if (kpi != null && kpi.length > 0) {
            var formula = this.getFlux().store("DocumentStore").getState().formulasColl.findOne({fid: kpi});
            label = formula.name;//this.getFlux().store("DocumentStore").getState().formulasColl.findOne({fid: kpi}).name;
            type = "formula";
            id = kpi;
            shape = 'dot';
            icon = (formula.icon) ? formula.icon : "1";
        }
        var id = (myDiagram.model.nodeDataArray.length);//.toString();
        var newNode;
        if (kpi != null && kpi.length > 0) {
            newNode = {
                key: id,
                id: id,
                type: type,
                fid: kpi,
                parent: parent,
                weight: 100,
                norm: true,
                shape: shape,
                label: label,
                component: label,
                category: 'formula',
                icon: icon
            };
        } else {
            var sid = uuid.v4();
           // scoreModel['nodeList'] = scoreModel.nodeList.concat({
              newNode = {
                key: id,
                id: id,
                parent: parent,
                component: label,
                weight: 100,
                norm: true,
                type: type,
                sid: sid,
                label: label,
                shape: shape,
                category: 'score',
                icon: this.state.newScoreIcon
            };
        }
        //scoreModel.nodeList = scoreModel.nodeList.concat(newNode);
        myDiagram.startTransaction("add component");
        myDiagram.model.addNodeData(newNode);
        myDiagram.model.setParentKeyForNodeData(newNode, parent);
        //myDiagram.model.addLinkData(newLink);
        myDiagram.commitTransaction("add component");
        myDiagram.commandHandler.zoomToFit();
        scoreModel.nodeList = myDiagram.model.nodeDataArray;
        myDiagram.contentAlignment = go.Spot.Center;
        scoreModel.nodeWeights = scoreModel.nodeWeights.concat(100);
        scoreModel.nodeToggles = scoreModel.nodeToggles.concat(true);
        nodeToggles = nodeToggles.concat(true);
        nodeWeights = nodeWeights.concat(100);

        this.setState({
            nodeToggles: this.state.nodeToggles.concat(true),
            nodeWeights: this.state.nodeWeights.concat(100),
            showPopover: false,
            currentNode: parseInt(id),
            subScoreIcon: null,
        });
        this.getFlux().store("DocumentStore").getState().modelsColl.update(scoreModel);
        this.getFlux().actions.calculateModel(this.props.cid);
        //scoreModel = this.getFlux().store("DocumentStore").getScore(this.props.cid);
        //this.getFlux().store("DocumentStore").getState().modelsColl.update(scoreModel);
        //scoreModel = this.getFlux().store("DocumentStore").g
        //this.props.modelsColl.update(scoreModel);
        window.scoreModel = scoreModel;
    },
    getNestedItems: function() {
        var items = [];
        this.state.loadedMetrics.map(function(m) {
            var idx = this.props.formulas.map((kpi) => kpi.id).indexOf(m);
            var kpi = this.props.formulas[idx];
            items.push(<ListItem key={kpi.id} primaryText={kpi.name} style={{fontSize: 12}} leftCheckbox={<Checkbox onCheck={this.onCheckChange.bind(this, this.state.currentNode, kpi.name)}/>} />);
        }.bind(this));
        return items;
    },
    doNodeDeselect: function(params) {
        this.setState({
            showPopover: false,
            currentNode: null
        });
    },
    componentDidMount: function() {
        this.initializeDiagram(this.props);
        //this.loadScoreTree();
    },
    componentDidUpdate: function(prevProps, prevState) {
      if (this.props.cid !== prevProps.cid)
        this.initializeDiagram(newProps);
        //this.loadScoreTree();
    },
    doSetNode: function(params) {
        if (params.nodes.length == 0) return;
        var node = params.nodes[0];
        this.setState({
            currentNode: node
        });
        currentNode = node;
    },
    handleDoubleClick: function(e, obj) {
        this.setState({
            showPopover: true,
            currentNode: parseInt(obj.part.data.key),
            x: e.Dq.clientX,
            y: e.Dq.clientY
        });
    },
    setCurrentNode: function(e, obj) {
      this.setState({
        currentNode: parseInt(obj.part.data.key)
      });
    },
    showContextMenu: function(e) {
        this.setState({
            showPopover: true,
            currentNode: e.subject.part.data.id,//parseInt(obj.part.data.key),
            x: e.Dq.clientX,
            y: e.Dq.clientY
        });
    },
    handleClosePopover: function(event) {
        this.setState({
            showPopover: false
        });
    },
    renderTree: function() {
        return (
          <div>
            <div
                id="scoreModel"
                style={{ height: "calc(100vh - 550px)", backgroundColor: Colors.LIGHT }}
                >
            </div>
            <div style={{height: 100, width: 200, top: 0, zIndex: 100, backgroundColor: Colors.LIGHT, position: 'absolute'}}></div>
        </div>

        );
    },
    onKpiAdd: function() {
        this.setState({
            kpiDialogOpen: !this.state.kpiDialogOpen,
            editId: null
        });
    },
    handleClose: function() {
        this.setState({
            kpiDialogOpen: false,
            editId: null
        });
    },
    handleTextUpdate: function(event, value) {
        this.setState({ subscoreName: value});
    },
    handleSubscoreClose: function() {
        this.setState({ showSubscoreDialog: false});
    },
    toggleIconPopover: function(event) {
        event.preventDefault();
        this.setState({
            showIconPopover: true,
            anchorEl: event.currentTarget,
            newScoreIcon: null
        });
    },
    closeIconPopover: function() {
        this.setState({
            showIconPopover: false
        });
    },
    setSubScoreIcon: function(event) {
        this.setState({
            newScoreIcon: event.currentTarget.id,
            showIconPopover: false
        });
    },
    renderIconDropdown: function() {
        var items = [];
        for (var i = 1; i < 150; i++) {
            items.push(i);
        }
        return (
            <div>
                <IconButton onTouchTap={this.toggleIconPopover} style={{height: 60, width: 60, backgroundColor: "white"}}>
                    <Avatar color="white" backgroundColor="white" style={{backgroundColor: "white"}} src={(this.state.newScoreIcon) ? '/images/score/analytics-' + this.state.newScoreIcon + '.png' : '/images/metrics/add.png'} />
                </IconButton>
                <Popover
                    open={this.state.showIconPopover}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                      targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.closeIconPopover}
                >
                    <div style={{width: 300, height: 300}}>
                        {items.map(function(i) {
                            return (
                                <IconButton id={i} key={i} onTouchTap={this.setSubScoreIcon} style={{margin: 4, height: 60, width: 60}}>
                                    <Avatar src={'/images/score/analytics-' + i + '.png'} />
                                </IconButton>
                            );
                        }.bind(this))}
                    </div>
                </Popover>
            </div>
        );
    },
    handleSubscoreSave: function() {
        this.addNode(this.state.currentNode, null);
        this.setState({ showSubscoreDialog: false });
    },
    //scopeProperties={this.state.scopeProperties} contextId={this.props.params.id} kpiEdit={this.state.kpiEdit} metricsColl={this.state.metricsColl} formulasColl={this.state.formulasColl} doKpiSave={this.doKpiSave} handleClose={this.handleKpiClose}/>
    render: function() {
        if (typeof(myDiagram) !== 'undefined' && myDiagram)
            myDiagram.model.updateTargetBindings();

        var actions = [
        <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={this.handleSubscoreClose}
            />,
        <FlatButton
            label="Save"
            primary={true}
            onTouchTap={this.handleSubscoreSave}
            />
        ];
        return (
            <div ref={(ref) => this.vis = ref} >
                <Dialog
                    modal={true}
                    open={this.state.kpiDialogOpen}
                    onRequestClose={this.handleKpiClose}
                    autoScrollBodyContent={true}
                    contentStyle={{height: "95vh", maxWidth: 'none'}}
                    >
                <MetricsAnalytics cid={this.props.cid} fid={this.state.editId} handleClose={this.handleClose} />
                </Dialog>
                <Dialog
                    title="Create Subscore"
                    open={this.state.showSubscoreDialog}
                    modal={true}
                    actions={actions}
                    onRequestClose={this.handleSubscoreClose}
                    >
                    <Row>
                        <Col md={1}></Col>
                        <Col md={6}>
                            <TextField value={this.state.subscoreName} onChange={this.handleTextUpdate} fullWidth={true} hintText="Subscore Name" floatingLabelText="Subscore Name"/>
                        </Col>
                        <Col md={4} style={{marginTop: 15}}>
                            {this.renderIconDropdown()}
                        </Col>
                        <Col md={1}>
                        </Col>
                    </Row>
                </Dialog>
                {this.renderPopover()}
                <Col className="tab-col" md={3}>
                    <div className="tab-content" style={{backgroundColor: 'white' }}>
                        <Row>
                            <Col md={12}>
                                <div className="title med small-pad center">Custom KPIs</div>
                                <Divider />
                                <List>
                                    <ListItem
                                        leftIcon={<DataIcon style={{color: Colors.MAIN}}/>}
                                        primaryText="Create KPI"
                                        key={uuid.v4()}
                                        secondaryText="Define custom metric"
                                        disabled={true}
                                        rightIconButton={<IconButton tooltip="New" tooltipPosition="bottom-left" touch={true} style={{color: Colors.GREEN_BASE}} onTouchTap={this.onKpiAdd}><AddIcon size={20}/></IconButton>}
                                        />
                                    {this.renderDefinedKpis()}
                                </List>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col className="tab-col" md={9}>
                    <div className="tab-content">
                        <Row style={{marginTop: 0}}>
                            <Col md={12}>
                                {this.renderTree()}
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <DataBrowser node={(typeof(scoreModel) === 'undefined') ? null : scoreModel.nodeList[this.state.currentNode]} cid={this.props.cid} currentNode={this.state.currentNode} />
                            </Col>
                        </Row>
                    </div>
                </Col>
            </div>
        );
    }
});

module.exports = ScoreTab;
