(function() {
    ! function(e, t, r) {
        var s, n, i;
        return i = "shapeshift", n = {
            selector: "*",
            enableDrag: !0,
            enableCrossDrop: !0,
            enableResize: !0,
            enableTrash: !1,
            align: "center",
            colWidth: null,
            columns: null,
            minColumns: 1,
            autoHeight: !0,
            maxHeight: null,
            minHeight: 100,
            gutterX: 10,
            gutterY: 10,
            paddingX: 10,
            paddingY: 10,
            animated: !0,
            animateOnInit: !1,
            animationSpeed: 225,
            animationThreshold: 100,
            dragClone: !1,
            deleteClone: !0,
            dragRate: 100,
            dragWhitelist: "*",
            crossDropWhitelist: "*",
            cutoffStart: null,
            cutoffEnd: null,
            handle: !1,
            cloneClass: "ss-cloned-child",
            activeClass: "ss-active-child",
            draggedClass: "ss-dragged-child",
            placeholderClass: "ss-placeholder-child",
            originalContainerClass: "ss-original-container",
            currentContainerClass: "ss-current-container",
            previousContainerClass: "ss-previous-container"
        }, s = function() {
            function r(t, r) {
                this.element = t, this.options = e.extend({}, n, r), this.globals = {}, this.$container = e(t), this.errorCheck() && this.init()
            }
            return r.prototype.errorCheck = function() {
                var e, t, r, s;
                return s = this.options, r = !1, t = "Shapeshift ERROR:", null === s.colWidth && (e = this.$container.children(s.selector), 0 === e.length && (r = !0, console.error("" + t + " option colWidth must be specified if Shapeshift is initialized with no active children."))), !r
            }, r.prototype.init = function() {
                return this.createEvents(), this.setGlobals(), this.setIdentifier(), this.setActiveChildren(), this.enableFeatures(), this.gridInit(), this.render(), this.afterInit()
            }, r.prototype.createEvents = function() {
                var e, t, r = this;
                return t = this.options, e = this.$container, e.off("ss-arrange").on("ss-arrange", function(e, t) {
                    return null == t && (t = !1), r.render(!1, t)
                }), e.off("ss-rearrange").on("ss-rearrange", function() {
                    return r.render(!0)
                }), e.off("ss-setTargetPosition").on("ss-setTargetPosition", function() {
                    return r.setTargetPosition()
                }), e.off("ss-destroy").on("ss-destroy", function() {
                    return r.destroy()
                }), e.off("ss-shuffle").on("ss-shuffle", function() {
                    return r.shuffle()
                })
            }, r.prototype.setGlobals = function() {
                return this.globals.animated = this.options.animateOnInit, this.globals.dragging = !1
            }, r.prototype.afterInit = function() {
                return this.globals.animated = this.options.animated
            }, r.prototype.setIdentifier = function() {
                return this.identifier = "shapeshifted_container_" + Math.random().toString(36).substring(7), this.$container.addClass(this.identifier)
            }, r.prototype.enableFeatures = function() {
                return this.options.enableResize && this.enableResize(), this.options.enableDrag || this.options.enableCrossDrop ? this.enableDragNDrop() : void 0
            }, r.prototype.setActiveChildren = function() {
                var t, r, s, n, i, o, a, l, h, d, u, c;
                for (a = this.options, t = this.$container.children(a.selector), r = a.activeClass, l = t.length, i = h = 0; l >= 0 ? l > h : h > l; i = l >= 0 ? ++h : --h) e(t[i]).addClass(r);
                for (this.setParsedChildren(), n = a.columns, c = [], i = d = 0, u = this.parsedChildren.length; u >= 0 ? u > d : d > u; i = u >= 0 ? ++d : --d) s = this.parsedChildren[i].colspan, o = a.minColumns, s > n && s > o ? (a.minColumns = s, c.push(console.error("Shapeshift ERROR: There are child elements that have a larger colspan than the minimum columns set through options.\noptions.minColumns has been set to " + s))) : c.push(void 0);
                return c
            }, r.prototype.setParsedChildren = function() {
                var t, r, s, n, i, o, a;
                for (r = this.$container.find("." + this.options.activeClass).filter(":visible"), o = r.length, i = [], n = a = 0; o >= 0 ? o > a : a > o; n = o >= 0 ? ++a : --a) t = e(r[n]), s = {
                    i: n,
                    el: t,
                    colspan: parseInt(t.attr("data-ss-colspan")) || 1,
                    height: t.outerHeight()
                }, i.push(s);
                return this.parsedChildren = i
            }, r.prototype.gridInit = function() {
                var e, t, r, s, n;
                return s = this.options.gutterX, this.options.colWidth >= 1 ? this.globals.col_width = this.options.colWidth + s : (r = this.parsedChildren[0], t = r.el.outerWidth(), e = r.colspan, n = (t - (e - 1) * s) / e, this.globals.col_width = n + s)
            }, r.prototype.render = function(e, t) {
                return null == e && (e = !1), this.setGridColumns(), this.arrange(e, t)
            }, r.prototype.setGridColumns = function() {
                var e, t, r, s, n, i, o, a, l, h, d, u, c, g, p;
                if (i = this.globals, u = this.options, r = i.col_width, a = u.gutterX, c = u.paddingX, h = this.$container.innerWidth() - 2 * c, d = u.minColumns, n = u.columns || Math.floor((h + a) / r), d && d > n && (n = d), i.columns = n, t = this.parsedChildren.length, n > t) {
                    for (e = 0, l = g = 0, p = this.parsedChildren.length; p >= 0 ? p > g : g > p; l = p >= 0 ? ++g : --g) s = this.parsedChildren[l].colspan, n >= s + e && (e += s);
                    n = e
                }
                switch (i.child_offset = c, u.align) {
                    case "center":
                        return o = n * r - a, i.child_offset += (h - o) / 2;
                    case "right":
                        return o = n * r - a, i.child_offset += h - o
                }
            }, r.prototype.arrange = function(e, t) {
                var r, s, n, i, o, a, l, h, d, u, c, g, p, f, C, v, m, b;
                for (e && this.setParsedChildren(), d = this.globals, f = this.options, s = this.$container, a = this.getPositions(), C = this.parsedChildren, m = C.length, n = d.animated && m <= f.animationThreshold, i = f.animationSpeed, h = f.draggedClass, u = b = 0; m >= 0 ? m > b : b > m; u = m >= 0 ? ++b : --b) r = C[u].el, o = a[u], c = r.hasClass(h), c && (v = f.placeholderClass, r = r.siblings("." + v)), n && !c ? r.stop(!0, !1).animate(o, i, function() {}) : r.css(o);
                return t && (n ? setTimeout(function() {
                    return s.trigger("ss-drop-complete")
                }, i) : s.trigger("ss-drop-complete")), s.trigger("ss-arranged"), f.autoHeight ? (l = d.container_height, g = f.maxHeight, p = f.minHeight, p && p > l ? l = p : g && l > g && (l = g), s.height(l)) : void 0
            }, r.prototype.getPositions = function(e) {
                var t, r, s, n, i, o, a, l, h, d, u, c, g, p, f, C, v, m, b = this;
                for (null == e && (e = !0), i = this.globals, h = this.options, a = h.gutterY, d = h.paddingY, n = h.draggedClass, u = this.parsedChildren, C = u.length, t = [], l = v = 0, m = i.columns; m >= 0 ? m > v : v > m; l = m >= 0 ? ++v : --v) t.push(d);
                return p = function(e) {
                    var r, s, n, o, l, h, d;
                    if (r = e.col, s = e.colspan, o = e.col * i.col_width + i.child_offset, l = t[r], c[e.i] = {
                            left: o,
                            top: l
                        }, t[r] += e.height + a, s >= 1) {
                        for (d = [], n = h = 1; s >= 1 ? s > h : h > s; n = s >= 1 ? ++h : --h) d.push(t[r + n] = t[r]);
                        return d
                    }
                }, r = function(e) {
                    var r, s, n, i, o, a, l, h, d, u, c, g;
                    for (d = t.length - e.colspan + 1, h = t.slice(0).splice(0, d), r = void 0, l = c = 0; d >= 0 ? d > c : c > d; l = d >= 0 ? ++c : --c) {
                        for (s = b.lowestCol(h, l), n = e.colspan, i = t[s], o = !0, u = g = 1; n >= 1 ? n > g : g > n; u = n >= 1 ? ++g : --g)
                            if (a = t[s + u], a > i) {
                                o = !1;
                                break
                            }
                        if (o) {
                            r = s;
                            break
                        }
                    }
                    return r
                }, f = [], g = function() {
                    var e, t, s, n, i, o, a, l, h, d;
                    for (i = [], n = o = 0, l = f.length; l >= 0 ? l > o : o > l; n = l >= 0 ? ++o : --o) s = f[n], s.col = r(s), s.col >= 0 && (p(s), i.push(n));
                    for (d = [], t = a = h = i.length - 1; a >= 0; t = a += -1) e = i[t], d.push(f.splice(e, 1));
                    return d
                }, c = [], (s = function() {
                    var s, i, o;
                    for (o = [], l = i = 0; C >= 0 ? C > i : i > C; l = C >= 0 ? ++i : --i) s = u[l], e || !s.el.hasClass(n) ? (s.colspan > 1 ? s.col = r(s) : s.col = b.lowestCol(t), void 0 === s.col ? f.push(s) : p(s), o.push(g())) : o.push(void 0);
                    return o
                })(), h.autoHeight && (o = t[this.highestCol(t)] - a, i.container_height = o + d), c
            }, r.prototype.enableDragNDrop = function() {
                var r, s, n, i, o, a, l, h, d, u, c, g, p, f, C, v, m, b, y = this;
                return p = this.options, s = this.$container, o = p.activeClass, g = p.draggedClass, C = p.placeholderClass, f = p.originalContainerClass, l = p.currentContainerClass, v = p.previousContainerClass, h = p.deleteClone, u = p.dragRate, d = p.dragClone, a = p.cloneClass, i = n = r = b = m = null, c = !1, p.enableDrag && s.children("." + o).filter(p.dragWhitelist).draggable({
                    addClasses: !1,
                    containment: "document",
                    handle: p.handle,
                    zIndex: 9999,
                    start: function(t, s) {
                        var o;
                        return y.globals.dragging = !0, i = e(t.target), d && (r = i.clone(!1, !1).insertBefore(i).addClass(a)), i.addClass(g), o = i.prop("tagName"), n = e("<" + o + " class='" + C + "' style='height: " + i.height() + "px; width: " + i.width() + "px'></" + o + ">"), i.parent().addClass(f).addClass(l), b = i.outerHeight() / 2, m = i.outerWidth() / 2
                    },
                    drag: function(r, s) {
                        return c || d && h && e("." + l)[0] === e("." + f)[0] || (n.remove().appendTo("." + l), e("." + l).trigger("ss-setTargetPosition"), c = !0, t.setTimeout(function() {
                            return c = !1
                        }, u)), s.position.left = r.pageX - i.parent().offset().left - m, s.position.top = r.pageY - i.parent().offset().top - b
                    },
                    stop: function() {
                        var t, s, o;
                        return y.globals.dragging = !1, s = e("." + f), t = e("." + l), o = e("." + v), i.removeClass(g), e("." + C).remove(), d && (h && e("." + l)[0] === e("." + f)[0] ? (r.remove(), e("." + l).trigger("ss-rearrange")) : r.removeClass(a)), s[0] === t[0] ? t.trigger("ss-rearranged", i) : (s.trigger("ss-removed", i), t.trigger("ss-added", i)), s.trigger("ss-arrange").removeClass(f), t.trigger("ss-arrange", !0).removeClass(l), o.trigger("ss-arrange").removeClass(v), i = n = null
                    }
                }), p.enableCrossDrop ? s.droppable({
                    accept: p.crossDropWhitelist,
                    tolerance: "intersect",
                    over: function(t) {
                        return e("." + v).removeClass(v), e("." + l).removeClass(l).addClass(v), e(t.target).addClass(l)
                    },
                    drop: function(t, r) {
                        var s, n, o;
                        return y.options.enableTrash ? (n = e("." + f), s = e("." + l), o = e("." + v), i = e(r.helper), s.trigger("ss-trashed", i), i.remove(), n.trigger("ss-rearrange").removeClass(f), s.trigger("ss-rearrange").removeClass(l), o.trigger("ss-arrange").removeClass(v)) : void 0
                    }
                }) : void 0
            }, r.prototype.setTargetPosition = function() {
                var t, r, s, n, i, o, a, l, h, d, u, c, g, p, f, C, v, m, b, y, T, w;
                if (d = this.options, d.enableTrash) return c = this.options.placeholderClass, e("." + c).remove();
                if (h = d.draggedClass, t = e("." + h), r = t.parent(), u = this.parsedChildren, i = this.getPositions(!1), b = i.length, f = t.offset().left - r.offset().left + this.globals.col_width / 2, C = t.offset().top - r.offset().top + t.height() / 2, v = 9999999, m = 0, b > 1) {
                    for (a = d.cutoffStart + 1 || 0, o = d.cutoffEnd || b, g = w = a; o >= a ? o > w : w > o; g = o >= a ? ++w : --w) n = i[g], n && (T = f - n.left, y = C - n.top, T > 0 && y > 0 && (l = Math.sqrt(y * y + T * T), v > l && (v = l, m = g, g === b - 1 && T > u[g].height / 2 && m++)));
                    m === u.length ? (s = u[m - 1].el, t.insertAfter(s)) : (s = u[m].el, t.insertBefore(s))
                } else 1 === b ? (n = i[0], n.left < f ? this.$container.append(t) : this.$container.prepend(t)) : this.$container.append(t);
                return this.arrange(!0), r[0] !== t.parent()[0] ? (p = d.previousContainerClass, e("." + p).trigger("ss-rearrange")) : void 0
            }, r.prototype.enableResize = function() {
                var r, s, n, i = this;
                return r = this.options.animationSpeed, n = !1, s = "resize." + this.identifier, e(t).on(s, function() {
                    return n ? void 0 : (n = !0, setTimeout(function() {
                        return i.render()
                    }, r / 3), setTimeout(function() {
                        return i.render()
                    }, r / 3), setTimeout(function() {
                        return n = !1, i.render()
                    }, r / 3))
                })
            }, r.prototype.shuffle = function() {
                var e;
                return e = function(e, t) {
                    var r;
                    return r = function(e) {
                        var t, r, s;
                        for (r = void 0, s = void 0, t = e.length; t;) r = parseInt(Math.random() * t), s = e[--t], e[t] = e[r], e[r] = s;
                        return e
                    }, e.each(function() {
                        var s;
                        return s = e.find("." + t).filter(":visible"), s.length ? e.html(r(s)) : this
                    })
                }, this.globals.dragging ? void 0 : (e(this.$container, this.options.activeClass), this.enableFeatures(), this.$container.trigger("ss-rearrange"))
            }, r.prototype.lowestCol = function(e, t) {
                var r, s, n, i;
                for (null == t && (t = 0), n = e.length, r = [], s = i = 0; n >= 0 ? n > i : i > n; s = n >= 0 ? ++i : --i) r.push([e[s], s]);
                return r.sort(function(e, t) {
                    var r;
                    return r = e[0] - t[0], 0 === r && (r = e[1] - t[1]), r
                }), r[t][1]
            }, r.prototype.highestCol = function(r) {
                return e.inArray(Math.max.apply(t, r), r)
            }, r.prototype.destroy = function() {
                var e, t, r;
                return t = this.$container, t.off("ss-arrange"), t.off("ss-rearrange"), t.off("ss-setTargetPosition"), t.off("ss-destroy"), r = this.options.activeClass, e = t.find("." + r), this.options.enableDrag && e.draggable("destroy"), this.options.enableCrossDrop && t.droppable("destroy"), e.removeClass(r), t.removeClass(this.identifier)
            }, r
        }(), e.fn[i] = function(r) {
            return this.each(function() {
                var n, o, a, l;
                return o = null != (a = e(this).attr("class")) && null != (l = a.match(/shapeshifted_container_\w+/)) ? l[0] : void 0, o && (n = "resize." + o, e(t).off(n), e(this).removeClass(o)), e.data(this, "plugin_" + i, new s(this, r))
            })
        }
    }(jQuery, window, document)
}).call(this);