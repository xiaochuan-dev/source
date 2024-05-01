(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("ReactRouterDOM "));
	else if(typeof define === 'function' && define.amd)
		define(["React", "ReactRouterDOM "], factory);
	else if(typeof exports === 'object')
		exports["ReactRouterCacheRoute"] = factory(require("React"), require("ReactRouterDOM "));
	else
		root["ReactRouterCacheRoute"] = factory(root["React"], root["ReactRouterDOM "]);
})(self, (__WEBPACK_EXTERNAL_MODULE__883__, __WEBPACK_EXTERNAL_MODULE__710__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 223:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = __webpack_require__(360);
function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;
module.exports = function () {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error('Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use PropTypes.checkPropTypes() to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
    err.name = 'Invariant Violation';
    throw err;
  }
  ;
  shim.isRequired = shim;
  function getShim() {
    return shim;
  }
  ;
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,
    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,
    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };
  ReactPropTypes.PropTypes = ReactPropTypes;
  return ReactPropTypes;
};

/***/ }),

/***/ 979:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (false) { var throwOnDirectAccess, ReactIs; } else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(223)();
}

/***/ }),

/***/ 360:
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
module.exports = ReactPropTypesSecret;

/***/ }),

/***/ 883:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__883__;

/***/ }),

/***/ 710:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__710__;

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
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  CacheRoute: () => (/* reexport */ CacheRoute),
  CacheSwitch: () => (/* reexport */ components_CacheSwitch),
  clearCache: () => (/* reexport */ clearCache),
  "default": () => (/* reexport */ CacheRoute),
  dropByCacheKey: () => (/* reexport */ dropByCacheKey),
  getCachingComponents: () => (/* reexport */ getCachingComponents),
  getCachingKeys: () => (/* reexport */ getCachingKeys),
  refreshByCacheKey: () => (/* reexport */ refreshByCacheKey),
  useDidCache: () => (/* reexport */ useDidCache),
  useDidRecover: () => (/* reexport */ useDidRecover)
});

// EXTERNAL MODULE: external "React"
var external_React_ = __webpack_require__(883);
var external_React_default = /*#__PURE__*/__webpack_require__.n(external_React_);
// EXTERNAL MODULE: ./node_modules/prop-types/index.js
var prop_types = __webpack_require__(979);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: external "ReactRouterDOM "
var external_ReactRouterDOM_ = __webpack_require__(710);
;// CONCATENATED MODULE: ./src/helpers/base/is.js
// 值类型判断 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const isUndefined = val => typeof val === 'undefined';
const isNull = val => val === null;
const isFunction = val => typeof val === 'function';
const isString = val => typeof val === 'string';
const isExist = val => !(isUndefined(val) || isNull(val));
const isArray = val => val instanceof Array;
const is_isNaN = val => val !== val;
const isNumber = val => typeof val === 'number' && !is_isNaN(val);
// 值类型判断 -------------------------------------------------------------
;// CONCATENATED MODULE: ./src/helpers/base/try/index.js

const get = (obj, keys = [], defaultValue) => {
  try {
    if (isNumber(keys)) {
      keys = String(keys);
    }
    let result = (isString(keys) ? keys.split('.') : keys).reduce((res, key) => res[key], obj);
    return isUndefined(result) ? defaultValue : result;
  } catch (e) {
    return defaultValue;
  }
};
const run = (obj, keys = [], ...args) => {
  keys = isString(keys) ? keys.split('.') : keys;
  const func = get(obj, keys);
  const context = get(obj, keys.slice(0, -1));
  return isFunction(func) ? func.call(context, ...args) : func;
};
const value = (...values) => values.reduce((value, nextValue) => isUndefined(value) ? run(nextValue) : run(value), undefined);
;// CONCATENATED MODULE: ./src/helpers/base/globalThis.js
const getImplementation = () => {
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof __webpack_require__.g !== 'undefined') {
    return __webpack_require__.g;
  }
  throw new Error('unable to locate global object');
};
const implementation = getImplementation();
const getGlobal = () => {
  if (typeof __webpack_require__.g !== 'object' || !__webpack_require__.g || __webpack_require__.g.Math !== Math || __webpack_require__.g.Array !== Array) {
    return implementation;
  }
  return __webpack_require__.g;
};
const globalThis_globalThis = getGlobal();
/* harmony default export */ const base_globalThis = (globalThis_globalThis);
;// CONCATENATED MODULE: ./src/helpers/utils.js

const nextTick = func => Promise.resolve().then(func);
const flatten = array => array.reduce((res, item) => [...res, ...(isArray(item) ? flatten(item) : [item])], []);

/**
 * [钳子] 用来将数字限制在给定范围内
 * @param {Number} value 被限制值
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
const clamp = (value, min, max = Number.MAX_VALUE) => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};
const ObjectValues = object => {
  const res = [];
  for (let key in object) {
    res.push(object[key]);
  }
  return res;
};
;// CONCATENATED MODULE: ./src/helpers/saveScrollPosition.js




const body = get(base_globalThis, 'document.body');
const screenScrollingElement = get(base_globalThis, 'document.scrollingElement', get(base_globalThis, 'document.documentElement', {}));
function isScrollableNode(node = {}) {
  if (!isExist(node)) {
    return false;
  }
  return node.scrollWidth > node.clientWidth || node.scrollHeight > node.clientHeight;
}
function getScrollableNodes(from) {
  if (!isFunction(get(base_globalThis, 'document.getElementById'))) {
    return [];
  }
  return [...value(run(from, 'querySelectorAll', '*'), []), from].filter(isScrollableNode);
}
function saveScrollPosition(from) {
  const nodes = [...new Set([...flatten((!isArray(from) ? [from] : from).map(getScrollableNodes)), ...[screenScrollingElement, body].filter(isScrollableNode)])];
  const saver = nodes.map(node => [node, {
    x: node.scrollLeft,
    y: node.scrollTop
  }]);
  return function revert() {
    saver.forEach(([node, {
      x,
      y
    }]) => {
      node.scrollLeft = x;
      node.scrollTop = y;
    });
  };
}
;// CONCATENATED MODULE: ./src/helpers/index.js





;// CONCATENATED MODULE: ./src/core/manager.js


const __components = {};
const getCachedComponentEntries = () => Object.entries(__components).filter(([, cache]) => cache instanceof CacheComponent ? cache.state.cached : Object.values(cache).some(cache => cache.state.cached));
const getCache = () => ({
  ...__components
});
const register = (key, component) => {
  __components[key] = component;
};
const remove = key => {
  delete __components[key];
};
const dropComponent = component => run(component, 'reset');
const dropByCacheKey = key => {
  const cache = get(__components, [key]);
  if (!cache) {
    return;
  }
  if (cache instanceof CacheComponent) {
    dropComponent(cache);
  } else {
    Object.values(cache).forEach(dropComponent);
  }
};
const refreshComponent = component => run(component, 'refresh');
const refreshByCacheKey = key => {
  const cache = get(__components, [key]);
  if (!cache) {
    return;
  }
  if (cache instanceof CacheComponent) {
    refreshComponent(cache);
  } else {
    Object.values(cache).forEach(refreshComponent);
  }
};
const clearCache = () => {
  getCachedComponentEntries().forEach(([key]) => dropByCacheKey(key));
};
const getCachingKeys = () => getCachedComponentEntries().map(([key]) => key);
const getCachingComponents = () => getCachedComponentEntries().reduce((res, [key, cache]) => ({
  ...res,
  ...(cache instanceof CacheComponent ? {
    [key]: cache
  } : Object.entries(cache).reduce((res, [pathname, cache]) => ({
    ...res,
    [`${key}.${pathname}`]: cache
  }), {}))
}), {});
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
;// CONCATENATED MODULE: ./node_modules/mini-create-react-context/dist/esm/index.js




var MAX_SIGNED_31_BIT_INT = 1073741823;
var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : {};
function getUniqueId() {
  var key = '__global_unique_id__';
  return commonjsGlobal[key] = (commonjsGlobal[key] || 0) + 1;
}
function objectIs(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}
function createEventEmitter(value) {
  var handlers = [];
  return {
    on: function on(handler) {
      handlers.push(handler);
    },
    off: function off(handler) {
      handlers = handlers.filter(function (h) {
        return h !== handler;
      });
    },
    get: function get() {
      return value;
    },
    set: function set(newValue, changedBits) {
      value = newValue;
      handlers.forEach(function (handler) {
        return handler(value, changedBits);
      });
    }
  };
}
function onlyChild(children) {
  return Array.isArray(children) ? children[0] : children;
}
function createReactContext(defaultValue, calculateChangedBits) {
  var _Provider$childContex, _Consumer$contextType;
  var contextProp = '__create-react-context-' + getUniqueId() + '__';
  var Provider = /*#__PURE__*/function (_Component) {
    _inheritsLoose(Provider, _Component);
    function Provider() {
      var _this;
      _this = _Component.apply(this, arguments) || this;
      _this.emitter = createEventEmitter(_this.props.value);
      return _this;
    }
    var _proto = Provider.prototype;
    _proto.getChildContext = function getChildContext() {
      var _ref;
      return _ref = {}, _ref[contextProp] = this.emitter, _ref;
    };
    _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      if (this.props.value !== nextProps.value) {
        var oldValue = this.props.value;
        var newValue = nextProps.value;
        var changedBits;
        if (objectIs(oldValue, newValue)) {
          changedBits = 0;
        } else {
          changedBits = typeof calculateChangedBits === 'function' ? calculateChangedBits(oldValue, newValue) : MAX_SIGNED_31_BIT_INT;
          if (false) {}
          changedBits |= 0;
          if (changedBits !== 0) {
            this.emitter.set(nextProps.value, changedBits);
          }
        }
      }
    };
    _proto.render = function render() {
      return this.props.children;
    };
    return Provider;
  }(external_React_.Component);
  Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[contextProp] = (prop_types_default()).object.isRequired, _Provider$childContex);
  var Consumer = /*#__PURE__*/function (_Component2) {
    _inheritsLoose(Consumer, _Component2);
    function Consumer() {
      var _this2;
      _this2 = _Component2.apply(this, arguments) || this;
      _this2.state = {
        value: _this2.getValue()
      };
      _this2.onUpdate = function (newValue, changedBits) {
        var observedBits = _this2.observedBits | 0;
        if ((observedBits & changedBits) !== 0) {
          _this2.setState({
            value: _this2.getValue()
          });
        }
      };
      return _this2;
    }
    var _proto2 = Consumer.prototype;
    _proto2.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      var observedBits = nextProps.observedBits;
      this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT : observedBits;
    };
    _proto2.componentDidMount = function componentDidMount() {
      if (this.context[contextProp]) {
        this.context[contextProp].on(this.onUpdate);
      }
      var observedBits = this.props.observedBits;
      this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT : observedBits;
    };
    _proto2.componentWillUnmount = function componentWillUnmount() {
      if (this.context[contextProp]) {
        this.context[contextProp].off(this.onUpdate);
      }
    };
    _proto2.getValue = function getValue() {
      if (this.context[contextProp]) {
        return this.context[contextProp].get();
      } else {
        return defaultValue;
      }
    };
    _proto2.render = function render() {
      return onlyChild(this.props.children)(this.state.value);
    };
    return Consumer;
  }(external_React_.Component);
  Consumer.contextTypes = (_Consumer$contextType = {}, _Consumer$contextType[contextProp] = (prop_types_default()).object, _Consumer$contextType);
  return {
    Provider: Provider,
    Consumer: Consumer
  };
}
var index = (external_React_default()).createContext || createReactContext;
/* harmony default export */ const esm = (index);
;// CONCATENATED MODULE: ./src/core/context.js



const context = esm();
/* harmony default export */ const core_context = ((/* unused pure expression or super */ null && (context)));
const {
  Provider,
  Consumer
} = context;
function useCacheRoute(lifecycleName, effect, deps = []) {
  if (!isFunction(external_React_.useContext)) {
    return;
  }
  const effectRef = (0,external_React_.useRef)(() => null);
  effectRef.current = effect;
  const cacheLifecycles = (0,external_React_.useContext)(context);
  (0,external_React_.useEffect)(() => {
    const off = run(cacheLifecycles, 'on', lifecycleName, () => {
      run(effectRef.current);
    });
    return () => run(off);
  }, []);
}
const useDidCache = useCacheRoute.bind(null, 'didCache');
const useDidRecover = useCacheRoute.bind(null, 'didRecover');
;// CONCATENATED MODULE: ./src/core/CacheComponent.js
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }





const isUsingNewLifecycle = isExist((external_React_default()).forwardRef);
const COMPUTED_UNMATCH_KEY = '__isComputedUnmatch';
const isMatch = match => isExist(match) && get(match, COMPUTED_UNMATCH_KEY) !== true;
const getDerivedStateFromProps = (nextProps, prevState) => {
  let {
    match: nextPropsMatch,
    when = 'forward'
  } = nextProps;

  /**
   * Note:
   * Turn computedMatch from CacheSwitch to a real null value
   *
   * 将 CacheSwitch 计算得到的 computedMatch 值转换为真正的 null
   */
  if (!isMatch(nextPropsMatch)) {
    nextPropsMatch = null;
  }
  if (!prevState.cached && nextPropsMatch) {
    return {
      cached: true,
      matched: true
    };
  }

  /**
   * Determines whether it needs to cancel the cache based on the next unmatched props action
   *
   * 根据下个未匹配状态动作决定是否需要取消缓存
   */
  if (prevState.matched && !nextPropsMatch) {
    const nextAction = get(nextProps, 'history.action');
    let __cancel__cache = false;
    if (isFunction(when)) {
      __cancel__cache = !when(nextProps);
    } else {
      switch (when) {
        case 'always':
          break;
        case 'back':
          if (['PUSH', 'REPLACE'].includes(nextAction)) {
            __cancel__cache = true;
          }
          break;
        case 'forward':
        default:
          if (nextAction === 'POP') {
            __cancel__cache = true;
          }
      }
    }
    if (__cancel__cache) {
      return {
        cached: false,
        matched: false
      };
    }
  }
  return {
    matched: !!nextPropsMatch
  };
};
class CacheComponent extends external_React_.Component {
  static __name = 'CacheComponent';
  static propsTypes = {
    history: (prop_types_default()).object.isRequired,
    match: (prop_types_default()).object.isRequired,
    children: (prop_types_default()).func.isRequired,
    className: (prop_types_default()).string,
    when: prop_types_default().oneOfType([(prop_types_default()).func, prop_types_default().oneOf(['forward', 'back', 'always'])]),
    behavior: (prop_types_default()).func,
    unmount: (prop_types_default()).bool,
    saveScrollPosition: (prop_types_default()).bool
  };
  static defaultProps = {
    when: 'forward',
    unmount: false,
    saveScrollPosition: false,
    behavior: cached => cached ? {
      style: {
        display: 'none'
      }
    } : undefined
  };
  constructor(props, ...args) {
    super(props, ...args);
    this.__cacheCreateTime = Date.now();
    this.__cacheUpdateTime = this.__cacheCreateTime;
    if (props.cacheKey) {
      const cacheKey = run(props.cacheKey, undefined, props);
      if (props.multiple) {
        const {
          href
        } = props;
        register(cacheKey, {
          ...getCache()[cacheKey],
          [href]: this
        });
      } else {
        register(cacheKey, this);
      }
    }
    if (typeof document !== 'undefined') {
      const cacheKey = run(props.cacheKey, undefined, props);
      this.__placeholderNode = document.createComment(` Route cached ${cacheKey ? `with cacheKey: "${cacheKey}" ` : ''}`);
    }
    this.state = getDerivedStateFromProps(props, {
      cached: false,
      matched: false,
      key: Math.random()
    });
  }
  cacheLifecycles = {
    __listener: {},
    __didCacheListener: {},
    __didRecoverListener: {},
    on: (eventName, func) => {
      const id = Math.random();
      const listenerKey = `__${eventName}Listener`;
      this.cacheLifecycles[listenerKey][id] = func;
      return () => {
        delete this.cacheLifecycles[listenerKey][id];
      };
    },
    didCache: listener => {
      this.cacheLifecycles.__listener['didCache'] = listener;
    },
    didRecover: listener => {
      this.cacheLifecycles.__listener['didRecover'] = listener;
    }
  };

  /**
   * New lifecycle for replacing the `componentWillReceiveProps` in React 16.3 +
   * React 16.3 + 版本中替代 componentWillReceiveProps 的新生命周期
   */
  static getDerivedStateFromProps = isUsingNewLifecycle ? getDerivedStateFromProps : undefined;

  /**
   * Compatible React 16.3 -
   * 兼容 React 16.3 - 版本
   */
  componentWillReceiveProps = !isUsingNewLifecycle ? nextProps => {
    const nextState = getDerivedStateFromProps(nextProps, this.state);
    this.setState(nextState);
  } : undefined;
  __parentNode;
  __placeholderNode;
  __revertScrollPos;
  injectDOM = () => {
    try {
      run(this.__parentNode, 'insertBefore', this.wrapper, this.__placeholderNode);
      run(this.__parentNode, 'removeChild', this.__placeholderNode);
    } catch (err) {
      // nothing
    }
  };
  ejectDOM = () => {
    try {
      const parentNode = get(this.wrapper, 'parentNode');
      this.__parentNode = parentNode;
      run(this.__parentNode, 'insertBefore', this.__placeholderNode, this.wrapper);
      run(this.__parentNode, 'removeChild', this.wrapper);
    } catch (err) {
      // nothing
    }
  };
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.cached || !this.state.cached) {
      return;
    }
    if (prevState.matched === true && this.state.matched === false) {
      if (this.props.unmount) {
        this.ejectDOM();
      }
      this.__cacheUpdateTime = Date.now();
      ObjectValues(this.cacheLifecycles.__didCacheListener).forEach(func => {
        run(func);
      });
      return run(this, 'cacheLifecycles.__listener.didCache');
    }
    if (prevState.matched === false && this.state.matched === true) {
      if (this.props.saveScrollPosition) {
        run(this.__revertScrollPos);
      }
      this.__cacheUpdateTime = Date.now();
      ObjectValues(this.cacheLifecycles.__didRecoverListener).forEach(func => {
        run(func);
      });
      return run(this, 'cacheLifecycles.__listener.didRecover');
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const willRecover = this.state.matched === false && nextState.matched === true;
    const willDrop = this.state.cached === true && nextState.cached === false;
    const shouldUpdate = this.state.matched || nextState.matched || this.state.cached !== nextState.cached;
    if (shouldUpdate) {
      if (this.props.unmount && willDrop || willRecover) {
        this.injectDOM();
      }
      if (!(willDrop || willRecover) && this.props.saveScrollPosition) {
        this.__revertScrollPos = saveScrollPosition(this.props.unmount ? this.wrapper : undefined);
      }
    }
    return shouldUpdate;
  }
  componentWillUnmount() {
    const {
      unmount,
      href,
      multiple
    } = this.props;
    const cacheKey = run(this.props, 'cacheKey', this.props);
    if (multiple) {
      const cache = {
        ...getCache()[cacheKey]
      };
      delete cache[href];
      if (Object.keys(cache).length === 0) {
        remove(cacheKey);
      } else {
        register(cacheKey, cache);
      }
    } else {
      remove(cacheKey);
    }
    if (unmount) {
      this.injectDOM();
    }
  }
  reset = () => {
    delete this.__revertScrollPos;
    this.setState({
      cached: false
    });
  };
  refresh = () => {
    delete this.__revertScrollPos;
    this.setState({
      key: Math.random()
    });
  };
  render() {
    const {
      matched,
      cached,
      key
    } = this.state;
    const {
      className: propsClassName = '',
      behavior,
      children
    } = this.props;
    const {
      className: behaviorClassName = '',
      ...behaviorProps
    } = value(run(behavior, undefined, !matched), {});
    const className = run(`${propsClassName} ${behaviorClassName}`, 'trim');
    const hasClassName = className !== '';
    return cached ? /*#__PURE__*/external_React_default().createElement("div", _extends({
      key: key,
      className: hasClassName ? className : undefined
    }, behaviorProps, {
      ref: wrapper => {
        this.wrapper = wrapper;
      }
    }), /*#__PURE__*/external_React_default().createElement(Provider, {
      value: this.cacheLifecycles
    }, run(children, undefined, this.cacheLifecycles))) : null;
  }
}
;// CONCATENATED MODULE: ./src/core/Updatable/Freeze.js
// Fork from react-freeze
// https://github.com/software-mansion/react-freeze/blob/main/src/index.tsx


const isSupported = isFunction(external_React_.lazy) && !isUndefined(external_React_.Suspense);
const notSupportSuspense = !isSupported;
class Suspender extends external_React_.Component {
  promiseCache = {};
  render() {
    const {
      freeze,
      children
    } = this.props;
    const {
      promiseCache
    } = this;
    if (freeze && !promiseCache.promise) {
      promiseCache.promise = new Promise(resolve => {
        promiseCache.resolve = resolve;
      });
      throw promiseCache.promise;
    } else if (freeze) {
      throw promiseCache.promise;
    } else if (promiseCache.promise) {
      promiseCache.resolve();
      promiseCache.promise = undefined;
    }
    return /*#__PURE__*/external_React_default().createElement(external_React_.Fragment, null, children);
  }
}
function Freeze({
  freeze,
  children,
  placeholder = null
}) {
  if (notSupportSuspense) return children;
  return /*#__PURE__*/external_React_default().createElement(external_React_.Suspense, {
    fallback: placeholder
  }, /*#__PURE__*/external_React_default().createElement(Suspender, {
    freeze: freeze
  }, children));
}
;// CONCATENATED MODULE: ./src/core/Updatable/index.js




const isSusSupported = !!external_React_.Suspense;
const Updatable_Freeze = isSusSupported ? Freeze : ({
  children
}) => children;
class DelayFreeze extends external_React_.Component {
  static propsTypes = {
    freeze: (prop_types_default()).bool.isRequired
  };
  state = {
    freeze: false
  };
  constructor(props) {
    super(props);
    this.state = {
      freeze: props.freeze
    };
  }
  freezeTimeout = null;
  shouldComponentUpdate = ({
    freeze
  }) => {
    const currentFreeze = this.props.freeze;
    if (freeze !== currentFreeze) {
      clearTimeout(this.freezeTimeout);
      this.freezeTimeout = setTimeout(() => {
        this.setState({
          freeze
        });
      }, 1000);
    }
    return true;
  };
  render = () => /*#__PURE__*/external_React_default().createElement(Updatable_Freeze, {
    freeze: !this.props.freeze ? false : this.state.freeze
  }, run(this.props, 'children'));
}
class Updatable extends external_React_.Component {
  static propsTypes = {
    when: (prop_types_default()).bool.isRequired
  };
  render = () => run(this.props, 'children');
  shouldComponentUpdate = ({
    when
  }) => when;
}
/* harmony default export */ const core_Updatable = (props => /*#__PURE__*/external_React_default().createElement(DelayFreeze, {
  freeze: !props.when
}, /*#__PURE__*/external_React_default().createElement(Updatable, props)));
;// CONCATENATED MODULE: ./src/components/CacheRoute.js






const isEmptyChildren = children => external_React_default().Children.count(children) === 0;
const isFragmentable = isExist(external_React_.Fragment);
class CacheRoute extends external_React_.Component {
  static __name = 'CacheRoute';
  static propTypes = {
    component: (prop_types_default()).elementType || (prop_types_default()).any,
    render: (prop_types_default()).func,
    children: prop_types_default().oneOfType([(prop_types_default()).func, (prop_types_default()).node]),
    computedMatchForCacheRoute: (prop_types_default()).object,
    multiple: prop_types_default().oneOfType([(prop_types_default()).bool, (prop_types_default()).number])
  };
  static defaultProps = {
    multiple: false
  };
  cache = {};
  render() {
    let {
      children,
      render,
      component,
      className,
      when,
      behavior,
      cacheKey,
      unmount,
      saveScrollPosition,
      computedMatchForCacheRoute,
      multiple,
      ...restProps
    } = this.props;

    /**
     * Note:
     * If children prop is a React Element, define the corresponding wrapper component for supporting multiple children
     *
     * 说明：如果 children 属性是 React Element 则定义对应的包裹组件以支持多个子组件
     */
    if ( /*#__PURE__*/external_React_default().isValidElement(children) || !isEmptyChildren(children)) {
      render = () => children;
    }
    if (computedMatchForCacheRoute) {
      restProps.computedMatch = computedMatchForCacheRoute;
    }
    if (multiple && !isFragmentable) {
      multiple = false;
    }
    if (isNumber(multiple)) {
      multiple = clamp(multiple, 1);
    }
    return (
      /*#__PURE__*/
      /**
       * Only children prop of Route can help to control rendering behavior
       * 只有 Router 的 children 属性有助于主动控制渲染行为
       */
      external_React_default().createElement(external_ReactRouterDOM_.Route, restProps, props => {
        const {
          match,
          computedMatch,
          location
        } = props;
        const isMatchCurrentRoute = isMatch(props.match);
        const {
          pathname: currentPathname,
          search: currentSearch
        } = location;
        const maxMultipleCount = isNumber(multiple) ? multiple : Infinity;
        const configProps = {
          when,
          className,
          behavior,
          cacheKey,
          unmount,
          saveScrollPosition
        };
        const renderSingle = props => /*#__PURE__*/external_React_default().createElement(CacheComponent, props, cacheLifecycles => /*#__PURE__*/external_React_default().createElement(core_Updatable, {
          when: isMatch(props.match)
        }, () => {
          Object.assign(props, {
            cacheLifecycles
          });
          if (component) {
            return /*#__PURE__*/external_React_default().createElement(component, props);
          }
          return run(render || children, undefined, props);
        }));
        if (multiple && isMatchCurrentRoute) {
          const multipleCacheKey = currentPathname + currentSearch;
          this.cache[multipleCacheKey] = {
            updateTime: Date.now(),
            href: multipleCacheKey,
            pathname: currentPathname,
            render: renderSingle
          };
          Object.entries(this.cache).sort(([, prev], [, next]) => next.updateTime - prev.updateTime).forEach(([multipleCacheKey], idx) => {
            if (idx >= maxMultipleCount) {
              delete this.cache[multipleCacheKey];
            }
          });
        }
        return multiple ? /*#__PURE__*/external_React_default().createElement(external_React_.Fragment, null, Object.entries(this.cache).map(([multipleCacheKey, {
          render,
          href,
          pathname
        }]) => {
          const recomputedMatch = multipleCacheKey === currentPathname + currentSearch ? match || computedMatch : null;
          return /*#__PURE__*/external_React_default().createElement(external_React_.Fragment, {
            key: multipleCacheKey
          }, render({
            ...props,
            ...configProps,
            cacheKey,
            pathname,
            href,
            multiple: true,
            key: multipleCacheKey,
            match: recomputedMatch
          }));
        })) : renderSingle({
          ...props,
          ...configProps,
          pathname: currentPathname,
          href: currentPathname,
          multiple: false
        });
      })
    );
  }
}
;// CONCATENATED MODULE: ./src/components/SwitchFragment.js


function getFragment() {
  if (isExist(external_React_.Fragment)) {
    return ({
      children
    }) => /*#__PURE__*/external_React_default().createElement(external_React_.Fragment, null, children);
  }
  if (isExist(external_React_.PropTypes)) {
    return ({
      children
    }) => /*#__PURE__*/external_React_default().createElement("div", null, children);
  }
  return ({
    children
  }) => children;
}
const SwitchFragment = getFragment();
SwitchFragment.displayName = 'SwitchFragment';
/* harmony default export */ const components_SwitchFragment = (SwitchFragment);
;// CONCATENATED MODULE: ./src/components/CacheSwitch.js







const isUsingNewContext = isExist(external_ReactRouterDOM_.__RouterContext) || isExist(external_ReactRouterDOM_.useHistory);
class CacheSwitch extends external_ReactRouterDOM_.Switch {
  getContext = () => {
    if (isUsingNewContext) {
      const {
        location,
        match
      } = this.props;
      return {
        location,
        match
      };
    } else {
      const {
        route
      } = this.context.router;
      const location = this.props.location || route.location;
      return {
        location,
        match: route.match
      };
    }
  };
  render() {
    const {
      children,
      which
    } = this.props;
    const {
      location,
      match: contextMatch
    } = this.getContext();
    let __matchedAlready = false;
    return /*#__PURE__*/external_React_default().createElement(core_Updatable, {
      when: isMatch(contextMatch)
    }, () => /*#__PURE__*/external_React_default().createElement(components_SwitchFragment, null, external_React_default().Children.map(children, element => {
      if (! /*#__PURE__*/external_React_default().isValidElement(element)) {
        return null;
      }
      const path = element.props.path || element.props.from;
      const match = __matchedAlready ? null : path ? (0,external_ReactRouterDOM_.matchPath)(location.pathname, {
        ...element.props,
        path
      }, contextMatch) : contextMatch;
      let child;
      if (which(element)) {
        child = /*#__PURE__*/external_React_default().cloneElement(element, {
          location,
          computedMatch: match,
          /**
           * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/Route.js#L57
           *
           * Note:
           * Route would use computedMatch as its next match state ONLY when computedMatch is a true value
           * So here we have to do some trick to let the unmatch result pass Route's computedMatch check
           *
           * 注意：只有当 computedMatch 为真值时，Route 才会使用 computedMatch 作为其下一个匹配状态
           * 所以这里我们必须做一些手脚，让 unmatch 结果通过 Route 的 computedMatch 检查
           */
          ...(isNull(match) ? {
            computedMatchForCacheRoute: {
              [COMPUTED_UNMATCH_KEY]: true
            }
          } : null)
        });
      } else {
        child = match && !__matchedAlready ? /*#__PURE__*/external_React_default().cloneElement(element, {
          location,
          computedMatch: match
        }) : null;
      }
      if (!__matchedAlready) {
        __matchedAlready = !!match;
      }
      return child;
    })));
  }
}
if (isUsingNewContext) {
  CacheSwitch.propTypes = {
    children: (prop_types_default()).node,
    location: (prop_types_default()).object.isRequired,
    match: (prop_types_default()).object.isRequired,
    which: (prop_types_default()).func
  };
  CacheSwitch = (0,external_ReactRouterDOM_.withRouter)(CacheSwitch);
} else {
  CacheSwitch.contextTypes = {
    router: prop_types_default().shape({
      route: (prop_types_default()).object.isRequired
    }).isRequired
  };
  CacheSwitch.propTypes = {
    children: (prop_types_default()).node,
    location: (prop_types_default()).object,
    which: (prop_types_default()).func
  };
}
CacheSwitch.defaultProps = {
  which: element => get(element, 'type.__name') === 'CacheRoute'
};
/* harmony default export */ const components_CacheSwitch = (CacheSwitch);
;// CONCATENATED MODULE: ./src/index.js





})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map