(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("mobx"), require("React"), require("ReactDOM"));
	else if(typeof define === 'function' && define.amd)
		define(["mobx", "React", "ReactDOM"], factory);
	else if(typeof exports === 'object')
		exports["mobxReactLite"] = factory(require("mobx"), require("React"), require("ReactDOM"));
	else
		root["mobxReactLite"] = factory(root["mobx"], root["React"], root["ReactDOM"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__259__, __WEBPACK_EXTERNAL_MODULE__24__, __WEBPACK_EXTERNAL_MODULE__314__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 250:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var e=__webpack_require__(24);function h(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var k="function"===typeof Object.is?Object.is:h,l=e.useState,m=e.useEffect,n=e.useLayoutEffect,p=e.useDebugValue;function q(a,b){var d=b(),f=l({inst:{value:d,getSnapshot:b}}),c=f[0].inst,g=f[1];n(function(){c.value=d;c.getSnapshot=b;r(c)&&g({inst:c})},[a,d,b]);m(function(){r(c)&&g({inst:c});return a(function(){r(c)&&g({inst:c})})},[a]);p(d);return d}
function r(a){var b=a.getSnapshot;a=a.value;try{var d=b();return!k(a,d)}catch(f){return!0}}function t(a,b){return b()}var u="undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement?t:q;exports.useSyncExternalStore=void 0!==e.useSyncExternalStore?e.useSyncExternalStore:u;


/***/ }),

/***/ 688:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



if (true) {
  module.exports = __webpack_require__(250);
} else {}


/***/ }),

/***/ 24:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__24__;

/***/ }),

/***/ 314:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__314__;

/***/ }),

/***/ 259:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__259__;

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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Observer: () => (/* reexport */ ObserverComponent),
  _observerFinalizationRegistry: () => (/* reexport */ observerFinalizationRegistry),
  clearTimers: () => (/* binding */ clearTimers),
  enableStaticRendering: () => (/* reexport */ enableStaticRendering),
  isObserverBatched: () => (/* reexport */ isObserverBatched),
  isUsingStaticRendering: () => (/* reexport */ isUsingStaticRendering),
  observer: () => (/* reexport */ observer),
  observerBatching: () => (/* reexport */ observerBatching),
  useAsObservableSource: () => (/* reexport */ useAsObservableSource),
  useLocalObservable: () => (/* reexport */ useLocalObservable),
  useLocalStore: () => (/* reexport */ useLocalStore),
  useObserver: () => (/* binding */ src_useObserver),
  useStaticRendering: () => (/* binding */ useStaticRendering)
});

// EXTERNAL MODULE: external "mobx"
var external_mobx_ = __webpack_require__(259);
// EXTERNAL MODULE: external "React"
var external_React_ = __webpack_require__(24);
var external_React_default = /*#__PURE__*/__webpack_require__.n(external_React_);
;// CONCATENATED MODULE: ./packages/mobx-react-lite/src/utils/assertEnvironment.ts


if (!external_React_.useState) {
    throw new Error("mobx-react-lite requires React with Hooks support");
}
if (!external_mobx_.makeObservable) {
    throw new Error("mobx-react-lite@3 requires mobx at least version 6 to be available");
}

// EXTERNAL MODULE: external "ReactDOM"
var external_ReactDOM_ = __webpack_require__(314);
;// CONCATENATED MODULE: ./packages/mobx-react-lite/src/utils/reactBatchedUpdates.ts


;// CONCATENATED MODULE: ./packages/mobx-react-lite/src/utils/observerBatching.ts

function defaultNoopBatch(callback) {
    callback();
}
function observerBatching(reactionScheduler) {
    if (!reactionScheduler) {
        reactionScheduler = defaultNoopBatch;
        if (false) {}
    }
    (0,external_mobx_.configure)({ reactionScheduler });
}
const isObserverBatched = () => {
    if (false) {}
    return true;
};

;// CONCATENATED MODULE: ./packages/mobx-react-lite/src/utils/printDebugValue.ts

function printDebugValue(v) {
    return (0,external_mobx_.getDependencyTree)(v);
}

;// CONCATENATED MODULE: ./packages/mobx-react-lite/src/staticRendering.ts
let globalIsUsingStaticRendering = false;
function enableStaticRendering(enable) {
    globalIsUsingStaticRendering = enable;
}
function isUsingStaticRendering() {
    return globalIsUsingStaticRendering;
}

;// CONCATENATED MODULE: ./packages/mobx-react-lite/src/utils/UniversalFinalizationRegistry.ts
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

;// CONCATENATED MODULE: ./packages/mobx-react-lite/src/utils/observerFinalizationRegistry.ts

const observerFinalizationRegistry = new UniversalFinalizationRegistry((adm) => {
    adm.reaction?.dispose();
    adm.reaction = null;
});

// EXTERNAL MODULE: ./node_modules/use-sync-external-store/shim/index.js
var shim = __webpack_require__(688);
;// CONCATENATED MODULE: ./packages/mobx-react-lite/src/useObserver.ts






// Required by SSR when hydrating #3669
const getServerSnapshot = () => { };
function createReaction(adm) {
    adm.reaction = new external_mobx_.Reaction(`observer${adm.name}`, () => {
        adm.stateVersion = Symbol();
        // onStoreChange won't be available until the component "mounts".
        // If state changes in between initial render and mount,
        // `useSyncExternalStore` should handle that by checking the state version and issuing update.
        adm.onStoreChange?.();
    });
}
function useObserver(render, baseComponentName = "observed") {
    if (isUsingStaticRendering()) {
        return render();
    }
    const admRef = external_React_default().useRef(null);
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
    external_React_default().useDebugValue(adm.reaction, printDebugValue);
    (0,shim.useSyncExternalStore)(
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

;// CONCATENATED MODULE: ./packages/mobx-react-lite/src/observer.ts



let warnObserverOptionsDeprecated = true;
const hasSymbol = typeof Symbol === "function" && Symbol.for;
// Using react-is had some issues (and operates on elements, not on types), see #608 / #609
const ReactForwardRefSymbol = hasSymbol
    ? Symbol.for("react.forward_ref")
    : typeof external_React_.forwardRef === "function" && (0,external_React_.forwardRef)((props) => null)["$$typeof"];
const ReactMemoSymbol = hasSymbol
    ? Symbol.for("react.memo")
    : typeof external_React_.memo === "function" && (0,external_React_.memo)((props) => null)["$$typeof"];
// n.b. base case is not used for actual typings or exported in the typing files
function observer(baseComponent, 
// TODO remove in next major
options) {
    if (false) {}
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
        return useObserver(() => render(props, ref), baseComponentName);
    };
    observerComponent.displayName = baseComponent.displayName;
    Object.defineProperty(observerComponent, "name", {
        value: baseComponent.name,
        writable: true,
        configurable: true
    });
    // Support legacy context: `contextTypes` must be applied before `memo`
    if (baseComponent.contextTypes) {
        ;
        observerComponent.contextTypes = baseComponent.contextTypes;
    }
    if (useForwardRef) {
        // `forwardRef` must be applied prior `memo`
        // `forwardRef(observer(cmp))` throws:
        // "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))"
        observerComponent = (0,external_React_.forwardRef)(observerComponent);
    }
    // memo; we are not interested in deep updates
    // in props; we assume that if deep objects are changed,
    // this is in observables, which would have been tracked anyway
    observerComponent = (0,external_React_.memo)(observerComponent);
    copyStaticProperties(baseComponent, observerComponent);
    if (false) {}
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

;// CONCATENATED MODULE: ./packages/mobx-react-lite/src/ObserverComponent.ts

function ObserverComponent({ children, render }) {
    const component = children || render;
    if (typeof component !== "function") {
        return null;
    }
    return useObserver(component);
}
if (false) {}
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

;// CONCATENATED MODULE: ./packages/mobx-react-lite/src/useLocalObservable.ts


function useLocalObservable(initializer, annotations) {
    return (0,external_React_.useState)(() => (0,external_mobx_.observable)(initializer(), annotations, { autoBind: true }))[0];
}

;// CONCATENATED MODULE: ./packages/mobx-react-lite/src/useAsObservableSource.ts



function useAsObservableSource(current) {
    if (false)
        {}
    const [res] = (0,external_React_.useState)(() => (0,external_mobx_.observable)(current, {}, { deep: false }));
    (0,external_mobx_.runInAction)(() => {
        Object.assign(res, current);
    });
    return res;
}

;// CONCATENATED MODULE: ./packages/mobx-react-lite/src/useLocalStore.ts




function useLocalStore(initializer, current) {
    if (false) {}
    const source = current && useAsObservableSource(current);
    return (0,external_React_.useState)(() => (0,external_mobx_.observable)(initializer(source), undefined, { autoBind: true }))[0];
}

;// CONCATENATED MODULE: ./packages/mobx-react-lite/src/index.ts







observerBatching(external_ReactDOM_.unstable_batchedUpdates);







const clearTimers = observerFinalizationRegistry["finalizeAllImmediately"] ?? (() => { });
function src_useObserver(fn, baseComponentName = "observed") {
    if (false) {}
    return useObserver(fn, baseComponentName);
}

function useStaticRendering(enable) {
    if (false) {}
    enableStaticRendering(enable);
}

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=mobxReactLite.js.map