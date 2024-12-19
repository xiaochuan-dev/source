(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.React = {}));
})(this, (function (exports) { 'use strict';

  var ReactVersion = '19.0.0-rc-7aa5dda3-20241114';

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
  // -----------------------------------------------------------------------------
  // Land or remove (zero effort)
  //
  // Flags that can likely be deleted or landed without consequences
  // -----------------------------------------------------------------------------

  const enableScopeAPI = false; // Experimental Create Event Handle API.
  const enableTransitionTracing = false;

  const enableLegacyHidden = false; // Enables unstable_avoidThisFallback feature in Fiber

  const enableRenderableContext = true; // -----------------------------------------------------------------------------
  // stuff. Intended to enable React core members to more easily debug scheduling
  // issues in DEV builds.

  const enableDebugTracing = false;

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
  const REACT_ELEMENT_TYPE = Symbol.for('react.transitional.element') ;
  const REACT_PORTAL_TYPE = Symbol.for('react.portal');
  const REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
  const REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
  const REACT_PROFILER_TYPE = Symbol.for('react.profiler');
  const REACT_PROVIDER_TYPE = Symbol.for('react.provider'); // TODO: Delete with enableRenderableContext

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

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
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
  /**
   * This is the abstract API for an update queue.
   */


  const ReactNoopUpdateQueue = {
    /**
     * Checks whether or not this composite component is mounted.
     * @param {ReactClass} publicInstance The instance we want to test.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function (publicInstance) {
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
    enqueueForceUpdate: function (publicInstance, callback, callerName) {
      warnNoop(publicInstance, 'forceUpdate');
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
    enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
      warnNoop(publicInstance, 'replaceState');
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
    enqueueSetState: function (publicInstance, partialState, callback, callerName) {
      warnNoop(publicInstance, 'setState');
    }
  };

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
  const assign = Object.assign;

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  const emptyObject = {};

  {
    Object.freeze(emptyObject);
  }
  /**
   * Base class helpers for the updating state of a component.
   */


  function Component(props, context, updater) {
    this.props = props;
    this.context = context; // If a component has string refs, we will assign a different object later.

    this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
    // renderer.

    this.updater = updater || ReactNoopUpdateQueue;
  }

  Component.prototype.isReactComponent = {};
  /**
   * Sets a subset of the state. Always use this to mutate
   * state. You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * There is no guarantee that calls to `setState` will run synchronously,
   * as they may eventually be batched together.  You can provide an optional
   * callback that will be executed when the call to setState is actually
   * completed.
   *
   * When a function is provided to setState, it will be called at some point in
   * the future (not synchronously). It will be called with the up to date
   * component arguments (state, props, context). These values can be different
   * from this.* because your function may be called after receiveProps but before
   * shouldComponentUpdate, and this new state, props, and context will not yet be
   * assigned to this.
   *
   * @param {object|function} partialState Next partial state or function to
   *        produce next partial state to be merged with current state.
   * @param {?function} callback Called after state is updated.
   * @final
   * @protected
   */

  Component.prototype.setState = function (partialState, callback) {
    if (typeof partialState !== 'object' && typeof partialState !== 'function' && partialState != null) {
      throw new Error('takes an object of state variables to update or a ' + 'function which returns an object of state variables.');
    }

    this.updater.enqueueSetState(this, partialState, callback, 'setState');
  };
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
   * @param {?function} callback Called after update is complete.
   * @final
   * @protected
   */


  Component.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
  };
  /**
   * Deprecated APIs. These APIs used to exist on classic React classes but since
   * we would like to deprecate them, we're not going to move them over to this
   * modern base class. Instead, we define a getter that warns if it's accessed.
   */


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
  /**
   * Convenience component with default shallow equality check for sCU.
   */

  function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context; // If a component has string refs, we will assign a different object later.

    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }

  const pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
  pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

  assign(pureComponentPrototype, Component.prototype);
  pureComponentPrototype.isPureReactComponent = true;

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   * 
   */
  // an immutable object with a single mutable value
  function createRef() {
    const refObject = {
      current: null
    };

    {
      Object.seal(refObject);
    }

    return refObject;
  }

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
  const isArrayImpl = Array.isArray;

  function isArray(a) {
    return isArrayImpl(a);
  }

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */

  /*
   * The `'' + value` pattern (used in perf-sensitive code) throws for Symbol
   * and Temporal.* types. See https://github.com/facebook/react/pull/22064.
   *
   * The functions in this module will throw an easier-to-understand,
   * easier-to-debug exception with a clear errors message message explaining the
   * problem. (Instead of a confusing exception thrown inside the implementation
   * of the `value` object).
   */
  // $FlowFixMe[incompatible-return] only called in DEV, so void return is not possible.
  function typeName(value) {
    {
      // toStringTag is needed for namespaced types like Temporal.Instant
      const hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;
      const type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || 'Object'; // $FlowFixMe[incompatible-return]

      return type;
    }
  } // $FlowFixMe[incompatible-return] only called in DEV, so void return is not possible.


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
  /** @noinline */


  function testStringCoercion(value) {
    // If you ended up here by following an exception call stack, here's what's
    // happened: you supplied an object or symbol value to React (as a prop, key,
    // DOM attribute, CSS property, string ref, etc.) and when React tried to
    // coerce it to a string using `'' + value`, an exception was thrown.
    //
    // The most common types that will cause this exception are `Symbol` instances
    // and Temporal objects like `Temporal.Instant`. But any object that has a
    // `valueOf` or `[Symbol.toPrimitive]` method that throws will also cause this
    // exception. (Library authors do this to prevent users from using built-in
    // numeric operators like `+` or comparison operators like `>=` because custom
    // methods are needed to perform accurate arithmetic or comparison.)
    //
    // To fix the problem, coerce this object or symbol value to a string before
    // passing it to React. The most reliable way is usually `String(value)`.
    //
    // To find which value is throwing, check the browser or debugger console.
    // Before this exception was thrown, there should be `console.error` output
    // that shows the type (Symbol, Temporal.PlainDate, etc.) that caused the
    // problem and how that type was used: key, atrribute, input value prop, etc.
    // In most cases, this console output also shows the component and its
    // ancestor components where the exception happened.
    //
    // eslint-disable-next-line react-internal/safe-string-coercion
    return '' + value;
  }
  function checkKeyStringCoercion(value) {
    {
      if (willCoercionThrow(value)) {
        console.error('The provided key is an unsupported type %s.' + ' This value must be coerced to a string before using it here.', typeName(value));
        return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
      }
    }
  }

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */

  function getWrappedName(outerType, innerType, wrapperName) {
    const displayName = outerType.displayName;

    if (displayName) {
      return displayName;
    }

    const functionName = innerType.displayName || innerType.name || '';
    return functionName !== '' ? `${wrapperName}(${functionName})` : wrapperName;
  } // Keep in sync with react-reconciler/getComponentNameFromFiber


  function getContextName(type) {
    return type.displayName || 'Context';
  }

  const REACT_CLIENT_REFERENCE$2 = Symbol.for('react.client.reference'); // Note that the reconciler package should generally prefer to use getComponentNameFromFiber() instead.

  function getComponentNameFromType(type) {
    if (type == null) {
      // Host root, text node or just invalid type.
      return null;
    }

    if (typeof type === 'function') {
      if (type.$$typeof === REACT_CLIENT_REFERENCE$2) {
        // TODO: Create a convention for naming client references with debug info.
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

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
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
    ReactSharedInternals.thrownErrors = []; // Stack implementation injected by the current renderer.

    ReactSharedInternals.getCurrentStack = null;
  }

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
  // $FlowFixMe[method-unbinding]
  const hasOwnProperty = Object.prototype.hasOwnProperty;

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
  const REACT_CLIENT_REFERENCE$1 = Symbol.for('react.client.reference'); // This function is deprecated. Don't use. Only the renderer knows what a valid type is.
  // TODO: Delete this when enableOwnerStacks ships.

  function isValidElementType(type) {
    if (typeof type === 'string' || typeof type === 'function') {
      return true;
    } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


    if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing  || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden  || type === REACT_OFFSCREEN_TYPE || enableScopeAPI  || enableTransitionTracing ) {
      return true;
    }

    if (typeof type === 'object' && type !== null) {
      if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || !enableRenderableContext  || type.$$typeof === REACT_CONSUMER_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      type.$$typeof === REACT_CLIENT_REFERENCE$1 || type.getModuleId !== undefined) {
        return true;
      }
    }

    return false;
  }

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
  // Helpers to patch console.logs to avoid logging during side-effect free
  // replaying on render function. This currently only patches the object
  // lazily which won't cover if the log function was extracted eagerly.
  // We could also eagerly patch the method.
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
        /* eslint-disable react-internal/no-production-logging */
        prevLog = console.log;
        prevInfo = console.info;
        prevWarn = console.warn;
        prevError = console.error;
        prevGroup = console.group;
        prevGroupCollapsed = console.groupCollapsed;
        prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

        const props = {
          configurable: true,
          enumerable: true,
          value: disabledLog,
          writable: true
        }; // $FlowFixMe[cannot-write] Flow thinks console is immutable.

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
        }; // $FlowFixMe[cannot-write] Flow thinks console is immutable.

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

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
  // This is forked in server builds where the default stack frame may be source mapped.
  var DefaultPrepareStackTrace = undefined;

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
  let prefix;
  let suffix;
  function describeBuiltInComponentFrame(name) {
    {
      if (prefix === undefined) {
        // Extract the VM specific prefix used by each line.
        try {
          throw Error();
        } catch (x) {
          const match = x.stack.trim().match(/\n( *(at )?)/);
          prefix = match && match[1] || '';
          suffix = x.stack.indexOf('\n    at') > -1 ? // V8
          ' (<anonymous>)' : // JSC/Spidermonkey
          x.stack.indexOf('@') > -1 ? '@unknown:0:0' : // Other
          '';
        }
      } // We use the prefix to ensure our stacks line up with native stack frames.


      return '\n' + prefix + name + suffix;
    }
  }
  let reentry = false;
  let componentFrameCache;

  {
    const PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
    componentFrameCache = new PossiblyWeakMap();
  }
  /**
   * Leverages native browser/VM stack frames to get proper details (e.g.
   * filename, line + col number) for a single component in a component stack. We
   * do this by:
   *   (1) throwing and catching an error in the function - this will be our
   *       control error.
   *   (2) calling the component which will eventually throw an error that we'll
   *       catch - this will be our sample error.
   *   (3) diffing the control and sample error stacks to find the stack frame
   *       which represents our component.
   */


  function describeNativeComponentFrame(fn, construct) {
    // If something asked for a stack inside a fake render, it should get ignored.
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
      previousDispatcher = ReactSharedInternals.H; // Set the dispatcher in DEV because this might be call in the render function
      // for warnings.

      ReactSharedInternals.H = null;
      disableLogs();
    }

    try {
      /**
       * Finding a common stack frame between sample and control errors can be
       * tricky given the different types and levels of stack trace truncation from
       * different JS VMs. So instead we'll attempt to control what that common
       * frame should be through this object method:
       * Having both the sample and control errors be in the function under the
       * `DescribeNativeComponentFrameRoot` property, + setting the `name` and
       * `displayName` properties of the function ensures that a stack
       * frame exists that has the method name `DescribeNativeComponentFrameRoot` in
       * it for both control and sample stacks.
       */
      const RunInRootFrame = {
        DetermineComponentFrameRoot() {
          let control;

          try {
            // This should throw.
            if (construct) {
              // Something should be setting the props in the constructor.
              const Fake = function () {
                throw Error();
              }; // $FlowFixMe[prop-missing]


              Object.defineProperty(Fake.prototype, 'props', {
                set: function () {
                  // We use a throwing setter instead of frozen or non-writable props
                  // because that won't throw in a non-strict mode function.
                  throw Error();
                }
              });

              if (typeof Reflect === 'object' && Reflect.construct) {
                // We construct a different control for this case to include any extra
                // frames added by the construct call.
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
                } // $FlowFixMe[prop-missing] found when upgrading Flow


                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                control = x;
              } // TODO(luna): This will currently only throw if the function component
              // tries to access React/ReactDOM/props. We should probably make this throw
              // in simple components too


              const maybePromise = fn(); // If the function component returns a promise, it's likely an async
              // component, which we don't yet support. Attach a noop catch handler to
              // silence the error.
              // TODO: Implement component stacks for async client components?

              if (maybePromise && typeof maybePromise.catch === 'function') {
                maybePromise.catch(() => {});
              }
            }
          } catch (sample) {
            // This is inlined manually because closure doesn't do it for us.
            if (sample && control && typeof sample.stack === 'string') {
              return [sample.stack, control.stack];
            }
          }

          return [null, null];
        }

      }; // $FlowFixMe[prop-missing]

      RunInRootFrame.DetermineComponentFrameRoot.displayName = 'DetermineComponentFrameRoot';
      const namePropDescriptor = Object.getOwnPropertyDescriptor(RunInRootFrame.DetermineComponentFrameRoot, 'name'); // Before ES6, the `name` property was not configurable.

      if (namePropDescriptor && namePropDescriptor.configurable) {
        // V8 utilizes a function's `name` property when generating a stack trace.
        Object.defineProperty(RunInRootFrame.DetermineComponentFrameRoot, // Configurable properties can be updated even if its writable descriptor
        // is set to `false`.
        // $FlowFixMe[cannot-write]
        'name', {
          value: 'DetermineComponentFrameRoot'
        });
      }

      const [sampleStack, controlStack] = RunInRootFrame.DetermineComponentFrameRoot();

      if (sampleStack && controlStack) {
        // This extracts the first frame from the sample that isn't also in the control.
        // Skipping one frame that we assume is the frame that calls the two.
        const sampleLines = sampleStack.split('\n');
        const controlLines = controlStack.split('\n');
        let s = 0;
        let c = 0;

        while (s < sampleLines.length && !sampleLines[s].includes('DetermineComponentFrameRoot')) {
          s++;
        }

        while (c < controlLines.length && !controlLines[c].includes('DetermineComponentFrameRoot')) {
          c++;
        } // We couldn't find our intentionally injected common root frame, attempt
        // to find another common root frame by search from the bottom of the
        // control stack...


        if (s === sampleLines.length || c === controlLines.length) {
          s = sampleLines.length - 1;
          c = controlLines.length - 1;

          while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
            // We expect at least one stack frame to be shared.
            // Typically this will be the root most one. However, stack frames may be
            // cut off due to maximum stack limits. In this case, one maybe cut off
            // earlier than the other. We assume that the sample is longer or the same
            // and there for cut off earlier. So we should find the root most frame in
            // the sample somewhere in the control.
            c--;
          }
        }

        for (; s >= 1 && c >= 0; s--, c--) {
          // Next we find the first one that isn't the same which should be the
          // frame that called our sample function and the control.
          if (sampleLines[s] !== controlLines[c]) {
            // In V8, the first line is describing the message but other VMs don't.
            // If we're about to return the first line, and the control is also on the same
            // line, that's a pretty good indicator that our sample threw at same line as
            // the control. I.e. before we entered the sample frame. So we ignore this result.
            // This can happen if you passed a class to function component, or non-function.
            if (s !== 1 || c !== 1) {
              do {
                s--;
                c--; // We may still have similar intermediate frames from the construct call.
                // The next one that isn't the same should be our match though.

                if (c < 0 || sampleLines[s] !== controlLines[c]) {
                  // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                  let frame = '\n' + sampleLines[s].replace(' at new ', ' at '); // If our component frame is labeled "<anonymous>"
                  // but we have a user-provided "displayName"
                  // splice it in to make the stack more readable.

                  if (fn.displayName && frame.includes('<anonymous>')) {
                    frame = frame.replace('<anonymous>', fn.displayName);
                  }

                  if (true) {
                    if (typeof fn === 'function') {
                      componentFrameCache.set(fn, frame);
                    }
                  } // Return the line we found.


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
    } // Fallback to just using the name if we couldn't make it throw.


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
  } // TODO: Delete this once the key warning no longer uses it. I.e. when enableOwnerStacks ship.


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
          // Memo may contain any component type so we recursively resolve it.
          return describeUnknownElementTypeFrameInDEV(type.type);

        case REACT_LAZY_TYPE:
          {
            const lazyComponent = type;
            const payload = lazyComponent._payload;
            const init = lazyComponent._init;

            try {
              // Lazy may contain any component type so we recursively resolve it.
              return describeUnknownElementTypeFrameInDEV(init(payload));
            } catch (x) {}
          }
      }
    }

    return '';
  }

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
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
      } // An undefined `element.ref` is coerced to `null` for
      // backwards compatibility.


      const refProp = this.props.ref;
      return refProp !== undefined ? refProp : null;
    }
  }
  /**
   * Factory method to create a new React element. This no longer adheres to
   * the class pattern, so do not use new to call it. Also, instanceof check
   * will not work. Instead test $$typeof field against Symbol.for('react.transitional.element') to check
   * if something is a React Element.
   *
   * @param {*} type
   * @param {*} props
   * @param {*} key
   * @param {string|object} ref
   * @param {*} owner
   * @param {*} self A *temporary* helper to detect places where `this` is
   * different from the `owner` when React.createElement is called, so that we
   * can warn. We want to get rid of owner and replace string `ref`s with arrow
   * functions, and as long as `this` and owner are the same, there will be no
   * change in behavior.
   * @param {*} source An annotation object (added by a transpiler or otherwise)
   * indicating filename, line number, and/or other information.
   * @internal
   */


  function ReactElement(type, key, self, source, owner, props, debugStack, debugTask) {
    // Ignore whatever was passed as the ref argument and treat `props.ref` as
    // the source of truth. The only thing we use this for is `element.ref`,
    // which will log a deprecation warning on access. In the next release, we
    // can remove `element.ref` as well as the `ref` argument.
    const refProp = props.ref; // An undefined `element.ref` is coerced to `null` for
    // backwards compatibility.

    const ref = refProp !== undefined ? refProp : null;
    let element;

    {
      // In dev, make `ref` a non-enumerable property with a warning. It's non-
      // enumerable so that test matchers and serializers don't access it and
      // trigger the warning.
      //
      // `ref` will be removed from the element completely in a future release.
      element = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: REACT_ELEMENT_TYPE,
        // Built-in properties that belong on the element
        type,
        key,
        props,
        // Record the component responsible for creating this element.
        _owner: owner
      };

      if (ref !== null) {
        Object.defineProperty(element, 'ref', {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        });
      } else {
        // Don't warn on access if a ref is not given. This reduces false
        // positives in cases where a test serializer uses
        // getOwnPropertyDescriptors to compare objects, like Jest does, which is
        // a problem because it bypasses non-enumerability.
        //
        // So unfortunately this will trigger a false positive warning in Jest
        // when the diff is printed:
        //
        //   expect(<div ref={ref} />).toEqual(<span ref={ref} />);
        //
        // A bit sketchy, but this is what we've done for the `props.key` and
        // `props.ref` accessors for years, which implies it will be good enough
        // for `element.ref`, too. Let's see if anyone complains.
        Object.defineProperty(element, 'ref', {
          enumerable: false,
          value: null
        });
      }
    }

    {
      // The validation flag is currently mutative. We put it on
      // an external backing store so that we can freeze the whole object.
      // This can be replaced with a WeakMap once they are implemented in
      // commonly used development environments.
      element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
      // the validation flag non-enumerable (where possible, which should
      // include every environment we run tests in), so the test framework
      // ignores it.

      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: 0
      }); // debugInfo contains Server Component debug information.

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
  /**
   * Create and return a new ReactElement of the given type.
   * See https://reactjs.org/docs/react-api.html#createelement
   */


  function createElement(type, config, children) {
    {
      if (!isValidElementType(type)) {
        // This is just an optimistic check that provides a better stack trace before
        // owner stacks. It's really up to the renderer if it's a valid element type.
        // When owner stacks are enabled, we instead warn in the renderer and it'll
        // have the stack trace of the JSX element anyway.
        //
        // This is an invalid element type.
        //
        // We warn in this case but don't throw. We expect the element creation to
        // succeed and there will likely be errors in render.
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
        // This is a valid element type.
        // Skip key warning if the type isn't valid since our key validation logic
        // doesn't expect a non-string/function type and can throw confusing
        // errors. We don't want exception behavior to differ between dev and
        // prod. (Rendering will throw with a helpful message and as soon as the
        // type is fixed, the key warnings will appear.)
        for (let i = 2; i < arguments.length; i++) {
          validateChildKeys(arguments[i], type);
        }
      } // Unlike the jsx() runtime, createElement() doesn't warn about key spread.

    }

    let propName; // Reserved names are extracted

    const props = {};
    let key = null;

    if (config != null) {
      {
        if (!didWarnAboutOldJSXRuntime && '__self' in config && // Do not assume this is the result of an oudated JSX transform if key
        // is present, because the modern JSX transform sometimes outputs
        // createElement to preserve precedence between a static key and a
        // spread key. To avoid false positive warnings, we never warn if
        // there's a key.
        !('key' in config)) {
          didWarnAboutOldJSXRuntime = true;
          console.warn('Your app (or one of its dependencies) is using an outdated JSX ' + 'transform. Update to the modern JSX transform for ' + 'faster performance: https://react.dev/link/new-jsx-transform');
        }
      }

      if (hasValidKey(config)) {
        {
          checkKeyStringCoercion(config.key);
        }

        key = '' + config.key;
      } // Remaining properties are added to a new props object


      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && // Skip over reserved prop names
        propName !== 'key' && // Even though we don't use these anymore in the runtime, we don't want
        // them to appear as props, so in createElement we filter them out.
        // We don't have to do this in the jsx() runtime because the jsx()
        // transform never passed these as props; it used separate arguments.
        propName !== '__self' && propName !== '__source') {
          props[propName] = config[propName];
        }
      }
    } // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.


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
    } // Resolve default props


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
      // The cloned element should inherit the original element's key validation.
      clonedElement._store.validated = oldElement._store.validated;
    }

    return clonedElement;
  }
  /**
   * Clone and return a new ReactElement using element as the starting point.
   * See https://reactjs.org/docs/react-api.html#cloneelement
   */

  function cloneElement(element, config, children) {
    if (element === null || element === undefined) {
      throw new Error(`The argument must be a React element, but you passed ${element}.`);
    }

    let propName; // Original props are copied

    const props = assign({}, element.props); // Reserved names are extracted

    let key = element.key; // Owner will be preserved, unless ref is overridden

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
      } // Remaining properties override existing props

      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && // Skip over reserved prop names
        propName !== 'key' && // ...and maybe these, too, though we currently rely on them for
        // warnings and debug information in dev. Need to decide if we're OK
        // with dropping them. In the jsx() runtime it's not an issue because
        // the data gets passed as separate arguments instead of props, but
        // it would be nice to stop relying on them entirely so we can drop
        // them from the internal Fiber field.
        propName !== '__self' && propName !== '__source' && // Undefined `ref` is ignored by cloneElement. We treat it the same as
        // if the property were missing. This is mostly for
        // backwards compatibility.
        !(propName === 'ref' && config.ref === undefined)) {
          {
            props[propName] = config[propName];
          }
        }
      }
    } // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.


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
  /**
   * Ensure that every element either is passed in a static location, in an
   * array with an explicit keys property defined, or in an object literal
   * with valid key property.
   *
   * @internal
   * @param {ReactNode} node Statically passed child of any type.
   * @param {*} parentType node's parent's type.
   */

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
        // This element was passed in a valid location.
        if (node._store) {
          node._store.validated = 1;
        }
      } else {
        const iteratorFn = getIteratorFn(node);

        if (typeof iteratorFn === 'function') {
          // Entry iterators used to provide implicit keys,
          // but now we print a separate warning for them later.
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
  /**
   * Verifies the object is a ReactElement.
   * See https://reactjs.org/docs/react-api.html#isvalidelement
   * @param {?object} object
   * @return {boolean} True if `object` is a ReactElement.
   * @final
   */


  function isValidElement(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }
  const ownerHasKeyUseWarning = {};
  /**
   * Warn if the element doesn't have an explicit key assigned to it.
   * This element is in an array. The array could grow and shrink or be
   * reordered. All children that haven't already been validated are required to
   * have a "key" property assigned to it. Error statuses are cached so a warning
   * will only be shown once.
   *
   * @internal
   * @param {ReactElement} element Element that requires a key.
   * @param {*} parentType element's parent's type.
   */

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

      ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
      // property, it may be the creator of the child that's responsible for
      // assigning it a key.

      let childOwner = '';

      if (element && element._owner != null && element._owner !== getOwner()) {
        let ownerName = null;

        if (typeof element._owner.tag === 'number') {
          ownerName = getComponentNameFromType(element._owner.type);
        } else if (typeof element._owner.name === 'string') {
          ownerName = element._owner.name;
        } // Give the component that originally created this child.


        childOwner = ` It was passed a child from ${ownerName}.`;
      }

      const prevGetCurrentStack = ReactSharedInternals.getCurrentStack;

      ReactSharedInternals.getCurrentStack = function () {
        const owner = element._owner; // Add an extra top frame while an element is being validated

        let stack = describeUnknownElementTypeFrameInDEV(element.type, owner ? owner.type : null); // Delegate to the injected renderer-specific implementation

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

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
  const SEPARATOR = '.';
  const SUBSEPARATOR = ':';
  /**
   * Escape and wrap key so it is safe to use as a reactid
   *
   * @param {string} key to be escaped.
   * @return {string} the escaped key.
   */

  function escape(key) {
    const escapeRegex = /[=:]/g;
    const escaperLookup = {
      '=': '=0',
      ':': '=2'
    };
    const escapedString = key.replace(escapeRegex, function (match) {
      // $FlowFixMe[invalid-computed-prop]
      return escaperLookup[match];
    });
    return '$' + escapedString;
  }
  /**
   * TODO: Test that a single child and an array with one item have the same key
   * pattern.
   */


  let didWarnAboutMaps = false;
  const userProvidedKeyEscapeRegex = /\/+/g;

  function escapeUserProvidedKey(text) {
    return text.replace(userProvidedKeyEscapeRegex, '$&/');
  }
  /**
   * Generate a key string that identifies a element within a set.
   *
   * @param {*} element A element that could contain a manual key.
   * @param {number} index Index that is used if a manual key is not provided.
   * @return {string}
   */


  function getElementKey(element, index) {
    // Do some typechecking here since we call this blindly. We want to ensure
    // that we don't block potential future ES APIs.
    if (typeof element === 'object' && element !== null && element.key != null) {
      // Explicit key
      {
        checkKeyStringCoercion(element.key);
      }

      return escape('' + element.key);
    } // Implicit key determined by the index in the set


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
            // Only instrument the thenable if the status if not defined. If
            // it's defined, but an unknown value, assume it's been instrumented by
            // some custom userspace implementation. We treat it as "pending".
            // Attach a dummy listener, to ensure that any lazy initialization can
            // happen. Flight lazily parses JSON when the value is actually awaited.
            thenable.then(noop$1, noop$1);
          } else {
            // This is an uncached thenable that we haven't seen before.
            // TODO: Detect infinite ping loops caused by uncached promises.
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
          } // Check one more time in case the thenable resolved synchronously.


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
      // All of the above are perceived as null.
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
      let mappedChild = callback(child); // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows:

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
            // The `if` statement here prevents auto-disabling of the safe
            // coercion ESLint rule, so we must manually disable it below.
            // $FlowFixMe[incompatible-type] Flow incorrectly thinks React.Portal doesn't have a key
            if (mappedChild.key != null) {
              if (!child || child.key !== mappedChild.key) {
                checkKeyStringCoercion(mappedChild.key);
              }
            }
          }

          const newChild = cloneAndReplaceKey(mappedChild, // Keep both the (mapped) and old keys if they differ, just as
          // traverseAllChildren used to do for objects as children
          escapedPrefix + ( // $FlowFixMe[incompatible-type] Flow incorrectly thinks React.Portal doesn't have a key
          mappedChild.key != null && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey( // $FlowFixMe[unsafe-addition]
          '' + mappedChild.key // eslint-disable-line react-internal/safe-string-coercion
          ) + '/' : '') + childKey);

          {
            // If `child` was an element without a `key`, we need to validate if
            // it should have had a `key`, before assigning one to `mappedChild`.
            // $FlowFixMe[incompatible-type] Flow incorrectly thinks React.Portal doesn't have a key
            if (nameSoFar !== '' && child != null && isValidElement(child) && child.key == null) {
              // We check truthiness of `child._store.validated` instead of being
              // inequal to `1` to provide a bit of backward compatibility for any
              // libraries (like `fbt`) which may be hacking this property.
              if (child._store && !child._store.validated) {
                // Mark this child as having failed validation, but let the actual
                // renderer print the warning later.
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
    let subtreeCount = 0; // Count of children found in the current subtree.

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
          // Warn about using Maps as children
          if (iteratorFn === iterableChildren.entries) {
            if (!didWarnAboutMaps) {
              console.warn('Using Maps as children is not supported. ' + 'Use an array of keyed ReactElements instead.');
            }

            didWarnAboutMaps = true;
          }
        }

        const iterator = iteratorFn.call(iterableChildren);
        let step;
        let ii = 0; // $FlowFixMe[incompatible-use] `iteratorFn` might return null according to typing.

        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getElementKey(child, ii++);
          subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
        }
      } else if (type === 'object') {
        if (typeof children.then === 'function') {
          return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
        } // eslint-disable-next-line react-internal/safe-string-coercion


        const childrenString = String(children);
        throw new Error(`Objects are not valid as a React child (found: ${childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString}). ` + 'If you meant to render a collection of children, use an array ' + 'instead.');
      }
    }

    return subtreeCount;
  }

  /**
   * Maps children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenmap
   *
   * The provided mapFunction(child, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} func The map function.
   * @param {*} context Context for mapFunction.
   * @return {object} Object containing the ordered map of results.
   */
  function mapChildren(children, func, context) {
    if (children == null) {
      // $FlowFixMe limitation refining abstract types in Flow
      return children;
    }

    const result = [];
    let count = 0;
    mapIntoArray(children, result, '', '', function (child) {
      return func.call(context, child, count++);
    });
    return result;
  }
  /**
   * Count the number of children that are typically specified as
   * `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrencount
   *
   * @param {?*} children Children tree container.
   * @return {number} The number of children.
   */


  function countChildren(children) {
    let n = 0;
    mapChildren(children, () => {
      n++; // Don't return anything
    });
    return n;
  }

  /**
   * Iterates through children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
   *
   * The provided forEachFunc(child, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} forEachFunc
   * @param {*} forEachContext Context for forEachContext.
   */
  function forEachChildren(children, forEachFunc, forEachContext) {
    mapChildren(children, // $FlowFixMe[missing-this-annot]
    function () {
      forEachFunc.apply(this, arguments); // Don't return anything.
    }, forEachContext);
  }
  /**
   * Flatten a children object (typically specified as `props.children`) and
   * return an array with appropriately re-keyed children.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
   */


  function toArray(children) {
    return mapChildren(children, child => child) || [];
  }
  /**
   * Returns the first child in a collection of children and verifies that there
   * is only one child in the collection.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenonly
   *
   * The current implementation of this function assumes that a single child gets
   * passed without a wrapper, but the purpose of this helper function is to
   * abstract away the particular structure of children.
   *
   * @param {?object} children Child collection structure.
   * @return {ReactElement} The first and only `ReactElement` contained in the
   * structure.
   */


  function onlyChild(children) {
    if (!isValidElement(children)) {
      throw new Error('React.Children.only expected to receive a single React element child.');
    }

    return children;
  }

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
  function createContext(defaultValue) {
    // TODO: Second argument used to be an optional `calculateChangedBits`
    // function. Warn to reserve for future use?
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

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
  const Uninitialized = -1;
  const Pending = 0;
  const Resolved = 1;
  const Rejected = 2;

  function lazyInitializer(payload) {
    if (payload._status === Uninitialized) {
      const ctor = payload._result;
      const thenable = ctor(); // Transition to the next state.
      // This might throw either because it's missing or throws. If so, we treat it
      // as still uninitialized and try again next time. Which is the same as what
      // happens if the ctor or any wrappers processing the ctor throws. This might
      // end up fixing it if the resolution was a concurrency bug.

      thenable.then(moduleObject => {
        if (payload._status === Pending || payload._status === Uninitialized) {
          // Transition to the next state.
          const resolved = payload;
          resolved._status = Resolved;
          resolved._result = moduleObject;
        }
      }, error => {
        if (payload._status === Pending || payload._status === Uninitialized) {
          // Transition to the next state.
          const rejected = payload;
          rejected._status = Rejected;
          rejected._result = error;
        }
      });

      if (payload._status === Uninitialized) {
        // In case, we're still uninitialized, then we're waiting for the thenable
        // to resolve. Set it as pending in the meantime.
        const pending = payload;
        pending._status = Pending;
        pending._result = thenable;
      }
    }

    if (payload._status === Resolved) {
      const moduleObject = payload._result;

      {
        if (moduleObject === undefined) {
          console.error('lazy: Expected the result of a dynamic imp' + 'ort() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' + // Break up imports to avoid accidentally parsing them as dependencies.
          'const MyComponent = lazy(() => imp' + "ort('./MyComponent'))\n\n" + 'Did you accidentally put curly braces around the import?', moduleObject);
        }
      }

      {
        if (!('default' in moduleObject)) {
          console.error('lazy: Expected the result of a dynamic imp' + 'ort() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' + // Break up imports to avoid accidentally parsing them as dependencies.
          'const MyComponent = lazy(() => imp' + "ort('./MyComponent'))", moduleObject);
        }
      }

      return moduleObject.default;
    } else {
      throw payload._result;
    }
  }

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

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
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
          ownName = name; // The inner component shouldn't inherit this display name in most cases,
          // because the component may be used elsewhere.
          // But it's nice for anonymous functions to inherit the name,
          // so that our component-stack generation logic will display their frames.
          // An anonymous function generally suggests a pattern like:
          //   React.forwardRef((props, ref) => {...});
          // This kind of inner function is not used elsewhere so the side effect is okay.

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

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
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
          ownName = name; // The inner component shouldn't inherit this display name in most cases,
          // because the component may be used elsewhere.
          // But it's nice for anonymous functions to inherit the name,
          // so that our component-stack generation logic will display their frames.
          // An anonymous function generally suggests a pattern like:
          //   React.memo((props) => {...});
          // This kind of inner function is not used elsewhere so the side effect is okay.

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

  /**
   * Copyright (c) Meta Platforms, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
  function noopCache(fn) {
    // On the client (i.e. not a Server Components environment) `cache` has
    // no caching behavior. We just return the function as-is.
    //
    // We intend to implement client caching in a future major release. In the
    // meantime, it's only exposed as an API so that Shared Components can use
    // per-request caching on the server without breaking on the client. But it
    // does mean they need to be aware of the behavioral difference.
    //
    // The rest of the behavior is the same as the server implementation — it
    // returns a new reference, extra properties like `displayName` are not
    // preserved, the length of the new function is 0, etc. That way apps can't
    // accidentally depend on those details.
    return function () {
      // $FlowFixMe[incompatible-call]: We don't want to use rest arguments since we transpile the code.
      return fn.apply(null, arguments);
    };
  }
  const cache = noopCache ;

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */

  function resolveDispatcher() {
    const dispatcher = ReactSharedInternals.H;

    {
      if (dispatcher === null) {
        console.error('Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' + ' one of the following reasons:\n' + '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' + '2. You might be breaking the Rules of Hooks\n' + '3. You might have more than one copy of React in the same app\n' + 'See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.');
      }
    } // Will result in a null access error if accessed outside render phase. We
    // intentionally don't throw our own error because this is in a hot path.
    // Also helps ensure this is inlined.


    return dispatcher;
  }

  function getCacheForType(resourceType) {
    const dispatcher = ReactSharedInternals.A;

    if (!dispatcher) {
      // If there is no dispatcher, then we treat this as not being cached.
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
    const dispatcher = resolveDispatcher(); // $FlowFixMe[not-a-function] This is unstable, thus optional

    return dispatcher.useCacheRefresh();
  }
  function use(usable) {
    const dispatcher = resolveDispatcher();
    return dispatcher.use(usable);
  }
  function useMemoCache(size) {
    const dispatcher = resolveDispatcher(); // $FlowFixMe[not-a-function] This is unstable, thus optional

    return dispatcher.useMemoCache(size);
  }
  function useEffectEvent(callback) {
    const dispatcher = resolveDispatcher(); // $FlowFixMe[not-a-function] This is unstable, thus optional

    return dispatcher.useEffectEvent(callback);
  }
  function useOptimistic(passthrough, reducer) {
    const dispatcher = resolveDispatcher(); // $FlowFixMe[not-a-function] This is unstable, thus optional

    return dispatcher.useOptimistic(passthrough, reducer);
  }
  function useActionState(action, initialState, permalink) {
    {
      const dispatcher = resolveDispatcher(); // $FlowFixMe[not-a-function] This is unstable, thus optional

      return dispatcher.useActionState(action, initialState, permalink);
    }
  }

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
  const reportGlobalError = typeof reportError === 'function' ? // In modern browsers, reportError will dispatch an error event,
  // emulating an uncaught JavaScript error.
  reportError : error => {
    if (typeof window === 'object' && typeof window.ErrorEvent === 'function') {
      // Browser Polyfill
      const message = typeof error === 'object' && error !== null && typeof error.message === 'string' ? // eslint-disable-next-line react-internal/safe-string-coercion
      String(error.message) : // eslint-disable-next-line react-internal/safe-string-coercion
      String(error);
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
    } else if (typeof process === 'object' && // $FlowFixMe[method-unbinding]
    typeof process.emit === 'function') {
      // Node Polyfill
      process.emit('uncaughtException', error);
      return;
    }

    console['error'](error);
  };

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
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

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
  var ReactCompilerRuntime = {
    c: useMemoCache
  };

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
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

}));
//# sourceMappingURL=react.production.js.map
