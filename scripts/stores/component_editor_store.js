var Fluxxor = require('fluxxor');
var DataClient = require('../clients/data_client.js');
var AssetClient = require('../clients/asset_client.js');

var constants = require('../constants/constants.js');

var ComponentEditorStore = Fluxxor.createStore({

  initialize: function() {
    // component object
    this.id = null;
    this.title = "";
    this.data = [];
    this.view = "lineChart";
    this.interval = "weekly";

    // ui data
    this.editorPane = "general";
    this.message = "";
    this.selectedAsset = null;
    this.selectedData = null;
    this.error = null;
    this.loading = false;
    this.saving = false;
    this.startList = [];
    this.dataIndex = 0;
    this.filteredList = [];
    this.dataPointList = [];
    DataClient.getData(function(data) {
        this.dataPointList = data;
    }.bind(this));
    this.filteredDataPointList = [];
    this.filterText = "";
    this.dataFilterText = "";
    this.previewObject = this.getObject();
    this.state = null;
    this.bindActions(
      constants.UPDATE_TYPE, this.onUpdateType,
      constants.ADD_DATA, this.onDataAdded,
      constants.UPDATE_TITLE, this.onUpdateTitle,
      constants.CHANGE_PANE, this.onChangePane,
      constants.FILTER_LIST, this.onFilterList,
      constants.FILTER_DATA, this.onFilterData,
      constants.ASSET_SELECT, this.onAssetSelected,
      constants.DATA_SELECT, this.onDataSelected,
      constants.REMOVE_DATA, this.onDataRemoved,
      constants.SAVE_COMPONENT, this.onSaveComponent,
      constants.SAVE_SUCCESS, this.onSaveSuccess,
      constants.SAVE_FAIL, this.onSaveFail,
      constants.UPDATE_COMPONENT, this.onUpdateComponent,
      constants.UPDATE_SUCCESS, this.onUpdateSuccess,
      constants.UPDATE_FAIL, this.onUpdateFail,
      constants.NEW_COMPONENT, this.onNewComponent,
      constants.PREVIEW_DATA, this.onPreviewData,
      constants.PREVIEW_SUCCESS, this.onPreviewSuccess,
      constants.PREVIEW_FAIL, this.onPreviewFail,
      constants.LOAD_COMPONENT_UPDATE, this.onLoadComponentUpdate,
      constants.LOAD_ASSETS_SUCCESS, this.onLoadAssetsSucess
    )
  },
  getObject: function() {
    return {
      id: this.id,
      name: this.title,
      view: this.view,
      interval: this.interval,
      model: {
        title: this.title,
        type: this.view,
        interval: this.interval,
        data: this.data
      },
      state: this.state
    };
  },
  loadData: function() {
    // this is sloppy
    AssetClient.getAssets(function(data) {
        this.startList = data;
        this.filterList = this.startList;
        this.emit("change");
    }.bind(this));
  },
  onLoadAssetsSucess: function(payload) {
    this.startList = payload.assets;
    this.filterList = this.startList;
    this.emit("change");
  },
  onLoadComponentUpdate: function(payload) {
    this.id = payload.component.id;
    this.title = payload.component.name;
    this.view = payload.component.view;
    this.interval = payload.component.interval;
    this.model = payload.component.model;
    this.state = payload.component.state;
    this.data = this.model.data;
    this.emit("change");
  },
  onChangePane: function(payload) {
    this.editorPane = payload.editorPane;
    this.emit("change");
  },
  onUpdateType: function(payload) {
    this.view = payload.view;
    this.previewObject = this.getObject();
    this.emit("change");
  },
  onUpdateTitle: function(payload) {
    this.title = payload.title;
    this.previewObject = this.getObject();
    this.emit("change");
  },
  // stub if i need to trigger on async call
  onPreviewData: function() {
  },
  onPreviewSuccess: function(payload) {
    this.state = payload.component.state;
    this.emit("change");
  },
  onPreviewFail: function(error) {
    this.message = "Preview failed!";
    this.emit("change");
  },
  onSaveComponent: function() {
    this.saving = true;
    this.emit("change");
  },
  onSaveSuccess: function(payload) {
    this.id = payload.component.id;
    this.saving = false;
    this.message = "Component saved!";
    this.emit("change");
  },
  onSaveFail: function(error) {
    this.message = "Failed saving component!";
    this.emit("change");
  },
  onUpdateComponent: function() {
    this.saving = true;
    this.emit("change");
  },
  onUpdateSuccess: function(payload) {
    this.message = "Component saved!";
    this.id = payload.component.id;
    this.saving = false;
    this.emit("change");
  },
  onUpdateFail: function(error) {
    this.message = "Failed saviing component";
    this.emit("change");
  },
  onDataAdded: function(payload) {
    this.data.push({
                    entity: {
                      type: "asset",
                      entity_id: this.selectedAsset.id,
                      entity_image: this.selectedAsset.image,
                      name: this.selectedAsset.name
                    },
                    metric: {
                      type: this.selectedData.kind,
                      source: this.selectedData.source,
                      point: this.selectedData.point,
                      point_id: this.selectedData.id,
                      point_image: this.selectedData.icon
                    }
                  });
    this.selectedData = null;
    this.emit("change");
  },
  onDataRemoved: function(payload) {
    this.data.splice(payload.index, 1);
    this.emit("change");
  },
  onAssetSelected: function(payload) {
    console.log("log", payload);
    console.log(payload.selectedAsset);
    if (payload.selectedAsset === null || payload.selectedAsset.length < 1)
      return;
    for(var i = 0; i < this.startList.length; i++) {
      console.log("test", this.startList[i].id, payload.selectedAsset);
      if (this.startList[i].id == payload.selectedAsset) {
        console.log("found");
        this.selectedAsset = this.startList[i];
        console.log(this.selectedAsset);
        break;
      }
    }
    //this.selectedAsset = AssetsStore.find(payload.selectedAsset);
    this.filteredDataPointList = this.dataPointList;
    this.emit("change");
  },
  onNewComponent: function() {
    this.id = null;
    this.title = "";
    this.chartType = 'lineChart';
    this.data = [];
    this.interval = "weekly";
    this.message = "New Component";
    this.emit("change");
  },
  findSelectedData: function(id) {
    for (var i = 0; i < this.dataPointList.length; i++) {
      if (parseInt(id) === this.dataPointList[i].id) {
        return this.dataPointList[i];
      }
    }
  },
  onDataSelected: function(payload) {
    if (payload.selectedData === null || payload.selectedData.length < 1)
      return;
    this.selectedData = this.findSelectedData(payload.selectedData);
    this.emit("change");
  },
  onFilterData: function(payload) {
    this.dataFilterText = payload.filterText;
    var filteredList = [];
    this.dataPointList.forEach(function(item) {
      if (item['point'].split("_").join(" ").indexOf(this.dataFilterText) === -1) {
        return;
      } else {
        filteredList.push(item);
      }
    }.bind(this));
    this.filteredDataPointList = filteredList;
    this.emit("change");
  },
  onFilterList: function(payload) {
    this.filterText = payload.filterText;
    var filteredList = [];
    this.startList.forEach(function(li) {
      if (li['name'].toLowerCase().indexOf(this.filterText) === -1) {
        return;
      } else {
        filteredList.push(li);
      }
    }.bind(this));
    this.filteredList = filteredList;
    this.emit("change");
  },
  getPreview: function() {
    return this.getObject();
  },
  getState: function() {
    return {
      id: this.id,
      title: this.title,
      view: this.view,
      editorPane: this.editorPane,
      filterText: this.filterText,
      filteredList: this.filteredList,
      selectedAsset: this.selectedAsset,
      selectedData: this.selectedData,
      dataPointList: this.dataPointList,
      filteredDataPointList: this.filteredDataPointList,
      message: this.message,
      data: this.data
    };
  }
});

module.exports = ComponentEditorStore;
