(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("ReactQueryCore"), require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["ReactQueryCore", "React"], factory);
	else if(typeof exports === 'object')
		exports["ReactQuery"] = factory(require("ReactQueryCore"), require("React"));
	else
		root["ReactQuery"] = factory(root["ReactQueryCore"], root["React"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__296__, __WEBPACK_EXTERNAL_MODULE__24__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 979:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   R: () => (/* binding */ HydrationBoundary)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(296);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _QueryClientProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(658);
'use client';



const HydrationBoundary = ({ children, options = {}, state, queryClient, }) => {
    const client = (0,_QueryClientProvider__WEBPACK_IMPORTED_MODULE_2__/* .useQueryClient */ .NL)(queryClient);
    const [hydrationQueue, setHydrationQueue] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
    const optionsRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(options);
    optionsRef.current = options;
    // This useMemo is for performance reasons only, everything inside it _must_
    // be safe to run in every render and code here should be read as "in render".
    //
    // This code needs to happen during the render phase, because after initial
    // SSR, hydration needs to happen _before_ children render. Also, if hydrating
    // during a transition, we want to hydrate as much as is safe in render so
    // we can prerender as much as possible.
    //
    // For any queries that already exist in the cache, we want to hold back on
    // hydrating until _after_ the render phase. The reason for this is that during
    // transitions, we don't want the existing queries and observers to update to
    // the new data on the current page, only _after_ the transition is committed.
    // If the transition is aborted, we will have hydrated any _new_ queries, but
    // we throw away the fresh data for any existing ones to avoid unexpectedly
    // updating the UI.
    react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
        if (state) {
            if (typeof state !== 'object') {
                return;
            }
            const queryCache = client.getQueryCache();
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            const queries = state.queries || [];
            const newQueries = [];
            const existingQueries = [];
            for (const dehydratedQuery of queries) {
                const existingQuery = queryCache.get(dehydratedQuery.queryHash);
                if (!existingQuery) {
                    newQueries.push(dehydratedQuery);
                }
                else {
                    const hydrationIsNewer = dehydratedQuery.state.dataUpdatedAt >
                        existingQuery.state.dataUpdatedAt;
                    const queryAlreadyQueued = hydrationQueue?.find((query) => query.queryHash === dehydratedQuery.queryHash);
                    if (hydrationIsNewer &&
                        (!queryAlreadyQueued ||
                            dehydratedQuery.state.dataUpdatedAt >
                                queryAlreadyQueued.state.dataUpdatedAt)) {
                        existingQueries.push(dehydratedQuery);
                    }
                }
            }
            if (newQueries.length > 0) {
                // It's actually fine to call this with queries/state that already exists
                // in the cache, or is older. hydrate() is idempotent for queries.
                (0,_tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__.hydrate)(client, { queries: newQueries }, optionsRef.current);
            }
            if (existingQueries.length > 0) {
                setHydrationQueue((prev) => prev ? [...prev, ...existingQueries] : existingQueries);
            }
        }
    }, [client, hydrationQueue, state]);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
        if (hydrationQueue) {
            (0,_tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__.hydrate)(client, { queries: hydrationQueue }, optionsRef.current);
            setHydrationQueue(undefined);
        }
    }, [client, hydrationQueue]);
    return children;
};


/***/ }),

/***/ 658:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NL: () => (/* binding */ useQueryClient),
/* harmony export */   aH: () => (/* binding */ QueryClientProvider),
/* harmony export */   ay: () => (/* binding */ QueryClientContext)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
'use client';

const QueryClientContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(undefined);
const useQueryClient = (queryClient) => {
    const client = react__WEBPACK_IMPORTED_MODULE_0__.useContext(QueryClientContext);
    if (queryClient) {
        return queryClient;
    }
    if (!client) {
        throw new Error('No QueryClient set, use QueryClientProvider to set one');
    }
    return client;
};
const QueryClientProvider = ({ client, children, }) => {
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
        client.mount();
        return () => {
            client.unmount();
        };
    }, [client]);
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(QueryClientContext.Provider, { value: client }, children));
};


/***/ }),

/***/ 260:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: () => (/* binding */ useQueryErrorResetBoundary),
/* harmony export */   k: () => (/* binding */ QueryErrorResetBoundary)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
'use client';

function createValue() {
    let isReset = false;
    return {
        clearReset: () => {
            isReset = false;
        },
        reset: () => {
            isReset = true;
        },
        isReset: () => {
            return isReset;
        },
    };
}
const QueryErrorResetBoundaryContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(createValue());
// HOOK
const useQueryErrorResetBoundary = () => react__WEBPACK_IMPORTED_MODULE_0__.useContext(QueryErrorResetBoundaryContext);
const QueryErrorResetBoundary = ({ children, }) => {
    const [value] = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => createValue());
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(QueryErrorResetBoundaryContext.Provider, { value: value }, typeof children === 'function'
        ? children(value)
        : children));
};


/***/ }),

/***/ 360:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JN: () => (/* binding */ useClearResetErrorBoundary),
/* harmony export */   KJ: () => (/* binding */ getHasError),
/* harmony export */   pf: () => (/* binding */ ensurePreventErrorBoundaryRetry)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(850);
'use client';


const ensurePreventErrorBoundaryRetry = (options, errorResetBoundary) => {
    if (options.suspense || options.throwOnError) {
        // Prevent retrying failed query if the error boundary has not been reset yet
        if (!errorResetBoundary.isReset()) {
            options.retryOnMount = false;
        }
    }
};
const useClearResetErrorBoundary = (errorResetBoundary) => {
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
        errorResetBoundary.clearReset();
    }, [errorResetBoundary]);
};
const getHasError = ({ result, errorResetBoundary, throwOnError, query, }) => {
    return (result.isError &&
        !errorResetBoundary.isReset() &&
        !result.isFetching &&
        query &&
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .shouldThrowError */ .L)(throwOnError, [result.error, query]));
};


/***/ }),

/***/ 746:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   t: () => (/* binding */ infiniteQueryOptions)
/* harmony export */ });
function infiniteQueryOptions(options) {
    return options;
}


/***/ }),

/***/ 276:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ useIsRestoring),
/* harmony export */   u: () => (/* binding */ IsRestoringProvider)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
'use client';

const IsRestoringContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(false);
const useIsRestoring = () => react__WEBPACK_IMPORTED_MODULE_0__.useContext(IsRestoringContext);
const IsRestoringProvider = IsRestoringContext.Provider;


/***/ }),

/***/ 407:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ queryOptions)
/* harmony export */ });
function queryOptions(options) {
    return options;
}


/***/ }),

/***/ 196:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ct: () => (/* binding */ defaultThrowOnError),
/* harmony export */   Fb: () => (/* binding */ ensureStaleTime),
/* harmony export */   SB: () => (/* binding */ shouldSuspend),
/* harmony export */   Z$: () => (/* binding */ willFetch),
/* harmony export */   j8: () => (/* binding */ fetchOptimistic)
/* harmony export */ });
const defaultThrowOnError = (_error, query) => typeof query.state.data === 'undefined';
const ensureStaleTime = (defaultedOptions) => {
    if (defaultedOptions.suspense) {
        // Always set stale time when using suspense to prevent
        // fetching again when directly mounting after suspending
        if (typeof defaultedOptions.staleTime !== 'number') {
            defaultedOptions.staleTime = 1000;
        }
    }
};
const willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
const shouldSuspend = (defaultedOptions, result) => defaultedOptions?.suspense && result.isPending;
const fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
    errorResetBoundary.clearReset();
});


/***/ }),

/***/ 833:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   r: () => (/* binding */ useBaseQuery)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(296);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _QueryErrorResetBoundary__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(260);
/* harmony import */ var _QueryClientProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(658);
/* harmony import */ var _isRestoring__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(276);
/* harmony import */ var _errorBoundaryUtils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(360);
/* harmony import */ var _suspense__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(196);
'use client';







function useBaseQuery(options, Observer, queryClient) {
    if (false) {}
    const client = (0,_QueryClientProvider__WEBPACK_IMPORTED_MODULE_2__/* .useQueryClient */ .NL)(queryClient);
    const isRestoring = (0,_isRestoring__WEBPACK_IMPORTED_MODULE_3__/* .useIsRestoring */ .S)();
    const errorResetBoundary = (0,_QueryErrorResetBoundary__WEBPACK_IMPORTED_MODULE_4__/* .useQueryErrorResetBoundary */ ._)();
    const defaultedOptions = client.defaultQueryOptions(options);
    // Make sure results are optimistically set in fetching state before subscribing or updating options
    defaultedOptions._optimisticResults = isRestoring
        ? 'isRestoring'
        : 'optimistic';
    (0,_suspense__WEBPACK_IMPORTED_MODULE_5__/* .ensureStaleTime */ .Fb)(defaultedOptions);
    (0,_errorBoundaryUtils__WEBPACK_IMPORTED_MODULE_6__/* .ensurePreventErrorBoundaryRetry */ .pf)(defaultedOptions, errorResetBoundary);
    (0,_errorBoundaryUtils__WEBPACK_IMPORTED_MODULE_6__/* .useClearResetErrorBoundary */ .JN)(errorResetBoundary);
    const [observer] = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => new Observer(client, defaultedOptions));
    const result = observer.getOptimisticResult(defaultedOptions);
    react__WEBPACK_IMPORTED_MODULE_0__.useSyncExternalStore(react__WEBPACK_IMPORTED_MODULE_0__.useCallback((onStoreChange) => {
        const unsubscribe = isRestoring
            ? () => undefined
            : observer.subscribe(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__.notifyManager.batchCalls(onStoreChange));
        // Update result to make sure we did not miss any query updates
        // between creating the observer and subscribing to it.
        observer.updateResult();
        return unsubscribe;
    }, [observer, isRestoring]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
        // Do not notify on updates because of changes in the options because
        // these changes should already be reflected in the optimistic result.
        observer.setOptions(defaultedOptions, { listeners: false });
    }, [defaultedOptions, observer]);
    // Handle suspense
    if ((0,_suspense__WEBPACK_IMPORTED_MODULE_5__/* .shouldSuspend */ .SB)(defaultedOptions, result)) {
        // Do the same thing as the effect right above because the effect won't run
        // when we suspend but also, the component won't re-mount so our observer would
        // be out of date.
        throw (0,_suspense__WEBPACK_IMPORTED_MODULE_5__/* .fetchOptimistic */ .j8)(defaultedOptions, observer, errorResetBoundary);
    }
    // Handle error boundary
    if ((0,_errorBoundaryUtils__WEBPACK_IMPORTED_MODULE_6__/* .getHasError */ .KJ)({
        result,
        errorResetBoundary,
        throwOnError: defaultedOptions.throwOnError,
        query: client
            .getQueryCache()
            .get(defaultedOptions.queryHash),
    })) {
        throw result.error;
    }
    // Handle result property usage tracking
    return !defaultedOptions.notifyOnChangeProps
        ? observer.trackResult(result)
        : result;
}


/***/ }),

/***/ 155:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   N: () => (/* binding */ useInfiniteQuery)
/* harmony export */ });
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(296);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _useBaseQuery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(833);
'use client';


function useInfiniteQuery(options, queryClient) {
    return (0,_useBaseQuery__WEBPACK_IMPORTED_MODULE_1__/* .useBaseQuery */ .r)(options, 
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__.InfiniteQueryObserver, queryClient);
}


/***/ }),

/***/ 97:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   y: () => (/* binding */ useIsFetching)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(296);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _QueryClientProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(658);
'use client';



function useIsFetching(filters, queryClient) {
    const client = (0,_QueryClientProvider__WEBPACK_IMPORTED_MODULE_2__/* .useQueryClient */ .NL)(queryClient);
    const queryCache = client.getQueryCache();
    return react__WEBPACK_IMPORTED_MODULE_0__.useSyncExternalStore(react__WEBPACK_IMPORTED_MODULE_0__.useCallback((onStoreChange) => queryCache.subscribe(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__.notifyManager.batchCalls(onStoreChange)), [queryCache]), () => client.isFetching(filters), () => client.isFetching(filters));
}


/***/ }),

/***/ 315:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D: () => (/* binding */ useMutation)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(296);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _QueryClientProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(658);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(850);
'use client';




// HOOK
function useMutation(options, queryClient) {
    const client = (0,_QueryClientProvider__WEBPACK_IMPORTED_MODULE_2__/* .useQueryClient */ .NL)(queryClient);
    const [observer] = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => new _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__.MutationObserver(client, options));
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
        observer.setOptions(options);
    }, [observer, options]);
    const result = react__WEBPACK_IMPORTED_MODULE_0__.useSyncExternalStore(react__WEBPACK_IMPORTED_MODULE_0__.useCallback((onStoreChange) => observer.subscribe(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__.notifyManager.batchCalls(onStoreChange)), [observer]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
    const mutate = react__WEBPACK_IMPORTED_MODULE_0__.useCallback((variables, mutateOptions) => {
        observer.mutate(variables, mutateOptions).catch(noop);
    }, [observer]);
    if (result.error &&
        (0,_utils__WEBPACK_IMPORTED_MODULE_3__/* .shouldThrowError */ .L)(observer.options.throwOnError, [result.error])) {
        throw result.error;
    }
    return { ...result, mutate, mutateAsync: result.mutate };
}
// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() { }


/***/ }),

/***/ 173:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B: () => (/* binding */ useIsMutating),
/* harmony export */   S: () => (/* binding */ useMutationState)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(296);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _QueryClientProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(658);
'use client';



function useIsMutating(filters, queryClient) {
    const client = (0,_QueryClientProvider__WEBPACK_IMPORTED_MODULE_2__/* .useQueryClient */ .NL)(queryClient);
    return useMutationState({ filters: { ...filters, status: 'pending' } }, client).length;
}
function getResult(mutationCache, options) {
    return mutationCache
        .findAll(options.filters)
        .map((mutation) => (options.select
        ? options.select(mutation)
        : mutation.state));
}
function useMutationState(options = {}, queryClient) {
    const mutationCache = (0,_QueryClientProvider__WEBPACK_IMPORTED_MODULE_2__/* .useQueryClient */ .NL)(queryClient).getMutationCache();
    const optionsRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(options);
    const result = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
    if (!result.current) {
        result.current = getResult(mutationCache, options);
    }
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
        optionsRef.current = options;
    });
    return react__WEBPACK_IMPORTED_MODULE_0__.useSyncExternalStore(react__WEBPACK_IMPORTED_MODULE_0__.useCallback((onStoreChange) => mutationCache.subscribe(() => {
        const nextResult = (0,_tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__.replaceEqualDeep)(result.current, getResult(mutationCache, optionsRef.current));
        if (result.current !== nextResult) {
            result.current = nextResult;
            _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__.notifyManager.schedule(onStoreChange);
        }
    }), [mutationCache]), () => result.current, () => result.current);
}


/***/ }),

/***/ 178:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   h: () => (/* binding */ useQueries)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(296);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _QueryClientProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(658);
/* harmony import */ var _isRestoring__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(276);
/* harmony import */ var _QueryErrorResetBoundary__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(260);
/* harmony import */ var _errorBoundaryUtils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(360);
/* harmony import */ var _suspense__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(196);
'use client';







function useQueries({ queries, ...options }, queryClient) {
    const client = (0,_QueryClientProvider__WEBPACK_IMPORTED_MODULE_2__/* .useQueryClient */ .NL)(queryClient);
    const isRestoring = (0,_isRestoring__WEBPACK_IMPORTED_MODULE_3__/* .useIsRestoring */ .S)();
    const errorResetBoundary = (0,_QueryErrorResetBoundary__WEBPACK_IMPORTED_MODULE_4__/* .useQueryErrorResetBoundary */ ._)();
    const defaultedQueries = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => queries.map((opts) => {
        const defaultedOptions = client.defaultQueryOptions(opts);
        // Make sure the results are already in fetching state before subscribing or updating options
        defaultedOptions._optimisticResults = isRestoring
            ? 'isRestoring'
            : 'optimistic';
        return defaultedOptions;
    }), [queries, client, isRestoring]);
    defaultedQueries.forEach((query) => {
        (0,_suspense__WEBPACK_IMPORTED_MODULE_5__/* .ensureStaleTime */ .Fb)(query);
        (0,_errorBoundaryUtils__WEBPACK_IMPORTED_MODULE_6__/* .ensurePreventErrorBoundaryRetry */ .pf)(query, errorResetBoundary);
    });
    (0,_errorBoundaryUtils__WEBPACK_IMPORTED_MODULE_6__/* .useClearResetErrorBoundary */ .JN)(errorResetBoundary);
    const [observer] = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => new _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__.QueriesObserver(client, defaultedQueries, options));
    const [optimisticResult, getCombinedResult, trackResult] = observer.getOptimisticResult(defaultedQueries, options.combine);
    react__WEBPACK_IMPORTED_MODULE_0__.useSyncExternalStore(react__WEBPACK_IMPORTED_MODULE_0__.useCallback((onStoreChange) => isRestoring
        ? () => undefined
        : observer.subscribe(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__.notifyManager.batchCalls(onStoreChange)), [observer, isRestoring]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
        // Do not notify on updates because of changes in the options because
        // these changes should already be reflected in the optimistic result.
        observer.setQueries(defaultedQueries, options, {
            listeners: false,
        });
    }, [defaultedQueries, options, observer]);
    const shouldAtLeastOneSuspend = optimisticResult.some((result, index) => (0,_suspense__WEBPACK_IMPORTED_MODULE_5__/* .shouldSuspend */ .SB)(defaultedQueries[index], result));
    const suspensePromises = shouldAtLeastOneSuspend
        ? optimisticResult.flatMap((result, index) => {
            const opts = defaultedQueries[index];
            if (opts) {
                const queryObserver = new _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__.QueryObserver(client, opts);
                if ((0,_suspense__WEBPACK_IMPORTED_MODULE_5__/* .shouldSuspend */ .SB)(opts, result)) {
                    return (0,_suspense__WEBPACK_IMPORTED_MODULE_5__/* .fetchOptimistic */ .j8)(opts, queryObserver, errorResetBoundary);
                }
                else if ((0,_suspense__WEBPACK_IMPORTED_MODULE_5__/* .willFetch */ .Z$)(result, isRestoring)) {
                    void (0,_suspense__WEBPACK_IMPORTED_MODULE_5__/* .fetchOptimistic */ .j8)(opts, queryObserver, errorResetBoundary);
                }
            }
            return [];
        })
        : [];
    if (suspensePromises.length > 0) {
        throw Promise.all(suspensePromises);
    }
    const firstSingleResultWhichShouldThrow = optimisticResult.find((result, index) => {
        const query = defaultedQueries[index];
        return (query &&
            (0,_errorBoundaryUtils__WEBPACK_IMPORTED_MODULE_6__/* .getHasError */ .KJ)({
                result,
                errorResetBoundary,
                throwOnError: query.throwOnError,
                query: client.getQueryCache().get(query.queryHash),
            }));
    });
    if (firstSingleResultWhichShouldThrow?.error) {
        throw firstSingleResultWhichShouldThrow.error;
    }
    return getCombinedResult(trackResult());
}


/***/ }),

/***/ 399:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ useQuery)
/* harmony export */ });
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(296);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _useBaseQuery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(833);
'use client';


function useQuery(options, queryClient) {
    return (0,_useBaseQuery__WEBPACK_IMPORTED_MODULE_1__/* .useBaseQuery */ .r)(options, _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__.QueryObserver, queryClient);
}


/***/ }),

/***/ 874:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   j: () => (/* binding */ useSuspenseInfiniteQuery)
/* harmony export */ });
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(296);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _useBaseQuery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(833);
/* harmony import */ var _suspense__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(196);
'use client';



function useSuspenseInfiniteQuery(options, queryClient) {
    return (0,_useBaseQuery__WEBPACK_IMPORTED_MODULE_1__/* .useBaseQuery */ .r)({
        ...options,
        enabled: true,
        suspense: true,
        throwOnError: _suspense__WEBPACK_IMPORTED_MODULE_2__/* .defaultThrowOnError */ .Ct,
    }, 
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__.InfiniteQueryObserver, queryClient);
}


/***/ }),

/***/ 72:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   k: () => (/* binding */ useSuspenseQueries)
/* harmony export */ });
/* harmony import */ var _useQueries__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(178);
/* harmony import */ var _suspense__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(196);
'use client';


function useSuspenseQueries(options, queryClient) {
    return (0,_useQueries__WEBPACK_IMPORTED_MODULE_0__/* .useQueries */ .h)({
        ...options,
        queries: options.queries.map((query) => ({
            ...query,
            suspense: true,
            throwOnError: _suspense__WEBPACK_IMPORTED_MODULE_1__/* .defaultThrowOnError */ .Ct,
            enabled: true,
        })),
    }, queryClient);
}


/***/ }),

/***/ 246:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   k: () => (/* binding */ useSuspenseQuery)
/* harmony export */ });
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(296);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _useBaseQuery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(833);
/* harmony import */ var _suspense__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(196);
'use client';



function useSuspenseQuery(options, queryClient) {
    return (0,_useBaseQuery__WEBPACK_IMPORTED_MODULE_1__/* .useBaseQuery */ .r)({
        ...options,
        enabled: true,
        suspense: true,
        throwOnError: _suspense__WEBPACK_IMPORTED_MODULE_2__/* .defaultThrowOnError */ .Ct,
    }, _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__.QueryObserver, queryClient);
}


/***/ }),

/***/ 850:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   L: () => (/* binding */ shouldThrowError)
/* harmony export */ });
function shouldThrowError(throwError, params) {
    // Allow throwError function to override throwing behavior on a per-error basis
    if (typeof throwError === 'function') {
        return throwError(...params);
    }
    return !!throwError;
}


/***/ }),

/***/ 24:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__24__;

/***/ }),

/***/ 296:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__296__;

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
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HydrationBoundary: () => (/* reexport safe */ _HydrationBoundary__WEBPACK_IMPORTED_MODULE_9__.R),
/* harmony export */   IsRestoringProvider: () => (/* reexport safe */ _isRestoring__WEBPACK_IMPORTED_MODULE_15__.u),
/* harmony export */   QueryClientContext: () => (/* reexport safe */ _QueryClientProvider__WEBPACK_IMPORTED_MODULE_8__.ay),
/* harmony export */   QueryClientProvider: () => (/* reexport safe */ _QueryClientProvider__WEBPACK_IMPORTED_MODULE_8__.aH),
/* harmony export */   QueryErrorResetBoundary: () => (/* reexport safe */ _QueryErrorResetBoundary__WEBPACK_IMPORTED_MODULE_10__.k),
/* harmony export */   infiniteQueryOptions: () => (/* reexport safe */ _infiniteQueryOptions__WEBPACK_IMPORTED_MODULE_7__.t),
/* harmony export */   queryOptions: () => (/* reexport safe */ _queryOptions__WEBPACK_IMPORTED_MODULE_6__.C),
/* harmony export */   useInfiniteQuery: () => (/* reexport safe */ _useInfiniteQuery__WEBPACK_IMPORTED_MODULE_14__.N),
/* harmony export */   useIsFetching: () => (/* reexport safe */ _useIsFetching__WEBPACK_IMPORTED_MODULE_11__.y),
/* harmony export */   useIsMutating: () => (/* reexport safe */ _useMutationState__WEBPACK_IMPORTED_MODULE_12__.B),
/* harmony export */   useIsRestoring: () => (/* reexport safe */ _isRestoring__WEBPACK_IMPORTED_MODULE_15__.S),
/* harmony export */   useMutation: () => (/* reexport safe */ _useMutation__WEBPACK_IMPORTED_MODULE_13__.D),
/* harmony export */   useMutationState: () => (/* reexport safe */ _useMutationState__WEBPACK_IMPORTED_MODULE_12__.S),
/* harmony export */   useQueries: () => (/* reexport safe */ _useQueries__WEBPACK_IMPORTED_MODULE_1__.h),
/* harmony export */   useQuery: () => (/* reexport safe */ _useQuery__WEBPACK_IMPORTED_MODULE_2__.a),
/* harmony export */   useQueryClient: () => (/* reexport safe */ _QueryClientProvider__WEBPACK_IMPORTED_MODULE_8__.NL),
/* harmony export */   useQueryErrorResetBoundary: () => (/* reexport safe */ _QueryErrorResetBoundary__WEBPACK_IMPORTED_MODULE_10__._),
/* harmony export */   useSuspenseInfiniteQuery: () => (/* reexport safe */ _useSuspenseInfiniteQuery__WEBPACK_IMPORTED_MODULE_4__.j),
/* harmony export */   useSuspenseQueries: () => (/* reexport safe */ _useSuspenseQueries__WEBPACK_IMPORTED_MODULE_5__.k),
/* harmony export */   useSuspenseQuery: () => (/* reexport safe */ _useSuspenseQuery__WEBPACK_IMPORTED_MODULE_3__.k)
/* harmony export */ });
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(296);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__) if(["default","useQueries","useQuery","useSuspenseQuery","useSuspenseInfiniteQuery","useSuspenseQueries","queryOptions","infiniteQueryOptions","QueryClientContext","QueryClientProvider","useQueryClient","HydrationBoundary","QueryErrorResetBoundary","useQueryErrorResetBoundary","useIsFetching","useIsMutating","useMutationState","useMutation","useInfiniteQuery","useIsRestoring","IsRestoringProvider"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _useQueries__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(178);
/* harmony import */ var _useQuery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(399);
/* harmony import */ var _useSuspenseQuery__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(246);
/* harmony import */ var _useSuspenseInfiniteQuery__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(874);
/* harmony import */ var _useSuspenseQueries__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(72);
/* harmony import */ var _queryOptions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(407);
/* harmony import */ var _infiniteQueryOptions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(746);
/* harmony import */ var _QueryClientProvider__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(658);
/* harmony import */ var _HydrationBoundary__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(979);
/* harmony import */ var _QueryErrorResetBoundary__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(260);
/* harmony import */ var _useIsFetching__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(97);
/* harmony import */ var _useMutationState__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(173);
/* harmony import */ var _useMutation__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(315);
/* harmony import */ var _useInfiniteQuery__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(155);
/* harmony import */ var _isRestoring__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(276);
/* istanbul ignore file */
// Re-export core

// React Query

















})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=ReactQuery.js.map