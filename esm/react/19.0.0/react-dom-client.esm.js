import * as React from 'react';
import { Children } from 'react';

const _missingExportShim = void 0;

const favorSafetyOverHydrationPerf = true;
const enableAsyncActions = true;
const disableDefaultPropsExceptForClasses = true;
const enableAsyncIterableChildren = false;
const enableLegacyHidden = false;
const alwaysThrottleRetries = true;
const enableOwnerStacks = false;
const enableSiblingPrerendering = true;
const syncLaneExpirationMs = 250;
const transitionLaneExpirationMs = 5000;
const disableIEWorkarounds = true;
const disableLegacyMode = true;
const disableCommentsAsDOMContainers = true;
const enableProfilerTimer = false;
const enableSchedulingProfiler = false;

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const DOCUMENT_NODE = 9;
const DOCUMENT_TYPE_NODE = 10;
const DOCUMENT_FRAGMENT_NODE = 11;

function isValidContainer(node) {
  return !!(node && (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE || !disableCommentsAsDOMContainers  ));
}

const enableSchedulerDebugging = false;
const enableProfiling = false;
const frameYieldMs = 5;
const userBlockingPriorityTimeout = 250;
const normalPriorityTimeout = 5000;
const lowPriorityTimeout = 10000;

function push$1(heap, node) {
  const index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}
function peek(heap) {
  return heap.length === 0 ? null : heap[0];
}
function pop$1(heap) {
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

function siftUp(heap, node, i) {
  let index = i;

  while (index > 0) {
    const parentIndex = index - 1 >>> 1;
    const parent = heap[parentIndex];

    if (compare(parent, node) > 0) {
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      return;
    }
  }
}

function siftDown(heap, node, i) {
  let index = i;
  const length = heap.length;
  const halfLength = length >>> 1;

  while (index < halfLength) {
    const leftIndex = (index + 1) * 2 - 1;
    const left = heap[leftIndex];
    const rightIndex = leftIndex + 1;
    const right = heap[rightIndex];

    if (compare(left, node) < 0) {
      if (rightIndex < length && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (rightIndex < length && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      return;
    }
  }
}

function compare(a, b) {
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}

const ImmediatePriority$1 = 1;
const UserBlockingPriority$1 = 2;
const NormalPriority$2 = 3;
const LowPriority$1 = 4;
const IdlePriority$1 = 5;

function markTaskErrored(task, ms) {
}

let getCurrentTime;
const hasPerformanceNow = typeof performance === 'object' && typeof performance.now === 'function';

if (hasPerformanceNow) {
  const localPerformance = performance;

  getCurrentTime = () => localPerformance.now();
} else {
  const localDate = Date;
  const initialTime = localDate.now();

  getCurrentTime = () => localDate.now() - initialTime;
}

var maxSigned31BitInt = 1073741823;
var taskQueue = [];
var timerQueue = [];
var taskIdCounter = 1;
var currentTask = null;
var currentPriorityLevel = NormalPriority$2;
var isPerformingWork = false;
var isHostCallbackScheduled = false;
var isHostTimeoutScheduled = false;
const localSetTimeout = typeof setTimeout === 'function' ? setTimeout : null;
const localClearTimeout = typeof clearTimeout === 'function' ? clearTimeout : null;
const localSetImmediate = typeof setImmediate !== 'undefined' ? setImmediate : null;

function advanceTimers(currentTime) {
  let timer = peek(timerQueue);

  while (timer !== null) {
    if (timer.callback === null) {
      pop$1(timerQueue);
    } else if (timer.startTime <= currentTime) {
      pop$1(timerQueue);
      timer.sortIndex = timer.expirationTime;
      push$1(taskQueue, timer);
    } else {
      return;
    }

    timer = peek(timerQueue);
  }
}

function handleTimeout(currentTime) {
  isHostTimeoutScheduled = false;
  advanceTimers(currentTime);

  if (!isHostCallbackScheduled) {
    if (peek(taskQueue) !== null) {
      isHostCallbackScheduled = true;
      requestHostCallback();
    } else {
      const firstTimer = peek(timerQueue);

      if (firstTimer !== null) {
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }
    }
  }
}

function flushWork(initialTime) {

  isHostCallbackScheduled = false;

  if (isHostTimeoutScheduled) {
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }

  isPerformingWork = true;
  const previousPriorityLevel = currentPriorityLevel;

  try {
    if (enableProfiling) ; else {
      return workLoop(initialTime);
    }
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
  }
}

function workLoop(initialTime) {
  let currentTime = initialTime;
  advanceTimers(currentTime);
  currentTask = peek(taskQueue);

  while (currentTask !== null && !(enableSchedulerDebugging )) {
    if (currentTask.expirationTime > currentTime && shouldYieldToHost()) {
      break;
    }

    const callback = currentTask.callback;

    if (typeof callback === 'function') {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;

      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();

      if (typeof continuationCallback === 'function') {
        currentTask.callback = continuationCallback;

        advanceTimers(currentTime);
        return true;
      } else {

        if (currentTask === peek(taskQueue)) {
          pop$1(taskQueue);
        }

        advanceTimers(currentTime);
      }
    } else {
      pop$1(taskQueue);
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

function unstable_runWithPriority(priorityLevel, eventHandler) {
  switch (priorityLevel) {
    case ImmediatePriority$1:
    case UserBlockingPriority$1:
    case NormalPriority$2:
    case LowPriority$1:
    case IdlePriority$1:
      break;

    default:
      priorityLevel = NormalPriority$2;
  }

  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}

function unstable_next(eventHandler) {
  var priorityLevel;

  switch (currentPriorityLevel) {
    case ImmediatePriority$1:
    case UserBlockingPriority$1:
    case NormalPriority$2:
      priorityLevel = NormalPriority$2;
      break;

    default:
      priorityLevel = currentPriorityLevel;
      break;
  }

  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}

function unstable_wrapCallback(callback) {
  var parentPriorityLevel = currentPriorityLevel;
  return function () {
    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = parentPriorityLevel;

    try {
      return callback.apply(this, arguments);
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  };
}

function unstable_scheduleCallback(priorityLevel, callback, options) {
  var currentTime = getCurrentTime();
  var startTime;

  if (typeof options === 'object' && options !== null) {
    var delay = options.delay;

    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    startTime = currentTime;
  }

  var timeout;

  switch (priorityLevel) {
    case ImmediatePriority$1:
      timeout = -1;
      break;

    case UserBlockingPriority$1:
      timeout = userBlockingPriorityTimeout;
      break;

    case IdlePriority$1:
      timeout = maxSigned31BitInt;
      break;

    case LowPriority$1:
      timeout = lowPriorityTimeout;
      break;

    case NormalPriority$2:
    default:
      timeout = normalPriorityTimeout;
      break;
  }

  var expirationTime = startTime + timeout;
  var newTask = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1
  };

  if (startTime > currentTime) {
    newTask.sortIndex = startTime;
    push$1(timerQueue, newTask);

    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      if (isHostTimeoutScheduled) {
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }

      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    newTask.sortIndex = expirationTime;
    push$1(taskQueue, newTask);

    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback();
    }
  }

  return newTask;
}

function unstable_pauseExecution() {
}

function unstable_continueExecution() {

  if (!isHostCallbackScheduled && !isPerformingWork) {
    isHostCallbackScheduled = true;
    requestHostCallback();
  }
}

function unstable_getFirstCallbackNode() {
  return peek(taskQueue);
}

function unstable_cancelCallback(task) {

  task.callback = null;
}

function unstable_getCurrentPriorityLevel() {
  return currentPriorityLevel;
}

let isMessageLoopRunning = false;
let taskTimeoutID = -1;
let frameInterval = frameYieldMs;
let startTime = -1;

function shouldYieldToHost() {
  const timeElapsed = getCurrentTime() - startTime;

  if (timeElapsed < frameInterval) {
    return false;
  }

  return true;
}

function requestPaint() {}

function forceFrameRate(fps) {
  if (fps < 0 || fps > 125) {
    console['error']('forceFrameRate takes a positive int between 0 and 125, ' + 'forcing frame rates higher than 125 fps is not supported');
    return;
  }

  if (fps > 0) {
    frameInterval = Math.floor(1000 / fps);
  } else {
    frameInterval = frameYieldMs;
  }
}

const performWorkUntilDeadline = () => {
  if (isMessageLoopRunning) {
    const currentTime = getCurrentTime();
    startTime = currentTime;
    let hasMoreWork = true;

    try {
      hasMoreWork = flushWork(currentTime);
    } finally {
      if (hasMoreWork) {
        schedulePerformWorkUntilDeadline();
      } else {
        isMessageLoopRunning = false;
      }
    }
  }
};

let schedulePerformWorkUntilDeadline;

if (typeof localSetImmediate === 'function') {
  schedulePerformWorkUntilDeadline = () => {
    localSetImmediate(performWorkUntilDeadline);
  };
} else if (typeof MessageChannel !== 'undefined') {
  const channel = new MessageChannel();
  const port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;

  schedulePerformWorkUntilDeadline = () => {
    port.postMessage(null);
  };
} else {
  schedulePerformWorkUntilDeadline = () => {
    localSetTimeout(performWorkUntilDeadline, 0);
  };
}

function requestHostCallback() {
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    schedulePerformWorkUntilDeadline();
  }
}

function requestHostTimeout(callback, ms) {
  taskTimeoutID = localSetTimeout(() => {
    callback(getCurrentTime());
  }, ms);
}

function cancelHostTimeout() {
  localClearTimeout(taskTimeoutID);
  taskTimeoutID = -1;
}
const unstable_Profiling = null;

const Scheduler = /*#__PURE__*/Object.defineProperty({
  __proto__: null,
  log: _missingExportShim,
  unstable_IdlePriority: IdlePriority$1,
  unstable_ImmediatePriority: ImmediatePriority$1,
  unstable_LowPriority: LowPriority$1,
  unstable_NormalPriority: NormalPriority$2,
  unstable_Profiling,
  unstable_UserBlockingPriority: UserBlockingPriority$1,
  unstable_cancelCallback,
  unstable_continueExecution,
  unstable_forceFrameRate: forceFrameRate,
  unstable_getCurrentPriorityLevel,
  unstable_getFirstCallbackNode,
  unstable_next,
  get unstable_now () { return getCurrentTime; },
  unstable_pauseExecution,
  unstable_requestPaint: requestPaint,
  unstable_runWithPriority,
  unstable_scheduleCallback,
  unstable_setDisableYieldValue: _missingExportShim,
  unstable_shouldYield: shouldYieldToHost,
  unstable_wrapCallback
}, Symbol.toStringTag, { value: 'Module' });

function get(key) {
  return key._reactInternals;
}
function set(key, value) {
  key._reactInternals = value;
}

const FunctionComponent = 0;
const ClassComponent = 1;
const HostRoot = 3;
const HostPortal = 4;
const HostComponent = 5;
const HostText = 6;
const Fragment = 7;
const Mode = 8;
const ContextConsumer = 9;
const ContextProvider = 10;
const ForwardRef = 11;
const Profiler = 12;
const SuspenseComponent = 13;
const MemoComponent = 14;
const SimpleMemoComponent = 15;
const LazyComponent = 16;
const IncompleteClassComponent = 17;
const DehydratedFragment = 18;
const SuspenseListComponent = 19;
const ScopeComponent = 21;
const OffscreenComponent = 22;
const LegacyHiddenComponent = 23;
const CacheComponent = 24;
const TracingMarkerComponent = 25;
const HostHoistable = 26;
const HostSingleton = 27;
const IncompleteFunctionComponent = 28;
const Throw = 29;

const REACT_LEGACY_ELEMENT_TYPE = Symbol.for('react.element');
const REACT_ELEMENT_TYPE = Symbol.for('react.transitional.element') ;
const REACT_PORTAL_TYPE = Symbol.for('react.portal');
const REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
const REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
const REACT_PROFILER_TYPE = Symbol.for('react.profiler');
const REACT_PROVIDER_TYPE = Symbol.for('react.provider');
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
const REACT_MEMO_CACHE_SENTINEL = Symbol.for('react.memo_cache_sentinel');
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

function getWrappedName$1(outerType, innerType, wrapperName) {
  const displayName = outerType.displayName;

  if (displayName) {
    return displayName;
  }

  const functionName = innerType.displayName || innerType.name || '';
  return functionName !== '' ? `${wrapperName}(${functionName})` : wrapperName;
}

function getContextName$1(type) {
  return type.displayName || 'Context';
}

const REACT_CLIENT_REFERENCE = Symbol.for('react.client.reference');
function getComponentNameFromType(type) {
  if (type == null) {
    return null;
  }

  if (typeof type === 'function') {
    if (type.$$typeof === REACT_CLIENT_REFERENCE) {
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
          return getContextName$1(context) + '.Provider';
        }

      case REACT_CONSUMER_TYPE:
        {
          const consumer = type;
          return getContextName$1(consumer._context) + '.Consumer';
        }

      case REACT_FORWARD_REF_TYPE:
        return getWrappedName$1(type, type.render, 'ForwardRef');

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

function getWrappedName(outerType, innerType, wrapperName) {
  const functionName = innerType.displayName || innerType.name || '';
  return outerType.displayName || (functionName !== '' ? `${wrapperName}(${functionName})` : wrapperName);
}

function getContextName(type) {
  return type.displayName || 'Context';
}

function getComponentNameFromOwner(owner) {
  if (typeof owner.tag === 'number') {
    return getComponentNameFromFiber(owner);
  }

  if (typeof owner.name === 'string') {
    return owner.name;
  }

  return null;
}
function getComponentNameFromFiber(fiber) {
  const {
    tag,
    type
  } = fiber;

  switch (tag) {
    case CacheComponent:
      return 'Cache';

    case ContextConsumer:
      {
        const consumer = type;
        return getContextName(consumer._context) + '.Consumer';
      }

    case ContextProvider:
      {
        const context = type;
        return getContextName(context) + '.Provider';
      }

    case DehydratedFragment:
      return 'DehydratedFragment';

    case ForwardRef:
      return getWrappedName(type, type.render, 'ForwardRef');

    case Fragment:
      return 'Fragment';

    case HostHoistable:
    case HostSingleton:
    case HostComponent:
      return type;

    case HostPortal:
      return 'Portal';

    case HostRoot:
      return 'Root';

    case HostText:
      return 'Text';

    case LazyComponent:
      return getComponentNameFromType(type);

    case Mode:
      if (type === REACT_STRICT_MODE_TYPE) {
        return 'StrictMode';
      }

      return 'Mode';

    case OffscreenComponent:
      return 'Offscreen';

    case Profiler:
      return 'Profiler';

    case ScopeComponent:
      return 'Scope';

    case SuspenseComponent:
      return 'Suspense';

    case SuspenseListComponent:
      return 'SuspenseList';

    case TracingMarkerComponent:
      return 'TracingMarker';

    case IncompleteClassComponent:
    case IncompleteFunctionComponent:
      {
        break;
      }

    case ClassComponent:
    case FunctionComponent:
    case MemoComponent:
    case SimpleMemoComponent:
      if (typeof type === 'function') {
        return type.displayName || type.name || null;
      }

      if (typeof type === 'string') {
        return type;
      }

      break;

    case LegacyHiddenComponent:

      break;

    case Throw:
      {
        {
          const debugInfo = fiber._debugInfo;

          if (debugInfo != null) {
            for (let i = debugInfo.length - 1; i >= 0; i--) {
              if (typeof debugInfo[i].name === 'string') {
                return debugInfo[i].name;
              }
            }
          }

          if (fiber.return === null) {
            return null;
          }

          return getComponentNameFromFiber(fiber.return);
        }
      }
  }

  return null;
}

const NoFlags$1 = 0b0000000000000000000000000000;
const PerformedWork = 0b0000000000000000000000000001;
const Placement = 0b0000000000000000000000000010;
const DidCapture = 0b0000000000000000000010000000;
const Hydrating = 0b0000000000000001000000000000;
const Update = 0b0000000000000000000000000100;
const ChildDeletion = 0b0000000000000000000000010000;
const ContentReset = 0b0000000000000000000000100000;
const Callback = 0b0000000000000000000001000000;
const ForceClientRender = 0b0000000000000000000100000000;
const Ref = 0b0000000000000000001000000000;
const Snapshot = 0b0000000000000000010000000000;
const Passive$1 = 0b0000000000000000100000000000;
const Visibility = 0b0000000000000010000000000000;
const StoreConsistency = 0b0000000000000100000000000000;
const ScheduleRetry = StoreConsistency;
const ShouldSuspendCommit = Visibility;
const DidDefer = ContentReset;
const FormReset = Snapshot;
const HostEffectMask = 0b0000000000000111111111111111;
const Incomplete = 0b0000000000001000000000000000;
const ShouldCapture = 0b0000000000010000000000000000;
const ForceUpdateForLegacySuspense = 0b0000000000100000000000000000;
const DidPropagateContext = 0b0000000001000000000000000000;
const NeedsPropagation = 0b0000000010000000000000000000;
const Forked = 0b0000000100000000000000000000;
const RefStatic = 0b0000001000000000000000000000;
const LayoutStatic = 0b0000010000000000000000000000;
const PassiveStatic = 0b0000100000000000000000000000;
const MaySuspendCommit = 0b0001000000000000000000000000;
const PlacementDEV = 0b0010000000000000000000000000;
const MountLayoutDev = 0b0100000000000000000000000000;
const MountPassiveDev = 0b1000000000000000000000000000;
const BeforeMutationMask = Update | Snapshot | (0);
const MutationMask = Placement | Update | ChildDeletion | ContentReset | Ref | Hydrating | Visibility | FormReset;
const LayoutMask = Update | Callback | Ref | Visibility;
const PassiveMask = Passive$1 | Visibility | ChildDeletion;
const StaticMask = LayoutStatic | PassiveStatic | RefStatic | MaySuspendCommit;

const ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

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
      prevLog = console.log;
      prevInfo = console.info;
      prevWarn = console.warn;
      prevError = console.error;
      prevGroup = console.group;
      prevGroupCollapsed = console.groupCollapsed;
      prevGroupEnd = console.groupEnd;
      const props = {
        configurable: true,
        enumerable: true,
        value: disabledLog,
        writable: true
      };
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
      };
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

const DefaultPrepareStackTrace = undefined;

let prefix;
let suffix;
function describeBuiltInComponentFrame(name) {
  {
    if (prefix === undefined) {
      try {
        throw Error();
      } catch (x) {
        const match = x.stack.trim().match(/\n( *(at )?)/);
        prefix = match && match[1] || '';
        suffix = x.stack.indexOf('\n    at') > -1 ? ' (<anonymous>)' : x.stack.indexOf('@') > -1 ? '@unknown:0:0' : '';
      }
    }

    return '\n' + prefix + name + suffix;
  }
}
function describeDebugInfoFrame(name, env) {
  return describeBuiltInComponentFrame(name + (env ? ' [' + env + ']' : ''));
}
let reentry = false;
let componentFrameCache;

{
  const PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
  componentFrameCache = new PossiblyWeakMap();
}

function describeNativeComponentFrame(fn, construct) {
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
    previousDispatcher = ReactSharedInternals.H;
    ReactSharedInternals.H = null;
    disableLogs();
  }

  try {
    const RunInRootFrame = {
      DetermineComponentFrameRoot() {
        let control;

        try {
          if (construct) {
            const Fake = function () {
              throw Error();
            };

            Object.defineProperty(Fake.prototype, 'props', {
              set: function () {
                throw Error();
              }
            });

            if (typeof Reflect === 'object' && Reflect.construct) {
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

            const maybePromise = fn();

            if (maybePromise && typeof maybePromise.catch === 'function') {
              maybePromise.catch(() => {});
            }
          }
        } catch (sample) {
          if (sample && control && typeof sample.stack === 'string') {
            return [sample.stack, control.stack];
          }
        }

        return [null, null];
      }

    };
    RunInRootFrame.DetermineComponentFrameRoot.displayName = 'DetermineComponentFrameRoot';
    const namePropDescriptor = Object.getOwnPropertyDescriptor(RunInRootFrame.DetermineComponentFrameRoot, 'name');

    if (namePropDescriptor && namePropDescriptor.configurable) {
      Object.defineProperty(RunInRootFrame.DetermineComponentFrameRoot, 'name', {
        value: 'DetermineComponentFrameRoot'
      });
    }

    const [sampleStack, controlStack] = RunInRootFrame.DetermineComponentFrameRoot();

    if (sampleStack && controlStack) {
      const sampleLines = sampleStack.split('\n');
      const controlLines = controlStack.split('\n');
      let s = 0;
      let c = 0;

      while (s < sampleLines.length && !sampleLines[s].includes('DetermineComponentFrameRoot')) {
        s++;
      }

      while (c < controlLines.length && !controlLines[c].includes('DetermineComponentFrameRoot')) {
        c++;
      }

      if (s === sampleLines.length || c === controlLines.length) {
        s = sampleLines.length - 1;
        c = controlLines.length - 1;

        while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
          c--;
        }
      }

      for (; s >= 1 && c >= 0; s--, c--) {
        if (sampleLines[s] !== controlLines[c]) {
          if (s !== 1 || c !== 1) {
            do {
              s--;
              c--;

              if (c < 0 || sampleLines[s] !== controlLines[c]) {
                let frame = '\n' + sampleLines[s].replace(' at new ', ' at ');

                if (fn.displayName && frame.includes('<anonymous>')) {
                  frame = frame.replace('<anonymous>', fn.displayName);
                }

                if (true) {
                  if (typeof fn === 'function') {
                    componentFrameCache.set(fn, frame);
                  }
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

    {
      ReactSharedInternals.H = previousDispatcher;
      reenableLogs();
    }

    Error.prepareStackTrace = previousPrepareStackTrace;
  }

  const name = fn ? fn.displayName || fn.name : '';
  const syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';

  {
    if (typeof fn === 'function') {
      componentFrameCache.set(fn, syntheticFrame);
    }
  }

  return syntheticFrame;
}

function describeClassComponentFrame(ctor) {
  {
    return describeNativeComponentFrame(ctor, true);
  }
}
function describeFunctionComponentFrame(fn) {
  {
    return describeNativeComponentFrame(fn, false);
  }
}

function describeFiber(fiber) {
  switch (fiber.tag) {
    case HostHoistable:
    case HostSingleton:
    case HostComponent:
      return describeBuiltInComponentFrame(fiber.type);

    case LazyComponent:
      return describeBuiltInComponentFrame('Lazy');

    case SuspenseComponent:
      return describeBuiltInComponentFrame('Suspense');

    case SuspenseListComponent:
      return describeBuiltInComponentFrame('SuspenseList');

    case FunctionComponent:
    case SimpleMemoComponent:
      return describeFunctionComponentFrame(fiber.type);

    case ForwardRef:
      return describeFunctionComponentFrame(fiber.type.render);

    case ClassComponent:
      return describeClassComponentFrame(fiber.type);

    default:
      return '';
  }
}

function getStackByFiberInDevAndProd(workInProgress) {
  try {
    let info = '';
    let node = workInProgress;

    do {
      info += describeFiber(node);

      if (true) {
        const debugInfo = node._debugInfo;

        if (debugInfo) {
          for (let i = debugInfo.length - 1; i >= 0; i--) {
            const entry = debugInfo[i];

            if (typeof entry.name === 'string') {
              info += describeDebugInfoFrame(entry.name, entry.env);
            }
          }
        }
      }

      node = node.return;
    } while (node);

    return info;
  } catch (x) {
    return '\nError generating stack: ' + x.message + '\n' + x.stack;
  }
}

let current = null;
let isRendering = false;
function getCurrentFiberOwnerNameInDevOrNull() {
  {
    if (current === null) {
      return null;
    }

    const owner = current._debugOwner;

    if (owner != null) {
      return getComponentNameFromOwner(owner);
    }
  }

  return null;
}

function getCurrentFiberStackInDev() {
  {
    if (current === null) {
      return '';
    }

    return getStackByFiberInDevAndProd(current);
  }
}

function runWithFiberInDEV(fiber, callback, arg0, arg1, arg2, arg3, arg4) {
  {
    const previousFiber = current;
    setCurrentFiber(fiber);

    try {
      if (enableOwnerStacks) ;

      return callback(arg0, arg1, arg2, arg3, arg4);
    } finally {
      current = previousFiber;
    }
  }

  throw new Error('runWithFiberInDEV should never be called in production. This is a bug in React.');
}
function resetCurrentFiber() {
  {
    ReactSharedInternals.getCurrentStack = null;
    isRendering = false;
  }

  current = null;
}
function setCurrentFiber(fiber) {
  {
    ReactSharedInternals.getCurrentStack = fiber === null ? null : getCurrentFiberStackInDev;
    isRendering = false;
  }

  current = fiber;
}
function setIsRendering(rendering) {
  {
    isRendering = rendering;
  }
}

function getNearestMountedFiber(fiber) {
  let node = fiber;
  let nearestMounted = fiber;

  if (!fiber.alternate) {
    let nextNode = node;

    do {
      node = nextNode;

      if ((node.flags & (Placement | Hydrating)) !== NoFlags$1) {
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
function getContainerFromFiber(fiber) {
  return fiber.tag === HostRoot ? fiber.stateNode.containerInfo : null;
}
function isMounted(component) {
  {
    const owner = current;

    if (owner !== null && isRendering && owner.tag === ClassComponent) {
      const ownerFiber = owner;
      const instance = ownerFiber.stateNode;

      if (!instance._warnedAboutRefsInRender) {
        console.error('%s is accessing isMounted inside its render() function. ' + 'render() should be a pure function of props and state. It should ' + 'never access something that requires stale data from the previous ' + 'render, such as refs. Move this logic to componentDidMount and ' + 'componentDidUpdate instead.', getComponentNameFromFiber(ownerFiber) || 'A component');
      }

      instance._warnedAboutRefsInRender = true;
    }
  }

  const fiber = get(component);

  if (!fiber) {
    return false;
  }

  return getNearestMountedFiber(fiber) === fiber;
}

function assertIsMounted(fiber) {
  if (getNearestMountedFiber(fiber) !== fiber) {
    throw new Error('Unable to find node on an unmounted component.');
  }
}

function findCurrentFiberUsingSlowPath(fiber) {
  const alternate = fiber.alternate;

  if (!alternate) {
    const nearestMounted = getNearestMountedFiber(fiber);

    if (nearestMounted === null) {
      throw new Error('Unable to find node on an unmounted component.');
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

      throw new Error('Unable to find node on an unmounted component.');
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
          throw new Error('Child was not found in either parent set. This indicates a bug ' + 'in React related to the return pointer. Please file an issue.');
        }
      }
    }

    if (a.alternate !== b) {
      throw new Error("Return fibers should always be each others' alternates. " + 'This error is likely caused by a bug in React. Please file an issue.');
    }
  }

  if (a.tag !== HostRoot) {
    throw new Error('Unable to find node on an unmounted component.');
  }

  if (a.stateNode.current === a) {
    return fiber;
  }

  return alternate;
}
function findCurrentHostFiber(parent) {
  const currentParent = findCurrentFiberUsingSlowPath(parent);
  return currentParent !== null ? findCurrentHostFiberImpl(currentParent) : null;
}

function findCurrentHostFiberImpl(node) {
  const tag = node.tag;

  if (tag === HostComponent || tag === HostHoistable || tag === HostSingleton || tag === HostText) {
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

const LegacyRoot = 0;
const ConcurrentRoot = 1;

const isArrayImpl = Array.isArray;

function isArray(a) {
  return isArrayImpl(a);
}

const NoEventPriority$1 = 0;

function noop$4() {}

function requestFormReset$2(element) {
  throw new Error('Invalid form element. requestFormReset must be passed a form that was ' + 'rendered by React.');
}

const DefaultDispatcher = {
  f: noop$4,
  r: requestFormReset$2,
  D: noop$4,
  C: noop$4,
  L: noop$4,
  m: noop$4,
  X: noop$4,
  S: noop$4,
  M: noop$4
};
const Internals = {
  d: DefaultDispatcher,
  p: NoEventPriority$1,
  findDOMNode: null
};

const reactDOMPackageVersion = '19.0.0-rc-0cb05427-20241220';

function typeName(value) {
  {
    const hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;
    const type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || 'Object';
    return type;
  }
}

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

function testStringCoercion(value) {
  return '' + value;
}

function checkAttributeStringCoercion(value, attributeName) {
  {
    if (willCoercionThrow(value)) {
      console.error('The provided `%s` attribute is an unsupported type %s.' + ' This value must be coerced to a string before using it here.', attributeName, typeName(value));
      return testStringCoercion(value);
    }
  }
}
function checkCSSPropertyStringCoercion(value, propName) {
  {
    if (willCoercionThrow(value)) {
      console.error('The provided `%s` CSS property is an unsupported type %s.' + ' This value must be coerced to a string before using it here.', propName, typeName(value));
      return testStringCoercion(value);
    }
  }
}
function checkHtmlStringCoercion(value) {
  {
    if (willCoercionThrow(value)) {
      console.error('The provided HTML markup uses a value of unsupported type %s.' + ' This value must be coerced to a string before using it here.', typeName(value));
      return testStringCoercion(value);
    }
  }
}
function checkFormFieldValueStringCoercion(value) {
  {
    if (willCoercionThrow(value)) {
      console.error('Form field values (value, checked, defaultValue, or defaultChecked props)' + ' must be strings, not %s.' + ' This value must be coerced to a string before using it here.', typeName(value));
      return testStringCoercion(value);
    }
  }
}

const scheduleCallback$3 = unstable_scheduleCallback;
const cancelCallback$1 = unstable_cancelCallback;
const shouldYield = shouldYieldToHost;
const now = getCurrentTime;
const getCurrentPriorityLevel = unstable_getCurrentPriorityLevel;
const ImmediatePriority = ImmediatePriority$1;
const UserBlockingPriority = UserBlockingPriority$1;
const NormalPriority$1 = NormalPriority$2;
const LowPriority = LowPriority$1;
const IdlePriority = IdlePriority$1;
const log$1 = _missingExportShim;
const unstable_setDisableYieldValue = _missingExportShim;

let rendererID = null;
let injectedHook = null;
let hasLoggedError = false;
function injectInternals(internals) {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
    return false;
  }

  const hook = __REACT_DEVTOOLS_GLOBAL_HOOK__;

  if (hook.isDisabled) {
    return true;
  }

  if (!hook.supportsFiber) {
    {
      console.error('The installed version of React DevTools is too old and will not work ' + 'with the current version of React. Please update React DevTools. ' + 'https://react.dev/link/react-devtools');
    }

    return true;
  }

  try {
    rendererID = hook.inject(internals);
    injectedHook = hook;
  } catch (err) {
    {
      console.error('React instrumentation encountered an error: %s.', err);
    }
  }

  if (hook.checkDCE) {
    return true;
  } else {
    return false;
  }
}
function onScheduleRoot(root, children) {
  {
    if (injectedHook && typeof injectedHook.onScheduleFiberRoot === 'function') {
      try {
        injectedHook.onScheduleFiberRoot(rendererID, root, children);
      } catch (err) {
        if (!hasLoggedError) {
          hasLoggedError = true;
          console.error('React instrumentation encountered an error: %s', err);
        }
      }
    }
  }
}
function onCommitRoot$1(root, eventPriority) {
  if (injectedHook && typeof injectedHook.onCommitFiberRoot === 'function') {
    try {
      const didError = (root.current.flags & DidCapture) === DidCapture;

      if (enableProfilerTimer) ; else {
        injectedHook.onCommitFiberRoot(rendererID, root, undefined, didError);
      }
    } catch (err) {
      {
        if (!hasLoggedError) {
          hasLoggedError = true;
          console.error('React instrumentation encountered an error: %s', err);
        }
      }
    }
  }
}
function onPostCommitRoot(root) {
  if (injectedHook && typeof injectedHook.onPostCommitFiberRoot === 'function') {
    try {
      injectedHook.onPostCommitFiberRoot(rendererID, root);
    } catch (err) {
      {
        if (!hasLoggedError) {
          hasLoggedError = true;
          console.error('React instrumentation encountered an error: %s', err);
        }
      }
    }
  }
}
function onCommitUnmount(fiber) {
  if (injectedHook && typeof injectedHook.onCommitFiberUnmount === 'function') {
    try {
      injectedHook.onCommitFiberUnmount(rendererID, fiber);
    } catch (err) {
      {
        if (!hasLoggedError) {
          hasLoggedError = true;
          console.error('React instrumentation encountered an error: %s', err);
        }
      }
    }
  }
}
function setIsStrictModeForDevtools(newIsStrictMode) {
  {
    if (typeof log$1 === 'function') {
      unstable_setDisableYieldValue(newIsStrictMode);
    }

    if (injectedHook && typeof injectedHook.setStrictMode === 'function') {
      try {
        injectedHook.setStrictMode(rendererID, newIsStrictMode);
      } catch (err) {
        {
          if (!hasLoggedError) {
            hasLoggedError = true;
            console.error('React instrumentation encountered an error: %s', err);
          }
        }
      }
    }
  }
}
function markComponentPassiveEffectMountStarted(fiber) {
}
function markComponentPassiveEffectMountStopped() {
}
function markComponentPassiveEffectUnmountStarted(fiber) {
}
function markComponentPassiveEffectUnmountStopped() {
}
function markComponentLayoutEffectMountStarted(fiber) {
}
function markComponentLayoutEffectMountStopped() {
}
function markComponentLayoutEffectUnmountStarted(fiber) {
}
function markComponentLayoutEffectUnmountStopped() {
}

const clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
const log = Math.log;
const LN2 = Math.LN2;

function clz32Fallback(x) {
  const asUint = x >>> 0;

  if (asUint === 0) {
    return 32;
  }

  return 31 - (log(asUint) / LN2 | 0) | 0;
}

const TotalLanes = 31;
const NoLanes = 0b0000000000000000000000000000000;
const NoLane = 0b0000000000000000000000000000000;
const SyncHydrationLane = 0b0000000000000000000000000000001;
const SyncLane = 0b0000000000000000000000000000010;
const SyncLaneIndex = 1;
const InputContinuousHydrationLane = 0b0000000000000000000000000000100;
const InputContinuousLane = 0b0000000000000000000000000001000;
const DefaultHydrationLane = 0b0000000000000000000000000010000;
const DefaultLane = 0b0000000000000000000000000100000;
const SyncUpdateLanes = SyncLane | InputContinuousLane | DefaultLane;
const TransitionHydrationLane = 0b0000000000000000000000001000000;
const TransitionLanes = 0b0000000001111111111111110000000;
const TransitionLane1 = 0b0000000000000000000000010000000;
const TransitionLane2 = 0b0000000000000000000000100000000;
const TransitionLane3 = 0b0000000000000000000001000000000;
const TransitionLane4 = 0b0000000000000000000010000000000;
const TransitionLane5 = 0b0000000000000000000100000000000;
const TransitionLane6 = 0b0000000000000000001000000000000;
const TransitionLane7 = 0b0000000000000000010000000000000;
const TransitionLane8 = 0b0000000000000000100000000000000;
const TransitionLane9 = 0b0000000000000001000000000000000;
const TransitionLane10 = 0b0000000000000010000000000000000;
const TransitionLane11 = 0b0000000000000100000000000000000;
const TransitionLane12 = 0b0000000000001000000000000000000;
const TransitionLane13 = 0b0000000000010000000000000000000;
const TransitionLane14 = 0b0000000000100000000000000000000;
const TransitionLane15 = 0b0000000001000000000000000000000;
const RetryLanes = 0b0000011110000000000000000000000;
const RetryLane1 = 0b0000000010000000000000000000000;
const RetryLane2 = 0b0000000100000000000000000000000;
const RetryLane3 = 0b0000001000000000000000000000000;
const RetryLane4 = 0b0000010000000000000000000000000;
const SomeRetryLane = RetryLane1;
const SelectiveHydrationLane = 0b0000100000000000000000000000000;
const NonIdleLanes = 0b0000111111111111111111111111111;
const IdleHydrationLane = 0b0001000000000000000000000000000;
const IdleLane = 0b0010000000000000000000000000000;
const OffscreenLane = 0b0100000000000000000000000000000;
const DeferredLane = 0b1000000000000000000000000000000;
const UpdateLanes = SyncLane | InputContinuousLane | DefaultLane | TransitionLanes;
const HydrationLanes = SyncHydrationLane | InputContinuousHydrationLane | DefaultHydrationLane | TransitionHydrationLane | SelectiveHydrationLane | IdleHydrationLane;
const NoTimestamp = -1;
let nextTransitionLane = TransitionLane1;
let nextRetryLane = RetryLane1;

function getHighestPriorityLanes(lanes) {
  const pendingSyncLanes = lanes & SyncUpdateLanes;

  if (pendingSyncLanes !== 0) {
    return pendingSyncLanes;
  }

  switch (getHighestPriorityLane(lanes)) {
    case SyncHydrationLane:
      return SyncHydrationLane;

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
      return lanes & TransitionLanes;

    case RetryLane1:
    case RetryLane2:
    case RetryLane3:
    case RetryLane4:
      return lanes & RetryLanes;

    case SelectiveHydrationLane:
      return SelectiveHydrationLane;

    case IdleHydrationLane:
      return IdleHydrationLane;

    case IdleLane:
      return IdleLane;

    case OffscreenLane:
      return OffscreenLane;

    case DeferredLane:
      return NoLanes;

    default:
      {
        console.error('Should have found matching lanes. This is a bug in React.');
      }

      return lanes;
  }
}

function getNextLanes(root, wipLanes) {
  const pendingLanes = root.pendingLanes;

  if (pendingLanes === NoLanes) {
    return NoLanes;
  }

  let nextLanes = NoLanes;
  const suspendedLanes = root.suspendedLanes;
  const pingedLanes = root.pingedLanes;
  const warmLanes = root.warmLanes;
  const rootHasPendingCommit = root.finishedLanes !== NoLanes;
  const nonIdlePendingLanes = pendingLanes & NonIdleLanes;

  if (nonIdlePendingLanes !== NoLanes) {
    const nonIdleUnblockedLanes = nonIdlePendingLanes & ~suspendedLanes;

    if (nonIdleUnblockedLanes !== NoLanes) {
      nextLanes = getHighestPriorityLanes(nonIdleUnblockedLanes);
    } else {
      const nonIdlePingedLanes = nonIdlePendingLanes & pingedLanes;

      if (nonIdlePingedLanes !== NoLanes) {
        nextLanes = getHighestPriorityLanes(nonIdlePingedLanes);
      } else {
        {
          if (!rootHasPendingCommit) {
            const lanesToPrewarm = nonIdlePendingLanes & ~warmLanes;

            if (lanesToPrewarm !== NoLanes) {
              nextLanes = getHighestPriorityLanes(lanesToPrewarm);
            }
          }
        }
      }
    }
  } else {
    const unblockedLanes = pendingLanes & ~suspendedLanes;

    if (unblockedLanes !== NoLanes) {
      nextLanes = getHighestPriorityLanes(unblockedLanes);
    } else {
      if (pingedLanes !== NoLanes) {
        nextLanes = getHighestPriorityLanes(pingedLanes);
      } else {
        {
          if (!rootHasPendingCommit) {
            const lanesToPrewarm = pendingLanes & ~warmLanes;

            if (lanesToPrewarm !== NoLanes) {
              nextLanes = getHighestPriorityLanes(lanesToPrewarm);
            }
          }
        }
      }
    }
  }

  if (nextLanes === NoLanes) {
    return NoLanes;
  }

  if (wipLanes !== NoLanes && wipLanes !== nextLanes && (wipLanes & suspendedLanes) === NoLanes) {
    const nextLane = getHighestPriorityLane(nextLanes);
    const wipLane = getHighestPriorityLane(wipLanes);

    if (nextLane >= wipLane || nextLane === DefaultLane && (wipLane & TransitionLanes) !== NoLanes) {
      return wipLanes;
    }
  }

  return nextLanes;
}
function getNextLanesToFlushSync(root, extraLanesToForceSync) {
  const lanesToFlush = SyncUpdateLanes | extraLanesToForceSync;
  const pendingLanes = root.pendingLanes;

  if (pendingLanes === NoLanes) {
    return NoLanes;
  }

  const suspendedLanes = root.suspendedLanes;
  const pingedLanes = root.pingedLanes;
  const unblockedLanes = pendingLanes & ~(suspendedLanes & ~pingedLanes);
  const unblockedLanesWithMatchingPriority = unblockedLanes & getLanesOfEqualOrHigherPriority(lanesToFlush);

  if (unblockedLanesWithMatchingPriority & HydrationLanes) {
    return unblockedLanesWithMatchingPriority & HydrationLanes | SyncHydrationLane;
  }

  if (unblockedLanesWithMatchingPriority) {
    return unblockedLanesWithMatchingPriority | SyncLane;
  }

  return NoLanes;
}
function checkIfRootIsPrerendering(root, renderLanes) {
  const pendingLanes = root.pendingLanes;
  const suspendedLanes = root.suspendedLanes;
  const pingedLanes = root.pingedLanes;
  const unblockedLanes = pendingLanes & ~(suspendedLanes & ~pingedLanes);
  return (unblockedLanes & renderLanes) === 0;
}
function getEntangledLanes(root, renderLanes) {
  let entangledLanes = renderLanes;

  if ((entangledLanes & InputContinuousLane) !== NoLanes) {
    entangledLanes |= entangledLanes & DefaultLane;
  }

  const allEntangledLanes = root.entangledLanes;

  if (allEntangledLanes !== NoLanes) {
    const entanglements = root.entanglements;
    let lanes = entangledLanes & allEntangledLanes;

    while (lanes > 0) {
      const index = pickArbitraryLaneIndex(lanes);
      const lane = 1 << index;
      entangledLanes |= entanglements[index];
      lanes &= ~lane;
    }
  }

  return entangledLanes;
}

function computeExpirationTime(lane, currentTime) {
  switch (lane) {
    case SyncHydrationLane:
    case SyncLane:
    case InputContinuousHydrationLane:
    case InputContinuousLane:
      return currentTime + syncLaneExpirationMs;

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
      return currentTime + transitionLaneExpirationMs;

    case RetryLane1:
    case RetryLane2:
    case RetryLane3:
    case RetryLane4:
      return NoTimestamp;

    case SelectiveHydrationLane:
    case IdleHydrationLane:
    case IdleLane:
    case OffscreenLane:
    case DeferredLane:
      return NoTimestamp;

    default:
      {
        console.error('Should have found matching lanes. This is a bug in React.');
      }

      return NoTimestamp;
  }
}

function markStarvedLanesAsExpired(root, currentTime) {
  const pendingLanes = root.pendingLanes;
  const suspendedLanes = root.suspendedLanes;
  const pingedLanes = root.pingedLanes;
  const expirationTimes = root.expirationTimes;
  let lanes = pendingLanes & ~RetryLanes;

  while (lanes > 0) {
    const index = pickArbitraryLaneIndex(lanes);
    const lane = 1 << index;
    const expirationTime = expirationTimes[index];

    if (expirationTime === NoTimestamp) {
      if ((lane & suspendedLanes) === NoLanes || (lane & pingedLanes) !== NoLanes) {
        expirationTimes[index] = computeExpirationTime(lane, currentTime);
      }
    } else if (expirationTime <= currentTime) {
      root.expiredLanes |= lane;
    }

    lanes &= ~lane;
  }
}
function getHighestPriorityPendingLanes(root) {
  return getHighestPriorityLanes(root.pendingLanes);
}
function getLanesToRetrySynchronouslyOnError(root, originallyAttemptedLanes) {
  if (root.errorRecoveryDisabledLanes & originallyAttemptedLanes) {
    return NoLanes;
  }

  const everythingButOffscreen = root.pendingLanes & ~OffscreenLane;

  if (everythingButOffscreen !== NoLanes) {
    return everythingButOffscreen;
  }

  if (everythingButOffscreen & OffscreenLane) {
    return OffscreenLane;
  }

  return NoLanes;
}
function includesSyncLane(lanes) {
  return (lanes & (SyncLane | SyncHydrationLane)) !== NoLanes;
}
function includesNonIdleWork(lanes) {
  return (lanes & NonIdleLanes) !== NoLanes;
}
function includesOnlyRetries(lanes) {
  return (lanes & RetryLanes) === lanes;
}
function includesOnlyNonUrgentLanes(lanes) {
  const UrgentLanes = SyncLane | InputContinuousLane | DefaultLane;
  return (lanes & UrgentLanes) === NoLanes;
}
function includesOnlyTransitions(lanes) {
  return (lanes & TransitionLanes) === lanes;
}
function includesBlockingLane(lanes) {
  const SyncDefaultLanes = InputContinuousHydrationLane | InputContinuousLane | DefaultHydrationLane | DefaultLane;
  return (lanes & SyncDefaultLanes) !== NoLanes;
}
function includesExpiredLane(root, lanes) {
  return (lanes & root.expiredLanes) !== NoLanes;
}
function isTransitionLane(lane) {
  return (lane & TransitionLanes) !== NoLanes;
}
function claimNextTransitionLane() {
  const lane = nextTransitionLane;
  nextTransitionLane <<= 1;

  if ((nextTransitionLane & TransitionLanes) === NoLanes) {
    nextTransitionLane = TransitionLane1;
  }

  return lane;
}
function claimNextRetryLane() {
  const lane = nextRetryLane;
  nextRetryLane <<= 1;

  if ((nextRetryLane & RetryLanes) === NoLanes) {
    nextRetryLane = RetryLane1;
  }

  return lane;
}
function getHighestPriorityLane(lanes) {
  return lanes & -lanes;
}

function getLanesOfEqualOrHigherPriority(lanes) {
  const lowestPriorityLaneIndex = 31 - clz32(lanes);
  return (1 << lowestPriorityLaneIndex + 1) - 1;
}

function pickArbitraryLane(lanes) {
  return getHighestPriorityLane(lanes);
}

function pickArbitraryLaneIndex(lanes) {
  return 31 - clz32(lanes);
}

function laneToIndex(lane) {
  return pickArbitraryLaneIndex(lane);
}

function includesSomeLane(a, b) {
  return (a & b) !== NoLanes;
}
function isSubsetOfLanes(set, subset) {
  return (set & subset) === subset;
}
function mergeLanes(a, b) {
  return a | b;
}
function removeLanes(set, subset) {
  return set & ~subset;
}
function intersectLanes(a, b) {
  return a & b;
}
function laneToLanes(lane) {
  return lane;
}
function higherPriorityLane(a, b) {
  return a !== NoLane && a < b ? a : b;
}
function createLaneMap(initial) {
  const laneMap = [];

  for (let i = 0; i < TotalLanes; i++) {
    laneMap.push(initial);
  }

  return laneMap;
}
function markRootUpdated$1(root, updateLane) {
  root.pendingLanes |= updateLane;

  if (updateLane !== IdleLane) {
    root.suspendedLanes = NoLanes;
    root.pingedLanes = NoLanes;
    root.warmLanes = NoLanes;
  }
}
function markRootSuspended$1(root, suspendedLanes, spawnedLane, didAttemptEntireTree) {
  root.suspendedLanes |= suspendedLanes;
  root.pingedLanes &= ~suspendedLanes;

  if (didAttemptEntireTree) {
    root.warmLanes |= suspendedLanes;
  }

  const expirationTimes = root.expirationTimes;
  let lanes = suspendedLanes;

  while (lanes > 0) {
    const index = pickArbitraryLaneIndex(lanes);
    const lane = 1 << index;
    expirationTimes[index] = NoTimestamp;
    lanes &= ~lane;
  }

  if (spawnedLane !== NoLane) {
    markSpawnedDeferredLane(root, spawnedLane, suspendedLanes);
  }
}
function markRootPinged$1(root, pingedLanes) {
  root.pingedLanes |= root.suspendedLanes & pingedLanes;
  root.warmLanes &= ~pingedLanes;
}
function markRootFinished(root, finishedLanes, remainingLanes, spawnedLane, updatedLanes, suspendedRetryLanes) {
  const previouslyPendingLanes = root.pendingLanes;
  const noLongerPendingLanes = previouslyPendingLanes & ~remainingLanes;
  root.pendingLanes = remainingLanes;
  root.suspendedLanes = NoLanes;
  root.pingedLanes = NoLanes;
  root.warmLanes = NoLanes;
  root.expiredLanes &= remainingLanes;
  root.entangledLanes &= remainingLanes;
  root.errorRecoveryDisabledLanes &= remainingLanes;
  root.shellSuspendCounter = 0;
  const entanglements = root.entanglements;
  const expirationTimes = root.expirationTimes;
  const hiddenUpdates = root.hiddenUpdates;
  let lanes = noLongerPendingLanes;

  while (lanes > 0) {
    const index = pickArbitraryLaneIndex(lanes);
    const lane = 1 << index;
    entanglements[index] = NoLanes;
    expirationTimes[index] = NoTimestamp;
    const hiddenUpdatesForLane = hiddenUpdates[index];

    if (hiddenUpdatesForLane !== null) {
      hiddenUpdates[index] = null;

      for (let i = 0; i < hiddenUpdatesForLane.length; i++) {
        const update = hiddenUpdatesForLane[i];

        if (update !== null) {
          update.lane &= ~OffscreenLane;
        }
      }
    }

    lanes &= ~lane;
  }

  if (spawnedLane !== NoLane) {
    markSpawnedDeferredLane(root, spawnedLane, NoLanes);
  }

  if (suspendedRetryLanes !== NoLanes && updatedLanes === NoLanes && !(root.tag === LegacyRoot)) {
    const freshlySpawnedRetryLanes = suspendedRetryLanes & ~(previouslyPendingLanes & ~finishedLanes);
    root.suspendedLanes |= freshlySpawnedRetryLanes;
  }
}

function markSpawnedDeferredLane(root, spawnedLane, entangledLanes) {
  root.pendingLanes |= spawnedLane;
  root.suspendedLanes &= ~spawnedLane;
  const spawnedLaneIndex = laneToIndex(spawnedLane);
  root.entangledLanes |= spawnedLane;
  root.entanglements[spawnedLaneIndex] |= DeferredLane | entangledLanes & UpdateLanes;
}

function markRootEntangled(root, entangledLanes) {
  const rootEntangledLanes = root.entangledLanes |= entangledLanes;
  const entanglements = root.entanglements;
  let lanes = rootEntangledLanes;

  while (lanes) {
    const index = pickArbitraryLaneIndex(lanes);
    const lane = 1 << index;

    if (lane & entangledLanes | entanglements[index] & entangledLanes) {
      entanglements[index] |= entangledLanes;
    }

    lanes &= ~lane;
  }
}
function upgradePendingLanesToSync(root, lanesToUpgrade) {
  root.pendingLanes |= SyncLane;
  root.entangledLanes |= SyncLane;
  let lanes = lanesToUpgrade;

  while (lanes) {
    const index = pickArbitraryLaneIndex(lanes);
    const lane = 1 << index;
    root.entanglements[SyncLaneIndex] |= lane;
    lanes &= ~lane;
  }
}
function markHiddenUpdate(root, update, lane) {
  const index = laneToIndex(lane);
  const hiddenUpdates = root.hiddenUpdates;
  const hiddenUpdatesForLane = hiddenUpdates[index];

  if (hiddenUpdatesForLane === null) {
    hiddenUpdates[index] = [update];
  } else {
    hiddenUpdatesForLane.push(update);
  }

  update.lane = lane | OffscreenLane;
}
function getBumpedLaneForHydration(root, renderLanes) {
  const renderLane = getHighestPriorityLane(renderLanes);
  let lane;

  if ((renderLane & SyncUpdateLanes) !== NoLane) {
    lane = SyncHydrationLane;
  } else {
    switch (renderLane) {
      case SyncLane:
        lane = SyncHydrationLane;
        break;

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
      case RetryLane1:
      case RetryLane2:
      case RetryLane3:
      case RetryLane4:
        lane = TransitionHydrationLane;
        break;

      case IdleLane:
        lane = IdleHydrationLane;
        break;

      default:
        lane = NoLane;
        break;
    }
  }

  if ((lane & (root.suspendedLanes | renderLanes)) !== NoLane) {
    return NoLane;
  }

  return lane;
}
function getTransitionsForLanes(root, lanes) {
  {
    return null;
  }
}

const NoEventPriority = NoLane;
const DiscreteEventPriority = SyncLane;
const ContinuousEventPriority = InputContinuousLane;
const DefaultEventPriority = DefaultLane;
const IdleEventPriority = IdleLane;
function higherEventPriority(a, b) {
  return a !== 0 && a < b ? a : b;
}
function lowerEventPriority(a, b) {
  return a === 0 || a > b ? a : b;
}
function isHigherEventPriority(a, b) {
  return a !== 0 && a < b;
}
function eventPriorityToLane(updatePriority) {
  return updatePriority;
}
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

{
  if (typeof Map !== 'function' || Map.prototype == null || typeof Map.prototype.forEach !== 'function' || typeof Set !== 'function' || Set.prototype == null || typeof Set.prototype.clear !== 'function' || typeof Set.prototype.forEach !== 'function') {
    console.error('React depends on Map and Set built-in types. Make sure that you load a ' + 'polyfill in older browsers. https://reactjs.org/link/react-polyfills');
  }
}

const ReactDOMSharedInternals = Internals;

const sharedNotPendingObject = {
  pending: false,
  data: null,
  method: null,
  action: null
};
const NotPending = Object.freeze(sharedNotPendingObject) ;

const valueStack = [];
let fiberStack;

{
  fiberStack = [];
}

let index = -1;

function createCursor(defaultValue) {
  return {
    current: defaultValue
  };
}

function pop(cursor, fiber) {
  if (index < 0) {
    {
      console.error('Unexpected pop.');
    }

    return;
  }

  {
    if (fiber !== fiberStack[index]) {
      console.error('Unexpected Fiber popped.');
    }
  }

  cursor.current = valueStack[index];
  valueStack[index] = null;

  {
    fiberStack[index] = null;
  }

  index--;
}

function push(cursor, value, fiber) {
  index++;
  valueStack[index] = cursor.current;

  {
    fiberStack[index] = fiber;
  }

  cursor.current = value;
}

const contextStackCursor = createCursor(null);
const contextFiberStackCursor = createCursor(null);
const rootInstanceStackCursor = createCursor(null);
const hostTransitionProviderCursor = createCursor(null);

function requiredContext(c) {
  {
    if (c === null) {
      console.error('Expected host context to exist. This error is likely caused by a bug ' + 'in React. Please file an issue.');
    }
  }

  return c;
}

function getCurrentRootHostContainer() {
  return rootInstanceStackCursor.current;
}

function getRootHostContainer() {
  const rootInstance = requiredContext(rootInstanceStackCursor.current);
  return rootInstance;
}

function getHostTransitionProvider() {
  return hostTransitionProviderCursor.current;
}

function pushHostContainer(fiber, nextRootInstance) {
  push(rootInstanceStackCursor, nextRootInstance, fiber);
  push(contextFiberStackCursor, fiber, fiber);
  push(contextStackCursor, null, fiber);
  const nextRootContext = getRootHostContext(nextRootInstance);
  pop(contextStackCursor, fiber);
  push(contextStackCursor, nextRootContext, fiber);
}

function popHostContainer(fiber) {
  pop(contextStackCursor, fiber);
  pop(contextFiberStackCursor, fiber);
  pop(rootInstanceStackCursor, fiber);
}

function getHostContext() {
  const context = requiredContext(contextStackCursor.current);
  return context;
}

function pushHostContext(fiber) {
  {
    const stateHook = fiber.memoizedState;

    if (stateHook !== null) {
      push(hostTransitionProviderCursor, fiber, fiber);
    }
  }

  const context = requiredContext(contextStackCursor.current);
  const nextContext = getChildHostContext(context, fiber.type);

  if (context !== nextContext) {
    push(contextFiberStackCursor, fiber, fiber);
    push(contextStackCursor, nextContext, fiber);
  }
}

function popHostContext(fiber) {
  if (contextFiberStackCursor.current === fiber) {
    pop(contextStackCursor, fiber);
    pop(contextFiberStackCursor, fiber);
  }

  {
    if (hostTransitionProviderCursor.current === fiber) {
      pop(hostTransitionProviderCursor, fiber);

      {
        HostTransitionContext._currentValue = NotPendingTransition;
      }
    }
  }
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

function setCurrentUpdatePriority(newPriority, IntentionallyUnusedArgument) {
  ReactDOMSharedInternals.p = newPriority;
}
function getCurrentUpdatePriority() {
  return ReactDOMSharedInternals.p;
}
function resolveUpdatePriority() {
  const updatePriority = ReactDOMSharedInternals.p;

  if (updatePriority !== NoEventPriority) {
    return updatePriority;
  }

  const currentEvent = window.event;

  if (currentEvent === undefined) {
    return DefaultEventPriority;
  }

  return getEventPriority(currentEvent.type);
}
function runWithPriority(priority, fn) {
  const previousPriority = getCurrentUpdatePriority();

  try {
    setCurrentUpdatePriority(priority);
    return fn();
  } finally {
    setCurrentUpdatePriority(previousPriority);
  }
}

const randomKey = Math.random().toString(36).slice(2);
const internalInstanceKey = '__reactFiber$' + randomKey;
const internalPropsKey = '__reactProps$' + randomKey;
const internalContainerInstanceKey = '__reactContainer$' + randomKey;
const internalEventHandlersKey = '__reactEvents$' + randomKey;
const internalEventHandlerListenersKey = '__reactListeners$' + randomKey;
const internalEventHandlesSetKey = '__reactHandles$' + randomKey;
const internalRootNodeResourcesKey = '__reactResources$' + randomKey;
const internalHoistableMarker = '__reactMarker$' + randomKey;
function detachDeletedInstance(node) {
  delete node[internalInstanceKey];
  delete node[internalPropsKey];
  delete node[internalEventHandlersKey];
  delete node[internalEventHandlerListenersKey];
  delete node[internalEventHandlesSetKey];
}
function precacheFiberNode(hostInst, node) {
  node[internalInstanceKey] = hostInst;
}
function markContainerAsRoot(hostRoot, node) {
  node[internalContainerInstanceKey] = hostRoot;
}
function unmarkContainerAsRoot(node) {
  node[internalContainerInstanceKey] = null;
}
function isContainerMarkedAsRoot(node) {
  return !!node[internalContainerInstanceKey];
}
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
function getInstanceFromNode(node) {
  const inst = node[internalInstanceKey] || node[internalContainerInstanceKey];

  if (inst) {
    const tag = inst.tag;

    if (tag === HostComponent || tag === HostText || tag === SuspenseComponent || tag === HostHoistable || tag === HostSingleton || tag === HostRoot) {
      return inst;
    } else {
      return null;
    }
  }

  return null;
}
function getNodeFromInstance(inst) {
  const tag = inst.tag;

  if (tag === HostComponent || tag === HostHoistable || tag === HostSingleton || tag === HostText) {
    return inst.stateNode;
  }

  throw new Error('getNodeFromInstance: Invalid argument.');
}
function getFiberCurrentPropsFromNode(node) {
  return node[internalPropsKey] || null;
}
function updateFiberProps(node, props) {
  node[internalPropsKey] = props;
}
function getEventListenerSet(node) {
  let elementListenerSet = node[internalEventHandlersKey];

  if (elementListenerSet === undefined) {
    elementListenerSet = node[internalEventHandlersKey] = new Set();
  }

  return elementListenerSet;
}
function getResourcesFromRoot(root) {
  let resources = root[internalRootNodeResourcesKey];

  if (!resources) {
    resources = root[internalRootNodeResourcesKey] = {
      hoistableStyles: new Map(),
      hoistableScripts: new Map()
    };
  }

  return resources;
}
function isMarkedHoistable(node) {
  return !!node[internalHoistableMarker];
}
function markNodeAsHoistable(node) {
  node[internalHoistableMarker] = true;
}
function isOwnedInstance(node) {
  return !!(node[internalHoistableMarker] || node[internalInstanceKey]);
}

const allNativeEvents = new Set();

const registrationNameDependencies = {};
const possibleRegistrationNames = {} ;
function registerTwoPhaseEvent(registrationName, dependencies) {
  registerDirectEvent(registrationName, dependencies);
  registerDirectEvent(registrationName + 'Capture', dependencies);
}
function registerDirectEvent(registrationName, dependencies) {
  {
    if (registrationNameDependencies[registrationName]) {
      console.error('EventRegistry: More than one plugin attempted to publish the same ' + 'registration name, `%s`.', registrationName);
    }
  }

  registrationNameDependencies[registrationName] = dependencies;

  {
    const lowerCasedName = registrationName.toLowerCase();
    possibleRegistrationNames[lowerCasedName] = registrationName;

    if (registrationName === 'onDoubleClick') {
      possibleRegistrationNames.ondblclick = registrationName;
    }
  }

  for (let i = 0; i < dependencies.length; i++) {
    allNativeEvents.add(dependencies[i]);
  }
}

const canUseDOM = !!(typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined');

const hasReadOnlyValue = {
  button: true,
  checkbox: true,
  image: true,
  hidden: true,
  radio: true,
  reset: true,
  submit: true
};
function checkControlledValueProps(tagName, props) {
  {
    if (!(hasReadOnlyValue[props.type] || props.onChange || props.onInput || props.readOnly || props.disabled || props.value == null)) {
      if (tagName === 'select') {
        console.error('You provided a `value` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultValue`. Otherwise, set `onChange`.');
      } else {
        console.error('You provided a `value` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.');
      }
    }

    if (!(props.onChange || props.readOnly || props.disabled || props.checked == null)) {
      console.error('You provided a `checked` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultChecked`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
    }
  }
}

const ATTRIBUTE_NAME_START_CHAR = ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
const ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + '\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040';
const VALID_ATTRIBUTE_NAME_REGEX = new RegExp('^[' + ATTRIBUTE_NAME_START_CHAR + '][' + ATTRIBUTE_NAME_CHAR + ']*$');
const illegalAttributeNameCache = {};
const validatedAttributeNameCache = {};
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

  {
    console.error('Invalid attribute name: `%s`', attributeName);
  }

  return false;
}

function getValueForAttribute(node, name, expected) {
  {
    if (!isAttributeNameSafe(name)) {
      return;
    }

    if (!node.hasAttribute(name)) {
      switch (typeof expected) {
        case 'function':
        case 'symbol':
          return expected;

        case 'boolean':
          {
            const prefix = name.toLowerCase().slice(0, 5);

            if (prefix !== 'data-' && prefix !== 'aria-') {
              return expected;
            }
          }
      }

      return expected === undefined ? undefined : null;
    }

    const value = node.getAttribute(name);

    {
      checkAttributeStringCoercion(expected, name);
    }

    if (value === '' + expected) {
      return expected;
    }

    return value;
  }
}
function getValueForAttributeOnCustomComponent(node, name, expected) {
  {
    if (!isAttributeNameSafe(name)) {
      return;
    }

    if (!node.hasAttribute(name)) {
      switch (typeof expected) {
        case 'symbol':
        case 'object':
          return expected;

        case 'function':
          return expected;

        case 'boolean':
          if (expected === false) {
            return expected;
          }

      }

      return expected === undefined ? undefined : null;
    }

    const value = node.getAttribute(name);

    if (value === '' && expected === true) {
      return true;
    }

    {
      checkAttributeStringCoercion(expected, name);
    }

    if (value === '' + expected) {
      return expected;
    }

    return value;
  }
}
function setValueForAttribute(node, name, value) {
  if (isAttributeNameSafe(name)) {
    if (value === null) {
      node.removeAttribute(name);
      return;
    }

    switch (typeof value) {
      case 'undefined':
      case 'function':
      case 'symbol':
        node.removeAttribute(name);
        return;

      case 'boolean':
        {
          const prefix = name.toLowerCase().slice(0, 5);

          if (prefix !== 'data-' && prefix !== 'aria-') {
            node.removeAttribute(name);
            return;
          }
        }
    }

    {
      checkAttributeStringCoercion(value, name);
    }

    node.setAttribute(name, '' + value);
  }
}
function setValueForKnownAttribute(node, name, value) {
  if (value === null) {
    node.removeAttribute(name);
    return;
  }

  switch (typeof value) {
    case 'undefined':
    case 'function':
    case 'symbol':
    case 'boolean':
      {
        node.removeAttribute(name);
        return;
      }
  }

  {
    checkAttributeStringCoercion(value, name);
  }

  node.setAttribute(name, '' + value);
}
function setValueForNamespacedAttribute(node, namespace, name, value) {
  if (value === null) {
    node.removeAttribute(name);
    return;
  }

  switch (typeof value) {
    case 'undefined':
    case 'function':
    case 'symbol':
    case 'boolean':
      {
        node.removeAttribute(name);
        return;
      }
  }

  {
    checkAttributeStringCoercion(value, name);
  }

  node.setAttributeNS(namespace, name, '' + value);
}
function setValueForPropertyOnCustomComponent(node, name, value) {
  if (name[0] === 'o' && name[1] === 'n') {
    const useCapture = name.endsWith('Capture');
    const eventName = name.slice(2, useCapture ? name.length - 7 : undefined);
    const prevProps = getFiberCurrentPropsFromNode(node);
    const prevValue = prevProps != null ? prevProps[name] : null;

    if (typeof prevValue === 'function') {
      node.removeEventListener(eventName, prevValue, useCapture);
    }

    if (typeof value === 'function') {
      if (typeof prevValue !== 'function' && prevValue !== null) {
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

  if (name in node) {
    node[name] = value;
    return;
  }

  if (value === true) {
    node.setAttribute(name, '');
    return;
  }

  setValueForAttribute(node, name, value);
}

function toString(value) {
  return '' + value;
}
function getToStringValue(value) {
  switch (typeof value) {
    case 'bigint':
    case 'boolean':
    case 'number':
    case 'string':
    case 'undefined':
      return value;

    case 'object':
      {
        checkFormFieldValueStringCoercion(value);
      }

      return value;

    default:
      return '';
  }
}

function isCheckable(elem) {
  const type = elem.type;
  const nodeName = elem.nodeName;
  return nodeName && nodeName.toLowerCase() === 'input' && (type === 'checkbox' || type === 'radio');
}

function getTracker(node) {
  return node._valueTracker;
}

function detachTracker(node) {
  node._valueTracker = null;
}

function getValueFromNode(node) {
  let value = '';

  if (!node) {
    return value;
  }

  if (isCheckable(node)) {
    value = node.checked ? 'true' : 'false';
  } else {
    value = node.value;
  }

  return value;
}

function trackValueOnNode(node) {
  const valueField = isCheckable(node) ? 'checked' : 'value';
  const descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, valueField);

  {
    checkFormFieldValueStringCoercion(node[valueField]);
  }

  let currentValue = '' + node[valueField];

  if (node.hasOwnProperty(valueField) || typeof descriptor === 'undefined' || typeof descriptor.get !== 'function' || typeof descriptor.set !== 'function') {
    return;
  }

  const {
    get,
    set
  } = descriptor;
  Object.defineProperty(node, valueField, {
    configurable: true,
    get: function () {
      return get.call(this);
    },
    set: function (value) {
      {
        checkFormFieldValueStringCoercion(value);
      }

      currentValue = '' + value;
      set.call(this, value);
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
      {
        checkFormFieldValueStringCoercion(value);
      }

      currentValue = '' + value;
    },

    stopTracking() {
      detachTracker(node);
      delete node[valueField];
    }

  };
  return tracker;
}

function track(node) {
  if (getTracker(node)) {
    return;
  }

  node._valueTracker = trackValueOnNode(node);
}
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

function getActiveElement(doc) {
  doc = doc || (typeof document !== 'undefined' ? document : undefined);

  if (typeof doc === 'undefined') {
    return null;
  }

  try {
    return doc.activeElement || doc.body;
  } catch (e) {
    return doc.body;
  }
}

const escapeSelectorAttributeValueInsideDoubleQuotesRegex = /[\n\"\\]/g;
function escapeSelectorAttributeValueInsideDoubleQuotes(value) {
  return value.replace(escapeSelectorAttributeValueInsideDoubleQuotesRegex, ch => '\\' + ch.charCodeAt(0).toString(16) + ' ');
}

let didWarnValueDefaultValue$1 = false;
let didWarnCheckedDefaultChecked = false;
function validateInputProps(element, props) {
  {
    if (props.checked !== undefined && props.defaultChecked !== undefined && !didWarnCheckedDefaultChecked) {
      console.error('%s contains an input of type %s with both checked and defaultChecked props. ' + 'Input elements must be either controlled or uncontrolled ' + '(specify either the checked prop, or the defaultChecked prop, but not ' + 'both). Decide between using a controlled or uncontrolled input ' + 'element and remove one of these props. More info: ' + 'https://react.dev/link/controlled-components', getCurrentFiberOwnerNameInDevOrNull() || 'A component', props.type);
      didWarnCheckedDefaultChecked = true;
    }

    if (props.value !== undefined && props.defaultValue !== undefined && !didWarnValueDefaultValue$1) {
      console.error('%s contains an input of type %s with both value and defaultValue props. ' + 'Input elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled input ' + 'element and remove one of these props. More info: ' + 'https://react.dev/link/controlled-components', getCurrentFiberOwnerNameInDevOrNull() || 'A component', props.type);
      didWarnValueDefaultValue$1 = true;
    }
  }
}
function updateInput(element, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name) {
  const node = element;
  node.name = '';

  if (type != null && typeof type !== 'function' && typeof type !== 'symbol' && typeof type !== 'boolean') {
    {
      checkAttributeStringCoercion(type, 'type');
    }

    node.type = type;
  } else {
    node.removeAttribute('type');
  }

  if (value != null) {
    if (type === 'number') {
      if (value === 0 && node.value === '' || node.value != value) {
        node.value = toString(getToStringValue(value));
      }
    } else if (node.value !== toString(getToStringValue(value))) {
      node.value = toString(getToStringValue(value));
    }
  } else if (type === 'submit' || type === 'reset') {
    node.removeAttribute('value');
  }

  {
    if (value != null) {
      setDefaultValue(node, type, getToStringValue(value));
    } else if (defaultValue != null) {
      setDefaultValue(node, type, getToStringValue(defaultValue));
    } else if (lastDefaultValue != null) {
      node.removeAttribute('value');
    }
  }

  {
    if (checked == null && defaultChecked != null) {
      node.defaultChecked = !!defaultChecked;
    }
  }

  if (checked != null) {
    node.checked = checked && typeof checked !== 'function' && typeof checked !== 'symbol';
  }

  if (name != null && typeof name !== 'function' && typeof name !== 'symbol' && typeof name !== 'boolean') {
    {
      checkAttributeStringCoercion(name, 'name');
    }

    node.name = toString(getToStringValue(name));
  } else {
    node.removeAttribute('name');
  }
}
function initInput(element, value, defaultValue, checked, defaultChecked, type, name, isHydrating) {
  const node = element;

  if (type != null && typeof type !== 'function' && typeof type !== 'symbol' && typeof type !== 'boolean') {
    {
      checkAttributeStringCoercion(type, 'type');
    }

    node.type = type;
  }

  if (value != null || defaultValue != null) {
    const isButton = type === 'submit' || type === 'reset';

    if (isButton && (value === undefined || value === null)) {
      return;
    }

    const defaultValueStr = defaultValue != null ? toString(getToStringValue(defaultValue)) : '';
    const initialValue = value != null ? toString(getToStringValue(value)) : defaultValueStr;

    if (!isHydrating) {
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

  const checkedOrDefault = checked != null ? checked : defaultChecked;
  const initialChecked = typeof checkedOrDefault !== 'function' && typeof checkedOrDefault !== 'symbol' && !!checkedOrDefault;

  if (isHydrating) {
    node.checked = node.checked;
  } else {
    node.checked = !!initialChecked;
  }

  {
    node.defaultChecked = !node.defaultChecked;
    node.defaultChecked = !!initialChecked;
  }

  if (name != null && typeof name !== 'function' && typeof name !== 'symbol' && typeof name !== 'boolean') {
    {
      checkAttributeStringCoercion(name, 'name');
    }

    node.name = name;
  }
}
function restoreControlledInputState(element, props) {
  const rootNode = element;
  updateInput(rootNode, props.value, props.defaultValue, props.defaultValue, props.checked, props.defaultChecked, props.type, props.name);
  const name = props.name;

  if (props.type === 'radio' && name != null) {
    let queryRoot = rootNode;

    while (queryRoot.parentNode) {
      queryRoot = queryRoot.parentNode;
    }

    {
      checkAttributeStringCoercion(name, 'name');
    }

    const group = queryRoot.querySelectorAll('input[name="' + escapeSelectorAttributeValueInsideDoubleQuotes('' + name) + '"][type="radio"]');

    for (let i = 0; i < group.length; i++) {
      const otherNode = group[i];

      if (otherNode === rootNode || otherNode.form !== rootNode.form) {
        continue;
      }

      const otherProps = getFiberCurrentPropsFromNode(otherNode);

      if (!otherProps) {
        throw new Error('ReactDOMInput: Mixing React and non-React radio inputs with the ' + 'same `name` is not supported.');
      }

      updateInput(otherNode, otherProps.value, otherProps.defaultValue, otherProps.defaultValue, otherProps.checked, otherProps.defaultChecked, otherProps.type, otherProps.name);
    }

    for (let i = 0; i < group.length; i++) {
      const otherNode = group[i];

      if (otherNode.form !== rootNode.form) {
        continue;
      }

      updateValueIfChanged(otherNode);
    }
  }
}
function setDefaultValue(node, type, value) {
  if (type !== 'number' || getActiveElement(node.ownerDocument) !== node) {
    if (node.defaultValue !== toString(value)) {
      node.defaultValue = toString(value);
    }
  }
}

let didWarnSelectedSetOnOption = false;
let didWarnInvalidChild = false;
let didWarnInvalidInnerHTML = false;
function validateOptionProps(element, props) {
  {
    if (props.value == null) {
      if (typeof props.children === 'object' && props.children !== null) {
        Children.forEach(props.children, function (child) {
          if (child == null) {
            return;
          }

          if (typeof child === 'string' || typeof child === 'number' || typeof child === 'bigint') {
            return;
          }

          if (!didWarnInvalidChild) {
            didWarnInvalidChild = true;
            console.error('Cannot infer the option value of complex children. ' + 'Pass a `value` prop or use a plain string as children to <option>.');
          }
        });
      } else if (props.dangerouslySetInnerHTML != null) {
        if (!didWarnInvalidInnerHTML) {
          didWarnInvalidInnerHTML = true;
          console.error('Pass a `value` prop if you set dangerouslyInnerHTML so React knows ' + 'which value should be selected.');
        }
      }
    }

    if (props.selected != null && !didWarnSelectedSetOnOption) {
      console.error('Use the `defaultValue` or `value` props on <select> instead of ' + 'setting `selected` on <option>.');
      didWarnSelectedSetOnOption = true;
    }
  }
}

let didWarnValueDefaultValue;

{
  didWarnValueDefaultValue = false;
}

function getDeclarationErrorAddendum() {
  const ownerName = getCurrentFiberOwnerNameInDevOrNull();

  if (ownerName) {
    return '\n\nCheck the render method of `' + ownerName + '`.';
  }

  return '';
}

const valuePropNames = ['value', 'defaultValue'];

function checkSelectPropTypes(props) {
  {
    for (let i = 0; i < valuePropNames.length; i++) {
      const propName = valuePropNames[i];

      if (props[propName] == null) {
        continue;
      }

      const propNameIsArray = isArray(props[propName]);

      if (props.multiple && !propNameIsArray) {
        console.error('The `%s` prop supplied to <select> must be an array if ' + '`multiple` is true.%s', propName, getDeclarationErrorAddendum());
      } else if (!props.multiple && propNameIsArray) {
        console.error('The `%s` prop supplied to <select> must be a scalar ' + 'value if `multiple` is false.%s', propName, getDeclarationErrorAddendum());
      }
    }
  }
}

function updateOptions(node, multiple, propValue, setDefaultSelected) {
  const options = node.options;

  if (multiple) {
    const selectedValues = propValue;
    const selectedValue = {};

    for (let i = 0; i < selectedValues.length; i++) {
      selectedValue['$' + selectedValues[i]] = true;
    }

    for (let i = 0; i < options.length; i++) {
      const selected = selectedValue.hasOwnProperty('$' + options[i].value);

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

function validateSelectProps(element, props) {
  {
    checkSelectPropTypes(props);

    if (props.value !== undefined && props.defaultValue !== undefined && !didWarnValueDefaultValue) {
      console.error('Select elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled select ' + 'element and remove one of these props. More info: ' + 'https://react.dev/link/controlled-components');
      didWarnValueDefaultValue = true;
    }
  }
}
function initSelect(element, value, defaultValue, multiple) {
  const node = element;
  node.multiple = !!multiple;

  if (value != null) {
    updateOptions(node, !!multiple, value, false);
  } else if (defaultValue != null) {
    updateOptions(node, !!multiple, defaultValue, true);
  }
}
function updateSelect(element, value, defaultValue, multiple, wasMultiple) {
  const node = element;

  if (value != null) {
    updateOptions(node, !!multiple, value, false);
  } else if (!!wasMultiple !== !!multiple) {
    if (defaultValue != null) {
      updateOptions(node, !!multiple, defaultValue, true);
    } else {
      updateOptions(node, !!multiple, multiple ? [] : '', false);
    }
  }
}
function restoreControlledSelectState(element, props) {
  const node = element;
  const value = props.value;

  if (value != null) {
    updateOptions(node, !!props.multiple, value, false);
  }
}

let didWarnValDefaultVal = false;
function validateTextareaProps(element, props) {
  {
    if (props.value !== undefined && props.defaultValue !== undefined && !didWarnValDefaultVal) {
      console.error('%s contains a textarea with both value and defaultValue props. ' + 'Textarea elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled textarea ' + 'and remove one of these props. More info: ' + 'https://react.dev/link/controlled-components', getCurrentFiberOwnerNameInDevOrNull() || 'A component');
      didWarnValDefaultVal = true;
    }

    if (props.children != null && props.value == null) {
      console.error('Use the `defaultValue` or `value` props instead of setting ' + 'children on <textarea>.');
    }
  }
}
function updateTextarea(element, value, defaultValue) {
  const node = element;

  if (value != null) {
    const newValue = toString(getToStringValue(value));

    if (newValue !== node.value) {
      node.value = newValue;
    }

    if (defaultValue == null) {
      if (node.defaultValue !== newValue) {
        node.defaultValue = newValue;
      }

      return;
    }
  }

  if (defaultValue != null) {
    node.defaultValue = toString(getToStringValue(defaultValue));
  } else {
    node.defaultValue = '';
  }
}
function initTextarea(element, value, defaultValue, children) {
  const node = element;
  let initialValue = value;

  if (initialValue == null) {
    if (children != null) {
      {
        if (defaultValue != null) {
          throw new Error('If you supply `defaultValue` on a <textarea>, do not pass children.');
        }

        if (isArray(children)) {
          if (children.length > 1) {
            throw new Error('<textarea> can only have at most one child.');
          }

          children = children[0];
        }

        defaultValue = children;
      }
    }

    if (defaultValue == null) {
      defaultValue = '';
    }

    initialValue = defaultValue;
  }

  const stringValue = getToStringValue(initialValue);
  node.defaultValue = stringValue;
  const textContent = node.textContent;

  if (textContent === stringValue) {
    if (textContent !== '' && textContent !== null) {
      node.value = textContent;
    }
  }
}
function restoreControlledTextareaState(element, props) {
  updateTextarea(element, props.value, props.defaultValue);
}

const assign = Object.assign;

const maxRowLength = 120;
const idealDepth = 15;

function findNotableNode(node, indent) {
  if (node.serverProps === undefined && node.serverTail.length === 0 && node.children.length === 1 && node.distanceFromLeaf > 3 && node.distanceFromLeaf > idealDepth - indent) {
    const child = node.children[0];
    return findNotableNode(child, indent);
  }

  return node;
}

function indentation(indent) {
  return '  ' + '  '.repeat(indent);
}

function added(indent) {
  return '+ ' + '  '.repeat(indent);
}

function removed(indent) {
  return '- ' + '  '.repeat(indent);
}

function describeFiberType(fiber) {
  switch (fiber.tag) {
    case HostHoistable:
    case HostSingleton:
    case HostComponent:
      return fiber.type;

    case LazyComponent:
      return 'Lazy';

    case SuspenseComponent:
      return 'Suspense';

    case SuspenseListComponent:
      return 'SuspenseList';

    case FunctionComponent:
    case SimpleMemoComponent:
      const fn = fiber.type;
      return fn.displayName || fn.name || null;

    case ForwardRef:
      const render = fiber.type.render;
      return render.displayName || render.name || null;

    case ClassComponent:
      const ctr = fiber.type;
      return ctr.displayName || ctr.name || null;

    default:
      return null;
  }
}

const needsEscaping = /["'&<>\n\t]|^\s|\s$/;

function describeTextNode(content, maxLength) {
  if (needsEscaping.test(content)) {
    const encoded = JSON.stringify(content);

    if (encoded.length > maxLength - 2) {
      if (maxLength < 8) {
        return '{"..."}';
      }

      return '{' + encoded.slice(0, maxLength - 7) + '..."}';
    }

    return '{' + encoded + '}';
  } else {
    if (content.length > maxLength) {
      if (maxLength < 5) {
        return '{"..."}';
      }

      return content.slice(0, maxLength - 3) + '...';
    }

    return content;
  }
}

function describeTextDiff(clientText, serverProps, indent) {
  const maxLength = maxRowLength - indent * 2;

  if (serverProps === null) {
    return added(indent) + describeTextNode(clientText, maxLength) + '\n';
  } else if (typeof serverProps === 'string') {
    let serverText = serverProps;
    let firstDiff = 0;

    for (; firstDiff < serverText.length && firstDiff < clientText.length; firstDiff++) {
      if (serverText.charCodeAt(firstDiff) !== clientText.charCodeAt(firstDiff)) {
        break;
      }
    }

    if (firstDiff > maxLength - 8 && firstDiff > 10) {
      clientText = '...' + clientText.slice(firstDiff - 8);
      serverText = '...' + serverText.slice(firstDiff - 8);
    }

    return added(indent) + describeTextNode(clientText, maxLength) + '\n' + removed(indent) + describeTextNode(serverText, maxLength) + '\n';
  } else {
    return indentation(indent) + describeTextNode(clientText, maxLength) + '\n';
  }
}

function objectName(object) {
  const name = Object.prototype.toString.call(object);
  return name.replace(/^\[object (.*)\]$/, function (m, p0) {
    return p0;
  });
}

function describeValue(value, maxLength) {
  switch (typeof value) {
    case 'string':
      {
        const encoded = JSON.stringify(value);

        if (encoded.length > maxLength) {
          if (maxLength < 5) {
            return '"..."';
          }

          return encoded.slice(0, maxLength - 4) + '..."';
        }

        return encoded;
      }

    case 'object':
      {
        if (value === null) {
          return 'null';
        }

        if (isArray(value)) {
          return '[...]';
        }

        if (value.$$typeof === REACT_ELEMENT_TYPE) {
          const type = getComponentNameFromType(value.type);
          return type ? '<' + type + '>' : '<...>';
        }

        const name = objectName(value);

        if (name === 'Object') {
          let properties = '';
          maxLength -= 2;

          for (let propName in value) {
            if (!value.hasOwnProperty(propName)) {
              continue;
            }

            const jsonPropName = JSON.stringify(propName);

            if (jsonPropName !== '"' + propName + '"') {
              propName = jsonPropName;
            }

            maxLength -= propName.length - 2;
            const propValue = describeValue(value[propName], maxLength < 15 ? maxLength : 15);
            maxLength -= propValue.length;

            if (maxLength < 0) {
              properties += properties === '' ? '...' : ', ...';
              break;
            }

            properties += (properties === '' ? '' : ',') + propName + ':' + propValue;
          }

          return '{' + properties + '}';
        }

        return name;
      }

    case 'function':
      {
        const name = value.displayName || value.name;
        return name ? 'function ' + name : 'function';
      }

    default:
      return String(value);
  }
}

function describePropValue(value, maxLength) {
  if (typeof value === 'string' && !needsEscaping.test(value)) {
    if (value.length > maxLength - 2) {
      if (maxLength < 5) {
        return '"..."';
      }

      return '"' + value.slice(0, maxLength - 5) + '..."';
    }

    return '"' + value + '"';
  }

  return '{' + describeValue(value, maxLength - 2) + '}';
}

function describeCollapsedElement(type, props, indent) {
  let maxLength = maxRowLength - indent * 2 - type.length - 2;
  let content = '';

  for (const propName in props) {
    if (!props.hasOwnProperty(propName)) {
      continue;
    }

    if (propName === 'children') {
      continue;
    }

    const propValue = describePropValue(props[propName], 15);
    maxLength -= propName.length + propValue.length + 2;

    if (maxLength < 0) {
      content += ' ...';
      break;
    }

    content += ' ' + propName + '=' + propValue;
  }

  return indentation(indent) + '<' + type + content + '>\n';
}

function describeExpandedElement(type, props, rowPrefix) {
  let remainingRowLength = maxRowLength - rowPrefix.length - type.length;
  const properties = [];

  for (const propName in props) {
    if (!props.hasOwnProperty(propName)) {
      continue;
    }

    if (propName === 'children') {
      continue;
    }

    const maxLength = maxRowLength - rowPrefix.length - propName.length - 1;
    const propValue = describePropValue(props[propName], maxLength);
    remainingRowLength -= propName.length + propValue.length + 2;
    properties.push(propName + '=' + propValue);
  }

  if (properties.length === 0) {
    return rowPrefix + '<' + type + '>\n';
  } else if (remainingRowLength > 0) {
    return rowPrefix + '<' + type + ' ' + properties.join(' ') + '>\n';
  } else {
    return rowPrefix + '<' + type + '\n' + rowPrefix + '  ' + properties.join('\n' + rowPrefix + '  ') + '\n' + rowPrefix + '>\n';
  }
}

function describePropertiesDiff(clientObject, serverObject, indent) {
  let properties = '';
  const remainingServerProperties = assign({}, serverObject);

  for (const propName in clientObject) {
    if (!clientObject.hasOwnProperty(propName)) {
      continue;
    }

    delete remainingServerProperties[propName];
    const maxLength = maxRowLength - indent * 2 - propName.length - 2;
    const clientValue = clientObject[propName];
    const clientPropValue = describeValue(clientValue, maxLength);

    if (serverObject.hasOwnProperty(propName)) {
      const serverValue = serverObject[propName];
      const serverPropValue = describeValue(serverValue, maxLength);
      properties += added(indent) + propName + ': ' + clientPropValue + '\n';
      properties += removed(indent) + propName + ': ' + serverPropValue + '\n';
    } else {
      properties += added(indent) + propName + ': ' + clientPropValue + '\n';
    }
  }

  for (const propName in remainingServerProperties) {
    if (!remainingServerProperties.hasOwnProperty(propName)) {
      continue;
    }

    const maxLength = maxRowLength - indent * 2 - propName.length - 2;
    const serverValue = remainingServerProperties[propName];
    const serverPropValue = describeValue(serverValue, maxLength);
    properties += removed(indent) + propName + ': ' + serverPropValue + '\n';
  }

  return properties;
}

function describeElementDiff(type, clientProps, serverProps, indent) {
  let content = '';
  const serverPropNames = new Map();

  for (const propName in serverProps) {
    if (!serverProps.hasOwnProperty(propName)) {
      continue;
    }

    serverPropNames.set(propName.toLowerCase(), propName);
  }

  if (serverPropNames.size === 1 && serverPropNames.has('children')) {
    content += describeExpandedElement(type, clientProps, indentation(indent));
  } else {
    for (const propName in clientProps) {
      if (!clientProps.hasOwnProperty(propName)) {
        continue;
      }

      if (propName === 'children') {
        continue;
      }

      const maxLength = maxRowLength - (indent + 1) * 2 - propName.length - 1;
      const serverPropName = serverPropNames.get(propName.toLowerCase());

      if (serverPropName !== undefined) {
        serverPropNames.delete(propName.toLowerCase());
        const clientValue = clientProps[propName];
        const serverValue = serverProps[serverPropName];
        const clientPropValue = describePropValue(clientValue, maxLength);
        const serverPropValue = describePropValue(serverValue, maxLength);

        if (typeof clientValue === 'object' && clientValue !== null && typeof serverValue === 'object' && serverValue !== null && objectName(clientValue) === 'Object' && objectName(serverValue) === 'Object' && (Object.keys(clientValue).length > 2 || Object.keys(serverValue).length > 2 || clientPropValue.indexOf('...') > -1 || serverPropValue.indexOf('...') > -1)) {
          content += indentation(indent + 1) + propName + '={{\n' + describePropertiesDiff(clientValue, serverValue, indent + 2) + indentation(indent + 1) + '}}\n';
        } else {
          content += added(indent + 1) + propName + '=' + clientPropValue + '\n';
          content += removed(indent + 1) + propName + '=' + serverPropValue + '\n';
        }
      } else {
        content += indentation(indent + 1) + propName + '=' + describePropValue(clientProps[propName], maxLength) + '\n';
      }
    }

    serverPropNames.forEach(propName => {
      if (propName === 'children') {
        return;
      }

      const maxLength = maxRowLength - (indent + 1) * 2 - propName.length - 1;
      content += removed(indent + 1) + propName + '=' + describePropValue(serverProps[propName], maxLength) + '\n';
    });

    if (content === '') {
      content = indentation(indent) + '<' + type + '>\n';
    } else {
      content = indentation(indent) + '<' + type + '\n' + content + indentation(indent) + '>\n';
    }
  }

  const serverChildren = serverProps.children;
  const clientChildren = clientProps.children;

  if (typeof serverChildren === 'string' || typeof serverChildren === 'number' || typeof serverChildren === 'bigint') {
    const serverText = '' + serverChildren;
    let clientText = '';

    if (typeof clientChildren === 'string' || typeof clientChildren === 'number' || typeof clientChildren === 'bigint') {
      clientText = '' + clientChildren;
    }

    content += describeTextDiff(clientText, serverText, indent + 1);
  } else if (typeof clientChildren === 'string' || typeof clientChildren === 'number' || typeof clientChildren === 'bigint') {
    if (serverChildren == null) {
      content += describeTextDiff('' + clientChildren, null, indent + 1);
    } else {
      content += describeTextDiff('' + clientChildren, undefined, indent + 1);
    }
  }

  return content;
}

function describeSiblingFiber(fiber, indent) {
  const type = describeFiberType(fiber);

  if (type === null) {
    let flatContent = '';
    let childFiber = fiber.child;

    while (childFiber) {
      flatContent += describeSiblingFiber(childFiber, indent);
      childFiber = childFiber.sibling;
    }

    return flatContent;
  }

  return indentation(indent) + '<' + type + '>' + '\n';
}

function describeNode(node, indent) {
  const skipToNode = findNotableNode(node, indent);

  if (skipToNode !== node && (node.children.length !== 1 || node.children[0] !== skipToNode)) {
    return indentation(indent) + '...\n' + describeNode(skipToNode, indent + 1);
  }

  let parentContent = '';
  const debugInfo = node.fiber._debugInfo;

  if (debugInfo) {
    for (let i = 0; i < debugInfo.length; i++) {
      const serverComponentName = debugInfo[i].name;

      if (typeof serverComponentName === 'string') {
        parentContent += indentation(indent) + '<' + serverComponentName + '>' + '\n';
        indent++;
      }
    }
  }

  let selfContent = '';
  const clientProps = node.fiber.pendingProps;

  if (node.fiber.tag === HostText) {
    selfContent = describeTextDiff(clientProps, node.serverProps, indent);
    indent++;
  } else {
    const type = describeFiberType(node.fiber);

    if (type !== null) {
      if (node.serverProps === undefined) {
        selfContent = describeCollapsedElement(type, clientProps, indent);
        indent++;
      } else if (node.serverProps === null) {
        selfContent = describeExpandedElement(type, clientProps, added(indent));
        indent++;
      } else if (typeof node.serverProps === 'string') {
        {
          console.error('Should not have matched a non HostText fiber to a Text node. This is a bug in React.');
        }
      } else {
        selfContent = describeElementDiff(type, clientProps, node.serverProps, indent);
        indent++;
      }
    }
  }

  let childContent = '';
  let childFiber = node.fiber.child;
  let diffIdx = 0;

  while (childFiber && diffIdx < node.children.length) {
    const childNode = node.children[diffIdx];

    if (childNode.fiber === childFiber) {
      childContent += describeNode(childNode, indent);
      diffIdx++;
    } else {
      childContent += describeSiblingFiber(childFiber, indent);
    }

    childFiber = childFiber.sibling;
  }

  if (childFiber && node.children.length > 0) {
    childContent += indentation(indent) + '...' + '\n';
  }

  const serverTail = node.serverTail;

  if (node.serverProps === null) {
    indent--;
  }

  for (let i = 0; i < serverTail.length; i++) {
    const tailNode = serverTail[i];

    if (typeof tailNode === 'string') {
      childContent += removed(indent) + describeTextNode(tailNode, maxRowLength - indent * 2) + '\n';
    } else {
      childContent += describeExpandedElement(tailNode.type, tailNode.props, removed(indent));
    }
  }

  return parentContent + selfContent + childContent;
}

function describeDiff(rootNode) {
  try {
    return '\n\n' + describeNode(rootNode, 0);
  } catch (x) {
    return '';
  }
}

function describeAncestors(ancestor, child, props) {
  let fiber = child;
  let node = null;
  let distanceFromLeaf = 0;

  while (fiber) {
    if (fiber === ancestor) {
      distanceFromLeaf = 0;
    }

    node = {
      fiber: fiber,
      children: node !== null ? [node] : [],
      serverProps: fiber === child ? props : fiber === ancestor ? null : undefined,
      serverTail: [],
      distanceFromLeaf: distanceFromLeaf
    };
    distanceFromLeaf++;
    fiber = fiber.return;
  }

  if (node !== null) {
    return describeDiff(node).replaceAll(/^[+-]/gm, '>');
  }

  return '';
}

const specialTags = ['address', 'applet', 'area', 'article', 'aside', 'base', 'basefont', 'bgsound', 'blockquote', 'body', 'br', 'button', 'caption', 'center', 'col', 'colgroup', 'dd', 'details', 'dir', 'div', 'dl', 'dt', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'iframe', 'img', 'input', 'isindex', 'li', 'link', 'listing', 'main', 'marquee', 'menu', 'menuitem', 'meta', 'nav', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'p', 'param', 'plaintext', 'pre', 'script', 'section', 'select', 'source', 'style', 'summary', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'track', 'ul', 'wbr', 'xmp'];
const inScopeTags = ['applet', 'caption', 'html', 'table', 'td', 'th', 'marquee', 'object', 'template', 'foreignObject', 'desc', 'title'];
const buttonScopeTags = inScopeTags.concat(['button']) ;
const impliedEndTags = ['dd', 'dt', 'li', 'option', 'optgroup', 'p', 'rp', 'rt'];
const emptyAncestorInfoDev = {
  current: null,
  formTag: null,
  aTagInScope: null,
  buttonTagInScope: null,
  nobrTagInScope: null,
  pTagInButtonScope: null,
  listItemTagAutoclosing: null,
  dlItemTagAutoclosing: null,
  containerTagInScope: null
};

function updatedAncestorInfoDev(oldInfo, tag) {
  {
    const ancestorInfo = { ...(oldInfo || emptyAncestorInfoDev)
    };
    const info = {
      tag
    };

    if (inScopeTags.indexOf(tag) !== -1) {
      ancestorInfo.aTagInScope = null;
      ancestorInfo.buttonTagInScope = null;
      ancestorInfo.nobrTagInScope = null;
    }

    if (buttonScopeTags.indexOf(tag) !== -1) {
      ancestorInfo.pTagInButtonScope = null;
    }

    if (specialTags.indexOf(tag) !== -1 && tag !== 'address' && tag !== 'div' && tag !== 'p') {
      ancestorInfo.listItemTagAutoclosing = null;
      ancestorInfo.dlItemTagAutoclosing = null;
    }

    ancestorInfo.current = info;

    if (tag === 'form') {
      ancestorInfo.formTag = info;
    }

    if (tag === 'a') {
      ancestorInfo.aTagInScope = info;
    }

    if (tag === 'button') {
      ancestorInfo.buttonTagInScope = info;
    }

    if (tag === 'nobr') {
      ancestorInfo.nobrTagInScope = info;
    }

    if (tag === 'p') {
      ancestorInfo.pTagInButtonScope = info;
    }

    if (tag === 'li') {
      ancestorInfo.listItemTagAutoclosing = info;
    }

    if (tag === 'dd' || tag === 'dt') {
      ancestorInfo.dlItemTagAutoclosing = info;
    }

    if (tag === '#document' || tag === 'html') {
      ancestorInfo.containerTagInScope = null;
    } else if (!ancestorInfo.containerTagInScope) {
      ancestorInfo.containerTagInScope = info;
    }

    return ancestorInfo;
  }
}

function isTagValidWithParent(tag, parentTag) {
  switch (parentTag) {
    case 'select':
      return tag === 'hr' || tag === 'option' || tag === 'optgroup' || tag === '#text';

    case 'optgroup':
      return tag === 'option' || tag === '#text';

    case 'option':
      return tag === '#text';

    case 'tr':
      return tag === 'th' || tag === 'td' || tag === 'style' || tag === 'script' || tag === 'template';

    case 'tbody':
    case 'thead':
    case 'tfoot':
      return tag === 'tr' || tag === 'style' || tag === 'script' || tag === 'template';

    case 'colgroup':
      return tag === 'col' || tag === 'template';

    case 'table':
      return tag === 'caption' || tag === 'colgroup' || tag === 'tbody' || tag === 'tfoot' || tag === 'thead' || tag === 'style' || tag === 'script' || tag === 'template';

    case 'head':
      return tag === 'base' || tag === 'basefont' || tag === 'bgsound' || tag === 'link' || tag === 'meta' || tag === 'title' || tag === 'noscript' || tag === 'noframes' || tag === 'style' || tag === 'script' || tag === 'template';

    case 'html':
      return tag === 'head' || tag === 'body' || tag === 'frameset';

    case 'frameset':
      return tag === 'frame';

    case '#document':
      return tag === 'html';
  }

  switch (tag) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return parentTag !== 'h1' && parentTag !== 'h2' && parentTag !== 'h3' && parentTag !== 'h4' && parentTag !== 'h5' && parentTag !== 'h6';

    case 'rp':
    case 'rt':
      return impliedEndTags.indexOf(parentTag) === -1;

    case 'body':
    case 'caption':
    case 'col':
    case 'colgroup':
    case 'frameset':
    case 'frame':
    case 'head':
    case 'html':
    case 'tbody':
    case 'td':
    case 'tfoot':
    case 'th':
    case 'thead':
    case 'tr':
      return parentTag == null;
  }

  return true;
}

function findInvalidAncestorForTag(tag, ancestorInfo) {
  switch (tag) {
    case 'address':
    case 'article':
    case 'aside':
    case 'blockquote':
    case 'center':
    case 'details':
    case 'dialog':
    case 'dir':
    case 'div':
    case 'dl':
    case 'fieldset':
    case 'figcaption':
    case 'figure':
    case 'footer':
    case 'header':
    case 'hgroup':
    case 'main':
    case 'menu':
    case 'nav':
    case 'ol':
    case 'p':
    case 'section':
    case 'summary':
    case 'ul':
    case 'pre':
    case 'listing':
    case 'table':
    case 'hr':
    case 'xmp':
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return ancestorInfo.pTagInButtonScope;

    case 'form':
      return ancestorInfo.formTag || ancestorInfo.pTagInButtonScope;

    case 'li':
      return ancestorInfo.listItemTagAutoclosing;

    case 'dd':
    case 'dt':
      return ancestorInfo.dlItemTagAutoclosing;

    case 'button':
      return ancestorInfo.buttonTagInScope;

    case 'a':
      return ancestorInfo.aTagInScope;

    case 'nobr':
      return ancestorInfo.nobrTagInScope;
  }

  return null;
}

const didWarn = {};

function findAncestor(parent, tagName) {
  while (parent) {
    switch (parent.tag) {
      case HostComponent:
      case HostHoistable:
      case HostSingleton:
        if (parent.type === tagName) {
          return parent;
        }

    }

    parent = parent.return;
  }

  return null;
}

function validateDOMNesting(childTag, ancestorInfo) {
  {
    ancestorInfo = ancestorInfo || emptyAncestorInfoDev;
    const parentInfo = ancestorInfo.current;
    const parentTag = parentInfo && parentInfo.tag;
    const invalidParent = isTagValidWithParent(childTag, parentTag) ? null : parentInfo;
    const invalidAncestor = invalidParent ? null : findInvalidAncestorForTag(childTag, ancestorInfo);
    const invalidParentOrAncestor = invalidParent || invalidAncestor;

    if (!invalidParentOrAncestor) {
      return true;
    }

    const ancestorTag = invalidParentOrAncestor.tag;
    const warnKey = String(!!invalidParent) + '|' + childTag + '|' + ancestorTag;

    if (didWarn[warnKey]) {
      return false;
    }

    didWarn[warnKey] = true;
    const child = current;
    const ancestor = child ? findAncestor(child.return, ancestorTag) : null;
    const ancestorDescription = child !== null && ancestor !== null ? describeAncestors(ancestor, child, null) : '';
    const tagDisplayName = '<' + childTag + '>';

    if (invalidParent) {
      let info = '';

      if (ancestorTag === 'table' && childTag === 'tr') {
        info += ' Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by ' + 'the browser.';
      }

      console.error('In HTML, %s cannot be a child of <%s>.%s\n' + 'This will cause a hydration error.%s', tagDisplayName, ancestorTag, info, ancestorDescription);
    } else {
      console.error('In HTML, %s cannot be a descendant of <%s>.\n' + 'This will cause a hydration error.%s', tagDisplayName, ancestorTag, ancestorDescription);
    }

    return false;
  }
}

function validateTextNesting(childText, parentTag) {
  {
    if (isTagValidWithParent('#text', parentTag)) {
      return true;
    }

    const warnKey = '#text|' + parentTag;

    if (didWarn[warnKey]) {
      return false;
    }

    didWarn[warnKey] = true;
    const child = current;
    const ancestor = child ? findAncestor(child, parentTag) : null;
    const ancestorDescription = child !== null && ancestor !== null ? describeAncestors(ancestor, child, child.tag !== HostText ? {
      children: null
    } : null) : '';

    if (/\S/.test(childText)) {
      console.error('In HTML, text nodes cannot be a child of <%s>.\n' + 'This will cause a hydration error.%s', parentTag, ancestorDescription);
    } else {
      console.error('In HTML, whitespace text nodes cannot be a child of <%s>. ' + "Make sure you don't have any extra whitespace between tags on " + 'each line of your source code.\n' + 'This will cause a hydration error.%s', parentTag, ancestorDescription);
    }

    return false;
  }
}

const MATH_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

if (typeof MSApp !== 'undefined' && MSApp.execUnsafeLocalFunction) ;

function setTextContent(node, text) {
  if (text) {
    const firstChild = node.firstChild;

    if (firstChild && firstChild === node.lastChild && firstChild.nodeType === TEXT_NODE) {
      firstChild.nodeValue = text;
      return;
    }
  }

  node.textContent = text;
}

const shorthandToLonghand = {
  animation: ['animationDelay', 'animationDirection', 'animationDuration', 'animationFillMode', 'animationIterationCount', 'animationName', 'animationPlayState', 'animationTimingFunction'],
  background: ['backgroundAttachment', 'backgroundClip', 'backgroundColor', 'backgroundImage', 'backgroundOrigin', 'backgroundPositionX', 'backgroundPositionY', 'backgroundRepeat', 'backgroundSize'],
  backgroundPosition: ['backgroundPositionX', 'backgroundPositionY'],
  border: ['borderBottomColor', 'borderBottomStyle', 'borderBottomWidth', 'borderImageOutset', 'borderImageRepeat', 'borderImageSlice', 'borderImageSource', 'borderImageWidth', 'borderLeftColor', 'borderLeftStyle', 'borderLeftWidth', 'borderRightColor', 'borderRightStyle', 'borderRightWidth', 'borderTopColor', 'borderTopStyle', 'borderTopWidth'],
  borderBlockEnd: ['borderBlockEndColor', 'borderBlockEndStyle', 'borderBlockEndWidth'],
  borderBlockStart: ['borderBlockStartColor', 'borderBlockStartStyle', 'borderBlockStartWidth'],
  borderBottom: ['borderBottomColor', 'borderBottomStyle', 'borderBottomWidth'],
  borderColor: ['borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor'],
  borderImage: ['borderImageOutset', 'borderImageRepeat', 'borderImageSlice', 'borderImageSource', 'borderImageWidth'],
  borderInlineEnd: ['borderInlineEndColor', 'borderInlineEndStyle', 'borderInlineEndWidth'],
  borderInlineStart: ['borderInlineStartColor', 'borderInlineStartStyle', 'borderInlineStartWidth'],
  borderLeft: ['borderLeftColor', 'borderLeftStyle', 'borderLeftWidth'],
  borderRadius: ['borderBottomLeftRadius', 'borderBottomRightRadius', 'borderTopLeftRadius', 'borderTopRightRadius'],
  borderRight: ['borderRightColor', 'borderRightStyle', 'borderRightWidth'],
  borderStyle: ['borderBottomStyle', 'borderLeftStyle', 'borderRightStyle', 'borderTopStyle'],
  borderTop: ['borderTopColor', 'borderTopStyle', 'borderTopWidth'],
  borderWidth: ['borderBottomWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth'],
  columnRule: ['columnRuleColor', 'columnRuleStyle', 'columnRuleWidth'],
  columns: ['columnCount', 'columnWidth'],
  flex: ['flexBasis', 'flexGrow', 'flexShrink'],
  flexFlow: ['flexDirection', 'flexWrap'],
  font: ['fontFamily', 'fontFeatureSettings', 'fontKerning', 'fontLanguageOverride', 'fontSize', 'fontSizeAdjust', 'fontStretch', 'fontStyle', 'fontVariant', 'fontVariantAlternates', 'fontVariantCaps', 'fontVariantEastAsian', 'fontVariantLigatures', 'fontVariantNumeric', 'fontVariantPosition', 'fontWeight', 'lineHeight'],
  fontVariant: ['fontVariantAlternates', 'fontVariantCaps', 'fontVariantEastAsian', 'fontVariantLigatures', 'fontVariantNumeric', 'fontVariantPosition'],
  gap: ['columnGap', 'rowGap'],
  grid: ['gridAutoColumns', 'gridAutoFlow', 'gridAutoRows', 'gridTemplateAreas', 'gridTemplateColumns', 'gridTemplateRows'],
  gridArea: ['gridColumnEnd', 'gridColumnStart', 'gridRowEnd', 'gridRowStart'],
  gridColumn: ['gridColumnEnd', 'gridColumnStart'],
  gridColumnGap: ['columnGap'],
  gridGap: ['columnGap', 'rowGap'],
  gridRow: ['gridRowEnd', 'gridRowStart'],
  gridRowGap: ['rowGap'],
  gridTemplate: ['gridTemplateAreas', 'gridTemplateColumns', 'gridTemplateRows'],
  listStyle: ['listStyleImage', 'listStylePosition', 'listStyleType'],
  margin: ['marginBottom', 'marginLeft', 'marginRight', 'marginTop'],
  marker: ['markerEnd', 'markerMid', 'markerStart'],
  mask: ['maskClip', 'maskComposite', 'maskImage', 'maskMode', 'maskOrigin', 'maskPositionX', 'maskPositionY', 'maskRepeat', 'maskSize'],
  maskPosition: ['maskPositionX', 'maskPositionY'],
  outline: ['outlineColor', 'outlineStyle', 'outlineWidth'],
  overflow: ['overflowX', 'overflowY'],
  padding: ['paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop'],
  placeContent: ['alignContent', 'justifyContent'],
  placeItems: ['alignItems', 'justifyItems'],
  placeSelf: ['alignSelf', 'justifySelf'],
  textDecoration: ['textDecorationColor', 'textDecorationLine', 'textDecorationStyle'],
  textEmphasis: ['textEmphasisColor', 'textEmphasisStyle'],
  transition: ['transitionDelay', 'transitionDuration', 'transitionProperty', 'transitionTimingFunction'],
  wordWrap: ['overflowWrap']
};

const uppercasePattern = /([A-Z])/g;
const msPattern$1 = /^ms-/;
function hyphenateStyleName(name) {
  return name.replace(uppercasePattern, '-$1').toLowerCase().replace(msPattern$1, '-ms-');
}

const badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
const msPattern = /^-ms-/;
const hyphenPattern = /-(.)/g;
const badStyleValueWithSemicolonPattern = /;\s*$/;
const warnedStyleNames = {};
const warnedStyleValues = {};
let warnedForNaNValue = false;
let warnedForInfinityValue = false;

function camelize(string) {
  return string.replace(hyphenPattern, function (_, character) {
    return character.toUpperCase();
  });
}

function warnHyphenatedStyleName(name) {
  {
    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    console.error('Unsupported style property %s. Did you mean %s?', name, camelize(name.replace(msPattern, 'ms-')));
  }
}

function warnBadVendoredStyleName(name) {
  {
    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    console.error('Unsupported vendor-prefixed style property %s. Did you mean %s?', name, name.charAt(0).toUpperCase() + name.slice(1));
  }
}

function warnStyleValueWithSemicolon(name, value) {
  {
    if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
      return;
    }

    warnedStyleValues[value] = true;
    console.error("Style property values shouldn't contain a semicolon. " + 'Try "%s: %s" instead.', name, value.replace(badStyleValueWithSemicolonPattern, ''));
  }
}

function warnStyleValueIsNaN(name, value) {
  {
    if (warnedForNaNValue) {
      return;
    }

    warnedForNaNValue = true;
    console.error('`NaN` is an invalid value for the `%s` css style property.', name);
  }
}

function warnStyleValueIsInfinity(name, value) {
  {
    if (warnedForInfinityValue) {
      return;
    }

    warnedForInfinityValue = true;
    console.error('`Infinity` is an invalid value for the `%s` css style property.', name);
  }
}

function warnValidStyle(name, value) {
  {
    if (name.indexOf('-') > -1) {
      warnHyphenatedStyleName(name);
    } else if (badVendoredStyleNamePattern.test(name)) {
      warnBadVendoredStyleName(name);
    } else if (badStyleValueWithSemicolonPattern.test(value)) {
      warnStyleValueWithSemicolon(name, value);
    }

    if (typeof value === 'number') {
      if (isNaN(value)) {
        warnStyleValueIsNaN(name);
      } else if (!isFinite(value)) {
        warnStyleValueIsInfinity(name);
      }
    }
  }
}

const unitlessNumbers = new Set(['animationIterationCount', 'aspectRatio', 'borderImageOutset', 'borderImageSlice', 'borderImageWidth', 'boxFlex', 'boxFlexGroup', 'boxOrdinalGroup', 'columnCount', 'columns', 'flex', 'flexGrow', 'flexPositive', 'flexShrink', 'flexNegative', 'flexOrder', 'gridArea', 'gridRow', 'gridRowEnd', 'gridRowSpan', 'gridRowStart', 'gridColumn', 'gridColumnEnd', 'gridColumnSpan', 'gridColumnStart', 'fontWeight', 'lineClamp', 'lineHeight', 'opacity', 'order', 'orphans', 'scale', 'tabSize', 'widows', 'zIndex', 'zoom', 'fillOpacity', 'floodOpacity', 'stopOpacity', 'strokeDasharray', 'strokeDashoffset', 'strokeMiterlimit', 'strokeOpacity', 'strokeWidth', 'MozAnimationIterationCount', 'MozBoxFlex', 'MozBoxFlexGroup', 'MozLineClamp', 'msAnimationIterationCount', 'msFlex', 'msZoom', 'msFlexGrow', 'msFlexNegative', 'msFlexOrder', 'msFlexPositive', 'msFlexShrink', 'msGridColumn', 'msGridColumnSpan', 'msGridRow', 'msGridRowSpan', 'WebkitAnimationIterationCount', 'WebkitBoxFlex', 'WebKitBoxFlexGroup', 'WebkitBoxOrdinalGroup', 'WebkitColumnCount', 'WebkitColumns', 'WebkitFlex', 'WebkitFlexGrow', 'WebkitFlexPositive', 'WebkitFlexShrink', 'WebkitLineClamp']);
function isUnitlessNumber (name) {
  return unitlessNumbers.has(name);
}

function createDangerousStringForStyles(styles) {
  {
    let serialized = '';
    let delimiter = '';

    for (const styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }

      const value = styles[styleName];

      if (value != null && typeof value !== 'boolean' && value !== '') {
        const isCustomProperty = styleName.indexOf('--') === 0;

        if (isCustomProperty) {
          {
            checkCSSPropertyStringCoercion(value, styleName);
          }

          serialized += delimiter + styleName + ':' + ('' + value).trim();
        } else {
          if (typeof value === 'number' && value !== 0 && !isUnitlessNumber(styleName)) {
            serialized += delimiter + hyphenateStyleName(styleName) + ':' + value + 'px';
          } else {
            {
              checkCSSPropertyStringCoercion(value, styleName);
            }

            serialized += delimiter + hyphenateStyleName(styleName) + ':' + ('' + value).trim();
          }
        }

        delimiter = ';';
      }
    }

    return serialized || null;
  }
}

function setValueForStyle(style, styleName, value) {
  const isCustomProperty = styleName.indexOf('--') === 0;

  {
    if (!isCustomProperty) {
      warnValidStyle(styleName, value);
    }
  }

  if (value == null || typeof value === 'boolean' || value === '') {
    if (isCustomProperty) {
      style.setProperty(styleName, '');
    } else if (styleName === 'float') {
      style.cssFloat = '';
    } else {
      style[styleName] = '';
    }
  } else if (isCustomProperty) {
    style.setProperty(styleName, value);
  } else if (typeof value === 'number' && value !== 0 && !isUnitlessNumber(styleName)) {
    style[styleName] = value + 'px';
  } else {
    if (styleName === 'float') {
      style.cssFloat = value;
    } else {
      {
        checkCSSPropertyStringCoercion(value, styleName);
      }

      style[styleName] = ('' + value).trim();
    }
  }
}

function setValueForStyles(node, styles, prevStyles) {
  if (styles != null && typeof styles !== 'object') {
    throw new Error('The `style` prop expects a mapping from style properties to values, ' + "not a string. For example, style={{marginRight: spacing + 'em'}} when " + 'using JSX.');
  }

  {
    if (styles) {
      Object.freeze(styles);
    }
  }

  const style = node.style;

  if (prevStyles != null) {
    {
      validateShorthandPropertyCollisionInDev(prevStyles, styles);
    }

    for (const styleName in prevStyles) {
      if (prevStyles.hasOwnProperty(styleName) && (styles == null || !styles.hasOwnProperty(styleName))) {
        const isCustomProperty = styleName.indexOf('--') === 0;

        if (isCustomProperty) {
          style.setProperty(styleName, '');
        } else if (styleName === 'float') {
          style.cssFloat = '';
        } else {
          style[styleName] = '';
        }
      }
    }

    for (const styleName in styles) {
      const value = styles[styleName];

      if (styles.hasOwnProperty(styleName) && prevStyles[styleName] !== value) {
        setValueForStyle(style, styleName, value);
      }
    }
  } else {
    for (const styleName in styles) {
      if (styles.hasOwnProperty(styleName)) {
        const value = styles[styleName];
        setValueForStyle(style, styleName, value);
      }
    }
  }
}

function isValueEmpty(value) {
  return value == null || typeof value === 'boolean' || value === '';
}

function expandShorthandMap(styles) {
  const expanded = {};

  for (const key in styles) {
    const longhands = shorthandToLonghand[key] || [key];

    for (let i = 0; i < longhands.length; i++) {
      expanded[longhands[i]] = key;
    }
  }

  return expanded;
}

function validateShorthandPropertyCollisionInDev(prevStyles, nextStyles) {
  {
    if (!nextStyles) {
      return;
    }

    const expandedUpdates = {};

    if (prevStyles) {
      for (const key in prevStyles) {
        if (prevStyles.hasOwnProperty(key) && !nextStyles.hasOwnProperty(key)) {
          const longhands = shorthandToLonghand[key] || [key];

          for (let i = 0; i < longhands.length; i++) {
            expandedUpdates[longhands[i]] = key;
          }
        }
      }
    }

    for (const key in nextStyles) {
      if (nextStyles.hasOwnProperty(key) && (!prevStyles || prevStyles[key] !== nextStyles[key])) {
        const longhands = shorthandToLonghand[key] || [key];

        for (let i = 0; i < longhands.length; i++) {
          expandedUpdates[longhands[i]] = key;
        }
      }
    }

    const expandedStyles = expandShorthandMap(nextStyles);
    const warnedAbout = {};

    for (const key in expandedUpdates) {
      const originalKey = expandedUpdates[key];
      const correctOriginalKey = expandedStyles[key];

      if (correctOriginalKey && originalKey !== correctOriginalKey) {
        const warningKey = originalKey + ',' + correctOriginalKey;

        if (warnedAbout[warningKey]) {
          continue;
        }

        warnedAbout[warningKey] = true;
        console.error('%s a style property during rerender (%s) when a ' + 'conflicting property is set (%s) can lead to styling bugs. To ' + "avoid this, don't mix shorthand and non-shorthand properties " + 'for the same value; instead, replace the shorthand with ' + 'separate values.', isValueEmpty(nextStyles[originalKey]) ? 'Removing' : 'Updating', originalKey, correctOriginalKey);
      }
    }
  }
}

function isCustomElement(tagName, props) {
  if (tagName.indexOf('-') === -1) {
    return false;
  }

  switch (tagName) {
    case 'annotation-xml':
    case 'color-profile':
    case 'font-face':
    case 'font-face-src':
    case 'font-face-uri':
    case 'font-face-format':
    case 'font-face-name':
    case 'missing-glyph':
      return false;

    default:
      return true;
  }
}

const aliases = new Map([['acceptCharset', 'accept-charset'], ['htmlFor', 'for'], ['httpEquiv', 'http-equiv'], ['crossOrigin', 'crossorigin'], ['accentHeight', 'accent-height'], ['alignmentBaseline', 'alignment-baseline'], ['arabicForm', 'arabic-form'], ['baselineShift', 'baseline-shift'], ['capHeight', 'cap-height'], ['clipPath', 'clip-path'], ['clipRule', 'clip-rule'], ['colorInterpolation', 'color-interpolation'], ['colorInterpolationFilters', 'color-interpolation-filters'], ['colorProfile', 'color-profile'], ['colorRendering', 'color-rendering'], ['dominantBaseline', 'dominant-baseline'], ['enableBackground', 'enable-background'], ['fillOpacity', 'fill-opacity'], ['fillRule', 'fill-rule'], ['floodColor', 'flood-color'], ['floodOpacity', 'flood-opacity'], ['fontFamily', 'font-family'], ['fontSize', 'font-size'], ['fontSizeAdjust', 'font-size-adjust'], ['fontStretch', 'font-stretch'], ['fontStyle', 'font-style'], ['fontVariant', 'font-variant'], ['fontWeight', 'font-weight'], ['glyphName', 'glyph-name'], ['glyphOrientationHorizontal', 'glyph-orientation-horizontal'], ['glyphOrientationVertical', 'glyph-orientation-vertical'], ['horizAdvX', 'horiz-adv-x'], ['horizOriginX', 'horiz-origin-x'], ['imageRendering', 'image-rendering'], ['letterSpacing', 'letter-spacing'], ['lightingColor', 'lighting-color'], ['markerEnd', 'marker-end'], ['markerMid', 'marker-mid'], ['markerStart', 'marker-start'], ['overlinePosition', 'overline-position'], ['overlineThickness', 'overline-thickness'], ['paintOrder', 'paint-order'], ['panose-1', 'panose-1'], ['pointerEvents', 'pointer-events'], ['renderingIntent', 'rendering-intent'], ['shapeRendering', 'shape-rendering'], ['stopColor', 'stop-color'], ['stopOpacity', 'stop-opacity'], ['strikethroughPosition', 'strikethrough-position'], ['strikethroughThickness', 'strikethrough-thickness'], ['strokeDasharray', 'stroke-dasharray'], ['strokeDashoffset', 'stroke-dashoffset'], ['strokeLinecap', 'stroke-linecap'], ['strokeLinejoin', 'stroke-linejoin'], ['strokeMiterlimit', 'stroke-miterlimit'], ['strokeOpacity', 'stroke-opacity'], ['strokeWidth', 'stroke-width'], ['textAnchor', 'text-anchor'], ['textDecoration', 'text-decoration'], ['textRendering', 'text-rendering'], ['transformOrigin', 'transform-origin'], ['underlinePosition', 'underline-position'], ['underlineThickness', 'underline-thickness'], ['unicodeBidi', 'unicode-bidi'], ['unicodeRange', 'unicode-range'], ['unitsPerEm', 'units-per-em'], ['vAlphabetic', 'v-alphabetic'], ['vHanging', 'v-hanging'], ['vIdeographic', 'v-ideographic'], ['vMathematical', 'v-mathematical'], ['vectorEffect', 'vector-effect'], ['vertAdvY', 'vert-adv-y'], ['vertOriginX', 'vert-origin-x'], ['vertOriginY', 'vert-origin-y'], ['wordSpacing', 'word-spacing'], ['writingMode', 'writing-mode'], ['xmlnsXlink', 'xmlns:xlink'], ['xHeight', 'x-height']]);
function getAttributeAlias (name) {
  return aliases.get(name) || name;
}

const possibleStandardNames = {
  accept: 'accept',
  acceptcharset: 'acceptCharset',
  'accept-charset': 'acceptCharset',
  accesskey: 'accessKey',
  action: 'action',
  allowfullscreen: 'allowFullScreen',
  alt: 'alt',
  as: 'as',
  async: 'async',
  autocapitalize: 'autoCapitalize',
  autocomplete: 'autoComplete',
  autocorrect: 'autoCorrect',
  autofocus: 'autoFocus',
  autoplay: 'autoPlay',
  autosave: 'autoSave',
  capture: 'capture',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  challenge: 'challenge',
  charset: 'charSet',
  checked: 'checked',
  children: 'children',
  cite: 'cite',
  class: 'className',
  classid: 'classID',
  classname: 'className',
  cols: 'cols',
  colspan: 'colSpan',
  content: 'content',
  contenteditable: 'contentEditable',
  contextmenu: 'contextMenu',
  controls: 'controls',
  controlslist: 'controlsList',
  coords: 'coords',
  crossorigin: 'crossOrigin',
  dangerouslysetinnerhtml: 'dangerouslySetInnerHTML',
  data: 'data',
  datetime: 'dateTime',
  default: 'default',
  defaultchecked: 'defaultChecked',
  defaultvalue: 'defaultValue',
  defer: 'defer',
  dir: 'dir',
  disabled: 'disabled',
  disablepictureinpicture: 'disablePictureInPicture',
  disableremoteplayback: 'disableRemotePlayback',
  download: 'download',
  draggable: 'draggable',
  enctype: 'encType',
  enterkeyhint: 'enterKeyHint',
  fetchpriority: 'fetchPriority',
  for: 'htmlFor',
  form: 'form',
  formmethod: 'formMethod',
  formaction: 'formAction',
  formenctype: 'formEncType',
  formnovalidate: 'formNoValidate',
  formtarget: 'formTarget',
  frameborder: 'frameBorder',
  headers: 'headers',
  height: 'height',
  hidden: 'hidden',
  high: 'high',
  href: 'href',
  hreflang: 'hrefLang',
  htmlfor: 'htmlFor',
  httpequiv: 'httpEquiv',
  'http-equiv': 'httpEquiv',
  icon: 'icon',
  id: 'id',
  imagesizes: 'imageSizes',
  imagesrcset: 'imageSrcSet',
  inert: 'inert',
  innerhtml: 'innerHTML',
  inputmode: 'inputMode',
  integrity: 'integrity',
  is: 'is',
  itemid: 'itemID',
  itemprop: 'itemProp',
  itemref: 'itemRef',
  itemscope: 'itemScope',
  itemtype: 'itemType',
  keyparams: 'keyParams',
  keytype: 'keyType',
  kind: 'kind',
  label: 'label',
  lang: 'lang',
  list: 'list',
  loop: 'loop',
  low: 'low',
  manifest: 'manifest',
  marginwidth: 'marginWidth',
  marginheight: 'marginHeight',
  max: 'max',
  maxlength: 'maxLength',
  media: 'media',
  mediagroup: 'mediaGroup',
  method: 'method',
  min: 'min',
  minlength: 'minLength',
  multiple: 'multiple',
  muted: 'muted',
  name: 'name',
  nomodule: 'noModule',
  nonce: 'nonce',
  novalidate: 'noValidate',
  open: 'open',
  optimum: 'optimum',
  pattern: 'pattern',
  placeholder: 'placeholder',
  playsinline: 'playsInline',
  poster: 'poster',
  preload: 'preload',
  profile: 'profile',
  radiogroup: 'radioGroup',
  readonly: 'readOnly',
  referrerpolicy: 'referrerPolicy',
  rel: 'rel',
  required: 'required',
  reversed: 'reversed',
  role: 'role',
  rows: 'rows',
  rowspan: 'rowSpan',
  sandbox: 'sandbox',
  scope: 'scope',
  scoped: 'scoped',
  scrolling: 'scrolling',
  seamless: 'seamless',
  selected: 'selected',
  shape: 'shape',
  size: 'size',
  sizes: 'sizes',
  span: 'span',
  spellcheck: 'spellCheck',
  src: 'src',
  srcdoc: 'srcDoc',
  srclang: 'srcLang',
  srcset: 'srcSet',
  start: 'start',
  step: 'step',
  style: 'style',
  summary: 'summary',
  tabindex: 'tabIndex',
  target: 'target',
  title: 'title',
  type: 'type',
  usemap: 'useMap',
  value: 'value',
  width: 'width',
  wmode: 'wmode',
  wrap: 'wrap',
  about: 'about',
  accentheight: 'accentHeight',
  'accent-height': 'accentHeight',
  accumulate: 'accumulate',
  additive: 'additive',
  alignmentbaseline: 'alignmentBaseline',
  'alignment-baseline': 'alignmentBaseline',
  allowreorder: 'allowReorder',
  alphabetic: 'alphabetic',
  amplitude: 'amplitude',
  arabicform: 'arabicForm',
  'arabic-form': 'arabicForm',
  ascent: 'ascent',
  attributename: 'attributeName',
  attributetype: 'attributeType',
  autoreverse: 'autoReverse',
  azimuth: 'azimuth',
  basefrequency: 'baseFrequency',
  baselineshift: 'baselineShift',
  'baseline-shift': 'baselineShift',
  baseprofile: 'baseProfile',
  bbox: 'bbox',
  begin: 'begin',
  bias: 'bias',
  by: 'by',
  calcmode: 'calcMode',
  capheight: 'capHeight',
  'cap-height': 'capHeight',
  clip: 'clip',
  clippath: 'clipPath',
  'clip-path': 'clipPath',
  clippathunits: 'clipPathUnits',
  cliprule: 'clipRule',
  'clip-rule': 'clipRule',
  color: 'color',
  colorinterpolation: 'colorInterpolation',
  'color-interpolation': 'colorInterpolation',
  colorinterpolationfilters: 'colorInterpolationFilters',
  'color-interpolation-filters': 'colorInterpolationFilters',
  colorprofile: 'colorProfile',
  'color-profile': 'colorProfile',
  colorrendering: 'colorRendering',
  'color-rendering': 'colorRendering',
  contentscripttype: 'contentScriptType',
  contentstyletype: 'contentStyleType',
  cursor: 'cursor',
  cx: 'cx',
  cy: 'cy',
  d: 'd',
  datatype: 'datatype',
  decelerate: 'decelerate',
  descent: 'descent',
  diffuseconstant: 'diffuseConstant',
  direction: 'direction',
  display: 'display',
  divisor: 'divisor',
  dominantbaseline: 'dominantBaseline',
  'dominant-baseline': 'dominantBaseline',
  dur: 'dur',
  dx: 'dx',
  dy: 'dy',
  edgemode: 'edgeMode',
  elevation: 'elevation',
  enablebackground: 'enableBackground',
  'enable-background': 'enableBackground',
  end: 'end',
  exponent: 'exponent',
  externalresourcesrequired: 'externalResourcesRequired',
  fill: 'fill',
  fillopacity: 'fillOpacity',
  'fill-opacity': 'fillOpacity',
  fillrule: 'fillRule',
  'fill-rule': 'fillRule',
  filter: 'filter',
  filterres: 'filterRes',
  filterunits: 'filterUnits',
  floodopacity: 'floodOpacity',
  'flood-opacity': 'floodOpacity',
  floodcolor: 'floodColor',
  'flood-color': 'floodColor',
  focusable: 'focusable',
  fontfamily: 'fontFamily',
  'font-family': 'fontFamily',
  fontsize: 'fontSize',
  'font-size': 'fontSize',
  fontsizeadjust: 'fontSizeAdjust',
  'font-size-adjust': 'fontSizeAdjust',
  fontstretch: 'fontStretch',
  'font-stretch': 'fontStretch',
  fontstyle: 'fontStyle',
  'font-style': 'fontStyle',
  fontvariant: 'fontVariant',
  'font-variant': 'fontVariant',
  fontweight: 'fontWeight',
  'font-weight': 'fontWeight',
  format: 'format',
  from: 'from',
  fx: 'fx',
  fy: 'fy',
  g1: 'g1',
  g2: 'g2',
  glyphname: 'glyphName',
  'glyph-name': 'glyphName',
  glyphorientationhorizontal: 'glyphOrientationHorizontal',
  'glyph-orientation-horizontal': 'glyphOrientationHorizontal',
  glyphorientationvertical: 'glyphOrientationVertical',
  'glyph-orientation-vertical': 'glyphOrientationVertical',
  glyphref: 'glyphRef',
  gradienttransform: 'gradientTransform',
  gradientunits: 'gradientUnits',
  hanging: 'hanging',
  horizadvx: 'horizAdvX',
  'horiz-adv-x': 'horizAdvX',
  horizoriginx: 'horizOriginX',
  'horiz-origin-x': 'horizOriginX',
  ideographic: 'ideographic',
  imagerendering: 'imageRendering',
  'image-rendering': 'imageRendering',
  in2: 'in2',
  in: 'in',
  inlist: 'inlist',
  intercept: 'intercept',
  k1: 'k1',
  k2: 'k2',
  k3: 'k3',
  k4: 'k4',
  k: 'k',
  kernelmatrix: 'kernelMatrix',
  kernelunitlength: 'kernelUnitLength',
  kerning: 'kerning',
  keypoints: 'keyPoints',
  keysplines: 'keySplines',
  keytimes: 'keyTimes',
  lengthadjust: 'lengthAdjust',
  letterspacing: 'letterSpacing',
  'letter-spacing': 'letterSpacing',
  lightingcolor: 'lightingColor',
  'lighting-color': 'lightingColor',
  limitingconeangle: 'limitingConeAngle',
  local: 'local',
  markerend: 'markerEnd',
  'marker-end': 'markerEnd',
  markerheight: 'markerHeight',
  markermid: 'markerMid',
  'marker-mid': 'markerMid',
  markerstart: 'markerStart',
  'marker-start': 'markerStart',
  markerunits: 'markerUnits',
  markerwidth: 'markerWidth',
  mask: 'mask',
  maskcontentunits: 'maskContentUnits',
  maskunits: 'maskUnits',
  mathematical: 'mathematical',
  mode: 'mode',
  numoctaves: 'numOctaves',
  offset: 'offset',
  opacity: 'opacity',
  operator: 'operator',
  order: 'order',
  orient: 'orient',
  orientation: 'orientation',
  origin: 'origin',
  overflow: 'overflow',
  overlineposition: 'overlinePosition',
  'overline-position': 'overlinePosition',
  overlinethickness: 'overlineThickness',
  'overline-thickness': 'overlineThickness',
  paintorder: 'paintOrder',
  'paint-order': 'paintOrder',
  panose1: 'panose1',
  'panose-1': 'panose1',
  pathlength: 'pathLength',
  patterncontentunits: 'patternContentUnits',
  patterntransform: 'patternTransform',
  patternunits: 'patternUnits',
  pointerevents: 'pointerEvents',
  'pointer-events': 'pointerEvents',
  points: 'points',
  pointsatx: 'pointsAtX',
  pointsaty: 'pointsAtY',
  pointsatz: 'pointsAtZ',
  popover: 'popover',
  popovertarget: 'popoverTarget',
  popovertargetaction: 'popoverTargetAction',
  prefix: 'prefix',
  preservealpha: 'preserveAlpha',
  preserveaspectratio: 'preserveAspectRatio',
  primitiveunits: 'primitiveUnits',
  property: 'property',
  r: 'r',
  radius: 'radius',
  refx: 'refX',
  refy: 'refY',
  renderingintent: 'renderingIntent',
  'rendering-intent': 'renderingIntent',
  repeatcount: 'repeatCount',
  repeatdur: 'repeatDur',
  requiredextensions: 'requiredExtensions',
  requiredfeatures: 'requiredFeatures',
  resource: 'resource',
  restart: 'restart',
  result: 'result',
  results: 'results',
  rotate: 'rotate',
  rx: 'rx',
  ry: 'ry',
  scale: 'scale',
  security: 'security',
  seed: 'seed',
  shaperendering: 'shapeRendering',
  'shape-rendering': 'shapeRendering',
  slope: 'slope',
  spacing: 'spacing',
  specularconstant: 'specularConstant',
  specularexponent: 'specularExponent',
  speed: 'speed',
  spreadmethod: 'spreadMethod',
  startoffset: 'startOffset',
  stddeviation: 'stdDeviation',
  stemh: 'stemh',
  stemv: 'stemv',
  stitchtiles: 'stitchTiles',
  stopcolor: 'stopColor',
  'stop-color': 'stopColor',
  stopopacity: 'stopOpacity',
  'stop-opacity': 'stopOpacity',
  strikethroughposition: 'strikethroughPosition',
  'strikethrough-position': 'strikethroughPosition',
  strikethroughthickness: 'strikethroughThickness',
  'strikethrough-thickness': 'strikethroughThickness',
  string: 'string',
  stroke: 'stroke',
  strokedasharray: 'strokeDasharray',
  'stroke-dasharray': 'strokeDasharray',
  strokedashoffset: 'strokeDashoffset',
  'stroke-dashoffset': 'strokeDashoffset',
  strokelinecap: 'strokeLinecap',
  'stroke-linecap': 'strokeLinecap',
  strokelinejoin: 'strokeLinejoin',
  'stroke-linejoin': 'strokeLinejoin',
  strokemiterlimit: 'strokeMiterlimit',
  'stroke-miterlimit': 'strokeMiterlimit',
  strokewidth: 'strokeWidth',
  'stroke-width': 'strokeWidth',
  strokeopacity: 'strokeOpacity',
  'stroke-opacity': 'strokeOpacity',
  suppresscontenteditablewarning: 'suppressContentEditableWarning',
  suppresshydrationwarning: 'suppressHydrationWarning',
  surfacescale: 'surfaceScale',
  systemlanguage: 'systemLanguage',
  tablevalues: 'tableValues',
  targetx: 'targetX',
  targety: 'targetY',
  textanchor: 'textAnchor',
  'text-anchor': 'textAnchor',
  textdecoration: 'textDecoration',
  'text-decoration': 'textDecoration',
  textlength: 'textLength',
  textrendering: 'textRendering',
  'text-rendering': 'textRendering',
  to: 'to',
  transform: 'transform',
  transformorigin: 'transformOrigin',
  'transform-origin': 'transformOrigin',
  typeof: 'typeof',
  u1: 'u1',
  u2: 'u2',
  underlineposition: 'underlinePosition',
  'underline-position': 'underlinePosition',
  underlinethickness: 'underlineThickness',
  'underline-thickness': 'underlineThickness',
  unicode: 'unicode',
  unicodebidi: 'unicodeBidi',
  'unicode-bidi': 'unicodeBidi',
  unicoderange: 'unicodeRange',
  'unicode-range': 'unicodeRange',
  unitsperem: 'unitsPerEm',
  'units-per-em': 'unitsPerEm',
  unselectable: 'unselectable',
  valphabetic: 'vAlphabetic',
  'v-alphabetic': 'vAlphabetic',
  values: 'values',
  vectoreffect: 'vectorEffect',
  'vector-effect': 'vectorEffect',
  version: 'version',
  vertadvy: 'vertAdvY',
  'vert-adv-y': 'vertAdvY',
  vertoriginx: 'vertOriginX',
  'vert-origin-x': 'vertOriginX',
  vertoriginy: 'vertOriginY',
  'vert-origin-y': 'vertOriginY',
  vhanging: 'vHanging',
  'v-hanging': 'vHanging',
  videographic: 'vIdeographic',
  'v-ideographic': 'vIdeographic',
  viewbox: 'viewBox',
  viewtarget: 'viewTarget',
  visibility: 'visibility',
  vmathematical: 'vMathematical',
  'v-mathematical': 'vMathematical',
  vocab: 'vocab',
  widths: 'widths',
  wordspacing: 'wordSpacing',
  'word-spacing': 'wordSpacing',
  writingmode: 'writingMode',
  'writing-mode': 'writingMode',
  x1: 'x1',
  x2: 'x2',
  x: 'x',
  xchannelselector: 'xChannelSelector',
  xheight: 'xHeight',
  'x-height': 'xHeight',
  xlinkactuate: 'xlinkActuate',
  'xlink:actuate': 'xlinkActuate',
  xlinkarcrole: 'xlinkArcrole',
  'xlink:arcrole': 'xlinkArcrole',
  xlinkhref: 'xlinkHref',
  'xlink:href': 'xlinkHref',
  xlinkrole: 'xlinkRole',
  'xlink:role': 'xlinkRole',
  xlinkshow: 'xlinkShow',
  'xlink:show': 'xlinkShow',
  xlinktitle: 'xlinkTitle',
  'xlink:title': 'xlinkTitle',
  xlinktype: 'xlinkType',
  'xlink:type': 'xlinkType',
  xmlbase: 'xmlBase',
  'xml:base': 'xmlBase',
  xmllang: 'xmlLang',
  'xml:lang': 'xmlLang',
  xmlns: 'xmlns',
  'xml:space': 'xmlSpace',
  xmlnsxlink: 'xmlnsXlink',
  'xmlns:xlink': 'xmlnsXlink',
  xmlspace: 'xmlSpace',
  y1: 'y1',
  y2: 'y2',
  y: 'y',
  ychannelselector: 'yChannelSelector',
  z: 'z',
  zoomandpan: 'zoomAndPan'
};

const ariaProperties = {
  'aria-current': 0,
  'aria-description': 0,
  'aria-details': 0,
  'aria-disabled': 0,
  'aria-hidden': 0,
  'aria-invalid': 0,
  'aria-keyshortcuts': 0,
  'aria-label': 0,
  'aria-roledescription': 0,
  'aria-autocomplete': 0,
  'aria-checked': 0,
  'aria-expanded': 0,
  'aria-haspopup': 0,
  'aria-level': 0,
  'aria-modal': 0,
  'aria-multiline': 0,
  'aria-multiselectable': 0,
  'aria-orientation': 0,
  'aria-placeholder': 0,
  'aria-pressed': 0,
  'aria-readonly': 0,
  'aria-required': 0,
  'aria-selected': 0,
  'aria-sort': 0,
  'aria-valuemax': 0,
  'aria-valuemin': 0,
  'aria-valuenow': 0,
  'aria-valuetext': 0,
  'aria-atomic': 0,
  'aria-busy': 0,
  'aria-live': 0,
  'aria-relevant': 0,
  'aria-dropeffect': 0,
  'aria-grabbed': 0,
  'aria-activedescendant': 0,
  'aria-colcount': 0,
  'aria-colindex': 0,
  'aria-colspan': 0,
  'aria-controls': 0,
  'aria-describedby': 0,
  'aria-errormessage': 0,
  'aria-flowto': 0,
  'aria-labelledby': 0,
  'aria-owns': 0,
  'aria-posinset': 0,
  'aria-rowcount': 0,
  'aria-rowindex': 0,
  'aria-rowspan': 0,
  'aria-setsize': 0
};

const warnedProperties$1 = {};
const rARIA$1 = new RegExp('^(aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$');
const rARIACamel$1 = new RegExp('^(aria)[A-Z][' + ATTRIBUTE_NAME_CHAR + ']*$');

function validateProperty$1(tagName, name) {
  {
    if (hasOwnProperty.call(warnedProperties$1, name) && warnedProperties$1[name]) {
      return true;
    }

    if (rARIACamel$1.test(name)) {
      const ariaName = 'aria-' + name.slice(4).toLowerCase();
      const correctName = ariaProperties.hasOwnProperty(ariaName) ? ariaName : null;

      if (correctName == null) {
        console.error('Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.', name);
        warnedProperties$1[name] = true;
        return true;
      }

      if (name !== correctName) {
        console.error('Invalid ARIA attribute `%s`. Did you mean `%s`?', name, correctName);
        warnedProperties$1[name] = true;
        return true;
      }
    }

    if (rARIA$1.test(name)) {
      const lowerCasedName = name.toLowerCase();
      const standardName = ariaProperties.hasOwnProperty(lowerCasedName) ? lowerCasedName : null;

      if (standardName == null) {
        warnedProperties$1[name] = true;
        return false;
      }

      if (name !== standardName) {
        console.error('Unknown ARIA attribute `%s`. Did you mean `%s`?', name, standardName);
        warnedProperties$1[name] = true;
        return true;
      }
    }
  }

  return true;
}

function validateProperties$2(type, props) {
  {
    const invalidProps = [];

    for (const key in props) {
      const isValid = validateProperty$1(type, key);

      if (!isValid) {
        invalidProps.push(key);
      }
    }

    const unknownPropString = invalidProps.map(prop => '`' + prop + '`').join(', ');

    if (invalidProps.length === 1) {
      console.error('Invalid aria prop %s on <%s> tag. ' + 'For details, see https://react.dev/link/invalid-aria-props', unknownPropString, type);
    } else if (invalidProps.length > 1) {
      console.error('Invalid aria props %s on <%s> tag. ' + 'For details, see https://react.dev/link/invalid-aria-props', unknownPropString, type);
    }
  }
}

let didWarnValueNull = false;
function validateProperties$1(type, props) {
  {
    if (type !== 'input' && type !== 'textarea' && type !== 'select') {
      return;
    }

    if (props != null && props.value === null && !didWarnValueNull) {
      didWarnValueNull = true;

      if (type === 'select' && props.multiple) {
        console.error('`value` prop on `%s` should not be null. ' + 'Consider using an empty array when `multiple` is set to `true` ' + 'to clear the component or `undefined` for uncontrolled components.', type);
      } else {
        console.error('`value` prop on `%s` should not be null. ' + 'Consider using an empty string to clear the component or `undefined` ' + 'for uncontrolled components.', type);
      }
    }
  }
}

const warnedProperties = {};
const EVENT_NAME_REGEX = /^on./;
const INVALID_EVENT_NAME_REGEX = /^on[^A-Z]/;
const rARIA = new RegExp('^(aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$') ;
const rARIACamel = new RegExp('^(aria)[A-Z][' + ATTRIBUTE_NAME_CHAR + ']*$') ;

function validateProperty(tagName, name, value, eventRegistry) {
  {
    if (hasOwnProperty.call(warnedProperties, name) && warnedProperties[name]) {
      return true;
    }

    const lowerCasedName = name.toLowerCase();

    if (lowerCasedName === 'onfocusin' || lowerCasedName === 'onfocusout') {
      console.error('React uses onFocus and onBlur instead of onFocusIn and onFocusOut. ' + 'All React events are normalized to bubble, so onFocusIn and onFocusOut ' + 'are not needed/supported by React.');
      warnedProperties[name] = true;
      return true;
    }

    if (typeof value === 'function') {
      if (tagName === 'form' && name === 'action') {
        return true;
      }

      if (tagName === 'input' && name === 'formAction') {
        return true;
      }

      if (tagName === 'button' && name === 'formAction') {
        return true;
      }
    }

    if (eventRegistry != null) {
      const {
        registrationNameDependencies,
        possibleRegistrationNames
      } = eventRegistry;

      if (registrationNameDependencies.hasOwnProperty(name)) {
        return true;
      }

      const registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;

      if (registrationName != null) {
        console.error('Invalid event handler property `%s`. Did you mean `%s`?', name, registrationName);
        warnedProperties[name] = true;
        return true;
      }

      if (EVENT_NAME_REGEX.test(name)) {
        console.error('Unknown event handler property `%s`. It will be ignored.', name);
        warnedProperties[name] = true;
        return true;
      }
    } else if (EVENT_NAME_REGEX.test(name)) {
      if (INVALID_EVENT_NAME_REGEX.test(name)) {
        console.error('Invalid event handler property `%s`. ' + 'React events use the camelCase naming convention, for example `onClick`.', name);
      }

      warnedProperties[name] = true;
      return true;
    }

    if (rARIA.test(name) || rARIACamel.test(name)) {
      return true;
    }

    if (lowerCasedName === 'innerhtml') {
      console.error('Directly setting property `innerHTML` is not permitted. ' + 'For more information, lookup documentation on `dangerouslySetInnerHTML`.');
      warnedProperties[name] = true;
      return true;
    }

    if (lowerCasedName === 'aria') {
      console.error('The `aria` attribute is reserved for future use in React. ' + 'Pass individual `aria-` attributes instead.');
      warnedProperties[name] = true;
      return true;
    }

    if (lowerCasedName === 'is' && value !== null && value !== undefined && typeof value !== 'string') {
      console.error('Received a `%s` for a string attribute `is`. If this is expected, cast ' + 'the value to a string.', typeof value);
      warnedProperties[name] = true;
      return true;
    }

    if (typeof value === 'number' && isNaN(value)) {
      console.error('Received NaN for the `%s` attribute. If this is expected, cast ' + 'the value to a string.', name);
      warnedProperties[name] = true;
      return true;
    }

    if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
      const standardName = possibleStandardNames[lowerCasedName];

      if (standardName !== name) {
        console.error('Invalid DOM property `%s`. Did you mean `%s`?', name, standardName);
        warnedProperties[name] = true;
        return true;
      }
    } else if (name !== lowerCasedName) {
      console.error('React does not recognize the `%s` prop on a DOM element. If you ' + 'intentionally want it to appear in the DOM as a custom ' + 'attribute, spell it as lowercase `%s` instead. ' + 'If you accidentally passed it from a parent component, remove ' + 'it from the DOM element.', name, lowerCasedName);
      warnedProperties[name] = true;
      return true;
    }

    switch (name) {
      case 'dangerouslySetInnerHTML':
      case 'children':
      case 'style':
      case 'suppressContentEditableWarning':
      case 'suppressHydrationWarning':
      case 'defaultValue':
      case 'defaultChecked':
      case 'innerHTML':
      case 'ref':
        {
          return true;
        }

      case 'innerText':
      case 'textContent':
        return true;
    }

    switch (typeof value) {
      case 'boolean':
        {
          switch (name) {
            case 'autoFocus':
            case 'checked':
            case 'multiple':
            case 'muted':
            case 'selected':
            case 'contentEditable':
            case 'spellCheck':
            case 'draggable':
            case 'value':
            case 'autoReverse':
            case 'externalResourcesRequired':
            case 'focusable':
            case 'preserveAlpha':
            case 'allowFullScreen':
            case 'async':
            case 'autoPlay':
            case 'controls':
            case 'default':
            case 'defer':
            case 'disabled':
            case 'disablePictureInPicture':
            case 'disableRemotePlayback':
            case 'formNoValidate':
            case 'hidden':
            case 'loop':
            case 'noModule':
            case 'noValidate':
            case 'open':
            case 'playsInline':
            case 'readOnly':
            case 'required':
            case 'reversed':
            case 'scoped':
            case 'seamless':
            case 'itemScope':
            case 'capture':
            case 'download':
            case 'inert':
              {
                return true;
              }

            default:
              {
                const prefix = name.toLowerCase().slice(0, 5);

                if (prefix === 'data-' || prefix === 'aria-') {
                  return true;
                }

                if (value) {
                  console.error('Received `%s` for a non-boolean attribute `%s`.\n\n' + 'If you want to write it to the DOM, pass a string instead: ' + '%s="%s" or %s={value.toString()}.', value, name, name, value, name);
                } else {
                  console.error('Received `%s` for a non-boolean attribute `%s`.\n\n' + 'If you want to write it to the DOM, pass a string instead: ' + '%s="%s" or %s={value.toString()}.\n\n' + 'If you used to conditionally omit it with %s={condition && value}, ' + 'pass %s={condition ? value : undefined} instead.', value, name, name, value, name, name, name);
                }

                warnedProperties[name] = true;
                return true;
              }
          }
        }

      case 'function':
      case 'symbol':
        warnedProperties[name] = true;
        return false;

      case 'string':
        {
          if (value === 'false' || value === 'true') {
            switch (name) {
              case 'checked':
              case 'selected':
              case 'multiple':
              case 'muted':
              case 'allowFullScreen':
              case 'async':
              case 'autoPlay':
              case 'controls':
              case 'default':
              case 'defer':
              case 'disabled':
              case 'disablePictureInPicture':
              case 'disableRemotePlayback':
              case 'formNoValidate':
              case 'hidden':
              case 'loop':
              case 'noModule':
              case 'noValidate':
              case 'open':
              case 'playsInline':
              case 'readOnly':
              case 'required':
              case 'reversed':
              case 'scoped':
              case 'seamless':
              case 'itemScope':
              case 'inert':
                {
                  break;
                }

              default:
                {
                  return true;
                }
            }

            console.error('Received the string `%s` for the boolean attribute `%s`. ' + '%s ' + 'Did you mean %s={%s}?', value, name, value === 'false' ? 'The browser will interpret it as a truthy value.' : 'Although this works, it will not work as expected if you pass the string "false".', name, value);
            warnedProperties[name] = true;
            return true;
          }
        }
    }

    return true;
  }
}

function warnUnknownProperties(type, props, eventRegistry) {
  {
    const unknownProps = [];

    for (const key in props) {
      const isValid = validateProperty(type, key, props[key], eventRegistry);

      if (!isValid) {
        unknownProps.push(key);
      }
    }

    const unknownPropString = unknownProps.map(prop => '`' + prop + '`').join(', ');

    if (unknownProps.length === 1) {
      console.error('Invalid value for prop %s on <%s> tag. Either remove it from the element, ' + 'or pass a string or number value to keep it in the DOM. ' + 'For details, see https://react.dev/link/attribute-behavior ', unknownPropString, type);
    } else if (unknownProps.length > 1) {
      console.error('Invalid values for props %s on <%s> tag. Either remove them from the element, ' + 'or pass a string or number value to keep them in the DOM. ' + 'For details, see https://react.dev/link/attribute-behavior ', unknownPropString, type);
    }
  }
}

function validateProperties(type, props, eventRegistry) {
  if (isCustomElement(type) || typeof props.is === 'string') {
    return;
  }

  warnUnknownProperties(type, props, eventRegistry);
}

const isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i;

function sanitizeURL(url) {
  if (isJavaScriptProtocol.test('' + url)) {
    return "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')";
  }

  return url;
}

const IS_EVENT_HANDLE_NON_MANAGED_NODE = 1;
const IS_NON_DELEGATED = 1 << 1;
const IS_CAPTURE_PHASE = 1 << 2;
const SHOULD_NOT_PROCESS_POLYFILL_EVENT_PLUGINS = IS_EVENT_HANDLE_NON_MANAGED_NODE | IS_NON_DELEGATED | IS_CAPTURE_PHASE;

let currentReplayingEvent = null;
function setReplayingEvent(event) {
  {
    if (currentReplayingEvent !== null) {
      console.error('Expected currently replaying event to be null. This error ' + 'is likely caused by a bug in React. Please file an issue.');
    }
  }

  currentReplayingEvent = event;
}
function resetReplayingEvent() {
  {
    if (currentReplayingEvent === null) {
      console.error('Expected currently replaying event to not be null. This error ' + 'is likely caused by a bug in React. Please file an issue.');
    }
  }

  currentReplayingEvent = null;
}
function isReplayingEvent(event) {
  return event === currentReplayingEvent;
}

function getEventTarget(nativeEvent) {
  let target = nativeEvent.target || nativeEvent.srcElement || window;

  if (target.correspondingUseElement) {
    target = target.correspondingUseElement;
  }

  return target.nodeType === TEXT_NODE ? target.parentNode : target;
}

let restoreTarget = null;
let restoreQueue = null;

function restoreStateOfTarget(target) {
  const internalInstance = getInstanceFromNode(target);

  if (!internalInstance) {
    return;
  }

  const stateNode = internalInstance.stateNode;

  if (stateNode) {
    const props = getFiberCurrentPropsFromNode(stateNode);
    restoreControlledState(internalInstance.stateNode, internalInstance.type, props);
  }
}

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
function needsStateRestore() {
  return restoreTarget !== null || restoreQueue !== null;
}
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

let isInsideEventHandler = false;

function finishEventHandler() {
  const controlledComponentsHavePendingUpdates = needsStateRestore();

  if (controlledComponentsHavePendingUpdates) {
    flushSyncWork$1();
    restoreStateIfNeeded();
  }
}

function batchedUpdates$1(fn, a, b) {
  if (isInsideEventHandler) {
    return fn(a, b);
  }

  isInsideEventHandler = true;

  try {
    return batchedUpdates(fn, a, b);
  } finally {
    isInsideEventHandler = false;
    finishEventHandler();
  }
}

function isInteractive(tag) {
  return tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea';
}

function shouldPreventMouseEvent(name, type, props) {
  switch (name) {
    case 'onClick':
    case 'onClickCapture':
    case 'onDoubleClick':
    case 'onDoubleClickCapture':
    case 'onMouseDown':
    case 'onMouseDownCapture':
    case 'onMouseMove':
    case 'onMouseMoveCapture':
    case 'onMouseUp':
    case 'onMouseUpCapture':
    case 'onMouseEnter':
      return !!(props.disabled && isInteractive(type));

    default:
      return false;
  }
}

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

  if (listener && typeof listener !== 'function') {
    throw new Error(`Expected \`${registrationName}\` listener to be a function, instead got a value of \`${typeof listener}\` type.`);
  }

  return listener;
}

let passiveBrowserEventsSupported = false;

if (canUseDOM) {
  try {
    const options = {};
    Object.defineProperty(options, 'passive', {
      get: function () {
        passiveBrowserEventsSupported = true;
      }
    });
    window.addEventListener('test', options, options);
    window.removeEventListener('test', options, options);
  } catch (e) {
    passiveBrowserEventsSupported = false;
  }
}

function addEventBubbleListener(target, eventType, listener) {
  target.addEventListener(eventType, listener, false);
  return listener;
}
function addEventCaptureListener(target, eventType, listener) {
  target.addEventListener(eventType, listener, true);
  return listener;
}
function addEventCaptureListenerWithPassiveFlag(target, eventType, listener, passive) {
  target.addEventListener(eventType, listener, {
    capture: true,
    passive
  });
  return listener;
}
function addEventBubbleListenerWithPassiveFlag(target, eventType, listener, passive) {
  target.addEventListener(eventType, listener, {
    passive
  });
  return listener;
}

let root = null;
let startText = null;
let fallbackText = null;
function initialize(nativeEventTarget) {
  root = nativeEventTarget;
  startText = getText();
  return true;
}
function reset() {
  root = null;
  startText = null;
  fallbackText = null;
}
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

  const sliceTail = end > 1 ? 1 - end : undefined;
  fallbackText = endValue.slice(start, sliceTail);
  return fallbackText;
}
function getText() {
  if ('value' in root) {
    return root.value;
  }

  return root.textContent;
}

function getEventCharCode(nativeEvent) {
  let charCode;
  const keyCode = nativeEvent.keyCode;

  if ('charCode' in nativeEvent) {
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

function functionThatReturnsTrue() {
  return true;
}

function functionThatReturnsFalse() {
  return false;
}

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

  assign(SyntheticBaseEvent.prototype, {
    preventDefault: function () {
      this.defaultPrevented = true;
      const event = this.nativeEvent;

      if (!event) {
        return;
      }

      if (event.preventDefault) {
        event.preventDefault();
      } else if (typeof event.returnValue !== 'unknown') {
        event.returnValue = false;
      }

      this.isDefaultPrevented = functionThatReturnsTrue;
    },
    stopPropagation: function () {
      const event = this.nativeEvent;

      if (!event) {
        return;
      }

      if (event.stopPropagation) {
        event.stopPropagation();
      } else if (typeof event.cancelBubble !== 'unknown') {
        event.cancelBubble = true;
      }

      this.isPropagationStopped = functionThatReturnsTrue;
    },
    persist: function () {},
    isPersistent: functionThatReturnsTrue
  });
  return SyntheticBaseEvent;
}

const EventInterface = {
  eventPhase: 0,
  bubbles: 0,
  cancelable: 0,
  timeStamp: function (event) {
    return event.timeStamp || Date.now();
  },
  defaultPrevented: 0,
  isTrusted: 0
};
const SyntheticEvent = createSyntheticEvent(EventInterface);
const UIEventInterface = { ...EventInterface,
  view: 0,
  detail: 0
};
const SyntheticUIEvent = createSyntheticEvent(UIEventInterface);
let lastMovementX;
let lastMovementY;
let lastMouseEvent;

function updateMouseMovementPolyfillState(event) {
  if (event !== lastMouseEvent) {
    if (lastMouseEvent && event.type === 'mousemove') {
      lastMovementX = event.screenX - lastMouseEvent.screenX;
      lastMovementY = event.screenY - lastMouseEvent.screenY;
    } else {
      lastMovementX = 0;
      lastMovementY = 0;
    }

    lastMouseEvent = event;
  }
}

const MouseEventInterface = { ...UIEventInterface,
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
  relatedTarget: function (event) {
    if (event.relatedTarget === undefined) return event.fromElement === event.srcElement ? event.toElement : event.fromElement;
    return event.relatedTarget;
  },
  movementX: function (event) {
    if ('movementX' in event) {
      return event.movementX;
    }

    updateMouseMovementPolyfillState(event);
    return lastMovementX;
  },
  movementY: function (event) {
    if ('movementY' in event) {
      return event.movementY;
    }

    return lastMovementY;
  }
};
const SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface);
const DragEventInterface = { ...MouseEventInterface,
  dataTransfer: 0
};
const SyntheticDragEvent = createSyntheticEvent(DragEventInterface);
const FocusEventInterface = { ...UIEventInterface,
  relatedTarget: 0
};
const SyntheticFocusEvent = createSyntheticEvent(FocusEventInterface);
const AnimationEventInterface = { ...EventInterface,
  animationName: 0,
  elapsedTime: 0,
  pseudoElement: 0
};
const SyntheticAnimationEvent = createSyntheticEvent(AnimationEventInterface);
const ClipboardEventInterface = { ...EventInterface,
  clipboardData: function (event) {
    return 'clipboardData' in event ? event.clipboardData : window.clipboardData;
  }
};
const SyntheticClipboardEvent = createSyntheticEvent(ClipboardEventInterface);
const CompositionEventInterface = { ...EventInterface,
  data: 0
};
const SyntheticCompositionEvent = createSyntheticEvent(CompositionEventInterface);
const SyntheticInputEvent = SyntheticCompositionEvent;
const normalizeKey = {
  Esc: 'Escape',
  Spacebar: ' ',
  Left: 'ArrowLeft',
  Up: 'ArrowUp',
  Right: 'ArrowRight',
  Down: 'ArrowDown',
  Del: 'Delete',
  Win: 'OS',
  Menu: 'ContextMenu',
  Apps: 'ContextMenu',
  Scroll: 'ScrollLock',
  MozPrintableKey: 'Unidentified'
};
const translateToKey = {
  '8': 'Backspace',
  '9': 'Tab',
  '12': 'Clear',
  '13': 'Enter',
  '16': 'Shift',
  '17': 'Control',
  '18': 'Alt',
  '19': 'Pause',
  '20': 'CapsLock',
  '27': 'Escape',
  '32': ' ',
  '33': 'PageUp',
  '34': 'PageDown',
  '35': 'End',
  '36': 'Home',
  '37': 'ArrowLeft',
  '38': 'ArrowUp',
  '39': 'ArrowRight',
  '40': 'ArrowDown',
  '45': 'Insert',
  '46': 'Delete',
  '112': 'F1',
  '113': 'F2',
  '114': 'F3',
  '115': 'F4',
  '116': 'F5',
  '117': 'F6',
  '118': 'F7',
  '119': 'F8',
  '120': 'F9',
  '121': 'F10',
  '122': 'F11',
  '123': 'F12',
  '144': 'NumLock',
  '145': 'ScrollLock',
  '224': 'Meta'
};

function getEventKey(nativeEvent) {
  if (nativeEvent.key) {
    const key = normalizeKey[nativeEvent.key] || nativeEvent.key;

    if (key !== 'Unidentified') {
      return key;
    }
  }

  if (nativeEvent.type === 'keypress') {
    const charCode = getEventCharCode(nativeEvent);
    return charCode === 13 ? 'Enter' : String.fromCharCode(charCode);
  }

  if (nativeEvent.type === 'keydown' || nativeEvent.type === 'keyup') {
    return translateToKey[nativeEvent.keyCode] || 'Unidentified';
  }

  return '';
}

const modifierKeyToProp = {
  Alt: 'altKey',
  Control: 'ctrlKey',
  Meta: 'metaKey',
  Shift: 'shiftKey'
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

function getEventModifierState(nativeEvent) {
  return modifierStateGetter;
}

const KeyboardEventInterface = { ...UIEventInterface,
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
  charCode: function (event) {
    if (event.type === 'keypress') {
      return getEventCharCode(event);
    }

    return 0;
  },
  keyCode: function (event) {
    if (event.type === 'keydown' || event.type === 'keyup') {
      return event.keyCode;
    }

    return 0;
  },
  which: function (event) {
    if (event.type === 'keypress') {
      return getEventCharCode(event);
    }

    if (event.type === 'keydown' || event.type === 'keyup') {
      return event.keyCode;
    }

    return 0;
  }
};
const SyntheticKeyboardEvent = createSyntheticEvent(KeyboardEventInterface);
const PointerEventInterface = { ...MouseEventInterface,
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
};
const SyntheticPointerEvent = createSyntheticEvent(PointerEventInterface);
const TouchEventInterface = { ...UIEventInterface,
  touches: 0,
  targetTouches: 0,
  changedTouches: 0,
  altKey: 0,
  metaKey: 0,
  ctrlKey: 0,
  shiftKey: 0,
  getModifierState: getEventModifierState
};
const SyntheticTouchEvent = createSyntheticEvent(TouchEventInterface);
const TransitionEventInterface = { ...EventInterface,
  propertyName: 0,
  elapsedTime: 0,
  pseudoElement: 0
};
const SyntheticTransitionEvent = createSyntheticEvent(TransitionEventInterface);
const WheelEventInterface = { ...MouseEventInterface,

  deltaX(event) {
    return 'deltaX' in event ? event.deltaX : 'wheelDeltaX' in event ? -event.wheelDeltaX : 0;
  },

  deltaY(event) {
    return 'deltaY' in event ? event.deltaY : 'wheelDeltaY' in event ? -event.wheelDeltaY : 'wheelDelta' in event ? -event.wheelDelta : 0;
  },

  deltaZ: 0,
  deltaMode: 0
};
const SyntheticWheelEvent = createSyntheticEvent(WheelEventInterface);
const ToggleEventInterface = { ...EventInterface,
  newState: 0,
  oldState: 0
};
const SyntheticToggleEvent = createSyntheticEvent(ToggleEventInterface);

const END_KEYCODES = [9, 13, 27, 32];
const START_KEYCODE = 229;
const canUseCompositionEvent = canUseDOM && 'CompositionEvent' in window;
let documentMode = null;

if (canUseDOM && 'documentMode' in document) {
  documentMode = document.documentMode;
}

const canUseTextInputEvent = canUseDOM && 'TextEvent' in window && !documentMode;
const useFallbackCompositionData = canUseDOM && (!canUseCompositionEvent || documentMode && documentMode > 8 && documentMode <= 11);
const SPACEBAR_CODE = 32;
const SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE);

function registerEvents$3() {
  registerTwoPhaseEvent('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']);
  registerTwoPhaseEvent('onCompositionEnd', ['compositionend', 'focusout', 'keydown', 'keypress', 'keyup', 'mousedown']);
  registerTwoPhaseEvent('onCompositionStart', ['compositionstart', 'focusout', 'keydown', 'keypress', 'keyup', 'mousedown']);
  registerTwoPhaseEvent('onCompositionUpdate', ['compositionupdate', 'focusout', 'keydown', 'keypress', 'keyup', 'mousedown']);
}

let hasSpaceKeypress = false;

function isKeypressCommand(nativeEvent) {
  return (nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) && !(nativeEvent.ctrlKey && nativeEvent.altKey);
}

function getCompositionEventType(domEventName) {
  switch (domEventName) {
    case 'compositionstart':
      return 'onCompositionStart';

    case 'compositionend':
      return 'onCompositionEnd';

    case 'compositionupdate':
      return 'onCompositionUpdate';
  }
}

function isFallbackCompositionStart(domEventName, nativeEvent) {
  return domEventName === 'keydown' && nativeEvent.keyCode === START_KEYCODE;
}

function isFallbackCompositionEnd(domEventName, nativeEvent) {
  switch (domEventName) {
    case 'keyup':
      return END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1;

    case 'keydown':
      return nativeEvent.keyCode !== START_KEYCODE;

    case 'keypress':
    case 'mousedown':
    case 'focusout':
      return true;

    default:
      return false;
  }
}

function getDataFromCustomEvent(nativeEvent) {
  const detail = nativeEvent.detail;

  if (typeof detail === 'object' && 'data' in detail) {
    return detail.data;
  }

  return null;
}

function isUsingKoreanIME(nativeEvent) {
  return nativeEvent.locale === 'ko';
}

let isComposing = false;

function extractCompositionEvent(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget) {
  let eventType;
  let fallbackData;

  if (canUseCompositionEvent) {
    eventType = getCompositionEventType(domEventName);
  } else if (!isComposing) {
    if (isFallbackCompositionStart(domEventName, nativeEvent)) {
      eventType = 'onCompositionStart';
    }
  } else if (isFallbackCompositionEnd(domEventName, nativeEvent)) {
    eventType = 'onCompositionEnd';
  }

  if (!eventType) {
    return null;
  }

  if (useFallbackCompositionData && !isUsingKoreanIME(nativeEvent)) {
    if (!isComposing && eventType === 'onCompositionStart') {
      isComposing = initialize(nativeEventTarget);
    } else if (eventType === 'onCompositionEnd') {
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

function getNativeBeforeInputChars(domEventName, nativeEvent) {
  switch (domEventName) {
    case 'compositionend':
      return getDataFromCustomEvent(nativeEvent);

    case 'keypress':
      const which = nativeEvent.which;

      if (which !== SPACEBAR_CODE) {
        return null;
      }

      hasSpaceKeypress = true;
      return SPACEBAR_CHAR;

    case 'textInput':
      const chars = nativeEvent.data;

      if (chars === SPACEBAR_CHAR && hasSpaceKeypress) {
        return null;
      }

      return chars;

    default:
      return null;
  }
}

function getFallbackBeforeInputChars(domEventName, nativeEvent) {
  if (isComposing) {
    if (domEventName === 'compositionend' || !canUseCompositionEvent && isFallbackCompositionEnd(domEventName, nativeEvent)) {
      const chars = getData();
      reset();
      isComposing = false;
      return chars;
    }

    return null;
  }

  switch (domEventName) {
    case 'paste':
      return null;

    case 'keypress':
      if (!isKeypressCommand(nativeEvent)) {
        if (nativeEvent.char && nativeEvent.char.length > 1) {
          return nativeEvent.char;
        } else if (nativeEvent.which) {
          return String.fromCharCode(nativeEvent.which);
        }
      }

      return null;

    case 'compositionend':
      return useFallbackCompositionData && !isUsingKoreanIME(nativeEvent) ? null : nativeEvent.data;

    default:
      return null;
  }
}

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

  const listeners = accumulateTwoPhaseListeners(targetInst, 'onBeforeInput');

  if (listeners.length > 0) {
    const event = new SyntheticInputEvent('onBeforeInput', 'beforeinput', null, nativeEvent, nativeEventTarget);
    dispatchQueue.push({
      event,
      listeners
    });
    event.data = chars;
  }
}

function extractEvents$6(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
  extractCompositionEvent(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
  extractBeforeInputEvent(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
}

const supportedInputTypes = {
  color: true,
  date: true,
  datetime: true,
  'datetime-local': true,
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

  if (nodeName === 'input') {
    return !!supportedInputTypes[elem.type];
  }

  if (nodeName === 'textarea') {
    return true;
  }

  return false;
}

function isEventSupported(eventNameSuffix) {
  if (!canUseDOM) {
    return false;
  }

  const eventName = 'on' + eventNameSuffix;
  let isSupported = (eventName in document);

  if (!isSupported) {
    const element = document.createElement('div');
    element.setAttribute(eventName, 'return;');
    isSupported = typeof element[eventName] === 'function';
  }

  return isSupported;
}

function registerEvents$2() {
  registerTwoPhaseEvent('onChange', ['change', 'click', 'focusin', 'focusout', 'input', 'keydown', 'keyup', 'selectionchange']);
}

function createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, target) {
  enqueueStateRestore(target);
  const listeners = accumulateTwoPhaseListeners(inst, 'onChange');

  if (listeners.length > 0) {
    const event = new SyntheticEvent('onChange', 'change', null, nativeEvent, target);
    dispatchQueue.push({
      event,
      listeners
    });
  }
}

let activeElement$1 = null;
let activeElementInst$1 = null;

function shouldUseChangeEvent(elem) {
  const nodeName = elem.nodeName && elem.nodeName.toLowerCase();
  return nodeName === 'select' || nodeName === 'input' && elem.type === 'file';
}

function manualDispatchChangeEvent(nativeEvent) {
  const dispatchQueue = [];
  createAndAccumulateChangeEvent(dispatchQueue, activeElementInst$1, nativeEvent, getEventTarget(nativeEvent));
  batchedUpdates$1(runEventInBatch, dispatchQueue);
}

function runEventInBatch(dispatchQueue) {
  processDispatchQueue(dispatchQueue, 0);
}

function getInstIfValueChanged(targetInst) {
  const targetNode = getNodeFromInstance(targetInst);

  if (updateValueIfChanged(targetNode)) {
    return targetInst;
  }
}

function getTargetInstForChangeEvent(domEventName, targetInst) {
  if (domEventName === 'change') {
    return targetInst;
  }
}

let isInputEventSupported = false;

if (canUseDOM) {
  isInputEventSupported = isEventSupported('input') && (!document.documentMode || document.documentMode > 9);
}

function startWatchingForValueChange(target, targetInst) {
  activeElement$1 = target;
  activeElementInst$1 = targetInst;
  activeElement$1.attachEvent('onpropertychange', handlePropertyChange);
}

function stopWatchingForValueChange() {
  if (!activeElement$1) {
    return;
  }

  activeElement$1.detachEvent('onpropertychange', handlePropertyChange);
  activeElement$1 = null;
  activeElementInst$1 = null;
}

function handlePropertyChange(nativeEvent) {
  if (nativeEvent.propertyName !== 'value') {
    return;
  }

  if (getInstIfValueChanged(activeElementInst$1)) {
    manualDispatchChangeEvent(nativeEvent);
  }
}

function handleEventsForInputEventPolyfill(domEventName, target, targetInst) {
  if (domEventName === 'focusin') {
    stopWatchingForValueChange();
    startWatchingForValueChange(target, targetInst);
  } else if (domEventName === 'focusout') {
    stopWatchingForValueChange();
  }
}

function getTargetInstForInputEventPolyfill(domEventName, targetInst) {
  if (domEventName === 'selectionchange' || domEventName === 'keyup' || domEventName === 'keydown') {
    return getInstIfValueChanged(activeElementInst$1);
  }
}

function shouldUseClickEvent(elem) {
  const nodeName = elem.nodeName;
  return nodeName && nodeName.toLowerCase() === 'input' && (elem.type === 'checkbox' || elem.type === 'radio');
}

function getTargetInstForClickEvent(domEventName, targetInst) {
  if (domEventName === 'click') {
    return getInstIfValueChanged(targetInst);
  }
}

function getTargetInstForInputOrChangeEvent(domEventName, targetInst) {
  if (domEventName === 'input' || domEventName === 'change') {
    return getInstIfValueChanged(targetInst);
  }
}

function handleControlledInputBlur(node, props) {
  if (node.type !== 'number') {
    return;
  }

  {
    const isControlled = props.value != null;

    if (isControlled) {
      setDefaultValue(node, 'number', node.value);
    }
  }
}

function extractEvents$5(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
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
  } else if (targetInst && isCustomElement(targetInst.elementType)) {
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

  if (domEventName === 'focusout' && targetInst) {
    const props = targetInst.memoizedProps;
    handleControlledInputBlur(targetNode, props);
  }
}

function registerEvents$1() {
  registerDirectEvent('onMouseEnter', ['mouseout', 'mouseover']);
  registerDirectEvent('onMouseLeave', ['mouseout', 'mouseover']);
  registerDirectEvent('onPointerEnter', ['pointerout', 'pointerover']);
  registerDirectEvent('onPointerLeave', ['pointerout', 'pointerover']);
}

function extractEvents$4(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
  const isOverEvent = domEventName === 'mouseover' || domEventName === 'pointerover';
  const isOutEvent = domEventName === 'mouseout' || domEventName === 'pointerout';

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
      const tag = to.tag;

      if (to !== nearestMounted || tag !== HostComponent && tag !== HostSingleton && tag !== HostText) {
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
  let leaveEventType = 'onMouseLeave';
  let enterEventType = 'onMouseEnter';
  let eventTypePrefix = 'mouse';

  if (domEventName === 'pointerout' || domEventName === 'pointerover') {
    SyntheticEventCtor = SyntheticPointerEvent;
    leaveEventType = 'onPointerLeave';
    enterEventType = 'onPointerEnter';
    eventTypePrefix = 'pointer';
  }

  const fromNode = from == null ? win : getNodeFromInstance(from);
  const toNode = to == null ? win : getNodeFromInstance(to);
  const leave = new SyntheticEventCtor(leaveEventType, eventTypePrefix + 'leave', from, nativeEvent, nativeEventTarget);
  leave.target = fromNode;
  leave.relatedTarget = toNode;
  let enter = null;
  const nativeTargetInst = getClosestInstanceFromNode(nativeEventTarget);

  if (nativeTargetInst === targetInst) {
    const enterEvent = new SyntheticEventCtor(enterEventType, eventTypePrefix + 'enter', to, nativeEvent, nativeEventTarget);
    enterEvent.target = toNode;
    enterEvent.relatedTarget = fromNode;
    enter = enterEvent;
  }

  accumulateEnterLeaveTwoPhaseListeners(dispatchQueue, leave, enter, from, to);
}

function is(x, y) {
  return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
}

const objectIs = typeof Object.is === 'function' ? Object.is : is;

function shallowEqual(objA, objB) {
  if (objectIs(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
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

function getLeafNode(node) {
  while (node && node.firstChild) {
    node = node.firstChild;
  }

  return node;
}

function getSiblingNode(node) {
  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }

    node = node.parentNode;
  }
}

function getNodeForCharacterOffset(root, offset) {
  let node = getLeafNode(root);
  let nodeStart = 0;
  let nodeEnd = 0;

  while (node) {
    if (node.nodeType === TEXT_NODE) {
      nodeEnd = nodeStart + node.textContent.length;

      if (nodeStart <= offset && nodeEnd >= offset) {
        return {
          node: node,
          offset: offset - nodeStart
        };
      }

      nodeStart = nodeEnd;
    }

    node = getLeafNode(getSiblingNode(node));
  }
}

function getOffsets(outerNode) {
  const {
    ownerDocument
  } = outerNode;
  const win = ownerDocument && ownerDocument.defaultView || window;
  const selection = win.getSelection && win.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const {
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset
  } = selection;

  try {
    anchorNode.nodeType;
    focusNode.nodeType;
  } catch (e) {
    return null;
  }

  return getModernOffsetsFromPoints(outerNode, anchorNode, anchorOffset, focusNode, focusOffset);
}
function getModernOffsetsFromPoints(outerNode, anchorNode, anchorOffset, focusNode, focusOffset) {
  let length = 0;
  let start = -1;
  let end = -1;
  let indexWithinAnchor = 0;
  let indexWithinFocus = 0;
  let node = outerNode;
  let parentNode = null;

  outer: while (true) {
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
    start: start,
    end: end
  };
}
function setOffsets(node, offsets) {
  const doc = node.ownerDocument || document;
  const win = doc && doc.defaultView || window;

  if (!win.getSelection) {
    return;
  }

  const selection = win.getSelection();
  const length = node.textContent.length;
  let start = Math.min(offsets.start, length);
  let end = offsets.end === undefined ? start : Math.min(offsets.end, length);

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

function isTextNode(node) {
  return node && node.nodeType === TEXT_NODE;
}

function containsNode(outerNode, innerNode) {
  if (!outerNode || !innerNode) {
    return false;
  } else if (outerNode === innerNode) {
    return true;
  } else if (isTextNode(outerNode)) {
    return false;
  } else if (isTextNode(innerNode)) {
    return containsNode(outerNode, innerNode.parentNode);
  } else if ('contains' in outerNode) {
    return outerNode.contains(innerNode);
  } else if (outerNode.compareDocumentPosition) {
    return !!(outerNode.compareDocumentPosition(innerNode) & 16);
  } else {
    return false;
  }
}

function isInDocument(node) {
  return node && node.ownerDocument && containsNode(node.ownerDocument.documentElement, node);
}

function isSameOriginFrame(iframe) {
  try {
    return typeof iframe.contentWindow.location.href === 'string';
  } catch (err) {
    return false;
  }
}

function getActiveElementDeep(containerInfo) {
  let win = containerInfo != null && containerInfo.ownerDocument != null && containerInfo.ownerDocument.defaultView != null ? containerInfo.ownerDocument.defaultView : window;
  let element = getActiveElement(win.document);

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

function hasSelectionCapabilities(elem) {
  const nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
  return nodeName && (nodeName === 'input' && (elem.type === 'text' || elem.type === 'search' || elem.type === 'tel' || elem.type === 'url' || elem.type === 'password') || nodeName === 'textarea' || elem.contentEditable === 'true');
}
function getSelectionInformation(containerInfo) {
  const focusedElem = getActiveElementDeep(containerInfo);
  return {
    focusedElem: focusedElem,
    selectionRange: hasSelectionCapabilities(focusedElem) ? getSelection$1(focusedElem) : null
  };
}
function restoreSelection(priorSelectionInformation, containerInfo) {
  const curFocusedElem = getActiveElementDeep(containerInfo);
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

    if (typeof priorFocusedElem.focus === 'function') {
      priorFocusedElem.focus();
    }

    for (let i = 0; i < ancestors.length; i++) {
      const info = ancestors[i];
      info.element.scrollLeft = info.left;
      info.element.scrollTop = info.top;
    }
  }
}
function getSelection$1(input) {
  let selection;

  if ('selectionStart' in input) {
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
function setSelection(input, offsets) {
  const start = offsets.start;
  let end = offsets.end;

  if (end === undefined) {
    end = start;
  }

  if ('selectionStart' in input) {
    input.selectionStart = start;
    input.selectionEnd = Math.min(end, input.value.length);
  } else {
    setOffsets(input, offsets);
  }
}

const skipSelectionChangeEvent = canUseDOM && 'documentMode' in document && document.documentMode <= 11;

function registerEvents() {
  registerTwoPhaseEvent('onSelect', ['focusout', 'contextmenu', 'dragend', 'focusin', 'keydown', 'keyup', 'mousedown', 'mouseup', 'selectionchange']);
}

let activeElement = null;
let activeElementInst = null;
let lastSelection = null;
let mouseDown = false;

function getSelection(node) {
  if ('selectionStart' in node && hasSelectionCapabilities(node)) {
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

function getEventTargetDocument(eventTarget) {
  return eventTarget.window === eventTarget ? eventTarget.document : eventTarget.nodeType === DOCUMENT_NODE ? eventTarget : eventTarget.ownerDocument;
}

function constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget) {
  const doc = getEventTargetDocument(nativeEventTarget);

  if (mouseDown || activeElement == null || activeElement !== getActiveElement(doc)) {
    return;
  }

  const currentSelection = getSelection(activeElement);

  if (!lastSelection || !shallowEqual(lastSelection, currentSelection)) {
    lastSelection = currentSelection;
    const listeners = accumulateTwoPhaseListeners(activeElementInst, 'onSelect');

    if (listeners.length > 0) {
      const event = new SyntheticEvent('onSelect', 'select', null, nativeEvent, nativeEventTarget);
      dispatchQueue.push({
        event,
        listeners
      });
      event.target = activeElement;
    }
  }
}

function extractEvents$3(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
  const targetNode = targetInst ? getNodeFromInstance(targetInst) : window;

  switch (domEventName) {
    case 'focusin':
      if (isTextInputElement(targetNode) || targetNode.contentEditable === 'true') {
        activeElement = targetNode;
        activeElementInst = targetInst;
        lastSelection = null;
      }

      break;

    case 'focusout':
      activeElement = null;
      activeElementInst = null;
      lastSelection = null;
      break;

    case 'mousedown':
      mouseDown = true;
      break;

    case 'contextmenu':
    case 'mouseup':
    case 'dragend':
      mouseDown = false;
      constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
      break;

    case 'selectionchange':
      if (skipSelectionChangeEvent) {
        break;
      }

    case 'keydown':
    case 'keyup':
      constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
  }
}

function makePrefixMap(styleProp, eventName) {
  const prefixes = {};
  prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
  prefixes['Webkit' + styleProp] = 'webkit' + eventName;
  prefixes['Moz' + styleProp] = 'moz' + eventName;
  return prefixes;
}

const vendorPrefixes = {
  animationend: makePrefixMap('Animation', 'AnimationEnd'),
  animationiteration: makePrefixMap('Animation', 'AnimationIteration'),
  animationstart: makePrefixMap('Animation', 'AnimationStart'),
  transitionrun: makePrefixMap('Transition', 'TransitionRun'),
  transitionstart: makePrefixMap('Transition', 'TransitionStart'),
  transitioncancel: makePrefixMap('Transition', 'TransitionCancel'),
  transitionend: makePrefixMap('Transition', 'TransitionEnd')
};
const prefixedEventNames = {};
let style = {};

if (canUseDOM) {
  style = document.createElement('div').style;

  if (!('AnimationEvent' in window)) {
    delete vendorPrefixes.animationend.animation;
    delete vendorPrefixes.animationiteration.animation;
    delete vendorPrefixes.animationstart.animation;
  }

  if (!('TransitionEvent' in window)) {
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

const ANIMATION_END = getVendorPrefixedEventName('animationend');
const ANIMATION_ITERATION = getVendorPrefixedEventName('animationiteration');
const ANIMATION_START = getVendorPrefixedEventName('animationstart');
const TRANSITION_RUN = getVendorPrefixedEventName('transitionrun');
const TRANSITION_START = getVendorPrefixedEventName('transitionstart');
const TRANSITION_CANCEL = getVendorPrefixedEventName('transitioncancel');
const TRANSITION_END = getVendorPrefixedEventName('transitionend');

const topLevelEventsToReactNames = new Map();
const simpleEventPluginEvents = ['abort', 'auxClick', 'beforeToggle', 'cancel', 'canPlay', 'canPlayThrough', 'click', 'close', 'contextMenu', 'copy', 'cut', 'drag', 'dragEnd', 'dragEnter', 'dragExit', 'dragLeave', 'dragOver', 'dragStart', 'drop', 'durationChange', 'emptied', 'encrypted', 'ended', 'error', 'gotPointerCapture', 'input', 'invalid', 'keyDown', 'keyPress', 'keyUp', 'load', 'loadedData', 'loadedMetadata', 'loadStart', 'lostPointerCapture', 'mouseDown', 'mouseMove', 'mouseOut', 'mouseOver', 'mouseUp', 'paste', 'pause', 'play', 'playing', 'pointerCancel', 'pointerDown', 'pointerMove', 'pointerOut', 'pointerOver', 'pointerUp', 'progress', 'rateChange', 'reset', 'resize', 'seeked', 'seeking', 'stalled', 'submit', 'suspend', 'timeUpdate', 'touchCancel', 'touchEnd', 'touchStart', 'volumeChange', 'scroll', 'scrollEnd', 'toggle', 'touchMove', 'waiting', 'wheel'];

function registerSimpleEvent(domEventName, reactName) {
  topLevelEventsToReactNames.set(domEventName, reactName);
  registerTwoPhaseEvent(reactName, [domEventName]);
}

function registerSimpleEvents() {
  for (let i = 0; i < simpleEventPluginEvents.length; i++) {
    const eventName = simpleEventPluginEvents[i];
    const domEventName = eventName.toLowerCase();
    const capitalizedEvent = eventName[0].toUpperCase() + eventName.slice(1);
    registerSimpleEvent(domEventName, 'on' + capitalizedEvent);
  }

  registerSimpleEvent(ANIMATION_END, 'onAnimationEnd');
  registerSimpleEvent(ANIMATION_ITERATION, 'onAnimationIteration');
  registerSimpleEvent(ANIMATION_START, 'onAnimationStart');
  registerSimpleEvent('dblclick', 'onDoubleClick');
  registerSimpleEvent('focusin', 'onFocus');
  registerSimpleEvent('focusout', 'onBlur');
  registerSimpleEvent(TRANSITION_RUN, 'onTransitionRun');
  registerSimpleEvent(TRANSITION_START, 'onTransitionStart');
  registerSimpleEvent(TRANSITION_CANCEL, 'onTransitionCancel');
  registerSimpleEvent(TRANSITION_END, 'onTransitionEnd');
}

function extractEvents$2(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
  const reactName = topLevelEventsToReactNames.get(domEventName);

  if (reactName === undefined) {
    return;
  }

  let SyntheticEventCtor = SyntheticEvent;
  let reactEventType = domEventName;

  switch (domEventName) {
    case 'keypress':
      if (getEventCharCode(nativeEvent) === 0) {
        return;
      }

    case 'keydown':
    case 'keyup':
      SyntheticEventCtor = SyntheticKeyboardEvent;
      break;

    case 'focusin':
      reactEventType = 'focus';
      SyntheticEventCtor = SyntheticFocusEvent;
      break;

    case 'focusout':
      reactEventType = 'blur';
      SyntheticEventCtor = SyntheticFocusEvent;
      break;

    case 'beforeblur':
    case 'afterblur':
      SyntheticEventCtor = SyntheticFocusEvent;
      break;

    case 'click':
      if (nativeEvent.button === 2) {
        return;
      }

    case 'auxclick':
    case 'dblclick':
    case 'mousedown':
    case 'mousemove':
    case 'mouseup':
    case 'mouseout':
    case 'mouseover':
    case 'contextmenu':
      SyntheticEventCtor = SyntheticMouseEvent;
      break;

    case 'drag':
    case 'dragend':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    case 'dragover':
    case 'dragstart':
    case 'drop':
      SyntheticEventCtor = SyntheticDragEvent;
      break;

    case 'touchcancel':
    case 'touchend':
    case 'touchmove':
    case 'touchstart':
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

    case 'scroll':
    case 'scrollend':
      SyntheticEventCtor = SyntheticUIEvent;
      break;

    case 'wheel':
      SyntheticEventCtor = SyntheticWheelEvent;
      break;

    case 'copy':
    case 'cut':
    case 'paste':
      SyntheticEventCtor = SyntheticClipboardEvent;
      break;

    case 'gotpointercapture':
    case 'lostpointercapture':
    case 'pointercancel':
    case 'pointerdown':
    case 'pointermove':
    case 'pointerout':
    case 'pointerover':
    case 'pointerup':
      SyntheticEventCtor = SyntheticPointerEvent;
      break;

    case 'toggle':
    case 'beforetoggle':
      SyntheticEventCtor = SyntheticToggleEvent;
      break;
  }

  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;

  {
    const accumulateTargetOnly = !inCapturePhase && (domEventName === 'scroll' || domEventName === 'scrollend');
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

const OffscreenVisible = 0b001;
const OffscreenDetached = 0b010;
const OffscreenPassiveEffectsConnected = 0b100;
function isOffscreenManual(offscreenFiber) {
  return offscreenFiber.memoizedProps !== null && offscreenFiber.memoizedProps.mode === 'manual';
}

const concurrentQueues = [];
let concurrentQueuesIndex = 0;
let concurrentlyUpdatedLanes = NoLanes;
function finishQueueingConcurrentUpdates() {
  const endIndex = concurrentQueuesIndex;
  concurrentQueuesIndex = 0;
  concurrentlyUpdatedLanes = NoLanes;
  let i = 0;

  while (i < endIndex) {
    const fiber = concurrentQueues[i];
    concurrentQueues[i++] = null;
    const queue = concurrentQueues[i];
    concurrentQueues[i++] = null;
    const update = concurrentQueues[i];
    concurrentQueues[i++] = null;
    const lane = concurrentQueues[i];
    concurrentQueues[i++] = null;

    if (queue !== null && update !== null) {
      const pending = queue.pending;

      if (pending === null) {
        update.next = update;
      } else {
        update.next = pending.next;
        pending.next = update;
      }

      queue.pending = update;
    }

    if (lane !== NoLane) {
      markUpdateLaneFromFiberToRoot(fiber, update, lane);
    }
  }
}
function getConcurrentlyUpdatedLanes() {
  return concurrentlyUpdatedLanes;
}

function enqueueUpdate$1(fiber, queue, update, lane) {
  concurrentQueues[concurrentQueuesIndex++] = fiber;
  concurrentQueues[concurrentQueuesIndex++] = queue;
  concurrentQueues[concurrentQueuesIndex++] = update;
  concurrentQueues[concurrentQueuesIndex++] = lane;
  concurrentlyUpdatedLanes = mergeLanes(concurrentlyUpdatedLanes, lane);
  fiber.lanes = mergeLanes(fiber.lanes, lane);
  const alternate = fiber.alternate;

  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, lane);
  }
}

function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
  const concurrentQueue = queue;
  const concurrentUpdate = update;
  enqueueUpdate$1(fiber, concurrentQueue, concurrentUpdate, lane);
  return getRootForUpdatedFiber(fiber);
}
function enqueueConcurrentHookUpdateAndEagerlyBailout(fiber, queue, update) {
  const lane = NoLane;
  const concurrentQueue = queue;
  const concurrentUpdate = update;
  enqueueUpdate$1(fiber, concurrentQueue, concurrentUpdate, lane);
  const isConcurrentlyRendering = getWorkInProgressRoot() !== null;

  if (!isConcurrentlyRendering) {
    finishQueueingConcurrentUpdates();
  }
}
function enqueueConcurrentClassUpdate(fiber, queue, update, lane) {
  const concurrentQueue = queue;
  const concurrentUpdate = update;
  enqueueUpdate$1(fiber, concurrentQueue, concurrentUpdate, lane);
  return getRootForUpdatedFiber(fiber);
}
function enqueueConcurrentRenderForLane(fiber, lane) {
  enqueueUpdate$1(fiber, null, null, lane);
  return getRootForUpdatedFiber(fiber);
}
function unsafe_markUpdateLaneFromFiberToRoot(sourceFiber, lane) {
  const root = getRootForUpdatedFiber(sourceFiber);
  markUpdateLaneFromFiberToRoot(sourceFiber, null, lane);
  return root;
}

function markUpdateLaneFromFiberToRoot(sourceFiber, update, lane) {
  sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane);
  let alternate = sourceFiber.alternate;

  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, lane);
  }

  let isHidden = false;
  let parent = sourceFiber.return;
  let node = sourceFiber;

  while (parent !== null) {
    parent.childLanes = mergeLanes(parent.childLanes, lane);
    alternate = parent.alternate;

    if (alternate !== null) {
      alternate.childLanes = mergeLanes(alternate.childLanes, lane);
    }

    if (parent.tag === OffscreenComponent) {
      const offscreenInstance = parent.stateNode;

      if (offscreenInstance !== null && !(offscreenInstance._visibility & OffscreenVisible)) {
        isHidden = true;
      }
    }

    node = parent;
    parent = parent.return;
  }

  if (isHidden && update !== null && node.tag === HostRoot) {
    const root = node.stateNode;
    markHiddenUpdate(root, update, lane);
  }
}

function getRootForUpdatedFiber(sourceFiber) {
  throwIfInfiniteUpdateLoopDetected();
  detectUpdateOnUnmountedFiber(sourceFiber, sourceFiber);
  let node = sourceFiber;
  let parent = node.return;

  while (parent !== null) {
    detectUpdateOnUnmountedFiber(sourceFiber, node);
    node = parent;
    parent = node.return;
  }

  return node.tag === HostRoot ? node.stateNode : null;
}

function detectUpdateOnUnmountedFiber(sourceFiber, parent) {
  {
    const alternate = parent.alternate;

    if (alternate === null && (parent.flags & (Placement | Hydrating)) !== NoFlags$1) {
      warnAboutUpdateOnNotYetMountedFiberInDEV(sourceFiber);
    }
  }
}

const emptyContextObject = {};

{
  Object.freeze(emptyContextObject);
}

function hasContextChanged() {
  {
    return false;
  }
}

function isContextProvider(type) {
  {
    return false;
  }
}

function processChildContext(fiber, type, parentContext) {
  {
    return parentContext;
  }
}

function findCurrentUnmaskedContext(fiber) {
  {
    return emptyContextObject;
  }
}

let resolveFamily = null;
let failedBoundaries = null;
const setRefreshHandler = handler => {
  {
    resolveFamily = handler;
  }
};
function resolveFunctionForHotReloading(type) {
  {
    if (resolveFamily === null) {
      return type;
    }

    const family = resolveFamily(type);

    if (family === undefined) {
      return type;
    }

    return family.current;
  }
}
function resolveClassForHotReloading(type) {
  return resolveFunctionForHotReloading(type);
}
function resolveForwardRefForHotReloading(type) {
  {
    if (resolveFamily === null) {
      return type;
    }

    const family = resolveFamily(type);

    if (family === undefined) {
      if (type !== null && type !== undefined && typeof type.render === 'function') {
        const currentRender = resolveFunctionForHotReloading(type.render);

        if (type.render !== currentRender) {
          const syntheticType = {
            $$typeof: REACT_FORWARD_REF_TYPE,
            render: currentRender
          };

          if (type.displayName !== undefined) {
            syntheticType.displayName = type.displayName;
          }

          return syntheticType;
        }
      }

      return type;
    }

    return family.current;
  }
}
function isCompatibleFamilyForHotReloading(fiber, element) {
  {
    if (resolveFamily === null) {
      return false;
    }

    const prevType = fiber.elementType;
    const nextType = element.type;
    let needsCompareFamilies = false;
    const $$typeofNextType = typeof nextType === 'object' && nextType !== null ? nextType.$$typeof : null;

    switch (fiber.tag) {
      case ClassComponent:
        {
          if (typeof nextType === 'function') {
            needsCompareFamilies = true;
          }

          break;
        }

      case FunctionComponent:
        {
          if (typeof nextType === 'function') {
            needsCompareFamilies = true;
          } else if ($$typeofNextType === REACT_LAZY_TYPE) {
            needsCompareFamilies = true;
          }

          break;
        }

      case ForwardRef:
        {
          if ($$typeofNextType === REACT_FORWARD_REF_TYPE) {
            needsCompareFamilies = true;
          } else if ($$typeofNextType === REACT_LAZY_TYPE) {
            needsCompareFamilies = true;
          }

          break;
        }

      case MemoComponent:
      case SimpleMemoComponent:
        {
          if ($$typeofNextType === REACT_MEMO_TYPE) {
            needsCompareFamilies = true;
          } else if ($$typeofNextType === REACT_LAZY_TYPE) {
            needsCompareFamilies = true;
          }

          break;
        }

      default:
        return false;
    }

    if (needsCompareFamilies) {
      const prevFamily = resolveFamily(prevType);

      if (prevFamily !== undefined && prevFamily === resolveFamily(nextType)) {
        return true;
      }
    }

    return false;
  }
}
function markFailedErrorBoundaryForHotReloading(fiber) {
  {
    if (resolveFamily === null) {
      return;
    }

    if (typeof WeakSet !== 'function') {
      return;
    }

    if (failedBoundaries === null) {
      failedBoundaries = new WeakSet();
    }

    failedBoundaries.add(fiber);
  }
}
const scheduleRefresh = (root, update) => {
  {
    if (resolveFamily === null) {
      return;
    }

    const {
      staleFamilies,
      updatedFamilies
    } = update;
    flushPassiveEffects();
    scheduleFibersWithFamiliesRecursively(root.current, updatedFamilies, staleFamilies);
    flushSyncWork$1();
  }
};
const scheduleRoot = (root, element) => {
  {
    if (root.context !== emptyContextObject) {
      return;
    }

    updateContainerSync(element, root, null, null);
    flushSyncWork$1();
  }
};

function scheduleFibersWithFamiliesRecursively(fiber, updatedFamilies, staleFamilies) {
  {
    const {
      alternate,
      child,
      sibling,
      tag,
      type
    } = fiber;
    let candidateType = null;

    switch (tag) {
      case FunctionComponent:
      case SimpleMemoComponent:
      case ClassComponent:
        candidateType = type;
        break;

      case ForwardRef:
        candidateType = type.render;
        break;
    }

    if (resolveFamily === null) {
      throw new Error('Expected resolveFamily to be set during hot reload.');
    }

    let needsRender = false;
    let needsRemount = false;

    if (candidateType !== null) {
      const family = resolveFamily(candidateType);

      if (family !== undefined) {
        if (staleFamilies.has(family)) {
          needsRemount = true;
        } else if (updatedFamilies.has(family)) {
          if (tag === ClassComponent) {
            needsRemount = true;
          } else {
            needsRender = true;
          }
        }
      }
    }

    if (failedBoundaries !== null) {
      if (failedBoundaries.has(fiber) || alternate !== null && failedBoundaries.has(alternate)) {
        needsRemount = true;
      }
    }

    if (needsRemount) {
      fiber._debugNeedsRemount = true;
    }

    if (needsRemount || needsRender) {
      const root = enqueueConcurrentRenderForLane(fiber, SyncLane);

      if (root !== null) {
        scheduleUpdateOnFiber(root, fiber, SyncLane);
      }
    }

    if (child !== null && !needsRemount) {
      scheduleFibersWithFamiliesRecursively(child, updatedFamilies, staleFamilies);
    }

    if (sibling !== null) {
      scheduleFibersWithFamiliesRecursively(sibling, updatedFamilies, staleFamilies);
    }
  }
}

const NoMode = 0b0000000;
const ConcurrentMode = 0b0000001;
const ProfileMode = 0b0000010;
const StrictLegacyMode = 0b0001000;
const StrictEffectsMode = 0b0010000;
const NoStrictPassiveEffectsMode = 0b1000000;

let renderStartTime = -0;
let commitStartTime = -0;
function recordEffectDuration(fiber) {
  {
    return;
  }
}
function startEffectTimer() {
  {
    return;
  }
}

const ReactStrictModeWarnings = {
  recordUnsafeLifecycleWarnings: (fiber, instance) => {},
  flushPendingUnsafeLifecycleWarnings: () => {},
  recordLegacyContextWarning: (fiber, instance) => {},
  flushLegacyContextWarning: () => {},
  discardPendingWarnings: () => {}
};

{
  const findStrictRoot = fiber => {
    let maybeStrictRoot = null;
    let node = fiber;

    while (node !== null) {
      if (node.mode & StrictLegacyMode) {
        maybeStrictRoot = node;
      }

      node = node.return;
    }

    return maybeStrictRoot;
  };

  const setToSortedString = set => {
    const array = [];
    set.forEach(value => {
      array.push(value);
    });
    return array.sort().join(', ');
  };

  let pendingComponentWillMountWarnings = [];
  let pendingUNSAFE_ComponentWillMountWarnings = [];
  let pendingComponentWillReceivePropsWarnings = [];
  let pendingUNSAFE_ComponentWillReceivePropsWarnings = [];
  let pendingComponentWillUpdateWarnings = [];
  let pendingUNSAFE_ComponentWillUpdateWarnings = [];
  const didWarnAboutUnsafeLifecycles = new Set();

  ReactStrictModeWarnings.recordUnsafeLifecycleWarnings = (fiber, instance) => {
    if (didWarnAboutUnsafeLifecycles.has(fiber.type)) {
      return;
    }

    if (typeof instance.componentWillMount === 'function' && instance.componentWillMount.__suppressDeprecationWarning !== true) {
      pendingComponentWillMountWarnings.push(fiber);
    }

    if (fiber.mode & StrictLegacyMode && typeof instance.UNSAFE_componentWillMount === 'function') {
      pendingUNSAFE_ComponentWillMountWarnings.push(fiber);
    }

    if (typeof instance.componentWillReceiveProps === 'function' && instance.componentWillReceiveProps.__suppressDeprecationWarning !== true) {
      pendingComponentWillReceivePropsWarnings.push(fiber);
    }

    if (fiber.mode & StrictLegacyMode && typeof instance.UNSAFE_componentWillReceiveProps === 'function') {
      pendingUNSAFE_ComponentWillReceivePropsWarnings.push(fiber);
    }

    if (typeof instance.componentWillUpdate === 'function' && instance.componentWillUpdate.__suppressDeprecationWarning !== true) {
      pendingComponentWillUpdateWarnings.push(fiber);
    }

    if (fiber.mode & StrictLegacyMode && typeof instance.UNSAFE_componentWillUpdate === 'function') {
      pendingUNSAFE_ComponentWillUpdateWarnings.push(fiber);
    }
  };

  ReactStrictModeWarnings.flushPendingUnsafeLifecycleWarnings = () => {
    const componentWillMountUniqueNames = new Set();

    if (pendingComponentWillMountWarnings.length > 0) {
      pendingComponentWillMountWarnings.forEach(fiber => {
        componentWillMountUniqueNames.add(getComponentNameFromFiber(fiber) || 'Component');
        didWarnAboutUnsafeLifecycles.add(fiber.type);
      });
      pendingComponentWillMountWarnings = [];
    }

    const UNSAFE_componentWillMountUniqueNames = new Set();

    if (pendingUNSAFE_ComponentWillMountWarnings.length > 0) {
      pendingUNSAFE_ComponentWillMountWarnings.forEach(fiber => {
        UNSAFE_componentWillMountUniqueNames.add(getComponentNameFromFiber(fiber) || 'Component');
        didWarnAboutUnsafeLifecycles.add(fiber.type);
      });
      pendingUNSAFE_ComponentWillMountWarnings = [];
    }

    const componentWillReceivePropsUniqueNames = new Set();

    if (pendingComponentWillReceivePropsWarnings.length > 0) {
      pendingComponentWillReceivePropsWarnings.forEach(fiber => {
        componentWillReceivePropsUniqueNames.add(getComponentNameFromFiber(fiber) || 'Component');
        didWarnAboutUnsafeLifecycles.add(fiber.type);
      });
      pendingComponentWillReceivePropsWarnings = [];
    }

    const UNSAFE_componentWillReceivePropsUniqueNames = new Set();

    if (pendingUNSAFE_ComponentWillReceivePropsWarnings.length > 0) {
      pendingUNSAFE_ComponentWillReceivePropsWarnings.forEach(fiber => {
        UNSAFE_componentWillReceivePropsUniqueNames.add(getComponentNameFromFiber(fiber) || 'Component');
        didWarnAboutUnsafeLifecycles.add(fiber.type);
      });
      pendingUNSAFE_ComponentWillReceivePropsWarnings = [];
    }

    const componentWillUpdateUniqueNames = new Set();

    if (pendingComponentWillUpdateWarnings.length > 0) {
      pendingComponentWillUpdateWarnings.forEach(fiber => {
        componentWillUpdateUniqueNames.add(getComponentNameFromFiber(fiber) || 'Component');
        didWarnAboutUnsafeLifecycles.add(fiber.type);
      });
      pendingComponentWillUpdateWarnings = [];
    }

    const UNSAFE_componentWillUpdateUniqueNames = new Set();

    if (pendingUNSAFE_ComponentWillUpdateWarnings.length > 0) {
      pendingUNSAFE_ComponentWillUpdateWarnings.forEach(fiber => {
        UNSAFE_componentWillUpdateUniqueNames.add(getComponentNameFromFiber(fiber) || 'Component');
        didWarnAboutUnsafeLifecycles.add(fiber.type);
      });
      pendingUNSAFE_ComponentWillUpdateWarnings = [];
    }

    if (UNSAFE_componentWillMountUniqueNames.size > 0) {
      const sortedNames = setToSortedString(UNSAFE_componentWillMountUniqueNames);
      console.error('Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. ' + 'See https://react.dev/link/unsafe-component-lifecycles for details.\n\n' + '* Move code with side effects to componentDidMount, and set initial state in the constructor.\n' + '\nPlease update the following components: %s', sortedNames);
    }

    if (UNSAFE_componentWillReceivePropsUniqueNames.size > 0) {
      const sortedNames = setToSortedString(UNSAFE_componentWillReceivePropsUniqueNames);
      console.error('Using UNSAFE_componentWillReceiveProps in strict mode is not recommended ' + 'and may indicate bugs in your code. ' + 'See https://react.dev/link/unsafe-component-lifecycles for details.\n\n' + '* Move data fetching code or side effects to componentDidUpdate.\n' + "* If you're updating state whenever props change, " + 'refactor your code to use memoization techniques or move it to ' + 'static getDerivedStateFromProps. Learn more at: https://react.dev/link/derived-state\n' + '\nPlease update the following components: %s', sortedNames);
    }

    if (UNSAFE_componentWillUpdateUniqueNames.size > 0) {
      const sortedNames = setToSortedString(UNSAFE_componentWillUpdateUniqueNames);
      console.error('Using UNSAFE_componentWillUpdate in strict mode is not recommended ' + 'and may indicate bugs in your code. ' + 'See https://react.dev/link/unsafe-component-lifecycles for details.\n\n' + '* Move data fetching code or side effects to componentDidUpdate.\n' + '\nPlease update the following components: %s', sortedNames);
    }

    if (componentWillMountUniqueNames.size > 0) {
      const sortedNames = setToSortedString(componentWillMountUniqueNames);
      console.warn('componentWillMount has been renamed, and is not recommended for use. ' + 'See https://react.dev/link/unsafe-component-lifecycles for details.\n\n' + '* Move code with side effects to componentDidMount, and set initial state in the constructor.\n' + '* Rename componentWillMount to UNSAFE_componentWillMount to suppress ' + 'this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. ' + 'To rename all deprecated lifecycles to their new names, you can run ' + '`npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n' + '\nPlease update the following components: %s', sortedNames);
    }

    if (componentWillReceivePropsUniqueNames.size > 0) {
      const sortedNames = setToSortedString(componentWillReceivePropsUniqueNames);
      console.warn('componentWillReceiveProps has been renamed, and is not recommended for use. ' + 'See https://react.dev/link/unsafe-component-lifecycles for details.\n\n' + '* Move data fetching code or side effects to componentDidUpdate.\n' + "* If you're updating state whenever props change, refactor your " + 'code to use memoization techniques or move it to ' + 'static getDerivedStateFromProps. Learn more at: https://react.dev/link/derived-state\n' + '* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress ' + 'this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. ' + 'To rename all deprecated lifecycles to their new names, you can run ' + '`npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n' + '\nPlease update the following components: %s', sortedNames);
    }

    if (componentWillUpdateUniqueNames.size > 0) {
      const sortedNames = setToSortedString(componentWillUpdateUniqueNames);
      console.warn('componentWillUpdate has been renamed, and is not recommended for use. ' + 'See https://react.dev/link/unsafe-component-lifecycles for details.\n\n' + '* Move data fetching code or side effects to componentDidUpdate.\n' + '* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress ' + 'this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. ' + 'To rename all deprecated lifecycles to their new names, you can run ' + '`npx react-codemod rename-unsafe-lifecycles` in your project source folder.\n' + '\nPlease update the following components: %s', sortedNames);
    }
  };

  let pendingLegacyContextWarning = new Map();
  const didWarnAboutLegacyContext = new Set();

  ReactStrictModeWarnings.recordLegacyContextWarning = (fiber, instance) => {
    const strictRoot = findStrictRoot(fiber);

    if (strictRoot === null) {
      console.error('Expected to find a StrictMode component in a strict mode tree. ' + 'This error is likely caused by a bug in React. Please file an issue.');
      return;
    }

    if (didWarnAboutLegacyContext.has(fiber.type)) {
      return;
    }

    let warningsForRoot = pendingLegacyContextWarning.get(strictRoot);

    if (fiber.type.contextTypes != null || fiber.type.childContextTypes != null || instance !== null && typeof instance.getChildContext === 'function') {
      if (warningsForRoot === undefined) {
        warningsForRoot = [];
        pendingLegacyContextWarning.set(strictRoot, warningsForRoot);
      }

      warningsForRoot.push(fiber);
    }
  };

  ReactStrictModeWarnings.flushLegacyContextWarning = () => {
    pendingLegacyContextWarning.forEach((fiberArray, strictRoot) => {
      if (fiberArray.length === 0) {
        return;
      }

      const firstFiber = fiberArray[0];
      const uniqueNames = new Set();
      fiberArray.forEach(fiber => {
        uniqueNames.add(getComponentNameFromFiber(fiber) || 'Component');
        didWarnAboutLegacyContext.add(fiber.type);
      });
      const sortedNames = setToSortedString(uniqueNames);
      runWithFiberInDEV(firstFiber, () => {
        console.error('Legacy context API has been detected within a strict-mode tree.' + '\n\nThe old API will be supported in all 16.x releases, but applications ' + 'using it should migrate to the new version.' + '\n\nPlease update the following components: %s' + '\n\nLearn more about this warning here: https://react.dev/link/legacy-context', sortedNames);
      });
    });
  };

  ReactStrictModeWarnings.discardPendingWarnings = () => {
    pendingComponentWillMountWarnings = [];
    pendingUNSAFE_ComponentWillMountWarnings = [];
    pendingComponentWillReceivePropsWarnings = [];
    pendingUNSAFE_ComponentWillReceivePropsWarnings = [];
    pendingComponentWillUpdateWarnings = [];
    pendingUNSAFE_ComponentWillUpdateWarnings = [];
    pendingLegacyContextWarning = new Map();
  };
}

const CapturedStacks = new WeakMap();
function createCapturedValueAtFiber(value, source) {
  if (typeof value === 'object' && value !== null) {
    const existing = CapturedStacks.get(value);

    if (existing !== undefined) {
      return existing;
    }

    const captured = {
      value,
      source,
      stack: getStackByFiberInDevAndProd(source)
    };
    CapturedStacks.set(value, captured);
    return captured;
  } else {
    return {
      value,
      source,
      stack: getStackByFiberInDevAndProd(source)
    };
  }
}
function createCapturedValueFromError(value, stack) {
  const captured = {
    value,
    source: null,
    stack: stack
  };

  if (typeof stack === 'string') {
    CapturedStacks.set(value, captured);
  }

  return captured;
}

const forkStack = [];
let forkStackIndex = 0;
let treeForkProvider = null;
let treeForkCount = 0;
const idStack = [];
let idStackIndex = 0;
let treeContextProvider = null;
let treeContextId = 1;
let treeContextOverflow = '';
function isForkedChild(workInProgress) {
  warnIfNotHydrating();
  return (workInProgress.flags & Forked) !== NoFlags$1;
}
function getForksAtLevel(workInProgress) {
  warnIfNotHydrating();
  return treeForkCount;
}
function getTreeId() {
  const overflow = treeContextOverflow;
  const idWithLeadingBit = treeContextId;
  const id = idWithLeadingBit & ~getLeadingBit(idWithLeadingBit);
  return id.toString(32) + overflow;
}
function pushTreeFork(workInProgress, totalChildren) {
  warnIfNotHydrating();
  forkStack[forkStackIndex++] = treeForkCount;
  forkStack[forkStackIndex++] = treeForkProvider;
  treeForkProvider = workInProgress;
  treeForkCount = totalChildren;
}
function pushTreeId(workInProgress, totalChildren, index) {
  warnIfNotHydrating();
  idStack[idStackIndex++] = treeContextId;
  idStack[idStackIndex++] = treeContextOverflow;
  idStack[idStackIndex++] = treeContextProvider;
  treeContextProvider = workInProgress;
  const baseIdWithLeadingBit = treeContextId;
  const baseOverflow = treeContextOverflow;
  const baseLength = getBitLength(baseIdWithLeadingBit) - 1;
  const baseId = baseIdWithLeadingBit & ~(1 << baseLength);
  const slot = index + 1;
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
function pushMaterializedTreeId(workInProgress) {
  warnIfNotHydrating();
  const returnFiber = workInProgress.return;

  if (returnFiber !== null) {
    const numberOfForks = 1;
    const slotIndex = 0;
    pushTreeFork(workInProgress, numberOfForks);
    pushTreeId(workInProgress, numberOfForks, slotIndex);
  }
}

function getBitLength(number) {
  return 32 - clz32(number);
}

function getLeadingBit(id) {
  return 1 << getBitLength(id) - 1;
}

function popTreeContext(workInProgress) {
  while (workInProgress === treeForkProvider) {
    treeForkProvider = forkStack[--forkStackIndex];
    forkStack[forkStackIndex] = null;
    treeForkCount = forkStack[--forkStackIndex];
    forkStack[forkStackIndex] = null;
  }

  while (workInProgress === treeContextProvider) {
    treeContextProvider = idStack[--idStackIndex];
    idStack[idStackIndex] = null;
    treeContextOverflow = idStack[--idStackIndex];
    idStack[idStackIndex] = null;
    treeContextId = idStack[--idStackIndex];
    idStack[idStackIndex] = null;
  }
}
function getSuspendedTreeContext() {
  warnIfNotHydrating();

  if (treeContextProvider !== null) {
    return {
      id: treeContextId,
      overflow: treeContextOverflow
    };
  } else {
    return null;
  }
}
function restoreSuspendedTreeContext(workInProgress, suspendedContext) {
  warnIfNotHydrating();
  idStack[idStackIndex++] = treeContextId;
  idStack[idStackIndex++] = treeContextOverflow;
  idStack[idStackIndex++] = treeContextProvider;
  treeContextId = suspendedContext.id;
  treeContextOverflow = suspendedContext.overflow;
  treeContextProvider = workInProgress;
}

function warnIfNotHydrating() {
  {
    if (!getIsHydrating()) {
      console.error('Expected to be hydrating. This is a bug in React. Please file ' + 'an issue.');
    }
  }
}

let hydrationParentFiber = null;
let nextHydratableInstance = null;
let isHydrating = false;
let didSuspendOrErrorDEV = false;
let hydrationDiffRootDEV = null;
let hydrationErrors = null;
let rootOrSingletonContext = false;

function buildHydrationDiffNode(fiber, distanceFromLeaf) {
  if (fiber.return === null) {
    if (hydrationDiffRootDEV === null) {
      hydrationDiffRootDEV = {
        fiber: fiber,
        children: [],
        serverProps: undefined,
        serverTail: [],
        distanceFromLeaf: distanceFromLeaf
      };
    } else if (hydrationDiffRootDEV.fiber !== fiber) {
      throw new Error('Saw multiple hydration diff roots in a pass. This is a bug in React.');
    } else if (hydrationDiffRootDEV.distanceFromLeaf > distanceFromLeaf) {
      hydrationDiffRootDEV.distanceFromLeaf = distanceFromLeaf;
    }

    return hydrationDiffRootDEV;
  }

  const siblings = buildHydrationDiffNode(fiber.return, distanceFromLeaf + 1).children;

  if (siblings.length > 0 && siblings[siblings.length - 1].fiber === fiber) {
    const existing = siblings[siblings.length - 1];

    if (existing.distanceFromLeaf > distanceFromLeaf) {
      existing.distanceFromLeaf = distanceFromLeaf;
    }

    return existing;
  }

  const newNode = {
    fiber: fiber,
    children: [],
    serverProps: undefined,
    serverTail: [],
    distanceFromLeaf: distanceFromLeaf
  };
  siblings.push(newNode);
  return newNode;
}

function warnIfHydrating() {
  {
    if (isHydrating) {
      console.error('We should not be hydrating here. This is a bug in React. Please file a bug.');
    }
  }
}

function markDidThrowWhileHydratingDEV() {
  {
    didSuspendOrErrorDEV = true;
  }
}

function enterHydrationState(fiber) {

  const parentInstance = fiber.stateNode.containerInfo;
  nextHydratableInstance = getFirstHydratableChildWithinContainer(parentInstance);
  hydrationParentFiber = fiber;
  isHydrating = true;
  hydrationErrors = null;
  didSuspendOrErrorDEV = false;
  hydrationDiffRootDEV = null;
  rootOrSingletonContext = true;
  return true;
}

function reenterHydrationStateFromDehydratedSuspenseInstance(fiber, suspenseInstance, treeContext) {

  nextHydratableInstance = getFirstHydratableChildWithinSuspenseInstance(suspenseInstance);
  hydrationParentFiber = fiber;
  isHydrating = true;
  hydrationErrors = null;
  didSuspendOrErrorDEV = false;
  hydrationDiffRootDEV = null;
  rootOrSingletonContext = false;

  if (treeContext !== null) {
    restoreSuspendedTreeContext(fiber, treeContext);
  }

  return true;
}

function warnNonHydratedInstance(fiber, rejectedCandidate) {
  {
    if (didSuspendOrErrorDEV) {
      return;
    }

    const diffNode = buildHydrationDiffNode(fiber, 0);
    diffNode.serverProps = null;

    if (rejectedCandidate !== null) {
      const description = describeHydratableInstanceForDevWarnings(rejectedCandidate);
      diffNode.serverTail.push(description);
    }
  }
}

function tryHydrateInstance(fiber, nextInstance, hostContext) {
  const instance = canHydrateInstance(nextInstance, fiber.type, fiber.pendingProps, rootOrSingletonContext);

  if (instance !== null) {
    fiber.stateNode = instance;

    {
      if (!didSuspendOrErrorDEV) {
        const differences = diffHydratedPropsForDevWarnings(instance, fiber.type, fiber.pendingProps, hostContext);

        if (differences !== null) {
          const diffNode = buildHydrationDiffNode(fiber, 0);
          diffNode.serverProps = differences;
        }
      }
    }

    hydrationParentFiber = fiber;
    nextHydratableInstance = getFirstHydratableChild(instance);
    rootOrSingletonContext = false;
    return true;
  }

  return false;
}

function tryHydrateText(fiber, nextInstance) {
  const text = fiber.pendingProps;
  const textInstance = canHydrateTextInstance(nextInstance, text, rootOrSingletonContext);

  if (textInstance !== null) {
    fiber.stateNode = textInstance;
    hydrationParentFiber = fiber;
    nextHydratableInstance = null;
    return true;
  }

  return false;
}

function tryHydrateSuspense(fiber, nextInstance) {
  const suspenseInstance = canHydrateSuspenseInstance(nextInstance, rootOrSingletonContext);

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

const HydrationMismatchException = new Error('Hydration Mismatch Exception: This is not a real error, and should not leak into ' + "userspace. If you're seeing this, it's likely a bug in React.");

function throwOnHydrationMismatch(fiber) {
  let diff = '';

  {
    const diffRoot = hydrationDiffRootDEV;

    if (diffRoot !== null) {
      hydrationDiffRootDEV = null;
      diff = describeDiff(diffRoot);
    }
  }

  const error = new Error("Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:\n" + '\n' + "- A server/client branch `if (typeof window !== 'undefined')`.\n" + "- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.\n" + "- Date formatting in a user's locale which doesn't match the server.\n" + '- External changing data without sending a snapshot of it along with the HTML.\n' + '- Invalid HTML tag nesting.\n' + '\n' + 'It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.\n' + '\n' + 'https://react.dev/link/hydration-mismatch' + diff);
  queueHydrationError(createCapturedValueAtFiber(error, fiber));
  throw HydrationMismatchException;
}

function claimHydratableSingleton(fiber) {
  {
    if (!isHydrating) {
      return;
    }

    const currentRootContainer = getRootHostContainer();
    const currentHostContext = getHostContext();
    const instance = fiber.stateNode = resolveSingletonInstance(fiber.type, fiber.pendingProps, currentRootContainer, currentHostContext, false);

    {
      if (!didSuspendOrErrorDEV) {
        const differences = diffHydratedPropsForDevWarnings(instance, fiber.type, fiber.pendingProps, currentHostContext);

        if (differences !== null) {
          const diffNode = buildHydrationDiffNode(fiber, 0);
          diffNode.serverProps = differences;
        }
      }
    }

    hydrationParentFiber = fiber;
    rootOrSingletonContext = true;
    nextHydratableInstance = getFirstHydratableChild(instance);
  }
}

function tryToClaimNextHydratableInstance(fiber) {
  if (!isHydrating) {
    return;
  }

  const currentHostContext = getHostContext();
  const shouldKeepWarning = validateHydratableInstance(fiber.type, fiber.pendingProps, currentHostContext);
  const nextInstance = nextHydratableInstance;

  if (!nextInstance || !tryHydrateInstance(fiber, nextInstance, currentHostContext)) {
    if (shouldKeepWarning) {
      warnNonHydratedInstance(fiber, nextInstance);
    }

    throwOnHydrationMismatch(fiber);
  }
}

function tryToClaimNextHydratableTextInstance(fiber) {
  if (!isHydrating) {
    return;
  }

  const text = fiber.pendingProps;
  let shouldKeepWarning = true;
  const currentHostContext = getHostContext();
  shouldKeepWarning = validateHydratableTextInstance(text, currentHostContext);
  const nextInstance = nextHydratableInstance;

  if (!nextInstance || !tryHydrateText(fiber, nextInstance)) {
    if (shouldKeepWarning) {
      warnNonHydratedInstance(fiber, nextInstance);
    }

    throwOnHydrationMismatch(fiber);
  }
}

function tryToClaimNextHydratableSuspenseInstance(fiber) {
  if (!isHydrating) {
    return;
  }

  const nextInstance = nextHydratableInstance;

  if (!nextInstance || !tryHydrateSuspense(fiber, nextInstance)) {
    warnNonHydratedInstance(fiber, nextInstance);
    throwOnHydrationMismatch(fiber);
  }
}

function tryToClaimNextHydratableFormMarkerInstance(fiber) {
  if (!isHydrating) {
    return false;
  }

  if (nextHydratableInstance) {
    const markerInstance = canHydrateFormStateMarker(nextHydratableInstance, rootOrSingletonContext);

    if (markerInstance) {
      nextHydratableInstance = getNextHydratableSibling(markerInstance);
      return isFormStateMarkerMatching(markerInstance);
    }
  }

  throwOnHydrationMismatch(fiber);
  return false;
}

function prepareToHydrateHostInstance(fiber, hostContext) {

  const instance = fiber.stateNode;
  const didHydrate = hydrateInstance(instance, fiber.type, fiber.memoizedProps, hostContext, fiber);

  if (!didHydrate && favorSafetyOverHydrationPerf) {
    throwOnHydrationMismatch(fiber);
  }
}

function prepareToHydrateHostTextInstance(fiber) {

  const textInstance = fiber.stateNode;
  const textContent = fiber.memoizedProps;
  const shouldWarnIfMismatchDev = !didSuspendOrErrorDEV;
  let parentProps = null;
  const returnFiber = hydrationParentFiber;

  if (returnFiber !== null) {
    switch (returnFiber.tag) {
      case HostRoot:
        {
          {
            if (shouldWarnIfMismatchDev) {
              const difference = diffHydratedTextForDevWarnings(textInstance, textContent, parentProps);

              if (difference !== null) {
                const diffNode = buildHydrationDiffNode(fiber, 0);
                diffNode.serverProps = difference;
              }
            }
          }

          break;
        }

      case HostSingleton:
      case HostComponent:
        {
          parentProps = returnFiber.memoizedProps;

          {
            if (shouldWarnIfMismatchDev) {
              const difference = diffHydratedTextForDevWarnings(textInstance, textContent, parentProps);

              if (difference !== null) {
                const diffNode = buildHydrationDiffNode(fiber, 0);
                diffNode.serverProps = difference;
              }
            }
          }

          break;
        }
    }
  }

  const didHydrate = hydrateTextInstance(textInstance, textContent, fiber, parentProps);

  if (!didHydrate && favorSafetyOverHydrationPerf) {
    throwOnHydrationMismatch(fiber);
  }
}

function prepareToHydrateHostSuspenseInstance(fiber) {

  const suspenseState = fiber.memoizedState;
  const suspenseInstance = suspenseState !== null ? suspenseState.dehydrated : null;

  if (!suspenseInstance) {
    throw new Error('Expected to have a hydrated suspense instance. ' + 'This error is likely caused by a bug in React. Please file an issue.');
  }

  hydrateSuspenseInstance(suspenseInstance, fiber);
}

function skipPastDehydratedSuspenseInstance(fiber) {

  const suspenseState = fiber.memoizedState;
  const suspenseInstance = suspenseState !== null ? suspenseState.dehydrated : null;

  if (!suspenseInstance) {
    throw new Error('Expected to have a hydrated suspense instance. ' + 'This error is likely caused by a bug in React. Please file an issue.');
  }

  return getNextHydratableInstanceAfterSuspenseInstance(suspenseInstance);
}

function popToNextHostParent(fiber) {
  hydrationParentFiber = fiber.return;

  while (hydrationParentFiber) {
    switch (hydrationParentFiber.tag) {
      case HostRoot:
      case HostSingleton:
        rootOrSingletonContext = true;
        return;

      case HostComponent:
      case SuspenseComponent:
        rootOrSingletonContext = false;
        return;

      default:
        hydrationParentFiber = hydrationParentFiber.return;
    }
  }
}

function popHydrationState(fiber) {

  if (fiber !== hydrationParentFiber) {
    return false;
  }

  if (!isHydrating) {
    popToNextHostParent(fiber);
    isHydrating = true;
    return false;
  }

  let shouldClear = false;

  {
    if (fiber.tag !== HostRoot && fiber.tag !== HostSingleton && !(fiber.tag === HostComponent && (!shouldDeleteUnhydratedTailInstances(fiber.type) || shouldSetTextContent(fiber.type, fiber.memoizedProps)))) {
      shouldClear = true;
    }
  }

  if (shouldClear) {
    const nextInstance = nextHydratableInstance;

    if (nextInstance) {
      warnIfUnhydratedTailNodes(fiber);
      throwOnHydrationMismatch(fiber);
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

function warnIfUnhydratedTailNodes(fiber) {
  {
    let nextInstance = nextHydratableInstance;

    while (nextInstance) {
      const diffNode = buildHydrationDiffNode(fiber, 0);
      const description = describeHydratableInstanceForDevWarnings(nextInstance);
      diffNode.serverTail.push(description);

      if (description.type === 'Suspense') {
        const suspenseInstance = nextInstance;
        nextInstance = getNextHydratableInstanceAfterSuspenseInstance(suspenseInstance);
      } else {
        nextInstance = getNextHydratableSibling(nextInstance);
      }
    }
  }
}

function resetHydrationState() {

  hydrationParentFiber = null;
  nextHydratableInstance = null;
  isHydrating = false;
  didSuspendOrErrorDEV = false;
}

function upgradeHydrationErrorsToRecoverable() {
  if (hydrationErrors !== null) {
    queueRecoverableErrors(hydrationErrors);
    hydrationErrors = null;
  }
}

function getIsHydrating() {
  return isHydrating;
}

function queueHydrationError(error) {
  if (hydrationErrors === null) {
    hydrationErrors = [error];
  } else {
    hydrationErrors.push(error);
  }
}
function emitPendingHydrationWarnings() {
  {
    const diffRoot = hydrationDiffRootDEV;

    if (diffRoot !== null) {
      hydrationDiffRootDEV = null;
      const diff = describeDiff(diffRoot);
      console.error("A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. " + 'This can happen if a SSR-ed Client Component used:\n' + '\n' + "- A server/client branch `if (typeof window !== 'undefined')`.\n" + "- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.\n" + "- Date formatting in a user's locale which doesn't match the server.\n" + '- External changing data without sending a snapshot of it along with the HTML.\n' + '- Invalid HTML tag nesting.\n' + '\n' + 'It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.\n' + '\n' + '%s%s', 'https://react.dev/link/hydration-mismatch', diff);
    }
  }
}

function getThenablesFromState(state) {
  {
    const devState = state;
    return devState.thenables;
  }
}

const SuspenseException = new Error("Suspense Exception: This is not a real error! It's an implementation " + 'detail of `use` to interrupt the current render. You must either ' + 'rethrow it immediately, or move the `use` call outside of the ' + '`try/catch` block. Capturing without rethrowing will lead to ' + 'unexpected behavior.\n\n' + 'To handle async errors, wrap your component in an error boundary, or ' + "call the promise's `.catch` method and pass the result to `use`");
const SuspenseyCommitException = new Error('Suspense Exception: This is not a real error, and should not leak into ' + "userspace. If you're seeing this, it's likely a bug in React.");
const noopSuspenseyCommitThenable = {
  then() {
    {
      console.error('Internal React error: A listener was unexpectedly attached to a ' + '"noop" thenable. This is a bug in React. Please file an issue.');
    }
  }

};
function createThenableState() {
  {
    return {
      didWarnAboutUncachedPromise: false,
      thenables: []
    };
  }
}
function isThenableResolved(thenable) {
  const status = thenable.status;
  return status === 'fulfilled' || status === 'rejected';
}

function noop$3() {}

function trackUsedThenable(thenableState, thenable, index) {
  if (ReactSharedInternals.actQueue !== null) {
    ReactSharedInternals.didUsePromise = true;
  }

  const trackedThenables = getThenablesFromState(thenableState);
  const previous = trackedThenables[index];

  if (previous === undefined) {
    trackedThenables.push(thenable);
  } else {
    if (previous !== thenable) {
      {
        const thenableStateDev = thenableState;

        if (!thenableStateDev.didWarnAboutUncachedPromise) {
          thenableStateDev.didWarnAboutUncachedPromise = true;
          console.error('A component was suspended by an uncached promise. Creating ' + 'promises inside a Client Component or hook is not yet ' + 'supported, except via a Suspense-compatible library or framework.');
        }
      }

      thenable.then(noop$3, noop$3);
      thenable = previous;
    }
  }

  switch (thenable.status) {
    case 'fulfilled':
      {
        const fulfilledValue = thenable.value;
        return fulfilledValue;
      }

    case 'rejected':
      {
        const rejectedError = thenable.reason;
        checkIfUseWrappedInAsyncCatch(rejectedError);
        throw rejectedError;
      }

    default:
      {
        if (typeof thenable.status === 'string') {
          thenable.then(noop$3, noop$3);
        } else {
          const root = getWorkInProgressRoot();

          if (root !== null && root.shellSuspendCounter > 100) {
            throw new Error('async/await is not yet supported in Client Components, only ' + 'Server Components. This error is often caused by accidentally ' + "adding `'use client'` to a module that was originally written " + 'for the server.');
          }

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
        }

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
              checkIfUseWrappedInAsyncCatch(rejectedError);
              throw rejectedError;
            }
        }

        suspendedThenable = thenable;

        {
          needsToResetSuspendedThenableDEV = true;
        }

        throw SuspenseException;
      }
  }
}
function suspendCommit() {
  suspendedThenable = noopSuspenseyCommitThenable;
  throw SuspenseyCommitException;
}
let suspendedThenable = null;
let needsToResetSuspendedThenableDEV = false;
function getSuspendedThenable() {
  if (suspendedThenable === null) {
    throw new Error('Expected a suspended thenable. This is a bug in React. Please file ' + 'an issue.');
  }

  const thenable = suspendedThenable;
  suspendedThenable = null;

  {
    needsToResetSuspendedThenableDEV = false;
  }

  return thenable;
}
function checkIfUseWrappedInTryCatch() {
  {
    if (needsToResetSuspendedThenableDEV) {
      needsToResetSuspendedThenableDEV = false;
      return true;
    }
  }

  return false;
}
function checkIfUseWrappedInAsyncCatch(rejectedReason) {
  if (rejectedReason === SuspenseException) {
    throw new Error('Hooks are not supported inside an async component. This ' + "error is often caused by accidentally adding `'use client'` " + 'to a module that was originally written for the server.');
  }
}

const callComponent = {
  'react-stack-bottom-frame': function (Component, props, secondArg) {
    const wasRendering = isRendering;
    setIsRendering(true);

    try {
      const result = Component(props, secondArg);
      return result;
    } finally {
      setIsRendering(wasRendering);
    }
  }
};
const callComponentInDEV = callComponent['react-stack-bottom-frame'].bind(callComponent) ;
const callRender = {
  'react-stack-bottom-frame': function (instance) {
    const wasRendering = isRendering;
    setIsRendering(true);

    try {
      const result = instance.render();
      return result;
    } finally {
      setIsRendering(wasRendering);
    }
  }
};
const callRenderInDEV = callRender['react-stack-bottom-frame'].bind(callRender) ;
const callComponentDidMount = {
  'react-stack-bottom-frame': function (finishedWork, instance) {
    try {
      instance.componentDidMount();
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
};
const callComponentDidMountInDEV = callComponentDidMount['react-stack-bottom-frame'].bind(callComponentDidMount) ;
const callComponentDidUpdate = {
  'react-stack-bottom-frame': function (finishedWork, instance, prevProps, prevState, snapshot) {
    try {
      instance.componentDidUpdate(prevProps, prevState, snapshot);
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
};
const callComponentDidUpdateInDEV = callComponentDidUpdate['react-stack-bottom-frame'].bind(callComponentDidUpdate) ;
const callComponentDidCatch = {
  'react-stack-bottom-frame': function (instance, errorInfo) {
    const error = errorInfo.value;
    const stack = errorInfo.stack;
    instance.componentDidCatch(error, {
      componentStack: stack !== null ? stack : ''
    });
  }
};
const callComponentDidCatchInDEV = callComponentDidCatch['react-stack-bottom-frame'].bind(callComponentDidCatch) ;
const callComponentWillUnmount = {
  'react-stack-bottom-frame': function (current, nearestMountedAncestor, instance) {
    try {
      instance.componentWillUnmount();
    } catch (error) {
      captureCommitPhaseError(current, nearestMountedAncestor, error);
    }
  }
};
const callComponentWillUnmountInDEV = callComponentWillUnmount['react-stack-bottom-frame'].bind(callComponentWillUnmount) ;
const callCreate = {
  'react-stack-bottom-frame': function (effect) {
    const create = effect.create;
    const inst = effect.inst;
    const destroy = create();
    inst.destroy = destroy;
    return destroy;
  }
};
const callCreateInDEV = callCreate['react-stack-bottom-frame'].bind(callCreate) ;
const callDestroy = {
  'react-stack-bottom-frame': function (current, nearestMountedAncestor, destroy) {
    try {
      destroy();
    } catch (error) {
      captureCommitPhaseError(current, nearestMountedAncestor, error);
    }
  }
};
const callDestroyInDEV = callDestroy['react-stack-bottom-frame'].bind(callDestroy) ;
const callLazyInit = {
  'react-stack-bottom-frame': function (lazy) {
    const payload = lazy._payload;
    const init = lazy._init;
    return init(payload);
  }
};
const callLazyInitInDEV = callLazyInit['react-stack-bottom-frame'].bind(callLazyInit) ;

let thenableState$1 = null;
let thenableIndexCounter$1 = 0;
let currentDebugInfo = null;

function pushDebugInfo(debugInfo) {

  const previousDebugInfo = currentDebugInfo;

  if (debugInfo == null) ; else if (previousDebugInfo === null) {
    currentDebugInfo = debugInfo;
  } else {
    currentDebugInfo = previousDebugInfo.concat(debugInfo);
  }

  return previousDebugInfo;
}

let didWarnAboutMaps;
let didWarnAboutGenerators;
let ownerHasKeyUseWarning;
let ownerHasFunctionTypeWarning;
let ownerHasSymbolTypeWarning;

let warnForMissingKey = (returnFiber, workInProgress, child) => {};

{
  didWarnAboutMaps = false;
  didWarnAboutGenerators = false;
  ownerHasKeyUseWarning = {};
  ownerHasFunctionTypeWarning = {};
  ownerHasSymbolTypeWarning = {};

  warnForMissingKey = (returnFiber, workInProgress, child) => {
    if (child === null || typeof child !== 'object') {
      return;
    }

    if (!child._store || (child._store.validated || child.key != null) && child._store.validated !== 2) {
      return;
    }

    if (typeof child._store !== 'object') {
      throw new Error('React Component in warnForMissingKey should have a _store. ' + 'This error is likely caused by a bug in React. Please file an issue.');
    }

    child._store.validated = 1;
    const componentName = getComponentNameFromFiber(returnFiber);
    const componentKey = componentName || 'null';

    if (ownerHasKeyUseWarning[componentKey]) {
      return;
    }

    ownerHasKeyUseWarning[componentKey] = true;
    const childOwner = child._owner;
    const parentOwner = returnFiber._debugOwner;
    let currentComponentErrorInfo = '';

    if (parentOwner && typeof parentOwner.tag === 'number') {
      const name = getComponentNameFromFiber(parentOwner);

      if (name) {
        currentComponentErrorInfo = '\n\nCheck the render method of `' + name + '`.';
      }
    }

    if (!currentComponentErrorInfo) {
      if (componentName) {
        currentComponentErrorInfo = `\n\nCheck the top-level render call using <${componentName}>.`;
      }
    }

    let childOwnerAppendix = '';

    if (childOwner != null && parentOwner !== childOwner) {
      let ownerName = null;

      if (typeof childOwner.tag === 'number') {
        ownerName = getComponentNameFromFiber(childOwner);
      } else if (typeof childOwner.name === 'string') {
        ownerName = childOwner.name;
      }

      if (ownerName) {
        childOwnerAppendix = ` It was passed a child from ${ownerName}.`;
      }
    }

    runWithFiberInDEV(workInProgress, () => {
      console.error('Each child in a list should have a unique "key" prop.' + '%s%s See https://react.dev/link/warning-keys for more information.', currentComponentErrorInfo, childOwnerAppendix);
    });
  };
}

function validateFragmentProps(element, fiber, returnFiber) {
  {
    const keys = Object.keys(element.props);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (key !== 'children' && key !== 'key') {
        if (fiber === null) {
          fiber = createFiberFromElement(element, returnFiber.mode, 0);

          {
            fiber._debugInfo = currentDebugInfo;
          }

          fiber.return = returnFiber;
        }

        runWithFiberInDEV(fiber, erroredKey => {
          console.error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', erroredKey);
        }, key);
        break;
      }
    }
  }
}

function unwrapThenable(thenable) {
  const index = thenableIndexCounter$1;
  thenableIndexCounter$1 += 1;

  if (thenableState$1 === null) {
    thenableState$1 = createThenableState();
  }

  return trackUsedThenable(thenableState$1, thenable, index);
}

function coerceRef(workInProgress, element) {
  const refProp = element.props.ref;
  workInProgress.ref = refProp !== undefined ? refProp : null;
}

function throwOnInvalidObjectType(returnFiber, newChild) {
  if (newChild.$$typeof === REACT_LEGACY_ELEMENT_TYPE) {
    throw new Error('A React Element from an older version of React was rendered. ' + 'This is not supported. It can happen if:\n' + '- Multiple copies of the "react" package is used.\n' + '- A library pre-bundled an old copy of "react" or "react/jsx-runtime".\n' + '- A compiler tries to "inline" JSX instead of using the runtime.');
  }

  const childString = Object.prototype.toString.call(newChild);
  throw new Error(`Objects are not valid as a React child (found: ${childString === '[object Object]' ? 'object with keys {' + Object.keys(newChild).join(', ') + '}' : childString}). ` + 'If you meant to render a collection of children, use an array ' + 'instead.');
}

function warnOnFunctionType(returnFiber, invalidChild) {
  {
    const parentName = getComponentNameFromFiber(returnFiber) || 'Component';

    if (ownerHasFunctionTypeWarning[parentName]) {
      return;
    }

    ownerHasFunctionTypeWarning[parentName] = true;
    const name = invalidChild.displayName || invalidChild.name || 'Component';

    if (returnFiber.tag === HostRoot) {
      console.error('Functions are not valid as a React child. This may happen if ' + 'you return %s instead of <%s /> from render. ' + 'Or maybe you meant to call this function rather than return it.\n' + '  root.render(%s)', name, name, name);
    } else {
      console.error('Functions are not valid as a React child. This may happen if ' + 'you return %s instead of <%s /> from render. ' + 'Or maybe you meant to call this function rather than return it.\n' + '  <%s>{%s}</%s>', name, name, parentName, name, parentName);
    }
  }
}

function warnOnSymbolType(returnFiber, invalidChild) {
  {
    const parentName = getComponentNameFromFiber(returnFiber) || 'Component';

    if (ownerHasSymbolTypeWarning[parentName]) {
      return;
    }

    ownerHasSymbolTypeWarning[parentName] = true;
    const name = String(invalidChild);

    if (returnFiber.tag === HostRoot) {
      console.error('Symbols are not valid as a React child.\n' + '  root.render(%s)', name);
    } else {
      console.error('Symbols are not valid as a React child.\n' + '  <%s>%s</%s>', parentName, name, parentName);
    }
  }
}

function resolveLazy(lazyType) {
  {
    return callLazyInitInDEV(lazyType);
  }
}

function createChildReconciler(shouldTrackSideEffects) {
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

  function mapRemainingChildren(currentFirstChild) {
    const existingChildren = new Map();
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

  function useFiber(fiber, pendingProps) {
    const clone = createWorkInProgress(fiber, pendingProps);
    clone.index = 0;
    clone.sibling = null;
    return clone;
  }

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
        newFiber.flags |= Placement | PlacementDEV;
        return lastPlacedIndex;
      } else {
        return oldIndex;
      }
    } else {
      newFiber.flags |= Placement | PlacementDEV;
      return lastPlacedIndex;
    }
  }

  function placeSingleChild(newFiber) {
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.flags |= Placement | PlacementDEV;
    }

    return newFiber;
  }

  function updateTextNode(returnFiber, current, textContent, lanes) {
    if (current === null || current.tag !== HostText) {
      const created = createFiberFromText(textContent, returnFiber.mode, lanes);
      created.return = returnFiber;

      {
        created._debugOwner = returnFiber;

        created._debugInfo = currentDebugInfo;
      }

      return created;
    } else {
      const existing = useFiber(current, textContent);
      existing.return = returnFiber;

      {
        existing._debugInfo = currentDebugInfo;
      }

      return existing;
    }
  }

  function updateElement(returnFiber, current, element, lanes) {
    const elementType = element.type;

    if (elementType === REACT_FRAGMENT_TYPE) {
      const updated = updateFragment(returnFiber, current, element.props.children, lanes, element.key);
      validateFragmentProps(element, updated, returnFiber);
      return updated;
    }

    if (current !== null) {
      if (current.elementType === elementType || (isCompatibleFamilyForHotReloading(current, element) ) || typeof elementType === 'object' && elementType !== null && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === current.type) {
        const existing = useFiber(current, element.props);
        coerceRef(existing, element);
        existing.return = returnFiber;

        {
          existing._debugOwner = element._owner;
          existing._debugInfo = currentDebugInfo;
        }

        return existing;
      }
    }

    const created = createFiberFromElement(element, returnFiber.mode, lanes);
    coerceRef(created, element);
    created.return = returnFiber;

    {
      created._debugInfo = currentDebugInfo;
    }

    return created;
  }

  function updatePortal(returnFiber, current, portal, lanes) {
    if (current === null || current.tag !== HostPortal || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation) {
      const created = createFiberFromPortal(portal, returnFiber.mode, lanes);
      created.return = returnFiber;

      {
        created._debugInfo = currentDebugInfo;
      }

      return created;
    } else {
      const existing = useFiber(current, portal.children || []);
      existing.return = returnFiber;

      {
        existing._debugInfo = currentDebugInfo;
      }

      return existing;
    }
  }

  function updateFragment(returnFiber, current, fragment, lanes, key) {
    if (current === null || current.tag !== Fragment) {
      const created = createFiberFromFragment(fragment, returnFiber.mode, lanes, key);
      created.return = returnFiber;

      {
        created._debugOwner = returnFiber;

        created._debugInfo = currentDebugInfo;
      }

      return created;
    } else {
      const existing = useFiber(current, fragment);
      existing.return = returnFiber;

      {
        existing._debugInfo = currentDebugInfo;
      }

      return existing;
    }
  }

  function createChild(returnFiber, newChild, lanes) {
    if (typeof newChild === 'string' && newChild !== '' || typeof newChild === 'number' || typeof newChild === 'bigint') {
      const created = createFiberFromText('' + newChild, returnFiber.mode, lanes);
      created.return = returnFiber;

      {
        created._debugOwner = returnFiber;

        created._debugInfo = currentDebugInfo;
      }

      return created;
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          {
            const created = createFiberFromElement(newChild, returnFiber.mode, lanes);
            coerceRef(created, newChild);
            created.return = returnFiber;

            {
              const prevDebugInfo = pushDebugInfo(newChild._debugInfo);
              created._debugInfo = currentDebugInfo;
              currentDebugInfo = prevDebugInfo;
            }

            return created;
          }

        case REACT_PORTAL_TYPE:
          {
            const created = createFiberFromPortal(newChild, returnFiber.mode, lanes);
            created.return = returnFiber;

            {
              created._debugInfo = currentDebugInfo;
            }

            return created;
          }

        case REACT_LAZY_TYPE:
          {
            const prevDebugInfo = pushDebugInfo(newChild._debugInfo);
            let resolvedChild;

            {
              resolvedChild = callLazyInitInDEV(newChild);
            }

            const created = createChild(returnFiber, resolvedChild, lanes);
            currentDebugInfo = prevDebugInfo;
            return created;
          }
      }

      if (isArray(newChild) || getIteratorFn(newChild) || enableAsyncIterableChildren ) {
        const created = createFiberFromFragment(newChild, returnFiber.mode, lanes, null);
        created.return = returnFiber;

        {
          created._debugOwner = returnFiber;

          const prevDebugInfo = pushDebugInfo(newChild._debugInfo);
          created._debugInfo = currentDebugInfo;
          currentDebugInfo = prevDebugInfo;
        }

        return created;
      }

      if (typeof newChild.then === 'function') {
        const thenable = newChild;
        const prevDebugInfo = pushDebugInfo(newChild._debugInfo);
        const created = createChild(returnFiber, unwrapThenable(thenable), lanes);
        currentDebugInfo = prevDebugInfo;
        return created;
      }

      if (newChild.$$typeof === REACT_CONTEXT_TYPE) {
        const context = newChild;
        return createChild(returnFiber, readContextDuringReconciliation(returnFiber, context), lanes);
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    {
      if (typeof newChild === 'function') {
        warnOnFunctionType(returnFiber, newChild);
      }

      if (typeof newChild === 'symbol') {
        warnOnSymbolType(returnFiber, newChild);
      }
    }

    return null;
  }

  function updateSlot(returnFiber, oldFiber, newChild, lanes) {
    const key = oldFiber !== null ? oldFiber.key : null;

    if (typeof newChild === 'string' && newChild !== '' || typeof newChild === 'number' || typeof newChild === 'bigint') {
      if (key !== null) {
        return null;
      }

      return updateTextNode(returnFiber, oldFiber, '' + newChild, lanes);
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          {
            if (newChild.key === key) {
              const prevDebugInfo = pushDebugInfo(newChild._debugInfo);
              const updated = updateElement(returnFiber, oldFiber, newChild, lanes);
              currentDebugInfo = prevDebugInfo;
              return updated;
            } else {
              return null;
            }
          }

        case REACT_PORTAL_TYPE:
          {
            if (newChild.key === key) {
              return updatePortal(returnFiber, oldFiber, newChild, lanes);
            } else {
              return null;
            }
          }

        case REACT_LAZY_TYPE:
          {
            const prevDebugInfo = pushDebugInfo(newChild._debugInfo);
            let resolvedChild;

            {
              resolvedChild = callLazyInitInDEV(newChild);
            }

            const updated = updateSlot(returnFiber, oldFiber, resolvedChild, lanes);
            currentDebugInfo = prevDebugInfo;
            return updated;
          }
      }

      if (isArray(newChild) || getIteratorFn(newChild) || enableAsyncIterableChildren ) {
        if (key !== null) {
          return null;
        }

        const prevDebugInfo = pushDebugInfo(newChild._debugInfo);
        const updated = updateFragment(returnFiber, oldFiber, newChild, lanes, null);
        currentDebugInfo = prevDebugInfo;
        return updated;
      }

      if (typeof newChild.then === 'function') {
        const thenable = newChild;
        const prevDebugInfo = pushDebugInfo(thenable._debugInfo);
        const updated = updateSlot(returnFiber, oldFiber, unwrapThenable(thenable), lanes);
        currentDebugInfo = prevDebugInfo;
        return updated;
      }

      if (newChild.$$typeof === REACT_CONTEXT_TYPE) {
        const context = newChild;
        return updateSlot(returnFiber, oldFiber, readContextDuringReconciliation(returnFiber, context), lanes);
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    {
      if (typeof newChild === 'function') {
        warnOnFunctionType(returnFiber, newChild);
      }

      if (typeof newChild === 'symbol') {
        warnOnSymbolType(returnFiber, newChild);
      }
    }

    return null;
  }

  function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
    if (typeof newChild === 'string' && newChild !== '' || typeof newChild === 'number' || typeof newChild === 'bigint') {
      const matchedFiber = existingChildren.get(newIdx) || null;
      return updateTextNode(returnFiber, matchedFiber, '' + newChild, lanes);
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          {
            const matchedFiber = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
            const prevDebugInfo = pushDebugInfo(newChild._debugInfo);
            const updated = updateElement(returnFiber, matchedFiber, newChild, lanes);
            currentDebugInfo = prevDebugInfo;
            return updated;
          }

        case REACT_PORTAL_TYPE:
          {
            const matchedFiber = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
            return updatePortal(returnFiber, matchedFiber, newChild, lanes);
          }

        case REACT_LAZY_TYPE:
          {
            const prevDebugInfo = pushDebugInfo(newChild._debugInfo);
            let resolvedChild;

            {
              resolvedChild = callLazyInitInDEV(newChild);
            }

            const updated = updateFromMap(existingChildren, returnFiber, newIdx, resolvedChild, lanes);
            currentDebugInfo = prevDebugInfo;
            return updated;
          }
      }

      if (isArray(newChild) || getIteratorFn(newChild) || enableAsyncIterableChildren ) {
        const matchedFiber = existingChildren.get(newIdx) || null;
        const prevDebugInfo = pushDebugInfo(newChild._debugInfo);
        const updated = updateFragment(returnFiber, matchedFiber, newChild, lanes, null);
        currentDebugInfo = prevDebugInfo;
        return updated;
      }

      if (typeof newChild.then === 'function') {
        const thenable = newChild;
        const prevDebugInfo = pushDebugInfo(thenable._debugInfo);
        const updated = updateFromMap(existingChildren, returnFiber, newIdx, unwrapThenable(thenable), lanes);
        currentDebugInfo = prevDebugInfo;
        return updated;
      }

      if (newChild.$$typeof === REACT_CONTEXT_TYPE) {
        const context = newChild;
        return updateFromMap(existingChildren, returnFiber, newIdx, readContextDuringReconciliation(returnFiber, context), lanes);
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    {
      if (typeof newChild === 'function') {
        warnOnFunctionType(returnFiber, newChild);
      }

      if (typeof newChild === 'symbol') {
        warnOnSymbolType(returnFiber, newChild);
      }
    }

    return null;
  }

  function warnOnInvalidKey(returnFiber, workInProgress, child, knownKeys) {
    {
      if (typeof child !== 'object' || child === null) {
        return knownKeys;
      }

      switch (child.$$typeof) {
        case REACT_ELEMENT_TYPE:
        case REACT_PORTAL_TYPE:
          warnForMissingKey(returnFiber, workInProgress, child);
          const key = child.key;

          if (typeof key !== 'string') {
            break;
          }

          if (knownKeys === null) {
            knownKeys = new Set();
            knownKeys.add(key);
            break;
          }

          if (!knownKeys.has(key)) {
            knownKeys.add(key);
            break;
          }

          runWithFiberInDEV(workInProgress, () => {
            console.error('Encountered two children with the same key, `%s`. ' + 'Keys should be unique so that components maintain their identity ' + 'across updates. Non-unique keys may cause children to be ' + 'duplicated and/or omitted — the behavior is unsupported and ' + 'could change in a future version.', key);
          });
          break;

        case REACT_LAZY_TYPE:
          {
            let resolvedChild;

            {
              resolvedChild = callLazyInitInDEV(child);
            }

            warnOnInvalidKey(returnFiber, workInProgress, resolvedChild, knownKeys);
            break;
          }
      }
    }

    return knownKeys;
  }

  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
    let knownKeys = null;
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

      {
        knownKeys = warnOnInvalidKey(returnFiber, newFiber, newChildren[newIdx], knownKeys);
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

        {
          knownKeys = warnOnInvalidKey(returnFiber, newFiber, newChildren[newIdx], knownKeys);
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

    const existingChildren = mapRemainingChildren(oldFiber);

    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], lanes);

      if (newFiber !== null) {
        {
          knownKeys = warnOnInvalidKey(returnFiber, newFiber, newChildren[newIdx], knownKeys);
        }

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
      existingChildren.forEach(child => deleteChild(returnFiber, child));
    }

    if (getIsHydrating()) {
      const numberOfForks = newIdx;
      pushTreeFork(returnFiber, numberOfForks);
    }

    return resultingFirstChild;
  }

  function reconcileChildrenIteratable(returnFiber, currentFirstChild, newChildrenIterable, lanes) {
    const iteratorFn = getIteratorFn(newChildrenIterable);

    if (typeof iteratorFn !== 'function') {
      throw new Error('An object is not an iterable. This error is likely caused by a bug in ' + 'React. Please file an issue.');
    }

    const newChildren = iteratorFn.call(newChildrenIterable);

    {
      if (newChildren === newChildrenIterable) {
        const isGeneratorComponent = returnFiber.tag === FunctionComponent && Object.prototype.toString.call(returnFiber.type) === '[object GeneratorFunction]' && Object.prototype.toString.call(newChildren) === '[object Generator]';

        if (!isGeneratorComponent) {
          if (!didWarnAboutGenerators) {
            console.error('Using Iterators as children is unsupported and will likely yield ' + 'unexpected results because enumerating a generator mutates it. ' + 'You may convert it to an array with `Array.from()` or the ' + '`[...spread]` operator before rendering. You can also use an ' + 'Iterable that can iterate multiple times over the same items.');
          }

          didWarnAboutGenerators = true;
        }
      } else if (newChildrenIterable.entries === iteratorFn) {
        if (!didWarnAboutMaps) {
          console.error('Using Maps as children is not supported. ' + 'Use an array of keyed ReactElements instead.');
          didWarnAboutMaps = true;
        }
      }
    }

    return reconcileChildrenIterator(returnFiber, currentFirstChild, newChildren, lanes);
  }

  function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildren, lanes) {
    if (newChildren == null) {
      throw new Error('An iterable object provided no iterator.');
    }

    let resultingFirstChild = null;
    let previousNewFiber = null;
    let oldFiber = currentFirstChild;
    let lastPlacedIndex = 0;
    let newIdx = 0;
    let nextOldFiber = null;
    let knownKeys = null;
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

      {
        knownKeys = warnOnInvalidKey(returnFiber, newFiber, step.value, knownKeys);
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

        {
          knownKeys = warnOnInvalidKey(returnFiber, newFiber, step.value, knownKeys);
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

    const existingChildren = mapRemainingChildren(oldFiber);

    for (; !step.done; newIdx++, step = newChildren.next()) {
      const newFiber = updateFromMap(existingChildren, returnFiber, newIdx, step.value, lanes);

      if (newFiber !== null) {
        {
          knownKeys = warnOnInvalidKey(returnFiber, newFiber, step.value, knownKeys);
        }

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
      existingChildren.forEach(child => deleteChild(returnFiber, child));
    }

    if (getIsHydrating()) {
      const numberOfForks = newIdx;
      pushTreeFork(returnFiber, numberOfForks);
    }

    return resultingFirstChild;
  }

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

    {
      created._debugOwner = returnFiber;

      created._debugInfo = currentDebugInfo;
    }

    return created;
  }

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

            {
              existing._debugOwner = element._owner;
              existing._debugInfo = currentDebugInfo;
            }

            validateFragmentProps(element, existing, returnFiber);
            return existing;
          }
        } else {
          if (child.elementType === elementType || (isCompatibleFamilyForHotReloading(child, element) ) || typeof elementType === 'object' && elementType !== null && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === child.type) {
            deleteRemainingChildren(returnFiber, child.sibling);
            const existing = useFiber(child, element.props);
            coerceRef(existing, element);
            existing.return = returnFiber;

            {
              existing._debugOwner = element._owner;
              existing._debugInfo = currentDebugInfo;
            }

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

      {
        created._debugOwner = returnFiber;

        created._debugInfo = currentDebugInfo;
      }

      validateFragmentProps(element, created, returnFiber);
      return created;
    } else {
      const created = createFiberFromElement(element, returnFiber.mode, lanes);
      coerceRef(created, element);
      created.return = returnFiber;

      {
        created._debugInfo = currentDebugInfo;
      }

      return created;
    }
  }

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

  function reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes) {
    const isUnkeyedTopLevelFragment = typeof newChild === 'object' && newChild !== null && newChild.type === REACT_FRAGMENT_TYPE && newChild.key === null;

    if (isUnkeyedTopLevelFragment) {
      validateFragmentProps(newChild, null, returnFiber);
      newChild = newChild.props.children;
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          {
            const prevDebugInfo = pushDebugInfo(newChild._debugInfo);
            const firstChild = placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, lanes));
            currentDebugInfo = prevDebugInfo;
            return firstChild;
          }

        case REACT_PORTAL_TYPE:
          return placeSingleChild(reconcileSinglePortal(returnFiber, currentFirstChild, newChild, lanes));

        case REACT_LAZY_TYPE:
          {
            const prevDebugInfo = pushDebugInfo(newChild._debugInfo);
            let result;

            {
              result = callLazyInitInDEV(newChild);
            }

            const firstChild = reconcileChildFibersImpl(returnFiber, currentFirstChild, result, lanes);
            currentDebugInfo = prevDebugInfo;
            return firstChild;
          }
      }

      if (isArray(newChild)) {
        const prevDebugInfo = pushDebugInfo(newChild._debugInfo);
        const firstChild = reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
        currentDebugInfo = prevDebugInfo;
        return firstChild;
      }

      if (getIteratorFn(newChild)) {
        const prevDebugInfo = pushDebugInfo(newChild._debugInfo);
        const firstChild = reconcileChildrenIteratable(returnFiber, currentFirstChild, newChild, lanes);
        currentDebugInfo = prevDebugInfo;
        return firstChild;
      }

      if (typeof newChild.then === 'function') {
        const thenable = newChild;
        const prevDebugInfo = pushDebugInfo(thenable._debugInfo);
        const firstChild = reconcileChildFibersImpl(returnFiber, currentFirstChild, unwrapThenable(thenable), lanes);
        currentDebugInfo = prevDebugInfo;
        return firstChild;
      }

      if (newChild.$$typeof === REACT_CONTEXT_TYPE) {
        const context = newChild;
        return reconcileChildFibersImpl(returnFiber, currentFirstChild, readContextDuringReconciliation(returnFiber, context), lanes);
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    if (typeof newChild === 'string' && newChild !== '' || typeof newChild === 'number' || typeof newChild === 'bigint') {
      return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, '' + newChild, lanes));
    }

    {
      if (typeof newChild === 'function') {
        warnOnFunctionType(returnFiber, newChild);
      }

      if (typeof newChild === 'symbol') {
        warnOnSymbolType(returnFiber, newChild);
      }
    }

    return deleteRemainingChildren(returnFiber, currentFirstChild);
  }

  function reconcileChildFibers(returnFiber, currentFirstChild, newChild, lanes) {
    const prevDebugInfo = currentDebugInfo;
    currentDebugInfo = null;

    try {
      thenableIndexCounter$1 = 0;
      const firstChildFiber = reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes);
      thenableState$1 = null;
      return firstChildFiber;
    } catch (x) {
      if (x === SuspenseException || !disableLegacyMode    ) {
        throw x;
      }

      const throwFiber = createFiberFromThrow(x, returnFiber.mode, lanes);
      throwFiber.return = returnFiber;

      {
        const debugInfo = throwFiber._debugInfo = currentDebugInfo;
        throwFiber._debugOwner = returnFiber._debugOwner;

        if (debugInfo != null) {
          for (let i = debugInfo.length - 1; i >= 0; i--) {
            if (typeof debugInfo[i].stack === 'string') {
              throwFiber._debugOwner = debugInfo[i];

              break;
            }
          }
        }
      }

      return throwFiber;
    } finally {
      currentDebugInfo = prevDebugInfo;
    }
  }

  return reconcileChildFibers;
}

const reconcileChildFibers = createChildReconciler(true);
const mountChildFibers = createChildReconciler(false);
function resetChildReconcilerOnUnwind() {
  thenableState$1 = null;
  thenableIndexCounter$1 = 0;
}
function cloneChildFibers(current, workInProgress) {
  if (current !== null && workInProgress.child !== current.child) {
    throw new Error('Resuming work not yet implemented.');
  }

  if (workInProgress.child === null) {
    return;
  }

  let currentChild = workInProgress.child;
  let newChild = createWorkInProgress(currentChild, currentChild.pendingProps);
  workInProgress.child = newChild;
  newChild.return = workInProgress;

  while (currentChild.sibling !== null) {
    currentChild = currentChild.sibling;
    newChild = newChild.sibling = createWorkInProgress(currentChild, currentChild.pendingProps);
    newChild.return = workInProgress;
  }

  newChild.sibling = null;
}
function resetChildFibers(workInProgress, lanes) {
  let child = workInProgress.child;

  while (child !== null) {
    resetWorkInProgress(child, lanes);
    child = child.sibling;
  }
}

const currentTreeHiddenStackCursor = createCursor(null);
const prevEntangledRenderLanesCursor = createCursor(NoLanes);
function pushHiddenContext(fiber, context) {
  const prevEntangledRenderLanes = getEntangledRenderLanes();
  push(prevEntangledRenderLanesCursor, prevEntangledRenderLanes, fiber);
  push(currentTreeHiddenStackCursor, context, fiber);
  setEntangledRenderLanes(mergeLanes(prevEntangledRenderLanes, context.baseLanes));
}
function reuseHiddenContextOnStack(fiber) {
  push(prevEntangledRenderLanesCursor, getEntangledRenderLanes(), fiber);
  push(currentTreeHiddenStackCursor, currentTreeHiddenStackCursor.current, fiber);
}
function popHiddenContext(fiber) {
  setEntangledRenderLanes(prevEntangledRenderLanesCursor.current);
  pop(currentTreeHiddenStackCursor, fiber);
  pop(prevEntangledRenderLanesCursor, fiber);
}
function isCurrentTreeHidden() {
  return currentTreeHiddenStackCursor.current !== null;
}

const suspenseHandlerStackCursor = createCursor(null);
let shellBoundary = null;
function getShellBoundary() {
  return shellBoundary;
}
function pushPrimaryTreeSuspenseHandler(handler) {
  const current = handler.alternate;
  pushSuspenseListContext(handler, setDefaultShallowSuspenseListContext(suspenseStackCursor.current));

  push(suspenseHandlerStackCursor, handler, handler);

  if (shellBoundary === null) {
    if (current === null || isCurrentTreeHidden()) {
      shellBoundary = handler;
    } else {
      const prevState = current.memoizedState;

      if (prevState !== null) {
        shellBoundary = handler;
      }
    }
  }
}
function pushFallbackTreeSuspenseHandler(fiber) {
  reuseSuspenseHandlerOnStack(fiber);
}
function pushOffscreenSuspenseHandler(fiber) {
  if (fiber.tag === OffscreenComponent) {
    pushSuspenseListContext(fiber, suspenseStackCursor.current);
    push(suspenseHandlerStackCursor, fiber, fiber);

    if (shellBoundary !== null) ; else {
      const current = fiber.alternate;

      if (current !== null) {
        const prevState = current.memoizedState;

        if (prevState !== null) {
          shellBoundary = fiber;
        }
      }
    }
  } else {
    reuseSuspenseHandlerOnStack(fiber);
  }
}
function reuseSuspenseHandlerOnStack(fiber) {
  pushSuspenseListContext(fiber, suspenseStackCursor.current);
  push(suspenseHandlerStackCursor, getSuspenseHandler(), fiber);
}
function getSuspenseHandler() {
  return suspenseHandlerStackCursor.current;
}
function popSuspenseHandler(fiber) {
  pop(suspenseHandlerStackCursor, fiber);

  if (shellBoundary === fiber) {
    shellBoundary = null;
  }

  popSuspenseListContext(fiber);
}
const DefaultSuspenseContext = 0b00;
const SubtreeSuspenseContextMask = 0b01;
const ForceSuspenseFallback = 0b10;
const suspenseStackCursor = createCursor(DefaultSuspenseContext);
function hasSuspenseListContext(parentContext, flag) {
  return (parentContext & flag) !== 0;
}
function setDefaultShallowSuspenseListContext(parentContext) {
  return parentContext & SubtreeSuspenseContextMask;
}
function setShallowSuspenseListContext(parentContext, shallowContext) {
  return parentContext & SubtreeSuspenseContextMask | shallowContext;
}
function pushSuspenseListContext(fiber, newContext) {
  push(suspenseStackCursor, newContext, fiber);
}
function popSuspenseListContext(fiber) {
  pop(suspenseStackCursor, fiber);
}

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
    } else if (node.tag === SuspenseListComponent && node.memoizedProps.revealOrder !== undefined) {
      const didSuspend = (node.flags & DidCapture) !== NoFlags$1;

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

const NoFlags = 0b0000;
const HasEffect = 0b0001;
const Insertion = 0b0010;
const Layout = 0b0100;
const Passive = 0b1000;

const AbortControllerLocal = typeof AbortController !== 'undefined' ? AbortController : function AbortControllerShim() {
  const listeners = [];
  const signal = this.signal = {
    aborted: false,
    addEventListener: (type, listener) => {
      listeners.push(listener);
    }
  };

  this.abort = () => {
    signal.aborted = true;
    listeners.forEach(listener => listener());
  };
} ;
const {
  unstable_scheduleCallback: scheduleCallback$2,
  unstable_NormalPriority: NormalPriority
} = Scheduler;
const CacheContext = {
  $$typeof: REACT_CONTEXT_TYPE,
  Consumer: null,
  Provider: null,
  _currentValue: null,
  _currentValue2: null,
  _threadCount: 0
} ;

{
  CacheContext._currentRenderer = null;
  CacheContext._currentRenderer2 = null;
}

function createCache() {

  const cache = {
    controller: new AbortControllerLocal(),
    data: new Map(),
    refCount: 0
  };
  return cache;
}
function retainCache(cache) {

  {
    if (cache.controller.signal.aborted) {
      console.warn('A cache instance was retained after it was already freed. ' + 'This likely indicates a bug in React.');
    }
  }

  cache.refCount++;
}
function releaseCache(cache) {

  cache.refCount--;

  {
    if (cache.refCount < 0) {
      console.warn('A cache instance was released after it was already freed. ' + 'This likely indicates a bug in React.');
    }
  }

  if (cache.refCount === 0) {
    scheduleCallback$2(NormalPriority, () => {
      cache.controller.abort();
    });
  }
}
function pushCacheProvider(workInProgress, cache) {

  pushProvider(workInProgress, CacheContext, cache);
}
function popCacheProvider(workInProgress, cache) {

  popProvider(CacheContext, workInProgress);
}

let currentEntangledListeners = null;
let currentEntangledPendingCount = 0;
let currentEntangledLane = NoLane;
let currentEntangledActionThenable = null;
function entangleAsyncAction(transition, thenable) {
  if (currentEntangledListeners === null) {
    const entangledListeners = currentEntangledListeners = [];
    currentEntangledPendingCount = 0;
    currentEntangledLane = requestTransitionLane();
    const entangledThenable = {
      status: 'pending',
      value: undefined,

      then(resolve) {
        entangledListeners.push(resolve);
      }

    };
    currentEntangledActionThenable = entangledThenable;
  }

  currentEntangledPendingCount++;
  thenable.then(pingEngtangledActionScope, pingEngtangledActionScope);
  return thenable;
}

function pingEngtangledActionScope() {
  if (--currentEntangledPendingCount === 0) {

    if (currentEntangledListeners !== null) {
      if (currentEntangledActionThenable !== null) {
        const fulfilledThenable = currentEntangledActionThenable;
        fulfilledThenable.status = 'fulfilled';
      }

      const listeners = currentEntangledListeners;
      currentEntangledListeners = null;
      currentEntangledLane = NoLane;
      currentEntangledActionThenable = null;

      for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i];
        listener();
      }
    }
  }
}

function chainThenableValue(thenable, result) {
  const listeners = [];
  const thenableWithOverride = {
    status: 'pending',
    value: null,
    reason: null,

    then(resolve) {
      listeners.push(resolve);
    }

  };
  thenable.then(value => {
    const fulfilledThenable = thenableWithOverride;
    fulfilledThenable.status = 'fulfilled';
    fulfilledThenable.value = result;

    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener(result);
    }
  }, error => {
    const rejectedThenable = thenableWithOverride;
    rejectedThenable.status = 'rejected';
    rejectedThenable.reason = error;

    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener(undefined);
    }
  });
  return thenableWithOverride;
}
function peekEntangledActionLane() {
  return currentEntangledLane;
}
function peekEntangledActionThenable() {
  return currentEntangledActionThenable;
}

const prevOnStartTransitionFinish = ReactSharedInternals.S;

ReactSharedInternals.S = function onStartTransitionFinishForReconciler(transition, returnValue) {
  if (typeof returnValue === 'object' && returnValue !== null && typeof returnValue.then === 'function') {
    const thenable = returnValue;
    entangleAsyncAction(transition, thenable);
  }

  if (prevOnStartTransitionFinish !== null) {
    prevOnStartTransitionFinish(transition, returnValue);
  }
};

function requestCurrentTransition() {
  return ReactSharedInternals.T;
}
const resumedCache = createCursor(null);

function peekCacheFromPool() {

  const cacheResumedFromPreviousRender = resumedCache.current;

  if (cacheResumedFromPreviousRender !== null) {
    return cacheResumedFromPreviousRender;
  }

  const root = getWorkInProgressRoot();
  const cacheFromRootCachePool = root.pooledCache;
  return cacheFromRootCachePool;
}

function requestCacheFromPool(renderLanes) {
  const cacheFromPool = peekCacheFromPool();

  if (cacheFromPool !== null) {
    return cacheFromPool;
  }

  const root = getWorkInProgressRoot();
  const freshCache = createCache();
  root.pooledCache = freshCache;
  retainCache(freshCache);

  if (freshCache !== null) {
    root.pooledCacheLanes |= renderLanes;
  }

  return freshCache;
}
function pushTransition(offscreenWorkInProgress, prevCachePool, newTransitions) {
  {
    if (prevCachePool === null) {
      push(resumedCache, resumedCache.current, offscreenWorkInProgress);
    } else {
      push(resumedCache, prevCachePool.pool, offscreenWorkInProgress);
    }
  }
}
function popTransition(workInProgress, current) {
  if (current !== null) {

    {
      pop(resumedCache, workInProgress);
    }
  }
}
function getSuspendedCache() {

  const cacheFromPool = peekCacheFromPool();

  if (cacheFromPool === null) {
    return null;
  }

  return {
    parent: CacheContext._currentValue ,
    pool: cacheFromPool
  };
}
function getOffscreenDeferredCache() {

  const cacheFromPool = peekCacheFromPool();

  if (cacheFromPool === null) {
    return null;
  }

  return {
    parent: CacheContext._currentValue ,
    pool: cacheFromPool
  };
}

let didWarnAboutMismatchedHooksForComponent;
let didWarnUncachedGetSnapshot;
let didWarnAboutUseWrappedInTryCatch;
let didWarnAboutAsyncClientComponent;
let didWarnAboutUseFormState;

{
  didWarnAboutMismatchedHooksForComponent = new Set();
  didWarnAboutUseWrappedInTryCatch = new Set();
  didWarnAboutAsyncClientComponent = new Set();
  didWarnAboutUseFormState = new Set();
}

let renderLanes = NoLanes;
let currentlyRenderingFiber$1 = null;
let currentHook = null;
let workInProgressHook = null;
let didScheduleRenderPhaseUpdate = false;
let didScheduleRenderPhaseUpdateDuringThisPass = false;
let shouldDoubleInvokeUserFnsInHooksDEV = false;
let localIdCounter = 0;
let thenableIndexCounter = 0;
let thenableState = null;
let globalClientIdCounter = 0;
const RE_RENDER_LIMIT = 25;
let currentHookNameInDev = null;
let hookTypesDev = null;
let hookTypesUpdateIndexDev = -1;
let ignorePreviousDependencies = false;

function mountHookTypesDev() {
  {
    const hookName = currentHookNameInDev;

    if (hookTypesDev === null) {
      hookTypesDev = [hookName];
    } else {
      hookTypesDev.push(hookName);
    }
  }
}

function updateHookTypesDev() {
  {
    const hookName = currentHookNameInDev;

    if (hookTypesDev !== null) {
      hookTypesUpdateIndexDev++;

      if (hookTypesDev[hookTypesUpdateIndexDev] !== hookName) {
        warnOnHookMismatchInDev(hookName);
      }
    }
  }
}

function checkDepsAreArrayDev(deps) {
  {
    if (deps !== undefined && deps !== null && !isArray(deps)) {
      console.error('%s received a final argument that is not an array (instead, received `%s`). When ' + 'specified, the final argument must be an array.', currentHookNameInDev, typeof deps);
    }
  }
}

function warnOnHookMismatchInDev(currentHookName) {
  {
    const componentName = getComponentNameFromFiber(currentlyRenderingFiber$1);

    if (!didWarnAboutMismatchedHooksForComponent.has(componentName)) {
      didWarnAboutMismatchedHooksForComponent.add(componentName);

      if (hookTypesDev !== null) {
        let table = '';
        const secondColumnStart = 30;

        for (let i = 0; i <= hookTypesUpdateIndexDev; i++) {
          const oldHookName = hookTypesDev[i];
          const newHookName = i === hookTypesUpdateIndexDev ? currentHookName : oldHookName;
          let row = `${i + 1}. ${oldHookName}`;

          while (row.length < secondColumnStart) {
            row += ' ';
          }

          row += newHookName + '\n';
          table += row;
        }

        console.error('React has detected a change in the order of Hooks called by %s. ' + 'This will lead to bugs and errors if not fixed. ' + 'For more information, read the Rules of Hooks: https://react.dev/link/rules-of-hooks\n\n' + '   Previous render            Next render\n' + '   ------------------------------------------------------\n' + '%s' + '   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n', componentName, table);
      }
    }
  }
}

function warnOnUseFormStateInDev() {
  {
    const componentName = getComponentNameFromFiber(currentlyRenderingFiber$1);

    if (!didWarnAboutUseFormState.has(componentName)) {
      didWarnAboutUseFormState.add(componentName);
      console.error('ReactDOM.useFormState has been renamed to React.useActionState. ' + 'Please update %s to use React.useActionState.', componentName);
    }
  }
}

function warnIfAsyncClientComponent(Component) {
  {
    const isAsyncFunction = Object.prototype.toString.call(Component) === '[object AsyncFunction]' || Object.prototype.toString.call(Component) === '[object AsyncGeneratorFunction]';

    if (isAsyncFunction) {
      const componentName = getComponentNameFromFiber(currentlyRenderingFiber$1);

      if (!didWarnAboutAsyncClientComponent.has(componentName)) {
        didWarnAboutAsyncClientComponent.add(componentName);
        console.error('async/await is not yet supported in Client Components, only ' + 'Server Components. This error is often caused by accidentally ' + "adding `'use client'` to a module that was originally written " + 'for the server.');
      }
    }
  }
}

function throwInvalidHookError() {
  throw new Error('Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' + ' one of the following reasons:\n' + '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' + '2. You might be breaking the Rules of Hooks\n' + '3. You might have more than one copy of React in the same app\n' + 'See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.');
}

function areHookInputsEqual(nextDeps, prevDeps) {
  {
    if (ignorePreviousDependencies) {
      return false;
    }
  }

  if (prevDeps === null) {
    {
      console.error('%s received a final argument during this render, but not during ' + 'the previous render. Even though the final argument is optional, ' + 'its type cannot change between renders.', currentHookNameInDev);
    }

    return false;
  }

  {
    if (nextDeps.length !== prevDeps.length) {
      console.error('The final argument passed to %s changed size between renders. The ' + 'order and size of this array must remain constant.\n\n' + 'Previous: %s\n' + 'Incoming: %s', currentHookNameInDev, `[${prevDeps.join(', ')}]`, `[${nextDeps.join(', ')}]`);
    }
  }

  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (objectIs(nextDeps[i], prevDeps[i])) {
      continue;
    }

    return false;
  }

  return true;
}

function renderWithHooks(current, workInProgress, Component, props, secondArg, nextRenderLanes) {
  renderLanes = nextRenderLanes;
  currentlyRenderingFiber$1 = workInProgress;

  {
    hookTypesDev = current !== null ? current._debugHookTypes : null;
    hookTypesUpdateIndexDev = -1;
    ignorePreviousDependencies = current !== null && current.type !== workInProgress.type;
    warnIfAsyncClientComponent(Component);
  }

  workInProgress.memoizedState = null;
  workInProgress.updateQueue = null;
  workInProgress.lanes = NoLanes;

  {
    if (current !== null && current.memoizedState !== null) {
      ReactSharedInternals.H = HooksDispatcherOnUpdateInDEV;
    } else if (hookTypesDev !== null) {
      ReactSharedInternals.H = HooksDispatcherOnMountWithHookTypesInDEV;
    } else {
      ReactSharedInternals.H = HooksDispatcherOnMountInDEV;
    }
  }

  const shouldDoubleRenderDEV = (workInProgress.mode & StrictLegacyMode) !== NoMode;
  shouldDoubleInvokeUserFnsInHooksDEV = shouldDoubleRenderDEV;
  let children = callComponentInDEV(Component, props, secondArg) ;
  shouldDoubleInvokeUserFnsInHooksDEV = false;

  if (didScheduleRenderPhaseUpdateDuringThisPass) {
    children = renderWithHooksAgain(workInProgress, Component, props, secondArg);
  }

  if (shouldDoubleRenderDEV) {
    setIsStrictModeForDevtools(true);

    try {
      children = renderWithHooksAgain(workInProgress, Component, props, secondArg);
    } finally {
      setIsStrictModeForDevtools(false);
    }
  }

  finishRenderingHooks(current, workInProgress);
  return children;
}

function finishRenderingHooks(current, workInProgress, Component) {
  {
    workInProgress._debugHookTypes = hookTypesDev;

    if (workInProgress.dependencies === null) {
      if (thenableState !== null) {
        workInProgress.dependencies = {
          lanes: NoLanes,
          firstContext: null,
          _debugThenableState: thenableState
        };
      }
    } else {
      workInProgress.dependencies._debugThenableState = thenableState;
    }
  }

  ReactSharedInternals.H = ContextOnlyDispatcher;
  const didRenderTooFewHooks = currentHook !== null && currentHook.next !== null;
  renderLanes = NoLanes;
  currentlyRenderingFiber$1 = null;
  currentHook = null;
  workInProgressHook = null;

  {
    currentHookNameInDev = null;
    hookTypesDev = null;
    hookTypesUpdateIndexDev = -1;

    if (current !== null && (current.flags & StaticMask) !== (workInProgress.flags & StaticMask) && (disableLegacyMode )) {
      console.error('Internal React error: Expected static flag was missing. Please ' + 'notify the React team.');
    }
  }

  didScheduleRenderPhaseUpdate = false;
  thenableIndexCounter = 0;
  thenableState = null;

  if (didRenderTooFewHooks) {
    throw new Error('Rendered fewer hooks than expected. This may be caused by an accidental ' + 'early return statement.');
  }

  {
    if (current !== null) {
      if (!checkIfWorkInProgressReceivedUpdate()) {
        const currentDependencies = current.dependencies;

        if (currentDependencies !== null && checkIfContextChanged(currentDependencies)) {
          markWorkInProgressReceivedUpdate();
        }
      }
    }
  }

  {
    if (checkIfUseWrappedInTryCatch()) {
      const componentName = getComponentNameFromFiber(workInProgress) || 'Unknown';

      if (!didWarnAboutUseWrappedInTryCatch.has(componentName) && !didWarnAboutAsyncClientComponent.has(componentName)) {
        didWarnAboutUseWrappedInTryCatch.add(componentName);
        console.error('`use` was called from inside a try/catch block. This is not allowed ' + 'and can lead to unexpected behavior. To handle errors triggered ' + 'by `use`, wrap your component in a error boundary.');
      }
    }
  }
}

function replaySuspendedComponentWithHooks(current, workInProgress, Component, props, secondArg) {
  {
    hookTypesUpdateIndexDev = -1;
    ignorePreviousDependencies = current !== null && current.type !== workInProgress.type;
  }

  workInProgress.updateQueue = null;
  const children = renderWithHooksAgain(workInProgress, Component, props, secondArg);
  finishRenderingHooks(current, workInProgress);
  return children;
}

function renderWithHooksAgain(workInProgress, Component, props, secondArg) {
  currentlyRenderingFiber$1 = workInProgress;
  let numberOfReRenders = 0;
  let children;

  do {
    if (didScheduleRenderPhaseUpdateDuringThisPass) {
      thenableState = null;
    }

    thenableIndexCounter = 0;
    didScheduleRenderPhaseUpdateDuringThisPass = false;

    if (numberOfReRenders >= RE_RENDER_LIMIT) {
      throw new Error('Too many re-renders. React limits the number of renders to prevent ' + 'an infinite loop.');
    }

    numberOfReRenders += 1;

    {
      ignorePreviousDependencies = false;
    }

    currentHook = null;
    workInProgressHook = null;

    if (workInProgress.updateQueue != null) {
      resetFunctionComponentUpdateQueue(workInProgress.updateQueue);
    }

    {
      hookTypesUpdateIndexDev = -1;
    }

    ReactSharedInternals.H = HooksDispatcherOnRerenderInDEV ;
    children = callComponentInDEV(Component, props, secondArg) ;
  } while (didScheduleRenderPhaseUpdateDuringThisPass);

  return children;
}

function renderTransitionAwareHostComponentWithHooks(current, workInProgress, lanes) {

  return renderWithHooks(current, workInProgress, TransitionAwareHostComponent, null, null, lanes);
}
function TransitionAwareHostComponent() {

  const dispatcher = ReactSharedInternals.H;
  const [maybeThenable] = dispatcher.useState();
  let nextState;

  if (typeof maybeThenable.then === 'function') {
    const thenable = maybeThenable;
    nextState = useThenable(thenable);
  } else {
    const status = maybeThenable;
    nextState = status;
  }

  const [nextResetState] = dispatcher.useState();
  const prevResetState = currentHook !== null ? currentHook.memoizedState : null;

  if (prevResetState !== nextResetState) {
    currentlyRenderingFiber$1.flags |= FormReset;
  }

  return nextState;
}
function checkDidRenderIdHook() {
  const didRenderIdHook = localIdCounter !== 0;
  localIdCounter = 0;
  return didRenderIdHook;
}
function bailoutHooks(current, workInProgress, lanes) {
  workInProgress.updateQueue = current.updateQueue;

  if ((workInProgress.mode & StrictEffectsMode) !== NoMode) {
    workInProgress.flags &= ~(MountPassiveDev | MountLayoutDev | Passive$1 | Update);
  } else {
    workInProgress.flags &= ~(Passive$1 | Update);
  }

  current.lanes = removeLanes(current.lanes, lanes);
}
function resetHooksAfterThrow() {
  currentlyRenderingFiber$1 = null;
  ReactSharedInternals.H = ContextOnlyDispatcher;
}
function resetHooksOnUnwind(workInProgress) {
  if (didScheduleRenderPhaseUpdate) {
    let hook = workInProgress.memoizedState;

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

  {
    hookTypesDev = null;
    hookTypesUpdateIndexDev = -1;
    currentHookNameInDev = null;
  }

  didScheduleRenderPhaseUpdateDuringThisPass = false;
  localIdCounter = 0;
  thenableIndexCounter = 0;
  thenableState = null;
}

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
      const currentFiber = currentlyRenderingFiber$1.alternate;

      if (currentFiber === null) {
        throw new Error('Update hook called on initial render. This is likely a bug in React. Please file an issue.');
      } else {
        throw new Error('Rendered more hooks than during the previous render.');
      }
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

let createFunctionComponentUpdateQueue;

{
  createFunctionComponentUpdateQueue = () => {
    return {
      lastEffect: null,
      events: null,
      stores: null,
      memoCache: null
    };
  };
}

function resetFunctionComponentUpdateQueue(updateQueue) {
  updateQueue.lastEffect = null;
  updateQueue.events = null;
  updateQueue.stores = null;

  {
    if (updateQueue.memoCache != null) {
      updateQueue.memoCache.index = 0;
    }
  }
}

function useThenable(thenable) {
  const index = thenableIndexCounter;
  thenableIndexCounter += 1;

  if (thenableState === null) {
    thenableState = createThenableState();
  }

  const result = trackUsedThenable(thenableState, thenable, index);
  const workInProgressFiber = currentlyRenderingFiber$1;
  const nextWorkInProgressHook = workInProgressHook === null ? workInProgressFiber.memoizedState : workInProgressHook.next;

  if (nextWorkInProgressHook !== null) ; else {
    const currentFiber = workInProgressFiber.alternate;

    {
      if (currentFiber !== null && currentFiber.memoizedState !== null) {
        ReactSharedInternals.H = HooksDispatcherOnUpdateInDEV;
      } else {
        ReactSharedInternals.H = HooksDispatcherOnMountInDEV;
      }
    }
  }

  return result;
}

function use(usable) {
  if (usable !== null && typeof usable === 'object') {
    if (typeof usable.then === 'function') {
      const thenable = usable;
      return useThenable(thenable);
    } else if (usable.$$typeof === REACT_CONTEXT_TYPE) {
      const context = usable;
      return readContext(context);
    }
  }

  throw new Error('An unsupported type was passed to use(): ' + String(usable));
}

function useMemoCache(size) {
  let memoCache = null;
  let updateQueue = currentlyRenderingFiber$1.updateQueue;

  if (updateQueue !== null) {
    memoCache = updateQueue.memoCache;
  }

  if (memoCache == null) {
    const current = currentlyRenderingFiber$1.alternate;

    if (current !== null) {
      const currentUpdateQueue = current.updateQueue;

      if (currentUpdateQueue !== null) {
        const currentMemoCache = currentUpdateQueue.memoCache;

        if (currentMemoCache != null) {
          memoCache = {
            data: currentMemoCache.data.map(array => array.slice()),
            index: 0
          };
        }
      }
    }
  }

  if (memoCache == null) {
    memoCache = {
      data: [],
      index: 0
    };
  }

  if (updateQueue === null) {
    updateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber$1.updateQueue = updateQueue;
  }

  updateQueue.memoCache = memoCache;
  let data = memoCache.data[memoCache.index];

  if (data === undefined || ignorePreviousDependencies) {
    data = memoCache.data[memoCache.index] = new Array(size);

    for (let i = 0; i < size; i++) {
      data[i] = REACT_MEMO_CACHE_SENTINEL;
    }
  } else if (data.length !== size) {
    {
      console.error('Expected a constant size argument for each invocation of useMemoCache. ' + 'The previous cache was allocated with size %s but size %s was requested.', data.length, size);
    }
  }

  memoCache.index++;
  return data;
}

function basicStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action;
}

function mountReducer(reducer, initialArg, init) {
  const hook = mountWorkInProgressHook();
  let initialState;

  if (init !== undefined) {
    initialState = init(initialArg);

    if (shouldDoubleInvokeUserFnsInHooksDEV) {
      setIsStrictModeForDevtools(true);

      try {
        init(initialArg);
      } finally {
        setIsStrictModeForDevtools(false);
      }
    }
  } else {
    initialState = initialArg;
  }

  hook.memoizedState = hook.baseState = initialState;
  const queue = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: initialState
  };
  hook.queue = queue;
  const dispatch = queue.dispatch = dispatchReducerAction.bind(null, currentlyRenderingFiber$1, queue);
  return [hook.memoizedState, dispatch];
}

function updateReducer(reducer, initialArg, init) {
  const hook = updateWorkInProgressHook();
  return updateReducerImpl(hook, currentHook, reducer);
}

function updateReducerImpl(hook, current, reducer) {
  const queue = hook.queue;

  if (queue === null) {
    throw new Error('Should have a queue. You are likely calling Hooks conditionally, ' + 'which is not allowed. (https://react.dev/link/invalid-hook-call)');
  }

  queue.lastRenderedReducer = reducer;
  let baseQueue = hook.baseQueue;
  const pendingQueue = queue.pending;

  if (pendingQueue !== null) {
    if (baseQueue !== null) {
      const baseFirst = baseQueue.next;
      const pendingFirst = pendingQueue.next;
      baseQueue.next = pendingFirst;
      pendingQueue.next = baseFirst;
    }

    {
      if (current.baseQueue !== baseQueue) {
        console.error('Internal error: Expected work-in-progress queue to be a clone. ' + 'This is a bug in React.');
      }
    }

    current.baseQueue = baseQueue = pendingQueue;
    queue.pending = null;
  }

  const baseState = hook.baseState;

  if (baseQueue === null) {
    hook.memoizedState = baseState;
  } else {
    const first = baseQueue.next;
    let newState = baseState;
    let newBaseState = null;
    let newBaseQueueFirst = null;
    let newBaseQueueLast = null;
    let update = first;
    let didReadFromEntangledAsyncAction = false;

    do {
      const updateLane = removeLanes(update.lane, OffscreenLane);
      const isHiddenUpdate = updateLane !== update.lane;
      const shouldSkipUpdate = isHiddenUpdate ? !isSubsetOfLanes(getWorkInProgressRootRenderLanes(), updateLane) : !isSubsetOfLanes(renderLanes, updateLane);

      if (shouldSkipUpdate) {
        const clone = {
          lane: updateLane,
          revertLane: update.revertLane,
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
        const revertLane = update.revertLane;

        if (revertLane === NoLane) {
          if (newBaseQueueLast !== null) {
            const clone = {
              lane: NoLane,
              revertLane: NoLane,
              action: update.action,
              hasEagerState: update.hasEagerState,
              eagerState: update.eagerState,
              next: null
            };
            newBaseQueueLast = newBaseQueueLast.next = clone;
          }

          if (updateLane === peekEntangledActionLane()) {
            didReadFromEntangledAsyncAction = true;
          }
        } else {
          if (isSubsetOfLanes(renderLanes, revertLane)) {
            update = update.next;

            if (revertLane === peekEntangledActionLane()) {
              didReadFromEntangledAsyncAction = true;
            }

            continue;
          } else {
            const clone = {
              lane: NoLane,
              revertLane: update.revertLane,
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

            currentlyRenderingFiber$1.lanes = mergeLanes(currentlyRenderingFiber$1.lanes, revertLane);
            markSkippedUpdateLanes(revertLane);
          }
        }

        const action = update.action;

        if (shouldDoubleInvokeUserFnsInHooksDEV) {
          reducer(newState, action);
        }

        if (update.hasEagerState) {
          newState = update.eagerState;
        } else {
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

      if (didReadFromEntangledAsyncAction) {
        const entangledActionThenable = peekEntangledActionThenable();

        if (entangledActionThenable !== null) {
          throw entangledActionThenable;
        }
      }
    }

    hook.memoizedState = newState;
    hook.baseState = newBaseState;
    hook.baseQueue = newBaseQueueLast;
    queue.lastRenderedState = newState;
  }

  if (baseQueue === null) {
    queue.lanes = NoLanes;
  }

  const dispatch = queue.dispatch;
  return [hook.memoizedState, dispatch];
}

function rerenderReducer(reducer, initialArg, init) {
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;

  if (queue === null) {
    throw new Error('Should have a queue. You are likely calling Hooks conditionally, ' + 'which is not allowed. (https://react.dev/link/invalid-hook-call)');
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

function mountSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
  const fiber = currentlyRenderingFiber$1;
  const hook = mountWorkInProgressHook();
  let nextSnapshot;
  const isHydrating = getIsHydrating();

  if (isHydrating) {
    if (getServerSnapshot === undefined) {
      throw new Error('Missing getServerSnapshot, which is required for ' + 'server-rendered content. Will revert to client rendering.');
    }

    nextSnapshot = getServerSnapshot();

    {
      if (!didWarnUncachedGetSnapshot) {
        if (nextSnapshot !== getServerSnapshot()) {
          console.error('The result of getServerSnapshot should be cached to avoid an infinite loop');
          didWarnUncachedGetSnapshot = true;
        }
      }
    }
  } else {
    nextSnapshot = getSnapshot();

    {
      if (!didWarnUncachedGetSnapshot) {
        const cachedSnapshot = getSnapshot();

        if (!objectIs(nextSnapshot, cachedSnapshot)) {
          console.error('The result of getSnapshot should be cached to avoid an infinite loop');
          didWarnUncachedGetSnapshot = true;
        }
      }
    }

    const root = getWorkInProgressRoot();

    if (root === null) {
      throw new Error('Expected a work-in-progress root. This is a bug in React. Please file an issue.');
    }

    const rootRenderLanes = getWorkInProgressRootRenderLanes();

    if (!includesBlockingLane(rootRenderLanes)) {
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
  fiber.flags |= Passive$1;
  pushEffect(HasEffect | Passive, updateStoreInstance.bind(null, fiber, inst, nextSnapshot, getSnapshot), createEffectInstance(), null);
  return nextSnapshot;
}

function updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
  const fiber = currentlyRenderingFiber$1;
  const hook = updateWorkInProgressHook();
  let nextSnapshot;
  const isHydrating = getIsHydrating();

  if (isHydrating) {
    if (getServerSnapshot === undefined) {
      throw new Error('Missing getServerSnapshot, which is required for ' + 'server-rendered content. Will revert to client rendering.');
    }

    nextSnapshot = getServerSnapshot();
  } else {
    nextSnapshot = getSnapshot();

    {
      if (!didWarnUncachedGetSnapshot) {
        const cachedSnapshot = getSnapshot();

        if (!objectIs(nextSnapshot, cachedSnapshot)) {
          console.error('The result of getSnapshot should be cached to avoid an infinite loop');
          didWarnUncachedGetSnapshot = true;
        }
      }
    }
  }

  const prevSnapshot = (currentHook || hook).memoizedState;
  const snapshotChanged = !objectIs(prevSnapshot, nextSnapshot);

  if (snapshotChanged) {
    hook.memoizedState = nextSnapshot;
    markWorkInProgressReceivedUpdate();
  }

  const inst = hook.queue;
  updateEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [subscribe]);

  if (inst.getSnapshot !== getSnapshot || snapshotChanged || workInProgressHook !== null && workInProgressHook.memoizedState.tag & HasEffect) {
    fiber.flags |= Passive$1;
    pushEffect(HasEffect | Passive, updateStoreInstance.bind(null, fiber, inst, nextSnapshot, getSnapshot), createEffectInstance(), null);
    const root = getWorkInProgressRoot();

    if (root === null) {
      throw new Error('Expected a work-in-progress root. This is a bug in React. Please file an issue.');
    }

    if (!isHydrating && !includesBlockingLane(renderLanes)) {
      pushStoreConsistencyCheck(fiber, getSnapshot, nextSnapshot);
    }
  }

  return nextSnapshot;
}

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

function updateStoreInstance(fiber, inst, nextSnapshot, getSnapshot) {
  inst.value = nextSnapshot;
  inst.getSnapshot = getSnapshot;

  if (checkIfSnapshotChanged(inst)) {
    forceStoreRerender(fiber);
  }
}

function subscribeToStore(fiber, inst, subscribe) {
  const handleStoreChange = () => {
    if (checkIfSnapshotChanged(inst)) {
      forceStoreRerender(fiber);
    }
  };

  return subscribe(handleStoreChange);
}

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

function forceStoreRerender(fiber) {
  const root = enqueueConcurrentRenderForLane(fiber, SyncLane);

  if (root !== null) {
    scheduleUpdateOnFiber(root, fiber, SyncLane);
  }
}

function mountStateImpl(initialState) {
  const hook = mountWorkInProgressHook();

  if (typeof initialState === 'function') {
    const initialStateInitializer = initialState;
    initialState = initialStateInitializer();

    if (shouldDoubleInvokeUserFnsInHooksDEV) {
      setIsStrictModeForDevtools(true);

      try {
        initialStateInitializer();
      } finally {
        setIsStrictModeForDevtools(false);
      }
    }
  }

  hook.memoizedState = hook.baseState = initialState;
  const queue = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState
  };
  hook.queue = queue;
  return hook;
}

function mountState(initialState) {
  const hook = mountStateImpl(initialState);
  const queue = hook.queue;
  const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber$1, queue);
  queue.dispatch = dispatch;
  return [hook.memoizedState, dispatch];
}

function updateState(initialState) {
  return updateReducer(basicStateReducer);
}

function rerenderState(initialState) {
  return rerenderReducer(basicStateReducer);
}

function mountOptimistic(passthrough, reducer) {
  const hook = mountWorkInProgressHook();
  hook.memoizedState = hook.baseState = passthrough;
  const queue = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: null,
    lastRenderedState: null
  };
  hook.queue = queue;
  const dispatch = dispatchOptimisticSetState.bind(null, currentlyRenderingFiber$1, true, queue);
  queue.dispatch = dispatch;
  return [passthrough, dispatch];
}

function updateOptimistic(passthrough, reducer) {
  const hook = updateWorkInProgressHook();
  return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
}

function updateOptimisticImpl(hook, current, passthrough, reducer) {
  hook.baseState = passthrough;
  const resolvedReducer = typeof reducer === 'function' ? reducer : basicStateReducer;
  return updateReducerImpl(hook, currentHook, resolvedReducer);
}

function rerenderOptimistic(passthrough, reducer) {
  const hook = updateWorkInProgressHook();

  if (currentHook !== null) {
    return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
  }

  hook.baseState = passthrough;
  const dispatch = hook.queue.dispatch;
  return [passthrough, dispatch];
}

function dispatchActionState(fiber, actionQueue, setPendingState, setState, payload) {
  if (isRenderPhaseUpdate(fiber)) {
    throw new Error('Cannot update form state while rendering.');
  }

  const currentAction = actionQueue.action;

  if (currentAction === null) {
    return;
  }

  const actionNode = {
    payload,
    action: currentAction,
    next: null,
    isTransition: true,
    status: 'pending',
    value: null,
    reason: null,
    listeners: [],

    then(listener) {
      actionNode.listeners.push(listener);
    }

  };
  const prevTransition = ReactSharedInternals.T;

  if (prevTransition !== null) {
    setPendingState(true);
    setState(actionNode);
  } else {
    actionNode.isTransition = false;
    setState(actionNode);
  }

  const last = actionQueue.pending;

  if (last === null) {
    actionNode.next = actionQueue.pending = actionNode;
    runActionStateAction(actionQueue, actionNode);
  } else {
    const first = last.next;
    actionNode.next = first;
    actionQueue.pending = last.next = actionNode;
  }
}

function runActionStateAction(actionQueue, node) {
  const action = node.action;
  const payload = node.payload;
  const prevState = actionQueue.state;

  if (node.isTransition) {
    const prevTransition = ReactSharedInternals.T;
    const currentTransition = {};
    ReactSharedInternals.T = currentTransition;

    {
      ReactSharedInternals.T._updatedFibers = new Set();
    }

    try {
      const returnValue = action(prevState, payload);
      const onStartTransitionFinish = ReactSharedInternals.S;

      if (onStartTransitionFinish !== null) {
        onStartTransitionFinish(currentTransition, returnValue);
      }

      handleActionReturnValue(actionQueue, node, returnValue);
    } catch (error) {
      onActionError(actionQueue, node, error);
    } finally {
      ReactSharedInternals.T = prevTransition;

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
  } else {
    try {
      const returnValue = action(prevState, payload);
      handleActionReturnValue(actionQueue, node, returnValue);
    } catch (error) {
      onActionError(actionQueue, node, error);
    }
  }
}

function handleActionReturnValue(actionQueue, node, returnValue) {
  if (returnValue !== null && typeof returnValue === 'object' && typeof returnValue.then === 'function') {
    const thenable = returnValue;
    thenable.then(nextState => {
      onActionSuccess(actionQueue, node, nextState);
    }, error => onActionError(actionQueue, node, error));

    {
      if (!node.isTransition) {
        console.error('An async function was passed to useActionState, but it was ' + 'dispatched outside of an action context. This is likely not ' + 'what you intended. Either pass the dispatch function to an ' + '`action` prop, or dispatch manually inside `startTransition`');
      }
    }
  } else {
    const nextState = returnValue;
    onActionSuccess(actionQueue, node, nextState);
  }
}

function onActionSuccess(actionQueue, actionNode, nextState) {
  actionNode.status = 'fulfilled';
  actionNode.value = nextState;
  notifyActionListeners(actionNode);
  actionQueue.state = nextState;
  const last = actionQueue.pending;

  if (last !== null) {
    const first = last.next;

    if (first === last) {
      actionQueue.pending = null;
    } else {
      const next = first.next;
      last.next = next;
      runActionStateAction(actionQueue, next);
    }
  }
}

function onActionError(actionQueue, actionNode, error) {
  const last = actionQueue.pending;
  actionQueue.pending = null;

  if (last !== null) {
    const first = last.next;

    do {
      actionNode.status = 'rejected';
      actionNode.reason = error;
      notifyActionListeners(actionNode);
      actionNode = actionNode.next;
    } while (actionNode !== first);
  }

  actionQueue.action = null;
}

function notifyActionListeners(actionNode) {
  const listeners = actionNode.listeners;

  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i];
    listener();
  }
}

function actionStateReducer(oldState, newState) {
  return newState;
}

function mountActionState(action, initialStateProp, permalink) {
  let initialState = initialStateProp;

  if (getIsHydrating()) {
    const root = getWorkInProgressRoot();
    const ssrFormState = root.formState;

    if (ssrFormState !== null) {
      const isMatching = tryToClaimNextHydratableFormMarkerInstance(currentlyRenderingFiber$1);

      if (isMatching) {
        initialState = ssrFormState[0];
      }
    }
  }

  const stateHook = mountWorkInProgressHook();
  stateHook.memoizedState = stateHook.baseState = initialState;
  const stateQueue = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: actionStateReducer,
    lastRenderedState: initialState
  };
  stateHook.queue = stateQueue;
  const setState = dispatchSetState.bind(null, currentlyRenderingFiber$1, stateQueue);
  stateQueue.dispatch = setState;
  const pendingStateHook = mountStateImpl(false);
  const setPendingState = dispatchOptimisticSetState.bind(null, currentlyRenderingFiber$1, false, pendingStateHook.queue);
  const actionQueueHook = mountWorkInProgressHook();
  const actionQueue = {
    state: initialState,
    dispatch: null,
    action,
    pending: null
  };
  actionQueueHook.queue = actionQueue;
  const dispatch = dispatchActionState.bind(null, currentlyRenderingFiber$1, actionQueue, setPendingState, setState);
  actionQueue.dispatch = dispatch;
  actionQueueHook.memoizedState = action;
  return [initialState, dispatch, false];
}

function updateActionState(action, initialState, permalink) {
  const stateHook = updateWorkInProgressHook();
  const currentStateHook = currentHook;
  return updateActionStateImpl(stateHook, currentStateHook, action);
}

function updateActionStateImpl(stateHook, currentStateHook, action, initialState, permalink) {
  const [actionResult] = updateReducerImpl(stateHook, currentStateHook, actionStateReducer);
  const [isPending] = updateState();
  const state = typeof actionResult === 'object' && actionResult !== null && typeof actionResult.then === 'function' ? useThenable(actionResult) : actionResult;
  const actionQueueHook = updateWorkInProgressHook();
  const actionQueue = actionQueueHook.queue;
  const dispatch = actionQueue.dispatch;
  const prevAction = actionQueueHook.memoizedState;

  if (action !== prevAction) {
    currentlyRenderingFiber$1.flags |= Passive$1;
    pushEffect(HasEffect | Passive, actionStateActionEffect.bind(null, actionQueue, action), createEffectInstance(), null);
  }

  return [state, dispatch, isPending];
}

function actionStateActionEffect(actionQueue, action) {
  actionQueue.action = action;
}

function rerenderActionState(action, initialState, permalink) {
  const stateHook = updateWorkInProgressHook();
  const currentStateHook = currentHook;

  if (currentStateHook !== null) {
    return updateActionStateImpl(stateHook, currentStateHook, action);
  }

  updateWorkInProgressHook();
  const state = stateHook.memoizedState;
  const actionQueueHook = updateWorkInProgressHook();
  const actionQueue = actionQueueHook.queue;
  const dispatch = actionQueue.dispatch;
  actionQueueHook.memoizedState = action;
  return [state, dispatch, false];
}

function pushEffect(tag, create, inst, deps) {
  const effect = {
    tag,
    create,
    inst,
    deps,
    next: null
  };
  let componentUpdateQueue = currentlyRenderingFiber$1.updateQueue;

  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber$1.updateQueue = componentUpdateQueue;
  }

  const lastEffect = componentUpdateQueue.lastEffect;

  if (lastEffect === null) {
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    const firstEffect = lastEffect.next;
    lastEffect.next = effect;
    effect.next = firstEffect;
    componentUpdateQueue.lastEffect = effect;
  }

  return effect;
}

function createEffectInstance() {
  return {
    destroy: undefined
  };
}

function mountRef(initialValue) {
  const hook = mountWorkInProgressHook();
  const ref = {
    current: initialValue
  };
  hook.memoizedState = ref;
  return ref;
}

function updateRef(initialValue) {
  const hook = updateWorkInProgressHook();
  return hook.memoizedState;
}

function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  currentlyRenderingFiber$1.flags |= fiberFlags;
  hook.memoizedState = pushEffect(HasEffect | hookFlags, create, createEffectInstance(), nextDeps);
}

function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const effect = hook.memoizedState;
  const inst = effect.inst;

  if (currentHook !== null) {
    if (nextDeps !== null) {
      const prevEffect = currentHook.memoizedState;
      const prevDeps = prevEffect.deps;

      if (areHookInputsEqual(nextDeps, prevDeps)) {
        hook.memoizedState = pushEffect(hookFlags, create, inst, nextDeps);
        return;
      }
    }
  }

  currentlyRenderingFiber$1.flags |= fiberFlags;
  hook.memoizedState = pushEffect(HasEffect | hookFlags, create, inst, nextDeps);
}

function mountEffect(create, deps) {
  if ((currentlyRenderingFiber$1.mode & StrictEffectsMode) !== NoMode && (currentlyRenderingFiber$1.mode & NoStrictPassiveEffectsMode) === NoMode) {
    mountEffectImpl(MountPassiveDev | Passive$1 | PassiveStatic, Passive, create, deps);
  } else {
    mountEffectImpl(Passive$1 | PassiveStatic, Passive, create, deps);
  }
}

function updateEffect(create, deps) {
  updateEffectImpl(Passive$1, Passive, create, deps);
}

function mountInsertionEffect(create, deps) {
  mountEffectImpl(Update, Insertion, create, deps);
}

function updateInsertionEffect(create, deps) {
  return updateEffectImpl(Update, Insertion, create, deps);
}

function mountLayoutEffect(create, deps) {
  let fiberFlags = Update | LayoutStatic;

  if ((currentlyRenderingFiber$1.mode & StrictEffectsMode) !== NoMode) {
    fiberFlags |= MountLayoutDev;
  }

  return mountEffectImpl(fiberFlags, Layout, create, deps);
}

function updateLayoutEffect(create, deps) {
  return updateEffectImpl(Update, Layout, create, deps);
}

function imperativeHandleEffect(create, ref) {
  if (typeof ref === 'function') {
    const refCallback = ref;
    const inst = create();
    const refCleanup = refCallback(inst);
    return () => {
      if (typeof refCleanup === 'function') {
        refCleanup();
      } else {
        refCallback(null);
      }
    };
  } else if (ref !== null && ref !== undefined) {
    const refObject = ref;

    {
      if (!refObject.hasOwnProperty('current')) {
        console.error('Expected useImperativeHandle() first argument to either be a ' + 'ref callback or React.createRef() object. Instead received: %s.', 'an object with keys {' + Object.keys(refObject).join(', ') + '}');
      }
    }

    const inst = create();
    refObject.current = inst;
    return () => {
      refObject.current = null;
    };
  }
}

function mountImperativeHandle(ref, create, deps) {
  {
    if (typeof create !== 'function') {
      console.error('Expected useImperativeHandle() second argument to be a function ' + 'that creates a handle. Instead received: %s.', create !== null ? typeof create : 'null');
    }
  }

  const effectDeps = deps !== null && deps !== undefined ? deps.concat([ref]) : null;
  let fiberFlags = Update | LayoutStatic;

  if ((currentlyRenderingFiber$1.mode & StrictEffectsMode) !== NoMode) {
    fiberFlags |= MountLayoutDev;
  }

  mountEffectImpl(fiberFlags, Layout, imperativeHandleEffect.bind(null, create, ref), effectDeps);
}

function updateImperativeHandle(ref, create, deps) {
  {
    if (typeof create !== 'function') {
      console.error('Expected useImperativeHandle() second argument to be a function ' + 'that creates a handle. Instead received: %s.', create !== null ? typeof create : 'null');
    }
  }

  const effectDeps = deps !== null && deps !== undefined ? deps.concat([ref]) : null;
  updateEffectImpl(Update, Layout, imperativeHandleEffect.bind(null, create, ref), effectDeps);
}

function mountDebugValue(value, formatterFn) {}

const updateDebugValue = mountDebugValue;

function mountCallback(callback, deps) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  hook.memoizedState = [callback, nextDeps];
  return callback;
}

function updateCallback(callback, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;

  if (nextDeps !== null) {
    const prevDeps = prevState[1];

    if (areHookInputsEqual(nextDeps, prevDeps)) {
      return prevState[0];
    }
  }

  hook.memoizedState = [callback, nextDeps];
  return callback;
}

function mountMemo(nextCreate, deps) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const nextValue = nextCreate();

  if (shouldDoubleInvokeUserFnsInHooksDEV) {
    setIsStrictModeForDevtools(true);

    try {
      nextCreate();
    } finally {
      setIsStrictModeForDevtools(false);
    }
  }

  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function updateMemo(nextCreate, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;

  if (nextDeps !== null) {
    const prevDeps = prevState[1];

    if (areHookInputsEqual(nextDeps, prevDeps)) {
      return prevState[0];
    }
  }

  const nextValue = nextCreate();

  if (shouldDoubleInvokeUserFnsInHooksDEV) {
    setIsStrictModeForDevtools(true);

    try {
      nextCreate();
    } finally {
      setIsStrictModeForDevtools(false);
    }
  }

  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function mountDeferredValue(value, initialValue) {
  const hook = mountWorkInProgressHook();
  return mountDeferredValueImpl(hook, value, initialValue);
}

function updateDeferredValue(value, initialValue) {
  const hook = updateWorkInProgressHook();
  const resolvedCurrentHook = currentHook;
  const prevValue = resolvedCurrentHook.memoizedState;
  return updateDeferredValueImpl(hook, prevValue, value, initialValue);
}

function rerenderDeferredValue(value, initialValue) {
  const hook = updateWorkInProgressHook();

  if (currentHook === null) {
    return mountDeferredValueImpl(hook, value, initialValue);
  } else {
    const prevValue = currentHook.memoizedState;
    return updateDeferredValueImpl(hook, prevValue, value, initialValue);
  }
}

function mountDeferredValueImpl(hook, value, initialValue) {
  if (initialValue !== undefined && !includesSomeLane(renderLanes, DeferredLane)) {
    hook.memoizedState = initialValue;
    const deferredLane = requestDeferredLane();
    currentlyRenderingFiber$1.lanes = mergeLanes(currentlyRenderingFiber$1.lanes, deferredLane);
    markSkippedUpdateLanes(deferredLane);
    return initialValue;
  } else {
    hook.memoizedState = value;
    return value;
  }
}

function updateDeferredValueImpl(hook, prevValue, value, initialValue) {
  if (objectIs(value, prevValue)) {
    return value;
  } else {
    if (isCurrentTreeHidden()) {
      const resultValue = mountDeferredValueImpl(hook, value, initialValue);

      if (!objectIs(resultValue, prevValue)) {
        markWorkInProgressReceivedUpdate();
      }

      return resultValue;
    }

    const shouldDeferValue = !includesOnlyNonUrgentLanes(renderLanes);

    if (shouldDeferValue) {
      const deferredLane = requestDeferredLane();
      currentlyRenderingFiber$1.lanes = mergeLanes(currentlyRenderingFiber$1.lanes, deferredLane);
      markSkippedUpdateLanes(deferredLane);
      return prevValue;
    } else {
      markWorkInProgressReceivedUpdate();
      hook.memoizedState = value;
      return value;
    }
  }
}

function startTransition(fiber, queue, pendingState, finishedState, callback, options) {
  const previousPriority = getCurrentUpdatePriority();
  setCurrentUpdatePriority(higherEventPriority(previousPriority, ContinuousEventPriority));
  const prevTransition = ReactSharedInternals.T;
  const currentTransition = {};

  {
    ReactSharedInternals.T = currentTransition;
    dispatchOptimisticSetState(fiber, false, queue, pendingState);
  }

  {
    currentTransition._updatedFibers = new Set();
  }

  try {
    if (enableAsyncActions) {
      const returnValue = callback();
      const onStartTransitionFinish = ReactSharedInternals.S;

      if (onStartTransitionFinish !== null) {
        onStartTransitionFinish(currentTransition, returnValue);
      }

      if (returnValue !== null && typeof returnValue === 'object' && typeof returnValue.then === 'function') {
        const thenable = returnValue;
        const thenableForFinishedState = chainThenableValue(thenable, finishedState);
        dispatchSetStateInternal(fiber, queue, thenableForFinishedState, requestUpdateLane(fiber));
      } else {
        dispatchSetStateInternal(fiber, queue, finishedState, requestUpdateLane(fiber));
      }
    }
  } catch (error) {
    {
      const rejectedThenable = {
        then() {},

        status: 'rejected',
        reason: error
      };
      dispatchSetStateInternal(fiber, queue, rejectedThenable, requestUpdateLane(fiber));
    }
  } finally {
    setCurrentUpdatePriority(previousPriority);
    ReactSharedInternals.T = prevTransition;

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
}

const noop$2 = () => {};

function startHostTransition(formFiber, pendingState, action, formData) {

  if (formFiber.tag !== HostComponent) {
    throw new Error('Expected the form instance to be a HostComponent. This ' + 'is a bug in React.');
  }

  const stateHook = ensureFormComponentIsStateful(formFiber);
  const queue = stateHook.queue;
  startTransition(formFiber, queue, pendingState, NotPendingTransition, action === null ? noop$2 : () => {
    requestFormReset$1(formFiber);
    return action(formData);
  });
}

function ensureFormComponentIsStateful(formFiber) {
  const existingStateHook = formFiber.memoizedState;

  if (existingStateHook !== null) {
    return existingStateHook;
  }

  const newQueue = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: NotPendingTransition
  };
  const stateHook = {
    memoizedState: NotPendingTransition,
    baseState: NotPendingTransition,
    baseQueue: null,
    queue: newQueue,
    next: null
  };
  const initialResetState = {};
  const newResetStateQueue = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialResetState
  };
  const resetStateHook = {
    memoizedState: initialResetState,
    baseState: initialResetState,
    baseQueue: null,
    queue: newResetStateQueue,
    next: null
  };
  stateHook.next = resetStateHook;
  formFiber.memoizedState = stateHook;
  const alternate = formFiber.alternate;

  if (alternate !== null) {
    alternate.memoizedState = stateHook;
  }

  return stateHook;
}

function requestFormReset$1(formFiber) {
  const transition = requestCurrentTransition();

  {
    if (transition === null) {
      console.error('requestFormReset was called outside a transition or action. To ' + 'fix, move to an action, or wrap with startTransition.');
    }
  }

  const stateHook = ensureFormComponentIsStateful(formFiber);
  const newResetState = {};
  const resetStateHook = stateHook.next;
  const resetStateQueue = resetStateHook.queue;
  dispatchSetStateInternal(formFiber, resetStateQueue, newResetState, requestUpdateLane(formFiber));
}

function mountTransition() {
  const stateHook = mountStateImpl(false);
  const start = startTransition.bind(null, currentlyRenderingFiber$1, stateHook.queue, true, false);
  const hook = mountWorkInProgressHook();
  hook.memoizedState = start;
  return [false, start];
}

function updateTransition() {
  const [booleanOrThenable] = updateState();
  const hook = updateWorkInProgressHook();
  const start = hook.memoizedState;
  const isPending = typeof booleanOrThenable === 'boolean' ? booleanOrThenable : useThenable(booleanOrThenable);
  return [isPending, start];
}

function rerenderTransition() {
  const [booleanOrThenable] = rerenderState();
  const hook = updateWorkInProgressHook();
  const start = hook.memoizedState;
  const isPending = typeof booleanOrThenable === 'boolean' ? booleanOrThenable : useThenable(booleanOrThenable);
  return [isPending, start];
}

function useHostTransitionStatus() {

  return readContext(HostTransitionContext);
}

function mountId() {
  const hook = mountWorkInProgressHook();
  const root = getWorkInProgressRoot();
  const identifierPrefix = root.identifierPrefix;
  let id;

  if (getIsHydrating()) {
    const treeId = getTreeId();
    id = ':' + identifierPrefix + 'R' + treeId;
    const localId = localIdCounter++;

    if (localId > 0) {
      id += 'H' + localId.toString(32);
    }

    id += ':';
  } else {
    const globalClientId = globalClientIdCounter++;
    id = ':' + identifierPrefix + 'r' + globalClientId.toString(32) + ':';
  }

  hook.memoizedState = id;
  return id;
}

function updateId() {
  const hook = updateWorkInProgressHook();
  const id = hook.memoizedState;
  return id;
}

function mountRefresh() {
  const hook = mountWorkInProgressHook();
  const refresh = hook.memoizedState = refreshCache.bind(null, currentlyRenderingFiber$1);
  return refresh;
}

function updateRefresh() {
  const hook = updateWorkInProgressHook();
  return hook.memoizedState;
}

function refreshCache(fiber, seedKey, seedValue) {

  let provider = fiber.return;

  while (provider !== null) {
    switch (provider.tag) {
      case CacheComponent:
      case HostRoot:
        {
          const lane = requestUpdateLane(provider);
          const refreshUpdate = createUpdate(lane);
          const root = enqueueUpdate(provider, refreshUpdate, lane);

          if (root !== null) {
            scheduleUpdateOnFiber(root, provider, lane);
            entangleTransitions(root, provider, lane);
          }

          const seededCache = createCache();

          if (seedKey !== null && seedKey !== undefined && root !== null) {
            {
              {
                console.error('The seed argument is not enabled outside experimental channels.');
              }
            }
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

function dispatchReducerAction(fiber, queue, action) {
  {
    if (typeof arguments[3] === 'function') {
      console.error("State updates from the useState() and useReducer() Hooks don't support the " + 'second callback argument. To execute a side effect after ' + 'rendering, declare it in the component body with useEffect().');
    }
  }

  const lane = requestUpdateLane(fiber);
  const update = {
    lane,
    revertLane: NoLane,
    action,
    hasEagerState: false,
    eagerState: null,
    next: null
  };

  if (isRenderPhaseUpdate(fiber)) {
    enqueueRenderPhaseUpdate(queue, update);
  } else {
    const root = enqueueConcurrentHookUpdate(fiber, queue, update, lane);

    if (root !== null) {
      scheduleUpdateOnFiber(root, fiber, lane);
      entangleTransitionUpdate(root, queue, lane);
    }
  }
}

function dispatchSetState(fiber, queue, action) {
  {
    if (typeof arguments[3] === 'function') {
      console.error("State updates from the useState() and useReducer() Hooks don't support the " + 'second callback argument. To execute a side effect after ' + 'rendering, declare it in the component body with useEffect().');
    }
  }

  const lane = requestUpdateLane(fiber);
  dispatchSetStateInternal(fiber, queue, action, lane);
}

function dispatchSetStateInternal(fiber, queue, action, lane) {
  const update = {
    lane,
    revertLane: NoLane,
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
        let prevDispatcher = null;

        {
          prevDispatcher = ReactSharedInternals.H;
          ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;
        }

        try {
          const currentState = queue.lastRenderedState;
          const eagerState = lastRenderedReducer(currentState, action);
          update.hasEagerState = true;
          update.eagerState = eagerState;

          if (objectIs(eagerState, currentState)) {
            enqueueConcurrentHookUpdateAndEagerlyBailout(fiber, queue, update);
            return false;
          }
        } catch (error) {} finally {
          {
            ReactSharedInternals.H = prevDispatcher;
          }
        }
      }
    }

    const root = enqueueConcurrentHookUpdate(fiber, queue, update, lane);

    if (root !== null) {
      scheduleUpdateOnFiber(root, fiber, lane);
      entangleTransitionUpdate(root, queue, lane);
      return true;
    }
  }

  return false;
}

function dispatchOptimisticSetState(fiber, throwIfDuringRender, queue, action) {
  const transition = requestCurrentTransition();

  {
    if (transition === null) {
      if (peekEntangledActionLane() !== NoLane) ; else {
        console.error('An optimistic state update occurred outside a transition or ' + 'action. To fix, move the update to an action, or wrap ' + 'with startTransition.');
      }
    }
  }

  const update = {
    lane: SyncLane,
    revertLane: requestTransitionLane(),
    action,
    hasEagerState: false,
    eagerState: null,
    next: null
  };

  if (isRenderPhaseUpdate(fiber)) {
    if (throwIfDuringRender) {
      throw new Error('Cannot update optimistic state while rendering.');
    } else {
      {
        console.error('Cannot call startTransition while rendering.');
      }
    }
  } else {
    const root = enqueueConcurrentHookUpdate(fiber, queue, update, SyncLane);

    if (root !== null) {
      scheduleUpdateOnFiber(root, fiber, SyncLane);
    }
  }
}

function isRenderPhaseUpdate(fiber) {
  const alternate = fiber.alternate;
  return fiber === currentlyRenderingFiber$1 || alternate !== null && alternate === currentlyRenderingFiber$1;
}

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

function entangleTransitionUpdate(root, queue, lane) {
  if (isTransitionLane(lane)) {
    let queueLanes = queue.lanes;
    queueLanes = intersectLanes(queueLanes, root.pendingLanes);
    const newQueueLanes = mergeLanes(queueLanes, lane);
    queue.lanes = newQueueLanes;
    markRootEntangled(root, newQueueLanes);
  }
}

const ContextOnlyDispatcher = {
  readContext,
  use,
  useCallback: throwInvalidHookError,
  useContext: throwInvalidHookError,
  useEffect: throwInvalidHookError,
  useImperativeHandle: throwInvalidHookError,
  useLayoutEffect: throwInvalidHookError,
  useInsertionEffect: throwInvalidHookError,
  useMemo: throwInvalidHookError,
  useReducer: throwInvalidHookError,
  useRef: throwInvalidHookError,
  useState: throwInvalidHookError,
  useDebugValue: throwInvalidHookError,
  useDeferredValue: throwInvalidHookError,
  useTransition: throwInvalidHookError,
  useSyncExternalStore: throwInvalidHookError,
  useId: throwInvalidHookError
};

{
  ContextOnlyDispatcher.useCacheRefresh = throwInvalidHookError;
}

{
  ContextOnlyDispatcher.useMemoCache = throwInvalidHookError;
}

{
  ContextOnlyDispatcher.useHostTransitionStatus = throwInvalidHookError;
  ContextOnlyDispatcher.useFormState = throwInvalidHookError;
  ContextOnlyDispatcher.useActionState = throwInvalidHookError;
}

{
  ContextOnlyDispatcher.useOptimistic = throwInvalidHookError;
}

let HooksDispatcherOnMountInDEV = null;
let HooksDispatcherOnMountWithHookTypesInDEV = null;
let HooksDispatcherOnUpdateInDEV = null;
let HooksDispatcherOnRerenderInDEV = null;
let InvalidNestedHooksDispatcherOnMountInDEV = null;
let InvalidNestedHooksDispatcherOnUpdateInDEV = null;
let InvalidNestedHooksDispatcherOnRerenderInDEV = null;

{
  const warnInvalidContextAccess = () => {
    console.error('Context can only be read while React is rendering. ' + 'In classes, you can read it in the render method or getDerivedStateFromProps. ' + 'In function components, you can read it directly in the function body, but not ' + 'inside Hooks like useReducer() or useMemo().');
  };

  const warnInvalidHookAccess = () => {
    console.error('Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. ' + 'You can only call Hooks at the top level of your React function. ' + 'For more information, see ' + 'https://react.dev/link/rules-of-hooks');
  };

  HooksDispatcherOnMountInDEV = {
    readContext(context) {
      return readContext(context);
    },

    use,

    useCallback(callback, deps) {
      currentHookNameInDev = 'useCallback';
      mountHookTypesDev();
      checkDepsAreArrayDev(deps);
      return mountCallback(callback, deps);
    },

    useContext(context) {
      currentHookNameInDev = 'useContext';
      mountHookTypesDev();
      return readContext(context);
    },

    useEffect(create, deps) {
      currentHookNameInDev = 'useEffect';
      mountHookTypesDev();
      checkDepsAreArrayDev(deps);
      return mountEffect(create, deps);
    },

    useImperativeHandle(ref, create, deps) {
      currentHookNameInDev = 'useImperativeHandle';
      mountHookTypesDev();
      checkDepsAreArrayDev(deps);
      return mountImperativeHandle(ref, create, deps);
    },

    useInsertionEffect(create, deps) {
      currentHookNameInDev = 'useInsertionEffect';
      mountHookTypesDev();
      checkDepsAreArrayDev(deps);
      return mountInsertionEffect(create, deps);
    },

    useLayoutEffect(create, deps) {
      currentHookNameInDev = 'useLayoutEffect';
      mountHookTypesDev();
      checkDepsAreArrayDev(deps);
      return mountLayoutEffect(create, deps);
    },

    useMemo(create, deps) {
      currentHookNameInDev = 'useMemo';
      mountHookTypesDev();
      checkDepsAreArrayDev(deps);
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountMemo(create, deps);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useReducer(reducer, initialArg, init) {
      currentHookNameInDev = 'useReducer';
      mountHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountReducer(reducer, initialArg, init);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useRef(initialValue) {
      currentHookNameInDev = 'useRef';
      mountHookTypesDev();
      return mountRef(initialValue);
    },

    useState(initialState) {
      currentHookNameInDev = 'useState';
      mountHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountState(initialState);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useDebugValue(value, formatterFn) {
      currentHookNameInDev = 'useDebugValue';
      mountHookTypesDev();
      return mountDebugValue();
    },

    useDeferredValue(value, initialValue) {
      currentHookNameInDev = 'useDeferredValue';
      mountHookTypesDev();
      return mountDeferredValue(value, initialValue);
    },

    useTransition() {
      currentHookNameInDev = 'useTransition';
      mountHookTypesDev();
      return mountTransition();
    },

    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
      currentHookNameInDev = 'useSyncExternalStore';
      mountHookTypesDev();
      return mountSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    },

    useId() {
      currentHookNameInDev = 'useId';
      mountHookTypesDev();
      return mountId();
    }

  };

  {
    HooksDispatcherOnMountInDEV.useCacheRefresh = function useCacheRefresh() {
      currentHookNameInDev = 'useCacheRefresh';
      mountHookTypesDev();
      return mountRefresh();
    };
  }

  {
    HooksDispatcherOnMountInDEV.useMemoCache = useMemoCache;
  }

  {
    HooksDispatcherOnMountInDEV.useHostTransitionStatus = useHostTransitionStatus;

    HooksDispatcherOnMountInDEV.useFormState = function useFormState(action, initialState, permalink) {
      currentHookNameInDev = 'useFormState';
      mountHookTypesDev();
      warnOnUseFormStateInDev();
      return mountActionState(action, initialState);
    };

    HooksDispatcherOnMountInDEV.useActionState = function useActionState(action, initialState, permalink) {
      currentHookNameInDev = 'useActionState';
      mountHookTypesDev();
      return mountActionState(action, initialState);
    };
  }

  {
    HooksDispatcherOnMountInDEV.useOptimistic = function useOptimistic(passthrough, reducer) {
      currentHookNameInDev = 'useOptimistic';
      mountHookTypesDev();
      return mountOptimistic(passthrough);
    };
  }

  HooksDispatcherOnMountWithHookTypesInDEV = {
    readContext(context) {
      return readContext(context);
    },

    use,

    useCallback(callback, deps) {
      currentHookNameInDev = 'useCallback';
      updateHookTypesDev();
      return mountCallback(callback, deps);
    },

    useContext(context) {
      currentHookNameInDev = 'useContext';
      updateHookTypesDev();
      return readContext(context);
    },

    useEffect(create, deps) {
      currentHookNameInDev = 'useEffect';
      updateHookTypesDev();
      return mountEffect(create, deps);
    },

    useImperativeHandle(ref, create, deps) {
      currentHookNameInDev = 'useImperativeHandle';
      updateHookTypesDev();
      return mountImperativeHandle(ref, create, deps);
    },

    useInsertionEffect(create, deps) {
      currentHookNameInDev = 'useInsertionEffect';
      updateHookTypesDev();
      return mountInsertionEffect(create, deps);
    },

    useLayoutEffect(create, deps) {
      currentHookNameInDev = 'useLayoutEffect';
      updateHookTypesDev();
      return mountLayoutEffect(create, deps);
    },

    useMemo(create, deps) {
      currentHookNameInDev = 'useMemo';
      updateHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountMemo(create, deps);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useReducer(reducer, initialArg, init) {
      currentHookNameInDev = 'useReducer';
      updateHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountReducer(reducer, initialArg, init);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useRef(initialValue) {
      currentHookNameInDev = 'useRef';
      updateHookTypesDev();
      return mountRef(initialValue);
    },

    useState(initialState) {
      currentHookNameInDev = 'useState';
      updateHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountState(initialState);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useDebugValue(value, formatterFn) {
      currentHookNameInDev = 'useDebugValue';
      updateHookTypesDev();
      return mountDebugValue();
    },

    useDeferredValue(value, initialValue) {
      currentHookNameInDev = 'useDeferredValue';
      updateHookTypesDev();
      return mountDeferredValue(value, initialValue);
    },

    useTransition() {
      currentHookNameInDev = 'useTransition';
      updateHookTypesDev();
      return mountTransition();
    },

    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
      currentHookNameInDev = 'useSyncExternalStore';
      updateHookTypesDev();
      return mountSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    },

    useId() {
      currentHookNameInDev = 'useId';
      updateHookTypesDev();
      return mountId();
    }

  };

  {
    HooksDispatcherOnMountWithHookTypesInDEV.useCacheRefresh = function useCacheRefresh() {
      currentHookNameInDev = 'useCacheRefresh';
      updateHookTypesDev();
      return mountRefresh();
    };
  }

  {
    HooksDispatcherOnMountWithHookTypesInDEV.useMemoCache = useMemoCache;
  }

  {
    HooksDispatcherOnMountWithHookTypesInDEV.useHostTransitionStatus = useHostTransitionStatus;

    HooksDispatcherOnMountWithHookTypesInDEV.useFormState = function useFormState(action, initialState, permalink) {
      currentHookNameInDev = 'useFormState';
      updateHookTypesDev();
      warnOnUseFormStateInDev();
      return mountActionState(action, initialState);
    };

    HooksDispatcherOnMountWithHookTypesInDEV.useActionState = function useActionState(action, initialState, permalink) {
      currentHookNameInDev = 'useActionState';
      updateHookTypesDev();
      return mountActionState(action, initialState);
    };
  }

  {
    HooksDispatcherOnMountWithHookTypesInDEV.useOptimistic = function useOptimistic(passthrough, reducer) {
      currentHookNameInDev = 'useOptimistic';
      updateHookTypesDev();
      return mountOptimistic(passthrough);
    };
  }

  HooksDispatcherOnUpdateInDEV = {
    readContext(context) {
      return readContext(context);
    },

    use,

    useCallback(callback, deps) {
      currentHookNameInDev = 'useCallback';
      updateHookTypesDev();
      return updateCallback(callback, deps);
    },

    useContext(context) {
      currentHookNameInDev = 'useContext';
      updateHookTypesDev();
      return readContext(context);
    },

    useEffect(create, deps) {
      currentHookNameInDev = 'useEffect';
      updateHookTypesDev();
      return updateEffect(create, deps);
    },

    useImperativeHandle(ref, create, deps) {
      currentHookNameInDev = 'useImperativeHandle';
      updateHookTypesDev();
      return updateImperativeHandle(ref, create, deps);
    },

    useInsertionEffect(create, deps) {
      currentHookNameInDev = 'useInsertionEffect';
      updateHookTypesDev();
      return updateInsertionEffect(create, deps);
    },

    useLayoutEffect(create, deps) {
      currentHookNameInDev = 'useLayoutEffect';
      updateHookTypesDev();
      return updateLayoutEffect(create, deps);
    },

    useMemo(create, deps) {
      currentHookNameInDev = 'useMemo';
      updateHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return updateMemo(create, deps);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useReducer(reducer, initialArg, init) {
      currentHookNameInDev = 'useReducer';
      updateHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return updateReducer(reducer, initialArg, init);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useRef(initialValue) {
      currentHookNameInDev = 'useRef';
      updateHookTypesDev();
      return updateRef();
    },

    useState(initialState) {
      currentHookNameInDev = 'useState';
      updateHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return updateState(initialState);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useDebugValue(value, formatterFn) {
      currentHookNameInDev = 'useDebugValue';
      updateHookTypesDev();
      return updateDebugValue();
    },

    useDeferredValue(value, initialValue) {
      currentHookNameInDev = 'useDeferredValue';
      updateHookTypesDev();
      return updateDeferredValue(value, initialValue);
    },

    useTransition() {
      currentHookNameInDev = 'useTransition';
      updateHookTypesDev();
      return updateTransition();
    },

    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
      currentHookNameInDev = 'useSyncExternalStore';
      updateHookTypesDev();
      return updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    },

    useId() {
      currentHookNameInDev = 'useId';
      updateHookTypesDev();
      return updateId();
    }

  };

  {
    HooksDispatcherOnUpdateInDEV.useCacheRefresh = function useCacheRefresh() {
      currentHookNameInDev = 'useCacheRefresh';
      updateHookTypesDev();
      return updateRefresh();
    };
  }

  {
    HooksDispatcherOnUpdateInDEV.useMemoCache = useMemoCache;
  }

  {
    HooksDispatcherOnUpdateInDEV.useHostTransitionStatus = useHostTransitionStatus;

    HooksDispatcherOnUpdateInDEV.useFormState = function useFormState(action, initialState, permalink) {
      currentHookNameInDev = 'useFormState';
      updateHookTypesDev();
      warnOnUseFormStateInDev();
      return updateActionState(action);
    };

    HooksDispatcherOnUpdateInDEV.useActionState = function useActionState(action, initialState, permalink) {
      currentHookNameInDev = 'useActionState';
      updateHookTypesDev();
      return updateActionState(action);
    };
  }

  {
    HooksDispatcherOnUpdateInDEV.useOptimistic = function useOptimistic(passthrough, reducer) {
      currentHookNameInDev = 'useOptimistic';
      updateHookTypesDev();
      return updateOptimistic(passthrough, reducer);
    };
  }

  HooksDispatcherOnRerenderInDEV = {
    readContext(context) {
      return readContext(context);
    },

    use,

    useCallback(callback, deps) {
      currentHookNameInDev = 'useCallback';
      updateHookTypesDev();
      return updateCallback(callback, deps);
    },

    useContext(context) {
      currentHookNameInDev = 'useContext';
      updateHookTypesDev();
      return readContext(context);
    },

    useEffect(create, deps) {
      currentHookNameInDev = 'useEffect';
      updateHookTypesDev();
      return updateEffect(create, deps);
    },

    useImperativeHandle(ref, create, deps) {
      currentHookNameInDev = 'useImperativeHandle';
      updateHookTypesDev();
      return updateImperativeHandle(ref, create, deps);
    },

    useInsertionEffect(create, deps) {
      currentHookNameInDev = 'useInsertionEffect';
      updateHookTypesDev();
      return updateInsertionEffect(create, deps);
    },

    useLayoutEffect(create, deps) {
      currentHookNameInDev = 'useLayoutEffect';
      updateHookTypesDev();
      return updateLayoutEffect(create, deps);
    },

    useMemo(create, deps) {
      currentHookNameInDev = 'useMemo';
      updateHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnRerenderInDEV;

      try {
        return updateMemo(create, deps);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useReducer(reducer, initialArg, init) {
      currentHookNameInDev = 'useReducer';
      updateHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnRerenderInDEV;

      try {
        return rerenderReducer(reducer, initialArg, init);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useRef(initialValue) {
      currentHookNameInDev = 'useRef';
      updateHookTypesDev();
      return updateRef();
    },

    useState(initialState) {
      currentHookNameInDev = 'useState';
      updateHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnRerenderInDEV;

      try {
        return rerenderState(initialState);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useDebugValue(value, formatterFn) {
      currentHookNameInDev = 'useDebugValue';
      updateHookTypesDev();
      return updateDebugValue();
    },

    useDeferredValue(value, initialValue) {
      currentHookNameInDev = 'useDeferredValue';
      updateHookTypesDev();
      return rerenderDeferredValue(value, initialValue);
    },

    useTransition() {
      currentHookNameInDev = 'useTransition';
      updateHookTypesDev();
      return rerenderTransition();
    },

    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
      currentHookNameInDev = 'useSyncExternalStore';
      updateHookTypesDev();
      return updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    },

    useId() {
      currentHookNameInDev = 'useId';
      updateHookTypesDev();
      return updateId();
    }

  };

  {
    HooksDispatcherOnRerenderInDEV.useCacheRefresh = function useCacheRefresh() {
      currentHookNameInDev = 'useCacheRefresh';
      updateHookTypesDev();
      return updateRefresh();
    };
  }

  {
    HooksDispatcherOnRerenderInDEV.useMemoCache = useMemoCache;
  }

  {
    HooksDispatcherOnRerenderInDEV.useHostTransitionStatus = useHostTransitionStatus;

    HooksDispatcherOnRerenderInDEV.useFormState = function useFormState(action, initialState, permalink) {
      currentHookNameInDev = 'useFormState';
      updateHookTypesDev();
      warnOnUseFormStateInDev();
      return rerenderActionState(action);
    };

    HooksDispatcherOnRerenderInDEV.useActionState = function useActionState(action, initialState, permalink) {
      currentHookNameInDev = 'useActionState';
      updateHookTypesDev();
      return rerenderActionState(action);
    };
  }

  {
    HooksDispatcherOnRerenderInDEV.useOptimistic = function useOptimistic(passthrough, reducer) {
      currentHookNameInDev = 'useOptimistic';
      updateHookTypesDev();
      return rerenderOptimistic(passthrough, reducer);
    };
  }

  InvalidNestedHooksDispatcherOnMountInDEV = {
    readContext(context) {
      warnInvalidContextAccess();
      return readContext(context);
    },

    use(usable) {
      warnInvalidHookAccess();
      return use(usable);
    },

    useCallback(callback, deps) {
      currentHookNameInDev = 'useCallback';
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountCallback(callback, deps);
    },

    useContext(context) {
      currentHookNameInDev = 'useContext';
      warnInvalidHookAccess();
      mountHookTypesDev();
      return readContext(context);
    },

    useEffect(create, deps) {
      currentHookNameInDev = 'useEffect';
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountEffect(create, deps);
    },

    useImperativeHandle(ref, create, deps) {
      currentHookNameInDev = 'useImperativeHandle';
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountImperativeHandle(ref, create, deps);
    },

    useInsertionEffect(create, deps) {
      currentHookNameInDev = 'useInsertionEffect';
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountInsertionEffect(create, deps);
    },

    useLayoutEffect(create, deps) {
      currentHookNameInDev = 'useLayoutEffect';
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountLayoutEffect(create, deps);
    },

    useMemo(create, deps) {
      currentHookNameInDev = 'useMemo';
      warnInvalidHookAccess();
      mountHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountMemo(create, deps);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useReducer(reducer, initialArg, init) {
      currentHookNameInDev = 'useReducer';
      warnInvalidHookAccess();
      mountHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountReducer(reducer, initialArg, init);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useRef(initialValue) {
      currentHookNameInDev = 'useRef';
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountRef(initialValue);
    },

    useState(initialState) {
      currentHookNameInDev = 'useState';
      warnInvalidHookAccess();
      mountHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;

      try {
        return mountState(initialState);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useDebugValue(value, formatterFn) {
      currentHookNameInDev = 'useDebugValue';
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountDebugValue();
    },

    useDeferredValue(value, initialValue) {
      currentHookNameInDev = 'useDeferredValue';
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountDeferredValue(value, initialValue);
    },

    useTransition() {
      currentHookNameInDev = 'useTransition';
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountTransition();
    },

    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
      currentHookNameInDev = 'useSyncExternalStore';
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    },

    useId() {
      currentHookNameInDev = 'useId';
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountId();
    }

  };

  {
    InvalidNestedHooksDispatcherOnMountInDEV.useCacheRefresh = function useCacheRefresh() {
      currentHookNameInDev = 'useCacheRefresh';
      mountHookTypesDev();
      return mountRefresh();
    };
  }

  {
    InvalidNestedHooksDispatcherOnMountInDEV.useMemoCache = function (size) {
      warnInvalidHookAccess();
      return useMemoCache(size);
    };
  }

  {
    InvalidNestedHooksDispatcherOnMountInDEV.useHostTransitionStatus = useHostTransitionStatus;

    InvalidNestedHooksDispatcherOnMountInDEV.useFormState = function useFormState(action, initialState, permalink) {
      currentHookNameInDev = 'useFormState';
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountActionState(action, initialState);
    };

    InvalidNestedHooksDispatcherOnMountInDEV.useActionState = function useActionState(action, initialState, permalink) {
      currentHookNameInDev = 'useActionState';
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountActionState(action, initialState);
    };
  }

  {
    InvalidNestedHooksDispatcherOnMountInDEV.useOptimistic = function useOptimistic(passthrough, reducer) {
      currentHookNameInDev = 'useOptimistic';
      warnInvalidHookAccess();
      mountHookTypesDev();
      return mountOptimistic(passthrough);
    };
  }

  InvalidNestedHooksDispatcherOnUpdateInDEV = {
    readContext(context) {
      warnInvalidContextAccess();
      return readContext(context);
    },

    use(usable) {
      warnInvalidHookAccess();
      return use(usable);
    },

    useCallback(callback, deps) {
      currentHookNameInDev = 'useCallback';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateCallback(callback, deps);
    },

    useContext(context) {
      currentHookNameInDev = 'useContext';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return readContext(context);
    },

    useEffect(create, deps) {
      currentHookNameInDev = 'useEffect';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateEffect(create, deps);
    },

    useImperativeHandle(ref, create, deps) {
      currentHookNameInDev = 'useImperativeHandle';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateImperativeHandle(ref, create, deps);
    },

    useInsertionEffect(create, deps) {
      currentHookNameInDev = 'useInsertionEffect';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateInsertionEffect(create, deps);
    },

    useLayoutEffect(create, deps) {
      currentHookNameInDev = 'useLayoutEffect';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateLayoutEffect(create, deps);
    },

    useMemo(create, deps) {
      currentHookNameInDev = 'useMemo';
      warnInvalidHookAccess();
      updateHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return updateMemo(create, deps);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useReducer(reducer, initialArg, init) {
      currentHookNameInDev = 'useReducer';
      warnInvalidHookAccess();
      updateHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return updateReducer(reducer, initialArg, init);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useRef(initialValue) {
      currentHookNameInDev = 'useRef';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateRef();
    },

    useState(initialState) {
      currentHookNameInDev = 'useState';
      warnInvalidHookAccess();
      updateHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return updateState(initialState);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useDebugValue(value, formatterFn) {
      currentHookNameInDev = 'useDebugValue';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateDebugValue();
    },

    useDeferredValue(value, initialValue) {
      currentHookNameInDev = 'useDeferredValue';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateDeferredValue(value, initialValue);
    },

    useTransition() {
      currentHookNameInDev = 'useTransition';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateTransition();
    },

    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
      currentHookNameInDev = 'useSyncExternalStore';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    },

    useId() {
      currentHookNameInDev = 'useId';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateId();
    }

  };

  {
    InvalidNestedHooksDispatcherOnUpdateInDEV.useCacheRefresh = function useCacheRefresh() {
      currentHookNameInDev = 'useCacheRefresh';
      updateHookTypesDev();
      return updateRefresh();
    };
  }

  {
    InvalidNestedHooksDispatcherOnUpdateInDEV.useMemoCache = function (size) {
      warnInvalidHookAccess();
      return useMemoCache(size);
    };
  }

  {
    InvalidNestedHooksDispatcherOnUpdateInDEV.useHostTransitionStatus = useHostTransitionStatus;

    InvalidNestedHooksDispatcherOnUpdateInDEV.useFormState = function useFormState(action, initialState, permalink) {
      currentHookNameInDev = 'useFormState';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateActionState(action);
    };

    InvalidNestedHooksDispatcherOnUpdateInDEV.useActionState = function useActionState(action, initialState, permalink) {
      currentHookNameInDev = 'useActionState';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateActionState(action);
    };
  }

  {
    InvalidNestedHooksDispatcherOnUpdateInDEV.useOptimistic = function useOptimistic(passthrough, reducer) {
      currentHookNameInDev = 'useOptimistic';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateOptimistic(passthrough, reducer);
    };
  }

  InvalidNestedHooksDispatcherOnRerenderInDEV = {
    readContext(context) {
      warnInvalidContextAccess();
      return readContext(context);
    },

    use(usable) {
      warnInvalidHookAccess();
      return use(usable);
    },

    useCallback(callback, deps) {
      currentHookNameInDev = 'useCallback';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateCallback(callback, deps);
    },

    useContext(context) {
      currentHookNameInDev = 'useContext';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return readContext(context);
    },

    useEffect(create, deps) {
      currentHookNameInDev = 'useEffect';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateEffect(create, deps);
    },

    useImperativeHandle(ref, create, deps) {
      currentHookNameInDev = 'useImperativeHandle';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateImperativeHandle(ref, create, deps);
    },

    useInsertionEffect(create, deps) {
      currentHookNameInDev = 'useInsertionEffect';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateInsertionEffect(create, deps);
    },

    useLayoutEffect(create, deps) {
      currentHookNameInDev = 'useLayoutEffect';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateLayoutEffect(create, deps);
    },

    useMemo(create, deps) {
      currentHookNameInDev = 'useMemo';
      warnInvalidHookAccess();
      updateHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return updateMemo(create, deps);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useReducer(reducer, initialArg, init) {
      currentHookNameInDev = 'useReducer';
      warnInvalidHookAccess();
      updateHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return rerenderReducer(reducer, initialArg, init);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useRef(initialValue) {
      currentHookNameInDev = 'useRef';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateRef();
    },

    useState(initialState) {
      currentHookNameInDev = 'useState';
      warnInvalidHookAccess();
      updateHookTypesDev();
      const prevDispatcher = ReactSharedInternals.H;
      ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;

      try {
        return rerenderState(initialState);
      } finally {
        ReactSharedInternals.H = prevDispatcher;
      }
    },

    useDebugValue(value, formatterFn) {
      currentHookNameInDev = 'useDebugValue';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateDebugValue();
    },

    useDeferredValue(value, initialValue) {
      currentHookNameInDev = 'useDeferredValue';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return rerenderDeferredValue(value, initialValue);
    },

    useTransition() {
      currentHookNameInDev = 'useTransition';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return rerenderTransition();
    },

    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
      currentHookNameInDev = 'useSyncExternalStore';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    },

    useId() {
      currentHookNameInDev = 'useId';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return updateId();
    }

  };

  {
    InvalidNestedHooksDispatcherOnRerenderInDEV.useCacheRefresh = function useCacheRefresh() {
      currentHookNameInDev = 'useCacheRefresh';
      updateHookTypesDev();
      return updateRefresh();
    };
  }

  {
    InvalidNestedHooksDispatcherOnRerenderInDEV.useMemoCache = function (size) {
      warnInvalidHookAccess();
      return useMemoCache(size);
    };
  }

  {
    InvalidNestedHooksDispatcherOnRerenderInDEV.useHostTransitionStatus = useHostTransitionStatus;

    InvalidNestedHooksDispatcherOnRerenderInDEV.useFormState = function useFormState(action, initialState, permalink) {
      currentHookNameInDev = 'useFormState';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return rerenderActionState(action);
    };

    InvalidNestedHooksDispatcherOnRerenderInDEV.useActionState = function useActionState(action, initialState, permalink) {
      currentHookNameInDev = 'useActionState';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return rerenderActionState(action);
    };
  }

  {
    InvalidNestedHooksDispatcherOnRerenderInDEV.useOptimistic = function useOptimistic(passthrough, reducer) {
      currentHookNameInDev = 'useOptimistic';
      warnInvalidHookAccess();
      updateHookTypesDev();
      return rerenderOptimistic(passthrough, reducer);
    };
  }
}

const fakeInternalInstance = {};
let didWarnAboutStateAssignmentForComponent;
let didWarnAboutUninitializedState;
let didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate;
let didWarnAboutLegacyLifecyclesAndDerivedState;
let didWarnAboutUndefinedDerivedState;
let didWarnAboutDirectlyAssigningPropsToState;
let didWarnAboutContextTypes$1;
let didWarnAboutChildContextTypes;
let didWarnAboutInvalidateContextType;
let didWarnOnInvalidCallback;

{
  didWarnAboutStateAssignmentForComponent = new Set();
  didWarnAboutUninitializedState = new Set();
  didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate = new Set();
  didWarnAboutLegacyLifecyclesAndDerivedState = new Set();
  didWarnAboutDirectlyAssigningPropsToState = new Set();
  didWarnAboutUndefinedDerivedState = new Set();
  didWarnAboutContextTypes$1 = new Set();
  didWarnAboutChildContextTypes = new Set();
  didWarnAboutInvalidateContextType = new Set();
  didWarnOnInvalidCallback = new Set();
  Object.freeze(fakeInternalInstance);
}

function warnOnInvalidCallback(callback) {
  {
    if (callback === null || typeof callback === 'function') {
      return;
    }

    const key = String(callback);

    if (!didWarnOnInvalidCallback.has(key)) {
      didWarnOnInvalidCallback.add(key);
      console.error('Expected the last optional `callback` argument to be a ' + 'function. Instead received: %s.', callback);
    }
  }
}

function warnOnUndefinedDerivedState(type, partialState) {
  {
    if (partialState === undefined) {
      const componentName = getComponentNameFromType(type) || 'Component';

      if (!didWarnAboutUndefinedDerivedState.has(componentName)) {
        didWarnAboutUndefinedDerivedState.add(componentName);
        console.error('%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. ' + 'You have returned undefined.', componentName);
      }
    }
  }
}

function applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, nextProps) {
  const prevState = workInProgress.memoizedState;
  let partialState = getDerivedStateFromProps(nextProps, prevState);

  {
    if (workInProgress.mode & StrictLegacyMode) {
      setIsStrictModeForDevtools(true);

      try {
        partialState = getDerivedStateFromProps(nextProps, prevState);
      } finally {
        setIsStrictModeForDevtools(false);
      }
    }

    warnOnUndefinedDerivedState(ctor, partialState);
  }

  const memoizedState = partialState === null || partialState === undefined ? prevState : assign({}, prevState, partialState);
  workInProgress.memoizedState = memoizedState;

  if (workInProgress.lanes === NoLanes) {
    const updateQueue = workInProgress.updateQueue;
    updateQueue.baseState = memoizedState;
  }
}

const classComponentUpdater = {
  isMounted,

  enqueueSetState(inst, payload, callback) {
    const fiber = get(inst);
    const lane = requestUpdateLane(fiber);
    const update = createUpdate(lane);
    update.payload = payload;

    if (callback !== undefined && callback !== null) {
      {
        warnOnInvalidCallback(callback);
      }

      update.callback = callback;
    }

    const root = enqueueUpdate(fiber, update, lane);

    if (root !== null) {
      scheduleUpdateOnFiber(root, fiber, lane);
      entangleTransitions(root, fiber, lane);
    }
  },

  enqueueReplaceState(inst, payload, callback) {
    const fiber = get(inst);
    const lane = requestUpdateLane(fiber);
    const update = createUpdate(lane);
    update.tag = ReplaceState;
    update.payload = payload;

    if (callback !== undefined && callback !== null) {
      {
        warnOnInvalidCallback(callback);
      }

      update.callback = callback;
    }

    const root = enqueueUpdate(fiber, update, lane);

    if (root !== null) {
      scheduleUpdateOnFiber(root, fiber, lane);
      entangleTransitions(root, fiber, lane);
    }
  },

  enqueueForceUpdate(inst, callback) {
    const fiber = get(inst);
    const lane = requestUpdateLane(fiber);
    const update = createUpdate(lane);
    update.tag = ForceUpdate;

    if (callback !== undefined && callback !== null) {
      {
        warnOnInvalidCallback(callback);
      }

      update.callback = callback;
    }

    const root = enqueueUpdate(fiber, update, lane);

    if (root !== null) {
      scheduleUpdateOnFiber(root, fiber, lane);
      entangleTransitions(root, fiber, lane);
    }
  }

};

function checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext) {
  const instance = workInProgress.stateNode;

  if (typeof instance.shouldComponentUpdate === 'function') {
    let shouldUpdate = instance.shouldComponentUpdate(newProps, newState, nextContext);

    {
      if (workInProgress.mode & StrictLegacyMode) {
        setIsStrictModeForDevtools(true);

        try {
          shouldUpdate = instance.shouldComponentUpdate(newProps, newState, nextContext);
        } finally {
          setIsStrictModeForDevtools(false);
        }
      }

      if (shouldUpdate === undefined) {
        console.error('%s.shouldComponentUpdate(): Returned undefined instead of a ' + 'boolean value. Make sure to return true or false.', getComponentNameFromType(ctor) || 'Component');
      }
    }

    return shouldUpdate;
  }

  if (ctor.prototype && ctor.prototype.isPureReactComponent) {
    return !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState);
  }

  return true;
}

function checkClassInstance(workInProgress, ctor, newProps) {
  const instance = workInProgress.stateNode;

  {
    const name = getComponentNameFromType(ctor) || 'Component';
    const renderPresent = instance.render;

    if (!renderPresent) {
      if (ctor.prototype && typeof ctor.prototype.render === 'function') {
        console.error('No `render` method found on the %s ' + 'instance: did you accidentally return an object from the constructor?', name);
      } else {
        console.error('No `render` method found on the %s ' + 'instance: you may have forgotten to define `render`.', name);
      }
    }

    if (instance.getInitialState && !instance.getInitialState.isReactClassApproved && !instance.state) {
      console.error('getInitialState was defined on %s, a plain JavaScript class. ' + 'This is only supported for classes created using React.createClass. ' + 'Did you mean to define a state property instead?', name);
    }

    if (instance.getDefaultProps && !instance.getDefaultProps.isReactClassApproved) {
      console.error('getDefaultProps was defined on %s, a plain JavaScript class. ' + 'This is only supported for classes created using React.createClass. ' + 'Use a static property to define defaultProps instead.', name);
    }

    if (instance.contextType) {
      console.error('contextType was defined as an instance property on %s. Use a static ' + 'property to define contextType instead.', name);
    }

    {
      if (ctor.childContextTypes && !didWarnAboutChildContextTypes.has(ctor)) {
        didWarnAboutChildContextTypes.add(ctor);
        console.error('%s uses the legacy childContextTypes API which was removed in React 19. ' + 'Use React.createContext() instead. (https://react.dev/link/legacy-context)', name);
      }

      if (ctor.contextTypes && !didWarnAboutContextTypes$1.has(ctor)) {
        didWarnAboutContextTypes$1.add(ctor);
        console.error('%s uses the legacy contextTypes API which was removed in React 19. ' + 'Use React.createContext() with static contextType instead. ' + '(https://react.dev/link/legacy-context)', name);
      }
    }

    if (typeof instance.componentShouldUpdate === 'function') {
      console.error('%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', name);
    }

    if (ctor.prototype && ctor.prototype.isPureReactComponent && typeof instance.shouldComponentUpdate !== 'undefined') {
      console.error('%s has a method called shouldComponentUpdate(). ' + 'shouldComponentUpdate should not be used when extending React.PureComponent. ' + 'Please extend React.Component if shouldComponentUpdate is used.', getComponentNameFromType(ctor) || 'A pure component');
    }

    if (typeof instance.componentDidUnmount === 'function') {
      console.error('%s has a method called ' + 'componentDidUnmount(). But there is no such lifecycle method. ' + 'Did you mean componentWillUnmount()?', name);
    }

    if (typeof instance.componentDidReceiveProps === 'function') {
      console.error('%s has a method called ' + 'componentDidReceiveProps(). But there is no such lifecycle method. ' + 'If you meant to update the state in response to changing props, ' + 'use componentWillReceiveProps(). If you meant to fetch data or ' + 'run side-effects or mutations after React has updated the UI, use componentDidUpdate().', name);
    }

    if (typeof instance.componentWillRecieveProps === 'function') {
      console.error('%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', name);
    }

    if (typeof instance.UNSAFE_componentWillRecieveProps === 'function') {
      console.error('%s has a method called ' + 'UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?', name);
    }

    const hasMutatedProps = instance.props !== newProps;

    if (instance.props !== undefined && hasMutatedProps) {
      console.error('When calling super() in `%s`, make sure to pass ' + "up the same props that your component's constructor was passed.", name);
    }

    if (instance.defaultProps) {
      console.error('Setting defaultProps as an instance property on %s is not supported and will be ignored.' + ' Instead, define defaultProps as a static property on %s.', name, name);
    }

    if (typeof instance.getSnapshotBeforeUpdate === 'function' && typeof instance.componentDidUpdate !== 'function' && !didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.has(ctor)) {
      didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.add(ctor);
      console.error('%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). ' + 'This component defines getSnapshotBeforeUpdate() only.', getComponentNameFromType(ctor));
    }

    if (typeof instance.getDerivedStateFromProps === 'function') {
      console.error('%s: getDerivedStateFromProps() is defined as an instance method ' + 'and will be ignored. Instead, declare it as a static method.', name);
    }

    if (typeof instance.getDerivedStateFromError === 'function') {
      console.error('%s: getDerivedStateFromError() is defined as an instance method ' + 'and will be ignored. Instead, declare it as a static method.', name);
    }

    if (typeof ctor.getSnapshotBeforeUpdate === 'function') {
      console.error('%s: getSnapshotBeforeUpdate() is defined as a static method ' + 'and will be ignored. Instead, declare it as an instance method.', name);
    }

    const state = instance.state;

    if (state && (typeof state !== 'object' || isArray(state))) {
      console.error('%s.state: must be set to an object or null', name);
    }

    if (typeof instance.getChildContext === 'function' && typeof ctor.childContextTypes !== 'object') {
      console.error('%s.getChildContext(): childContextTypes must be defined in order to ' + 'use getChildContext().', name);
    }
  }
}

function constructClassInstance(workInProgress, ctor, props) {
  let context = emptyContextObject;
  const contextType = ctor.contextType;

  {
    if ('contextType' in ctor) {
      const isValid = contextType === null || contextType !== undefined && contextType.$$typeof === REACT_CONTEXT_TYPE;

      if (!isValid && !didWarnAboutInvalidateContextType.has(ctor)) {
        didWarnAboutInvalidateContextType.add(ctor);
        let addendum = '';

        if (contextType === undefined) {
          addendum = ' However, it is set to undefined. ' + 'This can be caused by a typo or by mixing up named and default imports. ' + 'This can also happen due to a circular dependency, so ' + 'try moving the createContext() call to a separate file.';
        } else if (typeof contextType !== 'object') {
          addendum = ' However, it is set to a ' + typeof contextType + '.';
        } else if (contextType.$$typeof === REACT_CONSUMER_TYPE) {
          addendum = ' Did you accidentally pass the Context.Consumer instead?';
        } else {
          addendum = ' However, it is set to an object with keys {' + Object.keys(contextType).join(', ') + '}.';
        }

        console.error('%s defines an invalid contextType. ' + 'contextType should point to the Context object returned by React.createContext().%s', getComponentNameFromType(ctor) || 'Component', addendum);
      }
    }
  }

  if (typeof contextType === 'object' && contextType !== null) {
    context = readContext(contextType);
  }

  let instance = new ctor(props, context);

  {
    if (workInProgress.mode & StrictLegacyMode) {
      setIsStrictModeForDevtools(true);

      try {
        instance = new ctor(props, context);
      } finally {
        setIsStrictModeForDevtools(false);
      }
    }
  }

  const state = workInProgress.memoizedState = instance.state !== null && instance.state !== undefined ? instance.state : null;
  instance.updater = classComponentUpdater;
  workInProgress.stateNode = instance;
  set(instance, workInProgress);

  {
    instance._reactInternalInstance = fakeInternalInstance;
  }

  {
    if (typeof ctor.getDerivedStateFromProps === 'function' && state === null) {
      const componentName = getComponentNameFromType(ctor) || 'Component';

      if (!didWarnAboutUninitializedState.has(componentName)) {
        didWarnAboutUninitializedState.add(componentName);
        console.error('`%s` uses `getDerivedStateFromProps` but its initial state is ' + '%s. This is not recommended. Instead, define the initial state by ' + 'assigning an object to `this.state` in the constructor of `%s`. ' + 'This ensures that `getDerivedStateFromProps` arguments have a consistent shape.', componentName, instance.state === null ? 'null' : 'undefined', componentName);
      }
    }

    if (typeof ctor.getDerivedStateFromProps === 'function' || typeof instance.getSnapshotBeforeUpdate === 'function') {
      let foundWillMountName = null;
      let foundWillReceivePropsName = null;
      let foundWillUpdateName = null;

      if (typeof instance.componentWillMount === 'function' && instance.componentWillMount.__suppressDeprecationWarning !== true) {
        foundWillMountName = 'componentWillMount';
      } else if (typeof instance.UNSAFE_componentWillMount === 'function') {
        foundWillMountName = 'UNSAFE_componentWillMount';
      }

      if (typeof instance.componentWillReceiveProps === 'function' && instance.componentWillReceiveProps.__suppressDeprecationWarning !== true) {
        foundWillReceivePropsName = 'componentWillReceiveProps';
      } else if (typeof instance.UNSAFE_componentWillReceiveProps === 'function') {
        foundWillReceivePropsName = 'UNSAFE_componentWillReceiveProps';
      }

      if (typeof instance.componentWillUpdate === 'function' && instance.componentWillUpdate.__suppressDeprecationWarning !== true) {
        foundWillUpdateName = 'componentWillUpdate';
      } else if (typeof instance.UNSAFE_componentWillUpdate === 'function') {
        foundWillUpdateName = 'UNSAFE_componentWillUpdate';
      }

      if (foundWillMountName !== null || foundWillReceivePropsName !== null || foundWillUpdateName !== null) {
        const componentName = getComponentNameFromType(ctor) || 'Component';
        const newApiName = typeof ctor.getDerivedStateFromProps === 'function' ? 'getDerivedStateFromProps()' : 'getSnapshotBeforeUpdate()';

        if (!didWarnAboutLegacyLifecyclesAndDerivedState.has(componentName)) {
          didWarnAboutLegacyLifecyclesAndDerivedState.add(componentName);
          console.error('Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' + '%s uses %s but also contains the following legacy lifecycles:%s%s%s\n\n' + 'The above lifecycles should be removed. Learn more about this warning here:\n' + 'https://react.dev/link/unsafe-component-lifecycles', componentName, newApiName, foundWillMountName !== null ? `\n  ${foundWillMountName}` : '', foundWillReceivePropsName !== null ? `\n  ${foundWillReceivePropsName}` : '', foundWillUpdateName !== null ? `\n  ${foundWillUpdateName}` : '');
        }
      }
    }
  }

  return instance;
}

function callComponentWillMount(workInProgress, instance) {
  const oldState = instance.state;

  if (typeof instance.componentWillMount === 'function') {
    instance.componentWillMount();
  }

  if (typeof instance.UNSAFE_componentWillMount === 'function') {
    instance.UNSAFE_componentWillMount();
  }

  if (oldState !== instance.state) {
    {
      console.error('%s.componentWillMount(): Assigning directly to this.state is ' + "deprecated (except inside a component's " + 'constructor). Use setState instead.', getComponentNameFromFiber(workInProgress) || 'Component');
    }

    classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
  }
}

function callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext) {
  const oldState = instance.state;

  if (typeof instance.componentWillReceiveProps === 'function') {
    instance.componentWillReceiveProps(newProps, nextContext);
  }

  if (typeof instance.UNSAFE_componentWillReceiveProps === 'function') {
    instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
  }

  if (instance.state !== oldState) {
    {
      const componentName = getComponentNameFromFiber(workInProgress) || 'Component';

      if (!didWarnAboutStateAssignmentForComponent.has(componentName)) {
        didWarnAboutStateAssignmentForComponent.add(componentName);
        console.error('%s.componentWillReceiveProps(): Assigning directly to ' + "this.state is deprecated (except inside a component's " + 'constructor). Use setState instead.', componentName);
      }
    }

    classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
  }
}

function mountClassInstance(workInProgress, ctor, newProps, renderLanes) {
  {
    checkClassInstance(workInProgress, ctor, newProps);
  }

  const instance = workInProgress.stateNode;
  instance.props = newProps;
  instance.state = workInProgress.memoizedState;
  instance.refs = {};
  initializeUpdateQueue(workInProgress);
  const contextType = ctor.contextType;

  if (typeof contextType === 'object' && contextType !== null) {
    instance.context = readContext(contextType);
  } else {
    instance.context = emptyContextObject;
  }

  {
    if (instance.state === newProps) {
      const componentName = getComponentNameFromType(ctor) || 'Component';

      if (!didWarnAboutDirectlyAssigningPropsToState.has(componentName)) {
        didWarnAboutDirectlyAssigningPropsToState.add(componentName);
        console.error('%s: It is not recommended to assign props directly to state ' + "because updates to props won't be reflected in state. " + 'In most cases, it is better to use props directly.', componentName);
      }
    }

    if (workInProgress.mode & StrictLegacyMode) {
      ReactStrictModeWarnings.recordLegacyContextWarning(workInProgress, instance);
    }

    ReactStrictModeWarnings.recordUnsafeLifecycleWarnings(workInProgress, instance);
  }

  instance.state = workInProgress.memoizedState;
  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;

  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps);
    instance.state = workInProgress.memoizedState;
  }

  if (typeof ctor.getDerivedStateFromProps !== 'function' && typeof instance.getSnapshotBeforeUpdate !== 'function' && (typeof instance.UNSAFE_componentWillMount === 'function' || typeof instance.componentWillMount === 'function')) {
    callComponentWillMount(workInProgress, instance);
    processUpdateQueue(workInProgress, newProps, instance, renderLanes);
    suspendIfUpdateReadFromEntangledAsyncAction();
    instance.state = workInProgress.memoizedState;
  }

  if (typeof instance.componentDidMount === 'function') {
    workInProgress.flags |= Update | LayoutStatic;
  }

  if ((workInProgress.mode & StrictEffectsMode) !== NoMode) {
    workInProgress.flags |= MountLayoutDev;
  }
}

function resumeMountClassInstance(workInProgress, ctor, newProps, renderLanes) {
  const instance = workInProgress.stateNode;
  const unresolvedOldProps = workInProgress.memoizedProps;
  const oldProps = resolveClassComponentProps(ctor, unresolvedOldProps);
  instance.props = oldProps;
  const oldContext = instance.context;
  const contextType = ctor.contextType;
  let nextContext = emptyContextObject;

  if (typeof contextType === 'object' && contextType !== null) {
    nextContext = readContext(contextType);
  }

  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  const hasNewLifecycles = typeof getDerivedStateFromProps === 'function' || typeof instance.getSnapshotBeforeUpdate === 'function';
  const unresolvedNewProps = workInProgress.pendingProps;
  const didReceiveNewProps = unresolvedNewProps !== unresolvedOldProps;

  if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillReceiveProps === 'function' || typeof instance.componentWillReceiveProps === 'function')) {
    if (didReceiveNewProps || oldContext !== nextContext) {
      callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext);
    }
  }

  resetHasForceUpdateBeforeProcessing();
  const oldState = workInProgress.memoizedState;
  let newState = instance.state = oldState;
  processUpdateQueue(workInProgress, newProps, instance, renderLanes);
  suspendIfUpdateReadFromEntangledAsyncAction();
  newState = workInProgress.memoizedState;

  if (!didReceiveNewProps && oldState === newState && !hasContextChanged() && !checkHasForceUpdateAfterProcessing()) {
    if (typeof instance.componentDidMount === 'function') {
      workInProgress.flags |= Update | LayoutStatic;
    }

    if ((workInProgress.mode & StrictEffectsMode) !== NoMode) {
      workInProgress.flags |= MountLayoutDev;
    }

    return false;
  }

  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps);
    newState = workInProgress.memoizedState;
  }

  const shouldUpdate = checkHasForceUpdateAfterProcessing() || checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext);

  if (shouldUpdate) {
    if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillMount === 'function' || typeof instance.componentWillMount === 'function')) {
      if (typeof instance.componentWillMount === 'function') {
        instance.componentWillMount();
      }

      if (typeof instance.UNSAFE_componentWillMount === 'function') {
        instance.UNSAFE_componentWillMount();
      }
    }

    if (typeof instance.componentDidMount === 'function') {
      workInProgress.flags |= Update | LayoutStatic;
    }

    if ((workInProgress.mode & StrictEffectsMode) !== NoMode) {
      workInProgress.flags |= MountLayoutDev;
    }
  } else {
    if (typeof instance.componentDidMount === 'function') {
      workInProgress.flags |= Update | LayoutStatic;
    }

    if ((workInProgress.mode & StrictEffectsMode) !== NoMode) {
      workInProgress.flags |= MountLayoutDev;
    }

    workInProgress.memoizedProps = newProps;
    workInProgress.memoizedState = newState;
  }

  instance.props = newProps;
  instance.state = newState;
  instance.context = nextContext;
  return shouldUpdate;
}

function updateClassInstance(current, workInProgress, ctor, newProps, renderLanes) {
  const instance = workInProgress.stateNode;
  cloneUpdateQueue(current, workInProgress);
  const unresolvedOldProps = workInProgress.memoizedProps;
  const oldProps = resolveClassComponentProps(ctor, unresolvedOldProps);
  instance.props = oldProps;
  const unresolvedNewProps = workInProgress.pendingProps;
  const oldContext = instance.context;
  const contextType = ctor.contextType;
  let nextContext = emptyContextObject;

  if (typeof contextType === 'object' && contextType !== null) {
    nextContext = readContext(contextType);
  }

  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  const hasNewLifecycles = typeof getDerivedStateFromProps === 'function' || typeof instance.getSnapshotBeforeUpdate === 'function';

  if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillReceiveProps === 'function' || typeof instance.componentWillReceiveProps === 'function')) {
    if (unresolvedOldProps !== unresolvedNewProps || oldContext !== nextContext) {
      callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext);
    }
  }

  resetHasForceUpdateBeforeProcessing();
  const oldState = workInProgress.memoizedState;
  let newState = instance.state = oldState;
  processUpdateQueue(workInProgress, newProps, instance, renderLanes);
  suspendIfUpdateReadFromEntangledAsyncAction();
  newState = workInProgress.memoizedState;

  if (unresolvedOldProps === unresolvedNewProps && oldState === newState && !hasContextChanged() && !checkHasForceUpdateAfterProcessing() && !(current !== null && current.dependencies !== null && checkIfContextChanged(current.dependencies))) {
    if (typeof instance.componentDidUpdate === 'function') {
      if (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress.flags |= Update;
      }
    }

    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      if (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress.flags |= Snapshot;
      }
    }

    return false;
  }

  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps);
    newState = workInProgress.memoizedState;
  }

  const shouldUpdate = checkHasForceUpdateAfterProcessing() || checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext) || current !== null && current.dependencies !== null && checkIfContextChanged(current.dependencies);

  if (shouldUpdate) {
    if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillUpdate === 'function' || typeof instance.componentWillUpdate === 'function')) {
      if (typeof instance.componentWillUpdate === 'function') {
        instance.componentWillUpdate(newProps, newState, nextContext);
      }

      if (typeof instance.UNSAFE_componentWillUpdate === 'function') {
        instance.UNSAFE_componentWillUpdate(newProps, newState, nextContext);
      }
    }

    if (typeof instance.componentDidUpdate === 'function') {
      workInProgress.flags |= Update;
    }

    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      workInProgress.flags |= Snapshot;
    }
  } else {
    if (typeof instance.componentDidUpdate === 'function') {
      if (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress.flags |= Update;
      }
    }

    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      if (unresolvedOldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress.flags |= Snapshot;
      }
    }

    workInProgress.memoizedProps = newProps;
    workInProgress.memoizedState = newState;
  }

  instance.props = newProps;
  instance.state = newState;
  instance.context = nextContext;
  return shouldUpdate;
}

function resolveClassComponentProps(Component, baseProps, alreadyResolvedDefaultProps) {
  let newProps = baseProps;

  if ('ref' in baseProps) {
    newProps = {};

    for (const propName in baseProps) {
      if (propName !== 'ref') {
        newProps[propName] = baseProps[propName];
      }
    }
  }

  const defaultProps = Component.defaultProps;

  if (defaultProps && (disableDefaultPropsExceptForClasses )) {
    if (newProps === baseProps) {
      newProps = assign({}, newProps);
    }

    for (const propName in defaultProps) {
      if (newProps[propName] === undefined) {
        newProps[propName] = defaultProps[propName];
      }
    }
  }

  return newProps;
}

const reportGlobalError = typeof reportError === 'function' ? reportError : error => {
  if (typeof window === 'object' && typeof window.ErrorEvent === 'function') {
    const message = typeof error === 'object' && error !== null && typeof error.message === 'string' ? String(error.message) : String(error);
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
  } else if (typeof process === 'object' && typeof process.emit === 'function') {
    process.emit('uncaughtException', error);
    return;
  }

  console['error'](error);
};

let componentName = null;
let errorBoundaryName = null;
function defaultOnUncaughtError(error, errorInfo) {
  reportGlobalError(error);

  {
    const componentNameMessage = componentName ? `An error occurred in the <${componentName}> component.` : 'An error occurred in one of your React components.';
    const errorBoundaryMessage = 'Consider adding an error boundary to your tree to customize error handling behavior.\n' + 'Visit https://react.dev/link/error-boundaries to learn more about error boundaries.';
    const prevGetCurrentStack = ReactSharedInternals.getCurrentStack;

    {
      const componentStack = errorInfo.componentStack != null ? errorInfo.componentStack : '';

      ReactSharedInternals.getCurrentStack = function () {
        return componentStack;
      };
    }

    try {
      console.warn('%s\n\n%s\n', componentNameMessage, errorBoundaryMessage);
    } finally {
      {
        ReactSharedInternals.getCurrentStack = prevGetCurrentStack;
      }
    }
  }
}
function defaultOnCaughtError(error, errorInfo) {
  {
    const componentNameMessage = componentName ? `The above error occurred in the <${componentName}> component.` : 'The above error occurred in one of your React components.';
    const recreateMessage = `React will try to recreate this component tree from scratch ` + `using the error boundary you provided, ${errorBoundaryName || 'Anonymous'}.`;
    const prevGetCurrentStack = ReactSharedInternals.getCurrentStack;

    {
      const componentStack = errorInfo.componentStack != null ? errorInfo.componentStack : '';

      ReactSharedInternals.getCurrentStack = function () {
        return componentStack;
      };
    }

    try {
      if (typeof error === 'object' && error !== null && typeof error.environmentName === 'string') {
        bindToConsole('error', ['%o\n\n%s\n\n%s\n', error, componentNameMessage, recreateMessage], error.environmentName)();
      } else {
        console.error('%o\n\n%s\n\n%s\n', error, componentNameMessage, recreateMessage);
      }
    } finally {
      {
        ReactSharedInternals.getCurrentStack = prevGetCurrentStack;
      }
    }
  }
}
function defaultOnRecoverableError(error, errorInfo) {
  reportGlobalError(error);
}
function logUncaughtError(root, errorInfo) {
  try {
    if (true) {
      componentName = errorInfo.source ? getComponentNameFromFiber(errorInfo.source) : null;
      errorBoundaryName = null;
    }

    const error = errorInfo.value;

    if (true && ReactSharedInternals.actQueue !== null) {
      ReactSharedInternals.thrownErrors.push(error);
      return;
    }

    const onUncaughtError = root.onUncaughtError;
    onUncaughtError(error, {
      componentStack: errorInfo.stack
    });
  } catch (e) {
    setTimeout(() => {
      throw e;
    });
  }
}
function logCaughtError(root, boundary, errorInfo) {
  try {
    if (true) {
      componentName = errorInfo.source ? getComponentNameFromFiber(errorInfo.source) : null;
      errorBoundaryName = getComponentNameFromFiber(boundary);
    }

    const error = errorInfo.value;
    const onCaughtError = root.onCaughtError;
    onCaughtError(error, {
      componentStack: errorInfo.stack,
      errorBoundary: boundary.tag === ClassComponent ? boundary.stateNode : null
    });
  } catch (e) {
    setTimeout(() => {
      throw e;
    });
  }
}

function createRootErrorUpdate(root, errorInfo, lane) {
  const update = createUpdate(lane);
  update.tag = CaptureUpdate;
  update.payload = {
    element: null
  };

  update.callback = () => {
    {
      runWithFiberInDEV(errorInfo.source, logUncaughtError, root, errorInfo);
    }
  };

  return update;
}

function createClassErrorUpdate(lane) {
  const update = createUpdate(lane);
  update.tag = CaptureUpdate;
  return update;
}

function initializeClassErrorUpdate(update, root, fiber, errorInfo) {
  const getDerivedStateFromError = fiber.type.getDerivedStateFromError;

  if (typeof getDerivedStateFromError === 'function') {
    const error = errorInfo.value;

    update.payload = () => {
      return getDerivedStateFromError(error);
    };

    update.callback = () => {
      {
        markFailedErrorBoundaryForHotReloading(fiber);
      }

      {
        runWithFiberInDEV(errorInfo.source, logCaughtError, root, fiber, errorInfo);
      }
    };
  }

  const inst = fiber.stateNode;

  if (inst !== null && typeof inst.componentDidCatch === 'function') {
    update.callback = function callback() {
      {
        markFailedErrorBoundaryForHotReloading(fiber);
      }

      {
        runWithFiberInDEV(errorInfo.source, logCaughtError, root, fiber, errorInfo);
      }

      if (typeof getDerivedStateFromError !== 'function') {
        markLegacyErrorBoundaryAsFailed(this);
      }

      {
        callComponentDidCatchInDEV(this, errorInfo);
      }

      {
        if (typeof getDerivedStateFromError !== 'function') {
          if (!includesSomeLane(fiber.lanes, SyncLane)) {
            console.error('%s: Error boundaries should implement getDerivedStateFromError(). ' + 'In that method, return a state update to display an error message or fallback UI.', getComponentNameFromFiber(fiber) || 'Unknown');
          }
        }
      }
    };
  }
}

function resetSuspendedComponent(sourceFiber, rootRenderLanes) {
  {
    const currentSourceFiber = sourceFiber.alternate;

    if (currentSourceFiber !== null) {
      propagateParentContextChangesToDeferredTree(currentSourceFiber, sourceFiber, rootRenderLanes);
    }
  }
}

function markSuspenseBoundaryShouldCapture(suspenseBoundary, returnFiber, sourceFiber, root, rootRenderLanes) {

  suspenseBoundary.flags |= ShouldCapture;
  suspenseBoundary.lanes = rootRenderLanes;
  return suspenseBoundary;
}

function throwException(root, returnFiber, sourceFiber, value, rootRenderLanes) {
  sourceFiber.flags |= Incomplete;

  if (value !== null && typeof value === 'object') {

    if (typeof value.then === 'function') {
      const wakeable = value;
      resetSuspendedComponent(sourceFiber, rootRenderLanes);

      {
        if (getIsHydrating() && (disableLegacyMode )) {
          markDidThrowWhileHydratingDEV();
        }
      }

      const suspenseBoundary = getSuspenseHandler();

      if (suspenseBoundary !== null) {
        switch (suspenseBoundary.tag) {
          case SuspenseComponent:
            {
              {
                if (getShellBoundary() === null) {
                  renderDidSuspendDelayIfPossible();
                } else {
                  const current = suspenseBoundary.alternate;

                  if (current === null) {
                    renderDidSuspend();
                  }
                }
              }

              suspenseBoundary.flags &= ~ForceClientRender;
              markSuspenseBoundaryShouldCapture(suspenseBoundary, returnFiber, sourceFiber, root, rootRenderLanes);
              const isSuspenseyResource = wakeable === noopSuspenseyCommitThenable;

              if (isSuspenseyResource) {
                suspenseBoundary.flags |= ScheduleRetry;
              } else {
                const retryQueue = suspenseBoundary.updateQueue;

                if (retryQueue === null) {
                  suspenseBoundary.updateQueue = new Set([wakeable]);
                } else {
                  retryQueue.add(wakeable);
                }

                {
                  attachPingListener(root, wakeable, rootRenderLanes);
                }
              }

              return false;
            }

          case OffscreenComponent:
            {
              {
                suspenseBoundary.flags |= ShouldCapture;
                const isSuspenseyResource = wakeable === noopSuspenseyCommitThenable;

                if (isSuspenseyResource) {
                  suspenseBoundary.flags |= ScheduleRetry;
                } else {
                  const offscreenQueue = suspenseBoundary.updateQueue;

                  if (offscreenQueue === null) {
                    const newOffscreenQueue = {
                      transitions: null,
                      markerInstances: null,
                      retryQueue: new Set([wakeable])
                    };
                    suspenseBoundary.updateQueue = newOffscreenQueue;
                  } else {
                    const retryQueue = offscreenQueue.retryQueue;

                    if (retryQueue === null) {
                      offscreenQueue.retryQueue = new Set([wakeable]);
                    } else {
                      retryQueue.add(wakeable);
                    }
                  }

                  attachPingListener(root, wakeable, rootRenderLanes);
                }

                return false;
              }
            }
        }

        throw new Error(`Unexpected Suspense handler tag (${suspenseBoundary.tag}). This ` + 'is a bug in React.');
      } else {
        {
          attachPingListener(root, wakeable, rootRenderLanes);
          renderDidSuspendDelayIfPossible();
          return false;
        }
      }
    }
  }

  if (getIsHydrating() && (disableLegacyMode )) {
    markDidThrowWhileHydratingDEV();
    const suspenseBoundary = getSuspenseHandler();

    if (suspenseBoundary !== null) {
      if ((suspenseBoundary.flags & ShouldCapture) === NoFlags$1) {
        suspenseBoundary.flags |= ForceClientRender;
      }

      markSuspenseBoundaryShouldCapture(suspenseBoundary, returnFiber, sourceFiber, root, rootRenderLanes);

      if (value !== HydrationMismatchException) {
        const wrapperError = new Error('There was an error while hydrating but React was able to recover by ' + 'instead client rendering from the nearest Suspense boundary.', {
          cause: value
        });
        queueHydrationError(createCapturedValueAtFiber(wrapperError, sourceFiber));
      }

      return false;
    } else {
      if (value !== HydrationMismatchException) {
        const wrapperError = new Error('There was an error while hydrating but React was able to recover by ' + 'instead client rendering the entire root.', {
          cause: value
        });
        queueHydrationError(createCapturedValueAtFiber(wrapperError, sourceFiber));
      }

      const workInProgress = root.current.alternate;
      workInProgress.flags |= ShouldCapture;
      const lane = pickArbitraryLane(rootRenderLanes);
      workInProgress.lanes = mergeLanes(workInProgress.lanes, lane);
      const rootErrorInfo = createCapturedValueAtFiber(value, sourceFiber);
      const update = createRootErrorUpdate(workInProgress.stateNode, rootErrorInfo, lane);
      enqueueCapturedUpdate(workInProgress, update);
      renderDidError();
      return false;
    }
  }

  const wrapperError = new Error('There was an error during concurrent rendering but React was able to recover by ' + 'instead synchronously rendering the entire root.', {
    cause: value
  });
  queueConcurrentError(createCapturedValueAtFiber(wrapperError, sourceFiber));
  renderDidError();

  if (returnFiber === null) {
    return true;
  }

  const errorInfo = createCapturedValueAtFiber(value, sourceFiber);
  let workInProgress = returnFiber;

  do {
    switch (workInProgress.tag) {
      case HostRoot:
        {
          workInProgress.flags |= ShouldCapture;
          const lane = pickArbitraryLane(rootRenderLanes);
          workInProgress.lanes = mergeLanes(workInProgress.lanes, lane);
          const update = createRootErrorUpdate(workInProgress.stateNode, errorInfo, lane);
          enqueueCapturedUpdate(workInProgress, update);
          return false;
        }

      case ClassComponent:
        const ctor = workInProgress.type;
        const instance = workInProgress.stateNode;

        if ((workInProgress.flags & DidCapture) === NoFlags$1 && (typeof ctor.getDerivedStateFromError === 'function' || instance !== null && typeof instance.componentDidCatch === 'function' && !isAlreadyFailedLegacyErrorBoundary(instance))) {
          workInProgress.flags |= ShouldCapture;
          const lane = pickArbitraryLane(rootRenderLanes);
          workInProgress.lanes = mergeLanes(workInProgress.lanes, lane);
          const update = createClassErrorUpdate(lane);
          initializeClassErrorUpdate(update, root, workInProgress, errorInfo);
          enqueueCapturedUpdate(workInProgress, update);
          return false;
        }

        break;
    }

    workInProgress = workInProgress.return;
  } while (workInProgress !== null);

  return false;
}

const SelectiveHydrationException = new Error("This is not a real error. It's an implementation detail of React's " + "selective hydration feature. If this leaks into userspace, it's a bug in " + 'React. Please file an issue.');
let didReceiveUpdate = false;
let didWarnAboutBadClass;
let didWarnAboutContextTypeOnFunctionComponent;
let didWarnAboutContextTypes;
let didWarnAboutGetDerivedStateOnFunctionComponent;
let didWarnAboutReassigningProps;
let didWarnAboutRevealOrder;
let didWarnAboutTailOptions;

{
  didWarnAboutBadClass = {};
  didWarnAboutContextTypeOnFunctionComponent = {};
  didWarnAboutContextTypes = {};
  didWarnAboutGetDerivedStateOnFunctionComponent = {};
  didWarnAboutReassigningProps = false;
  didWarnAboutRevealOrder = {};
  didWarnAboutTailOptions = {};
}

function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderLanes);
  } else {
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren, renderLanes);
  }
}

function forceUnmountCurrentAndReconcile(current, workInProgress, nextChildren, renderLanes) {
  workInProgress.child = reconcileChildFibers(workInProgress, current.child, null, renderLanes);
  workInProgress.child = reconcileChildFibers(workInProgress, null, nextChildren, renderLanes);
}

function updateForwardRef(current, workInProgress, Component, nextProps, renderLanes) {
  const render = Component.render;
  const ref = workInProgress.ref;
  let propsWithoutRef;

  if ('ref' in nextProps) {
    propsWithoutRef = {};

    for (const key in nextProps) {
      if (key !== 'ref') {
        propsWithoutRef[key] = nextProps[key];
      }
    }
  } else {
    propsWithoutRef = nextProps;
  }

  let nextChildren;
  let hasId;
  prepareToReadContext(workInProgress);

  {
    nextChildren = renderWithHooks(current, workInProgress, render, propsWithoutRef, ref, renderLanes);
    hasId = checkDidRenderIdHook();
  }

  if (current !== null && !didReceiveUpdate) {
    bailoutHooks(current, workInProgress, renderLanes);
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  if (getIsHydrating() && hasId) {
    pushMaterializedTreeId(workInProgress);
  }

  workInProgress.flags |= PerformedWork;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateMemoComponent(current, workInProgress, Component, nextProps, renderLanes) {
  if (current === null) {
    const type = Component.type;

    if (isSimpleFunctionComponent(type) && Component.compare === null && (disableDefaultPropsExceptForClasses )) {
      let resolvedType = type;

      {
        resolvedType = resolveFunctionForHotReloading(type);
      }

      workInProgress.tag = SimpleMemoComponent;
      workInProgress.type = resolvedType;

      {
        validateFunctionComponentInDev(workInProgress, type);
      }

      return updateSimpleMemoComponent(current, workInProgress, resolvedType, nextProps, renderLanes);
    }

    const child = createFiberFromTypeAndProps(Component.type, null, nextProps, workInProgress, workInProgress.mode, renderLanes);
    child.ref = workInProgress.ref;
    child.return = workInProgress;
    workInProgress.child = child;
    return child;
  }

  const currentChild = current.child;
  const hasScheduledUpdateOrContext = checkScheduledUpdateOrContext(current, renderLanes);

  if (!hasScheduledUpdateOrContext) {
    const prevProps = currentChild.memoizedProps;
    let compare = Component.compare;
    compare = compare !== null ? compare : shallowEqual;

    if (compare(prevProps, nextProps) && current.ref === workInProgress.ref) {
      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    }
  }

  workInProgress.flags |= PerformedWork;
  const newChild = createWorkInProgress(currentChild, nextProps);
  newChild.ref = workInProgress.ref;
  newChild.return = workInProgress;
  workInProgress.child = newChild;
  return newChild;
}

function updateSimpleMemoComponent(current, workInProgress, Component, nextProps, renderLanes) {
  if (current !== null) {
    const prevProps = current.memoizedProps;

    if (shallowEqual(prevProps, nextProps) && current.ref === workInProgress.ref && (workInProgress.type === current.type )) {
      didReceiveUpdate = false;
      workInProgress.pendingProps = nextProps = prevProps;

      if (!checkScheduledUpdateOrContext(current, renderLanes)) {
        workInProgress.lanes = current.lanes;
        return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
      } else if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags$1) {
        didReceiveUpdate = true;
      }
    }
  }

  return updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes);
}

function updateOffscreenComponent(current, workInProgress, renderLanes) {
  const nextProps = workInProgress.pendingProps;
  const nextChildren = nextProps.children;
  const nextIsDetached = (workInProgress.stateNode._pendingVisibility & OffscreenDetached) !== 0;
  const prevState = current !== null ? current.memoizedState : null;
  markRef(current, workInProgress);

  if (nextProps.mode === 'hidden' || enableLegacyHidden  || nextIsDetached) {
    const didSuspend = (workInProgress.flags & DidCapture) !== NoFlags$1;

    if (didSuspend) {
      const nextBaseLanes = prevState !== null ? mergeLanes(prevState.baseLanes, renderLanes) : renderLanes;

      if (current !== null) {
        let currentChild = workInProgress.child = current.child;
        let currentChildLanes = NoLanes;

        while (currentChild !== null) {
          currentChildLanes = mergeLanes(mergeLanes(currentChildLanes, currentChild.lanes), currentChild.childLanes);
          currentChild = currentChild.sibling;
        }

        const lanesWeJustAttempted = nextBaseLanes;
        const remainingChildLanes = removeLanes(currentChildLanes, lanesWeJustAttempted);
        workInProgress.childLanes = remainingChildLanes;
      } else {
        workInProgress.childLanes = NoLanes;
        workInProgress.child = null;
      }

      return deferHiddenOffscreenComponent(current, workInProgress, nextBaseLanes, renderLanes);
    }

    if (!includesSomeLane(renderLanes, OffscreenLane)) {
      workInProgress.lanes = workInProgress.childLanes = laneToLanes(OffscreenLane);
      const nextBaseLanes = prevState !== null ? mergeLanes(prevState.baseLanes, renderLanes) : renderLanes;
      return deferHiddenOffscreenComponent(current, workInProgress, nextBaseLanes, renderLanes);
    } else {
      const nextState = {
        baseLanes: NoLanes,
        cachePool: null
      };
      workInProgress.memoizedState = nextState;

      if (current !== null) {
        const prevCachePool = prevState !== null ? prevState.cachePool : null;
        pushTransition(workInProgress, prevCachePool);
      }

      if (prevState !== null) {
        pushHiddenContext(workInProgress, prevState);
      } else {
        reuseHiddenContextOnStack(workInProgress);
      }

      pushOffscreenSuspenseHandler(workInProgress);
    }
  } else {
    if (prevState !== null) {
      let prevCachePool = null;

      {
        prevCachePool = prevState.cachePool;
      }

      pushTransition(workInProgress, prevCachePool);
      pushHiddenContext(workInProgress, prevState);
      reuseSuspenseHandlerOnStack(workInProgress);
      workInProgress.memoizedState = null;
    } else {
      {
        if (current !== null) {
          pushTransition(workInProgress, null);
        }
      }

      reuseHiddenContextOnStack(workInProgress);
      reuseSuspenseHandlerOnStack(workInProgress);
    }
  }

  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function deferHiddenOffscreenComponent(current, workInProgress, nextBaseLanes, renderLanes) {
  const nextState = {
    baseLanes: nextBaseLanes,
    cachePool: getOffscreenDeferredCache() 
  };
  workInProgress.memoizedState = nextState;

  {
    if (current !== null) {
      pushTransition(workInProgress, null);
    }
  }

  reuseHiddenContextOnStack(workInProgress);
  pushOffscreenSuspenseHandler(workInProgress);

  if (current !== null) {
    propagateParentContextChangesToDeferredTree(current, workInProgress, renderLanes);
  }

  return null;
}

function updateCacheComponent(current, workInProgress, renderLanes) {

  prepareToReadContext(workInProgress);
  const parentCache = readContext(CacheContext);

  if (current === null) {
    const freshCache = requestCacheFromPool(renderLanes);
    const initialState = {
      parent: parentCache,
      cache: freshCache
    };
    workInProgress.memoizedState = initialState;
    initializeUpdateQueue(workInProgress);
    pushCacheProvider(workInProgress, freshCache);
  } else {
    if (includesSomeLane(current.lanes, renderLanes)) {
      cloneUpdateQueue(current, workInProgress);
      processUpdateQueue(workInProgress, null, null, renderLanes);
      suspendIfUpdateReadFromEntangledAsyncAction();
    }

    const prevState = current.memoizedState;
    const nextState = workInProgress.memoizedState;

    if (prevState.parent !== parentCache) {
      const derivedState = {
        parent: parentCache,
        cache: parentCache
      };
      workInProgress.memoizedState = derivedState;

      if (workInProgress.lanes === NoLanes) {
        const updateQueue = workInProgress.updateQueue;
        workInProgress.memoizedState = updateQueue.baseState = derivedState;
      }

      pushCacheProvider(workInProgress, parentCache);
    } else {
      const nextCache = nextState.cache;
      pushCacheProvider(workInProgress, nextCache);

      if (nextCache !== prevState.cache) {
        propagateContextChange(workInProgress, CacheContext, renderLanes);
      }
    }
  }

  const nextChildren = workInProgress.pendingProps.children;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateFragment(current, workInProgress, renderLanes) {
  const nextChildren = workInProgress.pendingProps;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateMode(current, workInProgress, renderLanes) {
  const nextChildren = workInProgress.pendingProps.children;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateProfiler(current, workInProgress, renderLanes) {

  const nextProps = workInProgress.pendingProps;
  const nextChildren = nextProps.children;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function markRef(current, workInProgress) {
  const ref = workInProgress.ref;

  if (ref === null) {
    if (current !== null && current.ref !== null) {
      workInProgress.flags |= Ref | RefStatic;
    }
  } else {
    if (typeof ref !== 'function' && typeof ref !== 'object') {
      throw new Error('Expected ref to be a function, an object returned by React.createRef(), or undefined/null.');
    }

    if (current === null || current.ref !== ref) {
      workInProgress.flags |= Ref | RefStatic;
    }
  }
}

function updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes) {
  {
    if (Component.prototype && typeof Component.prototype.render === 'function') {
      const componentName = getComponentNameFromType(Component) || 'Unknown';

      if (!didWarnAboutBadClass[componentName]) {
        console.error("The <%s /> component appears to have a render method, but doesn't extend React.Component. " + 'This is likely to cause errors. Change %s to extend React.Component instead.', componentName, componentName);
        didWarnAboutBadClass[componentName] = true;
      }
    }

    if (workInProgress.mode & StrictLegacyMode) {
      ReactStrictModeWarnings.recordLegacyContextWarning(workInProgress, null);
    }

    if (current === null) {
      validateFunctionComponentInDev(workInProgress, workInProgress.type);

      if (Component.contextTypes) {
        const componentName = getComponentNameFromType(Component) || 'Unknown';

        if (!didWarnAboutContextTypes[componentName]) {
          didWarnAboutContextTypes[componentName] = true;

          {
            console.error('%s uses the legacy contextTypes API which was removed in React 19. ' + 'Use React.createContext() with React.useContext() instead. ' + '(https://react.dev/link/legacy-context)', componentName);
          }
        }
      }
    }
  }

  let context;

  let nextChildren;
  let hasId;
  prepareToReadContext(workInProgress);

  {
    nextChildren = renderWithHooks(current, workInProgress, Component, nextProps, context, renderLanes);
    hasId = checkDidRenderIdHook();
  }

  if (current !== null && !didReceiveUpdate) {
    bailoutHooks(current, workInProgress, renderLanes);
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  if (getIsHydrating() && hasId) {
    pushMaterializedTreeId(workInProgress);
  }

  workInProgress.flags |= PerformedWork;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function replayFunctionComponent(current, workInProgress, nextProps, Component, secondArg, renderLanes) {
  prepareToReadContext(workInProgress);

  const nextChildren = replaySuspendedComponentWithHooks(current, workInProgress, Component, nextProps, secondArg);
  const hasId = checkDidRenderIdHook();

  if (current !== null && !didReceiveUpdate) {
    bailoutHooks(current, workInProgress, renderLanes);
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  if (getIsHydrating() && hasId) {
    pushMaterializedTreeId(workInProgress);
  }

  workInProgress.flags |= PerformedWork;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateClassComponent(current, workInProgress, Component, nextProps, renderLanes) {
  {
    switch (shouldError(workInProgress)) {
      case false:
        {
          const instance = workInProgress.stateNode;
          const ctor = workInProgress.type;
          const tempInstance = new ctor(workInProgress.memoizedProps, instance.context);
          const state = tempInstance.state;
          instance.updater.enqueueSetState(instance, state, null);
          break;
        }

      case true:
        {
          workInProgress.flags |= DidCapture;
          workInProgress.flags |= ShouldCapture;
          const error = new Error('Simulated error coming from DevTools');
          const lane = pickArbitraryLane(renderLanes);
          workInProgress.lanes = mergeLanes(workInProgress.lanes, lane);
          const root = getWorkInProgressRoot();

          if (root === null) {
            throw new Error('Expected a work-in-progress root. This is a bug in React. Please file an issue.');
          }

          const update = createClassErrorUpdate(lane);
          initializeClassErrorUpdate(update, root, workInProgress, createCapturedValueAtFiber(error, workInProgress));
          enqueueCapturedUpdate(workInProgress, update);
          break;
        }
    }
  }

  let hasContext;

  if (isContextProvider()) {
    hasContext = true;
  } else {
    hasContext = false;
  }

  prepareToReadContext(workInProgress);
  const instance = workInProgress.stateNode;
  let shouldUpdate;

  if (instance === null) {
    constructClassInstance(workInProgress, Component, nextProps);
    mountClassInstance(workInProgress, Component, nextProps, renderLanes);
    shouldUpdate = true;
  } else if (current === null) {
    shouldUpdate = resumeMountClassInstance(workInProgress, Component, nextProps, renderLanes);
  } else {
    shouldUpdate = updateClassInstance(current, workInProgress, Component, nextProps, renderLanes);
  }

  const nextUnitOfWork = finishClassComponent(current, workInProgress, Component, shouldUpdate, hasContext, renderLanes);

  {
    const inst = workInProgress.stateNode;

    if (shouldUpdate && inst.props !== nextProps) {
      if (!didWarnAboutReassigningProps) {
        console.error('It looks like %s is reassigning its own `this.props` while rendering. ' + 'This is not supported and can lead to confusing bugs.', getComponentNameFromFiber(workInProgress) || 'a component');
      }

      didWarnAboutReassigningProps = true;
    }
  }

  return nextUnitOfWork;
}

function finishClassComponent(current, workInProgress, Component, shouldUpdate, hasContext, renderLanes) {
  markRef(current, workInProgress);
  const didCaptureError = (workInProgress.flags & DidCapture) !== NoFlags$1;

  if (!shouldUpdate && !didCaptureError) {

    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  const instance = workInProgress.stateNode;

  {
    setCurrentFiber(workInProgress);
  }

  let nextChildren;

  if (didCaptureError && typeof Component.getDerivedStateFromError !== 'function') {
    nextChildren = null;
  } else {

    {
      nextChildren = callRenderInDEV(instance);

      if (workInProgress.mode & StrictLegacyMode) {
        setIsStrictModeForDevtools(true);

        try {
          callRenderInDEV(instance);
        } finally {
          setIsStrictModeForDevtools(false);
        }
      }
    }
  }

  workInProgress.flags |= PerformedWork;

  if (current !== null && didCaptureError) {
    forceUnmountCurrentAndReconcile(current, workInProgress, nextChildren, renderLanes);
  } else {
    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  }

  workInProgress.memoizedState = instance.state;

  return workInProgress.child;
}

function pushHostRootContext(workInProgress) {
  const root = workInProgress.stateNode;

  pushHostContainer(workInProgress, root.containerInfo);
}

function updateHostRoot(current, workInProgress, renderLanes) {
  pushHostRootContext(workInProgress);

  if (current === null) {
    throw new Error('Should have a current fiber. This is a bug in React.');
  }

  const nextProps = workInProgress.pendingProps;
  const prevState = workInProgress.memoizedState;
  const prevChildren = prevState.element;
  cloneUpdateQueue(current, workInProgress);
  processUpdateQueue(workInProgress, nextProps, null, renderLanes);
  const nextState = workInProgress.memoizedState;

  {
    const nextCache = nextState.cache;
    pushCacheProvider(workInProgress, nextCache);

    if (nextCache !== prevState.cache) {
      propagateContextChange(workInProgress, CacheContext, renderLanes);
    }
  }

  suspendIfUpdateReadFromEntangledAsyncAction();
  const nextChildren = nextState.element;

  if (prevState.isDehydrated) {
    const overrideState = {
      element: nextChildren,
      isDehydrated: false,
      cache: nextState.cache
    };
    const updateQueue = workInProgress.updateQueue;
    updateQueue.baseState = overrideState;
    workInProgress.memoizedState = overrideState;

    if (workInProgress.flags & ForceClientRender) {
      return mountHostRootWithoutHydrating(current, workInProgress, nextChildren, renderLanes);
    } else if (nextChildren !== prevChildren) {
      const recoverableError = createCapturedValueAtFiber(new Error('This root received an early update, before anything was able ' + 'hydrate. Switched the entire root to client rendering.'), workInProgress);
      queueHydrationError(recoverableError);
      return mountHostRootWithoutHydrating(current, workInProgress, nextChildren, renderLanes);
    } else {
      enterHydrationState(workInProgress);
      const child = mountChildFibers(workInProgress, null, nextChildren, renderLanes);
      workInProgress.child = child;
      let node = child;

      while (node) {
        node.flags = node.flags & ~Placement | Hydrating;
        node = node.sibling;
      }
    }
  } else {
    resetHydrationState();

    if (nextChildren === prevChildren) {
      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    }

    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  }

  return workInProgress.child;
}

function mountHostRootWithoutHydrating(current, workInProgress, nextChildren, renderLanes) {
  resetHydrationState();
  workInProgress.flags |= ForceClientRender;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateHostComponent$1(current, workInProgress, renderLanes) {
  if (current === null) {
    tryToClaimNextHydratableInstance(workInProgress);
  }

  pushHostContext(workInProgress);
  const type = workInProgress.type;
  const nextProps = workInProgress.pendingProps;
  const prevProps = current !== null ? current.memoizedProps : null;
  let nextChildren = nextProps.children;
  const isDirectTextChild = shouldSetTextContent(type, nextProps);

  if (isDirectTextChild) {
    nextChildren = null;
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    workInProgress.flags |= ContentReset;
  }

  {
    const memoizedState = workInProgress.memoizedState;

    if (memoizedState !== null) {
      const newState = renderTransitionAwareHostComponentWithHooks(current, workInProgress, renderLanes);

      {
        HostTransitionContext._currentValue = newState;
      }
    }
  }

  markRef(current, workInProgress);
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function updateHostHoistable(current, workInProgress, renderLanes) {
  markRef(current, workInProgress);

  if (current === null) {
    const resource = getResource(workInProgress.type, null, workInProgress.pendingProps, null);

    if (resource) {
      workInProgress.memoizedState = resource;
    } else {
      if (!getIsHydrating()) {
        workInProgress.stateNode = createHoistableInstance(workInProgress.type, workInProgress.pendingProps, getRootHostContainer(), workInProgress);
      }
    }
  } else {
    workInProgress.memoizedState = getResource(workInProgress.type, current.memoizedProps, workInProgress.pendingProps, current.memoizedState);
  }

  return null;
}

function updateHostSingleton(current, workInProgress, renderLanes) {
  pushHostContext(workInProgress);

  if (current === null) {
    claimHydratableSingleton(workInProgress);
  }

  const nextChildren = workInProgress.pendingProps.children;

  if (current === null && !getIsHydrating()) {
    workInProgress.child = reconcileChildFibers(workInProgress, null, nextChildren, renderLanes);
  } else {
    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  }

  markRef(current, workInProgress);
  return workInProgress.child;
}

function updateHostText$1(current, workInProgress) {
  if (current === null) {
    tryToClaimNextHydratableTextInstance(workInProgress);
  }

  return null;
}

function mountLazyComponent(_current, workInProgress, elementType, renderLanes) {
  const props = workInProgress.pendingProps;
  const lazyComponent = elementType;
  let Component;

  {
    Component = callLazyInitInDEV(lazyComponent);
  }

  workInProgress.type = Component;

  if (typeof Component === 'function') {
    if (isFunctionClassComponent(Component)) {
      const resolvedProps = resolveClassComponentProps(Component, props);
      workInProgress.tag = ClassComponent;

      {
        workInProgress.type = Component = resolveClassForHotReloading(Component);
      }

      return updateClassComponent(null, workInProgress, Component, resolvedProps, renderLanes);
    } else {
      const resolvedProps = props ;
      workInProgress.tag = FunctionComponent;

      {
        validateFunctionComponentInDev(workInProgress, Component);
        workInProgress.type = Component = resolveFunctionForHotReloading(Component);
      }

      return updateFunctionComponent(null, workInProgress, Component, resolvedProps, renderLanes);
    }
  } else if (Component !== undefined && Component !== null) {
    const $$typeof = Component.$$typeof;

    if ($$typeof === REACT_FORWARD_REF_TYPE) {
      const resolvedProps = props ;
      workInProgress.tag = ForwardRef;

      {
        workInProgress.type = Component = resolveForwardRefForHotReloading(Component);
      }

      return updateForwardRef(null, workInProgress, Component, resolvedProps, renderLanes);
    } else if ($$typeof === REACT_MEMO_TYPE) {
      const resolvedProps = props ;
      workInProgress.tag = MemoComponent;
      return updateMemoComponent(null, workInProgress, Component, resolvedProps , renderLanes);
    }
  }

  let hint = '';

  {
    if (Component !== null && typeof Component === 'object' && Component.$$typeof === REACT_LAZY_TYPE) {
      hint = ' Did you wrap a component in React.lazy() more than once?';
    }
  }

  const loggedComponent = getComponentNameFromType(Component) || Component;
  throw new Error(`Element type is invalid. Received a promise that resolves to: ${loggedComponent}. ` + `Lazy element type must resolve to a class or function.${hint}`);
}

function validateFunctionComponentInDev(workInProgress, Component) {
  {
    if (Component && Component.childContextTypes) {
      console.error('childContextTypes cannot be defined on a function component.\n' + '  %s.childContextTypes = ...', Component.displayName || Component.name || 'Component');
    }

    if (typeof Component.getDerivedStateFromProps === 'function') {
      const componentName = getComponentNameFromType(Component) || 'Unknown';

      if (!didWarnAboutGetDerivedStateOnFunctionComponent[componentName]) {
        console.error('%s: Function components do not support getDerivedStateFromProps.', componentName);
        didWarnAboutGetDerivedStateOnFunctionComponent[componentName] = true;
      }
    }

    if (typeof Component.contextType === 'object' && Component.contextType !== null) {
      const componentName = getComponentNameFromType(Component) || 'Unknown';

      if (!didWarnAboutContextTypeOnFunctionComponent[componentName]) {
        console.error('%s: Function components do not support contextType.', componentName);
        didWarnAboutContextTypeOnFunctionComponent[componentName] = true;
      }
    }
  }
}

const SUSPENDED_MARKER = {
  dehydrated: null,
  treeContext: null,
  retryLane: NoLane
};

function mountSuspenseOffscreenState(renderLanes) {
  return {
    baseLanes: renderLanes,
    cachePool: getSuspendedCache()
  };
}

function updateSuspenseOffscreenState(prevOffscreenState, renderLanes) {
  let cachePool = null;

  {
    const prevCachePool = prevOffscreenState.cachePool;

    if (prevCachePool !== null) {
      const parentCache = CacheContext._currentValue ;

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
    baseLanes: mergeLanes(prevOffscreenState.baseLanes, renderLanes),
    cachePool
  };
}

function shouldRemainOnFallback(current, workInProgress, renderLanes) {
  if (current !== null) {
    const suspenseState = current.memoizedState;

    if (suspenseState === null) {
      return false;
    }
  }

  const suspenseContext = suspenseStackCursor.current;
  return hasSuspenseListContext(suspenseContext, ForceSuspenseFallback);
}

function getRemainingWorkInPrimaryTree(current, primaryTreeDidDefer, renderLanes) {
  let remainingLanes = current !== null ? removeLanes(current.childLanes, renderLanes) : NoLanes;

  if (primaryTreeDidDefer) {
    remainingLanes = mergeLanes(remainingLanes, peekDeferredLane());
  }

  return remainingLanes;
}

function updateSuspenseComponent(current, workInProgress, renderLanes) {
  const nextProps = workInProgress.pendingProps;

  {
    if (shouldSuspend(workInProgress)) {
      workInProgress.flags |= DidCapture;
    }
  }

  let showFallback = false;
  const didSuspend = (workInProgress.flags & DidCapture) !== NoFlags$1;

  if (didSuspend || shouldRemainOnFallback(current)) {
    showFallback = true;
    workInProgress.flags &= ~DidCapture;
  }

  const didPrimaryChildrenDefer = (workInProgress.flags & DidDefer) !== NoFlags$1;
  workInProgress.flags &= ~DidDefer;

  if (current === null) {
    if (getIsHydrating()) {
      if (showFallback) {
        pushPrimaryTreeSuspenseHandler(workInProgress);
      } else {
        pushFallbackTreeSuspenseHandler(workInProgress);
      }

      tryToClaimNextHydratableSuspenseInstance(workInProgress);
      const suspenseState = workInProgress.memoizedState;

      if (suspenseState !== null) {
        const dehydrated = suspenseState.dehydrated;

        if (dehydrated !== null) {
          return mountDehydratedSuspenseComponent(workInProgress, dehydrated);
        }
      }

      popSuspenseHandler(workInProgress);
    }

    const nextPrimaryChildren = nextProps.children;
    const nextFallbackChildren = nextProps.fallback;

    if (showFallback) {
      pushFallbackTreeSuspenseHandler(workInProgress);
      const fallbackFragment = mountSuspenseFallbackChildren(workInProgress, nextPrimaryChildren, nextFallbackChildren, renderLanes);
      const primaryChildFragment = workInProgress.child;
      primaryChildFragment.memoizedState = mountSuspenseOffscreenState(renderLanes);
      primaryChildFragment.childLanes = getRemainingWorkInPrimaryTree(current, didPrimaryChildrenDefer, renderLanes);
      workInProgress.memoizedState = SUSPENDED_MARKER;

      return fallbackFragment;
    } else {
      pushPrimaryTreeSuspenseHandler(workInProgress);
      return mountSuspensePrimaryChildren(workInProgress, nextPrimaryChildren);
    }
  } else {
    const prevState = current.memoizedState;

    if (prevState !== null) {
      const dehydrated = prevState.dehydrated;

      if (dehydrated !== null) {
        return updateDehydratedSuspenseComponent(current, workInProgress, didSuspend, didPrimaryChildrenDefer, nextProps, dehydrated, prevState, renderLanes);
      }
    }

    if (showFallback) {
      pushFallbackTreeSuspenseHandler(workInProgress);
      const nextFallbackChildren = nextProps.fallback;
      const nextPrimaryChildren = nextProps.children;
      const fallbackChildFragment = updateSuspenseFallbackChildren(current, workInProgress, nextPrimaryChildren, nextFallbackChildren, renderLanes);
      const primaryChildFragment = workInProgress.child;
      const prevOffscreenState = current.child.memoizedState;
      primaryChildFragment.memoizedState = prevOffscreenState === null ? mountSuspenseOffscreenState(renderLanes) : updateSuspenseOffscreenState(prevOffscreenState, renderLanes);

      primaryChildFragment.childLanes = getRemainingWorkInPrimaryTree(current, didPrimaryChildrenDefer, renderLanes);
      workInProgress.memoizedState = SUSPENDED_MARKER;
      return fallbackChildFragment;
    } else {
      pushPrimaryTreeSuspenseHandler(workInProgress);
      const nextPrimaryChildren = nextProps.children;
      const primaryChildFragment = updateSuspensePrimaryChildren(current, workInProgress, nextPrimaryChildren);
      workInProgress.memoizedState = null;
      return primaryChildFragment;
    }
  }
}

function mountSuspensePrimaryChildren(workInProgress, primaryChildren, renderLanes) {
  const mode = workInProgress.mode;
  const primaryChildProps = {
    mode: 'visible',
    children: primaryChildren
  };
  const primaryChildFragment = mountWorkInProgressOffscreenFiber(primaryChildProps, mode);
  primaryChildFragment.return = workInProgress;
  workInProgress.child = primaryChildFragment;
  return primaryChildFragment;
}

function mountSuspenseFallbackChildren(workInProgress, primaryChildren, fallbackChildren, renderLanes) {
  const mode = workInProgress.mode;
  const primaryChildProps = {
    mode: 'hidden',
    children: primaryChildren
  };
  let primaryChildFragment;
  let fallbackChildFragment;

  {
    primaryChildFragment = mountWorkInProgressOffscreenFiber(primaryChildProps, mode);
    fallbackChildFragment = createFiberFromFragment(fallbackChildren, mode, renderLanes, null);
  }

  primaryChildFragment.return = workInProgress;
  fallbackChildFragment.return = workInProgress;
  primaryChildFragment.sibling = fallbackChildFragment;
  workInProgress.child = primaryChildFragment;
  return fallbackChildFragment;
}

function mountWorkInProgressOffscreenFiber(offscreenProps, mode, renderLanes) {
  return createFiberFromOffscreen(offscreenProps, mode, NoLanes, null);
}

function updateWorkInProgressOffscreenFiber(current, offscreenProps) {
  return createWorkInProgress(current, offscreenProps);
}

function updateSuspensePrimaryChildren(current, workInProgress, primaryChildren, renderLanes) {
  const currentPrimaryChildFragment = current.child;
  const currentFallbackChildFragment = currentPrimaryChildFragment.sibling;
  const primaryChildFragment = updateWorkInProgressOffscreenFiber(currentPrimaryChildFragment, {
    mode: 'visible',
    children: primaryChildren
  });

  primaryChildFragment.return = workInProgress;
  primaryChildFragment.sibling = null;

  if (currentFallbackChildFragment !== null) {
    const deletions = workInProgress.deletions;

    if (deletions === null) {
      workInProgress.deletions = [currentFallbackChildFragment];
      workInProgress.flags |= ChildDeletion;
    } else {
      deletions.push(currentFallbackChildFragment);
    }
  }

  workInProgress.child = primaryChildFragment;
  return primaryChildFragment;
}

function updateSuspenseFallbackChildren(current, workInProgress, primaryChildren, fallbackChildren, renderLanes) {
  const mode = workInProgress.mode;
  const currentPrimaryChildFragment = current.child;
  const currentFallbackChildFragment = currentPrimaryChildFragment.sibling;
  const primaryChildProps = {
    mode: 'hidden',
    children: primaryChildren
  };
  let primaryChildFragment;

  {
    primaryChildFragment = updateWorkInProgressOffscreenFiber(currentPrimaryChildFragment, primaryChildProps);
    primaryChildFragment.subtreeFlags = currentPrimaryChildFragment.subtreeFlags & StaticMask;
  }

  let fallbackChildFragment;

  if (currentFallbackChildFragment !== null) {
    fallbackChildFragment = createWorkInProgress(currentFallbackChildFragment, fallbackChildren);
  } else {
    fallbackChildFragment = createFiberFromFragment(fallbackChildren, mode, renderLanes, null);
    fallbackChildFragment.flags |= Placement;
  }

  fallbackChildFragment.return = workInProgress;
  primaryChildFragment.return = workInProgress;
  primaryChildFragment.sibling = fallbackChildFragment;
  workInProgress.child = primaryChildFragment;
  return fallbackChildFragment;
}

function retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes) {
  reconcileChildFibers(workInProgress, current.child, null, renderLanes);
  const nextProps = workInProgress.pendingProps;
  const primaryChildren = nextProps.children;
  const primaryChildFragment = mountSuspensePrimaryChildren(workInProgress, primaryChildren);
  primaryChildFragment.flags |= Placement;
  workInProgress.memoizedState = null;
  return primaryChildFragment;
}

function mountSuspenseFallbackAfterRetryWithoutHydrating(current, workInProgress, primaryChildren, fallbackChildren, renderLanes) {
  const fiberMode = workInProgress.mode;
  const primaryChildProps = {
    mode: 'visible',
    children: primaryChildren
  };
  const primaryChildFragment = mountWorkInProgressOffscreenFiber(primaryChildProps, fiberMode);
  const fallbackChildFragment = createFiberFromFragment(fallbackChildren, fiberMode, renderLanes, null);
  fallbackChildFragment.flags |= Placement;
  primaryChildFragment.return = workInProgress;
  fallbackChildFragment.return = workInProgress;
  primaryChildFragment.sibling = fallbackChildFragment;
  workInProgress.child = primaryChildFragment;

  {
    reconcileChildFibers(workInProgress, current.child, null, renderLanes);
  }

  return fallbackChildFragment;
}

function mountDehydratedSuspenseComponent(workInProgress, suspenseInstance, renderLanes) {
  if (isSuspenseInstanceFallback(suspenseInstance)) {
    workInProgress.lanes = laneToLanes(DefaultHydrationLane);
  } else {
    workInProgress.lanes = laneToLanes(OffscreenLane);
  }

  return null;
}

function updateDehydratedSuspenseComponent(current, workInProgress, didSuspend, didPrimaryChildrenDefer, nextProps, suspenseInstance, suspenseState, renderLanes) {
  if (!didSuspend) {
    pushPrimaryTreeSuspenseHandler(workInProgress);
    warnIfHydrating();

    if (isSuspenseInstanceFallback(suspenseInstance)) {
      let digest;
      let message;
      let stack = null;
      let componentStack = null;

      {
        ({
          digest,
          message,
          stack,
          componentStack
        } = getSuspenseInstanceFallbackErrorDetails(suspenseInstance));
      }

      {
        let error;

        if (message) {
          error = new Error(message);
        } else {
          error = new Error('The server could not finish this Suspense boundary, likely ' + 'due to an error during server rendering. ' + 'Switched to client rendering.');
        }

        error.stack = stack || '';
        error.digest = digest;
        const capturedValue = createCapturedValueFromError(error, componentStack === undefined ? null : componentStack);
        queueHydrationError(capturedValue);
      }

      return retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes);
    }

    if (!didReceiveUpdate) {
      lazilyPropagateParentContextChanges(current, workInProgress, renderLanes);
    }

    const hasContextChanged = includesSomeLane(renderLanes, current.childLanes);

    if (didReceiveUpdate || hasContextChanged) {
      const root = getWorkInProgressRoot();

      if (root !== null) {
        const attemptHydrationAtLane = getBumpedLaneForHydration(root, renderLanes);

        if (attemptHydrationAtLane !== NoLane && attemptHydrationAtLane !== suspenseState.retryLane) {
          suspenseState.retryLane = attemptHydrationAtLane;
          enqueueConcurrentRenderForLane(current, attemptHydrationAtLane);
          scheduleUpdateOnFiber(root, current, attemptHydrationAtLane);
          throw SelectiveHydrationException;
        }
      }

      if (isSuspenseInstancePending(suspenseInstance)) ; else {
        renderDidSuspendDelayIfPossible();
      }

      return retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes);
    } else if (isSuspenseInstancePending(suspenseInstance)) {
      workInProgress.flags |= DidCapture;
      workInProgress.child = current.child;
      const retry = retryDehydratedSuspenseBoundary.bind(null, current);
      registerSuspenseInstanceRetry(suspenseInstance, retry);
      return null;
    } else {
      reenterHydrationStateFromDehydratedSuspenseInstance(workInProgress, suspenseInstance, suspenseState.treeContext);
      const primaryChildren = nextProps.children;
      const primaryChildFragment = mountSuspensePrimaryChildren(workInProgress, primaryChildren);
      primaryChildFragment.flags |= Hydrating;
      return primaryChildFragment;
    }
  } else {
    if (workInProgress.flags & ForceClientRender) {
      pushPrimaryTreeSuspenseHandler(workInProgress);
      workInProgress.flags &= ~ForceClientRender;
      return retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes);
    } else if (workInProgress.memoizedState !== null) {
      pushFallbackTreeSuspenseHandler(workInProgress);
      workInProgress.child = current.child;
      workInProgress.flags |= DidCapture;
      return null;
    } else {
      pushFallbackTreeSuspenseHandler(workInProgress);
      const nextPrimaryChildren = nextProps.children;
      const nextFallbackChildren = nextProps.fallback;
      const fallbackChildFragment = mountSuspenseFallbackAfterRetryWithoutHydrating(current, workInProgress, nextPrimaryChildren, nextFallbackChildren, renderLanes);
      const primaryChildFragment = workInProgress.child;
      primaryChildFragment.memoizedState = mountSuspenseOffscreenState(renderLanes);
      primaryChildFragment.childLanes = getRemainingWorkInPrimaryTree(current, didPrimaryChildrenDefer, renderLanes);
      workInProgress.memoizedState = SUSPENDED_MARKER;
      return fallbackChildFragment;
    }
  }
}

function scheduleSuspenseWorkOnFiber(fiber, renderLanes, propagationRoot) {
  fiber.lanes = mergeLanes(fiber.lanes, renderLanes);
  const alternate = fiber.alternate;

  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, renderLanes);
  }

  scheduleContextWorkOnParentPath(fiber.return, renderLanes, propagationRoot);
}

function propagateSuspenseContextChange(workInProgress, firstChild, renderLanes) {
  let node = firstChild;

  while (node !== null) {
    if (node.tag === SuspenseComponent) {
      const state = node.memoizedState;

      if (state !== null) {
        scheduleSuspenseWorkOnFiber(node, renderLanes, workInProgress);
      }
    } else if (node.tag === SuspenseListComponent) {
      scheduleSuspenseWorkOnFiber(node, renderLanes, workInProgress);
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === workInProgress) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

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

function validateRevealOrder(revealOrder) {
  {
    if (revealOrder !== undefined && revealOrder !== 'forwards' && revealOrder !== 'backwards' && revealOrder !== 'together' && !didWarnAboutRevealOrder[revealOrder]) {
      didWarnAboutRevealOrder[revealOrder] = true;

      if (typeof revealOrder === 'string') {
        switch (revealOrder.toLowerCase()) {
          case 'together':
          case 'forwards':
          case 'backwards':
            {
              console.error('"%s" is not a valid value for revealOrder on <SuspenseList />. ' + 'Use lowercase "%s" instead.', revealOrder, revealOrder.toLowerCase());
              break;
            }

          case 'forward':
          case 'backward':
            {
              console.error('"%s" is not a valid value for revealOrder on <SuspenseList />. ' + 'React uses the -s suffix in the spelling. Use "%ss" instead.', revealOrder, revealOrder.toLowerCase());
              break;
            }

          default:
            console.error('"%s" is not a supported revealOrder on <SuspenseList />. ' + 'Did you mean "together", "forwards" or "backwards"?', revealOrder);
            break;
        }
      } else {
        console.error('%s is not a supported value for revealOrder on <SuspenseList />. ' + 'Did you mean "together", "forwards" or "backwards"?', revealOrder);
      }
    }
  }
}

function validateTailOptions(tailMode, revealOrder) {
  {
    if (tailMode !== undefined && !didWarnAboutTailOptions[tailMode]) {
      if (tailMode !== 'collapsed' && tailMode !== 'hidden') {
        didWarnAboutTailOptions[tailMode] = true;
        console.error('"%s" is not a supported value for tail on <SuspenseList />. ' + 'Did you mean "collapsed" or "hidden"?', tailMode);
      } else if (revealOrder !== 'forwards' && revealOrder !== 'backwards') {
        didWarnAboutTailOptions[tailMode] = true;
        console.error('<SuspenseList tail="%s" /> is only valid if revealOrder is ' + '"forwards" or "backwards". ' + 'Did you mean to specify revealOrder="forwards"?', tailMode);
      }
    }
  }
}

function validateSuspenseListNestedChild(childSlot, index) {
  {
    const isAnArray = isArray(childSlot);
    const isIterable = !isAnArray && typeof getIteratorFn(childSlot) === 'function';

    if (isAnArray || isIterable) {
      const type = isAnArray ? 'array' : 'iterable';
      console.error('A nested %s was passed to row #%s in <SuspenseList />. Wrap it in ' + 'an additional SuspenseList to configure its revealOrder: ' + '<SuspenseList revealOrder=...> ... ' + '<SuspenseList revealOrder=...>{%s}</SuspenseList> ... ' + '</SuspenseList>', type, index, type);
      return false;
    }
  }

  return true;
}

function validateSuspenseListChildren(children, revealOrder) {
  {
    if ((revealOrder === 'forwards' || revealOrder === 'backwards') && children !== undefined && children !== null && children !== false) {
      if (isArray(children)) {
        for (let i = 0; i < children.length; i++) {
          if (!validateSuspenseListNestedChild(children[i], i)) {
            return;
          }
        }
      } else {
        const iteratorFn = getIteratorFn(children);

        if (typeof iteratorFn === 'function') {
          const childrenIterator = iteratorFn.call(children);

          if (childrenIterator) {
            let step = childrenIterator.next();
            let i = 0;

            for (; !step.done; step = childrenIterator.next()) {
              if (!validateSuspenseListNestedChild(step.value, i)) {
                return;
              }

              i++;
            }
          }
        } else {
          console.error('A single row was passed to a <SuspenseList revealOrder="%s" />. ' + 'This is not useful since it needs multiple rows. ' + 'Did you mean to pass multiple children or an array?', revealOrder);
        }
      }
    }
  }
}

function initSuspenseListRenderState(workInProgress, isBackwards, tail, lastContentRow, tailMode) {
  const renderState = workInProgress.memoizedState;

  if (renderState === null) {
    workInProgress.memoizedState = {
      isBackwards: isBackwards,
      rendering: null,
      renderingStartTime: 0,
      last: lastContentRow,
      tail: tail,
      tailMode: tailMode
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

function updateSuspenseListComponent(current, workInProgress, renderLanes) {
  const nextProps = workInProgress.pendingProps;
  const revealOrder = nextProps.revealOrder;
  const tailMode = nextProps.tail;
  const newChildren = nextProps.children;
  validateRevealOrder(revealOrder);
  validateTailOptions(tailMode, revealOrder);
  validateSuspenseListChildren(newChildren, revealOrder);
  reconcileChildren(current, workInProgress, newChildren, renderLanes);
  let suspenseContext = suspenseStackCursor.current;
  const shouldForceFallback = hasSuspenseListContext(suspenseContext, ForceSuspenseFallback);

  if (shouldForceFallback) {
    suspenseContext = setShallowSuspenseListContext(suspenseContext, ForceSuspenseFallback);
    workInProgress.flags |= DidCapture;
  } else {
    const didSuspendBefore = current !== null && (current.flags & DidCapture) !== NoFlags$1;

    if (didSuspendBefore) {
      propagateSuspenseContextChange(workInProgress, workInProgress.child, renderLanes);
    }

    suspenseContext = setDefaultShallowSuspenseListContext(suspenseContext);
  }

  pushSuspenseListContext(workInProgress, suspenseContext);

  {
    switch (revealOrder) {
      case 'forwards':
        {
          const lastContentRow = findLastContentRow(workInProgress.child);
          let tail;

          if (lastContentRow === null) {
            tail = workInProgress.child;
            workInProgress.child = null;
          } else {
            tail = lastContentRow.sibling;
            lastContentRow.sibling = null;
          }

          initSuspenseListRenderState(workInProgress, false, tail, lastContentRow, tailMode);
          break;
        }

      case 'backwards':
        {
          let tail = null;
          let row = workInProgress.child;
          workInProgress.child = null;

          while (row !== null) {
            const currentRow = row.alternate;

            if (currentRow !== null && findFirstSuspended(currentRow) === null) {
              workInProgress.child = row;
              break;
            }

            const nextRow = row.sibling;
            row.sibling = tail;
            tail = row;
            row = nextRow;
          }

          initSuspenseListRenderState(workInProgress, true, tail, null, tailMode);
          break;
        }

      case 'together':
        {
          initSuspenseListRenderState(workInProgress, false, null, null, undefined);
          break;
        }

      default:
        {
          workInProgress.memoizedState = null;
        }
    }
  }

  return workInProgress.child;
}

function updatePortalComponent(current, workInProgress, renderLanes) {
  pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
  const nextChildren = workInProgress.pendingProps;

  if (current === null) {
    workInProgress.child = reconcileChildFibers(workInProgress, null, nextChildren, renderLanes);
  } else {
    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  }

  return workInProgress.child;
}

let hasWarnedAboutUsingNoValuePropOnContextProvider = false;

function updateContextProvider(current, workInProgress, renderLanes) {
  let context;

  {
    context = workInProgress.type;
  }

  const newProps = workInProgress.pendingProps;
  const newValue = newProps.value;

  {
    if (!('value' in newProps)) {
      if (!hasWarnedAboutUsingNoValuePropOnContextProvider) {
        hasWarnedAboutUsingNoValuePropOnContextProvider = true;
        console.error('The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?');
      }
    }
  }

  pushProvider(workInProgress, context, newValue);

  const newChildren = newProps.children;
  reconcileChildren(current, workInProgress, newChildren, renderLanes);
  return workInProgress.child;
}

function updateContextConsumer(current, workInProgress, renderLanes) {
  let context;

  {
    const consumerType = workInProgress.type;
    context = consumerType._context;
  }

  const newProps = workInProgress.pendingProps;
  const render = newProps.children;

  {
    if (typeof render !== 'function') {
      console.error('A context consumer was rendered with multiple children, or a child ' + "that isn't a function. A context consumer expects a single child " + 'that is a function. If you did pass a function, make sure there ' + 'is no trailing or leading whitespace around it.');
    }
  }

  prepareToReadContext(workInProgress);
  const newValue = readContext(context);

  let newChildren;

  {
    newChildren = callComponentInDEV(render, newValue, undefined);
  }

  workInProgress.flags |= PerformedWork;
  reconcileChildren(current, workInProgress, newChildren, renderLanes);
  return workInProgress.child;
}

function markWorkInProgressReceivedUpdate() {
  didReceiveUpdate = true;
}
function checkIfWorkInProgressReceivedUpdate() {
  return didReceiveUpdate;
}

function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
  if (current !== null) {
    workInProgress.dependencies = current.dependencies;
  }

  markSkippedUpdateLanes(workInProgress.lanes);

  if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
    if (current !== null) {
      lazilyPropagateParentContextChanges(current, workInProgress, renderLanes);

      if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
        return null;
      }
    } else {
      return null;
    }
  }

  cloneChildFibers(current, workInProgress);
  return workInProgress.child;
}

function remountFiber(current, oldWorkInProgress, newWorkInProgress) {
  {
    const returnFiber = oldWorkInProgress.return;

    if (returnFiber === null) {
      throw new Error('Cannot swap the root fiber.');
    }

    current.alternate = null;
    oldWorkInProgress.alternate = null;
    newWorkInProgress.index = oldWorkInProgress.index;
    newWorkInProgress.sibling = oldWorkInProgress.sibling;
    newWorkInProgress.return = oldWorkInProgress.return;
    newWorkInProgress.ref = oldWorkInProgress.ref;

    {
      newWorkInProgress._debugInfo = oldWorkInProgress._debugInfo;
    }

    if (oldWorkInProgress === returnFiber.child) {
      returnFiber.child = newWorkInProgress;
    } else {
      let prevSibling = returnFiber.child;

      if (prevSibling === null) {
        throw new Error('Expected parent to have a child.');
      }

      while (prevSibling.sibling !== oldWorkInProgress) {
        prevSibling = prevSibling.sibling;

        if (prevSibling === null) {
          throw new Error('Expected to find the previous sibling.');
        }
      }

      prevSibling.sibling = newWorkInProgress;
    }

    const deletions = returnFiber.deletions;

    if (deletions === null) {
      returnFiber.deletions = [current];
      returnFiber.flags |= ChildDeletion;
    } else {
      deletions.push(current);
    }

    newWorkInProgress.flags |= Placement;
    return newWorkInProgress;
  }
}

function checkScheduledUpdateOrContext(current, renderLanes) {
  const updateLanes = current.lanes;

  if (includesSomeLane(updateLanes, renderLanes)) {
    return true;
  }

  {
    const dependencies = current.dependencies;

    if (dependencies !== null && checkIfContextChanged(dependencies)) {
      return true;
    }
  }

  return false;
}

function attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress, renderLanes) {
  switch (workInProgress.tag) {
    case HostRoot:
      pushHostRootContext(workInProgress);

      {
        const cache = current.memoizedState.cache;
        pushCacheProvider(workInProgress, cache);
      }

      resetHydrationState();
      break;

    case HostSingleton:
    case HostComponent:
      pushHostContext(workInProgress);
      break;

    case ClassComponent:
      {

        break;
      }

    case HostPortal:
      pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
      break;

    case ContextProvider:
      {
        const newValue = workInProgress.memoizedProps.value;
        let context;

        {
          context = workInProgress.type;
        }

        pushProvider(workInProgress, context, newValue);
        break;
      }

    case Profiler:

      break;

    case SuspenseComponent:
      {
        const state = workInProgress.memoizedState;

        if (state !== null) {
          if (state.dehydrated !== null) {
            pushPrimaryTreeSuspenseHandler(workInProgress);
            workInProgress.flags |= DidCapture;
            return null;
          }

          const primaryChildFragment = workInProgress.child;
          const primaryChildLanes = primaryChildFragment.childLanes;

          if (includesSomeLane(renderLanes, primaryChildLanes)) {
            return updateSuspenseComponent(current, workInProgress, renderLanes);
          } else {
            pushPrimaryTreeSuspenseHandler(workInProgress);
            const child = bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);

            if (child !== null) {
              return child.sibling;
            } else {
              return null;
            }
          }
        } else {
          pushPrimaryTreeSuspenseHandler(workInProgress);
        }

        break;
      }

    case SuspenseListComponent:
      {
        const didSuspendBefore = (current.flags & DidCapture) !== NoFlags$1;
        let hasChildWork = includesSomeLane(renderLanes, workInProgress.childLanes);

        if (!hasChildWork) {
          lazilyPropagateParentContextChanges(current, workInProgress, renderLanes);
          hasChildWork = includesSomeLane(renderLanes, workInProgress.childLanes);
        }

        if (didSuspendBefore) {
          if (hasChildWork) {
            return updateSuspenseListComponent(current, workInProgress, renderLanes);
          }

          workInProgress.flags |= DidCapture;
        }

        const renderState = workInProgress.memoizedState;

        if (renderState !== null) {
          renderState.rendering = null;
          renderState.tail = null;
          renderState.lastEffect = null;
        }

        pushSuspenseListContext(workInProgress, suspenseStackCursor.current);

        if (hasChildWork) {
          break;
        } else {
          return null;
        }
      }

    case OffscreenComponent:
    case LegacyHiddenComponent:
      {
        workInProgress.lanes = NoLanes;
        return updateOffscreenComponent(current, workInProgress, renderLanes);
      }

    case CacheComponent:
      {
        {
          const cache = current.memoizedState.cache;
          pushCacheProvider(workInProgress, cache);
        }

        break;
      }
  }

  return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
}

function beginWork(current, workInProgress, renderLanes) {
  {
    if (workInProgress._debugNeedsRemount && current !== null) {
      const copiedFiber = createFiberFromTypeAndProps(workInProgress.type, workInProgress.key, workInProgress.pendingProps, workInProgress._debugOwner || null, workInProgress.mode, workInProgress.lanes);

      return remountFiber(current, workInProgress, copiedFiber);
    }
  }

  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    if (oldProps !== newProps || hasContextChanged() || (workInProgress.type !== current.type )) {
      didReceiveUpdate = true;
    } else {
      const hasScheduledUpdateOrContext = checkScheduledUpdateOrContext(current, renderLanes);

      if (!hasScheduledUpdateOrContext && (workInProgress.flags & DidCapture) === NoFlags$1) {
        didReceiveUpdate = false;
        return attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress, renderLanes);
      }

      if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags$1) {
        didReceiveUpdate = true;
      } else {
        didReceiveUpdate = false;
      }
    }
  } else {
    didReceiveUpdate = false;

    if (getIsHydrating() && isForkedChild(workInProgress)) {
      const slotIndex = workInProgress.index;
      const numberOfForks = getForksAtLevel();
      pushTreeId(workInProgress, numberOfForks, slotIndex);
    }
  }

  workInProgress.lanes = NoLanes;

  switch (workInProgress.tag) {
    case LazyComponent:
      {
        const elementType = workInProgress.elementType;
        return mountLazyComponent(current, workInProgress, elementType, renderLanes);
      }

    case FunctionComponent:
      {
        const Component = workInProgress.type;
        const unresolvedProps = workInProgress.pendingProps;
        const resolvedProps = unresolvedProps ;
        return updateFunctionComponent(current, workInProgress, Component, resolvedProps, renderLanes);
      }

    case ClassComponent:
      {
        const Component = workInProgress.type;
        const unresolvedProps = workInProgress.pendingProps;
        const resolvedProps = resolveClassComponentProps(Component, unresolvedProps);
        return updateClassComponent(current, workInProgress, Component, resolvedProps, renderLanes);
      }

    case HostRoot:
      return updateHostRoot(current, workInProgress, renderLanes);

    case HostHoistable:
      {
        return updateHostHoistable(current, workInProgress);
      }

    case HostSingleton:
      {
        return updateHostSingleton(current, workInProgress, renderLanes);
      }

    case HostComponent:
      return updateHostComponent$1(current, workInProgress, renderLanes);

    case HostText:
      return updateHostText$1(current, workInProgress);

    case SuspenseComponent:
      return updateSuspenseComponent(current, workInProgress, renderLanes);

    case HostPortal:
      return updatePortalComponent(current, workInProgress, renderLanes);

    case ForwardRef:
      {
        const type = workInProgress.type;
        const unresolvedProps = workInProgress.pendingProps;
        const resolvedProps = unresolvedProps ;
        return updateForwardRef(current, workInProgress, type, resolvedProps, renderLanes);
      }

    case Fragment:
      return updateFragment(current, workInProgress, renderLanes);

    case Mode:
      return updateMode(current, workInProgress, renderLanes);

    case Profiler:
      return updateProfiler(current, workInProgress, renderLanes);

    case ContextProvider:
      return updateContextProvider(current, workInProgress, renderLanes);

    case ContextConsumer:
      return updateContextConsumer(current, workInProgress, renderLanes);

    case MemoComponent:
      {
        const type = workInProgress.type;
        const unresolvedProps = workInProgress.pendingProps;
        let resolvedProps = unresolvedProps ;
        resolvedProps = resolvedProps ;
        return updateMemoComponent(current, workInProgress, type, resolvedProps, renderLanes);
      }

    case SimpleMemoComponent:
      {
        return updateSimpleMemoComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
      }

    case IncompleteClassComponent:
      {
        {
          break;
        }
      }

    case IncompleteFunctionComponent:
      {
        {
          break;
        }
      }

    case SuspenseListComponent:
      {
        return updateSuspenseListComponent(current, workInProgress, renderLanes);
      }

    case ScopeComponent:
      {

        break;
      }

    case OffscreenComponent:
      {
        return updateOffscreenComponent(current, workInProgress, renderLanes);
      }

    case LegacyHiddenComponent:
      {

        break;
      }

    case CacheComponent:
      {
        {
          return updateCacheComponent(current, workInProgress, renderLanes);
        }
      }

    case TracingMarkerComponent:
      {

        break;
      }

    case Throw:
      {
        throw workInProgress.pendingProps;
      }
  }

  throw new Error(`Unknown unit of work tag (${workInProgress.tag}). This error is likely caused by a bug in ` + 'React. Please file an issue.');
}

const valueCursor = createCursor(null);
let rendererCursorDEV;

{
  rendererCursorDEV = createCursor(null);
}

let rendererSigil;

{
  rendererSigil = {};
}

let currentlyRenderingFiber = null;
let lastContextDependency = null;
let isDisallowedContextReadInDEV = false;
function resetContextDependencies() {
  currentlyRenderingFiber = null;
  lastContextDependency = null;

  {
    isDisallowedContextReadInDEV = false;
  }
}
function enterDisallowedContextReadInDEV() {
  {
    isDisallowedContextReadInDEV = true;
  }
}
function exitDisallowedContextReadInDEV() {
  {
    isDisallowedContextReadInDEV = false;
  }
}
function pushProvider(providerFiber, context, nextValue) {
  {
    push(valueCursor, context._currentValue, providerFiber);
    context._currentValue = nextValue;

    {
      push(rendererCursorDEV, context._currentRenderer, providerFiber);

      if (context._currentRenderer !== undefined && context._currentRenderer !== null && context._currentRenderer !== rendererSigil) {
        console.error('Detected multiple renderers concurrently rendering the ' + 'same context provider. This is currently unsupported.');
      }

      context._currentRenderer = rendererSigil;
    }
  }
}
function popProvider(context, providerFiber) {
  const currentValue = valueCursor.current;

  {
    context._currentValue = currentValue;

    {
      const currentRenderer = rendererCursorDEV.current;
      pop(rendererCursorDEV, providerFiber);
      context._currentRenderer = currentRenderer;
    }
  }

  pop(valueCursor, providerFiber);
}
function scheduleContextWorkOnParentPath(parent, renderLanes, propagationRoot) {
  let node = parent;

  while (node !== null) {
    const alternate = node.alternate;

    if (!isSubsetOfLanes(node.childLanes, renderLanes)) {
      node.childLanes = mergeLanes(node.childLanes, renderLanes);

      if (alternate !== null) {
        alternate.childLanes = mergeLanes(alternate.childLanes, renderLanes);
      }
    } else if (alternate !== null && !isSubsetOfLanes(alternate.childLanes, renderLanes)) {
      alternate.childLanes = mergeLanes(alternate.childLanes, renderLanes);
    } else ;

    if (node === propagationRoot) {
      break;
    }

    node = node.return;
  }

  {
    if (node !== propagationRoot) {
      console.error('Expected to find the propagation root when scheduling context work. ' + 'This error is likely caused by a bug in React. Please file an issue.');
    }
  }
}
function propagateContextChange(workInProgress, context, renderLanes) {
  {
    const forcePropagateEntireTree = true;
    propagateContextChanges(workInProgress, [context], renderLanes, forcePropagateEntireTree);
  }
}

function propagateContextChanges(workInProgress, contexts, renderLanes, forcePropagateEntireTree) {

  let fiber = workInProgress.child;

  if (fiber !== null) {
    fiber.return = workInProgress;
  }

  while (fiber !== null) {
    let nextFiber;
    const list = fiber.dependencies;

    if (list !== null) {
      nextFiber = fiber.child;
      let dep = list.firstContext;

      findChangedDep: while (dep !== null) {
        const dependency = dep;
        const consumer = fiber;

        for (let i = 0; i < contexts.length; i++) {
          const context = contexts[i];

          if (dependency.context === context) {

            consumer.lanes = mergeLanes(consumer.lanes, renderLanes);
            const alternate = consumer.alternate;

            if (alternate !== null) {
              alternate.lanes = mergeLanes(alternate.lanes, renderLanes);
            }

            scheduleContextWorkOnParentPath(consumer.return, renderLanes, workInProgress);

            if (!forcePropagateEntireTree) {
              nextFiber = null;
            }

            break findChangedDep;
          }
        }

        dep = dependency.next;
      }
    } else if (fiber.tag === DehydratedFragment) {
      const parentSuspense = fiber.return;

      if (parentSuspense === null) {
        throw new Error('We just came from a parent so we must have had a parent. This is a bug in React.');
      }

      parentSuspense.lanes = mergeLanes(parentSuspense.lanes, renderLanes);
      const alternate = parentSuspense.alternate;

      if (alternate !== null) {
        alternate.lanes = mergeLanes(alternate.lanes, renderLanes);
      }

      scheduleContextWorkOnParentPath(parentSuspense, renderLanes, workInProgress);
      nextFiber = null;
    } else {
      nextFiber = fiber.child;
    }

    if (nextFiber !== null) {
      nextFiber.return = fiber;
    } else {
      nextFiber = fiber;

      while (nextFiber !== null) {
        if (nextFiber === workInProgress) {
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

function lazilyPropagateParentContextChanges(current, workInProgress, renderLanes) {
  const forcePropagateEntireTree = false;
  propagateParentContextChanges(current, workInProgress, renderLanes, forcePropagateEntireTree);
}
function propagateParentContextChangesToDeferredTree(current, workInProgress, renderLanes) {
  const forcePropagateEntireTree = true;
  propagateParentContextChanges(current, workInProgress, renderLanes, forcePropagateEntireTree);
}

function propagateParentContextChanges(current, workInProgress, renderLanes, forcePropagateEntireTree) {

  let contexts = null;
  let parent = workInProgress;
  let isInsidePropagationBailout = false;

  while (parent !== null) {
    if (!isInsidePropagationBailout) {
      if ((parent.flags & NeedsPropagation) !== NoFlags$1) {
        isInsidePropagationBailout = true;
      } else if ((parent.flags & DidPropagateContext) !== NoFlags$1) {
        break;
      }
    }

    if (parent.tag === ContextProvider) {
      const currentParent = parent.alternate;

      if (currentParent === null) {
        throw new Error('Should have a current fiber. This is a bug in React.');
      }

      const oldProps = currentParent.memoizedProps;

      if (oldProps !== null) {
        let context;

        {
          context = parent.type;
        }

        const newProps = parent.pendingProps;
        const newValue = newProps.value;
        const oldValue = oldProps.value;

        if (!objectIs(newValue, oldValue)) {
          if (contexts !== null) {
            contexts.push(context);
          } else {
            contexts = [context];
          }
        }
      }
    } else if (parent === getHostTransitionProvider()) {
      const currentParent = parent.alternate;

      if (currentParent === null) {
        throw new Error('Should have a current fiber. This is a bug in React.');
      }

      const oldStateHook = currentParent.memoizedState;
      const oldState = oldStateHook.memoizedState;
      const newStateHook = parent.memoizedState;
      const newState = newStateHook.memoizedState;

      if (oldState !== newState) {
        if (contexts !== null) {
          contexts.push(HostTransitionContext);
        } else {
          contexts = [HostTransitionContext];
        }
      }
    }

    parent = parent.return;
  }

  if (contexts !== null) {
    propagateContextChanges(workInProgress, contexts, renderLanes, forcePropagateEntireTree);
  }

  workInProgress.flags |= DidPropagateContext;
}

function checkIfContextChanged(currentDependencies) {

  let dependency = currentDependencies.firstContext;

  while (dependency !== null) {
    const context = dependency.context;
    const newValue = context._currentValue ;
    const oldValue = dependency.memoizedValue;

    {
      if (!objectIs(newValue, oldValue)) {
        return true;
      }
    }

    dependency = dependency.next;
  }

  return false;
}
function prepareToReadContext(workInProgress, renderLanes) {
  currentlyRenderingFiber = workInProgress;
  lastContextDependency = null;
  const dependencies = workInProgress.dependencies;

  if (dependencies !== null) {
    {
      dependencies.firstContext = null;
    }
  }
}
function readContext(context) {
  {
    if (isDisallowedContextReadInDEV) {
      console.error('Context can only be read while React is rendering. ' + 'In classes, you can read it in the render method or getDerivedStateFromProps. ' + 'In function components, you can read it directly in the function body, but not ' + 'inside Hooks like useReducer() or useMemo().');
    }
  }

  return readContextForConsumer(currentlyRenderingFiber, context);
}
function readContextDuringReconciliation(consumer, context, renderLanes) {
  if (currentlyRenderingFiber === null) {
    prepareToReadContext(consumer);
  }

  return readContextForConsumer(consumer, context);
}

function readContextForConsumer(consumer, context) {
  const value = context._currentValue ;
  const contextItem = {
    context: context,
    memoizedValue: value,
    next: null
  };

  if (lastContextDependency === null) {
    if (consumer === null) {
      throw new Error('Context can only be read while React is rendering. ' + 'In classes, you can read it in the render method or getDerivedStateFromProps. ' + 'In function components, you can read it directly in the function body, but not ' + 'inside Hooks like useReducer() or useMemo().');
    }

    lastContextDependency = contextItem;
    consumer.dependencies = {
      lanes: NoLanes,
      firstContext: contextItem,
      _debugThenableState: null
    } ;

    {
      consumer.flags |= NeedsPropagation;
    }
  } else {
    lastContextDependency = lastContextDependency.next = contextItem;
  }

  return value;
}

const UpdateState = 0;
const ReplaceState = 1;
const ForceUpdate = 2;
const CaptureUpdate = 3;
let hasForceUpdate = false;
let didWarnUpdateInsideUpdate;
let currentlyProcessingQueue;

{
  didWarnUpdateInsideUpdate = false;
  currentlyProcessingQueue = null;
}

function initializeUpdateQueue(fiber) {
  const queue = {
    baseState: fiber.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null,
      lanes: NoLanes,
      hiddenCallbacks: null
    },
    callbacks: null
  };
  fiber.updateQueue = queue;
}
function cloneUpdateQueue(current, workInProgress) {
  const queue = workInProgress.updateQueue;
  const currentQueue = current.updateQueue;

  if (queue === currentQueue) {
    const clone = {
      baseState: currentQueue.baseState,
      firstBaseUpdate: currentQueue.firstBaseUpdate,
      lastBaseUpdate: currentQueue.lastBaseUpdate,
      shared: currentQueue.shared,
      callbacks: null
    };
    workInProgress.updateQueue = clone;
  }
}
function createUpdate(lane) {
  const update = {
    lane,
    tag: UpdateState,
    payload: null,
    callback: null,
    next: null
  };
  return update;
}
function enqueueUpdate(fiber, update, lane) {
  const updateQueue = fiber.updateQueue;

  if (updateQueue === null) {
    return null;
  }

  const sharedQueue = updateQueue.shared;

  {
    if (currentlyProcessingQueue === sharedQueue && !didWarnUpdateInsideUpdate) {
      const componentName = getComponentNameFromFiber(fiber);
      console.error('An update (setState, replaceState, or forceUpdate) was scheduled ' + 'from inside an update function. Update functions should be pure, ' + 'with zero side-effects. Consider using componentDidUpdate or a ' + 'callback.\n\nPlease update the following component: %s', componentName);
      didWarnUpdateInsideUpdate = true;
    }
  }

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
function entangleTransitions(root, fiber, lane) {
  const updateQueue = fiber.updateQueue;

  if (updateQueue === null) {
    return;
  }

  const sharedQueue = updateQueue.shared;

  if (isTransitionLane(lane)) {
    let queueLanes = sharedQueue.lanes;
    queueLanes = intersectLanes(queueLanes, root.pendingLanes);
    const newQueueLanes = mergeLanes(queueLanes, lane);
    sharedQueue.lanes = newQueueLanes;
    markRootEntangled(root, newQueueLanes);
  }
}
function enqueueCapturedUpdate(workInProgress, capturedUpdate) {
  let queue = workInProgress.updateQueue;
  const current = workInProgress.alternate;

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
            lane: update.lane,
            tag: update.tag,
            payload: update.payload,
            callback: null,
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
        callbacks: currentQueue.callbacks
      };
      workInProgress.updateQueue = queue;
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

function getStateFromUpdate(workInProgress, queue, update, prevState, nextProps, instance) {
  switch (update.tag) {
    case ReplaceState:
      {
        const payload = update.payload;

        if (typeof payload === 'function') {
          {
            enterDisallowedContextReadInDEV();
          }

          const nextState = payload.call(instance, prevState, nextProps);

          {
            if (workInProgress.mode & StrictLegacyMode) {
              setIsStrictModeForDevtools(true);

              try {
                payload.call(instance, prevState, nextProps);
              } finally {
                setIsStrictModeForDevtools(false);
              }
            }

            exitDisallowedContextReadInDEV();
          }

          return nextState;
        }

        return payload;
      }

    case CaptureUpdate:
      {
        workInProgress.flags = workInProgress.flags & ~ShouldCapture | DidCapture;
      }

    case UpdateState:
      {
        const payload = update.payload;
        let partialState;

        if (typeof payload === 'function') {
          {
            enterDisallowedContextReadInDEV();
          }

          partialState = payload.call(instance, prevState, nextProps);

          {
            if (workInProgress.mode & StrictLegacyMode) {
              setIsStrictModeForDevtools(true);

              try {
                payload.call(instance, prevState, nextProps);
              } finally {
                setIsStrictModeForDevtools(false);
              }
            }

            exitDisallowedContextReadInDEV();
          }
        } else {
          partialState = payload;
        }

        if (partialState === null || partialState === undefined) {
          return prevState;
        }

        return assign({}, prevState, partialState);
      }

    case ForceUpdate:
      {
        hasForceUpdate = true;
        return prevState;
      }
  }

  return prevState;
}

let didReadFromEntangledAsyncAction = false;
function suspendIfUpdateReadFromEntangledAsyncAction() {
  if (didReadFromEntangledAsyncAction) {
    const entangledActionThenable = peekEntangledActionThenable();

    if (entangledActionThenable !== null) {
      throw entangledActionThenable;
    }
  }
}
function processUpdateQueue(workInProgress, props, instance, renderLanes) {
  didReadFromEntangledAsyncAction = false;
  const queue = workInProgress.updateQueue;
  hasForceUpdate = false;

  {
    currentlyProcessingQueue = queue.shared;
  }

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
    const current = workInProgress.alternate;

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
      const updateLane = removeLanes(update.lane, OffscreenLane);
      const isHiddenUpdate = updateLane !== update.lane;
      const shouldSkipUpdate = isHiddenUpdate ? !isSubsetOfLanes(getWorkInProgressRootRenderLanes(), updateLane) : !isSubsetOfLanes(renderLanes, updateLane);

      if (shouldSkipUpdate) {
        const clone = {
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
        if (updateLane !== NoLane && updateLane === peekEntangledActionLane()) {
          didReadFromEntangledAsyncAction = true;
        }

        if (newLastBaseUpdate !== null) {
          const clone = {
            lane: NoLane,
            tag: update.tag,
            payload: update.payload,
            callback: null,
            next: null
          };
          newLastBaseUpdate = newLastBaseUpdate.next = clone;
        }

        newState = getStateFromUpdate(workInProgress, queue, update, newState, props, instance);
        const callback = update.callback;

        if (callback !== null) {
          workInProgress.flags |= Callback;

          if (isHiddenUpdate) {
            workInProgress.flags |= Visibility;
          }

          const callbacks = queue.callbacks;

          if (callbacks === null) {
            queue.callbacks = [callback];
          } else {
            callbacks.push(callback);
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

    if (firstBaseUpdate === null) {
      queue.shared.lanes = NoLanes;
    }

    markSkippedUpdateLanes(newLanes);
    workInProgress.lanes = newLanes;
    workInProgress.memoizedState = newState;
  }

  {
    currentlyProcessingQueue = null;
  }
}

function callCallback(callback, context) {
  if (typeof callback !== 'function') {
    throw new Error('Invalid argument passed as callback. Expected a function. Instead ' + `received: ${callback}`);
  }

  callback.call(context);
}

function resetHasForceUpdateBeforeProcessing() {
  hasForceUpdate = false;
}
function checkHasForceUpdateAfterProcessing() {
  return hasForceUpdate;
}
function deferHiddenCallbacks(updateQueue) {
  const newHiddenCallbacks = updateQueue.callbacks;

  if (newHiddenCallbacks !== null) {
    const existingHiddenCallbacks = updateQueue.shared.hiddenCallbacks;

    if (existingHiddenCallbacks === null) {
      updateQueue.shared.hiddenCallbacks = newHiddenCallbacks;
    } else {
      updateQueue.shared.hiddenCallbacks = existingHiddenCallbacks.concat(newHiddenCallbacks);
    }
  }
}
function commitHiddenCallbacks(updateQueue, context) {
  const hiddenCallbacks = updateQueue.shared.hiddenCallbacks;

  if (hiddenCallbacks !== null) {
    updateQueue.shared.hiddenCallbacks = null;

    for (let i = 0; i < hiddenCallbacks.length; i++) {
      const callback = hiddenCallbacks[i];
      callCallback(callback, context);
    }
  }
}
function commitCallbacks(updateQueue, context) {
  const callbacks = updateQueue.callbacks;

  if (callbacks !== null) {
    updateQueue.callbacks = null;

    for (let i = 0; i < callbacks.length; i++) {
      const callback = callbacks[i];
      callCallback(callback, context);
    }
  }
}

function shouldProfile(current) {
  return enableProfilerTimer  ;
}

function commitHookLayoutEffects(finishedWork, hookFlags) {
  {
    commitHookEffectListMount(hookFlags, finishedWork);
  }
}
function commitHookLayoutUnmountEffects(finishedWork, nearestMountedAncestor, hookFlags) {
  {
    commitHookEffectListUnmount(hookFlags, finishedWork, nearestMountedAncestor);
  }
}
function commitHookEffectListMount(flags, finishedWork) {
  try {
    const updateQueue = finishedWork.updateQueue;
    const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;

    if (lastEffect !== null) {
      const firstEffect = lastEffect.next;
      let effect = firstEffect;

      do {
        if ((effect.tag & flags) === flags) {
          if (enableSchedulingProfiler) ;

          let destroy;

          if (true) {
            if ((flags & Insertion) !== NoFlags) {
              setIsRunningInsertionEffect(true);
            }

            destroy = runWithFiberInDEV(finishedWork, callCreateInDEV, effect);

            if ((flags & Insertion) !== NoFlags) {
              setIsRunningInsertionEffect(false);
            }
          }

          if (enableSchedulingProfiler) ;

          if (true) {
            if (destroy !== undefined && typeof destroy !== 'function') {
              let hookName;

              if ((effect.tag & Layout) !== NoFlags$1) {
                hookName = 'useLayoutEffect';
              } else if ((effect.tag & Insertion) !== NoFlags$1) {
                hookName = 'useInsertionEffect';
              } else {
                hookName = 'useEffect';
              }

              let addendum;

              if (destroy === null) {
                addendum = ' You returned null. If your effect does not require clean ' + 'up, return undefined (or nothing).';
              } else if (typeof destroy.then === 'function') {
                addendum = '\n\nIt looks like you wrote ' + hookName + '(async () => ...) or returned a Promise. ' + 'Instead, write the async function inside your effect ' + 'and call it immediately:\n\n' + hookName + '(() => {\n' + '  async function fetchData() {\n' + '    // You can await here\n' + '    const response = await MyAPI.getData(someId);\n' + '    // ...\n' + '  }\n' + '  fetchData();\n' + `}, [someId]); // Or [] if effect doesn't need props or state\n\n` + 'Learn more about data fetching with Hooks: https://react.dev/link/hooks-data-fetching';
              } else {
                addendum = ' You returned: ' + destroy;
              }

              runWithFiberInDEV(finishedWork, (n, a) => {
                console.error('%s must not return anything besides a function, ' + 'which is used for clean-up.%s', n, a);
              }, hookName, addendum);
            }
          }
        }

        effect = effect.next;
      } while (effect !== firstEffect);
    }
  } catch (error) {
    captureCommitPhaseError(finishedWork, finishedWork.return, error);
  }
}
function commitHookEffectListUnmount(flags, finishedWork, nearestMountedAncestor) {
  try {
    const updateQueue = finishedWork.updateQueue;
    const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;

    if (lastEffect !== null) {
      const firstEffect = lastEffect.next;
      let effect = firstEffect;

      do {
        if ((effect.tag & flags) === flags) {
          const inst = effect.inst;
          const destroy = inst.destroy;

          if (destroy !== undefined) {
            inst.destroy = undefined;

            if (enableSchedulingProfiler) ;

            if (true) {
              if ((flags & Insertion) !== NoFlags) {
                setIsRunningInsertionEffect(true);
              }
            }

            safelyCallDestroy(finishedWork, nearestMountedAncestor, destroy);

            if (true) {
              if ((flags & Insertion) !== NoFlags) {
                setIsRunningInsertionEffect(false);
              }
            }

            if (enableSchedulingProfiler) ;
          }
        }

        effect = effect.next;
      } while (effect !== firstEffect);
    }
  } catch (error) {
    captureCommitPhaseError(finishedWork, finishedWork.return, error);
  }
}
function commitHookPassiveMountEffects(finishedWork, hookFlags) {
  {
    commitHookEffectListMount(hookFlags, finishedWork);
  }
}
function commitHookPassiveUnmountEffects(finishedWork, nearestMountedAncestor, hookFlags) {
  {
    commitHookEffectListUnmount(hookFlags, finishedWork, nearestMountedAncestor);
  }
}
function commitClassLayoutLifecycles(finishedWork, current) {
  const instance = finishedWork.stateNode;

  if (current === null) {
    {
      if (!finishedWork.type.defaultProps && !('ref' in finishedWork.memoizedProps) && !didWarnAboutReassigningProps) {
        if (instance.props !== finishedWork.memoizedProps) {
          console.error('Expected %s props to match memoized props before ' + 'componentDidMount. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.props`. ' + 'Please file an issue.', getComponentNameFromFiber(finishedWork) || 'instance');
        }

        if (instance.state !== finishedWork.memoizedState) {
          console.error('Expected %s state to match memoized state before ' + 'componentDidMount. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.state`. ' + 'Please file an issue.', getComponentNameFromFiber(finishedWork) || 'instance');
        }
      }
    }

    {
      {
        runWithFiberInDEV(finishedWork, callComponentDidMountInDEV, finishedWork, instance);
      }
    }
  } else {
    const prevProps = resolveClassComponentProps(finishedWork.type, current.memoizedProps);
    const prevState = current.memoizedState;

    {
      if (!finishedWork.type.defaultProps && !('ref' in finishedWork.memoizedProps) && !didWarnAboutReassigningProps) {
        if (instance.props !== finishedWork.memoizedProps) {
          console.error('Expected %s props to match memoized props before ' + 'componentDidUpdate. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.props`. ' + 'Please file an issue.', getComponentNameFromFiber(finishedWork) || 'instance');
        }

        if (instance.state !== finishedWork.memoizedState) {
          console.error('Expected %s state to match memoized state before ' + 'componentDidUpdate. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.state`. ' + 'Please file an issue.', getComponentNameFromFiber(finishedWork) || 'instance');
        }
      }
    }

    {
      {
        runWithFiberInDEV(finishedWork, callComponentDidUpdateInDEV, finishedWork, instance, prevProps, prevState, instance.__reactInternalSnapshotBeforeUpdate);
      }
    }
  }
}
function commitClassDidMount(finishedWork) {
  const instance = finishedWork.stateNode;

  if (typeof instance.componentDidMount === 'function') {
    {
      runWithFiberInDEV(finishedWork, callComponentDidMountInDEV, finishedWork, instance);
    }
  }
}
function commitClassCallbacks(finishedWork) {
  const updateQueue = finishedWork.updateQueue;

  if (updateQueue !== null) {
    const instance = finishedWork.stateNode;

    {
      if (!finishedWork.type.defaultProps && !('ref' in finishedWork.memoizedProps) && !didWarnAboutReassigningProps) {
        if (instance.props !== finishedWork.memoizedProps) {
          console.error('Expected %s props to match memoized props before ' + 'processing the update queue. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.props`. ' + 'Please file an issue.', getComponentNameFromFiber(finishedWork) || 'instance');
        }

        if (instance.state !== finishedWork.memoizedState) {
          console.error('Expected %s state to match memoized state before ' + 'processing the update queue. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.state`. ' + 'Please file an issue.', getComponentNameFromFiber(finishedWork) || 'instance');
        }
      }
    }

    try {
      if (true) {
        runWithFiberInDEV(finishedWork, commitCallbacks, updateQueue, instance);
      }
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
}
function commitClassHiddenCallbacks(finishedWork) {
  const updateQueue = finishedWork.updateQueue;

  if (updateQueue !== null) {
    const instance = finishedWork.stateNode;

    try {
      if (true) {
        runWithFiberInDEV(finishedWork, commitHiddenCallbacks, updateQueue, instance);
      }
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
}
function commitRootCallbacks(finishedWork) {
  const updateQueue = finishedWork.updateQueue;

  if (updateQueue !== null) {
    let instance = null;

    if (finishedWork.child !== null) {
      switch (finishedWork.child.tag) {
        case HostSingleton:
        case HostComponent:
          instance = getPublicInstance(finishedWork.child.stateNode);
          break;

        case ClassComponent:
          instance = finishedWork.child.stateNode;
          break;
      }
    }

    try {
      if (true) {
        runWithFiberInDEV(finishedWork, commitCallbacks, updateQueue, instance);
      }
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
}
let didWarnAboutUndefinedSnapshotBeforeUpdate = null;

{
  didWarnAboutUndefinedSnapshotBeforeUpdate = new Set();
}

function callGetSnapshotBeforeUpdates(instance, prevProps, prevState) {
  return instance.getSnapshotBeforeUpdate(prevProps, prevState);
}

function commitClassSnapshot(finishedWork, current) {
  const prevProps = current.memoizedProps;
  const prevState = current.memoizedState;
  const instance = finishedWork.stateNode;

  {
    if (!finishedWork.type.defaultProps && !('ref' in finishedWork.memoizedProps) && !didWarnAboutReassigningProps) {
      if (instance.props !== finishedWork.memoizedProps) {
        console.error('Expected %s props to match memoized props before ' + 'getSnapshotBeforeUpdate. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.props`. ' + 'Please file an issue.', getComponentNameFromFiber(finishedWork) || 'instance');
      }

      if (instance.state !== finishedWork.memoizedState) {
        console.error('Expected %s state to match memoized state before ' + 'getSnapshotBeforeUpdate. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.state`. ' + 'Please file an issue.', getComponentNameFromFiber(finishedWork) || 'instance');
      }
    }
  }

  try {
    const resolvedPrevProps = resolveClassComponentProps(finishedWork.type, prevProps, finishedWork.elementType === finishedWork.type);
    let snapshot;

    if (true) {
      snapshot = runWithFiberInDEV(finishedWork, callGetSnapshotBeforeUpdates, instance, resolvedPrevProps, prevState);
      const didWarnSet = didWarnAboutUndefinedSnapshotBeforeUpdate;

      if (snapshot === undefined && !didWarnSet.has(finishedWork.type)) {
        didWarnSet.add(finishedWork.type);
        runWithFiberInDEV(finishedWork, () => {
          console.error('%s.getSnapshotBeforeUpdate(): A snapshot value (or null) ' + 'must be returned. You have returned undefined.', getComponentNameFromFiber(finishedWork));
        });
      }
    }

    instance.__reactInternalSnapshotBeforeUpdate = snapshot;
  } catch (error) {
    captureCommitPhaseError(finishedWork, finishedWork.return, error);
  }
}
function safelyCallComponentWillUnmount(current, nearestMountedAncestor, instance) {
  instance.props = resolveClassComponentProps(current.type, current.memoizedProps);
  instance.state = current.memoizedState;

  {
    {
      runWithFiberInDEV(current, callComponentWillUnmountInDEV, current, nearestMountedAncestor, instance);
    }
  }
}

function commitAttachRef(finishedWork) {
  const ref = finishedWork.ref;

  if (ref !== null) {
    const instance = finishedWork.stateNode;
    let instanceToUse;

    switch (finishedWork.tag) {
      case HostHoistable:
      case HostSingleton:
      case HostComponent:
        instanceToUse = getPublicInstance(instance);
        break;

      default:
        instanceToUse = instance;
    }

    if (typeof ref === 'function') {
      {
        finishedWork.refCleanup = ref(instanceToUse);
      }
    } else {
      {
        if (typeof ref === 'string') {
          console.error('String refs are no longer supported.');
        } else if (!ref.hasOwnProperty('current')) {
          console.error('Unexpected ref object provided for %s. ' + 'Use either a ref-setter function or React.createRef().', getComponentNameFromFiber(finishedWork));
        }
      }

      ref.current = instanceToUse;
    }
  }
}

function safelyAttachRef(current, nearestMountedAncestor) {
  try {
    if (true) {
      runWithFiberInDEV(current, commitAttachRef, current);
    }
  } catch (error) {
    captureCommitPhaseError(current, nearestMountedAncestor, error);
  }
}
function safelyDetachRef(current, nearestMountedAncestor) {
  const ref = current.ref;
  const refCleanup = current.refCleanup;

  if (ref !== null) {
    if (typeof refCleanup === 'function') {
      try {
        if (shouldProfile(current)) ; else {
          if (true) {
            runWithFiberInDEV(current, refCleanup);
          }
        }
      } catch (error) {
        captureCommitPhaseError(current, nearestMountedAncestor, error);
      } finally {
        current.refCleanup = null;
        const finishedWork = current.alternate;

        if (finishedWork != null) {
          finishedWork.refCleanup = null;
        }
      }
    } else if (typeof ref === 'function') {
      try {
        if (shouldProfile(current)) ; else {
          if (true) {
            runWithFiberInDEV(current, ref, null);
          }
        }
      } catch (error) {
        captureCommitPhaseError(current, nearestMountedAncestor, error);
      }
    } else {
      ref.current = null;
    }
  }
}

function safelyCallDestroy(current, nearestMountedAncestor, destroy) {
  {
    runWithFiberInDEV(current, callDestroyInDEV, current, nearestMountedAncestor, destroy);
  }
}

function commitProfilerPostCommitImpl(finishedWork, current, commitStartTime, passiveEffectDuration) {
  const {
    id,
    onPostCommit
  } = finishedWork.memoizedProps;
  let phase = current === null ? 'mount' : 'update';

  if (typeof onPostCommit === 'function') {
    onPostCommit(id, phase, passiveEffectDuration, commitStartTime);
  }
}

function commitProfilerPostCommit(finishedWork, current, commitStartTime, passiveEffectDuration) {
  try {
    if (true) {
      runWithFiberInDEV(finishedWork, commitProfilerPostCommitImpl, finishedWork, current, commitStartTime, passiveEffectDuration);
    }
  } catch (error) {
    captureCommitPhaseError(finishedWork, finishedWork.return, error);
  }
}

function commitHostMount(finishedWork) {
  const type = finishedWork.type;
  const props = finishedWork.memoizedProps;
  const instance = finishedWork.stateNode;

  try {
    if (true) {
      runWithFiberInDEV(finishedWork, commitMount, instance, type, props, finishedWork);
    }
  } catch (error) {
    captureCommitPhaseError(finishedWork, finishedWork.return, error);
  }
}
function commitHostUpdate(finishedWork, newProps, oldProps) {
  try {
    if (true) {
      runWithFiberInDEV(finishedWork, commitUpdate, finishedWork.stateNode, finishedWork.type, oldProps, newProps, finishedWork);
    }
  } catch (error) {
    captureCommitPhaseError(finishedWork, finishedWork.return, error);
  }
}
function commitHostTextUpdate(finishedWork, newText, oldText) {
  const textInstance = finishedWork.stateNode;

  try {
    if (true) {
      runWithFiberInDEV(finishedWork, commitTextUpdate, textInstance, oldText, newText);
    }
  } catch (error) {
    captureCommitPhaseError(finishedWork, finishedWork.return, error);
  }
}
function commitHostResetTextContent(finishedWork) {
  const instance = finishedWork.stateNode;

  try {
    if (true) {
      runWithFiberInDEV(finishedWork, resetTextContent, instance);
    }
  } catch (error) {
    captureCommitPhaseError(finishedWork, finishedWork.return, error);
  }
}
function commitShowHideHostInstance(node, isHidden) {
  try {
    const instance = node.stateNode;

    if (isHidden) {
      if (true) {
        runWithFiberInDEV(node, hideInstance, instance);
      }
    } else {
      if (true) {
        runWithFiberInDEV(node, unhideInstance, node.stateNode, node.memoizedProps);
      }
    }
  } catch (error) {
    captureCommitPhaseError(node, node.return, error);
  }
}
function commitShowHideHostTextInstance(node, isHidden) {
  try {
    const instance = node.stateNode;

    if (isHidden) {
      if (true) {
        runWithFiberInDEV(node, hideTextInstance, instance);
      }
    } else {
      if (true) {
        runWithFiberInDEV(node, unhideTextInstance, instance, node.memoizedProps);
      }
    }
  } catch (error) {
    captureCommitPhaseError(node, node.return, error);
  }
}

function getHostParentFiber(fiber) {
  let parent = fiber.return;

  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent;
    }

    parent = parent.return;
  }

  throw new Error('Expected to find a host parent. This error is likely caused by a bug ' + 'in React. Please file an issue.');
}

function isHostParent(fiber) {
  return fiber.tag === HostComponent || fiber.tag === HostRoot || (fiber.tag === HostHoistable ) || (fiber.tag === HostSingleton ) || fiber.tag === HostPortal;
}

function getHostSibling(fiber) {
  let node = fiber;

  siblings: while (true) {
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        return null;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;

    while (node.tag !== HostComponent && node.tag !== HostText && (node.tag !== HostSingleton) && node.tag !== DehydratedFragment) {
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

function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
  const {
    tag
  } = node;
  const isHost = tag === HostComponent || tag === HostText;

  if (isHost) {
    const stateNode = node.stateNode;

    if (before) {
      insertInContainerBefore(parent, stateNode, before);
    } else {
      appendChildToContainer(parent, stateNode);
    }
  } else if (tag === HostPortal || (tag === HostSingleton )) ; else {
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

function insertOrAppendPlacementNode(node, before, parent) {
  const {
    tag
  } = node;
  const isHost = tag === HostComponent || tag === HostText;

  if (isHost) {
    const stateNode = node.stateNode;

    if (before) {
      insertBefore(parent, stateNode, before);
    } else {
      appendChild(parent, stateNode);
    }
  } else if (tag === HostPortal || (tag === HostSingleton )) ; else {
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

function commitPlacement(finishedWork) {

  {
    if (finishedWork.tag === HostSingleton) {
      return;
    }
  }

  const parentFiber = getHostParentFiber(finishedWork);

  switch (parentFiber.tag) {
    case HostSingleton:
      {
        {
          const parent = parentFiber.stateNode;
          const before = getHostSibling(finishedWork);
          insertOrAppendPlacementNode(finishedWork, before, parent);
          break;
        }
      }

    case HostComponent:
      {
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
    case HostPortal:
      {
        const parent = parentFiber.stateNode.containerInfo;
        const before = getHostSibling(finishedWork);
        insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
        break;
      }

    default:
      throw new Error('Invalid host parent fiber. This error is likely caused by a bug ' + 'in React. Please file an issue.');
  }
}

function commitHostPlacement(finishedWork) {
  try {
    if (true) {
      runWithFiberInDEV(finishedWork, commitPlacement, finishedWork);
    }
  } catch (error) {
    captureCommitPhaseError(finishedWork, finishedWork.return, error);
  }
}
function commitHostRemoveChildFromContainer(deletedFiber, nearestMountedAncestor, parentContainer, hostInstance) {
  try {
    if (true) {
      runWithFiberInDEV(deletedFiber, removeChildFromContainer, parentContainer, hostInstance);
    }
  } catch (error) {
    captureCommitPhaseError(deletedFiber, nearestMountedAncestor, error);
  }
}
function commitHostRemoveChild(deletedFiber, nearestMountedAncestor, parentInstance, hostInstance) {
  try {
    if (true) {
      runWithFiberInDEV(deletedFiber, removeChild, parentInstance, hostInstance);
    }
  } catch (error) {
    captureCommitPhaseError(deletedFiber, nearestMountedAncestor, error);
  }
}
function commitHostHydratedContainer(root, finishedWork) {
  try {
    if (true) {
      runWithFiberInDEV(finishedWork, commitHydratedContainer, root.containerInfo);
    }
  } catch (error) {
    captureCommitPhaseError(finishedWork, finishedWork.return, error);
  }
}
function commitHostHydratedSuspense(suspenseInstance, finishedWork) {
  try {
    if (true) {
      runWithFiberInDEV(finishedWork, commitHydratedSuspenseInstance, suspenseInstance);
    }
  } catch (error) {
    captureCommitPhaseError(finishedWork, finishedWork.return, error);
  }
}
function commitHostSingleton(finishedWork) {
  const singleton = finishedWork.stateNode;
  const props = finishedWork.memoizedProps;

  try {
    clearSingleton(singleton);

    if (true) {
      runWithFiberInDEV(finishedWork, acquireSingletonInstance, finishedWork.type, props, singleton, finishedWork);
    }
  } catch (error) {
    captureCommitPhaseError(finishedWork, finishedWork.return, error);
  }
}

let offscreenSubtreeIsHidden = false;
let offscreenSubtreeWasHidden = false;
let needsFormReset = false;
const PossiblyWeakSet = typeof WeakSet === 'function' ? WeakSet : Set;
let nextEffect = null;
let shouldFireAfterActiveInstanceBlur = false;
function commitBeforeMutationEffects(root, firstChild) {
  prepareForCommit(root.containerInfo);
  nextEffect = firstChild;
  commitBeforeMutationEffects_begin();
  const shouldFire = shouldFireAfterActiveInstanceBlur;
  shouldFireAfterActiveInstanceBlur = false;
  return shouldFire;
}

function commitBeforeMutationEffects_begin() {
  while (nextEffect !== null) {
    const fiber = nextEffect;

    const child = fiber.child;

    if ((fiber.subtreeFlags & BeforeMutationMask) !== NoFlags$1 && child !== null) {
      child.return = fiber;
      nextEffect = child;
    } else {
      commitBeforeMutationEffects_complete();
    }
  }
}

function commitBeforeMutationEffects_complete() {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    commitBeforeMutationEffectsOnFiber(fiber);
    const sibling = fiber.sibling;

    if (sibling !== null) {
      sibling.return = fiber.return;
      nextEffect = sibling;
      return;
    }

    nextEffect = fiber.return;
  }
}

function commitBeforeMutationEffectsOnFiber(finishedWork) {
  const current = finishedWork.alternate;
  const flags = finishedWork.flags;

  switch (finishedWork.tag) {
    case FunctionComponent:
      {

        break;
      }

    case ForwardRef:
    case SimpleMemoComponent:
      {
        break;
      }

    case ClassComponent:
      {
        if ((flags & Snapshot) !== NoFlags$1) {
          if (current !== null) {
            commitClassSnapshot(finishedWork, current);
          }
        }

        break;
      }

    case HostRoot:
      {
        if ((flags & Snapshot) !== NoFlags$1) {
          {
            const root = finishedWork.stateNode;
            clearContainer(root.containerInfo);
          }
        }

        break;
      }

    case HostComponent:
    case HostHoistable:
    case HostSingleton:
    case HostText:
    case HostPortal:
    case IncompleteClassComponent:
      break;

    default:
      {
        if ((flags & Snapshot) !== NoFlags$1) {
          throw new Error('This unit of work tag should not have side-effects. This error is ' + 'likely caused by a bug in React. Please file an issue.');
        }
      }
  }
}

function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork, committedLanes) {
  const flags = finishedWork.flags;

  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
      {
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);

        if (flags & Update) {
          commitHookLayoutEffects(finishedWork, Layout | HasEffect);
        }

        break;
      }

    case ClassComponent:
      {
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);

        if (flags & Update) {
          commitClassLayoutLifecycles(finishedWork, current);
        }

        if (flags & Callback) {
          commitClassCallbacks(finishedWork);
        }

        if (flags & Ref) {
          safelyAttachRef(finishedWork, finishedWork.return);
        }

        break;
      }

    case HostRoot:
      {
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);

        if (flags & Callback) {
          commitRootCallbacks(finishedWork);
        }

        break;
      }

    case HostHoistable:
      {
        {
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);

          if (flags & Ref) {
            safelyAttachRef(finishedWork, finishedWork.return);
          }

          break;
        }
      }

    case HostSingleton:
    case HostComponent:
      {
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);

        if (current === null && flags & Update) {
          commitHostMount(finishedWork);
        }

        if (flags & Ref) {
          safelyAttachRef(finishedWork, finishedWork.return);
        }

        break;
      }

    case Profiler:
      {
        if (flags & Update) {
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        } else {
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        }

        break;
      }

    case SuspenseComponent:
      {
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);

        if (flags & Update) {
          commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
        }

        break;
      }

    case OffscreenComponent:
      {

        {
          const isHidden = finishedWork.memoizedState !== null;
          const newOffscreenSubtreeIsHidden = isHidden || offscreenSubtreeIsHidden;

          if (newOffscreenSubtreeIsHidden) ; else {
            const wasHidden = current !== null && current.memoizedState !== null;
            const newOffscreenSubtreeWasHidden = wasHidden || offscreenSubtreeWasHidden;
            const prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden;
            const prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
            offscreenSubtreeIsHidden = newOffscreenSubtreeIsHidden;
            offscreenSubtreeWasHidden = newOffscreenSubtreeWasHidden;

            if (offscreenSubtreeWasHidden && !prevOffscreenSubtreeWasHidden) {
              const includeWorkInProgressEffects = (finishedWork.subtreeFlags & LayoutMask) !== NoFlags$1;
              recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
            } else {
              recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
            }

            offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
            offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
          }
        }

        if (flags & Ref) {
          const props = finishedWork.memoizedProps;

          if (props.mode === 'manual') {
            safelyAttachRef(finishedWork, finishedWork.return);
          } else {
            safelyDetachRef(finishedWork, finishedWork.return);
          }
        }

        break;
      }

    default:
      {
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        break;
      }
  }
}

function hideOrUnhideAllChildren(finishedWork, isHidden) {
  let hostSubtreeRoot = null;

  {
    let node = finishedWork;

    while (true) {
      if (node.tag === HostComponent || (node.tag === HostHoistable ) || (node.tag === HostSingleton )) {
        if (hostSubtreeRoot === null) {
          hostSubtreeRoot = node;
          commitShowHideHostInstance(node, isHidden);
        }
      } else if (node.tag === HostText) {
        if (hostSubtreeRoot === null) {
          commitShowHideHostTextInstance(node, isHidden);
        }
      } else if ((node.tag === OffscreenComponent || node.tag === LegacyHiddenComponent) && node.memoizedState !== null && node !== finishedWork) ; else if (node.child !== null) {
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

function detachFiberMutation(fiber) {
  const alternate = fiber.alternate;

  if (alternate !== null) {
    alternate.return = null;
  }

  fiber.return = null;
}

function detachFiberAfterEffects(fiber) {
  const alternate = fiber.alternate;

  if (alternate !== null) {
    fiber.alternate = null;
    detachFiberAfterEffects(alternate);
  }

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
    fiber._debugOwner = null;
  }

  fiber.return = null;
  fiber.dependencies = null;
  fiber.memoizedProps = null;
  fiber.memoizedState = null;
  fiber.pendingProps = null;
  fiber.stateNode = null;
  fiber.updateQueue = null;
}

let hostParent = null;
let hostParentIsContainer = false;

function commitDeletionEffects(root, returnFiber, deletedFiber) {
  {
    let parent = returnFiber;

    findParent: while (parent !== null) {
      switch (parent.tag) {
        case HostSingleton:
        case HostComponent:
          {
            hostParent = parent.stateNode;
            hostParentIsContainer = false;
            break findParent;
          }

        case HostRoot:
          {
            hostParent = parent.stateNode.containerInfo;
            hostParentIsContainer = true;
            break findParent;
          }

        case HostPortal:
          {
            hostParent = parent.stateNode.containerInfo;
            hostParentIsContainer = true;
            break findParent;
          }
      }

      parent = parent.return;
    }

    if (hostParent === null) {
      throw new Error('Expected to find a host parent. This error is likely caused by ' + 'a bug in React. Please file an issue.');
    }

    commitDeletionEffectsOnFiber(root, returnFiber, deletedFiber);
    hostParent = null;
    hostParentIsContainer = false;
  }

  detachFiberMutation(deletedFiber);
}

function recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, parent) {
  let child = parent.child;

  while (child !== null) {
    commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, child);
    child = child.sibling;
  }
}

function commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, deletedFiber) {
  onCommitUnmount(deletedFiber);

  switch (deletedFiber.tag) {
    case HostHoistable:
      {
        {
          if (!offscreenSubtreeWasHidden) {
            safelyDetachRef(deletedFiber, nearestMountedAncestor);
          }

          recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);

          if (deletedFiber.memoizedState) {
            releaseResource(deletedFiber.memoizedState);
          } else if (deletedFiber.stateNode) {
            unmountHoistable(deletedFiber.stateNode);
          }

          return;
        }
      }

    case HostSingleton:
      {
        {
          if (!offscreenSubtreeWasHidden) {
            safelyDetachRef(deletedFiber, nearestMountedAncestor);
          }

          const prevHostParent = hostParent;
          const prevHostParentIsContainer = hostParentIsContainer;
          hostParent = deletedFiber.stateNode;
          recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
          releaseSingletonInstance(deletedFiber.stateNode);
          hostParent = prevHostParent;
          hostParentIsContainer = prevHostParentIsContainer;
          return;
        }
      }

    case HostComponent:
      {
        if (!offscreenSubtreeWasHidden) {
          safelyDetachRef(deletedFiber, nearestMountedAncestor);
        }
      }

    case HostText:
      {
        {
          const prevHostParent = hostParent;
          const prevHostParentIsContainer = hostParentIsContainer;
          hostParent = null;
          recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
          hostParent = prevHostParent;
          hostParentIsContainer = prevHostParentIsContainer;

          if (hostParent !== null) {
            if (hostParentIsContainer) {
              commitHostRemoveChildFromContainer(deletedFiber, nearestMountedAncestor, hostParent, deletedFiber.stateNode);
            } else {
              commitHostRemoveChild(deletedFiber, nearestMountedAncestor, hostParent, deletedFiber.stateNode);
            }
          }
        }

        return;
      }

    case DehydratedFragment:
      {

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

    case HostPortal:
      {
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
    case SimpleMemoComponent:
      {
        if (!offscreenSubtreeWasHidden) {
          commitHookEffectListUnmount(Insertion, deletedFiber, nearestMountedAncestor);
        }

        if (!offscreenSubtreeWasHidden) {
          commitHookLayoutUnmountEffects(deletedFiber, nearestMountedAncestor, Layout);
        }

        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
        return;
      }

    case ClassComponent:
      {
        if (!offscreenSubtreeWasHidden) {
          safelyDetachRef(deletedFiber, nearestMountedAncestor);
          const instance = deletedFiber.stateNode;

          if (typeof instance.componentWillUnmount === 'function') {
            safelyCallComponentWillUnmount(deletedFiber, nearestMountedAncestor, instance);
          }
        }

        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
        return;
      }

    case ScopeComponent:
      {

        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
        return;
      }

    case OffscreenComponent:
      {
        if (!offscreenSubtreeWasHidden) {
          safelyDetachRef(deletedFiber, nearestMountedAncestor);
        }

        {
          const prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
          offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden || deletedFiber.memoizedState !== null;
          recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
          offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
        }

        break;
      }

    default:
      {
        recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
        return;
      }
  }
}

function commitSuspenseCallback(finishedWork) {
}

function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {

  const newState = finishedWork.memoizedState;

  if (newState === null) {
    const current = finishedWork.alternate;

    if (current !== null) {
      const prevState = current.memoizedState;

      if (prevState !== null) {
        const suspenseInstance = prevState.dehydrated;

        if (suspenseInstance !== null) {
          commitHostHydratedSuspense(suspenseInstance, finishedWork);
        }
      }
    }
  }
}

function getRetryCache(finishedWork) {
  switch (finishedWork.tag) {
    case SuspenseComponent:
    case SuspenseListComponent:
      {
        let retryCache = finishedWork.stateNode;

        if (retryCache === null) {
          retryCache = finishedWork.stateNode = new PossiblyWeakSet();
        }

        return retryCache;
      }

    case OffscreenComponent:
      {
        const instance = finishedWork.stateNode;
        let retryCache = instance._retryCache;

        if (retryCache === null) {
          retryCache = instance._retryCache = new PossiblyWeakSet();
        }

        return retryCache;
      }

    default:
      {
        throw new Error(`Unexpected Suspense handler tag (${finishedWork.tag}). This is a ` + 'bug in React.');
      }
  }
}

function detachOffscreenInstance(instance) {
  const fiber = instance._current;

  if (fiber === null) {
    throw new Error('Calling Offscreen.detach before instance handle has been set.');
  }

  if ((instance._pendingVisibility & OffscreenDetached) !== NoFlags$1) {
    return;
  }

  const root = enqueueConcurrentRenderForLane(fiber, SyncLane);

  if (root !== null) {
    instance._pendingVisibility |= OffscreenDetached;
    scheduleUpdateOnFiber(root, fiber, SyncLane);
  }
}
function attachOffscreenInstance(instance) {
  const fiber = instance._current;

  if (fiber === null) {
    throw new Error('Calling Offscreen.detach before instance handle has been set.');
  }

  if ((instance._pendingVisibility & OffscreenDetached) === NoFlags$1) {
    return;
  }

  const root = enqueueConcurrentRenderForLane(fiber, SyncLane);

  if (root !== null) {
    instance._pendingVisibility &= ~OffscreenDetached;
    scheduleUpdateOnFiber(root, fiber, SyncLane);
  }
}

function attachSuspenseRetryListeners(finishedWork, wakeables) {
  const retryCache = getRetryCache(finishedWork);
  wakeables.forEach(wakeable => {
    const retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);

    if (!retryCache.has(wakeable)) {
      retryCache.add(wakeable);

      wakeable.then(retry, retry);
    }
  });
}

function commitMutationEffects(root, finishedWork, committedLanes) {
  commitMutationEffectsOnFiber(finishedWork, root);
}

function recursivelyTraverseMutationEffects(root, parentFiber, lanes) {
  const deletions = parentFiber.deletions;

  if (deletions !== null) {
    for (let i = 0; i < deletions.length; i++) {
      const childToDelete = deletions[i];
      commitDeletionEffects(root, parentFiber, childToDelete);
    }
  }

  if (parentFiber.subtreeFlags & (MutationMask)) {
    let child = parentFiber.child;

    while (child !== null) {
      commitMutationEffectsOnFiber(child, root);
      child = child.sibling;
    }
  }
}

let currentHoistableRoot = null;

function commitMutationEffectsOnFiber(finishedWork, root, lanes) {
  const current = finishedWork.alternate;
  const flags = finishedWork.flags;

  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case MemoComponent:
    case SimpleMemoComponent:
      {
        recursivelyTraverseMutationEffects(root, finishedWork);
        commitReconciliationEffects(finishedWork);

        if (flags & Update) {
          commitHookEffectListUnmount(Insertion | HasEffect, finishedWork, finishedWork.return);
          commitHookEffectListMount(Insertion | HasEffect, finishedWork);
          commitHookLayoutUnmountEffects(finishedWork, finishedWork.return, Layout | HasEffect);
        }

        break;
      }

    case ClassComponent:
      {
        recursivelyTraverseMutationEffects(root, finishedWork);
        commitReconciliationEffects(finishedWork);

        if (flags & Ref) {
          if (!offscreenSubtreeWasHidden && current !== null) {
            safelyDetachRef(current, current.return);
          }
        }

        if (flags & Callback && offscreenSubtreeIsHidden) {
          const updateQueue = finishedWork.updateQueue;

          if (updateQueue !== null) {
            deferHiddenCallbacks(updateQueue);
          }
        }

        break;
      }

    case HostHoistable:
      {
        {
          const hoistableRoot = currentHoistableRoot;
          recursivelyTraverseMutationEffects(root, finishedWork);
          commitReconciliationEffects(finishedWork);

          if (flags & Ref) {
            if (!offscreenSubtreeWasHidden && current !== null) {
              safelyDetachRef(current, current.return);
            }
          }

          if (flags & Update) {
            const currentResource = current !== null ? current.memoizedState : null;
            const newResource = finishedWork.memoizedState;

            if (current === null) {
              if (newResource === null) {
                if (finishedWork.stateNode === null) {
                  finishedWork.stateNode = hydrateHoistable(hoistableRoot, finishedWork.type, finishedWork.memoizedProps, finishedWork);
                } else {
                  mountHoistable(hoistableRoot, finishedWork.type, finishedWork.stateNode);
                }
              } else {
                finishedWork.stateNode = acquireResource(hoistableRoot, newResource, finishedWork.memoizedProps);
              }
            } else if (currentResource !== newResource) {
              if (currentResource === null) {
                if (current.stateNode !== null) {
                  unmountHoistable(current.stateNode);
                }
              } else {
                releaseResource(currentResource);
              }

              if (newResource === null) {
                mountHoistable(hoistableRoot, finishedWork.type, finishedWork.stateNode);
              } else {
                acquireResource(hoistableRoot, newResource, finishedWork.memoizedProps);
              }
            } else if (newResource === null && finishedWork.stateNode !== null) {
              commitHostUpdate(finishedWork, finishedWork.memoizedProps, current.memoizedProps);
            }
          }

          break;
        }
      }

    case HostSingleton:
      {
        {
          if (flags & Update) {
            const previousWork = finishedWork.alternate;

            if (previousWork === null) {
              commitHostSingleton(finishedWork);
            }
          }
        }
      }

    case HostComponent:
      {
        recursivelyTraverseMutationEffects(root, finishedWork);
        commitReconciliationEffects(finishedWork);

        if (flags & Ref) {
          if (!offscreenSubtreeWasHidden && current !== null) {
            safelyDetachRef(current, current.return);
          }
        }

        {
          if (finishedWork.flags & ContentReset) {
            commitHostResetTextContent(finishedWork);
          }

          if (flags & Update) {
            const instance = finishedWork.stateNode;

            if (instance != null) {
              const newProps = finishedWork.memoizedProps;
              const oldProps = current !== null ? current.memoizedProps : newProps;
              commitHostUpdate(finishedWork, newProps, oldProps);
            }
          }

          if (flags & FormReset) {
            needsFormReset = true;

            {
              if (finishedWork.type !== 'form') {
                console.error('Unexpected host component type. Expected a form. This is a ' + 'bug in React.');
              }
            }
          }
        }

        break;
      }

    case HostText:
      {
        recursivelyTraverseMutationEffects(root, finishedWork);
        commitReconciliationEffects(finishedWork);

        if (flags & Update) {
          {
            if (finishedWork.stateNode === null) {
              throw new Error('This should have a text node initialized. This error is likely ' + 'caused by a bug in React. Please file an issue.');
            }

            const newText = finishedWork.memoizedProps;
            const oldText = current !== null ? current.memoizedProps : newText;
            commitHostTextUpdate(finishedWork, newText, oldText);
          }
        }

        break;
      }

    case HostRoot:
      {

        {
          prepareToCommitHoistables();
          const previousHoistableRoot = currentHoistableRoot;
          currentHoistableRoot = getHoistableRoot(root.containerInfo);
          recursivelyTraverseMutationEffects(root, finishedWork);
          currentHoistableRoot = previousHoistableRoot;
          commitReconciliationEffects(finishedWork);
        }

        if (flags & Update) {
          {
            if (current !== null) {
              const prevRootState = current.memoizedState;

              if (prevRootState.isDehydrated) {
                commitHostHydratedContainer(root, finishedWork);
              }
            }
          }
        }

        if (needsFormReset) {
          needsFormReset = false;
          recursivelyResetForms(finishedWork);
        }

        break;
      }

    case HostPortal:
      {
        {
          const previousHoistableRoot = currentHoistableRoot;
          currentHoistableRoot = getHoistableRoot(finishedWork.stateNode.containerInfo);
          recursivelyTraverseMutationEffects(root, finishedWork);
          commitReconciliationEffects(finishedWork);
          currentHoistableRoot = previousHoistableRoot;
        }

        break;
      }

    case Profiler:
      {
        recursivelyTraverseMutationEffects(root, finishedWork);
        commitReconciliationEffects(finishedWork);

        break;
      }

    case SuspenseComponent:
      {
        recursivelyTraverseMutationEffects(root, finishedWork);
        commitReconciliationEffects(finishedWork);
        const offscreenFiber = finishedWork.child;

        if (offscreenFiber.flags & Visibility) {
          const isShowingFallback = finishedWork.memoizedState !== null;
          const wasShowingFallback = current !== null && current.memoizedState !== null;

          {
            if (isShowingFallback !== wasShowingFallback) {
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

          const retryQueue = finishedWork.updateQueue;

          if (retryQueue !== null) {
            finishedWork.updateQueue = null;
            attachSuspenseRetryListeners(finishedWork, retryQueue);
          }
        }

        break;
      }

    case OffscreenComponent:
      {
        if (flags & Ref) {
          if (!offscreenSubtreeWasHidden && current !== null) {
            safelyDetachRef(current, current.return);
          }
        }

        const newState = finishedWork.memoizedState;
        const isHidden = newState !== null;
        const wasHidden = current !== null && current.memoizedState !== null;

        {
          const prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden;
          const prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
          offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden || isHidden;
          offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden || wasHidden;
          recursivelyTraverseMutationEffects(root, finishedWork);
          offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
          offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
        }

        commitReconciliationEffects(finishedWork);
        const offscreenInstance = finishedWork.stateNode;
        offscreenInstance._current = finishedWork;
        offscreenInstance._visibility &= ~OffscreenDetached;
        offscreenInstance._visibility |= offscreenInstance._pendingVisibility & OffscreenDetached;

        if (flags & Visibility) {
          if (isHidden) {
            offscreenInstance._visibility &= ~OffscreenVisible;
          } else {
            offscreenInstance._visibility |= OffscreenVisible;
          }

          if (isHidden) {
            const isUpdate = current !== null;
            const wasHiddenByAncestorOffscreen = offscreenSubtreeIsHidden || offscreenSubtreeWasHidden;

            if (isUpdate && !wasHidden && !wasHiddenByAncestorOffscreen) {
              {
                recursivelyTraverseDisappearLayoutEffects(finishedWork);
              }
            }
          }

          if (!isOffscreenManual(finishedWork)) {
            hideOrUnhideAllChildren(finishedWork, isHidden);
          }
        }

        if (flags & Update) {
          const offscreenQueue = finishedWork.updateQueue;

          if (offscreenQueue !== null) {
            const retryQueue = offscreenQueue.retryQueue;

            if (retryQueue !== null) {
              offscreenQueue.retryQueue = null;
              attachSuspenseRetryListeners(finishedWork, retryQueue);
            }
          }
        }

        break;
      }

    case SuspenseListComponent:
      {
        recursivelyTraverseMutationEffects(root, finishedWork);
        commitReconciliationEffects(finishedWork);

        if (flags & Update) {
          const retryQueue = finishedWork.updateQueue;

          if (retryQueue !== null) {
            finishedWork.updateQueue = null;
            attachSuspenseRetryListeners(finishedWork, retryQueue);
          }
        }

        break;
      }

    case ScopeComponent:
      {

        break;
      }

    default:
      {
        recursivelyTraverseMutationEffects(root, finishedWork);
        commitReconciliationEffects(finishedWork);
        break;
      }
  }
}

function commitReconciliationEffects(finishedWork) {
  const flags = finishedWork.flags;

  if (flags & Placement) {
    commitHostPlacement(finishedWork);
    finishedWork.flags &= ~Placement;
  }

  if (flags & Hydrating) {
    finishedWork.flags &= ~Hydrating;
  }
}

function recursivelyResetForms(parentFiber) {
  if (parentFiber.subtreeFlags & FormReset) {
    let child = parentFiber.child;

    while (child !== null) {
      resetFormOnFiber(child);
      child = child.sibling;
    }
  }
}

function resetFormOnFiber(fiber) {
  recursivelyResetForms(fiber);

  if (fiber.tag === HostComponent && fiber.flags & FormReset) {
    const formInstance = fiber.stateNode;
    resetFormInstance(formInstance);
  }
}

function commitLayoutEffects(finishedWork, root, committedLanes) {
  const current = finishedWork.alternate;
  commitLayoutEffectOnFiber(root, current, finishedWork);
}

function recursivelyTraverseLayoutEffects(root, parentFiber, lanes) {
  if (parentFiber.subtreeFlags & LayoutMask) {
    let child = parentFiber.child;

    while (child !== null) {
      const current = child.alternate;
      commitLayoutEffectOnFiber(root, current, child);
      child = child.sibling;
    }
  }
}

function disappearLayoutEffects(finishedWork) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case MemoComponent:
    case SimpleMemoComponent:
      {
        commitHookLayoutUnmountEffects(finishedWork, finishedWork.return, Layout);
        recursivelyTraverseDisappearLayoutEffects(finishedWork);
        break;
      }

    case ClassComponent:
      {
        safelyDetachRef(finishedWork, finishedWork.return);
        const instance = finishedWork.stateNode;

        if (typeof instance.componentWillUnmount === 'function') {
          safelyCallComponentWillUnmount(finishedWork, finishedWork.return, instance);
        }

        recursivelyTraverseDisappearLayoutEffects(finishedWork);
        break;
      }

    case HostHoistable:
    case HostSingleton:
    case HostComponent:
      {
        safelyDetachRef(finishedWork, finishedWork.return);
        recursivelyTraverseDisappearLayoutEffects(finishedWork);
        break;
      }

    case OffscreenComponent:
      {
        safelyDetachRef(finishedWork, finishedWork.return);
        const isHidden = finishedWork.memoizedState !== null;

        if (isHidden) ; else {
          recursivelyTraverseDisappearLayoutEffects(finishedWork);
        }

        break;
      }

    default:
      {
        recursivelyTraverseDisappearLayoutEffects(finishedWork);
        break;
      }
  }
}

function recursivelyTraverseDisappearLayoutEffects(parentFiber) {
  let child = parentFiber.child;

  while (child !== null) {
    disappearLayoutEffects(child);
    child = child.sibling;
  }
}

function reappearLayoutEffects(finishedRoot, current, finishedWork, includeWorkInProgressEffects) {
  const flags = finishedWork.flags;

  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
      {
        recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
        commitHookLayoutEffects(finishedWork, Layout);
        break;
      }

    case ClassComponent:
      {
        recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
        commitClassDidMount(finishedWork);
        commitClassHiddenCallbacks(finishedWork);

        if (includeWorkInProgressEffects && flags & Callback) {
          commitClassCallbacks(finishedWork);
        }

        safelyAttachRef(finishedWork, finishedWork.return);
        break;
      }

    case HostHoistable:
    case HostSingleton:
    case HostComponent:
      {
        recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);

        if (includeWorkInProgressEffects && current === null && flags & Update) {
          commitHostMount(finishedWork);
        }

        safelyAttachRef(finishedWork, finishedWork.return);
        break;
      }

    case Profiler:
      {
        if (includeWorkInProgressEffects && flags & Update) {
          recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
        } else {
          recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
        }

        break;
      }

    case SuspenseComponent:
      {
        recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);

        if (includeWorkInProgressEffects && flags & Update) {
          commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
        }

        break;
      }

    case OffscreenComponent:
      {
        const offscreenState = finishedWork.memoizedState;
        const isHidden = offscreenState !== null;

        if (isHidden) ; else {
          recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
        }

        safelyAttachRef(finishedWork, finishedWork.return);
        break;
      }

    default:
      {
        recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
        break;
      }
  }
}

function recursivelyTraverseReappearLayoutEffects(finishedRoot, parentFiber, includeWorkInProgressEffects) {
  const childShouldIncludeWorkInProgressEffects = includeWorkInProgressEffects && (parentFiber.subtreeFlags & LayoutMask) !== NoFlags$1;
  let child = parentFiber.child;

  while (child !== null) {
    const current = child.alternate;
    reappearLayoutEffects(finishedRoot, current, child, childShouldIncludeWorkInProgressEffects);
    child = child.sibling;
  }
}

function commitOffscreenPassiveMountEffects(current, finishedWork, instance) {
  {
    let previousCache = null;

    if (current !== null && current.memoizedState !== null && current.memoizedState.cachePool !== null) {
      previousCache = current.memoizedState.cachePool.pool;
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
}

function commitCachePassiveMountEffect(current, finishedWork) {
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
}

function commitPassiveMountEffects(root, finishedWork, committedLanes, committedTransitions, renderEndTime) {
  commitPassiveMountOnFiber(root, finishedWork, committedLanes, committedTransitions);
}

function recursivelyTraversePassiveMountEffects(root, parentFiber, committedLanes, committedTransitions, endTime) {
  if (parentFiber.subtreeFlags & PassiveMask || enableProfilerTimer   ) {
    let child = parentFiber.child;

    while (child !== null) {
      {
        commitPassiveMountOnFiber(root, child, committedLanes, committedTransitions);
        child = child.sibling;
      }
    }
  }
}

function commitPassiveMountOnFiber(finishedRoot, finishedWork, committedLanes, committedTransitions, endTime) {

  const flags = finishedWork.flags;

  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
      {
        recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);

        if (flags & Passive$1) {
          commitHookPassiveMountEffects(finishedWork, Passive | HasEffect);
        }

        break;
      }

    case HostRoot:
      {
        recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);

        if (flags & Passive$1) {
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
        }

        break;
      }

    case Profiler:
      {
        if (flags & Passive$1) {
          recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
          const profilerInstance = finishedWork.stateNode;

          commitProfilerPostCommit(finishedWork, finishedWork.alternate, commitStartTime, profilerInstance.passiveEffectDuration);
        } else {
          recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
        }

        break;
      }

    case LegacyHiddenComponent:
      {

        break;
      }

    case OffscreenComponent:
      {
        const instance = finishedWork.stateNode;
        const nextState = finishedWork.memoizedState;
        const isHidden = nextState !== null;

        if (isHidden) {
          if (instance._visibility & OffscreenPassiveEffectsConnected) {
            recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
          } else {
            {
              {
                recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
              }
            }
          }
        } else {
          if (instance._visibility & OffscreenPassiveEffectsConnected) {
            recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
          } else {
            instance._visibility |= OffscreenPassiveEffectsConnected;
            const includeWorkInProgressEffects = (finishedWork.subtreeFlags & PassiveMask) !== NoFlags$1;
            recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);
          }
        }

        if (flags & Passive$1) {
          const current = finishedWork.alternate;
          commitOffscreenPassiveMountEffects(current, finishedWork);
        }

        break;
      }

    case CacheComponent:
      {
        recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);

        if (flags & Passive$1) {
          const current = finishedWork.alternate;
          commitCachePassiveMountEffect(current, finishedWork);
        }

        break;
      }

    case TracingMarkerComponent:

    default:
      {
        recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
        break;
      }
  }
}

function recursivelyTraverseReconnectPassiveEffects(finishedRoot, parentFiber, committedLanes, committedTransitions, includeWorkInProgressEffects) {
  const childShouldIncludeWorkInProgressEffects = includeWorkInProgressEffects && (parentFiber.subtreeFlags & PassiveMask) !== NoFlags$1;
  let child = parentFiber.child;

  while (child !== null) {
    reconnectPassiveEffects(finishedRoot, child, committedLanes, committedTransitions, childShouldIncludeWorkInProgressEffects);
    child = child.sibling;
  }
}

function reconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects) {
  const flags = finishedWork.flags;

  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
      {
        recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);
        commitHookPassiveMountEffects(finishedWork, Passive);
        break;
      }

    case LegacyHiddenComponent:
      {

        break;
      }

    case OffscreenComponent:
      {
        const instance = finishedWork.stateNode;
        const nextState = finishedWork.memoizedState;
        const isHidden = nextState !== null;

        if (isHidden) {
          if (instance._visibility & OffscreenPassiveEffectsConnected) {
            recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);
          } else {
            {
              {
                recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
              }
            }
          }
        } else {
          instance._visibility |= OffscreenPassiveEffectsConnected;
          recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);
        }

        if (includeWorkInProgressEffects && flags & Passive$1) {
          const current = finishedWork.alternate;
          commitOffscreenPassiveMountEffects(current, finishedWork);
        }

        break;
      }

    case CacheComponent:
      {
        recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);

        if (includeWorkInProgressEffects && flags & Passive$1) {
          const current = finishedWork.alternate;
          commitCachePassiveMountEffect(current, finishedWork);
        }

        break;
      }

    case TracingMarkerComponent:

    default:
      {
        recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);
        break;
      }
  }
}

function recursivelyTraverseAtomicPassiveEffects(finishedRoot, parentFiber, committedLanes, committedTransitions) {
  if (parentFiber.subtreeFlags & PassiveMask) {
    let child = parentFiber.child;

    while (child !== null) {
      commitAtomicPassiveEffects(finishedRoot, child);
      child = child.sibling;
    }
  }
}

function commitAtomicPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions) {
  const flags = finishedWork.flags;

  switch (finishedWork.tag) {
    case OffscreenComponent:
      {
        recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);

        if (flags & Passive$1) {
          const current = finishedWork.alternate;
          commitOffscreenPassiveMountEffects(current, finishedWork);
        }

        break;
      }

    case CacheComponent:
      {
        recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);

        if (flags & Passive$1) {
          const current = finishedWork.alternate;
          commitCachePassiveMountEffect(current, finishedWork);
        }

        break;
      }

    default:
      {
        recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
        break;
      }
  }
}

function commitPassiveUnmountEffects(finishedWork) {
  commitPassiveUnmountOnFiber(finishedWork);
}
let suspenseyCommitFlag = ShouldSuspendCommit;
function accumulateSuspenseyCommit(finishedWork) {
  accumulateSuspenseyCommitOnFiber(finishedWork);
}

function recursivelyAccumulateSuspenseyCommit(parentFiber) {
  if (parentFiber.subtreeFlags & suspenseyCommitFlag) {
    let child = parentFiber.child;

    while (child !== null) {
      accumulateSuspenseyCommitOnFiber(child);
      child = child.sibling;
    }
  }
}

function accumulateSuspenseyCommitOnFiber(fiber) {
  switch (fiber.tag) {
    case HostHoistable:
      {
        recursivelyAccumulateSuspenseyCommit(fiber);

        if (fiber.flags & suspenseyCommitFlag) {
          if (fiber.memoizedState !== null) {
            suspendResource(currentHoistableRoot, fiber.memoizedState, fiber.memoizedProps);
          }
        }

        break;
      }

    case HostComponent:
      {
        recursivelyAccumulateSuspenseyCommit(fiber);

        break;
      }

    case HostRoot:
    case HostPortal:
      {
        {
          const previousHoistableRoot = currentHoistableRoot;
          const container = fiber.stateNode.containerInfo;
          currentHoistableRoot = getHoistableRoot(container);
          recursivelyAccumulateSuspenseyCommit(fiber);
          currentHoistableRoot = previousHoistableRoot;
        }

        break;
      }

    case OffscreenComponent:
      {
        const isHidden = fiber.memoizedState !== null;

        if (isHidden) ; else {
          const current = fiber.alternate;
          const wasHidden = current !== null && current.memoizedState !== null;

          if (wasHidden) {
            const prevFlags = suspenseyCommitFlag;
            suspenseyCommitFlag = MaySuspendCommit;
            recursivelyAccumulateSuspenseyCommit(fiber);
            suspenseyCommitFlag = prevFlags;
          } else {
            recursivelyAccumulateSuspenseyCommit(fiber);
          }
        }

        break;
      }

    default:
      {
        recursivelyAccumulateSuspenseyCommit(fiber);
      }
  }
}

function detachAlternateSiblings(parentFiber) {
  const previousFiber = parentFiber.alternate;

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

function recursivelyTraversePassiveUnmountEffects(parentFiber) {
  const deletions = parentFiber.deletions;

  if ((parentFiber.flags & ChildDeletion) !== NoFlags$1) {
    if (deletions !== null) {
      for (let i = 0; i < deletions.length; i++) {
        const childToDelete = deletions[i];
        nextEffect = childToDelete;
        commitPassiveUnmountEffectsInsideOfDeletedTree_begin(childToDelete, parentFiber);
      }
    }

    detachAlternateSiblings(parentFiber);
  }

  if (parentFiber.subtreeFlags & PassiveMask) {
    let child = parentFiber.child;

    while (child !== null) {
      commitPassiveUnmountOnFiber(child);
      child = child.sibling;
    }
  }
}

function commitPassiveUnmountOnFiber(finishedWork) {

  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
      {
        recursivelyTraversePassiveUnmountEffects(finishedWork);

        if (finishedWork.flags & Passive$1) {
          commitHookPassiveUnmountEffects(finishedWork, finishedWork.return, Passive | HasEffect);
        }

        break;
      }

    case HostRoot:
      {
        recursivelyTraversePassiveUnmountEffects(finishedWork);

        break;
      }

    case Profiler:
      {
        recursivelyTraversePassiveUnmountEffects(finishedWork);

        break;
      }

    case OffscreenComponent:
      {
        const instance = finishedWork.stateNode;
        const nextState = finishedWork.memoizedState;
        const isHidden = nextState !== null;

        if (isHidden && instance._visibility & OffscreenPassiveEffectsConnected && (finishedWork.return === null || finishedWork.return.tag !== SuspenseComponent)) {
          instance._visibility &= ~OffscreenPassiveEffectsConnected;
          recursivelyTraverseDisconnectPassiveEffects(finishedWork);
        } else {
          recursivelyTraversePassiveUnmountEffects(finishedWork);
        }

        break;
      }

    default:
      {
        recursivelyTraversePassiveUnmountEffects(finishedWork);
        break;
      }
  }
}

function recursivelyTraverseDisconnectPassiveEffects(parentFiber) {
  const deletions = parentFiber.deletions;

  if ((parentFiber.flags & ChildDeletion) !== NoFlags$1) {
    if (deletions !== null) {
      for (let i = 0; i < deletions.length; i++) {
        const childToDelete = deletions[i];
        nextEffect = childToDelete;
        commitPassiveUnmountEffectsInsideOfDeletedTree_begin(childToDelete, parentFiber);
      }
    }

    detachAlternateSiblings(parentFiber);
  }

  let child = parentFiber.child;

  while (child !== null) {
    disconnectPassiveEffect(child);
    child = child.sibling;
  }
}

function disconnectPassiveEffect(finishedWork) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
      {
        commitHookPassiveUnmountEffects(finishedWork, finishedWork.return, Passive);
        recursivelyTraverseDisconnectPassiveEffects(finishedWork);
        break;
      }

    case OffscreenComponent:
      {
        const instance = finishedWork.stateNode;

        if (instance._visibility & OffscreenPassiveEffectsConnected) {
          instance._visibility &= ~OffscreenPassiveEffectsConnected;
          recursivelyTraverseDisconnectPassiveEffects(finishedWork);
        }

        break;
      }

    default:
      {
        recursivelyTraverseDisconnectPassiveEffects(finishedWork);
        break;
      }
  }
}

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

function commitPassiveUnmountEffectsInsideOfDeletedTree_complete(deletedSubtreeRoot) {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    const sibling = fiber.sibling;
    const returnFiber = fiber.return;
    detachFiberAfterEffects(fiber);

    if (fiber === deletedSubtreeRoot) {
      nextEffect = null;
      return;
    }

    if (sibling !== null) {
      sibling.return = returnFiber;
      nextEffect = sibling;
      return;
    }

    nextEffect = returnFiber;
  }
}

function commitPassiveUnmountInsideDeletedTreeOnFiber(current, nearestMountedAncestor) {
  switch (current.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
      {
        commitHookPassiveUnmountEffects(current, nearestMountedAncestor, Passive);
        break;
      }

    case LegacyHiddenComponent:
    case OffscreenComponent:
      {
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

    case SuspenseComponent:
      {

        break;
      }

    case CacheComponent:
      {
        {
          const cache = current.memoizedState.cache;
          releaseCache(cache);
        }

        break;
      }
  }
}

let hasBadMapPolyfill;

{
  hasBadMapPolyfill = false;

  try {
    const nonExtensibleObject = Object.preventExtensions({});
    new Map([[nonExtensibleObject, null]]);
    new Set([nonExtensibleObject]);
  } catch (e) {
    hasBadMapPolyfill = true;
  }
}

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
  this.refCleanup = null;
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;
  this.mode = mode;
  this.flags = NoFlags$1;
  this.subtreeFlags = NoFlags$1;
  this.deletions = null;
  this.lanes = NoLanes;
  this.childLanes = NoLanes;
  this.alternate = null;

  {
    this._debugInfo = null;
    this._debugOwner = null;

    this._debugNeedsRemount = false;
    this._debugHookTypes = null;

    if (!hasBadMapPolyfill && typeof Object.preventExtensions === 'function') {
      Object.preventExtensions(this);
    }
  }
}

function createFiberImplClass(tag, pendingProps, key, mode) {
  return new FiberNode(tag, pendingProps, key, mode);
}

const createFiber = createFiberImplClass;

function shouldConstruct(Component) {
  const prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}

function isSimpleFunctionComponent(type) {
  return typeof type === 'function' && !shouldConstruct(type) && type.defaultProps === undefined;
}
function isFunctionClassComponent(type) {
  return shouldConstruct(type);
}
function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;

  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key, current.mode);
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;

    {
      workInProgress._debugOwner = current._debugOwner;

      workInProgress._debugHookTypes = current._debugHookTypes;
    }

    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type;
    workInProgress.flags = NoFlags$1;
    workInProgress.subtreeFlags = NoFlags$1;
    workInProgress.deletions = null;
  }

  workInProgress.flags = current.flags & StaticMask;
  workInProgress.childLanes = current.childLanes;
  workInProgress.lanes = current.lanes;
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  const currentDependencies = current.dependencies;
  workInProgress.dependencies = currentDependencies === null ? null : {
    lanes: currentDependencies.lanes,
    firstContext: currentDependencies.firstContext,
    _debugThenableState: currentDependencies._debugThenableState
  } ;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;
  workInProgress.refCleanup = current.refCleanup;

  {
    workInProgress._debugInfo = current._debugInfo;
    workInProgress._debugNeedsRemount = current._debugNeedsRemount;

    switch (workInProgress.tag) {
      case FunctionComponent:
      case SimpleMemoComponent:
        workInProgress.type = resolveFunctionForHotReloading(current.type);
        break;

      case ClassComponent:
        workInProgress.type = resolveClassForHotReloading(current.type);
        break;

      case ForwardRef:
        workInProgress.type = resolveForwardRefForHotReloading(current.type);
        break;
    }
  }

  return workInProgress;
}
function resetWorkInProgress(workInProgress, renderLanes) {
  workInProgress.flags &= StaticMask | Placement;
  const current = workInProgress.alternate;

  if (current === null) {
    workInProgress.childLanes = NoLanes;
    workInProgress.lanes = renderLanes;
    workInProgress.child = null;
    workInProgress.subtreeFlags = NoFlags$1;
    workInProgress.memoizedProps = null;
    workInProgress.memoizedState = null;
    workInProgress.updateQueue = null;
    workInProgress.dependencies = null;
    workInProgress.stateNode = null;
  } else {
    workInProgress.childLanes = current.childLanes;
    workInProgress.lanes = current.lanes;
    workInProgress.child = current.child;
    workInProgress.subtreeFlags = NoFlags$1;
    workInProgress.deletions = null;
    workInProgress.memoizedProps = current.memoizedProps;
    workInProgress.memoizedState = current.memoizedState;
    workInProgress.updateQueue = current.updateQueue;
    workInProgress.type = current.type;
    const currentDependencies = current.dependencies;
    workInProgress.dependencies = currentDependencies === null ? null : {
      lanes: currentDependencies.lanes,
      firstContext: currentDependencies.firstContext,
      _debugThenableState: currentDependencies._debugThenableState
    } ;
  }

  return workInProgress;
}
function createHostRootFiber(tag, isStrictMode) {
  let mode;

  {
    mode = ConcurrentMode;

    if (isStrictMode === true) {
      mode |= StrictLegacyMode | StrictEffectsMode;
    }
  }

  return createFiber(HostRoot, null, null, mode);
}
function createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes) {
  let fiberTag = FunctionComponent;
  let resolvedType = type;

  if (typeof type === 'function') {
    if (shouldConstruct(type)) {
      fiberTag = ClassComponent;

      {
        resolvedType = resolveClassForHotReloading(resolvedType);
      }
    } else {
      {
        resolvedType = resolveFunctionForHotReloading(resolvedType);
      }
    }
  } else if (typeof type === 'string') {
    {
      const hostContext = getHostContext();
      fiberTag = isHostHoistableType(type, pendingProps, hostContext) ? HostHoistable : isHostSingletonType(type) ? HostSingleton : HostComponent;
    }
  } else {
    getTag: switch (type) {
      case REACT_FRAGMENT_TYPE:
        return createFiberFromFragment(pendingProps.children, mode, lanes, key);

      case REACT_STRICT_MODE_TYPE:
        fiberTag = Mode;
        mode |= StrictLegacyMode;

        {
          mode |= StrictEffectsMode;
        }

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

      case REACT_TRACING_MARKER_TYPE:

      case REACT_DEBUG_TRACING_MODE_TYPE:

      default:
        {
          if (typeof type === 'object' && type !== null) {
            switch (type.$$typeof) {
              case REACT_PROVIDER_TYPE:

              case REACT_CONTEXT_TYPE:
                {
                  fiberTag = ContextProvider;
                  break getTag;
                }

              case REACT_CONSUMER_TYPE:
                {
                  fiberTag = ContextConsumer;
                  break getTag;
                }

              case REACT_FORWARD_REF_TYPE:
                fiberTag = ForwardRef;

                {
                  resolvedType = resolveForwardRefForHotReloading(resolvedType);
                }

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

          let info = '';
          let typeString;

          {
            if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
              info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
            }

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

            const ownerName = owner ? getComponentNameFromOwner(owner) : null;

            if (ownerName) {
              info += '\n\nCheck the render method of `' + ownerName + '`.';
            }
          }

          fiberTag = Throw;
          pendingProps = new Error('Element type is invalid: expected a string (for built-in ' + 'components) or a class/function (for composite components) ' + `but got: ${typeString}.${info}`);
          resolvedType = null;
        }
    }
  }

  const fiber = createFiber(fiberTag, pendingProps, key, mode);
  fiber.elementType = type;
  fiber.type = resolvedType;
  fiber.lanes = lanes;

  {
    fiber._debugOwner = owner;
  }

  return fiber;
}
function createFiberFromElement(element, mode, lanes) {
  let owner = null;

  {
    owner = element._owner;
  }

  const type = element.type;
  const key = element.key;
  const pendingProps = element.props;
  const fiber = createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes);

  {
    fiber._debugOwner = element._owner;
  }

  return fiber;
}
function createFiberFromFragment(elements, mode, lanes, key) {
  const fiber = createFiber(Fragment, elements, key, mode);
  fiber.lanes = lanes;
  return fiber;
}

function createFiberFromProfiler(pendingProps, mode, lanes, key) {
  {
    if (typeof pendingProps.id !== 'string') {
      console.error('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof pendingProps.id);
    }
  }

  const fiber = createFiber(Profiler, pendingProps, key, mode | ProfileMode);
  fiber.elementType = REACT_PROFILER_TYPE;
  fiber.lanes = lanes;

  return fiber;
}

function createFiberFromSuspense(pendingProps, mode, lanes, key) {
  const fiber = createFiber(SuspenseComponent, pendingProps, key, mode);
  fiber.elementType = REACT_SUSPENSE_TYPE;
  fiber.lanes = lanes;
  return fiber;
}
function createFiberFromSuspenseList(pendingProps, mode, lanes, key) {
  const fiber = createFiber(SuspenseListComponent, pendingProps, key, mode);
  fiber.elementType = REACT_SUSPENSE_LIST_TYPE;
  fiber.lanes = lanes;
  return fiber;
}
function createFiberFromOffscreen(pendingProps, mode, lanes, key) {
  const fiber = createFiber(OffscreenComponent, pendingProps, key, mode);
  fiber.elementType = REACT_OFFSCREEN_TYPE;
  fiber.lanes = lanes;
  const primaryChildInstance = {
    _visibility: OffscreenVisible,
    _pendingVisibility: OffscreenVisible,
    _pendingMarkers: null,
    _retryCache: null,
    _transitions: null,
    _current: null,
    detach: () => detachOffscreenInstance(primaryChildInstance),
    attach: () => attachOffscreenInstance(primaryChildInstance)
  };
  fiber.stateNode = primaryChildInstance;
  return fiber;
}
function createFiberFromText(content, mode, lanes) {
  const fiber = createFiber(HostText, content, null, mode);
  fiber.lanes = lanes;
  return fiber;
}
function createFiberFromDehydratedFragment(dehydratedNode) {
  const fiber = createFiber(DehydratedFragment, null, null, NoMode);
  fiber.stateNode = dehydratedNode;
  return fiber;
}
function createFiberFromPortal(portal, mode, lanes) {
  const pendingProps = portal.children !== null ? portal.children : [];
  const fiber = createFiber(HostPortal, pendingProps, portal.key, mode);
  fiber.lanes = lanes;
  fiber.stateNode = {
    containerInfo: portal.containerInfo,
    pendingChildren: null,
    implementation: portal.implementation
  };
  return fiber;
}
function createFiberFromThrow(error, mode, lanes) {
  const fiber = createFiber(Throw, error, null, mode);
  fiber.lanes = lanes;
  return fiber;
}

function isRootDehydrated(root) {
  const currentState = root.current.memoizedState;
  return currentState.isDehydrated;
}

function markUpdate(workInProgress) {
  workInProgress.flags |= Update;
}

function appendAllChildren(parent, workInProgress, needsVisibilityToggle, isHidden) {
  {
    let node = workInProgress.child;

    while (node !== null) {
      if (node.tag === HostComponent || node.tag === HostText) {
        appendInitialChild(parent, node.stateNode);
      } else if (node.tag === HostPortal || (node.tag === HostSingleton )) ; else if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }

      if (node === workInProgress) {
        return;
      }

      while (node.sibling === null) {
        if (node.return === null || node.return === workInProgress) {
          return;
        }

        node = node.return;
      }

      node.sibling.return = node.return;
      node = node.sibling;
    }
  }
}

function updateHostComponent(current, workInProgress, type, newProps, renderLanes) {
  {
    const oldProps = current.memoizedProps;

    if (oldProps === newProps) {
      return;
    }

    markUpdate(workInProgress);
  }
}

function preloadInstanceAndSuspendIfNeeded(workInProgress, type, props, renderLanes) {
  {
    workInProgress.flags &= ~MaySuspendCommit;
    return;
  }
}

function preloadResourceAndSuspendIfNeeded(workInProgress, resource, type, props, renderLanes) {
  if (!mayResourceSuspendCommit(resource)) {
    workInProgress.flags &= ~MaySuspendCommit;
    return;
  }

  workInProgress.flags |= MaySuspendCommit;
  const isReady = preloadResource(resource);

  if (!isReady) {
    if (shouldRemainOnPreviousScreen()) {
      workInProgress.flags |= ShouldSuspendCommit;
    } else {
      suspendCommit();
    }
  }
}

function scheduleRetryEffect(workInProgress, retryQueue) {
  const wakeables = retryQueue;

  if (wakeables !== null) {
    workInProgress.flags |= Update;
  }

  if (workInProgress.flags & ScheduleRetry) {
    const retryLane = workInProgress.tag !== OffscreenComponent ? claimNextRetryLane() : OffscreenLane;
    workInProgress.lanes = mergeLanes(workInProgress.lanes, retryLane);

    {
      markSpawnedRetryLane(retryLane);
    }
  }
}

function updateHostText(current, workInProgress, oldText, newText) {
  {
    if (oldText !== newText) {
      markUpdate(workInProgress);
    }
  }
}

function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
  if (getIsHydrating()) {
    return;
  }

  switch (renderState.tailMode) {
    case 'hidden':
      {
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

    case 'collapsed':
      {
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

function bubbleProperties(completedWork) {
  const didBailout = completedWork.alternate !== null && completedWork.alternate.child === completedWork.child;
  let newChildLanes = NoLanes;
  let subtreeFlags = NoFlags$1;

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

function completeDehydratedSuspenseBoundary(current, workInProgress, nextState) {
  const wasHydrated = popHydrationState(workInProgress);

  if (nextState !== null && nextState.dehydrated !== null) {
    if (current === null) {
      if (!wasHydrated) {
        throw new Error('A dehydrated suspense component was completed without a hydrated node. ' + 'This is probably a bug in React.');
      }

      prepareToHydrateHostSuspenseInstance(workInProgress);
      bubbleProperties(workInProgress);

      return false;
    } else {
      emitPendingHydrationWarnings();
      resetHydrationState();

      if ((workInProgress.flags & DidCapture) === NoFlags$1) {
        workInProgress.memoizedState = null;
      }

      workInProgress.flags |= Update;
      bubbleProperties(workInProgress);

      return false;
    }
  } else {
    upgradeHydrationErrorsToRecoverable();
    return true;
  }
}

function completeWork(current, workInProgress, renderLanes) {
  const newProps = workInProgress.pendingProps;
  popTreeContext(workInProgress);

  switch (workInProgress.tag) {
    case IncompleteFunctionComponent:
      {
        {
          break;
        }
      }

    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      bubbleProperties(workInProgress);
      return null;

    case ClassComponent:
      {

        bubbleProperties(workInProgress);
        return null;
      }

    case HostRoot:
      {
        const fiberRoot = workInProgress.stateNode;

        {
          let previousCache = null;

          if (current !== null) {
            previousCache = current.memoizedState.cache;
          }

          const cache = workInProgress.memoizedState.cache;

          if (cache !== previousCache) {
            workInProgress.flags |= Passive$1;
          }

          popCacheProvider(workInProgress);
        }
        popHostContainer(workInProgress);

        if (fiberRoot.pendingContext) {
          fiberRoot.context = fiberRoot.pendingContext;
          fiberRoot.pendingContext = null;
        }

        if (current === null || current.child === null) {
          const wasHydrated = popHydrationState(workInProgress);

          if (wasHydrated) {
            emitPendingHydrationWarnings();
            markUpdate(workInProgress);
          } else {
            if (current !== null) {
              const prevState = current.memoizedState;

              if (!prevState.isDehydrated || (workInProgress.flags & ForceClientRender) !== NoFlags$1) {
                workInProgress.flags |= Snapshot;
                upgradeHydrationErrorsToRecoverable();
              }
            }
          }
        }
        bubbleProperties(workInProgress);

        return null;
      }

    case HostHoistable:
      {
        {
          const nextResource = workInProgress.memoizedState;

          if (current === null) {
            markUpdate(workInProgress);

            if (nextResource !== null) {
              bubbleProperties(workInProgress);
              preloadResourceAndSuspendIfNeeded(workInProgress, nextResource);
              return null;
            } else {
              bubbleProperties(workInProgress);
              preloadInstanceAndSuspendIfNeeded(workInProgress);
              return null;
            }
          } else {
            if (nextResource) {
              if (nextResource !== current.memoizedState) {
                markUpdate(workInProgress);
                bubbleProperties(workInProgress);
                preloadResourceAndSuspendIfNeeded(workInProgress, nextResource);
                return null;
              } else {
                bubbleProperties(workInProgress);
                workInProgress.flags &= ~MaySuspendCommit;
                return null;
              }
            } else {
              {
                const oldProps = current.memoizedProps;

                if (oldProps !== newProps) {
                  markUpdate(workInProgress);
                }
              }

              bubbleProperties(workInProgress);
              preloadInstanceAndSuspendIfNeeded(workInProgress);
              return null;
            }
          }
        }
      }

    case HostSingleton:
      {
        {
          popHostContext(workInProgress);
          const rootContainerInstance = getRootHostContainer();
          const type = workInProgress.type;

          if (current !== null && workInProgress.stateNode != null) {
            {
              const oldProps = current.memoizedProps;

              if (oldProps !== newProps) {
                markUpdate(workInProgress);
              }
            }
          } else {
            if (!newProps) {
              if (workInProgress.stateNode === null) {
                throw new Error('We must have new props for new mounts. This error is likely ' + 'caused by a bug in React. Please file an issue.');
              }

              bubbleProperties(workInProgress);
              return null;
            }

            const currentHostContext = getHostContext();
            const wasHydrated = popHydrationState(workInProgress);
            let instance;

            if (wasHydrated) {
              prepareToHydrateHostInstance(workInProgress, currentHostContext);
              instance = workInProgress.stateNode;
            } else {
              instance = resolveSingletonInstance(type, newProps, rootContainerInstance, currentHostContext, true);
              workInProgress.stateNode = instance;
              markUpdate(workInProgress);
            }
          }

          bubbleProperties(workInProgress);
          return null;
        }
      }

    case HostComponent:
      {
        popHostContext(workInProgress);
        const type = workInProgress.type;

        if (current !== null && workInProgress.stateNode != null) {
          updateHostComponent(current, workInProgress, type, newProps);
        } else {
          if (!newProps) {
            if (workInProgress.stateNode === null) {
              throw new Error('We must have new props for new mounts. This error is likely ' + 'caused by a bug in React. Please file an issue.');
            }

            bubbleProperties(workInProgress);
            return null;
          }

          const currentHostContext = getHostContext();
          const wasHydrated = popHydrationState(workInProgress);

          if (wasHydrated) {
            prepareToHydrateHostInstance(workInProgress, currentHostContext);
          } else {
            const rootContainerInstance = getRootHostContainer();
            const instance = createInstance(type, newProps, rootContainerInstance, currentHostContext, workInProgress);
            appendAllChildren(instance, workInProgress);
            workInProgress.stateNode = instance;

            if (finalizeInitialChildren(instance, type, newProps)) {
              markUpdate(workInProgress);
            }
          }
        }

        bubbleProperties(workInProgress);
        preloadInstanceAndSuspendIfNeeded(workInProgress);
        return null;
      }

    case HostText:
      {
        const newText = newProps;

        if (current && workInProgress.stateNode != null) {
          const oldText = current.memoizedProps;
          updateHostText(current, workInProgress, oldText, newText);
        } else {
          if (typeof newText !== 'string') {
            if (workInProgress.stateNode === null) {
              throw new Error('We must have new props for new mounts. This error is likely ' + 'caused by a bug in React. Please file an issue.');
            }
          }

          const rootContainerInstance = getRootHostContainer();
          const currentHostContext = getHostContext();
          const wasHydrated = popHydrationState(workInProgress);

          if (wasHydrated) {
            prepareToHydrateHostTextInstance(workInProgress);
          } else {
            workInProgress.stateNode = createTextInstance(newText, rootContainerInstance, currentHostContext, workInProgress);
          }
        }

        bubbleProperties(workInProgress);
        return null;
      }

    case SuspenseComponent:
      {
        const nextState = workInProgress.memoizedState;

        if (current === null || current.memoizedState !== null && current.memoizedState.dehydrated !== null) {
          const fallthroughToNormalSuspensePath = completeDehydratedSuspenseBoundary(current, workInProgress, nextState);

          if (!fallthroughToNormalSuspensePath) {
            if (workInProgress.flags & ForceClientRender) {
              popSuspenseHandler(workInProgress);
              return workInProgress;
            } else {
              popSuspenseHandler(workInProgress);
              return null;
            }
          }
        }

        popSuspenseHandler(workInProgress);

        if ((workInProgress.flags & DidCapture) !== NoFlags$1) {
          workInProgress.lanes = renderLanes;

          return workInProgress;
        }

        const nextDidTimeout = nextState !== null;
        const prevDidTimeout = current !== null && current.memoizedState !== null;

        if (nextDidTimeout) {
          const offscreenFiber = workInProgress.child;
          let previousCache = null;

          if (offscreenFiber.alternate !== null && offscreenFiber.alternate.memoizedState !== null && offscreenFiber.alternate.memoizedState.cachePool !== null) {
            previousCache = offscreenFiber.alternate.memoizedState.cachePool.pool;
          }

          let cache = null;

          if (offscreenFiber.memoizedState !== null && offscreenFiber.memoizedState.cachePool !== null) {
            cache = offscreenFiber.memoizedState.cachePool.pool;
          }

          if (cache !== previousCache) {
            offscreenFiber.flags |= Passive$1;
          }
        }

        if (nextDidTimeout !== prevDidTimeout) {

          if (nextDidTimeout) {
            const offscreenFiber = workInProgress.child;
            offscreenFiber.flags |= Visibility;
          }
        }

        const retryQueue = workInProgress.updateQueue;
        scheduleRetryEffect(workInProgress, retryQueue);

        bubbleProperties(workInProgress);

        return null;
      }

    case HostPortal:
      popHostContainer(workInProgress);

      if (current === null) {
        preparePortalMount(workInProgress.stateNode.containerInfo);
      }

      bubbleProperties(workInProgress);
      return null;

    case ContextProvider:
      let context;

      {
        context = workInProgress.type;
      }

      popProvider(context, workInProgress);
      bubbleProperties(workInProgress);
      return null;

    case IncompleteClassComponent:
      {
        {
          break;
        }
      }

    case SuspenseListComponent:
      {
        popSuspenseListContext(workInProgress);
        const renderState = workInProgress.memoizedState;

        if (renderState === null) {
          bubbleProperties(workInProgress);
          return null;
        }

        let didSuspendAlready = (workInProgress.flags & DidCapture) !== NoFlags$1;
        const renderedTail = renderState.rendering;

        if (renderedTail === null) {
          if (!didSuspendAlready) {
            const cannotBeSuspended = renderHasNotSuspendedYet() && (current === null || (current.flags & DidCapture) === NoFlags$1);

            if (!cannotBeSuspended) {
              let row = workInProgress.child;

              while (row !== null) {
                const suspended = findFirstSuspended(row);

                if (suspended !== null) {
                  didSuspendAlready = true;
                  workInProgress.flags |= DidCapture;
                  cutOffTailIfNeeded(renderState, false);
                  const retryQueue = suspended.updateQueue;
                  workInProgress.updateQueue = retryQueue;
                  scheduleRetryEffect(workInProgress, retryQueue);
                  workInProgress.subtreeFlags = NoFlags$1;
                  resetChildFibers(workInProgress, renderLanes);
                  pushSuspenseListContext(workInProgress, setShallowSuspenseListContext(suspenseStackCursor.current, ForceSuspenseFallback));
                  return workInProgress.child;
                }

                row = row.sibling;
              }
            }

            if (renderState.tail !== null && now() > getRenderTargetTime()) {
              workInProgress.flags |= DidCapture;
              didSuspendAlready = true;
              cutOffTailIfNeeded(renderState, false);
              workInProgress.lanes = SomeRetryLane;
            }
          } else {
            cutOffTailIfNeeded(renderState, false);
          }
        } else {
          if (!didSuspendAlready) {
            const suspended = findFirstSuspended(renderedTail);

            if (suspended !== null) {
              workInProgress.flags |= DidCapture;
              didSuspendAlready = true;
              const retryQueue = suspended.updateQueue;
              workInProgress.updateQueue = retryQueue;
              scheduleRetryEffect(workInProgress, retryQueue);
              cutOffTailIfNeeded(renderState, true);

              if (renderState.tail === null && renderState.tailMode === 'hidden' && !renderedTail.alternate && !getIsHydrating()) {
                bubbleProperties(workInProgress);
                return null;
              }
            } else if (now() * 2 - renderState.renderingStartTime > getRenderTargetTime() && renderLanes !== OffscreenLane) {
              workInProgress.flags |= DidCapture;
              didSuspendAlready = true;
              cutOffTailIfNeeded(renderState, false);
              workInProgress.lanes = SomeRetryLane;
            }
          }

          if (renderState.isBackwards) {
            renderedTail.sibling = workInProgress.child;
            workInProgress.child = renderedTail;
          } else {
            const previousSibling = renderState.last;

            if (previousSibling !== null) {
              previousSibling.sibling = renderedTail;
            } else {
              workInProgress.child = renderedTail;
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
            suspenseContext = setShallowSuspenseListContext(suspenseContext, ForceSuspenseFallback);
          } else {
            suspenseContext = setDefaultShallowSuspenseListContext(suspenseContext);
          }

          pushSuspenseListContext(workInProgress, suspenseContext);
          return next;
        }

        bubbleProperties(workInProgress);
        return null;
      }

    case ScopeComponent:
      {

        break;
      }

    case OffscreenComponent:
    case LegacyHiddenComponent:
      {
        popSuspenseHandler(workInProgress);
        popHiddenContext(workInProgress);
        const nextState = workInProgress.memoizedState;
        const nextIsHidden = nextState !== null;

        {
          if (current !== null) {
            const prevState = current.memoizedState;
            const prevIsHidden = prevState !== null;

            if (prevIsHidden !== nextIsHidden) {
              workInProgress.flags |= Visibility;
            }
          } else {
            if (nextIsHidden) {
              workInProgress.flags |= Visibility;
            }
          }
        }

        if (!nextIsHidden || !disableLegacyMode ) {
          bubbleProperties(workInProgress);
        } else {
          if (includesSomeLane(renderLanes, OffscreenLane) && (workInProgress.flags & DidCapture) === NoLanes) {
            bubbleProperties(workInProgress);

            if (workInProgress.subtreeFlags & (Placement | Update)) {
              workInProgress.flags |= Visibility;
            }
          }
        }

        const offscreenQueue = workInProgress.updateQueue;

        if (offscreenQueue !== null) {
          const retryQueue = offscreenQueue.retryQueue;
          scheduleRetryEffect(workInProgress, retryQueue);
        }

        {
          let previousCache = null;

          if (current !== null && current.memoizedState !== null && current.memoizedState.cachePool !== null) {
            previousCache = current.memoizedState.cachePool.pool;
          }

          let cache = null;

          if (workInProgress.memoizedState !== null && workInProgress.memoizedState.cachePool !== null) {
            cache = workInProgress.memoizedState.cachePool.pool;
          }

          if (cache !== previousCache) {
            workInProgress.flags |= Passive$1;
          }
        }

        popTransition(workInProgress, current);
        return null;
      }

    case CacheComponent:
      {
        {
          let previousCache = null;

          if (current !== null) {
            previousCache = current.memoizedState.cache;
          }

          const cache = workInProgress.memoizedState.cache;

          if (cache !== previousCache) {
            workInProgress.flags |= Passive$1;
          }

          popCacheProvider(workInProgress);
          bubbleProperties(workInProgress);
        }

        return null;
      }

    case TracingMarkerComponent:
      {

        return null;
      }
  }

  throw new Error(`Unknown unit of work tag (${workInProgress.tag}). This error is likely caused by a bug in ` + 'React. Please file an issue.');
}

function unwindWork(current, workInProgress, renderLanes) {
  popTreeContext(workInProgress);

  switch (workInProgress.tag) {
    case ClassComponent:
      {

        const flags = workInProgress.flags;

        if (flags & ShouldCapture) {
          workInProgress.flags = flags & ~ShouldCapture | DidCapture;

          return workInProgress;
        }

        return null;
      }

    case HostRoot:
      {

        {
          popCacheProvider(workInProgress);
        }
        popHostContainer(workInProgress);
        const flags = workInProgress.flags;

        if ((flags & ShouldCapture) !== NoFlags$1 && (flags & DidCapture) === NoFlags$1) {
          workInProgress.flags = flags & ~ShouldCapture | DidCapture;
          return workInProgress;
        }

        return null;
      }

    case HostHoistable:
    case HostSingleton:
    case HostComponent:
      {
        popHostContext(workInProgress);
        return null;
      }

    case SuspenseComponent:
      {
        popSuspenseHandler(workInProgress);
        const suspenseState = workInProgress.memoizedState;

        if (suspenseState !== null && suspenseState.dehydrated !== null) {
          if (workInProgress.alternate === null) {
            throw new Error('Threw in newly mounted dehydrated component. This is likely a bug in ' + 'React. Please file an issue.');
          }

          resetHydrationState();
        }

        const flags = workInProgress.flags;

        if (flags & ShouldCapture) {
          workInProgress.flags = flags & ~ShouldCapture | DidCapture;

          return workInProgress;
        }

        return null;
      }

    case SuspenseListComponent:
      {
        popSuspenseListContext(workInProgress);
        return null;
      }

    case HostPortal:
      popHostContainer(workInProgress);
      return null;

    case ContextProvider:
      let context;

      {
        context = workInProgress.type;
      }

      popProvider(context, workInProgress);
      return null;

    case OffscreenComponent:
    case LegacyHiddenComponent:
      {
        popSuspenseHandler(workInProgress);
        popHiddenContext(workInProgress);
        popTransition(workInProgress, current);
        const flags = workInProgress.flags;

        if (flags & ShouldCapture) {
          workInProgress.flags = flags & ~ShouldCapture | DidCapture;

          return workInProgress;
        }

        return null;
      }

    case CacheComponent:
      {
        popCacheProvider(workInProgress);
      }

      return null;

    case TracingMarkerComponent:

      return null;

    default:
      return null;
  }
}

function unwindInterruptedWork(current, interruptedWork, renderLanes) {
  popTreeContext(interruptedWork);

  switch (interruptedWork.tag) {
    case ClassComponent:
      {

        break;
      }

    case HostRoot:
      {

        {
          popCacheProvider(interruptedWork);
        }
        popHostContainer(interruptedWork);
        break;
      }

    case HostHoistable:
    case HostSingleton:
    case HostComponent:
      {
        popHostContext(interruptedWork);
        break;
      }

    case HostPortal:
      popHostContainer(interruptedWork);
      break;

    case SuspenseComponent:
      popSuspenseHandler(interruptedWork);
      break;

    case SuspenseListComponent:
      popSuspenseListContext(interruptedWork);
      break;

    case ContextProvider:
      let context;

      {
        context = interruptedWork.type;
      }

      popProvider(context, interruptedWork);
      break;

    case OffscreenComponent:
    case LegacyHiddenComponent:
      popSuspenseHandler(interruptedWork);
      popHiddenContext(interruptedWork);
      popTransition(interruptedWork, current);
      break;

    case CacheComponent:
      {
        popCacheProvider(interruptedWork);
      }

      break;
  }
}

function getCacheForType(resourceType) {

  const cache = readContext(CacheContext);
  let cacheForType = cache.data.get(resourceType);

  if (cacheForType === undefined) {
    cacheForType = resourceType();
    cache.data.set(resourceType, cacheForType);
  }

  return cacheForType;
}

const DefaultAsyncDispatcher = {
  getCacheForType
};

{
  DefaultAsyncDispatcher.getOwner = () => {
    return current;
  };
}

const commitHooks = [];
function onCommitRoot() {
  {
    commitHooks.forEach(commitHook => commitHook());
  }
}

function isConcurrentActEnvironment() {
  {
    const isReactActEnvironmentGlobal = typeof IS_REACT_ACT_ENVIRONMENT !== 'undefined' ? IS_REACT_ACT_ENVIRONMENT : undefined;

    if (!isReactActEnvironmentGlobal && ReactSharedInternals.actQueue !== null) {
      console.error('The current testing environment is not configured to support ' + 'act(...)');
    }

    return isReactActEnvironmentGlobal;
  }
}

const PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
const NoContext = 0b000;
const RenderContext = 0b010;
const CommitContext = 0b100;
const RootInProgress = 0;
const RootFatalErrored = 1;
const RootErrored = 2;
const RootSuspended = 3;
const RootSuspendedWithDelay = 4;
const RootCompleted = 5;
const RootDidNotComplete = 6;
let executionContext = NoContext;
let workInProgressRoot = null;
let workInProgress = null;
let workInProgressRootRenderLanes = NoLanes;
const NotSuspended = 0;
const SuspendedOnError = 1;
const SuspendedOnData = 2;
const SuspendedOnImmediate = 3;
const SuspendedOnInstance = 4;
const SuspendedOnInstanceAndReadyToContinue = 5;
const SuspendedOnDeprecatedThrowPromise = 6;
const SuspendedAndReadyToContinue = 7;
const SuspendedOnHydration = 8;
let workInProgressSuspendedReason = NotSuspended;
let workInProgressThrownValue = null;
let workInProgressRootDidSkipSuspendedSiblings = false;
let workInProgressRootIsPrerendering = false;
let workInProgressRootDidAttachPingListener = false;
let entangledRenderLanes = NoLanes;
let workInProgressRootExitStatus = RootInProgress;
let workInProgressRootSkippedLanes = NoLanes;
let workInProgressRootInterleavedUpdatedLanes = NoLanes;
let workInProgressRootPingedLanes = NoLanes;
let workInProgressDeferredLane = NoLane;
let workInProgressSuspendedRetryLanes = NoLanes;
let workInProgressRootConcurrentErrors = null;
let workInProgressRootRecoverableErrors = null;
let workInProgressRootDidIncludeRecursiveRenderUpdate = false;
let globalMostRecentFallbackTime = 0;
const FALLBACK_THROTTLE_MS = 300;
let workInProgressRootRenderTargetTime = Infinity;
const RENDER_TIMEOUT_MS = 500;
let workInProgressTransitions = null;

function resetRenderTimer() {
  workInProgressRootRenderTargetTime = now() + RENDER_TIMEOUT_MS;
}

function getRenderTargetTime() {
  return workInProgressRootRenderTargetTime;
}
let legacyErrorBoundariesThatAlreadyFailed = null;
let rootDoesHavePassiveEffects = false;
let rootWithPendingPassiveEffects = null;
let pendingPassiveEffectsLanes = NoLanes;
let pendingPassiveEffectsRemainingLanes = NoLanes;
let pendingPassiveTransitions = null;
const NESTED_UPDATE_LIMIT = 50;
let nestedUpdateCount = 0;
let rootWithNestedUpdates = null;
let isFlushingPassiveEffects = false;
let didScheduleUpdateDuringPassiveEffects = false;
const NESTED_PASSIVE_UPDATE_LIMIT = 50;
let nestedPassiveUpdateCount = 0;
let rootWithPassiveNestedUpdates = null;
let isRunningInsertionEffect = false;
function getWorkInProgressRoot() {
  return workInProgressRoot;
}
function getWorkInProgressRootRenderLanes() {
  return workInProgressRootRenderLanes;
}
function isWorkLoopSuspendedOnData() {
  return workInProgressSuspendedReason === SuspendedOnData;
}
function requestUpdateLane(fiber) {

  if ((executionContext & RenderContext) !== NoContext && workInProgressRootRenderLanes !== NoLanes) {
    return pickArbitraryLane(workInProgressRootRenderLanes);
  }

  const transition = requestCurrentTransition();

  if (transition !== null) {
    {
      if (!transition._updatedFibers) {
        transition._updatedFibers = new Set();
      }

      transition._updatedFibers.add(fiber);
    }

    const actionScopeLane = peekEntangledActionLane();
    return actionScopeLane !== NoLane ? actionScopeLane : requestTransitionLane();
  }

  return eventPriorityToLane(resolveUpdatePriority());
}

function requestRetryLane(fiber) {

  return claimNextRetryLane();
}

function requestDeferredLane() {
  if (workInProgressDeferredLane === NoLane) {
    const isPrerendering = includesSomeLane(workInProgressRootRenderLanes, OffscreenLane) && !getIsHydrating();

    if (isPrerendering) {
      workInProgressDeferredLane = OffscreenLane;
    } else {
      workInProgressDeferredLane = claimNextTransitionLane();
    }
  }

  const suspenseHandler = getSuspenseHandler();

  if (suspenseHandler !== null) {
    suspenseHandler.flags |= DidDefer;
  }

  return workInProgressDeferredLane;
}
function peekDeferredLane() {
  return workInProgressDeferredLane;
}
function scheduleUpdateOnFiber(root, fiber, lane) {
  {
    if (isRunningInsertionEffect) {
      console.error('useInsertionEffect must not schedule updates.');
    }
  }

  {
    if (isFlushingPassiveEffects) {
      didScheduleUpdateDuringPassiveEffects = true;
    }
  }

  if (root === workInProgressRoot && workInProgressSuspendedReason === SuspendedOnData || root.cancelPendingCommit !== null) {
    prepareFreshStack(root, NoLanes);
    const didAttemptEntireTree = false;
    markRootSuspended(root, workInProgressRootRenderLanes, workInProgressDeferredLane, didAttemptEntireTree);
  }

  markRootUpdated(root, lane);

  if ((executionContext & RenderContext) !== NoLanes && root === workInProgressRoot) {
    warnAboutRenderPhaseUpdatesInDEV(fiber);
  } else {

    warnIfUpdatesNotWrappedWithActDEV(fiber);

    if (root === workInProgressRoot) {
      if ((executionContext & RenderContext) === NoContext) {
        workInProgressRootInterleavedUpdatedLanes = mergeLanes(workInProgressRootInterleavedUpdatedLanes, lane);
      }

      if (workInProgressRootExitStatus === RootSuspendedWithDelay) {
        const didAttemptEntireTree = false;
        markRootSuspended(root, workInProgressRootRenderLanes, workInProgressDeferredLane, didAttemptEntireTree);
      }
    }

    ensureRootIsScheduled(root);

    if (lane === SyncLane && executionContext === NoContext && !disableLegacyMode && (fiber.mode & ConcurrentMode) === NoMode) {
      if (ReactSharedInternals.isBatchingLegacy) ; else {
        resetRenderTimer();
      }
    }
  }
}
function scheduleInitialHydrationOnRoot(root, lane) {
  const current = root.current;
  current.lanes = lane;
  markRootUpdated(root, lane);
  ensureRootIsScheduled(root);
}
function isUnsafeClassRenderPhaseUpdate(fiber) {
  return (executionContext & RenderContext) !== NoContext;
}
function performWorkOnRoot(root, lanes, forceSync) {
  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
    throw new Error('Should not already be working.');
  }

  const shouldTimeSlice = !forceSync && !includesBlockingLane(lanes) && !includesExpiredLane(root, lanes) || checkIfRootIsPrerendering(root, lanes);
  let exitStatus = shouldTimeSlice ? renderRootConcurrent(root, lanes) : renderRootSync(root, lanes, true);
  let renderWasConcurrent = shouldTimeSlice;

  do {
    if (exitStatus === RootInProgress) {
      if (workInProgressRootIsPrerendering && !shouldTimeSlice) {
        const didAttemptEntireTree = false;
        markRootSuspended(root, lanes, NoLane, didAttemptEntireTree);
      }

      break;
    } else if (exitStatus === RootDidNotComplete) {
      const didAttemptEntireTree = !workInProgressRootDidSkipSuspendedSiblings;
      markRootSuspended(root, lanes, NoLane, didAttemptEntireTree);
    } else {
      const finishedWork = root.current.alternate;

      if (renderWasConcurrent && !isRenderConsistentWithExternalStores(finishedWork)) {
        exitStatus = renderRootSync(root, lanes, false);
        renderWasConcurrent = false;
        continue;
      }

      if (exitStatus === RootErrored) {
        const lanesThatJustErrored = lanes;
        const errorRetryLanes = getLanesToRetrySynchronouslyOnError(root, lanesThatJustErrored);

        if (errorRetryLanes !== NoLanes) {
          lanes = errorRetryLanes;
          exitStatus = recoverFromConcurrentError(root, lanesThatJustErrored, errorRetryLanes);
          renderWasConcurrent = false;

          if (exitStatus !== RootErrored) {
            continue;
          }
        }
      }

      if (exitStatus === RootFatalErrored) {
        prepareFreshStack(root, NoLanes);
        const didAttemptEntireTree = true;
        markRootSuspended(root, lanes, NoLane, didAttemptEntireTree);
        break;
      }

      finishConcurrentRender(root, exitStatus, finishedWork, lanes);
    }

    break;
  } while (true);

  ensureRootIsScheduled(root);
}

function recoverFromConcurrentError(root, originallyAttemptedLanes, errorRetryLanes) {
  const errorsFromFirstAttempt = workInProgressRootConcurrentErrors;
  const wasRootDehydrated = isRootDehydrated(root);

  if (wasRootDehydrated) {
    const rootWorkInProgress = prepareFreshStack(root, errorRetryLanes);
    rootWorkInProgress.flags |= ForceClientRender;
  }

  const exitStatus = renderRootSync(root, errorRetryLanes, false);

  if (exitStatus !== RootErrored) {
    if (workInProgressRootDidAttachPingListener && !wasRootDehydrated) {
      root.errorRecoveryDisabledLanes = mergeLanes(root.errorRecoveryDisabledLanes, originallyAttemptedLanes);
      workInProgressRootInterleavedUpdatedLanes |= originallyAttemptedLanes;
      return RootSuspendedWithDelay;
    }

    const errorsFromSecondAttempt = workInProgressRootRecoverableErrors;
    workInProgressRootRecoverableErrors = errorsFromFirstAttempt;

    if (errorsFromSecondAttempt !== null) {
      queueRecoverableErrors(errorsFromSecondAttempt);
    }
  }

  return exitStatus;
}

function queueRecoverableErrors(errors) {
  if (workInProgressRootRecoverableErrors === null) {
    workInProgressRootRecoverableErrors = errors;
  } else {
    workInProgressRootRecoverableErrors.push.apply(workInProgressRootRecoverableErrors, errors);
  }
}

function finishConcurrentRender(root, exitStatus, finishedWork, lanes) {
  let renderEndTime = 0;

  switch (exitStatus) {
    case RootInProgress:
    case RootFatalErrored:
      {
        throw new Error('Root did not complete. This is a bug in React.');
      }

    case RootSuspendedWithDelay:
      {
        if (includesOnlyTransitions(lanes)) {
          const didAttemptEntireTree = !workInProgressRootDidSkipSuspendedSiblings;
          markRootSuspended(root, lanes, workInProgressDeferredLane, didAttemptEntireTree);
          return;
        }

        break;
      }

    case RootErrored:
      {
        workInProgressRootRecoverableErrors = null;
        break;
      }

    case RootSuspended:
    case RootCompleted:
      {
        break;
      }

    default:
      {
        throw new Error('Unknown root exit status.');
      }
  }

  root.finishedWork = finishedWork;
  root.finishedLanes = lanes;

  if (shouldForceFlushFallbacksInDEV()) {
    commitRoot(root, workInProgressRootRecoverableErrors, workInProgressTransitions, workInProgressRootDidIncludeRecursiveRenderUpdate, workInProgressDeferredLane, workInProgressRootInterleavedUpdatedLanes, workInProgressSuspendedRetryLanes, IMMEDIATE_COMMIT, renderStartTime, renderEndTime);
  } else {
    if (includesOnlyRetries(lanes) && (alwaysThrottleRetries )) {
      const msUntilTimeout = globalMostRecentFallbackTime + FALLBACK_THROTTLE_MS - now();

      if (msUntilTimeout > 10) {
        const didAttemptEntireTree = !workInProgressRootDidSkipSuspendedSiblings;
        markRootSuspended(root, lanes, workInProgressDeferredLane, didAttemptEntireTree);
        const nextLanes = getNextLanes(root, NoLanes);

        if (nextLanes !== NoLanes) {
          return;
        }

        root.timeoutHandle = scheduleTimeout(commitRootWhenReady.bind(null, root, finishedWork, workInProgressRootRecoverableErrors, workInProgressTransitions, workInProgressRootDidIncludeRecursiveRenderUpdate, lanes, workInProgressDeferredLane, workInProgressRootInterleavedUpdatedLanes, workInProgressSuspendedRetryLanes, workInProgressRootDidSkipSuspendedSiblings, THROTTLED_COMMIT, renderStartTime, renderEndTime), msUntilTimeout);
        return;
      }
    }

    commitRootWhenReady(root, finishedWork, workInProgressRootRecoverableErrors, workInProgressTransitions, workInProgressRootDidIncludeRecursiveRenderUpdate, lanes, workInProgressDeferredLane, workInProgressRootInterleavedUpdatedLanes, workInProgressSuspendedRetryLanes, workInProgressRootDidSkipSuspendedSiblings, IMMEDIATE_COMMIT, renderStartTime, renderEndTime);
  }
}

function commitRootWhenReady(root, finishedWork, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, lanes, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime) {
  const BothVisibilityAndMaySuspendCommit = Visibility | MaySuspendCommit;
  const subtreeFlags = finishedWork.subtreeFlags;

  if (subtreeFlags & ShouldSuspendCommit || (subtreeFlags & BothVisibilityAndMaySuspendCommit) === BothVisibilityAndMaySuspendCommit) {
    startSuspendingCommit();
    accumulateSuspenseyCommit(finishedWork);
    const schedulePendingCommit = waitForCommitToBeReady();

    if (schedulePendingCommit !== null) {
      root.cancelPendingCommit = schedulePendingCommit(commitRoot.bind(null, root, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes, SUSPENDED_COMMIT, completedRenderStartTime, completedRenderEndTime));
      const didAttemptEntireTree = !didSkipSuspendedSiblings;
      markRootSuspended(root, lanes, spawnedLane, didAttemptEntireTree);
      return;
    }
  }

  commitRoot(root, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime);
}

function isRenderConsistentWithExternalStores(finishedWork) {
  let node = finishedWork;

  while (true) {
    const tag = node.tag;

    if ((tag === FunctionComponent || tag === ForwardRef || tag === SimpleMemoComponent) && node.flags & StoreConsistency) {
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

function markRootUpdated(root, updatedLanes) {
  markRootUpdated$1(root, updatedLanes);
}

function markRootPinged(root, pingedLanes) {
  markRootPinged$1(root, pingedLanes);
}

function markRootSuspended(root, suspendedLanes, spawnedLane, didAttemptEntireTree) {
  suspendedLanes = removeLanes(suspendedLanes, workInProgressRootPingedLanes);
  suspendedLanes = removeLanes(suspendedLanes, workInProgressRootInterleavedUpdatedLanes);

  markRootSuspended$1(root, suspendedLanes, spawnedLane, didAttemptEntireTree);
}

function flushRoot(root, lanes) {
  if (lanes !== NoLanes) {
    upgradePendingLanesToSync(root, lanes);
    ensureRootIsScheduled(root);

    if ((executionContext & (RenderContext | CommitContext)) === NoContext) {
      resetRenderTimer();
      flushSyncWorkOnAllRoots();
    }
  }
}
function getExecutionContext() {
  return executionContext;
}
function batchedUpdates(fn, a) {
  {
    return fn(a);
  }
}
function flushSyncWork$1() {
  if ((executionContext & (RenderContext | CommitContext)) === NoContext) {
    flushSyncWorkOnAllRoots();
    return false;
  }

  return true;
}
function isAlreadyRendering() {
  return (executionContext & (RenderContext | CommitContext)) !== NoContext;
}
function setEntangledRenderLanes(newEntangledRenderLanes) {
  entangledRenderLanes = newEntangledRenderLanes;
}
function getEntangledRenderLanes() {
  return entangledRenderLanes;
}

function resetWorkInProgressStack() {
  if (workInProgress === null) return;
  let interruptedWork;

  if (workInProgressSuspendedReason === NotSuspended) {
    interruptedWork = workInProgress.return;
  } else {
    resetSuspendedWorkLoopOnUnwind(workInProgress);
    interruptedWork = workInProgress;
  }

  while (interruptedWork !== null) {
    const current = interruptedWork.alternate;
    unwindInterruptedWork(current, interruptedWork);
    interruptedWork = interruptedWork.return;
  }

  workInProgress = null;
}

function prepareFreshStack(root, lanes) {

  root.finishedWork = null;
  root.finishedLanes = NoLanes;
  const timeoutHandle = root.timeoutHandle;

  if (timeoutHandle !== noTimeout) {
    root.timeoutHandle = noTimeout;
    cancelTimeout(timeoutHandle);
  }

  const cancelPendingCommit = root.cancelPendingCommit;

  if (cancelPendingCommit !== null) {
    root.cancelPendingCommit = null;
    cancelPendingCommit();
  }

  resetWorkInProgressStack();
  workInProgressRoot = root;
  const rootWorkInProgress = createWorkInProgress(root.current, null);
  workInProgress = rootWorkInProgress;
  workInProgressRootRenderLanes = lanes;
  workInProgressSuspendedReason = NotSuspended;
  workInProgressThrownValue = null;
  workInProgressRootDidSkipSuspendedSiblings = false;
  workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root, lanes);
  workInProgressRootDidAttachPingListener = false;
  workInProgressRootExitStatus = RootInProgress;
  workInProgressRootSkippedLanes = NoLanes;
  workInProgressRootInterleavedUpdatedLanes = NoLanes;
  workInProgressRootPingedLanes = NoLanes;
  workInProgressDeferredLane = NoLane;
  workInProgressSuspendedRetryLanes = NoLanes;
  workInProgressRootConcurrentErrors = null;
  workInProgressRootRecoverableErrors = null;
  workInProgressRootDidIncludeRecursiveRenderUpdate = false;
  entangledRenderLanes = getEntangledLanes(root, lanes);
  finishQueueingConcurrentUpdates();

  {
    ReactStrictModeWarnings.discardPendingWarnings();
  }

  return rootWorkInProgress;
}

function resetSuspendedWorkLoopOnUnwind(fiber) {
  resetContextDependencies();
  resetHooksOnUnwind(fiber);
  resetChildReconcilerOnUnwind();
}

function handleThrow(root, thrownValue) {
  resetHooksAfterThrow();

  {
    resetCurrentFiber();
  }

  if (thrownValue === SuspenseException) {
    thrownValue = getSuspendedThenable();
    workInProgressSuspendedReason = SuspendedOnImmediate;
  } else if (thrownValue === SuspenseyCommitException) {
    thrownValue = getSuspendedThenable();
    workInProgressSuspendedReason = SuspendedOnInstance;
  } else if (thrownValue === SelectiveHydrationException) {
    workInProgressSuspendedReason = SuspendedOnHydration;
  } else {
    const isWakeable = thrownValue !== null && typeof thrownValue === 'object' && typeof thrownValue.then === 'function';
    workInProgressSuspendedReason = isWakeable ? SuspendedOnDeprecatedThrowPromise : SuspendedOnError;
  }

  workInProgressThrownValue = thrownValue;
  const erroredWork = workInProgress;

  if (erroredWork === null) {
    workInProgressRootExitStatus = RootFatalErrored;
    logUncaughtError(root, createCapturedValueAtFiber(thrownValue, root.current));
    return;
  }
}

function shouldRemainOnPreviousScreen() {
  const handler = getSuspenseHandler();

  if (handler === null) {
    return true;
  }

  if (includesOnlyTransitions(workInProgressRootRenderLanes)) {
    if (getShellBoundary() === null) {
      return true;
    } else {
      return false;
    }
  }

  if (includesOnlyRetries(workInProgressRootRenderLanes) || includesSomeLane(workInProgressRootRenderLanes, OffscreenLane)) {
    return handler === getShellBoundary();
  }

  return false;
}

function pushDispatcher(container) {
  const prevDispatcher = ReactSharedInternals.H;
  ReactSharedInternals.H = ContextOnlyDispatcher;

  if (prevDispatcher === null) {
    return ContextOnlyDispatcher;
  } else {
    return prevDispatcher;
  }
}

function popDispatcher(prevDispatcher) {
  ReactSharedInternals.H = prevDispatcher;
}

function pushAsyncDispatcher() {
  {
    const prevAsyncDispatcher = ReactSharedInternals.A;
    ReactSharedInternals.A = DefaultAsyncDispatcher;
    return prevAsyncDispatcher;
  }
}

function popAsyncDispatcher(prevAsyncDispatcher) {
  {
    ReactSharedInternals.A = prevAsyncDispatcher;
  }
}

function markCommitTimeOfFallback() {
  globalMostRecentFallbackTime = now();
}
function markSkippedUpdateLanes(lane) {
  workInProgressRootSkippedLanes = mergeLanes(lane, workInProgressRootSkippedLanes);
}
function renderDidSuspend() {
  if (workInProgressRootExitStatus === RootInProgress) {
    workInProgressRootExitStatus = RootSuspended;
  }
}
function renderDidSuspendDelayIfPossible() {
  workInProgressRootExitStatus = RootSuspendedWithDelay;

  if (!workInProgressRootDidSkipSuspendedSiblings && (includesOnlyTransitions(workInProgressRootRenderLanes) || getSuspenseHandler() === null)) {
    workInProgressRootIsPrerendering = true;
  }

  if ((includesNonIdleWork(workInProgressRootSkippedLanes) || includesNonIdleWork(workInProgressRootInterleavedUpdatedLanes)) && workInProgressRoot !== null) {
    const didAttemptEntireTree = false;
    markRootSuspended(workInProgressRoot, workInProgressRootRenderLanes, workInProgressDeferredLane, didAttemptEntireTree);
  }
}
function renderDidError() {
  if (workInProgressRootExitStatus !== RootSuspendedWithDelay) {
    workInProgressRootExitStatus = RootErrored;
  }
}
function queueConcurrentError(error) {
  if (workInProgressRootConcurrentErrors === null) {
    workInProgressRootConcurrentErrors = [error];
  } else {
    workInProgressRootConcurrentErrors.push(error);
  }
}
function renderHasNotSuspendedYet() {
  return workInProgressRootExitStatus === RootInProgress;
}

function renderRootSync(root, lanes, shouldYieldForPrerendering) {
  const prevExecutionContext = executionContext;
  executionContext |= RenderContext;
  const prevDispatcher = pushDispatcher();
  const prevAsyncDispatcher = pushAsyncDispatcher();

  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {

    workInProgressTransitions = getTransitionsForLanes();
    prepareFreshStack(root, lanes);
  }

  let didSuspendInShell = false;
  let exitStatus = workInProgressRootExitStatus;

  outer: do {
    try {
      if (workInProgressSuspendedReason !== NotSuspended && workInProgress !== null) {
        const unitOfWork = workInProgress;
        const thrownValue = workInProgressThrownValue;

        switch (workInProgressSuspendedReason) {
          case SuspendedOnHydration:
            {
              resetWorkInProgressStack();
              exitStatus = RootDidNotComplete;
              break outer;
            }

          case SuspendedOnImmediate:
          case SuspendedOnData:
          case SuspendedOnDeprecatedThrowPromise:
            {
              if (getSuspenseHandler() === null) {
                didSuspendInShell = true;
              }

              const reason = workInProgressSuspendedReason;
              workInProgressSuspendedReason = NotSuspended;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, reason);

              if (enableSiblingPrerendering && shouldYieldForPrerendering && workInProgressRootIsPrerendering) {
                exitStatus = RootInProgress;
                break outer;
              }

              break;
            }

          default:
            {
              const reason = workInProgressSuspendedReason;
              workInProgressSuspendedReason = NotSuspended;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, reason);
              break;
            }
        }
      }

      workLoopSync();
      exitStatus = workInProgressRootExitStatus;
      break;
    } catch (thrownValue) {
      handleThrow(root, thrownValue);
    }
  } while (true);

  if (didSuspendInShell) {
    root.shellSuspendCounter++;
  }

  resetContextDependencies();
  executionContext = prevExecutionContext;
  popDispatcher(prevDispatcher);
  popAsyncDispatcher(prevAsyncDispatcher);

  if (workInProgress !== null) ; else {
    workInProgressRoot = null;
    workInProgressRootRenderLanes = NoLanes;
    finishQueueingConcurrentUpdates();
  }

  return exitStatus;
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function renderRootConcurrent(root, lanes) {
  const prevExecutionContext = executionContext;
  executionContext |= RenderContext;
  const prevDispatcher = pushDispatcher();
  const prevAsyncDispatcher = pushAsyncDispatcher();

  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {

    workInProgressTransitions = getTransitionsForLanes();
    resetRenderTimer();
    prepareFreshStack(root, lanes);
  } else {
    workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root, lanes);
  }

  outer: do {
    try {
      if (workInProgressSuspendedReason !== NotSuspended && workInProgress !== null) {
        const unitOfWork = workInProgress;
        const thrownValue = workInProgressThrownValue;

        resumeOrUnwind: switch (workInProgressSuspendedReason) {
          case SuspendedOnError:
            {
              workInProgressSuspendedReason = NotSuspended;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, SuspendedOnError);
              break;
            }

          case SuspendedOnData:
            {
              const thenable = thrownValue;

              if (isThenableResolved(thenable)) {
                workInProgressSuspendedReason = NotSuspended;
                workInProgressThrownValue = null;
                replaySuspendedUnitOfWork(unitOfWork);
                break;
              }

              const onResolution = () => {
                if (workInProgressSuspendedReason === SuspendedOnData && workInProgressRoot === root) {
                  workInProgressSuspendedReason = SuspendedAndReadyToContinue;
                }

                ensureRootIsScheduled(root);
              };

              thenable.then(onResolution, onResolution);
              break outer;
            }

          case SuspendedOnImmediate:
            {
              workInProgressSuspendedReason = SuspendedAndReadyToContinue;
              break outer;
            }

          case SuspendedOnInstance:
            {
              workInProgressSuspendedReason = SuspendedOnInstanceAndReadyToContinue;
              break outer;
            }

          case SuspendedAndReadyToContinue:
            {
              const thenable = thrownValue;

              if (isThenableResolved(thenable)) {
                workInProgressSuspendedReason = NotSuspended;
                workInProgressThrownValue = null;
                replaySuspendedUnitOfWork(unitOfWork);
              } else {
                workInProgressSuspendedReason = NotSuspended;
                workInProgressThrownValue = null;
                throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, SuspendedAndReadyToContinue);
              }

              break;
            }

          case SuspendedOnInstanceAndReadyToContinue:
            {
              let resource = null;

              switch (workInProgress.tag) {
                case HostHoistable:
                  {
                    resource = workInProgress.memoizedState;
                  }

                case HostComponent:
                case HostSingleton:
                  {
                    const hostFiber = workInProgress;
                    const type = hostFiber.type;
                    const props = hostFiber.pendingProps;
                    const isReady = resource ? preloadResource(resource) : preloadInstance(type, props);

                    if (isReady) {
                      workInProgressSuspendedReason = NotSuspended;
                      workInProgressThrownValue = null;
                      const sibling = hostFiber.sibling;

                      if (sibling !== null) {
                        workInProgress = sibling;
                      } else {
                        const returnFiber = hostFiber.return;

                        if (returnFiber !== null) {
                          workInProgress = returnFiber;
                          completeUnitOfWork(returnFiber);
                        } else {
                          workInProgress = null;
                        }
                      }

                      break resumeOrUnwind;
                    }

                    break;
                  }

                default:
                  {
                    if (true) {
                      console.error('Unexpected type of fiber triggered a suspensey commit. ' + 'This is a bug in React.');
                    }

                    break;
                  }
              }

              workInProgressSuspendedReason = NotSuspended;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, SuspendedOnInstanceAndReadyToContinue);
              break;
            }

          case SuspendedOnDeprecatedThrowPromise:
            {
              workInProgressSuspendedReason = NotSuspended;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, SuspendedOnDeprecatedThrowPromise);
              break;
            }

          case SuspendedOnHydration:
            {
              resetWorkInProgressStack();
              workInProgressRootExitStatus = RootDidNotComplete;
              break outer;
            }

          default:
            {
              throw new Error('Unexpected SuspendedReason. This is a bug in React.');
            }
        }
      }

      if (true && ReactSharedInternals.actQueue !== null) {
        workLoopSync();
      } else {
        workLoopConcurrent();
      }

      break;
    } catch (thrownValue) {
      handleThrow(root, thrownValue);
    }
  } while (true);

  resetContextDependencies();
  popDispatcher(prevDispatcher);
  popAsyncDispatcher(prevAsyncDispatcher);
  executionContext = prevExecutionContext;

  if (workInProgress !== null) {

    return RootInProgress;
  } else {

    workInProgressRoot = null;
    workInProgressRootRenderLanes = NoLanes;
    finishQueueingConcurrentUpdates();
    return workInProgressRootExitStatus;
  }
}

function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;
  let next;

  {
    {
      next = runWithFiberInDEV(unitOfWork, beginWork, current, unitOfWork, entangledRenderLanes);
    }
  }

  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}

function replaySuspendedUnitOfWork(unitOfWork) {
  let next;

  {
    next = runWithFiberInDEV(unitOfWork, replayBeginWork, unitOfWork);
  }

  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}

function replayBeginWork(unitOfWork) {
  const current = unitOfWork.alternate;
  let next;

  switch (unitOfWork.tag) {
    case SimpleMemoComponent:
    case FunctionComponent:
      {
        const Component = unitOfWork.type;
        const unresolvedProps = unitOfWork.pendingProps;
        const resolvedProps = unresolvedProps ;
        let context;

        next = replayFunctionComponent(current, unitOfWork, resolvedProps, Component, context, workInProgressRootRenderLanes);
        break;
      }

    case ForwardRef:
      {
        const Component = unitOfWork.type.render;
        const unresolvedProps = unitOfWork.pendingProps;
        const resolvedProps = unresolvedProps ;
        next = replayFunctionComponent(current, unitOfWork, resolvedProps, Component, unitOfWork.ref, workInProgressRootRenderLanes);
        break;
      }

    case HostComponent:
      {
        resetHooksOnUnwind(unitOfWork);
      }

    default:
      {
        unwindInterruptedWork(current, unitOfWork);
        unitOfWork = workInProgress = resetWorkInProgress(unitOfWork, entangledRenderLanes);
        next = beginWork(current, unitOfWork, entangledRenderLanes);
        break;
      }
  }

  return next;
}

function throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, suspendedReason) {
  resetSuspendedWorkLoopOnUnwind(unitOfWork);
  const returnFiber = unitOfWork.return;

  try {
    const didFatal = throwException(root, returnFiber, unitOfWork, thrownValue, workInProgressRootRenderLanes);

    if (didFatal) {
      panicOnRootError(root, thrownValue);
      return;
    }
  } catch (error) {
    if (returnFiber !== null) {
      workInProgress = returnFiber;
      throw error;
    } else {
      panicOnRootError(root, thrownValue);
      return;
    }
  }

  if (unitOfWork.flags & Incomplete) {
    let skipSiblings;

    {
      if (getIsHydrating() || suspendedReason === SuspendedOnError) {
        skipSiblings = true;
      } else if (!workInProgressRootIsPrerendering && !includesSomeLane(workInProgressRootRenderLanes, OffscreenLane)) {
        skipSiblings = true;
        workInProgressRootDidSkipSuspendedSiblings = true;

        if (suspendedReason === SuspendedOnData || suspendedReason === SuspendedOnImmediate || suspendedReason === SuspendedOnDeprecatedThrowPromise) {
          const boundary = getSuspenseHandler();

          if (boundary !== null && boundary.tag === SuspenseComponent) {
            boundary.flags |= ScheduleRetry;
          }
        }
      } else {
        skipSiblings = false;
      }
    }

    unwindUnitOfWork(unitOfWork, skipSiblings);
  } else {
    completeUnitOfWork(unitOfWork);
  }
}

function markSpawnedRetryLane(lane) {
  workInProgressSuspendedRetryLanes = mergeLanes(workInProgressSuspendedRetryLanes, lane);
}

function panicOnRootError(root, error) {
  workInProgressRootExitStatus = RootFatalErrored;
  logUncaughtError(root, createCapturedValueAtFiber(error, root.current));
  workInProgress = null;
}

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;

  do {
    if ((completedWork.flags & Incomplete) !== NoFlags$1) {
      const skipSiblings = workInProgressRootDidSkipSuspendedSiblings;
      unwindUnitOfWork(completedWork, skipSiblings);
      return;
    }

    const current = completedWork.alternate;
    const returnFiber = completedWork.return;
    let next;

    {
      next = runWithFiberInDEV(completedWork, completeWork, current, completedWork, entangledRenderLanes);
    }

    if (next !== null) {
      workInProgress = next;
      return;
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

function unwindUnitOfWork(unitOfWork, skipSiblings) {
  let incompleteWork = unitOfWork;

  do {
    const current = incompleteWork.alternate;
    const next = unwindWork(current, incompleteWork);

    if (next !== null) {
      next.flags &= HostEffectMask;
      workInProgress = next;
      return;
    }

    const returnFiber = incompleteWork.return;

    if (returnFiber !== null) {
      returnFiber.flags |= Incomplete;
      returnFiber.subtreeFlags = NoFlags$1;
      returnFiber.deletions = null;
    }

    if (!skipSiblings) {
      const siblingFiber = incompleteWork.sibling;

      if (siblingFiber !== null) {
        workInProgress = siblingFiber;
        return;
      }
    }

    incompleteWork = returnFiber;
    workInProgress = incompleteWork;
  } while (incompleteWork !== null);

  workInProgressRootExitStatus = RootDidNotComplete;
  workInProgress = null;
}

const IMMEDIATE_COMMIT = 0;
const SUSPENDED_COMMIT = 1;
const THROTTLED_COMMIT = 2;

function commitRoot(root, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime) {
  const prevTransition = ReactSharedInternals.T;
  const previousUpdateLanePriority = getCurrentUpdatePriority();

  try {
    setCurrentUpdatePriority(DiscreteEventPriority);
    ReactSharedInternals.T = null;
    commitRootImpl(root, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, previousUpdateLanePriority, spawnedLane, updatedLanes, suspendedRetryLanes, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime);
  } finally {
    ReactSharedInternals.T = prevTransition;
    setCurrentUpdatePriority(previousUpdateLanePriority);
  }
}

function commitRootImpl(root, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, renderPriorityLevel, spawnedLane, updatedLanes, suspendedRetryLanes, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime) {
  do {
    flushPassiveEffects();
  } while (rootWithPendingPassiveEffects !== null);

  flushRenderPhaseStrictModeWarningsInDEV();

  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
    throw new Error('Should not already be working.');
  }

  const finishedWork = root.finishedWork;
  const lanes = root.finishedLanes;

  if (finishedWork === null) {

    return null;
  } else {
    {
      if (lanes === NoLanes) {
        console.error('root.finishedLanes should not be empty during a commit. This is a ' + 'bug in React.');
      }
    }
  }

  root.finishedWork = null;
  root.finishedLanes = NoLanes;

  if (finishedWork === root.current) {
    throw new Error('Cannot commit the same tree as before. This error is likely caused by ' + 'a bug in React. Please file an issue.');
  }

  root.callbackNode = null;
  root.callbackPriority = NoLane;
  root.cancelPendingCommit = null;
  let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
  const concurrentlyUpdatedLanes = getConcurrentlyUpdatedLanes();
  remainingLanes = mergeLanes(remainingLanes, concurrentlyUpdatedLanes);
  markRootFinished(root, lanes, remainingLanes, spawnedLane, updatedLanes, suspendedRetryLanes);

  if (root === workInProgressRoot) {
    workInProgressRoot = null;
    workInProgress = null;
    workInProgressRootRenderLanes = NoLanes;
  }

  if ((finishedWork.subtreeFlags & PassiveMask) !== NoFlags$1 || (finishedWork.flags & PassiveMask) !== NoFlags$1) {
    if (!rootDoesHavePassiveEffects) {
      rootDoesHavePassiveEffects = true;
      pendingPassiveEffectsRemainingLanes = remainingLanes;
      pendingPassiveTransitions = transitions;
      scheduleCallback$1(NormalPriority$1, () => {
        flushPassiveEffects(true);
        return null;
      });
    }
  }

  const subtreeHasEffects = (finishedWork.subtreeFlags & (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !== NoFlags$1;
  const rootHasEffect = (finishedWork.flags & (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !== NoFlags$1;

  if (subtreeHasEffects || rootHasEffect) {
    const prevTransition = ReactSharedInternals.T;
    ReactSharedInternals.T = null;
    const previousPriority = getCurrentUpdatePriority();
    setCurrentUpdatePriority(DiscreteEventPriority);
    const prevExecutionContext = executionContext;
    executionContext |= CommitContext;
    commitBeforeMutationEffects(root, finishedWork);
    commitMutationEffects(root, finishedWork);

    resetAfterCommit(root.containerInfo);
    root.current = finishedWork;

    commitLayoutEffects(finishedWork, root);
    executionContext = prevExecutionContext;
    setCurrentUpdatePriority(previousPriority);
    ReactSharedInternals.T = prevTransition;
  } else {
    root.current = finishedWork;
  }

  const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;

  if (rootDoesHavePassiveEffects) {
    rootDoesHavePassiveEffects = false;
    rootWithPendingPassiveEffects = root;
    pendingPassiveEffectsLanes = lanes;
  } else {
    releaseRootPooledCache(root, remainingLanes);

    {
      nestedPassiveUpdateCount = 0;
      rootWithPassiveNestedUpdates = null;
    }
  }

  remainingLanes = root.pendingLanes;

  if (remainingLanes === NoLanes) {
    legacyErrorBoundariesThatAlreadyFailed = null;
  }

  {
    if (!rootDidHavePassiveEffects) {
      commitDoubleInvokeEffectsInDEV(root);
    }
  }

  onCommitRoot$1(finishedWork.stateNode, renderPriorityLevel);

  {
    onCommitRoot();
  }

  ensureRootIsScheduled(root);

  if (recoverableErrors !== null) {
    const onRecoverableError = root.onRecoverableError;

    for (let i = 0; i < recoverableErrors.length; i++) {
      const recoverableError = recoverableErrors[i];
      const errorInfo = makeErrorInfo(recoverableError.stack);

      {
        runWithFiberInDEV(recoverableError.source, onRecoverableError, recoverableError.value, errorInfo);
      }
    }
  }

  if (includesSyncLane(pendingPassiveEffectsLanes) && (disableLegacyMode )) {
    flushPassiveEffects();
  }

  remainingLanes = root.pendingLanes;

  if (includesSomeLane(lanes, UpdateLanes) && includesSomeLane(remainingLanes, SyncUpdateLanes)) {

    if (root === rootWithNestedUpdates) {
      nestedUpdateCount++;
    } else {
      nestedUpdateCount = 0;
      rootWithNestedUpdates = root;
    }
  } else {
    nestedUpdateCount = 0;
  }

  flushSyncWorkOnAllRoots();

  return null;
}

function makeErrorInfo(componentStack) {
  const errorInfo = {
    componentStack
  };

  {
    Object.defineProperty(errorInfo, 'digest', {
      get() {
        console.error('You are accessing "digest" from the errorInfo object passed to onRecoverableError.' + ' This property is no longer provided as part of errorInfo but can be accessed as a property' + ' of the Error instance itself.');
      }

    });
  }

  return errorInfo;
}

function releaseRootPooledCache(root, remainingLanes) {
  {
    const pooledCacheLanes = root.pooledCacheLanes &= remainingLanes;

    if (pooledCacheLanes === NoLanes) {
      const pooledCache = root.pooledCache;

      if (pooledCache != null) {
        root.pooledCache = null;
        releaseCache(pooledCache);
      }
    }
  }
}

function flushPassiveEffects(wasDelayedCommit) {
  if (rootWithPendingPassiveEffects !== null) {
    const root = rootWithPendingPassiveEffects;
    const remainingLanes = pendingPassiveEffectsRemainingLanes;
    pendingPassiveEffectsRemainingLanes = NoLanes;
    const renderPriority = lanesToEventPriority(pendingPassiveEffectsLanes);
    const priority = lowerEventPriority(DefaultEventPriority, renderPriority);
    const prevTransition = ReactSharedInternals.T;
    const previousPriority = getCurrentUpdatePriority();

    try {
      setCurrentUpdatePriority(priority);
      ReactSharedInternals.T = null;
      return flushPassiveEffectsImpl(wasDelayedCommit);
    } finally {
      setCurrentUpdatePriority(previousPriority);
      ReactSharedInternals.T = prevTransition;
      releaseRootPooledCache(root, remainingLanes);
    }
  }

  return false;
}

function flushPassiveEffectsImpl(wasDelayedCommit) {
  if (rootWithPendingPassiveEffects === null) {
    return false;
  }

  const transitions = pendingPassiveTransitions;
  pendingPassiveTransitions = null;
  const root = rootWithPendingPassiveEffects;
  const lanes = pendingPassiveEffectsLanes;
  rootWithPendingPassiveEffects = null;
  pendingPassiveEffectsLanes = NoLanes;

  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
    throw new Error('Cannot flush passive effects while already rendering.');
  }

  {
    isFlushingPassiveEffects = true;
    didScheduleUpdateDuringPassiveEffects = false;
  }

  const prevExecutionContext = executionContext;
  executionContext |= CommitContext;
  commitPassiveUnmountEffects(root.current);
  commitPassiveMountEffects(root, root.current, lanes, transitions);

  {
    commitDoubleInvokeEffectsInDEV(root);
  }

  executionContext = prevExecutionContext;

  flushSyncWorkOnAllRoots();

  {
    if (didScheduleUpdateDuringPassiveEffects) {
      if (root === rootWithPassiveNestedUpdates) {
        nestedPassiveUpdateCount++;
      } else {
        nestedPassiveUpdateCount = 0;
        rootWithPassiveNestedUpdates = root;
      }
    } else {
      nestedPassiveUpdateCount = 0;
    }

    isFlushingPassiveEffects = false;
    didScheduleUpdateDuringPassiveEffects = false;
  }

  onPostCommitRoot(root);

  return true;
}

function isAlreadyFailedLegacyErrorBoundary(instance) {
  return legacyErrorBoundariesThatAlreadyFailed !== null && legacyErrorBoundariesThatAlreadyFailed.has(instance);
}
function markLegacyErrorBoundaryAsFailed(instance) {
  if (legacyErrorBoundariesThatAlreadyFailed === null) {
    legacyErrorBoundariesThatAlreadyFailed = new Set([instance]);
  } else {
    legacyErrorBoundariesThatAlreadyFailed.add(instance);
  }
}

function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
  const errorInfo = createCapturedValueAtFiber(error, sourceFiber);
  const update = createRootErrorUpdate(rootFiber.stateNode, errorInfo, SyncLane);
  const root = enqueueUpdate(rootFiber, update, SyncLane);

  if (root !== null) {
    markRootUpdated(root, SyncLane);
    ensureRootIsScheduled(root);
  }
}

function captureCommitPhaseError(sourceFiber, nearestMountedAncestor, error) {
  {
    setIsRunningInsertionEffect(false);
  }

  if (sourceFiber.tag === HostRoot) {
    captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
    return;
  }

  let fiber = nearestMountedAncestor;

  while (fiber !== null) {
    if (fiber.tag === HostRoot) {
      captureCommitPhaseErrorOnRoot(fiber, sourceFiber, error);
      return;
    } else if (fiber.tag === ClassComponent) {
      const ctor = fiber.type;
      const instance = fiber.stateNode;

      if (typeof ctor.getDerivedStateFromError === 'function' || typeof instance.componentDidCatch === 'function' && !isAlreadyFailedLegacyErrorBoundary(instance)) {
        const errorInfo = createCapturedValueAtFiber(error, sourceFiber);
        const update = createClassErrorUpdate(SyncLane);
        const root = enqueueUpdate(fiber, update, SyncLane);

        if (root !== null) {
          initializeClassErrorUpdate(update, root, fiber, errorInfo);
          markRootUpdated(root, SyncLane);
          ensureRootIsScheduled(root);
        }

        return;
      }
    }

    fiber = fiber.return;
  }

  {
    console.error('Internal React error: Attempted to capture a commit phase error ' + 'inside a detached tree. This indicates a bug in React. Potential ' + 'causes include deleting the same fiber more than once, committing an ' + 'already-finished tree, or an inconsistent return pointer.\n\n' + 'Error message:\n\n%s', error);
  }
}
function attachPingListener(root, wakeable, lanes) {
  let pingCache = root.pingCache;
  let threadIDs;

  if (pingCache === null) {
    pingCache = root.pingCache = new PossiblyWeakMap();
    threadIDs = new Set();
    pingCache.set(wakeable, threadIDs);
  } else {
    threadIDs = pingCache.get(wakeable);

    if (threadIDs === undefined) {
      threadIDs = new Set();
      pingCache.set(wakeable, threadIDs);
    }
  }

  if (!threadIDs.has(lanes)) {
    workInProgressRootDidAttachPingListener = true;
    threadIDs.add(lanes);
    const ping = pingSuspendedRoot.bind(null, root, wakeable, lanes);

    wakeable.then(ping, ping);
  }
}

function pingSuspendedRoot(root, wakeable, pingedLanes) {
  const pingCache = root.pingCache;

  if (pingCache !== null) {
    pingCache.delete(wakeable);
  }

  markRootPinged(root, pingedLanes);
  warnIfSuspenseResolutionNotWrappedWithActDEV();

  if (workInProgressRoot === root && isSubsetOfLanes(workInProgressRootRenderLanes, pingedLanes)) {
    if (workInProgressRootExitStatus === RootSuspendedWithDelay || workInProgressRootExitStatus === RootSuspended && includesOnlyRetries(workInProgressRootRenderLanes) && now() - globalMostRecentFallbackTime < FALLBACK_THROTTLE_MS) {
      if ((executionContext & RenderContext) === NoContext) {
        prepareFreshStack(root, NoLanes);
      }
    } else {
      workInProgressRootPingedLanes = mergeLanes(workInProgressRootPingedLanes, pingedLanes);
    }

    if (workInProgressSuspendedRetryLanes === workInProgressRootRenderLanes) {
      workInProgressSuspendedRetryLanes = NoLanes;
    }
  }

  ensureRootIsScheduled(root);
}

function retryTimedOutBoundary(boundaryFiber, retryLane) {
  if (retryLane === NoLane) {
    retryLane = requestRetryLane();
  }

  const root = enqueueConcurrentRenderForLane(boundaryFiber, retryLane);

  if (root !== null) {
    markRootUpdated(root, retryLane);
    ensureRootIsScheduled(root);
  }
}

function retryDehydratedSuspenseBoundary(boundaryFiber) {
  const suspenseState = boundaryFiber.memoizedState;
  let retryLane = NoLane;

  if (suspenseState !== null) {
    retryLane = suspenseState.retryLane;
  }

  retryTimedOutBoundary(boundaryFiber, retryLane);
}
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

    case OffscreenComponent:
      {
        const instance = boundaryFiber.stateNode;
        retryCache = instance._retryCache;
        break;
      }

    default:
      throw new Error('Pinged unknown suspense boundary type. ' + 'This is probably a bug in React.');
  }

  if (retryCache !== null) {
    retryCache.delete(wakeable);
  }

  retryTimedOutBoundary(boundaryFiber, retryLane);
}
function throwIfInfiniteUpdateLoopDetected() {
  if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
    nestedUpdateCount = 0;
    nestedPassiveUpdateCount = 0;
    rootWithNestedUpdates = null;
    rootWithPassiveNestedUpdates = null;

    throw new Error('Maximum update depth exceeded. This can happen when a component ' + 'repeatedly calls setState inside componentWillUpdate or ' + 'componentDidUpdate. React limits the number of nested updates to ' + 'prevent infinite loops.');
  }

  {
    if (nestedPassiveUpdateCount > NESTED_PASSIVE_UPDATE_LIMIT) {
      nestedPassiveUpdateCount = 0;
      rootWithPassiveNestedUpdates = null;
      console.error('Maximum update depth exceeded. This can happen when a component ' + "calls setState inside useEffect, but useEffect either doesn't " + 'have a dependency array, or one of the dependencies changes on ' + 'every render.');
    }
  }
}

function flushRenderPhaseStrictModeWarningsInDEV() {
  {
    ReactStrictModeWarnings.flushLegacyContextWarning();
    ReactStrictModeWarnings.flushPendingUnsafeLifecycleWarnings();
  }
}

function recursivelyTraverseAndDoubleInvokeEffectsInDEV(root, parentFiber, isInStrictMode) {
  if ((parentFiber.subtreeFlags & (PlacementDEV | Visibility)) === NoFlags$1) {
    return;
  }

  let child = parentFiber.child;

  while (child !== null) {
    doubleInvokeEffectsInDEVIfNecessary(root, child, isInStrictMode);
    child = child.sibling;
  }
}

function doubleInvokeEffectsOnFiber(root, fiber, shouldDoubleInvokePassiveEffects = true) {
  setIsStrictModeForDevtools(true);

  try {
    disappearLayoutEffects(fiber);

    if (shouldDoubleInvokePassiveEffects) {
      disconnectPassiveEffect(fiber);
    }

    reappearLayoutEffects(root, fiber.alternate, fiber, false);

    if (shouldDoubleInvokePassiveEffects) {
      reconnectPassiveEffects(root, fiber, NoLanes, null, false);
    }
  } finally {
    setIsStrictModeForDevtools(false);
  }
}

function doubleInvokeEffectsInDEVIfNecessary(root, fiber, parentIsInStrictMode) {
  const isStrictModeFiber = fiber.type === REACT_STRICT_MODE_TYPE;
  const isInStrictMode = parentIsInStrictMode || isStrictModeFiber;

  if (fiber.tag !== OffscreenComponent) {
    if (fiber.flags & PlacementDEV) {
      if (isInStrictMode) {
        runWithFiberInDEV(fiber, doubleInvokeEffectsOnFiber, root, fiber, (fiber.mode & NoStrictPassiveEffectsMode) === NoMode);
      }
    } else {
      recursivelyTraverseAndDoubleInvokeEffectsInDEV(root, fiber, isInStrictMode);
    }

    return;
  }

  if (fiber.memoizedState === null) {
    if (isInStrictMode && fiber.flags & Visibility) {
      runWithFiberInDEV(fiber, doubleInvokeEffectsOnFiber, root, fiber);
    } else if (fiber.subtreeFlags & PlacementDEV) {
      runWithFiberInDEV(fiber, recursivelyTraverseAndDoubleInvokeEffectsInDEV, root, fiber, isInStrictMode);
    }
  }
}

function commitDoubleInvokeEffectsInDEV(root, hasPassiveEffects) {
  {
    {
      let doubleInvokeEffects = true;

      if (!(root.current.mode & (StrictLegacyMode | StrictEffectsMode))) {
        doubleInvokeEffects = false;
      }

      recursivelyTraverseAndDoubleInvokeEffectsInDEV(root, root.current, doubleInvokeEffects);
    }
  }
}

let didWarnStateUpdateForNotYetMountedComponent = null;
function warnAboutUpdateOnNotYetMountedFiberInDEV(fiber) {
  {
    if ((executionContext & RenderContext) !== NoContext) {
      return;
    }

    const tag = fiber.tag;

    if (tag !== HostRoot && tag !== ClassComponent && tag !== FunctionComponent && tag !== ForwardRef && tag !== MemoComponent && tag !== SimpleMemoComponent) {
      return;
    }

    const componentName = getComponentNameFromFiber(fiber) || 'ReactComponent';

    if (didWarnStateUpdateForNotYetMountedComponent !== null) {
      if (didWarnStateUpdateForNotYetMountedComponent.has(componentName)) {
        return;
      }

      didWarnStateUpdateForNotYetMountedComponent.add(componentName);
    } else {
      didWarnStateUpdateForNotYetMountedComponent = new Set([componentName]);
    }

    runWithFiberInDEV(fiber, () => {
      console.error("Can't perform a React state update on a component that hasn't mounted yet. " + 'This indicates that you have a side-effect in your render function that ' + 'asynchronously later calls tries to update the component. Move this work to ' + 'useEffect instead.');
    });
  }
}
let didWarnAboutUpdateInRender = false;
let didWarnAboutUpdateInRenderForAnotherComponent;

{
  didWarnAboutUpdateInRenderForAnotherComponent = new Set();
}

function warnAboutRenderPhaseUpdatesInDEV(fiber) {
  {
    if (isRendering) {
      switch (fiber.tag) {
        case FunctionComponent:
        case ForwardRef:
        case SimpleMemoComponent:
          {
            const renderingComponentName = workInProgress && getComponentNameFromFiber(workInProgress) || 'Unknown';
            const dedupeKey = renderingComponentName;

            if (!didWarnAboutUpdateInRenderForAnotherComponent.has(dedupeKey)) {
              didWarnAboutUpdateInRenderForAnotherComponent.add(dedupeKey);
              const setStateComponentName = getComponentNameFromFiber(fiber) || 'Unknown';
              console.error('Cannot update a component (`%s`) while rendering a ' + 'different component (`%s`). To locate the bad setState() call inside `%s`, ' + 'follow the stack trace as described in https://react.dev/link/setstate-in-render', setStateComponentName, renderingComponentName, renderingComponentName);
            }

            break;
          }

        case ClassComponent:
          {
            if (!didWarnAboutUpdateInRender) {
              console.error('Cannot update during an existing state transition (such as ' + 'within `render`). Render methods should be a pure ' + 'function of props and state.');
              didWarnAboutUpdateInRender = true;
            }

            break;
          }
      }
    }
  }
}
const fakeActCallbackNode$1 = {};

function scheduleCallback$1(priorityLevel, callback) {
  {
    const actQueue = ReactSharedInternals.actQueue;

    if (actQueue !== null) {
      actQueue.push(callback);
      return fakeActCallbackNode$1;
    } else {
      return scheduleCallback$3(priorityLevel, callback);
    }
  }
}

function shouldForceFlushFallbacksInDEV() {
  return ReactSharedInternals.actQueue !== null;
}

function warnIfUpdatesNotWrappedWithActDEV(fiber) {
  {
    {
      if (!isConcurrentActEnvironment()) {
        return;
      }
    }

    if (ReactSharedInternals.actQueue === null) {
      runWithFiberInDEV(fiber, () => {
        console.error('An update to %s inside a test was not wrapped in act(...).\n\n' + 'When testing, code that causes React state updates should be ' + 'wrapped into act(...):\n\n' + 'act(() => {\n' + '  /* fire events that update state */\n' + '});\n' + '/* assert on the output */\n\n' + "This ensures that you're testing the behavior the user would see " + 'in the browser.' + ' Learn more at https://react.dev/link/wrap-tests-with-act', getComponentNameFromFiber(fiber));
      });
    }
  }
}

function warnIfSuspenseResolutionNotWrappedWithActDEV(root) {
  {
    if (isConcurrentActEnvironment() && ReactSharedInternals.actQueue === null) {
      console.error('A suspended resource finished loading inside a test, but the event ' + 'was not wrapped in act(...).\n\n' + 'When testing, code that resolves suspended data should be wrapped ' + 'into act(...):\n\n' + 'act(() => {\n' + '  /* finish loading suspended data */\n' + '});\n' + '/* assert on the output */\n\n' + "This ensures that you're testing the behavior the user would see " + 'in the browser.' + ' Learn more at https://react.dev/link/wrap-tests-with-act');
    }
  }
}

function setIsRunningInsertionEffect(isRunning) {
  {
    isRunningInsertionEffect = isRunning;
  }
}

let firstScheduledRoot = null;
let lastScheduledRoot = null;
let didScheduleMicrotask = false;
let didScheduleMicrotask_act = false;
let mightHavePendingSyncWork = false;
let isFlushingWork = false;
let currentEventTransitionLane = NoLane;
function ensureRootIsScheduled(root) {
  if (root === lastScheduledRoot || root.next !== null) ; else {
    if (lastScheduledRoot === null) {
      firstScheduledRoot = lastScheduledRoot = root;
    } else {
      lastScheduledRoot.next = root;
      lastScheduledRoot = root;
    }
  }

  mightHavePendingSyncWork = true;

  if (ReactSharedInternals.actQueue !== null) {
    if (!didScheduleMicrotask_act) {
      didScheduleMicrotask_act = true;
      scheduleImmediateTask(processRootScheduleInMicrotask);
    }
  } else {
    if (!didScheduleMicrotask) {
      didScheduleMicrotask = true;
      scheduleImmediateTask(processRootScheduleInMicrotask);
    }
  }
}
function flushSyncWorkOnAllRoots() {
  flushSyncWorkAcrossRoots_impl(NoLanes, false);
}

function flushSyncWorkAcrossRoots_impl(syncTransitionLanes, onlyLegacy) {
  if (isFlushingWork) {
    return;
  }

  if (!mightHavePendingSyncWork) {
    return;
  }

  let didPerformSomeWork;
  isFlushingWork = true;

  do {
    didPerformSomeWork = false;
    let root = firstScheduledRoot;

    while (root !== null) {
      if (onlyLegacy && (disableLegacyMode )) ; else {
        if (syncTransitionLanes !== NoLanes) {
          const nextLanes = getNextLanesToFlushSync(root, syncTransitionLanes);

          if (nextLanes !== NoLanes) {
            didPerformSomeWork = true;
            performSyncWorkOnRoot(root, nextLanes);
          }
        } else {
          const workInProgressRoot = getWorkInProgressRoot();
          const workInProgressRootRenderLanes = getWorkInProgressRootRenderLanes();
          const nextLanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);

          if (includesSyncLane(nextLanes) && !checkIfRootIsPrerendering(root, nextLanes)) {
            didPerformSomeWork = true;
            performSyncWorkOnRoot(root, nextLanes);
          }
        }
      }

      root = root.next;
    }
  } while (didPerformSomeWork);

  isFlushingWork = false;
}

function processRootScheduleInMicrotask() {
  didScheduleMicrotask = false;

  {
    didScheduleMicrotask_act = false;
  }

  mightHavePendingSyncWork = false;
  let syncTransitionLanes = NoLanes;

  if (currentEventTransitionLane !== NoLane) {
    if (shouldAttemptEagerTransition()) {
      syncTransitionLanes = currentEventTransitionLane;
    }

    currentEventTransitionLane = NoLane;
  }

  const currentTime = now();
  let prev = null;
  let root = firstScheduledRoot;

  while (root !== null) {
    const next = root.next;
    const nextLanes = scheduleTaskForRootDuringMicrotask(root, currentTime);

    if (nextLanes === NoLane) {
      root.next = null;

      if (prev === null) {
        firstScheduledRoot = next;
      } else {
        prev.next = next;
      }

      if (next === null) {
        lastScheduledRoot = prev;
      }
    } else {
      prev = root;

      if (syncTransitionLanes !== NoLanes || includesSyncLane(nextLanes)) {
        mightHavePendingSyncWork = true;
      }
    }

    root = next;
  }

  flushSyncWorkAcrossRoots_impl(syncTransitionLanes, false);
}

function scheduleTaskForRootDuringMicrotask(root, currentTime) {
  markStarvedLanesAsExpired(root, currentTime);
  const workInProgressRoot = getWorkInProgressRoot();
  const workInProgressRootRenderLanes = getWorkInProgressRootRenderLanes();
  const nextLanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);
  const existingCallbackNode = root.callbackNode;

  if (nextLanes === NoLanes || root === workInProgressRoot && isWorkLoopSuspendedOnData() || root.cancelPendingCommit !== null) {
    if (existingCallbackNode !== null) {
      cancelCallback(existingCallbackNode);
    }

    root.callbackNode = null;
    root.callbackPriority = NoLane;
    return NoLane;
  }

  if (includesSyncLane(nextLanes) && !(checkIfRootIsPrerendering(root, nextLanes))) {
    if (existingCallbackNode !== null) {
      cancelCallback(existingCallbackNode);
    }

    root.callbackPriority = SyncLane;
    root.callbackNode = null;
    return SyncLane;
  } else {
    const existingCallbackPriority = root.callbackPriority;
    const newCallbackPriority = getHighestPriorityLane(nextLanes);

    if (newCallbackPriority === existingCallbackPriority && !(ReactSharedInternals.actQueue !== null && existingCallbackNode !== fakeActCallbackNode)) {
      return newCallbackPriority;
    } else {
      cancelCallback(existingCallbackNode);
    }

    let schedulerPriorityLevel;

    switch (lanesToEventPriority(nextLanes)) {
      case DiscreteEventPriority:
      case ContinuousEventPriority:
        schedulerPriorityLevel = UserBlockingPriority;
        break;

      case DefaultEventPriority:
        schedulerPriorityLevel = NormalPriority$1;
        break;

      case IdleEventPriority:
        schedulerPriorityLevel = IdlePriority;
        break;

      default:
        schedulerPriorityLevel = NormalPriority$1;
        break;
    }

    const newCallbackNode = scheduleCallback(schedulerPriorityLevel, performWorkOnRootViaSchedulerTask.bind(null, root));
    root.callbackPriority = newCallbackPriority;
    root.callbackNode = newCallbackNode;
    return newCallbackPriority;
  }
}

function performWorkOnRootViaSchedulerTask(root, didTimeout) {

  const originalCallbackNode = root.callbackNode;
  const didFlushPassiveEffects = flushPassiveEffects();

  if (didFlushPassiveEffects) {
    if (root.callbackNode !== originalCallbackNode) {
      return null;
    }
  }

  const workInProgressRoot = getWorkInProgressRoot();
  const workInProgressRootRenderLanes = getWorkInProgressRootRenderLanes();
  const lanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);

  if (lanes === NoLanes) {
    return null;
  }

  const forceSync = didTimeout;
  performWorkOnRoot(root, lanes, forceSync);
  scheduleTaskForRootDuringMicrotask(root, now());

  if (root.callbackNode != null && root.callbackNode === originalCallbackNode) {
    return performWorkOnRootViaSchedulerTask.bind(null, root);
  }

  return null;
}

function performSyncWorkOnRoot(root, lanes) {
  const didFlushPassiveEffects = flushPassiveEffects();

  if (didFlushPassiveEffects) {
    return null;
  }

  const forceSync = true;
  performWorkOnRoot(root, lanes, forceSync);
}

const fakeActCallbackNode = {};

function scheduleCallback(priorityLevel, callback) {
  if (ReactSharedInternals.actQueue !== null) {
    ReactSharedInternals.actQueue.push(callback);
    return fakeActCallbackNode;
  } else {
    return scheduleCallback$3(priorityLevel, callback);
  }
}

function cancelCallback(callbackNode) {
  if (callbackNode === fakeActCallbackNode) ; else if (callbackNode !== null) {
    cancelCallback$1(callbackNode);
  }
}

function scheduleImmediateTask(cb) {
  if (ReactSharedInternals.actQueue !== null) {
    ReactSharedInternals.actQueue.push(() => {
      cb();
      return null;
    });
  }

  {
    scheduleMicrotask(() => {
      const executionContext = getExecutionContext();

      if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
        scheduleCallback$3(ImmediatePriority, cb);
        return;
      }

      cb();
    });
  }
}

function requestTransitionLane(transition) {
  if (currentEventTransitionLane === NoLane) {
    currentEventTransitionLane = claimNextTransitionLane();
  }

  return currentEventTransitionLane;
}
function didCurrentEventScheduleTransition() {
  return currentEventTransitionLane !== NoLane;
}

function coerceFormActionProp(actionProp) {
  if (actionProp == null || typeof actionProp === 'symbol' || typeof actionProp === 'boolean') {
    return null;
  } else if (typeof actionProp === 'function') {
    return actionProp;
  } else {
    {
      checkAttributeStringCoercion(actionProp, 'action');
    }

    return sanitizeURL('' + actionProp);
  }
}

function createFormDataWithSubmitter(form, submitter) {
  const temp = submitter.ownerDocument.createElement('input');
  temp.name = submitter.name;
  temp.value = submitter.value;

  if (form.id) {
    temp.setAttribute('form', form.id);
  }

  submitter.parentNode.insertBefore(temp, submitter);
  const formData = new FormData(form);
  temp.parentNode.removeChild(temp);
  return formData;
}

function extractEvents$1(dispatchQueue, domEventName, maybeTargetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
  if (domEventName !== 'submit') {
    return;
  }

  if (!maybeTargetInst || maybeTargetInst.stateNode !== nativeEventTarget) {
    return;
  }

  const formInst = maybeTargetInst;
  const form = nativeEventTarget;
  let action = coerceFormActionProp(getFiberCurrentPropsFromNode(form).action);
  let submitter = nativeEvent.submitter;
  let submitterAction;

  if (submitter) {
    const submitterProps = getFiberCurrentPropsFromNode(submitter);
    submitterAction = submitterProps ? coerceFormActionProp(submitterProps.formAction) : submitter.getAttribute('formAction');

    if (submitterAction !== null) {
      action = submitterAction;
      submitter = null;
    }
  }

  const event = new SyntheticEvent('action', 'action', null, nativeEvent, nativeEventTarget);

  function submitForm() {
    if (nativeEvent.defaultPrevented) {
      if (didCurrentEventScheduleTransition()) {
        const formData = submitter ? createFormDataWithSubmitter(form, submitter) : new FormData(form);
        const pendingState = {
          pending: true,
          data: formData,
          method: form.method,
          action: action
        };

        {
          Object.freeze(pendingState);
        }

        startHostTransition(formInst, pendingState, null, formData);
      }
    } else if (typeof action === 'function') {
      event.preventDefault();
      const formData = submitter ? createFormDataWithSubmitter(form, submitter) : new FormData(form);
      const pendingState = {
        pending: true,
        data: formData,
        method: form.method,
        action: action
      };

      {
        Object.freeze(pendingState);
      }

      startHostTransition(formInst, pendingState, action, formData);
    } else ;
  }

  dispatchQueue.push({
    event,
    listeners: [{
      instance: null,
      listener: submitForm,
      currentTarget: form
    }]
  });
}
function dispatchReplayedFormAction(formInst, form, action, formData) {
  const pendingState = {
    pending: true,
    data: formData,
    method: form.method,
    action: action
  };

  {
    Object.freeze(pendingState);
  }

  startHostTransition(formInst, pendingState, action, formData);
}

registerSimpleEvents();
registerEvents$1();
registerEvents$2();
registerEvents();
registerEvents$3();

function extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags, targetContainer) {
  extractEvents$2(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags);
  const shouldProcessPolyfillPlugins = (eventSystemFlags & SHOULD_NOT_PROCESS_POLYFILL_EVENT_PLUGINS) === 0;

  if (shouldProcessPolyfillPlugins) {
    extractEvents$4(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
    extractEvents$5(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
    extractEvents$3(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
    extractEvents$6(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
    extractEvents$1(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
  }
}

const mediaEventTypes = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'encrypted', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'resize', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting'];
const nonDelegatedEvents = new Set(['beforetoggle', 'cancel', 'close', 'invalid', 'load', 'scroll', 'scrollend', 'toggle', ...mediaEventTypes]);

function executeDispatch(event, listener, currentTarget) {
  event.currentTarget = currentTarget;

  try {
    listener(event);
  } catch (error) {
    reportGlobalError(error);
  }

  event.currentTarget = null;
}

function processDispatchQueueItemsInOrder(event, dispatchListeners, inCapturePhase) {
  let previousInstance;

  if (inCapturePhase) {
    for (let i = dispatchListeners.length - 1; i >= 0; i--) {
      const {
        instance,
        currentTarget,
        listener
      } = dispatchListeners[i];

      if (instance !== previousInstance && event.isPropagationStopped()) {
        return;
      }

      {
        executeDispatch(event, listener, currentTarget);
      }

      previousInstance = instance;
    }
  } else {
    for (let i = 0; i < dispatchListeners.length; i++) {
      const {
        instance,
        currentTarget,
        listener
      } = dispatchListeners[i];

      if (instance !== previousInstance && event.isPropagationStopped()) {
        return;
      }

      {
        executeDispatch(event, listener, currentTarget);
      }

      previousInstance = instance;
    }
  }
}

function processDispatchQueue(dispatchQueue, eventSystemFlags) {
  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;

  for (let i = 0; i < dispatchQueue.length; i++) {
    const {
      event,
      listeners
    } = dispatchQueue[i];
    processDispatchQueueItemsInOrder(event, listeners, inCapturePhase);
  }
}

function dispatchEventsForPlugins(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer) {
  const nativeEventTarget = getEventTarget(nativeEvent);
  const dispatchQueue = [];
  extractEvents(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget, eventSystemFlags);
  processDispatchQueue(dispatchQueue, eventSystemFlags);
}

function listenToNonDelegatedEvent(domEventName, targetElement) {
  {
    if (!nonDelegatedEvents.has(domEventName)) {
      console.error('Did not expect a listenToNonDelegatedEvent() call for "%s". ' + 'This is a bug in React. Please file an issue.', domEventName);
    }
  }

  const isCapturePhaseListener = false;
  const listenerSet = getEventListenerSet(targetElement);
  const listenerSetKey = getListenerSetKey(domEventName, isCapturePhaseListener);

  if (!listenerSet.has(listenerSetKey)) {
    addTrappedEventListener(targetElement, domEventName, IS_NON_DELEGATED, isCapturePhaseListener);
    listenerSet.add(listenerSetKey);
  }
}
function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
  {
    if (nonDelegatedEvents.has(domEventName) && !isCapturePhaseListener) {
      console.error('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. ' + 'This is a bug in React. Please file an issue.', domEventName);
    }
  }

  let eventSystemFlags = 0;

  if (isCapturePhaseListener) {
    eventSystemFlags |= IS_CAPTURE_PHASE;
  }

  addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListener);
}
const listeningMarker = '_reactListening' + Math.random().toString(36).slice(2);
function listenToAllSupportedEvents(rootContainerElement) {
  if (!rootContainerElement[listeningMarker]) {
    rootContainerElement[listeningMarker] = true;
    allNativeEvents.forEach(domEventName => {
      if (domEventName !== 'selectionchange') {
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
        listenToNativeEvent('selectionchange', false, ownerDocument);
      }
    }
  }
}

function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener, isDeferredListenerForLegacyFBSupport) {
  let listener = createEventListenerWrapperWithPriority(targetContainer, domEventName, eventSystemFlags);
  let isPassiveListener = undefined;

  if (passiveBrowserEventsSupported) {
    if (domEventName === 'touchstart' || domEventName === 'touchmove' || domEventName === 'wheel') {
      isPassiveListener = true;
    }
  }

  targetContainer = targetContainer;

  if (isCapturePhaseListener) {
    if (isPassiveListener !== undefined) {
      addEventCaptureListenerWithPassiveFlag(targetContainer, domEventName, listener, isPassiveListener);
    } else {
      addEventCaptureListener(targetContainer, domEventName, listener);
    }
  } else {
    if (isPassiveListener !== undefined) {
      addEventBubbleListenerWithPassiveFlag(targetContainer, domEventName, listener, isPassiveListener);
    } else {
      addEventBubbleListener(targetContainer, domEventName, listener);
    }
  }
}

function isMatchingRootContainer(grandContainer, targetContainer) {
  return grandContainer === targetContainer || grandContainer.nodeType === COMMENT_NODE && grandContainer.parentNode === targetContainer;
}

function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst, targetContainer) {
  let ancestorInst = targetInst;

  if ((eventSystemFlags & IS_EVENT_HANDLE_NON_MANAGED_NODE) === 0 && (eventSystemFlags & IS_NON_DELEGATED) === 0) {
    const targetContainerNode = targetContainer;

    if (targetInst !== null) {
      let node = targetInst;

      mainLoop: while (true) {
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

            if (parentTag === HostComponent || parentTag === HostText || parentTag === HostHoistable || parentTag === HostSingleton) {
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

  batchedUpdates$1(() => dispatchEventsForPlugins(domEventName, eventSystemFlags, nativeEvent, ancestorInst));
}

function createDispatchListener(instance, listener, currentTarget) {
  return {
    instance,
    listener,
    currentTarget
  };
}

function accumulateSinglePhaseListeners(targetFiber, reactName, nativeEventType, inCapturePhase, accumulateTargetOnly, nativeEvent) {
  const captureName = reactName !== null ? reactName + 'Capture' : null;
  const reactEventName = inCapturePhase ? captureName : reactName;
  let listeners = [];
  let instance = targetFiber;
  let lastHostComponent = null;

  while (instance !== null) {
    const {
      stateNode,
      tag
    } = instance;

    if ((tag === HostComponent || tag === HostHoistable || tag === HostSingleton) && stateNode !== null) {
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
function accumulateTwoPhaseListeners(targetFiber, reactName) {
  const captureName = reactName + 'Capture';
  const listeners = [];
  let instance = targetFiber;

  while (instance !== null) {
    const {
      stateNode,
      tag
    } = instance;

    if ((tag === HostComponent || tag === HostHoistable || tag === HostSingleton) && stateNode !== null) {
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

function getParent(inst) {
  if (inst === null) {
    return null;
  }

  do {
    inst = inst.return;
  } while (inst && inst.tag !== HostComponent && inst.tag !== HostSingleton);

  if (inst) {
    return inst;
  }

  return null;
}

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

function accumulateEnterLeaveListenersForEvent(dispatchQueue, event, target, common, inCapturePhase) {
  const registrationName = event._reactName;
  const listeners = [];
  let instance = target;

  while (instance !== null) {
    if (instance === common) {
      break;
    }

    const {
      alternate,
      stateNode,
      tag
    } = instance;

    if (alternate !== null && alternate === common) {
      break;
    }

    if ((tag === HostComponent || tag === HostHoistable || tag === HostSingleton) && stateNode !== null) {
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

function accumulateEnterLeaveTwoPhaseListeners(dispatchQueue, leaveEvent, enterEvent, from, to) {
  const common = from && to ? getLowestCommonAncestor(from, to) : null;

  if (from !== null) {
    accumulateEnterLeaveListenersForEvent(dispatchQueue, leaveEvent, from, common, false);
  }

  if (to !== null && enterEvent !== null) {
    accumulateEnterLeaveListenersForEvent(dispatchQueue, enterEvent, to, common, true);
  }
}
function getListenerSetKey(domEventName, capture) {
  return `${domEventName}__${capture ? 'capture' : 'bubble'}`;
}

let didWarnControlledToUncontrolled = false;
let didWarnUncontrolledToControlled = false;
let didWarnFormActionType = false;
let didWarnFormActionName = false;
let didWarnFormActionTarget = false;
let didWarnFormActionMethod = false;
let didWarnForNewBooleanPropsWithEmptyValue;
let didWarnPopoverTargetObject = false;
let canDiffStyleForHydrationWarning;

{
  didWarnForNewBooleanPropsWithEmptyValue = {};
  canDiffStyleForHydrationWarning = disableIEWorkarounds ;
}

function validatePropertiesInDevelopment(type, props) {
  {
    validateProperties$2(type, props);
    validateProperties$1(type, props);
    validateProperties(type, props, {
      registrationNameDependencies,
      possibleRegistrationNames
    });

    if (props.contentEditable && !props.suppressContentEditableWarning && props.children != null) {
      console.error('A component is `contentEditable` and contains `children` managed by ' + 'React. It is now your responsibility to guarantee that none of ' + 'those nodes are unexpectedly modified or duplicated. This is ' + 'probably not intentional.');
    }
  }
}

function validateFormActionInDevelopment(tag, key, value, props) {
  {
    if (value == null) {
      return;
    }

    if (tag === 'form') {
      if (key === 'formAction') {
        console.error('You can only pass the formAction prop to <input> or <button>. Use the action prop on <form>.');
      } else if (typeof value === 'function') {
        if ((props.encType != null || props.method != null) && !didWarnFormActionMethod) {
          didWarnFormActionMethod = true;
          console.error('Cannot specify a encType or method for a form that specifies a ' + 'function as the action. React provides those automatically. ' + 'They will get overridden.');
        }

        if (props.target != null && !didWarnFormActionTarget) {
          didWarnFormActionTarget = true;
          console.error('Cannot specify a target for a form that specifies a function as the action. ' + 'The function will always be executed in the same window.');
        }
      }
    } else if (tag === 'input' || tag === 'button') {
      if (key === 'action') {
        console.error('You can only pass the action prop to <form>. Use the formAction prop on <input> or <button>.');
      } else if (tag === 'input' && props.type !== 'submit' && props.type !== 'image' && !didWarnFormActionType) {
        didWarnFormActionType = true;
        console.error('An input can only specify a formAction along with type="submit" or type="image".');
      } else if (tag === 'button' && props.type != null && props.type !== 'submit' && !didWarnFormActionType) {
        didWarnFormActionType = true;
        console.error('A button can only specify a formAction along with type="submit" or no type.');
      } else if (typeof value === 'function') {
        if (props.name != null && !didWarnFormActionName) {
          didWarnFormActionName = true;
          console.error('Cannot specify a "name" prop for a button that specifies a function as a formAction. ' + 'React needs it to encode which action should be invoked. It will get overridden.');
        }

        if ((props.formEncType != null || props.formMethod != null) && !didWarnFormActionMethod) {
          didWarnFormActionMethod = true;
          console.error('Cannot specify a formEncType or formMethod for a button that specifies a ' + 'function as a formAction. React provides those automatically. They will get overridden.');
        }

        if (props.formTarget != null && !didWarnFormActionTarget) {
          didWarnFormActionTarget = true;
          console.error('Cannot specify a formTarget for a button that specifies a function as a formAction. ' + 'The function will always be executed in the same window.');
        }
      }
    } else {
      if (key === 'action') {
        console.error('You can only pass the action prop to <form>.');
      } else {
        console.error('You can only pass the formAction prop to <input> or <button>.');
      }
    }
  }
}

function warnForPropDifference(propName, serverValue, clientValue, serverDifferences) {
  {
    if (serverValue === clientValue) {
      return;
    }

    const normalizedClientValue = normalizeMarkupForTextOrAttribute(clientValue);
    const normalizedServerValue = normalizeMarkupForTextOrAttribute(serverValue);

    if (normalizedServerValue === normalizedClientValue) {
      return;
    }

    serverDifferences[propName] = serverValue;
  }
}

function warnForExtraAttributes(domElement, attributeNames, serverDifferences) {
  {
    attributeNames.forEach(function (attributeName) {
      serverDifferences[getPropNameFromAttributeName(attributeName)] = attributeName === 'style' ? getStylesObjectFromElement(domElement) : domElement.getAttribute(attributeName);
    });
  }
}

function warnForInvalidEventListener(registrationName, listener) {
  {
    if (listener === false) {
      console.error('Expected `%s` listener to be a function, instead got `false`.\n\n' + 'If you used to conditionally omit it with %s={condition && value}, ' + 'pass %s={condition ? value : undefined} instead.', registrationName, registrationName, registrationName);
    } else {
      console.error('Expected `%s` listener to be a function, instead got a value of `%s` type.', registrationName, typeof listener);
    }
  }
}

function normalizeHTML(parent, html) {
  {
    const testElement = parent.namespaceURI === MATH_NAMESPACE || parent.namespaceURI === SVG_NAMESPACE ? parent.ownerDocument.createElementNS(parent.namespaceURI, parent.tagName) : parent.ownerDocument.createElement(parent.tagName);
    testElement.innerHTML = html;
    return testElement.innerHTML;
  }
}

const NORMALIZE_NEWLINES_REGEX = /\r\n?/g;
const NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;

function normalizeMarkupForTextOrAttribute(markup) {
  {
    checkHtmlStringCoercion(markup);
  }

  const markupString = typeof markup === 'string' ? markup : '' + markup;
  return markupString.replace(NORMALIZE_NEWLINES_REGEX, '\n').replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, '');
}

function checkForUnmatchedText(serverText, clientText) {
  const normalizedClientText = normalizeMarkupForTextOrAttribute(clientText);
  const normalizedServerText = normalizeMarkupForTextOrAttribute(serverText);

  if (normalizedServerText === normalizedClientText) {
    return true;
  }

  return false;
}

function noop$1() {}

function trapClickOnNonInteractiveElement(node) {
  node.onclick = noop$1;
}
const xlinkNamespace = 'http://www.w3.org/1999/xlink';
const xmlNamespace = 'http://www.w3.org/XML/1998/namespace';

function setProp(domElement, tag, key, value, props, prevValue) {
  switch (key) {
    case 'children':
      {
        if (typeof value === 'string') {
          {
            validateTextNesting(value, tag);
          }

          const canSetTextContent = tag !== 'body' && (tag !== 'textarea' || value !== '');

          if (canSetTextContent) {
            setTextContent(domElement, value);
          }
        } else if (typeof value === 'number' || typeof value === 'bigint') {
          {
            validateTextNesting('' + value, tag);
          }

          const canSetTextContent = tag !== 'body';

          if (canSetTextContent) {
            setTextContent(domElement, '' + value);
          }
        }

        break;
      }

    case 'className':
      setValueForKnownAttribute(domElement, 'class', value);
      break;

    case 'tabIndex':
      setValueForKnownAttribute(domElement, 'tabindex', value);
      break;

    case 'dir':
    case 'role':
    case 'viewBox':
    case 'width':
    case 'height':
      {
        setValueForKnownAttribute(domElement, key, value);
        break;
      }

    case 'style':
      {
        setValueForStyles(domElement, value, prevValue);
        break;
      }

    case 'data':
      if (tag !== 'object') {
        setValueForKnownAttribute(domElement, 'data', value);
        break;
      }

    case 'src':
    case 'href':
      {
        {
          if (value === '' && !(tag === 'a' && key === 'href')) {
            {
              if (key === 'src') {
                console.error('An empty string ("") was passed to the %s attribute. ' + 'This may cause the browser to download the whole page again over the network. ' + 'To fix this, either do not render the element at all ' + 'or pass null to %s instead of an empty string.', key, key);
              } else {
                console.error('An empty string ("") was passed to the %s attribute. ' + 'To fix this, either do not render the element at all ' + 'or pass null to %s instead of an empty string.', key, key);
              }
            }

            domElement.removeAttribute(key);
            break;
          }
        }

        if (value == null || typeof value === 'function' || typeof value === 'symbol' || typeof value === 'boolean') {
          domElement.removeAttribute(key);
          break;
        }

        {
          checkAttributeStringCoercion(value, key);
        }

        const sanitizedValue = sanitizeURL('' + value);
        domElement.setAttribute(key, sanitizedValue);
        break;
      }

    case 'action':
    case 'formAction':
      {
        {
          validateFormActionInDevelopment(tag, key, value, props);
        }

        if (typeof value === 'function') {
          domElement.setAttribute(key, "javascript:throw new Error('" + 'A React form was unexpectedly submitted. If you called form.submit() manually, ' + "consider using form.requestSubmit() instead. If you\\'re trying to use " + 'event.stopPropagation() in a submit event handler, consider also calling ' + 'event.preventDefault().' + "')");
          break;
        } else if (typeof prevValue === 'function') {
          if (key === 'formAction') {
            if (tag !== 'input') {
              setProp(domElement, tag, 'name', props.name, props, null);
            }

            setProp(domElement, tag, 'formEncType', props.formEncType, props, null);
            setProp(domElement, tag, 'formMethod', props.formMethod, props, null);
            setProp(domElement, tag, 'formTarget', props.formTarget, props, null);
          } else {
            setProp(domElement, tag, 'encType', props.encType, props, null);
            setProp(domElement, tag, 'method', props.method, props, null);
            setProp(domElement, tag, 'target', props.target, props, null);
          }
        }

        if (value == null || typeof value === 'symbol' || typeof value === 'boolean') {
          domElement.removeAttribute(key);
          break;
        }

        {
          checkAttributeStringCoercion(value, key);
        }

        const sanitizedValue = sanitizeURL('' + value);
        domElement.setAttribute(key, sanitizedValue);
        break;
      }

    case 'onClick':
      {
        if (value != null) {
          if (typeof value !== 'function') {
            warnForInvalidEventListener(key, value);
          }

          trapClickOnNonInteractiveElement(domElement);
        }

        break;
      }

    case 'onScroll':
      {
        if (value != null) {
          if (typeof value !== 'function') {
            warnForInvalidEventListener(key, value);
          }

          listenToNonDelegatedEvent('scroll', domElement);
        }

        break;
      }

    case 'onScrollEnd':
      {
        if (value != null) {
          if (typeof value !== 'function') {
            warnForInvalidEventListener(key, value);
          }

          listenToNonDelegatedEvent('scrollend', domElement);
        }

        break;
      }

    case 'dangerouslySetInnerHTML':
      {
        if (value != null) {
          if (typeof value !== 'object' || !('__html' in value)) {
            throw new Error('`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. ' + 'Please visit https://react.dev/link/dangerously-set-inner-html ' + 'for more information.');
          }

          const nextHtml = value.__html;

          if (nextHtml != null) {
            if (props.children != null) {
              throw new Error('Can only set one of `children` or `props.dangerouslySetInnerHTML`.');
            }

            {
              domElement.innerHTML = nextHtml;
            }
          }
        }

        break;
      }

    case 'multiple':
      {
        domElement.multiple = value && typeof value !== 'function' && typeof value !== 'symbol';
        break;
      }

    case 'muted':
      {
        domElement.muted = value && typeof value !== 'function' && typeof value !== 'symbol';
        break;
      }

    case 'suppressContentEditableWarning':
    case 'suppressHydrationWarning':
    case 'defaultValue':
    case 'defaultChecked':
    case 'innerHTML':
    case 'ref':
      {
        break;
      }

    case 'autoFocus':
      {
        break;
      }

    case 'xlinkHref':
      {
        if (value == null || typeof value === 'function' || typeof value === 'boolean' || typeof value === 'symbol') {
          domElement.removeAttribute('xlink:href');
          break;
        }

        {
          checkAttributeStringCoercion(value, key);
        }

        const sanitizedValue = sanitizeURL('' + value);
        domElement.setAttributeNS(xlinkNamespace, 'xlink:href', sanitizedValue);
        break;
      }

    case 'contentEditable':
    case 'spellCheck':
    case 'draggable':
    case 'value':
    case 'autoReverse':
    case 'externalResourcesRequired':
    case 'focusable':
    case 'preserveAlpha':
      {
        if (value != null && typeof value !== 'function' && typeof value !== 'symbol') {
          {
            checkAttributeStringCoercion(value, key);
          }

          domElement.setAttribute(key, '' + value);
        } else {
          domElement.removeAttribute(key);
        }

        break;
      }

    case 'inert':
      {
        {
          if (value === '' && !didWarnForNewBooleanPropsWithEmptyValue[key]) {
            didWarnForNewBooleanPropsWithEmptyValue[key] = true;
            console.error('Received an empty string for a boolean attribute `%s`. ' + 'This will treat the attribute as if it were false. ' + 'Either pass `false` to silence this warning, or ' + 'pass `true` if you used an empty string in earlier versions of React to indicate this attribute is true.', key);
          }
        }
      }

    case 'allowFullScreen':
    case 'async':
    case 'autoPlay':
    case 'controls':
    case 'default':
    case 'defer':
    case 'disabled':
    case 'disablePictureInPicture':
    case 'disableRemotePlayback':
    case 'formNoValidate':
    case 'hidden':
    case 'loop':
    case 'noModule':
    case 'noValidate':
    case 'open':
    case 'playsInline':
    case 'readOnly':
    case 'required':
    case 'reversed':
    case 'scoped':
    case 'seamless':
    case 'itemScope':
      {
        if (value && typeof value !== 'function' && typeof value !== 'symbol') {
          domElement.setAttribute(key, '');
        } else {
          domElement.removeAttribute(key);
        }

        break;
      }

    case 'capture':
    case 'download':
      {
        if (value === true) {
          domElement.setAttribute(key, '');
        } else if (value !== false && value != null && typeof value !== 'function' && typeof value !== 'symbol') {
          {
            checkAttributeStringCoercion(value, key);
          }

          domElement.setAttribute(key, value);
        } else {
          domElement.removeAttribute(key);
        }

        break;
      }

    case 'cols':
    case 'rows':
    case 'size':
    case 'span':
      {
        if (value != null && typeof value !== 'function' && typeof value !== 'symbol' && !isNaN(value) && value >= 1) {
          {
            checkAttributeStringCoercion(value, key);
          }

          domElement.setAttribute(key, value);
        } else {
          domElement.removeAttribute(key);
        }

        break;
      }

    case 'rowSpan':
    case 'start':
      {
        if (value != null && typeof value !== 'function' && typeof value !== 'symbol' && !isNaN(value)) {
          {
            checkAttributeStringCoercion(value, key);
          }

          domElement.setAttribute(key, value);
        } else {
          domElement.removeAttribute(key);
        }

        break;
      }

    case 'popover':
      listenToNonDelegatedEvent('beforetoggle', domElement);
      listenToNonDelegatedEvent('toggle', domElement);
      setValueForAttribute(domElement, 'popover', value);
      break;

    case 'xlinkActuate':
      setValueForNamespacedAttribute(domElement, xlinkNamespace, 'xlink:actuate', value);
      break;

    case 'xlinkArcrole':
      setValueForNamespacedAttribute(domElement, xlinkNamespace, 'xlink:arcrole', value);
      break;

    case 'xlinkRole':
      setValueForNamespacedAttribute(domElement, xlinkNamespace, 'xlink:role', value);
      break;

    case 'xlinkShow':
      setValueForNamespacedAttribute(domElement, xlinkNamespace, 'xlink:show', value);
      break;

    case 'xlinkTitle':
      setValueForNamespacedAttribute(domElement, xlinkNamespace, 'xlink:title', value);
      break;

    case 'xlinkType':
      setValueForNamespacedAttribute(domElement, xlinkNamespace, 'xlink:type', value);
      break;

    case 'xmlBase':
      setValueForNamespacedAttribute(domElement, xmlNamespace, 'xml:base', value);
      break;

    case 'xmlLang':
      setValueForNamespacedAttribute(domElement, xmlNamespace, 'xml:lang', value);
      break;

    case 'xmlSpace':
      setValueForNamespacedAttribute(domElement, xmlNamespace, 'xml:space', value);
      break;

    case 'is':
      {
        {
          if (prevValue != null) {
            console.error('Cannot update the "is" prop after it has been initialized.');
          }
        }

        setValueForAttribute(domElement, 'is', value);
        break;
      }

    case 'innerText':
    case 'textContent':
      break;

    case 'popoverTarget':
      {
        if (!didWarnPopoverTargetObject && value != null && typeof value === 'object') {
          didWarnPopoverTargetObject = true;
          console.error('The `popoverTarget` prop expects the ID of an Element as a string. Received %s instead.', value);
        }
      }

    default:
      {
        if (key.length > 2 && (key[0] === 'o' || key[0] === 'O') && (key[1] === 'n' || key[1] === 'N')) {
          if (registrationNameDependencies.hasOwnProperty(key) && value != null && typeof value !== 'function') {
            warnForInvalidEventListener(key, value);
          }
        } else {
          const attributeName = getAttributeAlias(key);
          setValueForAttribute(domElement, attributeName, value);
        }
      }
  }
}

function setPropOnCustomElement(domElement, tag, key, value, props, prevValue) {
  switch (key) {
    case 'style':
      {
        setValueForStyles(domElement, value, prevValue);
        break;
      }

    case 'dangerouslySetInnerHTML':
      {
        if (value != null) {
          if (typeof value !== 'object' || !('__html' in value)) {
            throw new Error('`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. ' + 'Please visit https://react.dev/link/dangerously-set-inner-html ' + 'for more information.');
          }

          const nextHtml = value.__html;

          if (nextHtml != null) {
            if (props.children != null) {
              throw new Error('Can only set one of `children` or `props.dangerouslySetInnerHTML`.');
            }

            {
              domElement.innerHTML = nextHtml;
            }
          }
        }

        break;
      }

    case 'children':
      {
        if (typeof value === 'string') {
          setTextContent(domElement, value);
        } else if (typeof value === 'number' || typeof value === 'bigint') {
          setTextContent(domElement, '' + value);
        }

        break;
      }

    case 'onScroll':
      {
        if (value != null) {
          if (typeof value !== 'function') {
            warnForInvalidEventListener(key, value);
          }

          listenToNonDelegatedEvent('scroll', domElement);
        }

        break;
      }

    case 'onScrollEnd':
      {
        if (value != null) {
          if (typeof value !== 'function') {
            warnForInvalidEventListener(key, value);
          }

          listenToNonDelegatedEvent('scrollend', domElement);
        }

        break;
      }

    case 'onClick':
      {
        if (value != null) {
          if (typeof value !== 'function') {
            warnForInvalidEventListener(key, value);
          }

          trapClickOnNonInteractiveElement(domElement);
        }

        break;
      }

    case 'suppressContentEditableWarning':
    case 'suppressHydrationWarning':
    case 'innerHTML':
    case 'ref':
      {
        break;
      }

    case 'innerText':
    case 'textContent':
      break;

    default:
      {
        if (registrationNameDependencies.hasOwnProperty(key)) {
          if (value != null && typeof value !== 'function') {
            warnForInvalidEventListener(key, value);
          }
        } else {
          setValueForPropertyOnCustomComponent(domElement, key, value);
        }
      }
  }
}

function setInitialProperties(domElement, tag, props) {
  {
    validatePropertiesInDevelopment(tag, props);
  }

  switch (tag) {
    case 'div':
    case 'span':
    case 'svg':
    case 'path':
    case 'a':
    case 'g':
    case 'p':
    case 'li':
      {
        break;
      }

    case 'img':
      {
        listenToNonDelegatedEvent('error', domElement);
        listenToNonDelegatedEvent('load', domElement);
        let hasSrc = false;
        let hasSrcSet = false;

        for (const propKey in props) {
          if (!props.hasOwnProperty(propKey)) {
            continue;
          }

          const propValue = props[propKey];

          if (propValue == null) {
            continue;
          }

          switch (propKey) {
            case 'src':
              hasSrc = true;
              break;

            case 'srcSet':
              hasSrcSet = true;
              break;

            case 'children':
            case 'dangerouslySetInnerHTML':
              {
                throw new Error(`${tag} is a void element tag and must neither have \`children\` nor ` + 'use `dangerouslySetInnerHTML`.');
              }

            default:
              {
                setProp(domElement, tag, propKey, propValue, props, null);
              }
          }
        }

        if (hasSrcSet) {
          setProp(domElement, tag, 'srcSet', props.srcSet, props, null);
        }

        if (hasSrc) {
          setProp(domElement, tag, 'src', props.src, props, null);
        }

        return;
      }

    case 'input':
      {
        {
          checkControlledValueProps('input', props);
        }

        listenToNonDelegatedEvent('invalid', domElement);
        let name = null;
        let type = null;
        let value = null;
        let defaultValue = null;
        let checked = null;
        let defaultChecked = null;

        for (const propKey in props) {
          if (!props.hasOwnProperty(propKey)) {
            continue;
          }

          const propValue = props[propKey];

          if (propValue == null) {
            continue;
          }

          switch (propKey) {
            case 'name':
              {
                name = propValue;
                break;
              }

            case 'type':
              {
                type = propValue;
                break;
              }

            case 'checked':
              {
                checked = propValue;
                break;
              }

            case 'defaultChecked':
              {
                defaultChecked = propValue;
                break;
              }

            case 'value':
              {
                value = propValue;
                break;
              }

            case 'defaultValue':
              {
                defaultValue = propValue;
                break;
              }

            case 'children':
            case 'dangerouslySetInnerHTML':
              {
                if (propValue != null) {
                  throw new Error(`${tag} is a void element tag and must neither have \`children\` nor ` + 'use `dangerouslySetInnerHTML`.');
                }

                break;
              }

            default:
              {
                setProp(domElement, tag, propKey, propValue, props, null);
              }
          }
        }

        validateInputProps(domElement, props);
        initInput(domElement, value, defaultValue, checked, defaultChecked, type, name, false);
        track(domElement);
        return;
      }

    case 'select':
      {
        {
          checkControlledValueProps('select', props);
        }

        listenToNonDelegatedEvent('invalid', domElement);
        let value = null;
        let defaultValue = null;
        let multiple = null;

        for (const propKey in props) {
          if (!props.hasOwnProperty(propKey)) {
            continue;
          }

          const propValue = props[propKey];

          if (propValue == null) {
            continue;
          }

          switch (propKey) {
            case 'value':
              {
                value = propValue;
                break;
              }

            case 'defaultValue':
              {
                defaultValue = propValue;
                break;
              }

            case 'multiple':
              {
                multiple = propValue;
              }

            default:
              {
                setProp(domElement, tag, propKey, propValue, props, null);
              }
          }
        }

        validateSelectProps(domElement, props);
        initSelect(domElement, value, defaultValue, multiple);
        return;
      }

    case 'textarea':
      {
        {
          checkControlledValueProps('textarea', props);
        }

        listenToNonDelegatedEvent('invalid', domElement);
        let value = null;
        let defaultValue = null;
        let children = null;

        for (const propKey in props) {
          if (!props.hasOwnProperty(propKey)) {
            continue;
          }

          const propValue = props[propKey];

          if (propValue == null) {
            continue;
          }

          switch (propKey) {
            case 'value':
              {
                value = propValue;
                break;
              }

            case 'defaultValue':
              {
                defaultValue = propValue;
                break;
              }

            case 'children':
              {
                children = propValue;
                break;
              }

            case 'dangerouslySetInnerHTML':
              {
                if (propValue != null) {
                  throw new Error('`dangerouslySetInnerHTML` does not make sense on <textarea>.');
                }

                break;
              }

            default:
              {
                setProp(domElement, tag, propKey, propValue, props, null);
              }
          }
        }

        validateTextareaProps(domElement, props);
        initTextarea(domElement, value, defaultValue, children);
        track(domElement);
        return;
      }

    case 'option':
      {
        validateOptionProps(domElement, props);

        for (const propKey in props) {
          if (!props.hasOwnProperty(propKey)) {
            continue;
          }

          const propValue = props[propKey];

          if (propValue == null) {
            continue;
          }

          switch (propKey) {
            case 'selected':
              {
                domElement.selected = propValue && typeof propValue !== 'function' && typeof propValue !== 'symbol';
                break;
              }

            default:
              {
                setProp(domElement, tag, propKey, propValue, props, null);
              }
          }
        }

        return;
      }

    case 'dialog':
      {
        listenToNonDelegatedEvent('cancel', domElement);
        listenToNonDelegatedEvent('close', domElement);
        break;
      }

    case 'iframe':
    case 'object':
      {
        listenToNonDelegatedEvent('load', domElement);
        break;
      }

    case 'video':
    case 'audio':
      {
        for (let i = 0; i < mediaEventTypes.length; i++) {
          listenToNonDelegatedEvent(mediaEventTypes[i], domElement);
        }

        break;
      }

    case 'image':
      {
        listenToNonDelegatedEvent('error', domElement);
        listenToNonDelegatedEvent('load', domElement);
        break;
      }

    case 'details':
      {
        listenToNonDelegatedEvent('toggle', domElement);
        break;
      }

    case 'embed':
    case 'source':
    case 'link':
      {
        listenToNonDelegatedEvent('error', domElement);
        listenToNonDelegatedEvent('load', domElement);
      }

    case 'area':
    case 'base':
    case 'br':
    case 'col':
    case 'hr':
    case 'keygen':
    case 'meta':
    case 'param':
    case 'track':
    case 'wbr':
    case 'menuitem':
      {
        for (const propKey in props) {
          if (!props.hasOwnProperty(propKey)) {
            continue;
          }

          const propValue = props[propKey];

          if (propValue == null) {
            continue;
          }

          switch (propKey) {
            case 'children':
            case 'dangerouslySetInnerHTML':
              {
                throw new Error(`${tag} is a void element tag and must neither have \`children\` nor ` + 'use `dangerouslySetInnerHTML`.');
              }

            default:
              {
                setProp(domElement, tag, propKey, propValue, props, null);
              }
          }
        }

        return;
      }

    default:
      {
        if (isCustomElement(tag)) {
          for (const propKey in props) {
            if (!props.hasOwnProperty(propKey)) {
              continue;
            }

            const propValue = props[propKey];

            if (propValue === undefined) {
              continue;
            }

            setPropOnCustomElement(domElement, tag, propKey, propValue, props, undefined);
          }

          return;
        }
      }
  }

  for (const propKey in props) {
    if (!props.hasOwnProperty(propKey)) {
      continue;
    }

    const propValue = props[propKey];

    if (propValue == null) {
      continue;
    }

    setProp(domElement, tag, propKey, propValue, props, null);
  }
}
function updateProperties(domElement, tag, lastProps, nextProps) {
  {
    validatePropertiesInDevelopment(tag, nextProps);
  }

  switch (tag) {
    case 'div':
    case 'span':
    case 'svg':
    case 'path':
    case 'a':
    case 'g':
    case 'p':
    case 'li':
      {
        break;
      }

    case 'input':
      {
        let name = null;
        let type = null;
        let value = null;
        let defaultValue = null;
        let lastDefaultValue = null;
        let checked = null;
        let defaultChecked = null;

        for (const propKey in lastProps) {
          const lastProp = lastProps[propKey];

          if (lastProps.hasOwnProperty(propKey) && lastProp != null) {
            switch (propKey) {
              case 'checked':
                {
                  break;
                }

              case 'value':
                {
                  break;
                }

              case 'defaultValue':
                {
                  lastDefaultValue = lastProp;
                }

              default:
                {
                  if (!nextProps.hasOwnProperty(propKey)) setProp(domElement, tag, propKey, null, nextProps, lastProp);
                }
            }
          }
        }

        for (const propKey in nextProps) {
          const nextProp = nextProps[propKey];
          const lastProp = lastProps[propKey];

          if (nextProps.hasOwnProperty(propKey) && (nextProp != null || lastProp != null)) {
            switch (propKey) {
              case 'type':
                {
                  type = nextProp;
                  break;
                }

              case 'name':
                {
                  name = nextProp;
                  break;
                }

              case 'checked':
                {
                  checked = nextProp;
                  break;
                }

              case 'defaultChecked':
                {
                  defaultChecked = nextProp;
                  break;
                }

              case 'value':
                {
                  value = nextProp;
                  break;
                }

              case 'defaultValue':
                {
                  defaultValue = nextProp;
                  break;
                }

              case 'children':
              case 'dangerouslySetInnerHTML':
                {
                  if (nextProp != null) {
                    throw new Error(`${tag} is a void element tag and must neither have \`children\` nor ` + 'use `dangerouslySetInnerHTML`.');
                  }

                  break;
                }

              default:
                {
                  if (nextProp !== lastProp) setProp(domElement, tag, propKey, nextProp, nextProps, lastProp);
                }
            }
          }
        }

        {
          const wasControlled = lastProps.type === 'checkbox' || lastProps.type === 'radio' ? lastProps.checked != null : lastProps.value != null;
          const isControlled = nextProps.type === 'checkbox' || nextProps.type === 'radio' ? nextProps.checked != null : nextProps.value != null;

          if (!wasControlled && isControlled && !didWarnUncontrolledToControlled) {
            console.error('A component is changing an uncontrolled input to be controlled. ' + 'This is likely caused by the value changing from undefined to ' + 'a defined value, which should not happen. ' + 'Decide between using a controlled or uncontrolled input ' + 'element for the lifetime of the component. More info: https://react.dev/link/controlled-components');
            didWarnUncontrolledToControlled = true;
          }

          if (wasControlled && !isControlled && !didWarnControlledToUncontrolled) {
            console.error('A component is changing a controlled input to be uncontrolled. ' + 'This is likely caused by the value changing from a defined to ' + 'undefined, which should not happen. ' + 'Decide between using a controlled or uncontrolled input ' + 'element for the lifetime of the component. More info: https://react.dev/link/controlled-components');
            didWarnControlledToUncontrolled = true;
          }
        }

        updateInput(domElement, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name);
        return;
      }

    case 'select':
      {
        let value = null;
        let defaultValue = null;
        let multiple = null;
        let wasMultiple = null;

        for (const propKey in lastProps) {
          const lastProp = lastProps[propKey];

          if (lastProps.hasOwnProperty(propKey) && lastProp != null) {
            switch (propKey) {
              case 'value':
                {
                  break;
                }

              case 'multiple':
                {
                  wasMultiple = lastProp;
                }

              default:
                {
                  if (!nextProps.hasOwnProperty(propKey)) setProp(domElement, tag, propKey, null, nextProps, lastProp);
                }
            }
          }
        }

        for (const propKey in nextProps) {
          const nextProp = nextProps[propKey];
          const lastProp = lastProps[propKey];

          if (nextProps.hasOwnProperty(propKey) && (nextProp != null || lastProp != null)) {
            switch (propKey) {
              case 'value':
                {
                  value = nextProp;
                  break;
                }

              case 'defaultValue':
                {
                  defaultValue = nextProp;
                  break;
                }

              case 'multiple':
                {
                  multiple = nextProp;
                }

              default:
                {
                  if (nextProp !== lastProp) setProp(domElement, tag, propKey, nextProp, nextProps, lastProp);
                }
            }
          }
        }

        updateSelect(domElement, value, defaultValue, multiple, wasMultiple);
        return;
      }

    case 'textarea':
      {
        let value = null;
        let defaultValue = null;

        for (const propKey in lastProps) {
          const lastProp = lastProps[propKey];

          if (lastProps.hasOwnProperty(propKey) && lastProp != null && !nextProps.hasOwnProperty(propKey)) {
            switch (propKey) {
              case 'value':
                {
                  break;
                }

              case 'children':
                {
                  break;
                }

              default:
                {
                  setProp(domElement, tag, propKey, null, nextProps, lastProp);
                }
            }
          }
        }

        for (const propKey in nextProps) {
          const nextProp = nextProps[propKey];
          const lastProp = lastProps[propKey];

          if (nextProps.hasOwnProperty(propKey) && (nextProp != null || lastProp != null)) {
            switch (propKey) {
              case 'value':
                {
                  value = nextProp;
                  break;
                }

              case 'defaultValue':
                {
                  defaultValue = nextProp;
                  break;
                }

              case 'children':
                {
                  break;
                }

              case 'dangerouslySetInnerHTML':
                {
                  if (nextProp != null) {
                    throw new Error('`dangerouslySetInnerHTML` does not make sense on <textarea>.');
                  }

                  break;
                }

              default:
                {
                  if (nextProp !== lastProp) setProp(domElement, tag, propKey, nextProp, nextProps, lastProp);
                }
            }
          }
        }

        updateTextarea(domElement, value, defaultValue);
        return;
      }

    case 'option':
      {
        for (const propKey in lastProps) {
          const lastProp = lastProps[propKey];

          if (lastProps.hasOwnProperty(propKey) && lastProp != null && !nextProps.hasOwnProperty(propKey)) {
            switch (propKey) {
              case 'selected':
                {
                  domElement.selected = false;
                  break;
                }

              default:
                {
                  setProp(domElement, tag, propKey, null, nextProps, lastProp);
                }
            }
          }
        }

        for (const propKey in nextProps) {
          const nextProp = nextProps[propKey];
          const lastProp = lastProps[propKey];

          if (nextProps.hasOwnProperty(propKey) && nextProp !== lastProp && (nextProp != null || lastProp != null)) {
            switch (propKey) {
              case 'selected':
                {
                  domElement.selected = nextProp && typeof nextProp !== 'function' && typeof nextProp !== 'symbol';
                  break;
                }

              default:
                {
                  setProp(domElement, tag, propKey, nextProp, nextProps, lastProp);
                }
            }
          }
        }

        return;
      }

    case 'img':
    case 'link':
    case 'area':
    case 'base':
    case 'br':
    case 'col':
    case 'embed':
    case 'hr':
    case 'keygen':
    case 'meta':
    case 'param':
    case 'source':
    case 'track':
    case 'wbr':
    case 'menuitem':
      {
        for (const propKey in lastProps) {
          const lastProp = lastProps[propKey];

          if (lastProps.hasOwnProperty(propKey) && lastProp != null && !nextProps.hasOwnProperty(propKey)) {
            setProp(domElement, tag, propKey, null, nextProps, lastProp);
          }
        }

        for (const propKey in nextProps) {
          const nextProp = nextProps[propKey];
          const lastProp = lastProps[propKey];

          if (nextProps.hasOwnProperty(propKey) && nextProp !== lastProp && (nextProp != null || lastProp != null)) {
            switch (propKey) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                {
                  if (nextProp != null) {
                    throw new Error(`${tag} is a void element tag and must neither have \`children\` nor ` + 'use `dangerouslySetInnerHTML`.');
                  }

                  break;
                }

              default:
                {
                  setProp(domElement, tag, propKey, nextProp, nextProps, lastProp);
                }
            }
          }
        }

        return;
      }

    default:
      {
        if (isCustomElement(tag)) {
          for (const propKey in lastProps) {
            const lastProp = lastProps[propKey];

            if (lastProps.hasOwnProperty(propKey) && lastProp !== undefined && !nextProps.hasOwnProperty(propKey)) {
              setPropOnCustomElement(domElement, tag, propKey, undefined, nextProps, lastProp);
            }
          }

          for (const propKey in nextProps) {
            const nextProp = nextProps[propKey];
            const lastProp = lastProps[propKey];

            if (nextProps.hasOwnProperty(propKey) && nextProp !== lastProp && (nextProp !== undefined || lastProp !== undefined)) {
              setPropOnCustomElement(domElement, tag, propKey, nextProp, nextProps, lastProp);
            }
          }

          return;
        }
      }
  }

  for (const propKey in lastProps) {
    const lastProp = lastProps[propKey];

    if (lastProps.hasOwnProperty(propKey) && lastProp != null && !nextProps.hasOwnProperty(propKey)) {
      setProp(domElement, tag, propKey, null, nextProps, lastProp);
    }
  }

  for (const propKey in nextProps) {
    const nextProp = nextProps[propKey];
    const lastProp = lastProps[propKey];

    if (nextProps.hasOwnProperty(propKey) && nextProp !== lastProp && (nextProp != null || lastProp != null)) {
      setProp(domElement, tag, propKey, nextProp, nextProps, lastProp);
    }
  }
}

function getPossibleStandardName(propName) {
  {
    const lowerCasedName = propName.toLowerCase();

    if (!possibleStandardNames.hasOwnProperty(lowerCasedName)) {
      return null;
    }

    return possibleStandardNames[lowerCasedName] || null;
  }
}

function getPropNameFromAttributeName(attrName) {
  switch (attrName) {
    case 'class':
      return 'className';

    case 'for':
      return 'htmlFor';

    default:
      return attrName;
  }
}

function getPropsFromElement(domElement) {
  const serverDifferences = {};
  const attributes = domElement.attributes;

  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i];
    serverDifferences[getPropNameFromAttributeName(attr.name)] = attr.name.toLowerCase() === 'style' ? getStylesObjectFromElement(domElement) : attr.value;
  }

  return serverDifferences;
}

function getStylesObjectFromElement(domElement) {
  const serverValueInObjectForm = {};
  const style = domElement.style;

  for (let i = 0; i < style.length; i++) {
    const styleName = style[i];
    serverValueInObjectForm[styleName] = style.getPropertyValue(styleName);
  }

  return serverValueInObjectForm;
}

function diffHydratedStyles(domElement, value, serverDifferences) {
  if (value != null && typeof value !== 'object') {
    {
      console.error('The `style` prop expects a mapping from style properties to values, ' + "not a string. For example, style={{marginRight: spacing + 'em'}} when " + 'using JSX.');
    }

    return;
  }

  if (canDiffStyleForHydrationWarning) {
    const clientValue = createDangerousStringForStyles(value);
    const serverValue = domElement.getAttribute('style');

    if (serverValue === clientValue) {
      return;
    }

    const normalizedClientValue = normalizeMarkupForTextOrAttribute(clientValue);
    const normalizedServerValue = normalizeMarkupForTextOrAttribute(serverValue);

    if (normalizedServerValue === normalizedClientValue) {
      return;
    }

    serverDifferences.style = getStylesObjectFromElement(domElement);
  }
}

function hydrateAttribute(domElement, propKey, attributeName, value, extraAttributes, serverDifferences) {
  extraAttributes.delete(attributeName);
  const serverValue = domElement.getAttribute(attributeName);

  if (serverValue === null) {
    switch (typeof value) {
      case 'undefined':
      case 'function':
      case 'symbol':
      case 'boolean':
        return;
    }
  } else {
    if (value == null) ; else {
      switch (typeof value) {
        case 'function':
        case 'symbol':
        case 'boolean':
          break;

        default:
          {
            {
              checkAttributeStringCoercion(value, propKey);
            }

            if (serverValue === '' + value) {
              return;
            }
          }
      }
    }
  }

  warnForPropDifference(propKey, serverValue, value, serverDifferences);
}

function hydrateBooleanAttribute(domElement, propKey, attributeName, value, extraAttributes, serverDifferences) {
  extraAttributes.delete(attributeName);
  const serverValue = domElement.getAttribute(attributeName);

  if (serverValue === null) {
    switch (typeof value) {
      case 'function':
      case 'symbol':
        return;
    }

    if (!value) {
      return;
    }
  } else {
    switch (typeof value) {
      case 'function':
      case 'symbol':
        break;

      default:
        {
          if (value) {
            return;
          }
        }
    }
  }

  warnForPropDifference(propKey, serverValue, value, serverDifferences);
}

function hydrateOverloadedBooleanAttribute(domElement, propKey, attributeName, value, extraAttributes, serverDifferences) {
  extraAttributes.delete(attributeName);
  const serverValue = domElement.getAttribute(attributeName);

  if (serverValue === null) {
    switch (typeof value) {
      case 'undefined':
      case 'function':
      case 'symbol':
        return;

      default:
        if (value === false) {
          return;
        }

    }
  } else {
    if (value == null) ; else {
      switch (typeof value) {
        case 'function':
        case 'symbol':
          break;

        case 'boolean':
          if (value === true && serverValue === '') {
            return;
          }

          break;

        default:
          {
            {
              checkAttributeStringCoercion(value, propKey);
            }

            if (serverValue === '' + value) {
              return;
            }
          }
      }
    }
  }

  warnForPropDifference(propKey, serverValue, value, serverDifferences);
}

function hydrateBooleanishAttribute(domElement, propKey, attributeName, value, extraAttributes, serverDifferences) {
  extraAttributes.delete(attributeName);
  const serverValue = domElement.getAttribute(attributeName);

  if (serverValue === null) {
    switch (typeof value) {
      case 'undefined':
      case 'function':
      case 'symbol':
        return;
    }
  } else {
    if (value == null) ; else {
      switch (typeof value) {
        case 'function':
        case 'symbol':
          break;

        default:
          {
            {
              checkAttributeStringCoercion(value, attributeName);
            }

            if (serverValue === '' + value) {
              return;
            }
          }
      }
    }
  }

  warnForPropDifference(propKey, serverValue, value, serverDifferences);
}

function hydrateNumericAttribute(domElement, propKey, attributeName, value, extraAttributes, serverDifferences) {
  extraAttributes.delete(attributeName);
  const serverValue = domElement.getAttribute(attributeName);

  if (serverValue === null) {
    switch (typeof value) {
      case 'undefined':
      case 'function':
      case 'symbol':
      case 'boolean':
        return;

      default:
        if (isNaN(value)) {
          return;
        }

    }
  } else {
    if (value == null) ; else {
      switch (typeof value) {
        case 'function':
        case 'symbol':
        case 'boolean':
          break;

        default:
          {
            if (isNaN(value)) {
              break;
            }

            {
              checkAttributeStringCoercion(value, propKey);
            }

            if (serverValue === '' + value) {
              return;
            }
          }
      }
    }
  }

  warnForPropDifference(propKey, serverValue, value, serverDifferences);
}

function hydratePositiveNumericAttribute(domElement, propKey, attributeName, value, extraAttributes, serverDifferences) {
  extraAttributes.delete(attributeName);
  const serverValue = domElement.getAttribute(attributeName);

  if (serverValue === null) {
    switch (typeof value) {
      case 'undefined':
      case 'function':
      case 'symbol':
      case 'boolean':
        return;

      default:
        if (isNaN(value) || value < 1) {
          return;
        }

    }
  } else {
    if (value == null) ; else {
      switch (typeof value) {
        case 'function':
        case 'symbol':
        case 'boolean':
          break;

        default:
          {
            if (isNaN(value) || value < 1) {
              break;
            }

            {
              checkAttributeStringCoercion(value, propKey);
            }

            if (serverValue === '' + value) {
              return;
            }
          }
      }
    }
  }

  warnForPropDifference(propKey, serverValue, value, serverDifferences);
}

function hydrateSanitizedAttribute(domElement, propKey, attributeName, value, extraAttributes, serverDifferences) {
  extraAttributes.delete(attributeName);
  const serverValue = domElement.getAttribute(attributeName);

  if (serverValue === null) {
    switch (typeof value) {
      case 'undefined':
      case 'function':
      case 'symbol':
      case 'boolean':
        return;
    }
  } else {
    if (value == null) ; else {
      switch (typeof value) {
        case 'function':
        case 'symbol':
        case 'boolean':
          break;

        default:
          {
            {
              checkAttributeStringCoercion(value, propKey);
            }

            const sanitizedValue = sanitizeURL('' + value);

            if (serverValue === sanitizedValue) {
              return;
            }
          }
      }
    }
  }

  warnForPropDifference(propKey, serverValue, value, serverDifferences);
}

function diffHydratedCustomComponent(domElement, tag, props, hostContext, extraAttributes, serverDifferences) {
  for (const propKey in props) {
    if (!props.hasOwnProperty(propKey)) {
      continue;
    }

    const value = props[propKey];

    if (value == null) {
      continue;
    }

    if (registrationNameDependencies.hasOwnProperty(propKey)) {
      if (typeof value !== 'function') {
        warnForInvalidEventListener(propKey, value);
      }

      continue;
    }

    if (props.suppressHydrationWarning === true) {
      continue;
    }

    switch (propKey) {
      case 'children':
        {
          if (typeof value === 'string' || typeof value === 'number') {
            warnForPropDifference('children', domElement.textContent, value, serverDifferences);
          }

          continue;
        }

      case 'suppressContentEditableWarning':
      case 'suppressHydrationWarning':
      case 'defaultValue':
      case 'defaultChecked':
      case 'innerHTML':
      case 'ref':
        continue;

      case 'dangerouslySetInnerHTML':
        const serverHTML = domElement.innerHTML;
        const nextHtml = value ? value.__html : undefined;

        if (nextHtml != null) {
          const expectedHTML = normalizeHTML(domElement, nextHtml);
          warnForPropDifference(propKey, serverHTML, expectedHTML, serverDifferences);
        }

        continue;

      case 'style':
        extraAttributes.delete(propKey);
        diffHydratedStyles(domElement, value, serverDifferences);
        continue;

      case 'offsetParent':
      case 'offsetTop':
      case 'offsetLeft':
      case 'offsetWidth':
      case 'offsetHeight':
      case 'isContentEditable':
      case 'outerText':
      case 'outerHTML':
        extraAttributes.delete(propKey.toLowerCase());

        {
          console.error('Assignment to read-only property will result in a no-op: `%s`', propKey);
        }

        continue;

      case 'className':
        extraAttributes.delete('class');
        const serverValue = getValueForAttributeOnCustomComponent(domElement, 'class', value);
        warnForPropDifference('className', serverValue, value, serverDifferences);
        continue;

      default:
        {
          const hostContextDev = hostContext;
          const hostContextProd = hostContextDev.context;

          if (hostContextProd === HostContextNamespaceNone && tag !== 'svg' && tag !== 'math') {
            extraAttributes.delete(propKey.toLowerCase());
          } else {
            extraAttributes.delete(propKey);
          }

          const valueOnCustomComponent = getValueForAttributeOnCustomComponent(domElement, propKey, value);
          warnForPropDifference(propKey, valueOnCustomComponent, value, serverDifferences);
        }
    }
  }
}

const EXPECTED_FORM_ACTION_URL = "javascript:throw new Error('React form unexpectedly submitted.')";

function diffHydratedGenericElement(domElement, tag, props, hostContext, extraAttributes, serverDifferences) {
  for (const propKey in props) {
    if (!props.hasOwnProperty(propKey)) {
      continue;
    }

    const value = props[propKey];

    if (value == null) {
      continue;
    }

    if (registrationNameDependencies.hasOwnProperty(propKey)) {
      if (typeof value !== 'function') {
        warnForInvalidEventListener(propKey, value);
      }

      continue;
    }

    if (props.suppressHydrationWarning === true) {
      continue;
    }

    switch (propKey) {
      case 'children':
        {
          if (typeof value === 'string' || typeof value === 'number') {
            warnForPropDifference('children', domElement.textContent, value, serverDifferences);
          }

          continue;
        }

      case 'suppressContentEditableWarning':
      case 'suppressHydrationWarning':
      case 'value':
      case 'checked':
      case 'selected':
      case 'defaultValue':
      case 'defaultChecked':
      case 'innerHTML':
      case 'ref':
        continue;

      case 'dangerouslySetInnerHTML':
        const serverHTML = domElement.innerHTML;
        const nextHtml = value ? value.__html : undefined;

        if (nextHtml != null) {
          const expectedHTML = normalizeHTML(domElement, nextHtml);

          if (serverHTML !== expectedHTML) {
            serverDifferences[propKey] = {
              __html: serverHTML
            };
          }
        }

        continue;

      case 'className':
        hydrateAttribute(domElement, propKey, 'class', value, extraAttributes, serverDifferences);
        continue;

      case 'tabIndex':
        hydrateAttribute(domElement, propKey, 'tabindex', value, extraAttributes, serverDifferences);
        continue;

      case 'style':
        extraAttributes.delete(propKey);
        diffHydratedStyles(domElement, value, serverDifferences);
        continue;

      case 'multiple':
        {
          extraAttributes.delete(propKey);
          const serverValue = domElement.multiple;
          warnForPropDifference(propKey, serverValue, value, serverDifferences);
          continue;
        }

      case 'muted':
        {
          extraAttributes.delete(propKey);
          const serverValue = domElement.muted;
          warnForPropDifference(propKey, serverValue, value, serverDifferences);
          continue;
        }

      case 'autoFocus':
        {
          extraAttributes.delete('autofocus');
          const serverValue = domElement.autofocus;
          warnForPropDifference(propKey, serverValue, value, serverDifferences);
          continue;
        }

      case 'data':
        if (tag !== 'object') {
          extraAttributes.delete(propKey);
          const serverValue = domElement.getAttribute('data');
          warnForPropDifference(propKey, serverValue, value, serverDifferences);
          continue;
        }

      case 'src':
      case 'href':
        {
          if (value === '' && !(tag === 'a' && propKey === 'href') && !(tag === 'object' && propKey === 'data')) {
            {
              if (propKey === 'src') {
                console.error('An empty string ("") was passed to the %s attribute. ' + 'This may cause the browser to download the whole page again over the network. ' + 'To fix this, either do not render the element at all ' + 'or pass null to %s instead of an empty string.', propKey, propKey);
              } else {
                console.error('An empty string ("") was passed to the %s attribute. ' + 'To fix this, either do not render the element at all ' + 'or pass null to %s instead of an empty string.', propKey, propKey);
              }
            }

            hydrateSanitizedAttribute(domElement, propKey, propKey, null, extraAttributes, serverDifferences);
            continue;
          }
        }

        hydrateSanitizedAttribute(domElement, propKey, propKey, value, extraAttributes, serverDifferences);
        continue;

      case 'action':
      case 'formAction':
        {
          const serverValue = domElement.getAttribute(propKey);

          if (typeof value === 'function') {
            extraAttributes.delete(propKey.toLowerCase());

            if (propKey === 'formAction') {
              extraAttributes.delete('name');
              extraAttributes.delete('formenctype');
              extraAttributes.delete('formmethod');
              extraAttributes.delete('formtarget');
            } else {
              extraAttributes.delete('enctype');
              extraAttributes.delete('method');
              extraAttributes.delete('target');
            }

            continue;
          } else if (serverValue === EXPECTED_FORM_ACTION_URL) {
            extraAttributes.delete(propKey.toLowerCase());
            warnForPropDifference(propKey, 'function', value, serverDifferences);
            continue;
          }

          hydrateSanitizedAttribute(domElement, propKey, propKey.toLowerCase(), value, extraAttributes, serverDifferences);
          continue;
        }

      case 'xlinkHref':
        hydrateSanitizedAttribute(domElement, propKey, 'xlink:href', value, extraAttributes, serverDifferences);
        continue;

      case 'contentEditable':
        {
          hydrateBooleanishAttribute(domElement, propKey, 'contenteditable', value, extraAttributes, serverDifferences);
          continue;
        }

      case 'spellCheck':
        {
          hydrateBooleanishAttribute(domElement, propKey, 'spellcheck', value, extraAttributes, serverDifferences);
          continue;
        }

      case 'draggable':
      case 'autoReverse':
      case 'externalResourcesRequired':
      case 'focusable':
      case 'preserveAlpha':
        {
          hydrateBooleanishAttribute(domElement, propKey, propKey, value, extraAttributes, serverDifferences);
          continue;
        }

      case 'allowFullScreen':
      case 'async':
      case 'autoPlay':
      case 'controls':
      case 'default':
      case 'defer':
      case 'disabled':
      case 'disablePictureInPicture':
      case 'disableRemotePlayback':
      case 'formNoValidate':
      case 'hidden':
      case 'loop':
      case 'noModule':
      case 'noValidate':
      case 'open':
      case 'playsInline':
      case 'readOnly':
      case 'required':
      case 'reversed':
      case 'scoped':
      case 'seamless':
      case 'itemScope':
        {
          hydrateBooleanAttribute(domElement, propKey, propKey.toLowerCase(), value, extraAttributes, serverDifferences);
          continue;
        }

      case 'capture':
      case 'download':
        {
          hydrateOverloadedBooleanAttribute(domElement, propKey, propKey, value, extraAttributes, serverDifferences);
          continue;
        }

      case 'cols':
      case 'rows':
      case 'size':
      case 'span':
        {
          hydratePositiveNumericAttribute(domElement, propKey, propKey, value, extraAttributes, serverDifferences);
          continue;
        }

      case 'rowSpan':
        {
          hydrateNumericAttribute(domElement, propKey, 'rowspan', value, extraAttributes, serverDifferences);
          continue;
        }

      case 'start':
        {
          hydrateNumericAttribute(domElement, propKey, propKey, value, extraAttributes, serverDifferences);
          continue;
        }

      case 'xHeight':
        hydrateAttribute(domElement, propKey, 'x-height', value, extraAttributes, serverDifferences);
        continue;

      case 'xlinkActuate':
        hydrateAttribute(domElement, propKey, 'xlink:actuate', value, extraAttributes, serverDifferences);
        continue;

      case 'xlinkArcrole':
        hydrateAttribute(domElement, propKey, 'xlink:arcrole', value, extraAttributes, serverDifferences);
        continue;

      case 'xlinkRole':
        hydrateAttribute(domElement, propKey, 'xlink:role', value, extraAttributes, serverDifferences);
        continue;

      case 'xlinkShow':
        hydrateAttribute(domElement, propKey, 'xlink:show', value, extraAttributes, serverDifferences);
        continue;

      case 'xlinkTitle':
        hydrateAttribute(domElement, propKey, 'xlink:title', value, extraAttributes, serverDifferences);
        continue;

      case 'xlinkType':
        hydrateAttribute(domElement, propKey, 'xlink:type', value, extraAttributes, serverDifferences);
        continue;

      case 'xmlBase':
        hydrateAttribute(domElement, propKey, 'xml:base', value, extraAttributes, serverDifferences);
        continue;

      case 'xmlLang':
        hydrateAttribute(domElement, propKey, 'xml:lang', value, extraAttributes, serverDifferences);
        continue;

      case 'xmlSpace':
        hydrateAttribute(domElement, propKey, 'xml:space', value, extraAttributes, serverDifferences);
        continue;

      case 'inert':
        {
          if (value === '' && !didWarnForNewBooleanPropsWithEmptyValue[propKey]) {
            didWarnForNewBooleanPropsWithEmptyValue[propKey] = true;
            console.error('Received an empty string for a boolean attribute `%s`. ' + 'This will treat the attribute as if it were false. ' + 'Either pass `false` to silence this warning, or ' + 'pass `true` if you used an empty string in earlier versions of React to indicate this attribute is true.', propKey);
          }
        }

        hydrateBooleanAttribute(domElement, propKey, propKey, value, extraAttributes, serverDifferences);
        continue;

      default:
        {
          if (propKey.length > 2 && (propKey[0] === 'o' || propKey[0] === 'O') && (propKey[1] === 'n' || propKey[1] === 'N')) {
            continue;
          }

          const attributeName = getAttributeAlias(propKey);
          let isMismatchDueToBadCasing = false;
          const hostContextDev = hostContext;
          const hostContextProd = hostContextDev.context;

          if (hostContextProd === HostContextNamespaceNone && tag !== 'svg' && tag !== 'math') {
            extraAttributes.delete(attributeName.toLowerCase());
          } else {
            const standardName = getPossibleStandardName(propKey);

            if (standardName !== null && standardName !== propKey) {
              isMismatchDueToBadCasing = true;
              extraAttributes.delete(standardName);
            }

            extraAttributes.delete(attributeName);
          }

          const serverValue = getValueForAttribute(domElement, attributeName, value);

          if (!isMismatchDueToBadCasing) {
            warnForPropDifference(propKey, serverValue, value, serverDifferences);
          }
        }
    }
  }
}

function hydrateProperties(domElement, tag, props, hostContext) {
  {
    validatePropertiesInDevelopment(tag, props);
  }

  switch (tag) {
    case 'dialog':
      listenToNonDelegatedEvent('cancel', domElement);
      listenToNonDelegatedEvent('close', domElement);
      break;

    case 'iframe':
    case 'object':
    case 'embed':
      listenToNonDelegatedEvent('load', domElement);
      break;

    case 'video':
    case 'audio':
      for (let i = 0; i < mediaEventTypes.length; i++) {
        listenToNonDelegatedEvent(mediaEventTypes[i], domElement);
      }

      break;

    case 'source':
      listenToNonDelegatedEvent('error', domElement);
      break;

    case 'img':
    case 'image':
    case 'link':
      listenToNonDelegatedEvent('error', domElement);
      listenToNonDelegatedEvent('load', domElement);
      break;

    case 'details':
      listenToNonDelegatedEvent('toggle', domElement);
      break;

    case 'input':
      {
        checkControlledValueProps('input', props);
      }

      listenToNonDelegatedEvent('invalid', domElement);
      validateInputProps(domElement, props);
      initInput(domElement, props.value, props.defaultValue, props.checked, props.defaultChecked, props.type, props.name, true);
      track(domElement);
      break;

    case 'option':
      validateOptionProps(domElement, props);
      break;

    case 'select':
      {
        checkControlledValueProps('select', props);
      }

      listenToNonDelegatedEvent('invalid', domElement);
      validateSelectProps(domElement, props);
      break;

    case 'textarea':
      {
        checkControlledValueProps('textarea', props);
      }

      listenToNonDelegatedEvent('invalid', domElement);
      validateTextareaProps(domElement, props);
      initTextarea(domElement, props.value, props.defaultValue, props.children);
      track(domElement);
      break;
  }

  const children = props.children;

  if (typeof children === 'string' || typeof children === 'number' || typeof children === 'bigint') {
    if (domElement.textContent !== '' + children && props.suppressHydrationWarning !== true && !checkForUnmatchedText(domElement.textContent, children)) {
      return false;
    }
  }

  if (props.popover != null) {
    listenToNonDelegatedEvent('beforetoggle', domElement);
    listenToNonDelegatedEvent('toggle', domElement);
  }

  if (props.onScroll != null) {
    listenToNonDelegatedEvent('scroll', domElement);
  }

  if (props.onScrollEnd != null) {
    listenToNonDelegatedEvent('scrollend', domElement);
  }

  if (props.onClick != null) {
    trapClickOnNonInteractiveElement(domElement);
  }

  return true;
}
function diffHydratedProperties(domElement, tag, props, hostContext) {
  const serverDifferences = {};

  {
    const extraAttributes = new Set();
    const attributes = domElement.attributes;

    for (let i = 0; i < attributes.length; i++) {
      const name = attributes[i].name.toLowerCase();

      switch (name) {
        case 'value':
          break;

        case 'checked':
          break;

        case 'selected':
          break;

        default:
          extraAttributes.add(attributes[i].name);
      }
    }

    if (isCustomElement(tag)) {
      diffHydratedCustomComponent(domElement, tag, props, hostContext, extraAttributes, serverDifferences);
    } else {
      diffHydratedGenericElement(domElement, tag, props, hostContext, extraAttributes, serverDifferences);
    }

    if (extraAttributes.size > 0 && props.suppressHydrationWarning !== true) {
      warnForExtraAttributes(domElement, extraAttributes, serverDifferences);
    }
  }

  if (Object.keys(serverDifferences).length === 0) {
    return null;
  }

  return serverDifferences;
}
function hydrateText(textNode, text, parentProps) {
  const isDifferent = textNode.nodeValue !== text;

  if (isDifferent && (parentProps === null || parentProps.suppressHydrationWarning !== true) && !checkForUnmatchedText(textNode.nodeValue, text)) {
    return false;
  }

  return true;
}
function diffHydratedText(textNode, text) {
  if (textNode.nodeValue === text) {
    return null;
  }

  const normalizedClientText = normalizeMarkupForTextOrAttribute(text);
  const normalizedServerText = normalizeMarkupForTextOrAttribute(textNode.nodeValue);

  if (normalizedServerText === normalizedClientText) {
    return null;
  }

  return textNode.nodeValue;
}
function restoreControlledState(domElement, tag, props) {
  switch (tag) {
    case 'input':
      restoreControlledInputState(domElement, props);
      return;

    case 'textarea':
      restoreControlledTextareaState(domElement, props);
      return;

    case 'select':
      restoreControlledSelectState(domElement, props);
      return;
  }
}

function validateLinkPropsForStyleResource(props) {
  {
    const {
      href,
      onLoad,
      onError,
      disabled
    } = props;
    const includedProps = [];
    if (onLoad) includedProps.push('`onLoad`');
    if (onError) includedProps.push('`onError`');
    if (disabled != null) includedProps.push('`disabled`');
    let includedPropsPhrase = propNamesListJoin(includedProps, 'and');
    includedPropsPhrase += includedProps.length === 1 ? ' prop' : ' props';
    const withArticlePhrase = includedProps.length === 1 ? 'an ' + includedPropsPhrase : 'the ' + includedPropsPhrase;

    if (includedProps.length) {
      console.error('React encountered a <link rel="stylesheet" href="%s" ... /> with a `precedence` prop that' + ' also included %s. The presence of loading and error handlers indicates an intent to manage' + ' the stylesheet loading state from your from your Component code and React will not hoist or' + ' deduplicate this stylesheet. If your intent was to have React hoist and deduplciate this stylesheet' + ' using the `precedence` prop remove the %s, otherwise remove the `precedence` prop.', href, withArticlePhrase, includedPropsPhrase);
      return true;
    }
  }

  return false;
}

function propNamesListJoin(list, combinator) {
  switch (list.length) {
    case 0:
      return '';

    case 1:
      return list[0];

    case 2:
      return list[0] + ' ' + combinator + ' ' + list[1];

    default:
      return list.slice(0, -1).join(', ') + ', ' + combinator + ' ' + list[list.length - 1];
  }
}

const rendererPackageName = 'react-dom';
const SUPPRESS_HYDRATION_WARNING = 'suppressHydrationWarning';
const SUSPENSE_START_DATA = '$';
const SUSPENSE_END_DATA = '/$';
const SUSPENSE_PENDING_START_DATA = '$?';
const SUSPENSE_FALLBACK_START_DATA = '$!';
const FORM_STATE_IS_MATCHING = 'F!';
const FORM_STATE_IS_NOT_MATCHING = 'F';
const STYLE = 'style';
const HostContextNamespaceNone = 0;
const HostContextNamespaceSvg = 1;
const HostContextNamespaceMath = 2;
let eventsEnabled = null;
let selectionInformation = null;

function getOwnerDocumentFromRootContainer(rootContainerElement) {
  return rootContainerElement.nodeType === DOCUMENT_NODE ? rootContainerElement : rootContainerElement.ownerDocument;
}

function getRootHostContext(rootContainerInstance) {
  let type;
  let context;
  const nodeType = rootContainerInstance.nodeType;

  switch (nodeType) {
    case DOCUMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE:
      {
        type = nodeType === DOCUMENT_NODE ? '#document' : '#fragment';
        const root = rootContainerInstance.documentElement;

        if (root) {
          const namespaceURI = root.namespaceURI;
          context = namespaceURI ? getOwnHostContext(namespaceURI) : HostContextNamespaceNone;
        } else {
          context = HostContextNamespaceNone;
        }

        break;
      }

    default:
      {
        const container = nodeType === COMMENT_NODE ? rootContainerInstance.parentNode : rootContainerInstance;
        type = container.tagName;
        const namespaceURI = container.namespaceURI;

        if (!namespaceURI) {
          switch (type) {
            case 'svg':
              context = HostContextNamespaceSvg;
              break;

            case 'math':
              context = HostContextNamespaceMath;
              break;

            default:
              context = HostContextNamespaceNone;
              break;
          }
        } else {
          const ownContext = getOwnHostContext(namespaceURI);
          context = getChildHostContextProd(ownContext, type);
        }

        break;
      }
  }

  {
    const validatedTag = type.toLowerCase();
    const ancestorInfo = updatedAncestorInfoDev(null, validatedTag);
    return {
      context,
      ancestorInfo
    };
  }
}

function getOwnHostContext(namespaceURI) {
  switch (namespaceURI) {
    case SVG_NAMESPACE:
      return HostContextNamespaceSvg;

    case MATH_NAMESPACE:
      return HostContextNamespaceMath;

    default:
      return HostContextNamespaceNone;
  }
}

function getChildHostContextProd(parentNamespace, type) {
  if (parentNamespace === HostContextNamespaceNone) {
    switch (type) {
      case 'svg':
        return HostContextNamespaceSvg;

      case 'math':
        return HostContextNamespaceMath;

      default:
        return HostContextNamespaceNone;
    }
  }

  if (parentNamespace === HostContextNamespaceSvg && type === 'foreignObject') {
    return HostContextNamespaceNone;
  }

  return parentNamespace;
}

function getChildHostContext(parentHostContext, type) {
  {
    const parentHostContextDev = parentHostContext;
    const context = getChildHostContextProd(parentHostContextDev.context, type);
    const ancestorInfo = updatedAncestorInfoDev(parentHostContextDev.ancestorInfo, type);
    return {
      context,
      ancestorInfo
    };
  }
}
function getPublicInstance(instance) {
  return instance;
}
function prepareForCommit(containerInfo) {
  eventsEnabled = isEnabled();
  selectionInformation = getSelectionInformation(containerInfo);
  let activeInstance = null;

  setEnabled(false);
  return activeInstance;
}
function resetAfterCommit(containerInfo) {
  restoreSelection(selectionInformation, containerInfo);
  setEnabled(eventsEnabled);
  eventsEnabled = null;
  selectionInformation = null;
}
function createHoistableInstance(type, props, rootContainerInstance, internalInstanceHandle) {
  const ownerDocument = getOwnerDocumentFromRootContainer(rootContainerInstance);
  const domElement = ownerDocument.createElement(type);
  precacheFiberNode(internalInstanceHandle, domElement);
  updateFiberProps(domElement, props);
  setInitialProperties(domElement, type, props);
  markNodeAsHoistable(domElement);
  return domElement;
}
const warnedUnknownTags = {
  dialog: true,
  webview: true
};
function createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
  let hostContextProd;

  {
    const hostContextDev = hostContext;
    validateDOMNesting(type, hostContextDev.ancestorInfo);
    hostContextProd = hostContextDev.context;
  }

  const ownerDocument = getOwnerDocumentFromRootContainer(rootContainerInstance);
  let domElement;

  switch (hostContextProd) {
    case HostContextNamespaceSvg:
      domElement = ownerDocument.createElementNS(SVG_NAMESPACE, type);
      break;

    case HostContextNamespaceMath:
      domElement = ownerDocument.createElementNS(MATH_NAMESPACE, type);
      break;

    default:
      switch (type) {
        case 'svg':
          {
            domElement = ownerDocument.createElementNS(SVG_NAMESPACE, type);
            break;
          }

        case 'math':
          {
            domElement = ownerDocument.createElementNS(MATH_NAMESPACE, type);
            break;
          }

        case 'script':
          {
            const div = ownerDocument.createElement('div');

            div.innerHTML = '<script><' + '/script>';
            const firstChild = div.firstChild;
            domElement = div.removeChild(firstChild);
            break;
          }

        case 'select':
          {
            if (typeof props.is === 'string') {
              domElement = ownerDocument.createElement('select', {
                is: props.is
              });
            } else {
              domElement = ownerDocument.createElement('select');
            }

            if (props.multiple) {
              domElement.multiple = true;
            } else if (props.size) {
              domElement.size = props.size;
            }

            break;
          }

        default:
          {
            if (typeof props.is === 'string') {
              domElement = ownerDocument.createElement(type, {
                is: props.is
              });
            } else {
              domElement = ownerDocument.createElement(type);
            }

            {
              if (type.indexOf('-') === -1) {
                if (type !== type.toLowerCase()) {
                  console.error('<%s /> is using incorrect casing. ' + 'Use PascalCase for React components, ' + 'or lowercase for HTML elements.', type);
                }

                if (Object.prototype.toString.call(domElement) === '[object HTMLUnknownElement]' && !hasOwnProperty.call(warnedUnknownTags, type)) {
                  warnedUnknownTags[type] = true;
                  console.error('The tag <%s> is unrecognized in this browser. ' + 'If you meant to render a React component, start its name with ' + 'an uppercase letter.', type);
                }
              }
            }
          }
      }

  }

  precacheFiberNode(internalInstanceHandle, domElement);
  updateFiberProps(domElement, props);
  return domElement;
}
function appendInitialChild(parentInstance, child) {
  parentInstance.appendChild(child);
}
function finalizeInitialChildren(domElement, type, props, hostContext) {
  setInitialProperties(domElement, type, props);

  switch (type) {
    case 'button':
    case 'input':
    case 'select':
    case 'textarea':
      return !!props.autoFocus;

    case 'img':
      return true;

    default:
      return false;
  }
}
function shouldSetTextContent(type, props) {
  return type === 'textarea' || type === 'noscript' || typeof props.children === 'string' || typeof props.children === 'number' || typeof props.children === 'bigint' || typeof props.dangerouslySetInnerHTML === 'object' && props.dangerouslySetInnerHTML !== null && props.dangerouslySetInnerHTML.__html != null;
}
function createTextInstance(text, rootContainerInstance, hostContext, internalInstanceHandle) {
  {
    const hostContextDev = hostContext;
    const ancestor = hostContextDev.ancestorInfo.current;

    if (ancestor != null) {
      validateTextNesting(text, ancestor.tag);
    }
  }

  const textNode = getOwnerDocumentFromRootContainer(rootContainerInstance).createTextNode(text);
  precacheFiberNode(internalInstanceHandle, textNode);
  return textNode;
}
let currentPopstateTransitionEvent = null;
function shouldAttemptEagerTransition() {
  const event = window.event;

  if (event && event.type === 'popstate') {
    if (event === currentPopstateTransitionEvent) {
      return false;
    } else {
      currentPopstateTransitionEvent = event;
      return true;
    }
  }

  currentPopstateTransitionEvent = null;
  return false;
}
const scheduleTimeout = typeof setTimeout === 'function' ? setTimeout : undefined;
const cancelTimeout = typeof clearTimeout === 'function' ? clearTimeout : undefined;
const noTimeout = -1;
const localPromise = typeof Promise === 'function' ? Promise : undefined;
function preparePortalMount(portalInstance) {
  listenToAllSupportedEvents(portalInstance);
}
const scheduleMicrotask = typeof queueMicrotask === 'function' ? queueMicrotask : typeof localPromise !== 'undefined' ? callback => localPromise.resolve(null).then(callback).catch(handleErrorInNextTick) : scheduleTimeout;

function handleErrorInNextTick(error) {
  setTimeout(() => {
    throw error;
  });
}
function commitMount(domElement, type, newProps, internalInstanceHandle) {
  switch (type) {
    case 'button':
    case 'input':
    case 'select':
    case 'textarea':
      if (newProps.autoFocus) {
        domElement.focus();
      }

      return;

    case 'img':
      {
        if (newProps.src) {
          domElement.src = newProps.src;
        } else if (newProps.srcSet) {
          domElement.srcset = newProps.srcSet;
        }

        return;
      }
  }
}
function commitUpdate(domElement, type, oldProps, newProps, internalInstanceHandle) {
  updateProperties(domElement, type, oldProps, newProps);
  updateFiberProps(domElement, newProps);
}
function resetTextContent(domElement) {
  setTextContent(domElement, '');
}
function commitTextUpdate(textInstance, oldText, newText) {
  textInstance.nodeValue = newText;
}
function appendChild(parentInstance, child) {
  parentInstance.appendChild(child);
}
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

  if ((reactRootContainer === null || reactRootContainer === undefined) && parentNode.onclick === null) {
    trapClickOnNonInteractiveElement(parentNode);
  }
}
function insertBefore(parentInstance, child, beforeChild) {
  parentInstance.insertBefore(child, beforeChild);
}
function insertInContainerBefore(container, child, beforeChild) {
  if (container.nodeType === COMMENT_NODE) {
    container.parentNode.insertBefore(child, beforeChild);
  } else {
    container.insertBefore(child, beforeChild);
  }
}

function removeChild(parentInstance, child) {
  parentInstance.removeChild(child);
}
function removeChildFromContainer(container, child) {
  if (container.nodeType === COMMENT_NODE) {
    container.parentNode.removeChild(child);
  } else {
    container.removeChild(child);
  }
}
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
function clearSuspenseBoundaryFromContainer(container, suspenseInstance) {
  if (container.nodeType === COMMENT_NODE) {
    clearSuspenseBoundary(container.parentNode, suspenseInstance);
  } else if (container.nodeType === ELEMENT_NODE) {
    clearSuspenseBoundary(container, suspenseInstance);
  } else ;

  retryIfBlockedOn(container);
}
function hideInstance(instance) {
  instance = instance;
  const style = instance.style;

  if (typeof style.setProperty === 'function') {
    style.setProperty('display', 'none', 'important');
  } else {
    style.display = 'none';
  }
}
function hideTextInstance(textInstance) {
  textInstance.nodeValue = '';
}
function unhideInstance(instance, props) {
  instance = instance;
  const styleProp = props[STYLE];
  const display = styleProp !== undefined && styleProp !== null && styleProp.hasOwnProperty('display') ? styleProp.display : null;
  instance.style.display = display == null || typeof display === 'boolean' ? '' : ('' + display).trim();
}
function unhideTextInstance(textInstance, text) {
  textInstance.nodeValue = text;
}
function clearContainer(container) {
  const nodeType = container.nodeType;

  if (nodeType === DOCUMENT_NODE) {
    clearContainerSparingly(container);
  } else if (nodeType === ELEMENT_NODE) {
    switch (container.nodeName) {
      case 'HEAD':
      case 'HTML':
      case 'BODY':
        clearContainerSparingly(container);
        return;

      default:
        {
          container.textContent = '';
        }
    }
  }
}

function clearContainerSparingly(container) {
  let node;
  let nextNode = container.firstChild;

  if (nextNode && nextNode.nodeType === DOCUMENT_TYPE_NODE) {
    nextNode = nextNode.nextSibling;
  }

  while (nextNode) {
    node = nextNode;
    nextNode = nextNode.nextSibling;

    switch (node.nodeName) {
      case 'HTML':
      case 'HEAD':
      case 'BODY':
        {
          const element = node;
          clearContainerSparingly(element);
          detachDeletedInstance(element);
          continue;
        }

      case 'SCRIPT':
      case 'STYLE':
        {
          continue;
        }

      case 'LINK':
        {
          if (node.rel.toLowerCase() === 'stylesheet') {
            continue;
          }
        }
    }

    container.removeChild(node);
  }

  return;
}
function canHydrateInstance(instance, type, props, inRootOrSingleton) {
  while (instance.nodeType === ELEMENT_NODE) {
    const element = instance;
    const anyProps = props;

    if (element.nodeName.toLowerCase() !== type.toLowerCase()) {
      if (!inRootOrSingleton) {
        if (element.nodeName === 'INPUT' && element.type === 'hidden') ; else {
          return null;
        }
      }
    } else if (!inRootOrSingleton) {
      if (type === 'input' && element.type === 'hidden') {
        {
          checkAttributeStringCoercion(anyProps.name, 'name');
        }

        const name = anyProps.name == null ? null : '' + anyProps.name;

        if (anyProps.type !== 'hidden' || element.getAttribute('name') !== name) ; else {
          return element;
        }
      } else {
        return element;
      }
    } else if (isMarkedHoistable(element)) ; else {
      switch (type) {
        case 'meta':
          {
            if (!element.hasAttribute('itemprop')) {
              break;
            }

            return element;
          }

        case 'link':
          {
            const rel = element.getAttribute('rel');

            if (rel === 'stylesheet' && element.hasAttribute('data-precedence')) {
              break;
            } else if (rel !== anyProps.rel || element.getAttribute('href') !== (anyProps.href == null ? null : anyProps.href) || element.getAttribute('crossorigin') !== (anyProps.crossOrigin == null ? null : anyProps.crossOrigin) || element.getAttribute('title') !== (anyProps.title == null ? null : anyProps.title)) {
              break;
            }

            return element;
          }

        case 'style':
          {
            if (element.hasAttribute('data-precedence')) {
              break;
            }

            return element;
          }

        case 'script':
          {
            const srcAttr = element.getAttribute('src');

            if (srcAttr !== (anyProps.src == null ? null : anyProps.src) || element.getAttribute('type') !== (anyProps.type == null ? null : anyProps.type) || element.getAttribute('crossorigin') !== (anyProps.crossOrigin == null ? null : anyProps.crossOrigin)) {
              if (srcAttr && element.hasAttribute('async') && !element.hasAttribute('itemprop')) {
                break;
              }
            }

            return element;
          }

        default:
          {
            return element;
          }
      }
    }

    const nextInstance = getNextHydratableSibling(element);

    if (nextInstance === null) {
      break;
    }

    instance = nextInstance;
  }

  return null;
}
function canHydrateTextInstance(instance, text, inRootOrSingleton) {
  if (text === '') return null;

  while (instance.nodeType !== TEXT_NODE) {
    if (instance.nodeType === ELEMENT_NODE && instance.nodeName === 'INPUT' && instance.type === 'hidden') ; else if (!inRootOrSingleton) {
      return null;
    }

    const nextInstance = getNextHydratableSibling(instance);

    if (nextInstance === null) {
      return null;
    }

    instance = nextInstance;
  }

  return instance;
}
function canHydrateSuspenseInstance(instance, inRootOrSingleton) {
  while (instance.nodeType !== COMMENT_NODE) {
    if (!inRootOrSingleton) {
      return null;
    }

    const nextInstance = getNextHydratableSibling(instance);

    if (nextInstance === null) {
      return null;
    }

    instance = nextInstance;
  }

  return instance;
}
function isSuspenseInstancePending(instance) {
  return instance.data === SUSPENSE_PENDING_START_DATA;
}
function isSuspenseInstanceFallback(instance) {
  return instance.data === SUSPENSE_FALLBACK_START_DATA;
}
function getSuspenseInstanceFallbackErrorDetails(instance) {
  const dataset = instance.nextSibling && instance.nextSibling.dataset;
  let digest, message, stack, componentStack;

  if (dataset) {
    digest = dataset.dgst;

    {
      message = dataset.msg;
      stack = dataset.stck;
      componentStack = dataset.cstck;
    }
  }

  {
    return {
      message,
      digest,
      stack,
      componentStack
    };
  }
}
function registerSuspenseInstanceRetry(instance, callback) {
  instance._reactRetry = callback;
}
function canHydrateFormStateMarker(instance, inRootOrSingleton) {
  while (instance.nodeType !== COMMENT_NODE) {
    if (!inRootOrSingleton) {
      return null;
    }

    const nextInstance = getNextHydratableSibling(instance);

    if (nextInstance === null) {
      return null;
    }

    instance = nextInstance;
  }

  const nodeData = instance.data;

  if (nodeData === FORM_STATE_IS_MATCHING || nodeData === FORM_STATE_IS_NOT_MATCHING) {
    const markerInstance = instance;
    return markerInstance;
  }

  return null;
}
function isFormStateMarkerMatching(markerInstance) {
  return markerInstance.data === FORM_STATE_IS_MATCHING;
}

function getNextHydratable(node) {
  for (; node != null; node = node.nextSibling) {
    const nodeType = node.nodeType;

    if (nodeType === ELEMENT_NODE || nodeType === TEXT_NODE) {
      break;
    }

    if (nodeType === COMMENT_NODE) {
      const nodeData = node.data;

      if (nodeData === SUSPENSE_START_DATA || nodeData === SUSPENSE_FALLBACK_START_DATA || nodeData === SUSPENSE_PENDING_START_DATA || (nodeData === FORM_STATE_IS_MATCHING || nodeData === FORM_STATE_IS_NOT_MATCHING)) {
        break;
      }

      if (nodeData === SUSPENSE_END_DATA) {
        return null;
      }
    }
  }

  return node;
}

function getNextHydratableSibling(instance) {
  return getNextHydratable(instance.nextSibling);
}
function getFirstHydratableChild(parentInstance) {
  return getNextHydratable(parentInstance.firstChild);
}
function getFirstHydratableChildWithinContainer(parentContainer) {
  return getNextHydratable(parentContainer.firstChild);
}
function getFirstHydratableChildWithinSuspenseInstance(parentInstance) {
  return getNextHydratable(parentInstance.nextSibling);
}
function describeHydratableInstanceForDevWarnings(instance) {
  if (instance.nodeType === ELEMENT_NODE) {
    return {
      type: instance.nodeName.toLowerCase(),
      props: getPropsFromElement(instance)
    };
  } else if (instance.nodeType === COMMENT_NODE) {
    return {
      type: 'Suspense',
      props: {}
    };
  } else {
    return instance.nodeValue;
  }
}
function validateHydratableInstance(type, props, hostContext) {
  {
    const hostContextDev = hostContext;
    return validateDOMNesting(type, hostContextDev.ancestorInfo);
  }
}
function hydrateInstance(instance, type, props, hostContext, internalInstanceHandle) {
  precacheFiberNode(internalInstanceHandle, instance);
  updateFiberProps(instance, props);
  return hydrateProperties(instance, type, props);
}
function diffHydratedPropsForDevWarnings(instance, type, props, hostContext) {
  return diffHydratedProperties(instance, type, props, hostContext);
}
function validateHydratableTextInstance(text, hostContext) {
  {
    const hostContextDev = hostContext;
    const ancestor = hostContextDev.ancestorInfo.current;

    if (ancestor != null) {
      return validateTextNesting(text, ancestor.tag);
    }
  }

  return true;
}
function hydrateTextInstance(textInstance, text, internalInstanceHandle, parentInstanceProps) {
  precacheFiberNode(internalInstanceHandle, textInstance);
  return hydrateText(textInstance, text, parentInstanceProps);
}
function diffHydratedTextForDevWarnings(textInstance, text, parentProps) {
  if (parentProps === null || parentProps[SUPPRESS_HYDRATION_WARNING] !== true) {
    return diffHydratedText(textInstance, text);
  }

  return null;
}
function hydrateSuspenseInstance(suspenseInstance, internalInstanceHandle) {
  precacheFiberNode(internalInstanceHandle, suspenseInstance);
}
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
function commitHydratedContainer(container) {
  retryIfBlockedOn(container);
}
function commitHydratedSuspenseInstance(suspenseInstance) {
  retryIfBlockedOn(suspenseInstance);
}
function shouldDeleteUnhydratedTailInstances(parentType) {
  return parentType !== 'form' && parentType !== 'button';
}
function isHostSingletonType(type) {
  return type === 'html' || type === 'head' || type === 'body';
}
function resolveSingletonInstance(type, props, rootContainerInstance, hostContext, validateDOMNestingDev) {
  {
    const hostContextDev = hostContext;

    if (validateDOMNestingDev) {
      validateDOMNesting(type, hostContextDev.ancestorInfo);
    }
  }

  const ownerDocument = getOwnerDocumentFromRootContainer(rootContainerInstance);

  switch (type) {
    case 'html':
      {
        const documentElement = ownerDocument.documentElement;

        if (!documentElement) {
          throw new Error('React expected an <html> element (document.documentElement) to exist in the Document but one was' + ' not found. React never removes the documentElement for any Document it renders into so' + ' the cause is likely in some other script running on this page.');
        }

        return documentElement;
      }

    case 'head':
      {
        const head = ownerDocument.head;

        if (!head) {
          throw new Error('React expected a <head> element (document.head) to exist in the Document but one was' + ' not found. React never removes the head for any Document it renders into so' + ' the cause is likely in some other script running on this page.');
        }

        return head;
      }

    case 'body':
      {
        const body = ownerDocument.body;

        if (!body) {
          throw new Error('React expected a <body> element (document.body) to exist in the Document but one was' + ' not found. React never removes the body for any Document it renders into so' + ' the cause is likely in some other script running on this page.');
        }

        return body;
      }

    default:
      {
        throw new Error('resolveSingletonInstance was called with an element type that is not supported. This is a bug in React.');
      }
  }
}
function acquireSingletonInstance(type, props, instance, internalInstanceHandle) {
  {
    const currentInstanceHandle = getInstanceFromNode(instance);

    if (currentInstanceHandle) {
      const tagName = instance.tagName.toLowerCase();
      console.error('You are mounting a new %s component when a previous one has not first unmounted. It is an' + ' error to render more than one %s component at a time and attributes and children of these' + ' components will likely fail in unpredictable ways. Please only render a single instance of' + ' <%s> and if you need to mount a new one, ensure any previous ones have unmounted first.', tagName, tagName, tagName);
    }

    switch (type) {
      case 'html':
      case 'head':
      case 'body':
        {
          break;
        }

      default:
        {
          console.error('acquireSingletonInstance was called with an element type that is not supported. This is a bug in React.');
        }
    }
  }

  const attributes = instance.attributes;

  while (attributes.length) {
    instance.removeAttributeNode(attributes[0]);
  }

  setInitialProperties(instance, type, props);
  precacheFiberNode(internalInstanceHandle, instance);
  updateFiberProps(instance, props);
}
function releaseSingletonInstance(instance) {
  const attributes = instance.attributes;

  while (attributes.length) {
    instance.removeAttributeNode(attributes[0]);
  }

  detachDeletedInstance(instance);
}
function clearSingleton(instance) {
  const element = instance;
  let node = element.firstChild;

  while (node) {
    const nextNode = node.nextSibling;
    const nodeName = node.nodeName;

    if (isMarkedHoistable(node) || nodeName === 'HEAD' || nodeName === 'BODY' || nodeName === 'SCRIPT' || nodeName === 'STYLE' || nodeName === 'LINK' && node.rel.toLowerCase() === 'stylesheet') ; else {
      element.removeChild(node);
    }

    node = nextNode;
  }

  return;
}
const NotLoaded = 0b000;
const Loaded = 0b001;
const Errored = 0b010;
const Settled = 0b011;
const Inserted = 0b100;
function prepareToCommitHoistables() {
  tagCaches = null;
}
const preloadPropsMap = new Map();
const preconnectsSet = new Set();
function getHoistableRoot(container) {
  return typeof container.getRootNode === 'function' ? container.getRootNode() : container.ownerDocument;
}

function getCurrentResourceRoot() {
  const currentContainer = getCurrentRootHostContainer();
  return currentContainer ? getHoistableRoot(currentContainer) : null;
}

function getDocumentFromRoot(root) {
  return root.ownerDocument || root;
}

const previousDispatcher = ReactDOMSharedInternals.d;
ReactDOMSharedInternals.d = {
  f: flushSyncWork ,
  r: requestFormReset,
  D: prefetchDNS,
  C: preconnect,
  L: preload,
  m: preloadModule,
  X: preinitScript,
  S: preinitStyle,
  M: preinitModuleScript
};

function flushSyncWork() {
  {
    const previousWasRendering = previousDispatcher.f();
    const wasRendering = flushSyncWork$1();
    return previousWasRendering || wasRendering;
  }
}

function requestFormReset(form) {
  const formInst = getInstanceFromNode(form);

  if (formInst !== null && formInst.tag === HostComponent && formInst.type === 'form') {
    requestFormReset$1(formInst);
  } else {
    previousDispatcher.r(form);
  }
}

const globalDocument = typeof document === 'undefined' ? null : document;

function getGlobalDocument() {
  return globalDocument;
}

function preconnectAs(rel, href, crossOrigin) {
  const ownerDocument = getGlobalDocument();

  if (ownerDocument && typeof href === 'string' && href) {
    const limitedEscapedHref = escapeSelectorAttributeValueInsideDoubleQuotes(href);
    let key = `link[rel="${rel}"][href="${limitedEscapedHref}"]`;

    if (typeof crossOrigin === 'string') {
      key += `[crossorigin="${crossOrigin}"]`;
    }

    if (!preconnectsSet.has(key)) {
      preconnectsSet.add(key);
      const preconnectProps = {
        rel,
        crossOrigin,
        href
      };

      if (null === ownerDocument.querySelector(key)) {
        const instance = ownerDocument.createElement('link');
        setInitialProperties(instance, 'link', preconnectProps);
        markNodeAsHoistable(instance);
        ownerDocument.head.appendChild(instance);
      }
    }
  }
}

function prefetchDNS(href) {
  previousDispatcher.D(href);
  preconnectAs('dns-prefetch', href, null);
}

function preconnect(href, crossOrigin) {
  previousDispatcher.C(href, crossOrigin);
  preconnectAs('preconnect', href, crossOrigin);
}

function preload(href, as, options) {
  previousDispatcher.L(href, as, options);
  const ownerDocument = getGlobalDocument();

  if (ownerDocument && href && as) {
    let preloadSelector = `link[rel="preload"][as="${escapeSelectorAttributeValueInsideDoubleQuotes(as)}"]`;

    if (as === 'image') {
      if (options && options.imageSrcSet) {
        preloadSelector += `[imagesrcset="${escapeSelectorAttributeValueInsideDoubleQuotes(options.imageSrcSet)}"]`;

        if (typeof options.imageSizes === 'string') {
          preloadSelector += `[imagesizes="${escapeSelectorAttributeValueInsideDoubleQuotes(options.imageSizes)}"]`;
        }
      } else {
        preloadSelector += `[href="${escapeSelectorAttributeValueInsideDoubleQuotes(href)}"]`;
      }
    } else {
      preloadSelector += `[href="${escapeSelectorAttributeValueInsideDoubleQuotes(href)}"]`;
    }

    let key = preloadSelector;

    switch (as) {
      case 'style':
        key = getStyleKey(href);
        break;

      case 'script':
        key = getScriptKey(href);
        break;
    }

    if (!preloadPropsMap.has(key)) {
      const preloadProps = Object.assign({
        rel: 'preload',
        href: as === 'image' && options && options.imageSrcSet ? undefined : href,
        as
      }, options);
      preloadPropsMap.set(key, preloadProps);

      if (null === ownerDocument.querySelector(preloadSelector)) {
        if (as === 'style' && ownerDocument.querySelector(getStylesheetSelectorFromKey(key))) {
          return;
        } else if (as === 'script' && ownerDocument.querySelector(getScriptSelectorFromKey(key))) {
          return;
        }

        const instance = ownerDocument.createElement('link');
        setInitialProperties(instance, 'link', preloadProps);
        markNodeAsHoistable(instance);
        ownerDocument.head.appendChild(instance);
      }
    }
  }
}

function preloadModule(href, options) {
  previousDispatcher.m(href, options);
  const ownerDocument = getGlobalDocument();

  if (ownerDocument && href) {
    const as = options && typeof options.as === 'string' ? options.as : 'script';
    const preloadSelector = `link[rel="modulepreload"][as="${escapeSelectorAttributeValueInsideDoubleQuotes(as)}"][href="${escapeSelectorAttributeValueInsideDoubleQuotes(href)}"]`;
    let key = preloadSelector;

    switch (as) {
      case 'audioworklet':
      case 'paintworklet':
      case 'serviceworker':
      case 'sharedworker':
      case 'worker':
      case 'script':
        {
          key = getScriptKey(href);
          break;
        }
    }

    if (!preloadPropsMap.has(key)) {
      const props = Object.assign({
        rel: 'modulepreload',
        href
      }, options);
      preloadPropsMap.set(key, props);

      if (null === ownerDocument.querySelector(preloadSelector)) {
        switch (as) {
          case 'audioworklet':
          case 'paintworklet':
          case 'serviceworker':
          case 'sharedworker':
          case 'worker':
          case 'script':
            {
              if (ownerDocument.querySelector(getScriptSelectorFromKey(key))) {
                return;
              }
            }
        }

        const instance = ownerDocument.createElement('link');
        setInitialProperties(instance, 'link', props);
        markNodeAsHoistable(instance);
        ownerDocument.head.appendChild(instance);
      }
    }
  }
}

function preinitStyle(href, precedence, options) {
  previousDispatcher.S(href, precedence, options);
  const ownerDocument = getGlobalDocument();

  if (ownerDocument && href) {
    const styles = getResourcesFromRoot(ownerDocument).hoistableStyles;
    const key = getStyleKey(href);
    precedence = precedence || 'default';
    let resource = styles.get(key);

    if (resource) {
      return;
    }

    const state = {
      loading: NotLoaded,
      preload: null
    };
    let instance = ownerDocument.querySelector(getStylesheetSelectorFromKey(key));

    if (instance) {
      state.loading = Loaded | Inserted;
    } else {
      const stylesheetProps = Object.assign({
        rel: 'stylesheet',
        href,
        'data-precedence': precedence
      }, options);
      const preloadProps = preloadPropsMap.get(key);

      if (preloadProps) {
        adoptPreloadPropsForStylesheet(stylesheetProps, preloadProps);
      }

      const link = instance = ownerDocument.createElement('link');
      markNodeAsHoistable(link);
      setInitialProperties(link, 'link', stylesheetProps);
      link._p = new Promise((resolve, reject) => {
        link.onload = resolve;
        link.onerror = reject;
      });
      link.addEventListener('load', () => {
        state.loading |= Loaded;
      });
      link.addEventListener('error', () => {
        state.loading |= Errored;
      });
      state.loading |= Inserted;
      insertStylesheet(instance, precedence, ownerDocument);
    }

    resource = {
      type: 'stylesheet',
      instance,
      count: 1,
      state
    };
    styles.set(key, resource);
    return;
  }
}

function preinitScript(src, options) {
  previousDispatcher.X(src, options);
  const ownerDocument = getGlobalDocument();

  if (ownerDocument && src) {
    const scripts = getResourcesFromRoot(ownerDocument).hoistableScripts;
    const key = getScriptKey(src);
    let resource = scripts.get(key);

    if (resource) {
      return;
    }

    let instance = ownerDocument.querySelector(getScriptSelectorFromKey(key));

    if (!instance) {
      const scriptProps = Object.assign({
        src,
        async: true
      }, options);
      const preloadProps = preloadPropsMap.get(key);

      if (preloadProps) {
        adoptPreloadPropsForScript(scriptProps, preloadProps);
      }

      instance = ownerDocument.createElement('script');
      markNodeAsHoistable(instance);
      setInitialProperties(instance, 'link', scriptProps);
      ownerDocument.head.appendChild(instance);
    }

    resource = {
      type: 'script',
      instance,
      count: 1,
      state: null
    };
    scripts.set(key, resource);
    return;
  }
}

function preinitModuleScript(src, options) {
  previousDispatcher.M(src, options);
  const ownerDocument = getGlobalDocument();

  if (ownerDocument && src) {
    const scripts = getResourcesFromRoot(ownerDocument).hoistableScripts;
    const key = getScriptKey(src);
    let resource = scripts.get(key);

    if (resource) {
      return;
    }

    let instance = ownerDocument.querySelector(getScriptSelectorFromKey(key));

    if (!instance) {
      const scriptProps = Object.assign({
        src,
        async: true,
        type: 'module'
      }, options);
      const preloadProps = preloadPropsMap.get(key);

      if (preloadProps) {
        adoptPreloadPropsForScript(scriptProps, preloadProps);
      }

      instance = ownerDocument.createElement('script');
      markNodeAsHoistable(instance);
      setInitialProperties(instance, 'link', scriptProps);
      ownerDocument.head.appendChild(instance);
    }

    resource = {
      type: 'script',
      instance,
      count: 1,
      state: null
    };
    scripts.set(key, resource);
    return;
  }
}

function getResource(type, currentProps, pendingProps, currentResource) {
  const resourceRoot = getCurrentResourceRoot();

  if (!resourceRoot) {
    throw new Error('"resourceRoot" was expected to exist. This is a bug in React.');
  }

  switch (type) {
    case 'meta':
    case 'title':
      {
        return null;
      }

    case 'style':
      {
        if (typeof pendingProps.precedence === 'string' && typeof pendingProps.href === 'string') {
          const key = getStyleKey(pendingProps.href);
          const styles = getResourcesFromRoot(resourceRoot).hoistableStyles;
          let resource = styles.get(key);

          if (!resource) {
            resource = {
              type: 'style',
              instance: null,
              count: 0,
              state: null
            };
            styles.set(key, resource);
          }

          return resource;
        }

        return {
          type: 'void',
          instance: null,
          count: 0,
          state: null
        };
      }

    case 'link':
      {
        if (pendingProps.rel === 'stylesheet' && typeof pendingProps.href === 'string' && typeof pendingProps.precedence === 'string') {
          const qualifiedProps = pendingProps;
          const key = getStyleKey(qualifiedProps.href);
          const styles = getResourcesFromRoot(resourceRoot).hoistableStyles;
          let resource = styles.get(key);

          if (!resource) {
            const ownerDocument = getDocumentFromRoot(resourceRoot);
            resource = {
              type: 'stylesheet',
              instance: null,
              count: 0,
              state: {
                loading: NotLoaded,
                preload: null
              }
            };
            styles.set(key, resource);
            const instance = ownerDocument.querySelector(getStylesheetSelectorFromKey(key));

            if (instance) {
              const loadingState = instance._p;

              if (loadingState) ; else {
                resource.instance = instance;
                resource.state.loading = Loaded | Inserted;
              }
            }

            if (!preloadPropsMap.has(key)) {
              const preloadProps = preloadPropsFromStylesheet(qualifiedProps);
              preloadPropsMap.set(key, preloadProps);

              if (!instance) {
                preloadStylesheet(ownerDocument, key, preloadProps, resource.state);
              }
            }
          }

          if (currentProps && currentResource === null) {
            let diff = '';

            {
              diff = `

  - ${describeLinkForResourceErrorDEV(currentProps)}
  + ${describeLinkForResourceErrorDEV(pendingProps)}`;
            }

            throw new Error('Expected <link> not to update to be updated to a stylesheet with precedence.' + ' Check the `rel`, `href`, and `precedence` props of this component.' + ' Alternatively, check whether two different <link> components render in the same slot or share the same key.' + diff);
          }

          return resource;
        } else {
          if (currentProps && currentResource !== null) {
            let diff = '';

            {
              diff = `

  - ${describeLinkForResourceErrorDEV(currentProps)}
  + ${describeLinkForResourceErrorDEV(pendingProps)}`;
            }

            throw new Error('Expected stylesheet with precedence to not be updated to a different kind of <link>.' + ' Check the `rel`, `href`, and `precedence` props of this component.' + ' Alternatively, check whether two different <link> components render in the same slot or share the same key.' + diff);
          }

          return null;
        }
      }

    case 'script':
      {
        const async = pendingProps.async;
        const src = pendingProps.src;

        if (typeof src === 'string' && async && typeof async !== 'function' && typeof async !== 'symbol') {
          const key = getScriptKey(src);
          const scripts = getResourcesFromRoot(resourceRoot).hoistableScripts;
          let resource = scripts.get(key);

          if (!resource) {
            resource = {
              type: 'script',
              instance: null,
              count: 0,
              state: null
            };
            scripts.set(key, resource);
          }

          return resource;
        }

        return {
          type: 'void',
          instance: null,
          count: 0,
          state: null
        };
      }

    default:
      {
        throw new Error(`getResource encountered a type it did not expect: "${type}". this is a bug in React.`);
      }
  }
}

function describeLinkForResourceErrorDEV(props) {
  {
    let describedProps = 0;
    let description = '<link';

    if (typeof props.rel === 'string') {
      describedProps++;
      description += ` rel="${props.rel}"`;
    } else if (hasOwnProperty.call(props, 'rel')) {
      describedProps++;
      description += ` rel="${props.rel === null ? 'null' : 'invalid type ' + typeof props.rel}"`;
    }

    if (typeof props.href === 'string') {
      describedProps++;
      description += ` href="${props.href}"`;
    } else if (hasOwnProperty.call(props, 'href')) {
      describedProps++;
      description += ` href="${props.href === null ? 'null' : 'invalid type ' + typeof props.href}"`;
    }

    if (typeof props.precedence === 'string') {
      describedProps++;
      description += ` precedence="${props.precedence}"`;
    } else if (hasOwnProperty.call(props, 'precedence')) {
      describedProps++;
      description += ` precedence={${props.precedence === null ? 'null' : 'invalid type ' + typeof props.precedence}}`;
    }

    if (Object.getOwnPropertyNames(props).length > describedProps) {
      description += ' ...';
    }

    description += ' />';
    return description;
  }
}

function styleTagPropsFromRawProps(rawProps) {
  return { ...rawProps,
    'data-href': rawProps.href,
    'data-precedence': rawProps.precedence,
    href: null,
    precedence: null
  };
}

function getStyleKey(href) {
  const limitedEscapedHref = escapeSelectorAttributeValueInsideDoubleQuotes(href);
  return `href="${limitedEscapedHref}"`;
}

function getStyleTagSelector(href) {
  const limitedEscapedHref = escapeSelectorAttributeValueInsideDoubleQuotes(href);
  return `style[data-href~="${limitedEscapedHref}"]`;
}

function getStylesheetSelectorFromKey(key) {
  return `link[rel="stylesheet"][${key}]`;
}

function getPreloadStylesheetSelectorFromKey(key) {
  return `link[rel="preload"][as="style"][${key}]`;
}

function stylesheetPropsFromRawProps(rawProps) {
  return { ...rawProps,
    'data-precedence': rawProps.precedence,
    precedence: null
  };
}

function preloadStylesheet(ownerDocument, key, preloadProps, state) {
  const preloadEl = ownerDocument.querySelector(getPreloadStylesheetSelectorFromKey(key));

  if (preloadEl) {
    state.loading = Loaded;
  } else {
    const instance = ownerDocument.createElement('link');
    state.preload = instance;
    instance.addEventListener('load', () => state.loading |= Loaded);
    instance.addEventListener('error', () => state.loading |= Errored);
    setInitialProperties(instance, 'link', preloadProps);
    markNodeAsHoistable(instance);
    ownerDocument.head.appendChild(instance);
  }
}

function preloadPropsFromStylesheet(props) {
  return {
    rel: 'preload',
    as: 'style',
    href: props.href,
    crossOrigin: props.crossOrigin,
    integrity: props.integrity,
    media: props.media,
    hrefLang: props.hrefLang,
    referrerPolicy: props.referrerPolicy
  };
}

function getScriptKey(src) {
  const limitedEscapedSrc = escapeSelectorAttributeValueInsideDoubleQuotes(src);
  return `[src="${limitedEscapedSrc}"]`;
}

function getScriptSelectorFromKey(key) {
  return 'script[async]' + key;
}

function acquireResource(hoistableRoot, resource, props) {
  resource.count++;

  if (resource.instance === null) {
    switch (resource.type) {
      case 'style':
        {
          const qualifiedProps = props;
          let instance = hoistableRoot.querySelector(getStyleTagSelector(qualifiedProps.href));

          if (instance) {
            resource.instance = instance;
            markNodeAsHoistable(instance);
            return instance;
          }

          const styleProps = styleTagPropsFromRawProps(props);
          const ownerDocument = getDocumentFromRoot(hoistableRoot);
          instance = ownerDocument.createElement('style');
          markNodeAsHoistable(instance);
          setInitialProperties(instance, 'style', styleProps);
          insertStylesheet(instance, qualifiedProps.precedence, hoistableRoot);
          resource.instance = instance;
          return instance;
        }

      case 'stylesheet':
        {
          const qualifiedProps = props;
          const key = getStyleKey(qualifiedProps.href);
          let instance = hoistableRoot.querySelector(getStylesheetSelectorFromKey(key));

          if (instance) {
            resource.state.loading |= Inserted;
            resource.instance = instance;
            markNodeAsHoistable(instance);
            return instance;
          }

          const stylesheetProps = stylesheetPropsFromRawProps(props);
          const preloadProps = preloadPropsMap.get(key);

          if (preloadProps) {
            adoptPreloadPropsForStylesheet(stylesheetProps, preloadProps);
          }

          const ownerDocument = getDocumentFromRoot(hoistableRoot);
          instance = ownerDocument.createElement('link');
          markNodeAsHoistable(instance);
          const linkInstance = instance;
          linkInstance._p = new Promise((resolve, reject) => {
            linkInstance.onload = resolve;
            linkInstance.onerror = reject;
          });
          setInitialProperties(instance, 'link', stylesheetProps);
          resource.state.loading |= Inserted;
          insertStylesheet(instance, qualifiedProps.precedence, hoistableRoot);
          resource.instance = instance;
          return instance;
        }

      case 'script':
        {
          const borrowedScriptProps = props;
          const key = getScriptKey(borrowedScriptProps.src);
          let instance = hoistableRoot.querySelector(getScriptSelectorFromKey(key));

          if (instance) {
            resource.instance = instance;
            markNodeAsHoistable(instance);
            return instance;
          }

          let scriptProps = borrowedScriptProps;
          const preloadProps = preloadPropsMap.get(key);

          if (preloadProps) {
            scriptProps = { ...borrowedScriptProps
            };
            adoptPreloadPropsForScript(scriptProps, preloadProps);
          }

          const ownerDocument = getDocumentFromRoot(hoistableRoot);
          instance = ownerDocument.createElement('script');
          markNodeAsHoistable(instance);
          setInitialProperties(instance, 'link', scriptProps);
          ownerDocument.head.appendChild(instance);
          resource.instance = instance;
          return instance;
        }

      case 'void':
        {
          return null;
        }

      default:
        {
          throw new Error(`acquireResource encountered a resource type it did not expect: "${resource.type}". this is a bug in React.`);
        }
    }
  } else {
    if (resource.type === 'stylesheet' && (resource.state.loading & Inserted) === NotLoaded) {
      const qualifiedProps = props;
      const instance = resource.instance;
      resource.state.loading |= Inserted;
      insertStylesheet(instance, qualifiedProps.precedence, hoistableRoot);
    }
  }

  return resource.instance;
}
function releaseResource(resource) {
  resource.count--;
}

function insertStylesheet(instance, precedence, root) {
  const nodes = root.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]');
  const last = nodes.length ? nodes[nodes.length - 1] : null;
  let prior = last;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const nodePrecedence = node.dataset.precedence;

    if (nodePrecedence === precedence) {
      prior = node;
    } else if (prior !== last) {
      break;
    }
  }

  if (prior) {
    prior.parentNode.insertBefore(instance, prior.nextSibling);
  } else {
    const parent = root.nodeType === DOCUMENT_NODE ? root.head : root;
    parent.insertBefore(instance, parent.firstChild);
  }
}

function adoptPreloadPropsForStylesheet(stylesheetProps, preloadProps) {
  if (stylesheetProps.crossOrigin == null) stylesheetProps.crossOrigin = preloadProps.crossOrigin;
  if (stylesheetProps.referrerPolicy == null) stylesheetProps.referrerPolicy = preloadProps.referrerPolicy;
  if (stylesheetProps.title == null) stylesheetProps.title = preloadProps.title;
}

function adoptPreloadPropsForScript(scriptProps, preloadProps) {
  if (scriptProps.crossOrigin == null) scriptProps.crossOrigin = preloadProps.crossOrigin;
  if (scriptProps.referrerPolicy == null) scriptProps.referrerPolicy = preloadProps.referrerPolicy;
  if (scriptProps.integrity == null) scriptProps.integrity = preloadProps.integrity;
}

let tagCaches = null;
function hydrateHoistable(hoistableRoot, type, props, internalInstanceHandle) {
  const ownerDocument = getDocumentFromRoot(hoistableRoot);
  let instance = null;

  getInstance: switch (type) {
    case 'title':
      {
        instance = ownerDocument.getElementsByTagName('title')[0];

        if (!instance || isOwnedInstance(instance) || instance.namespaceURI === SVG_NAMESPACE || instance.hasAttribute('itemprop')) {
          instance = ownerDocument.createElement(type);
          ownerDocument.head.insertBefore(instance, ownerDocument.querySelector('head > title'));
        }

        setInitialProperties(instance, type, props);
        precacheFiberNode(internalInstanceHandle, instance);
        markNodeAsHoistable(instance);
        return instance;
      }

    case 'link':
      {
        const cache = getHydratableHoistableCache('link', 'href', ownerDocument);
        const key = type + (props.href || '');
        const maybeNodes = cache.get(key);

        if (maybeNodes) {
          const nodes = maybeNodes;

          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            if (node.getAttribute('href') !== (props.href == null ? null : props.href) || node.getAttribute('rel') !== (props.rel == null ? null : props.rel) || node.getAttribute('title') !== (props.title == null ? null : props.title) || node.getAttribute('crossorigin') !== (props.crossOrigin == null ? null : props.crossOrigin)) {
              continue;
            }

            instance = node;
            nodes.splice(i, 1);
            break getInstance;
          }
        }

        instance = ownerDocument.createElement(type);
        setInitialProperties(instance, type, props);
        ownerDocument.head.appendChild(instance);
        break;
      }

    case 'meta':
      {
        const cache = getHydratableHoistableCache('meta', 'content', ownerDocument);
        const key = type + (props.content || '');
        const maybeNodes = cache.get(key);

        if (maybeNodes) {
          const nodes = maybeNodes;

          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            {
              checkAttributeStringCoercion(props.content, 'content');
            }

            if (node.getAttribute('content') !== (props.content == null ? null : '' + props.content) || node.getAttribute('name') !== (props.name == null ? null : props.name) || node.getAttribute('property') !== (props.property == null ? null : props.property) || node.getAttribute('http-equiv') !== (props.httpEquiv == null ? null : props.httpEquiv) || node.getAttribute('charset') !== (props.charSet == null ? null : props.charSet)) {
              continue;
            }

            instance = node;
            nodes.splice(i, 1);
            break getInstance;
          }
        }

        instance = ownerDocument.createElement(type);
        setInitialProperties(instance, type, props);
        ownerDocument.head.appendChild(instance);
        break;
      }

    default:
      throw new Error(`getNodesForType encountered a type it did not expect: "${type}". This is a bug in React.`);
  }

  precacheFiberNode(internalInstanceHandle, instance);
  markNodeAsHoistable(instance);
  return instance;
}

function getHydratableHoistableCache(type, keyAttribute, ownerDocument) {
  let cache;
  let caches;

  if (tagCaches === null) {
    cache = new Map();
    caches = tagCaches = new Map();
    caches.set(ownerDocument, cache);
  } else {
    caches = tagCaches;
    const maybeCache = caches.get(ownerDocument);

    if (!maybeCache) {
      cache = new Map();
      caches.set(ownerDocument, cache);
    } else {
      cache = maybeCache;
    }
  }

  if (cache.has(type)) {
    return cache;
  }

  cache.set(type, null);
  const nodes = ownerDocument.getElementsByTagName(type);

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (!isOwnedInstance(node) && (type !== 'link' || node.getAttribute('rel') !== 'stylesheet') && node.namespaceURI !== SVG_NAMESPACE) {
      const nodeKey = node.getAttribute(keyAttribute) || '';
      const key = type + nodeKey;
      const existing = cache.get(key);

      if (existing) {
        existing.push(node);
      } else {
        cache.set(key, [node]);
      }
    }
  }

  return cache;
}

function mountHoistable(hoistableRoot, type, instance) {
  const ownerDocument = getDocumentFromRoot(hoistableRoot);
  ownerDocument.head.insertBefore(instance, type === 'title' ? ownerDocument.querySelector('head > title') : null);
}
function unmountHoistable(instance) {
  instance.parentNode.removeChild(instance);
}
function isHostHoistableType(type, props, hostContext) {
  let outsideHostContainerContext;
  let hostContextProd;

  {
    const hostContextDev = hostContext;
    outsideHostContainerContext = !hostContextDev.ancestorInfo.containerTagInScope;
    hostContextProd = hostContextDev.context;
  }

  if (hostContextProd === HostContextNamespaceSvg || props.itemProp != null) {
    {
      if (outsideHostContainerContext && props.itemProp != null && (type === 'meta' || type === 'title' || type === 'style' || type === 'link' || type === 'script')) {
        console.error('Cannot render a <%s> outside the main document if it has an `itemProp` prop. `itemProp` suggests the tag belongs to an' + ' `itemScope` which can appear anywhere in the DOM. If you were intending for React to hoist this <%s> remove the `itemProp` prop.' + ' Otherwise, try moving this tag into the <head> or <body> of the Document.', type, type);
      }
    }

    return false;
  }

  switch (type) {
    case 'meta':
    case 'title':
      {
        return true;
      }

    case 'style':
      {
        if (typeof props.precedence !== 'string' || typeof props.href !== 'string' || props.href === '') {
          {
            if (outsideHostContainerContext) {
              console.error('Cannot render a <style> outside the main document without knowing its precedence and a unique href key.' + ' React can hoist and deduplicate <style> tags if you provide a `precedence` prop along with an `href` prop that' + ' does not conflic with the `href` values used in any other hoisted <style> or <link rel="stylesheet" ...> tags. ' + ' Note that hoisting <style> tags is considered an advanced feature that most will not use directly.' + ' Consider moving the <style> tag to the <head> or consider adding a `precedence="default"` and `href="some unique resource identifier"`, or move the <style>' + ' to the <style> tag.');
            }
          }

          return false;
        }

        return true;
      }

    case 'link':
      {
        if (typeof props.rel !== 'string' || typeof props.href !== 'string' || props.href === '' || props.onLoad || props.onError) {
          {
            if (props.rel === 'stylesheet' && typeof props.precedence === 'string') {
              validateLinkPropsForStyleResource(props);
            }

            if (outsideHostContainerContext) {
              if (typeof props.rel !== 'string' || typeof props.href !== 'string' || props.href === '') {
                console.error('Cannot render a <link> outside the main document without a `rel` and `href` prop.' + ' Try adding a `rel` and/or `href` prop to this <link> or moving the link into the <head> tag');
              } else if (props.onError || props.onLoad) {
                console.error('Cannot render a <link> with onLoad or onError listeners outside the main document.' + ' Try removing onLoad={...} and onError={...} or moving it into the root <head> tag or' + ' somewhere in the <body>.');
              }
            }
          }

          return false;
        }

        switch (props.rel) {
          case 'stylesheet':
            {
              const {
                precedence,
                disabled
              } = props;

              {
                if (typeof precedence !== 'string') {
                  if (outsideHostContainerContext) {
                    console.error('Cannot render a <link rel="stylesheet" /> outside the main document without knowing its precedence.' + ' Consider adding precedence="default" or moving it into the root <head> tag.');
                  }
                }
              }

              return typeof precedence === 'string' && disabled == null;
            }

          default:
            {
              return true;
            }
        }
      }

    case 'script':
      {
        const isAsync = props.async && typeof props.async !== 'function' && typeof props.async !== 'symbol';

        if (!isAsync || props.onLoad || props.onError || !props.src || typeof props.src !== 'string') {
          {
            if (outsideHostContainerContext) {
              if (!isAsync) {
                console.error('Cannot render a sync or defer <script> outside the main document without knowing its order.' + ' Try adding async="" or moving it into the root <head> tag.');
              } else if (props.onLoad || props.onError) {
                console.error('Cannot render a <script> with onLoad or onError listeners outside the main document.' + ' Try removing onLoad={...} and onError={...} or moving it into the root <head> tag or' + ' somewhere in the <body>.');
              } else {
                console.error('Cannot render a <script> outside the main document without `async={true}` and a non-empty `src` prop.' + ' Ensure there is a valid `src` and either make the script async or move it into the root <head> tag or' + ' somewhere in the <body>.');
              }
            }
          }

          return false;
        }

        return true;
      }

    case 'noscript':
    case 'template':
      {
        {
          if (outsideHostContainerContext) {
            console.error('Cannot render <%s> outside the main document. Try moving it into the root <head> tag.', type);
          }
        }

        return false;
      }
  }

  return false;
}
function mayResourceSuspendCommit(resource) {
  return resource.type === 'stylesheet' && (resource.state.loading & Inserted) === NotLoaded;
}
function preloadInstance(type, props) {
  return true;
}
function preloadResource(resource) {
  if (resource.type === 'stylesheet' && (resource.state.loading & Settled) === NotLoaded) {
    return false;
  }

  return true;
}
let suspendedState = null;

function noop() {}

function startSuspendingCommit() {
  suspendedState = {
    stylesheets: null,
    count: 0,
    unsuspend: noop
  };
}
function suspendResource(hoistableRoot, resource, props) {
  if (suspendedState === null) {
    throw new Error('Internal React Error: suspendedState null when it was expected to exists. Please report this as a React bug.');
  }

  const state = suspendedState;

  if (resource.type === 'stylesheet') {
    if (typeof props.media === 'string') {
      if (matchMedia(props.media).matches === false) {
        return;
      }
    }

    if ((resource.state.loading & Inserted) === NotLoaded) {
      if (resource.instance === null) {
        const qualifiedProps = props;
        const key = getStyleKey(qualifiedProps.href);
        let instance = hoistableRoot.querySelector(getStylesheetSelectorFromKey(key));

        if (instance) {
          const maybeLoadingState = instance._p;

          if (maybeLoadingState !== null && typeof maybeLoadingState === 'object' && typeof maybeLoadingState.then === 'function') {
            const loadingState = maybeLoadingState;
            state.count++;
            const ping = onUnsuspend.bind(state);
            loadingState.then(ping, ping);
          }

          resource.state.loading |= Inserted;
          resource.instance = instance;
          markNodeAsHoistable(instance);
          return;
        }

        const ownerDocument = getDocumentFromRoot(hoistableRoot);
        const stylesheetProps = stylesheetPropsFromRawProps(props);
        const preloadProps = preloadPropsMap.get(key);

        if (preloadProps) {
          adoptPreloadPropsForStylesheet(stylesheetProps, preloadProps);
        }

        instance = ownerDocument.createElement('link');
        markNodeAsHoistable(instance);
        const linkInstance = instance;
        linkInstance._p = new Promise((resolve, reject) => {
          linkInstance.onload = resolve;
          linkInstance.onerror = reject;
        });
        setInitialProperties(instance, 'link', stylesheetProps);
        resource.instance = instance;
      }

      if (state.stylesheets === null) {
        state.stylesheets = new Map();
      }

      state.stylesheets.set(resource, hoistableRoot);
      const preloadEl = resource.state.preload;

      if (preloadEl && (resource.state.loading & Settled) === NotLoaded) {
        state.count++;
        const ping = onUnsuspend.bind(state);
        preloadEl.addEventListener('load', ping);
        preloadEl.addEventListener('error', ping);
      }
    }
  }
}
function waitForCommitToBeReady() {
  if (suspendedState === null) {
    throw new Error('Internal React Error: suspendedState null when it was expected to exists. Please report this as a React bug.');
  }

  const state = suspendedState;

  if (state.stylesheets && state.count === 0) {
    insertSuspendedStylesheets(state, state.stylesheets);
  }

  if (state.count > 0) {
    return commit => {
      const stylesheetTimer = setTimeout(() => {
        if (state.stylesheets) {
          insertSuspendedStylesheets(state, state.stylesheets);
        }

        if (state.unsuspend) {
          const unsuspend = state.unsuspend;
          state.unsuspend = null;
          unsuspend();
        }
      }, 60000);
      state.unsuspend = commit;
      return () => {
        state.unsuspend = null;
        clearTimeout(stylesheetTimer);
      };
    };
  }

  return null;
}

function onUnsuspend() {
  this.count--;

  if (this.count === 0) {
    if (this.stylesheets) {
      insertSuspendedStylesheets(this, this.stylesheets);
    } else if (this.unsuspend) {
      const unsuspend = this.unsuspend;
      this.unsuspend = null;
      unsuspend();
    }
  }
}

const LAST_PRECEDENCE = null;
let precedencesByRoot = null;

function insertSuspendedStylesheets(state, resources) {
  state.stylesheets = null;

  if (state.unsuspend === null) {
    return;
  }

  state.count++;
  precedencesByRoot = new Map();
  resources.forEach(insertStylesheetIntoRoot, state);
  precedencesByRoot = null;
  onUnsuspend.call(state);
}

function insertStylesheetIntoRoot(root, resource, map) {
  if (resource.state.loading & Inserted) {
    return;
  }

  let last;
  let precedences = precedencesByRoot.get(root);

  if (!precedences) {
    precedences = new Map();
    precedencesByRoot.set(root, precedences);
    const nodes = root.querySelectorAll('link[data-precedence],style[data-precedence]');

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (node.nodeName === 'LINK' || node.getAttribute('media') !== 'not all') {
        precedences.set(node.dataset.precedence, node);
        last = node;
      }
    }

    if (last) {
      precedences.set(LAST_PRECEDENCE, last);
    }
  } else {
    last = precedences.get(LAST_PRECEDENCE);
  }

  const instance = resource.instance;
  const precedence = instance.getAttribute('data-precedence');
  const prior = precedences.get(precedence) || last;

  if (prior === last) {
    precedences.set(LAST_PRECEDENCE, instance);
  }

  precedences.set(precedence, instance);
  this.count++;
  const onComplete = onUnsuspend.bind(this);
  instance.addEventListener('load', onComplete);
  instance.addEventListener('error', onComplete);

  if (prior) {
    prior.parentNode.insertBefore(instance, prior.nextSibling);
  } else {
    const parent = root.nodeType === DOCUMENT_NODE ? root.head : root;
    parent.insertBefore(instance, parent.firstChild);
  }

  resource.state.loading |= Inserted;
}

const NotPendingTransition = NotPending;
const HostTransitionContext = {
  $$typeof: REACT_CONTEXT_TYPE,
  Provider: null,
  Consumer: null,
  _currentValue: NotPendingTransition,
  _currentValue2: NotPendingTransition,
  _threadCount: 0
};
function resetFormInstance(form) {
  form.reset();
}

const badgeFormat = '%c%s%c ';
const badgeStyle = 'background: #e6e6e6;' + 'background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));' + 'color: #000000;' + 'color: light-dark(#000000, #ffffff);' + 'border-radius: 2px';
const resetStyle = '';
const pad = ' ';
const bind = Function.prototype.bind;
function bindToConsole(methodName, args, badgeName) {
  let offset = 0;

  switch (methodName) {
    case 'dir':
    case 'dirxml':
    case 'groupEnd':
    case 'table':
      {
        return bind.apply(console[methodName], [console].concat(args));
      }

    case 'assert':
      {
        offset = 1;
      }
  }

  const newArgs = args.slice(0);

  if (typeof newArgs[offset] === 'string') {
    newArgs.splice(offset, 1, badgeFormat + newArgs[offset], badgeStyle, pad + badgeName + pad, resetStyle);
  } else {
    newArgs.splice(offset, 0, badgeFormat, badgeStyle, pad + badgeName + pad, resetStyle);
  }

  newArgs.unshift(console);
  return bind.apply(console[methodName], newArgs);
}

function FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, formState) {
  this.tag = ConcurrentRoot ;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.current = null;
  this.pingCache = null;
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.cancelPendingCommit = null;
  this.context = null;
  this.pendingContext = null;
  this.next = null;
  this.callbackNode = null;
  this.callbackPriority = NoLane;
  this.expirationTimes = createLaneMap(NoTimestamp);
  this.pendingLanes = NoLanes;
  this.suspendedLanes = NoLanes;
  this.pingedLanes = NoLanes;
  this.warmLanes = NoLanes;
  this.expiredLanes = NoLanes;
  this.finishedLanes = NoLanes;
  this.errorRecoveryDisabledLanes = NoLanes;
  this.shellSuspendCounter = 0;
  this.entangledLanes = NoLanes;
  this.entanglements = createLaneMap(NoLanes);
  this.hiddenUpdates = createLaneMap(null);
  this.identifierPrefix = identifierPrefix;
  this.onUncaughtError = onUncaughtError;
  this.onCaughtError = onCaughtError;
  this.onRecoverableError = onRecoverableError;

  {
    this.pooledCache = null;
    this.pooledCacheLanes = NoLanes;
  }

  this.formState = formState;
  this.incompleteTransitions = new Map();

  {
    {
      this._debugRootType = hydrate ? 'hydrateRoot()' : 'createRoot()';
    }
  }
}

function createFiberRoot(containerInfo, tag, hydrate, initialChildren, hydrationCallbacks, isStrictMode, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, transitionCallbacks, formState) {
  const root = new FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, formState);

  const uninitializedFiber = createHostRootFiber(tag, isStrictMode);
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  {
    const initialCache = createCache();
    retainCache(initialCache);
    root.pooledCache = initialCache;
    retainCache(initialCache);
    const initialState = {
      element: initialChildren,
      isDehydrated: hydrate,
      cache: initialCache
    };
    uninitializedFiber.memoizedState = initialState;
  }

  initializeUpdateQueue(uninitializedFiber);
  return root;
}

let didWarnAboutNestedUpdates;

{
  didWarnAboutNestedUpdates = false;
}

function getContextForSubtree(parentComponent) {
  if (!parentComponent) {
    return emptyContextObject;
  }

  const fiber = get(parentComponent);
  const parentContext = findCurrentUnmaskedContext();

  if (fiber.tag === ClassComponent) {
    const Component = fiber.type;

    if (isContextProvider()) {
      return processChildContext(fiber, Component, parentContext);
    }
  }

  return parentContext;
}

function findHostInstance(component) {
  const fiber = get(component);

  if (fiber === undefined) {
    if (typeof component.render === 'function') {
      throw new Error('Unable to find node on an unmounted component.');
    } else {
      const keys = Object.keys(component).join(',');
      throw new Error(`Argument appears to not be a ReactComponent. Keys: ${keys}`);
    }
  }

  const hostFiber = findCurrentHostFiber(fiber);

  if (hostFiber === null) {
    return null;
  }

  return getPublicInstance(hostFiber.stateNode);
}

function createContainer(containerInfo, tag, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, transitionCallbacks) {
  const hydrate = false;
  const initialChildren = null;
  return createFiberRoot(containerInfo, tag, hydrate, initialChildren, hydrationCallbacks, isStrictMode, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, transitionCallbacks, null);
}
function createHydrationContainer(initialChildren, callback, containerInfo, tag, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, transitionCallbacks, formState) {
  const hydrate = true;
  const root = createFiberRoot(containerInfo, tag, hydrate, initialChildren, hydrationCallbacks, isStrictMode, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, transitionCallbacks, formState);
  root.context = getContextForSubtree(null);
  const current = root.current;
  const lane = requestUpdateLane(current);
  const update = createUpdate(lane);
  update.callback = callback !== undefined && callback !== null ? callback : null;
  enqueueUpdate(current, update, lane);
  scheduleInitialHydrationOnRoot(root, lane);
  return root;
}
function updateContainer(element, container, parentComponent, callback) {
  const current = container.current;
  const lane = requestUpdateLane(current);
  updateContainerImpl(current, lane, element, container, parentComponent, callback);
  return lane;
}
function updateContainerSync(element, container, parentComponent, callback) {
  if (container.tag === LegacyRoot) {
    flushPassiveEffects();
  }

  const current = container.current;
  updateContainerImpl(current, SyncLane, element, container, parentComponent, callback);
  return SyncLane;
}

function updateContainerImpl(rootFiber, lane, element, container, parentComponent, callback) {
  {
    onScheduleRoot(container, element);
  }

  const context = getContextForSubtree(parentComponent);

  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  {
    if (isRendering && current !== null && !didWarnAboutNestedUpdates) {
      didWarnAboutNestedUpdates = true;
      console.error('Render methods should be a pure function of props and state; ' + 'triggering nested component updates from render is not allowed. ' + 'If necessary, trigger nested updates in componentDidUpdate.\n\n' + 'Check the render method of %s.', getComponentNameFromFiber(current) || 'Unknown');
    }
  }

  const update = createUpdate(lane);
  update.payload = {
    element
  };
  callback = callback === undefined ? null : callback;

  if (callback !== null) {
    {
      if (typeof callback !== 'function') {
        console.error('Expected the last optional `callback` argument to be a ' + 'function. Instead received: %s.', callback);
      }
    }

    update.callback = callback;
  }

  const root = enqueueUpdate(rootFiber, update, lane);

  if (root !== null) {
    scheduleUpdateOnFiber(root, rootFiber, lane);
    entangleTransitions(root, rootFiber, lane);
  }
}
function attemptSynchronousHydration(fiber) {
  switch (fiber.tag) {
    case HostRoot:
      {
        const root = fiber.stateNode;

        if (isRootDehydrated(root)) {
          const lanes = getHighestPriorityPendingLanes(root);
          flushRoot(root, lanes);
        }

        break;
      }

    case SuspenseComponent:
      {
        const root = enqueueConcurrentRenderForLane(fiber, SyncLane);

        if (root !== null) {
          scheduleUpdateOnFiber(root, fiber, SyncLane);
        }

        flushSyncWork$1();
        const retryLane = SyncLane;
        markRetryLaneIfNotHydrated(fiber, retryLane);
        break;
      }
  }
}

function markRetryLaneImpl(fiber, retryLane) {
  const suspenseState = fiber.memoizedState;

  if (suspenseState !== null && suspenseState.dehydrated !== null) {
    suspenseState.retryLane = higherPriorityLane(suspenseState.retryLane, retryLane);
  }
}

function markRetryLaneIfNotHydrated(fiber, retryLane) {
  markRetryLaneImpl(fiber, retryLane);
  const alternate = fiber.alternate;

  if (alternate) {
    markRetryLaneImpl(alternate, retryLane);
  }
}

function attemptContinuousHydration(fiber) {
  if (fiber.tag !== SuspenseComponent) {
    return;
  }

  const lane = SelectiveHydrationLane;
  const root = enqueueConcurrentRenderForLane(fiber, lane);

  if (root !== null) {
    scheduleUpdateOnFiber(root, fiber, lane);
  }

  markRetryLaneIfNotHydrated(fiber, lane);
}
function attemptHydrationAtCurrentPriority(fiber) {
  if (fiber.tag !== SuspenseComponent) {
    return;
  }

  const lane = requestUpdateLane(fiber);
  const root = enqueueConcurrentRenderForLane(fiber, lane);

  if (root !== null) {
    scheduleUpdateOnFiber(root, fiber, lane);
  }

  markRetryLaneIfNotHydrated(fiber, lane);
}

let shouldErrorImpl = fiber => null;

function shouldError(fiber) {
  return shouldErrorImpl(fiber);
}

let shouldSuspendImpl = fiber => false;

function shouldSuspend(fiber) {
  return shouldSuspendImpl(fiber);
}
let overrideHookState = null;
let overrideHookStateDeletePath = null;
let overrideHookStateRenamePath = null;
let overrideProps = null;
let overridePropsDeletePath = null;
let overridePropsRenamePath = null;
let scheduleUpdate = null;
let setErrorHandler = null;
let setSuspenseHandler = null;

{
  const copyWithDeleteImpl = (obj, path, index) => {
    const key = path[index];
    const updated = isArray(obj) ? obj.slice() : { ...obj
    };

    if (index + 1 === path.length) {
      if (isArray(updated)) {
        updated.splice(key, 1);
      } else {
        delete updated[key];
      }

      return updated;
    }

    updated[key] = copyWithDeleteImpl(obj[key], path, index + 1);
    return updated;
  };

  const copyWithDelete = (obj, path) => {
    return copyWithDeleteImpl(obj, path, 0);
  };

  const copyWithRenameImpl = (obj, oldPath, newPath, index) => {
    const oldKey = oldPath[index];
    const updated = isArray(obj) ? obj.slice() : { ...obj
    };

    if (index + 1 === oldPath.length) {
      const newKey = newPath[index];
      updated[newKey] = updated[oldKey];

      if (isArray(updated)) {
        updated.splice(oldKey, 1);
      } else {
        delete updated[oldKey];
      }
    } else {
      updated[oldKey] = copyWithRenameImpl(obj[oldKey], oldPath, newPath, index + 1);
    }

    return updated;
  };

  const copyWithRename = (obj, oldPath, newPath) => {
    if (oldPath.length !== newPath.length) {
      console.warn('copyWithRename() expects paths of the same length');
      return;
    } else {
      for (let i = 0; i < newPath.length - 1; i++) {
        if (oldPath[i] !== newPath[i]) {
          console.warn('copyWithRename() expects paths to be the same except for the deepest key');
          return;
        }
      }
    }

    return copyWithRenameImpl(obj, oldPath, newPath, 0);
  };

  const copyWithSetImpl = (obj, path, index, value) => {
    if (index >= path.length) {
      return value;
    }

    const key = path[index];
    const updated = isArray(obj) ? obj.slice() : { ...obj
    };
    updated[key] = copyWithSetImpl(obj[key], path, index + 1, value);
    return updated;
  };

  const copyWithSet = (obj, path, value) => {
    return copyWithSetImpl(obj, path, 0, value);
  };

  const findHook = (fiber, id) => {
    let currentHook = fiber.memoizedState;

    while (currentHook !== null && id > 0) {
      currentHook = currentHook.next;
      id--;
    }

    return currentHook;
  };

  overrideHookState = (fiber, id, path, value) => {
    const hook = findHook(fiber, id);

    if (hook !== null) {
      const newState = copyWithSet(hook.memoizedState, path, value);
      hook.memoizedState = newState;
      hook.baseState = newState;
      fiber.memoizedProps = { ...fiber.memoizedProps
      };
      const root = enqueueConcurrentRenderForLane(fiber, SyncLane);

      if (root !== null) {
        scheduleUpdateOnFiber(root, fiber, SyncLane);
      }
    }
  };

  overrideHookStateDeletePath = (fiber, id, path) => {
    const hook = findHook(fiber, id);

    if (hook !== null) {
      const newState = copyWithDelete(hook.memoizedState, path);
      hook.memoizedState = newState;
      hook.baseState = newState;
      fiber.memoizedProps = { ...fiber.memoizedProps
      };
      const root = enqueueConcurrentRenderForLane(fiber, SyncLane);

      if (root !== null) {
        scheduleUpdateOnFiber(root, fiber, SyncLane);
      }
    }
  };

  overrideHookStateRenamePath = (fiber, id, oldPath, newPath) => {
    const hook = findHook(fiber, id);

    if (hook !== null) {
      const newState = copyWithRename(hook.memoizedState, oldPath, newPath);
      hook.memoizedState = newState;
      hook.baseState = newState;
      fiber.memoizedProps = { ...fiber.memoizedProps
      };
      const root = enqueueConcurrentRenderForLane(fiber, SyncLane);

      if (root !== null) {
        scheduleUpdateOnFiber(root, fiber, SyncLane);
      }
    }
  };

  overrideProps = (fiber, path, value) => {
    fiber.pendingProps = copyWithSet(fiber.memoizedProps, path, value);

    if (fiber.alternate) {
      fiber.alternate.pendingProps = fiber.pendingProps;
    }

    const root = enqueueConcurrentRenderForLane(fiber, SyncLane);

    if (root !== null) {
      scheduleUpdateOnFiber(root, fiber, SyncLane);
    }
  };

  overridePropsDeletePath = (fiber, path) => {
    fiber.pendingProps = copyWithDelete(fiber.memoizedProps, path);

    if (fiber.alternate) {
      fiber.alternate.pendingProps = fiber.pendingProps;
    }

    const root = enqueueConcurrentRenderForLane(fiber, SyncLane);

    if (root !== null) {
      scheduleUpdateOnFiber(root, fiber, SyncLane);
    }
  };

  overridePropsRenamePath = (fiber, oldPath, newPath) => {
    fiber.pendingProps = copyWithRename(fiber.memoizedProps, oldPath, newPath);

    if (fiber.alternate) {
      fiber.alternate.pendingProps = fiber.pendingProps;
    }

    const root = enqueueConcurrentRenderForLane(fiber, SyncLane);

    if (root !== null) {
      scheduleUpdateOnFiber(root, fiber, SyncLane);
    }
  };

  scheduleUpdate = fiber => {
    const root = enqueueConcurrentRenderForLane(fiber, SyncLane);

    if (root !== null) {
      scheduleUpdateOnFiber(root, fiber, SyncLane);
    }
  };

  setErrorHandler = newShouldErrorImpl => {
    shouldErrorImpl = newShouldErrorImpl;
  };

  setSuspenseHandler = newShouldSuspendImpl => {
    shouldSuspendImpl = newShouldSuspendImpl;
  };
}

function getCurrentFiberForDevTools() {
  return current;
}

function injectIntoDevTools() {
  const internals = {
    bundleType: 1 ,
    version: reactDOMPackageVersion,
    rendererPackageName: rendererPackageName,
    currentDispatcherRef: ReactSharedInternals,
    findFiberByHostInstance: getClosestInstanceFromNode,
    reconcilerVersion: reactDOMPackageVersion
  };

  {
    internals.overrideHookState = overrideHookState;
    internals.overrideHookStateDeletePath = overrideHookStateDeletePath;
    internals.overrideHookStateRenamePath = overrideHookStateRenamePath;
    internals.overrideProps = overrideProps;
    internals.overridePropsDeletePath = overridePropsDeletePath;
    internals.overridePropsRenamePath = overridePropsRenamePath;
    internals.scheduleUpdate = scheduleUpdate;
    internals.setErrorHandler = setErrorHandler;
    internals.setSuspenseHandler = setSuspenseHandler;
    internals.scheduleRefresh = scheduleRefresh;
    internals.scheduleRoot = scheduleRoot;
    internals.setRefreshHandler = setRefreshHandler;
    internals.getCurrentFiber = getCurrentFiberForDevTools;
  }

  return injectInternals(internals);
}

let _enabled = true;
function setEnabled(enabled) {
  _enabled = !!enabled;
}
function isEnabled() {
  return _enabled;
}
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

function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
  const prevTransition = ReactSharedInternals.T;
  ReactSharedInternals.T = null;
  const previousPriority = getCurrentUpdatePriority();

  try {
    setCurrentUpdatePriority(DiscreteEventPriority);
    dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
  } finally {
    setCurrentUpdatePriority(previousPriority);
    ReactSharedInternals.T = prevTransition;
  }
}

function dispatchContinuousEvent(domEventName, eventSystemFlags, container, nativeEvent) {
  const prevTransition = ReactSharedInternals.T;
  ReactSharedInternals.T = null;
  const previousPriority = getCurrentUpdatePriority();

  try {
    setCurrentUpdatePriority(ContinuousEventPriority);
    dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
  } finally {
    setCurrentUpdatePriority(previousPriority);
    ReactSharedInternals.T = prevTransition;
  }
}

function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
  if (!_enabled) {
    return;
  }

  let blockedOn = findInstanceBlockingEvent(nativeEvent);

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

      const nextBlockedOn = findInstanceBlockingEvent(nativeEvent);

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
function findInstanceBlockingEvent(nativeEvent) {
  const nativeEventTarget = getEventTarget(nativeEvent);
  return findInstanceBlockingTarget(nativeEventTarget);
}
let return_targetInst = null;
function findInstanceBlockingTarget(targetNode) {
  return_targetInst = null;
  let targetInst = getClosestInstanceFromNode(targetNode);

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
        const root = nearestMounted.stateNode;

        if (isRootDehydrated(root)) {
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
function getEventPriority(domEventName) {
  switch (domEventName) {
    case 'beforetoggle':
    case 'cancel':
    case 'click':
    case 'close':
    case 'contextmenu':
    case 'copy':
    case 'cut':
    case 'auxclick':
    case 'dblclick':
    case 'dragend':
    case 'dragstart':
    case 'drop':
    case 'focusin':
    case 'focusout':
    case 'input':
    case 'invalid':
    case 'keydown':
    case 'keypress':
    case 'keyup':
    case 'mousedown':
    case 'mouseup':
    case 'paste':
    case 'pause':
    case 'play':
    case 'pointercancel':
    case 'pointerdown':
    case 'pointerup':
    case 'ratechange':
    case 'reset':
    case 'resize':
    case 'seeked':
    case 'submit':
    case 'toggle':
    case 'touchcancel':
    case 'touchend':
    case 'touchstart':
    case 'volumechange':
    case 'change':
    case 'selectionchange':
    case 'textInput':
    case 'compositionstart':
    case 'compositionend':
    case 'compositionupdate':
    case 'beforeblur':
    case 'afterblur':
    case 'beforeinput':
    case 'blur':
    case 'fullscreenchange':
    case 'focus':
    case 'hashchange':
    case 'popstate':
    case 'select':
    case 'selectstart':
      return DiscreteEventPriority;

    case 'drag':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    case 'dragover':
    case 'mousemove':
    case 'mouseout':
    case 'mouseover':
    case 'pointermove':
    case 'pointerout':
    case 'pointerover':
    case 'scroll':
    case 'touchmove':
    case 'wheel':
    case 'mouseenter':
    case 'mouseleave':
    case 'pointerenter':
    case 'pointerleave':
      return ContinuousEventPriority;

    case 'message':
      {
        const schedulerPriority = getCurrentPriorityLevel();

        switch (schedulerPriority) {
          case ImmediatePriority:
            return DiscreteEventPriority;

          case UserBlockingPriority:
            return ContinuousEventPriority;

          case NormalPriority$1:
          case LowPriority:
            return DefaultEventPriority;

          case IdlePriority:
            return IdleEventPriority;

          default:
            return DefaultEventPriority;
        }
      }

    default:
      return DefaultEventPriority;
  }
}

let hasScheduledReplayAttempt = false;
let queuedFocus = null;
let queuedDrag = null;
let queuedMouse = null;
const queuedPointers = new Map();
const queuedPointerCaptures = new Map();
const queuedExplicitHydrationTargets = [];
const discreteReplayableEvents = ['mousedown', 'mouseup', 'touchcancel', 'touchend', 'touchstart', 'auxclick', 'dblclick', 'pointercancel', 'pointerdown', 'pointerup', 'dragend', 'dragstart', 'drop', 'compositionend', 'compositionstart', 'keydown', 'keypress', 'keyup', 'input', 'textInput', 'copy', 'cut', 'paste', 'click', 'change', 'contextmenu', 'reset'];
function isDiscreteEventThatRequiresHydration(eventType) {
  return discreteReplayableEvents.indexOf(eventType) > -1;
}

function createQueuedReplayableEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
  return {
    blockedOn,
    domEventName,
    eventSystemFlags,
    nativeEvent,
    targetContainers: [targetContainer]
  };
}

function clearIfContinuousEvent(domEventName, nativeEvent) {
  switch (domEventName) {
    case 'focusin':
    case 'focusout':
      queuedFocus = null;
      break;

    case 'dragenter':
    case 'dragleave':
      queuedDrag = null;
      break;

    case 'mouseover':
    case 'mouseout':
      queuedMouse = null;
      break;

    case 'pointerover':
    case 'pointerout':
      {
        const pointerId = nativeEvent.pointerId;
        queuedPointers.delete(pointerId);
        break;
      }

    case 'gotpointercapture':
    case 'lostpointercapture':
      {
        const pointerId = nativeEvent.pointerId;
        queuedPointerCaptures.delete(pointerId);
        break;
      }
  }
}

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

function queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
  switch (domEventName) {
    case 'focusin':
      {
        const focusEvent = nativeEvent;
        queuedFocus = accumulateOrCreateContinuousQueuedReplayableEvent(queuedFocus, blockedOn, domEventName, eventSystemFlags, targetContainer, focusEvent);
        return true;
      }

    case 'dragenter':
      {
        const dragEvent = nativeEvent;
        queuedDrag = accumulateOrCreateContinuousQueuedReplayableEvent(queuedDrag, blockedOn, domEventName, eventSystemFlags, targetContainer, dragEvent);
        return true;
      }

    case 'mouseover':
      {
        const mouseEvent = nativeEvent;
        queuedMouse = accumulateOrCreateContinuousQueuedReplayableEvent(queuedMouse, blockedOn, domEventName, eventSystemFlags, targetContainer, mouseEvent);
        return true;
      }

    case 'pointerover':
      {
        const pointerEvent = nativeEvent;
        const pointerId = pointerEvent.pointerId;
        queuedPointers.set(pointerId, accumulateOrCreateContinuousQueuedReplayableEvent(queuedPointers.get(pointerId) || null, blockedOn, domEventName, eventSystemFlags, targetContainer, pointerEvent));
        return true;
      }

    case 'gotpointercapture':
      {
        const pointerEvent = nativeEvent;
        const pointerId = pointerEvent.pointerId;
        queuedPointerCaptures.set(pointerId, accumulateOrCreateContinuousQueuedReplayableEvent(queuedPointerCaptures.get(pointerId) || null, blockedOn, domEventName, eventSystemFlags, targetContainer, pointerEvent));
        return true;
      }
  }

  return false;
}

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
          runWithPriority(queuedTarget.priority, () => {
            attemptHydrationAtCurrentPriority(nearestMounted);
          });
          return;
        }
      } else if (tag === HostRoot) {
        const root = nearestMounted.stateNode;

        if (isRootDehydrated(root)) {
          queuedTarget.blockedOn = getContainerFromFiber(nearestMounted);
          return;
        }
      }
    }
  }

  queuedTarget.blockedOn = null;
}

function queueExplicitHydrationTarget(target) {
  const updatePriority = resolveUpdatePriority();
  const queuedTarget = {
    blockedOn: null,
    target: target,
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

function attemptReplayContinuousQueuedEvent(queuedEvent) {
  if (queuedEvent.blockedOn !== null) {
    return false;
  }

  const targetContainers = queuedEvent.targetContainers;

  while (targetContainers.length > 0) {
    const nextBlockedOn = findInstanceBlockingEvent(queuedEvent.nativeEvent);

    if (nextBlockedOn === null) {
      const nativeEvent = queuedEvent.nativeEvent;
      const nativeEventClone = new nativeEvent.constructor(nativeEvent.type, nativeEvent);
      setReplayingEvent(nativeEventClone);
      nativeEvent.target.dispatchEvent(nativeEventClone);
      resetReplayingEvent();
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

function attemptReplayContinuousQueuedEventInMap(queuedEvent, key, map) {
  if (attemptReplayContinuousQueuedEvent(queuedEvent)) {
    map.delete(key);
  }
}

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

function scheduleCallbackIfUnblocked(queuedEvent, unblocked) {
  if (queuedEvent.blockedOn === unblocked) {
    queuedEvent.blockedOn = null;

    if (!hasScheduledReplayAttempt) {
      hasScheduledReplayAttempt = true;
      unstable_scheduleCallback(NormalPriority$2, replayUnblockedEvents);
    }
  }
}

let lastScheduledReplayQueue = null;

function replayUnblockedFormActions(formReplayingQueue) {
  if (lastScheduledReplayQueue === formReplayingQueue) {
    lastScheduledReplayQueue = null;
  }

  for (let i = 0; i < formReplayingQueue.length; i += 3) {
    const form = formReplayingQueue[i];
    const submitterOrAction = formReplayingQueue[i + 1];
    const formData = formReplayingQueue[i + 2];

    if (typeof submitterOrAction !== 'function') {
      const blockedOn = findInstanceBlockingTarget(submitterOrAction || form);

      if (blockedOn === null) {
        continue;
      } else {
        break;
      }
    }

    const formInst = getInstanceFromNode(form);

    if (formInst !== null) {
      formReplayingQueue.splice(i, 3);
      i -= 3;
      dispatchReplayedFormAction(formInst, form, submitterOrAction, formData);
      continue;
    }
  }
}

function scheduleReplayQueueIfNeeded(formReplayingQueue) {
  if (lastScheduledReplayQueue !== formReplayingQueue) {
    lastScheduledReplayQueue = formReplayingQueue;
    unstable_scheduleCallback(NormalPriority$2, () => replayUnblockedFormActions(formReplayingQueue));
  }
}

function retryIfBlockedOn(unblocked) {
  if (queuedFocus !== null) {
    scheduleCallbackIfUnblocked(queuedFocus, unblocked);
  }

  if (queuedDrag !== null) {
    scheduleCallbackIfUnblocked(queuedDrag, unblocked);
  }

  if (queuedMouse !== null) {
    scheduleCallbackIfUnblocked(queuedMouse, unblocked);
  }

  const unblock = queuedEvent => scheduleCallbackIfUnblocked(queuedEvent, unblocked);

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

  const root = unblocked.ownerDocument || unblocked;
  const formReplayingQueue = root.$$reactFormReplay;

  if (formReplayingQueue != null) {
    for (let i = 0; i < formReplayingQueue.length; i += 3) {
      const form = formReplayingQueue[i];
      const submitterOrAction = formReplayingQueue[i + 1];
      const formProps = getFiberCurrentPropsFromNode(form);

      if (typeof submitterOrAction === 'function') {
        if (!formProps) {
          scheduleReplayQueueIfNeeded(formReplayingQueue);
        }

        continue;
      }

      let target = form;

      if (formProps) {
        let action = null;
        const submitter = submitterOrAction;

        if (submitter && submitter.hasAttribute('formAction')) {
          target = submitter;
          const submitterProps = getFiberCurrentPropsFromNode(submitter);

          if (submitterProps) {
            action = submitterProps.formAction;
          } else {
            const blockedOn = findInstanceBlockingTarget(target);

            if (blockedOn !== null) {
              continue;
            }
          }
        } else {
          action = formProps.action;
        }

        if (typeof action === 'function') {
          formReplayingQueue[i + 1] = action;
        } else {
          formReplayingQueue.splice(i, 3);
          i -= 3;
        }

        scheduleReplayQueueIfNeeded(formReplayingQueue);
        continue;
      }
    }
  }
}

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;

  if (root === null) {
    throw new Error('Cannot update an unmounted root.');
  }

  {
    if (typeof arguments[1] === 'function') {
      console.error('does not support the second callback argument. ' + 'To execute a side effect after rendering, declare it in a component body with useEffect().');
    } else if (isValidContainer(arguments[1])) {
      console.error('You passed a container to the second argument of root.render(...). ' + "You don't need to pass it again since you already passed it to create the root.");
    } else if (typeof arguments[1] !== 'undefined') {
      console.error('You passed a second argument to root.render(...) but it only accepts ' + 'one argument.');
    }
  }

  updateContainer(children, root, null, null);
};

ReactDOMHydrationRoot.prototype.unmount = ReactDOMRoot.prototype.unmount = function () {
  {
    if (typeof arguments[0] === 'function') {
      console.error('does not support a callback argument. ' + 'To execute a side effect after rendering, declare it in a component body with useEffect().');
    }
  }

  const root = this._internalRoot;

  if (root !== null) {
    this._internalRoot = null;
    const container = root.containerInfo;

    {
      if (isAlreadyRendering()) {
        console.error('Attempted to synchronously unmount a root while React was already ' + 'rendering. React cannot finish unmounting the root until the ' + 'current render has completed, which may lead to a race condition.');
      }
    }

    updateContainerSync(null, root, null, null);
    flushSyncWork$1();
    unmarkContainerAsRoot(container);
  }
};

function createRoot(container, options) {
  if (!isValidContainer(container)) {
    throw new Error('Target container is not a DOM element.');
  }

  warnIfReactDOMContainerInDEV(container);
  const concurrentUpdatesByDefaultOverride = false;
  let isStrictMode = false;
  let identifierPrefix = '';
  let onUncaughtError = defaultOnUncaughtError;
  let onCaughtError = defaultOnCaughtError;
  let onRecoverableError = defaultOnRecoverableError;
  let transitionCallbacks = null;

  if (options !== null && options !== undefined) {
    {
      if (options.hydrate) {
        console.warn('hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.');
      } else {
        if (typeof options === 'object' && options !== null && options.$$typeof === REACT_ELEMENT_TYPE) {
          console.error('You passed a JSX element to createRoot. You probably meant to ' + 'call root.render instead. ' + 'Example usage:\n\n' + '  let root = createRoot(domContainer);\n' + '  root.render(<App />);');
        }
      }
    }

    if (options.unstable_strictMode === true) {
      isStrictMode = true;
    }

    if (options.identifierPrefix !== undefined) {
      identifierPrefix = options.identifierPrefix;
    }

    if (options.onUncaughtError !== undefined) {
      onUncaughtError = options.onUncaughtError;
    }

    if (options.onCaughtError !== undefined) {
      onCaughtError = options.onCaughtError;
    }

    if (options.onRecoverableError !== undefined) {
      onRecoverableError = options.onRecoverableError;
    }

    if (options.unstable_transitionCallbacks !== undefined) {
      transitionCallbacks = options.unstable_transitionCallbacks;
    }
  }

  const root = createContainer(container, ConcurrentRoot, null, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, transitionCallbacks);
  markContainerAsRoot(root.current, container);
  const rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
  listenToAllSupportedEvents(rootContainerElement);
  return new ReactDOMRoot(root);
}

function ReactDOMHydrationRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

function scheduleHydration(target) {
  if (target) {
    queueExplicitHydrationTarget(target);
  }
}

ReactDOMHydrationRoot.prototype.unstable_scheduleHydration = scheduleHydration;
function hydrateRoot(container, initialChildren, options) {
  if (!isValidContainer(container)) {
    throw new Error('Target container is not a DOM element.');
  }

  warnIfReactDOMContainerInDEV(container);

  {
    if (initialChildren === undefined) {
      console.error('Must provide initial children as second argument to hydrateRoot. ' + 'Example usage: hydrateRoot(domContainer, <App />)');
    }
  }

  const hydrationCallbacks = options != null ? options : null;
  const concurrentUpdatesByDefaultOverride = false;
  let isStrictMode = false;
  let identifierPrefix = '';
  let onUncaughtError = defaultOnUncaughtError;
  let onCaughtError = defaultOnCaughtError;
  let onRecoverableError = defaultOnRecoverableError;
  let transitionCallbacks = null;
  let formState = null;

  if (options !== null && options !== undefined) {
    if (options.unstable_strictMode === true) {
      isStrictMode = true;
    }

    if (options.identifierPrefix !== undefined) {
      identifierPrefix = options.identifierPrefix;
    }

    if (options.onUncaughtError !== undefined) {
      onUncaughtError = options.onUncaughtError;
    }

    if (options.onCaughtError !== undefined) {
      onCaughtError = options.onCaughtError;
    }

    if (options.onRecoverableError !== undefined) {
      onRecoverableError = options.onRecoverableError;
    }

    if (options.unstable_transitionCallbacks !== undefined) {
      transitionCallbacks = options.unstable_transitionCallbacks;
    }

    {
      if (options.formState !== undefined) {
        formState = options.formState;
      }
    }
  }

  const root = createHydrationContainer(initialChildren, null, container, ConcurrentRoot, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, transitionCallbacks, formState);
  markContainerAsRoot(root.current, container);
  listenToAllSupportedEvents(container);
  return new ReactDOMHydrationRoot(root);
}

function warnIfReactDOMContainerInDEV(container) {
  {
    if (isContainerMarkedAsRoot(container)) {
      if (container._reactRootContainer) {
        console.error('You are calling ReactDOMClient.createRoot() on a container that was previously ' + 'passed to ReactDOM.render(). This is not supported.');
      } else {
        console.error('You are calling ReactDOMClient.createRoot() on a container that ' + 'has already been passed to createRoot() before. Instead, call ' + 'root.render() on the existing root instead if you want to update it.');
      }
    }
  }
}

function ensureCorrectIsomorphicReactVersion() {
  const isomorphicReactPackageVersion = React.version;

  if (isomorphicReactPackageVersion !== reactDOMPackageVersion) {
    throw new Error('Incompatible React versions: The "react" and "react-dom" packages must ' + 'have the exact same version. Instead got:\n' + `  - react:      ${isomorphicReactPackageVersion}\n` + `  - react-dom:  ${reactDOMPackageVersion}\n` + 'Learn more: https://react.dev/warnings/version-mismatch');
  }
}

ensureCorrectIsomorphicReactVersion();

{
  if (typeof Map !== 'function' || Map.prototype == null || typeof Map.prototype.forEach !== 'function' || typeof Set !== 'function' || Set.prototype == null || typeof Set.prototype.clear !== 'function' || typeof Set.prototype.forEach !== 'function') {
    console.error('React depends on Map and Set built-in types. Make sure that you load a ' + 'polyfill in older browsers. https://react.dev/link/react-polyfills');
  }
}

function findDOMNode(componentOrElement) {
  return findHostInstance(componentOrElement);
}

ReactDOMSharedInternals.findDOMNode = findDOMNode;
const foundDevTools = injectIntoDevTools();

{
  if (!foundDevTools && canUseDOM && window.top === window.self) {
    if (navigator.userAgent.indexOf('Chrome') > -1 && navigator.userAgent.indexOf('Edge') === -1 || navigator.userAgent.indexOf('Firefox') > -1) {
      const protocol = window.location.protocol;

      if (/^(https?|file):$/.test(protocol)) {
        console.info('%cDownload the React DevTools ' + 'for a better development experience: ' + 'https://react.dev/link/react-devtools' + (protocol === 'file:' ? '\nYou might need to use a local HTTP server (instead of file://): ' + 'https://react.dev/link/react-devtools-faq' : ''), 'font-weight:bold');
      }
    }
  }
}

const ReactDOMClient = /*#__PURE__*/Object.defineProperty({
  __proto__: null,
  createRoot,
  hydrateRoot,
  version: reactDOMPackageVersion
}, Symbol.toStringTag, { value: 'Module' });

export { createRoot, ReactDOMClient as default, hydrateRoot, reactDOMPackageVersion as version };
//# sourceMappingURL=react-dom-client.esm.js.map
