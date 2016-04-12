var API_ROOT = require("../constants/environment.js").API_ROOT;
var url = { COMPONENT_URL: API_ROOT + "api/v1/components/" };
var Auth = require('../vendor/jtoker.js');
var $ = require('jquery');

var ComponentClient = {
    getComponents: function(callback) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: url.COMPONENT_URL,
            beforeSend: Auth.appendAuthHeaders,
            success: function(data) {
                callback(data)
            },
            error: function(o, n, e) {
                console.log(o);
                console.log(n);
                console.log(e);
            }
        })
    },
    createComponent: function(component, callback) {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: url.COMPONENT_URL,
            beforeSend: Auth.appendAuthHeaders,
            data: JSON.stringify({
                component: component,
                preview: false
            }),
            success: function(data) {
                callback(data)
            },
            error: function(o, n, e) {
                console.log(o);
                console.log(n);
                console.log(e);
            }
        })
    },
    generatePreviewData: function(component, callback) {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            beforeSend: Auth.appendAuthHeaders,
            url: url.COMPONENT_URL,
            data: JSON.stringify({
                component: component,
                preview: true
            }),
            success: function(data) {
                callback(data);
            },
            error: function(o, n, e) {
                console.log(o);
                console.log(n);
                console.log(e);
            }
        })
    },
    updateComponent: function(component, callback) {
        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: url.COMPONENT_URL + component.id,
            beforeSend: Auth.appendAuthHeaders,
            data: JSON.stringify({
                component: component
            }),
            success: function(data) {
                callback(data);
            },
            error: function(o, n, e) {
                console.log(o);
                console.log(n);
                console.log(e);
            }
        })
    },
    viewComponent: function(component_id, callback) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            beforeSend: Auth.appendAuthHeaders,
            url: url.COMPONENT_URL + component_id,
            success: function(data) {
                callback(data);
            },
            error: function(o, n, e) {
                console.log(o);
                console.log(n);
                console.log(e);
            }
        })
    }
};
module.exports = ComponentClient;
