var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// source/F.js
var F = /* @__PURE__ */ __name(function() {
  return false;
}, "F");
var F_default = F;

// source/T.js
var T = /* @__PURE__ */ __name(function() {
  return true;
}, "T");
var T_default = T;

// source/__.js
var __default = { "@@functional/placeholder": true };

// source/internal/_isPlaceholder.js
function _isPlaceholder(a) {
  return a != null && typeof a === "object" && a["@@functional/placeholder"] === true;
}
__name(_isPlaceholder, "_isPlaceholder");

// source/internal/_curry1.js
function _curry1(fn) {
  return /* @__PURE__ */ __name(function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  }, "f1");
}
__name(_curry1, "_curry1");

// source/internal/_curry2.js
function _curry2(fn) {
  return /* @__PURE__ */ __name(function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a) ? f2 : _curry1(function(_b) {
          return fn(a, _b);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function(_a) {
          return fn(_a, b);
        }) : _isPlaceholder(b) ? _curry1(function(_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  }, "f2");
}
__name(_curry2, "_curry2");

// source/add.js
var add = _curry2(/* @__PURE__ */ __name(function add2(a, b) {
  return Number(a) + Number(b);
}, "add"));
var add_default = add;

// source/internal/_concat.js
function _concat(set1, set22) {
  set1 = set1 || [];
  set22 = set22 || [];
  var idx;
  var len1 = set1.length;
  var len2 = set22.length;
  var result = [];
  idx = 0;
  while (idx < len1) {
    result[result.length] = set1[idx];
    idx += 1;
  }
  idx = 0;
  while (idx < len2) {
    result[result.length] = set22[idx];
    idx += 1;
  }
  return result;
}
__name(_concat, "_concat");

// source/internal/_arity.js
function _arity(n, fn) {
  switch (n) {
    case 0:
      return function() {
        return fn.apply(this, arguments);
      };
    case 1:
      return function(a0) {
        return fn.apply(this, arguments);
      };
    case 2:
      return function(a0, a1) {
        return fn.apply(this, arguments);
      };
    case 3:
      return function(a0, a1, a2) {
        return fn.apply(this, arguments);
      };
    case 4:
      return function(a0, a1, a2, a3) {
        return fn.apply(this, arguments);
      };
    case 5:
      return function(a0, a1, a2, a3, a4) {
        return fn.apply(this, arguments);
      };
    case 6:
      return function(a0, a1, a2, a3, a4, a5) {
        return fn.apply(this, arguments);
      };
    case 7:
      return function(a0, a1, a2, a3, a4, a5, a6) {
        return fn.apply(this, arguments);
      };
    case 8:
      return function(a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.apply(this, arguments);
      };
    case 9:
      return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.apply(this, arguments);
      };
    case 10:
      return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.apply(this, arguments);
      };
    default:
      throw new Error("First argument to _arity must be a non-negative integer no greater than ten");
  }
}
__name(_arity, "_arity");

// source/internal/_curryN.js
function _curryN(length3, received, fn) {
  return function() {
    var combined = [];
    var argsIdx = 0;
    var left = length3;
    var combinedIdx = 0;
    var hasPlaceholder = false;
    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;
      if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }
      combined[combinedIdx] = result;
      if (!_isPlaceholder(result)) {
        left -= 1;
      } else {
        hasPlaceholder = true;
      }
      combinedIdx += 1;
    }
    return !hasPlaceholder && left <= 0 ? fn.apply(this, combined) : _arity(Math.max(0, left), _curryN(length3, combined, fn));
  };
}
__name(_curryN, "_curryN");

// source/curryN.js
var curryN = _curry2(/* @__PURE__ */ __name(function curryN2(length3, fn) {
  if (length3 === 1) {
    return _curry1(fn);
  }
  return _arity(length3, _curryN(length3, [], fn));
}, "curryN"));
var curryN_default = curryN;

// source/addIndex.js
var addIndex = _curry1(/* @__PURE__ */ __name(function addIndex2(fn) {
  return curryN_default(fn.length, function() {
    var idx = 0;
    var origFn = arguments[0];
    var list = arguments[arguments.length - 1];
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = function() {
      var result = origFn.apply(this, _concat(arguments, [idx, list]));
      idx += 1;
      return result;
    };
    return fn.apply(this, args);
  });
}, "addIndex"));
var addIndex_default = addIndex;

// source/addIndexRight.js
var addIndexRight = _curry1(/* @__PURE__ */ __name(function addIndex3(fn) {
  return curryN_default(fn.length, function() {
    var origFn = arguments[0];
    var list = arguments[arguments.length - 1];
    var idx = list.length - 1;
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = function() {
      var result = origFn.apply(this, _concat(arguments, [idx, list]));
      idx -= 1;
      return result;
    };
    return fn.apply(this, args);
  });
}, "addIndex"));
var addIndexRight_default = addIndexRight;

// source/internal/_curry3.js
function _curry3(fn) {
  return /* @__PURE__ */ __name(function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;
      case 1:
        return _isPlaceholder(a) ? f3 : _curry2(function(_b, _c) {
          return fn(a, _b, _c);
        });
      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function(_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) ? _curry2(function(_b, _c) {
          return fn(a, _b, _c);
        }) : _curry1(function(_c) {
          return fn(a, b, _c);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) {
          return fn(_a, _b, c);
        }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) {
          return fn(a, _b, _c);
        }) : _isPlaceholder(a) ? _curry1(function(_a) {
          return fn(_a, b, c);
        }) : _isPlaceholder(b) ? _curry1(function(_b) {
          return fn(a, _b, c);
        }) : _isPlaceholder(c) ? _curry1(function(_c) {
          return fn(a, b, _c);
        }) : fn(a, b, c);
    }
  }, "f3");
}
__name(_curry3, "_curry3");

// source/adjust.js
var adjust = _curry3(/* @__PURE__ */ __name(function adjust2(idx, fn, list) {
  var len = list.length;
  if (idx >= len || idx < -len) {
    return list;
  }
  var _idx = (len + idx) % len;
  var _list = _concat(list);
  _list[_idx] = fn(list[_idx]);
  return _list;
}, "adjust"));
var adjust_default = adjust;

// source/internal/_isArray.js
var isArray_default = Array.isArray || /* @__PURE__ */ __name(function _isArray(val) {
  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === "[object Array]";
}, "_isArray");

// source/internal/_isTransformer.js
function _isTransformer(obj) {
  return obj != null && typeof obj["@@transducer/step"] === "function";
}
__name(_isTransformer, "_isTransformer");

// source/internal/_dispatchable.js
function _dispatchable(methodNames, transducerCreator, fn) {
  return function() {
    if (arguments.length === 0) {
      return fn();
    }
    var obj = arguments[arguments.length - 1];
    if (!isArray_default(obj)) {
      var idx = 0;
      while (idx < methodNames.length) {
        if (typeof obj[methodNames[idx]] === "function") {
          return obj[methodNames[idx]].apply(obj, Array.prototype.slice.call(arguments, 0, -1));
        }
        idx += 1;
      }
      if (_isTransformer(obj)) {
        var transducer = transducerCreator.apply(null, Array.prototype.slice.call(arguments, 0, -1));
        return transducer(obj);
      }
    }
    return fn.apply(this, arguments);
  };
}
__name(_dispatchable, "_dispatchable");

// source/internal/_reduced.js
function _reduced(x) {
  return x && x["@@transducer/reduced"] ? x : {
    "@@transducer/value": x,
    "@@transducer/reduced": true
  };
}
__name(_reduced, "_reduced");

// source/internal/_xfBase.js
var xfBase_default = {
  init: function() {
    return this.xf["@@transducer/init"]();
  },
  result: function(result) {
    return this.xf["@@transducer/result"](result);
  }
};

// source/internal/_xall.js
function XAll(f, xf) {
  this.xf = xf;
  this.f = f;
  this.all = true;
}
__name(XAll, "XAll");
XAll.prototype["@@transducer/init"] = xfBase_default.init;
XAll.prototype["@@transducer/result"] = function(result) {
  if (this.all) {
    result = this.xf["@@transducer/step"](result, true);
  }
  return this.xf["@@transducer/result"](result);
};
XAll.prototype["@@transducer/step"] = function(result, input) {
  if (!this.f(input)) {
    this.all = false;
    result = _reduced(this.xf["@@transducer/step"](result, false));
  }
  return result;
};
function _xall(f) {
  return function(xf) {
    return new XAll(f, xf);
  };
}
__name(_xall, "_xall");

// source/all.js
var all = _curry2(_dispatchable(["all"], _xall, /* @__PURE__ */ __name(function all2(fn, list) {
  var idx = 0;
  while (idx < list.length) {
    if (!fn(list[idx])) {
      return false;
    }
    idx += 1;
  }
  return true;
}, "all")));
var all_default = all;

// source/internal/_arrayFromIterator.js
function _arrayFromIterator(iter) {
  var list = [];
  var next;
  while (!(next = iter.next()).done) {
    list.push(next.value);
  }
  return list;
}
__name(_arrayFromIterator, "_arrayFromIterator");

// source/internal/_includesWith.js
function _includesWith(pred, x, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    if (pred(x, list[idx])) {
      return true;
    }
    idx += 1;
  }
  return false;
}
__name(_includesWith, "_includesWith");

// source/internal/_functionName.js
function _functionName(f) {
  var match3 = String(f).match(/^function (\w*)/);
  return match3 == null ? "" : match3[1];
}
__name(_functionName, "_functionName");

// source/internal/_has.js
function _has(prop3, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop3);
}
__name(_has, "_has");

// source/internal/_objectIs.js
function _objectIs(a, b) {
  if (a === b) {
    return a !== 0 || 1 / a === 1 / b;
  } else {
    return a !== a && b !== b;
  }
}
__name(_objectIs, "_objectIs");
var objectIs_default = typeof Object.is === "function" ? Object.is : _objectIs;

// source/internal/_isArguments.js
var toString = Object.prototype.toString;
var _isArguments = function() {
  return toString.call(arguments) === "[object Arguments]" ? /* @__PURE__ */ __name(function _isArguments2(x) {
    return toString.call(x) === "[object Arguments]";
  }, "_isArguments") : /* @__PURE__ */ __name(function _isArguments2(x) {
    return _has("callee", x);
  }, "_isArguments");
}();
var isArguments_default = _isArguments;

// source/keys.js
var hasEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
var nonEnumerableProps = [
  "constructor",
  "valueOf",
  "isPrototypeOf",
  "toString",
  "propertyIsEnumerable",
  "hasOwnProperty",
  "toLocaleString"
];
var hasArgsEnumBug = function() {
  "use strict";
  return arguments.propertyIsEnumerable("length");
}();
var contains = /* @__PURE__ */ __name(function contains2(list, item) {
  var idx = 0;
  while (idx < list.length) {
    if (list[idx] === item) {
      return true;
    }
    idx += 1;
  }
  return false;
}, "contains");
var keys = typeof Object.keys === "function" && !hasArgsEnumBug ? _curry1(/* @__PURE__ */ __name(function keys2(obj) {
  return Object(obj) !== obj ? [] : Object.keys(obj);
}, "keys")) : _curry1(/* @__PURE__ */ __name(function keys3(obj) {
  if (Object(obj) !== obj) {
    return [];
  }
  var prop3, nIdx;
  var ks = [];
  var checkArgsLength = hasArgsEnumBug && isArguments_default(obj);
  for (prop3 in obj) {
    if (_has(prop3, obj) && (!checkArgsLength || prop3 !== "length")) {
      ks[ks.length] = prop3;
    }
  }
  if (hasEnumBug) {
    nIdx = nonEnumerableProps.length - 1;
    while (nIdx >= 0) {
      prop3 = nonEnumerableProps[nIdx];
      if (_has(prop3, obj) && !contains(ks, prop3)) {
        ks[ks.length] = prop3;
      }
      nIdx -= 1;
    }
  }
  return ks;
}, "keys"));
var keys_default = keys;

// source/type.js
var type = _curry1(/* @__PURE__ */ __name(function type2(val) {
  return val === null ? "Null" : val === void 0 ? "Undefined" : Object.prototype.toString.call(val).slice(8, -1);
}, "type"));
var type_default = type;

// source/internal/_equals.js
function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
  var a = _arrayFromIterator(aIterator);
  var b = _arrayFromIterator(bIterator);
  function eq(_a, _b) {
    return _equals(_a, _b, stackA.slice(), stackB.slice());
  }
  __name(eq, "eq");
  return !_includesWith(function(b2, aItem) {
    return !_includesWith(eq, aItem, b2);
  }, b, a);
}
__name(_uniqContentEquals, "_uniqContentEquals");
function _equals(a, b, stackA, stackB) {
  if (objectIs_default(a, b)) {
    return true;
  }
  var typeA = type_default(a);
  if (typeA !== type_default(b)) {
    return false;
  }
  if (typeof a["fantasy-land/equals"] === "function" || typeof b["fantasy-land/equals"] === "function") {
    return typeof a["fantasy-land/equals"] === "function" && a["fantasy-land/equals"](b) && typeof b["fantasy-land/equals"] === "function" && b["fantasy-land/equals"](a);
  }
  if (typeof a.equals === "function" || typeof b.equals === "function") {
    return typeof a.equals === "function" && a.equals(b) && typeof b.equals === "function" && b.equals(a);
  }
  switch (typeA) {
    case "Arguments":
    case "Array":
    case "Object":
      if (typeof a.constructor === "function" && _functionName(a.constructor) === "Promise") {
        return a === b;
      }
      break;
    case "Boolean":
    case "Number":
    case "String":
      if (!(typeof a === typeof b && objectIs_default(a.valueOf(), b.valueOf()))) {
        return false;
      }
      break;
    case "Date":
      if (!objectIs_default(a.valueOf(), b.valueOf())) {
        return false;
      }
      break;
    case "Error":
      return a.name === b.name && a.message === b.message;
    case "RegExp":
      if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
        return false;
      }
      break;
  }
  var idx = stackA.length - 1;
  while (idx >= 0) {
    if (stackA[idx] === a) {
      return stackB[idx] === b;
    }
    idx -= 1;
  }
  switch (typeA) {
    case "Map":
      if (a.size !== b.size) {
        return false;
      }
      return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));
    case "Set":
      if (a.size !== b.size) {
        return false;
      }
      return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));
    case "Arguments":
    case "Array":
    case "Object":
    case "Boolean":
    case "Number":
    case "String":
    case "Date":
    case "Error":
    case "RegExp":
    case "Int8Array":
    case "Uint8Array":
    case "Uint8ClampedArray":
    case "Int16Array":
    case "Uint16Array":
    case "Int32Array":
    case "Uint32Array":
    case "Float32Array":
    case "Float64Array":
    case "ArrayBuffer":
      break;
    default:
      return false;
  }
  var keysA = keys_default(a);
  if (keysA.length !== keys_default(b).length) {
    return false;
  }
  var extendedStackA = stackA.concat([a]);
  var extendedStackB = stackB.concat([b]);
  idx = keysA.length - 1;
  while (idx >= 0) {
    var key = keysA[idx];
    if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
      return false;
    }
    idx -= 1;
  }
  return true;
}
__name(_equals, "_equals");

// source/equals.js
var equals = _curry2(/* @__PURE__ */ __name(function equals2(a, b) {
  return _equals(a, b, [], []);
}, "equals"));
var equals_default = equals;

// source/internal/_indexOf.js
function _indexOf(list, a, idx) {
  var inf, item;
  if (typeof list.indexOf === "function") {
    switch (typeof a) {
      case "number":
        if (a === 0) {
          inf = 1 / a;
          while (idx < list.length) {
            item = list[idx];
            if (item === 0 && 1 / item === inf) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        } else if (a !== a) {
          while (idx < list.length) {
            item = list[idx];
            if (typeof item === "number" && item !== item) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        }
        return list.indexOf(a, idx);
      case "string":
      case "boolean":
      case "function":
      case "undefined":
        return list.indexOf(a, idx);
      case "object":
        if (a === null) {
          return list.indexOf(a, idx);
        }
    }
  }
  while (idx < list.length) {
    if (equals_default(list[idx], a)) {
      return idx;
    }
    idx += 1;
  }
  return -1;
}
__name(_indexOf, "_indexOf");

// source/internal/_includes.js
function _includes(a, list) {
  return _indexOf(list, a, 0) >= 0;
}
__name(_includes, "_includes");

// source/internal/_map.js
function _map(fn, functor) {
  var idx = 0;
  var len = functor.length;
  var result = Array(len);
  while (idx < len) {
    result[idx] = fn(functor[idx]);
    idx += 1;
  }
  return result;
}
__name(_map, "_map");

// source/internal/_quote.js
function _quote(s) {
  var escaped = s.replace(/\\/g, "\\\\").replace(/[\b]/g, "\\b").replace(/\f/g, "\\f").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\v/g, "\\v").replace(/\0/g, "\\0");
  return '"' + escaped.replace(/"/g, '\\"') + '"';
}
__name(_quote, "_quote");

// source/internal/_toISOString.js
var pad = /* @__PURE__ */ __name(function pad2(n) {
  return (n < 10 ? "0" : "") + n;
}, "pad");
var _toISOString = typeof Date.prototype.toISOString === "function" ? /* @__PURE__ */ __name(function _toISOString2(d) {
  return d.toISOString();
}, "_toISOString") : /* @__PURE__ */ __name(function _toISOString3(d) {
  return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + "." + (d.getUTCMilliseconds() / 1e3).toFixed(3).slice(2, 5) + "Z";
}, "_toISOString");
var toISOString_default = _toISOString;

// source/internal/_complement.js
function _complement(f) {
  return function() {
    return !f.apply(this, arguments);
  };
}
__name(_complement, "_complement");

// source/internal/_arrayReduce.js
function _arrayReduce(reducer, acc, list) {
  var index = 0;
  var length3 = list.length;
  while (index < length3) {
    acc = reducer(acc, list[index]);
    index += 1;
  }
  return acc;
}
__name(_arrayReduce, "_arrayReduce");

// source/internal/_filter.js
function _filter(fn, list) {
  var idx = 0;
  var len = list.length;
  var result = [];
  while (idx < len) {
    if (fn(list[idx])) {
      result[result.length] = list[idx];
    }
    idx += 1;
  }
  return result;
}
__name(_filter, "_filter");

// source/internal/_isObject.js
function _isObject(x) {
  return Object.prototype.toString.call(x) === "[object Object]";
}
__name(_isObject, "_isObject");

// source/internal/_xfilter.js
function XFilter(f, xf) {
  this.xf = xf;
  this.f = f;
}
__name(XFilter, "XFilter");
XFilter.prototype["@@transducer/init"] = xfBase_default.init;
XFilter.prototype["@@transducer/result"] = xfBase_default.result;
XFilter.prototype["@@transducer/step"] = function(result, input) {
  return this.f(input) ? this.xf["@@transducer/step"](result, input) : result;
};
function _xfilter(f) {
  return function(xf) {
    return new XFilter(f, xf);
  };
}
__name(_xfilter, "_xfilter");

// source/filter.js
var filter = _curry2(_dispatchable(["fantasy-land/filter", "filter"], _xfilter, function(pred, filterable) {
  return _isObject(filterable) ? _arrayReduce(function(acc, key) {
    if (pred(filterable[key])) {
      acc[key] = filterable[key];
    }
    return acc;
  }, {}, keys_default(filterable)) : (
    // else
    _filter(pred, filterable)
  );
}));
var filter_default = filter;

// source/reject.js
var reject = _curry2(/* @__PURE__ */ __name(function reject2(pred, filterable) {
  return filter_default(_complement(pred), filterable);
}, "reject"));
var reject_default = reject;

// source/internal/_toString.js
function _toString(x, seen) {
  var recur = /* @__PURE__ */ __name(function recur2(y) {
    var xs = seen.concat([x]);
    return _includes(y, xs) ? "<Circular>" : _toString(y, xs);
  }, "recur");
  var mapPairs = /* @__PURE__ */ __name(function(obj, keys4) {
    return _map(function(k) {
      return _quote(k) + ": " + recur(obj[k]);
    }, keys4.slice().sort());
  }, "mapPairs");
  switch (Object.prototype.toString.call(x)) {
    case "[object Arguments]":
      return "(function() { return arguments; }(" + _map(recur, x).join(", ") + "))";
    case "[object Array]":
      return "[" + _map(recur, x).concat(mapPairs(x, reject_default(function(k) {
        return /^\d+$/.test(k);
      }, keys_default(x)))).join(", ") + "]";
    case "[object Boolean]":
      return typeof x === "object" ? "new Boolean(" + recur(x.valueOf()) + ")" : x.toString();
    case "[object Date]":
      return "new Date(" + (isNaN(x.valueOf()) ? recur(NaN) : _quote(toISOString_default(x))) + ")";
    case "[object Map]":
      return "new Map(" + recur(Array.from(x)) + ")";
    case "[object Null]":
      return "null";
    case "[object Number]":
      return typeof x === "object" ? "new Number(" + recur(x.valueOf()) + ")" : 1 / x === -Infinity ? "-0" : x.toString(10);
    case "[object Set]":
      return "new Set(" + recur(Array.from(x).sort()) + ")";
    case "[object String]":
      return typeof x === "object" ? "new String(" + recur(x.valueOf()) + ")" : _quote(x);
    case "[object Undefined]":
      return "undefined";
    default:
      if (typeof x.toString === "function") {
        var repr = x.toString();
        if (repr !== "[object Object]") {
          return repr;
        }
      }
      return "{" + mapPairs(x, keys_default(x)).join(", ") + "}";
  }
}
__name(_toString, "_toString");

// source/toString.js
var toString2 = _curry1(/* @__PURE__ */ __name(function toString3(val) {
  return _toString(val, []);
}, "toString"));
var toString_default = toString2;

// source/max.js
var max = _curry2(/* @__PURE__ */ __name(function max2(a, b) {
  if (a === b) {
    return b;
  }
  function safeMax(x, y) {
    if (x > y !== y > x) {
      return y > x ? y : x;
    }
    return void 0;
  }
  __name(safeMax, "safeMax");
  var maxByValue = safeMax(a, b);
  if (maxByValue !== void 0) {
    return maxByValue;
  }
  var maxByType = safeMax(typeof a, typeof b);
  if (maxByType !== void 0) {
    return maxByType === typeof a ? a : b;
  }
  var stringA = toString_default(a);
  var maxByStringValue = safeMax(stringA, toString_default(b));
  if (maxByStringValue !== void 0) {
    return maxByStringValue === stringA ? a : b;
  }
  return b;
}, "max"));
var max_default = max;

// source/internal/_xmap.js
function XMap(f, xf) {
  this.xf = xf;
  this.f = f;
}
__name(XMap, "XMap");
XMap.prototype["@@transducer/init"] = xfBase_default.init;
XMap.prototype["@@transducer/result"] = xfBase_default.result;
XMap.prototype["@@transducer/step"] = function(result, input) {
  return this.xf["@@transducer/step"](result, this.f(input));
};
var _xmap = /* @__PURE__ */ __name(function _xmap2(f) {
  return function(xf) {
    return new XMap(f, xf);
  };
}, "_xmap");
var xmap_default = _xmap;

// source/map.js
var map = _curry2(_dispatchable(["fantasy-land/map", "map"], xmap_default, /* @__PURE__ */ __name(function map2(fn, functor) {
  switch (Object.prototype.toString.call(functor)) {
    case "[object Function]":
      return curryN_default(functor.length, function() {
        return fn.call(this, functor.apply(this, arguments));
      });
    case "[object Object]":
      return _arrayReduce(function(acc, key) {
        acc[key] = fn(functor[key]);
        return acc;
      }, {}, keys_default(functor));
    default:
      return _map(fn, functor);
  }
}, "map")));
var map_default = map;

// source/internal/_isInteger.js
var isInteger_default = Number.isInteger || /* @__PURE__ */ __name(function _isInteger(n) {
  return n << 0 === n;
}, "_isInteger");

// source/internal/_isString.js
function _isString(x) {
  return Object.prototype.toString.call(x) === "[object String]";
}
__name(_isString, "_isString");

// source/nth.js
var nth = _curry2(/* @__PURE__ */ __name(function nth2(offset, list) {
  var idx = offset < 0 ? list.length + offset : offset;
  return _isString(list) ? list.charAt(idx) : list[idx];
}, "nth"));
var nth_default = nth;

// source/prop.js
var prop = _curry2(/* @__PURE__ */ __name(function prop2(p, obj) {
  if (obj == null) {
    return;
  }
  return isInteger_default(p) ? nth_default(p, obj) : obj[p];
}, "prop"));
var prop_default = prop;

// source/pluck.js
var pluck = _curry2(/* @__PURE__ */ __name(function pluck2(p, list) {
  return map_default(prop_default(p), list);
}, "pluck"));
var pluck_default = pluck;

// source/internal/_isArrayLike.js
var _isArrayLike = _curry1(/* @__PURE__ */ __name(function isArrayLike(x) {
  if (isArray_default(x)) {
    return true;
  }
  if (!x) {
    return false;
  }
  if (typeof x !== "object") {
    return false;
  }
  if (_isString(x)) {
    return false;
  }
  if (x.length === 0) {
    return true;
  }
  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }
  return false;
}, "isArrayLike"));
var isArrayLike_default = _isArrayLike;

// source/internal/_createReduce.js
var symIterator = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
function _createReduce(arrayReduce, methodReduce, iterableReduce) {
  return /* @__PURE__ */ __name(function _reduce2(xf, acc, list) {
    if (isArrayLike_default(list)) {
      return arrayReduce(xf, acc, list);
    }
    if (list == null) {
      return acc;
    }
    if (typeof list["fantasy-land/reduce"] === "function") {
      return methodReduce(xf, acc, list, "fantasy-land/reduce");
    }
    if (list[symIterator] != null) {
      return iterableReduce(xf, acc, list[symIterator]());
    }
    if (typeof list.next === "function") {
      return iterableReduce(xf, acc, list);
    }
    if (typeof list.reduce === "function") {
      return methodReduce(xf, acc, list, "reduce");
    }
    throw new TypeError("reduce: list must be array or iterable");
  }, "_reduce");
}
__name(_createReduce, "_createReduce");

// source/internal/_xArrayReduce.js
function _xArrayReduce(xf, acc, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    acc = xf["@@transducer/step"](acc, list[idx]);
    if (acc && acc["@@transducer/reduced"]) {
      acc = acc["@@transducer/value"];
      break;
    }
    idx += 1;
  }
  return xf["@@transducer/result"](acc);
}
__name(_xArrayReduce, "_xArrayReduce");

// source/bind.js
var bind = _curry2(/* @__PURE__ */ __name(function bind2(fn, thisObj) {
  return _arity(fn.length, function() {
    return fn.apply(thisObj, arguments);
  });
}, "bind"));
var bind_default = bind;

// source/internal/_xReduce.js
function _xIterableReduce(xf, acc, iter) {
  var step = iter.next();
  while (!step.done) {
    acc = xf["@@transducer/step"](acc, step.value);
    if (acc && acc["@@transducer/reduced"]) {
      acc = acc["@@transducer/value"];
      break;
    }
    step = iter.next();
  }
  return xf["@@transducer/result"](acc);
}
__name(_xIterableReduce, "_xIterableReduce");
function _xMethodReduce(xf, acc, obj, methodName) {
  return xf["@@transducer/result"](obj[methodName](bind_default(xf["@@transducer/step"], xf), acc));
}
__name(_xMethodReduce, "_xMethodReduce");
var _xReduce = _createReduce(_xArrayReduce, _xMethodReduce, _xIterableReduce);
var xReduce_default = _xReduce;

// source/internal/_xwrap.js
function XWrap(fn) {
  this.f = fn;
}
__name(XWrap, "XWrap");
XWrap.prototype["@@transducer/init"] = function() {
  throw new Error("init not implemented on XWrap");
};
XWrap.prototype["@@transducer/result"] = function(acc) {
  return acc;
};
XWrap.prototype["@@transducer/step"] = function(acc, x) {
  return this.f(acc, x);
};
function _xwrap(fn) {
  return new XWrap(fn);
}
__name(_xwrap, "_xwrap");

// source/reduce.js
var reduce = _curry3(function(xf, acc, list) {
  return xReduce_default(typeof xf === "function" ? _xwrap(xf) : xf, acc, list);
});
var reduce_default = reduce;

// source/allPass.js
var allPass = _curry1(/* @__PURE__ */ __name(function allPass2(preds) {
  return curryN_default(reduce_default(max_default, 0, pluck_default("length", preds)), function() {
    var idx = 0;
    var len = preds.length;
    while (idx < len) {
      if (!preds[idx].apply(this, arguments)) {
        return false;
      }
      idx += 1;
    }
    return true;
  });
}, "allPass"));
var allPass_default = allPass;

// source/always.js
var always = _curry1(/* @__PURE__ */ __name(function always2(val) {
  return function() {
    return val;
  };
}, "always"));
var always_default = always;

// source/and.js
var and = _curry2(/* @__PURE__ */ __name(function and2(a, b) {
  return a && b;
}, "and"));
var and_default = and;

// source/internal/_xany.js
function XAny(f, xf) {
  this.xf = xf;
  this.f = f;
  this.any = false;
}
__name(XAny, "XAny");
XAny.prototype["@@transducer/init"] = xfBase_default.init;
XAny.prototype["@@transducer/result"] = function(result) {
  if (!this.any) {
    result = this.xf["@@transducer/step"](result, false);
  }
  return this.xf["@@transducer/result"](result);
};
XAny.prototype["@@transducer/step"] = function(result, input) {
  if (this.f(input)) {
    this.any = true;
    result = _reduced(this.xf["@@transducer/step"](result, true));
  }
  return result;
};
function _xany(f) {
  return function(xf) {
    return new XAny(f, xf);
  };
}
__name(_xany, "_xany");

// source/any.js
var any = _curry2(_dispatchable(["any"], _xany, /* @__PURE__ */ __name(function any2(fn, list) {
  var idx = 0;
  while (idx < list.length) {
    if (fn(list[idx])) {
      return true;
    }
    idx += 1;
  }
  return false;
}, "any")));
var any_default = any;

// source/anyPass.js
var anyPass = _curry1(/* @__PURE__ */ __name(function anyPass2(preds) {
  return curryN_default(reduce_default(max_default, 0, pluck_default("length", preds)), function() {
    var idx = 0;
    var len = preds.length;
    while (idx < len) {
      if (preds[idx].apply(this, arguments)) {
        return true;
      }
      idx += 1;
    }
    return false;
  });
}, "anyPass"));
var anyPass_default = anyPass;

// source/internal/_reduce.js
function _iterableReduce(reducer, acc, iter) {
  var step = iter.next();
  while (!step.done) {
    acc = reducer(acc, step.value);
    step = iter.next();
  }
  return acc;
}
__name(_iterableReduce, "_iterableReduce");
function _methodReduce(reducer, acc, obj, methodName) {
  return obj[methodName](reducer, acc);
}
__name(_methodReduce, "_methodReduce");
var _reduce = _createReduce(_arrayReduce, _methodReduce, _iterableReduce);
var reduce_default2 = _reduce;

// source/ap.js
var ap = _curry2(/* @__PURE__ */ __name(function ap2(applyF, applyX) {
  return typeof applyX["fantasy-land/ap"] === "function" ? applyX["fantasy-land/ap"](applyF) : typeof applyF.ap === "function" ? applyF.ap(applyX) : typeof applyF === "function" ? function(x) {
    return applyF(x)(applyX(x));
  } : reduce_default2(function(acc, f) {
    return _concat(acc, map_default(f, applyX));
  }, [], applyF);
}, "ap"));
var ap_default = ap;

// source/internal/_aperture.js
function _aperture(n, list) {
  var idx = 0;
  var limit = list.length - (n - 1);
  var acc = new Array(limit >= 0 ? limit : 0);
  while (idx < limit) {
    acc[idx] = Array.prototype.slice.call(list, idx, idx + n);
    idx += 1;
  }
  return acc;
}
__name(_aperture, "_aperture");

// source/internal/_xaperture.js
function XAperture(n, xf) {
  this.xf = xf;
  this.pos = 0;
  this.full = false;
  this.acc = new Array(n);
}
__name(XAperture, "XAperture");
XAperture.prototype["@@transducer/init"] = xfBase_default.init;
XAperture.prototype["@@transducer/result"] = function(result) {
  this.acc = null;
  return this.xf["@@transducer/result"](result);
};
XAperture.prototype["@@transducer/step"] = function(result, input) {
  this.store(input);
  return this.full ? this.xf["@@transducer/step"](result, this.getCopy()) : result;
};
XAperture.prototype.store = function(input) {
  this.acc[this.pos] = input;
  this.pos += 1;
  if (this.pos === this.acc.length) {
    this.pos = 0;
    this.full = true;
  }
};
XAperture.prototype.getCopy = function() {
  return _concat(
    Array.prototype.slice.call(this.acc, this.pos),
    Array.prototype.slice.call(this.acc, 0, this.pos)
  );
};
function _xaperture(n) {
  return function(xf) {
    return new XAperture(n, xf);
  };
}
__name(_xaperture, "_xaperture");

// source/aperture.js
var aperture = _curry2(_dispatchable([], _xaperture, _aperture));
var aperture_default = aperture;

// source/append.js
var append = _curry2(/* @__PURE__ */ __name(function append2(el, list) {
  return _concat(list, [el]);
}, "append"));
var append_default = append;

// source/apply.js
var apply = _curry2(/* @__PURE__ */ __name(function apply2(fn, args) {
  return fn.apply(this, args);
}, "apply"));
var apply_default = apply;

// source/values.js
var values = _curry1(/* @__PURE__ */ __name(function values2(obj) {
  var props3 = keys_default(obj);
  var len = props3.length;
  var vals = [];
  var idx = 0;
  while (idx < len) {
    vals[idx] = obj[props3[idx]];
    idx += 1;
  }
  return vals;
}, "values"));
var values_default = values;

// source/applySpec.js
function mapValues(fn, obj) {
  return isArray_default(obj) ? obj.map(fn) : keys_default(obj).reduce(function(acc, key) {
    acc[key] = fn(obj[key]);
    return acc;
  }, {});
}
__name(mapValues, "mapValues");
var applySpec = _curry1(/* @__PURE__ */ __name(function applySpec2(spec) {
  spec = mapValues(
    function(v) {
      return typeof v == "function" ? v : applySpec2(v);
    },
    spec
  );
  return curryN_default(
    reduce_default(max_default, 0, pluck_default("length", values_default(spec))),
    function() {
      var args = arguments;
      return mapValues(function(f) {
        return apply_default(f, args);
      }, spec);
    }
  );
}, "applySpec"));
var applySpec_default = applySpec;

// source/applyTo.js
var applyTo = _curry2(/* @__PURE__ */ __name(function applyTo2(x, f) {
  return f(x);
}, "applyTo"));
var applyTo_default = applyTo;

// source/ascend.js
var ascend = _curry3(/* @__PURE__ */ __name(function ascend2(fn, a, b) {
  var aa = fn(a);
  var bb = fn(b);
  return aa < bb ? -1 : aa > bb ? 1 : 0;
}, "ascend"));
var ascend_default = ascend;

// source/internal/_assoc.js
function _assoc(prop3, val, obj) {
  if (isInteger_default(prop3) && isArray_default(obj)) {
    var arr = [].concat(obj);
    arr[prop3] = val;
    return arr;
  }
  var result = {};
  for (var p in obj) {
    result[p] = obj[p];
  }
  result[prop3] = val;
  return result;
}
__name(_assoc, "_assoc");

// source/isNil.js
var isNil = _curry1(/* @__PURE__ */ __name(function isNil2(x) {
  return x == null;
}, "isNil"));
var isNil_default = isNil;

// source/assocPath.js
var assocPath = _curry3(/* @__PURE__ */ __name(function assocPath2(path3, val, obj) {
  if (path3.length === 0) {
    return val;
  }
  var idx = path3[0];
  if (path3.length > 1) {
    var nextObj = !isNil_default(obj) && _has(idx, obj) && typeof obj[idx] === "object" ? obj[idx] : isInteger_default(path3[1]) ? [] : {};
    val = assocPath2(Array.prototype.slice.call(path3, 1), val, nextObj);
  }
  return _assoc(idx, val, obj);
}, "assocPath"));
var assocPath_default = assocPath;

// source/assoc.js
var assoc = _curry3(/* @__PURE__ */ __name(function assoc2(prop3, val, obj) {
  return assocPath_default([prop3], val, obj);
}, "assoc"));
var assoc_default = assoc;

// source/nAry.js
var nAry = _curry2(/* @__PURE__ */ __name(function nAry2(n, fn) {
  switch (n) {
    case 0:
      return function() {
        return fn.call(this);
      };
    case 1:
      return function(a0) {
        return fn.call(this, a0);
      };
    case 2:
      return function(a0, a1) {
        return fn.call(this, a0, a1);
      };
    case 3:
      return function(a0, a1, a2) {
        return fn.call(this, a0, a1, a2);
      };
    case 4:
      return function(a0, a1, a2, a3) {
        return fn.call(this, a0, a1, a2, a3);
      };
    case 5:
      return function(a0, a1, a2, a3, a4) {
        return fn.call(this, a0, a1, a2, a3, a4);
      };
    case 6:
      return function(a0, a1, a2, a3, a4, a5) {
        return fn.call(this, a0, a1, a2, a3, a4, a5);
      };
    case 7:
      return function(a0, a1, a2, a3, a4, a5, a6) {
        return fn.call(this, a0, a1, a2, a3, a4, a5, a6);
      };
    case 8:
      return function(a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7);
      };
    case 9:
      return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8);
      };
    case 10:
      return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
      };
    default:
      throw new Error("First argument to nAry must be a non-negative integer no greater than ten");
  }
}, "nAry"));
var nAry_default = nAry;

// source/binary.js
var binary = _curry1(/* @__PURE__ */ __name(function binary2(fn) {
  return nAry_default(2, fn);
}, "binary"));
var binary_default = binary;

// source/internal/_isFunction.js
function _isFunction(x) {
  var type3 = Object.prototype.toString.call(x);
  return type3 === "[object Function]" || type3 === "[object AsyncFunction]" || type3 === "[object GeneratorFunction]" || type3 === "[object AsyncGeneratorFunction]";
}
__name(_isFunction, "_isFunction");

// source/liftN.js
var liftN = _curry2(/* @__PURE__ */ __name(function liftN2(arity, fn) {
  var lifted = curryN_default(arity, fn);
  return curryN_default(arity, function() {
    return _arrayReduce(ap_default, map_default(lifted, arguments[0]), Array.prototype.slice.call(arguments, 1));
  });
}, "liftN"));
var liftN_default = liftN;

// source/lift.js
var lift = _curry1(/* @__PURE__ */ __name(function lift2(fn) {
  return liftN_default(fn.length, fn);
}, "lift"));
var lift_default = lift;

// source/both.js
var both = _curry2(/* @__PURE__ */ __name(function both2(f, g) {
  return _isFunction(f) ? /* @__PURE__ */ __name(function _both() {
    return f.apply(this, arguments) && g.apply(this, arguments);
  }, "_both") : lift_default(and_default)(f, g);
}, "both"));
var both_default = both;

// source/call.js
var call = _curry1(/* @__PURE__ */ __name(function call2(fn) {
  return fn.apply(this, Array.prototype.slice.call(arguments, 1));
}, "call"));
var call_default = call;

// source/internal/_makeFlat.js
function _makeFlat(recursive) {
  return /* @__PURE__ */ __name(function flatt(list) {
    var value, jlen, j;
    var result = [];
    var idx = 0;
    var ilen = list.length;
    while (idx < ilen) {
      if (isArrayLike_default(list[idx])) {
        value = recursive ? flatt(list[idx]) : list[idx];
        j = 0;
        jlen = value.length;
        while (j < jlen) {
          result[result.length] = value[j];
          j += 1;
        }
      } else {
        result[result.length] = list[idx];
      }
      idx += 1;
    }
    return result;
  }, "flatt");
}
__name(_makeFlat, "_makeFlat");

// source/internal/_forceReduced.js
function _forceReduced(x) {
  return {
    "@@transducer/value": x,
    "@@transducer/reduced": true
  };
}
__name(_forceReduced, "_forceReduced");

// source/internal/_flatCat.js
var tInit = "@@transducer/init";
var tStep = "@@transducer/step";
var tResult = "@@transducer/result";
function XPreservingReduced(xf) {
  this.xf = xf;
}
__name(XPreservingReduced, "XPreservingReduced");
XPreservingReduced.prototype[tInit] = xfBase_default.init;
XPreservingReduced.prototype[tResult] = xfBase_default.result;
XPreservingReduced.prototype[tStep] = function(result, input) {
  var ret = this.xf[tStep](result, input);
  return ret["@@transducer/reduced"] ? _forceReduced(ret) : ret;
};
function XFlatCat(xf) {
  this.xf = new XPreservingReduced(xf);
}
__name(XFlatCat, "XFlatCat");
XFlatCat.prototype[tInit] = xfBase_default.init;
XFlatCat.prototype[tResult] = xfBase_default.result;
XFlatCat.prototype[tStep] = function(result, input) {
  return !isArrayLike_default(input) ? _xArrayReduce(this.xf, result, [input]) : xReduce_default(this.xf, result, input);
};
var _flatCat = /* @__PURE__ */ __name(function _xcat(xf) {
  return new XFlatCat(xf);
}, "_xcat");
var flatCat_default = _flatCat;

// source/internal/_xchain.js
function _xchain(f) {
  return function(xf) {
    return xmap_default(f)(flatCat_default(xf));
  };
}
__name(_xchain, "_xchain");

// source/chain.js
var chain = _curry2(_dispatchable(["fantasy-land/chain", "chain"], _xchain, /* @__PURE__ */ __name(function chain2(fn, monad) {
  if (typeof monad === "function") {
    return function(x) {
      return fn(monad(x))(x);
    };
  }
  return _makeFlat(false)(map_default(fn, monad));
}, "chain")));
var chain_default = chain;

// source/clamp.js
var clamp = _curry3(/* @__PURE__ */ __name(function clamp2(min3, max3, value) {
  if (min3 > max3) {
    throw new Error("min must not be greater than max in clamp(min, max, value)");
  }
  return value < min3 ? min3 : value > max3 ? max3 : value;
}, "clamp"));
var clamp_default = clamp;

// source/internal/_cloneRegExp.js
function _cloneRegExp(pattern) {
  return new RegExp(pattern.source, pattern.flags ? pattern.flags : (pattern.global ? "g" : "") + (pattern.ignoreCase ? "i" : "") + (pattern.multiline ? "m" : "") + (pattern.sticky ? "y" : "") + (pattern.unicode ? "u" : "") + (pattern.dotAll ? "s" : ""));
}
__name(_cloneRegExp, "_cloneRegExp");

// source/internal/_clone.js
function _clone(value, deep, map3) {
  map3 || (map3 = new _ObjectMap());
  if (_isPrimitive(value)) {
    return value;
  }
  var copy = /* @__PURE__ */ __name(function copy2(copiedValue) {
    var cachedCopy = map3.get(value);
    if (cachedCopy) {
      return cachedCopy;
    }
    map3.set(value, copiedValue);
    for (var key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        copiedValue[key] = deep ? _clone(value[key], true, map3) : value[key];
      }
    }
    return copiedValue;
  }, "copy");
  switch (type_default(value)) {
    case "Object":
      return copy(Object.create(Object.getPrototypeOf(value)));
    case "Array":
      return copy([]);
    case "Date":
      return new Date(value.valueOf());
    case "RegExp":
      return _cloneRegExp(value);
    case "Int8Array":
    case "Uint8Array":
    case "Uint8ClampedArray":
    case "Int16Array":
    case "Uint16Array":
    case "Int32Array":
    case "Uint32Array":
    case "Float32Array":
    case "Float64Array":
    case "BigInt64Array":
    case "BigUint64Array":
      return value.slice();
    default:
      return value;
  }
}
__name(_clone, "_clone");
function _isPrimitive(param) {
  var type3 = typeof param;
  return param == null || type3 != "object" && type3 != "function";
}
__name(_isPrimitive, "_isPrimitive");
function _ObjectMap() {
  this.map = {};
  this.length = 0;
}
__name(_ObjectMap, "_ObjectMap");
_ObjectMap.prototype.set = function(key, value) {
  const hashedKey = this.hash(key);
  let bucket = this.map[hashedKey];
  if (!bucket) {
    this.map[hashedKey] = bucket = [];
  }
  bucket.push([key, value]);
  this.length += 1;
};
_ObjectMap.prototype.hash = function(key) {
  let hashedKey = [];
  for (var value in key) {
    hashedKey.push(Object.prototype.toString.call(key[value]));
  }
  return hashedKey.join();
};
_ObjectMap.prototype.get = function(key) {
  if (this.length <= 180) {
    for (const p in this.map) {
      const bucket2 = this.map[p];
      for (let i = 0; i < bucket2.length; i += 1) {
        const element = bucket2[i];
        if (element[0] === key) {
          return element[1];
        }
      }
    }
    return;
  }
  const hashedKey = this.hash(key);
  const bucket = this.map[hashedKey];
  if (!bucket) {
    return;
  }
  for (let i = 0; i < bucket.length; i += 1) {
    const element = bucket[i];
    if (element[0] === key) {
      return element[1];
    }
  }
};

// source/clone.js
var clone = _curry1(/* @__PURE__ */ __name(function clone2(value) {
  return value != null && typeof value.clone === "function" ? value.clone() : _clone(value, true);
}, "clone"));
var clone_default = clone;

// source/collectBy.js
var collectBy = _curry2(/* @__PURE__ */ __name(function collectBy2(fn, list) {
  var group = reduce_default2(function(o3, x) {
    var tag2 = fn(x);
    if (o3[tag2] === void 0) {
      o3[tag2] = [];
    }
    o3[tag2].push(x);
    return o3;
  }, {}, list);
  var newList = [];
  for (var tag in group) {
    newList.push(group[tag]);
  }
  return newList;
}, "collectBy"));
var collectBy_default = collectBy;

// source/comparator.js
var comparator = _curry1(/* @__PURE__ */ __name(function comparator2(pred) {
  return function(a, b) {
    return pred(a, b) ? -1 : pred(b, a) ? 1 : 0;
  };
}, "comparator"));
var comparator_default = comparator;

// source/not.js
var not = _curry1(/* @__PURE__ */ __name(function not2(a) {
  return !a;
}, "not"));
var not_default = not;

// source/complement.js
var complement = lift_default(not_default);
var complement_default = complement;

// source/internal/_pipe.js
function _pipe(f, g) {
  return function() {
    return g.call(this, f.apply(this, arguments));
  };
}
__name(_pipe, "_pipe");

// source/internal/_checkForMethod.js
function _checkForMethod(methodname, fn) {
  return function() {
    var length3 = arguments.length;
    if (length3 === 0) {
      return fn();
    }
    var obj = arguments[length3 - 1];
    return isArray_default(obj) || typeof obj[methodname] !== "function" ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length3 - 1));
  };
}
__name(_checkForMethod, "_checkForMethod");

// source/slice.js
var slice = _curry3(_checkForMethod("slice", /* @__PURE__ */ __name(function slice2(fromIndex, toIndex, list) {
  return Array.prototype.slice.call(list, fromIndex, toIndex);
}, "slice")));
var slice_default = slice;

// source/tail.js
var tail = _curry1(_checkForMethod("tail", slice_default(1, Infinity)));
var tail_default = tail;

// source/pipe.js
function pipe() {
  if (arguments.length === 0) {
    throw new Error("pipe requires at least one argument");
  }
  return _arity(
    arguments[0].length,
    reduce_default(_pipe, arguments[0], tail_default(arguments))
  );
}
__name(pipe, "pipe");

// source/reverse.js
var reverse = _curry1(/* @__PURE__ */ __name(function reverse2(list) {
  return _isString(list) ? list.split("").reverse().join("") : Array.prototype.slice.call(list, 0).reverse();
}, "reverse"));
var reverse_default = reverse;

// source/compose.js
function compose() {
  if (arguments.length === 0) {
    throw new Error("compose requires at least one argument");
  }
  return pipe.apply(this, reverse_default(arguments));
}
__name(compose, "compose");

// source/head.js
var head = nth_default(0);
var head_default = head;

// source/internal/_identity.js
function _identity(x) {
  return x;
}
__name(_identity, "_identity");

// source/identity.js
var identity = _curry1(_identity);
var identity_default = identity;

// source/pipeWith.js
var pipeWith = _curry2(/* @__PURE__ */ __name(function pipeWith2(xf, list) {
  if (list.length <= 0) {
    return identity_default;
  }
  var headList = head_default(list);
  var tailList = tail_default(list);
  return _arity(headList.length, function() {
    return reduce_default2(
      function(result, f) {
        return xf.call(this, f, result);
      },
      headList.apply(this, arguments),
      tailList
    );
  });
}, "pipeWith"));
var pipeWith_default = pipeWith;

// source/composeWith.js
var composeWith = _curry2(/* @__PURE__ */ __name(function composeWith2(xf, list) {
  return pipeWith_default.apply(this, [xf, reverse_default(list)]);
}, "composeWith"));
var composeWith_default = composeWith;

// source/concat.js
var concat = _curry2(/* @__PURE__ */ __name(function concat2(a, b) {
  if (isArray_default(a)) {
    if (isArray_default(b)) {
      return a.concat(b);
    }
    throw new TypeError(toString_default(b) + " is not an array");
  }
  if (_isString(a)) {
    if (_isString(b)) {
      return a + b;
    }
    throw new TypeError(toString_default(b) + " is not a string");
  }
  if (a != null && _isFunction(a["fantasy-land/concat"])) {
    return a["fantasy-land/concat"](b);
  }
  if (a != null && _isFunction(a.concat)) {
    return a.concat(b);
  }
  throw new TypeError(toString_default(a) + ' does not have a method named "concat" or "fantasy-land/concat"');
}, "concat"));
var concat_default = concat;

// source/cond.js
var cond = _curry1(/* @__PURE__ */ __name(function cond2(pairs) {
  var arity = reduce_default(
    max_default,
    0,
    map_default(function(pair3) {
      return pair3[0].length;
    }, pairs)
  );
  return _arity(arity, function() {
    var idx = 0;
    while (idx < pairs.length) {
      if (pairs[idx][0].apply(this, arguments)) {
        return pairs[idx][1].apply(this, arguments);
      }
      idx += 1;
    }
  });
}, "cond"));
var cond_default = cond;

// source/curry.js
var curry = _curry1(/* @__PURE__ */ __name(function curry2(fn) {
  return curryN_default(fn.length, fn);
}, "curry"));
var curry_default = curry;

// source/constructN.js
var constructN = _curry2(/* @__PURE__ */ __name(function constructN2(n, Fn) {
  if (n > 10) {
    throw new Error("Constructor with greater than ten arguments");
  }
  if (n === 0) {
    return function() {
      return new Fn();
    };
  }
  return curry_default(nAry_default(n, function($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) {
    switch (n) {
      case 1:
        return new Fn($0);
      case 2:
        return new Fn($0, $1);
      case 3:
        return new Fn($0, $1, $2);
      case 4:
        return new Fn($0, $1, $2, $3);
      case 5:
        return new Fn($0, $1, $2, $3, $4);
      case 6:
        return new Fn($0, $1, $2, $3, $4, $5);
      case 7:
        return new Fn($0, $1, $2, $3, $4, $5, $6);
      case 8:
        return new Fn($0, $1, $2, $3, $4, $5, $6, $7);
      case 9:
        return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8);
      case 10:
        return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8, $9);
    }
  }));
}, "constructN"));
var constructN_default = constructN;

// source/construct.js
var construct = _curry1(/* @__PURE__ */ __name(function construct2(Fn) {
  return constructN_default(Fn.length, Fn);
}, "construct"));
var construct_default = construct;

// source/converge.js
var converge = _curry2(/* @__PURE__ */ __name(function converge2(after, fns) {
  return curryN_default(reduce_default(max_default, 0, pluck_default("length", fns)), function() {
    var args = arguments;
    var context = this;
    return after.apply(context, _map(function(fn) {
      return fn.apply(context, args);
    }, fns));
  });
}, "converge"));
var converge_default = converge;

// source/count.js
var count = curry_default(function(pred, list) {
  return reduce_default2(function(a, e) {
    return pred(e) ? a + 1 : a;
  }, 0, list);
});
var count_default = count;

// source/internal/_xreduceBy.js
function XReduceBy(valueFn, valueAcc, keyFn, xf) {
  this.valueFn = valueFn;
  this.valueAcc = valueAcc;
  this.keyFn = keyFn;
  this.xf = xf;
  this.inputs = {};
}
__name(XReduceBy, "XReduceBy");
XReduceBy.prototype["@@transducer/init"] = xfBase_default.init;
XReduceBy.prototype["@@transducer/result"] = function(result) {
  var key;
  for (key in this.inputs) {
    if (_has(key, this.inputs)) {
      result = this.xf["@@transducer/step"](result, this.inputs[key]);
      if (result["@@transducer/reduced"]) {
        result = result["@@transducer/value"];
        break;
      }
    }
  }
  this.inputs = null;
  return this.xf["@@transducer/result"](result);
};
XReduceBy.prototype["@@transducer/step"] = function(result, input) {
  var key = this.keyFn(input);
  this.inputs[key] = this.inputs[key] || [key, _clone(this.valueAcc, false)];
  this.inputs[key][1] = this.valueFn(this.inputs[key][1], input);
  return result;
};
function _xreduceBy(valueFn, valueAcc, keyFn) {
  return function(xf) {
    return new XReduceBy(valueFn, valueAcc, keyFn, xf);
  };
}
__name(_xreduceBy, "_xreduceBy");

// source/reduceBy.js
var reduceBy = _curryN(4, [], _dispatchable(
  [],
  _xreduceBy,
  /* @__PURE__ */ __name(function reduceBy2(valueFn, valueAcc, keyFn, list) {
    var xf = _xwrap(function(acc, elt) {
      var key = keyFn(elt);
      var value = valueFn(_has(key, acc) ? acc[key] : _clone(valueAcc, false), elt);
      if (value && value["@@transducer/reduced"]) {
        return _reduced(acc);
      }
      acc[key] = value;
      return acc;
    });
    return xReduce_default(xf, {}, list);
  }, "reduceBy")
));
var reduceBy_default = reduceBy;

// source/countBy.js
var countBy = reduceBy_default(function(acc, elem) {
  return acc + 1;
}, 0);
var countBy_default = countBy;

// source/dec.js
var dec = add_default(-1);
var dec_default = dec;

// source/defaultTo.js
var defaultTo = _curry2(/* @__PURE__ */ __name(function defaultTo2(d, v) {
  return v == null || v !== v ? d : v;
}, "defaultTo"));
var defaultTo_default = defaultTo;

// source/descend.js
var descend = _curry3(/* @__PURE__ */ __name(function descend2(fn, a, b) {
  var aa = fn(a);
  var bb = fn(b);
  return aa > bb ? -1 : aa < bb ? 1 : 0;
}, "descend"));
var descend_default = descend;

// source/internal/_Set.js
function _Set() {
  this._nativeSet = typeof Set === "function" ? /* @__PURE__ */ new Set() : null;
  this._items = {};
}
__name(_Set, "_Set");
_Set.prototype.add = function(item) {
  return !hasOrAdd(item, true, this);
};
_Set.prototype.has = function(item) {
  return hasOrAdd(item, false, this);
};
function hasOrAdd(item, shouldAdd, set3) {
  var type3 = typeof item;
  var prevSize, newSize;
  switch (type3) {
    case "string":
    case "number":
      if (item === 0 && 1 / item === -Infinity) {
        if (set3._items["-0"]) {
          return true;
        } else {
          if (shouldAdd) {
            set3._items["-0"] = true;
          }
          return false;
        }
      }
      if (set3._nativeSet !== null) {
        if (shouldAdd) {
          prevSize = set3._nativeSet.size;
          set3._nativeSet.add(item);
          newSize = set3._nativeSet.size;
          return newSize === prevSize;
        } else {
          return set3._nativeSet.has(item);
        }
      } else {
        if (!(type3 in set3._items)) {
          if (shouldAdd) {
            set3._items[type3] = {};
            set3._items[type3][item] = true;
          }
          return false;
        } else if (item in set3._items[type3]) {
          return true;
        } else {
          if (shouldAdd) {
            set3._items[type3][item] = true;
          }
          return false;
        }
      }
    case "boolean":
      if (type3 in set3._items) {
        var bIdx = item ? 1 : 0;
        if (set3._items[type3][bIdx]) {
          return true;
        } else {
          if (shouldAdd) {
            set3._items[type3][bIdx] = true;
          }
          return false;
        }
      } else {
        if (shouldAdd) {
          set3._items[type3] = item ? [false, true] : [true, false];
        }
        return false;
      }
    case "function":
      if (set3._nativeSet !== null) {
        if (shouldAdd) {
          prevSize = set3._nativeSet.size;
          set3._nativeSet.add(item);
          newSize = set3._nativeSet.size;
          return newSize === prevSize;
        } else {
          return set3._nativeSet.has(item);
        }
      } else {
        if (!(type3 in set3._items)) {
          if (shouldAdd) {
            set3._items[type3] = [item];
          }
          return false;
        }
        if (!_includes(item, set3._items[type3])) {
          if (shouldAdd) {
            set3._items[type3].push(item);
          }
          return false;
        }
        return true;
      }
    case "undefined":
      if (set3._items[type3]) {
        return true;
      } else {
        if (shouldAdd) {
          set3._items[type3] = true;
        }
        return false;
      }
    case "object":
      if (item === null) {
        if (!set3._items["null"]) {
          if (shouldAdd) {
            set3._items["null"] = true;
          }
          return false;
        }
        return true;
      }
    default:
      type3 = Object.prototype.toString.call(item);
      if (!(type3 in set3._items)) {
        if (shouldAdd) {
          set3._items[type3] = [item];
        }
        return false;
      }
      if (!_includes(item, set3._items[type3])) {
        if (shouldAdd) {
          set3._items[type3].push(item);
        }
        return false;
      }
      return true;
  }
}
__name(hasOrAdd, "hasOrAdd");
var Set_default = _Set;

// source/difference.js
var difference = _curry2(/* @__PURE__ */ __name(function difference2(first, second) {
  var out = [];
  var idx = 0;
  var firstLen = first.length;
  var secondLen = second.length;
  var toFilterOut = new Set_default();
  for (var i = 0; i < secondLen; i += 1) {
    toFilterOut.add(second[i]);
  }
  while (idx < firstLen) {
    if (toFilterOut.add(first[idx])) {
      out[out.length] = first[idx];
    }
    idx += 1;
  }
  return out;
}, "difference"));
var difference_default = difference;

// source/differenceWith.js
var differenceWith = _curry3(/* @__PURE__ */ __name(function differenceWith2(pred, first, second) {
  var out = [];
  var idx = 0;
  var firstLen = first.length;
  while (idx < firstLen) {
    if (!_includesWith(pred, first[idx], second) && !_includesWith(pred, first[idx], out)) {
      out.push(first[idx]);
    }
    idx += 1;
  }
  return out;
}, "differenceWith"));
var differenceWith_default = differenceWith;

// source/remove.js
var remove = _curry3(/* @__PURE__ */ __name(function remove2(start, count2, list) {
  var result = Array.prototype.slice.call(list, 0);
  result.splice(start, count2);
  return result;
}, "remove"));
var remove_default = remove;

// source/internal/_dissoc.js
function _dissoc(prop3, obj) {
  if (obj == null) {
    return obj;
  }
  if (isInteger_default(prop3) && isArray_default(obj)) {
    return remove_default(prop3, 1, obj);
  }
  var result = {};
  for (var p in obj) {
    result[p] = obj[p];
  }
  delete result[prop3];
  return result;
}
__name(_dissoc, "_dissoc");

// source/dissocPath.js
function _shallowCloneObject(prop3, obj) {
  if (isInteger_default(prop3) && isArray_default(obj)) {
    return [].concat(obj);
  }
  var result = {};
  for (var p in obj) {
    result[p] = obj[p];
  }
  return result;
}
__name(_shallowCloneObject, "_shallowCloneObject");
var dissocPath = _curry2(/* @__PURE__ */ __name(function dissocPath2(path3, obj) {
  if (obj == null) {
    return obj;
  }
  switch (path3.length) {
    case 0:
      return obj;
    case 1:
      return _dissoc(path3[0], obj);
    default:
      var head2 = path3[0];
      var tail2 = Array.prototype.slice.call(path3, 1);
      if (obj[head2] == null) {
        return _shallowCloneObject(head2, obj);
      } else {
        return assoc_default(head2, dissocPath2(tail2, obj[head2]), obj);
      }
  }
}, "dissocPath"));
var dissocPath_default = dissocPath;

// source/dissoc.js
var dissoc = _curry2(/* @__PURE__ */ __name(function dissoc2(prop3, obj) {
  return dissocPath_default([prop3], obj);
}, "dissoc"));
var dissoc_default = dissoc;

// source/divide.js
var divide = _curry2(/* @__PURE__ */ __name(function divide2(a, b) {
  return a / b;
}, "divide"));
var divide_default = divide;

// source/internal/_xdrop.js
function XDrop(n, xf) {
  this.xf = xf;
  this.n = n;
}
__name(XDrop, "XDrop");
XDrop.prototype["@@transducer/init"] = xfBase_default.init;
XDrop.prototype["@@transducer/result"] = xfBase_default.result;
XDrop.prototype["@@transducer/step"] = function(result, input) {
  if (this.n > 0) {
    this.n -= 1;
    return result;
  }
  return this.xf["@@transducer/step"](result, input);
};
function _xdrop(n) {
  return function(xf) {
    return new XDrop(n, xf);
  };
}
__name(_xdrop, "_xdrop");

// source/drop.js
var drop = _curry2(_dispatchable(["drop"], _xdrop, /* @__PURE__ */ __name(function drop2(n, xs) {
  return slice_default(Math.max(0, n), Infinity, xs);
}, "drop")));
var drop_default = drop;

// source/internal/_xtake.js
function XTake(n, xf) {
  this.xf = xf;
  this.n = n;
  this.i = 0;
}
__name(XTake, "XTake");
XTake.prototype["@@transducer/init"] = xfBase_default.init;
XTake.prototype["@@transducer/result"] = xfBase_default.result;
XTake.prototype["@@transducer/step"] = function(result, input) {
  this.i += 1;
  var ret = this.n === 0 ? result : this.xf["@@transducer/step"](result, input);
  return this.n >= 0 && this.i >= this.n ? _reduced(ret) : ret;
};
function _xtake(n) {
  return function(xf) {
    return new XTake(n, xf);
  };
}
__name(_xtake, "_xtake");

// source/take.js
var take = _curry2(_dispatchable(["take"], _xtake, /* @__PURE__ */ __name(function take2(n, xs) {
  return slice_default(0, n < 0 ? Infinity : n, xs);
}, "take")));
var take_default = take;

// source/internal/_dropLast.js
function dropLast(n, xs) {
  return take_default(n < xs.length ? xs.length - n : 0, xs);
}
__name(dropLast, "dropLast");

// source/internal/_xdropLast.js
function XDropLast(n, xf) {
  if (n <= 0) {
    return xf;
  }
  this.xf = xf;
  this.pos = 0;
  this.full = false;
  this.acc = new Array(n);
}
__name(XDropLast, "XDropLast");
XDropLast.prototype["@@transducer/init"] = xfBase_default.init;
XDropLast.prototype["@@transducer/result"] = function(result) {
  this.acc = null;
  return this.xf["@@transducer/result"](result);
};
XDropLast.prototype["@@transducer/step"] = function(result, input) {
  if (this.full) {
    result = this.xf["@@transducer/step"](result, this.acc[this.pos]);
  }
  this.store(input);
  return result;
};
XDropLast.prototype.store = function(input) {
  this.acc[this.pos] = input;
  this.pos += 1;
  if (this.pos === this.acc.length) {
    this.pos = 0;
    this.full = true;
  }
};
function _xdropLast(n) {
  return function(xf) {
    return new XDropLast(n, xf);
  };
}
__name(_xdropLast, "_xdropLast");

// source/dropLast.js
var dropLast2 = _curry2(_dispatchable([], _xdropLast, dropLast));
var dropLast_default = dropLast2;

// source/internal/_dropLastWhile.js
function dropLastWhile(pred, xs) {
  var idx = xs.length - 1;
  while (idx >= 0 && pred(xs[idx])) {
    idx -= 1;
  }
  return slice_default(0, idx + 1, xs);
}
__name(dropLastWhile, "dropLastWhile");

// source/internal/_xdropLastWhile.js
function XDropLastWhile(fn, xf) {
  this.f = fn;
  this.retained = [];
  this.xf = xf;
}
__name(XDropLastWhile, "XDropLastWhile");
XDropLastWhile.prototype["@@transducer/init"] = xfBase_default.init;
XDropLastWhile.prototype["@@transducer/result"] = function(result) {
  this.retained = null;
  return this.xf["@@transducer/result"](result);
};
XDropLastWhile.prototype["@@transducer/step"] = function(result, input) {
  return this.f(input) ? this.retain(result, input) : this.flush(result, input);
};
XDropLastWhile.prototype.flush = function(result, input) {
  result = xReduce_default(
    this.xf,
    result,
    this.retained
  );
  this.retained = [];
  return this.xf["@@transducer/step"](result, input);
};
XDropLastWhile.prototype.retain = function(result, input) {
  this.retained.push(input);
  return result;
};
function _xdropLastWhile(fn) {
  return function(xf) {
    return new XDropLastWhile(fn, xf);
  };
}
__name(_xdropLastWhile, "_xdropLastWhile");

// source/dropLastWhile.js
var dropLastWhile2 = _curry2(_dispatchable([], _xdropLastWhile, dropLastWhile));
var dropLastWhile_default = dropLastWhile2;

// source/internal/_xdropRepeatsWith.js
function XDropRepeatsWith(pred, xf) {
  this.xf = xf;
  this.pred = pred;
  this.lastValue = void 0;
  this.seenFirstValue = false;
}
__name(XDropRepeatsWith, "XDropRepeatsWith");
XDropRepeatsWith.prototype["@@transducer/init"] = xfBase_default.init;
XDropRepeatsWith.prototype["@@transducer/result"] = xfBase_default.result;
XDropRepeatsWith.prototype["@@transducer/step"] = function(result, input) {
  var sameAsLast = false;
  if (!this.seenFirstValue) {
    this.seenFirstValue = true;
  } else if (this.pred(this.lastValue, input)) {
    sameAsLast = true;
  }
  this.lastValue = input;
  return sameAsLast ? result : this.xf["@@transducer/step"](result, input);
};
function _xdropRepeatsWith(pred) {
  return function(xf) {
    return new XDropRepeatsWith(pred, xf);
  };
}
__name(_xdropRepeatsWith, "_xdropRepeatsWith");

// source/last.js
var last = nth_default(-1);
var last_default = last;

// source/dropRepeatsWith.js
var dropRepeatsWith = _curry2(_dispatchable([], _xdropRepeatsWith, /* @__PURE__ */ __name(function dropRepeatsWith2(pred, list) {
  var result = [];
  var idx = 1;
  var len = list.length;
  if (len !== 0) {
    result[0] = list[0];
    while (idx < len) {
      if (!pred(last_default(result), list[idx])) {
        result[result.length] = list[idx];
      }
      idx += 1;
    }
  }
  return result;
}, "dropRepeatsWith")));
var dropRepeatsWith_default = dropRepeatsWith;

// source/dropRepeats.js
var dropRepeats = _curry1(
  _dispatchable([], function() {
    return _xdropRepeatsWith(equals_default);
  }, dropRepeatsWith_default(equals_default))
);
var dropRepeats_default = dropRepeats;

// source/eqBy.js
var eqBy = _curry3(/* @__PURE__ */ __name(function eqBy2(f, x, y) {
  return equals_default(f(x), f(y));
}, "eqBy"));
var eqBy_default = eqBy;

// source/dropRepeatsBy.js
var dropRepeatsBy = _curry2(function(fn, list) {
  return _dispatchable([], function() {
    return _xdropRepeatsWith(eqBy_default(fn));
  }, dropRepeatsWith_default(eqBy_default(fn)))(list);
});
var dropRepeatsBy_default = dropRepeatsBy;

// source/internal/_xdropWhile.js
function XDropWhile(f, xf) {
  this.xf = xf;
  this.f = f;
}
__name(XDropWhile, "XDropWhile");
XDropWhile.prototype["@@transducer/init"] = xfBase_default.init;
XDropWhile.prototype["@@transducer/result"] = xfBase_default.result;
XDropWhile.prototype["@@transducer/step"] = function(result, input) {
  if (this.f) {
    if (this.f(input)) {
      return result;
    }
    this.f = null;
  }
  return this.xf["@@transducer/step"](result, input);
};
function _xdropWhile(f) {
  return function(xf) {
    return new XDropWhile(f, xf);
  };
}
__name(_xdropWhile, "_xdropWhile");

// source/dropWhile.js
var dropWhile = _curry2(_dispatchable(["dropWhile"], _xdropWhile, /* @__PURE__ */ __name(function dropWhile2(pred, xs) {
  var idx = 0;
  var len = xs.length;
  while (idx < len && pred(xs[idx])) {
    idx += 1;
  }
  return slice_default(idx, Infinity, xs);
}, "dropWhile")));
var dropWhile_default = dropWhile;

// source/or.js
var or = _curry2(/* @__PURE__ */ __name(function or2(a, b) {
  return a || b;
}, "or"));
var or_default = or;

// source/either.js
var either = _curry2(/* @__PURE__ */ __name(function either2(f, g) {
  return _isFunction(f) ? /* @__PURE__ */ __name(function _either() {
    return f.apply(this, arguments) || g.apply(this, arguments);
  }, "_either") : lift_default(or_default)(f, g);
}, "either"));
var either_default = either;

// source/internal/_isTypedArray.js
function _isTypedArray(val) {
  var type3 = Object.prototype.toString.call(val);
  return type3 === "[object Uint8ClampedArray]" || type3 === "[object Int8Array]" || type3 === "[object Uint8Array]" || type3 === "[object Int16Array]" || type3 === "[object Uint16Array]" || type3 === "[object Int32Array]" || type3 === "[object Uint32Array]" || type3 === "[object Float32Array]" || type3 === "[object Float64Array]" || type3 === "[object BigInt64Array]" || type3 === "[object BigUint64Array]";
}
__name(_isTypedArray, "_isTypedArray");

// source/empty.js
var empty = _curry1(/* @__PURE__ */ __name(function empty2(x) {
  return x != null && typeof x["fantasy-land/empty"] === "function" ? x["fantasy-land/empty"]() : x != null && x.constructor != null && typeof x.constructor["fantasy-land/empty"] === "function" ? x.constructor["fantasy-land/empty"]() : x != null && typeof x.empty === "function" ? x.empty() : x != null && x.constructor != null && typeof x.constructor.empty === "function" ? x.constructor.empty() : isArray_default(x) ? [] : _isString(x) ? "" : _isObject(x) ? {} : isArguments_default(x) ? /* @__PURE__ */ function() {
    return arguments;
  }() : _isTypedArray(x) ? x.constructor.from("") : void 0;
}, "empty"));
var empty_default = empty;

// source/takeLast.js
var takeLast = _curry2(/* @__PURE__ */ __name(function takeLast2(n, xs) {
  return drop_default(n >= 0 ? xs.length - n : 0, xs);
}, "takeLast"));
var takeLast_default = takeLast;

// source/endsWith.js
var endsWith = _curry2(function(suffix, list) {
  return equals_default(takeLast_default(suffix.length, list), suffix);
});
var endsWith_default = endsWith;

// source/eqProps.js
var eqProps = _curry3(/* @__PURE__ */ __name(function eqProps2(prop3, obj1, obj2) {
  return equals_default(obj1[prop3], obj2[prop3]);
}, "eqProps"));
var eqProps_default = eqProps;

// source/evolve.js
var evolve = _curry2(/* @__PURE__ */ __name(function evolve2(transformations, object) {
  if (!_isObject(object) && !isArray_default(object)) {
    return object;
  }
  var result = object instanceof Array ? [] : {};
  var transformation, key, type3;
  for (key in object) {
    transformation = transformations[key];
    type3 = typeof transformation;
    result[key] = type3 === "function" ? transformation(object[key]) : transformation && type3 === "object" ? evolve2(transformation, object[key]) : object[key];
  }
  return result;
}, "evolve"));
var evolve_default = evolve;

// source/internal/_xfind.js
function XFind(f, xf) {
  this.xf = xf;
  this.f = f;
  this.found = false;
}
__name(XFind, "XFind");
XFind.prototype["@@transducer/init"] = xfBase_default.init;
XFind.prototype["@@transducer/result"] = function(result) {
  if (!this.found) {
    result = this.xf["@@transducer/step"](result, void 0);
  }
  return this.xf["@@transducer/result"](result);
};
XFind.prototype["@@transducer/step"] = function(result, input) {
  if (this.f(input)) {
    this.found = true;
    result = _reduced(this.xf["@@transducer/step"](result, input));
  }
  return result;
};
function _xfind(f) {
  return function(xf) {
    return new XFind(f, xf);
  };
}
__name(_xfind, "_xfind");

// source/find.js
var find = _curry2(_dispatchable(["find"], _xfind, /* @__PURE__ */ __name(function find2(fn, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    if (fn(list[idx])) {
      return list[idx];
    }
    idx += 1;
  }
}, "find")));
var find_default = find;

// source/internal/_xfindIndex.js
function XFindIndex(f, xf) {
  this.xf = xf;
  this.f = f;
  this.idx = -1;
  this.found = false;
}
__name(XFindIndex, "XFindIndex");
XFindIndex.prototype["@@transducer/init"] = xfBase_default.init;
XFindIndex.prototype["@@transducer/result"] = function(result) {
  if (!this.found) {
    result = this.xf["@@transducer/step"](result, -1);
  }
  return this.xf["@@transducer/result"](result);
};
XFindIndex.prototype["@@transducer/step"] = function(result, input) {
  this.idx += 1;
  if (this.f(input)) {
    this.found = true;
    result = _reduced(this.xf["@@transducer/step"](result, this.idx));
  }
  return result;
};
function _xfindIndex(f) {
  return function(xf) {
    return new XFindIndex(f, xf);
  };
}
__name(_xfindIndex, "_xfindIndex");

// source/findIndex.js
var findIndex = _curry2(_dispatchable([], _xfindIndex, /* @__PURE__ */ __name(function findIndex2(fn, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    if (fn(list[idx])) {
      return idx;
    }
    idx += 1;
  }
  return -1;
}, "findIndex")));
var findIndex_default = findIndex;

// source/internal/_xfindLast.js
function XFindLast(f, xf) {
  this.xf = xf;
  this.f = f;
}
__name(XFindLast, "XFindLast");
XFindLast.prototype["@@transducer/init"] = xfBase_default.init;
XFindLast.prototype["@@transducer/result"] = function(result) {
  return this.xf["@@transducer/result"](this.xf["@@transducer/step"](result, this.last));
};
XFindLast.prototype["@@transducer/step"] = function(result, input) {
  if (this.f(input)) {
    this.last = input;
  }
  return result;
};
function _xfindLast(f) {
  return function(xf) {
    return new XFindLast(f, xf);
  };
}
__name(_xfindLast, "_xfindLast");

// source/findLast.js
var findLast = _curry2(_dispatchable([], _xfindLast, /* @__PURE__ */ __name(function findLast2(fn, list) {
  var idx = list.length - 1;
  while (idx >= 0) {
    if (fn(list[idx])) {
      return list[idx];
    }
    idx -= 1;
  }
}, "findLast")));
var findLast_default = findLast;

// source/internal/_xfindLastIndex.js
function XFindLastIndex(f, xf) {
  this.xf = xf;
  this.f = f;
  this.idx = -1;
  this.lastIdx = -1;
}
__name(XFindLastIndex, "XFindLastIndex");
XFindLastIndex.prototype["@@transducer/init"] = xfBase_default.init;
XFindLastIndex.prototype["@@transducer/result"] = function(result) {
  return this.xf["@@transducer/result"](this.xf["@@transducer/step"](result, this.lastIdx));
};
XFindLastIndex.prototype["@@transducer/step"] = function(result, input) {
  this.idx += 1;
  if (this.f(input)) {
    this.lastIdx = this.idx;
  }
  return result;
};
function _xfindLastIndex(f) {
  return function(xf) {
    return new XFindLastIndex(f, xf);
  };
}
__name(_xfindLastIndex, "_xfindLastIndex");

// source/findLastIndex.js
var findLastIndex = _curry2(_dispatchable([], _xfindLastIndex, /* @__PURE__ */ __name(function findLastIndex2(fn, list) {
  var idx = list.length - 1;
  while (idx >= 0) {
    if (fn(list[idx])) {
      return idx;
    }
    idx -= 1;
  }
  return -1;
}, "findLastIndex")));
var findLastIndex_default = findLastIndex;

// source/flatten.js
var flatten = _curry1(_makeFlat(true));
var flatten_default = flatten;

// source/flip.js
var flip = _curry1(/* @__PURE__ */ __name(function flip2(fn) {
  return curryN_default(fn.length, function(a, b) {
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = b;
    args[1] = a;
    return fn.apply(this, args);
  });
}, "flip"));
var flip_default = flip;

// source/forEach.js
var forEach = _curry2(_checkForMethod("forEach", /* @__PURE__ */ __name(function forEach2(fn, list) {
  var len = list.length;
  var idx = 0;
  while (idx < len) {
    fn(list[idx]);
    idx += 1;
  }
  return list;
}, "forEach")));
var forEach_default = forEach;

// source/forEachObjIndexed.js
var forEachObjIndexed = _curry2(/* @__PURE__ */ __name(function forEachObjIndexed2(fn, obj) {
  var keyList = keys_default(obj);
  var idx = 0;
  while (idx < keyList.length) {
    var key = keyList[idx];
    fn(obj[key], key, obj);
    idx += 1;
  }
  return obj;
}, "forEachObjIndexed"));
var forEachObjIndexed_default = forEachObjIndexed;

// source/fromPairs.js
var fromPairs = _curry1(/* @__PURE__ */ __name(function fromPairs2(pairs) {
  var result = {};
  var idx = 0;
  while (idx < pairs.length) {
    result[pairs[idx][0]] = pairs[idx][1];
    idx += 1;
  }
  return result;
}, "fromPairs"));
var fromPairs_default = fromPairs;

// source/groupBy.js
var groupBy = _curry2(_checkForMethod("groupBy", reduceBy_default(function(acc, item) {
  acc.push(item);
  return acc;
}, [])));
var groupBy_default = groupBy;

// source/groupWith.js
var groupWith = _curry2(function(fn, list) {
  var res = [];
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    var nextidx = idx + 1;
    while (nextidx < len && fn(list[nextidx - 1], list[nextidx])) {
      nextidx += 1;
    }
    res.push(list.slice(idx, nextidx));
    idx = nextidx;
  }
  return res;
});
var groupWith_default = groupWith;

// source/gt.js
var gt = _curry2(/* @__PURE__ */ __name(function gt2(a, b) {
  return a > b;
}, "gt"));
var gt_default = gt;

// source/gte.js
var gte = _curry2(/* @__PURE__ */ __name(function gte2(a, b) {
  return a >= b;
}, "gte"));
var gte_default = gte;

// source/hasPath.js
var hasPath = _curry2(/* @__PURE__ */ __name(function hasPath2(_path, obj) {
  if (_path.length === 0 || isNil_default(obj)) {
    return false;
  }
  var val = obj;
  var idx = 0;
  while (idx < _path.length) {
    if (!isNil_default(val) && _has(_path[idx], val)) {
      val = val[_path[idx]];
      idx += 1;
    } else {
      return false;
    }
  }
  return true;
}, "hasPath"));
var hasPath_default = hasPath;

// source/has.js
var has = _curry2(/* @__PURE__ */ __name(function has2(prop3, obj) {
  return hasPath_default([prop3], obj);
}, "has"));
var has_default = has;

// source/hasIn.js
var hasIn = _curry2(/* @__PURE__ */ __name(function hasIn2(prop3, obj) {
  if (isNil_default(obj)) {
    return false;
  }
  return prop3 in obj;
}, "hasIn"));
var hasIn_default = hasIn;

// source/identical.js
var identical = /* @__PURE__ */ __name(function(a, b) {
  switch (arguments.length) {
    case 0:
      return identical;
    case 1:
      return /* @__PURE__ */ function() {
        return /* @__PURE__ */ __name(function unaryIdentical(_b) {
          switch (arguments.length) {
            case 0:
              return unaryIdentical;
            default:
              return objectIs_default(a, _b);
          }
        }, "unaryIdentical");
      }();
    default:
      return objectIs_default(a, b);
  }
}, "identical");
var identical_default = identical;

// source/ifElse.js
var ifElse = _curry3(/* @__PURE__ */ __name(function ifElse2(condition, onTrue, onFalse) {
  return curryN_default(
    Math.max(condition.length, onTrue.length, onFalse.length),
    /* @__PURE__ */ __name(function _ifElse() {
      return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
    }, "_ifElse")
  );
}, "ifElse"));
var ifElse_default = ifElse;

// source/inc.js
var inc = add_default(1);
var inc_default = inc;

// source/includes.js
var includes = _curry2(_includes);
var includes_default = includes;

// source/indexBy.js
var indexBy = reduceBy_default(function(acc, elem) {
  return elem;
}, null);
var indexBy_default = indexBy;

// source/indexOf.js
var indexOf = _curry2(/* @__PURE__ */ __name(function indexOf2(target, xs) {
  return typeof xs.indexOf === "function" && !isArray_default(xs) ? xs.indexOf(target) : _indexOf(xs, target, 0);
}, "indexOf"));
var indexOf_default = indexOf;

// source/init.js
var init = slice_default(0, -1);
var init_default = init;

// source/innerJoin.js
var innerJoin = _curry3(/* @__PURE__ */ __name(function innerJoin2(pred, xs, ys) {
  return _filter(function(x) {
    return _includesWith(pred, x, ys);
  }, xs);
}, "innerJoin"));
var innerJoin_default = innerJoin;

// source/insert.js
var insert = _curry3(/* @__PURE__ */ __name(function insert2(idx, elt, list) {
  idx = idx < list.length && idx >= 0 ? idx : list.length;
  var result = Array.prototype.slice.call(list, 0);
  result.splice(idx, 0, elt);
  return result;
}, "insert"));
var insert_default = insert;

// source/insertAll.js
var insertAll = _curry3(/* @__PURE__ */ __name(function insertAll2(idx, elts, list) {
  idx = idx < list.length && idx >= 0 ? idx : list.length;
  return [].concat(
    Array.prototype.slice.call(list, 0, idx),
    elts,
    Array.prototype.slice.call(list, idx)
  );
}, "insertAll"));
var insertAll_default = insertAll;

// source/internal/_xuniqBy.js
function XUniqBy(f, xf) {
  this.xf = xf;
  this.f = f;
  this.set = new Set_default();
}
__name(XUniqBy, "XUniqBy");
XUniqBy.prototype["@@transducer/init"] = xfBase_default.init;
XUniqBy.prototype["@@transducer/result"] = xfBase_default.result;
XUniqBy.prototype["@@transducer/step"] = function(result, input) {
  return this.set.add(this.f(input)) ? this.xf["@@transducer/step"](result, input) : result;
};
function _xuniqBy(f) {
  return function(xf) {
    return new XUniqBy(f, xf);
  };
}
__name(_xuniqBy, "_xuniqBy");

// source/uniqBy.js
var uniqBy = _curry2(_dispatchable([], _xuniqBy, function(fn, list) {
  var set3 = new Set_default();
  var result = [];
  var idx = 0;
  var appliedItem, item;
  while (idx < list.length) {
    item = list[idx];
    appliedItem = fn(item);
    if (set3.add(appliedItem)) {
      result.push(item);
    }
    idx += 1;
  }
  return result;
}));
var uniqBy_default = uniqBy;

// source/uniq.js
var uniq = uniqBy_default(identity_default);
var uniq_default = uniq;

// source/intersection.js
var intersection = _curry2(/* @__PURE__ */ __name(function intersection2(list1, list2) {
  var toKeep = new Set_default();
  for (var i = 0; i < list1.length; i += 1) {
    toKeep.add(list1[i]);
  }
  return uniq_default(_filter(toKeep.has.bind(toKeep), list2));
}, "intersection"));
var intersection_default = intersection;

// source/intersperse.js
var intersperse = _curry2(_checkForMethod("intersperse", /* @__PURE__ */ __name(function intersperse2(separator, list) {
  var out = [];
  var idx = 0;
  var length3 = list.length;
  while (idx < length3) {
    if (idx === length3 - 1) {
      out.push(list[idx]);
    } else {
      out.push(list[idx], separator);
    }
    idx += 1;
  }
  return out;
}, "intersperse")));
var intersperse_default = intersperse;

// source/internal/_objectAssign.js
function _objectAssign(target) {
  if (target == null) {
    throw new TypeError("Cannot convert undefined or null to object");
  }
  var output = Object(target);
  var idx = 1;
  var length3 = arguments.length;
  while (idx < length3) {
    var source = arguments[idx];
    if (source != null) {
      for (var nextKey in source) {
        if (_has(nextKey, source)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
    idx += 1;
  }
  return output;
}
__name(_objectAssign, "_objectAssign");
var objectAssign_default = typeof Object.assign === "function" ? Object.assign : _objectAssign;

// source/objOf.js
var objOf = _curry2(/* @__PURE__ */ __name(function objOf2(key, val) {
  var obj = {};
  obj[key] = val;
  return obj;
}, "objOf"));
var objOf_default = objOf;

// source/internal/_stepCat.js
var _stepCatArray = {
  "@@transducer/init": Array,
  "@@transducer/step": function(xs, x) {
    xs.push(x);
    return xs;
  },
  "@@transducer/result": _identity
};
var _stepCatString = {
  "@@transducer/init": String,
  "@@transducer/step": function(a, b) {
    return a + b;
  },
  "@@transducer/result": _identity
};
var _stepCatObject = {
  "@@transducer/init": Object,
  "@@transducer/step": function(result, input) {
    return objectAssign_default(
      result,
      isArrayLike_default(input) ? objOf_default(input[0], input[1]) : input
    );
  },
  "@@transducer/result": _identity
};
function _stepCat(obj) {
  if (_isTransformer(obj)) {
    return obj;
  }
  if (isArrayLike_default(obj)) {
    return _stepCatArray;
  }
  if (typeof obj === "string") {
    return _stepCatString;
  }
  if (typeof obj === "object") {
    return _stepCatObject;
  }
  throw new Error("Cannot create transformer for " + obj);
}
__name(_stepCat, "_stepCat");

// source/into.js
var into = _curry3(/* @__PURE__ */ __name(function into2(acc, transducer, list) {
  var xf = transducer(_isTransformer(acc) ? acc : _stepCat(acc));
  return xReduce_default(xf, xf["@@transducer/init"](), list);
}, "into"));
var into_default = into;

// source/invert.js
var invert = _curry1(/* @__PURE__ */ __name(function invert2(obj) {
  var props3 = keys_default(obj);
  var len = props3.length;
  var idx = 0;
  var out = {};
  while (idx < len) {
    var key = props3[idx];
    var val = obj[key];
    var list = _has(val, out) ? out[val] : out[val] = [];
    list[list.length] = key;
    idx += 1;
  }
  return out;
}, "invert"));
var invert_default = invert;

// source/invertObj.js
var invertObj = _curry1(/* @__PURE__ */ __name(function invertObj2(obj) {
  var props3 = keys_default(obj);
  var len = props3.length;
  var idx = 0;
  var out = {};
  while (idx < len) {
    var key = props3[idx];
    out[obj[key]] = key;
    idx += 1;
  }
  return out;
}, "invertObj"));
var invertObj_default = invertObj;

// source/invoker.js
var invoker = _curry2(/* @__PURE__ */ __name(function invoker2(arity, method) {
  return curryN_default(arity + 1, function() {
    var target = arguments[arity];
    if (target != null && _isFunction(target[method])) {
      return target[method].apply(target, Array.prototype.slice.call(arguments, 0, arity));
    }
    throw new TypeError(toString_default(target) + ' does not have a method named "' + method + '"');
  });
}, "invoker"));
var invoker_default = invoker;

// source/is.js
var is = _curry2(/* @__PURE__ */ __name(function is2(Ctor, val) {
  return val instanceof Ctor || val != null && (val.constructor === Ctor || Ctor.name === "Object" && typeof val === "object");
}, "is"));
var is_default = is;

// source/isEmpty.js
var isEmpty = _curry1(/* @__PURE__ */ __name(function isEmpty2(x) {
  return x != null && equals_default(x, empty_default(x));
}, "isEmpty"));
var isEmpty_default = isEmpty;

// source/isNotNil.js
var isNotNil = _curry1(/* @__PURE__ */ __name(function isNotNil2(x) {
  return !isNil_default(x);
}, "isNotNil"));
var isNotNil_default = isNotNil;

// source/join.js
var join = invoker_default(1, "join");
var join_default = join;

// source/juxt.js
var juxt = _curry1(/* @__PURE__ */ __name(function juxt2(fns) {
  return converge_default(function() {
    return Array.prototype.slice.call(arguments, 0);
  }, fns);
}, "juxt"));
var juxt_default = juxt;

// source/keysIn.js
var keysIn = _curry1(/* @__PURE__ */ __name(function keysIn2(obj) {
  var prop3;
  var ks = [];
  for (prop3 in obj) {
    ks[ks.length] = prop3;
  }
  return ks;
}, "keysIn"));
var keysIn_default = keysIn;

// source/lastIndexOf.js
var lastIndexOf = _curry2(/* @__PURE__ */ __name(function lastIndexOf2(target, xs) {
  if (typeof xs.lastIndexOf === "function" && !isArray_default(xs)) {
    return xs.lastIndexOf(target);
  } else {
    var idx = xs.length - 1;
    while (idx >= 0) {
      if (equals_default(xs[idx], target)) {
        return idx;
      }
      idx -= 1;
    }
    return -1;
  }
}, "lastIndexOf"));
var lastIndexOf_default = lastIndexOf;

// source/internal/_isNumber.js
function _isNumber(x) {
  return Object.prototype.toString.call(x) === "[object Number]";
}
__name(_isNumber, "_isNumber");

// source/length.js
var length = _curry1(/* @__PURE__ */ __name(function length2(list) {
  return list != null && _isNumber(list.length) ? list.length : NaN;
}, "length"));
var length_default = length;

// source/lens.js
var lens = _curry2(/* @__PURE__ */ __name(function lens2(getter, setter) {
  return function(toFunctorFn) {
    return function(target) {
      return map_default(
        function(focus) {
          return setter(focus, target);
        },
        toFunctorFn(getter(target))
      );
    };
  };
}, "lens"));
var lens_default = lens;

// source/update.js
var update = _curry3(/* @__PURE__ */ __name(function update2(idx, x, list) {
  return adjust_default(idx, always_default(x), list);
}, "update"));
var update_default = update;

// source/lensIndex.js
var lensIndex = _curry1(/* @__PURE__ */ __name(function lensIndex2(n) {
  return lens_default(nth_default(n), update_default(n));
}, "lensIndex"));
var lensIndex_default = lensIndex;

// source/paths.js
var paths = _curry2(/* @__PURE__ */ __name(function paths2(pathsArray, obj) {
  return pathsArray.map(function(paths3) {
    var val = obj;
    var idx = 0;
    var p;
    while (idx < paths3.length) {
      if (val == null) {
        return;
      }
      p = paths3[idx];
      val = isInteger_default(p) ? nth_default(p, val) : val[p];
      idx += 1;
    }
    return val;
  });
}, "paths"));
var paths_default = paths;

// source/path.js
var path = _curry2(/* @__PURE__ */ __name(function path2(pathAr, obj) {
  return paths_default([pathAr], obj)[0];
}, "path"));
var path_default = path;

// source/lensPath.js
var lensPath = _curry1(/* @__PURE__ */ __name(function lensPath2(p) {
  return lens_default(path_default(p), assocPath_default(p));
}, "lensPath"));
var lensPath_default = lensPath;

// source/lensProp.js
var lensProp = _curry1(/* @__PURE__ */ __name(function lensProp2(k) {
  return lens_default(prop_default(k), assoc_default(k));
}, "lensProp"));
var lensProp_default = lensProp;

// source/lt.js
var lt = _curry2(/* @__PURE__ */ __name(function lt2(a, b) {
  return a < b;
}, "lt"));
var lt_default = lt;

// source/lte.js
var lte = _curry2(/* @__PURE__ */ __name(function lte2(a, b) {
  return a <= b;
}, "lte"));
var lte_default = lte;

// source/mapAccum.js
var mapAccum = _curry3(/* @__PURE__ */ __name(function mapAccum2(fn, acc, list) {
  var idx = 0;
  var len = list.length;
  var result = [];
  var tuple = [acc];
  while (idx < len) {
    tuple = fn(tuple[0], list[idx]);
    result[idx] = tuple[1];
    idx += 1;
  }
  return [tuple[0], result];
}, "mapAccum"));
var mapAccum_default = mapAccum;

// source/mapAccumRight.js
var mapAccumRight = _curry3(/* @__PURE__ */ __name(function mapAccumRight2(fn, acc, list) {
  var idx = list.length - 1;
  var result = [];
  var tuple = [acc];
  while (idx >= 0) {
    tuple = fn(tuple[0], list[idx]);
    result[idx] = tuple[1];
    idx -= 1;
  }
  return [tuple[0], result];
}, "mapAccumRight"));
var mapAccumRight_default = mapAccumRight;

// source/mapObjIndexed.js
var mapObjIndexed = _curry2(/* @__PURE__ */ __name(function mapObjIndexed2(fn, obj) {
  return _arrayReduce(function(acc, key) {
    acc[key] = fn(obj[key], key, obj);
    return acc;
  }, {}, keys_default(obj));
}, "mapObjIndexed"));
var mapObjIndexed_default = mapObjIndexed;

// source/match.js
var match = _curry2(/* @__PURE__ */ __name(function match2(rx, str) {
  return str.match(rx) || [];
}, "match"));
var match_default = match;

// source/mathMod.js
var mathMod = _curry2(/* @__PURE__ */ __name(function mathMod2(m, p) {
  if (!isInteger_default(m)) {
    return NaN;
  }
  if (!isInteger_default(p) || p < 1) {
    return NaN;
  }
  return (m % p + p) % p;
}, "mathMod"));
var mathMod_default = mathMod;

// source/maxBy.js
var maxBy = _curry3(/* @__PURE__ */ __name(function maxBy2(f, a, b) {
  var resultB = f(b);
  return max_default(f(a), resultB) === resultB ? b : a;
}, "maxBy"));
var maxBy_default = maxBy;

// source/sum.js
var sum = reduce_default(add_default, 0);
var sum_default = sum;

// source/mean.js
var mean = _curry1(/* @__PURE__ */ __name(function mean2(list) {
  return sum_default(list) / list.length;
}, "mean"));
var mean_default = mean;

// source/median.js
var median = _curry1(/* @__PURE__ */ __name(function median2(list) {
  var len = list.length;
  if (len === 0) {
    return NaN;
  }
  var width = 2 - len % 2;
  var idx = (len - width) / 2;
  return mean_default(Array.prototype.slice.call(list, 0).sort(function(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }).slice(idx, idx + width));
}, "median"));
var median_default = median;

// source/memoizeWith.js
var memoizeWith = _curry2(/* @__PURE__ */ __name(function memoizeWith2(keyGen, fn) {
  var cache = {};
  return _arity(fn.length, function() {
    var key = keyGen.apply(this, arguments);
    if (!_has(key, cache)) {
      cache[key] = fn.apply(this, arguments);
    }
    return cache[key];
  });
}, "memoizeWith"));
var memoizeWith_default = memoizeWith;

// source/mergeAll.js
var mergeAll = _curry1(/* @__PURE__ */ __name(function mergeAll2(list) {
  return objectAssign_default.apply(null, [{}].concat(list));
}, "mergeAll"));
var mergeAll_default = mergeAll;

// source/mergeWithKey.js
var mergeWithKey = _curry3(/* @__PURE__ */ __name(function mergeWithKey2(fn, l, r) {
  var result = {};
  var k;
  l = l || {};
  r = r || {};
  for (k in l) {
    if (_has(k, l)) {
      result[k] = _has(k, r) ? fn(k, l[k], r[k]) : l[k];
    }
  }
  for (k in r) {
    if (_has(k, r) && !_has(k, result)) {
      result[k] = r[k];
    }
  }
  return result;
}, "mergeWithKey"));
var mergeWithKey_default = mergeWithKey;

// source/mergeDeepWithKey.js
var mergeDeepWithKey = _curry3(/* @__PURE__ */ __name(function mergeDeepWithKey2(fn, lObj, rObj) {
  return mergeWithKey_default(function(k, lVal, rVal) {
    if (_isObject(lVal) && _isObject(rVal)) {
      return mergeDeepWithKey2(fn, lVal, rVal);
    } else {
      return fn(k, lVal, rVal);
    }
  }, lObj, rObj);
}, "mergeDeepWithKey"));
var mergeDeepWithKey_default = mergeDeepWithKey;

// source/mergeDeepLeft.js
var mergeDeepLeft = _curry2(/* @__PURE__ */ __name(function mergeDeepLeft2(lObj, rObj) {
  return mergeDeepWithKey_default(function(k, lVal, rVal) {
    return lVal;
  }, lObj, rObj);
}, "mergeDeepLeft"));
var mergeDeepLeft_default = mergeDeepLeft;

// source/mergeDeepRight.js
var mergeDeepRight = _curry2(/* @__PURE__ */ __name(function mergeDeepRight2(lObj, rObj) {
  return mergeDeepWithKey_default(function(k, lVal, rVal) {
    return rVal;
  }, lObj, rObj);
}, "mergeDeepRight"));
var mergeDeepRight_default = mergeDeepRight;

// source/mergeDeepWith.js
var mergeDeepWith = _curry3(/* @__PURE__ */ __name(function mergeDeepWith2(fn, lObj, rObj) {
  return mergeDeepWithKey_default(function(k, lVal, rVal) {
    return fn(lVal, rVal);
  }, lObj, rObj);
}, "mergeDeepWith"));
var mergeDeepWith_default = mergeDeepWith;

// source/mergeLeft.js
var mergeLeft = _curry2(/* @__PURE__ */ __name(function mergeLeft2(l, r) {
  return objectAssign_default({}, r, l);
}, "mergeLeft"));
var mergeLeft_default = mergeLeft;

// source/mergeRight.js
var mergeRight = _curry2(/* @__PURE__ */ __name(function mergeRight2(l, r) {
  return objectAssign_default({}, l, r);
}, "mergeRight"));
var mergeRight_default = mergeRight;

// source/mergeWith.js
var mergeWith = _curry3(/* @__PURE__ */ __name(function mergeWith2(fn, l, r) {
  return mergeWithKey_default(function(_, _l, _r) {
    return fn(_l, _r);
  }, l, r);
}, "mergeWith"));
var mergeWith_default = mergeWith;

// source/min.js
var min = _curry2(/* @__PURE__ */ __name(function min2(a, b) {
  if (a === b) {
    return a;
  }
  function safeMin(x, y) {
    if (x < y !== y < x) {
      return y < x ? y : x;
    }
    return void 0;
  }
  __name(safeMin, "safeMin");
  var minByValue = safeMin(a, b);
  if (minByValue !== void 0) {
    return minByValue;
  }
  var minByType = safeMin(typeof a, typeof b);
  if (minByType !== void 0) {
    return minByType === typeof a ? a : b;
  }
  var stringA = toString_default(a);
  var minByStringValue = safeMin(stringA, toString_default(b));
  if (minByStringValue !== void 0) {
    return minByStringValue === stringA ? a : b;
  }
  return a;
}, "min"));
var min_default = min;

// source/minBy.js
var minBy = _curry3(/* @__PURE__ */ __name(function minBy2(f, a, b) {
  var resultB = f(b);
  return min_default(f(a), resultB) === resultB ? b : a;
}, "minBy"));
var minBy_default = minBy;

// source/internal/_modify.js
function _modify(prop3, fn, obj) {
  if (isInteger_default(prop3) && isArray_default(obj)) {
    var arr = [].concat(obj);
    arr[prop3] = fn(arr[prop3]);
    return arr;
  }
  var result = {};
  for (var p in obj) {
    result[p] = obj[p];
  }
  result[prop3] = fn(result[prop3]);
  return result;
}
__name(_modify, "_modify");

// source/modifyPath.js
var modifyPath = _curry3(/* @__PURE__ */ __name(function modifyPath2(path3, fn, object) {
  if (!_isObject(object) && !isArray_default(object)) {
    return object;
  }
  if (path3.length === 0) {
    return fn(object);
  }
  var idx = path3[0];
  if (!_has(idx, object)) {
    return object;
  }
  if (path3.length === 1) {
    return _modify(idx, fn, object);
  }
  var val = modifyPath2(Array.prototype.slice.call(path3, 1), fn, object[idx]);
  if (val === object[idx]) {
    return object;
  }
  return _assoc(idx, val, object);
}, "modifyPath"));
var modifyPath_default = modifyPath;

// source/modify.js
var modify = _curry3(/* @__PURE__ */ __name(function modify2(prop3, fn, object) {
  return modifyPath_default([prop3], fn, object);
}, "modify"));
var modify_default = modify;

// source/modulo.js
var modulo = _curry2(/* @__PURE__ */ __name(function modulo2(a, b) {
  return a % b;
}, "modulo"));
var modulo_default = modulo;

// source/move.js
var move = _curry3(function(from, to, list) {
  var length3 = list.length;
  var result = list.slice();
  var positiveFrom = from < 0 ? length3 + from : from;
  var positiveTo = to < 0 ? length3 + to : to;
  var item = result.splice(positiveFrom, 1);
  return positiveFrom < 0 || positiveFrom >= list.length || positiveTo < 0 || positiveTo >= list.length ? list : [].concat(result.slice(0, positiveTo)).concat(item).concat(result.slice(positiveTo, list.length));
});
var move_default = move;

// source/multiply.js
var multiply = _curry2(/* @__PURE__ */ __name(function multiply2(a, b) {
  return a * b;
}, "multiply"));
var multiply_default = multiply;

// source/partialObject.js
var partialObject = _curry2((f, o3) => (props3) => f.call(void 0, mergeDeepRight_default(o3, props3)));
var partialObject_default = partialObject;

// source/negate.js
var negate = _curry1(/* @__PURE__ */ __name(function negate2(n) {
  return -n;
}, "negate"));
var negate_default = negate;

// source/none.js
var none = _curry2(/* @__PURE__ */ __name(function none2(fn, input) {
  return all_default(_complement(fn), input);
}, "none"));
var none_default = none;

// source/nthArg.js
var nthArg = _curry1(/* @__PURE__ */ __name(function nthArg2(n) {
  var arity = n < 0 ? 1 : n + 1;
  return curryN_default(arity, function() {
    return nth_default(n, arguments);
  });
}, "nthArg"));
var nthArg_default = nthArg;

// source/o.js
var o = _curry3(/* @__PURE__ */ __name(function o2(f, g, x) {
  return f(g(x));
}, "o"));
var o_default = o;

// source/of.js
var of = _curry2(/* @__PURE__ */ __name(function of2(Ctor, val) {
  return typeof Ctor["fantasy-land/of"] === "function" ? Ctor["fantasy-land/of"](val) : typeof Ctor.of === "function" ? Ctor.of(val) : [val];
}, "of"));
var of_default = of;

// source/omit.js
var omit = _curry2(/* @__PURE__ */ __name(function omit2(names, obj) {
  var result = {};
  var index = {};
  var idx = 0;
  var len = names.length;
  while (idx < len) {
    index[names[idx]] = 1;
    idx += 1;
  }
  for (var prop3 in obj) {
    if (!index.hasOwnProperty(prop3)) {
      result[prop3] = obj[prop3];
    }
  }
  return result;
}, "omit"));
var omit_default = omit;

// source/on.js
var on = _curryN(4, [], /* @__PURE__ */ __name(function on2(f, g, a, b) {
  return f(g(a), g(b));
}, "on"));
var on_default = on;

// source/once.js
var once = _curry1(/* @__PURE__ */ __name(function once2(fn) {
  var called = false;
  var result;
  return _arity(fn.length, function() {
    if (called) {
      return result;
    }
    called = true;
    result = fn.apply(this, arguments);
    return result;
  });
}, "once"));
var once_default = once;

// source/internal/_assertPromise.js
function _assertPromise(name, p) {
  if (p == null || !_isFunction(p.then)) {
    throw new TypeError("`" + name + "` expected a Promise, received " + _toString(p, []));
  }
}
__name(_assertPromise, "_assertPromise");

// source/otherwise.js
var otherwise = _curry2(/* @__PURE__ */ __name(function otherwise2(f, p) {
  _assertPromise("otherwise", p);
  return p.then(null, f);
}, "otherwise"));
var otherwise_default = otherwise;

// source/over.js
var Identity = /* @__PURE__ */ __name(function(x) {
  return { value: x, map: function(f) {
    return Identity(f(x));
  } };
}, "Identity");
var over = _curry3(/* @__PURE__ */ __name(function over2(lens3, f, x) {
  return lens3(function(y) {
    return Identity(f(y));
  })(x).value;
}, "over"));
var over_default = over;

// source/pair.js
var pair = _curry2(/* @__PURE__ */ __name(function pair2(fst, snd) {
  return [fst, snd];
}, "pair"));
var pair_default = pair;

// source/internal/_createPartialApplicator.js
function _createPartialApplicator(concat3) {
  return _curry2(function(fn, args) {
    return _arity(Math.max(0, fn.length - args.length), function() {
      return fn.apply(this, concat3(args, arguments));
    });
  });
}
__name(_createPartialApplicator, "_createPartialApplicator");

// source/partial.js
var partial = _createPartialApplicator(_concat);
var partial_default = partial;

// source/partialRight.js
var partialRight = _createPartialApplicator(flip_default(_concat));
var partialRight_default = partialRight;

// source/partition.js
var partition = juxt_default([filter_default, reject_default]);
var partition_default = partition;

// source/pathEq.js
var pathEq = _curry3(/* @__PURE__ */ __name(function pathEq2(val, _path, obj) {
  return equals_default(path_default(_path, obj), val);
}, "pathEq"));
var pathEq_default = pathEq;

// source/pathOr.js
var pathOr = _curry3(/* @__PURE__ */ __name(function pathOr2(d, p, obj) {
  return defaultTo_default(d, path_default(p, obj));
}, "pathOr"));
var pathOr_default = pathOr;

// source/pathSatisfies.js
var pathSatisfies = _curry3(/* @__PURE__ */ __name(function pathSatisfies2(pred, propPath, obj) {
  return pred(path_default(propPath, obj));
}, "pathSatisfies"));
var pathSatisfies_default = pathSatisfies;

// source/pick.js
var pick = _curry2(/* @__PURE__ */ __name(function pick2(names, obj) {
  var result = {};
  var idx = 0;
  while (idx < names.length) {
    if (names[idx] in obj) {
      result[names[idx]] = obj[names[idx]];
    }
    idx += 1;
  }
  return result;
}, "pick"));
var pick_default = pick;

// source/pickAll.js
var pickAll = _curry2(/* @__PURE__ */ __name(function pickAll2(names, obj) {
  var result = {};
  var idx = 0;
  var len = names.length;
  while (idx < len) {
    var name = names[idx];
    result[name] = obj[name];
    idx += 1;
  }
  return result;
}, "pickAll"));
var pickAll_default = pickAll;

// source/pickBy.js
var pickBy = _curry2(/* @__PURE__ */ __name(function pickBy2(test3, obj) {
  var result = {};
  for (var prop3 in obj) {
    if (test3(obj[prop3], prop3, obj)) {
      result[prop3] = obj[prop3];
    }
  }
  return result;
}, "pickBy"));
var pickBy_default = pickBy;

// source/prepend.js
var prepend = _curry2(/* @__PURE__ */ __name(function prepend2(el, list) {
  return _concat([el], list);
}, "prepend"));
var prepend_default = prepend;

// source/product.js
var product = reduce_default(multiply_default, 1);
var product_default = product;

// source/useWith.js
var useWith = _curry2(/* @__PURE__ */ __name(function useWith2(fn, transformers) {
  return curryN_default(transformers.length, function() {
    var args = [];
    var idx = 0;
    while (idx < transformers.length) {
      args.push(transformers[idx].call(this, arguments[idx]));
      idx += 1;
    }
    return fn.apply(this, args.concat(Array.prototype.slice.call(arguments, transformers.length)));
  });
}, "useWith"));
var useWith_default = useWith;

// source/project.js
var project = useWith_default(_map, [pickAll_default, identity_default]);
var project_default = project;

// source/internal/_promap.js
function _promap(f, g, profunctor) {
  return function(x) {
    return g(profunctor(f(x)));
  };
}
__name(_promap, "_promap");

// source/internal/_xpromap.js
function XPromap(f, g, xf) {
  this.xf = xf;
  this.f = f;
  this.g = g;
}
__name(XPromap, "XPromap");
XPromap.prototype["@@transducer/init"] = xfBase_default.init;
XPromap.prototype["@@transducer/result"] = xfBase_default.result;
XPromap.prototype["@@transducer/step"] = function(result, input) {
  return this.xf["@@transducer/step"](result, _promap(this.f, this.g, input));
};
function _xpromap(f, g) {
  return function(xf) {
    return new XPromap(f, g, xf);
  };
}
__name(_xpromap, "_xpromap");

// source/promap.js
var promap = _curry3(_dispatchable(["fantasy-land/promap", "promap"], _xpromap, _promap));
var promap_default = promap;

// source/propEq.js
var propEq = _curry3(/* @__PURE__ */ __name(function propEq2(val, name, obj) {
  return equals_default(val, prop_default(name, obj));
}, "propEq"));
var propEq_default = propEq;

// source/propIs.js
var propIs = _curry3(/* @__PURE__ */ __name(function propIs2(type3, name, obj) {
  return is_default(type3, prop_default(name, obj));
}, "propIs"));
var propIs_default = propIs;

// source/propOr.js
var propOr = _curry3(/* @__PURE__ */ __name(function propOr2(val, p, obj) {
  return defaultTo_default(val, prop_default(p, obj));
}, "propOr"));
var propOr_default = propOr;

// source/propSatisfies.js
var propSatisfies = _curry3(/* @__PURE__ */ __name(function propSatisfies2(pred, name, obj) {
  return pred(prop_default(name, obj));
}, "propSatisfies"));
var propSatisfies_default = propSatisfies;

// source/props.js
var props = _curry2(/* @__PURE__ */ __name(function props2(ps, obj) {
  return ps.map(function(p) {
    return path_default([p], obj);
  });
}, "props"));
var props_default = props;

// source/range.js
var range = _curry2(/* @__PURE__ */ __name(function range2(from, to) {
  if (!(_isNumber(from) && _isNumber(to))) {
    throw new TypeError("Both arguments to range must be numbers");
  }
  var result = [];
  var n = from;
  while (n < to) {
    result.push(n);
    n += 1;
  }
  return result;
}, "range"));
var range_default = range;

// source/reduceRight.js
var reduceRight = _curry3(/* @__PURE__ */ __name(function reduceRight2(fn, acc, list) {
  var idx = list.length - 1;
  while (idx >= 0) {
    acc = fn(list[idx], acc);
    if (acc && acc["@@transducer/reduced"]) {
      acc = acc["@@transducer/value"];
      break;
    }
    idx -= 1;
  }
  return acc;
}, "reduceRight"));
var reduceRight_default = reduceRight;

// source/reduceWhile.js
var reduceWhile = _curryN(4, [], /* @__PURE__ */ __name(function _reduceWhile(pred, fn, a, list) {
  var xf = _xwrap(function(acc, x) {
    return pred(acc, x) ? fn(acc, x) : _reduced(acc);
  });
  return xReduce_default(xf, a, list);
}, "_reduceWhile"));
var reduceWhile_default = reduceWhile;

// source/reduced.js
var reduced = _curry1(_reduced);
var reduced_default = reduced;

// source/times.js
var times = _curry2(/* @__PURE__ */ __name(function times2(fn, n) {
  var len = Number(n);
  var idx = 0;
  var list;
  if (len < 0 || isNaN(len)) {
    throw new RangeError("n must be a non-negative number");
  }
  list = [];
  while (idx < len) {
    list.push(fn(idx));
    idx += 1;
  }
  return list;
}, "times"));
var times_default = times;

// source/repeat.js
var repeat = _curry2(/* @__PURE__ */ __name(function repeat2(value, n) {
  return times_default(always_default(value), n);
}, "repeat"));
var repeat_default = repeat;

// source/replace.js
var replace = _curry3(/* @__PURE__ */ __name(function replace2(regex, replacement, str) {
  return str.replace(regex, replacement);
}, "replace"));
var replace_default = replace;

// source/internal/_xscan.js
var tInit2 = "@@transducer/init";
var tStep2 = "@@transducer/step";
function XScan(reducer, acc, xf) {
  this.xf = xf;
  this.f = reducer;
  this.acc = acc;
}
__name(XScan, "XScan");
XScan.prototype[tInit2] = function() {
  return this.xf[tStep2](this.xf[tInit2](), this.acc);
};
XScan.prototype["@@transducer/result"] = xfBase_default.result;
XScan.prototype[tStep2] = function(result, input) {
  if (result["@@transducer/reduced"]) {
    return result;
  }
  this.acc = this.f(this.acc, input);
  return this.xf[tStep2](result, this.acc);
};
var _xscan = _curry3(/* @__PURE__ */ __name(function _xscan2(reducer, acc, xf) {
  return new XScan(reducer, acc, xf);
}, "_xscan"));
var xscan_default = _xscan;

// source/scan.js
var scan = _curry3(_dispatchable([], xscan_default, /* @__PURE__ */ __name(function scan2(fn, acc, list) {
  var idx = 0;
  var len = list.length;
  var result = [acc];
  while (idx < len) {
    acc = fn(acc, list[idx]);
    result[idx + 1] = acc;
    idx += 1;
  }
  return result;
}, "scan")));
var scan_default = scan;

// source/sequence.js
var sequence = _curry2(/* @__PURE__ */ __name(function sequence2(F2, traversable) {
  var of3 = typeof F2["fantasy-land/of"] === "function" ? F2["fantasy-land/of"] : typeof F2.of === "function" ? F2.of : F2;
  var TypeRep = { "fantasy-land/of": of3 };
  return typeof traversable["fantasy-land/traverse"] === "function" ? traversable["fantasy-land/traverse"](TypeRep, _identity) : typeof traversable.traverse === "function" ? traversable.traverse(TypeRep, _identity) : reduceRight_default(
    function(x, acc) {
      return ap_default(map_default(prepend_default, x), acc);
    },
    of3([]),
    traversable
  );
}, "sequence"));
var sequence_default = sequence;

// source/set.js
var set = _curry3(/* @__PURE__ */ __name(function set2(lens3, v, x) {
  return over_default(lens3, always_default(v), x);
}, "set"));
var set_default = set;

// source/sort.js
var sort = _curry2(/* @__PURE__ */ __name(function sort2(comparator3, list) {
  return Array.prototype.slice.call(list, 0).sort(comparator3);
}, "sort"));
var sort_default = sort;

// source/sortBy.js
var sortBy = _curry2(/* @__PURE__ */ __name(function sortBy2(fn, list) {
  return Array.prototype.slice.call(list, 0).sort(function(a, b) {
    var aa = fn(a);
    var bb = fn(b);
    return aa < bb ? -1 : aa > bb ? 1 : 0;
  });
}, "sortBy"));
var sortBy_default = sortBy;

// source/sortWith.js
var sortWith = _curry2(/* @__PURE__ */ __name(function sortWith2(fns, list) {
  return Array.prototype.slice.call(list, 0).sort(function(a, b) {
    var result = 0;
    var i = 0;
    while (result === 0 && i < fns.length) {
      result = fns[i](a, b);
      i += 1;
    }
    return result;
  });
}, "sortWith"));
var sortWith_default = sortWith;

// source/split.js
var split = invoker_default(1, "split");
var split_default = split;

// source/splitAt.js
var splitAt = _curry2(/* @__PURE__ */ __name(function splitAt2(index, array) {
  return [slice_default(0, index, array), slice_default(index, length_default(array), array)];
}, "splitAt"));
var splitAt_default = splitAt;

// source/splitEvery.js
var splitEvery = _curry2(/* @__PURE__ */ __name(function splitEvery2(n, list) {
  if (n <= 0) {
    throw new Error("First argument to splitEvery must be a positive integer");
  }
  var result = [];
  var idx = 0;
  while (idx < list.length) {
    result.push(slice_default(idx, idx += n, list));
  }
  return result;
}, "splitEvery"));
var splitEvery_default = splitEvery;

// source/splitWhen.js
var splitWhen = _curry2(/* @__PURE__ */ __name(function splitWhen2(pred, list) {
  var idx = 0;
  var len = list.length;
  var prefix = [];
  while (idx < len && !pred(list[idx])) {
    prefix.push(list[idx]);
    idx += 1;
  }
  return [prefix, Array.prototype.slice.call(list, idx)];
}, "splitWhen"));
var splitWhen_default = splitWhen;

// source/splitWhenever.js
var splitWhenever = _curryN(2, [], /* @__PURE__ */ __name(function splitWhenever2(pred, list) {
  var acc = [];
  var curr = [];
  for (var i = 0; i < list.length; i = i + 1) {
    if (!pred(list[i])) {
      curr.push(list[i]);
    }
    if ((i < list.length - 1 && pred(list[i + 1]) || i === list.length - 1) && curr.length > 0) {
      acc.push(curr);
      curr = [];
    }
  }
  return acc;
}, "splitWhenever"));
var splitWhenever_default = splitWhenever;

// source/startsWith.js
var startsWith = _curry2(function(prefix, list) {
  return equals_default(take_default(prefix.length, list), prefix);
});
var startsWith_default = startsWith;

// source/subtract.js
var subtract = _curry2(/* @__PURE__ */ __name(function subtract2(a, b) {
  return Number(a) - Number(b);
}, "subtract"));
var subtract_default = subtract;

// source/swap.js
var swapObject = /* @__PURE__ */ __name(function(indexA, indexB, o3) {
  var copy = clone_default(o3);
  var properties = Object.getOwnPropertyNames(copy);
  if (properties.includes(indexA) && properties.includes(indexB)) {
    var tmp = copy[indexA];
    copy[indexA] = copy[indexB];
    copy[indexB] = tmp;
  }
  return copy;
}, "swapObject");
var swapList = /* @__PURE__ */ __name(function(indexA, indexB, list) {
  var length3 = list.length;
  var result = list.slice();
  var positiveIndexA = indexA < 0 ? length3 + indexA : indexA;
  var positiveIndexB = indexB < 0 ? length3 + indexB : indexB;
  var positiveMin = Math.min(positiveIndexA, positiveIndexB);
  var positiveMax = Math.max(positiveIndexA, positiveIndexB);
  if (positiveIndexA < 0 || positiveIndexA > length3) {
    return result;
  }
  if (positiveIndexB < 0 || positiveIndexB > length3) {
    return result;
  }
  if (positiveIndexA === positiveIndexB) {
    return result;
  }
  result = [].concat(result.slice(0, positiveMin)).concat([result[positiveMax]]).concat(result.slice(positiveMin + 1, positiveMax)).concat([result[positiveMin]]).concat(result.slice(positiveMax + 1, length3));
  return result;
}, "swapList");
var swapString = /* @__PURE__ */ __name(function(indexA, indexB, s) {
  var result = swapList(indexA, indexB, s);
  return isArray_default(result) ? result.join("") : result;
}, "swapString");
var swap = _curry3(function(indexA, indexB, o3) {
  if (isArray_default(o3)) {
    return swapList(indexA, indexB, o3);
  } else if (_isString(o3)) {
    return swapString(indexA, indexB, o3);
  } else {
    return swapObject(indexA, indexB, o3);
  }
});
var swap_default = swap;

// source/symmetricDifference.js
var symmetricDifference = _curry2(/* @__PURE__ */ __name(function symmetricDifference2(list1, list2) {
  return concat_default(difference_default(list1, list2), difference_default(list2, list1));
}, "symmetricDifference"));
var symmetricDifference_default = symmetricDifference;

// source/symmetricDifferenceWith.js
var symmetricDifferenceWith = _curry3(/* @__PURE__ */ __name(function symmetricDifferenceWith2(pred, list1, list2) {
  return concat_default(differenceWith_default(pred, list1, list2), differenceWith_default(pred, list2, list1));
}, "symmetricDifferenceWith"));
var symmetricDifferenceWith_default = symmetricDifferenceWith;

// source/takeLastWhile.js
var takeLastWhile = _curry2(/* @__PURE__ */ __name(function takeLastWhile2(fn, xs) {
  var idx = xs.length - 1;
  while (idx >= 0 && fn(xs[idx])) {
    idx -= 1;
  }
  return slice_default(idx + 1, Infinity, xs);
}, "takeLastWhile"));
var takeLastWhile_default = takeLastWhile;

// source/internal/_xtakeWhile.js
function XTakeWhile(f, xf) {
  this.xf = xf;
  this.f = f;
}
__name(XTakeWhile, "XTakeWhile");
XTakeWhile.prototype["@@transducer/init"] = xfBase_default.init;
XTakeWhile.prototype["@@transducer/result"] = xfBase_default.result;
XTakeWhile.prototype["@@transducer/step"] = function(result, input) {
  return this.f(input) ? this.xf["@@transducer/step"](result, input) : _reduced(result);
};
function _xtakeWhile(f) {
  return function(xf) {
    return new XTakeWhile(f, xf);
  };
}
__name(_xtakeWhile, "_xtakeWhile");

// source/takeWhile.js
var takeWhile = _curry2(_dispatchable(["takeWhile"], _xtakeWhile, /* @__PURE__ */ __name(function takeWhile2(fn, xs) {
  var idx = 0;
  var len = xs.length;
  while (idx < len && fn(xs[idx])) {
    idx += 1;
  }
  return slice_default(0, idx, xs);
}, "takeWhile")));
var takeWhile_default = takeWhile;

// source/internal/_xtap.js
function XTap(f, xf) {
  this.xf = xf;
  this.f = f;
}
__name(XTap, "XTap");
XTap.prototype["@@transducer/init"] = xfBase_default.init;
XTap.prototype["@@transducer/result"] = xfBase_default.result;
XTap.prototype["@@transducer/step"] = function(result, input) {
  this.f(input);
  return this.xf["@@transducer/step"](result, input);
};
function _xtap(f) {
  return function(xf) {
    return new XTap(f, xf);
  };
}
__name(_xtap, "_xtap");

// source/tap.js
var tap = _curry2(_dispatchable([], _xtap, /* @__PURE__ */ __name(function tap2(fn, x) {
  fn(x);
  return x;
}, "tap")));
var tap_default = tap;

// source/internal/_isRegExp.js
function _isRegExp(x) {
  return Object.prototype.toString.call(x) === "[object RegExp]";
}
__name(_isRegExp, "_isRegExp");

// source/test.js
var test = _curry2(/* @__PURE__ */ __name(function test2(pattern, str) {
  if (!_isRegExp(pattern)) {
    throw new TypeError("\u2018test\u2019 requires a value of type RegExp as its first argument; received " + toString_default(pattern));
  }
  return _cloneRegExp(pattern).test(str);
}, "test"));
var test_default = test;

// source/andThen.js
var andThen = _curry2(/* @__PURE__ */ __name(function andThen2(f, p) {
  _assertPromise("andThen", p);
  return p.then(f);
}, "andThen"));
var andThen_default = andThen;

// source/toLower.js
var toLower = invoker_default(0, "toLowerCase");
var toLower_default = toLower;

// source/toPairs.js
var toPairs = _curry1(/* @__PURE__ */ __name(function toPairs2(obj) {
  var pairs = [];
  for (var prop3 in obj) {
    if (_has(prop3, obj)) {
      pairs[pairs.length] = [prop3, obj[prop3]];
    }
  }
  return pairs;
}, "toPairs"));
var toPairs_default = toPairs;

// source/toPairsIn.js
var toPairsIn = _curry1(/* @__PURE__ */ __name(function toPairsIn2(obj) {
  var pairs = [];
  for (var prop3 in obj) {
    pairs[pairs.length] = [prop3, obj[prop3]];
  }
  return pairs;
}, "toPairsIn"));
var toPairsIn_default = toPairsIn;

// source/toUpper.js
var toUpper = invoker_default(0, "toUpperCase");
var toUpper_default = toUpper;

// source/transduce.js
var transduce = curryN_default(4, /* @__PURE__ */ __name(function transduce2(xf, fn, acc, list) {
  return xReduce_default(xf(typeof fn === "function" ? _xwrap(fn) : fn), acc, list);
}, "transduce"));
var transduce_default = transduce;

// source/transpose.js
var transpose = _curry1(/* @__PURE__ */ __name(function transpose2(outerlist) {
  var i = 0;
  var result = [];
  while (i < outerlist.length) {
    var innerlist = outerlist[i];
    var j = 0;
    while (j < innerlist.length) {
      if (typeof result[j] === "undefined") {
        result[j] = [];
      }
      result[j].push(innerlist[j]);
      j += 1;
    }
    i += 1;
  }
  return result;
}, "transpose"));
var transpose_default = transpose;

// source/traverse.js
var traverse = _curry3(/* @__PURE__ */ __name(function traverse2(F2, f, traversable) {
  var of3 = typeof F2["fantasy-land/of"] === "function" ? F2["fantasy-land/of"] : typeof F2.of === "function" ? F2.of : F2;
  var TypeRep = { "fantasy-land/of": of3 };
  return typeof traversable["fantasy-land/traverse"] === "function" ? traversable["fantasy-land/traverse"](TypeRep, f) : typeof traversable.traverse === "function" ? traversable.traverse(TypeRep, f) : sequence_default(TypeRep, map_default(f, traversable));
}, "traverse"));
var traverse_default = traverse;

// source/trim.js
var ws = "	\n\v\f\r \xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";
var zeroWidth = "\u200B";
var hasProtoTrim = typeof String.prototype.trim === "function";
var trim = !hasProtoTrim || ws.trim() || !zeroWidth.trim() ? _curry1(/* @__PURE__ */ __name(function trim2(str) {
  var beginRx = new RegExp("^[" + ws + "][" + ws + "]*");
  var endRx = new RegExp("[" + ws + "][" + ws + "]*$");
  return str.replace(beginRx, "").replace(endRx, "");
}, "trim")) : _curry1(/* @__PURE__ */ __name(function trim3(str) {
  return str.trim();
}, "trim"));
var trim_default = trim;

// source/tryCatch.js
var tryCatch = _curry2(/* @__PURE__ */ __name(function _tryCatch(tryer, catcher) {
  return _arity(tryer.length, function() {
    try {
      return tryer.apply(this, arguments);
    } catch (e) {
      return catcher.apply(this, _concat([e], arguments));
    }
  });
}, "_tryCatch"));
var tryCatch_default = tryCatch;

// source/unapply.js
var unapply = _curry1(/* @__PURE__ */ __name(function unapply2(fn) {
  return function() {
    return fn(Array.prototype.slice.call(arguments, 0));
  };
}, "unapply"));
var unapply_default = unapply;

// source/unary.js
var unary = _curry1(/* @__PURE__ */ __name(function unary2(fn) {
  return nAry_default(1, fn);
}, "unary"));
var unary_default = unary;

// source/uncurryN.js
var uncurryN = _curry2(/* @__PURE__ */ __name(function uncurryN2(depth, fn) {
  return curryN_default(depth, function() {
    var currentDepth = 1;
    var value = fn;
    var idx = 0;
    var endIdx;
    while (currentDepth <= depth && typeof value === "function") {
      endIdx = currentDepth === depth ? arguments.length : idx + value.length;
      value = value.apply(this, Array.prototype.slice.call(arguments, idx, endIdx));
      currentDepth += 1;
      idx = endIdx;
    }
    return value;
  });
}, "uncurryN"));
var uncurryN_default = uncurryN;

// source/unfold.js
var unfold = _curry2(/* @__PURE__ */ __name(function unfold2(fn, seed) {
  var pair3 = fn(seed);
  var result = [];
  while (pair3 && pair3.length) {
    result[result.length] = pair3[0];
    pair3 = fn(pair3[1]);
  }
  return result;
}, "unfold"));
var unfold_default = unfold;

// source/union.js
var union = _curry2(compose(uniq_default, _concat));
var union_default = union;

// source/internal/_xuniqWith.js
function XUniqWith(pred, xf) {
  this.xf = xf;
  this.pred = pred;
  this.items = [];
}
__name(XUniqWith, "XUniqWith");
XUniqWith.prototype["@@transducer/init"] = xfBase_default.init;
XUniqWith.prototype["@@transducer/result"] = xfBase_default.result;
XUniqWith.prototype["@@transducer/step"] = function(result, input) {
  if (_includesWith(this.pred, input, this.items)) {
    return result;
  } else {
    this.items.push(input);
    return this.xf["@@transducer/step"](result, input);
  }
};
function _xuniqWith(pred) {
  return function(xf) {
    return new XUniqWith(pred, xf);
  };
}
__name(_xuniqWith, "_xuniqWith");

// source/uniqWith.js
var uniqWith = _curry2(_dispatchable([], _xuniqWith, function(pred, list) {
  var idx = 0;
  var len = list.length;
  var result = [];
  var item;
  while (idx < len) {
    item = list[idx];
    if (!_includesWith(pred, item, result)) {
      result[result.length] = item;
    }
    idx += 1;
  }
  return result;
}));
var uniqWith_default = uniqWith;

// source/unionWith.js
var unionWith = _curry3(/* @__PURE__ */ __name(function unionWith2(pred, list1, list2) {
  return uniqWith_default(pred, _concat(list1, list2));
}, "unionWith"));
var unionWith_default = unionWith;

// source/unless.js
var unless = _curry3(/* @__PURE__ */ __name(function unless2(pred, whenFalseFn, x) {
  return pred(x) ? x : whenFalseFn(x);
}, "unless"));
var unless_default = unless;

// source/unnest.js
var unnest = chain_default(_identity);
var unnest_default = unnest;

// source/until.js
var until = _curry3(/* @__PURE__ */ __name(function until2(pred, fn, init2) {
  var val = init2;
  while (!pred(val)) {
    val = fn(val);
  }
  return val;
}, "until"));
var until_default = until;

// source/unwind.js
var unwind = _curry2(function(key, object) {
  if (!(key in object && isArray_default(object[key]))) {
    return [object];
  }
  return _map(function(item) {
    return _assoc(key, item, object);
  }, object[key]);
});
var unwind_default = unwind;

// source/valuesIn.js
var valuesIn = _curry1(/* @__PURE__ */ __name(function valuesIn2(obj) {
  var prop3;
  var vs = [];
  for (prop3 in obj) {
    vs[vs.length] = obj[prop3];
  }
  return vs;
}, "valuesIn"));
var valuesIn_default = valuesIn;

// source/view.js
var Const = /* @__PURE__ */ __name(function(x) {
  return { value: x, "fantasy-land/map": function() {
    return this;
  } };
}, "Const");
var view = _curry2(/* @__PURE__ */ __name(function view2(lens3, x) {
  return lens3(Const)(x).value;
}, "view"));
var view_default = view;

// source/when.js
var when = _curry3(/* @__PURE__ */ __name(function when2(pred, whenTrueFn, x) {
  return pred(x) ? whenTrueFn(x) : x;
}, "when"));
var when_default = when;

// source/where.js
var where = _curry2(/* @__PURE__ */ __name(function where2(spec, testObj) {
  for (var prop3 in spec) {
    if (_has(prop3, spec) && !spec[prop3](testObj[prop3])) {
      return false;
    }
  }
  return true;
}, "where"));
var where_default = where;

// source/whereAny.js
var whereAny = _curry2(/* @__PURE__ */ __name(function whereAny2(spec, testObj) {
  for (var prop3 in spec) {
    if (_has(prop3, spec) && spec[prop3](testObj[prop3])) {
      return true;
    }
  }
  return false;
}, "whereAny"));
var whereAny_default = whereAny;

// source/whereEq.js
var whereEq = _curry2(/* @__PURE__ */ __name(function whereEq2(spec, testObj) {
  return where_default(map_default(equals_default, spec), testObj);
}, "whereEq"));
var whereEq_default = whereEq;

// source/without.js
var without = _curry2(/* @__PURE__ */ __name(function without2(xs, list) {
  var toRemove = new Set_default();
  for (var i = 0; i < xs.length; i += 1) {
    toRemove.add(xs[i]);
  }
  return reject_default(toRemove.has.bind(toRemove), list);
}, "without"));
var without_default = without;

// source/xor.js
var xor = _curry2(/* @__PURE__ */ __name(function xor2(a, b) {
  return Boolean(!a ^ !b);
}, "xor"));
var xor_default = xor;

// source/xprod.js
var xprod = _curry2(/* @__PURE__ */ __name(function xprod2(a, b) {
  var idx = 0;
  var ilen = a.length;
  var j;
  var jlen = b.length;
  var result = [];
  while (idx < ilen) {
    j = 0;
    while (j < jlen) {
      result[result.length] = [a[idx], b[j]];
      j += 1;
    }
    idx += 1;
  }
  return result;
}, "xprod"));
var xprod_default = xprod;

// source/zip.js
var zip = _curry2(/* @__PURE__ */ __name(function zip2(a, b) {
  var rv = [];
  var idx = 0;
  var len = Math.min(a.length, b.length);
  while (idx < len) {
    rv[idx] = [a[idx], b[idx]];
    idx += 1;
  }
  return rv;
}, "zip"));
var zip_default = zip;

// source/zipObj.js
var zipObj = _curry2(/* @__PURE__ */ __name(function zipObj2(keys4, values3) {
  var idx = 0;
  var len = Math.min(keys4.length, values3.length);
  var out = {};
  while (idx < len) {
    out[keys4[idx]] = values3[idx];
    idx += 1;
  }
  return out;
}, "zipObj"));
var zipObj_default = zipObj;

// source/zipWith.js
var zipWith = _curry3(/* @__PURE__ */ __name(function zipWith2(fn, a, b) {
  var rv = [];
  var idx = 0;
  var len = Math.min(a.length, b.length);
  while (idx < len) {
    rv[idx] = fn(a[idx], b[idx]);
    idx += 1;
  }
  return rv;
}, "zipWith"));
var zipWith_default = zipWith;

// source/thunkify.js
var thunkify = _curry1(/* @__PURE__ */ __name(function thunkify2(fn) {
  return curryN_default(fn.length, /* @__PURE__ */ __name(function createThunk() {
    var fnArgs = arguments;
    return /* @__PURE__ */ __name(function invokeThunk() {
      return fn.apply(this, fnArgs);
    }, "invokeThunk");
  }, "createThunk"));
}, "thunkify"));
var thunkify_default = thunkify;
export {
  F_default as F,
  T_default as T,
  __default as __,
  add_default as add,
  addIndex_default as addIndex,
  addIndexRight_default as addIndexRight,
  adjust_default as adjust,
  all_default as all,
  allPass_default as allPass,
  always_default as always,
  and_default as and,
  andThen_default as andThen,
  any_default as any,
  anyPass_default as anyPass,
  ap_default as ap,
  aperture_default as aperture,
  append_default as append,
  apply_default as apply,
  applySpec_default as applySpec,
  applyTo_default as applyTo,
  ascend_default as ascend,
  assoc_default as assoc,
  assocPath_default as assocPath,
  binary_default as binary,
  bind_default as bind,
  both_default as both,
  call_default as call,
  chain_default as chain,
  clamp_default as clamp,
  clone_default as clone,
  collectBy_default as collectBy,
  comparator_default as comparator,
  complement_default as complement,
  compose,
  composeWith_default as composeWith,
  concat_default as concat,
  cond_default as cond,
  construct_default as construct,
  constructN_default as constructN,
  converge_default as converge,
  count_default as count,
  countBy_default as countBy,
  curry_default as curry,
  curryN_default as curryN,
  dec_default as dec,
  defaultTo_default as defaultTo,
  descend_default as descend,
  difference_default as difference,
  differenceWith_default as differenceWith,
  dissoc_default as dissoc,
  dissocPath_default as dissocPath,
  divide_default as divide,
  drop_default as drop,
  dropLast_default as dropLast,
  dropLastWhile_default as dropLastWhile,
  dropRepeats_default as dropRepeats,
  dropRepeatsBy_default as dropRepeatsBy,
  dropRepeatsWith_default as dropRepeatsWith,
  dropWhile_default as dropWhile,
  either_default as either,
  empty_default as empty,
  endsWith_default as endsWith,
  eqBy_default as eqBy,
  eqProps_default as eqProps,
  equals_default as equals,
  evolve_default as evolve,
  filter_default as filter,
  find_default as find,
  findIndex_default as findIndex,
  findLast_default as findLast,
  findLastIndex_default as findLastIndex,
  flatten_default as flatten,
  flip_default as flip,
  forEach_default as forEach,
  forEachObjIndexed_default as forEachObjIndexed,
  fromPairs_default as fromPairs,
  groupBy_default as groupBy,
  groupWith_default as groupWith,
  gt_default as gt,
  gte_default as gte,
  has_default as has,
  hasIn_default as hasIn,
  hasPath_default as hasPath,
  head_default as head,
  identical_default as identical,
  identity_default as identity,
  ifElse_default as ifElse,
  inc_default as inc,
  includes_default as includes,
  indexBy_default as indexBy,
  indexOf_default as indexOf,
  init_default as init,
  innerJoin_default as innerJoin,
  insert_default as insert,
  insertAll_default as insertAll,
  intersection_default as intersection,
  intersperse_default as intersperse,
  into_default as into,
  invert_default as invert,
  invertObj_default as invertObj,
  invoker_default as invoker,
  is_default as is,
  isEmpty_default as isEmpty,
  isNil_default as isNil,
  isNotNil_default as isNotNil,
  join_default as join,
  juxt_default as juxt,
  keys_default as keys,
  keysIn_default as keysIn,
  last_default as last,
  lastIndexOf_default as lastIndexOf,
  length_default as length,
  lens_default as lens,
  lensIndex_default as lensIndex,
  lensPath_default as lensPath,
  lensProp_default as lensProp,
  lift_default as lift,
  liftN_default as liftN,
  lt_default as lt,
  lte_default as lte,
  map_default as map,
  mapAccum_default as mapAccum,
  mapAccumRight_default as mapAccumRight,
  mapObjIndexed_default as mapObjIndexed,
  match_default as match,
  mathMod_default as mathMod,
  max_default as max,
  maxBy_default as maxBy,
  mean_default as mean,
  median_default as median,
  memoizeWith_default as memoizeWith,
  mergeAll_default as mergeAll,
  mergeDeepLeft_default as mergeDeepLeft,
  mergeDeepRight_default as mergeDeepRight,
  mergeDeepWith_default as mergeDeepWith,
  mergeDeepWithKey_default as mergeDeepWithKey,
  mergeLeft_default as mergeLeft,
  mergeRight_default as mergeRight,
  mergeWith_default as mergeWith,
  mergeWithKey_default as mergeWithKey,
  min_default as min,
  minBy_default as minBy,
  modify_default as modify,
  modifyPath_default as modifyPath,
  modulo_default as modulo,
  move_default as move,
  multiply_default as multiply,
  nAry_default as nAry,
  negate_default as negate,
  none_default as none,
  not_default as not,
  nth_default as nth,
  nthArg_default as nthArg,
  o_default as o,
  objOf_default as objOf,
  of_default as of,
  omit_default as omit,
  on_default as on,
  once_default as once,
  or_default as or,
  otherwise_default as otherwise,
  over_default as over,
  pair_default as pair,
  partial_default as partial,
  partialObject_default as partialObject,
  partialRight_default as partialRight,
  partition_default as partition,
  path_default as path,
  pathEq_default as pathEq,
  pathOr_default as pathOr,
  pathSatisfies_default as pathSatisfies,
  paths_default as paths,
  pick_default as pick,
  pickAll_default as pickAll,
  pickBy_default as pickBy,
  pipe,
  pipeWith_default as pipeWith,
  pluck_default as pluck,
  prepend_default as prepend,
  product_default as product,
  project_default as project,
  promap_default as promap,
  prop_default as prop,
  propEq_default as propEq,
  propIs_default as propIs,
  propOr_default as propOr,
  propSatisfies_default as propSatisfies,
  props_default as props,
  range_default as range,
  reduce_default as reduce,
  reduceBy_default as reduceBy,
  reduceRight_default as reduceRight,
  reduceWhile_default as reduceWhile,
  reduced_default as reduced,
  reject_default as reject,
  remove_default as remove,
  repeat_default as repeat,
  replace_default as replace,
  reverse_default as reverse,
  scan_default as scan,
  sequence_default as sequence,
  set_default as set,
  slice_default as slice,
  sort_default as sort,
  sortBy_default as sortBy,
  sortWith_default as sortWith,
  split_default as split,
  splitAt_default as splitAt,
  splitEvery_default as splitEvery,
  splitWhen_default as splitWhen,
  splitWhenever_default as splitWhenever,
  startsWith_default as startsWith,
  subtract_default as subtract,
  sum_default as sum,
  swap_default as swap,
  symmetricDifference_default as symmetricDifference,
  symmetricDifferenceWith_default as symmetricDifferenceWith,
  tail_default as tail,
  take_default as take,
  takeLast_default as takeLast,
  takeLastWhile_default as takeLastWhile,
  takeWhile_default as takeWhile,
  tap_default as tap,
  test_default as test,
  thunkify_default as thunkify,
  times_default as times,
  toLower_default as toLower,
  toPairs_default as toPairs,
  toPairsIn_default as toPairsIn,
  toString_default as toString,
  toUpper_default as toUpper,
  transduce_default as transduce,
  transpose_default as transpose,
  traverse_default as traverse,
  trim_default as trim,
  tryCatch_default as tryCatch,
  type_default as type,
  unapply_default as unapply,
  unary_default as unary,
  uncurryN_default as uncurryN,
  unfold_default as unfold,
  union_default as union,
  unionWith_default as unionWith,
  uniq_default as uniq,
  uniqBy_default as uniqBy,
  uniqWith_default as uniqWith,
  unless_default as unless,
  unnest_default as unnest,
  until_default as until,
  unwind_default as unwind,
  update_default as update,
  useWith_default as useWith,
  values_default as values,
  valuesIn_default as valuesIn,
  view_default as view,
  when_default as when,
  where_default as where,
  whereAny_default as whereAny,
  whereEq_default as whereEq,
  without_default as without,
  xor_default as xor,
  xprod_default as xprod,
  zip_default as zip,
  zipObj_default as zipObj,
  zipWith_default as zipWith
};
//# sourceMappingURL=index.js.map
