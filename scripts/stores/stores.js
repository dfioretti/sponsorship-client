var ComponentEditorStore = require("./component_editor_store.js"),
    ComponentsStore = require("./components_store.js"),
    EditorPreviewStore = require("./editor_preview_store.js"),
    DashboardEditStore = require("./dashboard_edit_store.js"),
    DashboardHomeStore = require("./dashboard_home_store.js"),
    ScoreEditorStore = require("./score_editor_store.js"),
    AssetsStore = require("./AssetsStore.js"),
    ScoresStore = require("./ScoresStore.js"),
    OverviewStore = require("./OverviewStore.js");
    DataStore = require('./DataStore.js');
    stores = {
        ComponentEditorStore: new ComponentEditorStore,
        ComponentsStore: new ComponentsStore,
        EditorPreviewStore: new EditorPreviewStore,
        DashboardEditStore: new DashboardEditStore,
        DashboardHomeStore: new DashboardHomeStore,
        ScoreEditorStore: new ScoreEditorStore,
        ScoresStore: new ScoresStore,
        AssetsStore: new AssetsStore,
        DataStore: new DataStore,
        OverviewStore: new OverviewStore
    };
module.exports = stores;
