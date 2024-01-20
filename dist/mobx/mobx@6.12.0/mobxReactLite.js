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
        }
        mobx.configure({ reactionScheduler });
    }
    const isObserverBatched = () => {
        return true;
    };

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

    {
      shim.exports = requireUseSyncExternalStoreShim_production_min();
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
    ObserverComponent.displayName = "Observer";

    function useLocalObservable(initializer, annotations) {
        return require$$0.useState(() => mobx.observable(initializer(), annotations, { autoBind: true }))[0];
    }

    function useAsObservableSource(current) {
        const [res] = require$$0.useState(() => mobx.observable(current, {}, { deep: false }));
        mobx.runInAction(() => {
            Object.assign(res, current);
        });
        return res;
    }

    function useLocalStore(initializer, current) {
        const source = current && useAsObservableSource(current);
        return require$$0.useState(() => mobx.observable(initializer(source), undefined, { autoBind: true }))[0];
    }

    observerBatching(reactDom.unstable_batchedUpdates);
    const clearTimers = observerFinalizationRegistry["finalizeAllImmediately"] ?? (() => { });
    function useObserver(fn, baseComponentName = "observed") {
        return useObserver$1(fn, baseComponentName);
    }
    function useStaticRendering(enable) {
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
