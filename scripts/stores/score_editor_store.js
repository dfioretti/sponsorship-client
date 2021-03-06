var Fluxxor = require("fluxxor"),
    DataClient = require("../clients/data_client.js"),
    constants = require("../constants/constants.js"),
    ReactRouter = require('react-router');

var ScoreEditorStore = Fluxxor.createStore({
    initialize: function() {
        this.id = null;
        this.selectedPane = "General";
        this.scoreTitle = "";
        this.message = "";
        this.score = null;
        this.selectedNode = null;
        this.menuItems = ["General", "Assets", "Configure"];
        this.parentOperations = [
            {
                value: 0,
                name: ""
            },
            {
                value: "SUM",
                name: "SUM"
            },
            {
                value: "DIFFERENCE",
                name: "DIFFERENCE"
            },
            {
                value: "DIVIDE",
                name: "DIVIDE"
            },
            {
                value: "MULTIPLY",
                name: "MULTIPLY"
            }];
            this.dataPointList = [];
            this.bindActions(
                constants.SCORE_NODE_CHANGED, this.onScoreNodeChanged,
                constants.SCORE_PANE_CHANGED, this.onScorePaneChanged,
                constants.UPDATE_SCORE_TITLE, this.onUpdateScoreTitle,
                constants.UPDATE_NODE_NAME, this.onUpdateNodeName,
                constants.UPDATE_NODE_WEIGHT, this.onUpdateNodeWeight,
                constants.UPDATE_NODE_MODE, this.onUpdateNodeMode,
                constants.LOAD_DATA_SUCCESS, this.onLoadDataSuccess,
                constants.UPDATE_NODE_OPERATION, this.onUpdateNodeOperation,
                constants.UPDATE_NODE_DATA, this.onUpdateNodeData,
                constants.SAVE_SCORE, this.onSaveScore,
                constants.SAVE_SCORE_SUCCESS, this.onSaveScoreSuccess,
                constants.SAVE_SCORE_FAIL, this.onSaveScoreFail,
                constants.RESET_SCORE_EDITOR, this.onResetScoreEditor,
                constants.LOAD_SAVED_SCORE, this.onLoadSavedScore
            )
    },
    onResetScoreEditor: function() {
        this.score = null;
        this.selectedNode = null;
        this.scoreTitle = "";
        this.id = null;
        this.emit("change");
    },
    onLoadSavedScore: function(payload) {
        this.scoreTitle = payload.score.name,
            this.score = payload.score,
                this.id = payload.score.id,
                    //myDiagram && load(e.score),
                    this.emit("change")
    },
    onSaveScoreSuccess: function(e) {
        this.score = e.score,
            this.message = "Score Saved!",
                //  ReactRouter.HistoryLocation.push("/apt/editor_score/" + e.score.id),
                this.emit("change")
    },
    onSaveScoreFail: function() {},
    onSaveScore: function(e) {},
    onUpdateNodeData: function(e) {
        var t = myDiagram.model,
            a = this.findSelectedData(e.data_id);
            t.startTransaction("update data"), t.setDataProperty(this.selectedNode, "name", a.icon), t.setDataProperty(this.selectedNode, "dataname", a.point), t.commitTransaction("update data"), this.emit("change")
    },
    findSelectedData: function(e) {
        for (var t = 0; t < this.dataPointList.length; t++)
            if (parseInt(e) === this.dataPointList[t].id) return this.dataPointList[t]
    },
    onUpdateNodeOperation: function(e) {
        var t = myDiagram.model;
        t.startTransaction("update operation"),
        t.setDataProperty(this.selectedNode, "operation", e.operation);//parseInt(e.operation)),
        t.setDataProperty(this.selectedNode, "name", e.operation);
        //  t.setDataProperty(this.selectedNode, "name", this.parentOperations[parseInt(e.operation)].name),
        t.commitTransaction("update operation"),
        save(),
        this.emit("change")
    },
    onUpdateNodeMode: function(e) {
        var t = myDiagram.model;
        t.startTransaction("update mode");
        t.setDataProperty(this.selectedNode, "mode", e.mode);
        t.commitTransaction("update mode");
        save();
        this.emit("change");
    },
    onUpdateNodeWeight: function(e) {
        var t = myDiagram.model;
        t.startTransaction("update weight"), t.setDataProperty(this.selectedNode, "weight", e.weight), t.commitTransaction("update weight"), save(), this.emit("change")
    },
    onUpdateNodeName: function(e) {
        var t = myDiagram.model;
        t.startTransaction("update name");
        t.setDataProperty(this.selectedNode, "component", e.name);
        t.commitTransaction("update name");
        save();
        this.emit("change");
    },
    onUpdateScoreTitle: function(e) {
        this.scoreTitle = e.title, this.emit("change")
    },
    onScorePaneChanged: function(e) {
        this.selectedPane = e.pane, this.emit("change")
    },
    onScoreNodeChanged: function(e) {
        null === e.node ? (this.selectedNode = null, this.selectedPane = "General") : (this.selectedNode = e.node.data, this.selectedPane = "Configure"), this.emit("change")
    },
    onLoadDataSuccess: function(payload) {
        this.dataPointList = payload.data;
        this.emit("change");
    },
    createDataPointList: function() {
        var list = [];
        for (var i = 0; i < this.dataPointList.length; i++) {
            var item = this.dataPointList[i];
            list.push(item.point.split("_").join(" "))
        }
        return list;
    },
    getState: function() {
        return {
            selectedPane: this.selectedPane,
            selectedNode: this.selectedNode,
            menuItems: this.menuItems,
            scoreTitle: this.scoreTitle,
            parentOperations: this.parentOperations,
            dataPointList: this.dataPointList,
            dataPointNames: this.createDataPointList(),
            message: this.message,
            score: this.score,
            id: this.id
        }
    }
});
module.exports = ScoreEditorStore;
