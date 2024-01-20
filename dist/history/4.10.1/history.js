(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.History = {})));
}(this, (function (exports) { 'use strict';

  function isAbsolute(pathname) {
    return pathname.charAt(0) === '/';
  }

  // About 1.5x faster than the two-arg version of Array#splice()
  function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
      list[i] = list[k];
    }

    list.pop();
  }

  // This implementation is based heavily on node's url.parse
  function resolvePathname(to, from) {
    if (from === undefined) from = '';

    var toParts = (to && to.split('/')) || [];
    var fromParts = (from && from.split('/')) || [];

    var isToAbs = to && isAbsolute(to);
    var isFromAbs = from && isAbsolute(from);
    var mustEndAbs = isToAbs || isFromAbs;

    if (to && isAbsolute(to)) {
      // to is absolute
      fromParts = toParts;
    } else if (toParts.length) {
      // to is relative, drop the filename
      fromParts.pop();
      fromParts = fromParts.concat(toParts);
    }

    if (!fromParts.length) return '/';

    var hasTrailingSlash;
    if (fromParts.length) {
      var last = fromParts[fromParts.length - 1];
      hasTrailingSlash = last === '.' || last === '..' || last === '';
    } else {
      hasTrailingSlash = false;
    }

    var up = 0;
    for (var i = fromParts.length; i >= 0; i--) {
      var part = fromParts[i];

      if (part === '.') {
        spliceOne(fromParts, i);
      } else if (part === '..') {
        spliceOne(fromParts, i);
        up++;
      } else if (up) {
        spliceOne(fromParts, i);
        up--;
      }
    }

    if (!mustEndAbs) for (; up--; up) fromParts.unshift('..');

    if (
      mustEndAbs &&
      fromParts[0] !== '' &&
      (!fromParts[0] || !isAbsolute(fromParts[0]))
    )
      fromParts.unshift('');

    var result = fromParts.join('/');

    if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

    return result;
  }

  function valueOf(obj) {
    return obj.valueOf ? obj.valueOf() : Object.prototype.valueOf.call(obj);
  }

  function valueEqual(a, b) {
    // Test for strict equality first.
    if (a === b) return true;

    // Otherwise, if either of them == null they are not equal.
    if (a == null || b == null) return false;

    if (Array.isArray(a)) {
      return (
        Array.isArray(b) &&
        a.length === b.length &&
        a.every(function(item, index) {
          return valueEqual(item, b[index]);
        })
      );
    }

    if (typeof a === 'object' || typeof b === 'object') {
      var aValue = valueOf(a);
      var bValue = valueOf(b);

      if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue);

      return Object.keys(Object.assign({}, a, b)).every(function(key) {
        return valueEqual(a[key], b[key]);
      });
    }

    return false;
  }

  function addLeadingSlash(path) {
    return path.charAt(0) === '/' ? path : '/' + path;
  }

  function stripLeadingSlash(path) {
    return path.charAt(0) === '/' ? path.substr(1) : path;
  }

  function hasBasename(path, prefix) {
    return (
      path.toLowerCase().indexOf(prefix.toLowerCase()) === 0 &&
      '/?#'.indexOf(path.charAt(prefix.length)) !== -1
    );
  }

  function stripBasename(path, prefix) {
    return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
  }

  function stripTrailingSlash(path) {
    return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
  }

  function parsePath(path) {
    let pathname = path || '/';
    let search = '';
    let hash = '';

    const hashIndex = pathname.indexOf('#');
    if (hashIndex !== -1) {
      hash = pathname.substr(hashIndex);
      pathname = pathname.substr(0, hashIndex);
    }

    const searchIndex = pathname.indexOf('?');
    if (searchIndex !== -1) {
      search = pathname.substr(searchIndex);
      pathname = pathname.substr(0, searchIndex);
    }

    return {
      pathname,
      search: search === '?' ? '' : search,
      hash: hash === '#' ? '' : hash
    };
  }

  function createPath(location) {
    const { pathname, search, hash } = location;

    let path = pathname || '/';

    if (search && search !== '?')
      path += search.charAt(0) === '?' ? search : `?${search}`;

    if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : `#${hash}`;

    return path;
  }

  function createLocation(path, state, key, currentLocation) {
    let location;
    if (typeof path === 'string') {
      // Two-arg form: push(path, state)
      location = parsePath(path);
      location.state = state;
    } else {
      // One-arg form: push(location)
      location = { ...path };

      if (location.pathname === undefined) location.pathname = '';

      if (location.search) {
        if (location.search.charAt(0) !== '?')
          location.search = '?' + location.search;
      } else {
        location.search = '';
      }

      if (location.hash) {
        if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
      } else {
        location.hash = '';
      }

      if (state !== undefined && location.state === undefined)
        location.state = state;
    }

    try {
      location.pathname = decodeURI(location.pathname);
    } catch (e) {
      if (e instanceof URIError) {
        throw new URIError(
          'Pathname "' +
            location.pathname +
            '" could not be decoded. ' +
            'This is likely caused by an invalid percent-encoding.'
        );
      } else {
        throw e;
      }
    }

    if (key) location.key = key;

    if (currentLocation) {
      // Resolve incomplete/relative pathname relative to current location.
      if (!location.pathname) {
        location.pathname = currentLocation.pathname;
      } else if (location.pathname.charAt(0) !== '/') {
        location.pathname = resolvePathname(
          location.pathname,
          currentLocation.pathname
        );
      }
    } else {
      // When there is no prior location and pathname is empty, set it to /
      if (!location.pathname) {
        location.pathname = '/';
      }
    }

    return location;
  }

  function locationsAreEqual(a, b) {
    return (
      a.pathname === b.pathname &&
      a.search === b.search &&
      a.hash === b.hash &&
      a.key === b.key &&
      valueEqual(a.state, b.state)
    );
  }

  function warning(condition, message) {
    {
      if (condition) {
        return;
      }

      var text = "Warning: " + message;

      if (typeof console !== 'undefined') {
        console.warn(text);
      }

      try {
        throw Error(text);
      } catch (x) {}
    }
  }

  function createTransitionManager() {
    let prompt = null;

    function setPrompt(nextPrompt) {
      warning(prompt == null, 'A history supports only one prompt at a time');

      prompt = nextPrompt;

      return () => {
        if (prompt === nextPrompt) prompt = null;
      };
    }

    function confirmTransitionTo(
      location,
      action,
      getUserConfirmation,
      callback
    ) {
      // TODO: If another transition starts while we're still confirming
      // the previous one, we may end up in a weird state. Figure out the
      // best way to handle this.
      if (prompt != null) {
        const result =
          typeof prompt === 'function' ? prompt(location, action) : prompt;

        if (typeof result === 'string') {
          if (typeof getUserConfirmation === 'function') {
            getUserConfirmation(result, callback);
          } else {
            warning(
              false,
              'A history needs a getUserConfirmation function in order to use a prompt message'
            );

            callback(true);
          }
        } else {
          // Return false from a transition hook to cancel the transition.
          callback(result !== false);
        }
      } else {
        callback(true);
      }
    }

    let listeners = [];

    function appendListener(fn) {
      let isActive = true;

      function listener(...args) {
        if (isActive) fn(...args);
      }

      listeners.push(listener);

      return () => {
        isActive = false;
        listeners = listeners.filter(item => item !== listener);
      };
    }

    function notifyListeners(...args) {
      listeners.forEach(listener => listener(...args));
    }

    return {
      setPrompt,
      confirmTransitionTo,
      appendListener,
      notifyListeners
    };
  }

  const canUseDOM = !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );

  function getConfirmation(message, callback) {
    callback(window.confirm(message)); // eslint-disable-line no-alert
  }

  /**
   * Returns true if the HTML5 history API is supported. Taken from Modernizr.
   *
   * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
   * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
   * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
   */
  function supportsHistory() {
    const ua = window.navigator.userAgent;

    if (
      (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
      ua.indexOf('Mobile Safari') !== -1 &&
      ua.indexOf('Chrome') === -1 &&
      ua.indexOf('Windows Phone') === -1
    )
      return false;

    return window.history && 'pushState' in window.history;
  }

  /**
   * Returns true if browser fires popstate on hash change.
   * IE10 and IE11 do not.
   */
  function supportsPopStateOnHashChange() {
    return window.navigator.userAgent.indexOf('Trident') === -1;
  }

  /**
   * Returns false if using go(n) with hash history causes a full page reload.
   */
  function supportsGoWithoutReloadUsingHash() {
    return window.navigator.userAgent.indexOf('Firefox') === -1;
  }

  /**
   * Returns true if a given popstate event is an extraneous WebKit event.
   * Accounts for the fact that Chrome on iOS fires real popstate events
   * containing undefined state when pressing the back button.
   */
  function isExtraneousPopstateEvent(event) {
    return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
  }

  var prefix = 'Invariant failed';
  function invariant(condition, message) {
      if (condition) {
          return;
      }
      var provided = typeof message === 'function' ? message() : message;
      var value = provided ? "".concat(prefix, ": ").concat(provided) : prefix;
      throw new Error(value);
  }

  const PopStateEvent = 'popstate';
  const HashChangeEvent = 'hashchange';

  function getHistoryState() {
    try {
      return window.history.state || {};
    } catch (e) {
      // IE 11 sometimes throws when accessing window.history.state
      // See https://github.com/ReactTraining/history/pull/289
      return {};
    }
  }

  /**
   * Creates a history object that uses the HTML5 history API including
   * pushState, replaceState, and the popstate event.
   */
  function createBrowserHistory(props = {}) {
    invariant(canUseDOM, 'Browser history needs a DOM');

    const globalHistory = window.history;
    const canUseHistory = supportsHistory();
    const needsHashChangeListener = !supportsPopStateOnHashChange();

    const {
      forceRefresh = false,
      getUserConfirmation = getConfirmation,
      keyLength = 6
    } = props;
    const basename = props.basename
      ? stripTrailingSlash(addLeadingSlash(props.basename))
      : '';

    function getDOMLocation(historyState) {
      const { key, state } = historyState || {};
      const { pathname, search, hash } = window.location;

      let path = pathname + search + hash;

      warning(
        !basename || hasBasename(path, basename),
        'You are attempting to use a basename on a page whose URL path does not begin ' +
          'with the basename. Expected path "' +
          path +
          '" to begin with "' +
          basename +
          '".'
      );

      if (basename) path = stripBasename(path, basename);

      return createLocation(path, state, key);
    }

    function createKey() {
      return Math.random()
        .toString(36)
        .substr(2, keyLength);
    }

    const transitionManager = createTransitionManager();

    function setState(nextState) {
      Object.assign(history, nextState);
      history.length = globalHistory.length;
      transitionManager.notifyListeners(history.location, history.action);
    }

    function handlePopState(event) {
      // Ignore extraneous popstate events in WebKit.
      if (isExtraneousPopstateEvent(event)) return;
      handlePop(getDOMLocation(event.state));
    }

    function handleHashChange() {
      handlePop(getDOMLocation(getHistoryState()));
    }

    let forceNextPop = false;

    function handlePop(location) {
      if (forceNextPop) {
        forceNextPop = false;
        setState();
      } else {
        const action = 'POP';

        transitionManager.confirmTransitionTo(
          location,
          action,
          getUserConfirmation,
          ok => {
            if (ok) {
              setState({ action, location });
            } else {
              revertPop(location);
            }
          }
        );
      }
    }

    function revertPop(fromLocation) {
      const toLocation = history.location;

      // TODO: We could probably make this more reliable by
      // keeping a list of keys we've seen in sessionStorage.
      // Instead, we just default to 0 for keys we don't know.

      let toIndex = allKeys.indexOf(toLocation.key);

      if (toIndex === -1) toIndex = 0;

      let fromIndex = allKeys.indexOf(fromLocation.key);

      if (fromIndex === -1) fromIndex = 0;

      const delta = toIndex - fromIndex;

      if (delta) {
        forceNextPop = true;
        go(delta);
      }
    }

    const initialLocation = getDOMLocation(getHistoryState());
    let allKeys = [initialLocation.key];

    // Public interface

    function createHref(location) {
      return basename + createPath(location);
    }

    function push(path, state) {
      warning(
        !(
          typeof path === 'object' &&
          path.state !== undefined &&
          state !== undefined
        ),
        'You should avoid providing a 2nd state argument to push when the 1st ' +
          'argument is a location-like object that already has state; it is ignored'
      );

      const action = 'PUSH';
      const location = createLocation(path, state, createKey(), history.location);

      transitionManager.confirmTransitionTo(
        location,
        action,
        getUserConfirmation,
        ok => {
          if (!ok) return;

          const href = createHref(location);
          const { key, state } = location;

          if (canUseHistory) {
            globalHistory.pushState({ key, state }, null, href);

            if (forceRefresh) {
              window.location.href = href;
            } else {
              const prevIndex = allKeys.indexOf(history.location.key);
              const nextKeys = allKeys.slice(0, prevIndex + 1);

              nextKeys.push(location.key);
              allKeys = nextKeys;

              setState({ action, location });
            }
          } else {
            warning(
              state === undefined,
              'Browser history cannot push state in browsers that do not support HTML5 history'
            );

            window.location.href = href;
          }
        }
      );
    }

    function replace(path, state) {
      warning(
        !(
          typeof path === 'object' &&
          path.state !== undefined &&
          state !== undefined
        ),
        'You should avoid providing a 2nd state argument to replace when the 1st ' +
          'argument is a location-like object that already has state; it is ignored'
      );

      const action = 'REPLACE';
      const location = createLocation(path, state, createKey(), history.location);

      transitionManager.confirmTransitionTo(
        location,
        action,
        getUserConfirmation,
        ok => {
          if (!ok) return;

          const href = createHref(location);
          const { key, state } = location;

          if (canUseHistory) {
            globalHistory.replaceState({ key, state }, null, href);

            if (forceRefresh) {
              window.location.replace(href);
            } else {
              const prevIndex = allKeys.indexOf(history.location.key);

              if (prevIndex !== -1) allKeys[prevIndex] = location.key;

              setState({ action, location });
            }
          } else {
            warning(
              state === undefined,
              'Browser history cannot replace state in browsers that do not support HTML5 history'
            );

            window.location.replace(href);
          }
        }
      );
    }

    function go(n) {
      globalHistory.go(n);
    }

    function goBack() {
      go(-1);
    }

    function goForward() {
      go(1);
    }

    let listenerCount = 0;

    function checkDOMListeners(delta) {
      listenerCount += delta;

      if (listenerCount === 1 && delta === 1) {
        window.addEventListener(PopStateEvent, handlePopState);

        if (needsHashChangeListener)
          window.addEventListener(HashChangeEvent, handleHashChange);
      } else if (listenerCount === 0) {
        window.removeEventListener(PopStateEvent, handlePopState);

        if (needsHashChangeListener)
          window.removeEventListener(HashChangeEvent, handleHashChange);
      }
    }

    let isBlocked = false;

    function block(prompt = false) {
      const unblock = transitionManager.setPrompt(prompt);

      if (!isBlocked) {
        checkDOMListeners(1);
        isBlocked = true;
      }

      return () => {
        if (isBlocked) {
          isBlocked = false;
          checkDOMListeners(-1);
        }

        return unblock();
      };
    }

    function listen(listener) {
      const unlisten = transitionManager.appendListener(listener);
      checkDOMListeners(1);

      return () => {
        checkDOMListeners(-1);
        unlisten();
      };
    }

    const history = {
      length: globalHistory.length,
      action: 'POP',
      location: initialLocation,
      createHref,
      push,
      replace,
      go,
      goBack,
      goForward,
      block,
      listen
    };

    return history;
  }

  const HashChangeEvent$1 = 'hashchange';

  const HashPathCoders = {
    hashbang: {
      encodePath: path =>
        path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path),
      decodePath: path => (path.charAt(0) === '!' ? path.substr(1) : path)
    },
    noslash: {
      encodePath: stripLeadingSlash,
      decodePath: addLeadingSlash
    },
    slash: {
      encodePath: addLeadingSlash,
      decodePath: addLeadingSlash
    }
  };

  function stripHash(url) {
    const hashIndex = url.indexOf('#');
    return hashIndex === -1 ? url : url.slice(0, hashIndex);
  }

  function getHashPath() {
    // We can't use window.location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    const href = window.location.href;
    const hashIndex = href.indexOf('#');
    return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
  }

  function pushHashPath(path) {
    window.location.hash = path;
  }

  function replaceHashPath(path) {
    window.location.replace(stripHash(window.location.href) + '#' + path);
  }

  function createHashHistory(props = {}) {
    invariant(canUseDOM, 'Hash history needs a DOM');

    const globalHistory = window.history;
    const canGoWithoutReload = supportsGoWithoutReloadUsingHash();

    const { getUserConfirmation = getConfirmation, hashType = 'slash' } = props;
    const basename = props.basename
      ? stripTrailingSlash(addLeadingSlash(props.basename))
      : '';

    const { encodePath, decodePath } = HashPathCoders[hashType];

    function getDOMLocation() {
      let path = decodePath(getHashPath());

      warning(
        !basename || hasBasename(path, basename),
        'You are attempting to use a basename on a page whose URL path does not begin ' +
          'with the basename. Expected path "' +
          path +
          '" to begin with "' +
          basename +
          '".'
      );

      if (basename) path = stripBasename(path, basename);

      return createLocation(path);
    }

    const transitionManager = createTransitionManager();

    function setState(nextState) {
      Object.assign(history, nextState);
      history.length = globalHistory.length;
      transitionManager.notifyListeners(history.location, history.action);
    }

    let forceNextPop = false;
    let ignorePath = null;

    function locationsAreEqual$$1(a, b) {
      return (
        a.pathname === b.pathname && a.search === b.search && a.hash === b.hash
      );
    }

    function handleHashChange() {
      const path = getHashPath();
      const encodedPath = encodePath(path);

      if (path !== encodedPath) {
        // Ensure we always have a properly-encoded hash.
        replaceHashPath(encodedPath);
      } else {
        const location = getDOMLocation();
        const prevLocation = history.location;

        if (!forceNextPop && locationsAreEqual$$1(prevLocation, location)) return; // A hashchange doesn't always == location change.

        if (ignorePath === createPath(location)) return; // Ignore this change; we already setState in push/replace.

        ignorePath = null;

        handlePop(location);
      }
    }

    function handlePop(location) {
      if (forceNextPop) {
        forceNextPop = false;
        setState();
      } else {
        const action = 'POP';

        transitionManager.confirmTransitionTo(
          location,
          action,
          getUserConfirmation,
          ok => {
            if (ok) {
              setState({ action, location });
            } else {
              revertPop(location);
            }
          }
        );
      }
    }

    function revertPop(fromLocation) {
      const toLocation = history.location;

      // TODO: We could probably make this more reliable by
      // keeping a list of paths we've seen in sessionStorage.
      // Instead, we just default to 0 for paths we don't know.

      let toIndex = allPaths.lastIndexOf(createPath(toLocation));

      if (toIndex === -1) toIndex = 0;

      let fromIndex = allPaths.lastIndexOf(createPath(fromLocation));

      if (fromIndex === -1) fromIndex = 0;

      const delta = toIndex - fromIndex;

      if (delta) {
        forceNextPop = true;
        go(delta);
      }
    }

    // Ensure the hash is encoded properly before doing anything else.
    const path = getHashPath();
    const encodedPath = encodePath(path);

    if (path !== encodedPath) replaceHashPath(encodedPath);

    const initialLocation = getDOMLocation();
    let allPaths = [createPath(initialLocation)];

    // Public interface

    function createHref(location) {
      const baseTag = document.querySelector('base');
      let href = '';
      if (baseTag && baseTag.getAttribute('href')) {
        href = stripHash(window.location.href);
      }
      return href + '#' + encodePath(basename + createPath(location));
    }

    function push(path, state) {
      warning(
        state === undefined,
        'Hash history cannot push state; it is ignored'
      );

      const action = 'PUSH';
      const location = createLocation(
        path,
        undefined,
        undefined,
        history.location
      );

      transitionManager.confirmTransitionTo(
        location,
        action,
        getUserConfirmation,
        ok => {
          if (!ok) return;

          const path = createPath(location);
          const encodedPath = encodePath(basename + path);
          const hashChanged = getHashPath() !== encodedPath;

          if (hashChanged) {
            // We cannot tell if a hashchange was caused by a PUSH, so we'd
            // rather setState here and ignore the hashchange. The caveat here
            // is that other hash histories in the page will consider it a POP.
            ignorePath = path;
            pushHashPath(encodedPath);

            const prevIndex = allPaths.lastIndexOf(createPath(history.location));
            const nextPaths = allPaths.slice(0, prevIndex + 1);

            nextPaths.push(path);
            allPaths = nextPaths;

            setState({ action, location });
          } else {
            warning(
              false,
              'Hash history cannot PUSH the same path; a new entry will not be added to the history stack'
            );

            setState();
          }
        }
      );
    }

    function replace(path, state) {
      warning(
        state === undefined,
        'Hash history cannot replace state; it is ignored'
      );

      const action = 'REPLACE';
      const location = createLocation(
        path,
        undefined,
        undefined,
        history.location
      );

      transitionManager.confirmTransitionTo(
        location,
        action,
        getUserConfirmation,
        ok => {
          if (!ok) return;

          const path = createPath(location);
          const encodedPath = encodePath(basename + path);
          const hashChanged = getHashPath() !== encodedPath;

          if (hashChanged) {
            // We cannot tell if a hashchange was caused by a REPLACE, so we'd
            // rather setState here and ignore the hashchange. The caveat here
            // is that other hash histories in the page will consider it a POP.
            ignorePath = path;
            replaceHashPath(encodedPath);
          }

          const prevIndex = allPaths.indexOf(createPath(history.location));

          if (prevIndex !== -1) allPaths[prevIndex] = path;

          setState({ action, location });
        }
      );
    }

    function go(n) {
      warning(
        canGoWithoutReload,
        'Hash history go(n) causes a full page reload in this browser'
      );

      globalHistory.go(n);
    }

    function goBack() {
      go(-1);
    }

    function goForward() {
      go(1);
    }

    let listenerCount = 0;

    function checkDOMListeners(delta) {
      listenerCount += delta;

      if (listenerCount === 1 && delta === 1) {
        window.addEventListener(HashChangeEvent$1, handleHashChange);
      } else if (listenerCount === 0) {
        window.removeEventListener(HashChangeEvent$1, handleHashChange);
      }
    }

    let isBlocked = false;

    function block(prompt = false) {
      const unblock = transitionManager.setPrompt(prompt);

      if (!isBlocked) {
        checkDOMListeners(1);
        isBlocked = true;
      }

      return () => {
        if (isBlocked) {
          isBlocked = false;
          checkDOMListeners(-1);
        }

        return unblock();
      };
    }

    function listen(listener) {
      const unlisten = transitionManager.appendListener(listener);
      checkDOMListeners(1);

      return () => {
        checkDOMListeners(-1);
        unlisten();
      };
    }

    const history = {
      length: globalHistory.length,
      action: 'POP',
      location: initialLocation,
      createHref,
      push,
      replace,
      go,
      goBack,
      goForward,
      block,
      listen
    };

    return history;
  }

  function clamp(n, lowerBound, upperBound) {
    return Math.min(Math.max(n, lowerBound), upperBound);
  }

  /**
   * Creates a history object that stores locations in memory.
   */
  function createMemoryHistory(props = {}) {
    const {
      getUserConfirmation,
      initialEntries = ['/'],
      initialIndex = 0,
      keyLength = 6
    } = props;

    const transitionManager = createTransitionManager();

    function setState(nextState) {
      Object.assign(history, nextState);
      history.length = history.entries.length;
      transitionManager.notifyListeners(history.location, history.action);
    }

    function createKey() {
      return Math.random()
        .toString(36)
        .substr(2, keyLength);
    }

    const index = clamp(initialIndex, 0, initialEntries.length - 1);
    const entries = initialEntries.map(entry =>
      typeof entry === 'string'
        ? createLocation(entry, undefined, createKey())
        : createLocation(entry, undefined, entry.key || createKey())
    );

    // Public interface

    const createHref = createPath;

    function push(path, state) {
      warning(
        !(
          typeof path === 'object' &&
          path.state !== undefined &&
          state !== undefined
        ),
        'You should avoid providing a 2nd state argument to push when the 1st ' +
          'argument is a location-like object that already has state; it is ignored'
      );

      const action = 'PUSH';
      const location = createLocation(path, state, createKey(), history.location);

      transitionManager.confirmTransitionTo(
        location,
        action,
        getUserConfirmation,
        ok => {
          if (!ok) return;

          const prevIndex = history.index;
          const nextIndex = prevIndex + 1;

          const nextEntries = history.entries.slice(0);
          if (nextEntries.length > nextIndex) {
            nextEntries.splice(
              nextIndex,
              nextEntries.length - nextIndex,
              location
            );
          } else {
            nextEntries.push(location);
          }

          setState({
            action,
            location,
            index: nextIndex,
            entries: nextEntries
          });
        }
      );
    }

    function replace(path, state) {
      warning(
        !(
          typeof path === 'object' &&
          path.state !== undefined &&
          state !== undefined
        ),
        'You should avoid providing a 2nd state argument to replace when the 1st ' +
          'argument is a location-like object that already has state; it is ignored'
      );

      const action = 'REPLACE';
      const location = createLocation(path, state, createKey(), history.location);

      transitionManager.confirmTransitionTo(
        location,
        action,
        getUserConfirmation,
        ok => {
          if (!ok) return;

          history.entries[history.index] = location;

          setState({ action, location });
        }
      );
    }

    function go(n) {
      const nextIndex = clamp(history.index + n, 0, history.entries.length - 1);

      const action = 'POP';
      const location = history.entries[nextIndex];

      transitionManager.confirmTransitionTo(
        location,
        action,
        getUserConfirmation,
        ok => {
          if (ok) {
            setState({
              action,
              location,
              index: nextIndex
            });
          } else {
            // Mimic the behavior of DOM histories by
            // causing a render after a cancelled POP.
            setState();
          }
        }
      );
    }

    function goBack() {
      go(-1);
    }

    function goForward() {
      go(1);
    }

    function canGo(n) {
      const nextIndex = history.index + n;
      return nextIndex >= 0 && nextIndex < history.entries.length;
    }

    function block(prompt = false) {
      return transitionManager.setPrompt(prompt);
    }

    function listen(listener) {
      return transitionManager.appendListener(listener);
    }

    const history = {
      length: entries.length,
      action: 'POP',
      location: entries[index],
      index,
      entries,
      createHref,
      push,
      replace,
      go,
      goBack,
      goForward,
      canGo,
      block,
      listen
    };

    return history;
  }

  exports.createBrowserHistory = createBrowserHistory;
  exports.createHashHistory = createHashHistory;
  exports.createMemoryHistory = createMemoryHistory;
  exports.createLocation = createLocation;
  exports.locationsAreEqual = locationsAreEqual;
  exports.parsePath = parsePath;
  exports.createPath = createPath;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=history.js.map
