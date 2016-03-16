
var DashboardClient = require('../clients/dashboard_client.js');
var ComponentClient = require('../clients/component_client.js');
var DataClient = require('../clients/data_client.js');
var ScoreClient = require('../clients/score_client.js');
var AssetClient = require('../clients/asset_client.js');
var constants = require('../constants/constants.js');


var actions = {
  // ComponentEditorActions
  updateTitle: function(title) {
    this.dispatch(constants.UPDATE_TITLE, { title: title });
  },
  updateType: function(view) {
    this.dispatch(constants.UPDATE_TYPE, { view: view });
  },
  changePane: function(pane) {
    this.dispatch(constants.CHANGE_PANE, { editorPane: pane });
  },
  filterList: function(filterText) {
    this.dispatch(constants.FILTER_LIST, { filterText: filterText });
  },
  filterData: function(filterText) {
    this.dispatch(constants.FILTER_DATA, { filterText: filterText });
  },
  selectedAsset: function(selectedAsset) {
    this.dispatch(constants.ASSET_SELECT, { selectedAsset: selectedAsset });
  },
  dataSelected: function(selectedData) {
    this.dispatch(constants.DATA_SELECT, { selectedData: selectedData });
  },
  addData: function() {
    this.dispatch(constants.ADD_DATA);
  },
  removeData: function(index) {
    this.dispatch(constants.REMOVE_DATA, { index: index });
  },
  saveComponent: function() {
    this.dispatch(constants.SAVE_COMPONENT);
    ComponentClient.createComponent(flux.store("ComponentEditorStore").getObject(), function(data) {
      this.dispatch(constants.SAVE_SUCCESS, { component: data });
    }.bind(this), function(error) {
      this.dispatch(constants.SAVE_FAIL);
    }.bind(this));
  },
  updateComponent: function() {
    this.dispatch(constants.UPDATE_COMPONENT);
    ComponentClient.updateComponent(flux.store("ComponentEditorStore").getObject(), function(data) {
      this.dispatch(constants.UPDATE_SUCCESS, { component: data });
    }.bind(this), function(error) {
      this.dispatch(constants.UPDATE_FAIL);
    }.bind(this))
  },
  loadComponentUpdate: function(component) {
    this.dispatch(constants.LOAD_COMPONENT_UPDATE, { component: component });
  },
  newComponent: function() {
    this.dispatch(constants.NEW_COMPONENT);
  },
  generatePreviewData: function() {
    this.dispatch(constants.PREVIEW_DATA);
    ComponentClient.generatePreviewData(flux.store("ComponentEditorStore").getObject(), function(data) {
      this.dispatch(constants.PREVIEW_SUCCESS, { component: data });
    }.bind(this), function(error) {
      this.dispatch(constants.PREVIEW_FAIL);
    }.bind(this));
  },


  // dashboard create actions
  updateDashboardName: function(name) {
    this.dispatch(constants.UPDATE_DASHBOARD_NAME, { name: name });
  },
  removeDashboardComponent: function(component_id) {
    this.dispatch(constants.DASHBOARD_ITEM_REMOVED, { component_id: component_id });
  },
  addDashboardComponent: function(component_id) {
    this.dispatch(constants.DASHBOARD_ITEM_ADDED, { component_id: component_id });
  },
  dashboardCreate: function() {
    this.dispatch(constants.DASHBOARD_CREATE);
    DashboardClient.createDashboard(flux.store("DashboardEditStore").getObject(), function(data) {
      this.dispatch(constants.DASHBOARD_CREATE_SUCCESS, { dashboard: data });
    }.bind(this), function(error) {
      this.dispatch(constants.DASHBOARD_CREATE_FAIL);
    }.bind(this));
  },
  dashboardUpdate: function() {
    this.dispatch(constants.DASHBOARD_CREATE);
    DashboardClient.updateDashboard(flux.store("DashboardEditStore").getObject(), function(data) {
      this.dispatch(constants.DASHBOARD_CREATE_SUCCESS, { dashboard: data });
    }.bind(this), function(error) {
      this.dispatch(constants.DASHBOARD_CREATE_FAIL);
    }.bind(this));
  },
  loadDashboards: function() {
    this.dispatch(constants.LOAD_DASHBOARDS);
  },

  // dashboard edit
  dashboardEditLoad: function(did) {
    this.dispatch(constants.LOAD_EDITOR_DASHBOARD, { dashboard_id: did });
  },

  // score editor
  scoreNodeChanged: function(node) {
    this.dispatch(constants.SCORE_NODE_CHANGED, { node: node });
  },
  changeScorePane: function(pane) {
    this.dispatch(constants.SCORE_PANE_CHANGED, { pane: pane });
  },
  updateScoreTitle: function(title) {
    this.dispatch(constants.UPDATE_SCORE_TITLE, { title: title });
  },
  updateNodeName: function(name) {
    this.dispatch(constants.UPDATE_NODE_NAME, { name: name });
  },
  updateNodeWeight: function(weight) {
    this.dispatch(constants.UPDATE_NODE_WEIGHT, { weight: weight });
  },
  updateNodeMode: function(mode) {
    this.dispatch(constants.UPDATE_NODE_MODE, { mode: mode });
  },
  updateNodeOperation: function(operation) {
    this.dispatch(constants.UPDATE_NODE_OPERATION, { operation: operation });
  },
  updateNodeData: function(data_id) {
    this.dispatch(constants.UPDATE_NODE_DATA, { data_id: data_id });
  },
  saveScore: function(score) {
    this.dispatch(constants.SAVE_SCORE);
    ScoreClient.createScore(score, function(data) {
      this.dispatch(constants.SAVE_SCORE_SUCCESS, { score: data });
    }.bind(this), function(error) {
      this.dispatch(constants.SAVE_SCORE_FAIL);
    }.bind(this));
  },
  updateScore: function(score) {
    this.dispatch(constants.SAVE_SCORE);
    ScoreClient.updateScore(score, function(data) {
      this.dispatch(constants.SAVE_SCORE_SUCCESS, { score: data });
    }.bind(this), function(error) {
      this.dispatch(constants.SAVE_SCORE_FAIL);
    }.bind(this));
  },
  loadAssets: function() {
    this.dispatch(constants.LOAD_ASSETS);
    AssetClient.getAssets(function(data) {
      this.dispatch(constants.LOAD_ASSETS_SUCCESS, { assets: data});
    }.bind(this), function(error) {
      this.dispatch(constants.LOAD_ASSETS_FAIL);
    }.bind(this));
  },
  loadScores: function() {
    this.dispatch(constants.LOAD_SCORES);
    ScoreClient.getScores(function(data) {
      this.dispatch(constants.LOAD_SCORES_SUCCESS, { scores: data});
    }.bind(this), function(error) {
      this.dispatch(constants.LOAD_SCORES_FAIL);
    }.bind(this));
  }
};
module.exports = actions;
