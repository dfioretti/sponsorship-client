var DashboardClient = require("../clients/dashboard_client.js"),
    ComponentClient = require("../clients/component_client.js"),
    DataClient = require("../clients/data_client.js"),
    ScoreClient = require("../clients/score_client.js"),
    AssetClient = require("../clients/asset_client.js"),
    constants = require("../constants/constants.js"),
    actions = {
        updateTitle: function(t) {
            this.dispatch(constants.UPDATE_TITLE, {
                title: t
            })
        },
        updateType: function(t) {
            this.dispatch(constants.UPDATE_TYPE, {
                view: t
            })
        },
        changePane: function(t) {
            this.dispatch(constants.CHANGE_PANE, {
                editorPane: t
            })
        },
        filterList: function(t) {
            this.dispatch(constants.FILTER_LIST, {
                filterText: t
            })
        },
        filterData: function(t) {
            this.dispatch(constants.FILTER_DATA, {
                filterText: t
            })
        },
        selectedAsset: function(t) {
            this.dispatch(constants.ASSET_SELECT, {
                selectedAsset: t
            })
        },
        dataSelected: function(t) {
            this.dispatch(constants.DATA_SELECT, {
                selectedData: t
            })
        },
        addData: function() {
            this.dispatch(constants.ADD_DATA)
        },
        removeData: function(t) {
            this.dispatch(constants.REMOVE_DATA, {
                index: t
            })
        },
        saveComponent: function() {
            this.dispatch(constants.SAVE_COMPONENT), ComponentClient.createComponent(flux.store("ComponentEditorStore").getObject(), function(t) {
                this.dispatch(constants.SAVE_SUCCESS, {
                    component: t
                })
            }.bind(this), function(t) {
                this.dispatch(constants.SAVE_FAIL)
            }.bind(this))
        },
        updateComponent: function(cid) {
          var object = flux.store("ComponentEditorStore").getObject();
          object.id = cid;
            this.dispatch(constants.UPDATE_COMPONENT), ComponentClient.updateComponent(object, function(t) {
                this.dispatch(constants.UPDATE_SUCCESS, {
                    component: t
                })
            }.bind(this), function(t) {
                this.dispatch(constants.UPDATE_FAIL)
            }.bind(this))
        },
        loadComponentUpdate: function(t) {
            this.dispatch(constants.LOAD_COMPONENT_UPDATE, {
                component: t
            })
        },
        newComponent: function() {
            this.dispatch(constants.NEW_COMPONENT)
        },
        generatePreviewData: function(component) {
            this.dispatch(constants.PREVIEW_DATA), ComponentClient.generatePreviewData(component, function(t) {
                this.dispatch(constants.PREVIEW_SUCCESS, {
                    component: t
                })
            }.bind(this), function(t) {
                this.dispatch(constants.PREVIEW_FAIL)
            }.bind(this))
        },
        updateDashboardName: function(t) {
            this.dispatch(constants.UPDATE_DASHBOARD_NAME, {
                name: t
            })
        },
        removeDashboardComponent: function(t) {
            this.dispatch(constants.DASHBOARD_ITEM_REMOVED, {
                component_id: t
            })
        },
        addDashboardComponent: function(t) {
            this.dispatch(constants.DASHBOARD_ITEM_ADDED, {
                component_id: t
            })
        },
        dashboardCreate: function() {
            this.dispatch(constants.DASHBOARD_CREATE), DashboardClient.createDashboard(flux.store("DashboardEditStore").getObject(), function(t) {
                this.dispatch(constants.DASHBOARD_CREATE_SUCCESS, {
                    dashboard: t
                })
            }.bind(this), function(t) {
                this.dispatch(constants.DASHBOARD_CREATE_FAIL)
            }.bind(this))
        },
        dashboardUpdate: function() {
            this.dispatch(constants.DASHBOARD_UPDATE), DashboardClient.updateDashboard(flux.store("DashboardEditStore").getObject(), function(t) {
                this.dispatch(constants.DASHBOARD_UPDATE_SUCCESS, {
                    dashboard: t
                })
            }.bind(this), function(t) {
                this.dispatch(constants.DASHBOARD_UPDATE_FAIL)
            }.bind(this))
        },
        dashboardEditLoad: function(t) {
            this.dispatch(constants.LOAD_EDITOR_DASHBOARD, {
                dashboard_id: t
            })
        },
        scoreNodeChanged: function(t) {
            this.dispatch(constants.SCORE_NODE_CHANGED, {
                node: t
            })
        },
        changeScorePane: function(t) {
            this.dispatch(constants.SCORE_PANE_CHANGED, {
                pane: t
            })
        },
        updateScoreTitle: function(t) {
            this.dispatch(constants.UPDATE_SCORE_TITLE, {
                title: t
            })
        },
        updateNodeName: function(t) {
            this.dispatch(constants.UPDATE_NODE_NAME, {
                name: t
            })
        },
        updateNodeWeight: function(t) {
            this.dispatch(constants.UPDATE_NODE_WEIGHT, {
                weight: t
            })
        },
        updateNodeMode: function(t) {
            this.dispatch(constants.UPDATE_NODE_MODE, {
                mode: t
            })
        },
        updateNodeOperation: function(t) {
            this.dispatch(constants.UPDATE_NODE_OPERATION, {
                operation: t
            })
        },
        updateNodeData: function(t) {
            this.dispatch(constants.UPDATE_NODE_DATA, {
                data_id: t
            })
        },
        saveScore: function(t) {
            this.dispatch(constants.SAVE_SCORE), ScoreClient.createScore(t, function(t) {
                this.dispatch(constants.SAVE_SCORE_SUCCESS, {
                    score: t
                })
            }.bind(this), function(t) {
                this.dispatch(constants.SAVE_SCORE_FAIL)
            }.bind(this))
        },
        updateScore: function(t) {
            this.dispatch(constants.SAVE_SCORE), ScoreClient.updateScore(t, function(t) {
                this.dispatch(constants.SAVE_SCORE_SUCCESS, {
                    score: t
                })
            }.bind(this), function(t) {
                this.dispatch(constants.SAVE_SCORE_FAIL)
            }.bind(this))
        },
        loadAssets: function() {
            this.dispatch(constants.LOAD_ASSETS), AssetClient.getAssets(function(t) {
                this.dispatch(constants.LOAD_ASSETS_SUCCESS, {
                    assets: t
                })
            }.bind(this), function(t) {
                this.dispatch(constants.LOAD_ASSETS_FAIL)
            }.bind(this))
        },
        loadScores: function() {
            this.dispatch(constants.LOAD_SCORES), ScoreClient.getScores(function(t) {
                this.dispatch(constants.LOAD_SCORES_SUCCESS, {
                    scores: t
                })
            }.bind(this), function(t) {
                this.dispatch(constants.LOAD_SCORES_FAIL)
            }.bind(this))
        },
        changeOverviewPane: function(t) {
            this.dispatch(constants.OVERVIEW_PANE_CHANGE, {
                pane: t
            })
        },
        loadData: function() {
          this.dispatch(constants.LOAD_DATA);
          DataClient.getData(function(data) {
            this.dispatch(constants.LOAD_DATA_SUCCESS, { data: data})
          }.bind(this), function(error) {
            this.dispatch(constants.LOAD_DATA_FAIL)
          }.bind(this))
        },
        loadComponents: function() {
          this.dispatch(constants.LOAD_COMPONETS);
          ComponentClient.getComponents(function(data) {
            this.dispatch(constants.LOAD_COMPONENTS_SUCCESS, { components: data})
          }.bind(this), function(error) {
            this.dispatch(constants.LOAD_COMPONENTS_FAIL);
          }.bind(this));
        },
        loadDashboards: function() {
          this.dispatch(constants.LOAD_DASHBOARDS);
          DashboardClient.getDashboards(function(data) {
            this.dispatch(constants.LOAD_DASHBOARDS_SUCCESS, { dashboards: data})
          }.bind(this), function(error) {
            this.dispatch(constants.LOAD_DASHBOARDS_FAIL);
          });
        },
        resetComponentEditor: function() {
          this.dispatch(constants.RESET_COMPONENT_EDITOR);
        },
        hideSnackbar: function() {
          this.dispatch(constants.HIDE_SNACKBAR);
        },
        configureComponentEditor: function(component) {
          this.dispatch(constants.CONFIGURE_COMPONENT_EDITOR, { component: component });
        },
        resetScoreEditor: function() {
          this.dispatch(constants.RESET_SCORE_EDITOR);
        },

    };
module.exports = actions;
