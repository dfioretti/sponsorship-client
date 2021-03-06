var SmallConstants = require("../constants/SmallConstants.js"),
    Dispatcher = require("flux").Dispatcher,
    assign = require("object-assign"),
    PayloadSources = SmallConstants.PayloadSources,
    SmallAppDispatcher = assign(new Dispatcher, {
        handleServerAction: function(a) {
            var s = {
                source: PayloadSources.SERVER_ACTION,
                action: a
            };
            this.dispatch(s)
        },
        handleViewAction: function(a) {
            var s = {
                source: PayloadSources.VIEW_ACTION,
                action: a
            };
            this.dispatch(s)
        }
    });
module.exports = SmallAppDispatcher;