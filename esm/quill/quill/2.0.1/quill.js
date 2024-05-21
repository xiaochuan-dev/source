var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "../../node_modules/eventemitter3/index.js"(exports2, module2) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    __name(Events, "Events");
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__)
        prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    __name(EE, "EE");
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt])
        emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn)
        emitter._events[evt].push(listener);
      else
        emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    __name(addListener, "addListener");
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0)
        emitter._events = new Events();
      else
        delete emitter._events[evt];
    }
    __name(clearEvent, "clearEvent");
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    __name(EventEmitter2, "EventEmitter");
    EventEmitter2.prototype.eventNames = /* @__PURE__ */ __name(function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0)
        return names;
      for (name in events = this._events) {
        if (has.call(events, name))
          names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    }, "eventNames");
    EventEmitter2.prototype.listeners = /* @__PURE__ */ __name(function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers)
        return [];
      if (handlers.fn)
        return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    }, "listeners");
    EventEmitter2.prototype.listenerCount = /* @__PURE__ */ __name(function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners)
        return 0;
      if (listeners.fn)
        return 1;
      return listeners.length;
    }, "listenerCount");
    EventEmitter2.prototype.emit = /* @__PURE__ */ __name(function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once)
          this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once)
            this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args)
                for (j = 1, args = new Array(len - 1); j < len; j++) {
                  args[j - 1] = arguments[j];
                }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    }, "emit");
    EventEmitter2.prototype.on = /* @__PURE__ */ __name(function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    }, "on");
    EventEmitter2.prototype.once = /* @__PURE__ */ __name(function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    }, "once");
    EventEmitter2.prototype.removeListener = /* @__PURE__ */ __name(function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length)
          this._events[evt] = events.length === 1 ? events[0] : events;
        else
          clearEvent(this, evt);
      }
      return this;
    }, "removeListener");
    EventEmitter2.prototype.removeAllListeners = /* @__PURE__ */ __name(function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt])
          clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    }, "removeAllListeners");
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    if ("undefined" !== typeof module2) {
      module2.exports = EventEmitter2;
    }
  }
});

// ../../node_modules/lodash-es/_freeGlobal.js
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeGlobal_default = freeGlobal;

// ../../node_modules/lodash-es/_root.js
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal_default || freeSelf || Function("return this")();
var root_default = root;

// ../../node_modules/lodash-es/_Symbol.js
var Symbol2 = root_default.Symbol;
var Symbol_default = Symbol2;

// ../../node_modules/lodash-es/_getRawTag.js
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var symToStringTag = Symbol_default ? Symbol_default.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
  try {
    value[symToStringTag] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}
__name(getRawTag, "getRawTag");
var getRawTag_default = getRawTag;

// ../../node_modules/lodash-es/_objectToString.js
var objectProto2 = Object.prototype;
var nativeObjectToString2 = objectProto2.toString;
function objectToString(value) {
  return nativeObjectToString2.call(value);
}
__name(objectToString, "objectToString");
var objectToString_default = objectToString;

// ../../node_modules/lodash-es/_baseGetTag.js
var nullTag = "[object Null]";
var undefinedTag = "[object Undefined]";
var symToStringTag2 = Symbol_default ? Symbol_default.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag2 && symToStringTag2 in Object(value) ? getRawTag_default(value) : objectToString_default(value);
}
__name(baseGetTag, "baseGetTag");
var baseGetTag_default = baseGetTag;

// ../../node_modules/lodash-es/isObjectLike.js
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
__name(isObjectLike, "isObjectLike");
var isObjectLike_default = isObjectLike;

// ../../node_modules/lodash-es/isArray.js
var isArray = Array.isArray;
var isArray_default = isArray;

// ../../node_modules/lodash-es/isObject.js
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
__name(isObject, "isObject");
var isObject_default = isObject;

// ../../node_modules/lodash-es/identity.js
function identity(value) {
  return value;
}
__name(identity, "identity");
var identity_default = identity;

// ../../node_modules/lodash-es/isFunction.js
var asyncTag = "[object AsyncFunction]";
var funcTag = "[object Function]";
var genTag = "[object GeneratorFunction]";
var proxyTag = "[object Proxy]";
function isFunction(value) {
  if (!isObject_default(value)) {
    return false;
  }
  var tag = baseGetTag_default(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
__name(isFunction, "isFunction");
var isFunction_default = isFunction;

// ../../node_modules/lodash-es/_coreJsData.js
var coreJsData = root_default["__core-js_shared__"];
var coreJsData_default = coreJsData;

// ../../node_modules/lodash-es/_isMasked.js
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData_default && coreJsData_default.keys && coreJsData_default.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
__name(isMasked, "isMasked");
var isMasked_default = isMasked;

// ../../node_modules/lodash-es/_toSource.js
var funcProto = Function.prototype;
var funcToString = funcProto.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
__name(toSource, "toSource");
var toSource_default = toSource;

// ../../node_modules/lodash-es/_baseIsNative.js
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto2 = Function.prototype;
var objectProto3 = Object.prototype;
var funcToString2 = funcProto2.toString;
var hasOwnProperty2 = objectProto3.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString2.call(hasOwnProperty2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(value) {
  if (!isObject_default(value) || isMasked_default(value)) {
    return false;
  }
  var pattern = isFunction_default(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource_default(value));
}
__name(baseIsNative, "baseIsNative");
var baseIsNative_default = baseIsNative;

// ../../node_modules/lodash-es/_getValue.js
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
__name(getValue, "getValue");
var getValue_default = getValue;

// ../../node_modules/lodash-es/_getNative.js
function getNative(object, key) {
  var value = getValue_default(object, key);
  return baseIsNative_default(value) ? value : void 0;
}
__name(getNative, "getNative");
var getNative_default = getNative;

// ../../node_modules/lodash-es/_WeakMap.js
var WeakMap2 = getNative_default(root_default, "WeakMap");
var WeakMap_default = WeakMap2;

// ../../node_modules/lodash-es/_baseCreate.js
var objectCreate = Object.create;
var baseCreate = /* @__PURE__ */ function() {
  function object() {
  }
  __name(object, "object");
  return function(proto) {
    if (!isObject_default(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = void 0;
    return result;
  };
}();
var baseCreate_default = baseCreate;

// ../../node_modules/lodash-es/_apply.js
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
__name(apply, "apply");
var apply_default = apply;

// ../../node_modules/lodash-es/_copyArray.js
function copyArray(source, array) {
  var index = -1, length = source.length;
  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}
__name(copyArray, "copyArray");
var copyArray_default = copyArray;

// ../../node_modules/lodash-es/_shortOut.js
var HOT_COUNT = 800;
var HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut(func) {
  var count = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
__name(shortOut, "shortOut");
var shortOut_default = shortOut;

// ../../node_modules/lodash-es/constant.js
function constant(value) {
  return function() {
    return value;
  };
}
__name(constant, "constant");
var constant_default = constant;

// ../../node_modules/lodash-es/_defineProperty.js
var defineProperty = function() {
  try {
    var func = getNative_default(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e) {
  }
}();
var defineProperty_default = defineProperty;

// ../../node_modules/lodash-es/_baseSetToString.js
var baseSetToString = !defineProperty_default ? identity_default : function(func, string) {
  return defineProperty_default(func, "toString", {
    "configurable": true,
    "enumerable": false,
    "value": constant_default(string),
    "writable": true
  });
};
var baseSetToString_default = baseSetToString;

// ../../node_modules/lodash-es/_setToString.js
var setToString = shortOut_default(baseSetToString_default);
var setToString_default = setToString;

// ../../node_modules/lodash-es/_arrayEach.js
function arrayEach(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}
__name(arrayEach, "arrayEach");
var arrayEach_default = arrayEach;

// ../../node_modules/lodash-es/_isIndex.js
var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
__name(isIndex, "isIndex");
var isIndex_default = isIndex;

// ../../node_modules/lodash-es/_baseAssignValue.js
function baseAssignValue(object, key, value) {
  if (key == "__proto__" && defineProperty_default) {
    defineProperty_default(object, key, {
      "configurable": true,
      "enumerable": true,
      "value": value,
      "writable": true
    });
  } else {
    object[key] = value;
  }
}
__name(baseAssignValue, "baseAssignValue");
var baseAssignValue_default = baseAssignValue;

// ../../node_modules/lodash-es/eq.js
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
__name(eq, "eq");
var eq_default = eq;

// ../../node_modules/lodash-es/_assignValue.js
var objectProto4 = Object.prototype;
var hasOwnProperty3 = objectProto4.hasOwnProperty;
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty3.call(object, key) && eq_default(objValue, value)) || value === void 0 && !(key in object)) {
    baseAssignValue_default(object, key, value);
  }
}
__name(assignValue, "assignValue");
var assignValue_default = assignValue;

// ../../node_modules/lodash-es/_copyObject.js
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1, length = props.length;
  while (++index < length) {
    var key = props[index];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
    if (newValue === void 0) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue_default(object, key, newValue);
    } else {
      assignValue_default(object, key, newValue);
    }
  }
  return object;
}
__name(copyObject, "copyObject");
var copyObject_default = copyObject;

// ../../node_modules/lodash-es/_overRest.js
var nativeMax = Math.max;
function overRest(func, start, transform) {
  start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
  return function() {
    var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply_default(func, this, otherArgs);
  };
}
__name(overRest, "overRest");
var overRest_default = overRest;

// ../../node_modules/lodash-es/_baseRest.js
function baseRest(func, start) {
  return setToString_default(overRest_default(func, start, identity_default), func + "");
}
__name(baseRest, "baseRest");
var baseRest_default = baseRest;

// ../../node_modules/lodash-es/isLength.js
var MAX_SAFE_INTEGER2 = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER2;
}
__name(isLength, "isLength");
var isLength_default = isLength;

// ../../node_modules/lodash-es/isArrayLike.js
function isArrayLike(value) {
  return value != null && isLength_default(value.length) && !isFunction_default(value);
}
__name(isArrayLike, "isArrayLike");
var isArrayLike_default = isArrayLike;

// ../../node_modules/lodash-es/_isIterateeCall.js
function isIterateeCall(value, index, object) {
  if (!isObject_default(object)) {
    return false;
  }
  var type = typeof index;
  if (type == "number" ? isArrayLike_default(object) && isIndex_default(index, object.length) : type == "string" && index in object) {
    return eq_default(object[index], value);
  }
  return false;
}
__name(isIterateeCall, "isIterateeCall");
var isIterateeCall_default = isIterateeCall;

// ../../node_modules/lodash-es/_createAssigner.js
function createAssigner(assigner) {
  return baseRest_default(function(object, sources) {
    var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
    customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
    if (guard && isIterateeCall_default(sources[0], sources[1], guard)) {
      customizer = length < 3 ? void 0 : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}
__name(createAssigner, "createAssigner");
var createAssigner_default = createAssigner;

// ../../node_modules/lodash-es/_isPrototype.js
var objectProto5 = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto5;
  return value === proto;
}
__name(isPrototype, "isPrototype");
var isPrototype_default = isPrototype;

// ../../node_modules/lodash-es/_baseTimes.js
function baseTimes(n, iteratee) {
  var index = -1, result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}
__name(baseTimes, "baseTimes");
var baseTimes_default = baseTimes;

// ../../node_modules/lodash-es/_baseIsArguments.js
var argsTag = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike_default(value) && baseGetTag_default(value) == argsTag;
}
__name(baseIsArguments, "baseIsArguments");
var baseIsArguments_default = baseIsArguments;

// ../../node_modules/lodash-es/isArguments.js
var objectProto6 = Object.prototype;
var hasOwnProperty4 = objectProto6.hasOwnProperty;
var propertyIsEnumerable = objectProto6.propertyIsEnumerable;
var isArguments = baseIsArguments_default(/* @__PURE__ */ function() {
  return arguments;
}()) ? baseIsArguments_default : function(value) {
  return isObjectLike_default(value) && hasOwnProperty4.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};
var isArguments_default = isArguments;

// ../../node_modules/lodash-es/stubFalse.js
function stubFalse() {
  return false;
}
__name(stubFalse, "stubFalse");
var stubFalse_default = stubFalse;

// ../../node_modules/lodash-es/isBuffer.js
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer2 = moduleExports ? root_default.Buffer : void 0;
var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
var isBuffer = nativeIsBuffer || stubFalse_default;
var isBuffer_default = isBuffer;

// ../../node_modules/lodash-es/_baseIsTypedArray.js
var argsTag2 = "[object Arguments]";
var arrayTag = "[object Array]";
var boolTag = "[object Boolean]";
var dateTag = "[object Date]";
var errorTag = "[object Error]";
var funcTag2 = "[object Function]";
var mapTag = "[object Map]";
var numberTag = "[object Number]";
var objectTag = "[object Object]";
var regexpTag = "[object RegExp]";
var setTag = "[object Set]";
var stringTag = "[object String]";
var weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]";
var dataViewTag = "[object DataView]";
var float32Tag = "[object Float32Array]";
var float64Tag = "[object Float64Array]";
var int8Tag = "[object Int8Array]";
var int16Tag = "[object Int16Array]";
var int32Tag = "[object Int32Array]";
var uint8Tag = "[object Uint8Array]";
var uint8ClampedTag = "[object Uint8ClampedArray]";
var uint16Tag = "[object Uint16Array]";
var uint32Tag = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag2] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag2] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
function baseIsTypedArray(value) {
  return isObjectLike_default(value) && isLength_default(value.length) && !!typedArrayTags[baseGetTag_default(value)];
}
__name(baseIsTypedArray, "baseIsTypedArray");
var baseIsTypedArray_default = baseIsTypedArray;

// ../../node_modules/lodash-es/_baseUnary.js
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
__name(baseUnary, "baseUnary");
var baseUnary_default = baseUnary;

// ../../node_modules/lodash-es/_nodeUtil.js
var freeExports2 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule2 = freeExports2 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports2 = freeModule2 && freeModule2.exports === freeExports2;
var freeProcess = moduleExports2 && freeGlobal_default.process;
var nodeUtil = function() {
  try {
    var types = freeModule2 && freeModule2.require && freeModule2.require("util").types;
    if (types) {
      return types;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e) {
  }
}();
var nodeUtil_default = nodeUtil;

// ../../node_modules/lodash-es/isTypedArray.js
var nodeIsTypedArray = nodeUtil_default && nodeUtil_default.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary_default(nodeIsTypedArray) : baseIsTypedArray_default;
var isTypedArray_default = isTypedArray;

// ../../node_modules/lodash-es/_arrayLikeKeys.js
var objectProto7 = Object.prototype;
var hasOwnProperty5 = objectProto7.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_default(value), isArg = !isArr && isArguments_default(value), isBuff = !isArr && !isArg && isBuffer_default(value), isType = !isArr && !isArg && !isBuff && isTypedArray_default(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes_default(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty5.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
    (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
    isIndex_default(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
__name(arrayLikeKeys, "arrayLikeKeys");
var arrayLikeKeys_default = arrayLikeKeys;

// ../../node_modules/lodash-es/_overArg.js
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
__name(overArg, "overArg");
var overArg_default = overArg;

// ../../node_modules/lodash-es/_nativeKeys.js
var nativeKeys = overArg_default(Object.keys, Object);
var nativeKeys_default = nativeKeys;

// ../../node_modules/lodash-es/_baseKeys.js
var objectProto8 = Object.prototype;
var hasOwnProperty6 = objectProto8.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype_default(object)) {
    return nativeKeys_default(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty6.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
__name(baseKeys, "baseKeys");
var baseKeys_default = baseKeys;

// ../../node_modules/lodash-es/keys.js
function keys(object) {
  return isArrayLike_default(object) ? arrayLikeKeys_default(object) : baseKeys_default(object);
}
__name(keys, "keys");
var keys_default = keys;

// ../../node_modules/lodash-es/_nativeKeysIn.js
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}
__name(nativeKeysIn, "nativeKeysIn");
var nativeKeysIn_default = nativeKeysIn;

// ../../node_modules/lodash-es/_baseKeysIn.js
var objectProto9 = Object.prototype;
var hasOwnProperty7 = objectProto9.hasOwnProperty;
function baseKeysIn(object) {
  if (!isObject_default(object)) {
    return nativeKeysIn_default(object);
  }
  var isProto = isPrototype_default(object), result = [];
  for (var key in object) {
    if (!(key == "constructor" && (isProto || !hasOwnProperty7.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}
__name(baseKeysIn, "baseKeysIn");
var baseKeysIn_default = baseKeysIn;

// ../../node_modules/lodash-es/keysIn.js
function keysIn(object) {
  return isArrayLike_default(object) ? arrayLikeKeys_default(object, true) : baseKeysIn_default(object);
}
__name(keysIn, "keysIn");
var keysIn_default = keysIn;

// ../../node_modules/lodash-es/_nativeCreate.js
var nativeCreate = getNative_default(Object, "create");
var nativeCreate_default = nativeCreate;

// ../../node_modules/lodash-es/_hashClear.js
function hashClear() {
  this.__data__ = nativeCreate_default ? nativeCreate_default(null) : {};
  this.size = 0;
}
__name(hashClear, "hashClear");
var hashClear_default = hashClear;

// ../../node_modules/lodash-es/_hashDelete.js
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
__name(hashDelete, "hashDelete");
var hashDelete_default = hashDelete;

// ../../node_modules/lodash-es/_hashGet.js
var HASH_UNDEFINED = "__lodash_hash_undefined__";
var objectProto10 = Object.prototype;
var hasOwnProperty8 = objectProto10.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate_default) {
    var result = data[key];
    return result === HASH_UNDEFINED ? void 0 : result;
  }
  return hasOwnProperty8.call(data, key) ? data[key] : void 0;
}
__name(hashGet, "hashGet");
var hashGet_default = hashGet;

// ../../node_modules/lodash-es/_hashHas.js
var objectProto11 = Object.prototype;
var hasOwnProperty9 = objectProto11.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate_default ? data[key] !== void 0 : hasOwnProperty9.call(data, key);
}
__name(hashHas, "hashHas");
var hashHas_default = hashHas;

// ../../node_modules/lodash-es/_hashSet.js
var HASH_UNDEFINED2 = "__lodash_hash_undefined__";
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate_default && value === void 0 ? HASH_UNDEFINED2 : value;
  return this;
}
__name(hashSet, "hashSet");
var hashSet_default = hashSet;

// ../../node_modules/lodash-es/_Hash.js
function Hash(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
__name(Hash, "Hash");
Hash.prototype.clear = hashClear_default;
Hash.prototype["delete"] = hashDelete_default;
Hash.prototype.get = hashGet_default;
Hash.prototype.has = hashHas_default;
Hash.prototype.set = hashSet_default;
var Hash_default = Hash;

// ../../node_modules/lodash-es/_listCacheClear.js
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
__name(listCacheClear, "listCacheClear");
var listCacheClear_default = listCacheClear;

// ../../node_modules/lodash-es/_assocIndexOf.js
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_default(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
__name(assocIndexOf, "assocIndexOf");
var assocIndexOf_default = assocIndexOf;

// ../../node_modules/lodash-es/_listCacheDelete.js
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}
__name(listCacheDelete, "listCacheDelete");
var listCacheDelete_default = listCacheDelete;

// ../../node_modules/lodash-es/_listCacheGet.js
function listCacheGet(key) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  return index < 0 ? void 0 : data[index][1];
}
__name(listCacheGet, "listCacheGet");
var listCacheGet_default = listCacheGet;

// ../../node_modules/lodash-es/_listCacheHas.js
function listCacheHas(key) {
  return assocIndexOf_default(this.__data__, key) > -1;
}
__name(listCacheHas, "listCacheHas");
var listCacheHas_default = listCacheHas;

// ../../node_modules/lodash-es/_listCacheSet.js
function listCacheSet(key, value) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}
__name(listCacheSet, "listCacheSet");
var listCacheSet_default = listCacheSet;

// ../../node_modules/lodash-es/_ListCache.js
function ListCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
__name(ListCache, "ListCache");
ListCache.prototype.clear = listCacheClear_default;
ListCache.prototype["delete"] = listCacheDelete_default;
ListCache.prototype.get = listCacheGet_default;
ListCache.prototype.has = listCacheHas_default;
ListCache.prototype.set = listCacheSet_default;
var ListCache_default = ListCache;

// ../../node_modules/lodash-es/_Map.js
var Map = getNative_default(root_default, "Map");
var Map_default = Map;

// ../../node_modules/lodash-es/_mapCacheClear.js
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash_default(),
    "map": new (Map_default || ListCache_default)(),
    "string": new Hash_default()
  };
}
__name(mapCacheClear, "mapCacheClear");
var mapCacheClear_default = mapCacheClear;

// ../../node_modules/lodash-es/_isKeyable.js
function isKeyable(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
__name(isKeyable, "isKeyable");
var isKeyable_default = isKeyable;

// ../../node_modules/lodash-es/_getMapData.js
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable_default(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
__name(getMapData, "getMapData");
var getMapData_default = getMapData;

// ../../node_modules/lodash-es/_mapCacheDelete.js
function mapCacheDelete(key) {
  var result = getMapData_default(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
__name(mapCacheDelete, "mapCacheDelete");
var mapCacheDelete_default = mapCacheDelete;

// ../../node_modules/lodash-es/_mapCacheGet.js
function mapCacheGet(key) {
  return getMapData_default(this, key).get(key);
}
__name(mapCacheGet, "mapCacheGet");
var mapCacheGet_default = mapCacheGet;

// ../../node_modules/lodash-es/_mapCacheHas.js
function mapCacheHas(key) {
  return getMapData_default(this, key).has(key);
}
__name(mapCacheHas, "mapCacheHas");
var mapCacheHas_default = mapCacheHas;

// ../../node_modules/lodash-es/_mapCacheSet.js
function mapCacheSet(key, value) {
  var data = getMapData_default(this, key), size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
__name(mapCacheSet, "mapCacheSet");
var mapCacheSet_default = mapCacheSet;

// ../../node_modules/lodash-es/_MapCache.js
function MapCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
__name(MapCache, "MapCache");
MapCache.prototype.clear = mapCacheClear_default;
MapCache.prototype["delete"] = mapCacheDelete_default;
MapCache.prototype.get = mapCacheGet_default;
MapCache.prototype.has = mapCacheHas_default;
MapCache.prototype.set = mapCacheSet_default;
var MapCache_default = MapCache;

// ../../node_modules/lodash-es/_arrayPush.js
function arrayPush(array, values) {
  var index = -1, length = values.length, offset = array.length;
  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}
__name(arrayPush, "arrayPush");
var arrayPush_default = arrayPush;

// ../../node_modules/lodash-es/_getPrototype.js
var getPrototype = overArg_default(Object.getPrototypeOf, Object);
var getPrototype_default = getPrototype;

// ../../node_modules/lodash-es/isPlainObject.js
var objectTag2 = "[object Object]";
var funcProto3 = Function.prototype;
var objectProto12 = Object.prototype;
var funcToString3 = funcProto3.toString;
var hasOwnProperty10 = objectProto12.hasOwnProperty;
var objectCtorString = funcToString3.call(Object);
function isPlainObject(value) {
  if (!isObjectLike_default(value) || baseGetTag_default(value) != objectTag2) {
    return false;
  }
  var proto = getPrototype_default(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty10.call(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString3.call(Ctor) == objectCtorString;
}
__name(isPlainObject, "isPlainObject");
var isPlainObject_default = isPlainObject;

// ../../node_modules/lodash-es/_stackClear.js
function stackClear() {
  this.__data__ = new ListCache_default();
  this.size = 0;
}
__name(stackClear, "stackClear");
var stackClear_default = stackClear;

// ../../node_modules/lodash-es/_stackDelete.js
function stackDelete(key) {
  var data = this.__data__, result = data["delete"](key);
  this.size = data.size;
  return result;
}
__name(stackDelete, "stackDelete");
var stackDelete_default = stackDelete;

// ../../node_modules/lodash-es/_stackGet.js
function stackGet(key) {
  return this.__data__.get(key);
}
__name(stackGet, "stackGet");
var stackGet_default = stackGet;

// ../../node_modules/lodash-es/_stackHas.js
function stackHas(key) {
  return this.__data__.has(key);
}
__name(stackHas, "stackHas");
var stackHas_default = stackHas;

// ../../node_modules/lodash-es/_stackSet.js
var LARGE_ARRAY_SIZE = 200;
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache_default) {
    var pairs = data.__data__;
    if (!Map_default || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache_default(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}
__name(stackSet, "stackSet");
var stackSet_default = stackSet;

// ../../node_modules/lodash-es/_Stack.js
function Stack(entries) {
  var data = this.__data__ = new ListCache_default(entries);
  this.size = data.size;
}
__name(Stack, "Stack");
Stack.prototype.clear = stackClear_default;
Stack.prototype["delete"] = stackDelete_default;
Stack.prototype.get = stackGet_default;
Stack.prototype.has = stackHas_default;
Stack.prototype.set = stackSet_default;
var Stack_default = Stack;

// ../../node_modules/lodash-es/_baseAssign.js
function baseAssign(object, source) {
  return object && copyObject_default(source, keys_default(source), object);
}
__name(baseAssign, "baseAssign");
var baseAssign_default = baseAssign;

// ../../node_modules/lodash-es/_baseAssignIn.js
function baseAssignIn(object, source) {
  return object && copyObject_default(source, keysIn_default(source), object);
}
__name(baseAssignIn, "baseAssignIn");
var baseAssignIn_default = baseAssignIn;

// ../../node_modules/lodash-es/_cloneBuffer.js
var freeExports3 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule3 = freeExports3 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports3 = freeModule3 && freeModule3.exports === freeExports3;
var Buffer3 = moduleExports3 ? root_default.Buffer : void 0;
var allocUnsafe = Buffer3 ? Buffer3.allocUnsafe : void 0;
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
  buffer.copy(result);
  return result;
}
__name(cloneBuffer, "cloneBuffer");
var cloneBuffer_default = cloneBuffer;

// ../../node_modules/lodash-es/_arrayFilter.js
function arrayFilter(array, predicate) {
  var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
__name(arrayFilter, "arrayFilter");
var arrayFilter_default = arrayFilter;

// ../../node_modules/lodash-es/stubArray.js
function stubArray() {
  return [];
}
__name(stubArray, "stubArray");
var stubArray_default = stubArray;

// ../../node_modules/lodash-es/_getSymbols.js
var objectProto13 = Object.prototype;
var propertyIsEnumerable2 = objectProto13.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbols = !nativeGetSymbols ? stubArray_default : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter_default(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable2.call(object, symbol);
  });
};
var getSymbols_default = getSymbols;

// ../../node_modules/lodash-es/_copySymbols.js
function copySymbols(source, object) {
  return copyObject_default(source, getSymbols_default(source), object);
}
__name(copySymbols, "copySymbols");
var copySymbols_default = copySymbols;

// ../../node_modules/lodash-es/_getSymbolsIn.js
var nativeGetSymbols2 = Object.getOwnPropertySymbols;
var getSymbolsIn = !nativeGetSymbols2 ? stubArray_default : function(object) {
  var result = [];
  while (object) {
    arrayPush_default(result, getSymbols_default(object));
    object = getPrototype_default(object);
  }
  return result;
};
var getSymbolsIn_default = getSymbolsIn;

// ../../node_modules/lodash-es/_copySymbolsIn.js
function copySymbolsIn(source, object) {
  return copyObject_default(source, getSymbolsIn_default(source), object);
}
__name(copySymbolsIn, "copySymbolsIn");
var copySymbolsIn_default = copySymbolsIn;

// ../../node_modules/lodash-es/_baseGetAllKeys.js
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_default(object) ? result : arrayPush_default(result, symbolsFunc(object));
}
__name(baseGetAllKeys, "baseGetAllKeys");
var baseGetAllKeys_default = baseGetAllKeys;

// ../../node_modules/lodash-es/_getAllKeys.js
function getAllKeys(object) {
  return baseGetAllKeys_default(object, keys_default, getSymbols_default);
}
__name(getAllKeys, "getAllKeys");
var getAllKeys_default = getAllKeys;

// ../../node_modules/lodash-es/_getAllKeysIn.js
function getAllKeysIn(object) {
  return baseGetAllKeys_default(object, keysIn_default, getSymbolsIn_default);
}
__name(getAllKeysIn, "getAllKeysIn");
var getAllKeysIn_default = getAllKeysIn;

// ../../node_modules/lodash-es/_DataView.js
var DataView = getNative_default(root_default, "DataView");
var DataView_default = DataView;

// ../../node_modules/lodash-es/_Promise.js
var Promise2 = getNative_default(root_default, "Promise");
var Promise_default = Promise2;

// ../../node_modules/lodash-es/_Set.js
var Set = getNative_default(root_default, "Set");
var Set_default = Set;

// ../../node_modules/lodash-es/_getTag.js
var mapTag2 = "[object Map]";
var objectTag3 = "[object Object]";
var promiseTag = "[object Promise]";
var setTag2 = "[object Set]";
var weakMapTag2 = "[object WeakMap]";
var dataViewTag2 = "[object DataView]";
var dataViewCtorString = toSource_default(DataView_default);
var mapCtorString = toSource_default(Map_default);
var promiseCtorString = toSource_default(Promise_default);
var setCtorString = toSource_default(Set_default);
var weakMapCtorString = toSource_default(WeakMap_default);
var getTag = baseGetTag_default;
if (DataView_default && getTag(new DataView_default(new ArrayBuffer(1))) != dataViewTag2 || Map_default && getTag(new Map_default()) != mapTag2 || Promise_default && getTag(Promise_default.resolve()) != promiseTag || Set_default && getTag(new Set_default()) != setTag2 || WeakMap_default && getTag(new WeakMap_default()) != weakMapTag2) {
  getTag = /* @__PURE__ */ __name(function(value) {
    var result = baseGetTag_default(value), Ctor = result == objectTag3 ? value.constructor : void 0, ctorString = Ctor ? toSource_default(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag2;
        case mapCtorString:
          return mapTag2;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag2;
        case weakMapCtorString:
          return weakMapTag2;
      }
    }
    return result;
  }, "getTag");
}
var getTag_default = getTag;

// ../../node_modules/lodash-es/_initCloneArray.js
var objectProto14 = Object.prototype;
var hasOwnProperty11 = objectProto14.hasOwnProperty;
function initCloneArray(array) {
  var length = array.length, result = new array.constructor(length);
  if (length && typeof array[0] == "string" && hasOwnProperty11.call(array, "index")) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}
__name(initCloneArray, "initCloneArray");
var initCloneArray_default = initCloneArray;

// ../../node_modules/lodash-es/_Uint8Array.js
var Uint8Array2 = root_default.Uint8Array;
var Uint8Array_default = Uint8Array2;

// ../../node_modules/lodash-es/_cloneArrayBuffer.js
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array_default(result).set(new Uint8Array_default(arrayBuffer));
  return result;
}
__name(cloneArrayBuffer, "cloneArrayBuffer");
var cloneArrayBuffer_default = cloneArrayBuffer;

// ../../node_modules/lodash-es/_cloneDataView.js
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer_default(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
__name(cloneDataView, "cloneDataView");
var cloneDataView_default = cloneDataView;

// ../../node_modules/lodash-es/_cloneRegExp.js
var reFlags = /\w*$/;
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}
__name(cloneRegExp, "cloneRegExp");
var cloneRegExp_default = cloneRegExp;

// ../../node_modules/lodash-es/_cloneSymbol.js
var symbolProto = Symbol_default ? Symbol_default.prototype : void 0;
var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}
__name(cloneSymbol, "cloneSymbol");
var cloneSymbol_default = cloneSymbol;

// ../../node_modules/lodash-es/_cloneTypedArray.js
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer_default(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
__name(cloneTypedArray, "cloneTypedArray");
var cloneTypedArray_default = cloneTypedArray;

// ../../node_modules/lodash-es/_initCloneByTag.js
var boolTag2 = "[object Boolean]";
var dateTag2 = "[object Date]";
var mapTag3 = "[object Map]";
var numberTag2 = "[object Number]";
var regexpTag2 = "[object RegExp]";
var setTag3 = "[object Set]";
var stringTag2 = "[object String]";
var symbolTag = "[object Symbol]";
var arrayBufferTag2 = "[object ArrayBuffer]";
var dataViewTag3 = "[object DataView]";
var float32Tag2 = "[object Float32Array]";
var float64Tag2 = "[object Float64Array]";
var int8Tag2 = "[object Int8Array]";
var int16Tag2 = "[object Int16Array]";
var int32Tag2 = "[object Int32Array]";
var uint8Tag2 = "[object Uint8Array]";
var uint8ClampedTag2 = "[object Uint8ClampedArray]";
var uint16Tag2 = "[object Uint16Array]";
var uint32Tag2 = "[object Uint32Array]";
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag2:
      return cloneArrayBuffer_default(object);
    case boolTag2:
    case dateTag2:
      return new Ctor(+object);
    case dataViewTag3:
      return cloneDataView_default(object, isDeep);
    case float32Tag2:
    case float64Tag2:
    case int8Tag2:
    case int16Tag2:
    case int32Tag2:
    case uint8Tag2:
    case uint8ClampedTag2:
    case uint16Tag2:
    case uint32Tag2:
      return cloneTypedArray_default(object, isDeep);
    case mapTag3:
      return new Ctor();
    case numberTag2:
    case stringTag2:
      return new Ctor(object);
    case regexpTag2:
      return cloneRegExp_default(object);
    case setTag3:
      return new Ctor();
    case symbolTag:
      return cloneSymbol_default(object);
  }
}
__name(initCloneByTag, "initCloneByTag");
var initCloneByTag_default = initCloneByTag;

// ../../node_modules/lodash-es/_initCloneObject.js
function initCloneObject(object) {
  return typeof object.constructor == "function" && !isPrototype_default(object) ? baseCreate_default(getPrototype_default(object)) : {};
}
__name(initCloneObject, "initCloneObject");
var initCloneObject_default = initCloneObject;

// ../../node_modules/lodash-es/_baseIsMap.js
var mapTag4 = "[object Map]";
function baseIsMap(value) {
  return isObjectLike_default(value) && getTag_default(value) == mapTag4;
}
__name(baseIsMap, "baseIsMap");
var baseIsMap_default = baseIsMap;

// ../../node_modules/lodash-es/isMap.js
var nodeIsMap = nodeUtil_default && nodeUtil_default.isMap;
var isMap = nodeIsMap ? baseUnary_default(nodeIsMap) : baseIsMap_default;
var isMap_default = isMap;

// ../../node_modules/lodash-es/_baseIsSet.js
var setTag4 = "[object Set]";
function baseIsSet(value) {
  return isObjectLike_default(value) && getTag_default(value) == setTag4;
}
__name(baseIsSet, "baseIsSet");
var baseIsSet_default = baseIsSet;

// ../../node_modules/lodash-es/isSet.js
var nodeIsSet = nodeUtil_default && nodeUtil_default.isSet;
var isSet = nodeIsSet ? baseUnary_default(nodeIsSet) : baseIsSet_default;
var isSet_default = isSet;

// ../../node_modules/lodash-es/_baseClone.js
var CLONE_DEEP_FLAG = 1;
var CLONE_FLAT_FLAG = 2;
var CLONE_SYMBOLS_FLAG = 4;
var argsTag3 = "[object Arguments]";
var arrayTag2 = "[object Array]";
var boolTag3 = "[object Boolean]";
var dateTag3 = "[object Date]";
var errorTag2 = "[object Error]";
var funcTag3 = "[object Function]";
var genTag2 = "[object GeneratorFunction]";
var mapTag5 = "[object Map]";
var numberTag3 = "[object Number]";
var objectTag4 = "[object Object]";
var regexpTag3 = "[object RegExp]";
var setTag5 = "[object Set]";
var stringTag3 = "[object String]";
var symbolTag2 = "[object Symbol]";
var weakMapTag3 = "[object WeakMap]";
var arrayBufferTag3 = "[object ArrayBuffer]";
var dataViewTag4 = "[object DataView]";
var float32Tag3 = "[object Float32Array]";
var float64Tag3 = "[object Float64Array]";
var int8Tag3 = "[object Int8Array]";
var int16Tag3 = "[object Int16Array]";
var int32Tag3 = "[object Int32Array]";
var uint8Tag3 = "[object Uint8Array]";
var uint8ClampedTag3 = "[object Uint8ClampedArray]";
var uint16Tag3 = "[object Uint16Array]";
var uint32Tag3 = "[object Uint32Array]";
var cloneableTags = {};
cloneableTags[argsTag3] = cloneableTags[arrayTag2] = cloneableTags[arrayBufferTag3] = cloneableTags[dataViewTag4] = cloneableTags[boolTag3] = cloneableTags[dateTag3] = cloneableTags[float32Tag3] = cloneableTags[float64Tag3] = cloneableTags[int8Tag3] = cloneableTags[int16Tag3] = cloneableTags[int32Tag3] = cloneableTags[mapTag5] = cloneableTags[numberTag3] = cloneableTags[objectTag4] = cloneableTags[regexpTag3] = cloneableTags[setTag5] = cloneableTags[stringTag3] = cloneableTags[symbolTag2] = cloneableTags[uint8Tag3] = cloneableTags[uint8ClampedTag3] = cloneableTags[uint16Tag3] = cloneableTags[uint32Tag3] = true;
cloneableTags[errorTag2] = cloneableTags[funcTag3] = cloneableTags[weakMapTag3] = false;
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== void 0) {
    return result;
  }
  if (!isObject_default(value)) {
    return value;
  }
  var isArr = isArray_default(value);
  if (isArr) {
    result = initCloneArray_default(value);
    if (!isDeep) {
      return copyArray_default(value, result);
    }
  } else {
    var tag = getTag_default(value), isFunc = tag == funcTag3 || tag == genTag2;
    if (isBuffer_default(value)) {
      return cloneBuffer_default(value, isDeep);
    }
    if (tag == objectTag4 || tag == argsTag3 || isFunc && !object) {
      result = isFlat || isFunc ? {} : initCloneObject_default(value);
      if (!isDeep) {
        return isFlat ? copySymbolsIn_default(value, baseAssignIn_default(result, value)) : copySymbols_default(value, baseAssign_default(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag_default(value, tag, isDeep);
    }
  }
  stack || (stack = new Stack_default());
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);
  if (isSet_default(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap_default(value)) {
    value.forEach(function(subValue, key2) {
      result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
    });
  }
  var keysFunc = isFull ? isFlat ? getAllKeysIn_default : getAllKeys_default : isFlat ? keysIn_default : keys_default;
  var props = isArr ? void 0 : keysFunc(value);
  arrayEach_default(props || value, function(subValue, key2) {
    if (props) {
      key2 = subValue;
      subValue = value[key2];
    }
    assignValue_default(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
  });
  return result;
}
__name(baseClone, "baseClone");
var baseClone_default = baseClone;

// ../../node_modules/lodash-es/cloneDeep.js
var CLONE_DEEP_FLAG2 = 1;
var CLONE_SYMBOLS_FLAG2 = 4;
function cloneDeep(value) {
  return baseClone_default(value, CLONE_DEEP_FLAG2 | CLONE_SYMBOLS_FLAG2);
}
__name(cloneDeep, "cloneDeep");
var cloneDeep_default = cloneDeep;

// ../../node_modules/lodash-es/_setCacheAdd.js
var HASH_UNDEFINED3 = "__lodash_hash_undefined__";
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED3);
  return this;
}
__name(setCacheAdd, "setCacheAdd");
var setCacheAdd_default = setCacheAdd;

// ../../node_modules/lodash-es/_setCacheHas.js
function setCacheHas(value) {
  return this.__data__.has(value);
}
__name(setCacheHas, "setCacheHas");
var setCacheHas_default = setCacheHas;

// ../../node_modules/lodash-es/_SetCache.js
function SetCache(values) {
  var index = -1, length = values == null ? 0 : values.length;
  this.__data__ = new MapCache_default();
  while (++index < length) {
    this.add(values[index]);
  }
}
__name(SetCache, "SetCache");
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd_default;
SetCache.prototype.has = setCacheHas_default;
var SetCache_default = SetCache;

// ../../node_modules/lodash-es/_arraySome.js
function arraySome(array, predicate) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}
__name(arraySome, "arraySome");
var arraySome_default = arraySome;

// ../../node_modules/lodash-es/_cacheHas.js
function cacheHas(cache, key) {
  return cache.has(key);
}
__name(cacheHas, "cacheHas");
var cacheHas_default = cacheHas;

// ../../node_modules/lodash-es/_equalArrays.js
var COMPARE_PARTIAL_FLAG = 1;
var COMPARE_UNORDERED_FLAG = 2;
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache_default() : void 0;
  stack.set(array, other);
  stack.set(other, array);
  while (++index < arrLength) {
    var arrValue = array[index], othValue = other[index];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== void 0) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    if (seen) {
      if (!arraySome_default(other, function(othValue2, othIndex) {
        if (!cacheHas_default(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack["delete"](array);
  stack["delete"](other);
  return result;
}
__name(equalArrays, "equalArrays");
var equalArrays_default = equalArrays;

// ../../node_modules/lodash-es/_mapToArray.js
function mapToArray(map) {
  var index = -1, result = Array(map.size);
  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}
__name(mapToArray, "mapToArray");
var mapToArray_default = mapToArray;

// ../../node_modules/lodash-es/_setToArray.js
function setToArray(set) {
  var index = -1, result = Array(set.size);
  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}
__name(setToArray, "setToArray");
var setToArray_default = setToArray;

// ../../node_modules/lodash-es/_equalByTag.js
var COMPARE_PARTIAL_FLAG2 = 1;
var COMPARE_UNORDERED_FLAG2 = 2;
var boolTag4 = "[object Boolean]";
var dateTag4 = "[object Date]";
var errorTag3 = "[object Error]";
var mapTag6 = "[object Map]";
var numberTag4 = "[object Number]";
var regexpTag4 = "[object RegExp]";
var setTag6 = "[object Set]";
var stringTag4 = "[object String]";
var symbolTag3 = "[object Symbol]";
var arrayBufferTag4 = "[object ArrayBuffer]";
var dataViewTag5 = "[object DataView]";
var symbolProto2 = Symbol_default ? Symbol_default.prototype : void 0;
var symbolValueOf2 = symbolProto2 ? symbolProto2.valueOf : void 0;
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag5:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag4:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array_default(object), new Uint8Array_default(other))) {
        return false;
      }
      return true;
    case boolTag4:
    case dateTag4:
    case numberTag4:
      return eq_default(+object, +other);
    case errorTag3:
      return object.name == other.name && object.message == other.message;
    case regexpTag4:
    case stringTag4:
      return object == other + "";
    case mapTag6:
      var convert = mapToArray_default;
    case setTag6:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG2;
      convert || (convert = setToArray_default);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG2;
      stack.set(object, other);
      var result = equalArrays_default(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack["delete"](object);
      return result;
    case symbolTag3:
      if (symbolValueOf2) {
        return symbolValueOf2.call(object) == symbolValueOf2.call(other);
      }
  }
  return false;
}
__name(equalByTag, "equalByTag");
var equalByTag_default = equalByTag;

// ../../node_modules/lodash-es/_equalObjects.js
var COMPARE_PARTIAL_FLAG3 = 1;
var objectProto15 = Object.prototype;
var hasOwnProperty12 = objectProto15.hasOwnProperty;
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG3, objProps = getAllKeys_default(object), objLength = objProps.length, othProps = getAllKeys_default(other), othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty12.call(other, key))) {
      return false;
    }
  }
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);
  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key], othValue = other[key];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == "constructor");
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor, othCtor = other.constructor;
    if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack["delete"](object);
  stack["delete"](other);
  return result;
}
__name(equalObjects, "equalObjects");
var equalObjects_default = equalObjects;

// ../../node_modules/lodash-es/_baseIsEqualDeep.js
var COMPARE_PARTIAL_FLAG4 = 1;
var argsTag4 = "[object Arguments]";
var arrayTag3 = "[object Array]";
var objectTag5 = "[object Object]";
var objectProto16 = Object.prototype;
var hasOwnProperty13 = objectProto16.hasOwnProperty;
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_default(object), othIsArr = isArray_default(other), objTag = objIsArr ? arrayTag3 : getTag_default(object), othTag = othIsArr ? arrayTag3 : getTag_default(other);
  objTag = objTag == argsTag4 ? objectTag5 : objTag;
  othTag = othTag == argsTag4 ? objectTag5 : othTag;
  var objIsObj = objTag == objectTag5, othIsObj = othTag == objectTag5, isSameTag = objTag == othTag;
  if (isSameTag && isBuffer_default(object)) {
    if (!isBuffer_default(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack_default());
    return objIsArr || isTypedArray_default(object) ? equalArrays_default(object, other, bitmask, customizer, equalFunc, stack) : equalByTag_default(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG4)) {
    var objIsWrapped = objIsObj && hasOwnProperty13.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty13.call(other, "__wrapped__");
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new Stack_default());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack_default());
  return equalObjects_default(object, other, bitmask, customizer, equalFunc, stack);
}
__name(baseIsEqualDeep, "baseIsEqualDeep");
var baseIsEqualDeep_default = baseIsEqualDeep;

// ../../node_modules/lodash-es/_baseIsEqual.js
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike_default(value) && !isObjectLike_default(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep_default(value, other, bitmask, customizer, baseIsEqual, stack);
}
__name(baseIsEqual, "baseIsEqual");
var baseIsEqual_default = baseIsEqual;

// ../../node_modules/lodash-es/_createBaseFor.js
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}
__name(createBaseFor, "createBaseFor");
var createBaseFor_default = createBaseFor;

// ../../node_modules/lodash-es/_baseFor.js
var baseFor = createBaseFor_default();
var baseFor_default = baseFor;

// ../../node_modules/lodash-es/_assignMergeValue.js
function assignMergeValue(object, key, value) {
  if (value !== void 0 && !eq_default(object[key], value) || value === void 0 && !(key in object)) {
    baseAssignValue_default(object, key, value);
  }
}
__name(assignMergeValue, "assignMergeValue");
var assignMergeValue_default = assignMergeValue;

// ../../node_modules/lodash-es/isArrayLikeObject.js
function isArrayLikeObject(value) {
  return isObjectLike_default(value) && isArrayLike_default(value);
}
__name(isArrayLikeObject, "isArrayLikeObject");
var isArrayLikeObject_default = isArrayLikeObject;

// ../../node_modules/lodash-es/_safeGet.js
function safeGet(object, key) {
  if (key === "constructor" && typeof object[key] === "function") {
    return;
  }
  if (key == "__proto__") {
    return;
  }
  return object[key];
}
__name(safeGet, "safeGet");
var safeGet_default = safeGet;

// ../../node_modules/lodash-es/toPlainObject.js
function toPlainObject(value) {
  return copyObject_default(value, keysIn_default(value));
}
__name(toPlainObject, "toPlainObject");
var toPlainObject_default = toPlainObject;

// ../../node_modules/lodash-es/_baseMergeDeep.js
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet_default(object, key), srcValue = safeGet_default(source, key), stacked = stack.get(srcValue);
  if (stacked) {
    assignMergeValue_default(object, key, stacked);
    return;
  }
  var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
  var isCommon = newValue === void 0;
  if (isCommon) {
    var isArr = isArray_default(srcValue), isBuff = !isArr && isBuffer_default(srcValue), isTyped = !isArr && !isBuff && isTypedArray_default(srcValue);
    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray_default(objValue)) {
        newValue = objValue;
      } else if (isArrayLikeObject_default(objValue)) {
        newValue = copyArray_default(objValue);
      } else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer_default(srcValue, true);
      } else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray_default(srcValue, true);
      } else {
        newValue = [];
      }
    } else if (isPlainObject_default(srcValue) || isArguments_default(srcValue)) {
      newValue = objValue;
      if (isArguments_default(objValue)) {
        newValue = toPlainObject_default(objValue);
      } else if (!isObject_default(objValue) || isFunction_default(objValue)) {
        newValue = initCloneObject_default(srcValue);
      }
    } else {
      isCommon = false;
    }
  }
  if (isCommon) {
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack["delete"](srcValue);
  }
  assignMergeValue_default(object, key, newValue);
}
__name(baseMergeDeep, "baseMergeDeep");
var baseMergeDeep_default = baseMergeDeep;

// ../../node_modules/lodash-es/_baseMerge.js
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor_default(source, function(srcValue, key) {
    stack || (stack = new Stack_default());
    if (isObject_default(srcValue)) {
      baseMergeDeep_default(object, source, key, srcIndex, baseMerge, customizer, stack);
    } else {
      var newValue = customizer ? customizer(safeGet_default(object, key), srcValue, key + "", object, source, stack) : void 0;
      if (newValue === void 0) {
        newValue = srcValue;
      }
      assignMergeValue_default(object, key, newValue);
    }
  }, keysIn_default);
}
__name(baseMerge, "baseMerge");
var baseMerge_default = baseMerge;

// ../../node_modules/lodash-es/isEqual.js
function isEqual(value, other) {
  return baseIsEqual_default(value, other);
}
__name(isEqual, "isEqual");
var isEqual_default = isEqual;

// ../../node_modules/lodash-es/merge.js
var merge = createAssigner_default(function(object, source, srcIndex) {
  baseMerge_default(object, source, srcIndex);
});
var merge_default = merge;

// src/core/quill.ts
import * as Parchment from "parchment";
import Delta3 from "quill-delta";

// src/core/editor.ts
import { LeafBlot as LeafBlot3, EmbedBlot as EmbedBlot5, Scope as Scope5, ParentBlot } from "parchment";
import Delta2, { AttributeMap, Op } from "quill-delta";

// src/blots/block.ts
import {
  AttributorStore,
  BlockBlot,
  EmbedBlot as EmbedBlot3,
  LeafBlot,
  Scope as Scope2
} from "parchment";
import Delta from "quill-delta";

// src/blots/break.ts
import { EmbedBlot } from "parchment";
var Break = class extends EmbedBlot {
  static {
    __name(this, "Break");
  }
  static value() {
    return void 0;
  }
  optimize() {
    if (this.prev || this.next) {
      this.remove();
    }
  }
  length() {
    return 0;
  }
  value() {
    return "";
  }
};
Break.blotName = "break";
Break.tagName = "BR";
var break_default = Break;

// src/blots/inline.ts
import { EmbedBlot as EmbedBlot2, InlineBlot, Scope } from "parchment";

// src/blots/text.ts
import { TextBlot } from "parchment";
var Text2 = class extends TextBlot {
  static {
    __name(this, "Text");
  }
};
function escapeText(text) {
  return text.replace(/[&<>"']/g, (s) => {
    const entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entityMap[s];
  });
}
__name(escapeText, "escapeText");

// src/blots/inline.ts
var Inline = class _Inline extends InlineBlot {
  static {
    __name(this, "Inline");
  }
  static {
    this.allowedChildren = [_Inline, break_default, EmbedBlot2, Text2];
  }
  static {
    // Lower index means deeper in the DOM tree, since not found (-1) is for embeds
    this.order = [
      "cursor",
      "inline",
      // Must be lower
      "link",
      // Chrome wants <a> to be lower
      "underline",
      "strike",
      "italic",
      "bold",
      "script",
      "code"
      // Must be higher
    ];
  }
  static compare(self2, other) {
    const selfIndex = _Inline.order.indexOf(self2);
    const otherIndex = _Inline.order.indexOf(other);
    if (selfIndex >= 0 || otherIndex >= 0) {
      return selfIndex - otherIndex;
    }
    if (self2 === other) {
      return 0;
    }
    if (self2 < other) {
      return -1;
    }
    return 1;
  }
  formatAt(index, length, name, value) {
    if (_Inline.compare(this.statics.blotName, name) < 0 && this.scroll.query(name, Scope.BLOT)) {
      const blot = this.isolate(index, length);
      if (value) {
        blot.wrap(name, value);
      }
    } else {
      super.formatAt(index, length, name, value);
    }
  }
  optimize(context) {
    super.optimize(context);
    if (this.parent instanceof _Inline && _Inline.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
      const parent = this.parent.isolate(this.offset(), this.length());
      this.moveChildren(parent);
      parent.wrap(this);
    }
  }
};
var inline_default = Inline;

// src/blots/block.ts
var NEWLINE_LENGTH = 1;
var Block = class extends BlockBlot {
  constructor() {
    super(...arguments);
    this.cache = {};
  }
  static {
    __name(this, "Block");
  }
  delta() {
    if (this.cache.delta == null) {
      this.cache.delta = blockDelta(this);
    }
    return this.cache.delta;
  }
  deleteAt(index, length) {
    super.deleteAt(index, length);
    this.cache = {};
  }
  formatAt(index, length, name, value) {
    if (length <= 0)
      return;
    if (this.scroll.query(name, Scope2.BLOCK)) {
      if (index + length === this.length()) {
        this.format(name, value);
      }
    } else {
      super.formatAt(
        index,
        Math.min(length, this.length() - index - 1),
        name,
        value
      );
    }
    this.cache = {};
  }
  insertAt(index, value, def) {
    if (def != null) {
      super.insertAt(index, value, def);
      this.cache = {};
      return;
    }
    if (value.length === 0)
      return;
    const lines = value.split("\n");
    const text = lines.shift();
    if (text.length > 0) {
      if (index < this.length() - 1 || this.children.tail == null) {
        super.insertAt(Math.min(index, this.length() - 1), text);
      } else {
        this.children.tail.insertAt(this.children.tail.length(), text);
      }
      this.cache = {};
    }
    let block = this;
    lines.reduce((lineIndex, line) => {
      block = block.split(lineIndex, true);
      block.insertAt(0, line);
      return line.length;
    }, index + text.length);
  }
  insertBefore(blot, ref) {
    const { head } = this.children;
    super.insertBefore(blot, ref);
    if (head instanceof break_default) {
      head.remove();
    }
    this.cache = {};
  }
  length() {
    if (this.cache.length == null) {
      this.cache.length = super.length() + NEWLINE_LENGTH;
    }
    return this.cache.length;
  }
  moveChildren(target, ref) {
    super.moveChildren(target, ref);
    this.cache = {};
  }
  optimize(context) {
    super.optimize(context);
    this.cache = {};
  }
  path(index) {
    return super.path(index, true);
  }
  removeChild(child) {
    super.removeChild(child);
    this.cache = {};
  }
  split(index, force = false) {
    if (force && (index === 0 || index >= this.length() - NEWLINE_LENGTH)) {
      const clone = this.clone();
      if (index === 0) {
        this.parent.insertBefore(clone, this);
        return this;
      }
      this.parent.insertBefore(clone, this.next);
      return clone;
    }
    const next = super.split(index, force);
    this.cache = {};
    return next;
  }
};
Block.blotName = "block";
Block.tagName = "P";
Block.defaultChild = break_default;
Block.allowedChildren = [break_default, inline_default, EmbedBlot3, Text2];
var BlockEmbed = class extends EmbedBlot3 {
  static {
    __name(this, "BlockEmbed");
  }
  attach() {
    super.attach();
    this.attributes = new AttributorStore(this.domNode);
  }
  delta() {
    return new Delta().insert(this.value(), {
      ...this.formats(),
      ...this.attributes.values()
    });
  }
  format(name, value) {
    const attribute = this.scroll.query(name, Scope2.BLOCK_ATTRIBUTE);
    if (attribute != null) {
      this.attributes.attribute(attribute, value);
    }
  }
  formatAt(index, length, name, value) {
    this.format(name, value);
  }
  insertAt(index, value, def) {
    if (def != null) {
      super.insertAt(index, value, def);
      return;
    }
    const lines = value.split("\n");
    const text = lines.pop();
    const blocks = lines.map((line) => {
      const block = this.scroll.create(Block.blotName);
      block.insertAt(0, line);
      return block;
    });
    const ref = this.split(index);
    blocks.forEach((block) => {
      this.parent.insertBefore(block, ref);
    });
    if (text) {
      this.parent.insertBefore(this.scroll.create("text", text), ref);
    }
  }
};
BlockEmbed.scope = Scope2.BLOCK_BLOT;
function blockDelta(blot, filter = true) {
  return blot.descendants(LeafBlot).reduce((delta, leaf) => {
    if (leaf.length() === 0) {
      return delta;
    }
    return delta.insert(leaf.value(), bubbleFormats(leaf, {}, filter));
  }, new Delta()).insert("\n", bubbleFormats(blot));
}
__name(blockDelta, "blockDelta");
function bubbleFormats(blot, formats = {}, filter = true) {
  if (blot == null)
    return formats;
  if ("formats" in blot && typeof blot.formats === "function") {
    formats = {
      ...formats,
      ...blot.formats()
    };
    if (filter) {
      delete formats["code-token"];
    }
  }
  if (blot.parent == null || blot.parent.statics.blotName === "scroll" || blot.parent.statics.scope !== blot.statics.scope) {
    return formats;
  }
  return bubbleFormats(blot.parent, formats, filter);
}
__name(bubbleFormats, "bubbleFormats");

// src/blots/cursor.ts
import { EmbedBlot as EmbedBlot4, Scope as Scope3 } from "parchment";
var Cursor = class _Cursor extends EmbedBlot4 {
  static {
    __name(this, "Cursor");
  }
  static {
    this.blotName = "cursor";
  }
  static {
    this.className = "ql-cursor";
  }
  static {
    this.tagName = "span";
  }
  static {
    this.CONTENTS = "\uFEFF";
  }
  // Zero width no break space
  static value() {
    return void 0;
  }
  constructor(scroll, domNode, selection) {
    super(scroll, domNode);
    this.selection = selection;
    this.textNode = document.createTextNode(_Cursor.CONTENTS);
    this.domNode.appendChild(this.textNode);
    this.savedLength = 0;
  }
  detach() {
    if (this.parent != null)
      this.parent.removeChild(this);
  }
  format(name, value) {
    if (this.savedLength !== 0) {
      super.format(name, value);
      return;
    }
    let target = this;
    let index = 0;
    while (target != null && target.statics.scope !== Scope3.BLOCK_BLOT) {
      index += target.offset(target.parent);
      target = target.parent;
    }
    if (target != null) {
      this.savedLength = _Cursor.CONTENTS.length;
      target.optimize();
      target.formatAt(index, _Cursor.CONTENTS.length, name, value);
      this.savedLength = 0;
    }
  }
  index(node, offset) {
    if (node === this.textNode)
      return 0;
    return super.index(node, offset);
  }
  length() {
    return this.savedLength;
  }
  position() {
    return [this.textNode, this.textNode.data.length];
  }
  remove() {
    super.remove();
    this.parent = null;
  }
  restore() {
    if (this.selection.composing || this.parent == null)
      return null;
    const range = this.selection.getNativeRange();
    while (this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode) {
      this.domNode.parentNode.insertBefore(
        this.domNode.lastChild,
        this.domNode
      );
    }
    const prevTextBlot = this.prev instanceof Text2 ? this.prev : null;
    const prevTextLength = prevTextBlot ? prevTextBlot.length() : 0;
    const nextTextBlot = this.next instanceof Text2 ? this.next : null;
    const nextText = nextTextBlot ? nextTextBlot.text : "";
    const { textNode } = this;
    const newText = textNode.data.split(_Cursor.CONTENTS).join("");
    textNode.data = _Cursor.CONTENTS;
    let mergedTextBlot;
    if (prevTextBlot) {
      mergedTextBlot = prevTextBlot;
      if (newText || nextTextBlot) {
        prevTextBlot.insertAt(prevTextBlot.length(), newText + nextText);
        if (nextTextBlot) {
          nextTextBlot.remove();
        }
      }
    } else if (nextTextBlot) {
      mergedTextBlot = nextTextBlot;
      nextTextBlot.insertAt(0, newText);
    } else {
      const newTextNode = document.createTextNode(newText);
      mergedTextBlot = this.scroll.create(newTextNode);
      this.parent.insertBefore(mergedTextBlot, this);
    }
    this.remove();
    if (range) {
      const remapOffset = /* @__PURE__ */ __name((node, offset) => {
        if (prevTextBlot && node === prevTextBlot.domNode) {
          return offset;
        }
        if (node === textNode) {
          return prevTextLength + offset - 1;
        }
        if (nextTextBlot && node === nextTextBlot.domNode) {
          return prevTextLength + newText.length + offset;
        }
        return null;
      }, "remapOffset");
      const start = remapOffset(range.start.node, range.start.offset);
      const end = remapOffset(range.end.node, range.end.offset);
      if (start !== null && end !== null) {
        return {
          startNode: mergedTextBlot.domNode,
          startOffset: start,
          endNode: mergedTextBlot.domNode,
          endOffset: end
        };
      }
    }
    return null;
  }
  update(mutations, context) {
    if (mutations.some((mutation) => {
      return mutation.type === "characterData" && mutation.target === this.textNode;
    })) {
      const range = this.restore();
      if (range)
        context.range = range;
    }
  }
  // Avoid .ql-cursor being a descendant of `<a/>`.
  // The reason is Safari pushes down `<a/>` on text insertion.
  // That will cause DOM nodes not sync with the model.
  //
  // For example ({I} is the caret), given the markup:
  //    <a><span class="ql-cursor">\uFEFF{I}</span></a>
  // When typing a char "x", `<a/>` will be pushed down inside the `<span>` first:
  //    <span class="ql-cursor"><a>\uFEFF{I}</a></span>
  // And then "x" will be inserted after `<a/>`:
  //    <span class="ql-cursor"><a>\uFEFF</a>d{I}</span>
  optimize(context) {
    super.optimize(context);
    let { parent } = this;
    while (parent) {
      if (parent.domNode.tagName === "A") {
        this.savedLength = _Cursor.CONTENTS.length;
        parent.isolate(this.offset(parent), this.length()).unwrap();
        this.savedLength = 0;
        break;
      }
      parent = parent.parent;
    }
  }
  value() {
    return "";
  }
};
var cursor_default = Cursor;

// src/core/selection.ts
import { LeafBlot as LeafBlot2, Scope as Scope4 } from "parchment";

// ../../node_modules/eventemitter3/index.mjs
var import_index = __toESM(require_eventemitter3(), 1);

// src/core/instances.ts
var instances_default = /* @__PURE__ */ new WeakMap();

// src/core/logger.ts
var levels = ["error", "warn", "log", "info"];
var level = "warn";
function debug(method, ...args) {
  if (level) {
    if (levels.indexOf(method) <= levels.indexOf(level)) {
      console[method](...args);
    }
  }
}
__name(debug, "debug");
function namespace(ns) {
  return levels.reduce(
    (logger, method) => {
      logger[method] = debug.bind(console, method, ns);
      return logger;
    },
    {}
  );
}
__name(namespace, "namespace");
namespace.level = (newLevel) => {
  level = newLevel;
};
debug.level = namespace.level;
var logger_default = namespace;

// src/core/emitter.ts
var debug2 = logger_default("quill:events");
var EVENTS = ["selectionchange", "mousedown", "mouseup", "click"];
EVENTS.forEach((eventName) => {
  document.addEventListener(eventName, (...args) => {
    Array.from(document.querySelectorAll(".ql-container")).forEach((node) => {
      const quill = instances_default.get(node);
      if (quill && quill.emitter) {
        quill.emitter.handleDOM(...args);
      }
    });
  });
});
var Emitter = class extends import_index.default {
  static {
    __name(this, "Emitter");
  }
  static {
    this.events = {
      EDITOR_CHANGE: "editor-change",
      SCROLL_BEFORE_UPDATE: "scroll-before-update",
      SCROLL_BLOT_MOUNT: "scroll-blot-mount",
      SCROLL_BLOT_UNMOUNT: "scroll-blot-unmount",
      SCROLL_OPTIMIZE: "scroll-optimize",
      SCROLL_UPDATE: "scroll-update",
      SCROLL_EMBED_UPDATE: "scroll-embed-update",
      SELECTION_CHANGE: "selection-change",
      TEXT_CHANGE: "text-change",
      COMPOSITION_BEFORE_START: "composition-before-start",
      COMPOSITION_START: "composition-start",
      COMPOSITION_BEFORE_END: "composition-before-end",
      COMPOSITION_END: "composition-end"
    };
  }
  static {
    this.sources = {
      API: "api",
      SILENT: "silent",
      USER: "user"
    };
  }
  constructor() {
    super();
    this.domListeners = {};
    this.on("error", debug2.error);
  }
  emit(...args) {
    debug2.log.call(debug2, ...args);
    return super.emit(...args);
  }
  handleDOM(event, ...args) {
    (this.domListeners[event.type] || []).forEach(({ node, handler }) => {
      if (event.target === node || node.contains(event.target)) {
        handler(event, ...args);
      }
    });
  }
  listenDOM(eventName, node, handler) {
    if (!this.domListeners[eventName]) {
      this.domListeners[eventName] = [];
    }
    this.domListeners[eventName].push({ node, handler });
  }
};
var emitter_default = Emitter;

// src/core/selection.ts
var debug3 = logger_default("quill:selection");
var Range = class {
  constructor(index, length = 0) {
    this.index = index;
    this.length = length;
  }
  static {
    __name(this, "Range");
  }
};
var Selection = class {
  static {
    __name(this, "Selection");
  }
  constructor(scroll, emitter) {
    this.emitter = emitter;
    this.scroll = scroll;
    this.composing = false;
    this.mouseDown = false;
    this.root = this.scroll.domNode;
    this.cursor = this.scroll.create("cursor", this);
    this.savedRange = new Range(0, 0);
    this.lastRange = this.savedRange;
    this.lastNative = null;
    this.handleComposition();
    this.handleDragging();
    this.emitter.listenDOM("selectionchange", document, () => {
      if (!this.mouseDown && !this.composing) {
        setTimeout(this.update.bind(this, emitter_default.sources.USER), 1);
      }
    });
    this.emitter.on(emitter_default.events.SCROLL_BEFORE_UPDATE, () => {
      if (!this.hasFocus())
        return;
      const native = this.getNativeRange();
      if (native == null)
        return;
      if (native.start.node === this.cursor.textNode)
        return;
      this.emitter.once(
        emitter_default.events.SCROLL_UPDATE,
        (source, mutations) => {
          try {
            if (this.root.contains(native.start.node) && this.root.contains(native.end.node)) {
              this.setNativeRange(
                native.start.node,
                native.start.offset,
                native.end.node,
                native.end.offset
              );
            }
            const triggeredByTyping = mutations.some(
              (mutation) => mutation.type === "characterData" || mutation.type === "childList" || mutation.type === "attributes" && mutation.target === this.root
            );
            this.update(triggeredByTyping ? emitter_default.sources.SILENT : source);
          } catch (ignored) {
          }
        }
      );
    });
    this.emitter.on(emitter_default.events.SCROLL_OPTIMIZE, (mutations, context) => {
      if (context.range) {
        const { startNode, startOffset, endNode, endOffset } = context.range;
        this.setNativeRange(startNode, startOffset, endNode, endOffset);
        this.update(emitter_default.sources.SILENT);
      }
    });
    this.update(emitter_default.sources.SILENT);
  }
  handleComposition() {
    this.emitter.on(emitter_default.events.COMPOSITION_BEFORE_START, () => {
      this.composing = true;
    });
    this.emitter.on(emitter_default.events.COMPOSITION_END, () => {
      this.composing = false;
      if (this.cursor.parent) {
        const range = this.cursor.restore();
        if (!range)
          return;
        setTimeout(() => {
          this.setNativeRange(
            range.startNode,
            range.startOffset,
            range.endNode,
            range.endOffset
          );
        }, 1);
      }
    });
  }
  handleDragging() {
    this.emitter.listenDOM("mousedown", document.body, () => {
      this.mouseDown = true;
    });
    this.emitter.listenDOM("mouseup", document.body, () => {
      this.mouseDown = false;
      this.update(emitter_default.sources.USER);
    });
  }
  focus() {
    if (this.hasFocus())
      return;
    this.root.focus({ preventScroll: true });
    this.setRange(this.savedRange);
  }
  format(format, value) {
    this.scroll.update();
    const nativeRange = this.getNativeRange();
    if (nativeRange == null || !nativeRange.native.collapsed || this.scroll.query(format, Scope4.BLOCK))
      return;
    if (nativeRange.start.node !== this.cursor.textNode) {
      const blot = this.scroll.find(nativeRange.start.node, false);
      if (blot == null)
        return;
      if (blot instanceof LeafBlot2) {
        const after = blot.split(nativeRange.start.offset);
        blot.parent.insertBefore(this.cursor, after);
      } else {
        blot.insertBefore(this.cursor, nativeRange.start.node);
      }
      this.cursor.attach();
    }
    this.cursor.format(format, value);
    this.scroll.optimize();
    this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length);
    this.update();
  }
  getBounds(index, length = 0) {
    const scrollLength = this.scroll.length();
    index = Math.min(index, scrollLength - 1);
    length = Math.min(index + length, scrollLength - 1) - index;
    let node;
    let [leaf, offset] = this.scroll.leaf(index);
    if (leaf == null)
      return null;
    if (length > 0 && offset === leaf.length()) {
      const [next] = this.scroll.leaf(index + 1);
      if (next) {
        const [line] = this.scroll.line(index);
        const [nextLine] = this.scroll.line(index + 1);
        if (line === nextLine) {
          leaf = next;
          offset = 0;
        }
      }
    }
    [node, offset] = leaf.position(offset, true);
    const range = document.createRange();
    if (length > 0) {
      range.setStart(node, offset);
      [leaf, offset] = this.scroll.leaf(index + length);
      if (leaf == null)
        return null;
      [node, offset] = leaf.position(offset, true);
      range.setEnd(node, offset);
      return range.getBoundingClientRect();
    }
    let side = "left";
    let rect;
    if (node instanceof Text) {
      if (!node.data.length) {
        return null;
      }
      if (offset < node.data.length) {
        range.setStart(node, offset);
        range.setEnd(node, offset + 1);
      } else {
        range.setStart(node, offset - 1);
        range.setEnd(node, offset);
        side = "right";
      }
      rect = range.getBoundingClientRect();
    } else {
      if (!(leaf.domNode instanceof Element))
        return null;
      rect = leaf.domNode.getBoundingClientRect();
      if (offset > 0)
        side = "right";
    }
    return {
      bottom: rect.top + rect.height,
      height: rect.height,
      left: rect[side],
      right: rect[side],
      top: rect.top,
      width: 0
    };
  }
  getNativeRange() {
    const selection = document.getSelection();
    if (selection == null || selection.rangeCount <= 0)
      return null;
    const nativeRange = selection.getRangeAt(0);
    if (nativeRange == null)
      return null;
    const range = this.normalizeNative(nativeRange);
    debug3.info("getNativeRange", range);
    return range;
  }
  getRange() {
    const root2 = this.scroll.domNode;
    if ("isConnected" in root2 && !root2.isConnected) {
      return [null, null];
    }
    const normalized = this.getNativeRange();
    if (normalized == null)
      return [null, null];
    const range = this.normalizedToRange(normalized);
    return [range, normalized];
  }
  hasFocus() {
    return document.activeElement === this.root || document.activeElement != null && contains(this.root, document.activeElement);
  }
  normalizedToRange(range) {
    const positions = [
      [range.start.node, range.start.offset]
    ];
    if (!range.native.collapsed) {
      positions.push([range.end.node, range.end.offset]);
    }
    const indexes = positions.map((position) => {
      const [node, offset] = position;
      const blot = this.scroll.find(node, true);
      const index = blot.offset(this.scroll);
      if (offset === 0) {
        return index;
      }
      if (blot instanceof LeafBlot2) {
        return index + blot.index(node, offset);
      }
      return index + blot.length();
    });
    const end = Math.min(Math.max(...indexes), this.scroll.length() - 1);
    const start = Math.min(end, ...indexes);
    return new Range(start, end - start);
  }
  normalizeNative(nativeRange) {
    if (!contains(this.root, nativeRange.startContainer) || !nativeRange.collapsed && !contains(this.root, nativeRange.endContainer)) {
      return null;
    }
    const range = {
      start: {
        node: nativeRange.startContainer,
        offset: nativeRange.startOffset
      },
      end: { node: nativeRange.endContainer, offset: nativeRange.endOffset },
      native: nativeRange
    };
    [range.start, range.end].forEach((position) => {
      let { node, offset } = position;
      while (!(node instanceof Text) && node.childNodes.length > 0) {
        if (node.childNodes.length > offset) {
          node = node.childNodes[offset];
          offset = 0;
        } else if (node.childNodes.length === offset) {
          node = node.lastChild;
          if (node instanceof Text) {
            offset = node.data.length;
          } else if (node.childNodes.length > 0) {
            offset = node.childNodes.length;
          } else {
            offset = node.childNodes.length + 1;
          }
        } else {
          break;
        }
      }
      position.node = node;
      position.offset = offset;
    });
    return range;
  }
  rangeToNative(range) {
    const scrollLength = this.scroll.length();
    const getPosition = /* @__PURE__ */ __name((index, inclusive) => {
      index = Math.min(scrollLength - 1, index);
      const [leaf, leafOffset] = this.scroll.leaf(index);
      return leaf ? leaf.position(leafOffset, inclusive) : [null, -1];
    }, "getPosition");
    return [
      ...getPosition(range.index, false),
      ...getPosition(range.index + range.length, true)
    ];
  }
  setNativeRange(startNode, startOffset, endNode = startNode, endOffset = startOffset, force = false) {
    debug3.info("setNativeRange", startNode, startOffset, endNode, endOffset);
    if (startNode != null && (this.root.parentNode == null || startNode.parentNode == null || // @ts-expect-error Fix me later
    endNode.parentNode == null)) {
      return;
    }
    const selection = document.getSelection();
    if (selection == null)
      return;
    if (startNode != null) {
      if (!this.hasFocus())
        this.root.focus({ preventScroll: true });
      const { native } = this.getNativeRange() || {};
      if (native == null || force || startNode !== native.startContainer || startOffset !== native.startOffset || endNode !== native.endContainer || endOffset !== native.endOffset) {
        if (startNode instanceof Element && startNode.tagName === "BR") {
          startOffset = Array.from(startNode.parentNode.childNodes).indexOf(
            startNode
          );
          startNode = startNode.parentNode;
        }
        if (endNode instanceof Element && endNode.tagName === "BR") {
          endOffset = Array.from(endNode.parentNode.childNodes).indexOf(
            endNode
          );
          endNode = endNode.parentNode;
        }
        const range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      selection.removeAllRanges();
      this.root.blur();
    }
  }
  setRange(range, force = false, source = emitter_default.sources.API) {
    if (typeof force === "string") {
      source = force;
      force = false;
    }
    debug3.info("setRange", range);
    if (range != null) {
      const args = this.rangeToNative(range);
      this.setNativeRange(...args, force);
    } else {
      this.setNativeRange(null);
    }
    this.update(source);
  }
  update(source = emitter_default.sources.USER) {
    const oldRange = this.lastRange;
    const [lastRange, nativeRange] = this.getRange();
    this.lastRange = lastRange;
    this.lastNative = nativeRange;
    if (this.lastRange != null) {
      this.savedRange = this.lastRange;
    }
    if (!isEqual_default(oldRange, this.lastRange)) {
      if (!this.composing && nativeRange != null && nativeRange.native.collapsed && nativeRange.start.node !== this.cursor.textNode) {
        const range = this.cursor.restore();
        if (range) {
          this.setNativeRange(
            range.startNode,
            range.startOffset,
            range.endNode,
            range.endOffset
          );
        }
      }
      const args = [
        emitter_default.events.SELECTION_CHANGE,
        cloneDeep_default(this.lastRange),
        cloneDeep_default(oldRange),
        source
      ];
      this.emitter.emit(emitter_default.events.EDITOR_CHANGE, ...args);
      if (source !== emitter_default.sources.SILENT) {
        this.emitter.emit(...args);
      }
    }
  }
};
function contains(parent, descendant) {
  try {
    descendant.parentNode;
  } catch (e) {
    return false;
  }
  return parent.contains(descendant);
}
__name(contains, "contains");
var selection_default = Selection;

// src/core/editor.ts
var ASCII = /^[ -~]*$/;
var Editor = class {
  static {
    __name(this, "Editor");
  }
  constructor(scroll) {
    this.scroll = scroll;
    this.delta = this.getDelta();
  }
  applyDelta(delta) {
    this.scroll.update();
    let scrollLength = this.scroll.length();
    this.scroll.batchStart();
    const normalizedDelta = normalizeDelta(delta);
    const deleteDelta = new Delta2();
    const normalizedOps = splitOpLines(normalizedDelta.ops.slice());
    normalizedOps.reduce((index, op) => {
      const length = Op.length(op);
      let attributes = op.attributes || {};
      let isImplicitNewlinePrepended = false;
      let isImplicitNewlineAppended = false;
      if (op.insert != null) {
        deleteDelta.retain(length);
        if (typeof op.insert === "string") {
          const text = op.insert;
          isImplicitNewlineAppended = !text.endsWith("\n") && (scrollLength <= index || !!this.scroll.descendant(BlockEmbed, index)[0]);
          this.scroll.insertAt(index, text);
          const [line, offset] = this.scroll.line(index);
          let formats = merge_default({}, bubbleFormats(line));
          if (line instanceof Block) {
            const [leaf] = line.descendant(LeafBlot3, offset);
            if (leaf) {
              formats = merge_default(formats, bubbleFormats(leaf));
            }
          }
          attributes = AttributeMap.diff(formats, attributes) || {};
        } else if (typeof op.insert === "object") {
          const key = Object.keys(op.insert)[0];
          if (key == null)
            return index;
          const isInlineEmbed = this.scroll.query(key, Scope5.INLINE) != null;
          if (isInlineEmbed) {
            if (scrollLength <= index || !!this.scroll.descendant(BlockEmbed, index)[0]) {
              isImplicitNewlineAppended = true;
            }
          } else if (index > 0) {
            const [leaf, offset] = this.scroll.descendant(LeafBlot3, index - 1);
            if (leaf instanceof Text2) {
              const text = leaf.value();
              if (text[offset] !== "\n") {
                isImplicitNewlinePrepended = true;
              }
            } else if (leaf instanceof EmbedBlot5 && leaf.statics.scope === Scope5.INLINE_BLOT) {
              isImplicitNewlinePrepended = true;
            }
          }
          this.scroll.insertAt(index, key, op.insert[key]);
          if (isInlineEmbed) {
            const [leaf] = this.scroll.descendant(LeafBlot3, index);
            if (leaf) {
              const formats = merge_default({}, bubbleFormats(leaf));
              attributes = AttributeMap.diff(formats, attributes) || {};
            }
          }
        }
        scrollLength += length;
      } else {
        deleteDelta.push(op);
        if (op.retain !== null && typeof op.retain === "object") {
          const key = Object.keys(op.retain)[0];
          if (key == null)
            return index;
          this.scroll.updateEmbedAt(index, key, op.retain[key]);
        }
      }
      Object.keys(attributes).forEach((name) => {
        this.scroll.formatAt(index, length, name, attributes[name]);
      });
      const prependedLength = isImplicitNewlinePrepended ? 1 : 0;
      const addedLength = isImplicitNewlineAppended ? 1 : 0;
      scrollLength += prependedLength + addedLength;
      deleteDelta.retain(prependedLength);
      deleteDelta.delete(addedLength);
      return index + length + prependedLength + addedLength;
    }, 0);
    deleteDelta.reduce((index, op) => {
      if (typeof op.delete === "number") {
        this.scroll.deleteAt(index, op.delete);
        return index;
      }
      return index + Op.length(op);
    }, 0);
    this.scroll.batchEnd();
    this.scroll.optimize();
    return this.update(normalizedDelta);
  }
  deleteText(index, length) {
    this.scroll.deleteAt(index, length);
    return this.update(new Delta2().retain(index).delete(length));
  }
  formatLine(index, length, formats = {}) {
    this.scroll.update();
    Object.keys(formats).forEach((format) => {
      this.scroll.lines(index, Math.max(length, 1)).forEach((line) => {
        line.format(format, formats[format]);
      });
    });
    this.scroll.optimize();
    const delta = new Delta2().retain(index).retain(length, cloneDeep_default(formats));
    return this.update(delta);
  }
  formatText(index, length, formats = {}) {
    Object.keys(formats).forEach((format) => {
      this.scroll.formatAt(index, length, format, formats[format]);
    });
    const delta = new Delta2().retain(index).retain(length, cloneDeep_default(formats));
    return this.update(delta);
  }
  getContents(index, length) {
    return this.delta.slice(index, index + length);
  }
  getDelta() {
    return this.scroll.lines().reduce((delta, line) => {
      return delta.concat(line.delta());
    }, new Delta2());
  }
  getFormat(index, length = 0) {
    let lines = [];
    let leaves = [];
    if (length === 0) {
      this.scroll.path(index).forEach((path) => {
        const [blot] = path;
        if (blot instanceof Block) {
          lines.push(blot);
        } else if (blot instanceof LeafBlot3) {
          leaves.push(blot);
        }
      });
    } else {
      lines = this.scroll.lines(index, length);
      leaves = this.scroll.descendants(LeafBlot3, index, length);
    }
    const [lineFormats, leafFormats] = [lines, leaves].map((blots) => {
      const blot = blots.shift();
      if (blot == null)
        return {};
      let formats = bubbleFormats(blot);
      while (Object.keys(formats).length > 0) {
        const blot2 = blots.shift();
        if (blot2 == null)
          return formats;
        formats = combineFormats(bubbleFormats(blot2), formats);
      }
      return formats;
    });
    return { ...lineFormats, ...leafFormats };
  }
  getHTML(index, length) {
    const [line, lineOffset] = this.scroll.line(index);
    if (line) {
      const lineLength = line.length();
      const isWithinLine = line.length() >= lineOffset + length;
      if (isWithinLine && !(lineOffset === 0 && length === lineLength)) {
        return convertHTML(line, lineOffset, length, true);
      }
      return convertHTML(this.scroll, index, length, true);
    }
    return "";
  }
  getText(index, length) {
    return this.getContents(index, length).filter((op) => typeof op.insert === "string").map((op) => op.insert).join("");
  }
  insertContents(index, contents) {
    const normalizedDelta = normalizeDelta(contents);
    const change = new Delta2().retain(index).concat(normalizedDelta);
    this.scroll.insertContents(index, normalizedDelta);
    return this.update(change);
  }
  insertEmbed(index, embed, value) {
    this.scroll.insertAt(index, embed, value);
    return this.update(new Delta2().retain(index).insert({ [embed]: value }));
  }
  insertText(index, text, formats = {}) {
    text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    this.scroll.insertAt(index, text);
    Object.keys(formats).forEach((format) => {
      this.scroll.formatAt(index, text.length, format, formats[format]);
    });
    return this.update(
      new Delta2().retain(index).insert(text, cloneDeep_default(formats))
    );
  }
  isBlank() {
    if (this.scroll.children.length === 0)
      return true;
    if (this.scroll.children.length > 1)
      return false;
    const blot = this.scroll.children.head;
    if (blot?.statics.blotName !== Block.blotName)
      return false;
    const block = blot;
    if (block.children.length > 1)
      return false;
    return block.children.head instanceof break_default;
  }
  removeFormat(index, length) {
    const text = this.getText(index, length);
    const [line, offset] = this.scroll.line(index + length);
    let suffixLength = 0;
    let suffix = new Delta2();
    if (line != null) {
      suffixLength = line.length() - offset;
      suffix = line.delta().slice(offset, offset + suffixLength - 1).insert("\n");
    }
    const contents = this.getContents(index, length + suffixLength);
    const diff = contents.diff(new Delta2().insert(text).concat(suffix));
    const delta = new Delta2().retain(index).concat(diff);
    return this.applyDelta(delta);
  }
  update(change, mutations = [], selectionInfo = void 0) {
    const oldDelta = this.delta;
    if (mutations.length === 1 && mutations[0].type === "characterData" && // @ts-expect-error Fix me later
    mutations[0].target.data.match(ASCII) && this.scroll.find(mutations[0].target)) {
      const textBlot = this.scroll.find(mutations[0].target);
      const formats = bubbleFormats(textBlot);
      const index = textBlot.offset(this.scroll);
      const oldValue = mutations[0].oldValue.replace(cursor_default.CONTENTS, "");
      const oldText = new Delta2().insert(oldValue);
      const newText = new Delta2().insert(textBlot.value());
      const relativeSelectionInfo = selectionInfo && {
        oldRange: shiftRange(selectionInfo.oldRange, -index),
        newRange: shiftRange(selectionInfo.newRange, -index)
      };
      const diffDelta = new Delta2().retain(index).concat(oldText.diff(newText, relativeSelectionInfo));
      change = diffDelta.reduce((delta, op) => {
        if (op.insert) {
          return delta.insert(op.insert, formats);
        }
        return delta.push(op);
      }, new Delta2());
      this.delta = oldDelta.compose(change);
    } else {
      this.delta = this.getDelta();
      if (!change || !isEqual_default(oldDelta.compose(change), this.delta)) {
        change = oldDelta.diff(this.delta, selectionInfo);
      }
    }
    return change;
  }
};
function convertListHTML(items, lastIndent, types) {
  if (items.length === 0) {
    const [endTag2] = getListType(types.pop());
    if (lastIndent <= 0) {
      return `</li></${endTag2}>`;
    }
    return `</li></${endTag2}>${convertListHTML([], lastIndent - 1, types)}`;
  }
  const [{ child, offset, length, indent, type }, ...rest] = items;
  const [tag, attribute] = getListType(type);
  if (indent > lastIndent) {
    types.push(type);
    if (indent === lastIndent + 1) {
      return `<${tag}><li${attribute}>${convertHTML(
        child,
        offset,
        length
      )}${convertListHTML(rest, indent, types)}`;
    }
    return `<${tag}><li>${convertListHTML(items, lastIndent + 1, types)}`;
  }
  const previousType = types[types.length - 1];
  if (indent === lastIndent && type === previousType) {
    return `</li><li${attribute}>${convertHTML(
      child,
      offset,
      length
    )}${convertListHTML(rest, indent, types)}`;
  }
  const [endTag] = getListType(types.pop());
  return `</li></${endTag}>${convertListHTML(items, lastIndent - 1, types)}`;
}
__name(convertListHTML, "convertListHTML");
function convertHTML(blot, index, length, isRoot = false) {
  if ("html" in blot && typeof blot.html === "function") {
    return blot.html(index, length);
  }
  if (blot instanceof Text2) {
    return escapeText(blot.value().slice(index, index + length));
  }
  if (blot instanceof ParentBlot) {
    if (blot.statics.blotName === "list-container") {
      const items = [];
      blot.children.forEachAt(index, length, (child, offset, childLength) => {
        const formats = "formats" in child && typeof child.formats === "function" ? child.formats() : {};
        items.push({
          child,
          offset,
          length: childLength,
          indent: formats.indent || 0,
          type: formats.list
        });
      });
      return convertListHTML(items, -1, []);
    }
    const parts = [];
    blot.children.forEachAt(index, length, (child, offset, childLength) => {
      parts.push(convertHTML(child, offset, childLength));
    });
    if (isRoot || blot.statics.blotName === "list") {
      return parts.join("");
    }
    const { outerHTML, innerHTML } = blot.domNode;
    const [start, end] = outerHTML.split(`>${innerHTML}<`);
    if (start === "<table") {
      return `<table style="border: 1px solid #000;">${parts.join("")}<${end}`;
    }
    return `${start}>${parts.join("")}<${end}`;
  }
  return blot.domNode instanceof Element ? blot.domNode.outerHTML : "";
}
__name(convertHTML, "convertHTML");
function combineFormats(formats, combined) {
  return Object.keys(combined).reduce(
    (merged, name) => {
      if (formats[name] == null)
        return merged;
      const combinedValue = combined[name];
      if (combinedValue === formats[name]) {
        merged[name] = combinedValue;
      } else if (Array.isArray(combinedValue)) {
        if (combinedValue.indexOf(formats[name]) < 0) {
          merged[name] = combinedValue.concat([formats[name]]);
        } else {
          merged[name] = combinedValue;
        }
      } else {
        merged[name] = [combinedValue, formats[name]];
      }
      return merged;
    },
    {}
  );
}
__name(combineFormats, "combineFormats");
function getListType(type) {
  const tag = type === "ordered" ? "ol" : "ul";
  switch (type) {
    case "checked":
      return [tag, ' data-list="checked"'];
    case "unchecked":
      return [tag, ' data-list="unchecked"'];
    default:
      return [tag, ""];
  }
}
__name(getListType, "getListType");
function normalizeDelta(delta) {
  return delta.reduce((normalizedDelta, op) => {
    if (typeof op.insert === "string") {
      const text = op.insert.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      return normalizedDelta.insert(text, op.attributes);
    }
    return normalizedDelta.push(op);
  }, new Delta2());
}
__name(normalizeDelta, "normalizeDelta");
function shiftRange({ index, length }, amount) {
  return new Range(index + amount, length);
}
__name(shiftRange, "shiftRange");
function splitOpLines(ops) {
  const split = [];
  ops.forEach((op) => {
    if (typeof op.insert === "string") {
      const lines = op.insert.split("\n");
      lines.forEach((line, index) => {
        if (index)
          split.push({ insert: "\n", attributes: op.attributes });
        if (line)
          split.push({ insert: line, attributes: op.attributes });
      });
    } else {
      split.push(op);
    }
  });
  return split;
}
__name(splitOpLines, "splitOpLines");
var editor_default = Editor;

// src/core/module.ts
var Module = class {
  constructor(quill, options = {}) {
    this.quill = quill;
    this.options = options;
  }
  static {
    __name(this, "Module");
  }
  static {
    this.DEFAULTS = {};
  }
};
var module_default = Module;

// src/blots/embed.ts
import { EmbedBlot as EmbedBlot6 } from "parchment";
var GUARD_TEXT = "\uFEFF";
var Embed = class extends EmbedBlot6 {
  static {
    __name(this, "Embed");
  }
  constructor(scroll, node) {
    super(scroll, node);
    this.contentNode = document.createElement("span");
    this.contentNode.setAttribute("contenteditable", "false");
    Array.from(this.domNode.childNodes).forEach((childNode) => {
      this.contentNode.appendChild(childNode);
    });
    this.leftGuard = document.createTextNode(GUARD_TEXT);
    this.rightGuard = document.createTextNode(GUARD_TEXT);
    this.domNode.appendChild(this.leftGuard);
    this.domNode.appendChild(this.contentNode);
    this.domNode.appendChild(this.rightGuard);
  }
  index(node, offset) {
    if (node === this.leftGuard)
      return 0;
    if (node === this.rightGuard)
      return 1;
    return super.index(node, offset);
  }
  restore(node) {
    let range = null;
    let textNode;
    const text = node.data.split(GUARD_TEXT).join("");
    if (node === this.leftGuard) {
      if (this.prev instanceof Text2) {
        const prevLength = this.prev.length();
        this.prev.insertAt(prevLength, text);
        range = {
          startNode: this.prev.domNode,
          startOffset: prevLength + text.length
        };
      } else {
        textNode = document.createTextNode(text);
        this.parent.insertBefore(this.scroll.create(textNode), this);
        range = {
          startNode: textNode,
          startOffset: text.length
        };
      }
    } else if (node === this.rightGuard) {
      if (this.next instanceof Text2) {
        this.next.insertAt(0, text);
        range = {
          startNode: this.next.domNode,
          startOffset: text.length
        };
      } else {
        textNode = document.createTextNode(text);
        this.parent.insertBefore(this.scroll.create(textNode), this.next);
        range = {
          startNode: textNode,
          startOffset: text.length
        };
      }
    }
    node.data = GUARD_TEXT;
    return range;
  }
  update(mutations, context) {
    mutations.forEach((mutation) => {
      if (mutation.type === "characterData" && (mutation.target === this.leftGuard || mutation.target === this.rightGuard)) {
        const range = this.restore(mutation.target);
        if (range)
          context.range = range;
      }
    });
  }
};
var embed_default = Embed;

// src/core/composition.ts
var Composition = class {
  constructor(scroll, emitter) {
    this.scroll = scroll;
    this.emitter = emitter;
    this.isComposing = false;
    this.setupListeners();
  }
  static {
    __name(this, "Composition");
  }
  setupListeners() {
    this.scroll.domNode.addEventListener("compositionstart", (event) => {
      if (!this.isComposing) {
        this.handleCompositionStart(event);
      }
    });
    this.scroll.domNode.addEventListener("compositionend", (event) => {
      if (this.isComposing) {
        queueMicrotask(() => {
          this.handleCompositionEnd(event);
        });
      }
    });
  }
  handleCompositionStart(event) {
    const blot = event.target instanceof Node ? this.scroll.find(event.target, true) : null;
    if (blot && !(blot instanceof embed_default)) {
      this.emitter.emit(emitter_default.events.COMPOSITION_BEFORE_START, event);
      this.scroll.batchStart();
      this.emitter.emit(emitter_default.events.COMPOSITION_START, event);
      this.isComposing = true;
    }
  }
  handleCompositionEnd(event) {
    this.emitter.emit(emitter_default.events.COMPOSITION_BEFORE_END, event);
    this.scroll.batchEnd();
    this.emitter.emit(emitter_default.events.COMPOSITION_END, event);
    this.isComposing = false;
  }
};
var composition_default = Composition;

// src/core/theme.ts
var Theme = class _Theme {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.modules = {};
  }
  static {
    __name(this, "Theme");
  }
  static {
    this.DEFAULTS = {
      modules: {}
    };
  }
  static {
    this.themes = {
      default: _Theme
    };
  }
  init() {
    Object.keys(this.options.modules).forEach((name) => {
      if (this.modules[name] == null) {
        this.addModule(name);
      }
    });
  }
  addModule(name) {
    const ModuleClass = this.quill.constructor.import(`modules/${name}`);
    this.modules[name] = new ModuleClass(
      this.quill,
      this.options.modules[name] || {}
    );
    return this.modules[name];
  }
};
var theme_default = Theme;

// src/core/utils/scrollRectIntoView.ts
var getParentElement = /* @__PURE__ */ __name((element) => element.parentElement || element.getRootNode().host || null, "getParentElement");
var getElementRect = /* @__PURE__ */ __name((element) => {
  const rect = element.getBoundingClientRect();
  const scaleX = "offsetWidth" in element && Math.abs(rect.width) / element.offsetWidth || 1;
  const scaleY = "offsetHeight" in element && Math.abs(rect.height) / element.offsetHeight || 1;
  return {
    top: rect.top,
    right: rect.left + element.clientWidth * scaleX,
    bottom: rect.top + element.clientHeight * scaleY,
    left: rect.left
  };
}, "getElementRect");
var paddingValueToInt = /* @__PURE__ */ __name((value) => {
  const number = parseInt(value, 10);
  return Number.isNaN(number) ? 0 : number;
}, "paddingValueToInt");
var getScrollDistance = /* @__PURE__ */ __name((targetStart, targetEnd, scrollStart, scrollEnd, scrollPaddingStart, scrollPaddingEnd) => {
  if (targetStart < scrollStart && targetEnd > scrollEnd) {
    return 0;
  }
  if (targetStart < scrollStart) {
    return -(scrollStart - targetStart + scrollPaddingStart);
  }
  if (targetEnd > scrollEnd) {
    return targetEnd - targetStart > scrollEnd - scrollStart ? targetStart + scrollPaddingStart - scrollStart : targetEnd - scrollEnd + scrollPaddingEnd;
  }
  return 0;
}, "getScrollDistance");
var scrollRectIntoView = /* @__PURE__ */ __name((root2, targetRect) => {
  const document2 = root2.ownerDocument;
  let rect = targetRect;
  let current = root2;
  while (current) {
    const isDocumentBody = current === document2.body;
    const bounding = isDocumentBody ? {
      top: 0,
      right: window.visualViewport?.width ?? document2.documentElement.clientWidth,
      bottom: window.visualViewport?.height ?? document2.documentElement.clientHeight,
      left: 0
    } : getElementRect(current);
    const style = getComputedStyle(current);
    const scrollDistanceX = getScrollDistance(
      rect.left,
      rect.right,
      bounding.left,
      bounding.right,
      paddingValueToInt(style.scrollPaddingLeft),
      paddingValueToInt(style.scrollPaddingRight)
    );
    const scrollDistanceY = getScrollDistance(
      rect.top,
      rect.bottom,
      bounding.top,
      bounding.bottom,
      paddingValueToInt(style.scrollPaddingTop),
      paddingValueToInt(style.scrollPaddingBottom)
    );
    if (scrollDistanceX || scrollDistanceY) {
      if (isDocumentBody) {
        document2.defaultView?.scrollBy(scrollDistanceX, scrollDistanceY);
      } else {
        const { scrollLeft, scrollTop } = current;
        if (scrollDistanceY) {
          current.scrollTop += scrollDistanceY;
        }
        if (scrollDistanceX) {
          current.scrollLeft += scrollDistanceX;
        }
        const scrolledLeft = current.scrollLeft - scrollLeft;
        const scrolledTop = current.scrollTop - scrollTop;
        rect = {
          left: rect.left - scrolledLeft,
          top: rect.top - scrolledTop,
          right: rect.right - scrolledLeft,
          bottom: rect.bottom - scrolledTop
        };
      }
    }
    current = isDocumentBody || style.position === "fixed" ? null : getParentElement(current);
  }
}, "scrollRectIntoView");
var scrollRectIntoView_default = scrollRectIntoView;

// src/core/utils/createRegistryWithFormats.ts
import { Registry } from "parchment";
var MAX_REGISTER_ITERATIONS = 100;
var CORE_FORMATS = ["block", "break", "cursor", "inline", "scroll", "text"];
var createRegistryWithFormats = /* @__PURE__ */ __name((formats, sourceRegistry, debug8) => {
  const registry = new Registry();
  CORE_FORMATS.forEach((name) => {
    const coreBlot = sourceRegistry.query(name);
    if (coreBlot)
      registry.register(coreBlot);
  });
  formats.forEach((name) => {
    let format = sourceRegistry.query(name);
    if (!format) {
      debug8.error(
        `Cannot register "${name}" specified in "formats" config. Are you sure it was registered?`
      );
    }
    let iterations = 0;
    while (format) {
      registry.register(format);
      format = "blotName" in format ? format.requiredContainer ?? null : null;
      iterations += 1;
      if (iterations > MAX_REGISTER_ITERATIONS) {
        debug8.error(
          `Cycle detected in registering blot requiredContainer: "${name}"`
        );
        break;
      }
    }
  });
  return registry;
}, "createRegistryWithFormats");
var createRegistryWithFormats_default = createRegistryWithFormats;

// src/core/quill.ts
var debug4 = logger_default("quill");
var globalRegistry = new Parchment.Registry();
Parchment.ParentBlot.uiClass = "ql-ui";
var Quill = class _Quill {
  static {
    __name(this, "Quill");
  }
  static {
    this.DEFAULTS = {
      bounds: null,
      modules: {
        clipboard: true,
        keyboard: true,
        history: true,
        uploader: true
      },
      placeholder: "",
      readOnly: false,
      registry: globalRegistry,
      theme: "default"
    };
  }
  static {
    this.events = emitter_default.events;
  }
  static {
    this.sources = emitter_default.sources;
  }
  static {
    this.version = typeof QUILL_VERSION === "undefined" ? "dev" : QUILL_VERSION;
  }
  static {
    this.imports = {
      delta: Delta3,
      parchment: Parchment,
      "core/module": module_default,
      "core/theme": theme_default
    };
  }
  static debug(limit) {
    if (limit === true) {
      limit = "log";
    }
    logger_default.level(limit);
  }
  static find(node, bubble = false) {
    return instances_default.get(node) || globalRegistry.find(node, bubble);
  }
  static import(name) {
    if (this.imports[name] == null) {
      debug4.error(`Cannot import ${name}. Are you sure it was registered?`);
    }
    return this.imports[name];
  }
  static register(path, target, overwrite = false) {
    if (typeof path !== "string") {
      const name = "attrName" in path ? path.attrName : path.blotName;
      if (typeof name === "string") {
        this.register(`formats/${name}`, path, target);
      } else {
        Object.keys(path).forEach((key) => {
          this.register(key, path[key], target);
        });
      }
    } else {
      if (this.imports[path] != null && !overwrite) {
        debug4.warn(`Overwriting ${path} with`, target);
      }
      this.imports[path] = target;
      if ((path.startsWith("blots/") || path.startsWith("formats/")) && target && typeof target !== "boolean" && // @ts-expect-error
      target.blotName !== "abstract") {
        globalRegistry.register(target);
      }
      if (typeof target.register === "function") {
        target.register(globalRegistry);
      }
    }
  }
  constructor(container, options = {}) {
    this.options = expandConfig(container, options);
    this.container = this.options.container;
    if (this.container == null) {
      debug4.error("Invalid Quill container", container);
      return;
    }
    if (this.options.debug) {
      _Quill.debug(this.options.debug);
    }
    const html = this.container.innerHTML.trim();
    this.container.classList.add("ql-container");
    this.container.innerHTML = "";
    instances_default.set(this.container, this);
    this.root = this.addContainer("ql-editor");
    this.root.classList.add("ql-blank");
    this.emitter = new emitter_default();
    const scrollBlotName = Parchment.ScrollBlot.blotName;
    const ScrollBlot3 = this.options.registry.query(scrollBlotName);
    if (!ScrollBlot3 || !("blotName" in ScrollBlot3)) {
      throw new Error(
        `Cannot initialize Quill without "${scrollBlotName}" blot`
      );
    }
    this.scroll = new ScrollBlot3(this.options.registry, this.root, {
      emitter: this.emitter
    });
    this.editor = new editor_default(this.scroll);
    this.selection = new selection_default(this.scroll, this.emitter);
    this.composition = new composition_default(this.scroll, this.emitter);
    this.theme = new this.options.theme(this, this.options);
    this.keyboard = this.theme.addModule("keyboard");
    this.clipboard = this.theme.addModule("clipboard");
    this.history = this.theme.addModule("history");
    this.uploader = this.theme.addModule("uploader");
    this.theme.addModule("input");
    this.theme.addModule("uiNode");
    this.theme.init();
    this.emitter.on(emitter_default.events.EDITOR_CHANGE, (type) => {
      if (type === emitter_default.events.TEXT_CHANGE) {
        this.root.classList.toggle("ql-blank", this.editor.isBlank());
      }
    });
    this.emitter.on(emitter_default.events.SCROLL_UPDATE, (source, mutations) => {
      const oldRange = this.selection.lastRange;
      const [newRange] = this.selection.getRange();
      const selectionInfo = oldRange && newRange ? { oldRange, newRange } : void 0;
      modify.call(
        this,
        () => this.editor.update(null, mutations, selectionInfo),
        source
      );
    });
    this.emitter.on(emitter_default.events.SCROLL_EMBED_UPDATE, (blot, delta) => {
      const oldRange = this.selection.lastRange;
      const [newRange] = this.selection.getRange();
      const selectionInfo = oldRange && newRange ? { oldRange, newRange } : void 0;
      modify.call(
        this,
        () => {
          const change = new Delta3().retain(blot.offset(this)).retain({ [blot.statics.blotName]: delta });
          return this.editor.update(change, [], selectionInfo);
        },
        _Quill.sources.USER
      );
    });
    if (html) {
      const contents = this.clipboard.convert({
        html: `${html}<p><br></p>`,
        text: "\n"
      });
      this.setContents(contents);
    }
    this.history.clear();
    if (this.options.placeholder) {
      this.root.setAttribute("data-placeholder", this.options.placeholder);
    }
    if (this.options.readOnly) {
      this.disable();
    }
    this.allowReadOnlyEdits = false;
  }
  addContainer(container, refNode = null) {
    if (typeof container === "string") {
      const className = container;
      container = document.createElement("div");
      container.classList.add(className);
    }
    this.container.insertBefore(container, refNode);
    return container;
  }
  blur() {
    this.selection.setRange(null);
  }
  deleteText(index, length, source) {
    [index, length, , source] = overload(index, length, source);
    return modify.call(
      this,
      () => {
        return this.editor.deleteText(index, length);
      },
      source,
      index,
      -1 * length
    );
  }
  disable() {
    this.enable(false);
  }
  editReadOnly(modifier) {
    this.allowReadOnlyEdits = true;
    const value = modifier();
    this.allowReadOnlyEdits = false;
    return value;
  }
  enable(enabled = true) {
    this.scroll.enable(enabled);
    this.container.classList.toggle("ql-disabled", !enabled);
  }
  focus(options = {}) {
    this.selection.focus();
    if (!options.preventScroll) {
      this.scrollSelectionIntoView();
    }
  }
  format(name, value, source = emitter_default.sources.API) {
    return modify.call(
      this,
      () => {
        const range = this.getSelection(true);
        let change = new Delta3();
        if (range == null)
          return change;
        if (this.scroll.query(name, Parchment.Scope.BLOCK)) {
          change = this.editor.formatLine(range.index, range.length, {
            [name]: value
          });
        } else if (range.length === 0) {
          this.selection.format(name, value);
          return change;
        } else {
          change = this.editor.formatText(range.index, range.length, {
            [name]: value
          });
        }
        this.setSelection(range, emitter_default.sources.SILENT);
        return change;
      },
      source
    );
  }
  formatLine(index, length, name, value, source) {
    let formats;
    [index, length, formats, source] = overload(
      index,
      length,
      // @ts-expect-error
      name,
      value,
      source
    );
    return modify.call(
      this,
      () => {
        return this.editor.formatLine(index, length, formats);
      },
      source,
      index,
      0
    );
  }
  formatText(index, length, name, value, source) {
    let formats;
    [index, length, formats, source] = overload(
      // @ts-expect-error
      index,
      length,
      name,
      value,
      source
    );
    return modify.call(
      this,
      () => {
        return this.editor.formatText(index, length, formats);
      },
      source,
      index,
      0
    );
  }
  getBounds(index, length = 0) {
    let bounds = null;
    if (typeof index === "number") {
      bounds = this.selection.getBounds(index, length);
    } else {
      bounds = this.selection.getBounds(index.index, index.length);
    }
    if (!bounds)
      return null;
    const containerBounds = this.container.getBoundingClientRect();
    return {
      bottom: bounds.bottom - containerBounds.top,
      height: bounds.height,
      left: bounds.left - containerBounds.left,
      right: bounds.right - containerBounds.left,
      top: bounds.top - containerBounds.top,
      width: bounds.width
    };
  }
  getContents(index = 0, length = this.getLength() - index) {
    [index, length] = overload(index, length);
    return this.editor.getContents(index, length);
  }
  getFormat(index = this.getSelection(true), length = 0) {
    if (typeof index === "number") {
      return this.editor.getFormat(index, length);
    }
    return this.editor.getFormat(index.index, index.length);
  }
  getIndex(blot) {
    return blot.offset(this.scroll);
  }
  getLength() {
    return this.scroll.length();
  }
  getLeaf(index) {
    return this.scroll.leaf(index);
  }
  getLine(index) {
    return this.scroll.line(index);
  }
  getLines(index = 0, length = Number.MAX_VALUE) {
    if (typeof index !== "number") {
      return this.scroll.lines(index.index, index.length);
    }
    return this.scroll.lines(index, length);
  }
  getModule(name) {
    return this.theme.modules[name];
  }
  getSelection(focus = false) {
    if (focus)
      this.focus();
    this.update();
    return this.selection.getRange()[0];
  }
  getSemanticHTML(index = 0, length) {
    if (typeof index === "number") {
      length = length ?? this.getLength() - index;
    }
    [index, length] = overload(index, length);
    return this.editor.getHTML(index, length);
  }
  getText(index = 0, length) {
    if (typeof index === "number") {
      length = length ?? this.getLength() - index;
    }
    [index, length] = overload(index, length);
    return this.editor.getText(index, length);
  }
  hasFocus() {
    return this.selection.hasFocus();
  }
  insertEmbed(index, embed, value, source = _Quill.sources.API) {
    return modify.call(
      this,
      () => {
        return this.editor.insertEmbed(index, embed, value);
      },
      source,
      index
    );
  }
  insertText(index, text, name, value, source) {
    let formats;
    [index, , formats, source] = overload(index, 0, name, value, source);
    return modify.call(
      this,
      () => {
        return this.editor.insertText(index, text, formats);
      },
      source,
      index,
      text.length
    );
  }
  isEnabled() {
    return this.scroll.isEnabled();
  }
  off(...args) {
    return this.emitter.off(...args);
  }
  on(...args) {
    return this.emitter.on(...args);
  }
  once(...args) {
    return this.emitter.once(...args);
  }
  removeFormat(index, length, source) {
    [index, length, , source] = overload(index, length, source);
    return modify.call(
      this,
      () => {
        return this.editor.removeFormat(index, length);
      },
      source,
      index
    );
  }
  scrollRectIntoView(rect) {
    scrollRectIntoView_default(this.root, rect);
  }
  /**
   * @deprecated Use Quill#scrollSelectionIntoView() instead.
   */
  scrollIntoView() {
    console.warn(
      "Quill#scrollIntoView() has been deprecated and will be removed in the near future. Please use Quill#scrollSelectionIntoView() instead."
    );
    this.scrollSelectionIntoView();
  }
  /**
   * Scroll the current selection into the visible area.
   * If the selection is already visible, no scrolling will occur.
   */
  scrollSelectionIntoView() {
    const range = this.selection.lastRange;
    const bounds = range && this.selection.getBounds(range.index, range.length);
    if (bounds) {
      this.scrollRectIntoView(bounds);
    }
  }
  setContents(delta, source = emitter_default.sources.API) {
    return modify.call(
      this,
      () => {
        delta = new Delta3(delta);
        const length = this.getLength();
        const delete1 = this.editor.deleteText(0, length);
        const applied = this.editor.insertContents(0, delta);
        const delete2 = this.editor.deleteText(this.getLength() - 1, 1);
        return delete1.compose(applied).compose(delete2);
      },
      source
    );
  }
  setSelection(index, length, source) {
    if (index == null) {
      this.selection.setRange(null, length || _Quill.sources.API);
    } else {
      [index, length, , source] = overload(index, length, source);
      this.selection.setRange(new Range(Math.max(0, index), length), source);
      if (source !== emitter_default.sources.SILENT) {
        this.scrollSelectionIntoView();
      }
    }
  }
  setText(text, source = emitter_default.sources.API) {
    const delta = new Delta3().insert(text);
    return this.setContents(delta, source);
  }
  update(source = emitter_default.sources.USER) {
    const change = this.scroll.update(source);
    this.selection.update(source);
    return change;
  }
  updateContents(delta, source = emitter_default.sources.API) {
    return modify.call(
      this,
      () => {
        delta = new Delta3(delta);
        return this.editor.applyDelta(delta);
      },
      source,
      true
    );
  }
};
function resolveSelector(selector) {
  return typeof selector === "string" ? document.querySelector(selector) : selector;
}
__name(resolveSelector, "resolveSelector");
function expandModuleConfig(config4) {
  return Object.entries(config4 ?? {}).reduce(
    (expanded, [key, value]) => ({
      ...expanded,
      [key]: value === true ? {} : value
    }),
    {}
  );
}
__name(expandModuleConfig, "expandModuleConfig");
function omitUndefinedValuesFromOptions(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter((entry) => entry[1] !== void 0)
  );
}
__name(omitUndefinedValuesFromOptions, "omitUndefinedValuesFromOptions");
function expandConfig(containerOrSelector, options) {
  const container = resolveSelector(containerOrSelector);
  if (!container) {
    throw new Error("Invalid Quill container");
  }
  const shouldUseDefaultTheme = !options.theme || options.theme === Quill.DEFAULTS.theme;
  const theme = shouldUseDefaultTheme ? theme_default : Quill.import(`themes/${options.theme}`);
  if (!theme) {
    throw new Error(`Invalid theme ${options.theme}. Did you register it?`);
  }
  const { modules: quillModuleDefaults, ...quillDefaults } = Quill.DEFAULTS;
  const { modules: themeModuleDefaults, ...themeDefaults } = theme.DEFAULTS;
  let userModuleOptions = expandModuleConfig(options.modules);
  if (userModuleOptions != null && userModuleOptions.toolbar && userModuleOptions.toolbar.constructor !== Object) {
    userModuleOptions = {
      ...userModuleOptions,
      toolbar: { container: userModuleOptions.toolbar }
    };
  }
  const modules = merge_default(
    {},
    expandModuleConfig(quillModuleDefaults),
    expandModuleConfig(themeModuleDefaults),
    userModuleOptions
  );
  const config4 = {
    ...quillDefaults,
    ...omitUndefinedValuesFromOptions(themeDefaults),
    ...omitUndefinedValuesFromOptions(options)
  };
  let registry = options.registry;
  if (registry) {
    if (options.formats) {
      debug4.warn('Ignoring "formats" option because "registry" is specified');
    }
  } else {
    registry = options.formats ? createRegistryWithFormats_default(options.formats, config4.registry, debug4) : config4.registry;
  }
  return {
    ...config4,
    registry,
    container,
    theme,
    modules: Object.entries(modules).reduce(
      (modulesWithDefaults, [name, value]) => {
        if (!value)
          return modulesWithDefaults;
        const moduleClass = Quill.import(`modules/${name}`);
        if (moduleClass == null) {
          debug4.error(
            `Cannot load ${name} module. Are you sure you registered it?`
          );
          return modulesWithDefaults;
        }
        return {
          ...modulesWithDefaults,
          // @ts-expect-error
          [name]: merge_default({}, moduleClass.DEFAULTS || {}, value)
        };
      },
      {}
    ),
    bounds: resolveSelector(config4.bounds)
  };
}
__name(expandConfig, "expandConfig");
function modify(modifier, source, index, shift) {
  if (!this.isEnabled() && source === emitter_default.sources.USER && !this.allowReadOnlyEdits) {
    return new Delta3();
  }
  let range = index == null ? null : this.getSelection();
  const oldDelta = this.editor.delta;
  const change = modifier();
  if (range != null) {
    if (index === true) {
      index = range.index;
    }
    if (shift == null) {
      range = shiftRange2(range, change, source);
    } else if (shift !== 0) {
      range = shiftRange2(range, index, shift, source);
    }
    this.setSelection(range, emitter_default.sources.SILENT);
  }
  if (change.length() > 0) {
    const args = [emitter_default.events.TEXT_CHANGE, change, oldDelta, source];
    this.emitter.emit(emitter_default.events.EDITOR_CHANGE, ...args);
    if (source !== emitter_default.sources.SILENT) {
      this.emitter.emit(...args);
    }
  }
  return change;
}
__name(modify, "modify");
function overload(index, length, name, value, source) {
  let formats = {};
  if (typeof index.index === "number" && typeof index.length === "number") {
    if (typeof length !== "number") {
      source = value;
      value = name;
      name = length;
      length = index.length;
      index = index.index;
    } else {
      length = index.length;
      index = index.index;
    }
  } else if (typeof length !== "number") {
    source = value;
    value = name;
    name = length;
    length = 0;
  }
  if (typeof name === "object") {
    formats = name;
    source = value;
  } else if (typeof name === "string") {
    if (value != null) {
      formats[name] = value;
    } else {
      source = name;
    }
  }
  source = source || emitter_default.sources.API;
  return [index, length, formats, source];
}
__name(overload, "overload");
function shiftRange2(range, index, lengthOrSource, source) {
  const length = typeof lengthOrSource === "number" ? lengthOrSource : 0;
  if (range == null)
    return null;
  let start;
  let end;
  if (index && typeof index.transformPosition === "function") {
    [start, end] = [range.index, range.index + range.length].map(
      (pos) => (
        // @ts-expect-error -- TODO: add a better type guard around `index`
        index.transformPosition(pos, source !== emitter_default.sources.USER)
      )
    );
  } else {
    [start, end] = [range.index, range.index + range.length].map((pos) => {
      if (pos < index || pos === index && source === emitter_default.sources.USER)
        return pos;
      if (length >= 0) {
        return pos + length;
      }
      return Math.max(index, pos + length);
    });
  }
  return new Range(start, end - start);
}
__name(shiftRange2, "shiftRange");

// src/blots/container.ts
import { ContainerBlot } from "parchment";
var Container = class extends ContainerBlot {
  static {
    __name(this, "Container");
  }
};
var container_default = Container;

// src/blots/scroll.ts
import { ContainerBlot as ContainerBlot2, LeafBlot as LeafBlot4, Scope as Scope7, ScrollBlot as ScrollBlot2 } from "parchment";
import Delta4, { AttributeMap as AttributeMap2, Op as Op2 } from "quill-delta";
function isLine(blot) {
  return blot instanceof Block || blot instanceof BlockEmbed;
}
__name(isLine, "isLine");
function isUpdatable(blot) {
  return typeof blot.updateContent === "function";
}
__name(isUpdatable, "isUpdatable");
var Scroll = class extends ScrollBlot2 {
  static {
    __name(this, "Scroll");
  }
  static {
    this.blotName = "scroll";
  }
  static {
    this.className = "ql-editor";
  }
  static {
    this.tagName = "DIV";
  }
  static {
    this.defaultChild = Block;
  }
  static {
    this.allowedChildren = [Block, BlockEmbed, container_default];
  }
  constructor(registry, domNode, { emitter }) {
    super(registry, domNode);
    this.emitter = emitter;
    this.batch = false;
    this.optimize();
    this.enable();
    this.domNode.addEventListener("dragstart", (e) => this.handleDragStart(e));
  }
  batchStart() {
    if (!Array.isArray(this.batch)) {
      this.batch = [];
    }
  }
  batchEnd() {
    if (!this.batch)
      return;
    const mutations = this.batch;
    this.batch = false;
    this.update(mutations);
  }
  emitMount(blot) {
    this.emitter.emit(emitter_default.events.SCROLL_BLOT_MOUNT, blot);
  }
  emitUnmount(blot) {
    this.emitter.emit(emitter_default.events.SCROLL_BLOT_UNMOUNT, blot);
  }
  emitEmbedUpdate(blot, change) {
    this.emitter.emit(emitter_default.events.SCROLL_EMBED_UPDATE, blot, change);
  }
  deleteAt(index, length) {
    const [first, offset] = this.line(index);
    const [last] = this.line(index + length);
    super.deleteAt(index, length);
    if (last != null && first !== last && offset > 0) {
      if (first instanceof BlockEmbed || last instanceof BlockEmbed) {
        this.optimize();
        return;
      }
      const ref = last.children.head instanceof break_default ? null : last.children.head;
      first.moveChildren(last, ref);
      first.remove();
    }
    this.optimize();
  }
  enable(enabled = true) {
    this.domNode.setAttribute("contenteditable", enabled ? "true" : "false");
  }
  formatAt(index, length, format, value) {
    super.formatAt(index, length, format, value);
    this.optimize();
  }
  insertAt(index, value, def) {
    if (index >= this.length()) {
      if (def == null || this.scroll.query(value, Scope7.BLOCK) == null) {
        const blot = this.scroll.create(this.statics.defaultChild.blotName);
        this.appendChild(blot);
        if (def == null && value.endsWith("\n")) {
          blot.insertAt(0, value.slice(0, -1), def);
        } else {
          blot.insertAt(0, value, def);
        }
      } else {
        const embed = this.scroll.create(value, def);
        this.appendChild(embed);
      }
    } else {
      super.insertAt(index, value, def);
    }
    this.optimize();
  }
  insertBefore(blot, ref) {
    if (blot.statics.scope === Scope7.INLINE_BLOT) {
      const wrapper = this.scroll.create(
        this.statics.defaultChild.blotName
      );
      wrapper.appendChild(blot);
      super.insertBefore(wrapper, ref);
    } else {
      super.insertBefore(blot, ref);
    }
  }
  insertContents(index, delta) {
    const renderBlocks = this.deltaToRenderBlocks(
      delta.concat(new Delta4().insert("\n"))
    );
    const last = renderBlocks.pop();
    if (last == null)
      return;
    this.batchStart();
    const first = renderBlocks.shift();
    if (first) {
      const shouldInsertNewlineChar = first.type === "block" && (first.delta.length() === 0 || !this.descendant(BlockEmbed, index)[0] && index < this.length());
      const delta2 = first.type === "block" ? first.delta : new Delta4().insert({ [first.key]: first.value });
      insertInlineContents(this, index, delta2);
      const newlineCharLength = first.type === "block" ? 1 : 0;
      const lineEndIndex = index + delta2.length() + newlineCharLength;
      if (shouldInsertNewlineChar) {
        this.insertAt(lineEndIndex - 1, "\n");
      }
      const formats = bubbleFormats(this.line(index)[0]);
      const attributes = AttributeMap2.diff(formats, first.attributes) || {};
      Object.keys(attributes).forEach((name) => {
        this.formatAt(lineEndIndex - 1, 1, name, attributes[name]);
      });
      index = lineEndIndex;
    }
    let [refBlot, refBlotOffset] = this.children.find(index);
    if (renderBlocks.length) {
      if (refBlot) {
        refBlot = refBlot.split(refBlotOffset);
        refBlotOffset = 0;
      }
      renderBlocks.forEach((renderBlock) => {
        if (renderBlock.type === "block") {
          const block = this.createBlock(
            renderBlock.attributes,
            refBlot || void 0
          );
          insertInlineContents(block, 0, renderBlock.delta);
        } else {
          const blockEmbed = this.create(
            renderBlock.key,
            renderBlock.value
          );
          this.insertBefore(blockEmbed, refBlot || void 0);
          Object.keys(renderBlock.attributes).forEach((name) => {
            blockEmbed.format(name, renderBlock.attributes[name]);
          });
        }
      });
    }
    if (last.type === "block" && last.delta.length()) {
      const offset = refBlot ? refBlot.offset(refBlot.scroll) + refBlotOffset : this.length();
      insertInlineContents(this, offset, last.delta);
    }
    this.batchEnd();
    this.optimize();
  }
  isEnabled() {
    return this.domNode.getAttribute("contenteditable") === "true";
  }
  leaf(index) {
    const last = this.path(index).pop();
    if (!last) {
      return [null, -1];
    }
    const [blot, offset] = last;
    return blot instanceof LeafBlot4 ? [blot, offset] : [null, -1];
  }
  line(index) {
    if (index === this.length()) {
      return this.line(index - 1);
    }
    return this.descendant(isLine, index);
  }
  lines(index = 0, length = Number.MAX_VALUE) {
    const getLines = /* @__PURE__ */ __name((blot, blotIndex, blotLength) => {
      let lines = [];
      let lengthLeft = blotLength;
      blot.children.forEachAt(
        blotIndex,
        blotLength,
        (child, childIndex, childLength) => {
          if (isLine(child)) {
            lines.push(child);
          } else if (child instanceof ContainerBlot2) {
            lines = lines.concat(getLines(child, childIndex, lengthLeft));
          }
          lengthLeft -= childLength;
        }
      );
      return lines;
    }, "getLines");
    return getLines(this, index, length);
  }
  optimize(mutations = [], context = {}) {
    if (this.batch)
      return;
    super.optimize(mutations, context);
    if (mutations.length > 0) {
      this.emitter.emit(emitter_default.events.SCROLL_OPTIMIZE, mutations, context);
    }
  }
  path(index) {
    return super.path(index).slice(1);
  }
  remove() {
  }
  update(mutations) {
    if (this.batch) {
      if (Array.isArray(mutations)) {
        this.batch = this.batch.concat(mutations);
      }
      return;
    }
    let source = emitter_default.sources.USER;
    if (typeof mutations === "string") {
      source = mutations;
    }
    if (!Array.isArray(mutations)) {
      mutations = this.observer.takeRecords();
    }
    mutations = mutations.filter(({ target }) => {
      const blot = this.find(target, true);
      return blot && !isUpdatable(blot);
    });
    if (mutations.length > 0) {
      this.emitter.emit(emitter_default.events.SCROLL_BEFORE_UPDATE, source, mutations);
    }
    super.update(mutations.concat([]));
    if (mutations.length > 0) {
      this.emitter.emit(emitter_default.events.SCROLL_UPDATE, source, mutations);
    }
  }
  updateEmbedAt(index, key, change) {
    const [blot] = this.descendant((b) => b instanceof BlockEmbed, index);
    if (blot && blot.statics.blotName === key && isUpdatable(blot)) {
      blot.updateContent(change);
    }
  }
  handleDragStart(event) {
    event.preventDefault();
  }
  deltaToRenderBlocks(delta) {
    const renderBlocks = [];
    let currentBlockDelta = new Delta4();
    delta.forEach((op) => {
      const insert = op?.insert;
      if (!insert)
        return;
      if (typeof insert === "string") {
        const splitted = insert.split("\n");
        splitted.slice(0, -1).forEach((text) => {
          currentBlockDelta.insert(text, op.attributes);
          renderBlocks.push({
            type: "block",
            delta: currentBlockDelta,
            attributes: op.attributes ?? {}
          });
          currentBlockDelta = new Delta4();
        });
        const last = splitted[splitted.length - 1];
        if (last) {
          currentBlockDelta.insert(last, op.attributes);
        }
      } else {
        const key = Object.keys(insert)[0];
        if (!key)
          return;
        if (this.query(key, Scope7.INLINE)) {
          currentBlockDelta.push(op);
        } else {
          if (currentBlockDelta.length()) {
            renderBlocks.push({
              type: "block",
              delta: currentBlockDelta,
              attributes: {}
            });
          }
          currentBlockDelta = new Delta4();
          renderBlocks.push({
            type: "blockEmbed",
            key,
            value: insert[key],
            attributes: op.attributes ?? {}
          });
        }
      }
    });
    if (currentBlockDelta.length()) {
      renderBlocks.push({
        type: "block",
        delta: currentBlockDelta,
        attributes: {}
      });
    }
    return renderBlocks;
  }
  createBlock(attributes, refBlot) {
    let blotName;
    const formats = {};
    Object.entries(attributes).forEach(([key, value]) => {
      const isBlockBlot = this.query(key, Scope7.BLOCK & Scope7.BLOT) != null;
      if (isBlockBlot) {
        blotName = key;
      } else {
        formats[key] = value;
      }
    });
    const block = this.create(
      blotName || this.statics.defaultChild.blotName,
      blotName ? attributes[blotName] : void 0
    );
    this.insertBefore(block, refBlot || void 0);
    const length = block.length();
    Object.entries(formats).forEach(([key, value]) => {
      block.formatAt(0, length, key, value);
    });
    return block;
  }
};
function insertInlineContents(parent, index, inlineContents) {
  inlineContents.reduce((index2, op) => {
    const length = Op2.length(op);
    let attributes = op.attributes || {};
    if (op.insert != null) {
      if (typeof op.insert === "string") {
        const text = op.insert;
        parent.insertAt(index2, text);
        const [leaf] = parent.descendant(LeafBlot4, index2);
        const formats = bubbleFormats(leaf);
        attributes = AttributeMap2.diff(formats, attributes) || {};
      } else if (typeof op.insert === "object") {
        const key = Object.keys(op.insert)[0];
        if (key == null)
          return index2;
        parent.insertAt(index2, key, op.insert[key]);
        const isInlineEmbed = parent.scroll.query(key, Scope7.INLINE) != null;
        if (isInlineEmbed) {
          const [leaf] = parent.descendant(LeafBlot4, index2);
          const formats = bubbleFormats(leaf);
          attributes = AttributeMap2.diff(formats, attributes) || {};
        }
      }
    }
    Object.keys(attributes).forEach((key) => {
      parent.formatAt(index2, length, key, attributes[key]);
    });
    return index2 + length;
  }, index);
}
__name(insertInlineContents, "insertInlineContents");
var scroll_default = Scroll;

// src/modules/clipboard.ts
import {
  Attributor as Attributor3,
  BlockBlot as BlockBlot2,
  ClassAttributor as ClassAttributor7,
  EmbedBlot as EmbedBlot8,
  Scope as Scope15,
  StyleAttributor as StyleAttributor6
} from "parchment";
import Delta6 from "quill-delta";

// src/formats/align.ts
import { Attributor, ClassAttributor, Scope as Scope8, StyleAttributor } from "parchment";
var config = {
  scope: Scope8.BLOCK,
  whitelist: ["right", "center", "justify"]
};
var AlignAttribute = new Attributor("align", "align", config);
var AlignClass = new ClassAttributor("align", "ql-align", config);
var AlignStyle = new StyleAttributor("align", "text-align", config);

// src/formats/background.ts
import { ClassAttributor as ClassAttributor3, Scope as Scope10 } from "parchment";

// src/formats/color.ts
import { ClassAttributor as ClassAttributor2, Scope as Scope9, StyleAttributor as StyleAttributor2 } from "parchment";
var ColorAttributor = class extends StyleAttributor2 {
  static {
    __name(this, "ColorAttributor");
  }
  value(domNode) {
    let value = super.value(domNode);
    if (!value.startsWith("rgb("))
      return value;
    value = value.replace(/^[^\d]+/, "").replace(/[^\d]+$/, "");
    const hex = value.split(",").map((component) => `00${parseInt(component, 10).toString(16)}`.slice(-2)).join("");
    return `#${hex}`;
  }
};
var ColorClass = new ClassAttributor2("color", "ql-color", {
  scope: Scope9.INLINE
});
var ColorStyle = new ColorAttributor("color", "color", {
  scope: Scope9.INLINE
});

// src/formats/background.ts
var BackgroundClass = new ClassAttributor3("background", "ql-bg", {
  scope: Scope10.INLINE
});
var BackgroundStyle = new ColorAttributor("background", "background-color", {
  scope: Scope10.INLINE
});

// src/formats/code.ts
var CodeBlockContainer = class extends container_default {
  static {
    __name(this, "CodeBlockContainer");
  }
  static create(value) {
    const domNode = super.create(value);
    domNode.setAttribute("spellcheck", "false");
    return domNode;
  }
  code(index, length) {
    return this.children.map((child) => child.length() <= 1 ? "" : child.domNode.innerText).join("\n").slice(index, index + length);
  }
  html(index, length) {
    return `<pre>
${escapeText(this.code(index, length))}
</pre>`;
  }
};
var CodeBlock = class extends Block {
  static {
    __name(this, "CodeBlock");
  }
  static {
    this.TAB = "  ";
  }
  static register() {
    Quill.register(CodeBlockContainer);
  }
};
var Code = class extends inline_default {
  static {
    __name(this, "Code");
  }
};
Code.blotName = "code";
Code.tagName = "CODE";
CodeBlock.blotName = "code-block";
CodeBlock.className = "ql-code-block";
CodeBlock.tagName = "DIV";
CodeBlockContainer.blotName = "code-block-container";
CodeBlockContainer.className = "ql-code-block-container";
CodeBlockContainer.tagName = "DIV";
CodeBlockContainer.allowedChildren = [CodeBlock];
CodeBlock.allowedChildren = [Text2, break_default, cursor_default];
CodeBlock.requiredContainer = CodeBlockContainer;

// src/formats/direction.ts
import { Attributor as Attributor2, ClassAttributor as ClassAttributor4, Scope as Scope11, StyleAttributor as StyleAttributor3 } from "parchment";
var config2 = {
  scope: Scope11.BLOCK,
  whitelist: ["rtl"]
};
var DirectionAttribute = new Attributor2("direction", "dir", config2);
var DirectionClass = new ClassAttributor4("direction", "ql-direction", config2);
var DirectionStyle = new StyleAttributor3("direction", "direction", config2);

// src/formats/font.ts
import { ClassAttributor as ClassAttributor5, Scope as Scope12, StyleAttributor as StyleAttributor4 } from "parchment";
var config3 = {
  scope: Scope12.INLINE,
  whitelist: ["serif", "monospace"]
};
var FontClass = new ClassAttributor5("font", "ql-font", config3);
var FontStyleAttributor = class extends StyleAttributor4 {
  static {
    __name(this, "FontStyleAttributor");
  }
  value(node) {
    return super.value(node).replace(/["']/g, "");
  }
};
var FontStyle = new FontStyleAttributor("font", "font-family", config3);

// src/formats/size.ts
import { ClassAttributor as ClassAttributor6, Scope as Scope13, StyleAttributor as StyleAttributor5 } from "parchment";
var SizeClass = new ClassAttributor6("size", "ql-size", {
  scope: Scope13.INLINE,
  whitelist: ["small", "large", "huge"]
});
var SizeStyle = new StyleAttributor5("size", "font-size", {
  scope: Scope13.INLINE,
  whitelist: ["10px", "18px", "32px"]
});

// src/modules/keyboard.ts
import Delta5, { AttributeMap as AttributeMap3 } from "quill-delta";
import { EmbedBlot as EmbedBlot7, Scope as Scope14, TextBlot as TextBlot2 } from "parchment";
var debug5 = logger_default("quill:keyboard");
var SHORTKEY = /Mac/i.test(navigator.platform) ? "metaKey" : "ctrlKey";
var Keyboard = class _Keyboard extends module_default {
  static {
    __name(this, "Keyboard");
  }
  static match(evt, binding) {
    if (["altKey", "ctrlKey", "metaKey", "shiftKey"].some((key) => {
      return !!binding[key] !== evt[key] && binding[key] !== null;
    })) {
      return false;
    }
    return binding.key === evt.key || binding.key === evt.which;
  }
  constructor(quill, options) {
    super(quill, options);
    this.bindings = {};
    Object.keys(this.options.bindings).forEach((name) => {
      if (this.options.bindings[name]) {
        this.addBinding(this.options.bindings[name]);
      }
    });
    this.addBinding({ key: "Enter", shiftKey: null }, this.handleEnter);
    this.addBinding(
      { key: "Enter", metaKey: null, ctrlKey: null, altKey: null },
      () => {
      }
    );
    if (/Firefox/i.test(navigator.userAgent)) {
      this.addBinding(
        { key: "Backspace" },
        { collapsed: true },
        this.handleBackspace
      );
      this.addBinding(
        { key: "Delete" },
        { collapsed: true },
        this.handleDelete
      );
    } else {
      this.addBinding(
        { key: "Backspace" },
        { collapsed: true, prefix: /^.?$/ },
        this.handleBackspace
      );
      this.addBinding(
        { key: "Delete" },
        { collapsed: true, suffix: /^.?$/ },
        this.handleDelete
      );
    }
    this.addBinding(
      { key: "Backspace" },
      { collapsed: false },
      this.handleDeleteRange
    );
    this.addBinding(
      { key: "Delete" },
      { collapsed: false },
      this.handleDeleteRange
    );
    this.addBinding(
      {
        key: "Backspace",
        altKey: null,
        ctrlKey: null,
        metaKey: null,
        shiftKey: null
      },
      { collapsed: true, offset: 0 },
      this.handleBackspace
    );
    this.listen();
  }
  addBinding(keyBinding, context = {}, handler = {}) {
    const binding = normalize(keyBinding);
    if (binding == null) {
      debug5.warn("Attempted to add invalid keyboard binding", binding);
      return;
    }
    if (typeof context === "function") {
      context = { handler: context };
    }
    if (typeof handler === "function") {
      handler = { handler };
    }
    const keys2 = Array.isArray(binding.key) ? binding.key : [binding.key];
    keys2.forEach((key) => {
      const singleBinding = {
        ...binding,
        key,
        ...context,
        ...handler
      };
      this.bindings[singleBinding.key] = this.bindings[singleBinding.key] || [];
      this.bindings[singleBinding.key].push(singleBinding);
    });
  }
  listen() {
    this.quill.root.addEventListener("keydown", (evt) => {
      if (evt.defaultPrevented || evt.isComposing)
        return;
      const bindings = (this.bindings[evt.key] || []).concat(
        this.bindings[evt.which] || []
      );
      const matches = bindings.filter(
        (binding) => _Keyboard.match(evt, binding)
      );
      if (matches.length === 0)
        return;
      const blot = Quill.find(evt.target, true);
      if (blot && blot.scroll !== this.quill.scroll)
        return;
      const range = this.quill.getSelection();
      if (range == null || !this.quill.hasFocus())
        return;
      const [line, offset] = this.quill.getLine(range.index);
      const [leafStart, offsetStart] = this.quill.getLeaf(range.index);
      const [leafEnd, offsetEnd] = range.length === 0 ? [leafStart, offsetStart] : this.quill.getLeaf(range.index + range.length);
      const prefixText = leafStart instanceof TextBlot2 ? leafStart.value().slice(0, offsetStart) : "";
      const suffixText = leafEnd instanceof TextBlot2 ? leafEnd.value().slice(offsetEnd) : "";
      const curContext = {
        collapsed: range.length === 0,
        // @ts-expect-error Fix me later
        empty: range.length === 0 && line.length() <= 1,
        format: this.quill.getFormat(range),
        line,
        offset,
        prefix: prefixText,
        suffix: suffixText,
        event: evt
      };
      const prevented = matches.some((binding) => {
        if (binding.collapsed != null && binding.collapsed !== curContext.collapsed) {
          return false;
        }
        if (binding.empty != null && binding.empty !== curContext.empty) {
          return false;
        }
        if (binding.offset != null && binding.offset !== curContext.offset) {
          return false;
        }
        if (Array.isArray(binding.format)) {
          if (binding.format.every((name) => curContext.format[name] == null)) {
            return false;
          }
        } else if (typeof binding.format === "object") {
          if (!Object.keys(binding.format).every((name) => {
            if (binding.format[name] === true)
              return curContext.format[name] != null;
            if (binding.format[name] === false)
              return curContext.format[name] == null;
            return isEqual_default(binding.format[name], curContext.format[name]);
          })) {
            return false;
          }
        }
        if (binding.prefix != null && !binding.prefix.test(curContext.prefix)) {
          return false;
        }
        if (binding.suffix != null && !binding.suffix.test(curContext.suffix)) {
          return false;
        }
        return binding.handler.call(this, range, curContext, binding) !== true;
      });
      if (prevented) {
        evt.preventDefault();
      }
    });
  }
  handleBackspace(range, context) {
    const length = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(context.prefix) ? 2 : 1;
    if (range.index === 0 || this.quill.getLength() <= 1)
      return;
    let formats = {};
    const [line] = this.quill.getLine(range.index);
    let delta = new Delta5().retain(range.index - length).delete(length);
    if (context.offset === 0) {
      const [prev] = this.quill.getLine(range.index - 1);
      if (prev) {
        const isPrevLineEmpty = prev.statics.blotName === "block" && prev.length() <= 1;
        if (!isPrevLineEmpty) {
          const curFormats = line.formats();
          const prevFormats = this.quill.getFormat(range.index - 1, 1);
          formats = AttributeMap3.diff(curFormats, prevFormats) || {};
          if (Object.keys(formats).length > 0) {
            const formatDelta = new Delta5().retain(range.index + line.length() - 2).retain(1, formats);
            delta = delta.compose(formatDelta);
          }
        }
      }
    }
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.focus();
  }
  handleDelete(range, context) {
    const length = /^[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(context.suffix) ? 2 : 1;
    if (range.index >= this.quill.getLength() - length)
      return;
    let formats = {};
    const [line] = this.quill.getLine(range.index);
    let delta = new Delta5().retain(range.index).delete(length);
    if (context.offset >= line.length() - 1) {
      const [next] = this.quill.getLine(range.index + 1);
      if (next) {
        const curFormats = line.formats();
        const nextFormats = this.quill.getFormat(range.index, 1);
        formats = AttributeMap3.diff(curFormats, nextFormats) || {};
        if (Object.keys(formats).length > 0) {
          delta = delta.retain(next.length() - 1).retain(1, formats);
        }
      }
    }
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.focus();
  }
  handleDeleteRange(range) {
    deleteRange({ range, quill: this.quill });
    this.quill.focus();
  }
  handleEnter(range, context) {
    const lineFormats = Object.keys(context.format).reduce(
      (formats, format) => {
        if (this.quill.scroll.query(format, Scope14.BLOCK) && !Array.isArray(context.format[format])) {
          formats[format] = context.format[format];
        }
        return formats;
      },
      {}
    );
    const delta = new Delta5().retain(range.index).delete(range.length).insert("\n", lineFormats);
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
    this.quill.focus();
  }
};
var defaultOptions = {
  bindings: {
    bold: makeFormatHandler("bold"),
    italic: makeFormatHandler("italic"),
    underline: makeFormatHandler("underline"),
    indent: {
      // highlight tab or tab at beginning of list, indent or blockquote
      key: "Tab",
      format: ["blockquote", "indent", "list"],
      handler(range, context) {
        if (context.collapsed && context.offset !== 0)
          return true;
        this.quill.format("indent", "+1", Quill.sources.USER);
        return false;
      }
    },
    outdent: {
      key: "Tab",
      shiftKey: true,
      format: ["blockquote", "indent", "list"],
      // highlight tab or tab at beginning of list, indent or blockquote
      handler(range, context) {
        if (context.collapsed && context.offset !== 0)
          return true;
        this.quill.format("indent", "-1", Quill.sources.USER);
        return false;
      }
    },
    "outdent backspace": {
      key: "Backspace",
      collapsed: true,
      shiftKey: null,
      metaKey: null,
      ctrlKey: null,
      altKey: null,
      format: ["indent", "list"],
      offset: 0,
      handler(range, context) {
        if (context.format.indent != null) {
          this.quill.format("indent", "-1", Quill.sources.USER);
        } else if (context.format.list != null) {
          this.quill.format("list", false, Quill.sources.USER);
        }
      }
    },
    "indent code-block": makeCodeBlockHandler(true),
    "outdent code-block": makeCodeBlockHandler(false),
    "remove tab": {
      key: "Tab",
      shiftKey: true,
      collapsed: true,
      prefix: /\t$/,
      handler(range) {
        this.quill.deleteText(range.index - 1, 1, Quill.sources.USER);
      }
    },
    tab: {
      key: "Tab",
      handler(range, context) {
        if (context.format.table)
          return true;
        this.quill.history.cutoff();
        const delta = new Delta5().retain(range.index).delete(range.length).insert("	");
        this.quill.updateContents(delta, Quill.sources.USER);
        this.quill.history.cutoff();
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        return false;
      }
    },
    "blockquote empty enter": {
      key: "Enter",
      collapsed: true,
      format: ["blockquote"],
      empty: true,
      handler() {
        this.quill.format("blockquote", false, Quill.sources.USER);
      }
    },
    "list empty enter": {
      key: "Enter",
      collapsed: true,
      format: ["list"],
      empty: true,
      handler(range, context) {
        const formats = { list: false };
        if (context.format.indent) {
          formats.indent = false;
        }
        this.quill.formatLine(
          range.index,
          range.length,
          formats,
          Quill.sources.USER
        );
      }
    },
    "checklist enter": {
      key: "Enter",
      collapsed: true,
      format: { list: "checked" },
      handler(range) {
        const [line, offset] = this.quill.getLine(range.index);
        const formats = {
          // @ts-expect-error Fix me later
          ...line.formats(),
          list: "checked"
        };
        const delta = new Delta5().retain(range.index).insert("\n", formats).retain(line.length() - offset - 1).retain(1, { list: "unchecked" });
        this.quill.updateContents(delta, Quill.sources.USER);
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        this.quill.scrollSelectionIntoView();
      }
    },
    "header enter": {
      key: "Enter",
      collapsed: true,
      format: ["header"],
      suffix: /^$/,
      handler(range, context) {
        const [line, offset] = this.quill.getLine(range.index);
        const delta = new Delta5().retain(range.index).insert("\n", context.format).retain(line.length() - offset - 1).retain(1, { header: null });
        this.quill.updateContents(delta, Quill.sources.USER);
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        this.quill.scrollSelectionIntoView();
      }
    },
    "table backspace": {
      key: "Backspace",
      format: ["table"],
      collapsed: true,
      offset: 0,
      handler() {
      }
    },
    "table delete": {
      key: "Delete",
      format: ["table"],
      collapsed: true,
      suffix: /^$/,
      handler() {
      }
    },
    "table enter": {
      key: "Enter",
      shiftKey: null,
      format: ["table"],
      handler(range) {
        const module2 = this.quill.getModule("table");
        if (module2) {
          const [table, row, cell, offset] = module2.getTable(range);
          const shift = tableSide(table, row, cell, offset);
          if (shift == null)
            return;
          let index = table.offset();
          if (shift < 0) {
            const delta = new Delta5().retain(index).insert("\n");
            this.quill.updateContents(delta, Quill.sources.USER);
            this.quill.setSelection(
              range.index + 1,
              range.length,
              Quill.sources.SILENT
            );
          } else if (shift > 0) {
            index += table.length();
            const delta = new Delta5().retain(index).insert("\n");
            this.quill.updateContents(delta, Quill.sources.USER);
            this.quill.setSelection(index, Quill.sources.USER);
          }
        }
      }
    },
    "table tab": {
      key: "Tab",
      shiftKey: null,
      format: ["table"],
      handler(range, context) {
        const { event, line: cell } = context;
        const offset = cell.offset(this.quill.scroll);
        if (event.shiftKey) {
          this.quill.setSelection(offset - 1, Quill.sources.USER);
        } else {
          this.quill.setSelection(offset + cell.length(), Quill.sources.USER);
        }
      }
    },
    "list autofill": {
      key: " ",
      shiftKey: null,
      collapsed: true,
      format: {
        "code-block": false,
        blockquote: false,
        table: false
      },
      prefix: /^\s*?(\d+\.|-|\*|\[ ?\]|\[x\])$/,
      handler(range, context) {
        if (this.quill.scroll.query("list") == null)
          return true;
        const { length } = context.prefix;
        const [line, offset] = this.quill.getLine(range.index);
        if (offset > length)
          return true;
        let value;
        switch (context.prefix.trim()) {
          case "[]":
          case "[ ]":
            value = "unchecked";
            break;
          case "[x]":
            value = "checked";
            break;
          case "-":
          case "*":
            value = "bullet";
            break;
          default:
            value = "ordered";
        }
        this.quill.insertText(range.index, " ", Quill.sources.USER);
        this.quill.history.cutoff();
        const delta = new Delta5().retain(range.index - offset).delete(length + 1).retain(line.length() - 2 - offset).retain(1, { list: value });
        this.quill.updateContents(delta, Quill.sources.USER);
        this.quill.history.cutoff();
        this.quill.setSelection(range.index - length, Quill.sources.SILENT);
        return false;
      }
    },
    "code exit": {
      key: "Enter",
      collapsed: true,
      format: ["code-block"],
      prefix: /^$/,
      suffix: /^\s*$/,
      handler(range) {
        const [line, offset] = this.quill.getLine(range.index);
        let numLines = 2;
        let cur = line;
        while (cur != null && cur.length() <= 1 && cur.formats()["code-block"]) {
          cur = cur.prev;
          numLines -= 1;
          if (numLines <= 0) {
            const delta = new Delta5().retain(range.index + line.length() - offset - 2).retain(1, { "code-block": null }).delete(1);
            this.quill.updateContents(delta, Quill.sources.USER);
            this.quill.setSelection(range.index - 1, Quill.sources.SILENT);
            return false;
          }
        }
        return true;
      }
    },
    "embed left": makeEmbedArrowHandler("ArrowLeft", false),
    "embed left shift": makeEmbedArrowHandler("ArrowLeft", true),
    "embed right": makeEmbedArrowHandler("ArrowRight", false),
    "embed right shift": makeEmbedArrowHandler("ArrowRight", true),
    "table down": makeTableArrowHandler(false),
    "table up": makeTableArrowHandler(true)
  }
};
Keyboard.DEFAULTS = defaultOptions;
function makeCodeBlockHandler(indent) {
  return {
    key: "Tab",
    shiftKey: !indent,
    format: { "code-block": true },
    handler(range, { event }) {
      const CodeBlock2 = this.quill.scroll.query("code-block");
      const { TAB } = CodeBlock2;
      if (range.length === 0 && !event.shiftKey) {
        this.quill.insertText(range.index, TAB, Quill.sources.USER);
        this.quill.setSelection(range.index + TAB.length, Quill.sources.SILENT);
        return;
      }
      const lines = range.length === 0 ? this.quill.getLines(range.index, 1) : this.quill.getLines(range);
      let { index, length } = range;
      lines.forEach((line, i) => {
        if (indent) {
          line.insertAt(0, TAB);
          if (i === 0) {
            index += TAB.length;
          } else {
            length += TAB.length;
          }
        } else if (line.domNode.textContent.startsWith(TAB)) {
          line.deleteAt(0, TAB.length);
          if (i === 0) {
            index -= TAB.length;
          } else {
            length -= TAB.length;
          }
        }
      });
      this.quill.update(Quill.sources.USER);
      this.quill.setSelection(index, length, Quill.sources.SILENT);
    }
  };
}
__name(makeCodeBlockHandler, "makeCodeBlockHandler");
function makeEmbedArrowHandler(key, shiftKey) {
  const where = key === "ArrowLeft" ? "prefix" : "suffix";
  return {
    key,
    shiftKey,
    altKey: null,
    [where]: /^$/,
    handler(range) {
      let { index } = range;
      if (key === "ArrowRight") {
        index += range.length + 1;
      }
      const [leaf] = this.quill.getLeaf(index);
      if (!(leaf instanceof EmbedBlot7))
        return true;
      if (key === "ArrowLeft") {
        if (shiftKey) {
          this.quill.setSelection(
            range.index - 1,
            range.length + 1,
            Quill.sources.USER
          );
        } else {
          this.quill.setSelection(range.index - 1, Quill.sources.USER);
        }
      } else if (shiftKey) {
        this.quill.setSelection(
          range.index,
          range.length + 1,
          Quill.sources.USER
        );
      } else {
        this.quill.setSelection(
          range.index + range.length + 1,
          Quill.sources.USER
        );
      }
      return false;
    }
  };
}
__name(makeEmbedArrowHandler, "makeEmbedArrowHandler");
function makeFormatHandler(format) {
  return {
    key: format[0],
    shortKey: true,
    handler(range, context) {
      this.quill.format(format, !context.format[format], Quill.sources.USER);
    }
  };
}
__name(makeFormatHandler, "makeFormatHandler");
function makeTableArrowHandler(up) {
  return {
    key: up ? "ArrowUp" : "ArrowDown",
    collapsed: true,
    format: ["table"],
    handler(range, context) {
      const key = up ? "prev" : "next";
      const cell = context.line;
      const targetRow = cell.parent[key];
      if (targetRow != null) {
        if (targetRow.statics.blotName === "table-row") {
          let targetCell = targetRow.children.head;
          let cur = cell;
          while (cur.prev != null) {
            cur = cur.prev;
            targetCell = targetCell.next;
          }
          const index = targetCell.offset(this.quill.scroll) + Math.min(context.offset, targetCell.length() - 1);
          this.quill.setSelection(index, 0, Quill.sources.USER);
        }
      } else {
        const targetLine = cell.table()[key];
        if (targetLine != null) {
          if (up) {
            this.quill.setSelection(
              targetLine.offset(this.quill.scroll) + targetLine.length() - 1,
              0,
              Quill.sources.USER
            );
          } else {
            this.quill.setSelection(
              targetLine.offset(this.quill.scroll),
              0,
              Quill.sources.USER
            );
          }
        }
      }
      return false;
    }
  };
}
__name(makeTableArrowHandler, "makeTableArrowHandler");
function normalize(binding) {
  if (typeof binding === "string" || typeof binding === "number") {
    binding = { key: binding };
  } else if (typeof binding === "object") {
    binding = cloneDeep_default(binding);
  } else {
    return null;
  }
  if (binding.shortKey) {
    binding[SHORTKEY] = binding.shortKey;
    delete binding.shortKey;
  }
  return binding;
}
__name(normalize, "normalize");
function deleteRange({ quill, range }) {
  const lines = quill.getLines(range);
  let formats = {};
  if (lines.length > 1) {
    const firstFormats = lines[0].formats();
    const lastFormats = lines[lines.length - 1].formats();
    formats = AttributeMap3.diff(lastFormats, firstFormats) || {};
  }
  quill.deleteText(range, Quill.sources.USER);
  if (Object.keys(formats).length > 0) {
    quill.formatLine(range.index, 1, formats, Quill.sources.USER);
  }
  quill.setSelection(range.index, Quill.sources.SILENT);
}
__name(deleteRange, "deleteRange");
function tableSide(_table, row, cell, offset) {
  if (row.prev == null && row.next == null) {
    if (cell.prev == null && cell.next == null) {
      return offset === 0 ? -1 : 1;
    }
    return cell.prev == null ? -1 : 1;
  }
  if (row.prev == null) {
    return -1;
  }
  if (row.next == null) {
    return 1;
  }
  return null;
}
__name(tableSide, "tableSide");

// src/modules/normalizeExternalHTML/normalizers/googleDocs.ts
var normalWeightRegexp = /font-weight:\s*normal/;
var blockTagNames = ["P", "OL", "UL"];
var isBlockElement = /* @__PURE__ */ __name((element) => {
  return element && blockTagNames.includes(element.tagName);
}, "isBlockElement");
var normalizeEmptyLines = /* @__PURE__ */ __name((doc) => {
  Array.from(doc.querySelectorAll("br")).filter(
    (br) => isBlockElement(br.previousElementSibling) && isBlockElement(br.nextElementSibling)
  ).forEach((br) => {
    br.parentNode?.removeChild(br);
  });
}, "normalizeEmptyLines");
var normalizeFontWeight = /* @__PURE__ */ __name((doc) => {
  Array.from(doc.querySelectorAll('b[style*="font-weight"]')).filter((node) => node.getAttribute("style")?.match(normalWeightRegexp)).forEach((node) => {
    const fragment = doc.createDocumentFragment();
    fragment.append(...node.childNodes);
    node.parentNode?.replaceChild(fragment, node);
  });
}, "normalizeFontWeight");
function normalize2(doc) {
  if (doc.querySelector('[id^="docs-internal-guid-"]')) {
    normalizeFontWeight(doc);
    normalizeEmptyLines(doc);
  }
}
__name(normalize2, "normalize");

// src/modules/normalizeExternalHTML/normalizers/msWord.ts
var ignoreRegexp = /\bmso-list:[^;]*ignore/i;
var idRegexp = /\bmso-list:[^;]*\bl(\d+)/i;
var indentRegexp = /\bmso-list:[^;]*\blevel(\d+)/i;
var parseListItem = /* @__PURE__ */ __name((element, html) => {
  const style = element.getAttribute("style");
  const idMatch = style?.match(idRegexp);
  if (!idMatch) {
    return null;
  }
  const id = Number(idMatch[1]);
  const indentMatch = style?.match(indentRegexp);
  const indent = indentMatch ? Number(indentMatch[1]) : 1;
  const typeRegexp = new RegExp(
    `@list l${id}:level${indent}\\s*\\{[^\\}]*mso-level-number-format:\\s*([\\w-]+)`,
    "i"
  );
  const typeMatch = html.match(typeRegexp);
  const type = typeMatch && typeMatch[1] === "bullet" ? "bullet" : "ordered";
  return { id, indent, type, element };
}, "parseListItem");
var normalizeListItem = /* @__PURE__ */ __name((doc) => {
  const msoList = Array.from(doc.querySelectorAll("[style*=mso-list]"));
  const ignored = [];
  const others = [];
  msoList.forEach((node) => {
    const shouldIgnore = (node.getAttribute("style") || "").match(ignoreRegexp);
    if (shouldIgnore) {
      ignored.push(node);
    } else {
      others.push(node);
    }
  });
  ignored.forEach((node) => node.parentNode?.removeChild(node));
  const html = doc.documentElement.innerHTML;
  const listItems = others.map((element) => parseListItem(element, html)).filter((parsed) => parsed);
  while (listItems.length) {
    const childListItems = [];
    let current = listItems.shift();
    while (current) {
      childListItems.push(current);
      current = listItems.length && listItems[0]?.element === current.element.nextElementSibling && // Different id means the next item doesn't belong to this group.
      listItems[0].id === current.id ? listItems.shift() : null;
    }
    const ul = document.createElement("ul");
    childListItems.forEach((listItem) => {
      const li = document.createElement("li");
      li.setAttribute("data-list", listItem.type);
      if (listItem.indent > 1) {
        li.setAttribute("class", `ql-indent-${listItem.indent - 1}`);
      }
      li.innerHTML = listItem.element.innerHTML;
      ul.appendChild(li);
    });
    const element = childListItems[0]?.element;
    const { parentNode } = element ?? {};
    if (element) {
      parentNode?.replaceChild(ul, element);
    }
    childListItems.slice(1).forEach(({ element: e }) => {
      parentNode?.removeChild(e);
    });
  }
}, "normalizeListItem");
function normalize3(doc) {
  if (doc.documentElement.getAttribute("xmlns:w") === "urn:schemas-microsoft-com:office:word") {
    normalizeListItem(doc);
  }
}
__name(normalize3, "normalize");

// src/modules/normalizeExternalHTML/index.ts
var NORMALIZERS = [normalize3, normalize2];
var normalizeExternalHTML = /* @__PURE__ */ __name((doc) => {
  if (doc.documentElement) {
    NORMALIZERS.forEach((normalize4) => {
      normalize4(doc);
    });
  }
}, "normalizeExternalHTML");
var normalizeExternalHTML_default = normalizeExternalHTML;

// src/modules/clipboard.ts
var debug6 = logger_default("quill:clipboard");
var CLIPBOARD_CONFIG = [
  [Node.TEXT_NODE, matchText],
  [Node.TEXT_NODE, matchNewline],
  ["br", matchBreak],
  [Node.ELEMENT_NODE, matchNewline],
  [Node.ELEMENT_NODE, matchBlot],
  [Node.ELEMENT_NODE, matchAttributor],
  [Node.ELEMENT_NODE, matchStyles],
  ["li", matchIndent],
  ["ol, ul", matchList],
  ["pre", matchCodeBlock],
  ["tr", matchTable],
  ["b", createMatchAlias("bold")],
  ["i", createMatchAlias("italic")],
  ["strike", createMatchAlias("strike")],
  ["style", matchIgnore]
];
var ATTRIBUTE_ATTRIBUTORS = [AlignAttribute, DirectionAttribute].reduce(
  (memo, attr) => {
    memo[attr.keyName] = attr;
    return memo;
  },
  {}
);
var STYLE_ATTRIBUTORS = [
  AlignStyle,
  BackgroundStyle,
  ColorStyle,
  DirectionStyle,
  FontStyle,
  SizeStyle
].reduce((memo, attr) => {
  memo[attr.keyName] = attr;
  return memo;
}, {});
var Clipboard = class extends module_default {
  static {
    __name(this, "Clipboard");
  }
  static {
    this.DEFAULTS = {
      matchers: []
    };
  }
  constructor(quill, options) {
    super(quill, options);
    this.quill.root.addEventListener(
      "copy",
      (e) => this.onCaptureCopy(e, false)
    );
    this.quill.root.addEventListener("cut", (e) => this.onCaptureCopy(e, true));
    this.quill.root.addEventListener("paste", this.onCapturePaste.bind(this));
    this.matchers = [];
    CLIPBOARD_CONFIG.concat(this.options.matchers ?? []).forEach(
      ([selector, matcher]) => {
        this.addMatcher(selector, matcher);
      }
    );
  }
  addMatcher(selector, matcher) {
    this.matchers.push([selector, matcher]);
  }
  convert({ html, text }, formats = {}) {
    if (formats[CodeBlock.blotName]) {
      return new Delta6().insert(text || "", {
        [CodeBlock.blotName]: formats[CodeBlock.blotName]
      });
    }
    if (!html) {
      return new Delta6().insert(text || "", formats);
    }
    const delta = this.convertHTML(html);
    if (deltaEndsWith(delta, "\n") && (delta.ops[delta.ops.length - 1].attributes == null || formats.table)) {
      return delta.compose(new Delta6().retain(delta.length() - 1).delete(1));
    }
    return delta;
  }
  normalizeHTML(doc) {
    normalizeExternalHTML_default(doc);
  }
  convertHTML(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    this.normalizeHTML(doc);
    const container = doc.body;
    const nodeMatches = /* @__PURE__ */ new WeakMap();
    const [elementMatchers, textMatchers] = this.prepareMatching(
      container,
      nodeMatches
    );
    return traverse(
      this.quill.scroll,
      container,
      elementMatchers,
      textMatchers,
      nodeMatches
    );
  }
  dangerouslyPasteHTML(index, html, source = Quill.sources.API) {
    if (typeof index === "string") {
      const delta = this.convert({ html: index, text: "" });
      this.quill.setContents(delta, html);
      this.quill.setSelection(0, Quill.sources.SILENT);
    } else {
      const paste = this.convert({ html, text: "" });
      this.quill.updateContents(
        new Delta6().retain(index).concat(paste),
        source
      );
      this.quill.setSelection(index + paste.length(), Quill.sources.SILENT);
    }
  }
  onCaptureCopy(e, isCut = false) {
    if (e.defaultPrevented)
      return;
    e.preventDefault();
    const [range] = this.quill.selection.getRange();
    if (range == null)
      return;
    const { html, text } = this.onCopy(range, isCut);
    e.clipboardData?.setData("text/plain", text);
    e.clipboardData?.setData("text/html", html);
    if (isCut) {
      deleteRange({ range, quill: this.quill });
    }
  }
  /*
   * https://www.iana.org/assignments/media-types/text/uri-list
   */
  normalizeURIList(urlList) {
    return urlList.split(/\r?\n/).filter((url) => url[0] !== "#").join("\n");
  }
  onCapturePaste(e) {
    if (e.defaultPrevented || !this.quill.isEnabled())
      return;
    e.preventDefault();
    const range = this.quill.getSelection(true);
    if (range == null)
      return;
    const html = e.clipboardData?.getData("text/html");
    let text = e.clipboardData?.getData("text/plain");
    if (!html && !text) {
      const urlList = e.clipboardData?.getData("text/uri-list");
      if (urlList) {
        text = this.normalizeURIList(urlList);
      }
    }
    const files = Array.from(e.clipboardData?.files || []);
    if (!html && files.length > 0) {
      this.quill.uploader.upload(range, files);
      return;
    }
    if (html && files.length > 0) {
      const doc = new DOMParser().parseFromString(html, "text/html");
      if (doc.body.childElementCount === 1 && doc.body.firstElementChild?.tagName === "IMG") {
        this.quill.uploader.upload(range, files);
        return;
      }
    }
    this.onPaste(range, { html, text });
  }
  onCopy(range) {
    const text = this.quill.getText(range);
    const html = this.quill.getSemanticHTML(range);
    return { html, text };
  }
  onPaste(range, { text, html }) {
    const formats = this.quill.getFormat(range.index);
    const pastedDelta = this.convert({ text, html }, formats);
    debug6.log("onPaste", pastedDelta, { text, html });
    const delta = new Delta6().retain(range.index).delete(range.length).concat(pastedDelta);
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.setSelection(
      delta.length() - range.length,
      Quill.sources.SILENT
    );
    this.quill.scrollSelectionIntoView();
  }
  prepareMatching(container, nodeMatches) {
    const elementMatchers = [];
    const textMatchers = [];
    this.matchers.forEach((pair) => {
      const [selector, matcher] = pair;
      switch (selector) {
        case Node.TEXT_NODE:
          textMatchers.push(matcher);
          break;
        case Node.ELEMENT_NODE:
          elementMatchers.push(matcher);
          break;
        default:
          Array.from(container.querySelectorAll(selector)).forEach((node) => {
            if (nodeMatches.has(node)) {
              const matches = nodeMatches.get(node);
              matches?.push(matcher);
            } else {
              nodeMatches.set(node, [matcher]);
            }
          });
          break;
      }
    });
    return [elementMatchers, textMatchers];
  }
};
function applyFormat(delta, format, value, scroll) {
  if (!scroll.query(format)) {
    return delta;
  }
  return delta.reduce((newDelta, op) => {
    if (!op.insert)
      return newDelta;
    if (op.attributes && op.attributes[format]) {
      return newDelta.push(op);
    }
    const formats = value ? { [format]: value } : {};
    return newDelta.insert(op.insert, { ...formats, ...op.attributes });
  }, new Delta6());
}
__name(applyFormat, "applyFormat");
function deltaEndsWith(delta, text) {
  let endText = "";
  for (let i = delta.ops.length - 1; i >= 0 && endText.length < text.length; --i) {
    const op = delta.ops[i];
    if (typeof op.insert !== "string")
      break;
    endText = op.insert + endText;
  }
  return endText.slice(-1 * text.length) === text;
}
__name(deltaEndsWith, "deltaEndsWith");
function isLine2(node, scroll) {
  if (!(node instanceof Element))
    return false;
  const match = scroll.query(node);
  if (match && match.prototype instanceof EmbedBlot8)
    return false;
  return [
    "address",
    "article",
    "blockquote",
    "canvas",
    "dd",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "iframe",
    "li",
    "main",
    "nav",
    "ol",
    "output",
    "p",
    "pre",
    "section",
    "table",
    "td",
    "tr",
    "ul",
    "video"
  ].includes(node.tagName.toLowerCase());
}
__name(isLine2, "isLine");
function isBetweenInlineElements(node, scroll) {
  return node.previousElementSibling && node.nextElementSibling && !isLine2(node.previousElementSibling, scroll) && !isLine2(node.nextElementSibling, scroll);
}
__name(isBetweenInlineElements, "isBetweenInlineElements");
var preNodes = /* @__PURE__ */ new WeakMap();
function isPre(node) {
  if (node == null)
    return false;
  if (!preNodes.has(node)) {
    if (node.tagName === "PRE") {
      preNodes.set(node, true);
    } else {
      preNodes.set(node, isPre(node.parentNode));
    }
  }
  return preNodes.get(node);
}
__name(isPre, "isPre");
function traverse(scroll, node, elementMatchers, textMatchers, nodeMatches) {
  if (node.nodeType === node.TEXT_NODE) {
    return textMatchers.reduce((delta, matcher) => {
      return matcher(node, delta, scroll);
    }, new Delta6());
  }
  if (node.nodeType === node.ELEMENT_NODE) {
    return Array.from(node.childNodes || []).reduce((delta, childNode) => {
      let childrenDelta = traverse(
        scroll,
        childNode,
        elementMatchers,
        textMatchers,
        nodeMatches
      );
      if (childNode.nodeType === node.ELEMENT_NODE) {
        childrenDelta = elementMatchers.reduce((reducedDelta, matcher) => {
          return matcher(childNode, reducedDelta, scroll);
        }, childrenDelta);
        childrenDelta = (nodeMatches.get(childNode) || []).reduce(
          (reducedDelta, matcher) => {
            return matcher(childNode, reducedDelta, scroll);
          },
          childrenDelta
        );
      }
      return delta.concat(childrenDelta);
    }, new Delta6());
  }
  return new Delta6();
}
__name(traverse, "traverse");
function createMatchAlias(format) {
  return (_node, delta, scroll) => {
    return applyFormat(delta, format, true, scroll);
  };
}
__name(createMatchAlias, "createMatchAlias");
function matchAttributor(node, delta, scroll) {
  const attributes = Attributor3.keys(node);
  const classes = ClassAttributor7.keys(node);
  const styles = StyleAttributor6.keys(node);
  const formats = {};
  attributes.concat(classes).concat(styles).forEach((name) => {
    let attr = scroll.query(name, Scope15.ATTRIBUTE);
    if (attr != null) {
      formats[attr.attrName] = attr.value(node);
      if (formats[attr.attrName])
        return;
    }
    attr = ATTRIBUTE_ATTRIBUTORS[name];
    if (attr != null && (attr.attrName === name || attr.keyName === name)) {
      formats[attr.attrName] = attr.value(node) || void 0;
    }
    attr = STYLE_ATTRIBUTORS[name];
    if (attr != null && (attr.attrName === name || attr.keyName === name)) {
      attr = STYLE_ATTRIBUTORS[name];
      formats[attr.attrName] = attr.value(node) || void 0;
    }
  });
  return Object.entries(formats).reduce(
    (newDelta, [name, value]) => applyFormat(newDelta, name, value, scroll),
    delta
  );
}
__name(matchAttributor, "matchAttributor");
function matchBlot(node, delta, scroll) {
  const match = scroll.query(node);
  if (match == null)
    return delta;
  if (match.prototype instanceof EmbedBlot8) {
    const embed = {};
    const value = match.value(node);
    if (value != null) {
      embed[match.blotName] = value;
      return new Delta6().insert(embed, match.formats(node, scroll));
    }
  } else {
    if (match.prototype instanceof BlockBlot2 && !deltaEndsWith(delta, "\n")) {
      delta.insert("\n");
    }
    if ("blotName" in match && "formats" in match && typeof match.formats === "function") {
      return applyFormat(
        delta,
        match.blotName,
        match.formats(node, scroll),
        scroll
      );
    }
  }
  return delta;
}
__name(matchBlot, "matchBlot");
function matchBreak(node, delta) {
  if (!deltaEndsWith(delta, "\n")) {
    delta.insert("\n");
  }
  return delta;
}
__name(matchBreak, "matchBreak");
function matchCodeBlock(node, delta, scroll) {
  const match = scroll.query("code-block");
  const language = match && "formats" in match && typeof match.formats === "function" ? match.formats(node, scroll) : true;
  return applyFormat(delta, "code-block", language, scroll);
}
__name(matchCodeBlock, "matchCodeBlock");
function matchIgnore() {
  return new Delta6();
}
__name(matchIgnore, "matchIgnore");
function matchIndent(node, delta, scroll) {
  const match = scroll.query(node);
  if (match == null || // @ts-expect-error
  match.blotName !== "list" || !deltaEndsWith(delta, "\n")) {
    return delta;
  }
  let indent = -1;
  let parent = node.parentNode;
  while (parent != null) {
    if (["OL", "UL"].includes(parent.tagName)) {
      indent += 1;
    }
    parent = parent.parentNode;
  }
  if (indent <= 0)
    return delta;
  return delta.reduce((composed, op) => {
    if (!op.insert)
      return composed;
    if (op.attributes && typeof op.attributes.indent === "number") {
      return composed.push(op);
    }
    return composed.insert(op.insert, { indent, ...op.attributes || {} });
  }, new Delta6());
}
__name(matchIndent, "matchIndent");
function matchList(node, delta, scroll) {
  const element = node;
  let list = element.tagName === "OL" ? "ordered" : "bullet";
  const checkedAttr = element.getAttribute("data-checked");
  if (checkedAttr) {
    list = checkedAttr === "true" ? "checked" : "unchecked";
  }
  return applyFormat(delta, "list", list, scroll);
}
__name(matchList, "matchList");
function matchNewline(node, delta, scroll) {
  if (!deltaEndsWith(delta, "\n")) {
    if (isLine2(node, scroll) && (node.childNodes.length > 0 || node instanceof HTMLParagraphElement)) {
      return delta.insert("\n");
    }
    if (delta.length() > 0 && node.nextSibling) {
      let nextSibling = node.nextSibling;
      while (nextSibling != null) {
        if (isLine2(nextSibling, scroll)) {
          return delta.insert("\n");
        }
        const match = scroll.query(nextSibling);
        if (match && match.prototype instanceof BlockEmbed) {
          return delta.insert("\n");
        }
        nextSibling = nextSibling.firstChild;
      }
    }
  }
  return delta;
}
__name(matchNewline, "matchNewline");
function matchStyles(node, delta, scroll) {
  const formats = {};
  const style = node.style || {};
  if (style.fontStyle === "italic") {
    formats.italic = true;
  }
  if (style.textDecoration === "underline") {
    formats.underline = true;
  }
  if (style.textDecoration === "line-through") {
    formats.strike = true;
  }
  if (style.fontWeight?.startsWith("bold") || // @ts-expect-error Fix me later
  parseInt(style.fontWeight, 10) >= 700) {
    formats.bold = true;
  }
  delta = Object.entries(formats).reduce(
    (newDelta, [name, value]) => applyFormat(newDelta, name, value, scroll),
    delta
  );
  if (parseFloat(style.textIndent || 0) > 0) {
    return new Delta6().insert("	").concat(delta);
  }
  return delta;
}
__name(matchStyles, "matchStyles");
function matchTable(node, delta, scroll) {
  const table = node.parentElement?.tagName === "TABLE" ? node.parentElement : node.parentElement?.parentElement;
  if (table != null) {
    const rows = Array.from(table.querySelectorAll("tr"));
    const row = rows.indexOf(node) + 1;
    return applyFormat(delta, "table", row, scroll);
  }
  return delta;
}
__name(matchTable, "matchTable");
function matchText(node, delta, scroll) {
  let text = node.data;
  if (node.parentElement?.tagName === "O:P") {
    return delta.insert(text.trim());
  }
  if (!isPre(node)) {
    if (text.trim().length === 0 && text.includes("\n") && !isBetweenInlineElements(node, scroll)) {
      return delta;
    }
    const replacer = /* @__PURE__ */ __name((collapse, match) => {
      const replaced = match.replace(/[^\u00a0]/g, "");
      return replaced.length < 1 && collapse ? " " : replaced;
    }, "replacer");
    text = text.replace(/\r\n/g, " ").replace(/\n/g, " ");
    text = text.replace(/\s\s+/g, replacer.bind(replacer, true));
    if (node.previousSibling == null && node.parentElement != null && isLine2(node.parentElement, scroll) || node.previousSibling instanceof Element && isLine2(node.previousSibling, scroll)) {
      text = text.replace(/^\s+/, replacer.bind(replacer, false));
    }
    if (node.nextSibling == null && node.parentElement != null && isLine2(node.parentElement, scroll) || node.nextSibling instanceof Element && isLine2(node.nextSibling, scroll)) {
      text = text.replace(/\s+$/, replacer.bind(replacer, false));
    }
  }
  return delta.insert(text);
}
__name(matchText, "matchText");

// src/modules/history.ts
import { Scope as Scope16 } from "parchment";
var History = class extends module_default {
  constructor(quill, options) {
    super(quill, options);
    this.lastRecorded = 0;
    this.ignoreChange = false;
    this.stack = { undo: [], redo: [] };
    this.currentRange = null;
    this.quill.on(
      Quill.events.EDITOR_CHANGE,
      (eventName, value, oldValue, source) => {
        if (eventName === Quill.events.SELECTION_CHANGE) {
          if (value && source !== Quill.sources.SILENT) {
            this.currentRange = value;
          }
        } else if (eventName === Quill.events.TEXT_CHANGE) {
          if (!this.ignoreChange) {
            if (!this.options.userOnly || source === Quill.sources.USER) {
              this.record(value, oldValue);
            } else {
              this.transform(value);
            }
          }
          this.currentRange = transformRange(this.currentRange, value);
        }
      }
    );
    this.quill.keyboard.addBinding(
      { key: "z", shortKey: true },
      this.undo.bind(this)
    );
    this.quill.keyboard.addBinding(
      { key: ["z", "Z"], shortKey: true, shiftKey: true },
      this.redo.bind(this)
    );
    if (/Win/i.test(navigator.platform)) {
      this.quill.keyboard.addBinding(
        { key: "y", shortKey: true },
        this.redo.bind(this)
      );
    }
    this.quill.root.addEventListener("beforeinput", (event) => {
      if (event.inputType === "historyUndo") {
        this.undo();
        event.preventDefault();
      } else if (event.inputType === "historyRedo") {
        this.redo();
        event.preventDefault();
      }
    });
  }
  static {
    __name(this, "History");
  }
  static {
    this.DEFAULTS = {
      delay: 1e3,
      maxStack: 100,
      userOnly: false
    };
  }
  change(source, dest) {
    if (this.stack[source].length === 0)
      return;
    const item = this.stack[source].pop();
    if (!item)
      return;
    const base = this.quill.getContents();
    const inverseDelta = item.delta.invert(base);
    this.stack[dest].push({
      delta: inverseDelta,
      range: transformRange(item.range, inverseDelta)
    });
    this.lastRecorded = 0;
    this.ignoreChange = true;
    this.quill.updateContents(item.delta, Quill.sources.USER);
    this.ignoreChange = false;
    this.restoreSelection(item);
  }
  clear() {
    this.stack = { undo: [], redo: [] };
  }
  cutoff() {
    this.lastRecorded = 0;
  }
  record(changeDelta, oldDelta) {
    if (changeDelta.ops.length === 0)
      return;
    this.stack.redo = [];
    let undoDelta = changeDelta.invert(oldDelta);
    let undoRange = this.currentRange;
    const timestamp = Date.now();
    if (
      // @ts-expect-error Fix me later
      this.lastRecorded + this.options.delay > timestamp && this.stack.undo.length > 0
    ) {
      const item = this.stack.undo.pop();
      if (item) {
        undoDelta = undoDelta.compose(item.delta);
        undoRange = item.range;
      }
    } else {
      this.lastRecorded = timestamp;
    }
    if (undoDelta.length() === 0)
      return;
    this.stack.undo.push({ delta: undoDelta, range: undoRange });
    if (this.stack.undo.length > this.options.maxStack) {
      this.stack.undo.shift();
    }
  }
  redo() {
    this.change("redo", "undo");
  }
  transform(delta) {
    transformStack(this.stack.undo, delta);
    transformStack(this.stack.redo, delta);
  }
  undo() {
    this.change("undo", "redo");
  }
  restoreSelection(stackItem) {
    if (stackItem.range) {
      this.quill.setSelection(stackItem.range, Quill.sources.USER);
    } else {
      const index = getLastChangeIndex(this.quill.scroll, stackItem.delta);
      this.quill.setSelection(index, Quill.sources.USER);
    }
  }
};
function transformStack(stack, delta) {
  let remoteDelta = delta;
  for (let i = stack.length - 1; i >= 0; i -= 1) {
    const oldItem = stack[i];
    stack[i] = {
      delta: remoteDelta.transform(oldItem.delta, true),
      range: oldItem.range && transformRange(oldItem.range, remoteDelta)
    };
    remoteDelta = oldItem.delta.transform(remoteDelta);
    if (stack[i].delta.length() === 0) {
      stack.splice(i, 1);
    }
  }
}
__name(transformStack, "transformStack");
function endsWithNewlineChange(scroll, delta) {
  const lastOp = delta.ops[delta.ops.length - 1];
  if (lastOp == null)
    return false;
  if (lastOp.insert != null) {
    return typeof lastOp.insert === "string" && lastOp.insert.endsWith("\n");
  }
  if (lastOp.attributes != null) {
    return Object.keys(lastOp.attributes).some((attr) => {
      return scroll.query(attr, Scope16.BLOCK) != null;
    });
  }
  return false;
}
__name(endsWithNewlineChange, "endsWithNewlineChange");
function getLastChangeIndex(scroll, delta) {
  const deleteLength = delta.reduce((length, op) => {
    return length + (op.delete || 0);
  }, 0);
  let changeIndex = delta.length() - deleteLength;
  if (endsWithNewlineChange(scroll, delta)) {
    changeIndex -= 1;
  }
  return changeIndex;
}
__name(getLastChangeIndex, "getLastChangeIndex");
function transformRange(range, delta) {
  if (!range)
    return range;
  const start = delta.transformPosition(range.index);
  const end = delta.transformPosition(range.index + range.length);
  return { index: start, length: end - start };
}
__name(transformRange, "transformRange");

// src/modules/uploader.ts
import Delta7 from "quill-delta";
var Uploader = class extends module_default {
  static {
    __name(this, "Uploader");
  }
  constructor(quill, options) {
    super(quill, options);
    quill.root.addEventListener("drop", (e) => {
      e.preventDefault();
      let native = null;
      if (document.caretRangeFromPoint) {
        native = document.caretRangeFromPoint(e.clientX, e.clientY);
      } else if (document.caretPositionFromPoint) {
        const position = document.caretPositionFromPoint(e.clientX, e.clientY);
        native = document.createRange();
        native.setStart(position.offsetNode, position.offset);
        native.setEnd(position.offsetNode, position.offset);
      }
      const normalized = native && quill.selection.normalizeNative(native);
      if (normalized) {
        const range = quill.selection.normalizedToRange(normalized);
        if (e.dataTransfer?.files) {
          this.upload(range, e.dataTransfer.files);
        }
      }
    });
  }
  upload(range, files) {
    const uploads = [];
    Array.from(files).forEach((file) => {
      if (file && this.options.mimetypes?.includes(file.type)) {
        uploads.push(file);
      }
    });
    if (uploads.length > 0) {
      this.options.handler.call(this, range, uploads);
    }
  }
};
Uploader.DEFAULTS = {
  mimetypes: ["image/png", "image/jpeg"],
  handler(range, files) {
    const promises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then((images) => {
      const update = images.reduce((delta, image) => {
        return delta.insert({ image });
      }, new Delta7().retain(range.index).delete(range.length));
      this.quill.updateContents(update, emitter_default.sources.USER);
      this.quill.setSelection(
        range.index + images.length,
        emitter_default.sources.SILENT
      );
    });
  }
};
var uploader_default = Uploader;

// src/core.ts
import Delta9, { Op as Op3, OpIterator, AttributeMap as AttributeMap4 } from "quill-delta";

// src/modules/input.ts
import Delta8 from "quill-delta";
var INSERT_TYPES = ["insertText", "insertReplacementText"];
var Input = class extends module_default {
  static {
    __name(this, "Input");
  }
  constructor(quill, options) {
    super(quill, options);
    quill.root.addEventListener("beforeinput", (event) => {
      this.handleBeforeInput(event);
    });
    if (!/Android/i.test(navigator.userAgent)) {
      quill.on(Quill.events.COMPOSITION_BEFORE_START, () => {
        this.handleCompositionStart();
      });
    }
  }
  deleteRange(range) {
    deleteRange({ range, quill: this.quill });
  }
  replaceText(range, text = "") {
    if (range.length === 0)
      return false;
    if (text) {
      const formats = this.quill.getFormat(range.index, 1);
      this.deleteRange(range);
      this.quill.updateContents(
        new Delta8().retain(range.index).insert(text, formats),
        Quill.sources.USER
      );
    } else {
      this.deleteRange(range);
    }
    this.quill.setSelection(range.index + text.length, 0, Quill.sources.SILENT);
    return true;
  }
  handleBeforeInput(event) {
    if (this.quill.composition.isComposing || event.defaultPrevented || !INSERT_TYPES.includes(event.inputType)) {
      return;
    }
    const staticRange = event.getTargetRanges ? event.getTargetRanges()[0] : null;
    if (!staticRange || staticRange.collapsed === true) {
      return;
    }
    const text = getPlainTextFromInputEvent(event);
    if (text == null) {
      return;
    }
    const normalized = this.quill.selection.normalizeNative(staticRange);
    const range = normalized ? this.quill.selection.normalizedToRange(normalized) : null;
    if (range && this.replaceText(range, text)) {
      event.preventDefault();
    }
  }
  handleCompositionStart() {
    const range = this.quill.getSelection();
    if (range) {
      this.replaceText(range);
    }
  }
};
function getPlainTextFromInputEvent(event) {
  if (typeof event.data === "string") {
    return event.data;
  }
  if (event.dataTransfer?.types.includes("text/plain")) {
    return event.dataTransfer.getData("text/plain");
  }
  return null;
}
__name(getPlainTextFromInputEvent, "getPlainTextFromInputEvent");
var input_default = Input;

// src/modules/uiNode.ts
import { ParentBlot as ParentBlot3 } from "parchment";
var isMac = /Mac/i.test(navigator.platform);
var TTL_FOR_VALID_SELECTION_CHANGE = 100;
var canMoveCaretBeforeUINode = /* @__PURE__ */ __name((event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight" || // RTL scripts or moving from the end of the previous line
  event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "Home") {
    return true;
  }
  if (isMac && event.key === "a" && event.ctrlKey === true) {
    return true;
  }
  return false;
}, "canMoveCaretBeforeUINode");
var UINode = class extends module_default {
  constructor(quill, options) {
    super(quill, options);
    this.isListening = false;
    this.selectionChangeDeadline = 0;
    this.handleArrowKeys();
    this.handleNavigationShortcuts();
  }
  static {
    __name(this, "UINode");
  }
  handleArrowKeys() {
    this.quill.keyboard.addBinding({
      key: ["ArrowLeft", "ArrowRight"],
      offset: 0,
      shiftKey: null,
      handler(range, { line, event }) {
        if (!(line instanceof ParentBlot3) || !line.uiNode) {
          return true;
        }
        const isRTL = getComputedStyle(line.domNode)["direction"] === "rtl";
        if (isRTL && event.key !== "ArrowRight" || !isRTL && event.key !== "ArrowLeft") {
          return true;
        }
        this.quill.setSelection(
          range.index - 1,
          range.length + (event.shiftKey ? 1 : 0),
          Quill.sources.USER
        );
        return false;
      }
    });
  }
  handleNavigationShortcuts() {
    this.quill.root.addEventListener("keydown", (event) => {
      if (!event.defaultPrevented && canMoveCaretBeforeUINode(event)) {
        this.ensureListeningToSelectionChange();
      }
    });
  }
  /**
   * We only listen to the `selectionchange` event when
   * there is an intention of moving the caret to the beginning using shortcuts.
   * This is primarily implemented to prevent infinite loops, as we are changing
   * the selection within the handler of a `selectionchange` event.
   */
  ensureListeningToSelectionChange() {
    this.selectionChangeDeadline = Date.now() + TTL_FOR_VALID_SELECTION_CHANGE;
    if (this.isListening)
      return;
    this.isListening = true;
    const listener = /* @__PURE__ */ __name(() => {
      this.isListening = false;
      if (Date.now() <= this.selectionChangeDeadline) {
        this.handleSelectionChange();
      }
    }, "listener");
    document.addEventListener("selectionchange", listener, {
      once: true
    });
  }
  handleSelectionChange() {
    const selection = document.getSelection();
    if (!selection)
      return;
    const range = selection.getRangeAt(0);
    if (range.collapsed !== true || range.startOffset !== 0)
      return;
    const line = this.quill.scroll.find(range.startContainer);
    if (!(line instanceof ParentBlot3) || !line.uiNode)
      return;
    const newRange = document.createRange();
    newRange.setStartAfter(line.uiNode);
    newRange.setEndAfter(line.uiNode);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
};
var uiNode_default = UINode;

// src/core.ts
Quill.register({
  "blots/block": Block,
  "blots/block/embed": BlockEmbed,
  "blots/break": break_default,
  "blots/container": container_default,
  "blots/cursor": cursor_default,
  "blots/embed": embed_default,
  "blots/inline": inline_default,
  "blots/scroll": scroll_default,
  "blots/text": Text2,
  "modules/clipboard": Clipboard,
  "modules/history": History,
  "modules/keyboard": Keyboard,
  "modules/uploader": uploader_default,
  "modules/input": input_default,
  "modules/uiNode": uiNode_default
});
var core_default = Quill;

// src/formats/indent.ts
import { ClassAttributor as ClassAttributor8, Scope as Scope17 } from "parchment";
var IndentAttributor = class extends ClassAttributor8 {
  static {
    __name(this, "IndentAttributor");
  }
  add(node, value) {
    let normalizedValue = 0;
    if (value === "+1" || value === "-1") {
      const indent = this.value(node) || 0;
      normalizedValue = value === "+1" ? indent + 1 : indent - 1;
    } else if (typeof value === "number") {
      normalizedValue = value;
    }
    if (normalizedValue === 0) {
      this.remove(node);
      return true;
    }
    return super.add(node, normalizedValue.toString());
  }
  canAdd(node, value) {
    return super.canAdd(node, value) || super.canAdd(node, parseInt(value, 10));
  }
  value(node) {
    return parseInt(super.value(node), 10) || void 0;
  }
};
var IndentClass = new IndentAttributor("indent", "ql-indent", {
  scope: Scope17.BLOCK,
  // @ts-expect-error
  whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
});
var indent_default = IndentClass;

// src/formats/blockquote.ts
var Blockquote = class extends Block {
  static {
    __name(this, "Blockquote");
  }
  static {
    this.blotName = "blockquote";
  }
  static {
    this.tagName = "blockquote";
  }
};
var blockquote_default = Blockquote;

// src/formats/header.ts
var Header = class extends Block {
  static {
    __name(this, "Header");
  }
  static {
    this.blotName = "header";
  }
  static {
    this.tagName = ["H1", "H2", "H3", "H4", "H5", "H6"];
  }
  static formats(domNode) {
    return this.tagName.indexOf(domNode.tagName) + 1;
  }
};
var header_default = Header;

// src/formats/list.ts
var ListContainer = class extends container_default {
  static {
    __name(this, "ListContainer");
  }
};
ListContainer.blotName = "list-container";
ListContainer.tagName = "OL";
var ListItem = class extends Block {
  static {
    __name(this, "ListItem");
  }
  static create(value) {
    const node = super.create();
    node.setAttribute("data-list", value);
    return node;
  }
  static formats(domNode) {
    return domNode.getAttribute("data-list") || void 0;
  }
  static register() {
    Quill.register(ListContainer);
  }
  constructor(scroll, domNode) {
    super(scroll, domNode);
    const ui = domNode.ownerDocument.createElement("span");
    const listEventHandler = /* @__PURE__ */ __name((e) => {
      if (!scroll.isEnabled())
        return;
      const format = this.statics.formats(domNode, scroll);
      if (format === "checked") {
        this.format("list", "unchecked");
        e.preventDefault();
      } else if (format === "unchecked") {
        this.format("list", "checked");
        e.preventDefault();
      }
    }, "listEventHandler");
    ui.addEventListener("mousedown", listEventHandler);
    ui.addEventListener("touchstart", listEventHandler);
    this.attachUI(ui);
  }
  format(name, value) {
    if (name === this.statics.blotName && value) {
      this.domNode.setAttribute("data-list", value);
    } else {
      super.format(name, value);
    }
  }
};
ListItem.blotName = "list";
ListItem.tagName = "LI";
ListContainer.allowedChildren = [ListItem];
ListItem.requiredContainer = ListContainer;

// src/formats/bold.ts
var Bold = class extends inline_default {
  static {
    __name(this, "Bold");
  }
  static {
    this.blotName = "bold";
  }
  static {
    this.tagName = ["STRONG", "B"];
  }
  static create() {
    return super.create();
  }
  static formats() {
    return true;
  }
  optimize(context) {
    super.optimize(context);
    if (this.domNode.tagName !== this.statics.tagName[0]) {
      this.replaceWith(this.statics.blotName);
    }
  }
};
var bold_default = Bold;

// src/formats/italic.ts
var Italic = class extends bold_default {
  static {
    __name(this, "Italic");
  }
  static {
    this.blotName = "italic";
  }
  static {
    this.tagName = ["EM", "I"];
  }
};
var italic_default = Italic;

// src/formats/link.ts
var Link = class extends inline_default {
  static {
    __name(this, "Link");
  }
  static {
    this.blotName = "link";
  }
  static {
    this.tagName = "A";
  }
  static {
    this.SANITIZED_URL = "about:blank";
  }
  static {
    this.PROTOCOL_WHITELIST = ["http", "https", "mailto", "tel", "sms"];
  }
  static create(value) {
    const node = super.create(value);
    node.setAttribute("href", this.sanitize(value));
    node.setAttribute("rel", "noopener noreferrer");
    node.setAttribute("target", "_blank");
    return node;
  }
  static formats(domNode) {
    return domNode.getAttribute("href");
  }
  static sanitize(url) {
    return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL;
  }
  format(name, value) {
    if (name !== this.statics.blotName || !value) {
      super.format(name, value);
    } else {
      this.domNode.setAttribute("href", this.constructor.sanitize(value));
    }
  }
};
function sanitize(url, protocols) {
  const anchor = document.createElement("a");
  anchor.href = url;
  const protocol = anchor.href.slice(0, anchor.href.indexOf(":"));
  return protocols.indexOf(protocol) > -1;
}
__name(sanitize, "sanitize");

// src/formats/script.ts
var Script = class extends inline_default {
  static {
    __name(this, "Script");
  }
  static {
    this.blotName = "script";
  }
  static {
    this.tagName = ["SUB", "SUP"];
  }
  static create(value) {
    if (value === "super") {
      return document.createElement("sup");
    }
    if (value === "sub") {
      return document.createElement("sub");
    }
    return super.create(value);
  }
  static formats(domNode) {
    if (domNode.tagName === "SUB")
      return "sub";
    if (domNode.tagName === "SUP")
      return "super";
    return void 0;
  }
};
var script_default = Script;

// src/formats/strike.ts
var Strike = class extends bold_default {
  static {
    __name(this, "Strike");
  }
  static {
    this.blotName = "strike";
  }
  static {
    this.tagName = ["S", "STRIKE"];
  }
};
var strike_default = Strike;

// src/formats/underline.ts
var Underline = class extends inline_default {
  static {
    __name(this, "Underline");
  }
  static {
    this.blotName = "underline";
  }
  static {
    this.tagName = "U";
  }
};
var underline_default = Underline;

// src/formats/formula.ts
var Formula = class extends embed_default {
  static {
    __name(this, "Formula");
  }
  static {
    this.blotName = "formula";
  }
  static {
    this.className = "ql-formula";
  }
  static {
    this.tagName = "SPAN";
  }
  static create(value) {
    if (window.katex == null) {
      throw new Error("Formula module requires KaTeX.");
    }
    const node = super.create(value);
    if (typeof value === "string") {
      window.katex.render(value, node, {
        throwOnError: false,
        errorColor: "#f00"
      });
      node.setAttribute("data-value", value);
    }
    return node;
  }
  static value(domNode) {
    return domNode.getAttribute("data-value");
  }
  html() {
    const { formula } = this.value();
    return `<span>${formula}</span>`;
  }
};
var formula_default = Formula;

// src/formats/image.ts
import { EmbedBlot as EmbedBlot9 } from "parchment";
var ATTRIBUTES = ["alt", "height", "width"];
var Image = class extends EmbedBlot9 {
  static {
    __name(this, "Image");
  }
  static {
    this.blotName = "image";
  }
  static {
    this.tagName = "IMG";
  }
  static create(value) {
    const node = super.create(value);
    if (typeof value === "string") {
      node.setAttribute("src", this.sanitize(value));
    }
    return node;
  }
  static formats(domNode) {
    return ATTRIBUTES.reduce(
      (formats, attribute) => {
        if (domNode.hasAttribute(attribute)) {
          formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
      },
      {}
    );
  }
  static match(url) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }
  static sanitize(url) {
    return sanitize(url, ["http", "https", "data"]) ? url : "//:0";
  }
  static value(domNode) {
    return domNode.getAttribute("src");
  }
  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
};
var image_default = Image;

// src/formats/video.ts
var ATTRIBUTES2 = ["height", "width"];
var Video = class extends BlockEmbed {
  static {
    __name(this, "Video");
  }
  static {
    this.blotName = "video";
  }
  static {
    this.className = "ql-video";
  }
  static {
    this.tagName = "IFRAME";
  }
  static create(value) {
    const node = super.create(value);
    node.setAttribute("frameborder", "0");
    node.setAttribute("allowfullscreen", "true");
    node.setAttribute("src", this.sanitize(value));
    return node;
  }
  static formats(domNode) {
    return ATTRIBUTES2.reduce(
      (formats, attribute) => {
        if (domNode.hasAttribute(attribute)) {
          formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
      },
      {}
    );
  }
  static sanitize(url) {
    return Link.sanitize(url);
  }
  static value(domNode) {
    return domNode.getAttribute("src");
  }
  format(name, value) {
    if (ATTRIBUTES2.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
  html() {
    const { video } = this.value();
    return `<a href="${video}">${video}</a>`;
  }
};
var video_default = Video;

// src/modules/syntax.ts
import Delta10 from "quill-delta";
import { ClassAttributor as ClassAttributor9, Scope as Scope18 } from "parchment";
var TokenAttributor = new ClassAttributor9("code-token", "hljs", {
  scope: Scope18.INLINE
});
var CodeToken = class _CodeToken extends inline_default {
  static {
    __name(this, "CodeToken");
  }
  static formats(node, scroll) {
    while (node != null && node !== scroll.domNode) {
      if (node.classList && node.classList.contains(CodeBlock.className)) {
        return super.formats(node, scroll);
      }
      node = node.parentNode;
    }
    return void 0;
  }
  constructor(scroll, domNode, value) {
    super(scroll, domNode, value);
    TokenAttributor.add(this.domNode, value);
  }
  format(format, value) {
    if (format !== _CodeToken.blotName) {
      super.format(format, value);
    } else if (value) {
      TokenAttributor.add(this.domNode, value);
    } else {
      TokenAttributor.remove(this.domNode);
      this.domNode.classList.remove(this.statics.className);
    }
  }
  optimize(...args) {
    super.optimize(...args);
    if (!TokenAttributor.value(this.domNode)) {
      this.unwrap();
    }
  }
};
CodeToken.blotName = "code-token";
CodeToken.className = "ql-token";
var SyntaxCodeBlock = class extends CodeBlock {
  static {
    __name(this, "SyntaxCodeBlock");
  }
  static create(value) {
    const domNode = super.create(value);
    if (typeof value === "string") {
      domNode.setAttribute("data-language", value);
    }
    return domNode;
  }
  static formats(domNode) {
    return domNode.getAttribute("data-language") || "plain";
  }
  static register() {
  }
  // Syntax module will register
  format(name, value) {
    if (name === this.statics.blotName && value) {
      this.domNode.setAttribute("data-language", value);
    } else {
      super.format(name, value);
    }
  }
  replaceWith(name, value) {
    this.formatAt(0, this.length(), CodeToken.blotName, false);
    return super.replaceWith(name, value);
  }
};
var SyntaxCodeBlockContainer = class extends CodeBlockContainer {
  static {
    __name(this, "SyntaxCodeBlockContainer");
  }
  attach() {
    super.attach();
    this.forceNext = false;
    this.scroll.emitMount(this);
  }
  format(name, value) {
    if (name === SyntaxCodeBlock.blotName) {
      this.forceNext = true;
      this.children.forEach((child) => {
        child.format(name, value);
      });
    }
  }
  formatAt(index, length, name, value) {
    if (name === SyntaxCodeBlock.blotName) {
      this.forceNext = true;
    }
    super.formatAt(index, length, name, value);
  }
  highlight(highlight2, forced = false) {
    if (this.children.head == null)
      return;
    const nodes = Array.from(this.domNode.childNodes).filter(
      (node) => node !== this.uiNode
    );
    const text = `${nodes.map((node) => node.textContent).join("\n")}
`;
    const language = SyntaxCodeBlock.formats(this.children.head.domNode);
    if (forced || this.forceNext || this.cachedText !== text) {
      if (text.trim().length > 0 || this.cachedText == null) {
        const oldDelta = this.children.reduce((delta2, child) => {
          return delta2.concat(blockDelta(child, false));
        }, new Delta10());
        const delta = highlight2(text, language);
        oldDelta.diff(delta).reduce((index, { retain, attributes }) => {
          if (!retain)
            return index;
          if (attributes) {
            Object.keys(attributes).forEach((format) => {
              if ([SyntaxCodeBlock.blotName, CodeToken.blotName].includes(format)) {
                this.formatAt(index, retain, format, attributes[format]);
              }
            });
          }
          return index + retain;
        }, 0);
      }
      this.cachedText = text;
      this.forceNext = false;
    }
  }
  html(index, length) {
    const [codeBlock] = this.children.find(index);
    const language = codeBlock ? SyntaxCodeBlock.formats(codeBlock.domNode) : "plain";
    return `<pre data-language="${language}">
${escapeText(
      this.code(index, length)
    )}
</pre>`;
  }
  optimize(context) {
    super.optimize(context);
    if (this.parent != null && this.children.head != null && this.uiNode != null) {
      const language = SyntaxCodeBlock.formats(this.children.head.domNode);
      if (language !== this.uiNode.value) {
        this.uiNode.value = language;
      }
    }
  }
};
SyntaxCodeBlockContainer.allowedChildren = [SyntaxCodeBlock];
SyntaxCodeBlock.requiredContainer = SyntaxCodeBlockContainer;
SyntaxCodeBlock.allowedChildren = [CodeToken, cursor_default, Text2, break_default];
var highlight = /* @__PURE__ */ __name((lib, language, text) => {
  if (typeof lib.versionString === "string") {
    const majorVersion = lib.versionString.split(".")[0];
    if (parseInt(majorVersion, 10) >= 11) {
      return lib.highlight(text, { language }).value;
    }
  }
  return lib.highlight(language, text).value;
}, "highlight");
var Syntax = class extends module_default {
  static {
    __name(this, "Syntax");
  }
  static register() {
    Quill.register(CodeToken, true);
    Quill.register(SyntaxCodeBlock, true);
    Quill.register(SyntaxCodeBlockContainer, true);
  }
  constructor(quill, options) {
    super(quill, options);
    if (this.options.hljs == null) {
      throw new Error(
        "Syntax module requires highlight.js. Please include the library on the page before Quill."
      );
    }
    this.languages = this.options.languages.reduce(
      (memo, { key }) => {
        memo[key] = true;
        return memo;
      },
      {}
    );
    this.highlightBlot = this.highlightBlot.bind(this);
    this.initListener();
    this.initTimer();
  }
  initListener() {
    this.quill.on(Quill.events.SCROLL_BLOT_MOUNT, (blot) => {
      if (!(blot instanceof SyntaxCodeBlockContainer))
        return;
      const select = this.quill.root.ownerDocument.createElement("select");
      this.options.languages.forEach(({ key, label }) => {
        const option = select.ownerDocument.createElement("option");
        option.textContent = label;
        option.setAttribute("value", key);
        select.appendChild(option);
      });
      select.addEventListener("change", () => {
        blot.format(SyntaxCodeBlock.blotName, select.value);
        this.quill.root.focus();
        this.highlight(blot, true);
      });
      if (blot.uiNode == null) {
        blot.attachUI(select);
        if (blot.children.head) {
          select.value = SyntaxCodeBlock.formats(blot.children.head.domNode);
        }
      }
    });
  }
  initTimer() {
    let timer = null;
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        this.highlight();
        timer = null;
      }, this.options.interval);
    });
  }
  highlight(blot = null, force = false) {
    if (this.quill.selection.composing)
      return;
    this.quill.update(Quill.sources.USER);
    const range = this.quill.getSelection();
    const blots = blot == null ? this.quill.scroll.descendants(SyntaxCodeBlockContainer) : [blot];
    blots.forEach((container) => {
      container.highlight(this.highlightBlot, force);
    });
    this.quill.update(Quill.sources.SILENT);
    if (range != null) {
      this.quill.setSelection(range, Quill.sources.SILENT);
    }
  }
  highlightBlot(text, language = "plain") {
    language = this.languages[language] ? language : "plain";
    if (language === "plain") {
      return escapeText(text).split("\n").reduce((delta, line, i) => {
        if (i !== 0) {
          delta.insert("\n", { [CodeBlock.blotName]: language });
        }
        return delta.insert(line);
      }, new Delta10());
    }
    const container = this.quill.root.ownerDocument.createElement("div");
    container.classList.add(CodeBlock.className);
    container.innerHTML = highlight(this.options.hljs, language, text);
    return traverse(
      this.quill.scroll,
      container,
      [
        (node, delta) => {
          const value = TokenAttributor.value(node);
          if (value) {
            return delta.compose(
              new Delta10().retain(delta.length(), {
                [CodeToken.blotName]: value
              })
            );
          }
          return delta;
        }
      ],
      [
        (node, delta) => {
          return node.data.split("\n").reduce((memo, nodeText, i) => {
            if (i !== 0)
              memo.insert("\n", { [CodeBlock.blotName]: language });
            return memo.insert(nodeText);
          }, delta);
        }
      ],
      /* @__PURE__ */ new WeakMap()
    );
  }
};
Syntax.DEFAULTS = {
  hljs: (() => {
    return window.hljs;
  })(),
  interval: 1e3,
  languages: [
    { key: "plain", label: "Plain" },
    { key: "bash", label: "Bash" },
    { key: "cpp", label: "C++" },
    { key: "cs", label: "C#" },
    { key: "css", label: "CSS" },
    { key: "diff", label: "Diff" },
    { key: "xml", label: "HTML/XML" },
    { key: "java", label: "Java" },
    { key: "javascript", label: "JavaScript" },
    { key: "markdown", label: "Markdown" },
    { key: "php", label: "PHP" },
    { key: "python", label: "Python" },
    { key: "ruby", label: "Ruby" },
    { key: "sql", label: "SQL" }
  ]
};

// src/modules/table.ts
import Delta11 from "quill-delta";

// src/formats/table.ts
var TableCell = class _TableCell extends Block {
  static {
    __name(this, "TableCell");
  }
  static {
    this.blotName = "table";
  }
  static {
    this.tagName = "TD";
  }
  static create(value) {
    const node = super.create();
    if (value) {
      node.setAttribute("data-row", value);
    } else {
      node.setAttribute("data-row", tableId());
    }
    return node;
  }
  static formats(domNode) {
    if (domNode.hasAttribute("data-row")) {
      return domNode.getAttribute("data-row");
    }
    return void 0;
  }
  cellOffset() {
    if (this.parent) {
      return this.parent.children.indexOf(this);
    }
    return -1;
  }
  format(name, value) {
    if (name === _TableCell.blotName && value) {
      this.domNode.setAttribute("data-row", value);
    } else {
      super.format(name, value);
    }
  }
  row() {
    return this.parent;
  }
  rowOffset() {
    if (this.row()) {
      return this.row().rowOffset();
    }
    return -1;
  }
  table() {
    return this.row() && this.row().table();
  }
};
var TableRow = class extends container_default {
  static {
    __name(this, "TableRow");
  }
  static {
    this.blotName = "table-row";
  }
  static {
    this.tagName = "TR";
  }
  checkMerge() {
    if (super.checkMerge() && this.next.children.head != null) {
      const thisHead = this.children.head.formats();
      const thisTail = this.children.tail.formats();
      const nextHead = this.next.children.head.formats();
      const nextTail = this.next.children.tail.formats();
      return thisHead.table === thisTail.table && thisHead.table === nextHead.table && thisHead.table === nextTail.table;
    }
    return false;
  }
  optimize(context) {
    super.optimize(context);
    this.children.forEach((child) => {
      if (child.next == null)
        return;
      const childFormats = child.formats();
      const nextFormats = child.next.formats();
      if (childFormats.table !== nextFormats.table) {
        const next = this.splitAfter(child);
        if (next) {
          next.optimize();
        }
        if (this.prev) {
          this.prev.optimize();
        }
      }
    });
  }
  rowOffset() {
    if (this.parent) {
      return this.parent.children.indexOf(this);
    }
    return -1;
  }
  table() {
    return this.parent && this.parent.parent;
  }
};
var TableBody = class extends container_default {
  static {
    __name(this, "TableBody");
  }
  static {
    this.blotName = "table-body";
  }
  static {
    this.tagName = "TBODY";
  }
};
var TableContainer = class extends container_default {
  static {
    __name(this, "TableContainer");
  }
  static {
    this.blotName = "table-container";
  }
  static {
    this.tagName = "TABLE";
  }
  balanceCells() {
    const rows = this.descendants(TableRow);
    const maxColumns = rows.reduce((max, row) => {
      return Math.max(row.children.length, max);
    }, 0);
    rows.forEach((row) => {
      new Array(maxColumns - row.children.length).fill(0).forEach(() => {
        let value;
        if (row.children.head != null) {
          value = TableCell.formats(row.children.head.domNode);
        }
        const blot = this.scroll.create(TableCell.blotName, value);
        row.appendChild(blot);
        blot.optimize();
      });
    });
  }
  cells(column) {
    return this.rows().map((row) => row.children.at(column));
  }
  deleteColumn(index) {
    const [body] = this.descendant(TableBody);
    if (body == null || body.children.head == null)
      return;
    body.children.forEach((row) => {
      const cell = row.children.at(index);
      if (cell != null) {
        cell.remove();
      }
    });
  }
  insertColumn(index) {
    const [body] = this.descendant(TableBody);
    if (body == null || body.children.head == null)
      return;
    body.children.forEach((row) => {
      const ref = row.children.at(index);
      const value = TableCell.formats(row.children.head.domNode);
      const cell = this.scroll.create(TableCell.blotName, value);
      row.insertBefore(cell, ref);
    });
  }
  insertRow(index) {
    const [body] = this.descendant(TableBody);
    if (body == null || body.children.head == null)
      return;
    const id = tableId();
    const row = this.scroll.create(TableRow.blotName);
    body.children.head.children.forEach(() => {
      const cell = this.scroll.create(TableCell.blotName, id);
      row.appendChild(cell);
    });
    const ref = body.children.at(index);
    body.insertBefore(row, ref);
  }
  rows() {
    const body = this.children.head;
    if (body == null)
      return [];
    return body.children.map((row) => row);
  }
};
TableContainer.allowedChildren = [TableBody];
TableBody.requiredContainer = TableContainer;
TableBody.allowedChildren = [TableRow];
TableRow.requiredContainer = TableBody;
TableRow.allowedChildren = [TableCell];
TableCell.requiredContainer = TableRow;
function tableId() {
  const id = Math.random().toString(36).slice(2, 6);
  return `row-${id}`;
}
__name(tableId, "tableId");

// src/modules/table.ts
var Table = class extends module_default {
  static {
    __name(this, "Table");
  }
  static register() {
    Quill.register(TableCell);
    Quill.register(TableRow);
    Quill.register(TableBody);
    Quill.register(TableContainer);
  }
  constructor(...args) {
    super(...args);
    this.listenBalanceCells();
  }
  balanceTables() {
    this.quill.scroll.descendants(TableContainer).forEach((table) => {
      table.balanceCells();
    });
  }
  deleteColumn() {
    const [table, , cell] = this.getTable();
    if (cell == null)
      return;
    table.deleteColumn(cell.cellOffset());
    this.quill.update(Quill.sources.USER);
  }
  deleteRow() {
    const [, row] = this.getTable();
    if (row == null)
      return;
    row.remove();
    this.quill.update(Quill.sources.USER);
  }
  deleteTable() {
    const [table] = this.getTable();
    if (table == null)
      return;
    const offset = table.offset();
    table.remove();
    this.quill.update(Quill.sources.USER);
    this.quill.setSelection(offset, Quill.sources.SILENT);
  }
  getTable(range = this.quill.getSelection()) {
    if (range == null)
      return [null, null, null, -1];
    const [cell, offset] = this.quill.getLine(range.index);
    if (cell == null || cell.statics.blotName !== TableCell.blotName) {
      return [null, null, null, -1];
    }
    const row = cell.parent;
    const table = row.parent.parent;
    return [table, row, cell, offset];
  }
  insertColumn(offset) {
    const range = this.quill.getSelection();
    if (!range)
      return;
    const [table, row, cell] = this.getTable(range);
    if (cell == null)
      return;
    const column = cell.cellOffset();
    table.insertColumn(column + offset);
    this.quill.update(Quill.sources.USER);
    let shift = row.rowOffset();
    if (offset === 0) {
      shift += 1;
    }
    this.quill.setSelection(
      range.index + shift,
      range.length,
      Quill.sources.SILENT
    );
  }
  insertColumnLeft() {
    this.insertColumn(0);
  }
  insertColumnRight() {
    this.insertColumn(1);
  }
  insertRow(offset) {
    const range = this.quill.getSelection();
    if (!range)
      return;
    const [table, row, cell] = this.getTable(range);
    if (cell == null)
      return;
    const index = row.rowOffset();
    table.insertRow(index + offset);
    this.quill.update(Quill.sources.USER);
    if (offset > 0) {
      this.quill.setSelection(range, Quill.sources.SILENT);
    } else {
      this.quill.setSelection(
        range.index + row.children.length,
        range.length,
        Quill.sources.SILENT
      );
    }
  }
  insertRowAbove() {
    this.insertRow(0);
  }
  insertRowBelow() {
    this.insertRow(1);
  }
  insertTable(rows, columns) {
    const range = this.quill.getSelection();
    if (range == null)
      return;
    const delta = new Array(rows).fill(0).reduce((memo) => {
      const text = new Array(columns).fill("\n").join("");
      return memo.insert(text, { table: tableId() });
    }, new Delta11().retain(range.index));
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.setSelection(range.index, Quill.sources.SILENT);
    this.balanceTables();
  }
  listenBalanceCells() {
    this.quill.on(
      Quill.events.SCROLL_OPTIMIZE,
      (mutations) => {
        mutations.some((mutation) => {
          if (["TD", "TR", "TBODY", "TABLE"].includes(
            mutation.target.tagName
          )) {
            this.quill.once(Quill.events.TEXT_CHANGE, (delta, old, source) => {
              if (source !== Quill.sources.USER)
                return;
              this.balanceTables();
            });
            return true;
          }
          return false;
        });
      }
    );
  }
};
var table_default = Table;

// src/modules/toolbar.ts
import Delta12 from "quill-delta";
import { EmbedBlot as EmbedBlot10, Scope as Scope19 } from "parchment";
var debug7 = logger_default("quill:toolbar");
var Toolbar = class extends module_default {
  static {
    __name(this, "Toolbar");
  }
  constructor(quill, options) {
    super(quill, options);
    if (Array.isArray(this.options.container)) {
      const container = document.createElement("div");
      container.setAttribute("role", "toolbar");
      addControls(container, this.options.container);
      quill.container?.parentNode?.insertBefore(container, quill.container);
      this.container = container;
    } else if (typeof this.options.container === "string") {
      this.container = document.querySelector(this.options.container);
    } else {
      this.container = this.options.container;
    }
    if (!(this.container instanceof HTMLElement)) {
      debug7.error("Container required for toolbar", this.options);
      return;
    }
    this.container.classList.add("ql-toolbar");
    this.controls = [];
    this.handlers = {};
    if (this.options.handlers) {
      Object.keys(this.options.handlers).forEach((format) => {
        const handler = this.options.handlers?.[format];
        if (handler) {
          this.addHandler(format, handler);
        }
      });
    }
    Array.from(this.container.querySelectorAll("button, select")).forEach(
      (input) => {
        this.attach(input);
      }
    );
    this.quill.on(Quill.events.EDITOR_CHANGE, () => {
      const [range] = this.quill.selection.getRange();
      this.update(range);
    });
  }
  addHandler(format, handler) {
    this.handlers[format] = handler;
  }
  attach(input) {
    let format = Array.from(input.classList).find((className) => {
      return className.indexOf("ql-") === 0;
    });
    if (!format)
      return;
    format = format.slice("ql-".length);
    if (input.tagName === "BUTTON") {
      input.setAttribute("type", "button");
    }
    if (this.handlers[format] == null && this.quill.scroll.query(format) == null) {
      debug7.warn("ignoring attaching to nonexistent format", format, input);
      return;
    }
    const eventName = input.tagName === "SELECT" ? "change" : "click";
    input.addEventListener(eventName, (e) => {
      let value;
      if (input.tagName === "SELECT") {
        if (input.selectedIndex < 0)
          return;
        const selected = input.options[input.selectedIndex];
        if (selected.hasAttribute("selected")) {
          value = false;
        } else {
          value = selected.value || false;
        }
      } else {
        if (input.classList.contains("ql-active")) {
          value = false;
        } else {
          value = input.value || !input.hasAttribute("value");
        }
        e.preventDefault();
      }
      this.quill.focus();
      const [range] = this.quill.selection.getRange();
      if (this.handlers[format] != null) {
        this.handlers[format].call(this, value);
      } else if (
        // @ts-expect-error
        this.quill.scroll.query(format).prototype instanceof EmbedBlot10
      ) {
        value = prompt(`Enter ${format}`);
        if (!value)
          return;
        this.quill.updateContents(
          new Delta12().retain(range.index).delete(range.length).insert({ [format]: value }),
          Quill.sources.USER
        );
      } else {
        this.quill.format(format, value, Quill.sources.USER);
      }
      this.update(range);
    });
    this.controls.push([format, input]);
  }
  update(range) {
    const formats = range == null ? {} : this.quill.getFormat(range);
    this.controls.forEach((pair) => {
      const [format, input] = pair;
      if (input.tagName === "SELECT") {
        let option = null;
        if (range == null) {
          option = null;
        } else if (formats[format] == null) {
          option = input.querySelector("option[selected]");
        } else if (!Array.isArray(formats[format])) {
          let value = formats[format];
          if (typeof value === "string") {
            value = value.replace(/"/g, '\\"');
          }
          option = input.querySelector(`option[value="${value}"]`);
        }
        if (option == null) {
          input.value = "";
          input.selectedIndex = -1;
        } else {
          option.selected = true;
        }
      } else if (range == null) {
        input.classList.remove("ql-active");
        input.setAttribute("aria-pressed", "false");
      } else if (input.hasAttribute("value")) {
        const value = formats[format];
        const isActive = value === input.getAttribute("value") || value != null && value.toString() === input.getAttribute("value") || value == null && !input.getAttribute("value");
        input.classList.toggle("ql-active", isActive);
        input.setAttribute("aria-pressed", isActive.toString());
      } else {
        const isActive = formats[format] != null;
        input.classList.toggle("ql-active", isActive);
        input.setAttribute("aria-pressed", isActive.toString());
      }
    });
  }
};
Toolbar.DEFAULTS = {};
function addButton(container, format, value) {
  const input = document.createElement("button");
  input.setAttribute("type", "button");
  input.classList.add(`ql-${format}`);
  input.setAttribute("aria-pressed", "false");
  if (value != null) {
    input.value = value;
    input.setAttribute("aria-label", `${format}: ${value}`);
  } else {
    input.setAttribute("aria-label", format);
  }
  container.appendChild(input);
}
__name(addButton, "addButton");
function addControls(container, groups) {
  if (!Array.isArray(groups[0])) {
    groups = [groups];
  }
  groups.forEach((controls) => {
    const group = document.createElement("span");
    group.classList.add("ql-formats");
    controls.forEach((control) => {
      if (typeof control === "string") {
        addButton(group, control);
      } else {
        const format = Object.keys(control)[0];
        const value = control[format];
        if (Array.isArray(value)) {
          addSelect(group, format, value);
        } else {
          addButton(group, format, value);
        }
      }
    });
    container.appendChild(group);
  });
}
__name(addControls, "addControls");
function addSelect(container, format, values) {
  const input = document.createElement("select");
  input.classList.add(`ql-${format}`);
  values.forEach((value) => {
    const option = document.createElement("option");
    if (value !== false) {
      option.setAttribute("value", String(value));
    } else {
      option.setAttribute("selected", "selected");
    }
    input.appendChild(option);
  });
  container.appendChild(input);
}
__name(addSelect, "addSelect");
Toolbar.DEFAULTS = {
  container: null,
  handlers: {
    clean() {
      const range = this.quill.getSelection();
      if (range == null)
        return;
      if (range.length === 0) {
        const formats = this.quill.getFormat();
        Object.keys(formats).forEach((name) => {
          if (this.quill.scroll.query(name, Scope19.INLINE) != null) {
            this.quill.format(name, false, Quill.sources.USER);
          }
        });
      } else {
        this.quill.removeFormat(range, Quill.sources.USER);
      }
    },
    direction(value) {
      const { align } = this.quill.getFormat();
      if (value === "rtl" && align == null) {
        this.quill.format("align", "right", Quill.sources.USER);
      } else if (!value && align === "right") {
        this.quill.format("align", false, Quill.sources.USER);
      }
      this.quill.format("direction", value, Quill.sources.USER);
    },
    indent(value) {
      const range = this.quill.getSelection();
      const formats = this.quill.getFormat(range);
      const indent = parseInt(formats.indent || 0, 10);
      if (value === "+1" || value === "-1") {
        let modifier = value === "+1" ? 1 : -1;
        if (formats.direction === "rtl")
          modifier *= -1;
        this.quill.format("indent", indent + modifier, Quill.sources.USER);
      }
    },
    link(value) {
      if (value === true) {
        value = prompt("Enter link URL:");
      }
      this.quill.format("link", value, Quill.sources.USER);
    },
    list(value) {
      const range = this.quill.getSelection();
      const formats = this.quill.getFormat(range);
      if (value === "check") {
        if (formats.list === "checked" || formats.list === "unchecked") {
          this.quill.format("list", false, Quill.sources.USER);
        } else {
          this.quill.format("list", "unchecked", Quill.sources.USER);
        }
      } else {
        this.quill.format("list", value, Quill.sources.USER);
      }
    }
  }
};

// src/ui/icons.ts
import alignLeftIcon from "./align-left-5RII7WYO.svg";
import alignCenterIcon from "./align-center-KQXTGOWC.svg";
import alignRightIcon from "./align-right-4BY2NIB2.svg";
import alignJustifyIcon from "./align-justify-ICORBCZG.svg";
import backgroundIcon from "./background-SRKNDFVY.svg";
import blockquoteIcon from "./blockquote-B3MCMW2L.svg";
import boldIcon from "./bold-AFOFJHDH.svg";
import cleanIcon from "./clean-OFC5JCAE.svg";
import codeIcon from "./code-74UPI3JM.svg";
import colorIcon from "./color-HWSGCL5R.svg";
import directionLeftToRightIcon from "./direction-ltr-VLP2JFYA.svg";
import directionRightToLeftIcon from "./direction-rtl-LLGDZKLX.svg";
import formulaIcon from "./formula-B2YNCXIQ.svg";
import headerIcon from "./header-5OXEYHZ6.svg";
import header2Icon from "./header-2-R7XNDHGX.svg";
import header3Icon from "./header-3-BKMPS7YA.svg";
import header4Icon from "./header-4-LM4RNT5I.svg";
import header5Icon from "./header-5-IS34TVSL.svg";
import header6Icon from "./header-6-IMANRN5X.svg";
import italicIcon from "./italic-6QWSKCQY.svg";
import imageIcon from "./image-DNNT56TD.svg";
import indentIcon from "./indent-VYLC4CW5.svg";
import outdentIcon from "./outdent-CN7E5RMY.svg";
import linkIcon from "./link-EP4BRSPK.svg";
import listBulletIcon from "./list-bullet-H2TE7M2N.svg";
import listCheckIcon from "./list-check-43XPS6DN.svg";
import listOrderedIcon from "./list-ordered-BGWU4TBS.svg";
import subscriptIcon from "./subscript-YW66A3ME.svg";
import superscriptIcon from "./superscript-F2ASDCRY.svg";
import strikeIcon from "./strike-4UW3LJ6O.svg";
import tableIcon from "./table-YL3TOCSZ.svg";
import underlineIcon from "./underline-Y6FLNWGA.svg";
import videoIcon from "./video-XTD3CXMV.svg";
var icons_default = {
  align: {
    "": alignLeftIcon,
    center: alignCenterIcon,
    right: alignRightIcon,
    justify: alignJustifyIcon
  },
  background: backgroundIcon,
  blockquote: blockquoteIcon,
  bold: boldIcon,
  clean: cleanIcon,
  code: codeIcon,
  "code-block": codeIcon,
  color: colorIcon,
  direction: {
    "": directionLeftToRightIcon,
    rtl: directionRightToLeftIcon
  },
  formula: formulaIcon,
  header: {
    "1": headerIcon,
    "2": header2Icon,
    "3": header3Icon,
    "4": header4Icon,
    "5": header5Icon,
    "6": header6Icon
  },
  italic: italicIcon,
  image: imageIcon,
  indent: {
    "+1": indentIcon,
    "-1": outdentIcon
  },
  link: linkIcon,
  list: {
    bullet: listBulletIcon,
    check: listCheckIcon,
    ordered: listOrderedIcon
  },
  script: {
    sub: subscriptIcon,
    super: superscriptIcon
  },
  strike: strikeIcon,
  table: tableIcon,
  underline: underlineIcon,
  video: videoIcon
};

// src/ui/picker.ts
import DropdownIcon from "./dropdown-XXSR6BZN.svg";
var optionsCounter = 0;
function toggleAriaAttribute(element, attribute) {
  element.setAttribute(
    attribute,
    `${!(element.getAttribute(attribute) === "true")}`
  );
}
__name(toggleAriaAttribute, "toggleAriaAttribute");
var Picker = class {
  static {
    __name(this, "Picker");
  }
  constructor(select) {
    this.select = select;
    this.container = document.createElement("span");
    this.buildPicker();
    this.select.style.display = "none";
    this.select.parentNode.insertBefore(this.container, this.select);
    this.label.addEventListener("mousedown", () => {
      this.togglePicker();
    });
    this.label.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Enter":
          this.togglePicker();
          break;
        case "Escape":
          this.escape();
          event.preventDefault();
          break;
        default:
      }
    });
    this.select.addEventListener("change", this.update.bind(this));
  }
  togglePicker() {
    this.container.classList.toggle("ql-expanded");
    toggleAriaAttribute(this.label, "aria-expanded");
    toggleAriaAttribute(this.options, "aria-hidden");
  }
  buildItem(option) {
    const item = document.createElement("span");
    item.tabIndex = "0";
    item.setAttribute("role", "button");
    item.classList.add("ql-picker-item");
    const value = option.getAttribute("value");
    if (value) {
      item.setAttribute("data-value", value);
    }
    if (option.textContent) {
      item.setAttribute("data-label", option.textContent);
    }
    item.addEventListener("click", () => {
      this.selectItem(item, true);
    });
    item.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Enter":
          this.selectItem(item, true);
          event.preventDefault();
          break;
        case "Escape":
          this.escape();
          event.preventDefault();
          break;
        default:
      }
    });
    return item;
  }
  buildLabel() {
    const label = document.createElement("span");
    label.classList.add("ql-picker-label");
    label.innerHTML = DropdownIcon;
    label.tabIndex = "0";
    label.setAttribute("role", "button");
    label.setAttribute("aria-expanded", "false");
    this.container.appendChild(label);
    return label;
  }
  buildOptions() {
    const options = document.createElement("span");
    options.classList.add("ql-picker-options");
    options.setAttribute("aria-hidden", "true");
    options.tabIndex = "-1";
    options.id = `ql-picker-options-${optionsCounter}`;
    optionsCounter += 1;
    this.label.setAttribute("aria-controls", options.id);
    this.options = options;
    Array.from(this.select.options).forEach((option) => {
      const item = this.buildItem(option);
      options.appendChild(item);
      if (option.selected === true) {
        this.selectItem(item);
      }
    });
    this.container.appendChild(options);
  }
  buildPicker() {
    Array.from(this.select.attributes).forEach((item) => {
      this.container.setAttribute(item.name, item.value);
    });
    this.container.classList.add("ql-picker");
    this.label = this.buildLabel();
    this.buildOptions();
  }
  escape() {
    this.close();
    setTimeout(() => this.label.focus(), 1);
  }
  close() {
    this.container.classList.remove("ql-expanded");
    this.label.setAttribute("aria-expanded", "false");
    this.options.setAttribute("aria-hidden", "true");
  }
  selectItem(item, trigger = false) {
    const selected = this.container.querySelector(".ql-selected");
    if (item === selected)
      return;
    if (selected != null) {
      selected.classList.remove("ql-selected");
    }
    if (item == null)
      return;
    item.classList.add("ql-selected");
    this.select.selectedIndex = Array.from(item.parentNode.children).indexOf(
      item
    );
    if (item.hasAttribute("data-value")) {
      this.label.setAttribute("data-value", item.getAttribute("data-value"));
    } else {
      this.label.removeAttribute("data-value");
    }
    if (item.hasAttribute("data-label")) {
      this.label.setAttribute("data-label", item.getAttribute("data-label"));
    } else {
      this.label.removeAttribute("data-label");
    }
    if (trigger) {
      this.select.dispatchEvent(new Event("change"));
      this.close();
    }
  }
  update() {
    let option;
    if (this.select.selectedIndex > -1) {
      const item = (
        // @ts-expect-error Fix me later
        this.container.querySelector(".ql-picker-options").children[this.select.selectedIndex]
      );
      option = this.select.options[this.select.selectedIndex];
      this.selectItem(item);
    } else {
      this.selectItem(null);
    }
    const isActive = option != null && option !== this.select.querySelector("option[selected]");
    this.label.classList.toggle("ql-active", isActive);
  }
};
var picker_default = Picker;

// src/ui/color-picker.ts
var ColorPicker = class extends picker_default {
  static {
    __name(this, "ColorPicker");
  }
  constructor(select, label) {
    super(select);
    this.label.innerHTML = label;
    this.container.classList.add("ql-color-picker");
    Array.from(this.container.querySelectorAll(".ql-picker-item")).slice(0, 7).forEach((item) => {
      item.classList.add("ql-primary");
    });
  }
  buildItem(option) {
    const item = super.buildItem(option);
    item.style.backgroundColor = option.getAttribute("value") || "";
    return item;
  }
  selectItem(item, trigger) {
    super.selectItem(item, trigger);
    const colorLabel = this.label.querySelector(".ql-color-label");
    const value = item ? item.getAttribute("data-value") || "" : "";
    if (colorLabel) {
      if (colorLabel.tagName === "line") {
        colorLabel.style.stroke = value;
      } else {
        colorLabel.style.fill = value;
      }
    }
  }
};
var color_picker_default = ColorPicker;

// src/ui/icon-picker.ts
var IconPicker = class extends picker_default {
  static {
    __name(this, "IconPicker");
  }
  constructor(select, icons) {
    super(select);
    this.container.classList.add("ql-icon-picker");
    Array.from(this.container.querySelectorAll(".ql-picker-item")).forEach(
      (item) => {
        item.innerHTML = icons[item.getAttribute("data-value") || ""];
      }
    );
    this.defaultItem = this.container.querySelector(".ql-selected");
    this.selectItem(this.defaultItem);
  }
  selectItem(target, trigger) {
    super.selectItem(target, trigger);
    const item = target || this.defaultItem;
    if (item != null) {
      if (this.label.innerHTML === item.innerHTML)
        return;
      this.label.innerHTML = item.innerHTML;
    }
  }
};
var icon_picker_default = IconPicker;

// src/ui/tooltip.ts
var isScrollable = /* @__PURE__ */ __name((el) => {
  const { overflowY } = getComputedStyle(el, null);
  return overflowY !== "visible" && overflowY !== "clip";
}, "isScrollable");
var Tooltip = class {
  static {
    __name(this, "Tooltip");
  }
  constructor(quill, boundsContainer) {
    this.quill = quill;
    this.boundsContainer = boundsContainer || document.body;
    this.root = quill.addContainer("ql-tooltip");
    this.root.innerHTML = this.constructor.TEMPLATE;
    if (isScrollable(this.quill.root)) {
      this.quill.root.addEventListener("scroll", () => {
        this.root.style.marginTop = `${-1 * this.quill.root.scrollTop}px`;
      });
    }
    this.hide();
  }
  hide() {
    this.root.classList.add("ql-hidden");
  }
  position(reference) {
    const left = reference.left + reference.width / 2 - this.root.offsetWidth / 2;
    const top = reference.bottom + this.quill.root.scrollTop;
    this.root.style.left = `${left}px`;
    this.root.style.top = `${top}px`;
    this.root.classList.remove("ql-flip");
    const containerBounds = this.boundsContainer.getBoundingClientRect();
    const rootBounds = this.root.getBoundingClientRect();
    let shift = 0;
    if (rootBounds.right > containerBounds.right) {
      shift = containerBounds.right - rootBounds.right;
      this.root.style.left = `${left + shift}px`;
    }
    if (rootBounds.left < containerBounds.left) {
      shift = containerBounds.left - rootBounds.left;
      this.root.style.left = `${left + shift}px`;
    }
    if (rootBounds.bottom > containerBounds.bottom) {
      const height = rootBounds.bottom - rootBounds.top;
      const verticalShift = reference.bottom - reference.top + height;
      this.root.style.top = `${top - verticalShift}px`;
      this.root.classList.add("ql-flip");
    }
    return shift;
  }
  show() {
    this.root.classList.remove("ql-editing");
    this.root.classList.remove("ql-hidden");
  }
};
var tooltip_default = Tooltip;

// src/themes/base.ts
var ALIGNS = [false, "center", "right", "justify"];
var COLORS = [
  "#000000",
  "#e60000",
  "#ff9900",
  "#ffff00",
  "#008a00",
  "#0066cc",
  "#9933ff",
  "#ffffff",
  "#facccc",
  "#ffebcc",
  "#ffffcc",
  "#cce8cc",
  "#cce0f5",
  "#ebd6ff",
  "#bbbbbb",
  "#f06666",
  "#ffc266",
  "#ffff66",
  "#66b966",
  "#66a3e0",
  "#c285ff",
  "#888888",
  "#a10000",
  "#b26b00",
  "#b2b200",
  "#006100",
  "#0047b2",
  "#6b24b2",
  "#444444",
  "#5c0000",
  "#663d00",
  "#666600",
  "#003700",
  "#002966",
  "#3d1466"
];
var FONTS = [false, "serif", "monospace"];
var HEADERS = ["1", "2", "3", false];
var SIZES = ["small", false, "large", "huge"];
var BaseTheme = class extends theme_default {
  static {
    __name(this, "BaseTheme");
  }
  constructor(quill, options) {
    super(quill, options);
    const listener = /* @__PURE__ */ __name((e) => {
      if (!document.body.contains(quill.root)) {
        document.body.removeEventListener("click", listener);
        return;
      }
      if (this.tooltip != null && // @ts-expect-error
      !this.tooltip.root.contains(e.target) && // @ts-expect-error
      document.activeElement !== this.tooltip.textbox && !this.quill.hasFocus()) {
        this.tooltip.hide();
      }
      if (this.pickers != null) {
        this.pickers.forEach((picker) => {
          if (!picker.container.contains(e.target)) {
            picker.close();
          }
        });
      }
    }, "listener");
    quill.emitter.listenDOM("click", document.body, listener);
  }
  addModule(name) {
    const module2 = super.addModule(name);
    if (name === "toolbar") {
      this.extendToolbar(module2);
    }
    return module2;
  }
  buildButtons(buttons, icons) {
    Array.from(buttons).forEach((button) => {
      const className = button.getAttribute("class") || "";
      className.split(/\s+/).forEach((name) => {
        if (!name.startsWith("ql-"))
          return;
        name = name.slice("ql-".length);
        if (icons[name] == null)
          return;
        if (name === "direction") {
          button.innerHTML = icons[name][""] + icons[name].rtl;
        } else if (typeof icons[name] === "string") {
          button.innerHTML = icons[name];
        } else {
          const value = button.value || "";
          if (value != null && icons[name][value]) {
            button.innerHTML = icons[name][value];
          }
        }
      });
    });
  }
  buildPickers(selects, icons) {
    this.pickers = Array.from(selects).map((select) => {
      if (select.classList.contains("ql-align")) {
        if (select.querySelector("option") == null) {
          fillSelect(select, ALIGNS);
        }
        if (typeof icons.align === "object") {
          return new icon_picker_default(select, icons.align);
        }
      }
      if (select.classList.contains("ql-background") || select.classList.contains("ql-color")) {
        const format = select.classList.contains("ql-background") ? "background" : "color";
        if (select.querySelector("option") == null) {
          fillSelect(
            select,
            COLORS,
            format === "background" ? "#ffffff" : "#000000"
          );
        }
        return new color_picker_default(select, icons[format]);
      }
      if (select.querySelector("option") == null) {
        if (select.classList.contains("ql-font")) {
          fillSelect(select, FONTS);
        } else if (select.classList.contains("ql-header")) {
          fillSelect(select, HEADERS);
        } else if (select.classList.contains("ql-size")) {
          fillSelect(select, SIZES);
        }
      }
      return new picker_default(select);
    });
    const update = /* @__PURE__ */ __name(() => {
      this.pickers.forEach((picker) => {
        picker.update();
      });
    }, "update");
    this.quill.on(emitter_default.events.EDITOR_CHANGE, update);
  }
};
BaseTheme.DEFAULTS = merge_default({}, theme_default.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        formula() {
          this.quill.theme.tooltip.edit("formula");
        },
        image() {
          let fileInput = this.container.querySelector(
            "input.ql-image[type=file]"
          );
          if (fileInput == null) {
            fileInput = document.createElement("input");
            fileInput.setAttribute("type", "file");
            fileInput.setAttribute(
              "accept",
              this.quill.uploader.options.mimetypes.join(", ")
            );
            fileInput.classList.add("ql-image");
            fileInput.addEventListener("change", () => {
              const range = this.quill.getSelection(true);
              this.quill.uploader.upload(range, fileInput.files);
              fileInput.value = "";
            });
            this.container.appendChild(fileInput);
          }
          fileInput.click();
        },
        video() {
          this.quill.theme.tooltip.edit("video");
        }
      }
    }
  }
});
var BaseTooltip = class extends tooltip_default {
  static {
    __name(this, "BaseTooltip");
  }
  constructor(quill, boundsContainer) {
    super(quill, boundsContainer);
    this.textbox = this.root.querySelector('input[type="text"]');
    this.listen();
  }
  listen() {
    this.textbox.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.save();
        event.preventDefault();
      } else if (event.key === "Escape") {
        this.cancel();
        event.preventDefault();
      }
    });
  }
  cancel() {
    this.hide();
    this.restoreFocus();
  }
  edit(mode = "link", preview = null) {
    this.root.classList.remove("ql-hidden");
    this.root.classList.add("ql-editing");
    if (this.textbox == null)
      return;
    if (preview != null) {
      this.textbox.value = preview;
    } else if (mode !== this.root.getAttribute("data-mode")) {
      this.textbox.value = "";
    }
    const bounds = this.quill.getBounds(this.quill.selection.savedRange);
    if (bounds != null) {
      this.position(bounds);
    }
    this.textbox.select();
    this.textbox.setAttribute(
      "placeholder",
      this.textbox.getAttribute(`data-${mode}`) || ""
    );
    this.root.setAttribute("data-mode", mode);
  }
  restoreFocus() {
    this.quill.focus({ preventScroll: true });
  }
  save() {
    let { value } = this.textbox;
    switch (this.root.getAttribute("data-mode")) {
      case "link": {
        const { scrollTop } = this.quill.root;
        if (this.linkRange) {
          this.quill.formatText(
            this.linkRange,
            "link",
            value,
            emitter_default.sources.USER
          );
          delete this.linkRange;
        } else {
          this.restoreFocus();
          this.quill.format("link", value, emitter_default.sources.USER);
        }
        this.quill.root.scrollTop = scrollTop;
        break;
      }
      case "video": {
        value = extractVideoUrl(value);
      }
      case "formula": {
        if (!value)
          break;
        const range = this.quill.getSelection(true);
        if (range != null) {
          const index = range.index + range.length;
          this.quill.insertEmbed(
            index,
            // @ts-expect-error Fix me later
            this.root.getAttribute("data-mode"),
            value,
            emitter_default.sources.USER
          );
          if (this.root.getAttribute("data-mode") === "formula") {
            this.quill.insertText(index + 1, " ", emitter_default.sources.USER);
          }
          this.quill.setSelection(index + 2, emitter_default.sources.USER);
        }
        break;
      }
      default:
    }
    this.textbox.value = "";
    this.hide();
  }
};
function extractVideoUrl(url) {
  let match = url.match(
    /^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/
  ) || url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `${match[1] || "https"}://www.youtube.com/embed/${match[2]}?showinfo=0`;
  }
  if (match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/)) {
    return `${match[1] || "https"}://player.vimeo.com/video/${match[2]}/`;
  }
  return url;
}
__name(extractVideoUrl, "extractVideoUrl");
function fillSelect(select, values, defaultValue = false) {
  values.forEach((value) => {
    const option = document.createElement("option");
    if (value === defaultValue) {
      option.setAttribute("selected", "selected");
    } else {
      option.setAttribute("value", String(value));
    }
    select.appendChild(option);
  });
}
__name(fillSelect, "fillSelect");

// src/themes/bubble.ts
var TOOLBAR_CONFIG = [
  ["bold", "italic", "link"],
  [{ header: 1 }, { header: 2 }, "blockquote"]
];
var BubbleTooltip = class extends BaseTooltip {
  static {
    __name(this, "BubbleTooltip");
  }
  static {
    this.TEMPLATE = [
      '<span class="ql-tooltip-arrow"></span>',
      '<div class="ql-tooltip-editor">',
      '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">',
      '<a class="ql-close"></a>',
      "</div>"
    ].join("");
  }
  constructor(quill, bounds) {
    super(quill, bounds);
    this.quill.on(
      emitter_default.events.EDITOR_CHANGE,
      (type, range, oldRange, source) => {
        if (type !== emitter_default.events.SELECTION_CHANGE)
          return;
        if (range != null && range.length > 0 && source === emitter_default.sources.USER) {
          this.show();
          this.root.style.left = "0px";
          this.root.style.width = "";
          this.root.style.width = `${this.root.offsetWidth}px`;
          const lines = this.quill.getLines(range.index, range.length);
          if (lines.length === 1) {
            const bounds2 = this.quill.getBounds(range);
            if (bounds2 != null) {
              this.position(bounds2);
            }
          } else {
            const lastLine = lines[lines.length - 1];
            const index = this.quill.getIndex(lastLine);
            const length = Math.min(
              lastLine.length() - 1,
              range.index + range.length - index
            );
            const indexBounds = this.quill.getBounds(new Range(index, length));
            if (indexBounds != null) {
              this.position(indexBounds);
            }
          }
        } else if (document.activeElement !== this.textbox && this.quill.hasFocus()) {
          this.hide();
        }
      }
    );
  }
  listen() {
    super.listen();
    this.root.querySelector(".ql-close").addEventListener("click", () => {
      this.root.classList.remove("ql-editing");
    });
    this.quill.on(emitter_default.events.SCROLL_OPTIMIZE, () => {
      setTimeout(() => {
        if (this.root.classList.contains("ql-hidden"))
          return;
        const range = this.quill.getSelection();
        if (range != null) {
          const bounds = this.quill.getBounds(range);
          if (bounds != null) {
            this.position(bounds);
          }
        }
      }, 1);
    });
  }
  cancel() {
    this.show();
  }
  position(reference) {
    const shift = super.position(reference);
    const arrow = this.root.querySelector(".ql-tooltip-arrow");
    arrow.style.marginLeft = "";
    if (shift !== 0) {
      arrow.style.marginLeft = `${-1 * shift - arrow.offsetWidth / 2}px`;
    }
    return shift;
  }
};
var BubbleTheme = class extends BaseTheme {
  static {
    __name(this, "BubbleTheme");
  }
  constructor(quill, options) {
    if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
      options.modules.toolbar.container = TOOLBAR_CONFIG;
    }
    super(quill, options);
    this.quill.container.classList.add("ql-bubble");
  }
  extendToolbar(toolbar) {
    this.tooltip = new BubbleTooltip(this.quill, this.options.bounds);
    if (toolbar.container != null) {
      this.tooltip.root.appendChild(toolbar.container);
      this.buildButtons(toolbar.container.querySelectorAll("button"), icons_default);
      this.buildPickers(toolbar.container.querySelectorAll("select"), icons_default);
    }
  }
};
BubbleTheme.DEFAULTS = merge_default({}, BaseTheme.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link(value) {
          if (!value) {
            this.quill.format("link", false);
          } else {
            this.quill.theme.tooltip.edit();
          }
        }
      }
    }
  }
});

// src/themes/snow.ts
var TOOLBAR_CONFIG2 = [
  [{ header: ["1", "2", "3", false] }],
  ["bold", "italic", "underline", "link"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["clean"]
];
var SnowTooltip = class extends BaseTooltip {
  constructor() {
    super(...arguments);
    this.preview = this.root.querySelector("a.ql-preview");
  }
  static {
    __name(this, "SnowTooltip");
  }
  static {
    this.TEMPLATE = [
      '<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>',
      '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">',
      '<a class="ql-action"></a>',
      '<a class="ql-remove"></a>'
    ].join("");
  }
  listen() {
    super.listen();
    this.root.querySelector("a.ql-action").addEventListener("click", (event) => {
      if (this.root.classList.contains("ql-editing")) {
        this.save();
      } else {
        this.edit("link", this.preview.textContent);
      }
      event.preventDefault();
    });
    this.root.querySelector("a.ql-remove").addEventListener("click", (event) => {
      if (this.linkRange != null) {
        const range = this.linkRange;
        this.restoreFocus();
        this.quill.formatText(range, "link", false, emitter_default.sources.USER);
        delete this.linkRange;
      }
      event.preventDefault();
      this.hide();
    });
    this.quill.on(
      emitter_default.events.SELECTION_CHANGE,
      (range, oldRange, source) => {
        if (range == null)
          return;
        if (range.length === 0 && source === emitter_default.sources.USER) {
          const [link, offset] = this.quill.scroll.descendant(
            Link,
            range.index
          );
          if (link != null) {
            this.linkRange = new Range(range.index - offset, link.length());
            const preview = Link.formats(link.domNode);
            this.preview.textContent = preview;
            this.preview.setAttribute("href", preview);
            this.show();
            const bounds = this.quill.getBounds(this.linkRange);
            if (bounds != null) {
              this.position(bounds);
            }
            return;
          }
        } else {
          delete this.linkRange;
        }
        this.hide();
      }
    );
  }
  show() {
    super.show();
    this.root.removeAttribute("data-mode");
  }
};
var SnowTheme = class extends BaseTheme {
  static {
    __name(this, "SnowTheme");
  }
  constructor(quill, options) {
    if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
      options.modules.toolbar.container = TOOLBAR_CONFIG2;
    }
    super(quill, options);
    this.quill.container.classList.add("ql-snow");
  }
  extendToolbar(toolbar) {
    if (toolbar.container != null) {
      toolbar.container.classList.add("ql-snow");
      this.buildButtons(toolbar.container.querySelectorAll("button"), icons_default);
      this.buildPickers(toolbar.container.querySelectorAll("select"), icons_default);
      this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
      if (toolbar.container.querySelector(".ql-link")) {
        this.quill.keyboard.addBinding(
          { key: "k", shortKey: true },
          (_range, context) => {
            toolbar.handlers.link.call(toolbar, !context.format.link);
          }
        );
      }
    }
  }
};
SnowTheme.DEFAULTS = merge_default({}, BaseTheme.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link(value) {
          if (value) {
            const range = this.quill.getSelection();
            if (range == null || range.length === 0)
              return;
            let preview = this.quill.getText(range);
            if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf("mailto:") !== 0) {
              preview = `mailto:${preview}`;
            }
            const { tooltip } = this.quill.theme;
            tooltip.edit("link", preview);
          } else {
            this.quill.format("link", false);
          }
        }
      }
    }
  }
});
var snow_default = SnowTheme;

// src/quill.ts
core_default.register(
  {
    "attributors/attribute/direction": DirectionAttribute,
    "attributors/class/align": AlignClass,
    "attributors/class/background": BackgroundClass,
    "attributors/class/color": ColorClass,
    "attributors/class/direction": DirectionClass,
    "attributors/class/font": FontClass,
    "attributors/class/size": SizeClass,
    "attributors/style/align": AlignStyle,
    "attributors/style/background": BackgroundStyle,
    "attributors/style/color": ColorStyle,
    "attributors/style/direction": DirectionStyle,
    "attributors/style/font": FontStyle,
    "attributors/style/size": SizeStyle
  },
  true
);
core_default.register(
  {
    "formats/align": AlignClass,
    "formats/direction": DirectionClass,
    "formats/indent": indent_default,
    "formats/background": BackgroundStyle,
    "formats/color": ColorStyle,
    "formats/font": FontClass,
    "formats/size": SizeClass,
    "formats/blockquote": blockquote_default,
    "formats/code-block": CodeBlock,
    "formats/header": header_default,
    "formats/list": ListItem,
    "formats/bold": bold_default,
    "formats/code": Code,
    "formats/italic": italic_default,
    "formats/link": Link,
    "formats/script": script_default,
    "formats/strike": strike_default,
    "formats/underline": underline_default,
    "formats/formula": formula_default,
    "formats/image": image_default,
    "formats/video": video_default,
    "modules/syntax": Syntax,
    "modules/table": table_default,
    "modules/toolbar": Toolbar,
    "themes/bubble": BubbleTheme,
    "themes/snow": snow_default,
    "ui/icons": icons_default,
    "ui/picker": picker_default,
    "ui/icon-picker": icon_picker_default,
    "ui/color-picker": color_picker_default,
    "ui/tooltip": tooltip_default
  },
  true
);
var quill_default = core_default;
export {
  Parchment,
  Range,
  quill_default as default
};
/*! Bundled license information:

lodash-es/lodash.js:
  (**
   * @license
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="es" -o ./`
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *)
*/
//# sourceMappingURL=quill.js.map
