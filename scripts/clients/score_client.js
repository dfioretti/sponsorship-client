var API_ROOT = require("../constants/environment.js").API_ROOT;
var score_url = { SCORE_URL: API_ROOT + "api/v1/scores" };
var Auth = require('../vendor/jtoker.js');
var $ = require('jquery');

var ScoreClient = {
    getScores: function(callback) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: score_url.SCORE_URL,
            beforeSend: Auth.appendAuthHeaders,
            success: function(data) {
                callback(data)
            },
            error: function(o, c, n) {
                console.log(o);
                console.log(c);
                console.log(n);
            }
        })
    },
    createScore: function(score, callback) {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: score_url.SCORE_URL,
            beforeSend: Auth.appendAuthHeaders,
            data: JSON.stringify({
                score: score
            }),
            success: function(data) {
                callback(data)
            },
            error: function(o, c, n) {
                console.log(o);
                console.log(c);
                console.log(n);
            }
        });
    },
    updateScore: function(score, callback) {
        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: score_url.SCORE_URL + score.id,
            beforeSend: Auth.appendAuthHeaders,
            data: JSON.stringify({
                score: score
            }),
            success: function(data) {
                callback(data);
            },
            error: function(o, c, n) {
                console.log(o);
                console.log(c);
                console.log(n);
            }
        });
    },
    viewScore: function(score_id, callback) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: score_url.SCORE_URL + score_id,
            beforeSend: Auth.appendAuthHeaders,
            success: function(data) {
                callback(data);
            },
            error: function(o, c, n) {
                console.log(c);
                console.log(n);
                console.log(o);
            }
        });
    }
};
module.exports = ScoreClient;
