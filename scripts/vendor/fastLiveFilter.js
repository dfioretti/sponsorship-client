jQuery.fn.fastLiveFilter = function(e, t) {
    t = t || {}, e = jQuery(e);
    var n, l = this,
        i = "",
        o = t.timeout || 0,
        a = t.callback || function() {},
        s = e.children(),
        r = s.length,
        c = r > 0 ? s[0].style.display : "block";
    return a(r), l.change(function() {
        for (var e, n, i = l.val().toLowerCase(), o = 0, y = 0; r > y; y++) e = s[y], n = t.selector ? $(e).find(t.selector).text() : e.textContent || e.innerText || "", n.toLowerCase().indexOf(i) >= 0 ? ("none" == e.style.display && (e.style.display = c), o++) : "none" != e.style.display && (e.style.display = "none");
        return a(o), !1
    }).keydown(function() {
        clearTimeout(n), n = setTimeout(function() {
            l.val() !== i && (i = l.val(), l.change())
        }, o)
    }), this
};