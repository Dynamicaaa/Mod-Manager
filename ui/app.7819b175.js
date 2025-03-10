parcelRequire = (function (e, r, t, n) {
  var i,
    o = "function" == typeof parcelRequire && parcelRequire,
    u = "function" == typeof require && require;
  function f(t, n) {
    if (!r[t]) {
      if (!e[t]) {
        var i = "function" == typeof parcelRequire && parcelRequire;
        if (!n && i) return i(t, !0);
        if (o) return o(t, !0);
        if (u && "string" == typeof t) return u(t);
        var c = new Error("Cannot find module '" + t + "'");
        throw ((c.code = "MODULE_NOT_FOUND"), c);
      }
      (p.resolve = function (r) {
        return e[t][1][r] || r;
      }),
        (p.cache = {});
      var l = (r[t] = new f.Module(t));
      e[t][0].call(l.exports, p, l, l.exports, this);
    }
    return r[t].exports;
    function p(e) {
      return f(p.resolve(e));
    }
  }
  (f.isParcelRequire = !0),
    (f.Module = function (e) {
      (this.id = e), (this.bundle = f), (this.exports = {});
    }),
    (f.modules = e),
    (f.cache = r),
    (f.parent = o),
    (f.register = function (r, t) {
      e[r] = [
        function (e, r) {
          r.exports = t;
        },
        {},
      ];
    });
  for (var c = 0; c < t.length; c++)
    try {
      f(t[c]);
    } catch (e) {
      i || (i = e);
    }
  if (t.length) {
    var l = f(t[t.length - 1]);
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = l)
      : "function" == typeof define && define.amd
      ? define(function () {
          return l;
        })
      : n && (this[n] = l);
  }
  if (((parcelRequire = f), i)) throw i;
  return f;
})(
  {
    vKp2: [
      function (require, module, exports) {
        "use strict";
        function e(e, o) {
          if (!(e instanceof o))
            throw new TypeError("Cannot call a class as a function");
        }
        function o(e, o) {
          for (var n = 0; n < o.length; n++) {
            var r = o[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(e, r.key, r);
          }
        }
        function n(e, n, r) {
          return n && o(e.prototype, n), r && o(e, r), e;
        }
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var r = (function () {
          function o() {
            e(this, o);
          }
          return (
            n(o, null, [
              {
                key: "log",
                value: function (e, o, n, r) {
                  console.log(
                    "%c".concat(o, "%c").concat(n, "%c").concat(r),
                    "background-color: ".concat(
                      e,
                      "; color: #fff; padding: 0.25em 0.5em; border-radius: 3px 0 0 3px;"
                    ),
                    "color: #fff; background-color: #2c3e50; padding: 0.25em 0.5em; border-radius: 0 3px 3px 0;",
                    "padding-left: 0.75em;"
                  );
                },
              },
              {
                key: "info",
                value: function (e, n) {
                  o.log("#2980b9", "Info", e, n);
                },
              },
              {
                key: "warn",
                value: function (e, n) {
                  o.log("#d35400", "Warn", e, n);
                },
              },
              {
                key: "error",
                value: function (e, n) {
                  o.log("#c0392b", "Error", e, n);
                },
              },
            ]),
            o
          );
        })();
        exports.default = r;
      },
      {},
    ],
    EjOG: [
      function (require, module, exports) {
        var global = arguments[3];
        var t = arguments[3];
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = Object.freeze({});
        function n(t) {
          return null == t;
        }
        function r(t) {
          return null != t;
        }
        function o(t) {
          return !0 === t;
        }
        function i(t) {
          return !1 === t;
        }
        function a(t) {
          return (
            "string" == typeof t ||
            "number" == typeof t ||
            "symbol" == typeof t ||
            "boolean" == typeof t
          );
        }
        function s(t) {
          return null !== t && "object" == typeof t;
        }
        var c = Object.prototype.toString;
        function u(t) {
          return c.call(t).slice(8, -1);
        }
        function l(t) {
          return "[object Object]" === c.call(t);
        }
        function f(t) {
          return "[object RegExp]" === c.call(t);
        }
        function p(t) {
          var e = parseFloat(String(t));
          return e >= 0 && Math.floor(e) === e && isFinite(t);
        }
        function d(t) {
          return (
            r(t) && "function" == typeof t.then && "function" == typeof t.catch
          );
        }
        function v(t) {
          return null == t
            ? ""
            : Array.isArray(t) || (l(t) && t.toString === c)
            ? JSON.stringify(t, null, 2)
            : String(t);
        }
        function h(t) {
          var e = parseFloat(t);
          return isNaN(e) ? t : e;
        }
        function m(t, e) {
          for (
            var n = Object.create(null), r = t.split(","), o = 0;
            o < r.length;
            o++
          )
            n[r[o]] = !0;
          return e
            ? function (t) {
                return n[t.toLowerCase()];
              }
            : function (t) {
                return n[t];
              };
        }
        var y = m("slot,component", !0),
          g = m("key,ref,slot,slot-scope,is");
        function _(t, e) {
          if (t.length) {
            var n = t.indexOf(e);
            if (n > -1) return t.splice(n, 1);
          }
        }
        var b = Object.prototype.hasOwnProperty;
        function C(t, e) {
          return b.call(t, e);
        }
        function w(t) {
          var e = Object.create(null);
          return function (n) {
            return e[n] || (e[n] = t(n));
          };
        }
        var $ = /-(\w)/g,
          A = w(function (t) {
            return t.replace($, function (t, e) {
              return e ? e.toUpperCase() : "";
            });
          }),
          x = w(function (t) {
            return t.charAt(0).toUpperCase() + t.slice(1);
          }),
          O = /\B([A-Z])/g,
          k = w(function (t) {
            return t.replace(O, "-$1").toLowerCase();
          });
        function S(t, e) {
          function n(n) {
            var r = arguments.length;
            return r
              ? r > 1
                ? t.apply(e, arguments)
                : t.call(e, n)
              : t.call(e);
          }
          return (n._length = t.length), n;
        }
        function j(t, e) {
          return t.bind(e);
        }
        var E = Function.prototype.bind ? j : S;
        function T(t, e) {
          e = e || 0;
          for (var n = t.length - e, r = new Array(n); n--; ) r[n] = t[n + e];
          return r;
        }
        function I(t, e) {
          for (var n in e) t[n] = e[n];
          return t;
        }
        function D(t) {
          for (var e = {}, n = 0; n < t.length; n++) t[n] && I(e, t[n]);
          return e;
        }
        function N(t, e, n) {}
        var L = function (t, e, n) {
            return !1;
          },
          P = function (t) {
            return t;
          };
        function M(t, e) {
          if (t === e) return !0;
          var n = s(t),
            r = s(e);
          if (!n || !r) return !n && !r && String(t) === String(e);
          try {
            var o = Array.isArray(t),
              i = Array.isArray(e);
            if (o && i)
              return (
                t.length === e.length &&
                t.every(function (t, n) {
                  return M(t, e[n]);
                })
              );
            if (t instanceof Date && e instanceof Date)
              return t.getTime() === e.getTime();
            if (o || i) return !1;
            var a = Object.keys(t),
              c = Object.keys(e);
            return (
              a.length === c.length &&
              a.every(function (n) {
                return M(t[n], e[n]);
              })
            );
          } catch (u) {
            return !1;
          }
        }
        function F(t, e) {
          for (var n = 0; n < t.length; n++) if (M(t[n], e)) return n;
          return -1;
        }
        function R(t) {
          var e = !1;
          return function () {
            e || ((e = !0), t.apply(this, arguments));
          };
        }
        var H = "data-server-rendered",
          U = ["component", "directive", "filter"],
          B = [
            "beforeCreate",
            "created",
            "beforeMount",
            "mounted",
            "beforeUpdate",
            "updated",
            "beforeDestroy",
            "destroyed",
            "activated",
            "deactivated",
            "errorCaptured",
            "serverPrefetch",
          ],
          z = {
            optionMergeStrategies: Object.create(null),
            silent: !1,
            productionTip: !1,
            devtools: !1,
            performance: !1,
            errorHandler: null,
            warnHandler: null,
            ignoredElements: [],
            keyCodes: Object.create(null),
            isReservedTag: L,
            isReservedAttr: L,
            isUnknownElement: L,
            getTagNamespace: N,
            parsePlatformTagName: P,
            mustUseProp: L,
            async: !0,
            _lifecycleHooks: B,
          },
          V =
            /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
        function W(t) {
          var e = (t + "").charCodeAt(0);
          return 36 === e || 95 === e;
        }
        function q(t, e, n, r) {
          Object.defineProperty(t, e, {
            value: n,
            enumerable: !!r,
            writable: !0,
            configurable: !0,
          });
        }
        var K = new RegExp("[^" + V.source + ".$_\\d]");
        function X(t) {
          if (!K.test(t)) {
            var e = t.split(".");
            return function (t) {
              for (var n = 0; n < e.length; n++) {
                if (!t) return;
                t = t[e[n]];
              }
              return t;
            };
          }
        }
        var G,
          Z = "__proto__" in {},
          J = "undefined" != typeof window,
          Q = "undefined" != typeof WXEnvironment && !!WXEnvironment.platform,
          Y = Q && WXEnvironment.platform.toLowerCase(),
          tt = J && window.navigator.userAgent.toLowerCase(),
          et = tt && /msie|trident/.test(tt),
          nt = tt && tt.indexOf("msie 9.0") > 0,
          rt = tt && tt.indexOf("edge/") > 0,
          ot = (tt && tt.indexOf("android") > 0) || "android" === Y,
          it = (tt && /iphone|ipad|ipod|ios/.test(tt)) || "ios" === Y,
          at = tt && /chrome\/\d+/.test(tt) && !rt,
          st = tt && /phantomjs/.test(tt),
          ct = tt && tt.match(/firefox\/(\d+)/),
          ut = {}.watch,
          lt = !1;
        if (J)
          try {
            var ft = {};
            Object.defineProperty(ft, "passive", {
              get: function () {
                lt = !0;
              },
            }),
              window.addEventListener("test-passive", null, ft);
          } catch (as) {}
        var pt = function () {
            return (
              void 0 === G &&
                (G =
                  !J &&
                  !Q &&
                  void 0 !== t &&
                  t.process &&
                  "server" === t.process.env.VUE_ENV),
              G
            );
          },
          dt = J && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
        function vt(t) {
          return "function" == typeof t && /native code/.test(t.toString());
        }
        var ht,
          mt =
            "undefined" != typeof Symbol &&
            vt(Symbol) &&
            "undefined" != typeof Reflect &&
            vt(Reflect.ownKeys);
        ht =
          "undefined" != typeof Set && vt(Set)
            ? Set
            : (function () {
                function t() {
                  this.set = Object.create(null);
                }
                return (
                  (t.prototype.has = function (t) {
                    return !0 === this.set[t];
                  }),
                  (t.prototype.add = function (t) {
                    this.set[t] = !0;
                  }),
                  (t.prototype.clear = function () {
                    this.set = Object.create(null);
                  }),
                  t
                );
              })();
        var yt,
          gt,
          _t,
          bt,
          Ct = N,
          wt = N,
          $t = N,
          At = N,
          xt = 0,
          Ot = function () {
            (this.id = xt++), (this.subs = []);
          };
        (Ot.prototype.addSub = function (t) {
          this.subs.push(t);
        }),
          (Ot.prototype.removeSub = function (t) {
            _(this.subs, t);
          }),
          (Ot.prototype.depend = function () {
            Ot.target && Ot.target.addDep(this);
          }),
          (Ot.prototype.notify = function () {
            var t = this.subs.slice();
            for (var e = 0, n = t.length; e < n; e++) t[e].update();
          }),
          (Ot.target = null);
        var kt = [];
        function St(t) {
          kt.push(t), (Ot.target = t);
        }
        function jt() {
          kt.pop(), (Ot.target = kt[kt.length - 1]);
        }
        var Et = function (t, e, n, r, o, i, a, s) {
            (this.tag = t),
              (this.data = e),
              (this.children = n),
              (this.text = r),
              (this.elm = o),
              (this.ns = void 0),
              (this.context = i),
              (this.fnContext = void 0),
              (this.fnOptions = void 0),
              (this.fnScopeId = void 0),
              (this.key = e && e.key),
              (this.componentOptions = a),
              (this.componentInstance = void 0),
              (this.parent = void 0),
              (this.raw = !1),
              (this.isStatic = !1),
              (this.isRootInsert = !0),
              (this.isComment = !1),
              (this.isCloned = !1),
              (this.isOnce = !1),
              (this.asyncFactory = s),
              (this.asyncMeta = void 0),
              (this.isAsyncPlaceholder = !1);
          },
          Tt = { child: { configurable: !0 } };
        (Tt.child.get = function () {
          return this.componentInstance;
        }),
          Object.defineProperties(Et.prototype, Tt);
        var It = function (t) {
          void 0 === t && (t = "");
          var e = new Et();
          return (e.text = t), (e.isComment = !0), e;
        };
        function Dt(t) {
          return new Et(void 0, void 0, void 0, String(t));
        }
        function Nt(t) {
          var e = new Et(
            t.tag,
            t.data,
            t.children && t.children.slice(),
            t.text,
            t.elm,
            t.context,
            t.componentOptions,
            t.asyncFactory
          );
          return (
            (e.ns = t.ns),
            (e.isStatic = t.isStatic),
            (e.key = t.key),
            (e.isComment = t.isComment),
            (e.fnContext = t.fnContext),
            (e.fnOptions = t.fnOptions),
            (e.fnScopeId = t.fnScopeId),
            (e.asyncMeta = t.asyncMeta),
            (e.isCloned = !0),
            e
          );
        }
        var Lt = Array.prototype,
          Pt = Object.create(Lt),
          Mt = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"];
        Mt.forEach(function (t) {
          var e = Lt[t];
          q(Pt, t, function () {
            for (var n = [], r = arguments.length; r--; ) n[r] = arguments[r];
            var o,
              i = e.apply(this, n),
              a = this.__ob__;
            switch (t) {
              case "push":
              case "unshift":
                o = n;
                break;
              case "splice":
                o = n.slice(2);
            }
            return o && a.observeArray(o), a.dep.notify(), i;
          });
        });
        var Ft = Object.getOwnPropertyNames(Pt),
          Rt = !0;
        function Ht(t) {
          Rt = t;
        }
        var Ut = function (t) {
          (this.value = t),
            (this.dep = new Ot()),
            (this.vmCount = 0),
            q(t, "__ob__", this),
            Array.isArray(t)
              ? (Z ? Bt(t, Pt) : zt(t, Pt, Ft), this.observeArray(t))
              : this.walk(t);
        };
        function Bt(t, e) {
          t.__proto__ = e;
        }
        function zt(t, e, n) {
          for (var r = 0, o = n.length; r < o; r++) {
            var i = n[r];
            q(t, i, e[i]);
          }
        }
        function Vt(t, e) {
          var n;
          if (s(t) && !(t instanceof Et))
            return (
              C(t, "__ob__") && t.__ob__ instanceof Ut
                ? (n = t.__ob__)
                : Rt &&
                  !pt() &&
                  (Array.isArray(t) || l(t)) &&
                  Object.isExtensible(t) &&
                  !t._isVue &&
                  (n = new Ut(t)),
              e && n && n.vmCount++,
              n
            );
        }
        function Wt(t, e, n, r, o) {
          var i = new Ot(),
            a = Object.getOwnPropertyDescriptor(t, e);
          if (!a || !1 !== a.configurable) {
            var s = a && a.get,
              c = a && a.set;
            (s && !c) || 2 !== arguments.length || (n = t[e]);
            var u = !o && Vt(n);
            Object.defineProperty(t, e, {
              enumerable: !0,
              configurable: !0,
              get: function () {
                var e = s ? s.call(t) : n;
                return (
                  Ot.target &&
                    (i.depend(),
                    u && (u.dep.depend(), Array.isArray(e) && Xt(e))),
                  e
                );
              },
              set: function (e) {
                var r = s ? s.call(t) : n;
                e === r ||
                  (e != e && r != r) ||
                  (s && !c) ||
                  (c ? c.call(t, e) : (n = e), (u = !o && Vt(e)), i.notify());
              },
            });
          }
        }
        function qt(t, e, n) {
          if (Array.isArray(t) && p(e))
            return (t.length = Math.max(t.length, e)), t.splice(e, 1, n), n;
          if (e in t && !(e in Object.prototype)) return (t[e] = n), n;
          var r = t.__ob__;
          return t._isVue || (r && r.vmCount)
            ? n
            : r
            ? (Wt(r.value, e, n), r.dep.notify(), n)
            : ((t[e] = n), n);
        }
        function Kt(t, e) {
          if (Array.isArray(t) && p(e)) t.splice(e, 1);
          else {
            var n = t.__ob__;
            t._isVue ||
              (n && n.vmCount) ||
              (C(t, e) && (delete t[e], n && n.dep.notify()));
          }
        }
        function Xt(t) {
          for (var e = void 0, n = 0, r = t.length; n < r; n++)
            (e = t[n]) && e.__ob__ && e.__ob__.dep.depend(),
              Array.isArray(e) && Xt(e);
        }
        (Ut.prototype.walk = function (t) {
          for (var e = Object.keys(t), n = 0; n < e.length; n++) Wt(t, e[n]);
        }),
          (Ut.prototype.observeArray = function (t) {
            for (var e = 0, n = t.length; e < n; e++) Vt(t[e]);
          });
        var Gt = z.optionMergeStrategies;
        function Zt(t, e) {
          if (!e) return t;
          for (
            var n, r, o, i = mt ? Reflect.ownKeys(e) : Object.keys(e), a = 0;
            a < i.length;
            a++
          )
            "__ob__" !== (n = i[a]) &&
              ((r = t[n]),
              (o = e[n]),
              C(t, n) ? r !== o && l(r) && l(o) && Zt(r, o) : qt(t, n, o));
          return t;
        }
        function Jt(t, e, n) {
          return n
            ? function () {
                var r = "function" == typeof e ? e.call(n, n) : e,
                  o = "function" == typeof t ? t.call(n, n) : t;
                return r ? Zt(r, o) : o;
              }
            : e
            ? t
              ? function () {
                  return Zt(
                    "function" == typeof e ? e.call(this, this) : e,
                    "function" == typeof t ? t.call(this, this) : t
                  );
                }
              : e
            : t;
        }
        function Qt(t, e) {
          var n = e ? (t ? t.concat(e) : Array.isArray(e) ? e : [e]) : t;
          return n ? Yt(n) : n;
        }
        function Yt(t) {
          for (var e = [], n = 0; n < t.length; n++)
            -1 === e.indexOf(t[n]) && e.push(t[n]);
          return e;
        }
        function te(t, e, n, r) {
          var o = Object.create(t || null);
          return e ? I(o, e) : o;
        }
        (Gt.data = function (t, e, n) {
          return n ? Jt(t, e, n) : e && "function" != typeof e ? t : Jt(t, e);
        }),
          B.forEach(function (t) {
            Gt[t] = Qt;
          }),
          U.forEach(function (t) {
            Gt[t + "s"] = te;
          }),
          (Gt.watch = function (t, e, n, r) {
            if ((t === ut && (t = void 0), e === ut && (e = void 0), !e))
              return Object.create(t || null);
            if (!t) return e;
            var o = {};
            for (var i in (I(o, t), e)) {
              var a = o[i],
                s = e[i];
              a && !Array.isArray(a) && (a = [a]),
                (o[i] = a ? a.concat(s) : Array.isArray(s) ? s : [s]);
            }
            return o;
          }),
          (Gt.props =
            Gt.methods =
            Gt.inject =
            Gt.computed =
              function (t, e, n, r) {
                if (!t) return e;
                var o = Object.create(null);
                return I(o, t), e && I(o, e), o;
              }),
          (Gt.provide = Jt);
        var ee = function (t, e) {
          return void 0 === e ? t : e;
        };
        function ne(t) {
          for (var e in t.components) re(e);
        }
        function re(t) {
          new RegExp("^[a-zA-Z][\\-\\.0-9_" + V.source + "]*$").test(t) ||
            Ct(
              'Invalid component name: "' +
                t +
                '". Component names should conform to valid custom element name in html5 specification.'
            ),
            (y(t) || z.isReservedTag(t)) &&
              Ct(
                "Do not use built-in or reserved HTML elements as component id: " +
                  t
              );
        }
        function oe(t, e) {
          var n = t.props;
          if (n) {
            var r,
              o,
              i = {};
            if (Array.isArray(n))
              for (r = n.length; r--; )
                "string" == typeof (o = n[r]) && (i[A(o)] = { type: null });
            else if (l(n))
              for (var a in n) (o = n[a]), (i[A(a)] = l(o) ? o : { type: o });
            else 0;
            t.props = i;
          }
        }
        function ie(t, e) {
          var n = t.inject;
          if (n) {
            var r = (t.inject = {});
            if (Array.isArray(n))
              for (var o = 0; o < n.length; o++) r[n[o]] = { from: n[o] };
            else if (l(n))
              for (var i in n) {
                var a = n[i];
                r[i] = l(a) ? I({ from: i }, a) : { from: a };
              }
            else 0;
          }
        }
        function ae(t) {
          var e = t.directives;
          if (e)
            for (var n in e) {
              var r = e[n];
              "function" == typeof r && (e[n] = { bind: r, update: r });
            }
        }
        function se(t, e, n) {
          l(e) ||
            Ct(
              'Invalid value for option "' +
                t +
                '": expected an Object, but got ' +
                u(e) +
                ".",
              n
            );
        }
        function ce(t, e, n) {
          if (
            ("function" == typeof e && (e = e.options),
            oe(e, n),
            ie(e, n),
            ae(e),
            !e._base && (e.extends && (t = ce(t, e.extends, n)), e.mixins))
          )
            for (var r = 0, o = e.mixins.length; r < o; r++)
              t = ce(t, e.mixins[r], n);
          var i,
            a = {};
          for (i in t) s(i);
          for (i in e) C(t, i) || s(i);
          function s(r) {
            var o = Gt[r] || ee;
            a[r] = o(t[r], e[r], n, r);
          }
          return a;
        }
        function ue(t, e, n, r) {
          if ("string" == typeof n) {
            var o = t[e];
            if (C(o, n)) return o[n];
            var i = A(n);
            if (C(o, i)) return o[i];
            var a = x(i);
            if (C(o, a)) return o[a];
            var s = o[n] || o[i] || o[a];
            return s;
          }
        }
        function le(t, e, n, r) {
          var o = e[t],
            i = !C(n, t),
            a = n[t],
            s = ye(Boolean, o.type);
          if (s > -1)
            if (i && !C(o, "default")) a = !1;
            else if ("" === a || a === k(t)) {
              var c = ye(String, o.type);
              (c < 0 || s < c) && (a = !0);
            }
          if (void 0 === a) {
            a = fe(r, o, t);
            var u = Rt;
            Ht(!0), Vt(a), Ht(u);
          }
          return a;
        }
        function fe(t, e, n) {
          if (C(e, "default")) {
            var r = e.default;
            return t &&
              t.$options.propsData &&
              void 0 === t.$options.propsData[n] &&
              void 0 !== t._props[n]
              ? t._props[n]
              : "function" == typeof r && "Function" !== he(e.type)
              ? r.call(t)
              : r;
          }
        }
        function pe(t, e, n, r, o) {
          if (t.required && o) Ct('Missing required prop: "' + e + '"', r);
          else if (null != n || t.required) {
            var i = t.type,
              a = !i || !0 === i,
              s = [];
            if (i) {
              Array.isArray(i) || (i = [i]);
              for (var c = 0; c < i.length && !a; c++) {
                var u = ve(n, i[c]);
                s.push(u.expectedType || ""), (a = u.valid);
              }
            }
            if (a) {
              var l = t.validator;
              l &&
                (l(n) ||
                  Ct(
                    'Invalid prop: custom validator check failed for prop "' +
                      e +
                      '".',
                    r
                  ));
            } else Ct(ge(e, n, s), r);
          }
        }
        var de = /^(String|Number|Boolean|Function|Symbol)$/;
        function ve(t, e) {
          var n,
            r = he(e);
          if (de.test(r)) {
            var o = typeof t;
            (n = o === r.toLowerCase()) ||
              "object" !== o ||
              (n = t instanceof e);
          } else
            n =
              "Object" === r
                ? l(t)
                : "Array" === r
                ? Array.isArray(t)
                : t instanceof e;
          return { valid: n, expectedType: r };
        }
        function he(t) {
          var e = t && t.toString().match(/^\s*function (\w+)/);
          return e ? e[1] : "";
        }
        function me(t, e) {
          return he(t) === he(e);
        }
        function ye(t, e) {
          if (!Array.isArray(e)) return me(e, t) ? 0 : -1;
          for (var n = 0, r = e.length; n < r; n++) if (me(e[n], t)) return n;
          return -1;
        }
        function ge(t, e, n) {
          var r =
              'Invalid prop: type check failed for prop "' +
              t +
              '". Expected ' +
              n.map(x).join(", "),
            o = n[0],
            i = u(e),
            a = _e(e, o),
            s = _e(e, i);
          return (
            1 === n.length && be(o) && !Ce(o, i) && (r += " with value " + a),
            (r += ", got " + i + " "),
            be(i) && (r += "with value " + s + "."),
            r
          );
        }
        function _e(t, e) {
          return "String" === e
            ? '"' + t + '"'
            : "Number" === e
            ? "" + Number(t)
            : "" + t;
        }
        function be(t) {
          return ["string", "number", "boolean"].some(function (e) {
            return t.toLowerCase() === e;
          });
        }
        function Ce() {
          for (var t = [], e = arguments.length; e--; ) t[e] = arguments[e];
          return t.some(function (t) {
            return "boolean" === t.toLowerCase();
          });
        }
        function we(t, e, n) {
          St();
          try {
            if (e)
              for (var r = e; (r = r.$parent); ) {
                var o = r.$options.errorCaptured;
                if (o)
                  for (var i = 0; i < o.length; i++)
                    try {
                      if (!1 === o[i].call(r, t, e, n)) return;
                    } catch (as) {
                      Ae(as, r, "errorCaptured hook");
                    }
              }
            Ae(t, e, n);
          } finally {
            jt();
          }
        }
        function $e(t, e, n, r, o) {
          var i;
          try {
            (i = n ? t.apply(e, n) : t.call(e)) &&
              !i._isVue &&
              d(i) &&
              !i._handled &&
              (i.catch(function (t) {
                return we(t, r, o + " (Promise/async)");
              }),
              (i._handled = !0));
          } catch (as) {
            we(as, r, o);
          }
          return i;
        }
        function Ae(t, e, n) {
          if (z.errorHandler)
            try {
              return z.errorHandler.call(null, t, e, n);
            } catch (as) {
              as !== t && xe(as, null, "config.errorHandler");
            }
          xe(t, e, n);
        }
        function xe(t, e, n) {
          if ((!J && !Q) || "undefined" == typeof console) throw t;
          console.error(t);
        }
        var Oe,
          ke,
          Se,
          je,
          Ee,
          Te,
          Ie,
          De,
          Ne,
          Le = !1,
          Pe = [],
          Me = !1;
        function Fe() {
          Me = !1;
          var t = Pe.slice(0);
          Pe.length = 0;
          for (var e = 0; e < t.length; e++) t[e]();
        }
        if ("undefined" != typeof Promise && vt(Promise)) {
          var Re = Promise.resolve();
          (Oe = function () {
            Re.then(Fe), it && setTimeout(N);
          }),
            (Le = !0);
        } else if (
          et ||
          "undefined" == typeof MutationObserver ||
          (!vt(MutationObserver) &&
            "[object MutationObserverConstructor]" !==
              MutationObserver.toString())
        )
          Oe =
            "undefined" != typeof setImmediate && vt(setImmediate)
              ? function () {
                  setImmediate(Fe);
                }
              : function () {
                  setTimeout(Fe, 0);
                };
        else {
          var He = 1,
            Ue = new MutationObserver(Fe),
            Be = document.createTextNode(String(He));
          Ue.observe(Be, { characterData: !0 }),
            (Oe = function () {
              (He = (He + 1) % 2), (Be.data = String(He));
            }),
            (Le = !0);
        }
        function ze(t, e) {
          var n;
          if (
            (Pe.push(function () {
              if (t)
                try {
                  t.call(e);
                } catch (as) {
                  we(as, e, "nextTick");
                }
              else n && n(e);
            }),
            Me || ((Me = !0), Oe()),
            !t && "undefined" != typeof Promise)
          )
            return new Promise(function (t) {
              n = t;
            });
        }
        var Ve,
          We,
          qe,
          Ke = new ht();
        function Xe(t) {
          Ge(t, Ke), Ke.clear();
        }
        function Ge(t, e) {
          var n,
            r,
            o = Array.isArray(t);
          if (!((!o && !s(t)) || Object.isFrozen(t) || t instanceof Et)) {
            if (t.__ob__) {
              var i = t.__ob__.dep.id;
              if (e.has(i)) return;
              e.add(i);
            }
            if (o) for (n = t.length; n--; ) Ge(t[n], e);
            else for (n = (r = Object.keys(t)).length; n--; ) Ge(t[r[n]], e);
          }
        }
        var Ze = w(function (t) {
          var e = "&" === t.charAt(0),
            n = "~" === (t = e ? t.slice(1) : t).charAt(0),
            r = "!" === (t = n ? t.slice(1) : t).charAt(0);
          return {
            name: (t = r ? t.slice(1) : t),
            once: n,
            capture: r,
            passive: e,
          };
        });
        function Je(t, e) {
          function n() {
            var t = arguments,
              r = n.fns;
            if (!Array.isArray(r))
              return $e(r, null, arguments, e, "v-on handler");
            for (var o = r.slice(), i = 0; i < o.length; i++)
              $e(o[i], null, t, e, "v-on handler");
          }
          return (n.fns = t), n;
        }
        function Qe(t, e, r, i, a, s) {
          var c, u, l, f;
          for (c in t)
            (u = t[c]),
              (l = e[c]),
              (f = Ze(c)),
              n(u) ||
                (n(l)
                  ? (n(u.fns) && (u = t[c] = Je(u, s)),
                    o(f.once) && (u = t[c] = a(f.name, u, f.capture)),
                    r(f.name, u, f.capture, f.passive, f.params))
                  : u !== l && ((l.fns = u), (t[c] = l)));
          for (c in e) n(t[c]) && i((f = Ze(c)).name, e[c], f.capture);
        }
        function Ye(t, e, i) {
          var a;
          t instanceof Et && (t = t.data.hook || (t.data.hook = {}));
          var s = t[e];
          function c() {
            i.apply(this, arguments), _(a.fns, c);
          }
          n(s)
            ? (a = Je([c]))
            : r(s.fns) && o(s.merged)
            ? (a = s).fns.push(c)
            : (a = Je([s, c])),
            (a.merged = !0),
            (t[e] = a);
        }
        function tn(t, e, o) {
          var i = e.options.props;
          if (!n(i)) {
            var a = {},
              s = t.attrs,
              c = t.props;
            if (r(s) || r(c))
              for (var u in i) {
                var l = k(u);
                en(a, c, u, l, !0) || en(a, s, u, l, !1);
              }
            return a;
          }
        }
        function en(t, e, n, o, i) {
          if (r(e)) {
            if (C(e, n)) return (t[n] = e[n]), i || delete e[n], !0;
            if (C(e, o)) return (t[n] = e[o]), i || delete e[o], !0;
          }
          return !1;
        }
        function nn(t) {
          for (var e = 0; e < t.length; e++)
            if (Array.isArray(t[e])) return Array.prototype.concat.apply([], t);
          return t;
        }
        function rn(t) {
          return a(t) ? [Dt(t)] : Array.isArray(t) ? an(t) : void 0;
        }
        function on(t) {
          return r(t) && r(t.text) && i(t.isComment);
        }
        function an(t, e) {
          var i,
            s,
            c,
            u,
            l = [];
          for (i = 0; i < t.length; i++)
            n((s = t[i])) ||
              "boolean" == typeof s ||
              ((u = l[(c = l.length - 1)]),
              Array.isArray(s)
                ? s.length > 0 &&
                  (on((s = an(s, (e || "") + "_" + i))[0]) &&
                    on(u) &&
                    ((l[c] = Dt(u.text + s[0].text)), s.shift()),
                  l.push.apply(l, s))
                : a(s)
                ? on(u)
                  ? (l[c] = Dt(u.text + s))
                  : "" !== s && l.push(Dt(s))
                : on(s) && on(u)
                ? (l[c] = Dt(u.text + s.text))
                : (o(t._isVList) &&
                    r(s.tag) &&
                    n(s.key) &&
                    r(e) &&
                    (s.key = "__vlist" + e + "_" + i + "__"),
                  l.push(s)));
          return l;
        }
        function sn(t) {
          var e = t.$options.provide;
          e && (t._provided = "function" == typeof e ? e.call(t) : e);
        }
        function cn(t) {
          var e = un(t.$options.inject, t);
          e &&
            (Ht(!1),
            Object.keys(e).forEach(function (n) {
              Wt(t, n, e[n]);
            }),
            Ht(!0));
        }
        function un(t, e) {
          if (t) {
            for (
              var n = Object.create(null),
                r = mt ? Reflect.ownKeys(t) : Object.keys(t),
                o = 0;
              o < r.length;
              o++
            ) {
              var i = r[o];
              if ("__ob__" !== i) {
                for (var a = t[i].from, s = e; s; ) {
                  if (s._provided && C(s._provided, a)) {
                    n[i] = s._provided[a];
                    break;
                  }
                  s = s.$parent;
                }
                if (!s)
                  if ("default" in t[i]) {
                    var c = t[i].default;
                    n[i] = "function" == typeof c ? c.call(e) : c;
                  } else 0;
              }
            }
            return n;
          }
        }
        function ln(t, e) {
          if (!t || !t.length) return {};
          for (var n = {}, r = 0, o = t.length; r < o; r++) {
            var i = t[r],
              a = i.data;
            if (
              (a && a.attrs && a.attrs.slot && delete a.attrs.slot,
              (i.context !== e && i.fnContext !== e) || !a || null == a.slot)
            )
              (n.default || (n.default = [])).push(i);
            else {
              var s = a.slot,
                c = n[s] || (n[s] = []);
              "template" === i.tag
                ? c.push.apply(c, i.children || [])
                : c.push(i);
            }
          }
          for (var u in n) n[u].every(fn) && delete n[u];
          return n;
        }
        function fn(t) {
          return (t.isComment && !t.asyncFactory) || " " === t.text;
        }
        function pn(t, n, r) {
          var o,
            i = Object.keys(n).length > 0,
            a = t ? !!t.$stable : !i,
            s = t && t.$key;
          if (t) {
            if (t._normalized) return t._normalized;
            if (a && r && r !== e && s === r.$key && !i && !r.$hasNormal)
              return r;
            for (var c in ((o = {}), t))
              t[c] && "$" !== c[0] && (o[c] = dn(n, c, t[c]));
          } else o = {};
          for (var u in n) u in o || (o[u] = vn(n, u));
          return (
            t && Object.isExtensible(t) && (t._normalized = o),
            q(o, "$stable", a),
            q(o, "$key", s),
            q(o, "$hasNormal", i),
            o
          );
        }
        function dn(t, e, n) {
          var r = function () {
            var t = arguments.length ? n.apply(null, arguments) : n({});
            return (t =
              t && "object" == typeof t && !Array.isArray(t) ? [t] : rn(t)) &&
              (0 === t.length || (1 === t.length && t[0].isComment))
              ? void 0
              : t;
          };
          return (
            n.proxy &&
              Object.defineProperty(t, e, {
                get: r,
                enumerable: !0,
                configurable: !0,
              }),
            r
          );
        }
        function vn(t, e) {
          return function () {
            return t[e];
          };
        }
        function hn(t, e) {
          var n, o, i, a, c;
          if (Array.isArray(t) || "string" == typeof t)
            for (n = new Array(t.length), o = 0, i = t.length; o < i; o++)
              n[o] = e(t[o], o);
          else if ("number" == typeof t)
            for (n = new Array(t), o = 0; o < t; o++) n[o] = e(o + 1, o);
          else if (s(t))
            if (mt && t[Symbol.iterator]) {
              n = [];
              for (var u = t[Symbol.iterator](), l = u.next(); !l.done; )
                n.push(e(l.value, n.length)), (l = u.next());
            } else
              for (
                a = Object.keys(t),
                  n = new Array(a.length),
                  o = 0,
                  i = a.length;
                o < i;
                o++
              )
                (c = a[o]), (n[o] = e(t[c], c, o));
          return r(n) || (n = []), (n._isVList = !0), n;
        }
        function mn(t, e, n, r) {
          var o,
            i = this.$scopedSlots[t];
          i
            ? ((n = n || {}), r && (n = I(I({}, r), n)), (o = i(n) || e))
            : (o = this.$slots[t] || e);
          var a = n && n.slot;
          return a ? this.$createElement("template", { slot: a }, o) : o;
        }
        function yn(t) {
          return ue(this.$options, "filters", t, !0) || P;
        }
        function gn(t, e) {
          return Array.isArray(t) ? -1 === t.indexOf(e) : t !== e;
        }
        function _n(t, e, n, r, o) {
          var i = z.keyCodes[e] || n;
          return o && r && !z.keyCodes[e]
            ? gn(o, r)
            : i
            ? gn(i, t)
            : r
            ? k(r) !== e
            : void 0;
        }
        function bn(t, e, n, r, o) {
          if (n)
            if (s(n)) {
              var i;
              Array.isArray(n) && (n = D(n));
              var a = function (a) {
                if ("class" === a || "style" === a || g(a)) i = t;
                else {
                  var s = t.attrs && t.attrs.type;
                  i =
                    r || z.mustUseProp(e, s, a)
                      ? t.domProps || (t.domProps = {})
                      : t.attrs || (t.attrs = {});
                }
                var c = A(a),
                  u = k(a);
                c in i ||
                  u in i ||
                  ((i[a] = n[a]),
                  o &&
                    ((t.on || (t.on = {}))["update:" + a] = function (t) {
                      n[a] = t;
                    }));
              };
              for (var c in n) a(c);
            } else;
          return t;
        }
        function Cn(t, e) {
          var n = this._staticTrees || (this._staticTrees = []),
            r = n[t];
          return r && !e
            ? r
            : ($n(
                (r = n[t] =
                  this.$options.staticRenderFns[t].call(
                    this._renderProxy,
                    null,
                    this
                  )),
                "__static__" + t,
                !1
              ),
              r);
        }
        function wn(t, e, n) {
          return $n(t, "__once__" + e + (n ? "_" + n : ""), !0), t;
        }
        function $n(t, e, n) {
          if (Array.isArray(t))
            for (var r = 0; r < t.length; r++)
              t[r] && "string" != typeof t[r] && An(t[r], e + "_" + r, n);
          else An(t, e, n);
        }
        function An(t, e, n) {
          (t.isStatic = !0), (t.key = e), (t.isOnce = n);
        }
        function xn(t, e) {
          if (e)
            if (l(e)) {
              var n = (t.on = t.on ? I({}, t.on) : {});
              for (var r in e) {
                var o = n[r],
                  i = e[r];
                n[r] = o ? [].concat(o, i) : i;
              }
            } else;
          return t;
        }
        function On(t, e, n, r) {
          e = e || { $stable: !n };
          for (var o = 0; o < t.length; o++) {
            var i = t[o];
            Array.isArray(i)
              ? On(i, e, n)
              : i && (i.proxy && (i.fn.proxy = !0), (e[i.key] = i.fn));
          }
          return r && (e.$key = r), e;
        }
        function kn(t, e) {
          for (var n = 0; n < e.length; n += 2) {
            var r = e[n];
            "string" == typeof r && r && (t[e[n]] = e[n + 1]);
          }
          return t;
        }
        function Sn(t, e) {
          return "string" == typeof t ? e + t : t;
        }
        function jn(t) {
          (t._o = wn),
            (t._n = h),
            (t._s = v),
            (t._l = hn),
            (t._t = mn),
            (t._q = M),
            (t._i = F),
            (t._m = Cn),
            (t._f = yn),
            (t._k = _n),
            (t._b = bn),
            (t._v = Dt),
            (t._e = It),
            (t._u = On),
            (t._g = xn),
            (t._d = kn),
            (t._p = Sn);
        }
        function En(t, n, r, i, a) {
          var s,
            c = this,
            u = a.options;
          C(i, "_uid")
            ? ((s = Object.create(i))._original = i)
            : ((s = i), (i = i._original));
          var l = o(u._compiled),
            f = !l;
          (this.data = t),
            (this.props = n),
            (this.children = r),
            (this.parent = i),
            (this.listeners = t.on || e),
            (this.injections = un(u.inject, i)),
            (this.slots = function () {
              return (
                c.$slots || pn(t.scopedSlots, (c.$slots = ln(r, i))), c.$slots
              );
            }),
            Object.defineProperty(this, "scopedSlots", {
              enumerable: !0,
              get: function () {
                return pn(t.scopedSlots, this.slots());
              },
            }),
            l &&
              ((this.$options = u),
              (this.$slots = this.slots()),
              (this.$scopedSlots = pn(t.scopedSlots, this.$slots))),
            u._scopeId
              ? (this._c = function (t, e, n, r) {
                  var o = zn(s, t, e, n, r, f);
                  return (
                    o &&
                      !Array.isArray(o) &&
                      ((o.fnScopeId = u._scopeId), (o.fnContext = i)),
                    o
                  );
                })
              : (this._c = function (t, e, n, r) {
                  return zn(s, t, e, n, r, f);
                });
        }
        function Tn(t, n, o, i, a) {
          var s = t.options,
            c = {},
            u = s.props;
          if (r(u)) for (var l in u) c[l] = le(l, u, n || e);
          else r(o.attrs) && Dn(c, o.attrs), r(o.props) && Dn(c, o.props);
          var f = new En(o, c, a, i, t),
            p = s.render.call(null, f._c, f);
          if (p instanceof Et) return In(p, o, f.parent, s, f);
          if (Array.isArray(p)) {
            for (
              var d = rn(p) || [], v = new Array(d.length), h = 0;
              h < d.length;
              h++
            )
              v[h] = In(d[h], o, f.parent, s, f);
            return v;
          }
        }
        function In(t, e, n, r, o) {
          var i = Nt(t);
          return (
            (i.fnContext = n),
            (i.fnOptions = r),
            e.slot && ((i.data || (i.data = {})).slot = e.slot),
            i
          );
        }
        function Dn(t, e) {
          for (var n in e) t[A(n)] = e[n];
        }
        jn(En.prototype);
        var Nn = {
            init: function (t, e) {
              if (
                t.componentInstance &&
                !t.componentInstance._isDestroyed &&
                t.data.keepAlive
              ) {
                var n = t;
                Nn.prepatch(n, n);
              } else {
                (t.componentInstance = Mn(t, cr)).$mount(e ? t.elm : void 0, e);
              }
            },
            prepatch: function (t, e) {
              var n = e.componentOptions;
              vr(
                (e.componentInstance = t.componentInstance),
                n.propsData,
                n.listeners,
                e,
                n.children
              );
            },
            insert: function (t) {
              var e = t.context,
                n = t.componentInstance;
              n._isMounted || ((n._isMounted = !0), gr(n, "mounted")),
                t.data.keepAlive && (e._isMounted ? Dr(n) : mr(n, !0));
            },
            destroy: function (t) {
              var e = t.componentInstance;
              e._isDestroyed || (t.data.keepAlive ? yr(e, !0) : e.$destroy());
            },
          },
          Ln = Object.keys(Nn);
        function Pn(t, e, i, a, c) {
          if (!n(t)) {
            var u = i.$options._base;
            if ((s(t) && (t = u.extend(t)), "function" == typeof t)) {
              var l;
              if (n(t.cid) && void 0 === (t = Yn((l = t), u)))
                return Qn(l, e, i, a, c);
              (e = e || {}), no(t), r(e.model) && Hn(t.options, e);
              var f = tn(e, t, c);
              if (o(t.options.functional)) return Tn(t, f, e, i, a);
              var p = e.on;
              if (((e.on = e.nativeOn), o(t.options.abstract))) {
                var d = e.slot;
                (e = {}), d && (e.slot = d);
              }
              Fn(e);
              var v = t.options.name || c;
              return new Et(
                "vue-component-" + t.cid + (v ? "-" + v : ""),
                e,
                void 0,
                void 0,
                void 0,
                i,
                { Ctor: t, propsData: f, listeners: p, tag: c, children: a },
                l
              );
            }
          }
        }
        function Mn(t, e) {
          var n = { _isComponent: !0, _parentVnode: t, parent: e },
            o = t.data.inlineTemplate;
          return (
            r(o) &&
              ((n.render = o.render), (n.staticRenderFns = o.staticRenderFns)),
            new t.componentOptions.Ctor(n)
          );
        }
        function Fn(t) {
          for (var e = t.hook || (t.hook = {}), n = 0; n < Ln.length; n++) {
            var r = Ln[n],
              o = e[r],
              i = Nn[r];
            o === i || (o && o._merged) || (e[r] = o ? Rn(i, o) : i);
          }
        }
        function Rn(t, e) {
          var n = function (n, r) {
            t(n, r), e(n, r);
          };
          return (n._merged = !0), n;
        }
        function Hn(t, e) {
          var n = (t.model && t.model.prop) || "value",
            o = (t.model && t.model.event) || "input";
          (e.attrs || (e.attrs = {}))[n] = e.model.value;
          var i = e.on || (e.on = {}),
            a = i[o],
            s = e.model.callback;
          r(a)
            ? (Array.isArray(a) ? -1 === a.indexOf(s) : a !== s) &&
              (i[o] = [s].concat(a))
            : (i[o] = s);
        }
        var Un = 1,
          Bn = 2;
        function zn(t, e, n, r, i, s) {
          return (
            (Array.isArray(n) || a(n)) && ((i = r), (r = n), (n = void 0)),
            o(s) && (i = Bn),
            Vn(t, e, n, r, i)
          );
        }
        function Vn(t, e, n, o, i) {
          if (r(n) && r(n.__ob__)) return It();
          if ((r(n) && r(n.is) && (e = n.is), !e)) return It();
          var a, s, c;
          (Array.isArray(o) &&
            "function" == typeof o[0] &&
            (((n = n || {}).scopedSlots = { default: o[0] }), (o.length = 0)),
          i === Bn ? (o = rn(o)) : i === Un && (o = nn(o)),
          "string" == typeof e)
            ? ((s = (t.$vnode && t.$vnode.ns) || z.getTagNamespace(e)),
              (a = z.isReservedTag(e)
                ? new Et(z.parsePlatformTagName(e), n, o, void 0, void 0, t)
                : (n && n.pre) || !r((c = ue(t.$options, "components", e)))
                ? new Et(e, n, o, void 0, void 0, t)
                : Pn(c, n, t, o, e)))
            : (a = Pn(e, n, t, o));
          return Array.isArray(a)
            ? a
            : r(a)
            ? (r(s) && Wn(a, s), r(n) && qn(n), a)
            : It();
        }
        function Wn(t, e, i) {
          if (
            ((t.ns = e),
            "foreignObject" === t.tag && ((e = void 0), (i = !0)),
            r(t.children))
          )
            for (var a = 0, s = t.children.length; a < s; a++) {
              var c = t.children[a];
              r(c.tag) && (n(c.ns) || (o(i) && "svg" !== c.tag)) && Wn(c, e, i);
            }
        }
        function qn(t) {
          s(t.style) && Xe(t.style), s(t.class) && Xe(t.class);
        }
        function Kn(t) {
          (t._vnode = null), (t._staticTrees = null);
          var n = t.$options,
            r = (t.$vnode = n._parentVnode),
            o = r && r.context;
          (t.$slots = ln(n._renderChildren, o)),
            (t.$scopedSlots = e),
            (t._c = function (e, n, r, o) {
              return zn(t, e, n, r, o, !1);
            }),
            (t.$createElement = function (e, n, r, o) {
              return zn(t, e, n, r, o, !0);
            });
          var i = r && r.data;
          Wt(t, "$attrs", (i && i.attrs) || e, null, !0),
            Wt(t, "$listeners", n._parentListeners || e, null, !0);
        }
        var Xn,
          Gn = null;
        function Zn(t) {
          jn(t.prototype),
            (t.prototype.$nextTick = function (t) {
              return ze(t, this);
            }),
            (t.prototype._render = function () {
              var t,
                e = this,
                n = e.$options,
                r = n.render,
                o = n._parentVnode;
              o &&
                (e.$scopedSlots = pn(
                  o.data.scopedSlots,
                  e.$slots,
                  e.$scopedSlots
                )),
                (e.$vnode = o);
              try {
                (Gn = e), (t = r.call(e._renderProxy, e.$createElement));
              } catch (as) {
                we(as, e, "render"), (t = e._vnode);
              } finally {
                Gn = null;
              }
              return (
                Array.isArray(t) && 1 === t.length && (t = t[0]),
                t instanceof Et || (t = It()),
                (t.parent = o),
                t
              );
            });
        }
        function Jn(t, e) {
          return (
            (t.__esModule || (mt && "Module" === t[Symbol.toStringTag])) &&
              (t = t.default),
            s(t) ? e.extend(t) : t
          );
        }
        function Qn(t, e, n, r, o) {
          var i = It();
          return (
            (i.asyncFactory = t),
            (i.asyncMeta = { data: e, context: n, children: r, tag: o }),
            i
          );
        }
        function Yn(t, e) {
          if (o(t.error) && r(t.errorComp)) return t.errorComp;
          if (r(t.resolved)) return t.resolved;
          var i = Gn;
          if (
            (i && r(t.owners) && -1 === t.owners.indexOf(i) && t.owners.push(i),
            o(t.loading) && r(t.loadingComp))
          )
            return t.loadingComp;
          if (i && !r(t.owners)) {
            var a = (t.owners = [i]),
              c = !0,
              u = null,
              l = null;
            i.$on("hook:destroyed", function () {
              return _(a, i);
            });
            var f = function (t) {
                for (var e = 0, n = a.length; e < n; e++) a[e].$forceUpdate();
                t &&
                  ((a.length = 0),
                  null !== u && (clearTimeout(u), (u = null)),
                  null !== l && (clearTimeout(l), (l = null)));
              },
              p = R(function (n) {
                (t.resolved = Jn(n, e)), c ? (a.length = 0) : f(!0);
              }),
              v = R(function (e) {
                r(t.errorComp) && ((t.error = !0), f(!0));
              }),
              h = t(p, v);
            return (
              s(h) &&
                (d(h)
                  ? n(t.resolved) && h.then(p, v)
                  : d(h.component) &&
                    (h.component.then(p, v),
                    r(h.error) && (t.errorComp = Jn(h.error, e)),
                    r(h.loading) &&
                      ((t.loadingComp = Jn(h.loading, e)),
                      0 === h.delay
                        ? (t.loading = !0)
                        : (u = setTimeout(function () {
                            (u = null),
                              n(t.resolved) &&
                                n(t.error) &&
                                ((t.loading = !0), f(!1));
                          }, h.delay || 200))),
                    r(h.timeout) &&
                      (l = setTimeout(function () {
                        (l = null), n(t.resolved) && v(null);
                      }, h.timeout)))),
              (c = !1),
              t.loading ? t.loadingComp : t.resolved
            );
          }
        }
        function tr(t) {
          return t.isComment && t.asyncFactory;
        }
        function er(t) {
          if (Array.isArray(t))
            for (var e = 0; e < t.length; e++) {
              var n = t[e];
              if (r(n) && (r(n.componentOptions) || tr(n))) return n;
            }
        }
        function nr(t) {
          (t._events = Object.create(null)), (t._hasHookEvent = !1);
          var e = t.$options._parentListeners;
          e && ar(t, e);
        }
        function rr(t, e) {
          Xn.$on(t, e);
        }
        function or(t, e) {
          Xn.$off(t, e);
        }
        function ir(t, e) {
          var n = Xn;
          return function r() {
            null !== e.apply(null, arguments) && n.$off(t, r);
          };
        }
        function ar(t, e, n) {
          (Xn = t), Qe(e, n || {}, rr, or, ir, t), (Xn = void 0);
        }
        function sr(t) {
          var e = /^hook:/;
          (t.prototype.$on = function (t, n) {
            var r = this;
            if (Array.isArray(t))
              for (var o = 0, i = t.length; o < i; o++) r.$on(t[o], n);
            else
              (r._events[t] || (r._events[t] = [])).push(n),
                e.test(t) && (r._hasHookEvent = !0);
            return r;
          }),
            (t.prototype.$once = function (t, e) {
              var n = this;
              function r() {
                n.$off(t, r), e.apply(n, arguments);
              }
              return (r.fn = e), n.$on(t, r), n;
            }),
            (t.prototype.$off = function (t, e) {
              var n = this;
              if (!arguments.length)
                return (n._events = Object.create(null)), n;
              if (Array.isArray(t)) {
                for (var r = 0, o = t.length; r < o; r++) n.$off(t[r], e);
                return n;
              }
              var i,
                a = n._events[t];
              if (!a) return n;
              if (!e) return (n._events[t] = null), n;
              for (var s = a.length; s--; )
                if ((i = a[s]) === e || i.fn === e) {
                  a.splice(s, 1);
                  break;
                }
              return n;
            }),
            (t.prototype.$emit = function (t) {
              var e = this,
                n = e._events[t];
              if (n) {
                n = n.length > 1 ? T(n) : n;
                for (
                  var r = T(arguments, 1),
                    o = 'event handler for "' + t + '"',
                    i = 0,
                    a = n.length;
                  i < a;
                  i++
                )
                  $e(n[i], e, r, e, o);
              }
              return e;
            });
        }
        var cr = null,
          ur = !1;
        function lr(t) {
          var e = cr;
          return (
            (cr = t),
            function () {
              cr = e;
            }
          );
        }
        function fr(t) {
          var e = t.$options,
            n = e.parent;
          if (n && !e.abstract) {
            for (; n.$options.abstract && n.$parent; ) n = n.$parent;
            n.$children.push(t);
          }
          (t.$parent = n),
            (t.$root = n ? n.$root : t),
            (t.$children = []),
            (t.$refs = {}),
            (t._watcher = null),
            (t._inactive = null),
            (t._directInactive = !1),
            (t._isMounted = !1),
            (t._isDestroyed = !1),
            (t._isBeingDestroyed = !1);
        }
        function pr(t) {
          (t.prototype._update = function (t, e) {
            var n = this,
              r = n.$el,
              o = n._vnode,
              i = lr(n);
            (n._vnode = t),
              (n.$el = o ? n.__patch__(o, t) : n.__patch__(n.$el, t, e, !1)),
              i(),
              r && (r.__vue__ = null),
              n.$el && (n.$el.__vue__ = n),
              n.$vnode &&
                n.$parent &&
                n.$vnode === n.$parent._vnode &&
                (n.$parent.$el = n.$el);
          }),
            (t.prototype.$forceUpdate = function () {
              this._watcher && this._watcher.update();
            }),
            (t.prototype.$destroy = function () {
              var t = this;
              if (!t._isBeingDestroyed) {
                gr(t, "beforeDestroy"), (t._isBeingDestroyed = !0);
                var e = t.$parent;
                !e ||
                  e._isBeingDestroyed ||
                  t.$options.abstract ||
                  _(e.$children, t),
                  t._watcher && t._watcher.teardown();
                for (var n = t._watchers.length; n--; )
                  t._watchers[n].teardown();
                t._data.__ob__ && t._data.__ob__.vmCount--,
                  (t._isDestroyed = !0),
                  t.__patch__(t._vnode, null),
                  gr(t, "destroyed"),
                  t.$off(),
                  t.$el && (t.$el.__vue__ = null),
                  t.$vnode && (t.$vnode.parent = null);
              }
            });
        }
        function dr(t, e, n) {
          var r;
          return (
            (t.$el = e),
            t.$options.render || (t.$options.render = It),
            gr(t, "beforeMount"),
            (r = function () {
              t._update(t._render(), n);
            }),
            new Mr(
              t,
              r,
              N,
              {
                before: function () {
                  t._isMounted && !t._isDestroyed && gr(t, "beforeUpdate");
                },
              },
              !0
            ),
            (n = !1),
            null == t.$vnode && ((t._isMounted = !0), gr(t, "mounted")),
            t
          );
        }
        function vr(t, n, r, o, i) {
          var a = o.data.scopedSlots,
            s = t.$scopedSlots,
            c = !!(
              (a && !a.$stable) ||
              (s !== e && !s.$stable) ||
              (a && t.$scopedSlots.$key !== a.$key)
            ),
            u = !!(i || t.$options._renderChildren || c);
          if (
            ((t.$options._parentVnode = o),
            (t.$vnode = o),
            t._vnode && (t._vnode.parent = o),
            (t.$options._renderChildren = i),
            (t.$attrs = o.data.attrs || e),
            (t.$listeners = r || e),
            n && t.$options.props)
          ) {
            Ht(!1);
            for (
              var l = t._props, f = t.$options._propKeys || [], p = 0;
              p < f.length;
              p++
            ) {
              var d = f[p],
                v = t.$options.props;
              l[d] = le(d, v, n, t);
            }
            Ht(!0), (t.$options.propsData = n);
          }
          r = r || e;
          var h = t.$options._parentListeners;
          (t.$options._parentListeners = r),
            ar(t, r, h),
            u && ((t.$slots = ln(i, o.context)), t.$forceUpdate());
        }
        function hr(t) {
          for (; t && (t = t.$parent); ) if (t._inactive) return !0;
          return !1;
        }
        function mr(t, e) {
          if (e) {
            if (((t._directInactive = !1), hr(t))) return;
          } else if (t._directInactive) return;
          if (t._inactive || null === t._inactive) {
            t._inactive = !1;
            for (var n = 0; n < t.$children.length; n++) mr(t.$children[n]);
            gr(t, "activated");
          }
        }
        function yr(t, e) {
          if (!((e && ((t._directInactive = !0), hr(t))) || t._inactive)) {
            t._inactive = !0;
            for (var n = 0; n < t.$children.length; n++) yr(t.$children[n]);
            gr(t, "deactivated");
          }
        }
        function gr(t, e) {
          St();
          var n = t.$options[e],
            r = e + " hook";
          if (n)
            for (var o = 0, i = n.length; o < i; o++) $e(n[o], t, null, t, r);
          t._hasHookEvent && t.$emit("hook:" + e), jt();
        }
        var _r = 100,
          br = [],
          Cr = [],
          wr = {},
          $r = {},
          Ar = !1,
          xr = !1,
          Or = 0;
        function kr() {
          (Or = br.length = Cr.length = 0), (wr = {}), (Ar = xr = !1);
        }
        var Sr = 0,
          jr = Date.now;
        if (J && !et) {
          var Er = window.performance;
          Er &&
            "function" == typeof Er.now &&
            jr() > document.createEvent("Event").timeStamp &&
            (jr = function () {
              return Er.now();
            });
        }
        function Tr() {
          var t, e;
          for (
            Sr = jr(),
              xr = !0,
              br.sort(function (t, e) {
                return t.id - e.id;
              }),
              Or = 0;
            Or < br.length;
            Or++
          )
            (t = br[Or]).before && t.before(),
              (e = t.id),
              (wr[e] = null),
              t.run();
          var n = Cr.slice(),
            r = br.slice();
          kr(), Nr(n), Ir(r), dt && z.devtools && dt.emit("flush");
        }
        function Ir(t) {
          for (var e = t.length; e--; ) {
            var n = t[e],
              r = n.vm;
            r._watcher === n &&
              r._isMounted &&
              !r._isDestroyed &&
              gr(r, "updated");
          }
        }
        function Dr(t) {
          (t._inactive = !1), Cr.push(t);
        }
        function Nr(t) {
          for (var e = 0; e < t.length; e++)
            (t[e]._inactive = !0), mr(t[e], !0);
        }
        function Lr(t) {
          var e = t.id;
          if (null == wr[e]) {
            if (((wr[e] = !0), xr)) {
              for (var n = br.length - 1; n > Or && br[n].id > t.id; ) n--;
              br.splice(n + 1, 0, t);
            } else br.push(t);
            Ar || ((Ar = !0), ze(Tr));
          }
        }
        var Pr = 0,
          Mr = function (t, e, n, r, o) {
            (this.vm = t),
              o && (t._watcher = this),
              t._watchers.push(this),
              r
                ? ((this.deep = !!r.deep),
                  (this.user = !!r.user),
                  (this.lazy = !!r.lazy),
                  (this.sync = !!r.sync),
                  (this.before = r.before))
                : (this.deep = this.user = this.lazy = this.sync = !1),
              (this.cb = n),
              (this.id = ++Pr),
              (this.active = !0),
              (this.dirty = this.lazy),
              (this.deps = []),
              (this.newDeps = []),
              (this.depIds = new ht()),
              (this.newDepIds = new ht()),
              (this.expression = ""),
              "function" == typeof e
                ? (this.getter = e)
                : ((this.getter = X(e)), this.getter || (this.getter = N)),
              (this.value = this.lazy ? void 0 : this.get());
          };
        (Mr.prototype.get = function () {
          var t;
          St(this);
          var e = this.vm;
          try {
            t = this.getter.call(e, e);
          } catch (as) {
            if (!this.user) throw as;
            we(as, e, 'getter for watcher "' + this.expression + '"');
          } finally {
            this.deep && Xe(t), jt(), this.cleanupDeps();
          }
          return t;
        }),
          (Mr.prototype.addDep = function (t) {
            var e = t.id;
            this.newDepIds.has(e) ||
              (this.newDepIds.add(e),
              this.newDeps.push(t),
              this.depIds.has(e) || t.addSub(this));
          }),
          (Mr.prototype.cleanupDeps = function () {
            for (var t = this.deps.length; t--; ) {
              var e = this.deps[t];
              this.newDepIds.has(e.id) || e.removeSub(this);
            }
            var n = this.depIds;
            (this.depIds = this.newDepIds),
              (this.newDepIds = n),
              this.newDepIds.clear(),
              (n = this.deps),
              (this.deps = this.newDeps),
              (this.newDeps = n),
              (this.newDeps.length = 0);
          }),
          (Mr.prototype.update = function () {
            this.lazy ? (this.dirty = !0) : this.sync ? this.run() : Lr(this);
          }),
          (Mr.prototype.run = function () {
            if (this.active) {
              var t = this.get();
              if (t !== this.value || s(t) || this.deep) {
                var e = this.value;
                if (((this.value = t), this.user))
                  try {
                    this.cb.call(this.vm, t, e);
                  } catch (as) {
                    we(
                      as,
                      this.vm,
                      'callback for watcher "' + this.expression + '"'
                    );
                  }
                else this.cb.call(this.vm, t, e);
              }
            }
          }),
          (Mr.prototype.evaluate = function () {
            (this.value = this.get()), (this.dirty = !1);
          }),
          (Mr.prototype.depend = function () {
            for (var t = this.deps.length; t--; ) this.deps[t].depend();
          }),
          (Mr.prototype.teardown = function () {
            if (this.active) {
              this.vm._isBeingDestroyed || _(this.vm._watchers, this);
              for (var t = this.deps.length; t--; )
                this.deps[t].removeSub(this);
              this.active = !1;
            }
          });
        var Fr = { enumerable: !0, configurable: !0, get: N, set: N };
        function Rr(t, e, n) {
          (Fr.get = function () {
            return this[e][n];
          }),
            (Fr.set = function (t) {
              this[e][n] = t;
            }),
            Object.defineProperty(t, n, Fr);
        }
        function Hr(t) {
          t._watchers = [];
          var e = t.$options;
          e.props && Ur(t, e.props),
            e.methods && Gr(t, e.methods),
            e.data ? Br(t) : Vt((t._data = {}), !0),
            e.computed && Wr(t, e.computed),
            e.watch && e.watch !== ut && Zr(t, e.watch);
        }
        function Ur(t, e) {
          var n = t.$options.propsData || {},
            r = (t._props = {}),
            o = (t.$options._propKeys = []),
            i = !t.$parent;
          i || Ht(!1);
          var a = function (i) {
            o.push(i);
            var a = le(i, e, n, t);
            Wt(r, i, a), i in t || Rr(t, "_props", i);
          };
          for (var s in e) a(s);
          Ht(!0);
        }
        function Br(t) {
          var e = t.$options.data;
          l((e = t._data = "function" == typeof e ? zr(e, t) : e || {})) ||
            (e = {});
          for (
            var n = Object.keys(e),
              r = t.$options.props,
              o = (t.$options.methods, n.length);
            o--;

          ) {
            var i = n[o];
            0, (r && C(r, i)) || W(i) || Rr(t, "_data", i);
          }
          Vt(e, !0);
        }
        function zr(t, e) {
          St();
          try {
            return t.call(e, e);
          } catch (as) {
            return we(as, e, "data()"), {};
          } finally {
            jt();
          }
        }
        var Vr = { lazy: !0 };
        function Wr(t, e) {
          var n = (t._computedWatchers = Object.create(null)),
            r = pt();
          for (var o in e) {
            var i = e[o],
              a = "function" == typeof i ? i : i.get;
            0, r || (n[o] = new Mr(t, a || N, N, Vr)), o in t || qr(t, o, i);
          }
        }
        function qr(t, e, n) {
          var r = !pt();
          "function" == typeof n
            ? ((Fr.get = r ? Kr(e) : Xr(n)), (Fr.set = N))
            : ((Fr.get = n.get ? (r && !1 !== n.cache ? Kr(e) : Xr(n.get)) : N),
              (Fr.set = n.set || N)),
            Object.defineProperty(t, e, Fr);
        }
        function Kr(t) {
          return function () {
            var e = this._computedWatchers && this._computedWatchers[t];
            if (e)
              return e.dirty && e.evaluate(), Ot.target && e.depend(), e.value;
          };
        }
        function Xr(t) {
          return function () {
            return t.call(this, this);
          };
        }
        function Gr(t, e) {
          t.$options.props;
          for (var n in e) t[n] = "function" != typeof e[n] ? N : E(e[n], t);
        }
        function Zr(t, e) {
          for (var n in e) {
            var r = e[n];
            if (Array.isArray(r))
              for (var o = 0; o < r.length; o++) Jr(t, n, r[o]);
            else Jr(t, n, r);
          }
        }
        function Jr(t, e, n, r) {
          return (
            l(n) && ((r = n), (n = n.handler)),
            "string" == typeof n && (n = t[n]),
            t.$watch(e, n, r)
          );
        }
        function Qr(t) {
          var e = {
              get: function () {
                return this._data;
              },
            },
            n = {
              get: function () {
                return this._props;
              },
            };
          Object.defineProperty(t.prototype, "$data", e),
            Object.defineProperty(t.prototype, "$props", n),
            (t.prototype.$set = qt),
            (t.prototype.$delete = Kt),
            (t.prototype.$watch = function (t, e, n) {
              if (l(e)) return Jr(this, t, e, n);
              (n = n || {}).user = !0;
              var r = new Mr(this, t, e, n);
              if (n.immediate)
                try {
                  e.call(this, r.value);
                } catch (o) {
                  we(
                    o,
                    this,
                    'callback for immediate watcher "' + r.expression + '"'
                  );
                }
              return function () {
                r.teardown();
              };
            });
        }
        var Yr = 0;
        function to(t) {
          t.prototype._init = function (t) {
            var e = this;
            (e._uid = Yr++),
              (e._isVue = !0),
              t && t._isComponent
                ? eo(e, t)
                : (e.$options = ce(no(e.constructor), t || {}, e)),
              (e._renderProxy = e),
              (e._self = e),
              fr(e),
              nr(e),
              Kn(e),
              gr(e, "beforeCreate"),
              cn(e),
              Hr(e),
              sn(e),
              gr(e, "created"),
              e.$options.el && e.$mount(e.$options.el);
          };
        }
        function eo(t, e) {
          var n = (t.$options = Object.create(t.constructor.options)),
            r = e._parentVnode;
          (n.parent = e.parent), (n._parentVnode = r);
          var o = r.componentOptions;
          (n.propsData = o.propsData),
            (n._parentListeners = o.listeners),
            (n._renderChildren = o.children),
            (n._componentTag = o.tag),
            e.render &&
              ((n.render = e.render), (n.staticRenderFns = e.staticRenderFns));
        }
        function no(t) {
          var e = t.options;
          if (t.super) {
            var n = no(t.super);
            if (n !== t.superOptions) {
              t.superOptions = n;
              var r = ro(t);
              r && I(t.extendOptions, r),
                (e = t.options = ce(n, t.extendOptions)).name &&
                  (e.components[e.name] = t);
            }
          }
          return e;
        }
        function ro(t) {
          var e,
            n = t.options,
            r = t.sealedOptions;
          for (var o in n) n[o] !== r[o] && (e || (e = {}), (e[o] = n[o]));
          return e;
        }
        function oo(t) {
          this._init(t);
        }
        function io(t) {
          t.use = function (t) {
            var e = this._installedPlugins || (this._installedPlugins = []);
            if (e.indexOf(t) > -1) return this;
            var n = T(arguments, 1);
            return (
              n.unshift(this),
              "function" == typeof t.install
                ? t.install.apply(t, n)
                : "function" == typeof t && t.apply(null, n),
              e.push(t),
              this
            );
          };
        }
        function ao(t) {
          t.mixin = function (t) {
            return (this.options = ce(this.options, t)), this;
          };
        }
        function so(t) {
          t.cid = 0;
          var e = 1;
          t.extend = function (t) {
            t = t || {};
            var n = this,
              r = n.cid,
              o = t._Ctor || (t._Ctor = {});
            if (o[r]) return o[r];
            var i = t.name || n.options.name;
            var a = function (t) {
              this._init(t);
            };
            return (
              ((a.prototype = Object.create(n.prototype)).constructor = a),
              (a.cid = e++),
              (a.options = ce(n.options, t)),
              (a.super = n),
              a.options.props && co(a),
              a.options.computed && uo(a),
              (a.extend = n.extend),
              (a.mixin = n.mixin),
              (a.use = n.use),
              U.forEach(function (t) {
                a[t] = n[t];
              }),
              i && (a.options.components[i] = a),
              (a.superOptions = n.options),
              (a.extendOptions = t),
              (a.sealedOptions = I({}, a.options)),
              (o[r] = a),
              a
            );
          };
        }
        function co(t) {
          var e = t.options.props;
          for (var n in e) Rr(t.prototype, "_props", n);
        }
        function uo(t) {
          var e = t.options.computed;
          for (var n in e) qr(t.prototype, n, e[n]);
        }
        function lo(t) {
          U.forEach(function (e) {
            t[e] = function (t, n) {
              return n
                ? ("component" === e &&
                    l(n) &&
                    ((n.name = n.name || t),
                    (n = this.options._base.extend(n))),
                  "directive" === e &&
                    "function" == typeof n &&
                    (n = { bind: n, update: n }),
                  (this.options[e + "s"][t] = n),
                  n)
                : this.options[e + "s"][t];
            };
          });
        }
        function fo(t) {
          return t && (t.Ctor.options.name || t.tag);
        }
        function po(t, e) {
          return Array.isArray(t)
            ? t.indexOf(e) > -1
            : "string" == typeof t
            ? t.split(",").indexOf(e) > -1
            : !!f(t) && t.test(e);
        }
        function vo(t, e) {
          var n = t.cache,
            r = t.keys,
            o = t._vnode;
          for (var i in n) {
            var a = n[i];
            if (a) {
              var s = fo(a.componentOptions);
              s && !e(s) && ho(n, i, r, o);
            }
          }
        }
        function ho(t, e, n, r) {
          var o = t[e];
          !o || (r && o.tag === r.tag) || o.componentInstance.$destroy(),
            (t[e] = null),
            _(n, e);
        }
        to(oo), Qr(oo), sr(oo), pr(oo), Zn(oo);
        var mo = [String, RegExp, Array],
          yo = {
            name: "keep-alive",
            abstract: !0,
            props: { include: mo, exclude: mo, max: [String, Number] },
            created: function () {
              (this.cache = Object.create(null)), (this.keys = []);
            },
            destroyed: function () {
              for (var t in this.cache) ho(this.cache, t, this.keys);
            },
            mounted: function () {
              var t = this;
              this.$watch("include", function (e) {
                vo(t, function (t) {
                  return po(e, t);
                });
              }),
                this.$watch("exclude", function (e) {
                  vo(t, function (t) {
                    return !po(e, t);
                  });
                });
            },
            render: function () {
              var t = this.$slots.default,
                e = er(t),
                n = e && e.componentOptions;
              if (n) {
                var r = fo(n),
                  o = this.include,
                  i = this.exclude;
                if ((o && (!r || !po(o, r))) || (i && r && po(i, r))) return e;
                var a = this.cache,
                  s = this.keys,
                  c =
                    null == e.key
                      ? n.Ctor.cid + (n.tag ? "::" + n.tag : "")
                      : e.key;
                a[c]
                  ? ((e.componentInstance = a[c].componentInstance),
                    _(s, c),
                    s.push(c))
                  : ((a[c] = e),
                    s.push(c),
                    this.max &&
                      s.length > parseInt(this.max) &&
                      ho(a, s[0], s, this._vnode)),
                  (e.data.keepAlive = !0);
              }
              return e || (t && t[0]);
            },
          },
          go = { KeepAlive: yo };
        function _o(t) {
          var e = {
            get: function () {
              return z;
            },
          };
          Object.defineProperty(t, "config", e),
            (t.util = {
              warn: Ct,
              extend: I,
              mergeOptions: ce,
              defineReactive: Wt,
            }),
            (t.set = qt),
            (t.delete = Kt),
            (t.nextTick = ze),
            (t.observable = function (t) {
              return Vt(t), t;
            }),
            (t.options = Object.create(null)),
            U.forEach(function (e) {
              t.options[e + "s"] = Object.create(null);
            }),
            (t.options._base = t),
            I(t.options.components, go),
            io(t),
            ao(t),
            so(t),
            lo(t);
        }
        _o(oo),
          Object.defineProperty(oo.prototype, "$isServer", { get: pt }),
          Object.defineProperty(oo.prototype, "$ssrContext", {
            get: function () {
              return this.$vnode && this.$vnode.ssrContext;
            },
          }),
          Object.defineProperty(oo, "FunctionalRenderContext", { value: En }),
          (oo.version = "2.6.11");
        var bo = m("style,class"),
          Co = m("input,textarea,option,select,progress"),
          wo = function (t, e, n) {
            return (
              ("value" === n && Co(t) && "button" !== e) ||
              ("selected" === n && "option" === t) ||
              ("checked" === n && "input" === t) ||
              ("muted" === n && "video" === t)
            );
          },
          $o = m("contenteditable,draggable,spellcheck"),
          Ao = m("events,caret,typing,plaintext-only"),
          xo = function (t, e) {
            return Eo(e) || "false" === e
              ? "false"
              : "contenteditable" === t && Ao(e)
              ? e
              : "true";
          },
          Oo = m(
            "allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"
          ),
          ko = "http://www.w3.org/1999/xlink",
          So = function (t) {
            return ":" === t.charAt(5) && "xlink" === t.slice(0, 5);
          },
          jo = function (t) {
            return So(t) ? t.slice(6, t.length) : "";
          },
          Eo = function (t) {
            return null == t || !1 === t;
          };
        function To(t) {
          for (var e = t.data, n = t, o = t; r(o.componentInstance); )
            (o = o.componentInstance._vnode) && o.data && (e = Io(o.data, e));
          for (; r((n = n.parent)); ) n && n.data && (e = Io(e, n.data));
          return Do(e.staticClass, e.class);
        }
        function Io(t, e) {
          return {
            staticClass: No(t.staticClass, e.staticClass),
            class: r(t.class) ? [t.class, e.class] : e.class,
          };
        }
        function Do(t, e) {
          return r(t) || r(e) ? No(t, Lo(e)) : "";
        }
        function No(t, e) {
          return t ? (e ? t + " " + e : t) : e || "";
        }
        function Lo(t) {
          return Array.isArray(t)
            ? Po(t)
            : s(t)
            ? Mo(t)
            : "string" == typeof t
            ? t
            : "";
        }
        function Po(t) {
          for (var e, n = "", o = 0, i = t.length; o < i; o++)
            r((e = Lo(t[o]))) && "" !== e && (n && (n += " "), (n += e));
          return n;
        }
        function Mo(t) {
          var e = "";
          for (var n in t) t[n] && (e && (e += " "), (e += n));
          return e;
        }
        var Fo = {
            svg: "http://www.w3.org/2000/svg",
            math: "http://www.w3.org/1998/Math/MathML",
          },
          Ro = m(
            "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"
          ),
          Ho = m(
            "svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",
            !0
          ),
          Uo = function (t) {
            return Ro(t) || Ho(t);
          };
        function Bo(t) {
          return Ho(t) ? "svg" : "math" === t ? "math" : void 0;
        }
        var zo = Object.create(null);
        function Vo(t) {
          if (!J) return !0;
          if (Uo(t)) return !1;
          if (((t = t.toLowerCase()), null != zo[t])) return zo[t];
          var e = document.createElement(t);
          return t.indexOf("-") > -1
            ? (zo[t] =
                e.constructor === window.HTMLUnknownElement ||
                e.constructor === window.HTMLElement)
            : (zo[t] = /HTMLUnknownElement/.test(e.toString()));
        }
        var Wo = m("text,number,password,search,email,tel,url");
        function qo(t) {
          if ("string" == typeof t) {
            var e = document.querySelector(t);
            return e || document.createElement("div");
          }
          return t;
        }
        function Ko(t, e) {
          var n = document.createElement(t);
          return "select" !== t
            ? n
            : (e.data &&
                e.data.attrs &&
                void 0 !== e.data.attrs.multiple &&
                n.setAttribute("multiple", "multiple"),
              n);
        }
        function Xo(t, e) {
          return document.createElementNS(Fo[t], e);
        }
        function Go(t) {
          return document.createTextNode(t);
        }
        function Zo(t) {
          return document.createComment(t);
        }
        function Jo(t, e, n) {
          t.insertBefore(e, n);
        }
        function Qo(t, e) {
          t.removeChild(e);
        }
        function Yo(t, e) {
          t.appendChild(e);
        }
        function ti(t) {
          return t.parentNode;
        }
        function ei(t) {
          return t.nextSibling;
        }
        function ni(t) {
          return t.tagName;
        }
        function ri(t, e) {
          t.textContent = e;
        }
        function oi(t, e) {
          t.setAttribute(e, "");
        }
        var ii = Object.freeze({
            createElement: Ko,
            createElementNS: Xo,
            createTextNode: Go,
            createComment: Zo,
            insertBefore: Jo,
            removeChild: Qo,
            appendChild: Yo,
            parentNode: ti,
            nextSibling: ei,
            tagName: ni,
            setTextContent: ri,
            setStyleScope: oi,
          }),
          ai = {
            create: function (t, e) {
              si(e);
            },
            update: function (t, e) {
              t.data.ref !== e.data.ref && (si(t, !0), si(e));
            },
            destroy: function (t) {
              si(t, !0);
            },
          };
        function si(t, e) {
          var n = t.data.ref;
          if (r(n)) {
            var o = t.context,
              i = t.componentInstance || t.elm,
              a = o.$refs;
            e
              ? Array.isArray(a[n])
                ? _(a[n], i)
                : a[n] === i && (a[n] = void 0)
              : t.data.refInFor
              ? Array.isArray(a[n])
                ? a[n].indexOf(i) < 0 && a[n].push(i)
                : (a[n] = [i])
              : (a[n] = i);
          }
        }
        var ci = new Et("", {}, []),
          ui = ["create", "activate", "update", "remove", "destroy"];
        function li(t, e) {
          return (
            t.key === e.key &&
            ((t.tag === e.tag &&
              t.isComment === e.isComment &&
              r(t.data) === r(e.data) &&
              fi(t, e)) ||
              (o(t.isAsyncPlaceholder) &&
                t.asyncFactory === e.asyncFactory &&
                n(e.asyncFactory.error)))
          );
        }
        function fi(t, e) {
          if ("input" !== t.tag) return !0;
          var n,
            o = r((n = t.data)) && r((n = n.attrs)) && n.type,
            i = r((n = e.data)) && r((n = n.attrs)) && n.type;
          return o === i || (Wo(o) && Wo(i));
        }
        function pi(t, e, n) {
          var o,
            i,
            a = {};
          for (o = e; o <= n; ++o) r((i = t[o].key)) && (a[i] = o);
          return a;
        }
        function di(t) {
          var e,
            i,
            s = {},
            c = t.modules,
            u = t.nodeOps;
          for (e = 0; e < ui.length; ++e)
            for (s[ui[e]] = [], i = 0; i < c.length; ++i)
              r(c[i][ui[e]]) && s[ui[e]].push(c[i][ui[e]]);
          function l(t) {
            var e = u.parentNode(t);
            r(e) && u.removeChild(e, t);
          }
          function f(t, e, n, i, a, c, l) {
            if (
              (r(t.elm) && r(c) && (t = c[l] = Nt(t)),
              (t.isRootInsert = !a),
              !(function (t, e, n, i) {
                var a = t.data;
                if (r(a)) {
                  var c = r(t.componentInstance) && a.keepAlive;
                  if (
                    (r((a = a.hook)) && r((a = a.init)) && a(t, !1),
                    r(t.componentInstance))
                  )
                    return (
                      p(t, e),
                      d(n, t.elm, i),
                      o(c) &&
                        (function (t, e, n, o) {
                          var i,
                            a = t;
                          for (; a.componentInstance; )
                            if (
                              ((a = a.componentInstance._vnode),
                              r((i = a.data)) && r((i = i.transition)))
                            ) {
                              for (i = 0; i < s.activate.length; ++i)
                                s.activate[i](ci, a);
                              e.push(a);
                              break;
                            }
                          d(n, t.elm, o);
                        })(t, e, n, i),
                      !0
                    );
                }
              })(t, e, n, i))
            ) {
              var f = t.data,
                h = t.children,
                m = t.tag;
              r(m)
                ? ((t.elm = t.ns
                    ? u.createElementNS(t.ns, m)
                    : u.createElement(m, t)),
                  g(t),
                  v(t, h, e),
                  r(f) && y(t, e),
                  d(n, t.elm, i))
                : o(t.isComment)
                ? ((t.elm = u.createComment(t.text)), d(n, t.elm, i))
                : ((t.elm = u.createTextNode(t.text)), d(n, t.elm, i));
            }
          }
          function p(t, e) {
            r(t.data.pendingInsert) &&
              (e.push.apply(e, t.data.pendingInsert),
              (t.data.pendingInsert = null)),
              (t.elm = t.componentInstance.$el),
              h(t) ? (y(t, e), g(t)) : (si(t), e.push(t));
          }
          function d(t, e, n) {
            r(t) &&
              (r(n)
                ? u.parentNode(n) === t && u.insertBefore(t, e, n)
                : u.appendChild(t, e));
          }
          function v(t, e, n) {
            if (Array.isArray(e)) {
              0;
              for (var r = 0; r < e.length; ++r)
                f(e[r], n, t.elm, null, !0, e, r);
            } else
              a(t.text) &&
                u.appendChild(t.elm, u.createTextNode(String(t.text)));
          }
          function h(t) {
            for (; t.componentInstance; ) t = t.componentInstance._vnode;
            return r(t.tag);
          }
          function y(t, n) {
            for (var o = 0; o < s.create.length; ++o) s.create[o](ci, t);
            r((e = t.data.hook)) &&
              (r(e.create) && e.create(ci, t), r(e.insert) && n.push(t));
          }
          function g(t) {
            var e;
            if (r((e = t.fnScopeId))) u.setStyleScope(t.elm, e);
            else
              for (var n = t; n; )
                r((e = n.context)) &&
                  r((e = e.$options._scopeId)) &&
                  u.setStyleScope(t.elm, e),
                  (n = n.parent);
            r((e = cr)) &&
              e !== t.context &&
              e !== t.fnContext &&
              r((e = e.$options._scopeId)) &&
              u.setStyleScope(t.elm, e);
          }
          function _(t, e, n, r, o, i) {
            for (; r <= o; ++r) f(n[r], i, t, e, !1, n, r);
          }
          function b(t) {
            var e,
              n,
              o = t.data;
            if (r(o))
              for (
                r((e = o.hook)) && r((e = e.destroy)) && e(t), e = 0;
                e < s.destroy.length;
                ++e
              )
                s.destroy[e](t);
            if (r((e = t.children)))
              for (n = 0; n < t.children.length; ++n) b(t.children[n]);
          }
          function C(t, e, n) {
            for (; e <= n; ++e) {
              var o = t[e];
              r(o) && (r(o.tag) ? (w(o), b(o)) : l(o.elm));
            }
          }
          function w(t, e) {
            if (r(e) || r(t.data)) {
              var n,
                o = s.remove.length + 1;
              for (
                r(e)
                  ? (e.listeners += o)
                  : (e = (function (t, e) {
                      function n() {
                        0 == --n.listeners && l(t);
                      }
                      return (n.listeners = e), n;
                    })(t.elm, o)),
                  r((n = t.componentInstance)) &&
                    r((n = n._vnode)) &&
                    r(n.data) &&
                    w(n, e),
                  n = 0;
                n < s.remove.length;
                ++n
              )
                s.remove[n](t, e);
              r((n = t.data.hook)) && r((n = n.remove)) ? n(t, e) : e();
            } else l(t.elm);
          }
          function $(t, e, n, o) {
            for (var i = n; i < o; i++) {
              var a = e[i];
              if (r(a) && li(t, a)) return i;
            }
          }
          function A(t, e, i, a, c, l) {
            if (t !== e) {
              r(e.elm) && r(a) && (e = a[c] = Nt(e));
              var p = (e.elm = t.elm);
              if (o(t.isAsyncPlaceholder))
                r(e.asyncFactory.resolved)
                  ? k(t.elm, e, i)
                  : (e.isAsyncPlaceholder = !0);
              else if (
                o(e.isStatic) &&
                o(t.isStatic) &&
                e.key === t.key &&
                (o(e.isCloned) || o(e.isOnce))
              )
                e.componentInstance = t.componentInstance;
              else {
                var d,
                  v = e.data;
                r(v) && r((d = v.hook)) && r((d = d.prepatch)) && d(t, e);
                var m = t.children,
                  y = e.children;
                if (r(v) && h(e)) {
                  for (d = 0; d < s.update.length; ++d) s.update[d](t, e);
                  r((d = v.hook)) && r((d = d.update)) && d(t, e);
                }
                n(e.text)
                  ? r(m) && r(y)
                    ? m !== y &&
                      (function (t, e, o, i, a) {
                        var s,
                          c,
                          l,
                          p = 0,
                          d = 0,
                          v = e.length - 1,
                          h = e[0],
                          m = e[v],
                          y = o.length - 1,
                          g = o[0],
                          b = o[y],
                          w = !a;
                        for (; p <= v && d <= y; )
                          n(h)
                            ? (h = e[++p])
                            : n(m)
                            ? (m = e[--v])
                            : li(h, g)
                            ? (A(h, g, i, o, d), (h = e[++p]), (g = o[++d]))
                            : li(m, b)
                            ? (A(m, b, i, o, y), (m = e[--v]), (b = o[--y]))
                            : li(h, b)
                            ? (A(h, b, i, o, y),
                              w &&
                                u.insertBefore(t, h.elm, u.nextSibling(m.elm)),
                              (h = e[++p]),
                              (b = o[--y]))
                            : li(m, g)
                            ? (A(m, g, i, o, d),
                              w && u.insertBefore(t, m.elm, h.elm),
                              (m = e[--v]),
                              (g = o[++d]))
                            : (n(s) && (s = pi(e, p, v)),
                              n((c = r(g.key) ? s[g.key] : $(g, e, p, v)))
                                ? f(g, i, t, h.elm, !1, o, d)
                                : li((l = e[c]), g)
                                ? (A(l, g, i, o, d),
                                  (e[c] = void 0),
                                  w && u.insertBefore(t, l.elm, h.elm))
                                : f(g, i, t, h.elm, !1, o, d),
                              (g = o[++d]));
                        p > v
                          ? _(t, n(o[y + 1]) ? null : o[y + 1].elm, o, d, y, i)
                          : d > y && C(e, p, v);
                      })(p, m, y, i, l)
                    : r(y)
                    ? (r(t.text) && u.setTextContent(p, ""),
                      _(p, null, y, 0, y.length - 1, i))
                    : r(m)
                    ? C(m, 0, m.length - 1)
                    : r(t.text) && u.setTextContent(p, "")
                  : t.text !== e.text && u.setTextContent(p, e.text),
                  r(v) && r((d = v.hook)) && r((d = d.postpatch)) && d(t, e);
              }
            }
          }
          function x(t, e, n) {
            if (o(n) && r(t.parent)) t.parent.data.pendingInsert = e;
            else for (var i = 0; i < e.length; ++i) e[i].data.hook.insert(e[i]);
          }
          var O = m("attrs,class,staticClass,staticStyle,key");
          function k(t, e, n, i) {
            var a,
              s = e.tag,
              c = e.data,
              u = e.children;
            if (
              ((i = i || (c && c.pre)),
              (e.elm = t),
              o(e.isComment) && r(e.asyncFactory))
            )
              return (e.isAsyncPlaceholder = !0), !0;
            if (
              r(c) &&
              (r((a = c.hook)) && r((a = a.init)) && a(e, !0),
              r((a = e.componentInstance)))
            )
              return p(e, n), !0;
            if (r(s)) {
              if (r(u))
                if (t.hasChildNodes())
                  if (
                    r((a = c)) &&
                    r((a = a.domProps)) &&
                    r((a = a.innerHTML))
                  ) {
                    if (a !== t.innerHTML) return !1;
                  } else {
                    for (
                      var l = !0, f = t.firstChild, d = 0;
                      d < u.length;
                      d++
                    ) {
                      if (!f || !k(f, u[d], n, i)) {
                        l = !1;
                        break;
                      }
                      f = f.nextSibling;
                    }
                    if (!l || f) return !1;
                  }
                else v(e, u, n);
              if (r(c)) {
                var h = !1;
                for (var m in c)
                  if (!O(m)) {
                    (h = !0), y(e, n);
                    break;
                  }
                !h && c.class && Xe(c.class);
              }
            } else t.data !== e.text && (t.data = e.text);
            return !0;
          }
          return function (t, e, i, a) {
            if (!n(e)) {
              var c,
                l = !1,
                p = [];
              if (n(t)) (l = !0), f(e, p);
              else {
                var d = r(t.nodeType);
                if (!d && li(t, e)) A(t, e, p, null, null, a);
                else {
                  if (d) {
                    if (
                      (1 === t.nodeType &&
                        t.hasAttribute(H) &&
                        (t.removeAttribute(H), (i = !0)),
                      o(i) && k(t, e, p))
                    )
                      return x(e, p, !0), t;
                    (c = t),
                      (t = new Et(
                        u.tagName(c).toLowerCase(),
                        {},
                        [],
                        void 0,
                        c
                      ));
                  }
                  var v = t.elm,
                    m = u.parentNode(v);
                  if (
                    (f(e, p, v._leaveCb ? null : m, u.nextSibling(v)),
                    r(e.parent))
                  )
                    for (var y = e.parent, g = h(e); y; ) {
                      for (var _ = 0; _ < s.destroy.length; ++_)
                        s.destroy[_](y);
                      if (((y.elm = e.elm), g)) {
                        for (var w = 0; w < s.create.length; ++w)
                          s.create[w](ci, y);
                        var $ = y.data.hook.insert;
                        if ($.merged)
                          for (var O = 1; O < $.fns.length; O++) $.fns[O]();
                      } else si(y);
                      y = y.parent;
                    }
                  r(m) ? C([t], 0, 0) : r(t.tag) && b(t);
                }
              }
              return x(e, p, l), e.elm;
            }
            r(t) && b(t);
          };
        }
        var vi = {
          create: hi,
          update: hi,
          destroy: function (t) {
            hi(t, ci);
          },
        };
        function hi(t, e) {
          (t.data.directives || e.data.directives) && mi(t, e);
        }
        function mi(t, e) {
          var n,
            r,
            o,
            i = t === ci,
            a = e === ci,
            s = gi(t.data.directives, t.context),
            c = gi(e.data.directives, e.context),
            u = [],
            l = [];
          for (n in c)
            (r = s[n]),
              (o = c[n]),
              r
                ? ((o.oldValue = r.value),
                  (o.oldArg = r.arg),
                  bi(o, "update", e, t),
                  o.def && o.def.componentUpdated && l.push(o))
                : (bi(o, "bind", e, t), o.def && o.def.inserted && u.push(o));
          if (u.length) {
            var f = function () {
              for (var n = 0; n < u.length; n++) bi(u[n], "inserted", e, t);
            };
            i ? Ye(e, "insert", f) : f();
          }
          if (
            (l.length &&
              Ye(e, "postpatch", function () {
                for (var n = 0; n < l.length; n++)
                  bi(l[n], "componentUpdated", e, t);
              }),
            !i)
          )
            for (n in s) c[n] || bi(s[n], "unbind", t, t, a);
        }
        var yi = Object.create(null);
        function gi(t, e) {
          var n,
            r,
            o = Object.create(null);
          if (!t) return o;
          for (n = 0; n < t.length; n++)
            (r = t[n]).modifiers || (r.modifiers = yi),
              (o[_i(r)] = r),
              (r.def = ue(e.$options, "directives", r.name, !0));
          return o;
        }
        function _i(t) {
          return (
            t.rawName || t.name + "." + Object.keys(t.modifiers || {}).join(".")
          );
        }
        function bi(t, e, n, r, o) {
          var i = t.def && t.def[e];
          if (i)
            try {
              i(n.elm, t, n, r, o);
            } catch (as) {
              we(as, n.context, "directive " + t.name + " " + e + " hook");
            }
        }
        var Ci = [ai, vi];
        function wi(t, e) {
          var o = e.componentOptions;
          if (
            !(
              (r(o) && !1 === o.Ctor.options.inheritAttrs) ||
              (n(t.data.attrs) && n(e.data.attrs))
            )
          ) {
            var i,
              a,
              s = e.elm,
              c = t.data.attrs || {},
              u = e.data.attrs || {};
            for (i in (r(u.__ob__) && (u = e.data.attrs = I({}, u)), u))
              (a = u[i]), c[i] !== a && $i(s, i, a);
            for (i in ((et || rt) &&
              u.value !== c.value &&
              $i(s, "value", u.value),
            c))
              n(u[i]) &&
                (So(i)
                  ? s.removeAttributeNS(ko, jo(i))
                  : $o(i) || s.removeAttribute(i));
          }
        }
        function $i(t, e, n) {
          t.tagName.indexOf("-") > -1
            ? Ai(t, e, n)
            : Oo(e)
            ? Eo(n)
              ? t.removeAttribute(e)
              : ((n =
                  "allowfullscreen" === e && "EMBED" === t.tagName
                    ? "true"
                    : e),
                t.setAttribute(e, n))
            : $o(e)
            ? t.setAttribute(e, xo(e, n))
            : So(e)
            ? Eo(n)
              ? t.removeAttributeNS(ko, jo(e))
              : t.setAttributeNS(ko, e, n)
            : Ai(t, e, n);
        }
        function Ai(t, e, n) {
          if (Eo(n)) t.removeAttribute(e);
          else {
            if (
              et &&
              !nt &&
              "TEXTAREA" === t.tagName &&
              "placeholder" === e &&
              "" !== n &&
              !t.__ieph
            ) {
              var r = function (e) {
                e.stopImmediatePropagation(), t.removeEventListener("input", r);
              };
              t.addEventListener("input", r), (t.__ieph = !0);
            }
            t.setAttribute(e, n);
          }
        }
        var xi = { create: wi, update: wi };
        function Oi(t, e) {
          var o = e.elm,
            i = e.data,
            a = t.data;
          if (
            !(
              n(i.staticClass) &&
              n(i.class) &&
              (n(a) || (n(a.staticClass) && n(a.class)))
            )
          ) {
            var s = To(e),
              c = o._transitionClasses;
            r(c) && (s = No(s, Lo(c))),
              s !== o._prevClass &&
                (o.setAttribute("class", s), (o._prevClass = s));
          }
        }
        var ki,
          Si = { create: Oi, update: Oi },
          ji = "__r",
          Ei = "__c";
        function Ti(t) {
          if (r(t[ji])) {
            var e = et ? "change" : "input";
            (t[e] = [].concat(t[ji], t[e] || [])), delete t[ji];
          }
          r(t[Ei]) &&
            ((t.change = [].concat(t[Ei], t.change || [])), delete t[Ei]);
        }
        function Ii(t, e, n) {
          var r = ki;
          return function o() {
            null !== e.apply(null, arguments) && Li(t, o, n, r);
          };
        }
        var Di = Le && !(ct && Number(ct[1]) <= 53);
        function Ni(t, e, n, r) {
          if (Di) {
            var o = Sr,
              i = e;
            e = i._wrapper = function (t) {
              if (
                t.target === t.currentTarget ||
                t.timeStamp >= o ||
                t.timeStamp <= 0 ||
                t.target.ownerDocument !== document
              )
                return i.apply(this, arguments);
            };
          }
          ki.addEventListener(t, e, lt ? { capture: n, passive: r } : n);
        }
        function Li(t, e, n, r) {
          (r || ki).removeEventListener(t, e._wrapper || e, n);
        }
        function Pi(t, e) {
          if (!n(t.data.on) || !n(e.data.on)) {
            var r = e.data.on || {},
              o = t.data.on || {};
            (ki = e.elm), Ti(r), Qe(r, o, Ni, Li, Ii, e.context), (ki = void 0);
          }
        }
        var Mi,
          Fi = { create: Pi, update: Pi };
        function Ri(t, e) {
          if (!n(t.data.domProps) || !n(e.data.domProps)) {
            var o,
              i,
              a = e.elm,
              s = t.data.domProps || {},
              c = e.data.domProps || {};
            for (o in (r(c.__ob__) && (c = e.data.domProps = I({}, c)), s))
              o in c || (a[o] = "");
            for (o in c) {
              if (((i = c[o]), "textContent" === o || "innerHTML" === o)) {
                if ((e.children && (e.children.length = 0), i === s[o]))
                  continue;
                1 === a.childNodes.length && a.removeChild(a.childNodes[0]);
              }
              if ("value" === o && "PROGRESS" !== a.tagName) {
                a._value = i;
                var u = n(i) ? "" : String(i);
                Hi(a, u) && (a.value = u);
              } else if ("innerHTML" === o && Ho(a.tagName) && n(a.innerHTML)) {
                (Mi = Mi || document.createElement("div")).innerHTML =
                  "<svg>" + i + "</svg>";
                for (var l = Mi.firstChild; a.firstChild; )
                  a.removeChild(a.firstChild);
                for (; l.firstChild; ) a.appendChild(l.firstChild);
              } else if (i !== s[o])
                try {
                  a[o] = i;
                } catch (as) {}
            }
          }
        }
        function Hi(t, e) {
          return (
            !t.composing && ("OPTION" === t.tagName || Ui(t, e) || Bi(t, e))
          );
        }
        function Ui(t, e) {
          var n = !0;
          try {
            n = document.activeElement !== t;
          } catch (as) {}
          return n && t.value !== e;
        }
        function Bi(t, e) {
          var n = t.value,
            o = t._vModifiers;
          if (r(o)) {
            if (o.number) return h(n) !== h(e);
            if (o.trim) return n.trim() !== e.trim();
          }
          return n !== e;
        }
        var zi = { create: Ri, update: Ri },
          Vi = w(function (t) {
            var e = {},
              n = /:(.+)/;
            return (
              t.split(/;(?![^(]*\))/g).forEach(function (t) {
                if (t) {
                  var r = t.split(n);
                  r.length > 1 && (e[r[0].trim()] = r[1].trim());
                }
              }),
              e
            );
          });
        function Wi(t) {
          var e = qi(t.style);
          return t.staticStyle ? I(t.staticStyle, e) : e;
        }
        function qi(t) {
          return Array.isArray(t) ? D(t) : "string" == typeof t ? Vi(t) : t;
        }
        function Ki(t, e) {
          var n,
            r = {};
          if (e)
            for (var o = t; o.componentInstance; )
              (o = o.componentInstance._vnode) &&
                o.data &&
                (n = Wi(o.data)) &&
                I(r, n);
          (n = Wi(t.data)) && I(r, n);
          for (var i = t; (i = i.parent); )
            i.data && (n = Wi(i.data)) && I(r, n);
          return r;
        }
        var Xi,
          Gi = /^--/,
          Zi = /\s*!important$/,
          Ji = function (t, e, n) {
            if (Gi.test(e)) t.style.setProperty(e, n);
            else if (Zi.test(n))
              t.style.setProperty(k(e), n.replace(Zi, ""), "important");
            else {
              var r = Yi(e);
              if (Array.isArray(n))
                for (var o = 0, i = n.length; o < i; o++) t.style[r] = n[o];
              else t.style[r] = n;
            }
          },
          Qi = ["Webkit", "Moz", "ms"],
          Yi = w(function (t) {
            if (
              ((Xi = Xi || document.createElement("div").style),
              "filter" !== (t = A(t)) && t in Xi)
            )
              return t;
            for (
              var e = t.charAt(0).toUpperCase() + t.slice(1), n = 0;
              n < Qi.length;
              n++
            ) {
              var r = Qi[n] + e;
              if (r in Xi) return r;
            }
          });
        function ta(t, e) {
          var o = e.data,
            i = t.data;
          if (
            !(n(o.staticStyle) && n(o.style) && n(i.staticStyle) && n(i.style))
          ) {
            var a,
              s,
              c = e.elm,
              u = i.staticStyle,
              l = i.normalizedStyle || i.style || {},
              f = u || l,
              p = qi(e.data.style) || {};
            e.data.normalizedStyle = r(p.__ob__) ? I({}, p) : p;
            var d = Ki(e, !0);
            for (s in f) n(d[s]) && Ji(c, s, "");
            for (s in d) (a = d[s]) !== f[s] && Ji(c, s, null == a ? "" : a);
          }
        }
        var ea = { create: ta, update: ta },
          na = /\s+/;
        function ra(t, e) {
          if (e && (e = e.trim()))
            if (t.classList)
              e.indexOf(" ") > -1
                ? e.split(na).forEach(function (e) {
                    return t.classList.add(e);
                  })
                : t.classList.add(e);
            else {
              var n = " " + (t.getAttribute("class") || "") + " ";
              n.indexOf(" " + e + " ") < 0 &&
                t.setAttribute("class", (n + e).trim());
            }
        }
        function oa(t, e) {
          if (e && (e = e.trim()))
            if (t.classList)
              e.indexOf(" ") > -1
                ? e.split(na).forEach(function (e) {
                    return t.classList.remove(e);
                  })
                : t.classList.remove(e),
                t.classList.length || t.removeAttribute("class");
            else {
              for (
                var n = " " + (t.getAttribute("class") || "") + " ",
                  r = " " + e + " ";
                n.indexOf(r) >= 0;

              )
                n = n.replace(r, " ");
              (n = n.trim())
                ? t.setAttribute("class", n)
                : t.removeAttribute("class");
            }
        }
        function ia(t) {
          if (t) {
            if ("object" == typeof t) {
              var e = {};
              return !1 !== t.css && I(e, aa(t.name || "v")), I(e, t), e;
            }
            return "string" == typeof t ? aa(t) : void 0;
          }
        }
        var aa = w(function (t) {
            return {
              enterClass: t + "-enter",
              enterToClass: t + "-enter-to",
              enterActiveClass: t + "-enter-active",
              leaveClass: t + "-leave",
              leaveToClass: t + "-leave-to",
              leaveActiveClass: t + "-leave-active",
            };
          }),
          sa = J && !nt,
          ca = "transition",
          ua = "animation",
          la = "transition",
          fa = "transitionend",
          pa = "animation",
          da = "animationend";
        sa &&
          (void 0 === window.ontransitionend &&
            void 0 !== window.onwebkittransitionend &&
            ((la = "WebkitTransition"), (fa = "webkitTransitionEnd")),
          void 0 === window.onanimationend &&
            void 0 !== window.onwebkitanimationend &&
            ((pa = "WebkitAnimation"), (da = "webkitAnimationEnd")));
        var va = J
          ? window.requestAnimationFrame
            ? window.requestAnimationFrame.bind(window)
            : setTimeout
          : function (t) {
              return t();
            };
        function ha(t) {
          va(function () {
            va(t);
          });
        }
        function ma(t, e) {
          var n = t._transitionClasses || (t._transitionClasses = []);
          n.indexOf(e) < 0 && (n.push(e), ra(t, e));
        }
        function ya(t, e) {
          t._transitionClasses && _(t._transitionClasses, e), oa(t, e);
        }
        function ga(t, e, n) {
          var r = ba(t, e),
            o = r.type,
            i = r.timeout,
            a = r.propCount;
          if (!o) return n();
          var s = o === ca ? fa : da,
            c = 0,
            u = function () {
              t.removeEventListener(s, l), n();
            },
            l = function (e) {
              e.target === t && ++c >= a && u();
            };
          setTimeout(function () {
            c < a && u();
          }, i + 1),
            t.addEventListener(s, l);
        }
        var _a = /\b(transform|all)(,|$)/;
        function ba(t, e) {
          var n,
            r = window.getComputedStyle(t),
            o = (r[la + "Delay"] || "").split(", "),
            i = (r[la + "Duration"] || "").split(", "),
            a = Ca(o, i),
            s = (r[pa + "Delay"] || "").split(", "),
            c = (r[pa + "Duration"] || "").split(", "),
            u = Ca(s, c),
            l = 0,
            f = 0;
          return (
            e === ca
              ? a > 0 && ((n = ca), (l = a), (f = i.length))
              : e === ua
              ? u > 0 && ((n = ua), (l = u), (f = c.length))
              : (f = (n = (l = Math.max(a, u)) > 0 ? (a > u ? ca : ua) : null)
                  ? n === ca
                    ? i.length
                    : c.length
                  : 0),
            {
              type: n,
              timeout: l,
              propCount: f,
              hasTransform: n === ca && _a.test(r[la + "Property"]),
            }
          );
        }
        function Ca(t, e) {
          for (; t.length < e.length; ) t = t.concat(t);
          return Math.max.apply(
            null,
            e.map(function (e, n) {
              return wa(e) + wa(t[n]);
            })
          );
        }
        function wa(t) {
          return 1e3 * Number(t.slice(0, -1).replace(",", "."));
        }
        function $a(t, e) {
          var o = t.elm;
          r(o._leaveCb) && ((o._leaveCb.cancelled = !0), o._leaveCb());
          var i = ia(t.data.transition);
          if (!n(i) && !r(o._enterCb) && 1 === o.nodeType) {
            for (
              var a = i.css,
                c = i.type,
                u = i.enterClass,
                l = i.enterToClass,
                f = i.enterActiveClass,
                p = i.appearClass,
                d = i.appearToClass,
                v = i.appearActiveClass,
                m = i.beforeEnter,
                y = i.enter,
                g = i.afterEnter,
                _ = i.enterCancelled,
                b = i.beforeAppear,
                C = i.appear,
                w = i.afterAppear,
                $ = i.appearCancelled,
                A = i.duration,
                x = cr,
                O = cr.$vnode;
              O && O.parent;

            )
              (x = O.context), (O = O.parent);
            var k = !x._isMounted || !t.isRootInsert;
            if (!k || C || "" === C) {
              var S = k && p ? p : u,
                j = k && v ? v : f,
                E = k && d ? d : l,
                T = (k && b) || m,
                I = k && "function" == typeof C ? C : y,
                D = (k && w) || g,
                N = (k && $) || _,
                L = h(s(A) ? A.enter : A);
              0;
              var P = !1 !== a && !nt,
                M = ka(I),
                F = (o._enterCb = R(function () {
                  P && (ya(o, E), ya(o, j)),
                    F.cancelled ? (P && ya(o, S), N && N(o)) : D && D(o),
                    (o._enterCb = null);
                }));
              t.data.show ||
                Ye(t, "insert", function () {
                  var e = o.parentNode,
                    n = e && e._pending && e._pending[t.key];
                  n && n.tag === t.tag && n.elm._leaveCb && n.elm._leaveCb(),
                    I && I(o, F);
                }),
                T && T(o),
                P &&
                  (ma(o, S),
                  ma(o, j),
                  ha(function () {
                    ya(o, S),
                      F.cancelled ||
                        (ma(o, E),
                        M || (Oa(L) ? setTimeout(F, L) : ga(o, c, F)));
                  })),
                t.data.show && (e && e(), I && I(o, F)),
                P || M || F();
            }
          }
        }
        function Aa(t, e) {
          var o = t.elm;
          r(o._enterCb) && ((o._enterCb.cancelled = !0), o._enterCb());
          var i = ia(t.data.transition);
          if (n(i) || 1 !== o.nodeType) return e();
          if (!r(o._leaveCb)) {
            var a = i.css,
              c = i.type,
              u = i.leaveClass,
              l = i.leaveToClass,
              f = i.leaveActiveClass,
              p = i.beforeLeave,
              d = i.leave,
              v = i.afterLeave,
              m = i.leaveCancelled,
              y = i.delayLeave,
              g = i.duration,
              _ = !1 !== a && !nt,
              b = ka(d),
              C = h(s(g) ? g.leave : g);
            0;
            var w = (o._leaveCb = R(function () {
              o.parentNode &&
                o.parentNode._pending &&
                (o.parentNode._pending[t.key] = null),
                _ && (ya(o, l), ya(o, f)),
                w.cancelled ? (_ && ya(o, u), m && m(o)) : (e(), v && v(o)),
                (o._leaveCb = null);
            }));
            y ? y($) : $();
          }
          function $() {
            w.cancelled ||
              (!t.data.show &&
                o.parentNode &&
                ((o.parentNode._pending || (o.parentNode._pending = {}))[
                  t.key
                ] = t),
              p && p(o),
              _ &&
                (ma(o, u),
                ma(o, f),
                ha(function () {
                  ya(o, u),
                    w.cancelled ||
                      (ma(o, l), b || (Oa(C) ? setTimeout(w, C) : ga(o, c, w)));
                })),
              d && d(o, w),
              _ || b || w());
          }
        }
        function xa(t, e, n) {
          "number" != typeof t
            ? Ct(
                "<transition> explicit " +
                  e +
                  " duration is not a valid number - got " +
                  JSON.stringify(t) +
                  ".",
                n.context
              )
            : isNaN(t) &&
              Ct(
                "<transition> explicit " +
                  e +
                  " duration is NaN - the duration expression might be incorrect.",
                n.context
              );
        }
        function Oa(t) {
          return "number" == typeof t && !isNaN(t);
        }
        function ka(t) {
          if (n(t)) return !1;
          var e = t.fns;
          return r(e)
            ? ka(Array.isArray(e) ? e[0] : e)
            : (t._length || t.length) > 1;
        }
        function Sa(t, e) {
          !0 !== e.data.show && $a(e);
        }
        var ja = J
            ? {
                create: Sa,
                activate: Sa,
                remove: function (t, e) {
                  !0 !== t.data.show ? Aa(t, e) : e();
                },
              }
            : {},
          Ea = [xi, Si, Fi, zi, ea, ja],
          Ta = Ea.concat(Ci),
          Ia = di({ nodeOps: ii, modules: Ta });
        nt &&
          document.addEventListener("selectionchange", function () {
            var t = document.activeElement;
            t && t.vmodel && Ha(t, "input");
          });
        var Da = {
          inserted: function (t, e, n, r) {
            "select" === n.tag
              ? (r.elm && !r.elm._vOptions
                  ? Ye(n, "postpatch", function () {
                      Da.componentUpdated(t, e, n);
                    })
                  : Na(t, e, n.context),
                (t._vOptions = [].map.call(t.options, Ma)))
              : ("textarea" === n.tag || Wo(t.type)) &&
                ((t._vModifiers = e.modifiers),
                e.modifiers.lazy ||
                  (t.addEventListener("compositionstart", Fa),
                  t.addEventListener("compositionend", Ra),
                  t.addEventListener("change", Ra),
                  nt && (t.vmodel = !0)));
          },
          componentUpdated: function (t, e, n) {
            if ("select" === n.tag) {
              Na(t, e, n.context);
              var r = t._vOptions,
                o = (t._vOptions = [].map.call(t.options, Ma));
              if (
                o.some(function (t, e) {
                  return !M(t, r[e]);
                })
              )
                (t.multiple
                  ? e.value.some(function (t) {
                      return Pa(t, o);
                    })
                  : e.value !== e.oldValue && Pa(e.value, o)) &&
                  Ha(t, "change");
            }
          },
        };
        function Na(t, e, n) {
          La(t, e, n),
            (et || rt) &&
              setTimeout(function () {
                La(t, e, n);
              }, 0);
        }
        function La(t, e, n) {
          var r = e.value,
            o = t.multiple;
          if (!o || Array.isArray(r)) {
            for (var i, a, s = 0, c = t.options.length; s < c; s++)
              if (((a = t.options[s]), o))
                (i = F(r, Ma(a)) > -1), a.selected !== i && (a.selected = i);
              else if (M(Ma(a), r))
                return void (t.selectedIndex !== s && (t.selectedIndex = s));
            o || (t.selectedIndex = -1);
          }
        }
        function Pa(t, e) {
          return e.every(function (e) {
            return !M(e, t);
          });
        }
        function Ma(t) {
          return "_value" in t ? t._value : t.value;
        }
        function Fa(t) {
          t.target.composing = !0;
        }
        function Ra(t) {
          t.target.composing &&
            ((t.target.composing = !1), Ha(t.target, "input"));
        }
        function Ha(t, e) {
          var n = document.createEvent("HTMLEvents");
          n.initEvent(e, !0, !0), t.dispatchEvent(n);
        }
        function Ua(t) {
          return !t.componentInstance || (t.data && t.data.transition)
            ? t
            : Ua(t.componentInstance._vnode);
        }
        var Ba = {
            bind: function (t, e, n) {
              var r = e.value,
                o = (n = Ua(n)).data && n.data.transition,
                i = (t.__vOriginalDisplay =
                  "none" === t.style.display ? "" : t.style.display);
              r && o
                ? ((n.data.show = !0),
                  $a(n, function () {
                    t.style.display = i;
                  }))
                : (t.style.display = r ? i : "none");
            },
            update: function (t, e, n) {
              var r = e.value;
              !r != !e.oldValue &&
                ((n = Ua(n)).data && n.data.transition
                  ? ((n.data.show = !0),
                    r
                      ? $a(n, function () {
                          t.style.display = t.__vOriginalDisplay;
                        })
                      : Aa(n, function () {
                          t.style.display = "none";
                        }))
                  : (t.style.display = r ? t.__vOriginalDisplay : "none"));
            },
            unbind: function (t, e, n, r, o) {
              o || (t.style.display = t.__vOriginalDisplay);
            },
          },
          za = { model: Da, show: Ba },
          Va = {
            name: String,
            appear: Boolean,
            css: Boolean,
            mode: String,
            type: String,
            enterClass: String,
            leaveClass: String,
            enterToClass: String,
            leaveToClass: String,
            enterActiveClass: String,
            leaveActiveClass: String,
            appearClass: String,
            appearActiveClass: String,
            appearToClass: String,
            duration: [Number, String, Object],
          };
        function Wa(t) {
          var e = t && t.componentOptions;
          return e && e.Ctor.options.abstract ? Wa(er(e.children)) : t;
        }
        function qa(t) {
          var e = {},
            n = t.$options;
          for (var r in n.propsData) e[r] = t[r];
          var o = n._parentListeners;
          for (var i in o) e[A(i)] = o[i];
          return e;
        }
        function Ka(t, e) {
          if (/\d-keep-alive$/.test(e.tag))
            return t("keep-alive", { props: e.componentOptions.propsData });
        }
        function Xa(t) {
          for (; (t = t.parent); ) if (t.data.transition) return !0;
        }
        function Ga(t, e) {
          return e.key === t.key && e.tag === t.tag;
        }
        var Za = function (t) {
            return t.tag || tr(t);
          },
          Ja = function (t) {
            return "show" === t.name;
          },
          Qa = {
            name: "transition",
            props: Va,
            abstract: !0,
            render: function (t) {
              var e = this,
                n = this.$slots.default;
              if (n && (n = n.filter(Za)).length) {
                0;
                var r = this.mode;
                0;
                var o = n[0];
                if (Xa(this.$vnode)) return o;
                var i = Wa(o);
                if (!i) return o;
                if (this._leaving) return Ka(t, o);
                var s = "__transition-" + this._uid + "-";
                i.key =
                  null == i.key
                    ? i.isComment
                      ? s + "comment"
                      : s + i.tag
                    : a(i.key)
                    ? 0 === String(i.key).indexOf(s)
                      ? i.key
                      : s + i.key
                    : i.key;
                var c = ((i.data || (i.data = {})).transition = qa(this)),
                  u = this._vnode,
                  l = Wa(u);
                if (
                  (i.data.directives &&
                    i.data.directives.some(Ja) &&
                    (i.data.show = !0),
                  l &&
                    l.data &&
                    !Ga(i, l) &&
                    !tr(l) &&
                    (!l.componentInstance ||
                      !l.componentInstance._vnode.isComment))
                ) {
                  var f = (l.data.transition = I({}, c));
                  if ("out-in" === r)
                    return (
                      (this._leaving = !0),
                      Ye(f, "afterLeave", function () {
                        (e._leaving = !1), e.$forceUpdate();
                      }),
                      Ka(t, o)
                    );
                  if ("in-out" === r) {
                    if (tr(i)) return u;
                    var p,
                      d = function () {
                        p();
                      };
                    Ye(c, "afterEnter", d),
                      Ye(c, "enterCancelled", d),
                      Ye(f, "delayLeave", function (t) {
                        p = t;
                      });
                  }
                }
                return o;
              }
            },
          },
          Ya = I({ tag: String, moveClass: String }, Va);
        delete Ya.mode;
        var ts = {
          props: Ya,
          beforeMount: function () {
            var t = this,
              e = this._update;
            this._update = function (n, r) {
              var o = lr(t);
              t.__patch__(t._vnode, t.kept, !1, !0),
                (t._vnode = t.kept),
                o(),
                e.call(t, n, r);
            };
          },
          render: function (t) {
            for (
              var e = this.tag || this.$vnode.data.tag || "span",
                n = Object.create(null),
                r = (this.prevChildren = this.children),
                o = this.$slots.default || [],
                i = (this.children = []),
                a = qa(this),
                s = 0;
              s < o.length;
              s++
            ) {
              var c = o[s];
              if (c.tag)
                if (null != c.key && 0 !== String(c.key).indexOf("__vlist"))
                  i.push(c),
                    (n[c.key] = c),
                    ((c.data || (c.data = {})).transition = a);
                else;
            }
            if (r) {
              for (var u = [], l = [], f = 0; f < r.length; f++) {
                var p = r[f];
                (p.data.transition = a),
                  (p.data.pos = p.elm.getBoundingClientRect()),
                  n[p.key] ? u.push(p) : l.push(p);
              }
              (this.kept = t(e, null, u)), (this.removed = l);
            }
            return t(e, null, i);
          },
          updated: function () {
            var t = this.prevChildren,
              e = this.moveClass || (this.name || "v") + "-move";
            t.length &&
              this.hasMove(t[0].elm, e) &&
              (t.forEach(es),
              t.forEach(ns),
              t.forEach(rs),
              (this._reflow = document.body.offsetHeight),
              t.forEach(function (t) {
                if (t.data.moved) {
                  var n = t.elm,
                    r = n.style;
                  ma(n, e),
                    (r.transform =
                      r.WebkitTransform =
                      r.transitionDuration =
                        ""),
                    n.addEventListener(
                      fa,
                      (n._moveCb = function t(r) {
                        (r && r.target !== n) ||
                          (r && !/transform$/.test(r.propertyName)) ||
                          (n.removeEventListener(fa, t),
                          (n._moveCb = null),
                          ya(n, e));
                      })
                    );
                }
              }));
          },
          methods: {
            hasMove: function (t, e) {
              if (!sa) return !1;
              if (this._hasMove) return this._hasMove;
              var n = t.cloneNode();
              t._transitionClasses &&
                t._transitionClasses.forEach(function (t) {
                  oa(n, t);
                }),
                ra(n, e),
                (n.style.display = "none"),
                this.$el.appendChild(n);
              var r = ba(n);
              return this.$el.removeChild(n), (this._hasMove = r.hasTransform);
            },
          },
        };
        function es(t) {
          t.elm._moveCb && t.elm._moveCb(), t.elm._enterCb && t.elm._enterCb();
        }
        function ns(t) {
          t.data.newPos = t.elm.getBoundingClientRect();
        }
        function rs(t) {
          var e = t.data.pos,
            n = t.data.newPos,
            r = e.left - n.left,
            o = e.top - n.top;
          if (r || o) {
            t.data.moved = !0;
            var i = t.elm.style;
            (i.transform = i.WebkitTransform =
              "translate(" + r + "px," + o + "px)"),
              (i.transitionDuration = "0s");
          }
        }
        var os = { Transition: Qa, TransitionGroup: ts };
        (oo.config.mustUseProp = wo),
          (oo.config.isReservedTag = Uo),
          (oo.config.isReservedAttr = bo),
          (oo.config.getTagNamespace = Bo),
          (oo.config.isUnknownElement = Vo),
          I(oo.options.directives, za),
          I(oo.options.components, os),
          (oo.prototype.__patch__ = J ? Ia : N),
          (oo.prototype.$mount = function (t, e) {
            return dr(this, (t = t && J ? qo(t) : void 0), e);
          }),
          J &&
            setTimeout(function () {
              z.devtools && dt && dt.emit("init", oo);
            }, 0);
        var is = oo;
        exports.default = is;
      },
      {},
    ],
    Ki8f: [
      function (require, module, exports) {
        var global = arguments[3];
        var t = arguments[3];
        function e(t) {
          if (Number(t.version.split(".")[0]) >= 2)
            t.mixin({ beforeCreate: n });
          else {
            var e = t.prototype._init;
            t.prototype._init = function (t) {
              void 0 === t && (t = {}),
                (t.init = t.init ? [n].concat(t.init) : n),
                e.call(this, t);
            };
          }
          function n() {
            var t = this.$options;
            t.store
              ? (this.$store =
                  "function" == typeof t.store ? t.store() : t.store)
              : t.parent && t.parent.$store && (this.$store = t.parent.$store);
          }
        }
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.install = L),
          (exports.createNamespacedHelpers =
            exports.mapActions =
            exports.mapGetters =
            exports.mapMutations =
            exports.mapState =
            exports.Store =
            exports.default =
              void 0);
        var n = "undefined" != typeof window ? window : void 0 !== t ? t : {},
          o = n.__VUE_DEVTOOLS_GLOBAL_HOOK__;
        function r(t) {
          o &&
            ((t._devtoolHook = o),
            o.emit("vuex:init", t),
            o.on("vuex:travel-to-state", function (e) {
              t.replaceState(e);
            }),
            t.subscribe(function (t, e) {
              o.emit("vuex:mutation", t, e);
            }));
        }
        function i(t, e) {
          Object.keys(t).forEach(function (n) {
            return e(t[n], n);
          });
        }
        function s(t) {
          return null !== t && "object" == typeof t;
        }
        function a(t) {
          return t && "function" == typeof t.then;
        }
        function c(t, e) {
          if (!t) throw new Error("[vuex] " + e);
        }
        function u(t, e) {
          return function () {
            return t(e);
          };
        }
        var f = function (t, e) {
            (this.runtime = e),
              (this._children = Object.create(null)),
              (this._rawModule = t);
            var n = t.state;
            this.state = ("function" == typeof n ? n() : n) || {};
          },
          p = { namespaced: { configurable: !0 } };
        (p.namespaced.get = function () {
          return !!this._rawModule.namespaced;
        }),
          (f.prototype.addChild = function (t, e) {
            this._children[t] = e;
          }),
          (f.prototype.removeChild = function (t) {
            delete this._children[t];
          }),
          (f.prototype.getChild = function (t) {
            return this._children[t];
          }),
          (f.prototype.hasChild = function (t) {
            return t in this._children;
          }),
          (f.prototype.update = function (t) {
            (this._rawModule.namespaced = t.namespaced),
              t.actions && (this._rawModule.actions = t.actions),
              t.mutations && (this._rawModule.mutations = t.mutations),
              t.getters && (this._rawModule.getters = t.getters);
          }),
          (f.prototype.forEachChild = function (t) {
            i(this._children, t);
          }),
          (f.prototype.forEachGetter = function (t) {
            this._rawModule.getters && i(this._rawModule.getters, t);
          }),
          (f.prototype.forEachAction = function (t) {
            this._rawModule.actions && i(this._rawModule.actions, t);
          }),
          (f.prototype.forEachMutation = function (t) {
            this._rawModule.mutations && i(this._rawModule.mutations, t);
          }),
          Object.defineProperties(f.prototype, p);
        var h = function (t) {
          this.register([], t, !1);
        };
        function l(t, e, n) {
          if ((e.update(n), n.modules))
            for (var o in n.modules) {
              if (!e.getChild(o)) return void 0;
              l(t.concat(o), e.getChild(o), n.modules[o]);
            }
        }
        (h.prototype.get = function (t) {
          return t.reduce(function (t, e) {
            return t.getChild(e);
          }, this.root);
        }),
          (h.prototype.getNamespace = function (t) {
            var e = this.root;
            return t.reduce(function (t, n) {
              return t + ((e = e.getChild(n)).namespaced ? n + "/" : "");
            }, "");
          }),
          (h.prototype.update = function (t) {
            l([], this.root, t);
          }),
          (h.prototype.register = function (t, e, n) {
            var o = this;
            void 0 === n && (n = !0);
            var r = new f(e, n);
            0 === t.length
              ? (this.root = r)
              : this.get(t.slice(0, -1)).addChild(t[t.length - 1], r);
            e.modules &&
              i(e.modules, function (e, r) {
                o.register(t.concat(r), e, n);
              });
          }),
          (h.prototype.unregister = function (t) {
            var e = this.get(t.slice(0, -1)),
              n = t[t.length - 1];
            e.getChild(n).runtime && e.removeChild(n);
          }),
          (h.prototype.isRegistered = function (t) {
            var e = this.get(t.slice(0, -1)),
              n = t[t.length - 1];
            return e.hasChild(n);
          });
        var d,
          m = {
            assert: function (t) {
              return "function" == typeof t;
            },
            expected: "function",
          },
          v = {
            assert: function (t) {
              return (
                "function" == typeof t ||
                ("object" == typeof t && "function" == typeof t.handler)
              );
            },
            expected: 'function or object with "handler" function',
          },
          _ = { getters: m, mutations: m, actions: v };
        function y(t, e) {
          Object.keys(_).forEach(function (n) {
            if (e[n]) {
              var o = _[n];
              i(e[n], function (e, r) {
                c(o.assert(e), g(t, n, r, e, o.expected));
              });
            }
          });
        }
        function g(t, e, n, o, r) {
          var i = e + " should be " + r + ' but "' + e + "." + n + '"';
          return (
            t.length > 0 && (i += ' in module "' + t.join(".") + '"'),
            (i += " is " + JSON.stringify(o) + ".")
          );
        }
        var b = function (t) {
          var e = this;
          void 0 === t && (t = {}),
            !d && "undefined" != typeof window && window.Vue && L(window.Vue);
          var n = t.plugins;
          void 0 === n && (n = []);
          var o = t.strict;
          void 0 === o && (o = !1),
            (this._committing = !1),
            (this._actions = Object.create(null)),
            (this._actionSubscribers = []),
            (this._mutations = Object.create(null)),
            (this._wrappedGetters = Object.create(null)),
            (this._modules = new h(t)),
            (this._modulesNamespaceMap = Object.create(null)),
            (this._subscribers = []),
            (this._watcherVM = new d()),
            (this._makeLocalGettersCache = Object.create(null));
          var i = this,
            s = this.dispatch,
            a = this.commit;
          (this.dispatch = function (t, e) {
            return s.call(i, t, e);
          }),
            (this.commit = function (t, e, n) {
              return a.call(i, t, e, n);
            }),
            (this.strict = o);
          var c = this._modules.root.state;
          $(this, c, [], this._modules.root),
            O(this, c),
            n.forEach(function (t) {
              return t(e);
            }),
            (void 0 !== t.devtools ? t.devtools : d.config.devtools) && r(this);
        };
        exports.Store = b;
        var w = { state: { configurable: !0 } };
        function x(t, e) {
          return (
            e.indexOf(t) < 0 && e.push(t),
            function () {
              var n = e.indexOf(t);
              n > -1 && e.splice(n, 1);
            }
          );
        }
        function M(t, e) {
          (t._actions = Object.create(null)),
            (t._mutations = Object.create(null)),
            (t._wrappedGetters = Object.create(null)),
            (t._modulesNamespaceMap = Object.create(null));
          var n = t.state;
          $(t, n, [], t._modules.root, !0), O(t, n, e);
        }
        function O(t, e, n) {
          var o = t._vm;
          (t.getters = {}), (t._makeLocalGettersCache = Object.create(null));
          var r = t._wrappedGetters,
            s = {};
          i(r, function (e, n) {
            (s[n] = u(e, t)),
              Object.defineProperty(t.getters, n, {
                get: function () {
                  return t._vm[n];
                },
                enumerable: !0,
              });
          });
          var a = d.config.silent;
          (d.config.silent = !0),
            (t._vm = new d({ data: { $$state: e }, computed: s })),
            (d.config.silent = a),
            t.strict && S(t),
            o &&
              (n &&
                t._withCommit(function () {
                  o._data.$$state = null;
                }),
              d.nextTick(function () {
                return o.$destroy();
              }));
        }
        function $(t, e, n, o, r) {
          var i = !n.length,
            s = t._modules.getNamespace(n);
          if (
            (o.namespaced &&
              (t._modulesNamespaceMap[s], (t._modulesNamespaceMap[s] = o)),
            !i && !r)
          ) {
            var a = A(e, n.slice(0, -1)),
              c = n[n.length - 1];
            t._withCommit(function () {
              d.set(a, c, o.state);
            });
          }
          var u = (o.context = C(t, s, n));
          o.forEachMutation(function (e, n) {
            E(t, s + n, e, u);
          }),
            o.forEachAction(function (e, n) {
              var o = e.root ? n : s + n,
                r = e.handler || e;
              k(t, o, r, u);
            }),
            o.forEachGetter(function (e, n) {
              G(t, s + n, e, u);
            }),
            o.forEachChild(function (o, i) {
              $(t, e, n.concat(i), o, r);
            });
        }
        function C(t, e, n) {
          var o = "" === e,
            r = {
              dispatch: o
                ? t.dispatch
                : function (n, o, r) {
                    var i = N(n, o, r),
                      s = i.payload,
                      a = i.options,
                      c = i.type;
                    return (a && a.root) || (c = e + c), t.dispatch(c, s);
                  },
              commit: o
                ? t.commit
                : function (n, o, r) {
                    var i = N(n, o, r),
                      s = i.payload,
                      a = i.options,
                      c = i.type;
                    (a && a.root) || (c = e + c), t.commit(c, s, a);
                  },
            };
          return (
            Object.defineProperties(r, {
              getters: {
                get: o
                  ? function () {
                      return t.getters;
                    }
                  : function () {
                      return j(t, e);
                    },
              },
              state: {
                get: function () {
                  return A(t.state, n);
                },
              },
            }),
            r
          );
        }
        function j(t, e) {
          if (!t._makeLocalGettersCache[e]) {
            var n = {},
              o = e.length;
            Object.keys(t.getters).forEach(function (r) {
              if (r.slice(0, o) === e) {
                var i = r.slice(o);
                Object.defineProperty(n, i, {
                  get: function () {
                    return t.getters[r];
                  },
                  enumerable: !0,
                });
              }
            }),
              (t._makeLocalGettersCache[e] = n);
          }
          return t._makeLocalGettersCache[e];
        }
        function E(t, e, n, o) {
          (t._mutations[e] || (t._mutations[e] = [])).push(function (e) {
            n.call(t, o.state, e);
          });
        }
        function k(t, e, n, o) {
          (t._actions[e] || (t._actions[e] = [])).push(function (e) {
            var r = n.call(
              t,
              {
                dispatch: o.dispatch,
                commit: o.commit,
                getters: o.getters,
                state: o.state,
                rootGetters: t.getters,
                rootState: t.state,
              },
              e
            );
            return (
              a(r) || (r = Promise.resolve(r)),
              t._devtoolHook
                ? r.catch(function (e) {
                    throw (t._devtoolHook.emit("vuex:error", e), e);
                  })
                : r
            );
          });
        }
        function G(t, e, n, o) {
          t._wrappedGetters[e] ||
            (t._wrappedGetters[e] = function (t) {
              return n(o.state, o.getters, t.state, t.getters);
            });
        }
        function S(t) {
          t._vm.$watch(
            function () {
              return this._data.$$state;
            },
            function () {
              0;
            },
            { deep: !0, sync: !0 }
          );
        }
        function A(t, e) {
          return e.reduce(function (t, e) {
            return t[e];
          }, t);
        }
        function N(t, e, n) {
          return (
            s(t) && t.type && ((n = e), (e = t), (t = t.type)),
            { type: t, payload: e, options: n }
          );
        }
        function L(t) {
          (d && t === d) || e((d = t));
        }
        (w.state.get = function () {
          return this._vm._data.$$state;
        }),
          (w.state.set = function (t) {
            0;
          }),
          (b.prototype.commit = function (t, e, n) {
            var o = this,
              r = N(t, e, n),
              i = r.type,
              s = r.payload,
              a = (r.options, { type: i, payload: s }),
              c = this._mutations[i];
            c &&
              (this._withCommit(function () {
                c.forEach(function (t) {
                  t(s);
                });
              }),
              this._subscribers.slice().forEach(function (t) {
                return t(a, o.state);
              }));
          }),
          (b.prototype.dispatch = function (t, e) {
            var n = this,
              o = N(t, e),
              r = o.type,
              i = o.payload,
              s = { type: r, payload: i },
              a = this._actions[r];
            if (a) {
              try {
                this._actionSubscribers
                  .slice()
                  .filter(function (t) {
                    return t.before;
                  })
                  .forEach(function (t) {
                    return t.before(s, n.state);
                  });
              } catch (c) {
                0;
              }
              return (
                a.length > 1
                  ? Promise.all(
                      a.map(function (t) {
                        return t(i);
                      })
                    )
                  : a[0](i)
              ).then(function (t) {
                try {
                  n._actionSubscribers
                    .filter(function (t) {
                      return t.after;
                    })
                    .forEach(function (t) {
                      return t.after(s, n.state);
                    });
                } catch (c) {
                  0;
                }
                return t;
              });
            }
          }),
          (b.prototype.subscribe = function (t) {
            return x(t, this._subscribers);
          }),
          (b.prototype.subscribeAction = function (t) {
            return x(
              "function" == typeof t ? { before: t } : t,
              this._actionSubscribers
            );
          }),
          (b.prototype.watch = function (t, e, n) {
            var o = this;
            return this._watcherVM.$watch(
              function () {
                return t(o.state, o.getters);
              },
              e,
              n
            );
          }),
          (b.prototype.replaceState = function (t) {
            var e = this;
            this._withCommit(function () {
              e._vm._data.$$state = t;
            });
          }),
          (b.prototype.registerModule = function (t, e, n) {
            void 0 === n && (n = {}),
              "string" == typeof t && (t = [t]),
              this._modules.register(t, e),
              $(this, this.state, t, this._modules.get(t), n.preserveState),
              O(this, this.state);
          }),
          (b.prototype.unregisterModule = function (t) {
            var e = this;
            "string" == typeof t && (t = [t]),
              this._modules.unregister(t),
              this._withCommit(function () {
                var n = A(e.state, t.slice(0, -1));
                d.delete(n, t[t.length - 1]);
              }),
              M(this);
          }),
          (b.prototype.hasModule = function (t) {
            return (
              "string" == typeof t && (t = [t]), this._modules.isRegistered(t)
            );
          }),
          (b.prototype.hotUpdate = function (t) {
            this._modules.update(t), M(this, !0);
          }),
          (b.prototype._withCommit = function (t) {
            var e = this._committing;
            (this._committing = !0), t(), (this._committing = e);
          }),
          Object.defineProperties(b.prototype, w);
        var P = D(function (t, e) {
          var n = {};
          return (
            U(e).forEach(function (e) {
              var o = e.key,
                r = e.val;
              (n[o] = function () {
                var e = this.$store.state,
                  n = this.$store.getters;
                if (t) {
                  var o = J(this.$store, "mapState", t);
                  if (!o) return;
                  (e = o.context.state), (n = o.context.getters);
                }
                return "function" == typeof r ? r.call(this, e, n) : e[r];
              }),
                (n[o].vuex = !0);
            }),
            n
          );
        });
        exports.mapState = P;
        var H = D(function (t, e) {
          var n = {};
          return (
            U(e).forEach(function (e) {
              var o = e.key,
                r = e.val;
              n[o] = function () {
                for (var e = [], n = arguments.length; n--; )
                  e[n] = arguments[n];
                var o = this.$store.commit;
                if (t) {
                  var i = J(this.$store, "mapMutations", t);
                  if (!i) return;
                  o = i.context.commit;
                }
                return "function" == typeof r
                  ? r.apply(this, [o].concat(e))
                  : o.apply(this.$store, [r].concat(e));
              };
            }),
            n
          );
        });
        exports.mapMutations = H;
        var V = D(function (t, e) {
          var n = {};
          return (
            U(e).forEach(function (e) {
              var o = e.key,
                r = e.val;
              (r = t + r),
                (n[o] = function () {
                  if (!t || J(this.$store, "mapGetters", t))
                    return this.$store.getters[r];
                }),
                (n[o].vuex = !0);
            }),
            n
          );
        });
        exports.mapGetters = V;
        var R = D(function (t, e) {
          var n = {};
          return (
            U(e).forEach(function (e) {
              var o = e.key,
                r = e.val;
              n[o] = function () {
                for (var e = [], n = arguments.length; n--; )
                  e[n] = arguments[n];
                var o = this.$store.dispatch;
                if (t) {
                  var i = J(this.$store, "mapActions", t);
                  if (!i) return;
                  o = i.context.dispatch;
                }
                return "function" == typeof r
                  ? r.apply(this, [o].concat(e))
                  : o.apply(this.$store, [r].concat(e));
              };
            }),
            n
          );
        });
        exports.mapActions = R;
        var T = function (t) {
          return {
            mapState: P.bind(null, t),
            mapGetters: V.bind(null, t),
            mapMutations: H.bind(null, t),
            mapActions: R.bind(null, t),
          };
        };
        function U(t) {
          return B(t)
            ? Array.isArray(t)
              ? t.map(function (t) {
                  return { key: t, val: t };
                })
              : Object.keys(t).map(function (e) {
                  return { key: e, val: t[e] };
                })
            : [];
        }
        function B(t) {
          return Array.isArray(t) || s(t);
        }
        function D(t) {
          return function (e, n) {
            return (
              "string" != typeof e
                ? ((n = e), (e = ""))
                : "/" !== e.charAt(e.length - 1) && (e += "/"),
              t(e, n)
            );
          };
        }
        function J(t, e, n) {
          var o = t._modulesNamespaceMap[n];
          return o;
        }
        exports.createNamespacedHelpers = T;
        var K = {
            Store: b,
            install: L,
            version: "3.2.0",
            mapState: P,
            mapMutations: H,
            mapGetters: V,
            mapActions: R,
            createNamespacedHelpers: T,
          },
          q = K;
        exports.default = q;
      },
      {},
    ],
    TptL: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = {
          name: "Link",
          props: ["to"],
          methods: { openURL: ddmm.app.openURL },
        };
        exports.default = e;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this,
                  e = t.$createElement;
                return (t._self._c || e)(
                  "a",
                  {
                    attrs: { href: "#" },
                    on: {
                      click: function (e) {
                        return t.openURL(t.to);
                      },
                    },
                  },
                  [t._t("default")],
                  2
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-bd8388",
              functional: void 0,
            });
        })();
      },
      {},
    ],
    yym9: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = i(require("./elements/Link.vue"));
        function i(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var d = {
          name: "Titlebar",
          components: { Link: e.default },
          props: ["app_name", "app_version", "system_borders"],
          methods: {
            _: ddmm.translate,
            windowClose: ddmm.window.close,
            windowMinimise: ddmm.window.minimise,
            windowMaximise: ddmm.window.maximise,
          },
        };
        exports.default = d;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this,
                  i = t.$createElement,
                  s = t._self._c || i;
                return s("div", { staticClass: "titlebar" }, [
                  s("div", { staticClass: "app-title" }, [
                    s("span", [t._v(t._s(t.app_name))]),
                    t._v(" "),
                    s("small", [t._v("version v4.99.1")]),
                  ]),
                  t._v(" "),
                  s(
                    "div",
                    { staticClass: "window-buttons" },
                    [
                      t.system_borders
                        ? t._e()
                        : [
                            s(
                              "div",
                              {
                                staticClass: "button",
                                attrs: {
                                  title: t._(
                                    "renderer.window_controls.minimise"
                                  ),
                                },
                                on: { click: t.windowMinimise },
                              },
                              [
                                s("i", {
                                  staticClass: "far fa-window-minimize fa-fw",
                                }),
                              ]
                            ),
                            t._v(" "),
                            s(
                              "div",
                              {
                                staticClass: "button",
                                attrs: {
                                  title: t._(
                                    "renderer.window_controls.maximise"
                                  ),
                                },
                                on: { click: t.windowMaximise },
                              },
                              [
                                s("i", {
                                  staticClass: "far fa-window-maximize fa-fw",
                                }),
                              ]
                            ),
                            t._v(" "),
                            s(
                              "div",
                              {
                                staticClass: "button",
                                attrs: {
                                  title: t._("renderer.window_controls.close"),
                                },
                                on: { click: t.windowClose },
                              },
                              [s("i", { staticClass: "fas fa-times fa-fw" })]
                            ),
                          ],
                    ],
                    2
                  ),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: null,
              functional: void 0,
            });
        })();
      },
      { "./elements/Link.vue": "TptL" },
    ],
    eyJ0: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var t = e(require("../js/utils/Logger"));
        function e(t) {
          return t && t.__esModule ? t : { default: t };
        }
        var o = {
          name: "Navbar",
          props: ["tabs"],
          computed: {
            tab: function () {
              return this.$store.state.tab;
            },
          },
          methods: {
            _: ddmm.translate,
            openURL: ddmm.app.openURL,
            setTab: function (e) {
              t.default.info("Navbar", "Navigated to tab " + e.component),
                ("ExperimentsTab" !== e.component || ddmm.env.DDMM_DEVELOPER) &&
                  this.$store.commit("set_tab", e.component);
            },
            issueReport: function () {
              this.$store.commit("show_modal", { modal: "issue_report" });
            },
          },
        };
        exports.default = o;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this,
                  a = t.$createElement,
                  n = t._self._c || a;
                return n("div", { staticClass: "navbar" }, [
                  n(
                    "div",
                    { staticClass: "nav-links long" },
                    t._l(t.tabs, function (a) {
                      return n(
                        "div",
                        {
                          class: { active: a.component === t.tab },
                          on: {
                            click: function (n) {
                              return t.setTab(a);
                            },
                          },
                        },
                        [
                          n("div", { staticClass: "nav-link" }, [
                            a.badge && a.badge()
                              ? n("span", { staticClass: "nav-link-badge" })
                              : t._e(),
                            t._v(" "),
                            n("span", { staticClass: "nav-link-text" }, [
                              t._v(t._s(a.name())),
                            ]),
                          ]),
                        ]
                      );
                    }),
                    0
                  ),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-c20608",
              functional: void 0,
            });
        })();
      },
      { "../js/utils/Logger": "vKp2" },
    ],
    fGxp: [
      function (require, module, exports) {
        "use strict";
        function t(e) {
          return (t =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                })(e);
        }
        function e(t, e) {
          if ("function" != typeof e && null !== e)
            throw new TypeError(
              "Super expression must either be null or a function"
            );
          (t.prototype = Object.create(e && e.prototype, {
            constructor: { value: t, writable: !0, configurable: !0 },
          })),
            e && n(t, e);
        }
        function n(t, e) {
          return (n =
            Object.setPrototypeOf ||
            function (t, e) {
              return (t.__proto__ = e), t;
            })(t, e);
        }
        function r(t) {
          return function () {
            var e,
              n = s(t);
            if (a()) {
              var r = s(this).constructor;
              e = Reflect.construct(n, arguments, r);
            } else e = n.apply(this, arguments);
            return i(this, e);
          };
        }
        function i(e, n) {
          return !n || ("object" !== t(n) && "function" != typeof n) ? o(e) : n;
        }
        function o(t) {
          if (void 0 === t)
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          return t;
        }
        function a() {
          if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
          if (Reflect.construct.sham) return !1;
          if ("function" == typeof Proxy) return !0;
          try {
            return (
              Date.prototype.toString.call(
                Reflect.construct(Date, [], function () {})
              ),
              !0
            );
          } catch (t) {
            return !1;
          }
        }
        function s(t) {
          return (s = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function (t) {
                return t.__proto__ || Object.getPrototypeOf(t);
              })(t);
        }
        function c(t) {
          return f(t) || l(t) || u(t) || h();
        }
        function h() {
          throw new TypeError(
            "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
          );
        }
        function u(t, e) {
          if (t) {
            if ("string" == typeof t) return v(t, e);
            var n = Object.prototype.toString.call(t).slice(8, -1);
            return (
              "Object" === n && t.constructor && (n = t.constructor.name),
              "Map" === n || "Set" === n
                ? Array.from(n)
                : "Arguments" === n ||
                  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                ? v(t, e)
                : void 0
            );
          }
        }
        function l(t) {
          if ("undefined" != typeof Symbol && Symbol.iterator in Object(t))
            return Array.from(t);
        }
        function f(t) {
          if (Array.isArray(t)) return v(t);
        }
        function v(t, e) {
          (null == e || e > t.length) && (e = t.length);
          for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
          return r;
        }
        function d(t, e) {
          if (!(t instanceof e))
            throw new TypeError("Cannot call a class as a function");
        }
        function g(t, e) {
          for (var n = 0; n < e.length; n++) {
            var r = e[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(t, r.key, r);
          }
        }
        function y(t, e, n) {
          return e && g(t.prototype, e), n && g(t, n), t;
        }
        function p(t, e) {
          var n = Object.keys(t);
          if (Object.getOwnPropertySymbols) {
            var r = Object.getOwnPropertySymbols(t);
            e &&
              (r = r.filter(function (e) {
                return Object.getOwnPropertyDescriptor(t, e).enumerable;
              })),
              n.push.apply(n, r);
          }
          return n;
        }
        function m(t) {
          for (var e = 1; e < arguments.length; e++) {
            var n = null != arguments[e] ? arguments[e] : {};
            e % 2
              ? p(Object(n), !0).forEach(function (e) {
                  k(t, e, n[e]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
              : p(Object(n)).forEach(function (e) {
                  Object.defineProperty(
                    t,
                    e,
                    Object.getOwnPropertyDescriptor(n, e)
                  );
                });
          }
          return t;
        }
        function k(t, e, n) {
          return (
            e in t
              ? Object.defineProperty(t, e, {
                  value: n,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                })
              : (t[e] = n),
            t
          );
        }
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var M = 1 / 0,
          x = function (t) {
            return Array.isArray
              ? Array.isArray(t)
              : "[object Array]" === Object.prototype.toString.call(t);
          },
          b = function (t) {
            if ("string" == typeof t) return t;
            var e = t + "";
            return "0" == e && 1 / t == -M ? "-0" : e;
          },
          S = function (t) {
            return null == t ? "" : b(t);
          },
          w = function (t) {
            return "string" == typeof t;
          },
          _ = function (t) {
            return "number" == typeof t;
          },
          O = function (t) {
            return null != t;
          },
          I = function (t) {
            return !t.trim().length;
          };
        function C(t, e) {
          var n = [],
            r = !1;
          return (
            (function t(e, i) {
              if (i) {
                var o = i.indexOf("."),
                  a = i,
                  s = null;
                -1 !== o && ((a = i.slice(0, o)), (s = i.slice(o + 1)));
                var c = e[a];
                if (O(c))
                  if (s || (!w(c) && !_(c)))
                    if (x(c)) {
                      r = !0;
                      for (var h = 0, u = c.length; h < u; h += 1) t(c[h], s);
                    } else s && t(c, s);
                  else n.push(S(c));
              } else n.push(e);
            })(t, e),
            r ? n : n[0]
          );
        }
        var A = {
            includeMatches: !1,
            findAllMatches: !1,
            minMatchCharLength: 1,
          },
          L = {
            isCaseSensitive: !1,
            includeScore: !1,
            keys: [],
            shouldSort: !0,
            sortFn: function (t, e) {
              return t.score === e.score
                ? t.idx < e.idx
                  ? -1
                  : 1
                : t.score < e.score
                ? -1
                : 1;
            },
          },
          $ = { location: 0, threshold: 0.6, distance: 100 },
          j = { useExtendedSearch: !1, getFn: C },
          R = m({}, L, {}, A, {}, $, {}, j);
        function P(t) {
          var e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            n = e.errors,
            r = void 0 === n ? 0 : n,
            i = e.currentLocation,
            o = void 0 === i ? 0 : i,
            a = e.expectedLocation,
            s = void 0 === a ? 0 : a,
            c = e.distance,
            h = void 0 === c ? R.distance : c,
            u = r / t.length,
            l = Math.abs(s - o);
          return h ? u + l / h : l ? 1 : u;
        }
        function E() {
          for (
            var t =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : [],
              e =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : R.minMatchCharLength,
              n = [],
              r = -1,
              i = -1,
              o = 0,
              a = t.length;
            o < a;
            o += 1
          ) {
            var s = t[o];
            s && -1 === r
              ? (r = o)
              : s ||
                -1 === r ||
                ((i = o - 1) - r + 1 >= e && n.push([r, i]), (r = -1));
          }
          return t[o - 1] && o - r >= e && n.push([r, o - 1]), n;
        }
        var N = 32;
        function F(t, e, n) {
          var r =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : {},
            i = r.location,
            o = void 0 === i ? R.location : i,
            a = r.distance,
            s = void 0 === a ? R.distance : a,
            c = r.threshold,
            h = void 0 === c ? R.threshold : c,
            u = r.findAllMatches,
            l = void 0 === u ? R.findAllMatches : u,
            f = r.minMatchCharLength,
            v = void 0 === f ? R.minMatchCharLength : f,
            d = r.includeMatches,
            g = void 0 === d ? R.includeMatches : d;
          if (e.length > N)
            throw new Error("Pattern length exceeds max of ".concat(N, "."));
          var y,
            p = e.length,
            m = t.length,
            k = Math.max(0, Math.min(o, m)),
            M = h,
            x = k,
            b = [];
          if (g) for (var S = 0; S < m; S += 1) b[S] = 0;
          for (; (y = t.indexOf(e, x)) > -1; ) {
            var w = P(e, {
              currentLocation: y,
              expectedLocation: k,
              distance: s,
            });
            if (((M = Math.min(w, M)), (x = y + p), g))
              for (var _ = 0; _ < p; ) (b[y + _] = 1), (_ += 1);
          }
          x = -1;
          for (
            var O = [],
              I = 1,
              C = p + m,
              A = 1 << (p <= N - 1 ? p - 1 : N - 2),
              L = 0;
            L < p;
            L += 1
          ) {
            for (var $ = 0, j = C; $ < j; ) {
              P(e, {
                errors: L,
                currentLocation: k + j,
                expectedLocation: k,
                distance: s,
              }) <= M
                ? ($ = j)
                : (C = j),
                (j = Math.floor((C - $) / 2 + $));
            }
            C = j;
            var F = Math.max(1, k - j + 1),
              D = l ? m : Math.min(k + j, m) + p,
              q = Array(D + 2);
            q[D + 1] = (1 << L) - 1;
            for (var W = D; W >= F; W -= 1) {
              var T = W - 1,
                U = n[t.charAt(T)];
              if (
                (U && g && (b[T] = 1),
                (q[W] = ((q[W + 1] << 1) | 1) & U),
                0 !== L && (q[W] |= ((O[W + 1] | O[W]) << 1) | 1 | O[W + 1]),
                q[W] & A &&
                  (I = P(e, {
                    errors: L,
                    currentLocation: T,
                    expectedLocation: k,
                    distance: s,
                  })) <= M)
              ) {
                if (((M = I), (x = T) <= k)) break;
                F = Math.max(1, 2 * k - x);
              }
            }
            if (
              P(e, {
                errors: L + 1,
                currentLocation: k,
                expectedLocation: k,
                distance: s,
              }) > M
            )
              break;
            O = q;
          }
          var z = { isMatch: x >= 0, score: I || 0.001 };
          return g && (z.matchedIndices = E(b, v)), z;
        }
        function D(t) {
          for (var e = {}, n = t.length, r = 0; r < n; r += 1)
            e[t.charAt(r)] = 0;
          for (var i = 0; i < n; i += 1) e[t.charAt(i)] |= 1 << (n - i - 1);
          return e;
        }
        var q = (function () {
            function t(e) {
              var n =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : {},
                r = n.location,
                i = void 0 === r ? R.location : r,
                o = n.threshold,
                a = void 0 === o ? R.threshold : o,
                s = n.distance,
                c = void 0 === s ? R.distance : s,
                h = n.includeMatches,
                u = void 0 === h ? R.includeMatches : h,
                l = n.findAllMatches,
                f = void 0 === l ? R.findAllMatches : l,
                v = n.minMatchCharLength,
                g = void 0 === v ? R.minMatchCharLength : v,
                y = n.isCaseSensitive,
                p = void 0 === y ? R.isCaseSensitive : y;
              d(this, t),
                (this.options = {
                  location: i,
                  threshold: a,
                  distance: c,
                  includeMatches: u,
                  findAllMatches: f,
                  minMatchCharLength: g,
                  isCaseSensitive: p,
                }),
                (this.pattern = p ? e : e.toLowerCase()),
                (this.chunks = []);
              for (var m = 0; m < this.pattern.length; ) {
                var k = this.pattern.substring(m, m + N);
                this.chunks.push({ pattern: k, alphabet: D(k) }), (m += N);
              }
            }
            return (
              y(t, [
                {
                  key: "searchIn",
                  value: function (t) {
                    var e = t.$;
                    return this.searchInString(e);
                  },
                },
                {
                  key: "searchInString",
                  value: function (t) {
                    var e = this.options,
                      n = e.isCaseSensitive,
                      r = e.includeMatches;
                    if ((n || (t = t.toLowerCase()), this.pattern === t)) {
                      var i = { isMatch: !0, score: 0 };
                      return r && (i.matchedIndices = [[0, t.length - 1]]), i;
                    }
                    for (
                      var o = this.options,
                        a = o.location,
                        s = o.distance,
                        h = o.threshold,
                        u = o.findAllMatches,
                        l = o.minMatchCharLength,
                        f = [],
                        v = 0,
                        d = !1,
                        g = 0,
                        y = this.chunks.length;
                      g < y;
                      g += 1
                    ) {
                      var p = this.chunks[g],
                        m = F(t, p.pattern, p.alphabet, {
                          location: a + N * g,
                          distance: s,
                          threshold: h,
                          findAllMatches: u,
                          minMatchCharLength: l,
                          includeMatches: r,
                        }),
                        k = m.isMatch,
                        M = m.score,
                        x = m.matchedIndices;
                      k && (d = !0),
                        (v += M),
                        k && x && (f = [].concat(c(f), c(x)));
                    }
                    var b = {
                      isMatch: d,
                      score: d ? v / this.chunks.length : 1,
                    };
                    return d && r && (b.matchedIndices = f), b;
                  },
                },
              ]),
              t
            );
          })(),
          W = (function () {
            function t(e) {
              d(this, t), (this.pattern = e);
            }
            return (
              y(
                t,
                [{ key: "search", value: function () {} }],
                [
                  {
                    key: "isMultiMatch",
                    value: function (t) {
                      return T(t, this.multiRegex);
                    },
                  },
                  {
                    key: "isSingleMatch",
                    value: function (t) {
                      return T(t, this.singleRegex);
                    },
                  },
                ]
              ),
              t
            );
          })();
        function T(t, e) {
          var n = t.match(e);
          return n ? n[1] : null;
        }
        var U = (function (t) {
            e(i, W);
            var n = r(i);
            function i(t) {
              return d(this, i), n.call(this, t);
            }
            return (
              y(
                i,
                [
                  {
                    key: "search",
                    value: function (t) {
                      for (
                        var e, n = 0, r = [], i = this.pattern.length;
                        (e = t.indexOf(this.pattern, n)) > -1;

                      )
                        (n = e + i), r.push([e, n - 1]);
                      var o = !!r.length;
                      return {
                        isMatch: o,
                        score: o ? 1 : 0,
                        matchedIndices: r,
                      };
                    },
                  },
                ],
                [
                  {
                    key: "type",
                    get: function () {
                      return "exact";
                    },
                  },
                  {
                    key: "multiRegex",
                    get: function () {
                      return /^'"(.*)"$/;
                    },
                  },
                  {
                    key: "singleRegex",
                    get: function () {
                      return /^'(.*)$/;
                    },
                  },
                ]
              ),
              i
            );
          })(),
          z = (function (t) {
            e(i, W);
            var n = r(i);
            function i(t) {
              return d(this, i), n.call(this, t);
            }
            return (
              y(
                i,
                [
                  {
                    key: "search",
                    value: function (t) {
                      var e = -1 === t.indexOf(this.pattern);
                      return {
                        isMatch: e,
                        score: e ? 0 : 1,
                        matchedIndices: [0, t.length - 1],
                      };
                    },
                  },
                ],
                [
                  {
                    key: "type",
                    get: function () {
                      return "inverse-exact";
                    },
                  },
                  {
                    key: "multiRegex",
                    get: function () {
                      return /^!"(.*)"$/;
                    },
                  },
                  {
                    key: "singleRegex",
                    get: function () {
                      return /^!(.*)$/;
                    },
                  },
                ]
              ),
              i
            );
          })(),
          J = (function (t) {
            e(i, W);
            var n = r(i);
            function i(t) {
              return d(this, i), n.call(this, t);
            }
            return (
              y(
                i,
                [
                  {
                    key: "search",
                    value: function (t) {
                      var e = t.startsWith(this.pattern);
                      return {
                        isMatch: e,
                        score: e ? 0 : 1,
                        matchedIndices: [0, this.pattern.length - 1],
                      };
                    },
                  },
                ],
                [
                  {
                    key: "type",
                    get: function () {
                      return "prefix-exact";
                    },
                  },
                  {
                    key: "multiRegex",
                    get: function () {
                      return /^\^"(.*)"$/;
                    },
                  },
                  {
                    key: "singleRegex",
                    get: function () {
                      return /^\^(.*)$/;
                    },
                  },
                ]
              ),
              i
            );
          })(),
          K = (function (t) {
            e(i, W);
            var n = r(i);
            function i(t) {
              return d(this, i), n.call(this, t);
            }
            return (
              y(
                i,
                [
                  {
                    key: "search",
                    value: function (t) {
                      var e = !t.startsWith(this.pattern);
                      return {
                        isMatch: e,
                        score: e ? 0 : 1,
                        matchedIndices: [0, t.length - 1],
                      };
                    },
                  },
                ],
                [
                  {
                    key: "type",
                    get: function () {
                      return "inverse-prefix-exact";
                    },
                  },
                  {
                    key: "multiRegex",
                    get: function () {
                      return /^!\^"(.*)"$/;
                    },
                  },
                  {
                    key: "singleRegex",
                    get: function () {
                      return /^!\^(.*)$/;
                    },
                  },
                ]
              ),
              i
            );
          })(),
          B = (function (t) {
            e(i, W);
            var n = r(i);
            function i(t) {
              return d(this, i), n.call(this, t);
            }
            return (
              y(
                i,
                [
                  {
                    key: "search",
                    value: function (t) {
                      var e = t.endsWith(this.pattern);
                      return {
                        isMatch: e,
                        score: e ? 0 : 1,
                        matchedIndices: [
                          t.length - this.pattern.length,
                          t.length - 1,
                        ],
                      };
                    },
                  },
                ],
                [
                  {
                    key: "type",
                    get: function () {
                      return "suffix-exact";
                    },
                  },
                  {
                    key: "multiRegex",
                    get: function () {
                      return /^"(.*)"\$$/;
                    },
                  },
                  {
                    key: "singleRegex",
                    get: function () {
                      return /^(.*)\$$/;
                    },
                  },
                ]
              ),
              i
            );
          })(),
          G = (function (t) {
            e(i, W);
            var n = r(i);
            function i(t) {
              return d(this, i), n.call(this, t);
            }
            return (
              y(
                i,
                [
                  {
                    key: "search",
                    value: function (t) {
                      var e = !t.endsWith(this.pattern);
                      return {
                        isMatch: e,
                        score: e ? 0 : 1,
                        matchedIndices: [0, t.length - 1],
                      };
                    },
                  },
                ],
                [
                  {
                    key: "type",
                    get: function () {
                      return "inverse-suffix-exact";
                    },
                  },
                  {
                    key: "multiRegex",
                    get: function () {
                      return /^!"(.*)"\$$/;
                    },
                  },
                  {
                    key: "singleRegex",
                    get: function () {
                      return /^!(.*)\$$/;
                    },
                  },
                ]
              ),
              i
            );
          })(),
          H = (function (t) {
            e(i, W);
            var n = r(i);
            function i(t) {
              var e,
                r =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : {},
                o = r.location,
                a = void 0 === o ? R.location : o,
                s = r.threshold,
                c = void 0 === s ? R.threshold : s,
                h = r.distance,
                u = void 0 === h ? R.distance : h,
                l = r.includeMatches,
                f = void 0 === l ? R.includeMatches : l,
                v = r.findAllMatches,
                g = void 0 === v ? R.findAllMatches : v,
                y = r.minMatchCharLength,
                p = void 0 === y ? R.minMatchCharLength : y,
                m = r.isCaseSensitive,
                k = void 0 === m ? R.isCaseSensitive : m;
              return (
                d(this, i),
                ((e = n.call(this, t))._bitapSearch = new q(t, {
                  location: a,
                  threshold: c,
                  distance: u,
                  includeMatches: f,
                  findAllMatches: g,
                  minMatchCharLength: p,
                  isCaseSensitive: k,
                })),
                e
              );
            }
            return (
              y(
                i,
                [
                  {
                    key: "search",
                    value: function (t) {
                      return this._bitapSearch.searchInString(t);
                    },
                  },
                ],
                [
                  {
                    key: "type",
                    get: function () {
                      return "fuzzy";
                    },
                  },
                  {
                    key: "multiRegex",
                    get: function () {
                      return /^"(.*)"$/;
                    },
                  },
                  {
                    key: "singleRegex",
                    get: function () {
                      return /^(.*)$/;
                    },
                  },
                ]
              ),
              i
            );
          })(),
          Q = [U, J, K, G, B, z, H],
          V = Q.length,
          X = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/,
          Y = "|";
        function Z(t) {
          var e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          return t.split(Y).map(function (t) {
            for (
              var n = t
                  .trim()
                  .split(X)
                  .filter(function (t) {
                    return t && !!t.trim();
                  }),
                r = [],
                i = 0,
                o = n.length;
              i < o;
              i += 1
            ) {
              for (var a = n[i], s = !1, c = -1; !s && ++c < V; ) {
                var h = Q[c],
                  u = h.isMultiMatch(a);
                u && (r.push(new h(u, e)), (s = !0));
              }
              if (!s)
                for (c = -1; ++c < V; ) {
                  var l = Q[c],
                    f = l.isSingleMatch(a);
                  if (f) {
                    r.push(new l(f, e));
                    break;
                  }
                }
            }
            return r;
          });
        }
        var tt = new Set([H.type, U.type]),
          et = (function () {
            function t(e) {
              var n =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : {},
                r = n.isCaseSensitive,
                i = void 0 === r ? R.isCaseSensitive : r,
                o = n.includeMatches,
                a = void 0 === o ? R.includeMatches : o,
                s = n.minMatchCharLength,
                c = void 0 === s ? R.minMatchCharLength : s,
                h = n.findAllMatches,
                u = void 0 === h ? R.findAllMatches : h,
                l = n.location,
                f = void 0 === l ? R.location : l,
                v = n.threshold,
                g = void 0 === v ? R.threshold : v,
                y = n.distance,
                p = void 0 === y ? R.distance : y;
              d(this, t),
                (this.query = null),
                (this.options = {
                  isCaseSensitive: i,
                  includeMatches: a,
                  minMatchCharLength: c,
                  findAllMatches: u,
                  location: f,
                  threshold: g,
                  distance: p,
                }),
                (this.pattern = i ? e : e.toLowerCase()),
                (this.query = Z(this.pattern, this.options));
            }
            return (
              y(
                t,
                [
                  {
                    key: "searchIn",
                    value: function (t) {
                      var e = this.query;
                      if (!e) return { isMatch: !1, score: 1 };
                      var n = t.$,
                        r = this.options,
                        i = r.includeMatches;
                      n = r.isCaseSensitive ? n : n.toLowerCase();
                      for (
                        var o = 0, a = [], s = 0, h = 0, u = e.length;
                        h < u;
                        h += 1
                      ) {
                        var l = e[h];
                        (a.length = 0), (o = 0);
                        for (var f = 0, v = l.length; f < v; f += 1) {
                          var d = l[f],
                            g = d.search(n),
                            y = g.isMatch,
                            p = g.matchedIndices,
                            m = g.score;
                          if (!y) {
                            (s = 0), (o = 0), (a.length = 0);
                            break;
                          }
                          if (((o += 1), (s += m), i)) {
                            var k = d.constructor.type;
                            tt.has(k) ? (a = [].concat(c(a), c(p))) : a.push(p);
                          }
                        }
                        if (o) {
                          var M = { isMatch: !0, score: s / o };
                          return i && (M.matchedIndices = a), M;
                        }
                      }
                      return { isMatch: !1, score: 1 };
                    },
                  },
                ],
                [
                  {
                    key: "condition",
                    value: function (t, e) {
                      return e.useExtendedSearch;
                    },
                  },
                ]
              ),
              t
            );
          })(),
          nt = /[^ ]+/g;
        function rt(t, e) {
          var n = (
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : {}
            ).getFn,
            r = void 0 === n ? R.getFn : n,
            i = [];
          if (w(e[0]))
            for (var o = 0, a = e.length; o < a; o += 1) {
              var s = e[o];
              if (O(s) && !I(s)) {
                var c = { $: s, idx: o, t: s.match(nt).length };
                i.push(c);
              }
            }
          else
            for (var h = t.length, u = 0, l = e.length; u < l; u += 1) {
              for (var f = e[u], v = { idx: u, $: {} }, d = 0; d < h; d += 1) {
                var g = t[d],
                  y = r(f, g);
                if (O(y))
                  if (x(y)) {
                    for (
                      var p = [], m = [{ arrayIndex: -1, value: y }];
                      m.length;

                    ) {
                      var k = m.pop(),
                        M = k.arrayIndex,
                        b = k.value;
                      if (O(b))
                        if (w(b) && !I(b)) {
                          var S = { $: b, idx: M, t: b.match(nt).length };
                          p.push(S);
                        } else if (x(b))
                          for (var _ = 0, C = b.length; _ < C; _ += 1)
                            m.push({ arrayIndex: _, value: b[_] });
                    }
                    v.$[g] = p;
                  } else if (!I(y)) {
                    var A = { $: y, t: y.match(nt).length };
                    v.$[g] = A;
                  }
              }
              i.push(v);
            }
          return i;
        }
        var it = (function () {
          function t(e) {
            if (
              (d(this, t),
              (this._keys = {}),
              (this._keyNames = []),
              (this._length = e.length),
              e.length && w(e[0]))
            )
              for (var n = 0; n < this._length; n += 1) {
                var r = e[n];
                (this._keys[r] = { weight: 1 }), this._keyNames.push(r);
              }
            else {
              for (var i = 0, o = 0; o < this._length; o += 1) {
                var a = e[o];
                if (!Object.prototype.hasOwnProperty.call(a, "name"))
                  throw new Error('Missing "name" property in key object');
                var s = a.name;
                if (
                  (this._keyNames.push(s),
                  !Object.prototype.hasOwnProperty.call(a, "weight"))
                )
                  throw new Error('Missing "weight" property in key object');
                var c = a.weight;
                if (c <= 0 || c >= 1)
                  throw new Error(
                    '"weight" property in key must be in the range of (0, 1)'
                  );
                (this._keys[s] = { weight: c }), (i += c);
              }
              for (var h = 0; h < this._length; h += 1) {
                var u = this._keyNames[h],
                  l = this._keys[u].weight;
                this._keys[u].weight = l / i;
              }
            }
          }
          return (
            y(t, [
              {
                key: "get",
                value: function (t, e) {
                  return this._keys[t] ? this._keys[t][e] : -1;
                },
              },
              {
                key: "keys",
                value: function () {
                  return this._keyNames;
                },
              },
              {
                key: "count",
                value: function () {
                  return this._length;
                },
              },
              {
                key: "toJSON",
                value: function () {
                  return JSON.stringify(this._keys);
                },
              },
            ]),
            t
          );
        })();
        function ot(t, e) {
          var n = t.matches;
          if (((e.matches = []), O(n)))
            for (var r = 0, i = n.length; r < i; r += 1) {
              var o = n[r];
              if (O(o.indices) && 0 !== o.indices.length) {
                var a = { indices: o.indices, value: o.value };
                o.key && (a.key = o.key),
                  o.idx > -1 && (a.refIndex = o.idx),
                  e.matches.push(a);
              }
            }
        }
        function at(t, e) {
          e.score = t.score;
        }
        var st = [];
        function ct() {
          st.push.apply(st, arguments);
        }
        var ht = (function () {
          function t(e) {
            var n =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {},
              r =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : null;
            d(this, t),
              (this.options = m({}, R, {}, n)),
              this._processKeys(this.options.keys),
              this.setCollection(e, r);
          }
          return (
            y(t, [
              {
                key: "setCollection",
                value: function (t) {
                  var e =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : null;
                  (this.list = t),
                    (this.listIsStringArray = w(t[0])),
                    e ? this.setIndex(e) : this.setIndex(this._createIndex());
                },
              },
              {
                key: "setIndex",
                value: function (t) {
                  this._indexedList = t;
                },
              },
              {
                key: "_processKeys",
                value: function (t) {
                  this._keyStore = new it(t);
                },
              },
              {
                key: "_createIndex",
                value: function () {
                  return rt(this._keyStore.keys(), this.list, {
                    getFn: this.options.getFn,
                  });
                },
              },
              {
                key: "search",
                value: function (t) {
                  var e =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : { limit: !1 };
                  if (!(t = t.trim()).length) return [];
                  for (
                    var n = this.options.shouldSort,
                      r = null,
                      i = 0,
                      o = st.length;
                    i < o;
                    i += 1
                  ) {
                    var a = st[i];
                    if (a.condition(t, this.options)) {
                      r = new a(t, this.options);
                      break;
                    }
                  }
                  r || (r = new q(t, this.options));
                  var s = this._searchUsing(r);
                  return (
                    this._computeScore(s),
                    n && this._sort(s),
                    e.limit && _(e.limit) && (s = s.slice(0, e.limit)),
                    this._format(s)
                  );
                },
              },
              {
                key: "_searchUsing",
                value: function (t) {
                  var e = this._indexedList,
                    n = [],
                    r = this.options.includeMatches;
                  if (this.listIsStringArray)
                    for (var i = 0, o = e.length; i < o; i += 1) {
                      var a = e[i],
                        s = a.$,
                        c = a.idx,
                        h = a.t;
                      if (O(s)) {
                        var u = t.searchIn(a),
                          l = u.isMatch,
                          f = u.score;
                        if (l) {
                          var v = { score: f, value: s, t: h };
                          r && (v.indices = u.matchedIndices),
                            n.push({ item: s, idx: c, matches: [v] });
                        }
                      }
                    }
                  else
                    for (
                      var d = this._keyStore.keys(),
                        g = this._keyStore.count(),
                        y = 0,
                        p = e.length;
                      y < p;
                      y += 1
                    ) {
                      var m = e[y],
                        k = m.$,
                        M = m.idx;
                      if (O(k)) {
                        for (var b = [], S = 0; S < g; S += 1) {
                          var w = d[S],
                            _ = k[w];
                          if (O(_))
                            if (x(_))
                              for (var I = 0, C = _.length; I < C; I += 1) {
                                var A = _[I],
                                  L = A.$,
                                  $ = A.idx,
                                  j = A.t;
                                if (O(L)) {
                                  var R = t.searchIn(A),
                                    P = R.isMatch,
                                    E = R.score;
                                  if (P) {
                                    var N = {
                                      score: E,
                                      key: w,
                                      value: L,
                                      idx: $,
                                      t: j,
                                    };
                                    r && (N.indices = R.matchedIndices),
                                      b.push(N);
                                  }
                                }
                              }
                            else {
                              var F = _.$,
                                D = _.t,
                                q = t.searchIn(_),
                                W = q.isMatch,
                                T = q.score;
                              if (!W) continue;
                              var U = { score: T, key: w, value: F, t: D };
                              r && (U.indices = q.matchedIndices), b.push(U);
                            }
                        }
                        b.length && n.push({ idx: M, item: k, matches: b });
                      }
                    }
                  return n;
                },
              },
              {
                key: "_computeScore",
                value: function (t) {
                  for (var e = t.length, n = 0; n < e; n += 1) {
                    for (
                      var r = t[n], i = r.matches, o = i.length, a = 1, s = 0;
                      s < o;
                      s += 1
                    ) {
                      var c = i[s],
                        h = c.key,
                        u = c.t,
                        l = this._keyStore.get(h, "weight"),
                        f = l > -1 ? l : 1,
                        v = 0 === c.score && l > -1 ? Number.EPSILON : c.score,
                        d = 1 / Math.sqrt(u);
                      a *= Math.pow(v, f * d);
                    }
                    r.score = a;
                  }
                },
              },
              {
                key: "_sort",
                value: function (t) {
                  t.sort(this.options.sortFn);
                },
              },
              {
                key: "_format",
                value: function (t) {
                  var e = [],
                    n = this.options,
                    r = n.includeMatches,
                    i = n.includeScore,
                    o = [];
                  r && o.push(ot), i && o.push(at);
                  for (var a = 0, s = t.length; a < s; a += 1) {
                    var c = t[a],
                      h = c.idx,
                      u = { item: this.list[h], refIndex: h };
                    if (o.length)
                      for (var l = 0, f = o.length; l < f; l += 1) o[l](c, u);
                    e.push(u);
                  }
                  return e;
                },
              },
            ]),
            t
          );
        })();
        ct(et), (ht.version = "5.2.3"), (ht.createIndex = rt), (ht.config = R);
        var ut = ht;
        exports.default = ut;
      },
      {},
    ],
    wYBQ: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = n(require("./Logger"));
        function n(e) {
          return e && e.__esModule ? e : { default: e };
        }
        function a(e, n) {
          if (!(e instanceof n))
            throw new TypeError("Cannot call a class as a function");
        }
        function t(e, n) {
          for (var a = 0; a < n.length; a++) {
            var t = n[a];
            (t.enumerable = t.enumerable || !1),
              (t.configurable = !0),
              "value" in t && (t.writable = !0),
              Object.defineProperty(e, t.key, t);
          }
        }
        function l(e, n, a) {
          return n && t(e.prototype, n), a && t(e, a), e;
        }
        var r = (function () {
          function n() {
            a(this, n);
          }
          return (
            l(n, null, [
              {
                key: "launch",
                value: function (n, a) {
                  e.default.info(
                    "Game Launch",
                    "Preparing to launch install " + n
                  ),
                    n.archived
                      ? (a.commit("select_install", { install: n }),
                        a.commit("show_modal", { modal: "install_unarchive" }))
                      : (ddmm.mods.launchInstall(n.folderName),
                        e.default.info("Game Launch", "Launched " + n));
                },
              },
            ]),
            n
          );
        })();
        exports.default = r;
      },
      { "./Logger": "vKp2" },
    ],
    C46U: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var A = {
          name: "LazyLoadedImage",
          props: ["src", "alt", "width", "height"],
          data: function () {
            return {
              realSrc:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNv1OCegAAAANSURBVBhXY2BgYEgBAABpAGW2L9BbAAAAAElFTkSuQmCC",
            };
          },
          mounted: function () {
            var A = this;
            ddmm.fileToURLAsync(this.src).then(function (e) {
              A.realSrc = e;
            });
          },
        };
        exports.default = A;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this.$createElement;
                return (this._self._c || t)("img", {
                  attrs: {
                    src: this.realSrc,
                    alt: this.alt,
                    width: this.width,
                    height: this.height,
                  },
                });
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-62eceb",
              functional: void 0,
            });
        })();
      },
      {},
    ],
    sF0v: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var t = e(require("../../../js/utils/Launcher")),
          o = e(require("../../elements/LazyLoadedImage")),
          n = e(require("../../elements/Link"));
        function e(t) {
          return t && t.__esModule ? t : { default: t };
        }
        var i = {
          name: "InstallView",
          components: { LazyLoadedImage: o.default, Link: n.default },
          props: ["install"],
          methods: {
            _: ddmm.translate,
            openFolder: ddmm.app.showFile,
            openURL: ddmm.app.openURL,
            getPathToInstall: function (t) {
              return ddmm.joinPath(
                ddmm.config.readConfigValue("installFolder"),
                "installs",
                t
              );
            },
            getPathToScreenshot: function (t, o) {
              return ddmm.joinPath(
                ddmm.config.readConfigValue("installFolder"),
                "installs",
                t,
                "install",
                o
              );
            },
            openScreenshot: function (t, o) {
              ddmm.app.showFile(
                ddmm.joinPath(
                  ddmm.config.readConfigValue("installFolder"),
                  "installs",
                  t,
                  "install",
                  o
                )
              );
            },
            launchInstall: function (o) {
              t.default.launch(o, this.$store);
            },
            exportMonika: function () {
              ddmm.mods.exportMAS(this.installFolder);
            },
            showOptions: function (t) {
              this.$store.commit("select_install", { install: t }),
                this.$store.commit("show_modal", { modal: "install_options" });
            },
            formatTime: function (t) {
              var o = t / 1e3,
                n = Math.floor(o / 3600),
                e = o % 3600,
                i = Math.floor(e / 60);
              return (
                n.toString().padStart(2, "0") +
                ":" +
                i.toString().padStart(2, "0")
              );
            },
            formatSize: function (t) {
              if (0 === t) return "0 B";
              var o = Math.floor(Math.log(t) / Math.log(1024));
              return (
                parseFloat((t / Math.pow(1024, o)).toFixed(2)) +
                " " +
                ["B", "KiB", "MiB", "GiB", "TiB"][o]
              );
            },
            doBackground: function () {
              this.$store.commit(
                "override_background",
                ddmm.mods.getInstallBackground(this.install.folderName)
              );
            },
            importMAS: function (t) {
              ddmm.mods.importMAS(t);
            },
          },
          watch: {
            "install.folderName": function () {
              var t = this;
              this.$nextTick(function () {
                t.doBackground();
              });
            },
          },
          mounted: function () {
            var t = this;
            this.$nextTick(function () {
              t.doBackground();
            });
          },
          destroyed: function () {
            this.$store.commit("override_background", null);
          },
        };
        exports.default = i;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this,
                  s = t.$createElement,
                  e = t._self._c || s;
                return t.install
                  ? e("div", [
                      e("div", { staticClass: "header-content" }, [
                        e("h1", [
                          t._v(t._s(t.install.name) + " "),
                          e("small", [
                            e(
                              "a",
                              {
                                attrs: {
                                  href: "javascript:;",
                                  title: t._(
                                    "renderer.tab_mods.install.description_external"
                                  ),
                                },
                                on: {
                                  click: function (s) {
                                    t.openFolder(
                                      t.getPathToInstall(t.install.folderName)
                                    );
                                  },
                                },
                              },
                              [
                                e("i", {
                                  staticClass: "fas fa-external-link-alt",
                                }),
                              ]
                            ),
                          ]),
                          t._v(" "),
                          t.install.archived
                            ? e("span", { staticClass: "tag" }, [
                                t._v(
                                  t._s(
                                    t._(
                                      "renderer.tab_mods.install.tag_archived"
                                    )
                                  )
                                ),
                              ])
                            : t._e(),
                          t._v(" "),
                          t.install.globalSave
                            ? e("span", { staticClass: "tag" }, [
                                t._v(
                                  t._s(
                                    t._(
                                      "renderer.tab_mods.install.tag_global_save"
                                    )
                                  )
                                ),
                              ])
                            : t._e(),
                          t._v(" "),
                          t.install.mod && t.install.mod.uses_sdk
                            ? e("span", { staticClass: "tag" }, [
                                t._v(
                                  t._s(t._("renderer.tab_mods.install.tag_sdk"))
                                ),
                              ])
                            : t._e(),
                        ]),
                        t._v(" "),
                        e("div", [
                          e("i", { staticClass: "fas fa-clock" }),
                          t._v(" "),
                          e("strong", [
                            t._v(t._s(t.formatTime(t.install.playTime))),
                          ]),
                          t._v("   "),
                          e("i", { staticClass: "fas fa-hdd" }),
                          t._v(" "),
                          e("strong", [
                            t._v(t._s(t.formatSize(t.install.size))),
                          ]),
                        ]),
                        t._v(" "),
                        e("br"),
                        t._v(" "),
                        e("p", [
                          2 !== t.install.monikaExportStatus
                            ? e(
                                "button",
                                {
                                  staticClass: "success",
                                  on: {
                                    click: function (s) {
                                      return t.launchInstall(t.install);
                                    },
                                  },
                                },
                                [
                                  e("i", { staticClass: "fas fa-play fa-fw" }),
                                  t._v(
                                    " " +
                                      t._s(
                                        t._(
                                          "renderer.tab_mods.install.button_launch"
                                        )
                                      ) +
                                      " "
                                  ),
                                ]
                              )
                            : e(
                                "button",
                                {
                                  staticClass: "primary",
                                  on: {
                                    click: function (s) {
                                      return t.importMAS(t.install.folderName);
                                    },
                                  },
                                },
                                [
                                  e("i", { staticClass: "fas fa-heart fa-fw" }),
                                  t._v(
                                    " " +
                                      t._s(
                                        t._(
                                          "renderer.tab_mods.install.button_mas_import"
                                        )
                                      ) +
                                      " "
                                  ),
                                ]
                              ),
                          t._v(" "),
                          e(
                            "button",
                            {
                              staticClass: "secondary",
                              on: {
                                click: function (s) {
                                  return t.showOptions(t.install);
                                },
                              },
                            },
                            [
                              e("i", { staticClass: "fas fa-cog fa-fw" }),
                              t._v(
                                " " +
                                  t._s(
                                    t._(
                                      "renderer.tab_mods.install.button_settings"
                                    )
                                  ) +
                                  " "
                              ),
                            ]
                          ),
                        ]),
                      ]),
                      t._v(" "),
                      e(
                        "div",
                        { staticClass: "main-content" },
                        [
                          e("br"),
                          t._v(" "),
                          1 === t.install.monikaExportStatus
                            ? [
                                e(
                                  "div",
                                  { staticClass: "mas-export-control" },
                                  [
                                    e("h3", [
                                      t._v(
                                        t._s(
                                          t._(
                                            "renderer.tab_mods.install.title_mas_export"
                                          )
                                        )
                                      ),
                                    ]),
                                    t._v(" "),
                                    e("p", [
                                      t._v(
                                        t._s(
                                          t._(
                                            "renderer.tab_mods.install.description_mas_export"
                                          )
                                        )
                                      ),
                                    ]),
                                    t._v(" "),
                                    e(
                                      "button",
                                      {
                                        staticClass: "primary",
                                        on: { click: t.exportMonika },
                                      },
                                      [
                                        e("i", {
                                          staticClass: "fas fa-heart fa-fw",
                                        }),
                                        t._v(
                                          " " +
                                            t._s(
                                              t._(
                                                "renderer.tab_mods.install.button_mas_export"
                                              )
                                            ) +
                                            " "
                                        ),
                                      ]
                                    ),
                                  ]
                                ),
                                t._v(" "),
                                e("br"),
                              ]
                            : t._e(),
                          t._v(" "),
                          t.install.installFailed
                            ? [
                                e(
                                  "div",
                                  { staticClass: "install-failed-control" },
                                  [
                                    e("h3", [
                                      t._v(
                                        t._s(
                                          t._(
                                            "renderer.tab_mods.install.title_install_failed"
                                          )
                                        )
                                      ),
                                    ]),
                                    t._v(" "),
                                    e("p", [
                                      t._v(
                                        t._s(
                                          t._(
                                            "renderer.tab_mods.install.description_install_failed"
                                          )
                                        )
                                      ),
                                    ]),
                                    t._v(" "),
                                    e("br"),
                                    t._v(" "),
                                    e(
                                      "p",
                                      [
                                        e(
                                          "Link",
                                          {
                                            attrs: {
                                              to: "https://help.doki.space/user-guide/reference/mod-install-troubleshooting.html",
                                            },
                                          },
                                          [
                                            e("i", {
                                              staticClass: "fas fa-book fa-fw",
                                            }),
                                            t._v(
                                              " " +
                                                t._s(
                                                  t._(
                                                    "renderer.tab_mods.install.link_troubleshooting"
                                                  )
                                                ) +
                                                " "
                                            ),
                                          ]
                                        ),
                                      ],
                                      1
                                    ),
                                    t._v(" "),
                                    e("br"),
                                    t._v(" "),
                                    e("p", [
                                      t._v(
                                        t._s(
                                          t._(
                                            "renderer.tab_mods.install.description_install_failed_launch_again"
                                          )
                                        )
                                      ),
                                    ]),
                                  ]
                                ),
                                t._v(" "),
                                e("br"),
                              ]
                            : t._e(),
                          t._v(" "),
                          t.install.singletonError
                            ? [
                                e(
                                  "div",
                                  { staticClass: "install-failed-control" },
                                  [
                                    e("h3", [
                                      t._v(
                                        t._s(
                                          t._(
                                            "renderer.tab_mods.install.title_singleton_error"
                                          )
                                        )
                                      ),
                                    ]),
                                    t._v(" "),
                                    e("p", [
                                      t._v(
                                        t._s(
                                          t._(
                                            "renderer.tab_mods.install.description_singleton_error"
                                          )
                                        )
                                      ),
                                    ]),
                                    t._v(" "),
                                    e("br"),
                                    t._v(" "),
                                    e(
                                      "p",
                                      [
                                        e(
                                          "Link",
                                          {
                                            attrs: {
                                              to: "https://help.doki.space/user-guide/reference/mod-install-troubleshooting.html",
                                            },
                                          },
                                          [
                                            e("i", {
                                              staticClass: "fas fa-book fa-fw",
                                            }),
                                            t._v(
                                              " " +
                                                t._s(
                                                  t._(
                                                    "renderer.tab_mods.install.link_troubleshooting"
                                                  )
                                                ) +
                                                " "
                                            ),
                                          ]
                                        ),
                                      ],
                                      1
                                    ),
                                    t._v(" "),
                                    e("br"),
                                    t._v(" "),
                                    e("p", [
                                      t._v(
                                        t._s(
                                          t._(
                                            "renderer.tab_mods.install.description_install_failed_launch_again"
                                          )
                                        )
                                      ),
                                    ]),
                                  ]
                                ),
                                t._v(" "),
                                e("br"),
                              ]
                            : t._e(),
                          t._v(" "),
                          t.install.mod
                            ? [
                                e("h2", [t._v(t._s(t.install.mod.name))]),
                                t._v(" "),
                                e("p", [
                                  e("strong", [
                                    t._v(
                                      t._s(
                                        t._(
                                          "renderer.tab_mods.install.description_author",
                                          t.install.mod.author
                                        )
                                      )
                                    ),
                                  ]),
                                ]),
                                t._v(" "),
                                e("br"),
                                t._v(" "),
                                e("p", [t._v(t._s(t.install.mod.description))]),
                                t._v(" "),
                                t.install.mod.website || t.install.mod.discord
                                  ? [
                                      e("br"),
                                      t._v(" "),
                                      t.install.mod.website
                                        ? e("p", [
                                            e(
                                              "a",
                                              {
                                                attrs: { href: "javascript:;" },
                                                on: {
                                                  click: function (s) {
                                                    return t.openURL(
                                                      t.install.mod.website
                                                    );
                                                  },
                                                },
                                              },
                                              [
                                                e("i", {
                                                  staticClass:
                                                    "fas fa-fw fa-globe",
                                                }),
                                                t._v(
                                                  " " +
                                                    t._s(
                                                      t._(
                                                        "renderer.tab_mods.install.link_website",
                                                        t.install.mod.website
                                                      )
                                                    )
                                                ),
                                              ]
                                            ),
                                          ])
                                        : t._e(),
                                      t._v(" "),
                                      t.install.mod.discord
                                        ? e("p", [
                                            e(
                                              "a",
                                              {
                                                attrs: { href: "javascript:;" },
                                                on: {
                                                  click: function (s) {
                                                    return t.openURL(
                                                      "https://discord.gg/" +
                                                        t.install.mod.discord
                                                    );
                                                  },
                                                },
                                              },
                                              [
                                                e("i", {
                                                  staticClass:
                                                    "fab fa-fw fa-discord",
                                                }),
                                                t._v(
                                                  " " +
                                                    t._s(
                                                      t._(
                                                        "renderer.tab_mods.install.link_discord",
                                                        "discord.gg/" +
                                                          t.install.mod.discord
                                                      )
                                                    )
                                                ),
                                              ]
                                            ),
                                          ])
                                        : t._e(),
                                    ]
                                  : t._e(),
                                t._v(" "),
                                e("br"),
                              ]
                            : t._e(),
                          t._v(" "),
                          t.install.screenshots.length > 1
                            ? e("h2", [
                                t._v(
                                  t._s(
                                    t._(
                                      "renderer.tab_mods.install.title_screenshots",
                                      t.install.screenshots.length
                                    )
                                  )
                                ),
                              ])
                            : 1 === t.install.screenshots.length
                            ? e("h2", [
                                t._v(
                                  " " +
                                    t._s(
                                      t._(
                                        "renderer.tab_mods.install.title_screenshots_one"
                                      )
                                    )
                                ),
                              ])
                            : e("h2", [
                                t._v(
                                  t._s(
                                    t._(
                                      "renderer.tab_mods.install.title_screenshots_none"
                                    )
                                  )
                                ),
                              ]),
                          t._v(" "),
                          e("p", [
                            t._v(
                              t._s(
                                t._(
                                  "renderer.tab_mods.install.description_screenshots"
                                )
                              )
                            ),
                          ]),
                          t._v(" "),
                          e("br"),
                          t._v(" "),
                          t.install.screenshots.length > 0
                            ? e(
                                "div",
                                { staticClass: "screenshots" },
                                t._l(t.install.screenshots, function (s) {
                                  return e("LazyLoadedImage", {
                                    key: t.install.folderName + s,
                                    attrs: {
                                      alt: s,
                                      src: t.getPathToScreenshot(
                                        t.install.folderName,
                                        s
                                      ),
                                      width: "150",
                                    },
                                    nativeOn: {
                                      click: function (e) {
                                        return t.openScreenshot(
                                          t.install.folderName,
                                          s
                                        );
                                      },
                                    },
                                  });
                                }),
                                1
                              )
                            : t._e(),
                          t._v(" "),
                          t.install.achievements
                            ? [
                                e("br"),
                                t._v(" "),
                                e("h2", [
                                  t._v(
                                    t._s(
                                      t._(
                                        "renderer.tab_mods.install.title_achievements",
                                        t.install.achievements.filter(function (
                                          t
                                        ) {
                                          return t.earned;
                                        }).length,
                                        t.install.achievements.length
                                      )
                                    )
                                  ),
                                ]),
                                t._v(" "),
                                t.install.achievements.filter(function (t) {
                                  return t.earned;
                                }).length < t.install.achievements.length
                                  ? e("p", [
                                      t._v(
                                        " " +
                                          t._s(
                                            t._(
                                              "renderer.tab_mods.install.description_achievements"
                                            )
                                          )
                                      ),
                                    ])
                                  : e("p", [
                                      t._v(
                                        t._s(
                                          t._(
                                            "renderer.tab_mods.install.description_achievements_complete"
                                          )
                                        )
                                      ),
                                    ]),
                                t._v(" "),
                                t._l(t.install.achievements, function (s) {
                                  return [
                                    e("br"),
                                    t._v(" "),
                                    e("div", [
                                      e("p", [
                                        e("strong", [t._v(t._s(s.name))]),
                                      ]),
                                      t._v(" "),
                                      e("p", [t._v(t._s(s.description))]),
                                      t._v(" "),
                                      s.earned
                                        ? e("p", [
                                            e("i", {
                                              staticClass:
                                                "fas fa-lock-open fa-fw",
                                            }),
                                            t._v(
                                              " " +
                                                t._s(
                                                  t._(
                                                    "renderer.tab_mods.install.description_achievement_earned"
                                                  )
                                                )
                                            ),
                                          ])
                                        : e("p", [
                                            e("i", {
                                              staticClass: "fas fa-lock fa-fw",
                                            }),
                                            t._v(
                                              " " +
                                                t._s(
                                                  t._(
                                                    "renderer.tab_mods.install.description_achievement_not_earned"
                                                  )
                                                )
                                            ),
                                          ]),
                                    ]),
                                  ];
                                }),
                                t._v(" "),
                                e("br"),
                              ]
                            : t._e(),
                        ],
                        2
                      ),
                    ])
                  : t._e();
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-99fa29",
              functional: void 0,
            });
        })();
      },
      {
        "../../../js/utils/Launcher": "wYBQ",
        "../../elements/LazyLoadedImage": "C46U",
        "../../elements/Link": "TptL",
      },
    ],
    Nhoy: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var o = {
          name: "ModView",
          props: ["mod"],
          methods: {
            _: ddmm.translate,
            openFolder: ddmm.app.showFile,
            getPathToMod: function (o) {
              return ddmm.joinPath(
                ddmm.config.readConfigValue("installFolder"),
                "mods",
                o
              );
            },
            showOptions: function (o) {
              this.$store.commit("select_mod", { mod: o }),
                this.$store.commit("show_modal", { modal: "mod_options" });
            },
          },
        };
        exports.default = o;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this,
                  s = t.$createElement,
                  e = t._self._c || s;
                return t.mod
                  ? e("div", [
                      e("h1", [
                        t._v(t._s(t.mod) + " "),
                        e("small", [
                          e(
                            "a",
                            {
                              attrs: {
                                href: "javascript:;",
                                title: t._(
                                  "renderer.tab_mods.mod.description_external"
                                ),
                              },
                              on: {
                                click: function (s) {
                                  t.openFolder(t.getPathToMod(t.mod));
                                },
                              },
                            },
                            [
                              e("i", {
                                staticClass: "fas fa-external-link-alt",
                              }),
                            ]
                          ),
                        ]),
                      ]),
                      t._v(" "),
                      e("br"),
                      t._v(" "),
                      e("p", [
                        e("button", { staticClass: "success" }, [
                          e("i", { staticClass: "fas fa-bolt fa-fw" }),
                          t._v(
                            " " +
                              t._s(
                                t._("renderer.tab_mods.mod.button_install")
                              ) +
                              " "
                          ),
                        ]),
                        t._v(" "),
                        e(
                          "button",
                          {
                            staticClass: "secondary",
                            on: {
                              click: function (s) {
                                return t.showOptions(t.mod);
                              },
                            },
                          },
                          [
                            e("i", { staticClass: "fas fa-cog fa-fw" }),
                            t._v(
                              " " +
                                t._s(
                                  t._("renderer.tab_mods.mod.button_settings")
                                ) +
                                " "
                            ),
                          ]
                        ),
                      ]),
                    ])
                  : t._e();
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-9efa50",
              functional: void 0,
            });
        })();
      },
      {},
    ],
    KqMb: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var t = {
          name: "ChunkyRadioButtons",
          props: ["options", "value"],
          data: function () {
            return { val: this.value };
          },
          methods: {
            setValue: function (t) {
              (this.val = t), this.$emit("input", t);
            },
          },
        };
        exports.default = t;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this,
                  n = t.$createElement,
                  e = t._self._c || n;
                return e(
                  "div",
                  { staticClass: "chunky-radio-buttons" },
                  t._l(t.options, function (n, o) {
                    return e(
                      "div",
                      {
                        class: { "chunky-button": !0, active: t.val === o },
                        on: {
                          click: function (n) {
                            return t.setValue(o);
                          },
                        },
                      },
                      [t._v(t._s(n) + " ")]
                    );
                  }),
                  0
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-7b58ab",
              functional: void 0,
            });
        })();
      },
      {},
    ],
    taxC: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var t = {
          name: "ModSelector",
          props: ["initial_mod"],
          data: function () {
            return { mod: this.initial_mod || "!none", actual_mod: "" };
          },
          methods: {
            _: ddmm.translate,
            selectMod: function () {
              (this.actual_mod = ddmm.mods.browseForMod()),
                this.$emit("input", this.actual_mod);
            },
            getPathToMod: function (t) {
              return ddmm.joinPath(
                ddmm.config.readConfigValue("installFolder"),
                "mods",
                t
              );
            },
            getDisplayName: function (t) {
              var o = t.split(".");
              return o.pop(), o.join(".");
            },
          },
          computed: {
            mods: function () {
              return this.$store.state.game_data.mods;
            },
          },
          watch: {
            mod: function (t) {
              "!none" === t
                ? this.$emit("input", null)
                : "!custom" === t
                ? this.$emit("input", this.actual_mod)
                : this.$emit("input", this.mod);
            },
          },
        };
        exports.default = t;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement,
                  o = e._self._c || t;
                return o(
                  "div",
                  [
                    o("p", [
                      o("label", [
                        e._v(
                          e._s(
                            e._("renderer.tab_mods.install_creation.label_mod")
                          )
                        ),
                      ]),
                    ]),
                    e._v(" "),
                    o("p", [
                      o(
                        "select",
                        {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: e.mod,
                              expression: "mod",
                            },
                          ],
                          on: {
                            change: function (t) {
                              var o = Array.prototype.filter
                                .call(t.target.options, function (e) {
                                  return e.selected;
                                })
                                .map(function (e) {
                                  return "_value" in e ? e._value : e.value;
                                });
                              e.mod = t.target.multiple ? o : o[0];
                            },
                          },
                        },
                        [
                          o("option", { domProps: { value: "!none" } }, [
                            e._v(
                              e._s(
                                e._(
                                  "renderer.tab_mods.install_creation.modlist_none"
                                )
                              )
                            ),
                          ]),
                          e._v(" "),
                          o("option", { domProps: { value: "!custom" } }, [
                            e._v(
                              e._s(
                                e._(
                                  "renderer.tab_mods.install_creation.modlist_custom"
                                )
                              )
                            ),
                          ]),
                        ]
                      ),
                    ]),
                    e._v(" "),
                    "!custom" === e.mod
                      ? [
                          o("br"),
                          e._v(" "),
                          o("p", [
                            o("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: e.actual_mod,
                                  expression: "actual_mod",
                                },
                              ],
                              staticStyle: { cursor: "pointer" },
                              attrs: {
                                type: "text",
                                placeholder: e._(
                                  "renderer.tab_mods.install_creation.description_mod"
                                ),
                                readonly: "",
                              },
                              domProps: { value: e.actual_mod },
                              on: {
                                click: e.selectMod,
                                input: function (t) {
                                  t.target.composing ||
                                    (e.actual_mod = t.target.value);
                                },
                              },
                            }),
                          ]),
                        ]
                      : e._e(),
                  ],
                  2
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-bf427d",
              functional: void 0,
            });
        })();
      },
      {},
    ],
    J5X4: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var t = i(require("../../elements/ChunkyRadioButtons.vue")),
          e = i(require("../../elements/ModSelector"));
        function i(t) {
          return t && t.__esModule ? t : { default: t };
        }
        var a = {
          name: "CreationView",
          components: { ModSelector: e.default, ChunkyRadioButtons: t.default },
          data: function () {
            return {
              has_free_space:
                ddmm.app.getDiskSpace(
                  ddmm.config.readConfigValue("installFolder")
                ) > 2147483648,
              is_installing: !1,
              interim_install_creation: {
                install_name:
                  this.$store.state.install_creation_data.install_name,
                folder_name:
                  this.$store.state.install_creation_data.folder_name,
                mod: this.$store.state.install_creation_data.mod,
                save_option:
                  this.$store.state.install_creation_data.save_option,
              },
            };
          },
          methods: {
            _: ddmm.translate,
            installExists: ddmm.mods.installExists,
            installNameKeyUp: function () {
              this.$store.commit("set_install_creation", {
                install_name: this.interim_install_creation.install_name,
              });
              var t = this.interim_install_creation.install_name
                .trim()
                .toLowerCase()
                .replace(/\W/g, "-")
                .replace(/-+/g, "-")
                .substring(0, 32);
              (this.interim_install_creation.folder_name = t),
                ddmm.mods.installExists(t)
                  ? this.$store.commit("set_install_creation", {
                      folder_name: t + "-" + Math.floor(100 * Math.random()),
                    })
                  : this.$store.commit("set_install_creation", {
                      folder_name: t,
                    });
            },
            install: function () {
              this.$store.commit("installation_status", {
                installing: !0,
                preloaded_install_folder: this.install_creation.folder_name,
              }),
                ddmm.mods.createInstall({
                  folderName: this.install_creation.folder_name,
                  installName: this.install_creation.install_name,
                  globalSave: 1 === this.install_creation.save_option,
                  mod: this.install_creation.mod,
                }),
                (this.is_installing = !0),
                this.$store.commit("set_install_creation", {
                  mod: "",
                  install_name: "",
                  folder_name: "",
                });
            },
            selectMod: function (t) {
              this.$store.commit("set_install_creation", { mod: t });
            },
          },
          computed: {
            install_creation: function () {
              return this.$store.state.install_creation_data;
            },
            shouldDisableCreation: function () {
              return (
                this.is_installing ||
                this.install_creation.install_name.length < 2 ||
                this.install_creation.folder_name.length < 2
              );
            },
          },
          watch: {
            "interim_install_creation.save_option": function () {
              this.$store.commit("set_install_creation", {
                save_option: this.interim_install_creation.save_option,
              });
            },
          },
        };
        exports.default = a;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this,
                  a = t.$createElement,
                  e = t._self._c || a;
                return e(
                  "div",
                  { staticClass: "main-content" },
                  [
                    e("h1", [
                      t._v(
                        t._s(t._("renderer.tab_mods.install_creation.title"))
                      ),
                    ]),
                    t._v(" "),
                    t.has_free_space
                      ? [
                          e("div", { staticClass: "form-group" }, [
                            e("p", [
                              e("label", [
                                t._v(
                                  t._s(
                                    t._(
                                      "renderer.tab_mods.install_creation.label_install_name"
                                    )
                                  )
                                ),
                              ]),
                            ]),
                            t._v(" "),
                            e("p", [
                              e("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value:
                                      t.interim_install_creation.install_name,
                                    expression:
                                      "interim_install_creation.install_name",
                                  },
                                ],
                                attrs: {
                                  type: "text",
                                  placeholder: t._(
                                    "renderer.tab_mods.install_creation.placeholder_install_name"
                                  ),
                                },
                                domProps: {
                                  value:
                                    t.interim_install_creation.install_name,
                                },
                                on: {
                                  keyup: t.installNameKeyUp,
                                  input: function (a) {
                                    a.target.composing ||
                                      t.$set(
                                        t.interim_install_creation,
                                        "install_name",
                                        a.target.value
                                      );
                                  },
                                },
                              }),
                            ]),
                          ]),
                          t._v(" "),
                          !t.is_installing &&
                          t.install_creation.folder_name.length > 2 &&
                          t.installExists(t.install_creation.folder_name)
                            ? e("p", [
                                e("strong", [
                                  t._v(
                                    t._s(
                                      t._(
                                        "renderer.tab_mods.install_creation.status_exists"
                                      )
                                    )
                                  ),
                                ]),
                              ])
                            : t._e(),
                          t._v(" "),
                          e(
                            "div",
                            { staticClass: "form-group" },
                            [
                              e("ModSelector", {
                                attrs: { initial_mod: t.install_creation.mod },
                                on: { input: t.selectMod },
                              }),
                            ],
                            1
                          ),
                          t._v(" "),
                          e(
                            "div",
                            { staticClass: "form-group" },
                            [
                              e("ChunkyRadioButtons", {
                                attrs: {
                                  options: [
                                    t._(
                                      "renderer.tab_mods.install_creation.option_local_save"
                                    ),
                                    t._(
                                      "renderer.tab_mods.install_creation.option_global_save"
                                    ),
                                  ],
                                },
                                model: {
                                  value: t.interim_install_creation.save_option,
                                  callback: function (a) {
                                    t.$set(
                                      t.interim_install_creation,
                                      "save_option",
                                      a
                                    );
                                  },
                                  expression:
                                    "interim_install_creation.save_option",
                                },
                              }),
                            ],
                            1
                          ),
                          t._v(" "),
                          1 === t.install_creation.save_option
                            ? e("p", [
                                t._v(
                                  " " +
                                    t._s(
                                      t._(
                                        "renderer.tab_mods.install_creation.warning_global_save"
                                      )
                                    ) +
                                    " "
                                ),
                              ])
                            : t._e(),
                          t._v(" "),
                          t.is_installing
                            ? e("div", { staticClass: "form-group" }, [
                                e(
                                  "button",
                                  {
                                    staticClass: "primary",
                                    attrs: { disabled: "" },
                                  },
                                  [
                                    e("i", {
                                      staticClass:
                                        "fas fa-spinner fa-spin fa-fw",
                                    }),
                                    t._v(
                                      " " +
                                        t._s(
                                          t._(
                                            "renderer.tab_mods.install_creation.button_installing"
                                          )
                                        ) +
                                        " "
                                    ),
                                  ]
                                ),
                              ])
                            : e("div", { staticClass: "form-group" }, [
                                e(
                                  "button",
                                  {
                                    staticClass: "primary",
                                    attrs: {
                                      disabled: t.shouldDisableCreation,
                                    },
                                    on: { click: t.install },
                                  },
                                  [
                                    e("i", {
                                      staticClass: "fas fa-bolt fa-fw",
                                    }),
                                    t._v(
                                      " " +
                                        t._s(
                                          t._(
                                            "renderer.tab_mods.install_creation.button_install"
                                          )
                                        ) +
                                        " "
                                    ),
                                  ]
                                ),
                              ]),
                        ]
                      : [
                          e("p", [
                            t._v(
                              t._s(
                                t._(
                                  "renderer.tab_mods.install_creation.warning_no_space"
                                )
                              )
                            ),
                          ]),
                        ],
                  ],
                  2
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-ffd002",
              functional: void 0,
            });
        })();
      },
      {
        "../../elements/ChunkyRadioButtons.vue": "KqMb",
        "../../elements/ModSelector": "taxC",
      },
    ],
    WIEY: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var t = a(require("fuse.js")),
          e = a(require("./mods/InstallView.vue")),
          s = a(require("./mods/ModView.vue")),
          n = a(require("./mods/CreationView.vue")),
          i = a(require("../../js/utils/Logger")),
          l = a(require("../../js/utils/Launcher"));
        function a(t) {
          return t && t.__esModule ? t : { default: t };
        }
        var r = {
          name: "ModsTab",
          components: {
            CreationView: n.default,
            ModView: s.default,
            InstallView: e.default,
          },
          methods: {
            _: ddmm.translate,
            getPathToInstall: function (t) {
              return ddmm.joinPath(
                ddmm.config.readConfigValue("installFolder"),
                "installs",
                t
              );
            },
            handleCreateClick: function (t) {
              i.default.info(
                "Mod List",
                "Selected creation (advanced = " + t + ")"
              ),
                this.$store.commit("install_list_selection", {
                  type: "create",
                });
            },
            handleInstallClick: function (t) {
              i.default.info("Mod List", "Selected install " + t),
                this.$store.commit("install_list_selection", {
                  type: "install",
                  id: t,
                });
            },
            showInstallOptions: function (t) {
              this.$store.commit("select_install", { install: t }),
                this.$store.commit("show_modal", { modal: "install_options" });
            },
            launchInstall: function (t) {
              l.default.launch(t, this.$store);
            },
            searchEscapeHandler: function (t) {
              "Escape" === t.key && (this.search = "");
            },
          },
          data: function () {
            return { search: "", fuse: null };
          },
          computed: {
            categories: function () {
              return Array.from(
                new Set(
                  this.$store.state.game_data.installs.map(function (t) {
                    return t.category;
                  })
                )
              ).sort(function (t, e) {
                if (!t || "" === t) return 1;
                if (!e || "" === e) return -1;
                var s = t.toUpperCase(),
                  n = e.toUpperCase();
                return s < n ? -1 : s > n ? 1 : 0;
              });
            },
            selected_item: function () {
              return this.$store.state.install_list_selection;
            },
            installs: function () {
              return this.$store.state.game_data.installs;
            },
            searchResultsInstalls: function () {
              return this.search
                ? this.fuse.search(this.search).map(function (t) {
                    return t.item;
                  })
                : this.installs;
            },
            selectedInstall: function () {
              var t = this;
              return "install" === this.selected_item.type
                ? this.installs.find(function (e) {
                    return e.folderName === t.selected_item.id;
                  })
                : null;
            },
          },
          beforeMount: function () {
            this.fuse = new t.default(this.installs, {
              keys: ["name", "folderName", "mod.name", "mod.author"],
            });
          },
        };
        exports.default = r;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement,
                  s = e._self._c || t;
                return s("div", { staticClass: "page-content" }, [
                  s("div", { staticClass: "mod-viewer-pane" }, [
                    s(
                      "div",
                      { staticClass: "mod-viewer-mod-list" },
                      [
                        s("div", [
                          s("input", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: e.search,
                                expression: "search",
                              },
                            ],
                            staticClass: "small",
                            attrs: {
                              type: "text",
                              placeholder: e._(
                                "renderer.tab_mods.list.placeholder_search"
                              ),
                              autofocus: "",
                            },
                            domProps: { value: e.search },
                            on: {
                              keyup: e.searchEscapeHandler,
                              click: function (t) {
                                e.search = "";
                              },
                              input: function (t) {
                                t.target.composing ||
                                  (e.search = t.target.value);
                              },
                            },
                          }),
                        ]),
                        e._v(" "),
                        s("br"),
                        e._v(" "),
                        s("div", { staticClass: "mod-view-mod-list-title" }, [
                          e._v(e._s(e._("renderer.tab_mods.list.header_new"))),
                        ]),
                        e._v(" "),
                        s(
                          "div",
                          {
                            class: {
                              "mod-view-mod-list-entry": !0,
                              active: "create" === e.selected_item.type,
                            },
                            on: {
                              click: function (t) {
                                return e.handleCreateClick(!1);
                              },
                            },
                          },
                          [
                            e._v(
                              e._s(e._("renderer.tab_mods.list.link_install")) +
                                " "
                            ),
                          ]
                        ),
                        e._v(" "),
                        s("br"),
                        e._v(" "),
                        e._l(e.categories, function (t) {
                          return [
                            e.searchResultsInstalls.filter(function (e) {
                              return e.category === t;
                            }).length > 0
                              ? s(
                                  "div",
                                  { staticClass: "mod-view-mod-list-title" },
                                  [
                                    e._v(
                                      " " +
                                        e._s(
                                          t ||
                                            e._(
                                              "renderer.tab_mods.list.header_installed"
                                            )
                                        ) +
                                        " "
                                    ),
                                  ]
                                )
                              : e._e(),
                            e._v(" "),
                            e._l(
                              e.searchResultsInstalls.filter(function (e) {
                                return e.category === t;
                              }),
                              function (t) {
                                return s(
                                  "div",
                                  {
                                    class: {
                                      "mod-view-mod-list-entry": !0,
                                      active:
                                        e.selected_item.id === t.folderName &&
                                        "install" === e.selected_item.type,
                                    },
                                    attrs: {
                                      title: e.getPathToInstall(t.folderName),
                                    },
                                    on: {
                                      dblclick: function (s) {
                                        return e.launchInstall(t);
                                      },
                                      click: function (s) {
                                        return e.handleInstallClick(
                                          t.folderName
                                        );
                                      },
                                    },
                                  },
                                  [
                                    s("span", [
                                      e._v(" " + e._s(t.name) + " "),
                                      t.archived
                                        ? s("span", [
                                            s("i", {
                                              staticClass:
                                                "fas fa-archive fa-fw",
                                            }),
                                          ])
                                        : e._e(),
                                    ]),
                                    e._v(" "),
                                    s(
                                      "span",
                                      {
                                        staticClass:
                                          "mod-view-mod-list-entry-button",
                                        on: {
                                          click: function (s) {
                                            return e.showInstallOptions(t);
                                          },
                                        },
                                      },
                                      [s("i", { staticClass: "fas fa-cog" })]
                                    ),
                                  ]
                                );
                              }
                            ),
                            e._v(" "),
                            e.searchResultsInstalls.filter(function (e) {
                              return e.category === t;
                            }).length > 0
                              ? s("br")
                              : e._e(),
                          ];
                        }),
                      ],
                      2
                    ),
                    e._v(" "),
                    s(
                      "div",
                      { staticClass: "mod-viewer-mod-display" },
                      [
                        e.selectedInstall
                          ? s("InstallView", {
                              attrs: { install: e.selectedInstall },
                            })
                          : "create" === e.selected_item.type
                          ? s("CreationView")
                          : e._e(),
                      ],
                      1
                    ),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-3b2b1d",
              functional: void 0,
            });
        })();
      },
      {
        "fuse.js": "fGxp",
        "./mods/InstallView.vue": "sF0v",
        "./mods/ModView.vue": "Nhoy",
        "./mods/CreationView.vue": "J5X4",
        "../../js/utils/Logger": "vKp2",
        "../../js/utils/Launcher": "wYBQ",
      },
    ],
    EOX6: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = o(require("../../elements/LazyLoadedImage"));
        function o(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var t = {
          name: "BackgroundOptions",
          components: { LazyLoadedImage: e.default },
          methods: {
            _: ddmm.translate,
            setBackground: function (e) {
              this.$store.commit("set_background", e);
            },
            setModBackgrounds: function (e) {
              ddmm.config.saveConfigValue("modBackgrounds", e);
            },
            chooseBackground: function () {
              var e = this,
                o = document.createElement("input");
              (o.type = "file"),
                (o.accept = "image/*"),
                (o.onchange = function () {
                  e.$store.commit(
                    "set_background",
                    "custom:" + o.files[0].path
                  );
                }),
                o.click();
            },
          },
          data: function () {
            return {
              backgrounds: ddmm.app.getBackgrounds(),
              modbg_interim: ddmm.config.readConfigValue("modBackgrounds"),
            };
          },
        };
        exports.default = t;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement,
                  n = e._self._c || t;
                return n("div", [
                  n("h1", [
                    e._v(
                      e._s(
                        e._("renderer.tab_options.section_backgrounds.title")
                      )
                    ),
                  ]),
                  e._v(" "),
                  n("p", [
                    e._v(
                      e._s(
                        e._("renderer.tab_options.section_backgrounds.subtitle")
                      )
                    ),
                  ]),
                  e._v(" "),
                  n("br"),
                  e._v(" "),
                  n(
                    "div",
                    { staticClass: "screenshots" },
                    e._l(e.backgrounds, function (t) {
                      return n("LazyLoadedImage", {
                        attrs: {
                          alt: t,
                          src: "src/renderer/images/backgrounds/" + t,
                          width: "150",
                        },
                        nativeOn: {
                          click: function (n) {
                            return e.setBackground(t);
                          },
                        },
                      });
                    }),
                    1
                  ),
                  e._v(" "),
                  n("br"),
                  e._v(" "),
                  n("p", [
                    n(
                      "button",
                      {
                        staticClass: "success",
                        on: { click: e.chooseBackground },
                      },
                      [
                        n("i", { staticClass: "fas fa-image fa-fw" }),
                        e._v(
                          " " +
                            e._s(
                              e._(
                                "renderer.tab_options.section_backgrounds.button_custom"
                              )
                            ) +
                            " "
                        ),
                      ]
                    ),
                    e._v(" "),
                    n(
                      "button",
                      {
                        staticClass: "danger",
                        on: {
                          click: function (t) {
                            return e.setBackground("none");
                          },
                        },
                      },
                      [
                        n("i", { staticClass: "fas fa-times fa-fw" }),
                        e._v(
                          " " +
                            e._s(
                              e._(
                                "renderer.tab_options.section_backgrounds.button_none"
                              )
                            ) +
                            " "
                        ),
                      ]
                    ),
                  ]),
                  e._v(" "),
                  n("br"),
                  e._v(" "),
                  n("p", [
                    n("label", [
                      n("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: e.modbg_interim,
                            expression: "modbg_interim",
                          },
                        ],
                        attrs: { type: "checkbox" },
                        domProps: {
                          checked: Array.isArray(e.modbg_interim)
                            ? e._i(e.modbg_interim, null) > -1
                            : e.modbg_interim,
                        },
                        on: {
                          change: [
                            function (t) {
                              var n = e.modbg_interim,
                                r = t.target,
                                o = !!r.checked;
                              if (Array.isArray(n)) {
                                var s = e._i(n, null);
                                r.checked
                                  ? s < 0 &&
                                    (e.modbg_interim = n.concat([null]))
                                  : s > -1 &&
                                    (e.modbg_interim = n
                                      .slice(0, s)
                                      .concat(n.slice(s + 1)));
                              } else e.modbg_interim = o;
                            },
                            function (t) {
                              return e.setModBackgrounds(e.modbg_interim);
                            },
                          ],
                        },
                      }),
                      e._v(
                        " " +
                          e._s(
                            e._(
                              "renderer.tab_options.section_backgrounds.checkbox_modbg"
                            )
                          )
                      ),
                    ]),
                  ]),
                  e._v(" "),
                  n("br"),
                  e._v(" "),
                  n("p", [
                    e._v(
                      e._s(
                        e._(
                          "renderer.tab_options.section_backgrounds.description_credit"
                        )
                      )
                    ),
                  ]),
                  e._v(" "),
                  n("br"),
                  e._v(" "),
                  n("p", [
                    e._v(
                      e._s(
                        e._(
                          "renderer.tab_options.section_backgrounds.description_custom"
                        )
                      )
                    ),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-302f5b",
              functional: void 0,
            });
        })();
      },
      { "../../elements/LazyLoadedImage": "C46U" },
    ],
    a16z: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = {
          name: "AdvancedAppearanceOptions",
          methods: {
            _: ddmm.translate,
            setSystemBorders: function (e) {
              ddmm.config.saveConfigValue("systemBorders", e);
            },
          },
          data: function () {
            return {
              system_borders_interim:
                ddmm.config.readConfigValue("systemBorders"),
            };
          },
        };
        exports.default = e;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  r = e.$createElement,
                  s = e._self._c || r;
                return s("div", [
                  s("h1", [
                    e._v(
                      e._s(
                        e._(
                          "renderer.tab_options.section_advanced_appearance.title"
                        )
                      )
                    ),
                  ]),
                  e._v(" "),
                  s("p", [
                    e._v(
                      e._s(
                        e._(
                          "renderer.tab_options.section_advanced_appearance.subtitle"
                        )
                      )
                    ),
                  ]),
                  e._v(" "),
                  s("br"),
                  e._v(" "),
                  s("p", [
                    s("label", [
                      s("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: e.system_borders_interim,
                            expression: "system_borders_interim",
                          },
                        ],
                        attrs: { type: "checkbox" },
                        domProps: {
                          checked: Array.isArray(e.system_borders_interim)
                            ? e._i(e.system_borders_interim, null) > -1
                            : e.system_borders_interim,
                        },
                        on: {
                          change: [
                            function (r) {
                              var s = e.system_borders_interim,
                                t = r.target,
                                n = !!t.checked;
                              if (Array.isArray(s)) {
                                var i = e._i(s, null);
                                t.checked
                                  ? i < 0 &&
                                    (e.system_borders_interim = s.concat([
                                      null,
                                    ]))
                                  : i > -1 &&
                                    (e.system_borders_interim = s
                                      .slice(0, i)
                                      .concat(s.slice(i + 1)));
                              } else e.system_borders_interim = n;
                            },
                            function (r) {
                              return e.setSystemBorders(
                                e.system_borders_interim
                              );
                            },
                          ],
                        },
                      }),
                      e._v(
                        " " +
                          e._s(
                            e._(
                              "renderer.tab_options.section_advanced_appearance.button_enable_sysborders"
                            )
                          )
                      ),
                    ]),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-0deb9d",
              functional: void 0,
            });
        })();
      },
      {},
    ],
    rH1J: [
      function (require, module, exports) {
        var t,
          e,
          n = (module.exports = {});
        function r() {
          throw new Error("setTimeout has not been defined");
        }
        function o() {
          throw new Error("clearTimeout has not been defined");
        }
        function i(e) {
          if (t === setTimeout) return setTimeout(e, 0);
          if ((t === r || !t) && setTimeout)
            return (t = setTimeout), setTimeout(e, 0);
          try {
            return t(e, 0);
          } catch (n) {
            try {
              return t.call(null, e, 0);
            } catch (n) {
              return t.call(this, e, 0);
            }
          }
        }
        function u(t) {
          if (e === clearTimeout) return clearTimeout(t);
          if ((e === o || !e) && clearTimeout)
            return (e = clearTimeout), clearTimeout(t);
          try {
            return e(t);
          } catch (n) {
            try {
              return e.call(null, t);
            } catch (n) {
              return e.call(this, t);
            }
          }
        }
        !(function () {
          try {
            t = "function" == typeof setTimeout ? setTimeout : r;
          } catch (n) {
            t = r;
          }
          try {
            e = "function" == typeof clearTimeout ? clearTimeout : o;
          } catch (n) {
            e = o;
          }
        })();
        var c,
          s = [],
          l = !1,
          a = -1;
        function f() {
          l &&
            c &&
            ((l = !1),
            c.length ? (s = c.concat(s)) : (a = -1),
            s.length && h());
        }
        function h() {
          if (!l) {
            var t = i(f);
            l = !0;
            for (var e = s.length; e; ) {
              for (c = s, s = []; ++a < e; ) c && c[a].run();
              (a = -1), (e = s.length);
            }
            (c = null), (l = !1), u(t);
          }
        }
        function m(t, e) {
          (this.fun = t), (this.array = e);
        }
        function p() {}
        (n.nextTick = function (t) {
          var e = new Array(arguments.length - 1);
          if (arguments.length > 1)
            for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
          s.push(new m(t, e)), 1 !== s.length || l || i(h);
        }),
          (m.prototype.run = function () {
            this.fun.apply(null, this.array);
          }),
          (n.title = "browser"),
          (n.env = {}),
          (n.argv = []),
          (n.version = ""),
          (n.versions = {}),
          (n.on = p),
          (n.addListener = p),
          (n.once = p),
          (n.off = p),
          (n.removeListener = p),
          (n.removeAllListeners = p),
          (n.emit = p),
          (n.prependListener = p),
          (n.prependOnceListener = p),
          (n.listeners = function (t) {
            return [];
          }),
          (n.binding = function (t) {
            throw new Error("process.binding is not supported");
          }),
          (n.cwd = function () {
            return "/";
          }),
          (n.chdir = function (t) {
            throw new Error("process.chdir is not supported");
          }),
          (n.umask = function () {
            return 0;
          });
      },
      {},
    ],
    xjuS: [
      function (require, module, exports) {
        var process = require("process");
        var e,
          r = require("process");
        (exports = module.exports = W),
          "object" == typeof r && r.env,
          (e = function () {}),
          (exports.SEMVER_SPEC_VERSION = "2.0.0");
        var t = 256,
          n = Number.MAX_SAFE_INTEGER || 9007199254740991,
          o = 16,
          s = (exports.re = []),
          i = (exports.src = []),
          a = 0,
          p = a++;
        i[p] = "0|[1-9]\\d*";
        var u = a++;
        i[u] = "[0-9]+";
        var c = a++;
        i[c] = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
        var h = a++;
        i[h] = "(" + i[p] + ")\\.(" + i[p] + ")\\.(" + i[p] + ")";
        var l = a++;
        i[l] = "(" + i[u] + ")\\.(" + i[u] + ")\\.(" + i[u] + ")";
        var f = a++;
        i[f] = "(?:" + i[p] + "|" + i[c] + ")";
        var v = a++;
        i[v] = "(?:" + i[u] + "|" + i[c] + ")";
        var m = a++;
        i[m] = "(?:-(" + i[f] + "(?:\\." + i[f] + ")*))";
        var w = a++;
        i[w] = "(?:-?(" + i[v] + "(?:\\." + i[v] + ")*))";
        var g = a++;
        i[g] = "[0-9A-Za-z-]+";
        var x = a++;
        i[x] = "(?:\\+(" + i[g] + "(?:\\." + i[g] + ")*))";
        var y = a++,
          d = "v?" + i[h] + i[m] + "?" + i[x] + "?";
        i[y] = "^" + d + "$";
        var j = "[v=\\s]*" + i[l] + i[w] + "?" + i[x] + "?",
          E = a++;
        i[E] = "^" + j + "$";
        var b = a++;
        i[b] = "((?:<|>)?=?)";
        var $ = a++;
        i[$] = i[u] + "|x|X|\\*";
        var R = a++;
        i[R] = i[p] + "|x|X|\\*";
        var S = a++;
        i[S] =
          "[v=\\s]*(" +
          i[R] +
          ")(?:\\.(" +
          i[R] +
          ")(?:\\.(" +
          i[R] +
          ")(?:" +
          i[m] +
          ")?" +
          i[x] +
          "?)?)?";
        var T = a++;
        i[T] =
          "[v=\\s]*(" +
          i[$] +
          ")(?:\\.(" +
          i[$] +
          ")(?:\\.(" +
          i[$] +
          ")(?:" +
          i[w] +
          ")?" +
          i[x] +
          "?)?)?";
        var P = a++;
        i[P] = "^" + i[b] + "\\s*" + i[S] + "$";
        var k = a++;
        i[k] = "^" + i[b] + "\\s*" + i[T] + "$";
        var I = a++;
        i[I] =
          "(?:^|[^\\d])(\\d{1," +
          o +
          "})(?:\\.(\\d{1," +
          o +
          "}))?(?:\\.(\\d{1," +
          o +
          "}))?(?:$|[^\\d])";
        var V = a++;
        i[V] = "(?:~>?)";
        var C = a++;
        (i[C] = "(\\s*)" + i[V] + "\\s+"), (s[C] = new RegExp(i[C], "g"));
        var q = "$1~",
          A = a++;
        i[A] = "^" + i[V] + i[S] + "$";
        var M = a++;
        i[M] = "^" + i[V] + i[T] + "$";
        var N = a++;
        i[N] = "(?:\\^)";
        var X = a++;
        (i[X] = "(\\s*)" + i[N] + "\\s+"), (s[X] = new RegExp(i[X], "g"));
        var _ = "$1^",
          z = a++;
        i[z] = "^" + i[N] + i[S] + "$";
        var Z = a++;
        i[Z] = "^" + i[N] + i[T] + "$";
        var L = a++;
        i[L] = "^" + i[b] + "\\s*(" + j + ")$|^$";
        var F = a++;
        i[F] = "^" + i[b] + "\\s*(" + d + ")$|^$";
        var G = a++;
        (i[G] = "(\\s*)" + i[b] + "\\s*(" + j + "|" + i[S] + ")"),
          (s[G] = new RegExp(i[G], "g"));
        var O = "$1$2$3",
          U = a++;
        i[U] = "^\\s*(" + i[S] + ")\\s+-\\s+(" + i[S] + ")\\s*$";
        var B = a++;
        i[B] = "^\\s*(" + i[T] + ")\\s+-\\s+(" + i[T] + ")\\s*$";
        var D = a++;
        i[D] = "(<|>)?=?\\s*\\*";
        for (var H = 0; H < a; H++)
          e(H, i[H]), s[H] || (s[H] = new RegExp(i[H]));
        function J(e, r) {
          if (
            ((r && "object" == typeof r) ||
              (r = { loose: !!r, includePrerelease: !1 }),
            e instanceof W)
          )
            return e;
          if ("string" != typeof e) return null;
          if (e.length > t) return null;
          if (!(r.loose ? s[E] : s[y]).test(e)) return null;
          try {
            return new W(e, r);
          } catch (n) {
            return null;
          }
        }
        function K(e, r) {
          var t = J(e, r);
          return t ? t.version : null;
        }
        function Q(e, r) {
          var t = J(e.trim().replace(/^[=v]+/, ""), r);
          return t ? t.version : null;
        }
        function W(r, o) {
          if (
            ((o && "object" == typeof o) ||
              (o = { loose: !!o, includePrerelease: !1 }),
            r instanceof W)
          ) {
            if (r.loose === o.loose) return r;
            r = r.version;
          } else if ("string" != typeof r)
            throw new TypeError("Invalid Version: " + r);
          if (r.length > t)
            throw new TypeError("version is longer than " + t + " characters");
          if (!(this instanceof W)) return new W(r, o);
          e("SemVer", r, o), (this.options = o), (this.loose = !!o.loose);
          var i = r.trim().match(o.loose ? s[E] : s[y]);
          if (!i) throw new TypeError("Invalid Version: " + r);
          if (
            ((this.raw = r),
            (this.major = +i[1]),
            (this.minor = +i[2]),
            (this.patch = +i[3]),
            this.major > n || this.major < 0)
          )
            throw new TypeError("Invalid major version");
          if (this.minor > n || this.minor < 0)
            throw new TypeError("Invalid minor version");
          if (this.patch > n || this.patch < 0)
            throw new TypeError("Invalid patch version");
          i[4]
            ? (this.prerelease = i[4].split(".").map(function (e) {
                if (/^[0-9]+$/.test(e)) {
                  var r = +e;
                  if (r >= 0 && r < n) return r;
                }
                return e;
              }))
            : (this.prerelease = []),
            (this.build = i[5] ? i[5].split(".") : []),
            this.format();
        }
        function Y(e, r, t, n) {
          "string" == typeof t && ((n = t), (t = void 0));
          try {
            return new W(e, t).inc(r, n).version;
          } catch (o) {
            return null;
          }
        }
        function ee(e, r) {
          if (ve(e, r)) return null;
          var t = J(e),
            n = J(r),
            o = "";
          if (t.prerelease.length || n.prerelease.length) {
            o = "pre";
            var s = "prerelease";
          }
          for (var i in t)
            if (
              ("major" === i || "minor" === i || "patch" === i) &&
              t[i] !== n[i]
            )
              return o + i;
          return s;
        }
        (exports.parse = J),
          (exports.valid = K),
          (exports.clean = Q),
          (exports.SemVer = W),
          (W.prototype.format = function () {
            return (
              (this.version = this.major + "." + this.minor + "." + this.patch),
              this.prerelease.length &&
                (this.version += "-" + this.prerelease.join(".")),
              this.version
            );
          }),
          (W.prototype.toString = function () {
            return this.version;
          }),
          (W.prototype.compare = function (r) {
            return (
              e("SemVer.compare", this.version, this.options, r),
              r instanceof W || (r = new W(r, this.options)),
              this.compareMain(r) || this.comparePre(r)
            );
          }),
          (W.prototype.compareMain = function (e) {
            return (
              e instanceof W || (e = new W(e, this.options)),
              te(this.major, e.major) ||
                te(this.minor, e.minor) ||
                te(this.patch, e.patch)
            );
          }),
          (W.prototype.comparePre = function (r) {
            if (
              (r instanceof W || (r = new W(r, this.options)),
              this.prerelease.length && !r.prerelease.length)
            )
              return -1;
            if (!this.prerelease.length && r.prerelease.length) return 1;
            if (!this.prerelease.length && !r.prerelease.length) return 0;
            var t = 0;
            do {
              var n = this.prerelease[t],
                o = r.prerelease[t];
              if (
                (e("prerelease compare", t, n, o), void 0 === n && void 0 === o)
              )
                return 0;
              if (void 0 === o) return 1;
              if (void 0 === n) return -1;
              if (n !== o) return te(n, o);
            } while (++t);
          }),
          (W.prototype.inc = function (e, r) {
            switch (e) {
              case "premajor":
                (this.prerelease.length = 0),
                  (this.patch = 0),
                  (this.minor = 0),
                  this.major++,
                  this.inc("pre", r);
                break;
              case "preminor":
                (this.prerelease.length = 0),
                  (this.patch = 0),
                  this.minor++,
                  this.inc("pre", r);
                break;
              case "prepatch":
                (this.prerelease.length = 0),
                  this.inc("patch", r),
                  this.inc("pre", r);
                break;
              case "prerelease":
                0 === this.prerelease.length && this.inc("patch", r),
                  this.inc("pre", r);
                break;
              case "major":
                (0 === this.minor &&
                  0 === this.patch &&
                  0 !== this.prerelease.length) ||
                  this.major++,
                  (this.minor = 0),
                  (this.patch = 0),
                  (this.prerelease = []);
                break;
              case "minor":
                (0 === this.patch && 0 !== this.prerelease.length) ||
                  this.minor++,
                  (this.patch = 0),
                  (this.prerelease = []);
                break;
              case "patch":
                0 === this.prerelease.length && this.patch++,
                  (this.prerelease = []);
                break;
              case "pre":
                if (0 === this.prerelease.length) this.prerelease = [0];
                else {
                  for (var t = this.prerelease.length; --t >= 0; )
                    "number" == typeof this.prerelease[t] &&
                      (this.prerelease[t]++, (t = -2));
                  -1 === t && this.prerelease.push(0);
                }
                r &&
                  (this.prerelease[0] === r
                    ? isNaN(this.prerelease[1]) && (this.prerelease = [r, 0])
                    : (this.prerelease = [r, 0]));
                break;
              default:
                throw new Error("invalid increment argument: " + e);
            }
            return this.format(), (this.raw = this.version), this;
          }),
          (exports.inc = Y),
          (exports.diff = ee),
          (exports.compareIdentifiers = te);
        var re = /^[0-9]+$/;
        function te(e, r) {
          var t = re.test(e),
            n = re.test(r);
          return (
            t && n && ((e = +e), (r = +r)),
            e === r ? 0 : t && !n ? -1 : n && !t ? 1 : e < r ? -1 : 1
          );
        }
        function ne(e, r) {
          return te(r, e);
        }
        function oe(e, r) {
          return new W(e, r).major;
        }
        function se(e, r) {
          return new W(e, r).minor;
        }
        function ie(e, r) {
          return new W(e, r).patch;
        }
        function ae(e, r, t) {
          return new W(e, t).compare(new W(r, t));
        }
        function pe(e, r) {
          return ae(e, r, !0);
        }
        function ue(e, r, t) {
          return ae(r, e, t);
        }
        function ce(e, r) {
          return e.sort(function (e, t) {
            return exports.compare(e, t, r);
          });
        }
        function he(e, r) {
          return e.sort(function (e, t) {
            return exports.rcompare(e, t, r);
          });
        }
        function le(e, r, t) {
          return ae(e, r, t) > 0;
        }
        function fe(e, r, t) {
          return ae(e, r, t) < 0;
        }
        function ve(e, r, t) {
          return 0 === ae(e, r, t);
        }
        function me(e, r, t) {
          return 0 !== ae(e, r, t);
        }
        function we(e, r, t) {
          return ae(e, r, t) >= 0;
        }
        function ge(e, r, t) {
          return ae(e, r, t) <= 0;
        }
        function xe(e, r, t, n) {
          switch (r) {
            case "===":
              return (
                "object" == typeof e && (e = e.version),
                "object" == typeof t && (t = t.version),
                e === t
              );
            case "!==":
              return (
                "object" == typeof e && (e = e.version),
                "object" == typeof t && (t = t.version),
                e !== t
              );
            case "":
            case "=":
            case "==":
              return ve(e, t, n);
            case "!=":
              return me(e, t, n);
            case ">":
              return le(e, t, n);
            case ">=":
              return we(e, t, n);
            case "<":
              return fe(e, t, n);
            case "<=":
              return ge(e, t, n);
            default:
              throw new TypeError("Invalid operator: " + r);
          }
        }
        function ye(r, t) {
          if (
            ((t && "object" == typeof t) ||
              (t = { loose: !!t, includePrerelease: !1 }),
            r instanceof ye)
          ) {
            if (r.loose === !!t.loose) return r;
            r = r.value;
          }
          if (!(this instanceof ye)) return new ye(r, t);
          e("comparator", r, t),
            (this.options = t),
            (this.loose = !!t.loose),
            this.parse(r),
            this.semver === de
              ? (this.value = "")
              : (this.value = this.operator + this.semver.version),
            e("comp", this);
        }
        (exports.rcompareIdentifiers = ne),
          (exports.major = oe),
          (exports.minor = se),
          (exports.patch = ie),
          (exports.compare = ae),
          (exports.compareLoose = pe),
          (exports.rcompare = ue),
          (exports.sort = ce),
          (exports.rsort = he),
          (exports.gt = le),
          (exports.lt = fe),
          (exports.eq = ve),
          (exports.neq = me),
          (exports.gte = we),
          (exports.lte = ge),
          (exports.cmp = xe),
          (exports.Comparator = ye);
        var de = {};
        function je(e, r) {
          if (
            ((r && "object" == typeof r) ||
              (r = { loose: !!r, includePrerelease: !1 }),
            e instanceof je)
          )
            return e.loose === !!r.loose &&
              e.includePrerelease === !!r.includePrerelease
              ? e
              : new je(e.raw, r);
          if (e instanceof ye) return new je(e.value, r);
          if (!(this instanceof je)) return new je(e, r);
          if (
            ((this.options = r),
            (this.loose = !!r.loose),
            (this.includePrerelease = !!r.includePrerelease),
            (this.raw = e),
            (this.set = e
              .split(/\s*\|\|\s*/)
              .map(function (e) {
                return this.parseRange(e.trim());
              }, this)
              .filter(function (e) {
                return e.length;
              })),
            !this.set.length)
          )
            throw new TypeError("Invalid SemVer Range: " + e);
          this.format();
        }
        function Ee(e, r) {
          return new je(e, r).set.map(function (e) {
            return e
              .map(function (e) {
                return e.value;
              })
              .join(" ")
              .trim()
              .split(" ");
          });
        }
        function be(r, t) {
          return (
            e("comp", r, t),
            (r = Te(r, t)),
            e("caret", r),
            (r = Re(r, t)),
            e("tildes", r),
            (r = ke(r, t)),
            e("xrange", r),
            (r = Ve(r, t)),
            e("stars", r),
            r
          );
        }
        function $e(e) {
          return !e || "x" === e.toLowerCase() || "*" === e;
        }
        function Re(e, r) {
          return e
            .trim()
            .split(/\s+/)
            .map(function (e) {
              return Se(e, r);
            })
            .join(" ");
        }
        function Se(r, t) {
          var n = t.loose ? s[M] : s[A];
          return r.replace(n, function (t, n, o, s, i) {
            var a;
            return (
              e("tilde", r, t, n, o, s, i),
              $e(n)
                ? (a = "")
                : $e(o)
                ? (a = ">=" + n + ".0.0 <" + (+n + 1) + ".0.0")
                : $e(s)
                ? (a = ">=" + n + "." + o + ".0 <" + n + "." + (+o + 1) + ".0")
                : i
                ? (e("replaceTilde pr", i),
                  (a =
                    ">=" +
                    n +
                    "." +
                    o +
                    "." +
                    s +
                    "-" +
                    i +
                    " <" +
                    n +
                    "." +
                    (+o + 1) +
                    ".0"))
                : (a =
                    ">=" +
                    n +
                    "." +
                    o +
                    "." +
                    s +
                    " <" +
                    n +
                    "." +
                    (+o + 1) +
                    ".0"),
              e("tilde return", a),
              a
            );
          });
        }
        function Te(e, r) {
          return e
            .trim()
            .split(/\s+/)
            .map(function (e) {
              return Pe(e, r);
            })
            .join(" ");
        }
        function Pe(r, t) {
          e("caret", r, t);
          var n = t.loose ? s[Z] : s[z];
          return r.replace(n, function (t, n, o, s, i) {
            var a;
            return (
              e("caret", r, t, n, o, s, i),
              $e(n)
                ? (a = "")
                : $e(o)
                ? (a = ">=" + n + ".0.0 <" + (+n + 1) + ".0.0")
                : $e(s)
                ? (a =
                    "0" === n
                      ? ">=" + n + "." + o + ".0 <" + n + "." + (+o + 1) + ".0"
                      : ">=" + n + "." + o + ".0 <" + (+n + 1) + ".0.0")
                : i
                ? (e("replaceCaret pr", i),
                  (a =
                    "0" === n
                      ? "0" === o
                        ? ">=" +
                          n +
                          "." +
                          o +
                          "." +
                          s +
                          "-" +
                          i +
                          " <" +
                          n +
                          "." +
                          o +
                          "." +
                          (+s + 1)
                        : ">=" +
                          n +
                          "." +
                          o +
                          "." +
                          s +
                          "-" +
                          i +
                          " <" +
                          n +
                          "." +
                          (+o + 1) +
                          ".0"
                      : ">=" +
                        n +
                        "." +
                        o +
                        "." +
                        s +
                        "-" +
                        i +
                        " <" +
                        (+n + 1) +
                        ".0.0"))
                : (e("no pr"),
                  (a =
                    "0" === n
                      ? "0" === o
                        ? ">=" +
                          n +
                          "." +
                          o +
                          "." +
                          s +
                          " <" +
                          n +
                          "." +
                          o +
                          "." +
                          (+s + 1)
                        : ">=" +
                          n +
                          "." +
                          o +
                          "." +
                          s +
                          " <" +
                          n +
                          "." +
                          (+o + 1) +
                          ".0"
                      : ">=" +
                        n +
                        "." +
                        o +
                        "." +
                        s +
                        " <" +
                        (+n + 1) +
                        ".0.0")),
              e("caret return", a),
              a
            );
          });
        }
        function ke(r, t) {
          return (
            e("replaceXRanges", r, t),
            r
              .split(/\s+/)
              .map(function (e) {
                return Ie(e, t);
              })
              .join(" ")
          );
        }
        function Ie(r, t) {
          r = r.trim();
          var n = t.loose ? s[k] : s[P];
          return r.replace(n, function (t, n, o, s, i, a) {
            e("xRange", r, t, n, o, s, i, a);
            var p = $e(o),
              u = p || $e(s),
              c = u || $e(i);
            return (
              "=" === n && c && (n = ""),
              p
                ? (t = ">" === n || "<" === n ? "<0.0.0" : "*")
                : n && c
                ? (u && (s = 0),
                  (i = 0),
                  ">" === n
                    ? ((n = ">="),
                      u
                        ? ((o = +o + 1), (s = 0), (i = 0))
                        : ((s = +s + 1), (i = 0)))
                    : "<=" === n &&
                      ((n = "<"), u ? (o = +o + 1) : (s = +s + 1)),
                  (t = n + o + "." + s + "." + i))
                : u
                ? (t = ">=" + o + ".0.0 <" + (+o + 1) + ".0.0")
                : c &&
                  (t = ">=" + o + "." + s + ".0 <" + o + "." + (+s + 1) + ".0"),
              e("xRange return", t),
              t
            );
          });
        }
        function Ve(r, t) {
          return e("replaceStars", r, t), r.trim().replace(s[D], "");
        }
        function Ce(e, r, t, n, o, s, i, a, p, u, c, h, l) {
          return (
            (r = $e(t)
              ? ""
              : $e(n)
              ? ">=" + t + ".0.0"
              : $e(o)
              ? ">=" + t + "." + n + ".0"
              : ">=" + r) +
            " " +
            (a = $e(p)
              ? ""
              : $e(u)
              ? "<" + (+p + 1) + ".0.0"
              : $e(c)
              ? "<" + p + "." + (+u + 1) + ".0"
              : h
              ? "<=" + p + "." + u + "." + c + "-" + h
              : "<=" + a)
          ).trim();
        }
        function qe(r, t, n) {
          for (var o = 0; o < r.length; o++) if (!r[o].test(t)) return !1;
          if (t.prerelease.length && !n.includePrerelease) {
            for (o = 0; o < r.length; o++)
              if (
                (e(r[o].semver),
                r[o].semver !== de && r[o].semver.prerelease.length > 0)
              ) {
                var s = r[o].semver;
                if (
                  s.major === t.major &&
                  s.minor === t.minor &&
                  s.patch === t.patch
                )
                  return !0;
              }
            return !1;
          }
          return !0;
        }
        function Ae(e, r, t) {
          try {
            r = new je(r, t);
          } catch (n) {
            return !1;
          }
          return r.test(e);
        }
        function Me(e, r, t) {
          var n = null,
            o = null;
          try {
            var s = new je(r, t);
          } catch (i) {
            return null;
          }
          return (
            e.forEach(function (e) {
              s.test(e) &&
                ((n && -1 !== o.compare(e)) || (o = new W((n = e), t)));
            }),
            n
          );
        }
        function Ne(e, r, t) {
          var n = null,
            o = null;
          try {
            var s = new je(r, t);
          } catch (i) {
            return null;
          }
          return (
            e.forEach(function (e) {
              s.test(e) &&
                ((n && 1 !== o.compare(e)) || (o = new W((n = e), t)));
            }),
            n
          );
        }
        function Xe(e, r) {
          e = new je(e, r);
          var t = new W("0.0.0");
          if (e.test(t)) return t;
          if (((t = new W("0.0.0-0")), e.test(t))) return t;
          t = null;
          for (var n = 0; n < e.set.length; ++n) {
            e.set[n].forEach(function (e) {
              var r = new W(e.semver.version);
              switch (e.operator) {
                case ">":
                  0 === r.prerelease.length ? r.patch++ : r.prerelease.push(0),
                    (r.raw = r.format());
                case "":
                case ">=":
                  (t && !le(t, r)) || (t = r);
                  break;
                case "<":
                case "<=":
                  break;
                default:
                  throw new Error("Unexpected operation: " + e.operator);
              }
            });
          }
          return t && e.test(t) ? t : null;
        }
        function _e(e, r) {
          try {
            return new je(e, r).range || "*";
          } catch (t) {
            return null;
          }
        }
        function ze(e, r, t) {
          return Le(e, r, "<", t);
        }
        function Ze(e, r, t) {
          return Le(e, r, ">", t);
        }
        function Le(e, r, t, n) {
          var o, s, i, a, p;
          switch (((e = new W(e, n)), (r = new je(r, n)), t)) {
            case ">":
              (o = le), (s = ge), (i = fe), (a = ">"), (p = ">=");
              break;
            case "<":
              (o = fe), (s = we), (i = le), (a = "<"), (p = "<=");
              break;
            default:
              throw new TypeError('Must provide a hilo val of "<" or ">"');
          }
          if (Ae(e, r, n)) return !1;
          for (var u = 0; u < r.set.length; ++u) {
            var c = r.set[u],
              h = null,
              l = null;
            if (
              (c.forEach(function (e) {
                e.semver === de && (e = new ye(">=0.0.0")),
                  (h = h || e),
                  (l = l || e),
                  o(e.semver, h.semver, n)
                    ? (h = e)
                    : i(e.semver, l.semver, n) && (l = e);
              }),
              h.operator === a || h.operator === p)
            )
              return !1;
            if ((!l.operator || l.operator === a) && s(e, l.semver)) return !1;
            if (l.operator === p && i(e, l.semver)) return !1;
          }
          return !0;
        }
        function Fe(e, r) {
          var t = J(e, r);
          return t && t.prerelease.length ? t.prerelease : null;
        }
        function Ge(e, r, t) {
          return (e = new je(e, t)), (r = new je(r, t)), e.intersects(r);
        }
        function Oe(e) {
          if (e instanceof W) return e;
          if ("string" != typeof e) return null;
          var r = e.match(s[I]);
          return null == r
            ? null
            : J(r[1] + "." + (r[2] || "0") + "." + (r[3] || "0"));
        }
        (ye.prototype.parse = function (e) {
          var r = this.options.loose ? s[L] : s[F],
            t = e.match(r);
          if (!t) throw new TypeError("Invalid comparator: " + e);
          (this.operator = t[1]),
            "=" === this.operator && (this.operator = ""),
            t[2]
              ? (this.semver = new W(t[2], this.options.loose))
              : (this.semver = de);
        }),
          (ye.prototype.toString = function () {
            return this.value;
          }),
          (ye.prototype.test = function (r) {
            return (
              e("Comparator.test", r, this.options.loose),
              this.semver === de ||
                ("string" == typeof r && (r = new W(r, this.options)),
                xe(r, this.operator, this.semver, this.options))
            );
          }),
          (ye.prototype.intersects = function (e, r) {
            if (!(e instanceof ye))
              throw new TypeError("a Comparator is required");
            var t;
            if (
              ((r && "object" == typeof r) ||
                (r = { loose: !!r, includePrerelease: !1 }),
              "" === this.operator)
            )
              return (t = new je(e.value, r)), Ae(this.value, t, r);
            if ("" === e.operator)
              return (t = new je(this.value, r)), Ae(e.semver, t, r);
            var n = !(
                (">=" !== this.operator && ">" !== this.operator) ||
                (">=" !== e.operator && ">" !== e.operator)
              ),
              o = !(
                ("<=" !== this.operator && "<" !== this.operator) ||
                ("<=" !== e.operator && "<" !== e.operator)
              ),
              s = this.semver.version === e.semver.version,
              i = !(
                (">=" !== this.operator && "<=" !== this.operator) ||
                (">=" !== e.operator && "<=" !== e.operator)
              ),
              a =
                xe(this.semver, "<", e.semver, r) &&
                (">=" === this.operator || ">" === this.operator) &&
                ("<=" === e.operator || "<" === e.operator),
              p =
                xe(this.semver, ">", e.semver, r) &&
                ("<=" === this.operator || "<" === this.operator) &&
                (">=" === e.operator || ">" === e.operator);
            return n || o || (s && i) || a || p;
          }),
          (exports.Range = je),
          (je.prototype.format = function () {
            return (
              (this.range = this.set
                .map(function (e) {
                  return e.join(" ").trim();
                })
                .join("||")
                .trim()),
              this.range
            );
          }),
          (je.prototype.toString = function () {
            return this.range;
          }),
          (je.prototype.parseRange = function (r) {
            var t = this.options.loose;
            r = r.trim();
            var n = t ? s[B] : s[U];
            (r = r.replace(n, Ce)),
              e("hyphen replace", r),
              (r = r.replace(s[G], O)),
              e("comparator trim", r, s[G]),
              (r = (r = (r = r.replace(s[C], q)).replace(s[X], _))
                .split(/\s+/)
                .join(" "));
            var o = t ? s[L] : s[F],
              i = r
                .split(" ")
                .map(function (e) {
                  return be(e, this.options);
                }, this)
                .join(" ")
                .split(/\s+/);
            return (
              this.options.loose &&
                (i = i.filter(function (e) {
                  return !!e.match(o);
                })),
              (i = i.map(function (e) {
                return new ye(e, this.options);
              }, this))
            );
          }),
          (je.prototype.intersects = function (e, r) {
            if (!(e instanceof je)) throw new TypeError("a Range is required");
            return this.set.some(function (t) {
              return t.every(function (t) {
                return e.set.some(function (e) {
                  return e.every(function (e) {
                    return t.intersects(e, r);
                  });
                });
              });
            });
          }),
          (exports.toComparators = Ee),
          (je.prototype.test = function (e) {
            if (!e) return !1;
            "string" == typeof e && (e = new W(e, this.options));
            for (var r = 0; r < this.set.length; r++)
              if (qe(this.set[r], e, this.options)) return !0;
            return !1;
          }),
          (exports.satisfies = Ae),
          (exports.maxSatisfying = Me),
          (exports.minSatisfying = Ne),
          (exports.minVersion = Xe),
          (exports.validRange = _e),
          (exports.ltr = ze),
          (exports.gtr = Ze),
          (exports.outside = Le),
          (exports.prerelease = Fe),
          (exports.intersects = Ge),
          (exports.coerce = Oe);
      },
      { process: "rH1J" },
    ],
    utWm: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = n(require("semver"));
        function t() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (t = function () {
              return e;
            }),
            e
          );
        }
        function n(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var n = t();
          if (n && n.has(e)) return n.get(e);
          var r = {},
            a = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var o in e)
            if (Object.prototype.hasOwnProperty.call(e, o)) {
              var u = a ? Object.getOwnPropertyDescriptor(e, o) : null;
              u && (u.get || u.set)
                ? Object.defineProperty(r, o, u)
                : (r[o] = e[o]);
            }
          return (r.default = e), n && n.set(e, r), r;
        }
        function r(e, t) {
          if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
        }
        function a(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(e, r.key, r);
          }
        }
        function o(e, t, n) {
          return t && a(e.prototype, t), n && a(e, n), e;
        }
        var u = (function () {
          function t() {
            r(this, t);
          }
          return (
            o(t, null, [
              {
                key: "getLatest",
                value: function (t) {
                  return new Promise(function (n, r) {
                    ddmm.app.getFeatureFlag("autoUpdate") ||
                      (t.commit("set_update_status", "none"), n(ddmm.version)),
                      ddmm.env.DDMM_FAKE_UPDATE
                        ? (t.commit("set_update_status", "available"),
                          n(ddmm.env.DDMM_FAKE_UPDATE))
                        : fetch(
                            "https://api.github.com/repos/DokiDokiModManager/Mod-Manager/releases/latest"
                          )
                            .then(function (e) {
                              return e.json();
                            })
                            .then(function (r) {
                              e.gt(r.name, ddmm.version)
                                ? t.commit("set_update_status", "available")
                                : t.commit("set_update_status", "none"),
                                n(r.name);
                            })
                            .catch(function (e) {
                              r(e);
                            });
                  });
                },
              },
            ]),
            t
          );
        })();
        exports.default = u;
      },
      { semver: "xjuS" },
    ],
    vtl7: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var t = e(require("../../../js/utils/UpdateChecker"));
        function e(t) {
          return t && t.__esModule ? t : { default: t };
        }
        var n = {
          name: "UpdateOptions",
          methods: {
            _: ddmm.translate,
            doUpdate: function () {
              this.$store.commit("set_update_status", "downloading"),
                ddmm.app.downloadUpdate();
            },
            checkUpdate: function () {
              var e = this;
              (this.checking = !0),
                t.default
                  .getLatest(this.$store)
                  .then(function (t) {
                    e.latest = t;
                  })
                  .finally(function () {
                    e.checking = !1;
                  });
            },
          },
          data: function () {
            return { version: ddmm.version, latest: "", checking: !0 };
          },
          computed: {
            update_status: function () {
              return this.$store.state.update;
            },
          },
          mounted: function () {
            this.checkUpdate();
          },
        };
        exports.default = n;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this,
                  e = t.$createElement,
                  s = t._self._c || e;
                return s(
                  "div",
                  [
                    s("h1", [
                      t._v(
                        t._s(t._("renderer.tab_options.section_updates.title"))
                      ),
                    ]),
                    t._v(" "),
                    s("p", [
                      t._v(
                        t._s(
                          t._("renderer.tab_options.section_updates.subtitle")
                        )
                      ),
                    ]),
                    t._v(" "),
                    s("br"),
                    t._v(" "),
                    s("p", [
                      s("strong", [
                        t._v(
                          t._s(
                            t._(
                              "renderer.tab_options.section_updates.description_current_version",
                              t.version
                            )
                          )
                        ),
                      ]),
                    ]),
                    t._v(" "),
                    s("p", [
                      s("strong", [
                        t._v(
                          t._s(
                            t._(
                              "renderer.tab_options.section_updates.description_latest_version",
                              t.latest
                            )
                          )
                        ),
                      ]),
                    ]),
                    t._v(" "),
                    s("br"),
                    t._v(" "),
                    "none" === t.update_status
                      ? [
                          s("p", [
                            t._v(
                              t._s(
                                t._(
                                  "renderer.tab_options.section_updates.description_no_update"
                                )
                              )
                            ),
                          ]),
                          t._v(" "),
                          s("br"),
                          t._v(" "),
                          s(
                            "button",
                            {
                              staticClass: "primary",
                              on: { click: t.checkUpdate },
                            },
                            [
                              s("i", { staticClass: "fas fa-sync fa-fw" }),
                              t._v(
                                " " +
                                  t._s(
                                    t._(
                                      "renderer.tab_options.section_updates.button_check"
                                    )
                                  )
                              ),
                            ]
                          ),
                        ]
                      : "available" === t.update_status
                      ? [
                          s("p", [
                            t._v(
                              t._s(
                                t._(
                                  "renderer.tab_options.section_updates.description_has_update"
                                )
                              )
                            ),
                          ]),
                          t._v(" "),
                          s("br"),
                          t._v(" "),
                          s(
                            "button",
                            {
                              staticClass: "primary",
                              on: { click: t.doUpdate },
                            },
                            [
                              s("i", { staticClass: "fas fa-download fa-fw" }),
                              t._v(
                                " " +
                                  t._s(
                                    t._(
                                      "renderer.tab_options.section_updates.button_download"
                                    )
                                  )
                              ),
                            ]
                          ),
                        ]
                      : "downloading" === t.update_status
                      ? [
                          s("p", [
                            t._v(
                              t._s(
                                t._(
                                  "renderer.tab_options.section_updates.description_downloading"
                                )
                              )
                            ),
                          ]),
                        ]
                      : "downloaded" === t.update_status
                      ? [
                          s("p", [
                            t._v(
                              t._s(
                                t._(
                                  "renderer.tab_options.section_updates.description_downloaded"
                                )
                              )
                            ),
                          ]),
                        ]
                      : t._e(),
                  ],
                  2
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-9453b9",
              functional: void 0,
            });
        })();
      },
      { "../../../js/utils/UpdateChecker": "utWm" },
    ],
    nE9D: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = {
          name: "InstallFolderSelector",
          props: ["value"],
          methods: {
            _: ddmm.translate,
            change: function () {
              var e = ddmm.app.selectFolder();
              (this.save_directory = e.path),
                e.error
                  ? ((this.error = e.error), this.$emit("folder", null))
                  : ddmm.app.getDiskSpace(e.path) > 2147483648
                  ? ((this.error = null), this.$emit("folder", e.path))
                  : ((this.error = ddmm.translate(
                      "renderer.component_install_folder_selector.error_disk_space"
                    )),
                    this.$emit("folder", null));
            },
          },
          data: function () {
            return {
              save_directory: ddmm.config.readConfigValue("installFolder"),
              error: null,
            };
          },
        };
        exports.default = e;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement,
                  r = e._self._c || t;
                return r("div", [
                  r("p", [
                    r("label", { attrs: { for: "ob_install_folder" } }, [
                      e._v(
                        e._s(
                          e._(
                            "renderer.component_install_folder_selector.label"
                          )
                        ) + " "
                      ),
                      e.error
                        ? r("strong", [e._v("(" + e._s(e.error) + ")")])
                        : e._e(),
                    ]),
                  ]),
                  e._v(" "),
                  r("div", { staticClass: "input-row" }, [
                    r("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: e.save_directory,
                          expression: "save_directory",
                        },
                      ],
                      attrs: {
                        type: "text",
                        readonly: "",
                        id: "ob_install_folder",
                      },
                      domProps: { value: e.save_directory },
                      on: {
                        input: function (t) {
                          t.target.composing ||
                            (e.save_directory = t.target.value);
                        },
                      },
                    }),
                    e._v(" "),
                    r(
                      "button",
                      { staticClass: "secondary", on: { click: e.change } },
                      [
                        e._v(
                          e._s(
                            e._(
                              "renderer.component_install_folder_selector.button_select"
                            )
                          )
                        ),
                      ]
                    ),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-56cf19",
              functional: void 0,
            });
        })();
      },
      {},
    ],
    ZUT5: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = t(require("../../elements/InstallFolderSelector"));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var l = {
          name: "StorageOptions",
          components: { InstallFolderSelector: e.default },
          methods: {
            _: ddmm.translate,
            setNewFolder: function (e) {
              this.installFolder = e;
            },
            move: function () {
              ddmm.app.moveInstallFolder(this.installFolder);
            },
          },
          data: function () {
            return { installFolder: null };
          },
        };
        exports.default = l;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement,
                  o = e._self._c || t;
                return o(
                  "div",
                  [
                    o("h1", [
                      e._v(
                        e._s(e._("renderer.tab_options.section_storage.title"))
                      ),
                    ]),
                    e._v(" "),
                    o("p", [
                      e._v(
                        e._s(
                          e._("renderer.tab_options.section_storage.subtitle")
                        )
                      ),
                    ]),
                    e._v(" "),
                    o("br"),
                    e._v(" "),
                    o("p", [
                      e._v(
                        e._s(
                          e._(
                            "renderer.tab_options.section_storage.description"
                          )
                        )
                      ),
                    ]),
                    e._v(" "),
                    o("br"),
                    e._v(" "),
                    o("p", [
                      o("strong", [
                        e._v(
                          e._s(
                            e._(
                              "renderer.tab_options.section_storage.description_moving"
                            )
                          )
                        ),
                      ]),
                    ]),
                    e._v(" "),
                    o("br"),
                    e._v(" "),
                    o("InstallFolderSelector", {
                      on: { folder: e.setNewFolder },
                    }),
                    e._v(" "),
                    o("br"),
                    e._v(" "),
                    o("p", [
                      o(
                        "button",
                        {
                          staticClass: "primary",
                          attrs: { disabled: !e.installFolder },
                          on: { click: e.move },
                        },
                        [
                          o("i", { staticClass: "fas fa-pencil-alt fa-fw" }),
                          e._v(
                            " " +
                              e._s(
                                e._(
                                  "renderer.tab_options.section_storage.button_confirm"
                                )
                              )
                          ),
                        ]
                      ),
                    ]),
                  ],
                  1
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-245162",
              functional: void 0,
            });
        })();
      },
      { "../../elements/InstallFolderSelector": "nE9D" },
    ],
    R8Kz: [
      function (require, module, exports) {
        module.exports = {
          languages: [
            { code: "be", name: "Беларуская" },
            { code: "de", name: "Deutsch" },
            { code: "en-US", name: "English (United States)" },
            { code: "es-419", name: "Español (Latinoamérica)" },
            { code: "fa", name: "فارسی" },
            { code: "fr", name: "Français" },
            { code: "id", name: "Bahasa Indonesia" },
            { code: "ja", name: "日本語" },
            { code: "nb_NO", name: "Norsk Bokmål" },
            { code: "pl", name: "Polski" },
            { code: "ru", name: "Русский" },
            { code: "tr", name: "Türkçe" },
            { code: "uk", name: "Українська" },
            { code: "zh_Hans", name: "简体中文" },
          ],
        };
      },
      {},
    ],
    Njdw: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = n(require("../../../data/languages.json")),
          a = n(require("../../elements/Link"));
        function n(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var t = {
          name: "LanguageOptions",
          components: { Link: a.default },
          methods: {
            _: ddmm.translate,
            setLanguage: function () {
              ddmm.config.saveConfigValue("language", this.language_interim),
                this.$store.commit("show_modal", { modal: "language_switch" }),
                ddmm.reloadLanguages();
            },
          },
          data: function () {
            return {
              language_interim: ddmm.config.readConfigValue("language"),
              languages: e.default.languages,
            };
          },
          mounted: function () {},
        };
        exports.default = t;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement,
                  n = e._self._c || t;
                return n("div", [
                  n("h1", [
                    e._v(
                      e._s(e._("renderer.tab_options.section_language.title"))
                    ),
                  ]),
                  e._v(" "),
                  n("p", [
                    e._v(
                      e._s(
                        e._("renderer.tab_options.section_language.subtitle")
                      )
                    ),
                  ]),
                  e._v(" "),
                  n("br"),
                  e._v(" "),
                  n("p", [
                    n("label", { attrs: { for: "language-switch-select" } }, [
                      e._v(
                        e._s(
                          e._(
                            "renderer.tab_options.section_language.label_language"
                          )
                        )
                      ),
                    ]),
                  ]),
                  e._v(" "),
                  n("p", [
                    n(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: e.language_interim,
                            expression: "language_interim",
                          },
                        ],
                        attrs: { id: "language-switch-select" },
                        on: {
                          change: [
                            function (t) {
                              var n = Array.prototype.filter
                                .call(t.target.options, function (e) {
                                  return e.selected;
                                })
                                .map(function (e) {
                                  return "_value" in e ? e._value : e.value;
                                });
                              e.language_interim = t.target.multiple ? n : n[0];
                            },
                            e.setLanguage,
                          ],
                        },
                      },
                      e._l(e.languages, function (t) {
                        return n("option", { domProps: { value: t.code } }, [
                          e._v(" " + e._s(t.name) + " "),
                        ]);
                      }),
                      0
                    ),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-90de92",
              functional: void 0,
            });
        })();
      },
      { "../../../data/languages.json": "R8Kz", "../../elements/Link": "TptL" },
    ],
    Q53G: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = {
          name: "SDKOptions",
          methods: {
            _: ddmm.translate,
            updateSDKMode: function () {
              this.$store.commit("options", {
                sdk_mode: this.sdk_mode_interim,
              });
            },
          },
          data: function () {
            return { sdk_mode_interim: ddmm.config.readConfigValue("sdkMode") };
          },
        };
        exports.default = e;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  d = e.$createElement,
                  o = e._self._c || d;
                return o("div", [
                  o("h1", [
                    e._v(e._s(e._("renderer.tab_options.section_sdk.title"))),
                  ]),
                  e._v(" "),
                  o("p", [
                    e._v(
                      e._s(e._("renderer.tab_options.section_sdk.subtitle"))
                    ),
                  ]),
                  e._v(" "),
                  o("br"),
                  e._v(" "),
                  o("p", [
                    o("strong", [
                      e._v(
                        e._s(
                          e._(
                            "renderer.tab_options.section_sdk.description_mode"
                          )
                        )
                      ),
                    ]),
                  ]),
                  e._v(" "),
                  o("p", [
                    o("label", [
                      o("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: e.sdk_mode_interim,
                            expression: "sdk_mode_interim",
                          },
                        ],
                        attrs: {
                          type: "radio",
                          name: "sdk_mode_checkbox",
                          value: "always",
                        },
                        domProps: {
                          checked: e._q(e.sdk_mode_interim, "always"),
                        },
                        on: {
                          change: [
                            function (d) {
                              e.sdk_mode_interim = "always";
                            },
                            e.updateSDKMode,
                          ],
                        },
                      }),
                      e._v(
                        " " +
                          e._s(
                            e._(
                              "renderer.tab_options.section_sdk.checkbox_always"
                            )
                          )
                      ),
                    ]),
                  ]),
                  e._v(" "),
                  o("p", [
                    o("label", [
                      o("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: e.sdk_mode_interim,
                            expression: "sdk_mode_interim",
                          },
                        ],
                        attrs: {
                          type: "radio",
                          name: "sdk_mode_checkbox",
                          value: "specified",
                        },
                        domProps: {
                          checked: e._q(e.sdk_mode_interim, "specified"),
                        },
                        on: {
                          change: [
                            function (d) {
                              e.sdk_mode_interim = "specified";
                            },
                            e.updateSDKMode,
                          ],
                        },
                      }),
                      e._v(
                        " " +
                          e._s(
                            e._(
                              "renderer.tab_options.section_sdk.checkbox_specified"
                            )
                          )
                      ),
                    ]),
                  ]),
                  e._v(" "),
                  o("p", [
                    o("label", [
                      o("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: e.sdk_mode_interim,
                            expression: "sdk_mode_interim",
                          },
                        ],
                        attrs: {
                          type: "radio",
                          name: "sdk_mode_checkbox",
                          value: "never",
                        },
                        domProps: {
                          checked: e._q(e.sdk_mode_interim, "never"),
                        },
                        on: {
                          change: [
                            function (d) {
                              e.sdk_mode_interim = "never";
                            },
                            e.updateSDKMode,
                          ],
                        },
                      }),
                      e._v(
                        " " +
                          e._s(
                            e._(
                              "renderer.tab_options.section_sdk.checkbox_never"
                            )
                          )
                      ),
                    ]),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-d38780",
              functional: void 0,
            });
        })();
      },
      {},
    ],
    R7Ci: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = {
          name: "DiscordOptions",
          methods: {
            _: ddmm.translate,
            setRichPresence: function (e) {
              ddmm.config.saveConfigValue("discordEnabled", e);
            },
          },
          data: function () {
            return {
              rp_interim: ddmm.config.readConfigValue("discordEnabled"),
            };
          },
        };
        exports.default = e;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  r = e.$createElement,
                  i = e._self._c || r;
                return i("div", [
                  i("h1", [
                    e._v(
                      e._s(e._("renderer.tab_options.section_discord.title"))
                    ),
                  ]),
                  e._v(" "),
                  i("p", [
                    e._v(
                      e._s(e._("renderer.tab_options.section_discord.subtitle"))
                    ),
                  ]),
                  e._v(" "),
                  i("br"),
                  e._v(" "),
                  i("p", [
                    i("strong", [
                      e._v(
                        e._s(
                          e._(
                            "renderer.tab_options.section_discord.description"
                          )
                        )
                      ),
                    ]),
                  ]),
                  e._v(" "),
                  i("br"),
                  e._v(" "),
                  i("p", [
                    i("label", [
                      i("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: e.rp_interim,
                            expression: "rp_interim",
                          },
                        ],
                        attrs: { type: "checkbox" },
                        domProps: {
                          checked: Array.isArray(e.rp_interim)
                            ? e._i(e.rp_interim, null) > -1
                            : e.rp_interim,
                        },
                        on: {
                          change: [
                            function (r) {
                              var i = e.rp_interim,
                                t = r.target,
                                n = !!t.checked;
                              if (Array.isArray(i)) {
                                var o = e._i(i, null);
                                t.checked
                                  ? o < 0 && (e.rp_interim = i.concat([null]))
                                  : o > -1 &&
                                    (e.rp_interim = i
                                      .slice(0, o)
                                      .concat(i.slice(o + 1)));
                              } else e.rp_interim = n;
                            },
                            function (r) {
                              return e.setRichPresence(e.rp_interim);
                            },
                          ],
                        },
                      }),
                      e._v(
                        " " +
                          e._s(
                            e._(
                              "renderer.tab_options.section_discord.button_enable"
                            )
                          )
                      ),
                    ]),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-ef11c2",
              functional: void 0,
            });
        })();
      },
      {},
    ],
    lJLi: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = {
          name: "DebugOptions",
          data: function () {
            return {
              sdk_debugging_interim: ddmm.config.readConfigValue(
                "sdkDebuggingEnabled"
              ),
              renpy_interim: ddmm.config.readConfigValue("renpy"),
            };
          },
          methods: {
            _: ddmm.translate,
            setSDKDebugging: function (e) {
              ddmm.config.saveConfigValue("sdkDebuggingEnabled", !!e);
            },
            setRenpy: function (e) {
              ddmm.config.saveConfigValue("renpy", e);
            },
          },
        };
        exports.default = e;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  i = e.$createElement,
                  n = e._self._c || i;
                return n("div", [
                  n("h1", [
                    e._v(
                      e._s(e._("renderer.tab_options.section_testing.title"))
                    ),
                  ]),
                  e._v(" "),
                  n("p", [
                    e._v(
                      e._s(e._("renderer.tab_options.section_testing.subtitle"))
                    ),
                  ]),
                  e._v(" "),
                  n("br"),
                  e._v(" "),
                  n("h2", [
                    e._v(
                      e._s(
                        e._(
                          "renderer.tab_options.section_testing.header_mod_debug"
                        )
                      )
                    ),
                  ]),
                  e._v(" "),
                  n("p", [
                    e._v(
                      e._s(
                        e._(
                          "renderer.tab_options.section_testing.description_mod_debug"
                        )
                      )
                    ),
                  ]),
                  e._v(" "),
                  n("br"),
                  e._v(" "),
                  n("p", [
                    n("label", [
                      n("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: e.sdk_debugging_interim,
                            expression: "sdk_debugging_interim",
                          },
                        ],
                        attrs: { type: "checkbox" },
                        domProps: {
                          checked: Array.isArray(e.sdk_debugging_interim)
                            ? e._i(e.sdk_debugging_interim, null) > -1
                            : e.sdk_debugging_interim,
                        },
                        on: {
                          change: [
                            function (i) {
                              var n = e.sdk_debugging_interim,
                                r = i.target,
                                t = !!r.checked;
                              if (Array.isArray(n)) {
                                var s = e._i(n, null);
                                r.checked
                                  ? s < 0 &&
                                    (e.sdk_debugging_interim = n.concat([null]))
                                  : s > -1 &&
                                    (e.sdk_debugging_interim = n
                                      .slice(0, s)
                                      .concat(n.slice(s + 1)));
                              } else e.sdk_debugging_interim = t;
                            },
                            function (i) {
                              return e.setSDKDebugging(e.sdk_debugging_interim);
                            },
                          ],
                        },
                      }),
                      e._v(
                        " " +
                          e._s(
                            e._(
                              "renderer.tab_options.section_testing.checkbox_logging"
                            )
                          )
                      ),
                    ]),
                  ]),
                  e._v(" "),
                  n("br"),
                  e._v(" "),
                  n("h2", [
                    e._v(
                      e._s(
                        e._("renderer.tab_options.section_testing.header_renpy")
                      )
                    ),
                  ]),
                  e._v(" "),
                  n("p", [
                    e._v(
                      e._s(
                        e._(
                          "renderer.tab_options.section_testing.description_renpy"
                        )
                      )
                    ),
                  ]),
                  e._v(" "),
                  n("br"),
                  e._v(" "),
                  n("p", [
                    n("label", [
                      n("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: e.renpy_interim.skipSplash,
                            expression: "renpy_interim.skipSplash",
                          },
                        ],
                        attrs: { type: "checkbox" },
                        domProps: {
                          checked: Array.isArray(e.renpy_interim.skipSplash)
                            ? e._i(e.renpy_interim.skipSplash, null) > -1
                            : e.renpy_interim.skipSplash,
                        },
                        on: {
                          change: [
                            function (i) {
                              var n = e.renpy_interim.skipSplash,
                                r = i.target,
                                t = !!r.checked;
                              if (Array.isArray(n)) {
                                var s = e._i(n, null);
                                r.checked
                                  ? s < 0 &&
                                    e.$set(
                                      e.renpy_interim,
                                      "skipSplash",
                                      n.concat([null])
                                    )
                                  : s > -1 &&
                                    e.$set(
                                      e.renpy_interim,
                                      "skipSplash",
                                      n.slice(0, s).concat(n.slice(s + 1))
                                    );
                              } else e.$set(e.renpy_interim, "skipSplash", t);
                            },
                            function (i) {
                              return e.setRenpy(e.renpy_interim);
                            },
                          ],
                        },
                      }),
                      e._v(
                        " " +
                          e._s(
                            e._(
                              "renderer.tab_options.section_testing.checkbox_renpy_skipsplash"
                            )
                          )
                      ),
                    ]),
                  ]),
                  e._v(" "),
                  n("p", [
                    n("label", [
                      n("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: e.renpy_interim.skipMenu,
                            expression: "renpy_interim.skipMenu",
                          },
                        ],
                        attrs: { type: "checkbox" },
                        domProps: {
                          checked: Array.isArray(e.renpy_interim.skipMenu)
                            ? e._i(e.renpy_interim.skipMenu, null) > -1
                            : e.renpy_interim.skipMenu,
                        },
                        on: {
                          change: [
                            function (i) {
                              var n = e.renpy_interim.skipMenu,
                                r = i.target,
                                t = !!r.checked;
                              if (Array.isArray(n)) {
                                var s = e._i(n, null);
                                r.checked
                                  ? s < 0 &&
                                    e.$set(
                                      e.renpy_interim,
                                      "skipMenu",
                                      n.concat([null])
                                    )
                                  : s > -1 &&
                                    e.$set(
                                      e.renpy_interim,
                                      "skipMenu",
                                      n.slice(0, s).concat(n.slice(s + 1))
                                    );
                              } else e.$set(e.renpy_interim, "skipMenu", t);
                            },
                            function (i) {
                              return e.setRenpy(e.renpy_interim);
                            },
                          ],
                        },
                      }),
                      e._v(
                        " " +
                          e._s(
                            e._(
                              "renderer.tab_options.section_testing.checkbox_renpy_skipmenu"
                            )
                          )
                      ),
                    ]),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-479185",
              functional: void 0,
            });
        })();
      },
      {},
    ],
    Bblu: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = p(require("../../js/utils/Logger")),
          t = p(require("./options/BackgroundOptions.vue")),
          n = p(require("./options/AdvancedAppearanceOptions.vue")),
          o = p(require("./options/UpdateOptions.vue")),
          a = p(require("./options/StorageOptions.vue")),
          s = p(require("./options/LanguageOptions.vue")),
          i = p(require("./options/SDKOptions.vue")),
          r = p(require("./options/DiscordOptions.vue")),
          d = p(require("./options/DebugOptions.vue"));
        function p(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var l = {
          name: "OptionsTab",
          components: {
            BackgroundOptions: t.default,
            AdvancedAppearanceOptions: n.default,
            UpdateOptions: o.default,
            StorageOptions: a.default,
            LanguageOptions: s.default,
            SDKOptions: i.default,
            DiscordOptions: r.default,
            DebugOptions: d.default,
          },
          data: function () {
            var e = this;
            return {
              selected_option: sessionStorage.getItem(
                "tab_options_last_selection"
              )
                ? sessionStorage.getItem("tab_options_last_selection")
                : "LanguageOptions",
              menu: [
                {
                  header: ddmm.translate(
                    "renderer.tab_options.list.header_application"
                  ),
                  contents: [
                    {
                      title: ddmm.translate(
                        "renderer.tab_options.list.link_language"
                      ),
                      component: "LanguageOptions",
                    },
                    {
                      title: ddmm.translate(
                        "renderer.tab_options.list.link_updates"
                      ),
                      component: "UpdateOptions",
                      hideIf: function () {
                        return (
                          ddmm.constants.auto_update_disabled ||
                          !ddmm.app.getFeatureFlag("autoUpdate") ||
                          ("linux" === ddmm.platform && !ddmm.env.APPIMAGE)
                        );
                      },
                      tag: function () {
                        return "available" === e.$store.state.update
                          ? "1"
                          : null;
                      },
                    },
                    {
                      title: ddmm.translate(
                        "renderer.tab_options.list.link_storage"
                      ),
                      component: "StorageOptions",
                    },
                  ],
                },
                {
                  header: ddmm.translate(
                    "renderer.tab_options.list.header_appearance"
                  ),
                  contents: [
                    {
                      title: ddmm.translate(
                        "renderer.tab_options.list.link_background"
                      ),
                      component: "BackgroundOptions",
                    },
                    {
                      title: ddmm.translate(
                        "renderer.tab_options.list.link_advanced_appearance"
                      ),
                      component: "AdvancedAppearanceOptions",
                    },
                  ],
                },
                {
                  header: ddmm.translate(
                    "renderer.tab_options.list.header_enhancements"
                  ),
                  contents: [
                    {
                      title: ddmm.translate(
                        "renderer.tab_options.list.link_discord"
                      ),
                      component: "DiscordOptions",
                      hideIf: function () {
                        return ddmm.constants.discord_disabled;
                      },
                    },
                  ],
                },
                {
                  header: ddmm.translate(
                    "renderer.tab_options.list.header_developers"
                  ),
                  contents: [
                    {
                      title: ddmm.translate(
                        "renderer.tab_options.list.link_testing"
                      ),
                      component: "DebugOptions",
                    },
                  ],
                },
              ],
            };
          },
          methods: {
            selectOption: function (t) {
              e.default.info(
                "Options",
                "Selecting options from component " + t
              ),
                sessionStorage.setItem("tab_options_last_selection", t),
                (this.selected_option = t);
            },
          },
        };
        exports.default = l;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this,
                  e = t.$createElement,
                  s = t._self._c || e;
                return s("div", { staticClass: "page-content" }, [
                  s("div", { staticClass: "mod-viewer-pane" }, [
                    s(
                      "div",
                      { staticClass: "mod-viewer-mod-list" },
                      [
                        t._l(t.menu, function (e) {
                          return [
                            s(
                              "div",
                              { staticClass: "mod-view-mod-list-title" },
                              [t._v(t._s(e.header))]
                            ),
                            t._v(" "),
                            t._l(e.contents, function (e) {
                              return [
                                e.hideIf && e.hideIf()
                                  ? t._e()
                                  : s(
                                      "div",
                                      {
                                        class: {
                                          "mod-view-mod-list-entry": !0,
                                          active:
                                            t.selected_option === e.component,
                                        },
                                        on: {
                                          click: function (s) {
                                            return t.selectOption(e.component);
                                          },
                                        },
                                      },
                                      [
                                        s("span", [t._v(t._s(e.title))]),
                                        t._v(" "),
                                        e.tag && e.tag()
                                          ? s(
                                              "span",
                                              {
                                                staticClass:
                                                  "mod-view-mod-list-tag",
                                              },
                                              [s("span", [t._v(t._s(e.tag()))])]
                                            )
                                          : t._e(),
                                      ]
                                    ),
                              ];
                            }),
                            t._v(" "),
                            s("br"),
                          ];
                        }),
                      ],
                      2
                    ),
                    t._v(" "),
                    s("div", { staticClass: "mod-viewer-mod-display" }, [
                      s(
                        "div",
                        { staticClass: "main-content" },
                        [s(t.selected_option, { tag: "component" })],
                        1
                      ),
                    ]),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-409c09",
              functional: void 0,
            });
        })();
      },
      {
        "../../js/utils/Logger": "vKp2",
        "./options/BackgroundOptions.vue": "EOX6",
        "./options/AdvancedAppearanceOptions.vue": "a16z",
        "./options/UpdateOptions.vue": "vtl7",
        "./options/StorageOptions.vue": "ZUT5",
        "./options/LanguageOptions.vue": "Njdw",
        "./options/SDKOptions.vue": "Q53G",
        "./options/DiscordOptions.vue": "R7Ci",
        "./options/DebugOptions.vue": "lJLi",
      },
    ],
    Ev4J: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var o = {
          name: "ExperimentsTab",
          data: function () {
            return { local_ui_interim: ddmm.config.readConfigValue("localUI") };
          },
          methods: {
            _: ddmm.translate,
            devtools: function () {
              ddmm.window.openDevtools();
            },
            setLocalUI: function (o) {
              ddmm.config.saveConfigValue("localUI", o);
            },
            langReload: function () {
              ddmm.reloadLanguages();
            },
            startDownload: function (o) {
              ddmm.downloads.startDownload(o);
            },
          },
        };
        exports.default = o;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this,
                  o = t.$createElement,
                  n = t._self._c || o;
                return n("div", { staticClass: "page-content" }, [
                  n("div", { staticClass: "text-container" }, [
                    n("p", [
                      t._v(t._s(t._("blatantly.wrong.translation.key"))),
                    ]),
                    t._v(" "),
                    n("br"),
                    t._v(" "),
                    n("p", [
                      n(
                        "button",
                        { staticClass: "primary", on: { click: t.devtools } },
                        [t._v("Open DevTools")]
                      ),
                    ]),
                    t._v(" "),
                    n("br"),
                    t._v(" "),
                    n("p", [
                      n(
                        "button",
                        { staticClass: "primary", on: { click: t.langReload } },
                        [t._v("Reload Languages")]
                      ),
                    ]),
                    t._v(" "),
                    n("hr"),
                    t._v(" "),
                    n("p", [
                      n("label", { attrs: { for: "experiments-local-ui" } }, [
                        t._v("UI override"),
                      ]),
                      t._v(" "),
                      n("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: t.local_ui_interim,
                            expression: "local_ui_interim",
                          },
                        ],
                        attrs: { type: "url", id: "experiments-local-ui" },
                        domProps: { value: t.local_ui_interim },
                        on: {
                          input: function (o) {
                            o.target.composing ||
                              (t.local_ui_interim = o.target.value);
                          },
                        },
                      }),
                    ]),
                    t._v(" "),
                    n("br"),
                    t._v(" "),
                    n("p", [
                      n(
                        "button",
                        {
                          staticClass: "primary",
                          on: {
                            click: function (o) {
                              return t.setLocalUI(t.local_ui_interim);
                            },
                          },
                        },
                        [t._v("Set URL")]
                      ),
                      t._v(" "),
                      n(
                        "button",
                        {
                          staticClass: "secondary",
                          on: {
                            click: function (o) {
                              return t.setLocalUI(null);
                            },
                          },
                        },
                        [t._v("Unset")]
                      ),
                    ]),
                    t._v(" "),
                    n("hr"),
                    t._v(" "),
                    n("p", [
                      n(
                        "button",
                        {
                          staticClass: "secondary",
                          on: {
                            click: function (o) {
                              return t.startDownload(
                                "https://github.com/Monika-After-Story/MonikaModDev/releases/download/v0.11.0/Monika_After_Story-0.11.0-Mod.zip"
                              );
                            },
                          },
                        },
                        [t._v(" Download MAS ")]
                      ),
                      t._v(" "),
                      n(
                        "button",
                        {
                          staticClass: "secondary",
                          on: {
                            click: function (o) {
                              return t.startDownload(
                                "http://ipv4.download.thinkbroadband.com/1GB.zip"
                              );
                            },
                          },
                        },
                        [t._v(" Download Test 1GB ")]
                      ),
                    ]),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-7dd851",
              functional: void 0,
            });
        })();
      },
      {},
    ],
    l7PR: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var t = e(require("../elements/Link.vue"));
        function e(t) {
          return t && t.__esModule ? t : { default: t };
        }
        var n =
            "https://raw.githubusercontent.com/DokiDokiModManager/Meta/master/thanks.json",
          a = {
            name: "AboutTab",
            components: { Link: t.default },
            data: function () {
              return {
                supporters: [],
                translators: [],
                v4_beta: [],
                hide_dynamics: ddmm.constants.disable_dynamic_about,
              };
            },
            methods: { _: ddmm.translate },
            mounted: function () {
              var t = this;
              ddmm.constants.disable_dynamic_about ||
                fetch(n)
                  .then(function (t) {
                    return t.json();
                  })
                  .then(function (e) {
                    (t.supporters = e.patreon),
                      (t.translators = e.translations),
                      (t.v4_beta = e.v4_beta);
                  });
            },
          };
        exports.default = a;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement,
                  r = e._self._c || t;
                return r("div", { staticClass: "page-content" }, [
                  r("div", { staticClass: "text-container" }, [
                    r("h1", [e._v(e._s(e._("renderer.tab_about.title")))]),
                    e._v(" "),
                    r("p", [e._v(e._s(e._("renderer.tab_about.description")))]),
                    e._v(" "),
                    r("br"),
                    e._v(" "),
                    r("h2", [
                      e._v(e._s(e._("renderer.tab_about.title_disclaimer"))),
                    ]),
                    e._v(" "),
                    r("p", [
                      e._v(e._s(e._("renderer.tab_about.disclaimer_1"))),
                    ]),
                    e._v(" "),
                    r("br"),
                    e._v(" "),
                    r("p", [
                      e._v(e._s(e._("renderer.tab_about.disclaimer_2"))),
                    ]),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-f9eac5",
              functional: void 0,
            });
        })();
      },
      { "../elements/Link.vue": "TptL" },
    ],
    LAc4: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = { name: "MenuDialog" };
        exports.default = e;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this.$createElement,
                  e = this._self._c || t;
                return e("div", { staticClass: "dialog" }, [
                  e(
                    "div",
                    { staticClass: "dialog-body nopad" },
                    [this._t("default")],
                    2
                  ),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-1d03d7",
              functional: void 0,
            });
        })();
      },
      {},
    ],
    G37S: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var t = i(require("../base/MenuDialog.vue")),
          o = i(require("../../../js/utils/Launcher"));
        function i(t) {
          return t && t.__esModule ? t : { default: t };
        }
        var s = {
          name: "InstallOptionsDialog",
          components: { MenuDialog: t.default },
          computed: {
            install: function () {
              return this.$store.state.selected_install;
            },
            isWindows: function () {
              return "win32" === ddmm.platform;
            },
          },
          methods: {
            _: ddmm.translate,
            close: function () {
              this.$store.commit("hide_modal", { modal: "install_options" });
            },
            launch: function () {
              o.default.launch(this.install, this.$store), this.close();
            },
            createShortcut: function () {
              this.isWindows &&
                (ddmm.mods.createShortcut(
                  this.install.folderName,
                  this.install.name
                ),
                this.close());
            },
            rename: function () {
              this.$store.commit("hide_modal", { modal: "install_options" }),
                this.$store.commit("show_modal", { modal: "install_rename" });
            },
            archive: function () {
              this.install.globalSave ||
                this.install.archived ||
                0 !== this.install.monikaExportStatus ||
                (this.$store.commit("hide_modal", { modal: "install_options" }),
                this.$store.commit("show_modal", { modal: "install_archive" }));
            },
            deleteSave: function () {
              this.install.globalSave ||
                (this.$store.commit("hide_modal", { modal: "install_options" }),
                this.$store.commit("show_modal", { modal: "save_delete" }));
            },
            categories: function () {
              this.$store.commit("hide_modal", { modal: "install_options" }),
                this.$store.commit("show_modal", { modal: "install_category" });
            },
            uninstall: function () {
              this.$store.commit("hide_modal", { modal: "install_options" }),
                this.$store.commit("show_modal", { modal: "uninstall" });
            },
          },
        };
        exports.default = s;
        (function () {
          var a = exports.default || module.exports;
          "function" == typeof a && (a = a.options),
            Object.assign(a, {
              render: function () {
                var a = this,
                  s = a.$createElement,
                  e = a._self._c || s;
                return e("MenuDialog", [
                  e("div", { staticClass: "dialog-menu-description" }, [
                    e(
                      "h2",
                      {
                        staticStyle: {
                          "overflow-x": "hidden",
                          "white-space": "pre",
                          "text-overflow": "ellipsis",
                        },
                      },
                      [a._v(a._s(a.install.name))]
                    ),
                    a._v(" "),
                    e(
                      "p",
                      {
                        staticStyle: {
                          "overflow-x": "hidden",
                          "white-space": "pre",
                          "text-overflow": "ellipsis",
                        },
                      },
                      [a._v(a._s(a.install.folderName))]
                    ),
                  ]),
                  a._v(" "),
                  e("div", { staticClass: "dialog-menu-separator" }),
                  a._v(" "),
                  e(
                    "div",
                    {
                      staticClass: "dialog-menu-item",
                      on: { click: a.launch },
                    },
                    [
                      e("i", { staticClass: "fas fa-play fa-fw" }),
                      a._v(
                        " " +
                          a._s(a._("renderer.menu_install_options.launch")) +
                          " "
                      ),
                    ]
                  ),
                  a._v(" "),
                  e("div", { staticClass: "dialog-menu-separator" }),
                  a._v(" "),
                  e(
                    "div",
                    {
                      staticClass: "dialog-menu-item",
                      on: { click: a.rename },
                    },
                    [
                      e("i", { staticClass: "fas fa-pencil-alt fa-fw" }),
                      a._v(
                        " " +
                          a._s(a._("renderer.menu_install_options.rename")) +
                          " "
                      ),
                    ]
                  ),
                  a._v(" "),
                  a.isWindows
                    ? e(
                        "div",
                        {
                          staticClass: "dialog-menu-item",
                          on: { click: a.createShortcut },
                        },
                        [
                          e("i", {
                            staticClass: "fas fa-external-link-alt fa-fw",
                          }),
                          a._v(
                            " " +
                              a._s(
                                a._("renderer.menu_install_options.shortcut")
                              ) +
                              " "
                          ),
                        ]
                      )
                    : a._e(),
                  a._v(" "),
                  e(
                    "div",
                    {
                      staticClass: "dialog-menu-item",
                      on: { click: a.categories },
                    },
                    [
                      e("i", { staticClass: "fas fa-th-list fa-fw" }),
                      a._v(
                        " " +
                          a._s(a._("renderer.menu_install_options.category")) +
                          " "
                      ),
                    ]
                  ),
                  a._v(" "),
                  e("div", { staticClass: "dialog-menu-separator" }),
                  a._v(" "),
                  e(
                    "div",
                    {
                      class: {
                        "dialog-menu-item": !0,
                        disabled:
                          a.install.globalSave ||
                          a.install.archived ||
                          0 !== a.install.monikaExportStatus,
                      },
                      on: { click: a.archive },
                    },
                    [
                      e("i", { staticClass: "fas fa-archive fa-fw" }),
                      a._v(
                        " " +
                          a._s(a._("renderer.menu_install_options.archive")) +
                          " "
                      ),
                    ]
                  ),
                  a._v(" "),
                  e(
                    "div",
                    {
                      class: {
                        "dialog-menu-item": !0,
                        disabled: a.install.globalSave,
                        danger: !0,
                      },
                      on: { click: a.deleteSave },
                    },
                    [
                      e("i", { staticClass: "fas fa-undo fa-fw" }),
                      a._v(
                        " " +
                          a._s(
                            a._("renderer.menu_install_options.delete_save")
                          ) +
                          " "
                      ),
                    ]
                  ),
                  a._v(" "),
                  e(
                    "div",
                    {
                      staticClass: "dialog-menu-item danger",
                      on: { click: a.uninstall },
                    },
                    [
                      e("i", { staticClass: "fas fa-trash fa-fw" }),
                      a._v(
                        " " +
                          a._s(a._("renderer.menu_install_options.uninstall")) +
                          " "
                      ),
                    ]
                  ),
                  a._v(" "),
                  e("div", { staticClass: "dialog-menu-separator" }),
                  a._v(" "),
                  e(
                    "div",
                    { staticClass: "dialog-menu-item", on: { click: a.close } },
                    [
                      e("i", { staticClass: "fas fa-times fa-fw" }),
                      a._v(
                        " " +
                          a._s(a._("renderer.menu_install_options.cancel")) +
                          " "
                      ),
                    ]
                  ),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-9b4ecf",
              functional: void 0,
            });
        })();
      },
      {
        "../base/MenuDialog.vue": "LAc4",
        "../../../js/utils/Launcher": "wYBQ",
      },
    ],
    kA0R: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var o = t(require("../base/MenuDialog.vue"));
        function t(o) {
          return o && o.__esModule ? o : { default: o };
        }
        var e = {
          name: "ModOptionsDialog",
          components: { MenuDialog: o.default },
          computed: {
            mod: function () {
              return this.$store.state.selected_mod;
            },
            mod_path: function () {
              return ddmm.joinPath(
                ddmm.config.readConfigValue("installFolder"),
                "mods",
                this.mod
              );
            },
          },
          methods: {
            _: ddmm.translate,
            close: function () {
              this.$store.commit("hide_modal", { modal: "mod_options" });
            },
            deleteMod: function () {
              this.close(),
                this.$store.commit("show_modal", { modal: "mod_delete" });
            },
            install: function () {
              this.$store.dispatch("install_mod", {
                mod: this.mod_path,
                custom: !1,
              }),
                this.close();
            },
          },
        };
        exports.default = e;
        (function () {
          var s = exports.default || module.exports;
          "function" == typeof s && (s = s.options),
            Object.assign(s, {
              render: function () {
                var s = this,
                  e = s.$createElement,
                  a = s._self._c || e;
                return a("MenuDialog", [
                  a("div", { staticClass: "dialog-menu-description" }, [
                    a("h3", [s._v(s._s(s.mod))]),
                  ]),
                  s._v(" "),
                  a("div", { staticClass: "dialog-menu-separator" }),
                  s._v(" "),
                  a(
                    "div",
                    {
                      staticClass: "dialog-menu-item",
                      on: { click: s.install },
                    },
                    [
                      a("i", { staticClass: "fas fa-bolt fa-fw" }),
                      s._v(
                        " " +
                          s._s(s._("renderer.menu_mod_options.install")) +
                          " "
                      ),
                    ]
                  ),
                  s._v(" "),
                  a(
                    "div",
                    {
                      staticClass: "dialog-menu-item",
                      on: { click: s.deleteMod },
                    },
                    [
                      a("i", { staticClass: "fas fa-trash fa-fw" }),
                      s._v(
                        " " +
                          s._s(s._("renderer.menu_mod_options.delete")) +
                          " "
                      ),
                    ]
                  ),
                  s._v(" "),
                  a("div", { staticClass: "dialog-menu-separator" }),
                  s._v(" "),
                  a(
                    "div",
                    { staticClass: "dialog-menu-item", on: { click: s.close } },
                    [
                      a("i", { staticClass: "fas fa-times fa-fw" }),
                      s._v(
                        " " +
                          s._s(s._("renderer.menu_mod_options.cancel")) +
                          " "
                      ),
                    ]
                  ),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-cebf61",
              functional: void 0,
            });
        })();
      },
      { "../base/MenuDialog.vue": "LAc4" },
    ],
    KjBi: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = { name: "Dialog" };
        exports.default = e;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this.$createElement,
                  e = this._self._c || t;
                return e("div", { staticClass: "dialog" }, [
                  e(
                    "div",
                    { staticClass: "dialog-body" },
                    [this._t("default")],
                    2
                  ),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-4c9591",
              functional: void 0,
            });
        })();
      },
      {},
    ],
    KVSb: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = t(require("./Dialog.vue"));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var u = {
          name: "PromptDialog",
          components: { Dialog: e.default },
          props: [
            "title",
            "placeholder",
            "value",
            "submit_text",
            "cancel_text",
          ],
          methods: {
            submit: function (e) {
              this.$emit("input", e);
            },
          },
          data: function () {
            return { input: this.value };
          },
        };
        exports.default = u;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this,
                  e = t.$createElement,
                  a = t._self._c || e;
                return a("Dialog", [
                  a("h2", [t._v(t._s(t.title))]),
                  t._v(" "),
                  a("br"),
                  t._v(" "),
                  a("p", [t._t("default")], 2),
                  t._v(" "),
                  a("br"),
                  t._v(" "),
                  a("p", [
                    a("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: t.input,
                          expression: "input",
                        },
                      ],
                      attrs: { type: "text", placeholder: t.placeholder },
                      domProps: { value: t.input },
                      on: {
                        input: function (e) {
                          e.target.composing || (t.input = e.target.value);
                        },
                      },
                    }),
                  ]),
                  t._v(" "),
                  a("br"),
                  t._v(" "),
                  a("p", [
                    a(
                      "button",
                      {
                        staticClass: "primary",
                        on: {
                          click: function (e) {
                            return t.submit(t.input);
                          },
                        },
                      },
                      [
                        a("i", { staticClass: "fas fa-check fa-fw" }),
                        t._v(" " + t._s(t.submit_text)),
                      ]
                    ),
                    t._v(" "),
                    a(
                      "button",
                      {
                        staticClass: "secondary",
                        on: {
                          click: function (e) {
                            return t.submit(null);
                          },
                        },
                      },
                      [
                        a("i", { staticClass: "fas fa-times fa-fw" }),
                        t._v(" " + t._s(t.cancel_text)),
                      ]
                    ),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-0467bf",
              functional: void 0,
            });
        })();
      },
      { "./Dialog.vue": "KjBi" },
    ],
    GReG: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = t(require("../base/PromptDialog.vue"));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var a = {
          name: "InstallRenameDialog",
          components: { PromptDialog: e.default },
          methods: {
            _: ddmm.translate,
            rename: function (e) {
              e && ddmm.mods.renameInstall(this.install.folderName, e),
                this.$store.commit("hide_modal", { modal: "install_rename" });
            },
          },
          computed: {
            install: function () {
              return this.$store.state.selected_install;
            },
          },
        };
        exports.default = a;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement;
                return (e._self._c || t)(
                  "PromptDialog",
                  {
                    attrs: {
                      title: e._("renderer.modal_rename.title"),
                      placeholder: e.install.name,
                      submit_text: e._(
                        "renderer.modal_rename.button_affirmative"
                      ),
                      cancel_text: e._("renderer.modal_rename.button_negative"),
                    },
                    on: { input: e.rename },
                  },
                  [
                    e._v(
                      " " +
                        e._s(
                          e._("renderer.modal_rename.body", e.install.name)
                        ) +
                        "\n"
                    ),
                  ]
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-5ca342",
              functional: void 0,
            });
        })();
      },
      { "../base/PromptDialog.vue": "KVSb" },
    ],
    I6e6: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = t(require("./Dialog.vue"));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var o = {
          name: "ConfirmDialog",
          components: { Dialog: e.default },
          props: ["title", "yes_text", "no_text", "checkbox"],
          data: function () {
            return { checkbox_state: !this.checkbox };
          },
          methods: {
            submit: function (e) {
              this.$emit("input", e);
            },
          },
        };
        exports.default = o;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement,
                  c = e._self._c || t;
                return c("Dialog", [
                  c("h2", [e._v(e._s(e.title))]),
                  e._v(" "),
                  c("br"),
                  e._v(" "),
                  c("p", [e._t("default")], 2),
                  e._v(" "),
                  c("br"),
                  e._v(" "),
                  e.checkbox
                    ? c("p", [
                        c("label", [
                          c("input", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: e.checkbox_state,
                                expression: "checkbox_state",
                              },
                            ],
                            attrs: { type: "checkbox" },
                            domProps: {
                              checked: Array.isArray(e.checkbox_state)
                                ? e._i(e.checkbox_state, null) > -1
                                : e.checkbox_state,
                            },
                            on: {
                              change: function (t) {
                                var c = e.checkbox_state,
                                  a = t.target,
                                  s = !!a.checked;
                                if (Array.isArray(c)) {
                                  var o = e._i(c, null);
                                  a.checked
                                    ? o < 0 &&
                                      (e.checkbox_state = c.concat([null]))
                                    : o > -1 &&
                                      (e.checkbox_state = c
                                        .slice(0, o)
                                        .concat(c.slice(o + 1)));
                                } else e.checkbox_state = s;
                              },
                            },
                          }),
                          e._v(" " + e._s(e.checkbox) + " "),
                        ]),
                        e._v(" "),
                        c("br"),
                        c("br"),
                      ])
                    : e._e(),
                  e._v(" "),
                  c("p", [
                    c(
                      "button",
                      {
                        staticClass: "primary",
                        attrs: { disabled: !e.checkbox_state },
                        on: {
                          click: function (t) {
                            return e.submit(!0);
                          },
                        },
                      },
                      [
                        c("i", { staticClass: "fas fa-check fa-fw" }),
                        e._v(" " + e._s(e.yes_text) + " "),
                      ]
                    ),
                    e._v(" "),
                    c(
                      "button",
                      {
                        staticClass: "secondary",
                        on: {
                          click: function (t) {
                            return e.submit(!1);
                          },
                        },
                      },
                      [
                        c("i", { staticClass: "fas fa-times fa-fw" }),
                        e._v(" " + e._s(e.no_text)),
                      ]
                    ),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-f81129",
              functional: void 0,
            });
        })();
      },
      { "./Dialog.vue": "KjBi" },
    ],
    XsZd: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = t(require("../base/ConfirmDialog.vue"));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var l = {
          name: "UninstallDialog",
          components: { ConfirmDialog: e.default },
          methods: {
            _: ddmm.translate,
            uninstall: function (e) {
              e && ddmm.mods.deleteInstall(this.install.folderName),
                this.$store.commit("hide_modal", { modal: "uninstall" });
            },
          },
          computed: {
            install: function () {
              return this.$store.state.selected_install;
            },
          },
        };
        exports.default = l;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  n = e.$createElement;
                return (e._self._c || n)(
                  "ConfirmDialog",
                  {
                    attrs: {
                      title: e._("renderer.modal_uninstall.title"),
                      yes_text: e._(
                        "renderer.modal_uninstall.button_affirmative"
                      ),
                      no_text: e._("renderer.modal_uninstall.button_negative"),
                      checkbox: e._("renderer.modal_uninstall.confirmation"),
                    },
                    on: { input: e.uninstall },
                  },
                  [
                    e._v(
                      " " +
                        e._s(
                          e._(
                            e.install.globalSave
                              ? "renderer.modal_uninstall.body_globalsave"
                              : "renderer.modal_uninstall.body",
                            e.install.name
                          )
                        ) +
                        "\n"
                    ),
                  ]
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-76d9d0",
              functional: void 0,
            });
        })();
      },
      { "../base/ConfirmDialog.vue": "I6e6" },
    ],
    ThbP: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = t(require("../base/ConfirmDialog.vue"));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var a = {
          name: "SaveDeleteDialog",
          components: { ConfirmDialog: e.default },
          methods: {
            _: ddmm.translate,
            uninstall: function (e) {
              e && ddmm.mods.deleteSaveData(this.install.folderName),
                this.$store.commit("hide_modal", { modal: "save_delete" });
            },
          },
          computed: {
            install: function () {
              return this.$store.state.selected_install;
            },
          },
        };
        exports.default = a;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement;
                return (e._self._c || t)(
                  "ConfirmDialog",
                  {
                    attrs: {
                      title: e._("renderer.modal_save_delete.title"),
                      yes_text: e._(
                        "renderer.modal_save_delete.button_affirmative"
                      ),
                      no_text: e._(
                        "renderer.modal_save_delete.button_negative"
                      ),
                      checkbox: e._("renderer.modal_save_delete.confirmation"),
                    },
                    on: { input: e.uninstall },
                  },
                  [
                    e._v(
                      " " +
                        e._s(
                          e._("renderer.modal_save_delete.body", e.install.name)
                        ) +
                        "\n"
                    ),
                  ]
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-ab1e93",
              functional: void 0,
            });
        })();
      },
      { "../base/ConfirmDialog.vue": "I6e6" },
    ],
    r3Ro: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = t(require("./Dialog.vue"));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var o = {
          name: "AlertDialog",
          props: ["button_text", "title", "modal_id"],
          components: { Dialog: e.default },
          methods: {
            submit: function () {
              this.$store.commit("hide_modal", { modal: this.modal_id });
            },
          },
        };
        exports.default = o;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this,
                  e = t.$createElement,
                  s = t._self._c || e;
                return s("Dialog", [
                  s("h2", [t._v(t._s(t.title))]),
                  t._v(" "),
                  s("br"),
                  t._v(" "),
                  s("p", [t._t("default")], 2),
                  t._v(" "),
                  s("br"),
                  t._v(" "),
                  s("p", [
                    s(
                      "button",
                      {
                        staticClass: "primary",
                        on: {
                          click: function (e) {
                            return t.submit();
                          },
                        },
                      },
                      [
                        s("i", { staticClass: "fas fa-check fa-fw" }),
                        t._v(" " + t._s(t.button_text)),
                      ]
                    ),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-8c1585",
              functional: void 0,
            });
        })();
      },
      { "./Dialog.vue": "KjBi" },
    ],
    kOQa: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = t(require("../base/Dialog"));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var a = {
          name: "InstallDialog",
          components: { Dialog: e.default },
          methods: { _: ddmm.translate },
        };
        exports.default = a;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement,
                  n = e._self._c || t;
                return n("Dialog", [
                  n("div", { staticStyle: { "text-align": "center" } }, [
                    n("br"),
                    e._v(" "),
                    n("p", [
                      n("i", { staticClass: "fas fa-spinner fa-spin fa-2x" }),
                    ]),
                    e._v(" "),
                    n("br"),
                    e._v(" "),
                    n("h2", [
                      e._v(e._s(e._("renderer.modal_installing.title"))),
                    ]),
                    e._v(" "),
                    n("br"),
                    e._v(" "),
                    n("p", [
                      e._v(e._s(e._("renderer.modal_installing.description"))),
                    ]),
                    e._v(" "),
                    n("br"),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-25806e",
              functional: void 0,
            });
        })();
      },
      { "../base/Dialog": "KjBi" },
    ],
    moB9: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = t(require("../base/Dialog"));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var a = {
          components: { Dialog: e.default },
          name: "GameRunningDialog",
          methods: {
            _: ddmm.translate,
            openFolder: function () {
              ddmm.app.showFile(this.$store.state.running_install_path);
            },
            killGame: function () {
              ddmm.mods.killGame();
            },
          },
          data: function () {
            return { canKill: "win32" !== ddmm.platform, more: !1 };
          },
        };
        exports.default = a;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  n = e.$createElement,
                  r = e._self._c || n;
                return r("Dialog", [
                  r("div", { staticStyle: { "text-align": "center" } }, [
                    r("br"),
                    e._v(" "),
                    r("p", [r("i", { staticClass: "fas fa-gamepad fa-2x" })]),
                    e._v(" "),
                    r("br"),
                    e._v(" "),
                    r("h2", [e._v(e._s(e._("renderer.modal_running.title")))]),
                    e._v(" "),
                    r("br"),
                    e._v(" "),
                    r("p", [
                      e._v(e._s(e._("renderer.modal_running.description"))),
                    ]),
                    e._v(" "),
                    r("br"),
                    e._v(" "),
                    r("p", [
                      r(
                        "button",
                        { staticClass: "primary", on: { click: e.openFolder } },
                        [
                          r("i", { staticClass: "fas fa-folder-open" }),
                          e._v(
                            " " +
                              e._s(
                                e._("renderer.modal_running.button_browse")
                              ) +
                              " "
                          ),
                        ]
                      ),
                    ]),
                    e._v(" "),
                    e.canKill ? r("br") : e._e(),
                    e._v(" "),
                    !e.more && e.canKill
                      ? r(
                          "p",
                          {
                            on: {
                              click: function (n) {
                                e.more = !0;
                              },
                            },
                          },
                          [
                            r("a", { attrs: { href: "javascript:;" } }, [
                              e._v(
                                e._s(e._("renderer.modal_running.link_more"))
                              ),
                            ]),
                          ]
                        )
                      : e._e(),
                    e._v(" "),
                    e.more
                      ? r("p", [
                          r(
                            "button",
                            {
                              staticClass: "danger",
                              on: { click: e.killGame },
                            },
                            [
                              r("i", { staticClass: "fas fa-power-off fa-fw" }),
                              e._v(
                                " " +
                                  e._s(
                                    e._("renderer.modal_running.button_kill")
                                  ) +
                                  " "
                              ),
                            ]
                          ),
                        ])
                      : e._e(),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-9f72bb",
              functional: void 0,
            });
        })();
      },
      { "../base/Dialog": "KjBi" },
    ],
    FMpE: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = t(require("./base/Dialog"));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var o = {
          components: { Dialog: e.default },
          name: "GameRunningDialog",
          methods: {
            _: ddmm.translate,
            openFolder: function () {
              ddmm.app.showFile(
                joinPath(
                  this.$store.state.running_install_path,
                  "install",
                  "game"
                )
              );
            },
            restart: function () {
              ddmm.app.restart();
            },
            close: function () {
              this.$store.commit("hide_modal", { modal: "error" });
            },
            copy: function () {
              ddmm.app.copyToClipboard(this.error.stacktrace);
            },
          },
          computed: {
            error: function () {
              return this.$store.state.error;
            },
          },
        };
        exports.default = o;
        (function () {
          var r = exports.default || module.exports;
          "function" == typeof r && (r = r.options),
            Object.assign(r, {
              render: function () {
                var r = this,
                  e = r.$createElement,
                  t = r._self._c || e;
                return t("Dialog", { staticStyle: { "z-index": "100" } }, [
                  r.error.fatal
                    ? t("h2", [
                        r._v(r._s(r._("renderer.modal_error.title_fatal"))),
                      ])
                    : t("h2", [
                        r._v(r._s(r._("renderer.modal_error.title_non_fatal"))),
                      ]),
                  r._v(" "),
                  t("br"),
                  r._v(" "),
                  t("p", [
                    r._v(r._s(r._("renderer.modal_error.description_general"))),
                  ]),
                  r._v(" "),
                  t("br"),
                  r._v(" "),
                  t("p", [
                    r._v(
                      r._s(r._("renderer.modal_error.description_stacktrace"))
                    ),
                  ]),
                  r._v(" "),
                  t("br"),
                  r._v(" "),
                  t(
                    "pre",
                    {
                      staticStyle: {
                        overflow: "scroll",
                        "font-size": "12px",
                        "max-height": "150px",
                      },
                    },
                    [r._v(r._s(r.error.stacktrace))]
                  ),
                  r._v(" "),
                  t("br"),
                  t("br"),
                  r._v(" "),
                  r.error.fatal
                    ? t(
                        "button",
                        { staticClass: "primary", on: { click: r.restart } },
                        [
                          t("i", { staticClass: "fas fa-redo" }),
                          r._v(
                            " " +
                              r._s(r._("renderer.modal_error.button_restart"))
                          ),
                        ]
                      )
                    : t(
                        "button",
                        { staticClass: "primary", on: { click: r.close } },
                        [
                          t("i", { staticClass: "fas fa-check" }),
                          r._v(
                            " " +
                              r._s(r._("renderer.modal_error.button_continue"))
                          ),
                        ]
                      ),
                  r._v(" "),
                  t(
                    "button",
                    { staticClass: "secondary", on: { click: r.copy } },
                    [
                      t("i", { staticClass: "fas fa-copy" }),
                      r._v(" " + r._s(r._("renderer.modal_error.button_copy"))),
                    ]
                  ),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-9a82ec",
              functional: void 0,
            });
        })();
      },
      { "./base/Dialog": "KjBi" },
    ],
    LoBp: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var t = e(require("../base/Dialog"));
        function e(t) {
          return t && t.__esModule ? t : { default: t };
        }
        var a = {
          name: "InstallCategoryDialog",
          components: { Dialog: t.default },
          data: function () {
            return { category: this.$store.state.selected_install.category };
          },
          computed: {
            install: function () {
              return this.$store.state.selected_install;
            },
            categories: function () {
              return Array.from(
                new Set(
                  this.$store.state.game_data.installs.map(function (t) {
                    return t.category;
                  })
                )
              ).sort();
            },
          },
          methods: {
            _: ddmm.translate,
            save: function () {
              ddmm.mods.setCategory(this.install.folderName, this.category),
                this.close();
            },
            close: function () {
              this.$store.commit("hide_modal", { modal: "install_category" });
            },
          },
        };
        exports.default = a;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement,
                  a = e._self._c || t;
                return a("Dialog", [
                  a("h2", [e._v(e._s(e._("renderer.modal_category.title")))]),
                  e._v(" "),
                  a("br"),
                  e._v(" "),
                  a(
                    "div",
                    [
                      e._l(e.categories, function (t) {
                        return t
                          ? a("p", [
                              a("label", [
                                a("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: e.category,
                                      expression: "category",
                                    },
                                  ],
                                  attrs: { type: "radio" },
                                  domProps: {
                                    value: t,
                                    checked: e._q(e.category, t),
                                  },
                                  on: {
                                    change: function (a) {
                                      e.category = t;
                                    },
                                  },
                                }),
                                e._v(" " + e._s(t)),
                              ]),
                            ])
                          : e._e();
                      }),
                      e._v(" "),
                      a("p", [
                        a("label", [
                          a("input", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: e.category,
                                expression: "category",
                              },
                            ],
                            attrs: { type: "radio" },
                            domProps: {
                              value: "",
                              checked: e._q(e.category, ""),
                            },
                            on: {
                              change: function (t) {
                                e.category = "";
                              },
                            },
                          }),
                          e._v(
                            " (" +
                              e._s(e._("renderer.modal_category.label_none")) +
                              ")"
                          ),
                        ]),
                      ]),
                    ],
                    2
                  ),
                  e._v(" "),
                  a("div", { staticClass: "form-group" }, [
                    a("p", [
                      a("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model.trim",
                            value: e.category,
                            expression: "category",
                            modifiers: { trim: !0 },
                          },
                        ],
                        attrs: {
                          type: "text",
                          placeholder: e._(
                            "renderer.modal_category.placeholder_category"
                          ),
                          maxlength: "25",
                        },
                        domProps: { value: e.category },
                        on: {
                          input: function (t) {
                            t.target.composing ||
                              (e.category = t.target.value.trim());
                          },
                          blur: function (t) {
                            return e.$forceUpdate();
                          },
                        },
                      }),
                    ]),
                  ]),
                  e._v(" "),
                  a("p", [
                    a(
                      "button",
                      { staticClass: "primary", on: { click: e.save } },
                      [
                        a("i", { staticClass: "fas fa-check fa-fw" }),
                        e._v(
                          " " + e._s(e._("renderer.modal_category.button_save"))
                        ),
                      ]
                    ),
                    e._v(" "),
                    a(
                      "button",
                      { staticClass: "secondary", on: { click: e.close } },
                      [
                        a("i", { staticClass: "fas fa-times fa-fw" }),
                        e._v(
                          " " +
                            e._s(e._("renderer.modal_category.button_cancel"))
                        ),
                      ]
                    ),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-9636c6",
              functional: void 0,
            });
        })();
      },
      { "../base/Dialog": "KjBi" },
    ],
    nYTs: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = t(require("./base/AlertDialog"));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var a = {
          name: "NewsDialog",
          components: { AlertDialog: e.default },
          methods: { _: ddmm.translate },
          data: function () {
            return { news: this.$store.state.news_modal };
          },
        };
        exports.default = a;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this.$createElement;
                return (this._self._c || t)(
                  "AlertDialog",
                  {
                    attrs: {
                      title: this.news.title,
                      modal_id: "news",
                      button_text: this._("renderer.modal_news.button"),
                    },
                  },
                  [this._v(" " + this._s(this.news.body) + "\n")]
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-65c5e6",
              functional: void 0,
            });
        })();
      },
      { "./base/AlertDialog": "r3Ro" },
    ],
    ZsxS: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var t = {
          name: "StarRating",
          props: ["rating"],
          methods: {
            roundDown: function (t) {
              return Math.floor(t);
            },
          },
          data: function () {
            return { showHalf: this.roundDown(this.rating) < this.rating };
          },
        };
        exports.default = t;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this,
                  a = t.$createElement,
                  s = t._self._c || a;
                return s(
                  "div",
                  {
                    staticClass: "rating",
                    attrs: { title: t.rating + " / 5" },
                  },
                  [
                    t._l(t.roundDown(t.rating), function (t) {
                      return s("div", [
                        s("i", { staticClass: "fas fa-star fa-fw" }),
                      ]);
                    }),
                    t._v(" "),
                    t.showHalf
                      ? s("div", [
                          s("i", { staticClass: "fas fa-star-half-alt fa-fw" }),
                        ])
                      : t._e(),
                    t._v(" "),
                    t._l(
                      (t.showHalf ? 4 : 5) - t.roundDown(t.rating),
                      function (t) {
                        return s("div", [
                          s("i", { staticClass: "far fa-star fa-fw" }),
                        ]);
                      }
                    ),
                  ],
                  2
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-df80e8",
              functional: void 0,
            });
        })();
      },
      {},
    ],
    zUTX: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = t(require("./base/AlertDialog")),
          d = t(require("../../js/utils/Logger")),
          o = t(require("../elements/StarRating"));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var n = {
          name: "ModPreviewDialog",
          components: { StarRating: o.default, AlertDialog: e.default },
          data: function () {
            return {
              ddlChecked: !1,
              ddl: null,
              debug: !!ddmm.env.DDMM_DEVELOPER,
            };
          },
          methods: {
            _: ddmm.translate,
            downloadExternal: function () {
              ddmm.app.openURL(this.mod.downloadURL);
            },
            download: function (e) {
              this.$store.commit("hide_modal", { modal: "mod_preview" }),
                this.$store.commit("show_modal", {
                  modal: "download_starting",
                }),
                ddmm.downloads.downloadWithInteraction(e);
            },
          },
          computed: {
            mod: function () {
              return this.$store.state.mod_preview;
            },
          },
          mounted: function () {
            var e = this;
            d.default.info(
              "Download Filename",
              "Preloading filename: " + this.mod.name
            ),
              ddmm.downloads.preloadFilename(this.mod.name),
              this.mod.store.testDDL(this.mod.id).then(function (d) {
                (e.ddlChecked = !0), (e.ddl = d.directDownload);
              });
          },
        };
        exports.default = n;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this,
                  a = t.$createElement,
                  s = t._self._c || a;
                return s(
                  "AlertDialog",
                  {
                    attrs: {
                      modal_id: "mod_preview",
                      title: t.mod.name,
                      button_text: t._(
                        "renderer.modal_mod_preview.button_close"
                      ),
                    },
                  },
                  [
                    s("p", [s("strong", [t._v(t._s(t.mod.shortDescription))])]),
                    t._v(" "),
                    s("br"),
                    t._v(" "),
                    s("div", [
                      s("i", { staticClass: "fas fa-star" }),
                      t._v(" "),
                      s("strong", [t._v(t._s(t.mod.rating))]),
                      t._v("   "),
                      s("i", { staticClass: "fas fa-clock" }),
                      t._v(" "),
                      s("strong", [t._v(t._s(t.mod.lengthString))]),
                      t._v("   "),
                      s("i", { staticClass: "fas fa-clock" }),
                      t._v(" "),
                      s("strong", [t._v(t._s(t.mod.status))]),
                      t._v("   "),
                    ]),
                    t._v(" "),
                    s("br"),
                    t._v(" "),
                    t.ddlChecked
                      ? [
                          t.ddl
                            ? s("p", [
                                s(
                                  "button",
                                  {
                                    staticClass: "success",
                                    on: {
                                      click: function (a) {
                                        return t.download(t.ddl);
                                      },
                                    },
                                  },
                                  [
                                    s("i", {
                                      staticClass: "fas fa-download fa-fw",
                                    }),
                                    t._v(
                                      " " +
                                        t._s(
                                          t._(
                                            "renderer.modal_mod_preview.button_download_direct"
                                          )
                                        ) +
                                        " "
                                    ),
                                  ]
                                ),
                                t._v(" "),
                                s(
                                  "button",
                                  {
                                    staticClass: "secondary",
                                    on: { click: t.downloadExternal },
                                  },
                                  [
                                    s("i", {
                                      staticClass:
                                        "fas fa-external-link-alt fa-fw",
                                    }),
                                    t._v(
                                      " " +
                                        t._s(
                                          t._(
                                            "renderer.modal_mod_preview.button_download_external"
                                          )
                                        ) +
                                        " "
                                    ),
                                  ]
                                ),
                              ])
                            : s("p", [
                                s(
                                  "button",
                                  {
                                    staticClass: "success",
                                    on: { click: t.downloadExternal },
                                  },
                                  [
                                    s("i", {
                                      staticClass:
                                        "fas fa-external-link-alt fa-fw",
                                    }),
                                    t._v(
                                      " " +
                                        t._s(
                                          t._(
                                            "renderer.modal_mod_preview.button_download_external"
                                          )
                                        ) +
                                        " "
                                    ),
                                  ]
                                ),
                              ]),
                        ]
                      : [
                          s("p", [
                            s("i", { staticClass: "fas fa-spinner fa-spin" }),
                            t._v(
                              " " +
                                t._s(
                                  t._("renderer.modal_mod_preview.text_loading")
                                )
                            ),
                          ]),
                        ],
                    t._v(" "),
                    t.debug
                      ? [
                          s("br"),
                          t._v(" "),
                          s("p", [
                            s(
                              "button",
                              {
                                staticClass: "danger",
                                on: {
                                  click: function (a) {
                                    return t.download(t.mod.downloadURL);
                                  },
                                },
                              },
                              [
                                s("i", {
                                  staticClass: "fas fa-download fa-fw",
                                }),
                                t._v(" Download (URL provided)"),
                              ]
                            ),
                          ]),
                        ]
                      : t._e(),
                    t._v(" "),
                    s("br"),
                    t._v(" "),
                    s(
                      "div",
                      {
                        staticStyle: {
                          "white-space": "pre-line",
                          overflow: "auto",
                          "max-height": "200px",
                        },
                      },
                      [t._v(t._s(t.mod.description))]
                    ),
                  ],
                  2
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-053e6d",
              functional: void 0,
            });
        })();
      },
      {
        "./base/AlertDialog": "r3Ro",
        "../../js/utils/Logger": "vKp2",
        "../elements/StarRating": "ZsxS",
      },
    ],
    EOJK: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = o(require("./base/Dialog")),
          t = o(require("../elements/Link"));
        function o(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var s = {
          name: "IssueReportDialog",
          components: { Link: t.default, Dialog: e.default },
          data: function () {
            return { type: "bug", body: "", mod: "", sending: !1 };
          },
          methods: {
            _: ddmm.translate,
            close: function () {
              this.$store.commit("hide_modal", { modal: "issue_report" });
            },
            sendAndClose: function () {
              var e = this;
              (this.sending = !0),
                fetch("https://ddmm-issues.shinomiya.group/", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    type: this.type,
                    body: this.body,
                    mod: "broken mod" === this.type ? this.mod : null,
                  }),
                }).then(function () {
                  (e.sending = !1), e.close();
                });
            },
          },
        };
        exports.default = s;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  r = e.$createElement,
                  t = e._self._c || r;
                return t(
                  "Dialog",
                  [
                    t("h2", [
                      e._v(e._s(e._("renderer.modal_issue_report.title"))),
                    ]),
                    e._v(" "),
                    t("br"),
                    e._v(" "),
                    t("p", [
                      e._v(
                        e._s(e._("renderer.modal_issue_report.description"))
                      ),
                    ]),
                    e._v(" "),
                    t("br"),
                    e._v(" "),
                    t("label", { attrs: { for: "issue_report_type" } }, [
                      e._v(e._s(e._("renderer.modal_issue_report.label_type"))),
                    ]),
                    e._v(" "),
                    t("p", [
                      t(
                        "select",
                        {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: e.type,
                              expression: "type",
                            },
                          ],
                          attrs: { id: "issue_report_type" },
                          on: {
                            change: function (r) {
                              var t = Array.prototype.filter
                                .call(r.target.options, function (e) {
                                  return e.selected;
                                })
                                .map(function (e) {
                                  return "_value" in e ? e._value : e.value;
                                });
                              e.type = r.target.multiple ? t : t[0];
                            },
                          },
                        },
                        [
                          t("option", { attrs: { value: "bug" } }, [
                            e._v(
                              e._s(
                                e._("renderer.modal_issue_report.option_bug")
                              )
                            ),
                          ]),
                          e._v(" "),
                          t("option", { attrs: { value: "broken mod" } }, [
                            e._v(
                              e._s(
                                e._(
                                  "renderer.modal_issue_report.option_broken_mod"
                                )
                              )
                            ),
                          ]),
                        ]
                      ),
                    ]),
                    e._v(" "),
                    "broken mod" === e.type
                      ? [
                          t("br"),
                          e._v(" "),
                          t("label", { attrs: { for: "issue_report_mod" } }, [
                            e._v(
                              e._s(e._("renderer.modal_issue_report.label_mod"))
                            ),
                          ]),
                          e._v(" "),
                          t("p", [
                            t("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: e.mod,
                                  expression: "mod",
                                },
                              ],
                              attrs: {
                                type: "text",
                                id: "issue_report_mod",
                                placeholder: e._(
                                  "renderer.modal_issue_report.placeholder_mod"
                                ),
                              },
                              domProps: { value: e.mod },
                              on: {
                                input: function (r) {
                                  r.target.composing ||
                                    (e.mod = r.target.value);
                                },
                              },
                            }),
                          ]),
                        ]
                      : e._e(),
                    e._v(" "),
                    t("br"),
                    e._v(" "),
                    t("label", { attrs: { for: "issue_report_body" } }, [
                      e._v(e._s(e._("renderer.modal_issue_report.label_body"))),
                    ]),
                    e._v(" "),
                    t("p", [
                      t("textarea", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: e.body,
                            expression: "body",
                          },
                        ],
                        staticStyle: { resize: "none" },
                        attrs: {
                          id: "issue_report_body",
                          rows: "5",
                          placeholder: e._(
                            "renderer.modal_issue_report.placeholder_body"
                          ),
                        },
                        domProps: { value: e.body },
                        on: {
                          input: function (r) {
                            r.target.composing || (e.body = r.target.value);
                          },
                        },
                      }),
                    ]),
                    e._v(" "),
                    t("br"),
                    e._v(" "),
                    t("p", [
                      t(
                        "button",
                        {
                          staticClass: "primary",
                          attrs: { disabled: e.sending },
                          on: { click: e.sendAndClose },
                        },
                        [
                          t("i", { staticClass: "fas fa-paper-plane fa-fw" }),
                          e._v(
                            " " +
                              e._s(
                                e._("renderer.modal_issue_report.button_submit")
                              ) +
                              " "
                          ),
                        ]
                      ),
                      e._v(" "),
                      t(
                        "button",
                        { staticClass: "secondary", on: { click: e.close } },
                        [
                          t("i", { staticClass: "fas fa-times fa-fw" }),
                          e._v(
                            " " +
                              e._s(
                                e._("renderer.modal_issue_report.button_cancel")
                              )
                          ),
                        ]
                      ),
                    ]),
                  ],
                  2
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-8334be",
              functional: void 0,
            });
        })();
      },
      { "./base/Dialog": "KjBi", "../elements/Link": "TptL" },
    ],
    Hmvu: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = t(require("./base/Dialog"));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var a = {
          name: "LanguageSwitchDialog",
          components: { Dialog: e.default },
          methods: { _: ddmm.translate },
        };
        exports.default = a;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement,
                  a = e._self._c || t;
                return a("Dialog", [
                  a("div", { staticStyle: { "text-align": "center" } }, [
                    a("br"),
                    e._v(" "),
                    a("p", [
                      a("i", { staticClass: "fas fa-spinner fa-spin fa-2x" }),
                    ]),
                    e._v(" "),
                    a("br"),
                    e._v(" "),
                    a("h2", [
                      e._v(e._s(e._("renderer.modal_language_switch.title"))),
                    ]),
                    e._v(" "),
                    a("br"),
                    e._v(" "),
                    a("p", [
                      e._v(
                        e._s(e._("renderer.modal_language_switch.description"))
                      ),
                    ]),
                    e._v(" "),
                    a("br"),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-19972f",
              functional: void 0,
            });
        })();
      },
      { "./base/Dialog": "KjBi" },
    ],
    avxM: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = t(require("../base/ConfirmDialog"));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var a = {
          name: "InstallArchiveDialog",
          components: { ConfirmDialog: e.default },
          methods: {
            _: ddmm.translate,
            archive: function (e) {
              e && ddmm.mods.archiveInstall(this.install.folderName),
                this.$store.commit("hide_modal", { modal: "install_archive" });
            },
          },
          computed: {
            install: function () {
              return this.$store.state.selected_install;
            },
          },
        };
        exports.default = a;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  r = e.$createElement,
                  t = e._self._c || r;
                return t(
                  "ConfirmDialog",
                  {
                    attrs: {
                      title: e._("renderer.modal_archive.title"),
                      yes_text: e._(
                        "renderer.modal_archive.button_affirmative"
                      ),
                      no_text: e._("renderer.modal_archive.button_negative"),
                      checkbox: e._("renderer.modal_archive.confirmation"),
                    },
                    on: { input: e.archive },
                  },
                  [
                    t("p", [
                      e._v(
                        e._s(e._("renderer.modal_archive.body", e.install.name))
                      ),
                    ]),
                    e._v(" "),
                    t("br"),
                    e._v(" "),
                    t("p", [
                      t("strong", [
                        e._v(e._s(e._("renderer.modal_archive.body_warning"))),
                      ]),
                    ]),
                  ]
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-11bf12",
              functional: void 0,
            });
        })();
      },
      { "../base/ConfirmDialog": "I6e6" },
    ],
    w0BX: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = o(require("../base/Dialog")),
          t = o(require("../../elements/ModSelector"));
        function o(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var l = {
          name: "InstallUnarchiveDialog",
          components: { ModSelector: t.default, Dialog: e.default },
          data: function () {
            return { mod: "" };
          },
          methods: {
            _: ddmm.translate,
            close: function () {
              this.$store.commit("hide_modal", { modal: "install_unarchive" });
            },
            unarchive: function () {
              this.close(),
                this.$store.commit("show_modal", { modal: "unarchiving" }),
                ddmm.mods.unarchiveInstall({
                  folderName: this.install.folderName,
                  mod: this.mod,
                });
            },
          },
          computed: {
            install: function () {
              return this.$store.state.selected_install;
            },
          },
        };
        exports.default = l;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  a = e.$createElement,
                  t = e._self._c || a;
                return t(
                  "Dialog",
                  [
                    t("h2", [
                      e._v(e._s(e._("renderer.modal_unarchive.title"))),
                    ]),
                    e._v(" "),
                    t("br"),
                    e._v(" "),
                    t("p", [
                      e._v(
                        e._s(
                          e._(
                            "renderer.modal_unarchive.description",
                            e.install.name
                          )
                        )
                      ),
                    ]),
                    e._v(" "),
                    t("br"),
                    e._v(" "),
                    t("ModSelector", {
                      model: {
                        value: e.mod,
                        callback: function (a) {
                          e.mod = a;
                        },
                        expression: "mod",
                      },
                    }),
                    e._v(" "),
                    t("br"),
                    e._v(" "),
                    t("p", [
                      t(
                        "button",
                        { staticClass: "success", on: { click: e.unarchive } },
                        [
                          t("i", { staticClass: "fas fa-play fa-fw" }),
                          e._v(
                            " " +
                              e._s(
                                e._("renderer.modal_unarchive.button_launch")
                              )
                          ),
                        ]
                      ),
                      e._v(" "),
                      t(
                        "button",
                        { staticClass: "secondary", on: { click: e.close } },
                        [
                          t("i", { staticClass: "fas fa-times fa-fw" }),
                          e._v(
                            " " +
                              e._s(
                                e._("renderer.modal_unarchive.button_cancel")
                              )
                          ),
                        ]
                      ),
                    ]),
                  ],
                  1
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-e0c916",
              functional: void 0,
            });
        })();
      },
      { "../base/Dialog": "KjBi", "../../elements/ModSelector": "taxC" },
    ],
    UkrX: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = t(require("../base/Dialog"));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var a = {
          name: "UnarchivingDialog",
          components: { Dialog: e.default },
          methods: { _: ddmm.translate },
        };
        exports.default = a;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement,
                  n = e._self._c || t;
                return n("Dialog", [
                  n("div", { staticStyle: { "text-align": "center" } }, [
                    n("br"),
                    e._v(" "),
                    n("p", [
                      n("i", { staticClass: "fas fa-spinner fa-spin fa-2x" }),
                    ]),
                    e._v(" "),
                    n("br"),
                    e._v(" "),
                    n("h2", [
                      e._v(e._s(e._("renderer.modal_unarchiving.title"))),
                    ]),
                    e._v(" "),
                    n("br"),
                    e._v(" "),
                    n("p", [
                      e._v(e._s(e._("renderer.modal_unarchiving.description"))),
                    ]),
                    e._v(" "),
                    n("br"),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-cead87",
              functional: void 0,
            });
        })();
      },
      { "../base/Dialog": "KjBi" },
    ],
    QJdo: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = t(require("../base/ConfirmDialog.vue"));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var o = {
          name: "ModDeleteDialog",
          components: { ConfirmDialog: e.default },
          methods: {
            _: ddmm.translate,
            deleteMod: function (e) {
              e && ddmm.mods.deleteMod(this.mod),
                this.$store.commit("hide_modal", { modal: "mod_delete" });
            },
          },
          computed: {
            mod: function () {
              return this.$store.state.selected_mod;
            },
          },
        };
        exports.default = o;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement;
                return (e._self._c || t)(
                  "ConfirmDialog",
                  {
                    attrs: {
                      title: e._("renderer.modal_mod_delete.title"),
                      yes_text: e._(
                        "renderer.modal_mod_delete.button_affirmative"
                      ),
                      no_text: e._("renderer.modal_mod_delete.button_negative"),
                    },
                    on: { input: e.deleteMod },
                  },
                  [
                    e._v(
                      " " +
                        e._s(e._("renderer.modal_mod_delete.body", e.mod)) +
                        "\n"
                    ),
                  ]
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-d2de42",
              functional: void 0,
            });
        })();
      },
      { "../base/ConfirmDialog.vue": "I6e6" },
    ],
    yX2V: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = a(require("./base/Dialog")),
          o = a(require("../../js/utils/Logger"));
        function a(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var l = {
          name: "DownloadStartingDialog",
          components: { Dialog: e.default },
          methods: { _: ddmm.translate },
          beforeDestroy: function () {
            o.default.info("Download Filename", "Removing filename preload"),
              ddmm.downloads.preloadFilename(null);
          },
        };
        exports.default = l;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement,
                  a = e._self._c || t;
                return a("Dialog", [
                  a("div", { staticStyle: { "text-align": "center" } }, [
                    a("br"),
                    e._v(" "),
                    a("p", [
                      a("i", { staticClass: "fas fa-spinner fa-spin fa-2x" }),
                    ]),
                    e._v(" "),
                    a("br"),
                    e._v(" "),
                    a("h2", [
                      e._v(e._s(e._("renderer.modal_download_starting.title"))),
                    ]),
                    e._v(" "),
                    a("br"),
                    e._v(" "),
                    a("p", [
                      e._v(
                        e._s(
                          e._("renderer.modal_download_starting.description")
                        )
                      ),
                    ]),
                    e._v(" "),
                    a("br"),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-8caa8f",
              functional: void 0,
            });
        })();
      },
      { "./base/Dialog": "KjBi", "../../js/utils/Logger": "vKp2" },
    ],
    GKZt: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var l = p(require("./dialogs/installs/InstallOptionsDialog.vue")),
          a = p(require("./dialogs/mods/ModOptionsDialog.vue")),
          e = p(require("./dialogs/installs/InstallRenameDialog.vue")),
          i = p(require("./dialogs/installs/UninstallDialog.vue")),
          o = p(require("./dialogs/installs/SaveDeleteDialog.vue")),
          t = p(require("./dialogs/base/AlertDialog.vue")),
          s = p(require("./dialogs/installs/InstallDialog")),
          r = p(require("./dialogs/installs/GameRunningDialog")),
          g = p(require("./dialogs/ErrorDialog")),
          n = p(require("./dialogs/installs/InstallCategoryDialog")),
          u = p(require("./dialogs/NewsDialog")),
          d = p(require("./dialogs/ModPreviewDialog")),
          D = p(require("./dialogs/IssueReportDialog")),
          f = p(require("./dialogs/LanguageSwitchDialog")),
          v = p(require("./dialogs/installs/InstallArchiveDialog")),
          q = p(require("./dialogs/installs/InstallUnarchiveDialog")),
          I = p(require("./dialogs/installs/UnarchivingDialog")),
          c = p(require("./dialogs/mods/ModDeleteDialog")),
          m = p(require("./dialogs/DownloadStartingDialog"));
        function p(l) {
          return l && l.__esModule ? l : { default: l };
        }
        var h = {
          name: "Dialogs",
          components: {
            DownloadStartingDialog: m.default,
            ModDeleteDialog: c.default,
            InstallUnarchiveDialog: q.default,
            InstallArchiveDialog: v.default,
            LanguageSwitchDialog: f.default,
            IssueReportDialog: D.default,
            NewsDialog: u.default,
            InstallCategoryDialog: n.default,
            GameRunningDialog: r.default,
            InstallDialog: s.default,
            SaveDeleteDialog: o.default,
            UninstallDialog: i.default,
            InstallRenameDialog: e.default,
            ModOptionsDialog: a.default,
            InstallOptionsDialog: l.default,
            AlertDialog: t.default,
            ErrorDialog: g.default,
            ModPreviewDialog: d.default,
            UnarchivingDialog: I.default,
          },
          methods: {
            _: ddmm.translate,
            modalVisible: function (l) {
              return this.$store.state.modals[l];
            },
          },
        };
        exports.default = h;
        (function () {
          var l = exports.default || module.exports;
          "function" == typeof l && (l = l.options),
            Object.assign(l, {
              render: function () {
                var l = this,
                  i = l.$createElement,
                  e = l._self._c || i;
                return e(
                  "div",
                  [
                    l.modalVisible("install_options")
                      ? e("InstallOptionsDialog")
                      : l._e(),
                    l._v(" "),
                    l.modalVisible("install_rename")
                      ? e("InstallRenameDialog")
                      : l._e(),
                    l._v(" "),
                    l.modalVisible("save_delete")
                      ? e("SaveDeleteDialog")
                      : l._e(),
                    l._v(" "),
                    l.modalVisible("uninstall") ? e("UninstallDialog") : l._e(),
                    l._v(" "),
                    l.modalVisible("install_archive")
                      ? e("InstallArchiveDialog")
                      : l._e(),
                    l._v(" "),
                    l.modalVisible("install_unarchive")
                      ? e("InstallUnarchiveDialog")
                      : l._e(),
                    l._v(" "),
                    l.modalVisible("unarchiving")
                      ? e("UnarchivingDialog")
                      : l._e(),
                    l._v(" "),
                    l.modalVisible("installing") ? e("InstallDialog") : l._e(),
                    l._v(" "),
                    l.modalVisible("error") ? e("ErrorDialog") : l._e(),
                    l._v(" "),
                    l.modalVisible("install_category")
                      ? e("InstallCategoryDialog")
                      : l._e(),
                    l._v(" "),
                    l.modalVisible("game_running")
                      ? e("GameRunningDialog")
                      : l._e(),
                    l._v(" "),
                    l.modalVisible("mod_options")
                      ? e("ModOptionsDialog")
                      : l._e(),
                    l._v(" "),
                    l.modalVisible("mod_delete")
                      ? e("ModDeleteDialog")
                      : l._e(),
                    l._v(" "),
                    l.modalVisible("news") ? e("NewsDialog") : l._e(),
                    l._v(" "),
                    l.modalVisible("mod_preview")
                      ? e("ModPreviewDialog")
                      : l._e(),
                    l._v(" "),
                    l.modalVisible("issue_report")
                      ? e("IssueReportDialog")
                      : l._e(),
                    l._v(" "),
                    l.modalVisible("language_switch")
                      ? e("LanguageSwitchDialog")
                      : l._e(),
                    l._v(" "),
                    l.modalVisible("download_starting")
                      ? e("DownloadStartingDialog")
                      : l._e(),
                  ],
                  1
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-bc032f",
              functional: void 0,
            });
        })();
      },
      {
        "./dialogs/installs/InstallOptionsDialog.vue": "G37S",
        "./dialogs/mods/ModOptionsDialog.vue": "kA0R",
        "./dialogs/installs/InstallRenameDialog.vue": "GReG",
        "./dialogs/installs/UninstallDialog.vue": "XsZd",
        "./dialogs/installs/SaveDeleteDialog.vue": "ThbP",
        "./dialogs/base/AlertDialog.vue": "r3Ro",
        "./dialogs/installs/InstallDialog": "kOQa",
        "./dialogs/installs/GameRunningDialog": "moB9",
        "./dialogs/ErrorDialog": "FMpE",
        "./dialogs/installs/InstallCategoryDialog": "LoBp",
        "./dialogs/NewsDialog": "nYTs",
        "./dialogs/ModPreviewDialog": "zUTX",
        "./dialogs/IssueReportDialog": "EOJK",
        "./dialogs/LanguageSwitchDialog": "Hmvu",
        "./dialogs/installs/InstallArchiveDialog": "avxM",
        "./dialogs/installs/InstallUnarchiveDialog": "w0BX",
        "./dialogs/installs/UnarchivingDialog": "UkrX",
        "./dialogs/mods/ModDeleteDialog": "QJdo",
        "./dialogs/DownloadStartingDialog": "yX2V",
      },
    ],
    SMwF: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = r(require("../../js/utils/Logger"));
        function r(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var t = {
          name: "DropZone",
          props: ["text"],
          mounted: function () {
            e.default.info("Drop Zone", "Drop zone activated!");
            var r = this.$refs.zone;
            r.addEventListener("drop", this._ondrop),
              r.addEventListener("dragover", this._ondragover);
          },
          beforeDestroy: function () {
            var e = this.$refs.zone;
            e.removeEventListener("drop", this._ondrop),
              e.removeEventListener("dragover", this._ondragover);
          },
          methods: {
            _ondrop: function (r) {
              r.preventDefault(), e.default.info("Drop Zone", "Item dropped!");
              for (var t = 0; t < r.dataTransfer.items.length; t++) {
                var o = r.dataTransfer.items[t];
                if ("file" === o.kind) {
                  var n = o.webkitGetAsEntry();
                  n.isDirectory
                    ? this.$emit("directory", n)
                    : n.isFile && this.$emit("file", o.getAsFile());
                }
              }
            },
            _ondragover: function (e) {
              e.preventDefault();
            },
          },
        };
        exports.default = t;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this.$createElement,
                  s = this._self._c || t;
                return s("div", { ref: "zone", staticClass: "drop-zone" }, [
                  this._m(0),
                  this._v(" "),
                  s("p", { staticClass: "text" }, [
                    this._v(this._s(this.text)),
                  ]),
                ]);
              },
              staticRenderFns: [
                function () {
                  var t = this.$createElement,
                    s = this._self._c || t;
                  return s("p", [
                    s("i", { staticClass: "fas fa-upload fa-2x" }),
                  ]);
                },
              ],
              _compiled: !0,
              _scopeId: "data-v-7a9cf9",
              functional: void 0,
            });
        })();
      },
      { "../../js/utils/Logger": "vKp2" },
    ],
    giWp: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = a(require("./elements/Link")),
          t = a(require("./elements/DropZone")),
          i = a(require("../js/utils/Logger")),
          s = a(require("./elements/InstallFolderSelector"));
        function a(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var n = {
          name: "OnboardingOverlay",
          components: {
            InstallFolderSelector: s.default,
            DropZone: t.default,
            Link: e.default,
          },
          data: function () {
            return {
              developer: !!ddmm.env.DDMM_DEVELOPER,
              developer_local_ui: ddmm.config.readConfigValue("localUI"),
              save_directory: ddmm.config.readConfigValue("installFolder"),
              step: 1,
              skipped_selection: !1,
              warnings: { mac_safari: !0 },
              correct_version:
                "darwin" === ddmm.platform ? "DDLC (Mac)" : "DDLC (Windows)",
              game_selection: {
                has_tried_once: !1,
                is_testing: !0,
                is_valid: !1,
                path: "",
                message: { title: "", text: "" },
              },
              background: "default.png",
            };
          },
          mounted: function () {
            var e = this;
            ddmm.on("onboarding validated", this._validateCallback),
              ddmm.onboarding.scan(),
              setTimeout(function () {
                e.game_selection.is_testing = !1;
              }, 1e4);
          },
          beforeDestroy: function () {
            ddmm.off("onboarding validated", this._validateCallback);
          },
          methods: {
            _: ddmm.translate,
            openURL: ddmm.app.openURL,
            _validateCallback: function (e) {
              (this.game_selection.is_testing = !1),
                e.success && e.version_match
                  ? ((this.game_selection.is_valid = !0),
                    (this.game_selection.path = e.path),
                    (this.game_selection.message.title = ddmm.translate(
                      "renderer.onboarding_v4.header_success"
                    )),
                    (this.game_selection.message.text = ddmm.translate(
                      "renderer.onboarding_v4.text_success"
                    )))
                  : e.success
                  ? ((this.game_selection.is_valid = !1),
                    (this.game_selection.message.title = ddmm.translate(
                      "renderer.onboarding_v4.header_version_mismatch"
                    )),
                    (this.game_selection.message.text = ddmm.translate(
                      "renderer.onboarding_v4.text_version_mismatch",
                      this.correct_version
                    )))
                  : ((this.game_selection.is_valid = !1),
                    (this.game_selection.message.title = ddmm.translate(
                      "renderer.onboarding_v4.header_hash_mismatch"
                    )),
                    (this.game_selection.message.text = ddmm.translate(
                      "renderer.onboarding_v4.text_hash_mismatch"
                    )));
            },
            getStarted: function () {
              this.game_selection.is_valid
                ? ((this.step = 4), (this.skipped_selection = !0))
                : (this.step = 2);
            },
            backFromLastStep: function () {
              this.skipped_selection ? (this.step = 1) : (this.step = 3);
            },
            next: function () {
              this.step += 1;
            },
            previous: function () {
              this.step -= 1;
            },
            browse: function () {
              var e = ddmm.onboarding.browse();
              e && this.validate(e);
            },
            folderCheck: function () {
              (this.game_selection.has_tried_once = !0),
                (this.game_selection.is_valid = !1),
                (this.game_selection.message.title = ddmm.translate(
                  "renderer.onboarding_v4.header_directory_selected"
                )),
                (this.game_selection.message.text = ddmm.translate(
                  "renderer.onboarding_v4.text_directory_selected"
                ));
            },
            fileCheck: function (e) {
              this.validate(e.path);
            },
            validate: function (e) {
              (this.game_selection.is_testing = !0),
                (this.game_selection.is_valid = !1),
                (this.game_selection.has_tried_once = !0),
                ddmm.onboarding.validateGame(e);
            },
            selectInstallFolder: function (e) {
              this.save_directory = e;
            },
            finalise: function () {
              i.default.info("Onboarding", "Finalising setup!"),
                this.$store.commit("set_background", this.background),
                ddmm.config.saveConfigValue(
                  "installFolder",
                  this.save_directory
                ),
                this.$emit("close"),
                ddmm.onboarding.finalise(this.game_selection.path);
            },
            developerLocalUI: function () {
              ddmm.config.saveConfigValue("localUI", "http://localhost:1234/"),
                ddmm.app.restart();
            },
          },
        };
        exports.default = n;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  r = e.$createElement,
                  t = e._self._c || r;
                return t("div", { staticClass: "cover" }, [
                  t("div", { staticClass: "onboarding-wizard" }, [
                    1 === e.step
                      ? t("div", { staticClass: "wizard-step" }, [
                          t(
                            "div",
                            { staticClass: "wizard-step-content full-center" },
                            [
                              t(
                                "div",
                                [
                                  e._m(0),
                                  e._v(" "),
                                  t("p", [
                                    e._v(
                                      e._s(
                                        e._(
                                          "renderer.onboarding_v4.text_welcome"
                                        )
                                      )
                                    ),
                                  ]),
                                  e._v(" "),
                                  t("br"),
                                  e._v(" "),
                                  t("p", [
                                    t(
                                      "button",
                                      {
                                        staticClass: "primary",
                                        attrs: {
                                          disabled: e.game_selection.is_testing,
                                        },
                                        on: { click: e.getStarted },
                                      },
                                      [
                                        t("i", {
                                          staticClass:
                                            "fas fa-arrow-right fa-fw",
                                        }),
                                        e._v(
                                          " " +
                                            e._s(
                                              e._(
                                                "renderer.onboarding_v4.button_start"
                                              )
                                            ) +
                                            " "
                                        ),
                                      ]
                                    ),
                                  ]),
                                  e._v(" "),
                                  t("br"),
                                  e._v(" "),
                                  e.game_selection.is_testing
                                    ? t("p", [
                                        t("i", {
                                          staticClass:
                                            "fas fa-spinner fa-spin fa-fw",
                                        }),
                                        e._v(
                                          " " +
                                            e._s(
                                              e._(
                                                "renderer.onboarding_v4.text_scanning"
                                              )
                                            )
                                        ),
                                      ])
                                    : e._e(),
                                  e._v(" "),
                                  e.developer && !e.developer_local_ui
                                    ? [
                                        t("br"),
                                        e._v(" "),
                                        t("p", [
                                          t(
                                            "a",
                                            {
                                              attrs: { href: "javascript:;" },
                                              on: { click: e.developerLocalUI },
                                            },
                                            [
                                              e._v(
                                                "Enable local UI for onboarding flow"
                                              ),
                                            ]
                                          ),
                                        ]),
                                      ]
                                    : e._e(),
                                ],
                                2
                              ),
                            ]
                          ),
                        ])
                      : 2 === e.step
                      ? t("div", { staticClass: "wizard-step" }, [
                          t("div", { staticClass: "wizard-step-content" }, [
                            t("h1", [
                              e._v(
                                e._s(e._("renderer.onboarding_v4.header_setup"))
                              ),
                            ]),
                            e._v(" "),
                            t("p", [
                              e._v(
                                e._s(
                                  e._("renderer.onboarding_v4.subtitle_careful")
                                )
                              ),
                            ]),
                            e._v(" "),
                            t("br"),
                            e._v(" "),
                            t("div", [
                              t("div", [
                                t("h2", [
                                  e._v(
                                    e._s(
                                      e._(
                                        "renderer.onboarding_v4.header_download"
                                      )
                                    )
                                  ),
                                ]),
                                e._v(" "),
                                t("p", [
                                  e._v(
                                    e._s(
                                      e._(
                                        "renderer.onboarding_v4.text_download",
                                        e.correct_version
                                      )
                                    )
                                  ),
                                ]),
                                e._v(" "),
                                t("br"),
                                e._v(" "),
                                t("p", [
                                  t(
                                    "button",
                                    {
                                      staticClass: "success",
                                      on: {
                                        click: function (r) {
                                          return e.openURL("https://ddlc.moe");
                                        },
                                      },
                                    },
                                    [
                                      t("i", {
                                        staticClass:
                                          "fas fa-external-link-alt fa-fw",
                                      }),
                                      e._v(
                                        " " +
                                          e._s(
                                            e._(
                                              "renderer.onboarding_v4.button_ddlc_website"
                                            )
                                          ) +
                                          " "
                                      ),
                                    ]
                                  ),
                                ]),
                                e._v(" "),
                                t("br"),
                                e._v(" "),
                                t("p", [
                                  e._v(
                                    e._s(
                                      e._("renderer.onboarding_v4.text_s2_next")
                                    )
                                  ),
                                ]),
                                e._v(" "),
                                t("p", [
                                  t("strong", [
                                    e._v(
                                      e._s(
                                        e._(
                                          "renderer.onboarding_v4.text_modification_warning"
                                        )
                                      )
                                    ),
                                  ]),
                                ]),
                              ]),
                              e._v(" "),
                              t("br"),
                              e._v(" "),
                              e.warnings.mac_safari
                                ? t("div", [
                                    t("h2", [
                                      e._v(
                                        e._s(
                                          e._(
                                            "renderer.onboarding_v4.header_safari_warning"
                                          )
                                        )
                                      ),
                                    ]),
                                    e._v(" "),
                                    t(
                                      "p",
                                      [
                                        e._v(
                                          " " +
                                            e._s(
                                              e._(
                                                "renderer.onboarding_v4.text_safari_warning"
                                              )
                                            ) +
                                            " "
                                        ),
                                        t(
                                          "Link",
                                          {
                                            attrs: {
                                              to: "https://help.doki.space/images/user_guide/macos_auto_extract.png",
                                            },
                                          },
                                          [
                                            e._v(
                                              " (" +
                                                e._s(
                                                  e._(
                                                    "renderer.onboarding_v4.link_safari_warning"
                                                  )
                                                ) +
                                                ") "
                                            ),
                                          ]
                                        ),
                                      ],
                                      1
                                    ),
                                  ])
                                : e._e(),
                            ]),
                          ]),
                          e._v(" "),
                          t("div", { staticClass: "wizard-step-controls" }, [
                            t(
                              "button",
                              {
                                staticClass: "secondary",
                                on: { click: e.previous },
                              },
                              [
                                t("i", {
                                  staticClass: "fas fa-arrow-left fa-fw",
                                }),
                                e._v(
                                  " " +
                                    e._s(
                                      e._(
                                        "renderer.onboarding_v4.button_previous"
                                      )
                                    ) +
                                    " "
                                ),
                              ]
                            ),
                            e._v(" "),
                            t(
                              "button",
                              { staticClass: "primary", on: { click: e.next } },
                              [
                                t("i", {
                                  staticClass: "fas fa-arrow-right fa-fw",
                                }),
                                e._v(
                                  " " +
                                    e._s(
                                      e._("renderer.onboarding_v4.button_next")
                                    ) +
                                    " "
                                ),
                              ]
                            ),
                          ]),
                        ])
                      : 3 === e.step
                      ? t("div", { staticClass: "wizard-step" }, [
                          t(
                            "div",
                            { staticClass: "wizard-step-content" },
                            [
                              t("div", [
                                t("h1", [
                                  e._v(
                                    e._s(
                                      e._("renderer.onboarding_v4.header_setup")
                                    )
                                  ),
                                ]),
                                e._v(" "),
                                t("p", [
                                  e._v(
                                    e._s(
                                      e._(
                                        "renderer.onboarding_v4.subtitle_careful"
                                      )
                                    )
                                  ),
                                ]),
                              ]),
                              e._v(" "),
                              t("br"),
                              e._v(" "),
                              t("p", [
                                e._v(
                                  e._s(
                                    e._("renderer.onboarding_v4.text_select")
                                  )
                                ),
                              ]),
                              e._v(" "),
                              t("br"),
                              e._v(" "),
                              t("DropZone", {
                                attrs: {
                                  text: e._(
                                    "renderer.onboarding_v4.text_dropzone"
                                  ),
                                },
                                on: {
                                  directory: e.folderCheck,
                                  file: e.fileCheck,
                                },
                                nativeOn: {
                                  click: function (r) {
                                    return e.browse(r);
                                  },
                                },
                              }),
                              e._v(" "),
                              t("br"),
                              e._v(" "),
                              e.game_selection.has_tried_once
                                ? [
                                    e.game_selection.is_testing
                                      ? [
                                          t("i", {
                                            staticClass:
                                              "fas fa-spinner fa-spin fa-fw",
                                          }),
                                          e._v(
                                            " " +
                                              e._s(
                                                e._(
                                                  "renderer.onboarding_v4.text_validating"
                                                )
                                              ) +
                                              " "
                                          ),
                                        ]
                                      : [
                                          t("h3", [
                                            e._v(
                                              e._s(
                                                e.game_selection.message.title
                                              )
                                            ),
                                          ]),
                                          e._v(" "),
                                          t("p", [
                                            e._v(
                                              e._s(
                                                e.game_selection.message.text
                                              )
                                            ),
                                          ]),
                                        ],
                                  ]
                                : e._e(),
                            ],
                            2
                          ),
                          e._v(" "),
                          t("div", { staticClass: "wizard-step-controls" }, [
                            t(
                              "button",
                              {
                                staticClass: "secondary",
                                on: { click: e.previous },
                              },
                              [
                                t("i", {
                                  staticClass: "fas fa-arrow-left fa-fw",
                                }),
                                e._v(
                                  " " +
                                    e._s(
                                      e._(
                                        "renderer.onboarding_v4.button_previous"
                                      )
                                    ) +
                                    " "
                                ),
                              ]
                            ),
                            e._v(" "),
                            t(
                              "button",
                              {
                                staticClass: "primary",
                                attrs: { disabled: !e.game_selection.is_valid },
                                on: { click: e.next },
                              },
                              [
                                t("i", {
                                  staticClass: "fas fa-arrow-right fa-fw",
                                }),
                                e._v(
                                  " " +
                                    e._s(
                                      e._("renderer.onboarding_v4.button_next")
                                    ) +
                                    " "
                                ),
                              ]
                            ),
                          ]),
                        ])
                      : 4 === e.step
                      ? t("div", { staticClass: "wizard-step" }, [
                          t(
                            "div",
                            { staticClass: "wizard-step-content" },
                            [
                              t("div", [
                                t("h1", [
                                  e._v(
                                    e._s(
                                      e._("renderer.onboarding_v4.header_setup")
                                    )
                                  ),
                                ]),
                                e._v(" "),
                                t("p", [
                                  e._v(
                                    e._s(
                                      e._(
                                        "renderer.onboarding_v4.subtitle_last"
                                      )
                                    )
                                  ),
                                ]),
                              ]),
                              e._v(" "),
                              t("br"),
                              e._v(" "),
                              t("h2", [
                                e._v(
                                  e._s(
                                    e._(
                                      "renderer.onboarding_v4.header_save_location"
                                    )
                                  )
                                ),
                              ]),
                              e._v(" "),
                              t("p", [
                                e._v(
                                  e._s(
                                    e._(
                                      "renderer.onboarding_v4.text_save_location"
                                    )
                                  )
                                ),
                              ]),
                              e._v(" "),
                              t("br"),
                              e._v(" "),
                              t("InstallFolderSelector", {
                                on: { folder: e.selectInstallFolder },
                              }),
                              e._v(" "),
                              t("br"),
                              e._v(" "),
                              t("h2", [
                                e._v(
                                  e._s(
                                    e._("renderer.onboarding_v4.header_waifu")
                                  )
                                ),
                              ]),
                              e._v(" "),
                              t("p", [
                                e._v(
                                  e._s(
                                    e._("renderer.onboarding_v4.subtitle_waifu")
                                  )
                                ),
                              ]),
                              e._v(" "),
                              t("br"),
                              e._v(" "),
                              t("p", [
                                t("label", { attrs: { for: "ob_waifu" } }, [
                                  e._v(
                                    e._s(
                                      e._("renderer.onboarding_v4.label_waifu")
                                    )
                                  ),
                                ]),
                              ]),
                              e._v(" "),
                              t("p", [
                                t(
                                  "select",
                                  {
                                    directives: [
                                      {
                                        name: "model",
                                        rawName: "v-model",
                                        value: e.background,
                                        expression: "background",
                                      },
                                    ],
                                    attrs: { id: "ob_waifu" },
                                    on: {
                                      change: function (r) {
                                        var t = Array.prototype.filter
                                          .call(r.target.options, function (e) {
                                            return e.selected;
                                          })
                                          .map(function (e) {
                                            return "_value" in e
                                              ? e._value
                                              : e.value;
                                          });
                                        e.background = r.target.multiple
                                          ? t
                                          : t[0];
                                      },
                                    },
                                  },
                                  [
                                    t(
                                      "option",
                                      { attrs: { value: "default.png" } },
                                      [
                                        e._v(
                                          e._s(
                                            e._(
                                              "renderer.onboarding_v4.option_waifu_all"
                                            )
                                          )
                                        ),
                                      ]
                                    ),
                                    e._v(" "),
                                    t(
                                      "option",
                                      { attrs: { value: "x-base-monika.png" } },
                                      [
                                        e._v(
                                          e._s(
                                            e._(
                                              "renderer.onboarding_v4.option_waifu_monika"
                                            )
                                          ) + " "
                                        ),
                                      ]
                                    ),
                                    e._v(" "),
                                    t(
                                      "option",
                                      {
                                        attrs: { value: "x-base-natsuki.png" },
                                      },
                                      [
                                        e._v(
                                          e._s(
                                            e._(
                                              "renderer.onboarding_v4.option_waifu_natsuki"
                                            )
                                          ) + " "
                                        ),
                                      ]
                                    ),
                                    e._v(" "),
                                    t(
                                      "option",
                                      { attrs: { value: "x-base-sayori.png" } },
                                      [
                                        e._v(
                                          e._s(
                                            e._(
                                              "renderer.onboarding_v4.option_waifu_sayori"
                                            )
                                          ) + " "
                                        ),
                                      ]
                                    ),
                                    e._v(" "),
                                    t(
                                      "option",
                                      { attrs: { value: "x-base-yuri.png" } },
                                      [
                                        e._v(
                                          e._s(
                                            e._(
                                              "renderer.onboarding_v4.option_waifu_yuri"
                                            )
                                          )
                                        ),
                                      ]
                                    ),
                                  ]
                                ),
                              ]),
                            ],
                            1
                          ),
                          e._v(" "),
                          t("div", { staticClass: "wizard-step-controls" }, [
                            t(
                              "button",
                              {
                                staticClass: "secondary",
                                on: { click: e.backFromLastStep },
                              },
                              [
                                t("i", {
                                  staticClass: "fas fa-arrow-left fa-fw",
                                }),
                                e._v(
                                  " " +
                                    e._s(
                                      e._(
                                        "renderer.onboarding_v4.button_previous"
                                      )
                                    ) +
                                    " "
                                ),
                              ]
                            ),
                            e._v(" "),
                            t(
                              "button",
                              {
                                staticClass: "primary",
                                attrs: { disabled: !e.save_directory },
                                on: { click: e.finalise },
                              },
                              [
                                t("i", { staticClass: "fas fa-check fa-fw" }),
                                e._v(
                                  " " +
                                    e._s(
                                      e._(
                                        "renderer.onboarding_v4.button_finish"
                                      )
                                    ) +
                                    " "
                                ),
                              ]
                            ),
                          ]),
                        ])
                      : e._e(),
                  ]),
                ]);
              },
              staticRenderFns: [
                function () {
                  var e = this.$createElement,
                    r = this._self._c || e;
                  return r("h1", [
                    r("strong", [this._v("Doki Doki Mod Manager")]),
                    this._v(" 4"),
                  ]);
                },
              ],
              _compiled: !0,
              _scopeId: "data-v-1eb84f",
              functional: void 0,
            });
        })();
      },
      {
        "./elements/Link": "TptL",
        "./elements/DropZone": "SMwF",
        "../js/utils/Logger": "vKp2",
        "./elements/InstallFolderSelector": "nE9D",
      },
    ],
    Qbmx: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var t = e(require("fuse.js"));
        function e(t) {
          return t && t.__esModule ? t : { default: t };
        }
        var o = {
          name: "DownloadedDownloadsSection",
          methods: {
            _: ddmm.translate,
            showOptions: function (t) {
              this.$store.commit("select_mod", { mod: t }),
                this.$store.commit("show_modal", { modal: "mod_options" });
            },
            getPathToMod: function (t) {
              return ddmm.joinPath(
                ddmm.config.readConfigValue("installFolder"),
                "mods",
                t
              );
            },
            getFileExtension: function (t) {
              return t.split(".").pop();
            },
            getDisplayName: function (t) {
              var e = t.split(".");
              return e.pop(), e.join(".");
            },
            installMod: function (t) {
              this.$store.dispatch("install_mod", {
                mod: this.getPathToMod(t),
                custom: !1,
              });
            },
            searchEscapeHandler: function (t) {
              "Escape" === t.key && (this.search = "");
            },
          },
          data: function () {
            return { fuse: null, search: "" };
          },
          computed: {
            mods: function () {
              return this.$store.state.game_data.mods;
            },
            modList: function () {
              return this.search
                ? this.fuse.search(this.search).map(function (t) {
                    return t.item;
                  })
                : this.mods;
            },
          },
          mounted: function () {
            this.fuse = new t.default(this.mods);
          },
        };
        exports.default = o;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement,
                  a = e._self._c || t;
                return a(
                  "div",
                  [
                    a("h1", [
                      e._v(
                        e._s(e._("renderer.tab_downloads.downloaded.title"))
                      ),
                    ]),
                    e._v(" "),
                    0 === e.mods.length
                      ? a("div", { staticClass: "text-center" }, [
                          a("br"),
                          e._v(" "),
                          a("p", [
                            e._v(
                              e._s(
                                e._(
                                  "renderer.tab_downloads.downloaded.message_none"
                                )
                              )
                            ),
                          ]),
                        ])
                      : e._e(),
                    e._v(" "),
                    e.mods.length > 0
                      ? a("p", [
                          a("input", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: e.search,
                                expression: "search",
                              },
                            ],
                            attrs: {
                              type: "text",
                              placeholder: e._(
                                "renderer.tab_downloads.downloaded.placeholder_search"
                              ),
                            },
                            domProps: { value: e.search },
                            on: {
                              keyup: e.searchEscapeHandler,
                              click: function (t) {
                                e.search = "";
                              },
                              input: function (t) {
                                t.target.composing ||
                                  (e.search = t.target.value);
                              },
                            },
                          }),
                        ])
                      : e._e(),
                    e._v(" "),
                    e._l(e.modList, function (t) {
                      return a("div", { staticClass: "mod" }, [
                        a("div", [
                          a("h3", [e._v(e._s(e.getDisplayName(t)))]),
                          e._v(" "),
                          a("p", [
                            e._v(
                              e._s(
                                e._(
                                  "renderer.tab_downloads.downloaded.description_type",
                                  e.getFileExtension(t)
                                )
                              )
                            ),
                          ]),
                          e._v(" "),
                          a("br"),
                          e._v(" "),
                          a("p", [
                            a(
                              "button",
                              {
                                staticClass: "primary",
                                on: {
                                  click: function (a) {
                                    return e.installMod(t);
                                  },
                                },
                              },
                              [
                                a("i", { staticClass: "fas fa-bolt fa-fw" }),
                                e._v(
                                  " " +
                                    e._s(
                                      e._(
                                        "renderer.tab_downloads.downloaded.button_install"
                                      )
                                    ) +
                                    " "
                                ),
                              ]
                            ),
                            e._v(" "),
                            a(
                              "button",
                              {
                                staticClass: "secondary",
                                on: {
                                  click: function (a) {
                                    return e.showOptions(t);
                                  },
                                },
                              },
                              [
                                a("i", { staticClass: "fas fa-cog fa-fw" }),
                                e._v(
                                  " " +
                                    e._s(
                                      e._(
                                        "renderer.tab_downloads.downloaded.button_options"
                                      )
                                    ) +
                                    " "
                                ),
                              ]
                            ),
                          ]),
                        ]),
                      ]);
                    }),
                  ],
                  2
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-251955",
              functional: void 0,
            });
        })();
      },
      { "fuse.js": "fGxp" },
    ],
    pypg: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = {
          name: "DownloadsSection",
          methods: {
            _: ddmm.translate,
            percentage: function (e, t) {
              return Math.floor((e / t) * 100) || 0;
            },
            downloadSpeed: function (e, t) {
              var o = Date.now(),
                r = e / 1e6 / Math.floor((o - t) / 1e3);
              return Math.floor(10 * r) / 10 || 0;
            },
            bytesToMB: function (e) {
              return Math.floor(e / 1e5) / 10;
            },
            eta: function (e, t, o) {
              var r = 1e6 * this.downloadSpeed(e, o),
                n = (t - e) / r;
              if (0 === r) return "v4.99.1";
              var a = new Date(1e3 * n).toISOString().substr(11, 8);
              return n < 36e5 && (a = a.substr(3)), a;
            },
          },
          computed: {
            downloads: function () {
              return this.$store.state.downloads;
            },
          },
        };
        exports.default = e;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement,
                  d = e._self._c || t;
                return d(
                  "div",
                  [
                    d("h1", [
                      e._v(e._s(e._("renderer.tab_downloads.downloads.title"))),
                    ]),
                    e._v(" "),
                    0 === e.downloads.length
                      ? d("div", { staticClass: "text-center" }, [
                          d("br"),
                          e._v(" "),
                          d("p", [
                            e._v(
                              e._s(
                                e._(
                                  "renderer.tab_downloads.downloads.message_none"
                                )
                              )
                            ),
                          ]),
                        ])
                      : e._e(),
                    e._v(" "),
                    e._l(e.downloads, function (t) {
                      return d("div", { key: t.filename, staticClass: "mod" }, [
                        d(
                          "div",
                          [
                            d("h3", [e._v(e._s(t.filename))]),
                            e._v(" "),
                            0 === t.total
                              ? [
                                  d("p", [
                                    e._v(
                                      e._s(
                                        e._(
                                          "renderer.tab_downloads.downloads.status_text_downloading_uncertain",
                                          e.bytesToMB(t.downloaded),
                                          e.downloadSpeed(
                                            t.downloaded,
                                            t.startTime
                                          )
                                        )
                                      )
                                    ),
                                  ]),
                                  e._v(" "),
                                  d("br"),
                                  e._v(" "),
                                  e._m(0, !0),
                                ]
                              : [
                                  d("p", [
                                    e._v(
                                      e._s(
                                        e._(
                                          "renderer.tab_downloads.downloads.status_text_downloading",
                                          e.percentage(t.downloaded, t.total),
                                          e.downloadSpeed(
                                            t.downloaded,
                                            t.startTime
                                          ),
                                          e.eta(
                                            t.downloaded,
                                            t.total,
                                            t.startTime
                                          )
                                        )
                                      )
                                    ),
                                  ]),
                                  e._v(" "),
                                  d("br"),
                                  e._v(" "),
                                  d("div", { staticClass: "progress" }, [
                                    d("div", {
                                      staticClass: "bar",
                                      style: {
                                        width:
                                          e.percentage(t.downloaded, t.total) +
                                          "%",
                                      },
                                    }),
                                  ]),
                                ],
                          ],
                          2
                        ),
                      ]);
                    }),
                  ],
                  2
                );
              },
              staticRenderFns: [
                function () {
                  var e = this.$createElement,
                    t = this._self._c || e;
                  return t("div", { staticClass: "progress uncertain" }, [
                    t("div", { staticClass: "bar" }),
                  ]);
                },
              ],
              _compiled: !0,
              _scopeId: "data-v-947a43",
              functional: void 0,
            });
        })();
      },
      {},
    ],
    HntK: [
      function (require, module, exports) {
        "use strict";
        var t =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (o, i) {
                function s(t) {
                  try {
                    u(r.next(t));
                  } catch (e) {
                    i(e);
                  }
                }
                function a(t) {
                  try {
                    u(r.throw(t));
                  } catch (e) {
                    i(e);
                  }
                }
                function u(t) {
                  var e;
                  t.done
                    ? o(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(s, a);
                }
                u((r = r.apply(t, e || [])).next());
              });
            },
          e =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                o,
                i,
                s = {
                  label: 0,
                  sent: function () {
                    if (1 & o[0]) throw o[1];
                    return o[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (i = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (i[Symbol.iterator] = function () {
                    return this;
                  }),
                i
              );
              function a(i) {
                return function (a) {
                  return (function (i) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; s; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (o =
                              2 & i[0]
                                ? r.return
                                : i[0]
                                ? r.throw || ((o = r.return) && o.call(r), 0)
                                : r.next) &&
                            !(o = o.call(r, i[1])).done)
                        )
                          return o;
                        switch (
                          ((r = 0), o && (i = [2 & i[0], o.value]), i[0])
                        ) {
                          case 0:
                          case 1:
                            o = i;
                            break;
                          case 4:
                            return s.label++, { value: i[1], done: !1 };
                          case 5:
                            s.label++, (r = i[1]), (i = [0]);
                            continue;
                          case 7:
                            (i = s.ops.pop()), s.trys.pop();
                            continue;
                          default:
                            if (
                              !(o =
                                (o = s.trys).length > 0 && o[o.length - 1]) &&
                              (6 === i[0] || 2 === i[0])
                            ) {
                              s = 0;
                              continue;
                            }
                            if (
                              3 === i[0] &&
                              (!o || (i[1] > o[0] && i[1] < o[3]))
                            ) {
                              s.label = i[1];
                              break;
                            }
                            if (6 === i[0] && s.label < o[1]) {
                              (s.label = o[1]), (o = i);
                              break;
                            }
                            if (o && s.label < o[2]) {
                              (s.label = o[2]), s.ops.push(i);
                              break;
                            }
                            o[2] && s.ops.pop(), s.trys.pop();
                            continue;
                        }
                        i = e.call(t, s);
                      } catch (a) {
                        (i = [6, a]), (r = 0);
                      } finally {
                        n = o = 0;
                      }
                    if (5 & i[0]) throw i[1];
                    return { value: i[0] ? i[1] : void 0, done: !0 };
                  })([i, a]);
                };
              }
            };
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var n = (function () {
          function n() {
            (this.url = "https://ddmm-mods.shinomiya.group/"),
              (this.name = "DDLC Mod Club");
          }
          return (
            (n.prototype.getListing = function (n) {
              return t(this, void 0, Promise, function () {
                var n,
                  r,
                  o,
                  i,
                  s = this;
                return e(this, function (a) {
                  switch (a.label) {
                    case 0:
                      return [4, fetch(this.url + "listing")];
                    case 1:
                      return [4, a.sent().json()];
                    case 2:
                      return (
                        (n = a.sent()),
                        [
                          4,
                          fetch(
                            "https://raw.githubusercontent.com/DokiDokiModManager/Meta/master/featured.json"
                          ),
                        ]
                      );
                    case 3:
                      return [4, a.sent().json()];
                    case 4:
                      return (
                        (r = a.sent()),
                        (o = r.mods || []),
                        (i = r.patreon || []),
                        [
                          4,
                          Promise.all(
                            n.map(function (n) {
                              return t(s, void 0, void 0, function () {
                                return e(this, function (t) {
                                  return [
                                    2,
                                    {
                                      id: n.modID,
                                      name: n.modName,
                                      author: n.modAuthor,
                                      description: n.modDescription,
                                      icon: n.modAvatar,
                                      shortDescription: n.modShortDescription,
                                      website: n.modWebsite,
                                      nsfw: n.modNSFW,
                                      rating: n.modRating,
                                      downloadURL: n.modUploadURL,
                                      lengthString: new Date(
                                        0,
                                        0,
                                        0,
                                        n.modPlayTimeHours,
                                        n.modPlayTimeMinutes
                                      )
                                        .toTimeString()
                                        .substring(0, 5),
                                      status: n.modStatus,
                                      store: this,
                                      highlighted: -1 !== o.indexOf(n.modID),
                                      highlighted_patreon:
                                        -1 !== i.indexOf(n.modID),
                                    },
                                  ];
                                });
                              });
                            })
                          ),
                        ]
                      );
                    case 5:
                      return [
                        2,
                        {
                          mods: a.sent().sort(function (t, e) {
                            return (
                              e.rating +
                              (e.highlighted ? 200 : 0) +
                              (e.highlighted_patreon ? 100 : 0) -
                              (t.rating +
                                (t.highlighted ? 200 : 0) +
                                (t.highlighted_patreon ? 100 : 0))
                            );
                          }),
                          hasMore: !1,
                        },
                      ];
                  }
                });
              });
            }),
            (n.prototype.testDDL = function (n) {
              return t(this, void 0, Promise, function () {
                var t, r;
                return e(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return (
                        sessionStorage.getItem("ddmcCache") ||
                          sessionStorage.setItem("ddmcCache", "{}"),
                        (t = JSON.parse(
                          sessionStorage.getItem("ddmcCache")
                        )).hasOwnProperty(n)
                          ? [2, t[n]]
                          : [3, 1]
                      );
                    case 1:
                      return [
                        4,
                        fetch(this.url + "mod?id=" + encodeURIComponent(n)),
                      ];
                    case 2:
                      return [4, e.sent().json()];
                    case 3:
                      return (
                        (r = e.sent()),
                        (t[n] = r),
                        sessionStorage.setItem("ddmcCache", JSON.stringify(t)),
                        [2, r]
                      );
                  }
                });
              });
            }),
            n
          );
        })();
        exports.default = n;
      },
      {},
    ],
    oR6U: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = n(require("../../../js/stores/DDLCModClub")),
          t = n(require("../../../js/utils/Logger")),
          r = n(require("fuse.js")),
          o = n(require("../../elements/StarRating")),
          s = n(require("../../elements/Link"));
        function n(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var i = {
          name: "StoreSection",
          components: { StarRating: o.default, Link: s.default },
          data: function () {
            return {
              modStore: new e.default(),
              loaded: !1,
              error: !1,
              fuse: null,
              search: "",
              mods: [],
              debug: !!ddmm.env.DDMM_DEVELOPER,
            };
          },
          methods: {
            _: ddmm.translate,
            viewMod: function (e) {
              this.$store.commit("preview_mod", e);
            },
            searchEscapeHandler: function (e) {
              "Escape" === e.key && (this.search = "");
            },
          },
          computed: {
            modList: function () {
              return this.search
                ? this.fuse.search(this.search).map(function (e) {
                    return e.item;
                  })
                : this.mods;
            },
          },
          mounted: function () {
            var e = this;
            this.modStore
              .getListing(0)
              .then(function (t) {
                (e.mods = t.mods),
                  (e.loaded = !0),
                  (e.fuse = new r.default(e.mods, {
                    keys: ["name", "description", "shortDescription"],
                  }));
              })
              .catch(function (r) {
                t.default.error("Mod Store", r.toString()),
                  (e.loaded = !0),
                  (e.error = !0);
              });
          },
        };
        exports.default = i;
        (function () {
          var e = exports.default || module.exports;
          "function" == typeof e && (e = e.options),
            Object.assign(e, {
              render: function () {
                var e = this,
                  t = e.$createElement,
                  r = e._self._c || t;
                return r(
                  "div",
                  [
                    r("h1", [
                      e._v(
                        e._s(e._("renderer.tab_downloads.store.title_ddmc"))
                      ),
                    ]),
                    e._v(" "),
                    r(
                      "p",
                      [
                        e._v(
                          e._s(
                            e._("renderer.tab_downloads.store.description_ddmc")
                          ) + " "
                        ),
                        r(
                          "Link",
                          { attrs: { to: "https://www.dokidokimodclub.com/" } },
                          [
                            e._v(
                              e._s(
                                e._("renderer.tab_downloads.store.link_ddmc")
                              )
                            ),
                          ]
                        ),
                      ],
                      1
                    ),
                    e._v(" "),
                    r("br"),
                    e._v(" "),
                    r("p", [
                      e._v(
                        e._s(
                          e._(
                            "renderer.tab_downloads.store.description_featured"
                          )
                        )
                      ),
                    ]),
                    e._v(" "),
                    e.loaded
                      ? e.error
                        ? [
                            r("br"),
                            e._v(" "),
                            r("p", [
                              r("i", {
                                staticClass: "fas fa-exclamation-triangle",
                              }),
                              e._v(
                                " " +
                                  e._s(
                                    e._(
                                      "renderer.tab_downloads.store.error_loading"
                                    )
                                  )
                              ),
                            ]),
                          ]
                        : [
                            r("br"),
                            e._v(" "),
                            r("p", [
                              r("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: e.search,
                                    expression: "search",
                                  },
                                ],
                                attrs: {
                                  type: "text",
                                  placeholder: e._(
                                    "renderer.tab_downloads.store.placeholder_search"
                                  ),
                                },
                                domProps: { value: e.search },
                                on: {
                                  keyup: e.searchEscapeHandler,
                                  click: function (t) {
                                    e.search = "";
                                  },
                                  input: function (t) {
                                    t.target.composing ||
                                      (e.search = t.target.value);
                                  },
                                },
                              }),
                            ]),
                            e._v(" "),
                            r("br"),
                            e._v(" "),
                            e._l(e.modList, function (t) {
                              return r(
                                "div",
                                {
                                  class: {
                                    mod: !0,
                                    "highlighted-mod": t.highlighted,
                                  },
                                  staticStyle: { cursor: "pointer" },
                                  on: {
                                    click: function (r) {
                                      return e.viewMod(t);
                                    },
                                  },
                                },
                                [
                                  r("div", { staticClass: "image" }, [
                                    t.icon
                                      ? r("img", {
                                          attrs: {
                                            alt: "",
                                            src: t.icon,
                                            width: "75",
                                          },
                                        })
                                      : r("img", {
                                          attrs: {
                                            alt: "",
                                            src: "/logo.84758037.png",
                                            width: "75",
                                          },
                                        }),
                                  ]),
                                  e._v(" "),
                                  r(
                                    "div",
                                    [
                                      r("h3", [
                                        r("strong", [
                                          e._v(e._s(t.name) + " "),
                                          t.nsfw
                                            ? r(
                                                "span",
                                                { staticClass: "tag" },
                                                [e._v("18+")]
                                              )
                                            : e._e(),
                                        ]),
                                      ]),
                                      e._v(" "),
                                      r("StarRating", {
                                        attrs: { rating: t.rating },
                                      }),
                                      e._v(" "),
                                      r("p", [e._v(e._s(t.shortDescription))]),
                                      e._v(" "),
                                      e.debug
                                        ? r("p", [e._v(e._s(t.downloadURL))])
                                        : e._e(),
                                    ],
                                    1
                                  ),
                                ]
                              );
                            }),
                          ]
                      : [
                          r("br"),
                          e._v(" "),
                          r("p", [
                            r("i", { staticClass: "fas fa-spinner fa-spin" }),
                            e._v(
                              " " +
                                e._s(
                                  e._(
                                    "renderer.tab_downloads.store.text_loading"
                                  )
                                )
                            ),
                          ]),
                        ],
                  ],
                  2
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-425772",
              functional: void 0,
            });
        })();
      },
      {
        "../../../js/stores/DDLCModClub": "HntK",
        "../../../js/utils/Logger": "vKp2",
        "fuse.js": "fGxp",
        "../../elements/StarRating": "ZsxS",
        "../../elements/Link": "TptL",
        "./../../../images/logo.png": [["logo.84758037.png", "cwj3"], "cwj3"],
      },
    ],
    mVK5: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = d(require("../../js/utils/Logger")),
          o = d(require("./downloads/DownloadedDownloadsSection")),
          t = d(require("./downloads/DownloadsSection")),
          n = d(require("./downloads/StoreSection"));
        function d(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var a = {
          name: "DownloadsTab",
          components: {
            DownloadedDownloadsSection: o.default,
            DownloadsSection: t.default,
            StoreSection: n.default,
          },
          methods: {
            _: ddmm.translate,
            selectOption: function (o) {
              e.default.info(
                "Downloads",
                "Selecting section from component " + o
              ),
                sessionStorage.setItem("tab_downloads_last_selection", o),
                (this.selected_option = o);
            },
          },
          data: function () {
            return {
              selected_option: sessionStorage.getItem(
                "tab_downloads_last_selection"
              )
                ? sessionStorage.getItem("tab_downloads_last_selection")
                : "DownloadedDownloadsSection",
              menu: [
                {
                  header: ddmm.translate(
                    "renderer.tab_downloads.list.header_library"
                  ),
                  contents: [
                    {
                      title: ddmm.translate(
                        "renderer.tab_downloads.list.link_downloaded"
                      ),
                      component: "DownloadedDownloadsSection",
                    },
                  ],
                },
              ],
            };
          },
        };
        exports.default = a;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this,
                  e = t.$createElement,
                  s = t._self._c || e;
                return s("div", { staticClass: "page-content" }, [
                  s("div", { staticClass: "mod-viewer-pane" }, [
                    s(
                      "div",
                      { staticClass: "mod-viewer-mod-list" },
                      [
                        t._l(t.menu, function (e) {
                          return [
                            s(
                              "div",
                              { staticClass: "mod-view-mod-list-title" },
                              [t._v(t._s(e.header))]
                            ),
                            t._v(" "),
                            t._l(e.contents, function (e) {
                              return e.hideIf && e.hideIf()
                                ? t._e()
                                : s(
                                    "div",
                                    {
                                      class: {
                                        "mod-view-mod-list-entry": !0,
                                        active:
                                          t.selected_option === e.component,
                                      },
                                      on: {
                                        click: function (s) {
                                          return t.selectOption(e.component);
                                        },
                                      },
                                    },
                                    [
                                      s(
                                        "span",
                                        {
                                          staticClass:
                                            "mod-view-mod-list-entry-title",
                                        },
                                        [t._v(t._s(e.title))]
                                      ),
                                      t._v(" "),
                                      e.tag && e.tag()
                                        ? s(
                                            "span",
                                            {
                                              staticClass:
                                                "mod-view-mod-list-tag",
                                            },
                                            [s("span", [t._v(t._s(e.tag()))])]
                                          )
                                        : t._e(),
                                    ]
                                  );
                            }),
                            t._v(" "),
                            s("br"),
                          ];
                        }),
                      ],
                      2
                    ),
                    t._v(" "),
                    s("div", { staticClass: "mod-viewer-mod-display" }, [
                      s(
                        "div",
                        { staticClass: "main-content" },
                        [s(t.selected_option, { tag: "component" })],
                        1
                      ),
                    ]),
                  ]),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-32d7d4",
              functional: void 0,
            });
        })();
      },
      {
        "../../js/utils/Logger": "vKp2",
        "./downloads/DownloadedDownloadsSection": "Qbmx",
        "./downloads/DownloadsSection": "pypg",
        "./downloads/StoreSection": "oR6U",
      },
    ],
    kI7A: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = {
          name: "NewsBanner",
          computed: {
            text: function () {
              return this.$store.state.news_banner.body;
            },
          },
          methods: {
            dismiss: function () {
              var e = [];
              localStorage.getItem("seen_news") &&
                (e = localStorage.getItem("seen_news").split(",")),
                e.push(this.$store.state.news_banner.id),
                localStorage.setItem("seen_news", e.join(",")),
                this.$store.commit("hide_banner");
            },
          },
        };
        exports.default = e;
        (function () {
          var t = exports.default || module.exports;
          "function" == typeof t && (t = t.options),
            Object.assign(t, {
              render: function () {
                var t = this.$createElement,
                  s = this._self._c || t;
                return s("div", { staticClass: "news-banner" }, [
                  s(
                    "div",
                    {
                      staticClass: "news-banner-content",
                      on: { click: this.dismiss },
                    },
                    [this._v(" " + this._s(this.text) + " ")]
                  ),
                ]);
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: "data-v-c41436",
              functional: void 0,
            });
        })();
      },
      {},
    ],
    LUNw: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.default = void 0);
        var e = b(require("./Titlebar.vue")),
          t = b(require("./Navbar.vue")),
          r = b(require("./tabs/ModsTab.vue")),
          n = b(require("./tabs/OptionsTab.vue")),
          a = b(require("./tabs/ExperimentsTab")),
          o = b(require("./tabs/AboutTab.vue")),
          s = b(require("./Dialogs.vue")),
          d = b(require("./OnboardingOverlay")),
          u = b(require("./tabs/DownloadsTab")),
          i = b(require("./NewsBanner"));
        function b(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var m = {
          name: "App",
          components: {
            NewsBanner: i.default,
            OnboardingOverlay: d.default,
            Navbar: t.default,
            Titlebar: e.default,
            ModsTab: r.default,
            OptionsTab: n.default,
            Dialogs: s.default,
            AboutTab: o.default,
            ExperimentsTab: a.default,
            DownloadsTab: u.default,
          },
          data: function () {
            var e = this;
            return {
              app_name: "Doki Doki Mod Manager",
              app_version: ddmm.version,
              system_platform: ddmm.platform,
              onboarding: !1,
              system_borders: ddmm.config.readConfigValue("systemBorders"),
              tabs: [
                {
                  name: ddmm.translate.bind(null, "renderer.tabs.tab_play"),
                  component: "ModsTab",
                },
                {
                  name: ddmm.translate.bind(null, "renderer.tabs.tab_options"),
                  component: "OptionsTab",
                  badge: function () {
                    return "available" === e.$store.state.update;
                  },
                },
                {
                  name: ddmm.translate.bind(null, "renderer.tabs.tab_about"),
                  component: "AboutTab",
                },
                {
                  name: function () {
                    return ddmm.env.DDMM_DEVELOPER ? "Experiments" : "";
                  },
                  component: "ExperimentsTab",
                },
              ],
            };
          },
          computed: {
            rerenderKey: function () {
              return this.$store.state.rerender_key;
            },
            tab: function () {
              return this.$store.state.tab;
            },
            backgroundImage: function () {
              var e = this.$store.state.background;
              return e.startsWith("custom:")
                ? ddmm.fileToURL(e.split("custom:")[1])
                : ddmm.fileToURL("src/renderer/images/backgrounds/" + e);
            },
            backgroundOverride1: function () {
              return this.$store.state.custom_background.src_1;
            },
            backgroundOverride2: function () {
              return this.$store.state.custom_background.src_2;
            },
            showBackground: function () {
              return this.$store.state.custom_background.display;
            },
            showBackground2: function () {
              return this.$store.state.custom_background.display_2;
            },
            bannerVisisble: function () {
              return this.$store.state.news_banner.display;
            },
          },
          mounted: function () {
            var e = this;
            ddmm.on("start onboarding", function () {
              e.onboarding = !0;
            }),
              ddmm.on("onboarding downloaded", function () {
                e.onboarding = !1;
              });
          },
        };
        exports.default = m;
        (function () {
          var a = exports.default || module.exports;
          "function" == typeof a && (a = a.options),
            Object.assign(a, {
              render: function () {
                var a = this,
                  s = a.$createElement,
                  e = a._self._c || s;
                return e(
                  "div",
                  { key: a.rerenderKey, class: "os-" + a.system_platform },
                  [
                    e("div", { staticClass: "app-container-background" }, [
                      e("div", { staticClass: "gradient" }),
                      a._v(" "),
                      e("img", {
                        class: { visible: !a.showBackground },
                        attrs: { alt: "", src: a.backgroundImage },
                      }),
                      a._v(" "),
                      e("img", {
                        class: {
                          visible: a.showBackground && !a.showBackground2,
                        },
                        attrs: { alt: "", src: a.backgroundOverride1 },
                      }),
                      a._v(" "),
                      e("img", {
                        class: {
                          visible: a.showBackground && a.showBackground2,
                        },
                        attrs: { alt: "", src: a.backgroundOverride2 },
                      }),
                    ]),
                    a._v(" "),
                    e(
                      "div",
                      { staticClass: "app app-container-contents" },
                      [
                        e("Titlebar", {
                          attrs: {
                            app_name: a.app_name,
                            app_version: a.app_version,
                            system_borders: a.system_borders,
                          },
                        }),
                        a._v(" "),
                        a.bannerVisisble && !a.onboarding
                          ? e("NewsBanner")
                          : a._e(),
                        a._v(" "),
                        e("Dialogs"),
                        a._v(" "),
                        a.onboarding
                          ? e("OnboardingOverlay", {
                              on: {
                                close: function (s) {
                                  a.onboarding = !1;
                                },
                              },
                            })
                          : [
                              e(a.tab, { tag: "component" }),
                              a._v(" "),
                              e("Navbar", { attrs: { tabs: a.tabs } }),
                            ],
                      ],
                      2
                    ),
                  ]
                );
              },
              staticRenderFns: [],
              _compiled: !0,
              _scopeId: null,
              functional: void 0,
            });
        })();
      },
      {
        "./Titlebar.vue": "yym9",
        "./Navbar.vue": "eyJ0",
        "./tabs/ModsTab.vue": "WIEY",
        "./tabs/OptionsTab.vue": "Bblu",
        "./tabs/ExperimentsTab": "Ev4J",
        "./tabs/AboutTab.vue": "l7PR",
        "./Dialogs.vue": "GKZt",
        "./OnboardingOverlay": "giWp",
        "./tabs/DownloadsTab": "mVK5",
        "./NewsBanner": "kI7A",
      },
    ],
    xgwM: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.__extends = e),
          (exports.__rest = n),
          (exports.__decorate = o),
          (exports.__param = a),
          (exports.__metadata = i),
          (exports.__awaiter = u),
          (exports.__generator = c),
          (exports.__exportStar = f),
          (exports.__values = l),
          (exports.__read = s),
          (exports.__spread = p),
          (exports.__spreadArrays = y),
          (exports.__await = _),
          (exports.__asyncGenerator = h),
          (exports.__asyncDelegator = v),
          (exports.__asyncValues = b),
          (exports.__makeTemplateObject = d),
          (exports.__importStar = w),
          (exports.__importDefault = x),
          (exports.__classPrivateFieldGet = m),
          (exports.__classPrivateFieldSet = O),
          (exports.__assign = void 0);
        var t = function (e, r) {
          return (t =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
            })(e, r);
        };
        function e(e, r) {
          function n() {
            this.constructor = e;
          }
          t(e, r),
            (e.prototype =
              null === r
                ? Object.create(r)
                : ((n.prototype = r.prototype), new n()));
        }
        var r = function () {
          return (
            (exports.__assign = r =
              Object.assign ||
              function (t) {
                for (var e, r = 1, n = arguments.length; r < n; r++)
                  for (var o in (e = arguments[r]))
                    Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
                return t;
              }),
            r.apply(this, arguments)
          );
        };
        function n(t, e) {
          var r = {};
          for (var n in t)
            Object.prototype.hasOwnProperty.call(t, n) &&
              e.indexOf(n) < 0 &&
              (r[n] = t[n]);
          if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
            var o = 0;
            for (n = Object.getOwnPropertySymbols(t); o < n.length; o++)
              e.indexOf(n[o]) < 0 &&
                Object.prototype.propertyIsEnumerable.call(t, n[o]) &&
                (r[n[o]] = t[n[o]]);
          }
          return r;
        }
        function o(t, e, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? e
                : null === n
                ? (n = Object.getOwnPropertyDescriptor(e, r))
                : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(t, e, r, n);
          else
            for (var u = t.length - 1; u >= 0; u--)
              (o = t[u]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
          return a > 3 && i && Object.defineProperty(e, r, i), i;
        }
        function a(t, e) {
          return function (r, n) {
            e(r, n, t);
          };
        }
        function i(t, e) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(t, e);
        }
        function u(t, e, r, n) {
          return new (r || (r = Promise))(function (o, a) {
            function i(t) {
              try {
                c(n.next(t));
              } catch (e) {
                a(e);
              }
            }
            function u(t) {
              try {
                c(n.throw(t));
              } catch (e) {
                a(e);
              }
            }
            function c(t) {
              var e;
              t.done
                ? o(t.value)
                : ((e = t.value),
                  e instanceof r
                    ? e
                    : new r(function (t) {
                        t(e);
                      })).then(i, u);
            }
            c((n = n.apply(t, e || [])).next());
          });
        }
        function c(t, e) {
          var r,
            n,
            o,
            a,
            i = {
              label: 0,
              sent: function () {
                if (1 & o[0]) throw o[1];
                return o[1];
              },
              trys: [],
              ops: [],
            };
          return (
            (a = { next: u(0), throw: u(1), return: u(2) }),
            "function" == typeof Symbol &&
              (a[Symbol.iterator] = function () {
                return this;
              }),
            a
          );
          function u(a) {
            return function (u) {
              return (function (a) {
                if (r) throw new TypeError("Generator is already executing.");
                for (; i; )
                  try {
                    if (
                      ((r = 1),
                      n &&
                        (o =
                          2 & a[0]
                            ? n.return
                            : a[0]
                            ? n.throw || ((o = n.return) && o.call(n), 0)
                            : n.next) &&
                        !(o = o.call(n, a[1])).done)
                    )
                      return o;
                    switch (((n = 0), o && (a = [2 & a[0], o.value]), a[0])) {
                      case 0:
                      case 1:
                        o = a;
                        break;
                      case 4:
                        return i.label++, { value: a[1], done: !1 };
                      case 5:
                        i.label++, (n = a[1]), (a = [0]);
                        continue;
                      case 7:
                        (a = i.ops.pop()), i.trys.pop();
                        continue;
                      default:
                        if (
                          !(o = (o = i.trys).length > 0 && o[o.length - 1]) &&
                          (6 === a[0] || 2 === a[0])
                        ) {
                          i = 0;
                          continue;
                        }
                        if (
                          3 === a[0] &&
                          (!o || (a[1] > o[0] && a[1] < o[3]))
                        ) {
                          i.label = a[1];
                          break;
                        }
                        if (6 === a[0] && i.label < o[1]) {
                          (i.label = o[1]), (o = a);
                          break;
                        }
                        if (o && i.label < o[2]) {
                          (i.label = o[2]), i.ops.push(a);
                          break;
                        }
                        o[2] && i.ops.pop(), i.trys.pop();
                        continue;
                    }
                    a = e.call(t, i);
                  } catch (u) {
                    (a = [6, u]), (n = 0);
                  } finally {
                    r = o = 0;
                  }
                if (5 & a[0]) throw a[1];
                return { value: a[0] ? a[1] : void 0, done: !0 };
              })([a, u]);
            };
          }
        }
        function f(t, e) {
          for (var r in t) e.hasOwnProperty(r) || (e[r] = t[r]);
        }
        function l(t) {
          var e = "function" == typeof Symbol && Symbol.iterator,
            r = e && t[e],
            n = 0;
          if (r) return r.call(t);
          if (t && "number" == typeof t.length)
            return {
              next: function () {
                return (
                  t && n >= t.length && (t = void 0),
                  { value: t && t[n++], done: !t }
                );
              },
            };
          throw new TypeError(
            e ? "Object is not iterable." : "Symbol.iterator is not defined."
          );
        }
        function s(t, e) {
          var r = "function" == typeof Symbol && t[Symbol.iterator];
          if (!r) return t;
          var n,
            o,
            a = r.call(t),
            i = [];
          try {
            for (; (void 0 === e || e-- > 0) && !(n = a.next()).done; )
              i.push(n.value);
          } catch (u) {
            o = { error: u };
          } finally {
            try {
              n && !n.done && (r = a.return) && r.call(a);
            } finally {
              if (o) throw o.error;
            }
          }
          return i;
        }
        function p() {
          for (var t = [], e = 0; e < arguments.length; e++)
            t = t.concat(s(arguments[e]));
          return t;
        }
        function y() {
          for (var t = 0, e = 0, r = arguments.length; e < r; e++)
            t += arguments[e].length;
          var n = Array(t),
            o = 0;
          for (e = 0; e < r; e++)
            for (var a = arguments[e], i = 0, u = a.length; i < u; i++, o++)
              n[o] = a[i];
          return n;
        }
        function _(t) {
          return this instanceof _ ? ((this.v = t), this) : new _(t);
        }
        function h(t, e, r) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var n,
            o = r.apply(t, e || []),
            a = [];
          return (
            (n = {}),
            i("next"),
            i("throw"),
            i("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n
          );
          function i(t) {
            o[t] &&
              (n[t] = function (e) {
                return new Promise(function (r, n) {
                  a.push([t, e, r, n]) > 1 || u(t, e);
                });
              });
          }
          function u(t, e) {
            try {
              (r = o[t](e)).value instanceof _
                ? Promise.resolve(r.value.v).then(c, f)
                : l(a[0][2], r);
            } catch (n) {
              l(a[0][3], n);
            }
            var r;
          }
          function c(t) {
            u("next", t);
          }
          function f(t) {
            u("throw", t);
          }
          function l(t, e) {
            t(e), a.shift(), a.length && u(a[0][0], a[0][1]);
          }
        }
        function v(t) {
          var e, r;
          return (
            (e = {}),
            n("next"),
            n("throw", function (t) {
              throw t;
            }),
            n("return"),
            (e[Symbol.iterator] = function () {
              return this;
            }),
            e
          );
          function n(n, o) {
            e[n] = t[n]
              ? function (e) {
                  return (r = !r)
                    ? { value: _(t[n](e)), done: "return" === n }
                    : o
                    ? o(e)
                    : e;
                }
              : o;
          }
        }
        function b(t) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var e,
            r = t[Symbol.asyncIterator];
          return r
            ? r.call(t)
            : ((t = "function" == typeof l ? l(t) : t[Symbol.iterator]()),
              (e = {}),
              n("next"),
              n("throw"),
              n("return"),
              (e[Symbol.asyncIterator] = function () {
                return this;
              }),
              e);
          function n(r) {
            e[r] =
              t[r] &&
              function (e) {
                return new Promise(function (n, o) {
                  (function (t, e, r, n) {
                    Promise.resolve(n).then(function (e) {
                      t({ value: e, done: r });
                    }, e);
                  })(n, o, (e = t[r](e)).done, e.value);
                });
              };
          }
        }
        function d(t, e) {
          return (
            Object.defineProperty
              ? Object.defineProperty(t, "raw", { value: e })
              : (t.raw = e),
            t
          );
        }
        function w(t) {
          if (t && t.__esModule) return t;
          var e = {};
          if (null != t)
            for (var r in t) Object.hasOwnProperty.call(t, r) && (e[r] = t[r]);
          return (e.default = t), e;
        }
        function x(t) {
          return t && t.__esModule ? t : { default: t };
        }
        function m(t, e) {
          if (!e.has(t))
            throw new TypeError(
              "attempted to get private field on non-instance"
            );
          return e.get(t);
        }
        function O(t, e, r) {
          if (!e.has(t))
            throw new TypeError(
              "attempted to set private field on non-instance"
            );
          return e.set(t, r), r;
        }
        exports.__assign = r;
      },
      {},
    ],
    Iljv: [
      function (require, module, exports) {
        "use strict";
        var e;
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.LogLevel = void 0),
          (exports.LogLevel = e),
          (function (e) {
            (e[(e.None = 0)] = "None"),
              (e[(e.Error = 1)] = "Error"),
              (e[(e.Debug = 2)] = "Debug"),
              (e[(e.Verbose = 3)] = "Verbose");
          })(e || (exports.LogLevel = e = {}));
      },
      {},
    ],
    rIWg: [
      function (require, module, exports) {
        "use strict";
        var r;
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.Severity = void 0),
          (exports.Severity = r),
          (function (r) {
            (r.Fatal = "fatal"),
              (r.Error = "error"),
              (r.Warning = "warning"),
              (r.Log = "log"),
              (r.Info = "info"),
              (r.Debug = "debug"),
              (r.Critical = "critical");
          })(r || (exports.Severity = r = {})),
          (function (r) {
            r.fromString = function (e) {
              switch (e) {
                case "debug":
                  return r.Debug;
                case "info":
                  return r.Info;
                case "warn":
                case "warning":
                  return r.Warning;
                case "error":
                  return r.Error;
                case "fatal":
                  return r.Fatal;
                case "critical":
                  return r.Critical;
                case "log":
                default:
                  return r.Log;
              }
            };
          })(r || (exports.Severity = r = {}));
      },
      {},
    ],
    WgeD: [
      function (require, module, exports) {
        "use strict";
        var e;
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SpanStatus = void 0),
          (exports.SpanStatus = e),
          (function (e) {
            (e.Ok = "ok"),
              (e.DeadlineExceeded = "deadline_exceeded"),
              (e.Unauthenticated = "unauthenticated"),
              (e.PermissionDenied = "permission_denied"),
              (e.NotFound = "not_found"),
              (e.ResourceExhausted = "resource_exhausted"),
              (e.InvalidArgument = "invalid_argument"),
              (e.Unimplemented = "unimplemented"),
              (e.Unavailable = "unavailable"),
              (e.InternalError = "internal_error"),
              (e.UnknownError = "unknown_error"),
              (e.Cancelled = "cancelled"),
              (e.AlreadyExists = "already_exists"),
              (e.FailedPrecondition = "failed_precondition"),
              (e.Aborted = "aborted"),
              (e.OutOfRange = "out_of_range"),
              (e.DataLoss = "data_loss");
          })(e || (exports.SpanStatus = e = {})),
          (function (e) {
            e.fromHttpCode = function (n) {
              if (n < 400) return e.Ok;
              if (n >= 400 && n < 500)
                switch (n) {
                  case 401:
                    return e.Unauthenticated;
                  case 403:
                    return e.PermissionDenied;
                  case 404:
                    return e.NotFound;
                  case 409:
                    return e.AlreadyExists;
                  case 413:
                    return e.FailedPrecondition;
                  case 429:
                    return e.ResourceExhausted;
                  default:
                    return e.InvalidArgument;
                }
              if (n >= 500 && n < 600)
                switch (n) {
                  case 501:
                    return e.Unimplemented;
                  case 503:
                    return e.Unavailable;
                  case 504:
                    return e.DeadlineExceeded;
                  default:
                    return e.InternalError;
                }
              return e.UnknownError;
            };
          })(e || (exports.SpanStatus = e = {}));
      },
      {},
    ],
    wrT2: [
      function (require, module, exports) {
        "use strict";
        var t;
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.Status = void 0),
          (exports.Status = t),
          (function (t) {
            (t.Unknown = "unknown"),
              (t.Skipped = "skipped"),
              (t.Success = "success"),
              (t.RateLimit = "rate_limit"),
              (t.Invalid = "invalid"),
              (t.Failed = "failed");
          })(t || (exports.Status = t = {})),
          (function (t) {
            t.fromHttpCode = function (e) {
              return e >= 200 && e < 300
                ? t.Success
                : 429 === e
                ? t.RateLimit
                : e >= 400 && e < 500
                ? t.Invalid
                : e >= 500
                ? t.Failed
                : t.Unknown;
            };
          })(t || (exports.Status = t = {}));
      },
      {},
    ],
    wTDG: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          Object.defineProperty(exports, "LogLevel", {
            enumerable: !0,
            get: function () {
              return e.LogLevel;
            },
          }),
          Object.defineProperty(exports, "Severity", {
            enumerable: !0,
            get: function () {
              return t.Severity;
            },
          }),
          Object.defineProperty(exports, "SpanStatus", {
            enumerable: !0,
            get: function () {
              return r.SpanStatus;
            },
          }),
          Object.defineProperty(exports, "Status", {
            enumerable: !0,
            get: function () {
              return n.Status;
            },
          });
        var e = require("./loglevel"),
          t = require("./severity"),
          r = require("./span"),
          n = require("./status");
      },
      {
        "./loglevel": "Iljv",
        "./severity": "rIWg",
        "./span": "WgeD",
        "./status": "wrT2",
      },
    ],
    ExDe: [
      function (require, module, exports) {
        "use strict";
        function e(e) {
          e.then(null, function (e) {
            console.error(e);
          });
        }
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.forget = e);
      },
      {},
    ],
    LvSr: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.setPrototypeOf = void 0);
        var t =
          Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? e : r);
        function e(t, e) {
          return (t.__proto__ = e), t;
        }
        function r(t, e) {
          for (var r in e) t.hasOwnProperty(r) || (t[r] = e[r]);
          return t;
        }
        exports.setPrototypeOf = t;
      },
      {},
    ],
    P4t4: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SentryError = void 0);
        var e = o(require("tslib")),
          r = require("./polyfill");
        function t() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (t = function () {
              return e;
            }),
            e
          );
        }
        function o(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var r = t();
          if (r && r.has(e)) return r.get(e);
          var o = {},
            n = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var u in e)
            if (Object.prototype.hasOwnProperty.call(e, u)) {
              var i = n ? Object.getOwnPropertyDescriptor(e, u) : null;
              i && (i.get || i.set)
                ? Object.defineProperty(o, u, i)
                : (o[u] = e[u]);
            }
          return (o.default = e), r && r.set(e, o), o;
        }
        var n = (function (t) {
          function o(e) {
            var o = this.constructor,
              n = t.call(this, e) || this;
            return (
              (n.message = e),
              (n.name = o.prototype.constructor.name),
              (0, r.setPrototypeOf)(n, o.prototype),
              n
            );
          }
          return e.__extends(o, t), o;
        })(Error);
        exports.SentryError = n;
      },
      { tslib: "xgwM", "./polyfill": "LvSr" },
    ],
    d4dZ: [
      function (require, module, exports) {
        "use strict";
        function t(e) {
          return (t =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                })(e);
        }
        function e(t) {
          switch (Object.prototype.toString.call(t)) {
            case "[object Error]":
            case "[object Exception]":
            case "[object DOMException]":
              return !0;
            default:
              return y(t, Error);
          }
        }
        function o(t) {
          return "[object ErrorEvent]" === Object.prototype.toString.call(t);
        }
        function n(t) {
          return "[object DOMError]" === Object.prototype.toString.call(t);
        }
        function r(t) {
          return "[object DOMException]" === Object.prototype.toString.call(t);
        }
        function c(t) {
          return "[object String]" === Object.prototype.toString.call(t);
        }
        function i(e) {
          return null === e || ("object" !== t(e) && "function" != typeof e);
        }
        function p(t) {
          return "[object Object]" === Object.prototype.toString.call(t);
        }
        function u(t) {
          return "undefined" != typeof Event && y(t, Event);
        }
        function s(t) {
          return "undefined" != typeof Element && y(t, Element);
        }
        function f(t) {
          return "[object RegExp]" === Object.prototype.toString.call(t);
        }
        function l(t) {
          return Boolean(t && t.then && "function" == typeof t.then);
        }
        function b(t) {
          return (
            p(t) &&
            "nativeEvent" in t &&
            "preventDefault" in t &&
            "stopPropagation" in t
          );
        }
        function y(t, e) {
          try {
            return t instanceof e;
          } catch (o) {
            return !1;
          }
        }
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.isError = e),
          (exports.isErrorEvent = o),
          (exports.isDOMError = n),
          (exports.isDOMException = r),
          (exports.isString = c),
          (exports.isPrimitive = i),
          (exports.isPlainObject = p),
          (exports.isEvent = u),
          (exports.isElement = s),
          (exports.isRegExp = f),
          (exports.isThenable = l),
          (exports.isSyntheticEvent = b),
          (exports.isInstanceOf = y);
      },
      {},
    ],
    mjKZ: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.truncate = t),
          (exports.snipLine = e),
          (exports.safeJoin = n),
          (exports.isMatchingPattern = i);
        var r = require("./is");
        function t(r, t) {
          return (
            void 0 === t && (t = 0),
            "string" != typeof r || 0 === t
              ? r
              : r.length <= t
              ? r
              : r.substr(0, t) + "..."
          );
        }
        function e(r, t) {
          var e = r,
            n = e.length;
          if (n <= 150) return e;
          t > n && (t = n);
          var i = Math.max(t - 60, 0);
          i < 5 && (i = 0);
          var s = Math.min(i + 140, n);
          return (
            s > n - 5 && (s = n),
            s === n && (i = Math.max(s - 140, 0)),
            (e = e.slice(i, s)),
            i > 0 && (e = "'{snip} " + e),
            s < n && (e += " {snip}"),
            e
          );
        }
        function n(r, t) {
          if (!Array.isArray(r)) return "";
          for (var e = [], n = 0; n < r.length; n++) {
            var i = r[n];
            try {
              e.push(String(i));
            } catch (s) {
              e.push("[value cannot be serialized]");
            }
          }
          return e.join(t);
        }
        function i(t, e) {
          return (0, r.isRegExp)(e)
            ? e.test(t)
            : "string" == typeof e && -1 !== t.indexOf(e);
        }
      },
      { "./is": "d4dZ" },
    ],
    IA54: [
      function (require, module, exports) {
        var process = require("process");
        var global = arguments[3];
        var e = require("process"),
          t = arguments[3];
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.dynamicRequire = o),
          (exports.isNodeEnv = i),
          (exports.getGlobalObject = u),
          (exports.uuid4 = s),
          (exports.parseUrl = c),
          (exports.getEventDescription = p),
          (exports.consoleSandbox = x),
          (exports.addExceptionTypeValue = f),
          (exports.addExceptionMechanism = l),
          (exports.getLocationHref = v),
          (exports.htmlTreeAsString = m),
          (exports.timestampWithMs = N),
          (exports.parseSemver = b),
          (exports.parseRetryAfterHeader = j),
          (exports.getFunctionName = O),
          (exports.addContextToFrame = E),
          (exports.crossPlatformPerformance = void 0);
        var r = require("./is"),
          n = require("./string");
        function o(e, t) {
          return e.require(t);
        }
        function i() {
          return (
            "[object process]" ===
            Object.prototype.toString.call(void 0 !== e ? e : 0)
          );
        }
        var a = {};
        function u() {
          return i()
            ? t
            : "undefined" != typeof window
            ? window
            : "undefined" != typeof self
            ? self
            : a;
        }
        function s() {
          var e = u(),
            t = e.crypto || e.msCrypto;
          if (void 0 !== t && t.getRandomValues) {
            var r = new Uint16Array(8);
            t.getRandomValues(r),
              (r[3] = (4095 & r[3]) | 16384),
              (r[4] = (16383 & r[4]) | 32768);
            var n = function (e) {
              for (var t = e.toString(16); t.length < 4; ) t = "0" + t;
              return t;
            };
            return (
              n(r[0]) +
              n(r[1]) +
              n(r[2]) +
              n(r[3]) +
              n(r[4]) +
              n(r[5]) +
              n(r[6]) +
              n(r[7])
            );
          }
          return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(
            /[xy]/g,
            function (e) {
              var t = (16 * Math.random()) | 0;
              return ("x" === e ? t : (3 & t) | 8).toString(16);
            }
          );
        }
        function c(e) {
          if (!e) return {};
          var t = e.match(
            /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/
          );
          if (!t) return {};
          var r = t[6] || "",
            n = t[8] || "";
          return {
            host: t[4],
            path: t[5],
            protocol: t[2],
            relative: t[5] + r + n,
          };
        }
        function p(e) {
          if (e.message) return e.message;
          if (e.exception && e.exception.values && e.exception.values[0]) {
            var t = e.exception.values[0];
            return t.type && t.value
              ? t.type + ": " + t.value
              : t.type || t.value || e.event_id || "<unknown>";
          }
          return e.event_id || "<unknown>";
        }
        function x(e) {
          var t = u();
          if (!("console" in t)) return e();
          var r = t.console,
            n = {};
          ["debug", "info", "warn", "error", "log", "assert"].forEach(function (
            e
          ) {
            e in t.console &&
              r[e].__sentry_original__ &&
              ((n[e] = r[e]), (r[e] = r[e].__sentry_original__));
          });
          var o = e();
          return (
            Object.keys(n).forEach(function (e) {
              r[e] = n[e];
            }),
            o
          );
        }
        function f(e, t, r) {
          (e.exception = e.exception || {}),
            (e.exception.values = e.exception.values || []),
            (e.exception.values[0] = e.exception.values[0] || {}),
            (e.exception.values[0].value =
              e.exception.values[0].value || t || ""),
            (e.exception.values[0].type =
              e.exception.values[0].type || r || "Error");
        }
        function l(e, t) {
          void 0 === t && (t = {});
          try {
            (e.exception.values[0].mechanism =
              e.exception.values[0].mechanism || {}),
              Object.keys(t).forEach(function (r) {
                e.exception.values[0].mechanism[r] = t[r];
              });
          } catch (r) {}
        }
        function v() {
          try {
            return document.location.href;
          } catch (e) {
            return "";
          }
        }
        function m(e) {
          try {
            for (
              var t = e, r = [], n = 0, o = 0, i = " > ".length, a = void 0;
              t &&
              n++ < 5 &&
              !(
                "html" === (a = d(t)) ||
                (n > 1 && o + r.length * i + a.length >= 80)
              );

            )
              r.push(a), (o += a.length), (t = t.parentNode);
            return r.reverse().join(" > ");
          } catch (u) {
            return "<unknown>";
          }
        }
        function d(e) {
          var t,
            n,
            o,
            i,
            a,
            u = e,
            s = [];
          if (!u || !u.tagName) return "";
          if (
            (s.push(u.tagName.toLowerCase()),
            u.id && s.push("#" + u.id),
            (t = u.className) && (0, r.isString)(t))
          )
            for (n = t.split(/\s+/), a = 0; a < n.length; a++)
              s.push("." + n[a]);
          var c = ["type", "name", "title", "alt"];
          for (a = 0; a < c.length; a++)
            (o = c[a]),
              (i = u.getAttribute(o)) && s.push("[" + o + '="' + i + '"]');
          return s.join("");
        }
        var h = Date.now(),
          g = 0,
          y = {
            now: function () {
              var e = Date.now() - h;
              return e < g && (e = g), (g = e), e;
            },
            timeOrigin: h,
          },
          _ = (function () {
            if (i())
              try {
                return o(module, "perf_hooks").performance;
              } catch (e) {
                return y;
              }
            return (
              u().performance &&
                void 0 === performance.timeOrigin &&
                (performance.timeOrigin =
                  (performance.timing && performance.timing.navigationStart) ||
                  h),
              u().performance || y
            );
          })();
        function N() {
          return (_.timeOrigin + _.now()) / 1e3;
        }
        exports.crossPlatformPerformance = _;
        var w =
          /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
        function b(e) {
          var t = e.match(w) || [],
            r = parseInt(t[1], 10),
            n = parseInt(t[2], 10),
            o = parseInt(t[3], 10);
          return {
            buildmetadata: t[5],
            major: isNaN(r) ? void 0 : r,
            minor: isNaN(n) ? void 0 : n,
            patch: isNaN(o) ? void 0 : o,
            prerelease: t[4],
          };
        }
        var A = 6e4;
        function j(e, t) {
          if (!t) return A;
          var r = parseInt("" + t, 10);
          if (!isNaN(r)) return 1e3 * r;
          var n = Date.parse("" + t);
          return isNaN(n) ? A : n - e;
        }
        var M = "<anonymous>";
        function O(e) {
          try {
            return (e && "function" == typeof e && e.name) || M;
          } catch (t) {
            return M;
          }
        }
        function E(e, t, r) {
          void 0 === r && (r = 5);
          var o = t.lineno || 0,
            i = e.length,
            a = Math.max(Math.min(i, o - 1), 0);
          (t.pre_context = e.slice(Math.max(0, a - r), a).map(function (e) {
            return (0, n.snipLine)(e, 0);
          })),
            (t.context_line = (0, n.snipLine)(
              e[Math.min(i - 1, a)],
              t.colno || 0
            )),
            (t.post_context = e
              .slice(Math.min(a + 1, i), a + 1 + r)
              .map(function (e) {
                return (0, n.snipLine)(e, 0);
              }));
        }
      },
      { "./is": "d4dZ", "./string": "mjKZ", process: "rH1J" },
    ],
    SIj1: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.logger = void 0);
        var o = require("./misc"),
          e = (0, o.getGlobalObject)(),
          n = "Sentry Logger ",
          r = (function () {
            function r() {
              this._enabled = !1;
            }
            return (
              (r.prototype.disable = function () {
                this._enabled = !1;
              }),
              (r.prototype.enable = function () {
                this._enabled = !0;
              }),
              (r.prototype.log = function () {
                for (var r = [], t = 0; t < arguments.length; t++)
                  r[t] = arguments[t];
                this._enabled &&
                  (0, o.consoleSandbox)(function () {
                    e.console.log(n + "[Log]: " + r.join(" "));
                  });
              }),
              (r.prototype.warn = function () {
                for (var r = [], t = 0; t < arguments.length; t++)
                  r[t] = arguments[t];
                this._enabled &&
                  (0, o.consoleSandbox)(function () {
                    e.console.warn(n + "[Warn]: " + r.join(" "));
                  });
              }),
              (r.prototype.error = function () {
                for (var r = [], t = 0; t < arguments.length; t++)
                  r[t] = arguments[t];
                this._enabled &&
                  (0, o.consoleSandbox)(function () {
                    e.console.error(n + "[Error]: " + r.join(" "));
                  });
              }),
              r
            );
          })();
        e.__SENTRY__ = e.__SENTRY__ || {};
        var t = e.__SENTRY__.logger || (e.__SENTRY__.logger = new r());
        exports.logger = t;
      },
      { "./misc": "IA54" },
    ],
    Ux8H: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.Memo = void 0);
        var e = (function () {
          function e() {
            (this._hasWeakSet = "function" == typeof WeakSet),
              (this._inner = this._hasWeakSet ? new WeakSet() : []);
          }
          return (
            (e.prototype.memoize = function (e) {
              if (this._hasWeakSet)
                return !!this._inner.has(e) || (this._inner.add(e), !1);
              for (var t = 0; t < this._inner.length; t++) {
                if (this._inner[t] === e) return !0;
              }
              return this._inner.push(e), !1;
            }),
            (e.prototype.unmemoize = function (e) {
              if (this._hasWeakSet) this._inner.delete(e);
              else
                for (var t = 0; t < this._inner.length; t++)
                  if (this._inner[t] === e) {
                    this._inner.splice(t, 1);
                    break;
                  }
            }),
            e
          );
        })();
        exports.Memo = e;
      },
      {},
    ],
    k9SW: [
      function (require, module, exports) {
        var global = arguments[3];
        var e = arguments[3];
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.fill = f),
          (exports.urlEncode = l),
          (exports.normalizeToSize = m),
          (exports.walk = b),
          (exports.normalize = g),
          (exports.extractExceptionKeysForMessage = O),
          (exports.dropUndefinedKeys = j);
        var t = a(require("tslib")),
          r = require("./is"),
          n = require("./memo"),
          o = require("./misc"),
          i = require("./string");
        function u() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (u = function () {
              return e;
            }),
            e
          );
        }
        function a(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var t = u();
          if (t && t.has(e)) return t.get(e);
          var r = {},
            n = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var o in e)
            if (Object.prototype.hasOwnProperty.call(e, o)) {
              var i = n ? Object.getOwnPropertyDescriptor(e, o) : null;
              i && (i.get || i.set)
                ? Object.defineProperty(r, o, i)
                : (r[o] = e[o]);
            }
          return (r.default = e), t && t.set(e, r), r;
        }
        function c(e) {
          return (c =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    "function" == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? "symbol"
                    : typeof e;
                })(e);
        }
        function f(e, t, r) {
          if (t in e) {
            var n = e[t],
              o = r(n);
            if ("function" == typeof o)
              try {
                (o.prototype = o.prototype || {}),
                  Object.defineProperties(o, {
                    __sentry_original__: { enumerable: !1, value: n },
                  });
              } catch (i) {}
            e[t] = o;
          }
        }
        function l(e) {
          return Object.keys(e)
            .map(function (t) {
              return encodeURIComponent(t) + "=" + encodeURIComponent(e[t]);
            })
            .join("&");
        }
        function s(e) {
          if ((0, r.isError)(e)) {
            var t = e,
              n = { message: t.message, name: t.name, stack: t.stack };
            for (var i in t)
              Object.prototype.hasOwnProperty.call(t, i) && (n[i] = t[i]);
            return n;
          }
          if ((0, r.isEvent)(e)) {
            var u = e,
              a = {};
            a.type = u.type;
            try {
              a.target = (0, r.isElement)(u.target)
                ? (0, o.htmlTreeAsString)(u.target)
                : Object.prototype.toString.call(u.target);
            } catch (c) {
              a.target = "<unknown>";
            }
            try {
              a.currentTarget = (0, r.isElement)(u.currentTarget)
                ? (0, o.htmlTreeAsString)(u.currentTarget)
                : Object.prototype.toString.call(u.currentTarget);
            } catch (c) {
              a.currentTarget = "<unknown>";
            }
            for (var i in ("undefined" != typeof CustomEvent &&
              (0, r.isInstanceOf)(e, CustomEvent) &&
              (a.detail = u.detail),
            u))
              Object.prototype.hasOwnProperty.call(u, i) && (a[i] = u);
            return a;
          }
          return e;
        }
        function y(e) {
          return ~-encodeURI(e).split(/%..|./).length;
        }
        function p(e) {
          return y(JSON.stringify(e));
        }
        function m(e, t, r) {
          void 0 === t && (t = 3), void 0 === r && (r = 102400);
          var n = g(e, t);
          return p(n) > r ? m(e, t - 1, r) : n;
        }
        function v(e) {
          var t = Object.prototype.toString.call(e);
          if ("string" == typeof e) return e;
          if ("[object Object]" === t) return "[Object]";
          if ("[object Array]" === t) return "[Array]";
          var n = d(e);
          return (0, r.isPrimitive)(n) ? n : t;
        }
        function d(t, n) {
          return "domain" === n && t && "object" === c(t) && t._events
            ? "[Domain]"
            : "domainEmitter" === n
            ? "[DomainEmitter]"
            : void 0 !== e && t === e
            ? "[Global]"
            : "undefined" != typeof window && t === window
            ? "[Window]"
            : "undefined" != typeof document && t === document
            ? "[Document]"
            : (0, r.isSyntheticEvent)(t)
            ? "[SyntheticEvent]"
            : "number" == typeof t && t != t
            ? "[NaN]"
            : void 0 === t
            ? "[undefined]"
            : "function" == typeof t
            ? "[Function: " + (0, o.getFunctionName)(t) + "]"
            : t;
        }
        function b(e, t, o, i) {
          if (
            (void 0 === o && (o = 1 / 0),
            void 0 === i && (i = new n.Memo()),
            0 === o)
          )
            return v(t);
          if (null != t && "function" == typeof t.toJSON) return t.toJSON();
          var u = d(t, e);
          if ((0, r.isPrimitive)(u)) return u;
          var a = s(t),
            c = Array.isArray(t) ? [] : {};
          if (i.memoize(t)) return "[Circular ~]";
          for (var f in a)
            Object.prototype.hasOwnProperty.call(a, f) &&
              (c[f] = b(f, a[f], o - 1, i));
          return i.unmemoize(t), c;
        }
        function g(e, t) {
          try {
            return JSON.parse(
              JSON.stringify(e, function (e, r) {
                return b(e, r, t);
              })
            );
          } catch (r) {
            return "**non-serializable**";
          }
        }
        function O(e, t) {
          void 0 === t && (t = 40);
          var r = Object.keys(s(e));
          if ((r.sort(), !r.length)) return "[object has no keys]";
          if (r[0].length >= t) return (0, i.truncate)(r[0], t);
          for (var n = r.length; n > 0; n--) {
            var o = r.slice(0, n).join(", ");
            if (!(o.length > t))
              return n === r.length ? o : (0, i.truncate)(o, t);
          }
          return "";
        }
        function j(e) {
          var n, o;
          if ((0, r.isPlainObject)(e)) {
            var i = e,
              u = {};
            try {
              for (
                var a = t.__values(Object.keys(i)), c = a.next();
                !c.done;
                c = a.next()
              ) {
                var f = c.value;
                void 0 !== i[f] && (u[f] = j(i[f]));
              }
            } catch (l) {
              n = { error: l };
            } finally {
              try {
                c && !c.done && (o = a.return) && o.call(a);
              } finally {
                if (n) throw n.error;
              }
            }
            return u;
          }
          return Array.isArray(e) ? e.map(j) : e;
        }
      },
      {
        tslib: "xgwM",
        "./is": "d4dZ",
        "./memo": "Ux8H",
        "./misc": "IA54",
        "./string": "mjKZ",
      },
    ],
    dFOy: [
      function (require, module, exports) {
        "use strict";
        function r(r, t) {
          for (var e = 0, n = r.length - 1; n >= 0; n--) {
            var o = r[n];
            "." === o
              ? r.splice(n, 1)
              : ".." === o
              ? (r.splice(n, 1), e++)
              : e && (r.splice(n, 1), e--);
          }
          if (t) for (; e--; e) r.unshift("..");
          return r;
        }
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.resolve = n),
          (exports.relative = s),
          (exports.normalizePath = i),
          (exports.isAbsolute = u),
          (exports.join = l),
          (exports.dirname = a),
          (exports.basename = f);
        var t = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        function e(r) {
          var e = t.exec(r);
          return e ? e.slice(1) : [];
        }
        function n() {
          for (var t = [], e = 0; e < arguments.length; e++)
            t[e] = arguments[e];
          for (var n = "", o = !1, s = t.length - 1; s >= -1 && !o; s--) {
            var i = s >= 0 ? t[s] : "/";
            i && ((n = i + "/" + n), (o = "/" === i.charAt(0)));
          }
          return (
            (o ? "/" : "") +
              (n = r(
                n.split("/").filter(function (r) {
                  return !!r;
                }),
                !o
              ).join("/")) || "."
          );
        }
        function o(r) {
          for (var t = 0; t < r.length && "" === r[t]; t++);
          for (var e = r.length - 1; e >= 0 && "" === r[e]; e--);
          return t > e ? [] : r.slice(t, e - t + 1);
        }
        function s(r, t) {
          (r = n(r).substr(1)), (t = n(t).substr(1));
          for (
            var e = o(r.split("/")),
              s = o(t.split("/")),
              i = Math.min(e.length, s.length),
              u = i,
              l = 0;
            l < i;
            l++
          )
            if (e[l] !== s[l]) {
              u = l;
              break;
            }
          var a = [];
          for (l = u; l < e.length; l++) a.push("..");
          return (a = a.concat(s.slice(u))).join("/");
        }
        function i(t) {
          var e = u(t),
            n = "/" === t.substr(-1),
            o = r(
              t.split("/").filter(function (r) {
                return !!r;
              }),
              !e
            ).join("/");
          return o || e || (o = "."), o && n && (o += "/"), (e ? "/" : "") + o;
        }
        function u(r) {
          return "/" === r.charAt(0);
        }
        function l() {
          for (var r = [], t = 0; t < arguments.length; t++)
            r[t] = arguments[t];
          return i(r.join("/"));
        }
        function a(r) {
          var t = e(r),
            n = t[0],
            o = t[1];
          return n || o ? (o && (o = o.substr(0, o.length - 1)), n + o) : ".";
        }
        function f(r, t) {
          var n = e(r)[2];
          return (
            t &&
              n.substr(-1 * t.length) === t &&
              (n = n.substr(0, n.length - t.length)),
            n
          );
        }
      },
      {},
    ],
    cztX: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SyncPromise = void 0);
        var e,
          t = require("./is");
        !(function (e) {
          (e.PENDING = "PENDING"),
            (e.RESOLVED = "RESOLVED"),
            (e.REJECTED = "REJECTED");
        })(e || (e = {}));
        var n = (function () {
          function n(n) {
            var r = this;
            (this._state = e.PENDING),
              (this._handlers = []),
              (this._resolve = function (t) {
                r._setResult(e.RESOLVED, t);
              }),
              (this._reject = function (t) {
                r._setResult(e.REJECTED, t);
              }),
              (this._setResult = function (n, i) {
                r._state === e.PENDING &&
                  ((0, t.isThenable)(i)
                    ? i.then(r._resolve, r._reject)
                    : ((r._state = n), (r._value = i), r._executeHandlers()));
              }),
              (this._attachHandler = function (e) {
                (r._handlers = r._handlers.concat(e)), r._executeHandlers();
              }),
              (this._executeHandlers = function () {
                if (r._state !== e.PENDING) {
                  var t = r._handlers.slice();
                  (r._handlers = []),
                    t.forEach(function (t) {
                      t.done ||
                        (r._state === e.RESOLVED &&
                          t.onfulfilled &&
                          t.onfulfilled(r._value),
                        r._state === e.REJECTED &&
                          t.onrejected &&
                          t.onrejected(r._value),
                        (t.done = !0));
                    });
                }
              });
            try {
              n(this._resolve, this._reject);
            } catch (i) {
              this._reject(i);
            }
          }
          return (
            (n.prototype.toString = function () {
              return "[object SyncPromise]";
            }),
            (n.resolve = function (e) {
              return new n(function (t) {
                t(e);
              });
            }),
            (n.reject = function (e) {
              return new n(function (t, n) {
                n(e);
              });
            }),
            (n.all = function (e) {
              return new n(function (t, r) {
                if (Array.isArray(e))
                  if (0 !== e.length) {
                    var i = e.length,
                      o = [];
                    e.forEach(function (e, u) {
                      n.resolve(e)
                        .then(function (e) {
                          (o[u] = e), 0 === (i -= 1) && t(o);
                        })
                        .then(null, r);
                    });
                  } else t([]);
                else
                  r(new TypeError("Promise.all requires an array as input."));
              });
            }),
            (n.prototype.then = function (e, t) {
              var r = this;
              return new n(function (n, i) {
                r._attachHandler({
                  done: !1,
                  onfulfilled: function (t) {
                    if (e)
                      try {
                        return void n(e(t));
                      } catch (r) {
                        return void i(r);
                      }
                    else n(t);
                  },
                  onrejected: function (e) {
                    if (t)
                      try {
                        return void n(t(e));
                      } catch (r) {
                        return void i(r);
                      }
                    else i(e);
                  },
                });
              });
            }),
            (n.prototype.catch = function (e) {
              return this.then(function (e) {
                return e;
              }, e);
            }),
            (n.prototype.finally = function (e) {
              var t = this;
              return new n(function (n, r) {
                var i, o;
                return t
                  .then(
                    function (t) {
                      (o = !1), (i = t), e && e();
                    },
                    function (t) {
                      (o = !0), (i = t), e && e();
                    }
                  )
                  .then(function () {
                    o ? r(i) : n(i);
                  });
              });
            }),
            n
          );
        })();
        exports.SyncPromise = n;
      },
      { "./is": "d4dZ" },
    ],
    bJFw: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PromiseBuffer = void 0);
        var e = require("./error"),
          t = require("./syncpromise"),
          r = (function () {
            function r(e) {
              (this._limit = e), (this._buffer = []);
            }
            return (
              (r.prototype.isReady = function () {
                return void 0 === this._limit || this.length() < this._limit;
              }),
              (r.prototype.add = function (r) {
                var n = this;
                return this.isReady()
                  ? (-1 === this._buffer.indexOf(r) && this._buffer.push(r),
                    r
                      .then(function () {
                        return n.remove(r);
                      })
                      .then(null, function () {
                        return n.remove(r).then(null, function () {});
                      }),
                    r)
                  : t.SyncPromise.reject(
                      new e.SentryError(
                        "Not adding Promise due to buffer limit reached."
                      )
                    );
              }),
              (r.prototype.remove = function (e) {
                return this._buffer.splice(this._buffer.indexOf(e), 1)[0];
              }),
              (r.prototype.length = function () {
                return this._buffer.length;
              }),
              (r.prototype.drain = function (e) {
                var r = this;
                return new t.SyncPromise(function (n) {
                  var i = setTimeout(function () {
                    e && e > 0 && n(!1);
                  }, e);
                  t.SyncPromise.all(r._buffer)
                    .then(function () {
                      clearTimeout(i), n(!0);
                    })
                    .then(null, function () {
                      n(!0);
                    });
                });
              }),
              r
            );
          })();
        exports.PromiseBuffer = r;
      },
      { "./error": "P4t4", "./syncpromise": "cztX" },
    ],
    GdPa: [
      function (require, module, exports) {
        var global = arguments[3];
        var e = arguments[3];
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.supportsErrorEvent = n),
          (exports.supportsDOMError = o),
          (exports.supportsDOMException = c),
          (exports.supportsFetch = i),
          (exports.supportsNativeFetch = s),
          (exports.supportsReportingObserver = p),
          (exports.supportsReferrerPolicy = a),
          (exports.supportsHistory = f);
        var r = require("./logger"),
          t = require("./misc");
        function n() {
          try {
            return new ErrorEvent(""), !0;
          } catch (e) {
            return !1;
          }
        }
        function o() {
          try {
            return new DOMError(""), !0;
          } catch (e) {
            return !1;
          }
        }
        function c() {
          try {
            return new DOMException(""), !0;
          } catch (e) {
            return !1;
          }
        }
        function i() {
          if (!("fetch" in (0, t.getGlobalObject)())) return !1;
          try {
            return new Headers(), new Request(""), new Response(), !0;
          } catch (e) {
            return !1;
          }
        }
        function u(e) {
          return (
            e &&
            /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/.test(
              e.toString()
            )
          );
        }
        function s() {
          if (!i()) return !1;
          var e = (0, t.getGlobalObject)();
          if (u(e.fetch)) return !0;
          var n = !1,
            o = e.document;
          if (o && "function" == typeof o.createElement)
            try {
              var c = o.createElement("iframe");
              (c.hidden = !0),
                o.head.appendChild(c),
                c.contentWindow &&
                  c.contentWindow.fetch &&
                  (n = u(c.contentWindow.fetch)),
                o.head.removeChild(c);
            } catch (s) {
              r.logger.warn(
                "Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ",
                s
              );
            }
          return n;
        }
        function p() {
          return "ReportingObserver" in (0, t.getGlobalObject)();
        }
        function a() {
          if (!i()) return !1;
          try {
            return new Request("_", { referrerPolicy: "origin" }), !0;
          } catch (e) {
            return !1;
          }
        }
        function f() {
          var e = (0, t.getGlobalObject)(),
            r = e.chrome,
            n = r && r.app && r.app.runtime,
            o =
              "history" in e &&
              !!e.history.pushState &&
              !!e.history.replaceState;
          return !n && o;
        }
      },
      { "./logger": "SIj1", "./misc": "IA54" },
    ],
    s5o0: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.addInstrumentationHandler = h);
        var t = u(require("tslib")),
          e = require("./is"),
          n = require("./logger"),
          r = require("./misc"),
          o = require("./object"),
          i = require("./supports");
        function a() {
          if ("function" != typeof WeakMap) return null;
          var t = new WeakMap();
          return (
            (a = function () {
              return t;
            }),
            t
          );
        }
        function u(t) {
          if (t && t.__esModule) return t;
          if (null === t || ("object" != typeof t && "function" != typeof t))
            return { default: t };
          var e = a();
          if (e && e.has(t)) return e.get(t);
          var n = {},
            r = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var o in t)
            if (Object.prototype.hasOwnProperty.call(t, o)) {
              var i = r ? Object.getOwnPropertyDescriptor(t, o) : null;
              i && (i.get || i.set)
                ? Object.defineProperty(n, o, i)
                : (n[o] = t[o]);
            }
          return (n.default = t), e && e.set(t, n), n;
        }
        var c,
          s = (0, r.getGlobalObject)(),
          l = {},
          f = {};
        function p(t) {
          if (!f[t])
            switch (((f[t] = !0), t)) {
              case "console":
                y();
                break;
              case "dom":
                k();
                break;
              case "xhr":
                g();
                break;
              case "fetch":
                v();
                break;
              case "history":
                b();
                break;
              case "error":
                P();
                break;
              case "unhandledrejection":
                D();
                break;
              default:
                n.logger.warn("unknown instrumentation type:", t);
            }
        }
        function h(t) {
          t &&
            "string" == typeof t.type &&
            "function" == typeof t.callback &&
            ((l[t.type] = l[t.type] || []),
            l[t.type].push(t.callback),
            p(t.type));
        }
        function d(e, o) {
          var i, a;
          if (e && l[e])
            try {
              for (
                var u = t.__values(l[e] || []), c = u.next();
                !c.done;
                c = u.next()
              ) {
                var s = c.value;
                try {
                  s(o);
                } catch (f) {
                  n.logger.error(
                    "Error while triggering instrumentation handler.\nType: " +
                      e +
                      "\nName: " +
                      (0, r.getFunctionName)(s) +
                      "\nError: " +
                      f
                  );
                }
              }
            } catch (p) {
              i = { error: p };
            } finally {
              try {
                c && !c.done && (a = u.return) && a.call(u);
              } finally {
                if (i) throw i.error;
              }
            }
        }
        function y() {
          "console" in s &&
            ["debug", "info", "warn", "error", "log", "assert"].forEach(
              function (t) {
                t in s.console &&
                  (0, o.fill)(s.console, t, function (e) {
                    return function () {
                      for (var n = [], r = 0; r < arguments.length; r++)
                        n[r] = arguments[r];
                      d("console", { args: n, level: t }),
                        e && Function.prototype.apply.call(e, s.console, n);
                    };
                  });
              }
            );
        }
        function v() {
          (0, i.supportsNativeFetch)() &&
            (0, o.fill)(s, "fetch", function (e) {
              return function () {
                for (var n = [], r = 0; r < arguments.length; r++)
                  n[r] = arguments[r];
                var o = {
                  args: n,
                  fetchData: { method: _(n), url: m(n) },
                  startTimestamp: Date.now(),
                };
                return (
                  d("fetch", t.__assign({}, o)),
                  e.apply(s, n).then(
                    function (e) {
                      return (
                        d(
                          "fetch",
                          t.__assign({}, o, {
                            endTimestamp: Date.now(),
                            response: e,
                          })
                        ),
                        e
                      );
                    },
                    function (e) {
                      throw (
                        (d(
                          "fetch",
                          t.__assign({}, o, {
                            endTimestamp: Date.now(),
                            error: e,
                          })
                        ),
                        e)
                      );
                    }
                  )
                );
              };
            });
        }
        function _(t) {
          return (
            void 0 === t && (t = []),
            "Request" in s && (0, e.isInstanceOf)(t[0], Request) && t[0].method
              ? String(t[0].method).toUpperCase()
              : t[1] && t[1].method
              ? String(t[1].method).toUpperCase()
              : "GET"
          );
        }
        function m(t) {
          return (
            void 0 === t && (t = []),
            "string" == typeof t[0]
              ? t[0]
              : "Request" in s && (0, e.isInstanceOf)(t[0], Request)
              ? t[0].url
              : String(t[0])
          );
        }
        function g() {
          if ("XMLHttpRequest" in s) {
            var n = XMLHttpRequest.prototype;
            (0, o.fill)(n, "open", function (t) {
              return function () {
                for (var n = [], r = 0; r < arguments.length; r++)
                  n[r] = arguments[r];
                var o = n[1];
                return (
                  (this.__sentry_xhr__ = {
                    method: (0, e.isString)(n[0]) ? n[0].toUpperCase() : n[0],
                    url: n[1],
                  }),
                  (0, e.isString)(o) &&
                    "POST" === this.__sentry_xhr__.method &&
                    o.match(/sentry_key/) &&
                    (this.__sentry_own_request__ = !0),
                  t.apply(this, n)
                );
              };
            }),
              (0, o.fill)(n, "send", function (e) {
                return function () {
                  for (var n = [], r = 0; r < arguments.length; r++)
                    n[r] = arguments[r];
                  var o = this,
                    i = { args: n, startTimestamp: Date.now(), xhr: o };
                  return (
                    d("xhr", t.__assign({}, i)),
                    o.addEventListener("readystatechange", function () {
                      if (4 === o.readyState) {
                        try {
                          o.__sentry_xhr__ &&
                            (o.__sentry_xhr__.status_code = o.status);
                        } catch (e) {}
                        d(
                          "xhr",
                          t.__assign({}, i, { endTimestamp: Date.now() })
                        );
                      }
                    }),
                    e.apply(this, n)
                  );
                };
              });
          }
        }
        function b() {
          if ((0, i.supportsHistory)()) {
            var t = s.onpopstate;
            (s.onpopstate = function () {
              for (var e = [], n = 0; n < arguments.length; n++)
                e[n] = arguments[n];
              var r = s.location.href,
                o = c;
              if (((c = r), d("history", { from: o, to: r }), t))
                return t.apply(this, e);
            }),
              (0, o.fill)(s.history, "pushState", e),
              (0, o.fill)(s.history, "replaceState", e);
          }
          function e(t) {
            return function () {
              for (var e = [], n = 0; n < arguments.length; n++)
                e[n] = arguments[n];
              var r = e.length > 2 ? e[2] : void 0;
              if (r) {
                var o = c,
                  i = String(r);
                (c = i), d("history", { from: o, to: i });
              }
              return t.apply(this, e);
            };
          }
        }
        function k() {
          "document" in s &&
            (s.document.addEventListener(
              "click",
              j("click", d.bind(null, "dom")),
              !1
            ),
            s.document.addEventListener("keypress", q(d.bind(null, "dom")), !1),
            ["EventTarget", "Node"].forEach(function (t) {
              var e = s[t] && s[t].prototype;
              e &&
                e.hasOwnProperty &&
                e.hasOwnProperty("addEventListener") &&
                ((0, o.fill)(e, "addEventListener", function (t) {
                  return function (e, n, r) {
                    return (
                      n && n.handleEvent
                        ? ("click" === e &&
                            (0, o.fill)(n, "handleEvent", function (t) {
                              return function (e) {
                                return (
                                  j("click", d.bind(null, "dom"))(e),
                                  t.call(this, e)
                                );
                              };
                            }),
                          "keypress" === e &&
                            (0, o.fill)(n, "handleEvent", function (t) {
                              return function (e) {
                                return (
                                  q(d.bind(null, "dom"))(e), t.call(this, e)
                                );
                              };
                            }))
                        : ("click" === e &&
                            j("click", d.bind(null, "dom"), !0)(this),
                          "keypress" === e && q(d.bind(null, "dom"))(this)),
                      t.call(this, e, n, r)
                    );
                  };
                }),
                (0, o.fill)(e, "removeEventListener", function (t) {
                  return function (e, n, r) {
                    var o = n;
                    try {
                      o = o && (o.__sentry_wrapped__ || o);
                    } catch (i) {}
                    return t.call(this, e, o, r);
                  };
                }));
            }));
        }
        var w,
          E,
          T = 1e3,
          O = 0;
        function j(t, e, n) {
          return (
            void 0 === n && (n = !1),
            function (r) {
              (w = void 0),
                r &&
                  E !== r &&
                  ((E = r),
                  O && clearTimeout(O),
                  n
                    ? (O = setTimeout(function () {
                        e({ event: r, name: t });
                      }))
                    : e({ event: r, name: t }));
            }
          );
        }
        function q(t) {
          return function (e) {
            var n;
            try {
              n = e.target;
            } catch (o) {
              return;
            }
            var r = n && n.tagName;
            r &&
              ("INPUT" === r || "TEXTAREA" === r || n.isContentEditable) &&
              (w || j("input", t)(e),
              clearTimeout(w),
              (w = setTimeout(function () {
                w = void 0;
              }, T)));
          };
        }
        var x = null;
        function P() {
          (x = s.onerror),
            (s.onerror = function (t, e, n, r, o) {
              return (
                d("error", { column: r, error: o, line: n, msg: t, url: e }),
                !!x && x.apply(this, arguments)
              );
            });
        }
        var S = null;
        function D() {
          (S = s.onunhandledrejection),
            (s.onunhandledrejection = function (t) {
              return d("unhandledrejection", t), !S || S.apply(this, arguments);
            });
        }
      },
      {
        tslib: "xgwM",
        "./is": "d4dZ",
        "./logger": "SIj1",
        "./misc": "IA54",
        "./object": "k9SW",
        "./supports": "GdPa",
      },
    ],
    fYbB: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.Dsn = void 0);
        var t = e(require("tslib")),
          r = require("./error");
        function o() {
          if ("function" != typeof WeakMap) return null;
          var t = new WeakMap();
          return (
            (o = function () {
              return t;
            }),
            t
          );
        }
        function e(t) {
          if (t && t.__esModule) return t;
          if (null === t || ("object" != typeof t && "function" != typeof t))
            return { default: t };
          var r = o();
          if (r && r.has(t)) return r.get(t);
          var e = {},
            n = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var i in t)
            if (Object.prototype.hasOwnProperty.call(t, i)) {
              var p = n ? Object.getOwnPropertyDescriptor(t, i) : null;
              p && (p.get || p.set)
                ? Object.defineProperty(e, i, p)
                : (e[i] = t[i]);
            }
          return (e.default = t), r && r.set(t, e), e;
        }
        var n =
            /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+))?@)([\w\.-]+)(?::(\d+))?\/(.+)/,
          i = "Invalid Dsn",
          p = (function () {
            function o(t) {
              "string" == typeof t
                ? this._fromString(t)
                : this._fromComponents(t),
                this._validate();
            }
            return (
              (o.prototype.toString = function (t) {
                void 0 === t && (t = !1);
                var r = this,
                  o = r.host,
                  e = r.path,
                  n = r.pass,
                  i = r.port,
                  p = r.projectId;
                return (
                  r.protocol +
                  "://" +
                  r.user +
                  (t && n ? ":" + n : "") +
                  "@" +
                  o +
                  (i ? ":" + i : "") +
                  "/" +
                  (e ? e + "/" : e) +
                  p
                );
              }),
              (o.prototype._fromString = function (o) {
                var e = n.exec(o);
                if (!e) throw new r.SentryError(i);
                var p = t.__read(e.slice(1), 6),
                  s = p[0],
                  c = p[1],
                  a = p[2],
                  f = void 0 === a ? "" : a,
                  u = p[3],
                  h = p[4],
                  l = void 0 === h ? "" : h,
                  d = "",
                  v = p[5],
                  y = v.split("/");
                y.length > 1 && ((d = y.slice(0, -1).join("/")), (v = y.pop())),
                  this._fromComponents({
                    host: u,
                    pass: f,
                    path: d,
                    projectId: v,
                    port: l,
                    protocol: s,
                    user: c,
                  });
              }),
              (o.prototype._fromComponents = function (t) {
                (this.protocol = t.protocol),
                  (this.user = t.user),
                  (this.pass = t.pass || ""),
                  (this.host = t.host),
                  (this.port = t.port || ""),
                  (this.path = t.path || ""),
                  (this.projectId = t.projectId);
              }),
              (o.prototype._validate = function () {
                var t = this;
                if (
                  (["protocol", "user", "host", "projectId"].forEach(function (
                    o
                  ) {
                    if (!t[o]) throw new r.SentryError(i);
                  }),
                  "http" !== this.protocol && "https" !== this.protocol)
                )
                  throw new r.SentryError(i);
                if (this.port && isNaN(parseInt(this.port, 10)))
                  throw new r.SentryError(i);
              }),
              o
            );
          })();
        exports.Dsn = p;
      },
      { tslib: "xgwM", "./error": "P4t4" },
    ],
    xT4Q: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var e = require("./async");
        Object.keys(e).forEach(function (r) {
          "default" !== r &&
            "__esModule" !== r &&
            Object.defineProperty(exports, r, {
              enumerable: !0,
              get: function () {
                return e[r];
              },
            });
        });
        var r = require("./error");
        Object.keys(r).forEach(function (e) {
          "default" !== e &&
            "__esModule" !== e &&
            Object.defineProperty(exports, e, {
              enumerable: !0,
              get: function () {
                return r[e];
              },
            });
        });
        var t = require("./is");
        Object.keys(t).forEach(function (e) {
          "default" !== e &&
            "__esModule" !== e &&
            Object.defineProperty(exports, e, {
              enumerable: !0,
              get: function () {
                return t[e];
              },
            });
        });
        var n = require("./logger");
        Object.keys(n).forEach(function (e) {
          "default" !== e &&
            "__esModule" !== e &&
            Object.defineProperty(exports, e, {
              enumerable: !0,
              get: function () {
                return n[e];
              },
            });
        });
        var u = require("./memo");
        Object.keys(u).forEach(function (e) {
          "default" !== e &&
            "__esModule" !== e &&
            Object.defineProperty(exports, e, {
              enumerable: !0,
              get: function () {
                return u[e];
              },
            });
        });
        var o = require("./misc");
        Object.keys(o).forEach(function (e) {
          "default" !== e &&
            "__esModule" !== e &&
            Object.defineProperty(exports, e, {
              enumerable: !0,
              get: function () {
                return o[e];
              },
            });
        });
        var c = require("./object");
        Object.keys(c).forEach(function (e) {
          "default" !== e &&
            "__esModule" !== e &&
            Object.defineProperty(exports, e, {
              enumerable: !0,
              get: function () {
                return c[e];
              },
            });
        });
        var f = require("./path");
        Object.keys(f).forEach(function (e) {
          "default" !== e &&
            "__esModule" !== e &&
            Object.defineProperty(exports, e, {
              enumerable: !0,
              get: function () {
                return f[e];
              },
            });
        });
        var i = require("./promisebuffer");
        Object.keys(i).forEach(function (e) {
          "default" !== e &&
            "__esModule" !== e &&
            Object.defineProperty(exports, e, {
              enumerable: !0,
              get: function () {
                return i[e];
              },
            });
        });
        var a = require("./string");
        Object.keys(a).forEach(function (e) {
          "default" !== e &&
            "__esModule" !== e &&
            Object.defineProperty(exports, e, {
              enumerable: !0,
              get: function () {
                return a[e];
              },
            });
        });
        var s = require("./supports");
        Object.keys(s).forEach(function (e) {
          "default" !== e &&
            "__esModule" !== e &&
            Object.defineProperty(exports, e, {
              enumerable: !0,
              get: function () {
                return s[e];
              },
            });
        });
        var b = require("./syncpromise");
        Object.keys(b).forEach(function (e) {
          "default" !== e &&
            "__esModule" !== e &&
            Object.defineProperty(exports, e, {
              enumerable: !0,
              get: function () {
                return b[e];
              },
            });
        });
        var d = require("./instrument");
        Object.keys(d).forEach(function (e) {
          "default" !== e &&
            "__esModule" !== e &&
            Object.defineProperty(exports, e, {
              enumerable: !0,
              get: function () {
                return d[e];
              },
            });
        });
        var l = require("./dsn");
        Object.keys(l).forEach(function (e) {
          "default" !== e &&
            "__esModule" !== e &&
            Object.defineProperty(exports, e, {
              enumerable: !0,
              get: function () {
                return l[e];
              },
            });
        });
      },
      {
        "./async": "ExDe",
        "./error": "P4t4",
        "./is": "d4dZ",
        "./logger": "SIj1",
        "./memo": "Ux8H",
        "./misc": "IA54",
        "./object": "k9SW",
        "./path": "dFOy",
        "./promisebuffer": "bJFw",
        "./string": "mjKZ",
        "./supports": "GdPa",
        "./syncpromise": "cztX",
        "./instrument": "s5o0",
        "./dsn": "fYbB",
      },
    ],
    IYzB: [
      function (require, module, exports) {
        var global = arguments[3];
        var t = arguments[3];
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.addGlobalEventProcessor = _),
          (exports.Scope = void 0);
        var e = n(require("tslib")),
          s = require("@sentry/utils");
        function r() {
          if ("function" != typeof WeakMap) return null;
          var t = new WeakMap();
          return (
            (r = function () {
              return t;
            }),
            t
          );
        }
        function n(t) {
          if (t && t.__esModule) return t;
          if (null === t || ("object" != typeof t && "function" != typeof t))
            return { default: t };
          var e = r();
          if (e && e.has(t)) return e.get(t);
          var s = {},
            n = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var i in t)
            if (Object.prototype.hasOwnProperty.call(t, i)) {
              var o = n ? Object.getOwnPropertyDescriptor(t, i) : null;
              o && (o.get || o.set)
                ? Object.defineProperty(s, i, o)
                : (s[i] = t[i]);
            }
          return (s.default = t), e && e.set(t, s), s;
        }
        var i = (function () {
          function t() {
            (this._notifyingListeners = !1),
              (this._scopeListeners = []),
              (this._eventProcessors = []),
              (this._breadcrumbs = []),
              (this._user = {}),
              (this._tags = {}),
              (this._extra = {}),
              (this._context = {});
          }
          return (
            (t.prototype.addScopeListener = function (t) {
              this._scopeListeners.push(t);
            }),
            (t.prototype.addEventProcessor = function (t) {
              return this._eventProcessors.push(t), this;
            }),
            (t.prototype._notifyScopeListeners = function () {
              var t = this;
              this._notifyingListeners ||
                ((this._notifyingListeners = !0),
                setTimeout(function () {
                  t._scopeListeners.forEach(function (e) {
                    e(t);
                  }),
                    (t._notifyingListeners = !1);
                }));
            }),
            (t.prototype._notifyEventProcessors = function (t, r, n, i) {
              var o = this;
              return (
                void 0 === i && (i = 0),
                new s.SyncPromise(function (_, a) {
                  var c = t[i];
                  if (null === r || "function" != typeof c) _(r);
                  else {
                    var p = c(e.__assign({}, r), n);
                    (0, s.isThenable)(p)
                      ? p
                          .then(function (e) {
                            return o
                              ._notifyEventProcessors(t, e, n, i + 1)
                              .then(_);
                          })
                          .then(null, a)
                      : o
                          ._notifyEventProcessors(t, p, n, i + 1)
                          .then(_)
                          .then(null, a);
                  }
                })
              );
            }),
            (t.prototype.setUser = function (t) {
              return (this._user = t || {}), this._notifyScopeListeners(), this;
            }),
            (t.prototype.setTags = function (t) {
              return (
                (this._tags = e.__assign({}, this._tags, t)),
                this._notifyScopeListeners(),
                this
              );
            }),
            (t.prototype.setTag = function (t, s) {
              var r;
              return (
                (this._tags = e.__assign(
                  {},
                  this._tags,
                  (((r = {})[t] = s), r)
                )),
                this._notifyScopeListeners(),
                this
              );
            }),
            (t.prototype.setExtras = function (t) {
              return (
                (this._extra = e.__assign({}, this._extra, t)),
                this._notifyScopeListeners(),
                this
              );
            }),
            (t.prototype.setExtra = function (t, s) {
              var r;
              return (
                (this._extra = e.__assign(
                  {},
                  this._extra,
                  (((r = {})[t] = s), r)
                )),
                this._notifyScopeListeners(),
                this
              );
            }),
            (t.prototype.setFingerprint = function (t) {
              return (
                (this._fingerprint = t), this._notifyScopeListeners(), this
              );
            }),
            (t.prototype.setLevel = function (t) {
              return (this._level = t), this._notifyScopeListeners(), this;
            }),
            (t.prototype.setTransaction = function (t) {
              return (
                (this._transaction = t),
                this._span && (this._span.transaction = t),
                this._notifyScopeListeners(),
                this
              );
            }),
            (t.prototype.setContext = function (t, s) {
              var r;
              return (
                (this._context = e.__assign(
                  {},
                  this._context,
                  (((r = {})[t] = s), r)
                )),
                this._notifyScopeListeners(),
                this
              );
            }),
            (t.prototype.setSpan = function (t) {
              return (this._span = t), this._notifyScopeListeners(), this;
            }),
            (t.prototype.getSpan = function () {
              return this._span;
            }),
            (t.clone = function (s) {
              var r = new t();
              return (
                s &&
                  ((r._breadcrumbs = e.__spread(s._breadcrumbs)),
                  (r._tags = e.__assign({}, s._tags)),
                  (r._extra = e.__assign({}, s._extra)),
                  (r._context = e.__assign({}, s._context)),
                  (r._user = s._user),
                  (r._level = s._level),
                  (r._span = s._span),
                  (r._transaction = s._transaction),
                  (r._fingerprint = s._fingerprint),
                  (r._eventProcessors = e.__spread(s._eventProcessors))),
                r
              );
            }),
            (t.prototype.clear = function () {
              return (
                (this._breadcrumbs = []),
                (this._tags = {}),
                (this._extra = {}),
                (this._user = {}),
                (this._context = {}),
                (this._level = void 0),
                (this._transaction = void 0),
                (this._fingerprint = void 0),
                (this._span = void 0),
                this._notifyScopeListeners(),
                this
              );
            }),
            (t.prototype.addBreadcrumb = function (t, r) {
              var n = e.__assign({ timestamp: (0, s.timestampWithMs)() }, t);
              return (
                (this._breadcrumbs =
                  void 0 !== r && r >= 0
                    ? e.__spread(this._breadcrumbs, [n]).slice(-r)
                    : e.__spread(this._breadcrumbs, [n])),
                this._notifyScopeListeners(),
                this
              );
            }),
            (t.prototype.clearBreadcrumbs = function () {
              return (
                (this._breadcrumbs = []), this._notifyScopeListeners(), this
              );
            }),
            (t.prototype._applyFingerprint = function (t) {
              (t.fingerprint = t.fingerprint
                ? Array.isArray(t.fingerprint)
                  ? t.fingerprint
                  : [t.fingerprint]
                : []),
                this._fingerprint &&
                  (t.fingerprint = t.fingerprint.concat(this._fingerprint)),
                t.fingerprint && !t.fingerprint.length && delete t.fingerprint;
            }),
            (t.prototype.applyToEvent = function (t, s) {
              return (
                this._extra &&
                  Object.keys(this._extra).length &&
                  (t.extra = e.__assign({}, this._extra, t.extra)),
                this._tags &&
                  Object.keys(this._tags).length &&
                  (t.tags = e.__assign({}, this._tags, t.tags)),
                this._user &&
                  Object.keys(this._user).length &&
                  (t.user = e.__assign({}, this._user, t.user)),
                this._context &&
                  Object.keys(this._context).length &&
                  (t.contexts = e.__assign({}, this._context, t.contexts)),
                this._level && (t.level = this._level),
                this._transaction && (t.transaction = this._transaction),
                this._span &&
                  (t.contexts = e.__assign(
                    { trace: this._span.getTraceContext() },
                    t.contexts
                  )),
                this._applyFingerprint(t),
                (t.breadcrumbs = e.__spread(
                  t.breadcrumbs || [],
                  this._breadcrumbs
                )),
                (t.breadcrumbs =
                  t.breadcrumbs.length > 0 ? t.breadcrumbs : void 0),
                this._notifyEventProcessors(
                  e.__spread(o(), this._eventProcessors),
                  t,
                  s
                )
              );
            }),
            t
          );
        })();
        function o() {
          var t = (0, s.getGlobalObject)();
          return (
            (t.__SENTRY__ = t.__SENTRY__ || {}),
            (t.__SENTRY__.globalEventProcessors =
              t.__SENTRY__.globalEventProcessors || []),
            t.__SENTRY__.globalEventProcessors
          );
        }
        function _(t) {
          o().push(t);
        }
        exports.Scope = i;
      },
      { tslib: "xgwM", "@sentry/utils": "xT4Q" },
    ],
    E3cz: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.getMainCarrier = a),
          (exports.makeMain = u),
          (exports.getCurrentHub = _),
          (exports.getHubFromCarrier = f),
          (exports.setHubOnCarrier = v),
          (exports.Hub = exports.API_VERSION = void 0);
        var t = o(require("tslib")),
          e = require("@sentry/utils"),
          n = require("./scope");
        function r() {
          if ("function" != typeof WeakMap) return null;
          var t = new WeakMap();
          return (
            (r = function () {
              return t;
            }),
            t
          );
        }
        function o(t) {
          if (t && t.__esModule) return t;
          if (null === t || ("object" != typeof t && "function" != typeof t))
            return { default: t };
          var e = r();
          if (e && e.has(t)) return e.get(t);
          var n = {},
            o = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var i in t)
            if (Object.prototype.hasOwnProperty.call(t, i)) {
              var s = o ? Object.getOwnPropertyDescriptor(t, i) : null;
              s && (s.get || s.set)
                ? Object.defineProperty(n, i, s)
                : (n[i] = t[i]);
            }
          return (n.default = t), e && e.set(t, n), n;
        }
        var i = 3;
        exports.API_VERSION = i;
        var s = 100,
          c = 100,
          p = (function () {
            function r(t, e, r) {
              void 0 === e && (e = new n.Scope()),
                void 0 === r && (r = i),
                (this._version = r),
                (this._stack = []),
                this._stack.push({ client: t, scope: e });
            }
            return (
              (r.prototype._invokeClient = function (e) {
                for (var n, r = [], o = 1; o < arguments.length; o++)
                  r[o - 1] = arguments[o];
                var i = this.getStackTop();
                i &&
                  i.client &&
                  i.client[e] &&
                  (n = i.client)[e].apply(n, t.__spread(r, [i.scope]));
              }),
              (r.prototype.isOlderThan = function (t) {
                return this._version < t;
              }),
              (r.prototype.bindClient = function (t) {
                (this.getStackTop().client = t),
                  t && t.setupIntegrations && t.setupIntegrations();
              }),
              (r.prototype.pushScope = function () {
                var t = this.getStack(),
                  e = t.length > 0 ? t[t.length - 1].scope : void 0,
                  r = n.Scope.clone(e);
                return (
                  this.getStack().push({ client: this.getClient(), scope: r }),
                  r
                );
              }),
              (r.prototype.popScope = function () {
                return void 0 !== this.getStack().pop();
              }),
              (r.prototype.withScope = function (t) {
                var e = this.pushScope();
                try {
                  t(e);
                } finally {
                  this.popScope();
                }
              }),
              (r.prototype.getClient = function () {
                return this.getStackTop().client;
              }),
              (r.prototype.getScope = function () {
                return this.getStackTop().scope;
              }),
              (r.prototype.getStack = function () {
                return this._stack;
              }),
              (r.prototype.getStackTop = function () {
                return this._stack[this._stack.length - 1];
              }),
              (r.prototype.captureException = function (n, r) {
                var o = (this._lastEventId = (0, e.uuid4)()),
                  i = r;
                if (!r) {
                  var s = void 0;
                  try {
                    throw new Error("Sentry syntheticException");
                  } catch (n) {
                    s = n;
                  }
                  i = { originalException: n, syntheticException: s };
                }
                return (
                  this._invokeClient(
                    "captureException",
                    n,
                    t.__assign({}, i, { event_id: o })
                  ),
                  o
                );
              }),
              (r.prototype.captureMessage = function (n, r, o) {
                var i = (this._lastEventId = (0, e.uuid4)()),
                  s = o;
                if (!o) {
                  var c = void 0;
                  try {
                    throw new Error(n);
                  } catch (p) {
                    c = p;
                  }
                  s = { originalException: n, syntheticException: c };
                }
                return (
                  this._invokeClient(
                    "captureMessage",
                    n,
                    r,
                    t.__assign({}, s, { event_id: i })
                  ),
                  i
                );
              }),
              (r.prototype.captureEvent = function (n, r) {
                var o = (this._lastEventId = (0, e.uuid4)());
                return (
                  this._invokeClient(
                    "captureEvent",
                    n,
                    t.__assign({}, r, { event_id: o })
                  ),
                  o
                );
              }),
              (r.prototype.lastEventId = function () {
                return this._lastEventId;
              }),
              (r.prototype.addBreadcrumb = function (n, r) {
                var o = this.getStackTop();
                if (o.scope && o.client) {
                  var i = (o.client.getOptions && o.client.getOptions()) || {},
                    p = i.beforeBreadcrumb,
                    a = void 0 === p ? null : p,
                    u = i.maxBreadcrumbs,
                    _ = void 0 === u ? s : u;
                  if (!(_ <= 0)) {
                    var l = (0, e.timestampWithMs)(),
                      h = t.__assign({ timestamp: l }, n),
                      f = a
                        ? (0, e.consoleSandbox)(function () {
                            return a(h, r);
                          })
                        : h;
                    null !== f && o.scope.addBreadcrumb(f, Math.min(_, c));
                  }
                }
              }),
              (r.prototype.setUser = function (t) {
                var e = this.getStackTop();
                e.scope && e.scope.setUser(t);
              }),
              (r.prototype.setTags = function (t) {
                var e = this.getStackTop();
                e.scope && e.scope.setTags(t);
              }),
              (r.prototype.setExtras = function (t) {
                var e = this.getStackTop();
                e.scope && e.scope.setExtras(t);
              }),
              (r.prototype.setTag = function (t, e) {
                var n = this.getStackTop();
                n.scope && n.scope.setTag(t, e);
              }),
              (r.prototype.setExtra = function (t, e) {
                var n = this.getStackTop();
                n.scope && n.scope.setExtra(t, e);
              }),
              (r.prototype.setContext = function (t, e) {
                var n = this.getStackTop();
                n.scope && n.scope.setContext(t, e);
              }),
              (r.prototype.configureScope = function (t) {
                var e = this.getStackTop();
                e.scope && e.client && t(e.scope);
              }),
              (r.prototype.run = function (t) {
                var e = u(this);
                try {
                  t(this);
                } finally {
                  u(e);
                }
              }),
              (r.prototype.getIntegration = function (t) {
                var n = this.getClient();
                if (!n) return null;
                try {
                  return n.getIntegration(t);
                } catch (r) {
                  return (
                    e.logger.warn(
                      "Cannot retrieve integration " +
                        t.id +
                        " from the current Hub"
                    ),
                    null
                  );
                }
              }),
              (r.prototype.startSpan = function (t, e) {
                return (
                  void 0 === e && (e = !1),
                  this._callExtensionMethod("startSpan", t, e)
                );
              }),
              (r.prototype.traceHeaders = function () {
                return this._callExtensionMethod("traceHeaders");
              }),
              (r.prototype._callExtensionMethod = function (t) {
                for (var n = [], r = 1; r < arguments.length; r++)
                  n[r - 1] = arguments[r];
                var o = a().__SENTRY__;
                if (o && o.extensions && "function" == typeof o.extensions[t])
                  return o.extensions[t].apply(this, n);
                e.logger.warn(
                  "Extension method " + t + " couldn't be found, doing nothing."
                );
              }),
              r
            );
          })();
        function a() {
          var t = (0, e.getGlobalObject)();
          return (
            (t.__SENTRY__ = t.__SENTRY__ || { extensions: {}, hub: void 0 }), t
          );
        }
        function u(t) {
          var e = a(),
            n = f(e);
          return v(e, t), n;
        }
        function _() {
          var t = a();
          return (
            (h(t) && !f(t).isOlderThan(i)) || v(t, new p()),
            (0, e.isNodeEnv)() ? l(t) : f(t)
          );
        }
        function l(t) {
          try {
            var e = a().__SENTRY__;
            if (!e || !e.extensions || !e.extensions.domain) return f(t);
            var r = e.extensions.domain.active;
            if (!r) return f(t);
            if (!h(r) || f(r).isOlderThan(i)) {
              var o = f(t).getStackTop();
              v(r, new p(o.client, n.Scope.clone(o.scope)));
            }
            return f(r);
          } catch (s) {
            return f(t);
          }
        }
        function h(t) {
          return !!(t && t.__SENTRY__ && t.__SENTRY__.hub);
        }
        function f(t) {
          return t && t.__SENTRY__ && t.__SENTRY__.hub
            ? t.__SENTRY__.hub
            : ((t.__SENTRY__ = t.__SENTRY__ || {}),
              (t.__SENTRY__.hub = new p()),
              t.__SENTRY__.hub);
        }
        function v(t, e) {
          return (
            !!t &&
            ((t.__SENTRY__ = t.__SENTRY__ || {}), (t.__SENTRY__.hub = e), !0)
          );
        }
        exports.Hub = p;
      },
      { tslib: "xgwM", "@sentry/utils": "xT4Q", "./scope": "IYzB" },
    ],
    cypG: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          Object.defineProperty(exports, "addGlobalEventProcessor", {
            enumerable: !0,
            get: function () {
              return e.addGlobalEventProcessor;
            },
          }),
          Object.defineProperty(exports, "Scope", {
            enumerable: !0,
            get: function () {
              return e.Scope;
            },
          }),
          Object.defineProperty(exports, "getCurrentHub", {
            enumerable: !0,
            get: function () {
              return r.getCurrentHub;
            },
          }),
          Object.defineProperty(exports, "getHubFromCarrier", {
            enumerable: !0,
            get: function () {
              return r.getHubFromCarrier;
            },
          }),
          Object.defineProperty(exports, "getMainCarrier", {
            enumerable: !0,
            get: function () {
              return r.getMainCarrier;
            },
          }),
          Object.defineProperty(exports, "Hub", {
            enumerable: !0,
            get: function () {
              return r.Hub;
            },
          }),
          Object.defineProperty(exports, "makeMain", {
            enumerable: !0,
            get: function () {
              return r.makeMain;
            },
          }),
          Object.defineProperty(exports, "setHubOnCarrier", {
            enumerable: !0,
            get: function () {
              return r.setHubOnCarrier;
            },
          });
        var e = require("./scope"),
          r = require("./hub");
      },
      { "./scope": "IYzB", "./hub": "E3cz" },
    ],
    INo4: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.captureException = c),
          (exports.captureMessage = i),
          (exports.captureEvent = u),
          (exports.configureScope = p),
          (exports.addBreadcrumb = s),
          (exports.setContext = a),
          (exports.setExtras = f),
          (exports.setTags = x),
          (exports.setExtra = l),
          (exports.setTag = d),
          (exports.setUser = y),
          (exports.withScope = g),
          (exports._callOnClient = h);
        var e = n(require("tslib")),
          t = require("@sentry/hub");
        function r() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (r = function () {
              return e;
            }),
            e
          );
        }
        function n(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var t = r();
          if (t && t.has(e)) return t.get(e);
          var n = {},
            o = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var c in e)
            if (Object.prototype.hasOwnProperty.call(e, c)) {
              var i = o ? Object.getOwnPropertyDescriptor(e, c) : null;
              i && (i.get || i.set)
                ? Object.defineProperty(n, c, i)
                : (n[c] = e[c]);
            }
          return (n.default = e), t && t.set(e, n), n;
        }
        function o(r) {
          for (var n = [], o = 1; o < arguments.length; o++)
            n[o - 1] = arguments[o];
          var c = (0, t.getCurrentHub)();
          if (c && c[r]) return c[r].apply(c, e.__spread(n));
          throw new Error(
            "No hub defined or " +
              r +
              " was not found on the hub, please open a bug report."
          );
        }
        function c(e) {
          var t;
          try {
            throw new Error("Sentry syntheticException");
          } catch (e) {
            t = e;
          }
          return o("captureException", e, {
            originalException: e,
            syntheticException: t,
          });
        }
        function i(e, t) {
          var r;
          try {
            throw new Error(e);
          } catch (n) {
            r = n;
          }
          return o("captureMessage", e, t, {
            originalException: e,
            syntheticException: r,
          });
        }
        function u(e) {
          return o("captureEvent", e);
        }
        function p(e) {
          o("configureScope", e);
        }
        function s(e) {
          o("addBreadcrumb", e);
        }
        function a(e, t) {
          o("setContext", e, t);
        }
        function f(e) {
          o("setExtras", e);
        }
        function x(e) {
          o("setTags", e);
        }
        function l(e, t) {
          o("setExtra", e, t);
        }
        function d(e, t) {
          o("setTag", e, t);
        }
        function y(e) {
          o("setUser", e);
        }
        function g(e) {
          o("withScope", e);
        }
        function h(t) {
          for (var r = [], n = 1; n < arguments.length; n++)
            r[n - 1] = arguments[n];
          o.apply(void 0, e.__spread(["_invokeClient", t], r));
        }
      },
      { tslib: "xgwM", "@sentry/hub": "cypG" },
    ],
    MW7h: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.API = void 0);
        var t = require("@sentry/utils"),
          e = "7",
          n = (function () {
            function n(e) {
              (this.dsn = e), (this._dsnObject = new t.Dsn(e));
            }
            return (
              (n.prototype.getDsn = function () {
                return this._dsnObject;
              }),
              (n.prototype.getStoreEndpoint = function () {
                return "" + this._getBaseUrl() + this.getStoreEndpointPath();
              }),
              (n.prototype.getStoreEndpointWithUrlEncodedAuth = function () {
                var n = { sentry_key: this._dsnObject.user, sentry_version: e };
                return this.getStoreEndpoint() + "?" + (0, t.urlEncode)(n);
              }),
              (n.prototype._getBaseUrl = function () {
                var t = this._dsnObject,
                  e = t.protocol ? t.protocol + ":" : "",
                  n = t.port ? ":" + t.port : "";
                return e + "//" + t.host + n;
              }),
              (n.prototype.getStoreEndpointPath = function () {
                var t = this._dsnObject;
                return (
                  (t.path ? "/" + t.path : "") +
                  "/api/" +
                  t.projectId +
                  "/store/"
                );
              }),
              (n.prototype.getRequestHeaders = function (t, n) {
                var r = this._dsnObject,
                  o = ["Sentry sentry_version=" + e];
                return (
                  o.push("sentry_client=" + t + "/" + n),
                  o.push("sentry_key=" + r.user),
                  r.pass && o.push("sentry_secret=" + r.pass),
                  {
                    "Content-Type": "application/json",
                    "X-Sentry-Auth": o.join(", "),
                  }
                );
              }),
              (n.prototype.getReportDialogEndpoint = function (t) {
                void 0 === t && (t = {});
                var e = this._dsnObject,
                  n =
                    this._getBaseUrl() +
                    (e.path ? "/" + e.path : "") +
                    "/api/embed/error-page/",
                  r = [];
                for (var o in (r.push("dsn=" + e.toString()), t))
                  if ("user" === o) {
                    if (!t.user) continue;
                    t.user.name &&
                      r.push("name=" + encodeURIComponent(t.user.name)),
                      t.user.email &&
                        r.push("email=" + encodeURIComponent(t.user.email));
                  } else
                    r.push(
                      encodeURIComponent(o) + "=" + encodeURIComponent(t[o])
                    );
                return r.length ? n + "?" + r.join("&") : n;
              }),
              n
            );
          })();
        exports.API = n;
      },
      { "@sentry/utils": "xT4Q" },
    ],
    BtUH: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.getIntegrationsToSetup = i),
          (exports.setupIntegration = u),
          (exports.setupIntegrations = s),
          (exports.installedIntegrations = void 0);
        var e = a(require("tslib")),
          t = require("@sentry/hub"),
          r = require("@sentry/utils");
        function n() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (n = function () {
              return e;
            }),
            e
          );
        }
        function a(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var t = n();
          if (t && t.has(e)) return t.get(e);
          var r = {},
            a = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var o in e)
            if (Object.prototype.hasOwnProperty.call(e, o)) {
              var i = a ? Object.getOwnPropertyDescriptor(e, o) : null;
              i && (i.get || i.set)
                ? Object.defineProperty(r, o, i)
                : (r[o] = e[o]);
            }
          return (r.default = e), t && t.set(e, r), r;
        }
        var o = [];
        function i(t) {
          var r =
              (t.defaultIntegrations && e.__spread(t.defaultIntegrations)) ||
              [],
            n = t.integrations,
            a = [];
          if (Array.isArray(n)) {
            var o = n.map(function (e) {
                return e.name;
              }),
              i = [];
            r.forEach(function (e) {
              -1 === o.indexOf(e.name) &&
                -1 === i.indexOf(e.name) &&
                (a.push(e), i.push(e.name));
            }),
              n.forEach(function (e) {
                -1 === i.indexOf(e.name) && (a.push(e), i.push(e.name));
              });
          } else
            "function" == typeof n
              ? ((a = n(r)), (a = Array.isArray(a) ? a : [a]))
              : (a = e.__spread(r));
          var u = a.map(function (e) {
            return e.name;
          });
          return (
            -1 !== u.indexOf("Debug") &&
              a.push.apply(a, e.__spread(a.splice(u.indexOf("Debug"), 1))),
            a
          );
        }
        function u(e) {
          -1 === o.indexOf(e.name) &&
            (e.setupOnce(t.addGlobalEventProcessor, t.getCurrentHub),
            o.push(e.name),
            r.logger.log("Integration installed: " + e.name));
        }
        function s(e) {
          var t = {};
          return (
            i(e).forEach(function (e) {
              (t[e.name] = e), u(e);
            }),
            t
          );
        }
        exports.installedIntegrations = o;
      },
      { tslib: "xgwM", "@sentry/hub": "cypG", "@sentry/utils": "xT4Q" },
    ],
    VEq5: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.BaseClient = void 0);
        var e = i(require("tslib")),
          n = require("@sentry/utils"),
          t = require("./integration");
        function r() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (r = function () {
              return e;
            }),
            e
          );
        }
        function i(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var n = r();
          if (n && n.has(e)) return n.get(e);
          var t = {},
            i = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var o in e)
            if (Object.prototype.hasOwnProperty.call(e, o)) {
              var s = i ? Object.getOwnPropertyDescriptor(e, o) : null;
              s && (s.get || s.set)
                ? Object.defineProperty(t, o, s)
                : (t[o] = e[o]);
            }
          return (t.default = e), n && n.set(e, t), t;
        }
        var o = (function () {
          function r(e, t) {
            (this._integrations = {}),
              (this._processing = !1),
              (this._backend = new e(t)),
              (this._options = t),
              t.dsn && (this._dsn = new n.Dsn(t.dsn));
          }
          return (
            (r.prototype.captureException = function (e, t, r) {
              var i = this,
                o = t && t.event_id;
              return (
                (this._processing = !0),
                this._getBackend()
                  .eventFromException(e, t)
                  .then(function (e) {
                    return i._processEvent(e, t, r);
                  })
                  .then(function (e) {
                    (o = e && e.event_id), (i._processing = !1);
                  })
                  .then(null, function (e) {
                    n.logger.error(e), (i._processing = !1);
                  }),
                o
              );
            }),
            (r.prototype.captureMessage = function (e, t, r, i) {
              var o = this,
                s = r && r.event_id;
              return (
                (this._processing = !0),
                ((0, n.isPrimitive)(e)
                  ? this._getBackend().eventFromMessage("" + e, t, r)
                  : this._getBackend().eventFromException(e, r)
                )
                  .then(function (e) {
                    return o._processEvent(e, r, i);
                  })
                  .then(function (e) {
                    (s = e && e.event_id), (o._processing = !1);
                  })
                  .then(null, function (e) {
                    n.logger.error(e), (o._processing = !1);
                  }),
                s
              );
            }),
            (r.prototype.captureEvent = function (e, t, r) {
              var i = this,
                o = t && t.event_id;
              return (
                (this._processing = !0),
                this._processEvent(e, t, r)
                  .then(function (e) {
                    (o = e && e.event_id), (i._processing = !1);
                  })
                  .then(null, function (e) {
                    n.logger.error(e), (i._processing = !1);
                  }),
                o
              );
            }),
            (r.prototype.getDsn = function () {
              return this._dsn;
            }),
            (r.prototype.getOptions = function () {
              return this._options;
            }),
            (r.prototype.flush = function (e) {
              var n = this;
              return this._isClientProcessing(e).then(function (t) {
                return (
                  clearInterval(t.interval),
                  n
                    ._getBackend()
                    .getTransport()
                    .close(e)
                    .then(function (e) {
                      return t.ready && e;
                    })
                );
              });
            }),
            (r.prototype.close = function (e) {
              var n = this;
              return this.flush(e).then(function (e) {
                return (n.getOptions().enabled = !1), e;
              });
            }),
            (r.prototype.setupIntegrations = function () {
              this._isEnabled() &&
                (this._integrations = (0, t.setupIntegrations)(this._options));
            }),
            (r.prototype.getIntegration = function (e) {
              try {
                return this._integrations[e.id] || null;
              } catch (t) {
                return (
                  n.logger.warn(
                    "Cannot retrieve integration " +
                      e.id +
                      " from the current Client"
                  ),
                  null
                );
              }
            }),
            (r.prototype._isClientProcessing = function (e) {
              var t = this;
              return new n.SyncPromise(function (n) {
                var r = 0,
                  i = 0;
                clearInterval(i),
                  (i = setInterval(function () {
                    t._processing
                      ? ((r += 1), e && r >= e && n({ interval: i, ready: !1 }))
                      : n({ interval: i, ready: !0 });
                  }, 1));
              });
            }),
            (r.prototype._getBackend = function () {
              return this._backend;
            }),
            (r.prototype._isEnabled = function () {
              return !1 !== this.getOptions().enabled && void 0 !== this._dsn;
            }),
            (r.prototype._prepareEvent = function (t, r, i) {
              var o = this,
                s = this.getOptions(),
                a = s.environment,
                u = s.release,
                l = s.dist,
                c = s.maxValueLength,
                p = void 0 === c ? 250 : c,
                d = s.normalizeDepth,
                v = void 0 === d ? 3 : d,
                _ = e.__assign({}, t);
              void 0 === _.environment && void 0 !== a && (_.environment = a),
                void 0 === _.release && void 0 !== u && (_.release = u),
                void 0 === _.dist && void 0 !== l && (_.dist = l),
                _.message && (_.message = (0, n.truncate)(_.message, p));
              var f =
                _.exception && _.exception.values && _.exception.values[0];
              f && f.value && (f.value = (0, n.truncate)(f.value, p));
              var h = _.request;
              h && h.url && (h.url = (0, n.truncate)(h.url, p)),
                void 0 === _.event_id &&
                  (_.event_id = i && i.event_id ? i.event_id : (0, n.uuid4)()),
                this._addIntegrations(_.sdk);
              var g = n.SyncPromise.resolve(_);
              return (
                r && (g = r.applyToEvent(_, i)),
                g.then(function (e) {
                  return "number" == typeof v && v > 0
                    ? o._normalizeEvent(e, v)
                    : e;
                })
              );
            }),
            (r.prototype._normalizeEvent = function (t, r) {
              return t
                ? e.__assign(
                    {},
                    t,
                    t.breadcrumbs && {
                      breadcrumbs: t.breadcrumbs.map(function (t) {
                        return e.__assign(
                          {},
                          t,
                          t.data && { data: (0, n.normalize)(t.data, r) }
                        );
                      }),
                    },
                    t.user && { user: (0, n.normalize)(t.user, r) },
                    t.contexts && { contexts: (0, n.normalize)(t.contexts, r) },
                    t.extra && { extra: (0, n.normalize)(t.extra, r) }
                  )
                : null;
            }),
            (r.prototype._addIntegrations = function (e) {
              var n = Object.keys(this._integrations);
              e && n.length > 0 && (e.integrations = n);
            }),
            (r.prototype._processEvent = function (e, t, r) {
              var i = this,
                o = this.getOptions(),
                s = o.beforeSend,
                a = o.sampleRate;
              return this._isEnabled()
                ? "number" == typeof a && Math.random() > a
                  ? n.SyncPromise.reject(
                      "This event has been sampled, will not send event."
                    )
                  : new n.SyncPromise(function (o, a) {
                      i._prepareEvent(e, r, t)
                        .then(function (e) {
                          if (null !== e) {
                            var r = e;
                            if ((t && t.data && !0 === t.data.__sentry__) || !s)
                              return i._getBackend().sendEvent(r), void o(r);
                            var u = s(e, t);
                            if (void 0 === u)
                              n.logger.error(
                                "`beforeSend` method has to return `null` or a valid event."
                              );
                            else if ((0, n.isThenable)(u))
                              i._handleAsyncBeforeSend(u, o, a);
                            else {
                              if (null === (r = u))
                                return (
                                  n.logger.log(
                                    "`beforeSend` returned `null`, will not send event."
                                  ),
                                  void o(null)
                                );
                              i._getBackend().sendEvent(r), o(r);
                            }
                          } else a("An event processor returned null, will not send event.");
                        })
                        .then(null, function (e) {
                          i.captureException(e, {
                            data: { __sentry__: !0 },
                            originalException: e,
                          }),
                            a(
                              "Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\nReason: " +
                                e
                            );
                        });
                    })
                : n.SyncPromise.reject("SDK not enabled, will not send event.");
            }),
            (r.prototype._handleAsyncBeforeSend = function (e, n, t) {
              var r = this;
              e.then(function (e) {
                null !== e
                  ? (r._getBackend().sendEvent(e), n(e))
                  : t("`beforeSend` returned `null`, will not send event.");
              }).then(null, function (e) {
                t("beforeSend rejected with " + e);
              });
            }),
            r
          );
        })();
        exports.BaseClient = o;
      },
      { tslib: "xgwM", "@sentry/utils": "xT4Q", "./integration": "BtUH" },
    ],
    WKbc: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.NoopTransport = void 0);
        var e = require("@sentry/types"),
          r = require("@sentry/utils"),
          o = (function () {
            function o() {}
            return (
              (o.prototype.sendEvent = function (o) {
                return r.SyncPromise.resolve({
                  reason:
                    "NoopTransport: Event has been skipped because no Dsn is configured.",
                  status: e.Status.Skipped,
                });
              }),
              (o.prototype.close = function (e) {
                return r.SyncPromise.resolve(!0);
              }),
              o
            );
          })();
        exports.NoopTransport = o;
      },
      { "@sentry/types": "wTDG", "@sentry/utils": "xT4Q" },
    ],
    TDPP: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.BaseBackend = void 0);
        var t = require("@sentry/utils"),
          e = require("./transports/noop"),
          n = (function () {
            function n(e) {
              (this._options = e),
                this._options.dsn ||
                  t.logger.warn(
                    "No DSN provided, backend will not do anything."
                  ),
                (this._transport = this._setupTransport());
            }
            return (
              (n.prototype._setupTransport = function () {
                return new e.NoopTransport();
              }),
              (n.prototype.eventFromException = function (e, n) {
                throw new t.SentryError(
                  "Backend has to implement `eventFromException` method"
                );
              }),
              (n.prototype.eventFromMessage = function (e, n, r) {
                throw new t.SentryError(
                  "Backend has to implement `eventFromMessage` method"
                );
              }),
              (n.prototype.sendEvent = function (e) {
                this._transport.sendEvent(e).then(null, function (e) {
                  t.logger.error("Error while sending event: " + e);
                });
              }),
              (n.prototype.getTransport = function () {
                return this._transport;
              }),
              n
            );
          })();
        exports.BaseBackend = n;
      },
      { "@sentry/utils": "xT4Q", "./transports/noop": "WKbc" },
    ],
    h0b9: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.initAndBind = t);
        var e = require("@sentry/hub"),
          r = require("@sentry/utils");
        function t(t, n) {
          !0 === n.debug && r.logger.enable();
          var i = (0, e.getCurrentHub)(),
            u = new t(n);
          i.bindClient(u);
        }
      },
      { "@sentry/hub": "cypG", "@sentry/utils": "xT4Q" },
    ],
    iWlh: [
      function (require, module, exports) {
        "use strict";
        var t;
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.FunctionToString = void 0);
        var n = (function () {
          function n() {
            this.name = n.id;
          }
          return (
            (n.prototype.setupOnce = function () {
              (t = Function.prototype.toString),
                (Function.prototype.toString = function () {
                  for (var n = [], o = 0; o < arguments.length; o++)
                    n[o] = arguments[o];
                  var r = this.__sentry_original__ || this;
                  return t.apply(r, n);
                });
            }),
            (n.id = "FunctionToString"),
            n
          );
        })();
        exports.FunctionToString = n;
      },
      {},
    ],
    vdJ3: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.InboundFilters = void 0);
        var e = i(require("tslib")),
          t = require("@sentry/hub"),
          r = require("@sentry/utils");
        function n() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (n = function () {
              return e;
            }),
            e
          );
        }
        function i(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var t = n();
          if (t && t.has(e)) return t.get(e);
          var r = {},
            i = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var o in e)
            if (Object.prototype.hasOwnProperty.call(e, o)) {
              var s = i ? Object.getOwnPropertyDescriptor(e, o) : null;
              s && (s.get || s.set)
                ? Object.defineProperty(r, o, s)
                : (r[o] = e[o]);
            }
          return (r.default = e), t && t.set(e, r), r;
        }
        var o = [
            /^Script error\.?$/,
            /^Javascript error: Script error\.? on line 0$/,
          ],
          s = (function () {
            function n(e) {
              void 0 === e && (e = {}), (this._options = e), (this.name = n.id);
            }
            return (
              (n.prototype.setupOnce = function () {
                (0, t.addGlobalEventProcessor)(function (e) {
                  var r = (0, t.getCurrentHub)();
                  if (!r) return e;
                  var i = r.getIntegration(n);
                  if (i) {
                    var o = r.getClient(),
                      s = o ? o.getOptions() : {},
                      l = i._mergeOptions(s);
                    if (i._shouldDropEvent(e, l)) return null;
                  }
                  return e;
                });
              }),
              (n.prototype._shouldDropEvent = function (e, t) {
                return this._isSentryError(e, t)
                  ? (r.logger.warn(
                      "Event dropped due to being internal Sentry Error.\nEvent: " +
                        (0, r.getEventDescription)(e)
                    ),
                    !0)
                  : this._isIgnoredError(e, t)
                  ? (r.logger.warn(
                      "Event dropped due to being matched by `ignoreErrors` option.\nEvent: " +
                        (0, r.getEventDescription)(e)
                    ),
                    !0)
                  : this._isBlacklistedUrl(e, t)
                  ? (r.logger.warn(
                      "Event dropped due to being matched by `blacklistUrls` option.\nEvent: " +
                        (0, r.getEventDescription)(e) +
                        ".\nUrl: " +
                        this._getEventFilterUrl(e)
                    ),
                    !0)
                  : !this._isWhitelistedUrl(e, t) &&
                    (r.logger.warn(
                      "Event dropped due to not being matched by `whitelistUrls` option.\nEvent: " +
                        (0, r.getEventDescription)(e) +
                        ".\nUrl: " +
                        this._getEventFilterUrl(e)
                    ),
                    !0);
              }),
              (n.prototype._isSentryError = function (e, t) {
                if ((void 0 === t && (t = {}), !t.ignoreInternal)) return !1;
                try {
                  return (
                    (e &&
                      e.exception &&
                      e.exception.values &&
                      e.exception.values[0] &&
                      "SentryError" === e.exception.values[0].type) ||
                    !1
                  );
                } catch (r) {
                  return !1;
                }
              }),
              (n.prototype._isIgnoredError = function (e, t) {
                return (
                  void 0 === t && (t = {}),
                  !(!t.ignoreErrors || !t.ignoreErrors.length) &&
                    this._getPossibleEventMessages(e).some(function (e) {
                      return t.ignoreErrors.some(function (t) {
                        return (0, r.isMatchingPattern)(e, t);
                      });
                    })
                );
              }),
              (n.prototype._isBlacklistedUrl = function (e, t) {
                if (
                  (void 0 === t && (t = {}),
                  !t.blacklistUrls || !t.blacklistUrls.length)
                )
                  return !1;
                var n = this._getEventFilterUrl(e);
                return (
                  !!n &&
                  t.blacklistUrls.some(function (e) {
                    return (0, r.isMatchingPattern)(n, e);
                  })
                );
              }),
              (n.prototype._isWhitelistedUrl = function (e, t) {
                if (
                  (void 0 === t && (t = {}),
                  !t.whitelistUrls || !t.whitelistUrls.length)
                )
                  return !0;
                var n = this._getEventFilterUrl(e);
                return (
                  !n ||
                  t.whitelistUrls.some(function (e) {
                    return (0, r.isMatchingPattern)(n, e);
                  })
                );
              }),
              (n.prototype._mergeOptions = function (t) {
                return (
                  void 0 === t && (t = {}),
                  {
                    blacklistUrls: e.__spread(
                      this._options.blacklistUrls || [],
                      t.blacklistUrls || []
                    ),
                    ignoreErrors: e.__spread(
                      this._options.ignoreErrors || [],
                      t.ignoreErrors || [],
                      o
                    ),
                    ignoreInternal:
                      void 0 === this._options.ignoreInternal ||
                      this._options.ignoreInternal,
                    whitelistUrls: e.__spread(
                      this._options.whitelistUrls || [],
                      t.whitelistUrls || []
                    ),
                  }
                );
              }),
              (n.prototype._getPossibleEventMessages = function (e) {
                if (e.message) return [e.message];
                if (e.exception)
                  try {
                    var t = (e.exception.values && e.exception.values[0]) || {},
                      n = t.type,
                      i = void 0 === n ? "" : n,
                      o = t.value,
                      s = void 0 === o ? "" : o;
                    return ["" + s, i + ": " + s];
                  } catch (l) {
                    return (
                      r.logger.error(
                        "Cannot extract message for event " +
                          (0, r.getEventDescription)(e)
                      ),
                      []
                    );
                  }
                return [];
              }),
              (n.prototype._getEventFilterUrl = function (e) {
                try {
                  if (e.stacktrace) {
                    var t = e.stacktrace.frames;
                    return (t && t[t.length - 1].filename) || null;
                  }
                  if (e.exception) {
                    var n =
                      e.exception.values &&
                      e.exception.values[0].stacktrace &&
                      e.exception.values[0].stacktrace.frames;
                    return (n && n[n.length - 1].filename) || null;
                  }
                  return null;
                } catch (i) {
                  return (
                    r.logger.error(
                      "Cannot extract url for event " +
                        (0, r.getEventDescription)(e)
                    ),
                    null
                  );
                }
              }),
              (n.id = "InboundFilters"),
              n
            );
          })();
        exports.InboundFilters = s;
      },
      { tslib: "xgwM", "@sentry/hub": "cypG", "@sentry/utils": "xT4Q" },
    ],
    j1LQ: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          Object.defineProperty(exports, "FunctionToString", {
            enumerable: !0,
            get: function () {
              return e.FunctionToString;
            },
          }),
          Object.defineProperty(exports, "InboundFilters", {
            enumerable: !0,
            get: function () {
              return r.InboundFilters;
            },
          });
        var e = require("./functiontostring"),
          r = require("./inboundfilters");
      },
      { "./functiontostring": "iWlh", "./inboundfilters": "vdJ3" },
    ],
    qASb: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          Object.defineProperty(exports, "addBreadcrumb", {
            enumerable: !0,
            get: function () {
              return e.addBreadcrumb;
            },
          }),
          Object.defineProperty(exports, "captureException", {
            enumerable: !0,
            get: function () {
              return e.captureException;
            },
          }),
          Object.defineProperty(exports, "captureEvent", {
            enumerable: !0,
            get: function () {
              return e.captureEvent;
            },
          }),
          Object.defineProperty(exports, "captureMessage", {
            enumerable: !0,
            get: function () {
              return e.captureMessage;
            },
          }),
          Object.defineProperty(exports, "configureScope", {
            enumerable: !0,
            get: function () {
              return e.configureScope;
            },
          }),
          Object.defineProperty(exports, "setContext", {
            enumerable: !0,
            get: function () {
              return e.setContext;
            },
          }),
          Object.defineProperty(exports, "setExtra", {
            enumerable: !0,
            get: function () {
              return e.setExtra;
            },
          }),
          Object.defineProperty(exports, "setExtras", {
            enumerable: !0,
            get: function () {
              return e.setExtras;
            },
          }),
          Object.defineProperty(exports, "setTag", {
            enumerable: !0,
            get: function () {
              return e.setTag;
            },
          }),
          Object.defineProperty(exports, "setTags", {
            enumerable: !0,
            get: function () {
              return e.setTags;
            },
          }),
          Object.defineProperty(exports, "setUser", {
            enumerable: !0,
            get: function () {
              return e.setUser;
            },
          }),
          Object.defineProperty(exports, "withScope", {
            enumerable: !0,
            get: function () {
              return e.withScope;
            },
          }),
          Object.defineProperty(exports, "addGlobalEventProcessor", {
            enumerable: !0,
            get: function () {
              return r.addGlobalEventProcessor;
            },
          }),
          Object.defineProperty(exports, "getCurrentHub", {
            enumerable: !0,
            get: function () {
              return r.getCurrentHub;
            },
          }),
          Object.defineProperty(exports, "getHubFromCarrier", {
            enumerable: !0,
            get: function () {
              return r.getHubFromCarrier;
            },
          }),
          Object.defineProperty(exports, "Hub", {
            enumerable: !0,
            get: function () {
              return r.Hub;
            },
          }),
          Object.defineProperty(exports, "Scope", {
            enumerable: !0,
            get: function () {
              return r.Scope;
            },
          }),
          Object.defineProperty(exports, "API", {
            enumerable: !0,
            get: function () {
              return t.API;
            },
          }),
          Object.defineProperty(exports, "BaseClient", {
            enumerable: !0,
            get: function () {
              return n.BaseClient;
            },
          }),
          Object.defineProperty(exports, "BaseBackend", {
            enumerable: !0,
            get: function () {
              return o.BaseBackend;
            },
          }),
          Object.defineProperty(exports, "initAndBind", {
            enumerable: !0,
            get: function () {
              return u.initAndBind;
            },
          }),
          Object.defineProperty(exports, "NoopTransport", {
            enumerable: !0,
            get: function () {
              return i.NoopTransport;
            },
          }),
          (exports.Integrations = void 0);
        var e = require("@sentry/minimal"),
          r = require("@sentry/hub"),
          t = require("./api"),
          n = require("./baseclient"),
          o = require("./basebackend"),
          u = require("./sdk"),
          i = require("./transports/noop"),
          c = a(require("./integrations"));
        function p() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (p = function () {
              return e;
            }),
            e
          );
        }
        function a(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var r = p();
          if (r && r.has(e)) return r.get(e);
          var t = {},
            n = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var o in e)
            if (Object.prototype.hasOwnProperty.call(e, o)) {
              var u = n ? Object.getOwnPropertyDescriptor(e, o) : null;
              u && (u.get || u.set)
                ? Object.defineProperty(t, o, u)
                : (t[o] = e[o]);
            }
          return (t.default = e), r && r.set(e, t), t;
        }
        exports.Integrations = c;
      },
      {
        "@sentry/minimal": "INo4",
        "@sentry/hub": "cypG",
        "./api": "MW7h",
        "./baseclient": "VEq5",
        "./basebackend": "TDPP",
        "./sdk": "h0b9",
        "./transports/noop": "WKbc",
        "./integrations": "j1LQ",
      },
    ],
    FWVh: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.computeStackTrace = i);
        var e = r(require("tslib"));
        function n() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (n = function () {
              return e;
            }),
            e
          );
        }
        function r(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var r = n();
          if (r && r.has(e)) return r.get(e);
          var t = {},
            l = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var u in e)
            if (Object.prototype.hasOwnProperty.call(e, u)) {
              var a = l ? Object.getOwnPropertyDescriptor(e, u) : null;
              a && (a.get || a.set)
                ? Object.defineProperty(t, u, a)
                : (t[u] = e[u]);
            }
          return (t.default = e), r && r.set(e, t), t;
        }
        var t = "?",
          l =
            /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
          u =
            /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:file|https?|blob|chrome|webpack|resource|moz-extension).*?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js))(?::(\d+))?(?::(\d+))?\s*$/i,
          a =
            /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
          s = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
          c = /\((\S*)(?::(\d+))(?::(\d+))\)/;
        function i(e) {
          var n = null,
            r = e && e.framesToPop;
          try {
            if ((n = f(e))) return d(n, r);
          } catch (t) {}
          try {
            if ((n = o(e))) return d(n, r);
          } catch (t) {}
          return { message: p(e), name: e && e.name, stack: [], failed: !0 };
        }
        function o(e) {
          if (!e || !e.stack) return null;
          for (
            var n, r, i, o = [], f = e.stack.split("\n"), d = 0;
            d < f.length;
            ++d
          ) {
            if ((r = l.exec(f[d]))) {
              var m = r[2] && 0 === r[2].indexOf("native");
              r[2] &&
                0 === r[2].indexOf("eval") &&
                (n = c.exec(r[2])) &&
                ((r[2] = n[1]), (r[3] = n[2]), (r[4] = n[3])),
                (i = {
                  url:
                    r[2] && 0 === r[2].indexOf("address at ")
                      ? r[2].substr("address at ".length)
                      : r[2],
                  func: r[1] || t,
                  args: m ? [r[2]] : [],
                  line: r[3] ? +r[3] : null,
                  column: r[4] ? +r[4] : null,
                });
            } else if ((r = a.exec(f[d])))
              i = {
                url: r[2],
                func: r[1] || t,
                args: [],
                line: +r[3],
                column: r[4] ? +r[4] : null,
              };
            else {
              if (!(r = u.exec(f[d]))) continue;
              r[3] && r[3].indexOf(" > eval") > -1 && (n = s.exec(r[3]))
                ? ((r[1] = r[1] || "eval"),
                  (r[3] = n[1]),
                  (r[4] = n[2]),
                  (r[5] = ""))
                : 0 !== d ||
                  r[5] ||
                  void 0 === e.columnNumber ||
                  (o[0].column = e.columnNumber + 1),
                (i = {
                  url: r[3],
                  func: r[1] || t,
                  args: r[2] ? r[2].split(",") : [],
                  line: r[4] ? +r[4] : null,
                  column: r[5] ? +r[5] : null,
                });
            }
            !i.func && i.line && (i.func = t), o.push(i);
          }
          return o.length ? { message: p(e), name: e.name, stack: o } : null;
        }
        function f(e) {
          if (!e || !e.stacktrace) return null;
          for (
            var n,
              r = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i,
              l =
                / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^\)]+))\((.*)\))? in (.*):\s*$/i,
              u = e.stacktrace.split("\n"),
              a = [],
              s = 0;
            s < u.length;
            s += 2
          ) {
            var c = null;
            (n = r.exec(u[s]))
              ? (c = {
                  url: n[2],
                  func: n[3],
                  args: [],
                  line: +n[1],
                  column: null,
                })
              : (n = l.exec(u[s])) &&
                (c = {
                  url: n[6],
                  func: n[3] || n[4],
                  args: n[5] ? n[5].split(",") : [],
                  line: +n[1],
                  column: +n[2],
                }),
              c && (!c.func && c.line && (c.func = t), a.push(c));
          }
          return a.length ? { message: p(e), name: e.name, stack: a } : null;
        }
        function d(n, r) {
          try {
            return e.__assign({}, n, { stack: n.stack.slice(r) });
          } catch (t) {
            return n;
          }
        }
        function p(e) {
          var n = e && e.message;
          return n
            ? n.error && "string" == typeof n.error.message
              ? n.error.message
              : n
            : "No error message";
        }
      },
      { tslib: "xgwM" },
    ],
    Mwho: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.exceptionFromStacktrace = n),
          (exports.eventFromPlainObject = a),
          (exports.eventFromStacktrace = c),
          (exports.prepareFramesForEvent = o);
        var e = require("@sentry/utils"),
          r = require("./tracekit"),
          t = 50;
        function n(e) {
          var r = o(e.stack),
            t = { type: e.name, value: e.message };
          return (
            r && r.length && (t.stacktrace = { frames: r }),
            void 0 === t.type &&
              "" === t.value &&
              (t.value = "Unrecoverable error caught"),
            t
          );
        }
        function a(t, n, a) {
          var c = {
            exception: {
              values: [
                {
                  type: (0, e.isEvent)(t)
                    ? t.constructor.name
                    : a
                    ? "UnhandledRejection"
                    : "Error",
                  value:
                    "Non-Error " +
                    (a ? "promise rejection" : "exception") +
                    " captured with keys: " +
                    (0, e.extractExceptionKeysForMessage)(t),
                },
              ],
            },
            extra: { __serialized__: (0, e.normalizeToSize)(t) },
          };
          if (n) {
            var i = o((0, r.computeStackTrace)(n).stack);
            c.stacktrace = { frames: i };
          }
          return c;
        }
        function c(e) {
          return { exception: { values: [n(e)] } };
        }
        function o(e) {
          if (!e || !e.length) return [];
          var r = e,
            n = r[0].func || "",
            a = r[r.length - 1].func || "";
          return (
            (-1 === n.indexOf("captureMessage") &&
              -1 === n.indexOf("captureException")) ||
              (r = r.slice(1)),
            -1 !== a.indexOf("sentryWrapped") && (r = r.slice(0, -1)),
            r
              .map(function (e) {
                return {
                  colno: null === e.column ? void 0 : e.column,
                  filename: e.url || r[0].url,
                  function: e.func || "?",
                  in_app: !0,
                  lineno: null === e.line ? void 0 : e.line,
                };
              })
              .slice(0, t)
              .reverse()
          );
        }
      },
      { "@sentry/utils": "xT4Q", "./tracekit": "FWVh" },
    ],
    mI03: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.eventFromUnknownInput = a),
          (exports.eventFromString = n);
        var e = require("@sentry/utils"),
          r = require("./parsers"),
          t = require("./tracekit");
        function a(a, i, c) {
          var o;
          if ((void 0 === c && (c = {}), (0, e.isErrorEvent)(a) && a.error))
            return (
              (a = a.error),
              (o = (0, r.eventFromStacktrace)((0, t.computeStackTrace)(a)))
            );
          if ((0, e.isDOMError)(a) || (0, e.isDOMException)(a)) {
            var s = a,
              u =
                s.name || ((0, e.isDOMError)(s) ? "DOMError" : "DOMException"),
              p = s.message ? u + ": " + s.message : u;
            return (o = n(p, i, c)), (0, e.addExceptionTypeValue)(o, p), o;
          }
          if ((0, e.isError)(a))
            return (o = (0, r.eventFromStacktrace)(
              (0, t.computeStackTrace)(a)
            ));
          if ((0, e.isPlainObject)(a) || (0, e.isEvent)(a)) {
            var v = a;
            return (
              (o = (0, r.eventFromPlainObject)(v, i, c.rejection)),
              (0, e.addExceptionMechanism)(o, { synthetic: !0 }),
              o
            );
          }
          return (
            (o = n(a, i, c)),
            (0, e.addExceptionTypeValue)(o, "" + a, void 0),
            (0, e.addExceptionMechanism)(o, { synthetic: !0 }),
            o
          );
        }
        function n(e, a, n) {
          void 0 === n && (n = {});
          var i = { message: e };
          if (n.attachStacktrace && a) {
            var c = (0, t.computeStackTrace)(a),
              o = (0, r.prepareFramesForEvent)(c.stack);
            i.stacktrace = { frames: o };
          }
          return i;
        }
      },
      { "@sentry/utils": "xT4Q", "./parsers": "Mwho", "./tracekit": "FWVh" },
    ],
    kQzH: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.BaseTransport = void 0);
        var e = require("@sentry/core"),
          t = require("@sentry/utils"),
          r = (function () {
            function r(r) {
              (this.options = r),
                (this._buffer = new t.PromiseBuffer(30)),
                (this.url = new e.API(
                  this.options.dsn
                ).getStoreEndpointWithUrlEncodedAuth());
            }
            return (
              (r.prototype.sendEvent = function (e) {
                throw new t.SentryError(
                  "Transport Class has to implement `sendEvent` method"
                );
              }),
              (r.prototype.close = function (e) {
                return this._buffer.drain(e);
              }),
              r
            );
          })();
        exports.BaseTransport = r;
      },
      { "@sentry/core": "qASb", "@sentry/utils": "xT4Q" },
    ],
    HEzP: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.FetchTransport = void 0);
        var e = i(require("tslib")),
          t = require("@sentry/types"),
          r = require("@sentry/utils"),
          n = require("./base");
        function s() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (s = function () {
              return e;
            }),
            e
          );
        }
        function i(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var t = s();
          if (t && t.has(e)) return t.get(e);
          var r = {},
            n = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var i in e)
            if (Object.prototype.hasOwnProperty.call(e, i)) {
              var o = n ? Object.getOwnPropertyDescriptor(e, i) : null;
              o && (o.get || o.set)
                ? Object.defineProperty(r, i, o)
                : (r[i] = e[i]);
            }
          return (r.default = e), t && t.set(e, r), r;
        }
        var o = (0, r.getGlobalObject)(),
          a = (function (n) {
            function s() {
              var e = (null !== n && n.apply(this, arguments)) || this;
              return (e._disabledUntil = new Date(Date.now())), e;
            }
            return (
              e.__extends(s, n),
              (s.prototype.sendEvent = function (e) {
                var n = this;
                if (new Date(Date.now()) < this._disabledUntil)
                  return Promise.reject({
                    event: e,
                    reason:
                      "Transport locked till " +
                      this._disabledUntil +
                      " due to too many requests.",
                    status: 429,
                  });
                var s = {
                  body: JSON.stringify(e),
                  method: "POST",
                  referrerPolicy: (0, r.supportsReferrerPolicy)()
                    ? "origin"
                    : "",
                };
                return (
                  void 0 !== this.options.headers &&
                    (s.headers = this.options.headers),
                  this._buffer.add(
                    new r.SyncPromise(function (e, i) {
                      o.fetch(n.url, s)
                        .then(function (s) {
                          var o = t.Status.fromHttpCode(s.status);
                          if (o !== t.Status.Success) {
                            if (o === t.Status.RateLimit) {
                              var a = Date.now();
                              (n._disabledUntil = new Date(
                                a +
                                  (0, r.parseRetryAfterHeader)(
                                    a,
                                    s.headers.get("Retry-After")
                                  )
                              )),
                                r.logger.warn(
                                  "Too many requests, backing off till: " +
                                    n._disabledUntil
                                );
                            }
                            i(s);
                          } else e({ status: o });
                        })
                        .catch(i);
                    })
                  )
                );
              }),
              s
            );
          })(n.BaseTransport);
        exports.FetchTransport = a;
      },
      {
        tslib: "xgwM",
        "@sentry/types": "wTDG",
        "@sentry/utils": "xT4Q",
        "./base": "kQzH",
      },
    ],
    GY7Q: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.XHRTransport = void 0);
        var e = a(require("tslib")),
          t = require("@sentry/types"),
          r = require("@sentry/utils"),
          n = require("./base");
        function s() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (s = function () {
              return e;
            }),
            e
          );
        }
        function a(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var t = s();
          if (t && t.has(e)) return t.get(e);
          var r = {},
            n = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var a in e)
            if (Object.prototype.hasOwnProperty.call(e, a)) {
              var o = n ? Object.getOwnPropertyDescriptor(e, a) : null;
              o && (o.get || o.set)
                ? Object.defineProperty(r, a, o)
                : (r[a] = e[a]);
            }
          return (r.default = e), t && t.set(e, r), r;
        }
        var o = (function (n) {
          function s() {
            var e = (null !== n && n.apply(this, arguments)) || this;
            return (e._disabledUntil = new Date(Date.now())), e;
          }
          return (
            e.__extends(s, n),
            (s.prototype.sendEvent = function (e) {
              var n = this;
              return new Date(Date.now()) < this._disabledUntil
                ? Promise.reject({
                    event: e,
                    reason:
                      "Transport locked till " +
                      this._disabledUntil +
                      " due to too many requests.",
                    status: 429,
                  })
                : this._buffer.add(
                    new r.SyncPromise(function (s, a) {
                      var o = new XMLHttpRequest();
                      for (var i in ((o.onreadystatechange = function () {
                        if (4 === o.readyState) {
                          var e = t.Status.fromHttpCode(o.status);
                          if (e !== t.Status.Success) {
                            if (e === t.Status.RateLimit) {
                              var i = Date.now();
                              (n._disabledUntil = new Date(
                                i +
                                  (0, r.parseRetryAfterHeader)(
                                    i,
                                    o.getResponseHeader("Retry-After")
                                  )
                              )),
                                r.logger.warn(
                                  "Too many requests, backing off till: " +
                                    n._disabledUntil
                                );
                            }
                            a(o);
                          } else s({ status: e });
                        }
                      }),
                      o.open("POST", n.url),
                      n.options.headers))
                        n.options.headers.hasOwnProperty(i) &&
                          o.setRequestHeader(i, n.options.headers[i]);
                      o.send(JSON.stringify(e));
                    })
                  );
            }),
            s
          );
        })(n.BaseTransport);
        exports.XHRTransport = o;
      },
      {
        tslib: "xgwM",
        "@sentry/types": "wTDG",
        "@sentry/utils": "xT4Q",
        "./base": "kQzH",
      },
    ],
    jSap: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          Object.defineProperty(exports, "BaseTransport", {
            enumerable: !0,
            get: function () {
              return e.BaseTransport;
            },
          }),
          Object.defineProperty(exports, "FetchTransport", {
            enumerable: !0,
            get: function () {
              return r.FetchTransport;
            },
          }),
          Object.defineProperty(exports, "XHRTransport", {
            enumerable: !0,
            get: function () {
              return t.XHRTransport;
            },
          });
        var e = require("./base"),
          r = require("./fetch"),
          t = require("./xhr");
      },
      { "./base": "kQzH", "./fetch": "HEzP", "./xhr": "GY7Q" },
    ],
    aWHJ: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.BrowserBackend = void 0);
        var e = a(require("tslib")),
          t = require("@sentry/core"),
          r = require("@sentry/types"),
          n = require("@sentry/utils"),
          o = require("./eventbuilder"),
          i = require("./transports");
        function s() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (s = function () {
              return e;
            }),
            e
          );
        }
        function a(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var t = s();
          if (t && t.has(e)) return t.get(e);
          var r = {},
            n = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var o in e)
            if (Object.prototype.hasOwnProperty.call(e, o)) {
              var i = n ? Object.getOwnPropertyDescriptor(e, o) : null;
              i && (i.get || i.set)
                ? Object.defineProperty(r, o, i)
                : (r[o] = e[o]);
            }
          return (r.default = e), t && t.set(e, r), r;
        }
        var p = (function (t) {
          function s() {
            return (null !== t && t.apply(this, arguments)) || this;
          }
          return (
            e.__extends(s, t),
            (s.prototype._setupTransport = function () {
              if (!this._options.dsn)
                return t.prototype._setupTransport.call(this);
              var r = e.__assign({}, this._options.transportOptions, {
                dsn: this._options.dsn,
              });
              return this._options.transport
                ? new this._options.transport(r)
                : (0, n.supportsFetch)()
                ? new i.FetchTransport(r)
                : new i.XHRTransport(r);
            }),
            (s.prototype.eventFromException = function (e, t) {
              var i = (t && t.syntheticException) || void 0,
                s = (0, o.eventFromUnknownInput)(e, i, {
                  attachStacktrace: this._options.attachStacktrace,
                });
              return (
                (0, n.addExceptionMechanism)(s, {
                  handled: !0,
                  type: "generic",
                }),
                (s.level = r.Severity.Error),
                t && t.event_id && (s.event_id = t.event_id),
                n.SyncPromise.resolve(s)
              );
            }),
            (s.prototype.eventFromMessage = function (e, t, i) {
              void 0 === t && (t = r.Severity.Info);
              var s = (i && i.syntheticException) || void 0,
                a = (0, o.eventFromString)(e, s, {
                  attachStacktrace: this._options.attachStacktrace,
                });
              return (
                (a.level = t),
                i && i.event_id && (a.event_id = i.event_id),
                n.SyncPromise.resolve(a)
              );
            }),
            s
          );
        })(t.BaseBackend);
        exports.BrowserBackend = p;
      },
      {
        tslib: "xgwM",
        "@sentry/core": "qASb",
        "@sentry/types": "wTDG",
        "@sentry/utils": "xT4Q",
        "./eventbuilder": "mI03",
        "./transports": "jSap",
      },
    ],
    QJF9: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SDK_VERSION = exports.SDK_NAME = void 0);
        var e = "sentry.javascript.browser";
        exports.SDK_NAME = e;
        var r = "5.15.4";
        exports.SDK_VERSION = r;
      },
      {},
    ],
    vcSM: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.BrowserClient = void 0);
        var e = s(require("tslib")),
          r = require("@sentry/core"),
          t = require("@sentry/utils"),
          o = require("./backend"),
          n = require("./version");
        function i() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (i = function () {
              return e;
            }),
            e
          );
        }
        function s(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var r = i();
          if (r && r.has(e)) return r.get(e);
          var t = {},
            o = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var n in e)
            if (Object.prototype.hasOwnProperty.call(e, n)) {
              var s = o ? Object.getOwnPropertyDescriptor(e, n) : null;
              s && (s.get || s.set)
                ? Object.defineProperty(t, n, s)
                : (t[n] = e[n]);
            }
          return (t.default = e), r && r.set(e, t), t;
        }
        var a = (function (i) {
          function s(e) {
            return (
              void 0 === e && (e = {}),
              i.call(this, o.BrowserBackend, e) || this
            );
          }
          return (
            e.__extends(s, i),
            (s.prototype._prepareEvent = function (r, t, o) {
              return (
                (r.platform = r.platform || "javascript"),
                (r.sdk = e.__assign({}, r.sdk, {
                  name: n.SDK_NAME,
                  packages: e.__spread((r.sdk && r.sdk.packages) || [], [
                    { name: "npm:@sentry/browser", version: n.SDK_VERSION },
                  ]),
                  version: n.SDK_VERSION,
                })),
                i.prototype._prepareEvent.call(this, r, t, o)
              );
            }),
            (s.prototype.showReportDialog = function (e) {
              void 0 === e && (e = {});
              var o = (0, t.getGlobalObject)().document;
              if (o)
                if (this._isEnabled()) {
                  var n = e.dsn || this.getDsn();
                  if (e.eventId)
                    if (n) {
                      var i = o.createElement("script");
                      (i.async = !0),
                        (i.src = new r.API(n).getReportDialogEndpoint(e)),
                        e.onLoad && (i.onload = e.onLoad),
                        (o.head || o.body).appendChild(i);
                    } else
                      t.logger.error(
                        "Missing `Dsn` option in showReportDialog call"
                      );
                  else
                    t.logger.error(
                      "Missing `eventId` option in showReportDialog call"
                    );
                } else
                  t.logger.error(
                    "Trying to call showReportDialog with Sentry Client is disabled"
                  );
            }),
            s
          );
        })(r.BaseClient);
        exports.BrowserClient = a;
      },
      {
        tslib: "xgwM",
        "@sentry/core": "qASb",
        "@sentry/utils": "xT4Q",
        "./backend": "aWHJ",
        "./version": "QJF9",
      },
    ],
    pEVO: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.shouldIgnoreOnError = i),
          (exports.ignoreNextOnError = p),
          (exports.wrap = u);
        var e = o(require("tslib")),
          r = require("@sentry/core"),
          t = require("@sentry/utils");
        function n() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (n = function () {
              return e;
            }),
            e
          );
        }
        function o(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var r = n();
          if (r && r.has(e)) return r.get(e);
          var t = {},
            o = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var a in e)
            if (Object.prototype.hasOwnProperty.call(e, a)) {
              var i = o ? Object.getOwnPropertyDescriptor(e, a) : null;
              i && (i.get || i.set)
                ? Object.defineProperty(t, a, i)
                : (t[a] = e[a]);
            }
          return (t.default = e), r && r.set(e, t), t;
        }
        var a = 0;
        function i() {
          return a > 0;
        }
        function p() {
          (a += 1),
            setTimeout(function () {
              a -= 1;
            });
        }
        function u(n, o, a) {
          if ((void 0 === o && (o = {}), "function" != typeof n)) return n;
          try {
            if (n.__sentry__) return n;
            if (n.__sentry_wrapped__) return n.__sentry_wrapped__;
          } catch (s) {
            return n;
          }
          var i = function () {
            var i = Array.prototype.slice.call(arguments);
            try {
              a && "function" == typeof a && a.apply(this, arguments);
              var c = i.map(function (e) {
                return u(e, o);
              });
              return n.handleEvent
                ? n.handleEvent.apply(this, c)
                : n.apply(this, c);
            } catch (s) {
              throw (
                (p(),
                (0, r.withScope)(function (n) {
                  n.addEventProcessor(function (r) {
                    var n = e.__assign({}, r);
                    return (
                      o.mechanism &&
                        ((0, t.addExceptionTypeValue)(n, void 0, void 0),
                        (0, t.addExceptionMechanism)(n, o.mechanism)),
                      (n.extra = e.__assign({}, n.extra, { arguments: i })),
                      n
                    );
                  }),
                    (0, r.captureException)(s);
                }),
                s)
              );
            }
          };
          try {
            for (var c in n)
              Object.prototype.hasOwnProperty.call(n, c) && (i[c] = n[c]);
          } catch (f) {}
          (n.prototype = n.prototype || {}),
            (i.prototype = n.prototype),
            Object.defineProperty(n, "__sentry_wrapped__", {
              enumerable: !1,
              value: i,
            }),
            Object.defineProperties(i, {
              __sentry__: { enumerable: !1, value: !0 },
              __sentry_original__: { enumerable: !1, value: n },
            });
          try {
            Object.getOwnPropertyDescriptor(i, "name").configurable &&
              Object.defineProperty(i, "name", {
                get: function () {
                  return n.name;
                },
              });
          } catch (f) {}
          return i;
        }
      },
      { tslib: "xgwM", "@sentry/core": "qASb", "@sentry/utils": "xT4Q" },
    ],
    BJDC: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.GlobalHandlers = void 0);
        var e = l(require("tslib")),
          n = require("@sentry/core"),
          t = require("@sentry/types"),
          r = require("@sentry/utils"),
          a = require("../eventbuilder"),
          o = require("../helpers");
        function i() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (i = function () {
              return e;
            }),
            e
          );
        }
        function l(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var n = i();
          if (n && n.has(e)) return n.get(e);
          var t = {},
            r = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var a in e)
            if (Object.prototype.hasOwnProperty.call(e, a)) {
              var o = r ? Object.getOwnPropertyDescriptor(e, a) : null;
              o && (o.get || o.set)
                ? Object.defineProperty(t, a, o)
                : (t[a] = e[a]);
            }
          return (t.default = e), n && n.set(e, t), t;
        }
        var c = (function () {
          function i(n) {
            (this.name = i.id),
              (this._onErrorHandlerInstalled = !1),
              (this._onUnhandledRejectionHandlerInstalled = !1),
              (this._options = e.__assign(
                { onerror: !0, onunhandledrejection: !0 },
                n
              ));
          }
          return (
            (i.prototype.setupOnce = function () {
              (Error.stackTraceLimit = 50),
                this._options.onerror &&
                  (r.logger.log("Global Handler attached: onerror"),
                  this._installGlobalOnErrorHandler()),
                this._options.onunhandledrejection &&
                  (r.logger.log(
                    "Global Handler attached: onunhandledrejection"
                  ),
                  this._installGlobalOnUnhandledRejectionHandler());
            }),
            (i.prototype._installGlobalOnErrorHandler = function () {
              var e = this;
              this._onErrorHandlerInstalled ||
                ((0, r.addInstrumentationHandler)({
                  callback: function (t) {
                    var l = t.error,
                      c = (0, n.getCurrentHub)(),
                      s = c.getIntegration(i),
                      u = l && !0 === l.__sentry_own_request__;
                    if (s && !(0, o.shouldIgnoreOnError)() && !u) {
                      var d = c.getClient(),
                        p = (0, r.isPrimitive)(l)
                          ? e._eventFromIncompleteOnError(
                              t.msg,
                              t.url,
                              t.line,
                              t.column
                            )
                          : e._enhanceEventWithInitialFrame(
                              (0, a.eventFromUnknownInput)(l, void 0, {
                                attachStacktrace:
                                  d && d.getOptions().attachStacktrace,
                                rejection: !1,
                              }),
                              t.url,
                              t.line,
                              t.column
                            );
                      (0, r.addExceptionMechanism)(p, {
                        handled: !1,
                        type: "onerror",
                      }),
                        c.captureEvent(p, { originalException: l });
                    }
                  },
                  type: "error",
                }),
                (this._onErrorHandlerInstalled = !0));
            }),
            (i.prototype._installGlobalOnUnhandledRejectionHandler =
              function () {
                var e = this;
                this._onUnhandledRejectionHandlerInstalled ||
                  ((0, r.addInstrumentationHandler)({
                    callback: function (l) {
                      var c = l;
                      try {
                        "reason" in l
                          ? (c = l.reason)
                          : "detail" in l &&
                            "reason" in l.detail &&
                            (c = l.detail.reason);
                      } catch (h) {}
                      var s = (0, n.getCurrentHub)(),
                        u = s.getIntegration(i),
                        d = c && !0 === c.__sentry_own_request__;
                      if (!u || (0, o.shouldIgnoreOnError)() || d) return !0;
                      var p = s.getClient(),
                        v = (0, r.isPrimitive)(c)
                          ? e._eventFromIncompleteRejection(c)
                          : (0, a.eventFromUnknownInput)(c, void 0, {
                              attachStacktrace:
                                p && p.getOptions().attachStacktrace,
                              rejection: !0,
                            });
                      (v.level = t.Severity.Error),
                        (0, r.addExceptionMechanism)(v, {
                          handled: !1,
                          type: "onunhandledrejection",
                        }),
                        s.captureEvent(v, { originalException: c });
                    },
                    type: "unhandledrejection",
                  }),
                  (this._onUnhandledRejectionHandlerInstalled = !0));
              }),
            (i.prototype._eventFromIncompleteOnError = function (e, n, t, a) {
              var o,
                i = (0, r.isErrorEvent)(e) ? e.message : e;
              if ((0, r.isString)(i)) {
                var l = i.match(
                  /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i
                );
                l && ((o = l[1]), (i = l[2]));
              }
              var c = {
                exception: { values: [{ type: o || "Error", value: i }] },
              };
              return this._enhanceEventWithInitialFrame(c, n, t, a);
            }),
            (i.prototype._eventFromIncompleteRejection = function (e) {
              return {
                exception: {
                  values: [
                    {
                      type: "UnhandledRejection",
                      value:
                        "Non-Error promise rejection captured with value: " + e,
                    },
                  ],
                },
              };
            }),
            (i.prototype._enhanceEventWithInitialFrame = function (e, n, t, a) {
              (e.exception = e.exception || {}),
                (e.exception.values = e.exception.values || []),
                (e.exception.values[0] = e.exception.values[0] || {}),
                (e.exception.values[0].stacktrace =
                  e.exception.values[0].stacktrace || {}),
                (e.exception.values[0].stacktrace.frames =
                  e.exception.values[0].stacktrace.frames || []);
              var o = isNaN(parseInt(a, 10)) ? void 0 : a,
                i = isNaN(parseInt(t, 10)) ? void 0 : t,
                l =
                  (0, r.isString)(n) && n.length > 0
                    ? n
                    : (0, r.getLocationHref)();
              return (
                0 === e.exception.values[0].stacktrace.frames.length &&
                  e.exception.values[0].stacktrace.frames.push({
                    colno: o,
                    filename: l,
                    function: "?",
                    in_app: !0,
                    lineno: i,
                  }),
                e
              );
            }),
            (i.id = "GlobalHandlers"),
            i
          );
        })();
        exports.GlobalHandlers = c;
      },
      {
        tslib: "xgwM",
        "@sentry/core": "qASb",
        "@sentry/types": "wTDG",
        "@sentry/utils": "xT4Q",
        "../eventbuilder": "mI03",
        "../helpers": "pEVO",
      },
    ],
    mlIz: [
      function (require, module, exports) {
        var global = arguments[3];
        var t = arguments[3];
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.TryCatch = void 0);
        var e = require("@sentry/utils"),
          n = require("../helpers"),
          r = (function () {
            function t() {
              (this._ignoreOnError = 0), (this.name = t.id);
            }
            return (
              (t.prototype._wrapTimeFunction = function (t) {
                return function () {
                  for (var r = [], a = 0; a < arguments.length; a++)
                    r[a] = arguments[a];
                  var i = r[0];
                  return (
                    (r[0] = (0, n.wrap)(i, {
                      mechanism: {
                        data: { function: (0, e.getFunctionName)(t) },
                        handled: !0,
                        type: "instrument",
                      },
                    })),
                    t.apply(this, r)
                  );
                };
              }),
              (t.prototype._wrapRAF = function (t) {
                return function (r) {
                  return t(
                    (0, n.wrap)(r, {
                      mechanism: {
                        data: {
                          function: "requestAnimationFrame",
                          handler: (0, e.getFunctionName)(t),
                        },
                        handled: !0,
                        type: "instrument",
                      },
                    })
                  );
                };
              }),
              (t.prototype._wrapEventTarget = function (t) {
                var r = (0, e.getGlobalObject)(),
                  a = r[t] && r[t].prototype;
                a &&
                  a.hasOwnProperty &&
                  a.hasOwnProperty("addEventListener") &&
                  ((0, e.fill)(a, "addEventListener", function (r) {
                    return function (a, i, o) {
                      try {
                        "function" == typeof i.handleEvent &&
                          (i.handleEvent = (0, n.wrap)(i.handleEvent.bind(i), {
                            mechanism: {
                              data: {
                                function: "handleEvent",
                                handler: (0, e.getFunctionName)(i),
                                target: t,
                              },
                              handled: !0,
                              type: "instrument",
                            },
                          }));
                      } catch (s) {}
                      return r.call(
                        this,
                        a,
                        (0, n.wrap)(i, {
                          mechanism: {
                            data: {
                              function: "addEventListener",
                              handler: (0, e.getFunctionName)(i),
                              target: t,
                            },
                            handled: !0,
                            type: "instrument",
                          },
                        }),
                        o
                      );
                    };
                  }),
                  (0, e.fill)(a, "removeEventListener", function (t) {
                    return function (e, n, r) {
                      var a = n;
                      try {
                        a = a && (a.__sentry_wrapped__ || a);
                      } catch (i) {}
                      return t.call(this, e, a, r);
                    };
                  }));
              }),
              (t.prototype._wrapXHR = function (t) {
                return function () {
                  for (var r = [], a = 0; a < arguments.length; a++)
                    r[a] = arguments[a];
                  var i = this;
                  return (
                    [
                      "onload",
                      "onerror",
                      "onprogress",
                      "onreadystatechange",
                    ].forEach(function (t) {
                      t in i &&
                        "function" == typeof i[t] &&
                        (0, e.fill)(i, t, function (r) {
                          var a = {
                            mechanism: {
                              data: {
                                function: t,
                                handler: (0, e.getFunctionName)(r),
                              },
                              handled: !0,
                              type: "instrument",
                            },
                          };
                          return (
                            r.__sentry_original__ &&
                              (a.mechanism.data.handler = (0,
                              e.getFunctionName)(r.__sentry_original__)),
                            (0, n.wrap)(r, a)
                          );
                        });
                    }),
                    t.apply(this, r)
                  );
                };
              }),
              (t.prototype.setupOnce = function () {
                this._ignoreOnError = this._ignoreOnError;
                var t = (0, e.getGlobalObject)();
                (0, e.fill)(t, "setTimeout", this._wrapTimeFunction.bind(this)),
                  (0, e.fill)(
                    t,
                    "setInterval",
                    this._wrapTimeFunction.bind(this)
                  ),
                  (0, e.fill)(
                    t,
                    "requestAnimationFrame",
                    this._wrapRAF.bind(this)
                  ),
                  "XMLHttpRequest" in t &&
                    (0, e.fill)(
                      XMLHttpRequest.prototype,
                      "send",
                      this._wrapXHR.bind(this)
                    ),
                  [
                    "EventTarget",
                    "Window",
                    "Node",
                    "ApplicationCache",
                    "AudioTrackList",
                    "ChannelMergerNode",
                    "CryptoOperation",
                    "EventSource",
                    "FileReader",
                    "HTMLUnknownElement",
                    "IDBDatabase",
                    "IDBRequest",
                    "IDBTransaction",
                    "KeyOperation",
                    "MediaController",
                    "MessagePort",
                    "ModalWindow",
                    "Notification",
                    "SVGElementInstance",
                    "Screen",
                    "TextTrack",
                    "TextTrackCue",
                    "TextTrackList",
                    "WebSocket",
                    "WebSocketWorker",
                    "Worker",
                    "XMLHttpRequest",
                    "XMLHttpRequestEventTarget",
                    "XMLHttpRequestUpload",
                  ].forEach(this._wrapEventTarget.bind(this));
              }),
              (t.id = "TryCatch"),
              t
            );
          })();
        exports.TryCatch = r;
      },
      { "@sentry/utils": "xT4Q", "../helpers": "pEVO" },
    ],
    Jb5N: [
      function (require, module, exports) {
        var global = arguments[3];
        var e = arguments[3];
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.Breadcrumbs = void 0);
        var r = s(require("tslib")),
          t = require("@sentry/core"),
          a = require("@sentry/types"),
          n = require("@sentry/utils");
        function o() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (o = function () {
              return e;
            }),
            e
          );
        }
        function s(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var r = o();
          if (r && r.has(e)) return r.get(e);
          var t = {},
            a = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var n in e)
            if (Object.prototype.hasOwnProperty.call(e, n)) {
              var s = a ? Object.getOwnPropertyDescriptor(e, n) : null;
              s && (s.get || s.set)
                ? Object.defineProperty(t, n, s)
                : (t[n] = e[n]);
            }
          return (t.default = e), r && r.set(e, t), t;
        }
        var i = (function () {
          function e(t) {
            (this.name = e.id),
              (this._options = r.__assign(
                {
                  console: !0,
                  dom: !0,
                  fetch: !0,
                  history: !0,
                  sentry: !0,
                  xhr: !0,
                },
                t
              ));
          }
          return (
            (e.prototype._consoleBreadcrumb = function (e) {
              var r = {
                category: "console",
                data: { arguments: e.args, logger: "console" },
                level: a.Severity.fromString(e.level),
                message: (0, n.safeJoin)(e.args, " "),
              };
              if ("assert" === e.level) {
                if (!1 !== e.args[0]) return;
                (r.message =
                  "Assertion failed: " +
                  ((0, n.safeJoin)(e.args.slice(1), " ") || "console.assert")),
                  (r.data.arguments = e.args.slice(1));
              }
              (0, t.getCurrentHub)().addBreadcrumb(r, {
                input: e.args,
                level: e.level,
              });
            }),
            (e.prototype._domBreadcrumb = function (e) {
              var r;
              try {
                r = e.event.target
                  ? (0, n.htmlTreeAsString)(e.event.target)
                  : (0, n.htmlTreeAsString)(e.event);
              } catch (a) {
                r = "<unknown>";
              }
              0 !== r.length &&
                (0, t.getCurrentHub)().addBreadcrumb(
                  { category: "ui." + e.name, message: r },
                  { event: e.event, name: e.name }
                );
            }),
            (e.prototype._xhrBreadcrumb = function (e) {
              if (e.endTimestamp) {
                if (e.xhr.__sentry_own_request__) return;
                (0, t.getCurrentHub)().addBreadcrumb(
                  { category: "xhr", data: e.xhr.__sentry_xhr__, type: "http" },
                  { xhr: e.xhr }
                );
              } else
                this._options.sentry &&
                  e.xhr.__sentry_own_request__ &&
                  c(e.args[0]);
            }),
            (e.prototype._fetchBreadcrumb = function (e) {
              if (e.endTimestamp) {
                var n = (0, t.getCurrentHub)().getClient(),
                  o = n && n.getDsn();
                if (this._options.sentry && o) {
                  var s = new t.API(o).getStoreEndpoint();
                  if (
                    s &&
                    -1 !== e.fetchData.url.indexOf(s) &&
                    "POST" === e.fetchData.method &&
                    e.args[1] &&
                    e.args[1].body
                  )
                    return void c(e.args[1].body);
                }
                e.error
                  ? (0, t.getCurrentHub)().addBreadcrumb(
                      {
                        category: "fetch",
                        data: r.__assign({}, e.fetchData, {
                          status_code: e.response.status,
                        }),
                        level: a.Severity.Error,
                        type: "http",
                      },
                      { data: e.error, input: e.args }
                    )
                  : (0, t.getCurrentHub)().addBreadcrumb(
                      {
                        category: "fetch",
                        data: r.__assign({}, e.fetchData, {
                          status_code: e.response.status,
                        }),
                        type: "http",
                      },
                      { input: e.args, response: e.response }
                    );
              }
            }),
            (e.prototype._historyBreadcrumb = function (e) {
              var r = (0, n.getGlobalObject)(),
                a = e.from,
                o = e.to,
                s = (0, n.parseUrl)(r.location.href),
                i = (0, n.parseUrl)(a),
                c = (0, n.parseUrl)(o);
              i.path || (i = s),
                s.protocol === c.protocol &&
                  s.host === c.host &&
                  (o = c.relative),
                s.protocol === i.protocol &&
                  s.host === i.host &&
                  (a = i.relative),
                (0, t.getCurrentHub)().addBreadcrumb({
                  category: "navigation",
                  data: { from: a, to: o },
                });
            }),
            (e.prototype.setupOnce = function () {
              var e = this;
              this._options.console &&
                (0, n.addInstrumentationHandler)({
                  callback: function () {
                    for (var t = [], a = 0; a < arguments.length; a++)
                      t[a] = arguments[a];
                    e._consoleBreadcrumb.apply(e, r.__spread(t));
                  },
                  type: "console",
                }),
                this._options.dom &&
                  (0, n.addInstrumentationHandler)({
                    callback: function () {
                      for (var t = [], a = 0; a < arguments.length; a++)
                        t[a] = arguments[a];
                      e._domBreadcrumb.apply(e, r.__spread(t));
                    },
                    type: "dom",
                  }),
                this._options.xhr &&
                  (0, n.addInstrumentationHandler)({
                    callback: function () {
                      for (var t = [], a = 0; a < arguments.length; a++)
                        t[a] = arguments[a];
                      e._xhrBreadcrumb.apply(e, r.__spread(t));
                    },
                    type: "xhr",
                  }),
                this._options.fetch &&
                  (0, n.addInstrumentationHandler)({
                    callback: function () {
                      for (var t = [], a = 0; a < arguments.length; a++)
                        t[a] = arguments[a];
                      e._fetchBreadcrumb.apply(e, r.__spread(t));
                    },
                    type: "fetch",
                  }),
                this._options.history &&
                  (0, n.addInstrumentationHandler)({
                    callback: function () {
                      for (var t = [], a = 0; a < arguments.length; a++)
                        t[a] = arguments[a];
                      e._historyBreadcrumb.apply(e, r.__spread(t));
                    },
                    type: "history",
                  });
            }),
            (e.id = "Breadcrumbs"),
            e
          );
        })();
        function c(e) {
          try {
            var r = JSON.parse(e);
            (0, t.getCurrentHub)().addBreadcrumb(
              {
                category:
                  "sentry." +
                  ("transaction" === r.type ? "transaction" : "event"),
                event_id: r.event_id,
                level: r.level || a.Severity.fromString("error"),
                message: (0, n.getEventDescription)(r),
              },
              { event: r }
            );
          } catch (o) {
            n.logger.error("Error while adding sentry type breadcrumb");
          }
        }
        exports.Breadcrumbs = i;
      },
      {
        tslib: "xgwM",
        "@sentry/core": "qASb",
        "@sentry/types": "wTDG",
        "@sentry/utils": "xT4Q",
      },
    ],
    c4r3: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.LinkedErrors = void 0);
        var e = u(require("tslib")),
          r = require("@sentry/core"),
          t = require("@sentry/utils"),
          n = require("../parsers"),
          i = require("../tracekit");
        function o() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (o = function () {
              return e;
            }),
            e
          );
        }
        function u(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var r = o();
          if (r && r.has(e)) return r.get(e);
          var t = {},
            n = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var i in e)
            if (Object.prototype.hasOwnProperty.call(e, i)) {
              var u = n ? Object.getOwnPropertyDescriptor(e, i) : null;
              u && (u.get || u.set)
                ? Object.defineProperty(t, i, u)
                : (t[i] = e[i]);
            }
          return (t.default = e), r && r.set(e, t), t;
        }
        var a = "cause",
          s = 5,
          c = (function () {
            function o(e) {
              void 0 === e && (e = {}),
                (this.name = o.id),
                (this._key = e.key || a),
                (this._limit = e.limit || s);
            }
            return (
              (o.prototype.setupOnce = function () {
                (0, r.addGlobalEventProcessor)(function (e, t) {
                  var n = (0, r.getCurrentHub)().getIntegration(o);
                  return n ? n._handler(e, t) : e;
                });
              }),
              (o.prototype._handler = function (r, n) {
                if (
                  !(
                    r.exception &&
                    r.exception.values &&
                    n &&
                    (0, t.isInstanceOf)(n.originalException, Error)
                  )
                )
                  return r;
                var i = this._walkErrorTree(n.originalException, this._key);
                return (
                  (r.exception.values = e.__spread(i, r.exception.values)), r
                );
              }),
              (o.prototype._walkErrorTree = function (r, o, u) {
                if (
                  (void 0 === u && (u = []),
                  !(0, t.isInstanceOf)(r[o], Error) ||
                    u.length + 1 >= this._limit)
                )
                  return u;
                var a = (0, i.computeStackTrace)(r[o]),
                  s = (0, n.exceptionFromStacktrace)(a);
                return this._walkErrorTree(r[o], o, e.__spread([s], u));
              }),
              (o.id = "LinkedErrors"),
              o
            );
          })();
        exports.LinkedErrors = c;
      },
      {
        tslib: "xgwM",
        "@sentry/core": "qASb",
        "@sentry/utils": "xT4Q",
        "../parsers": "Mwho",
        "../tracekit": "FWVh",
      },
    ],
    Vcsf: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.UserAgent = void 0);
        var e = o(require("tslib")),
          r = require("@sentry/core"),
          t = require("@sentry/utils");
        function n() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (n = function () {
              return e;
            }),
            e
          );
        }
        function o(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var r = n();
          if (r && r.has(e)) return r.get(e);
          var t = {},
            o = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var u in e)
            if (Object.prototype.hasOwnProperty.call(e, u)) {
              var i = o ? Object.getOwnPropertyDescriptor(e, u) : null;
              i && (i.get || i.set)
                ? Object.defineProperty(t, u, i)
                : (t[u] = e[u]);
            }
          return (t.default = e), r && r.set(e, t), t;
        }
        var u = (0, t.getGlobalObject)(),
          i = (function () {
            function t() {
              this.name = t.id;
            }
            return (
              (t.prototype.setupOnce = function () {
                (0, r.addGlobalEventProcessor)(function (n) {
                  if ((0, r.getCurrentHub)().getIntegration(t)) {
                    if (!u.navigator || !u.location) return n;
                    var o = n.request || {};
                    return (
                      (o.url = o.url || u.location.href),
                      (o.headers = o.headers || {}),
                      (o.headers["User-Agent"] = u.navigator.userAgent),
                      e.__assign({}, n, { request: o })
                    );
                  }
                  return n;
                });
              }),
              (t.id = "UserAgent"),
              t
            );
          })();
        exports.UserAgent = i;
      },
      { tslib: "xgwM", "@sentry/core": "qASb", "@sentry/utils": "xT4Q" },
    ],
    vpGy: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          Object.defineProperty(exports, "GlobalHandlers", {
            enumerable: !0,
            get: function () {
              return e.GlobalHandlers;
            },
          }),
          Object.defineProperty(exports, "TryCatch", {
            enumerable: !0,
            get: function () {
              return r.TryCatch;
            },
          }),
          Object.defineProperty(exports, "Breadcrumbs", {
            enumerable: !0,
            get: function () {
              return t.Breadcrumbs;
            },
          }),
          Object.defineProperty(exports, "LinkedErrors", {
            enumerable: !0,
            get: function () {
              return n.LinkedErrors;
            },
          }),
          Object.defineProperty(exports, "UserAgent", {
            enumerable: !0,
            get: function () {
              return u.UserAgent;
            },
          });
        var e = require("./globalhandlers"),
          r = require("./trycatch"),
          t = require("./breadcrumbs"),
          n = require("./linkederrors"),
          u = require("./useragent");
      },
      {
        "./globalhandlers": "BJDC",
        "./trycatch": "mlIz",
        "./breadcrumbs": "Jb5N",
        "./linkederrors": "c4r3",
        "./useragent": "Vcsf",
      },
    ],
    Ocks: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.init = s),
          (exports.showReportDialog = u),
          (exports.lastEventId = a),
          (exports.forceLoad = l),
          (exports.onLoad = d),
          (exports.flush = c),
          (exports.close = g),
          (exports.wrap = f),
          (exports.defaultIntegrations = void 0);
        var e = require("@sentry/core"),
          t = require("@sentry/utils"),
          r = require("./client"),
          n = require("./helpers"),
          o = require("./integrations"),
          i = [
            new e.Integrations.InboundFilters(),
            new e.Integrations.FunctionToString(),
            new o.TryCatch(),
            new o.Breadcrumbs(),
            new o.GlobalHandlers(),
            new o.LinkedErrors(),
            new o.UserAgent(),
          ];
        function s(n) {
          if (
            (void 0 === n && (n = {}),
            void 0 === n.defaultIntegrations && (n.defaultIntegrations = i),
            void 0 === n.release)
          ) {
            var o = (0, t.getGlobalObject)();
            o.SENTRY_RELEASE &&
              o.SENTRY_RELEASE.id &&
              (n.release = o.SENTRY_RELEASE.id);
          }
          (0, e.initAndBind)(r.BrowserClient, n);
        }
        function u(t) {
          void 0 === t && (t = {}),
            t.eventId || (t.eventId = (0, e.getCurrentHub)().lastEventId());
          var r = (0, e.getCurrentHub)().getClient();
          r && r.showReportDialog(t);
        }
        function a() {
          return (0, e.getCurrentHub)().lastEventId();
        }
        function l() {}
        function d(e) {
          e();
        }
        function c(r) {
          var n = (0, e.getCurrentHub)().getClient();
          return n ? n.flush(r) : t.SyncPromise.reject(!1);
        }
        function g(r) {
          var n = (0, e.getCurrentHub)().getClient();
          return n ? n.close(r) : t.SyncPromise.reject(!1);
        }
        function f(e) {
          return (0, n.wrap)(e)();
        }
        exports.defaultIntegrations = i;
      },
      {
        "@sentry/core": "qASb",
        "@sentry/utils": "xT4Q",
        "./client": "vcSM",
        "./helpers": "pEVO",
        "./integrations": "vpGy",
      },
    ],
    M4Y9: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          Object.defineProperty(exports, "Severity", {
            enumerable: !0,
            get: function () {
              return e.Severity;
            },
          }),
          Object.defineProperty(exports, "Status", {
            enumerable: !0,
            get: function () {
              return e.Status;
            },
          }),
          Object.defineProperty(exports, "addGlobalEventProcessor", {
            enumerable: !0,
            get: function () {
              return t.addGlobalEventProcessor;
            },
          }),
          Object.defineProperty(exports, "addBreadcrumb", {
            enumerable: !0,
            get: function () {
              return t.addBreadcrumb;
            },
          }),
          Object.defineProperty(exports, "captureException", {
            enumerable: !0,
            get: function () {
              return t.captureException;
            },
          }),
          Object.defineProperty(exports, "captureEvent", {
            enumerable: !0,
            get: function () {
              return t.captureEvent;
            },
          }),
          Object.defineProperty(exports, "captureMessage", {
            enumerable: !0,
            get: function () {
              return t.captureMessage;
            },
          }),
          Object.defineProperty(exports, "configureScope", {
            enumerable: !0,
            get: function () {
              return t.configureScope;
            },
          }),
          Object.defineProperty(exports, "getHubFromCarrier", {
            enumerable: !0,
            get: function () {
              return t.getHubFromCarrier;
            },
          }),
          Object.defineProperty(exports, "getCurrentHub", {
            enumerable: !0,
            get: function () {
              return t.getCurrentHub;
            },
          }),
          Object.defineProperty(exports, "Hub", {
            enumerable: !0,
            get: function () {
              return t.Hub;
            },
          }),
          Object.defineProperty(exports, "Scope", {
            enumerable: !0,
            get: function () {
              return t.Scope;
            },
          }),
          Object.defineProperty(exports, "setContext", {
            enumerable: !0,
            get: function () {
              return t.setContext;
            },
          }),
          Object.defineProperty(exports, "setExtra", {
            enumerable: !0,
            get: function () {
              return t.setExtra;
            },
          }),
          Object.defineProperty(exports, "setExtras", {
            enumerable: !0,
            get: function () {
              return t.setExtras;
            },
          }),
          Object.defineProperty(exports, "setTag", {
            enumerable: !0,
            get: function () {
              return t.setTag;
            },
          }),
          Object.defineProperty(exports, "setTags", {
            enumerable: !0,
            get: function () {
              return t.setTags;
            },
          }),
          Object.defineProperty(exports, "setUser", {
            enumerable: !0,
            get: function () {
              return t.setUser;
            },
          }),
          Object.defineProperty(exports, "withScope", {
            enumerable: !0,
            get: function () {
              return t.withScope;
            },
          }),
          Object.defineProperty(exports, "BrowserClient", {
            enumerable: !0,
            get: function () {
              return r.BrowserClient;
            },
          }),
          Object.defineProperty(exports, "defaultIntegrations", {
            enumerable: !0,
            get: function () {
              return n.defaultIntegrations;
            },
          }),
          Object.defineProperty(exports, "forceLoad", {
            enumerable: !0,
            get: function () {
              return n.forceLoad;
            },
          }),
          Object.defineProperty(exports, "init", {
            enumerable: !0,
            get: function () {
              return n.init;
            },
          }),
          Object.defineProperty(exports, "lastEventId", {
            enumerable: !0,
            get: function () {
              return n.lastEventId;
            },
          }),
          Object.defineProperty(exports, "onLoad", {
            enumerable: !0,
            get: function () {
              return n.onLoad;
            },
          }),
          Object.defineProperty(exports, "showReportDialog", {
            enumerable: !0,
            get: function () {
              return n.showReportDialog;
            },
          }),
          Object.defineProperty(exports, "flush", {
            enumerable: !0,
            get: function () {
              return n.flush;
            },
          }),
          Object.defineProperty(exports, "close", {
            enumerable: !0,
            get: function () {
              return n.close;
            },
          }),
          Object.defineProperty(exports, "wrap", {
            enumerable: !0,
            get: function () {
              return n.wrap;
            },
          }),
          Object.defineProperty(exports, "SDK_NAME", {
            enumerable: !0,
            get: function () {
              return o.SDK_NAME;
            },
          }),
          Object.defineProperty(exports, "SDK_VERSION", {
            enumerable: !0,
            get: function () {
              return o.SDK_VERSION;
            },
          });
        var e = require("@sentry/types"),
          t = require("@sentry/core"),
          r = require("./client"),
          n = require("./sdk"),
          o = require("./version");
      },
      {
        "@sentry/types": "wTDG",
        "@sentry/core": "qASb",
        "./client": "vcSM",
        "./sdk": "Ocks",
        "./version": "QJF9",
      },
    ],
    WHBL: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var e = { Integrations: !0, Transports: !0 };
        exports.Transports = exports.Integrations = void 0;
        var r = u(require("tslib")),
          t = require("./exports");
        Object.keys(t).forEach(function (r) {
          "default" !== r &&
            "__esModule" !== r &&
            (Object.prototype.hasOwnProperty.call(e, r) ||
              Object.defineProperty(exports, r, {
                enumerable: !0,
                get: function () {
                  return t[r];
                },
              }));
        });
        var n = require("@sentry/core"),
          o = require("@sentry/utils"),
          s = u(require("./integrations")),
          a = u(require("./transports"));
        function i() {
          if ("function" != typeof WeakMap) return null;
          var e = new WeakMap();
          return (
            (i = function () {
              return e;
            }),
            e
          );
        }
        function u(e) {
          if (e && e.__esModule) return e;
          if (null === e || ("object" != typeof e && "function" != typeof e))
            return { default: e };
          var r = i();
          if (r && r.has(e)) return r.get(e);
          var t = {},
            n = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var o in e)
            if (Object.prototype.hasOwnProperty.call(e, o)) {
              var s = n ? Object.getOwnPropertyDescriptor(e, o) : null;
              s && (s.get || s.set)
                ? Object.defineProperty(t, o, s)
                : (t[o] = e[o]);
            }
          return (t.default = e), r && r.set(e, t), t;
        }
        exports.Transports = a;
        var p = {},
          c = (0, o.getGlobalObject)();
        c.Sentry && c.Sentry.Integrations && (p = c.Sentry.Integrations);
        var f = r.__assign({}, p, n.Integrations, s);
        exports.Integrations = f;
      },
      {
        tslib: "xgwM",
        "./exports": "M4Y9",
        "@sentry/core": "qASb",
        "@sentry/utils": "xT4Q",
        "./integrations": "vpGy",
        "./transports": "jSap",
      },
    ],
    GFX4: [
      function (require, module, exports) {
        "use strict";
        var t = r(require("./utils/Logger")),
          e = r(require("vue")),
          n = r(require("vuex")),
          o = r(require("../components/App.vue")),
          a = d(require("@sentry/browser")),
          l = r(require("./stores/DDLCModClub")),
          i = r(require("./utils/UpdateChecker"));
        function s() {
          if ("function" != typeof WeakMap) return null;
          var t = new WeakMap();
          return (
            (s = function () {
              return t;
            }),
            t
          );
        }
        function d(t) {
          if (t && t.__esModule) return t;
          if (null === t || ("object" != typeof t && "function" != typeof t))
            return { default: t };
          var e = s();
          if (e && e.has(t)) return e.get(t);
          var n = {},
            o = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var a in t)
            if (Object.prototype.hasOwnProperty.call(t, a)) {
              var l = o ? Object.getOwnPropertyDescriptor(t, a) : null;
              l && (l.get || l.set)
                ? Object.defineProperty(n, a, l)
                : (n[a] = t[a]);
            }
          return (n.default = t), e && e.set(t, n), n;
        }
        function r(t) {
          return t && t.__esModule ? t : { default: t };
        }
        e.default.use(n.default), (window.__DDMM_SENTRY__ = a);
        var m = new n.default.Store({
          state: {
            custom_background: {
              src_1: null,
              src_2: null,
              display_2: !1,
              display: !1,
            },
            tab: "ModsTab",
            background: ddmm.config.readConfigValue("background"),
            game_data: { installs: [], mods: [] },
            modals: {
              login: !1,
              install_options: !1,
              mod_options: !1,
              install_rename: !1,
              uninstall: !1,
              save_delete: !1,
              install_archive: !1,
              install_unarchive: !1,
              unarchiving: !1,
              installing: !1,
              game_running: !1,
              error: !1,
              install_category: !1,
              news: !1,
              mod_preview: !1,
              mod_delete: !1,
              issue_report: !1,
              language_switch: !1,
              install_fail: !1,
              download_starting: !1,
            },
            preloaded_install_folder: "",
            selected_install: {},
            selected_mod: "",
            install_list_selection: {
              type: "install",
              id: ddmm.config.readConfigValue("lastLaunchedInstall"),
            },
            error: { fatal: !1, stacktrace: "" },
            news_modal: { title: "", body: "" },
            news_banner: { display: !1, body: "", id: "" },
            running_install_path: null,
            rerender_key: Math.random(),
            downloads: [],
            mod_preview: {},
            install_creation_data: {
              install_name: "",
              folder_name: "",
              mod: "",
              save_option: 0,
            },
            update: "none",
          },
          mutations: {
            load_installs: function (t, e) {
              t.game_data.installs = e;
            },
            load_mods: function (t, e) {
              t.game_data.mods = e;
            },
            show_modal: function (e, n) {
              e.modals.hasOwnProperty(n.modal)
                ? (e.modals[n.modal] = !0)
                : t.default.error(
                    "Modal",
                    "Attempted to show modal that doesn't exist: " + n.modal
                  );
            },
            hide_modal: function (e, n) {
              e.modals.hasOwnProperty(n.modal)
                ? (e.modals[n.modal] = !1)
                : t.default.error(
                    "Modal",
                    "Attempted to hide modal that doesn't exist: " + n.modal
                  );
            },
            select_install: function (e, n) {
              t.default.info(
                "InstallOpts",
                "Selected install " + n.install.folderName
              ),
                (e.selected_install = n.install);
            },
            select_mod: function (e, n) {
              t.default.info("ModOpts", "Selected mod " + n.mod),
                (e.selected_mod = n.mod);
            },
            set_background: function (t, e) {
              ddmm.config.saveConfigValue("background", e), (t.background = e);
            },
            override_background: function (e, n) {
              ddmm.config.readConfigValue("modBackgrounds") &&
                (n
                  ? (t.default.info("BG", "Displaying custom background"),
                    (e.custom_background.display = !0),
                    (e.custom_background.display_2 =
                      !e.custom_background.display_2),
                    e.custom_background.display_2
                      ? (e.custom_background.src_2 = n)
                      : (e.custom_background.src_1 = n))
                  : (t.default.info("BG", "Hiding custom background"),
                    (e.custom_background.display = !1)));
            },
            installation_status: function (t, e) {
              (t.modals.installing = !!e.installing),
                (t.preloaded_install_folder = e.preloaded_install_folder);
            },
            install_list_selection: function (t, e) {
              t.install_list_selection = e;
            },
            set_running_install: function (t, e) {
              t.running_install_path = e;
            },
            error: function (t, e) {
              (t.error.fatal = e.fatal), (t.error.stacktrace = e.stacktrace);
            },
            show_news: function (t, e) {
              switch (e.style) {
                case "popup":
                  (t.news_modal.title = e.title),
                    (t.news_modal.body = e.body),
                    (t.modals.news = !0);
                  break;
                case "banner":
                  (t.news_banner.body = e.body),
                    (t.news_banner.id = e.id),
                    (t.news_banner.display = !0);
              }
            },
            hide_banner: function (t) {
              t.news_banner.display = !1;
            },
            rerender: function (t) {
              t.rerender_key = Math.random();
            },
            set_tab: function (t, e) {
              t.tab = e;
            },
            set_downloads: function (t, e) {
              t.downloads = e;
            },
            preview_mod: function (t, e) {
              (t.mod_preview = e), (t.modals.mod_preview = !0);
            },
            set_install_creation: function (t, e) {
              Object.assign(t.install_creation_data, e);
            },
            set_update_status: function (t, e) {
              t.update = e;
            },
          },
          actions: {
            install_mod: function (t, e) {
              t.commit("set_tab", "ModsTab"),
                t.commit("set_install_creation", {
                  mod_selection: e.custom ? "!custom" : e.mod,
                  mod: e.mod,
                }),
                t.commit("install_list_selection", { type: "create" });
            },
          },
          strict: "production" !== ddmm.env.NODE_ENV,
        });
        Object.assign(o.default, { store: m }),
          new e.default(o.default).$mount("#app-mount").$nextTick(function () {
            ddmm.mods.refreshInstallList(), ddmm.mods.refreshModList();
          }),
          ddmm.on("install list", function (e) {
            t.default.info(
              "Install List",
              "Got a list of " + e.length + " installs"
            ),
              m.commit("load_installs", e),
              m.state.preloaded_install_folder
                ? m.commit("install_list_selection", {
                    type: "install",
                    id: m.state.preloaded_install_folder,
                  })
                : "install" === m.state.install_list_selection.type &&
                  (e.find(function (t) {
                    return t.folderName === m.state.install_list_selection.id;
                  }) ||
                    m.commit("install_list_selection", { type: "create" })),
              m.commit("installation_status", {
                installing: !1,
                preloaded_install_folder: "",
              });
          }),
          ddmm.on("mod list", function (e) {
            t.default.info("Mod List", "Got a list of " + e.length + " mods"),
              m.commit("load_mods", e);
          }),
          ddmm.on("running cover", function (e) {
            t.default.info(
              "Game Running",
              e.display ? "Install running from " + e.folder_path : "Game ended"
            ),
              m.commit("hide_modal", { modal: "unarchiving" }),
              e.display
                ? (m.commit("set_running_install", e.folder_path),
                  m.commit("show_modal", { modal: "game_running" }))
                : m.commit("hide_modal", { modal: "game_running" });
          }),
          ddmm.on("error", function (e) {
            t.default.error(
              "Main Error",
              "An error occurred in the main process (fatal = " +
                e.fatal +
                ")\n\n" +
                e.stacktrace
            ),
              m.commit("show_modal", { modal: "error" }),
              m.commit("error", e);
          }),
          ddmm.on("got downloads", function (t) {
            m.commit("set_downloads", t);
          }),
          ddmm.on("download started", function () {
            m.commit("hide_modal", { modal: "download_starting" });
          }),
          ddmm.on("languages reloaded", function () {
            m.commit("hide_modal", { modal: "language_switch" }),
              m.commit("rerender");
          }),
          ddmm.on("update status", function (t) {
            m.commit("set_update_status", t);
          }),
          ddmm.on("show install fail warning", function (t) {
            m.commit("show_modal", { modal: "install_fail" });
          });
        var c =
          "https://raw.githubusercontent.com/DokiDokiModManager/Meta/master/news.json";
        ddmm.constants.news_disabled ||
          fetch(c)
            .then(function (t) {
              return t.json();
            })
            .then(function (t) {
              var e = [];
              localStorage.getItem("seen_news") &&
                (e = localStorage.getItem("seen_news").split(",")),
                t.news.forEach(function (t) {
                  -1 === e.indexOf(t.id) &&
                    (m.commit("show_news", t),
                    "popup" === t.style &&
                      (e.push(t.id),
                      localStorage.setItem("seen_news", e.join(","))));
                });
            }),
          ddmm.constants.auto_update_disabled || i.default.getLatest(m);
      },
      {
        "./utils/Logger": "vKp2",
        vue: "EjOG",
        vuex: "Ki8f",
        "../components/App.vue": "LUNw",
        "@sentry/browser": "WHBL",
        "./stores/DDLCModClub": "HntK",
        "./utils/UpdateChecker": "utWm",
      },
    ],
  },
  {},
  ["GFX4"],
  null
);
//# sourceMappingURL=/app.7819b175.js.map
