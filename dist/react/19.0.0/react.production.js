(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.React = {}));
})(this, (function (exports) { 'use strict';

  const ReactVersion = '19.0.0-rc-0cb05427-20241220';

  const enableScopeAPI = false;
  const enableTransitionTracing = false;
  const enableLegacyHidden = false;
  const enableRenderableContext = true;
  const enableDebugTracing = false;

  const REACT_ELEMENT_TYPE = Symbol.for('react.transitional.element') ;
  const REACT_PORTAL_TYPE = Symbol.for('react.portal');
  const REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
  const REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
  const REACT_PROFILER_TYPE = Symbol.for('react.profiler');
  const REACT_PROVIDER_TYPE = Symbol.for('react.provider');
  const REACT_CONSUMER_TYPE = Symbol.for('react.consumer');
  const REACT_CONTEXT_TYPE = Symbol.for('react.context');
  const REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
  const REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
  const REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');
  const REACT_MEMO_TYPE = Symbol.for('react.memo');
  const REACT_LAZY_TYPE = Symbol.for('react.lazy');
  const REACT_SCOPE_TYPE = Symbol.for('react.scope');
  const REACT_DEBUG_TRACING_MODE_TYPE = Symbol.for('react.debug_trace_mode');
  const REACT_OFFSCREEN_TYPE = Symbol.for('react.offscreen');
  const REACT_LEGACY_HIDDEN_TYPE = Symbol.for('react.legacy_hidden');
  const REACT_TRACING_MARKER_TYPE = Symbol.for('react.tracing_marker');
  const MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  const FAUX_ITERATOR_SYMBOL = '@@iterator';
  function getIteratorFn(maybeIterable) {
    if (maybeIterable === null || typeof maybeIterable !== 'object') {
      return null;
    }

    const maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

    if (typeof maybeIterator === 'function') {
      return maybeIterator;
    }

    return null;
  }

  const didWarnStateUpdateForUnmountedComponent = {};

  function warnNoop(publicInstance, callerName) {
    {
      const constructor = publicInstance.constructor;
      const componentName = constructor && (constructor.displayName || constructor.name) || 'ReactClass';
      const warningKey = `${componentName}.${callerName}`;

      if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
        return;
      }

      console.error("Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);
      didWarnStateUpdateForUnmountedComponent[warningKey] = true;
    }
  }

  const ReactNoopUpdateQueue = {
    isMounted: function (publicInstance) {
      return false;
    },
    enqueueForceUpdate: function (publicInstance, callback, callerName) {
      warnNoop(publicInstance, 'forceUpdate');
    },
    enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
      warnNoop(publicInstance, 'replaceState');
    },
    enqueueSetState: function (publicInstance, partialState, callback, callerName) {
      warnNoop(publicInstance, 'setState');
    }
  };

  const assign = Object.assign;

  const emptyObject = {};

  {
    Object.freeze(emptyObject);
  }

  function Component(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }

  Component.prototype.isReactComponent = {};

  Component.prototype.setState = function (partialState, callback) {
    if (typeof partialState !== 'object' && typeof partialState !== 'function' && partialState != null) {
      throw new Error('takes an object of state variables to update or a ' + 'function which returns an object of state variables.');
    }

    this.updater.enqueueSetState(this, partialState, callback, 'setState');
  };

  Component.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
  };

  {
    const deprecatedAPIs = {
      isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
      replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
    };

    const defineDeprecationWarning = function (methodName, info) {
      Object.defineProperty(Component.prototype, methodName, {
        get: function () {
          console.warn('%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
          return undefined;
        }
      });
    };

    for (const fnName in deprecatedAPIs) {
      if (deprecatedAPIs.hasOwnProperty(fnName)) {
        defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      }
    }
  }

  function ComponentDummy() {}

  ComponentDummy.prototype = Component.prototype;

  function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }

  const pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
  pureComponentPrototype.constructor = PureComponent;
  assign(pureComponentPrototype, Component.prototype);
  pureComponentPrototype.isPureReactComponent = true;

  function createRef() {
    const refObject = {
      current: null
    };

    {
      Object.seal(refObject);
    }

    return refObject;
  }

  const isArrayImpl = Array.isArray;

  function isArray(a) {
    return isArrayImpl(a);
  }

  function typeName(value) {
    {
      const hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;
      const type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || 'Object';
      return type;
    }
  }

  function willCoercionThrow(value) {
    {
      try {
        testStringCoercion(value);
        return false;
      } catch (e) {
        return true;
      }
    }
  }

  function testStringCoercion(value) {
    return '' + value;
  }
  function checkKeyStringCoercion(value) {
    {
      if (willCoercionThrow(value)) {
        console.error('The provided key is an unsupported type %s.' + ' This value must be coerced to a string before using it here.', typeName(value));
        return testStringCoercion(value);
      }
    }
  }

  function getWrappedName(outerType, innerType, wrapperName) {
    const displayName = outerType.displayName;

    if (displayName) {
      return displayName;
    }

    const functionName = innerType.displayName || innerType.name || '';
    return functionName !== '' ? `${wrapperName}(${functionName})` : wrapperName;
  }

  function getContextName(type) {
    return type.displayName || 'Context';
  }

  const REACT_CLIENT_REFERENCE$2 = Symbol.for('react.client.reference');
  function getComponentNameFromType(type) {
    if (type == null) {
      return null;
    }

    if (typeof type === 'function') {
      if (type.$$typeof === REACT_CLIENT_REFERENCE$2) {
        return null;
      }

      return type.displayName || type.name || null;
    }

    if (typeof type === 'string') {
      return type;
    }

    switch (type) {
      case REACT_FRAGMENT_TYPE:
        return 'Fragment';

      case REACT_PORTAL_TYPE:
        return 'Portal';

      case REACT_PROFILER_TYPE:
        return 'Profiler';

      case REACT_STRICT_MODE_TYPE:
        return 'StrictMode';

      case REACT_SUSPENSE_TYPE:
        return 'Suspense';

      case REACT_SUSPENSE_LIST_TYPE:
        return 'SuspenseList';

    }

    if (typeof type === 'object') {
      {
        if (typeof type.tag === 'number') {
          console.error('Received an unexpected object in getComponentNameFromType(). ' + 'This is likely a bug in React. Please file an issue.');
        }
      }

      switch (type.$$typeof) {
        case REACT_PROVIDER_TYPE:
          {
            return null;
          }

        case REACT_CONTEXT_TYPE:
          const context = type;

          {
            return getContextName(context) + '.Provider';
          }

        case REACT_CONSUMER_TYPE:
          {
            const consumer = type;
            return getContextName(consumer._context) + '.Consumer';
          }

        case REACT_FORWARD_REF_TYPE:
          return getWrappedName(type, type.render, 'ForwardRef');

        case REACT_MEMO_TYPE:
          const outerName = type.displayName || null;

          if (outerName !== null) {
            return outerName;
          }

          return getComponentNameFromType(type.type) || 'Memo';

        case REACT_LAZY_TYPE:
          {
            const lazyComponent = type;
            const payload = lazyComponent._payload;
            const init = lazyComponent._init;

            try {
              return getComponentNameFromType(init(payload));
            } catch (x) {
              return null;
            }
          }
      }
    }

    return null;
  }

  const ReactSharedInternals = {
    H: null,
    A: null,
    T: null,
    S: null
  };

  {
    ReactSharedInternals.actQueue = null;
    ReactSharedInternals.isBatchingLegacy = false;
    ReactSharedInternals.didScheduleLegacyUpdate = false;
    ReactSharedInternals.didUsePromise = false;
    ReactSharedInternals.thrownErrors = [];
    ReactSharedInternals.getCurrentStack = null;
  }

  const hasOwnProperty = Object.prototype.hasOwnProperty;

  const REACT_CLIENT_REFERENCE$1 = Symbol.for('react.client.reference');
  function isValidElementType(type) {
    if (typeof type === 'string' || typeof type === 'function') {
      return true;
    }

    if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing  || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden  || type === REACT_OFFSCREEN_TYPE || enableScopeAPI  || enableTransitionTracing ) {
      return true;
    }

    if (typeof type === 'object' && type !== null) {
      if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || !enableRenderableContext  || type.$$typeof === REACT_CONSUMER_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_CLIENT_REFERENCE$1 || type.getModuleId !== undefined) {
        return true;
      }
    }

    return false;
  }

  let disabledDepth = 0;
  let prevLog;
  let prevInfo;
  let prevWarn;
  let prevError;
  let prevGroup;
  let prevGroupCollapsed;
  let prevGroupEnd;

  function disabledLog() {}

  disabledLog.__reactDisabledLog = true;
  function disableLogs() {
    {
      if (disabledDepth === 0) {
        prevLog = console.log;
        prevInfo = console.info;
        prevWarn = console.warn;
        prevError = console.error;
        prevGroup = console.group;
        prevGroupCollapsed = console.groupCollapsed;
        prevGroupEnd = console.groupEnd;
        const props = {
          configurable: true,
          enumerable: true,
          value: disabledLog,
          writable: true
        };
        Object.defineProperties(console, {
          info: props,
          log: props,
          warn: props,
          error: props,
          group: props,
          groupCollapsed: props,
          groupEnd: props
        });
      }

      disabledDepth++;
    }
  }
  function reenableLogs() {
    {
      disabledDepth--;

      if (disabledDepth === 0) {
        const props = {
          configurable: true,
          enumerable: true,
          writable: true
        };
        Object.defineProperties(console, {
          log: { ...props,
            value: prevLog
          },
          info: { ...props,
            value: prevInfo
          },
          warn: { ...props,
            value: prevWarn
          },
          error: { ...props,
            value: prevError
          },
          group: { ...props,
            value: prevGroup
          },
          groupCollapsed: { ...props,
            value: prevGroupCollapsed
          },
          groupEnd: { ...props,
            value: prevGroupEnd
          }
        });
      }

      if (disabledDepth < 0) {
        console.error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
      }
    }
  }

  const DefaultPrepareStackTrace = undefined;

  let prefix;
  let suffix;
  function describeBuiltInComponentFrame(name) {
    {
      if (prefix === undefined) {
        try {
          throw Error();
        } catch (x) {
          const match = x.stack.trim().match(/\n( *(at )?)/);
          prefix = match && match[1] || '';
          suffix = x.stack.indexOf('\n    at') > -1 ? ' (<anonymous>)' : x.stack.indexOf('@') > -1 ? '@unknown:0:0' : '';
        }
      }

      return '\n' + prefix + name + suffix;
    }
  }
  let reentry = false;
  let componentFrameCache;

  {
    const PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
    componentFrameCache = new PossiblyWeakMap();
  }

  function describeNativeComponentFrame(fn, construct) {
    if (!fn || reentry) {
      return '';
    }

    {
      const frame = componentFrameCache.get(fn);

      if (frame !== undefined) {
        return frame;
      }
    }

    reentry = true;
    const previousPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = DefaultPrepareStackTrace;
    let previousDispatcher = null;

    {
      previousDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = null;
      disableLogs();
    }

    try {
      const RunInRootFrame = {
        DetermineComponentFrameRoot() {
          let control;

          try {
            if (construct) {
              const Fake = function () {
                throw Error();
              };

              Object.defineProperty(Fake.prototype, 'props', {
                set: function () {
                  throw Error();
                }
              });

              if (typeof Reflect === 'object' && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  control = x;
                }

                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x) {
                  control = x;
                }

                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                control = x;
              }

              const maybePromise = fn();

              if (maybePromise && typeof maybePromise.catch === 'function') {
                maybePromise.catch(() => {});
              }
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === 'string') {
              return [sample.stack, control.stack];
            }
          }

          return [null, null];
        }

      };
      RunInRootFrame.DetermineComponentFrameRoot.displayName = 'DetermineComponentFrameRoot';
      const namePropDescriptor = Object.getOwnPropertyDescriptor(RunInRootFrame.DetermineComponentFrameRoot, 'name');

      if (namePropDescriptor && namePropDescriptor.configurable) {
        Object.defineProperty(RunInRootFrame.DetermineComponentFrameRoot, 'name', {
          value: 'DetermineComponentFrameRoot'
        });
      }

      const [sampleStack, controlStack] = RunInRootFrame.DetermineComponentFrameRoot();

      if (sampleStack && controlStack) {
        const sampleLines = sampleStack.split('\n');
        const controlLines = controlStack.split('\n');
        let s = 0;
        let c = 0;

        while (s < sampleLines.length && !sampleLines[s].includes('DetermineComponentFrameRoot')) {
          s++;
        }

        while (c < controlLines.length && !controlLines[c].includes('DetermineComponentFrameRoot')) {
          c++;
        }

        if (s === sampleLines.length || c === controlLines.length) {
          s = sampleLines.length - 1;
          c = controlLines.length - 1;

          while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
            c--;
          }
        }

        for (; s >= 1 && c >= 0; s--, c--) {
          if (sampleLines[s] !== controlLines[c]) {
            if (s !== 1 || c !== 1) {
              do {
                s--;
                c--;

                if (c < 0 || sampleLines[s] !== controlLines[c]) {
                  let frame = '\n' + sampleLines[s].replace(' at new ', ' at ');

                  if (fn.displayName && frame.includes('<anonymous>')) {
                    frame = frame.replace('<anonymous>', fn.displayName);
                  }

                  if (true) {
                    if (typeof fn === 'function') {
                      componentFrameCache.set(fn, frame);
                    }
                  }

                  return frame;
                }
              } while (s >= 1 && c >= 0);
            }

            break;
          }
        }
      }
    } finally {
      reentry = false;

      {
        ReactSharedInternals.H = previousDispatcher;
        reenableLogs();
      }

      Error.prepareStackTrace = previousPrepareStackTrace;
    }

    const name = fn ? fn.displayName || fn.name : '';
    const syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';

    {
      if (typeof fn === 'function') {
        componentFrameCache.set(fn, syntheticFrame);
      }
    }

    return syntheticFrame;
  }
  function describeFunctionComponentFrame(fn) {
    {
      return describeNativeComponentFrame(fn, false);
    }
  }

  function shouldConstruct(Component) {
    const prototype = Component.prototype;
    return !!(prototype && prototype.isReactComponent);
  }

  function describeUnknownElementTypeFrameInDEV(type) {

    if (type == null) {
      return '';
    }

    if (typeof type === 'function') {
      {
        return describeNativeComponentFrame(type, shouldConstruct(type));
      }
    }

    if (typeof type === 'string') {
      return describeBuiltInComponentFrame(type);
    }

    switch (type) {
      case REACT_SUSPENSE_TYPE:
        return describeBuiltInComponentFrame('Suspense');

      case REACT_SUSPENSE_LIST_TYPE:
        return describeBuiltInComponentFrame('SuspenseList');
    }

    if (typeof type === 'object') {
      switch (type.$$typeof) {
        case REACT_FORWARD_REF_TYPE:
          return describeFunctionComponentFrame(type.render);

        case REACT_MEMO_TYPE:
          return describeUnknownElementTypeFrameInDEV(type.type);

        case REACT_LAZY_TYPE:
          {
            const lazyComponent = type;
            const payload = lazyComponent._payload;
            const init = lazyComponent._init;

            try {
              return describeUnknownElementTypeFrameInDEV(init(payload));
            } catch (x) {}
          }
      }
    }

    return '';
  }

  const REACT_CLIENT_REFERENCE = Symbol.for('react.client.reference');

  function getOwner() {
    {
      const dispatcher = ReactSharedInternals.A;

      if (dispatcher === null) {
        return null;
      }

      return dispatcher.getOwner();
    }
  }

  let specialPropKeyWarningShown;
  let didWarnAboutElementRef;
  let didWarnAboutOldJSXRuntime;

  {
    didWarnAboutElementRef = {};
  }

  function hasValidRef(config) {
    {
      if (hasOwnProperty.call(config, 'ref')) {
        const getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }

    return config.ref !== undefined;
  }

  function hasValidKey(config) {
    {
      if (hasOwnProperty.call(config, 'key')) {
        const getter = Object.getOwnPropertyDescriptor(config, 'key').get;

        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }

    return config.key !== undefined;
  }

  function defineKeyPropWarningGetter(props, displayName) {
    {
      const warnAboutAccessingKey = function () {
        if (!specialPropKeyWarningShown) {
          specialPropKeyWarningShown = true;
          console.error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://react.dev/link/special-props)', displayName);
        }
      };

      warnAboutAccessingKey.isReactWarning = true;
      Object.defineProperty(props, 'key', {
        get: warnAboutAccessingKey,
        configurable: true
      });
    }
  }

  function elementRefGetterWithDeprecationWarning() {
    {
      const componentName = getComponentNameFromType(this.type);

      if (!didWarnAboutElementRef[componentName]) {
        didWarnAboutElementRef[componentName] = true;
        console.error('Accessing element.ref was removed in React 19. ref is now a ' + 'regular prop. It will be removed from the JSX Element ' + 'type in a future release.');
      }

      const refProp = this.props.ref;
      return refProp !== undefined ? refProp : null;
    }
  }

  function ReactElement(type, key, self, source, owner, props, debugStack, debugTask) {
    const refProp = props.ref;
    const ref = refProp !== undefined ? refProp : null;
    let element;

    {
      element = {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        props,
        _owner: owner
      };

      if (ref !== null) {
        Object.defineProperty(element, 'ref', {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        });
      } else {
        Object.defineProperty(element, 'ref', {
          enumerable: false,
          value: null
        });
      }
    }

    {
      element._store = {};
      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: 0
      });
      Object.defineProperty(element, '_debugInfo', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: null
      });

      if (Object.freeze) {
        Object.freeze(element.props);
        Object.freeze(element);
      }
    }

    return element;
  }

  function createElement(type, config, children) {
    {
      if (!isValidElementType(type)) {
        let info = '';

        if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
          info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
        }

        let typeString;

        if (type === null) {
          typeString = 'null';
        } else if (isArray(type)) {
          typeString = 'array';
        } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
          typeString = `<${getComponentNameFromType(type.type) || 'Unknown'} />`;
          info = ' Did you accidentally export a JSX literal instead of a component?';
        } else {
          typeString = typeof type;
        }

        console.error('React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
      } else {
        for (let i = 2; i < arguments.length; i++) {
          validateChildKeys(arguments[i], type);
        }
      }
    }

    let propName;
    const props = {};
    let key = null;

    if (config != null) {
      {
        if (!didWarnAboutOldJSXRuntime && '__self' in config && !('key' in config)) {
          didWarnAboutOldJSXRuntime = true;
          console.warn('Your app (or one of its dependencies) is using an outdated JSX ' + 'transform. Update to the modern JSX transform for ' + 'faster performance: https://react.dev/link/new-jsx-transform');
        }
      }

      if (hasValidKey(config)) {
        {
          checkKeyStringCoercion(config.key);
        }

        key = '' + config.key;
      }

      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && propName !== 'key' && propName !== '__self' && propName !== '__source') {
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

      {
        if (Object.freeze) {
          Object.freeze(childArray);
        }
      }

      props.children = childArray;
    }

    if (type && type.defaultProps) {
      const defaultProps = type.defaultProps;

      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }

    {
      if (key) {
        const displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        defineKeyPropWarningGetter(props, displayName);
      }
    }

    return ReactElement(type, key, undefined, undefined, getOwner(), props);
  }
  function cloneAndReplaceKey(oldElement, newKey) {
    const clonedElement = ReactElement(oldElement.type, newKey, undefined, undefined, oldElement._owner, oldElement.props);

    {
      clonedElement._store.validated = oldElement._store.validated;
    }

    return clonedElement;
  }
  function cloneElement(element, config, children) {
    if (element === null || element === undefined) {
      throw new Error(`The argument must be a React element, but you passed ${element}.`);
    }

    let propName;
    const props = assign({}, element.props);
    let key = element.key;
    let owner = element._owner;

    if (config != null) {
      if (hasValidRef(config)) {
        owner = getOwner() ;
      }

      if (hasValidKey(config)) {
        {
          checkKeyStringCoercion(config.key);
        }

        key = '' + config.key;
      }

      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && propName !== 'key' && propName !== '__self' && propName !== '__source' && !(propName === 'ref' && config.ref === undefined)) {
          {
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

    const clonedElement = ReactElement(element.type, key, undefined, undefined, owner, props);

    for (let i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], clonedElement.type);
    }

    return clonedElement;
  }

  function validateChildKeys(node, parentType) {
    {

      if (typeof node !== 'object' || !node) {
        return;
      }

      if (node.$$typeof === REACT_CLIENT_REFERENCE) ; else if (isArray(node)) {
        for (let i = 0; i < node.length; i++) {
          const child = node[i];

          if (isValidElement(child)) {
            validateExplicitKey(child, parentType);
          }
        }
      } else if (isValidElement(node)) {
        if (node._store) {
          node._store.validated = 1;
        }
      } else {
        const iteratorFn = getIteratorFn(node);

        if (typeof iteratorFn === 'function') {
          if (iteratorFn !== node.entries) {
            const iterator = iteratorFn.call(node);

            if (iterator !== node) {
              let step;

              while (!(step = iterator.next()).done) {
                if (isValidElement(step.value)) {
                  validateExplicitKey(step.value, parentType);
                }
              }
            }
          }
        }
      }
    }
  }

  function isValidElement(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }
  const ownerHasKeyUseWarning = {};

  function validateExplicitKey(element, parentType) {

    {
      if (!element._store || element._store.validated || element.key != null) {
        return;
      }

      element._store.validated = 1;
      const currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

      if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
        return;
      }

      ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
      let childOwner = '';

      if (element && element._owner != null && element._owner !== getOwner()) {
        let ownerName = null;

        if (typeof element._owner.tag === 'number') {
          ownerName = getComponentNameFromType(element._owner.type);
        } else if (typeof element._owner.name === 'string') {
          ownerName = element._owner.name;
        }

        childOwner = ` It was passed a child from ${ownerName}.`;
      }

      const prevGetCurrentStack = ReactSharedInternals.getCurrentStack;

      ReactSharedInternals.getCurrentStack = function () {
        let stack = describeUnknownElementTypeFrameInDEV(element.type);

        if (prevGetCurrentStack) {
          stack += prevGetCurrentStack() || '';
        }

        return stack;
      };

      console.error('Each child in a list should have a unique "key" prop.' + '%s%s See https://react.dev/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
      ReactSharedInternals.getCurrentStack = prevGetCurrentStack;
    }
  }

  function getCurrentComponentErrorInfo(parentType) {
    {
      let info = '';
      const owner = getOwner();

      if (owner) {
        const name = getComponentNameFromType(owner.type);

        if (name) {
          info = '\n\nCheck the render method of `' + name + '`.';
        }
      }

      if (!info) {
        const parentName = getComponentNameFromType(parentType);

        if (parentName) {
          info = `\n\nCheck the top-level render call using <${parentName}>.`;
        }
      }

      return info;
    }
  }

  const SEPARATOR = '.';
  const SUBSEPARATOR = ':';

  function escape(key) {
    const escapeRegex = /[=:]/g;
    const escaperLookup = {
      '=': '=0',
      ':': '=2'
    };
    const escapedString = key.replace(escapeRegex, function (match) {
      return escaperLookup[match];
    });
    return '$' + escapedString;
  }

  let didWarnAboutMaps = false;
  const userProvidedKeyEscapeRegex = /\/+/g;

  function escapeUserProvidedKey(text) {
    return text.replace(userProvidedKeyEscapeRegex, '$&/');
  }

  function getElementKey(element, index) {
    if (typeof element === 'object' && element !== null && element.key != null) {
      {
        checkKeyStringCoercion(element.key);
      }

      return escape('' + element.key);
    }

    return index.toString(36);
  }

  function noop$1() {}

  function resolveThenable(thenable) {
    switch (thenable.status) {
      case 'fulfilled':
        {
          const fulfilledValue = thenable.value;
          return fulfilledValue;
        }

      case 'rejected':
        {
          const rejectedError = thenable.reason;
          throw rejectedError;
        }

      default:
        {
          if (typeof thenable.status === 'string') {
            thenable.then(noop$1, noop$1);
          } else {
            const pendingThenable = thenable;
            pendingThenable.status = 'pending';
            pendingThenable.then(fulfilledValue => {
              if (thenable.status === 'pending') {
                const fulfilledThenable = thenable;
                fulfilledThenable.status = 'fulfilled';
                fulfilledThenable.value = fulfilledValue;
              }
            }, error => {
              if (thenable.status === 'pending') {
                const rejectedThenable = thenable;
                rejectedThenable.status = 'rejected';
                rejectedThenable.reason = error;
              }
            });
          }

          switch (thenable.status) {
            case 'fulfilled':
              {
                const fulfilledThenable = thenable;
                return fulfilledThenable.value;
              }

            case 'rejected':
              {
                const rejectedThenable = thenable;
                const rejectedError = rejectedThenable.reason;
                throw rejectedError;
              }
          }
        }
    }

    throw thenable;
  }

  function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
    const type = typeof children;

    if (type === 'undefined' || type === 'boolean') {
      children = null;
    }

    let invokeCallback = false;

    if (children === null) {
      invokeCallback = true;
    } else {
      switch (type) {
        case 'bigint':
        case 'string':
        case 'number':
          invokeCallback = true;
          break;

        case 'object':
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
              break;

            case REACT_LAZY_TYPE:
              const payload = children._payload;
              const init = children._init;
              return mapIntoArray(init(payload), array, escapedPrefix, nameSoFar, callback);
          }

      }
    }

    if (invokeCallback) {
      const child = children;
      let mappedChild = callback(child);
      const childKey = nameSoFar === '' ? SEPARATOR + getElementKey(child, 0) : nameSoFar;

      if (isArray(mappedChild)) {
        let escapedChildKey = '';

        if (childKey != null) {
          escapedChildKey = escapeUserProvidedKey(childKey) + '/';
        }

        mapIntoArray(mappedChild, array, escapedChildKey, '', c => c);
      } else if (mappedChild != null) {
        if (isValidElement(mappedChild)) {
          {
            if (mappedChild.key != null) {
              if (!child || child.key !== mappedChild.key) {
                checkKeyStringCoercion(mappedChild.key);
              }
            }
          }

          const newChild = cloneAndReplaceKey(mappedChild, escapedPrefix + (mappedChild.key != null && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey('' + mappedChild.key) + '/' : '') + childKey);

          {
            if (nameSoFar !== '' && child != null && isValidElement(child) && child.key == null) {
              if (child._store && !child._store.validated) {
                newChild._store.validated = 2;
              }
            }
          }

          mappedChild = newChild;
        }

        array.push(mappedChild);
      }

      return 1;
    }

    let child;
    let nextName;
    let subtreeCount = 0;
    const nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

    if (isArray(children)) {
      for (let i = 0; i < children.length; i++) {
        child = children[i];
        nextName = nextNamePrefix + getElementKey(child, i);
        subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
      }
    } else {
      const iteratorFn = getIteratorFn(children);

      if (typeof iteratorFn === 'function') {
        const iterableChildren = children;

        {
          if (iteratorFn === iterableChildren.entries) {
            if (!didWarnAboutMaps) {
              console.warn('Using Maps as children is not supported. ' + 'Use an array of keyed ReactElements instead.');
            }

            didWarnAboutMaps = true;
          }
        }

        const iterator = iteratorFn.call(iterableChildren);
        let step;
        let ii = 0;

        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getElementKey(child, ii++);
          subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
        }
      } else if (type === 'object') {
        if (typeof children.then === 'function') {
          return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
        }

        const childrenString = String(children);
        throw new Error(`Objects are not valid as a React child (found: ${childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString}). ` + 'If you meant to render a collection of children, use an array ' + 'instead.');
      }
    }

    return subtreeCount;
  }

  function mapChildren(children, func, context) {
    if (children == null) {
      return children;
    }

    const result = [];
    let count = 0;
    mapIntoArray(children, result, '', '', function (child) {
      return func.call(context, child, count++);
    });
    return result;
  }

  function countChildren(children) {
    let n = 0;
    mapChildren(children, () => {
      n++;
    });
    return n;
  }

  function forEachChildren(children, forEachFunc, forEachContext) {
    mapChildren(children, function () {
      forEachFunc.apply(this, arguments);
    }, forEachContext);
  }

  function toArray(children) {
    return mapChildren(children, child => child) || [];
  }

  function onlyChild(children) {
    if (!isValidElement(children)) {
      throw new Error('React.Children.only expected to receive a single React element child.');
    }

    return children;
  }

  function createContext(defaultValue) {
    const context = {
      $$typeof: REACT_CONTEXT_TYPE,
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    };

    {
      context.Provider = context;
      context.Consumer = {
        $$typeof: REACT_CONSUMER_TYPE,
        _context: context
      };
    }

    {
      context._currentRenderer = null;
      context._currentRenderer2 = null;
    }

    return context;
  }

  const Uninitialized = -1;
  const Pending = 0;
  const Resolved = 1;
  const Rejected = 2;

  function lazyInitializer(payload) {
    if (payload._status === Uninitialized) {
      const ctor = payload._result;
      const thenable = ctor();
      thenable.then(moduleObject => {
        if (payload._status === Pending || payload._status === Uninitialized) {
          const resolved = payload;
          resolved._status = Resolved;
          resolved._result = moduleObject;
        }
      }, error => {
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

      {
        if (moduleObject === undefined) {
          console.error('lazy: Expected the result of a dynamic imp' + 'ort() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' + 'const MyComponent = lazy(() => imp' + "ort('./MyComponent'))\n\n" + 'Did you accidentally put curly braces around the import?', moduleObject);
        }
      }

      {
        if (!('default' in moduleObject)) {
          console.error('lazy: Expected the result of a dynamic imp' + 'ort() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' + 'const MyComponent = lazy(() => imp' + "ort('./MyComponent'))", moduleObject);
        }
      }

      return moduleObject.default;
    } else {
      throw payload._result;
    }
  }

  function lazy(ctor) {
    const payload = {
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

  function forwardRef(render) {
    {
      if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
        console.error('forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
      } else if (typeof render !== 'function') {
        console.error('forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
      } else {
        if (render.length !== 0 && render.length !== 2) {
          console.error('forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.');
        }
      }

      if (render != null) {
        if (render.defaultProps != null) {
          console.error('forwardRef render functions do not support defaultProps. ' + 'Did you accidentally pass a React component?');
        }
      }
    }

    const elementType = {
      $$typeof: REACT_FORWARD_REF_TYPE,
      render
    };

    {
      let ownName;
      Object.defineProperty(elementType, 'displayName', {
        enumerable: false,
        configurable: true,
        get: function () {
          return ownName;
        },
        set: function (name) {
          ownName = name;

          if (!render.name && !render.displayName) {
            Object.defineProperty(render, 'name', {
              value: name
            });
            render.displayName = name;
          }
        }
      });
    }

    return elementType;
  }

  function memo(type, compare) {
    {
      if (!isValidElementType(type)) {
        console.error('memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
      }
    }

    const elementType = {
      $$typeof: REACT_MEMO_TYPE,
      type,
      compare: compare === undefined ? null : compare
    };

    {
      let ownName;
      Object.defineProperty(elementType, 'displayName', {
        enumerable: false,
        configurable: true,
        get: function () {
          return ownName;
        },
        set: function (name) {
          ownName = name;

          if (!type.name && !type.displayName) {
            Object.defineProperty(type, 'name', {
              value: name
            });
            type.displayName = name;
          }
        }
      });
    }

    return elementType;
  }

  function noopCache(fn) {
    return function () {
      return fn.apply(null, arguments);
    };
  }
  const cache = noopCache ;

  function resolveDispatcher() {
    const dispatcher = ReactSharedInternals.H;

    {
      if (dispatcher === null) {
        console.error('Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' + ' one of the following reasons:\n' + '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' + '2. You might be breaking the Rules of Hooks\n' + '3. You might have more than one copy of React in the same app\n' + 'See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.');
      }
    }

    return dispatcher;
  }

  function getCacheForType(resourceType) {
    const dispatcher = ReactSharedInternals.A;

    if (!dispatcher) {
      return resourceType();
    }

    return dispatcher.getCacheForType(resourceType);
  }
  function useContext(Context) {
    const dispatcher = resolveDispatcher();

    {
      if (Context.$$typeof === REACT_CONSUMER_TYPE) {
        console.error('Calling useContext(Context.Consumer) is not supported and will cause bugs. ' + 'Did you mean to call useContext(Context) instead?');
      }
    }

    return dispatcher.useContext(Context);
  }
  function useState(initialState) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useState(initialState);
  }
  function useReducer(reducer, initialArg, init) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useReducer(reducer, initialArg, init);
  }
  function useRef(initialValue) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useRef(initialValue);
  }
  function useEffect(create, deps) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useEffect(create, deps);
  }
  function useInsertionEffect(create, deps) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useInsertionEffect(create, deps);
  }
  function useLayoutEffect(create, deps) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useLayoutEffect(create, deps);
  }
  function useCallback(callback, deps) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useCallback(callback, deps);
  }
  function useMemo(create, deps) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useMemo(create, deps);
  }
  function useImperativeHandle(ref, create, deps) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useImperativeHandle(ref, create, deps);
  }
  function useDebugValue(value, formatterFn) {
    {
      const dispatcher = resolveDispatcher();
      return dispatcher.useDebugValue(value, formatterFn);
    }
  }
  function useTransition() {
    const dispatcher = resolveDispatcher();
    return dispatcher.useTransition();
  }
  function useDeferredValue(value, initialValue) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useDeferredValue(value, initialValue);
  }
  function useId() {
    const dispatcher = resolveDispatcher();
    return dispatcher.useId();
  }
  function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  }
  function useCacheRefresh() {
    const dispatcher = resolveDispatcher();
    return dispatcher.useCacheRefresh();
  }
  function use(usable) {
    const dispatcher = resolveDispatcher();
    return dispatcher.use(usable);
  }
  function useMemoCache(size) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useMemoCache(size);
  }
  function useEffectEvent(callback) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useEffectEvent(callback);
  }
  function useOptimistic(passthrough, reducer) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useOptimistic(passthrough, reducer);
  }
  function useActionState(action, initialState, permalink) {
    {
      const dispatcher = resolveDispatcher();
      return dispatcher.useActionState(action, initialState, permalink);
    }
  }

  const reportGlobalError = typeof reportError === 'function' ? reportError : error => {
    if (typeof window === 'object' && typeof window.ErrorEvent === 'function') {
      const message = typeof error === 'object' && error !== null && typeof error.message === 'string' ? String(error.message) : String(error);
      const event = new window.ErrorEvent('error', {
        bubbles: true,
        cancelable: true,
        message: message,
        error: error
      });
      const shouldLog = window.dispatchEvent(event);

      if (!shouldLog) {
        return;
      }
    } else if (typeof process === 'object' && typeof process.emit === 'function') {
      process.emit('uncaughtException', error);
      return;
    }

    console['error'](error);
  };

  function startTransition(scope, options) {
    const prevTransition = ReactSharedInternals.T;
    const currentTransition = {};
    ReactSharedInternals.T = currentTransition;

    {
      currentTransition._updatedFibers = new Set();
    }

    {
      try {
        const returnValue = scope();
        const onStartTransitionFinish = ReactSharedInternals.S;

        if (onStartTransitionFinish !== null) {
          onStartTransitionFinish(currentTransition, returnValue);
        }

        if (typeof returnValue === 'object' && returnValue !== null && typeof returnValue.then === 'function') {
          returnValue.then(noop, reportGlobalError);
        }
      } catch (error) {
        reportGlobalError(error);
      } finally {
        warnAboutTransitionSubscriptions(prevTransition, currentTransition);
        ReactSharedInternals.T = prevTransition;
      }
    }
  }

  function warnAboutTransitionSubscriptions(prevTransition, currentTransition) {
    {
      if (prevTransition === null && currentTransition._updatedFibers) {
        const updatedFibersCount = currentTransition._updatedFibers.size;

        currentTransition._updatedFibers.clear();

        if (updatedFibersCount > 10) {
          console.warn('Detected a large number of updates inside startTransition. ' + 'If this is due to a subscription please re-write it to use React provided hooks. ' + 'Otherwise concurrent mode guarantees are off the table.');
        }
      }
    }
  }

  function noop() {}

  const ReactCompilerRuntime = {
    c: useMemoCache
  };

  const Children = {
    map: mapChildren,
    forEach: forEachChildren,
    count: countChildren,
    toArray,
    only: onlyChild
  };

  exports.Children = Children;
  exports.Component = Component;
  exports.Fragment = REACT_FRAGMENT_TYPE;
  exports.Profiler = REACT_PROFILER_TYPE;
  exports.PureComponent = PureComponent;
  exports.StrictMode = REACT_STRICT_MODE_TYPE;
  exports.Suspense = REACT_SUSPENSE_TYPE;
  exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
  exports.__COMPILER_RUNTIME = ReactCompilerRuntime;
  exports.cache = cache;
  exports.cloneElement = cloneElement;
  exports.createContext = createContext;
  exports.createElement = createElement;
  exports.createRef = createRef;
  exports.experimental_useEffectEvent = useEffectEvent;
  exports.forwardRef = forwardRef;
  exports.isValidElement = isValidElement;
  exports.lazy = lazy;
  exports.memo = memo;
  exports.startTransition = startTransition;
  exports.unstable_Activity = REACT_OFFSCREEN_TYPE;
  exports.unstable_DebugTracingMode = REACT_DEBUG_TRACING_MODE_TYPE;
  exports.unstable_LegacyHidden = REACT_LEGACY_HIDDEN_TYPE;
  exports.unstable_Scope = REACT_SCOPE_TYPE;
  exports.unstable_SuspenseList = REACT_SUSPENSE_LIST_TYPE;
  exports.unstable_TracingMarker = REACT_TRACING_MARKER_TYPE;
  exports.unstable_getCacheForType = getCacheForType;
  exports.unstable_useCacheRefresh = useCacheRefresh;
  exports.use = use;
  exports.useActionState = useActionState;
  exports.useCallback = useCallback;
  exports.useContext = useContext;
  exports.useDebugValue = useDebugValue;
  exports.useDeferredValue = useDeferredValue;
  exports.useEffect = useEffect;
  exports.useId = useId;
  exports.useImperativeHandle = useImperativeHandle;
  exports.useInsertionEffect = useInsertionEffect;
  exports.useLayoutEffect = useLayoutEffect;
  exports.useMemo = useMemo;
  exports.useOptimistic = useOptimistic;
  exports.useReducer = useReducer;
  exports.useRef = useRef;
  exports.useState = useState;
  exports.useSyncExternalStore = useSyncExternalStore;
  exports.useTransition = useTransition;
  exports.version = ReactVersion;

  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

}));
//# sourceMappingURL=react.production.js.map
