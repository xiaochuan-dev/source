(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["zustand"] = factory(require("React"));
	else
		root["zustand"] = factory(root["React"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__883__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 63:
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
var e=__webpack_require__(883);function h(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var k="function"===typeof Object.is?Object.is:h,l=e.useState,m=e.useEffect,n=e.useLayoutEffect,p=e.useDebugValue;function q(a,b){var d=b(),f=l({inst:{value:d,getSnapshot:b}}),c=f[0].inst,g=f[1];n(function(){c.value=d;c.getSnapshot=b;r(c)&&g({inst:c})},[a,d,b]);m(function(){r(c)&&g({inst:c});return a(function(){r(c)&&g({inst:c})})},[a]);p(d);return d}
function r(a){var b=a.getSnapshot;a=a.value;try{var d=b();return!k(a,d)}catch(f){return!0}}function t(a,b){return b()}var u="undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement?t:q;exports.useSyncExternalStore=void 0!==e.useSyncExternalStore?e.useSyncExternalStore:u;


/***/ }),

/***/ 940:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var h=__webpack_require__(883),n=__webpack_require__(888);function p(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var q="function"===typeof Object.is?Object.is:p,r=n.useSyncExternalStore,t=h.useRef,u=h.useEffect,v=h.useMemo,w=h.useDebugValue;
exports.useSyncExternalStoreWithSelector=function(a,b,e,l,g){var c=t(null);if(null===c.current){var f={hasValue:!1,value:null};c.current=f}else f=c.current;c=v(function(){function a(a){if(!c){c=!0;d=a;a=l(a);if(void 0!==g&&f.hasValue){var b=f.value;if(g(b,a))return k=b}return k=a}b=k;if(q(d,a))return b;var e=l(a);if(void 0!==g&&g(b,e))return b;d=a;return k=e}var c=!1,d,k,m=void 0===e?null:e;return[function(){return a(b())},null===m?void 0:function(){return a(m())}]},[b,e,l,g]);var d=r(a,c[0],c[1]);
u(function(){f.hasValue=!0;f.value=d},[d]);w(d);return d};


/***/ }),

/***/ 888:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



if (true) {
  module.exports = __webpack_require__(63);
} else {}


/***/ }),

/***/ 242:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



if (true) {
  module.exports = __webpack_require__(940);
} else {}


/***/ }),

/***/ 883:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__883__;

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
  combine: () => (/* reexport */ combine),
  create: () => (/* reexport */ create),
  createJSONStorage: () => (/* reexport */ createJSONStorage),
  createStore: () => (/* reexport */ createStore),
  "default": () => (/* reexport */ react),
  devtools: () => (/* reexport */ devtools),
  persist: () => (/* reexport */ persist),
  redux: () => (/* reexport */ redux),
  subscribeWithSelector: () => (/* reexport */ subscribeWithSelector),
  useStore: () => (/* reexport */ useStore)
});

;// CONCATENATED MODULE: ./src/vanilla.ts
const createStoreImpl = (createState) => {
    let state;
    const listeners = new Set();
    const setState = (partial, replace) => {
        // TODO: Remove type assertion once https://github.com/microsoft/TypeScript/issues/37663 is resolved
        // https://github.com/microsoft/TypeScript/issues/37663#issuecomment-759728342
        const nextState = typeof partial === 'function'
            ? partial(state)
            : partial;
        if (!Object.is(nextState, state)) {
            const previousState = state;
            state =
                (replace ?? (typeof nextState !== 'object' || nextState === null))
                    ? nextState
                    : Object.assign({}, state, nextState);
            listeners.forEach((listener) => listener(state, previousState));
        }
    };
    const getState = () => state;
    const getInitialState = () => initialState;
    const subscribe = (listener) => {
        listeners.add(listener);
        // Unsubscribe
        return () => listeners.delete(listener);
    };
    const destroy = () => {
        if (true) {
            console.warn('[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected.');
        }
        listeners.clear();
    };
    const api = { setState, getState, getInitialState, subscribe, destroy };
    const initialState = (state = createState(setState, getState, api));
    return api;
};
const createStore = ((createState) => createState ? createStoreImpl(createState) : createStoreImpl);
/**
 * @deprecated Use `import { createStore } from 'zustand/vanilla'`
 */
/* harmony default export */ const vanilla = ((createState) => {
    if (true) {
        console.warn("[DEPRECATED] Default export is deprecated. Instead use import { createStore } from 'zustand/vanilla'.");
    }
    return createStore(createState);
});

// EXTERNAL MODULE: external "React"
var external_React_ = __webpack_require__(883);
var external_React_default = /*#__PURE__*/__webpack_require__.n(external_React_);
// EXTERNAL MODULE: ./node_modules/use-sync-external-store/shim/with-selector.js
var with_selector = __webpack_require__(242);
;// CONCATENATED MODULE: ./src/react.ts
// import { useDebugValue } from 'react'
// import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector'
// Those don't work in ESM, because React libs are CJS only.
// See: https://github.com/pmndrs/valtio/issues/452
// The following is a workaround until ESM is supported.
// eslint-disable-next-line import/extensions

// eslint-disable-next-line import/extensions


const { useDebugValue } = (external_React_default());
const { useSyncExternalStoreWithSelector } = with_selector;
let didWarnAboutEqualityFn = false;
const identity = (arg) => arg;
function useStore(api, selector = identity, equalityFn) {
    if ( true &&
        equalityFn &&
        !didWarnAboutEqualityFn) {
        console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937");
        didWarnAboutEqualityFn = true;
    }
    const slice = useSyncExternalStoreWithSelector(api.subscribe, api.getState, api.getServerState || api.getInitialState, selector, equalityFn);
    useDebugValue(slice);
    return slice;
}
const createImpl = (createState) => {
    if ( true &&
        typeof createState !== 'function') {
        console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");
    }
    const api = typeof createState === 'function' ? createStore(createState) : createState;
    const useBoundStore = (selector, equalityFn) => useStore(api, selector, equalityFn);
    Object.assign(useBoundStore, api);
    return useBoundStore;
};
const create = ((createState) => createState ? createImpl(createState) : createImpl);
/**
 * @deprecated Use `import { create } from 'zustand'`
 */
/* harmony default export */ const react = ((createState) => {
    if (true) {
        console.warn("[DEPRECATED] Default export is deprecated. Instead use `import { create } from 'zustand'`.");
    }
    return create(createState);
});

;// CONCATENATED MODULE: ./src/middleware/redux.ts
const reduxImpl = (reducer, initial) => (set, _get, api) => {
    api.dispatch = (action) => {
        ;
        set((state) => reducer(state, action), false, action);
        return action;
    };
    api.dispatchFromDevtools = true;
    return { dispatch: (...a) => api.dispatch(...a), ...initial };
};
const redux = reduxImpl;

;// CONCATENATED MODULE: ./src/middleware/devtools.ts
const trackedConnections = new Map();
const getTrackedConnectionState = (name) => {
    const api = trackedConnections.get(name);
    if (!api)
        return {};
    return Object.fromEntries(Object.entries(api.stores).map(([key, api]) => [key, api.getState()]));
};
const extractConnectionInformation = (store, extensionConnector, options) => {
    if (store === undefined) {
        return {
            type: 'untracked',
            connection: extensionConnector.connect(options),
        };
    }
    const existingConnection = trackedConnections.get(options.name);
    if (existingConnection) {
        return { type: 'tracked', store, ...existingConnection };
    }
    const newConnection = {
        connection: extensionConnector.connect(options),
        stores: {},
    };
    trackedConnections.set(options.name, newConnection);
    return { type: 'tracked', store, ...newConnection };
};
const devtoolsImpl = (fn, devtoolsOptions = {}) => (set, get, api) => {
    const { enabled, anonymousActionType, store, ...options } = devtoolsOptions;
    let extensionConnector;
    try {
        extensionConnector =
            (enabled ??  undefined !== 'production') &&
                window.__REDUX_DEVTOOLS_EXTENSION__;
    }
    catch (e) {
        // ignored
    }
    if (!extensionConnector) {
        if ( true && enabled) {
            console.warn('[zustand devtools middleware] Please install/enable Redux devtools extension');
        }
        return fn(set, get, api);
    }
    const { connection, ...connectionInformation } = extractConnectionInformation(store, extensionConnector, options);
    let isRecording = true;
    api.setState = (state, replace, nameOrAction) => {
        const r = set(state, replace);
        if (!isRecording)
            return r;
        const action = nameOrAction === undefined
            ? { type: anonymousActionType || 'anonymous' }
            : typeof nameOrAction === 'string'
                ? { type: nameOrAction }
                : nameOrAction;
        if (store === undefined) {
            connection?.send(action, get());
            return r;
        }
        connection?.send({
            ...action,
            type: `${store}/${action.type}`,
        }, {
            ...getTrackedConnectionState(options.name),
            [store]: api.getState(),
        });
        return r;
    };
    const setStateFromDevtools = (...a) => {
        const originalIsRecording = isRecording;
        isRecording = false;
        set(...a);
        isRecording = originalIsRecording;
    };
    const initialState = fn(api.setState, get, api);
    if (connectionInformation.type === 'untracked') {
        connection?.init(initialState);
    }
    else {
        connectionInformation.stores[connectionInformation.store] = api;
        connection?.init(Object.fromEntries(Object.entries(connectionInformation.stores).map(([key, store]) => [
            key,
            key === connectionInformation.store
                ? initialState
                : store.getState(),
        ])));
    }
    if (api.dispatchFromDevtools &&
        typeof api.dispatch === 'function') {
        let didWarnAboutReservedActionType = false;
        const originalDispatch = api.dispatch;
        api.dispatch = (...a) => {
            if ( true &&
                a[0].type === '__setState' &&
                !didWarnAboutReservedActionType) {
                console.warn('[zustand devtools middleware] "__setState" action type is reserved ' +
                    'to set state from the devtools. Avoid using it.');
                didWarnAboutReservedActionType = true;
            }
            ;
            originalDispatch(...a);
        };
    }
    ;
    connection.subscribe((message) => {
        switch (message.type) {
            case 'ACTION':
                if (typeof message.payload !== 'string') {
                    console.error('[zustand devtools middleware] Unsupported action format');
                    return;
                }
                return parseJsonThen(message.payload, (action) => {
                    if (action.type === '__setState') {
                        if (store === undefined) {
                            setStateFromDevtools(action.state);
                            return;
                        }
                        if (Object.keys(action.state).length !== 1) {
                            console.error(`
                    [zustand devtools middleware] Unsupported __setState action format. 
                    When using 'store' option in devtools(), the 'state' should have only one key, which is a value of 'store' that was passed in devtools(),
                    and value of this only key should be a state object. Example: { "type": "__setState", "state": { "abc123Store": { "foo": "bar" } } }
                    `);
                        }
                        const stateFromDevtools = action.state[store];
                        if (stateFromDevtools === undefined ||
                            stateFromDevtools === null) {
                            return;
                        }
                        if (JSON.stringify(api.getState()) !==
                            JSON.stringify(stateFromDevtools)) {
                            setStateFromDevtools(stateFromDevtools);
                        }
                        return;
                    }
                    if (!api.dispatchFromDevtools)
                        return;
                    if (typeof api.dispatch !== 'function')
                        return;
                    api.dispatch(action);
                });
            case 'DISPATCH':
                switch (message.payload.type) {
                    case 'RESET':
                        setStateFromDevtools(initialState);
                        if (store === undefined) {
                            return connection?.init(api.getState());
                        }
                        return connection?.init(getTrackedConnectionState(options.name));
                    case 'COMMIT':
                        if (store === undefined) {
                            connection?.init(api.getState());
                            return;
                        }
                        return connection?.init(getTrackedConnectionState(options.name));
                    case 'ROLLBACK':
                        return parseJsonThen(message.state, (state) => {
                            if (store === undefined) {
                                setStateFromDevtools(state);
                                connection?.init(api.getState());
                                return;
                            }
                            setStateFromDevtools(state[store]);
                            connection?.init(getTrackedConnectionState(options.name));
                        });
                    case 'JUMP_TO_STATE':
                    case 'JUMP_TO_ACTION':
                        return parseJsonThen(message.state, (state) => {
                            if (store === undefined) {
                                setStateFromDevtools(state);
                                return;
                            }
                            if (JSON.stringify(api.getState()) !==
                                JSON.stringify(state[store])) {
                                setStateFromDevtools(state[store]);
                            }
                        });
                    case 'IMPORT_STATE': {
                        const { nextLiftedState } = message.payload;
                        const lastComputedState = nextLiftedState.computedStates.slice(-1)[0]?.state;
                        if (!lastComputedState)
                            return;
                        if (store === undefined) {
                            setStateFromDevtools(lastComputedState);
                        }
                        else {
                            setStateFromDevtools(lastComputedState[store]);
                        }
                        connection?.send(null, // FIXME no-any
                        nextLiftedState);
                        return;
                    }
                    case 'PAUSE_RECORDING':
                        return (isRecording = !isRecording);
                }
                return;
        }
    });
    return initialState;
};
const devtools = devtoolsImpl;
const parseJsonThen = (stringified, f) => {
    let parsed;
    try {
        parsed = JSON.parse(stringified);
    }
    catch (e) {
        console.error('[zustand devtools middleware] Could not parse the received json', e);
    }
    if (parsed !== undefined)
        f(parsed);
};

;// CONCATENATED MODULE: ./src/middleware/subscribeWithSelector.ts
const subscribeWithSelectorImpl = (fn) => (set, get, api) => {
    const origSubscribe = api.subscribe;
    api.subscribe = ((selector, optListener, options) => {
        let listener = selector; // if no selector
        if (optListener) {
            const equalityFn = options?.equalityFn || Object.is;
            let currentSlice = selector(api.getState());
            listener = (state) => {
                const nextSlice = selector(state);
                if (!equalityFn(currentSlice, nextSlice)) {
                    const previousSlice = currentSlice;
                    optListener((currentSlice = nextSlice), previousSlice);
                }
            };
            if (options?.fireImmediately) {
                optListener(currentSlice, currentSlice);
            }
        }
        return origSubscribe(listener);
    });
    const initialState = fn(set, get, api);
    return initialState;
};
const subscribeWithSelector = subscribeWithSelectorImpl;

;// CONCATENATED MODULE: ./src/middleware/combine.ts
const combine = (initialState, create) => (...a) => Object.assign({}, initialState, create(...a));

;// CONCATENATED MODULE: ./src/middleware/persist.ts
function createJSONStorage(getStorage, options) {
    let storage;
    try {
        storage = getStorage();
    }
    catch (e) {
        // prevent error if the storage is not defined (e.g. when server side rendering a page)
        return;
    }
    const persistStorage = {
        getItem: (name) => {
            const parse = (str) => {
                if (str === null) {
                    return null;
                }
                return JSON.parse(str, options?.reviver);
            };
            const str = storage.getItem(name) ?? null;
            if (str instanceof Promise) {
                return str.then(parse);
            }
            return parse(str);
        },
        setItem: (name, newValue) => storage.setItem(name, JSON.stringify(newValue, options?.replacer)),
        removeItem: (name) => storage.removeItem(name),
    };
    return persistStorage;
}
const toThenable = (fn) => (input) => {
    try {
        const result = fn(input);
        if (result instanceof Promise) {
            return result;
        }
        return {
            then(onFulfilled) {
                return toThenable(onFulfilled)(result);
            },
            catch(_onRejected) {
                return this;
            },
        };
    }
    catch (e) {
        return {
            then(_onFulfilled) {
                return this;
            },
            catch(onRejected) {
                return toThenable(onRejected)(e);
            },
        };
    }
};
const oldImpl = (config, baseOptions) => (set, get, api) => {
    let options = {
        getStorage: () => localStorage,
        serialize: JSON.stringify,
        deserialize: JSON.parse,
        partialize: (state) => state,
        version: 0,
        merge: (persistedState, currentState) => ({
            ...currentState,
            ...persistedState,
        }),
        ...baseOptions,
    };
    let hasHydrated = false;
    const hydrationListeners = new Set();
    const finishHydrationListeners = new Set();
    let storage;
    try {
        storage = options.getStorage();
    }
    catch (e) {
        // prevent error if the storage is not defined (e.g. when server side rendering a page)
    }
    if (!storage) {
        return config((...args) => {
            console.warn(`[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`);
            set(...args);
        }, get, api);
    }
    const thenableSerialize = toThenable(options.serialize);
    const setItem = () => {
        const state = options.partialize({ ...get() });
        let errorInSync;
        const thenable = thenableSerialize({ state, version: options.version })
            .then((serializedValue) => storage.setItem(options.name, serializedValue))
            .catch((e) => {
            errorInSync = e;
        });
        if (errorInSync) {
            throw errorInSync;
        }
        return thenable;
    };
    const savedSetState = api.setState;
    api.setState = (state, replace) => {
        savedSetState(state, replace);
        void setItem();
    };
    const configResult = config((...args) => {
        set(...args);
        void setItem();
    }, get, api);
    // a workaround to solve the issue of not storing rehydrated state in sync storage
    // the set(state) value would be later overridden with initial state by create()
    // to avoid this, we merge the state from localStorage into the initial state.
    let stateFromStorage;
    // rehydrate initial state with existing stored state
    const hydrate = () => {
        if (!storage)
            return;
        hasHydrated = false;
        hydrationListeners.forEach((cb) => cb(get()));
        const postRehydrationCallback = options.onRehydrateStorage?.(get()) || undefined;
        // bind is used to avoid `TypeError: Illegal invocation` error
        return toThenable(storage.getItem.bind(storage))(options.name)
            .then((storageValue) => {
            if (storageValue) {
                return options.deserialize(storageValue);
            }
        })
            .then((deserializedStorageValue) => {
            if (deserializedStorageValue) {
                if (typeof deserializedStorageValue.version === 'number' &&
                    deserializedStorageValue.version !== options.version) {
                    if (options.migrate) {
                        return options.migrate(deserializedStorageValue.state, deserializedStorageValue.version);
                    }
                    console.error(`State loaded from storage couldn't be migrated since no migrate function was provided`);
                }
                else {
                    return deserializedStorageValue.state;
                }
            }
        })
            .then((migratedState) => {
            stateFromStorage = options.merge(migratedState, get() ?? configResult);
            set(stateFromStorage, true);
            return setItem();
        })
            .then(() => {
            postRehydrationCallback?.(stateFromStorage, undefined);
            hasHydrated = true;
            finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
        })
            .catch((e) => {
            postRehydrationCallback?.(undefined, e);
        });
    };
    api.persist = {
        setOptions: (newOptions) => {
            options = {
                ...options,
                ...newOptions,
            };
            if (newOptions.getStorage) {
                storage = newOptions.getStorage();
            }
        },
        clearStorage: () => {
            storage?.removeItem(options.name);
        },
        getOptions: () => options,
        rehydrate: () => hydrate(),
        hasHydrated: () => hasHydrated,
        onHydrate: (cb) => {
            hydrationListeners.add(cb);
            return () => {
                hydrationListeners.delete(cb);
            };
        },
        onFinishHydration: (cb) => {
            finishHydrationListeners.add(cb);
            return () => {
                finishHydrationListeners.delete(cb);
            };
        },
    };
    hydrate();
    return stateFromStorage || configResult;
};
const newImpl = (config, baseOptions) => (set, get, api) => {
    let options = {
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => state,
        version: 0,
        merge: (persistedState, currentState) => ({
            ...currentState,
            ...persistedState,
        }),
        ...baseOptions,
    };
    let hasHydrated = false;
    const hydrationListeners = new Set();
    const finishHydrationListeners = new Set();
    let storage = options.storage;
    if (!storage) {
        return config((...args) => {
            console.warn(`[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`);
            set(...args);
        }, get, api);
    }
    const setItem = () => {
        const state = options.partialize({ ...get() });
        return storage.setItem(options.name, {
            state,
            version: options.version,
        });
    };
    const savedSetState = api.setState;
    api.setState = (state, replace) => {
        savedSetState(state, replace);
        void setItem();
    };
    const configResult = config((...args) => {
        set(...args);
        void setItem();
    }, get, api);
    api.getInitialState = () => configResult;
    // a workaround to solve the issue of not storing rehydrated state in sync storage
    // the set(state) value would be later overridden with initial state by create()
    // to avoid this, we merge the state from localStorage into the initial state.
    let stateFromStorage;
    // rehydrate initial state with existing stored state
    const hydrate = () => {
        if (!storage)
            return;
        // On the first invocation of 'hydrate', state will not yet be defined (this is
        // true for both the 'asynchronous' and 'synchronous' case). Pass 'configResult'
        // as a backup  to 'get()' so listeners and 'onRehydrateStorage' are called with
        // the latest available state.
        hasHydrated = false;
        hydrationListeners.forEach((cb) => cb(get() ?? configResult));
        const postRehydrationCallback = options.onRehydrateStorage?.(get() ?? configResult) || undefined;
        // bind is used to avoid `TypeError: Illegal invocation` error
        return toThenable(storage.getItem.bind(storage))(options.name)
            .then((deserializedStorageValue) => {
            if (deserializedStorageValue) {
                if (typeof deserializedStorageValue.version === 'number' &&
                    deserializedStorageValue.version !== options.version) {
                    if (options.migrate) {
                        return options.migrate(deserializedStorageValue.state, deserializedStorageValue.version);
                    }
                    console.error(`State loaded from storage couldn't be migrated since no migrate function was provided`);
                }
                else {
                    return deserializedStorageValue.state;
                }
            }
        })
            .then((migratedState) => {
            stateFromStorage = options.merge(migratedState, get() ?? configResult);
            set(stateFromStorage, true);
            return setItem();
        })
            .then(() => {
            // TODO: In the asynchronous case, it's possible that the state has changed
            // since it was set in the prior callback. As such, it would be better to
            // pass 'get()' to the 'postRehydrationCallback' to ensure the most up-to-date
            // state is used. However, this could be a breaking change, so this isn't being
            // done now.
            postRehydrationCallback?.(stateFromStorage, undefined);
            // It's possible that 'postRehydrationCallback' updated the state. To ensure
            // that isn't overwritten when returning 'stateFromStorage' below
            // (synchronous-case only), update 'stateFromStorage' to point to the latest
            // state. In the asynchronous case, 'stateFromStorage' isn't used after this
            // callback, so there's no harm in updating it to match the latest state.
            stateFromStorage = get();
            hasHydrated = true;
            finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
        })
            .catch((e) => {
            postRehydrationCallback?.(undefined, e);
        });
    };
    api.persist = {
        setOptions: (newOptions) => {
            options = {
                ...options,
                ...newOptions,
            };
            if (newOptions.storage) {
                storage = newOptions.storage;
            }
        },
        clearStorage: () => {
            storage?.removeItem(options.name);
        },
        getOptions: () => options,
        rehydrate: () => hydrate(),
        hasHydrated: () => hasHydrated,
        onHydrate: (cb) => {
            hydrationListeners.add(cb);
            return () => {
                hydrationListeners.delete(cb);
            };
        },
        onFinishHydration: (cb) => {
            finishHydrationListeners.add(cb);
            return () => {
                finishHydrationListeners.delete(cb);
            };
        },
    };
    if (!options.skipHydration) {
        hydrate();
    }
    return stateFromStorage || configResult;
};
const persistImpl = (config, baseOptions) => {
    if ('getStorage' in baseOptions ||
        'serialize' in baseOptions ||
        'deserialize' in baseOptions) {
        if (true) {
            console.warn('[DEPRECATED] `getStorage`, `serialize` and `deserialize` options are deprecated. Use `storage` option instead.');
        }
        return oldImpl(config, baseOptions);
    }
    return newImpl(config, baseOptions);
};
const persist = persistImpl;

;// CONCATENATED MODULE: ./src/middleware.ts






;// CONCATENATED MODULE: ./src/index.ts





})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map