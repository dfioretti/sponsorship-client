! function(e) {
    "function" == typeof define && define.amd ? define(["jquery", "jquery-deparam", "pubsub-js", "jquery.cookie"], e) : "object" == typeof exports ? module.exports = e(require("jquery"), require("jquery-deparam"), require("pubsub-js"), require("jquery.cookie")) : e(window.jQuery, window.deparam, window.PubSub)
}(function(e, t, r) {
    var o = Function("return this")();
    if (o.auth) return o.auth;
    var i = o.navigator,
        s = "default",
        n = "currentConfigName",
        a = "authHeaders",
        u = "firstTimeLogin",
        c = "mustResetPassword",
        h = "auth.validation.success",
        d = "auth.validation.error",
        f = "auth.emailRegistration.success",
        l = "auth.emailRegistration.error",
        p = "auth.passwordResetRequest.success",
        g = "auth.passwordResetRequest.error",
        m = "auth.emailConfirmation.success",
        v = "auth.emailConfirmation.error",
        y = "auth.passwordResetConfirm.success",
        C = "auth.passwordResetConfirm.error",
        k = "auth.emailSignIn.success",
        w = "auth.emailSignIn.error",
        P = "auth.oAuthSignIn.success",
        A = "auth.oAuthSignIn.error",
        D = "auth.signIn.success",
        S = "auth.signIn.error",
        j = "auth.signOut.success",
        b = "auth.signOut.error",
        T = "auth.accountUpdate.success",
        R = "auth.accountUpdate.error",
        U = "auth.destroyAccount.success",
        x = "auth.destroyAccount.error",
        E = "auth.passwordUpdate.success",
        I = "auth.passwordUpdate.error",
        _ = function() {
            this.configured = !1, this.configDfd = null, this.configs = {}, this.defaultConfigKey = null, this.firstTimeLogin = !1, this.mustResetPassword = !1, this.user = {}, this.oAuthDfd = null, this.oAuthTimer = null, this.configBase = {
                apiUrl: "/api",
                signOutPath: "/auth/sign_out",
                emailSignInPath: "/auth/sign_in",
                emailRegistrationPath: "/auth",
                accountUpdatePath: "/auth",
                accountDeletePath: "/auth",
                passwordResetPath: "/auth/password",
                passwordUpdatePath: "/auth/password",
                tokenValidationPath: "/auth/validate_token",
                proxyIf: function() {
                    return !1
                },
                proxyUrl: "/proxy",
                forceHardRedirect: !1,
                storage: "cookies",
                cookieExpiry: 14,
                cookiePath: "/",
                initialCredentials: null,
                passwordResetSuccessUrl: function() {
                    return o.location.href
                },
                confirmationSuccessUrl: function() {
                    return o.location.href
                },
                tokenFormat: {
                    "access-token": "{{ access-token }}",
                    "token-type": "Bearer",
                    client: "{{ client }}",
                    expiry: "{{ expiry }}",
                    uid: "{{ uid }}"
                },
                parseExpiry: function(e) {
                    return 1e3 * parseInt(e.expiry, 10) || null
                },
                handleLoginResponse: function(e) {
                    return e.data
                },
                handleAccountUpdateResponse: function(e) {
                    return e.data
                },
                handleTokenValidationResponse: function(e) {
                    return e.data
                },
                authProviderPaths: {
                    github: "/auth/github",
                    facebook: "/auth/facebook",
                    google: "/auth/google_oauth2"
                }
            }
        };
    _.prototype.reset = function() {
        this.destroySession(), this.configs = {}, this.defaultConfigKey = null, this.configured = !1, this.configDfd = null, this.mustResetPassword = !1, this.firstTimeLogin = !1, this.oAuthDfd = null, this.willRedirect = !1, this.oAuthTimer && (clearTimeout(this.oAuthTimer), this.oAuthTimer = null);
        for (var t in this.user) delete this.user[t];
        e(document).unbind("ajaxComplete", this.updateAuthCredentials), o.removeEventListener && o.removeEventListener("message", this.handlePostMessage), e.ajaxSetup({
            beforeSend: void 0
        })
    }, _.prototype.invalidateTokens = function() {
        for (var e in this.user) delete this.user[e];
        this.deleteData(n), this.deleteData(a)
    }, _.prototype.checkDependencies = function() {
        var i = [],
            s = [];
        if (!e) throw "jToker: jQuery not found. This module depends on jQuery.";
        if (o.localStorage || e.cookie || i.push("This browser does not support localStorage. You must install jquery-cookie to use jToker with this browser."), t || i.push("Dependency not met: jquery-deparam."), r || s.push("jquery.ba-tinypubsub.js not found. No auth events will be broadcast."), i.length) {
            var n = i.join(" ");
            throw "jToker: Please resolve the following errors: " + n
        }
        if (s.length && console && console.warn) {
            var a = s.join(" ");
            console.warn("jToker: Warning: " + a)
        }
    }, _.prototype.destroySession = function() {
        var t = [a, n];
        for (var r in t)
            if (r = t[r], o.localStorage && o.localStorage.removeItem(r), e.cookie) {
                for (var i in this.configs) {
                    var s = this.configs[i].cookiePath;
                    e.removeCookie(r, {
                        path: s
                    })
                }
                e.removeCookie(r, {
                    path: "/"
                })
            }
    }, _.prototype.configure = function(t, r) {
        if (r && this.reset(), this.configured) return this.configDfd;
        if (this.configured = !0, t || (t = {}), t.constructor !== Array) {
            this.defaultConfigKey = s;
            var i = {};
            i[this.defaultConfigKey] = t, t = [i]
        }
        for (var n = 0; n < t.length; n++) {
            var h = q(t[n]);
            this.defaultConfigKey || (this.defaultConfigKey = h), this.configs[h] = e.extend({}, this.configBase, t[n][h])
        }
        if (this.checkDependencies(), e(document).ajaxComplete(o.auth.updateAuthCredentials), e.ajaxSetup({
                beforeSend: o.auth.appendAuthHeaders
            }), o.addEventListener && o.addEventListener("message", this.handlePostMessage, !1), this.processSearchParams(), this.willRedirect) return !1;
        if (this.getConfig().initialCredentials) {
            var d = this.getConfig();
            return this.persistData(a, d.initialCredentials.headers), this.persistData(c, d.initialCredentials.mustResetPassword), this.persistData(u, d.initialCredentials.firstTimeLogin), this.setCurrentUser(d.initialCredentials.user), (new e.Deferred).resolve(d.initialCredentials.user)
        }
        return this.configDfd = this.validateToken({
            config: this.getCurrentConfigName()
        }), this.configDfd
    }, _.prototype.getApiUrl = function() {
        var e = this.getConfig();
        return e.proxyIf() ? e.proxyUrl : e.apiUrl
    }, _.prototype.buildAuthHeaders = function(e) {
        var t = {},
            r = this.getConfig().tokenFormat;
        for (var o in r) t[o] = Q(r[o], e);
        return t
    }, _.prototype.setCurrentUser = function(t) {
        for (var r in this.user) delete this.user[r];
        return e.extend(this.user, t), this.user.signedIn = !0, this.user.configName = this.getCurrentConfigName(), this.user
    }, _.prototype.handlePostMessage = function(e) {
        var t = !1;
        if ("deliverCredentials" === e.data.message) {
            delete e.data.message;
            var r = o.auth.normalizeTokenKeys(e.data),
                i = o.auth.buildAuthHeaders(r),
                s = o.auth.setCurrentUser(e.data);
            o.auth.persistData(a, i), o.auth.resolvePromise(P, o.auth.oAuthDfd, s), o.auth.broadcastEvent(D, s), o.auth.broadcastEvent(h, s), t = !0
        }
        "authFailure" === e.data.message && (o.auth.rejectPromise(A, o.auth.oAuthDfd, e.data, "OAuth authentication failed."), o.auth.broadcastEvent(S, e.data), t = !0), t && (clearTimeout(o.auth.oAuthTimer), o.auth.oAuthTimer = null)
    }, _.prototype.normalizeTokenKeys = function(e) {
        return e.token && (e["access-token"] = e.token, delete e.token), e.auth_token && (e["access-token"] = e.auth_token, delete e.auth_token), e.client_id && (e.client = e.client_id, delete e.client_id), e.config && (this.persistData(n, e.config, e.config), delete e.config), e
    }, _.prototype.processSearchParams = function() {
        var e = this.getQs(),
            t = null;
        if (e = this.normalizeTokenKeys(e), e["access-token"] && e.uid) {
            t = this.buildAuthHeaders(e), this.persistData(a, t), e.reset_password && this.persistData(c, !0), e.account_confirmation_success && this.persistData(u, !0);
            var r = this.getLocationWithoutParams(["access-token", "token", "auth_token", "config", "client", "client_id", "expiry", "uid", "reset_password", "account_confirmation_success"]);
            this.willRedirect = !0, this.setLocation(r)
        }
        return t
    }, _.prototype.getLocationWithoutParams = function(t) {
        var r = e.param(this.stripKeys(this.getSearchQs(), t)),
            i = e.param(this.stripKeys(this.getAnchorQs(), t)),
            s = o.location.hash.split("?")[0];
        r && (r = "?" + r), i && (s += "?" + i), s && !s.match(/^#/) && (s = "#/" + s);
        var n = o.location.protocol + "//" + o.location.host + o.location.pathname + r + s;
        return n
    }, _.prototype.stripKeys = function(e, t) {
        for (var r in t) delete e[t[r]];
        return e
    }, _.prototype.broadcastEvent = function(e, t) {
        r.publish && r.publish(e, t)
    }, _.prototype.resolvePromise = function(t, r, o) {
        var i = this,
            s = e.Deferred();
        return setTimeout(function() {
            i.broadcastEvent(t, o), r.resolve(o), s.resolve()
        }, 0), s.promise()
    }, _.prototype.rejectPromise = function(t, r, o, i) {
        var s = this;
        return o = e.parseJSON(o && o.responseText || "{}"), setTimeout(function() {
            s.broadcastEvent(t, o), r.reject({
                reason: i,
                data: o
            })
        }, 0), r
    }, _.prototype.validateToken = function(t) {
        if (t || (t = {}), t.config || (t.config = this.getCurrentConfigName()), this.configDfd) return this.configDfd;
        var r = e.Deferred();
        if (this.retrieveData(a)) {
            var o = this.getConfig(t.config),
                i = this.getApiUrl() + o.tokenValidationPath;
            e.ajax({
                url: i,
                context: this,
                success: function(e) {
                    var t = o.handleTokenValidationResponse(e);
                    this.setCurrentUser(t), this.retrieveData(u) && (this.broadcastEvent(m, e), this.persistData(u, !1), this.firstTimeLogin = !0), this.retrieveData(c) && (this.broadcastEvent(y, e), this.persistData(c, !1), this.mustResetPassword = !0), this.resolvePromise(h, r, this.user)
                },
                error: function(e) {
                    this.invalidateTokens(), this.retrieveData(u) && (this.broadcastEvent(v, e), this.persistData(u, !1)), this.retrieveData(c) && (this.broadcastEvent(C, e), this.persistData(c, !1)), this.rejectPromise(d, r, e, "Cannot validate token; token rejected by server.")
                }
            })
        } else this.invalidateTokens(), this.rejectPromise(d, r, {}, "Cannot validate token; no token found.");
        return r.promise()
    }, _.prototype.emailSignUp = function(t) {
        t || (t = {});
        var r = this.getConfig(t.config),
            o = this.getApiUrl() + r.emailRegistrationPath,
            i = e.Deferred();
        return t.config_name = t.config, delete t.config, t.confirm_success_url = r.confirmationSuccessUrl(), e.ajax({
            url: o,
            context: this,
            method: "POST",
            data: t,
            success: function(e) {
                this.resolvePromise(f, i, e)
            },
            error: function(e) {
                this.rejectPromise(l, i, e, "Failed to submit email registration.")
            }
        }), i.promise()
    }, _.prototype.emailSignIn = function(t) {
        t || (t = {});
        var r = this.getConfig(t.config),
            o = this.getApiUrl() + r.emailSignInPath,
            i = e.Deferred();
        return delete t.config, e.ajax({
            url: o,
            context: this,
            method: "POST",
            data: t,
            success: function(e) {
                var t = r.handleLoginResponse(e);
                this.setCurrentUser(t), this.resolvePromise(k, i, e), this.broadcastEvent(D, t), this.broadcastEvent(h, this.user)
            },
            error: function(e) {
                this.rejectPromise(w, i, e, "Invalid credentials."), this.broadcastEvent(S, e)
            }
        }), i.promise()
    }, _.prototype.listenForCredentials = function(e) {
        var t = this;
        e.closed ? t.rejectPromise(A, t.oAuthDfd, null, "OAuth window was closed bofore registration was completed.") : (e.postMessage("requestCredentials", "*"), t.oAuthTimer = setTimeout(function() {
            t.listenForCredentials(e)
        }, 500))
    }, _.prototype.openAuthWindow = function(e) {
        if (this.getConfig().forceHardRedirect || o.isIE()) this.setLocation(e);
        else {
            var t = this.createPopup(e);
            this.listenForCredentials(t)
        }
    }, _.prototype.buildOAuthUrl = function(e, t, r) {
        var i = this.getConfig().apiUrl + r + "?auth_origin_url=" + encodeURIComponent(o.location.href) + "&config_name=" + encodeURIComponent(e || this.getCurrentConfigName()) + "&omniauth_window_type=newWindow";
        if (t)
            for (var s in t) i += "&", i += encodeURIComponent(s), i += "=", i += encodeURIComponent(t[s]);
        return i
    }, _.prototype.oAuthSignIn = function(t) {
        if (t || (t = {}), !t.provider) throw "jToker: provider param undefined for `oAuthSignIn` method.";
        var r = this.getConfig(t.config),
            o = r.authProviderPaths[t.provider],
            i = this.buildOAuthUrl(t.config, t.params, o);
        if (!o) throw "jToker: providerPath not found for provider: " + t.provider;
        return this.oAuthDfd = e.Deferred(), this.openAuthWindow(i), this.oAuthDfd.promise()
    }, _.prototype.signOut = function(t) {
        t || (t = {});
        var r = this.getConfig(t.config),
            o = this.getApiUrl() + r.signOutPath,
            i = e.Deferred();
        return e.ajax({
            url: o,
            context: this,
            method: "DELETE",
            success: function(e) {
                this.resolvePromise(j, i, e)
            },
            error: function(e) {
                this.rejectPromise(b, i, e, "Failed to sign out.")
            },
            complete: function() {
                this.invalidateTokens()
            }
        }), i.promise()
    }, _.prototype.updateAccount = function(t) {
        t || (t = {});
        var r = this.getConfig(t.config),
            o = this.getApiUrl() + r.accountUpdatePath,
            i = e.Deferred();
        return delete t.config, e.ajax({
            url: o,
            context: this,
            method: "PUT",
            data: t,
            success: function(e) {
                var t = r.handleAccountUpdateResponse(e);
                this.setCurrentUser(t), this.resolvePromise(T, i, e)
            },
            error: function(e) {
                this.rejectPromise(R, i, e, "Failed to update user account")
            }
        }), i.promise()
    }, _.prototype.destroyAccount = function(t) {
        t || (t = {});
        var r = this.getConfig(t.config),
            o = this.getApiUrl() + r.accountDeletePath,
            i = e.Deferred();
        return e.ajax({
            url: o,
            context: this,
            method: "DELETE",
            success: function(e) {
                this.invalidateTokens(), this.resolvePromise(U, i, e)
            },
            error: function(e) {
                this.rejectPromise(x, i, e, "Failed to destroy user account")
            }
        }), i.promise()
    }, _.prototype.requestPasswordReset = function(t) {
        if (t || (t = {}), void 0 === t.email) throw "jToker: email param undefined for `requestPasswordReset` method.";
        var r = this.getConfig(t.config),
            o = this.getApiUrl() + r.passwordResetPath,
            i = e.Deferred();
        return t.config_name = t.config, delete t.config, t.redirect_url = r.passwordResetSuccessUrl(), e.ajax({
            url: o,
            context: this,
            method: "POST",
            data: t,
            success: function(e) {
                this.resolvePromise(p, i, e)
            },
            error: function(e) {
                this.rejectPromise(g, i, e, "Failed to submit email registration.")
            }
        }), i.promise()
    }, _.prototype.updatePassword = function(t) {
        t || (t = {});
        var r = this.getConfig(t.config),
            o = this.getApiUrl() + r.passwordUpdatePath,
            i = e.Deferred();
        return delete t.config, e.ajax({
            url: o,
            context: this,
            method: "PUT",
            data: t,
            success: function(e) {
                this.resolvePromise(E, i, e)
            },
            error: function(e) {
                this.rejectPromise(I, i, e, "Failed to update password.")
            }
        }), i.promise()
    }, _.prototype.persistData = function(t, r, i) {
        switch (r = JSON.stringify(r), this.getConfig(i).storage) {
            case "localStorage":
                o.localStorage.setItem(t, r);
                break;
            default:
                e.cookie(t, r, {
                    expires: this.getConfig(i).cookieExpiry,
                    path: this.getConfig(i).cookiePath
                })
        }
    }, _.prototype.retrieveData = function(t) {
        var r = null;
        switch (this.getConfig().storage) {
            case "localStorage":
                r = o.localStorage.getItem(t);
                break;
            default:
                r = e.cookie(t)
        }
        try {
            return e.parseJSON(r)
        } catch (i) {
            return L(r)
        }
    }, _.prototype.getCurrentConfigName = function() {
        var t = null;
        return this.getQs().config && (t = this.getQs().config), e.cookie && !t && (t = e.cookie(n)), o.localStorage && !t && (t = o.localStorage.getItem(n)), t = t || this.defaultConfigKey || s, L(t)
    }, _.prototype.deleteData = function(t) {
        switch (this.getConfig().storage) {
            case "cookies":
                e.removeCookie(t, {
                    path: this.getConfig().cookiePath
                });
                break;
            default:
                o.localStorage.removeItem(t)
        }
    }, _.prototype.getConfig = function(e) {
        if (!this.configured) throw "jToker: `configure` must be run before using this plugin.";
        return e = e || this.getCurrentConfigName(), this.configs[e]
    }, _.prototype.appendAuthHeaders = function(e, t) {
        var r = o.auth.retrieveData(a);
        if (O(t.url) && r) {
            e.setRequestHeader("If-Modified-Since", "Mon, 26 Jul 1997 05:00:00 GMT");
            for (var i in o.auth.getConfig().tokenFormat) e.setRequestHeader(i, r[i])
        }
    }, _.prototype.updateAuthCredentials = function(e, t, r) {
        if (O(r.url)) {
            var i = {},
                s = !0;
            for (var n in o.auth.getConfig().tokenFormat) i[n] = t.getResponseHeader(n), i[n] && (s = !1);
            s || o.auth.persistData(a, i)
        }
    }, _.prototype.getRawSearch = function() {
        return o.location.search
    }, _.prototype.getRawAnchor = function() {
        return o.location.hash
    }, _.prototype.setRawAnchor = function(e) {
        o.location.hash = e
    }, _.prototype.getAnchorSearch = function() {
        var e = this.getRawAnchor().split("?");
        return e.length > 1 ? e[1] : null
    }, _.prototype.setRawSearch = function(e) {
        o.location.search = e
    }, _.prototype.setSearchQs = function(t) {
        return this.setRawSearch(e.param(t)), this.getSearchQs()
    }, _.prototype.setAnchorQs = function(t) {
        return this.setAnchorSearch(e.param(t)), this.getAnchorQs()
    }, _.prototype.setLocation = function(e) {
        o.location.replace(e)
    }, _.prototype.createPopup = function(e) {
        return o.open(e)
    }, _.prototype.getSearchQs = function() {
        var e = this.getRawSearch().replace("?", ""),
            r = e ? t(e) : {};
        return r
    }, _.prototype.getAnchorQs = function() {
        var e = this.getAnchorSearch(),
            r = e ? t(e) : {};
        return r
    }, _.prototype.getQs = function() {
        return e.extend(this.getSearchQs(), this.getAnchorQs())
    };
    var q = function(e) {
            for (var t in e) return t
        },
        L = function(e) {
            return e && e.replace(/("|')/g, "")
        },
        O = function(e) {
            return e.match(o.auth.getApiUrl())
        },
        Q = function(e, t) {
            for (var r = function(e, r) {
                    return void 0 === t[r] ? e : t[r]
                }, o = new RegExp("{{\\s*([a-z0-9-_]+)\\s*}}", "ig"), i = ""; i !== e; e = (i = e).replace(o, r));
            return e
        };
    return o.isOldIE = function() {
        var e = !1,
            t = i.userAgent.toLowerCase();
        if (t && -1 !== t.indexOf("msie")) {
            var r = parseInt(t.split("msie")[1]);
            10 > r && (e = !0)
        }
        return e
    }, o.isIE = function() {
        var e = o.isOldIE(),
            t = !!i.userAgent.match(/Trident.*rv\:11\./);
        return e || t
    }, o.auth = e.auth = new _, o.auth
});