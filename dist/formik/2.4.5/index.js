(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["formik"] = factory(require("React"));
	else
		root["formik"] = factory(root["React"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__1024__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 8679:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var reactIs = __webpack_require__(1296);

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var REACT_STATICS = {
  childContextTypes: true,
  contextType: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromError: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true
};
var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};
var FORWARD_REF_STATICS = {
  '$$typeof': true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var MEMO_STATICS = {
  '$$typeof': true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};
var TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;

function getStatics(component) {
  if (reactIs.isMemo(component)) {
    return MEMO_STATICS;
  }

  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
}

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = Object.prototype;
function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
  if (typeof sourceComponent !== 'string') {
    // don't hoist over string (html) components
    if (objectPrototype) {
      var inheritedComponent = getPrototypeOf(sourceComponent);

      if (inheritedComponent && inheritedComponent !== objectPrototype) {
        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
      }
    }

    var keys = getOwnPropertyNames(sourceComponent);

    if (getOwnPropertySymbols) {
      keys = keys.concat(getOwnPropertySymbols(sourceComponent));
    }

    var targetStatics = getStatics(targetComponent);
    var sourceStatics = getStatics(sourceComponent);

    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];

      if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

        try {
          // Avoid failures from read-only properties
          defineProperty(targetComponent, key, descriptor);
        } catch (e) {}
      }
    }
  }

  return targetComponent;
}

module.exports = hoistNonReactStatics;


/***/ }),

/***/ 6103:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/** @license React v16.12.0
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

Object.defineProperty(exports, "__esModule", ({value:!0}));
var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?Symbol.for("react.suspense_list"):
60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.fundamental"):60117,w=b?Symbol.for("react.responder"):60118,x=b?Symbol.for("react.scope"):60119;function y(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function z(a){return y(a)===m}
exports.typeOf=y;exports.AsyncMode=l;exports.ConcurrentMode=m;exports.ContextConsumer=k;exports.ContextProvider=h;exports.Element=c;exports.ForwardRef=n;exports.Fragment=e;exports.Lazy=t;exports.Memo=r;exports.Portal=d;exports.Profiler=g;exports.StrictMode=f;exports.Suspense=p;
exports.isValidElementType=function(a){return"string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===v||a.$$typeof===w||a.$$typeof===x)};exports.isAsyncMode=function(a){return z(a)||y(a)===l};exports.isConcurrentMode=z;exports.isContextConsumer=function(a){return y(a)===k};exports.isContextProvider=function(a){return y(a)===h};
exports.isElement=function(a){return"object"===typeof a&&null!==a&&a.$$typeof===c};exports.isForwardRef=function(a){return y(a)===n};exports.isFragment=function(a){return y(a)===e};exports.isLazy=function(a){return y(a)===t};exports.isMemo=function(a){return y(a)===r};exports.isPortal=function(a){return y(a)===d};exports.isProfiler=function(a){return y(a)===g};exports.isStrictMode=function(a){return y(a)===f};exports.isSuspense=function(a){return y(a)===p};


/***/ }),

/***/ 1296:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (true) {
  module.exports = __webpack_require__(6103);
} else {}


/***/ }),

/***/ 9590:
/***/ ((module) => {

"use strict";


var isArray = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;
var hasElementType = typeof Element !== 'undefined';

function equal(a, b) {
  // fast-deep-equal index.js 2.0.1
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    var arrA = isArray(a)
      , arrB = isArray(b)
      , i
      , length
      , key;

    if (arrA && arrB) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }

    if (arrA != arrB) return false;

    var dateA = a instanceof Date
      , dateB = b instanceof Date;
    if (dateA != dateB) return false;
    if (dateA && dateB) return a.getTime() == b.getTime();

    var regexpA = a instanceof RegExp
      , regexpB = b instanceof RegExp;
    if (regexpA != regexpB) return false;
    if (regexpA && regexpB) return a.toString() == b.toString();

    var keys = keyList(a);
    length = keys.length;

    if (length !== keyList(b).length)
      return false;

    for (i = length; i-- !== 0;)
      if (!hasProp.call(b, keys[i])) return false;
    // end fast-deep-equal

    // start react-fast-compare
    // custom handling for DOM elements
    if (hasElementType && a instanceof Element && b instanceof Element)
      return a === b;

    // custom handling for React
    for (i = length; i-- !== 0;) {
      key = keys[i];
      if (key === '_owner' && a.$$typeof) {
        // React-specific: avoid traversing React elements' _owner.
        //  _owner contains circular references
        // and is not needed when comparing the actual elements (and not their owners)
        // .$$typeof and ._store on just reasonable markers of a react element
        continue;
      } else {
        // all other properties should be traversed as usual
        if (!equal(a[key], b[key])) return false;
      }
    }
    // end react-fast-compare

    // fast-deep-equal index.js 2.0.1
    return true;
  }

  return a !== a && b !== b;
}
// end fast-deep-equal

module.exports = function exportedEqual(a, b) {
  try {
    return equal(a, b);
  } catch (error) {
    if ((error.message && error.message.match(/stack|recursion/i)) || (error.number === -2146828260)) {
      // warn on circular references, don't crash
      // browsers give this different errors name and messages:
      // chrome/safari: "RangeError", "Maximum call stack size exceeded"
      // firefox: "InternalError", too much recursion"
      // edge: "Error", "Out of stack space"
      console.warn('Warning: react-fast-compare does not handle circular references.', error.name, error.message);
      return false;
    }
    // some other error. we should definitely know about these
    throw error;
  }
};


/***/ }),

/***/ 4545:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(4204),
    root = __webpack_require__(8386);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),

/***/ 8733:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hashClear = __webpack_require__(8239),
    hashDelete = __webpack_require__(7002),
    hashGet = __webpack_require__(1089),
    hashHas = __webpack_require__(2165),
    hashSet = __webpack_require__(3277);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),

/***/ 8069:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var listCacheClear = __webpack_require__(6285),
    listCacheDelete = __webpack_require__(6048),
    listCacheGet = __webpack_require__(6176),
    listCacheHas = __webpack_require__(600),
    listCacheSet = __webpack_require__(5645);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),

/***/ 8028:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(4204),
    root = __webpack_require__(8386);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ 2269:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var mapCacheClear = __webpack_require__(1509),
    mapCacheDelete = __webpack_require__(1150),
    mapCacheGet = __webpack_require__(2351),
    mapCacheHas = __webpack_require__(8725),
    mapCacheSet = __webpack_require__(5003);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),

/***/ 3976:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(4204),
    root = __webpack_require__(8386);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),

/***/ 9964:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(4204),
    root = __webpack_require__(8386);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),

/***/ 3268:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(8069),
    stackClear = __webpack_require__(9110),
    stackDelete = __webpack_require__(1455),
    stackGet = __webpack_require__(8122),
    stackHas = __webpack_require__(142),
    stackSet = __webpack_require__(3681);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),

/***/ 5560:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(8386);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ 7713:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(8386);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),

/***/ 2248:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(4204),
    root = __webpack_require__(8386);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),

/***/ 8137:
/***/ ((module) => {

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;


/***/ }),

/***/ 31:
/***/ ((module) => {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),

/***/ 4819:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTimes = __webpack_require__(5287),
    isArguments = __webpack_require__(4348),
    isArray = __webpack_require__(5367),
    isBuffer = __webpack_require__(7013),
    isIndex = __webpack_require__(1927),
    isTypedArray = __webpack_require__(8295);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),

/***/ 1313:
/***/ ((module) => {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),

/***/ 9441:
/***/ ((module) => {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),

/***/ 41:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseAssignValue = __webpack_require__(1445),
    eq = __webpack_require__(9984);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),

/***/ 280:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var eq = __webpack_require__(9984);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),

/***/ 3469:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(6022),
    keys = __webpack_require__(7144);

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;


/***/ }),

/***/ 4419:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(6022),
    keysIn = __webpack_require__(2660);

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;


/***/ }),

/***/ 1445:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defineProperty = __webpack_require__(1357);

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),

/***/ 1544:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stack = __webpack_require__(3268),
    arrayEach = __webpack_require__(8137),
    assignValue = __webpack_require__(41),
    baseAssign = __webpack_require__(3469),
    baseAssignIn = __webpack_require__(4419),
    cloneBuffer = __webpack_require__(5757),
    copyArray = __webpack_require__(808),
    copySymbols = __webpack_require__(1029),
    copySymbolsIn = __webpack_require__(8699),
    getAllKeys = __webpack_require__(3043),
    getAllKeysIn = __webpack_require__(1171),
    getTag = __webpack_require__(5576),
    initCloneArray = __webpack_require__(2659),
    initCloneByTag = __webpack_require__(5466),
    initCloneObject = __webpack_require__(1477),
    isArray = __webpack_require__(5367),
    isBuffer = __webpack_require__(7013),
    isMap = __webpack_require__(9259),
    isObject = __webpack_require__(1873),
    isSet = __webpack_require__(5298),
    keys = __webpack_require__(7144),
    keysIn = __webpack_require__(2660);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;


/***/ }),

/***/ 5083:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(1873);

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),

/***/ 4347:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(9441),
    isArray = __webpack_require__(5367);

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),

/***/ 9891:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(5560),
    getRawTag = __webpack_require__(9751),
    objectToString = __webpack_require__(7521);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ 8545:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(9891),
    isObjectLike = __webpack_require__(825);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),

/***/ 5440:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getTag = __webpack_require__(5576),
    isObjectLike = __webpack_require__(825);

/** `Object#toString` result references. */
var mapTag = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

module.exports = baseIsMap;


/***/ }),

/***/ 7409:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(5878),
    isMasked = __webpack_require__(6358),
    isObject = __webpack_require__(1873),
    toSource = __webpack_require__(1929);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),

/***/ 9000:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getTag = __webpack_require__(5576),
    isObjectLike = __webpack_require__(825);

/** `Object#toString` result references. */
var setTag = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}

module.exports = baseIsSet;


/***/ }),

/***/ 2398:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(9891),
    isLength = __webpack_require__(2462),
    isObjectLike = __webpack_require__(825);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),

/***/ 1367:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isPrototype = __webpack_require__(1144),
    nativeKeys = __webpack_require__(6090);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),

/***/ 4641:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(1873),
    isPrototype = __webpack_require__(1144),
    nativeKeysIn = __webpack_require__(7179);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;


/***/ }),

/***/ 5287:
/***/ ((module) => {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),

/***/ 557:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(5560),
    arrayMap = __webpack_require__(1313),
    isArray = __webpack_require__(5367),
    isSymbol = __webpack_require__(4448);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),

/***/ 6246:
/***/ ((module) => {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),

/***/ 3216:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Uint8Array = __webpack_require__(7713);

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;


/***/ }),

/***/ 5757:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(8386);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;


/***/ }),

/***/ 5172:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(3216);

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;


/***/ }),

/***/ 7885:
/***/ ((module) => {

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;


/***/ }),

/***/ 9122:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(5560);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;


/***/ }),

/***/ 2268:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(3216);

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;


/***/ }),

/***/ 808:
/***/ ((module) => {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),

/***/ 6022:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assignValue = __webpack_require__(41),
    baseAssignValue = __webpack_require__(1445);

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),

/***/ 1029:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(6022),
    getSymbols = __webpack_require__(5915);

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;


/***/ }),

/***/ 8699:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(6022),
    getSymbolsIn = __webpack_require__(9104);

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;


/***/ }),

/***/ 3199:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(8386);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ 1357:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(4204);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),

/***/ 7696:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ }),

/***/ 3043:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetAllKeys = __webpack_require__(4347),
    getSymbols = __webpack_require__(5915),
    keys = __webpack_require__(7144);

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),

/***/ 1171:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetAllKeys = __webpack_require__(4347),
    getSymbolsIn = __webpack_require__(9104),
    keysIn = __webpack_require__(2660);

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;


/***/ }),

/***/ 2104:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isKeyable = __webpack_require__(8298);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),

/***/ 4204:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsNative = __webpack_require__(7409),
    getValue = __webpack_require__(1092);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),

/***/ 4549:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(7395);

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),

/***/ 9751:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(5560);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

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

module.exports = getRawTag;


/***/ }),

/***/ 5915:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayFilter = __webpack_require__(31),
    stubArray = __webpack_require__(8313);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),

/***/ 9104:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(9441),
    getPrototype = __webpack_require__(4549),
    getSymbols = __webpack_require__(5915),
    stubArray = __webpack_require__(8313);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;


/***/ }),

/***/ 5576:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DataView = __webpack_require__(4545),
    Map = __webpack_require__(8028),
    Promise = __webpack_require__(3976),
    Set = __webpack_require__(9964),
    WeakMap = __webpack_require__(2248),
    baseGetTag = __webpack_require__(9891),
    toSource = __webpack_require__(1929);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),

/***/ 1092:
/***/ ((module) => {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),

/***/ 8239:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(5678);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),

/***/ 7002:
/***/ ((module) => {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),

/***/ 1089:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(5678);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),

/***/ 2165:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(5678);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),

/***/ 3277:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(5678);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),

/***/ 2659:
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;


/***/ }),

/***/ 5466:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(3216),
    cloneDataView = __webpack_require__(5172),
    cloneRegExp = __webpack_require__(7885),
    cloneSymbol = __webpack_require__(9122),
    cloneTypedArray = __webpack_require__(2268);

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return new Ctor;

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return new Ctor;

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;


/***/ }),

/***/ 1477:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseCreate = __webpack_require__(5083),
    getPrototype = __webpack_require__(4549),
    isPrototype = __webpack_require__(1144);

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


/***/ }),

/***/ 1927:
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),

/***/ 8298:
/***/ ((module) => {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),

/***/ 6358:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var coreJsData = __webpack_require__(3199);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),

/***/ 1144:
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),

/***/ 6285:
/***/ ((module) => {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),

/***/ 6048:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(280);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

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

module.exports = listCacheDelete;


/***/ }),

/***/ 6176:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(280);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),

/***/ 600:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(280);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),

/***/ 5645:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(280);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),

/***/ 1509:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Hash = __webpack_require__(8733),
    ListCache = __webpack_require__(8069),
    Map = __webpack_require__(8028);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),

/***/ 1150:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(2104);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),

/***/ 2351:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(2104);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),

/***/ 8725:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(2104);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),

/***/ 5003:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(2104);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),

/***/ 2077:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var memoize = __webpack_require__(1417);

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;


/***/ }),

/***/ 5678:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(4204);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ 6090:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(7395);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),

/***/ 7179:
/***/ ((module) => {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;


/***/ }),

/***/ 5253:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var freeGlobal = __webpack_require__(7696);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;


/***/ }),

/***/ 7521:
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ 7395:
/***/ ((module) => {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),

/***/ 8386:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(7696);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ 9110:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(8069);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),

/***/ 1455:
/***/ ((module) => {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),

/***/ 8122:
/***/ ((module) => {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),

/***/ 142:
/***/ ((module) => {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),

/***/ 3681:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(8069),
    Map = __webpack_require__(8028),
    MapCache = __webpack_require__(2269);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),

/***/ 9088:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var memoizeCapped = __webpack_require__(2077);

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),

/***/ 1370:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isSymbol = __webpack_require__(4448);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;


/***/ }),

/***/ 1929:
/***/ ((module) => {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),

/***/ 3237:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseClone = __webpack_require__(1544);

/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, CLONE_SYMBOLS_FLAG);
}

module.exports = clone;


/***/ }),

/***/ 6255:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseClone = __webpack_require__(1544);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

module.exports = cloneDeep;


/***/ }),

/***/ 9984:
/***/ ((module) => {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),

/***/ 4348:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsArguments = __webpack_require__(8545),
    isObjectLike = __webpack_require__(825);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),

/***/ 5367:
/***/ ((module) => {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),

/***/ 2083:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(5878),
    isLength = __webpack_require__(2462);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),

/***/ 7013:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(8386),
    stubFalse = __webpack_require__(8057);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;


/***/ }),

/***/ 5878:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(9891),
    isObject = __webpack_require__(1873);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),

/***/ 2462:
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),

/***/ 9259:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsMap = __webpack_require__(5440),
    baseUnary = __webpack_require__(6246),
    nodeUtil = __webpack_require__(5253);

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

module.exports = isMap;


/***/ }),

/***/ 1873:
/***/ ((module) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ 825:
/***/ ((module) => {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ 1197:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(9891),
    getPrototype = __webpack_require__(4549),
    isObjectLike = __webpack_require__(825);

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;


/***/ }),

/***/ 5298:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsSet = __webpack_require__(9000),
    baseUnary = __webpack_require__(6246),
    nodeUtil = __webpack_require__(5253);

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

module.exports = isSet;


/***/ }),

/***/ 4448:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(9891),
    isObjectLike = __webpack_require__(825);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),

/***/ 8295:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsTypedArray = __webpack_require__(2398),
    baseUnary = __webpack_require__(6246),
    nodeUtil = __webpack_require__(5253);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),

/***/ 7144:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(4819),
    baseKeys = __webpack_require__(1367),
    isArrayLike = __webpack_require__(2083);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),

/***/ 2660:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(4819),
    baseKeysIn = __webpack_require__(4641),
    isArrayLike = __webpack_require__(2083);

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;


/***/ }),

/***/ 1417:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var MapCache = __webpack_require__(2269);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;


/***/ }),

/***/ 8313:
/***/ ((module) => {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),

/***/ 8057:
/***/ ((module) => {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),

/***/ 5013:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayMap = __webpack_require__(1313),
    copyArray = __webpack_require__(808),
    isArray = __webpack_require__(5367),
    isSymbol = __webpack_require__(4448),
    stringToPath = __webpack_require__(9088),
    toKey = __webpack_require__(1370),
    toString = __webpack_require__(9589);

/**
 * Converts `value` to a property path array.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {*} value The value to convert.
 * @returns {Array} Returns the new property path array.
 * @example
 *
 * _.toPath('a.b.c');
 * // => ['a', 'b', 'c']
 *
 * _.toPath('a[0].b.c');
 * // => ['a', '0', 'b', 'c']
 */
function toPath(value) {
  if (isArray(value)) {
    return arrayMap(value, toKey);
  }
  return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
}

module.exports = toPath;


/***/ }),

/***/ 9589:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseToString = __webpack_require__(557);

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),

/***/ 1024:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__1024__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ErrorMessage: () => (/* reexport */ ErrorMessage),
  FastField: () => (/* reexport */ FastField),
  Field: () => (/* reexport */ Field),
  FieldArray: () => (/* reexport */ FieldArray),
  Form: () => (/* reexport */ Form),
  Formik: () => (/* reexport */ Formik),
  FormikConsumer: () => (/* reexport */ FormikConsumer),
  FormikContext: () => (/* reexport */ FormikContext),
  FormikProvider: () => (/* reexport */ FormikProvider),
  connect: () => (/* reexport */ connect),
  getActiveElement: () => (/* reexport */ getActiveElement),
  getIn: () => (/* reexport */ getIn),
  insert: () => (/* reexport */ insert),
  isEmptyArray: () => (/* reexport */ isEmptyArray),
  isEmptyChildren: () => (/* reexport */ isEmptyChildren),
  isFunction: () => (/* reexport */ isFunction),
  isInputEvent: () => (/* reexport */ isInputEvent),
  isInteger: () => (/* reexport */ isInteger),
  isNaN: () => (/* reexport */ utils_isNaN),
  isObject: () => (/* reexport */ isObject),
  isPromise: () => (/* reexport */ isPromise),
  isString: () => (/* reexport */ isString),
  move: () => (/* reexport */ move),
  prepareDataForValidation: () => (/* reexport */ prepareDataForValidation),
  replace: () => (/* reexport */ replace),
  setIn: () => (/* reexport */ setIn),
  setNestedObjectValues: () => (/* reexport */ setNestedObjectValues),
  swap: () => (/* reexport */ swap),
  useField: () => (/* reexport */ useField),
  useFormik: () => (/* reexport */ useFormik),
  useFormikContext: () => (/* reexport */ useFormikContext),
  validateYupSchema: () => (/* reexport */ validateYupSchema),
  withFormik: () => (/* reexport */ withFormik),
  yupToFormErrors: () => (/* reexport */ yupToFormErrors)
});

;// CONCATENATED MODULE: ./packages/formik/node_modules/deepmerge/dist/es.js
var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		Object.keys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	Object.keys(source).forEach(function(key) {
		if (!options.isMergeableObject(source[key]) || !target[key]) {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		} else {
			destination[key] = deepmerge(target[key], source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

/* harmony default export */ const es = (deepmerge_1);

// EXTERNAL MODULE: ./packages/formik/node_modules/lodash/isPlainObject.js
var isPlainObject = __webpack_require__(1197);
var isPlainObject_default = /*#__PURE__*/__webpack_require__.n(isPlainObject);
// EXTERNAL MODULE: external "React"
var external_React_ = __webpack_require__(1024);
// EXTERNAL MODULE: ./node_modules/react-fast-compare/index.js
var react_fast_compare = __webpack_require__(9590);
var react_fast_compare_default = /*#__PURE__*/__webpack_require__.n(react_fast_compare);
;// CONCATENATED MODULE: ./node_modules/tiny-warning/dist/tiny-warning.esm.js
var isProduction = "production" === 'production';
function warning(condition, message) {
  if (!isProduction) {
    if (condition) {
      return;
    }

    var text = "Warning: " + message;

    if (typeof console !== 'undefined') {
      console.warn(text);
    }

    try {
      throw Error(text);
    } catch (x) {}
  }
}

/* harmony default export */ const tiny_warning_esm = (warning);

;// CONCATENATED MODULE: ./packages/formik/src/FormikContext.tsx


const FormikContext = external_React_.createContext(undefined);
FormikContext.displayName = 'FormikContext';
const FormikProvider = FormikContext.Provider;
const FormikConsumer = FormikContext.Consumer;
function useFormikContext() {
    const formik = external_React_.useContext(FormikContext);
    tiny_warning_esm(!!formik, `Formik context is undefined, please verify you are calling useFormikContext() as child of a <Formik> component.`);
    return formik;
}

// EXTERNAL MODULE: ./packages/formik/node_modules/lodash/clone.js
var clone = __webpack_require__(3237);
var clone_default = /*#__PURE__*/__webpack_require__.n(clone);
// EXTERNAL MODULE: ./packages/formik/node_modules/lodash/toPath.js
var toPath = __webpack_require__(5013);
var toPath_default = /*#__PURE__*/__webpack_require__.n(toPath);
;// CONCATENATED MODULE: ./packages/formik/src/utils.ts



// Assertions
/** @private is the value an empty array? */
const isEmptyArray = (value) => Array.isArray(value) && value.length === 0;
/** @private is the given object a Function? */
const isFunction = (obj) => typeof obj === 'function';
/** @private is the given object an Object? */
const isObject = (obj) => obj !== null && typeof obj === 'object';
/** @private is the given object an integer? */
const isInteger = (obj) => String(Math.floor(Number(obj))) === obj;
/** @private is the given object a string? */
const isString = (obj) => Object.prototype.toString.call(obj) === '[object String]';
/** @private is the given object a NaN? */
// eslint-disable-next-line no-self-compare
const utils_isNaN = (obj) => obj !== obj;
/** @private Does a React component have exactly 0 children? */
const isEmptyChildren = (children) => external_React_.Children.count(children) === 0;
/** @private is the given object/value a promise? */
const isPromise = (value) => isObject(value) && isFunction(value.then);
/** @private is the given object/value a type of synthetic event? */
const isInputEvent = (value) => value && isObject(value) && isObject(value.target);
/**
 * Same as document.activeElement but wraps in a try-catch block. In IE it is
 * not safe to call document.activeElement if there is nothing focused.
 *
 * The activeElement will be null only if the document or document body is not
 * yet defined.
 *
 * @param {?Document} doc Defaults to current document.
 * @return {Element | null}
 * @see https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/dom/getActiveElement.js
 */
function getActiveElement(doc) {
    doc = doc || (typeof document !== 'undefined' ? document : undefined);
    if (typeof doc === 'undefined') {
        return null;
    }
    try {
        return doc.activeElement || doc.body;
    }
    catch (e) {
        return doc.body;
    }
}
/**
 * Deeply get a value from an object via its path.
 */
function getIn(obj, key, def, p = 0) {
    const path = toPath_default()(key);
    while (obj && p < path.length) {
        obj = obj[path[p++]];
    }
    // check if path is not in the end
    if (p !== path.length && !obj) {
        return def;
    }
    return obj === undefined ? def : obj;
}
/**
 * Deeply set a value from in object via it's path. If the value at `path`
 * has changed, return a shallow copy of obj with `value` set at `path`.
 * If `value` has not changed, return the original `obj`.
 *
 * Existing objects / arrays along `path` are also shallow copied. Sibling
 * objects along path retain the same internal js reference. Since new
 * objects / arrays are only created along `path`, we can test if anything
 * changed in a nested structure by comparing the object's reference in
 * the old and new object, similar to how russian doll cache invalidation
 * works.
 *
 * In earlier versions of this function, which used cloneDeep, there were
 * issues whereby settings a nested value would mutate the parent
 * instead of creating a new object. `clone` avoids that bug making a
 * shallow copy of the objects along the update path
 * so no object is mutated in place.
 *
 * Before changing this function, please read through the following
 * discussions.
 *
 * @see https://github.com/developit/linkstate
 * @see https://github.com/jaredpalmer/formik/pull/123
 */
function setIn(obj, path, value) {
    let res = clone_default()(obj); // this keeps inheritance when obj is a class
    let resVal = res;
    let i = 0;
    let pathArray = toPath_default()(path);
    for (; i < pathArray.length - 1; i++) {
        const currentPath = pathArray[i];
        let currentObj = getIn(obj, pathArray.slice(0, i + 1));
        if (currentObj && (isObject(currentObj) || Array.isArray(currentObj))) {
            resVal = resVal[currentPath] = clone_default()(currentObj);
        }
        else {
            const nextPath = pathArray[i + 1];
            resVal = resVal[currentPath] =
                isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
        }
    }
    // Return original object if new value is the same as current
    if ((i === 0 ? obj : resVal)[pathArray[i]] === value) {
        return obj;
    }
    if (value === undefined) {
        delete resVal[pathArray[i]];
    }
    else {
        resVal[pathArray[i]] = value;
    }
    // If the path array has a single element, the loop did not run.
    // Deleting on `resVal` had no effect in this scenario, so we delete on the result instead.
    if (i === 0 && value === undefined) {
        delete res[pathArray[i]];
    }
    return res;
}
/**
 * Recursively a set the same value for all keys and arrays nested object, cloning
 * @param object
 * @param value
 * @param visited
 * @param response
 */
function setNestedObjectValues(object, value, visited = new WeakMap(), response = {}) {
    for (let k of Object.keys(object)) {
        const val = object[k];
        if (isObject(val)) {
            if (!visited.get(val)) {
                visited.set(val, true);
                // In order to keep array values consistent for both dot path  and
                // bracket syntax, we need to check if this is an array so that
                // this will output  { friends: [true] } and not { friends: { "0": true } }
                response[k] = Array.isArray(val) ? [] : {};
                setNestedObjectValues(val, value, visited, response[k]);
            }
        }
        else {
            response[k] = value;
        }
    }
    return response;
}

;// CONCATENATED MODULE: ./packages/formik/src/Formik.tsx







// State reducer
function formikReducer(state, msg) {
    switch (msg.type) {
        case 'SET_VALUES':
            return { ...state, values: msg.payload };
        case 'SET_TOUCHED':
            return { ...state, touched: msg.payload };
        case 'SET_ERRORS':
            if (react_fast_compare_default()(state.errors, msg.payload)) {
                return state;
            }
            return { ...state, errors: msg.payload };
        case 'SET_STATUS':
            return { ...state, status: msg.payload };
        case 'SET_ISSUBMITTING':
            return { ...state, isSubmitting: msg.payload };
        case 'SET_ISVALIDATING':
            return { ...state, isValidating: msg.payload };
        case 'SET_FIELD_VALUE':
            return {
                ...state,
                values: setIn(state.values, msg.payload.field, msg.payload.value),
            };
        case 'SET_FIELD_TOUCHED':
            return {
                ...state,
                touched: setIn(state.touched, msg.payload.field, msg.payload.value),
            };
        case 'SET_FIELD_ERROR':
            return {
                ...state,
                errors: setIn(state.errors, msg.payload.field, msg.payload.value),
            };
        case 'RESET_FORM':
            return { ...state, ...msg.payload };
        case 'SET_FORMIK_STATE':
            return msg.payload(state);
        case 'SUBMIT_ATTEMPT':
            return {
                ...state,
                touched: setNestedObjectValues(state.values, true),
                isSubmitting: true,
                submitCount: state.submitCount + 1,
            };
        case 'SUBMIT_FAILURE':
            return {
                ...state,
                isSubmitting: false,
            };
        case 'SUBMIT_SUCCESS':
            return {
                ...state,
                isSubmitting: false,
            };
        default:
            return state;
    }
}
// Initial empty states // objects
const emptyErrors = {};
const emptyTouched = {};
function useFormik({ validateOnChange = true, validateOnBlur = true, validateOnMount = false, isInitialValid, enableReinitialize = false, onSubmit, ...rest }) {
    const props = {
        validateOnChange,
        validateOnBlur,
        validateOnMount,
        onSubmit,
        ...rest,
    };
    const initialValues = external_React_.useRef(props.initialValues);
    const initialErrors = external_React_.useRef(props.initialErrors || emptyErrors);
    const initialTouched = external_React_.useRef(props.initialTouched || emptyTouched);
    const initialStatus = external_React_.useRef(props.initialStatus);
    const isMounted = external_React_.useRef(false);
    const fieldRegistry = external_React_.useRef({});
    if (false) {}
    external_React_.useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);
    const [, setIteration] = external_React_.useState(0);
    const stateRef = external_React_.useRef({
        values: props.initialValues,
        errors: props.initialErrors || emptyErrors,
        touched: props.initialTouched || emptyTouched,
        status: props.initialStatus,
        isSubmitting: false,
        isValidating: false,
        submitCount: 0,
    });
    const state = stateRef.current;
    const dispatch = external_React_.useCallback((action) => {
        const prev = stateRef.current;
        stateRef.current = formikReducer(prev, action);
        // force rerender
        if (prev !== stateRef.current)
            setIteration(x => x + 1);
    }, []);
    const runValidateHandler = external_React_.useCallback((values, field) => {
        return new Promise((resolve, reject) => {
            const maybePromisedErrors = props.validate(values, field);
            if (maybePromisedErrors == null) {
                // use loose null check here on purpose
                resolve(emptyErrors);
            }
            else if (isPromise(maybePromisedErrors)) {
                maybePromisedErrors.then(errors => {
                    resolve(errors || emptyErrors);
                }, actualException => {
                    if (false) {}
                    reject(actualException);
                });
            }
            else {
                resolve(maybePromisedErrors);
            }
        });
    }, [props.validate]);
    /**
     * Run validation against a Yup schema and optionally run a function if successful
     */
    const runValidationSchema = external_React_.useCallback((values, field) => {
        const validationSchema = props.validationSchema;
        const schema = isFunction(validationSchema)
            ? validationSchema(field)
            : validationSchema;
        const promise = field && schema.validateAt
            ? schema.validateAt(field, values)
            : validateYupSchema(values, schema);
        return new Promise((resolve, reject) => {
            promise.then(() => {
                resolve(emptyErrors);
            }, (err) => {
                // Yup will throw a validation error if validation fails. We catch those and
                // resolve them into Formik errors. We can sniff if something is a Yup error
                // by checking error.name.
                // @see https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
                if (err.name === 'ValidationError') {
                    resolve(yupToFormErrors(err));
                }
                else {
                    // We throw any other errors
                    if (false) {}
                    reject(err);
                }
            });
        });
    }, [props.validationSchema]);
    const runSingleFieldLevelValidation = external_React_.useCallback((field, value) => {
        return new Promise(resolve => resolve(fieldRegistry.current[field].validate(value)));
    }, []);
    const runFieldLevelValidations = external_React_.useCallback((values) => {
        const fieldKeysWithValidation = Object.keys(fieldRegistry.current).filter(f => isFunction(fieldRegistry.current[f].validate));
        // Construct an array with all of the field validation functions
        const fieldValidations = fieldKeysWithValidation.length > 0
            ? fieldKeysWithValidation.map(f => runSingleFieldLevelValidation(f, getIn(values, f)))
            : [Promise.resolve('DO_NOT_DELETE_YOU_WILL_BE_FIRED')]; // use special case ;)
        return Promise.all(fieldValidations).then((fieldErrorsList) => fieldErrorsList.reduce((prev, curr, index) => {
            if (curr === 'DO_NOT_DELETE_YOU_WILL_BE_FIRED') {
                return prev;
            }
            if (curr) {
                prev = setIn(prev, fieldKeysWithValidation[index], curr);
            }
            return prev;
        }, {}));
    }, [runSingleFieldLevelValidation]);
    // Run all validations and return the result
    const runAllValidations = external_React_.useCallback((values) => {
        return Promise.all([
            runFieldLevelValidations(values),
            props.validationSchema ? runValidationSchema(values) : {},
            props.validate ? runValidateHandler(values) : {},
        ]).then(([fieldErrors, schemaErrors, validateErrors]) => {
            const combinedErrors = es.all([fieldErrors, schemaErrors, validateErrors], { arrayMerge });
            return combinedErrors;
        });
    }, [
        props.validate,
        props.validationSchema,
        runFieldLevelValidations,
        runValidateHandler,
        runValidationSchema,
    ]);
    // Run all validations methods and update state accordingly
    const validateFormWithHighPriority = useEventCallback((values = state.values) => {
        dispatch({ type: 'SET_ISVALIDATING', payload: true });
        return runAllValidations(values).then(combinedErrors => {
            if (!!isMounted.current) {
                dispatch({ type: 'SET_ISVALIDATING', payload: false });
                dispatch({ type: 'SET_ERRORS', payload: combinedErrors });
            }
            return combinedErrors;
        });
    });
    external_React_.useEffect(() => {
        if (validateOnMount &&
            isMounted.current === true &&
            react_fast_compare_default()(initialValues.current, props.initialValues)) {
            validateFormWithHighPriority(initialValues.current);
        }
    }, [validateOnMount, validateFormWithHighPriority]);
    const resetForm = external_React_.useCallback((nextState) => {
        const values = nextState && nextState.values
            ? nextState.values
            : initialValues.current;
        const errors = nextState && nextState.errors
            ? nextState.errors
            : initialErrors.current
                ? initialErrors.current
                : props.initialErrors || {};
        const touched = nextState && nextState.touched
            ? nextState.touched
            : initialTouched.current
                ? initialTouched.current
                : props.initialTouched || {};
        const status = nextState && nextState.status
            ? nextState.status
            : initialStatus.current
                ? initialStatus.current
                : props.initialStatus;
        initialValues.current = values;
        initialErrors.current = errors;
        initialTouched.current = touched;
        initialStatus.current = status;
        const dispatchFn = () => {
            dispatch({
                type: 'RESET_FORM',
                payload: {
                    isSubmitting: !!nextState && !!nextState.isSubmitting,
                    errors,
                    touched,
                    status,
                    values,
                    isValidating: !!nextState && !!nextState.isValidating,
                    submitCount: !!nextState &&
                        !!nextState.submitCount &&
                        typeof nextState.submitCount === 'number'
                        ? nextState.submitCount
                        : 0,
                },
            });
        };
        if (props.onReset) {
            const maybePromisedOnReset = props.onReset(state.values, imperativeMethods);
            if (isPromise(maybePromisedOnReset)) {
                maybePromisedOnReset.then(dispatchFn);
            }
            else {
                dispatchFn();
            }
        }
        else {
            dispatchFn();
        }
    }, [props.initialErrors, props.initialStatus, props.initialTouched, props.onReset]);
    external_React_.useEffect(() => {
        if (isMounted.current === true &&
            !react_fast_compare_default()(initialValues.current, props.initialValues)) {
            if (enableReinitialize) {
                initialValues.current = props.initialValues;
                resetForm();
                if (validateOnMount) {
                    validateFormWithHighPriority(initialValues.current);
                }
            }
        }
    }, [
        enableReinitialize,
        props.initialValues,
        resetForm,
        validateOnMount,
        validateFormWithHighPriority,
    ]);
    external_React_.useEffect(() => {
        if (enableReinitialize &&
            isMounted.current === true &&
            !react_fast_compare_default()(initialErrors.current, props.initialErrors)) {
            initialErrors.current = props.initialErrors || emptyErrors;
            dispatch({
                type: 'SET_ERRORS',
                payload: props.initialErrors || emptyErrors,
            });
        }
    }, [enableReinitialize, props.initialErrors]);
    external_React_.useEffect(() => {
        if (enableReinitialize &&
            isMounted.current === true &&
            !react_fast_compare_default()(initialTouched.current, props.initialTouched)) {
            initialTouched.current = props.initialTouched || emptyTouched;
            dispatch({
                type: 'SET_TOUCHED',
                payload: props.initialTouched || emptyTouched,
            });
        }
    }, [enableReinitialize, props.initialTouched]);
    external_React_.useEffect(() => {
        if (enableReinitialize &&
            isMounted.current === true &&
            !react_fast_compare_default()(initialStatus.current, props.initialStatus)) {
            initialStatus.current = props.initialStatus;
            dispatch({
                type: 'SET_STATUS',
                payload: props.initialStatus,
            });
        }
    }, [enableReinitialize, props.initialStatus, props.initialTouched]);
    const validateField = useEventCallback((name) => {
        // This will efficiently validate a single field by avoiding state
        // changes if the validation function is synchronous. It's different from
        // what is called when using validateForm.
        if (fieldRegistry.current[name] &&
            isFunction(fieldRegistry.current[name].validate)) {
            const value = getIn(state.values, name);
            const maybePromise = fieldRegistry.current[name].validate(value);
            if (isPromise(maybePromise)) {
                // Only flip isValidating if the function is async.
                dispatch({ type: 'SET_ISVALIDATING', payload: true });
                return maybePromise
                    .then((x) => x)
                    .then((error) => {
                    dispatch({
                        type: 'SET_FIELD_ERROR',
                        payload: { field: name, value: error },
                    });
                    dispatch({ type: 'SET_ISVALIDATING', payload: false });
                });
            }
            else {
                dispatch({
                    type: 'SET_FIELD_ERROR',
                    payload: {
                        field: name,
                        value: maybePromise,
                    },
                });
                return Promise.resolve(maybePromise);
            }
        }
        else if (props.validationSchema) {
            dispatch({ type: 'SET_ISVALIDATING', payload: true });
            return runValidationSchema(state.values, name)
                .then((x) => x)
                .then((error) => {
                dispatch({
                    type: 'SET_FIELD_ERROR',
                    payload: { field: name, value: getIn(error, name) },
                });
                dispatch({ type: 'SET_ISVALIDATING', payload: false });
            });
        }
        return Promise.resolve();
    });
    const registerField = external_React_.useCallback((name, { validate }) => {
        fieldRegistry.current[name] = {
            validate,
        };
    }, []);
    const unregisterField = external_React_.useCallback((name) => {
        delete fieldRegistry.current[name];
    }, []);
    const setTouched = useEventCallback((touched, shouldValidate) => {
        dispatch({ type: 'SET_TOUCHED', payload: touched });
        const willValidate = shouldValidate === undefined ? validateOnBlur : shouldValidate;
        return willValidate
            ? validateFormWithHighPriority(state.values)
            : Promise.resolve();
    });
    const setErrors = external_React_.useCallback((errors) => {
        dispatch({ type: 'SET_ERRORS', payload: errors });
    }, []);
    const setValues = useEventCallback((values, shouldValidate) => {
        const resolvedValues = isFunction(values) ? values(state.values) : values;
        dispatch({ type: 'SET_VALUES', payload: resolvedValues });
        const willValidate = shouldValidate === undefined ? validateOnChange : shouldValidate;
        return willValidate
            ? validateFormWithHighPriority(resolvedValues)
            : Promise.resolve();
    });
    const setFieldError = external_React_.useCallback((field, value) => {
        dispatch({
            type: 'SET_FIELD_ERROR',
            payload: { field, value },
        });
    }, []);
    const setFieldValue = useEventCallback((field, value, shouldValidate) => {
        dispatch({
            type: 'SET_FIELD_VALUE',
            payload: {
                field,
                value,
            },
        });
        const willValidate = shouldValidate === undefined ? validateOnChange : shouldValidate;
        return willValidate
            ? validateFormWithHighPriority(setIn(state.values, field, value))
            : Promise.resolve();
    });
    const executeChange = external_React_.useCallback((eventOrTextValue, maybePath) => {
        // By default, assume that the first argument is a string. This allows us to use
        // handleChange with React Native and React Native Web's onChangeText prop which
        // provides just the value of the input.
        let field = maybePath;
        let val = eventOrTextValue;
        let parsed;
        // If the first argument is not a string though, it has to be a synthetic React Event (or a fake one),
        // so we handle like we would a normal HTML change event.
        if (!isString(eventOrTextValue)) {
            // If we can, persist the event
            // @see https://reactjs.org/docs/events.html#event-pooling
            if (eventOrTextValue.persist) {
                eventOrTextValue.persist();
            }
            const target = eventOrTextValue.target
                ? eventOrTextValue.target
                : eventOrTextValue.currentTarget;
            const { type, name, id, value, checked, outerHTML, options, multiple, } = target;
            field = maybePath ? maybePath : name ? name : id;
            if (!field && false) {}
            val = /number|range/.test(type)
                ? ((parsed = parseFloat(value)), isNaN(parsed) ? '' : parsed)
                : /checkbox/.test(type) // checkboxes
                    ? getValueForCheckbox(getIn(state.values, field), checked, value)
                    : options && multiple // <select multiple>
                        ? getSelectedValues(options)
                        : value;
        }
        if (field) {
            // Set form fields by name
            setFieldValue(field, val);
        }
    }, [setFieldValue, state.values]);
    const handleChange = useEventCallback((eventOrPath) => {
        if (isString(eventOrPath)) {
            return event => executeChange(event, eventOrPath);
        }
        else {
            executeChange(eventOrPath);
        }
    });
    const setFieldTouched = useEventCallback((field, touched = true, shouldValidate) => {
        dispatch({
            type: 'SET_FIELD_TOUCHED',
            payload: {
                field,
                value: touched,
            },
        });
        const willValidate = shouldValidate === undefined ? validateOnBlur : shouldValidate;
        return willValidate
            ? validateFormWithHighPriority(state.values)
            : Promise.resolve();
    });
    const executeBlur = external_React_.useCallback((e, path) => {
        if (e.persist) {
            e.persist();
        }
        const { name, id, outerHTML } = e.target;
        const field = path ? path : name ? name : id;
        if (!field && false) {}
        setFieldTouched(field, true);
    }, [setFieldTouched]);
    const handleBlur = useEventCallback((eventOrString) => {
        if (isString(eventOrString)) {
            return event => executeBlur(event, eventOrString);
        }
        else {
            executeBlur(eventOrString);
        }
    });
    const setFormikState = external_React_.useCallback((stateOrCb) => {
        if (isFunction(stateOrCb)) {
            dispatch({ type: 'SET_FORMIK_STATE', payload: stateOrCb });
        }
        else {
            dispatch({ type: 'SET_FORMIK_STATE', payload: () => stateOrCb });
        }
    }, []);
    const setStatus = external_React_.useCallback((status) => {
        dispatch({ type: 'SET_STATUS', payload: status });
    }, []);
    const setSubmitting = external_React_.useCallback((isSubmitting) => {
        dispatch({ type: 'SET_ISSUBMITTING', payload: isSubmitting });
    }, []);
    const submitForm = useEventCallback(() => {
        dispatch({ type: 'SUBMIT_ATTEMPT' });
        return validateFormWithHighPriority().then((combinedErrors) => {
            // In case an error was thrown and passed to the resolved Promise,
            // `combinedErrors` can be an instance of an Error. We need to check
            // that and abort the submit.
            // If we don't do that, calling `Object.keys(new Error())` yields an
            // empty array, which causes the validation to pass and the form
            // to be submitted.
            const isInstanceOfError = combinedErrors instanceof Error;
            const isActuallyValid = !isInstanceOfError && Object.keys(combinedErrors).length === 0;
            if (isActuallyValid) {
                // Proceed with submit...
                //
                // To respect sync submit fns, we can't simply wrap executeSubmit in a promise and
                // _always_ dispatch SUBMIT_SUCCESS because isSubmitting would then always be false.
                // This would be fine in simple cases, but make it impossible to disable submit
                // buttons where people use callbacks or promises as side effects (which is basically
                // all of v1 Formik code). Instead, recall that we are inside of a promise chain already,
                //  so we can try/catch executeSubmit(), if it returns undefined, then just bail.
                // If there are errors, throw em. Otherwise, wrap executeSubmit in a promise and handle
                // cleanup of isSubmitting on behalf of the consumer.
                let promiseOrUndefined;
                try {
                    promiseOrUndefined = executeSubmit();
                    // Bail if it's sync, consumer is responsible for cleaning up
                    // via setSubmitting(false)
                    if (promiseOrUndefined === undefined) {
                        return;
                    }
                }
                catch (error) {
                    throw error;
                }
                return Promise.resolve(promiseOrUndefined)
                    .then(result => {
                    if (!!isMounted.current) {
                        dispatch({ type: 'SUBMIT_SUCCESS' });
                    }
                    return result;
                })
                    .catch(_errors => {
                    if (!!isMounted.current) {
                        dispatch({ type: 'SUBMIT_FAILURE' });
                        // This is a legit error rejected by the onSubmit fn
                        // so we don't want to break the promise chain
                        throw _errors;
                    }
                });
            }
            else if (!!isMounted.current) {
                // ^^^ Make sure Formik is still mounted before updating state
                dispatch({ type: 'SUBMIT_FAILURE' });
                // throw combinedErrors;
                if (isInstanceOfError) {
                    throw combinedErrors;
                }
            }
            return;
        });
    });
    const handleSubmit = useEventCallback((e) => {
        if (e && e.preventDefault && isFunction(e.preventDefault)) {
            e.preventDefault();
        }
        if (e && e.stopPropagation && isFunction(e.stopPropagation)) {
            e.stopPropagation();
        }
        // Warn if form submission is triggered by a <button> without a
        // specified `type` attribute during development. This mitigates
        // a common gotcha in forms with both reset and submit buttons,
        // where the dev forgets to add type="button" to the reset button.
        if (false) {}
        submitForm().catch(reason => {
            console.warn(`Warning: An unhandled error was caught from submitForm()`, reason);
        });
    });
    const imperativeMethods = {
        resetForm,
        validateForm: validateFormWithHighPriority,
        validateField,
        setErrors,
        setFieldError,
        setFieldTouched,
        setFieldValue,
        setStatus,
        setSubmitting,
        setTouched,
        setValues,
        setFormikState,
        submitForm,
    };
    const executeSubmit = useEventCallback(() => {
        return onSubmit(state.values, imperativeMethods);
    });
    const handleReset = useEventCallback(e => {
        if (e && e.preventDefault && isFunction(e.preventDefault)) {
            e.preventDefault();
        }
        if (e && e.stopPropagation && isFunction(e.stopPropagation)) {
            e.stopPropagation();
        }
        resetForm();
    });
    const getFieldMeta = external_React_.useCallback((name) => {
        return {
            value: getIn(state.values, name),
            error: getIn(state.errors, name),
            touched: !!getIn(state.touched, name),
            initialValue: getIn(initialValues.current, name),
            initialTouched: !!getIn(initialTouched.current, name),
            initialError: getIn(initialErrors.current, name),
        };
    }, [state.errors, state.touched, state.values]);
    const getFieldHelpers = external_React_.useCallback((name) => {
        return {
            setValue: (value, shouldValidate) => setFieldValue(name, value, shouldValidate),
            setTouched: (value, shouldValidate) => setFieldTouched(name, value, shouldValidate),
            setError: (value) => setFieldError(name, value),
        };
    }, [setFieldValue, setFieldTouched, setFieldError]);
    const getFieldProps = external_React_.useCallback((nameOrOptions) => {
        const isAnObject = isObject(nameOrOptions);
        const name = isAnObject
            ? nameOrOptions.name
            : nameOrOptions;
        const valueState = getIn(state.values, name);
        const field = {
            name,
            value: valueState,
            onChange: handleChange,
            onBlur: handleBlur,
        };
        if (isAnObject) {
            const { type, value: valueProp, // value is special for checkboxes
            as: is, multiple, } = nameOrOptions;
            if (type === 'checkbox') {
                if (valueProp === undefined) {
                    field.checked = !!valueState;
                }
                else {
                    field.checked = !!(Array.isArray(valueState) && ~valueState.indexOf(valueProp));
                    field.value = valueProp;
                }
            }
            else if (type === 'radio') {
                field.checked = valueState === valueProp;
                field.value = valueProp;
            }
            else if (is === 'select' && multiple) {
                field.value = field.value || [];
                field.multiple = true;
            }
        }
        return field;
    }, [handleBlur, handleChange, state.values]);
    const dirty = external_React_.useMemo(() => !react_fast_compare_default()(initialValues.current, state.values), [initialValues.current, state.values]);
    const isValid = external_React_.useMemo(() => typeof isInitialValid !== 'undefined'
        ? dirty
            ? state.errors && Object.keys(state.errors).length === 0
            : isInitialValid !== false && isFunction(isInitialValid)
                ? isInitialValid(props)
                : isInitialValid
        : state.errors && Object.keys(state.errors).length === 0, [isInitialValid, dirty, state.errors, props]);
    const ctx = {
        ...state,
        initialValues: initialValues.current,
        initialErrors: initialErrors.current,
        initialTouched: initialTouched.current,
        initialStatus: initialStatus.current,
        handleBlur,
        handleChange,
        handleReset,
        handleSubmit,
        resetForm,
        setErrors,
        setFormikState,
        setFieldTouched,
        setFieldValue,
        setFieldError,
        setStatus,
        setSubmitting,
        setTouched,
        setValues,
        submitForm,
        validateForm: validateFormWithHighPriority,
        validateField,
        isValid,
        dirty,
        unregisterField,
        registerField,
        getFieldProps,
        getFieldMeta,
        getFieldHelpers,
        validateOnBlur,
        validateOnChange,
        validateOnMount,
    };
    return ctx;
}
function Formik(props) {
    const formikbag = useFormik(props);
    const { component, children, render, innerRef } = props;
    // This allows folks to pass a ref to <Formik />
    external_React_.useImperativeHandle(innerRef, () => formikbag);
    if (false) {}
    return (external_React_.createElement(FormikProvider, { value: formikbag }, component
        ? external_React_.createElement(component, formikbag)
        : render
            ? render(formikbag)
            : children // children come last, always called
                ? isFunction(children)
                    ? children(formikbag)
                    : !isEmptyChildren(children)
                        ? external_React_.Children.only(children)
                        : null
                : null));
}
function warnAboutMissingIdentifier({ htmlContent, documentationAnchorLink, handlerName, }) {
    console.warn(`Warning: Formik called \`${handlerName}\`, but you forgot to pass an \`id\` or \`name\` attribute to your input:
    ${htmlContent}
    Formik cannot determine which value to update. For more info see https://formik.org/docs/api/formik#${documentationAnchorLink}
  `);
}
/**
 * Transform Yup ValidationError to a more usable object
 */
function yupToFormErrors(yupError) {
    let errors = {};
    if (yupError.inner) {
        if (yupError.inner.length === 0) {
            return setIn(errors, yupError.path, yupError.message);
        }
        for (let err of yupError.inner) {
            if (!getIn(errors, err.path)) {
                errors = setIn(errors, err.path, err.message);
            }
        }
    }
    return errors;
}
/**
 * Validate a yup schema.
 */
function validateYupSchema(values, schema, sync = false, context) {
    const normalizedValues = prepareDataForValidation(values);
    return schema[sync ? 'validateSync' : 'validate'](normalizedValues, {
        abortEarly: false,
        context: context || normalizedValues,
    });
}
/**
 * Recursively prepare values.
 */
function prepareDataForValidation(values) {
    let data = Array.isArray(values) ? [] : {};
    for (let k in values) {
        if (Object.prototype.hasOwnProperty.call(values, k)) {
            const key = String(k);
            if (Array.isArray(values[key]) === true) {
                data[key] = values[key].map((value) => {
                    if (Array.isArray(value) === true || isPlainObject_default()(value)) {
                        return prepareDataForValidation(value);
                    }
                    else {
                        return value !== '' ? value : undefined;
                    }
                });
            }
            else if (isPlainObject_default()(values[key])) {
                data[key] = prepareDataForValidation(values[key]);
            }
            else {
                data[key] = values[key] !== '' ? values[key] : undefined;
            }
        }
    }
    return data;
}
/**
 * deepmerge array merging algorithm
 * https://github.com/KyleAMathews/deepmerge#combine-array
 */
function arrayMerge(target, source, options) {
    const destination = target.slice();
    source.forEach(function merge(e, i) {
        if (typeof destination[i] === 'undefined') {
            const cloneRequested = options.clone !== false;
            const shouldClone = cloneRequested && options.isMergeableObject(e);
            destination[i] = shouldClone
                ? es(Array.isArray(e) ? [] : {}, e, options)
                : e;
        }
        else if (options.isMergeableObject(e)) {
            destination[i] = es(target[i], e, options);
        }
        else if (target.indexOf(e) === -1) {
            destination.push(e);
        }
    });
    return destination;
}
/** Return multi select values based on an array of options */
function getSelectedValues(options) {
    return Array.from(options)
        .filter(el => el.selected)
        .map(el => el.value);
}
/** Return the next value for a checkbox */
function getValueForCheckbox(currentValue, checked, valueProp) {
    // If the current value was a boolean, return a boolean
    if (typeof currentValue === 'boolean') {
        return Boolean(checked);
    }
    // If the currentValue was not a boolean we want to return an array
    let currentArrayOfValues = [];
    let isValueInArray = false;
    let index = -1;
    if (!Array.isArray(currentValue)) {
        // eslint-disable-next-line eqeqeq
        if (!valueProp || valueProp == 'true' || valueProp == 'false') {
            return Boolean(checked);
        }
    }
    else {
        // If the current value is already an array, use it
        currentArrayOfValues = currentValue;
        index = currentValue.indexOf(valueProp);
        isValueInArray = index >= 0;
    }
    // If the checkbox was checked and the value is not already present in the aray we want to add the new value to the array of values
    if (checked && valueProp && !isValueInArray) {
        return currentArrayOfValues.concat(valueProp);
    }
    // If the checkbox was unchecked and the value is not in the array, simply return the already existing array of values
    if (!isValueInArray) {
        return currentArrayOfValues;
    }
    // If the checkbox was unchecked and the value is in the array, remove the value and return the array
    return currentArrayOfValues
        .slice(0, index)
        .concat(currentArrayOfValues.slice(index + 1));
}
// React currently throws a warning when using useLayoutEffect on the server.
// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser.
// @see https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
const useIsomorphicLayoutEffect = typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined'
    ? external_React_.useLayoutEffect
    : external_React_.useEffect;
function useEventCallback(fn) {
    const ref = external_React_.useRef(fn);
    // we copy a ref to the callback scoped to the current state/props on each render
    useIsomorphicLayoutEffect(() => {
        ref.current = fn;
    });
    return external_React_.useCallback((...args) => ref.current.apply(void 0, args), []);
}

;// CONCATENATED MODULE: ./packages/formik/src/Field.tsx




function useField(propsOrFieldName) {
    const formik = useFormikContext();
    const { getFieldProps, getFieldMeta, getFieldHelpers, registerField, unregisterField, } = formik;
    const isAnObject = isObject(propsOrFieldName);
    // Normalize propsOrFieldName to FieldHookConfig<Val>
    const props = isAnObject
        ? propsOrFieldName
        : { name: propsOrFieldName };
    const { name: fieldName, validate: validateFn } = props;
    external_React_.useEffect(() => {
        if (fieldName) {
            registerField(fieldName, {
                validate: validateFn,
            });
        }
        return () => {
            if (fieldName) {
                unregisterField(fieldName);
            }
        };
    }, [registerField, unregisterField, fieldName, validateFn]);
    if (false) {}
    tiny_warning_esm(fieldName, 'Invalid field name. Either pass `useField` a string or an object containing a `name` key.');
    const fieldHelpers = external_React_.useMemo(() => getFieldHelpers(fieldName), [
        getFieldHelpers,
        fieldName,
    ]);
    return [getFieldProps(props), getFieldMeta(fieldName), fieldHelpers];
}
function Field({ validate, name, render, children, as: is, // `as` is reserved in typescript lol
component, className, ...props }) {
    const { validate: _validate, validationSchema: _validationSchema, ...formik } = useFormikContext();
    if (false) {}
    // Register field and field-level validation with parent <Formik>
    const { registerField, unregisterField } = formik;
    external_React_.useEffect(() => {
        registerField(name, {
            validate: validate,
        });
        return () => {
            unregisterField(name);
        };
    }, [registerField, unregisterField, name, validate]);
    const field = formik.getFieldProps({ name, ...props });
    const meta = formik.getFieldMeta(name);
    const legacyBag = { field, form: formik };
    if (render) {
        return render({ ...legacyBag, meta });
    }
    if (isFunction(children)) {
        return children({ ...legacyBag, meta });
    }
    if (component) {
        // This behavior is backwards compat with earlier Formik 0.9 to 1.x
        if (typeof component === 'string') {
            const { innerRef, ...rest } = props;
            return external_React_.createElement(component, { ref: innerRef, ...field, ...rest, className }, children);
        }
        // We don't pass `meta` for backwards compat
        return external_React_.createElement(component, { field, form: formik, ...props, className }, children);
    }
    // default to input here so we can check for both `as` and `children` above
    const asElement = is || 'input';
    if (typeof asElement === 'string') {
        const { innerRef, ...rest } = props;
        return external_React_.createElement(asElement, { ref: innerRef, ...field, ...rest, className }, children);
    }
    return external_React_.createElement(asElement, { ...field, ...props, className }, children);
}

;// CONCATENATED MODULE: ./packages/formik/src/Form.tsx


// @todo tests
const Form = external_React_.forwardRef((props, ref) => {
    // iOS needs an "action" attribute for nice input: https://stackoverflow.com/a/39485162/406725
    // We default the action to "#" in case the preventDefault fails (just updates the URL hash)
    const { action, ...rest } = props;
    const _action = action ?? '#';
    const { handleReset, handleSubmit } = useFormikContext();
    return (external_React_.createElement("form", { onSubmit: handleSubmit, ref: ref, onReset: handleReset, action: _action, ...rest }));
});
Form.displayName = 'Form';

// EXTERNAL MODULE: ./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js
var hoist_non_react_statics_cjs = __webpack_require__(8679);
var hoist_non_react_statics_cjs_default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics_cjs);
;// CONCATENATED MODULE: ./packages/formik/src/withFormik.tsx




/**
 * A public higher-order component to access the imperative API
 */
function withFormik({ mapPropsToValues = (vanillaProps) => {
    let val = {};
    for (let k in vanillaProps) {
        if (vanillaProps.hasOwnProperty(k) &&
            typeof vanillaProps[k] !== 'function') {
            // @todo TypeScript fix
            val[k] = vanillaProps[k];
        }
    }
    return val;
}, ...config }) {
    return function createFormik(Component) {
        const componentDisplayName = Component.displayName ||
            Component.name ||
            (Component.constructor && Component.constructor.name) ||
            'Component';
        /**
         * We need to use closures here for to provide the wrapped component's props to
         * the respective withFormik config methods.
         */
        class C extends external_React_.Component {
            static displayName = `WithFormik(${componentDisplayName})`;
            validate = (values) => {
                return config.validate(values, this.props);
            };
            validationSchema = () => {
                return isFunction(config.validationSchema)
                    ? config.validationSchema(this.props)
                    : config.validationSchema;
            };
            handleSubmit = (values, actions) => {
                return config.handleSubmit(values, {
                    ...actions,
                    props: this.props,
                });
            };
            /**
             * Just avoiding a render callback for perf here
             */
            renderFormComponent = (formikProps) => {
                return external_React_.createElement(Component, { ...this.props, ...formikProps });
            };
            render() {
                const { children, ...props } = this.props;
                return (external_React_.createElement(Formik, { ...props, ...config, validate: config.validate && this.validate, validationSchema: config.validationSchema && this.validationSchema, initialValues: mapPropsToValues(this.props), initialStatus: config.mapPropsToStatus && config.mapPropsToStatus(this.props), initialErrors: config.mapPropsToErrors && config.mapPropsToErrors(this.props), initialTouched: config.mapPropsToTouched && config.mapPropsToTouched(this.props), onSubmit: this.handleSubmit, children: this.renderFormComponent }));
            }
        }
        return hoist_non_react_statics_cjs_default()(C, Component // cast type to ComponentClass (even if SFC)
        );
    };
}

// EXTERNAL MODULE: ./packages/formik/node_modules/lodash/cloneDeep.js
var cloneDeep = __webpack_require__(6255);
var cloneDeep_default = /*#__PURE__*/__webpack_require__.n(cloneDeep);
;// CONCATENATED MODULE: ./packages/formik/src/connect.tsx




/**
 * Connect any component to Formik context, and inject as a prop called `formik`;
 * @param Comp React Component
 */
function connect(Comp) {
    const C = props => (external_React_.createElement(FormikConsumer, null, formik => {
        tiny_warning_esm(!!formik, `Formik context is undefined, please verify you are rendering <Form>, <Field>, <FastField>, <FieldArray>, or your custom context-using component as a child of a <Formik> component. Component name: ${Comp.name}`);
        return external_React_.createElement(Comp, { ...props, formik: formik });
    }));
    const componentDisplayName = Comp.displayName ||
        Comp.name ||
        (Comp.constructor && Comp.constructor.name) ||
        'Component';
    // Assign Comp to C.WrappedComponent so we can access the inner component in tests
    // For example, <Field.WrappedComponent /> gets us <FieldInner/>
    C.WrappedComponent = Comp;
    C.displayName = `FormikConnect(${componentDisplayName})`;
    return hoist_non_react_statics_cjs_default()(C, Comp // cast type to ComponentClass (even if SFC)
    );
}

;// CONCATENATED MODULE: ./packages/formik/src/FieldArray.tsx





/**
 * Some array helpers!
 */
const move = (array, from, to) => {
    const copy = copyArrayLike(array);
    const value = copy[from];
    copy.splice(from, 1);
    copy.splice(to, 0, value);
    return copy;
};
const swap = (arrayLike, indexA, indexB) => {
    const copy = copyArrayLike(arrayLike);
    const a = copy[indexA];
    copy[indexA] = copy[indexB];
    copy[indexB] = a;
    return copy;
};
const insert = (arrayLike, index, value) => {
    const copy = copyArrayLike(arrayLike);
    copy.splice(index, 0, value);
    return copy;
};
const replace = (arrayLike, index, value) => {
    const copy = copyArrayLike(arrayLike);
    copy[index] = value;
    return copy;
};
const copyArrayLike = (arrayLike) => {
    if (!arrayLike) {
        return [];
    }
    else if (Array.isArray(arrayLike)) {
        return [...arrayLike];
    }
    else {
        const maxIndex = Object.keys(arrayLike)
            .map(key => parseInt(key))
            .reduce((max, el) => (el > max ? el : max), 0);
        return Array.from({ ...arrayLike, length: maxIndex + 1 });
    }
};
const createAlterationHandler = (alteration, defaultFunction) => {
    const fn = typeof alteration === 'function' ? alteration : defaultFunction;
    return (data) => {
        if (Array.isArray(data) || isObject(data)) {
            const clone = copyArrayLike(data);
            return fn(clone);
        }
        // This can be assumed to be a primitive, which
        // is a case for top level validation errors
        return data;
    };
};
class FieldArrayInner extends external_React_.Component {
    static defaultProps = {
        validateOnChange: true,
    };
    constructor(props) {
        super(props);
        // We need TypeScript generics on these, so we'll bind them in the constructor
        // @todo Fix TS 3.2.1
        this.remove = this.remove.bind(this);
        this.pop = this.pop.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (this.props.validateOnChange &&
            this.props.formik.validateOnChange &&
            !react_fast_compare_default()(getIn(prevProps.formik.values, prevProps.name), getIn(this.props.formik.values, this.props.name))) {
            this.props.formik.validateForm(this.props.formik.values);
        }
    }
    updateArrayField = (fn, alterTouched, alterErrors) => {
        const { name, formik: { setFormikState }, } = this.props;
        setFormikState((prevState) => {
            let updateErrors = createAlterationHandler(alterErrors, fn);
            let updateTouched = createAlterationHandler(alterTouched, fn);
            // values fn should be executed before updateErrors and updateTouched,
            // otherwise it causes an error with unshift.
            let values = setIn(prevState.values, name, fn(getIn(prevState.values, name)));
            let fieldError = alterErrors
                ? updateErrors(getIn(prevState.errors, name))
                : undefined;
            let fieldTouched = alterTouched
                ? updateTouched(getIn(prevState.touched, name))
                : undefined;
            if (isEmptyArray(fieldError)) {
                fieldError = undefined;
            }
            if (isEmptyArray(fieldTouched)) {
                fieldTouched = undefined;
            }
            return {
                ...prevState,
                values,
                errors: alterErrors
                    ? setIn(prevState.errors, name, fieldError)
                    : prevState.errors,
                touched: alterTouched
                    ? setIn(prevState.touched, name, fieldTouched)
                    : prevState.touched,
            };
        });
    };
    push = (value) => this.updateArrayField((arrayLike) => [
        ...copyArrayLike(arrayLike),
        cloneDeep_default()(value),
    ], false, false);
    handlePush = (value) => () => this.push(value);
    swap = (indexA, indexB) => this.updateArrayField((array) => swap(array, indexA, indexB), true, true);
    handleSwap = (indexA, indexB) => () => this.swap(indexA, indexB);
    move = (from, to) => this.updateArrayField((array) => move(array, from, to), true, true);
    handleMove = (from, to) => () => this.move(from, to);
    insert = (index, value) => this.updateArrayField((array) => insert(array, index, value), (array) => insert(array, index, null), (array) => insert(array, index, null));
    handleInsert = (index, value) => () => this.insert(index, value);
    replace = (index, value) => this.updateArrayField((array) => replace(array, index, value), false, false);
    handleReplace = (index, value) => () => this.replace(index, value);
    unshift = (value) => {
        let length = -1;
        this.updateArrayField((array) => {
            const arr = array ? [value, ...array] : [value];
            length = arr.length;
            return arr;
        }, (array) => {
            return array ? [null, ...array] : [null];
        }, (array) => {
            return array ? [null, ...array] : [null];
        });
        return length;
    };
    handleUnshift = (value) => () => this.unshift(value);
    remove(index) {
        // We need to make sure we also remove relevant pieces of `touched` and `errors`
        let result;
        this.updateArrayField(
        // so this gets call 3 times
        (array) => {
            const copy = array ? copyArrayLike(array) : [];
            if (!result) {
                result = copy[index];
            }
            if (isFunction(copy.splice)) {
                copy.splice(index, 1);
            }
            // if the array only includes undefined values we have to return an empty array
            return isFunction(copy.every)
                ? copy.every(v => v === undefined)
                    ? []
                    : copy
                : copy;
        }, true, true);
        return result;
    }
    handleRemove = (index) => () => this.remove(index);
    pop() {
        // Remove relevant pieces of `touched` and `errors` too!
        let result;
        this.updateArrayField(
        // so this gets call 3 times
        (array) => {
            const tmp = array.slice();
            if (!result) {
                result = tmp && tmp.pop && tmp.pop();
            }
            return tmp;
        }, true, true);
        return result;
    }
    handlePop = () => () => this.pop();
    render() {
        const arrayHelpers = {
            push: this.push,
            pop: this.pop,
            swap: this.swap,
            move: this.move,
            insert: this.insert,
            replace: this.replace,
            unshift: this.unshift,
            remove: this.remove,
            handlePush: this.handlePush,
            handlePop: this.handlePop,
            handleSwap: this.handleSwap,
            handleMove: this.handleMove,
            handleInsert: this.handleInsert,
            handleReplace: this.handleReplace,
            handleUnshift: this.handleUnshift,
            handleRemove: this.handleRemove,
        };
        const { component, render, children, name, formik: { validate: _validate, validationSchema: _validationSchema, ...restOfFormik }, } = this.props;
        const props = {
            ...arrayHelpers,
            form: restOfFormik,
            name,
        };
        return component
            ? external_React_.createElement(component, props)
            : render
                ? render(props)
                : children // children come last, always called
                    ? typeof children === 'function'
                        ? children(props)
                        : !isEmptyChildren(children)
                            ? external_React_.Children.only(children)
                            : null
                    : null;
    }
}
const FieldArray = connect(FieldArrayInner);

;// CONCATENATED MODULE: ./packages/formik/src/ErrorMessage.tsx



class ErrorMessageImpl extends external_React_.Component {
    shouldComponentUpdate(props) {
        if (getIn(this.props.formik.errors, this.props.name) !==
            getIn(props.formik.errors, this.props.name) ||
            getIn(this.props.formik.touched, this.props.name) !==
                getIn(props.formik.touched, this.props.name) ||
            Object.keys(this.props).length !== Object.keys(props).length) {
            return true;
        }
        else {
            return false;
        }
    }
    render() {
        let { component, formik, render, children, name, ...rest } = this.props;
        const touch = getIn(formik.touched, name);
        const error = getIn(formik.errors, name);
        return !!touch && !!error
            ? render
                ? isFunction(render)
                    ? render(error)
                    : null
                : children
                    ? isFunction(children)
                        ? children(error)
                        : null
                    : component
                        ? external_React_.createElement(component, rest, error)
                        : error
            : null;
    }
}
const ErrorMessage = connect(ErrorMessageImpl);

;// CONCATENATED MODULE: ./packages/formik/src/FastField.tsx




/**
 * Custom Field component for quickly hooking into Formik
 * context and wiring up forms.
 */
class FastFieldInner extends external_React_.Component {
    constructor(props) {
        super(props);
        const { render, children, component, as: is, name } = props;
        tiny_warning_esm(!render, `<FastField render> has been deprecated. Please use a child callback function instead: <FastField name={${name}}>{props => ...}</FastField> instead.`);
        tiny_warning_esm(!(component && render), 'You should not use <FastField component> and <FastField render> in the same <FastField> component; <FastField component> will be ignored');
        tiny_warning_esm(!(is && children && isFunction(children)), 'You should not use <FastField as> and <FastField children> as a function in the same <FastField> component; <FastField as> will be ignored.');
        tiny_warning_esm(!(component && children && isFunction(children)), 'You should not use <FastField component> and <FastField children> as a function in the same <FastField> component; <FastField component> will be ignored.');
        tiny_warning_esm(!(render && children && !isEmptyChildren(children)), 'You should not use <FastField render> and <FastField children> in the same <FastField> component; <FastField children> will be ignored');
    }
    shouldComponentUpdate(props) {
        if (this.props.shouldUpdate) {
            return this.props.shouldUpdate(props, this.props);
        }
        else if (props.name !== this.props.name ||
            getIn(props.formik.values, this.props.name) !==
                getIn(this.props.formik.values, this.props.name) ||
            getIn(props.formik.errors, this.props.name) !==
                getIn(this.props.formik.errors, this.props.name) ||
            getIn(props.formik.touched, this.props.name) !==
                getIn(this.props.formik.touched, this.props.name) ||
            Object.keys(this.props).length !== Object.keys(props).length ||
            props.formik.isSubmitting !== this.props.formik.isSubmitting) {
            return true;
        }
        else {
            return false;
        }
    }
    componentDidMount() {
        // Register the Field with the parent Formik. Parent will cycle through
        // registered Field's validate fns right prior to submit
        this.props.formik.registerField(this.props.name, {
            validate: this.props.validate,
        });
    }
    componentDidUpdate(prevProps) {
        if (this.props.name !== prevProps.name) {
            this.props.formik.unregisterField(prevProps.name);
            this.props.formik.registerField(this.props.name, {
                validate: this.props.validate,
            });
        }
        if (this.props.validate !== prevProps.validate) {
            this.props.formik.registerField(this.props.name, {
                validate: this.props.validate,
            });
        }
    }
    componentWillUnmount() {
        this.props.formik.unregisterField(this.props.name);
    }
    render() {
        const { validate, name, render, as: is, children, component, shouldUpdate, formik, ...props } = this.props;
        const { validate: _validate, validationSchema: _validationSchema, ...restOfFormik } = formik;
        const field = formik.getFieldProps({ name, ...props });
        const meta = {
            value: getIn(formik.values, name),
            error: getIn(formik.errors, name),
            touched: !!getIn(formik.touched, name),
            initialValue: getIn(formik.initialValues, name),
            initialTouched: !!getIn(formik.initialTouched, name),
            initialError: getIn(formik.initialErrors, name),
        };
        const bag = { field, meta, form: restOfFormik };
        if (render) {
            return render(bag);
        }
        if (isFunction(children)) {
            return children(bag);
        }
        if (component) {
            // This behavior is backwards compat with earlier Formik 0.9 to 1.x
            if (typeof component === 'string') {
                const { innerRef, ...rest } = props;
                return external_React_.createElement(component, { ref: innerRef, ...field, ...rest }, children);
            }
            // We don't pass `meta` for backwards compat
            return external_React_.createElement(component, { field, form: formik, ...props }, children);
        }
        // default to input here so we can check for both `as` and `children` above
        const asElement = is || 'input';
        if (typeof asElement === 'string') {
            const { innerRef, ...rest } = props;
            return external_React_.createElement(asElement, { ref: innerRef, ...field, ...rest }, children);
        }
        return external_React_.createElement(asElement, { ...field, ...props }, children);
    }
}
const FastField = connect(FastFieldInner);

;// CONCATENATED MODULE: ./packages/formik/src/index.tsx












})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map