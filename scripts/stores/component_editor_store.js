var Fluxxor = require("fluxxor"),
    DataClient = require("../clients/data_client.js"),
    AssetClient = require("../clients/asset_client.js"),
    constants = require("../constants/constants.js"),
    ComponentEditorStore = Fluxxor.createStore({
        initialize: function() {
            this.id = null, this.title = "", this.data = [], this.previewLoaded = false, this.view = "lineChart", this.interval = "weekly", this.editorPane = "general", this.message = "", this.selectedAsset = null, this.selectedData = null, this.error = null, this.loading = !1, this.saving = !1, this.startList = [], this.dataIndex = 0, this.filteredList = [], this.dataPointList = [], DataClient.getData(function(t) {
                this.dataPointList = t
            }.bind(this)), this.filteredDataPointList = [], this.filterText = "", this.dataFilterText = "", this.previewObject = this.getObject(), this.state = null, this.bindActions(constants.UPDATE_TYPE, this.onUpdateType, constants.ADD_DATA, this.onDataAdded, constants.UPDATE_TITLE, this.onUpdateTitle, constants.CHANGE_PANE, this.onChangePane, constants.FILTER_LIST, this.onFilterList, constants.FILTER_DATA, this.onFilterData, constants.ASSET_SELECT, this.onAssetSelected, constants.DATA_SELECT, this.onDataSelected, constants.REMOVE_DATA, this.onDataRemoved, constants.SAVE_COMPONENT, this.onSaveComponent, constants.SAVE_SUCCESS, this.onSaveSuccess, constants.SAVE_FAIL, this.onSaveFail, constants.UPDATE_COMPONENT, this.onUpdateComponent, constants.UPDATE_SUCCESS, this.onUpdateSuccess, constants.UPDATE_FAIL, this.onUpdateFail, constants.NEW_COMPONENT, this.onNewComponent, constants.PREVIEW_DATA, this.onPreviewData, constants.PREVIEW_SUCCESS, this.onPreviewSuccess, constants.PREVIEW_FAIL, this.onPreviewFail, constants.LOAD_COMPONENT_UPDATE, this.onLoadComponentUpdate, constants.LOAD_ASSETS_SUCCESS, this.onLoadAssetsSucess)
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
            }
        },
        loadData: function() {
            AssetClient.getAssets(function(t) {
                this.startList = t, this.filterList = this.startList, this.emit("change")
            }.bind(this))
        },
        onLoadAssetsSucess: function(t) {
            this.startList = t.assets, this.filterList = this.startList, this.emit("change")
        },
        onLoadComponentUpdate: function(t) {
            this.id = t.component.id,
            this.title = t.component.name,
            this.view = t.component.view,
            this.interval = t.component.interval,
            this.model = t.component.model,
            this.state = t.component.state,
            this.data = this.model.data
          //  this.emit("change")
        },
        onChangePane: function(t) {
            this.editorPane = t.editorPane, this.emit("change")
        },
        onUpdateType: function(t) {
            this.view = t.view, this.previewObject = this.getObject(), this.emit("change")
        },
        onUpdateTitle: function(t) {
            this.title = t.title, this.previewObject = this.getObject(), this.emit("change")
        },
        onPreviewData: function() {
          this.previewLoaded = false;
        },
        onPreviewSuccess: function(t) {
            this.state = t.component.state
            this.previewLoaded = true;
            this.emit("change");
        },
        onPreviewFail: function(t) {
            this.message = "Preview failed!", this.emit("change")
        },
        onSaveComponent: function() {
            this.saving = !0, this.emit("change")
        },
        onSaveSuccess: function(t) {
            this.id = t.component.id, this.saving = !1, this.message = "Component saved!", this.emit("change")
        },
        onSaveFail: function(t) {
            this.message = "Failed saving component!", this.emit("change")
        },
        onUpdateComponent: function() {
            this.saving = !0, this.emit("change")
        },
        onUpdateSuccess: function(t) {
            this.message = "Component saved!", this.id = t.component.id, this.saving = !1, this.emit("change")
        },
        onUpdateFail: function(t) {
            this.message = "Failed saviing component", this.emit("change")
        },
        onDataAdded: function(t) {
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
            }), this.selectedData = null, this.emit("change")
        },
        onDataRemoved: function(t) {
            this.data.splice(t.index, 1), this.emit("change")
        },
        onAssetSelected: function(t) {
            if (console.log("log", t), console.log(t.selectedAsset), !(null === t.selectedAsset || t.selectedAsset.length < 1)) {
                for (var e = 0; e < this.startList.length; e++)
                    if (console.log("test", this.startList[e].id, t.selectedAsset), this.startList[e].id == t.selectedAsset) {
                        console.log("found"), this.selectedAsset = this.startList[e], console.log(this.selectedAsset);
                        break
                    }
                this.filteredDataPointList = this.dataPointList, this.emit("change")
            }
        },
        onNewComponent: function() {
            this.id = null, this.title = "", this.chartType = "lineChart", this.data = [], this.interval = "weekly", this.message = "New Component", this.emit("change")
        },
        findSelectedData: function(t) {
            for (var e = 0; e < this.dataPointList.length; e++)
                if (parseInt(t) === this.dataPointList[e].id) return this.dataPointList[e]
        },
        onDataSelected: function(t) {
            null === t.selectedData || t.selectedData.length < 1 || (this.selectedData = this.findSelectedData(t.selectedData), this.emit("change"))
        },
        onFilterData: function(t) {
            this.dataFilterText = t.filterText;
            var e = [];
            this.dataPointList.forEach(function(t) {
                -1 !== t.point.split("_").join(" ").indexOf(this.dataFilterText) && e.push(t)
            }.bind(this)), this.filteredDataPointList = e, this.emit("change")
        },
        onFilterList: function(t) {
            this.filterText = t.filterText;
            var e = [];
            this.startList.forEach(function(t) {
                -1 !== t.name.toLowerCase().indexOf(this.filterText) && e.push(t)
            }.bind(this)), this.filteredList = e, this.emit("change")
        },
        getPreview: function() {
            return this.getObject()
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
                previewLoaded: this.previewLoaded,
                data: this.data
            }
        }
    });
module.exports = ComponentEditorStore;
