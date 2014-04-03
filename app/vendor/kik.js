/**
 * Kik Cards v1.0.3
 * Copyright (c) 2014 Kik Interactive, http://kik.com
 * All rights reserved
 * http://dev.kik.com/terms.html
 *
 * classList.js: Cross-browser full element.classList implementation.
 * By Eli Grey, http://eligrey.com
 * Public Domain
 * No warranty expressed or implied. Use at your own risk.
 */
(function (b) {
   var a = {};
   a.enabled = false;
   a.version = "1.0.3";
   a._ = {};
   b.kik = b.cards = a
})(window);
(function () {
   if (!Object.keys) {
      Object.keys = function (c) {
         var b = [];
         for (var a in c) {
            b.push(a)
         }
         return b
      }
   }
   if (!Array.isArray) {
      Array.isArray = function (a) {
         return Object.prototype.toString.call(a) == "[object Array]"
      }
   }
   if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function (c, d) {
         for (var b = d || 0, a = this.length; b < a; b++) {
            if ((b in this) && (this[b] === c)) {
               return b
            }
         }
         return -1
      }
   }
   if (!Array.prototype.forEach) {
      Array.prototype.forEach = function (d, b) {
         for (var c = 0, a = this.length; c < a; c++) {
            if (c in this) {
               d.call(b, this[c], c, this)
            }
         }
      }
   }
   if (!Array.prototype.map) {
      Array.prototype.map = function (e, b) {
         var a = this.length, c = new Array(a);
         for (var d = 0; d < a; d++) {
            if (d in this) {
               c[d] = e.call(b, this[d], d, this)
            }
         }
         return c
      }
   }
   if (!Array.prototype.filter) {
      Array.prototype.filter = function (e, c) {
         var b = [];
         for (var f, d = 0, a = this.length; d < a; d++) {
            f = this[d];
            if ((d in this) && e.call(c, f, d, this)) {
               b.push(f)
            }
         }
         return b
      }
   }
   if (!Array.prototype.reduce) {
      Array.prototype.reduce = function (c, d) {
         var b = 0, a = this.length;
         if (typeof d == "undefined") {
            d = this[0];
            b = 1
         }
         for (; b < a; b++) {
            if (b in this) {
               d = c(d, this[b], b, this)
            }
         }
         return d
      }
   }
   if (!String.prototype.trim) {
      String.prototype.trim = function () {
         var a = /^\s+|\s+$/g;
         return function () {
            return String(this).replace(a, "")
         }
      }()
   }
})();
if (typeof document !== "undefined" && !("classList" in document.createElement("a"))) {
   (function (s) {
      var B = "classList", w = "prototype", p = (s.HTMLElement || s.Element)[w], A = Object, r = String[w].trim || function () {
         return this.replace(/^\s+|\s+$/g, "")
      }, z = Array[w].indexOf || function (a) {
         var b = 0, c = this.length;
         for (; b < c; b++) {
            if (b in this && this[b] === a) {
               return b
            }
         }
         return -1
      }, o = function (b, a) {
         this.name = b;
         this.code = DOMException[b];
         this.message = a
      }, v = function (a, b) {
         if (b === "") {
            throw new o("SYNTAX_ERR", "An invalid or illegal string was specified")
         }
         if (/\s/.test(b)) {
            throw new o("INVALID_CHARACTER_ERR", "String contains an invalid character")
         }
         return z.call(a, b)
      }, y = function (a) {
         var b = r.call(a.className), c = b ? b.split(/\s+/) : [], d = 0, e = c.length;
         for (; d < e; d++) {
            this.push(c[d])
         }
         this._updateClassName = function () {
            a.className = this.toString()
         }
      }, x = y[w] = [], t = function () {
         return new y(this)
      };
      o[w] = Error[w];
      x.item = function (a) {
         return this[a] || null
      };
      x.contains = function (a) {
         a += "";
         return v(this, a) !== -1
      };
      x.add = function (a) {
         a += "";
         if (v(this, a) === -1) {
            this.push(a);
            this._updateClassName()
         }
      };
      x.remove = function (a) {
         a += "";
         var b = v(this, a);
         if (b !== -1) {
            this.splice(b, 1);
            this._updateClassName()
         }
      };
      x.toggle = function (a) {
         a += "";
         if (v(this, a) === -1) {
            this.add(a)
         } else {
            this.remove(a)
         }
      };
      x.toString = function () {
         return this.join(" ")
      };
      if (A.defineProperty) {
         var q = {get: t, enumerable: true, configurable: true};
         try {
            A.defineProperty(p, B, q)
         } catch (u) {
            if (u.number === -2146823252) {
               q.enumerable = false;
               A.defineProperty(p, B, q)
            }
         }
      } else {
         if (A[w].__defineGetter__) {
            p.__defineGetter__(B, t)
         }
      }
   }(self))
}
(function (f, h, c) {
   var j = false, g = [];
   d();
   c._.onLog = i;
   function i(k) {
      if (typeof k !== "function") {
         throw TypeError("log listener must be a function, got " + k)
      }
      g.push(k)
   }

   function e(l, k) {
      if (j) {
         return
      }
      j = true;
      g.forEach(function (n) {
         try {
            n(l, k)
         } catch (m) {
         }
      });
      j = false
   }

   function d() {
      var k = f.console;
      if (typeof k !== "object") {
         k = {}
      }
      k.log = b(k.log, "log");
      k.warn = b(k.warn, "warn");
      k.error = b(k.error, "error");
      a();
      f.console = k
   }

   function b(k, l) {
      switch (typeof k) {
         case"undefined":
            k = function () {
            };
         case"function":
            break;
         default:
            return k
      }
      return function () {
         var m = Array.prototype.map.call(arguments, function (n) {
            if ((typeof n === "object") && (n !== null) && f.JSON && JSON.stringify) {
               try {
                  return JSON.stringify(n)
               } catch (o) {
               }
            }
            return n + ""
         }).join(" ");
         e(l, m);
         k.apply(this, arguments)
      }
   }

   function a() {
      if (!f.addEventListener) {
         return
      }
      f.addEventListener("error", function (k) {
         e("exception", k.message + "")
      }, false)
   }
})(window, document, kik);
(function (d, a, c) {
   var b = {};
   c.utils = b;
   b.error = function (e) {
      if (d.console && d.console.error) {
         if ((typeof e === "object") && e.stack) {
            d.console.error(e.stack)
         } else {
            d.console.error(e + "")
         }
      }
   };
   b.platform = {};
   b.platform.os = function () {
      var h = d.navigator.userAgent, g, f, e;
      if ((e = /\bCPU.*OS (\d+(_\d+)?)/i.exec(h))) {
         g = "ios";
         f = e[1].replace("_", ".")
      } else {
         if ((e = /\bAndroid (\d+(\.\d+)?)/.exec(h))) {
            g = "android";
            f = e[1]
         } else {
            if ((e = /\bWindows Phone OS (\d+(\.\d+)?)/.exec(h))) {
               g = "winphone";
               f = e[1]
            } else {
               if ((e = /\bMac OS X (\d+(_\d+)?)/.exec(h))) {
                  g = "osx";
                  f = e[1].replace("_", ".")
               } else {
                  if ((e = /\bWindows NT (\d+(.\d+)?)/.exec(h))) {
                     g = "windows";
                     f = e[1]
                  } else {
                     if ((e = /\bLinux\b/.exec(h))) {
                        g = "linux";
                        f = null
                     } else {
                        if ((e = /\b(Free|Net|Open)BSD\b/.exec(h))) {
                           g = "bsd";
                           f = null
                        }
                     }
                  }
               }
            }
         }
      }
      var i = {name: g, version: f && d.parseFloat(f), versionString: f};
      i[g] = true;
      return i
   }();
   b.os = b.platform.os;
   b.platform.browser = function () {
      var h = d.navigator.userAgent, g, f, e;
      if ((e = /\bMSIE (\d+(\.\d+)?)/i.exec(h))) {
         g = "msie";
         f = e[1]
      } else {
         if ((e = /\bOpera\/(\d+(\.\d+)?)/i.exec(h))) {
            g = "opera";
            f = e[1];
            if ((e = /\bVersion\/(\d+(\.\d+)?)/i.exec(h))) {
               f = e[1]
            }
         } else {
            if ((e = /\bChrome\/(\d+(\.\d+)?)/i.exec(h))) {
               g = "chrome";
               f = e[1]
            } else {
               if ((h.indexOf("Safari/") != -1) && (e = /\bVersion\/(\d+(\.\d+)?)/i.exec(h))) {
                  if (b.platform.os.android) {
                     g = "android"
                  } else {
                     g = "safari"
                  }
                  f = e[1]
               } else {
                  if ((e = /\bFirefox\/(\d+(\.\d+)?)/i.exec(h))) {
                     g = "firefox";
                     f = e[1]
                  }
               }
            }
         }
      }
      var i = {name: g, version: f && d.parseFloat(f), versionString: f};
      i[g] = true;
      return i
   }();
   b.browser = b.platform.browser;
   b.platform.engine = function () {
      var h = d.navigator.userAgent, g, f, e;
      if ((e = /\bTrident\/(\d+(\.\d+)?)/i.exec(h))) {
         g = "trident";
         f = e[1]
      } else {
         if ((e = /\bMSIE 7/i.exec(h))) {
            g = "trident";
            f = "3.1"
         } else {
            if ((e = /\bPresto\/(\d+(\.\d+)?)/i.exec(h))) {
               g = "presto";
               f = e[1]
            } else {
               if ((e = /\bAppleWebKit\/(\d+(\.\d+)?)/i.exec(h))) {
                  g = "webkit";
                  f = e[1]
               } else {
                  if ((e = /\brv\:(\d+(\.\d+)?)/i.exec(h))) {
                     g = "gecko";
                     f = e[1]
                  }
               }
            }
         }
      }
      var i = {name: g, version: f && d.parseFloat(f), versionString: f};
      i[g] = true;
      return i
   }();
   b.engine = b.platform.engine;
   b.random = {};
   b.random.name = function (e) {
      return("____" + (e || "") + "____" + Math.random()).replace(/\.|\-/g, "")
   };
   b.random.num = function () {
      return Math.floor((Math.random() * 18014398509481984) - 9007199254740992)
   };
   b.random.uuid = function () {
      var e = 36, g = new Array(e), h = "0123456789abcdef", f;
      for (f = 0; f < e; f++) {
         g[f] = Math.floor(Math.random() * 16)
      }
      g[14] = 4;
      g[19] = (g[19] & 3) | 8;
      for (f = 0; f < e; f++) {
         g[f] = h[g[f]]
      }
      g[8] = g[13] = g[18] = g[23] = "-";
      return g.join("")
   };
   b.enumerate = function (f) {
      if (typeof f !== "object") {
         f = Array.prototype.slice.call(arguments)
      }
      var h = {};
      for (var g = 0, e = f.length; g < e; g++) {
         h[f[g]] = g
      }
      return h
   };
   b.preloadImage = function () {
      var f = {};
      return e;
      function e() {
         var h = arguments;
         c.ready(function () {
            g.apply(b, h)
         })
      }

      function g(j, l) {
         if (typeof j != "string") {
            b.asyncJoin(j.map(function (m) {
               return function (n) {
                  b.preloadImage(m, n)
               }
            }), l || function () {
            });
            return
         }
         if (f[j] === true) {
            if (l) {
               setTimeout(function () {
                  l(true)
               }, 0)
            }
            return
         } else {
            if (f[j]) {
               f[j].push(l);
               return
            }
         }
         f[j] = [l];
         var h = false;

         function k(o) {
            if (h) {
               return
            }
            h = true;
            var q = f[j];
            f[j] = o;
            for (var n, p = 0, m = q.length; p < m; p++) {
               n = q[p];
               if (n) {
                  n(o)
               }
            }
         }

         var i = new Image();
         i.onload = function () {
            k(true)
         };
         i.onerror = function () {
            k(false)
         };
         i.src = j
      }
   }();
   b.url = {};
   b.url.dir = function () {
      var e = /\/[^\/]*$/;
      return function (f) {
         switch (typeof f) {
            case"undefined":
               f = d.location.href;
            case"string":
               break;
            default:
               throw TypeError("url " + f + " must be string if defined")
         }
         f = ((f.split("?")[0] || "").split("#")[0] || "");
         return f.replace(e, "/")
      }
   }();
   b.url.host = function () {
      var e = /^https?\:\/\/([^\/]+)\/.*$/;
      return function (g) {
         switch (typeof g) {
            case"undefined":
               return d.location.host;
            case"string":
               break;
            default:
               throw TypeError("url " + g + " must be string if defined")
         }
         var f = e.exec(g);
         return f && f[1]
      }
   }();
   b.url.path = function () {
      var e = /^https?\:\/\/[^\/]+(\/.*)$/;
      return function (g) {
         switch (typeof g) {
            case"undefined":
               return d.location.pathname;
            case"string":
               break;
            default:
               throw TypeError("url " + g + " must be string if defined")
         }
         var f = e.exec(g);
         return f && f[1]
      }
   }();
   b.url.dataToQuery = function () {
      var e = /%20/g;
      return function (k) {
         var h = [], j, f, i;
         for (var g in k) {
            j = k[g];
            if ((j !== null) && (j !== undefined)) {
               f = encodeURIComponent(g);
               i = encodeURIComponent(j);
               h.push(f + "=" + i)
            }
         }
         return h.join("&").replace(e, "+")
      }
   }();
   b.url.queryToData = function () {
      var f = /([^&=]+)=([^&]+)/g, e = /\+/g;
      return function (k) {
         var h = {}, g, i, j;
         if (k) {
            k = k.replace(e, "%20");
            while ((g = f.exec(k))) {
               i = decodeURIComponent(g[1]);
               j = decodeURIComponent(g[2]);
               h[i] = j
            }
         }
         return h
      }
   }();
   b.url.withQuery = function (e, f) {
      if (!f) {
         f = e;
         e = d.location.href
      }
      e = e.split("?")[0];
      var g = b.url.dataToQuery(f);
      if (g) {
         e += "?" + g
      }
      return e
   };
   b.url.updateQuery = function (e, f) {
      if (!f) {
         f = e;
         e = d.location.href
      }
      var g = b.url.parseQuery(e);
      b.obj.extend(g, f);
      return b.url.withQuery(e, g)
   };
   b.url.parseQuery = function (e) {
      e = e || d.location.href;
      return b.url.queryToData(e.split("?")[1])
   };
   b.url.query = b.url.parseQuery();
   b.jsonp = function (s) {
      var q = false, l = function () {
      }, h = b.random.name("PICARD_UTILS_JSONP_CALLBACK"), e = s.url, i = b.obj.copy(s.data), m = s.callbackName || "callback", p = s.callback || l, f = s.success || l, j = s.error || l, o = s.complete || l, r = a.getElementsByTagName("script")[0], k = a.createElement("script");
      i[m] = "window." + h;
      k.type = "text/javascript";
      k.async = true;
      k.onerror = g;
      k.src = b.url.updateQuery(e, i);
      function n() {
         d[h] = l;
         try {
            r.parentNode.removeChild(k)
         } catch (t) {
         }
      }

      function g() {
         if (q) {
            return
         }
         n();
         p = l;
         f = l;
         j();
         j = l;
         o();
         o = l
      }

      d[h] = function () {
         q = true;
         n();
         p.apply(this, arguments);
         p = l;
         f.apply(this, arguments);
         f = l;
         j = l;
         o();
         o = l
      };
      if (s.timeout) {
         setTimeout(g, s.timeout)
      }
      r.parentNode.insertBefore(k, r)
   };
   b.asyncJoin = function (e, k) {
      var g = true;
      if (!Array.isArray(e)) {
         g = false;
         e = Array.prototype.slice.call(arguments);
         k = e.pop()
      }
      var f = false, j = e.length, i = new Array(j);
      if (j === 0) {
         h();
         return
      }
      e.forEach(function (m, l) {
         setTimeout(function () {
            var n = false;
            m(function () {
               if (n) {
                  return
               }
               n = true;
               if (i[l]) {
                  return
               }
               var o = Array.prototype.slice.call(arguments);
               i[l] = o;
               j--;
               h()
            })
         }, 0)
      });
      function h() {
         if ((j !== 0) || f) {
            return
         }
         f = true;
         setTimeout(function () {
            if (g) {
               k.call(d, i)
            } else {
               k.apply(d, i)
            }
         }, 0)
      }
   };
   b.obj = {};
   b.obj.extend = function (i, h) {
      var g, f;
      for (var e in h) {
         g = i[e];
         f = h[e];
         if (g !== f) {
            i[e] = f
         }
      }
      return i
   };
   b.obj.copy = function (e) {
      return b.obj.extend({}, e)
   };
   b.obj.forEach = function (g, h, e) {
      for (var f in g) {
         h.call(e, f, g[f], g)
      }
   };
   b.obj.inverse = function (g) {
      var e = {};
      for (var f in g) {
         e[g[f]] = f
      }
      return e
   };
   b.obj.values = function (g) {
      var e = [];
      for (var f in g) {
         e.push(g[f])
      }
      return e
   };
   b.obj.has = function (g, f) {
      for (var e in g) {
         if (g[e] === f) {
            return true
         }
      }
      return false
   };
   b.windowReady = function (f) {
      if (a.readyState === "complete") {
         setTimeout(function () {
            f()
         }, 0);
         return
      }
      d.addEventListener("load", e, false);
      function e() {
         d.removeEventListener("load", e);
         setTimeout(function () {
            f()
         }, 0)
      }
   };
   b.ready = function () {
      var g = false, f = [];

      function h() {
         if (g) {
            return
         }
         g = true;
         for (var k; (k = f.shift());) {
            try {
               k()
            } catch (j) {
               b.error(j)
            }
         }
      }

      function e(k) {
         try {
            a.documentElement.doScroll("left")
         } catch (j) {
            setTimeout(function () {
               e(k)
            }, 1);
            return
         }
         if (k) {
            k()
         }
      }

      function i(l) {
         if (a.readyState === "complete") {
            setTimeout(l, 0);
            return
         }
         if (a.addEventListener) {
            a.addEventListener("DOMContentLoaded", l, false);
            d.addEventListener("load", l, false)
         } else {
            if (a.attachEvent) {
               a.attachEvent("onreadystatechange", l);
               d.attachEvent("onload", l);
               var j = false;
               try {
                  j = (d.frameElement === null)
               } catch (k) {
               }
               if (a.documentElement.doScroll && j) {
                  setTimeout(function () {
                     e(l)
                  }, 0)
               }
            }
         }
      }

      i(h);
      return function (j) {
         if (typeof j !== "function") {
            throw TypeError("callback " + j + " must be a function")
         }
         if (g) {
            setTimeout(function () {
               j()
            }, 0)
         } else {
            f.push(j)
         }
      }
   }()
})(window, document, kik);
(function (f, a, e) {
   e.events = d;
   e.events.handlers = g;
   function b() {
      this.handlers = {};
      this.onceHandlers = {};
      this.globalHandlers = [];
      this.globalOnceHandlers = []
   }

   b.prototype.insureNamespace = function (i) {
      if (!this.handlers[i]) {
         this.handlers[i] = []
      }
      if (!this.onceHandlers[i]) {
         this.onceHandlers[i] = []
      }
   };
   b.prototype.bind = function (i, j) {
      this.insureNamespace(i);
      this.handlers[i].push(j)
   };
   b.prototype.bindToAll = function (i) {
      this.globalHandlers.push(i)
   };
   b.prototype.bindOnce = function (i, j) {
      this.insureNamespace(i);
      this.onceHandlers[i].push(j)
   };
   b.prototype.bindToAllOnce = function (i) {
      this.globalOnceHandlers.push(i)
   };
   b.prototype.unbind = function (i, j) {
      this.insureNamespace(i);
      h(this.handlers[i], j);
      h(this.onceHandlers[i], j)
   };
   b.prototype.unbindFromAll = function (j) {
      h(this.globalHandlers, j);
      h(this.globalOnceHandlers, j);
      for (var i in this.handlers) {
         h(this.handlers[i], j);
         h(this.onceHandlers[i], j)
      }
   };
   b.prototype.trigger = function (j, k, i) {
      this.insureNamespace(j);
      if (typeof i === "undefined") {
         i = this
      }
      function l(m) {
         try {
            m.call(i, k, j)
         } catch (n) {
            e.utils.error(n)
         }
      }

      this.handlers[j].forEach(l);
      this.globalHandlers.forEach(l);
      this.onceHandlers[j].forEach(l);
      this.globalOnceHandlers.forEach(l);
      this.onceHandlers[j].splice(0);
      this.globalOnceHandlers.splice(0)
   };
   function h(j, l) {
      for (var k = j.length; k--;) {
         if (j[k] === l) {
            j.splice(k, 1)
         }
      }
   }

   function d(j) {
      if (typeof j === "undefined") {
         j = {}
      }
      var i = new b();
      j.on = function (k, l) {
         if (Array.isArray(k)) {
            k.forEach(function (m) {
               j.on(m, l)
            });
            return
         }
         if (typeof l === "undefined") {
            l = k;
            k = ""
         }
         if (typeof k !== "string") {
            throw TypeError("name " + k + " must be a string")
         }
         if (typeof l !== "function") {
            throw TypeError("handler " + l + " must be a function")
         }
         if (k) {
            i.bind(k, l)
         } else {
            i.bindToAll(l)
         }
      };
      j.off = function (k, l) {
         if (Array.isArray(k)) {
            k.forEach(function (m) {
               j.off(m, l)
            });
            return
         }
         if (typeof l === "undefined") {
            l = k;
            k = ""
         }
         if (typeof k !== "string") {
            throw TypeError("name " + k + " must be a string")
         }
         if (typeof l !== "function") {
            throw TypeError("handler " + l + " must be a function")
         }
         if (k) {
            i.unbind(k, l)
         } else {
            i.unbindFromAll(l)
         }
      };
      j.once = function (k, l) {
         if (Array.isArray(k)) {
            k.forEach(function (m) {
               j.once(m, l)
            });
            return
         }
         if (typeof l === "undefined") {
            l = k;
            k = ""
         }
         if (typeof k !== "string") {
            throw TypeError("name " + k + " must be a string")
         }
         if (typeof l !== "function") {
            throw TypeError("handler " + l + " must be a function")
         }
         if (k) {
            i.bindOnce(k, l)
         } else {
            i.bindToAllOnce(l)
         }
      };
      j.trigger = function (l, m, k) {
         if (Array.isArray(l)) {
            l.forEach(function (n) {
               j.trigger(n, m, k)
            });
            return
         }
         if (typeof l !== "string") {
            throw TypeError("name " + l + " must be a string")
         }
         i.trigger(l, m, k)
      };
      return j
   }

   function c() {
      this.handlers = [];
      this.events = []
   }

   c.prototype.addHandler = function (i) {
      this.handlers.push(i);
      return this.processEvents()
   };
   c.prototype.triggerEvent = function (i) {
      this.events.push(i);
      this.processEvents()
   };
   c.prototype.triggerEvents = function (i) {
      this.events = this.events.concat(i);
      this.processEvents()
   };
   c.prototype.processEvents = function () {
      if (!this.events.length || !this.handlers.length) {
         return false
      }
      var j = this.events.splice(0), i = this.handlers;
      j.forEach(function (k) {
         i.forEach(function (l) {
            l(k)
         })
      });
      return true
   };
   function g() {
      var i = new c();
      return{handler: function (j) {
         return i.addHandler(j)
      }, trigger: function (j) {
         i.triggerEvent(j)
      }, triggerMulti: function (j) {
         i.triggerEvents(j)
      }}
   }

   d(e)
})(window, document, kik);
kik.ready = function (e, c) {
   var b = [];
   a();
   return d;
   function d(g) {
      if (b) {
         b.push(g)
      } else {
         f(g)
      }
   }

   function a() {
      c.utils.windowReady(function () {
         setTimeout(function () {
            var g = b.slice();
            b = null;
            g.forEach(f)
         }, 3)
      })
   }

   function f(h) {
      try {
         h()
      } catch (g) {
         c.utils.error(g)
      }
   }
}(window, kik);
kik.open = function (d, c) {
   var f = c.utils.platform.os, a = c.utils.platform.browser;
   d.open = function (g) {
      e(g, true)
   };
   e.card = b;
   return e;
   function e(j, h, i) {
      if (typeof j !== "string") {
         throw TypeError("url must be a string, got " + j)
      }
      switch (typeof h) {
         case"boolean":
            i = h;
            h = "";
            break;
         case"object":
            h = JSON.stringify(h);
         case"undefined":
         case"string":
            break;
         default:
            throw TypeError("linkData must be a string of JSON if defined, got " + h)
      }
      if (h) {
         j = j.split("#")[0] + "#" + encodeURIComponent(h)
      }
      var g = j.substr(0, 7) === "card://", l = j.substr(0, 8) === "cards://", m;
      try {
         m = c._.bridge("Browser")
      } catch (k) {
      }
      if (m && m.openPage) {
         if (g || l) {
            j = "http" + j.substr(4)
         }
         m.openPage({url: j, popup: !!i});
         return
      }
      if (g || l) {
         if (m && m.openCard) {
            m.openCard({url: "http" + j.substr(4)})
         } else {
            b(j, "http" + j.substr(4))
         }
      } else {
         if (m && m.openExternal) {
            m.openExternal({url: j})
         } else {
            d.location.href = j
         }
      }
   }

   function b(i, g, h) {
      if (!f.ios && !f.android) {
         if (g) {
            d.location.href = g
         }
         return
      }
      if (f.ios) {
         if (g) {
            setTimeout(function () {
               if (!document.webkitHidden) {
                  d.location.href = g
               }
            }, f.ios ? 25 : 1000)
         }
         if (h) {
            c.ready(function () {
               setTimeout(function () {
                  d.location.href = i
               }, 0)
            })
         } else {
            d.location.href = i
         }
         return
      }
      var k;
      if (g) {
         k = setTimeout(function () {
            d.location = g
         }, 1000)
      }
      var j = document.createElement("iframe");
      j.style.position = "fixed";
      j.style.top = "0";
      j.style.left = "0";
      j.style.width = "1px";
      j.style.height = "1px";
      j.style.border = "none";
      j.style.opacity = "0";
      j.onload = function () {
         if (g) {
            clearTimeout(k)
         }
         try {
            document.documentElement.removeChild(j)
         } catch (l) {
         }
      };
      j.src = i;
      document.documentElement.appendChild(j)
   }
}(window, kik);
(function (c, a) {
   var b = "__PICARD_ID__";
   if (!c.localStorage) {
      return
   }
   if (!c.localStorage[b]) {
      c.localStorage[b] = a.utils.random.uuid()
   }
   a._.id = c.localStorage[b]
})(window, kik);
(function (b, a) {
   if (navigator.userAgent.indexOf("Kik/") === -1) {
      return
   }
   if (!/\bandroid/i.test(navigator.userAgent)) {
      return
   }
   if (!a || b.CardsBridge) {
      return
   }
   var c = b.CardsBridge = {};
   ["invokeAsyncFunction", "invokeFunction", "poll"].forEach(function (d) {
      c[d] = function () {
         var e = Array.prototype.slice.call(arguments);
         e.unshift(d);
         return a("CardsBridge", JSON.stringify(e)) || ""
      }
   })
})(window, window.prompt);
(function (window) {
   if (!window.chrome) {
      return
   }
   if (!window.chrome.app) {
      return
   }
   if (window.shimsham) {
      return
   }
   var shimshamMeta = document.getElementById("shimsham-meta");
   if (shimshamMeta && (shimshamMeta.nodeName === "META")) {
      var url = shimshamMeta.content;
      try {
         var xhr = new XMLHttpRequest();
         xhr.open("GET", url, false);
         xhr.send(null);
         if (xhr.status === 200) {
            eval(xhr.responseText)
         } else {
            console.log("Failed to load shimsham, extension not installed get it at dev.kik.com")
         }
      } catch (e) {
      }
   }
})(window);
(function (window, document, kik) {
   var BRIDGE_SIGNAL_URL = window.location.protocol + "//cardsbridge.kik.com/", PLUGIN_REQUEST_BATCH = "batch-call", PLUGIN_REQUEST_NAME = "requestPlugin", PLUGIN_REQUEST_VERSION = "requestVersion", PLUGIN_LOG = "log";
   var plugins = {}, os = kik.utils.platform.os, androidBridge = window.CardsBridge;

   function getBridge() {
      var bridgeInfo = getAndroidBridge();
      if (bridgeInfo) {
         return bridgeInfo
      }
      if (os.ios && !looksLikeChrome()) {
         return getIPhoneBridge()
      }
      return false
   }

   function looksLikeChrome() {
      try {
         return(typeof window.chrome.send === "function")
      } catch (err) {
         return false
      }
   }

   function getAndroidBridge() {
      if (!androidBridge) {
         return false
      }
      if (typeof androidBridge.invokeFunction !== "function") {
         return false
      }
      if (typeof androidBridge.poll !== "function") {
         return false
      }
      try {
         return makeBridgeCall(PLUGIN_REQUEST_VERSION).data
      } catch (err) {
         return false
      }
   }

   function getIPhoneBridge() {
      var bridgeInfo;
      try {
         bridgeInfo = makeBridgeCall(PLUGIN_REQUEST_VERSION).data
      } catch (err) {
      }
      return bridgeInfo ? bridgeInfo : false
   }

   function sendIFrameSignal(bridgeFunctionName, argData, asyncCallbackName) {
      var callbackName = kik.utils.random.name("PICARD_BRIDGE_CALLBACK"), status, data;
      window[callbackName] = function (callbackStatus, callbackData) {
         delete window[callbackName];
         status = callbackStatus;
         data = callbackData
      };
      var url = BRIDGE_SIGNAL_URL + bridgeFunctionName + "/" + callbackName + "?args=" + encodeURIComponent(argData) + "&async=" + (asyncCallbackName || "");
      var doc = document.documentElement, iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      doc.appendChild(iframe);
      doc.removeChild(iframe);
      if (window[callbackName]) {
         delete window[callbackName];
         throw Error("bridge call " + bridgeFunctionName + " failed to return")
      }
      return{status: status, data: data}
   }

   function sendBatchIFrameSignal(urls) {
      var calls = urls.map(function (url) {
         return encodeURIComponent(url)
      }).join(",");
      var url = BRIDGE_SIGNAL_URL + PLUGIN_REQUEST_BATCH + "?calls=" + calls;
      var doc = document.documentElement, iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      doc.appendChild(iframe);
      doc.removeChild(iframe)
   }

   function androidBridgeCall(bridgeFunctionName, argData, asyncCallbackName) {
      var response, result;
      if (!asyncCallbackName) {
         response = androidBridge.invokeFunction(bridgeFunctionName, argData)
      } else {
         if (androidBridge.invokeAsyncFunction) {
            response = androidBridge.invokeAsyncFunction(bridgeFunctionName, argData, asyncCallbackName)
         } else {
            throw TypeError("bridge: android bridge does not support async callbacks")
         }
      }
      try {
         result = JSON.parse(response)
      } catch (err) {
         throw TypeError("bridge call for " + bridgeFunctionName + " responded with invalid JSON")
      }
      return{status: result.status, data: result.data}
   }

   function makeBridgeCall(bridgeFunctionName, args, asyncCallback) {
      if (typeof bridgeFunctionName !== "string") {
         throw TypeError("bridge call " + bridgeFunctionName + " must be a string")
      }
      switch (typeof args) {
         case"function":
            asyncCallback = args;
            args = undefined;
         case"undefined":
            args = {};
         case"object":
            break;
         default:
            throw TypeError("bridge call arguments " + args + " must be a JSON object if specified")
      }
      switch (typeof asyncCallback) {
         case"undefined":
         case"function":
            break;
         default:
            throw TypeError("bridge async callback must be a function if defined, got " + asyncCallback)
      }
      var argData;
      try {
         argData = JSON.stringify(args)
      } catch (err) {
         throw TypeError("bridge call arguments " + args + " must be a JSON object")
      }
      var asyncCallbackName;
      if (asyncCallback) {
         asyncCallbackName = setupAsyncCallback(asyncCallback)
      }
      var result;
      if (androidBridge) {
         result = androidBridgeCall(bridgeFunctionName, argData, asyncCallbackName)
      } else {
         result = sendIFrameSignal(bridgeFunctionName, argData, asyncCallbackName)
      }
      if (asyncCallbackName && (!result || !result.status || (result.status !== 202))) {
         setTimeout(function () {
            if (!window[asyncCallbackName]) {
               return
            }
            if (androidBridge) {
               window[asyncCallbackName](JSON.stringify({status: 500, data: null}))
            } else {
               window[asyncCallbackName](500, null)
            }
         }, 0);
         result = {status: 202, data: {}}
      }
      return result
   }

   function setupAsyncCallback(asyncCallback) {
      var callbackName = kik.utils.random.name("PICARD_BRIDGE_ASYNC_CALLBACK");
      window[callbackName] = function (status, data) {
         delete window[callbackName];
         if (androidBridge) {
            try {
               var response = JSON.parse(status);
               status = response.status;
               data = response.data
            } catch (err) {
               throw Error("bridge failed to parse android async data, " + status)
            }
         }
         if ((typeof data !== "object") || (data === null)) {
            asyncCallback()
         } else {
            if (!status || (status < 200) || (status >= 300)) {
               asyncCallback()
            } else {
               asyncCallback(data)
            }
         }
      };
      return callbackName
   }

   function setupEventCallback(eventCallback) {
      var callbackName = kik.utils.random.name("PICARD_BRIDGE_EVENT_CALLBACK");
      window[callbackName] = function (name, data) {
         if (androidBridge) {
            try {
               data = JSON.parse(data)
            } catch (err) {
               throw Error("bridge failed to parse android event data, " + data)
            }
         }
         eventCallback(name, data)
      };
      return callbackName
   }

   function setupAndroidPoll() {
      window.addEventListener("keyup", function (e) {
         if (e.which !== 0) {
            return
         }
         performAndroidPoll();
         return false
      })
   }

   function performAndroidPoll() {
      var result = androidBridge.poll();
      if (!result) {
         return
      }
      var code = result + "";
      if (!code) {
         return
      }
      try {
         eval(code)
      } catch (err) {
         if (window.console && window.console.error) {
            window.console.error("android poll failed to evaluate " + code + ", " + err)
         }
      }
      performAndroidPoll()
   }

   function setupIOSLogging() {
      kik._.onLog(function (level, message) {
         try {
            makeBridgeCall(PLUGIN_LOG, {level: level, message: message})
         } catch (err) {
         }
      })
   }

   function bridgeFunctionCall(bridgeFunctionName, args, callback) {
      var data = makeBridgeCall(bridgeFunctionName, args, callback);
      if (!data) {
         throw Error("bridge call " + bridgeFunctionName + " did not return")
      }
      if (!data.status || (data.status < 200) || (data.status >= 300)) {
         throw Error("bridge call " + bridgeFunctionName + " did not complete successfully, " + data.status)
      }
      if (typeof data.data !== "object") {
         throw TypeError("bridge call " + bridgeFunctionName + " did not return an object, " + data.data)
      }
      return data.data
   }

   function setupFunction(bridgeFunctionName) {
      return function (args, callback) {
         return bridgeFunctionCall(bridgeFunctionName, args, callback)
      }
   }

   function setupFunctions(namespace, functionNames, pluginObj) {
      if (!Array.isArray(functionNames)) {
         throw TypeError("functions " + functionNames + " must be an array")
      }
      if (typeof pluginObj === "undefined") {
         pluginObj = {}
      }
      functionNames.forEach(function (functionName) {
         if (typeof functionName !== "string") {
            throw TypeError("function " + functionName + " must be a string")
         }
         pluginObj[functionName] = setupFunction(namespace + "." + functionName)
      })
   }

   function setupPlugin(pluginName) {
      var pluginObj = kik.events(), pluginData = makeBridgeCall(PLUGIN_REQUEST_NAME, {name: pluginName, eventCallback: setupEventCallback(pluginObj.trigger)});
      if (pluginData.status !== 200) {
         throw TypeError("plugin " + pluginName + " failed to initialize")
      }
      setupFunctions(pluginName, pluginData.data.functions, pluginObj);
      return pluginObj
   }

   function bridge(pluginName) {
      if (typeof pluginName !== "string") {
         throw TypeError("plugin name must be a string, got " + pluginName)
      }
      if (!plugins[pluginName]) {
         var plugin = setupPlugin(pluginName);
         plugins[pluginName] = plugin
      }
      return plugins[pluginName]
   }

   function batchRequest(calls) {
      if (!Array.isArray(calls)) {
         throw TypeError("batch calls must be an array, got " + calls)
      }
      calls.forEach(function (data) {
         if (typeof data !== "object") {
            throw TypeError("batch call must be an object, got " + data)
         }
         if (typeof data.name !== "string") {
            throw TypeError("batch call name must be a string, got " + data.name)
         }
         switch (typeof data.args) {
            case"undefined":
            case"object":
               break;
            default:
               throw TypeError("batch call args must be an object if defined, got " + data.args)
         }
         switch (typeof data.callback) {
            case"function":
            case"undefined":
               break;
            default:
               throw TypeError("batch call callback must be a function if defined, got " + data.callback)
         }
      });
      if (androidBridge) {
         return calls.map(function (data) {
            try {
               if (data.name.indexOf(".") === -1) {
                  return bridge(data.name)
               } else {
                  return bridgeFunctionCall(data.name, data.args, data.callback)
               }
            } catch (err) {
            }
         })
      }
      var batchCalls = [], responses = new Array(calls.length);
      calls.forEach(function (data, index) {
         var isPluginRequest = (data.name.indexOf(".") === -1);
         if (!isPluginRequest) {
            batchCalls.push(generateBatchSegment(data, function (responseData) {
               responses[index] = responseData
            }))
         } else {
            if (plugins[data.name]) {
               responses[index] = plugins[data.name]
            } else {
               batchCalls.push(generatePluginBatchSegment(data, function (responseData) {
                  responses[index] = responseData
               }))
            }
         }
      });
      sendBatchIFrameSignal(batchCalls);
      return responses
   }

   function generateBatchSegment(data, callback) {
      var argData = JSON.stringify(data.args);
      var asyncCallbackName;
      if (data.callback) {
         asyncCallbackName = setupAsyncCallback(data.callback)
      }
      var callbackName = kik.utils.random.name("PICARD_BRIDGE_CALLBACK");
      setTimeout(function () {
         delete window[callbackName]
      }, 0);
      window[callbackName] = function (callbackStatus, callbackData) {
         delete window[callbackName];
         if (asyncCallbackName && callbackStatus !== 202) {
            delete window[asyncCallbackName]
         }
         if (callbackStatus >= 200 && callbackStatus < 300) {
            callback(callbackData)
         }
      };
      var url = BRIDGE_SIGNAL_URL + data.name + "/" + callbackName + "?args=" + encodeURIComponent(argData) + "&async=" + (asyncCallbackName || "");
      return url
   }

   function generatePluginBatchSegment(data, callback) {
      var pluginObj = kik.events(), argData = JSON.stringify({name: data.name, eventCallback: setupEventCallback(pluginObj.trigger)});
      var callbackName = kik.utils.random.name("PICARD_BRIDGE_CALLBACK");
      setTimeout(function () {
         delete window[callbackName]
      }, 0);
      window[callbackName] = function (callbackStatus, callbackData) {
         delete window[callbackName];
         if (callbackStatus === 200) {
            setupFunctions(data.name, callbackData.functions, pluginObj);
            plugins[data.name] = pluginObj;
            callback(pluginObj)
         }
      };
      var url = BRIDGE_SIGNAL_URL + PLUGIN_REQUEST_NAME + "/" + callbackName + "?args=" + encodeURIComponent(argData) + "&async=";
      return url
   }

   function redirectToCards() {
      var os = kik.utils.platform.os, urllib = kik.utils.url;
      if (!urllib.query.kikme || (!os.ios && !os.android)) {
         return
      }
      try {
         var iframe = document.createElement("iframe");
         iframe.src = "card" + urllib.updateQuery({kikme: null}).substr(4);
         iframe.style.display = "none";
         var cleanup = function () {
            try {
               document.documentElement.removeChild(iframe)
            } catch (err) {
            }
         };
         iframe.onload = cleanup;
         iframe.onerror = cleanup;
         setTimeout(cleanup, 1000);
         document.documentElement.appendChild(iframe)
      } catch (err) {
      }
   }

   function main() {
      var bridgeInfo = getBridge();
      if (!bridgeInfo) {
         redirectToCards();
         return
      }
      kik._.bridge = bridge;
      kik._.bridge.batch = batchRequest;
      if (androidBridge) {
         setupAndroidPoll();
         kik._.bridge.forceAndroidPoll = performAndroidPoll
      } else {
         setupIOSLogging()
      }
      kik.enabled = true;
      bridge.info = bridgeInfo;
      bridge.version = bridgeInfo.version;
      kik.utils.platform.browser.name = "kik";
      kik.utils.platform.browser.cards = true;
      kik.utils.platform.browser.kik = true;
      kik.utils.platform.browser.version = window.parseFloat(bridge.version);
      kik.utils.platform.browser.versionString = bridge.version
   }

   main()
})(window, document, kik);
(function (b, d) {
   var c = "kik-transform-fix";
   if (a()) {
      e()
   }
   function a() {
      var h = true;
      if (!d.enabled) {
         h = false
      } else {
         if (!d.utils.platform.os.android) {
            h = false
         } else {
            Array.prototype.forEach.call(b.getElementsByTagName("meta"), function (i) {
               if ((i.name === c) && (i.content === "false")) {
                  h = false
               }
            })
         }
      }
      return h
   }

   function e() {
      var h = b.documentElement;
      f(h, "translate3d(0,0,0)");
      setTimeout(function () {
         g(h, "transform 10ms linear");
         setTimeout(function () {
            f(h, "translate3d(0,0,1px)");
            setTimeout(function () {
               g(h, "");
               setTimeout(function () {
                  f(h, "")
               }, 0)
            }, 10)
         }, 0)
      }, 0)
   }

   function f(i, h) {
      i.style["-webkit-transform"] = h;
      i.style["-moz-transform"] = h;
      i.style["-ms-transform"] = h;
      i.style["-o-transform"] = h;
      i.style.transform = h
   }

   function g(h, i) {
      if (i) {
         h.style["-webkit-transition"] = "-webkit-" + i;
         h.style["-moz-transition"] = "-moz-" + i;
         h.style["-ms-transition"] = "-ms-" + i;
         h.style["-o-transition"] = "-o-" + i;
         h.style.transition = i
      } else {
         h.style["-webkit-transition"] = "";
         h.style["-moz-transition"] = "";
         h.style["-ms-transition"] = "";
         h.style["-o-transition"] = "";
         h.style.transition = ""
      }
   }
})(document, kik);
(function (b, c) {
   try {
      var a = b.querySelector('meta[name="viewport"]');
      if (c.enabled && a && /\bipad\b/i.test(navigator.userAgent)) {
         a.setAttribute("content", "initial-scale=1.0, maximum-scale=1.0, user-scalable=no")
      }
   } catch (d) {
   }
})(document, kik);
(function (b, a) {
   if (a._.bridge) {
      b.alert = function () {
      };
      b.confirm = function () {
      };
      b.prompt = function () {
      }
   }
})(window, kik);
(function (d, a, c) {
   var e = c.utils.platform.os, b = c.utils.platform.browser;
   if (d.navigator && b.kik && (b.version < 6.7) && e.android) {
      d.navigator.geolocation = undefined
   }
})(window, document, kik);
(function (d) {
   var b = {};
   d._.firstBatch = b;
   if (!d._.bridge || !d.utils.platform.os.ios || (d.utils.platform.browser.version < 6.5)) {
      return
   }
   var a = [
      {name: "Metrics"},
      {name: "Browser"},
      {name: "Media"},
      {name: "Kik"},
      {name: "Profile"},
      {name: "UserData"},
      {name: "Auth"},
      {name: "Photo"},
      {name: "Keyboard"},
      {name: "Push"},
      {name: "Picker"}
   ];
   var c = [
      {name: "Browser.getLastLinkData", args: {}},
      {name: "Browser.isPopupMode", args: {}},
      {name: "Kik.getLastMessage", args: {}},
      {name: "Push.getNotificationList", args: {}},
      {name: "Picker.getRequest", args: {}}
   ];
   d._.bridge.batch(a.concat(c)).slice(a.length).forEach(function (e, g) {
      var f = c[g];
      b[f.name] = e;
      if (!e) {
      } else {
         if (!d._.secondBatch) {
            d._.secondBatch = []
         }
      }
   })
})(kik);
(function (i, a) {
   var f;
   try {
      f = a._.bridge("Metrics")
   } catch (e) {
   }
   var k = a.events(), h = [];
   a.metrics = k;
   k.loadTime = null;
   k.coverTime = null;
   if (f) {
      f.on("loadData", function (o) {
         if (typeof o.loadTime === "number") {
            k.loadTime = o.loadTime;
            k.trigger("loadTime", o.loadTime)
         }
         if (typeof o.coverTime === "number") {
            k.coverTime = o.coverTime;
            k.trigger("coverTime", o.coverTime)
         }
      })
   }
   var n = false;
   k.enableGoogleAnalytics = m;
   k.event = j;
   k._cardsEvent = c;
   function m(q, o, p) {
      if (n) {
         return
      }
      n = true;
      if (q) {
         if (!p) {
            d(q, o)
         } else {
            l(q)
         }
      }
      g()
   }

   function d(p, o) {
      if (typeof p !== "string") {
         throw TypeError("google analytics ID must be a string, got " + p)
      }
      if (typeof o !== "string") {
         throw TypeError("google analytics host must be a string, got " + o)
      }
      i.GoogleAnalyticsObject = "ga";
      i.ga = i.ga || function () {
         (i.ga.q = i.ga.q || []).push(arguments)
      }, i.ga.l = +new Date();
      a.ready(function () {
         var q = document.createElement("script"), r = document.getElementsByTagName("script")[0];
         q.async = 1;
         q.src = "//www.google-analytics.com/analytics.js";
         r.parentNode.insertBefore(q, r)
      });
      i.ga("create", p, o);
      i.ga("send", "pageview")
   }

   function l(o) {
      if (typeof o !== "string") {
         throw TypeError("google analytics ID must be a string, got " + o)
      }
      var p = i._gaq = [];
      p.push(["_setAccount", o]);
      p.push(["_trackPageview"]);
      a.ready(function () {
         var r = document.createElement("script");
         r.async = true;
         r.defer = true;
         r.id = "ga";
         r.src = "//www.google-analytics.com/ga.js";
         var q = document.getElementsByTagName("script")[0];
         q.parentNode.insertBefore(r, q)
      })
   }

   function g() {
      i.addEventListener("error", function (q) {
         var p = q.message || "";
         p += " (" + (q.filename || i.location.href);
         if (q.lineno) {
            p += ":" + q.lineno
         }
         p += ")";
         c("error", p)
      }, false);
      if ((typeof App === "object") && (typeof App.enableGoogleAnalytics === "function")) {
         App.enableGoogleAnalytics()
      }
      if (f) {
         b("loadTime");
         b("coverTime")
      }
      var o = h.slice();
      h = null;
      o.forEach(function (p) {
         j(p[0], p[1], p[2], p[3])
      })
   }

   function j(q, p, o, r) {
      if (typeof q !== "string") {
         throw TypeError("event category must be a string, got " + q)
      }
      if (typeof p !== "string") {
         throw TypeError("event name must be a string, got " + p)
      }
      switch (typeof o) {
         case"string":
            break;
         case"number":
            r = o;
         default:
            o = ""
      }
      switch (typeof r) {
         case"number":
            r = Math.floor(r);
            break;
         default:
            r = 0
      }
      if (h) {
         h.push([q, p, o, r]);
         return
      }
      if (typeof i.ga === "function") {
         i.ga("send", "event", q, p, o, r)
      } else {
         if (!i._gaq) {
            i._gaq = []
         }
         if (typeof i._gaq.push === "function") {
            i._gaq.push(["_trackEvent", q, p, o, r, true])
         }
      }
   }

   function c(p, o, q) {
      j("Cards", p, o, q)
   }

   function b(o) {
      if (k[o]) {
         c(o, k[o])
      } else {
         k.once(o, function () {
            c(o, k[o])
         })
      }
   }
})(window, kik);
(function (k, q, r) {
   function v(G, K) {
      var F = k.applicationCache, J = false;
      if (!F || !F.addEventListener || !F.swapCache || !F.update) {
         K(false);
         return
      }
      if (F.status === F.UPDATEREADY) {
         E();
         return
      }
      if ((F.status !== F.IDLE) && (F.status !== F.CHECKING) && (F.status !== F.DOWNLOADING)) {
         K(false);
         return
      }
      F.addEventListener("noupdate", H, false);
      F.addEventListener("updateready", E, false);
      F.addEventListener("error", E, false);
      F.addEventListener("obsolete", E, false);
      setTimeout(E, 30 * 1000);
      if (F.status === F.IDLE) {
         try {
            F.update()
         } catch (I) {
            E()
         }
      }
      function H() {
         if (J) {
            return
         }
         J = true;
         if (!G && k.console && k.console.log) {
            k.console.log("refresh requested but no update to manifest found");
            k.console.log("** update your manifest to see changes reflected")
         }
         setTimeout(function () {
            K(true)
         }, 1000)
      }

      function E() {
         if (J) {
            return
         }
         J = true;
         var L = false;
         if (F.status === F.UPDATEREADY) {
            try {
               F.swapCache();
               L = true
            } catch (M) {
            }
         }
         K(L)
      }
   }

   if (r.utils.platform.os.ios) {
      setTimeout(function () {
         v(true, function (E) {
         })
      }, 5000)
   }
   k.ZERVER_REFRESH = function () {
      d();
      v(true, function () {
         k.location.reload()
      })
   };
   function d() {
      try {
         k.ZERVER_KILL_STREAM()
      } catch (E) {
      }
   }

   function j(G) {
      if (typeof G !== "string") {
         return undefined
      }
      G = decodeURIComponent(G);
      var E;
      try {
         E = JSON.parse(G)
      } catch (F) {
      }
      if ((typeof E === "object") && (E !== null)) {
         return E
      } else {
         return G || undefined
      }
   }

   if (k.location.hash) {
      r.linkData = j(k.location.hash.substr(1))
   }
   a();
   function a() {
      var F = false;
      Array.prototype.forEach.call(q.getElementsByTagName("meta"), function (G) {
         if (G.name === "kik-https") {
            F = G.content
         }
      });
      if (F === k.location.host) {
         if (k.location.protocol === "https:") {
            try {
               b.performHttpsUpgradeCleanup()
            } catch (E) {
            }
         } else {
            try {
               b.openCard({url: k.location.href.split("#")[0].replace(/^http\:/, "https:"), title: q.title, icon: y, clearHistory: true})
            } catch (E) {
               k.location.href = k.location.href.replace(/^http\:/, "https:")
            }
         }
      }
   }

   var b;
   try {
      b = r._.bridge("Browser")
   } catch (e) {
      return
   }
   var C = r.events();
   r.browser = C;
   var D = {};
   var y;
   if (b.setCardInfo) {
      var o = /(^|\s)icon(\s|$)/i, A, x, n, h, B, i;
      Array.prototype.forEach.call(q.getElementsByTagName("link"), function (E) {
         if (o.test(E.rel)) {
            A = E.href
         } else {
            if (E.rel === "kik-icon") {
               n = E.href
            } else {
               if (E.rel === "kik-icon-fallback") {
                  x = E.href
               } else {
                  if (E.rel === "kik-tray-icon") {
                     h = E.href
                  } else {
                     if (E.rel === "privacy") {
                        B = E.href
                     } else {
                        if (E.rel === "terms") {
                           i = E.href
                        }
                     }
                  }
               }
            }
         }
      });
      y = (x || n || h || A);
      var m = {title: q.title, icon: y, squareIcon: n || h || x || A, mediaTrayIcon: n || h || x || A, privacy: B, terms: i};
      if (r._.secondBatch) {
         r._.secondBatch.push({name: "Browser.setCardInfo", args: m})
      } else {
         b.setCardInfo(m)
      }
   }
   if (b.pageLoaded) {
      r.utils.windowReady(function () {
         if (q.body) {
            var E = q.body.offsetWidth;
            (function (F) {
               return F
            })(E)
         }
         setTimeout(function () {
            b.pageLoaded()
         }, 1)
      })
   }
   k.addEventListener("unload", function () {
      try {
         b.navigationAttempted()
      } catch (E) {
      }
   }, false);
   var t = true;
   if (b.setStatusBarVisible) {
      var l = false;
      C.statusBar = function (E) {
         l = true;
         b.setStatusBarVisible({visible: !!E});
         t = !!E
      }
   }
   if (b.setStatusBarTransparent) {
      C.statusBarTransparent = function (F) {
         var E;
         if (F === "black") {
            E = false
         } else {
            if (F) {
               E = true
            }
         }
         try {
            if (b.setStatusBarTransparent({transparent: !!F, light: E})) {
               return true
            }
         } catch (G) {
         }
         return false
      };
      var u;
      Array.prototype.forEach.call(q.getElementsByTagName("meta"), function (E) {
         if (E.name === "kik-transparent-statusbar") {
            u = (E.content || "").trim()
         }
      });
      if (u && (u !== "false") && C.statusBarTransparent(u)) {
         k.APP_ENABLE_IOS_STATUSBAR = true;
         try {
            if (typeof App._enableIOSStatusBar === "function") {
               App._enableIOSStatusBar()
            }
         } catch (e) {
         }
      }
   }
   if (b.getOrientationLock && b.setOrientationLock) {
      C.getOrientationLock = function () {
         var E = b.getOrientationLock().position;
         return(E === "free") ? null : E
      };
      C.setOrientationLock = function (E) {
         switch (E) {
            case"free":
            case"portrait":
            case"landscape":
               break;
            default:
               if (!E) {
                  E = "free";
                  break
               }
               throw TypeError("if defined, position " + E + ' must be one of "free", "portrait", or "landscape"')
         }
         try {
            b.setOrientationLock({position: E});
            if (!l && b.setStatusBarVisible && (t !== (E !== "landscape"))) {
               b.setStatusBarVisible({visible: (E !== "landscape")});
               t = (E !== "landscape")
            }
            return true
         } catch (F) {
            return false
         }
      }
   }
   b.on("orientationChanged", function () {
      try {
         k.App._layout()
      } catch (E) {
      }
   });
   if (b.setBacklightTimeoutEnabled) {
      C.backlightTimeout = function (E) {
         b.setBacklightTimeoutEnabled({enabled: !!E})
      }
   }
   if (b.forceRepaint) {
      C.paint = function () {
         if (q.body) {
            var E = q.body.offsetWidth;
            (function (F) {
               return F
            })(E)
         }
         b.forceRepaint()
      }
   }
   var f = [];
   C.back = function (E) {
      if (typeof E !== "function") {
         throw TypeError("back handler " + E + " must be a function")
      }
      f.push(E)
   };
   C.unbindBack = function (F) {
      if (typeof F !== "function") {
         throw TypeError("back handler " + F + " must be a function")
      }
      for (var E = f.length; E--;) {
         if (f[E] === F) {
            f.splice(E, 1)
         }
      }
   };
   b.on("back", function (H) {
      var F = false;
      for (var E = f.length; E--;) {
         try {
            if (f[E]() === false) {
               F = true;
               break
            }
         } catch (G) {
            r.utils.error(G)
         }
      }
      b.handleBack({requestToken: H.requestToken, override: F})
   });
   C.back(function () {
      if (k.App && (typeof k.App.back === "function")) {
         try {
            if (App.back() !== false) {
               return false
            }
         } catch (E) {
         }
      }
   });
   if (b.refresh && b.refreshPlanned) {
      C.refresh = function () {
         var E = k.applicationCache;
         d();
         if (!E || (E.status === E.UNCACHED)) {
            b.refresh({withCache: false});
            return
         }
         v(false, function (F) {
            b.refresh({withCache: true})
         })
      };
      b.on("refresh", function () {
         setTimeout(function () {
            b.refreshPlanned();
            C.refresh()
         }, 0)
      });
      k.ZERVER_REFRESH = function () {
         C.refresh()
      }
   }
   C.open = r.open;
   function s(F, E) {
      C.linkData = j(F && F.data);
      r.linkData = C.linkData;
      if ((E !== false) && C.linkData) {
         C.trigger("linkData", C.linkData);
         r.trigger("linkData", C.linkData)
      }
   }

   C._processLinkData = s;
   if (b.getLastLinkData) {
      s(r._.firstBatch["Browser.getLastLinkData"] || b.getLastLinkData(), false)
   }
   b.on("linkData", s);
   b.on("statusBarTap", function () {
      C.trigger("statusBarTap")
   });
   var p = true, z = false, w = true;
   C.background = p;
   b.on("pause", function (E) {
      z = true;
      g()
   });
   b.on("unpause", function (E) {
      z = false;
      g()
   });
   b.on("conceal", function (E) {
      w = true;
      g()
   });
   b.on("reveal", function (E) {
      w = false;
      g()
   });
   function c() {
      return z || w
   }

   function g() {
      var E = p;
      p = c();
      C.background = p;
      if (E !== p) {
         C.trigger(p ? "background" : "foreground")
      }
   }
})(window, document, kik);
(function (g, c, e) {
   var d;
   try {
      d = e._.bridge("Media")
   } catch (f) {
   }
   if (!d || !d.setMediaCategory || !d.unsetMediaCategory) {
      e._mediaEnabled = function () {
      }
   } else {
      e._mediaEnabled = a;
      b()
   }
   function b() {
      var h = false;
      Array.prototype.forEach.call(c.getElementsByTagName("meta"), function (i) {
         if ((i.name === "kik-media-enabled") && (i.content === "true")) {
            h = true
         }
      });
      a(h)
   }

   function a(h) {
      if (e._.secondBatch) {
         e._.secondBatch.push({name: "Media." + (h ? "" : "un") + "setMediaCategory", args: {}})
      } else {
         try {
            if (h) {
               d.setMediaCategory()
            } else {
               d.unsetMediaCategory()
            }
         } catch (i) {
         }
      }
   }
})(window, document, kik);
(function (i, j, b) {
   var c;
   try {
      c = b._.bridge("Kik")
   } catch (f) {
      return
   }
   b.kik = b;
   b._formatMessage = e;
   function e(n) {
      var l;
      if (typeof n !== "object") {
         throw TypeError("message " + n + " must be an object")
      }
      switch (typeof n.big) {
         case"undefined":
         case"boolean":
            break;
         default:
            throw TypeError("message size (big) " + n.big + " must be a boolean if defined")
      }
      switch (typeof n.title) {
         case"undefined":
         case"string":
            if (!n.big && !n.title) {
               throw TypeError("message title must be a string")
            }
            n.title = n.title || "";
            break;
         default:
            throw TypeError("message title " + n.title + " must be a string")
      }
      switch (typeof n.text) {
         case"string":
         case"undefined":
            break;
         default:
            throw TypeError("message text " + n.text + " must be a string")
      }
      switch (typeof n.pic) {
         case"undefined":
         case"string":
            break;
         default:
            throw TypeError("message pic " + n.pic + " must be a string if defined")
      }
      switch (typeof n.noForward) {
         case"undefined":
         case"boolean":
            break;
         default:
            throw TypeError("message noForward flag must be a boolean if defined, got " + n.noForward)
      }
      switch (typeof n.fallback) {
         case"undefined":
         case"string":
            break;
         default:
            throw TypeError("message fallback URL must be a string if defined, got " + n.fallback)
      }
      switch (typeof n.linkData) {
         case"undefined":
         case"string":
            break;
         case"object":
            try {
               l = JSON.stringify(n.linkData)
            } catch (m) {
               throw TypeError("message linkData must be a string or JSON if defined, got " + n.linkData)
            }
            break;
         default:
            throw TypeError("message linkData must be a string or JSON if defined, got " + n.linkData)
      }
      var o = l || n.linkData;
      if (typeof o === "string") {
         o = encodeURIComponent(o)
      }
      var l;
      switch (typeof n.data) {
         case"object":
            if (n.data !== null) {
               try {
                  l = JSON.stringify(n.data)
               } catch (m) {
                  throw TypeError("message data must be a json object if defined, got " + n.data)
               }
            }
         case"undefined":
            break;
         default:
            throw TypeError("message data must be a json object if defined, got " + n.data)
      }
      var k;
      if ((typeof n.data === "object") && (n.data !== null) && n.data.id) {
         k = n.data.id + ""
      }
      b.metrics._cardsEvent("kikSend", k);
      return{title: n.title, text: n.text, image: n.pic, forwardable: !n.noForward, fallbackUrl: n.fallback, layout: n.big ? "photo" : "article", extras: {sender: b._.id, dataID: k, messageID: b.utils.random.uuid(), linkData: o || "", jsonData: l || ""}}
   }

   b.send = function (l, k) {
      if (typeof l !== "string") {
         k = l;
         l = undefined
      }
      k = e(k);
      k.targetUser = l;
      if (l && c.sendKikToUser) {
         c.sendKikToUser(k)
      } else {
         c.sendKik(k)
      }
   };
   var g = b.events.handlers();
   b.handler = function (k) {
      return g.handler(k)
   };
   function h(n, k) {
      a();
      if (!n.extras.sender || (n.extras.sender !== b._.id)) {
         b.metrics._cardsEvent("kikReceive", n.extras.dataID)
      }
      if (n.extras.jsonData) {
         var l;
         try {
            l = JSON.parse(n.extras.jsonData)
         } catch (m) {
         }
         if ((typeof l === "object") && (l !== null)) {
            b.message = l;
            g.trigger(l);
            b.trigger("message", l)
         }
      }
      if (n.extras && n.extras.linkData && b.browser && b.browser._processLinkData) {
         b.browser._processLinkData({data: n.extras.linkData}, k)
      }
   }

   if (c.getLastMessage) {
      var d = b._.firstBatch["Kik.getLastMessage"] || c.getLastMessage();
      if (d && d.message) {
         h(d.message, false)
      }
   }
   c.on("message", h);
   if (c.openConversationWithUser) {
      b.openConversation = function (l, k) {
         c.openConversationWithUser({username: l}, function (m) {
            k && k(m)
         })
      }
   }
   function a() {
      if (!c.openConversation) {
         return
      }
      b.returnToConversation = function (k) {
         b.returnToConversation = null;
         if (!k) {
            c.openConversation({returnToSender: true});
            return
         }
         k = e(k);
         k.returnToSender = true;
         c.sendKik(k)
      }
   }
})(window, document, kik);
(function (e, a, c) {
   var b;
   try {
      b = c._.bridge("Profile")
   } catch (d) {
      return
   }
   c.kik = c;
   if (b.openProfile) {
      c.showProfile = function (g) {
         if (typeof g !== "string") {
            throw TypeError("username must be a string, got " + g)
         }
         try {
            b.openProfile({username: g})
         } catch (f) {
         }
      }
   }
})(window, document, kik);
(function (g, h, b) {
   var j;
   try {
      j = b._.bridge("UserData")
   } catch (d) {
      return
   }
   b.kik = b;
   function i(k) {
      if (!k) {
         return undefined
      }
      k.fullName = (k.displayName || "");
      var l = k.fullName.indexOf(" ");
      if (l === -1) {
         k.firstName = k.fullName;
         k.lastName = ""
      } else {
         k.firstName = k.fullName.substr(0, l);
         k.lastName = k.fullName.substr(l + 1)
      }
      delete k.displayName;
      k.pic = e(k.pic);
      k.thumbnail = e(k.thumbnail);
      return k
   }

   function e(k) {
      if (typeof k !== "string") {
         return k
      }
      var l = k.replace(/^https?\:\/\/[^\/]*/, "");
      return"//d33vud085sp3wg.cloudfront.net" + l
   }

   var f;
   if (j.getUserData) {
      b.getUser = function (m) {
         switch (typeof m) {
            case"undefined":
               m = function () {
               };
            case"function":
               break;
            default:
               throw TypeError("callback must be a function if defined, got " + m)
         }
         if (f) {
            m(f);
            return
         }
         var l = b.hasPermission(), k = b.utils.platform.os;
         j.getUserData({fields: ["profile"]}, function (o) {
            var n = i(o && o.userData);
            if (n) {
               f = n;
               if (!l) {
                  b.trigger("permission")
               }
            }
            if (k.ios && !l) {
               setTimeout(function () {
                  m(n)
               }, 600)
            } else {
               m(n)
            }
         })
      }
   }
   b.hasPermission = function () {
      try {
         return !!j.checkPermissions({fields: ["profile"]}).permitted
      } catch (k) {
         return false
      }
   };
   if (j.pickUsers || j.pickFilteredUsers) {
      b.pickUsers = function (k, l) {
         switch (typeof k) {
            case"function":
               l = k;
            case"undefined":
               k = {};
            case"object":
               break;
            default:
               throw TypeError("options must be an object if defined, got " + k)
         }
         if (typeof l !== "function") {
            throw TypeError("callback must be a function, got " + l)
         }
         switch (typeof k.preselected) {
            case"undefined":
               k.preselected = [];
               break;
            default:
               if (!Array.isArray(k.preselected)) {
                  throw TypeError("preselected users must be an array of users if defined, got " + k.preselected)
               }
               k.preselected.forEach(function (m) {
                  if (typeof m !== "object") {
                     throw TypeError("user must be an object, got " + m)
                  }
                  if (typeof m.username !== "string") {
                     throw TypeError("user.username must be a string, got " + m.username)
                  }
               });
               break
         }
         switch (typeof k.filtered) {
            case"undefined":
               k.filtered = [];
               break;
            default:
               if (!Array.isArray(k.filtered)) {
                  throw TypeError("filtered users must be an array of users if defined, got " + k.filtered)
               }
               k.filtered = k.filtered.map(function (m) {
                  switch (typeof m) {
                     case"string":
                        return m;
                     case"object":
                        if (m !== null && typeof m.username === "string") {
                           return m.username
                        }
                     default:
                        throw TypeError("filtered user didnt have a username, got " + m)
                  }
               });
               break
         }
         switch (typeof k.filterSelf) {
            case"undefined":
               k.filterSelf = true;
            case"boolean":
               break;
            default:
               throw TypeError("filterSelf must be a boolean if defined, got " + k.filterSelf)
         }
         switch (typeof k.minResults) {
            case"undefined":
               break;
            case"number":
               if (k.minResults < 0) {
                  throw TypeError("minResults must be non-negative if defined, got " + k.minResults)
               }
               break;
            default:
               throw TypeError("minResults must be a number if defined, got " + k.minResults)
         }
         switch (typeof k.maxResults) {
            case"undefined":
               break;
            case"number":
               if (k.maxResults < 1) {
                  throw TypeError("maxResults must be greater than 1 if defined, got " + k.maxResults)
               }
               break;
            default:
               throw TypeError("maxResults must be a number if defined, got " + k.maxResults)
         }
         switch (typeof l) {
            case"undefined":
               l = function () {
               };
               break;
            case"function":
               break;
            default:
               throw TypeError("callback must be a function if defined, got " + l)
         }
         if (k.preselected.length && k.filtered.length) {
            throw TypeError("can only preselect or filter users, not both")
         }
         if (j.pickFilteredUsers && !k.preselected.length) {
            c(k, l)
         } else {
            a(k, l)
         }
      }
   }
   function c(k, l) {
      k.minResults = k.minResults || 1;
      j.pickFilteredUsers({minResults: k.minResults, maxResults: k.maxResults, filtered: k.filtered, filterSelf: k.filterSelf}, function (m) {
         if (!m || !m.userDataList) {
            l();
            return
         }
         var n = m.userDataList.map(i);
         if (k.filtered) {
            n = n.filter(function (o) {
               return k.filtered.indexOf(o.username) === -1
            })
         }
         l(n)
      })
   }

   function a(m, q) {
      var o = false;
      if (!m.preselected || !m.preselected.length) {
         m.minResults = m.minResults || 1
      }
      var k = {}, n = [];
      m.preselected.forEach(function (r) {
         k[r.username] = r;
         n.push(r.username)
      });
      j.pickUsers({minResults: m.minResults, maxResults: m.maxResults, preselected: n, filterSelf: m.filterSelf}, function (r) {
         if (o) {
            return
         }
         if (!r || !r.userDataList) {
            o = true;
            q();
            return
         }
         var s = r.userDataList.map(function (t) {
            if (t.username in k) {
               return k[t.username]
            } else {
               return i(t)
            }
         });
         if (m.filtered) {
            s = s.filter(function (t) {
               return m.filtered.indexOf(t.username) === -1
            })
         }
         o = true;
         q(s)
      });
      var p = b.utils.platform.os, l = b.utils.platform.browser;
      if (p.ios && l.kik && l.version < 6.5) {
         b.browser.once("foreground", function () {
            setTimeout(function () {
               if (!o) {
                  o = true;
                  q()
               }
            }, 0)
         })
      }
   }
})(window, document, kik);
(function (e, a, c) {
   var b;
   try {
      b = c._.bridge("Auth")
   } catch (d) {
   }
   if (!b || !b.signRequest) {
      return
   }
   c.kik = c;
   c.sign = function (i, k, g) {
      if (typeof i !== "string") {
         throw TypeError("data to be signed must be a string, got " + i)
      }
      if (typeof k !== "function") {
         throw TypeError("callback must be a function, got " + k)
      }
      g = !!g;
      var j = c.utils.platform.os, h = c.utils.platform.browser;
      if (j.android && h.version < 6.5) {
         c.ready(function () {
            f(i, k, g)
         })
      } else {
         f(i, k, g)
      }
   };
   function f(h, j, g) {
      var i = c.hasPermission();
      b.signRequest({request: h, skipPrompt: g}, function (l) {
         if (!l || !l.signedRequest) {
            j()
         } else {
            if (!i) {
               c.trigger("permission")
            }
            var k = l.host || e.location.host;
            j(l.signedRequest, l.username, k)
         }
      })
   }

   if (b.getAnonymousId) {
      c.getAnonymousUser = function (g) {
         b.getAnonymousId(function (h) {
            if (h && h.anonymousId) {
               g(h.anonymousId)
            } else {
               g()
            }
         })
      }
   }
   if (b.signAnonymousRequest) {
      c.anonymousSign = function (g, h) {
         if (typeof g !== "string") {
            throw TypeError("data to be signed must be a string, got " + g)
         }
         if (typeof h !== "function") {
            throw TypeError("callback must be a function, got " + h)
         }
         b.signAnonymousRequest({request: g}, function (i) {
            if (!i || !i.signedRequest) {
               h()
            } else {
               h(i.signedRequest, i.anonymousId, i.host)
            }
         })
      }
   }
})(window, document, kik);
(function (f, h, a) {
   var i;
   try {
      i = a._.bridge("Photo")
   } catch (c) {
      return
   }
   var b = a.events();
   a.photo = b;
   if (i.getPhoto) {
      b.get = function (j, k) {
         e(j, k)
      };
      b.getFromCamera = function (j, k) {
         e("camera", j, k)
      };
      b.getFromGallery = function (j, k) {
         e("gallery", j, k)
      }
   }
   function d(j, k) {
      switch (typeof k) {
         case"undefined":
         case"function":
            break;
         default:
            throw TypeError(j + " must be a function if defined, got " + k)
      }
   }

   function g(j, l, k, m) {
      switch (typeof l) {
         case"undefined":
            break;
         case"number":
            if (l < k || l > m) {
               throw TypeError(j + " must be within " + k + " and " + m + " if defined, got " + l)
            }
            break;
         default:
            throw TypeError(j + " must be a number if defined, got " + l)
      }
   }

   function e(j, y, x) {
      if (typeof j !== "string") {
         x = y;
         y = j;
         j = undefined
      }
      switch (typeof y) {
         case"function":
            x = y;
            y = {};
         case"object":
            break;
         default:
            throw TypeError("options must be an object, got " + y)
      }
      d("callback", x);
      d("onCancel", y.onCancel);
      d("onSelect", y.onSelect);
      d("onPhoto", y.onPhoto);
      d("onComplete", y.onComplete);
      g("quality", y.quality, 0, 1);
      g("minResults", y.minResults, 0, 25);
      g("maxResults", y.maxResults, 1, 25);
      g("maxHeight", y.maxHeight, 0, 1280);
      g("maxWidth", y.maxWidth, 0, 1280);
      var r = y.onSelect, t = y.onCancel, v = y.onPhoto, l = y.onComplete, s = false, m = a.utils.platform.os, o = a.utils.platform.browser, q, u;
      if (y.minResults === 0) {
         y.minResults = 1
      }
      i.getPhoto({source: j, quality: y.quality, minResults: y.minResults, maxResults: y.maxResults, maxHeight: y.maxHeight, maxWidth: y.maxWidth, autoSave: y.saveToGallery}, n);
      if (m.android && (o.version < 6.7)) {
         a.browser.once("foreground", function () {
            setTimeout(function () {
               if (s) {
                  return
               }
               s = true;
               p(t);
               p(x)
            }, 0)
         })
      }
      function n(z) {
         if (s) {
            return
         }
         s = true;
         q = z && z.photoIds;
         var A = q && q.length;
         if (!A) {
            p(t);
            p(x);
            return
         }
         p(r, A);
         u = new Array(A);
         i.on("photo", w)
      }

      function w(D) {
         if (!D) {
            return
         }
         var B = q.indexOf(D.id);
         if (B === -1) {
            return
         }
         D.url = D.url || null;
         q[B] = null;
         u[B] = D.url;
         var A = 0;
         for (var C = 0, z = q.length; C < z; C++) {
            if (q[C] !== null) {
               A++
            }
         }
         p(v, D.url, B);
         if (A === 0) {
            k()
         }
      }

      function k() {
         i.off("photo", w);
         p(l, u);
         p(x, u)
      }

      function p(C, A, z) {
         if (!C) {
            return
         }
         try {
            C(A, z)
         } catch (B) {
            a.utils.error(B)
         }
      }
   }

   if (i.savePhoto) {
      b.saveToGallery = function (j, m) {
         switch (typeof m) {
            case"undefined":
               m = function () {
               };
            case"function":
               break;
            default:
               throw TypeError("callback must be a function, got " + m)
         }
         try {
            i.savePhoto({url: j}, function (n) {
               k(!!n)
            })
         } catch (l) {
            k(false)
         }
         function k(n) {
            k = function () {
            };
            m(n)
         }
      }
   }
})(window, document, kik);
(function (i, j, a) {
   var b;
   try {
      b = a._.bridge("Keyboard")
   } catch (f) {
   }
   var k = "kik-hide-form-helpers";
   var h = a.utils.platform.browser;
   l();
   a.formHelpers = {show: g, hide: e, isEnabled: c};
   function l() {
      var m;
      Array.prototype.forEach.call(j.getElementsByTagName("meta"), function (n) {
         if (n.name === k) {
            m = (n.content || "").trim()
         }
      });
      if (m !== "true") {
         return
      }
      if (h.kik && h.version <= 6.5) {
         a.ready(function () {
            d(false)
         })
      } else {
         d(false)
      }
   }

   function e() {
      d(false)
   }

   function g() {
      d(true)
   }

   function d(m) {
      if (a._.secondBatch) {
         a._.secondBatch.push({name: "Keyboard.setFormNavigationEnabled", args: {enabled: m}})
      } else {
         try {
            b.setFormNavigationEnabled({enabled: m})
         } catch (n) {
         }
      }
   }

   function c() {
      try {
         return !!b.isFormNavigationEnabled().enabled
      } catch (m) {
         return !!a.utils.platform.os.ios
      }
   }
})(window, document, kik);
(function (e, f, a) {
   var g;
   try {
      g = a._.bridge("Picker")
   } catch (b) {
      return
   }
   if (!g.startRequest) {
      return
   }
   var d = a.events(h);
   a.picker = d;
   function h(k, j, l) {
      if (typeof k !== "string") {
         throw TypeError("picker url must be a string, got " + k)
      }
      switch (typeof j) {
         case"function":
            l = j;
         case"undefined":
            j = {};
         case"object":
            break;
         default:
            throw TypeError("picker options must be an object if defined, got " + j)
      }
      if (typeof l !== "function") {
         throw TypeError("picker callback must be a function, got " + l)
      }
      g.startRequest({requestUrl: k, requestData: j}, function (m) {
         l(m && m.responseData)
      })
   }

   if (g.getRequest && g.completeRequest) {
      var c, i;
      try {
         c = (a._.secondBatch ? a._.firstBatch["Picker.getRequest"] : g.getRequest()).requestData
      } catch (b) {
      }
      if (c && f.referrer) {
         i = !!(c.kik && (f.referrer.split("?")[0] === "https://kik.com/"));
         d.url = f.referrer;
         d.data = c;
         d.fromKik = i;
         d.reply = function (k) {
            if (i && k) {
               k = a._formatMessage(k)
            }
            try {
               g.completeRequest({responseData: k})
            } catch (j) {
            }
         };
         d.cancel = function () {
            try {
               g.cancelRequest()
            } catch (j) {
            }
            if (!d.isPopup) {
               d.url = undefined;
               d.data = undefined;
               d.reply = undefined;
               d.cancel = undefined;
               d.trigger("cancel")
            }
         }
      } else {
      }
   } else {
   }
   try {
      if (a._.firstBatch && a._.firstBatch["Browser.isPopupMode"]) {
         d.isPopup = a._.firstBatch["Browser.isPopupMode"].popup
      } else {
         d.isPopup = a._.bridge("Browser").isPopupMode().popup
      }
   } catch (b) {
      d.isPopup = false
   }
})(window, document, kik);
(function (h, b, e) {
   var a;
   try {
      a = e._.bridge("Push")
   } catch (g) {
      return
   }
   var c = e.events();
   e.push = c;
   if (a.setBadgeVisibility) {
      c.badge = function (i) {
         a.setBadgeVisibility({visible: !!i, blue: true});
         c.trigger("badge", !!i)
      }
   }
   if (a.getPushToken) {
      c.getToken = function (i) {
         if (typeof i !== "function") {
            throw TypeError("callback must be a function, got " + i)
         }
         a.getPushToken(function (j) {
            i(j && j.token)
         })
      }
   }
   if (a.getNotificationList) {
      var d = e.events.handlers();
      var f = function () {
         var p;
         try {
            if (e._.firstBatch && e._.firstBatch["Push.getNotificationList"]) {
               p = e._.firstBatch["Push.getNotificationList"]
            } else {
               p = a.getNotificationList()
            }
         } catch (o) {
         }
         var k = (e.picker && e.picker.isPopup), r = true;
         if (!k) {
            r = false;
            try {
               a.setBadgeVisibility({visible: false});
               c.trigger("badge", false)
            } catch (o) {
            }
         } else {
            c.once("badge", function () {
               r = false
            })
         }
         var n = [];
         if (p && p.notifications) {
            for (var m = 0, j = p.notifications.length; m < j; m++) {
               if (typeof p.notifications[m] === "object") {
                  switch (typeof p.notifications[m].data) {
                     case"object":
                        n.push(p.notifications[m].data);
                        break;
                     case"string":
                        try {
                           var q = JSON.parse(p.notifications[m].data);
                           if (typeof q === "object") {
                              n.push(q)
                           } else {
                           }
                        } catch (o) {
                        }
                        break;
                     default:
                        break
                  }
               }
            }
         }
         if (n.length) {
            d.triggerMulti(n);
            n.forEach(function (i) {
               c.trigger("push", i)
            })
         } else {
            r = false
         }
         if (r) {
            try {
               a.setBadgeVisibility({visible: true, blue: true});
               c.trigger("badge", true)
            } catch (o) {
            }
         }
      };
      c.handler = function (i) {
         return d.handler(i)
      };
      a.on("notificationReceived", function () {
         var i = e.utils.platform;
         if (i.os.ios && i.browser.version < 6.4) {
            setTimeout(f, 0)
         } else {
            f()
         }
      });
      f()
   }
})(window, document, kik);
(function (f, g, b) {
   var h;
   try {
      h = b._.bridge("IAP")
   } catch (d) {
      return
   }
   if (!h.purchase || !h.markTransactionStored || !h.getTransactionList) {
      return
   }
   var c = b.events(a);
   c.init = i;
   b.purchase = c;
   function i(j, n) {
      if (typeof arguments[0] === "string") {
         j = Array.prototype.slice.call(arguments)
      }
      if (!Array.isArray(j)) {
         throw TypeError("list of SKUs must be an array")
      }
      j.forEach(function (o) {
         if (typeof o !== "string") {
            throw TypeError("SKU must be a string, got " + o)
         }
      });
      if (typeof n === "function") {
         if (!h.getAvailableItemsAsynchronously) {
            var m;
            try {
               m = h.getAvailableItems({skus: j})
            } catch (k) {
            }
            l(m)
         } else {
            h.getAvailableItemsAsynchronously({skus: j}, l)
         }
      } else {
         if (!h.getAvailableItems) {
            l()
         } else {
            var m;
            try {
               m = h.getAvailableItems({skus: j})
            } catch (k) {
            }
            l(m)
         }
      }
      function l(q) {
         var o;
         try {
            o = q.items
         } catch (p) {
         }
         if (!o || !Array.isArray(o)) {
            o = []
         }
         var r;
         try {
            r = h.getTransactionList({skus: j}).transactions
         } catch (p) {
            r = []
         }
         r.forEach(function (t) {
            if (!t.sku) {
               try {
                  t.sku = JSON.parse(f.atob(t.content.split(".")[1])).item.sku
               } catch (s) {
               }
            }
         });
         c.init = null;
         c.complete = e;
         c.items = o;
         c.pending = r;
         if (typeof n === "function") {
            n()
         }
      }
   }

   function a(n, l, m, j) {
      switch (typeof n) {
         case"object":
            if (n === null) {
               throw TypeError("SKU must be a string, got " + n)
            }
            if (typeof n.sku !== "string") {
               throw TypeError("SKU must be a string, got " + n.sku)
            }
            n = n.sku;
         case"string":
            break;
         default:
            throw TypeError("SKU must be a string, got " + n)
      }
      var k = c.items.map(function (o) {
         return o.sku
      }).indexOf(n);
      if (k === -1) {
         throw TypeError("SKU not available, got " + n)
      }
      switch (typeof l) {
         case"boolean":
            m = l;
            l = undefined;
         case"function":
            j = m;
            m = l;
         case"undefined":
            l = {};
         case"object":
            break;
         default:
            throw TypeError("purchase data must be a JSON object if defined, got " + l)
      }
      switch (typeof m) {
         case"boolean":
            j = m;
         case"undefined":
            m = function () {
            };
         case"function":
            break;
         default:
            throw TypeError("purchase callback must be a function if defined, got " + m)
      }
      switch (typeof j) {
         case"undefined":
            j = false;
         case"boolean":
            break;
         default:
            throw TypeError("skipPrompt must be a boolean if defined, got " + j)
      }
      h.purchase({sku: n, data: l, skipPrompt: j}, function (o) {
         if (!o) {
            m(undefined, true);
            return
         }
         if (!o.transaction) {
            m();
            return
         }
         c.pending.push(o.transaction);
         m(o.transaction)
      })
   }

   function e(k) {
      if (typeof k !== "string") {
         throw TypeError("transactionId must be a string, got " + k)
      }
      h.markTransactionStored({transactionId: k});
      for (var j = c.pending.length; j--;) {
         if (c.pending[j].transactionId === k) {
            c.pending.splice(j, 1)
         }
      }
   }
})(window, document, kik);
(function (d, a, c) {
   if (b()) {
      e()
   }
   function b() {
      var g = c.utils.platform.os, f = c.utils.platform.browser;
      return(g.ios && f.kik && (f.version < 6.5))
   }

   function e() {
      a.documentElement.addEventListener("click", function (g) {
         if (!g.defaultPrevented && g.target && g.target.nodeName === "A" && g.target.href && !g.target._clickable) {
            var f = c.browser;
            if (f) {
               f.open(g.target.href);
               g.preventDefault();
               return false
            }
         }
      })
   }
})(window, document, kik);
(function (a) {
   delete a._.firstBatch;
   if (a._.secondBatch) {
      a._.bridge.batch(a._.secondBatch);
      delete a._.secondBatch
   }
})(kik);
(function (g, h, a) {
   var c = "kik-prefer", d = "kik-unsupported";
   b();
   j();
   function b() {
      if (a.enabled) {
         return
      }
      var l = a.utils.url;
      if (l.query._app_platform) {
         return
      }
      var m = "card" + l.updateQuery({kikme: null}).substr(4), k = !!l.query.kikme;
      if (!k) {
         Array.prototype.forEach.call(h.getElementsByTagName("meta"), function (n) {
            if ((n.name === c) && (n.content || "").trim()) {
               k = true
            }
         })
      }
      if (k) {
         a.ready(function () {
            a.open.card(m, undefined, true)
         })
      }
   }

   function e() {
      var r = a.utils.platform.os, n;
      Array.prototype.forEach.call(h.getElementsByTagName("meta"), function (l) {
         if (l.name === d) {
            n = (l.content || "").trim()
         }
      });
      if (!n) {
         return true
      }
      var k = true;
      var s = n.split(",");
      for (var p = 0, m = s.length; p < m; p++) {
         var q = s[p].trim();
         var o = f(q);
         if (q && o) {
            if (o.ios && r.ios) {
               if (r.version < (o.version + 1)) {
                  k = false
               }
            } else {
               if (o.android && r.android) {
                  if (r.version <= o.version) {
                     k = false
                  }
               }
            }
         }
      }
      return k
   }

   function f(k) {
      var n = -1, m = false, l = false;
      if (k.indexOf("android-") === 0) {
         l = true;
         n = parseFloat(k.replace("android-", ""));
         if (n >= 2.3) {
            return i(k)
         }
      } else {
         if (k.indexOf("ios-") === 0) {
            m = true;
            n = parseFloat(k.replace("ios-", ""));
            if (n >= 5) {
               return i(k)
            }
         } else {
            return i(k)
         }
      }
      return{ios: m, android: l, version: n}
   }

   function i(k) {
      if (g.console && g.console.error) {
         g.console.error('"' + k + '" is an unsupported value for the "' + d + '" meta tag')
      }
      return false
   }

   function j() {
      if (e()) {
         return
      }
      var l = a.utils.platform.os, s = h.documentElement;
      Array.prototype.forEach.call(s.childNodes, function (v) {
         s.removeChild(v)
      });
      s.style["min-height"] = "0";
      s.style["min-width"] = "0";
      s.style.height = "0";
      s.style.width = "0";
      s.style.padding = "0";
      s.style.border = "none";
      s.style.margin = "0";
      s.style.overflow = "hidden";
      var q = h.createElement("head"), u = h.createElement("meta");
      u.name = "viewport";
      u.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      q.appendChild(u);
      s.appendChild(q);
      var m = h.createElement("body");
      m.style.margin = "0";
      m.style.padding = "0";
      var k = h.createElement("div");
      k.style.position = "absolute";
      k.style.top = "0";
      k.style.left = "0";
      k.style.height = "0";
      k.style.width = "0";
      k.style.background = "#31333B";
      k.style.zIndex = "100000000000";
      k.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';
      if (l.android) {
         k.style.fontFamily = '"Roboto", sans-serif'
      }
      var n = h.createElement("div");
      n.style.position = "fixed";
      n.style.left = "0";
      n.style.zIndex = "100000000000";
      var p = h.createElement("div");
      p.style.backgroundImage = "url('http://cdn.kik.com/cards/unsupported_icon.png')";
      p.style["background-size"] = "100%";
      p.style.width = "100px";
      p.style.height = "100px";
      p.style.margin = "0 auto";
      var r = h.createElement("div");
      r.style.color = "#E0E0E0";
      r.style.padding = "20px";
      r.style.textAlign = "center";
      r.style.margin = "0 auto";
      r.style.fontSize = "16px";
      r.innerHTML = "Oh no! This website isn't supported on your phone.";
      var t = h.createElement("div");
      t.style.color = "#979799";
      t.style.padding = "0 20px";
      t.style.textAlign = "center";
      t.style.margin = "0 auto";
      t.innerHTML = "This website is not available for your phone. But don't worry! You can still use the Kik Messenger you know and love :)";
      n.appendChild(p);
      n.appendChild(r);
      n.appendChild(t);
      k.appendChild(n);
      if (l.android && l.version < 2.3) {
         Array.prototype.forEach.call(s.childNodes, function (v) {
            s.removeChild(v)
         })
      }
      m.appendChild(k);
      s.appendChild(m);
      s.style["-webkit-user-select"] = "none";
      s.style["user-select"] = "none";
      s.style.background = "#31333B";
      function o() {
         s.style.height = screen.height + "px";
         s.style.width = screen.width + "px";
         s.style["max-height"] = screen.height + "px";
         s.style["max-width"] = screen.width + "px";
         m.style.height = screen.height + "px";
         m.style.width = screen.width + "px";
         k.style.height = screen.height + "px";
         k.style.width = screen.width + "px";
         n.style.width = screen.width + "px";
         n.style.top = screen.height * 0.15 + "px";
         r.style.width = screen.width * 0.65 + "px";
         t.style.width = screen.width * 0.65 + "px"
      }

      g.onorientationchange = function (v) {
         if (v.stopImmediatePropagation) {
            v.stopImmediatePropagation()
         }
         v.preventDefault();
         v.stopPropagation();
         v.cancelBubble = true;
         v.returnValue = false;
         return false
      };
      setTimeout(o, 50);
      if (s.addEventListener) {
         s.addEventListener("resize", o, false)
      }
      delete g.kik;
      throw TypeError("OS Version is not supported.")
   }
})(window, document, kik);