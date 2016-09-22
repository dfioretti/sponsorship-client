/**
 * Register all of the stores into Fluxxor.
 *
 *
 * NOTE: Right now the stores are lazy - they essentialy
 * load all of the data for each model when they are first
 * requested.  This isn't sustainabile for large data sets.
 *
 * TODO: Implement the stores as an LRU cache. Only
 * load the needed objects for views, and cache for session.
 *
 */


var ComponentEditorStore = require("./component_editor_store.js"),
    ComponentsStore = require("./components_store.js"),
    EditorPreviewStore = require("./editor_preview_store.js"),
    DashboardEditStore = require("./dashboard_edit_store.js"),
    DashboardHomeStore = require("./dashboard_home_store.js"),
    ScoreEditorStore = require("./score_editor_store.js"),
    AssetsStore = require("./AssetsStore.js"),
    ExternalApiStore = require('./ExternalApiStore.js'),
    ScoresStore = require("./ScoresStore.js"),
    OverviewStore = require("./OverviewStore.js"),
    DataStore = require('./DataStore.js'),
    AlertStore = require('./AlertStore.js'),
    EntityDashboardStore = require('./EntityDashboardStore.js'),
    AnalyticsStore = require('./AnalyticsStore.js'),
    NavigationStore = require('./NavigationStore.js');
    ContextStore = require('./ContextStore.js');
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
        OverviewStore: new OverviewStore,
        NavigationStore: new NavigationStore,
        EntityDashboardStore: new EntityDashboardStore,
        ExternalApiStore: new ExternalApiStore,
        AnalyticsStore: new AnalyticsStore,
        AlertStore: new AlertStore,
        ContextStore: new ContextStore
    };
module.exports = stores;
