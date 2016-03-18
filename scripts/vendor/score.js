function setDrillButtonText(e) {
    var o = $("#drill-button").find("span.text");
    o.text(e)
}

function getDrillButtonText() {
    var e = $("#drill-button").find("span.text");
    return e.text()
}

function resetDrillData() {
    var e = [{
        id: 0,
        name: "Survey",
        list: [{
            id: 0,
            name: "Scarborough",
            list: [{
                id: 0,
                name: "Avid Fan Index"
            }, {
                id: 0,
                name: "Avid Fan Count"
            }, {
                id: 0,
                name: "Casual Fan Index"
            }, {
                id: 0,
                name: "Casual Fan Count"
            }]
        }, {
            id: 0,
            name: "Nielsen"
        }, {
            id: 0,
            name: "Simmons"
        }, {
            id: 0,
            name: "Repucom"
        }]
    }, {
        id: 2,
        name: "Social",
        list: [{
            id: 2,
            name: "Twitter",
            list: [{
                id: 2,
                name: "Follower Count"
            }, {
                id: 2,
                name: "Post Frequency"
            }, {
                id: 2,
                name: "Average Retweets"
            }]
        }, {
            id: 3,
            name: "Facebook",
            list: [{
                id: 3,
                name: "Fan Count"
            }, {
                id: 3,
                name: "Post Frequency"
            }]
        }, {
            id: 4,
            name: "Instagram",
            list: [{
                id: 4,
                name: "Follower Count"
            }, {
                id: 4,
                name: "Post Frequency"
            }]
        }]
    }];
    $("#drill-button").drilldownSelect({
        appendValue: !1,
        data: e,
        textBack: "Previous..."
    })
}

function initilizeScoreCanvas(e) {
    function o(e, o) {
        var t = o.part;
        if (null !== t) {
            var n = t.data;
            myDiagram.startTransaction("add component");
            var a = (myDiagram.model.nodeDataArray.length + 1).toString(),
                i = {
                    key: a,
                    title: "",
                    mode: "",
                    icon: "new",
                    parent: n.key
                };
            myDiagram.model.addNodeData(i), myDiagram.commitTransaction("add component"), myDiagram.commandHandler.zoomToFit(), myDiagram.contentAlignment = go.Spot.Center, setAlert("New subcomponent added!", "notice")
        }
    }

    function t(e, o) {
        if (1 == myDiagram.nodes.count) return void setAlert("Scores require at least one component!", "error");
        var t = o.part;
        myDiagram.remove(t), myDiagram.commandHandler.zoomToFit(), myDiagram.contentAlignment = go.Spot.Center, setAlert("Successfully deleted component!", "notice")
    }

    function n(e, o) {
        return e instanceof go.Node ? e === o ? !1 : o.isInTreeOf(e) ? !1 : !0 : !1
    }

    function a() {
        return {
            font: "9pt Avenir-Medium",
            stroke: "white"
        }
    }

    function i(e) {
        return -1 !== e.indexOf("/icon") ? e : "/icons-blue/" + e + ".png"
    }
    resetDrillData(), window.goSamples && goSamples();
    var r = go.GraphObject.make;
    myDiagram = r(go.Diagram, "myDiagram", {
        initialContentAlignment: go.Spot.Center,
        initialAutoScale: go.Diagram.Uniform,
        allowDelete: !1,
        validCycle: go.Diagram.CycleDestinationTree,
        maxSelectionCount: 1,
        layout: r(go.TreeLayout, {
            treeStyle: go.TreeLayout.StyleLastParents,
            arrangement: go.TreeLayout.ArrangementHorizontal,
            angle: 90,
            layerSpacing: 35,
            alternateAngle: 90,
            alternateLayerSpacing: 35,
            alternateAlignment: go.TreeLayout.AlignmentBus,
            alternateNodeSpacing: 20
        }),
        ChangedSelection: onSelectionChanged,
        "undoManager.isEnabled": !0
    }), myDiagram.addDiagramListener("Modified", function(e) {
        var o = document.getElementById("SaveButton");
        o && (o.disabled = !myDiagram.isModified);
        var t = document.title.indexOf("*");
        myDiagram.isModified ? 0 > t && (document.title += "*") : t >= 0 && (document.title = document.title.substr(0, t))
    }), myDiagram.layout.commitNodes = function() {
        go.TreeLayout.prototype.commitNodes.call(myDiagram.layout), myDiagram.layout.network.vertexes.each(function(e) {
            if (e.node) {
                var o = e.node.findObject("SHAPE"),
                    t = ["#87AFDE", "#87AFDE"];
                o && (o.fill = r(go.Brush, "Linear", {
                    0: t[0],
                    1: t[1],
                    start: go.Spot.Left,
                    end: go.Spot.Right
                }))
            }
        })
    }, myDiagram.nodeTemplate = r(go.Node, "Auto", {}, {
        selectionAdornmentTemplate: r(go.Adornment, "Auto", r(go.Shape, "RoundedRectangle", {
            fill: null,
            stroke: "dodgerblue",
            strokeWidth: 4
        }, new go.Binding("stroke", "color")), r(go.Placeholder))
    }, {
        doubleClick: o
    }, {
        mouseDragEnter: function(e, o, t) {
            var a = o.diagram,
                i = a.selection.first();
            if (n(i, o)) {
                var r = o.findObject("SHAPE");
                r && (r._prevFill = r.fill, r.fill = "#03387A")
            }
        },
        mouseDragLeave: function(e, o, t) {
            var n = o.findObject("SHAPE");
            n && n._prevFill && (n.fill = n._prevFill)
        },
        mouseDrop: function(e, o) {
            var t = o.diagram,
                a = t.selection.first();
            if (a.position, n(a, o)) {
                var i = a.findTreeParentLink();
                null !== i ? (i.fromNode = o, i.fromNode == o || setAlert("Component realtionship updated!", "notice")) : (setAlert("Updated component link!", "notice"), t.toolManager.linkingTool.insertLink(o, o.port, a, a.port))
            }
            myDiagram.contentAlignment = go.Spot.Center
        }
    }, new go.Binding("text", "name"), new go.Binding("layerName", "isSelected", function(e) {
        return e ? "Foreground" : ""
    }).ofObject(), r(go.Shape, "RoundedRectangle", {
        width: 200,
        height: 100,
        name: "SHAPE",
        fill: "white",
        stroke: null,
        portId: "",
        fromLinkable: !1,
        toLinkable: !1,
        cursor: "move"
    }), r(go.Panel, {
        width: 200,
        height: 100
    }, r(go.Picture, {
        click: t
    }, {
        position: new go.Point(175, 5),
        desiredSize: new go.Size(16, 16),
        source: "/cancel-button.png"
    }), r(go.TextBlock, a(), {
        position: new go.Point(10, 10),
        desiredSize: new go.Size(170, 20),
        font: "12pt Avenir-Medium",
        textAlign: "center"
    }, new go.Binding("text", "component").makeTwoWay()), r(go.Picture, {
        name: "/divide.png",
        position: new go.Point(79, 44),
        desiredSize: new go.Size(32, 32)
    }, new go.Binding("source", "name", i)), r(go.TextBlock, "", a(), {
        position: new go.Point(10, 80),
        desiredSize: new go.Size(85, 20),
        font: "11pt Avenir-Medium"
    }, new go.Binding("text", "weight").makeTwoWay()))), myDiagram.linkTemplate = r(go.Link, go.Link.Orthogonal, {
        corner: 5,
        relinkableFrom: !0,
        relinkableTo: !0
    }, r(go.Shape, {
        strokeWidth: 4,
        stroke: "#E7E7E7"
    })), load(e)
}

function onSelectionChanged(e) {
    return void flux.actions.scoreNodeChanged(e.diagram.selection.first())
}

function updateComponentDetails() {
    console.log("TODO: create the detail container")
}

function updateData(e, o) {
    var t = myDiagram.selection.first();
    if (null !== t) {
        var n = t.data;
        if (t instanceof go.Node && null !== n) {
            var a = myDiagram.model;
            a.startTransaction("modified " + o), "icon" === o && a.setDataProperty(n, "name", e), "component" === o ? a.setDataProperty(n, "component", e) : "weight" === o ? a.setDataProperty(n, "weight", e) : "comments" === o ? a.setDataProperty(n, "comments", e) : "mode" === o ? a.setDataProperty(n, "mode", e) : "normalization" === o ? a.setDataProperty(n, "normalization", e) : "operation" === o ? a.setDataProperty(n, "operation", e) : "dataname" == o && a.setDataProperty(n, "dataname", e), a.commitTransaction("modified " + o)
        }
    }
}

function save() {
    document.getElementById("mySavedModel").value = myDiagram.model.toJson(), myDiagram.isModified = !1
}

function reload() {
    save(), myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value)
}

function zoomIn() {
    var e = myDiagram.scale;
    myDiagram.scale = e + .1
}

function zoomOut() {
    myDiagram.scale = myDiagram.scale - .1
}

function load(e) {
    if (null != e) myDiagram.model = go.Model.fromJson(JSON.stringify(e));
    else {
        var o = {},
            t = [],
            n = {};
        n.key = 1, n.component = "New Component", n.weight = "100", n.mode = "", n.operation = "", t.push(n), o["class"] = "go.TreeModel", o.nodeDataArray = t, myDiagram.model = go.Model.fromJson(JSON.stringify(o))
    }
}

function setAlert(e, o) {
    $("#message").hide(), "notice" === o ? $("#message").css("color", "#50e3c2") : "error" === o ? $("#message").css("color", "#e76959") : "alert" === o ? $("#message").css("color", "#f5a623") : $("#message").css("color", "#50e3c2"), $("#message").text(e), $("#message").fadeIn(100).delay(3e3).fadeOut(2e3)
}
$(document).ready(function() {
    $("#myDiagram").length && console.log("score editor view")
});