(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = global || self, factory(global.ReactQuery = {}, global.React));
}(this, (function (exports, React) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;

  class Subscribable {
    constructor() {
      this.listeners = [];
    }

    subscribe(listener) {
      const callback = listener || (() => undefined);

      this.listeners.push(callback);
      this.onSubscribe();
      return () => {
        this.listeners = this.listeners.filter(x => x !== callback);
        this.onUnsubscribe();
      };
    }

    hasListeners() {
      return this.listeners.length > 0;
    }

    onSubscribe() {// Do nothing
    }

    onUnsubscribe() {// Do nothing
    }

  }

  // TYPES
  // UTILS
  const isServer = typeof window === 'undefined';
  function noop() {
    return undefined;
  }
  function functionalUpdate(updater, input) {
    return typeof updater === 'function' ? updater(input) : updater;
  }
  function isValidTimeout(value) {
    return typeof value === 'number' && value >= 0 && value !== Infinity;
  }
  function ensureQueryKeyArray(value) {
    return Array.isArray(value) ? value : [value];
  }
  function difference(array1, array2) {
    return array1.filter(x => array2.indexOf(x) === -1);
  }
  function replaceAt(array, index, value) {
    const copy = array.slice(0);
    copy[index] = value;
    return copy;
  }
  function timeUntilStale(updatedAt, staleTime) {
    return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
  }
  function parseQueryArgs(arg1, arg2, arg3) {
    if (!isQueryKey(arg1)) {
      return arg1;
    }

    if (typeof arg2 === 'function') {
      return { ...arg3,
        queryKey: arg1,
        queryFn: arg2
      };
    }

    return { ...arg2,
      queryKey: arg1
    };
  }
  function parseMutationArgs(arg1, arg2, arg3) {
    if (isQueryKey(arg1)) {
      if (typeof arg2 === 'function') {
        return { ...arg3,
          mutationKey: arg1,
          mutationFn: arg2
        };
      }

      return { ...arg2,
        mutationKey: arg1
      };
    }

    if (typeof arg1 === 'function') {
      return { ...arg2,
        mutationFn: arg1
      };
    }

    return { ...arg1
    };
  }
  function parseFilterArgs(arg1, arg2, arg3) {
    return isQueryKey(arg1) ? [{ ...arg2,
      queryKey: arg1
    }, arg3] : [arg1 || {}, arg2];
  }
  function parseMutationFilterArgs(arg1, arg2) {
    return isQueryKey(arg1) ? { ...arg2,
      mutationKey: arg1
    } : arg1;
  }
  function mapQueryStatusFilter(active, inactive) {
    if (active === true && inactive === true || active == null && inactive == null) {
      return 'all';
    } else if (active === false && inactive === false) {
      return 'none';
    } else {
      // At this point, active|inactive can only be true|false or false|true
      // so, when only one value is provided, the missing one has to be the negated value
      const isActive = active ?? !inactive;
      return isActive ? 'active' : 'inactive';
    }
  }
  function matchQuery(filters, query) {
    const {
      active,
      exact,
      fetching,
      inactive,
      predicate,
      queryKey,
      stale
    } = filters;

    if (isQueryKey(queryKey)) {
      if (exact) {
        if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
          return false;
        }
      } else if (!partialMatchKey(query.queryKey, queryKey)) {
        return false;
      }
    }

    const queryStatusFilter = mapQueryStatusFilter(active, inactive);

    if (queryStatusFilter === 'none') {
      return false;
    } else if (queryStatusFilter !== 'all') {
      const isActive = query.isActive();

      if (queryStatusFilter === 'active' && !isActive) {
        return false;
      }

      if (queryStatusFilter === 'inactive' && isActive) {
        return false;
      }
    }

    if (typeof stale === 'boolean' && query.isStale() !== stale) {
      return false;
    }

    if (typeof fetching === 'boolean' && query.isFetching() !== fetching) {
      return false;
    }

    if (predicate && !predicate(query)) {
      return false;
    }

    return true;
  }
  function matchMutation(filters, mutation) {
    const {
      exact,
      fetching,
      predicate,
      mutationKey
    } = filters;

    if (isQueryKey(mutationKey)) {
      if (!mutation.options.mutationKey) {
        return false;
      }

      if (exact) {
        if (hashQueryKey(mutation.options.mutationKey) !== hashQueryKey(mutationKey)) {
          return false;
        }
      } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
        return false;
      }
    }

    if (typeof fetching === 'boolean' && mutation.state.status === 'loading' !== fetching) {
      return false;
    }

    if (predicate && !predicate(mutation)) {
      return false;
    }

    return true;
  }
  function hashQueryKeyByOptions(queryKey, options) {
    const hashFn = options?.queryKeyHashFn || hashQueryKey;
    return hashFn(queryKey);
  }
  /**
   * Default query keys hash function.
   */

  function hashQueryKey(queryKey) {
    const asArray = ensureQueryKeyArray(queryKey);
    return stableValueHash(asArray);
  }
  /**
   * Hashes the value into a stable hash.
   */

  function stableValueHash(value) {
    return JSON.stringify(value, (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
      result[key] = val[key];
      return result;
    }, {}) : val);
  }
  /**
   * Checks if key `b` partially matches with key `a`.
   */

  function partialMatchKey(a, b) {
    return partialDeepEqual(ensureQueryKeyArray(a), ensureQueryKeyArray(b));
  }
  /**
   * Checks if `b` partially matches with `a`.
   */

  function partialDeepEqual(a, b) {
    if (a === b) {
      return true;
    }

    if (typeof a !== typeof b) {
      return false;
    }

    if (a && b && typeof a === 'object' && typeof b === 'object') {
      return !Object.keys(b).some(key => !partialDeepEqual(a[key], b[key]));
    }

    return false;
  }
  /**
   * This function returns `a` if `b` is deeply equal.
   * If not, it will replace any deeply equal children of `b` with those of `a`.
   * This can be used for structural sharing between JSON values for example.
   */

  function replaceEqualDeep(a, b) {
    if (a === b) {
      return a;
    }

    const array = Array.isArray(a) && Array.isArray(b);

    if (array || isPlainObject(a) && isPlainObject(b)) {
      const aSize = array ? a.length : Object.keys(a).length;
      const bItems = array ? b : Object.keys(b);
      const bSize = bItems.length;
      const copy = array ? [] : {};
      let equalItems = 0;

      for (let i = 0; i < bSize; i++) {
        const key = array ? i : bItems[i];
        copy[key] = replaceEqualDeep(a[key], b[key]);

        if (copy[key] === a[key]) {
          equalItems++;
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
    if (a && !b || b && !a) {
      return false;
    }

    for (const key in a) {
      if (a[key] !== b[key]) {
        return false;
      }
    }

    return true;
  } // Copied from: https://github.com/jonschlinkert/is-plain-object

  function isPlainObject(o) {
    if (!hasObjectPrototype(o)) {
      return false;
    } // If has modified constructor


    const ctor = o.constructor;

    if (typeof ctor === 'undefined') {
      return true;
    } // If has modified prototype


    const prot = ctor.prototype;

    if (!hasObjectPrototype(prot)) {
      return false;
    } // If constructor does not have an Object-specific method


    if (!prot.hasOwnProperty('isPrototypeOf')) {
      return false;
    } // Most likely a plain Object


    return true;
  }

  function hasObjectPrototype(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
  }

  function isQueryKey(value) {
    return typeof value === 'string' || Array.isArray(value);
  }
  function isError(value) {
    return value instanceof Error;
  }
  function sleep(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }
  /**
   * Schedules a microtask.
   * This can be useful to schedule state updates after rendering.
   */

  function scheduleMicrotask(callback) {
    Promise.resolve().then(callback).catch(error => setTimeout(() => {
      throw error;
    }));
  }
  function getAbortController() {
    if (typeof AbortController === 'function') {
      return new AbortController();
    }
  }

  class FocusManager extends Subscribable {
    constructor() {
      super();

      this.setup = onFocus => {
        if (!isServer && window?.addEventListener) {
          const listener = () => onFocus(); // Listen to visibillitychange and focus


          window.addEventListener('visibilitychange', listener, false);
          window.addEventListener('focus', listener, false);
          return () => {
            // Be sure to unsubscribe if a new handler is set
            window.removeEventListener('visibilitychange', listener);
            window.removeEventListener('focus', listener);
          };
        }
      };
    }

    onSubscribe() {
      if (!this.cleanup) {
        this.setEventListener(this.setup);
      }
    }

    onUnsubscribe() {
      if (!this.hasListeners()) {
        this.cleanup?.();
        this.cleanup = undefined;
      }
    }

    setEventListener(setup) {
      this.setup = setup;
      this.cleanup?.();
      this.cleanup = setup(focused => {
        if (typeof focused === 'boolean') {
          this.setFocused(focused);
        } else {
          this.onFocus();
        }
      });
    }

    setFocused(focused) {
      this.focused = focused;

      if (focused) {
        this.onFocus();
      }
    }

    onFocus() {
      this.listeners.forEach(listener => {
        listener();
      });
    }

    isFocused() {
      if (typeof this.focused === 'boolean') {
        return this.focused;
      } // document global can be unavailable in react native


      if (typeof document === 'undefined') {
        return true;
      }

      return [undefined, 'visible', 'prerender'].includes(document.visibilityState);
    }

  }
  const focusManager = new FocusManager();

  class OnlineManager extends Subscribable {
    constructor() {
      super();

      this.setup = onOnline => {
        if (!isServer && window?.addEventListener) {
          const listener = () => onOnline(); // Listen to online


          window.addEventListener('online', listener, false);
          window.addEventListener('offline', listener, false);
          return () => {
            // Be sure to unsubscribe if a new handler is set
            window.removeEventListener('online', listener);
            window.removeEventListener('offline', listener);
          };
        }
      };
    }

    onSubscribe() {
      if (!this.cleanup) {
        this.setEventListener(this.setup);
      }
    }

    onUnsubscribe() {
      if (!this.hasListeners()) {
        this.cleanup?.();
        this.cleanup = undefined;
      }
    }

    setEventListener(setup) {
      this.setup = setup;
      this.cleanup?.();
      this.cleanup = setup(online => {
        if (typeof online === 'boolean') {
          this.setOnline(online);
        } else {
          this.onOnline();
        }
      });
    }

    setOnline(online) {
      this.online = online;

      if (online) {
        this.onOnline();
      }
    }

    onOnline() {
      this.listeners.forEach(listener => {
        listener();
      });
    }

    isOnline() {
      if (typeof this.online === 'boolean') {
        return this.online;
      }

      if (typeof navigator === 'undefined' || typeof navigator.onLine === 'undefined') {
        return true;
      }

      return navigator.onLine;
    }

  }
  const onlineManager = new OnlineManager();

  function defaultRetryDelay(failureCount) {
    return Math.min(1000 * 2 ** failureCount, 30000);
  }

  function isCancelable(value) {
    return typeof value?.cancel === 'function';
  }
  class CancelledError {
    constructor(options) {
      this.revert = options?.revert;
      this.silent = options?.silent;
    }

  }
  function isCancelledError(value) {
    return value instanceof CancelledError;
  } // CLASS

  class Retryer {
    constructor(config) {
      let cancelRetry = false;
      let cancelFn;
      let continueFn;
      let promiseResolve;
      let promiseReject;
      this.abort = config.abort;

      this.cancel = cancelOptions => cancelFn?.(cancelOptions);

      this.cancelRetry = () => {
        cancelRetry = true;
      };

      this.continueRetry = () => {
        cancelRetry = false;
      };

      this.continue = () => continueFn?.();

      this.failureCount = 0;
      this.isPaused = false;
      this.isResolved = false;
      this.isTransportCancelable = false;
      this.promise = new Promise((outerResolve, outerReject) => {
        promiseResolve = outerResolve;
        promiseReject = outerReject;
      });

      const resolve = value => {
        if (!this.isResolved) {
          this.isResolved = true;
          config.onSuccess?.(value);
          continueFn?.();
          promiseResolve(value);
        }
      };

      const reject = value => {
        if (!this.isResolved) {
          this.isResolved = true;
          config.onError?.(value);
          continueFn?.();
          promiseReject(value);
        }
      };

      const pause = () => {
        return new Promise(continueResolve => {
          continueFn = continueResolve;
          this.isPaused = true;
          config.onPause?.();
        }).then(() => {
          continueFn = undefined;
          this.isPaused = false;
          config.onContinue?.();
        });
      }; // Create loop function


      const run = () => {
        // Do nothing if already resolved
        if (this.isResolved) {
          return;
        }

        let promiseOrValue; // Execute query

        try {
          promiseOrValue = config.fn();
        } catch (error) {
          promiseOrValue = Promise.reject(error);
        } // Create callback to cancel this fetch


        cancelFn = cancelOptions => {
          if (!this.isResolved) {
            reject(new CancelledError(cancelOptions));
            this.abort?.(); // Cancel transport if supported

            if (isCancelable(promiseOrValue)) {
              try {
                promiseOrValue.cancel();
              } catch {}
            }
          }
        }; // Check if the transport layer support cancellation


        this.isTransportCancelable = isCancelable(promiseOrValue);
        Promise.resolve(promiseOrValue).then(resolve).catch(error => {
          // Stop if the fetch is already resolved
          if (this.isResolved) {
            return;
          } // Do we need to retry the request?


          const retry = config.retry ?? 3;
          const retryDelay = config.retryDelay ?? defaultRetryDelay;
          const delay = typeof retryDelay === 'function' ? retryDelay(this.failureCount, error) : retryDelay;
          const shouldRetry = retry === true || typeof retry === 'number' && this.failureCount < retry || typeof retry === 'function' && retry(this.failureCount, error);

          if (cancelRetry || !shouldRetry) {
            // We are done if the query does not need to be retried
            reject(error);
            return;
          }

          this.failureCount++; // Notify on fail

          config.onFail?.(this.failureCount, error); // Delay

          sleep(delay) // Pause if the document is not visible or when the device is offline
          .then(() => {
            if (!focusManager.isFocused() || !onlineManager.isOnline()) {
              return pause();
            }
          }).then(() => {
            if (cancelRetry) {
              reject(error);
            } else {
              run();
            }
          });
        });
      }; // Start loop


      run();
    }

  }

  // CLASS
  class NotifyManager {
    constructor() {
      this.queue = [];
      this.transactions = 0;

      this.notifyFn = callback => {
        callback();
      };

      this.batchNotifyFn = callback => {
        callback();
      };
    }

    batch(callback) {
      let result;
      this.transactions++;

      try {
        result = callback();
      } finally {
        this.transactions--;

        if (!this.transactions) {
          this.flush();
        }
      }

      return result;
    }

    schedule(callback) {
      if (this.transactions) {
        this.queue.push(callback);
      } else {
        scheduleMicrotask(() => {
          this.notifyFn(callback);
        });
      }
    }
    /**
     * All calls to the wrapped function will be batched.
     */


    batchCalls(callback) {
      return (...args) => {
        this.schedule(() => {
          callback(...args);
        });
      };
    }

    flush() {
      const queue = this.queue;
      this.queue = [];

      if (queue.length) {
        scheduleMicrotask(() => {
          this.batchNotifyFn(() => {
            queue.forEach(callback => {
              this.notifyFn(callback);
            });
          });
        });
      }
    }
    /**
     * Use this method to set a custom notify function.
     * This can be used to for example wrap notifications with `React.act` while running tests.
     */


    setNotifyFunction(fn) {
      this.notifyFn = fn;
    }
    /**
     * Use this method to set a custom function to batch notifications together into a single tick.
     * By default React Query will use the batch function provided by ReactDOM or React Native.
     */


    setBatchNotifyFunction(fn) {
      this.batchNotifyFn = fn;
    }

  } // SINGLETON

  const notifyManager = new NotifyManager();

  // TYPES
  // FUNCTIONS
  let logger = console;
  function getLogger() {
    return logger;
  }
  function setLogger(newLogger) {
    logger = newLogger;
  }

  // CLASS
  class Query {
    constructor(config) {
      this.abortSignalConsumed = false;
      this.hadObservers = false;
      this.defaultOptions = config.defaultOptions;
      this.setOptions(config.options);
      this.observers = [];
      this.cache = config.cache;
      this.queryKey = config.queryKey;
      this.queryHash = config.queryHash;
      this.initialState = config.state || this.getDefaultState(this.options);
      this.state = this.initialState;
      this.meta = config.meta;
      this.scheduleGc();
    }

    setOptions(options) {
      this.options = { ...this.defaultOptions,
        ...options
      };
      this.meta = options?.meta; // Default to 5 minutes if not cache time is set

      this.cacheTime = Math.max(this.cacheTime || 0, this.options.cacheTime ?? 5 * 60 * 1000);
    }

    setDefaultOptions(options) {
      this.defaultOptions = options;
    }

    scheduleGc() {
      this.clearGcTimeout();

      if (isValidTimeout(this.cacheTime)) {
        this.gcTimeout = setTimeout(() => {
          this.optionalRemove();
        }, this.cacheTime);
      }
    }

    clearGcTimeout() {
      if (this.gcTimeout) {
        clearTimeout(this.gcTimeout);
        this.gcTimeout = undefined;
      }
    }

    optionalRemove() {
      if (!this.observers.length) {
        if (this.state.isFetching) {
          if (this.hadObservers) {
            this.scheduleGc();
          }
        } else {
          this.cache.remove(this);
        }
      }
    }

    setData(updater, options) {
      const prevData = this.state.data; // Get the new data

      let data = functionalUpdate(updater, prevData); // Use prev data if an isDataEqual function is defined and returns `true`

      if (this.options.isDataEqual?.(prevData, data)) {
        data = prevData;
      } else if (this.options.structuralSharing !== false) {
        // Structurally share data between prev and new data if needed
        data = replaceEqualDeep(prevData, data);
      } // Set data and mark it as cached


      this.dispatch({
        data,
        type: 'success',
        dataUpdatedAt: options?.updatedAt
      });
      return data;
    }

    setState(state, setStateOptions) {
      this.dispatch({
        type: 'setState',
        state,
        setStateOptions
      });
    }

    cancel(options) {
      const promise = this.promise;
      this.retryer?.cancel(options);
      return promise ? promise.then(noop).catch(noop) : Promise.resolve();
    }

    destroy() {
      this.clearGcTimeout();
      this.cancel({
        silent: true
      });
    }

    reset() {
      this.destroy();
      this.setState(this.initialState);
    }

    isActive() {
      return this.observers.some(observer => observer.options.enabled !== false);
    }

    isFetching() {
      return this.state.isFetching;
    }

    isStale() {
      return this.state.isInvalidated || !this.state.dataUpdatedAt || this.observers.some(observer => observer.getCurrentResult().isStale);
    }

    isStaleByTime(staleTime = 0) {
      return this.state.isInvalidated || !this.state.dataUpdatedAt || !timeUntilStale(this.state.dataUpdatedAt, staleTime);
    }

    onFocus() {
      const observer = this.observers.find(x => x.shouldFetchOnWindowFocus());

      if (observer) {
        observer.refetch();
      } // Continue fetch if currently paused


      this.retryer?.continue();
    }

    onOnline() {
      const observer = this.observers.find(x => x.shouldFetchOnReconnect());

      if (observer) {
        observer.refetch();
      } // Continue fetch if currently paused


      this.retryer?.continue();
    }

    addObserver(observer) {
      if (this.observers.indexOf(observer) === -1) {
        this.observers.push(observer);
        this.hadObservers = true; // Stop the query from being garbage collected

        this.clearGcTimeout();
        this.cache.notify({
          type: 'observerAdded',
          query: this,
          observer
        });
      }
    }

    removeObserver(observer) {
      if (this.observers.indexOf(observer) !== -1) {
        this.observers = this.observers.filter(x => x !== observer);

        if (!this.observers.length) {
          // If the transport layer does not support cancellation
          // we'll let the query continue so the result can be cached
          if (this.retryer) {
            if (this.retryer.isTransportCancelable || this.abortSignalConsumed) {
              this.retryer.cancel({
                revert: true
              });
            } else {
              this.retryer.cancelRetry();
            }
          }

          if (this.cacheTime) {
            this.scheduleGc();
          } else {
            this.cache.remove(this);
          }
        }

        this.cache.notify({
          type: 'observerRemoved',
          query: this,
          observer
        });
      }
    }

    getObserversCount() {
      return this.observers.length;
    }

    invalidate() {
      if (!this.state.isInvalidated) {
        this.dispatch({
          type: 'invalidate'
        });
      }
    }

    fetch(options, fetchOptions) {
      if (this.state.isFetching) {
        if (this.state.dataUpdatedAt && fetchOptions?.cancelRefetch) {
          // Silently cancel current fetch if the user wants to cancel refetches
          this.cancel({
            silent: true
          });
        } else if (this.promise) {
          // make sure that retries that were potentially cancelled due to unmounts can continue
          this.retryer?.continueRetry(); // Return current promise if we are already fetching

          return this.promise;
        }
      } // Update config if passed, otherwise the config from the last execution is used


      if (options) {
        this.setOptions(options);
      } // Use the options from the first observer with a query function if no function is found.
      // This can happen when the query is hydrated or created with setQueryData.


      if (!this.options.queryFn) {
        const observer = this.observers.find(x => x.options.queryFn);

        if (observer) {
          this.setOptions(observer.options);
        }
      }

      const queryKey = ensureQueryKeyArray(this.queryKey);
      const abortController = getAbortController(); // Create query function context

      const queryFnContext = {
        queryKey,
        pageParam: undefined,
        meta: this.meta
      };
      Object.defineProperty(queryFnContext, 'signal', {
        enumerable: true,
        get: () => {
          if (abortController) {
            this.abortSignalConsumed = true;
            return abortController.signal;
          }

          return undefined;
        }
      }); // Create fetch function

      const fetchFn = () => {
        if (!this.options.queryFn) {
          return Promise.reject('Missing queryFn');
        }

        this.abortSignalConsumed = false;
        return this.options.queryFn(queryFnContext);
      }; // Trigger behavior hook


      const context = {
        fetchOptions,
        options: this.options,
        queryKey: queryKey,
        state: this.state,
        fetchFn,
        meta: this.meta
      };

      if (this.options.behavior?.onFetch) {
        this.options.behavior?.onFetch(context);
      } // Store state in case the current fetch needs to be reverted


      this.revertState = this.state; // Set to fetching state if not already in it

      if (!this.state.isFetching || this.state.fetchMeta !== context.fetchOptions?.meta) {
        this.dispatch({
          type: 'fetch',
          meta: context.fetchOptions?.meta
        });
      } // Try to fetch the data


      this.retryer = new Retryer({
        fn: context.fetchFn,
        abort: abortController?.abort?.bind(abortController),
        onSuccess: data => {
          this.setData(data); // Notify cache callback

          this.cache.config.onSuccess?.(data, this); // Remove query after fetching if cache time is 0

          if (this.cacheTime === 0) {
            this.optionalRemove();
          }
        },
        onError: error => {
          // Optimistically update state if needed
          if (!(isCancelledError(error) && error.silent)) {
            this.dispatch({
              type: 'error',
              error: error
            });
          }

          if (!isCancelledError(error)) {
            // Notify cache callback
            this.cache.config.onError?.(error, this); // Log error

            getLogger().error(error);
          } // Remove query after fetching if cache time is 0


          if (this.cacheTime === 0) {
            this.optionalRemove();
          }
        },
        onFail: () => {
          this.dispatch({
            type: 'failed'
          });
        },
        onPause: () => {
          this.dispatch({
            type: 'pause'
          });
        },
        onContinue: () => {
          this.dispatch({
            type: 'continue'
          });
        },
        retry: context.options.retry,
        retryDelay: context.options.retryDelay
      });
      this.promise = this.retryer.promise;
      return this.promise;
    }

    dispatch(action) {
      this.state = this.reducer(this.state, action);
      notifyManager.batch(() => {
        this.observers.forEach(observer => {
          observer.onQueryUpdate(action);
        });
        this.cache.notify({
          query: this,
          type: 'queryUpdated',
          action
        });
      });
    }

    getDefaultState(options) {
      const data = typeof options.initialData === 'function' ? options.initialData() : options.initialData;
      const hasInitialData = typeof options.initialData !== 'undefined';
      const initialDataUpdatedAt = hasInitialData ? typeof options.initialDataUpdatedAt === 'function' ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
      const hasData = typeof data !== 'undefined';
      return {
        data,
        dataUpdateCount: 0,
        dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
        error: null,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        fetchFailureCount: 0,
        fetchMeta: null,
        isFetching: false,
        isInvalidated: false,
        isPaused: false,
        status: hasData ? 'success' : 'idle'
      };
    }

    reducer(state, action) {
      switch (action.type) {
        case 'failed':
          return { ...state,
            fetchFailureCount: state.fetchFailureCount + 1
          };

        case 'pause':
          return { ...state,
            isPaused: true
          };

        case 'continue':
          return { ...state,
            isPaused: false
          };

        case 'fetch':
          return { ...state,
            fetchFailureCount: 0,
            fetchMeta: action.meta ?? null,
            isFetching: true,
            isPaused: false,
            ...(!state.dataUpdatedAt && {
              error: null,
              status: 'loading'
            })
          };

        case 'success':
          return { ...state,
            data: action.data,
            dataUpdateCount: state.dataUpdateCount + 1,
            dataUpdatedAt: action.dataUpdatedAt ?? Date.now(),
            error: null,
            fetchFailureCount: 0,
            isFetching: false,
            isInvalidated: false,
            isPaused: false,
            status: 'success'
          };

        case 'error':
          const error = action.error;

          if (isCancelledError(error) && error.revert && this.revertState) {
            return { ...this.revertState
            };
          }

          return { ...state,
            error: error,
            errorUpdateCount: state.errorUpdateCount + 1,
            errorUpdatedAt: Date.now(),
            fetchFailureCount: state.fetchFailureCount + 1,
            isFetching: false,
            isPaused: false,
            status: 'error'
          };

        case 'invalidate':
          return { ...state,
            isInvalidated: true
          };

        case 'setState':
          return { ...state,
            ...action.state
          };

        default:
          return state;
      }
    }

  }

  // CLASS
  class QueryCache extends Subscribable {
    constructor(config) {
      super();
      this.config = config || {};
      this.queries = [];
      this.queriesMap = {};
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
          meta: options.meta
        });
        this.add(query);
      }

      return query;
    }

    add(query) {
      if (!this.queriesMap[query.queryHash]) {
        this.queriesMap[query.queryHash] = query;
        this.queries.push(query);
        this.notify({
          type: 'queryAdded',
          query
        });
      }
    }

    remove(query) {
      const queryInMap = this.queriesMap[query.queryHash];

      if (queryInMap) {
        query.destroy();
        this.queries = this.queries.filter(x => x !== query);

        if (queryInMap === query) {
          delete this.queriesMap[query.queryHash];
        }

        this.notify({
          type: 'queryRemoved',
          query
        });
      }
    }

    clear() {
      notifyManager.batch(() => {
        this.queries.forEach(query => {
          this.remove(query);
        });
      });
    }

    get(queryHash) {
      return this.queriesMap[queryHash];
    }

    getAll() {
      return this.queries;
    }

    find(arg1, arg2) {
      const [filters] = parseFilterArgs(arg1, arg2);

      if (typeof filters.exact === 'undefined') {
        filters.exact = true;
      }

      return this.queries.find(query => matchQuery(filters, query));
    }

    findAll(arg1, arg2) {
      const [filters] = parseFilterArgs(arg1, arg2);
      return Object.keys(filters).length > 0 ? this.queries.filter(query => matchQuery(filters, query)) : this.queries;
    }

    notify(event) {
      notifyManager.batch(() => {
        this.listeners.forEach(listener => {
          listener(event);
        });
      });
    }

    onFocus() {
      notifyManager.batch(() => {
        this.queries.forEach(query => {
          query.onFocus();
        });
      });
    }

    onOnline() {
      notifyManager.batch(() => {
        this.queries.forEach(query => {
          query.onOnline();
        });
      });
    }

  }

  // CLASS
  class Mutation {
    constructor(config) {
      this.options = { ...config.defaultOptions,
        ...config.options
      };
      this.mutationId = config.mutationId;
      this.mutationCache = config.mutationCache;
      this.observers = [];
      this.state = config.state || getDefaultState();
      this.meta = config.meta;
    }

    setState(state) {
      this.dispatch({
        type: 'setState',
        state
      });
    }

    addObserver(observer) {
      if (this.observers.indexOf(observer) === -1) {
        this.observers.push(observer);
      }
    }

    removeObserver(observer) {
      this.observers = this.observers.filter(x => x !== observer);
    }

    cancel() {
      if (this.retryer) {
        this.retryer.cancel();
        return this.retryer.promise.then(noop).catch(noop);
      }

      return Promise.resolve();
    }

    continue() {
      if (this.retryer) {
        this.retryer.continue();
        return this.retryer.promise;
      }

      return this.execute();
    }

    execute() {
      let data;
      const restored = this.state.status === 'loading';
      let promise = Promise.resolve();

      if (!restored) {
        this.dispatch({
          type: 'loading',
          variables: this.options.variables
        });
        promise = promise.then(() => {
          // Notify cache callback
          this.mutationCache.config.onMutate?.(this.state.variables, this);
        }).then(() => this.options.onMutate?.(this.state.variables)).then(context => {
          if (context !== this.state.context) {
            this.dispatch({
              type: 'loading',
              context,
              variables: this.state.variables
            });
          }
        });
      }

      return promise.then(() => this.executeMutation()).then(result => {
        data = result; // Notify cache callback

        this.mutationCache.config.onSuccess?.(data, this.state.variables, this.state.context, this);
      }).then(() => this.options.onSuccess?.(data, this.state.variables, this.state.context)).then(() => this.options.onSettled?.(data, null, this.state.variables, this.state.context)).then(() => {
        this.dispatch({
          type: 'success',
          data
        });
        return data;
      }).catch(error => {
        // Notify cache callback
        this.mutationCache.config.onError?.(error, this.state.variables, this.state.context, this); // Log error

        getLogger().error(error);
        return Promise.resolve().then(() => this.options.onError?.(error, this.state.variables, this.state.context)).then(() => this.options.onSettled?.(undefined, error, this.state.variables, this.state.context)).then(() => {
          this.dispatch({
            type: 'error',
            error
          });
          throw error;
        });
      });
    }

    executeMutation() {
      this.retryer = new Retryer({
        fn: () => {
          if (!this.options.mutationFn) {
            return Promise.reject('No mutationFn found');
          }

          return this.options.mutationFn(this.state.variables);
        },
        onFail: () => {
          this.dispatch({
            type: 'failed'
          });
        },
        onPause: () => {
          this.dispatch({
            type: 'pause'
          });
        },
        onContinue: () => {
          this.dispatch({
            type: 'continue'
          });
        },
        retry: this.options.retry ?? 0,
        retryDelay: this.options.retryDelay
      });
      return this.retryer.promise;
    }

    dispatch(action) {
      this.state = reducer(this.state, action);
      notifyManager.batch(() => {
        this.observers.forEach(observer => {
          observer.onMutationUpdate(action);
        });
        this.mutationCache.notify(this);
      });
    }

  }
  function getDefaultState() {
    return {
      context: undefined,
      data: undefined,
      error: null,
      failureCount: 0,
      isPaused: false,
      status: 'idle',
      variables: undefined
    };
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'failed':
        return { ...state,
          failureCount: state.failureCount + 1
        };

      case 'pause':
        return { ...state,
          isPaused: true
        };

      case 'continue':
        return { ...state,
          isPaused: false
        };

      case 'loading':
        return { ...state,
          context: action.context,
          data: undefined,
          error: null,
          isPaused: false,
          status: 'loading',
          variables: action.variables
        };

      case 'success':
        return { ...state,
          data: action.data,
          error: null,
          status: 'success',
          isPaused: false
        };

      case 'error':
        return { ...state,
          data: undefined,
          error: action.error,
          failureCount: state.failureCount + 1,
          isPaused: false,
          status: 'error'
        };

      case 'setState':
        return { ...state,
          ...action.state
        };

      default:
        return state;
    }
  }

  // CLASS
  class MutationCache extends Subscribable {
    constructor(config) {
      super();
      this.config = config || {};
      this.mutations = [];
      this.mutationId = 0;
    }

    build(client, options, state) {
      const mutation = new Mutation({
        mutationCache: this,
        mutationId: ++this.mutationId,
        options: client.defaultMutationOptions(options),
        state,
        defaultOptions: options.mutationKey ? client.getMutationDefaults(options.mutationKey) : undefined,
        meta: options.meta
      });
      this.add(mutation);
      return mutation;
    }

    add(mutation) {
      this.mutations.push(mutation);
      this.notify(mutation);
    }

    remove(mutation) {
      this.mutations = this.mutations.filter(x => x !== mutation);
      mutation.cancel();
      this.notify(mutation);
    }

    clear() {
      notifyManager.batch(() => {
        this.mutations.forEach(mutation => {
          this.remove(mutation);
        });
      });
    }

    getAll() {
      return this.mutations;
    }

    find(filters) {
      if (typeof filters.exact === 'undefined') {
        filters.exact = true;
      }

      return this.mutations.find(mutation => matchMutation(filters, mutation));
    }

    findAll(filters) {
      return this.mutations.filter(mutation => matchMutation(filters, mutation));
    }

    notify(mutation) {
      notifyManager.batch(() => {
        this.listeners.forEach(listener => {
          listener(mutation);
        });
      });
    }

    onFocus() {
      this.resumePausedMutations();
    }

    onOnline() {
      this.resumePausedMutations();
    }

    resumePausedMutations() {
      const pausedMutations = this.mutations.filter(x => x.state.isPaused);
      return notifyManager.batch(() => pausedMutations.reduce((promise, mutation) => promise.then(() => mutation.continue().catch(noop)), Promise.resolve()));
    }

  }

  function infiniteQueryBehavior() {
    return {
      onFetch: context => {
        context.fetchFn = () => {
          const refetchPage = context.fetchOptions?.meta?.refetchPage;
          const fetchMore = context.fetchOptions?.meta?.fetchMore;
          const pageParam = fetchMore?.pageParam;
          const isFetchingNextPage = fetchMore?.direction === 'forward';
          const isFetchingPreviousPage = fetchMore?.direction === 'backward';
          const oldPages = context.state.data?.pages || [];
          const oldPageParams = context.state.data?.pageParams || [];
          const abortController = getAbortController();
          const abortSignal = abortController?.signal;
          let newPageParams = oldPageParams;
          let cancelled = false; // Get query function

          const queryFn = context.options.queryFn || (() => Promise.reject('Missing queryFn'));

          const buildNewPages = (pages, param, page, previous) => {
            newPageParams = previous ? [param, ...newPageParams] : [...newPageParams, param];
            return previous ? [page, ...pages] : [...pages, page];
          }; // Create function to fetch a page


          const fetchPage = (pages, manual, param, previous) => {
            if (cancelled) {
              return Promise.reject('Cancelled');
            }

            if (typeof param === 'undefined' && !manual && pages.length) {
              return Promise.resolve(pages);
            }

            const queryFnContext = {
              queryKey: context.queryKey,
              signal: abortSignal,
              pageParam: param,
              meta: context.meta
            };
            const queryFnResult = queryFn(queryFnContext);
            const promise = Promise.resolve(queryFnResult).then(page => buildNewPages(pages, param, page, previous));

            if (isCancelable(queryFnResult)) {
              const promiseAsAny = promise;
              promiseAsAny.cancel = queryFnResult.cancel;
            }

            return promise;
          };

          let promise; // Fetch first page?

          if (!oldPages.length) {
            promise = fetchPage([]);
          } // Fetch next page?
          else if (isFetchingNextPage) {
              const manual = typeof pageParam !== 'undefined';
              const param = manual ? pageParam : getNextPageParam(context.options, oldPages);
              promise = fetchPage(oldPages, manual, param);
            } // Fetch previous page?
            else if (isFetchingPreviousPage) {
                const manual = typeof pageParam !== 'undefined';
                const param = manual ? pageParam : getPreviousPageParam(context.options, oldPages);
                promise = fetchPage(oldPages, manual, param, true);
              } // Refetch pages
              else {
                  newPageParams = [];
                  const manual = typeof context.options.getNextPageParam === 'undefined';
                  const shouldFetchFirstPage = refetchPage && oldPages[0] ? refetchPage(oldPages[0], 0, oldPages) : true; // Fetch first page

                  promise = shouldFetchFirstPage ? fetchPage([], manual, oldPageParams[0]) : Promise.resolve(buildNewPages([], oldPageParams[0], oldPages[0])); // Fetch remaining pages

                  for (let i = 1; i < oldPages.length; i++) {
                    promise = promise.then(pages => {
                      const shouldFetchNextPage = refetchPage && oldPages[i] ? refetchPage(oldPages[i], i, oldPages) : true;

                      if (shouldFetchNextPage) {
                        const param = manual ? oldPageParams[i] : getNextPageParam(context.options, pages);
                        return fetchPage(pages, manual, param);
                      }

                      return Promise.resolve(buildNewPages(pages, oldPageParams[i], oldPages[i]));
                    });
                  }
                }

          const finalPromise = promise.then(pages => ({
            pages,
            pageParams: newPageParams
          }));
          const finalPromiseAsAny = finalPromise;

          finalPromiseAsAny.cancel = () => {
            cancelled = true;
            abortController?.abort();

            if (isCancelable(promise)) {
              promise.cancel();
            }
          };

          return finalPromise;
        };
      }
    };
  }
  function getNextPageParam(options, pages) {
    return options.getNextPageParam?.(pages[pages.length - 1], pages);
  }
  function getPreviousPageParam(options, pages) {
    return options.getPreviousPageParam?.(pages[0], pages);
  }
  /**
   * Checks if there is a next page.
   * Returns `undefined` if it cannot be determined.
   */

  function hasNextPage(options, pages) {
    if (options.getNextPageParam && Array.isArray(pages)) {
      const nextPageParam = getNextPageParam(options, pages);
      return typeof nextPageParam !== 'undefined' && nextPageParam !== null && nextPageParam !== false;
    }
  }
  /**
   * Checks if there is a previous page.
   * Returns `undefined` if it cannot be determined.
   */

  function hasPreviousPage(options, pages) {
    if (options.getPreviousPageParam && Array.isArray(pages)) {
      const previousPageParam = getPreviousPageParam(options, pages);
      return typeof previousPageParam !== 'undefined' && previousPageParam !== null && previousPageParam !== false;
    }
  }

  // CLASS
  class QueryClient {
    constructor(config = {}) {
      this.queryCache = config.queryCache || new QueryCache();
      this.mutationCache = config.mutationCache || new MutationCache();
      this.defaultOptions = config.defaultOptions || {};
      this.queryDefaults = [];
      this.mutationDefaults = [];
    }

    mount() {
      this.unsubscribeFocus = focusManager.subscribe(() => {
        if (focusManager.isFocused() && onlineManager.isOnline()) {
          this.mutationCache.onFocus();
          this.queryCache.onFocus();
        }
      });
      this.unsubscribeOnline = onlineManager.subscribe(() => {
        if (focusManager.isFocused() && onlineManager.isOnline()) {
          this.mutationCache.onOnline();
          this.queryCache.onOnline();
        }
      });
    }

    unmount() {
      this.unsubscribeFocus?.();
      this.unsubscribeOnline?.();
    }

    isFetching(arg1, arg2) {
      const [filters] = parseFilterArgs(arg1, arg2);
      filters.fetching = true;
      return this.queryCache.findAll(filters).length;
    }

    isMutating(filters) {
      return this.mutationCache.findAll({ ...filters,
        fetching: true
      }).length;
    }

    getQueryData(queryKey, filters) {
      return this.queryCache.find(queryKey, filters)?.state.data;
    }

    getQueriesData(queryKeyOrFilters) {
      return this.getQueryCache().findAll(queryKeyOrFilters).map(({
        queryKey,
        state
      }) => {
        const data = state.data;
        return [queryKey, data];
      });
    }

    setQueryData(queryKey, updater, options) {
      const parsedOptions = parseQueryArgs(queryKey);
      const defaultedOptions = this.defaultQueryOptions(parsedOptions);
      return this.queryCache.build(this, defaultedOptions).setData(updater, options);
    }

    setQueriesData(queryKeyOrFilters, updater, options) {
      return notifyManager.batch(() => this.getQueryCache().findAll(queryKeyOrFilters).map(({
        queryKey
      }) => [queryKey, this.setQueryData(queryKey, updater, options)]));
    }

    getQueryState(queryKey, filters) {
      return this.queryCache.find(queryKey, filters)?.state;
    }

    removeQueries(arg1, arg2) {
      const [filters] = parseFilterArgs(arg1, arg2);
      const queryCache = this.queryCache;
      notifyManager.batch(() => {
        queryCache.findAll(filters).forEach(query => {
          queryCache.remove(query);
        });
      });
    }

    resetQueries(arg1, arg2, arg3) {
      const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
      const queryCache = this.queryCache;
      const refetchFilters = { ...filters,
        active: true
      };
      return notifyManager.batch(() => {
        queryCache.findAll(filters).forEach(query => {
          query.reset();
        });
        return this.refetchQueries(refetchFilters, options);
      });
    }

    cancelQueries(arg1, arg2, arg3) {
      const [filters, cancelOptions = {}] = parseFilterArgs(arg1, arg2, arg3);

      if (typeof cancelOptions.revert === 'undefined') {
        cancelOptions.revert = true;
      }

      const promises = notifyManager.batch(() => this.queryCache.findAll(filters).map(query => query.cancel(cancelOptions)));
      return Promise.all(promises).then(noop).catch(noop);
    }

    invalidateQueries(arg1, arg2, arg3) {
      const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
      const refetchFilters = { ...filters,
        // if filters.refetchActive is not provided and filters.active is explicitly false,
        // e.g. invalidateQueries({ active: false }), we don't want to refetch active queries
        active: filters.refetchActive ?? filters.active ?? true,
        inactive: filters.refetchInactive ?? false
      };
      return notifyManager.batch(() => {
        this.queryCache.findAll(filters).forEach(query => {
          query.invalidate();
        });
        return this.refetchQueries(refetchFilters, options);
      });
    }

    refetchQueries(arg1, arg2, arg3) {
      const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
      const promises = notifyManager.batch(() => this.queryCache.findAll(filters).map(query => query.fetch(undefined, { ...options,
        meta: {
          refetchPage: filters?.refetchPage
        }
      })));
      let promise = Promise.all(promises).then(noop);

      if (!options?.throwOnError) {
        promise = promise.catch(noop);
      }

      return promise;
    }

    fetchQuery(arg1, arg2, arg3) {
      const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
      const defaultedOptions = this.defaultQueryOptions(parsedOptions); // https://github.com/tannerlinsley/react-query/issues/652

      if (typeof defaultedOptions.retry === 'undefined') {
        defaultedOptions.retry = false;
      }

      const query = this.queryCache.build(this, defaultedOptions);
      return query.isStaleByTime(defaultedOptions.staleTime) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
    }

    prefetchQuery(arg1, arg2, arg3) {
      return this.fetchQuery(arg1, arg2, arg3).then(noop).catch(noop);
    }

    fetchInfiniteQuery(arg1, arg2, arg3) {
      const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
      parsedOptions.behavior = infiniteQueryBehavior();
      return this.fetchQuery(parsedOptions);
    }

    prefetchInfiniteQuery(arg1, arg2, arg3) {
      return this.fetchInfiniteQuery(arg1, arg2, arg3).then(noop).catch(noop);
    }

    cancelMutations() {
      const promises = notifyManager.batch(() => this.mutationCache.getAll().map(mutation => mutation.cancel()));
      return Promise.all(promises).then(noop).catch(noop);
    }

    resumePausedMutations() {
      return this.getMutationCache().resumePausedMutations();
    }

    executeMutation(options) {
      return this.mutationCache.build(this, options).execute();
    }

    getQueryCache() {
      return this.queryCache;
    }

    getMutationCache() {
      return this.mutationCache;
    }

    getDefaultOptions() {
      return this.defaultOptions;
    }

    setDefaultOptions(options) {
      this.defaultOptions = options;
    }

    setQueryDefaults(queryKey, options) {
      const result = this.queryDefaults.find(x => hashQueryKey(queryKey) === hashQueryKey(x.queryKey));

      if (result) {
        result.defaultOptions = options;
      } else {
        this.queryDefaults.push({
          queryKey,
          defaultOptions: options
        });
      }
    }

    getQueryDefaults(queryKey) {
      return queryKey ? this.queryDefaults.find(x => partialMatchKey(queryKey, x.queryKey))?.defaultOptions : undefined;
    }

    setMutationDefaults(mutationKey, options) {
      const result = this.mutationDefaults.find(x => hashQueryKey(mutationKey) === hashQueryKey(x.mutationKey));

      if (result) {
        result.defaultOptions = options;
      } else {
        this.mutationDefaults.push({
          mutationKey,
          defaultOptions: options
        });
      }
    }

    getMutationDefaults(mutationKey) {
      return mutationKey ? this.mutationDefaults.find(x => partialMatchKey(mutationKey, x.mutationKey))?.defaultOptions : undefined;
    }

    defaultQueryOptions(options) {
      if (options?._defaulted) {
        return options;
      }

      const defaultedOptions = { ...this.defaultOptions.queries,
        ...this.getQueryDefaults(options?.queryKey),
        ...options,
        _defaulted: true
      };

      if (!defaultedOptions.queryHash && defaultedOptions.queryKey) {
        defaultedOptions.queryHash = hashQueryKeyByOptions(defaultedOptions.queryKey, defaultedOptions);
      }

      return defaultedOptions;
    }

    defaultQueryObserverOptions(options) {
      return this.defaultQueryOptions(options);
    }

    defaultMutationOptions(options) {
      if (options?._defaulted) {
        return options;
      }

      return { ...this.defaultOptions.mutations,
        ...this.getMutationDefaults(options?.mutationKey),
        ...options,
        _defaulted: true
      };
    }

    clear() {
      this.queryCache.clear();
      this.mutationCache.clear();
    }

  }

  class QueryObserver extends Subscribable {
    constructor(client, options) {
      super();
      this.client = client;
      this.options = options;
      this.trackedProps = [];
      this.selectError = null;
      this.bindMethods();
      this.setOptions(options);
    }

    bindMethods() {
      this.remove = this.remove.bind(this);
      this.refetch = this.refetch.bind(this);
    }

    onSubscribe() {
      if (this.listeners.length === 1) {
        this.currentQuery.addObserver(this);

        if (shouldFetchOnMount(this.currentQuery, this.options)) {
          this.executeFetch();
        }

        this.updateTimers();
      }
    }

    onUnsubscribe() {
      if (!this.listeners.length) {
        this.destroy();
      }
    }

    shouldFetchOnReconnect() {
      return shouldFetchOn(this.currentQuery, this.options, this.options.refetchOnReconnect);
    }

    shouldFetchOnWindowFocus() {
      return shouldFetchOn(this.currentQuery, this.options, this.options.refetchOnWindowFocus);
    }

    destroy() {
      this.listeners = [];
      this.clearTimers();
      this.currentQuery.removeObserver(this);
    }

    setOptions(options, notifyOptions) {
      const prevOptions = this.options;
      const prevQuery = this.currentQuery;
      this.options = this.client.defaultQueryObserverOptions(options);

      if (typeof this.options.enabled !== 'undefined' && typeof this.options.enabled !== 'boolean') {
        throw new Error('Expected enabled to be a boolean');
      } // Keep previous query key if the user does not supply one


      if (!this.options.queryKey) {
        this.options.queryKey = prevOptions.queryKey;
      }

      this.updateQuery();
      const mounted = this.hasListeners(); // Fetch if there are subscribers

      if (mounted && shouldFetchOptionally(this.currentQuery, prevQuery, this.options, prevOptions)) {
        this.executeFetch();
      } // Update result


      this.updateResult(notifyOptions); // Update stale interval if needed

      if (mounted && (this.currentQuery !== prevQuery || this.options.enabled !== prevOptions.enabled || this.options.staleTime !== prevOptions.staleTime)) {
        this.updateStaleTimeout();
      }

      const nextRefetchInterval = this.computeRefetchInterval(); // Update refetch interval if needed

      if (mounted && (this.currentQuery !== prevQuery || this.options.enabled !== prevOptions.enabled || nextRefetchInterval !== this.currentRefetchInterval)) {
        this.updateRefetchInterval(nextRefetchInterval);
      }
    }

    getOptimisticResult(options) {
      const defaultedOptions = this.client.defaultQueryObserverOptions(options);
      const query = this.client.getQueryCache().build(this.client, defaultedOptions);
      return this.createResult(query, defaultedOptions);
    }

    getCurrentResult() {
      return this.currentResult;
    }

    trackResult(result, defaultedOptions) {
      const trackedResult = {};

      const trackProp = key => {
        if (!this.trackedProps.includes(key)) {
          this.trackedProps.push(key);
        }
      };

      Object.keys(result).forEach(key => {
        Object.defineProperty(trackedResult, key, {
          configurable: false,
          enumerable: true,
          get: () => {
            trackProp(key);
            return result[key];
          }
        });
      });

      if (defaultedOptions.useErrorBoundary || defaultedOptions.suspense) {
        trackProp('error');
      }

      return trackedResult;
    }

    getNextResult(options) {
      return new Promise((resolve, reject) => {
        const unsubscribe = this.subscribe(result => {
          if (!result.isFetching) {
            unsubscribe();

            if (result.isError && options?.throwOnError) {
              reject(result.error);
            } else {
              resolve(result);
            }
          }
        });
      });
    }

    getCurrentQuery() {
      return this.currentQuery;
    }

    remove() {
      this.client.getQueryCache().remove(this.currentQuery);
    }

    refetch(options) {
      return this.fetch({ ...options,
        meta: {
          refetchPage: options?.refetchPage
        }
      });
    }

    fetchOptimistic(options) {
      const defaultedOptions = this.client.defaultQueryObserverOptions(options);
      const query = this.client.getQueryCache().build(this.client, defaultedOptions);
      return query.fetch().then(() => this.createResult(query, defaultedOptions));
    }

    fetch(fetchOptions) {
      return this.executeFetch(fetchOptions).then(() => {
        this.updateResult();
        return this.currentResult;
      });
    }

    executeFetch(fetchOptions) {
      // Make sure we reference the latest query as the current one might have been removed
      this.updateQuery(); // Fetch

      let promise = this.currentQuery.fetch(this.options, fetchOptions);

      if (!fetchOptions?.throwOnError) {
        promise = promise.catch(noop);
      }

      return promise;
    }

    updateStaleTimeout() {
      this.clearStaleTimeout();

      if (isServer || this.currentResult.isStale || !isValidTimeout(this.options.staleTime)) {
        return;
      }

      const time = timeUntilStale(this.currentResult.dataUpdatedAt, this.options.staleTime); // The timeout is sometimes triggered 1 ms before the stale time expiration.
      // To mitigate this issue we always add 1 ms to the timeout.

      const timeout = time + 1;
      this.staleTimeoutId = setTimeout(() => {
        if (!this.currentResult.isStale) {
          this.updateResult();
        }
      }, timeout);
    }

    computeRefetchInterval() {
      return typeof this.options.refetchInterval === 'function' ? this.options.refetchInterval(this.currentResult.data, this.currentQuery) : this.options.refetchInterval ?? false;
    }

    updateRefetchInterval(nextInterval) {
      this.clearRefetchInterval();
      this.currentRefetchInterval = nextInterval;

      if (isServer || this.options.enabled === false || !isValidTimeout(this.currentRefetchInterval) || this.currentRefetchInterval === 0) {
        return;
      }

      this.refetchIntervalId = setInterval(() => {
        if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
          this.executeFetch();
        }
      }, this.currentRefetchInterval);
    }

    updateTimers() {
      this.updateStaleTimeout();
      this.updateRefetchInterval(this.computeRefetchInterval());
    }

    clearTimers() {
      this.clearStaleTimeout();
      this.clearRefetchInterval();
    }

    clearStaleTimeout() {
      if (this.staleTimeoutId) {
        clearTimeout(this.staleTimeoutId);
        this.staleTimeoutId = undefined;
      }
    }

    clearRefetchInterval() {
      if (this.refetchIntervalId) {
        clearInterval(this.refetchIntervalId);
        this.refetchIntervalId = undefined;
      }
    }

    createResult(query, options) {
      const prevQuery = this.currentQuery;
      const prevOptions = this.options;
      const prevResult = this.currentResult;
      const prevResultState = this.currentResultState;
      const prevResultOptions = this.currentResultOptions;
      const queryChange = query !== prevQuery;
      const queryInitialState = queryChange ? query.state : this.currentQueryInitialState;
      const prevQueryResult = queryChange ? this.currentResult : this.previousQueryResult;
      const {
        state
      } = query;
      let {
        dataUpdatedAt,
        error,
        errorUpdatedAt,
        isFetching,
        status
      } = state;
      let isPreviousData = false;
      let isPlaceholderData = false;
      let data; // Optimistically set result in fetching state if needed

      if (options.optimisticResults) {
        const mounted = this.hasListeners();
        const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
        const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);

        if (fetchOnMount || fetchOptionally) {
          isFetching = true;

          if (!dataUpdatedAt) {
            status = 'loading';
          }
        }
      } // Keep previous data if needed


      if (options.keepPreviousData && !state.dataUpdateCount && prevQueryResult?.isSuccess && status !== 'error') {
        data = prevQueryResult.data;
        dataUpdatedAt = prevQueryResult.dataUpdatedAt;
        status = prevQueryResult.status;
        isPreviousData = true;
      } // Select data if needed
      else if (options.select && typeof state.data !== 'undefined') {
          // Memoize select result
          if (prevResult && state.data === prevResultState?.data && options.select === this.selectFn) {
            data = this.selectResult;
          } else {
            try {
              this.selectFn = options.select;
              data = options.select(state.data);

              if (options.structuralSharing !== false) {
                data = replaceEqualDeep(prevResult?.data, data);
              }

              this.selectResult = data;
              this.selectError = null;
            } catch (selectError) {
              getLogger().error(selectError);
              this.selectError = selectError;
            }
          }
        } // Use query data
        else {
            data = state.data;
          } // Show placeholder data if needed


      if (typeof options.placeholderData !== 'undefined' && typeof data === 'undefined' && (status === 'loading' || status === 'idle')) {
        let placeholderData; // Memoize placeholder data

        if (prevResult?.isPlaceholderData && options.placeholderData === prevResultOptions?.placeholderData) {
          placeholderData = prevResult.data;
        } else {
          placeholderData = typeof options.placeholderData === 'function' ? options.placeholderData() : options.placeholderData;

          if (options.select && typeof placeholderData !== 'undefined') {
            try {
              placeholderData = options.select(placeholderData);

              if (options.structuralSharing !== false) {
                placeholderData = replaceEqualDeep(prevResult?.data, placeholderData);
              }

              this.selectError = null;
            } catch (selectError) {
              getLogger().error(selectError);
              this.selectError = selectError;
            }
          }
        }

        if (typeof placeholderData !== 'undefined') {
          status = 'success';
          data = placeholderData;
          isPlaceholderData = true;
        }
      }

      if (this.selectError) {
        error = this.selectError;
        data = this.selectResult;
        errorUpdatedAt = Date.now();
        status = 'error';
      }

      const result = {
        status,
        isLoading: status === 'loading',
        isSuccess: status === 'success',
        isError: status === 'error',
        isIdle: status === 'idle',
        data,
        dataUpdatedAt,
        error,
        errorUpdatedAt,
        failureCount: state.fetchFailureCount,
        errorUpdateCount: state.errorUpdateCount,
        isFetched: state.dataUpdateCount > 0 || state.errorUpdateCount > 0,
        isFetchedAfterMount: state.dataUpdateCount > queryInitialState.dataUpdateCount || state.errorUpdateCount > queryInitialState.errorUpdateCount,
        isFetching,
        isRefetching: isFetching && status !== 'loading',
        isLoadingError: status === 'error' && state.dataUpdatedAt === 0,
        isPlaceholderData,
        isPreviousData,
        isRefetchError: status === 'error' && state.dataUpdatedAt !== 0,
        isStale: isStale(query, options),
        refetch: this.refetch,
        remove: this.remove
      };
      return result;
    }

    shouldNotifyListeners(result, prevResult) {
      if (!prevResult) {
        return true;
      }

      const {
        notifyOnChangeProps,
        notifyOnChangePropsExclusions
      } = this.options;

      if (!notifyOnChangeProps && !notifyOnChangePropsExclusions) {
        return true;
      }

      if (notifyOnChangeProps === 'tracked' && !this.trackedProps.length) {
        return true;
      }

      const includedProps = notifyOnChangeProps === 'tracked' ? this.trackedProps : notifyOnChangeProps;
      return Object.keys(result).some(key => {
        const typedKey = key;
        const changed = result[typedKey] !== prevResult[typedKey];
        const isIncluded = includedProps?.some(x => x === key);
        const isExcluded = notifyOnChangePropsExclusions?.some(x => x === key);
        return changed && !isExcluded && (!includedProps || isIncluded);
      });
    }

    updateResult(notifyOptions) {
      const prevResult = this.currentResult;
      this.currentResult = this.createResult(this.currentQuery, this.options);
      this.currentResultState = this.currentQuery.state;
      this.currentResultOptions = this.options; // Only notify if something has changed

      if (shallowEqualObjects(this.currentResult, prevResult)) {
        return;
      } // Determine which callbacks to trigger


      const defaultNotifyOptions = {
        cache: true
      };

      if (notifyOptions?.listeners !== false && this.shouldNotifyListeners(this.currentResult, prevResult)) {
        defaultNotifyOptions.listeners = true;
      }

      this.notify({ ...defaultNotifyOptions,
        ...notifyOptions
      });
    }

    updateQuery() {
      const query = this.client.getQueryCache().build(this.client, this.options);

      if (query === this.currentQuery) {
        return;
      }

      const prevQuery = this.currentQuery;
      this.currentQuery = query;
      this.currentQueryInitialState = query.state;
      this.previousQueryResult = this.currentResult;

      if (this.hasListeners()) {
        prevQuery?.removeObserver(this);
        query.addObserver(this);
      }
    }

    onQueryUpdate(action) {
      const notifyOptions = {};

      if (action.type === 'success') {
        notifyOptions.onSuccess = true;
      } else if (action.type === 'error' && !isCancelledError(action.error)) {
        notifyOptions.onError = true;
      }

      this.updateResult(notifyOptions);

      if (this.hasListeners()) {
        this.updateTimers();
      }
    }

    notify(notifyOptions) {
      notifyManager.batch(() => {
        // First trigger the configuration callbacks
        if (notifyOptions.onSuccess) {
          this.options.onSuccess?.(this.currentResult.data);
          this.options.onSettled?.(this.currentResult.data, null);
        } else if (notifyOptions.onError) {
          this.options.onError?.(this.currentResult.error);
          this.options.onSettled?.(undefined, this.currentResult.error);
        } // Then trigger the listeners


        if (notifyOptions.listeners) {
          this.listeners.forEach(listener => {
            listener(this.currentResult);
          });
        } // Then the cache listeners


        if (notifyOptions.cache) {
          this.client.getQueryCache().notify({
            query: this.currentQuery,
            type: 'observerResultsUpdated'
          });
        }
      });
    }

  }

  function shouldLoadOnMount(query, options) {
    return options.enabled !== false && !query.state.dataUpdatedAt && !(query.state.status === 'error' && options.retryOnMount === false);
  }

  function shouldFetchOnMount(query, options) {
    return shouldLoadOnMount(query, options) || query.state.dataUpdatedAt > 0 && shouldFetchOn(query, options, options.refetchOnMount);
  }

  function shouldFetchOn(query, options, field) {
    if (options.enabled !== false) {
      const value = typeof field === 'function' ? field(query) : field;
      return value === 'always' || value !== false && isStale(query, options);
    }

    return false;
  }

  function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
    return options.enabled !== false && (query !== prevQuery || prevOptions.enabled === false) && (!options.suspense || query.state.status !== 'error') && isStale(query, options);
  }

  function isStale(query, options) {
    return query.isStaleByTime(options.staleTime);
  }

  class QueriesObserver extends Subscribable {
    constructor(client, queries) {
      super();
      this.client = client;
      this.queries = [];
      this.result = [];
      this.observers = [];
      this.observersMap = {};

      if (queries) {
        this.setQueries(queries);
      }
    }

    onSubscribe() {
      if (this.listeners.length === 1) {
        this.observers.forEach(observer => {
          observer.subscribe(result => {
            this.onUpdate(observer, result);
          });
        });
      }
    }

    onUnsubscribe() {
      if (!this.listeners.length) {
        this.destroy();
      }
    }

    destroy() {
      this.listeners = [];
      this.observers.forEach(observer => {
        observer.destroy();
      });
    }

    setQueries(queries, notifyOptions) {
      this.queries = queries;
      this.updateObservers(notifyOptions);
    }

    getCurrentResult() {
      return this.result;
    }

    getOptimisticResult(queries) {
      return this.findMatchingObservers(queries).map(match => match.observer.getOptimisticResult(match.defaultedQueryOptions));
    }

    findMatchingObservers(queries) {
      const prevObservers = this.observers;
      const defaultedQueryOptions = queries.map(options => this.client.defaultQueryObserverOptions(options));
      const matchingObservers = defaultedQueryOptions.flatMap(defaultedOptions => {
        const match = prevObservers.find(observer => observer.options.queryHash === defaultedOptions.queryHash);

        if (match != null) {
          return [{
            defaultedQueryOptions: defaultedOptions,
            observer: match
          }];
        }

        return [];
      });
      const matchedQueryHashes = matchingObservers.map(match => match.defaultedQueryOptions.queryHash);
      const unmatchedQueries = defaultedQueryOptions.filter(defaultedOptions => !matchedQueryHashes.includes(defaultedOptions.queryHash));
      const unmatchedObservers = prevObservers.filter(prevObserver => !matchingObservers.some(match => match.observer === prevObserver));
      const newOrReusedObservers = unmatchedQueries.map((options, index) => {
        if (options.keepPreviousData) {
          // return previous data from one of the observers that no longer match
          const previouslyUsedObserver = unmatchedObservers[index];

          if (previouslyUsedObserver !== undefined) {
            return {
              defaultedQueryOptions: options,
              observer: previouslyUsedObserver
            };
          }
        }

        return {
          defaultedQueryOptions: options,
          observer: this.getObserver(options)
        };
      });

      const sortMatchesByOrderOfQueries = (a, b) => defaultedQueryOptions.indexOf(a.defaultedQueryOptions) - defaultedQueryOptions.indexOf(b.defaultedQueryOptions);

      return matchingObservers.concat(newOrReusedObservers).sort(sortMatchesByOrderOfQueries);
    }

    getObserver(options) {
      const defaultedOptions = this.client.defaultQueryObserverOptions(options);
      const currentObserver = this.observersMap[defaultedOptions.queryHash];
      return currentObserver ?? new QueryObserver(this.client, defaultedOptions);
    }

    updateObservers(notifyOptions) {
      notifyManager.batch(() => {
        const prevObservers = this.observers;
        const newObserverMatches = this.findMatchingObservers(this.queries); // set options for the new observers to notify of changes

        newObserverMatches.forEach(match => match.observer.setOptions(match.defaultedQueryOptions, notifyOptions));
        const newObservers = newObserverMatches.map(match => match.observer);
        const newObserversMap = Object.fromEntries(newObservers.map(observer => [observer.options.queryHash, observer]));
        const newResult = newObservers.map(observer => observer.getCurrentResult());
        const hasIndexChange = newObservers.some((observer, index) => observer !== prevObservers[index]);

        if (prevObservers.length === newObservers.length && !hasIndexChange) {
          return;
        }

        this.observers = newObservers;
        this.observersMap = newObserversMap;
        this.result = newResult;

        if (!this.hasListeners()) {
          return;
        }

        difference(prevObservers, newObservers).forEach(observer => {
          observer.destroy();
        });
        difference(newObservers, prevObservers).forEach(observer => {
          observer.subscribe(result => {
            this.onUpdate(observer, result);
          });
        });
        this.notify();
      });
    }

    onUpdate(observer, result) {
      const index = this.observers.indexOf(observer);

      if (index !== -1) {
        this.result = replaceAt(this.result, index, result);
        this.notify();
      }
    }

    notify() {
      notifyManager.batch(() => {
        this.listeners.forEach(listener => {
          listener(this.result);
        });
      });
    }

  }

  class InfiniteQueryObserver extends QueryObserver {
    // Type override
    // Type override
    // Type override
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
      super.setOptions({ ...options,
        behavior: infiniteQueryBehavior()
      }, notifyOptions);
    }

    getOptimisticResult(options) {
      options.behavior = infiniteQueryBehavior();
      return super.getOptimisticResult(options);
    }

    fetchNextPage(options) {
      return this.fetch({
        // TODO consider removing `?? true` in future breaking change, to be consistent with `refetch` API (see https://github.com/tannerlinsley/react-query/issues/2617)
        cancelRefetch: options?.cancelRefetch ?? true,
        throwOnError: options?.throwOnError,
        meta: {
          fetchMore: {
            direction: 'forward',
            pageParam: options?.pageParam
          }
        }
      });
    }

    fetchPreviousPage(options) {
      return this.fetch({
        // TODO consider removing `?? true` in future breaking change, to be consistent with `refetch` API (see https://github.com/tannerlinsley/react-query/issues/2617)
        cancelRefetch: options?.cancelRefetch ?? true,
        throwOnError: options?.throwOnError,
        meta: {
          fetchMore: {
            direction: 'backward',
            pageParam: options?.pageParam
          }
        }
      });
    }

    createResult(query, options) {
      const {
        state
      } = query;
      const result = super.createResult(query, options);
      return { ...result,
        fetchNextPage: this.fetchNextPage,
        fetchPreviousPage: this.fetchPreviousPage,
        hasNextPage: hasNextPage(options, state.data?.pages),
        hasPreviousPage: hasPreviousPage(options, state.data?.pages),
        isFetchingNextPage: state.isFetching && state.fetchMeta?.fetchMore?.direction === 'forward',
        isFetchingPreviousPage: state.isFetching && state.fetchMeta?.fetchMore?.direction === 'backward'
      };
    }

  }

  // CLASS
  class MutationObserver extends Subscribable {
    constructor(client, options) {
      super();
      this.client = client;
      this.setOptions(options);
      this.bindMethods();
      this.updateResult();
    }

    bindMethods() {
      this.mutate = this.mutate.bind(this);
      this.reset = this.reset.bind(this);
    }

    setOptions(options) {
      this.options = this.client.defaultMutationOptions(options);
    }

    onUnsubscribe() {
      if (!this.listeners.length) {
        this.currentMutation?.removeObserver(this);
      }
    }

    onMutationUpdate(action) {
      this.updateResult(); // Determine which callbacks to trigger

      const notifyOptions = {
        listeners: true
      };

      if (action.type === 'success') {
        notifyOptions.onSuccess = true;
      } else if (action.type === 'error') {
        notifyOptions.onError = true;
      }

      this.notify(notifyOptions);
    }

    getCurrentResult() {
      return this.currentResult;
    }

    reset() {
      this.currentMutation = undefined;
      this.updateResult();
      this.notify({
        listeners: true
      });
    }

    mutate(variables, options) {
      this.mutateOptions = options;

      if (this.currentMutation) {
        this.currentMutation.removeObserver(this);
      }

      this.currentMutation = this.client.getMutationCache().build(this.client, { ...this.options,
        variables: typeof variables !== 'undefined' ? variables : this.options.variables
      });
      this.currentMutation.addObserver(this);
      return this.currentMutation.execute();
    }

    updateResult() {
      const state = this.currentMutation ? this.currentMutation.state : getDefaultState();
      const result = { ...state,
        isLoading: state.status === 'loading',
        isSuccess: state.status === 'success',
        isError: state.status === 'error',
        isIdle: state.status === 'idle',
        mutate: this.mutate,
        reset: this.reset
      };
      this.currentResult = result;
    }

    notify(options) {
      notifyManager.batch(() => {
        // First trigger the mutate callbacks
        if (this.mutateOptions) {
          if (options.onSuccess) {
            this.mutateOptions.onSuccess?.(this.currentResult.data, this.currentResult.variables, this.currentResult.context);
            this.mutateOptions.onSettled?.(this.currentResult.data, null, this.currentResult.variables, this.currentResult.context);
          } else if (options.onError) {
            this.mutateOptions.onError?.(this.currentResult.error, this.currentResult.variables, this.currentResult.context);
            this.mutateOptions.onSettled?.(undefined, this.currentResult.error, this.currentResult.variables, this.currentResult.context);
          }
        } // Then trigger the listeners


        if (options.listeners) {
          this.listeners.forEach(listener => {
            listener(this.currentResult);
          });
        }
      });
    }

  }

  // TYPES
  // FUNCTIONS
  function dehydrateMutation(mutation) {
    return {
      mutationKey: mutation.options.mutationKey,
      state: mutation.state
    };
  } // Most config is not dehydrated but instead meant to configure again when
  // consuming the de/rehydrated data, typically with useQuery on the client.
  // Sometimes it might make sense to prefetch data on the server and include
  // in the html-payload, but not consume it on the initial render.


  function dehydrateQuery(query) {
    return {
      state: query.state,
      queryKey: query.queryKey,
      queryHash: query.queryHash
    };
  }

  function defaultShouldDehydrateMutation(mutation) {
    return mutation.state.isPaused;
  }

  function defaultShouldDehydrateQuery(query) {
    return query.state.status === 'success';
  }

  function dehydrate(client, options) {
    options = options || {};
    const mutations = [];
    const queries = [];

    if (options?.dehydrateMutations !== false) {
      const shouldDehydrateMutation = options.shouldDehydrateMutation || defaultShouldDehydrateMutation;
      client.getMutationCache().getAll().forEach(mutation => {
        if (shouldDehydrateMutation(mutation)) {
          mutations.push(dehydrateMutation(mutation));
        }
      });
    }

    if (options?.dehydrateQueries !== false) {
      const shouldDehydrateQuery = options.shouldDehydrateQuery || defaultShouldDehydrateQuery;
      client.getQueryCache().getAll().forEach(query => {
        if (shouldDehydrateQuery(query)) {
          queries.push(dehydrateQuery(query));
        }
      });
    }

    return {
      mutations,
      queries
    };
  }
  function hydrate(client, dehydratedState, options) {
    if (typeof dehydratedState !== 'object' || dehydratedState === null) {
      return;
    }

    const mutationCache = client.getMutationCache();
    const queryCache = client.getQueryCache();
    const mutations = dehydratedState.mutations || [];
    const queries = dehydratedState.queries || [];
    mutations.forEach(dehydratedMutation => {
      mutationCache.build(client, { ...options?.defaultOptions?.mutations,
        mutationKey: dehydratedMutation.mutationKey
      }, dehydratedMutation.state);
    });
    queries.forEach(dehydratedQuery => {
      const query = queryCache.get(dehydratedQuery.queryHash); // Do not hydrate if an existing query exists with newer data

      if (query) {
        if (query.state.dataUpdatedAt < dehydratedQuery.state.dataUpdatedAt) {
          query.setState(dehydratedQuery.state);
        }

        return;
      } // Restore query


      queryCache.build(client, { ...options?.defaultOptions?.queries,
        queryKey: dehydratedQuery.queryKey,
        queryHash: dehydratedQuery.queryHash
      }, dehydratedQuery.state);
    });
  }

  const defaultContext = /*#__PURE__*/React__default.createContext(undefined);
  const QueryClientSharingContext = /*#__PURE__*/React__default.createContext(false); // if contextSharing is on, we share the first and at least one
  // instance of the context across the window
  // to ensure that if React Query is used across
  // different bundles or microfrontends they will
  // all use the same **instance** of context, regardless
  // of module scoping.

  function getQueryClientContext(contextSharing) {
    if (contextSharing && typeof window !== 'undefined') {
      if (!window.ReactQueryClientContext) {
        window.ReactQueryClientContext = defaultContext;
      }

      return window.ReactQueryClientContext;
    }

    return defaultContext;
  }

  const useQueryClient = () => {
    const queryClient = React__default.useContext(getQueryClientContext(React__default.useContext(QueryClientSharingContext)));

    if (!queryClient) {
      throw new Error('No QueryClient set, use QueryClientProvider to set one');
    }

    return queryClient;
  };
  const QueryClientProvider = ({
    client,
    contextSharing = false,
    children
  }) => {
    React__default.useEffect(() => {
      client.mount();
      return () => {
        client.unmount();
      };
    }, [client]);
    const Context = getQueryClientContext(contextSharing);
    return /*#__PURE__*/React__default.createElement(QueryClientSharingContext.Provider, {
      value: contextSharing
    }, /*#__PURE__*/React__default.createElement(Context.Provider, {
      value: client
    }, children));
  };

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
      }
    };
  }

  const QueryErrorResetBoundaryContext = /*#__PURE__*/React__default.createContext(createValue()); // HOOK

  const useQueryErrorResetBoundary = () => React__default.useContext(QueryErrorResetBoundaryContext); // COMPONENT

  const QueryErrorResetBoundary = ({
    children
  }) => {
    const value = React__default.useMemo(() => createValue(), []);
    return /*#__PURE__*/React__default.createElement(QueryErrorResetBoundaryContext.Provider, {
      value: value
    }, typeof children === 'function' ? children(value) : children);
  };

  const checkIsFetching = (queryClient, filters, isFetching, setIsFetching) => {
    const newIsFetching = queryClient.isFetching(filters);

    if (isFetching !== newIsFetching) {
      setIsFetching(newIsFetching);
    }
  };

  function useIsFetching(arg1, arg2) {
    const mountedRef = React__default.useRef(false);
    const queryClient = useQueryClient();
    const [filters] = parseFilterArgs(arg1, arg2);
    const [isFetching, setIsFetching] = React__default.useState(queryClient.isFetching(filters));
    const filtersRef = React__default.useRef(filters);
    filtersRef.current = filters;
    const isFetchingRef = React__default.useRef(isFetching);
    isFetchingRef.current = isFetching;
    React__default.useEffect(() => {
      mountedRef.current = true;
      checkIsFetching(queryClient, filtersRef.current, isFetchingRef.current, setIsFetching);
      const unsubscribe = queryClient.getQueryCache().subscribe(notifyManager.batchCalls(() => {
        if (mountedRef.current) {
          checkIsFetching(queryClient, filtersRef.current, isFetchingRef.current, setIsFetching);
        }
      }));
      return () => {
        mountedRef.current = false;
        unsubscribe();
      };
    }, [queryClient]);
    return isFetching;
  }

  function useIsMutating(arg1, arg2) {
    const mountedRef = React__default.useRef(false);
    const filters = parseMutationFilterArgs(arg1, arg2);
    const queryClient = useQueryClient();
    const [isMutating, setIsMutating] = React__default.useState(queryClient.isMutating(filters));
    const filtersRef = React__default.useRef(filters);
    filtersRef.current = filters;
    const isMutatingRef = React__default.useRef(isMutating);
    isMutatingRef.current = isMutating;
    React__default.useEffect(() => {
      mountedRef.current = true;
      const unsubscribe = queryClient.getMutationCache().subscribe(notifyManager.batchCalls(() => {
        if (mountedRef.current) {
          const newIsMutating = queryClient.isMutating(filtersRef.current);

          if (isMutatingRef.current !== newIsMutating) {
            setIsMutating(newIsMutating);
          }
        }
      }));
      return () => {
        mountedRef.current = false;
        unsubscribe();
      };
    }, [queryClient]);
    return isMutating;
  }

  function shouldThrowError(suspense, _useErrorBoundary, params) {
    // Allow useErrorBoundary function to override throwing behavior on a per-error basis
    if (typeof _useErrorBoundary === 'function') {
      return _useErrorBoundary(...params);
    } // Allow useErrorBoundary to override suspense's throwing behavior


    if (typeof _useErrorBoundary === 'boolean') return _useErrorBoundary; // If suspense is enabled default to throwing errors

    return !!suspense;
  }

  function useMutation(arg1, arg2, arg3) {
    const mountedRef = React__default.useRef(false);
    const [, forceUpdate] = React__default.useState(0);
    const options = parseMutationArgs(arg1, arg2, arg3);
    const queryClient = useQueryClient();
    const obsRef = React__default.useRef();

    if (!obsRef.current) {
      obsRef.current = new MutationObserver(queryClient, options);
    } else {
      obsRef.current.setOptions(options);
    }

    const currentResult = obsRef.current.getCurrentResult();
    React__default.useEffect(() => {
      mountedRef.current = true;
      const unsubscribe = obsRef.current.subscribe(notifyManager.batchCalls(() => {
        if (mountedRef.current) {
          forceUpdate(x => x + 1);
        }
      }));
      return () => {
        mountedRef.current = false;
        unsubscribe();
      };
    }, []);
    const mutate = React__default.useCallback((variables, mutateOptions) => {
      obsRef.current.mutate(variables, mutateOptions).catch(noop);
    }, []);

    if (currentResult.error && shouldThrowError(undefined, obsRef.current.options.useErrorBoundary, [currentResult.error])) {
      throw currentResult.error;
    }

    return { ...currentResult,
      mutate,
      mutateAsync: currentResult.mutate
    };
  }

  function useBaseQuery(options, Observer) {
    const mountedRef = React__default.useRef(false);
    const [, forceUpdate] = React__default.useState(0);
    const queryClient = useQueryClient();
    const errorResetBoundary = useQueryErrorResetBoundary();
    const defaultedOptions = queryClient.defaultQueryObserverOptions(options); // Make sure results are optimistically set in fetching state before subscribing or updating options

    defaultedOptions.optimisticResults = true; // Include callbacks in batch renders

    if (defaultedOptions.onError) {
      defaultedOptions.onError = notifyManager.batchCalls(defaultedOptions.onError);
    }

    if (defaultedOptions.onSuccess) {
      defaultedOptions.onSuccess = notifyManager.batchCalls(defaultedOptions.onSuccess);
    }

    if (defaultedOptions.onSettled) {
      defaultedOptions.onSettled = notifyManager.batchCalls(defaultedOptions.onSettled);
    }

    if (defaultedOptions.suspense) {
      // Always set stale time when using suspense to prevent
      // fetching again when directly mounting after suspending
      if (typeof defaultedOptions.staleTime !== 'number') {
        defaultedOptions.staleTime = 1000;
      } // Set cache time to 1 if the option has been set to 0
      // when using suspense to prevent infinite loop of fetches


      if (defaultedOptions.cacheTime === 0) {
        defaultedOptions.cacheTime = 1;
      }
    }

    if (defaultedOptions.suspense || defaultedOptions.useErrorBoundary) {
      // Prevent retrying failed query if the error boundary has not been reset yet
      if (!errorResetBoundary.isReset()) {
        defaultedOptions.retryOnMount = false;
      }
    }

    const [observer] = React__default.useState(() => new Observer(queryClient, defaultedOptions));
    let result = observer.getOptimisticResult(defaultedOptions);
    React__default.useEffect(() => {
      mountedRef.current = true;
      errorResetBoundary.clearReset();
      const unsubscribe = observer.subscribe(notifyManager.batchCalls(() => {
        if (mountedRef.current) {
          forceUpdate(x => x + 1);
        }
      })); // Update result to make sure we did not miss any query updates
      // between creating the observer and subscribing to it.

      observer.updateResult();
      return () => {
        mountedRef.current = false;
        unsubscribe();
      };
    }, [errorResetBoundary, observer]);
    React__default.useEffect(() => {
      // Do not notify on updates because of changes in the options because
      // these changes should already be reflected in the optimistic result.
      observer.setOptions(defaultedOptions, {
        listeners: false
      });
    }, [defaultedOptions, observer]); // Handle suspense

    if (defaultedOptions.suspense && result.isLoading) {
      throw observer.fetchOptimistic(defaultedOptions).then(({
        data
      }) => {
        defaultedOptions.onSuccess?.(data);
        defaultedOptions.onSettled?.(data, null);
      }).catch(error => {
        errorResetBoundary.clearReset();
        defaultedOptions.onError?.(error);
        defaultedOptions.onSettled?.(undefined, error);
      });
    } // Handle error boundary


    if (result.isError && !errorResetBoundary.isReset() && !result.isFetching && shouldThrowError(defaultedOptions.suspense, defaultedOptions.useErrorBoundary, [result.error, observer.getCurrentQuery()])) {
      throw result.error;
    } // Handle result property usage tracking


    if (defaultedOptions.notifyOnChangeProps === 'tracked') {
      result = observer.trackResult(result, defaultedOptions);
    }

    return result;
  }

  function useQuery(arg1, arg2, arg3) {
    const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
    return useBaseQuery(parsedOptions, QueryObserver);
  }

  function useQueries(queries) {
    const mountedRef = React__default.useRef(false);
    const [, forceUpdate] = React__default.useState(0);
    const queryClient = useQueryClient();
    const defaultedQueries = React.useMemo(() => queries.map(options => {
      const defaultedOptions = queryClient.defaultQueryObserverOptions(options); // Make sure the results are already in fetching state before subscribing or updating options

      defaultedOptions.optimisticResults = true;
      return defaultedOptions;
    }), [queries, queryClient]);
    const [observer] = React__default.useState(() => new QueriesObserver(queryClient, defaultedQueries));
    const result = observer.getOptimisticResult(defaultedQueries);
    React__default.useEffect(() => {
      mountedRef.current = true;
      const unsubscribe = observer.subscribe(notifyManager.batchCalls(() => {
        if (mountedRef.current) {
          forceUpdate(x => x + 1);
        }
      }));
      return () => {
        mountedRef.current = false;
        unsubscribe();
      };
    }, [observer]);
    React__default.useEffect(() => {
      // Do not notify on updates because of changes in the options because
      // these changes should already be reflected in the optimistic result.
      observer.setQueries(defaultedQueries, {
        listeners: false
      });
    }, [defaultedQueries, observer]);
    return result;
  }

  function useInfiniteQuery(arg1, arg2, arg3) {
    const options = parseQueryArgs(arg1, arg2, arg3);
    return useBaseQuery(options, InfiniteQueryObserver);
  }

  function useHydrate(state, options) {
    const queryClient = useQueryClient();
    const optionsRef = React__default.useRef(options);
    optionsRef.current = options; // Running hydrate again with the same queries is safe,
    // it wont overwrite or initialize existing queries,
    // relying on useMemo here is only a performance optimization.
    // hydrate can and should be run *during* render here for SSR to work properly

    React__default.useMemo(() => {
      if (state) {
        hydrate(queryClient, state, optionsRef.current);
      }
    }, [queryClient, state]);
  }
  const Hydrate = ({
    children,
    options,
    state
  }) => {
    useHydrate(state, options);
    return children;
  };

  exports.CancelledError = CancelledError;
  exports.Hydrate = Hydrate;
  exports.InfiniteQueryObserver = InfiniteQueryObserver;
  exports.MutationCache = MutationCache;
  exports.MutationObserver = MutationObserver;
  exports.QueriesObserver = QueriesObserver;
  exports.QueryCache = QueryCache;
  exports.QueryClient = QueryClient;
  exports.QueryClientProvider = QueryClientProvider;
  exports.QueryErrorResetBoundary = QueryErrorResetBoundary;
  exports.QueryObserver = QueryObserver;
  exports.dehydrate = dehydrate;
  exports.focusManager = focusManager;
  exports.hashQueryKey = hashQueryKey;
  exports.hydrate = hydrate;
  exports.isCancelledError = isCancelledError;
  exports.isError = isError;
  exports.notifyManager = notifyManager;
  exports.onlineManager = onlineManager;
  exports.setLogger = setLogger;
  exports.useHydrate = useHydrate;
  exports.useInfiniteQuery = useInfiniteQuery;
  exports.useIsFetching = useIsFetching;
  exports.useIsMutating = useIsMutating;
  exports.useMutation = useMutation;
  exports.useQueries = useQueries;
  exports.useQuery = useQuery;
  exports.useQueryClient = useQueryClient;
  exports.useQueryErrorResetBoundary = useQueryErrorResetBoundary;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=react-query.development.js.map
