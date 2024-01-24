(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ReactQueryCore"] = factory();
	else
		root["ReactQueryCore"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  CancelledError: () => (/* reexport */ CancelledError),
  InfiniteQueryObserver: () => (/* reexport */ InfiniteQueryObserver),
  MutationCache: () => (/* reexport */ MutationCache),
  MutationObserver: () => (/* reexport */ MutationObserver),
  QueriesObserver: () => (/* reexport */ QueriesObserver),
  Query: () => (/* reexport */ Query),
  QueryCache: () => (/* reexport */ QueryCache),
  QueryClient: () => (/* reexport */ QueryClient),
  QueryObserver: () => (/* reexport */ QueryObserver),
  defaultShouldDehydrateMutation: () => (/* reexport */ defaultShouldDehydrateMutation),
  defaultShouldDehydrateQuery: () => (/* reexport */ defaultShouldDehydrateQuery),
  dehydrate: () => (/* reexport */ dehydrate),
  focusManager: () => (/* reexport */ focusManager),
  hashKey: () => (/* reexport */ hashKey),
  hydrate: () => (/* reexport */ hydrate),
  isCancelledError: () => (/* reexport */ isCancelledError),
  isServer: () => (/* reexport */ isServer),
  keepPreviousData: () => (/* reexport */ keepPreviousData),
  matchQuery: () => (/* reexport */ matchQuery),
  notifyManager: () => (/* reexport */ notifyManager),
  onlineManager: () => (/* reexport */ onlineManager),
  replaceEqualDeep: () => (/* reexport */ replaceEqualDeep)
});

;// CONCATENATED MODULE: ./packages/query-core/src/subscribable.ts
class Subscribable {
    constructor() {
        this.listeners = new Set();
        this.subscribe = this.subscribe.bind(this);
    }
    subscribe(listener) {
        this.listeners.add(listener);
        this.onSubscribe();
        return () => {
            this.listeners.delete(listener);
            this.onUnsubscribe();
        };
    }
    hasListeners() {
        return this.listeners.size > 0;
    }
    onSubscribe() {
        // Do nothing
    }
    onUnsubscribe() {
        // Do nothing
    }
}

;// CONCATENATED MODULE: ./packages/query-core/src/utils.ts
// UTILS
const isServer = typeof window === 'undefined' || 'Deno' in window;
function noop() {
    return undefined;
}
function functionalUpdate(updater, input) {
    return typeof updater === 'function'
        ? updater(input)
        : updater;
}
function isValidTimeout(value) {
    return typeof value === 'number' && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
    return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function matchQuery(filters, query) {
    const { type = 'all', exact, fetchStatus, predicate, queryKey, stale, } = filters;
    if (queryKey) {
        if (exact) {
            if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
                return false;
            }
        }
        else if (!partialMatchKey(query.queryKey, queryKey)) {
            return false;
        }
    }
    if (type !== 'all') {
        const isActive = query.isActive();
        if (type === 'active' && !isActive) {
            return false;
        }
        if (type === 'inactive' && isActive) {
            return false;
        }
    }
    if (typeof stale === 'boolean' && query.isStale() !== stale) {
        return false;
    }
    if (typeof fetchStatus !== 'undefined' &&
        fetchStatus !== query.state.fetchStatus) {
        return false;
    }
    if (predicate && !predicate(query)) {
        return false;
    }
    return true;
}
function matchMutation(filters, mutation) {
    const { exact, status, predicate, mutationKey } = filters;
    if (mutationKey) {
        if (!mutation.options.mutationKey) {
            return false;
        }
        if (exact) {
            if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) {
                return false;
            }
        }
        else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
            return false;
        }
    }
    if (status && mutation.state.status !== status) {
        return false;
    }
    if (predicate && !predicate(mutation)) {
        return false;
    }
    return true;
}
function hashQueryKeyByOptions(queryKey, options) {
    const hashFn = options?.queryKeyHashFn || hashKey;
    return hashFn(queryKey);
}
/**
 * Default query & mutation keys hash function.
 * Hashes the value into a stable hash.
 */
function hashKey(queryKey) {
    return JSON.stringify(queryKey, (_, val) => isPlainObject(val)
        ? Object.keys(val)
            .sort()
            .reduce((result, key) => {
            result[key] = val[key];
            return result;
        }, {})
        : val);
}
function partialMatchKey(a, b) {
    if (a === b) {
        return true;
    }
    if (typeof a !== typeof b) {
        return false;
    }
    if (a && b && typeof a === 'object' && typeof b === 'object') {
        return !Object.keys(b).some((key) => !partialMatchKey(a[key], b[key]));
    }
    return false;
}
function replaceEqualDeep(a, b) {
    if (a === b) {
        return a;
    }
    const array = isPlainArray(a) && isPlainArray(b);
    if (array || (isPlainObject(a) && isPlainObject(b))) {
        const aItems = array ? a : Object.keys(a);
        const aSize = aItems.length;
        const bItems = array ? b : Object.keys(b);
        const bSize = bItems.length;
        const copy = array ? [] : {};
        let equalItems = 0;
        for (let i = 0; i < bSize; i++) {
            const key = array ? i : bItems[i];
            if (!array &&
                a[key] === undefined &&
                b[key] === undefined &&
                aItems.includes(key)) {
                copy[key] = undefined;
                equalItems++;
            }
            else {
                copy[key] = replaceEqualDeep(a[key], b[key]);
                if (copy[key] === a[key] && a[key] !== undefined) {
                    equalItems++;
                }
            }
        }
        return aSize === bSize && equalItems === aSize ? a : copy;
    }
    return b;
}
/**
 * Shallow compare objects. Only works with objects that always have the same properties.
 */
function shallowEqualObjects(a, b) {
    if ((a && !b) || (b && !a)) {
        return false;
    }
    for (const key in a) {
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
function isPlainArray(value) {
    return Array.isArray(value) && value.length === Object.keys(value).length;
}
// Copied from: https://github.com/jonschlinkert/is-plain-object
function isPlainObject(o) {
    if (!hasObjectPrototype(o)) {
        return false;
    }
    // If has no constructor
    const ctor = o.constructor;
    if (typeof ctor === 'undefined') {
        return true;
    }
    // If has modified prototype
    const prot = ctor.prototype;
    if (!hasObjectPrototype(prot)) {
        return false;
    }
    // If constructor does not have an Object-specific method
    if (!prot.hasOwnProperty('isPrototypeOf')) {
        return false;
    }
    // Most likely a plain Object
    return true;
}
function hasObjectPrototype(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
function replaceData(prevData, data, options) {
    if (typeof options.structuralSharing === 'function') {
        return options.structuralSharing(prevData, data);
    }
    else if (options.structuralSharing !== false) {
        // Structurally share data between prev and new data if needed
        return replaceEqualDeep(prevData, data);
    }
    return data;
}
function keepPreviousData(previousData) {
    return previousData;
}
function addToEnd(items, item, max = 0) {
    const newItems = [...items, item];
    return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
    const newItems = [item, ...items];
    return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}

;// CONCATENATED MODULE: ./packages/query-core/src/focusManager.ts
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FocusManager_focused, _FocusManager_cleanup, _FocusManager_setup;


class FocusManager extends Subscribable {
    constructor() {
        super();
        _FocusManager_focused.set(this, void 0);
        _FocusManager_cleanup.set(this, void 0);
        _FocusManager_setup.set(this, void 0);
        __classPrivateFieldSet(this, _FocusManager_setup, (onFocus) => {
            // addEventListener does not exist in React Native, but window does
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!isServer && window.addEventListener) {
                const listener = () => onFocus();
                // Listen to visibilitychange
                window.addEventListener('visibilitychange', listener, false);
                return () => {
                    // Be sure to unsubscribe if a new handler is set
                    window.removeEventListener('visibilitychange', listener);
                };
            }
            return;
        }, "f");
    }
    onSubscribe() {
        if (!__classPrivateFieldGet(this, _FocusManager_cleanup, "f")) {
            this.setEventListener(__classPrivateFieldGet(this, _FocusManager_setup, "f"));
        }
    }
    onUnsubscribe() {
        if (!this.hasListeners()) {
            __classPrivateFieldGet(this, _FocusManager_cleanup, "f")?.call(this);
            __classPrivateFieldSet(this, _FocusManager_cleanup, undefined, "f");
        }
    }
    setEventListener(setup) {
        __classPrivateFieldSet(this, _FocusManager_setup, setup, "f");
        __classPrivateFieldGet(this, _FocusManager_cleanup, "f")?.call(this);
        __classPrivateFieldSet(this, _FocusManager_cleanup, setup((focused) => {
            if (typeof focused === 'boolean') {
                this.setFocused(focused);
            }
            else {
                this.onFocus();
            }
        }), "f");
    }
    setFocused(focused) {
        const changed = __classPrivateFieldGet(this, _FocusManager_focused, "f") !== focused;
        if (changed) {
            __classPrivateFieldSet(this, _FocusManager_focused, focused, "f");
            this.onFocus();
        }
    }
    onFocus() {
        this.listeners.forEach((listener) => {
            listener();
        });
    }
    isFocused() {
        if (typeof __classPrivateFieldGet(this, _FocusManager_focused, "f") === 'boolean') {
            return __classPrivateFieldGet(this, _FocusManager_focused, "f");
        }
        // document global can be unavailable in react native
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        return globalThis.document?.visibilityState !== 'hidden';
    }
}
_FocusManager_focused = new WeakMap(), _FocusManager_cleanup = new WeakMap(), _FocusManager_setup = new WeakMap();
const focusManager = new FocusManager();

;// CONCATENATED MODULE: ./packages/query-core/src/onlineManager.ts
var onlineManager_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var onlineManager_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _OnlineManager_online, _OnlineManager_cleanup, _OnlineManager_setup;


class OnlineManager extends Subscribable {
    constructor() {
        super();
        _OnlineManager_online.set(this, true);
        _OnlineManager_cleanup.set(this, void 0);
        _OnlineManager_setup.set(this, void 0);
        onlineManager_classPrivateFieldSet(this, _OnlineManager_setup, (onOnline) => {
            // addEventListener does not exist in React Native, but window does
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!isServer && window.addEventListener) {
                const onlineListener = () => onOnline(true);
                const offlineListener = () => onOnline(false);
                // Listen to online
                window.addEventListener('online', onlineListener, false);
                window.addEventListener('offline', offlineListener, false);
                return () => {
                    // Be sure to unsubscribe if a new handler is set
                    window.removeEventListener('online', onlineListener);
                    window.removeEventListener('offline', offlineListener);
                };
            }
            return;
        }, "f");
    }
    onSubscribe() {
        if (!onlineManager_classPrivateFieldGet(this, _OnlineManager_cleanup, "f")) {
            this.setEventListener(onlineManager_classPrivateFieldGet(this, _OnlineManager_setup, "f"));
        }
    }
    onUnsubscribe() {
        if (!this.hasListeners()) {
            onlineManager_classPrivateFieldGet(this, _OnlineManager_cleanup, "f")?.call(this);
            onlineManager_classPrivateFieldSet(this, _OnlineManager_cleanup, undefined, "f");
        }
    }
    setEventListener(setup) {
        onlineManager_classPrivateFieldSet(this, _OnlineManager_setup, setup, "f");
        onlineManager_classPrivateFieldGet(this, _OnlineManager_cleanup, "f")?.call(this);
        onlineManager_classPrivateFieldSet(this, _OnlineManager_cleanup, setup(this.setOnline.bind(this)), "f");
    }
    setOnline(online) {
        const changed = onlineManager_classPrivateFieldGet(this, _OnlineManager_online, "f") !== online;
        if (changed) {
            onlineManager_classPrivateFieldSet(this, _OnlineManager_online, online, "f");
            this.listeners.forEach((listener) => {
                listener(online);
            });
        }
    }
    isOnline() {
        return onlineManager_classPrivateFieldGet(this, _OnlineManager_online, "f");
    }
}
_OnlineManager_online = new WeakMap(), _OnlineManager_cleanup = new WeakMap(), _OnlineManager_setup = new WeakMap();
const onlineManager = new OnlineManager();

;// CONCATENATED MODULE: ./packages/query-core/src/retryer.ts



function defaultRetryDelay(failureCount) {
    return Math.min(1000 * 2 ** failureCount, 30000);
}
function canFetch(networkMode) {
    return (networkMode ?? 'online') === 'online'
        ? onlineManager.isOnline()
        : true;
}
class CancelledError {
    constructor(options) {
        this.revert = options?.revert;
        this.silent = options?.silent;
    }
}
function isCancelledError(value) {
    return value instanceof CancelledError;
}
function createRetryer(config) {
    let isRetryCancelled = false;
    let failureCount = 0;
    let isResolved = false;
    let continueFn;
    let promiseResolve;
    let promiseReject;
    const promise = new Promise((outerResolve, outerReject) => {
        promiseResolve = outerResolve;
        promiseReject = outerReject;
    });
    const cancel = (cancelOptions) => {
        if (!isResolved) {
            reject(new CancelledError(cancelOptions));
            config.abort?.();
        }
    };
    const cancelRetry = () => {
        isRetryCancelled = true;
    };
    const continueRetry = () => {
        isRetryCancelled = false;
    };
    const shouldPause = () => !focusManager.isFocused() ||
        (config.networkMode !== 'always' && !onlineManager.isOnline());
    const resolve = (value) => {
        if (!isResolved) {
            isResolved = true;
            config.onSuccess?.(value);
            continueFn?.();
            promiseResolve(value);
        }
    };
    const reject = (value) => {
        if (!isResolved) {
            isResolved = true;
            config.onError?.(value);
            continueFn?.();
            promiseReject(value);
        }
    };
    const pause = () => {
        return new Promise((continueResolve) => {
            continueFn = (value) => {
                const canContinue = isResolved || !shouldPause();
                if (canContinue) {
                    continueResolve(value);
                }
                return canContinue;
            };
            config.onPause?.();
        }).then(() => {
            continueFn = undefined;
            if (!isResolved) {
                config.onContinue?.();
            }
        });
    };
    // Create loop function
    const run = () => {
        // Do nothing if already resolved
        if (isResolved) {
            return;
        }
        let promiseOrValue;
        // Execute query
        try {
            promiseOrValue = config.fn();
        }
        catch (error) {
            promiseOrValue = Promise.reject(error);
        }
        Promise.resolve(promiseOrValue)
            .then(resolve)
            .catch((error) => {
            // Stop if the fetch is already resolved
            if (isResolved) {
                return;
            }
            // Do we need to retry the request?
            const retry = config.retry ?? (isServer ? 0 : 3);
            const retryDelay = config.retryDelay ?? defaultRetryDelay;
            const delay = typeof retryDelay === 'function'
                ? retryDelay(failureCount, error)
                : retryDelay;
            const shouldRetry = retry === true ||
                (typeof retry === 'number' && failureCount < retry) ||
                (typeof retry === 'function' && retry(failureCount, error));
            if (isRetryCancelled || !shouldRetry) {
                // We are done if the query does not need to be retried
                reject(error);
                return;
            }
            failureCount++;
            // Notify on fail
            config.onFail?.(failureCount, error);
            // Delay
            sleep(delay)
                // Pause if the document is not visible or when the device is offline
                .then(() => {
                if (shouldPause()) {
                    return pause();
                }
                return;
            })
                .then(() => {
                if (isRetryCancelled) {
                    reject(error);
                }
                else {
                    run();
                }
            });
        });
    };
    // Start loop
    if (canFetch(config.networkMode)) {
        run();
    }
    else {
        pause().then(run);
    }
    return {
        promise,
        cancel,
        continue: () => {
            const didContinue = continueFn?.();
            return didContinue ? promise : Promise.resolve();
        },
        cancelRetry,
        continueRetry,
    };
}

;// CONCATENATED MODULE: ./packages/query-core/src/notifyManager.ts
// TYPES
function createNotifyManager() {
    let queue = [];
    let transactions = 0;
    let notifyFn = (callback) => {
        callback();
    };
    let batchNotifyFn = (callback) => {
        callback();
    };
    let scheduleFn = (cb) => setTimeout(cb, 0);
    const setScheduler = (fn) => {
        scheduleFn = fn;
    };
    const batch = (callback) => {
        let result;
        transactions++;
        try {
            result = callback();
        }
        finally {
            transactions--;
            if (!transactions) {
                flush();
            }
        }
        return result;
    };
    const schedule = (callback) => {
        if (transactions) {
            queue.push(callback);
        }
        else {
            scheduleFn(() => {
                notifyFn(callback);
            });
        }
    };
    /**
     * All calls to the wrapped function will be batched.
     */
    const batchCalls = (callback) => {
        return (...args) => {
            schedule(() => {
                callback(...args);
            });
        };
    };
    const flush = () => {
        const originalQueue = queue;
        queue = [];
        if (originalQueue.length) {
            scheduleFn(() => {
                batchNotifyFn(() => {
                    originalQueue.forEach((callback) => {
                        notifyFn(callback);
                    });
                });
            });
        }
    };
    /**
     * Use this method to set a custom notify function.
     * This can be used to for example wrap notifications with `React.act` while running tests.
     */
    const setNotifyFunction = (fn) => {
        notifyFn = fn;
    };
    /**
     * Use this method to set a custom function to batch notifications together into a single tick.
     * By default React Query will use the batch function provided by ReactDOM or React Native.
     */
    const setBatchNotifyFunction = (fn) => {
        batchNotifyFn = fn;
    };
    return {
        batch,
        batchCalls,
        schedule,
        setNotifyFunction,
        setBatchNotifyFunction,
        setScheduler,
    };
}
// SINGLETON
const notifyManager = createNotifyManager();

;// CONCATENATED MODULE: ./packages/query-core/src/removable.ts
var removable_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var removable_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Removable_gcTimeout;

class Removable {
    constructor() {
        _Removable_gcTimeout.set(this, void 0);
    }
    destroy() {
        this.clearGcTimeout();
    }
    scheduleGc() {
        this.clearGcTimeout();
        if (isValidTimeout(this.gcTime)) {
            removable_classPrivateFieldSet(this, _Removable_gcTimeout, setTimeout(() => {
                this.optionalRemove();
            }, this.gcTime), "f");
        }
    }
    updateGcTime(newGcTime) {
        // Default to 5 minutes (Infinity for server-side) if no gcTime is set
        this.gcTime = Math.max(this.gcTime || 0, newGcTime ?? (isServer ? Infinity : 5 * 60 * 1000));
    }
    clearGcTimeout() {
        if (removable_classPrivateFieldGet(this, _Removable_gcTimeout, "f")) {
            clearTimeout(removable_classPrivateFieldGet(this, _Removable_gcTimeout, "f"));
            removable_classPrivateFieldSet(this, _Removable_gcTimeout, undefined, "f");
        }
    }
}
_Removable_gcTimeout = new WeakMap();

;// CONCATENATED MODULE: ./packages/query-core/src/query.ts
var query_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var query_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Query_instances, _Query_initialState, _Query_revertState, _Query_cache, _Query_promise, _Query_retryer, _Query_observers, _Query_defaultOptions, _Query_abortSignalConsumed, _Query_setOptions, _Query_dispatch;




// CLASS
class Query extends Removable {
    constructor(config) {
        super();
        _Query_instances.add(this);
        _Query_initialState.set(this, void 0);
        _Query_revertState.set(this, void 0);
        _Query_cache.set(this, void 0);
        _Query_promise.set(this, void 0);
        _Query_retryer.set(this, void 0);
        _Query_observers.set(this, void 0);
        _Query_defaultOptions.set(this, void 0);
        _Query_abortSignalConsumed.set(this, void 0);
        query_classPrivateFieldSet(this, _Query_abortSignalConsumed, false, "f");
        query_classPrivateFieldSet(this, _Query_defaultOptions, config.defaultOptions, "f");
        query_classPrivateFieldGet(this, _Query_instances, "m", _Query_setOptions).call(this, config.options);
        query_classPrivateFieldSet(this, _Query_observers, [], "f");
        query_classPrivateFieldSet(this, _Query_cache, config.cache, "f");
        this.queryKey = config.queryKey;
        this.queryHash = config.queryHash;
        query_classPrivateFieldSet(this, _Query_initialState, config.state || getDefaultState(this.options), "f");
        this.state = query_classPrivateFieldGet(this, _Query_initialState, "f");
        this.scheduleGc();
    }
    get meta() {
        return this.options.meta;
    }
    optionalRemove() {
        if (!query_classPrivateFieldGet(this, _Query_observers, "f").length && this.state.fetchStatus === 'idle') {
            query_classPrivateFieldGet(this, _Query_cache, "f").remove(this);
        }
    }
    setData(newData, options) {
        const data = replaceData(this.state.data, newData, this.options);
        // Set data and mark it as cached
        query_classPrivateFieldGet(this, _Query_instances, "m", _Query_dispatch).call(this, {
            data,
            type: 'success',
            dataUpdatedAt: options?.updatedAt,
            manual: options?.manual,
        });
        return data;
    }
    setState(state, setStateOptions) {
        query_classPrivateFieldGet(this, _Query_instances, "m", _Query_dispatch).call(this, { type: 'setState', state, setStateOptions });
    }
    cancel(options) {
        const promise = query_classPrivateFieldGet(this, _Query_promise, "f");
        query_classPrivateFieldGet(this, _Query_retryer, "f")?.cancel(options);
        return promise ? promise.then(noop).catch(noop) : Promise.resolve();
    }
    destroy() {
        super.destroy();
        this.cancel({ silent: true });
    }
    reset() {
        this.destroy();
        this.setState(query_classPrivateFieldGet(this, _Query_initialState, "f"));
    }
    isActive() {
        return query_classPrivateFieldGet(this, _Query_observers, "f").some((observer) => observer.options.enabled !== false);
    }
    isDisabled() {
        return this.getObserversCount() > 0 && !this.isActive();
    }
    isStale() {
        return (this.state.isInvalidated ||
            !this.state.dataUpdatedAt ||
            query_classPrivateFieldGet(this, _Query_observers, "f").some((observer) => observer.getCurrentResult().isStale));
    }
    isStaleByTime(staleTime = 0) {
        return (this.state.isInvalidated ||
            !this.state.dataUpdatedAt ||
            !timeUntilStale(this.state.dataUpdatedAt, staleTime));
    }
    onFocus() {
        const observer = query_classPrivateFieldGet(this, _Query_observers, "f").find((x) => x.shouldFetchOnWindowFocus());
        observer?.refetch({ cancelRefetch: false });
        // Continue fetch if currently paused
        query_classPrivateFieldGet(this, _Query_retryer, "f")?.continue();
    }
    onOnline() {
        const observer = query_classPrivateFieldGet(this, _Query_observers, "f").find((x) => x.shouldFetchOnReconnect());
        observer?.refetch({ cancelRefetch: false });
        // Continue fetch if currently paused
        query_classPrivateFieldGet(this, _Query_retryer, "f")?.continue();
    }
    addObserver(observer) {
        if (!query_classPrivateFieldGet(this, _Query_observers, "f").includes(observer)) {
            query_classPrivateFieldGet(this, _Query_observers, "f").push(observer);
            // Stop the query from being garbage collected
            this.clearGcTimeout();
            query_classPrivateFieldGet(this, _Query_cache, "f").notify({ type: 'observerAdded', query: this, observer });
        }
    }
    removeObserver(observer) {
        if (query_classPrivateFieldGet(this, _Query_observers, "f").includes(observer)) {
            query_classPrivateFieldSet(this, _Query_observers, query_classPrivateFieldGet(this, _Query_observers, "f").filter((x) => x !== observer), "f");
            if (!query_classPrivateFieldGet(this, _Query_observers, "f").length) {
                // If the transport layer does not support cancellation
                // we'll let the query continue so the result can be cached
                if (query_classPrivateFieldGet(this, _Query_retryer, "f")) {
                    if (query_classPrivateFieldGet(this, _Query_abortSignalConsumed, "f")) {
                        query_classPrivateFieldGet(this, _Query_retryer, "f").cancel({ revert: true });
                    }
                    else {
                        query_classPrivateFieldGet(this, _Query_retryer, "f").cancelRetry();
                    }
                }
                this.scheduleGc();
            }
            query_classPrivateFieldGet(this, _Query_cache, "f").notify({ type: 'observerRemoved', query: this, observer });
        }
    }
    getObserversCount() {
        return query_classPrivateFieldGet(this, _Query_observers, "f").length;
    }
    invalidate() {
        if (!this.state.isInvalidated) {
            query_classPrivateFieldGet(this, _Query_instances, "m", _Query_dispatch).call(this, { type: 'invalidate' });
        }
    }
    fetch(options, fetchOptions) {
        if (this.state.fetchStatus !== 'idle') {
            if (this.state.dataUpdatedAt && fetchOptions?.cancelRefetch) {
                // Silently cancel current fetch if the user wants to cancel refetches
                this.cancel({ silent: true });
            }
            else if (query_classPrivateFieldGet(this, _Query_promise, "f")) {
                // make sure that retries that were potentially cancelled due to unmounts can continue
                query_classPrivateFieldGet(this, _Query_retryer, "f")?.continueRetry();
                // Return current promise if we are already fetching
                return query_classPrivateFieldGet(this, _Query_promise, "f");
            }
        }
        // Update config if passed, otherwise the config from the last execution is used
        if (options) {
            query_classPrivateFieldGet(this, _Query_instances, "m", _Query_setOptions).call(this, options);
        }
        // Use the options from the first observer with a query function if no function is found.
        // This can happen when the query is hydrated or created with setQueryData.
        if (!this.options.queryFn) {
            const observer = query_classPrivateFieldGet(this, _Query_observers, "f").find((x) => x.options.queryFn);
            if (observer) {
                query_classPrivateFieldGet(this, _Query_instances, "m", _Query_setOptions).call(this, observer.options);
            }
        }
        if (false) {}
        const abortController = new AbortController();
        // Create query function context
        const queryFnContext = {
            queryKey: this.queryKey,
            meta: this.meta,
        };
        // Adds an enumerable signal property to the object that
        // which sets abortSignalConsumed to true when the signal
        // is read.
        const addSignalProperty = (object) => {
            Object.defineProperty(object, 'signal', {
                enumerable: true,
                get: () => {
                    query_classPrivateFieldSet(this, _Query_abortSignalConsumed, true, "f");
                    return abortController.signal;
                },
            });
        };
        addSignalProperty(queryFnContext);
        // Create fetch function
        const fetchFn = () => {
            if (!this.options.queryFn) {
                return Promise.reject(new Error(`Missing queryFn: '${this.options.queryHash}'`));
            }
            query_classPrivateFieldSet(this, _Query_abortSignalConsumed, false, "f");
            if (this.options.persister) {
                return this.options.persister(this.options.queryFn, queryFnContext, this);
            }
            return this.options.queryFn(queryFnContext);
        };
        // Trigger behavior hook
        const context = {
            fetchOptions,
            options: this.options,
            queryKey: this.queryKey,
            state: this.state,
            fetchFn,
        };
        addSignalProperty(context);
        this.options.behavior?.onFetch(context, this);
        // Store state in case the current fetch needs to be reverted
        query_classPrivateFieldSet(this, _Query_revertState, this.state, "f");
        // Set to fetching state if not already in it
        if (this.state.fetchStatus === 'idle' ||
            this.state.fetchMeta !== context.fetchOptions?.meta) {
            query_classPrivateFieldGet(this, _Query_instances, "m", _Query_dispatch).call(this, { type: 'fetch', meta: context.fetchOptions?.meta });
        }
        const onError = (error) => {
            // Optimistically update state if needed
            if (!(isCancelledError(error) && error.silent)) {
                query_classPrivateFieldGet(this, _Query_instances, "m", _Query_dispatch).call(this, {
                    type: 'error',
                    error: error,
                });
            }
            if (!isCancelledError(error)) {
                // Notify cache callback
                query_classPrivateFieldGet(this, _Query_cache, "f").config.onError?.(error, this);
                query_classPrivateFieldGet(this, _Query_cache, "f").config.onSettled?.(this.state.data, error, this);
            }
            if (!this.isFetchingOptimistic) {
                // Schedule query gc after fetching
                this.scheduleGc();
            }
            this.isFetchingOptimistic = false;
        };
        // Try to fetch the data
        query_classPrivateFieldSet(this, _Query_retryer, createRetryer({
            fn: context.fetchFn,
            abort: abortController.abort.bind(abortController),
            onSuccess: (data) => {
                if (typeof data === 'undefined') {
                    if (false) {}
                    onError(new Error(`${this.queryHash} data is undefined`));
                    return;
                }
                this.setData(data);
                // Notify cache callback
                query_classPrivateFieldGet(this, _Query_cache, "f").config.onSuccess?.(data, this);
                query_classPrivateFieldGet(this, _Query_cache, "f").config.onSettled?.(data, this.state.error, this);
                if (!this.isFetchingOptimistic) {
                    // Schedule query gc after fetching
                    this.scheduleGc();
                }
                this.isFetchingOptimistic = false;
            },
            onError,
            onFail: (failureCount, error) => {
                query_classPrivateFieldGet(this, _Query_instances, "m", _Query_dispatch).call(this, { type: 'failed', failureCount, error });
            },
            onPause: () => {
                query_classPrivateFieldGet(this, _Query_instances, "m", _Query_dispatch).call(this, { type: 'pause' });
            },
            onContinue: () => {
                query_classPrivateFieldGet(this, _Query_instances, "m", _Query_dispatch).call(this, { type: 'continue' });
            },
            retry: context.options.retry,
            retryDelay: context.options.retryDelay,
            networkMode: context.options.networkMode,
        }), "f");
        query_classPrivateFieldSet(this, _Query_promise, query_classPrivateFieldGet(this, _Query_retryer, "f").promise, "f");
        return query_classPrivateFieldGet(this, _Query_promise, "f");
    }
}
_Query_initialState = new WeakMap(), _Query_revertState = new WeakMap(), _Query_cache = new WeakMap(), _Query_promise = new WeakMap(), _Query_retryer = new WeakMap(), _Query_observers = new WeakMap(), _Query_defaultOptions = new WeakMap(), _Query_abortSignalConsumed = new WeakMap(), _Query_instances = new WeakSet(), _Query_setOptions = function _Query_setOptions(options) {
    this.options = { ...query_classPrivateFieldGet(this, _Query_defaultOptions, "f"), ...options };
    this.updateGcTime(this.options.gcTime);
}, _Query_dispatch = function _Query_dispatch(action) {
    const reducer = (state) => {
        switch (action.type) {
            case 'failed':
                return {
                    ...state,
                    fetchFailureCount: action.failureCount,
                    fetchFailureReason: action.error,
                };
            case 'pause':
                return {
                    ...state,
                    fetchStatus: 'paused',
                };
            case 'continue':
                return {
                    ...state,
                    fetchStatus: 'fetching',
                };
            case 'fetch':
                return {
                    ...state,
                    fetchFailureCount: 0,
                    fetchFailureReason: null,
                    fetchMeta: action.meta ?? null,
                    fetchStatus: canFetch(this.options.networkMode)
                        ? 'fetching'
                        : 'paused',
                    ...(!state.dataUpdatedAt && {
                        error: null,
                        status: 'pending',
                    }),
                };
            case 'success':
                return {
                    ...state,
                    data: action.data,
                    dataUpdateCount: state.dataUpdateCount + 1,
                    dataUpdatedAt: action.dataUpdatedAt ?? Date.now(),
                    error: null,
                    isInvalidated: false,
                    status: 'success',
                    ...(!action.manual && {
                        fetchStatus: 'idle',
                        fetchFailureCount: 0,
                        fetchFailureReason: null,
                    }),
                };
            case 'error':
                const error = action.error;
                if (isCancelledError(error) && error.revert && query_classPrivateFieldGet(this, _Query_revertState, "f")) {
                    return { ...query_classPrivateFieldGet(this, _Query_revertState, "f"), fetchStatus: 'idle' };
                }
                return {
                    ...state,
                    error: error,
                    errorUpdateCount: state.errorUpdateCount + 1,
                    errorUpdatedAt: Date.now(),
                    fetchFailureCount: state.fetchFailureCount + 1,
                    fetchFailureReason: error,
                    fetchStatus: 'idle',
                    status: 'error',
                };
            case 'invalidate':
                return {
                    ...state,
                    isInvalidated: true,
                };
            case 'setState':
                return {
                    ...state,
                    ...action.state,
                };
        }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
        query_classPrivateFieldGet(this, _Query_observers, "f").forEach((observer) => {
            observer.onQueryUpdate();
        });
        query_classPrivateFieldGet(this, _Query_cache, "f").notify({ query: this, type: 'updated', action });
    });
};
function getDefaultState(options) {
    const data = typeof options.initialData === 'function'
        ? options.initialData()
        : options.initialData;
    const hasData = typeof data !== 'undefined';
    const initialDataUpdatedAt = hasData
        ? typeof options.initialDataUpdatedAt === 'function'
            ? options.initialDataUpdatedAt()
            : options.initialDataUpdatedAt
        : 0;
    return {
        data,
        dataUpdateCount: 0,
        dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
        error: null,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchMeta: null,
        isInvalidated: false,
        status: hasData ? 'success' : 'pending',
        fetchStatus: 'idle',
    };
}

;// CONCATENATED MODULE: ./packages/query-core/src/queryCache.ts
var queryCache_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var queryCache_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _QueryCache_queries;




// CLASS
class QueryCache extends Subscribable {
    constructor(config = {}) {
        super();
        this.config = config;
        _QueryCache_queries.set(this, void 0);
        queryCache_classPrivateFieldSet(this, _QueryCache_queries, new Map(), "f");
    }
    build(client, options, state) {
        const queryKey = options.queryKey;
        const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
        let query = this.get(queryHash);
        if (!query) {
            query = new Query({
                cache: this,
                queryKey,
                queryHash,
                options: client.defaultQueryOptions(options),
                state,
                defaultOptions: client.getQueryDefaults(queryKey),
            });
            this.add(query);
        }
        return query;
    }
    add(query) {
        if (!queryCache_classPrivateFieldGet(this, _QueryCache_queries, "f").has(query.queryHash)) {
            queryCache_classPrivateFieldGet(this, _QueryCache_queries, "f").set(query.queryHash, query);
            this.notify({
                type: 'added',
                query,
            });
        }
    }
    remove(query) {
        const queryInMap = queryCache_classPrivateFieldGet(this, _QueryCache_queries, "f").get(query.queryHash);
        if (queryInMap) {
            query.destroy();
            if (queryInMap === query) {
                queryCache_classPrivateFieldGet(this, _QueryCache_queries, "f").delete(query.queryHash);
            }
            this.notify({ type: 'removed', query });
        }
    }
    clear() {
        notifyManager.batch(() => {
            this.getAll().forEach((query) => {
                this.remove(query);
            });
        });
    }
    get(queryHash) {
        return queryCache_classPrivateFieldGet(this, _QueryCache_queries, "f").get(queryHash);
    }
    getAll() {
        return [...queryCache_classPrivateFieldGet(this, _QueryCache_queries, "f").values()];
    }
    find(filters) {
        const defaultedFilters = { exact: true, ...filters };
        return this.getAll().find((query) => matchQuery(defaultedFilters, query));
    }
    findAll(filters = {}) {
        const queries = this.getAll();
        return Object.keys(filters).length > 0
            ? queries.filter((query) => matchQuery(filters, query))
            : queries;
    }
    notify(event) {
        notifyManager.batch(() => {
            this.listeners.forEach((listener) => {
                listener(event);
            });
        });
    }
    onFocus() {
        notifyManager.batch(() => {
            this.getAll().forEach((query) => {
                query.onFocus();
            });
        });
    }
    onOnline() {
        notifyManager.batch(() => {
            this.getAll().forEach((query) => {
                query.onOnline();
            });
        });
    }
}
_QueryCache_queries = new WeakMap();

;// CONCATENATED MODULE: ./packages/query-core/src/mutation.ts
var mutation_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var mutation_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Mutation_instances, _Mutation_observers, _Mutation_defaultOptions, _Mutation_mutationCache, _Mutation_retryer, _Mutation_dispatch;



// CLASS
class Mutation extends Removable {
    constructor(config) {
        super();
        _Mutation_instances.add(this);
        _Mutation_observers.set(this, void 0);
        _Mutation_defaultOptions.set(this, void 0);
        _Mutation_mutationCache.set(this, void 0);
        _Mutation_retryer.set(this, void 0);
        this.mutationId = config.mutationId;
        mutation_classPrivateFieldSet(this, _Mutation_defaultOptions, config.defaultOptions, "f");
        mutation_classPrivateFieldSet(this, _Mutation_mutationCache, config.mutationCache, "f");
        mutation_classPrivateFieldSet(this, _Mutation_observers, [], "f");
        this.state = config.state || mutation_getDefaultState();
        this.setOptions(config.options);
        this.scheduleGc();
    }
    setOptions(options) {
        this.options = { ...mutation_classPrivateFieldGet(this, _Mutation_defaultOptions, "f"), ...options };
        this.updateGcTime(this.options.gcTime);
    }
    get meta() {
        return this.options.meta;
    }
    addObserver(observer) {
        if (!mutation_classPrivateFieldGet(this, _Mutation_observers, "f").includes(observer)) {
            mutation_classPrivateFieldGet(this, _Mutation_observers, "f").push(observer);
            // Stop the mutation from being garbage collected
            this.clearGcTimeout();
            mutation_classPrivateFieldGet(this, _Mutation_mutationCache, "f").notify({
                type: 'observerAdded',
                mutation: this,
                observer,
            });
        }
    }
    removeObserver(observer) {
        mutation_classPrivateFieldSet(this, _Mutation_observers, mutation_classPrivateFieldGet(this, _Mutation_observers, "f").filter((x) => x !== observer), "f");
        this.scheduleGc();
        mutation_classPrivateFieldGet(this, _Mutation_mutationCache, "f").notify({
            type: 'observerRemoved',
            mutation: this,
            observer,
        });
    }
    optionalRemove() {
        if (!mutation_classPrivateFieldGet(this, _Mutation_observers, "f").length) {
            if (this.state.status === 'pending') {
                this.scheduleGc();
            }
            else {
                mutation_classPrivateFieldGet(this, _Mutation_mutationCache, "f").remove(this);
            }
        }
    }
    continue() {
        return (mutation_classPrivateFieldGet(this, _Mutation_retryer, "f")?.continue() ??
            // continuing a mutation assumes that variables are set, mutation must have been dehydrated before
            this.execute(this.state.variables));
    }
    async execute(variables) {
        const executeMutation = () => {
            mutation_classPrivateFieldSet(this, _Mutation_retryer, createRetryer({
                fn: () => {
                    if (!this.options.mutationFn) {
                        return Promise.reject(new Error('No mutationFn found'));
                    }
                    return this.options.mutationFn(variables);
                },
                onFail: (failureCount, error) => {
                    mutation_classPrivateFieldGet(this, _Mutation_instances, "m", _Mutation_dispatch).call(this, { type: 'failed', failureCount, error });
                },
                onPause: () => {
                    mutation_classPrivateFieldGet(this, _Mutation_instances, "m", _Mutation_dispatch).call(this, { type: 'pause' });
                },
                onContinue: () => {
                    mutation_classPrivateFieldGet(this, _Mutation_instances, "m", _Mutation_dispatch).call(this, { type: 'continue' });
                },
                retry: this.options.retry ?? 0,
                retryDelay: this.options.retryDelay,
                networkMode: this.options.networkMode,
            }), "f");
            return mutation_classPrivateFieldGet(this, _Mutation_retryer, "f").promise;
        };
        const restored = this.state.status === 'pending';
        try {
            if (!restored) {
                mutation_classPrivateFieldGet(this, _Mutation_instances, "m", _Mutation_dispatch).call(this, { type: 'pending', variables });
                // Notify cache callback
                await mutation_classPrivateFieldGet(this, _Mutation_mutationCache, "f").config.onMutate?.(variables, this);
                const context = await this.options.onMutate?.(variables);
                if (context !== this.state.context) {
                    mutation_classPrivateFieldGet(this, _Mutation_instances, "m", _Mutation_dispatch).call(this, {
                        type: 'pending',
                        context,
                        variables,
                    });
                }
            }
            const data = await executeMutation();
            // Notify cache callback
            await mutation_classPrivateFieldGet(this, _Mutation_mutationCache, "f").config.onSuccess?.(data, variables, this.state.context, this);
            await this.options.onSuccess?.(data, variables, this.state.context);
            // Notify cache callback
            await mutation_classPrivateFieldGet(this, _Mutation_mutationCache, "f").config.onSettled?.(data, null, this.state.variables, this.state.context, this);
            await this.options.onSettled?.(data, null, variables, this.state.context);
            mutation_classPrivateFieldGet(this, _Mutation_instances, "m", _Mutation_dispatch).call(this, { type: 'success', data });
            return data;
        }
        catch (error) {
            try {
                // Notify cache callback
                await mutation_classPrivateFieldGet(this, _Mutation_mutationCache, "f").config.onError?.(error, variables, this.state.context, this);
                await this.options.onError?.(error, variables, this.state.context);
                // Notify cache callback
                await mutation_classPrivateFieldGet(this, _Mutation_mutationCache, "f").config.onSettled?.(undefined, error, this.state.variables, this.state.context, this);
                await this.options.onSettled?.(undefined, error, variables, this.state.context);
                throw error;
            }
            finally {
                mutation_classPrivateFieldGet(this, _Mutation_instances, "m", _Mutation_dispatch).call(this, { type: 'error', error: error });
            }
        }
    }
}
_Mutation_observers = new WeakMap(), _Mutation_defaultOptions = new WeakMap(), _Mutation_mutationCache = new WeakMap(), _Mutation_retryer = new WeakMap(), _Mutation_instances = new WeakSet(), _Mutation_dispatch = function _Mutation_dispatch(action) {
    const reducer = (state) => {
        switch (action.type) {
            case 'failed':
                return {
                    ...state,
                    failureCount: action.failureCount,
                    failureReason: action.error,
                };
            case 'pause':
                return {
                    ...state,
                    isPaused: true,
                };
            case 'continue':
                return {
                    ...state,
                    isPaused: false,
                };
            case 'pending':
                return {
                    ...state,
                    context: action.context,
                    data: undefined,
                    failureCount: 0,
                    failureReason: null,
                    error: null,
                    isPaused: !canFetch(this.options.networkMode),
                    status: 'pending',
                    variables: action.variables,
                    submittedAt: Date.now(),
                };
            case 'success':
                return {
                    ...state,
                    data: action.data,
                    failureCount: 0,
                    failureReason: null,
                    error: null,
                    status: 'success',
                    isPaused: false,
                };
            case 'error':
                return {
                    ...state,
                    data: undefined,
                    error: action.error,
                    failureCount: state.failureCount + 1,
                    failureReason: action.error,
                    isPaused: false,
                    status: 'error',
                };
        }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
        mutation_classPrivateFieldGet(this, _Mutation_observers, "f").forEach((observer) => {
            observer.onMutationUpdate(action);
        });
        mutation_classPrivateFieldGet(this, _Mutation_mutationCache, "f").notify({
            mutation: this,
            type: 'updated',
            action,
        });
    });
};
function mutation_getDefaultState() {
    return {
        context: undefined,
        data: undefined,
        error: null,
        failureCount: 0,
        failureReason: null,
        isPaused: false,
        status: 'idle',
        variables: undefined,
        submittedAt: 0,
    };
}

;// CONCATENATED MODULE: ./packages/query-core/src/mutationCache.ts
var mutationCache_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var mutationCache_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MutationCache_mutations, _MutationCache_mutationId, _MutationCache_resuming;




// CLASS
class MutationCache extends Subscribable {
    constructor(config = {}) {
        super();
        this.config = config;
        _MutationCache_mutations.set(this, void 0);
        _MutationCache_mutationId.set(this, void 0);
        _MutationCache_resuming.set(this, void 0);
        mutationCache_classPrivateFieldSet(this, _MutationCache_mutations, [], "f");
        mutationCache_classPrivateFieldSet(this, _MutationCache_mutationId, 0, "f");
    }
    build(client, options, state) {
        var _a;
        const mutation = new Mutation({
            mutationCache: this,
            mutationId: mutationCache_classPrivateFieldSet(this, _MutationCache_mutationId, (_a = mutationCache_classPrivateFieldGet(this, _MutationCache_mutationId, "f"), ++_a), "f"),
            options: client.defaultMutationOptions(options),
            state,
        });
        this.add(mutation);
        return mutation;
    }
    add(mutation) {
        mutationCache_classPrivateFieldGet(this, _MutationCache_mutations, "f").push(mutation);
        this.notify({ type: 'added', mutation });
    }
    remove(mutation) {
        mutationCache_classPrivateFieldSet(this, _MutationCache_mutations, mutationCache_classPrivateFieldGet(this, _MutationCache_mutations, "f").filter((x) => x !== mutation), "f");
        this.notify({ type: 'removed', mutation });
    }
    clear() {
        notifyManager.batch(() => {
            mutationCache_classPrivateFieldGet(this, _MutationCache_mutations, "f").forEach((mutation) => {
                this.remove(mutation);
            });
        });
    }
    getAll() {
        return mutationCache_classPrivateFieldGet(this, _MutationCache_mutations, "f");
    }
    find(filters) {
        const defaultedFilters = { exact: true, ...filters };
        return mutationCache_classPrivateFieldGet(this, _MutationCache_mutations, "f").find((mutation) => matchMutation(defaultedFilters, mutation));
    }
    findAll(filters = {}) {
        return mutationCache_classPrivateFieldGet(this, _MutationCache_mutations, "f").filter((mutation) => matchMutation(filters, mutation));
    }
    notify(event) {
        notifyManager.batch(() => {
            this.listeners.forEach((listener) => {
                listener(event);
            });
        });
    }
    resumePausedMutations() {
        mutationCache_classPrivateFieldSet(this, _MutationCache_resuming, (mutationCache_classPrivateFieldGet(this, _MutationCache_resuming, "f") ?? Promise.resolve())
            .then(() => {
            const pausedMutations = mutationCache_classPrivateFieldGet(this, _MutationCache_mutations, "f").filter((x) => x.state.isPaused);
            return notifyManager.batch(() => pausedMutations.reduce((promise, mutation) => promise.then(() => mutation.continue().catch(noop)), Promise.resolve()));
        })
            .then(() => {
            mutationCache_classPrivateFieldSet(this, _MutationCache_resuming, undefined, "f");
        }), "f");
        return mutationCache_classPrivateFieldGet(this, _MutationCache_resuming, "f");
    }
}
_MutationCache_mutations = new WeakMap(), _MutationCache_mutationId = new WeakMap(), _MutationCache_resuming = new WeakMap();

;// CONCATENATED MODULE: ./packages/query-core/src/infiniteQueryBehavior.ts

function infiniteQueryBehavior(pages) {
    return {
        onFetch: (context, query) => {
            const fetchFn = async () => {
                const options = context.options;
                const direction = context.fetchOptions?.meta?.fetchMore?.direction;
                const oldPages = context.state.data?.pages || [];
                const oldPageParams = context.state.data?.pageParams || [];
                const empty = { pages: [], pageParams: [] };
                let cancelled = false;
                const addSignalProperty = (object) => {
                    Object.defineProperty(object, 'signal', {
                        enumerable: true,
                        get: () => {
                            if (context.signal.aborted) {
                                cancelled = true;
                            }
                            else {
                                context.signal.addEventListener('abort', () => {
                                    cancelled = true;
                                });
                            }
                            return context.signal;
                        },
                    });
                };
                // Get query function
                const queryFn = context.options.queryFn ||
                    (() => Promise.reject(new Error(`Missing queryFn: '${context.options.queryHash}'`)));
                // Create function to fetch a page
                const fetchPage = async (data, param, previous) => {
                    if (cancelled) {
                        return Promise.reject();
                    }
                    if (param == null && data.pages.length) {
                        return Promise.resolve(data);
                    }
                    const queryFnContext = {
                        queryKey: context.queryKey,
                        pageParam: param,
                        direction: previous ? 'backward' : 'forward',
                        meta: context.options.meta,
                    };
                    addSignalProperty(queryFnContext);
                    const page = await queryFn(queryFnContext);
                    const { maxPages } = context.options;
                    const addTo = previous ? addToStart : addToEnd;
                    return {
                        pages: addTo(data.pages, page, maxPages),
                        pageParams: addTo(data.pageParams, param, maxPages),
                    };
                };
                let result;
                // fetch next / previous page?
                if (direction && oldPages.length) {
                    const previous = direction === 'backward';
                    const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
                    const oldData = {
                        pages: oldPages,
                        pageParams: oldPageParams,
                    };
                    const param = pageParamFn(options, oldData);
                    result = await fetchPage(oldData, param, previous);
                }
                else {
                    // Fetch first page
                    result = await fetchPage(empty, oldPageParams[0] ?? options.initialPageParam);
                    const remainingPages = pages ?? oldPages.length;
                    // Fetch remaining pages
                    for (let i = 1; i < remainingPages; i++) {
                        const param = getNextPageParam(options, result);
                        result = await fetchPage(result, param);
                    }
                }
                return result;
            };
            if (context.options.persister) {
                context.fetchFn = () => {
                    return context.options.persister?.(fetchFn, {
                        queryKey: context.queryKey,
                        meta: context.options.meta,
                        signal: context.signal,
                    }, query);
                };
            }
            else {
                context.fetchFn = fetchFn;
            }
        },
    };
}
function getNextPageParam(options, { pages, pageParams }) {
    const lastIndex = pages.length - 1;
    return options.getNextPageParam(pages[lastIndex], pages, pageParams[lastIndex], pageParams);
}
function getPreviousPageParam(options, { pages, pageParams }) {
    return options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams);
}
/**
 * Checks if there is a next page.
 */
function hasNextPage(options, data) {
    if (!data)
        return false;
    return getNextPageParam(options, data) != null;
}
/**
 * Checks if there is a previous page.
 */
function hasPreviousPage(options, data) {
    if (!data || !options.getPreviousPageParam)
        return false;
    return getPreviousPageParam(options, data) != null;
}

;// CONCATENATED MODULE: ./packages/query-core/src/queryClient.ts
var queryClient_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var queryClient_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _QueryClient_queryCache, _QueryClient_mutationCache, _QueryClient_defaultOptions, _QueryClient_queryDefaults, _QueryClient_mutationDefaults, _QueryClient_mountCount, _QueryClient_unsubscribeFocus, _QueryClient_unsubscribeOnline;







// CLASS
class QueryClient {
    constructor(config = {}) {
        _QueryClient_queryCache.set(this, void 0);
        _QueryClient_mutationCache.set(this, void 0);
        _QueryClient_defaultOptions.set(this, void 0);
        _QueryClient_queryDefaults.set(this, void 0);
        _QueryClient_mutationDefaults.set(this, void 0);
        _QueryClient_mountCount.set(this, void 0);
        _QueryClient_unsubscribeFocus.set(this, void 0);
        _QueryClient_unsubscribeOnline.set(this, void 0);
        queryClient_classPrivateFieldSet(this, _QueryClient_queryCache, config.queryCache || new QueryCache(), "f");
        queryClient_classPrivateFieldSet(this, _QueryClient_mutationCache, config.mutationCache || new MutationCache(), "f");
        queryClient_classPrivateFieldSet(this, _QueryClient_defaultOptions, config.defaultOptions || {}, "f");
        queryClient_classPrivateFieldSet(this, _QueryClient_queryDefaults, new Map(), "f");
        queryClient_classPrivateFieldSet(this, _QueryClient_mutationDefaults, new Map(), "f");
        queryClient_classPrivateFieldSet(this, _QueryClient_mountCount, 0, "f");
    }
    mount() {
        var _a;
        queryClient_classPrivateFieldSet(this, _QueryClient_mountCount, (_a = queryClient_classPrivateFieldGet(this, _QueryClient_mountCount, "f"), _a++, _a), "f");
        if (queryClient_classPrivateFieldGet(this, _QueryClient_mountCount, "f") !== 1)
            return;
        queryClient_classPrivateFieldSet(this, _QueryClient_unsubscribeFocus, focusManager.subscribe(() => {
            if (focusManager.isFocused()) {
                this.resumePausedMutations();
                queryClient_classPrivateFieldGet(this, _QueryClient_queryCache, "f").onFocus();
            }
        }), "f");
        queryClient_classPrivateFieldSet(this, _QueryClient_unsubscribeOnline, onlineManager.subscribe(() => {
            if (onlineManager.isOnline()) {
                this.resumePausedMutations();
                queryClient_classPrivateFieldGet(this, _QueryClient_queryCache, "f").onOnline();
            }
        }), "f");
    }
    unmount() {
        var _a;
        queryClient_classPrivateFieldSet(this, _QueryClient_mountCount, (_a = queryClient_classPrivateFieldGet(this, _QueryClient_mountCount, "f"), _a--, _a), "f");
        if (queryClient_classPrivateFieldGet(this, _QueryClient_mountCount, "f") !== 0)
            return;
        queryClient_classPrivateFieldGet(this, _QueryClient_unsubscribeFocus, "f")?.call(this);
        queryClient_classPrivateFieldSet(this, _QueryClient_unsubscribeFocus, undefined, "f");
        queryClient_classPrivateFieldGet(this, _QueryClient_unsubscribeOnline, "f")?.call(this);
        queryClient_classPrivateFieldSet(this, _QueryClient_unsubscribeOnline, undefined, "f");
    }
    isFetching(filters) {
        return queryClient_classPrivateFieldGet(this, _QueryClient_queryCache, "f").findAll({ ...filters, fetchStatus: 'fetching' })
            .length;
    }
    isMutating(filters) {
        return queryClient_classPrivateFieldGet(this, _QueryClient_mutationCache, "f").findAll({ ...filters, status: 'pending' }).length;
    }
    getQueryData(queryKey) {
        return queryClient_classPrivateFieldGet(this, _QueryClient_queryCache, "f").find({ queryKey })?.state.data;
    }
    ensureQueryData(options) {
        const cachedData = this.getQueryData(options.queryKey);
        return cachedData !== undefined
            ? Promise.resolve(cachedData)
            : this.fetchQuery(options);
    }
    getQueriesData(filters) {
        return this.getQueryCache()
            .findAll(filters)
            .map(({ queryKey, state }) => {
            const data = state.data;
            return [queryKey, data];
        });
    }
    setQueryData(queryKey, updater, options) {
        const query = queryClient_classPrivateFieldGet(this, _QueryClient_queryCache, "f").find({ queryKey });
        const prevData = query?.state.data;
        const data = functionalUpdate(updater, prevData);
        if (typeof data === 'undefined') {
            return undefined;
        }
        const defaultedOptions = this.defaultQueryOptions({ queryKey });
        return queryClient_classPrivateFieldGet(this, _QueryClient_queryCache, "f")
            .build(this, defaultedOptions)
            .setData(data, { ...options, manual: true });
    }
    setQueriesData(filters, updater, options) {
        return notifyManager.batch(() => this.getQueryCache()
            .findAll(filters)
            .map(({ queryKey }) => [
            queryKey,
            this.setQueryData(queryKey, updater, options),
        ]));
    }
    getQueryState(queryKey) {
        return queryClient_classPrivateFieldGet(this, _QueryClient_queryCache, "f").find({ queryKey })?.state;
    }
    removeQueries(filters) {
        const queryCache = queryClient_classPrivateFieldGet(this, _QueryClient_queryCache, "f");
        notifyManager.batch(() => {
            queryCache.findAll(filters).forEach((query) => {
                queryCache.remove(query);
            });
        });
    }
    resetQueries(filters, options) {
        const queryCache = queryClient_classPrivateFieldGet(this, _QueryClient_queryCache, "f");
        const refetchFilters = {
            type: 'active',
            ...filters,
        };
        return notifyManager.batch(() => {
            queryCache.findAll(filters).forEach((query) => {
                query.reset();
            });
            return this.refetchQueries(refetchFilters, options);
        });
    }
    cancelQueries(filters = {}, cancelOptions = {}) {
        const defaultedCancelOptions = { revert: true, ...cancelOptions };
        const promises = notifyManager.batch(() => queryClient_classPrivateFieldGet(this, _QueryClient_queryCache, "f")
            .findAll(filters)
            .map((query) => query.cancel(defaultedCancelOptions)));
        return Promise.all(promises).then(noop).catch(noop);
    }
    invalidateQueries(filters = {}, options = {}) {
        return notifyManager.batch(() => {
            queryClient_classPrivateFieldGet(this, _QueryClient_queryCache, "f").findAll(filters).forEach((query) => {
                query.invalidate();
            });
            if (filters.refetchType === 'none') {
                return Promise.resolve();
            }
            const refetchFilters = {
                ...filters,
                type: filters.refetchType ?? filters.type ?? 'active',
            };
            return this.refetchQueries(refetchFilters, options);
        });
    }
    refetchQueries(filters = {}, options) {
        const fetchOptions = {
            ...options,
            cancelRefetch: options?.cancelRefetch ?? true,
        };
        const promises = notifyManager.batch(() => queryClient_classPrivateFieldGet(this, _QueryClient_queryCache, "f")
            .findAll(filters)
            .filter((query) => !query.isDisabled())
            .map((query) => {
            let promise = query.fetch(undefined, fetchOptions);
            if (!fetchOptions.throwOnError) {
                promise = promise.catch(noop);
            }
            return query.state.fetchStatus === 'paused'
                ? Promise.resolve()
                : promise;
        }));
        return Promise.all(promises).then(noop);
    }
    fetchQuery(options) {
        const defaultedOptions = this.defaultQueryOptions(options);
        // https://github.com/tannerlinsley/react-query/issues/652
        if (typeof defaultedOptions.retry === 'undefined') {
            defaultedOptions.retry = false;
        }
        const query = queryClient_classPrivateFieldGet(this, _QueryClient_queryCache, "f").build(this, defaultedOptions);
        return query.isStaleByTime(defaultedOptions.staleTime)
            ? query.fetch(defaultedOptions)
            : Promise.resolve(query.state.data);
    }
    prefetchQuery(options) {
        return this.fetchQuery(options).then(noop).catch(noop);
    }
    fetchInfiniteQuery(options) {
        options.behavior = infiniteQueryBehavior(options.pages);
        return this.fetchQuery(options);
    }
    prefetchInfiniteQuery(options) {
        return this.fetchInfiniteQuery(options).then(noop).catch(noop);
    }
    resumePausedMutations() {
        return queryClient_classPrivateFieldGet(this, _QueryClient_mutationCache, "f").resumePausedMutations();
    }
    getQueryCache() {
        return queryClient_classPrivateFieldGet(this, _QueryClient_queryCache, "f");
    }
    getMutationCache() {
        return queryClient_classPrivateFieldGet(this, _QueryClient_mutationCache, "f");
    }
    getDefaultOptions() {
        return queryClient_classPrivateFieldGet(this, _QueryClient_defaultOptions, "f");
    }
    setDefaultOptions(options) {
        queryClient_classPrivateFieldSet(this, _QueryClient_defaultOptions, options, "f");
    }
    setQueryDefaults(queryKey, options) {
        queryClient_classPrivateFieldGet(this, _QueryClient_queryDefaults, "f").set(hashKey(queryKey), {
            queryKey,
            defaultOptions: options,
        });
    }
    getQueryDefaults(queryKey) {
        const defaults = [...queryClient_classPrivateFieldGet(this, _QueryClient_queryDefaults, "f").values()];
        let result = {};
        defaults.forEach((queryDefault) => {
            if (partialMatchKey(queryKey, queryDefault.queryKey)) {
                result = { ...result, ...queryDefault.defaultOptions };
            }
        });
        return result;
    }
    setMutationDefaults(mutationKey, options) {
        queryClient_classPrivateFieldGet(this, _QueryClient_mutationDefaults, "f").set(hashKey(mutationKey), {
            mutationKey,
            defaultOptions: options,
        });
    }
    getMutationDefaults(mutationKey) {
        const defaults = [...queryClient_classPrivateFieldGet(this, _QueryClient_mutationDefaults, "f").values()];
        let result = {};
        defaults.forEach((queryDefault) => {
            if (partialMatchKey(mutationKey, queryDefault.mutationKey)) {
                result = { ...result, ...queryDefault.defaultOptions };
            }
        });
        return result;
    }
    defaultQueryOptions(options) {
        if (options?._defaulted) {
            return options;
        }
        const defaultedOptions = {
            ...queryClient_classPrivateFieldGet(this, _QueryClient_defaultOptions, "f").queries,
            ...(options?.queryKey && this.getQueryDefaults(options.queryKey)),
            ...options,
            _defaulted: true,
        };
        if (!defaultedOptions.queryHash) {
            defaultedOptions.queryHash = hashQueryKeyByOptions(defaultedOptions.queryKey, defaultedOptions);
        }
        // dependent default values
        if (typeof defaultedOptions.refetchOnReconnect === 'undefined') {
            defaultedOptions.refetchOnReconnect =
                defaultedOptions.networkMode !== 'always';
        }
        if (typeof defaultedOptions.throwOnError === 'undefined') {
            defaultedOptions.throwOnError = !!defaultedOptions.suspense;
        }
        if (typeof defaultedOptions.networkMode === 'undefined' &&
            defaultedOptions.persister) {
            defaultedOptions.networkMode = 'offlineFirst';
        }
        return defaultedOptions;
    }
    defaultMutationOptions(options) {
        if (options?._defaulted) {
            return options;
        }
        return {
            ...queryClient_classPrivateFieldGet(this, _QueryClient_defaultOptions, "f").mutations,
            ...(options?.mutationKey &&
                this.getMutationDefaults(options.mutationKey)),
            ...options,
            _defaulted: true,
        };
    }
    clear() {
        queryClient_classPrivateFieldGet(this, _QueryClient_queryCache, "f").clear();
        queryClient_classPrivateFieldGet(this, _QueryClient_mutationCache, "f").clear();
    }
}
_QueryClient_queryCache = new WeakMap(), _QueryClient_mutationCache = new WeakMap(), _QueryClient_defaultOptions = new WeakMap(), _QueryClient_queryDefaults = new WeakMap(), _QueryClient_mutationDefaults = new WeakMap(), _QueryClient_mountCount = new WeakMap(), _QueryClient_unsubscribeFocus = new WeakMap(), _QueryClient_unsubscribeOnline = new WeakMap();

;// CONCATENATED MODULE: ./packages/query-core/src/queryObserver.ts
var queryObserver_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var queryObserver_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _QueryObserver_instances, _QueryObserver_client, _QueryObserver_currentQuery, _QueryObserver_currentQueryInitialState, _QueryObserver_currentResult, _QueryObserver_currentResultState, _QueryObserver_currentResultOptions, _QueryObserver_selectError, _QueryObserver_selectFn, _QueryObserver_selectResult, _QueryObserver_lastQueryWithDefinedData, _QueryObserver_staleTimeoutId, _QueryObserver_refetchIntervalId, _QueryObserver_currentRefetchInterval, _QueryObserver_trackedProps, _QueryObserver_executeFetch, _QueryObserver_updateStaleTimeout, _QueryObserver_computeRefetchInterval, _QueryObserver_updateRefetchInterval, _QueryObserver_updateTimers, _QueryObserver_clearStaleTimeout, _QueryObserver_clearRefetchInterval, _QueryObserver_updateQuery, _QueryObserver_notify;





class QueryObserver extends Subscribable {
    constructor(client, options) {
        super();
        _QueryObserver_instances.add(this);
        this.options = options;
        _QueryObserver_client.set(this, void 0);
        _QueryObserver_currentQuery.set(this, undefined);
        _QueryObserver_currentQueryInitialState.set(this, undefined);
        _QueryObserver_currentResult.set(this, undefined);
        _QueryObserver_currentResultState.set(this, void 0);
        _QueryObserver_currentResultOptions.set(this, void 0);
        _QueryObserver_selectError.set(this, void 0);
        _QueryObserver_selectFn.set(this, void 0);
        _QueryObserver_selectResult.set(this, void 0);
        // This property keeps track of the last query with defined data.
        // It will be used to pass the previous data and query to the placeholder function between renders.
        _QueryObserver_lastQueryWithDefinedData.set(this, void 0);
        _QueryObserver_staleTimeoutId.set(this, void 0);
        _QueryObserver_refetchIntervalId.set(this, void 0);
        _QueryObserver_currentRefetchInterval.set(this, void 0);
        _QueryObserver_trackedProps.set(this, new Set());
        queryObserver_classPrivateFieldSet(this, _QueryObserver_client, client, "f");
        queryObserver_classPrivateFieldSet(this, _QueryObserver_selectError, null, "f");
        this.bindMethods();
        this.setOptions(options);
    }
    bindMethods() {
        this.refetch = this.refetch.bind(this);
    }
    onSubscribe() {
        if (this.listeners.size === 1) {
            queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f").addObserver(this);
            if (shouldFetchOnMount(queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f"), this.options)) {
                queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_executeFetch).call(this);
            }
            else {
                this.updateResult();
            }
            queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_updateTimers).call(this);
        }
    }
    onUnsubscribe() {
        if (!this.hasListeners()) {
            this.destroy();
        }
    }
    shouldFetchOnReconnect() {
        return shouldFetchOn(queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f"), this.options, this.options.refetchOnReconnect);
    }
    shouldFetchOnWindowFocus() {
        return shouldFetchOn(queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f"), this.options, this.options.refetchOnWindowFocus);
    }
    destroy() {
        this.listeners = new Set();
        queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_clearStaleTimeout).call(this);
        queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_clearRefetchInterval).call(this);
        queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f").removeObserver(this);
    }
    setOptions(options, notifyOptions) {
        const prevOptions = this.options;
        const prevQuery = queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f");
        this.options = queryObserver_classPrivateFieldGet(this, _QueryObserver_client, "f").defaultQueryOptions(options);
        if (!shallowEqualObjects(prevOptions, this.options)) {
            queryObserver_classPrivateFieldGet(this, _QueryObserver_client, "f").getQueryCache().notify({
                type: 'observerOptionsUpdated',
                query: queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f"),
                observer: this,
            });
        }
        if (typeof this.options.enabled !== 'undefined' &&
            typeof this.options.enabled !== 'boolean') {
            throw new Error('Expected enabled to be a boolean');
        }
        // Keep previous query key if the user does not supply one
        if (!this.options.queryKey) {
            this.options.queryKey = prevOptions.queryKey;
        }
        queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_updateQuery).call(this);
        const mounted = this.hasListeners();
        // Fetch if there are subscribers
        if (mounted &&
            shouldFetchOptionally(queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f"), prevQuery, this.options, prevOptions)) {
            queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_executeFetch).call(this);
        }
        // Update result
        this.updateResult(notifyOptions);
        // Update stale interval if needed
        if (mounted &&
            (queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f") !== prevQuery ||
                this.options.enabled !== prevOptions.enabled ||
                this.options.staleTime !== prevOptions.staleTime)) {
            queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_updateStaleTimeout).call(this);
        }
        const nextRefetchInterval = queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_computeRefetchInterval).call(this);
        // Update refetch interval if needed
        if (mounted &&
            (queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f") !== prevQuery ||
                this.options.enabled !== prevOptions.enabled ||
                nextRefetchInterval !== queryObserver_classPrivateFieldGet(this, _QueryObserver_currentRefetchInterval, "f"))) {
            queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_updateRefetchInterval).call(this, nextRefetchInterval);
        }
    }
    getOptimisticResult(options) {
        const query = queryObserver_classPrivateFieldGet(this, _QueryObserver_client, "f").getQueryCache().build(queryObserver_classPrivateFieldGet(this, _QueryObserver_client, "f"), options);
        const result = this.createResult(query, options);
        if (shouldAssignObserverCurrentProperties(this, result)) {
            // this assigns the optimistic result to the current Observer
            // because if the query function changes, useQuery will be performing
            // an effect where it would fetch again.
            // When the fetch finishes, we perform a deep data cloning in order
            // to reuse objects references. This deep data clone is performed against
            // the `observer.currentResult.data` property
            // When QueryKey changes, we refresh the query and get new `optimistic`
            // result, while we leave the `observer.currentResult`, so when new data
            // arrives, it finds the old `observer.currentResult` which is related
            // to the old QueryKey. Which means that currentResult and selectData are
            // out of sync already.
            // To solve this, we move the cursor of the currentResult everytime
            // an observer reads an optimistic value.
            // When keeping the previous data, the result doesn't change until new
            // data arrives.
            queryObserver_classPrivateFieldSet(this, _QueryObserver_currentResult, result, "f");
            queryObserver_classPrivateFieldSet(this, _QueryObserver_currentResultOptions, this.options, "f");
            queryObserver_classPrivateFieldSet(this, _QueryObserver_currentResultState, queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f").state, "f");
        }
        return result;
    }
    getCurrentResult() {
        return queryObserver_classPrivateFieldGet(this, _QueryObserver_currentResult, "f");
    }
    trackResult(result) {
        const trackedResult = {};
        Object.keys(result).forEach((key) => {
            Object.defineProperty(trackedResult, key, {
                configurable: false,
                enumerable: true,
                get: () => {
                    queryObserver_classPrivateFieldGet(this, _QueryObserver_trackedProps, "f").add(key);
                    return result[key];
                },
            });
        });
        return trackedResult;
    }
    getCurrentQuery() {
        return queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f");
    }
    refetch({ ...options } = {}) {
        return this.fetch({
            ...options,
        });
    }
    fetchOptimistic(options) {
        const defaultedOptions = queryObserver_classPrivateFieldGet(this, _QueryObserver_client, "f").defaultQueryOptions(options);
        const query = queryObserver_classPrivateFieldGet(this, _QueryObserver_client, "f")
            .getQueryCache()
            .build(queryObserver_classPrivateFieldGet(this, _QueryObserver_client, "f"), defaultedOptions);
        query.isFetchingOptimistic = true;
        return query.fetch().then(() => this.createResult(query, defaultedOptions));
    }
    fetch(fetchOptions) {
        return queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_executeFetch).call(this, {
            ...fetchOptions,
            cancelRefetch: fetchOptions.cancelRefetch ?? true,
        }).then(() => {
            this.updateResult();
            return queryObserver_classPrivateFieldGet(this, _QueryObserver_currentResult, "f");
        });
    }
    createResult(query, options) {
        const prevQuery = queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f");
        const prevOptions = this.options;
        const prevResult = queryObserver_classPrivateFieldGet(this, _QueryObserver_currentResult, "f");
        const prevResultState = queryObserver_classPrivateFieldGet(this, _QueryObserver_currentResultState, "f");
        const prevResultOptions = queryObserver_classPrivateFieldGet(this, _QueryObserver_currentResultOptions, "f");
        const queryChange = query !== prevQuery;
        const queryInitialState = queryChange
            ? query.state
            : queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQueryInitialState, "f");
        const { state } = query;
        let { error, errorUpdatedAt, fetchStatus, status } = state;
        let isPlaceholderData = false;
        let data;
        // Optimistically set result in fetching state if needed
        if (options._optimisticResults) {
            const mounted = this.hasListeners();
            const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
            const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
            if (fetchOnMount || fetchOptionally) {
                fetchStatus = canFetch(query.options.networkMode)
                    ? 'fetching'
                    : 'paused';
                if (!state.dataUpdatedAt) {
                    status = 'pending';
                }
            }
            if (options._optimisticResults === 'isRestoring') {
                fetchStatus = 'idle';
            }
        }
        // Select data if needed
        if (options.select && typeof state.data !== 'undefined') {
            // Memoize select result
            if (prevResult &&
                state.data === prevResultState?.data &&
                options.select === queryObserver_classPrivateFieldGet(this, _QueryObserver_selectFn, "f")) {
                data = queryObserver_classPrivateFieldGet(this, _QueryObserver_selectResult, "f");
            }
            else {
                try {
                    queryObserver_classPrivateFieldSet(this, _QueryObserver_selectFn, options.select, "f");
                    data = options.select(state.data);
                    data = replaceData(prevResult?.data, data, options);
                    queryObserver_classPrivateFieldSet(this, _QueryObserver_selectResult, data, "f");
                    queryObserver_classPrivateFieldSet(this, _QueryObserver_selectError, null, "f");
                }
                catch (selectError) {
                    queryObserver_classPrivateFieldSet(this, _QueryObserver_selectError, selectError, "f");
                }
            }
        }
        // Use query data
        else {
            data = state.data;
        }
        // Show placeholder data if needed
        if (typeof options.placeholderData !== 'undefined' &&
            typeof data === 'undefined' &&
            status === 'pending') {
            let placeholderData;
            // Memoize placeholder data
            if (prevResult?.isPlaceholderData &&
                options.placeholderData === prevResultOptions?.placeholderData) {
                placeholderData = prevResult.data;
            }
            else {
                placeholderData =
                    typeof options.placeholderData === 'function'
                        ? options.placeholderData(queryObserver_classPrivateFieldGet(this, _QueryObserver_lastQueryWithDefinedData, "f")?.state.data, queryObserver_classPrivateFieldGet(this, _QueryObserver_lastQueryWithDefinedData, "f"))
                        : options.placeholderData;
                if (options.select && typeof placeholderData !== 'undefined') {
                    try {
                        placeholderData = options.select(placeholderData);
                        queryObserver_classPrivateFieldSet(this, _QueryObserver_selectError, null, "f");
                    }
                    catch (selectError) {
                        queryObserver_classPrivateFieldSet(this, _QueryObserver_selectError, selectError, "f");
                    }
                }
            }
            if (typeof placeholderData !== 'undefined') {
                status = 'success';
                data = replaceData(prevResult?.data, placeholderData, options);
                isPlaceholderData = true;
            }
        }
        if (queryObserver_classPrivateFieldGet(this, _QueryObserver_selectError, "f")) {
            error = queryObserver_classPrivateFieldGet(this, _QueryObserver_selectError, "f");
            data = queryObserver_classPrivateFieldGet(this, _QueryObserver_selectResult, "f");
            errorUpdatedAt = Date.now();
            status = 'error';
        }
        const isFetching = fetchStatus === 'fetching';
        const isPending = status === 'pending';
        const isError = status === 'error';
        const isLoading = isPending && isFetching;
        const result = {
            status,
            fetchStatus,
            isPending,
            isSuccess: status === 'success',
            isError,
            isInitialLoading: isLoading,
            isLoading,
            data,
            dataUpdatedAt: state.dataUpdatedAt,
            error,
            errorUpdatedAt,
            failureCount: state.fetchFailureCount,
            failureReason: state.fetchFailureReason,
            errorUpdateCount: state.errorUpdateCount,
            isFetched: state.dataUpdateCount > 0 || state.errorUpdateCount > 0,
            isFetchedAfterMount: state.dataUpdateCount > queryInitialState.dataUpdateCount ||
                state.errorUpdateCount > queryInitialState.errorUpdateCount,
            isFetching,
            isRefetching: isFetching && !isPending,
            isLoadingError: isError && state.dataUpdatedAt === 0,
            isPaused: fetchStatus === 'paused',
            isPlaceholderData,
            isRefetchError: isError && state.dataUpdatedAt !== 0,
            isStale: isStale(query, options),
            refetch: this.refetch,
        };
        return result;
    }
    updateResult(notifyOptions) {
        const prevResult = queryObserver_classPrivateFieldGet(this, _QueryObserver_currentResult, "f");
        const nextResult = this.createResult(queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f"), this.options);
        queryObserver_classPrivateFieldSet(this, _QueryObserver_currentResultState, queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f").state, "f");
        queryObserver_classPrivateFieldSet(this, _QueryObserver_currentResultOptions, this.options, "f");
        if (queryObserver_classPrivateFieldGet(this, _QueryObserver_currentResultState, "f").data !== undefined) {
            queryObserver_classPrivateFieldSet(this, _QueryObserver_lastQueryWithDefinedData, queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f"), "f");
        }
        // Only notify and update result if something has changed
        if (shallowEqualObjects(nextResult, prevResult)) {
            return;
        }
        queryObserver_classPrivateFieldSet(this, _QueryObserver_currentResult, nextResult, "f");
        // Determine which callbacks to trigger
        const defaultNotifyOptions = {};
        const shouldNotifyListeners = () => {
            if (!prevResult) {
                return true;
            }
            const { notifyOnChangeProps } = this.options;
            const notifyOnChangePropsValue = typeof notifyOnChangeProps === 'function'
                ? notifyOnChangeProps()
                : notifyOnChangeProps;
            if (notifyOnChangePropsValue === 'all' ||
                (!notifyOnChangePropsValue && !queryObserver_classPrivateFieldGet(this, _QueryObserver_trackedProps, "f").size)) {
                return true;
            }
            const includedProps = new Set(notifyOnChangePropsValue ?? queryObserver_classPrivateFieldGet(this, _QueryObserver_trackedProps, "f"));
            if (this.options.throwOnError) {
                includedProps.add('error');
            }
            return Object.keys(queryObserver_classPrivateFieldGet(this, _QueryObserver_currentResult, "f")).some((key) => {
                const typedKey = key;
                const changed = queryObserver_classPrivateFieldGet(this, _QueryObserver_currentResult, "f")[typedKey] !== prevResult[typedKey];
                return changed && includedProps.has(typedKey);
            });
        };
        if (notifyOptions?.listeners !== false && shouldNotifyListeners()) {
            defaultNotifyOptions.listeners = true;
        }
        queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_notify).call(this, { ...defaultNotifyOptions, ...notifyOptions });
    }
    onQueryUpdate() {
        this.updateResult();
        if (this.hasListeners()) {
            queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_updateTimers).call(this);
        }
    }
}
_QueryObserver_client = new WeakMap(), _QueryObserver_currentQuery = new WeakMap(), _QueryObserver_currentQueryInitialState = new WeakMap(), _QueryObserver_currentResult = new WeakMap(), _QueryObserver_currentResultState = new WeakMap(), _QueryObserver_currentResultOptions = new WeakMap(), _QueryObserver_selectError = new WeakMap(), _QueryObserver_selectFn = new WeakMap(), _QueryObserver_selectResult = new WeakMap(), _QueryObserver_lastQueryWithDefinedData = new WeakMap(), _QueryObserver_staleTimeoutId = new WeakMap(), _QueryObserver_refetchIntervalId = new WeakMap(), _QueryObserver_currentRefetchInterval = new WeakMap(), _QueryObserver_trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), _QueryObserver_executeFetch = function _QueryObserver_executeFetch(fetchOptions) {
    // Make sure we reference the latest query as the current one might have been removed
    queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_updateQuery).call(this);
    // Fetch
    let promise = queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f").fetch(this.options, fetchOptions);
    if (!fetchOptions?.throwOnError) {
        promise = promise.catch(noop);
    }
    return promise;
}, _QueryObserver_updateStaleTimeout = function _QueryObserver_updateStaleTimeout() {
    queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_clearStaleTimeout).call(this);
    if (isServer ||
        queryObserver_classPrivateFieldGet(this, _QueryObserver_currentResult, "f").isStale ||
        !isValidTimeout(this.options.staleTime)) {
        return;
    }
    const time = timeUntilStale(queryObserver_classPrivateFieldGet(this, _QueryObserver_currentResult, "f").dataUpdatedAt, this.options.staleTime);
    // The timeout is sometimes triggered 1 ms before the stale time expiration.
    // To mitigate this issue we always add 1 ms to the timeout.
    const timeout = time + 1;
    queryObserver_classPrivateFieldSet(this, _QueryObserver_staleTimeoutId, setTimeout(() => {
        if (!queryObserver_classPrivateFieldGet(this, _QueryObserver_currentResult, "f").isStale) {
            this.updateResult();
        }
    }, timeout), "f");
}, _QueryObserver_computeRefetchInterval = function _QueryObserver_computeRefetchInterval() {
    return ((typeof this.options.refetchInterval === 'function'
        ? this.options.refetchInterval(queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f"))
        : this.options.refetchInterval) ?? false);
}, _QueryObserver_updateRefetchInterval = function _QueryObserver_updateRefetchInterval(nextInterval) {
    queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_clearRefetchInterval).call(this);
    queryObserver_classPrivateFieldSet(this, _QueryObserver_currentRefetchInterval, nextInterval, "f");
    if (isServer ||
        this.options.enabled === false ||
        !isValidTimeout(queryObserver_classPrivateFieldGet(this, _QueryObserver_currentRefetchInterval, "f")) ||
        queryObserver_classPrivateFieldGet(this, _QueryObserver_currentRefetchInterval, "f") === 0) {
        return;
    }
    queryObserver_classPrivateFieldSet(this, _QueryObserver_refetchIntervalId, setInterval(() => {
        if (this.options.refetchIntervalInBackground ||
            focusManager.isFocused()) {
            queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_executeFetch).call(this);
        }
    }, queryObserver_classPrivateFieldGet(this, _QueryObserver_currentRefetchInterval, "f")), "f");
}, _QueryObserver_updateTimers = function _QueryObserver_updateTimers() {
    queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_updateStaleTimeout).call(this);
    queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_updateRefetchInterval).call(this, queryObserver_classPrivateFieldGet(this, _QueryObserver_instances, "m", _QueryObserver_computeRefetchInterval).call(this));
}, _QueryObserver_clearStaleTimeout = function _QueryObserver_clearStaleTimeout() {
    if (queryObserver_classPrivateFieldGet(this, _QueryObserver_staleTimeoutId, "f")) {
        clearTimeout(queryObserver_classPrivateFieldGet(this, _QueryObserver_staleTimeoutId, "f"));
        queryObserver_classPrivateFieldSet(this, _QueryObserver_staleTimeoutId, undefined, "f");
    }
}, _QueryObserver_clearRefetchInterval = function _QueryObserver_clearRefetchInterval() {
    if (queryObserver_classPrivateFieldGet(this, _QueryObserver_refetchIntervalId, "f")) {
        clearInterval(queryObserver_classPrivateFieldGet(this, _QueryObserver_refetchIntervalId, "f"));
        queryObserver_classPrivateFieldSet(this, _QueryObserver_refetchIntervalId, undefined, "f");
    }
}, _QueryObserver_updateQuery = function _QueryObserver_updateQuery() {
    const query = queryObserver_classPrivateFieldGet(this, _QueryObserver_client, "f").getQueryCache().build(queryObserver_classPrivateFieldGet(this, _QueryObserver_client, "f"), this.options);
    if (query === queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f")) {
        return;
    }
    const prevQuery = queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f");
    queryObserver_classPrivateFieldSet(this, _QueryObserver_currentQuery, query, "f");
    queryObserver_classPrivateFieldSet(this, _QueryObserver_currentQueryInitialState, query.state, "f");
    if (this.hasListeners()) {
        prevQuery?.removeObserver(this);
        query.addObserver(this);
    }
}, _QueryObserver_notify = function _QueryObserver_notify(notifyOptions) {
    notifyManager.batch(() => {
        // First, trigger the listeners
        if (notifyOptions.listeners) {
            this.listeners.forEach((listener) => {
                listener(queryObserver_classPrivateFieldGet(this, _QueryObserver_currentResult, "f"));
            });
        }
        // Then the cache listeners
        queryObserver_classPrivateFieldGet(this, _QueryObserver_client, "f").getQueryCache().notify({
            query: queryObserver_classPrivateFieldGet(this, _QueryObserver_currentQuery, "f"),
            type: 'observerResultsUpdated',
        });
    });
};
function shouldLoadOnMount(query, options) {
    return (options.enabled !== false &&
        !query.state.dataUpdatedAt &&
        !(query.state.status === 'error' && options.retryOnMount === false));
}
function shouldFetchOnMount(query, options) {
    return (shouldLoadOnMount(query, options) ||
        (query.state.dataUpdatedAt > 0 &&
            shouldFetchOn(query, options, options.refetchOnMount)));
}
function shouldFetchOn(query, options, field) {
    if (options.enabled !== false) {
        const value = typeof field === 'function' ? field(query) : field;
        return value === 'always' || (value !== false && isStale(query, options));
    }
    return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
    return (options.enabled !== false &&
        (query !== prevQuery || prevOptions.enabled === false) &&
        (!options.suspense || query.state.status !== 'error') &&
        isStale(query, options));
}
function isStale(query, options) {
    return query.isStaleByTime(options.staleTime);
}
// this function would decide if we will update the observer's 'current'
// properties after an optimistic reading via getOptimisticResult
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
    // if the newly created result isn't what the observer is holding as current,
    // then we'll need to update the properties as well
    if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
        return true;
    }
    // basically, just keep previous properties if nothing changed
    return false;
}

;// CONCATENATED MODULE: ./packages/query-core/src/queriesObserver.ts
var queriesObserver_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var queriesObserver_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _QueriesObserver_instances, _QueriesObserver_client, _QueriesObserver_result, _QueriesObserver_queries, _QueriesObserver_observers, _QueriesObserver_options, _QueriesObserver_combinedResult, _QueriesObserver_setResult, _QueriesObserver_combineResult, _QueriesObserver_findMatchingObservers, _QueriesObserver_onUpdate, _QueriesObserver_notify;




function difference(array1, array2) {
    return array1.filter((x) => !array2.includes(x));
}
function replaceAt(array, index, value) {
    const copy = array.slice(0);
    copy[index] = value;
    return copy;
}
class QueriesObserver extends Subscribable {
    constructor(client, queries, options) {
        super();
        _QueriesObserver_instances.add(this);
        _QueriesObserver_client.set(this, void 0);
        _QueriesObserver_result.set(this, void 0);
        _QueriesObserver_queries.set(this, void 0);
        _QueriesObserver_observers.set(this, void 0);
        _QueriesObserver_options.set(this, void 0);
        _QueriesObserver_combinedResult.set(this, void 0);
        queriesObserver_classPrivateFieldSet(this, _QueriesObserver_client, client, "f");
        queriesObserver_classPrivateFieldSet(this, _QueriesObserver_queries, [], "f");
        queriesObserver_classPrivateFieldSet(this, _QueriesObserver_observers, [], "f");
        queriesObserver_classPrivateFieldGet(this, _QueriesObserver_instances, "m", _QueriesObserver_setResult).call(this, []);
        this.setQueries(queries, options);
    }
    onSubscribe() {
        if (this.listeners.size === 1) {
            queriesObserver_classPrivateFieldGet(this, _QueriesObserver_observers, "f").forEach((observer) => {
                observer.subscribe((result) => {
                    queriesObserver_classPrivateFieldGet(this, _QueriesObserver_instances, "m", _QueriesObserver_onUpdate).call(this, observer, result);
                });
            });
        }
    }
    onUnsubscribe() {
        if (!this.listeners.size) {
            this.destroy();
        }
    }
    destroy() {
        this.listeners = new Set();
        queriesObserver_classPrivateFieldGet(this, _QueriesObserver_observers, "f").forEach((observer) => {
            observer.destroy();
        });
    }
    setQueries(queries, options, notifyOptions) {
        queriesObserver_classPrivateFieldSet(this, _QueriesObserver_queries, queries, "f");
        queriesObserver_classPrivateFieldSet(this, _QueriesObserver_options, options, "f");
        notifyManager.batch(() => {
            const prevObservers = queriesObserver_classPrivateFieldGet(this, _QueriesObserver_observers, "f");
            const newObserverMatches = queriesObserver_classPrivateFieldGet(this, _QueriesObserver_instances, "m", _QueriesObserver_findMatchingObservers).call(this, queriesObserver_classPrivateFieldGet(this, _QueriesObserver_queries, "f"));
            // set options for the new observers to notify of changes
            newObserverMatches.forEach((match) => match.observer.setOptions(match.defaultedQueryOptions, notifyOptions));
            const newObservers = newObserverMatches.map((match) => match.observer);
            const newResult = newObservers.map((observer) => observer.getCurrentResult());
            const hasIndexChange = newObservers.some((observer, index) => observer !== prevObservers[index]);
            if (prevObservers.length === newObservers.length && !hasIndexChange) {
                return;
            }
            queriesObserver_classPrivateFieldSet(this, _QueriesObserver_observers, newObservers, "f");
            queriesObserver_classPrivateFieldGet(this, _QueriesObserver_instances, "m", _QueriesObserver_setResult).call(this, newResult);
            if (!this.hasListeners()) {
                return;
            }
            difference(prevObservers, newObservers).forEach((observer) => {
                observer.destroy();
            });
            difference(newObservers, prevObservers).forEach((observer) => {
                observer.subscribe((result) => {
                    queriesObserver_classPrivateFieldGet(this, _QueriesObserver_instances, "m", _QueriesObserver_onUpdate).call(this, observer, result);
                });
            });
            queriesObserver_classPrivateFieldGet(this, _QueriesObserver_instances, "m", _QueriesObserver_notify).call(this);
        });
    }
    getCurrentResult() {
        return queriesObserver_classPrivateFieldGet(this, _QueriesObserver_combinedResult, "f");
    }
    getQueries() {
        return queriesObserver_classPrivateFieldGet(this, _QueriesObserver_observers, "f").map((observer) => observer.getCurrentQuery());
    }
    getObservers() {
        return queriesObserver_classPrivateFieldGet(this, _QueriesObserver_observers, "f");
    }
    getOptimisticResult(queries, combine) {
        const matches = queriesObserver_classPrivateFieldGet(this, _QueriesObserver_instances, "m", _QueriesObserver_findMatchingObservers).call(this, queries);
        const result = matches.map((match) => match.observer.getOptimisticResult(match.defaultedQueryOptions));
        return [
            result,
            (r) => {
                return queriesObserver_classPrivateFieldGet(this, _QueriesObserver_instances, "m", _QueriesObserver_combineResult).call(this, r ?? result, combine);
            },
            () => {
                return matches.map((match, index) => {
                    const observerResult = result[index];
                    return !match.defaultedQueryOptions.notifyOnChangeProps
                        ? match.observer.trackResult(observerResult)
                        : observerResult;
                });
            },
        ];
    }
}
_QueriesObserver_client = new WeakMap(), _QueriesObserver_result = new WeakMap(), _QueriesObserver_queries = new WeakMap(), _QueriesObserver_observers = new WeakMap(), _QueriesObserver_options = new WeakMap(), _QueriesObserver_combinedResult = new WeakMap(), _QueriesObserver_instances = new WeakSet(), _QueriesObserver_setResult = function _QueriesObserver_setResult(value) {
    queriesObserver_classPrivateFieldSet(this, _QueriesObserver_result, value, "f");
    queriesObserver_classPrivateFieldSet(this, _QueriesObserver_combinedResult, queriesObserver_classPrivateFieldGet(this, _QueriesObserver_instances, "m", _QueriesObserver_combineResult).call(this, value, queriesObserver_classPrivateFieldGet(this, _QueriesObserver_options, "f")?.combine), "f");
}, _QueriesObserver_combineResult = function _QueriesObserver_combineResult(input, combine) {
    if (combine) {
        return replaceEqualDeep(queriesObserver_classPrivateFieldGet(this, _QueriesObserver_combinedResult, "f"), combine(input));
    }
    return input;
}, _QueriesObserver_findMatchingObservers = function _QueriesObserver_findMatchingObservers(queries) {
    const prevObservers = queriesObserver_classPrivateFieldGet(this, _QueriesObserver_observers, "f");
    const prevObserversMap = new Map(prevObservers.map((observer) => [observer.options.queryHash, observer]));
    const defaultedQueryOptions = queries.map((options) => queriesObserver_classPrivateFieldGet(this, _QueriesObserver_client, "f").defaultQueryOptions(options));
    const matchingObservers = defaultedQueryOptions.flatMap((defaultedOptions) => {
        const match = prevObserversMap.get(defaultedOptions.queryHash);
        if (match != null) {
            return [{ defaultedQueryOptions: defaultedOptions, observer: match }];
        }
        return [];
    });
    const matchedQueryHashes = new Set(matchingObservers.map((match) => match.defaultedQueryOptions.queryHash));
    const unmatchedQueries = defaultedQueryOptions.filter((defaultedOptions) => !matchedQueryHashes.has(defaultedOptions.queryHash));
    const getObserver = (options) => {
        const defaultedOptions = queriesObserver_classPrivateFieldGet(this, _QueriesObserver_client, "f").defaultQueryOptions(options);
        const currentObserver = queriesObserver_classPrivateFieldGet(this, _QueriesObserver_observers, "f").find((o) => o.options.queryHash === defaultedOptions.queryHash);
        return (currentObserver ?? new QueryObserver(queriesObserver_classPrivateFieldGet(this, _QueriesObserver_client, "f"), defaultedOptions));
    };
    const newOrReusedObservers = unmatchedQueries.map((options) => {
        return {
            defaultedQueryOptions: options,
            observer: getObserver(options),
        };
    });
    const sortMatchesByOrderOfQueries = (a, b) => defaultedQueryOptions.indexOf(a.defaultedQueryOptions) -
        defaultedQueryOptions.indexOf(b.defaultedQueryOptions);
    return matchingObservers
        .concat(newOrReusedObservers)
        .sort(sortMatchesByOrderOfQueries);
}, _QueriesObserver_onUpdate = function _QueriesObserver_onUpdate(observer, result) {
    const index = queriesObserver_classPrivateFieldGet(this, _QueriesObserver_observers, "f").indexOf(observer);
    if (index !== -1) {
        queriesObserver_classPrivateFieldGet(this, _QueriesObserver_instances, "m", _QueriesObserver_setResult).call(this, replaceAt(queriesObserver_classPrivateFieldGet(this, _QueriesObserver_result, "f"), index, result));
        queriesObserver_classPrivateFieldGet(this, _QueriesObserver_instances, "m", _QueriesObserver_notify).call(this);
    }
}, _QueriesObserver_notify = function _QueriesObserver_notify() {
    notifyManager.batch(() => {
        this.listeners.forEach((listener) => {
            listener(queriesObserver_classPrivateFieldGet(this, _QueriesObserver_result, "f"));
        });
    });
};

;// CONCATENATED MODULE: ./packages/query-core/src/infiniteQueryObserver.ts


class InfiniteQueryObserver extends QueryObserver {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(client, options) {
        super(client, options);
    }
    bindMethods() {
        super.bindMethods();
        this.fetchNextPage = this.fetchNextPage.bind(this);
        this.fetchPreviousPage = this.fetchPreviousPage.bind(this);
    }
    setOptions(options, notifyOptions) {
        super.setOptions({
            ...options,
            behavior: infiniteQueryBehavior(),
        }, notifyOptions);
    }
    getOptimisticResult(options) {
        options.behavior = infiniteQueryBehavior();
        return super.getOptimisticResult(options);
    }
    fetchNextPage(options) {
        return this.fetch({
            ...options,
            meta: {
                fetchMore: { direction: 'forward' },
            },
        });
    }
    fetchPreviousPage(options) {
        return this.fetch({
            ...options,
            meta: {
                fetchMore: { direction: 'backward' },
            },
        });
    }
    createResult(query, options) {
        const { state } = query;
        const result = super.createResult(query, options);
        const { isFetching, isRefetching } = result;
        const isFetchingNextPage = isFetching && state.fetchMeta?.fetchMore?.direction === 'forward';
        const isFetchingPreviousPage = isFetching && state.fetchMeta?.fetchMore?.direction === 'backward';
        return {
            ...result,
            fetchNextPage: this.fetchNextPage,
            fetchPreviousPage: this.fetchPreviousPage,
            hasNextPage: hasNextPage(options, state.data),
            hasPreviousPage: hasPreviousPage(options, state.data),
            isFetchingNextPage,
            isFetchingPreviousPage,
            isRefetching: isRefetching && !isFetchingNextPage && !isFetchingPreviousPage,
        };
    }
}

;// CONCATENATED MODULE: ./packages/query-core/src/mutationObserver.ts
var mutationObserver_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var mutationObserver_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MutationObserver_instances, _MutationObserver_client, _MutationObserver_currentResult, _MutationObserver_currentMutation, _MutationObserver_mutateOptions, _MutationObserver_updateResult, _MutationObserver_notify;




// CLASS
class MutationObserver extends Subscribable {
    constructor(client, options) {
        super();
        _MutationObserver_instances.add(this);
        _MutationObserver_client.set(this, void 0);
        _MutationObserver_currentResult.set(this, undefined);
        _MutationObserver_currentMutation.set(this, void 0);
        _MutationObserver_mutateOptions.set(this, void 0);
        mutationObserver_classPrivateFieldSet(this, _MutationObserver_client, client, "f");
        this.setOptions(options);
        this.bindMethods();
        mutationObserver_classPrivateFieldGet(this, _MutationObserver_instances, "m", _MutationObserver_updateResult).call(this);
    }
    bindMethods() {
        this.mutate = this.mutate.bind(this);
        this.reset = this.reset.bind(this);
    }
    setOptions(options) {
        const prevOptions = this.options;
        this.options = mutationObserver_classPrivateFieldGet(this, _MutationObserver_client, "f").defaultMutationOptions(options);
        if (!shallowEqualObjects(prevOptions, this.options)) {
            mutationObserver_classPrivateFieldGet(this, _MutationObserver_client, "f").getMutationCache().notify({
                type: 'observerOptionsUpdated',
                mutation: mutationObserver_classPrivateFieldGet(this, _MutationObserver_currentMutation, "f"),
                observer: this,
            });
        }
        mutationObserver_classPrivateFieldGet(this, _MutationObserver_currentMutation, "f")?.setOptions(this.options);
        if (prevOptions?.mutationKey &&
            this.options.mutationKey &&
            hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
            this.reset();
        }
    }
    onUnsubscribe() {
        if (!this.hasListeners()) {
            mutationObserver_classPrivateFieldGet(this, _MutationObserver_currentMutation, "f")?.removeObserver(this);
        }
    }
    onMutationUpdate(action) {
        mutationObserver_classPrivateFieldGet(this, _MutationObserver_instances, "m", _MutationObserver_updateResult).call(this);
        mutationObserver_classPrivateFieldGet(this, _MutationObserver_instances, "m", _MutationObserver_notify).call(this, action);
    }
    getCurrentResult() {
        return mutationObserver_classPrivateFieldGet(this, _MutationObserver_currentResult, "f");
    }
    reset() {
        // reset needs to remove the observer from the mutation because there is no way to "get it back"
        // another mutate call will yield a new mutation!
        mutationObserver_classPrivateFieldGet(this, _MutationObserver_currentMutation, "f")?.removeObserver(this);
        mutationObserver_classPrivateFieldSet(this, _MutationObserver_currentMutation, undefined, "f");
        mutationObserver_classPrivateFieldGet(this, _MutationObserver_instances, "m", _MutationObserver_updateResult).call(this);
        mutationObserver_classPrivateFieldGet(this, _MutationObserver_instances, "m", _MutationObserver_notify).call(this);
    }
    mutate(variables, options) {
        mutationObserver_classPrivateFieldSet(this, _MutationObserver_mutateOptions, options, "f");
        mutationObserver_classPrivateFieldGet(this, _MutationObserver_currentMutation, "f")?.removeObserver(this);
        mutationObserver_classPrivateFieldSet(this, _MutationObserver_currentMutation, mutationObserver_classPrivateFieldGet(this, _MutationObserver_client, "f")
            .getMutationCache()
            .build(mutationObserver_classPrivateFieldGet(this, _MutationObserver_client, "f"), this.options), "f");
        mutationObserver_classPrivateFieldGet(this, _MutationObserver_currentMutation, "f").addObserver(this);
        return mutationObserver_classPrivateFieldGet(this, _MutationObserver_currentMutation, "f").execute(variables);
    }
}
_MutationObserver_client = new WeakMap(), _MutationObserver_currentResult = new WeakMap(), _MutationObserver_currentMutation = new WeakMap(), _MutationObserver_mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), _MutationObserver_updateResult = function _MutationObserver_updateResult() {
    const state = mutationObserver_classPrivateFieldGet(this, _MutationObserver_currentMutation, "f")?.state ??
        mutation_getDefaultState();
    mutationObserver_classPrivateFieldSet(this, _MutationObserver_currentResult, {
        ...state,
        isPending: state.status === 'pending',
        isSuccess: state.status === 'success',
        isError: state.status === 'error',
        isIdle: state.status === 'idle',
        mutate: this.mutate,
        reset: this.reset,
    }, "f");
}, _MutationObserver_notify = function _MutationObserver_notify(action) {
    notifyManager.batch(() => {
        // First trigger the mutate callbacks
        if (mutationObserver_classPrivateFieldGet(this, _MutationObserver_mutateOptions, "f") && this.hasListeners()) {
            const variables = mutationObserver_classPrivateFieldGet(this, _MutationObserver_currentResult, "f").variables;
            const context = mutationObserver_classPrivateFieldGet(this, _MutationObserver_currentResult, "f").context;
            if (action?.type === 'success') {
                mutationObserver_classPrivateFieldGet(this, _MutationObserver_mutateOptions, "f").onSuccess?.(action.data, variables, context);
                mutationObserver_classPrivateFieldGet(this, _MutationObserver_mutateOptions, "f").onSettled?.(action.data, null, variables, context);
            }
            else if (action?.type === 'error') {
                mutationObserver_classPrivateFieldGet(this, _MutationObserver_mutateOptions, "f").onError?.(action.error, variables, context);
                mutationObserver_classPrivateFieldGet(this, _MutationObserver_mutateOptions, "f").onSettled?.(undefined, action.error, variables, context);
            }
        }
        // Then trigger the listeners
        this.listeners.forEach((listener) => {
            listener(mutationObserver_classPrivateFieldGet(this, _MutationObserver_currentResult, "f"));
        });
    });
};

;// CONCATENATED MODULE: ./packages/query-core/src/hydration.ts
// FUNCTIONS
function dehydrateMutation(mutation) {
    return {
        mutationKey: mutation.options.mutationKey,
        state: mutation.state,
        ...(mutation.meta && { meta: mutation.meta }),
    };
}
// Most config is not dehydrated but instead meant to configure again when
// consuming the de/rehydrated data, typically with useQuery on the client.
// Sometimes it might make sense to prefetch data on the server and include
// in the html-payload, but not consume it on the initial render.
function dehydrateQuery(query) {
    return {
        state: query.state,
        queryKey: query.queryKey,
        queryHash: query.queryHash,
        ...(query.meta && { meta: query.meta }),
    };
}
function defaultShouldDehydrateMutation(mutation) {
    return mutation.state.isPaused;
}
function defaultShouldDehydrateQuery(query) {
    return query.state.status === 'success';
}
function dehydrate(client, options = {}) {
    const filterMutation = options.shouldDehydrateMutation ?? defaultShouldDehydrateMutation;
    const mutations = client
        .getMutationCache()
        .getAll()
        .flatMap((mutation) => filterMutation(mutation) ? [dehydrateMutation(mutation)] : []);
    const filterQuery = options.shouldDehydrateQuery ?? defaultShouldDehydrateQuery;
    const queries = client
        .getQueryCache()
        .getAll()
        .flatMap((query) => (filterQuery(query) ? [dehydrateQuery(query)] : []));
    return { mutations, queries };
}
function hydrate(client, dehydratedState, options) {
    if (typeof dehydratedState !== 'object' || dehydratedState === null) {
        return;
    }
    const mutationCache = client.getMutationCache();
    const queryCache = client.getQueryCache();
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const mutations = dehydratedState.mutations || [];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const queries = dehydratedState.queries || [];
    mutations.forEach((dehydratedMutation) => {
        mutationCache.build(client, {
            ...options?.defaultOptions?.mutations,
            mutationKey: dehydratedMutation.mutationKey,
            meta: dehydratedMutation.meta,
        }, dehydratedMutation.state);
    });
    queries.forEach(({ queryKey, state, queryHash, meta }) => {
        const query = queryCache.get(queryHash);
        // Do not hydrate if an existing query exists with newer data
        if (query) {
            if (query.state.dataUpdatedAt < state.dataUpdatedAt) {
                // omit fetchStatus from dehydrated state
                // so that query stays in its current fetchStatus
                const { fetchStatus: _ignored, ...dehydratedQueryState } = state;
                query.setState(dehydratedQueryState);
            }
            return;
        }
        // Restore query
        queryCache.build(client, {
            ...options?.defaultOptions?.queries,
            queryKey,
            queryHash,
            meta,
        }, 
        // Reset fetch status to idle to avoid
        // query being stuck in fetching state upon hydration
        {
            ...state,
            fetchStatus: 'idle',
        });
    });
}

;// CONCATENATED MODULE: ./packages/query-core/src/index.ts
/* istanbul ignore file */














// Types



/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=ReactQueryCore.js.map