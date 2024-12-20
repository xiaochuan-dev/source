import * as React from 'react';

const NoEventPriority = 0;

function noop() {}

function requestFormReset$1(element) {
  throw new Error('Invalid form element. requestFormReset must be passed a form that was ' + 'rendered by React.');
}

const DefaultDispatcher = {
  f: noop,
  r: requestFormReset$1,
  D: noop,
  C: noop,
  L: noop,
  m: noop,
  X: noop,
  S: noop,
  M: noop
};
const Internals = {
  d: DefaultDispatcher,
  p: NoEventPriority,
  findDOMNode: null
};

const ReactVersion = '19.0.0-rc-0cb05427-20241220';

const disableCommentsAsDOMContainers = true;

const ELEMENT_NODE = 1;
const DOCUMENT_NODE = 9;
const DOCUMENT_FRAGMENT_NODE = 11;

function isValidContainer(node) {
  return !!(node && (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE || !disableCommentsAsDOMContainers  ));
}

const REACT_PORTAL_TYPE = Symbol.for('react.portal');

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
function checkKeyStringCoercion(value) {
  {
    if (willCoercionThrow(value)) {
      console.error('The provided key is an unsupported type %s.' + ' This value must be coerced to a string before using it here.', typeName(value));
      return testStringCoercion(value);
    }
  }
}

function createPortal$1(children, containerInfo, implementation, key = null) {
  {
    checkKeyStringCoercion(key);
  }

  return {
    $$typeof: REACT_PORTAL_TYPE,
    key: key == null ? null : '' + key,
    children,
    containerInfo,
    implementation
  };
}

const localSetImmediate = typeof setImmediate !== 'undefined' ? setImmediate : null;

const performWorkUntilDeadline = () => {
};

if (typeof localSetImmediate === 'function') ; else if (typeof MessageChannel !== 'undefined') {
  const channel = new MessageChannel();
  channel.port1.onmessage = performWorkUntilDeadline;
} else ;

const SyncLane = 0b0000000000000000000000000000010;

const DiscreteEventPriority = SyncLane;

const ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

function flushSyncImpl(fn) {
  const previousTransition = ReactSharedInternals.T;
  const previousUpdatePriority = Internals.p;

  try {
    ReactSharedInternals.T = null;
    Internals.p = DiscreteEventPriority;

    if (fn) {
      return fn();
    } else {
      return undefined;
    }
  } finally {
    ReactSharedInternals.T = previousTransition;
    Internals.p = previousUpdatePriority;
    const wasInRender = Internals.d.f();

    {
      if (wasInRender) {
        console.error('flushSync was called from inside a lifecycle method. React cannot ' + 'flush when React is already rendering. Consider moving this call to ' + 'a scheduler task or micro task.');
      }
    }
  }
}

const flushSync = flushSyncImpl ;

function getCrossOriginString(input) {
  if (typeof input === 'string') {
    return input === 'use-credentials' ? input : '';
  }

  return undefined;
}
function getCrossOriginStringAs(as, input) {
  if (as === 'font') {
    return '';
  }

  if (typeof input === 'string') {
    return input === 'use-credentials' ? input : '';
  }

  return undefined;
}

function prefetchDNS(href) {
  {
    if (typeof href !== 'string' || !href) {
      console.error('ReactDOM.prefetchDNS(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.', getValueDescriptorExpectingObjectForWarning(href));
    } else if (arguments.length > 1) {
      const options = arguments[1];

      if (typeof options === 'object' && options.hasOwnProperty('crossOrigin')) {
        console.error('ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. It looks like the you are attempting to set a crossOrigin property for this DNS lookup hint. Browsers do not perform DNS queries using CORS and setting this attribute on the resource hint has no effect. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.', getValueDescriptorExpectingEnumForWarning(options));
      } else {
        console.error('ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.', getValueDescriptorExpectingEnumForWarning(options));
      }
    }
  }

  if (typeof href === 'string') {
    Internals.d.D(href);
  }
}
function preconnect(href, options) {
  {
    if (typeof href !== 'string' || !href) {
      console.error('ReactDOM.preconnect(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.', getValueDescriptorExpectingObjectForWarning(href));
    } else if (options != null && typeof options !== 'object') {
      console.error('ReactDOM.preconnect(): Expected the `options` argument (second) to be an object but encountered %s instead. The only supported option at this time is `crossOrigin` which accepts a string.', getValueDescriptorExpectingEnumForWarning(options));
    } else if (options != null && typeof options.crossOrigin !== 'string') {
      console.error('ReactDOM.preconnect(): Expected the `crossOrigin` option (second argument) to be a string but encountered %s instead. Try removing this option or passing a string value instead.', getValueDescriptorExpectingObjectForWarning(options.crossOrigin));
    }
  }

  if (typeof href === 'string') {
    const crossOrigin = options ? getCrossOriginString(options.crossOrigin) : null;
    Internals.d.C(href, crossOrigin);
  }
}
function preload(href, options) {
  {
    let encountered = '';

    if (typeof href !== 'string' || !href) {
      encountered += ` The \`href\` argument encountered was ${getValueDescriptorExpectingObjectForWarning(href)}.`;
    }

    if (options == null || typeof options !== 'object') {
      encountered += ` The \`options\` argument encountered was ${getValueDescriptorExpectingObjectForWarning(options)}.`;
    } else if (typeof options.as !== 'string' || !options.as) {
      encountered += ` The \`as\` option encountered was ${getValueDescriptorExpectingObjectForWarning(options.as)}.`;
    }

    if (encountered) {
      console.error('ReactDOM.preload(): Expected two arguments, a non-empty `href` string and an `options` object with an `as` property valid for a `<link rel="preload" as="..." />` tag.%s', encountered);
    }
  }

  if (typeof href === 'string' && typeof options === 'object' && options !== null && typeof options.as === 'string') {
    const as = options.as;
    const crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
    Internals.d.L(href, as, {
      crossOrigin,
      integrity: typeof options.integrity === 'string' ? options.integrity : undefined,
      nonce: typeof options.nonce === 'string' ? options.nonce : undefined,
      type: typeof options.type === 'string' ? options.type : undefined,
      fetchPriority: typeof options.fetchPriority === 'string' ? options.fetchPriority : undefined,
      referrerPolicy: typeof options.referrerPolicy === 'string' ? options.referrerPolicy : undefined,
      imageSrcSet: typeof options.imageSrcSet === 'string' ? options.imageSrcSet : undefined,
      imageSizes: typeof options.imageSizes === 'string' ? options.imageSizes : undefined,
      media: typeof options.media === 'string' ? options.media : undefined
    });
  }
}
function preloadModule(href, options) {
  {
    let encountered = '';

    if (typeof href !== 'string' || !href) {
      encountered += ` The \`href\` argument encountered was ${getValueDescriptorExpectingObjectForWarning(href)}.`;
    }

    if (options !== undefined && typeof options !== 'object') {
      encountered += ` The \`options\` argument encountered was ${getValueDescriptorExpectingObjectForWarning(options)}.`;
    } else if (options && 'as' in options && typeof options.as !== 'string') {
      encountered += ` The \`as\` option encountered was ${getValueDescriptorExpectingObjectForWarning(options.as)}.`;
    }

    if (encountered) {
      console.error('ReactDOM.preloadModule(): Expected two arguments, a non-empty `href` string and, optionally, an `options` object with an `as` property valid for a `<link rel="modulepreload" as="..." />` tag.%s', encountered);
    }
  }

  if (typeof href === 'string') {
    if (options) {
      const crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
      Internals.d.m(href, {
        as: typeof options.as === 'string' && options.as !== 'script' ? options.as : undefined,
        crossOrigin,
        integrity: typeof options.integrity === 'string' ? options.integrity : undefined
      });
    } else {
      Internals.d.m(href);
    }
  }
}
function preinit(href, options) {
  {
    if (typeof href !== 'string' || !href) {
      console.error('ReactDOM.preinit(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.', getValueDescriptorExpectingObjectForWarning(href));
    } else if (options == null || typeof options !== 'object') {
      console.error('ReactDOM.preinit(): Expected the `options` argument (second) to be an object with an `as` property describing the type of resource to be preinitialized but encountered %s instead.', getValueDescriptorExpectingEnumForWarning(options));
    } else if (options.as !== 'style' && options.as !== 'script') {
      console.error('ReactDOM.preinit(): Expected the `as` property in the `options` argument (second) to contain a valid value describing the type of resource to be preinitialized but encountered %s instead. Valid values for `as` are "style" and "script".', getValueDescriptorExpectingEnumForWarning(options.as));
    }
  }

  if (typeof href === 'string' && options && typeof options.as === 'string') {
    const as = options.as;
    const crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
    const integrity = typeof options.integrity === 'string' ? options.integrity : undefined;
    const fetchPriority = typeof options.fetchPriority === 'string' ? options.fetchPriority : undefined;

    if (as === 'style') {
      Internals.d.S(href, typeof options.precedence === 'string' ? options.precedence : undefined, {
        crossOrigin,
        integrity,
        fetchPriority
      });
    } else if (as === 'script') {
      Internals.d.X(href, {
        crossOrigin,
        integrity,
        fetchPriority,
        nonce: typeof options.nonce === 'string' ? options.nonce : undefined
      });
    }
  }
}
function preinitModule(href, options) {
  {
    let encountered = '';

    if (typeof href !== 'string' || !href) {
      encountered += ` The \`href\` argument encountered was ${getValueDescriptorExpectingObjectForWarning(href)}.`;
    }

    if (options !== undefined && typeof options !== 'object') {
      encountered += ` The \`options\` argument encountered was ${getValueDescriptorExpectingObjectForWarning(options)}.`;
    } else if (options && 'as' in options && options.as !== 'script') {
      encountered += ` The \`as\` option encountered was ${getValueDescriptorExpectingEnumForWarning(options.as)}.`;
    }

    if (encountered) {
      console.error('ReactDOM.preinitModule(): Expected up to two arguments, a non-empty `href` string and, optionally, an `options` object with a valid `as` property.%s', encountered);
    } else {
      const as = options && typeof options.as === 'string' ? options.as : 'script';

      switch (as) {
        case 'script':
          {
            break;
          }

        default:
          {
            const typeOfAs = getValueDescriptorExpectingEnumForWarning(as);
            console.error('ReactDOM.preinitModule(): Currently the only supported "as" type for this function is "script"' + ' but received "%s" instead. This warning was generated for `href` "%s". In the future other' + ' module types will be supported, aligning with the import-attributes proposal. Learn more here:' + ' (https://github.com/tc39/proposal-import-attributes)', typeOfAs, href);
          }
      }
    }
  }

  if (typeof href === 'string') {
    if (typeof options === 'object' && options !== null) {
      if (options.as == null || options.as === 'script') {
        const crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
        Internals.d.M(href, {
          crossOrigin,
          integrity: typeof options.integrity === 'string' ? options.integrity : undefined,
          nonce: typeof options.nonce === 'string' ? options.nonce : undefined
        });
      }
    } else if (options == null) {
      Internals.d.M(href);
    }
  }
}

function getValueDescriptorExpectingObjectForWarning(thing) {
  return thing === null ? '`null`' : thing === undefined ? '`undefined`' : thing === '' ? 'an empty string' : `something with type "${typeof thing}"`;
}

function getValueDescriptorExpectingEnumForWarning(thing) {
  return thing === null ? '`null`' : thing === undefined ? '`undefined`' : thing === '' ? 'an empty string' : typeof thing === 'string' ? JSON.stringify(thing) : typeof thing === 'number' ? '`' + thing + '`' : `something with type "${typeof thing}"`;
}

function resolveDispatcher() {
  const dispatcher = ReactSharedInternals.H;

  {
    if (dispatcher === null) {
      console.error('Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' + ' one of the following reasons:\n' + '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' + '2. You might be breaking the Rules of Hooks\n' + '3. You might have more than one copy of React in the same app\n' + 'See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.');
    }
  }

  return dispatcher;
}

function useFormStatus() {
  {
    const dispatcher = resolveDispatcher();
    return dispatcher.useHostTransitionStatus();
  }
}
function useFormState(action, initialState, permalink) {
  {
    const dispatcher = resolveDispatcher();
    return dispatcher.useFormState(action, initialState, permalink);
  }
}
function requestFormReset(form) {
  Internals.d.r(form);
}

{
  if (typeof Map !== 'function' || Map.prototype == null || typeof Map.prototype.forEach !== 'function' || typeof Set !== 'function' || Set.prototype == null || typeof Set.prototype.clear !== 'function' || typeof Set.prototype.forEach !== 'function') {
    console.error('React depends on Map and Set built-in types. Make sure that you load a ' + 'polyfill in older browsers. https://reactjs.org/link/react-polyfills');
  }
}

function batchedUpdates(fn, a) {
  return fn(a);
}

function createPortal(children, container, key = null) {
  if (!isValidContainer(container)) {
    throw new Error('Target container is not a DOM element.');
  }

  return createPortal$1(children, container, null, key);
}

const ReactDOM = /*#__PURE__*/Object.defineProperty({
  __proto__: null,
  __DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE: Internals,
  createPortal,
  flushSync,
  preconnect,
  prefetchDNS,
  preinit,
  preinitModule,
  preload,
  preloadModule,
  requestFormReset,
  unstable_batchedUpdates: batchedUpdates,
  useFormState,
  useFormStatus,
  version: ReactVersion
}, Symbol.toStringTag, { value: 'Module' });

export { Internals as __DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, createPortal, ReactDOM as default, flushSync, preconnect, prefetchDNS, preinit, preinitModule, preload, preloadModule, requestFormReset, batchedUpdates as unstable_batchedUpdates, useFormState, useFormStatus, ReactVersion as version };
//# sourceMappingURL=react-dom.esm.js.map
