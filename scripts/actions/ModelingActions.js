var DashboardClient = require("../clients/dashboard_client.js"),
    ComponentClient = require("../clients/component_client.js"),
    DataClient = require("../clients/data_client.js"),
    API_ROOT = require("../constants/environment.js").API_ROOT,
    ScoreClient = require("../clients/score_client.js"),
    AssetClient = require("../clients/asset_client.js"),
    constants = require("../constants/constants.js"),
    interactions = require('../constants/interactions.js'),

ModelingActions = {
	testAction: function() {
		this.dispatch("TEST_ACTION", {
			data: "this is a tes"
		});
	}
};

module.exports = ModelingActions;
