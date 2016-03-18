function _getErrors(e) {
    var r = ["Something went wrong, please try again"];
    return (json = JSON.parse(e.text)) && (json.errors ? r = json.errors : json.error && (r = [json.error])), r
}
var ServerActionCreators = require("../actions/ServerActionCreators.react.jsx"),
    SmallConstants = require("../constants/SmallConstants.js"),
    request = require("superagent"),
    APIEndpoints = SmallConstants.APIEndpoints;
module.exports = {
    signup: function(e, r, t, o) {
        request.post(APIEndpoints.REGISTRATION).send({
            user: {
                email: e,
                username: r,
                password: t,
                password_confirmation: o
            }
        }).set("Accept", "application/json").end(function(e, r) {
            if (r)
                if (r.error) {
                    var t = _getErrors(r);
                    ServerActionCreators.receiveLogin(null, t)
                } else json = JSON.parse(r.text), ServerActionCreators.receiveLogin(json, null)
        })
    },
    login: function(e, r) {
        request.post(APIEndpoints.LOGIN).send({
            email: e,
            password: r,
            grant_type: "password"
        }).set("Accept", "application/json").end(function(e, r) {
            if (r)
                if (r.error) {
                    var t = _getErrors(r);
                    ServerActionCreators.receiveLogin(null, t)
                } else json = JSON.parse(r.text), ServerActionCreators.receiveLogin(json, null)
        })
    },
    loadStories: function() {
        request.get(APIEndpoints.STORIES).set("Accept", "application/json").set("Authorization", sessionStorage.getItem("accessToken")).end(function(e, r) {
            r && (json = JSON.parse(r.text), ServerActionCreators.receiveStories(json))
        })
    },
    loadStory: function(e) {
        request.get(APIEndpoints.STORIES + "/" + e).set("Accept", "application/json").set("Authorization", sessionStorage.getItem("accessToken")).end(function(e, r) {
            r && (json = JSON.parse(r.text), ServerActionCreators.receiveStory(json))
        })
    },
    createStory: function(e, r) {
        request.post(APIEndpoints.STORIES).set("Accept", "application/json").set("Authorization", sessionStorage.getItem("accessToken")).send({
            story: {
                title: e,
                body: r
            }
        }).end(function(e, r) {
            if (r)
                if (r.error) {
                    var t = _getErrors(r);
                    ServerActionCreators.receiveCreatedStory(null, t)
                } else json = JSON.parse(r.text), ServerActionCreators.receiveCreatedStory(json, null)
        })
    }
};