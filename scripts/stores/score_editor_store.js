var Fluxxor = require('fluxxor');
var DataClient = require('../clients/data_client.js');
var constants = require('../constants/constants.js')

var ScoreEditorStore = Fluxxor.createStore({
  initialize: function() {
    this.id = null;
    this.selectedPane = 'General';
    this.scoreTitle = "";
    this.message = "";
    this.score = null;
    this.selectedNode = null;
    this.menuItems = ["General", "Assets", "Configure"];
    this.parentOperations = [
      { value: 0, name: "SUM"},
      { value: 1, name: "DIFFERENCE"},
      { value: 2, name: "DIVIDE"},
      { value: 3, name: "MULTIPLY"}
    ];
    this.dataPointList = [];
    DataClient.getData(function(data) {
      this.dataPointList = data;
    }.bind(this));
    this.bindActions(
      constants.SCORE_NODE_CHANGED, this.onScoreNodeChanged,
      constants.SCORE_PANE_CHANGED, this.onScorePaneChanged,
      constants.UPDATE_SCORE_TITLE, this.onUpdateScoreTitle,
      constants.UPDATE_NODE_NAME, this.onUpdateNodeName,
      constants.UPDATE_NODE_WEIGHT, this.onUpdateNodeWeight,
      constants.UPDATE_NODE_MODE, this.onUpdateNodeMode,
      constants.UPDATE_NODE_OPERATION, this.onUpdateNodeOperation,
      constants.UPDATE_NODE_DATA, this.onUpdateNodeData,
      constants.SAVE_SCORE, this.onSaveScore,
      constants.SAVE_SCORE_SUCCESS, this.onSaveScoreSuccess,
      constants.SAVE_SCORE_FAIL, this.onSaveScoreFail
    )
  },
  loadSavedScore: function(score) {
    // TODO: clean up
    this.scoreTitle = score.name;
    this.score = score;
    this.id = score.id;
    if (myDiagram) {
      load(score.score);
    }
    this.emit("change");
  },
  onSaveScoreSuccess: function(data) {
    this.score = data.score;
    this.message = "Score Saved!";
    ReactRouter.HistoryLocation.push('/apt/editor_score/' + data.score.id);
    this.emit("change");
  },
  onSaveScoreFail: function() {
  },
  onSaveScore: function(payload) {
  },
  onUpdateNodeData: function(payload) {
    var model = myDiagram.model;
    var dataPoint = this.findSelectedData(payload.data_id);
    model.startTransaction('update data');
    model.setDataProperty(this.selectedNode, 'name', dataPoint.icon);
    model.setDataProperty(this.selectedNode, 'dataname', dataPoint.point);
    model.commitTransaction('update data');
    this.emit("change");
  },
  findSelectedData: function(id) {
    for (var i = 0; i < this.dataPointList.length; i++) {
      if (parseInt(id) === this.dataPointList[i].id) {
        return this.dataPointList[i];
      }
    }
  },
  onUpdateNodeOperation: function(payload) {
    var model = myDiagram.model;
    model.startTransaction('update operation');
    model.setDataProperty(this.selectedNode, 'operation', parseInt(payload.operation));
    model.setDataProperty(this.selectedNode, 'name', this.parentOperations[parseInt(payload.operation)].name);
    model.commitTransaction('update operation');
    save();
    this.emit("change");
  },
  onUpdateNodeMode: function(payload) {
    var model = myDiagram.model;
    model.startTransaction('update mode');
    model.setDataProperty(this.selectedNode, 'mode', payload.mode);
    model.commitTransaction('update mode');
    save();
    this.emit("change");
  },
  onUpdateNodeWeight: function(payload) {
    var model = myDiagram.model;
    model.startTransaction('update weight');
    model.setDataProperty(this.selectedNode, 'weight', payload.weight);
    model.commitTransaction('update weight');
    save();
    this.emit('change');
  },
  onUpdateNodeName: function(payload) {
    var model = myDiagram.model;
    model.startTransaction('update name');
    model.setDataProperty(this.selectedNode, "component", payload.name);
    model.commitTransaction('update name');
    save();
    this.emit("change");
  },
  onUpdateScoreTitle: function(payload) {
    this.scoreTitle = payload.title;
    this.emit("change");
  },
  onScorePaneChanged: function(payload) {
    this.selectedPane = payload.pane;
    this.emit("change");
  },
  onScoreNodeChanged: function(payload) {
    if (payload.node === null) {
      this.selectedNode = null;
      this.selectedPane = 'General';
    } else {
      this.selectedNode = payload.node.data;
      this.selectedPane = 'Configure'
    }
    this.emit("change");
  },
  getState: function() {
    return {
      selectedPane: this.selectedPane,
      selectedNode: this.selectedNode,
      menuItems: this.menuItems,
      scoreTitle: this.scoreTitle,
      parentOperations: this.parentOperations,
      dataPointList: this.dataPointList,
      message: this.message,
      score: this.score,
      id: this.id
    };
  }
});
module.exports = ScoreEditorStore;
