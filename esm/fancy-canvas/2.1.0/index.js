var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/size.ts
function size({ width, height }) {
  if (width < 0) {
    throw new Error("Negative width is not allowed for Size");
  }
  if (height < 0) {
    throw new Error("Negative height is not allowed for Size");
  }
  return {
    width,
    height
  };
}
__name(size, "size");
function equalSizes(first, second) {
  return first.width === second.width && first.height === second.height;
}
__name(equalSizes, "equalSizes");

// src/device-pixel-ratio.ts
var Observable = class {
  constructor(win) {
    this._resolutionListener = /* @__PURE__ */ __name(() => this._onResolutionChanged(), "_resolutionListener");
    this._resolutionMediaQueryList = null;
    this._observers = [];
    this._window = win;
    this._installResolutionListener();
  }
  static {
    __name(this, "Observable");
  }
  dispose() {
    this._uninstallResolutionListener();
    this._window = null;
  }
  get value() {
    return this._window.devicePixelRatio;
  }
  subscribe(next) {
    const observer = { next };
    this._observers.push(observer);
    return {
      unsubscribe: /* @__PURE__ */ __name(() => {
        this._observers = this._observers.filter((o) => o !== observer);
      }, "unsubscribe")
    };
  }
  _installResolutionListener() {
    if (this._resolutionMediaQueryList !== null) {
      throw new Error("Resolution listener is already installed");
    }
    const dppx = this._window.devicePixelRatio;
    this._resolutionMediaQueryList = this._window.matchMedia(`all and (resolution: ${dppx}dppx)`);
    this._resolutionMediaQueryList.addListener(this._resolutionListener);
  }
  _uninstallResolutionListener() {
    if (this._resolutionMediaQueryList !== null) {
      this._resolutionMediaQueryList.removeListener(this._resolutionListener);
      this._resolutionMediaQueryList = null;
    }
  }
  _reinstallResolutionListener() {
    this._uninstallResolutionListener();
    this._installResolutionListener();
  }
  _onResolutionChanged() {
    this._observers.forEach((observer) => observer.next(this._window.devicePixelRatio));
    this._reinstallResolutionListener();
  }
};
function createObservable(win) {
  return new Observable(win);
}
__name(createObservable, "createObservable");

// src/canvas-element-bitmap-size.ts
var DevicePixelContentBoxBinding = class {
  constructor(canvasElement, transformBitmapSize, options) {
    this._canvasElement = null;
    this._bitmapSizeChangedListeners = [];
    this._suggestedBitmapSize = null;
    this._suggestedBitmapSizeChangedListeners = [];
    // devicePixelRatio approach
    this._devicePixelRatioObservable = null;
    // ResizeObserver approach
    this._canvasElementResizeObserver = null;
    this._canvasElement = canvasElement;
    this._canvasElementClientSize = size({
      width: this._canvasElement.clientWidth,
      height: this._canvasElement.clientHeight
    });
    this._transformBitmapSize = transformBitmapSize ?? ((size2) => size2);
    this._allowResizeObserver = options?.allowResizeObserver ?? true;
    this._chooseAndInitObserver();
  }
  static {
    __name(this, "DevicePixelContentBoxBinding");
  }
  dispose() {
    if (this._canvasElement === null) {
      throw new Error("Object is disposed");
    }
    this._canvasElementResizeObserver?.disconnect();
    this._canvasElementResizeObserver = null;
    this._devicePixelRatioObservable?.dispose();
    this._devicePixelRatioObservable = null;
    this._suggestedBitmapSizeChangedListeners.length = 0;
    this._bitmapSizeChangedListeners.length = 0;
    this._canvasElement = null;
  }
  get canvasElement() {
    if (this._canvasElement === null) {
      throw new Error("Object is disposed");
    }
    return this._canvasElement;
  }
  get canvasElementClientSize() {
    return this._canvasElementClientSize;
  }
  get bitmapSize() {
    return size({
      width: this.canvasElement.width,
      height: this.canvasElement.height
    });
  }
  /**
   * Use this function to change canvas element client size until binding is disposed
   * @param clientSize New client size for bound HTMLCanvasElement
   */
  resizeCanvasElement(clientSize) {
    this._canvasElementClientSize = size(clientSize);
    this.canvasElement.style.width = `${this._canvasElementClientSize.width}px`;
    this.canvasElement.style.height = `${this._canvasElementClientSize.height}px`;
    this._invalidateBitmapSize();
  }
  subscribeBitmapSizeChanged(listener) {
    this._bitmapSizeChangedListeners.push(listener);
  }
  unsubscribeBitmapSizeChanged(listener) {
    this._bitmapSizeChangedListeners = this._bitmapSizeChangedListeners.filter((l) => l !== listener);
  }
  get suggestedBitmapSize() {
    return this._suggestedBitmapSize;
  }
  subscribeSuggestedBitmapSizeChanged(listener) {
    this._suggestedBitmapSizeChangedListeners.push(listener);
  }
  unsubscribeSuggestedBitmapSizeChanged(listener) {
    this._suggestedBitmapSizeChangedListeners = this._suggestedBitmapSizeChangedListeners.filter((l) => l !== listener);
  }
  applySuggestedBitmapSize() {
    if (this._suggestedBitmapSize === null) {
      return;
    }
    const oldSuggestedSize = this._suggestedBitmapSize;
    this._suggestedBitmapSize = null;
    this._resizeBitmap(oldSuggestedSize);
    this._emitSuggestedBitmapSizeChanged(oldSuggestedSize, this._suggestedBitmapSize);
  }
  _resizeBitmap(newSize) {
    const oldSize = this.bitmapSize;
    if (equalSizes(oldSize, newSize)) {
      return;
    }
    this.canvasElement.width = newSize.width;
    this.canvasElement.height = newSize.height;
    this._emitBitmapSizeChanged(oldSize, newSize);
  }
  _emitBitmapSizeChanged(oldSize, newSize) {
    this._bitmapSizeChangedListeners.forEach((listener) => listener.call(this, oldSize, newSize));
  }
  _suggestNewBitmapSize(newSize) {
    const oldSuggestedSize = this._suggestedBitmapSize;
    const finalNewSize = size(this._transformBitmapSize(newSize, this._canvasElementClientSize));
    const newSuggestedSize = equalSizes(this.bitmapSize, finalNewSize) ? null : finalNewSize;
    if (oldSuggestedSize === null && newSuggestedSize === null) {
      return;
    }
    if (oldSuggestedSize !== null && newSuggestedSize !== null && equalSizes(oldSuggestedSize, newSuggestedSize)) {
      return;
    }
    this._suggestedBitmapSize = newSuggestedSize;
    this._emitSuggestedBitmapSizeChanged(oldSuggestedSize, newSuggestedSize);
  }
  _emitSuggestedBitmapSizeChanged(oldSize, newSize) {
    this._suggestedBitmapSizeChangedListeners.forEach((listener) => listener.call(this, oldSize, newSize));
  }
  _chooseAndInitObserver() {
    if (!this._allowResizeObserver) {
      this._initDevicePixelRatioObservable();
      return;
    }
    isDevicePixelContentBoxSupported().then(
      (isSupported) => isSupported ? this._initResizeObserver() : this._initDevicePixelRatioObservable()
    );
  }
  // devicePixelRatio approach
  _initDevicePixelRatioObservable() {
    if (this._canvasElement === null) {
      return;
    }
    const win = canvasElementWindow(this._canvasElement);
    if (win === null) {
      throw new Error("No window is associated with the canvas");
    }
    this._devicePixelRatioObservable = createObservable(win);
    this._devicePixelRatioObservable.subscribe(() => this._invalidateBitmapSize());
    this._invalidateBitmapSize();
  }
  _invalidateBitmapSize() {
    if (this._canvasElement === null) {
      return;
    }
    const win = canvasElementWindow(this._canvasElement);
    if (win === null) {
      return;
    }
    const ratio = this._devicePixelRatioObservable?.value ?? win.devicePixelRatio;
    const canvasRects = this._canvasElement.getClientRects();
    const newSize = (
      // eslint-disable-next-line no-negated-condition
      canvasRects[0] !== void 0 ? predictedBitmapSize(canvasRects[0], ratio) : size({
        width: this._canvasElementClientSize.width * ratio,
        height: this._canvasElementClientSize.height * ratio
      })
    );
    this._suggestNewBitmapSize(newSize);
  }
  // ResizeObserver approach
  _initResizeObserver() {
    if (this._canvasElement === null) {
      return;
    }
    this._canvasElementResizeObserver = new ResizeObserver((entries) => {
      const entry = entries.find((entry2) => entry2.target === this._canvasElement);
      if (!entry || !entry.devicePixelContentBoxSize || !entry.devicePixelContentBoxSize[0]) {
        return;
      }
      const entrySize = entry.devicePixelContentBoxSize[0];
      const newSize = size({
        width: entrySize.inlineSize,
        height: entrySize.blockSize
      });
      this._suggestNewBitmapSize(newSize);
    });
    this._canvasElementResizeObserver.observe(this._canvasElement, { box: "device-pixel-content-box" });
  }
};
function bindTo(canvasElement, target) {
  if (target.type === "device-pixel-content-box") {
    return new DevicePixelContentBoxBinding(canvasElement, target.transform, target.options);
  }
  throw new Error("Unsupported binding target");
}
__name(bindTo, "bindTo");
function canvasElementWindow(canvasElement) {
  return canvasElement.ownerDocument.defaultView;
}
__name(canvasElementWindow, "canvasElementWindow");
function isDevicePixelContentBoxSupported() {
  return new Promise((resolve) => {
    const ro = new ResizeObserver((entries) => {
      resolve(entries.every((entry) => "devicePixelContentBoxSize" in entry));
      ro.disconnect();
    });
    ro.observe(document.body, { box: "device-pixel-content-box" });
  }).catch(() => false);
}
__name(isDevicePixelContentBoxSupported, "isDevicePixelContentBoxSupported");
function predictedBitmapSize(canvasRect, ratio) {
  return size({
    width: Math.round(canvasRect.left * ratio + canvasRect.width * ratio) - Math.round(canvasRect.left * ratio),
    height: Math.round(canvasRect.top * ratio + canvasRect.height * ratio) - Math.round(canvasRect.top * ratio)
  });
}
__name(predictedBitmapSize, "predictedBitmapSize");

// src/canvas-rendering-target.ts
var CanvasRenderingTarget2D = class {
  static {
    __name(this, "CanvasRenderingTarget2D");
  }
  constructor(context, mediaSize, bitmapSize) {
    if (mediaSize.width === 0 || mediaSize.height === 0) {
      throw new TypeError("Rendering target could only be created on a media with positive width and height");
    }
    this._mediaSize = mediaSize;
    if (bitmapSize.width === 0 || bitmapSize.height === 0) {
      throw new TypeError("Rendering target could only be created using a bitmap with positive integer width and height");
    }
    this._bitmapSize = bitmapSize;
    this._context = context;
  }
  useMediaCoordinateSpace(f) {
    try {
      this._context.save();
      this._context.setTransform(1, 0, 0, 1, 0, 0);
      this._context.scale(this._horizontalPixelRatio, this._verticalPixelRatio);
      return f({
        context: this._context,
        mediaSize: this._mediaSize
      });
    } finally {
      this._context.restore();
    }
  }
  useBitmapCoordinateSpace(f) {
    try {
      this._context.save();
      this._context.setTransform(1, 0, 0, 1, 0, 0);
      return f({
        context: this._context,
        mediaSize: this._mediaSize,
        bitmapSize: this._bitmapSize,
        horizontalPixelRatio: this._horizontalPixelRatio,
        verticalPixelRatio: this._verticalPixelRatio
      });
    } finally {
      this._context.restore();
    }
  }
  get _horizontalPixelRatio() {
    return this._bitmapSize.width / this._mediaSize.width;
  }
  get _verticalPixelRatio() {
    return this._bitmapSize.height / this._mediaSize.height;
  }
};
function createCanvasRenderingTarget2D(binding, contextOptions) {
  const mediaSize = binding.canvasElementClientSize;
  const bitmapSize = binding.bitmapSize;
  const context = binding.canvasElement.getContext("2d", contextOptions);
  if (context === null) {
    throw new Error("Could not get 2d drawing context from bound canvas element. Has the canvas already been set to a different context mode?");
  }
  return new CanvasRenderingTarget2D(context, mediaSize, bitmapSize);
}
__name(createCanvasRenderingTarget2D, "createCanvasRenderingTarget2D");
function tryCreateCanvasRenderingTarget2D(binding, contextOptions) {
  const mediaSize = binding.canvasElementClientSize;
  if (mediaSize.width === 0 || mediaSize.height === 0) {
    return null;
  }
  const bitmapSize = binding.bitmapSize;
  if (bitmapSize.width === 0 || bitmapSize.height === 0) {
    return null;
  }
  const context = binding.canvasElement.getContext("2d", contextOptions);
  if (context === null) {
    return null;
  }
  return new CanvasRenderingTarget2D(context, mediaSize, bitmapSize);
}
__name(tryCreateCanvasRenderingTarget2D, "tryCreateCanvasRenderingTarget2D");
export {
  CanvasRenderingTarget2D,
  bindTo as bindCanvasElementBitmapSizeTo,
  createCanvasRenderingTarget2D,
  equalSizes,
  size,
  tryCreateCanvasRenderingTarget2D
};
//# sourceMappingURL=index.js.map
