! function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
}(function(e) {
    e.fn.jScrollPane = function(t) {
        function o(t, o) {
            function i(o) {
                var s, a, c, u, p, h, v = !1,
                    j = !1;
                if (L = o, void 0 === R) p = t.scrollTop(), h = t.scrollLeft(), t.css({
                    overflow: "hidden",
                    padding: 0
                }), I = t.innerWidth() + ge, q = t.innerHeight(), t.width(I), R = e('<div class="jspPane" />').css("padding", je).append(t.children()), V = e('<div class="jspContainer" />').css({
                    width: I + "px",
                    height: q + "px"
                }).append(R).appendTo(t);
                else {
                    if (t.css("width", ""), v = L.stickToBottom && x(), j = L.stickToRight && P(), u = t.innerWidth() + ge != I || t.outerHeight() != q, u && (I = t.innerWidth() + ge, q = t.innerHeight(), V.css({
                            width: I + "px",
                            height: q + "px"
                        })), !u && me == G && R.outerHeight() == N) return void t.width(I);
                    me = G, R.css("width", ""), t.width(I), V.find(">.vBarWrapper").remove().end()
                }
                R.css("overflow", "auto"), G = o.contentWidth ? o.contentWidth : R[0].scrollWidth, N = R[0].scrollHeight, R.css("overflow", ""), E = G / I, _ = N / q, K = _ > 1, Q = E > 1, Q || K ? (t.addClass("jspScrollable"), s = L.maintainPosition && (J || te), s && (a = C(), c = S()), n(), r(), l(), s && (y(j ? G - I : a, !1), k(v ? N - q : c, !1)), A(), B(), X(), L.enableKeyboardNavigation && Y(), L.clickOnTrack && d(), M(), L.hijackInternalLinks && O()) : (t.removeClass("jspScrollable"), R.css({
                    top: 0,
                    left: 0,
                    width: V.width() - ge
                }), H(), W(), F(), f()), L.autoReinitialise && !ve ? ve = setInterval(function() {
                    i(L)
                }, L.autoReinitialiseDelay) : !L.autoReinitialise && ve && clearInterval(ve), p && t.scrollTop(0) && k(p, !1), h && t.scrollLeft(0) && y(h, !1), t.trigger("jsp-initialised", [Q || K])
            }

            function n() {
                K && (V.append(e('<div class="jspVerticalBar" />').append(e('<div class="jspCap jspCapTop" />'), e('<div class="jspTrack" />').append(e('<div class="jspDrag" />').append(e('<div class="jspDragTop" />'), e('<div class="jspDragBottom" />'))), e('<div class="jspCap jspCapBottom" />'))), oe = V.find(">.jspVerticalBar"), ie = oe.find(">.jspTrack"), U = ie.find(">.jspDrag"), L.showArrows && (ae = e('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp", u(0, -1)).bind("click.jsp", D), le = e('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp", u(0, 1)).bind("click.jsp", D), L.arrowScrollOnHover && (ae.bind("mouseover.jsp", u(0, -1, ae)), le.bind("mouseover.jsp", u(0, 1, le))), c(ie, L.verticalArrowPositions, ae, le)), se = q, V.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function() {
                    se -= e(this).outerHeight()
                }), U.hover(function() {
                    U.addClass("jspHover")
                }, function() {
                    U.removeClass("jspHover")
                }).bind("mousedown.jsp", function(t) {
                    e("html").bind("dragstart.jsp selectstart.jsp", D), U.addClass("jspActive");
                    var o = t.pageY - U.position().top;
                    return e("html").bind("mousemove.jsp", function(e) {
                        v(e.pageY - o, !1)
                    }).bind("mouseup.jsp mouseleave.jsp", h), !1
                }), s())
            }

            function s() {
                ie.height(se + "px"), J = 0, ne = L.verticalGutter + ie.outerWidth(), R.width(I - ne - ge);
                try {
                    0 === oe.position().left && R.css("margin-left", ne + "px")
                } catch (e) {}
            }

            function r() {
                Q && (V.append(e('<div class="jspHorizontalBar" />').append(e('<div class="jspCap jspCapLeft" />'), e('<div class="jspTrack" />').append(e('<div class="jspDrag" />').append(e('<div class="jspDragLeft" />'), e('<div class="jspDragRight" />'))), e('<div class="jspCap jspCapRight" />'))), ce = V.find(">.jspHorizontalBar"), ue = ce.find(">.jspTrack"), Z = ue.find(">.jspDrag"), L.showArrows && (fe = e('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp", u(-1, 0)).bind("click.jsp", D), he = e('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp", u(1, 0)).bind("click.jsp", D), L.arrowScrollOnHover && (fe.bind("mouseover.jsp", u(-1, 0, fe)), he.bind("mouseover.jsp", u(1, 0, he))), c(ue, L.horizontalArrowPositions, fe, he)), Z.hover(function() {
                    Z.addClass("jspHover")
                }, function() {
                    Z.removeClass("jspHover")
                }).bind("mousedown.jsp", function(t) {
                    e("html").bind("dragstart.jsp selectstart.jsp", D), Z.addClass("jspActive");
                    var o = t.pageX - Z.position().left;
                    return e("html").bind("mousemove.jsp", function(e) {
                        g(e.pageX - o, !1)
                    }).bind("mouseup.jsp mouseleave.jsp", h), !1
                }), pe = V.innerWidth(), a())
            }

            function a() {
                V.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function() {
                    pe -= e(this).outerWidth()
                }), ue.width(pe + "px"), te = 0
            }

            function l() {
                if (Q && K) {
                    var t = ue.outerHeight(),
                        o = ie.outerWidth();
                    se -= t, e(ce).find(">.jspCap:visible,>.jspArrow").each(function() {
                        pe += e(this).outerWidth()
                    }), pe -= o, q -= o, I -= t, ue.parent().append(e('<div class="jspCorner" />').css("width", t + "px")), s(), a()
                }
                Q && R.width(V.outerWidth() - ge + "px"), N = R.outerHeight(), _ = N / q, Q && (de = Math.ceil(1 / E * pe), de > L.horizontalDragMaxWidth ? de = L.horizontalDragMaxWidth : de < L.horizontalDragMinWidth && (de = L.horizontalDragMinWidth), Z.width(de + "px"), ee = pe - de, m(te)), K && (re = Math.ceil(1 / _ * se), re > L.verticalDragMaxHeight ? re = L.verticalDragMaxHeight : re < L.verticalDragMinHeight && (re = L.verticalDragMinHeight), U.height(re + "px"), $ = se - re, j(J))
            }

            function c(e, t, o, i) {
                var n, s = "before",
                    r = "after";
                "os" == t && (t = /Mac/.test(navigator.platform) ? "after" : "split"), t == s ? r = t : t == r && (s = t, n = o, o = i, i = n), e[s](o)[r](i)
            }

            function u(e, t, o) {
                return function() {
                    return p(e, t, this, o), this.blur(), !1
                }
            }

            function p(t, o, i, n) {
                i = e(i).addClass("jspActive");
                var s, r, a = !0,
                    l = function() {
                        0 !== t && be.scrollByX(t * L.arrowButtonSpeed), 0 !== o && be.scrollByY(o * L.arrowButtonSpeed), r = setTimeout(l, a ? L.initialDelay : L.arrowRepeatFreq), a = !1
                    };
                l(), s = n ? "mouseout.jsp" : "mouseup.jsp", n = n || e("html"), n.bind(s, function() {
                    i.removeClass("jspActive"), r && clearTimeout(r), r = null, n.unbind(s)
                })
            }

            function d() {
                f(), K && ie.bind("mousedown.jsp", function(t) {
                    if (void 0 === t.originalTarget || t.originalTarget == t.currentTarget) {
                        var o, i = e(this),
                            n = i.offset(),
                            s = t.pageY - n.top - J,
                            r = !0,
                            a = function() {
                                var e = i.offset(),
                                    n = t.pageY - e.top - re / 2,
                                    c = q * L.scrollPagePercent,
                                    u = $ * c / (N - q);
                                if (0 > s) J - u > n ? be.scrollByY(-c) : v(n);
                                else {
                                    if (!(s > 0)) return void l();
                                    n > J + u ? be.scrollByY(c) : v(n)
                                }
                                o = setTimeout(a, r ? L.initialDelay : L.trackClickRepeatFreq), r = !1
                            },
                            l = function() {
                                o && clearTimeout(o), o = null, e(document).unbind("mouseup.jsp", l)
                            };
                        return a(), e(document).bind("mouseup.jsp", l), !1
                    }
                }), Q && ue.bind("mousedown.jsp", function(t) {
                    if (void 0 === t.originalTarget || t.originalTarget == t.currentTarget) {
                        var o, i = e(this),
                            n = i.offset(),
                            s = t.pageX - n.left - te,
                            r = !0,
                            a = function() {
                                var e = i.offset(),
                                    n = t.pageX - e.left - de / 2,
                                    c = I * L.scrollPagePercent,
                                    u = ee * c / (G - I);
                                if (0 > s) te - u > n ? be.scrollByX(-c) : g(n);
                                else {
                                    if (!(s > 0)) return void l();
                                    n > te + u ? be.scrollByX(c) : g(n)
                                }
                                o = setTimeout(a, r ? L.initialDelay : L.trackClickRepeatFreq), r = !1
                            },
                            l = function() {
                                o && clearTimeout(o), o = null, e(document).unbind("mouseup.jsp", l)
                            };
                        return a(), e(document).bind("mouseup.jsp", l), !1
                    }
                })
            }

            function f() {
                ue && ue.unbind("mousedown.jsp"), ie && ie.unbind("mousedown.jsp")
            }

            function h() {
                e("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp"), U && U.removeClass("jspActive"), Z && Z.removeClass("jspActive")
            }

            function v(e, t) {
                K && (0 > e ? e = 0 : e > $ && (e = $), void 0 === t && (t = L.animateScroll), t ? be.animate(U, "top", e, j) : (U.css("top", e), j(e)))
            }

            function j(e) {
                void 0 === e && (e = U.position().top), V.scrollTop(0), J = e || 0;
                var o = 0 === J,
                    i = J == $,
                    n = e / $,
                    s = -n * (N - q);
                (we != o || ye != i) && (we = o, ye = i, t.trigger("jsp-arrow-change", [we, ye, ke, Te])), b(o, i), R.css("top", s), t.trigger("jsp-scroll-y", [-s, o, i]).trigger("scroll")
            }

            function g(e, t) {
                Q && (0 > e ? e = 0 : e > ee && (e = ee), void 0 === t && (t = L.animateScroll), t ? be.animate(Z, "left", e, m) : (Z.css("left", e), m(e)))
            }

            function m(e) {
                void 0 === e && (e = Z.position().left), V.scrollTop(0), te = e || 0;
                var o = 0 === te,
                    i = te == ee,
                    n = e / ee,
                    s = -n * (G - I);
                (ke != o || Te != i) && (ke = o, Te = i, t.trigger("jsp-arrow-change", [we, ye, ke, Te])), w(o, i), R.css("left", s), t.trigger("jsp-scroll-x", [-s, o, i]).trigger("scroll")
            }

            function b(e, t) {
                L.showArrows && (ae[e ? "addClass" : "removeClass"]("jspDisabled"), le[t ? "addClass" : "removeClass"]("jspDisabled"))
            }

            function w(e, t) {
                L.showArrows && (fe[e ? "addClass" : "removeClass"]("jspDisabled"), he[t ? "addClass" : "removeClass"]("jspDisabled"))
            }

            function k(e, t) {
                var o = e / (N - q);
                v(o * $, t)
            }

            function y(e, t) {
                var o = e / (G - I);
                g(o * ee, t)
            }

            function T(t, o, i) {
                var n, s, r, a, l, c, u, p, d, f = 0,
                    h = 0;
                try {
                    n = e(t)
                } catch (v) {
                    return
                }
                for (s = n.outerHeight(), r = n.outerWidth(), V.scrollTop(0), V.scrollLeft(0); !n.is(".jspPane");)
                    if (f += n.position().top, h += n.position().left, n = n.offsetParent(), /^body|html$/i.test(n[0].nodeName)) return;
                a = S(), c = a + q, a > f || o ? p = f - L.horizontalGutter : f + s > c && (p = f - q + s + L.horizontalGutter), isNaN(p) || k(p, i), l = C(), u = l + I, l > h || o ? d = h - L.horizontalGutter : h + r > u && (d = h - I + r + L.horizontalGutter), isNaN(d) || y(d, i)
            }

            function C() {
                return -R.position().left
            }

            function S() {
                return -R.position().top
            }

            function x() {
                var e = N - q;
                return e > 20 && e - S() < 10
            }

            function P() {
                var e = G - I;
                return e > 20 && e - C() < 10
            }

            function B() {
                V.unbind(Se).bind(Se, function(e, t, o, i) {
                    te || (te = 0), J || (J = 0);
                    var n = te,
                        s = J,
                        r = e.deltaFactor || L.mouseWheelSpeed;
                    return be.scrollBy(o * r, -i * r, !1), n == te && s == J
                })
            }

            function H() {
                V.unbind(Se)
            }

            function D() {
                return !1
            }

            function A() {
                R.find(":input,a").unbind("focus.jsp").bind("focus.jsp", function(e) {
                    T(e.target, !1)
                })
            }

            function W() {
                R.find(":input,a").unbind("focus.jsp")
            }

            function Y() {
                function o() {
                    var e = te,
                        t = J;
                    switch (i) {
                        case 40:
                            be.scrollByY(L.keyboardSpeed, !1);
                            break;
                        case 38:
                            be.scrollByY(-L.keyboardSpeed, !1);
                            break;
                        case 34:
                        case 32:
                            be.scrollByY(q * L.scrollPagePercent, !1);
                            break;
                        case 33:
                            be.scrollByY(-q * L.scrollPagePercent, !1);
                            break;
                        case 39:
                            be.scrollByX(L.keyboardSpeed, !1);
                            break;
                        case 37:
                            be.scrollByX(-L.keyboardSpeed, !1)
                    }
                    return n = e != te || t != J
                }
                var i, n, s = [];
                Q && s.push(ce[0]), K && s.push(oe[0]), R.bind("focus.jsp", function() {
                    t.focus()
                }), t.attr("tabindex", 0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp", function(t) {
                    if (t.target === this || s.length && e(t.target).closest(s).length) {
                        var r = te,
                            a = J;
                        switch (t.keyCode) {
                            case 40:
                            case 38:
                            case 34:
                            case 32:
                            case 33:
                            case 39:
                            case 37:
                                i = t.keyCode, o();
                                break;
                            case 35:
                                k(N - q), i = null;
                                break;
                            case 36:
                                k(0), i = null
                        }
                        return n = t.keyCode == i && r != te || a != J, !n
                    }
                }).bind("keypress.jsp", function(t) {
                    return t.keyCode == i && o(), t.target === this || s.length && e(t.target).closest(s).length ? !n : void 0
                }), L.hideFocus ? (t.css("outline", "none"), "hideFocus" in V[0] && t.attr("hideFocus", !0)) : (t.css("outline", ""), "hideFocus" in V[0] && t.attr("hideFocus", !1))
            }

            function F() {
                t.attr("tabindex", "-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp"), R.unbind(".jsp")
            }

            function M() {
                if (location.hash && location.hash.length > 1) {
                    var t, o, i = escape(location.hash.substr(1));
                    try {
                        t = e("#" + i + ', a[name="' + i + '"]')
                    } catch (n) {
                        return
                    }
                    t.length && R.find(i) && (0 === V.scrollTop() ? o = setInterval(function() {
                        V.scrollTop() > 0 && (T(t, !0), e(document).scrollTop(V.position().top), clearInterval(o))
                    }, 50) : (T(t, !0), e(document).scrollTop(V.position().top)))
                }
            }

            function O() {
                e(document.body).data("jspHijack") || (e(document.body).data("jspHijack", !0), e(document.body).delegate("a[href*=#]", "click", function(t) {
                    var o, i, n, s, r, a, l = this.href.substr(0, this.href.indexOf("#")),
                        c = location.href;
                    if (-1 !== location.href.indexOf("#") && (c = location.href.substr(0, location.href.indexOf("#"))), l === c) {
                        o = escape(this.href.substr(this.href.indexOf("#") + 1));
                        try {
                            i = e("#" + o + ', a[name="' + o + '"]')
                        } catch (u) {
                            return
                        }
                        i.length && (n = i.closest(".jspScrollable"), s = n.data("jsp"), s.scrollToElement(i, !0), n[0].scrollIntoView && (r = e(window).scrollTop(), a = i.offset().top, (r > a || a > r + e(window).height()) && n[0].scrollIntoView()), t.preventDefault())
                    }
                }))
            }

            function X() {
                var e, t, o, i, n, s = !1;
                V.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp", function(r) {
                    var a = r.originalEvent.touches[0];
                    e = C(), t = S(), o = a.pageX, i = a.pageY, n = !1, s = !0
                }).bind("touchmove.jsp", function(r) {
                    if (s) {
                        var a = r.originalEvent.touches[0],
                            l = te,
                            c = J;
                        return be.scrollTo(e + o - a.pageX, t + i - a.pageY), n = n || Math.abs(o - a.pageX) > 5 || Math.abs(i - a.pageY) > 5, l == te && c == J
                    }
                }).bind("touchend.jsp", function(e) {
                    s = !1
                }).bind("click.jsp-touchclick", function(e) {
                    return n ? (n = !1, !1) : void 0
                })
            }

            function z() {
                var e = S(),
                    o = C();
                t.removeClass("jspScrollable").unbind(".jsp"), R.unbind(".jsp"), t.replaceWith(Ce.append(R.children())), Ce.scrollTop(e), Ce.scrollLeft(o), ve && clearInterval(ve)
            }
            var L, R, I, q, V, G, N, E, _, K, Q, U, $, J, Z, ee, te, oe, ie, ne, se, re, ae, le, ce, ue, pe, de, fe, he, ve, je, ge, me, be = this,
                we = !0,
                ke = !0,
                ye = !1,
                Te = !1,
                Ce = t.clone(!1, !1).empty(),
                Se = e.fn.mwheelIntent ? "mwheelIntent.jsp" : "mousewheel.jsp";
            "border-box" === t.css("box-sizing") ? (je = 0, ge = 0) : (je = t.css("paddingTop") + " " + t.css("paddingRight") + " " + t.css("paddingBottom") + " " + t.css("paddingLeft"), ge = (parseInt(t.css("paddingLeft"), 10) || 0) + (parseInt(t.css("paddingRight"), 10) || 0)), e.extend(be, {
                extPluginOpts: {
                    mouseLeaveFadeSpeed: 500,
                    hovertimeout_t: 600,
                    useTimeout: !0,
                    deviceWidth: 980
                },
                hovertimeout: null,
                isScrollbarHover: !1,
                elementtimeout: null,
                isScrolling: !1,
                addHoverFunc: function() {
                    var o = this;
                    e.fn.jspmouseenter = e.fn.show, e.fn.jspmouseleave = e.fn.fadeOut;
                    var i = this.getContentPane().siblings(".jspVerticalBar").hide();
                    if (e(t).bind("mouseleave.jsp", function() {
                            o.extPluginOpts.useTimeout ? (clearTimeout(o.elementtimeout), o.isScrolling || i.stop(!0, !0).jspmouseleave(o.extPluginOpts.mouseLeaveFadeSpeed || 0)) : i.stop(!0, !0).jspmouseleave(o.extPluginOpts.mouseLeaveFadeSpeed || 0)
                        }), this.extPluginOpts.useTimeout && e(t).innerHeight() < N) {
                        e(t).on("scrollstart", function() {
                            clearTimeout(o.hovertimeout), o.isScrolling = !0, i.stop(!0, !0).jspmouseenter()
                        }).on("scrollstop", function() {
                            clearTimeout(o.hovertimeout), o.isScrolling = !1, o.hovertimeout = setTimeout(function() {
                                o.isScrollbarHover || i.stop(!0, !0).jspmouseleave(o.extPluginOpts.mouseLeaveFadeSpeed || 0)
                            }, o.extPluginOpts.hovertimeout_t)
                        });
                        var n = e("<div/>").addClass("vBarWrapper").css({
                            position: "absolute",
                            left: i.css("left"),
                            top: i.css("top"),
                            right: i.css("right"),
                            bottom: i.css("bottom"),
                            width: i.width(),
                            height: i.height()
                        }).bind("mouseenter.jsp", function() {
                            clearTimeout(o.hovertimeout), clearTimeout(o.elementtimeout), o.isScrollbarHover = !0, o.elementtimeout = setTimeout(function() {
                                i.stop(!0, !0).jspmouseenter()
                            }, 100)
                        }).bind("mouseleave.jsp", function() {
                            clearTimeout(o.hovertimeout), o.isScrollbarHover = !1, o.hovertimeout = setTimeout(function() {
                                o.isScrolling || i.stop(!0, !0).jspmouseleave(o.extPluginOpts.mouseLeaveFadeSpeed || 0)
                            }, o.extPluginOpts.hovertimeout_t)
                        });
                        i.wrap(n)
                    }
                },
                reinitialise: function(t) {
                    t = e.extend({}, L, t), i(t)
                },
                scrollToElement: function(e, t, o) {
                    T(e, t, o)
                },
                scrollTo: function(e, t, o) {
                    y(e, o), k(t, o)
                },
                scrollToX: function(e, t) {
                    y(e, t)
                },
                scrollToY: function(e, t) {
                    k(e, t)
                },
                scrollToPercentX: function(e, t) {
                    y(e * (G - I), t)
                },
                scrollToPercentY: function(e, t) {
                    k(e * (N - q), t)
                },
                scrollBy: function(e, t, o) {
                    be.scrollByX(e, o), be.scrollByY(t, o)
                },
                scrollByX: function(e, t) {
                    var o = C() + Math[0 > e ? "floor" : "ceil"](e),
                        i = o / (G - I);
                    g(i * ee, t)
                },
                scrollByY: function(o, i) {
                    var n = S() + Math[0 > o ? "floor" : "ceil"](o),
                        s = n / (N - q);
                    e(t).find(".jspContainer").innerHeight() < e(t).find(".jspPane").innerHeight() && v(s * $, i)
                },
                positionDragX: function(e, t) {
                    g(e, t)
                },
                positionDragY: function(e, t) {
                    v(e, t)
                },
                animate: function(e, t, o, i) {
                    var n = {};
                    n[t] = o, e.animate(n, {
                        duration: L.animateDuration,
                        easing: L.animateEase,
                        queue: !1,
                        step: i
                    })
                },
                getContentPositionX: function() {
                    return C()
                },
                getContentPositionY: function() {
                    return S()
                },
                getContentWidth: function() {
                    return G
                },
                getContentHeight: function() {
                    return N
                },
                getPercentScrolledX: function() {
                    return C() / (G - I)
                },
                getPercentScrolledY: function() {
                    return S() / (N - q)
                },
                getIsScrollableH: function() {
                    return Q
                },
                getIsScrollableV: function() {
                    return K
                },
                getContentPane: function() {
                    return R
                },
                scrollToBottom: function(e) {
                    v($, e)
                },
                hijackInternalLinks: e.noop,
                destroy: function() {
                    z()
                }
            }), i(o)
        }
        return t = e.extend({}, e.fn.jScrollPane.defaults, t), e.each(["arrowButtonSpeed", "trackClickSpeed", "keyboardSpeed"], function() {
            t[this] = t[this] || t.speed
        }), this.each(function() {
            var i = e(this),
                n = i.data("jsp");
            n ? n.reinitialise(t) : (e("script", i).filter('[type="text/javascript"],:not([type])').remove(), n = new o(i, t), n.addHoverFunc(), i.data("jsp", n))
        })
    }, e.fn.jScrollPane.defaults = {
        showArrows: !1,
        maintainPosition: !0,
        stickToBottom: !1,
        stickToRight: !1,
        clickOnTrack: !0,
        autoReinitialise: !1,
        autoReinitialiseDelay: 500,
        verticalDragMinHeight: 0,
        verticalDragMaxHeight: 99999,
        horizontalDragMinWidth: 0,
        horizontalDragMaxWidth: 99999,
        contentWidth: void 0,
        animateScroll: !1,
        animateDuration: 300,
        animateEase: "linear",
        hijackInternalLinks: !1,
        verticalGutter: 4,
        horizontalGutter: 4,
        mouseWheelSpeed: 3,
        arrowButtonSpeed: 0,
        arrowRepeatFreq: 50,
        arrowScrollOnHover: !1,
        trackClickSpeed: 0,
        trackClickRepeatFreq: 70,
        verticalArrowPositions: "split",
        horizontalArrowPositions: "split",
        enableKeyboardNavigation: !0,
        hideFocus: !1,
        keyboardSpeed: 0,
        initialDelay: 300,
        speed: 30,
        scrollPagePercent: .8
    }
});