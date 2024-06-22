(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["immer"] = factory();
	else
		root["immer"] = factory();
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
  Immer: () => (/* reexport */ Immer),
  applyPatches: () => (/* binding */ applyPatches),
  castDraft: () => (/* binding */ castDraft),
  castImmutable: () => (/* binding */ castImmutable),
  createDraft: () => (/* binding */ createDraft),
  current: () => (/* reexport */ current),
  enableMapSet: () => (/* reexport */ enableMapSet),
  enablePatches: () => (/* reexport */ enablePatches),
  finishDraft: () => (/* binding */ finishDraft),
  freeze: () => (/* reexport */ freeze),
  immerable: () => (/* reexport */ DRAFTABLE),
  isDraft: () => (/* reexport */ isDraft),
  isDraftable: () => (/* reexport */ isDraftable),
  nothing: () => (/* reexport */ NOTHING),
  original: () => (/* reexport */ original),
  produce: () => (/* binding */ produce),
  produceWithPatches: () => (/* binding */ produceWithPatches),
  setAutoFreeze: () => (/* binding */ setAutoFreeze),
  setUseStrictShallowCopy: () => (/* binding */ setUseStrictShallowCopy)
});

;// CONCATENATED MODULE: ./src/utils/errors.ts
const errors =  false
    ? 0
    : [];
function die(error, ...args) {
    if (false) {}
    throw new Error(`[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`);
}

;// CONCATENATED MODULE: ./src/utils/env.ts
// Should be no imports here!
/**
 * The sentinel value returned by producers to replace the draft with undefined.
 */
const NOTHING = Symbol.for("immer-nothing");
/**
 * To let Immer treat your class instances as plain immutable objects
 * (albeit with a custom prototype), you must define either an instance property
 * or a static property on each of your custom classes.
 *
 * Otherwise, your class instance will never be drafted, which means it won't be
 * safe to mutate in a produce callback.
 */
const DRAFTABLE = Symbol.for("immer-draftable");
const DRAFT_STATE = Symbol.for("immer-state");

;// CONCATENATED MODULE: ./src/utils/common.ts

const getPrototypeOf = Object.getPrototypeOf;
/** Returns true if the given value is an Immer draft */
/*#__PURE__*/
function isDraft(value) {
    return !!value && !!value[DRAFT_STATE];
}
/** Returns true if the given value can be drafted by Immer */
/*#__PURE__*/
function isDraftable(value) {
    if (!value)
        return false;
    return (isPlainObject(value) ||
        Array.isArray(value) ||
        !!value[DRAFTABLE] ||
        !!value.constructor?.[DRAFTABLE] ||
        isMap(value) ||
        isSet(value));
}
const objectCtorString = Object.prototype.constructor.toString();
/*#__PURE__*/
function isPlainObject(value) {
    if (!value || typeof value !== "object")
        return false;
    const proto = getPrototypeOf(value);
    if (proto === null) {
        return true;
    }
    const Ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
    if (Ctor === Object)
        return true;
    return (typeof Ctor == "function" &&
        Function.toString.call(Ctor) === objectCtorString);
}
function original(value) {
    if (!isDraft(value))
        die(15, value);
    return value[DRAFT_STATE].base_;
}
function each(obj, iter) {
    if (getArchtype(obj) === 0 /* ArchType.Object */) {
        Reflect.ownKeys(obj).forEach(key => {
            iter(key, obj[key], obj);
        });
    }
    else {
        obj.forEach((entry, index) => iter(index, entry, obj));
    }
}
/*#__PURE__*/
function getArchtype(thing) {
    const state = thing[DRAFT_STATE];
    return state
        ? state.type_
        : Array.isArray(thing)
            ? 1 /* ArchType.Array */
            : isMap(thing)
                ? 2 /* ArchType.Map */
                : isSet(thing)
                    ? 3 /* ArchType.Set */
                    : 0 /* ArchType.Object */;
}
/*#__PURE__*/
function has(thing, prop) {
    return getArchtype(thing) === 2 /* ArchType.Map */
        ? thing.has(prop)
        : Object.prototype.hasOwnProperty.call(thing, prop);
}
/*#__PURE__*/
function get(thing, prop) {
    // @ts-ignore
    return getArchtype(thing) === 2 /* ArchType.Map */ ? thing.get(prop) : thing[prop];
}
/*#__PURE__*/
function set(thing, propOrOldValue, value) {
    const t = getArchtype(thing);
    if (t === 2 /* ArchType.Map */)
        thing.set(propOrOldValue, value);
    else if (t === 3 /* ArchType.Set */) {
        thing.add(value);
    }
    else
        thing[propOrOldValue] = value;
}
/*#__PURE__*/
function is(x, y) {
    // From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    }
    else {
        return x !== x && y !== y;
    }
}
/*#__PURE__*/
function isMap(target) {
    return target instanceof Map;
}
/*#__PURE__*/
function isSet(target) {
    return target instanceof Set;
}
/*#__PURE__*/
function latest(state) {
    return state.copy_ || state.base_;
}
/*#__PURE__*/
function shallowCopy(base, strict) {
    if (isMap(base)) {
        return new Map(base);
    }
    if (isSet(base)) {
        return new Set(base);
    }
    if (Array.isArray(base))
        return Array.prototype.slice.call(base);
    const isPlain = isPlainObject(base);
    if (strict === true || (strict === "class_only" && !isPlain)) {
        // Perform a strict copy
        const descriptors = Object.getOwnPropertyDescriptors(base);
        delete descriptors[DRAFT_STATE];
        let keys = Reflect.ownKeys(descriptors);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const desc = descriptors[key];
            if (desc.writable === false) {
                desc.writable = true;
                desc.configurable = true;
            }
            // like object.assign, we will read any _own_, get/set accessors. This helps in dealing
            // with libraries that trap values, like mobx or vue
            // unlike object.assign, non-enumerables will be copied as well
            if (desc.get || desc.set)
                descriptors[key] = {
                    configurable: true,
                    writable: true, // could live with !!desc.set as well here...
                    enumerable: desc.enumerable,
                    value: base[key]
                };
        }
        return Object.create(getPrototypeOf(base), descriptors);
    }
    else {
        // perform a sloppy copy
        const proto = getPrototypeOf(base);
        if (proto !== null && isPlain) {
            return { ...base }; // assumption: better inner class optimization than the assign below
        }
        const obj = Object.create(proto);
        return Object.assign(obj, base);
    }
}
function freeze(obj, deep = false) {
    if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
        return obj;
    if (getArchtype(obj) > 1 /* Map or Set */) {
        obj.set = obj.add = obj.clear = obj.delete = dontMutateFrozenCollections;
    }
    Object.freeze(obj);
    if (deep)
        // See #590, don't recurse into non-enumerable / Symbol properties when freezing
        // So use Object.entries (only string-like, enumerables) instead of each()
        Object.entries(obj).forEach(([key, value]) => freeze(value, true));
    return obj;
}
function dontMutateFrozenCollections() {
    die(2);
}
function isFrozen(obj) {
    return Object.isFrozen(obj);
}

;// CONCATENATED MODULE: ./src/utils/plugins.ts

/** Plugin utilities */
const plugins = {};
function getPlugin(pluginKey) {
    const plugin = plugins[pluginKey];
    if (!plugin) {
        die(0, pluginKey);
    }
    // @ts-ignore
    return plugin;
}
function loadPlugin(pluginKey, implementation) {
    if (!plugins[pluginKey])
        plugins[pluginKey] = implementation;
}

;// CONCATENATED MODULE: ./src/core/scope.ts

let currentScope;
function getCurrentScope() {
    return currentScope;
}
function createScope(parent_, immer_) {
    return {
        drafts_: [],
        parent_,
        immer_,
        // Whenever the modified draft contains a draft from another scope, we
        // need to prevent auto-freezing so the unowned draft can be finalized.
        canAutoFreeze_: true,
        unfinalizedDrafts_: 0
    };
}
function usePatchesInScope(scope, patchListener) {
    if (patchListener) {
        getPlugin("Patches"); // assert we have the plugin
        scope.patches_ = [];
        scope.inversePatches_ = [];
        scope.patchListener_ = patchListener;
    }
}
function revokeScope(scope) {
    leaveScope(scope);
    scope.drafts_.forEach(revokeDraft);
    // @ts-ignore
    scope.drafts_ = null;
}
function leaveScope(scope) {
    if (scope === currentScope) {
        currentScope = scope.parent_;
    }
}
function enterScope(immer) {
    return (currentScope = createScope(currentScope, immer));
}
function revokeDraft(draft) {
    const state = draft[DRAFT_STATE];
    if (state.type_ === 0 /* ArchType.Object */ || state.type_ === 1 /* ArchType.Array */)
        state.revoke_();
    else
        state.revoked_ = true;
}

;// CONCATENATED MODULE: ./src/core/finalize.ts

function processResult(result, scope) {
    scope.unfinalizedDrafts_ = scope.drafts_.length;
    const baseDraft = scope.drafts_[0];
    const isReplaced = result !== undefined && result !== baseDraft;
    if (isReplaced) {
        if (baseDraft[DRAFT_STATE].modified_) {
            revokeScope(scope);
            die(4);
        }
        if (isDraftable(result)) {
            // Finalize the result in case it contains (or is) a subset of the draft.
            result = finalize(scope, result);
            if (!scope.parent_)
                maybeFreeze(scope, result);
        }
        if (scope.patches_) {
            getPlugin("Patches").generateReplacementPatches_(baseDraft[DRAFT_STATE].base_, result, scope.patches_, scope.inversePatches_);
        }
    }
    else {
        // Finalize the base draft.
        result = finalize(scope, baseDraft, []);
    }
    revokeScope(scope);
    if (scope.patches_) {
        scope.patchListener_(scope.patches_, scope.inversePatches_);
    }
    return result !== NOTHING ? result : undefined;
}
function finalize(rootScope, value, path) {
    // Don't recurse in tho recursive data structures
    if (isFrozen(value))
        return value;
    const state = value[DRAFT_STATE];
    // A plain object, might need freezing, might contain drafts
    if (!state) {
        each(value, (key, childValue) => finalizeProperty(rootScope, state, value, key, childValue, path));
        return value;
    }
    // Never finalize drafts owned by another scope.
    if (state.scope_ !== rootScope)
        return value;
    // Unmodified draft, return the (frozen) original
    if (!state.modified_) {
        maybeFreeze(rootScope, state.base_, true);
        return state.base_;
    }
    // Not finalized yet, let's do that now
    if (!state.finalized_) {
        state.finalized_ = true;
        state.scope_.unfinalizedDrafts_--;
        const result = state.copy_;
        // Finalize all children of the copy
        // For sets we clone before iterating, otherwise we can get in endless loop due to modifying during iteration, see #628
        // To preserve insertion order in all cases we then clear the set
        // And we let finalizeProperty know it needs to re-add non-draft children back to the target
        let resultEach = result;
        let isSet = false;
        if (state.type_ === 3 /* ArchType.Set */) {
            resultEach = new Set(result);
            result.clear();
            isSet = true;
        }
        each(resultEach, (key, childValue) => finalizeProperty(rootScope, state, result, key, childValue, path, isSet));
        // everything inside is frozen, we can freeze here
        maybeFreeze(rootScope, result, false);
        // first time finalizing, let's create those patches
        if (path && rootScope.patches_) {
            getPlugin("Patches").generatePatches_(state, path, rootScope.patches_, rootScope.inversePatches_);
        }
    }
    return state.copy_;
}
function finalizeProperty(rootScope, parentState, targetObject, prop, childValue, rootPath, targetIsSet) {
    if (false)
        {}
    if (isDraft(childValue)) {
        const path = rootPath &&
            parentState &&
            parentState.type_ !== 3 /* ArchType.Set */ && // Set objects are atomic since they have no keys.
            !has(parentState.assigned_, prop) // Skip deep patches for assigned keys.
            ? rootPath.concat(prop)
            : undefined;
        // Drafts owned by `scope` are finalized here.
        const res = finalize(rootScope, childValue, path);
        set(targetObject, prop, res);
        // Drafts from another scope must prevented to be frozen
        // if we got a draft back from finalize, we're in a nested produce and shouldn't freeze
        if (isDraft(res)) {
            rootScope.canAutoFreeze_ = false;
        }
        else
            return;
    }
    else if (targetIsSet) {
        targetObject.add(childValue);
    }
    // Search new objects for unfinalized drafts. Frozen objects should never contain drafts.
    if (isDraftable(childValue) && !isFrozen(childValue)) {
        if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
            // optimization: if an object is not a draft, and we don't have to
            // deepfreeze everything, and we are sure that no drafts are left in the remaining object
            // cause we saw and finalized all drafts already; we can stop visiting the rest of the tree.
            // This benefits especially adding large data tree's without further processing.
            // See add-data.js perf test
            return;
        }
        finalize(rootScope, childValue);
        // Immer deep freezes plain objects, so if there is no parent state, we freeze as well
        // Per #590, we never freeze symbolic properties. Just to make sure don't accidentally interfere
        // with other frameworks.
        if ((!parentState || !parentState.scope_.parent_) &&
            typeof prop !== "symbol" &&
            Object.prototype.propertyIsEnumerable.call(targetObject, prop))
            maybeFreeze(rootScope, childValue);
    }
}
function maybeFreeze(scope, value, deep = false) {
    // we never freeze for a non-root scope; as it would prevent pruning for drafts inside wrapping objects
    if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
        freeze(value, deep);
    }
}

;// CONCATENATED MODULE: ./src/core/current.ts

function current(value) {
    if (!isDraft(value))
        die(10, value);
    return currentImpl(value);
}
function currentImpl(value) {
    if (!isDraftable(value) || isFrozen(value))
        return value;
    const state = value[DRAFT_STATE];
    let copy;
    if (state) {
        if (!state.modified_)
            return state.base_;
        // Optimization: avoid generating new drafts during copying
        state.finalized_ = true;
        copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
    }
    else {
        copy = shallowCopy(value, true);
    }
    // recurse
    each(copy, (key, childValue) => {
        set(copy, key, currentImpl(childValue));
    });
    if (state) {
        state.finalized_ = false;
    }
    return copy;
}

;// CONCATENATED MODULE: ./src/core/proxy.ts

/**
 * Returns a new draft of the `base` object.
 *
 * The second argument is the parent draft-state (used internally).
 */
function createProxyProxy(base, parent) {
    const isArray = Array.isArray(base);
    const state = {
        type_: isArray ? 1 /* ArchType.Array */ : 0 /* ArchType.Object */,
        // Track which produce call this is associated with.
        scope_: parent ? parent.scope_ : getCurrentScope(),
        // True for both shallow and deep changes.
        modified_: false,
        // Used during finalization.
        finalized_: false,
        // Track which properties have been assigned (true) or deleted (false).
        assigned_: {},
        // The parent draft state.
        parent_: parent,
        // The base state.
        base_: base,
        // The base proxy.
        draft_: null, // set below
        // The base copy with any updated values.
        copy_: null,
        // Called by the `produce` function.
        revoke_: null,
        isManual_: false
    };
    // the traps must target something, a bit like the 'real' base.
    // but also, we need to be able to determine from the target what the relevant state is
    // (to avoid creating traps per instance to capture the state in closure,
    // and to avoid creating weird hidden properties as well)
    // So the trick is to use 'state' as the actual 'target'! (and make sure we intercept everything)
    // Note that in the case of an array, we put the state in an array to have better Reflect defaults ootb
    let target = state;
    let traps = objectTraps;
    if (isArray) {
        target = [state];
        traps = arrayTraps;
    }
    const { revoke, proxy } = Proxy.revocable(target, traps);
    state.draft_ = proxy;
    state.revoke_ = revoke;
    return proxy;
}
/**
 * Object drafts
 */
const objectTraps = {
    get(state, prop) {
        if (prop === DRAFT_STATE)
            return state;
        const source = latest(state);
        if (!has(source, prop)) {
            // non-existing or non-own property...
            return readPropFromProto(state, source, prop);
        }
        const value = source[prop];
        if (state.finalized_ || !isDraftable(value)) {
            return value;
        }
        // Check for existing draft in modified state.
        // Assigned values are never drafted. This catches any drafts we created, too.
        if (value === peek(state.base_, prop)) {
            prepareCopy(state);
            return (state.copy_[prop] = createProxy(value, state));
        }
        return value;
    },
    has(state, prop) {
        return prop in latest(state);
    },
    ownKeys(state) {
        return Reflect.ownKeys(latest(state));
    },
    set(state, prop /* strictly not, but helps TS */, value) {
        const desc = getDescriptorFromProto(latest(state), prop);
        if (desc?.set) {
            // special case: if this write is captured by a setter, we have
            // to trigger it with the correct context
            desc.set.call(state.draft_, value);
            return true;
        }
        if (!state.modified_) {
            // the last check is because we need to be able to distinguish setting a non-existing to undefined (which is a change)
            // from setting an existing property with value undefined to undefined (which is not a change)
            const current = peek(latest(state), prop);
            // special case, if we assigning the original value to a draft, we can ignore the assignment
            const currentState = current?.[DRAFT_STATE];
            if (currentState && currentState.base_ === value) {
                state.copy_[prop] = value;
                state.assigned_[prop] = false;
                return true;
            }
            if (is(value, current) && (value !== undefined || has(state.base_, prop)))
                return true;
            prepareCopy(state);
            markChanged(state);
        }
        if ((state.copy_[prop] === value &&
            // special case: handle new props with value 'undefined'
            (value !== undefined || prop in state.copy_)) ||
            // special case: NaN
            (Number.isNaN(value) && Number.isNaN(state.copy_[prop])))
            return true;
        // @ts-ignore
        state.copy_[prop] = value;
        state.assigned_[prop] = true;
        return true;
    },
    deleteProperty(state, prop) {
        // The `undefined` check is a fast path for pre-existing keys.
        if (peek(state.base_, prop) !== undefined || prop in state.base_) {
            state.assigned_[prop] = false;
            prepareCopy(state);
            markChanged(state);
        }
        else {
            // if an originally not assigned property was deleted
            delete state.assigned_[prop];
        }
        if (state.copy_) {
            delete state.copy_[prop];
        }
        return true;
    },
    // Note: We never coerce `desc.value` into an Immer draft, because we can't make
    // the same guarantee in ES5 mode.
    getOwnPropertyDescriptor(state, prop) {
        const owner = latest(state);
        const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
        if (!desc)
            return desc;
        return {
            writable: true,
            configurable: state.type_ !== 1 /* ArchType.Array */ || prop !== "length",
            enumerable: desc.enumerable,
            value: owner[prop]
        };
    },
    defineProperty() {
        die(11);
    },
    getPrototypeOf(state) {
        return getPrototypeOf(state.base_);
    },
    setPrototypeOf() {
        die(12);
    }
};
/**
 * Array drafts
 */
const arrayTraps = {};
each(objectTraps, (key, fn) => {
    // @ts-ignore
    arrayTraps[key] = function () {
        arguments[0] = arguments[0][0];
        return fn.apply(this, arguments);
    };
});
arrayTraps.deleteProperty = function (state, prop) {
    if (false)
        {}
    // @ts-ignore
    return arrayTraps.set.call(this, state, prop, undefined);
};
arrayTraps.set = function (state, prop, value) {
    if (false)
        {}
    return objectTraps.set.call(this, state[0], prop, value, state[0]);
};
// Access a property without creating an Immer draft.
function peek(draft, prop) {
    const state = draft[DRAFT_STATE];
    const source = state ? latest(state) : draft;
    return source[prop];
}
function readPropFromProto(state, source, prop) {
    const desc = getDescriptorFromProto(source, prop);
    return desc
        ? `value` in desc
            ? desc.value
            : // This is a very special case, if the prop is a getter defined by the
                // prototype, we should invoke it with the draft as context!
                desc.get?.call(state.draft_)
        : undefined;
}
function getDescriptorFromProto(source, prop) {
    // 'in' checks proto!
    if (!(prop in source))
        return undefined;
    let proto = getPrototypeOf(source);
    while (proto) {
        const desc = Object.getOwnPropertyDescriptor(proto, prop);
        if (desc)
            return desc;
        proto = getPrototypeOf(proto);
    }
    return undefined;
}
function markChanged(state) {
    if (!state.modified_) {
        state.modified_ = true;
        if (state.parent_) {
            markChanged(state.parent_);
        }
    }
}
function prepareCopy(state) {
    if (!state.copy_) {
        state.copy_ = shallowCopy(state.base_, state.scope_.immer_.useStrictShallowCopy_);
    }
}

;// CONCATENATED MODULE: ./src/core/immerClass.ts

class Immer {
    autoFreeze_ = true;
    useStrictShallowCopy_ = false;
    constructor(config) {
        if (typeof config?.autoFreeze === "boolean")
            this.setAutoFreeze(config.autoFreeze);
        if (typeof config?.useStrictShallowCopy === "boolean")
            this.setUseStrictShallowCopy(config.useStrictShallowCopy);
    }
    /**
     * The `produce` function takes a value and a "recipe function" (whose
     * return value often depends on the base state). The recipe function is
     * free to mutate its first argument however it wants. All mutations are
     * only ever applied to a __copy__ of the base state.
     *
     * Pass only a function to create a "curried producer" which relieves you
     * from passing the recipe function every time.
     *
     * Only plain objects and arrays are made mutable. All other objects are
     * considered uncopyable.
     *
     * Note: This function is __bound__ to its `Immer` instance.
     *
     * @param {any} base - the initial state
     * @param {Function} recipe - function that receives a proxy of the base state as first argument and which can be freely modified
     * @param {Function} patchListener - optional function that will be called with all the patches produced here
     * @returns {any} a new state, or the initial state if nothing was modified
     */
    produce = (base, recipe, patchListener) => {
        // curried invocation
        if (typeof base === "function" && typeof recipe !== "function") {
            const defaultBase = recipe;
            recipe = base;
            const self = this;
            return function curriedProduce(base = defaultBase, ...args) {
                return self.produce(base, (draft) => recipe.call(this, draft, ...args)); // prettier-ignore
            };
        }
        if (typeof recipe !== "function")
            die(6);
        if (patchListener !== undefined && typeof patchListener !== "function")
            die(7);
        let result;
        // Only plain objects, arrays, and "immerable classes" are drafted.
        if (isDraftable(base)) {
            const scope = enterScope(this);
            const proxy = createProxy(base, undefined);
            let hasError = true;
            try {
                result = recipe(proxy);
                hasError = false;
            }
            finally {
                // finally instead of catch + rethrow better preserves original stack
                if (hasError)
                    revokeScope(scope);
                else
                    leaveScope(scope);
            }
            usePatchesInScope(scope, patchListener);
            return processResult(result, scope);
        }
        else if (!base || typeof base !== "object") {
            result = recipe(base);
            if (result === undefined)
                result = base;
            if (result === NOTHING)
                result = undefined;
            if (this.autoFreeze_)
                freeze(result, true);
            if (patchListener) {
                const p = [];
                const ip = [];
                getPlugin("Patches").generateReplacementPatches_(base, result, p, ip);
                patchListener(p, ip);
            }
            return result;
        }
        else
            die(1, base);
    };
    produceWithPatches = (base, recipe) => {
        // curried invocation
        if (typeof base === "function") {
            return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
        }
        let patches, inversePatches;
        const result = this.produce(base, recipe, (p, ip) => {
            patches = p;
            inversePatches = ip;
        });
        return [result, patches, inversePatches];
    };
    createDraft(base) {
        if (!isDraftable(base))
            die(8);
        if (isDraft(base))
            base = current(base);
        const scope = enterScope(this);
        const proxy = createProxy(base, undefined);
        proxy[DRAFT_STATE].isManual_ = true;
        leaveScope(scope);
        return proxy;
    }
    finishDraft(draft, patchListener) {
        const state = draft && draft[DRAFT_STATE];
        if (!state || !state.isManual_)
            die(9);
        const { scope_: scope } = state;
        usePatchesInScope(scope, patchListener);
        return processResult(undefined, scope);
    }
    /**
     * Pass true to automatically freeze all copies created by Immer.
     *
     * By default, auto-freezing is enabled.
     */
    setAutoFreeze(value) {
        this.autoFreeze_ = value;
    }
    /**
     * Pass true to enable strict shallow copy.
     *
     * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
     */
    setUseStrictShallowCopy(value) {
        this.useStrictShallowCopy_ = value;
    }
    applyPatches(base, patches) {
        // If a patch replaces the entire state, take that replacement as base
        // before applying patches
        let i;
        for (i = patches.length - 1; i >= 0; i--) {
            const patch = patches[i];
            if (patch.path.length === 0 && patch.op === "replace") {
                base = patch.value;
                break;
            }
        }
        // If there was a patch that replaced the entire state, start from the
        // patch after that.
        if (i > -1) {
            patches = patches.slice(i + 1);
        }
        const applyPatchesImpl = getPlugin("Patches").applyPatches_;
        if (isDraft(base)) {
            // N.B: never hits if some patch a replacement, patches are never drafts
            return applyPatchesImpl(base, patches);
        }
        // Otherwise, produce a copy of the base state.
        return this.produce(base, (draft) => applyPatchesImpl(draft, patches));
    }
}
function createProxy(value, parent) {
    // precondition: createProxy should be guarded by isDraftable, so we know we can safely draft
    const draft = isMap(value)
        ? getPlugin("MapSet").proxyMap_(value, parent)
        : isSet(value)
            ? getPlugin("MapSet").proxySet_(value, parent)
            : createProxyProxy(value, parent);
    const scope = parent ? parent.scope_ : getCurrentScope();
    scope.drafts_.push(draft);
    return draft;
}

;// CONCATENATED MODULE: ./src/plugins/patches.ts


function enablePatches() {
    const errorOffset = 16;
    if (false) {}
    const REPLACE = "replace";
    const ADD = "add";
    const REMOVE = "remove";
    function generatePatches_(state, basePath, patches, inversePatches) {
        switch (state.type_) {
            case 0 /* ArchType.Object */:
            case 2 /* ArchType.Map */:
                return generatePatchesFromAssigned(state, basePath, patches, inversePatches);
            case 1 /* ArchType.Array */:
                return generateArrayPatches(state, basePath, patches, inversePatches);
            case 3 /* ArchType.Set */:
                return generateSetPatches(state, basePath, patches, inversePatches);
        }
    }
    function generateArrayPatches(state, basePath, patches, inversePatches) {
        let { base_, assigned_ } = state;
        let copy_ = state.copy_;
        // Reduce complexity by ensuring `base` is never longer.
        if (copy_.length < base_.length) {
            // @ts-ignore
            ;
            [base_, copy_] = [copy_, base_];
            [patches, inversePatches] = [inversePatches, patches];
        }
        // Process replaced indices.
        for (let i = 0; i < base_.length; i++) {
            if (assigned_[i] && copy_[i] !== base_[i]) {
                const path = basePath.concat([i]);
                patches.push({
                    op: REPLACE,
                    path,
                    // Need to maybe clone it, as it can in fact be the original value
                    // due to the base/copy inversion at the start of this function
                    value: clonePatchValueIfNeeded(copy_[i])
                });
                inversePatches.push({
                    op: REPLACE,
                    path,
                    value: clonePatchValueIfNeeded(base_[i])
                });
            }
        }
        // Process added indices.
        for (let i = base_.length; i < copy_.length; i++) {
            const path = basePath.concat([i]);
            patches.push({
                op: ADD,
                path,
                // Need to maybe clone it, as it can in fact be the original value
                // due to the base/copy inversion at the start of this function
                value: clonePatchValueIfNeeded(copy_[i])
            });
        }
        for (let i = copy_.length - 1; base_.length <= i; --i) {
            const path = basePath.concat([i]);
            inversePatches.push({
                op: REMOVE,
                path
            });
        }
    }
    // This is used for both Map objects and normal objects.
    function generatePatchesFromAssigned(state, basePath, patches, inversePatches) {
        const { base_, copy_ } = state;
        each(state.assigned_, (key, assignedValue) => {
            const origValue = get(base_, key);
            const value = get(copy_, key);
            const op = !assignedValue ? REMOVE : has(base_, key) ? REPLACE : ADD;
            if (origValue === value && op === REPLACE)
                return;
            const path = basePath.concat(key);
            patches.push(op === REMOVE ? { op, path } : { op, path, value });
            inversePatches.push(op === ADD
                ? { op: REMOVE, path }
                : op === REMOVE
                    ? { op: ADD, path, value: clonePatchValueIfNeeded(origValue) }
                    : { op: REPLACE, path, value: clonePatchValueIfNeeded(origValue) });
        });
    }
    function generateSetPatches(state, basePath, patches, inversePatches) {
        let { base_, copy_ } = state;
        let i = 0;
        base_.forEach((value) => {
            if (!copy_.has(value)) {
                const path = basePath.concat([i]);
                patches.push({
                    op: REMOVE,
                    path,
                    value
                });
                inversePatches.unshift({
                    op: ADD,
                    path,
                    value
                });
            }
            i++;
        });
        i = 0;
        copy_.forEach((value) => {
            if (!base_.has(value)) {
                const path = basePath.concat([i]);
                patches.push({
                    op: ADD,
                    path,
                    value
                });
                inversePatches.unshift({
                    op: REMOVE,
                    path,
                    value
                });
            }
            i++;
        });
    }
    function generateReplacementPatches_(baseValue, replacement, patches, inversePatches) {
        patches.push({
            op: REPLACE,
            path: [],
            value: replacement === NOTHING ? undefined : replacement
        });
        inversePatches.push({
            op: REPLACE,
            path: [],
            value: baseValue
        });
    }
    function applyPatches_(draft, patches) {
        patches.forEach(patch => {
            const { path, op } = patch;
            let base = draft;
            for (let i = 0; i < path.length - 1; i++) {
                const parentType = getArchtype(base);
                let p = path[i];
                if (typeof p !== "string" && typeof p !== "number") {
                    p = "" + p;
                }
                // See #738, avoid prototype pollution
                if ((parentType === 0 /* ArchType.Object */ || parentType === 1 /* ArchType.Array */) &&
                    (p === "__proto__" || p === "constructor"))
                    die(errorOffset + 3);
                if (typeof base === "function" && p === "prototype")
                    die(errorOffset + 3);
                base = get(base, p);
                if (typeof base !== "object")
                    die(errorOffset + 2, path.join("/"));
            }
            const type = getArchtype(base);
            const value = deepClonePatchValue(patch.value); // used to clone patch to ensure original patch is not modified, see #411
            const key = path[path.length - 1];
            switch (op) {
                case REPLACE:
                    switch (type) {
                        case 2 /* ArchType.Map */:
                            return base.set(key, value);
                        /* istanbul ignore next */
                        case 3 /* ArchType.Set */:
                            die(errorOffset);
                        default:
                            // if value is an object, then it's assigned by reference
                            // in the following add or remove ops, the value field inside the patch will also be modifyed
                            // so we use value from the cloned patch
                            // @ts-ignore
                            return (base[key] = value);
                    }
                case ADD:
                    switch (type) {
                        case 1 /* ArchType.Array */:
                            return key === "-"
                                ? base.push(value)
                                : base.splice(key, 0, value);
                        case 2 /* ArchType.Map */:
                            return base.set(key, value);
                        case 3 /* ArchType.Set */:
                            return base.add(value);
                        default:
                            return (base[key] = value);
                    }
                case REMOVE:
                    switch (type) {
                        case 1 /* ArchType.Array */:
                            return base.splice(key, 1);
                        case 2 /* ArchType.Map */:
                            return base.delete(key);
                        case 3 /* ArchType.Set */:
                            return base.delete(patch.value);
                        default:
                            return delete base[key];
                    }
                default:
                    die(errorOffset + 1, op);
            }
        });
        return draft;
    }
    function deepClonePatchValue(obj) {
        if (!isDraftable(obj))
            return obj;
        if (Array.isArray(obj))
            return obj.map(deepClonePatchValue);
        if (isMap(obj))
            return new Map(Array.from(obj.entries()).map(([k, v]) => [k, deepClonePatchValue(v)]));
        if (isSet(obj))
            return new Set(Array.from(obj).map(deepClonePatchValue));
        const cloned = Object.create(getPrototypeOf(obj));
        for (const key in obj)
            cloned[key] = deepClonePatchValue(obj[key]);
        if (has(obj, DRAFTABLE))
            cloned[DRAFTABLE] = obj[DRAFTABLE];
        return cloned;
    }
    function clonePatchValueIfNeeded(obj) {
        if (isDraft(obj)) {
            return deepClonePatchValue(obj);
        }
        else
            return obj;
    }
    loadPlugin("Patches", {
        applyPatches_,
        generatePatches_,
        generateReplacementPatches_
    });
}

;// CONCATENATED MODULE: ./src/plugins/mapset.ts
// types only!

function enableMapSet() {
    class DraftMap extends Map {
        [DRAFT_STATE];
        constructor(target, parent) {
            super();
            this[DRAFT_STATE] = {
                type_: 2 /* ArchType.Map */,
                parent_: parent,
                scope_: parent ? parent.scope_ : getCurrentScope(),
                modified_: false,
                finalized_: false,
                copy_: undefined,
                assigned_: undefined,
                base_: target,
                draft_: this,
                isManual_: false,
                revoked_: false
            };
        }
        get size() {
            return latest(this[DRAFT_STATE]).size;
        }
        has(key) {
            return latest(this[DRAFT_STATE]).has(key);
        }
        set(key, value) {
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            if (!latest(state).has(key) || latest(state).get(key) !== value) {
                prepareMapCopy(state);
                markChanged(state);
                state.assigned_.set(key, true);
                state.copy_.set(key, value);
                state.assigned_.set(key, true);
            }
            return this;
        }
        delete(key) {
            if (!this.has(key)) {
                return false;
            }
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            prepareMapCopy(state);
            markChanged(state);
            if (state.base_.has(key)) {
                state.assigned_.set(key, false);
            }
            else {
                state.assigned_.delete(key);
            }
            state.copy_.delete(key);
            return true;
        }
        clear() {
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            if (latest(state).size) {
                prepareMapCopy(state);
                markChanged(state);
                state.assigned_ = new Map();
                each(state.base_, key => {
                    state.assigned_.set(key, false);
                });
                state.copy_.clear();
            }
        }
        forEach(cb, thisArg) {
            const state = this[DRAFT_STATE];
            latest(state).forEach((_value, key, _map) => {
                cb.call(thisArg, this.get(key), key, this);
            });
        }
        get(key) {
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            const value = latest(state).get(key);
            if (state.finalized_ || !isDraftable(value)) {
                return value;
            }
            if (value !== state.base_.get(key)) {
                return value; // either already drafted or reassigned
            }
            // despite what it looks, this creates a draft only once, see above condition
            const draft = createProxy(value, state);
            prepareMapCopy(state);
            state.copy_.set(key, draft);
            return draft;
        }
        keys() {
            return latest(this[DRAFT_STATE]).keys();
        }
        values() {
            const iterator = this.keys();
            return {
                [Symbol.iterator]: () => this.values(),
                next: () => {
                    const r = iterator.next();
                    /* istanbul ignore next */
                    if (r.done)
                        return r;
                    const value = this.get(r.value);
                    return {
                        done: false,
                        value
                    };
                }
            };
        }
        entries() {
            const iterator = this.keys();
            return {
                [Symbol.iterator]: () => this.entries(),
                next: () => {
                    const r = iterator.next();
                    /* istanbul ignore next */
                    if (r.done)
                        return r;
                    const value = this.get(r.value);
                    return {
                        done: false,
                        value: [r.value, value]
                    };
                }
            };
        }
        [Symbol.iterator]() {
            return this.entries();
        }
    }
    function proxyMap_(target, parent) {
        // @ts-ignore
        return new DraftMap(target, parent);
    }
    function prepareMapCopy(state) {
        if (!state.copy_) {
            state.assigned_ = new Map();
            state.copy_ = new Map(state.base_);
        }
    }
    class DraftSet extends Set {
        [DRAFT_STATE];
        constructor(target, parent) {
            super();
            this[DRAFT_STATE] = {
                type_: 3 /* ArchType.Set */,
                parent_: parent,
                scope_: parent ? parent.scope_ : getCurrentScope(),
                modified_: false,
                finalized_: false,
                copy_: undefined,
                base_: target,
                draft_: this,
                drafts_: new Map(),
                revoked_: false,
                isManual_: false
            };
        }
        get size() {
            return latest(this[DRAFT_STATE]).size;
        }
        has(value) {
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            // bit of trickery here, to be able to recognize both the value, and the draft of its value
            if (!state.copy_) {
                return state.base_.has(value);
            }
            if (state.copy_.has(value))
                return true;
            if (state.drafts_.has(value) && state.copy_.has(state.drafts_.get(value)))
                return true;
            return false;
        }
        add(value) {
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            if (!this.has(value)) {
                prepareSetCopy(state);
                markChanged(state);
                state.copy_.add(value);
            }
            return this;
        }
        delete(value) {
            if (!this.has(value)) {
                return false;
            }
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            prepareSetCopy(state);
            markChanged(state);
            return (state.copy_.delete(value) ||
                (state.drafts_.has(value)
                    ? state.copy_.delete(state.drafts_.get(value))
                    : /* istanbul ignore next */ false));
        }
        clear() {
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            if (latest(state).size) {
                prepareSetCopy(state);
                markChanged(state);
                state.copy_.clear();
            }
        }
        values() {
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            prepareSetCopy(state);
            return state.copy_.values();
        }
        entries() {
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            prepareSetCopy(state);
            return state.copy_.entries();
        }
        keys() {
            return this.values();
        }
        [Symbol.iterator]() {
            return this.values();
        }
        forEach(cb, thisArg) {
            const iterator = this.values();
            let result = iterator.next();
            while (!result.done) {
                cb.call(thisArg, result.value, result.value, this);
                result = iterator.next();
            }
        }
    }
    function proxySet_(target, parent) {
        // @ts-ignore
        return new DraftSet(target, parent);
    }
    function prepareSetCopy(state) {
        if (!state.copy_) {
            // create drafts for all entries to preserve insertion order
            state.copy_ = new Set();
            state.base_.forEach(value => {
                if (isDraftable(value)) {
                    const draft = createProxy(value, state);
                    state.drafts_.set(value, draft);
                    state.copy_.add(draft);
                }
                else {
                    state.copy_.add(value);
                }
            });
        }
    }
    function assertUnrevoked(state /*ES5State | MapState | SetState*/) {
        if (state.revoked_)
            die(3, JSON.stringify(latest(state)));
    }
    loadPlugin("MapSet", { proxyMap_, proxySet_ });
}

;// CONCATENATED MODULE: ./src/immer.ts


const immer = new Immer();
/**
 * The `produce` function takes a value and a "recipe function" (whose
 * return value often depends on the base state). The recipe function is
 * free to mutate its first argument however it wants. All mutations are
 * only ever applied to a __copy__ of the base state.
 *
 * Pass only a function to create a "curried producer" which relieves you
 * from passing the recipe function every time.
 *
 * Only plain objects and arrays are made mutable. All other objects are
 * considered uncopyable.
 *
 * Note: This function is __bound__ to its `Immer` instance.
 *
 * @param {any} base - the initial state
 * @param {Function} producer - function that receives a proxy of the base state as first argument and which can be freely modified
 * @param {Function} patchListener - optional function that will be called with all the patches produced here
 * @returns {any} a new state, or the initial state if nothing was modified
 */
const produce = immer.produce;
/**
 * Like `produce`, but `produceWithPatches` always returns a tuple
 * [nextState, patches, inversePatches] (instead of just the next state)
 */
const produceWithPatches = immer.produceWithPatches.bind(immer);
/**
 * Pass true to automatically freeze all copies created by Immer.
 *
 * Always freeze by default, even in production mode
 */
const setAutoFreeze = immer.setAutoFreeze.bind(immer);
/**
 * Pass true to enable strict shallow copy.
 *
 * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
 */
const setUseStrictShallowCopy = immer.setUseStrictShallowCopy.bind(immer);
/**
 * Apply an array of Immer patches to the first argument.
 *
 * This function is a producer, which means copy-on-write is in effect.
 */
const applyPatches = immer.applyPatches.bind(immer);
/**
 * Create an Immer draft from the given base state, which may be a draft itself.
 * The draft can be modified until you finalize it with the `finishDraft` function.
 */
const createDraft = immer.createDraft.bind(immer);
/**
 * Finalize an Immer draft from a `createDraft` call, returning the base state
 * (if no changes were made) or a modified copy. The draft must *not* be
 * mutated afterwards.
 *
 * Pass a function as the 2nd argument to generate Immer patches based on the
 * changes that were made.
 */
const finishDraft = immer.finishDraft.bind(immer);
/**
 * This function is actually a no-op, but can be used to cast an immutable type
 * to an draft type and make TypeScript happy
 *
 * @param value
 */
function castDraft(value) {
    return value;
}
/**
 * This function is actually a no-op, but can be used to cast a mutable type
 * to an immutable type and make TypeScript happy
 * @param value
 */
function castImmutable(value) {
    return value;
}




/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map