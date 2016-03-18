var Fluxxor = require("fluxxor"),
    constants = require("../constants/constants.js"),


DataStore = Fluxxor.createStore({
  initialize: function() {
		this.data = [];
		this.dataLoaded = false;
		this.loading = false;
    this.bindActions(
			constants.LOAD_DATA_SUCCESS, this.onLoadDataSuccess,
			constants.LOAD_DATA, this.onLoadData
		)
  },
  onLoadData: function() {
      this.loading = true;
  },
  onLoadDataSuccess: function(payload) {
		this.data = payload.data;
		this.dataLoaded = true;
		this.loading = false;
		this.emit("change");
  },
  getState: function() {
    return {
			data: this.data,
			loading: this.loading,
			loaded: this.dataLoaded
    }
  }
});
module.exports = DataStore;
