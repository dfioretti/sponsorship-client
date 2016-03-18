var url = {
        COMPONENT_URL: "http://localhost:4000/api/v1/apt/components/"
    },
    ComponentClient = {
        getComponents: function(o) {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: url.COMPONENT_URL,
                success: function(n) {
                    o(n)
                },
                error: function(o, n, e) {
                    console.log(n), console.log(e)
                }
            })
        },
        createComponent: function(o, n) {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: url.COMPONENT_URL,
                data: JSON.stringify({
                    component: o,
                    preview: !1
                }),
                success: function(o) {
                    n(o)
                },
                error: function(o, n, e) {
                    console.log(n), console.log(e)
                }
            })
        },
        generatePreviewData: function(o, n) {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: url.COMPONENT_URL,
                data: JSON.stringify({
                    component: o,
                    preview: !0
                }),
                success: function(o) {
                    n(o)
                },
                error: function(o, n, e) {
                    console.log(n), console.log(e)
                }
            })
        },
        updateComponent: function(o, n) {
            $.ajax({
                type: "PUT",
                contentType: "application/json",
                url: url.COMPONENT_URL + o.id,
                data: JSON.stringify({
                    component: o
                }),
                success: function(o) {
                    n(o)
                },
                error: function(o, n, e) {
                    console.log(n), console.log(e)
                }
            })
        },
        viewComponent: function(o, n) {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: url.COMPONENT_URL + o,
                success: function(o) {
                    successCallback(o)
                },
                error: function(o, n, e) {
                    console.log(n), console.log(e)
                }
            })
        }
    };
module.exports = ComponentClient;