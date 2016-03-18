var score_url = {
        SCORE_URL: "http://localhost:4000/api/v1/apt/scores/"
    },
    ScoreClient = {
        getScores: function(o) {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: score_url.SCORE_URL,
                success: function(c) {
                    o(c)
                },
                error: function(o, c, n) {
                    console.log(c), console.log(n)
                }
            })
        },
        createScore: function(o, c) {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: score_url.SCORE_URL,
                data: JSON.stringify({
                    score: o
                }),
                success: function(o) {
                    c(o)
                },
                error: function(o, c, n) {
                    console.log(c), console.log(n)
                }
            })
        },
        updateScore: function(o, c) {
            $.ajax({
                type: "PUT",
                contentType: "application/json",
                url: score_url.SCORE_URL + o.id,
                data: JSON.stringify({
                    score: o
                }),
                success: function(o) {
                    c(o)
                },
                error: function(o, c, n) {
                    console.log(c), console.log(n)
                }
            })
        },
        viewScore: function(o, c) {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: score_url.SCORE_URL + o,
                success: function(o) {
                    c(o)
                },
                error: function(o, c, n) {
                    console.log(c), console.log(n)
                }
            })
        }
    };
module.exports = ScoreClient;