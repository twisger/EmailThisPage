
// https://raw.githubusercontent.com/sorensen/absolutify/master/absolutify.min.js
(function () { "use strict"; function e(t, c) { return "function" == typeof c ? e.iterate(t, c) : t.replace(e.rx, "$1" + c + "/$4") } e.rx = /((href|src|codebase|cite|background|cite|action|profile|formaction|icon|manifest|archive)=["'])(([.]+\/)|(?:\/)|(?=#))(?!\/)/g, e.captureRx = /((href|src|codebase|cite|background|cite|action|profile|formaction|icon|manifest|archive)=["'])((([.]+\/)|(?:\/)|(?:#))(?!\/)[a-zA-Z0-9._-]+)/g, e.iterate = function (t, c) { return t.replace(e.captureRx, function (e, t, r, i) { return t + c(i, r) }) }, "undefined" != typeof exports ? module.exports = e : this.absolutify = e }).call(this);


chrome.runtime.sendMessage({
    action: "getSource",
    source: absolutify(document.documentElement.outerHTML, location.host),
    // source: document.documentElement.outerText,
    title: document.title
});