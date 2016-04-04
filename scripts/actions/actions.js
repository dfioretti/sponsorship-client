var DashboardClient = require("../clients/dashboard_client.js"),
    ComponentClient = require("../clients/component_client.js"),
    DataClient = require("../clients/data_client.js"),
    API_ROOT = require("../constants/environment.js").API_ROOT,
    ScoreClient = require("../clients/score_client.js"),
    AssetClient = require("../clients/asset_client.js"),
    constants = require("../constants/constants.js"),


actions = {
  updateTitle: function(title) {
    this.dispatch(constants.UPDATE_TITLE, {
      title: title
    });
  },
  updateType: function(view) {
    this.dispatch(constants.UPDATE_TYPE, {
        view: view
    });
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
  loadSavedScore: function(score) {
    this.dispatch(constants.LOAD_SAVED_SCORE, {score: score});
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
  addComponentToDashboard: function(dashboard, component_id) {
    var max = -1;
    for (var key in dashboard.state) {
      if (dashboard.state[key]['index'] > max) max = dashboard.state[key]['index'];
    }
    dashboard.state['custom_component_' + component_id] = { index: max + 1, toggle: "on" };
    this.dispatch(constants.ADD_COMPONENT_TO_DASHBOARD,
      DashboardClient.updateDashboard(dashboard, function(data) {
        this.dispatch(
          constants.ADD_COMPONENT_TO_DASHBOARD_SUCCESS, { dashboard: data }
        )}.bind(this),
      function(error) {
        this.dispatch(constants.ADD_COMPONENT_TO_DASHBOARD_FAIL);
      }.bind(this))
    );
  },
  setBreadcrumb: function(breadcrumb) {
    this.dispatch(constants.SET_BREADCRUMB, { breadcrumb: breadcrumb });
  },
  setCurrentNav: function(view, id) {
    this.dispatch(constants.SET_CURRENT_NAV, { view: view, id: id });
  },
  toggleModal: function() {
    this.dispatch(constants.TOGGLE_MODAL);
  },
  loadAsset: function(asset_id) {
    this.dispatch(constants.ASSET_LOAD);
    AssetClient.getAsset(asset_id, function(data) {
      this.dispatch(constants.ASSET_LOAD_SUCCESS, { asset: data })
    }.bind(this), function(error) {
      this.dispatch(constants.ASSET_LOAD_FAIL);
    });
  },
  setEntityDashboardMode: function(mode) {
    this.dispatch(constants.SET_ENTITY_DASHBOARD_MODE, { mode: mode });
  },
  loadDashboard: function(kind) {
    this.dispatch(constants.LOAD_DASHBOARD);
    DashboardClient.getDashboard(kind, function(data) {
      this.dispatch(constants.DASHBOARD_LOAD_SUCCESS, { dashboard: data })
    }.bind(this), function(error) {
      this.dispatch(constants.LOAD_DASHBOARDS_FAIL);
    });
  },
  resetDashboardAsset: function(asset) {
    this.dispatch(constants.RESET_DASHBOARD_ASSET, { asset: asset });
  },
  loadTweets: function(screen_name) {
    this.dispatch(constants.TWITTER_LOAD);
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: API_ROOT + "api/v1/twitter",
      data: { "screen_name": screen_name },
      success: function(data, status, xhr) {
        this.dispatch(constants.TWITTER_LOAD_SUCCESS, { tweets: data });
      }.bind(this),
      error: function(xhr, status, error) {
        console.log(status);
        console.log(error);
      }
    });
  },
  queueLoadTweets: function() {
    this.dispatch(constants.DISPATCH_TWITTER_LOAD);
  }

};
module.exports = actions;
