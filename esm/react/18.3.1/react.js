var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/react.esm.js
var react_esm_exports = {};
__export(react_esm_exports, {
  Children: () => Children,
  Component: () => Component,
  Fragment: () => REACT_FRAGMENT_TYPE,
  Profiler: () => REACT_PROFILER_TYPE,
  PureComponent: () => PureComponent,
  StrictMode: () => REACT_STRICT_MODE_TYPE,
  Suspense: () => REACT_SUSPENSE_TYPE,
  SuspenseList: () => REACT_SUSPENSE_LIST_TYPE,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: () => ReactSharedInternals,
  act: () => act,
  cloneElement: () => cloneElement$1,
  createContext: () => createContext,
  createElement: () => createElement$1,
  createFactory: () => createFactory$1,
  createRef: () => createRef,
  createServerContext: () => createServerContext,
  forwardRef: () => forwardRef,
  isValidElement: () => isValidElement,
  lazy: () => lazy,
  memo: () => memo,
  startTransition: () => startTransition,
  unstable_Cache: () => REACT_CACHE_TYPE,
  unstable_DebugTracingMode: () => REACT_DEBUG_TRACING_MODE_TYPE,
  unstable_Offscreen: () => REACT_OFFSCREEN_TYPE,
  unstable_act: () => act,
  unstable_getCacheForType: () => getCacheForType,
  unstable_getCacheSignal: () => getCacheSignal,
  unstable_useCacheRefresh: () => useCacheRefresh,
  useCallback: () => useCallback,
  useContext: () => useContext,
  useDebugValue: () => useDebugValue,
  useDeferredValue: () => useDeferredValue,
  useEffect: () => useEffect,
  useId: () => useId,
  useImperativeHandle: () => useImperativeHandle,
  useInsertionEffect: () => useInsertionEffect,
  useLayoutEffect: () => useLayoutEffect,
  useMemo: () => useMemo,
  useReducer: () => useReducer,
  useRef: () => useRef,
  useState: () => useState,
  useSyncExternalStore: () => useSyncExternalStore,
  useTransition: () => useTransition,
  version: () => ReactVersion
});
var ReactVersion = "18.3.1";
var REACT_ELEMENT_TYPE = Symbol.for("react.element");
var REACT_PORTAL_TYPE = Symbol.for("react.portal");
var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
var REACT_CONTEXT_TYPE = Symbol.for("react.context");
var REACT_SERVER_CONTEXT_TYPE = Symbol.for("react.server_context");
var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
var REACT_MEMO_TYPE = Symbol.for("react.memo");
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
var REACT_DEBUG_TRACING_MODE_TYPE = Symbol.for("react.debug_trace_mode");
var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
var REACT_CACHE_TYPE = Symbol.for("react.cache");
var REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED = Symbol.for("react.default_value");
var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = "@@iterator";
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== "object") {
    return null;
  }
  const maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
  if (typeof maybeIterator === "function") {
    return maybeIterator;
  }
  return null;
}
__name(getIteratorFn, "getIteratorFn");
var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function(publicInstance) {
    return false;
  },
  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueForceUpdate: function(publicInstance, callback, callerName) {
  },
  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueReplaceState: function(publicInstance, completeState, callback, callerName) {
  },
  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState: function(publicInstance, partialState, callback, callerName) {
  }
};
var assign = Object.assign;
var emptyObject = {};
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
__name(Component, "Component");
Component.prototype.isReactComponent = {};
Component.prototype.setState = function(partialState, callback) {
  if (typeof partialState !== "object" && typeof partialState !== "function" && partialState != null) {
    throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  }
  this.updater.enqueueSetState(this, partialState, callback, "setState");
};
Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
};
function ComponentDummy() {
}
__name(ComponentDummy, "ComponentDummy");
ComponentDummy.prototype = Component.prototype;
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
__name(PureComponent, "PureComponent");
var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent;
assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;
function createRef() {
  const refObject = {
    current: null
  };
  return refObject;
}
__name(createRef, "createRef");
var isArrayImpl = Array.isArray;
function isArray(a) {
  return isArrayImpl(a);
}
__name(isArray, "isArray");
var hasOwnProperty = Object.prototype.hasOwnProperty;
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};
var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};
function hasValidRef(config) {
  return config.ref !== void 0;
}
__name(hasValidRef, "hasValidRef");
function hasValidKey(config) {
  return config.key !== void 0;
}
__name(hasValidKey, "hasValidKey");
var ReactElement = /* @__PURE__ */ __name(function(type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type,
    key,
    ref,
    props,
    // Record the component responsible for creating this element.
    _owner: owner
  };
  return element;
}, "ReactElement");
function createElement(type, config, children) {
  let propName;
  const props = {};
  let key = null;
  let ref = null;
  let self = null;
  let source = null;
  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = "" + config.key;
    }
    self = config.__self === void 0 ? null : config.__self;
    source = config.__source === void 0 ? null : config.__source;
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === void 0) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}
__name(createElement, "createElement");
function createFactory(type) {
  const factory = createElement.bind(null, type);
  factory.type = type;
  return factory;
}
__name(createFactory, "createFactory");
function cloneAndReplaceKey(oldElement, newKey) {
  const newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
  return newElement;
}
__name(cloneAndReplaceKey, "cloneAndReplaceKey");
function cloneElement(element, config, children) {
  if (element === null || element === void 0) {
    throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
  }
  let propName;
  const props = assign({}, element.props);
  let key = element.key;
  let ref = element.ref;
  const self = element._self;
  const source = element._source;
  let owner = element._owner;
  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }
    if (hasValidKey(config)) {
      key = "" + config.key;
    }
    let defaultProps;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === void 0 && defaultProps !== void 0) {
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  }
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }
  return ReactElement(element.type, key, ref, self, source, owner, props);
}
__name(cloneElement, "cloneElement");
function isValidElement(object) {
  return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
__name(isValidElement, "isValidElement");
var SEPARATOR = ".";
var SUBSEPARATOR = ":";
function escape(key) {
  const escapeRegex = /[=:]/g;
  const escaperLookup = {
    "=": "=0",
    ":": "=2"
  };
  const escapedString = key.replace(escapeRegex, function(match) {
    return escaperLookup[match];
  });
  return "$" + escapedString;
}
__name(escape, "escape");
var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return text.replace(userProvidedKeyEscapeRegex, "$&/");
}
__name(escapeUserProvidedKey, "escapeUserProvidedKey");
function getElementKey(element, index) {
  if (typeof element === "object" && element !== null && element.key != null) {
    return escape("" + element.key);
  }
  return index.toString(36);
}
__name(getElementKey, "getElementKey");
function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
  const type = typeof children;
  if (type === "undefined" || type === "boolean") {
    children = null;
  }
  let invokeCallback = false;
  if (children === null) {
    invokeCallback = true;
  } else {
    switch (type) {
      case "string":
      case "number":
        invokeCallback = true;
        break;
      case "object":
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }
    }
  }
  if (invokeCallback) {
    const child2 = children;
    let mappedChild = callback(child2);
    const childKey = nameSoFar === "" ? SEPARATOR + getElementKey(child2, 0) : nameSoFar;
    if (isArray(mappedChild)) {
      let escapedChildKey = "";
      if (childKey != null) {
        escapedChildKey = escapeUserProvidedKey(childKey) + "/";
      }
      mapIntoArray(mappedChild, array, escapedChildKey, "", (c) => c);
    } else if (mappedChild != null) {
      if (isValidElement(mappedChild)) {
        mappedChild = cloneAndReplaceKey(
          mappedChild,
          // Keep both the (mapped) and old keys if they differ, just as
          // traverseAllChildren used to do for objects as children
          escapedPrefix + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
          (mappedChild.key && (!child2 || child2.key !== mappedChild.key) ? (
            // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
            // eslint-disable-next-line react-internal/safe-string-coercion
            escapeUserProvidedKey("" + mappedChild.key) + "/"
          ) : "") + childKey
        );
      }
      array.push(mappedChild);
    }
    return 1;
  }
  let child;
  let nextName;
  let subtreeCount = 0;
  const nextNamePrefix = nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;
  if (isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getElementKey(child, i);
      subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
    }
  } else {
    const iteratorFn = getIteratorFn(children);
    if (typeof iteratorFn === "function") {
      const iterableChildren = children;
      const iterator = iteratorFn.call(iterableChildren);
      let step;
      let ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getElementKey(child, ii++);
        subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
      }
    } else if (type === "object") {
      const childrenString = String(children);
      throw new Error("Objects are not valid as a React child (found: " + (childrenString === "[object Object]" ? "object with keys {" + Object.keys(children).join(", ") + "}" : childrenString) + "). If you meant to render a collection of children, use an array instead.");
    }
  }
  return subtreeCount;
}
__name(mapIntoArray, "mapIntoArray");
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  const result = [];
  let count = 0;
  mapIntoArray(children, result, "", "", function(child) {
    return func.call(context, child, count++);
  });
  return result;
}
__name(mapChildren, "mapChildren");
function countChildren(children) {
  let n = 0;
  mapChildren(children, () => {
    n++;
  });
  return n;
}
__name(countChildren, "countChildren");
function forEachChildren(children, forEachFunc, forEachContext) {
  mapChildren(children, function() {
    forEachFunc.apply(this, arguments);
  }, forEachContext);
}
__name(forEachChildren, "forEachChildren");
function toArray(children) {
  return mapChildren(children, (child) => child) || [];
}
__name(toArray, "toArray");
function onlyChild(children) {
  if (!isValidElement(children)) {
    throw new Error("React.Children.only expected to receive a single React element child.");
  }
  return children;
}
__name(onlyChild, "onlyChild");
function createContext(defaultValue) {
  const context = {
    $$typeof: REACT_CONTEXT_TYPE,
    // As a workaround to support multiple concurrent renderers, we categorize
    // some renderers as primary and others as secondary. We only expect
    // there to be two concurrent renderers at most: React Native (primary) and
    // Fabric (secondary); React DOM (primary) and React ART (secondary).
    // Secondary renderers store their context values on separate fields.
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    // Used to track how many concurrent renderers this context currently
    // supports within in a single renderer. Such as parallel server rendering.
    _threadCount: 0,
    // These are circular
    Provider: null,
    Consumer: null,
    // Add these to use same hidden class in VM as ServerContext
    _defaultValue: null,
    _globalName: null
  };
  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context
  };
  {
    context.Consumer = context;
  }
  return context;
}
__name(createContext, "createContext");
var Uninitialized = -1;
var Pending = 0;
var Resolved = 1;
var Rejected = 2;
function lazyInitializer(payload) {
  if (payload._status === Uninitialized) {
    const ctor = payload._result;
    const thenable = ctor();
    thenable.then((moduleObject) => {
      if (payload._status === Pending || payload._status === Uninitialized) {
        const resolved = payload;
        resolved._status = Resolved;
        resolved._result = moduleObject;
      }
    }, (error) => {
      if (payload._status === Pending || payload._status === Uninitialized) {
        const rejected = payload;
        rejected._status = Rejected;
        rejected._result = error;
      }
    });
    if (payload._status === Uninitialized) {
      const pending = payload;
      pending._status = Pending;
      pending._result = thenable;
    }
  }
  if (payload._status === Resolved) {
    const moduleObject = payload._result;
    return moduleObject.default;
  } else {
    throw payload._result;
  }
}
__name(lazyInitializer, "lazyInitializer");
function lazy(ctor) {
  const payload = {
    // We use these fields to store the result.
    _status: Uninitialized,
    _result: ctor
  };
  const lazyType = {
    $$typeof: REACT_LAZY_TYPE,
    _payload: payload,
    _init: lazyInitializer
  };
  return lazyType;
}
__name(lazy, "lazy");
function forwardRef(render) {
  const elementType = {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render
  };
  return elementType;
}
__name(forwardRef, "forwardRef");
function memo(type, compare) {
  const elementType = {
    $$typeof: REACT_MEMO_TYPE,
    type,
    compare: compare === void 0 ? null : compare
  };
  return elementType;
}
__name(memo, "memo");
var ReactCurrentDispatcher = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;
  return dispatcher;
}
__name(resolveDispatcher, "resolveDispatcher");
function getCacheSignal() {
  const dispatcher = resolveDispatcher();
  return dispatcher.getCacheSignal();
}
__name(getCacheSignal, "getCacheSignal");
function getCacheForType(resourceType) {
  const dispatcher = resolveDispatcher();
  return dispatcher.getCacheForType(resourceType);
}
__name(getCacheForType, "getCacheForType");
function useContext(Context) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useContext(Context);
}
__name(useContext, "useContext");
function useState(initialState) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
__name(useState, "useState");
function useReducer(reducer, initialArg, init) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}
__name(useReducer, "useReducer");
function useRef(initialValue) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useRef(initialValue);
}
__name(useRef, "useRef");
function useEffect(create, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}
__name(useEffect, "useEffect");
function useInsertionEffect(create, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useInsertionEffect(create, deps);
}
__name(useInsertionEffect, "useInsertionEffect");
function useLayoutEffect(create, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useLayoutEffect(create, deps);
}
__name(useLayoutEffect, "useLayoutEffect");
function useCallback(callback, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useCallback(callback, deps);
}
__name(useCallback, "useCallback");
function useMemo(create, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useMemo(create, deps);
}
__name(useMemo, "useMemo");
function useImperativeHandle(ref, create, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useImperativeHandle(ref, create, deps);
}
__name(useImperativeHandle, "useImperativeHandle");
function useDebugValue(value, formatterFn) {
}
__name(useDebugValue, "useDebugValue");
function useTransition() {
  const dispatcher = resolveDispatcher();
  return dispatcher.useTransition();
}
__name(useTransition, "useTransition");
function useDeferredValue(value) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useDeferredValue(value);
}
__name(useDeferredValue, "useDeferredValue");
function useId() {
  const dispatcher = resolveDispatcher();
  return dispatcher.useId();
}
__name(useId, "useId");
function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
__name(useSyncExternalStore, "useSyncExternalStore");
function useCacheRefresh() {
  const dispatcher = resolveDispatcher();
  return dispatcher.useCacheRefresh();
}
__name(useCacheRefresh, "useCacheRefresh");
var ReactCurrentBatchConfig = {
  transition: null
};
var ContextRegistry = {};
var ReactSharedInternals = {
  ReactCurrentDispatcher,
  ReactCurrentBatchConfig,
  ReactCurrentOwner
};
{
  ReactSharedInternals.ContextRegistry = ContextRegistry;
}
var ContextRegistry$1 = ReactSharedInternals.ContextRegistry;
function createServerContext(globalName, defaultValue) {
  let wasDefined = true;
  if (!ContextRegistry$1[globalName]) {
    wasDefined = false;
    const context2 = {
      $$typeof: REACT_SERVER_CONTEXT_TYPE,
      // As a workaround to support multiple concurrent renderers, we categorize
      // some renderers as primary and others as secondary. We only expect
      // there to be two concurrent renderers at most: React Native (primary) and
      // Fabric (secondary); React DOM (primary) and React ART (secondary).
      // Secondary renderers store their context values on separate fields.
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      _defaultValue: defaultValue,
      // Used to track how many concurrent renderers this context currently
      // supports within in a single renderer. Such as parallel server rendering.
      _threadCount: 0,
      // These are circular
      Provider: null,
      Consumer: null,
      _globalName: globalName
    };
    context2.Provider = {
      $$typeof: REACT_PROVIDER_TYPE,
      _context: context2
    };
    ContextRegistry$1[globalName] = context2;
  }
  const context = ContextRegistry$1[globalName];
  if (context._defaultValue === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED) {
    context._defaultValue = defaultValue;
    if (context._currentValue === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED) {
      context._currentValue = defaultValue;
    }
    if (context._currentValue2 === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED) {
      context._currentValue2 = defaultValue;
    }
  } else if (wasDefined) {
    throw new Error("ServerContext: " + globalName + " already defined");
  }
  return context;
}
__name(createServerContext, "createServerContext");
function startTransition(scope, options) {
  const prevTransition = ReactCurrentBatchConfig.transition;
  ReactCurrentBatchConfig.transition = {};
  try {
    scope();
  } finally {
    ReactCurrentBatchConfig.transition = prevTransition;
  }
}
__name(startTransition, "startTransition");
function act(callback) {
  {
    throw new Error("act(...) is not supported in production builds of React.");
  }
}
__name(act, "act");
var createElement$1 = createElement;
var cloneElement$1 = cloneElement;
var createFactory$1 = createFactory;
var Children = {
  map: mapChildren,
  forEach: forEachChildren,
  count: countChildren,
  toArray,
  only: onlyChild
};

// src/react.mjs
var react_default = react_esm_exports;
export {
  Children,
  Component,
  REACT_FRAGMENT_TYPE as Fragment,
  REACT_PROFILER_TYPE as Profiler,
  PureComponent,
  REACT_STRICT_MODE_TYPE as StrictMode,
  REACT_SUSPENSE_TYPE as Suspense,
  REACT_SUSPENSE_LIST_TYPE as SuspenseList,
  ReactSharedInternals as __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  act,
  cloneElement$1 as cloneElement,
  createContext,
  createElement$1 as createElement,
  createFactory$1 as createFactory,
  createRef,
  createServerContext,
  react_default as default,
  forwardRef,
  isValidElement,
  lazy,
  memo,
  startTransition,
  REACT_CACHE_TYPE as unstable_Cache,
  REACT_DEBUG_TRACING_MODE_TYPE as unstable_DebugTracingMode,
  REACT_OFFSCREEN_TYPE as unstable_Offscreen,
  act as unstable_act,
  getCacheForType as unstable_getCacheForType,
  getCacheSignal as unstable_getCacheSignal,
  useCacheRefresh as unstable_useCacheRefresh,
  useCallback,
  useContext,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  ReactVersion as version
};
//# sourceMappingURL=react.js.map
