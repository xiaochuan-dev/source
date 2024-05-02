var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/react-dom.esm.js
var react_dom_esm_exports = {};
__export(react_dom_esm_exports, {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: () => Internals,
  createPortal: () => createPortal$1,
  createRoot: () => createRoot$1,
  findDOMNode: () => findDOMNode,
  flushSync: () => flushSync$1,
  hydrate: () => hydrate,
  hydrateRoot: () => hydrateRoot$1,
  render: () => render,
  unmountComponentAtNode: () => unmountComponentAtNode,
  unstable_batchedUpdates: () => batchedUpdates$1,
  unstable_renderSubtreeIntoContainer: () => renderSubtreeIntoContainer,
  unstable_runWithPriority: () => runWithPriority,
  version: () => ReactVersion
});
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "react";

// src/scheduler.esm.js
var enableSchedulerDebugging = false;
var enableProfiling = false;
var frameYieldMs = 5;
function push(heap, node) {
  const index2 = heap.length;
  heap.push(node);
  siftUp(heap, node, index2);
}
__name(push, "push");
function peek(heap) {
  return heap.length === 0 ? null : heap[0];
}
__name(peek, "peek");
function pop(heap) {
  if (heap.length === 0) {
    return null;
  }
  const first = heap[0];
  const last = heap.pop();
  if (last !== first) {
    heap[0] = last;
    siftDown(heap, last, 0);
  }
  return first;
}
__name(pop, "pop");
function siftUp(heap, node, i) {
  let index2 = i;
  while (index2 > 0) {
    const parentIndex = index2 - 1 >>> 1;
    const parent = heap[parentIndex];
    if (compare(parent, node) > 0) {
      heap[parentIndex] = node;
      heap[index2] = parent;
      index2 = parentIndex;
    } else {
      return;
    }
  }
}
__name(siftUp, "siftUp");
function siftDown(heap, node, i) {
  let index2 = i;
  const length = heap.length;
  const halfLength = length >>> 1;
  while (index2 < halfLength) {
    const leftIndex = (index2 + 1) * 2 - 1;
    const left = heap[leftIndex];
    const rightIndex = leftIndex + 1;
    const right = heap[rightIndex];
    if (compare(left, node) < 0) {
      if (rightIndex < length && compare(right, left) < 0) {
        heap[index2] = right;
        heap[rightIndex] = node;
        index2 = rightIndex;
      } else {
        heap[index2] = left;
        heap[leftIndex] = node;
        index2 = leftIndex;
      }
    } else if (rightIndex < length && compare(right, node) < 0) {
      heap[index2] = right;
      heap[rightIndex] = node;
      index2 = rightIndex;
    } else {
      return;
    }
  }
}
__name(siftDown, "siftDown");
function compare(a, b) {
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}
__name(compare, "compare");
var ImmediatePriority = 1;
var UserBlockingPriority = 2;
var NormalPriority = 3;
var LowPriority = 4;
var IdlePriority = 5;
function markTaskErrored(task, ms) {
}
__name(markTaskErrored, "markTaskErrored");
var getCurrentTime;
var hasPerformanceNow = typeof performance === "object" && typeof performance.now === "function";
if (hasPerformanceNow) {
  const localPerformance = performance;
  getCurrentTime = /* @__PURE__ */ __name(() => localPerformance.now(), "getCurrentTime");
} else {
  const localDate = Date;
  const initialTime = localDate.now();
  getCurrentTime = /* @__PURE__ */ __name(() => localDate.now() - initialTime, "getCurrentTime");
}
var maxSigned31BitInt = 1073741823;
var IMMEDIATE_PRIORITY_TIMEOUT = -1;
var USER_BLOCKING_PRIORITY_TIMEOUT = 250;
var NORMAL_PRIORITY_TIMEOUT = 5e3;
var LOW_PRIORITY_TIMEOUT = 1e4;
var IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt;
var taskQueue = [];
var timerQueue = [];
var taskIdCounter = 1;
var currentTask = null;
var currentPriorityLevel = NormalPriority;
var isPerformingWork = false;
var isHostCallbackScheduled = false;
var isHostTimeoutScheduled = false;
var localSetTimeout = typeof setTimeout === "function" ? setTimeout : null;
var localClearTimeout = typeof clearTimeout === "function" ? clearTimeout : null;
var localSetImmediate = typeof setImmediate !== "undefined" ? setImmediate : null;
var isInputPending = typeof navigator !== "undefined" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 ? navigator.scheduling.isInputPending.bind(navigator.scheduling) : null;
function advanceTimers(currentTime) {
  let timer = peek(timerQueue);
  while (timer !== null) {
    if (timer.callback === null) {
      pop(timerQueue);
    } else if (timer.startTime <= currentTime) {
      pop(timerQueue);
      timer.sortIndex = timer.expirationTime;
      push(taskQueue, timer);
    } else {
      return;
    }
    timer = peek(timerQueue);
  }
}
__name(advanceTimers, "advanceTimers");
function handleTimeout(currentTime) {
  isHostTimeoutScheduled = false;
  advanceTimers(currentTime);
  if (!isHostCallbackScheduled) {
    if (peek(taskQueue) !== null) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    } else {
      const firstTimer = peek(timerQueue);
      if (firstTimer !== null) {
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }
    }
  }
}
__name(handleTimeout, "handleTimeout");
function flushWork(hasTimeRemaining, initialTime) {
  isHostCallbackScheduled = false;
  if (isHostTimeoutScheduled) {
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }
  isPerformingWork = true;
  const previousPriorityLevel = currentPriorityLevel;
  try {
    if (enableProfiling) {
      try {
        return workLoop(hasTimeRemaining, initialTime);
      } catch (error) {
        if (currentTask !== null) {
          const currentTime = getCurrentTime();
          markTaskErrored(currentTask, currentTime);
          currentTask.isQueued = false;
        }
        throw error;
      }
    } else {
      return workLoop(hasTimeRemaining, initialTime);
    }
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
  }
}
__name(flushWork, "flushWork");
function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime;
  advanceTimers(currentTime);
  currentTask = peek(taskQueue);
  while (currentTask !== null && !enableSchedulerDebugging) {
    if (currentTask.expirationTime > currentTime && (!hasTimeRemaining || shouldYieldToHost())) {
      break;
    }
    const callback = currentTask.callback;
    if (typeof callback === "function") {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();
      if (typeof continuationCallback === "function") {
        currentTask.callback = continuationCallback;
      } else {
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }
      advanceTimers(currentTime);
    } else {
      pop(taskQueue);
    }
    currentTask = peek(taskQueue);
  }
  if (currentTask !== null) {
    return true;
  } else {
    const firstTimer = peek(timerQueue);
    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
    return false;
  }
}
__name(workLoop, "workLoop");
function unstable_scheduleCallback(priorityLevel, callback, options) {
  var currentTime = getCurrentTime();
  var startTime2;
  if (typeof options === "object" && options !== null) {
    var delay = options.delay;
    if (typeof delay === "number" && delay > 0) {
      startTime2 = currentTime + delay;
    } else {
      startTime2 = currentTime;
    }
  } else {
    startTime2 = currentTime;
  }
  var timeout;
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT;
      break;
    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
      break;
    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT;
      break;
    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT;
      break;
    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT;
      break;
  }
  var expirationTime = startTime2 + timeout;
  var newTask = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime: startTime2,
    expirationTime,
    sortIndex: -1
  };
  if (startTime2 > currentTime) {
    newTask.sortIndex = startTime2;
    push(timerQueue, newTask);
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      if (isHostTimeoutScheduled) {
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }
      requestHostTimeout(handleTimeout, startTime2 - currentTime);
    }
  } else {
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }
  return newTask;
}
__name(unstable_scheduleCallback, "unstable_scheduleCallback");
function unstable_cancelCallback(task) {
  task.callback = null;
}
__name(unstable_cancelCallback, "unstable_cancelCallback");
function unstable_getCurrentPriorityLevel() {
  return currentPriorityLevel;
}
__name(unstable_getCurrentPriorityLevel, "unstable_getCurrentPriorityLevel");
var isMessageLoopRunning = false;
var scheduledHostCallback = null;
var taskTimeoutID = -1;
var frameInterval = frameYieldMs;
var startTime = -1;
function shouldYieldToHost() {
  const timeElapsed = getCurrentTime() - startTime;
  if (timeElapsed < frameInterval) {
    return false;
  }
  return true;
}
__name(shouldYieldToHost, "shouldYieldToHost");
function requestPaint() {
}
__name(requestPaint, "requestPaint");
var performWorkUntilDeadline = /* @__PURE__ */ __name(() => {
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime();
    startTime = currentTime;
    const hasTimeRemaining = true;
    let hasMoreWork = true;
    try {
      hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
    } finally {
      if (hasMoreWork) {
        schedulePerformWorkUntilDeadline();
      } else {
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      }
    }
  } else {
    isMessageLoopRunning = false;
  }
}, "performWorkUntilDeadline");
var schedulePerformWorkUntilDeadline;
if (typeof localSetImmediate === "function") {
  schedulePerformWorkUntilDeadline = /* @__PURE__ */ __name(() => {
    localSetImmediate(performWorkUntilDeadline);
  }, "schedulePerformWorkUntilDeadline");
} else if (typeof MessageChannel !== "undefined") {
  const channel = new MessageChannel();
  const port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;
  schedulePerformWorkUntilDeadline = /* @__PURE__ */ __name(() => {
    port.postMessage(null);
  }, "schedulePerformWorkUntilDeadline");
} else {
  schedulePerformWorkUntilDeadline = /* @__PURE__ */ __name(() => {
    localSetTimeout(performWorkUntilDeadline, 0);
  }, "schedulePerformWorkUntilDeadline");
}
function requestHostCallback(callback) {
  scheduledHostCallback = callback;
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    schedulePerformWorkUntilDeadline();
  }
}
__name(requestHostCallback, "requestHostCallback");
function requestHostTimeout(callback, ms) {
  taskTimeoutID = localSetTimeout(() => {
    callback(getCurrentTime());
  }, ms);
}
__name(requestHostTimeout, "requestHostTimeout");
function cancelHostTimeout() {
  localClearTimeout(taskTimeoutID);
  taskTimeoutID = -1;
}
__name(cancelHostTimeout, "cancelHostTimeout");
var unstable_requestPaint = requestPaint;

// src/react-dom.esm.js
function formatProdErrorMessage(code) {
  let url = "https://reactjs.org/docs/error-decoder.html?invariant=" + code;
  for (let i = 1; i < arguments.length; i++) {
    url += "&args[]=" + encodeURIComponent(arguments[i]);
  }
  return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
__name(formatProdErrorMessage, "formatProdErrorMessage");
var FunctionComponent = 0;
var ClassComponent = 1;
var IndeterminateComponent = 2;
var HostRoot = 3;
var HostPortal = 4;
var HostComponent = 5;
var HostText = 6;
var Fragment = 7;
var Mode = 8;
var ContextConsumer = 9;
var ContextProvider = 10;
var ForwardRef = 11;
var Profiler = 12;
var SuspenseComponent = 13;
var MemoComponent = 14;
var SimpleMemoComponent = 15;
var LazyComponent = 16;
var IncompleteClassComponent = 17;
var DehydratedFragment = 18;
var SuspenseListComponent = 19;
var ScopeComponent = 21;
var OffscreenComponent = 22;
var LegacyHiddenComponent = 23;
var CacheComponent = 24;
var TracingMarkerComponent = 25;
var enableClientRenderFallbackOnTextMismatch = true;
var enableNewReconciler = false;
var enableLazyContextPropagation = false;
var enableLegacyHidden = false;
var enableSuspenseAvoidThisFallback = false;
var disableCommentsAsDOMContainers = true;
var enableSchedulingProfiler = false;
var enableProfilerTimer = false;
var enableProfilerCommitHooks = false;
var allNativeEvents = /* @__PURE__ */ new Set();
var registrationNameDependencies = {};
function registerTwoPhaseEvent(registrationName, dependencies) {
  registerDirectEvent(registrationName, dependencies);
  registerDirectEvent(registrationName + "Capture", dependencies);
}
__name(registerTwoPhaseEvent, "registerTwoPhaseEvent");
function registerDirectEvent(registrationName, dependencies) {
  registrationNameDependencies[registrationName] = dependencies;
  for (let i = 0; i < dependencies.length; i++) {
    allNativeEvents.add(dependencies[i]);
  }
}
__name(registerDirectEvent, "registerDirectEvent");
var canUseDOM = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
var hasOwnProperty = Object.prototype.hasOwnProperty;
var RESERVED = 0;
var STRING = 1;
var BOOLEANISH_STRING = 2;
var BOOLEAN = 3;
var OVERLOADED_BOOLEAN = 4;
var NUMERIC = 5;
var POSITIVE_NUMERIC = 6;
var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
var VALID_ATTRIBUTE_NAME_REGEX = new RegExp("^[" + ATTRIBUTE_NAME_START_CHAR + "][" + ATTRIBUTE_NAME_CHAR + "]*$");
var illegalAttributeNameCache = {};
var validatedAttributeNameCache = {};
function isAttributeNameSafe(attributeName) {
  if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) {
    return true;
  }
  if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) {
    return false;
  }
  if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
    validatedAttributeNameCache[attributeName] = true;
    return true;
  }
  illegalAttributeNameCache[attributeName] = true;
  return false;
}
__name(isAttributeNameSafe, "isAttributeNameSafe");
function shouldIgnoreAttribute(name, propertyInfo, isCustomComponentTag) {
  if (propertyInfo !== null) {
    return propertyInfo.type === RESERVED;
  }
  if (isCustomComponentTag) {
    return false;
  }
  if (name.length > 2 && (name[0] === "o" || name[0] === "O") && (name[1] === "n" || name[1] === "N")) {
    return true;
  }
  return false;
}
__name(shouldIgnoreAttribute, "shouldIgnoreAttribute");
function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
  if (propertyInfo !== null && propertyInfo.type === RESERVED) {
    return false;
  }
  switch (typeof value) {
    case "function":
    case "symbol":
      return true;
    case "boolean": {
      if (isCustomComponentTag) {
        return false;
      }
      if (propertyInfo !== null) {
        return !propertyInfo.acceptsBooleans;
      } else {
        const prefix2 = name.toLowerCase().slice(0, 5);
        return prefix2 !== "data-" && prefix2 !== "aria-";
      }
    }
    default:
      return false;
  }
}
__name(shouldRemoveAttributeWithWarning, "shouldRemoveAttributeWithWarning");
function shouldRemoveAttribute(name, value, propertyInfo, isCustomComponentTag) {
  if (value === null || typeof value === "undefined") {
    return true;
  }
  if (shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag)) {
    return true;
  }
  if (isCustomComponentTag) {
    {
      if (value === false) {
        return true;
      }
    }
    return false;
  }
  if (propertyInfo !== null) {
    switch (propertyInfo.type) {
      case BOOLEAN:
        return !value;
      case OVERLOADED_BOOLEAN:
        return value === false;
      case NUMERIC:
        return isNaN(value);
      case POSITIVE_NUMERIC:
        return isNaN(value) || value < 1;
    }
  }
  return false;
}
__name(shouldRemoveAttribute, "shouldRemoveAttribute");
function getPropertyInfo(name) {
  return properties.hasOwnProperty(name) ? properties[name] : null;
}
__name(getPropertyInfo, "getPropertyInfo");
function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace, sanitizeURL2, removeEmptyString) {
  this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
  this.attributeName = attributeName;
  this.attributeNamespace = attributeNamespace;
  this.mustUseProperty = mustUseProperty;
  this.propertyName = name;
  this.type = type;
  this.sanitizeURL = sanitizeURL2;
  this.removeEmptyString = removeEmptyString;
}
__name(PropertyInfoRecord, "PropertyInfoRecord");
var properties = {};
var reservedProps = [
  "children",
  "dangerouslySetInnerHTML",
  // TODO: This prevents the assignment of defaultValue to regular
  // elements (not just inputs). Now that ReactDOMInput assigns to the
  // defaultValue property -- do we need this?
  "defaultValue",
  "defaultChecked",
  "innerHTML",
  "suppressContentEditableWarning",
  "suppressHydrationWarning",
  "style"
];
{
  reservedProps.push("innerText", "textContent");
}
reservedProps.forEach((name) => {
  properties[name] = new PropertyInfoRecord(
    name,
    RESERVED,
    false,
    // mustUseProperty
    name,
    // attributeName
    null,
    // attributeNamespace
    false,
    // sanitizeURL
    false
  );
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach((_ref) => {
  let name = _ref[0], attributeName = _ref[1];
  properties[name] = new PropertyInfoRecord(
    name,
    STRING,
    false,
    // mustUseProperty
    attributeName,
    // attributeName
    null,
    // attributeNamespace
    false,
    // sanitizeURL
    false
  );
});
["contentEditable", "draggable", "spellCheck", "value"].forEach((name) => {
  properties[name] = new PropertyInfoRecord(
    name,
    BOOLEANISH_STRING,
    false,
    // mustUseProperty
    name.toLowerCase(),
    // attributeName
    null,
    // attributeNamespace
    false,
    // sanitizeURL
    false
  );
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach((name) => {
  properties[name] = new PropertyInfoRecord(
    name,
    BOOLEANISH_STRING,
    false,
    // mustUseProperty
    name,
    // attributeName
    null,
    // attributeNamespace
    false,
    // sanitizeURL
    false
  );
});
[
  "allowFullScreen",
  "async",
  // Note: there is a special case that prevents it from being written to the DOM
  // on the client side because the browsers are inconsistent. Instead we call focus().
  "autoFocus",
  "autoPlay",
  "controls",
  "default",
  "defer",
  "disabled",
  "disablePictureInPicture",
  "disableRemotePlayback",
  "formNoValidate",
  "hidden",
  "loop",
  "noModule",
  "noValidate",
  "open",
  "playsInline",
  "readOnly",
  "required",
  "reversed",
  "scoped",
  "seamless",
  // Microdata
  "itemScope"
].forEach((name) => {
  properties[name] = new PropertyInfoRecord(
    name,
    BOOLEAN,
    false,
    // mustUseProperty
    name.toLowerCase(),
    // attributeName
    null,
    // attributeNamespace
    false,
    // sanitizeURL
    false
  );
});
[
  "checked",
  // Note: `option.selected` is not updated if `select.multiple` is
  // disabled with `removeAttribute`. We have special logic for handling this.
  "multiple",
  "muted",
  "selected"
  // NOTE: if you add a camelCased prop to this list,
  // you'll need to set attributeName to name.toLowerCase()
  // instead in the assignment below.
].forEach((name) => {
  properties[name] = new PropertyInfoRecord(
    name,
    BOOLEAN,
    true,
    // mustUseProperty
    name,
    // attributeName
    null,
    // attributeNamespace
    false,
    // sanitizeURL
    false
  );
});
[
  "capture",
  "download"
  // NOTE: if you add a camelCased prop to this list,
  // you'll need to set attributeName to name.toLowerCase()
  // instead in the assignment below.
].forEach((name) => {
  properties[name] = new PropertyInfoRecord(
    name,
    OVERLOADED_BOOLEAN,
    false,
    // mustUseProperty
    name,
    // attributeName
    null,
    // attributeNamespace
    false,
    // sanitizeURL
    false
  );
});
[
  "cols",
  "rows",
  "size",
  "span"
  // NOTE: if you add a camelCased prop to this list,
  // you'll need to set attributeName to name.toLowerCase()
  // instead in the assignment below.
].forEach((name) => {
  properties[name] = new PropertyInfoRecord(
    name,
    POSITIVE_NUMERIC,
    false,
    // mustUseProperty
    name,
    // attributeName
    null,
    // attributeNamespace
    false,
    // sanitizeURL
    false
  );
});
["rowSpan", "start"].forEach((name) => {
  properties[name] = new PropertyInfoRecord(
    name,
    NUMERIC,
    false,
    // mustUseProperty
    name.toLowerCase(),
    // attributeName
    null,
    // attributeNamespace
    false,
    // sanitizeURL
    false
  );
});
var CAMELIZE = /[\-\:]([a-z])/g;
var capitalize = /* @__PURE__ */ __name((token) => token[1].toUpperCase(), "capitalize");
[
  "accent-height",
  "alignment-baseline",
  "arabic-form",
  "baseline-shift",
  "cap-height",
  "clip-path",
  "clip-rule",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "dominant-baseline",
  "enable-background",
  "fill-opacity",
  "fill-rule",
  "flood-color",
  "flood-opacity",
  "font-family",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-variant",
  "font-weight",
  "glyph-name",
  "glyph-orientation-horizontal",
  "glyph-orientation-vertical",
  "horiz-adv-x",
  "horiz-origin-x",
  "image-rendering",
  "letter-spacing",
  "lighting-color",
  "marker-end",
  "marker-mid",
  "marker-start",
  "overline-position",
  "overline-thickness",
  "paint-order",
  "panose-1",
  "pointer-events",
  "rendering-intent",
  "shape-rendering",
  "stop-color",
  "stop-opacity",
  "strikethrough-position",
  "strikethrough-thickness",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "text-anchor",
  "text-decoration",
  "text-rendering",
  "underline-position",
  "underline-thickness",
  "unicode-bidi",
  "unicode-range",
  "units-per-em",
  "v-alphabetic",
  "v-hanging",
  "v-ideographic",
  "v-mathematical",
  "vector-effect",
  "vert-adv-y",
  "vert-origin-x",
  "vert-origin-y",
  "word-spacing",
  "writing-mode",
  "xmlns:xlink",
  "x-height"
  // NOTE: if you add a camelCased prop to this list,
  // you'll need to set attributeName to name.toLowerCase()
  // instead in the assignment below.
].forEach((attributeName) => {
  const name = attributeName.replace(CAMELIZE, capitalize);
  properties[name] = new PropertyInfoRecord(
    name,
    STRING,
    false,
    // mustUseProperty
    attributeName,
    null,
    // attributeNamespace
    false,
    // sanitizeURL
    false
  );
});
[
  "xlink:actuate",
  "xlink:arcrole",
  "xlink:role",
  "xlink:show",
  "xlink:title",
  "xlink:type"
  // NOTE: if you add a camelCased prop to this list,
  // you'll need to set attributeName to name.toLowerCase()
  // instead in the assignment below.
].forEach((attributeName) => {
  const name = attributeName.replace(CAMELIZE, capitalize);
  properties[name] = new PropertyInfoRecord(
    name,
    STRING,
    false,
    // mustUseProperty
    attributeName,
    "http://www.w3.org/1999/xlink",
    false,
    // sanitizeURL
    false
  );
});
[
  "xml:base",
  "xml:lang",
  "xml:space"
  // NOTE: if you add a camelCased prop to this list,
  // you'll need to set attributeName to name.toLowerCase()
  // instead in the assignment below.
].forEach((attributeName) => {
  const name = attributeName.replace(CAMELIZE, capitalize);
  properties[name] = new PropertyInfoRecord(
    name,
    STRING,
    false,
    // mustUseProperty
    attributeName,
    "http://www.w3.org/XML/1998/namespace",
    false,
    // sanitizeURL
    false
  );
});
["tabIndex", "crossOrigin"].forEach((attributeName) => {
  properties[attributeName] = new PropertyInfoRecord(
    attributeName,
    STRING,
    false,
    // mustUseProperty
    attributeName.toLowerCase(),
    // attributeName
    null,
    // attributeNamespace
    false,
    // sanitizeURL
    false
  );
});
var xlinkHref = "xlinkHref";
properties[xlinkHref] = new PropertyInfoRecord(
  "xlinkHref",
  STRING,
  false,
  // mustUseProperty
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  true,
  // sanitizeURL
  false
);
["src", "href", "action", "formAction"].forEach((attributeName) => {
  properties[attributeName] = new PropertyInfoRecord(
    attributeName,
    STRING,
    false,
    // mustUseProperty
    attributeName.toLowerCase(),
    // attributeName
    null,
    // attributeNamespace
    true,
    // sanitizeURL
    true
  );
});
function sanitizeURL(url) {
}
__name(sanitizeURL, "sanitizeURL");
function setValueForProperty(node, name, value, isCustomComponentTag) {
  const propertyInfo = getPropertyInfo(name);
  if (shouldIgnoreAttribute(name, propertyInfo, isCustomComponentTag)) {
    return;
  }
  if (isCustomComponentTag && name[0] === "o" && name[1] === "n") {
    let eventName = name.replace(/Capture$/, "");
    const useCapture = name !== eventName;
    eventName = eventName.slice(2);
    const prevProps = getFiberCurrentPropsFromNode(node);
    const prevValue = prevProps != null ? prevProps[name] : null;
    if (typeof prevValue === "function") {
      node.removeEventListener(eventName, prevValue, useCapture);
    }
    if (typeof value === "function") {
      if (typeof prevValue !== "function" && prevValue !== null) {
        if (name in node) {
          node[name] = null;
        } else if (node.hasAttribute(name)) {
          node.removeAttribute(name);
        }
      }
      node.addEventListener(eventName, value, useCapture);
      return;
    }
  }
  if (isCustomComponentTag && name in node) {
    node[name] = value;
    return;
  }
  if (shouldRemoveAttribute(name, value, propertyInfo, isCustomComponentTag)) {
    value = null;
  }
  {
    if (isCustomComponentTag && value === true) {
      value = "";
    }
  }
  if (isCustomComponentTag || propertyInfo === null) {
    if (isAttributeNameSafe(name)) {
      const attributeName2 = name;
      if (value === null) {
        node.removeAttribute(attributeName2);
      } else {
        node.setAttribute(attributeName2, "" + value);
      }
    }
    return;
  }
  const mustUseProperty = propertyInfo.mustUseProperty;
  if (mustUseProperty) {
    const propertyName = propertyInfo.propertyName;
    if (value === null) {
      const type = propertyInfo.type;
      node[propertyName] = type === BOOLEAN ? false : "";
    } else {
      node[propertyName] = value;
    }
    return;
  }
  const attributeName = propertyInfo.attributeName, attributeNamespace = propertyInfo.attributeNamespace;
  if (value === null) {
    node.removeAttribute(attributeName);
  } else {
    const type = propertyInfo.type;
    let attributeValue;
    if (type === BOOLEAN || type === OVERLOADED_BOOLEAN && value === true) {
      attributeValue = "";
    } else {
      {
        attributeValue = "" + value;
      }
      if (propertyInfo.sanitizeURL) {
        sanitizeURL(attributeValue.toString());
      }
    }
    if (attributeNamespace) {
      node.setAttributeNS(attributeNamespace, attributeName, attributeValue);
    } else {
      node.setAttribute(attributeName, attributeValue);
    }
  }
}
__name(setValueForProperty, "setValueForProperty");
var ReactSharedInternals = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
var REACT_ELEMENT_TYPE = Symbol.for("react.element");
var REACT_PORTAL_TYPE = Symbol.for("react.portal");
var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
var REACT_CONTEXT_TYPE = Symbol.for("react.context");
var REACT_SERVER_CONTEXT_TYPE = Symbol.for("react.server_context");
var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
var REACT_MEMO_TYPE = Symbol.for("react.memo");
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
var REACT_SCOPE_TYPE = Symbol.for("react.scope");
var REACT_DEBUG_TRACING_MODE_TYPE = Symbol.for("react.debug_trace_mode");
var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
var REACT_LEGACY_HIDDEN_TYPE = Symbol.for("react.legacy_hidden");
var REACT_CACHE_TYPE = Symbol.for("react.cache");
var REACT_TRACING_MARKER_TYPE = Symbol.for("react.tracing_marker");
var REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED = Symbol.for("react.default_value");
var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = "@@iterator";
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== "object") {
    return null;
  }
  const maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
  if (typeof maybeIterator === "function") {
    return maybeIterator;
  }
  return null;
}
__name(getIteratorFn, "getIteratorFn");
var assign = Object.assign;
var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
var prefix;
function describeBuiltInComponentFrame(name, source, ownerFn) {
  {
    if (prefix === void 0) {
      try {
        throw Error();
      } catch (x) {
        const match = x.stack.trim().match(/\n( *(at )?)/);
        prefix = match && match[1] || "";
      }
    }
    return "\n" + prefix + name;
  }
}
__name(describeBuiltInComponentFrame, "describeBuiltInComponentFrame");
var reentry = false;
function describeNativeComponentFrame(fn, construct) {
  if (!fn || reentry) {
    return "";
  }
  let control;
  reentry = true;
  const previousPrepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (construct) {
      const Fake = /* @__PURE__ */ __name(function() {
        throw Error();
      }, "Fake");
      Object.defineProperty(Fake.prototype, "props", {
        set: function() {
          throw Error();
        }
      });
      if (typeof Reflect === "object" && Reflect.construct) {
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
      fn();
    }
  } catch (sample) {
    if (sample && control && typeof sample.stack === "string") {
      const sampleLines = sample.stack.split("\n");
      const controlLines = control.stack.split("\n");
      let s = sampleLines.length - 1;
      let c = controlLines.length - 1;
      while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
        c--;
      }
      for (; s >= 1 && c >= 0; s--, c--) {
        if (sampleLines[s] !== controlLines[c]) {
          if (s !== 1 || c !== 1) {
            do {
              s--;
              c--;
              if (c < 0 || sampleLines[s] !== controlLines[c]) {
                let frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                if (fn.displayName && frame.includes("<anonymous>")) {
                  frame = frame.replace("<anonymous>", fn.displayName);
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
    Error.prepareStackTrace = previousPrepareStackTrace;
  }
  const name = fn ? fn.displayName || fn.name : "";
  const syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
  return syntheticFrame;
}
__name(describeNativeComponentFrame, "describeNativeComponentFrame");
function describeClassComponentFrame(ctor, source, ownerFn) {
  {
    return describeNativeComponentFrame(ctor, true);
  }
}
__name(describeClassComponentFrame, "describeClassComponentFrame");
function describeFunctionComponentFrame(fn, source, ownerFn) {
  {
    return describeNativeComponentFrame(fn, false);
  }
}
__name(describeFunctionComponentFrame, "describeFunctionComponentFrame");
function describeFiber(fiber) {
  switch (fiber.tag) {
    case HostComponent:
      return describeBuiltInComponentFrame(fiber.type);
    case LazyComponent:
      return describeBuiltInComponentFrame("Lazy");
    case SuspenseComponent:
      return describeBuiltInComponentFrame("Suspense");
    case SuspenseListComponent:
      return describeBuiltInComponentFrame("SuspenseList");
    case FunctionComponent:
    case IndeterminateComponent:
    case SimpleMemoComponent:
      return describeFunctionComponentFrame(fiber.type);
    case ForwardRef:
      return describeFunctionComponentFrame(fiber.type.render);
    case ClassComponent:
      return describeClassComponentFrame(fiber.type);
    default:
      return "";
  }
}
__name(describeFiber, "describeFiber");
function getStackByFiberInDevAndProd(workInProgress2) {
  try {
    let info = "";
    let node = workInProgress2;
    do {
      info += describeFiber(node);
      node = node.return;
    } while (node);
    return info;
  } catch (x) {
    return "\nError generating stack: " + x.message + "\n" + x.stack;
  }
}
__name(getStackByFiberInDevAndProd, "getStackByFiberInDevAndProd");
function getWrappedName(outerType, innerType, wrapperName) {
  const displayName = outerType.displayName;
  if (displayName) {
    return displayName;
  }
  const functionName = innerType.displayName || innerType.name || "";
  return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
}
__name(getWrappedName, "getWrappedName");
function getContextName(type) {
  return type.displayName || "Context";
}
__name(getContextName, "getContextName");
function getComponentNameFromType(type) {
  if (type == null) {
    return null;
  }
  if (typeof type === "function") {
    return type.displayName || type.name || null;
  }
  if (typeof type === "string") {
    return type;
  }
  switch (type) {
    case REACT_FRAGMENT_TYPE:
      return "Fragment";
    case REACT_PORTAL_TYPE:
      return "Portal";
    case REACT_PROFILER_TYPE:
      return "Profiler";
    case REACT_STRICT_MODE_TYPE:
      return "StrictMode";
    case REACT_SUSPENSE_TYPE:
      return "Suspense";
    case REACT_SUSPENSE_LIST_TYPE:
      return "SuspenseList";
    case REACT_CACHE_TYPE: {
      return "Cache";
    }
  }
  if (typeof type === "object") {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        const context = type;
        return getContextName(context) + ".Consumer";
      case REACT_PROVIDER_TYPE:
        const provider = type;
        return getContextName(provider._context) + ".Provider";
      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, "ForwardRef");
      case REACT_MEMO_TYPE:
        const outerName = type.displayName || null;
        if (outerName !== null) {
          return outerName;
        }
        return getComponentNameFromType(type.type) || "Memo";
      case REACT_LAZY_TYPE: {
        const lazyComponent = type;
        const payload = lazyComponent._payload;
        const init = lazyComponent._init;
        try {
          return getComponentNameFromType(init(payload));
        } catch (x) {
          return null;
        }
      }
      case REACT_SERVER_CONTEXT_TYPE: {
        const context2 = type;
        return (context2.displayName || context2._globalName) + ".Provider";
      }
    }
  }
  return null;
}
__name(getComponentNameFromType, "getComponentNameFromType");
function getWrappedName$1(outerType, innerType, wrapperName) {
  const functionName = innerType.displayName || innerType.name || "";
  return outerType.displayName || (functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName);
}
__name(getWrappedName$1, "getWrappedName$1");
function getContextName$1(type) {
  return type.displayName || "Context";
}
__name(getContextName$1, "getContextName$1");
function getComponentNameFromFiber(fiber) {
  const tag = fiber.tag, type = fiber.type;
  switch (tag) {
    case CacheComponent:
      return "Cache";
    case ContextConsumer:
      const context = type;
      return getContextName$1(context) + ".Consumer";
    case ContextProvider:
      const provider = type;
      return getContextName$1(provider._context) + ".Provider";
    case DehydratedFragment:
      return "DehydratedFragment";
    case ForwardRef:
      return getWrappedName$1(type, type.render, "ForwardRef");
    case Fragment:
      return "Fragment";
    case HostComponent:
      return type;
    case HostPortal:
      return "Portal";
    case HostRoot:
      return "Root";
    case HostText:
      return "Text";
    case LazyComponent:
      return getComponentNameFromType(type);
    case Mode:
      if (type === REACT_STRICT_MODE_TYPE) {
        return "StrictMode";
      }
      return "Mode";
    case OffscreenComponent:
      return "Offscreen";
    case Profiler:
      return "Profiler";
    case ScopeComponent:
      return "Scope";
    case SuspenseComponent:
      return "Suspense";
    case SuspenseListComponent:
      return "SuspenseList";
    case TracingMarkerComponent:
      return "TracingMarker";
    case ClassComponent:
    case FunctionComponent:
    case IncompleteClassComponent:
    case IndeterminateComponent:
    case MemoComponent:
    case SimpleMemoComponent:
      if (typeof type === "function") {
        return type.displayName || type.name || null;
      }
      if (typeof type === "string") {
        return type;
      }
      break;
  }
  return null;
}
__name(getComponentNameFromFiber, "getComponentNameFromFiber");
var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
function resetCurrentFiber() {
}
__name(resetCurrentFiber, "resetCurrentFiber");
function toString(value) {
  return "" + value;
}
__name(toString, "toString");
function getToStringValue(value) {
  switch (typeof value) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return value;
    case "object":
      return value;
    default:
      return "";
  }
}
__name(getToStringValue, "getToStringValue");
function isCheckable(elem) {
  const type = elem.type;
  const nodeName = elem.nodeName;
  return nodeName && nodeName.toLowerCase() === "input" && (type === "checkbox" || type === "radio");
}
__name(isCheckable, "isCheckable");
function getTracker(node) {
  return node._valueTracker;
}
__name(getTracker, "getTracker");
function detachTracker(node) {
  node._valueTracker = null;
}
__name(detachTracker, "detachTracker");
function getValueFromNode(node) {
  let value = "";
  if (!node) {
    return value;
  }
  if (isCheckable(node)) {
    value = node.checked ? "true" : "false";
  } else {
    value = node.value;
  }
  return value;
}
__name(getValueFromNode, "getValueFromNode");
function trackValueOnNode(node) {
  const valueField = isCheckable(node) ? "checked" : "value";
  const descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, valueField);
  let currentValue = "" + node[valueField];
  if (node.hasOwnProperty(valueField) || typeof descriptor === "undefined" || typeof descriptor.get !== "function" || typeof descriptor.set !== "function") {
    return;
  }
  const get2 = descriptor.get, set2 = descriptor.set;
  Object.defineProperty(node, valueField, {
    configurable: true,
    get: function() {
      return get2.call(this);
    },
    set: function(value) {
      currentValue = "" + value;
      set2.call(this, value);
    }
  });
  Object.defineProperty(node, valueField, {
    enumerable: descriptor.enumerable
  });
  const tracker = {
    getValue() {
      return currentValue;
    },
    setValue(value) {
      currentValue = "" + value;
    },
    stopTracking() {
      detachTracker(node);
      delete node[valueField];
    }
  };
  return tracker;
}
__name(trackValueOnNode, "trackValueOnNode");
function track(node) {
  if (getTracker(node)) {
    return;
  }
  node._valueTracker = trackValueOnNode(node);
}
__name(track, "track");
function updateValueIfChanged(node) {
  if (!node) {
    return false;
  }
  const tracker = getTracker(node);
  if (!tracker) {
    return true;
  }
  const lastValue = tracker.getValue();
  const nextValue = getValueFromNode(node);
  if (nextValue !== lastValue) {
    tracker.setValue(nextValue);
    return true;
  }
  return false;
}
__name(updateValueIfChanged, "updateValueIfChanged");
function getActiveElement(doc) {
  doc = doc || (typeof document !== "undefined" ? document : void 0);
  if (typeof doc === "undefined") {
    return null;
  }
  try {
    return doc.activeElement || doc.body;
  } catch (e) {
    return doc.body;
  }
}
__name(getActiveElement, "getActiveElement");
function isControlled(props) {
  const usesChecked = props.type === "checkbox" || props.type === "radio";
  return usesChecked ? props.checked != null : props.value != null;
}
__name(isControlled, "isControlled");
function getHostProps(element, props) {
  const node = element;
  const checked = props.checked;
  const hostProps = assign({}, props, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: checked != null ? checked : node._wrapperState.initialChecked
  });
  return hostProps;
}
__name(getHostProps, "getHostProps");
function initWrapperState(element, props) {
  const node = element;
  const defaultValue = props.defaultValue == null ? "" : props.defaultValue;
  node._wrapperState = {
    initialChecked: props.checked != null ? props.checked : props.defaultChecked,
    initialValue: getToStringValue(props.value != null ? props.value : defaultValue),
    controlled: isControlled(props)
  };
}
__name(initWrapperState, "initWrapperState");
function updateChecked(element, props) {
  const node = element;
  const checked = props.checked;
  if (checked != null) {
    setValueForProperty(node, "checked", checked, false);
  }
}
__name(updateChecked, "updateChecked");
function updateWrapper(element, props) {
  const node = element;
  updateChecked(element, props);
  const value = getToStringValue(props.value);
  const type = props.type;
  if (value != null) {
    if (type === "number") {
      if (value === 0 && node.value === "" || // We explicitly want to coerce to number here if possible.
      // eslint-disable-next-line
      node.value != value) {
        node.value = toString(value);
      }
    } else if (node.value !== toString(value)) {
      node.value = toString(value);
    }
  } else if (type === "submit" || type === "reset") {
    node.removeAttribute("value");
    return;
  }
  {
    if (props.hasOwnProperty("value")) {
      setDefaultValue(node, props.type, value);
    } else if (props.hasOwnProperty("defaultValue")) {
      setDefaultValue(node, props.type, getToStringValue(props.defaultValue));
    }
  }
  {
    if (props.checked == null && props.defaultChecked != null) {
      node.defaultChecked = !!props.defaultChecked;
    }
  }
}
__name(updateWrapper, "updateWrapper");
function postMountWrapper(element, props, isHydrating2) {
  const node = element;
  if (props.hasOwnProperty("value") || props.hasOwnProperty("defaultValue")) {
    const type = props.type;
    const isButton = type === "submit" || type === "reset";
    if (isButton && (props.value === void 0 || props.value === null)) {
      return;
    }
    const initialValue = toString(node._wrapperState.initialValue);
    if (!isHydrating2) {
      {
        if (initialValue !== node.value) {
          node.value = initialValue;
        }
      }
    }
    {
      node.defaultValue = initialValue;
    }
  }
  const name = node.name;
  if (name !== "") {
    node.name = "";
  }
  {
    node.defaultChecked = !node.defaultChecked;
    node.defaultChecked = !!node._wrapperState.initialChecked;
  }
  if (name !== "") {
    node.name = name;
  }
}
__name(postMountWrapper, "postMountWrapper");
function restoreControlledState(element, props) {
  const node = element;
  updateWrapper(node, props);
  updateNamedCousins(node, props);
}
__name(restoreControlledState, "restoreControlledState");
function updateNamedCousins(rootNode, props) {
  const name = props.name;
  if (props.type === "radio" && name != null) {
    let queryRoot = rootNode;
    while (queryRoot.parentNode) {
      queryRoot = queryRoot.parentNode;
    }
    const group = queryRoot.querySelectorAll("input[name=" + JSON.stringify("" + name) + '][type="radio"]');
    for (let i = 0; i < group.length; i++) {
      const otherNode = group[i];
      if (otherNode === rootNode || otherNode.form !== rootNode.form) {
        continue;
      }
      const otherProps = getFiberCurrentPropsFromNode(otherNode);
      if (!otherProps) {
        throw Error(formatProdErrorMessage(90));
      }
      updateValueIfChanged(otherNode);
      updateWrapper(otherNode, otherProps);
    }
  }
}
__name(updateNamedCousins, "updateNamedCousins");
function setDefaultValue(node, type, value) {
  if (
    // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
    type !== "number" || getActiveElement(node.ownerDocument) !== node
  ) {
    if (value == null) {
      node.defaultValue = toString(node._wrapperState.initialValue);
    } else if (node.defaultValue !== toString(value)) {
      node.defaultValue = toString(value);
    }
  }
}
__name(setDefaultValue, "setDefaultValue");
function postMountWrapper$1(element, props) {
  if (props.value != null) {
    element.setAttribute("value", toString(getToStringValue(props.value)));
  }
}
__name(postMountWrapper$1, "postMountWrapper$1");
var isArrayImpl = Array.isArray;
function isArray(a) {
  return isArrayImpl(a);
}
__name(isArray, "isArray");
function updateOptions(node, multiple, propValue, setDefaultSelected) {
  const options = node.options;
  if (multiple) {
    const selectedValues = propValue;
    const selectedValue = {};
    for (let i = 0; i < selectedValues.length; i++) {
      selectedValue["$" + selectedValues[i]] = true;
    }
    for (let i = 0; i < options.length; i++) {
      const selected = selectedValue.hasOwnProperty("$" + options[i].value);
      if (options[i].selected !== selected) {
        options[i].selected = selected;
      }
      if (selected && setDefaultSelected) {
        options[i].defaultSelected = true;
      }
    }
  } else {
    const selectedValue = toString(getToStringValue(propValue));
    let defaultSelected = null;
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === selectedValue) {
        options[i].selected = true;
        if (setDefaultSelected) {
          options[i].defaultSelected = true;
        }
        return;
      }
      if (defaultSelected === null && !options[i].disabled) {
        defaultSelected = options[i];
      }
    }
    if (defaultSelected !== null) {
      defaultSelected.selected = true;
    }
  }
}
__name(updateOptions, "updateOptions");
function getHostProps$1(element, props) {
  return assign({}, props, {
    value: void 0
  });
}
__name(getHostProps$1, "getHostProps$1");
function initWrapperState$1(element, props) {
  const node = element;
  node._wrapperState = {
    wasMultiple: !!props.multiple
  };
}
__name(initWrapperState$1, "initWrapperState$1");
function postMountWrapper$2(element, props) {
  const node = element;
  node.multiple = !!props.multiple;
  const value = props.value;
  if (value != null) {
    updateOptions(node, !!props.multiple, value, false);
  } else if (props.defaultValue != null) {
    updateOptions(node, !!props.multiple, props.defaultValue, true);
  }
}
__name(postMountWrapper$2, "postMountWrapper$2");
function postUpdateWrapper(element, props) {
  const node = element;
  const wasMultiple = node._wrapperState.wasMultiple;
  node._wrapperState.wasMultiple = !!props.multiple;
  const value = props.value;
  if (value != null) {
    updateOptions(node, !!props.multiple, value, false);
  } else if (wasMultiple !== !!props.multiple) {
    if (props.defaultValue != null) {
      updateOptions(node, !!props.multiple, props.defaultValue, true);
    } else {
      updateOptions(node, !!props.multiple, props.multiple ? [] : "", false);
    }
  }
}
__name(postUpdateWrapper, "postUpdateWrapper");
function restoreControlledState$1(element, props) {
  const node = element;
  const value = props.value;
  if (value != null) {
    updateOptions(node, !!props.multiple, value, false);
  }
}
__name(restoreControlledState$1, "restoreControlledState$1");
function getHostProps$2(element, props) {
  const node = element;
  if (props.dangerouslySetInnerHTML != null) {
    throw Error(formatProdErrorMessage(91));
  }
  const hostProps = assign({}, props, {
    value: void 0,
    defaultValue: void 0,
    children: toString(node._wrapperState.initialValue)
  });
  return hostProps;
}
__name(getHostProps$2, "getHostProps$2");
function initWrapperState$2(element, props) {
  const node = element;
  let initialValue = props.value;
  if (initialValue == null) {
    let children = props.children, defaultValue = props.defaultValue;
    if (children != null) {
      {
        if (defaultValue != null) {
          throw Error(formatProdErrorMessage(92));
        }
        if (isArray(children)) {
          if (children.length > 1) {
            throw Error(formatProdErrorMessage(93));
          }
          children = children[0];
        }
        defaultValue = children;
      }
    }
    if (defaultValue == null) {
      defaultValue = "";
    }
    initialValue = defaultValue;
  }
  node._wrapperState = {
    initialValue: getToStringValue(initialValue)
  };
}
__name(initWrapperState$2, "initWrapperState$2");
function updateWrapper$1(element, props) {
  const node = element;
  const value = getToStringValue(props.value);
  const defaultValue = getToStringValue(props.defaultValue);
  if (value != null) {
    const newValue = toString(value);
    if (newValue !== node.value) {
      node.value = newValue;
    }
    if (props.defaultValue == null && node.defaultValue !== newValue) {
      node.defaultValue = newValue;
    }
  }
  if (defaultValue != null) {
    node.defaultValue = toString(defaultValue);
  }
}
__name(updateWrapper$1, "updateWrapper$1");
function postMountWrapper$3(element, props) {
  const node = element;
  const textContent = node.textContent;
  if (textContent === node._wrapperState.initialValue) {
    if (textContent !== "" && textContent !== null) {
      node.value = textContent;
    }
  }
}
__name(postMountWrapper$3, "postMountWrapper$3");
function restoreControlledState$2(element, props) {
  updateWrapper$1(element, props);
}
__name(restoreControlledState$2, "restoreControlledState$2");
var HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
var MATH_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
function getIntrinsicNamespace(type) {
  switch (type) {
    case "svg":
      return SVG_NAMESPACE;
    case "math":
      return MATH_NAMESPACE;
    default:
      return HTML_NAMESPACE;
  }
}
__name(getIntrinsicNamespace, "getIntrinsicNamespace");
function getChildNamespace(parentNamespace, type) {
  if (parentNamespace == null || parentNamespace === HTML_NAMESPACE) {
    return getIntrinsicNamespace(type);
  }
  if (parentNamespace === SVG_NAMESPACE && type === "foreignObject") {
    return HTML_NAMESPACE;
  }
  return parentNamespace;
}
__name(getChildNamespace, "getChildNamespace");
var createMicrosoftUnsafeLocalFunction = /* @__PURE__ */ __name(function(func) {
  if (typeof MSApp !== "undefined" && MSApp.execUnsafeLocalFunction) {
    return function(arg0, arg1, arg2, arg3) {
      MSApp.execUnsafeLocalFunction(function() {
        return func(arg0, arg1, arg2, arg3);
      });
    };
  } else {
    return func;
  }
}, "createMicrosoftUnsafeLocalFunction");
var reusableSVGContainer;
var setInnerHTML = createMicrosoftUnsafeLocalFunction(function(node, html) {
  if (node.namespaceURI === SVG_NAMESPACE) {
    if (!("innerHTML" in node)) {
      reusableSVGContainer = reusableSVGContainer || document.createElement("div");
      reusableSVGContainer.innerHTML = "<svg>" + html.valueOf().toString() + "</svg>";
      const svgNode = reusableSVGContainer.firstChild;
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
      while (svgNode.firstChild) {
        node.appendChild(svgNode.firstChild);
      }
      return;
    }
  }
  node.innerHTML = html;
});
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
var DOCUMENT_NODE = 9;
var DOCUMENT_FRAGMENT_NODE = 11;
var setTextContent = /* @__PURE__ */ __name(function(node, text) {
  if (text) {
    const firstChild = node.firstChild;
    if (firstChild && firstChild === node.lastChild && firstChild.nodeType === TEXT_NODE) {
      firstChild.nodeValue = text;
      return;
    }
  }
  node.textContent = text;
}, "setTextContent");
var isUnitlessNumber = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};
function prefixKey(prefix2, key) {
  return prefix2 + key.charAt(0).toUpperCase() + key.substring(1);
}
__name(prefixKey, "prefixKey");
var prefixes = ["Webkit", "ms", "Moz", "O"];
Object.keys(isUnitlessNumber).forEach(function(prop) {
  prefixes.forEach(function(prefix2) {
    isUnitlessNumber[prefixKey(prefix2, prop)] = isUnitlessNumber[prop];
  });
});
function dangerousStyleValue(name, value, isCustomProperty) {
  const isEmpty = value == null || typeof value === "boolean" || value === "";
  if (isEmpty) {
    return "";
  }
  if (!isCustomProperty && typeof value === "number" && value !== 0 && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])) {
    return value + "px";
  }
  return ("" + value).trim();
}
__name(dangerousStyleValue, "dangerousStyleValue");
function setValueForStyles(node, styles) {
  const style2 = node.style;
  for (let styleName in styles) {
    if (!styles.hasOwnProperty(styleName)) {
      continue;
    }
    const isCustomProperty = styleName.indexOf("--") === 0;
    const styleValue = dangerousStyleValue(styleName, styles[styleName], isCustomProperty);
    if (styleName === "float") {
      styleName = "cssFloat";
    }
    if (isCustomProperty) {
      style2.setProperty(styleName, styleValue);
    } else {
      style2[styleName] = styleValue;
    }
  }
}
__name(setValueForStyles, "setValueForStyles");
var omittedCloseTags = {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
  // NOTE: menuitem's close tag should be omitted, but that causes problems.
};
var voidElementTags = assign({
  menuitem: true
}, omittedCloseTags);
var HTML = "__html";
function assertValidProps(tag, props) {
  if (!props) {
    return;
  }
  if (voidElementTags[tag]) {
    if (props.children != null || props.dangerouslySetInnerHTML != null) {
      throw Error(formatProdErrorMessage(137, tag));
    }
  }
  if (props.dangerouslySetInnerHTML != null) {
    if (props.children != null) {
      throw Error(formatProdErrorMessage(60));
    }
    if (typeof props.dangerouslySetInnerHTML !== "object" || !(HTML in props.dangerouslySetInnerHTML)) {
      throw Error(formatProdErrorMessage(61));
    }
  }
  if (props.style != null && typeof props.style !== "object") {
    throw Error(formatProdErrorMessage(62));
  }
}
__name(assertValidProps, "assertValidProps");
function isCustomComponent(tagName, props) {
  if (tagName.indexOf("-") === -1) {
    return typeof props.is === "string";
  }
  switch (tagName) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
__name(isCustomComponent, "isCustomComponent");
var IS_EVENT_HANDLE_NON_MANAGED_NODE = 1;
var IS_NON_DELEGATED = 1 << 1;
var IS_CAPTURE_PHASE = 1 << 2;
var SHOULD_NOT_PROCESS_POLYFILL_EVENT_PLUGINS = IS_EVENT_HANDLE_NON_MANAGED_NODE | IS_NON_DELEGATED | IS_CAPTURE_PHASE;
var currentReplayingEvent = null;
function setReplayingEvent(event) {
  currentReplayingEvent = event;
}
__name(setReplayingEvent, "setReplayingEvent");
function resetReplayingEvent() {
  currentReplayingEvent = null;
}
__name(resetReplayingEvent, "resetReplayingEvent");
function isReplayingEvent(event) {
  return event === currentReplayingEvent;
}
__name(isReplayingEvent, "isReplayingEvent");
function getEventTarget(nativeEvent) {
  let target = nativeEvent.target || nativeEvent.srcElement || window;
  if (target.correspondingUseElement) {
    target = target.correspondingUseElement;
  }
  return target.nodeType === TEXT_NODE ? target.parentNode : target;
}
__name(getEventTarget, "getEventTarget");
var restoreImpl = null;
var restoreTarget = null;
var restoreQueue = null;
function restoreStateOfTarget(target) {
  const internalInstance = getInstanceFromNode(target);
  if (!internalInstance) {
    return;
  }
  if (typeof restoreImpl !== "function") {
    throw Error(formatProdErrorMessage(280));
  }
  const stateNode = internalInstance.stateNode;
  if (stateNode) {
    const props = getFiberCurrentPropsFromNode(stateNode);
    restoreImpl(internalInstance.stateNode, internalInstance.type, props);
  }
}
__name(restoreStateOfTarget, "restoreStateOfTarget");
function setRestoreImplementation(impl) {
  restoreImpl = impl;
}
__name(setRestoreImplementation, "setRestoreImplementation");
function enqueueStateRestore(target) {
  if (restoreTarget) {
    if (restoreQueue) {
      restoreQueue.push(target);
    } else {
      restoreQueue = [target];
    }
  } else {
    restoreTarget = target;
  }
}
__name(enqueueStateRestore, "enqueueStateRestore");
function needsStateRestore() {
  return restoreTarget !== null || restoreQueue !== null;
}
__name(needsStateRestore, "needsStateRestore");
function restoreStateIfNeeded() {
  if (!restoreTarget) {
    return;
  }
  const target = restoreTarget;
  const queuedTargets = restoreQueue;
  restoreTarget = null;
  restoreQueue = null;
  restoreStateOfTarget(target);
  if (queuedTargets) {
    for (let i = 0; i < queuedTargets.length; i++) {
      restoreStateOfTarget(queuedTargets[i]);
    }
  }
}
__name(restoreStateIfNeeded, "restoreStateIfNeeded");
var batchedUpdatesImpl = /* @__PURE__ */ __name(function(fn, bookkeeping) {
  return fn(bookkeeping);
}, "batchedUpdatesImpl");
var flushSyncImpl = /* @__PURE__ */ __name(function() {
}, "flushSyncImpl");
var isInsideEventHandler = false;
function finishEventHandler() {
  const controlledComponentsHavePendingUpdates = needsStateRestore();
  if (controlledComponentsHavePendingUpdates) {
    flushSyncImpl();
    restoreStateIfNeeded();
  }
}
__name(finishEventHandler, "finishEventHandler");
function batchedUpdates(fn, a, b) {
  if (isInsideEventHandler) {
    return fn(a, b);
  }
  isInsideEventHandler = true;
  try {
    return batchedUpdatesImpl(fn, a, b);
  } finally {
    isInsideEventHandler = false;
    finishEventHandler();
  }
}
__name(batchedUpdates, "batchedUpdates");
function setBatchingImplementation(_batchedUpdatesImpl, _discreteUpdatesImpl, _flushSyncImpl) {
  batchedUpdatesImpl = _batchedUpdatesImpl;
  flushSyncImpl = _flushSyncImpl;
}
__name(setBatchingImplementation, "setBatchingImplementation");
function isInteractive(tag) {
  return tag === "button" || tag === "input" || tag === "select" || tag === "textarea";
}
__name(isInteractive, "isInteractive");
function shouldPreventMouseEvent(name, type, props) {
  switch (name) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      return !!(props.disabled && isInteractive(type));
    default:
      return false;
  }
}
__name(shouldPreventMouseEvent, "shouldPreventMouseEvent");
function getListener(inst, registrationName) {
  const stateNode = inst.stateNode;
  if (stateNode === null) {
    return null;
  }
  const props = getFiberCurrentPropsFromNode(stateNode);
  if (props === null) {
    return null;
  }
  const listener = props[registrationName];
  if (shouldPreventMouseEvent(registrationName, inst.type, props)) {
    return null;
  }
  if (listener && typeof listener !== "function") {
    throw Error(formatProdErrorMessage(231, registrationName, typeof listener));
  }
  return listener;
}
__name(getListener, "getListener");
var passiveBrowserEventsSupported = false;
if (canUseDOM) {
  try {
    const options = {};
    Object.defineProperty(options, "passive", {
      get: function() {
        passiveBrowserEventsSupported = true;
      }
    });
    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, options);
  } catch (e) {
    passiveBrowserEventsSupported = false;
  }
}
function invokeGuardedCallbackProd(name, func, context, a, b, c, d, e, f) {
  const funcArgs = Array.prototype.slice.call(arguments, 3);
  try {
    func.apply(context, funcArgs);
  } catch (error) {
    this.onError(error);
  }
}
__name(invokeGuardedCallbackProd, "invokeGuardedCallbackProd");
var invokeGuardedCallbackImpl = invokeGuardedCallbackProd;
var hasError = false;
var caughtError = null;
var hasRethrowError = false;
var rethrowError = null;
var reporter = {
  onError(error) {
    hasError = true;
    caughtError = error;
  }
};
function invokeGuardedCallback(name, func, context, a, b, c, d, e, f) {
  hasError = false;
  caughtError = null;
  invokeGuardedCallbackImpl.apply(reporter, arguments);
}
__name(invokeGuardedCallback, "invokeGuardedCallback");
function invokeGuardedCallbackAndCatchFirstError(name, func, context, a, b, c, d, e, f) {
  invokeGuardedCallback.apply(this, arguments);
  if (hasError) {
    const error = clearCaughtError();
    if (!hasRethrowError) {
      hasRethrowError = true;
      rethrowError = error;
    }
  }
}
__name(invokeGuardedCallbackAndCatchFirstError, "invokeGuardedCallbackAndCatchFirstError");
function rethrowCaughtError() {
  if (hasRethrowError) {
    const error = rethrowError;
    hasRethrowError = false;
    rethrowError = null;
    throw error;
  }
}
__name(rethrowCaughtError, "rethrowCaughtError");
function clearCaughtError() {
  if (hasError) {
    const error = caughtError;
    hasError = false;
    caughtError = null;
    return error;
  } else {
    throw Error(formatProdErrorMessage(198));
  }
}
__name(clearCaughtError, "clearCaughtError");
function get(key) {
  return key._reactInternals;
}
__name(get, "get");
function has(key) {
  return key._reactInternals !== void 0;
}
__name(has, "has");
function set(key, value) {
  key._reactInternals = value;
}
__name(set, "set");
var NoFlags = (
  /*                      */
  0
);
var PerformedWork = (
  /*                */
  1
);
var Placement = (
  /*                    */
  2
);
var Update = (
  /*                       */
  4
);
var ChildDeletion = (
  /*                */
  16
);
var ContentReset = (
  /*                 */
  32
);
var Callback = (
  /*                     */
  64
);
var DidCapture = (
  /*                   */
  128
);
var ForceClientRender = (
  /*            */
  256
);
var Ref = (
  /*                          */
  512
);
var Snapshot = (
  /*                     */
  1024
);
var Passive = (
  /*                      */
  2048
);
var Hydrating = (
  /*                    */
  4096
);
var Visibility = (
  /*                   */
  8192
);
var StoreConsistency = (
  /*             */
  16384
);
var LifecycleEffectMask = Passive | Update | Callback | Ref | Snapshot | StoreConsistency;
var HostEffectMask = (
  /*               */
  32767
);
var Incomplete = (
  /*                   */
  32768
);
var ShouldCapture = (
  /*                */
  65536
);
var ForceUpdateForLegacySuspense = (
  /* */
  131072
);
var Forked = (
  /*                       */
  1048576
);
var RefStatic = (
  /*                    */
  2097152
);
var LayoutStatic = (
  /*                 */
  4194304
);
var PassiveStatic = (
  /*                */
  8388608
);
var BeforeMutationMask = (
  // TODO: Remove Update flag from before mutation phase by re-landing Visibility
  // flag logic (see #20043)
  Update | Snapshot | 0
);
var MutationMask = Placement | Update | ChildDeletion | ContentReset | Ref | Hydrating | Visibility;
var LayoutMask = Update | Callback | Ref | Visibility;
var PassiveMask = Passive | ChildDeletion;
var StaticMask = LayoutStatic | PassiveStatic | RefStatic;
var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
function getNearestMountedFiber(fiber) {
  let node = fiber;
  let nearestMounted = fiber;
  if (!fiber.alternate) {
    let nextNode = node;
    do {
      node = nextNode;
      if ((node.flags & (Placement | Hydrating)) !== NoFlags) {
        nearestMounted = node.return;
      }
      nextNode = node.return;
    } while (nextNode);
  } else {
    while (node.return) {
      node = node.return;
    }
  }
  if (node.tag === HostRoot) {
    return nearestMounted;
  }
  return null;
}
__name(getNearestMountedFiber, "getNearestMountedFiber");
function getSuspenseInstanceFromFiber(fiber) {
  if (fiber.tag === SuspenseComponent) {
    let suspenseState = fiber.memoizedState;
    if (suspenseState === null) {
      const current = fiber.alternate;
      if (current !== null) {
        suspenseState = current.memoizedState;
      }
    }
    if (suspenseState !== null) {
      return suspenseState.dehydrated;
    }
  }
  return null;
}
__name(getSuspenseInstanceFromFiber, "getSuspenseInstanceFromFiber");
function getContainerFromFiber(fiber) {
  return fiber.tag === HostRoot ? fiber.stateNode.containerInfo : null;
}
__name(getContainerFromFiber, "getContainerFromFiber");
function isFiberMounted(fiber) {
  return getNearestMountedFiber(fiber) === fiber;
}
__name(isFiberMounted, "isFiberMounted");
function isMounted(component) {
  const fiber = get(component);
  if (!fiber) {
    return false;
  }
  return getNearestMountedFiber(fiber) === fiber;
}
__name(isMounted, "isMounted");
function assertIsMounted(fiber) {
  if (getNearestMountedFiber(fiber) !== fiber) {
    throw Error(formatProdErrorMessage(188));
  }
}
__name(assertIsMounted, "assertIsMounted");
function findCurrentFiberUsingSlowPath(fiber) {
  const alternate = fiber.alternate;
  if (!alternate) {
    const nearestMounted = getNearestMountedFiber(fiber);
    if (nearestMounted === null) {
      throw Error(formatProdErrorMessage(188));
    }
    if (nearestMounted !== fiber) {
      return null;
    }
    return fiber;
  }
  let a = fiber;
  let b = alternate;
  while (true) {
    const parentA = a.return;
    if (parentA === null) {
      break;
    }
    const parentB = parentA.alternate;
    if (parentB === null) {
      const nextParent = parentA.return;
      if (nextParent !== null) {
        a = b = nextParent;
        continue;
      }
      break;
    }
    if (parentA.child === parentB.child) {
      let child = parentA.child;
      while (child) {
        if (child === a) {
          assertIsMounted(parentA);
          return fiber;
        }
        if (child === b) {
          assertIsMounted(parentA);
          return alternate;
        }
        child = child.sibling;
      }
      throw Error(formatProdErrorMessage(188));
    }
    if (a.return !== b.return) {
      a = parentA;
      b = parentB;
    } else {
      let didFindChild = false;
      let child = parentA.child;
      while (child) {
        if (child === a) {
          didFindChild = true;
          a = parentA;
          b = parentB;
          break;
        }
        if (child === b) {
          didFindChild = true;
          b = parentA;
          a = parentB;
          break;
        }
        child = child.sibling;
      }
      if (!didFindChild) {
        child = parentB.child;
        while (child) {
          if (child === a) {
            didFindChild = true;
            a = parentB;
            b = parentA;
            break;
          }
          if (child === b) {
            didFindChild = true;
            b = parentB;
            a = parentA;
            break;
          }
          child = child.sibling;
        }
        if (!didFindChild) {
          throw Error(formatProdErrorMessage(189));
        }
      }
    }
    if (a.alternate !== b) {
      throw Error(formatProdErrorMessage(190));
    }
  }
  if (a.tag !== HostRoot) {
    throw Error(formatProdErrorMessage(188));
  }
  if (a.stateNode.current === a) {
    return fiber;
  }
  return alternate;
}
__name(findCurrentFiberUsingSlowPath, "findCurrentFiberUsingSlowPath");
function findCurrentHostFiber(parent) {
  const currentParent = findCurrentFiberUsingSlowPath(parent);
  return currentParent !== null ? findCurrentHostFiberImpl(currentParent) : null;
}
__name(findCurrentHostFiber, "findCurrentHostFiber");
function findCurrentHostFiberImpl(node) {
  if (node.tag === HostComponent || node.tag === HostText) {
    return node;
  }
  let child = node.child;
  while (child !== null) {
    const match = findCurrentHostFiberImpl(child);
    if (match !== null) {
      return match;
    }
    child = child.sibling;
  }
  return null;
}
__name(findCurrentHostFiberImpl, "findCurrentHostFiberImpl");
var scheduleCallback = unstable_scheduleCallback;
var cancelCallback = unstable_cancelCallback;
var shouldYield = shouldYieldToHost;
var requestPaint2 = unstable_requestPaint;
var now = getCurrentTime;
var getCurrentPriorityLevel = unstable_getCurrentPriorityLevel;
var ImmediatePriority2 = ImmediatePriority;
var UserBlockingPriority2 = UserBlockingPriority;
var NormalPriority2 = NormalPriority;
var LowPriority2 = LowPriority;
var IdlePriority2 = IdlePriority;
var rendererID = null;
var injectedHook = null;
function injectInternals(internals) {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined") {
    return false;
  }
  const hook = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (hook.isDisabled) {
    return true;
  }
  if (!hook.supportsFiber) {
    return true;
  }
  try {
    if (enableSchedulingProfiler) {
      internals = assign({}, internals, {
        getLaneLabelMap,
        injectProfilingHooks
      });
    }
    rendererID = hook.inject(internals);
    injectedHook = hook;
  } catch (err) {
  }
  if (hook.checkDCE) {
    return true;
  } else {
    return false;
  }
}
__name(injectInternals, "injectInternals");
function onCommitRoot(root2, eventPriority) {
  if (injectedHook && typeof injectedHook.onCommitFiberRoot === "function") {
    try {
      const didError = (root2.current.flags & DidCapture) === DidCapture;
      if (enableProfilerTimer) {
        let schedulerPriority;
        switch (eventPriority) {
          case DiscreteEventPriority:
            schedulerPriority = ImmediatePriority2;
            break;
          case ContinuousEventPriority:
            schedulerPriority = UserBlockingPriority2;
            break;
          case DefaultEventPriority:
            schedulerPriority = NormalPriority2;
            break;
          case IdleEventPriority:
            schedulerPriority = IdlePriority2;
            break;
          default:
            schedulerPriority = NormalPriority2;
            break;
        }
        injectedHook.onCommitFiberRoot(rendererID, root2, schedulerPriority, didError);
      } else {
        injectedHook.onCommitFiberRoot(rendererID, root2, void 0, didError);
      }
    } catch (err) {
    }
  }
}
__name(onCommitRoot, "onCommitRoot");
function onPostCommitRoot(root2) {
  if (injectedHook && typeof injectedHook.onPostCommitFiberRoot === "function") {
    try {
      injectedHook.onPostCommitFiberRoot(rendererID, root2);
    } catch (err) {
    }
  }
}
__name(onPostCommitRoot, "onPostCommitRoot");
function onCommitUnmount(fiber) {
  if (injectedHook && typeof injectedHook.onCommitFiberUnmount === "function") {
    try {
      injectedHook.onCommitFiberUnmount(rendererID, fiber);
    } catch (err) {
    }
  }
}
__name(onCommitUnmount, "onCommitUnmount");
function injectProfilingHooks(profilingHooks) {
}
__name(injectProfilingHooks, "injectProfilingHooks");
function getLaneLabelMap() {
  {
    return null;
  }
}
__name(getLaneLabelMap, "getLaneLabelMap");
function markComponentRenderStopped() {
}
__name(markComponentRenderStopped, "markComponentRenderStopped");
function markComponentErrored(fiber, thrownValue, lanes) {
}
__name(markComponentErrored, "markComponentErrored");
function markComponentSuspended(fiber, wakeable, lanes) {
}
__name(markComponentSuspended, "markComponentSuspended");
var NoMode = (
  /*                         */
  0
);
var ConcurrentMode = (
  /*                 */
  1
);
var ProfileMode = (
  /*                    */
  2
);
var StrictLegacyMode = (
  /*               */
  8
);
var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
var log = Math.log;
var LN2 = Math.LN2;
function clz32Fallback(x) {
  const asUint = x >>> 0;
  if (asUint === 0) {
    return 32;
  }
  return 31 - (log(asUint) / LN2 | 0) | 0;
}
__name(clz32Fallback, "clz32Fallback");
var TotalLanes = 31;
var NoLanes = (
  /*                        */
  0
);
var NoLane = (
  /*                          */
  0
);
var SyncLane = (
  /*                        */
  1
);
var InputContinuousHydrationLane = (
  /*    */
  2
);
var InputContinuousLane = (
  /*             */
  4
);
var DefaultHydrationLane = (
  /*            */
  8
);
var DefaultLane = (
  /*                     */
  16
);
var TransitionHydrationLane = (
  /*                */
  32
);
var TransitionLanes = (
  /*                       */
  4194240
);
var TransitionLane1 = (
  /*                        */
  64
);
var TransitionLane2 = (
  /*                        */
  128
);
var TransitionLane3 = (
  /*                        */
  256
);
var TransitionLane4 = (
  /*                        */
  512
);
var TransitionLane5 = (
  /*                        */
  1024
);
var TransitionLane6 = (
  /*                        */
  2048
);
var TransitionLane7 = (
  /*                        */
  4096
);
var TransitionLane8 = (
  /*                        */
  8192
);
var TransitionLane9 = (
  /*                        */
  16384
);
var TransitionLane10 = (
  /*                       */
  32768
);
var TransitionLane11 = (
  /*                       */
  65536
);
var TransitionLane12 = (
  /*                       */
  131072
);
var TransitionLane13 = (
  /*                       */
  262144
);
var TransitionLane14 = (
  /*                       */
  524288
);
var TransitionLane15 = (
  /*                       */
  1048576
);
var TransitionLane16 = (
  /*                       */
  2097152
);
var RetryLanes = (
  /*                            */
  130023424
);
var RetryLane1 = (
  /*                             */
  4194304
);
var RetryLane2 = (
  /*                             */
  8388608
);
var RetryLane3 = (
  /*                             */
  16777216
);
var RetryLane4 = (
  /*                             */
  33554432
);
var RetryLane5 = (
  /*                             */
  67108864
);
var SomeRetryLane = RetryLane1;
var SelectiveHydrationLane = (
  /*          */
  134217728
);
var NonIdleLanes = (
  /*                          */
  268435455
);
var IdleHydrationLane = (
  /*               */
  268435456
);
var IdleLane = (
  /*                        */
  536870912
);
var OffscreenLane = (
  /*                   */
  1073741824
);
var NoTimestamp = -1;
var nextTransitionLane = TransitionLane1;
var nextRetryLane = RetryLane1;
function getHighestPriorityLanes(lanes) {
  switch (getHighestPriorityLane(lanes)) {
    case SyncLane:
      return SyncLane;
    case InputContinuousHydrationLane:
      return InputContinuousHydrationLane;
    case InputContinuousLane:
      return InputContinuousLane;
    case DefaultHydrationLane:
      return DefaultHydrationLane;
    case DefaultLane:
      return DefaultLane;
    case TransitionHydrationLane:
      return TransitionHydrationLane;
    case TransitionLane1:
    case TransitionLane2:
    case TransitionLane3:
    case TransitionLane4:
    case TransitionLane5:
    case TransitionLane6:
    case TransitionLane7:
    case TransitionLane8:
    case TransitionLane9:
    case TransitionLane10:
    case TransitionLane11:
    case TransitionLane12:
    case TransitionLane13:
    case TransitionLane14:
    case TransitionLane15:
    case TransitionLane16:
      return lanes & TransitionLanes;
    case RetryLane1:
    case RetryLane2:
    case RetryLane3:
    case RetryLane4:
    case RetryLane5:
      return lanes & RetryLanes;
    case SelectiveHydrationLane:
      return SelectiveHydrationLane;
    case IdleHydrationLane:
      return IdleHydrationLane;
    case IdleLane:
      return IdleLane;
    case OffscreenLane:
      return OffscreenLane;
    default:
      return lanes;
  }
}
__name(getHighestPriorityLanes, "getHighestPriorityLanes");
function getNextLanes(root2, wipLanes) {
  const pendingLanes = root2.pendingLanes;
  if (pendingLanes === NoLanes) {
    return NoLanes;
  }
  let nextLanes = NoLanes;
  const suspendedLanes = root2.suspendedLanes;
  const pingedLanes = root2.pingedLanes;
  const nonIdlePendingLanes = pendingLanes & NonIdleLanes;
  if (nonIdlePendingLanes !== NoLanes) {
    const nonIdleUnblockedLanes = nonIdlePendingLanes & ~suspendedLanes;
    if (nonIdleUnblockedLanes !== NoLanes) {
      nextLanes = getHighestPriorityLanes(nonIdleUnblockedLanes);
    } else {
      const nonIdlePingedLanes = nonIdlePendingLanes & pingedLanes;
      if (nonIdlePingedLanes !== NoLanes) {
        nextLanes = getHighestPriorityLanes(nonIdlePingedLanes);
      }
    }
  } else {
    const unblockedLanes = pendingLanes & ~suspendedLanes;
    if (unblockedLanes !== NoLanes) {
      nextLanes = getHighestPriorityLanes(unblockedLanes);
    } else {
      if (pingedLanes !== NoLanes) {
        nextLanes = getHighestPriorityLanes(pingedLanes);
      }
    }
  }
  if (nextLanes === NoLanes) {
    return NoLanes;
  }
  if (wipLanes !== NoLanes && wipLanes !== nextLanes && // If we already suspended with a delay, then interrupting is fine. Don't
  // bother waiting until the root is complete.
  (wipLanes & suspendedLanes) === NoLanes) {
    const nextLane = getHighestPriorityLane(nextLanes);
    const wipLane = getHighestPriorityLane(wipLanes);
    if (
      // Tests whether the next lane is equal or lower priority than the wip
      // one. This works because the bits decrease in priority as you go left.
      nextLane >= wipLane || // Default priority updates should not interrupt transition updates. The
      // only difference between default updates and transition updates is that
      // default updates do not support refresh transitions.
      nextLane === DefaultLane && (wipLane & TransitionLanes) !== NoLanes
    ) {
      return wipLanes;
    }
  }
  if ((nextLanes & InputContinuousLane) !== NoLanes) {
    nextLanes |= pendingLanes & DefaultLane;
  }
  const entangledLanes = root2.entangledLanes;
  if (entangledLanes !== NoLanes) {
    const entanglements = root2.entanglements;
    let lanes = nextLanes & entangledLanes;
    while (lanes > 0) {
      const index2 = pickArbitraryLaneIndex(lanes);
      const lane = 1 << index2;
      nextLanes |= entanglements[index2];
      lanes &= ~lane;
    }
  }
  return nextLanes;
}
__name(getNextLanes, "getNextLanes");
function getMostRecentEventTime(root2, lanes) {
  const eventTimes = root2.eventTimes;
  let mostRecentEventTime = NoTimestamp;
  while (lanes > 0) {
    const index2 = pickArbitraryLaneIndex(lanes);
    const lane = 1 << index2;
    const eventTime = eventTimes[index2];
    if (eventTime > mostRecentEventTime) {
      mostRecentEventTime = eventTime;
    }
    lanes &= ~lane;
  }
  return mostRecentEventTime;
}
__name(getMostRecentEventTime, "getMostRecentEventTime");
function computeExpirationTime(lane, currentTime) {
  switch (lane) {
    case SyncLane:
    case InputContinuousHydrationLane:
    case InputContinuousLane:
      return currentTime + 250;
    case DefaultHydrationLane:
    case DefaultLane:
    case TransitionHydrationLane:
    case TransitionLane1:
    case TransitionLane2:
    case TransitionLane3:
    case TransitionLane4:
    case TransitionLane5:
    case TransitionLane6:
    case TransitionLane7:
    case TransitionLane8:
    case TransitionLane9:
    case TransitionLane10:
    case TransitionLane11:
    case TransitionLane12:
    case TransitionLane13:
    case TransitionLane14:
    case TransitionLane15:
    case TransitionLane16:
      return currentTime + 5e3;
    case RetryLane1:
    case RetryLane2:
    case RetryLane3:
    case RetryLane4:
    case RetryLane5:
      return NoTimestamp;
    case SelectiveHydrationLane:
    case IdleHydrationLane:
    case IdleLane:
    case OffscreenLane:
      return NoTimestamp;
    default:
      return NoTimestamp;
  }
}
__name(computeExpirationTime, "computeExpirationTime");
function markStarvedLanesAsExpired(root2, currentTime) {
  const pendingLanes = root2.pendingLanes;
  const suspendedLanes = root2.suspendedLanes;
  const pingedLanes = root2.pingedLanes;
  const expirationTimes = root2.expirationTimes;
  let lanes = pendingLanes;
  while (lanes > 0) {
    const index2 = pickArbitraryLaneIndex(lanes);
    const lane = 1 << index2;
    const expirationTime = expirationTimes[index2];
    if (expirationTime === NoTimestamp) {
      if ((lane & suspendedLanes) === NoLanes || (lane & pingedLanes) !== NoLanes) {
        expirationTimes[index2] = computeExpirationTime(lane, currentTime);
      }
    } else if (expirationTime <= currentTime) {
      root2.expiredLanes |= lane;
    }
    lanes &= ~lane;
  }
}
__name(markStarvedLanesAsExpired, "markStarvedLanesAsExpired");
function getHighestPriorityPendingLanes(root2) {
  return getHighestPriorityLanes(root2.pendingLanes);
}
__name(getHighestPriorityPendingLanes, "getHighestPriorityPendingLanes");
function getLanesToRetrySynchronouslyOnError(root2) {
  const everythingButOffscreen = root2.pendingLanes & ~OffscreenLane;
  if (everythingButOffscreen !== NoLanes) {
    return everythingButOffscreen;
  }
  if (everythingButOffscreen & OffscreenLane) {
    return OffscreenLane;
  }
  return NoLanes;
}
__name(getLanesToRetrySynchronouslyOnError, "getLanesToRetrySynchronouslyOnError");
function includesSyncLane(lanes) {
  return (lanes & SyncLane) !== NoLanes;
}
__name(includesSyncLane, "includesSyncLane");
function includesNonIdleWork(lanes) {
  return (lanes & NonIdleLanes) !== NoLanes;
}
__name(includesNonIdleWork, "includesNonIdleWork");
function includesOnlyRetries(lanes) {
  return (lanes & RetryLanes) === lanes;
}
__name(includesOnlyRetries, "includesOnlyRetries");
function includesOnlyNonUrgentLanes(lanes) {
  const UrgentLanes = SyncLane | InputContinuousLane | DefaultLane;
  return (lanes & UrgentLanes) === NoLanes;
}
__name(includesOnlyNonUrgentLanes, "includesOnlyNonUrgentLanes");
function includesOnlyTransitions(lanes) {
  return (lanes & TransitionLanes) === lanes;
}
__name(includesOnlyTransitions, "includesOnlyTransitions");
function includesBlockingLane(root2, lanes) {
  const SyncDefaultLanes = InputContinuousHydrationLane | InputContinuousLane | DefaultHydrationLane | DefaultLane;
  return (lanes & SyncDefaultLanes) !== NoLanes;
}
__name(includesBlockingLane, "includesBlockingLane");
function includesExpiredLane(root2, lanes) {
  return (lanes & root2.expiredLanes) !== NoLanes;
}
__name(includesExpiredLane, "includesExpiredLane");
function isTransitionLane(lane) {
  return (lane & TransitionLanes) !== NoLanes;
}
__name(isTransitionLane, "isTransitionLane");
function claimNextTransitionLane() {
  const lane = nextTransitionLane;
  nextTransitionLane <<= 1;
  if ((nextTransitionLane & TransitionLanes) === NoLanes) {
    nextTransitionLane = TransitionLane1;
  }
  return lane;
}
__name(claimNextTransitionLane, "claimNextTransitionLane");
function claimNextRetryLane() {
  const lane = nextRetryLane;
  nextRetryLane <<= 1;
  if ((nextRetryLane & RetryLanes) === NoLanes) {
    nextRetryLane = RetryLane1;
  }
  return lane;
}
__name(claimNextRetryLane, "claimNextRetryLane");
function getHighestPriorityLane(lanes) {
  return lanes & -lanes;
}
__name(getHighestPriorityLane, "getHighestPriorityLane");
function pickArbitraryLane(lanes) {
  return getHighestPriorityLane(lanes);
}
__name(pickArbitraryLane, "pickArbitraryLane");
function pickArbitraryLaneIndex(lanes) {
  return 31 - clz32(lanes);
}
__name(pickArbitraryLaneIndex, "pickArbitraryLaneIndex");
function laneToIndex(lane) {
  return pickArbitraryLaneIndex(lane);
}
__name(laneToIndex, "laneToIndex");
function includesSomeLane(a, b) {
  return (a & b) !== NoLanes;
}
__name(includesSomeLane, "includesSomeLane");
function isSubsetOfLanes(set2, subset) {
  return (set2 & subset) === subset;
}
__name(isSubsetOfLanes, "isSubsetOfLanes");
function mergeLanes(a, b) {
  return a | b;
}
__name(mergeLanes, "mergeLanes");
function removeLanes(set2, subset) {
  return set2 & ~subset;
}
__name(removeLanes, "removeLanes");
function intersectLanes(a, b) {
  return a & b;
}
__name(intersectLanes, "intersectLanes");
function laneToLanes(lane) {
  return lane;
}
__name(laneToLanes, "laneToLanes");
function higherPriorityLane(a, b) {
  return a !== NoLane && a < b ? a : b;
}
__name(higherPriorityLane, "higherPriorityLane");
function createLaneMap(initial) {
  const laneMap = [];
  for (let i = 0; i < TotalLanes; i++) {
    laneMap.push(initial);
  }
  return laneMap;
}
__name(createLaneMap, "createLaneMap");
function markRootUpdated(root2, updateLane, eventTime) {
  root2.pendingLanes |= updateLane;
  if (updateLane !== IdleLane) {
    root2.suspendedLanes = NoLanes;
    root2.pingedLanes = NoLanes;
  }
  const eventTimes = root2.eventTimes;
  const index2 = laneToIndex(updateLane);
  eventTimes[index2] = eventTime;
}
__name(markRootUpdated, "markRootUpdated");
function markRootSuspended(root2, suspendedLanes) {
  root2.suspendedLanes |= suspendedLanes;
  root2.pingedLanes &= ~suspendedLanes;
  const expirationTimes = root2.expirationTimes;
  let lanes = suspendedLanes;
  while (lanes > 0) {
    const index2 = pickArbitraryLaneIndex(lanes);
    const lane = 1 << index2;
    expirationTimes[index2] = NoTimestamp;
    lanes &= ~lane;
  }
}
__name(markRootSuspended, "markRootSuspended");
function markRootPinged(root2, pingedLanes, eventTime) {
  root2.pingedLanes |= root2.suspendedLanes & pingedLanes;
}
__name(markRootPinged, "markRootPinged");
function markRootFinished(root2, remainingLanes) {
  const noLongerPendingLanes = root2.pendingLanes & ~remainingLanes;
  root2.pendingLanes = remainingLanes;
  root2.suspendedLanes = NoLanes;
  root2.pingedLanes = NoLanes;
  root2.expiredLanes &= remainingLanes;
  root2.mutableReadLanes &= remainingLanes;
  root2.entangledLanes &= remainingLanes;
  const entanglements = root2.entanglements;
  const eventTimes = root2.eventTimes;
  const expirationTimes = root2.expirationTimes;
  let lanes = noLongerPendingLanes;
  while (lanes > 0) {
    const index2 = pickArbitraryLaneIndex(lanes);
    const lane = 1 << index2;
    entanglements[index2] = NoLanes;
    eventTimes[index2] = NoTimestamp;
    expirationTimes[index2] = NoTimestamp;
    lanes &= ~lane;
  }
}
__name(markRootFinished, "markRootFinished");
function markRootEntangled(root2, entangledLanes) {
  const rootEntangledLanes = root2.entangledLanes |= entangledLanes;
  const entanglements = root2.entanglements;
  let lanes = rootEntangledLanes;
  while (lanes) {
    const index2 = pickArbitraryLaneIndex(lanes);
    const lane = 1 << index2;
    if (
      // Is this one of the newly entangled lanes?
      lane & entangledLanes | // Is this lane transitively entangled with the newly entangled lanes?
      entanglements[index2] & entangledLanes
    ) {
      entanglements[index2] |= entangledLanes;
    }
    lanes &= ~lane;
  }
}
__name(markRootEntangled, "markRootEntangled");
function getBumpedLaneForHydration(root2, renderLanes2) {
  const renderLane = getHighestPriorityLane(renderLanes2);
  let lane;
  switch (renderLane) {
    case InputContinuousLane:
      lane = InputContinuousHydrationLane;
      break;
    case DefaultLane:
      lane = DefaultHydrationLane;
      break;
    case TransitionLane1:
    case TransitionLane2:
    case TransitionLane3:
    case TransitionLane4:
    case TransitionLane5:
    case TransitionLane6:
    case TransitionLane7:
    case TransitionLane8:
    case TransitionLane9:
    case TransitionLane10:
    case TransitionLane11:
    case TransitionLane12:
    case TransitionLane13:
    case TransitionLane14:
    case TransitionLane15:
    case TransitionLane16:
    case RetryLane1:
    case RetryLane2:
    case RetryLane3:
    case RetryLane4:
    case RetryLane5:
      lane = TransitionHydrationLane;
      break;
    case IdleLane:
      lane = IdleHydrationLane;
      break;
    default:
      lane = NoLane;
      break;
  }
  if ((lane & (root2.suspendedLanes | renderLanes2)) !== NoLane) {
    return NoLane;
  }
  return lane;
}
__name(getBumpedLaneForHydration, "getBumpedLaneForHydration");
function getTransitionsForLanes(root2, lanes) {
  {
    return null;
  }
}
__name(getTransitionsForLanes, "getTransitionsForLanes");
var DiscreteEventPriority = SyncLane;
var ContinuousEventPriority = InputContinuousLane;
var DefaultEventPriority = DefaultLane;
var IdleEventPriority = IdleLane;
var currentUpdatePriority = NoLane;
function getCurrentUpdatePriority() {
  return currentUpdatePriority;
}
__name(getCurrentUpdatePriority, "getCurrentUpdatePriority");
function setCurrentUpdatePriority(newPriority) {
  currentUpdatePriority = newPriority;
}
__name(setCurrentUpdatePriority, "setCurrentUpdatePriority");
function runWithPriority(priority, fn) {
  const previousPriority = currentUpdatePriority;
  try {
    currentUpdatePriority = priority;
    return fn();
  } finally {
    currentUpdatePriority = previousPriority;
  }
}
__name(runWithPriority, "runWithPriority");
function higherEventPriority(a, b) {
  return a !== 0 && a < b ? a : b;
}
__name(higherEventPriority, "higherEventPriority");
function lowerEventPriority(a, b) {
  return a === 0 || a > b ? a : b;
}
__name(lowerEventPriority, "lowerEventPriority");
function isHigherEventPriority(a, b) {
  return a !== 0 && a < b;
}
__name(isHigherEventPriority, "isHigherEventPriority");
function lanesToEventPriority(lanes) {
  const lane = getHighestPriorityLane(lanes);
  if (!isHigherEventPriority(DiscreteEventPriority, lane)) {
    return DiscreteEventPriority;
  }
  if (!isHigherEventPriority(ContinuousEventPriority, lane)) {
    return ContinuousEventPriority;
  }
  if (includesNonIdleWork(lane)) {
    return DefaultEventPriority;
  }
  return IdleEventPriority;
}
__name(lanesToEventPriority, "lanesToEventPriority");
function isRootDehydrated(root2) {
  const currentState = root2.current.memoizedState;
  return currentState.isDehydrated;
}
__name(isRootDehydrated, "isRootDehydrated");
var _attemptSynchronousHydration;
function setAttemptSynchronousHydration(fn) {
  _attemptSynchronousHydration = fn;
}
__name(setAttemptSynchronousHydration, "setAttemptSynchronousHydration");
function attemptSynchronousHydration(fiber) {
  _attemptSynchronousHydration(fiber);
}
__name(attemptSynchronousHydration, "attemptSynchronousHydration");
var attemptContinuousHydration;
function setAttemptContinuousHydration(fn) {
  attemptContinuousHydration = fn;
}
__name(setAttemptContinuousHydration, "setAttemptContinuousHydration");
var attemptHydrationAtCurrentPriority;
function setAttemptHydrationAtCurrentPriority(fn) {
  attemptHydrationAtCurrentPriority = fn;
}
__name(setAttemptHydrationAtCurrentPriority, "setAttemptHydrationAtCurrentPriority");
var getCurrentUpdatePriority$1;
function setGetCurrentUpdatePriority(fn) {
  getCurrentUpdatePriority$1 = fn;
}
__name(setGetCurrentUpdatePriority, "setGetCurrentUpdatePriority");
var attemptHydrationAtPriority;
function setAttemptHydrationAtPriority(fn) {
  attemptHydrationAtPriority = fn;
}
__name(setAttemptHydrationAtPriority, "setAttemptHydrationAtPriority");
var hasScheduledReplayAttempt = false;
var queuedDiscreteEvents = [];
var queuedFocus = null;
var queuedDrag = null;
var queuedMouse = null;
var queuedPointers = /* @__PURE__ */ new Map();
var queuedPointerCaptures = /* @__PURE__ */ new Map();
var queuedExplicitHydrationTargets = [];
var discreteReplayableEvents = [
  "mousedown",
  "mouseup",
  "touchcancel",
  "touchend",
  "touchstart",
  "auxclick",
  "dblclick",
  "pointercancel",
  "pointerdown",
  "pointerup",
  "dragend",
  "dragstart",
  "drop",
  "compositionend",
  "compositionstart",
  "keydown",
  "keypress",
  "keyup",
  "input",
  "textInput",
  // Intentionally camelCase
  "copy",
  "cut",
  "paste",
  "click",
  "change",
  "contextmenu",
  "reset",
  "submit"
];
function isDiscreteEventThatRequiresHydration(eventType) {
  return discreteReplayableEvents.indexOf(eventType) > -1;
}
__name(isDiscreteEventThatRequiresHydration, "isDiscreteEventThatRequiresHydration");
function createQueuedReplayableEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
  return {
    blockedOn,
    domEventName,
    eventSystemFlags,
    nativeEvent,
    targetContainers: [targetContainer]
  };
}
__name(createQueuedReplayableEvent, "createQueuedReplayableEvent");
function clearIfContinuousEvent(domEventName, nativeEvent) {
  switch (domEventName) {
    case "focusin":
    case "focusout":
      queuedFocus = null;
      break;
    case "dragenter":
    case "dragleave":
      queuedDrag = null;
      break;
    case "mouseover":
    case "mouseout":
      queuedMouse = null;
      break;
    case "pointerover":
    case "pointerout": {
      const pointerId = nativeEvent.pointerId;
      queuedPointers.delete(pointerId);
      break;
    }
    case "gotpointercapture":
    case "lostpointercapture": {
      const pointerId = nativeEvent.pointerId;
      queuedPointerCaptures.delete(pointerId);
      break;
    }
  }
}
__name(clearIfContinuousEvent, "clearIfContinuousEvent");
function accumulateOrCreateContinuousQueuedReplayableEvent(existingQueuedEvent, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
  if (existingQueuedEvent === null || existingQueuedEvent.nativeEvent !== nativeEvent) {
    const queuedEvent = createQueuedReplayableEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent);
    if (blockedOn !== null) {
      const fiber = getInstanceFromNode(blockedOn);
      if (fiber !== null) {
        attemptContinuousHydration(fiber);
      }
    }
    return queuedEvent;
  }
  existingQueuedEvent.eventSystemFlags |= eventSystemFlags;
  const targetContainers = existingQueuedEvent.targetContainers;
  if (targetContainer !== null && targetContainers.indexOf(targetContainer) === -1) {
    targetContainers.push(targetContainer);
  }
  return existingQueuedEvent;
}
__name(accumulateOrCreateContinuousQueuedReplayableEvent, "accumulateOrCreateContinuousQueuedReplayableEvent");
function queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
  switch (domEventName) {
    case "focusin": {
      const focusEvent = nativeEvent;
      queuedFocus = accumulateOrCreateContinuousQueuedReplayableEvent(queuedFocus, blockedOn, domEventName, eventSystemFlags, targetContainer, focusEvent);
      return true;
    }
    case "dragenter": {
      const dragEvent = nativeEvent;
      queuedDrag = accumulateOrCreateContinuousQueuedReplayableEvent(queuedDrag, blockedOn, domEventName, eventSystemFlags, targetContainer, dragEvent);
      return true;
    }
    case "mouseover": {
      const mouseEvent = nativeEvent;
      queuedMouse = accumulateOrCreateContinuousQueuedReplayableEvent(queuedMouse, blockedOn, domEventName, eventSystemFlags, targetContainer, mouseEvent);
      return true;
    }
    case "pointerover": {
      const pointerEvent = nativeEvent;
      const pointerId = pointerEvent.pointerId;
      queuedPointers.set(pointerId, accumulateOrCreateContinuousQueuedReplayableEvent(queuedPointers.get(pointerId) || null, blockedOn, domEventName, eventSystemFlags, targetContainer, pointerEvent));
      return true;
    }
    case "gotpointercapture": {
      const pointerEvent = nativeEvent;
      const pointerId = pointerEvent.pointerId;
      queuedPointerCaptures.set(pointerId, accumulateOrCreateContinuousQueuedReplayableEvent(queuedPointerCaptures.get(pointerId) || null, blockedOn, domEventName, eventSystemFlags, targetContainer, pointerEvent));
      return true;
    }
  }
  return false;
}
__name(queueIfContinuousEvent, "queueIfContinuousEvent");
function attemptExplicitHydrationTarget(queuedTarget) {
  const targetInst = getClosestInstanceFromNode(queuedTarget.target);
  if (targetInst !== null) {
    const nearestMounted = getNearestMountedFiber(targetInst);
    if (nearestMounted !== null) {
      const tag = nearestMounted.tag;
      if (tag === SuspenseComponent) {
        const instance = getSuspenseInstanceFromFiber(nearestMounted);
        if (instance !== null) {
          queuedTarget.blockedOn = instance;
          attemptHydrationAtPriority(queuedTarget.priority, () => {
            attemptHydrationAtCurrentPriority(nearestMounted);
          });
          return;
        }
      } else if (tag === HostRoot) {
        const root2 = nearestMounted.stateNode;
        if (isRootDehydrated(root2)) {
          queuedTarget.blockedOn = getContainerFromFiber(nearestMounted);
          return;
        }
      }
    }
  }
  queuedTarget.blockedOn = null;
}
__name(attemptExplicitHydrationTarget, "attemptExplicitHydrationTarget");
function queueExplicitHydrationTarget(target) {
  const updatePriority = getCurrentUpdatePriority$1();
  const queuedTarget = {
    blockedOn: null,
    target,
    priority: updatePriority
  };
  let i = 0;
  for (; i < queuedExplicitHydrationTargets.length; i++) {
    if (!isHigherEventPriority(updatePriority, queuedExplicitHydrationTargets[i].priority)) {
      break;
    }
  }
  queuedExplicitHydrationTargets.splice(i, 0, queuedTarget);
  if (i === 0) {
    attemptExplicitHydrationTarget(queuedTarget);
  }
}
__name(queueExplicitHydrationTarget, "queueExplicitHydrationTarget");
function attemptReplayContinuousQueuedEvent(queuedEvent) {
  if (queuedEvent.blockedOn !== null) {
    return false;
  }
  const targetContainers = queuedEvent.targetContainers;
  while (targetContainers.length > 0) {
    const targetContainer = targetContainers[0];
    const nextBlockedOn = findInstanceBlockingEvent(queuedEvent.domEventName, queuedEvent.eventSystemFlags, targetContainer, queuedEvent.nativeEvent);
    if (nextBlockedOn === null) {
      {
        const nativeEvent = queuedEvent.nativeEvent;
        const nativeEventClone = new nativeEvent.constructor(nativeEvent.type, nativeEvent);
        setReplayingEvent(nativeEventClone);
        nativeEvent.target.dispatchEvent(nativeEventClone);
        resetReplayingEvent();
      }
    } else {
      const fiber = getInstanceFromNode(nextBlockedOn);
      if (fiber !== null) {
        attemptContinuousHydration(fiber);
      }
      queuedEvent.blockedOn = nextBlockedOn;
      return false;
    }
    targetContainers.shift();
  }
  return true;
}
__name(attemptReplayContinuousQueuedEvent, "attemptReplayContinuousQueuedEvent");
function attemptReplayContinuousQueuedEventInMap(queuedEvent, key, map) {
  if (attemptReplayContinuousQueuedEvent(queuedEvent)) {
    map.delete(key);
  }
}
__name(attemptReplayContinuousQueuedEventInMap, "attemptReplayContinuousQueuedEventInMap");
function replayUnblockedEvents() {
  hasScheduledReplayAttempt = false;
  if (queuedFocus !== null && attemptReplayContinuousQueuedEvent(queuedFocus)) {
    queuedFocus = null;
  }
  if (queuedDrag !== null && attemptReplayContinuousQueuedEvent(queuedDrag)) {
    queuedDrag = null;
  }
  if (queuedMouse !== null && attemptReplayContinuousQueuedEvent(queuedMouse)) {
    queuedMouse = null;
  }
  queuedPointers.forEach(attemptReplayContinuousQueuedEventInMap);
  queuedPointerCaptures.forEach(attemptReplayContinuousQueuedEventInMap);
}
__name(replayUnblockedEvents, "replayUnblockedEvents");
function scheduleCallbackIfUnblocked(queuedEvent, unblocked) {
  if (queuedEvent.blockedOn === unblocked) {
    queuedEvent.blockedOn = null;
    if (!hasScheduledReplayAttempt) {
      hasScheduledReplayAttempt = true;
      unstable_scheduleCallback(NormalPriority, replayUnblockedEvents);
    }
  }
}
__name(scheduleCallbackIfUnblocked, "scheduleCallbackIfUnblocked");
function retryIfBlockedOn(unblocked) {
  if (queuedDiscreteEvents.length > 0) {
    scheduleCallbackIfUnblocked(queuedDiscreteEvents[0], unblocked);
    for (let i = 1; i < queuedDiscreteEvents.length; i++) {
      const queuedEvent = queuedDiscreteEvents[i];
      if (queuedEvent.blockedOn === unblocked) {
        queuedEvent.blockedOn = null;
      }
    }
  }
  if (queuedFocus !== null) {
    scheduleCallbackIfUnblocked(queuedFocus, unblocked);
  }
  if (queuedDrag !== null) {
    scheduleCallbackIfUnblocked(queuedDrag, unblocked);
  }
  if (queuedMouse !== null) {
    scheduleCallbackIfUnblocked(queuedMouse, unblocked);
  }
  const unblock = /* @__PURE__ */ __name((queuedEvent) => scheduleCallbackIfUnblocked(queuedEvent, unblocked), "unblock");
  queuedPointers.forEach(unblock);
  queuedPointerCaptures.forEach(unblock);
  for (let i = 0; i < queuedExplicitHydrationTargets.length; i++) {
    const queuedTarget = queuedExplicitHydrationTargets[i];
    if (queuedTarget.blockedOn === unblocked) {
      queuedTarget.blockedOn = null;
    }
  }
  while (queuedExplicitHydrationTargets.length > 0) {
    const nextExplicitTarget = queuedExplicitHydrationTargets[0];
    if (nextExplicitTarget.blockedOn !== null) {
      break;
    } else {
      attemptExplicitHydrationTarget(nextExplicitTarget);
      if (nextExplicitTarget.blockedOn === null) {
        queuedExplicitHydrationTargets.shift();
      }
    }
  }
}
__name(retryIfBlockedOn, "retryIfBlockedOn");
var ReactCurrentBatchConfig = ReactSharedInternals.ReactCurrentBatchConfig;
var _enabled = true;
function setEnabled(enabled) {
  _enabled = !!enabled;
}
__name(setEnabled, "setEnabled");
function isEnabled() {
  return _enabled;
}
__name(isEnabled, "isEnabled");
function createEventListenerWrapperWithPriority(targetContainer, domEventName, eventSystemFlags) {
  const eventPriority = getEventPriority(domEventName);
  let listenerWrapper;
  switch (eventPriority) {
    case DiscreteEventPriority:
      listenerWrapper = dispatchDiscreteEvent;
      break;
    case ContinuousEventPriority:
      listenerWrapper = dispatchContinuousEvent;
      break;
    case DefaultEventPriority:
    default:
      listenerWrapper = dispatchEvent;
      break;
  }
  return listenerWrapper.bind(null, domEventName, eventSystemFlags, targetContainer);
}
__name(createEventListenerWrapperWithPriority, "createEventListenerWrapperWithPriority");
function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
  const previousPriority = getCurrentUpdatePriority();
  const prevTransition = ReactCurrentBatchConfig.transition;
  ReactCurrentBatchConfig.transition = null;
  try {
    setCurrentUpdatePriority(DiscreteEventPriority);
    dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
  } finally {
    setCurrentUpdatePriority(previousPriority);
    ReactCurrentBatchConfig.transition = prevTransition;
  }
}
__name(dispatchDiscreteEvent, "dispatchDiscreteEvent");
function dispatchContinuousEvent(domEventName, eventSystemFlags, container, nativeEvent) {
  const previousPriority = getCurrentUpdatePriority();
  const prevTransition = ReactCurrentBatchConfig.transition;
  ReactCurrentBatchConfig.transition = null;
  try {
    setCurrentUpdatePriority(ContinuousEventPriority);
    dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
  } finally {
    setCurrentUpdatePriority(previousPriority);
    ReactCurrentBatchConfig.transition = prevTransition;
  }
}
__name(dispatchContinuousEvent, "dispatchContinuousEvent");
function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
  if (!_enabled) {
    return;
  }
  {
    dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay(domEventName, eventSystemFlags, targetContainer, nativeEvent);
  }
}
__name(dispatchEvent, "dispatchEvent");
function dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
  let blockedOn = findInstanceBlockingEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent);
  if (blockedOn === null) {
    dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, return_targetInst, targetContainer);
    clearIfContinuousEvent(domEventName, nativeEvent);
    return;
  }
  if (queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent)) {
    nativeEvent.stopPropagation();
    return;
  }
  clearIfContinuousEvent(domEventName, nativeEvent);
  if (eventSystemFlags & IS_CAPTURE_PHASE && isDiscreteEventThatRequiresHydration(domEventName)) {
    while (blockedOn !== null) {
      const fiber = getInstanceFromNode(blockedOn);
      if (fiber !== null) {
        attemptSynchronousHydration(fiber);
      }
      const nextBlockedOn = findInstanceBlockingEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent);
      if (nextBlockedOn === null) {
        dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, return_targetInst, targetContainer);
      }
      if (nextBlockedOn === blockedOn) {
        break;
      }
      blockedOn = nextBlockedOn;
    }
    if (blockedOn !== null) {
      nativeEvent.stopPropagation();
    }
    return;
  }
  dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, null, targetContainer);
}
__name(dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay, "dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay");
var return_targetInst = null;
function findInstanceBlockingEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
  return_targetInst = null;
  const nativeEventTarget = getEventTarget(nativeEvent);
  let targetInst = getClosestInstanceFromNode(nativeEventTarget);
  if (targetInst !== null) {
    const nearestMounted = getNearestMountedFiber(targetInst);
    if (nearestMounted === null) {
      targetInst = null;
    } else {
      const tag = nearestMounted.tag;
      if (tag === SuspenseComponent) {
        const instance = getSuspenseInstanceFromFiber(nearestMounted);
        if (instance !== null) {
          return instance;
        }
        targetInst = null;
      } else if (tag === HostRoot) {
        const root2 = nearestMounted.stateNode;
        if (isRootDehydrated(root2)) {
          return getContainerFromFiber(nearestMounted);
        }
        targetInst = null;
      } else if (nearestMounted !== targetInst) {
        targetInst = null;
      }
    }
  }
  return_targetInst = targetInst;
  return null;
}
__name(findInstanceBlockingEvent, "findInstanceBlockingEvent");
function getEventPriority(domEventName) {
  switch (domEventName) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return DiscreteEventPriority;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return ContinuousEventPriority;
    case "message": {
      const schedulerPriority = getCurrentPriorityLevel();
      switch (schedulerPriority) {
        case ImmediatePriority2:
          return DiscreteEventPriority;
        case UserBlockingPriority2:
          return ContinuousEventPriority;
        case NormalPriority2:
        case LowPriority2:
          return DefaultEventPriority;
        case IdlePriority2:
          return IdleEventPriority;
        default:
          return DefaultEventPriority;
      }
    }
    default:
      return DefaultEventPriority;
  }
}
__name(getEventPriority, "getEventPriority");
function addEventBubbleListener(target, eventType, listener) {
  target.addEventListener(eventType, listener, false);
  return listener;
}
__name(addEventBubbleListener, "addEventBubbleListener");
function addEventCaptureListener(target, eventType, listener) {
  target.addEventListener(eventType, listener, true);
  return listener;
}
__name(addEventCaptureListener, "addEventCaptureListener");
function addEventCaptureListenerWithPassiveFlag(target, eventType, listener, passive) {
  target.addEventListener(eventType, listener, {
    capture: true,
    passive
  });
  return listener;
}
__name(addEventCaptureListenerWithPassiveFlag, "addEventCaptureListenerWithPassiveFlag");
function addEventBubbleListenerWithPassiveFlag(target, eventType, listener, passive) {
  target.addEventListener(eventType, listener, {
    passive
  });
  return listener;
}
__name(addEventBubbleListenerWithPassiveFlag, "addEventBubbleListenerWithPassiveFlag");
var root = null;
var startText = null;
var fallbackText = null;
function initialize(nativeEventTarget) {
  root = nativeEventTarget;
  startText = getText();
  return true;
}
__name(initialize, "initialize");
function reset() {
  root = null;
  startText = null;
  fallbackText = null;
}
__name(reset, "reset");
function getData() {
  if (fallbackText) {
    return fallbackText;
  }
  let start;
  const startValue = startText;
  const startLength = startValue.length;
  let end;
  const endValue = getText();
  const endLength = endValue.length;
  for (start = 0; start < startLength; start++) {
    if (startValue[start] !== endValue[start]) {
      break;
    }
  }
  const minEnd = startLength - start;
  for (end = 1; end <= minEnd; end++) {
    if (startValue[startLength - end] !== endValue[endLength - end]) {
      break;
    }
  }
  const sliceTail = end > 1 ? 1 - end : void 0;
  fallbackText = endValue.slice(start, sliceTail);
  return fallbackText;
}
__name(getData, "getData");
function getText() {
  if ("value" in root) {
    return root.value;
  }
  return root.textContent;
}
__name(getText, "getText");
function getEventCharCode(nativeEvent) {
  let charCode;
  const keyCode = nativeEvent.keyCode;
  if ("charCode" in nativeEvent) {
    charCode = nativeEvent.charCode;
    if (charCode === 0 && keyCode === 13) {
      charCode = 13;
    }
  } else {
    charCode = keyCode;
  }
  if (charCode === 10) {
    charCode = 13;
  }
  if (charCode >= 32 || charCode === 13) {
    return charCode;
  }
  return 0;
}
__name(getEventCharCode, "getEventCharCode");
function functionThatReturnsTrue() {
  return true;
}
__name(functionThatReturnsTrue, "functionThatReturnsTrue");
function functionThatReturnsFalse() {
  return false;
}
__name(functionThatReturnsFalse, "functionThatReturnsFalse");
function createSyntheticEvent(Interface) {
  function SyntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
    this._reactName = reactName;
    this._targetInst = targetInst;
    this.type = reactEventType;
    this.nativeEvent = nativeEvent;
    this.target = nativeEventTarget;
    this.currentTarget = null;
    for (const propName in Interface) {
      if (!Interface.hasOwnProperty(propName)) {
        continue;
      }
      const normalize = Interface[propName];
      if (normalize) {
        this[propName] = normalize(nativeEvent);
      } else {
        this[propName] = nativeEvent[propName];
      }
    }
    const defaultPrevented = nativeEvent.defaultPrevented != null ? nativeEvent.defaultPrevented : nativeEvent.returnValue === false;
    if (defaultPrevented) {
      this.isDefaultPrevented = functionThatReturnsTrue;
    } else {
      this.isDefaultPrevented = functionThatReturnsFalse;
    }
    this.isPropagationStopped = functionThatReturnsFalse;
    return this;
  }
  __name(SyntheticBaseEvent, "SyntheticBaseEvent");
  assign(SyntheticBaseEvent.prototype, {
    preventDefault: function() {
      this.defaultPrevented = true;
      const event = this.nativeEvent;
      if (!event) {
        return;
      }
      if (event.preventDefault) {
        event.preventDefault();
      } else if (typeof event.returnValue !== "unknown") {
        event.returnValue = false;
      }
      this.isDefaultPrevented = functionThatReturnsTrue;
    },
    stopPropagation: function() {
      const event = this.nativeEvent;
      if (!event) {
        return;
      }
      if (event.stopPropagation) {
        event.stopPropagation();
      } else if (typeof event.cancelBubble !== "unknown") {
        event.cancelBubble = true;
      }
      this.isPropagationStopped = functionThatReturnsTrue;
    },
    /**
     * We release all dispatched `SyntheticEvent`s after each event loop, adding
     * them back into the pool. This allows a way to hold onto a reference that
     * won't be added back into the pool.
     */
    persist: function() {
    },
    /**
     * Checks if this event should be released back into the pool.
     *
     * @return {boolean} True if this should not be released, false otherwise.
     */
    isPersistent: functionThatReturnsTrue
  });
  return SyntheticBaseEvent;
}
__name(createSyntheticEvent, "createSyntheticEvent");
var EventInterface = {
  eventPhase: 0,
  bubbles: 0,
  cancelable: 0,
  timeStamp: function(event) {
    return event.timeStamp || Date.now();
  },
  defaultPrevented: 0,
  isTrusted: 0
};
var SyntheticEvent = createSyntheticEvent(EventInterface);
var UIEventInterface = assign({}, EventInterface, {
  view: 0,
  detail: 0
});
var SyntheticUIEvent = createSyntheticEvent(UIEventInterface);
var lastMovementX;
var lastMovementY;
var lastMouseEvent;
function updateMouseMovementPolyfillState(event) {
  if (event !== lastMouseEvent) {
    if (lastMouseEvent && event.type === "mousemove") {
      lastMovementX = event.screenX - lastMouseEvent.screenX;
      lastMovementY = event.screenY - lastMouseEvent.screenY;
    } else {
      lastMovementX = 0;
      lastMovementY = 0;
    }
    lastMouseEvent = event;
  }
}
__name(updateMouseMovementPolyfillState, "updateMouseMovementPolyfillState");
var MouseEventInterface = assign({}, UIEventInterface, {
  screenX: 0,
  screenY: 0,
  clientX: 0,
  clientY: 0,
  pageX: 0,
  pageY: 0,
  ctrlKey: 0,
  shiftKey: 0,
  altKey: 0,
  metaKey: 0,
  getModifierState: getEventModifierState,
  button: 0,
  buttons: 0,
  relatedTarget: function(event) {
    if (event.relatedTarget === void 0)
      return event.fromElement === event.srcElement ? event.toElement : event.fromElement;
    return event.relatedTarget;
  },
  movementX: function(event) {
    if ("movementX" in event) {
      return event.movementX;
    }
    updateMouseMovementPolyfillState(event);
    return lastMovementX;
  },
  movementY: function(event) {
    if ("movementY" in event) {
      return event.movementY;
    }
    return lastMovementY;
  }
});
var SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface);
var DragEventInterface = assign({}, MouseEventInterface, {
  dataTransfer: 0
});
var SyntheticDragEvent = createSyntheticEvent(DragEventInterface);
var FocusEventInterface = assign({}, UIEventInterface, {
  relatedTarget: 0
});
var SyntheticFocusEvent = createSyntheticEvent(FocusEventInterface);
var AnimationEventInterface = assign({}, EventInterface, {
  animationName: 0,
  elapsedTime: 0,
  pseudoElement: 0
});
var SyntheticAnimationEvent = createSyntheticEvent(AnimationEventInterface);
var ClipboardEventInterface = assign({}, EventInterface, {
  clipboardData: function(event) {
    return "clipboardData" in event ? event.clipboardData : window.clipboardData;
  }
});
var SyntheticClipboardEvent = createSyntheticEvent(ClipboardEventInterface);
var CompositionEventInterface = assign({}, EventInterface, {
  data: 0
});
var SyntheticCompositionEvent = createSyntheticEvent(CompositionEventInterface);
var SyntheticInputEvent = SyntheticCompositionEvent;
var normalizeKey = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
};
var translateToKey = {
  "8": "Backspace",
  "9": "Tab",
  "12": "Clear",
  "13": "Enter",
  "16": "Shift",
  "17": "Control",
  "18": "Alt",
  "19": "Pause",
  "20": "CapsLock",
  "27": "Escape",
  "32": " ",
  "33": "PageUp",
  "34": "PageDown",
  "35": "End",
  "36": "Home",
  "37": "ArrowLeft",
  "38": "ArrowUp",
  "39": "ArrowRight",
  "40": "ArrowDown",
  "45": "Insert",
  "46": "Delete",
  "112": "F1",
  "113": "F2",
  "114": "F3",
  "115": "F4",
  "116": "F5",
  "117": "F6",
  "118": "F7",
  "119": "F8",
  "120": "F9",
  "121": "F10",
  "122": "F11",
  "123": "F12",
  "144": "NumLock",
  "145": "ScrollLock",
  "224": "Meta"
};
function getEventKey(nativeEvent) {
  if (nativeEvent.key) {
    const key = normalizeKey[nativeEvent.key] || nativeEvent.key;
    if (key !== "Unidentified") {
      return key;
    }
  }
  if (nativeEvent.type === "keypress") {
    const charCode = getEventCharCode(nativeEvent);
    return charCode === 13 ? "Enter" : String.fromCharCode(charCode);
  }
  if (nativeEvent.type === "keydown" || nativeEvent.type === "keyup") {
    return translateToKey[nativeEvent.keyCode] || "Unidentified";
  }
  return "";
}
__name(getEventKey, "getEventKey");
var modifierKeyToProp = {
  Alt: "altKey",
  Control: "ctrlKey",
  Meta: "metaKey",
  Shift: "shiftKey"
};
function modifierStateGetter(keyArg) {
  const syntheticEvent = this;
  const nativeEvent = syntheticEvent.nativeEvent;
  if (nativeEvent.getModifierState) {
    return nativeEvent.getModifierState(keyArg);
  }
  const keyProp = modifierKeyToProp[keyArg];
  return keyProp ? !!nativeEvent[keyProp] : false;
}
__name(modifierStateGetter, "modifierStateGetter");
function getEventModifierState(nativeEvent) {
  return modifierStateGetter;
}
__name(getEventModifierState, "getEventModifierState");
var KeyboardEventInterface = assign({}, UIEventInterface, {
  key: getEventKey,
  code: 0,
  location: 0,
  ctrlKey: 0,
  shiftKey: 0,
  altKey: 0,
  metaKey: 0,
  repeat: 0,
  locale: 0,
  getModifierState: getEventModifierState,
  // Legacy Interface
  charCode: function(event) {
    if (event.type === "keypress") {
      return getEventCharCode(event);
    }
    return 0;
  },
  keyCode: function(event) {
    if (event.type === "keydown" || event.type === "keyup") {
      return event.keyCode;
    }
    return 0;
  },
  which: function(event) {
    if (event.type === "keypress") {
      return getEventCharCode(event);
    }
    if (event.type === "keydown" || event.type === "keyup") {
      return event.keyCode;
    }
    return 0;
  }
});
var SyntheticKeyboardEvent = createSyntheticEvent(KeyboardEventInterface);
var PointerEventInterface = assign({}, MouseEventInterface, {
  pointerId: 0,
  width: 0,
  height: 0,
  pressure: 0,
  tangentialPressure: 0,
  tiltX: 0,
  tiltY: 0,
  twist: 0,
  pointerType: 0,
  isPrimary: 0
});
var SyntheticPointerEvent = createSyntheticEvent(PointerEventInterface);
var TouchEventInterface = assign({}, UIEventInterface, {
  touches: 0,
  targetTouches: 0,
  changedTouches: 0,
  altKey: 0,
  metaKey: 0,
  ctrlKey: 0,
  shiftKey: 0,
  getModifierState: getEventModifierState
});
var SyntheticTouchEvent = createSyntheticEvent(TouchEventInterface);
var TransitionEventInterface = assign({}, EventInterface, {
  propertyName: 0,
  elapsedTime: 0,
  pseudoElement: 0
});
var SyntheticTransitionEvent = createSyntheticEvent(TransitionEventInterface);
var WheelEventInterface = assign({}, MouseEventInterface, {
  deltaX(event) {
    return "deltaX" in event ? event.deltaX : (
      // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
      "wheelDeltaX" in event ? -event.wheelDeltaX : 0
    );
  },
  deltaY(event) {
    return "deltaY" in event ? event.deltaY : (
      // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
      "wheelDeltaY" in event ? -event.wheelDeltaY : (
        // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
        "wheelDelta" in event ? -event.wheelDelta : 0
      )
    );
  },
  deltaZ: 0,
  // Browsers without "deltaMode" is reporting in raw wheel delta where one
  // notch on the scroll is always +/- 120, roughly equivalent to pixels.
  // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
  // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
  deltaMode: 0
});
var SyntheticWheelEvent = createSyntheticEvent(WheelEventInterface);
var END_KEYCODES = [9, 13, 27, 32];
var START_KEYCODE = 229;
var canUseCompositionEvent = canUseDOM && "CompositionEvent" in window;
var documentMode = null;
if (canUseDOM && "documentMode" in document) {
  documentMode = document.documentMode;
}
var canUseTextInputEvent = canUseDOM && "TextEvent" in window && !documentMode;
var useFallbackCompositionData = canUseDOM && (!canUseCompositionEvent || documentMode && documentMode > 8 && documentMode <= 11);
var SPACEBAR_CODE = 32;
var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE);
function registerEvents() {
  registerTwoPhaseEvent("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
  registerTwoPhaseEvent("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
  registerTwoPhaseEvent("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
  registerTwoPhaseEvent("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
}
__name(registerEvents, "registerEvents");
var hasSpaceKeypress = false;
function isKeypressCommand(nativeEvent) {
  return (nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
  !(nativeEvent.ctrlKey && nativeEvent.altKey);
}
__name(isKeypressCommand, "isKeypressCommand");
function getCompositionEventType(domEventName) {
  switch (domEventName) {
    case "compositionstart":
      return "onCompositionStart";
    case "compositionend":
      return "onCompositionEnd";
    case "compositionupdate":
      return "onCompositionUpdate";
  }
}
__name(getCompositionEventType, "getCompositionEventType");
function isFallbackCompositionStart(domEventName, nativeEvent) {
  return domEventName === "keydown" && nativeEvent.keyCode === START_KEYCODE;
}
__name(isFallbackCompositionStart, "isFallbackCompositionStart");
function isFallbackCompositionEnd(domEventName, nativeEvent) {
  switch (domEventName) {
    case "keyup":
      return END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1;
    case "keydown":
      return nativeEvent.keyCode !== START_KEYCODE;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
__name(isFallbackCompositionEnd, "isFallbackCompositionEnd");
function getDataFromCustomEvent(nativeEvent) {
  const detail = nativeEvent.detail;
  if (typeof detail === "object" && "data" in detail) {
    return detail.data;
  }
  return null;
}
__name(getDataFromCustomEvent, "getDataFromCustomEvent");
function isUsingKoreanIME(nativeEvent) {
  return nativeEvent.locale === "ko";
}
__name(isUsingKoreanIME, "isUsingKoreanIME");
var isComposing = false;
function extractCompositionEvent(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget) {
  let eventType;
  let fallbackData;
  if (canUseCompositionEvent) {
    eventType = getCompositionEventType(domEventName);
  } else if (!isComposing) {
    if (isFallbackCompositionStart(domEventName, nativeEvent)) {
      eventType = "onCompositionStart";
    }
  } else if (isFallbackCompositionEnd(domEventName, nativeEvent)) {
    eventType = "onCompositionEnd";
  }
  if (!eventType) {
    return null;
  }
  if (useFallbackCompositionData && !isUsingKoreanIME(nativeEvent)) {
    if (!isComposing && eventType === "onCompositionStart") {
      isComposing = initialize(nativeEventTarget);
    } else if (eventType === "onCompositionEnd") {
      if (isComposing) {
        fallbackData = getData();
      }
    }
  }
  const listeners = accumulateTwoPhaseListeners(targetInst, eventType);
  if (listeners.length > 0) {
    const event = new SyntheticCompositionEvent(eventType, domEventName, null, nativeEvent, nativeEventTarget);
    dispatchQueue.push({
      event,
      listeners
    });
    if (fallbackData) {
      event.data = fallbackData;
    } else {
      const customData = getDataFromCustomEvent(nativeEvent);
      if (customData !== null) {
        event.data = customData;
      }
    }
  }
}
__name(extractCompositionEvent, "extractCompositionEvent");
function getNativeBeforeInputChars(domEventName, nativeEvent) {
  switch (domEventName) {
    case "compositionend":
      return getDataFromCustomEvent(nativeEvent);
    case "keypress":
      const which = nativeEvent.which;
      if (which !== SPACEBAR_CODE) {
        return null;
      }
      hasSpaceKeypress = true;
      return SPACEBAR_CHAR;
    case "textInput":
      const chars = nativeEvent.data;
      if (chars === SPACEBAR_CHAR && hasSpaceKeypress) {
        return null;
      }
      return chars;
    default:
      return null;
  }
}
__name(getNativeBeforeInputChars, "getNativeBeforeInputChars");
function getFallbackBeforeInputChars(domEventName, nativeEvent) {
  if (isComposing) {
    if (domEventName === "compositionend" || !canUseCompositionEvent && isFallbackCompositionEnd(domEventName, nativeEvent)) {
      const chars = getData();
      reset();
      isComposing = false;
      return chars;
    }
    return null;
  }
  switch (domEventName) {
    case "paste":
      return null;
    case "keypress":
      if (!isKeypressCommand(nativeEvent)) {
        if (nativeEvent.char && nativeEvent.char.length > 1) {
          return nativeEvent.char;
        } else if (nativeEvent.which) {
          return String.fromCharCode(nativeEvent.which);
        }
      }
      return null;
    case "compositionend":
      return useFallbackCompositionData && !isUsingKoreanIME(nativeEvent) ? null : nativeEvent.data;
    default:
      return null;
  }
}
__name(getFallbackBeforeInputChars, "getFallbackBeforeInputChars");
function extractBeforeInputEvent(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget) {
  let chars;
  if (canUseTextInputEvent) {
    chars = getNativeBeforeInputChars(domEventName, nativeEvent);
  } else {
    chars = getFallbackBeforeInputChars(domEventName, nativeEvent);
  }
  if (!chars) {
    return null;
  }
  const listeners = accumulateTwoPhaseListeners(targetInst, "onBeforeInput");
  if (listeners.length > 0) {
    const event = new SyntheticInputEvent("onBeforeInput", "beforeinput", null, nativeEvent, nativeEventTarget);
    dispatchQueue.push({
      event,
      listeners
    });
    event.data = chars;
  }
}
__name(extractBeforeInputEvent, "extractBeforeInputEvent");
function extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
  extractCompositionEvent(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
  extractBeforeInputEvent(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
}
__name(extractEvents, "extractEvents");
var supportedInputTypes = {
  color: true,
  date: true,
  datetime: true,
  "datetime-local": true,
  email: true,
  month: true,
  number: true,
  password: true,
  range: true,
  search: true,
  tel: true,
  text: true,
  time: true,
  url: true,
  week: true
};
function isTextInputElement(elem) {
  const nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
  if (nodeName === "input") {
    return !!supportedInputTypes[elem.type];
  }
  if (nodeName === "textarea") {
    return true;
  }
  return false;
}
__name(isTextInputElement, "isTextInputElement");
function isEventSupported(eventNameSuffix) {
  if (!canUseDOM) {
    return false;
  }
  const eventName = "on" + eventNameSuffix;
  let isSupported = eventName in document;
  if (!isSupported) {
    const element = document.createElement("div");
    element.setAttribute(eventName, "return;");
    isSupported = typeof element[eventName] === "function";
  }
  return isSupported;
}
__name(isEventSupported, "isEventSupported");
function registerEvents$1() {
  registerTwoPhaseEvent("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
}
__name(registerEvents$1, "registerEvents$1");
function createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, target) {
  enqueueStateRestore(target);
  const listeners = accumulateTwoPhaseListeners(inst, "onChange");
  if (listeners.length > 0) {
    const event = new SyntheticEvent("onChange", "change", null, nativeEvent, target);
    dispatchQueue.push({
      event,
      listeners
    });
  }
}
__name(createAndAccumulateChangeEvent, "createAndAccumulateChangeEvent");
var activeElement = null;
var activeElementInst = null;
function shouldUseChangeEvent(elem) {
  const nodeName = elem.nodeName && elem.nodeName.toLowerCase();
  return nodeName === "select" || nodeName === "input" && elem.type === "file";
}
__name(shouldUseChangeEvent, "shouldUseChangeEvent");
function manualDispatchChangeEvent(nativeEvent) {
  const dispatchQueue = [];
  createAndAccumulateChangeEvent(dispatchQueue, activeElementInst, nativeEvent, getEventTarget(nativeEvent));
  batchedUpdates(runEventInBatch, dispatchQueue);
}
__name(manualDispatchChangeEvent, "manualDispatchChangeEvent");
function runEventInBatch(dispatchQueue) {
  processDispatchQueue(dispatchQueue, 0);
}
__name(runEventInBatch, "runEventInBatch");
function getInstIfValueChanged(targetInst) {
  const targetNode = getNodeFromInstance(targetInst);
  if (updateValueIfChanged(targetNode)) {
    return targetInst;
  }
}
__name(getInstIfValueChanged, "getInstIfValueChanged");
function getTargetInstForChangeEvent(domEventName, targetInst) {
  if (domEventName === "change") {
    return targetInst;
  }
}
__name(getTargetInstForChangeEvent, "getTargetInstForChangeEvent");
var isInputEventSupported = false;
if (canUseDOM) {
  isInputEventSupported = isEventSupported("input") && (!document.documentMode || document.documentMode > 9);
}
function startWatchingForValueChange(target, targetInst) {
  activeElement = target;
  activeElementInst = targetInst;
  activeElement.attachEvent("onpropertychange", handlePropertyChange);
}
__name(startWatchingForValueChange, "startWatchingForValueChange");
function stopWatchingForValueChange() {
  if (!activeElement) {
    return;
  }
  activeElement.detachEvent("onpropertychange", handlePropertyChange);
  activeElement = null;
  activeElementInst = null;
}
__name(stopWatchingForValueChange, "stopWatchingForValueChange");
function handlePropertyChange(nativeEvent) {
  if (nativeEvent.propertyName !== "value") {
    return;
  }
  if (getInstIfValueChanged(activeElementInst)) {
    manualDispatchChangeEvent(nativeEvent);
  }
}
__name(handlePropertyChange, "handlePropertyChange");
function handleEventsForInputEventPolyfill(domEventName, target, targetInst) {
  if (domEventName === "focusin") {
    stopWatchingForValueChange();
    startWatchingForValueChange(target, targetInst);
  } else if (domEventName === "focusout") {
    stopWatchingForValueChange();
  }
}
__name(handleEventsForInputEventPolyfill, "handleEventsForInputEventPolyfill");
function getTargetInstForInputEventPolyfill(domEventName, targetInst) {
  if (domEventName === "selectionchange" || domEventName === "keyup" || domEventName === "keydown") {
    return getInstIfValueChanged(activeElementInst);
  }
}
__name(getTargetInstForInputEventPolyfill, "getTargetInstForInputEventPolyfill");
function shouldUseClickEvent(elem) {
  const nodeName = elem.nodeName;
  return nodeName && nodeName.toLowerCase() === "input" && (elem.type === "checkbox" || elem.type === "radio");
}
__name(shouldUseClickEvent, "shouldUseClickEvent");
function getTargetInstForClickEvent(domEventName, targetInst) {
  if (domEventName === "click") {
    return getInstIfValueChanged(targetInst);
  }
}
__name(getTargetInstForClickEvent, "getTargetInstForClickEvent");
function getTargetInstForInputOrChangeEvent(domEventName, targetInst) {
  if (domEventName === "input" || domEventName === "change") {
    return getInstIfValueChanged(targetInst);
  }
}
__name(getTargetInstForInputOrChangeEvent, "getTargetInstForInputOrChangeEvent");
function handleControlledInputBlur(node) {
  const state = node._wrapperState;
  if (!state || !state.controlled || node.type !== "number") {
    return;
  }
  {
    setDefaultValue(node, "number", node.value);
  }
}
__name(handleControlledInputBlur, "handleControlledInputBlur");
function extractEvents$1(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
  const targetNode = targetInst ? getNodeFromInstance(targetInst) : window;
  let getTargetInstFunc, handleEventFunc;
  if (shouldUseChangeEvent(targetNode)) {
    getTargetInstFunc = getTargetInstForChangeEvent;
  } else if (isTextInputElement(targetNode)) {
    if (isInputEventSupported) {
      getTargetInstFunc = getTargetInstForInputOrChangeEvent;
    } else {
      getTargetInstFunc = getTargetInstForInputEventPolyfill;
      handleEventFunc = handleEventsForInputEventPolyfill;
    }
  } else if (shouldUseClickEvent(targetNode)) {
    getTargetInstFunc = getTargetInstForClickEvent;
  } else if (targetInst && isCustomComponent(targetInst.elementType, targetInst.memoizedProps)) {
    getTargetInstFunc = getTargetInstForChangeEvent;
  }
  if (getTargetInstFunc) {
    const inst = getTargetInstFunc(domEventName, targetInst);
    if (inst) {
      createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, nativeEventTarget);
      return;
    }
  }
  if (handleEventFunc) {
    handleEventFunc(domEventName, targetNode, targetInst);
  }
  if (domEventName === "focusout") {
    handleControlledInputBlur(targetNode);
  }
}
__name(extractEvents$1, "extractEvents$1");
function registerEvents$2() {
  registerDirectEvent("onMouseEnter", ["mouseout", "mouseover"]);
  registerDirectEvent("onMouseLeave", ["mouseout", "mouseover"]);
  registerDirectEvent("onPointerEnter", ["pointerout", "pointerover"]);
  registerDirectEvent("onPointerLeave", ["pointerout", "pointerover"]);
}
__name(registerEvents$2, "registerEvents$2");
function extractEvents$2(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
  const isOverEvent = domEventName === "mouseover" || domEventName === "pointerover";
  const isOutEvent = domEventName === "mouseout" || domEventName === "pointerout";
  if (isOverEvent && !isReplayingEvent(nativeEvent)) {
    const related = nativeEvent.relatedTarget || nativeEvent.fromElement;
    if (related) {
      if (getClosestInstanceFromNode(related) || isContainerMarkedAsRoot(related)) {
        return;
      }
    }
  }
  if (!isOutEvent && !isOverEvent) {
    return;
  }
  let win;
  if (nativeEventTarget.window === nativeEventTarget) {
    win = nativeEventTarget;
  } else {
    const doc = nativeEventTarget.ownerDocument;
    if (doc) {
      win = doc.defaultView || doc.parentWindow;
    } else {
      win = window;
    }
  }
  let from;
  let to;
  if (isOutEvent) {
    const related = nativeEvent.relatedTarget || nativeEvent.toElement;
    from = targetInst;
    to = related ? getClosestInstanceFromNode(related) : null;
    if (to !== null) {
      const nearestMounted = getNearestMountedFiber(to);
      if (to !== nearestMounted || to.tag !== HostComponent && to.tag !== HostText) {
        to = null;
      }
    }
  } else {
    from = null;
    to = targetInst;
  }
  if (from === to) {
    return;
  }
  let SyntheticEventCtor = SyntheticMouseEvent;
  let leaveEventType = "onMouseLeave";
  let enterEventType = "onMouseEnter";
  let eventTypePrefix = "mouse";
  if (domEventName === "pointerout" || domEventName === "pointerover") {
    SyntheticEventCtor = SyntheticPointerEvent;
    leaveEventType = "onPointerLeave";
    enterEventType = "onPointerEnter";
    eventTypePrefix = "pointer";
  }
  const fromNode = from == null ? win : getNodeFromInstance(from);
  const toNode = to == null ? win : getNodeFromInstance(to);
  const leave = new SyntheticEventCtor(leaveEventType, eventTypePrefix + "leave", from, nativeEvent, nativeEventTarget);
  leave.target = fromNode;
  leave.relatedTarget = toNode;
  let enter = null;
  const nativeTargetInst = getClosestInstanceFromNode(nativeEventTarget);
  if (nativeTargetInst === targetInst) {
    const enterEvent = new SyntheticEventCtor(enterEventType, eventTypePrefix + "enter", to, nativeEvent, nativeEventTarget);
    enterEvent.target = toNode;
    enterEvent.relatedTarget = fromNode;
    enter = enterEvent;
  }
  accumulateEnterLeaveTwoPhaseListeners(dispatchQueue, leave, enter, from, to);
}
__name(extractEvents$2, "extractEvents$2");
function is(x, y) {
  return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
}
__name(is, "is");
var objectIs = typeof Object.is === "function" ? Object.is : is;
function shallowEqual(objA, objB) {
  if (objectIs(objA, objB)) {
    return true;
  }
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (let i = 0; i < keysA.length; i++) {
    const currentKey = keysA[i];
    if (!hasOwnProperty.call(objB, currentKey) || !objectIs(objA[currentKey], objB[currentKey])) {
      return false;
    }
  }
  return true;
}
__name(shallowEqual, "shallowEqual");
function getLeafNode(node) {
  while (node && node.firstChild) {
    node = node.firstChild;
  }
  return node;
}
__name(getLeafNode, "getLeafNode");
function getSiblingNode(node) {
  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }
    node = node.parentNode;
  }
}
__name(getSiblingNode, "getSiblingNode");
function getNodeForCharacterOffset(root2, offset) {
  let node = getLeafNode(root2);
  let nodeStart = 0;
  let nodeEnd = 0;
  while (node) {
    if (node.nodeType === TEXT_NODE) {
      nodeEnd = nodeStart + node.textContent.length;
      if (nodeStart <= offset && nodeEnd >= offset) {
        return {
          node,
          offset: offset - nodeStart
        };
      }
      nodeStart = nodeEnd;
    }
    node = getLeafNode(getSiblingNode(node));
  }
}
__name(getNodeForCharacterOffset, "getNodeForCharacterOffset");
function getOffsets(outerNode) {
  const ownerDocument = outerNode.ownerDocument;
  const win = ownerDocument && ownerDocument.defaultView || window;
  const selection = win.getSelection && win.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  const anchorNode = selection.anchorNode, anchorOffset = selection.anchorOffset, focusNode = selection.focusNode, focusOffset = selection.focusOffset;
  try {
    anchorNode.nodeType;
    focusNode.nodeType;
  } catch (e) {
    return null;
  }
  return getModernOffsetsFromPoints(outerNode, anchorNode, anchorOffset, focusNode, focusOffset);
}
__name(getOffsets, "getOffsets");
function getModernOffsetsFromPoints(outerNode, anchorNode, anchorOffset, focusNode, focusOffset) {
  let length = 0;
  let start = -1;
  let end = -1;
  let indexWithinAnchor = 0;
  let indexWithinFocus = 0;
  let node = outerNode;
  let parentNode = null;
  outer:
    while (true) {
      let next = null;
      while (true) {
        if (node === anchorNode && (anchorOffset === 0 || node.nodeType === TEXT_NODE)) {
          start = length + anchorOffset;
        }
        if (node === focusNode && (focusOffset === 0 || node.nodeType === TEXT_NODE)) {
          end = length + focusOffset;
        }
        if (node.nodeType === TEXT_NODE) {
          length += node.nodeValue.length;
        }
        if ((next = node.firstChild) === null) {
          break;
        }
        parentNode = node;
        node = next;
      }
      while (true) {
        if (node === outerNode) {
          break outer;
        }
        if (parentNode === anchorNode && ++indexWithinAnchor === anchorOffset) {
          start = length;
        }
        if (parentNode === focusNode && ++indexWithinFocus === focusOffset) {
          end = length;
        }
        if ((next = node.nextSibling) !== null) {
          break;
        }
        node = parentNode;
        parentNode = node.parentNode;
      }
      node = next;
    }
  if (start === -1 || end === -1) {
    return null;
  }
  return {
    start,
    end
  };
}
__name(getModernOffsetsFromPoints, "getModernOffsetsFromPoints");
function setOffsets(node, offsets) {
  const doc = node.ownerDocument || document;
  const win = doc && doc.defaultView || window;
  if (!win.getSelection) {
    return;
  }
  const selection = win.getSelection();
  const length = node.textContent.length;
  let start = Math.min(offsets.start, length);
  let end = offsets.end === void 0 ? start : Math.min(offsets.end, length);
  if (!selection.extend && start > end) {
    const temp = end;
    end = start;
    start = temp;
  }
  const startMarker = getNodeForCharacterOffset(node, start);
  const endMarker = getNodeForCharacterOffset(node, end);
  if (startMarker && endMarker) {
    if (selection.rangeCount === 1 && selection.anchorNode === startMarker.node && selection.anchorOffset === startMarker.offset && selection.focusNode === endMarker.node && selection.focusOffset === endMarker.offset) {
      return;
    }
    const range = doc.createRange();
    range.setStart(startMarker.node, startMarker.offset);
    selection.removeAllRanges();
    if (start > end) {
      selection.addRange(range);
      selection.extend(endMarker.node, endMarker.offset);
    } else {
      range.setEnd(endMarker.node, endMarker.offset);
      selection.addRange(range);
    }
  }
}
__name(setOffsets, "setOffsets");
function isTextNode(node) {
  return node && node.nodeType === TEXT_NODE;
}
__name(isTextNode, "isTextNode");
function containsNode(outerNode, innerNode) {
  if (!outerNode || !innerNode) {
    return false;
  } else if (outerNode === innerNode) {
    return true;
  } else if (isTextNode(outerNode)) {
    return false;
  } else if (isTextNode(innerNode)) {
    return containsNode(outerNode, innerNode.parentNode);
  } else if ("contains" in outerNode) {
    return outerNode.contains(innerNode);
  } else if (outerNode.compareDocumentPosition) {
    return !!(outerNode.compareDocumentPosition(innerNode) & 16);
  } else {
    return false;
  }
}
__name(containsNode, "containsNode");
function isInDocument(node) {
  return node && node.ownerDocument && containsNode(node.ownerDocument.documentElement, node);
}
__name(isInDocument, "isInDocument");
function isSameOriginFrame(iframe) {
  try {
    return typeof iframe.contentWindow.location.href === "string";
  } catch (err) {
    return false;
  }
}
__name(isSameOriginFrame, "isSameOriginFrame");
function getActiveElementDeep() {
  let win = window;
  let element = getActiveElement();
  while (element instanceof win.HTMLIFrameElement) {
    if (isSameOriginFrame(element)) {
      win = element.contentWindow;
    } else {
      return element;
    }
    element = getActiveElement(win.document);
  }
  return element;
}
__name(getActiveElementDeep, "getActiveElementDeep");
function hasSelectionCapabilities(elem) {
  const nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
  return nodeName && (nodeName === "input" && (elem.type === "text" || elem.type === "search" || elem.type === "tel" || elem.type === "url" || elem.type === "password") || nodeName === "textarea" || elem.contentEditable === "true");
}
__name(hasSelectionCapabilities, "hasSelectionCapabilities");
function getSelectionInformation() {
  const focusedElem = getActiveElementDeep();
  return {
    focusedElem,
    selectionRange: hasSelectionCapabilities(focusedElem) ? getSelection(focusedElem) : null
  };
}
__name(getSelectionInformation, "getSelectionInformation");
function restoreSelection(priorSelectionInformation) {
  const curFocusedElem = getActiveElementDeep();
  const priorFocusedElem = priorSelectionInformation.focusedElem;
  const priorSelectionRange = priorSelectionInformation.selectionRange;
  if (curFocusedElem !== priorFocusedElem && isInDocument(priorFocusedElem)) {
    if (priorSelectionRange !== null && hasSelectionCapabilities(priorFocusedElem)) {
      setSelection(priorFocusedElem, priorSelectionRange);
    }
    const ancestors = [];
    let ancestor = priorFocusedElem;
    while (ancestor = ancestor.parentNode) {
      if (ancestor.nodeType === ELEMENT_NODE) {
        ancestors.push({
          element: ancestor,
          left: ancestor.scrollLeft,
          top: ancestor.scrollTop
        });
      }
    }
    if (typeof priorFocusedElem.focus === "function") {
      priorFocusedElem.focus();
    }
    for (let i = 0; i < ancestors.length; i++) {
      const info = ancestors[i];
      info.element.scrollLeft = info.left;
      info.element.scrollTop = info.top;
    }
  }
}
__name(restoreSelection, "restoreSelection");
function getSelection(input) {
  let selection;
  if ("selectionStart" in input) {
    selection = {
      start: input.selectionStart,
      end: input.selectionEnd
    };
  } else {
    selection = getOffsets(input);
  }
  return selection || {
    start: 0,
    end: 0
  };
}
__name(getSelection, "getSelection");
function setSelection(input, offsets) {
  const start = offsets.start;
  let end = offsets.end;
  if (end === void 0) {
    end = start;
  }
  if ("selectionStart" in input) {
    input.selectionStart = start;
    input.selectionEnd = Math.min(end, input.value.length);
  } else {
    setOffsets(input, offsets);
  }
}
__name(setSelection, "setSelection");
var skipSelectionChangeEvent = canUseDOM && "documentMode" in document && document.documentMode <= 11;
function registerEvents$3() {
  registerTwoPhaseEvent("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
}
__name(registerEvents$3, "registerEvents$3");
var activeElement$1 = null;
var activeElementInst$1 = null;
var lastSelection = null;
var mouseDown = false;
function getSelection$1(node) {
  if ("selectionStart" in node && hasSelectionCapabilities(node)) {
    return {
      start: node.selectionStart,
      end: node.selectionEnd
    };
  } else {
    const win = node.ownerDocument && node.ownerDocument.defaultView || window;
    const selection = win.getSelection();
    return {
      anchorNode: selection.anchorNode,
      anchorOffset: selection.anchorOffset,
      focusNode: selection.focusNode,
      focusOffset: selection.focusOffset
    };
  }
}
__name(getSelection$1, "getSelection$1");
function getEventTargetDocument(eventTarget) {
  return eventTarget.window === eventTarget ? eventTarget.document : eventTarget.nodeType === DOCUMENT_NODE ? eventTarget : eventTarget.ownerDocument;
}
__name(getEventTargetDocument, "getEventTargetDocument");
function constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget) {
  const doc = getEventTargetDocument(nativeEventTarget);
  if (mouseDown || activeElement$1 == null || activeElement$1 !== getActiveElement(doc)) {
    return;
  }
  const currentSelection = getSelection$1(activeElement$1);
  if (!lastSelection || !shallowEqual(lastSelection, currentSelection)) {
    lastSelection = currentSelection;
    const listeners = accumulateTwoPhaseListeners(activeElementInst$1, "onSelect");
    if (listeners.length > 0) {
      const event = new SyntheticEvent("onSelect", "select", null, nativeEvent, nativeEventTarget);
      dispatchQueue.push({
        event,
        listeners
      });
      event.target = activeElement$1;
    }
  }
}
__name(constructSelectEvent, "constructSelectEvent");
function extractEvents$3(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
  const targetNode = targetInst ? getNodeFromInstance(targetInst) : window;
  switch (domEventName) {
    case "focusin":
      if (isTextInputElement(targetNode) || targetNode.contentEditable === "true") {
        activeElement$1 = targetNode;
        activeElementInst$1 = targetInst;
        lastSelection = null;
      }
      break;
    case "focusout":
      activeElement$1 = null;
      activeElementInst$1 = null;
      lastSelection = null;
      break;
    case "mousedown":
      mouseDown = true;
      break;
    case "contextmenu":
    case "mouseup":
    case "dragend":
      mouseDown = false;
      constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
      break;
    case "selectionchange":
      if (skipSelectionChangeEvent) {
        break;
      }
    case "keydown":
    case "keyup":
      constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
  }
}
__name(extractEvents$3, "extractEvents$3");
function makePrefixMap(styleProp, eventName) {
  const prefixes2 = {};
  prefixes2[styleProp.toLowerCase()] = eventName.toLowerCase();
  prefixes2["Webkit" + styleProp] = "webkit" + eventName;
  prefixes2["Moz" + styleProp] = "moz" + eventName;
  return prefixes2;
}
__name(makePrefixMap, "makePrefixMap");
var vendorPrefixes = {
  animationend: makePrefixMap("Animation", "AnimationEnd"),
  animationiteration: makePrefixMap("Animation", "AnimationIteration"),
  animationstart: makePrefixMap("Animation", "AnimationStart"),
  transitionend: makePrefixMap("Transition", "TransitionEnd")
};
var prefixedEventNames = {};
var style = {};
if (canUseDOM) {
  style = document.createElement("div").style;
  if (!("AnimationEvent" in window)) {
    delete vendorPrefixes.animationend.animation;
    delete vendorPrefixes.animationiteration.animation;
    delete vendorPrefixes.animationstart.animation;
  }
  if (!("TransitionEvent" in window)) {
    delete vendorPrefixes.transitionend.transition;
  }
}
function getVendorPrefixedEventName(eventName) {
  if (prefixedEventNames[eventName]) {
    return prefixedEventNames[eventName];
  } else if (!vendorPrefixes[eventName]) {
    return eventName;
  }
  const prefixMap = vendorPrefixes[eventName];
  for (const styleProp in prefixMap) {
    if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) {
      return prefixedEventNames[eventName] = prefixMap[styleProp];
    }
  }
  return eventName;
}
__name(getVendorPrefixedEventName, "getVendorPrefixedEventName");
var ANIMATION_END = getVendorPrefixedEventName("animationend");
var ANIMATION_ITERATION = getVendorPrefixedEventName("animationiteration");
var ANIMATION_START = getVendorPrefixedEventName("animationstart");
var TRANSITION_END = getVendorPrefixedEventName("transitionend");
var topLevelEventsToReactNames = /* @__PURE__ */ new Map();
var simpleEventPluginEvents = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
function registerSimpleEvent(domEventName, reactName) {
  topLevelEventsToReactNames.set(domEventName, reactName);
  registerTwoPhaseEvent(reactName, [domEventName]);
}
__name(registerSimpleEvent, "registerSimpleEvent");
function registerSimpleEvents() {
  for (let i = 0; i < simpleEventPluginEvents.length; i++) {
    const eventName = simpleEventPluginEvents[i];
    const domEventName = eventName.toLowerCase();
    const capitalizedEvent = eventName[0].toUpperCase() + eventName.slice(1);
    registerSimpleEvent(domEventName, "on" + capitalizedEvent);
  }
  registerSimpleEvent(ANIMATION_END, "onAnimationEnd");
  registerSimpleEvent(ANIMATION_ITERATION, "onAnimationIteration");
  registerSimpleEvent(ANIMATION_START, "onAnimationStart");
  registerSimpleEvent("dblclick", "onDoubleClick");
  registerSimpleEvent("focusin", "onFocus");
  registerSimpleEvent("focusout", "onBlur");
  registerSimpleEvent(TRANSITION_END, "onTransitionEnd");
}
__name(registerSimpleEvents, "registerSimpleEvents");
function extractEvents$4(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
  const reactName = topLevelEventsToReactNames.get(domEventName);
  if (reactName === void 0) {
    return;
  }
  let SyntheticEventCtor = SyntheticEvent;
  let reactEventType = domEventName;
  switch (domEventName) {
    case "keypress":
      if (getEventCharCode(nativeEvent) === 0) {
        return;
      }
    case "keydown":
    case "keyup":
      SyntheticEventCtor = SyntheticKeyboardEvent;
      break;
    case "focusin":
      reactEventType = "focus";
      SyntheticEventCtor = SyntheticFocusEvent;
      break;
    case "focusout":
      reactEventType = "blur";
      SyntheticEventCtor = SyntheticFocusEvent;
      break;
    case "beforeblur":
    case "afterblur":
      SyntheticEventCtor = SyntheticFocusEvent;
      break;
    case "click":
      if (nativeEvent.button === 2) {
        return;
      }
    case "auxclick":
    case "dblclick":
    case "mousedown":
    case "mousemove":
    case "mouseup":
    case "mouseout":
    case "mouseover":
    case "contextmenu":
      SyntheticEventCtor = SyntheticMouseEvent;
      break;
    case "drag":
    case "dragend":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "dragstart":
    case "drop":
      SyntheticEventCtor = SyntheticDragEvent;
      break;
    case "touchcancel":
    case "touchend":
    case "touchmove":
    case "touchstart":
      SyntheticEventCtor = SyntheticTouchEvent;
      break;
    case ANIMATION_END:
    case ANIMATION_ITERATION:
    case ANIMATION_START:
      SyntheticEventCtor = SyntheticAnimationEvent;
      break;
    case TRANSITION_END:
      SyntheticEventCtor = SyntheticTransitionEvent;
      break;
    case "scroll":
      SyntheticEventCtor = SyntheticUIEvent;
      break;
    case "wheel":
      SyntheticEventCtor = SyntheticWheelEvent;
      break;
    case "copy":
    case "cut":
    case "paste":
      SyntheticEventCtor = SyntheticClipboardEvent;
      break;
    case "gotpointercapture":
    case "lostpointercapture":
    case "pointercancel":
    case "pointerdown":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "pointerup":
      SyntheticEventCtor = SyntheticPointerEvent;
      break;
  }
  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  {
    const accumulateTargetOnly = !inCapturePhase && // TODO: ideally, we'd eventually add all events from
    // nonDelegatedEvents list in DOMPluginEventSystem.
    // Then we can remove this special list.
    // This is a breaking change that can wait until React 18.
    domEventName === "scroll";
    const listeners = accumulateSinglePhaseListeners(targetInst, reactName, nativeEvent.type, inCapturePhase, accumulateTargetOnly);
    if (listeners.length > 0) {
      const event = new SyntheticEventCtor(reactName, reactEventType, null, nativeEvent, nativeEventTarget);
      dispatchQueue.push({
        event,
        listeners
      });
    }
  }
}
__name(extractEvents$4, "extractEvents$4");
registerSimpleEvents();
registerEvents$2();
registerEvents$1();
registerEvents$3();
registerEvents();
function extractEvents$5(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
  extractEvents$4(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags);
  const shouldProcessPolyfillPlugins = (eventSystemFlags & SHOULD_NOT_PROCESS_POLYFILL_EVENT_PLUGINS) === 0;
  if (shouldProcessPolyfillPlugins) {
    extractEvents$2(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
    extractEvents$1(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
    extractEvents$3(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
    extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
  }
}
__name(extractEvents$5, "extractEvents$5");
var mediaEventTypes = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"];
var nonDelegatedEvents = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(mediaEventTypes));
function executeDispatch(event, listener, currentTarget) {
  const type = event.type || "unknown-event";
  event.currentTarget = currentTarget;
  invokeGuardedCallbackAndCatchFirstError(type, listener, void 0, event);
  event.currentTarget = null;
}
__name(executeDispatch, "executeDispatch");
function processDispatchQueueItemsInOrder(event, dispatchListeners, inCapturePhase) {
  let previousInstance;
  if (inCapturePhase) {
    for (let i = dispatchListeners.length - 1; i >= 0; i--) {
      const _dispatchListeners$i = dispatchListeners[i], instance = _dispatchListeners$i.instance, currentTarget = _dispatchListeners$i.currentTarget, listener = _dispatchListeners$i.listener;
      if (instance !== previousInstance && event.isPropagationStopped()) {
        return;
      }
      executeDispatch(event, listener, currentTarget);
      previousInstance = instance;
    }
  } else {
    for (let i = 0; i < dispatchListeners.length; i++) {
      const _dispatchListeners$i2 = dispatchListeners[i], instance = _dispatchListeners$i2.instance, currentTarget = _dispatchListeners$i2.currentTarget, listener = _dispatchListeners$i2.listener;
      if (instance !== previousInstance && event.isPropagationStopped()) {
        return;
      }
      executeDispatch(event, listener, currentTarget);
      previousInstance = instance;
    }
  }
}
__name(processDispatchQueueItemsInOrder, "processDispatchQueueItemsInOrder");
function processDispatchQueue(dispatchQueue, eventSystemFlags) {
  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  for (let i = 0; i < dispatchQueue.length; i++) {
    const _dispatchQueue$i = dispatchQueue[i], event = _dispatchQueue$i.event, listeners = _dispatchQueue$i.listeners;
    processDispatchQueueItemsInOrder(event, listeners, inCapturePhase);
  }
  rethrowCaughtError();
}
__name(processDispatchQueue, "processDispatchQueue");
function dispatchEventsForPlugins(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer) {
  const nativeEventTarget = getEventTarget(nativeEvent);
  const dispatchQueue = [];
  extractEvents$5(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags);
  processDispatchQueue(dispatchQueue, eventSystemFlags);
}
__name(dispatchEventsForPlugins, "dispatchEventsForPlugins");
function listenToNonDelegatedEvent(domEventName, targetElement) {
  const isCapturePhaseListener = false;
  const listenerSet = getEventListenerSet(targetElement);
  const listenerSetKey = getListenerSetKey(domEventName, isCapturePhaseListener);
  if (!listenerSet.has(listenerSetKey)) {
    addTrappedEventListener(targetElement, domEventName, IS_NON_DELEGATED, isCapturePhaseListener);
    listenerSet.add(listenerSetKey);
  }
}
__name(listenToNonDelegatedEvent, "listenToNonDelegatedEvent");
function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
  let eventSystemFlags = 0;
  if (isCapturePhaseListener) {
    eventSystemFlags |= IS_CAPTURE_PHASE;
  }
  addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListener);
}
__name(listenToNativeEvent, "listenToNativeEvent");
var listeningMarker = "_reactListening" + Math.random().toString(36).slice(2);
function listenToAllSupportedEvents(rootContainerElement) {
  if (!rootContainerElement[listeningMarker]) {
    rootContainerElement[listeningMarker] = true;
    allNativeEvents.forEach((domEventName) => {
      if (domEventName !== "selectionchange") {
        if (!nonDelegatedEvents.has(domEventName)) {
          listenToNativeEvent(domEventName, false, rootContainerElement);
        }
        listenToNativeEvent(domEventName, true, rootContainerElement);
      }
    });
    const ownerDocument = rootContainerElement.nodeType === DOCUMENT_NODE ? rootContainerElement : rootContainerElement.ownerDocument;
    if (ownerDocument !== null) {
      if (!ownerDocument[listeningMarker]) {
        ownerDocument[listeningMarker] = true;
        listenToNativeEvent("selectionchange", false, ownerDocument);
      }
    }
  }
}
__name(listenToAllSupportedEvents, "listenToAllSupportedEvents");
function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener, isDeferredListenerForLegacyFBSupport) {
  let listener = createEventListenerWrapperWithPriority(targetContainer, domEventName, eventSystemFlags);
  let isPassiveListener = void 0;
  if (passiveBrowserEventsSupported) {
    if (domEventName === "touchstart" || domEventName === "touchmove" || domEventName === "wheel") {
      isPassiveListener = true;
    }
  }
  targetContainer = targetContainer;
  let unsubscribeListener;
  if (isCapturePhaseListener) {
    if (isPassiveListener !== void 0) {
      unsubscribeListener = addEventCaptureListenerWithPassiveFlag(targetContainer, domEventName, listener, isPassiveListener);
    } else {
      unsubscribeListener = addEventCaptureListener(targetContainer, domEventName, listener);
    }
  } else {
    if (isPassiveListener !== void 0) {
      unsubscribeListener = addEventBubbleListenerWithPassiveFlag(targetContainer, domEventName, listener, isPassiveListener);
    } else {
      unsubscribeListener = addEventBubbleListener(targetContainer, domEventName, listener);
    }
  }
}
__name(addTrappedEventListener, "addTrappedEventListener");
function isMatchingRootContainer(grandContainer, targetContainer) {
  return grandContainer === targetContainer || grandContainer.nodeType === COMMENT_NODE && grandContainer.parentNode === targetContainer;
}
__name(isMatchingRootContainer, "isMatchingRootContainer");
function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer) {
  let ancestorInst = targetInst;
  if ((eventSystemFlags & IS_EVENT_HANDLE_NON_MANAGED_NODE) === 0 && (eventSystemFlags & IS_NON_DELEGATED) === 0) {
    const targetContainerNode = targetContainer;
    if (targetInst !== null) {
      let node = targetInst;
      mainLoop:
        while (true) {
          if (node === null) {
            return;
          }
          const nodeTag = node.tag;
          if (nodeTag === HostRoot || nodeTag === HostPortal) {
            let container = node.stateNode.containerInfo;
            if (isMatchingRootContainer(container, targetContainerNode)) {
              break;
            }
            if (nodeTag === HostPortal) {
              let grandNode = node.return;
              while (grandNode !== null) {
                const grandTag = grandNode.tag;
                if (grandTag === HostRoot || grandTag === HostPortal) {
                  const grandContainer = grandNode.stateNode.containerInfo;
                  if (isMatchingRootContainer(grandContainer, targetContainerNode)) {
                    return;
                  }
                }
                grandNode = grandNode.return;
              }
            }
            while (container !== null) {
              const parentNode = getClosestInstanceFromNode(container);
              if (parentNode === null) {
                return;
              }
              const parentTag = parentNode.tag;
              if (parentTag === HostComponent || parentTag === HostText) {
                node = ancestorInst = parentNode;
                continue mainLoop;
              }
              container = container.parentNode;
            }
          }
          node = node.return;
        }
    }
  }
  batchedUpdates(() => dispatchEventsForPlugins(domEventName, eventSystemFlags, nativeEvent, ancestorInst));
}
__name(dispatchEventForPluginEventSystem, "dispatchEventForPluginEventSystem");
function createDispatchListener(instance, listener, currentTarget) {
  return {
    instance,
    listener,
    currentTarget
  };
}
__name(createDispatchListener, "createDispatchListener");
function accumulateSinglePhaseListeners(targetFiber, reactName, nativeEventType, inCapturePhase, accumulateTargetOnly, nativeEvent) {
  const captureName = reactName !== null ? reactName + "Capture" : null;
  const reactEventName = inCapturePhase ? captureName : reactName;
  let listeners = [];
  let instance = targetFiber;
  let lastHostComponent = null;
  while (instance !== null) {
    const _instance = instance, stateNode = _instance.stateNode, tag = _instance.tag;
    if (tag === HostComponent && stateNode !== null) {
      lastHostComponent = stateNode;
      if (reactEventName !== null) {
        const listener = getListener(instance, reactEventName);
        if (listener != null) {
          listeners.push(createDispatchListener(instance, listener, lastHostComponent));
        }
      }
    }
    if (accumulateTargetOnly) {
      break;
    }
    instance = instance.return;
  }
  return listeners;
}
__name(accumulateSinglePhaseListeners, "accumulateSinglePhaseListeners");
function accumulateTwoPhaseListeners(targetFiber, reactName) {
  const captureName = reactName + "Capture";
  const listeners = [];
  let instance = targetFiber;
  while (instance !== null) {
    const _instance2 = instance, stateNode = _instance2.stateNode, tag = _instance2.tag;
    if (tag === HostComponent && stateNode !== null) {
      const currentTarget = stateNode;
      const captureListener = getListener(instance, captureName);
      if (captureListener != null) {
        listeners.unshift(createDispatchListener(instance, captureListener, currentTarget));
      }
      const bubbleListener = getListener(instance, reactName);
      if (bubbleListener != null) {
        listeners.push(createDispatchListener(instance, bubbleListener, currentTarget));
      }
    }
    instance = instance.return;
  }
  return listeners;
}
__name(accumulateTwoPhaseListeners, "accumulateTwoPhaseListeners");
function getParent(inst) {
  if (inst === null) {
    return null;
  }
  do {
    inst = inst.return;
  } while (inst && inst.tag !== HostComponent);
  if (inst) {
    return inst;
  }
  return null;
}
__name(getParent, "getParent");
function getLowestCommonAncestor(instA, instB) {
  let nodeA = instA;
  let nodeB = instB;
  let depthA = 0;
  for (let tempA = nodeA; tempA; tempA = getParent(tempA)) {
    depthA++;
  }
  let depthB = 0;
  for (let tempB = nodeB; tempB; tempB = getParent(tempB)) {
    depthB++;
  }
  while (depthA - depthB > 0) {
    nodeA = getParent(nodeA);
    depthA--;
  }
  while (depthB - depthA > 0) {
    nodeB = getParent(nodeB);
    depthB--;
  }
  let depth = depthA;
  while (depth--) {
    if (nodeA === nodeB || nodeB !== null && nodeA === nodeB.alternate) {
      return nodeA;
    }
    nodeA = getParent(nodeA);
    nodeB = getParent(nodeB);
  }
  return null;
}
__name(getLowestCommonAncestor, "getLowestCommonAncestor");
function accumulateEnterLeaveListenersForEvent(dispatchQueue, event, target, common, inCapturePhase) {
  const registrationName = event._reactName;
  const listeners = [];
  let instance = target;
  while (instance !== null) {
    if (instance === common) {
      break;
    }
    const _instance3 = instance, alternate = _instance3.alternate, stateNode = _instance3.stateNode, tag = _instance3.tag;
    if (alternate !== null && alternate === common) {
      break;
    }
    if (tag === HostComponent && stateNode !== null) {
      const currentTarget = stateNode;
      if (inCapturePhase) {
        const captureListener = getListener(instance, registrationName);
        if (captureListener != null) {
          listeners.unshift(createDispatchListener(instance, captureListener, currentTarget));
        }
      } else if (!inCapturePhase) {
        const bubbleListener = getListener(instance, registrationName);
        if (bubbleListener != null) {
          listeners.push(createDispatchListener(instance, bubbleListener, currentTarget));
        }
      }
    }
    instance = instance.return;
  }
  if (listeners.length !== 0) {
    dispatchQueue.push({
      event,
      listeners
    });
  }
}
__name(accumulateEnterLeaveListenersForEvent, "accumulateEnterLeaveListenersForEvent");
function accumulateEnterLeaveTwoPhaseListeners(dispatchQueue, leaveEvent, enterEvent, from, to) {
  const common = from && to ? getLowestCommonAncestor(from, to) : null;
  if (from !== null) {
    accumulateEnterLeaveListenersForEvent(dispatchQueue, leaveEvent, from, common, false);
  }
  if (to !== null && enterEvent !== null) {
    accumulateEnterLeaveListenersForEvent(dispatchQueue, enterEvent, to, common, true);
  }
}
__name(accumulateEnterLeaveTwoPhaseListeners, "accumulateEnterLeaveTwoPhaseListeners");
function getListenerSetKey(domEventName, capture) {
  return domEventName + "__" + (capture ? "capture" : "bubble");
}
__name(getListenerSetKey, "getListenerSetKey");
var DANGEROUSLY_SET_INNER_HTML = "dangerouslySetInnerHTML";
var SUPPRESS_CONTENT_EDITABLE_WARNING = "suppressContentEditableWarning";
var SUPPRESS_HYDRATION_WARNING = "suppressHydrationWarning";
var AUTOFOCUS = "autoFocus";
var CHILDREN = "children";
var STYLE = "style";
var HTML$1 = "__html";
var NORMALIZE_NEWLINES_REGEX = /\r\n?/g;
var NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;
function normalizeMarkupForTextOrAttribute(markup) {
  const markupString = typeof markup === "string" ? markup : "" + markup;
  return markupString.replace(NORMALIZE_NEWLINES_REGEX, "\n").replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, "");
}
__name(normalizeMarkupForTextOrAttribute, "normalizeMarkupForTextOrAttribute");
function checkForUnmatchedText(serverText, clientText, isConcurrentMode, shouldWarnDev) {
  const normalizedClientText = normalizeMarkupForTextOrAttribute(clientText);
  const normalizedServerText = normalizeMarkupForTextOrAttribute(serverText);
  if (normalizedServerText === normalizedClientText) {
    return;
  }
  if (isConcurrentMode && enableClientRenderFallbackOnTextMismatch) {
    throw Error(formatProdErrorMessage(425));
  }
}
__name(checkForUnmatchedText, "checkForUnmatchedText");
function getOwnerDocumentFromRootContainer(rootContainerElement) {
  return rootContainerElement.nodeType === DOCUMENT_NODE ? rootContainerElement : rootContainerElement.ownerDocument;
}
__name(getOwnerDocumentFromRootContainer, "getOwnerDocumentFromRootContainer");
function noop() {
}
__name(noop, "noop");
function trapClickOnNonInteractiveElement(node) {
  node.onclick = noop;
}
__name(trapClickOnNonInteractiveElement, "trapClickOnNonInteractiveElement");
function setInitialDOMProperties(tag, domElement, rootContainerElement, nextProps, isCustomComponentTag) {
  for (const propKey in nextProps) {
    if (!nextProps.hasOwnProperty(propKey)) {
      continue;
    }
    const nextProp = nextProps[propKey];
    if (propKey === STYLE) {
      setValueForStyles(domElement, nextProp);
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      const nextHtml = nextProp ? nextProp[HTML$1] : void 0;
      if (nextHtml != null) {
        setInnerHTML(domElement, nextHtml);
      }
    } else if (propKey === CHILDREN) {
      if (typeof nextProp === "string") {
        const canSetTextContent = tag !== "textarea" || nextProp !== "";
        if (canSetTextContent) {
          setTextContent(domElement, nextProp);
        }
      } else if (typeof nextProp === "number") {
        setTextContent(domElement, "" + nextProp);
      }
    } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING)
      ;
    else if (propKey === AUTOFOCUS)
      ;
    else if (registrationNameDependencies.hasOwnProperty(propKey)) {
      if (nextProp != null) {
        if (propKey === "onScroll") {
          listenToNonDelegatedEvent("scroll", domElement);
        }
      }
    } else if (nextProp != null) {
      setValueForProperty(domElement, propKey, nextProp, isCustomComponentTag);
    }
  }
}
__name(setInitialDOMProperties, "setInitialDOMProperties");
function updateDOMProperties(domElement, updatePayload, wasCustomComponentTag, isCustomComponentTag) {
  for (let i = 0; i < updatePayload.length; i += 2) {
    const propKey = updatePayload[i];
    const propValue = updatePayload[i + 1];
    if (propKey === STYLE) {
      setValueForStyles(domElement, propValue);
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      setInnerHTML(domElement, propValue);
    } else if (propKey === CHILDREN) {
      setTextContent(domElement, propValue);
    } else {
      setValueForProperty(domElement, propKey, propValue, isCustomComponentTag);
    }
  }
}
__name(updateDOMProperties, "updateDOMProperties");
function createElement(type, props, rootContainerElement, parentNamespace) {
  const ownerDocument = getOwnerDocumentFromRootContainer(rootContainerElement);
  let domElement;
  let namespaceURI = parentNamespace;
  if (namespaceURI === HTML_NAMESPACE) {
    namespaceURI = getIntrinsicNamespace(type);
  }
  if (namespaceURI === HTML_NAMESPACE) {
    if (type === "script") {
      const div = ownerDocument.createElement("div");
      div.innerHTML = "<script><\/script>";
      const firstChild = div.firstChild;
      domElement = div.removeChild(firstChild);
    } else if (typeof props.is === "string") {
      domElement = ownerDocument.createElement(type, {
        is: props.is
      });
    } else {
      domElement = ownerDocument.createElement(type);
      if (type === "select") {
        const node = domElement;
        if (props.multiple) {
          node.multiple = true;
        } else if (props.size) {
          node.size = props.size;
        }
      }
    }
  } else {
    domElement = ownerDocument.createElementNS(namespaceURI, type);
  }
  return domElement;
}
__name(createElement, "createElement");
function createTextNode(text, rootContainerElement) {
  return getOwnerDocumentFromRootContainer(rootContainerElement).createTextNode(text);
}
__name(createTextNode, "createTextNode");
function setInitialProperties(domElement, tag, rawProps, rootContainerElement) {
  const isCustomComponentTag = isCustomComponent(tag, rawProps);
  let props;
  switch (tag) {
    case "dialog":
      listenToNonDelegatedEvent("cancel", domElement);
      listenToNonDelegatedEvent("close", domElement);
      props = rawProps;
      break;
    case "iframe":
    case "object":
    case "embed":
      listenToNonDelegatedEvent("load", domElement);
      props = rawProps;
      break;
    case "video":
    case "audio":
      for (let i = 0; i < mediaEventTypes.length; i++) {
        listenToNonDelegatedEvent(mediaEventTypes[i], domElement);
      }
      props = rawProps;
      break;
    case "source":
      listenToNonDelegatedEvent("error", domElement);
      props = rawProps;
      break;
    case "img":
    case "image":
    case "link":
      listenToNonDelegatedEvent("error", domElement);
      listenToNonDelegatedEvent("load", domElement);
      props = rawProps;
      break;
    case "details":
      listenToNonDelegatedEvent("toggle", domElement);
      props = rawProps;
      break;
    case "input":
      initWrapperState(domElement, rawProps);
      props = getHostProps(domElement, rawProps);
      listenToNonDelegatedEvent("invalid", domElement);
      break;
    case "option":
      props = rawProps;
      break;
    case "select":
      initWrapperState$1(domElement, rawProps);
      props = getHostProps$1(domElement, rawProps);
      listenToNonDelegatedEvent("invalid", domElement);
      break;
    case "textarea":
      initWrapperState$2(domElement, rawProps);
      props = getHostProps$2(domElement, rawProps);
      listenToNonDelegatedEvent("invalid", domElement);
      break;
    default:
      props = rawProps;
  }
  assertValidProps(tag, props);
  setInitialDOMProperties(tag, domElement, rootContainerElement, props, isCustomComponentTag);
  switch (tag) {
    case "input":
      track(domElement);
      postMountWrapper(domElement, rawProps, false);
      break;
    case "textarea":
      track(domElement);
      postMountWrapper$3(domElement);
      break;
    case "option":
      postMountWrapper$1(domElement, rawProps);
      break;
    case "select":
      postMountWrapper$2(domElement, rawProps);
      break;
    default:
      if (typeof props.onClick === "function") {
        trapClickOnNonInteractiveElement(domElement);
      }
      break;
  }
}
__name(setInitialProperties, "setInitialProperties");
function diffProperties(domElement, tag, lastRawProps, nextRawProps, rootContainerElement) {
  let updatePayload = null;
  let lastProps;
  let nextProps;
  switch (tag) {
    case "input":
      lastProps = getHostProps(domElement, lastRawProps);
      nextProps = getHostProps(domElement, nextRawProps);
      updatePayload = [];
      break;
    case "select":
      lastProps = getHostProps$1(domElement, lastRawProps);
      nextProps = getHostProps$1(domElement, nextRawProps);
      updatePayload = [];
      break;
    case "textarea":
      lastProps = getHostProps$2(domElement, lastRawProps);
      nextProps = getHostProps$2(domElement, nextRawProps);
      updatePayload = [];
      break;
    default:
      lastProps = lastRawProps;
      nextProps = nextRawProps;
      if (typeof lastProps.onClick !== "function" && typeof nextProps.onClick === "function") {
        trapClickOnNonInteractiveElement(domElement);
      }
      break;
  }
  assertValidProps(tag, nextProps);
  let propKey;
  let styleName;
  let styleUpdates = null;
  for (propKey in lastProps) {
    if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
      continue;
    }
    if (propKey === STYLE) {
      const lastStyle = lastProps[propKey];
      for (styleName in lastStyle) {
        if (lastStyle.hasOwnProperty(styleName)) {
          if (!styleUpdates) {
            styleUpdates = {};
          }
          styleUpdates[styleName] = "";
        }
      }
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML || propKey === CHILDREN)
      ;
    else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING)
      ;
    else if (propKey === AUTOFOCUS)
      ;
    else if (registrationNameDependencies.hasOwnProperty(propKey)) {
      if (!updatePayload) {
        updatePayload = [];
      }
    } else {
      (updatePayload = updatePayload || []).push(propKey, null);
    }
  }
  for (propKey in nextProps) {
    const nextProp = nextProps[propKey];
    const lastProp = lastProps != null ? lastProps[propKey] : void 0;
    if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || nextProp == null && lastProp == null) {
      continue;
    }
    if (propKey === STYLE) {
      if (lastProp) {
        for (styleName in lastProp) {
          if (lastProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
            if (!styleUpdates) {
              styleUpdates = {};
            }
            styleUpdates[styleName] = "";
          }
        }
        for (styleName in nextProp) {
          if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName]) {
            if (!styleUpdates) {
              styleUpdates = {};
            }
            styleUpdates[styleName] = nextProp[styleName];
          }
        }
      } else {
        if (!styleUpdates) {
          if (!updatePayload) {
            updatePayload = [];
          }
          updatePayload.push(propKey, styleUpdates);
        }
        styleUpdates = nextProp;
      }
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      const nextHtml = nextProp ? nextProp[HTML$1] : void 0;
      const lastHtml = lastProp ? lastProp[HTML$1] : void 0;
      if (nextHtml != null) {
        if (lastHtml !== nextHtml) {
          (updatePayload = updatePayload || []).push(propKey, nextHtml);
        }
      }
    } else if (propKey === CHILDREN) {
      if (typeof nextProp === "string" || typeof nextProp === "number") {
        (updatePayload = updatePayload || []).push(propKey, "" + nextProp);
      }
    } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING)
      ;
    else if (registrationNameDependencies.hasOwnProperty(propKey)) {
      if (nextProp != null) {
        if (propKey === "onScroll") {
          listenToNonDelegatedEvent("scroll", domElement);
        }
      }
      if (!updatePayload && lastProp !== nextProp) {
        updatePayload = [];
      }
    } else {
      (updatePayload = updatePayload || []).push(propKey, nextProp);
    }
  }
  if (styleUpdates) {
    (updatePayload = updatePayload || []).push(STYLE, styleUpdates);
  }
  return updatePayload;
}
__name(diffProperties, "diffProperties");
function updateProperties(domElement, updatePayload, tag, lastRawProps, nextRawProps) {
  if (tag === "input" && nextRawProps.type === "radio" && nextRawProps.name != null) {
    updateChecked(domElement, nextRawProps);
  }
  const wasCustomComponentTag = isCustomComponent(tag, lastRawProps);
  const isCustomComponentTag = isCustomComponent(tag, nextRawProps);
  updateDOMProperties(domElement, updatePayload, wasCustomComponentTag, isCustomComponentTag);
  switch (tag) {
    case "input":
      updateWrapper(domElement, nextRawProps);
      break;
    case "textarea":
      updateWrapper$1(domElement, nextRawProps);
      break;
    case "select":
      postUpdateWrapper(domElement, nextRawProps);
      break;
  }
}
__name(updateProperties, "updateProperties");
function diffHydratedProperties(domElement, tag, rawProps, parentNamespace, rootContainerElement, isConcurrentMode, shouldWarnDev) {
  let isCustomComponentTag;
  let extraAttributeNames;
  switch (tag) {
    case "dialog":
      listenToNonDelegatedEvent("cancel", domElement);
      listenToNonDelegatedEvent("close", domElement);
      break;
    case "iframe":
    case "object":
    case "embed":
      listenToNonDelegatedEvent("load", domElement);
      break;
    case "video":
    case "audio":
      for (let i = 0; i < mediaEventTypes.length; i++) {
        listenToNonDelegatedEvent(mediaEventTypes[i], domElement);
      }
      break;
    case "source":
      listenToNonDelegatedEvent("error", domElement);
      break;
    case "img":
    case "image":
    case "link":
      listenToNonDelegatedEvent("error", domElement);
      listenToNonDelegatedEvent("load", domElement);
      break;
    case "details":
      listenToNonDelegatedEvent("toggle", domElement);
      break;
    case "input":
      initWrapperState(domElement, rawProps);
      listenToNonDelegatedEvent("invalid", domElement);
      break;
    case "option":
      break;
    case "select":
      initWrapperState$1(domElement, rawProps);
      listenToNonDelegatedEvent("invalid", domElement);
      break;
    case "textarea":
      initWrapperState$2(domElement, rawProps);
      listenToNonDelegatedEvent("invalid", domElement);
      break;
  }
  assertValidProps(tag, rawProps);
  let updatePayload = null;
  for (const propKey in rawProps) {
    if (!rawProps.hasOwnProperty(propKey)) {
      continue;
    }
    const nextProp = rawProps[propKey];
    if (propKey === CHILDREN) {
      if (typeof nextProp === "string") {
        if (domElement.textContent !== nextProp) {
          if (rawProps[SUPPRESS_HYDRATION_WARNING] !== true) {
            checkForUnmatchedText(domElement.textContent, nextProp, isConcurrentMode);
          }
          updatePayload = [CHILDREN, nextProp];
        }
      } else if (typeof nextProp === "number") {
        if (domElement.textContent !== "" + nextProp) {
          if (rawProps[SUPPRESS_HYDRATION_WARNING] !== true) {
            checkForUnmatchedText(domElement.textContent, nextProp, isConcurrentMode);
          }
          updatePayload = [CHILDREN, "" + nextProp];
        }
      }
    } else if (registrationNameDependencies.hasOwnProperty(propKey)) {
      if (nextProp != null) {
        if (propKey === "onScroll") {
          listenToNonDelegatedEvent("scroll", domElement);
        }
      }
    } else if (shouldWarnDev && false) {
      let serverValue;
      const propertyInfo = getPropertyInfo(propKey);
      if (rawProps[SUPPRESS_HYDRATION_WARNING] === true)
        ;
      else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING || // Controlled attributes are not validated
      // TODO: Only ignore them on controlled tags.
      propKey === "value" || propKey === "checked" || propKey === "selected")
        ;
      else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
        const serverHTML = domElement.innerHTML;
        const nextHtml = nextProp ? nextProp[HTML$1] : void 0;
        if (nextHtml != null) {
          const expectedHTML = normalizeHTML();
          if (expectedHTML !== serverHTML) {
            warnForPropDifference();
          }
        }
      } else if (propKey === STYLE) {
        extraAttributeNames.delete(propKey);
      } else if (!shouldIgnoreAttribute(propKey, propertyInfo, isCustomComponentTag) && !shouldRemoveAttribute(propKey, nextProp, propertyInfo, isCustomComponentTag)) {
        let isMismatchDueToBadCasing = false;
        if (propertyInfo !== null) {
          extraAttributeNames.delete(propertyInfo.attributeName);
          serverValue = getValueForProperty();
        } else {
          let ownNamespace = parentNamespace;
          if (ownNamespace === HTML_NAMESPACE) {
            ownNamespace = getIntrinsicNamespace(tag);
          }
          if (ownNamespace === HTML_NAMESPACE) {
            extraAttributeNames.delete(propKey.toLowerCase());
          } else {
            const standardName = getPossibleStandardName();
            if (standardName !== null && standardName !== propKey) {
              isMismatchDueToBadCasing = true;
              extraAttributeNames.delete(standardName);
            }
            extraAttributeNames.delete(propKey);
          }
          serverValue = getValueForAttribute();
        }
        if (nextProp !== serverValue && !isMismatchDueToBadCasing) {
          warnForPropDifference();
        }
      }
    }
  }
  switch (tag) {
    case "input":
      track(domElement);
      postMountWrapper(domElement, rawProps, true);
      break;
    case "textarea":
      track(domElement);
      postMountWrapper$3(domElement);
      break;
    case "select":
    case "option":
      break;
    default:
      if (typeof rawProps.onClick === "function") {
        trapClickOnNonInteractiveElement(domElement);
      }
      break;
  }
  return updatePayload;
}
__name(diffHydratedProperties, "diffHydratedProperties");
function diffHydratedText(textNode, text, isConcurrentMode) {
  const isDifferent = textNode.nodeValue !== text;
  return isDifferent;
}
__name(diffHydratedText, "diffHydratedText");
function restoreControlledState$3(domElement, tag, props) {
  switch (tag) {
    case "input":
      restoreControlledState(domElement, props);
      return;
    case "textarea":
      restoreControlledState$2(domElement, props);
      return;
    case "select":
      restoreControlledState$1(domElement, props);
      return;
  }
}
__name(restoreControlledState$3, "restoreControlledState$3");
var SUPPRESS_HYDRATION_WARNING$1 = "suppressHydrationWarning";
var SUSPENSE_START_DATA = "$";
var SUSPENSE_END_DATA = "/$";
var SUSPENSE_PENDING_START_DATA = "$?";
var SUSPENSE_FALLBACK_START_DATA = "$!";
var STYLE$1 = "style";
var eventsEnabled = null;
var selectionInformation = null;
function getRootHostContext(rootContainerInstance) {
  let type;
  let namespace;
  const nodeType = rootContainerInstance.nodeType;
  switch (nodeType) {
    case DOCUMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE: {
      type = nodeType === DOCUMENT_NODE ? "#document" : "#fragment";
      const root2 = rootContainerInstance.documentElement;
      namespace = root2 ? root2.namespaceURI : getChildNamespace(null, "");
      break;
    }
    default: {
      const container = nodeType === COMMENT_NODE ? rootContainerInstance.parentNode : rootContainerInstance;
      const ownNamespace = container.namespaceURI || null;
      type = container.tagName;
      namespace = getChildNamespace(ownNamespace, type);
      break;
    }
  }
  return namespace;
}
__name(getRootHostContext, "getRootHostContext");
function getChildHostContext(parentHostContext, type, rootContainerInstance) {
  const parentNamespace = parentHostContext;
  return getChildNamespace(parentNamespace, type);
}
__name(getChildHostContext, "getChildHostContext");
function getPublicInstance(instance) {
  return instance;
}
__name(getPublicInstance, "getPublicInstance");
function prepareForCommit(containerInfo) {
  eventsEnabled = isEnabled();
  selectionInformation = getSelectionInformation();
  let activeInstance = null;
  setEnabled(false);
  return activeInstance;
}
__name(prepareForCommit, "prepareForCommit");
function resetAfterCommit(containerInfo) {
  restoreSelection(selectionInformation);
  setEnabled(eventsEnabled);
  eventsEnabled = null;
  selectionInformation = null;
}
__name(resetAfterCommit, "resetAfterCommit");
function createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
  let parentNamespace;
  {
    parentNamespace = hostContext;
  }
  const domElement = createElement(type, props, rootContainerInstance, parentNamespace);
  precacheFiberNode(internalInstanceHandle, domElement);
  updateFiberProps(domElement, props);
  return domElement;
}
__name(createInstance, "createInstance");
function appendInitialChild(parentInstance, child) {
  parentInstance.appendChild(child);
}
__name(appendInitialChild, "appendInitialChild");
function finalizeInitialChildren(domElement, type, props, rootContainerInstance, hostContext) {
  setInitialProperties(domElement, type, props, rootContainerInstance);
  switch (type) {
    case "button":
    case "input":
    case "select":
    case "textarea":
      return !!props.autoFocus;
    case "img":
      return true;
    default:
      return false;
  }
}
__name(finalizeInitialChildren, "finalizeInitialChildren");
function prepareUpdate(domElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
  return diffProperties(domElement, type, oldProps, newProps);
}
__name(prepareUpdate, "prepareUpdate");
function shouldSetTextContent(type, props) {
  return type === "textarea" || type === "noscript" || typeof props.children === "string" || typeof props.children === "number" || typeof props.dangerouslySetInnerHTML === "object" && props.dangerouslySetInnerHTML !== null && props.dangerouslySetInnerHTML.__html != null;
}
__name(shouldSetTextContent, "shouldSetTextContent");
function createTextInstance(text, rootContainerInstance, hostContext, internalInstanceHandle) {
  const textNode = createTextNode(text, rootContainerInstance);
  precacheFiberNode(internalInstanceHandle, textNode);
  return textNode;
}
__name(createTextInstance, "createTextInstance");
function getCurrentEventPriority() {
  const currentEvent = window.event;
  if (currentEvent === void 0) {
    return DefaultEventPriority;
  }
  return getEventPriority(currentEvent.type);
}
__name(getCurrentEventPriority, "getCurrentEventPriority");
var scheduleTimeout = typeof setTimeout === "function" ? setTimeout : void 0;
var cancelTimeout = typeof clearTimeout === "function" ? clearTimeout : void 0;
var noTimeout = -1;
var localPromise = typeof Promise === "function" ? Promise : void 0;
var scheduleMicrotask = typeof queueMicrotask === "function" ? queueMicrotask : typeof localPromise !== "undefined" ? (callback) => localPromise.resolve(null).then(callback).catch(handleErrorInNextTick) : scheduleTimeout;
function handleErrorInNextTick(error) {
  setTimeout(() => {
    throw error;
  });
}
__name(handleErrorInNextTick, "handleErrorInNextTick");
function commitMount(domElement, type, newProps, internalInstanceHandle) {
  switch (type) {
    case "button":
    case "input":
    case "select":
    case "textarea":
      if (newProps.autoFocus) {
        domElement.focus();
      }
      return;
    case "img": {
      if (newProps.src) {
        domElement.src = newProps.src;
      }
      return;
    }
  }
}
__name(commitMount, "commitMount");
function commitUpdate(domElement, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
  updateProperties(domElement, updatePayload, type, oldProps, newProps);
  updateFiberProps(domElement, newProps);
}
__name(commitUpdate, "commitUpdate");
function resetTextContent(domElement) {
  setTextContent(domElement, "");
}
__name(resetTextContent, "resetTextContent");
function commitTextUpdate(textInstance, oldText, newText) {
  textInstance.nodeValue = newText;
}
__name(commitTextUpdate, "commitTextUpdate");
function appendChild(parentInstance, child) {
  parentInstance.appendChild(child);
}
__name(appendChild, "appendChild");
function appendChildToContainer(container, child) {
  let parentNode;
  if (container.nodeType === COMMENT_NODE) {
    parentNode = container.parentNode;
    parentNode.insertBefore(child, container);
  } else {
    parentNode = container;
    parentNode.appendChild(child);
  }
  const reactRootContainer = container._reactRootContainer;
  if ((reactRootContainer === null || reactRootContainer === void 0) && parentNode.onclick === null) {
    trapClickOnNonInteractiveElement(parentNode);
  }
}
__name(appendChildToContainer, "appendChildToContainer");
function insertBefore(parentInstance, child, beforeChild) {
  parentInstance.insertBefore(child, beforeChild);
}
__name(insertBefore, "insertBefore");
function insertInContainerBefore(container, child, beforeChild) {
  if (container.nodeType === COMMENT_NODE) {
    container.parentNode.insertBefore(child, beforeChild);
  } else {
    container.insertBefore(child, beforeChild);
  }
}
__name(insertInContainerBefore, "insertInContainerBefore");
function removeChild(parentInstance, child) {
  parentInstance.removeChild(child);
}
__name(removeChild, "removeChild");
function removeChildFromContainer(container, child) {
  if (container.nodeType === COMMENT_NODE) {
    container.parentNode.removeChild(child);
  } else {
    container.removeChild(child);
  }
}
__name(removeChildFromContainer, "removeChildFromContainer");
function clearSuspenseBoundary(parentInstance, suspenseInstance) {
  let node = suspenseInstance;
  let depth = 0;
  do {
    const nextNode = node.nextSibling;
    parentInstance.removeChild(node);
    if (nextNode && nextNode.nodeType === COMMENT_NODE) {
      const data = nextNode.data;
      if (data === SUSPENSE_END_DATA) {
        if (depth === 0) {
          parentInstance.removeChild(nextNode);
          retryIfBlockedOn(suspenseInstance);
          return;
        } else {
          depth--;
        }
      } else if (data === SUSPENSE_START_DATA || data === SUSPENSE_PENDING_START_DATA || data === SUSPENSE_FALLBACK_START_DATA) {
        depth++;
      }
    }
    node = nextNode;
  } while (node);
  retryIfBlockedOn(suspenseInstance);
}
__name(clearSuspenseBoundary, "clearSuspenseBoundary");
function clearSuspenseBoundaryFromContainer(container, suspenseInstance) {
  if (container.nodeType === COMMENT_NODE) {
    clearSuspenseBoundary(container.parentNode, suspenseInstance);
  } else if (container.nodeType === ELEMENT_NODE) {
    clearSuspenseBoundary(container, suspenseInstance);
  }
  retryIfBlockedOn(container);
}
__name(clearSuspenseBoundaryFromContainer, "clearSuspenseBoundaryFromContainer");
function hideInstance(instance) {
  instance = instance;
  const style2 = instance.style;
  if (typeof style2.setProperty === "function") {
    style2.setProperty("display", "none", "important");
  } else {
    style2.display = "none";
  }
}
__name(hideInstance, "hideInstance");
function hideTextInstance(textInstance) {
  textInstance.nodeValue = "";
}
__name(hideTextInstance, "hideTextInstance");
function unhideInstance(instance, props) {
  instance = instance;
  const styleProp = props[STYLE$1];
  const display = styleProp !== void 0 && styleProp !== null && styleProp.hasOwnProperty("display") ? styleProp.display : null;
  instance.style.display = dangerousStyleValue("display", display);
}
__name(unhideInstance, "unhideInstance");
function unhideTextInstance(textInstance, text) {
  textInstance.nodeValue = text;
}
__name(unhideTextInstance, "unhideTextInstance");
function clearContainer(container) {
  if (container.nodeType === ELEMENT_NODE) {
    container.textContent = "";
  } else if (container.nodeType === DOCUMENT_NODE) {
    if (container.documentElement) {
      container.removeChild(container.documentElement);
    }
  }
}
__name(clearContainer, "clearContainer");
function canHydrateInstance(instance, type, props) {
  if (instance.nodeType !== ELEMENT_NODE || type.toLowerCase() !== instance.nodeName.toLowerCase()) {
    return null;
  }
  return instance;
}
__name(canHydrateInstance, "canHydrateInstance");
function canHydrateTextInstance(instance, text) {
  if (text === "" || instance.nodeType !== TEXT_NODE) {
    return null;
  }
  return instance;
}
__name(canHydrateTextInstance, "canHydrateTextInstance");
function canHydrateSuspenseInstance(instance) {
  if (instance.nodeType !== COMMENT_NODE) {
    return null;
  }
  return instance;
}
__name(canHydrateSuspenseInstance, "canHydrateSuspenseInstance");
function isSuspenseInstancePending(instance) {
  return instance.data === SUSPENSE_PENDING_START_DATA;
}
__name(isSuspenseInstancePending, "isSuspenseInstancePending");
function isSuspenseInstanceFallback(instance) {
  return instance.data === SUSPENSE_FALLBACK_START_DATA;
}
__name(isSuspenseInstanceFallback, "isSuspenseInstanceFallback");
function getSuspenseInstanceFallbackErrorDetails(instance) {
  const dataset = instance.nextSibling && instance.nextSibling.dataset;
  let digest;
  if (dataset) {
    digest = dataset.dgst;
  }
  {
    return {
      digest
    };
  }
}
__name(getSuspenseInstanceFallbackErrorDetails, "getSuspenseInstanceFallbackErrorDetails");
function registerSuspenseInstanceRetry(instance, callback) {
  instance._reactRetry = callback;
}
__name(registerSuspenseInstanceRetry, "registerSuspenseInstanceRetry");
function getNextHydratable(node) {
  for (; node != null; node = node.nextSibling) {
    const nodeType = node.nodeType;
    if (nodeType === ELEMENT_NODE || nodeType === TEXT_NODE) {
      break;
    }
    if (nodeType === COMMENT_NODE) {
      const nodeData = node.data;
      if (nodeData === SUSPENSE_START_DATA || nodeData === SUSPENSE_FALLBACK_START_DATA || nodeData === SUSPENSE_PENDING_START_DATA) {
        break;
      }
      if (nodeData === SUSPENSE_END_DATA) {
        return null;
      }
    }
  }
  return node;
}
__name(getNextHydratable, "getNextHydratable");
function getNextHydratableSibling(instance) {
  return getNextHydratable(instance.nextSibling);
}
__name(getNextHydratableSibling, "getNextHydratableSibling");
function getFirstHydratableChild(parentInstance) {
  return getNextHydratable(parentInstance.firstChild);
}
__name(getFirstHydratableChild, "getFirstHydratableChild");
function getFirstHydratableChildWithinContainer(parentContainer) {
  return getNextHydratable(parentContainer.firstChild);
}
__name(getFirstHydratableChildWithinContainer, "getFirstHydratableChildWithinContainer");
function getFirstHydratableChildWithinSuspenseInstance(parentInstance) {
  return getNextHydratable(parentInstance.nextSibling);
}
__name(getFirstHydratableChildWithinSuspenseInstance, "getFirstHydratableChildWithinSuspenseInstance");
function hydrateInstance(instance, type, props, rootContainerInstance, hostContext, internalInstanceHandle, shouldWarnDev) {
  precacheFiberNode(internalInstanceHandle, instance);
  updateFiberProps(instance, props);
  let parentNamespace;
  {
    parentNamespace = hostContext;
  }
  const isConcurrentMode = (internalInstanceHandle.mode & ConcurrentMode) !== NoMode;
  return diffHydratedProperties(instance, type, props, parentNamespace, rootContainerInstance, isConcurrentMode, shouldWarnDev);
}
__name(hydrateInstance, "hydrateInstance");
function hydrateTextInstance(textInstance, text, internalInstanceHandle, shouldWarnDev) {
  precacheFiberNode(internalInstanceHandle, textInstance);
  const isConcurrentMode = (internalInstanceHandle.mode & ConcurrentMode) !== NoMode;
  return diffHydratedText(textInstance, text);
}
__name(hydrateTextInstance, "hydrateTextInstance");
function hydrateSuspenseInstance(suspenseInstance, internalInstanceHandle) {
  precacheFiberNode(internalInstanceHandle, suspenseInstance);
}
__name(hydrateSuspenseInstance, "hydrateSuspenseInstance");
function getNextHydratableInstanceAfterSuspenseInstance(suspenseInstance) {
  let node = suspenseInstance.nextSibling;
  let depth = 0;
  while (node) {
    if (node.nodeType === COMMENT_NODE) {
      const data = node.data;
      if (data === SUSPENSE_END_DATA) {
        if (depth === 0) {
          return getNextHydratableSibling(node);
        } else {
          depth--;
        }
      } else if (data === SUSPENSE_START_DATA || data === SUSPENSE_FALLBACK_START_DATA || data === SUSPENSE_PENDING_START_DATA) {
        depth++;
      }
    }
    node = node.nextSibling;
  }
  return null;
}
__name(getNextHydratableInstanceAfterSuspenseInstance, "getNextHydratableInstanceAfterSuspenseInstance");
function getParentSuspenseInstance(targetInstance) {
  let node = targetInstance.previousSibling;
  let depth = 0;
  while (node) {
    if (node.nodeType === COMMENT_NODE) {
      const data = node.data;
      if (data === SUSPENSE_START_DATA || data === SUSPENSE_FALLBACK_START_DATA || data === SUSPENSE_PENDING_START_DATA) {
        if (depth === 0) {
          return node;
        } else {
          depth--;
        }
      } else if (data === SUSPENSE_END_DATA) {
        depth++;
      }
    }
    node = node.previousSibling;
  }
  return null;
}
__name(getParentSuspenseInstance, "getParentSuspenseInstance");
function commitHydratedContainer(container) {
  retryIfBlockedOn(container);
}
__name(commitHydratedContainer, "commitHydratedContainer");
function commitHydratedSuspenseInstance(suspenseInstance) {
  retryIfBlockedOn(suspenseInstance);
}
__name(commitHydratedSuspenseInstance, "commitHydratedSuspenseInstance");
function shouldDeleteUnhydratedTailInstances(parentType) {
  return parentType !== "head" && parentType !== "body";
}
__name(shouldDeleteUnhydratedTailInstances, "shouldDeleteUnhydratedTailInstances");
function didNotMatchHydratedContainerTextInstance(parentContainer, textInstance, text, isConcurrentMode) {
  checkForUnmatchedText(textInstance.nodeValue, text, isConcurrentMode);
}
__name(didNotMatchHydratedContainerTextInstance, "didNotMatchHydratedContainerTextInstance");
function didNotMatchHydratedTextInstance(parentType, parentProps, parentInstance, textInstance, text, isConcurrentMode) {
  if (parentProps[SUPPRESS_HYDRATION_WARNING$1] !== true) {
    checkForUnmatchedText(textInstance.nodeValue, text, isConcurrentMode);
  }
}
__name(didNotMatchHydratedTextInstance, "didNotMatchHydratedTextInstance");
function preparePortalMount(portalInstance) {
  listenToAllSupportedEvents(portalInstance);
}
__name(preparePortalMount, "preparePortalMount");
var randomKey = Math.random().toString(36).slice(2);
var internalInstanceKey = "__reactFiber$" + randomKey;
var internalPropsKey = "__reactProps$" + randomKey;
var internalContainerInstanceKey = "__reactContainer$" + randomKey;
var internalEventHandlersKey = "__reactEvents$" + randomKey;
var internalEventHandlerListenersKey = "__reactListeners$" + randomKey;
var internalEventHandlesSetKey = "__reactHandles$" + randomKey;
function detachDeletedInstance(node) {
  delete node[internalInstanceKey];
  delete node[internalPropsKey];
  delete node[internalEventHandlersKey];
  delete node[internalEventHandlerListenersKey];
  delete node[internalEventHandlesSetKey];
}
__name(detachDeletedInstance, "detachDeletedInstance");
function precacheFiberNode(hostInst, node) {
  node[internalInstanceKey] = hostInst;
}
__name(precacheFiberNode, "precacheFiberNode");
function markContainerAsRoot(hostRoot, node) {
  node[internalContainerInstanceKey] = hostRoot;
}
__name(markContainerAsRoot, "markContainerAsRoot");
function unmarkContainerAsRoot(node) {
  node[internalContainerInstanceKey] = null;
}
__name(unmarkContainerAsRoot, "unmarkContainerAsRoot");
function isContainerMarkedAsRoot(node) {
  return !!node[internalContainerInstanceKey];
}
__name(isContainerMarkedAsRoot, "isContainerMarkedAsRoot");
function getClosestInstanceFromNode(targetNode) {
  let targetInst = targetNode[internalInstanceKey];
  if (targetInst) {
    return targetInst;
  }
  let parentNode = targetNode.parentNode;
  while (parentNode) {
    targetInst = parentNode[internalContainerInstanceKey] || parentNode[internalInstanceKey];
    if (targetInst) {
      const alternate = targetInst.alternate;
      if (targetInst.child !== null || alternate !== null && alternate.child !== null) {
        let suspenseInstance = getParentSuspenseInstance(targetNode);
        while (suspenseInstance !== null) {
          const targetSuspenseInst = suspenseInstance[internalInstanceKey];
          if (targetSuspenseInst) {
            return targetSuspenseInst;
          }
          suspenseInstance = getParentSuspenseInstance(suspenseInstance);
        }
      }
      return targetInst;
    }
    targetNode = parentNode;
    parentNode = targetNode.parentNode;
  }
  return null;
}
__name(getClosestInstanceFromNode, "getClosestInstanceFromNode");
function getInstanceFromNode(node) {
  const inst = node[internalInstanceKey] || node[internalContainerInstanceKey];
  if (inst) {
    if (inst.tag === HostComponent || inst.tag === HostText || inst.tag === SuspenseComponent || inst.tag === HostRoot) {
      return inst;
    } else {
      return null;
    }
  }
  return null;
}
__name(getInstanceFromNode, "getInstanceFromNode");
function getNodeFromInstance(inst) {
  if (inst.tag === HostComponent || inst.tag === HostText) {
    return inst.stateNode;
  }
  throw Error(formatProdErrorMessage(33));
}
__name(getNodeFromInstance, "getNodeFromInstance");
function getFiberCurrentPropsFromNode(node) {
  return node[internalPropsKey] || null;
}
__name(getFiberCurrentPropsFromNode, "getFiberCurrentPropsFromNode");
function updateFiberProps(node, props) {
  node[internalPropsKey] = props;
}
__name(updateFiberProps, "updateFiberProps");
function getEventListenerSet(node) {
  let elementListenerSet = node[internalEventHandlersKey];
  if (elementListenerSet === void 0) {
    elementListenerSet = node[internalEventHandlersKey] = /* @__PURE__ */ new Set();
  }
  return elementListenerSet;
}
__name(getEventListenerSet, "getEventListenerSet");
var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
var valueStack = [];
var index = -1;
function createCursor(defaultValue) {
  return {
    current: defaultValue
  };
}
__name(createCursor, "createCursor");
function pop2(cursor, fiber) {
  if (index < 0) {
    return;
  }
  cursor.current = valueStack[index];
  valueStack[index] = null;
  index--;
}
__name(pop2, "pop");
function push2(cursor, value, fiber) {
  index++;
  valueStack[index] = cursor.current;
  cursor.current = value;
}
__name(push2, "push");
var emptyContextObject = {};
var contextStackCursor = createCursor(emptyContextObject);
var didPerformWorkStackCursor = createCursor(false);
var previousContext = emptyContextObject;
function getUnmaskedContext(workInProgress2, Component, didPushOwnContextIfProvider) {
  {
    if (didPushOwnContextIfProvider && isContextProvider(Component)) {
      return previousContext;
    }
    return contextStackCursor.current;
  }
}
__name(getUnmaskedContext, "getUnmaskedContext");
function cacheContext(workInProgress2, unmaskedContext, maskedContext) {
  {
    const instance = workInProgress2.stateNode;
    instance.__reactInternalMemoizedUnmaskedChildContext = unmaskedContext;
    instance.__reactInternalMemoizedMaskedChildContext = maskedContext;
  }
}
__name(cacheContext, "cacheContext");
function getMaskedContext(workInProgress2, unmaskedContext) {
  {
    const type = workInProgress2.type;
    const contextTypes = type.contextTypes;
    if (!contextTypes) {
      return emptyContextObject;
    }
    const instance = workInProgress2.stateNode;
    if (instance && instance.__reactInternalMemoizedUnmaskedChildContext === unmaskedContext) {
      return instance.__reactInternalMemoizedMaskedChildContext;
    }
    const context = {};
    for (const key in contextTypes) {
      context[key] = unmaskedContext[key];
    }
    if (instance) {
      cacheContext(workInProgress2, unmaskedContext, context);
    }
    return context;
  }
}
__name(getMaskedContext, "getMaskedContext");
function hasContextChanged() {
  {
    return didPerformWorkStackCursor.current;
  }
}
__name(hasContextChanged, "hasContextChanged");
function isContextProvider(type) {
  {
    const childContextTypes = type.childContextTypes;
    return childContextTypes !== null && childContextTypes !== void 0;
  }
}
__name(isContextProvider, "isContextProvider");
function popContext(fiber) {
  {
    pop2(didPerformWorkStackCursor);
    pop2(contextStackCursor);
  }
}
__name(popContext, "popContext");
function popTopLevelContextObject(fiber) {
  {
    pop2(didPerformWorkStackCursor);
    pop2(contextStackCursor);
  }
}
__name(popTopLevelContextObject, "popTopLevelContextObject");
function pushTopLevelContextObject(fiber, context, didChange) {
  {
    if (contextStackCursor.current !== emptyContextObject) {
      throw Error(formatProdErrorMessage(168));
    }
    push2(contextStackCursor, context);
    push2(didPerformWorkStackCursor, didChange);
  }
}
__name(pushTopLevelContextObject, "pushTopLevelContextObject");
function processChildContext(fiber, type, parentContext) {
  {
    const instance = fiber.stateNode;
    const childContextTypes = type.childContextTypes;
    if (typeof instance.getChildContext !== "function") {
      return parentContext;
    }
    const childContext = instance.getChildContext();
    for (const contextKey in childContext) {
      if (!(contextKey in childContextTypes)) {
        throw Error(formatProdErrorMessage(108, getComponentNameFromFiber(fiber) || "Unknown", contextKey));
      }
    }
    return assign({}, parentContext, childContext);
  }
}
__name(processChildContext, "processChildContext");
function pushContextProvider(workInProgress2) {
  {
    const instance = workInProgress2.stateNode;
    const memoizedMergedChildContext = instance && instance.__reactInternalMemoizedMergedChildContext || emptyContextObject;
    previousContext = contextStackCursor.current;
    push2(contextStackCursor, memoizedMergedChildContext);
    push2(didPerformWorkStackCursor, didPerformWorkStackCursor.current);
    return true;
  }
}
__name(pushContextProvider, "pushContextProvider");
function invalidateContextProvider(workInProgress2, type, didChange) {
  {
    const instance = workInProgress2.stateNode;
    if (!instance) {
      throw Error(formatProdErrorMessage(169));
    }
    if (didChange) {
      const mergedContext = processChildContext(workInProgress2, type, previousContext);
      instance.__reactInternalMemoizedMergedChildContext = mergedContext;
      pop2(didPerformWorkStackCursor);
      pop2(contextStackCursor);
      push2(contextStackCursor, mergedContext);
      push2(didPerformWorkStackCursor, didChange);
    } else {
      pop2(didPerformWorkStackCursor);
      push2(didPerformWorkStackCursor, didChange);
    }
  }
}
__name(invalidateContextProvider, "invalidateContextProvider");
function findCurrentUnmaskedContext(fiber) {
  {
    if (!isFiberMounted(fiber) || fiber.tag !== ClassComponent) {
      throw Error(formatProdErrorMessage(170));
    }
    let node = fiber;
    do {
      switch (node.tag) {
        case HostRoot:
          return node.stateNode.context;
        case ClassComponent: {
          const Component = node.type;
          if (isContextProvider(Component)) {
            return node.stateNode.__reactInternalMemoizedMergedChildContext;
          }
          break;
        }
      }
      node = node.return;
    } while (node !== null);
    throw Error(formatProdErrorMessage(171));
  }
}
__name(findCurrentUnmaskedContext, "findCurrentUnmaskedContext");
var LegacyRoot = 0;
var ConcurrentRoot = 1;
var syncQueue = null;
var includesLegacySyncCallbacks = false;
var isFlushingSyncQueue = false;
function scheduleSyncCallback(callback) {
  if (syncQueue === null) {
    syncQueue = [callback];
  } else {
    syncQueue.push(callback);
  }
}
__name(scheduleSyncCallback, "scheduleSyncCallback");
function scheduleLegacySyncCallback(callback) {
  includesLegacySyncCallbacks = true;
  scheduleSyncCallback(callback);
}
__name(scheduleLegacySyncCallback, "scheduleLegacySyncCallback");
function flushSyncCallbacksOnlyInLegacyMode() {
  if (includesLegacySyncCallbacks) {
    flushSyncCallbacks();
  }
}
__name(flushSyncCallbacksOnlyInLegacyMode, "flushSyncCallbacksOnlyInLegacyMode");
function flushSyncCallbacks() {
  if (!isFlushingSyncQueue && syncQueue !== null) {
    isFlushingSyncQueue = true;
    let i = 0;
    const previousUpdatePriority = getCurrentUpdatePriority();
    try {
      const isSync = true;
      const queue = syncQueue;
      setCurrentUpdatePriority(DiscreteEventPriority);
      for (; i < queue.length; i++) {
        let callback = queue[i];
        do {
          callback = callback(isSync);
        } while (callback !== null);
      }
      syncQueue = null;
      includesLegacySyncCallbacks = false;
    } catch (error) {
      if (syncQueue !== null) {
        syncQueue = syncQueue.slice(i + 1);
      }
      scheduleCallback(ImmediatePriority2, flushSyncCallbacks);
      throw error;
    } finally {
      setCurrentUpdatePriority(previousUpdatePriority);
      isFlushingSyncQueue = false;
    }
  }
  return null;
}
__name(flushSyncCallbacks, "flushSyncCallbacks");
var forkStack = [];
var forkStackIndex = 0;
var treeForkProvider = null;
var treeForkCount = 0;
var idStack = [];
var idStackIndex = 0;
var treeContextProvider = null;
var treeContextId = 1;
var treeContextOverflow = "";
function isForkedChild(workInProgress2) {
  return (workInProgress2.flags & Forked) !== NoFlags;
}
__name(isForkedChild, "isForkedChild");
function getForksAtLevel(workInProgress2) {
  return treeForkCount;
}
__name(getForksAtLevel, "getForksAtLevel");
function getTreeId() {
  const overflow = treeContextOverflow;
  const idWithLeadingBit = treeContextId;
  const id = idWithLeadingBit & ~getLeadingBit(idWithLeadingBit);
  return id.toString(32) + overflow;
}
__name(getTreeId, "getTreeId");
function pushTreeFork(workInProgress2, totalChildren) {
  forkStack[forkStackIndex++] = treeForkCount;
  forkStack[forkStackIndex++] = treeForkProvider;
  treeForkProvider = workInProgress2;
  treeForkCount = totalChildren;
}
__name(pushTreeFork, "pushTreeFork");
function pushTreeId(workInProgress2, totalChildren, index2) {
  idStack[idStackIndex++] = treeContextId;
  idStack[idStackIndex++] = treeContextOverflow;
  idStack[idStackIndex++] = treeContextProvider;
  treeContextProvider = workInProgress2;
  const baseIdWithLeadingBit = treeContextId;
  const baseOverflow = treeContextOverflow;
  const baseLength = getBitLength(baseIdWithLeadingBit) - 1;
  const baseId = baseIdWithLeadingBit & ~(1 << baseLength);
  const slot = index2 + 1;
  const length = getBitLength(totalChildren) + baseLength;
  if (length > 30) {
    const numberOfOverflowBits = baseLength - baseLength % 5;
    const newOverflowBits = (1 << numberOfOverflowBits) - 1;
    const newOverflow = (baseId & newOverflowBits).toString(32);
    const restOfBaseId = baseId >> numberOfOverflowBits;
    const restOfBaseLength = baseLength - numberOfOverflowBits;
    const restOfLength = getBitLength(totalChildren) + restOfBaseLength;
    const restOfNewBits = slot << restOfBaseLength;
    const id = restOfNewBits | restOfBaseId;
    const overflow = newOverflow + baseOverflow;
    treeContextId = 1 << restOfLength | id;
    treeContextOverflow = overflow;
  } else {
    const newBits = slot << baseLength;
    const id = newBits | baseId;
    const overflow = baseOverflow;
    treeContextId = 1 << length | id;
    treeContextOverflow = overflow;
  }
}
__name(pushTreeId, "pushTreeId");
function pushMaterializedTreeId(workInProgress2) {
  const returnFiber = workInProgress2.return;
  if (returnFiber !== null) {
    const numberOfForks = 1;
    const slotIndex = 0;
    pushTreeFork(workInProgress2, numberOfForks);
    pushTreeId(workInProgress2, numberOfForks, slotIndex);
  }
}
__name(pushMaterializedTreeId, "pushMaterializedTreeId");
function getBitLength(number) {
  return 32 - clz32(number);
}
__name(getBitLength, "getBitLength");
function getLeadingBit(id) {
  return 1 << getBitLength(id) - 1;
}
__name(getLeadingBit, "getLeadingBit");
function popTreeContext(workInProgress2) {
  while (workInProgress2 === treeForkProvider) {
    treeForkProvider = forkStack[--forkStackIndex];
    forkStack[forkStackIndex] = null;
    treeForkCount = forkStack[--forkStackIndex];
    forkStack[forkStackIndex] = null;
  }
  while (workInProgress2 === treeContextProvider) {
    treeContextProvider = idStack[--idStackIndex];
    idStack[idStackIndex] = null;
    treeContextOverflow = idStack[--idStackIndex];
    idStack[idStackIndex] = null;
    treeContextId = idStack[--idStackIndex];
    idStack[idStackIndex] = null;
  }
}
__name(popTreeContext, "popTreeContext");
function getSuspendedTreeContext() {
  if (treeContextProvider !== null) {
    return {
      id: treeContextId,
      overflow: treeContextOverflow
    };
  } else {
    return null;
  }
}
__name(getSuspendedTreeContext, "getSuspendedTreeContext");
function restoreSuspendedTreeContext(workInProgress2, suspendedContext) {
  idStack[idStackIndex++] = treeContextId;
  idStack[idStackIndex++] = treeContextOverflow;
  idStack[idStackIndex++] = treeContextProvider;
  treeContextId = suspendedContext.id;
  treeContextOverflow = suspendedContext.overflow;
  treeContextProvider = workInProgress2;
}
__name(restoreSuspendedTreeContext, "restoreSuspendedTreeContext");
var hydrationParentFiber = null;
var nextHydratableInstance = null;
var isHydrating = false;
var didSuspendOrErrorDEV = false;
var hydrationErrors = null;
function enterHydrationState(fiber) {
  const parentInstance = fiber.stateNode.containerInfo;
  nextHydratableInstance = getFirstHydratableChildWithinContainer(parentInstance);
  hydrationParentFiber = fiber;
  isHydrating = true;
  hydrationErrors = null;
  didSuspendOrErrorDEV = false;
  return true;
}
__name(enterHydrationState, "enterHydrationState");
function reenterHydrationStateFromDehydratedSuspenseInstance(fiber, suspenseInstance, treeContext) {
  nextHydratableInstance = getFirstHydratableChildWithinSuspenseInstance(suspenseInstance);
  hydrationParentFiber = fiber;
  isHydrating = true;
  hydrationErrors = null;
  didSuspendOrErrorDEV = false;
  if (treeContext !== null) {
    restoreSuspendedTreeContext(fiber, treeContext);
  }
  return true;
}
__name(reenterHydrationStateFromDehydratedSuspenseInstance, "reenterHydrationStateFromDehydratedSuspenseInstance");
function deleteHydratableInstance(returnFiber, instance) {
  const childToDelete = createFiberFromHostInstanceForDeletion();
  childToDelete.stateNode = instance;
  childToDelete.return = returnFiber;
  const deletions = returnFiber.deletions;
  if (deletions === null) {
    returnFiber.deletions = [childToDelete];
    returnFiber.flags |= ChildDeletion;
  } else {
    deletions.push(childToDelete);
  }
}
__name(deleteHydratableInstance, "deleteHydratableInstance");
function insertNonHydratedInstance(returnFiber, fiber) {
  fiber.flags = fiber.flags & ~Hydrating | Placement;
}
__name(insertNonHydratedInstance, "insertNonHydratedInstance");
function tryHydrate(fiber, nextInstance) {
  switch (fiber.tag) {
    case HostComponent: {
      const type = fiber.type;
      const props = fiber.pendingProps;
      const instance = canHydrateInstance(nextInstance, type);
      if (instance !== null) {
        fiber.stateNode = instance;
        hydrationParentFiber = fiber;
        nextHydratableInstance = getFirstHydratableChild(instance);
        return true;
      }
      return false;
    }
    case HostText: {
      const text = fiber.pendingProps;
      const textInstance = canHydrateTextInstance(nextInstance, text);
      if (textInstance !== null) {
        fiber.stateNode = textInstance;
        hydrationParentFiber = fiber;
        nextHydratableInstance = null;
        return true;
      }
      return false;
    }
    case SuspenseComponent: {
      const suspenseInstance = canHydrateSuspenseInstance(nextInstance);
      if (suspenseInstance !== null) {
        const suspenseState = {
          dehydrated: suspenseInstance,
          treeContext: getSuspendedTreeContext(),
          retryLane: OffscreenLane
        };
        fiber.memoizedState = suspenseState;
        const dehydratedFragment = createFiberFromDehydratedFragment(suspenseInstance);
        dehydratedFragment.return = fiber;
        fiber.child = dehydratedFragment;
        hydrationParentFiber = fiber;
        nextHydratableInstance = null;
        return true;
      }
      return false;
    }
    default:
      return false;
  }
}
__name(tryHydrate, "tryHydrate");
function shouldClientRenderOnMismatch(fiber) {
  return (fiber.mode & ConcurrentMode) !== NoMode && (fiber.flags & DidCapture) === NoFlags;
}
__name(shouldClientRenderOnMismatch, "shouldClientRenderOnMismatch");
function throwOnHydrationMismatch(fiber) {
  throw Error(formatProdErrorMessage(418));
}
__name(throwOnHydrationMismatch, "throwOnHydrationMismatch");
function tryToClaimNextHydratableInstance(fiber) {
  if (!isHydrating) {
    return;
  }
  let nextInstance = nextHydratableInstance;
  if (!nextInstance) {
    if (shouldClientRenderOnMismatch(fiber)) {
      throwOnHydrationMismatch();
    }
    insertNonHydratedInstance(hydrationParentFiber, fiber);
    isHydrating = false;
    hydrationParentFiber = fiber;
    return;
  }
  const firstAttemptedInstance = nextInstance;
  if (!tryHydrate(fiber, nextInstance)) {
    if (shouldClientRenderOnMismatch(fiber)) {
      throwOnHydrationMismatch();
    }
    nextInstance = getNextHydratableSibling(firstAttemptedInstance);
    const prevHydrationParentFiber = hydrationParentFiber;
    if (!nextInstance || !tryHydrate(fiber, nextInstance)) {
      insertNonHydratedInstance(hydrationParentFiber, fiber);
      isHydrating = false;
      hydrationParentFiber = fiber;
      return;
    }
    deleteHydratableInstance(prevHydrationParentFiber, firstAttemptedInstance);
  }
}
__name(tryToClaimNextHydratableInstance, "tryToClaimNextHydratableInstance");
function prepareToHydrateHostInstance(fiber, rootContainerInstance, hostContext) {
  const instance = fiber.stateNode;
  const shouldWarnIfMismatchDev = !didSuspendOrErrorDEV;
  const updatePayload = hydrateInstance(instance, fiber.type, fiber.memoizedProps, rootContainerInstance, hostContext, fiber, shouldWarnIfMismatchDev);
  fiber.updateQueue = updatePayload;
  if (updatePayload !== null) {
    return true;
  }
  return false;
}
__name(prepareToHydrateHostInstance, "prepareToHydrateHostInstance");
function prepareToHydrateHostTextInstance(fiber) {
  const textInstance = fiber.stateNode;
  const textContent = fiber.memoizedProps;
  const shouldUpdate = hydrateTextInstance(textInstance, textContent, fiber);
  if (shouldUpdate) {
    const returnFiber = hydrationParentFiber;
    if (returnFiber !== null) {
      switch (returnFiber.tag) {
        case HostRoot: {
          const parentContainer = returnFiber.stateNode.containerInfo;
          const isConcurrentMode = (returnFiber.mode & ConcurrentMode) !== NoMode;
          didNotMatchHydratedContainerTextInstance(
            parentContainer,
            textInstance,
            textContent,
            // TODO: Delete this argument when we remove the legacy root API.
            isConcurrentMode
          );
          break;
        }
        case HostComponent: {
          const parentType = returnFiber.type;
          const parentProps = returnFiber.memoizedProps;
          const parentInstance = returnFiber.stateNode;
          const isConcurrentMode = (returnFiber.mode & ConcurrentMode) !== NoMode;
          didNotMatchHydratedTextInstance(
            parentType,
            parentProps,
            parentInstance,
            textInstance,
            textContent,
            // TODO: Delete this argument when we remove the legacy root API.
            isConcurrentMode
          );
          break;
        }
      }
    }
  }
  return shouldUpdate;
}
__name(prepareToHydrateHostTextInstance, "prepareToHydrateHostTextInstance");
function prepareToHydrateHostSuspenseInstance(fiber) {
  const suspenseState = fiber.memoizedState;
  const suspenseInstance = suspenseState !== null ? suspenseState.dehydrated : null;
  if (!suspenseInstance) {
    throw Error(formatProdErrorMessage(317));
  }
  hydrateSuspenseInstance(suspenseInstance, fiber);
}
__name(prepareToHydrateHostSuspenseInstance, "prepareToHydrateHostSuspenseInstance");
function skipPastDehydratedSuspenseInstance(fiber) {
  const suspenseState = fiber.memoizedState;
  const suspenseInstance = suspenseState !== null ? suspenseState.dehydrated : null;
  if (!suspenseInstance) {
    throw Error(formatProdErrorMessage(317));
  }
  return getNextHydratableInstanceAfterSuspenseInstance(suspenseInstance);
}
__name(skipPastDehydratedSuspenseInstance, "skipPastDehydratedSuspenseInstance");
function popToNextHostParent(fiber) {
  let parent = fiber.return;
  while (parent !== null && parent.tag !== HostComponent && parent.tag !== HostRoot && parent.tag !== SuspenseComponent) {
    parent = parent.return;
  }
  hydrationParentFiber = parent;
}
__name(popToNextHostParent, "popToNextHostParent");
function popHydrationState(fiber) {
  if (fiber !== hydrationParentFiber) {
    return false;
  }
  if (!isHydrating) {
    popToNextHostParent(fiber);
    isHydrating = true;
    return false;
  }
  if (fiber.tag !== HostRoot && (fiber.tag !== HostComponent || shouldDeleteUnhydratedTailInstances(fiber.type) && !shouldSetTextContent(fiber.type, fiber.memoizedProps))) {
    let nextInstance = nextHydratableInstance;
    if (nextInstance) {
      if (shouldClientRenderOnMismatch(fiber)) {
        warnIfUnhydratedTailNodes();
        throwOnHydrationMismatch();
      } else {
        while (nextInstance) {
          deleteHydratableInstance(fiber, nextInstance);
          nextInstance = getNextHydratableSibling(nextInstance);
        }
      }
    }
  }
  popToNextHostParent(fiber);
  if (fiber.tag === SuspenseComponent) {
    nextHydratableInstance = skipPastDehydratedSuspenseInstance(fiber);
  } else {
    nextHydratableInstance = hydrationParentFiber ? getNextHydratableSibling(fiber.stateNode) : null;
  }
  return true;
}
__name(popHydrationState, "popHydrationState");
function hasUnhydratedTailNodes() {
  return isHydrating && nextHydratableInstance !== null;
}
__name(hasUnhydratedTailNodes, "hasUnhydratedTailNodes");
function warnIfUnhydratedTailNodes(fiber) {
  let nextInstance = nextHydratableInstance;
  while (nextInstance) {
    nextInstance = getNextHydratableSibling(nextInstance);
  }
}
__name(warnIfUnhydratedTailNodes, "warnIfUnhydratedTailNodes");
function resetHydrationState() {
  hydrationParentFiber = null;
  nextHydratableInstance = null;
  isHydrating = false;
  didSuspendOrErrorDEV = false;
}
__name(resetHydrationState, "resetHydrationState");
function upgradeHydrationErrorsToRecoverable() {
  if (hydrationErrors !== null) {
    queueRecoverableErrors(hydrationErrors);
    hydrationErrors = null;
  }
}
__name(upgradeHydrationErrorsToRecoverable, "upgradeHydrationErrorsToRecoverable");
function getIsHydrating() {
  return isHydrating;
}
__name(getIsHydrating, "getIsHydrating");
function queueHydrationError(error) {
  if (hydrationErrors === null) {
    hydrationErrors = [error];
  } else {
    hydrationErrors.push(error);
  }
}
__name(queueHydrationError, "queueHydrationError");
var ReactCurrentBatchConfig$1 = ReactSharedInternals.ReactCurrentBatchConfig;
var NoTransition = null;
function requestCurrentTransition() {
  return ReactCurrentBatchConfig$1.transition;
}
__name(requestCurrentTransition, "requestCurrentTransition");
function coerceRef(returnFiber, current, element) {
  const mixedRef = element.ref;
  if (mixedRef !== null && typeof mixedRef !== "function" && typeof mixedRef !== "object") {
    if (element._owner) {
      const owner = element._owner;
      let inst;
      if (owner) {
        const ownerFiber = owner;
        if (ownerFiber.tag !== ClassComponent) {
          throw Error(formatProdErrorMessage(309));
        }
        inst = ownerFiber.stateNode;
      }
      if (!inst) {
        throw Error(formatProdErrorMessage(147, mixedRef));
      }
      const resolvedInst = inst;
      const stringRef = "" + mixedRef;
      if (current !== null && current.ref !== null && typeof current.ref === "function" && current.ref._stringRef === stringRef) {
        return current.ref;
      }
      const ref = /* @__PURE__ */ __name(function(value) {
        const refs = resolvedInst.refs;
        if (value === null) {
          delete refs[stringRef];
        } else {
          refs[stringRef] = value;
        }
      }, "ref");
      ref._stringRef = stringRef;
      return ref;
    } else {
      if (typeof mixedRef !== "string") {
        throw Error(formatProdErrorMessage(284));
      }
      if (!element._owner) {
        throw Error(formatProdErrorMessage(290, mixedRef));
      }
    }
  }
  return mixedRef;
}
__name(coerceRef, "coerceRef");
function throwOnInvalidObjectType(returnFiber, newChild) {
  const childString = Object.prototype.toString.call(newChild);
  throw Error(formatProdErrorMessage(31, childString === "[object Object]" ? "object with keys {" + Object.keys(newChild).join(", ") + "}" : childString));
}
__name(throwOnInvalidObjectType, "throwOnInvalidObjectType");
function resolveLazy(lazyType) {
  const payload = lazyType._payload;
  const init = lazyType._init;
  return init(payload);
}
__name(resolveLazy, "resolveLazy");
function ChildReconciler(shouldTrackSideEffects) {
  function deleteChild(returnFiber, childToDelete) {
    if (!shouldTrackSideEffects) {
      return;
    }
    const deletions = returnFiber.deletions;
    if (deletions === null) {
      returnFiber.deletions = [childToDelete];
      returnFiber.flags |= ChildDeletion;
    } else {
      deletions.push(childToDelete);
    }
  }
  __name(deleteChild, "deleteChild");
  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    if (!shouldTrackSideEffects) {
      return null;
    }
    let childToDelete = currentFirstChild;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
    return null;
  }
  __name(deleteRemainingChildren, "deleteRemainingChildren");
  function mapRemainingChildren(returnFiber, currentFirstChild) {
    const existingChildren = /* @__PURE__ */ new Map();
    let existingChild = currentFirstChild;
    while (existingChild !== null) {
      if (existingChild.key !== null) {
        existingChildren.set(existingChild.key, existingChild);
      } else {
        existingChildren.set(existingChild.index, existingChild);
      }
      existingChild = existingChild.sibling;
    }
    return existingChildren;
  }
  __name(mapRemainingChildren, "mapRemainingChildren");
  function useFiber(fiber, pendingProps) {
    const clone = createWorkInProgress(fiber, pendingProps);
    clone.index = 0;
    clone.sibling = null;
    return clone;
  }
  __name(useFiber, "useFiber");
  function placeChild(newFiber, lastPlacedIndex, newIndex) {
    newFiber.index = newIndex;
    if (!shouldTrackSideEffects) {
      newFiber.flags |= Forked;
      return lastPlacedIndex;
    }
    const current = newFiber.alternate;
    if (current !== null) {
      const oldIndex = current.index;
      if (oldIndex < lastPlacedIndex) {
        newFiber.flags |= Placement;
        return lastPlacedIndex;
      } else {
        return oldIndex;
      }
    } else {
      newFiber.flags |= Placement;
      return lastPlacedIndex;
    }
  }
  __name(placeChild, "placeChild");
  function placeSingleChild(newFiber) {
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.flags |= Placement;
    }
    return newFiber;
  }
  __name(placeSingleChild, "placeSingleChild");
  function updateTextNode(returnFiber, current, textContent, lanes) {
    if (current === null || current.tag !== HostText) {
      const created = createFiberFromText(textContent, returnFiber.mode, lanes);
      created.return = returnFiber;
      return created;
    } else {
      const existing = useFiber(current, textContent);
      existing.return = returnFiber;
      return existing;
    }
  }
  __name(updateTextNode, "updateTextNode");
  function updateElement(returnFiber, current, element, lanes) {
    const elementType = element.type;
    if (elementType === REACT_FRAGMENT_TYPE) {
      return updateFragment2(returnFiber, current, element.props.children, lanes, element.key);
    }
    if (current !== null) {
      if (current.elementType === elementType || // Keep this check inline so it only runs on the false path:
      false || // Lazy types should reconcile their resolved type.
      // We need to do this after the Hot Reloading check above,
      // because hot reloading has different semantics than prod because
      // it doesn't resuspend. So we can't let the call below suspend.
      typeof elementType === "object" && elementType !== null && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === current.type) {
        const existing = useFiber(current, element.props);
        existing.ref = coerceRef(returnFiber, current, element);
        existing.return = returnFiber;
        return existing;
      }
    }
    const created = createFiberFromElement(element, returnFiber.mode, lanes);
    created.ref = coerceRef(returnFiber, current, element);
    created.return = returnFiber;
    return created;
  }
  __name(updateElement, "updateElement");
  function updatePortal(returnFiber, current, portal, lanes) {
    if (current === null || current.tag !== HostPortal || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation) {
      const created = createFiberFromPortal(portal, returnFiber.mode, lanes);
      created.return = returnFiber;
      return created;
    } else {
      const existing = useFiber(current, portal.children || []);
      existing.return = returnFiber;
      return existing;
    }
  }
  __name(updatePortal, "updatePortal");
  function updateFragment2(returnFiber, current, fragment, lanes, key) {
    if (current === null || current.tag !== Fragment) {
      const created = createFiberFromFragment(fragment, returnFiber.mode, lanes, key);
      created.return = returnFiber;
      return created;
    } else {
      const existing = useFiber(current, fragment);
      existing.return = returnFiber;
      return existing;
    }
  }
  __name(updateFragment2, "updateFragment");
  function createChild(returnFiber, newChild, lanes) {
    if (typeof newChild === "string" && newChild !== "" || typeof newChild === "number") {
      const created = createFiberFromText("" + newChild, returnFiber.mode, lanes);
      created.return = returnFiber;
      return created;
    }
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const created = createFiberFromElement(newChild, returnFiber.mode, lanes);
          created.ref = coerceRef(returnFiber, null, newChild);
          created.return = returnFiber;
          return created;
        }
        case REACT_PORTAL_TYPE: {
          const created = createFiberFromPortal(newChild, returnFiber.mode, lanes);
          created.return = returnFiber;
          return created;
        }
        case REACT_LAZY_TYPE: {
          const payload = newChild._payload;
          const init = newChild._init;
          return createChild(returnFiber, init(payload), lanes);
        }
      }
      if (isArray(newChild) || getIteratorFn(newChild)) {
        const created = createFiberFromFragment(newChild, returnFiber.mode, lanes, null);
        created.return = returnFiber;
        return created;
      }
      throwOnInvalidObjectType(returnFiber, newChild);
    }
    return null;
  }
  __name(createChild, "createChild");
  function updateSlot(returnFiber, oldFiber, newChild, lanes) {
    const key = oldFiber !== null ? oldFiber.key : null;
    if (typeof newChild === "string" && newChild !== "" || typeof newChild === "number") {
      if (key !== null) {
        return null;
      }
      return updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
    }
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          if (newChild.key === key) {
            return updateElement(returnFiber, oldFiber, newChild, lanes);
          } else {
            return null;
          }
        }
        case REACT_PORTAL_TYPE: {
          if (newChild.key === key) {
            return updatePortal(returnFiber, oldFiber, newChild, lanes);
          } else {
            return null;
          }
        }
        case REACT_LAZY_TYPE: {
          const payload = newChild._payload;
          const init = newChild._init;
          return updateSlot(returnFiber, oldFiber, init(payload), lanes);
        }
      }
      if (isArray(newChild) || getIteratorFn(newChild)) {
        if (key !== null) {
          return null;
        }
        return updateFragment2(returnFiber, oldFiber, newChild, lanes, null);
      }
      throwOnInvalidObjectType(returnFiber, newChild);
    }
    return null;
  }
  __name(updateSlot, "updateSlot");
  function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
    if (typeof newChild === "string" && newChild !== "" || typeof newChild === "number") {
      const matchedFiber = existingChildren.get(newIdx) || null;
      return updateTextNode(returnFiber, matchedFiber, "" + newChild, lanes);
    }
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const matchedFiber = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
          return updateElement(returnFiber, matchedFiber, newChild, lanes);
        }
        case REACT_PORTAL_TYPE: {
          const matchedFiber = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
          return updatePortal(returnFiber, matchedFiber, newChild, lanes);
        }
        case REACT_LAZY_TYPE:
          const payload = newChild._payload;
          const init = newChild._init;
          return updateFromMap(existingChildren, returnFiber, newIdx, init(payload), lanes);
      }
      if (isArray(newChild) || getIteratorFn(newChild)) {
        const matchedFiber = existingChildren.get(newIdx) || null;
        return updateFragment2(returnFiber, matchedFiber, newChild, lanes, null);
      }
      throwOnInvalidObjectType(returnFiber, newChild);
    }
    return null;
  }
  __name(updateFromMap, "updateFromMap");
  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
    let resultingFirstChild = null;
    let previousNewFiber = null;
    let oldFiber = currentFirstChild;
    let lastPlacedIndex = 0;
    let newIdx = 0;
    let nextOldFiber = null;
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }
      const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], lanes);
      if (newFiber === null) {
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }
        break;
      }
      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          deleteChild(returnFiber, oldFiber);
        }
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }
    if (newIdx === newChildren.length) {
      deleteRemainingChildren(returnFiber, oldFiber);
      if (getIsHydrating()) {
        const numberOfForks = newIdx;
        pushTreeFork(returnFiber, numberOfForks);
      }
      return resultingFirstChild;
    }
    if (oldFiber === null) {
      for (; newIdx < newChildren.length; newIdx++) {
        const newFiber = createChild(returnFiber, newChildren[newIdx], lanes);
        if (newFiber === null) {
          continue;
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
      if (getIsHydrating()) {
        const numberOfForks = newIdx;
        pushTreeFork(returnFiber, numberOfForks);
      }
      return resultingFirstChild;
    }
    const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], lanes);
      if (newFiber !== null) {
        if (shouldTrackSideEffects) {
          if (newFiber.alternate !== null) {
            existingChildren.delete(newFiber.key === null ? newIdx : newFiber.key);
          }
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
    }
    if (shouldTrackSideEffects) {
      existingChildren.forEach((child) => deleteChild(returnFiber, child));
    }
    if (getIsHydrating()) {
      const numberOfForks = newIdx;
      pushTreeFork(returnFiber, numberOfForks);
    }
    return resultingFirstChild;
  }
  __name(reconcileChildrenArray, "reconcileChildrenArray");
  function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildrenIterable, lanes) {
    const iteratorFn = getIteratorFn(newChildrenIterable);
    if (typeof iteratorFn !== "function") {
      throw Error(formatProdErrorMessage(150));
    }
    const newChildren = iteratorFn.call(newChildrenIterable);
    if (newChildren == null) {
      throw Error(formatProdErrorMessage(151));
    }
    let resultingFirstChild = null;
    let previousNewFiber = null;
    let oldFiber = currentFirstChild;
    let lastPlacedIndex = 0;
    let newIdx = 0;
    let nextOldFiber = null;
    let step = newChildren.next();
    for (; oldFiber !== null && !step.done; newIdx++, step = newChildren.next()) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }
      const newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);
      if (newFiber === null) {
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }
        break;
      }
      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          deleteChild(returnFiber, oldFiber);
        }
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }
    if (step.done) {
      deleteRemainingChildren(returnFiber, oldFiber);
      if (getIsHydrating()) {
        const numberOfForks = newIdx;
        pushTreeFork(returnFiber, numberOfForks);
      }
      return resultingFirstChild;
    }
    if (oldFiber === null) {
      for (; !step.done; newIdx++, step = newChildren.next()) {
        const newFiber = createChild(returnFiber, step.value, lanes);
        if (newFiber === null) {
          continue;
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
      if (getIsHydrating()) {
        const numberOfForks = newIdx;
        pushTreeFork(returnFiber, numberOfForks);
      }
      return resultingFirstChild;
    }
    const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
    for (; !step.done; newIdx++, step = newChildren.next()) {
      const newFiber = updateFromMap(existingChildren, returnFiber, newIdx, step.value, lanes);
      if (newFiber !== null) {
        if (shouldTrackSideEffects) {
          if (newFiber.alternate !== null) {
            existingChildren.delete(newFiber.key === null ? newIdx : newFiber.key);
          }
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
    }
    if (shouldTrackSideEffects) {
      existingChildren.forEach((child) => deleteChild(returnFiber, child));
    }
    if (getIsHydrating()) {
      const numberOfForks = newIdx;
      pushTreeFork(returnFiber, numberOfForks);
    }
    return resultingFirstChild;
  }
  __name(reconcileChildrenIterator, "reconcileChildrenIterator");
  function reconcileSingleTextNode(returnFiber, currentFirstChild, textContent, lanes) {
    if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
      deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
      const existing = useFiber(currentFirstChild, textContent);
      existing.return = returnFiber;
      return existing;
    }
    deleteRemainingChildren(returnFiber, currentFirstChild);
    const created = createFiberFromText(textContent, returnFiber.mode, lanes);
    created.return = returnFiber;
    return created;
  }
  __name(reconcileSingleTextNode, "reconcileSingleTextNode");
  function reconcileSingleElement(returnFiber, currentFirstChild, element, lanes) {
    const key = element.key;
    let child = currentFirstChild;
    while (child !== null) {
      if (child.key === key) {
        const elementType = element.type;
        if (elementType === REACT_FRAGMENT_TYPE) {
          if (child.tag === Fragment) {
            deleteRemainingChildren(returnFiber, child.sibling);
            const existing = useFiber(child, element.props.children);
            existing.return = returnFiber;
            return existing;
          }
        } else {
          if (child.elementType === elementType || // Keep this check inline so it only runs on the false path:
          false || // Lazy types should reconcile their resolved type.
          // We need to do this after the Hot Reloading check above,
          // because hot reloading has different semantics than prod because
          // it doesn't resuspend. So we can't let the call below suspend.
          typeof elementType === "object" && elementType !== null && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === child.type) {
            deleteRemainingChildren(returnFiber, child.sibling);
            const existing = useFiber(child, element.props);
            existing.ref = coerceRef(returnFiber, child, element);
            existing.return = returnFiber;
            return existing;
          }
        }
        deleteRemainingChildren(returnFiber, child);
        break;
      } else {
        deleteChild(returnFiber, child);
      }
      child = child.sibling;
    }
    if (element.type === REACT_FRAGMENT_TYPE) {
      const created = createFiberFromFragment(element.props.children, returnFiber.mode, lanes, element.key);
      created.return = returnFiber;
      return created;
    } else {
      const created = createFiberFromElement(element, returnFiber.mode, lanes);
      created.ref = coerceRef(returnFiber, currentFirstChild, element);
      created.return = returnFiber;
      return created;
    }
  }
  __name(reconcileSingleElement, "reconcileSingleElement");
  function reconcileSinglePortal(returnFiber, currentFirstChild, portal, lanes) {
    const key = portal.key;
    let child = currentFirstChild;
    while (child !== null) {
      if (child.key === key) {
        if (child.tag === HostPortal && child.stateNode.containerInfo === portal.containerInfo && child.stateNode.implementation === portal.implementation) {
          deleteRemainingChildren(returnFiber, child.sibling);
          const existing = useFiber(child, portal.children || []);
          existing.return = returnFiber;
          return existing;
        } else {
          deleteRemainingChildren(returnFiber, child);
          break;
        }
      } else {
        deleteChild(returnFiber, child);
      }
      child = child.sibling;
    }
    const created = createFiberFromPortal(portal, returnFiber.mode, lanes);
    created.return = returnFiber;
    return created;
  }
  __name(reconcileSinglePortal, "reconcileSinglePortal");
  function reconcileChildFibers2(returnFiber, currentFirstChild, newChild, lanes) {
    const isUnkeyedTopLevelFragment = typeof newChild === "object" && newChild !== null && newChild.type === REACT_FRAGMENT_TYPE && newChild.key === null;
    if (isUnkeyedTopLevelFragment) {
      newChild = newChild.props.children;
    }
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, lanes));
        case REACT_PORTAL_TYPE:
          return placeSingleChild(reconcileSinglePortal(returnFiber, currentFirstChild, newChild, lanes));
        case REACT_LAZY_TYPE:
          const payload = newChild._payload;
          const init = newChild._init;
          return reconcileChildFibers2(returnFiber, currentFirstChild, init(payload), lanes);
      }
      if (isArray(newChild)) {
        return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
      }
      if (getIteratorFn(newChild)) {
        return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, lanes);
      }
      throwOnInvalidObjectType(returnFiber, newChild);
    }
    if (typeof newChild === "string" && newChild !== "" || typeof newChild === "number") {
      return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, "" + newChild, lanes));
    }
    return deleteRemainingChildren(returnFiber, currentFirstChild);
  }
  __name(reconcileChildFibers2, "reconcileChildFibers");
  return reconcileChildFibers2;
}
__name(ChildReconciler, "ChildReconciler");
var reconcileChildFibers = ChildReconciler(true);
var mountChildFibers = ChildReconciler(false);
function cloneChildFibers(current, workInProgress2) {
  if (current !== null && workInProgress2.child !== current.child) {
    throw Error(formatProdErrorMessage(153));
  }
  if (workInProgress2.child === null) {
    return;
  }
  let currentChild = workInProgress2.child;
  let newChild = createWorkInProgress(currentChild, currentChild.pendingProps);
  workInProgress2.child = newChild;
  newChild.return = workInProgress2;
  while (currentChild.sibling !== null) {
    currentChild = currentChild.sibling;
    newChild = newChild.sibling = createWorkInProgress(currentChild, currentChild.pendingProps);
    newChild.return = workInProgress2;
  }
  newChild.sibling = null;
}
__name(cloneChildFibers, "cloneChildFibers");
function resetChildFibers(workInProgress2, lanes) {
  let child = workInProgress2.child;
  while (child !== null) {
    resetWorkInProgress(child, lanes);
    child = child.sibling;
  }
}
__name(resetChildFibers, "resetChildFibers");
var valueCursor = createCursor(null);
var currentlyRenderingFiber = null;
var lastContextDependency = null;
var lastFullyObservedContext = null;
function resetContextDependencies() {
  currentlyRenderingFiber = null;
  lastContextDependency = null;
  lastFullyObservedContext = null;
}
__name(resetContextDependencies, "resetContextDependencies");
function pushProvider(providerFiber, context, nextValue) {
  {
    push2(valueCursor, context._currentValue);
    context._currentValue = nextValue;
  }
}
__name(pushProvider, "pushProvider");
function popProvider(context, providerFiber) {
  const currentValue = valueCursor.current;
  pop2(valueCursor);
  {
    if (currentValue === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED) {
      context._currentValue = context._defaultValue;
    } else {
      context._currentValue = currentValue;
    }
  }
}
__name(popProvider, "popProvider");
function scheduleContextWorkOnParentPath(parent, renderLanes2, propagationRoot) {
  let node = parent;
  while (node !== null) {
    const alternate = node.alternate;
    if (!isSubsetOfLanes(node.childLanes, renderLanes2)) {
      node.childLanes = mergeLanes(node.childLanes, renderLanes2);
      if (alternate !== null) {
        alternate.childLanes = mergeLanes(alternate.childLanes, renderLanes2);
      }
    } else if (alternate !== null && !isSubsetOfLanes(alternate.childLanes, renderLanes2)) {
      alternate.childLanes = mergeLanes(alternate.childLanes, renderLanes2);
    }
    if (node === propagationRoot) {
      break;
    }
    node = node.return;
  }
}
__name(scheduleContextWorkOnParentPath, "scheduleContextWorkOnParentPath");
function propagateContextChange(workInProgress2, context, renderLanes2) {
  {
    propagateContextChange_eager(workInProgress2, context, renderLanes2);
  }
}
__name(propagateContextChange, "propagateContextChange");
function propagateContextChange_eager(workInProgress2, context, renderLanes2) {
  let fiber = workInProgress2.child;
  if (fiber !== null) {
    fiber.return = workInProgress2;
  }
  while (fiber !== null) {
    let nextFiber;
    const list = fiber.dependencies;
    if (list !== null) {
      nextFiber = fiber.child;
      let dependency = list.firstContext;
      while (dependency !== null) {
        if (dependency.context === context) {
          if (fiber.tag === ClassComponent) {
            const lane = pickArbitraryLane(renderLanes2);
            const update = createUpdate(NoTimestamp, lane);
            update.tag = ForceUpdate;
            const updateQueue = fiber.updateQueue;
            if (updateQueue === null)
              ;
            else {
              const sharedQueue = updateQueue.shared;
              const pending = sharedQueue.pending;
              if (pending === null) {
                update.next = update;
              } else {
                update.next = pending.next;
                pending.next = update;
              }
              sharedQueue.pending = update;
            }
          }
          fiber.lanes = mergeLanes(fiber.lanes, renderLanes2);
          const alternate = fiber.alternate;
          if (alternate !== null) {
            alternate.lanes = mergeLanes(alternate.lanes, renderLanes2);
          }
          scheduleContextWorkOnParentPath(fiber.return, renderLanes2, workInProgress2);
          list.lanes = mergeLanes(list.lanes, renderLanes2);
          break;
        }
        dependency = dependency.next;
      }
    } else if (fiber.tag === ContextProvider) {
      nextFiber = fiber.type === workInProgress2.type ? null : fiber.child;
    } else if (fiber.tag === DehydratedFragment) {
      const parentSuspense = fiber.return;
      if (parentSuspense === null) {
        throw Error(formatProdErrorMessage(341));
      }
      parentSuspense.lanes = mergeLanes(parentSuspense.lanes, renderLanes2);
      const alternate = parentSuspense.alternate;
      if (alternate !== null) {
        alternate.lanes = mergeLanes(alternate.lanes, renderLanes2);
      }
      scheduleContextWorkOnParentPath(parentSuspense, renderLanes2, workInProgress2);
      nextFiber = fiber.sibling;
    } else {
      nextFiber = fiber.child;
    }
    if (nextFiber !== null) {
      nextFiber.return = fiber;
    } else {
      nextFiber = fiber;
      while (nextFiber !== null) {
        if (nextFiber === workInProgress2) {
          nextFiber = null;
          break;
        }
        const sibling = nextFiber.sibling;
        if (sibling !== null) {
          sibling.return = nextFiber.return;
          nextFiber = sibling;
          break;
        }
        nextFiber = nextFiber.return;
      }
    }
    fiber = nextFiber;
  }
}
__name(propagateContextChange_eager, "propagateContextChange_eager");
function prepareToReadContext(workInProgress2, renderLanes2) {
  currentlyRenderingFiber = workInProgress2;
  lastContextDependency = null;
  lastFullyObservedContext = null;
  const dependencies = workInProgress2.dependencies;
  if (dependencies !== null) {
    {
      const firstContext = dependencies.firstContext;
      if (firstContext !== null) {
        if (includesSomeLane(dependencies.lanes, renderLanes2)) {
          markWorkInProgressReceivedUpdate();
        }
        dependencies.firstContext = null;
      }
    }
  }
}
__name(prepareToReadContext, "prepareToReadContext");
function readContext(context) {
  const value = context._currentValue;
  if (lastFullyObservedContext === context)
    ;
  else {
    const contextItem = {
      context,
      memoizedValue: value,
      next: null
    };
    if (lastContextDependency === null) {
      if (currentlyRenderingFiber === null) {
        throw Error(formatProdErrorMessage(308));
      }
      lastContextDependency = contextItem;
      currentlyRenderingFiber.dependencies = {
        lanes: NoLanes,
        firstContext: contextItem
      };
    } else {
      lastContextDependency = lastContextDependency.next = contextItem;
    }
  }
  return value;
}
__name(readContext, "readContext");
var concurrentQueues = null;
function pushConcurrentUpdateQueue(queue) {
  if (concurrentQueues === null) {
    concurrentQueues = [queue];
  } else {
    concurrentQueues.push(queue);
  }
}
__name(pushConcurrentUpdateQueue, "pushConcurrentUpdateQueue");
function finishQueueingConcurrentUpdates() {
  if (concurrentQueues !== null) {
    for (let i = 0; i < concurrentQueues.length; i++) {
      const queue = concurrentQueues[i];
      const lastInterleavedUpdate = queue.interleaved;
      if (lastInterleavedUpdate !== null) {
        queue.interleaved = null;
        const firstInterleavedUpdate = lastInterleavedUpdate.next;
        const lastPendingUpdate = queue.pending;
        if (lastPendingUpdate !== null) {
          const firstPendingUpdate = lastPendingUpdate.next;
          lastPendingUpdate.next = firstInterleavedUpdate;
          lastInterleavedUpdate.next = firstPendingUpdate;
        }
        queue.pending = lastInterleavedUpdate;
      }
    }
    concurrentQueues = null;
  }
}
__name(finishQueueingConcurrentUpdates, "finishQueueingConcurrentUpdates");
function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
  const interleaved = queue.interleaved;
  if (interleaved === null) {
    update.next = update;
    pushConcurrentUpdateQueue(queue);
  } else {
    update.next = interleaved.next;
    interleaved.next = update;
  }
  queue.interleaved = update;
  return markUpdateLaneFromFiberToRoot(fiber, lane);
}
__name(enqueueConcurrentHookUpdate, "enqueueConcurrentHookUpdate");
function enqueueConcurrentHookUpdateAndEagerlyBailout(fiber, queue, update, lane) {
  const interleaved = queue.interleaved;
  if (interleaved === null) {
    update.next = update;
    pushConcurrentUpdateQueue(queue);
  } else {
    update.next = interleaved.next;
    interleaved.next = update;
  }
  queue.interleaved = update;
}
__name(enqueueConcurrentHookUpdateAndEagerlyBailout, "enqueueConcurrentHookUpdateAndEagerlyBailout");
function enqueueConcurrentClassUpdate(fiber, queue, update, lane) {
  const interleaved = queue.interleaved;
  if (interleaved === null) {
    update.next = update;
    pushConcurrentUpdateQueue(queue);
  } else {
    update.next = interleaved.next;
    interleaved.next = update;
  }
  queue.interleaved = update;
  return markUpdateLaneFromFiberToRoot(fiber, lane);
}
__name(enqueueConcurrentClassUpdate, "enqueueConcurrentClassUpdate");
function enqueueConcurrentRenderForLane(fiber, lane) {
  return markUpdateLaneFromFiberToRoot(fiber, lane);
}
__name(enqueueConcurrentRenderForLane, "enqueueConcurrentRenderForLane");
var unsafe_markUpdateLaneFromFiberToRoot = markUpdateLaneFromFiberToRoot;
function markUpdateLaneFromFiberToRoot(sourceFiber, lane) {
  sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane);
  let alternate = sourceFiber.alternate;
  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, lane);
  }
  let node = sourceFiber;
  let parent = sourceFiber.return;
  while (parent !== null) {
    parent.childLanes = mergeLanes(parent.childLanes, lane);
    alternate = parent.alternate;
    if (alternate !== null) {
      alternate.childLanes = mergeLanes(alternate.childLanes, lane);
    }
    node = parent;
    parent = parent.return;
  }
  if (node.tag === HostRoot) {
    const root2 = node.stateNode;
    return root2;
  } else {
    return null;
  }
}
__name(markUpdateLaneFromFiberToRoot, "markUpdateLaneFromFiberToRoot");
var UpdateState = 0;
var ReplaceState = 1;
var ForceUpdate = 2;
var CaptureUpdate = 3;
var hasForceUpdate = false;
function initializeUpdateQueue(fiber) {
  const queue = {
    baseState: fiber.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null,
      interleaved: null,
      lanes: NoLanes
    },
    effects: null
  };
  fiber.updateQueue = queue;
}
__name(initializeUpdateQueue, "initializeUpdateQueue");
function cloneUpdateQueue(current, workInProgress2) {
  const queue = workInProgress2.updateQueue;
  const currentQueue = current.updateQueue;
  if (queue === currentQueue) {
    const clone = {
      baseState: currentQueue.baseState,
      firstBaseUpdate: currentQueue.firstBaseUpdate,
      lastBaseUpdate: currentQueue.lastBaseUpdate,
      shared: currentQueue.shared,
      effects: currentQueue.effects
    };
    workInProgress2.updateQueue = clone;
  }
}
__name(cloneUpdateQueue, "cloneUpdateQueue");
function createUpdate(eventTime, lane) {
  const update = {
    eventTime,
    lane,
    tag: UpdateState,
    payload: null,
    callback: null,
    next: null
  };
  return update;
}
__name(createUpdate, "createUpdate");
function enqueueUpdate(fiber, update, lane) {
  const updateQueue = fiber.updateQueue;
  if (updateQueue === null) {
    return null;
  }
  const sharedQueue = updateQueue.shared;
  if (isUnsafeClassRenderPhaseUpdate()) {
    const pending = sharedQueue.pending;
    if (pending === null) {
      update.next = update;
    } else {
      update.next = pending.next;
      pending.next = update;
    }
    sharedQueue.pending = update;
    return unsafe_markUpdateLaneFromFiberToRoot(fiber, lane);
  } else {
    return enqueueConcurrentClassUpdate(fiber, sharedQueue, update, lane);
  }
}
__name(enqueueUpdate, "enqueueUpdate");
function entangleTransitions(root2, fiber, lane) {
  const updateQueue = fiber.updateQueue;
  if (updateQueue === null) {
    return;
  }
  const sharedQueue = updateQueue.shared;
  if (isTransitionLane(lane)) {
    let queueLanes = sharedQueue.lanes;
    queueLanes = intersectLanes(queueLanes, root2.pendingLanes);
    const newQueueLanes = mergeLanes(queueLanes, lane);
    sharedQueue.lanes = newQueueLanes;
    markRootEntangled(root2, newQueueLanes);
  }
}
__name(entangleTransitions, "entangleTransitions");
function enqueueCapturedUpdate(workInProgress2, capturedUpdate) {
  let queue = workInProgress2.updateQueue;
  const current = workInProgress2.alternate;
  if (current !== null) {
    const currentQueue = current.updateQueue;
    if (queue === currentQueue) {
      let newFirst = null;
      let newLast = null;
      const firstBaseUpdate = queue.firstBaseUpdate;
      if (firstBaseUpdate !== null) {
        let update = firstBaseUpdate;
        do {
          const clone = {
            eventTime: update.eventTime,
            lane: update.lane,
            tag: update.tag,
            payload: update.payload,
            callback: update.callback,
            next: null
          };
          if (newLast === null) {
            newFirst = newLast = clone;
          } else {
            newLast.next = clone;
            newLast = clone;
          }
          update = update.next;
        } while (update !== null);
        if (newLast === null) {
          newFirst = newLast = capturedUpdate;
        } else {
          newLast.next = capturedUpdate;
          newLast = capturedUpdate;
        }
      } else {
        newFirst = newLast = capturedUpdate;
      }
      queue = {
        baseState: currentQueue.baseState,
        firstBaseUpdate: newFirst,
        lastBaseUpdate: newLast,
        shared: currentQueue.shared,
        effects: currentQueue.effects
      };
      workInProgress2.updateQueue = queue;
      return;
    }
  }
  const lastBaseUpdate = queue.lastBaseUpdate;
  if (lastBaseUpdate === null) {
    queue.firstBaseUpdate = capturedUpdate;
  } else {
    lastBaseUpdate.next = capturedUpdate;
  }
  queue.lastBaseUpdate = capturedUpdate;
}
__name(enqueueCapturedUpdate, "enqueueCapturedUpdate");
function getStateFromUpdate(workInProgress2, queue, update, prevState, nextProps, instance) {
  switch (update.tag) {
    case ReplaceState: {
      const payload = update.payload;
      if (typeof payload === "function") {
        const nextState = payload.call(instance, prevState, nextProps);
        return nextState;
      }
      return payload;
    }
    case CaptureUpdate: {
      workInProgress2.flags = workInProgress2.flags & ~ShouldCapture | DidCapture;
    }
    case UpdateState: {
      const payload = update.payload;
      let partialState;
      if (typeof payload === "function") {
        partialState = payload.call(instance, prevState, nextProps);
      } else {
        partialState = payload;
      }
      if (partialState === null || partialState === void 0) {
        return prevState;
      }
      return assign({}, prevState, partialState);
    }
    case ForceUpdate: {
      hasForceUpdate = true;
      return prevState;
    }
  }
  return prevState;
}
__name(getStateFromUpdate, "getStateFromUpdate");
function processUpdateQueue(workInProgress2, props, instance, renderLanes2) {
  const queue = workInProgress2.updateQueue;
  hasForceUpdate = false;
  let firstBaseUpdate = queue.firstBaseUpdate;
  let lastBaseUpdate = queue.lastBaseUpdate;
  let pendingQueue = queue.shared.pending;
  if (pendingQueue !== null) {
    queue.shared.pending = null;
    const lastPendingUpdate = pendingQueue;
    const firstPendingUpdate = lastPendingUpdate.next;
    lastPendingUpdate.next = null;
    if (lastBaseUpdate === null) {
      firstBaseUpdate = firstPendingUpdate;
    } else {
      lastBaseUpdate.next = firstPendingUpdate;
    }
    lastBaseUpdate = lastPendingUpdate;
    const current = workInProgress2.alternate;
    if (current !== null) {
      const currentQueue = current.updateQueue;
      const currentLastBaseUpdate = currentQueue.lastBaseUpdate;
      if (currentLastBaseUpdate !== lastBaseUpdate) {
        if (currentLastBaseUpdate === null) {
          currentQueue.firstBaseUpdate = firstPendingUpdate;
        } else {
          currentLastBaseUpdate.next = firstPendingUpdate;
        }
        currentQueue.lastBaseUpdate = lastPendingUpdate;
      }
    }
  }
  if (firstBaseUpdate !== null) {
    let newState = queue.baseState;
    let newLanes = NoLanes;
    let newBaseState = null;
    let newFirstBaseUpdate = null;
    let newLastBaseUpdate = null;
    let update = firstBaseUpdate;
    do {
      const updateLane = update.lane;
      const updateEventTime = update.eventTime;
      if (!isSubsetOfLanes(renderLanes2, updateLane)) {
        const clone = {
          eventTime: updateEventTime,
          lane: updateLane,
          tag: update.tag,
          payload: update.payload,
          callback: update.callback,
          next: null
        };
        if (newLastBaseUpdate === null) {
          newFirstBaseUpdate = newLastBaseUpdate = clone;
          newBaseState = newState;
        } else {
          newLastBaseUpdate = newLastBaseUpdate.next = clone;
        }
        newLanes = mergeLanes(newLanes, updateLane);
      } else {
        if (newLastBaseUpdate !== null) {
          const clone = {
            eventTime: updateEventTime,
            // This update is going to be committed so we never want uncommit
            // it. Using NoLane works because 0 is a subset of all bitmasks, so
            // this will never be skipped by the check above.
            lane: NoLane,
            tag: update.tag,
            payload: update.payload,
            callback: update.callback,
            next: null
          };
          newLastBaseUpdate = newLastBaseUpdate.next = clone;
        }
        newState = getStateFromUpdate(workInProgress2, queue, update, newState, props, instance);
        const callback = update.callback;
        if (callback !== null && // If the update was already committed, we should not queue its
        // callback again.
        update.lane !== NoLane) {
          workInProgress2.flags |= Callback;
          const effects = queue.effects;
          if (effects === null) {
            queue.effects = [update];
          } else {
            effects.push(update);
          }
        }
      }
      update = update.next;
      if (update === null) {
        pendingQueue = queue.shared.pending;
        if (pendingQueue === null) {
          break;
        } else {
          const lastPendingUpdate = pendingQueue;
          const firstPendingUpdate = lastPendingUpdate.next;
          lastPendingUpdate.next = null;
          update = firstPendingUpdate;
          queue.lastBaseUpdate = lastPendingUpdate;
          queue.shared.pending = null;
        }
      }
    } while (true);
    if (newLastBaseUpdate === null) {
      newBaseState = newState;
    }
    queue.baseState = newBaseState;
    queue.firstBaseUpdate = newFirstBaseUpdate;
    queue.lastBaseUpdate = newLastBaseUpdate;
    const lastInterleaved = queue.shared.interleaved;
    if (lastInterleaved !== null) {
      let interleaved = lastInterleaved;
      do {
        newLanes = mergeLanes(newLanes, interleaved.lane);
        interleaved = interleaved.next;
      } while (interleaved !== lastInterleaved);
    } else if (firstBaseUpdate === null) {
      queue.shared.lanes = NoLanes;
    }
    markSkippedUpdateLanes(newLanes);
    workInProgress2.lanes = newLanes;
    workInProgress2.memoizedState = newState;
  }
}
__name(processUpdateQueue, "processUpdateQueue");
function callCallback(callback, context) {
  if (typeof callback !== "function") {
    throw Error(formatProdErrorMessage(191, callback));
  }
  callback.call(context);
}
__name(callCallback, "callCallback");
function resetHasForceUpdateBeforeProcessing() {
  hasForceUpdate = false;
}
__name(resetHasForceUpdateBeforeProcessing, "resetHasForceUpdateBeforeProcessing");
function checkHasForceUpdateAfterProcessing() {
  return hasForceUpdate;
}
__name(checkHasForceUpdateAfterProcessing, "checkHasForceUpdateAfterProcessing");
function commitUpdateQueue(finishedWork, finishedQueue, instance) {
  const effects = finishedQueue.effects;
  finishedQueue.effects = null;
  if (effects !== null) {
    for (let i = 0; i < effects.length; i++) {
      const effect = effects[i];
      const callback = effect.callback;
      if (callback !== null) {
        effect.callback = null;
        callCallback(callback, instance);
      }
    }
  }
}
__name(commitUpdateQueue, "commitUpdateQueue");
var NO_CONTEXT = {};
var contextStackCursor$1 = createCursor(NO_CONTEXT);
var contextFiberStackCursor = createCursor(NO_CONTEXT);
var rootInstanceStackCursor = createCursor(NO_CONTEXT);
function requiredContext(c) {
  if (c === NO_CONTEXT) {
    throw Error(formatProdErrorMessage(174));
  }
  return c;
}
__name(requiredContext, "requiredContext");
function getRootHostContainer() {
  const rootInstance = requiredContext(rootInstanceStackCursor.current);
  return rootInstance;
}
__name(getRootHostContainer, "getRootHostContainer");
function pushHostContainer(fiber, nextRootInstance) {
  push2(rootInstanceStackCursor, nextRootInstance);
  push2(contextFiberStackCursor, fiber);
  push2(contextStackCursor$1, NO_CONTEXT);
  const nextRootContext = getRootHostContext(nextRootInstance);
  pop2(contextStackCursor$1);
  push2(contextStackCursor$1, nextRootContext);
}
__name(pushHostContainer, "pushHostContainer");
function popHostContainer(fiber) {
  pop2(contextStackCursor$1);
  pop2(contextFiberStackCursor);
  pop2(rootInstanceStackCursor);
}
__name(popHostContainer, "popHostContainer");
function getHostContext() {
  const context = requiredContext(contextStackCursor$1.current);
  return context;
}
__name(getHostContext, "getHostContext");
function pushHostContext(fiber) {
  const rootInstance = requiredContext(rootInstanceStackCursor.current);
  const context = requiredContext(contextStackCursor$1.current);
  const nextContext = getChildHostContext(context, fiber.type);
  if (context === nextContext) {
    return;
  }
  push2(contextFiberStackCursor, fiber);
  push2(contextStackCursor$1, nextContext);
}
__name(pushHostContext, "pushHostContext");
function popHostContext(fiber) {
  if (contextFiberStackCursor.current !== fiber) {
    return;
  }
  pop2(contextStackCursor$1);
  pop2(contextFiberStackCursor);
}
__name(popHostContext, "popHostContext");
var DefaultSuspenseContext = 0;
var SubtreeSuspenseContextMask = 1;
var InvisibleParentSuspenseContext = 1;
var ForceSuspenseFallback = 2;
var suspenseStackCursor = createCursor(DefaultSuspenseContext);
function hasSuspenseContext(parentContext, flag) {
  return (parentContext & flag) !== 0;
}
__name(hasSuspenseContext, "hasSuspenseContext");
function setDefaultShallowSuspenseContext(parentContext) {
  return parentContext & SubtreeSuspenseContextMask;
}
__name(setDefaultShallowSuspenseContext, "setDefaultShallowSuspenseContext");
function setShallowSuspenseContext(parentContext, shallowContext) {
  return parentContext & SubtreeSuspenseContextMask | shallowContext;
}
__name(setShallowSuspenseContext, "setShallowSuspenseContext");
function addSubtreeSuspenseContext(parentContext, subtreeContext) {
  return parentContext | subtreeContext;
}
__name(addSubtreeSuspenseContext, "addSubtreeSuspenseContext");
function pushSuspenseContext(fiber, newContext) {
  push2(suspenseStackCursor, newContext);
}
__name(pushSuspenseContext, "pushSuspenseContext");
function popSuspenseContext(fiber) {
  pop2(suspenseStackCursor);
}
__name(popSuspenseContext, "popSuspenseContext");
function shouldCaptureSuspense(workInProgress2, hasInvisibleParent) {
  const nextState = workInProgress2.memoizedState;
  if (nextState !== null) {
    if (nextState.dehydrated !== null) {
      return true;
    }
    return false;
  }
  const props = workInProgress2.memoizedProps;
  {
    return true;
  }
}
__name(shouldCaptureSuspense, "shouldCaptureSuspense");
function findFirstSuspended(row) {
  let node = row;
  while (node !== null) {
    if (node.tag === SuspenseComponent) {
      const state = node.memoizedState;
      if (state !== null) {
        const dehydrated = state.dehydrated;
        if (dehydrated === null || isSuspenseInstancePending(dehydrated) || isSuspenseInstanceFallback(dehydrated)) {
          return node;
        }
      }
    } else if (node.tag === SuspenseListComponent && // revealOrder undefined can't be trusted because it don't
    // keep track of whether it suspended or not.
    node.memoizedProps.revealOrder !== void 0) {
      const didSuspend = (node.flags & DidCapture) !== NoFlags;
      if (didSuspend) {
        return node;
      }
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node === row) {
      return null;
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === row) {
        return null;
      }
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
  return null;
}
__name(findFirstSuspended, "findFirstSuspended");
var NoFlags$1 = (
  /*   */
  0
);
var HasEffect = (
  /* */
  1
);
var Insertion = (
  /*  */
  2
);
var Layout = (
  /*    */
  4
);
var Passive$1 = (
  /*   */
  8
);
var workInProgressSources = [];
function resetWorkInProgressVersions() {
  for (let i = 0; i < workInProgressSources.length; i++) {
    const mutableSource = workInProgressSources[i];
    {
      mutableSource._workInProgressVersionPrimary = null;
    }
  }
  workInProgressSources.length = 0;
}
__name(resetWorkInProgressVersions, "resetWorkInProgressVersions");
function registerMutableSourceForHydration(root2, mutableSource) {
  const getVersion = mutableSource._getVersion;
  const version = getVersion(mutableSource._source);
  if (root2.mutableSourceEagerHydrationData == null) {
    root2.mutableSourceEagerHydrationData = [mutableSource, version];
  } else {
    root2.mutableSourceEagerHydrationData.push(mutableSource, version);
  }
}
__name(registerMutableSourceForHydration, "registerMutableSourceForHydration");
var AbortControllerLocal = typeof AbortController !== "undefined" ? AbortController : /* @__PURE__ */ __name(function AbortControllerShim() {
  const listeners = [];
  const signal = this.signal = {
    aborted: false,
    addEventListener: (type, listener) => {
      listeners.push(listener);
    }
  };
  this.abort = () => {
    signal.aborted = true;
    listeners.forEach((listener) => listener());
  };
}, "AbortControllerShim");
var scheduleCallback$1 = unstable_scheduleCallback;
var NormalPriority$1 = NormalPriority;
var CacheContext = {
  $$typeof: REACT_CONTEXT_TYPE,
  // We don't use Consumer/Provider for Cache components. So we'll cheat.
  Consumer: null,
  Provider: null,
  // We'll initialize these at the root.
  _currentValue: null,
  _currentValue2: null,
  _threadCount: 0,
  _defaultValue: null,
  _globalName: null
};
function createCache() {
  const cache = {
    controller: new AbortControllerLocal(),
    data: /* @__PURE__ */ new Map(),
    refCount: 0
  };
  return cache;
}
__name(createCache, "createCache");
function retainCache(cache) {
  cache.refCount++;
}
__name(retainCache, "retainCache");
function releaseCache(cache) {
  cache.refCount--;
  if (cache.refCount === 0) {
    scheduleCallback$1(NormalPriority$1, () => {
      cache.controller.abort();
    });
  }
}
__name(releaseCache, "releaseCache");
function pushCacheProvider(workInProgress2, cache) {
  pushProvider(workInProgress2, CacheContext, cache);
}
__name(pushCacheProvider, "pushCacheProvider");
function popCacheProvider(workInProgress2, cache) {
  popProvider(CacheContext);
}
__name(popCacheProvider, "popCacheProvider");
var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
var ReactCurrentBatchConfig$2 = ReactSharedInternals.ReactCurrentBatchConfig;
var renderLanes = NoLanes;
var currentlyRenderingFiber$1 = null;
var currentHook = null;
var workInProgressHook = null;
var didScheduleRenderPhaseUpdate = false;
var didScheduleRenderPhaseUpdateDuringThisPass = false;
var localIdCounter = 0;
var globalClientIdCounter = 0;
var RE_RENDER_LIMIT = 25;
function throwInvalidHookError() {
  throw Error(formatProdErrorMessage(321));
}
__name(throwInvalidHookError, "throwInvalidHookError");
function areHookInputsEqual(nextDeps, prevDeps) {
  if (prevDeps === null) {
    return false;
  }
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (objectIs(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}
__name(areHookInputsEqual, "areHookInputsEqual");
function renderWithHooks(current, workInProgress2, Component, props, secondArg, nextRenderLanes) {
  renderLanes = nextRenderLanes;
  currentlyRenderingFiber$1 = workInProgress2;
  workInProgress2.memoizedState = null;
  workInProgress2.updateQueue = null;
  workInProgress2.lanes = NoLanes;
  {
    ReactCurrentDispatcher$1.current = current === null || current.memoizedState === null ? HooksDispatcherOnMount : HooksDispatcherOnUpdate;
  }
  let children = Component(props, secondArg);
  if (didScheduleRenderPhaseUpdateDuringThisPass) {
    let numberOfReRenders = 0;
    do {
      didScheduleRenderPhaseUpdateDuringThisPass = false;
      localIdCounter = 0;
      if (numberOfReRenders >= RE_RENDER_LIMIT) {
        throw Error(formatProdErrorMessage(301));
      }
      numberOfReRenders += 1;
      currentHook = null;
      workInProgressHook = null;
      workInProgress2.updateQueue = null;
      ReactCurrentDispatcher$1.current = HooksDispatcherOnRerender;
      children = Component(props, secondArg);
    } while (didScheduleRenderPhaseUpdateDuringThisPass);
  }
  ReactCurrentDispatcher$1.current = ContextOnlyDispatcher;
  const didRenderTooFewHooks = currentHook !== null && currentHook.next !== null;
  renderLanes = NoLanes;
  currentlyRenderingFiber$1 = null;
  currentHook = null;
  workInProgressHook = null;
  didScheduleRenderPhaseUpdate = false;
  if (didRenderTooFewHooks) {
    throw Error(formatProdErrorMessage(300));
  }
  return children;
}
__name(renderWithHooks, "renderWithHooks");
function checkDidRenderIdHook() {
  const didRenderIdHook = localIdCounter !== 0;
  localIdCounter = 0;
  return didRenderIdHook;
}
__name(checkDidRenderIdHook, "checkDidRenderIdHook");
function bailoutHooks(current, workInProgress2, lanes) {
  workInProgress2.updateQueue = current.updateQueue;
  {
    workInProgress2.flags &= ~(Passive | Update);
  }
  current.lanes = removeLanes(current.lanes, lanes);
}
__name(bailoutHooks, "bailoutHooks");
function resetHooksAfterThrow() {
  ReactCurrentDispatcher$1.current = ContextOnlyDispatcher;
  if (didScheduleRenderPhaseUpdate) {
    let hook = currentlyRenderingFiber$1.memoizedState;
    while (hook !== null) {
      const queue = hook.queue;
      if (queue !== null) {
        queue.pending = null;
      }
      hook = hook.next;
    }
    didScheduleRenderPhaseUpdate = false;
  }
  renderLanes = NoLanes;
  currentlyRenderingFiber$1 = null;
  currentHook = null;
  workInProgressHook = null;
  didScheduleRenderPhaseUpdateDuringThisPass = false;
  localIdCounter = 0;
}
__name(resetHooksAfterThrow, "resetHooksAfterThrow");
function mountWorkInProgressHook() {
  const hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  };
  if (workInProgressHook === null) {
    currentlyRenderingFiber$1.memoizedState = workInProgressHook = hook;
  } else {
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}
__name(mountWorkInProgressHook, "mountWorkInProgressHook");
function updateWorkInProgressHook() {
  let nextCurrentHook;
  if (currentHook === null) {
    const current = currentlyRenderingFiber$1.alternate;
    if (current !== null) {
      nextCurrentHook = current.memoizedState;
    } else {
      nextCurrentHook = null;
    }
  } else {
    nextCurrentHook = currentHook.next;
  }
  let nextWorkInProgressHook;
  if (workInProgressHook === null) {
    nextWorkInProgressHook = currentlyRenderingFiber$1.memoizedState;
  } else {
    nextWorkInProgressHook = workInProgressHook.next;
  }
  if (nextWorkInProgressHook !== null) {
    workInProgressHook = nextWorkInProgressHook;
    nextWorkInProgressHook = workInProgressHook.next;
    currentHook = nextCurrentHook;
  } else {
    if (nextCurrentHook === null) {
      throw Error(formatProdErrorMessage(310));
    }
    currentHook = nextCurrentHook;
    const newHook = {
      memoizedState: currentHook.memoizedState,
      baseState: currentHook.baseState,
      baseQueue: currentHook.baseQueue,
      queue: currentHook.queue,
      next: null
    };
    if (workInProgressHook === null) {
      currentlyRenderingFiber$1.memoizedState = workInProgressHook = newHook;
    } else {
      workInProgressHook = workInProgressHook.next = newHook;
    }
  }
  return workInProgressHook;
}
__name(updateWorkInProgressHook, "updateWorkInProgressHook");
function createFunctionComponentUpdateQueue() {
  return {
    lastEffect: null,
    stores: null
  };
}
__name(createFunctionComponentUpdateQueue, "createFunctionComponentUpdateQueue");
function basicStateReducer(state, action) {
  return typeof action === "function" ? action(state) : action;
}
__name(basicStateReducer, "basicStateReducer");
function mountReducer(reducer, initialArg, init) {
  const hook = mountWorkInProgressHook();
  let initialState;
  if (init !== void 0) {
    initialState = init(initialArg);
  } else {
    initialState = initialArg;
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue = {
    pending: null,
    interleaved: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: initialState
  };
  hook.queue = queue;
  const dispatch = queue.dispatch = dispatchReducerAction.bind(null, currentlyRenderingFiber$1, queue);
  return [hook.memoizedState, dispatch];
}
__name(mountReducer, "mountReducer");
function updateReducer(reducer, initialArg, init) {
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;
  if (queue === null) {
    throw Error(formatProdErrorMessage(311));
  }
  queue.lastRenderedReducer = reducer;
  const current = currentHook;
  let baseQueue = current.baseQueue;
  const pendingQueue = queue.pending;
  if (pendingQueue !== null) {
    if (baseQueue !== null) {
      const baseFirst = baseQueue.next;
      const pendingFirst = pendingQueue.next;
      baseQueue.next = pendingFirst;
      pendingQueue.next = baseFirst;
    }
    current.baseQueue = baseQueue = pendingQueue;
    queue.pending = null;
  }
  if (baseQueue !== null) {
    const first = baseQueue.next;
    let newState = current.baseState;
    let newBaseState = null;
    let newBaseQueueFirst = null;
    let newBaseQueueLast = null;
    let update = first;
    do {
      const updateLane = update.lane;
      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        const clone = {
          lane: updateLane,
          action: update.action,
          hasEagerState: update.hasEagerState,
          eagerState: update.eagerState,
          next: null
        };
        if (newBaseQueueLast === null) {
          newBaseQueueFirst = newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }
        currentlyRenderingFiber$1.lanes = mergeLanes(currentlyRenderingFiber$1.lanes, updateLane);
        markSkippedUpdateLanes(updateLane);
      } else {
        if (newBaseQueueLast !== null) {
          const clone = {
            // This update is going to be committed so we never want uncommit
            // it. Using NoLane works because 0 is a subset of all bitmasks, so
            // this will never be skipped by the check above.
            lane: NoLane,
            action: update.action,
            hasEagerState: update.hasEagerState,
            eagerState: update.eagerState,
            next: null
          };
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }
        if (update.hasEagerState) {
          newState = update.eagerState;
        } else {
          const action = update.action;
          newState = reducer(newState, action);
        }
      }
      update = update.next;
    } while (update !== null && update !== first);
    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = newBaseQueueFirst;
    }
    if (!objectIs(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();
    }
    hook.memoizedState = newState;
    hook.baseState = newBaseState;
    hook.baseQueue = newBaseQueueLast;
    queue.lastRenderedState = newState;
  }
  const lastInterleaved = queue.interleaved;
  if (lastInterleaved !== null) {
    let interleaved = lastInterleaved;
    do {
      const interleavedLane = interleaved.lane;
      currentlyRenderingFiber$1.lanes = mergeLanes(currentlyRenderingFiber$1.lanes, interleavedLane);
      markSkippedUpdateLanes(interleavedLane);
      interleaved = interleaved.next;
    } while (interleaved !== lastInterleaved);
  } else if (baseQueue === null) {
    queue.lanes = NoLanes;
  }
  const dispatch = queue.dispatch;
  return [hook.memoizedState, dispatch];
}
__name(updateReducer, "updateReducer");
function rerenderReducer(reducer, initialArg, init) {
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;
  if (queue === null) {
    throw Error(formatProdErrorMessage(311));
  }
  queue.lastRenderedReducer = reducer;
  const dispatch = queue.dispatch;
  const lastRenderPhaseUpdate = queue.pending;
  let newState = hook.memoizedState;
  if (lastRenderPhaseUpdate !== null) {
    queue.pending = null;
    const firstRenderPhaseUpdate = lastRenderPhaseUpdate.next;
    let update = firstRenderPhaseUpdate;
    do {
      const action = update.action;
      newState = reducer(newState, action);
      update = update.next;
    } while (update !== firstRenderPhaseUpdate);
    if (!objectIs(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();
    }
    hook.memoizedState = newState;
    if (hook.baseQueue === null) {
      hook.baseState = newState;
    }
    queue.lastRenderedState = newState;
  }
  return [newState, dispatch];
}
__name(rerenderReducer, "rerenderReducer");
function mountMutableSource(source, getSnapshot, subscribe) {
  {
    return void 0;
  }
}
__name(mountMutableSource, "mountMutableSource");
function updateMutableSource(source, getSnapshot, subscribe) {
  {
    return void 0;
  }
}
__name(updateMutableSource, "updateMutableSource");
function mountSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
  const fiber = currentlyRenderingFiber$1;
  const hook = mountWorkInProgressHook();
  let nextSnapshot;
  const isHydrating2 = getIsHydrating();
  if (isHydrating2) {
    if (getServerSnapshot === void 0) {
      throw Error(formatProdErrorMessage(407));
    }
    nextSnapshot = getServerSnapshot();
  } else {
    nextSnapshot = getSnapshot();
    const root2 = getWorkInProgressRoot();
    if (root2 === null) {
      throw Error(formatProdErrorMessage(349));
    }
    if (!includesBlockingLane(root2, renderLanes)) {
      pushStoreConsistencyCheck(fiber, getSnapshot, nextSnapshot);
    }
  }
  hook.memoizedState = nextSnapshot;
  const inst = {
    value: nextSnapshot,
    getSnapshot
  };
  hook.queue = inst;
  mountEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [subscribe]);
  fiber.flags |= Passive;
  pushEffect(HasEffect | Passive$1, updateStoreInstance.bind(null, fiber, inst, nextSnapshot, getSnapshot), void 0, null);
  return nextSnapshot;
}
__name(mountSyncExternalStore, "mountSyncExternalStore");
function updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
  const fiber = currentlyRenderingFiber$1;
  const hook = updateWorkInProgressHook();
  const nextSnapshot = getSnapshot();
  const prevSnapshot = hook.memoizedState;
  const snapshotChanged = !objectIs(prevSnapshot, nextSnapshot);
  if (snapshotChanged) {
    hook.memoizedState = nextSnapshot;
    markWorkInProgressReceivedUpdate();
  }
  const inst = hook.queue;
  updateEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [subscribe]);
  if (inst.getSnapshot !== getSnapshot || snapshotChanged || // Check if the susbcribe function changed. We can save some memory by
  // checking whether we scheduled a subscription effect above.
  workInProgressHook !== null && workInProgressHook.memoizedState.tag & HasEffect) {
    fiber.flags |= Passive;
    pushEffect(HasEffect | Passive$1, updateStoreInstance.bind(null, fiber, inst, nextSnapshot, getSnapshot), void 0, null);
    const root2 = getWorkInProgressRoot();
    if (root2 === null) {
      throw Error(formatProdErrorMessage(349));
    }
    if (!includesBlockingLane(root2, renderLanes)) {
      pushStoreConsistencyCheck(fiber, getSnapshot, nextSnapshot);
    }
  }
  return nextSnapshot;
}
__name(updateSyncExternalStore, "updateSyncExternalStore");
function pushStoreConsistencyCheck(fiber, getSnapshot, renderedSnapshot) {
  fiber.flags |= StoreConsistency;
  const check = {
    getSnapshot,
    value: renderedSnapshot
  };
  let componentUpdateQueue = currentlyRenderingFiber$1.updateQueue;
  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber$1.updateQueue = componentUpdateQueue;
    componentUpdateQueue.stores = [check];
  } else {
    const stores = componentUpdateQueue.stores;
    if (stores === null) {
      componentUpdateQueue.stores = [check];
    } else {
      stores.push(check);
    }
  }
}
__name(pushStoreConsistencyCheck, "pushStoreConsistencyCheck");
function updateStoreInstance(fiber, inst, nextSnapshot, getSnapshot) {
  inst.value = nextSnapshot;
  inst.getSnapshot = getSnapshot;
  if (checkIfSnapshotChanged(inst)) {
    forceStoreRerender(fiber);
  }
}
__name(updateStoreInstance, "updateStoreInstance");
function subscribeToStore(fiber, inst, subscribe) {
  const handleStoreChange = /* @__PURE__ */ __name(() => {
    if (checkIfSnapshotChanged(inst)) {
      forceStoreRerender(fiber);
    }
  }, "handleStoreChange");
  return subscribe(handleStoreChange);
}
__name(subscribeToStore, "subscribeToStore");
function checkIfSnapshotChanged(inst) {
  const latestGetSnapshot = inst.getSnapshot;
  const prevValue = inst.value;
  try {
    const nextValue = latestGetSnapshot();
    return !objectIs(prevValue, nextValue);
  } catch (error) {
    return true;
  }
}
__name(checkIfSnapshotChanged, "checkIfSnapshotChanged");
function forceStoreRerender(fiber) {
  const root2 = enqueueConcurrentRenderForLane(fiber, SyncLane);
  if (root2 !== null) {
    scheduleUpdateOnFiber(root2, fiber, SyncLane, NoTimestamp);
  }
}
__name(forceStoreRerender, "forceStoreRerender");
function mountState(initialState) {
  const hook = mountWorkInProgressHook();
  if (typeof initialState === "function") {
    initialState = initialState();
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue = {
    pending: null,
    interleaved: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState
  };
  hook.queue = queue;
  const dispatch = queue.dispatch = dispatchSetState.bind(null, currentlyRenderingFiber$1, queue);
  return [hook.memoizedState, dispatch];
}
__name(mountState, "mountState");
function updateState(initialState) {
  return updateReducer(basicStateReducer);
}
__name(updateState, "updateState");
function rerenderState(initialState) {
  return rerenderReducer(basicStateReducer);
}
__name(rerenderState, "rerenderState");
function pushEffect(tag, create, destroy, deps) {
  const effect = {
    tag,
    create,
    destroy,
    deps,
    // Circular
    next: null
  };
  let componentUpdateQueue = currentlyRenderingFiber$1.updateQueue;
  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber$1.updateQueue = componentUpdateQueue;
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    const lastEffect = componentUpdateQueue.lastEffect;
    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      const firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }
  return effect;
}
__name(pushEffect, "pushEffect");
function mountRef(initialValue) {
  const hook = mountWorkInProgressHook();
  {
    const ref = {
      current: initialValue
    };
    hook.memoizedState = ref;
    return ref;
  }
}
__name(mountRef, "mountRef");
function updateRef(initialValue) {
  const hook = updateWorkInProgressHook();
  return hook.memoizedState;
}
__name(updateRef, "updateRef");
function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === void 0 ? null : deps;
  currentlyRenderingFiber$1.flags |= fiberFlags;
  hook.memoizedState = pushEffect(HasEffect | hookFlags, create, void 0, nextDeps);
}
__name(mountEffectImpl, "mountEffectImpl");
function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === void 0 ? null : deps;
  let destroy = void 0;
  if (currentHook !== null) {
    const prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps;
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        hook.memoizedState = pushEffect(hookFlags, create, destroy, nextDeps);
        return;
      }
    }
  }
  currentlyRenderingFiber$1.flags |= fiberFlags;
  hook.memoizedState = pushEffect(HasEffect | hookFlags, create, destroy, nextDeps);
}
__name(updateEffectImpl, "updateEffectImpl");
function mountEffect(create, deps) {
  {
    return mountEffectImpl(Passive | PassiveStatic, Passive$1, create, deps);
  }
}
__name(mountEffect, "mountEffect");
function updateEffect(create, deps) {
  return updateEffectImpl(Passive, Passive$1, create, deps);
}
__name(updateEffect, "updateEffect");
function mountInsertionEffect(create, deps) {
  return mountEffectImpl(Update, Insertion, create, deps);
}
__name(mountInsertionEffect, "mountInsertionEffect");
function updateInsertionEffect(create, deps) {
  return updateEffectImpl(Update, Insertion, create, deps);
}
__name(updateInsertionEffect, "updateInsertionEffect");
function mountLayoutEffect(create, deps) {
  let fiberFlags = Update;
  {
    fiberFlags |= LayoutStatic;
  }
  return mountEffectImpl(fiberFlags, Layout, create, deps);
}
__name(mountLayoutEffect, "mountLayoutEffect");
function updateLayoutEffect(create, deps) {
  return updateEffectImpl(Update, Layout, create, deps);
}
__name(updateLayoutEffect, "updateLayoutEffect");
function imperativeHandleEffect(create, ref) {
  if (typeof ref === "function") {
    const refCallback = ref;
    const inst = create();
    refCallback(inst);
    return () => {
      refCallback(null);
    };
  } else if (ref !== null && ref !== void 0) {
    const refObject = ref;
    const inst = create();
    refObject.current = inst;
    return () => {
      refObject.current = null;
    };
  }
}
__name(imperativeHandleEffect, "imperativeHandleEffect");
function mountImperativeHandle(ref, create, deps) {
  const effectDeps = deps !== null && deps !== void 0 ? deps.concat([ref]) : null;
  let fiberFlags = Update;
  {
    fiberFlags |= LayoutStatic;
  }
  return mountEffectImpl(fiberFlags, Layout, imperativeHandleEffect.bind(null, create, ref), effectDeps);
}
__name(mountImperativeHandle, "mountImperativeHandle");
function updateImperativeHandle(ref, create, deps) {
  const effectDeps = deps !== null && deps !== void 0 ? deps.concat([ref]) : null;
  return updateEffectImpl(Update, Layout, imperativeHandleEffect.bind(null, create, ref), effectDeps);
}
__name(updateImperativeHandle, "updateImperativeHandle");
function mountDebugValue(value, formatterFn) {
}
__name(mountDebugValue, "mountDebugValue");
var updateDebugValue = mountDebugValue;
function mountCallback(callback, deps) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === void 0 ? null : deps;
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
__name(mountCallback, "mountCallback");
function updateCallback(callback, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === void 0 ? null : deps;
  const prevState = hook.memoizedState;
  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps = prevState[1];
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
__name(updateCallback, "updateCallback");
function mountMemo(nextCreate, deps) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === void 0 ? null : deps;
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
__name(mountMemo, "mountMemo");
function updateMemo(nextCreate, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === void 0 ? null : deps;
  const prevState = hook.memoizedState;
  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps = prevState[1];
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
__name(updateMemo, "updateMemo");
function mountDeferredValue(value) {
  const hook = mountWorkInProgressHook();
  hook.memoizedState = value;
  return value;
}
__name(mountDeferredValue, "mountDeferredValue");
function updateDeferredValue(value) {
  const hook = updateWorkInProgressHook();
  const resolvedCurrentHook = currentHook;
  const prevValue = resolvedCurrentHook.memoizedState;
  return updateDeferredValueImpl(hook, prevValue, value);
}
__name(updateDeferredValue, "updateDeferredValue");
function rerenderDeferredValue(value) {
  const hook = updateWorkInProgressHook();
  if (currentHook === null) {
    hook.memoizedState = value;
    return value;
  } else {
    const prevValue = currentHook.memoizedState;
    return updateDeferredValueImpl(hook, prevValue, value);
  }
}
__name(rerenderDeferredValue, "rerenderDeferredValue");
function updateDeferredValueImpl(hook, prevValue, value) {
  const shouldDeferValue = !includesOnlyNonUrgentLanes(renderLanes);
  if (shouldDeferValue) {
    if (!objectIs(value, prevValue)) {
      const deferredLane = claimNextTransitionLane();
      currentlyRenderingFiber$1.lanes = mergeLanes(currentlyRenderingFiber$1.lanes, deferredLane);
      markSkippedUpdateLanes(deferredLane);
      hook.baseState = true;
    }
    return prevValue;
  } else {
    if (hook.baseState) {
      hook.baseState = false;
      markWorkInProgressReceivedUpdate();
    }
    hook.memoizedState = value;
    return value;
  }
}
__name(updateDeferredValueImpl, "updateDeferredValueImpl");
function startTransition(setPending, callback, options) {
  const previousPriority = getCurrentUpdatePriority();
  setCurrentUpdatePriority(higherEventPriority(previousPriority, ContinuousEventPriority));
  setPending(true);
  const prevTransition = ReactCurrentBatchConfig$2.transition;
  ReactCurrentBatchConfig$2.transition = {};
  const currentTransition = ReactCurrentBatchConfig$2.transition;
  try {
    setPending(false);
    callback();
  } finally {
    setCurrentUpdatePriority(previousPriority);
    ReactCurrentBatchConfig$2.transition = prevTransition;
  }
}
__name(startTransition, "startTransition");
function mountTransition() {
  const _mountState = mountState(false), isPending = _mountState[0], setPending = _mountState[1];
  const start = startTransition.bind(null, setPending);
  const hook = mountWorkInProgressHook();
  hook.memoizedState = start;
  return [isPending, start];
}
__name(mountTransition, "mountTransition");
function updateTransition() {
  const _updateState = updateState(), isPending = _updateState[0];
  const hook = updateWorkInProgressHook();
  const start = hook.memoizedState;
  return [isPending, start];
}
__name(updateTransition, "updateTransition");
function rerenderTransition() {
  const _rerenderState = rerenderState(), isPending = _rerenderState[0];
  const hook = updateWorkInProgressHook();
  const start = hook.memoizedState;
  return [isPending, start];
}
__name(rerenderTransition, "rerenderTransition");
function mountId() {
  const hook = mountWorkInProgressHook();
  const root2 = getWorkInProgressRoot();
  const identifierPrefix = root2.identifierPrefix;
  let id;
  if (getIsHydrating()) {
    const treeId = getTreeId();
    id = ":" + identifierPrefix + "R" + treeId;
    const localId = localIdCounter++;
    if (localId > 0) {
      id += "H" + localId.toString(32);
    }
    id += ":";
  } else {
    const globalClientId = globalClientIdCounter++;
    id = ":" + identifierPrefix + "r" + globalClientId.toString(32) + ":";
  }
  hook.memoizedState = id;
  return id;
}
__name(mountId, "mountId");
function updateId() {
  const hook = updateWorkInProgressHook();
  const id = hook.memoizedState;
  return id;
}
__name(updateId, "updateId");
function mountRefresh() {
  const hook = mountWorkInProgressHook();
  const refresh = hook.memoizedState = refreshCache.bind(null, currentlyRenderingFiber$1);
  return refresh;
}
__name(mountRefresh, "mountRefresh");
function updateRefresh() {
  const hook = updateWorkInProgressHook();
  return hook.memoizedState;
}
__name(updateRefresh, "updateRefresh");
function refreshCache(fiber, seedKey, seedValue) {
  let provider = fiber.return;
  while (provider !== null) {
    switch (provider.tag) {
      case CacheComponent:
      case HostRoot: {
        const lane = requestUpdateLane(provider);
        const eventTime = requestEventTime();
        const refreshUpdate = createUpdate(eventTime, lane);
        const root2 = enqueueUpdate(provider, refreshUpdate, lane);
        if (root2 !== null) {
          scheduleUpdateOnFiber(root2, provider, lane, eventTime);
          entangleTransitions(root2, provider, lane);
        }
        const seededCache = createCache();
        if (seedKey !== null && seedKey !== void 0 && root2 !== null) {
          seededCache.data.set(seedKey, seedValue);
        }
        const payload = {
          cache: seededCache
        };
        refreshUpdate.payload = payload;
        return;
      }
    }
    provider = provider.return;
  }
}
__name(refreshCache, "refreshCache");
function dispatchReducerAction(fiber, queue, action) {
  const lane = requestUpdateLane(fiber);
  const update = {
    lane,
    action,
    hasEagerState: false,
    eagerState: null,
    next: null
  };
  if (isRenderPhaseUpdate(fiber)) {
    enqueueRenderPhaseUpdate(queue, update);
  } else {
    const root2 = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
    if (root2 !== null) {
      const eventTime = requestEventTime();
      scheduleUpdateOnFiber(root2, fiber, lane, eventTime);
      entangleTransitionUpdate(root2, queue, lane);
    }
  }
}
__name(dispatchReducerAction, "dispatchReducerAction");
function dispatchSetState(fiber, queue, action) {
  const lane = requestUpdateLane(fiber);
  const update = {
    lane,
    action,
    hasEagerState: false,
    eagerState: null,
    next: null
  };
  if (isRenderPhaseUpdate(fiber)) {
    enqueueRenderPhaseUpdate(queue, update);
  } else {
    const alternate = fiber.alternate;
    if (fiber.lanes === NoLanes && (alternate === null || alternate.lanes === NoLanes)) {
      const lastRenderedReducer = queue.lastRenderedReducer;
      if (lastRenderedReducer !== null) {
        try {
          const currentState = queue.lastRenderedState;
          const eagerState = lastRenderedReducer(currentState, action);
          update.hasEagerState = true;
          update.eagerState = eagerState;
          if (objectIs(eagerState, currentState)) {
            enqueueConcurrentHookUpdateAndEagerlyBailout(fiber, queue, update, lane);
            return;
          }
        } catch (error) {
        } finally {
        }
      }
    }
    const root2 = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
    if (root2 !== null) {
      const eventTime = requestEventTime();
      scheduleUpdateOnFiber(root2, fiber, lane, eventTime);
      entangleTransitionUpdate(root2, queue, lane);
    }
  }
}
__name(dispatchSetState, "dispatchSetState");
function isRenderPhaseUpdate(fiber) {
  const alternate = fiber.alternate;
  return fiber === currentlyRenderingFiber$1 || alternate !== null && alternate === currentlyRenderingFiber$1;
}
__name(isRenderPhaseUpdate, "isRenderPhaseUpdate");
function enqueueRenderPhaseUpdate(queue, update) {
  didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
  const pending = queue.pending;
  if (pending === null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  queue.pending = update;
}
__name(enqueueRenderPhaseUpdate, "enqueueRenderPhaseUpdate");
function entangleTransitionUpdate(root2, queue, lane) {
  if (isTransitionLane(lane)) {
    let queueLanes = queue.lanes;
    queueLanes = intersectLanes(queueLanes, root2.pendingLanes);
    const newQueueLanes = mergeLanes(queueLanes, lane);
    queue.lanes = newQueueLanes;
    markRootEntangled(root2, newQueueLanes);
  }
}
__name(entangleTransitionUpdate, "entangleTransitionUpdate");
function getCacheSignal() {
  const cache = readContext(CacheContext);
  return cache.controller.signal;
}
__name(getCacheSignal, "getCacheSignal");
function getCacheForType(resourceType) {
  const cache = readContext(CacheContext);
  let cacheForType = cache.data.get(resourceType);
  if (cacheForType === void 0) {
    cacheForType = resourceType();
    cache.data.set(resourceType, cacheForType);
  }
  return cacheForType;
}
__name(getCacheForType, "getCacheForType");
var ContextOnlyDispatcher = {
  readContext,
  useCallback: throwInvalidHookError,
  useContext: throwInvalidHookError,
  useEffect: throwInvalidHookError,
  useImperativeHandle: throwInvalidHookError,
  useInsertionEffect: throwInvalidHookError,
  useLayoutEffect: throwInvalidHookError,
  useMemo: throwInvalidHookError,
  useReducer: throwInvalidHookError,
  useRef: throwInvalidHookError,
  useState: throwInvalidHookError,
  useDebugValue: throwInvalidHookError,
  useDeferredValue: throwInvalidHookError,
  useTransition: throwInvalidHookError,
  useMutableSource: throwInvalidHookError,
  useSyncExternalStore: throwInvalidHookError,
  useId: throwInvalidHookError,
  unstable_isNewReconciler: enableNewReconciler
};
{
  ContextOnlyDispatcher.getCacheSignal = getCacheSignal;
  ContextOnlyDispatcher.getCacheForType = getCacheForType;
  ContextOnlyDispatcher.useCacheRefresh = throwInvalidHookError;
}
var HooksDispatcherOnMount = {
  readContext,
  useCallback: mountCallback,
  useContext: readContext,
  useEffect: mountEffect,
  useImperativeHandle: mountImperativeHandle,
  useLayoutEffect: mountLayoutEffect,
  useInsertionEffect: mountInsertionEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState,
  useDebugValue: mountDebugValue,
  useDeferredValue: mountDeferredValue,
  useTransition: mountTransition,
  useMutableSource: mountMutableSource,
  useSyncExternalStore: mountSyncExternalStore,
  useId: mountId,
  unstable_isNewReconciler: enableNewReconciler
};
{
  HooksDispatcherOnMount.getCacheSignal = getCacheSignal;
  HooksDispatcherOnMount.getCacheForType = getCacheForType;
  HooksDispatcherOnMount.useCacheRefresh = mountRefresh;
}
var HooksDispatcherOnUpdate = {
  readContext,
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useInsertionEffect: updateInsertionEffect,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState,
  useDebugValue: updateDebugValue,
  useDeferredValue: updateDeferredValue,
  useTransition: updateTransition,
  useMutableSource: updateMutableSource,
  useSyncExternalStore: updateSyncExternalStore,
  useId: updateId,
  unstable_isNewReconciler: enableNewReconciler
};
{
  HooksDispatcherOnUpdate.getCacheSignal = getCacheSignal;
  HooksDispatcherOnUpdate.getCacheForType = getCacheForType;
  HooksDispatcherOnUpdate.useCacheRefresh = updateRefresh;
}
var HooksDispatcherOnRerender = {
  readContext,
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useInsertionEffect: updateInsertionEffect,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: rerenderReducer,
  useRef: updateRef,
  useState: rerenderState,
  useDebugValue: updateDebugValue,
  useDeferredValue: rerenderDeferredValue,
  useTransition: rerenderTransition,
  useMutableSource: updateMutableSource,
  useSyncExternalStore: updateSyncExternalStore,
  useId: updateId,
  unstable_isNewReconciler: enableNewReconciler
};
{
  HooksDispatcherOnRerender.getCacheSignal = getCacheSignal;
  HooksDispatcherOnRerender.getCacheForType = getCacheForType;
  HooksDispatcherOnRerender.useCacheRefresh = updateRefresh;
}
function stopProfilerTimerIfRunningAndRecordDelta(fiber, overrideBaseTime) {
  {
    return;
  }
}
__name(stopProfilerTimerIfRunningAndRecordDelta, "stopProfilerTimerIfRunningAndRecordDelta");
function recordLayoutEffectDuration(fiber) {
  {
    return;
  }
}
__name(recordLayoutEffectDuration, "recordLayoutEffectDuration");
function startLayoutEffectTimer() {
  {
    return;
  }
}
__name(startLayoutEffectTimer, "startLayoutEffectTimer");
function resolveDefaultProps(Component, baseProps) {
  if (Component && Component.defaultProps) {
    const props = assign({}, baseProps);
    const defaultProps = Component.defaultProps;
    for (const propName in defaultProps) {
      if (props[propName] === void 0) {
        props[propName] = defaultProps[propName];
      }
    }
    return props;
  }
  return baseProps;
}
__name(resolveDefaultProps, "resolveDefaultProps");
function applyDerivedStateFromProps(workInProgress2, ctor, getDerivedStateFromProps, nextProps) {
  const prevState = workInProgress2.memoizedState;
  let partialState = getDerivedStateFromProps(nextProps, prevState);
  const memoizedState = partialState === null || partialState === void 0 ? prevState : assign({}, prevState, partialState);
  workInProgress2.memoizedState = memoizedState;
  if (workInProgress2.lanes === NoLanes) {
    const updateQueue = workInProgress2.updateQueue;
    updateQueue.baseState = memoizedState;
  }
}
__name(applyDerivedStateFromProps, "applyDerivedStateFromProps");
var classComponentUpdater = {
  isMounted,
  enqueueSetState(inst, payload, callback) {
    const fiber = get(inst);
    const eventTime = requestEventTime();
    const lane = requestUpdateLane(fiber);
    const update = createUpdate(eventTime, lane);
    update.payload = payload;
    if (callback !== void 0 && callback !== null) {
      update.callback = callback;
    }
    const root2 = enqueueUpdate(fiber, update, lane);
    if (root2 !== null) {
      scheduleUpdateOnFiber(root2, fiber, lane, eventTime);
      entangleTransitions(root2, fiber, lane);
    }
  },
  enqueueReplaceState(inst, payload, callback) {
    const fiber = get(inst);
    const eventTime = requestEventTime();
    const lane = requestUpdateLane(fiber);
    const update = createUpdate(eventTime, lane);
    update.tag = ReplaceState;
    update.payload = payload;
    if (callback !== void 0 && callback !== null) {
      update.callback = callback;
    }
    const root2 = enqueueUpdate(fiber, update, lane);
    if (root2 !== null) {
      scheduleUpdateOnFiber(root2, fiber, lane, eventTime);
      entangleTransitions(root2, fiber, lane);
    }
  },
  enqueueForceUpdate(inst, callback) {
    const fiber = get(inst);
    const eventTime = requestEventTime();
    const lane = requestUpdateLane(fiber);
    const update = createUpdate(eventTime, lane);
    update.tag = ForceUpdate;
    if (callback !== void 0 && callback !== null) {
      update.callback = callback;
    }
    const root2 = enqueueUpdate(fiber, update, lane);
    if (root2 !== null) {
      scheduleUpdateOnFiber(root2, fiber, lane, eventTime);
      entangleTransitions(root2, fiber, lane);
    }
  }
};
function checkShouldComponentUpdate(workInProgress2, ctor, oldProps, newProps, oldState, newState, nextContext) {
  const instance = workInProgress2.stateNode;
  if (typeof instance.shouldComponentUpdate === "function") {
    let shouldUpdate = instance.shouldComponentUpdate(newProps, newState, nextContext);
    return shouldUpdate;
  }
  if (ctor.prototype && ctor.prototype.isPureReactComponent) {
    return !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState);
  }
  return true;
}
__name(checkShouldComponentUpdate, "checkShouldComponentUpdate");
function adoptClassInstance(workInProgress2, instance) {
  instance.updater = classComponentUpdater;
  workInProgress2.stateNode = instance;
  set(instance, workInProgress2);
}
__name(adoptClassInstance, "adoptClassInstance");
function constructClassInstance(workInProgress2, ctor, props) {
  let isLegacyContextConsumer = false;
  let unmaskedContext = emptyContextObject;
  let context = emptyContextObject;
  const contextType = ctor.contextType;
  if (typeof contextType === "object" && contextType !== null) {
    context = readContext(contextType);
  } else {
    unmaskedContext = getUnmaskedContext(workInProgress2, ctor, true);
    const contextTypes = ctor.contextTypes;
    isLegacyContextConsumer = contextTypes !== null && contextTypes !== void 0;
    context = isLegacyContextConsumer ? getMaskedContext(workInProgress2, unmaskedContext) : emptyContextObject;
  }
  let instance = new ctor(props, context);
  const state = workInProgress2.memoizedState = instance.state !== null && instance.state !== void 0 ? instance.state : null;
  adoptClassInstance(workInProgress2, instance);
  if (isLegacyContextConsumer) {
    cacheContext(workInProgress2, unmaskedContext, context);
  }
  return instance;
}
__name(constructClassInstance, "constructClassInstance");
function callComponentWillMount(workInProgress2, instance) {
  const oldState = instance.state;
  if (typeof instance.componentWillMount === "function") {
    instance.componentWillMount();
  }
  if (typeof instance.UNSAFE_componentWillMount === "function") {
    instance.UNSAFE_componentWillMount();
  }
  if (oldState !== instance.state) {
    classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
  }
}
__name(callComponentWillMount, "callComponentWillMount");
function callComponentWillReceiveProps(workInProgress2, instance, newProps, nextContext) {
  const oldState = instance.state;
  if (typeof instance.componentWillReceiveProps === "function") {
    instance.componentWillReceiveProps(newProps, nextContext);
  }
  if (typeof instance.UNSAFE_componentWillReceiveProps === "function") {
    instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
  }
  if (instance.state !== oldState) {
    classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
  }
}
__name(callComponentWillReceiveProps, "callComponentWillReceiveProps");
function mountClassInstance(workInProgress2, ctor, newProps, renderLanes2) {
  const instance = workInProgress2.stateNode;
  instance.props = newProps;
  instance.state = workInProgress2.memoizedState;
  instance.refs = {};
  initializeUpdateQueue(workInProgress2);
  const contextType = ctor.contextType;
  if (typeof contextType === "object" && contextType !== null) {
    instance.context = readContext(contextType);
  } else {
    const unmaskedContext = getUnmaskedContext(workInProgress2, ctor, true);
    instance.context = getMaskedContext(workInProgress2, unmaskedContext);
  }
  instance.state = workInProgress2.memoizedState;
  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  if (typeof getDerivedStateFromProps === "function") {
    applyDerivedStateFromProps(workInProgress2, ctor, getDerivedStateFromProps, newProps);
    instance.state = workInProgress2.memoizedState;
  }
  if (typeof ctor.getDerivedStateFromProps !== "function" && typeof instance.getSnapshotBeforeUpdate !== "function" && (typeof instance.UNSAFE_componentWillMount === "function" || typeof instance.componentWillMount === "function")) {
    callComponentWillMount(workInProgress2, instance);
    processUpdateQueue(workInProgress2, newProps, instance, renderLanes2);
    instance.state = workInProgress2.memoizedState;
  }
  if (typeof instance.componentDidMount === "function") {
    let fiberFlags = Update;
    {
      fiberFlags |= LayoutStatic;
    }
    workInProgress2.flags |= fiberFlags;
  }
}
__name(mountClassInstance, "mountClassInstance");
function resumeMountClassInstance(workInProgress2, ctor, newProps, renderLanes2) {
  const instance = workInProgress2.stateNode;
  const oldProps = workInProgress2.memoizedProps;
  instance.props = oldProps;
  const oldContext = instance.context;
  const contextType = ctor.contextType;
  let nextContext = emptyContextObject;
  if (typeof contextType === "object" && contextType !== null) {
    nextContext = readContext(contextType);
  } else {
    const nextLegacyUnmaskedContext = getUnmaskedContext(workInProgress2, ctor, true);
    nextContext = getMaskedContext(workInProgress2, nextLegacyUnmaskedContext);
  }
  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  const hasNewLifecycles = typeof getDerivedStateFromProps === "function" || typeof instance.getSnapshotBeforeUpdate === "function";
  if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillReceiveProps === "function" || typeof instance.componentWillReceiveProps === "function")) {
    if (oldProps !== newProps || oldContext !== nextContext) {
      callComponentWillReceiveProps(workInProgress2, instance, newProps, nextContext);
    }
  }
  resetHasForceUpdateBeforeProcessing();
  const oldState = workInProgress2.memoizedState;
  let newState = instance.state = oldState;
  processUpdateQueue(workInProgress2, newProps, instance, renderLanes2);
  newState = workInProgress2.memoizedState;
  if (oldProps === newProps && oldState === newState && !hasContextChanged() && !checkHasForceUpdateAfterProcessing()) {
    if (typeof instance.componentDidMount === "function") {
      let fiberFlags = Update;
      {
        fiberFlags |= LayoutStatic;
      }
      workInProgress2.flags |= fiberFlags;
    }
    return false;
  }
  if (typeof getDerivedStateFromProps === "function") {
    applyDerivedStateFromProps(workInProgress2, ctor, getDerivedStateFromProps, newProps);
    newState = workInProgress2.memoizedState;
  }
  const shouldUpdate = checkHasForceUpdateAfterProcessing() || checkShouldComponentUpdate(workInProgress2, ctor, oldProps, newProps, oldState, newState, nextContext);
  if (shouldUpdate) {
    if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillMount === "function" || typeof instance.componentWillMount === "function")) {
      if (typeof instance.componentWillMount === "function") {
        instance.componentWillMount();
      }
      if (typeof instance.UNSAFE_componentWillMount === "function") {
        instance.UNSAFE_componentWillMount();
      }
    }
    if (typeof instance.componentDidMount === "function") {
      let fiberFlags = Update;
      {
        fiberFlags |= LayoutStatic;
      }
      workInProgress2.flags |= fiberFlags;
    }
  } else {
    if (typeof instance.componentDidMount === "function") {
      let fiberFlags = Update;
      {
        fiberFlags |= LayoutStatic;
      }
      workInProgress2.flags |= fiberFlags;
    }
    workInProgress2.memoizedProps = newProps;
    workInProgress2.memoizedState = newState;
  }
  instance.props = newProps;
  instance.state = newState;
  instance.context = nextContext;
  return shouldUpdate;
}
__name(resumeMountClassInstance, "resumeMountClassInstance");
function updateClassInstance(current, workInProgress2, ctor, newProps, renderLanes2) {
  const instance = workInProgress2.stateNode;
  cloneUpdateQueue(current, workInProgress2);
  const unresolvedOldProps = workInProgress2.memoizedProps;
  const oldProps = workInProgress2.type === workInProgress2.elementType ? unresolvedOldProps : resolveDefaultProps(workInProgress2.type, unresolvedOldProps);
  instance.props = oldProps;
  const unresolvedNewProps = workInProgress2.pendingProps;
  const oldContext = instance.context;
  const contextType = ctor.contextType;
  let nextContext = emptyContextObject;
  if (typeof contextType === "object" && contextType !== null) {
    nextContext = readContext(contextType);
  } else {
    const nextUnmaskedContext = getUnmaskedContext(workInProgress2, ctor, true);
    nextContext = getMaskedContext(workInProgress2, nextUnmaskedContext);
  }
  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  const hasNewLifecycles = typeof getDerivedStateFromProps === "function" || typeof instance.getSnapshotBeforeUpdate === "function";
  if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillReceiveProps === "function" || typeof instance.componentWillReceiveProps === "function")) {
    if (unresolvedOldProps !== unresolvedNewProps || oldContext !== nextContext) {
      callComponentWillReceiveProps(workInProgress2, instance, newProps, nextContext);
    }
  }
  resetHasForceUpdateBeforeProcessing();
  const oldState = workInProgress2.memoizedState;
  let newState = instance.state = oldState;
  processUpdateQueue(workInProgress2, newProps, instance, renderLanes2);
  newState = workInProgress2.memoizedState;
  if (unresolvedOldProps === unresolvedNewProps && oldState === newState && !hasContextChanged() && !checkHasForceUpdateAfterProcessing() && !enableLazyContextPropagation) {
    if (typeof instance.componentDidUpdate === "function") {
      if (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress2.flags |= Update;
      }
    }
    if (typeof instance.getSnapshotBeforeUpdate === "function") {
      if (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress2.flags |= Snapshot;
      }
    }
    return false;
  }
  if (typeof getDerivedStateFromProps === "function") {
    applyDerivedStateFromProps(workInProgress2, ctor, getDerivedStateFromProps, newProps);
    newState = workInProgress2.memoizedState;
  }
  const shouldUpdate = checkHasForceUpdateAfterProcessing() || checkShouldComponentUpdate(workInProgress2, ctor, oldProps, newProps, oldState, newState, nextContext) || // TODO: In some cases, we'll end up checking if context has changed twice,
  // both before and after `shouldComponentUpdate` has been called. Not ideal,
  // but I'm loath to refactor this function. This only happens for memoized
  // components so it's not that common.
  enableLazyContextPropagation;
  if (shouldUpdate) {
    if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillUpdate === "function" || typeof instance.componentWillUpdate === "function")) {
      if (typeof instance.componentWillUpdate === "function") {
        instance.componentWillUpdate(newProps, newState, nextContext);
      }
      if (typeof instance.UNSAFE_componentWillUpdate === "function") {
        instance.UNSAFE_componentWillUpdate(newProps, newState, nextContext);
      }
    }
    if (typeof instance.componentDidUpdate === "function") {
      workInProgress2.flags |= Update;
    }
    if (typeof instance.getSnapshotBeforeUpdate === "function") {
      workInProgress2.flags |= Snapshot;
    }
  } else {
    if (typeof instance.componentDidUpdate === "function") {
      if (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress2.flags |= Update;
      }
    }
    if (typeof instance.getSnapshotBeforeUpdate === "function") {
      if (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress2.flags |= Snapshot;
      }
    }
    workInProgress2.memoizedProps = newProps;
    workInProgress2.memoizedState = newState;
  }
  instance.props = newProps;
  instance.state = newState;
  instance.context = nextContext;
  return shouldUpdate;
}
__name(updateClassInstance, "updateClassInstance");
function createCapturedValueAtFiber(value, source) {
  return {
    value,
    source,
    stack: getStackByFiberInDevAndProd(source),
    digest: null
  };
}
__name(createCapturedValueAtFiber, "createCapturedValueAtFiber");
function createCapturedValue(value, digest, stack) {
  return {
    value,
    source: null,
    stack: stack != null ? stack : null,
    digest: digest != null ? digest : null
  };
}
__name(createCapturedValue, "createCapturedValue");
function showErrorDialog(boundary, errorInfo) {
  return true;
}
__name(showErrorDialog, "showErrorDialog");
function logCapturedError(boundary, errorInfo) {
  try {
    const logError = showErrorDialog(boundary, errorInfo);
    if (logError === false) {
      return;
    }
    const error = errorInfo.value;
    if (false) {
      const source = errorInfo.source;
      const stack = errorInfo.stack;
      const componentStack = stack !== null ? stack : "";
      if (error != null && error._suppressLogging) {
        if (boundary.tag === ClassComponent) {
          return;
        }
        console["error"](error);
      }
      const componentName = source ? getComponentNameFromFiber(source) : null;
      const componentNameMessage = componentName ? "The above error occurred in the <" + componentName + "> component:" : "The above error occurred in one of your React components:";
      let errorBoundaryMessage;
      if (boundary.tag === HostRoot) {
        errorBoundaryMessage = "Consider adding an error boundary to your tree to customize error handling behavior.\nVisit https://reactjs.org/link/error-boundaries to learn more about error boundaries.";
      } else {
        const errorBoundaryName = getComponentNameFromFiber(boundary) || "Anonymous";
        errorBoundaryMessage = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + errorBoundaryName + ".");
      }
      const combinedMessage = componentNameMessage + "\n" + componentStack + "\n\n" + ("" + errorBoundaryMessage);
      console["error"](combinedMessage);
    } else {
      console["error"](error);
    }
  } catch (e) {
    setTimeout(() => {
      throw e;
    });
  }
}
__name(logCapturedError, "logCapturedError");
var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
function createRootErrorUpdate(fiber, errorInfo, lane) {
  const update = createUpdate(NoTimestamp, lane);
  update.tag = CaptureUpdate;
  update.payload = {
    element: null
  };
  const error = errorInfo.value;
  update.callback = () => {
    onUncaughtError(error);
    logCapturedError(fiber, errorInfo);
  };
  return update;
}
__name(createRootErrorUpdate, "createRootErrorUpdate");
function createClassErrorUpdate(fiber, errorInfo, lane) {
  const update = createUpdate(NoTimestamp, lane);
  update.tag = CaptureUpdate;
  const getDerivedStateFromError = fiber.type.getDerivedStateFromError;
  if (typeof getDerivedStateFromError === "function") {
    const error = errorInfo.value;
    update.payload = () => {
      return getDerivedStateFromError(error);
    };
    update.callback = () => {
      logCapturedError(fiber, errorInfo);
    };
  }
  const inst = fiber.stateNode;
  if (inst !== null && typeof inst.componentDidCatch === "function") {
    update.callback = /* @__PURE__ */ __name(function callback() {
      logCapturedError(fiber, errorInfo);
      if (typeof getDerivedStateFromError !== "function") {
        markLegacyErrorBoundaryAsFailed(this);
      }
      const error = errorInfo.value;
      const stack = errorInfo.stack;
      this.componentDidCatch(error, {
        componentStack: stack !== null ? stack : ""
      });
    }, "callback");
  }
  return update;
}
__name(createClassErrorUpdate, "createClassErrorUpdate");
function attachPingListener(root2, wakeable, lanes) {
  let pingCache = root2.pingCache;
  let threadIDs;
  if (pingCache === null) {
    pingCache = root2.pingCache = new PossiblyWeakMap();
    threadIDs = /* @__PURE__ */ new Set();
    pingCache.set(wakeable, threadIDs);
  } else {
    threadIDs = pingCache.get(wakeable);
    if (threadIDs === void 0) {
      threadIDs = /* @__PURE__ */ new Set();
      pingCache.set(wakeable, threadIDs);
    }
  }
  if (!threadIDs.has(lanes)) {
    threadIDs.add(lanes);
    const ping = pingSuspendedRoot.bind(null, root2, wakeable, lanes);
    wakeable.then(ping, ping);
  }
}
__name(attachPingListener, "attachPingListener");
function attachRetryListener(suspenseBoundary, root2, wakeable, lanes) {
  const wakeables = suspenseBoundary.updateQueue;
  if (wakeables === null) {
    const updateQueue = /* @__PURE__ */ new Set();
    updateQueue.add(wakeable);
    suspenseBoundary.updateQueue = updateQueue;
  } else {
    wakeables.add(wakeable);
  }
}
__name(attachRetryListener, "attachRetryListener");
function resetSuspendedComponent(sourceFiber, rootRenderLanes) {
  const tag = sourceFiber.tag;
  if ((sourceFiber.mode & ConcurrentMode) === NoMode && (tag === FunctionComponent || tag === ForwardRef || tag === SimpleMemoComponent)) {
    const currentSource = sourceFiber.alternate;
    if (currentSource) {
      sourceFiber.updateQueue = currentSource.updateQueue;
      sourceFiber.memoizedState = currentSource.memoizedState;
      sourceFiber.lanes = currentSource.lanes;
    } else {
      sourceFiber.updateQueue = null;
      sourceFiber.memoizedState = null;
    }
  }
}
__name(resetSuspendedComponent, "resetSuspendedComponent");
function getNearestSuspenseBoundaryToCapture(returnFiber) {
  let node = returnFiber;
  do {
    if (node.tag === SuspenseComponent && shouldCaptureSuspense(node)) {
      return node;
    }
    node = node.return;
  } while (node !== null);
  return null;
}
__name(getNearestSuspenseBoundaryToCapture, "getNearestSuspenseBoundaryToCapture");
function markSuspenseBoundaryShouldCapture(suspenseBoundary, returnFiber, sourceFiber, root2, rootRenderLanes) {
  if ((suspenseBoundary.mode & ConcurrentMode) === NoMode) {
    if (suspenseBoundary === returnFiber) {
      suspenseBoundary.flags |= ShouldCapture;
    } else {
      suspenseBoundary.flags |= DidCapture;
      sourceFiber.flags |= ForceUpdateForLegacySuspense;
      sourceFiber.flags &= ~(LifecycleEffectMask | Incomplete);
      if (sourceFiber.tag === ClassComponent) {
        const currentSourceFiber = sourceFiber.alternate;
        if (currentSourceFiber === null) {
          sourceFiber.tag = IncompleteClassComponent;
        } else {
          const update = createUpdate(NoTimestamp, SyncLane);
          update.tag = ForceUpdate;
          enqueueUpdate(sourceFiber, update, SyncLane);
        }
      }
      sourceFiber.lanes = mergeLanes(sourceFiber.lanes, SyncLane);
    }
    return suspenseBoundary;
  }
  suspenseBoundary.flags |= ShouldCapture;
  suspenseBoundary.lanes = rootRenderLanes;
  return suspenseBoundary;
}
__name(markSuspenseBoundaryShouldCapture, "markSuspenseBoundaryShouldCapture");
function throwException(root2, returnFiber, sourceFiber, value, rootRenderLanes) {
  sourceFiber.flags |= Incomplete;
  if (value !== null && typeof value === "object" && typeof value.then === "function") {
    const wakeable = value;
    resetSuspendedComponent(sourceFiber);
    const suspenseBoundary = getNearestSuspenseBoundaryToCapture(returnFiber);
    if (suspenseBoundary !== null) {
      suspenseBoundary.flags &= ~ForceClientRender;
      markSuspenseBoundaryShouldCapture(suspenseBoundary, returnFiber, sourceFiber, root2, rootRenderLanes);
      if (suspenseBoundary.mode & ConcurrentMode) {
        attachPingListener(root2, wakeable, rootRenderLanes);
      }
      attachRetryListener(suspenseBoundary, root2, wakeable);
      return;
    } else {
      if (!includesSyncLane(rootRenderLanes)) {
        attachPingListener(root2, wakeable, rootRenderLanes);
        renderDidSuspendDelayIfPossible();
        return;
      }
      const uncaughtSuspenseError = Error(formatProdErrorMessage(426));
      value = uncaughtSuspenseError;
    }
  } else {
    if (getIsHydrating() && sourceFiber.mode & ConcurrentMode) {
      const suspenseBoundary = getNearestSuspenseBoundaryToCapture(returnFiber);
      if (suspenseBoundary !== null) {
        if ((suspenseBoundary.flags & ShouldCapture) === NoFlags) {
          suspenseBoundary.flags |= ForceClientRender;
        }
        markSuspenseBoundaryShouldCapture(suspenseBoundary, returnFiber, sourceFiber, root2, rootRenderLanes);
        queueHydrationError(createCapturedValueAtFiber(value, sourceFiber));
        return;
      }
    }
  }
  value = createCapturedValueAtFiber(value, sourceFiber);
  renderDidError(value);
  let workInProgress2 = returnFiber;
  do {
    switch (workInProgress2.tag) {
      case HostRoot: {
        const errorInfo2 = value;
        workInProgress2.flags |= ShouldCapture;
        const lane = pickArbitraryLane(rootRenderLanes);
        workInProgress2.lanes = mergeLanes(workInProgress2.lanes, lane);
        const update = createRootErrorUpdate(workInProgress2, errorInfo2, lane);
        enqueueCapturedUpdate(workInProgress2, update);
        return;
      }
      case ClassComponent:
        const errorInfo = value;
        const ctor = workInProgress2.type;
        const instance = workInProgress2.stateNode;
        if ((workInProgress2.flags & DidCapture) === NoFlags && (typeof ctor.getDerivedStateFromError === "function" || instance !== null && typeof instance.componentDidCatch === "function" && !isAlreadyFailedLegacyErrorBoundary(instance))) {
          workInProgress2.flags |= ShouldCapture;
          const lane = pickArbitraryLane(rootRenderLanes);
          workInProgress2.lanes = mergeLanes(workInProgress2.lanes, lane);
          const update = createClassErrorUpdate(workInProgress2, errorInfo, lane);
          enqueueCapturedUpdate(workInProgress2, update);
          return;
        }
        break;
    }
    workInProgress2 = workInProgress2.return;
  } while (workInProgress2 !== null);
}
__name(throwException, "throwException");
var resumedCache = createCursor(null);
function peekCacheFromPool() {
  const cacheResumedFromPreviousRender = resumedCache.current;
  if (cacheResumedFromPreviousRender !== null) {
    return cacheResumedFromPreviousRender;
  }
  const root2 = getWorkInProgressRoot();
  const cacheFromRootCachePool = root2.pooledCache;
  return cacheFromRootCachePool;
}
__name(peekCacheFromPool, "peekCacheFromPool");
function requestCacheFromPool(renderLanes2) {
  const cacheFromPool = peekCacheFromPool();
  if (cacheFromPool !== null) {
    return cacheFromPool;
  }
  const root2 = getWorkInProgressRoot();
  const freshCache = createCache();
  root2.pooledCache = freshCache;
  retainCache(freshCache);
  if (freshCache !== null) {
    root2.pooledCacheLanes |= renderLanes2;
  }
  return freshCache;
}
__name(requestCacheFromPool, "requestCacheFromPool");
function pushTransition(offscreenWorkInProgress, prevCachePool, newTransitions) {
  {
    if (prevCachePool === null) {
      push2(resumedCache, resumedCache.current);
    } else {
      push2(resumedCache, prevCachePool.pool);
    }
  }
}
__name(pushTransition, "pushTransition");
function popTransition(workInProgress2, current) {
  if (current !== null) {
    {
      pop2(resumedCache);
    }
  }
}
__name(popTransition, "popTransition");
function getSuspendedCache() {
  const cacheFromPool = peekCacheFromPool();
  if (cacheFromPool === null) {
    return null;
  }
  return {
    // We must also save the parent, so that when we resume we can detect
    // a refresh.
    parent: CacheContext._currentValue,
    pool: cacheFromPool
  };
}
__name(getSuspendedCache, "getSuspendedCache");
function getOffscreenDeferredCache() {
  const cacheFromPool = peekCacheFromPool();
  if (cacheFromPool === null) {
    return null;
  }
  return {
    // We must also store the parent, so that when we resume we can detect
    // a refresh.
    parent: CacheContext._currentValue,
    pool: cacheFromPool
  };
}
__name(getOffscreenDeferredCache, "getOffscreenDeferredCache");
var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
var didReceiveUpdate = false;
function reconcileChildren(current, workInProgress2, nextChildren, renderLanes2) {
  if (current === null) {
    workInProgress2.child = mountChildFibers(workInProgress2, null, nextChildren, renderLanes2);
  } else {
    workInProgress2.child = reconcileChildFibers(workInProgress2, current.child, nextChildren, renderLanes2);
  }
}
__name(reconcileChildren, "reconcileChildren");
function forceUnmountCurrentAndReconcile(current, workInProgress2, nextChildren, renderLanes2) {
  workInProgress2.child = reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
  workInProgress2.child = reconcileChildFibers(workInProgress2, null, nextChildren, renderLanes2);
}
__name(forceUnmountCurrentAndReconcile, "forceUnmountCurrentAndReconcile");
function updateForwardRef(current, workInProgress2, Component, nextProps, renderLanes2) {
  const render2 = Component.render;
  const ref = workInProgress2.ref;
  let nextChildren;
  let hasId;
  prepareToReadContext(workInProgress2, renderLanes2);
  {
    nextChildren = renderWithHooks(current, workInProgress2, render2, nextProps, ref, renderLanes2);
    hasId = checkDidRenderIdHook();
  }
  if (current !== null && !didReceiveUpdate) {
    bailoutHooks(current, workInProgress2, renderLanes2);
    return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
  }
  if (getIsHydrating() && hasId) {
    pushMaterializedTreeId(workInProgress2);
  }
  workInProgress2.flags |= PerformedWork;
  reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
  return workInProgress2.child;
}
__name(updateForwardRef, "updateForwardRef");
function updateMemoComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
  if (current === null) {
    const type = Component.type;
    if (isSimpleFunctionComponent(type) && Component.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
    Component.defaultProps === void 0) {
      let resolvedType = type;
      workInProgress2.tag = SimpleMemoComponent;
      workInProgress2.type = resolvedType;
      return updateSimpleMemoComponent(current, workInProgress2, resolvedType, nextProps, renderLanes2);
    }
    const child = createFiberFromTypeAndProps(Component.type, null, nextProps, workInProgress2, workInProgress2.mode, renderLanes2);
    child.ref = workInProgress2.ref;
    child.return = workInProgress2;
    workInProgress2.child = child;
    return child;
  }
  const currentChild = current.child;
  const hasScheduledUpdateOrContext = checkScheduledUpdateOrContext(current, renderLanes2);
  if (!hasScheduledUpdateOrContext) {
    const prevProps = currentChild.memoizedProps;
    let compare2 = Component.compare;
    compare2 = compare2 !== null ? compare2 : shallowEqual;
    if (compare2(prevProps, nextProps) && current.ref === workInProgress2.ref) {
      return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    }
  }
  workInProgress2.flags |= PerformedWork;
  const newChild = createWorkInProgress(currentChild, nextProps);
  newChild.ref = workInProgress2.ref;
  newChild.return = workInProgress2;
  workInProgress2.child = newChild;
  return newChild;
}
__name(updateMemoComponent, "updateMemoComponent");
function updateSimpleMemoComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
  if (current !== null) {
    const prevProps = current.memoizedProps;
    if (shallowEqual(prevProps, nextProps) && current.ref === workInProgress2.ref && // Prevent bailout if the implementation changed due to hot reload.
    true) {
      didReceiveUpdate = false;
      workInProgress2.pendingProps = nextProps = prevProps;
      if (!checkScheduledUpdateOrContext(current, renderLanes2)) {
        workInProgress2.lanes = current.lanes;
        return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
      } else if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
        didReceiveUpdate = true;
      }
    }
  }
  return updateFunctionComponent(current, workInProgress2, Component, nextProps, renderLanes2);
}
__name(updateSimpleMemoComponent, "updateSimpleMemoComponent");
function updateOffscreenComponent(current, workInProgress2, renderLanes2) {
  const nextProps = workInProgress2.pendingProps;
  const nextChildren = nextProps.children;
  const prevState = current !== null ? current.memoizedState : null;
  if (nextProps.mode === "hidden" || enableLegacyHidden) {
    if ((workInProgress2.mode & ConcurrentMode) === NoMode) {
      const nextState = {
        baseLanes: NoLanes,
        cachePool: null,
        transitions: null
      };
      workInProgress2.memoizedState = nextState;
      {
        if (current !== null) {
          pushTransition(workInProgress2, null);
        }
      }
      pushRenderLanes(workInProgress2, renderLanes2);
    } else if (!includesSomeLane(renderLanes2, OffscreenLane)) {
      let spawnedCachePool = null;
      let nextBaseLanes;
      if (prevState !== null) {
        const prevBaseLanes = prevState.baseLanes;
        nextBaseLanes = mergeLanes(prevBaseLanes, renderLanes2);
        {
          spawnedCachePool = getOffscreenDeferredCache();
        }
      } else {
        nextBaseLanes = renderLanes2;
      }
      workInProgress2.lanes = workInProgress2.childLanes = laneToLanes(OffscreenLane);
      const nextState = {
        baseLanes: nextBaseLanes,
        cachePool: spawnedCachePool,
        transitions: null
      };
      workInProgress2.memoizedState = nextState;
      workInProgress2.updateQueue = null;
      {
        if (current !== null) {
          pushTransition(workInProgress2, null);
        }
      }
      pushRenderLanes(workInProgress2, nextBaseLanes);
      return null;
    } else {
      const nextState = {
        baseLanes: NoLanes,
        cachePool: null,
        transitions: null
      };
      workInProgress2.memoizedState = nextState;
      const subtreeRenderLanes2 = prevState !== null ? prevState.baseLanes : renderLanes2;
      if (current !== null) {
        const prevCachePool = prevState !== null ? prevState.cachePool : null;
        pushTransition(workInProgress2, prevCachePool);
      }
      pushRenderLanes(workInProgress2, subtreeRenderLanes2);
    }
  } else {
    let subtreeRenderLanes2;
    if (prevState !== null) {
      subtreeRenderLanes2 = mergeLanes(prevState.baseLanes, renderLanes2);
      let prevCachePool = null;
      {
        prevCachePool = prevState.cachePool;
      }
      pushTransition(workInProgress2, prevCachePool);
      workInProgress2.memoizedState = null;
    } else {
      subtreeRenderLanes2 = renderLanes2;
      {
        if (current !== null) {
          pushTransition(workInProgress2, null);
        }
      }
    }
    pushRenderLanes(workInProgress2, subtreeRenderLanes2);
  }
  reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
  return workInProgress2.child;
}
__name(updateOffscreenComponent, "updateOffscreenComponent");
function updateCacheComponent(current, workInProgress2, renderLanes2) {
  prepareToReadContext(workInProgress2, renderLanes2);
  const parentCache = readContext(CacheContext);
  if (current === null) {
    const freshCache = requestCacheFromPool(renderLanes2);
    const initialState = {
      parent: parentCache,
      cache: freshCache
    };
    workInProgress2.memoizedState = initialState;
    initializeUpdateQueue(workInProgress2);
    pushCacheProvider(workInProgress2, freshCache);
  } else {
    if (includesSomeLane(current.lanes, renderLanes2)) {
      cloneUpdateQueue(current, workInProgress2);
      processUpdateQueue(workInProgress2, null, null, renderLanes2);
    }
    const prevState = current.memoizedState;
    const nextState = workInProgress2.memoizedState;
    if (prevState.parent !== parentCache) {
      const derivedState = {
        parent: parentCache,
        cache: parentCache
      };
      workInProgress2.memoizedState = derivedState;
      if (workInProgress2.lanes === NoLanes) {
        const updateQueue = workInProgress2.updateQueue;
        workInProgress2.memoizedState = updateQueue.baseState = derivedState;
      }
      pushCacheProvider(workInProgress2, parentCache);
    } else {
      const nextCache = nextState.cache;
      pushCacheProvider(workInProgress2, nextCache);
      if (nextCache !== prevState.cache) {
        propagateContextChange(workInProgress2, CacheContext, renderLanes2);
      }
    }
  }
  const nextChildren = workInProgress2.pendingProps.children;
  reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
  return workInProgress2.child;
}
__name(updateCacheComponent, "updateCacheComponent");
function updateFragment(current, workInProgress2, renderLanes2) {
  const nextChildren = workInProgress2.pendingProps;
  reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
  return workInProgress2.child;
}
__name(updateFragment, "updateFragment");
function updateMode(current, workInProgress2, renderLanes2) {
  const nextChildren = workInProgress2.pendingProps.children;
  reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
  return workInProgress2.child;
}
__name(updateMode, "updateMode");
function updateProfiler(current, workInProgress2, renderLanes2) {
  const nextProps = workInProgress2.pendingProps;
  const nextChildren = nextProps.children;
  reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
  return workInProgress2.child;
}
__name(updateProfiler, "updateProfiler");
function markRef(current, workInProgress2) {
  const ref = workInProgress2.ref;
  if (current === null && ref !== null || current !== null && current.ref !== ref) {
    workInProgress2.flags |= Ref;
    {
      workInProgress2.flags |= RefStatic;
    }
  }
}
__name(markRef, "markRef");
function updateFunctionComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
  let context;
  {
    const unmaskedContext = getUnmaskedContext(workInProgress2, Component, true);
    context = getMaskedContext(workInProgress2, unmaskedContext);
  }
  let nextChildren;
  let hasId;
  prepareToReadContext(workInProgress2, renderLanes2);
  {
    nextChildren = renderWithHooks(current, workInProgress2, Component, nextProps, context, renderLanes2);
    hasId = checkDidRenderIdHook();
  }
  if (current !== null && !didReceiveUpdate) {
    bailoutHooks(current, workInProgress2, renderLanes2);
    return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
  }
  if (getIsHydrating() && hasId) {
    pushMaterializedTreeId(workInProgress2);
  }
  workInProgress2.flags |= PerformedWork;
  reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
  return workInProgress2.child;
}
__name(updateFunctionComponent, "updateFunctionComponent");
function updateClassComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
  let hasContext;
  if (isContextProvider(Component)) {
    hasContext = true;
    pushContextProvider(workInProgress2);
  } else {
    hasContext = false;
  }
  prepareToReadContext(workInProgress2, renderLanes2);
  const instance = workInProgress2.stateNode;
  let shouldUpdate;
  if (instance === null) {
    resetSuspendedCurrentOnMountInLegacyMode(current, workInProgress2);
    constructClassInstance(workInProgress2, Component, nextProps);
    mountClassInstance(workInProgress2, Component, nextProps, renderLanes2);
    shouldUpdate = true;
  } else if (current === null) {
    shouldUpdate = resumeMountClassInstance(workInProgress2, Component, nextProps, renderLanes2);
  } else {
    shouldUpdate = updateClassInstance(current, workInProgress2, Component, nextProps, renderLanes2);
  }
  const nextUnitOfWork = finishClassComponent(current, workInProgress2, Component, shouldUpdate, hasContext, renderLanes2);
  return nextUnitOfWork;
}
__name(updateClassComponent, "updateClassComponent");
function finishClassComponent(current, workInProgress2, Component, shouldUpdate, hasContext, renderLanes2) {
  markRef(current, workInProgress2);
  const didCaptureError = (workInProgress2.flags & DidCapture) !== NoFlags;
  if (!shouldUpdate && !didCaptureError) {
    if (hasContext) {
      invalidateContextProvider(workInProgress2, Component, false);
    }
    return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
  }
  const instance = workInProgress2.stateNode;
  ReactCurrentOwner$1.current = workInProgress2;
  let nextChildren;
  if (didCaptureError && typeof Component.getDerivedStateFromError !== "function") {
    nextChildren = null;
  } else {
    {
      nextChildren = instance.render();
    }
  }
  workInProgress2.flags |= PerformedWork;
  if (current !== null && didCaptureError) {
    forceUnmountCurrentAndReconcile(current, workInProgress2, nextChildren, renderLanes2);
  } else {
    reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
  }
  workInProgress2.memoizedState = instance.state;
  if (hasContext) {
    invalidateContextProvider(workInProgress2, Component, true);
  }
  return workInProgress2.child;
}
__name(finishClassComponent, "finishClassComponent");
function pushHostRootContext(workInProgress2) {
  const root2 = workInProgress2.stateNode;
  if (root2.pendingContext) {
    pushTopLevelContextObject(workInProgress2, root2.pendingContext, root2.pendingContext !== root2.context);
  } else if (root2.context) {
    pushTopLevelContextObject(workInProgress2, root2.context, false);
  }
  pushHostContainer(workInProgress2, root2.containerInfo);
}
__name(pushHostRootContext, "pushHostRootContext");
function updateHostRoot(current, workInProgress2, renderLanes2) {
  pushHostRootContext(workInProgress2);
  if (current === null) {
    throw Error(formatProdErrorMessage(387));
  }
  const nextProps = workInProgress2.pendingProps;
  const prevState = workInProgress2.memoizedState;
  const prevChildren = prevState.element;
  cloneUpdateQueue(current, workInProgress2);
  processUpdateQueue(workInProgress2, nextProps, null, renderLanes2);
  const nextState = workInProgress2.memoizedState;
  const root2 = workInProgress2.stateNode;
  {
    const nextCache = nextState.cache;
    pushCacheProvider(workInProgress2, nextCache);
    if (nextCache !== prevState.cache) {
      propagateContextChange(workInProgress2, CacheContext, renderLanes2);
    }
  }
  const nextChildren = nextState.element;
  if (prevState.isDehydrated) {
    const overrideState = {
      element: nextChildren,
      isDehydrated: false,
      cache: nextState.cache,
      pendingSuspenseBoundaries: nextState.pendingSuspenseBoundaries,
      transitions: nextState.transitions
    };
    const updateQueue = workInProgress2.updateQueue;
    updateQueue.baseState = overrideState;
    workInProgress2.memoizedState = overrideState;
    if (workInProgress2.flags & ForceClientRender) {
      const recoverableError = createCapturedValueAtFiber(Error(formatProdErrorMessage(423)), workInProgress2);
      return mountHostRootWithoutHydrating(current, workInProgress2, nextChildren, renderLanes2, recoverableError);
    } else if (nextChildren !== prevChildren) {
      const recoverableError = createCapturedValueAtFiber(Error(formatProdErrorMessage(424)), workInProgress2);
      return mountHostRootWithoutHydrating(current, workInProgress2, nextChildren, renderLanes2, recoverableError);
    } else {
      enterHydrationState(workInProgress2);
      const child = mountChildFibers(workInProgress2, null, nextChildren, renderLanes2);
      workInProgress2.child = child;
      let node = child;
      while (node) {
        node.flags = node.flags & ~Placement | Hydrating;
        node = node.sibling;
      }
    }
  } else {
    resetHydrationState();
    if (nextChildren === prevChildren) {
      return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    }
    reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
  }
  return workInProgress2.child;
}
__name(updateHostRoot, "updateHostRoot");
function mountHostRootWithoutHydrating(current, workInProgress2, nextChildren, renderLanes2, recoverableError) {
  resetHydrationState();
  queueHydrationError(recoverableError);
  workInProgress2.flags |= ForceClientRender;
  reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
  return workInProgress2.child;
}
__name(mountHostRootWithoutHydrating, "mountHostRootWithoutHydrating");
function updateHostComponent(current, workInProgress2, renderLanes2) {
  pushHostContext(workInProgress2);
  if (current === null) {
    tryToClaimNextHydratableInstance(workInProgress2);
  }
  const type = workInProgress2.type;
  const nextProps = workInProgress2.pendingProps;
  const prevProps = current !== null ? current.memoizedProps : null;
  let nextChildren = nextProps.children;
  const isDirectTextChild = shouldSetTextContent(type, nextProps);
  if (isDirectTextChild) {
    nextChildren = null;
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    workInProgress2.flags |= ContentReset;
  }
  markRef(current, workInProgress2);
  reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
  return workInProgress2.child;
}
__name(updateHostComponent, "updateHostComponent");
function updateHostText(current, workInProgress2) {
  if (current === null) {
    tryToClaimNextHydratableInstance(workInProgress2);
  }
  return null;
}
__name(updateHostText, "updateHostText");
function mountLazyComponent(_current, workInProgress2, elementType, renderLanes2) {
  resetSuspendedCurrentOnMountInLegacyMode(_current, workInProgress2);
  const props = workInProgress2.pendingProps;
  const lazyComponent = elementType;
  const payload = lazyComponent._payload;
  const init = lazyComponent._init;
  let Component = init(payload);
  workInProgress2.type = Component;
  const resolvedTag = workInProgress2.tag = resolveLazyComponentTag(Component);
  const resolvedProps = resolveDefaultProps(Component, props);
  let child;
  switch (resolvedTag) {
    case FunctionComponent: {
      child = updateFunctionComponent(null, workInProgress2, Component, resolvedProps, renderLanes2);
      return child;
    }
    case ClassComponent: {
      child = updateClassComponent(null, workInProgress2, Component, resolvedProps, renderLanes2);
      return child;
    }
    case ForwardRef: {
      child = updateForwardRef(null, workInProgress2, Component, resolvedProps, renderLanes2);
      return child;
    }
    case MemoComponent: {
      child = updateMemoComponent(
        null,
        workInProgress2,
        Component,
        resolveDefaultProps(Component.type, resolvedProps),
        // The inner type can have defaults too
        renderLanes2
      );
      return child;
    }
  }
  let hint = "";
  throw Error(formatProdErrorMessage(306, Component, hint));
}
__name(mountLazyComponent, "mountLazyComponent");
function mountIncompleteClassComponent(_current, workInProgress2, Component, nextProps, renderLanes2) {
  resetSuspendedCurrentOnMountInLegacyMode(_current, workInProgress2);
  workInProgress2.tag = ClassComponent;
  let hasContext;
  if (isContextProvider(Component)) {
    hasContext = true;
    pushContextProvider(workInProgress2);
  } else {
    hasContext = false;
  }
  prepareToReadContext(workInProgress2, renderLanes2);
  constructClassInstance(workInProgress2, Component, nextProps);
  mountClassInstance(workInProgress2, Component, nextProps, renderLanes2);
  return finishClassComponent(null, workInProgress2, Component, true, hasContext, renderLanes2);
}
__name(mountIncompleteClassComponent, "mountIncompleteClassComponent");
function mountIndeterminateComponent(_current, workInProgress2, Component, renderLanes2) {
  resetSuspendedCurrentOnMountInLegacyMode(_current, workInProgress2);
  const props = workInProgress2.pendingProps;
  let context;
  {
    const unmaskedContext = getUnmaskedContext(workInProgress2, Component, false);
    context = getMaskedContext(workInProgress2, unmaskedContext);
  }
  prepareToReadContext(workInProgress2, renderLanes2);
  let value;
  let hasId;
  {
    value = renderWithHooks(null, workInProgress2, Component, props, context, renderLanes2);
    hasId = checkDidRenderIdHook();
  }
  workInProgress2.flags |= PerformedWork;
  if (
    // Run these checks in production only if the flag is off.
    // Eventually we'll delete this branch altogether.
    typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0
  ) {
    workInProgress2.tag = ClassComponent;
    workInProgress2.memoizedState = null;
    workInProgress2.updateQueue = null;
    let hasContext = false;
    if (isContextProvider(Component)) {
      hasContext = true;
      pushContextProvider(workInProgress2);
    } else {
      hasContext = false;
    }
    workInProgress2.memoizedState = value.state !== null && value.state !== void 0 ? value.state : null;
    initializeUpdateQueue(workInProgress2);
    adoptClassInstance(workInProgress2, value);
    mountClassInstance(workInProgress2, Component, props, renderLanes2);
    return finishClassComponent(null, workInProgress2, Component, true, hasContext, renderLanes2);
  } else {
    workInProgress2.tag = FunctionComponent;
    if (getIsHydrating() && hasId) {
      pushMaterializedTreeId(workInProgress2);
    }
    reconcileChildren(null, workInProgress2, value, renderLanes2);
    return workInProgress2.child;
  }
}
__name(mountIndeterminateComponent, "mountIndeterminateComponent");
var SUSPENDED_MARKER = {
  dehydrated: null,
  treeContext: null,
  retryLane: NoLane
};
function mountSuspenseOffscreenState(renderLanes2) {
  return {
    baseLanes: renderLanes2,
    cachePool: getSuspendedCache(),
    transitions: null
  };
}
__name(mountSuspenseOffscreenState, "mountSuspenseOffscreenState");
function updateSuspenseOffscreenState(prevOffscreenState, renderLanes2) {
  let cachePool = null;
  {
    const prevCachePool = prevOffscreenState.cachePool;
    if (prevCachePool !== null) {
      const parentCache = CacheContext._currentValue;
      if (prevCachePool.parent !== parentCache) {
        cachePool = {
          parent: parentCache,
          pool: parentCache
        };
      } else {
        cachePool = prevCachePool;
      }
    } else {
      cachePool = getSuspendedCache();
    }
  }
  return {
    baseLanes: mergeLanes(prevOffscreenState.baseLanes, renderLanes2),
    cachePool,
    transitions: prevOffscreenState.transitions
  };
}
__name(updateSuspenseOffscreenState, "updateSuspenseOffscreenState");
function shouldRemainOnFallback(suspenseContext, current, workInProgress2, renderLanes2) {
  if (current !== null) {
    const suspenseState = current.memoizedState;
    if (suspenseState === null) {
      return false;
    }
  }
  return hasSuspenseContext(suspenseContext, ForceSuspenseFallback);
}
__name(shouldRemainOnFallback, "shouldRemainOnFallback");
function getRemainingWorkInPrimaryTree(current, renderLanes2) {
  return removeLanes(current.childLanes, renderLanes2);
}
__name(getRemainingWorkInPrimaryTree, "getRemainingWorkInPrimaryTree");
function updateSuspenseComponent(current, workInProgress2, renderLanes2) {
  const nextProps = workInProgress2.pendingProps;
  let suspenseContext = suspenseStackCursor.current;
  let showFallback = false;
  const didSuspend = (workInProgress2.flags & DidCapture) !== NoFlags;
  if (didSuspend || shouldRemainOnFallback(suspenseContext, current)) {
    showFallback = true;
    workInProgress2.flags &= ~DidCapture;
  } else {
    if (current === null || current.memoizedState !== null) {
      {
        suspenseContext = addSubtreeSuspenseContext(suspenseContext, InvisibleParentSuspenseContext);
      }
    }
  }
  suspenseContext = setDefaultShallowSuspenseContext(suspenseContext);
  pushSuspenseContext(workInProgress2, suspenseContext);
  if (current === null) {
    tryToClaimNextHydratableInstance(workInProgress2);
    const suspenseState = workInProgress2.memoizedState;
    if (suspenseState !== null) {
      const dehydrated = suspenseState.dehydrated;
      if (dehydrated !== null) {
        return mountDehydratedSuspenseComponent(workInProgress2, dehydrated);
      }
    }
    const nextPrimaryChildren = nextProps.children;
    const nextFallbackChildren = nextProps.fallback;
    if (showFallback) {
      const fallbackFragment = mountSuspenseFallbackChildren(workInProgress2, nextPrimaryChildren, nextFallbackChildren, renderLanes2);
      const primaryChildFragment = workInProgress2.child;
      primaryChildFragment.memoizedState = mountSuspenseOffscreenState(renderLanes2);
      workInProgress2.memoizedState = SUSPENDED_MARKER;
      return fallbackFragment;
    } else if (typeof nextProps.unstable_expectedLoadTime === "number") {
      const fallbackFragment = mountSuspenseFallbackChildren(workInProgress2, nextPrimaryChildren, nextFallbackChildren, renderLanes2);
      const primaryChildFragment = workInProgress2.child;
      primaryChildFragment.memoizedState = mountSuspenseOffscreenState(renderLanes2);
      workInProgress2.memoizedState = SUSPENDED_MARKER;
      workInProgress2.lanes = SomeRetryLane;
      return fallbackFragment;
    } else {
      return mountSuspensePrimaryChildren(workInProgress2, nextPrimaryChildren);
    }
  } else {
    const prevState = current.memoizedState;
    if (prevState !== null) {
      const dehydrated = prevState.dehydrated;
      if (dehydrated !== null) {
        return updateDehydratedSuspenseComponent(current, workInProgress2, didSuspend, nextProps, dehydrated, prevState, renderLanes2);
      }
    }
    if (showFallback) {
      const nextFallbackChildren = nextProps.fallback;
      const nextPrimaryChildren = nextProps.children;
      const fallbackChildFragment = updateSuspenseFallbackChildren(current, workInProgress2, nextPrimaryChildren, nextFallbackChildren, renderLanes2);
      const primaryChildFragment = workInProgress2.child;
      const prevOffscreenState = current.child.memoizedState;
      primaryChildFragment.memoizedState = prevOffscreenState === null ? mountSuspenseOffscreenState(renderLanes2) : updateSuspenseOffscreenState(prevOffscreenState, renderLanes2);
      primaryChildFragment.childLanes = getRemainingWorkInPrimaryTree(current, renderLanes2);
      workInProgress2.memoizedState = SUSPENDED_MARKER;
      return fallbackChildFragment;
    } else {
      const nextPrimaryChildren = nextProps.children;
      const primaryChildFragment = updateSuspensePrimaryChildren(current, workInProgress2, nextPrimaryChildren, renderLanes2);
      workInProgress2.memoizedState = null;
      return primaryChildFragment;
    }
  }
}
__name(updateSuspenseComponent, "updateSuspenseComponent");
function mountSuspensePrimaryChildren(workInProgress2, primaryChildren, renderLanes2) {
  const mode = workInProgress2.mode;
  const primaryChildProps = {
    mode: "visible",
    children: primaryChildren
  };
  const primaryChildFragment = mountWorkInProgressOffscreenFiber(primaryChildProps, mode);
  primaryChildFragment.return = workInProgress2;
  workInProgress2.child = primaryChildFragment;
  return primaryChildFragment;
}
__name(mountSuspensePrimaryChildren, "mountSuspensePrimaryChildren");
function mountSuspenseFallbackChildren(workInProgress2, primaryChildren, fallbackChildren, renderLanes2) {
  const mode = workInProgress2.mode;
  const progressedPrimaryFragment = workInProgress2.child;
  const primaryChildProps = {
    mode: "hidden",
    children: primaryChildren
  };
  let primaryChildFragment;
  let fallbackChildFragment;
  if ((mode & ConcurrentMode) === NoMode && progressedPrimaryFragment !== null) {
    primaryChildFragment = progressedPrimaryFragment;
    primaryChildFragment.childLanes = NoLanes;
    primaryChildFragment.pendingProps = primaryChildProps;
    fallbackChildFragment = createFiberFromFragment(fallbackChildren, mode, renderLanes2, null);
  } else {
    primaryChildFragment = mountWorkInProgressOffscreenFiber(primaryChildProps, mode);
    fallbackChildFragment = createFiberFromFragment(fallbackChildren, mode, renderLanes2, null);
  }
  primaryChildFragment.return = workInProgress2;
  fallbackChildFragment.return = workInProgress2;
  primaryChildFragment.sibling = fallbackChildFragment;
  workInProgress2.child = primaryChildFragment;
  return fallbackChildFragment;
}
__name(mountSuspenseFallbackChildren, "mountSuspenseFallbackChildren");
function mountWorkInProgressOffscreenFiber(offscreenProps, mode, renderLanes2) {
  return createFiberFromOffscreen(offscreenProps, mode, NoLanes, null);
}
__name(mountWorkInProgressOffscreenFiber, "mountWorkInProgressOffscreenFiber");
function updateWorkInProgressOffscreenFiber(current, offscreenProps) {
  return createWorkInProgress(current, offscreenProps);
}
__name(updateWorkInProgressOffscreenFiber, "updateWorkInProgressOffscreenFiber");
function updateSuspensePrimaryChildren(current, workInProgress2, primaryChildren, renderLanes2) {
  const currentPrimaryChildFragment = current.child;
  const currentFallbackChildFragment = currentPrimaryChildFragment.sibling;
  const primaryChildFragment = updateWorkInProgressOffscreenFiber(currentPrimaryChildFragment, {
    mode: "visible",
    children: primaryChildren
  });
  if ((workInProgress2.mode & ConcurrentMode) === NoMode) {
    primaryChildFragment.lanes = renderLanes2;
  }
  primaryChildFragment.return = workInProgress2;
  primaryChildFragment.sibling = null;
  if (currentFallbackChildFragment !== null) {
    const deletions = workInProgress2.deletions;
    if (deletions === null) {
      workInProgress2.deletions = [currentFallbackChildFragment];
      workInProgress2.flags |= ChildDeletion;
    } else {
      deletions.push(currentFallbackChildFragment);
    }
  }
  workInProgress2.child = primaryChildFragment;
  return primaryChildFragment;
}
__name(updateSuspensePrimaryChildren, "updateSuspensePrimaryChildren");
function updateSuspenseFallbackChildren(current, workInProgress2, primaryChildren, fallbackChildren, renderLanes2) {
  const mode = workInProgress2.mode;
  const currentPrimaryChildFragment = current.child;
  const currentFallbackChildFragment = currentPrimaryChildFragment.sibling;
  const primaryChildProps = {
    mode: "hidden",
    children: primaryChildren
  };
  let primaryChildFragment;
  if (
    // In legacy mode, we commit the primary tree as if it successfully
    // completed, even though it's in an inconsistent state.
    (mode & ConcurrentMode) === NoMode && // Make sure we're on the second pass, i.e. the primary child fragment was
    // already cloned. In legacy mode, the only case where this isn't true is
    // when DevTools forces us to display a fallback; we skip the first render
    // pass entirely and go straight to rendering the fallback. (In Concurrent
    // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
    // only codepath.)
    workInProgress2.child !== currentPrimaryChildFragment
  ) {
    const progressedPrimaryFragment = workInProgress2.child;
    primaryChildFragment = progressedPrimaryFragment;
    primaryChildFragment.childLanes = NoLanes;
    primaryChildFragment.pendingProps = primaryChildProps;
    workInProgress2.deletions = null;
  } else {
    primaryChildFragment = updateWorkInProgressOffscreenFiber(currentPrimaryChildFragment, primaryChildProps);
    primaryChildFragment.subtreeFlags = currentPrimaryChildFragment.subtreeFlags & StaticMask;
  }
  let fallbackChildFragment;
  if (currentFallbackChildFragment !== null) {
    fallbackChildFragment = createWorkInProgress(currentFallbackChildFragment, fallbackChildren);
  } else {
    fallbackChildFragment = createFiberFromFragment(fallbackChildren, mode, renderLanes2, null);
    fallbackChildFragment.flags |= Placement;
  }
  fallbackChildFragment.return = workInProgress2;
  primaryChildFragment.return = workInProgress2;
  primaryChildFragment.sibling = fallbackChildFragment;
  workInProgress2.child = primaryChildFragment;
  return fallbackChildFragment;
}
__name(updateSuspenseFallbackChildren, "updateSuspenseFallbackChildren");
function retrySuspenseComponentWithoutHydrating(current, workInProgress2, renderLanes2, recoverableError) {
  if (recoverableError !== null) {
    queueHydrationError(recoverableError);
  }
  reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
  const nextProps = workInProgress2.pendingProps;
  const primaryChildren = nextProps.children;
  const primaryChildFragment = mountSuspensePrimaryChildren(workInProgress2, primaryChildren);
  primaryChildFragment.flags |= Placement;
  workInProgress2.memoizedState = null;
  return primaryChildFragment;
}
__name(retrySuspenseComponentWithoutHydrating, "retrySuspenseComponentWithoutHydrating");
function mountSuspenseFallbackAfterRetryWithoutHydrating(current, workInProgress2, primaryChildren, fallbackChildren, renderLanes2) {
  const fiberMode = workInProgress2.mode;
  const primaryChildProps = {
    mode: "visible",
    children: primaryChildren
  };
  const primaryChildFragment = mountWorkInProgressOffscreenFiber(primaryChildProps, fiberMode);
  const fallbackChildFragment = createFiberFromFragment(fallbackChildren, fiberMode, renderLanes2, null);
  fallbackChildFragment.flags |= Placement;
  primaryChildFragment.return = workInProgress2;
  fallbackChildFragment.return = workInProgress2;
  primaryChildFragment.sibling = fallbackChildFragment;
  workInProgress2.child = primaryChildFragment;
  if ((workInProgress2.mode & ConcurrentMode) !== NoMode) {
    reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
  }
  return fallbackChildFragment;
}
__name(mountSuspenseFallbackAfterRetryWithoutHydrating, "mountSuspenseFallbackAfterRetryWithoutHydrating");
function mountDehydratedSuspenseComponent(workInProgress2, suspenseInstance, renderLanes2) {
  if ((workInProgress2.mode & ConcurrentMode) === NoMode) {
    workInProgress2.lanes = laneToLanes(SyncLane);
  } else if (isSuspenseInstanceFallback(suspenseInstance)) {
    workInProgress2.lanes = laneToLanes(DefaultHydrationLane);
  } else {
    workInProgress2.lanes = laneToLanes(OffscreenLane);
  }
  return null;
}
__name(mountDehydratedSuspenseComponent, "mountDehydratedSuspenseComponent");
function updateDehydratedSuspenseComponent(current, workInProgress2, didSuspend, nextProps, suspenseInstance, suspenseState, renderLanes2) {
  if (!didSuspend) {
    if ((workInProgress2.mode & ConcurrentMode) === NoMode) {
      return retrySuspenseComponentWithoutHydrating(
        current,
        workInProgress2,
        renderLanes2,
        // TODO: When we delete legacy mode, we should make this error argument
        // required — every concurrent mode path that causes hydration to
        // de-opt to client rendering should have an error message.
        null
      );
    }
    if (isSuspenseInstanceFallback(suspenseInstance)) {
      let digest, stack;
      {
        var _getSuspenseInstanceF2 = getSuspenseInstanceFallbackErrorDetails(suspenseInstance);
        digest = _getSuspenseInstanceF2.digest;
      }
      let error;
      {
        error = Error(formatProdErrorMessage(419));
      }
      const capturedValue = createCapturedValue(error, digest, stack);
      return retrySuspenseComponentWithoutHydrating(current, workInProgress2, renderLanes2, capturedValue);
    }
    const hasContextChanged2 = includesSomeLane(renderLanes2, current.childLanes);
    if (didReceiveUpdate || hasContextChanged2) {
      const root2 = getWorkInProgressRoot();
      if (root2 !== null) {
        const attemptHydrationAtLane = getBumpedLaneForHydration(root2, renderLanes2);
        if (attemptHydrationAtLane !== NoLane && attemptHydrationAtLane !== suspenseState.retryLane) {
          suspenseState.retryLane = attemptHydrationAtLane;
          const eventTime = NoTimestamp;
          enqueueConcurrentRenderForLane(current, attemptHydrationAtLane);
          scheduleUpdateOnFiber(root2, current, attemptHydrationAtLane, eventTime);
        }
      }
      renderDidSuspendDelayIfPossible();
      const capturedValue = createCapturedValue(Error(formatProdErrorMessage(421)));
      return retrySuspenseComponentWithoutHydrating(current, workInProgress2, renderLanes2, capturedValue);
    } else if (isSuspenseInstancePending(suspenseInstance)) {
      workInProgress2.flags |= DidCapture;
      workInProgress2.child = current.child;
      const retry = retryDehydratedSuspenseBoundary.bind(null, current);
      registerSuspenseInstanceRetry(suspenseInstance, retry);
      return null;
    } else {
      reenterHydrationStateFromDehydratedSuspenseInstance(workInProgress2, suspenseInstance, suspenseState.treeContext);
      const primaryChildren = nextProps.children;
      const primaryChildFragment = mountSuspensePrimaryChildren(workInProgress2, primaryChildren);
      primaryChildFragment.flags |= Hydrating;
      return primaryChildFragment;
    }
  } else {
    if (workInProgress2.flags & ForceClientRender) {
      workInProgress2.flags &= ~ForceClientRender;
      const capturedValue = createCapturedValue(Error(formatProdErrorMessage(422)));
      return retrySuspenseComponentWithoutHydrating(current, workInProgress2, renderLanes2, capturedValue);
    } else if (workInProgress2.memoizedState !== null) {
      workInProgress2.child = current.child;
      workInProgress2.flags |= DidCapture;
      return null;
    } else {
      const nextPrimaryChildren = nextProps.children;
      const nextFallbackChildren = nextProps.fallback;
      const fallbackChildFragment = mountSuspenseFallbackAfterRetryWithoutHydrating(current, workInProgress2, nextPrimaryChildren, nextFallbackChildren, renderLanes2);
      const primaryChildFragment = workInProgress2.child;
      primaryChildFragment.memoizedState = mountSuspenseOffscreenState(renderLanes2);
      workInProgress2.memoizedState = SUSPENDED_MARKER;
      return fallbackChildFragment;
    }
  }
}
__name(updateDehydratedSuspenseComponent, "updateDehydratedSuspenseComponent");
function scheduleSuspenseWorkOnFiber(fiber, renderLanes2, propagationRoot) {
  fiber.lanes = mergeLanes(fiber.lanes, renderLanes2);
  const alternate = fiber.alternate;
  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, renderLanes2);
  }
  scheduleContextWorkOnParentPath(fiber.return, renderLanes2, propagationRoot);
}
__name(scheduleSuspenseWorkOnFiber, "scheduleSuspenseWorkOnFiber");
function propagateSuspenseContextChange(workInProgress2, firstChild, renderLanes2) {
  let node = firstChild;
  while (node !== null) {
    if (node.tag === SuspenseComponent) {
      const state = node.memoizedState;
      if (state !== null) {
        scheduleSuspenseWorkOnFiber(node, renderLanes2, workInProgress2);
      }
    } else if (node.tag === SuspenseListComponent) {
      scheduleSuspenseWorkOnFiber(node, renderLanes2, workInProgress2);
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node === workInProgress2) {
      return;
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress2) {
        return;
      }
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
}
__name(propagateSuspenseContextChange, "propagateSuspenseContextChange");
function findLastContentRow(firstChild) {
  let row = firstChild;
  let lastContentRow = null;
  while (row !== null) {
    const currentRow = row.alternate;
    if (currentRow !== null && findFirstSuspended(currentRow) === null) {
      lastContentRow = row;
    }
    row = row.sibling;
  }
  return lastContentRow;
}
__name(findLastContentRow, "findLastContentRow");
function initSuspenseListRenderState(workInProgress2, isBackwards, tail, lastContentRow, tailMode) {
  const renderState = workInProgress2.memoizedState;
  if (renderState === null) {
    workInProgress2.memoizedState = {
      isBackwards,
      rendering: null,
      renderingStartTime: 0,
      last: lastContentRow,
      tail,
      tailMode
    };
  } else {
    renderState.isBackwards = isBackwards;
    renderState.rendering = null;
    renderState.renderingStartTime = 0;
    renderState.last = lastContentRow;
    renderState.tail = tail;
    renderState.tailMode = tailMode;
  }
}
__name(initSuspenseListRenderState, "initSuspenseListRenderState");
function updateSuspenseListComponent(current, workInProgress2, renderLanes2) {
  const nextProps = workInProgress2.pendingProps;
  const revealOrder = nextProps.revealOrder;
  const tailMode = nextProps.tail;
  const newChildren = nextProps.children;
  reconcileChildren(current, workInProgress2, newChildren, renderLanes2);
  let suspenseContext = suspenseStackCursor.current;
  const shouldForceFallback = hasSuspenseContext(suspenseContext, ForceSuspenseFallback);
  if (shouldForceFallback) {
    suspenseContext = setShallowSuspenseContext(suspenseContext, ForceSuspenseFallback);
    workInProgress2.flags |= DidCapture;
  } else {
    const didSuspendBefore = current !== null && (current.flags & DidCapture) !== NoFlags;
    if (didSuspendBefore) {
      propagateSuspenseContextChange(workInProgress2, workInProgress2.child, renderLanes2);
    }
    suspenseContext = setDefaultShallowSuspenseContext(suspenseContext);
  }
  pushSuspenseContext(workInProgress2, suspenseContext);
  if ((workInProgress2.mode & ConcurrentMode) === NoMode) {
    workInProgress2.memoizedState = null;
  } else {
    switch (revealOrder) {
      case "forwards": {
        const lastContentRow = findLastContentRow(workInProgress2.child);
        let tail;
        if (lastContentRow === null) {
          tail = workInProgress2.child;
          workInProgress2.child = null;
        } else {
          tail = lastContentRow.sibling;
          lastContentRow.sibling = null;
        }
        initSuspenseListRenderState(
          workInProgress2,
          false,
          // isBackwards
          tail,
          lastContentRow,
          tailMode
        );
        break;
      }
      case "backwards": {
        let tail = null;
        let row = workInProgress2.child;
        workInProgress2.child = null;
        while (row !== null) {
          const currentRow = row.alternate;
          if (currentRow !== null && findFirstSuspended(currentRow) === null) {
            workInProgress2.child = row;
            break;
          }
          const nextRow = row.sibling;
          row.sibling = tail;
          tail = row;
          row = nextRow;
        }
        initSuspenseListRenderState(
          workInProgress2,
          true,
          // isBackwards
          tail,
          null,
          // last
          tailMode
        );
        break;
      }
      case "together": {
        initSuspenseListRenderState(
          workInProgress2,
          false,
          // isBackwards
          null,
          // tail
          null,
          // last
          void 0
        );
        break;
      }
      default: {
        workInProgress2.memoizedState = null;
      }
    }
  }
  return workInProgress2.child;
}
__name(updateSuspenseListComponent, "updateSuspenseListComponent");
function updatePortalComponent(current, workInProgress2, renderLanes2) {
  pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
  const nextChildren = workInProgress2.pendingProps;
  if (current === null) {
    workInProgress2.child = reconcileChildFibers(workInProgress2, null, nextChildren, renderLanes2);
  } else {
    reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
  }
  return workInProgress2.child;
}
__name(updatePortalComponent, "updatePortalComponent");
function updateContextProvider(current, workInProgress2, renderLanes2) {
  const providerType = workInProgress2.type;
  const context = providerType._context;
  const newProps = workInProgress2.pendingProps;
  const oldProps = workInProgress2.memoizedProps;
  const newValue = newProps.value;
  pushProvider(workInProgress2, context, newValue);
  {
    if (oldProps !== null) {
      const oldValue = oldProps.value;
      if (objectIs(oldValue, newValue)) {
        if (oldProps.children === newProps.children && !hasContextChanged()) {
          return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
        }
      } else {
        propagateContextChange(workInProgress2, context, renderLanes2);
      }
    }
  }
  const newChildren = newProps.children;
  reconcileChildren(current, workInProgress2, newChildren, renderLanes2);
  return workInProgress2.child;
}
__name(updateContextProvider, "updateContextProvider");
function updateContextConsumer(current, workInProgress2, renderLanes2) {
  let context = workInProgress2.type;
  const newProps = workInProgress2.pendingProps;
  const render2 = newProps.children;
  prepareToReadContext(workInProgress2, renderLanes2);
  const newValue = readContext(context);
  let newChildren;
  {
    newChildren = render2(newValue);
  }
  workInProgress2.flags |= PerformedWork;
  reconcileChildren(current, workInProgress2, newChildren, renderLanes2);
  return workInProgress2.child;
}
__name(updateContextConsumer, "updateContextConsumer");
function markWorkInProgressReceivedUpdate() {
  didReceiveUpdate = true;
}
__name(markWorkInProgressReceivedUpdate, "markWorkInProgressReceivedUpdate");
function resetSuspendedCurrentOnMountInLegacyMode(current, workInProgress2) {
  if ((workInProgress2.mode & ConcurrentMode) === NoMode) {
    if (current !== null) {
      current.alternate = null;
      workInProgress2.alternate = null;
      workInProgress2.flags |= Placement;
    }
  }
}
__name(resetSuspendedCurrentOnMountInLegacyMode, "resetSuspendedCurrentOnMountInLegacyMode");
function bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2) {
  if (current !== null) {
    workInProgress2.dependencies = current.dependencies;
  }
  markSkippedUpdateLanes(workInProgress2.lanes);
  if (!includesSomeLane(renderLanes2, workInProgress2.childLanes)) {
    {
      return null;
    }
  }
  cloneChildFibers(current, workInProgress2);
  return workInProgress2.child;
}
__name(bailoutOnAlreadyFinishedWork, "bailoutOnAlreadyFinishedWork");
function checkScheduledUpdateOrContext(current, renderLanes2) {
  const updateLanes = current.lanes;
  if (includesSomeLane(updateLanes, renderLanes2)) {
    return true;
  }
  return false;
}
__name(checkScheduledUpdateOrContext, "checkScheduledUpdateOrContext");
function attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress2, renderLanes2) {
  switch (workInProgress2.tag) {
    case HostRoot:
      pushHostRootContext(workInProgress2);
      const root2 = workInProgress2.stateNode;
      {
        const cache = current.memoizedState.cache;
        pushCacheProvider(workInProgress2, cache);
      }
      resetHydrationState();
      break;
    case HostComponent:
      pushHostContext(workInProgress2);
      break;
    case ClassComponent: {
      const Component = workInProgress2.type;
      if (isContextProvider(Component)) {
        pushContextProvider(workInProgress2);
      }
      break;
    }
    case HostPortal:
      pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
      break;
    case ContextProvider: {
      const newValue = workInProgress2.memoizedProps.value;
      const context = workInProgress2.type._context;
      pushProvider(workInProgress2, context, newValue);
      break;
    }
    case Profiler:
      break;
    case SuspenseComponent: {
      const state = workInProgress2.memoizedState;
      if (state !== null) {
        if (state.dehydrated !== null) {
          pushSuspenseContext(workInProgress2, setDefaultShallowSuspenseContext(suspenseStackCursor.current));
          workInProgress2.flags |= DidCapture;
          return null;
        }
        const primaryChildFragment = workInProgress2.child;
        const primaryChildLanes = primaryChildFragment.childLanes;
        if (includesSomeLane(renderLanes2, primaryChildLanes)) {
          return updateSuspenseComponent(current, workInProgress2, renderLanes2);
        } else {
          pushSuspenseContext(workInProgress2, setDefaultShallowSuspenseContext(suspenseStackCursor.current));
          const child = bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
          if (child !== null) {
            return child.sibling;
          } else {
            return null;
          }
        }
      } else {
        pushSuspenseContext(workInProgress2, setDefaultShallowSuspenseContext(suspenseStackCursor.current));
      }
      break;
    }
    case SuspenseListComponent: {
      const didSuspendBefore = (current.flags & DidCapture) !== NoFlags;
      let hasChildWork = includesSomeLane(renderLanes2, workInProgress2.childLanes);
      if (didSuspendBefore) {
        if (hasChildWork) {
          return updateSuspenseListComponent(current, workInProgress2, renderLanes2);
        }
        workInProgress2.flags |= DidCapture;
      }
      const renderState = workInProgress2.memoizedState;
      if (renderState !== null) {
        renderState.rendering = null;
        renderState.tail = null;
        renderState.lastEffect = null;
      }
      pushSuspenseContext(workInProgress2, suspenseStackCursor.current);
      if (hasChildWork) {
        break;
      } else {
        return null;
      }
    }
    case OffscreenComponent:
    case LegacyHiddenComponent: {
      workInProgress2.lanes = NoLanes;
      return updateOffscreenComponent(current, workInProgress2, renderLanes2);
    }
    case CacheComponent: {
      {
        const cache = current.memoizedState.cache;
        pushCacheProvider(workInProgress2, cache);
      }
      break;
    }
  }
  return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
}
__name(attemptEarlyBailoutIfNoScheduledUpdate, "attemptEarlyBailoutIfNoScheduledUpdate");
function beginWork(current, workInProgress2, renderLanes2) {
  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress2.pendingProps;
    if (oldProps !== newProps || hasContextChanged() || // Force a re-render if the implementation changed due to hot reload:
    false) {
      didReceiveUpdate = true;
    } else {
      const hasScheduledUpdateOrContext = checkScheduledUpdateOrContext(current, renderLanes2);
      if (!hasScheduledUpdateOrContext && // If this is the second pass of an error or suspense boundary, there
      // may not be work scheduled on `current`, so we check for this flag.
      (workInProgress2.flags & DidCapture) === NoFlags) {
        didReceiveUpdate = false;
        return attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress2, renderLanes2);
      }
      if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
        didReceiveUpdate = true;
      } else {
        didReceiveUpdate = false;
      }
    }
  } else {
    didReceiveUpdate = false;
    if (getIsHydrating() && isForkedChild(workInProgress2)) {
      const slotIndex = workInProgress2.index;
      const numberOfForks = getForksAtLevel();
      pushTreeId(workInProgress2, numberOfForks, slotIndex);
    }
  }
  workInProgress2.lanes = NoLanes;
  switch (workInProgress2.tag) {
    case IndeterminateComponent: {
      return mountIndeterminateComponent(current, workInProgress2, workInProgress2.type, renderLanes2);
    }
    case LazyComponent: {
      const elementType = workInProgress2.elementType;
      return mountLazyComponent(current, workInProgress2, elementType, renderLanes2);
    }
    case FunctionComponent: {
      const Component = workInProgress2.type;
      const unresolvedProps = workInProgress2.pendingProps;
      const resolvedProps = workInProgress2.elementType === Component ? unresolvedProps : resolveDefaultProps(Component, unresolvedProps);
      return updateFunctionComponent(current, workInProgress2, Component, resolvedProps, renderLanes2);
    }
    case ClassComponent: {
      const Component = workInProgress2.type;
      const unresolvedProps = workInProgress2.pendingProps;
      const resolvedProps = workInProgress2.elementType === Component ? unresolvedProps : resolveDefaultProps(Component, unresolvedProps);
      return updateClassComponent(current, workInProgress2, Component, resolvedProps, renderLanes2);
    }
    case HostRoot:
      return updateHostRoot(current, workInProgress2, renderLanes2);
    case HostComponent:
      return updateHostComponent(current, workInProgress2, renderLanes2);
    case HostText:
      return updateHostText(current, workInProgress2);
    case SuspenseComponent:
      return updateSuspenseComponent(current, workInProgress2, renderLanes2);
    case HostPortal:
      return updatePortalComponent(current, workInProgress2, renderLanes2);
    case ForwardRef: {
      const type = workInProgress2.type;
      const unresolvedProps = workInProgress2.pendingProps;
      const resolvedProps = workInProgress2.elementType === type ? unresolvedProps : resolveDefaultProps(type, unresolvedProps);
      return updateForwardRef(current, workInProgress2, type, resolvedProps, renderLanes2);
    }
    case Fragment:
      return updateFragment(current, workInProgress2, renderLanes2);
    case Mode:
      return updateMode(current, workInProgress2, renderLanes2);
    case Profiler:
      return updateProfiler(current, workInProgress2, renderLanes2);
    case ContextProvider:
      return updateContextProvider(current, workInProgress2, renderLanes2);
    case ContextConsumer:
      return updateContextConsumer(current, workInProgress2, renderLanes2);
    case MemoComponent: {
      const type = workInProgress2.type;
      const unresolvedProps = workInProgress2.pendingProps;
      let resolvedProps = resolveDefaultProps(type, unresolvedProps);
      resolvedProps = resolveDefaultProps(type.type, resolvedProps);
      return updateMemoComponent(current, workInProgress2, type, resolvedProps, renderLanes2);
    }
    case SimpleMemoComponent: {
      return updateSimpleMemoComponent(current, workInProgress2, workInProgress2.type, workInProgress2.pendingProps, renderLanes2);
    }
    case IncompleteClassComponent: {
      const Component = workInProgress2.type;
      const unresolvedProps = workInProgress2.pendingProps;
      const resolvedProps = workInProgress2.elementType === Component ? unresolvedProps : resolveDefaultProps(Component, unresolvedProps);
      return mountIncompleteClassComponent(current, workInProgress2, Component, resolvedProps, renderLanes2);
    }
    case SuspenseListComponent: {
      return updateSuspenseListComponent(current, workInProgress2, renderLanes2);
    }
    case ScopeComponent: {
      break;
    }
    case OffscreenComponent: {
      return updateOffscreenComponent(current, workInProgress2, renderLanes2);
    }
    case LegacyHiddenComponent: {
      break;
    }
    case CacheComponent: {
      {
        return updateCacheComponent(current, workInProgress2, renderLanes2);
      }
    }
  }
  throw Error(formatProdErrorMessage(156, workInProgress2.tag));
}
__name(beginWork, "beginWork");
function markUpdate(workInProgress2) {
  workInProgress2.flags |= Update;
}
__name(markUpdate, "markUpdate");
function markRef$1(workInProgress2) {
  workInProgress2.flags |= Ref;
  {
    workInProgress2.flags |= RefStatic;
  }
}
__name(markRef$1, "markRef$1");
var appendAllChildren;
var updateHostContainer;
var updateHostComponent$1;
var updateHostText$1;
{
  appendAllChildren = /* @__PURE__ */ __name(function(parent, workInProgress2, needsVisibilityToggle, isHidden) {
    let node = workInProgress2.child;
    while (node !== null) {
      if (node.tag === HostComponent || node.tag === HostText) {
        appendInitialChild(parent, node.stateNode);
      } else if (node.tag === HostPortal)
        ;
      else if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }
      if (node === workInProgress2) {
        return;
      }
      while (node.sibling === null) {
        if (node.return === null || node.return === workInProgress2) {
          return;
        }
        node = node.return;
      }
      node.sibling.return = node.return;
      node = node.sibling;
    }
  }, "appendAllChildren");
  updateHostContainer = /* @__PURE__ */ __name(function(current, workInProgress2) {
  }, "updateHostContainer");
  updateHostComponent$1 = /* @__PURE__ */ __name(function(current, workInProgress2, type, newProps, rootContainerInstance) {
    const oldProps = current.memoizedProps;
    if (oldProps === newProps) {
      return;
    }
    const instance = workInProgress2.stateNode;
    const currentHostContext = getHostContext();
    const updatePayload = prepareUpdate(instance, type, oldProps, newProps);
    workInProgress2.updateQueue = updatePayload;
    if (updatePayload) {
      markUpdate(workInProgress2);
    }
  }, "updateHostComponent$1");
  updateHostText$1 = /* @__PURE__ */ __name(function(current, workInProgress2, oldText, newText) {
    if (oldText !== newText) {
      markUpdate(workInProgress2);
    }
  }, "updateHostText$1");
}
function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
  if (getIsHydrating()) {
    return;
  }
  switch (renderState.tailMode) {
    case "hidden": {
      let tailNode = renderState.tail;
      let lastTailNode = null;
      while (tailNode !== null) {
        if (tailNode.alternate !== null) {
          lastTailNode = tailNode;
        }
        tailNode = tailNode.sibling;
      }
      if (lastTailNode === null) {
        renderState.tail = null;
      } else {
        lastTailNode.sibling = null;
      }
      break;
    }
    case "collapsed": {
      let tailNode = renderState.tail;
      let lastTailNode = null;
      while (tailNode !== null) {
        if (tailNode.alternate !== null) {
          lastTailNode = tailNode;
        }
        tailNode = tailNode.sibling;
      }
      if (lastTailNode === null) {
        if (!hasRenderedATailFallback && renderState.tail !== null) {
          renderState.tail.sibling = null;
        } else {
          renderState.tail = null;
        }
      } else {
        lastTailNode.sibling = null;
      }
      break;
    }
  }
}
__name(cutOffTailIfNeeded, "cutOffTailIfNeeded");
function bubbleProperties(completedWork) {
  const didBailout = completedWork.alternate !== null && completedWork.alternate.child === completedWork.child;
  let newChildLanes = NoLanes;
  let subtreeFlags = NoFlags;
  if (!didBailout) {
    {
      let child = completedWork.child;
      while (child !== null) {
        newChildLanes = mergeLanes(newChildLanes, mergeLanes(child.lanes, child.childLanes));
        subtreeFlags |= child.subtreeFlags;
        subtreeFlags |= child.flags;
        child.return = completedWork;
        child = child.sibling;
      }
    }
    completedWork.subtreeFlags |= subtreeFlags;
  } else {
    {
      let child = completedWork.child;
      while (child !== null) {
        newChildLanes = mergeLanes(newChildLanes, mergeLanes(child.lanes, child.childLanes));
        subtreeFlags |= child.subtreeFlags & StaticMask;
        subtreeFlags |= child.flags & StaticMask;
        child.return = completedWork;
        child = child.sibling;
      }
    }
    completedWork.subtreeFlags |= subtreeFlags;
  }
  completedWork.childLanes = newChildLanes;
  return didBailout;
}
__name(bubbleProperties, "bubbleProperties");
function completeDehydratedSuspenseBoundary(current, workInProgress2, nextState) {
  if (hasUnhydratedTailNodes() && (workInProgress2.mode & ConcurrentMode) !== NoMode && (workInProgress2.flags & DidCapture) === NoFlags) {
    warnIfUnhydratedTailNodes();
    resetHydrationState();
    workInProgress2.flags |= ForceClientRender | Incomplete | ShouldCapture;
    return false;
  }
  const wasHydrated = popHydrationState(workInProgress2);
  if (nextState !== null && nextState.dehydrated !== null) {
    if (current === null) {
      if (!wasHydrated) {
        throw Error(formatProdErrorMessage(318));
      }
      prepareToHydrateHostSuspenseInstance(workInProgress2);
      bubbleProperties(workInProgress2);
      return false;
    } else {
      resetHydrationState();
      if ((workInProgress2.flags & DidCapture) === NoFlags) {
        workInProgress2.memoizedState = null;
      }
      workInProgress2.flags |= Update;
      bubbleProperties(workInProgress2);
      return false;
    }
  } else {
    upgradeHydrationErrorsToRecoverable();
    return true;
  }
}
__name(completeDehydratedSuspenseBoundary, "completeDehydratedSuspenseBoundary");
function completeWork(current, workInProgress2, renderLanes2) {
  const newProps = workInProgress2.pendingProps;
  popTreeContext(workInProgress2);
  switch (workInProgress2.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      bubbleProperties(workInProgress2);
      return null;
    case ClassComponent: {
      const Component = workInProgress2.type;
      if (isContextProvider(Component)) {
        popContext();
      }
      bubbleProperties(workInProgress2);
      return null;
    }
    case HostRoot: {
      const fiberRoot = workInProgress2.stateNode;
      {
        let previousCache = null;
        if (current !== null) {
          previousCache = current.memoizedState.cache;
        }
        const cache = workInProgress2.memoizedState.cache;
        if (cache !== previousCache) {
          workInProgress2.flags |= Passive;
        }
        popCacheProvider();
      }
      popHostContainer();
      popTopLevelContextObject();
      resetWorkInProgressVersions();
      if (fiberRoot.pendingContext) {
        fiberRoot.context = fiberRoot.pendingContext;
        fiberRoot.pendingContext = null;
      }
      if (current === null || current.child === null) {
        const wasHydrated = popHydrationState(workInProgress2);
        if (wasHydrated) {
          markUpdate(workInProgress2);
        } else {
          if (current !== null) {
            const prevState = current.memoizedState;
            if (
              // Check if this is a client root
              !prevState.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (workInProgress2.flags & ForceClientRender) !== NoFlags
            ) {
              workInProgress2.flags |= Snapshot;
              upgradeHydrationErrorsToRecoverable();
            }
          }
        }
      }
      updateHostContainer(current, workInProgress2);
      bubbleProperties(workInProgress2);
      return null;
    }
    case HostComponent: {
      popHostContext(workInProgress2);
      const rootContainerInstance = getRootHostContainer();
      const type = workInProgress2.type;
      if (current !== null && workInProgress2.stateNode != null) {
        updateHostComponent$1(current, workInProgress2, type, newProps, rootContainerInstance);
        if (current.ref !== workInProgress2.ref) {
          markRef$1(workInProgress2);
        }
      } else {
        if (!newProps) {
          if (workInProgress2.stateNode === null) {
            throw Error(formatProdErrorMessage(166));
          }
          bubbleProperties(workInProgress2);
          return null;
        }
        const currentHostContext = getHostContext();
        const wasHydrated = popHydrationState(workInProgress2);
        if (wasHydrated) {
          if (prepareToHydrateHostInstance(workInProgress2, rootContainerInstance, currentHostContext)) {
            markUpdate(workInProgress2);
          }
        } else {
          const instance = createInstance(type, newProps, rootContainerInstance, currentHostContext, workInProgress2);
          appendAllChildren(instance, workInProgress2, false, false);
          workInProgress2.stateNode = instance;
          if (finalizeInitialChildren(instance, type, newProps, rootContainerInstance)) {
            markUpdate(workInProgress2);
          }
        }
        if (workInProgress2.ref !== null) {
          markRef$1(workInProgress2);
        }
      }
      bubbleProperties(workInProgress2);
      return null;
    }
    case HostText: {
      const newText = newProps;
      if (current && workInProgress2.stateNode != null) {
        const oldText = current.memoizedProps;
        updateHostText$1(current, workInProgress2, oldText, newText);
      } else {
        if (typeof newText !== "string") {
          if (workInProgress2.stateNode === null) {
            throw Error(formatProdErrorMessage(166));
          }
        }
        const rootContainerInstance = getRootHostContainer();
        const currentHostContext = getHostContext();
        const wasHydrated = popHydrationState(workInProgress2);
        if (wasHydrated) {
          if (prepareToHydrateHostTextInstance(workInProgress2)) {
            markUpdate(workInProgress2);
          }
        } else {
          workInProgress2.stateNode = createTextInstance(newText, rootContainerInstance, currentHostContext, workInProgress2);
        }
      }
      bubbleProperties(workInProgress2);
      return null;
    }
    case SuspenseComponent: {
      popSuspenseContext();
      const nextState = workInProgress2.memoizedState;
      if (current === null || current.memoizedState !== null && current.memoizedState.dehydrated !== null) {
        const fallthroughToNormalSuspensePath = completeDehydratedSuspenseBoundary(current, workInProgress2, nextState);
        if (!fallthroughToNormalSuspensePath) {
          if (workInProgress2.flags & ShouldCapture) {
            return workInProgress2;
          } else {
            return null;
          }
        }
      }
      if ((workInProgress2.flags & DidCapture) !== NoFlags) {
        workInProgress2.lanes = renderLanes2;
        return workInProgress2;
      }
      const nextDidTimeout = nextState !== null;
      const prevDidTimeout = current !== null && current.memoizedState !== null;
      if (nextDidTimeout) {
        const offscreenFiber = workInProgress2.child;
        let previousCache = null;
        if (offscreenFiber.alternate !== null && offscreenFiber.alternate.memoizedState !== null && offscreenFiber.alternate.memoizedState.cachePool !== null) {
          previousCache = offscreenFiber.alternate.memoizedState.cachePool.pool;
        }
        let cache = null;
        if (offscreenFiber.memoizedState !== null && offscreenFiber.memoizedState.cachePool !== null) {
          cache = offscreenFiber.memoizedState.cachePool.pool;
        }
        if (cache !== previousCache) {
          offscreenFiber.flags |= Passive;
        }
      }
      if (nextDidTimeout !== prevDidTimeout) {
        if (nextDidTimeout) {
          const offscreenFiber = workInProgress2.child;
          offscreenFiber.flags |= Visibility;
          if ((workInProgress2.mode & ConcurrentMode) !== NoMode) {
            const hasInvisibleChildContext = current === null && (workInProgress2.memoizedProps.unstable_avoidThisFallback !== true || !enableSuspenseAvoidThisFallback);
            if (hasInvisibleChildContext || hasSuspenseContext(suspenseStackCursor.current, InvisibleParentSuspenseContext)) {
              renderDidSuspend();
            } else {
              renderDidSuspendDelayIfPossible();
            }
          }
        }
      }
      const wakeables = workInProgress2.updateQueue;
      if (wakeables !== null) {
        workInProgress2.flags |= Update;
      }
      bubbleProperties(workInProgress2);
      return null;
    }
    case HostPortal:
      popHostContainer();
      updateHostContainer(current, workInProgress2);
      if (current === null) {
        preparePortalMount(workInProgress2.stateNode.containerInfo);
      }
      bubbleProperties(workInProgress2);
      return null;
    case ContextProvider:
      const context = workInProgress2.type._context;
      popProvider(context);
      bubbleProperties(workInProgress2);
      return null;
    case IncompleteClassComponent: {
      const Component = workInProgress2.type;
      if (isContextProvider(Component)) {
        popContext();
      }
      bubbleProperties(workInProgress2);
      return null;
    }
    case SuspenseListComponent: {
      popSuspenseContext();
      const renderState = workInProgress2.memoizedState;
      if (renderState === null) {
        bubbleProperties(workInProgress2);
        return null;
      }
      let didSuspendAlready = (workInProgress2.flags & DidCapture) !== NoFlags;
      const renderedTail = renderState.rendering;
      if (renderedTail === null) {
        if (!didSuspendAlready) {
          const cannotBeSuspended = renderHasNotSuspendedYet() && (current === null || (current.flags & DidCapture) === NoFlags);
          if (!cannotBeSuspended) {
            let row = workInProgress2.child;
            while (row !== null) {
              const suspended = findFirstSuspended(row);
              if (suspended !== null) {
                didSuspendAlready = true;
                workInProgress2.flags |= DidCapture;
                cutOffTailIfNeeded(renderState, false);
                const newThenables = suspended.updateQueue;
                if (newThenables !== null) {
                  workInProgress2.updateQueue = newThenables;
                  workInProgress2.flags |= Update;
                }
                workInProgress2.subtreeFlags = NoFlags;
                resetChildFibers(workInProgress2, renderLanes2);
                pushSuspenseContext(workInProgress2, setShallowSuspenseContext(suspenseStackCursor.current, ForceSuspenseFallback));
                return workInProgress2.child;
              }
              row = row.sibling;
            }
          }
          if (renderState.tail !== null && now() > getRenderTargetTime()) {
            workInProgress2.flags |= DidCapture;
            didSuspendAlready = true;
            cutOffTailIfNeeded(renderState, false);
            workInProgress2.lanes = SomeRetryLane;
          }
        } else {
          cutOffTailIfNeeded(renderState, false);
        }
      } else {
        if (!didSuspendAlready) {
          const suspended = findFirstSuspended(renderedTail);
          if (suspended !== null) {
            workInProgress2.flags |= DidCapture;
            didSuspendAlready = true;
            const newThenables = suspended.updateQueue;
            if (newThenables !== null) {
              workInProgress2.updateQueue = newThenables;
              workInProgress2.flags |= Update;
            }
            cutOffTailIfNeeded(renderState, true);
            if (renderState.tail === null && renderState.tailMode === "hidden" && !renderedTail.alternate && !getIsHydrating()) {
              bubbleProperties(workInProgress2);
              return null;
            }
          } else if (
            // The time it took to render last row is greater than the remaining
            // time we have to render. So rendering one more row would likely
            // exceed it.
            now() * 2 - renderState.renderingStartTime > getRenderTargetTime() && renderLanes2 !== OffscreenLane
          ) {
            workInProgress2.flags |= DidCapture;
            didSuspendAlready = true;
            cutOffTailIfNeeded(renderState, false);
            workInProgress2.lanes = SomeRetryLane;
          }
        }
        if (renderState.isBackwards) {
          renderedTail.sibling = workInProgress2.child;
          workInProgress2.child = renderedTail;
        } else {
          const previousSibling = renderState.last;
          if (previousSibling !== null) {
            previousSibling.sibling = renderedTail;
          } else {
            workInProgress2.child = renderedTail;
          }
          renderState.last = renderedTail;
        }
      }
      if (renderState.tail !== null) {
        const next = renderState.tail;
        renderState.rendering = next;
        renderState.tail = next.sibling;
        renderState.renderingStartTime = now();
        next.sibling = null;
        let suspenseContext = suspenseStackCursor.current;
        if (didSuspendAlready) {
          suspenseContext = setShallowSuspenseContext(suspenseContext, ForceSuspenseFallback);
        } else {
          suspenseContext = setDefaultShallowSuspenseContext(suspenseContext);
        }
        pushSuspenseContext(workInProgress2, suspenseContext);
        return next;
      }
      bubbleProperties(workInProgress2);
      return null;
    }
    case ScopeComponent: {
      break;
    }
    case OffscreenComponent:
    case LegacyHiddenComponent: {
      popRenderLanes();
      const nextState = workInProgress2.memoizedState;
      const nextIsHidden = nextState !== null;
      if (current !== null) {
        const prevState = current.memoizedState;
        const prevIsHidden = prevState !== null;
        if (prevIsHidden !== nextIsHidden && // LegacyHidden doesn't do any hiding — it only pre-renders.
        !enableLegacyHidden) {
          workInProgress2.flags |= Visibility;
        }
      }
      if (!nextIsHidden || (workInProgress2.mode & ConcurrentMode) === NoMode) {
        bubbleProperties(workInProgress2);
      } else {
        if (includesSomeLane(subtreeRenderLanes, OffscreenLane)) {
          bubbleProperties(workInProgress2);
          {
            if (workInProgress2.subtreeFlags & (Placement | Update)) {
              workInProgress2.flags |= Visibility;
            }
          }
        }
      }
      {
        let previousCache = null;
        if (current !== null && current.memoizedState !== null && current.memoizedState.cachePool !== null) {
          previousCache = current.memoizedState.cachePool.pool;
        }
        let cache = null;
        if (workInProgress2.memoizedState !== null && workInProgress2.memoizedState.cachePool !== null) {
          cache = workInProgress2.memoizedState.cachePool.pool;
        }
        if (cache !== previousCache) {
          workInProgress2.flags |= Passive;
        }
      }
      popTransition(workInProgress2, current);
      return null;
    }
    case CacheComponent: {
      {
        let previousCache = null;
        if (current !== null) {
          previousCache = current.memoizedState.cache;
        }
        const cache = workInProgress2.memoizedState.cache;
        if (cache !== previousCache) {
          workInProgress2.flags |= Passive;
        }
        popCacheProvider();
        bubbleProperties(workInProgress2);
      }
      return null;
    }
    case TracingMarkerComponent: {
      return null;
    }
  }
  throw Error(formatProdErrorMessage(156, workInProgress2.tag));
}
__name(completeWork, "completeWork");
function unwindWork(current, workInProgress2, renderLanes2) {
  popTreeContext(workInProgress2);
  switch (workInProgress2.tag) {
    case ClassComponent: {
      const Component = workInProgress2.type;
      if (isContextProvider(Component)) {
        popContext();
      }
      const flags = workInProgress2.flags;
      if (flags & ShouldCapture) {
        workInProgress2.flags = flags & ~ShouldCapture | DidCapture;
        return workInProgress2;
      }
      return null;
    }
    case HostRoot: {
      const root2 = workInProgress2.stateNode;
      {
        const cache = workInProgress2.memoizedState.cache;
        popCacheProvider();
      }
      popHostContainer();
      popTopLevelContextObject();
      resetWorkInProgressVersions();
      const flags = workInProgress2.flags;
      if ((flags & ShouldCapture) !== NoFlags && (flags & DidCapture) === NoFlags) {
        workInProgress2.flags = flags & ~ShouldCapture | DidCapture;
        return workInProgress2;
      }
      return null;
    }
    case HostComponent: {
      popHostContext(workInProgress2);
      return null;
    }
    case SuspenseComponent: {
      popSuspenseContext();
      const suspenseState = workInProgress2.memoizedState;
      if (suspenseState !== null && suspenseState.dehydrated !== null) {
        if (workInProgress2.alternate === null) {
          throw Error(formatProdErrorMessage(340));
        }
        resetHydrationState();
      }
      const flags = workInProgress2.flags;
      if (flags & ShouldCapture) {
        workInProgress2.flags = flags & ~ShouldCapture | DidCapture;
        return workInProgress2;
      }
      return null;
    }
    case SuspenseListComponent: {
      popSuspenseContext();
      return null;
    }
    case HostPortal:
      popHostContainer();
      return null;
    case ContextProvider:
      const context = workInProgress2.type._context;
      popProvider(context);
      return null;
    case OffscreenComponent:
    case LegacyHiddenComponent:
      popRenderLanes();
      popTransition(workInProgress2, current);
      return null;
    case CacheComponent:
      {
        const cache = workInProgress2.memoizedState.cache;
        popCacheProvider();
      }
      return null;
    default:
      return null;
  }
}
__name(unwindWork, "unwindWork");
function unwindInterruptedWork(current, interruptedWork, renderLanes2) {
  popTreeContext(interruptedWork);
  switch (interruptedWork.tag) {
    case ClassComponent: {
      const childContextTypes = interruptedWork.type.childContextTypes;
      if (childContextTypes !== null && childContextTypes !== void 0) {
        popContext();
      }
      break;
    }
    case HostRoot: {
      const root2 = interruptedWork.stateNode;
      {
        const cache = interruptedWork.memoizedState.cache;
        popCacheProvider();
      }
      popHostContainer();
      popTopLevelContextObject();
      resetWorkInProgressVersions();
      break;
    }
    case HostComponent: {
      popHostContext(interruptedWork);
      break;
    }
    case HostPortal:
      popHostContainer();
      break;
    case SuspenseComponent:
      popSuspenseContext();
      break;
    case SuspenseListComponent:
      popSuspenseContext();
      break;
    case ContextProvider:
      const context = interruptedWork.type._context;
      popProvider(context);
      break;
    case OffscreenComponent:
    case LegacyHiddenComponent:
      popRenderLanes();
      popTransition(interruptedWork, current);
      break;
    case CacheComponent:
      {
        const cache = interruptedWork.memoizedState.cache;
        popCacheProvider();
      }
      break;
  }
}
__name(unwindInterruptedWork, "unwindInterruptedWork");
var offscreenSubtreeIsHidden = false;
var offscreenSubtreeWasHidden = false;
var PossiblyWeakSet = typeof WeakSet === "function" ? WeakSet : Set;
var nextEffect = null;
var callComponentWillUnmountWithTimer = /* @__PURE__ */ __name(function(current, instance) {
  instance.props = current.memoizedProps;
  instance.state = current.memoizedState;
  {
    instance.componentWillUnmount();
  }
}, "callComponentWillUnmountWithTimer");
function safelyCallCommitHookLayoutEffectListMount(current, nearestMountedAncestor) {
  try {
    commitHookEffectListMount(Layout, current);
  } catch (error) {
    captureCommitPhaseError(current, nearestMountedAncestor, error);
  }
}
__name(safelyCallCommitHookLayoutEffectListMount, "safelyCallCommitHookLayoutEffectListMount");
function safelyCallComponentWillUnmount(current, nearestMountedAncestor, instance) {
  try {
    callComponentWillUnmountWithTimer(current, instance);
  } catch (error) {
    captureCommitPhaseError(current, nearestMountedAncestor, error);
  }
}
__name(safelyCallComponentWillUnmount, "safelyCallComponentWillUnmount");
function safelyCallComponentDidMount(current, nearestMountedAncestor, instance) {
  try {
    instance.componentDidMount();
  } catch (error) {
    captureCommitPhaseError(current, nearestMountedAncestor, error);
  }
}
__name(safelyCallComponentDidMount, "safelyCallComponentDidMount");
function safelyAttachRef(current, nearestMountedAncestor) {
  try {
    commitAttachRef(current);
  } catch (error) {
    captureCommitPhaseError(current, nearestMountedAncestor, error);
  }
}
__name(safelyAttachRef, "safelyAttachRef");
function safelyDetachRef(current, nearestMountedAncestor) {
  const ref = current.ref;
  if (ref !== null) {
    if (typeof ref === "function") {
      let retVal;
      try {
        if (enableProfilerTimer && enableProfilerCommitHooks && current.mode & ProfileMode) {
          try {
            startLayoutEffectTimer();
            retVal = ref(null);
          } finally {
            recordLayoutEffectDuration(current);
          }
        } else {
          retVal = ref(null);
        }
      } catch (error) {
        captureCommitPhaseError(current, nearestMountedAncestor, error);
      }
    } else {
      ref.current = null;
    }
  }
}
__name(safelyDetachRef, "safelyDetachRef");
function safelyCallDestroy(current, nearestMountedAncestor, destroy) {
  try {
    destroy();
  } catch (error) {
    captureCommitPhaseError(current, nearestMountedAncestor, error);
  }
}
__name(safelyCallDestroy, "safelyCallDestroy");
var focusedInstanceHandle = null;
var shouldFireAfterActiveInstanceBlur = false;
function commitBeforeMutationEffects(root2, firstChild) {
  focusedInstanceHandle = prepareForCommit(root2.containerInfo);
  nextEffect = firstChild;
  commitBeforeMutationEffects_begin();
  const shouldFire = shouldFireAfterActiveInstanceBlur;
  shouldFireAfterActiveInstanceBlur = false;
  focusedInstanceHandle = null;
  return shouldFire;
}
__name(commitBeforeMutationEffects, "commitBeforeMutationEffects");
function commitBeforeMutationEffects_begin() {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    const child = fiber.child;
    if ((fiber.subtreeFlags & BeforeMutationMask) !== NoFlags && child !== null) {
      child.return = fiber;
      nextEffect = child;
    } else {
      commitBeforeMutationEffects_complete();
    }
  }
}
__name(commitBeforeMutationEffects_begin, "commitBeforeMutationEffects_begin");
function commitBeforeMutationEffects_complete() {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    try {
      commitBeforeMutationEffectsOnFiber(fiber);
    } catch (error) {
      captureCommitPhaseError(fiber, fiber.return, error);
    }
    const sibling = fiber.sibling;
    if (sibling !== null) {
      sibling.return = fiber.return;
      nextEffect = sibling;
      return;
    }
    nextEffect = fiber.return;
  }
}
__name(commitBeforeMutationEffects_complete, "commitBeforeMutationEffects_complete");
function commitBeforeMutationEffectsOnFiber(finishedWork) {
  const current = finishedWork.alternate;
  const flags = finishedWork.flags;
  if ((flags & Snapshot) !== NoFlags) {
    switch (finishedWork.tag) {
      case FunctionComponent:
      case ForwardRef:
      case SimpleMemoComponent: {
        break;
      }
      case ClassComponent: {
        if (current !== null) {
          const prevProps = current.memoizedProps;
          const prevState = current.memoizedState;
          const instance = finishedWork.stateNode;
          const snapshot = instance.getSnapshotBeforeUpdate(finishedWork.elementType === finishedWork.type ? prevProps : resolveDefaultProps(finishedWork.type, prevProps), prevState);
          instance.__reactInternalSnapshotBeforeUpdate = snapshot;
        }
        break;
      }
      case HostRoot: {
        {
          const root2 = finishedWork.stateNode;
          clearContainer(root2.containerInfo);
        }
        break;
      }
      case HostComponent:
      case HostText:
      case HostPortal:
      case IncompleteClassComponent:
        break;
      default: {
        throw Error(formatProdErrorMessage(163));
      }
    }
  }
}
__name(commitBeforeMutationEffectsOnFiber, "commitBeforeMutationEffectsOnFiber");
function commitHookEffectListUnmount(flags, finishedWork, nearestMountedAncestor) {
  const updateQueue = finishedWork.updateQueue;
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      if ((effect.tag & flags) === flags) {
        const destroy = effect.destroy;
        effect.destroy = void 0;
        if (destroy !== void 0) {
          safelyCallDestroy(finishedWork, nearestMountedAncestor, destroy);
        }
      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
__name(commitHookEffectListUnmount, "commitHookEffectListUnmount");
function commitHookEffectListMount(flags, finishedWork) {
  const updateQueue = finishedWork.updateQueue;
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      if ((effect.tag & flags) === flags) {
        const create = effect.create;
        effect.destroy = create();
      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
__name(commitHookEffectListMount, "commitHookEffectListMount");
function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork, committedLanes) {
  if ((finishedWork.flags & LayoutMask) !== NoFlags) {
    switch (finishedWork.tag) {
      case FunctionComponent:
      case ForwardRef:
      case SimpleMemoComponent: {
        if (!offscreenSubtreeWasHidden) {
          {
            commitHookEffectListMount(Layout | HasEffect, finishedWork);
          }
        }
        break;
      }
      case ClassComponent: {
        const instance = finishedWork.stateNode;
        if (finishedWork.flags & Update) {
          if (!offscreenSubtreeWasHidden) {
            if (current === null) {
              {
                instance.componentDidMount();
              }
            } else {
              const prevProps = finishedWork.elementType === finishedWork.type ? current.memoizedProps : resolveDefaultProps(finishedWork.type, current.memoizedProps);
              const prevState = current.memoizedState;
              {
                instance.componentDidUpdate(prevProps, prevState, instance.__reactInternalSnapshotBeforeUpdate);
              }
            }
          }
        }
        const updateQueue = finishedWork.updateQueue;
        if (updateQueue !== null) {
          commitUpdateQueue(finishedWork, updateQueue, instance);
        }
        break;
      }
      case HostRoot: {
        const updateQueue = finishedWork.updateQueue;
        if (updateQueue !== null) {
          let instance = null;
          if (finishedWork.child !== null) {
            switch (finishedWork.child.tag) {
              case HostComponent:
                instance = getPublicInstance(finishedWork.child.stateNode);
                break;
              case ClassComponent:
                instance = finishedWork.child.stateNode;
                break;
            }
          }
          commitUpdateQueue(finishedWork, updateQueue, instance);
        }
        break;
      }
      case HostComponent: {
        const instance = finishedWork.stateNode;
        if (current === null && finishedWork.flags & Update) {
          const type = finishedWork.type;
          const props = finishedWork.memoizedProps;
          commitMount(instance, type, props);
        }
        break;
      }
      case HostText: {
        break;
      }
      case HostPortal: {
        break;
      }
      case Profiler: {
        break;
      }
      case SuspenseComponent: {
        commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
        break;
      }
      case SuspenseListComponent:
      case IncompleteClassComponent:
      case ScopeComponent:
      case OffscreenComponent:
      case LegacyHiddenComponent:
      case TracingMarkerComponent: {
        break;
      }
      default:
        throw Error(formatProdErrorMessage(163));
    }
  }
  if (!offscreenSubtreeWasHidden) {
    {
      if (finishedWork.flags & Ref) {
        commitAttachRef(finishedWork);
      }
    }
  }
}
__name(commitLayoutEffectOnFiber, "commitLayoutEffectOnFiber");
function reappearLayoutEffectsOnFiber(node) {
  switch (node.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent: {
      {
        safelyCallCommitHookLayoutEffectListMount(node, node.return);
      }
      break;
    }
    case ClassComponent: {
      const instance = node.stateNode;
      if (typeof instance.componentDidMount === "function") {
        safelyCallComponentDidMount(node, node.return, instance);
      }
      safelyAttachRef(node, node.return);
      break;
    }
    case HostComponent: {
      safelyAttachRef(node, node.return);
      break;
    }
  }
}
__name(reappearLayoutEffectsOnFiber, "reappearLayoutEffectsOnFiber");
function hideOrUnhideAllChildren(finishedWork, isHidden) {
  let hostSubtreeRoot = null;
  {
    let node = finishedWork;
    while (true) {
      if (node.tag === HostComponent) {
        if (hostSubtreeRoot === null) {
          hostSubtreeRoot = node;
          try {
            const instance = node.stateNode;
            if (isHidden) {
              hideInstance(instance);
            } else {
              unhideInstance(node.stateNode, node.memoizedProps);
            }
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        }
      } else if (node.tag === HostText) {
        if (hostSubtreeRoot === null) {
          try {
            const instance = node.stateNode;
            if (isHidden) {
              hideTextInstance(instance);
            } else {
              unhideTextInstance(instance, node.memoizedProps);
            }
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        }
      } else if ((node.tag === OffscreenComponent || node.tag === LegacyHiddenComponent) && node.memoizedState !== null && node !== finishedWork)
        ;
      else if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }
      if (node === finishedWork) {
        return;
      }
      while (node.sibling === null) {
        if (node.return === null || node.return === finishedWork) {
          return;
        }
        if (hostSubtreeRoot === node) {
          hostSubtreeRoot = null;
        }
        node = node.return;
      }
      if (hostSubtreeRoot === node) {
        hostSubtreeRoot = null;
      }
      node.sibling.return = node.return;
      node = node.sibling;
    }
  }
}
__name(hideOrUnhideAllChildren, "hideOrUnhideAllChildren");
function commitAttachRef(finishedWork) {
  const ref = finishedWork.ref;
  if (ref !== null) {
    const instance = finishedWork.stateNode;
    let instanceToUse;
    switch (finishedWork.tag) {
      case HostComponent:
        instanceToUse = getPublicInstance(instance);
        break;
      default:
        instanceToUse = instance;
    }
    if (typeof ref === "function") {
      let retVal;
      {
        retVal = ref(instanceToUse);
      }
    } else {
      ref.current = instanceToUse;
    }
  }
}
__name(commitAttachRef, "commitAttachRef");
function detachFiberMutation(fiber) {
  const alternate = fiber.alternate;
  if (alternate !== null) {
    alternate.return = null;
  }
  fiber.return = null;
}
__name(detachFiberMutation, "detachFiberMutation");
function detachFiberAfterEffects(fiber) {
  const alternate = fiber.alternate;
  if (alternate !== null) {
    fiber.alternate = null;
    detachFiberAfterEffects(alternate);
  }
  {
    fiber.child = null;
    fiber.deletions = null;
    fiber.sibling = null;
    if (fiber.tag === HostComponent) {
      const hostInstance = fiber.stateNode;
      if (hostInstance !== null) {
        detachDeletedInstance(hostInstance);
      }
    }
    fiber.stateNode = null;
    {
      fiber.return = null;
      fiber.dependencies = null;
      fiber.memoizedProps = null;
      fiber.memoizedState = null;
      fiber.pendingProps = null;
      fiber.stateNode = null;
      fiber.updateQueue = null;
    }
  }
}
__name(detachFiberAfterEffects, "detachFiberAfterEffects");
function getHostParentFiber(fiber) {
  let parent = fiber.return;
  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent;
    }
    parent = parent.return;
  }
  throw Error(formatProdErrorMessage(160));
}
__name(getHostParentFiber, "getHostParentFiber");
function isHostParent(fiber) {
  return fiber.tag === HostComponent || fiber.tag === HostRoot || fiber.tag === HostPortal;
}
__name(isHostParent, "isHostParent");
function getHostSibling(fiber) {
  let node = fiber;
  siblings:
    while (true) {
      while (node.sibling === null) {
        if (node.return === null || isHostParent(node.return)) {
          return null;
        }
        node = node.return;
      }
      node.sibling.return = node.return;
      node = node.sibling;
      while (node.tag !== HostComponent && node.tag !== HostText && node.tag !== DehydratedFragment) {
        if (node.flags & Placement) {
          continue siblings;
        }
        if (node.child === null || node.tag === HostPortal) {
          continue siblings;
        } else {
          node.child.return = node;
          node = node.child;
        }
      }
      if (!(node.flags & Placement)) {
        return node.stateNode;
      }
    }
}
__name(getHostSibling, "getHostSibling");
function commitPlacement(finishedWork) {
  const parentFiber = getHostParentFiber(finishedWork);
  switch (parentFiber.tag) {
    case HostComponent: {
      const parent = parentFiber.stateNode;
      if (parentFiber.flags & ContentReset) {
        resetTextContent(parent);
        parentFiber.flags &= ~ContentReset;
      }
      const before = getHostSibling(finishedWork);
      insertOrAppendPlacementNode(finishedWork, before, parent);
      break;
    }
    case HostRoot:
    case HostPortal: {
      const parent = parentFiber.stateNode.containerInfo;
      const before = getHostSibling(finishedWork);
      insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
      break;
    }
    default:
      throw Error(formatProdErrorMessage(161));
  }
}
__name(commitPlacement, "commitPlacement");
function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
  const tag = node.tag;
  const isHost = tag === HostComponent || tag === HostText;
  if (isHost) {
    const stateNode = node.stateNode;
    if (before) {
      insertInContainerBefore(parent, stateNode, before);
    } else {
      appendChildToContainer(parent, stateNode);
    }
  } else if (tag === HostPortal)
    ;
  else {
    const child = node.child;
    if (child !== null) {
      insertOrAppendPlacementNodeIntoContainer(child, before, parent);
      let sibling = child.sibling;
      while (sibling !== null) {
        insertOrAppendPlacementNodeIntoContainer(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}
__name(insertOrAppendPlacementNodeIntoContainer, "insertOrAppendPlacementNodeIntoContainer");
function insertOrAppendPlacementNode(node, before, parent) {
  const tag = node.tag;
  const isHost = tag === HostComponent || tag === HostText;
  if (isHost) {
    const stateNode = node.stateNode;
    if (before) {
      insertBefore(parent, stateNode, before);
    } else {
      appendChild(parent, stateNode);
    }
  } else if (tag === HostPortal)
    ;
  else {
    const child = node.child;
    if (child !== null) {
      insertOrAppendPlacementNode(child, before, parent);
      let sibling = child.sibling;
      while (sibling !== null) {
        insertOrAppendPlacementNode(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}
__name(insertOrAppendPlacementNode, "insertOrAppendPlacementNode");
var hostParent = null;
var hostParentIsContainer = false;
function commitDeletionEffects(root2, returnFiber, deletedFiber) {
  {
    let parent = returnFiber;
    findParent:
      while (parent !== null) {
        switch (parent.tag) {
          case HostComponent: {
            hostParent = parent.stateNode;
            hostParentIsContainer = false;
            break findParent;
          }
          case HostRoot: {
            hostParent = parent.stateNode.containerInfo;
            hostParentIsContainer = true;
            break findParent;
          }
          case HostPortal: {
            hostParent = parent.stateNode.containerInfo;
            hostParentIsContainer = true;
            break findParent;
          }
        }
        parent = parent.return;
      }
    if (hostParent === null) {
      throw Error(formatProdErrorMessage(160));
    }
    commitDeletionEffectsOnFiber(root2, returnFiber, deletedFiber);
    hostParent = null;
    hostParentIsContainer = false;
  }
  detachFiberMutation(deletedFiber);
}
__name(commitDeletionEffects, "commitDeletionEffects");
function recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, parent) {
  let child = parent.child;
  while (child !== null) {
    commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, child);
    child = child.sibling;
  }
}
__name(recursivelyTraverseDeletionEffects, "recursivelyTraverseDeletionEffects");
function commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, deletedFiber) {
  onCommitUnmount(deletedFiber);
  switch (deletedFiber.tag) {
    case HostComponent: {
      if (!offscreenSubtreeWasHidden) {
        safelyDetachRef(deletedFiber, nearestMountedAncestor);
      }
    }
    case HostText: {
      {
        const prevHostParent = hostParent;
        const prevHostParentIsContainer = hostParentIsContainer;
        hostParent = null;
        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
        hostParent = prevHostParent;
        hostParentIsContainer = prevHostParentIsContainer;
        if (hostParent !== null) {
          if (hostParentIsContainer) {
            removeChildFromContainer(hostParent, deletedFiber.stateNode);
          } else {
            removeChild(hostParent, deletedFiber.stateNode);
          }
        }
      }
      return;
    }
    case DehydratedFragment: {
      {
        if (hostParent !== null) {
          if (hostParentIsContainer) {
            clearSuspenseBoundaryFromContainer(hostParent, deletedFiber.stateNode);
          } else {
            clearSuspenseBoundary(hostParent, deletedFiber.stateNode);
          }
        }
      }
      return;
    }
    case HostPortal: {
      {
        const prevHostParent = hostParent;
        const prevHostParentIsContainer = hostParentIsContainer;
        hostParent = deletedFiber.stateNode.containerInfo;
        hostParentIsContainer = true;
        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
        hostParent = prevHostParent;
        hostParentIsContainer = prevHostParentIsContainer;
      }
      return;
    }
    case FunctionComponent:
    case ForwardRef:
    case MemoComponent:
    case SimpleMemoComponent: {
      if (!offscreenSubtreeWasHidden) {
        const updateQueue = deletedFiber.updateQueue;
        if (updateQueue !== null) {
          const lastEffect = updateQueue.lastEffect;
          if (lastEffect !== null) {
            const firstEffect = lastEffect.next;
            let effect = firstEffect;
            do {
              const _effect = effect, destroy = _effect.destroy, tag = _effect.tag;
              if (destroy !== void 0) {
                if ((tag & Insertion) !== NoFlags$1) {
                  safelyCallDestroy(deletedFiber, nearestMountedAncestor, destroy);
                } else if ((tag & Layout) !== NoFlags$1) {
                  {
                    safelyCallDestroy(deletedFiber, nearestMountedAncestor, destroy);
                  }
                }
              }
              effect = effect.next;
            } while (effect !== firstEffect);
          }
        }
      }
      recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
      return;
    }
    case ClassComponent: {
      if (!offscreenSubtreeWasHidden) {
        safelyDetachRef(deletedFiber, nearestMountedAncestor);
        const instance = deletedFiber.stateNode;
        if (typeof instance.componentWillUnmount === "function") {
          safelyCallComponentWillUnmount(deletedFiber, nearestMountedAncestor, instance);
        }
      }
      recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
      return;
    }
    case ScopeComponent: {
      recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
      return;
    }
    case OffscreenComponent: {
      if (
        // TODO: Remove this dead flag
        deletedFiber.mode & ConcurrentMode
      ) {
        const prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
        offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden || deletedFiber.memoizedState !== null;
        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
        offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
      } else {
        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
      }
      break;
    }
    default: {
      recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
      return;
    }
  }
}
__name(commitDeletionEffectsOnFiber, "commitDeletionEffectsOnFiber");
function commitSuspenseCallback(finishedWork) {
  const newState = finishedWork.memoizedState;
}
__name(commitSuspenseCallback, "commitSuspenseCallback");
function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {
  const newState = finishedWork.memoizedState;
  if (newState === null) {
    const current = finishedWork.alternate;
    if (current !== null) {
      const prevState = current.memoizedState;
      if (prevState !== null) {
        const suspenseInstance = prevState.dehydrated;
        if (suspenseInstance !== null) {
          commitHydratedSuspenseInstance(suspenseInstance);
        }
      }
    }
  }
}
__name(commitSuspenseHydrationCallbacks, "commitSuspenseHydrationCallbacks");
function attachSuspenseRetryListeners(finishedWork) {
  const wakeables = finishedWork.updateQueue;
  if (wakeables !== null) {
    finishedWork.updateQueue = null;
    let retryCache = finishedWork.stateNode;
    if (retryCache === null) {
      retryCache = finishedWork.stateNode = new PossiblyWeakSet();
    }
    wakeables.forEach((wakeable) => {
      const retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);
      if (!retryCache.has(wakeable)) {
        retryCache.add(wakeable);
        wakeable.then(retry, retry);
      }
    });
  }
}
__name(attachSuspenseRetryListeners, "attachSuspenseRetryListeners");
function commitMutationEffects(root2, finishedWork, committedLanes) {
  commitMutationEffectsOnFiber(finishedWork, root2);
}
__name(commitMutationEffects, "commitMutationEffects");
function recursivelyTraverseMutationEffects(root2, parentFiber, lanes) {
  const deletions = parentFiber.deletions;
  if (deletions !== null) {
    for (let i = 0; i < deletions.length; i++) {
      const childToDelete = deletions[i];
      try {
        commitDeletionEffects(root2, parentFiber, childToDelete);
      } catch (error) {
        captureCommitPhaseError(childToDelete, parentFiber, error);
      }
    }
  }
  if (parentFiber.subtreeFlags & MutationMask) {
    let child = parentFiber.child;
    while (child !== null) {
      commitMutationEffectsOnFiber(child, root2);
      child = child.sibling;
    }
  }
}
__name(recursivelyTraverseMutationEffects, "recursivelyTraverseMutationEffects");
function commitMutationEffectsOnFiber(finishedWork, root2, lanes) {
  const current = finishedWork.alternate;
  const flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case MemoComponent:
    case SimpleMemoComponent: {
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      if (flags & Update) {
        try {
          commitHookEffectListUnmount(Insertion | HasEffect, finishedWork, finishedWork.return);
          commitHookEffectListMount(Insertion | HasEffect, finishedWork);
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
        {
          try {
            commitHookEffectListUnmount(Layout | HasEffect, finishedWork, finishedWork.return);
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        }
      }
      return;
    }
    case ClassComponent: {
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      if (flags & Ref) {
        if (current !== null) {
          safelyDetachRef(current, current.return);
        }
      }
      return;
    }
    case HostComponent: {
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      if (flags & Ref) {
        if (current !== null) {
          safelyDetachRef(current, current.return);
        }
      }
      {
        if (finishedWork.flags & ContentReset) {
          const instance = finishedWork.stateNode;
          try {
            resetTextContent(instance);
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        }
        if (flags & Update) {
          const instance = finishedWork.stateNode;
          if (instance != null) {
            const newProps = finishedWork.memoizedProps;
            const oldProps = current !== null ? current.memoizedProps : newProps;
            const type = finishedWork.type;
            const updatePayload = finishedWork.updateQueue;
            finishedWork.updateQueue = null;
            if (updatePayload !== null) {
              try {
                commitUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork);
              } catch (error) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error);
              }
            }
          }
        }
      }
      return;
    }
    case HostText: {
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      if (flags & Update) {
        {
          if (finishedWork.stateNode === null) {
            throw Error(formatProdErrorMessage(162));
          }
          const textInstance = finishedWork.stateNode;
          const newText = finishedWork.memoizedProps;
          const oldText = current !== null ? current.memoizedProps : newText;
          try {
            commitTextUpdate(textInstance, oldText, newText);
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        }
      }
      return;
    }
    case HostRoot: {
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      if (flags & Update) {
        {
          if (current !== null) {
            const prevRootState = current.memoizedState;
            if (prevRootState.isDehydrated) {
              try {
                commitHydratedContainer(root2.containerInfo);
              } catch (error) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error);
              }
            }
          }
        }
      }
      return;
    }
    case HostPortal: {
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      return;
    }
    case SuspenseComponent: {
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      const offscreenFiber = finishedWork.child;
      if (offscreenFiber.flags & Visibility) {
        const offscreenInstance = offscreenFiber.stateNode;
        const newState = offscreenFiber.memoizedState;
        const isHidden = newState !== null;
        offscreenInstance.isHidden = isHidden;
        if (isHidden) {
          const wasHidden = offscreenFiber.alternate !== null && offscreenFiber.alternate.memoizedState !== null;
          if (!wasHidden) {
            markCommitTimeOfFallback();
          }
        }
      }
      if (flags & Update) {
        try {
          commitSuspenseCallback(finishedWork);
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
        attachSuspenseRetryListeners(finishedWork);
      }
      return;
    }
    case OffscreenComponent: {
      const wasHidden = current !== null && current.memoizedState !== null;
      if (
        // TODO: Remove this dead flag
        finishedWork.mode & ConcurrentMode
      ) {
        const prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
        offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden || wasHidden;
        recursivelyTraverseMutationEffects(root2, finishedWork);
        offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
      } else {
        recursivelyTraverseMutationEffects(root2, finishedWork);
      }
      commitReconciliationEffects(finishedWork);
      if (flags & Visibility) {
        const offscreenInstance = finishedWork.stateNode;
        const newState = finishedWork.memoizedState;
        const isHidden = newState !== null;
        const offscreenBoundary = finishedWork;
        offscreenInstance.isHidden = isHidden;
        {
          if (isHidden) {
            if (!wasHidden) {
              if ((offscreenBoundary.mode & ConcurrentMode) !== NoMode) {
                nextEffect = offscreenBoundary;
                let offscreenChild = offscreenBoundary.child;
                while (offscreenChild !== null) {
                  nextEffect = offscreenChild;
                  disappearLayoutEffects_begin(offscreenChild);
                  offscreenChild = offscreenChild.sibling;
                }
              }
            }
          }
        }
        {
          hideOrUnhideAllChildren(offscreenBoundary, isHidden);
        }
      }
      return;
    }
    case SuspenseListComponent: {
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      if (flags & Update) {
        attachSuspenseRetryListeners(finishedWork);
      }
      return;
    }
    case ScopeComponent: {
      return;
    }
    default: {
      recursivelyTraverseMutationEffects(root2, finishedWork);
      commitReconciliationEffects(finishedWork);
      return;
    }
  }
}
__name(commitMutationEffectsOnFiber, "commitMutationEffectsOnFiber");
function commitReconciliationEffects(finishedWork) {
  const flags = finishedWork.flags;
  if (flags & Placement) {
    try {
      commitPlacement(finishedWork);
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
    finishedWork.flags &= ~Placement;
  }
  if (flags & Hydrating) {
    finishedWork.flags &= ~Hydrating;
  }
}
__name(commitReconciliationEffects, "commitReconciliationEffects");
function commitLayoutEffects(finishedWork, root2, committedLanes) {
  nextEffect = finishedWork;
  commitLayoutEffects_begin(finishedWork, root2, committedLanes);
}
__name(commitLayoutEffects, "commitLayoutEffects");
function commitLayoutEffects_begin(subtreeRoot, root2, committedLanes) {
  const isModernRoot = (subtreeRoot.mode & ConcurrentMode) !== NoMode;
  while (nextEffect !== null) {
    const fiber = nextEffect;
    const firstChild = fiber.child;
    if (fiber.tag === OffscreenComponent && isModernRoot) {
      const isHidden = fiber.memoizedState !== null;
      const newOffscreenSubtreeIsHidden = isHidden || offscreenSubtreeIsHidden;
      if (newOffscreenSubtreeIsHidden) {
        commitLayoutMountEffects_complete(subtreeRoot, root2, committedLanes);
        continue;
      } else {
        const current = fiber.alternate;
        const wasHidden = current !== null && current.memoizedState !== null;
        const newOffscreenSubtreeWasHidden = wasHidden || offscreenSubtreeWasHidden;
        const prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden;
        const prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
        offscreenSubtreeIsHidden = newOffscreenSubtreeIsHidden;
        offscreenSubtreeWasHidden = newOffscreenSubtreeWasHidden;
        if (offscreenSubtreeWasHidden && !prevOffscreenSubtreeWasHidden) {
          nextEffect = fiber;
          reappearLayoutEffects_begin(fiber);
        }
        let child = firstChild;
        while (child !== null) {
          nextEffect = child;
          commitLayoutEffects_begin(
            child,
            // New root; bubble back up to here and stop.
            root2,
            committedLanes
          );
          child = child.sibling;
        }
        nextEffect = fiber;
        offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
        offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
        commitLayoutMountEffects_complete(subtreeRoot, root2, committedLanes);
        continue;
      }
    }
    if ((fiber.subtreeFlags & LayoutMask) !== NoFlags && firstChild !== null) {
      firstChild.return = fiber;
      nextEffect = firstChild;
    } else {
      commitLayoutMountEffects_complete(subtreeRoot, root2, committedLanes);
    }
  }
}
__name(commitLayoutEffects_begin, "commitLayoutEffects_begin");
function commitLayoutMountEffects_complete(subtreeRoot, root2, committedLanes) {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    if ((fiber.flags & LayoutMask) !== NoFlags) {
      const current = fiber.alternate;
      try {
        commitLayoutEffectOnFiber(root2, current, fiber, committedLanes);
      } catch (error) {
        captureCommitPhaseError(fiber, fiber.return, error);
      }
    }
    if (fiber === subtreeRoot) {
      nextEffect = null;
      return;
    }
    const sibling = fiber.sibling;
    if (sibling !== null) {
      sibling.return = fiber.return;
      nextEffect = sibling;
      return;
    }
    nextEffect = fiber.return;
  }
}
__name(commitLayoutMountEffects_complete, "commitLayoutMountEffects_complete");
function disappearLayoutEffects_begin(subtreeRoot) {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    const firstChild = fiber.child;
    switch (fiber.tag) {
      case FunctionComponent:
      case ForwardRef:
      case MemoComponent:
      case SimpleMemoComponent: {
        {
          commitHookEffectListUnmount(Layout, fiber, fiber.return);
        }
        break;
      }
      case ClassComponent: {
        safelyDetachRef(fiber, fiber.return);
        const instance = fiber.stateNode;
        if (typeof instance.componentWillUnmount === "function") {
          safelyCallComponentWillUnmount(fiber, fiber.return, instance);
        }
        break;
      }
      case HostComponent: {
        safelyDetachRef(fiber, fiber.return);
        break;
      }
      case OffscreenComponent: {
        const isHidden = fiber.memoizedState !== null;
        if (isHidden) {
          disappearLayoutEffects_complete(subtreeRoot);
          continue;
        }
        break;
      }
    }
    if (firstChild !== null) {
      firstChild.return = fiber;
      nextEffect = firstChild;
    } else {
      disappearLayoutEffects_complete(subtreeRoot);
    }
  }
}
__name(disappearLayoutEffects_begin, "disappearLayoutEffects_begin");
function disappearLayoutEffects_complete(subtreeRoot) {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    if (fiber === subtreeRoot) {
      nextEffect = null;
      return;
    }
    const sibling = fiber.sibling;
    if (sibling !== null) {
      sibling.return = fiber.return;
      nextEffect = sibling;
      return;
    }
    nextEffect = fiber.return;
  }
}
__name(disappearLayoutEffects_complete, "disappearLayoutEffects_complete");
function reappearLayoutEffects_begin(subtreeRoot) {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    const firstChild = fiber.child;
    if (fiber.tag === OffscreenComponent) {
      const isHidden = fiber.memoizedState !== null;
      if (isHidden) {
        reappearLayoutEffects_complete(subtreeRoot);
        continue;
      }
    }
    if (firstChild !== null) {
      firstChild.return = fiber;
      nextEffect = firstChild;
    } else {
      reappearLayoutEffects_complete(subtreeRoot);
    }
  }
}
__name(reappearLayoutEffects_begin, "reappearLayoutEffects_begin");
function reappearLayoutEffects_complete(subtreeRoot) {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    try {
      reappearLayoutEffectsOnFiber(fiber);
    } catch (error) {
      captureCommitPhaseError(fiber, fiber.return, error);
    }
    if (fiber === subtreeRoot) {
      nextEffect = null;
      return;
    }
    const sibling = fiber.sibling;
    if (sibling !== null) {
      sibling.return = fiber.return;
      nextEffect = sibling;
      return;
    }
    nextEffect = fiber.return;
  }
}
__name(reappearLayoutEffects_complete, "reappearLayoutEffects_complete");
function commitPassiveMountEffects(root2, finishedWork, committedLanes, committedTransitions) {
  nextEffect = finishedWork;
  commitPassiveMountEffects_begin(finishedWork, root2, committedLanes, committedTransitions);
}
__name(commitPassiveMountEffects, "commitPassiveMountEffects");
function commitPassiveMountEffects_begin(subtreeRoot, root2, committedLanes, committedTransitions) {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    const firstChild = fiber.child;
    if ((fiber.subtreeFlags & PassiveMask) !== NoFlags && firstChild !== null) {
      firstChild.return = fiber;
      nextEffect = firstChild;
    } else {
      commitPassiveMountEffects_complete(subtreeRoot, root2, committedLanes, committedTransitions);
    }
  }
}
__name(commitPassiveMountEffects_begin, "commitPassiveMountEffects_begin");
function commitPassiveMountEffects_complete(subtreeRoot, root2, committedLanes, committedTransitions) {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    if ((fiber.flags & Passive) !== NoFlags) {
      try {
        commitPassiveMountOnFiber(root2, fiber, committedLanes, committedTransitions);
      } catch (error) {
        captureCommitPhaseError(fiber, fiber.return, error);
      }
    }
    if (fiber === subtreeRoot) {
      nextEffect = null;
      return;
    }
    const sibling = fiber.sibling;
    if (sibling !== null) {
      sibling.return = fiber.return;
      nextEffect = sibling;
      return;
    }
    nextEffect = fiber.return;
  }
}
__name(commitPassiveMountEffects_complete, "commitPassiveMountEffects_complete");
function commitPassiveMountOnFiber(finishedRoot, finishedWork, committedLanes, committedTransitions) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent: {
      {
        commitHookEffectListMount(Passive$1 | HasEffect, finishedWork);
      }
      break;
    }
    case HostRoot: {
      {
        let previousCache = null;
        if (finishedWork.alternate !== null) {
          previousCache = finishedWork.alternate.memoizedState.cache;
        }
        const nextCache = finishedWork.memoizedState.cache;
        if (nextCache !== previousCache) {
          retainCache(nextCache);
          if (previousCache != null) {
            releaseCache(previousCache);
          }
        }
      }
      break;
    }
    case LegacyHiddenComponent:
    case OffscreenComponent: {
      {
        let previousCache = null;
        if (finishedWork.alternate !== null && finishedWork.alternate.memoizedState !== null && finishedWork.alternate.memoizedState.cachePool !== null) {
          previousCache = finishedWork.alternate.memoizedState.cachePool.pool;
        }
        let nextCache = null;
        if (finishedWork.memoizedState !== null && finishedWork.memoizedState.cachePool !== null) {
          nextCache = finishedWork.memoizedState.cachePool.pool;
        }
        if (nextCache !== previousCache) {
          if (nextCache != null) {
            retainCache(nextCache);
          }
          if (previousCache != null) {
            releaseCache(previousCache);
          }
        }
      }
      break;
    }
    case CacheComponent: {
      {
        let previousCache = null;
        if (finishedWork.alternate !== null) {
          previousCache = finishedWork.alternate.memoizedState.cache;
        }
        const nextCache = finishedWork.memoizedState.cache;
        if (nextCache !== previousCache) {
          retainCache(nextCache);
          if (previousCache != null) {
            releaseCache(previousCache);
          }
        }
      }
      break;
    }
  }
}
__name(commitPassiveMountOnFiber, "commitPassiveMountOnFiber");
function commitPassiveUnmountEffects(firstChild) {
  nextEffect = firstChild;
  commitPassiveUnmountEffects_begin();
}
__name(commitPassiveUnmountEffects, "commitPassiveUnmountEffects");
function commitPassiveUnmountEffects_begin() {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    const child = fiber.child;
    if ((nextEffect.flags & ChildDeletion) !== NoFlags) {
      const deletions = fiber.deletions;
      if (deletions !== null) {
        for (let i = 0; i < deletions.length; i++) {
          const fiberToDelete = deletions[i];
          nextEffect = fiberToDelete;
          commitPassiveUnmountEffectsInsideOfDeletedTree_begin(fiberToDelete, fiber);
        }
        {
          const previousFiber = fiber.alternate;
          if (previousFiber !== null) {
            let detachedChild = previousFiber.child;
            if (detachedChild !== null) {
              previousFiber.child = null;
              do {
                const detachedSibling = detachedChild.sibling;
                detachedChild.sibling = null;
                detachedChild = detachedSibling;
              } while (detachedChild !== null);
            }
          }
        }
        nextEffect = fiber;
      }
    }
    if ((fiber.subtreeFlags & PassiveMask) !== NoFlags && child !== null) {
      child.return = fiber;
      nextEffect = child;
    } else {
      commitPassiveUnmountEffects_complete();
    }
  }
}
__name(commitPassiveUnmountEffects_begin, "commitPassiveUnmountEffects_begin");
function commitPassiveUnmountEffects_complete() {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    if ((fiber.flags & Passive) !== NoFlags) {
      commitPassiveUnmountOnFiber(fiber);
    }
    const sibling = fiber.sibling;
    if (sibling !== null) {
      sibling.return = fiber.return;
      nextEffect = sibling;
      return;
    }
    nextEffect = fiber.return;
  }
}
__name(commitPassiveUnmountEffects_complete, "commitPassiveUnmountEffects_complete");
function commitPassiveUnmountOnFiber(finishedWork) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent: {
      {
        commitHookEffectListUnmount(Passive$1 | HasEffect, finishedWork, finishedWork.return);
      }
      break;
    }
  }
}
__name(commitPassiveUnmountOnFiber, "commitPassiveUnmountOnFiber");
function commitPassiveUnmountEffectsInsideOfDeletedTree_begin(deletedSubtreeRoot, nearestMountedAncestor) {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    commitPassiveUnmountInsideDeletedTreeOnFiber(fiber, nearestMountedAncestor);
    const child = fiber.child;
    if (child !== null) {
      child.return = fiber;
      nextEffect = child;
    } else {
      commitPassiveUnmountEffectsInsideOfDeletedTree_complete(deletedSubtreeRoot);
    }
  }
}
__name(commitPassiveUnmountEffectsInsideOfDeletedTree_begin, "commitPassiveUnmountEffectsInsideOfDeletedTree_begin");
function commitPassiveUnmountEffectsInsideOfDeletedTree_complete(deletedSubtreeRoot) {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    const sibling = fiber.sibling;
    const returnFiber = fiber.return;
    {
      detachFiberAfterEffects(fiber);
      if (fiber === deletedSubtreeRoot) {
        nextEffect = null;
        return;
      }
    }
    if (sibling !== null) {
      sibling.return = returnFiber;
      nextEffect = sibling;
      return;
    }
    nextEffect = returnFiber;
  }
}
__name(commitPassiveUnmountEffectsInsideOfDeletedTree_complete, "commitPassiveUnmountEffectsInsideOfDeletedTree_complete");
function commitPassiveUnmountInsideDeletedTreeOnFiber(current, nearestMountedAncestor) {
  switch (current.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent: {
      {
        commitHookEffectListUnmount(Passive$1, current, nearestMountedAncestor);
      }
      break;
    }
    case LegacyHiddenComponent:
    case OffscreenComponent: {
      {
        if (current.memoizedState !== null && current.memoizedState.cachePool !== null) {
          const cache = current.memoizedState.cachePool.pool;
          if (cache != null) {
            retainCache(cache);
          }
        }
      }
      break;
    }
    case CacheComponent: {
      {
        const cache = current.memoizedState.cache;
        releaseCache(cache);
      }
      break;
    }
  }
}
__name(commitPassiveUnmountInsideDeletedTreeOnFiber, "commitPassiveUnmountInsideDeletedTreeOnFiber");
var ReactCurrentActQueue = ReactSharedInternals.ReactCurrentActQueue;
var ceil = Math.ceil;
var ReactCurrentDispatcher$2 = ReactSharedInternals.ReactCurrentDispatcher;
var ReactCurrentOwner$2 = ReactSharedInternals.ReactCurrentOwner;
var ReactCurrentBatchConfig$3 = ReactSharedInternals.ReactCurrentBatchConfig;
var ReactCurrentActQueue$1 = ReactSharedInternals.ReactCurrentActQueue;
var NoContext = (
  /*             */
  0
);
var BatchedContext = (
  /*               */
  1
);
var RenderContext = (
  /*                */
  2
);
var CommitContext = (
  /*                */
  4
);
var RootInProgress = 0;
var RootFatalErrored = 1;
var RootErrored = 2;
var RootSuspended = 3;
var RootSuspendedWithDelay = 4;
var RootCompleted = 5;
var RootDidNotComplete = 6;
var executionContext = NoContext;
var workInProgressRoot = null;
var workInProgress = null;
var workInProgressRootRenderLanes = NoLanes;
var subtreeRenderLanes = NoLanes;
var subtreeRenderLanesCursor = createCursor(NoLanes);
var workInProgressRootExitStatus = RootInProgress;
var workInProgressRootFatalError = null;
var workInProgressRootIncludedLanes = NoLanes;
var workInProgressRootSkippedLanes = NoLanes;
var workInProgressRootInterleavedUpdatedLanes = NoLanes;
var workInProgressRootPingedLanes = NoLanes;
var workInProgressRootConcurrentErrors = null;
var workInProgressRootRecoverableErrors = null;
var globalMostRecentFallbackTime = 0;
var FALLBACK_THROTTLE_MS = 500;
var workInProgressRootRenderTargetTime = Infinity;
var RENDER_TIMEOUT_MS = 500;
var workInProgressTransitions = null;
function resetRenderTimer() {
  workInProgressRootRenderTargetTime = now() + RENDER_TIMEOUT_MS;
}
__name(resetRenderTimer, "resetRenderTimer");
function getRenderTargetTime() {
  return workInProgressRootRenderTargetTime;
}
__name(getRenderTargetTime, "getRenderTargetTime");
var hasUncaughtError = false;
var firstUncaughtError = null;
var legacyErrorBoundariesThatAlreadyFailed = null;
var rootDoesHavePassiveEffects = false;
var rootWithPendingPassiveEffects = null;
var pendingPassiveEffectsLanes = NoLanes;
var pendingPassiveEffectsRemainingLanes = NoLanes;
var pendingPassiveTransitions = null;
var NESTED_UPDATE_LIMIT = 50;
var nestedUpdateCount = 0;
var rootWithNestedUpdates = null;
var currentEventTime = NoTimestamp;
var currentEventTransitionLane = NoLanes;
function getWorkInProgressRoot() {
  return workInProgressRoot;
}
__name(getWorkInProgressRoot, "getWorkInProgressRoot");
function requestEventTime() {
  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
    return now();
  }
  if (currentEventTime !== NoTimestamp) {
    return currentEventTime;
  }
  currentEventTime = now();
  return currentEventTime;
}
__name(requestEventTime, "requestEventTime");
function requestUpdateLane(fiber) {
  const mode = fiber.mode;
  if ((mode & ConcurrentMode) === NoMode) {
    return SyncLane;
  } else if ((executionContext & RenderContext) !== NoContext && workInProgressRootRenderLanes !== NoLanes) {
    return pickArbitraryLane(workInProgressRootRenderLanes);
  }
  const isTransition = requestCurrentTransition() !== NoTransition;
  if (isTransition) {
    if (currentEventTransitionLane === NoLane) {
      currentEventTransitionLane = claimNextTransitionLane();
    }
    return currentEventTransitionLane;
  }
  const updateLane = getCurrentUpdatePriority();
  if (updateLane !== NoLane) {
    return updateLane;
  }
  const eventLane = getCurrentEventPriority();
  return eventLane;
}
__name(requestUpdateLane, "requestUpdateLane");
function requestRetryLane(fiber) {
  const mode = fiber.mode;
  if ((mode & ConcurrentMode) === NoMode) {
    return SyncLane;
  }
  return claimNextRetryLane();
}
__name(requestRetryLane, "requestRetryLane");
function scheduleUpdateOnFiber(root2, fiber, lane, eventTime) {
  checkForNestedUpdates();
  markRootUpdated(root2, lane, eventTime);
  if ((executionContext & RenderContext) !== NoLanes && root2 === workInProgressRoot)
    ;
  else {
    if (root2 === workInProgressRoot) {
      if ((executionContext & RenderContext) === NoContext) {
        workInProgressRootInterleavedUpdatedLanes = mergeLanes(workInProgressRootInterleavedUpdatedLanes, lane);
      }
      if (workInProgressRootExitStatus === RootSuspendedWithDelay) {
        markRootSuspended$1(root2, workInProgressRootRenderLanes);
      }
    }
    ensureRootIsScheduled(root2, eventTime);
    if (lane === SyncLane && executionContext === NoContext && (fiber.mode & ConcurrentMode) === NoMode && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
    true) {
      resetRenderTimer();
      flushSyncCallbacksOnlyInLegacyMode();
    }
  }
}
__name(scheduleUpdateOnFiber, "scheduleUpdateOnFiber");
function scheduleInitialHydrationOnRoot(root2, lane, eventTime) {
  const current = root2.current;
  current.lanes = lane;
  markRootUpdated(root2, lane, eventTime);
  ensureRootIsScheduled(root2, eventTime);
}
__name(scheduleInitialHydrationOnRoot, "scheduleInitialHydrationOnRoot");
function isUnsafeClassRenderPhaseUpdate(fiber) {
  return (
    // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
    // decided not to enable it.
    (executionContext & RenderContext) !== NoContext
  );
}
__name(isUnsafeClassRenderPhaseUpdate, "isUnsafeClassRenderPhaseUpdate");
function ensureRootIsScheduled(root2, currentTime) {
  const existingCallbackNode = root2.callbackNode;
  markStarvedLanesAsExpired(root2, currentTime);
  const nextLanes = getNextLanes(root2, root2 === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);
  if (nextLanes === NoLanes) {
    if (existingCallbackNode !== null) {
      cancelCallback$1(existingCallbackNode);
    }
    root2.callbackNode = null;
    root2.callbackPriority = NoLane;
    return;
  }
  const newCallbackPriority = getHighestPriorityLane(nextLanes);
  const existingCallbackPriority = root2.callbackPriority;
  if (existingCallbackPriority === newCallbackPriority && // Special case related to `act`. If the currently scheduled task is a
  // Scheduler task, rather than an `act` task, cancel it and re-scheduled
  // on the `act` queue.
  true) {
    return;
  }
  if (existingCallbackNode != null) {
    cancelCallback$1(existingCallbackNode);
  }
  let newCallbackNode;
  if (newCallbackPriority === SyncLane) {
    if (root2.tag === LegacyRoot) {
      scheduleLegacySyncCallback(performSyncWorkOnRoot.bind(null, root2));
    } else {
      scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root2));
    }
    {
      {
        scheduleMicrotask(() => {
          if ((executionContext & (RenderContext | CommitContext)) === NoContext) {
            flushSyncCallbacks();
          }
        });
      }
    }
    newCallbackNode = null;
  } else {
    let schedulerPriorityLevel;
    switch (lanesToEventPriority(nextLanes)) {
      case DiscreteEventPriority:
        schedulerPriorityLevel = ImmediatePriority2;
        break;
      case ContinuousEventPriority:
        schedulerPriorityLevel = UserBlockingPriority2;
        break;
      case DefaultEventPriority:
        schedulerPriorityLevel = NormalPriority2;
        break;
      case IdleEventPriority:
        schedulerPriorityLevel = IdlePriority2;
        break;
      default:
        schedulerPriorityLevel = NormalPriority2;
        break;
    }
    newCallbackNode = scheduleCallback$2(schedulerPriorityLevel, performConcurrentWorkOnRoot.bind(null, root2));
  }
  root2.callbackPriority = newCallbackPriority;
  root2.callbackNode = newCallbackNode;
}
__name(ensureRootIsScheduled, "ensureRootIsScheduled");
function performConcurrentWorkOnRoot(root2, didTimeout) {
  currentEventTime = NoTimestamp;
  currentEventTransitionLane = NoLanes;
  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
    throw Error(formatProdErrorMessage(327));
  }
  const originalCallbackNode = root2.callbackNode;
  const didFlushPassiveEffects = flushPassiveEffects();
  if (didFlushPassiveEffects) {
    if (root2.callbackNode !== originalCallbackNode) {
      return null;
    }
  }
  let lanes = getNextLanes(root2, root2 === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);
  if (lanes === NoLanes) {
    return null;
  }
  const shouldTimeSlice = !includesBlockingLane(root2, lanes) && !includesExpiredLane(root2, lanes) && !didTimeout;
  let exitStatus = shouldTimeSlice ? renderRootConcurrent(root2, lanes) : renderRootSync(root2, lanes);
  if (exitStatus !== RootInProgress) {
    if (exitStatus === RootErrored) {
      const errorRetryLanes = getLanesToRetrySynchronouslyOnError(root2);
      if (errorRetryLanes !== NoLanes) {
        lanes = errorRetryLanes;
        exitStatus = recoverFromConcurrentError(root2, errorRetryLanes);
      }
    }
    if (exitStatus === RootFatalErrored) {
      const fatalError = workInProgressRootFatalError;
      prepareFreshStack(root2, NoLanes);
      markRootSuspended$1(root2, lanes);
      ensureRootIsScheduled(root2, now());
      throw fatalError;
    }
    if (exitStatus === RootDidNotComplete) {
      markRootSuspended$1(root2, lanes);
    } else {
      const renderWasConcurrent = !includesBlockingLane(root2, lanes);
      const finishedWork = root2.current.alternate;
      if (renderWasConcurrent && !isRenderConsistentWithExternalStores(finishedWork)) {
        exitStatus = renderRootSync(root2, lanes);
        if (exitStatus === RootErrored) {
          const errorRetryLanes = getLanesToRetrySynchronouslyOnError(root2);
          if (errorRetryLanes !== NoLanes) {
            lanes = errorRetryLanes;
            exitStatus = recoverFromConcurrentError(root2, errorRetryLanes);
          }
        }
        if (exitStatus === RootFatalErrored) {
          const fatalError = workInProgressRootFatalError;
          prepareFreshStack(root2, NoLanes);
          markRootSuspended$1(root2, lanes);
          ensureRootIsScheduled(root2, now());
          throw fatalError;
        }
      }
      root2.finishedWork = finishedWork;
      root2.finishedLanes = lanes;
      finishConcurrentRender(root2, exitStatus, lanes);
    }
  }
  ensureRootIsScheduled(root2, now());
  if (root2.callbackNode === originalCallbackNode) {
    return performConcurrentWorkOnRoot.bind(null, root2);
  }
  return null;
}
__name(performConcurrentWorkOnRoot, "performConcurrentWorkOnRoot");
function recoverFromConcurrentError(root2, errorRetryLanes) {
  const errorsFromFirstAttempt = workInProgressRootConcurrentErrors;
  if (isRootDehydrated(root2)) {
    const rootWorkInProgress = prepareFreshStack(root2, errorRetryLanes);
    rootWorkInProgress.flags |= ForceClientRender;
  }
  const exitStatus = renderRootSync(root2, errorRetryLanes);
  if (exitStatus !== RootErrored) {
    const errorsFromSecondAttempt = workInProgressRootRecoverableErrors;
    workInProgressRootRecoverableErrors = errorsFromFirstAttempt;
    if (errorsFromSecondAttempt !== null) {
      queueRecoverableErrors(errorsFromSecondAttempt);
    }
  }
  return exitStatus;
}
__name(recoverFromConcurrentError, "recoverFromConcurrentError");
function queueRecoverableErrors(errors) {
  if (workInProgressRootRecoverableErrors === null) {
    workInProgressRootRecoverableErrors = errors;
  } else {
    workInProgressRootRecoverableErrors.push.apply(workInProgressRootRecoverableErrors, errors);
  }
}
__name(queueRecoverableErrors, "queueRecoverableErrors");
function finishConcurrentRender(root2, exitStatus, lanes) {
  switch (exitStatus) {
    case RootInProgress:
    case RootFatalErrored: {
      throw Error(formatProdErrorMessage(345));
    }
    case RootErrored: {
      commitRoot(root2, workInProgressRootRecoverableErrors, workInProgressTransitions);
      break;
    }
    case RootSuspended: {
      markRootSuspended$1(root2, lanes);
      if (includesOnlyRetries(lanes) && // do not delay if we're inside an act() scope
      !shouldForceFlushFallbacksInDEV()) {
        const msUntilTimeout = globalMostRecentFallbackTime + FALLBACK_THROTTLE_MS - now();
        if (msUntilTimeout > 10) {
          const nextLanes = getNextLanes(root2, NoLanes);
          if (nextLanes !== NoLanes) {
            break;
          }
          const suspendedLanes = root2.suspendedLanes;
          if (!isSubsetOfLanes(suspendedLanes, lanes)) {
            const eventTime = requestEventTime();
            markRootPinged(root2, suspendedLanes);
            break;
          }
          root2.timeoutHandle = scheduleTimeout(commitRoot.bind(null, root2, workInProgressRootRecoverableErrors, workInProgressTransitions), msUntilTimeout);
          break;
        }
      }
      commitRoot(root2, workInProgressRootRecoverableErrors, workInProgressTransitions);
      break;
    }
    case RootSuspendedWithDelay: {
      markRootSuspended$1(root2, lanes);
      if (includesOnlyTransitions(lanes)) {
        break;
      }
      {
        const mostRecentEventTime = getMostRecentEventTime(root2, lanes);
        const eventTimeMs = mostRecentEventTime;
        const timeElapsedMs = now() - eventTimeMs;
        const msUntilTimeout = jnd(timeElapsedMs) - timeElapsedMs;
        if (msUntilTimeout > 10) {
          root2.timeoutHandle = scheduleTimeout(commitRoot.bind(null, root2, workInProgressRootRecoverableErrors, workInProgressTransitions), msUntilTimeout);
          break;
        }
      }
      commitRoot(root2, workInProgressRootRecoverableErrors, workInProgressTransitions);
      break;
    }
    case RootCompleted: {
      commitRoot(root2, workInProgressRootRecoverableErrors, workInProgressTransitions);
      break;
    }
    default: {
      throw Error(formatProdErrorMessage(329));
    }
  }
}
__name(finishConcurrentRender, "finishConcurrentRender");
function isRenderConsistentWithExternalStores(finishedWork) {
  let node = finishedWork;
  while (true) {
    if (node.flags & StoreConsistency) {
      const updateQueue = node.updateQueue;
      if (updateQueue !== null) {
        const checks = updateQueue.stores;
        if (checks !== null) {
          for (let i = 0; i < checks.length; i++) {
            const check = checks[i];
            const getSnapshot = check.getSnapshot;
            const renderedValue = check.value;
            try {
              if (!objectIs(getSnapshot(), renderedValue)) {
                return false;
              }
            } catch (error) {
              return false;
            }
          }
        }
      }
    }
    const child = node.child;
    if (node.subtreeFlags & StoreConsistency && child !== null) {
      child.return = node;
      node = child;
      continue;
    }
    if (node === finishedWork) {
      return true;
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === finishedWork) {
        return true;
      }
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
  return true;
}
__name(isRenderConsistentWithExternalStores, "isRenderConsistentWithExternalStores");
function markRootSuspended$1(root2, suspendedLanes) {
  suspendedLanes = removeLanes(suspendedLanes, workInProgressRootPingedLanes);
  suspendedLanes = removeLanes(suspendedLanes, workInProgressRootInterleavedUpdatedLanes);
  markRootSuspended(root2, suspendedLanes);
}
__name(markRootSuspended$1, "markRootSuspended$1");
function performSyncWorkOnRoot(root2) {
  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
    throw Error(formatProdErrorMessage(327));
  }
  flushPassiveEffects();
  let lanes = getNextLanes(root2, NoLanes);
  if (!includesSomeLane(lanes, SyncLane)) {
    ensureRootIsScheduled(root2, now());
    return null;
  }
  let exitStatus = renderRootSync(root2, lanes);
  if (root2.tag !== LegacyRoot && exitStatus === RootErrored) {
    const errorRetryLanes = getLanesToRetrySynchronouslyOnError(root2);
    if (errorRetryLanes !== NoLanes) {
      lanes = errorRetryLanes;
      exitStatus = recoverFromConcurrentError(root2, errorRetryLanes);
    }
  }
  if (exitStatus === RootFatalErrored) {
    const fatalError = workInProgressRootFatalError;
    prepareFreshStack(root2, NoLanes);
    markRootSuspended$1(root2, lanes);
    ensureRootIsScheduled(root2, now());
    throw fatalError;
  }
  if (exitStatus === RootDidNotComplete) {
    throw Error(formatProdErrorMessage(345));
  }
  const finishedWork = root2.current.alternate;
  root2.finishedWork = finishedWork;
  root2.finishedLanes = lanes;
  commitRoot(root2, workInProgressRootRecoverableErrors, workInProgressTransitions);
  ensureRootIsScheduled(root2, now());
  return null;
}
__name(performSyncWorkOnRoot, "performSyncWorkOnRoot");
function flushRoot(root2, lanes) {
  if (lanes !== NoLanes) {
    markRootEntangled(root2, mergeLanes(lanes, SyncLane));
    ensureRootIsScheduled(root2, now());
    if ((executionContext & (RenderContext | CommitContext)) === NoContext) {
      resetRenderTimer();
      flushSyncCallbacks();
    }
  }
}
__name(flushRoot, "flushRoot");
function batchedUpdates$1(fn, a) {
  const prevExecutionContext = executionContext;
  executionContext |= BatchedContext;
  try {
    return fn(a);
  } finally {
    executionContext = prevExecutionContext;
    if (executionContext === NoContext && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
    true) {
      resetRenderTimer();
      flushSyncCallbacksOnlyInLegacyMode();
    }
  }
}
__name(batchedUpdates$1, "batchedUpdates$1");
function discreteUpdates(fn, a, b, c, d) {
  const previousPriority = getCurrentUpdatePriority();
  const prevTransition = ReactCurrentBatchConfig$3.transition;
  try {
    ReactCurrentBatchConfig$3.transition = null;
    setCurrentUpdatePriority(DiscreteEventPriority);
    return fn(a, b, c, d);
  } finally {
    setCurrentUpdatePriority(previousPriority);
    ReactCurrentBatchConfig$3.transition = prevTransition;
    if (executionContext === NoContext) {
      resetRenderTimer();
    }
  }
}
__name(discreteUpdates, "discreteUpdates");
function flushSync(fn) {
  if (rootWithPendingPassiveEffects !== null && rootWithPendingPassiveEffects.tag === LegacyRoot && (executionContext & (RenderContext | CommitContext)) === NoContext) {
    flushPassiveEffects();
  }
  const prevExecutionContext = executionContext;
  executionContext |= BatchedContext;
  const prevTransition = ReactCurrentBatchConfig$3.transition;
  const previousPriority = getCurrentUpdatePriority();
  try {
    ReactCurrentBatchConfig$3.transition = null;
    setCurrentUpdatePriority(DiscreteEventPriority);
    if (fn) {
      return fn();
    } else {
      return void 0;
    }
  } finally {
    setCurrentUpdatePriority(previousPriority);
    ReactCurrentBatchConfig$3.transition = prevTransition;
    executionContext = prevExecutionContext;
    if ((executionContext & (RenderContext | CommitContext)) === NoContext) {
      flushSyncCallbacks();
    }
  }
}
__name(flushSync, "flushSync");
function pushRenderLanes(fiber, lanes) {
  push2(subtreeRenderLanesCursor, subtreeRenderLanes);
  subtreeRenderLanes = mergeLanes(subtreeRenderLanes, lanes);
  workInProgressRootIncludedLanes = mergeLanes(workInProgressRootIncludedLanes, lanes);
}
__name(pushRenderLanes, "pushRenderLanes");
function popRenderLanes(fiber) {
  subtreeRenderLanes = subtreeRenderLanesCursor.current;
  pop2(subtreeRenderLanesCursor);
}
__name(popRenderLanes, "popRenderLanes");
function prepareFreshStack(root2, lanes) {
  root2.finishedWork = null;
  root2.finishedLanes = NoLanes;
  const timeoutHandle = root2.timeoutHandle;
  if (timeoutHandle !== noTimeout) {
    root2.timeoutHandle = noTimeout;
    cancelTimeout(timeoutHandle);
  }
  if (workInProgress !== null) {
    let interruptedWork = workInProgress.return;
    while (interruptedWork !== null) {
      const current = interruptedWork.alternate;
      unwindInterruptedWork(current, interruptedWork);
      interruptedWork = interruptedWork.return;
    }
  }
  workInProgressRoot = root2;
  const rootWorkInProgress = createWorkInProgress(root2.current, null);
  workInProgress = rootWorkInProgress;
  workInProgressRootRenderLanes = subtreeRenderLanes = workInProgressRootIncludedLanes = lanes;
  workInProgressRootExitStatus = RootInProgress;
  workInProgressRootFatalError = null;
  workInProgressRootSkippedLanes = NoLanes;
  workInProgressRootInterleavedUpdatedLanes = NoLanes;
  workInProgressRootPingedLanes = NoLanes;
  workInProgressRootConcurrentErrors = null;
  workInProgressRootRecoverableErrors = null;
  finishQueueingConcurrentUpdates();
  return rootWorkInProgress;
}
__name(prepareFreshStack, "prepareFreshStack");
function handleError(root2, thrownValue) {
  do {
    let erroredWork = workInProgress;
    try {
      resetContextDependencies();
      resetHooksAfterThrow();
      resetCurrentFiber();
      ReactCurrentOwner$2.current = null;
      if (erroredWork === null || erroredWork.return === null) {
        workInProgressRootExitStatus = RootFatalErrored;
        workInProgressRootFatalError = thrownValue;
        workInProgress = null;
        return;
      }
      if (enableProfilerTimer && erroredWork.mode & ProfileMode) {
        stopProfilerTimerIfRunningAndRecordDelta(erroredWork, true);
      }
      if (enableSchedulingProfiler) {
        markComponentRenderStopped();
        if (thrownValue !== null && typeof thrownValue === "object" && typeof thrownValue.then === "function") {
          const wakeable = thrownValue;
          markComponentSuspended(erroredWork, wakeable, workInProgressRootRenderLanes);
        } else {
          markComponentErrored(erroredWork, thrownValue, workInProgressRootRenderLanes);
        }
      }
      throwException(root2, erroredWork.return, erroredWork, thrownValue, workInProgressRootRenderLanes);
      completeUnitOfWork(erroredWork);
    } catch (yetAnotherThrownValue) {
      thrownValue = yetAnotherThrownValue;
      if (workInProgress === erroredWork && erroredWork !== null) {
        erroredWork = erroredWork.return;
        workInProgress = erroredWork;
      } else {
        erroredWork = workInProgress;
      }
      continue;
    }
    return;
  } while (true);
}
__name(handleError, "handleError");
function pushDispatcher() {
  const prevDispatcher = ReactCurrentDispatcher$2.current;
  ReactCurrentDispatcher$2.current = ContextOnlyDispatcher;
  if (prevDispatcher === null) {
    return ContextOnlyDispatcher;
  } else {
    return prevDispatcher;
  }
}
__name(pushDispatcher, "pushDispatcher");
function popDispatcher(prevDispatcher) {
  ReactCurrentDispatcher$2.current = prevDispatcher;
}
__name(popDispatcher, "popDispatcher");
function markCommitTimeOfFallback() {
  globalMostRecentFallbackTime = now();
}
__name(markCommitTimeOfFallback, "markCommitTimeOfFallback");
function markSkippedUpdateLanes(lane) {
  workInProgressRootSkippedLanes = mergeLanes(lane, workInProgressRootSkippedLanes);
}
__name(markSkippedUpdateLanes, "markSkippedUpdateLanes");
function renderDidSuspend() {
  if (workInProgressRootExitStatus === RootInProgress) {
    workInProgressRootExitStatus = RootSuspended;
  }
}
__name(renderDidSuspend, "renderDidSuspend");
function renderDidSuspendDelayIfPossible() {
  if (workInProgressRootExitStatus === RootInProgress || workInProgressRootExitStatus === RootSuspended || workInProgressRootExitStatus === RootErrored) {
    workInProgressRootExitStatus = RootSuspendedWithDelay;
  }
  if (workInProgressRoot !== null && (includesNonIdleWork(workInProgressRootSkippedLanes) || includesNonIdleWork(workInProgressRootInterleavedUpdatedLanes))) {
    markRootSuspended$1(workInProgressRoot, workInProgressRootRenderLanes);
  }
}
__name(renderDidSuspendDelayIfPossible, "renderDidSuspendDelayIfPossible");
function renderDidError(error) {
  if (workInProgressRootExitStatus !== RootSuspendedWithDelay) {
    workInProgressRootExitStatus = RootErrored;
  }
  if (workInProgressRootConcurrentErrors === null) {
    workInProgressRootConcurrentErrors = [error];
  } else {
    workInProgressRootConcurrentErrors.push(error);
  }
}
__name(renderDidError, "renderDidError");
function renderHasNotSuspendedYet() {
  return workInProgressRootExitStatus === RootInProgress;
}
__name(renderHasNotSuspendedYet, "renderHasNotSuspendedYet");
function renderRootSync(root2, lanes) {
  const prevExecutionContext = executionContext;
  executionContext |= RenderContext;
  const prevDispatcher = pushDispatcher();
  if (workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes) {
    workInProgressTransitions = getTransitionsForLanes();
    prepareFreshStack(root2, lanes);
  }
  do {
    try {
      workLoopSync();
      break;
    } catch (thrownValue) {
      handleError(root2, thrownValue);
    }
  } while (true);
  resetContextDependencies();
  executionContext = prevExecutionContext;
  popDispatcher(prevDispatcher);
  if (workInProgress !== null) {
    throw Error(formatProdErrorMessage(261));
  }
  workInProgressRoot = null;
  workInProgressRootRenderLanes = NoLanes;
  return workInProgressRootExitStatus;
}
__name(renderRootSync, "renderRootSync");
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}
__name(workLoopSync, "workLoopSync");
function renderRootConcurrent(root2, lanes) {
  const prevExecutionContext = executionContext;
  executionContext |= RenderContext;
  const prevDispatcher = pushDispatcher();
  if (workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes) {
    workInProgressTransitions = getTransitionsForLanes();
    resetRenderTimer();
    prepareFreshStack(root2, lanes);
  }
  do {
    try {
      workLoopConcurrent();
      break;
    } catch (thrownValue) {
      handleError(root2, thrownValue);
    }
  } while (true);
  resetContextDependencies();
  popDispatcher(prevDispatcher);
  executionContext = prevExecutionContext;
  if (workInProgress !== null) {
    return RootInProgress;
  } else {
    workInProgressRoot = null;
    workInProgressRootRenderLanes = NoLanes;
    return workInProgressRootExitStatus;
  }
}
__name(renderRootConcurrent, "renderRootConcurrent");
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
__name(workLoopConcurrent, "workLoopConcurrent");
function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;
  let next;
  {
    next = beginWork$1(current, unitOfWork, subtreeRenderLanes);
  }
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
  ReactCurrentOwner$2.current = null;
}
__name(performUnitOfWork, "performUnitOfWork");
function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;
  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;
    if ((completedWork.flags & Incomplete) === NoFlags) {
      let next;
      {
        next = completeWork(current, completedWork, subtreeRenderLanes);
      }
      if (next !== null) {
        workInProgress = next;
        return;
      }
    } else {
      const next = unwindWork(current, completedWork);
      if (next !== null) {
        next.flags &= HostEffectMask;
        workInProgress = next;
        return;
      }
      if (returnFiber !== null) {
        returnFiber.flags |= Incomplete;
        returnFiber.subtreeFlags = NoFlags;
        returnFiber.deletions = null;
      } else {
        workInProgressRootExitStatus = RootDidNotComplete;
        workInProgress = null;
        return;
      }
    }
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }
    completedWork = returnFiber;
    workInProgress = completedWork;
  } while (completedWork !== null);
  if (workInProgressRootExitStatus === RootInProgress) {
    workInProgressRootExitStatus = RootCompleted;
  }
}
__name(completeUnitOfWork, "completeUnitOfWork");
function commitRoot(root2, recoverableErrors, transitions) {
  const previousUpdateLanePriority = getCurrentUpdatePriority();
  const prevTransition = ReactCurrentBatchConfig$3.transition;
  try {
    ReactCurrentBatchConfig$3.transition = null;
    setCurrentUpdatePriority(DiscreteEventPriority);
    commitRootImpl(root2, recoverableErrors, transitions, previousUpdateLanePriority);
  } finally {
    ReactCurrentBatchConfig$3.transition = prevTransition;
    setCurrentUpdatePriority(previousUpdateLanePriority);
  }
  return null;
}
__name(commitRoot, "commitRoot");
function commitRootImpl(root2, recoverableErrors, transitions, renderPriorityLevel) {
  do {
    flushPassiveEffects();
  } while (rootWithPendingPassiveEffects !== null);
  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
    throw Error(formatProdErrorMessage(327));
  }
  const finishedWork = root2.finishedWork;
  const lanes = root2.finishedLanes;
  if (finishedWork === null) {
    return null;
  }
  root2.finishedWork = null;
  root2.finishedLanes = NoLanes;
  if (finishedWork === root2.current) {
    throw Error(formatProdErrorMessage(177));
  }
  root2.callbackNode = null;
  root2.callbackPriority = NoLane;
  let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
  markRootFinished(root2, remainingLanes);
  if (root2 === workInProgressRoot) {
    workInProgressRoot = null;
    workInProgress = null;
    workInProgressRootRenderLanes = NoLanes;
  }
  if ((finishedWork.subtreeFlags & PassiveMask) !== NoFlags || (finishedWork.flags & PassiveMask) !== NoFlags) {
    if (!rootDoesHavePassiveEffects) {
      rootDoesHavePassiveEffects = true;
      pendingPassiveEffectsRemainingLanes = remainingLanes;
      pendingPassiveTransitions = transitions;
      scheduleCallback$2(NormalPriority2, () => {
        flushPassiveEffects();
        return null;
      });
    }
  }
  const subtreeHasEffects = (finishedWork.subtreeFlags & (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !== NoFlags;
  const rootHasEffect = (finishedWork.flags & (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !== NoFlags;
  if (subtreeHasEffects || rootHasEffect) {
    const prevTransition = ReactCurrentBatchConfig$3.transition;
    ReactCurrentBatchConfig$3.transition = null;
    const previousPriority = getCurrentUpdatePriority();
    setCurrentUpdatePriority(DiscreteEventPriority);
    const prevExecutionContext = executionContext;
    executionContext |= CommitContext;
    ReactCurrentOwner$2.current = null;
    const shouldFireAfterActiveInstanceBlur2 = commitBeforeMutationEffects(root2, finishedWork);
    commitMutationEffects(root2, finishedWork);
    resetAfterCommit(root2.containerInfo);
    root2.current = finishedWork;
    commitLayoutEffects(finishedWork, root2, lanes);
    requestPaint2();
    executionContext = prevExecutionContext;
    setCurrentUpdatePriority(previousPriority);
    ReactCurrentBatchConfig$3.transition = prevTransition;
  } else {
    root2.current = finishedWork;
  }
  if (rootDoesHavePassiveEffects) {
    rootDoesHavePassiveEffects = false;
    rootWithPendingPassiveEffects = root2;
    pendingPassiveEffectsLanes = lanes;
  } else {
    releaseRootPooledCache(root2, remainingLanes);
  }
  remainingLanes = root2.pendingLanes;
  if (remainingLanes === NoLanes) {
    legacyErrorBoundariesThatAlreadyFailed = null;
  }
  onCommitRoot(finishedWork.stateNode, renderPriorityLevel);
  ensureRootIsScheduled(root2, now());
  if (recoverableErrors !== null) {
    const onRecoverableError = root2.onRecoverableError;
    for (let i = 0; i < recoverableErrors.length; i++) {
      const recoverableError = recoverableErrors[i];
      const componentStack = recoverableError.stack;
      const digest = recoverableError.digest;
      onRecoverableError(recoverableError.value, {
        componentStack,
        digest
      });
    }
  }
  if (hasUncaughtError) {
    hasUncaughtError = false;
    const error = firstUncaughtError;
    firstUncaughtError = null;
    throw error;
  }
  if (includesSomeLane(pendingPassiveEffectsLanes, SyncLane) && root2.tag !== LegacyRoot) {
    flushPassiveEffects();
  }
  remainingLanes = root2.pendingLanes;
  if (includesSomeLane(remainingLanes, SyncLane)) {
    if (root2 === rootWithNestedUpdates) {
      nestedUpdateCount++;
    } else {
      nestedUpdateCount = 0;
      rootWithNestedUpdates = root2;
    }
  } else {
    nestedUpdateCount = 0;
  }
  flushSyncCallbacks();
  return null;
}
__name(commitRootImpl, "commitRootImpl");
function releaseRootPooledCache(root2, remainingLanes) {
  {
    const pooledCacheLanes = root2.pooledCacheLanes &= remainingLanes;
    if (pooledCacheLanes === NoLanes) {
      const pooledCache = root2.pooledCache;
      if (pooledCache != null) {
        root2.pooledCache = null;
        releaseCache(pooledCache);
      }
    }
  }
}
__name(releaseRootPooledCache, "releaseRootPooledCache");
function flushPassiveEffects() {
  if (rootWithPendingPassiveEffects !== null) {
    const root2 = rootWithPendingPassiveEffects;
    const remainingLanes = pendingPassiveEffectsRemainingLanes;
    pendingPassiveEffectsRemainingLanes = NoLanes;
    const renderPriority = lanesToEventPriority(pendingPassiveEffectsLanes);
    const priority = lowerEventPriority(DefaultEventPriority, renderPriority);
    const prevTransition = ReactCurrentBatchConfig$3.transition;
    const previousPriority = getCurrentUpdatePriority();
    try {
      ReactCurrentBatchConfig$3.transition = null;
      setCurrentUpdatePriority(priority);
      return flushPassiveEffectsImpl();
    } finally {
      setCurrentUpdatePriority(previousPriority);
      ReactCurrentBatchConfig$3.transition = prevTransition;
      releaseRootPooledCache(root2, remainingLanes);
    }
  }
  return false;
}
__name(flushPassiveEffects, "flushPassiveEffects");
function flushPassiveEffectsImpl() {
  if (rootWithPendingPassiveEffects === null) {
    return false;
  }
  const transitions = pendingPassiveTransitions;
  pendingPassiveTransitions = null;
  const root2 = rootWithPendingPassiveEffects;
  const lanes = pendingPassiveEffectsLanes;
  rootWithPendingPassiveEffects = null;
  pendingPassiveEffectsLanes = NoLanes;
  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
    throw Error(formatProdErrorMessage(331));
  }
  const prevExecutionContext = executionContext;
  executionContext |= CommitContext;
  commitPassiveUnmountEffects(root2.current);
  commitPassiveMountEffects(root2, root2.current, lanes, transitions);
  executionContext = prevExecutionContext;
  flushSyncCallbacks();
  onPostCommitRoot(root2);
  return true;
}
__name(flushPassiveEffectsImpl, "flushPassiveEffectsImpl");
function isAlreadyFailedLegacyErrorBoundary(instance) {
  return legacyErrorBoundariesThatAlreadyFailed !== null && legacyErrorBoundariesThatAlreadyFailed.has(instance);
}
__name(isAlreadyFailedLegacyErrorBoundary, "isAlreadyFailedLegacyErrorBoundary");
function markLegacyErrorBoundaryAsFailed(instance) {
  if (legacyErrorBoundariesThatAlreadyFailed === null) {
    legacyErrorBoundariesThatAlreadyFailed = /* @__PURE__ */ new Set([instance]);
  } else {
    legacyErrorBoundariesThatAlreadyFailed.add(instance);
  }
}
__name(markLegacyErrorBoundaryAsFailed, "markLegacyErrorBoundaryAsFailed");
function prepareToThrowUncaughtError(error) {
  if (!hasUncaughtError) {
    hasUncaughtError = true;
    firstUncaughtError = error;
  }
}
__name(prepareToThrowUncaughtError, "prepareToThrowUncaughtError");
var onUncaughtError = prepareToThrowUncaughtError;
function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
  const errorInfo = createCapturedValueAtFiber(error, sourceFiber);
  const update = createRootErrorUpdate(rootFiber, errorInfo, SyncLane);
  const root2 = enqueueUpdate(rootFiber, update, SyncLane);
  const eventTime = requestEventTime();
  if (root2 !== null) {
    markRootUpdated(root2, SyncLane, eventTime);
    ensureRootIsScheduled(root2, eventTime);
  }
}
__name(captureCommitPhaseErrorOnRoot, "captureCommitPhaseErrorOnRoot");
function captureCommitPhaseError(sourceFiber, nearestMountedAncestor, error) {
  if (sourceFiber.tag === HostRoot) {
    captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
    return;
  }
  let fiber = null;
  {
    fiber = nearestMountedAncestor;
  }
  while (fiber !== null) {
    if (fiber.tag === HostRoot) {
      captureCommitPhaseErrorOnRoot(fiber, sourceFiber, error);
      return;
    } else if (fiber.tag === ClassComponent) {
      const ctor = fiber.type;
      const instance = fiber.stateNode;
      if (typeof ctor.getDerivedStateFromError === "function" || typeof instance.componentDidCatch === "function" && !isAlreadyFailedLegacyErrorBoundary(instance)) {
        const errorInfo = createCapturedValueAtFiber(error, sourceFiber);
        const update = createClassErrorUpdate(fiber, errorInfo, SyncLane);
        const root2 = enqueueUpdate(fiber, update, SyncLane);
        const eventTime = requestEventTime();
        if (root2 !== null) {
          markRootUpdated(root2, SyncLane, eventTime);
          ensureRootIsScheduled(root2, eventTime);
        }
        return;
      }
    }
    fiber = fiber.return;
  }
}
__name(captureCommitPhaseError, "captureCommitPhaseError");
function pingSuspendedRoot(root2, wakeable, pingedLanes) {
  const pingCache = root2.pingCache;
  if (pingCache !== null) {
    pingCache.delete(wakeable);
  }
  const eventTime = requestEventTime();
  markRootPinged(root2, pingedLanes);
  if (workInProgressRoot === root2 && isSubsetOfLanes(workInProgressRootRenderLanes, pingedLanes)) {
    if (workInProgressRootExitStatus === RootSuspendedWithDelay || workInProgressRootExitStatus === RootSuspended && includesOnlyRetries(workInProgressRootRenderLanes) && now() - globalMostRecentFallbackTime < FALLBACK_THROTTLE_MS) {
      prepareFreshStack(root2, NoLanes);
    } else {
      workInProgressRootPingedLanes = mergeLanes(workInProgressRootPingedLanes, pingedLanes);
    }
  }
  ensureRootIsScheduled(root2, eventTime);
}
__name(pingSuspendedRoot, "pingSuspendedRoot");
function retryTimedOutBoundary(boundaryFiber, retryLane) {
  if (retryLane === NoLane) {
    retryLane = requestRetryLane(boundaryFiber);
  }
  const eventTime = requestEventTime();
  const root2 = enqueueConcurrentRenderForLane(boundaryFiber, retryLane);
  if (root2 !== null) {
    markRootUpdated(root2, retryLane, eventTime);
    ensureRootIsScheduled(root2, eventTime);
  }
}
__name(retryTimedOutBoundary, "retryTimedOutBoundary");
function retryDehydratedSuspenseBoundary(boundaryFiber) {
  const suspenseState = boundaryFiber.memoizedState;
  let retryLane = NoLane;
  if (suspenseState !== null) {
    retryLane = suspenseState.retryLane;
  }
  retryTimedOutBoundary(boundaryFiber, retryLane);
}
__name(retryDehydratedSuspenseBoundary, "retryDehydratedSuspenseBoundary");
function resolveRetryWakeable(boundaryFiber, wakeable) {
  let retryLane = NoLane;
  let retryCache;
  switch (boundaryFiber.tag) {
    case SuspenseComponent:
      retryCache = boundaryFiber.stateNode;
      const suspenseState = boundaryFiber.memoizedState;
      if (suspenseState !== null) {
        retryLane = suspenseState.retryLane;
      }
      break;
    case SuspenseListComponent:
      retryCache = boundaryFiber.stateNode;
      break;
    default:
      throw Error(formatProdErrorMessage(314));
  }
  if (retryCache !== null) {
    retryCache.delete(wakeable);
  }
  retryTimedOutBoundary(boundaryFiber, retryLane);
}
__name(resolveRetryWakeable, "resolveRetryWakeable");
function jnd(timeElapsed) {
  return timeElapsed < 120 ? 120 : timeElapsed < 480 ? 480 : timeElapsed < 1080 ? 1080 : timeElapsed < 1920 ? 1920 : timeElapsed < 3e3 ? 3e3 : timeElapsed < 4320 ? 4320 : ceil(timeElapsed / 1960) * 1960;
}
__name(jnd, "jnd");
function checkForNestedUpdates() {
  if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
    nestedUpdateCount = 0;
    rootWithNestedUpdates = null;
    throw Error(formatProdErrorMessage(185));
  }
}
__name(checkForNestedUpdates, "checkForNestedUpdates");
var beginWork$1;
{
  beginWork$1 = beginWork;
}
function scheduleCallback$2(priorityLevel, callback) {
  {
    return scheduleCallback(priorityLevel, callback);
  }
}
__name(scheduleCallback$2, "scheduleCallback$2");
function cancelCallback$1(callbackNode) {
  return cancelCallback(callbackNode);
}
__name(cancelCallback$1, "cancelCallback$1");
function shouldForceFlushFallbacksInDEV() {
  return false;
}
__name(shouldForceFlushFallbacksInDEV, "shouldForceFlushFallbacksInDEV");
function FiberNode(tag, pendingProps, key, mode) {
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;
  this.mode = mode;
  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.deletions = null;
  this.lanes = NoLanes;
  this.childLanes = NoLanes;
  this.alternate = null;
}
__name(FiberNode, "FiberNode");
var createFiber = /* @__PURE__ */ __name(function(tag, pendingProps, key, mode) {
  return new FiberNode(tag, pendingProps, key, mode);
}, "createFiber");
function shouldConstruct(Component) {
  const prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}
__name(shouldConstruct, "shouldConstruct");
function isSimpleFunctionComponent(type) {
  return typeof type === "function" && !shouldConstruct(type) && type.defaultProps === void 0;
}
__name(isSimpleFunctionComponent, "isSimpleFunctionComponent");
function resolveLazyComponentTag(Component) {
  if (typeof Component === "function") {
    return shouldConstruct(Component) ? ClassComponent : FunctionComponent;
  } else if (Component !== void 0 && Component !== null) {
    const $$typeof = Component.$$typeof;
    if ($$typeof === REACT_FORWARD_REF_TYPE) {
      return ForwardRef;
    }
    if ($$typeof === REACT_MEMO_TYPE) {
      return MemoComponent;
    }
  }
  return IndeterminateComponent;
}
__name(resolveLazyComponentTag, "resolveLazyComponentTag");
function createWorkInProgress(current, pendingProps) {
  let workInProgress2 = current.alternate;
  if (workInProgress2 === null) {
    workInProgress2 = createFiber(current.tag, pendingProps, current.key, current.mode);
    workInProgress2.elementType = current.elementType;
    workInProgress2.type = current.type;
    workInProgress2.stateNode = current.stateNode;
    workInProgress2.alternate = current;
    current.alternate = workInProgress2;
  } else {
    workInProgress2.pendingProps = pendingProps;
    workInProgress2.type = current.type;
    workInProgress2.flags = NoFlags;
    workInProgress2.subtreeFlags = NoFlags;
    workInProgress2.deletions = null;
  }
  workInProgress2.flags = current.flags & StaticMask;
  workInProgress2.childLanes = current.childLanes;
  workInProgress2.lanes = current.lanes;
  workInProgress2.child = current.child;
  workInProgress2.memoizedProps = current.memoizedProps;
  workInProgress2.memoizedState = current.memoizedState;
  workInProgress2.updateQueue = current.updateQueue;
  const currentDependencies = current.dependencies;
  workInProgress2.dependencies = currentDependencies === null ? null : {
    lanes: currentDependencies.lanes,
    firstContext: currentDependencies.firstContext
  };
  workInProgress2.sibling = current.sibling;
  workInProgress2.index = current.index;
  workInProgress2.ref = current.ref;
  return workInProgress2;
}
__name(createWorkInProgress, "createWorkInProgress");
function resetWorkInProgress(workInProgress2, renderLanes2) {
  workInProgress2.flags &= StaticMask | Placement;
  const current = workInProgress2.alternate;
  if (current === null) {
    workInProgress2.childLanes = NoLanes;
    workInProgress2.lanes = renderLanes2;
    workInProgress2.child = null;
    workInProgress2.subtreeFlags = NoFlags;
    workInProgress2.memoizedProps = null;
    workInProgress2.memoizedState = null;
    workInProgress2.updateQueue = null;
    workInProgress2.dependencies = null;
    workInProgress2.stateNode = null;
  } else {
    workInProgress2.childLanes = current.childLanes;
    workInProgress2.lanes = current.lanes;
    workInProgress2.child = current.child;
    workInProgress2.subtreeFlags = NoFlags;
    workInProgress2.deletions = null;
    workInProgress2.memoizedProps = current.memoizedProps;
    workInProgress2.memoizedState = current.memoizedState;
    workInProgress2.updateQueue = current.updateQueue;
    workInProgress2.type = current.type;
    const currentDependencies = current.dependencies;
    workInProgress2.dependencies = currentDependencies === null ? null : {
      lanes: currentDependencies.lanes,
      firstContext: currentDependencies.firstContext
    };
  }
  return workInProgress2;
}
__name(resetWorkInProgress, "resetWorkInProgress");
function createHostRootFiber(tag, isStrictMode, concurrentUpdatesByDefaultOverride) {
  let mode;
  if (tag === ConcurrentRoot) {
    mode = ConcurrentMode;
    if (isStrictMode === true) {
      mode |= StrictLegacyMode;
    }
  } else {
    mode = NoMode;
  }
  return createFiber(HostRoot, null, null, mode);
}
__name(createHostRootFiber, "createHostRootFiber");
function createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes) {
  let fiberTag = IndeterminateComponent;
  let resolvedType = type;
  if (typeof type === "function") {
    if (shouldConstruct(type)) {
      fiberTag = ClassComponent;
    }
  } else if (typeof type === "string") {
    fiberTag = HostComponent;
  } else {
    getTag:
      switch (type) {
        case REACT_FRAGMENT_TYPE:
          return createFiberFromFragment(pendingProps.children, mode, lanes, key);
        case REACT_STRICT_MODE_TYPE:
          fiberTag = Mode;
          mode |= StrictLegacyMode;
          break;
        case REACT_PROFILER_TYPE:
          return createFiberFromProfiler(pendingProps, mode, lanes, key);
        case REACT_SUSPENSE_TYPE:
          return createFiberFromSuspense(pendingProps, mode, lanes, key);
        case REACT_SUSPENSE_LIST_TYPE:
          return createFiberFromSuspenseList(pendingProps, mode, lanes, key);
        case REACT_OFFSCREEN_TYPE:
          return createFiberFromOffscreen(pendingProps, mode, lanes, key);
        case REACT_LEGACY_HIDDEN_TYPE:
        case REACT_SCOPE_TYPE:
        case REACT_CACHE_TYPE: {
          return createFiberFromCache(pendingProps, mode, lanes, key);
        }
        case REACT_TRACING_MARKER_TYPE:
        case REACT_DEBUG_TRACING_MODE_TYPE:
        default: {
          if (typeof type === "object" && type !== null) {
            switch (type.$$typeof) {
              case REACT_PROVIDER_TYPE:
                fiberTag = ContextProvider;
                break getTag;
              case REACT_CONTEXT_TYPE:
                fiberTag = ContextConsumer;
                break getTag;
              case REACT_FORWARD_REF_TYPE:
                fiberTag = ForwardRef;
                break getTag;
              case REACT_MEMO_TYPE:
                fiberTag = MemoComponent;
                break getTag;
              case REACT_LAZY_TYPE:
                fiberTag = LazyComponent;
                resolvedType = null;
                break getTag;
            }
          }
          let info = "";
          throw Error(formatProdErrorMessage(130, type == null ? type : typeof type, info));
        }
      }
  }
  const fiber = createFiber(fiberTag, pendingProps, key, mode);
  fiber.elementType = type;
  fiber.type = resolvedType;
  fiber.lanes = lanes;
  return fiber;
}
__name(createFiberFromTypeAndProps, "createFiberFromTypeAndProps");
function createFiberFromElement(element, mode, lanes) {
  let owner = null;
  const type = element.type;
  const key = element.key;
  const pendingProps = element.props;
  const fiber = createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes);
  return fiber;
}
__name(createFiberFromElement, "createFiberFromElement");
function createFiberFromFragment(elements, mode, lanes, key) {
  const fiber = createFiber(Fragment, elements, key, mode);
  fiber.lanes = lanes;
  return fiber;
}
__name(createFiberFromFragment, "createFiberFromFragment");
function createFiberFromProfiler(pendingProps, mode, lanes, key) {
  const fiber = createFiber(Profiler, pendingProps, key, mode | ProfileMode);
  fiber.elementType = REACT_PROFILER_TYPE;
  fiber.lanes = lanes;
  return fiber;
}
__name(createFiberFromProfiler, "createFiberFromProfiler");
function createFiberFromSuspense(pendingProps, mode, lanes, key) {
  const fiber = createFiber(SuspenseComponent, pendingProps, key, mode);
  fiber.elementType = REACT_SUSPENSE_TYPE;
  fiber.lanes = lanes;
  return fiber;
}
__name(createFiberFromSuspense, "createFiberFromSuspense");
function createFiberFromSuspenseList(pendingProps, mode, lanes, key) {
  const fiber = createFiber(SuspenseListComponent, pendingProps, key, mode);
  fiber.elementType = REACT_SUSPENSE_LIST_TYPE;
  fiber.lanes = lanes;
  return fiber;
}
__name(createFiberFromSuspenseList, "createFiberFromSuspenseList");
function createFiberFromOffscreen(pendingProps, mode, lanes, key) {
  const fiber = createFiber(OffscreenComponent, pendingProps, key, mode);
  fiber.elementType = REACT_OFFSCREEN_TYPE;
  fiber.lanes = lanes;
  const primaryChildInstance = {
    isHidden: false
  };
  fiber.stateNode = primaryChildInstance;
  return fiber;
}
__name(createFiberFromOffscreen, "createFiberFromOffscreen");
function createFiberFromCache(pendingProps, mode, lanes, key) {
  const fiber = createFiber(CacheComponent, pendingProps, key, mode);
  fiber.elementType = REACT_CACHE_TYPE;
  fiber.lanes = lanes;
  return fiber;
}
__name(createFiberFromCache, "createFiberFromCache");
function createFiberFromText(content, mode, lanes) {
  const fiber = createFiber(HostText, content, null, mode);
  fiber.lanes = lanes;
  return fiber;
}
__name(createFiberFromText, "createFiberFromText");
function createFiberFromHostInstanceForDeletion() {
  const fiber = createFiber(HostComponent, null, null, NoMode);
  fiber.elementType = "DELETED";
  return fiber;
}
__name(createFiberFromHostInstanceForDeletion, "createFiberFromHostInstanceForDeletion");
function createFiberFromDehydratedFragment(dehydratedNode) {
  const fiber = createFiber(DehydratedFragment, null, null, NoMode);
  fiber.stateNode = dehydratedNode;
  return fiber;
}
__name(createFiberFromDehydratedFragment, "createFiberFromDehydratedFragment");
function createFiberFromPortal(portal, mode, lanes) {
  const pendingProps = portal.children !== null ? portal.children : [];
  const fiber = createFiber(HostPortal, pendingProps, portal.key, mode);
  fiber.lanes = lanes;
  fiber.stateNode = {
    containerInfo: portal.containerInfo,
    pendingChildren: null,
    // Used by persistent updates
    implementation: portal.implementation
  };
  return fiber;
}
__name(createFiberFromPortal, "createFiberFromPortal");
function FiberRootNode(containerInfo, tag, hydrate2, identifierPrefix, onRecoverableError) {
  this.tag = tag;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.current = null;
  this.pingCache = null;
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  this.callbackNode = null;
  this.callbackPriority = NoLane;
  this.eventTimes = createLaneMap(NoLanes);
  this.expirationTimes = createLaneMap(NoTimestamp);
  this.pendingLanes = NoLanes;
  this.suspendedLanes = NoLanes;
  this.pingedLanes = NoLanes;
  this.expiredLanes = NoLanes;
  this.mutableReadLanes = NoLanes;
  this.finishedLanes = NoLanes;
  this.entangledLanes = NoLanes;
  this.entanglements = createLaneMap(NoLanes);
  this.identifierPrefix = identifierPrefix;
  this.onRecoverableError = onRecoverableError;
  {
    this.pooledCache = null;
    this.pooledCacheLanes = NoLanes;
  }
  {
    this.mutableSourceEagerHydrationData = null;
  }
}
__name(FiberRootNode, "FiberRootNode");
function createFiberRoot(containerInfo, tag, hydrate2, initialChildren, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError, transitionCallbacks) {
  const root2 = new FiberRootNode(containerInfo, tag, hydrate2, identifierPrefix, onRecoverableError);
  const uninitializedFiber = createHostRootFiber(tag, isStrictMode);
  root2.current = uninitializedFiber;
  uninitializedFiber.stateNode = root2;
  {
    const initialCache = createCache();
    retainCache(initialCache);
    root2.pooledCache = initialCache;
    retainCache(initialCache);
    const initialState = {
      element: initialChildren,
      isDehydrated: hydrate2,
      cache: initialCache,
      transitions: null,
      pendingSuspenseBoundaries: null
    };
    uninitializedFiber.memoizedState = initialState;
  }
  initializeUpdateQueue(uninitializedFiber);
  return root2;
}
__name(createFiberRoot, "createFiberRoot");
var ReactVersion = "18.3.1";
function createPortal(children, containerInfo, implementation) {
  let key = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    // This tag allow us to uniquely identify this as a React Portal
    $$typeof: REACT_PORTAL_TYPE,
    key: key == null ? null : "" + key,
    children,
    containerInfo,
    implementation
  };
}
__name(createPortal, "createPortal");
function getContextForSubtree(parentComponent) {
  if (!parentComponent) {
    return emptyContextObject;
  }
  const fiber = get(parentComponent);
  const parentContext = findCurrentUnmaskedContext(fiber);
  if (fiber.tag === ClassComponent) {
    const Component = fiber.type;
    if (isContextProvider(Component)) {
      return processChildContext(fiber, Component, parentContext);
    }
  }
  return parentContext;
}
__name(getContextForSubtree, "getContextForSubtree");
function findHostInstance(component) {
  const fiber = get(component);
  if (fiber === void 0) {
    if (typeof component.render === "function") {
      throw Error(formatProdErrorMessage(188));
    } else {
      const keys = Object.keys(component).join(",");
      throw Error(formatProdErrorMessage(268, keys));
    }
  }
  const hostFiber = findCurrentHostFiber(fiber);
  if (hostFiber === null) {
    return null;
  }
  return hostFiber.stateNode;
}
__name(findHostInstance, "findHostInstance");
function createContainer(containerInfo, tag, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError, transitionCallbacks) {
  const hydrate2 = false;
  const initialChildren = null;
  return createFiberRoot(containerInfo, tag, hydrate2, initialChildren, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError);
}
__name(createContainer, "createContainer");
function createHydrationContainer(initialChildren, callback, containerInfo, tag, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError, transitionCallbacks) {
  const hydrate2 = true;
  const root2 = createFiberRoot(containerInfo, tag, hydrate2, initialChildren, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError);
  root2.context = getContextForSubtree(null);
  const current = root2.current;
  const eventTime = requestEventTime();
  const lane = requestUpdateLane(current);
  const update = createUpdate(eventTime, lane);
  update.callback = callback !== void 0 && callback !== null ? callback : null;
  enqueueUpdate(current, update, lane);
  scheduleInitialHydrationOnRoot(root2, lane, eventTime);
  return root2;
}
__name(createHydrationContainer, "createHydrationContainer");
function updateContainer(element, container, parentComponent, callback) {
  const current = container.current;
  const eventTime = requestEventTime();
  const lane = requestUpdateLane(current);
  const context = getContextForSubtree(parentComponent);
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }
  const update = createUpdate(eventTime, lane);
  update.payload = {
    element
  };
  callback = callback === void 0 ? null : callback;
  if (callback !== null) {
    update.callback = callback;
  }
  const root2 = enqueueUpdate(current, update, lane);
  if (root2 !== null) {
    scheduleUpdateOnFiber(root2, current, lane, eventTime);
    entangleTransitions(root2, current, lane);
  }
  return lane;
}
__name(updateContainer, "updateContainer");
function getPublicRootInstance(container) {
  const containerFiber = container.current;
  if (!containerFiber.child) {
    return null;
  }
  switch (containerFiber.child.tag) {
    case HostComponent:
      return getPublicInstance(containerFiber.child.stateNode);
    default:
      return containerFiber.child.stateNode;
  }
}
__name(getPublicRootInstance, "getPublicRootInstance");
function attemptSynchronousHydration$1(fiber) {
  switch (fiber.tag) {
    case HostRoot: {
      const root2 = fiber.stateNode;
      if (isRootDehydrated(root2)) {
        const lanes = getHighestPriorityPendingLanes(root2);
        flushRoot(root2, lanes);
      }
      break;
    }
    case SuspenseComponent: {
      flushSync(() => {
        const root2 = enqueueConcurrentRenderForLane(fiber, SyncLane);
        if (root2 !== null) {
          const eventTime = requestEventTime();
          scheduleUpdateOnFiber(root2, fiber, SyncLane, eventTime);
        }
      });
      const retryLane = SyncLane;
      markRetryLaneIfNotHydrated(fiber, retryLane);
      break;
    }
  }
}
__name(attemptSynchronousHydration$1, "attemptSynchronousHydration$1");
function markRetryLaneImpl(fiber, retryLane) {
  const suspenseState = fiber.memoizedState;
  if (suspenseState !== null && suspenseState.dehydrated !== null) {
    suspenseState.retryLane = higherPriorityLane(suspenseState.retryLane, retryLane);
  }
}
__name(markRetryLaneImpl, "markRetryLaneImpl");
function markRetryLaneIfNotHydrated(fiber, retryLane) {
  markRetryLaneImpl(fiber, retryLane);
  const alternate = fiber.alternate;
  if (alternate) {
    markRetryLaneImpl(alternate, retryLane);
  }
}
__name(markRetryLaneIfNotHydrated, "markRetryLaneIfNotHydrated");
function attemptContinuousHydration$1(fiber) {
  if (fiber.tag !== SuspenseComponent) {
    return;
  }
  const lane = SelectiveHydrationLane;
  const root2 = enqueueConcurrentRenderForLane(fiber, lane);
  if (root2 !== null) {
    const eventTime = requestEventTime();
    scheduleUpdateOnFiber(root2, fiber, lane, eventTime);
  }
  markRetryLaneIfNotHydrated(fiber, lane);
}
__name(attemptContinuousHydration$1, "attemptContinuousHydration$1");
function attemptHydrationAtCurrentPriority$1(fiber) {
  if (fiber.tag !== SuspenseComponent) {
    return;
  }
  const lane = requestUpdateLane(fiber);
  const root2 = enqueueConcurrentRenderForLane(fiber, lane);
  if (root2 !== null) {
    const eventTime = requestEventTime();
    scheduleUpdateOnFiber(root2, fiber, lane, eventTime);
  }
  markRetryLaneIfNotHydrated(fiber, lane);
}
__name(attemptHydrationAtCurrentPriority$1, "attemptHydrationAtCurrentPriority$1");
var overrideHookState = null;
var overrideHookStateDeletePath = null;
var overrideHookStateRenamePath = null;
var overrideProps = null;
var overridePropsDeletePath = null;
var overridePropsRenamePath = null;
var scheduleUpdate = null;
var setErrorHandler = null;
var setSuspenseHandler = null;
function findHostInstanceByFiber(fiber) {
  const hostFiber = findCurrentHostFiber(fiber);
  if (hostFiber === null) {
    return null;
  }
  return hostFiber.stateNode;
}
__name(findHostInstanceByFiber, "findHostInstanceByFiber");
function emptyFindFiberByHostInstance(instance) {
  return null;
}
__name(emptyFindFiberByHostInstance, "emptyFindFiberByHostInstance");
function injectIntoDevTools(devToolsConfig) {
  const findFiberByHostInstance = devToolsConfig.findFiberByHostInstance;
  const ReactCurrentDispatcher2 = ReactSharedInternals.ReactCurrentDispatcher;
  return injectInternals({
    bundleType: devToolsConfig.bundleType,
    version: devToolsConfig.version,
    rendererPackageName: devToolsConfig.rendererPackageName,
    rendererConfig: devToolsConfig.rendererConfig,
    overrideHookState,
    overrideHookStateDeletePath,
    overrideHookStateRenamePath,
    overrideProps,
    overridePropsDeletePath,
    overridePropsRenamePath,
    setErrorHandler,
    setSuspenseHandler,
    scheduleUpdate,
    currentDispatcherRef: ReactCurrentDispatcher2,
    findHostInstanceByFiber,
    findFiberByHostInstance: findFiberByHostInstance || emptyFindFiberByHostInstance,
    // React Refresh
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    // Enables DevTools to append owner stacks to error messages in DEV mode.
    getCurrentFiber: null,
    // Enables DevTools to detect reconciler version rather than renderer version
    // which may not match for third party renderers.
    reconcilerVersion: ReactVersion
  });
}
__name(injectIntoDevTools, "injectIntoDevTools");
var defaultOnRecoverableError = typeof reportError === "function" ? (
  // In modern browsers, reportError will dispatch an error event,
  // emulating an uncaught JavaScript error.
  reportError
) : (error) => {
  console["error"](error);
};
function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}
__name(ReactDOMRoot, "ReactDOMRoot");
ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = function(children) {
  const root2 = this._internalRoot;
  if (root2 === null) {
    throw Error(formatProdErrorMessage(409));
  }
  updateContainer(children, root2, null, null);
};
ReactDOMHydrationRoot.prototype.unmount = ReactDOMRoot.prototype.unmount = function() {
  const root2 = this._internalRoot;
  if (root2 !== null) {
    this._internalRoot = null;
    const container = root2.containerInfo;
    flushSync(() => {
      updateContainer(null, root2, null, null);
    });
    unmarkContainerAsRoot(container);
  }
};
function createRoot(container, options) {
  if (!isValidContainer(container)) {
    throw Error(formatProdErrorMessage(299));
  }
  let isStrictMode = false;
  let concurrentUpdatesByDefaultOverride = false;
  let identifierPrefix = "";
  let onRecoverableError = defaultOnRecoverableError;
  let transitionCallbacks = null;
  if (options !== null && options !== void 0) {
    if (options.unstable_strictMode === true) {
      isStrictMode = true;
    }
    if (options.identifierPrefix !== void 0) {
      identifierPrefix = options.identifierPrefix;
    }
    if (options.onRecoverableError !== void 0) {
      onRecoverableError = options.onRecoverableError;
    }
    if (options.transitionCallbacks !== void 0) {
      transitionCallbacks = options.transitionCallbacks;
    }
  }
  const root2 = createContainer(container, ConcurrentRoot, null, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError);
  markContainerAsRoot(root2.current, container);
  const rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
  listenToAllSupportedEvents(rootContainerElement);
  return new ReactDOMRoot(root2);
}
__name(createRoot, "createRoot");
function ReactDOMHydrationRoot(internalRoot) {
  this._internalRoot = internalRoot;
}
__name(ReactDOMHydrationRoot, "ReactDOMHydrationRoot");
function scheduleHydration(target) {
  if (target) {
    queueExplicitHydrationTarget(target);
  }
}
__name(scheduleHydration, "scheduleHydration");
ReactDOMHydrationRoot.prototype.unstable_scheduleHydration = scheduleHydration;
function hydrateRoot(container, initialChildren, options) {
  if (!isValidContainer(container)) {
    throw Error(formatProdErrorMessage(405));
  }
  const hydrationCallbacks = options != null ? options : null;
  const mutableSources = options != null && options.hydratedSources || null;
  let isStrictMode = false;
  let concurrentUpdatesByDefaultOverride = false;
  let identifierPrefix = "";
  let onRecoverableError = defaultOnRecoverableError;
  if (options !== null && options !== void 0) {
    if (options.unstable_strictMode === true) {
      isStrictMode = true;
    }
    if (options.identifierPrefix !== void 0) {
      identifierPrefix = options.identifierPrefix;
    }
    if (options.onRecoverableError !== void 0) {
      onRecoverableError = options.onRecoverableError;
    }
  }
  const root2 = createHydrationContainer(initialChildren, null, container, ConcurrentRoot, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError);
  markContainerAsRoot(root2.current, container);
  listenToAllSupportedEvents(container);
  if (mutableSources) {
    for (let i = 0; i < mutableSources.length; i++) {
      const mutableSource = mutableSources[i];
      registerMutableSourceForHydration(root2, mutableSource);
    }
  }
  return new ReactDOMHydrationRoot(root2);
}
__name(hydrateRoot, "hydrateRoot");
function isValidContainer(node) {
  return !!(node && (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE || !disableCommentsAsDOMContainers));
}
__name(isValidContainer, "isValidContainer");
function isValidContainerLegacy(node) {
  return !!(node && (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE || node.nodeType === COMMENT_NODE && node.nodeValue === " react-mount-point-unstable "));
}
__name(isValidContainerLegacy, "isValidContainerLegacy");
var ReactCurrentOwner$3 = ReactSharedInternals.ReactCurrentOwner;
function noopOnRecoverableError() {
}
__name(noopOnRecoverableError, "noopOnRecoverableError");
function legacyCreateRootFromDOMContainer(container, initialChildren, parentComponent, callback, isHydrationContainer) {
  if (isHydrationContainer) {
    if (typeof callback === "function") {
      const originalCallback = callback;
      callback = /* @__PURE__ */ __name(function() {
        const instance = getPublicRootInstance(root2);
        originalCallback.call(instance);
      }, "callback");
    }
    const root2 = createHydrationContainer(
      initialChildren,
      callback,
      container,
      LegacyRoot,
      null,
      // hydrationCallbacks
      false,
      // isStrictMode
      false,
      // concurrentUpdatesByDefaultOverride,
      "",
      // identifierPrefix
      noopOnRecoverableError
    );
    container._reactRootContainer = root2;
    markContainerAsRoot(root2.current, container);
    const rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
    listenToAllSupportedEvents(rootContainerElement);
    flushSync();
    return root2;
  } else {
    let rootSibling;
    while (rootSibling = container.lastChild) {
      container.removeChild(rootSibling);
    }
    if (typeof callback === "function") {
      const originalCallback = callback;
      callback = /* @__PURE__ */ __name(function() {
        const instance = getPublicRootInstance(root2);
        originalCallback.call(instance);
      }, "callback");
    }
    const root2 = createContainer(
      container,
      LegacyRoot,
      null,
      // hydrationCallbacks
      false,
      // isStrictMode
      false,
      // concurrentUpdatesByDefaultOverride,
      "",
      // identifierPrefix
      noopOnRecoverableError
    );
    container._reactRootContainer = root2;
    markContainerAsRoot(root2.current, container);
    const rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
    listenToAllSupportedEvents(rootContainerElement);
    flushSync(() => {
      updateContainer(initialChildren, root2, parentComponent, callback);
    });
    return root2;
  }
}
__name(legacyCreateRootFromDOMContainer, "legacyCreateRootFromDOMContainer");
function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
  const maybeRoot = container._reactRootContainer;
  let root2;
  if (!maybeRoot) {
    root2 = legacyCreateRootFromDOMContainer(container, children, parentComponent, callback, forceHydrate);
  } else {
    root2 = maybeRoot;
    if (typeof callback === "function") {
      const originalCallback = callback;
      callback = /* @__PURE__ */ __name(function() {
        const instance = getPublicRootInstance(root2);
        originalCallback.call(instance);
      }, "callback");
    }
    updateContainer(children, root2, parentComponent, callback);
  }
  return getPublicRootInstance(root2);
}
__name(legacyRenderSubtreeIntoContainer, "legacyRenderSubtreeIntoContainer");
function findDOMNode(componentOrElement) {
  if (componentOrElement == null) {
    return null;
  }
  if (componentOrElement.nodeType === ELEMENT_NODE) {
    return componentOrElement;
  }
  return findHostInstance(componentOrElement);
}
__name(findDOMNode, "findDOMNode");
function hydrate(element, container, callback) {
  if (!isValidContainerLegacy(container)) {
    throw Error(formatProdErrorMessage(200));
  }
  return legacyRenderSubtreeIntoContainer(null, element, container, true, callback);
}
__name(hydrate, "hydrate");
function render(element, container, callback) {
  if (!isValidContainerLegacy(container)) {
    throw Error(formatProdErrorMessage(200));
  }
  return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
}
__name(render, "render");
function unstable_renderSubtreeIntoContainer(parentComponent, element, containerNode, callback) {
  if (!isValidContainerLegacy(containerNode)) {
    throw Error(formatProdErrorMessage(200));
  }
  if (parentComponent == null || !has(parentComponent)) {
    throw Error(formatProdErrorMessage(38));
  }
  return legacyRenderSubtreeIntoContainer(parentComponent, element, containerNode, false, callback);
}
__name(unstable_renderSubtreeIntoContainer, "unstable_renderSubtreeIntoContainer");
function unmountComponentAtNode(container) {
  if (!isValidContainerLegacy(container)) {
    throw Error(formatProdErrorMessage(40));
  }
  if (container._reactRootContainer) {
    flushSync(() => {
      legacyRenderSubtreeIntoContainer(null, null, container, false, () => {
        container._reactRootContainer = null;
        unmarkContainerAsRoot(container);
      });
    });
    return true;
  } else {
    return false;
  }
}
__name(unmountComponentAtNode, "unmountComponentAtNode");
setAttemptSynchronousHydration(attemptSynchronousHydration$1);
setAttemptContinuousHydration(attemptContinuousHydration$1);
setAttemptHydrationAtCurrentPriority(attemptHydrationAtCurrentPriority$1);
setGetCurrentUpdatePriority(getCurrentUpdatePriority);
setAttemptHydrationAtPriority(runWithPriority);
setRestoreImplementation(restoreControlledState$3);
setBatchingImplementation(batchedUpdates$1, discreteUpdates, flushSync);
function createPortal$1(children, container) {
  let key = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
  if (!isValidContainer(container)) {
    throw Error(formatProdErrorMessage(200));
  }
  return createPortal(children, container, null, key);
}
__name(createPortal$1, "createPortal$1");
function renderSubtreeIntoContainer(parentComponent, element, containerNode, callback) {
  return unstable_renderSubtreeIntoContainer(parentComponent, element, containerNode, callback);
}
__name(renderSubtreeIntoContainer, "renderSubtreeIntoContainer");
var Internals = {
  usingClientEntryPoint: false,
  // Keep in sync with ReactTestUtils.js.
  // This is an array for better minification.
  Events: [getInstanceFromNode, getNodeFromInstance, getFiberCurrentPropsFromNode, enqueueStateRestore, restoreStateIfNeeded, batchedUpdates$1]
};
function createRoot$1(container, options) {
  return createRoot(container, options);
}
__name(createRoot$1, "createRoot$1");
function hydrateRoot$1(container, initialChildren, options) {
  return hydrateRoot(container, initialChildren, options);
}
__name(hydrateRoot$1, "hydrateRoot$1");
function flushSync$1(fn) {
  return flushSync(fn);
}
__name(flushSync$1, "flushSync$1");
var foundDevTools = injectIntoDevTools({
  findFiberByHostInstance: getClosestInstanceFromNode,
  bundleType: 0,
  version: ReactVersion,
  rendererPackageName: "react-dom"
});

// src/react-dom.mjs
var react_dom_default = react_dom_esm_exports;
export {
  Internals as __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  createPortal$1 as createPortal,
  createRoot$1 as createRoot,
  react_dom_default as default,
  findDOMNode,
  flushSync$1 as flushSync,
  hydrate,
  hydrateRoot$1 as hydrateRoot,
  render,
  unmountComponentAtNode,
  batchedUpdates$1 as unstable_batchedUpdates,
  renderSubtreeIntoContainer as unstable_renderSubtreeIntoContainer,
  runWithPriority as unstable_runWithPriority,
  ReactVersion as version
};
/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
//# sourceMappingURL=react-dom.js.map
