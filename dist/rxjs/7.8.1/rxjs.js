(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define('rxjs', ['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rxjs = {}));
})(this, (function (exports) { 'use strict';

    function isFunction(value) {
        return typeof value === 'function';
    }

    function createErrorClass(createImpl) {
        const _super = (instance) => {
            Error.call(instance);
            instance.stack = new Error().stack;
        };
        const ctorFunc = createImpl(_super);
        ctorFunc.prototype = Object.create(Error.prototype);
        ctorFunc.prototype.constructor = ctorFunc;
        return ctorFunc;
    }

    const UnsubscriptionError = createErrorClass((_super) => function UnsubscriptionErrorImpl(errors) {
        _super(this);
        this.message = errors
            ? `${errors.length} errors occurred during unsubscription:
${errors.map((err, i) => `${i + 1}) ${err.toString()}`).join('\n  ')}`
            : '';
        this.name = 'UnsubscriptionError';
        this.errors = errors;
    });

    function arrRemove(arr, item) {
        if (arr) {
            const index = arr.indexOf(item);
            0 <= index && arr.splice(index, 1);
        }
    }

    class Subscription {
        constructor(initialTeardown) {
            this.initialTeardown = initialTeardown;
            this.closed = false;
            this._parentage = null;
            this._finalizers = null;
        }
        unsubscribe() {
            let errors;
            if (!this.closed) {
                this.closed = true;
                const { _parentage } = this;
                if (_parentage) {
                    this._parentage = null;
                    if (Array.isArray(_parentage)) {
                        for (const parent of _parentage) {
                            parent.remove(this);
                        }
                    }
                    else {
                        _parentage.remove(this);
                    }
                }
                const { initialTeardown: initialFinalizer } = this;
                if (isFunction(initialFinalizer)) {
                    try {
                        initialFinalizer();
                    }
                    catch (e) {
                        errors = e instanceof UnsubscriptionError ? e.errors : [e];
                    }
                }
                const { _finalizers } = this;
                if (_finalizers) {
                    this._finalizers = null;
                    for (const finalizer of _finalizers) {
                        try {
                            execFinalizer(finalizer);
                        }
                        catch (err) {
                            errors = errors ?? [];
                            if (err instanceof UnsubscriptionError) {
                                errors = [...errors, ...err.errors];
                            }
                            else {
                                errors.push(err);
                            }
                        }
                    }
                }
                if (errors) {
                    throw new UnsubscriptionError(errors);
                }
            }
        }
        add(teardown) {
            if (teardown && teardown !== this) {
                if (this.closed) {
                    execFinalizer(teardown);
                }
                else {
                    if (teardown instanceof Subscription) {
                        if (teardown.closed || teardown._hasParent(this)) {
                            return;
                        }
                        teardown._addParent(this);
                    }
                    (this._finalizers = this._finalizers ?? []).push(teardown);
                }
            }
        }
        _hasParent(parent) {
            const { _parentage } = this;
            return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
        }
        _addParent(parent) {
            const { _parentage } = this;
            this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
        }
        _removeParent(parent) {
            const { _parentage } = this;
            if (_parentage === parent) {
                this._parentage = null;
            }
            else if (Array.isArray(_parentage)) {
                arrRemove(_parentage, parent);
            }
        }
        remove(teardown) {
            const { _finalizers } = this;
            _finalizers && arrRemove(_finalizers, teardown);
            if (teardown instanceof Subscription) {
                teardown._removeParent(this);
            }
        }
    }
    Subscription.EMPTY = (() => {
        const empty = new Subscription();
        empty.closed = true;
        return empty;
    })();
    const EMPTY_SUBSCRIPTION = Subscription.EMPTY;
    function isSubscription(value) {
        return (value instanceof Subscription ||
            (value && 'closed' in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe)));
    }
    function execFinalizer(finalizer) {
        if (isFunction(finalizer)) {
            finalizer();
        }
        else {
            finalizer.unsubscribe();
        }
    }

    const config = {
        onUnhandledError: null,
        onStoppedNotification: null,
        Promise: undefined,
        useDeprecatedSynchronousErrorHandling: false,
        useDeprecatedNextContext: false,
    };

    const timeoutProvider = {
        setTimeout(handler, timeout, ...args) {
            const { delegate } = timeoutProvider;
            if (delegate?.setTimeout) {
                return delegate.setTimeout(handler, timeout, ...args);
            }
            return setTimeout(handler, timeout, ...args);
        },
        clearTimeout(handle) {
            const { delegate } = timeoutProvider;
            return (delegate?.clearTimeout || clearTimeout)(handle);
        },
        delegate: undefined,
    };

    function reportUnhandledError(err) {
        timeoutProvider.setTimeout(() => {
            const { onUnhandledError } = config;
            if (onUnhandledError) {
                onUnhandledError(err);
            }
            else {
                throw err;
            }
        });
    }

    function noop() { }

    const COMPLETE_NOTIFICATION = (() => createNotification('C', undefined, undefined))();
    function errorNotification(error) {
        return createNotification('E', undefined, error);
    }
    function nextNotification(value) {
        return createNotification('N', value, undefined);
    }
    function createNotification(kind, value, error) {
        return {
            kind,
            value,
            error,
        };
    }

    let context = null;
    function errorContext(cb) {
        if (config.useDeprecatedSynchronousErrorHandling) {
            const isRoot = !context;
            if (isRoot) {
                context = { errorThrown: false, error: null };
            }
            cb();
            if (isRoot) {
                const { errorThrown, error } = context;
                context = null;
                if (errorThrown) {
                    throw error;
                }
            }
        }
        else {
            cb();
        }
    }
    function captureError(err) {
        if (config.useDeprecatedSynchronousErrorHandling && context) {
            context.errorThrown = true;
            context.error = err;
        }
    }

    class Subscriber extends Subscription {
        constructor(destination) {
            super();
            this.isStopped = false;
            if (destination) {
                this.destination = destination;
                if (isSubscription(destination)) {
                    destination.add(this);
                }
            }
            else {
                this.destination = EMPTY_OBSERVER;
            }
        }
        static create(next, error, complete) {
            return new SafeSubscriber(next, error, complete);
        }
        next(value) {
            if (this.isStopped) {
                handleStoppedNotification(nextNotification(value), this);
            }
            else {
                this._next(value);
            }
        }
        error(err) {
            if (this.isStopped) {
                handleStoppedNotification(errorNotification(err), this);
            }
            else {
                this.isStopped = true;
                this._error(err);
            }
        }
        complete() {
            if (this.isStopped) {
                handleStoppedNotification(COMPLETE_NOTIFICATION, this);
            }
            else {
                this.isStopped = true;
                this._complete();
            }
        }
        unsubscribe() {
            if (!this.closed) {
                this.isStopped = true;
                super.unsubscribe();
                this.destination = null;
            }
        }
        _next(value) {
            this.destination.next(value);
        }
        _error(err) {
            try {
                this.destination.error(err);
            }
            finally {
                this.unsubscribe();
            }
        }
        _complete() {
            try {
                this.destination.complete();
            }
            finally {
                this.unsubscribe();
            }
        }
    }
    const _bind = Function.prototype.bind;
    function bind(fn, thisArg) {
        return _bind.call(fn, thisArg);
    }
    class ConsumerObserver {
        constructor(partialObserver) {
            this.partialObserver = partialObserver;
        }
        next(value) {
            const { partialObserver } = this;
            if (partialObserver.next) {
                try {
                    partialObserver.next(value);
                }
                catch (error) {
                    handleUnhandledError(error);
                }
            }
        }
        error(err) {
            const { partialObserver } = this;
            if (partialObserver.error) {
                try {
                    partialObserver.error(err);
                }
                catch (error) {
                    handleUnhandledError(error);
                }
            }
            else {
                handleUnhandledError(err);
            }
        }
        complete() {
            const { partialObserver } = this;
            if (partialObserver.complete) {
                try {
                    partialObserver.complete();
                }
                catch (error) {
                    handleUnhandledError(error);
                }
            }
        }
    }
    class SafeSubscriber extends Subscriber {
        constructor(observerOrNext, error, complete) {
            super();
            let partialObserver;
            if (isFunction(observerOrNext) || !observerOrNext) {
                partialObserver = {
                    next: (observerOrNext ?? undefined),
                    error: error ?? undefined,
                    complete: complete ?? undefined,
                };
            }
            else {
                let context;
                if (this && config.useDeprecatedNextContext) {
                    context = Object.create(observerOrNext);
                    context.unsubscribe = () => this.unsubscribe();
                    partialObserver = {
                        next: observerOrNext.next && bind(observerOrNext.next, context),
                        error: observerOrNext.error && bind(observerOrNext.error, context),
                        complete: observerOrNext.complete && bind(observerOrNext.complete, context),
                    };
                }
                else {
                    partialObserver = observerOrNext;
                }
            }
            this.destination = new ConsumerObserver(partialObserver);
        }
    }
    function handleUnhandledError(error) {
        if (config.useDeprecatedSynchronousErrorHandling) {
            captureError(error);
        }
        else {
            reportUnhandledError(error);
        }
    }
    function defaultErrorHandler(err) {
        throw err;
    }
    function handleStoppedNotification(notification, subscriber) {
        const { onStoppedNotification } = config;
        onStoppedNotification && timeoutProvider.setTimeout(() => onStoppedNotification(notification, subscriber));
    }
    const EMPTY_OBSERVER = {
        closed: true,
        next: noop,
        error: defaultErrorHandler,
        complete: noop,
    };

    const observable = (() => (typeof Symbol === 'function' && Symbol.observable) || '@@observable')();

    function identity(x) {
        return x;
    }

    function pipe(...fns) {
        return pipeFromArray(fns);
    }
    function pipeFromArray(fns) {
        if (fns.length === 0) {
            return identity;
        }
        if (fns.length === 1) {
            return fns[0];
        }
        return function piped(input) {
            return fns.reduce((prev, fn) => fn(prev), input);
        };
    }

    class Observable {
        constructor(subscribe) {
            if (subscribe) {
                this._subscribe = subscribe;
            }
        }
        lift(operator) {
            const observable = new Observable();
            observable.source = this;
            observable.operator = operator;
            return observable;
        }
        subscribe(observerOrNext, error, complete) {
            const subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
            errorContext(() => {
                const { operator, source } = this;
                subscriber.add(operator
                    ?
                        operator.call(subscriber, source)
                    : source
                        ?
                            this._subscribe(subscriber)
                        :
                            this._trySubscribe(subscriber));
            });
            return subscriber;
        }
        _trySubscribe(sink) {
            try {
                return this._subscribe(sink);
            }
            catch (err) {
                sink.error(err);
            }
        }
        forEach(next, promiseCtor) {
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor((resolve, reject) => {
                const subscriber = new SafeSubscriber({
                    next: (value) => {
                        try {
                            next(value);
                        }
                        catch (err) {
                            reject(err);
                            subscriber.unsubscribe();
                        }
                    },
                    error: reject,
                    complete: resolve,
                });
                this.subscribe(subscriber);
            });
        }
        _subscribe(subscriber) {
            return this.source?.subscribe(subscriber);
        }
        [observable]() {
            return this;
        }
        pipe(...operations) {
            return pipeFromArray(operations)(this);
        }
        toPromise(promiseCtor) {
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor((resolve, reject) => {
                let value;
                this.subscribe((x) => (value = x), (err) => reject(err), () => resolve(value));
            });
        }
    }
    Observable.create = (subscribe) => {
        return new Observable(subscribe);
    };
    function getPromiseCtor(promiseCtor) {
        return promiseCtor ?? config.Promise ?? Promise;
    }
    function isObserver(value) {
        return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
    }
    function isSubscriber(value) {
        return (value && value instanceof Subscriber) || (isObserver(value) && isSubscription(value));
    }

    function hasLift(source) {
        return isFunction(source?.lift);
    }
    function operate(init) {
        return (source) => {
            if (hasLift(source)) {
                return source.lift(function (liftedSource) {
                    try {
                        return init(liftedSource, this);
                    }
                    catch (err) {
                        this.error(err);
                    }
                });
            }
            throw new TypeError('Unable to lift unknown Observable type');
        };
    }

    function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
        return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
    }
    class OperatorSubscriber extends Subscriber {
        constructor(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
            super(destination);
            this.onFinalize = onFinalize;
            this.shouldUnsubscribe = shouldUnsubscribe;
            this._next = onNext
                ? function (value) {
                    try {
                        onNext(value);
                    }
                    catch (err) {
                        destination.error(err);
                    }
                }
                : super._next;
            this._error = onError
                ? function (err) {
                    try {
                        onError(err);
                    }
                    catch (err) {
                        destination.error(err);
                    }
                    finally {
                        this.unsubscribe();
                    }
                }
                : super._error;
            this._complete = onComplete
                ? function () {
                    try {
                        onComplete();
                    }
                    catch (err) {
                        destination.error(err);
                    }
                    finally {
                        this.unsubscribe();
                    }
                }
                : super._complete;
        }
        unsubscribe() {
            if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
                const { closed } = this;
                super.unsubscribe();
                !closed && this.onFinalize?.();
            }
        }
    }

    function refCount() {
        return operate((source, subscriber) => {
            let connection = null;
            source._refCount++;
            const refCounter = createOperatorSubscriber(subscriber, undefined, undefined, undefined, () => {
                if (!source || source._refCount <= 0 || 0 < --source._refCount) {
                    connection = null;
                    return;
                }
                const sharedConnection = source._connection;
                const conn = connection;
                connection = null;
                if (sharedConnection && (!conn || sharedConnection === conn)) {
                    sharedConnection.unsubscribe();
                }
                subscriber.unsubscribe();
            });
            source.subscribe(refCounter);
            if (!refCounter.closed) {
                connection = source.connect();
            }
        });
    }

    class ConnectableObservable extends Observable {
        constructor(source, subjectFactory) {
            super();
            this.source = source;
            this.subjectFactory = subjectFactory;
            this._subject = null;
            this._refCount = 0;
            this._connection = null;
            if (hasLift(source)) {
                this.lift = source.lift;
            }
        }
        _subscribe(subscriber) {
            return this.getSubject().subscribe(subscriber);
        }
        getSubject() {
            const subject = this._subject;
            if (!subject || subject.isStopped) {
                this._subject = this.subjectFactory();
            }
            return this._subject;
        }
        _teardown() {
            this._refCount = 0;
            const { _connection } = this;
            this._subject = this._connection = null;
            _connection?.unsubscribe();
        }
        connect() {
            let connection = this._connection;
            if (!connection) {
                connection = this._connection = new Subscription();
                const subject = this.getSubject();
                connection.add(this.source.subscribe(createOperatorSubscriber(subject, undefined, () => {
                    this._teardown();
                    subject.complete();
                }, (err) => {
                    this._teardown();
                    subject.error(err);
                }, () => this._teardown())));
                if (connection.closed) {
                    this._connection = null;
                    connection = Subscription.EMPTY;
                }
            }
            return connection;
        }
        refCount() {
            return refCount()(this);
        }
    }

    const performanceTimestampProvider = {
        now() {
            return (performanceTimestampProvider.delegate || performance).now();
        },
        delegate: undefined,
    };

    const animationFrameProvider = {
        schedule(callback) {
            let request = requestAnimationFrame;
            let cancel = cancelAnimationFrame;
            const { delegate } = animationFrameProvider;
            if (delegate) {
                request = delegate.requestAnimationFrame;
                cancel = delegate.cancelAnimationFrame;
            }
            const handle = request((timestamp) => {
                cancel = undefined;
                callback(timestamp);
            });
            return new Subscription(() => cancel?.(handle));
        },
        requestAnimationFrame(...args) {
            const { delegate } = animationFrameProvider;
            return (delegate?.requestAnimationFrame || requestAnimationFrame)(...args);
        },
        cancelAnimationFrame(...args) {
            const { delegate } = animationFrameProvider;
            return (delegate?.cancelAnimationFrame || cancelAnimationFrame)(...args);
        },
        delegate: undefined,
    };

    function animationFrames(timestampProvider) {
        return timestampProvider ? animationFramesFactory(timestampProvider) : DEFAULT_ANIMATION_FRAMES;
    }
    function animationFramesFactory(timestampProvider) {
        return new Observable((subscriber) => {
            const provider = timestampProvider || performanceTimestampProvider;
            const start = provider.now();
            let id = 0;
            const run = () => {
                if (!subscriber.closed) {
                    id = animationFrameProvider.requestAnimationFrame((timestamp) => {
                        id = 0;
                        const now = provider.now();
                        subscriber.next({
                            timestamp: timestampProvider ? now : timestamp,
                            elapsed: now - start,
                        });
                        run();
                    });
                }
            };
            run();
            return () => {
                if (id) {
                    animationFrameProvider.cancelAnimationFrame(id);
                }
            };
        });
    }
    const DEFAULT_ANIMATION_FRAMES = animationFramesFactory();

    const ObjectUnsubscribedError = createErrorClass((_super) => function ObjectUnsubscribedErrorImpl() {
        _super(this);
        this.name = 'ObjectUnsubscribedError';
        this.message = 'object unsubscribed';
    });

    class Subject extends Observable {
        constructor() {
            super();
            this.closed = false;
            this.currentObservers = null;
            this.observers = [];
            this.isStopped = false;
            this.hasError = false;
            this.thrownError = null;
        }
        lift(operator) {
            const subject = new AnonymousSubject(this, this);
            subject.operator = operator;
            return subject;
        }
        _throwIfClosed() {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
        }
        next(value) {
            errorContext(() => {
                this._throwIfClosed();
                if (!this.isStopped) {
                    if (!this.currentObservers) {
                        this.currentObservers = Array.from(this.observers);
                    }
                    for (const observer of this.currentObservers) {
                        observer.next(value);
                    }
                }
            });
        }
        error(err) {
            errorContext(() => {
                this._throwIfClosed();
                if (!this.isStopped) {
                    this.hasError = this.isStopped = true;
                    this.thrownError = err;
                    const { observers } = this;
                    while (observers.length) {
                        observers.shift().error(err);
                    }
                }
            });
        }
        complete() {
            errorContext(() => {
                this._throwIfClosed();
                if (!this.isStopped) {
                    this.isStopped = true;
                    const { observers } = this;
                    while (observers.length) {
                        observers.shift().complete();
                    }
                }
            });
        }
        unsubscribe() {
            this.isStopped = this.closed = true;
            this.observers = this.currentObservers = null;
        }
        get observed() {
            return this.observers?.length > 0;
        }
        _trySubscribe(subscriber) {
            this._throwIfClosed();
            return super._trySubscribe(subscriber);
        }
        _subscribe(subscriber) {
            this._throwIfClosed();
            this._checkFinalizedStatuses(subscriber);
            return this._innerSubscribe(subscriber);
        }
        _innerSubscribe(subscriber) {
            const { hasError, isStopped, observers } = this;
            if (hasError || isStopped) {
                return EMPTY_SUBSCRIPTION;
            }
            this.currentObservers = null;
            observers.push(subscriber);
            return new Subscription(() => {
                this.currentObservers = null;
                arrRemove(observers, subscriber);
            });
        }
        _checkFinalizedStatuses(subscriber) {
            const { hasError, thrownError, isStopped } = this;
            if (hasError) {
                subscriber.error(thrownError);
            }
            else if (isStopped) {
                subscriber.complete();
            }
        }
        asObservable() {
            const observable = new Observable();
            observable.source = this;
            return observable;
        }
    }
    Subject.create = (destination, source) => {
        return new AnonymousSubject(destination, source);
    };
    class AnonymousSubject extends Subject {
        constructor(destination, source) {
            super();
            this.destination = destination;
            this.source = source;
        }
        next(value) {
            this.destination?.next?.(value);
        }
        error(err) {
            this.destination?.error?.(err);
        }
        complete() {
            this.destination?.complete?.();
        }
        _subscribe(subscriber) {
            return this.source?.subscribe(subscriber) ?? EMPTY_SUBSCRIPTION;
        }
    }

    class BehaviorSubject extends Subject {
        constructor(_value) {
            super();
            this._value = _value;
        }
        get value() {
            return this.getValue();
        }
        _subscribe(subscriber) {
            const subscription = super._subscribe(subscriber);
            !subscription.closed && subscriber.next(this._value);
            return subscription;
        }
        getValue() {
            const { hasError, thrownError, _value } = this;
            if (hasError) {
                throw thrownError;
            }
            this._throwIfClosed();
            return _value;
        }
        next(value) {
            super.next((this._value = value));
        }
    }

    const dateTimestampProvider = {
        now() {
            return (dateTimestampProvider.delegate || Date).now();
        },
        delegate: undefined,
    };

    class ReplaySubject extends Subject {
        constructor(_bufferSize = Infinity, _windowTime = Infinity, _timestampProvider = dateTimestampProvider) {
            super();
            this._bufferSize = _bufferSize;
            this._windowTime = _windowTime;
            this._timestampProvider = _timestampProvider;
            this._buffer = [];
            this._infiniteTimeWindow = true;
            this._infiniteTimeWindow = _windowTime === Infinity;
            this._bufferSize = Math.max(1, _bufferSize);
            this._windowTime = Math.max(1, _windowTime);
        }
        next(value) {
            const { isStopped, _buffer, _infiniteTimeWindow, _timestampProvider, _windowTime } = this;
            if (!isStopped) {
                _buffer.push(value);
                !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
            }
            this._trimBuffer();
            super.next(value);
        }
        _subscribe(subscriber) {
            this._throwIfClosed();
            this._trimBuffer();
            const subscription = this._innerSubscribe(subscriber);
            const { _infiniteTimeWindow, _buffer } = this;
            const copy = _buffer.slice();
            for (let i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
                subscriber.next(copy[i]);
            }
            this._checkFinalizedStatuses(subscriber);
            return subscription;
        }
        _trimBuffer() {
            const { _bufferSize, _timestampProvider, _buffer, _infiniteTimeWindow } = this;
            const adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
            _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
            if (!_infiniteTimeWindow) {
                const now = _timestampProvider.now();
                let last = 0;
                for (let i = 1; i < _buffer.length && _buffer[i] <= now; i += 2) {
                    last = i;
                }
                last && _buffer.splice(0, last + 1);
            }
        }
    }

    class AsyncSubject extends Subject {
        constructor() {
            super(...arguments);
            this._value = null;
            this._hasValue = false;
            this._isComplete = false;
        }
        _checkFinalizedStatuses(subscriber) {
            const { hasError, _hasValue, _value, thrownError, isStopped, _isComplete } = this;
            if (hasError) {
                subscriber.error(thrownError);
            }
            else if (isStopped || _isComplete) {
                _hasValue && subscriber.next(_value);
                subscriber.complete();
            }
        }
        next(value) {
            if (!this.isStopped) {
                this._value = value;
                this._hasValue = true;
            }
        }
        complete() {
            const { _hasValue, _value, _isComplete } = this;
            if (!_isComplete) {
                this._isComplete = true;
                _hasValue && super.next(_value);
                super.complete();
            }
        }
    }

    class Action extends Subscription {
        constructor(scheduler, work) {
            super();
        }
        schedule(state, delay = 0) {
            return this;
        }
    }

    const intervalProvider = {
        setInterval(handler, timeout, ...args) {
            const { delegate } = intervalProvider;
            if (delegate?.setInterval) {
                return delegate.setInterval(handler, timeout, ...args);
            }
            return setInterval(handler, timeout, ...args);
        },
        clearInterval(handle) {
            const { delegate } = intervalProvider;
            return (delegate?.clearInterval || clearInterval)(handle);
        },
        delegate: undefined,
    };

    class AsyncAction extends Action {
        constructor(scheduler, work) {
            super(scheduler, work);
            this.scheduler = scheduler;
            this.work = work;
            this.pending = false;
        }
        schedule(state, delay = 0) {
            if (this.closed) {
                return this;
            }
            this.state = state;
            const id = this.id;
            const scheduler = this.scheduler;
            if (id != null) {
                this.id = this.recycleAsyncId(scheduler, id, delay);
            }
            this.pending = true;
            this.delay = delay;
            this.id = this.id ?? this.requestAsyncId(scheduler, this.id, delay);
            return this;
        }
        requestAsyncId(scheduler, _id, delay = 0) {
            return intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay);
        }
        recycleAsyncId(_scheduler, id, delay = 0) {
            if (delay != null && this.delay === delay && this.pending === false) {
                return id;
            }
            if (id != null) {
                intervalProvider.clearInterval(id);
            }
            return undefined;
        }
        execute(state, delay) {
            if (this.closed) {
                return new Error('executing a cancelled action');
            }
            this.pending = false;
            const error = this._execute(state, delay);
            if (error) {
                return error;
            }
            else if (this.pending === false && this.id != null) {
                this.id = this.recycleAsyncId(this.scheduler, this.id, null);
            }
        }
        _execute(state, _delay) {
            let errored = false;
            let errorValue;
            try {
                this.work(state);
            }
            catch (e) {
                errored = true;
                errorValue = e ? e : new Error('Scheduled action threw falsy error');
            }
            if (errored) {
                this.unsubscribe();
                return errorValue;
            }
        }
        unsubscribe() {
            if (!this.closed) {
                const { id, scheduler } = this;
                const { actions } = scheduler;
                this.work = this.state = this.scheduler = null;
                this.pending = false;
                arrRemove(actions, this);
                if (id != null) {
                    this.id = this.recycleAsyncId(scheduler, id, null);
                }
                this.delay = null;
                super.unsubscribe();
            }
        }
    }

    let nextHandle = 1;
    let resolved;
    const activeHandles = {};
    function findAndClearHandle(handle) {
        if (handle in activeHandles) {
            delete activeHandles[handle];
            return true;
        }
        return false;
    }
    const Immediate = {
        setImmediate(cb) {
            const handle = nextHandle++;
            activeHandles[handle] = true;
            if (!resolved) {
                resolved = Promise.resolve();
            }
            resolved.then(() => findAndClearHandle(handle) && cb());
            return handle;
        },
        clearImmediate(handle) {
            findAndClearHandle(handle);
        },
    };

    const { setImmediate, clearImmediate } = Immediate;
    const immediateProvider = {
        setImmediate(...args) {
            const { delegate } = immediateProvider;
            return (delegate?.setImmediate || setImmediate)(...args);
        },
        clearImmediate(handle) {
            const { delegate } = immediateProvider;
            return (delegate?.clearImmediate || clearImmediate)(handle);
        },
        delegate: undefined,
    };

    class AsapAction extends AsyncAction {
        constructor(scheduler, work) {
            super(scheduler, work);
            this.scheduler = scheduler;
            this.work = work;
        }
        requestAsyncId(scheduler, id, delay = 0) {
            if (delay !== null && delay > 0) {
                return super.requestAsyncId(scheduler, id, delay);
            }
            scheduler.actions.push(this);
            return scheduler._scheduled || (scheduler._scheduled = immediateProvider.setImmediate(scheduler.flush.bind(scheduler, undefined)));
        }
        recycleAsyncId(scheduler, id, delay = 0) {
            if (delay != null ? delay > 0 : this.delay > 0) {
                return super.recycleAsyncId(scheduler, id, delay);
            }
            const { actions } = scheduler;
            if (id != null && actions[actions.length - 1]?.id !== id) {
                immediateProvider.clearImmediate(id);
                if (scheduler._scheduled === id) {
                    scheduler._scheduled = undefined;
                }
            }
            return undefined;
        }
    }

    class Scheduler {
        constructor(schedulerActionCtor, now = Scheduler.now) {
            this.schedulerActionCtor = schedulerActionCtor;
            this.now = now;
        }
        schedule(work, delay = 0, state) {
            return new this.schedulerActionCtor(this, work).schedule(state, delay);
        }
    }
    Scheduler.now = dateTimestampProvider.now;

    class AsyncScheduler extends Scheduler {
        constructor(SchedulerAction, now = Scheduler.now) {
            super(SchedulerAction, now);
            this.actions = [];
            this._active = false;
        }
        flush(action) {
            const { actions } = this;
            if (this._active) {
                actions.push(action);
                return;
            }
            let error;
            this._active = true;
            do {
                if ((error = action.execute(action.state, action.delay))) {
                    break;
                }
            } while ((action = actions.shift()));
            this._active = false;
            if (error) {
                while ((action = actions.shift())) {
                    action.unsubscribe();
                }
                throw error;
            }
        }
    }

    class AsapScheduler extends AsyncScheduler {
        flush(action) {
            this._active = true;
            const flushId = this._scheduled;
            this._scheduled = undefined;
            const { actions } = this;
            let error;
            action = action || actions.shift();
            do {
                if ((error = action.execute(action.state, action.delay))) {
                    break;
                }
            } while ((action = actions[0]) && action.id === flushId && actions.shift());
            this._active = false;
            if (error) {
                while ((action = actions[0]) && action.id === flushId && actions.shift()) {
                    action.unsubscribe();
                }
                throw error;
            }
        }
    }

    const asapScheduler = new AsapScheduler(AsapAction);
    const asap = asapScheduler;

    const asyncScheduler = new AsyncScheduler(AsyncAction);
    const async = asyncScheduler;

    class QueueAction extends AsyncAction {
        constructor(scheduler, work) {
            super(scheduler, work);
            this.scheduler = scheduler;
            this.work = work;
        }
        schedule(state, delay = 0) {
            if (delay > 0) {
                return super.schedule(state, delay);
            }
            this.delay = delay;
            this.state = state;
            this.scheduler.flush(this);
            return this;
        }
        execute(state, delay) {
            return delay > 0 || this.closed ? super.execute(state, delay) : this._execute(state, delay);
        }
        requestAsyncId(scheduler, id, delay = 0) {
            if ((delay != null && delay > 0) || (delay == null && this.delay > 0)) {
                return super.requestAsyncId(scheduler, id, delay);
            }
            scheduler.flush(this);
            return 0;
        }
    }

    class QueueScheduler extends AsyncScheduler {
    }

    const queueScheduler = new QueueScheduler(QueueAction);
    const queue = queueScheduler;

    class AnimationFrameAction extends AsyncAction {
        constructor(scheduler, work) {
            super(scheduler, work);
            this.scheduler = scheduler;
            this.work = work;
        }
        requestAsyncId(scheduler, id, delay = 0) {
            if (delay !== null && delay > 0) {
                return super.requestAsyncId(scheduler, id, delay);
            }
            scheduler.actions.push(this);
            return scheduler._scheduled || (scheduler._scheduled = animationFrameProvider.requestAnimationFrame(() => scheduler.flush(undefined)));
        }
        recycleAsyncId(scheduler, id, delay = 0) {
            if (delay != null ? delay > 0 : this.delay > 0) {
                return super.recycleAsyncId(scheduler, id, delay);
            }
            const { actions } = scheduler;
            if (id != null && actions[actions.length - 1]?.id !== id) {
                animationFrameProvider.cancelAnimationFrame(id);
                scheduler._scheduled = undefined;
            }
            return undefined;
        }
    }

    class AnimationFrameScheduler extends AsyncScheduler {
        flush(action) {
            this._active = true;
            const flushId = this._scheduled;
            this._scheduled = undefined;
            const { actions } = this;
            let error;
            action = action || actions.shift();
            do {
                if ((error = action.execute(action.state, action.delay))) {
                    break;
                }
            } while ((action = actions[0]) && action.id === flushId && actions.shift());
            this._active = false;
            if (error) {
                while ((action = actions[0]) && action.id === flushId && actions.shift()) {
                    action.unsubscribe();
                }
                throw error;
            }
        }
    }

    const animationFrameScheduler = new AnimationFrameScheduler(AnimationFrameAction);
    const animationFrame = animationFrameScheduler;

    class VirtualTimeScheduler extends AsyncScheduler {
        constructor(schedulerActionCtor = VirtualAction, maxFrames = Infinity) {
            super(schedulerActionCtor, () => this.frame);
            this.maxFrames = maxFrames;
            this.frame = 0;
            this.index = -1;
        }
        flush() {
            const { actions, maxFrames } = this;
            let error;
            let action;
            while ((action = actions[0]) && action.delay <= maxFrames) {
                actions.shift();
                this.frame = action.delay;
                if ((error = action.execute(action.state, action.delay))) {
                    break;
                }
            }
            if (error) {
                while ((action = actions.shift())) {
                    action.unsubscribe();
                }
                throw error;
            }
        }
    }
    VirtualTimeScheduler.frameTimeFactor = 10;
    class VirtualAction extends AsyncAction {
        constructor(scheduler, work, index = (scheduler.index += 1)) {
            super(scheduler, work);
            this.scheduler = scheduler;
            this.work = work;
            this.index = index;
            this.active = true;
            this.index = scheduler.index = index;
        }
        schedule(state, delay = 0) {
            if (Number.isFinite(delay)) {
                if (!this.id) {
                    return super.schedule(state, delay);
                }
                this.active = false;
                const action = new VirtualAction(this.scheduler, this.work);
                this.add(action);
                return action.schedule(state, delay);
            }
            else {
                return Subscription.EMPTY;
            }
        }
        requestAsyncId(scheduler, id, delay = 0) {
            this.delay = scheduler.frame + delay;
            const { actions } = scheduler;
            actions.push(this);
            actions.sort(VirtualAction.sortActions);
            return 1;
        }
        recycleAsyncId(scheduler, id, delay = 0) {
            return undefined;
        }
        _execute(state, delay) {
            if (this.active === true) {
                return super._execute(state, delay);
            }
        }
        static sortActions(a, b) {
            if (a.delay === b.delay) {
                if (a.index === b.index) {
                    return 0;
                }
                else if (a.index > b.index) {
                    return 1;
                }
                else {
                    return -1;
                }
            }
            else if (a.delay > b.delay) {
                return 1;
            }
            else {
                return -1;
            }
        }
    }

    const EMPTY = new Observable((subscriber) => subscriber.complete());
    function empty(scheduler) {
        return scheduler ? emptyScheduled(scheduler) : EMPTY;
    }
    function emptyScheduled(scheduler) {
        return new Observable((subscriber) => scheduler.schedule(() => subscriber.complete()));
    }

    function isScheduler(value) {
        return value && isFunction(value.schedule);
    }

    function last$1(arr) {
        return arr[arr.length - 1];
    }
    function popResultSelector(args) {
        return isFunction(last$1(args)) ? args.pop() : undefined;
    }
    function popScheduler(args) {
        return isScheduler(last$1(args)) ? args.pop() : undefined;
    }
    function popNumber(args, defaultValue) {
        return typeof last$1(args) === 'number' ? args.pop() : defaultValue;
    }

    const isArrayLike = ((x) => x && typeof x.length === 'number' && typeof x !== 'function');

    function isPromise(value) {
        return isFunction(value?.then);
    }

    function isInteropObservable(input) {
        return isFunction(input[observable]);
    }

    function isAsyncIterable(obj) {
        return Symbol.asyncIterator && isFunction(obj?.[Symbol.asyncIterator]);
    }

    function createInvalidObservableTypeError(input) {
        return new TypeError(`You provided ${input !== null && typeof input === 'object' ? 'an invalid object' : `'${input}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`);
    }

    function getSymbolIterator() {
        if (typeof Symbol !== 'function' || !Symbol.iterator) {
            return '@@iterator';
        }
        return Symbol.iterator;
    }
    const iterator = getSymbolIterator();

    function isIterable(input) {
        return isFunction(input?.[iterator]);
    }

    async function* readableStreamLikeToAsyncGenerator(readableStream) {
        const reader = readableStream.getReader();
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    return;
                }
                yield value;
            }
        }
        finally {
            reader.releaseLock();
        }
    }
    function isReadableStreamLike(obj) {
        return isFunction(obj?.getReader);
    }

    function innerFrom(input) {
        if (input instanceof Observable) {
            return input;
        }
        if (input != null) {
            if (isInteropObservable(input)) {
                return fromInteropObservable(input);
            }
            if (isArrayLike(input)) {
                return fromArrayLike(input);
            }
            if (isPromise(input)) {
                return fromPromise(input);
            }
            if (isAsyncIterable(input)) {
                return fromAsyncIterable(input);
            }
            if (isIterable(input)) {
                return fromIterable(input);
            }
            if (isReadableStreamLike(input)) {
                return fromReadableStreamLike(input);
            }
        }
        throw createInvalidObservableTypeError(input);
    }
    function fromInteropObservable(obj) {
        return new Observable((subscriber) => {
            const obs = obj[observable]();
            if (isFunction(obs.subscribe)) {
                return obs.subscribe(subscriber);
            }
            throw new TypeError('Provided object does not correctly implement Symbol.observable');
        });
    }
    function fromArrayLike(array) {
        return new Observable((subscriber) => {
            for (let i = 0; i < array.length && !subscriber.closed; i++) {
                subscriber.next(array[i]);
            }
            subscriber.complete();
        });
    }
    function fromPromise(promise) {
        return new Observable((subscriber) => {
            promise
                .then((value) => {
                if (!subscriber.closed) {
                    subscriber.next(value);
                    subscriber.complete();
                }
            }, (err) => subscriber.error(err))
                .then(null, reportUnhandledError);
        });
    }
    function fromIterable(iterable) {
        return new Observable((subscriber) => {
            for (const value of iterable) {
                subscriber.next(value);
                if (subscriber.closed) {
                    return;
                }
            }
            subscriber.complete();
        });
    }
    function fromAsyncIterable(asyncIterable) {
        return new Observable((subscriber) => {
            process(asyncIterable, subscriber).catch((err) => subscriber.error(err));
        });
    }
    function fromReadableStreamLike(readableStream) {
        return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
    }
    async function process(asyncIterable, subscriber) {
        for await (const value of asyncIterable) {
            subscriber.next(value);
            if (subscriber.closed) {
                return;
            }
        }
        subscriber.complete();
    }

    function executeSchedule(parentSubscription, scheduler, work, delay = 0, repeat = false) {
        const scheduleSubscription = scheduler.schedule(function () {
            work();
            if (repeat) {
                parentSubscription.add(this.schedule(null, delay));
            }
            else {
                this.unsubscribe();
            }
        }, delay);
        parentSubscription.add(scheduleSubscription);
        if (!repeat) {
            return scheduleSubscription;
        }
    }

    function observeOn(scheduler, delay = 0) {
        return operate((source, subscriber) => {
            source.subscribe(createOperatorSubscriber(subscriber, (value) => executeSchedule(subscriber, scheduler, () => subscriber.next(value), delay), () => executeSchedule(subscriber, scheduler, () => subscriber.complete(), delay), (err) => executeSchedule(subscriber, scheduler, () => subscriber.error(err), delay)));
        });
    }

    function subscribeOn(scheduler, delay = 0) {
        return operate((source, subscriber) => {
            subscriber.add(scheduler.schedule(() => source.subscribe(subscriber), delay));
        });
    }

    function scheduleObservable(input, scheduler) {
        return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
    }

    function schedulePromise(input, scheduler) {
        return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
    }

    function scheduleArray(input, scheduler) {
        return new Observable((subscriber) => {
            let i = 0;
            return scheduler.schedule(function () {
                if (i === input.length) {
                    subscriber.complete();
                }
                else {
                    subscriber.next(input[i++]);
                    if (!subscriber.closed) {
                        this.schedule();
                    }
                }
            });
        });
    }

    function scheduleIterable(input, scheduler) {
        return new Observable((subscriber) => {
            let iterator$1;
            executeSchedule(subscriber, scheduler, () => {
                iterator$1 = input[iterator]();
                executeSchedule(subscriber, scheduler, () => {
                    let value;
                    let done;
                    try {
                        ({ value, done } = iterator$1.next());
                    }
                    catch (err) {
                        subscriber.error(err);
                        return;
                    }
                    if (done) {
                        subscriber.complete();
                    }
                    else {
                        subscriber.next(value);
                    }
                }, 0, true);
            });
            return () => isFunction(iterator$1?.return) && iterator$1.return();
        });
    }

    function scheduleAsyncIterable(input, scheduler) {
        if (!input) {
            throw new Error('Iterable cannot be null');
        }
        return new Observable((subscriber) => {
            executeSchedule(subscriber, scheduler, () => {
                const iterator = input[Symbol.asyncIterator]();
                executeSchedule(subscriber, scheduler, () => {
                    iterator.next().then((result) => {
                        if (result.done) {
                            subscriber.complete();
                        }
                        else {
                            subscriber.next(result.value);
                        }
                    });
                }, 0, true);
            });
        });
    }

    function scheduleReadableStreamLike(input, scheduler) {
        return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
    }

    function scheduled(input, scheduler) {
        if (input != null) {
            if (isInteropObservable(input)) {
                return scheduleObservable(input, scheduler);
            }
            if (isArrayLike(input)) {
                return scheduleArray(input, scheduler);
            }
            if (isPromise(input)) {
                return schedulePromise(input, scheduler);
            }
            if (isAsyncIterable(input)) {
                return scheduleAsyncIterable(input, scheduler);
            }
            if (isIterable(input)) {
                return scheduleIterable(input, scheduler);
            }
            if (isReadableStreamLike(input)) {
                return scheduleReadableStreamLike(input, scheduler);
            }
        }
        throw createInvalidObservableTypeError(input);
    }

    function from(input, scheduler) {
        return scheduler ? scheduled(input, scheduler) : innerFrom(input);
    }

    function of(...args) {
        const scheduler = popScheduler(args);
        return from(args, scheduler);
    }

    function throwError(errorOrErrorFactory, scheduler) {
        const errorFactory = isFunction(errorOrErrorFactory) ? errorOrErrorFactory : () => errorOrErrorFactory;
        const init = (subscriber) => subscriber.error(errorFactory());
        return new Observable(scheduler ? (subscriber) => scheduler.schedule(init, 0, subscriber) : init);
    }

    exports.NotificationKind = void 0;
    (function (NotificationKind) {
        NotificationKind["NEXT"] = "N";
        NotificationKind["ERROR"] = "E";
        NotificationKind["COMPLETE"] = "C";
    })(exports.NotificationKind || (exports.NotificationKind = {}));
    class Notification {
        constructor(kind, value, error) {
            this.kind = kind;
            this.value = value;
            this.error = error;
            this.hasValue = kind === 'N';
        }
        observe(observer) {
            return observeNotification(this, observer);
        }
        do(nextHandler, errorHandler, completeHandler) {
            const { kind, value, error } = this;
            return kind === 'N' ? nextHandler?.(value) : kind === 'E' ? errorHandler?.(error) : completeHandler?.();
        }
        accept(nextOrObserver, error, complete) {
            return isFunction(nextOrObserver?.next)
                ? this.observe(nextOrObserver)
                : this.do(nextOrObserver, error, complete);
        }
        toObservable() {
            const { kind, value, error } = this;
            const result = kind === 'N'
                ?
                    of(value)
                :
                    kind === 'E'
                        ?
                            throwError(() => error)
                        :
                            kind === 'C'
                                ?
                                    EMPTY
                                :
                                    0;
            if (!result) {
                throw new TypeError(`Unexpected notification kind ${kind}`);
            }
            return result;
        }
        static createNext(value) {
            return new Notification('N', value);
        }
        static createError(err) {
            return new Notification('E', undefined, err);
        }
        static createComplete() {
            return Notification.completeNotification;
        }
    }
    Notification.completeNotification = new Notification('C');
    function observeNotification(notification, observer) {
        const { kind, value, error } = notification;
        if (typeof kind !== 'string') {
            throw new TypeError('Invalid notification, missing "kind"');
        }
        kind === 'N' ? observer.next?.(value) : kind === 'E' ? observer.error?.(error) : observer.complete?.();
    }

    function isObservable(obj) {
        return !!obj && (obj instanceof Observable || (isFunction(obj.lift) && isFunction(obj.subscribe)));
    }

    const EmptyError = createErrorClass((_super) => function EmptyErrorImpl() {
        _super(this);
        this.name = 'EmptyError';
        this.message = 'no elements in sequence';
    });

    function lastValueFrom(source, config) {
        const hasConfig = typeof config === 'object';
        return new Promise((resolve, reject) => {
            let _hasValue = false;
            let _value;
            source.subscribe({
                next: (value) => {
                    _value = value;
                    _hasValue = true;
                },
                error: reject,
                complete: () => {
                    if (_hasValue) {
                        resolve(_value);
                    }
                    else if (hasConfig) {
                        resolve(config.defaultValue);
                    }
                    else {
                        reject(new EmptyError());
                    }
                },
            });
        });
    }

    function firstValueFrom(source, config) {
        const hasConfig = typeof config === 'object';
        return new Promise((resolve, reject) => {
            const subscriber = new SafeSubscriber({
                next: (value) => {
                    resolve(value);
                    subscriber.unsubscribe();
                },
                error: reject,
                complete: () => {
                    if (hasConfig) {
                        resolve(config.defaultValue);
                    }
                    else {
                        reject(new EmptyError());
                    }
                },
            });
            source.subscribe(subscriber);
        });
    }

    const ArgumentOutOfRangeError = createErrorClass((_super) => function ArgumentOutOfRangeErrorImpl() {
        _super(this);
        this.name = 'ArgumentOutOfRangeError';
        this.message = 'argument out of range';
    });

    const NotFoundError = createErrorClass((_super) => function NotFoundErrorImpl(message) {
        _super(this);
        this.name = 'NotFoundError';
        this.message = message;
    });

    const SequenceError = createErrorClass((_super) => function SequenceErrorImpl(message) {
        _super(this);
        this.name = 'SequenceError';
        this.message = message;
    });

    function isValidDate(value) {
        return value instanceof Date && !isNaN(value);
    }

    const TimeoutError = createErrorClass((_super) => function TimeoutErrorImpl(info = null) {
        _super(this);
        this.message = 'Timeout has occurred';
        this.name = 'TimeoutError';
        this.info = info;
    });
    function timeout(config, schedulerArg) {
        const { first, each, with: _with = timeoutErrorFactory, scheduler = schedulerArg ?? asyncScheduler, meta = null, } = (isValidDate(config) ? { first: config } : typeof config === 'number' ? { each: config } : config);
        if (first == null && each == null) {
            throw new TypeError('No timeout provided.');
        }
        return operate((source, subscriber) => {
            let originalSourceSubscription;
            let timerSubscription;
            let lastValue = null;
            let seen = 0;
            const startTimer = (delay) => {
                timerSubscription = executeSchedule(subscriber, scheduler, () => {
                    try {
                        originalSourceSubscription.unsubscribe();
                        innerFrom(_with({
                            meta,
                            lastValue,
                            seen,
                        })).subscribe(subscriber);
                    }
                    catch (err) {
                        subscriber.error(err);
                    }
                }, delay);
            };
            originalSourceSubscription = source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                timerSubscription?.unsubscribe();
                seen++;
                subscriber.next((lastValue = value));
                each > 0 && startTimer(each);
            }, undefined, undefined, () => {
                if (!timerSubscription?.closed) {
                    timerSubscription?.unsubscribe();
                }
                lastValue = null;
            }));
            !seen && startTimer(first != null ? (typeof first === 'number' ? first : +first - scheduler.now()) : each);
        });
    }
    function timeoutErrorFactory(info) {
        throw new TimeoutError(info);
    }

    function map(project, thisArg) {
        return operate((source, subscriber) => {
            let index = 0;
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                subscriber.next(project.call(thisArg, value, index++));
            }));
        });
    }

    const { isArray: isArray$2 } = Array;
    function callOrApply(fn, args) {
        return isArray$2(args) ? fn(...args) : fn(args);
    }
    function mapOneOrManyArgs(fn) {
        return map(args => callOrApply(fn, args));
    }

    function bindCallbackInternals(isNodeStyle, callbackFunc, resultSelector, scheduler) {
        if (resultSelector) {
            if (isScheduler(resultSelector)) {
                scheduler = resultSelector;
            }
            else {
                return function (...args) {
                    return bindCallbackInternals(isNodeStyle, callbackFunc, scheduler)
                        .apply(this, args)
                        .pipe(mapOneOrManyArgs(resultSelector));
                };
            }
        }
        if (scheduler) {
            return function (...args) {
                return bindCallbackInternals(isNodeStyle, callbackFunc)
                    .apply(this, args)
                    .pipe(subscribeOn(scheduler), observeOn(scheduler));
            };
        }
        return function (...args) {
            const subject = new AsyncSubject();
            let uninitialized = true;
            return new Observable((subscriber) => {
                const subs = subject.subscribe(subscriber);
                if (uninitialized) {
                    uninitialized = false;
                    let isAsync = false;
                    let isComplete = false;
                    callbackFunc.apply(this, [
                        ...args,
                        (...results) => {
                            if (isNodeStyle) {
                                const err = results.shift();
                                if (err != null) {
                                    subject.error(err);
                                    return;
                                }
                            }
                            subject.next(1 < results.length ? results : results[0]);
                            isComplete = true;
                            if (isAsync) {
                                subject.complete();
                            }
                        },
                    ]);
                    if (isComplete) {
                        subject.complete();
                    }
                    isAsync = true;
                }
                return subs;
            });
        };
    }

    function bindCallback(callbackFunc, resultSelector, scheduler) {
        return bindCallbackInternals(false, callbackFunc, resultSelector, scheduler);
    }

    function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
        return bindCallbackInternals(true, callbackFunc, resultSelector, scheduler);
    }

    const { isArray: isArray$1 } = Array;
    const { getPrototypeOf, prototype: objectProto, keys: getKeys } = Object;
    function argsArgArrayOrObject(args) {
        if (args.length === 1) {
            const first = args[0];
            if (isArray$1(first)) {
                return { args: first, keys: null };
            }
            if (isPOJO(first)) {
                const keys = getKeys(first);
                return {
                    args: keys.map((key) => first[key]),
                    keys,
                };
            }
        }
        return { args: args, keys: null };
    }
    function isPOJO(obj) {
        return obj && typeof obj === 'object' && getPrototypeOf(obj) === objectProto;
    }

    function createObject(keys, values) {
        return keys.reduce((result, key, i) => ((result[key] = values[i]), result), {});
    }

    function combineLatest$1(...args) {
        const scheduler = popScheduler(args);
        const resultSelector = popResultSelector(args);
        const { args: observables, keys } = argsArgArrayOrObject(args);
        if (observables.length === 0) {
            return from([], scheduler);
        }
        const result = new Observable(combineLatestInit(observables, scheduler, keys
            ?
                (values) => createObject(keys, values)
            :
                identity));
        return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
    }
    function combineLatestInit(observables, scheduler, valueTransform = identity) {
        return (subscriber) => {
            maybeSchedule(scheduler, () => {
                const { length } = observables;
                const values = new Array(length);
                let active = length;
                let remainingFirstValues = length;
                for (let i = 0; i < length; i++) {
                    maybeSchedule(scheduler, () => {
                        const source = from(observables[i], scheduler);
                        let hasFirstValue = false;
                        source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                            values[i] = value;
                            if (!hasFirstValue) {
                                hasFirstValue = true;
                                remainingFirstValues--;
                            }
                            if (!remainingFirstValues) {
                                subscriber.next(valueTransform(values.slice()));
                            }
                        }, () => {
                            if (!--active) {
                                subscriber.complete();
                            }
                        }));
                    }, subscriber);
                }
            }, subscriber);
        };
    }
    function maybeSchedule(scheduler, execute, subscription) {
        if (scheduler) {
            executeSchedule(subscription, scheduler, execute);
        }
        else {
            execute();
        }
    }

    function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
        const buffer = [];
        let active = 0;
        let index = 0;
        let isComplete = false;
        const checkComplete = () => {
            if (isComplete && !buffer.length && !active) {
                subscriber.complete();
            }
        };
        const outerNext = (value) => (active < concurrent ? doInnerSub(value) : buffer.push(value));
        const doInnerSub = (value) => {
            expand && subscriber.next(value);
            active++;
            let innerComplete = false;
            innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, (innerValue) => {
                onBeforeNext?.(innerValue);
                if (expand) {
                    outerNext(innerValue);
                }
                else {
                    subscriber.next(innerValue);
                }
            }, () => {
                innerComplete = true;
            }, undefined, () => {
                if (innerComplete) {
                    try {
                        active--;
                        while (buffer.length && active < concurrent) {
                            const bufferedValue = buffer.shift();
                            if (innerSubScheduler) {
                                executeSchedule(subscriber, innerSubScheduler, () => doInnerSub(bufferedValue));
                            }
                            else {
                                doInnerSub(bufferedValue);
                            }
                        }
                        checkComplete();
                    }
                    catch (err) {
                        subscriber.error(err);
                    }
                }
            }));
        };
        source.subscribe(createOperatorSubscriber(subscriber, outerNext, () => {
            isComplete = true;
            checkComplete();
        }));
        return () => {
            additionalFinalizer?.();
        };
    }

    function mergeMap(project, resultSelector, concurrent = Infinity) {
        if (isFunction(resultSelector)) {
            return mergeMap((a, i) => map((b, ii) => resultSelector(a, b, i, ii))(innerFrom(project(a, i))), concurrent);
        }
        else if (typeof resultSelector === 'number') {
            concurrent = resultSelector;
        }
        return operate((source, subscriber) => mergeInternals(source, subscriber, project, concurrent));
    }

    function mergeAll(concurrent = Infinity) {
        return mergeMap(identity, concurrent);
    }

    function concatAll() {
        return mergeAll(1);
    }

    function concat$1(...args) {
        return concatAll()(from(args, popScheduler(args)));
    }

    function defer(observableFactory) {
        return new Observable((subscriber) => {
            innerFrom(observableFactory()).subscribe(subscriber);
        });
    }

    const DEFAULT_CONFIG$1 = {
        connector: () => new Subject(),
        resetOnDisconnect: true,
    };
    function connectable(source, config = DEFAULT_CONFIG$1) {
        let connection = null;
        const { connector, resetOnDisconnect = true } = config;
        let subject = connector();
        const result = new Observable((subscriber) => {
            return subject.subscribe(subscriber);
        });
        result.connect = () => {
            if (!connection || connection.closed) {
                connection = defer(() => source).subscribe(subject);
                if (resetOnDisconnect) {
                    connection.add(() => (subject = connector()));
                }
            }
            return connection;
        };
        return result;
    }

    function forkJoin(...args) {
        const resultSelector = popResultSelector(args);
        const { args: sources, keys } = argsArgArrayOrObject(args);
        const result = new Observable((subscriber) => {
            const { length } = sources;
            if (!length) {
                subscriber.complete();
                return;
            }
            const values = new Array(length);
            let remainingCompletions = length;
            let remainingEmissions = length;
            for (let sourceIndex = 0; sourceIndex < length; sourceIndex++) {
                let hasValue = false;
                innerFrom(sources[sourceIndex]).subscribe(createOperatorSubscriber(subscriber, (value) => {
                    if (!hasValue) {
                        hasValue = true;
                        remainingEmissions--;
                    }
                    values[sourceIndex] = value;
                }, () => remainingCompletions--, undefined, () => {
                    if (!remainingCompletions || !hasValue) {
                        if (!remainingEmissions) {
                            subscriber.next(keys ? createObject(keys, values) : values);
                        }
                        subscriber.complete();
                    }
                }));
            }
        });
        return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
    }

    const nodeEventEmitterMethods = ['addListener', 'removeListener'];
    const eventTargetMethods = ['addEventListener', 'removeEventListener'];
    const jqueryMethods = ['on', 'off'];
    function fromEvent(target, eventName, options, resultSelector) {
        if (isFunction(options)) {
            resultSelector = options;
            options = undefined;
        }
        if (resultSelector) {
            return fromEvent(target, eventName, options).pipe(mapOneOrManyArgs(resultSelector));
        }
        const [add, remove] = isEventTarget(target)
            ? eventTargetMethods.map((methodName) => (handler) => target[methodName](eventName, handler, options))
            :
                isNodeStyleEventEmitter(target)
                    ? nodeEventEmitterMethods.map(toCommonHandlerRegistry(target, eventName))
                    : isJQueryStyleEventEmitter(target)
                        ? jqueryMethods.map(toCommonHandlerRegistry(target, eventName))
                        : [];
        if (!add) {
            if (isArrayLike(target)) {
                return mergeMap((subTarget) => fromEvent(subTarget, eventName, options))(innerFrom(target));
            }
        }
        if (!add) {
            throw new TypeError('Invalid event target');
        }
        return new Observable((subscriber) => {
            const handler = (...args) => subscriber.next(1 < args.length ? args : args[0]);
            add(handler);
            return () => remove(handler);
        });
    }
    function toCommonHandlerRegistry(target, eventName) {
        return (methodName) => (handler) => target[methodName](eventName, handler);
    }
    function isNodeStyleEventEmitter(target) {
        return isFunction(target.addListener) && isFunction(target.removeListener);
    }
    function isJQueryStyleEventEmitter(target) {
        return isFunction(target.on) && isFunction(target.off);
    }
    function isEventTarget(target) {
        return isFunction(target.addEventListener) && isFunction(target.removeEventListener);
    }

    function fromEventPattern(addHandler, removeHandler, resultSelector) {
        if (resultSelector) {
            return fromEventPattern(addHandler, removeHandler).pipe(mapOneOrManyArgs(resultSelector));
        }
        return new Observable((subscriber) => {
            const handler = (...e) => subscriber.next(e.length === 1 ? e[0] : e);
            const retValue = addHandler(handler);
            return isFunction(removeHandler) ? () => removeHandler(handler, retValue) : undefined;
        });
    }

    function generate(initialStateOrOptions, condition, iterate, resultSelectorOrScheduler, scheduler) {
        let resultSelector;
        let initialState;
        if (arguments.length === 1) {
            ({
                initialState,
                condition,
                iterate,
                resultSelector = identity,
                scheduler,
            } = initialStateOrOptions);
        }
        else {
            initialState = initialStateOrOptions;
            if (!resultSelectorOrScheduler || isScheduler(resultSelectorOrScheduler)) {
                resultSelector = identity;
                scheduler = resultSelectorOrScheduler;
            }
            else {
                resultSelector = resultSelectorOrScheduler;
            }
        }
        function* gen() {
            for (let state = initialState; !condition || condition(state); state = iterate(state)) {
                yield resultSelector(state);
            }
        }
        return defer((scheduler
            ?
                () => scheduleIterable(gen(), scheduler)
            :
                gen));
    }

    function iif(condition, trueResult, falseResult) {
        return defer(() => (condition() ? trueResult : falseResult));
    }

    function timer(dueTime = 0, intervalOrScheduler, scheduler = async) {
        let intervalDuration = -1;
        if (intervalOrScheduler != null) {
            if (isScheduler(intervalOrScheduler)) {
                scheduler = intervalOrScheduler;
            }
            else {
                intervalDuration = intervalOrScheduler;
            }
        }
        return new Observable((subscriber) => {
            let due = isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
            if (due < 0) {
                due = 0;
            }
            let n = 0;
            return scheduler.schedule(function () {
                if (!subscriber.closed) {
                    subscriber.next(n++);
                    if (0 <= intervalDuration) {
                        this.schedule(undefined, intervalDuration);
                    }
                    else {
                        subscriber.complete();
                    }
                }
            }, due);
        });
    }

    function interval(period = 0, scheduler = asyncScheduler) {
        if (period < 0) {
            period = 0;
        }
        return timer(period, period, scheduler);
    }

    function merge$1(...args) {
        const scheduler = popScheduler(args);
        const concurrent = popNumber(args, Infinity);
        const sources = args;
        return !sources.length
            ?
                EMPTY
            : sources.length === 1
                ?
                    innerFrom(sources[0])
                :
                    mergeAll(concurrent)(from(sources, scheduler));
    }

    const NEVER = new Observable(noop);
    function never() {
        return NEVER;
    }

    const { isArray } = Array;
    function argsOrArgArray(args) {
        return args.length === 1 && isArray(args[0]) ? args[0] : args;
    }

    function onErrorResumeNext$1(...sources) {
        const nextSources = argsOrArgArray(sources);
        return new Observable((subscriber) => {
            let sourceIndex = 0;
            const subscribeNext = () => {
                if (sourceIndex < nextSources.length) {
                    let nextSource;
                    try {
                        nextSource = innerFrom(nextSources[sourceIndex++]);
                    }
                    catch (err) {
                        subscribeNext();
                        return;
                    }
                    const innerSubscriber = new OperatorSubscriber(subscriber, undefined, noop, noop);
                    nextSource.subscribe(innerSubscriber);
                    innerSubscriber.add(subscribeNext);
                }
                else {
                    subscriber.complete();
                }
            };
            subscribeNext();
        });
    }

    function pairs(obj, scheduler) {
        return from(Object.entries(obj), scheduler);
    }

    function not(pred, thisArg) {
        return (value, index) => !pred.call(thisArg, value, index);
    }

    function filter(predicate, thisArg) {
        return operate((source, subscriber) => {
            let index = 0;
            source.subscribe(createOperatorSubscriber(subscriber, (value) => predicate.call(thisArg, value, index++) && subscriber.next(value)));
        });
    }

    function partition$1(source, predicate, thisArg) {
        return [filter(predicate, thisArg)(innerFrom(source)), filter(not(predicate, thisArg))(innerFrom(source))];
    }

    function race$1(...sources) {
        sources = argsOrArgArray(sources);
        return sources.length === 1 ? innerFrom(sources[0]) : new Observable(raceInit(sources));
    }
    function raceInit(sources) {
        return (subscriber) => {
            let subscriptions = [];
            for (let i = 0; subscriptions && !subscriber.closed && i < sources.length; i++) {
                subscriptions.push(innerFrom(sources[i]).subscribe(createOperatorSubscriber(subscriber, (value) => {
                    if (subscriptions) {
                        for (let s = 0; s < subscriptions.length; s++) {
                            s !== i && subscriptions[s].unsubscribe();
                        }
                        subscriptions = null;
                    }
                    subscriber.next(value);
                })));
            }
        };
    }

    function range(start, count, scheduler) {
        if (count == null) {
            count = start;
            start = 0;
        }
        if (count <= 0) {
            return EMPTY;
        }
        const end = count + start;
        return new Observable(scheduler
            ?
                (subscriber) => {
                    let n = start;
                    return scheduler.schedule(function () {
                        if (n < end) {
                            subscriber.next(n++);
                            this.schedule();
                        }
                        else {
                            subscriber.complete();
                        }
                    });
                }
            :
                (subscriber) => {
                    let n = start;
                    while (n < end && !subscriber.closed) {
                        subscriber.next(n++);
                    }
                    subscriber.complete();
                });
    }

    function using(resourceFactory, observableFactory) {
        return new Observable((subscriber) => {
            const resource = resourceFactory();
            const result = observableFactory(resource);
            const source = result ? innerFrom(result) : EMPTY;
            source.subscribe(subscriber);
            return () => {
                if (resource) {
                    resource.unsubscribe();
                }
            };
        });
    }

    function zip$1(...args) {
        const resultSelector = popResultSelector(args);
        const sources = argsOrArgArray(args);
        return sources.length
            ? new Observable((subscriber) => {
                let buffers = sources.map(() => []);
                let completed = sources.map(() => false);
                subscriber.add(() => {
                    buffers = completed = null;
                });
                for (let sourceIndex = 0; !subscriber.closed && sourceIndex < sources.length; sourceIndex++) {
                    innerFrom(sources[sourceIndex]).subscribe(createOperatorSubscriber(subscriber, (value) => {
                        buffers[sourceIndex].push(value);
                        if (buffers.every((buffer) => buffer.length)) {
                            const result = buffers.map((buffer) => buffer.shift());
                            subscriber.next(resultSelector ? resultSelector(...result) : result);
                            if (buffers.some((buffer, i) => !buffer.length && completed[i])) {
                                subscriber.complete();
                            }
                        }
                    }, () => {
                        completed[sourceIndex] = true;
                        !buffers[sourceIndex].length && subscriber.complete();
                    }));
                }
                return () => {
                    buffers = completed = null;
                };
            })
            : EMPTY;
    }

    function audit(durationSelector) {
        return operate((source, subscriber) => {
            let hasValue = false;
            let lastValue = null;
            let durationSubscriber = null;
            let isComplete = false;
            const endDuration = () => {
                durationSubscriber?.unsubscribe();
                durationSubscriber = null;
                if (hasValue) {
                    hasValue = false;
                    const value = lastValue;
                    lastValue = null;
                    subscriber.next(value);
                }
                isComplete && subscriber.complete();
            };
            const cleanupDuration = () => {
                durationSubscriber = null;
                isComplete && subscriber.complete();
            };
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                hasValue = true;
                lastValue = value;
                if (!durationSubscriber) {
                    innerFrom(durationSelector(value)).subscribe((durationSubscriber = createOperatorSubscriber(subscriber, endDuration, cleanupDuration)));
                }
            }, () => {
                isComplete = true;
                (!hasValue || !durationSubscriber || durationSubscriber.closed) && subscriber.complete();
            }));
        });
    }

    function auditTime(duration, scheduler = asyncScheduler) {
        return audit(() => timer(duration, scheduler));
    }

    function buffer(closingNotifier) {
        return operate((source, subscriber) => {
            let currentBuffer = [];
            source.subscribe(createOperatorSubscriber(subscriber, (value) => currentBuffer.push(value), () => {
                subscriber.next(currentBuffer);
                subscriber.complete();
            }));
            innerFrom(closingNotifier).subscribe(createOperatorSubscriber(subscriber, () => {
                const b = currentBuffer;
                currentBuffer = [];
                subscriber.next(b);
            }, noop));
            return () => {
                currentBuffer = null;
            };
        });
    }

    function bufferCount(bufferSize, startBufferEvery = null) {
        startBufferEvery = startBufferEvery ?? bufferSize;
        return operate((source, subscriber) => {
            let buffers = [];
            let count = 0;
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                let toEmit = null;
                if (count++ % startBufferEvery === 0) {
                    buffers.push([]);
                }
                for (const buffer of buffers) {
                    buffer.push(value);
                    if (bufferSize <= buffer.length) {
                        toEmit = toEmit ?? [];
                        toEmit.push(buffer);
                    }
                }
                if (toEmit) {
                    for (const buffer of toEmit) {
                        arrRemove(buffers, buffer);
                        subscriber.next(buffer);
                    }
                }
            }, () => {
                for (const buffer of buffers) {
                    subscriber.next(buffer);
                }
                subscriber.complete();
            }, undefined, () => {
                buffers = null;
            }));
        });
    }

    function bufferTime(bufferTimeSpan, ...otherArgs) {
        const scheduler = popScheduler(otherArgs) ?? asyncScheduler;
        const bufferCreationInterval = otherArgs[0] ?? null;
        const maxBufferSize = otherArgs[1] || Infinity;
        return operate((source, subscriber) => {
            let bufferRecords = [];
            let restartOnEmit = false;
            const emit = (record) => {
                const { buffer, subs } = record;
                subs.unsubscribe();
                arrRemove(bufferRecords, record);
                subscriber.next(buffer);
                restartOnEmit && startBuffer();
            };
            const startBuffer = () => {
                if (bufferRecords) {
                    const subs = new Subscription();
                    subscriber.add(subs);
                    const buffer = [];
                    const record = {
                        buffer,
                        subs,
                    };
                    bufferRecords.push(record);
                    executeSchedule(subs, scheduler, () => emit(record), bufferTimeSpan);
                }
            };
            if (bufferCreationInterval !== null && bufferCreationInterval >= 0) {
                executeSchedule(subscriber, scheduler, startBuffer, bufferCreationInterval, true);
            }
            else {
                restartOnEmit = true;
            }
            startBuffer();
            const bufferTimeSubscriber = createOperatorSubscriber(subscriber, (value) => {
                const recordsCopy = bufferRecords.slice();
                for (const record of recordsCopy) {
                    const { buffer } = record;
                    buffer.push(value);
                    maxBufferSize <= buffer.length && emit(record);
                }
            }, () => {
                while (bufferRecords?.length) {
                    subscriber.next(bufferRecords.shift().buffer);
                }
                bufferTimeSubscriber?.unsubscribe();
                subscriber.complete();
                subscriber.unsubscribe();
            }, undefined, () => (bufferRecords = null));
            source.subscribe(bufferTimeSubscriber);
        });
    }

    function bufferToggle(openings, closingSelector) {
        return operate((source, subscriber) => {
            const buffers = [];
            innerFrom(openings).subscribe(createOperatorSubscriber(subscriber, (openValue) => {
                const buffer = [];
                buffers.push(buffer);
                const closingSubscription = new Subscription();
                const emitBuffer = () => {
                    arrRemove(buffers, buffer);
                    subscriber.next(buffer);
                    closingSubscription.unsubscribe();
                };
                closingSubscription.add(innerFrom(closingSelector(openValue)).subscribe(createOperatorSubscriber(subscriber, emitBuffer, noop)));
            }, noop));
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                for (const buffer of buffers) {
                    buffer.push(value);
                }
            }, () => {
                while (buffers.length > 0) {
                    subscriber.next(buffers.shift());
                }
                subscriber.complete();
            }));
        });
    }

    function bufferWhen(closingSelector) {
        return operate((source, subscriber) => {
            let buffer = null;
            let closingSubscriber = null;
            const openBuffer = () => {
                closingSubscriber?.unsubscribe();
                const b = buffer;
                buffer = [];
                b && subscriber.next(b);
                innerFrom(closingSelector()).subscribe((closingSubscriber = createOperatorSubscriber(subscriber, openBuffer, noop)));
            };
            openBuffer();
            source.subscribe(createOperatorSubscriber(subscriber, (value) => buffer?.push(value), () => {
                buffer && subscriber.next(buffer);
                subscriber.complete();
            }, undefined, () => (buffer = closingSubscriber = null)));
        });
    }

    function catchError(selector) {
        return operate((source, subscriber) => {
            let innerSub = null;
            let syncUnsub = false;
            let handledResult;
            innerSub = source.subscribe(createOperatorSubscriber(subscriber, undefined, undefined, (err) => {
                handledResult = innerFrom(selector(err, catchError(selector)(source)));
                if (innerSub) {
                    innerSub.unsubscribe();
                    innerSub = null;
                    handledResult.subscribe(subscriber);
                }
                else {
                    syncUnsub = true;
                }
            }));
            if (syncUnsub) {
                innerSub.unsubscribe();
                innerSub = null;
                handledResult.subscribe(subscriber);
            }
        });
    }

    function scanInternals(accumulator, seed, hasSeed, emitOnNext, emitBeforeComplete) {
        return (source, subscriber) => {
            let hasState = hasSeed;
            let state = seed;
            let index = 0;
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                const i = index++;
                state = hasState
                    ?
                        accumulator(state, value, i)
                    :
                        ((hasState = true), value);
                emitOnNext && subscriber.next(state);
            }, emitBeforeComplete &&
                (() => {
                    hasState && subscriber.next(state);
                    subscriber.complete();
                })));
        };
    }

    function reduce(accumulator, seed) {
        return operate(scanInternals(accumulator, seed, arguments.length >= 2, false, true));
    }

    const arrReducer = (arr, value) => (arr.push(value), arr);
    function toArray() {
        return operate((source, subscriber) => {
            reduce(arrReducer, [])(source).subscribe(subscriber);
        });
    }

    function joinAllInternals(joinFn, project) {
        return pipe(toArray(), mergeMap((sources) => joinFn(sources)), project ? mapOneOrManyArgs(project) : identity);
    }

    function combineLatestAll(project) {
        return joinAllInternals(combineLatest$1, project);
    }

    const combineAll = combineLatestAll;

    function combineLatest(...args) {
        const resultSelector = popResultSelector(args);
        return resultSelector
            ? pipe(combineLatest(...args), mapOneOrManyArgs(resultSelector))
            : operate((source, subscriber) => {
                combineLatestInit([source, ...argsOrArgArray(args)])(subscriber);
            });
    }

    function combineLatestWith(...otherSources) {
        return combineLatest(...otherSources);
    }

    function concatMap(project, resultSelector) {
        return isFunction(resultSelector) ? mergeMap(project, resultSelector, 1) : mergeMap(project, 1);
    }

    function concatMapTo(innerObservable, resultSelector) {
        return isFunction(resultSelector) ? concatMap(() => innerObservable, resultSelector) : concatMap(() => innerObservable);
    }

    function concat(...args) {
        const scheduler = popScheduler(args);
        return operate((source, subscriber) => {
            concatAll()(from([source, ...args], scheduler)).subscribe(subscriber);
        });
    }

    function concatWith(...otherSources) {
        return concat(...otherSources);
    }

    function fromSubscribable(subscribable) {
        return new Observable((subscriber) => subscribable.subscribe(subscriber));
    }

    const DEFAULT_CONFIG = {
        connector: () => new Subject(),
    };
    function connect(selector, config = DEFAULT_CONFIG) {
        const { connector } = config;
        return operate((source, subscriber) => {
            const subject = connector();
            innerFrom(selector(fromSubscribable(subject))).subscribe(subscriber);
            subscriber.add(source.subscribe(subject));
        });
    }

    function count(predicate) {
        return reduce((total, value, i) => (!predicate || predicate(value, i) ? total + 1 : total), 0);
    }

    function debounce(durationSelector) {
        return operate((source, subscriber) => {
            let hasValue = false;
            let lastValue = null;
            let durationSubscriber = null;
            const emit = () => {
                durationSubscriber?.unsubscribe();
                durationSubscriber = null;
                if (hasValue) {
                    hasValue = false;
                    const value = lastValue;
                    lastValue = null;
                    subscriber.next(value);
                }
            };
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                durationSubscriber?.unsubscribe();
                hasValue = true;
                lastValue = value;
                durationSubscriber = createOperatorSubscriber(subscriber, emit, noop);
                innerFrom(durationSelector(value)).subscribe(durationSubscriber);
            }, () => {
                emit();
                subscriber.complete();
            }, undefined, () => {
                lastValue = durationSubscriber = null;
            }));
        });
    }

    function debounceTime(dueTime, scheduler = asyncScheduler) {
        return operate((source, subscriber) => {
            let activeTask = null;
            let lastValue = null;
            let lastTime = null;
            const emit = () => {
                if (activeTask) {
                    activeTask.unsubscribe();
                    activeTask = null;
                    const value = lastValue;
                    lastValue = null;
                    subscriber.next(value);
                }
            };
            function emitWhenIdle() {
                const targetTime = lastTime + dueTime;
                const now = scheduler.now();
                if (now < targetTime) {
                    activeTask = this.schedule(undefined, targetTime - now);
                    subscriber.add(activeTask);
                    return;
                }
                emit();
            }
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                lastValue = value;
                lastTime = scheduler.now();
                if (!activeTask) {
                    activeTask = scheduler.schedule(emitWhenIdle, dueTime);
                    subscriber.add(activeTask);
                }
            }, () => {
                emit();
                subscriber.complete();
            }, undefined, () => {
                lastValue = activeTask = null;
            }));
        });
    }

    function defaultIfEmpty(defaultValue) {
        return operate((source, subscriber) => {
            let hasValue = false;
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                hasValue = true;
                subscriber.next(value);
            }, () => {
                if (!hasValue) {
                    subscriber.next(defaultValue);
                }
                subscriber.complete();
            }));
        });
    }

    function take(count) {
        return count <= 0
            ?
                () => EMPTY
            : operate((source, subscriber) => {
                let seen = 0;
                source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                    if (++seen <= count) {
                        subscriber.next(value);
                        if (count <= seen) {
                            subscriber.complete();
                        }
                    }
                }));
            });
    }

    function ignoreElements() {
        return operate((source, subscriber) => {
            source.subscribe(createOperatorSubscriber(subscriber, noop));
        });
    }

    function mapTo(value) {
        return map(() => value);
    }

    function delayWhen(delayDurationSelector, subscriptionDelay) {
        if (subscriptionDelay) {
            return (source) => concat$1(subscriptionDelay.pipe(take(1), ignoreElements()), source.pipe(delayWhen(delayDurationSelector)));
        }
        return mergeMap((value, index) => innerFrom(delayDurationSelector(value, index)).pipe(take(1), mapTo(value)));
    }

    function delay(due, scheduler = asyncScheduler) {
        const duration = timer(due, scheduler);
        return delayWhen(() => duration);
    }

    function dematerialize() {
        return operate((source, subscriber) => {
            source.subscribe(createOperatorSubscriber(subscriber, (notification) => observeNotification(notification, subscriber)));
        });
    }

    function distinct(keySelector, flushes) {
        return operate((source, subscriber) => {
            const distinctKeys = new Set();
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                const key = keySelector ? keySelector(value) : value;
                if (!distinctKeys.has(key)) {
                    distinctKeys.add(key);
                    subscriber.next(value);
                }
            }));
            flushes && innerFrom(flushes).subscribe(createOperatorSubscriber(subscriber, () => distinctKeys.clear(), noop));
        });
    }

    function distinctUntilChanged(comparator, keySelector = identity) {
        comparator = comparator ?? defaultCompare;
        return operate((source, subscriber) => {
            let previousKey;
            let first = true;
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                const currentKey = keySelector(value);
                if (first || !comparator(previousKey, currentKey)) {
                    first = false;
                    previousKey = currentKey;
                    subscriber.next(value);
                }
            }));
        });
    }
    function defaultCompare(a, b) {
        return a === b;
    }

    function distinctUntilKeyChanged(key, compare) {
        return distinctUntilChanged((x, y) => compare ? compare(x[key], y[key]) : x[key] === y[key]);
    }

    function throwIfEmpty(errorFactory = defaultErrorFactory) {
        return operate((source, subscriber) => {
            let hasValue = false;
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                hasValue = true;
                subscriber.next(value);
            }, () => (hasValue ? subscriber.complete() : subscriber.error(errorFactory()))));
        });
    }
    function defaultErrorFactory() {
        return new EmptyError();
    }

    function elementAt(index, defaultValue) {
        if (index < 0) {
            throw new ArgumentOutOfRangeError();
        }
        const hasDefaultValue = arguments.length >= 2;
        return (source) => source.pipe(filter((v, i) => i === index), take(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(() => new ArgumentOutOfRangeError()));
    }

    function endWith(...values) {
        return (source) => concat$1(source, of(...values));
    }

    function every(predicate, thisArg) {
        return operate((source, subscriber) => {
            let index = 0;
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                if (!predicate.call(thisArg, value, index++, source)) {
                    subscriber.next(false);
                    subscriber.complete();
                }
            }, () => {
                subscriber.next(true);
                subscriber.complete();
            }));
        });
    }

    function exhaustMap(project, resultSelector) {
        if (resultSelector) {
            return (source) => source.pipe(exhaustMap((a, i) => innerFrom(project(a, i)).pipe(map((b, ii) => resultSelector(a, b, i, ii)))));
        }
        return operate((source, subscriber) => {
            let index = 0;
            let innerSub = null;
            let isComplete = false;
            source.subscribe(createOperatorSubscriber(subscriber, (outerValue) => {
                if (!innerSub) {
                    innerSub = createOperatorSubscriber(subscriber, undefined, () => {
                        innerSub = null;
                        isComplete && subscriber.complete();
                    });
                    innerFrom(project(outerValue, index++)).subscribe(innerSub);
                }
            }, () => {
                isComplete = true;
                !innerSub && subscriber.complete();
            }));
        });
    }

    function exhaustAll() {
        return exhaustMap(identity);
    }

    const exhaust = exhaustAll;

    function expand(project, concurrent = Infinity, scheduler) {
        concurrent = (concurrent || 0) < 1 ? Infinity : concurrent;
        return operate((source, subscriber) => mergeInternals(source, subscriber, project, concurrent, undefined, true, scheduler));
    }

    function finalize(callback) {
        return operate((source, subscriber) => {
            try {
                source.subscribe(subscriber);
            }
            finally {
                subscriber.add(callback);
            }
        });
    }

    function find(predicate, thisArg) {
        return operate(createFind(predicate, thisArg, 'value'));
    }
    function createFind(predicate, thisArg, emit) {
        const findIndex = emit === 'index';
        return (source, subscriber) => {
            let index = 0;
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                const i = index++;
                if (predicate.call(thisArg, value, i, source)) {
                    subscriber.next(findIndex ? i : value);
                    subscriber.complete();
                }
            }, () => {
                subscriber.next(findIndex ? -1 : undefined);
                subscriber.complete();
            }));
        };
    }

    function findIndex(predicate, thisArg) {
        return operate(createFind(predicate, thisArg, 'index'));
    }

    function first(predicate, defaultValue) {
        const hasDefaultValue = arguments.length >= 2;
        return (source) => source.pipe(predicate ? filter((v, i) => predicate(v, i, source)) : identity, take(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(() => new EmptyError()));
    }

    function groupBy(keySelector, elementOrOptions, duration, connector) {
        return operate((source, subscriber) => {
            let element;
            if (!elementOrOptions || typeof elementOrOptions === 'function') {
                element = elementOrOptions;
            }
            else {
                ({ duration, element, connector } = elementOrOptions);
            }
            const groups = new Map();
            const notify = (cb) => {
                groups.forEach(cb);
                cb(subscriber);
            };
            const handleError = (err) => notify((consumer) => consumer.error(err));
            let activeGroups = 0;
            let teardownAttempted = false;
            const groupBySourceSubscriber = new OperatorSubscriber(subscriber, (value) => {
                try {
                    const key = keySelector(value);
                    let group = groups.get(key);
                    if (!group) {
                        groups.set(key, (group = connector ? connector() : new Subject()));
                        const grouped = createGroupedObservable(key, group);
                        subscriber.next(grouped);
                        if (duration) {
                            const durationSubscriber = createOperatorSubscriber(group, () => {
                                group.complete();
                                durationSubscriber?.unsubscribe();
                            }, undefined, undefined, () => groups.delete(key));
                            groupBySourceSubscriber.add(innerFrom(duration(grouped)).subscribe(durationSubscriber));
                        }
                    }
                    group.next(element ? element(value) : value);
                }
                catch (err) {
                    handleError(err);
                }
            }, () => notify((consumer) => consumer.complete()), handleError, () => groups.clear(), () => {
                teardownAttempted = true;
                return activeGroups === 0;
            });
            source.subscribe(groupBySourceSubscriber);
            function createGroupedObservable(key, groupSubject) {
                const result = new Observable((groupSubscriber) => {
                    activeGroups++;
                    const innerSub = groupSubject.subscribe(groupSubscriber);
                    return () => {
                        innerSub.unsubscribe();
                        --activeGroups === 0 && teardownAttempted && groupBySourceSubscriber.unsubscribe();
                    };
                });
                result.key = key;
                return result;
            }
        });
    }

    function isEmpty() {
        return operate((source, subscriber) => {
            source.subscribe(createOperatorSubscriber(subscriber, () => {
                subscriber.next(false);
                subscriber.complete();
            }, () => {
                subscriber.next(true);
                subscriber.complete();
            }));
        });
    }

    function takeLast(count) {
        return count <= 0
            ? () => EMPTY
            : operate((source, subscriber) => {
                let buffer = [];
                source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                    buffer.push(value);
                    count < buffer.length && buffer.shift();
                }, () => {
                    for (const value of buffer) {
                        subscriber.next(value);
                    }
                    subscriber.complete();
                }, undefined, () => {
                    buffer = null;
                }));
            });
    }

    function last(predicate, defaultValue) {
        const hasDefaultValue = arguments.length >= 2;
        return (source) => source.pipe(predicate ? filter((v, i) => predicate(v, i, source)) : identity, takeLast(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(() => new EmptyError()));
    }

    function materialize() {
        return operate((source, subscriber) => {
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                subscriber.next(Notification.createNext(value));
            }, () => {
                subscriber.next(Notification.createComplete());
                subscriber.complete();
            }, (err) => {
                subscriber.next(Notification.createError(err));
                subscriber.complete();
            }));
        });
    }

    function max(comparer) {
        return reduce(isFunction(comparer) ? (x, y) => (comparer(x, y) > 0 ? x : y) : (x, y) => (x > y ? x : y));
    }

    const flatMap = mergeMap;

    function mergeMapTo(innerObservable, resultSelector, concurrent = Infinity) {
        if (isFunction(resultSelector)) {
            return mergeMap(() => innerObservable, resultSelector, concurrent);
        }
        if (typeof resultSelector === 'number') {
            concurrent = resultSelector;
        }
        return mergeMap(() => innerObservable, concurrent);
    }

    function mergeScan(accumulator, seed, concurrent = Infinity) {
        return operate((source, subscriber) => {
            let state = seed;
            return mergeInternals(source, subscriber, (value, index) => accumulator(state, value, index), concurrent, (value) => {
                state = value;
            }, false, undefined, () => (state = null));
        });
    }

    function merge(...args) {
        const scheduler = popScheduler(args);
        const concurrent = popNumber(args, Infinity);
        args = argsOrArgArray(args);
        return operate((source, subscriber) => {
            mergeAll(concurrent)(from([source, ...args], scheduler)).subscribe(subscriber);
        });
    }

    function mergeWith(...otherSources) {
        return merge(...otherSources);
    }

    function min(comparer) {
        return reduce(isFunction(comparer) ? (x, y) => (comparer(x, y) < 0 ? x : y) : (x, y) => (x < y ? x : y));
    }

    function multicast(subjectOrSubjectFactory, selector) {
        const subjectFactory = isFunction(subjectOrSubjectFactory) ? subjectOrSubjectFactory : () => subjectOrSubjectFactory;
        if (isFunction(selector)) {
            return connect(selector, {
                connector: subjectFactory,
            });
        }
        return (source) => new ConnectableObservable(source, subjectFactory);
    }

    function onErrorResumeNextWith(...sources) {
        const nextSources = argsOrArgArray(sources);
        return (source) => onErrorResumeNext$1(source, ...nextSources);
    }
    const onErrorResumeNext = onErrorResumeNextWith;

    function pairwise() {
        return operate((source, subscriber) => {
            let prev;
            let hasPrev = false;
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                const p = prev;
                prev = value;
                hasPrev && subscriber.next([p, value]);
                hasPrev = true;
            }));
        });
    }

    function pluck(...properties) {
        const length = properties.length;
        if (length === 0) {
            throw new Error('list of properties cannot be empty.');
        }
        return map((x) => {
            let currentProp = x;
            for (let i = 0; i < length; i++) {
                const p = currentProp?.[properties[i]];
                if (typeof p !== 'undefined') {
                    currentProp = p;
                }
                else {
                    return undefined;
                }
            }
            return currentProp;
        });
    }

    function publish(selector) {
        return selector ? (source) => connect(selector)(source) : (source) => multicast(new Subject())(source);
    }

    function publishBehavior(initialValue) {
        return (source) => {
            const subject = new BehaviorSubject(initialValue);
            return new ConnectableObservable(source, () => subject);
        };
    }

    function publishLast() {
        return (source) => {
            const subject = new AsyncSubject();
            return new ConnectableObservable(source, () => subject);
        };
    }

    function publishReplay(bufferSize, windowTime, selectorOrScheduler, timestampProvider) {
        if (selectorOrScheduler && !isFunction(selectorOrScheduler)) {
            timestampProvider = selectorOrScheduler;
        }
        const selector = isFunction(selectorOrScheduler) ? selectorOrScheduler : undefined;
        return (source) => multicast(new ReplaySubject(bufferSize, windowTime, timestampProvider), selector)(source);
    }

    function raceWith(...otherSources) {
        return !otherSources.length
            ? identity
            : operate((source, subscriber) => {
                raceInit([source, ...otherSources])(subscriber);
            });
    }

    function repeat(countOrConfig) {
        let count = Infinity;
        let delay;
        if (countOrConfig != null) {
            if (typeof countOrConfig === 'object') {
                ({ count = Infinity, delay } = countOrConfig);
            }
            else {
                count = countOrConfig;
            }
        }
        return count <= 0
            ? () => EMPTY
            : operate((source, subscriber) => {
                let soFar = 0;
                let sourceSub;
                const resubscribe = () => {
                    sourceSub?.unsubscribe();
                    sourceSub = null;
                    if (delay != null) {
                        const notifier = typeof delay === 'number' ? timer(delay) : innerFrom(delay(soFar));
                        const notifierSubscriber = createOperatorSubscriber(subscriber, () => {
                            notifierSubscriber.unsubscribe();
                            subscribeToSource();
                        });
                        notifier.subscribe(notifierSubscriber);
                    }
                    else {
                        subscribeToSource();
                    }
                };
                const subscribeToSource = () => {
                    let syncUnsub = false;
                    sourceSub = source.subscribe(createOperatorSubscriber(subscriber, undefined, () => {
                        if (++soFar < count) {
                            if (sourceSub) {
                                resubscribe();
                            }
                            else {
                                syncUnsub = true;
                            }
                        }
                        else {
                            subscriber.complete();
                        }
                    }));
                    if (syncUnsub) {
                        resubscribe();
                    }
                };
                subscribeToSource();
            });
    }

    function repeatWhen(notifier) {
        return operate((source, subscriber) => {
            let innerSub;
            let syncResub = false;
            let completions$;
            let isNotifierComplete = false;
            let isMainComplete = false;
            const checkComplete = () => isMainComplete && isNotifierComplete && (subscriber.complete(), true);
            const getCompletionSubject = () => {
                if (!completions$) {
                    completions$ = new Subject();
                    innerFrom(notifier(completions$)).subscribe(createOperatorSubscriber(subscriber, () => {
                        if (innerSub) {
                            subscribeForRepeatWhen();
                        }
                        else {
                            syncResub = true;
                        }
                    }, () => {
                        isNotifierComplete = true;
                        checkComplete();
                    }));
                }
                return completions$;
            };
            const subscribeForRepeatWhen = () => {
                isMainComplete = false;
                innerSub = source.subscribe(createOperatorSubscriber(subscriber, undefined, () => {
                    isMainComplete = true;
                    !checkComplete() && getCompletionSubject().next();
                }));
                if (syncResub) {
                    innerSub.unsubscribe();
                    innerSub = null;
                    syncResub = false;
                    subscribeForRepeatWhen();
                }
            };
            subscribeForRepeatWhen();
        });
    }

    function retry(configOrCount = Infinity) {
        let config;
        if (configOrCount && typeof configOrCount === 'object') {
            config = configOrCount;
        }
        else {
            config = {
                count: configOrCount,
            };
        }
        const { count = Infinity, delay, resetOnSuccess: resetOnSuccess = false } = config;
        return count <= 0
            ? identity
            : operate((source, subscriber) => {
                let soFar = 0;
                let innerSub;
                const subscribeForRetry = () => {
                    let syncUnsub = false;
                    innerSub = source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                        if (resetOnSuccess) {
                            soFar = 0;
                        }
                        subscriber.next(value);
                    }, undefined, (err) => {
                        if (soFar++ < count) {
                            const resub = () => {
                                if (innerSub) {
                                    innerSub.unsubscribe();
                                    innerSub = null;
                                    subscribeForRetry();
                                }
                                else {
                                    syncUnsub = true;
                                }
                            };
                            if (delay != null) {
                                const notifier = typeof delay === 'number' ? timer(delay) : innerFrom(delay(err, soFar));
                                const notifierSubscriber = createOperatorSubscriber(subscriber, () => {
                                    notifierSubscriber.unsubscribe();
                                    resub();
                                }, () => {
                                    subscriber.complete();
                                });
                                notifier.subscribe(notifierSubscriber);
                            }
                            else {
                                resub();
                            }
                        }
                        else {
                            subscriber.error(err);
                        }
                    }));
                    if (syncUnsub) {
                        innerSub.unsubscribe();
                        innerSub = null;
                        subscribeForRetry();
                    }
                };
                subscribeForRetry();
            });
    }

    function retryWhen(notifier) {
        return operate((source, subscriber) => {
            let innerSub;
            let syncResub = false;
            let errors$;
            const subscribeForRetryWhen = () => {
                innerSub = source.subscribe(createOperatorSubscriber(subscriber, undefined, undefined, (err) => {
                    if (!errors$) {
                        errors$ = new Subject();
                        innerFrom(notifier(errors$)).subscribe(createOperatorSubscriber(subscriber, () => innerSub ? subscribeForRetryWhen() : (syncResub = true)));
                    }
                    if (errors$) {
                        errors$.next(err);
                    }
                }));
                if (syncResub) {
                    innerSub.unsubscribe();
                    innerSub = null;
                    syncResub = false;
                    subscribeForRetryWhen();
                }
            };
            subscribeForRetryWhen();
        });
    }

    function sample(notifier) {
        return operate((source, subscriber) => {
            let hasValue = false;
            let lastValue = null;
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                hasValue = true;
                lastValue = value;
            }));
            innerFrom(notifier).subscribe(createOperatorSubscriber(subscriber, () => {
                if (hasValue) {
                    hasValue = false;
                    const value = lastValue;
                    lastValue = null;
                    subscriber.next(value);
                }
            }, noop));
        });
    }

    function sampleTime(period, scheduler = asyncScheduler) {
        return sample(interval(period, scheduler));
    }

    function scan(accumulator, seed) {
        return operate(scanInternals(accumulator, seed, arguments.length >= 2, true));
    }

    function sequenceEqual(compareTo, comparator = (a, b) => a === b) {
        return operate((source, subscriber) => {
            const aState = createState();
            const bState = createState();
            const emit = (isEqual) => {
                subscriber.next(isEqual);
                subscriber.complete();
            };
            const createSubscriber = (selfState, otherState) => {
                const sequenceEqualSubscriber = createOperatorSubscriber(subscriber, (a) => {
                    const { buffer, complete } = otherState;
                    if (buffer.length === 0) {
                        complete ? emit(false) : selfState.buffer.push(a);
                    }
                    else {
                        !comparator(a, buffer.shift()) && emit(false);
                    }
                }, () => {
                    selfState.complete = true;
                    const { complete, buffer } = otherState;
                    complete && emit(buffer.length === 0);
                    sequenceEqualSubscriber?.unsubscribe();
                });
                return sequenceEqualSubscriber;
            };
            source.subscribe(createSubscriber(aState, bState));
            innerFrom(compareTo).subscribe(createSubscriber(bState, aState));
        });
    }
    function createState() {
        return {
            buffer: [],
            complete: false,
        };
    }

    function share(options = {}) {
        const { connector = () => new Subject(), resetOnError = true, resetOnComplete = true, resetOnRefCountZero = true } = options;
        return (wrapperSource) => {
            let connection;
            let resetConnection;
            let subject;
            let refCount = 0;
            let hasCompleted = false;
            let hasErrored = false;
            const cancelReset = () => {
                resetConnection?.unsubscribe();
                resetConnection = undefined;
            };
            const reset = () => {
                cancelReset();
                connection = subject = undefined;
                hasCompleted = hasErrored = false;
            };
            const resetAndUnsubscribe = () => {
                const conn = connection;
                reset();
                conn?.unsubscribe();
            };
            return operate((source, subscriber) => {
                refCount++;
                if (!hasErrored && !hasCompleted) {
                    cancelReset();
                }
                const dest = (subject = subject ?? connector());
                subscriber.add(() => {
                    refCount--;
                    if (refCount === 0 && !hasErrored && !hasCompleted) {
                        resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
                    }
                });
                dest.subscribe(subscriber);
                if (!connection &&
                    refCount > 0) {
                    connection = new SafeSubscriber({
                        next: (value) => dest.next(value),
                        error: (err) => {
                            hasErrored = true;
                            cancelReset();
                            resetConnection = handleReset(reset, resetOnError, err);
                            dest.error(err);
                        },
                        complete: () => {
                            hasCompleted = true;
                            cancelReset();
                            resetConnection = handleReset(reset, resetOnComplete);
                            dest.complete();
                        },
                    });
                    innerFrom(source).subscribe(connection);
                }
            })(wrapperSource);
        };
    }
    function handleReset(reset, on, ...args) {
        if (on === true) {
            reset();
            return;
        }
        if (on === false) {
            return;
        }
        const onSubscriber = new SafeSubscriber({
            next: () => {
                onSubscriber.unsubscribe();
                reset();
            },
        });
        return innerFrom(on(...args)).subscribe(onSubscriber);
    }

    function shareReplay(configOrBufferSize, windowTime, scheduler) {
        let bufferSize;
        let refCount = false;
        if (configOrBufferSize && typeof configOrBufferSize === 'object') {
            ({ bufferSize = Infinity, windowTime = Infinity, refCount = false, scheduler } = configOrBufferSize);
        }
        else {
            bufferSize = (configOrBufferSize ?? Infinity);
        }
        return share({
            connector: () => new ReplaySubject(bufferSize, windowTime, scheduler),
            resetOnError: true,
            resetOnComplete: false,
            resetOnRefCountZero: refCount,
        });
    }

    function single(predicate) {
        return operate((source, subscriber) => {
            let hasValue = false;
            let singleValue;
            let seenValue = false;
            let index = 0;
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                seenValue = true;
                if (!predicate || predicate(value, index++, source)) {
                    hasValue && subscriber.error(new SequenceError('Too many matching values'));
                    hasValue = true;
                    singleValue = value;
                }
            }, () => {
                if (hasValue) {
                    subscriber.next(singleValue);
                    subscriber.complete();
                }
                else {
                    subscriber.error(seenValue ? new NotFoundError('No matching values') : new EmptyError());
                }
            }));
        });
    }

    function skip(count) {
        return filter((_, index) => count <= index);
    }

    function skipLast(skipCount) {
        return skipCount <= 0
            ?
                identity
            : operate((source, subscriber) => {
                let ring = new Array(skipCount);
                let seen = 0;
                source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                    const valueIndex = seen++;
                    if (valueIndex < skipCount) {
                        ring[valueIndex] = value;
                    }
                    else {
                        const index = valueIndex % skipCount;
                        const oldValue = ring[index];
                        ring[index] = value;
                        subscriber.next(oldValue);
                    }
                }));
                return () => {
                    ring = null;
                };
            });
    }

    function skipUntil(notifier) {
        return operate((source, subscriber) => {
            let taking = false;
            const skipSubscriber = createOperatorSubscriber(subscriber, () => {
                skipSubscriber?.unsubscribe();
                taking = true;
            }, noop);
            innerFrom(notifier).subscribe(skipSubscriber);
            source.subscribe(createOperatorSubscriber(subscriber, (value) => taking && subscriber.next(value)));
        });
    }

    function skipWhile(predicate) {
        return operate((source, subscriber) => {
            let taking = false;
            let index = 0;
            source.subscribe(createOperatorSubscriber(subscriber, (value) => (taking || (taking = !predicate(value, index++))) && subscriber.next(value)));
        });
    }

    function startWith(...values) {
        const scheduler = popScheduler(values);
        return operate((source, subscriber) => {
            (scheduler ? concat$1(values, source, scheduler) : concat$1(values, source)).subscribe(subscriber);
        });
    }

    function switchMap(project, resultSelector) {
        return operate((source, subscriber) => {
            let innerSubscriber = null;
            let index = 0;
            let isComplete = false;
            const checkComplete = () => isComplete && !innerSubscriber && subscriber.complete();
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                innerSubscriber?.unsubscribe();
                let innerIndex = 0;
                const outerIndex = index++;
                innerFrom(project(value, outerIndex)).subscribe((innerSubscriber = createOperatorSubscriber(subscriber, (innerValue) => subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue), () => {
                    innerSubscriber = null;
                    checkComplete();
                })));
            }, () => {
                isComplete = true;
                checkComplete();
            }));
        });
    }

    function switchAll() {
        return switchMap(identity);
    }

    function switchMapTo(innerObservable, resultSelector) {
        return isFunction(resultSelector) ? switchMap(() => innerObservable, resultSelector) : switchMap(() => innerObservable);
    }

    function switchScan(accumulator, seed) {
        return operate((source, subscriber) => {
            let state = seed;
            switchMap((value, index) => accumulator(state, value, index), (_, innerValue) => ((state = innerValue), innerValue))(source).subscribe(subscriber);
            return () => {
                state = null;
            };
        });
    }

    function takeUntil(notifier) {
        return operate((source, subscriber) => {
            innerFrom(notifier).subscribe(createOperatorSubscriber(subscriber, () => subscriber.complete(), noop));
            !subscriber.closed && source.subscribe(subscriber);
        });
    }

    function takeWhile(predicate, inclusive = false) {
        return operate((source, subscriber) => {
            let index = 0;
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                const result = predicate(value, index++);
                (result || inclusive) && subscriber.next(value);
                !result && subscriber.complete();
            }));
        });
    }

    function tap(observerOrNext, error, complete) {
        const tapObserver = isFunction(observerOrNext) || error || complete
            ?
                { next: observerOrNext, error, complete }
            : observerOrNext;
        return tapObserver
            ? operate((source, subscriber) => {
                tapObserver.subscribe?.();
                let isUnsub = true;
                source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                    tapObserver.next?.(value);
                    subscriber.next(value);
                }, () => {
                    isUnsub = false;
                    tapObserver.complete?.();
                    subscriber.complete();
                }, (err) => {
                    isUnsub = false;
                    tapObserver.error?.(err);
                    subscriber.error(err);
                }, () => {
                    if (isUnsub) {
                        tapObserver.unsubscribe?.();
                    }
                    tapObserver.finalize?.();
                }));
            })
            :
                identity;
    }

    function throttle(durationSelector, config) {
        return operate((source, subscriber) => {
            const { leading = true, trailing = false } = config ?? {};
            let hasValue = false;
            let sendValue = null;
            let throttled = null;
            let isComplete = false;
            const endThrottling = () => {
                throttled?.unsubscribe();
                throttled = null;
                if (trailing) {
                    send();
                    isComplete && subscriber.complete();
                }
            };
            const cleanupThrottling = () => {
                throttled = null;
                isComplete && subscriber.complete();
            };
            const startThrottle = (value) => (throttled = innerFrom(durationSelector(value)).subscribe(createOperatorSubscriber(subscriber, endThrottling, cleanupThrottling)));
            const send = () => {
                if (hasValue) {
                    hasValue = false;
                    const value = sendValue;
                    sendValue = null;
                    subscriber.next(value);
                    !isComplete && startThrottle(value);
                }
            };
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                hasValue = true;
                sendValue = value;
                !(throttled && !throttled.closed) && (leading ? send() : startThrottle(value));
            }, () => {
                isComplete = true;
                !(trailing && hasValue && throttled && !throttled.closed) && subscriber.complete();
            }));
        });
    }

    function throttleTime(duration, scheduler = asyncScheduler, config) {
        const duration$ = timer(duration, scheduler);
        return throttle(() => duration$, config);
    }

    function timeInterval(scheduler = asyncScheduler) {
        return operate((source, subscriber) => {
            let last = scheduler.now();
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                const now = scheduler.now();
                const interval = now - last;
                last = now;
                subscriber.next(new TimeInterval(value, interval));
            }));
        });
    }
    class TimeInterval {
        constructor(value, interval) {
            this.value = value;
            this.interval = interval;
        }
    }

    function timeoutWith(due, withObservable, scheduler) {
        let first;
        let each;
        let _with;
        scheduler = scheduler ?? async;
        if (isValidDate(due)) {
            first = due;
        }
        else if (typeof due === 'number') {
            each = due;
        }
        if (withObservable) {
            _with = () => withObservable;
        }
        else {
            throw new TypeError('No observable provided to switch to');
        }
        if (first == null && each == null) {
            throw new TypeError('No timeout provided.');
        }
        return timeout({
            first,
            each,
            scheduler,
            with: _with,
        });
    }

    function timestamp(timestampProvider = dateTimestampProvider) {
        return map((value) => ({ value, timestamp: timestampProvider.now() }));
    }

    function window(windowBoundaries) {
        return operate((source, subscriber) => {
            let windowSubject = new Subject();
            subscriber.next(windowSubject.asObservable());
            const errorHandler = (err) => {
                windowSubject.error(err);
                subscriber.error(err);
            };
            source.subscribe(createOperatorSubscriber(subscriber, (value) => windowSubject?.next(value), () => {
                windowSubject.complete();
                subscriber.complete();
            }, errorHandler));
            innerFrom(windowBoundaries).subscribe(createOperatorSubscriber(subscriber, () => {
                windowSubject.complete();
                subscriber.next((windowSubject = new Subject()));
            }, noop, errorHandler));
            return () => {
                windowSubject?.unsubscribe();
                windowSubject = null;
            };
        });
    }

    function windowCount(windowSize, startWindowEvery = 0) {
        const startEvery = startWindowEvery > 0 ? startWindowEvery : windowSize;
        return operate((source, subscriber) => {
            let windows = [new Subject()];
            let starts = [];
            let count = 0;
            subscriber.next(windows[0].asObservable());
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                for (const window of windows) {
                    window.next(value);
                }
                const c = count - windowSize + 1;
                if (c >= 0 && c % startEvery === 0) {
                    windows.shift().complete();
                }
                if (++count % startEvery === 0) {
                    const window = new Subject();
                    windows.push(window);
                    subscriber.next(window.asObservable());
                }
            }, () => {
                while (windows.length > 0) {
                    windows.shift().complete();
                }
                subscriber.complete();
            }, (err) => {
                while (windows.length > 0) {
                    windows.shift().error(err);
                }
                subscriber.error(err);
            }, () => {
                starts = null;
                windows = null;
            }));
        });
    }

    function windowTime(windowTimeSpan, ...otherArgs) {
        const scheduler = popScheduler(otherArgs) ?? asyncScheduler;
        const windowCreationInterval = otherArgs[0] ?? null;
        const maxWindowSize = otherArgs[1] || Infinity;
        return operate((source, subscriber) => {
            let windowRecords = [];
            let restartOnClose = false;
            const closeWindow = (record) => {
                const { window, subs } = record;
                window.complete();
                subs.unsubscribe();
                arrRemove(windowRecords, record);
                restartOnClose && startWindow();
            };
            const startWindow = () => {
                if (windowRecords) {
                    const subs = new Subscription();
                    subscriber.add(subs);
                    const window = new Subject();
                    const record = {
                        window,
                        subs,
                        seen: 0,
                    };
                    windowRecords.push(record);
                    subscriber.next(window.asObservable());
                    executeSchedule(subs, scheduler, () => closeWindow(record), windowTimeSpan);
                }
            };
            if (windowCreationInterval !== null && windowCreationInterval >= 0) {
                executeSchedule(subscriber, scheduler, startWindow, windowCreationInterval, true);
            }
            else {
                restartOnClose = true;
            }
            startWindow();
            const loop = (cb) => windowRecords.slice().forEach(cb);
            const terminate = (cb) => {
                loop(({ window }) => cb(window));
                cb(subscriber);
                subscriber.unsubscribe();
            };
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                loop((record) => {
                    record.window.next(value);
                    maxWindowSize <= ++record.seen && closeWindow(record);
                });
            }, () => terminate((consumer) => consumer.complete()), (err) => terminate((consumer) => consumer.error(err))));
            return () => {
                windowRecords = null;
            };
        });
    }

    function windowToggle(openings, closingSelector) {
        return operate((source, subscriber) => {
            const windows = [];
            const handleError = (err) => {
                while (0 < windows.length) {
                    windows.shift().error(err);
                }
                subscriber.error(err);
            };
            innerFrom(openings).subscribe(createOperatorSubscriber(subscriber, (openValue) => {
                const window = new Subject();
                windows.push(window);
                const closingSubscription = new Subscription();
                const closeWindow = () => {
                    arrRemove(windows, window);
                    window.complete();
                    closingSubscription.unsubscribe();
                };
                let closingNotifier;
                try {
                    closingNotifier = innerFrom(closingSelector(openValue));
                }
                catch (err) {
                    handleError(err);
                    return;
                }
                subscriber.next(window.asObservable());
                closingSubscription.add(closingNotifier.subscribe(createOperatorSubscriber(subscriber, closeWindow, noop, handleError)));
            }, noop));
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                const windowsCopy = windows.slice();
                for (const window of windowsCopy) {
                    window.next(value);
                }
            }, () => {
                while (0 < windows.length) {
                    windows.shift().complete();
                }
                subscriber.complete();
            }, handleError, () => {
                while (0 < windows.length) {
                    windows.shift().unsubscribe();
                }
            }));
        });
    }

    function windowWhen(closingSelector) {
        return operate((source, subscriber) => {
            let window;
            let closingSubscriber;
            const handleError = (err) => {
                window.error(err);
                subscriber.error(err);
            };
            const openWindow = () => {
                closingSubscriber?.unsubscribe();
                window?.complete();
                window = new Subject();
                subscriber.next(window.asObservable());
                let closingNotifier;
                try {
                    closingNotifier = innerFrom(closingSelector());
                }
                catch (err) {
                    handleError(err);
                    return;
                }
                closingNotifier.subscribe((closingSubscriber = createOperatorSubscriber(subscriber, openWindow, openWindow, handleError)));
            };
            openWindow();
            source.subscribe(createOperatorSubscriber(subscriber, (value) => window.next(value), () => {
                window.complete();
                subscriber.complete();
            }, handleError, () => {
                closingSubscriber?.unsubscribe();
                window = null;
            }));
        });
    }

    function withLatestFrom(...inputs) {
        const project = popResultSelector(inputs);
        return operate((source, subscriber) => {
            const len = inputs.length;
            const otherValues = new Array(len);
            let hasValue = inputs.map(() => false);
            let ready = false;
            for (let i = 0; i < len; i++) {
                innerFrom(inputs[i]).subscribe(createOperatorSubscriber(subscriber, (value) => {
                    otherValues[i] = value;
                    if (!ready && !hasValue[i]) {
                        hasValue[i] = true;
                        (ready = hasValue.every(identity)) && (hasValue = null);
                    }
                }, noop));
            }
            source.subscribe(createOperatorSubscriber(subscriber, (value) => {
                if (ready) {
                    const values = [value, ...otherValues];
                    subscriber.next(project ? project(...values) : values);
                }
            }));
        });
    }

    function zipAll(project) {
        return joinAllInternals(zip$1, project);
    }

    function zip(...sources) {
        return operate((source, subscriber) => {
            zip$1(source, ...sources).subscribe(subscriber);
        });
    }

    function zipWith(...otherInputs) {
        return zip(...otherInputs);
    }

    function partition(predicate, thisArg) {
        return (source) => [filter(predicate, thisArg)(source), filter(not(predicate, thisArg))(source)];
    }

    function race(...args) {
        return raceWith(...argsOrArgArray(args));
    }

    var _operators = /*#__PURE__*/Object.freeze({
        __proto__: null,
        audit: audit,
        auditTime: auditTime,
        buffer: buffer,
        bufferCount: bufferCount,
        bufferTime: bufferTime,
        bufferToggle: bufferToggle,
        bufferWhen: bufferWhen,
        catchError: catchError,
        combineAll: combineAll,
        combineLatest: combineLatest,
        combineLatestAll: combineLatestAll,
        combineLatestWith: combineLatestWith,
        concat: concat,
        concatAll: concatAll,
        concatMap: concatMap,
        concatMapTo: concatMapTo,
        concatWith: concatWith,
        connect: connect,
        count: count,
        debounce: debounce,
        debounceTime: debounceTime,
        defaultIfEmpty: defaultIfEmpty,
        delay: delay,
        delayWhen: delayWhen,
        dematerialize: dematerialize,
        distinct: distinct,
        distinctUntilChanged: distinctUntilChanged,
        distinctUntilKeyChanged: distinctUntilKeyChanged,
        elementAt: elementAt,
        endWith: endWith,
        every: every,
        exhaust: exhaust,
        exhaustAll: exhaustAll,
        exhaustMap: exhaustMap,
        expand: expand,
        filter: filter,
        finalize: finalize,
        find: find,
        findIndex: findIndex,
        first: first,
        flatMap: flatMap,
        groupBy: groupBy,
        ignoreElements: ignoreElements,
        isEmpty: isEmpty,
        last: last,
        map: map,
        mapTo: mapTo,
        materialize: materialize,
        max: max,
        merge: merge,
        mergeAll: mergeAll,
        mergeMap: mergeMap,
        mergeMapTo: mergeMapTo,
        mergeScan: mergeScan,
        mergeWith: mergeWith,
        min: min,
        multicast: multicast,
        observeOn: observeOn,
        onErrorResumeNext: onErrorResumeNext,
        pairwise: pairwise,
        partition: partition,
        pluck: pluck,
        publish: publish,
        publishBehavior: publishBehavior,
        publishLast: publishLast,
        publishReplay: publishReplay,
        race: race,
        raceWith: raceWith,
        reduce: reduce,
        refCount: refCount,
        repeat: repeat,
        repeatWhen: repeatWhen,
        retry: retry,
        retryWhen: retryWhen,
        sample: sample,
        sampleTime: sampleTime,
        scan: scan,
        sequenceEqual: sequenceEqual,
        share: share,
        shareReplay: shareReplay,
        single: single,
        skip: skip,
        skipLast: skipLast,
        skipUntil: skipUntil,
        skipWhile: skipWhile,
        startWith: startWith,
        subscribeOn: subscribeOn,
        switchAll: switchAll,
        switchMap: switchMap,
        switchMapTo: switchMapTo,
        switchScan: switchScan,
        take: take,
        takeLast: takeLast,
        takeUntil: takeUntil,
        takeWhile: takeWhile,
        tap: tap,
        throttle: throttle,
        throttleTime: throttleTime,
        throwIfEmpty: throwIfEmpty,
        timeInterval: timeInterval,
        timeout: timeout,
        timeoutWith: timeoutWith,
        timestamp: timestamp,
        toArray: toArray,
        window: window,
        windowCount: windowCount,
        windowTime: windowTime,
        windowToggle: windowToggle,
        windowWhen: windowWhen,
        withLatestFrom: withLatestFrom,
        zip: zip,
        zipAll: zipAll,
        zipWith: zipWith
    });

    class SubscriptionLog {
        constructor(subscribedFrame, unsubscribedFrame = Infinity) {
            this.subscribedFrame = subscribedFrame;
            this.unsubscribedFrame = unsubscribedFrame;
        }
    }

    class SubscriptionLoggable {
        constructor() {
            this.subscriptions = [];
        }
        logSubscribedFrame() {
            this.subscriptions.push(new SubscriptionLog(this.scheduler.now()));
            return this.subscriptions.length - 1;
        }
        logUnsubscribedFrame(index) {
            const subscriptionLogs = this.subscriptions;
            const oldSubscriptionLog = subscriptionLogs[index];
            subscriptionLogs[index] = new SubscriptionLog(oldSubscriptionLog.subscribedFrame, this.scheduler.now());
        }
    }

    function applyMixins(derivedCtor, baseCtors) {
        for (let i = 0, len = baseCtors.length; i < len; i++) {
            const baseCtor = baseCtors[i];
            const propertyKeys = Object.getOwnPropertyNames(baseCtor.prototype);
            for (let j = 0, len2 = propertyKeys.length; j < len2; j++) {
                const name = propertyKeys[j];
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        }
    }

    class ColdObservable extends Observable {
        constructor(messages, scheduler) {
            super(function (subscriber) {
                const observable = this;
                const index = observable.logSubscribedFrame();
                const subscription = new Subscription();
                subscription.add(new Subscription(() => {
                    observable.logUnsubscribedFrame(index);
                }));
                observable.scheduleMessages(subscriber);
                return subscription;
            });
            this.messages = messages;
            this.subscriptions = [];
            this.scheduler = scheduler;
        }
        scheduleMessages(subscriber) {
            const messagesLength = this.messages.length;
            for (let i = 0; i < messagesLength; i++) {
                const message = this.messages[i];
                subscriber.add(this.scheduler.schedule((state) => {
                    const { message: { notification }, subscriber: destination } = state;
                    observeNotification(notification, destination);
                }, message.frame, { message, subscriber }));
            }
        }
    }
    applyMixins(ColdObservable, [SubscriptionLoggable]);

    class HotObservable extends Subject {
        constructor(messages, scheduler) {
            super();
            this.messages = messages;
            this.subscriptions = [];
            this.scheduler = scheduler;
        }
        _subscribe(subscriber) {
            const subject = this;
            const index = subject.logSubscribedFrame();
            const subscription = new Subscription();
            subscription.add(new Subscription(() => {
                subject.logUnsubscribedFrame(index);
            }));
            subscription.add(super._subscribe(subscriber));
            return subscription;
        }
        setup() {
            const subject = this;
            const messagesLength = subject.messages.length;
            for (let i = 0; i < messagesLength; i++) {
                (() => {
                    const { notification, frame } = subject.messages[i];
                    subject.scheduler.schedule(() => {
                        observeNotification(notification, subject);
                    }, frame);
                })();
            }
        }
    }
    applyMixins(HotObservable, [SubscriptionLoggable]);

    const defaultMaxFrame = 750;
    class TestScheduler extends VirtualTimeScheduler {
        constructor(assertDeepEqual) {
            super(VirtualAction, defaultMaxFrame);
            this.assertDeepEqual = assertDeepEqual;
            this.hotObservables = [];
            this.coldObservables = [];
            this.flushTests = [];
            this.runMode = false;
        }
        createTime(marbles) {
            const indexOf = this.runMode ? marbles.trim().indexOf('|') : marbles.indexOf('|');
            if (indexOf === -1) {
                throw new Error('marble diagram for time should have a completion marker "|"');
            }
            return indexOf * TestScheduler.frameTimeFactor;
        }
        createColdObservable(marbles, values, error) {
            if (marbles.indexOf('^') !== -1) {
                throw new Error('cold observable cannot have subscription offset "^"');
            }
            if (marbles.indexOf('!') !== -1) {
                throw new Error('cold observable cannot have unsubscription marker "!"');
            }
            const messages = TestScheduler.parseMarbles(marbles, values, error, undefined, this.runMode);
            const cold = new ColdObservable(messages, this);
            this.coldObservables.push(cold);
            return cold;
        }
        createHotObservable(marbles, values, error) {
            if (marbles.indexOf('!') !== -1) {
                throw new Error('hot observable cannot have unsubscription marker "!"');
            }
            const messages = TestScheduler.parseMarbles(marbles, values, error, undefined, this.runMode);
            const subject = new HotObservable(messages, this);
            this.hotObservables.push(subject);
            return subject;
        }
        materializeInnerObservable(observable, outerFrame) {
            const messages = [];
            observable.subscribe({
                next: (value) => {
                    messages.push({ frame: this.frame - outerFrame, notification: nextNotification(value) });
                },
                error: (error) => {
                    messages.push({ frame: this.frame - outerFrame, notification: errorNotification(error) });
                },
                complete: () => {
                    messages.push({ frame: this.frame - outerFrame, notification: COMPLETE_NOTIFICATION });
                },
            });
            return messages;
        }
        expectObservable(observable, subscriptionMarbles = null) {
            const actual = [];
            const flushTest = { actual, ready: false };
            const subscriptionParsed = TestScheduler.parseMarblesAsSubscriptions(subscriptionMarbles, this.runMode);
            const subscriptionFrame = subscriptionParsed.subscribedFrame === Infinity ? 0 : subscriptionParsed.subscribedFrame;
            const unsubscriptionFrame = subscriptionParsed.unsubscribedFrame;
            let subscription;
            this.schedule(() => {
                subscription = observable.subscribe({
                    next: (x) => {
                        const value = x instanceof Observable ? this.materializeInnerObservable(x, this.frame) : x;
                        actual.push({ frame: this.frame, notification: nextNotification(value) });
                    },
                    error: (error) => {
                        actual.push({ frame: this.frame, notification: errorNotification(error) });
                    },
                    complete: () => {
                        actual.push({ frame: this.frame, notification: COMPLETE_NOTIFICATION });
                    },
                });
            }, subscriptionFrame);
            if (unsubscriptionFrame !== Infinity) {
                this.schedule(() => subscription.unsubscribe(), unsubscriptionFrame);
            }
            this.flushTests.push(flushTest);
            const { runMode } = this;
            return {
                toBe(marbles, values, errorValue) {
                    flushTest.ready = true;
                    flushTest.expected = TestScheduler.parseMarbles(marbles, values, errorValue, true, runMode);
                },
                toEqual: (other) => {
                    flushTest.ready = true;
                    flushTest.expected = [];
                    this.schedule(() => {
                        subscription = other.subscribe({
                            next: (x) => {
                                const value = x instanceof Observable ? this.materializeInnerObservable(x, this.frame) : x;
                                flushTest.expected.push({ frame: this.frame, notification: nextNotification(value) });
                            },
                            error: (error) => {
                                flushTest.expected.push({ frame: this.frame, notification: errorNotification(error) });
                            },
                            complete: () => {
                                flushTest.expected.push({ frame: this.frame, notification: COMPLETE_NOTIFICATION });
                            },
                        });
                    }, subscriptionFrame);
                },
            };
        }
        expectSubscriptions(actualSubscriptionLogs) {
            const flushTest = { actual: actualSubscriptionLogs, ready: false };
            this.flushTests.push(flushTest);
            const { runMode } = this;
            return {
                toBe(marblesOrMarblesArray) {
                    const marblesArray = typeof marblesOrMarblesArray === 'string' ? [marblesOrMarblesArray] : marblesOrMarblesArray;
                    flushTest.ready = true;
                    flushTest.expected = marblesArray
                        .map((marbles) => TestScheduler.parseMarblesAsSubscriptions(marbles, runMode))
                        .filter((marbles) => marbles.subscribedFrame !== Infinity);
                },
            };
        }
        flush() {
            const hotObservables = this.hotObservables;
            while (hotObservables.length > 0) {
                hotObservables.shift().setup();
            }
            super.flush();
            this.flushTests = this.flushTests.filter((test) => {
                if (test.ready) {
                    this.assertDeepEqual(test.actual, test.expected);
                    return false;
                }
                return true;
            });
        }
        static parseMarblesAsSubscriptions(marbles, runMode = false) {
            if (typeof marbles !== 'string') {
                return new SubscriptionLog(Infinity);
            }
            const characters = [...marbles];
            const len = characters.length;
            let groupStart = -1;
            let subscriptionFrame = Infinity;
            let unsubscriptionFrame = Infinity;
            let frame = 0;
            for (let i = 0; i < len; i++) {
                let nextFrame = frame;
                const advanceFrameBy = (count) => {
                    nextFrame += count * this.frameTimeFactor;
                };
                const c = characters[i];
                switch (c) {
                    case ' ':
                        if (!runMode) {
                            advanceFrameBy(1);
                        }
                        break;
                    case '-':
                        advanceFrameBy(1);
                        break;
                    case '(':
                        groupStart = frame;
                        advanceFrameBy(1);
                        break;
                    case ')':
                        groupStart = -1;
                        advanceFrameBy(1);
                        break;
                    case '^':
                        if (subscriptionFrame !== Infinity) {
                            throw new Error("found a second subscription point '^' in a " + 'subscription marble diagram. There can only be one.');
                        }
                        subscriptionFrame = groupStart > -1 ? groupStart : frame;
                        advanceFrameBy(1);
                        break;
                    case '!':
                        if (unsubscriptionFrame !== Infinity) {
                            throw new Error("found a second unsubscription point '!' in a " + 'subscription marble diagram. There can only be one.');
                        }
                        unsubscriptionFrame = groupStart > -1 ? groupStart : frame;
                        break;
                    default:
                        if (runMode && c.match(/^[0-9]$/)) {
                            if (i === 0 || characters[i - 1] === ' ') {
                                const buffer = characters.slice(i).join('');
                                const match = buffer.match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);
                                if (match) {
                                    i += match[0].length - 1;
                                    const duration = parseFloat(match[1]);
                                    const unit = match[2];
                                    let durationInMs;
                                    switch (unit) {
                                        case 'ms':
                                            durationInMs = duration;
                                            break;
                                        case 's':
                                            durationInMs = duration * 1000;
                                            break;
                                        case 'm':
                                            durationInMs = duration * 1000 * 60;
                                            break;
                                    }
                                    advanceFrameBy(durationInMs / this.frameTimeFactor);
                                    break;
                                }
                            }
                        }
                        throw new Error("there can only be '^' and '!' markers in a " + "subscription marble diagram. Found instead '" + c + "'.");
                }
                frame = nextFrame;
            }
            if (unsubscriptionFrame < 0) {
                return new SubscriptionLog(subscriptionFrame);
            }
            else {
                return new SubscriptionLog(subscriptionFrame, unsubscriptionFrame);
            }
        }
        static parseMarbles(marbles, values, errorValue, materializeInnerObservables = false, runMode = false) {
            if (marbles.indexOf('!') !== -1) {
                throw new Error('conventional marble diagrams cannot have the ' + 'unsubscription marker "!"');
            }
            const characters = [...marbles];
            const len = characters.length;
            const testMessages = [];
            const subIndex = runMode ? marbles.replace(/^[ ]+/, '').indexOf('^') : marbles.indexOf('^');
            let frame = subIndex === -1 ? 0 : subIndex * -this.frameTimeFactor;
            const getValue = typeof values !== 'object'
                ? (x) => x
                : (x) => {
                    if (materializeInnerObservables && values[x] instanceof ColdObservable) {
                        return values[x].messages;
                    }
                    return values[x];
                };
            let groupStart = -1;
            for (let i = 0; i < len; i++) {
                let nextFrame = frame;
                const advanceFrameBy = (count) => {
                    nextFrame += count * this.frameTimeFactor;
                };
                let notification;
                const c = characters[i];
                switch (c) {
                    case ' ':
                        if (!runMode) {
                            advanceFrameBy(1);
                        }
                        break;
                    case '-':
                        advanceFrameBy(1);
                        break;
                    case '(':
                        groupStart = frame;
                        advanceFrameBy(1);
                        break;
                    case ')':
                        groupStart = -1;
                        advanceFrameBy(1);
                        break;
                    case '|':
                        notification = COMPLETE_NOTIFICATION;
                        advanceFrameBy(1);
                        break;
                    case '^':
                        advanceFrameBy(1);
                        break;
                    case '#':
                        notification = errorNotification(errorValue || 'error');
                        advanceFrameBy(1);
                        break;
                    default:
                        if (runMode && c.match(/^[0-9]$/)) {
                            if (i === 0 || characters[i - 1] === ' ') {
                                const buffer = characters.slice(i).join('');
                                const match = buffer.match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);
                                if (match) {
                                    i += match[0].length - 1;
                                    const duration = parseFloat(match[1]);
                                    const unit = match[2];
                                    let durationInMs;
                                    switch (unit) {
                                        case 'ms':
                                            durationInMs = duration;
                                            break;
                                        case 's':
                                            durationInMs = duration * 1000;
                                            break;
                                        case 'm':
                                            durationInMs = duration * 1000 * 60;
                                            break;
                                    }
                                    advanceFrameBy(durationInMs / this.frameTimeFactor);
                                    break;
                                }
                            }
                        }
                        notification = nextNotification(getValue(c));
                        advanceFrameBy(1);
                        break;
                }
                if (notification) {
                    testMessages.push({ frame: groupStart > -1 ? groupStart : frame, notification });
                }
                frame = nextFrame;
            }
            return testMessages;
        }
        createAnimator() {
            if (!this.runMode) {
                throw new Error('animate() must only be used in run mode');
            }
            let lastHandle = 0;
            let map;
            const delegate = {
                requestAnimationFrame(callback) {
                    if (!map) {
                        throw new Error('animate() was not called within run()');
                    }
                    const handle = ++lastHandle;
                    map.set(handle, callback);
                    return handle;
                },
                cancelAnimationFrame(handle) {
                    if (!map) {
                        throw new Error('animate() was not called within run()');
                    }
                    map.delete(handle);
                },
            };
            const animate = (marbles) => {
                if (map) {
                    throw new Error('animate() must not be called more than once within run()');
                }
                if (/[|#]/.test(marbles)) {
                    throw new Error('animate() must not complete or error');
                }
                map = new Map();
                const messages = TestScheduler.parseMarbles(marbles, undefined, undefined, undefined, true);
                for (const message of messages) {
                    this.schedule(() => {
                        const now = this.now();
                        const callbacks = Array.from(map.values());
                        map.clear();
                        for (const callback of callbacks) {
                            callback(now);
                        }
                    }, message.frame);
                }
            };
            return { animate, delegate };
        }
        createDelegates() {
            let lastHandle = 0;
            const scheduleLookup = new Map();
            const run = () => {
                const now = this.now();
                const scheduledRecords = Array.from(scheduleLookup.values());
                const scheduledRecordsDue = scheduledRecords.filter(({ due }) => due <= now);
                const dueImmediates = scheduledRecordsDue.filter(({ type }) => type === 'immediate');
                if (dueImmediates.length > 0) {
                    const { handle, handler } = dueImmediates[0];
                    scheduleLookup.delete(handle);
                    handler();
                    return;
                }
                const dueIntervals = scheduledRecordsDue.filter(({ type }) => type === 'interval');
                if (dueIntervals.length > 0) {
                    const firstDueInterval = dueIntervals[0];
                    const { duration, handler } = firstDueInterval;
                    firstDueInterval.due = now + duration;
                    firstDueInterval.subscription = this.schedule(run, duration);
                    handler();
                    return;
                }
                const dueTimeouts = scheduledRecordsDue.filter(({ type }) => type === 'timeout');
                if (dueTimeouts.length > 0) {
                    const { handle, handler } = dueTimeouts[0];
                    scheduleLookup.delete(handle);
                    handler();
                    return;
                }
                throw new Error('Expected a due immediate or interval');
            };
            const immediate = {
                setImmediate: (handler) => {
                    const handle = ++lastHandle;
                    scheduleLookup.set(handle, {
                        due: this.now(),
                        duration: 0,
                        handle,
                        handler,
                        subscription: this.schedule(run, 0),
                        type: 'immediate',
                    });
                    return handle;
                },
                clearImmediate: (handle) => {
                    const value = scheduleLookup.get(handle);
                    if (value) {
                        value.subscription.unsubscribe();
                        scheduleLookup.delete(handle);
                    }
                },
            };
            const interval = {
                setInterval: (handler, duration = 0) => {
                    const handle = ++lastHandle;
                    scheduleLookup.set(handle, {
                        due: this.now() + duration,
                        duration,
                        handle,
                        handler,
                        subscription: this.schedule(run, duration),
                        type: 'interval',
                    });
                    return handle;
                },
                clearInterval: (handle) => {
                    const value = scheduleLookup.get(handle);
                    if (value) {
                        value.subscription.unsubscribe();
                        scheduleLookup.delete(handle);
                    }
                },
            };
            const timeout = {
                setTimeout: (handler, duration = 0) => {
                    const handle = ++lastHandle;
                    scheduleLookup.set(handle, {
                        due: this.now() + duration,
                        duration,
                        handle,
                        handler,
                        subscription: this.schedule(run, duration),
                        type: 'timeout',
                    });
                    return handle;
                },
                clearTimeout: (handle) => {
                    const value = scheduleLookup.get(handle);
                    if (value) {
                        value.subscription.unsubscribe();
                        scheduleLookup.delete(handle);
                    }
                },
            };
            return { immediate, interval, timeout };
        }
        run(callback) {
            const prevFrameTimeFactor = TestScheduler.frameTimeFactor;
            const prevMaxFrames = this.maxFrames;
            TestScheduler.frameTimeFactor = 1;
            this.maxFrames = Infinity;
            this.runMode = true;
            const animator = this.createAnimator();
            const delegates = this.createDelegates();
            animationFrameProvider.delegate = animator.delegate;
            dateTimestampProvider.delegate = this;
            immediateProvider.delegate = delegates.immediate;
            intervalProvider.delegate = delegates.interval;
            timeoutProvider.delegate = delegates.timeout;
            performanceTimestampProvider.delegate = this;
            const helpers = {
                cold: this.createColdObservable.bind(this),
                hot: this.createHotObservable.bind(this),
                flush: this.flush.bind(this),
                time: this.createTime.bind(this),
                expectObservable: this.expectObservable.bind(this),
                expectSubscriptions: this.expectSubscriptions.bind(this),
                animate: animator.animate,
            };
            try {
                const ret = callback(helpers);
                this.flush();
                return ret;
            }
            finally {
                TestScheduler.frameTimeFactor = prevFrameTimeFactor;
                this.maxFrames = prevMaxFrames;
                this.runMode = false;
                animationFrameProvider.delegate = undefined;
                dateTimestampProvider.delegate = undefined;
                immediateProvider.delegate = undefined;
                intervalProvider.delegate = undefined;
                timeoutProvider.delegate = undefined;
                performanceTimestampProvider.delegate = undefined;
            }
        }
    }
    TestScheduler.frameTimeFactor = 10;

    var _testing = /*#__PURE__*/Object.freeze({
        __proto__: null,
        TestScheduler: TestScheduler
    });

    function getXHRResponse(xhr) {
        switch (xhr.responseType) {
            case 'json': {
                if ('response' in xhr) {
                    return xhr.response;
                }
                else {
                    const ieXHR = xhr;
                    return JSON.parse(ieXHR.responseText);
                }
            }
            case 'document':
                return xhr.responseXML;
            case 'text':
            default: {
                if ('response' in xhr) {
                    return xhr.response;
                }
                else {
                    const ieXHR = xhr;
                    return ieXHR.responseText;
                }
            }
        }
    }

    class AjaxResponse {
        constructor(originalEvent, xhr, request, type = 'download_load') {
            this.originalEvent = originalEvent;
            this.xhr = xhr;
            this.request = request;
            this.type = type;
            const { status, responseType } = xhr;
            this.status = status ?? 0;
            this.responseType = responseType ?? '';
            const allHeaders = xhr.getAllResponseHeaders();
            this.responseHeaders = allHeaders
                ?
                    allHeaders.split('\n').reduce((headers, line) => {
                        const index = line.indexOf(': ');
                        headers[line.slice(0, index)] = line.slice(index + 2);
                        return headers;
                    }, {})
                : {};
            this.response = getXHRResponse(xhr);
            const { loaded, total } = originalEvent;
            this.loaded = loaded;
            this.total = total;
        }
    }

    const AjaxError = createErrorClass((_super) => function AjaxErrorImpl(message, xhr, request) {
        this.message = message;
        this.name = 'AjaxError';
        this.xhr = xhr;
        this.request = request;
        this.status = xhr.status;
        this.responseType = xhr.responseType;
        let response;
        try {
            response = getXHRResponse(xhr);
        }
        catch (err) {
            response = xhr.responseText;
        }
        this.response = response;
    });
    const AjaxTimeoutError = (() => {
        function AjaxTimeoutErrorImpl(xhr, request) {
            AjaxError.call(this, 'ajax timeout', xhr, request);
            this.name = 'AjaxTimeoutError';
            return this;
        }
        AjaxTimeoutErrorImpl.prototype = Object.create(AjaxError.prototype);
        return AjaxTimeoutErrorImpl;
    })();

    function ajaxGet(url, headers) {
        return ajax$1({ method: 'GET', url, headers });
    }
    function ajaxPost(url, body, headers) {
        return ajax$1({ method: 'POST', url, body, headers });
    }
    function ajaxDelete(url, headers) {
        return ajax$1({ method: 'DELETE', url, headers });
    }
    function ajaxPut(url, body, headers) {
        return ajax$1({ method: 'PUT', url, body, headers });
    }
    function ajaxPatch(url, body, headers) {
        return ajax$1({ method: 'PATCH', url, body, headers });
    }
    const mapResponse = map((x) => x.response);
    function ajaxGetJSON(url, headers) {
        return mapResponse(ajax$1({
            method: 'GET',
            url,
            headers,
        }));
    }
    const ajax$1 = (() => {
        const create = (urlOrConfig) => {
            const config = typeof urlOrConfig === 'string'
                ? {
                    url: urlOrConfig,
                }
                : urlOrConfig;
            return fromAjax(config);
        };
        create.get = ajaxGet;
        create.post = ajaxPost;
        create.delete = ajaxDelete;
        create.put = ajaxPut;
        create.patch = ajaxPatch;
        create.getJSON = ajaxGetJSON;
        return create;
    })();
    const UPLOAD = 'upload';
    const DOWNLOAD = 'download';
    const LOADSTART = 'loadstart';
    const PROGRESS = 'progress';
    const LOAD = 'load';
    function fromAjax(init) {
        return new Observable((destination) => {
            const config = {
                async: true,
                crossDomain: false,
                withCredentials: false,
                method: 'GET',
                timeout: 0,
                responseType: 'json',
                ...init,
            };
            const { queryParams, body: configuredBody, headers: configuredHeaders } = config;
            let url = config.url;
            if (!url) {
                throw new TypeError('url is required');
            }
            if (queryParams) {
                let searchParams;
                if (url.includes('?')) {
                    const parts = url.split('?');
                    if (2 < parts.length) {
                        throw new TypeError('invalid url');
                    }
                    searchParams = new URLSearchParams(parts[1]);
                    new URLSearchParams(queryParams).forEach((value, key) => searchParams.set(key, value));
                    url = parts[0] + '?' + searchParams;
                }
                else {
                    searchParams = new URLSearchParams(queryParams);
                    url = url + '?' + searchParams;
                }
            }
            const headers = {};
            if (configuredHeaders) {
                for (const key in configuredHeaders) {
                    if (configuredHeaders.hasOwnProperty(key)) {
                        headers[key.toLowerCase()] = configuredHeaders[key];
                    }
                }
            }
            const crossDomain = config.crossDomain;
            if (!crossDomain && !('x-requested-with' in headers)) {
                headers['x-requested-with'] = 'XMLHttpRequest';
            }
            const { withCredentials, xsrfCookieName, xsrfHeaderName } = config;
            if ((withCredentials || !crossDomain) && xsrfCookieName && xsrfHeaderName) {
                const xsrfCookie = document?.cookie.match(new RegExp(`(^|;\\s*)(${xsrfCookieName})=([^;]*)`))?.pop() ?? '';
                if (xsrfCookie) {
                    headers[xsrfHeaderName] = xsrfCookie;
                }
            }
            const body = extractContentTypeAndMaybeSerializeBody(configuredBody, headers);
            const _request = {
                ...config,
                url,
                headers,
                body,
            };
            let xhr;
            xhr = init.createXHR ? init.createXHR() : new XMLHttpRequest();
            {
                const { progressSubscriber, includeDownloadProgress = false, includeUploadProgress = false } = init;
                const addErrorEvent = (type, errorFactory) => {
                    xhr.addEventListener(type, () => {
                        const error = errorFactory();
                        progressSubscriber?.error?.(error);
                        destination.error(error);
                    });
                };
                addErrorEvent('timeout', () => new AjaxTimeoutError(xhr, _request));
                addErrorEvent('abort', () => new AjaxError('aborted', xhr, _request));
                const createResponse = (direction, event) => new AjaxResponse(event, xhr, _request, `${direction}_${event.type}`);
                const addProgressEvent = (target, type, direction) => {
                    target.addEventListener(type, (event) => {
                        destination.next(createResponse(direction, event));
                    });
                };
                if (includeUploadProgress) {
                    [LOADSTART, PROGRESS, LOAD].forEach((type) => addProgressEvent(xhr.upload, type, UPLOAD));
                }
                if (progressSubscriber) {
                    [LOADSTART, PROGRESS].forEach((type) => xhr.upload.addEventListener(type, (e) => progressSubscriber?.next?.(e)));
                }
                if (includeDownloadProgress) {
                    [LOADSTART, PROGRESS].forEach((type) => addProgressEvent(xhr, type, DOWNLOAD));
                }
                const emitError = (status) => {
                    const msg = 'ajax error' + (status ? ' ' + status : '');
                    destination.error(new AjaxError(msg, xhr, _request));
                };
                xhr.addEventListener('error', (e) => {
                    progressSubscriber?.error?.(e);
                    emitError();
                });
                xhr.addEventListener(LOAD, (event) => {
                    const { status } = xhr;
                    if (status < 400) {
                        progressSubscriber?.complete?.();
                        let response;
                        try {
                            response = createResponse(DOWNLOAD, event);
                        }
                        catch (err) {
                            destination.error(err);
                            return;
                        }
                        destination.next(response);
                        destination.complete();
                    }
                    else {
                        progressSubscriber?.error?.(event);
                        emitError(status);
                    }
                });
            }
            const { user, method, async } = _request;
            if (user) {
                xhr.open(method, url, async, user, _request.password);
            }
            else {
                xhr.open(method, url, async);
            }
            if (async) {
                xhr.timeout = _request.timeout;
                xhr.responseType = _request.responseType;
            }
            if ('withCredentials' in xhr) {
                xhr.withCredentials = _request.withCredentials;
            }
            for (const key in headers) {
                if (headers.hasOwnProperty(key)) {
                    xhr.setRequestHeader(key, headers[key]);
                }
            }
            if (body) {
                xhr.send(body);
            }
            else {
                xhr.send();
            }
            return () => {
                if (xhr && xhr.readyState !== 4) {
                    xhr.abort();
                }
            };
        });
    }
    function extractContentTypeAndMaybeSerializeBody(body, headers) {
        if (!body ||
            typeof body === 'string' ||
            isFormData(body) ||
            isURLSearchParams(body) ||
            isArrayBuffer(body) ||
            isFile(body) ||
            isBlob(body) ||
            isReadableStream(body)) {
            return body;
        }
        if (isArrayBufferView(body)) {
            return body.buffer;
        }
        if (typeof body === 'object') {
            headers['content-type'] = headers['content-type'] ?? 'application/json;charset=utf-8';
            return JSON.stringify(body);
        }
        throw new TypeError('Unknown body type');
    }
    const _toString = Object.prototype.toString;
    function toStringCheck(obj, name) {
        return _toString.call(obj) === `[object ${name}]`;
    }
    function isArrayBuffer(body) {
        return toStringCheck(body, 'ArrayBuffer');
    }
    function isFile(body) {
        return toStringCheck(body, 'File');
    }
    function isBlob(body) {
        return toStringCheck(body, 'Blob');
    }
    function isArrayBufferView(body) {
        return typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(body);
    }
    function isFormData(body) {
        return typeof FormData !== 'undefined' && body instanceof FormData;
    }
    function isURLSearchParams(body) {
        return typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams;
    }
    function isReadableStream(body) {
        return typeof ReadableStream !== 'undefined' && body instanceof ReadableStream;
    }

    var _ajax = /*#__PURE__*/Object.freeze({
        __proto__: null,
        AjaxError: AjaxError,
        AjaxResponse: AjaxResponse,
        AjaxTimeoutError: AjaxTimeoutError,
        ajax: ajax$1
    });

    const DEFAULT_WEBSOCKET_CONFIG = {
        url: '',
        deserializer: (e) => JSON.parse(e.data),
        serializer: (value) => JSON.stringify(value),
    };
    const WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT = 'WebSocketSubject.error must be called with an object with an error code, and an optional reason: { code: number, reason: string }';
    class WebSocketSubject extends AnonymousSubject {
        constructor(urlConfigOrSource, destination) {
            super();
            this._socket = null;
            if (urlConfigOrSource instanceof Observable) {
                this.destination = destination;
                this.source = urlConfigOrSource;
            }
            else {
                const config = (this._config = { ...DEFAULT_WEBSOCKET_CONFIG });
                this._output = new Subject();
                if (typeof urlConfigOrSource === 'string') {
                    config.url = urlConfigOrSource;
                }
                else {
                    for (const key in urlConfigOrSource) {
                        if (urlConfigOrSource.hasOwnProperty(key)) {
                            config[key] = urlConfigOrSource[key];
                        }
                    }
                }
                if (!config.WebSocketCtor && WebSocket) {
                    config.WebSocketCtor = WebSocket;
                }
                else if (!config.WebSocketCtor) {
                    throw new Error('no WebSocket constructor can be found');
                }
                this.destination = new ReplaySubject();
            }
        }
        lift(operator) {
            const sock = new WebSocketSubject(this._config, this.destination);
            sock.operator = operator;
            sock.source = this;
            return sock;
        }
        _resetState() {
            this._socket = null;
            if (!this.source) {
                this.destination = new ReplaySubject();
            }
            this._output = new Subject();
        }
        multiplex(subMsg, unsubMsg, messageFilter) {
            const self = this;
            return new Observable((observer) => {
                try {
                    self.next(subMsg());
                }
                catch (err) {
                    observer.error(err);
                }
                const subscription = self.subscribe({
                    next: (x) => {
                        try {
                            if (messageFilter(x)) {
                                observer.next(x);
                            }
                        }
                        catch (err) {
                            observer.error(err);
                        }
                    },
                    error: (err) => observer.error(err),
                    complete: () => observer.complete(),
                });
                return () => {
                    try {
                        self.next(unsubMsg());
                    }
                    catch (err) {
                        observer.error(err);
                    }
                    subscription.unsubscribe();
                };
            });
        }
        _connectSocket() {
            const { WebSocketCtor, protocol, url, binaryType } = this._config;
            const observer = this._output;
            let socket = null;
            try {
                socket = protocol ? new WebSocketCtor(url, protocol) : new WebSocketCtor(url);
                this._socket = socket;
                if (binaryType) {
                    this._socket.binaryType = binaryType;
                }
            }
            catch (e) {
                observer.error(e);
                return;
            }
            const subscription = new Subscription(() => {
                this._socket = null;
                if (socket && socket.readyState === 1) {
                    socket.close();
                }
            });
            socket.onopen = (evt) => {
                const { _socket } = this;
                if (!_socket) {
                    socket.close();
                    this._resetState();
                    return;
                }
                const { openObserver } = this._config;
                if (openObserver) {
                    openObserver.next(evt);
                }
                const queue = this.destination;
                this.destination = Subscriber.create((x) => {
                    if (socket.readyState === 1) {
                        try {
                            const { serializer } = this._config;
                            socket.send(serializer(x));
                        }
                        catch (e) {
                            this.destination.error(e);
                        }
                    }
                }, (err) => {
                    const { closingObserver } = this._config;
                    if (closingObserver) {
                        closingObserver.next(undefined);
                    }
                    if (err && err.code) {
                        socket.close(err.code, err.reason);
                    }
                    else {
                        observer.error(new TypeError(WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT));
                    }
                    this._resetState();
                }, () => {
                    const { closingObserver } = this._config;
                    if (closingObserver) {
                        closingObserver.next(undefined);
                    }
                    socket.close();
                    this._resetState();
                });
                if (queue && queue instanceof ReplaySubject) {
                    subscription.add(queue.subscribe(this.destination));
                }
            };
            socket.onerror = (e) => {
                this._resetState();
                observer.error(e);
            };
            socket.onclose = (e) => {
                if (socket === this._socket) {
                    this._resetState();
                }
                const { closeObserver } = this._config;
                if (closeObserver) {
                    closeObserver.next(e);
                }
                if (e.wasClean) {
                    observer.complete();
                }
                else {
                    observer.error(e);
                }
            };
            socket.onmessage = (e) => {
                try {
                    const { deserializer } = this._config;
                    observer.next(deserializer(e));
                }
                catch (err) {
                    observer.error(err);
                }
            };
        }
        _subscribe(subscriber) {
            const { source } = this;
            if (source) {
                return source.subscribe(subscriber);
            }
            if (!this._socket) {
                this._connectSocket();
            }
            this._output.subscribe(subscriber);
            subscriber.add(() => {
                const { _socket } = this;
                if (this._output.observers.length === 0) {
                    if (_socket && (_socket.readyState === 1 || _socket.readyState === 0)) {
                        _socket.close();
                    }
                    this._resetState();
                }
            });
            return subscriber;
        }
        unsubscribe() {
            const { _socket } = this;
            if (_socket && (_socket.readyState === 1 || _socket.readyState === 0)) {
                _socket.close();
            }
            this._resetState();
            super.unsubscribe();
        }
    }

    function webSocket$1(urlConfigOrSource) {
        return new WebSocketSubject(urlConfigOrSource);
    }

    var _webSocket = /*#__PURE__*/Object.freeze({
        __proto__: null,
        WebSocketSubject: WebSocketSubject,
        webSocket: webSocket$1
    });

    function fromFetch(input, initWithSelector = {}) {
        const { selector, ...init } = initWithSelector;
        return new Observable((subscriber) => {
            const controller = new AbortController();
            const { signal } = controller;
            let abortable = true;
            const { signal: outerSignal } = init;
            if (outerSignal) {
                if (outerSignal.aborted) {
                    controller.abort();
                }
                else {
                    const outerSignalHandler = () => {
                        if (!signal.aborted) {
                            controller.abort();
                        }
                    };
                    outerSignal.addEventListener('abort', outerSignalHandler);
                    subscriber.add(() => outerSignal.removeEventListener('abort', outerSignalHandler));
                }
            }
            const perSubscriberInit = { ...init, signal };
            const handleError = (err) => {
                abortable = false;
                subscriber.error(err);
            };
            fetch(input, perSubscriberInit)
                .then((response) => {
                if (selector) {
                    innerFrom(selector(response)).subscribe(createOperatorSubscriber(subscriber, undefined, () => {
                        abortable = false;
                        subscriber.complete();
                    }, handleError));
                }
                else {
                    abortable = false;
                    subscriber.next(response);
                    subscriber.complete();
                }
            })
                .catch(handleError);
            return () => {
                if (abortable) {
                    controller.abort();
                }
            };
        });
    }

    var _fetch = /*#__PURE__*/Object.freeze({
        __proto__: null,
        fromFetch: fromFetch
    });

    const operators = _operators;
    const testing = _testing;
    const ajax = _ajax;
    const webSocket = _webSocket;
    const fetch$1 = _fetch;

    exports.ArgumentOutOfRangeError = ArgumentOutOfRangeError;
    exports.AsyncSubject = AsyncSubject;
    exports.BehaviorSubject = BehaviorSubject;
    exports.ConnectableObservable = ConnectableObservable;
    exports.EMPTY = EMPTY;
    exports.EmptyError = EmptyError;
    exports.NEVER = NEVER;
    exports.NotFoundError = NotFoundError;
    exports.Notification = Notification;
    exports.ObjectUnsubscribedError = ObjectUnsubscribedError;
    exports.Observable = Observable;
    exports.ReplaySubject = ReplaySubject;
    exports.Scheduler = Scheduler;
    exports.SequenceError = SequenceError;
    exports.Subject = Subject;
    exports.Subscriber = Subscriber;
    exports.Subscription = Subscription;
    exports.TimeoutError = TimeoutError;
    exports.UnsubscriptionError = UnsubscriptionError;
    exports.VirtualAction = VirtualAction;
    exports.VirtualTimeScheduler = VirtualTimeScheduler;
    exports.ajax = ajax;
    exports.animationFrame = animationFrame;
    exports.animationFrameScheduler = animationFrameScheduler;
    exports.animationFrames = animationFrames;
    exports.asap = asap;
    exports.asapScheduler = asapScheduler;
    exports.async = async;
    exports.asyncScheduler = asyncScheduler;
    exports.audit = audit;
    exports.auditTime = auditTime;
    exports.bindCallback = bindCallback;
    exports.bindNodeCallback = bindNodeCallback;
    exports.buffer = buffer;
    exports.bufferCount = bufferCount;
    exports.bufferTime = bufferTime;
    exports.bufferToggle = bufferToggle;
    exports.bufferWhen = bufferWhen;
    exports.catchError = catchError;
    exports.combineAll = combineAll;
    exports.combineLatest = combineLatest$1;
    exports.combineLatestAll = combineLatestAll;
    exports.combineLatestWith = combineLatestWith;
    exports.concat = concat$1;
    exports.concatAll = concatAll;
    exports.concatMap = concatMap;
    exports.concatMapTo = concatMapTo;
    exports.concatWith = concatWith;
    exports.config = config;
    exports.connect = connect;
    exports.connectable = connectable;
    exports.count = count;
    exports.debounce = debounce;
    exports.debounceTime = debounceTime;
    exports.defaultIfEmpty = defaultIfEmpty;
    exports.defer = defer;
    exports.delay = delay;
    exports.delayWhen = delayWhen;
    exports.dematerialize = dematerialize;
    exports.distinct = distinct;
    exports.distinctUntilChanged = distinctUntilChanged;
    exports.distinctUntilKeyChanged = distinctUntilKeyChanged;
    exports.elementAt = elementAt;
    exports.empty = empty;
    exports.endWith = endWith;
    exports.every = every;
    exports.exhaust = exhaust;
    exports.exhaustAll = exhaustAll;
    exports.exhaustMap = exhaustMap;
    exports.expand = expand;
    exports.fetch = fetch$1;
    exports.filter = filter;
    exports.finalize = finalize;
    exports.find = find;
    exports.findIndex = findIndex;
    exports.first = first;
    exports.firstValueFrom = firstValueFrom;
    exports.flatMap = flatMap;
    exports.forkJoin = forkJoin;
    exports.from = from;
    exports.fromEvent = fromEvent;
    exports.fromEventPattern = fromEventPattern;
    exports.generate = generate;
    exports.groupBy = groupBy;
    exports.identity = identity;
    exports.ignoreElements = ignoreElements;
    exports.iif = iif;
    exports.interval = interval;
    exports.isEmpty = isEmpty;
    exports.isObservable = isObservable;
    exports.last = last;
    exports.lastValueFrom = lastValueFrom;
    exports.map = map;
    exports.mapTo = mapTo;
    exports.materialize = materialize;
    exports.max = max;
    exports.merge = merge$1;
    exports.mergeAll = mergeAll;
    exports.mergeMap = mergeMap;
    exports.mergeMapTo = mergeMapTo;
    exports.mergeScan = mergeScan;
    exports.mergeWith = mergeWith;
    exports.min = min;
    exports.multicast = multicast;
    exports.never = never;
    exports.noop = noop;
    exports.observable = observable;
    exports.observeOn = observeOn;
    exports.of = of;
    exports.onErrorResumeNext = onErrorResumeNext$1;
    exports.onErrorResumeNextWith = onErrorResumeNextWith;
    exports.operators = operators;
    exports.pairs = pairs;
    exports.pairwise = pairwise;
    exports.partition = partition$1;
    exports.pipe = pipe;
    exports.pluck = pluck;
    exports.publish = publish;
    exports.publishBehavior = publishBehavior;
    exports.publishLast = publishLast;
    exports.publishReplay = publishReplay;
    exports.queue = queue;
    exports.queueScheduler = queueScheduler;
    exports.race = race$1;
    exports.raceWith = raceWith;
    exports.range = range;
    exports.reduce = reduce;
    exports.refCount = refCount;
    exports.repeat = repeat;
    exports.repeatWhen = repeatWhen;
    exports.retry = retry;
    exports.retryWhen = retryWhen;
    exports.sample = sample;
    exports.sampleTime = sampleTime;
    exports.scan = scan;
    exports.scheduled = scheduled;
    exports.sequenceEqual = sequenceEqual;
    exports.share = share;
    exports.shareReplay = shareReplay;
    exports.single = single;
    exports.skip = skip;
    exports.skipLast = skipLast;
    exports.skipUntil = skipUntil;
    exports.skipWhile = skipWhile;
    exports.startWith = startWith;
    exports.subscribeOn = subscribeOn;
    exports.switchAll = switchAll;
    exports.switchMap = switchMap;
    exports.switchMapTo = switchMapTo;
    exports.switchScan = switchScan;
    exports.take = take;
    exports.takeLast = takeLast;
    exports.takeUntil = takeUntil;
    exports.takeWhile = takeWhile;
    exports.tap = tap;
    exports.testing = testing;
    exports.throttle = throttle;
    exports.throttleTime = throttleTime;
    exports.throwError = throwError;
    exports.throwIfEmpty = throwIfEmpty;
    exports.timeInterval = timeInterval;
    exports.timeout = timeout;
    exports.timeoutWith = timeoutWith;
    exports.timer = timer;
    exports.timestamp = timestamp;
    exports.toArray = toArray;
    exports.using = using;
    exports.webSocket = webSocket;
    exports.window = window;
    exports.windowCount = windowCount;
    exports.windowTime = windowTime;
    exports.windowToggle = windowToggle;
    exports.windowWhen = windowWhen;
    exports.withLatestFrom = withLatestFrom;
    exports.zip = zip$1;
    exports.zipAll = zipAll;
    exports.zipWith = zipWith;

}));
//# sourceMappingURL=rxjs.js.map
