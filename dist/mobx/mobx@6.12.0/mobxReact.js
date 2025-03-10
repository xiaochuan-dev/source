(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('mobx'), require('react'), require('mobx-react-lite')) :
    typeof define === 'function' && define.amd ? define(['exports', 'mobx', 'react', 'mobx-react-lite'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.mobxReact = {}, global.mobx, global.React, global.mobxReactLite));
})(this, (function (exports, mobx, React, mobxReactLite) { 'use strict';

    function _interopNamespaceDefault(e) {
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n.default = e;
        return Object.freeze(n);
    }

    var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

    function shallowEqual(objA, objB) {
        //From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
        if (is(objA, objB)) {
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
            if (!Object.hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
                return false;
            }
        }
        return true;
    }
    function is(x, y) {
        // From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
        if (x === y) {
            return x !== 0 || 1 / x === 1 / y;
        }
        else {
            return x !== x && y !== y;
        }
    }
    // based on https://github.com/mridgway/hoist-non-react-statics/blob/master/src/index.js
    const hoistBlackList = {
        $$typeof: 1,
        render: 1,
        compare: 1,
        type: 1,
        childContextTypes: 1,
        contextType: 1,
        contextTypes: 1,
        defaultProps: 1,
        getDefaultProps: 1,
        getDerivedStateFromError: 1,
        getDerivedStateFromProps: 1,
        mixins: 1,
        displayName: 1,
        propTypes: 1
    };
    function copyStaticProperties(base, target) {
        const protoProps = Object.getOwnPropertyNames(Object.getPrototypeOf(base));
        Object.getOwnPropertyNames(base).forEach(key => {
            if (!hoistBlackList[key] && protoProps.indexOf(key) === -1) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(base, key));
            }
        });
    }
    /**
     * Utilities for patching componentWillUnmount, to make sure @disposeOnUnmount works correctly icm with user defined hooks
     * and the handler provided by mobx-react
     */
    const mobxMixins = Symbol("patchMixins");
    const mobxPatchedDefinition = Symbol("patchedDefinition");
    function getMixins(target, methodName) {
        const mixins = (target[mobxMixins] = target[mobxMixins] || {});
        const methodMixins = (mixins[methodName] = mixins[methodName] || {});
        methodMixins.locks = methodMixins.locks || 0;
        methodMixins.methods = methodMixins.methods || [];
        return methodMixins;
    }
    function wrapper(realMethod, mixins, ...args) {
        // locks are used to ensure that mixins are invoked only once per invocation, even on recursive calls
        mixins.locks++;
        try {
            let retVal;
            if (realMethod !== undefined && realMethod !== null) {
                retVal = realMethod.apply(this, args);
            }
            return retVal;
        }
        finally {
            mixins.locks--;
            if (mixins.locks === 0) {
                mixins.methods.forEach(mx => {
                    mx.apply(this, args);
                });
            }
        }
    }
    function wrapFunction(realMethod, mixins) {
        const fn = function (...args) {
            wrapper.call(this, realMethod, mixins, ...args);
        };
        return fn;
    }
    function patch(target, methodName, mixinMethod) {
        const mixins = getMixins(target, methodName);
        if (mixins.methods.indexOf(mixinMethod) < 0) {
            mixins.methods.push(mixinMethod);
        }
        const oldDefinition = Object.getOwnPropertyDescriptor(target, methodName);
        if (oldDefinition && oldDefinition[mobxPatchedDefinition]) {
            // already patched definition, do not repatch
            return;
        }
        const originalMethod = target[methodName];
        const newDefinition = createDefinition(target, methodName, oldDefinition ? oldDefinition.enumerable : undefined, mixins, originalMethod);
        Object.defineProperty(target, methodName, newDefinition);
    }
    function createDefinition(target, methodName, enumerable, mixins, originalMethod) {
        let wrappedFunc = wrapFunction(originalMethod, mixins);
        return {
            // @ts-ignore
            [mobxPatchedDefinition]: true,
            get: function () {
                return wrappedFunc;
            },
            set: function (value) {
                if (this === target) {
                    wrappedFunc = wrapFunction(value, mixins);
                }
                else {
                    // when it is an instance of the prototype/a child prototype patch that particular case again separately
                    // since we need to store separate values depending on wether it is the actual instance, the prototype, etc
                    // e.g. the method for super might not be the same as the method for the prototype which might be not the same
                    // as the method for the instance
                    const newDefinition = createDefinition(this, methodName, enumerable, mixins, value);
                    Object.defineProperty(this, methodName, newDefinition);
                }
            },
            configurable: true,
            enumerable: enumerable
        };
    }

    const administrationSymbol = Symbol("ObserverAdministration");
    const isMobXReactObserverSymbol = Symbol("isMobXReactObserver");
    function getAdministration(component) {
        // We create administration lazily, because we can't patch constructor
        // and the exact moment of initialization partially depends on React internals.
        // At the time of writing this, the first thing invoked is one of the observable getter/setter (state/props/context).
        return (component[administrationSymbol] ??= {
            reaction: null,
            mounted: false,
            reactionInvalidatedBeforeMount: false,
            forceUpdate: null,
            name: getDisplayName(component.constructor),
            state: undefined,
            props: undefined,
            context: undefined
        });
    }
    function makeClassComponentObserver(componentClass) {
        const { prototype } = componentClass;
        if (componentClass[isMobXReactObserverSymbol]) {
            const displayName = getDisplayName(componentClass);
            throw new Error(`The provided component class (${displayName}) has already been declared as an observer component.`);
        }
        else {
            componentClass[isMobXReactObserverSymbol] = true;
        }
        if (prototype.componentWillReact) {
            throw new Error("The componentWillReact life-cycle event is no longer supported");
        }
        if (componentClass["__proto__"] !== React.PureComponent) {
            if (!prototype.shouldComponentUpdate) {
                prototype.shouldComponentUpdate = observerSCU;
            }
            else if (prototype.shouldComponentUpdate !== observerSCU) {
                // n.b. unequal check, instead of existence check, as @observer might be on superclass as well
                throw new Error("It is not allowed to use shouldComponentUpdate in observer based components.");
            }
        }
        const originalRender = prototype.render;
        if (typeof originalRender !== "function") {
            const displayName = getDisplayName(componentClass);
            throw new Error(`[mobx-react] class component (${displayName}) is missing \`render\` method.` +
                `\n\`observer\` requires \`render\` being a function defined on prototype.` +
                `\n\`render = () => {}\` or \`render = function() {}\` is not supported.`);
        }
        prototype.render = function () {
            Object.defineProperty(this, "render", {
                // There is no safe way to replace render, therefore it's forbidden.
                configurable: false,
                writable: false,
                value: mobxReactLite.isUsingStaticRendering()
                    ? originalRender
                    : createReactiveRender.call(this, originalRender)
            });
            return this.render();
        };
        const originalComponentDidMount = prototype.componentDidMount;
        prototype.componentDidMount = function () {
            // `componentDidMount` may not be called at all. React can abandon the instance after `render`.
            // That's why we use finalization registry to dispose reaction created during render.
            // Happens with `<Suspend>` see #3492
            //
            // `componentDidMount` can be called immediately after `componentWillUnmount` without calling `render` in between.
            // Happens with `<StrictMode>`see #3395.
            //
            // If `componentDidMount` is called, it's guaranteed to run synchronously with render (similary to `useLayoutEffect`).
            // Therefore we don't have to worry about external (observable) state being updated before mount (no state version checking).
            //
            // Things may change: "In the future, React will provide a feature that lets components preserve state between unmounts"
            const admin = getAdministration(this);
            admin.mounted = true;
            // Component instance committed, prevent reaction disposal.
            mobxReactLite._observerFinalizationRegistry.unregister(this);
            // We don't set forceUpdate before mount because it requires a reference to `this`,
            // therefore `this` could NOT be garbage collected before mount,
            // preventing reaction disposal by FinalizationRegistry and leading to memory leak.
            // As an alternative we could have `admin.instanceRef = new WeakRef(this)`, but lets avoid it if possible.
            admin.forceUpdate = () => this.forceUpdate();
            if (!admin.reaction || admin.reactionInvalidatedBeforeMount) {
                // Missing reaction:
                // 1. Instance was unmounted (reaction disposed) and immediately remounted without running render #3395.
                // 2. Reaction was disposed by finalization registry before mount. Shouldn't ever happen for class components:
                // `componentDidMount` runs synchronously after render, but our registry are deferred (can't run in between).
                // In any case we lost subscriptions to observables, so we have to create new reaction and re-render to resubscribe.
                // The reaction will be created lazily by following render.
                // Reaction invalidated before mount:
                // 1. A descendant's `componenDidMount` invalidated it's parent #3730
                admin.forceUpdate();
            }
            return originalComponentDidMount?.apply(this, arguments);
        };
        // TODO@major Overly complicated "patch" is only needed to support the deprecated @disposeOnUnmount
        patch(prototype, "componentWillUnmount", function () {
            if (mobxReactLite.isUsingStaticRendering()) {
                return;
            }
            const admin = getAdministration(this);
            admin.reaction?.dispose();
            admin.reaction = null;
            admin.forceUpdate = null;
            admin.mounted = false;
            admin.reactionInvalidatedBeforeMount = false;
        });
        return componentClass;
    }
    // Generates a friendly name for debugging
    function getDisplayName(componentClass) {
        return componentClass.displayName || componentClass.name || "<component>";
    }
    function createReactiveRender(originalRender) {
        const boundOriginalRender = originalRender.bind(this);
        const admin = getAdministration(this);
        function reactiveRender() {
            if (!admin.reaction) {
                // Create reaction lazily to support re-mounting #3395
                admin.reaction = createReaction(admin);
                if (!admin.mounted) {
                    // React can abandon this instance and never call `componentDidMount`/`componentWillUnmount`,
                    // we have to make sure reaction will be disposed.
                    mobxReactLite._observerFinalizationRegistry.register(this, admin, this);
                }
            }
            let error = undefined;
            let renderResult = undefined;
            admin.reaction.track(() => {
                try {
                    // TODO@major
                    // Optimization: replace with _allowStateChangesStart/End (not available in mobx@6.0.0)
                    renderResult = mobx._allowStateChanges(false, boundOriginalRender);
                }
                catch (e) {
                    error = e;
                }
            });
            if (error) {
                throw error;
            }
            return renderResult;
        }
        return reactiveRender;
    }
    function createReaction(admin) {
        return new mobx.Reaction(`${admin.name}.render()`, () => {
            if (!admin.mounted) {
                // This is neccessary to avoid react warning about calling forceUpdate on component that isn't mounted yet.
                // This happens when component is abandoned after render - our reaction is already created and reacts to changes.
                // `componenDidMount` runs synchronously after `render`, so unlike functional component, there is no delay during which the reaction could be invalidated.
                // However `componentDidMount` runs AFTER it's descendants' `componentDidMount`, which CAN invalidate the reaction, see #3730. Therefore remember and forceUpdate on mount.
                admin.reactionInvalidatedBeforeMount = true;
                return;
            }
            try {
                admin.forceUpdate?.();
            }
            catch (error) {
                admin.reaction?.dispose();
                admin.reaction = null;
            }
        });
    }
    function observerSCU(nextProps, nextState) {
        if (mobxReactLite.isUsingStaticRendering()) {
            console.warn("[mobx-react] It seems that a re-rendering of a React component is triggered while in static (server-side) mode. Please make sure components are rendered only once server-side.");
        }
        // update on any state changes (as is the default)
        if (this.state !== nextState) {
            return true;
        }
        // update if props are shallowly not equal, inspired by PureRenderMixin
        // we could return just 'false' here, and avoid the `skipRender` checks etc
        // however, it is nicer if lifecycle events are triggered like usually,
        // so we return true here if props are shallowly modified.
        return !shallowEqual(this.props, nextProps);
    }

    function observer(component, context) {
        if (context && context.kind !== "class") {
            throw new Error("The @observer decorator can be used on classes only");
        }
        if (component["isMobxInjector"] === true) {
            console.warn("Mobx observer: You are trying to use `observer` on a component that already has `inject`. Please apply `observer` before applying `inject`");
        }
        if (Object.prototype.isPrototypeOf.call(React__namespace.Component, component) ||
            Object.prototype.isPrototypeOf.call(React__namespace.PureComponent, component)) {
            // Class component
            return makeClassComponentObserver(component);
        }
        else {
            // Function component
            return mobxReactLite.observer(component);
        }
    }

    const MobXProviderContext = React.createContext({});
    function Provider(props) {
        const { children, ...stores } = props;
        const parentValue = React.useContext(MobXProviderContext);
        const mutableProviderRef = React.useRef({ ...parentValue, ...stores });
        const value = mutableProviderRef.current;
        return React.createElement(MobXProviderContext.Provider, { value: value }, children);
    }
    Provider.displayName = "MobXProvider";

    /**
     * Store Injection
     */
    function createStoreInjector(grabStoresFn, component, injectNames, makeReactive) {
        // Support forward refs
        let Injector = React.forwardRef((props, ref) => {
            const newProps = { ...props };
            const context = React.useContext(MobXProviderContext);
            Object.assign(newProps, grabStoresFn(context || {}, newProps) || {});
            if (ref) {
                newProps.ref = ref;
            }
            return React.createElement(component, newProps);
        });
        if (makeReactive)
            Injector = observer(Injector);
        Injector["isMobxInjector"] = true; // assigned late to suppress observer warning
        // Static fields from component should be visible on the generated Injector
        copyStaticProperties(component, Injector);
        Injector["wrappedComponent"] = component;
        Injector.displayName = getInjectName(component, injectNames);
        return Injector;
    }
    function getInjectName(component, injectNames) {
        let displayName;
        const componentName = component.displayName ||
            component.name ||
            (component.constructor && component.constructor.name) ||
            "Component";
        if (injectNames)
            displayName = "inject-with-" + injectNames + "(" + componentName + ")";
        else
            displayName = "inject(" + componentName + ")";
        return displayName;
    }
    function grabStoresByName(storeNames) {
        return function (baseStores, nextProps) {
            storeNames.forEach(function (storeName) {
                if (storeName in nextProps // prefer props over stores
                )
                    return;
                if (!(storeName in baseStores))
                    throw new Error("MobX injector: Store '" +
                        storeName +
                        "' is not available! Make sure it is provided by some Provider");
                nextProps[storeName] = baseStores[storeName];
            });
            return nextProps;
        };
    }
    /**
     * higher order component that injects stores to a child.
     * takes either a varargs list of strings, which are stores read from the context,
     * or a function that manually maps the available stores from the context to props:
     * storesToProps(mobxStores, props, context) => newProps
     */
    function inject(/* fn(stores, nextProps) or ...storeNames */ ...storeNames) {
        if (typeof arguments[0] === "function") {
            let grabStoresFn = arguments[0];
            return (componentClass) => createStoreInjector(grabStoresFn, componentClass, grabStoresFn.name, true);
        }
        else {
            return (componentClass) => createStoreInjector(grabStoresByName(storeNames), componentClass, storeNames.join("-"), false);
        }
    }

    const reactMajorVersion = Number.parseInt(React.version.split(".")[0]);
    let warnedAboutDisposeOnUnmountDeprecated = false;
    const protoStoreKey = Symbol("disposeOnUnmountProto");
    const instStoreKey = Symbol("disposeOnUnmountInst");
    function runDisposersOnWillUnmount() {
        [...(this[protoStoreKey] || []), ...(this[instStoreKey] || [])].forEach(propKeyOrFunction => {
            const prop = typeof propKeyOrFunction === "string" ? this[propKeyOrFunction] : propKeyOrFunction;
            if (prop !== undefined && prop !== null) {
                if (Array.isArray(prop))
                    prop.map(f => f());
                else
                    prop();
            }
        });
    }
    /**
     * @deprecated `disposeOnUnmount` is not compatible with React 18 and higher.
     */
    function disposeOnUnmount(target, propertyKeyOrFunction) {
        if (Array.isArray(propertyKeyOrFunction)) {
            return propertyKeyOrFunction.map(fn => disposeOnUnmount(target, fn));
        }
        if (!warnedAboutDisposeOnUnmountDeprecated) {
            if (reactMajorVersion >= 18) {
                console.error("[mobx-react] disposeOnUnmount is not compatible with React 18 and higher. Don't use it.");
            }
            else {
                console.warn("[mobx-react] disposeOnUnmount is deprecated. It won't work correctly with React 18 and higher.");
            }
            warnedAboutDisposeOnUnmountDeprecated = true;
        }
        const c = Object.getPrototypeOf(target).constructor;
        const c2 = Object.getPrototypeOf(target.constructor);
        // Special case for react-hot-loader
        const c3 = Object.getPrototypeOf(Object.getPrototypeOf(target));
        if (!(c === React.Component ||
            c === React.PureComponent ||
            c2 === React.Component ||
            c2 === React.PureComponent ||
            c3 === React.Component ||
            c3 === React.PureComponent)) {
            throw new Error("[mobx-react] disposeOnUnmount only supports direct subclasses of React.Component or React.PureComponent.");
        }
        if (typeof propertyKeyOrFunction !== "string" &&
            typeof propertyKeyOrFunction !== "function" &&
            !Array.isArray(propertyKeyOrFunction)) {
            throw new Error("[mobx-react] disposeOnUnmount only works if the parameter is either a property key or a function.");
        }
        // decorator's target is the prototype, so it doesn't have any instance properties like props
        const isDecorator = typeof propertyKeyOrFunction === "string";
        // add property key / function we want run (disposed) to the store
        const componentWasAlreadyModified = !!target[protoStoreKey] || !!target[instStoreKey];
        const store = isDecorator
            ? // decorators are added to the prototype store
                target[protoStoreKey] || (target[protoStoreKey] = [])
            : // functions are added to the instance store
                target[instStoreKey] || (target[instStoreKey] = []);
        store.push(propertyKeyOrFunction);
        // tweak the component class componentWillUnmount if not done already
        if (!componentWasAlreadyModified) {
            patch(target, "componentWillUnmount", runDisposersOnWillUnmount);
        }
        // return the disposer as is if invoked as a non decorator
        if (typeof propertyKeyOrFunction !== "string") {
            return propertyKeyOrFunction;
        }
    }

    // Copied from React.PropTypes
    function createChainableTypeChecker(validator) {
        function checkType(isRequired, props, propName, componentName, location, propFullName, ...rest) {
            return mobx.untracked(() => {
                componentName = componentName || "<<anonymous>>";
                propFullName = propFullName || propName;
                if (props[propName] == null) {
                    if (isRequired) {
                        const actual = props[propName] === null ? "null" : "undefined";
                        return new Error("The " +
                            location +
                            " `" +
                            propFullName +
                            "` is marked as required " +
                            "in `" +
                            componentName +
                            "`, but its value is `" +
                            actual +
                            "`.");
                    }
                    return null;
                }
                else {
                    // @ts-ignore rest arg is necessary for some React internals - fails tests otherwise
                    return validator(props, propName, componentName, location, propFullName, ...rest);
                }
            });
        }
        const chainedCheckType = checkType.bind(null, false);
        // Add isRequired to satisfy Requirable
        chainedCheckType.isRequired = checkType.bind(null, true);
        return chainedCheckType;
    }
    // Copied from React.PropTypes
    function isSymbol(propType, propValue) {
        // Native Symbol.
        if (propType === "symbol") {
            return true;
        }
        // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
        if (propValue["@@toStringTag"] === "Symbol") {
            return true;
        }
        // Fallback for non-spec compliant Symbols which are polyfilled.
        if (typeof Symbol === "function" && propValue instanceof Symbol) {
            return true;
        }
        return false;
    }
    // Copied from React.PropTypes
    function getPropType(propValue) {
        const propType = typeof propValue;
        if (Array.isArray(propValue)) {
            return "array";
        }
        if (propValue instanceof RegExp) {
            // Old webkits (at least until Android 4.0) return 'function' rather than
            // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
            // passes PropTypes.object.
            return "object";
        }
        if (isSymbol(propType, propValue)) {
            return "symbol";
        }
        return propType;
    }
    // This handles more types than `getPropType`. Only used for error messages.
    // Copied from React.PropTypes
    function getPreciseType(propValue) {
        const propType = getPropType(propValue);
        if (propType === "object") {
            if (propValue instanceof Date) {
                return "date";
            }
            else if (propValue instanceof RegExp) {
                return "regexp";
            }
        }
        return propType;
    }
    function createObservableTypeCheckerCreator(allowNativeType, mobxType) {
        return createChainableTypeChecker((props, propName, componentName, location, propFullName) => {
            return mobx.untracked(() => {
                if (allowNativeType) {
                    if (getPropType(props[propName]) === mobxType.toLowerCase())
                        return null;
                }
                let mobxChecker;
                switch (mobxType) {
                    case "Array":
                        mobxChecker = mobx.isObservableArray;
                        break;
                    case "Object":
                        mobxChecker = mobx.isObservableObject;
                        break;
                    case "Map":
                        mobxChecker = mobx.isObservableMap;
                        break;
                    default:
                        throw new Error(`Unexpected mobxType: ${mobxType}`);
                }
                const propValue = props[propName];
                if (!mobxChecker(propValue)) {
                    const preciseType = getPreciseType(propValue);
                    const nativeTypeExpectationMessage = allowNativeType
                        ? " or javascript `" + mobxType.toLowerCase() + "`"
                        : "";
                    return new Error("Invalid prop `" +
                        propFullName +
                        "` of type `" +
                        preciseType +
                        "` supplied to" +
                        " `" +
                        componentName +
                        "`, expected `mobx.Observable" +
                        mobxType +
                        "`" +
                        nativeTypeExpectationMessage +
                        ".");
                }
                return null;
            });
        });
    }
    function createObservableArrayOfTypeChecker(allowNativeType, typeChecker) {
        return createChainableTypeChecker((props, propName, componentName, location, propFullName, ...rest) => {
            return mobx.untracked(() => {
                if (typeof typeChecker !== "function") {
                    return new Error("Property `" +
                        propFullName +
                        "` of component `" +
                        componentName +
                        "` has " +
                        "invalid PropType notation.");
                }
                else {
                    let error = createObservableTypeCheckerCreator(allowNativeType, "Array")(props, propName, componentName, location, propFullName);
                    if (error instanceof Error)
                        return error;
                    const propValue = props[propName];
                    for (let i = 0; i < propValue.length; i++) {
                        error = typeChecker(propValue, i, componentName, location, propFullName + "[" + i + "]", ...rest);
                        if (error instanceof Error)
                            return error;
                    }
                    return null;
                }
            });
        });
    }
    const observableArray = createObservableTypeCheckerCreator(false, "Array");
    const observableArrayOf = createObservableArrayOfTypeChecker.bind(null, false);
    const observableMap = createObservableTypeCheckerCreator(false, "Map");
    const observableObject = createObservableTypeCheckerCreator(false, "Object");
    const arrayOrObservableArray = createObservableTypeCheckerCreator(true, "Array");
    const arrayOrObservableArrayOf = createObservableArrayOfTypeChecker.bind(null, true);
    const objectOrObservableObject = createObservableTypeCheckerCreator(true, "Object");
    const PropTypes = {
        observableArray,
        observableArrayOf,
        observableMap,
        observableObject,
        arrayOrObservableArray,
        arrayOrObservableArrayOf,
        objectOrObservableObject
    };

    if (!React.Component) {
        throw new Error("mobx-react requires React to be available");
    }
    if (!mobx.observable) {
        throw new Error("mobx-react requires mobx to be available");
    }

    Object.defineProperty(exports, "Observer", {
        enumerable: true,
        get: function () { return mobxReactLite.Observer; }
    });
    Object.defineProperty(exports, "enableStaticRendering", {
        enumerable: true,
        get: function () { return mobxReactLite.enableStaticRendering; }
    });
    Object.defineProperty(exports, "isUsingStaticRendering", {
        enumerable: true,
        get: function () { return mobxReactLite.isUsingStaticRendering; }
    });
    Object.defineProperty(exports, "observerBatching", {
        enumerable: true,
        get: function () { return mobxReactLite.observerBatching; }
    });
    Object.defineProperty(exports, "useAsObservableSource", {
        enumerable: true,
        get: function () { return mobxReactLite.useAsObservableSource; }
    });
    Object.defineProperty(exports, "useLocalObservable", {
        enumerable: true,
        get: function () { return mobxReactLite.useLocalObservable; }
    });
    Object.defineProperty(exports, "useLocalStore", {
        enumerable: true,
        get: function () { return mobxReactLite.useLocalStore; }
    });
    Object.defineProperty(exports, "useObserver", {
        enumerable: true,
        get: function () { return mobxReactLite.useObserver; }
    });
    Object.defineProperty(exports, "useStaticRendering", {
        enumerable: true,
        get: function () { return mobxReactLite.useStaticRendering; }
    });
    exports.MobXProviderContext = MobXProviderContext;
    exports.PropTypes = PropTypes;
    exports.Provider = Provider;
    exports.disposeOnUnmount = disposeOnUnmount;
    exports.inject = inject;
    exports.observer = observer;

}));
//# sourceMappingURL=mobxReact.js.map
