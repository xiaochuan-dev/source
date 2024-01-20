(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('mobx'), require('react'), require('react-dom')) :
    typeof define === 'function' && define.amd ? define(['exports', 'mobx', 'react', 'react-dom'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.mobxReactLite = {}, global.mobx, global.React, global.ReactDOM));
})(this, (function (exports, mobx, require$$0, reactDom) { 'use strict';

    if (!require$$0.useState) {
        throw new Error("mobx-react-lite requires React with Hooks support");
    }
    if (!mobx.makeObservable) {
        throw new Error("mobx-react-lite@3 requires mobx at least version 6 to be available");
    }

    function defaultNoopBatch(callback) {
        callback();
    }
    function observerBatching(reactionScheduler) {
        if (!reactionScheduler) {
            reactionScheduler = defaultNoopBatch;
            if ("production" !== process.env.NODE_ENV) {
                console.warn("[MobX] Failed to get unstable_batched updates from react-dom / react-native");
            }
        }
        mobx.configure({ reactionScheduler });
    }
    const isObserverBatched = () => {
        if ("production" !== process.env.NODE_ENV) {
            console.warn("[MobX] Deprecated");
        }
        return true;
    };

    const deprecatedMessages = [];
    function useDeprecated(msg) {
        if (!deprecatedMessages.includes(msg)) {
            deprecatedMessages.push(msg);
            console.warn(msg);
        }
    }

    function printDebugValue(v) {
        return mobx.getDependencyTree(v);
    }

    let globalIsUsingStaticRendering = false;
    function enableStaticRendering(enable) {
        globalIsUsingStaticRendering = enable;
    }
    function isUsingStaticRendering() {
        return globalIsUsingStaticRendering;
    }

    const REGISTRY_FINALIZE_AFTER = 10_000;
    const REGISTRY_SWEEP_INTERVAL = 10_000;
    class TimerBasedFinalizationRegistry {
        finalize;
        registrations = new Map();
        sweepTimeout;
        constructor(finalize) {
            this.finalize = finalize;
        }
        // Token is actually required with this impl
        register(target, value, token) {
            this.registrations.set(token, {
                value,
                registeredAt: Date.now()
            });
            this.scheduleSweep();
        }
        unregister(token) {
            this.registrations.delete(token);
        }
        // Bound so it can be used directly as setTimeout callback.
        sweep = (maxAge = REGISTRY_FINALIZE_AFTER) => {
            // cancel timeout so we can force sweep anytime
            clearTimeout(this.sweepTimeout);
            this.sweepTimeout = undefined;
            const now = Date.now();
            this.registrations.forEach((registration, token) => {
                if (now - registration.registeredAt >= maxAge) {
                    this.finalize(registration.value);
                    this.registrations.delete(token);
                }
            });
            if (this.registrations.size > 0) {
                this.scheduleSweep();
            }
        };
        // Bound so it can be exported directly as clearTimers test utility.
        finalizeAllImmediately = () => {
            this.sweep(0);
        };
        scheduleSweep() {
            if (this.sweepTimeout === undefined) {
                this.sweepTimeout = setTimeout(this.sweep, REGISTRY_SWEEP_INTERVAL);
            }
        }
    }
    const UniversalFinalizationRegistry = typeof FinalizationRegistry !== "undefined"
        ? FinalizationRegistry
        : TimerBasedFinalizationRegistry;

    const observerFinalizationRegistry = new UniversalFinalizationRegistry((adm) => {
        adm.reaction?.dispose();
        adm.reaction = null;
    });

    var shim = {exports: {}};

    var useSyncExternalStoreShim_development = {};

    /**
     * @license React
     * use-sync-external-store-shim.development.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var hasRequiredUseSyncExternalStoreShim_development;

    function requireUseSyncExternalStoreShim_development () {
    	if (hasRequiredUseSyncExternalStoreShim_development) return useSyncExternalStoreShim_development;
    	hasRequiredUseSyncExternalStoreShim_development = 1;

    	if (process.env.NODE_ENV !== "production") {
    	  (function() {

    	/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
    	if (
    	  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
    	  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart ===
    	    'function'
    	) {
    	  __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    	}
    	          var React = require$$0;

    	var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

    	function error(format) {
    	  {
    	    {
    	      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    	        args[_key2 - 1] = arguments[_key2];
    	      }

    	      printWarning('error', format, args);
    	    }
    	  }
    	}

    	function printWarning(level, format, args) {
    	  // When changing this logic, you might want to also
    	  // update consoleWithStackDev.www.js as well.
    	  {
    	    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    	    var stack = ReactDebugCurrentFrame.getStackAddendum();

    	    if (stack !== '') {
    	      format += '%s';
    	      args = args.concat([stack]);
    	    } // eslint-disable-next-line react-internal/safe-string-coercion


    	    var argsWithFormat = args.map(function (item) {
    	      return String(item);
    	    }); // Careful: RN currently depends on this prefix

    	    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
    	    // breaks IE9: https://github.com/facebook/react/issues/13610
    	    // eslint-disable-next-line react-internal/no-production-logging

    	    Function.prototype.apply.call(console[level], console, argsWithFormat);
    	  }
    	}

    	/**
    	 * inlined Object.is polyfill to avoid requiring consumers ship their own
    	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
    	 */
    	function is(x, y) {
    	  return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y // eslint-disable-line no-self-compare
    	  ;
    	}

    	var objectIs = typeof Object.is === 'function' ? Object.is : is;

    	// dispatch for CommonJS interop named imports.

    	var useState = React.useState,
    	    useEffect = React.useEffect,
    	    useLayoutEffect = React.useLayoutEffect,
    	    useDebugValue = React.useDebugValue;
    	var didWarnOld18Alpha = false;
    	var didWarnUncachedGetSnapshot = false; // Disclaimer: This shim breaks many of the rules of React, and only works
    	// because of a very particular set of implementation details and assumptions
    	// -- change any one of them and it will break. The most important assumption
    	// is that updates are always synchronous, because concurrent rendering is
    	// only available in versions of React that also have a built-in
    	// useSyncExternalStore API. And we only use this shim when the built-in API
    	// does not exist.
    	//
    	// Do not assume that the clever hacks used by this hook also work in general.
    	// The point of this shim is to replace the need for hacks by other libraries.

    	function useSyncExternalStore(subscribe, getSnapshot, // Note: The shim does not use getServerSnapshot, because pre-18 versions of
    	// React do not expose a way to check if we're hydrating. So users of the shim
    	// will need to track that themselves and return the correct value
    	// from `getSnapshot`.
    	getServerSnapshot) {
    	  {
    	    if (!didWarnOld18Alpha) {
    	      if (React.startTransition !== undefined) {
    	        didWarnOld18Alpha = true;

    	        error('You are using an outdated, pre-release alpha of React 18 that ' + 'does not support useSyncExternalStore. The ' + 'use-sync-external-store shim will not work correctly. Upgrade ' + 'to a newer pre-release.');
    	      }
    	    }
    	  } // Read the current snapshot from the store on every render. Again, this
    	  // breaks the rules of React, and only works here because of specific
    	  // implementation details, most importantly that updates are
    	  // always synchronous.


    	  var value = getSnapshot();

    	  {
    	    if (!didWarnUncachedGetSnapshot) {
    	      var cachedValue = getSnapshot();

    	      if (!objectIs(value, cachedValue)) {
    	        error('The result of getSnapshot should be cached to avoid an infinite loop');

    	        didWarnUncachedGetSnapshot = true;
    	      }
    	    }
    	  } // Because updates are synchronous, we don't queue them. Instead we force a
    	  // re-render whenever the subscribed state changes by updating an some
    	  // arbitrary useState hook. Then, during render, we call getSnapshot to read
    	  // the current value.
    	  //
    	  // Because we don't actually use the state returned by the useState hook, we
    	  // can save a bit of memory by storing other stuff in that slot.
    	  //
    	  // To implement the early bailout, we need to track some things on a mutable
    	  // object. Usually, we would put that in a useRef hook, but we can stash it in
    	  // our useState hook instead.
    	  //
    	  // To force a re-render, we call forceUpdate({inst}). That works because the
    	  // new object always fails an equality check.


    	  var _useState = useState({
    	    inst: {
    	      value: value,
    	      getSnapshot: getSnapshot
    	    }
    	  }),
    	      inst = _useState[0].inst,
    	      forceUpdate = _useState[1]; // Track the latest getSnapshot function with a ref. This needs to be updated
    	  // in the layout phase so we can access it during the tearing check that
    	  // happens on subscribe.


    	  useLayoutEffect(function () {
    	    inst.value = value;
    	    inst.getSnapshot = getSnapshot; // Whenever getSnapshot or subscribe changes, we need to check in the
    	    // commit phase if there was an interleaved mutation. In concurrent mode
    	    // this can happen all the time, but even in synchronous mode, an earlier
    	    // effect may have mutated the store.

    	    if (checkIfSnapshotChanged(inst)) {
    	      // Force a re-render.
    	      forceUpdate({
    	        inst: inst
    	      });
    	    }
    	  }, [subscribe, value, getSnapshot]);
    	  useEffect(function () {
    	    // Check for changes right before subscribing. Subsequent changes will be
    	    // detected in the subscription handler.
    	    if (checkIfSnapshotChanged(inst)) {
    	      // Force a re-render.
    	      forceUpdate({
    	        inst: inst
    	      });
    	    }

    	    var handleStoreChange = function () {
    	      // TODO: Because there is no cross-renderer API for batching updates, it's
    	      // up to the consumer of this library to wrap their subscription event
    	      // with unstable_batchedUpdates. Should we try to detect when this isn't
    	      // the case and print a warning in development?
    	      // The store changed. Check if the snapshot changed since the last time we
    	      // read from the store.
    	      if (checkIfSnapshotChanged(inst)) {
    	        // Force a re-render.
    	        forceUpdate({
    	          inst: inst
    	        });
    	      }
    	    }; // Subscribe to the store and return a clean-up function.


    	    return subscribe(handleStoreChange);
    	  }, [subscribe]);
    	  useDebugValue(value);
    	  return value;
    	}

    	function checkIfSnapshotChanged(inst) {
    	  var latestGetSnapshot = inst.getSnapshot;
    	  var prevValue = inst.value;

    	  try {
    	    var nextValue = latestGetSnapshot();
    	    return !objectIs(prevValue, nextValue);
    	  } catch (error) {
    	    return true;
    	  }
    	}

    	function useSyncExternalStore$1(subscribe, getSnapshot, getServerSnapshot) {
    	  // Note: The shim does not use getServerSnapshot, because pre-18 versions of
    	  // React do not expose a way to check if we're hydrating. So users of the shim
    	  // will need to track that themselves and return the correct value
    	  // from `getSnapshot`.
    	  return getSnapshot();
    	}

    	var canUseDOM = !!(typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined');

    	var isServerEnvironment = !canUseDOM;

    	var shim = isServerEnvironment ? useSyncExternalStore$1 : useSyncExternalStore;
    	var useSyncExternalStore$2 = React.useSyncExternalStore !== undefined ? React.useSyncExternalStore : shim;

    	useSyncExternalStoreShim_development.useSyncExternalStore = useSyncExternalStore$2;
    	          /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
    	if (
    	  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
    	  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop ===
    	    'function'
    	) {
    	  __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    	}
    	        
    	  })();
    	}
    	return useSyncExternalStoreShim_development;
    }

    var useSyncExternalStoreShim_production_min = {};

    /**
     * @license React
     * use-sync-external-store-shim.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var hasRequiredUseSyncExternalStoreShim_production_min;

    function requireUseSyncExternalStoreShim_production_min () {
    	if (hasRequiredUseSyncExternalStoreShim_production_min) return useSyncExternalStoreShim_production_min;
    	hasRequiredUseSyncExternalStoreShim_production_min = 1;
    var e=require$$0;function h(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var k="function"===typeof Object.is?Object.is:h,l=e.useState,m=e.useEffect,n=e.useLayoutEffect,p=e.useDebugValue;function q(a,b){var d=b(),f=l({inst:{value:d,getSnapshot:b}}),c=f[0].inst,g=f[1];n(function(){c.value=d;c.getSnapshot=b;r(c)&&g({inst:c});},[a,d,b]);m(function(){r(c)&&g({inst:c});return a(function(){r(c)&&g({inst:c});})},[a]);p(d);return d}
    	function r(a){var b=a.getSnapshot;a=a.value;try{var d=b();return !k(a,d)}catch(f){return !0}}function t(a,b){return b()}var u="undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement?t:q;useSyncExternalStoreShim_production_min.useSyncExternalStore=void 0!==e.useSyncExternalStore?e.useSyncExternalStore:u;
    	return useSyncExternalStoreShim_production_min;
    }

    if (process.env.NODE_ENV === 'production') {
      shim.exports = requireUseSyncExternalStoreShim_production_min();
    } else {
      shim.exports = requireUseSyncExternalStoreShim_development();
    }

    var shimExports = shim.exports;

    // Required by SSR when hydrating #3669
    const getServerSnapshot = () => { };
    function createReaction(adm) {
        adm.reaction = new mobx.Reaction(`observer${adm.name}`, () => {
            adm.stateVersion = Symbol();
            // onStoreChange won't be available until the component "mounts".
            // If state changes in between initial render and mount,
            // `useSyncExternalStore` should handle that by checking the state version and issuing update.
            adm.onStoreChange?.();
        });
    }
    function useObserver$1(render, baseComponentName = "observed") {
        if (isUsingStaticRendering()) {
            return render();
        }
        const admRef = require$$0.useRef(null);
        if (!admRef.current) {
            // First render
            const adm = {
                reaction: null,
                onStoreChange: null,
                stateVersion: Symbol(),
                name: baseComponentName,
                subscribe(onStoreChange) {
                    // Do NOT access admRef here!
                    observerFinalizationRegistry.unregister(adm);
                    adm.onStoreChange = onStoreChange;
                    if (!adm.reaction) {
                        // We've lost our reaction and therefore all subscriptions, occurs when:
                        // 1. Timer based finalization registry disposed reaction before component mounted.
                        // 2. React "re-mounts" same component without calling render in between (typically <StrictMode>).
                        // We have to recreate reaction and schedule re-render to recreate subscriptions,
                        // even if state did not change.
                        createReaction(adm);
                        // `onStoreChange` won't force update if subsequent `getSnapshot` returns same value.
                        // So we make sure that is not the case
                        adm.stateVersion = Symbol();
                    }
                    return () => {
                        // Do NOT access admRef here!
                        adm.onStoreChange = null;
                        adm.reaction?.dispose();
                        adm.reaction = null;
                    };
                },
                getSnapshot() {
                    // Do NOT access admRef here!
                    return adm.stateVersion;
                }
            };
            admRef.current = adm;
        }
        const adm = admRef.current;
        if (!adm.reaction) {
            // First render or reaction was disposed by registry before subscribe
            createReaction(adm);
            // StrictMode/ConcurrentMode/Suspense may mean that our component is
            // rendered and abandoned multiple times, so we need to track leaked
            // Reactions.
            observerFinalizationRegistry.register(admRef, adm, adm);
        }
        require$$0.useDebugValue(adm.reaction, printDebugValue);
        shimExports.useSyncExternalStore(
        // Both of these must be stable, otherwise it would keep resubscribing every render.
        adm.subscribe, adm.getSnapshot, getServerSnapshot);
        // render the original component, but have the
        // reaction track the observables, so that rendering
        // can be invalidated (see above) once a dependency changes
        let renderResult;
        let exception;
        adm.reaction.track(() => {
            try {
                renderResult = render();
            }
            catch (e) {
                exception = e;
            }
        });
        if (exception) {
            throw exception; // re-throw any exceptions caught during rendering
        }
        return renderResult;
    }

    let warnObserverOptionsDeprecated = true;
    const hasSymbol = typeof Symbol === "function" && Symbol.for;
    // Using react-is had some issues (and operates on elements, not on types), see #608 / #609
    const ReactForwardRefSymbol = hasSymbol
        ? Symbol.for("react.forward_ref")
        : typeof require$$0.forwardRef === "function" && require$$0.forwardRef((props) => null)["$$typeof"];
    const ReactMemoSymbol = hasSymbol
        ? Symbol.for("react.memo")
        : typeof require$$0.memo === "function" && require$$0.memo((props) => null)["$$typeof"];
    // n.b. base case is not used for actual typings or exported in the typing files
    function observer(baseComponent, 
    // TODO remove in next major
    options) {
        if (process.env.NODE_ENV !== "production" && warnObserverOptionsDeprecated && options) {
            warnObserverOptionsDeprecated = false;
            console.warn(`[mobx-react-lite] \`observer(fn, { forwardRef: true })\` is deprecated, use \`observer(React.forwardRef(fn))\``);
        }
        if (ReactMemoSymbol && baseComponent["$$typeof"] === ReactMemoSymbol) {
            throw new Error(`[mobx-react-lite] You are trying to use \`observer\` on a function component wrapped in either another \`observer\` or \`React.memo\`. The observer already applies 'React.memo' for you.`);
        }
        // The working of observer is explained step by step in this talk: https://www.youtube.com/watch?v=cPF4iBedoF0&feature=youtu.be&t=1307
        if (isUsingStaticRendering()) {
            return baseComponent;
        }
        let useForwardRef = options?.forwardRef ?? false;
        let render = baseComponent;
        const baseComponentName = baseComponent.displayName || baseComponent.name;
        // If already wrapped with forwardRef, unwrap,
        // so we can patch render and apply memo
        if (ReactForwardRefSymbol && baseComponent["$$typeof"] === ReactForwardRefSymbol) {
            useForwardRef = true;
            render = baseComponent["render"];
            if (typeof render !== "function") {
                throw new Error(`[mobx-react-lite] \`render\` property of ForwardRef was not a function`);
            }
        }
        let observerComponent = (props, ref) => {
            return useObserver$1(() => render(props, ref), baseComponentName);
        };
        observerComponent.displayName = baseComponent.displayName;
        Object.defineProperty(observerComponent, "name", {
            value: baseComponent.name,
            writable: true,
            configurable: true
        });
        // Support legacy context: `contextTypes` must be applied before `memo`
        if (baseComponent.contextTypes) {
            observerComponent.contextTypes = baseComponent.contextTypes;
        }
        if (useForwardRef) {
            // `forwardRef` must be applied prior `memo`
            // `forwardRef(observer(cmp))` throws:
            // "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))"
            observerComponent = require$$0.forwardRef(observerComponent);
        }
        // memo; we are not interested in deep updates
        // in props; we assume that if deep objects are changed,
        // this is in observables, which would have been tracked anyway
        observerComponent = require$$0.memo(observerComponent);
        copyStaticProperties(baseComponent, observerComponent);
        if ("production" !== process.env.NODE_ENV) {
            Object.defineProperty(observerComponent, "contextTypes", {
                set() {
                    throw new Error(`[mobx-react-lite] \`${this.displayName || this.type?.displayName || this.type?.name || "Component"}.contextTypes\` must be set before applying \`observer\`.`);
                }
            });
        }
        return observerComponent;
    }
    // based on https://github.com/mridgway/hoist-non-react-statics/blob/master/src/index.js
    const hoistBlackList = {
        $$typeof: true,
        render: true,
        compare: true,
        type: true,
        // Don't redefine `displayName`,
        // it's defined as getter-setter pair on `memo` (see #3192).
        displayName: true
    };
    function copyStaticProperties(base, target) {
        Object.keys(base).forEach(key => {
            if (!hoistBlackList[key]) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(base, key));
            }
        });
    }

    function ObserverComponent({ children, render }) {
        const component = children || render;
        if (typeof component !== "function") {
            return null;
        }
        return useObserver$1(component);
    }
    if ("production" !== process.env.NODE_ENV) {
        ObserverComponent.propTypes = {
            children: ObserverPropsCheck,
            render: ObserverPropsCheck
        };
    }
    ObserverComponent.displayName = "Observer";
    function ObserverPropsCheck(props, key, componentName, location, propFullName) {
        const extraKey = key === "children" ? "render" : "children";
        const hasProp = typeof props[key] === "function";
        const hasExtraProp = typeof props[extraKey] === "function";
        if (hasProp && hasExtraProp) {
            return new Error("MobX Observer: Do not use children and render in the same time in`" + componentName);
        }
        if (hasProp || hasExtraProp) {
            return null;
        }
        return new Error("Invalid prop `" +
            propFullName +
            "` of type `" +
            typeof props[key] +
            "` supplied to" +
            " `" +
            componentName +
            "`, expected `function`.");
    }

    function useLocalObservable(initializer, annotations) {
        return require$$0.useState(() => mobx.observable(initializer(), annotations, { autoBind: true }))[0];
    }

    function useAsObservableSource(current) {
        if ("production" !== process.env.NODE_ENV)
            useDeprecated("[mobx-react-lite] 'useAsObservableSource' is deprecated, please store the values directly in an observable, for example by using 'useLocalObservable', and sync future updates using 'useEffect' when needed. See the README for examples.");
        const [res] = require$$0.useState(() => mobx.observable(current, {}, { deep: false }));
        mobx.runInAction(() => {
            Object.assign(res, current);
        });
        return res;
    }

    function useLocalStore(initializer, current) {
        if ("production" !== process.env.NODE_ENV) {
            useDeprecated("[mobx-react-lite] 'useLocalStore' is deprecated, use 'useLocalObservable' instead.");
        }
        const source = current && useAsObservableSource(current);
        return require$$0.useState(() => mobx.observable(initializer(source), undefined, { autoBind: true }))[0];
    }

    observerBatching(reactDom.unstable_batchedUpdates);
    const clearTimers = observerFinalizationRegistry["finalizeAllImmediately"] ?? (() => { });
    function useObserver(fn, baseComponentName = "observed") {
        if ("production" !== process.env.NODE_ENV) {
            useDeprecated("[mobx-react-lite] 'useObserver(fn)' is deprecated. Use `<Observer>{fn}</Observer>` instead, or wrap the entire component in `observer`.");
        }
        return useObserver$1(fn, baseComponentName);
    }
    function useStaticRendering(enable) {
        if ("production" !== process.env.NODE_ENV) {
            console.warn("[mobx-react-lite] 'useStaticRendering' is deprecated, use 'enableStaticRendering' instead");
        }
        enableStaticRendering(enable);
    }

    exports.Observer = ObserverComponent;
    exports._observerFinalizationRegistry = observerFinalizationRegistry;
    exports.clearTimers = clearTimers;
    exports.enableStaticRendering = enableStaticRendering;
    exports.isObserverBatched = isObserverBatched;
    exports.isUsingStaticRendering = isUsingStaticRendering;
    exports.observer = observer;
    exports.observerBatching = observerBatching;
    exports.useAsObservableSource = useAsObservableSource;
    exports.useLocalObservable = useLocalObservable;
    exports.useLocalStore = useLocalStore;
    exports.useObserver = useObserver;
    exports.useStaticRendering = useStaticRendering;

}));
//# sourceMappingURL=mobxReactLite.js.map
