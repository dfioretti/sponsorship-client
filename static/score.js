$(document).ready(function() {
  // fire setup only if on editor page
  if ( $('#myDiagram').length ) {
      console.log("score editor view");
  }

});

function setDrillButtonText(text) {
  var textHolder = $('#drill-button').find('span.text');
  textHolder.text(text);
}

function getDrillButtonText() {
  var textHolder = $('#drill-button').find('span.text');
  return textHolder.text();
}

function resetDrillData() {
  //$('#drill-data').data('id', null);
  //$('#drill-data').data('path', null);
  var data = [{
    "id": 0,
    "name": "Survey",
    "list": [{
      "id": 0,
      "name": "Scarborough",
      "list": [{
        "id": 0,
        "name": "Avid Fan Index"
      }, {
        "id": 0,
        "name": "Avid Fan Count"
      }, {
        "id": 0,
        "name": "Casual Fan Index"
      }, {
        "id": 0,
        "name": "Casual Fan Count"
      }]
    }, {
      "id": 0,
      "name": "Nielsen"
    }, {
      "id": 0,
      "name": "Simmons"
    }, {
      "id": 0,
      "name": "Repucom"
    }]
  }, {
    "id": 2,
    "name": "Social",
    "list": [{
      "id": 2,
      "name": "Twitter",
      "list": [{
        "id": 2,
        "name": "Follower Count"
      }, {
        "id": 2,
        "name": "Post Frequency"
      }, {
        "id": 2,
        "name": "Average Retweets"
      }]
    }, {
      "id": 3,
      "name": "Facebook",
      "list": [{
        "id": 3,
        "name": "Fan Count"
      }, {
        "id": 3,
        "name": "Post Frequency"
      }]
    }, {
      "id": 4,
      "name": "Instagram",
      "list": [{
        "id": 4,
        "name": "Follower Count"
      }, {
        "id": 4,
        "name": "Post Frequency"
      }]
    }]
  }];
  /*
  $('#drill-button').drilldownSelect(
    {
      appendValue: false,
      data: data,
      textBack: 'Previous...'
    });
    */

}

// all gojs code
function initilizeScoreCanvas(savedModel) {
  resetDrillData();
  if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this
  var _$ = go.GraphObject.make; // for conciseness in defining templates

  myDiagram =
    _$(go.Diagram, "myDiagram", // must be the ID or reference to div
      {
        initialContentAlignment: go.Spot.Center,
        initialAutoScale: go.Diagram.Uniform,
        allowDelete: false,
        // make sure users can only create trees
        validCycle: go.Diagram.CycleDestinationTree,
        // users can select only one part at a time
        maxSelectionCount: 1,
        layout: _$(go.TreeLayout, {
          treeStyle: go.TreeLayout.StyleLastParents,
          arrangement: go.TreeLayout.ArrangementHorizontal,
          // properties for most of the tree:
          angle: 90,
          layerSpacing: 35,
          // properties for the "last parents":
          alternateAngle: 90,
          alternateLayerSpacing: 35,
          alternateAlignment: go.TreeLayout.AlignmentBus,
          alternateNodeSpacing: 20
        }),
        // support editing the properties of the selected person in HTML
        "ChangedSelection": onSelectionChanged,
        // enable undo & redo
        "undoManager.isEnabled": true
      });


  // when the document is modified, add a "*" to the title and enable the "Save" button
  myDiagram.addDiagramListener("Modified", function(e) {
    var button = document.getElementById("SaveButton");
    if (button) button.disabled = !myDiagram.isModified;
    var idx = document.title.indexOf("*");
    if (myDiagram.isModified) {
      if (idx < 0) document.title += "*";
    } else {
      if (idx >= 0) document.title = document.title.substr(0, idx);
    }
  });

  // override TreeLayout.commitNodes to also modify the background brush based on the tree depth level
  myDiagram.layout.commitNodes = function() {
    go.TreeLayout.prototype.commitNodes.call(myDiagram.layout); // do the standard behavior
    // then go through all of the vertexes and set their corresponding node's Shape.fill
    // to a brush dependent on the TreeVertex.level value
    myDiagram.layout.network.vertexes.each(function(v) {
      if (v.node) {
        var shape = v.node.findObject("SHAPE");
        var colors = ["#87AFDE", "#87AFDE"];
        if (shape) shape.fill = _$(go.Brush, "Linear", {
          0: colors[0],
          1: colors[1],
          start: go.Spot.Left,
          end: go.Spot.Right
        });
      }
    });
  }

  // when a node is double-clicked, add a child to it
  function nodeDoubleClick(e, obj) {
    // TODO: make this setup properly...
    var clicked = obj.part;
    if (clicked !== null) {
      var thisemp = clicked.data;
      myDiagram.startTransaction("add component");
      var nextkey = (myDiagram.model.nodeDataArray.length + 1).toString();
      var newemp = {
        key: nextkey,
        title: "",
        mode: "",
        icon: "new",
        parent: thisemp.key
      };
      myDiagram.model.addNodeData(newemp);
      myDiagram.commitTransaction("add component");
      //myDiagram.initialContentAlignment = go.Spot.Center;
      //initialContentAlignment: go.Spot.Center,
      myDiagram.commandHandler.zoomToFit();
      myDiagram.contentAlignment = go.Spot.Center;

      //myDiagram.contentAlignment = go.Spot.Center;
      setAlert('New subcomponent added!', "notice");
    }
  }


  /*
  * Removes the selected node on close clicked
  * Not recursive - only deletes the single node
  */
  function closeNode(e, obj) {
    if (myDiagram.nodes.count == 1) {
      setAlert('Scores require at least one component!', 'error');
      return;
    }
    var clicked = obj.part;
    myDiagram.remove(clicked);
    myDiagram.commandHandler.zoomToFit();
    myDiagram.contentAlignment = go.Spot.Center;
    setAlert('Successfully deleted component!', 'notice');
  }


  // this is used to determine feedback during drags
  function mayWorkFor(node1, node2) {
    if (!(node1 instanceof go.Node)) return false; // must be a Node
    if (node1 === node2) return false; // cannot work for yourself
    if (node2.isInTreeOf(node1)) return false; // cannot work for someone who works for you
    return true;
  }

  // This function provides a common style for most of the TextBlocks.
  // Some of these values may be overridden in a particular TextBlock.
  function textStyle() {
    return {
      font: "9pt Avenir-Medium",
      stroke: "white"
    };
  }

  function findIcon(icon) {
    if (icon.indexOf('/icon') !== -1) {
      return icon;
    }
    return "/images/icons-blue/" + icon + ".png";
  }
  // This converter is used by the Picture.
  function findHeadShot(key) {
    //return "";
    //if (key > 16) return ""; // There are only 16 images on the server
    return "/images/cancel-button.png";
  };


  // define the Node template
  myDiagram.nodeTemplate =
    _$(go.Node, "Auto", {
      }, {
        selectionAdornmentTemplate: _$(go.Adornment, "Auto",
          _$(go.Shape, "RoundedRectangle", {
              fill: null,
              stroke: "dodgerblue",
              strokeWidth: 4
            },
            new go.Binding("stroke", "color")),
          _$(go.Placeholder)
        )
      }, {
        doubleClick: nodeDoubleClick
      }, { // handle dragging a Node onto a Node to (maybe) change the reporting relationship
        mouseDragEnter: function(e, node, prev) {
          var diagram = node.diagram;
          var selnode = diagram.selection.first();
          if (!mayWorkFor(selnode, node)) return;
          var shape = node.findObject("SHAPE");
          if (shape) {
            shape._prevFill = shape.fill; // remember the original brush
            shape.fill = "#03387A";
          }
        },
        mouseDragLeave: function(e, node, next) {
          var shape = node.findObject("SHAPE");
          if (shape && shape._prevFill) {
            shape.fill = shape._prevFill; // restore the original brush
          }
        },
        mouseDrop: function(e, node) {
          var diagram = node.diagram;
          var selnode = diagram.selection.first(); // assume just one Node in selection
          var position = selnode.position;
          if (mayWorkFor(selnode, node)) {
            // find any existing link into the selected node
            var link = selnode.findTreeParentLink();
            if (link !== null) { // reconnect any existing link
              link.fromNode = node;
              if (link.fromNode == node) {
                //setAlert("Relationships must alter the parent node!", "error");
              } else {
                setAlert("Component realtionship updated!", "notice");
              }
            } else { // else create a new link
              setAlert("Updated component link!", "notice");
              diagram.toolManager.linkingTool.insertLink(node, node.port, selnode, selnode.port);
            }
          }
          //selnode.position = position;
          //var model = myDiagram.model;
          //model.startTransaction("align drop");
          //model.setDataProperty(selnode, "position", new go.Point(100, 100));
          //model.commitTransaction("align drop");
          myDiagram.contentAlignment = go.Spot.Center;
        }
      },
      // for sorting, have the Node.text be the data.name
      new go.Binding("text", "name"),
      // bind the Part.layerName to control the Node's layer depending on whether it isSelected
      new go.Binding("layerName", "isSelected", function(sel) {
        return sel ? "Foreground" : "";
      }).ofObject(),
      // define the node's outer shape
      _$(go.Shape, "RoundedRectangle", {
        width: 200,
        height: 100,
        name: "SHAPE",
        fill: "white",
        stroke: null,
        // set the port properties:
        portId: "",
        fromLinkable: false,
        toLinkable: false,
        cursor: "move",
      }),
      _$(go.Panel, {
          width: 200,
          height: 100
        }, // panel is the main container
        _$(go.Picture, {
          click: closeNode
        }, {
          position: new go.Point(175, 5),
          desiredSize: new go.Size(16, 16),
          source: '/cancel-button.png'
        }), // end picture
        _$(go.TextBlock, textStyle(), {
            position: new go.Point(10, 10),
            desiredSize: new go.Size(170, 20),
            font: "12pt Avenir-Medium",
            textAlign: "center"
          },
          new go.Binding("text", "component").makeTwoWay()),
        _$(go.Picture, {
          name: '/divide.png',
          position: new go.Point(79, 44),
          desiredSize: new go.Size(32, 32),
          //icon: '/divide.png'
          // i think i can bind the source to a key or ID or something
          //source: '/divide.png'
        }, new go.Binding('source', 'name', findIcon)),
        _$(go.TextBlock, "", textStyle(), {
            position: new go.Point(10, 80),
            desiredSize: new go.Size(85, 20),
            font: "11pt Avenir-Medium",
          },
          new go.Binding("text", "weight").makeTwoWay())
      )
    );

  // define the Link template
  myDiagram.linkTemplate =
    _$(go.Link, go.Link.Orthogonal, {
        corner: 5,
        relinkableFrom: true,
        relinkableTo: true
      },
      _$(go.Shape, {
        strokeWidth: 4,
        stroke: "#E7E7E7"
      })); // the link shape

  // read in the JSON-format data from the "mySavedModel" element
  load(savedModel);
}

/*
 * onSelectionChanged updates the component Details
 * view if it is a node, otherwise swapps the
 * component detail view
 */
function onSelectionChanged(e) {
  flux.actions.scoreNodeChanged(e.diagram.selection.first());
  return;
  console.log("selection changed");
  var node = e.diagram.selection.first();
  if (node instanceof go.Node) {
    $('#score-data').hide();
    $('#component-data').show();
    resetDrillData();
    $('#operation').val(node.data.operation);
    $('#component-name').val(node.data.component);
    $('#normalization-select').val(node.data.normalization);
    setDrillButtonText(node.data.dataname)
    var x = $("#weight-slider").slider();
    if (!isNaN(node.data.weight))
      x.slider('setValue', node.data.weight);
    if (node.data.mode === 'parent') {
      $('#parent-click').click();
    } else if (node.data.mode === 'value') {
      $('#drill-data').data('id', node.data.name);
      $('#value-click').click();
    } else {
      $('.score-component-radio input').removeAttr('checked');
      $('#parent').hide();
      $('#value').hide();
    }
  } else {
      $('#score-data').show();
      $('#component-data').hide();
    //pdateComponentDetails();
  }
}

/*
 * updateComponentDetails swaps out the
 * details panel - this may be verbose
 */
function updateComponentDetails() {
  console.log("TODO: create the detail container");
}

// Update the data fields when the text is changed
function updateData(text, field) {
  var node = myDiagram.selection.first();
  if (node === null) {
    return;
  }
  var data = node.data;
  if (node instanceof go.Node && data !== null) {
    var model = myDiagram.model;
    model.startTransaction("modified " + field);
    if (field === "icon")
      model.setDataProperty(data, "name", text);
    if (field === "component") {
      model.setDataProperty(data, "component", text);
    } else if (field === "weight") {
      model.setDataProperty(data, "weight", text);
    } else if (field === "comments") {
      model.setDataProperty(data, "comments", text);
    } else if (field === "mode") {
      model.setDataProperty(data, "mode", text);
    } else if (field === "normalization") {
      model.setDataProperty(data, "normalization", text);
    } else if (field === "operation") {
      model.setDataProperty(data, "operation", text);
    } else if (field == "dataname") {
      model.setDataProperty(data, "dataname", text);
    }
    model.commitTransaction("modified " + field);
  }
}

// Show the diagram's model in JSON format
function save() {
  document.getElementById("mySavedModel").value = myDiagram.model.toJson();
  myDiagram.isModified = false;
}

function reload() {
  save();
  myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
}

function zoomIn() {
  var currentScale = myDiagram.scale;
  myDiagram.scale = (currentScale + 0.1);
}

function zoomOut() {
  myDiagram.scale = myDiagram.scale - 0.1;
}

function load(savedModel) {
  if ( savedModel != null ) {
    myDiagram.model = go.Model.fromJson(JSON.stringify(savedModel));
  } else { // i'm bad at escaping strings in javascript literals, so what fuck you
    var model = {};
    var nodeDataArray = [];
    var node = {};
    node['key'] = 1;
    node['component'] = 'New Component';
    //node['name'] = 'New Element';
    node['weight'] = "100";
    node['mode'] = "";
    node['operation'] = "";
    nodeDataArray.push(node);
    model['class'] = "go.TreeModel";
    model['nodeDataArray'] = nodeDataArray;
    myDiagram.model = go.Model.fromJson(JSON.stringify(model));
  }
}

/*
 * Setup and display an alert to the user based on an interaction
 */
function setAlert(text, type) {
  //$('#message').stop(true);
  $('#message').hide();
  if (type === "notice") {
    $('#message').css('color', '#50e3c2');
  } else if (type === "error") {
    $('#message').css('color', '#e76959');
  } else if (type === "alert") {
    $('#message').css('color', '#f5a623');
  } else {
    $('#message').css('color', '#50e3c2');
  }
  $('#message').text(text);
  $('#message').fadeIn(100).delay(3000).fadeOut(2000);
}
