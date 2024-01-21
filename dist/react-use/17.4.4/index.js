(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["ReactUse"] = factory(require("React"));
	else
		root["ReactUse"] = factory(root["React"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__24__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 640:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var deselectCurrent = __webpack_require__(742);

var clipboardToIE11Formatting = {
  "text/plain": "Text",
  "text/html": "Url",
  "default": "Text"
}

var defaultMessage = "Copy to clipboard: #{key}, Enter";

function format(message) {
  var copyKey = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
  return message.replace(/#{\s*key\s*}/g, copyKey);
}

function copy(text, options) {
  var debug,
    message,
    reselectPrevious,
    range,
    selection,
    mark,
    success = false;
  if (!options) {
    options = {};
  }
  debug = options.debug || false;
  try {
    reselectPrevious = deselectCurrent();

    range = document.createRange();
    selection = document.getSelection();

    mark = document.createElement("span");
    mark.textContent = text;
    // reset user styles for span element
    mark.style.all = "unset";
    // prevents scrolling to the end of the page
    mark.style.position = "fixed";
    mark.style.top = 0;
    mark.style.clip = "rect(0, 0, 0, 0)";
    // used to preserve spaces and line breaks
    mark.style.whiteSpace = "pre";
    // do not inherit user-select (it may be `none`)
    mark.style.webkitUserSelect = "text";
    mark.style.MozUserSelect = "text";
    mark.style.msUserSelect = "text";
    mark.style.userSelect = "text";
    mark.addEventListener("copy", function(e) {
      e.stopPropagation();
      if (options.format) {
        e.preventDefault();
        if (typeof e.clipboardData === "undefined") { // IE 11
          debug && console.warn("unable to use e.clipboardData");
          debug && console.warn("trying IE specific stuff");
          window.clipboardData.clearData();
          var format = clipboardToIE11Formatting[options.format] || clipboardToIE11Formatting["default"]
          window.clipboardData.setData(format, text);
        } else { // all other browsers
          e.clipboardData.clearData();
          e.clipboardData.setData(options.format, text);
        }
      }
      if (options.onCopy) {
        e.preventDefault();
        options.onCopy(e.clipboardData);
      }
    });

    document.body.appendChild(mark);

    range.selectNodeContents(mark);
    selection.addRange(range);

    var successful = document.execCommand("copy");
    if (!successful) {
      throw new Error("copy command was unsuccessful");
    }
    success = true;
  } catch (err) {
    debug && console.error("unable to copy using execCommand: ", err);
    debug && console.warn("trying IE specific stuff");
    try {
      window.clipboardData.setData(options.format || "text", text);
      options.onCopy && options.onCopy(window.clipboardData);
      success = true;
    } catch (err) {
      debug && console.error("unable to copy using clipboardData: ", err);
      debug && console.error("falling back to prompt");
      message = format("message" in options ? options.message : defaultMessage);
      window.prompt(message, text);
    }
  } finally {
    if (selection) {
      if (typeof selection.removeRange == "function") {
        selection.removeRange(range);
      } else {
        selection.removeAllRanges();
      }
    }

    if (mark) {
      document.body.removeChild(mark);
    }
    reselectPrevious();
  }

  return success;
}

module.exports = copy;


/***/ }),

/***/ 252:
/***/ ((module) => {

"use strict";


// do not edit .js files directly - edit src/index.jst



module.exports = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }



    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (key === '_owner' && a.$$typeof) {
        // React-specific: avoid traversing React elements' _owner.
        //  _owner contains circular references
        // and is not needed when comparing the actual elements (and not their owners)
        continue;
      }

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};


/***/ }),

/***/ 376:
/***/ ((__unused_webpack_module, exports) => {

var keyList = Object.keys;

exports.D = function equal (a, b) {
  if (a === b) return true;
  if (!(a instanceof Object) || !(b instanceof Object)) return false;

  var keys = keyList(a);
  var length = keys.length;

  for (var i = 0; i < length; i++)
    if (!(keys[i] in b)) return false;

  for (var i = 0; i < length; i++)
    if (a[keys[i]] !== b[keys[i]]) return false;

  return length === keyList(b).length;
};


/***/ }),

/***/ 808:
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader;
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		registeredInModuleLoader = true;
	}
	if (true) {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}

				// Considers RFC 6265 section 5.2:
				// ...
				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
				//     character:
				// Consume the characters of the unparsed-attributes up to,
				// not including, the first %x3B (";") character.
				// ...
				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
			}

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));


/***/ }),

/***/ 142:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.I = function (renderer) {
    // CSSOM support only browser environment.
    if (!renderer.client) return;

    if (false) {}

    // Style sheet for media queries.
    document.head.appendChild(renderer.msh = document.createElement('style'));

    renderer.createRule = function (selector, prelude) {
        var rawCss = selector + '{}';
        if (prelude) rawCss = prelude + '{' + rawCss + '}';
        var sheet = prelude ? renderer.msh.sheet : renderer.sh.sheet;
        var index = sheet.insertRule(rawCss, sheet.cssRules.length);
        var rule = (sheet.cssRules || sheet.rules)[index];

        // Keep track of `index` where rule was inserted in the sheet. This is
        // needed for rule deletion.
        rule.index = index;

        if (prelude) {
            // If rule has media query (it has prelude), move style (CSSStyleDeclaration)
            // object to the "top" to normalize it with a rule without the media
            // query, so that both rules have `.style` property available.
            var selectorRule = (rule.cssRules || rule.rules)[0];
            rule.style = selectorRule.style;
            rule.styleMap = selectorRule.styleMap;
        }

        return rule;
    };
};


/***/ }),

/***/ 99:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var removeRule = (__webpack_require__(662)/* .removeRule */ .D);

exports.I = function (renderer) {
    // VCSSOM support only browser environment.
    if (!renderer.client) return;

    if (false) {}

    var kebab = renderer.kebab;

    function VRule (selector, prelude) {
        this.rule = renderer.createRule(selector, prelude);
        this.decl = {};
    }
    VRule.prototype.diff = function (newDecl) {
        var oldDecl = this.decl;
        var style = this.rule.style;
        var property;
        for (property in oldDecl)
            if (newDecl[property] === undefined)
                style.removeProperty(property);
        for (property in newDecl)
            if (newDecl[property] !== oldDecl[property])
                style.setProperty(kebab(property), newDecl[property]);
        this.decl = newDecl;
    };
    VRule.prototype.del = function () {
        removeRule(this.rule);
    };

    function VSheet () {
        /**
         * {
         *   '<at-rule-prelude>': {
         *     '<selector>': {
         *       color: 'red
         *     }
         *   }
         * }
         */
        this.tree = {};
    }
    VSheet.prototype.diff = function (newTree) {
        var oldTree = this.tree;

        // Remove media queries not present in new tree.
        for (var prelude in oldTree) {
            if (newTree[prelude] === undefined) {
                var rules = oldTree[prelude];
                for (var selector in rules)
                    rules[selector].del();
            }
        }

        for (var prelude in newTree) {
            if (oldTree[prelude] === undefined) {
                // Whole media query is new.
                for (var selector in newTree[prelude]) {
                    var rule = new VRule(selector, prelude);
                    rule.diff(newTree[prelude][selector]);
                    newTree[prelude][selector] = rule;
                }
            } else {
                // Old tree already has rules with this media query.
                var oldRules = oldTree[prelude];
                var newRules = newTree[prelude];

                // Remove rules not present in new tree.
                for (var selector in oldRules)
                    if (!newRules[selector])
                        oldRules[selector].del();

                // Apply new rules.
                for (var selector in newRules) {
                    var rule = oldRules[selector];
                    if (rule) {
                        rule.diff(newRules[selector]);
                        newRules[selector] = rule;
                    } else {
                        rule = new VRule(selector, prelude);
                        rule.diff(newRules[selector]);
                        newRules[selector] = rule;
                    }
                }
            }
        }

        this.tree = newTree;
    };

    renderer.VRule = VRule;
    renderer.VSheet = VSheet;
};


/***/ }),

/***/ 749:
/***/ ((__unused_webpack_module, exports) => {

function cssToTree (tree, css, selector, prelude) {
    var declarations = {};
    var hasDeclarations = false;
    var key, value;

    for (key in css) {
        value = css[key];
        if (typeof value !== 'object') {
            hasDeclarations = true;
            declarations[key] = value;
        }
    }

    if (hasDeclarations) {
        if (!tree[prelude]) tree[prelude] = {};
        tree[prelude][selector] = declarations;
    }

    for (key in css) {
        value = css[key];
        if (typeof value === 'object') {
            if (key[0] === '@') {
                cssToTree(tree, value, selector, key);
            } else {
                var hasCurrentSymbol = key.indexOf('&') > -1;
                var selectorParts = selector.split(',');
                if (hasCurrentSymbol) {
                    for (var i = 0; i < selectorParts.length; i++) {
                        selectorParts[i] = key.replace(/&/g, selectorParts[i]);
                    }
                } else {
                    for (var i = 0; i < selectorParts.length; i++) {
                        selectorParts[i] = selectorParts[i] + ' ' + key;
                    }
                }
                cssToTree(tree, value, selectorParts.join(','), prelude);
            }
        }
    }
};

exports.z = cssToTree;


/***/ }),

/***/ 662:
/***/ ((__unused_webpack_module, exports) => {

function removeRule (rule) {
    var maxIndex = rule.index;
    var sh = rule.parentStyleSheet;
    var rules = sh.cssRules || sh.rules;
    maxIndex = Math.max(maxIndex, rules.length - 1);
    while (maxIndex >= 0) {
        if (rules[maxIndex] === rule) {
            sh.deleteRule(maxIndex);
            break;
        }
        maxIndex--;
    }
}

exports.D = removeRule;


/***/ }),

/***/ 818:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


var KEBAB_REGEX = /[A-Z]/g;

var hash = function (str) {
    var h = 5381, i = str.length;

    while (i) h = (h * 33) ^ str.charCodeAt(--i);

    return '_' + (h >>> 0).toString(36);
};

exports.U = function (config) {
    config = config || {};
    var assign = config.assign || Object.assign;
    var client = typeof window === 'object';

    // Check if we are really in browser environment.
    if (false) {}

    var renderer = assign({
        raw: '',
        pfx: '_',
        client: client,
        assign: assign,
        stringify: JSON.stringify,
        kebab: function (prop) {
            return prop.replace(KEBAB_REGEX, '-$&').toLowerCase();
        },
        decl: function (key, value) {
            key = renderer.kebab(key);
            return key + ':' + value + ';';
        },
        hash: function (obj) {
            return hash(renderer.stringify(obj));
        },
        selector: function (parent, selector) {
            return parent + (selector[0] === ':' ? ''  : ' ') + selector;
        },
        putRaw: function (rawCssRule) {
            renderer.raw += rawCssRule;
        }
    }, config);

    if (renderer.client) {
        if (!renderer.sh)
            document.head.appendChild(renderer.sh = document.createElement('style'));

        if (false) {}

        renderer.putRaw = function (rawCssRule) {
            // .insertRule() is faster than .appendChild(), that's why we use it in PROD.
            // But CSS injected using .insertRule() is not displayed in Chrome Devtools,
            // that's why we use .appendChild in DEV.
            if (true) {
                var sheet = renderer.sh.sheet;

                // Unknown pseudo-selectors will throw, this try/catch swallows all errors.
                try {
                    sheet.insertRule(rawCssRule, sheet.cssRules.length);
                // eslint-disable-next-line no-empty
                } catch (error) {}
            } else {}
        };
    }

    renderer.put = function (selector, decls, atrule) {
        var str = '';
        var prop, value;
        var postponed = [];

        for (prop in decls) {
            value = decls[prop];

            if ((value instanceof Object) && !(value instanceof Array)) {
                postponed.push(prop);
            } else {
                if (false) {} else {
                    str += renderer.decl(prop, value, selector, atrule);
                }
            }
        }

        if (str) {
            if (false) {} else {
                str = selector + '{' + str + '}';
            }
            renderer.putRaw(atrule ? atrule + '{' + str + '}' : str);
        }

        for (var i = 0; i < postponed.length; i++) {
            prop = postponed[i];

            if (prop[0] === '@' && prop !== '@font-face') {
                renderer.putAt(selector, decls[prop], prop);
            } else {
                renderer.put(renderer.selector(selector, prop), decls[prop], atrule);
            }
        }
    };

    renderer.putAt = renderer.put;

    return renderer;
};


/***/ }),

/***/ 718:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(655);
var wrapInStatefulComponent_1 = tslib_1.__importDefault(__webpack_require__(503));
var addClassDecoratorSupport = function (Comp) {
    var isSFC = !Comp.prototype;
    return !isSFC ? Comp : wrapInStatefulComponent_1.default(Comp);
};
exports["default"] = addClassDecoratorSupport;
//# sourceMappingURL=addClassDecoratorSupport.js.map

/***/ }),

/***/ 162:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.divWrapper = void 0;
var tslib_1 = __webpack_require__(655);
var React = tslib_1.__importStar(__webpack_require__(24));
var addClassDecoratorSupport_1 = tslib_1.__importDefault(__webpack_require__(718));
var h = React.createElement;
var noWrap = function (Comp, propName, props, state) {
    var _a;
    return h(Comp, propName ? tslib_1.__assign((_a = {}, _a[propName] = state, _a), props) : tslib_1.__assign(tslib_1.__assign({}, state), props));
};
exports.divWrapper = function (Comp, propName, props, state) {
    return h('div', null, noWrap(Comp, propName, props, state));
};
var createEnhancer = function (Facc, prop, wrapper) {
    if (wrapper === void 0) { wrapper = noWrap; }
    var enhancer = function (Comp, propName, faccProps) {
        if (propName === void 0) { propName = prop; }
        if (faccProps === void 0) { faccProps = null; }
        var isClassDecoratorMethodCall = typeof Comp === 'string';
        if (isClassDecoratorMethodCall) {
            return function (Klass) { return enhancer(Klass, Comp || prop, propName); };
        }
        var Enhanced = function (props) {
            return h(Facc, faccProps, function (state) { return wrapper(Comp, propName, props, state); });
        };
        if (false) {}
        return isClassDecoratorMethodCall ? addClassDecoratorSupport_1.default(Enhanced) : Enhanced;
    };
    return enhancer;
};
exports["default"] = createEnhancer;
//# sourceMappingURL=createEnhancer.js.map

/***/ }),

/***/ 3:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(655);
var render_1 = tslib_1.__importDefault(__webpack_require__(364));
var defaultMapPropsToArgs = function (props) { return [props]; };
var hookToRenderProp = function (hook, mapPropsToArgs) {
    if (mapPropsToArgs === void 0) { mapPropsToArgs = defaultMapPropsToArgs; }
    return function (props) { return render_1.default(props, hook.apply(void 0, mapPropsToArgs(props))); };
};
exports["default"] = hookToRenderProp;
//# sourceMappingURL=hookToRenderProp.js.map

/***/ }),

/***/ 260:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
__webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = void 0;
var tslib_1 = __webpack_require__(655);
var render_1 = tslib_1.__importDefault(__webpack_require__(364));
__webpack_unused_export__ = render_1.default;
var createEnhancer_1 = tslib_1.__importDefault(__webpack_require__(162));
__webpack_unused_export__ = createEnhancer_1.default;
var hookToRenderProp_1 = tslib_1.__importDefault(__webpack_require__(3));
__webpack_unused_export__ = hookToRenderProp_1.default;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 364:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(655);
var react_1 = __webpack_require__(24);
var isReact16Plus = parseInt(react_1.version.substr(0, react_1.version.indexOf('.'))) > 15;
var isFn = function (fn) { return typeof fn === 'function'; };
var render = function (props, data) {
    var more = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        more[_i - 2] = arguments[_i];
    }
    if (false) { var children_1, render_1; }
    var render = props.render, _a = props.children, children = _a === void 0 ? render : _a, component = props.component, _b = props.comp, comp = _b === void 0 ? component : _b;
    if (isFn(children))
        return children.apply(void 0, tslib_1.__spreadArrays([data], more));
    if (comp) {
        return react_1.createElement(comp, data);
    }
    if (children instanceof Array)
        return isReact16Plus ? children : react_1.createElement.apply(void 0, tslib_1.__spreadArrays(['div', null], children));
    if (children && (children instanceof Object)) {
        if (false) {}
        else {
            if (typeof children.type === 'string')
                return children;
            return react_1.cloneElement(children, Object.assign({}, children.props, data));
        }
    }
    return children || null;
};
exports["default"] = render;
//# sourceMappingURL=render.js.map

/***/ }),

/***/ 503:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(655);
var React = tslib_1.__importStar(__webpack_require__(24));
var wrapInStatefulComponent = function (Comp) {
    var Decorated = (function (_super) {
        tslib_1.__extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.render = function () {
            return Comp(this.props, this.context);
        };
        return class_1;
    }(React.Component));
    if (false) {}
    return Decorated;
};
exports["default"] = wrapInStatefulComponent;
//# sourceMappingURL=wrapInStatefulComponent.js.map

/***/ }),

/***/ 577:
/***/ ((module) => {

/*!
* screenfull
* v5.1.0 - 2020-12-24
* (c) Sindre Sorhus; MIT License
*/
(function () {
	'use strict';

	var document = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {};
	var isCommonjs =  true && module.exports;

	var fn = (function () {
		var val;

		var fnMap = [
			[
				'requestFullscreen',
				'exitFullscreen',
				'fullscreenElement',
				'fullscreenEnabled',
				'fullscreenchange',
				'fullscreenerror'
			],
			// New WebKit
			[
				'webkitRequestFullscreen',
				'webkitExitFullscreen',
				'webkitFullscreenElement',
				'webkitFullscreenEnabled',
				'webkitfullscreenchange',
				'webkitfullscreenerror'

			],
			// Old WebKit
			[
				'webkitRequestFullScreen',
				'webkitCancelFullScreen',
				'webkitCurrentFullScreenElement',
				'webkitCancelFullScreen',
				'webkitfullscreenchange',
				'webkitfullscreenerror'

			],
			[
				'mozRequestFullScreen',
				'mozCancelFullScreen',
				'mozFullScreenElement',
				'mozFullScreenEnabled',
				'mozfullscreenchange',
				'mozfullscreenerror'
			],
			[
				'msRequestFullscreen',
				'msExitFullscreen',
				'msFullscreenElement',
				'msFullscreenEnabled',
				'MSFullscreenChange',
				'MSFullscreenError'
			]
		];

		var i = 0;
		var l = fnMap.length;
		var ret = {};

		for (; i < l; i++) {
			val = fnMap[i];
			if (val && val[1] in document) {
				for (i = 0; i < val.length; i++) {
					ret[fnMap[0][i]] = val[i];
				}
				return ret;
			}
		}

		return false;
	})();

	var eventNameMap = {
		change: fn.fullscreenchange,
		error: fn.fullscreenerror
	};

	var screenfull = {
		request: function (element, options) {
			return new Promise(function (resolve, reject) {
				var onFullScreenEntered = function () {
					this.off('change', onFullScreenEntered);
					resolve();
				}.bind(this);

				this.on('change', onFullScreenEntered);

				element = element || document.documentElement;

				var returnPromise = element[fn.requestFullscreen](options);

				if (returnPromise instanceof Promise) {
					returnPromise.then(onFullScreenEntered).catch(reject);
				}
			}.bind(this));
		},
		exit: function () {
			return new Promise(function (resolve, reject) {
				if (!this.isFullscreen) {
					resolve();
					return;
				}

				var onFullScreenExit = function () {
					this.off('change', onFullScreenExit);
					resolve();
				}.bind(this);

				this.on('change', onFullScreenExit);

				var returnPromise = document[fn.exitFullscreen]();

				if (returnPromise instanceof Promise) {
					returnPromise.then(onFullScreenExit).catch(reject);
				}
			}.bind(this));
		},
		toggle: function (element, options) {
			return this.isFullscreen ? this.exit() : this.request(element, options);
		},
		onchange: function (callback) {
			this.on('change', callback);
		},
		onerror: function (callback) {
			this.on('error', callback);
		},
		on: function (event, callback) {
			var eventName = eventNameMap[event];
			if (eventName) {
				document.addEventListener(eventName, callback, false);
			}
		},
		off: function (event, callback) {
			var eventName = eventNameMap[event];
			if (eventName) {
				document.removeEventListener(eventName, callback, false);
			}
		},
		raw: fn
	};

	if (!fn) {
		if (isCommonjs) {
			module.exports = {isEnabled: false};
		} else {
			window.screenfull = {isEnabled: false};
		}

		return;
	}

	Object.defineProperties(screenfull, {
		isFullscreen: {
			get: function () {
				return Boolean(document[fn.fullscreenElement]);
			}
		},
		element: {
			enumerable: true,
			get: function () {
				return document[fn.fullscreenElement];
			}
		},
		isEnabled: {
			enumerable: true,
			get: function () {
				// Coerce to boolean in case of old WebKit
				return Boolean(document[fn.fullscreenEnabled]);
			}
		}
	});

	if (isCommonjs) {
		module.exports = screenfull;
	} else {
		window.screenfull = screenfull;
	}
})();


/***/ }),

/***/ 742:
/***/ ((module) => {


module.exports = function () {
  var selection = document.getSelection();
  if (!selection.rangeCount) {
    return function () {};
  }
  var active = document.activeElement;

  var ranges = [];
  for (var i = 0; i < selection.rangeCount; i++) {
    ranges.push(selection.getRangeAt(i));
  }

  switch (active.tagName.toUpperCase()) { // .toUpperCase handles XHTML
    case 'INPUT':
    case 'TEXTAREA':
      active.blur();
      break;

    default:
      active = null;
      break;
  }

  selection.removeAllRanges();
  return function () {
    selection.type === 'Caret' &&
    selection.removeAllRanges();

    if (!selection.rangeCount) {
      ranges.forEach(function(range) {
        selection.addRange(range);
      });
    }

    active &&
    active.focus();
  };
};


/***/ }),

/***/ 534:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
exports.U = {
    // No easing, no acceleration
    linear: function (t) { return t; },
    // Accelerates fast, then slows quickly towards end.
    quadratic: function (t) { return t * (-(t * t) * t + 4 * t * t - 6 * t + 4); },
    // Overshoots over 1 and then returns to 1 towards end.
    cubic: function (t) { return t * (4 * t * t - 9 * t + 6); },
    // Overshoots over 1 multiple times - wiggles around 1.
    elastic: function (t) { return t * (33 * t * t * t * t - 106 * t * t * t + 126 * t * t - 67 * t + 15); },
    // Accelerating from zero velocity
    inQuad: function (t) { return t * t; },
    // Decelerating to zero velocity
    outQuad: function (t) { return t * (2 - t); },
    // Acceleration until halfway, then deceleration
    inOutQuad: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
    // Accelerating from zero velocity
    inCubic: function (t) { return t * t * t; },
    // Decelerating to zero velocity
    outCubic: function (t) { return (--t) * t * t + 1; },
    // Acceleration until halfway, then deceleration
    inOutCubic: function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; },
    // Accelerating from zero velocity
    inQuart: function (t) { return t * t * t * t; },
    // Decelerating to zero velocity
    outQuart: function (t) { return 1 - (--t) * t * t * t; },
    // Acceleration until halfway, then deceleration
    inOutQuart: function (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t; },
    // Accelerating from zero velocity
    inQuint: function (t) { return t * t * t * t * t; },
    // Decelerating to zero velocity
    outQuint: function (t) { return 1 + (--t) * t * t * t * t; },
    // Acceleration until halfway, then deceleration
    inOutQuint: function (t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t; },
    // Accelerating from zero velocity
    inSine: function (t) { return -Math.cos(t * (Math.PI / 2)) + 1; },
    // Decelerating to zero velocity
    outSine: function (t) { return Math.sin(t * (Math.PI / 2)); },
    // Accelerating until halfway, then decelerating
    inOutSine: function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; },
    // Exponential accelerating from zero velocity
    inExpo: function (t) { return Math.pow(2, 10 * (t - 1)); },
    // Exponential decelerating to zero velocity
    outExpo: function (t) { return -Math.pow(2, -10 * t) + 1; },
    // Exponential accelerating until halfway, then decelerating
    inOutExpo: function (t) {
        t /= .5;
        if (t < 1)
            return Math.pow(2, 10 * (t - 1)) / 2;
        t--;
        return (-Math.pow(2, -10 * t) + 2) / 2;
    },
    // Circular accelerating from zero velocity
    inCirc: function (t) { return -Math.sqrt(1 - t * t) + 1; },
    // Circular decelerating to zero velocity Moves VERY fast at the beginning and
    // then quickly slows down in the middle. This tween can actually be used
    // in continuous transitions where target value changes all the time,
    // because of the very quick start, it hides the jitter between target value changes.
    outCirc: function (t) { return Math.sqrt(1 - (t = t - 1) * t); },
    // Circular acceleration until halfway, then deceleration
    inOutCirc: function (t) {
        t /= .5;
        if (t < 1)
            return -(Math.sqrt(1 - t * t) - 1) / 2;
        t -= 2;
        return (Math.sqrt(1 - t * t) + 1) / 2;
    }
};


/***/ }),

/***/ 655:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArray: () => (/* binding */ __spreadArray),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ 24:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__24__;

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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  createBreakpoint: () => (/* reexport */ factory_createBreakpoint),
  createGlobalState: () => (/* reexport */ createGlobalState),
  createMemo: () => (/* reexport */ factory_createMemo),
  createReducer: () => (/* reexport */ factory_createReducer),
  createReducerContext: () => (/* reexport */ factory_createReducerContext),
  createStateContext: () => (/* reexport */ factory_createStateContext),
  ensuredForwardRef: () => (/* reexport */ ensuredForwardRef),
  useAsync: () => (/* reexport */ useAsync),
  useAsyncFn: () => (/* reexport */ useAsyncFn),
  useAsyncRetry: () => (/* reexport */ src_useAsyncRetry),
  useAudio: () => (/* reexport */ src_useAudio),
  useBattery: () => (/* reexport */ src_useBattery),
  useBeforeUnload: () => (/* reexport */ src_useBeforeUnload),
  useBoolean: () => (/* reexport */ useBoolean),
  useClickAway: () => (/* reexport */ src_useClickAway),
  useCookie: () => (/* reexport */ src_useCookie),
  useCopyToClipboard: () => (/* reexport */ src_useCopyToClipboard),
  useCounter: () => (/* reexport */ useCounter),
  useCss: () => (/* reexport */ src_useCss),
  useCustomCompareEffect: () => (/* reexport */ src_useCustomCompareEffect),
  useDebounce: () => (/* reexport */ useDebounce),
  useDeepCompareEffect: () => (/* reexport */ src_useDeepCompareEffect),
  useDefault: () => (/* reexport */ src_useDefault),
  useDrop: () => (/* reexport */ src_useDrop),
  useDropArea: () => (/* reexport */ src_useDropArea),
  useEffectOnce: () => (/* reexport */ src_useEffectOnce),
  useEnsuredForwardedRef: () => (/* reexport */ useEnsuredForwardedRef),
  useError: () => (/* reexport */ src_useError),
  useEvent: () => (/* reexport */ src_useEvent),
  useFavicon: () => (/* reexport */ src_useFavicon),
  useFirstMountState: () => (/* reexport */ useFirstMountState),
  useFullscreen: () => (/* reexport */ src_useFullscreen),
  useGeolocation: () => (/* reexport */ src_useGeolocation),
  useGetSet: () => (/* reexport */ useGetSet),
  useGetSetState: () => (/* reexport */ src_useGetSetState),
  useHarmonicIntervalFn: () => (/* reexport */ src_useHarmonicIntervalFn),
  useHash: () => (/* reexport */ useHash),
  useHover: () => (/* reexport */ src_useHover),
  useHoverDirty: () => (/* reexport */ src_useHoverDirty),
  useIdle: () => (/* reexport */ src_useIdle),
  useIntersection: () => (/* reexport */ src_useIntersection),
  useInterval: () => (/* reexport */ src_useInterval),
  useIsomorphicLayoutEffect: () => (/* reexport */ src_useIsomorphicLayoutEffect),
  useKey: () => (/* reexport */ src_useKey),
  useKeyPress: () => (/* reexport */ src_useKeyPress),
  useKeyPressEvent: () => (/* reexport */ src_useKeyPressEvent),
  useLatest: () => (/* reexport */ src_useLatest),
  useLifecycles: () => (/* reexport */ src_useLifecycles),
  useList: () => (/* reexport */ src_useList),
  useLocalStorage: () => (/* reexport */ src_useLocalStorage),
  useLocation: () => (/* reexport */ useLocation),
  useLockBodyScroll: () => (/* reexport */ useLockBodyScroll),
  useLogger: () => (/* reexport */ src_useLogger),
  useLongPress: () => (/* reexport */ src_useLongPress),
  useMap: () => (/* reexport */ src_useMap),
  useMeasure: () => (/* reexport */ src_useMeasure),
  useMedia: () => (/* reexport */ src_useMedia),
  useMediaDevices: () => (/* reexport */ src_useMediaDevices),
  useMediatedState: () => (/* reexport */ useMediatedState),
  useMethods: () => (/* reexport */ src_useMethods),
  useMotion: () => (/* reexport */ src_useMotion),
  useMount: () => (/* reexport */ src_useMount),
  useMountedState: () => (/* reexport */ useMountedState),
  useMouse: () => (/* reexport */ src_useMouse),
  useMouseHovered: () => (/* reexport */ src_useMouseHovered),
  useMouseWheel: () => (/* reexport */ useMouseWheel),
  useMultiStateValidator: () => (/* reexport */ useMultiStateValidator),
  useNetworkState: () => (/* reexport */ useNetworkState),
  useNumber: () => (/* reexport */ useNumber),
  useObservable: () => (/* reexport */ src_useObservable),
  useOrientation: () => (/* reexport */ src_useOrientation),
  usePageLeave: () => (/* reexport */ src_usePageLeave),
  usePermission: () => (/* reexport */ src_usePermission),
  usePinchZoom: () => (/* reexport */ src_usePinchZoom),
  usePrevious: () => (/* reexport */ usePrevious),
  usePreviousDistinct: () => (/* reexport */ usePreviousDistinct),
  usePromise: () => (/* reexport */ src_usePromise),
  useQueue: () => (/* reexport */ src_useQueue),
  useRaf: () => (/* reexport */ src_useRaf),
  useRafLoop: () => (/* reexport */ useRafLoop),
  useRafState: () => (/* reexport */ src_useRafState),
  useRendersCount: () => (/* reexport */ useRendersCount),
  useScratch: () => (/* reexport */ src_useScratch),
  useScroll: () => (/* reexport */ src_useScroll),
  useScrollbarWidth: () => (/* reexport */ useScrollbarWidth),
  useScrolling: () => (/* reexport */ src_useScrolling),
  useSearchParam: () => (/* reexport */ src_useSearchParam),
  useSessionStorage: () => (/* reexport */ src_useSessionStorage),
  useSet: () => (/* reexport */ src_useSet),
  useSetState: () => (/* reexport */ src_useSetState),
  useShallowCompareEffect: () => (/* reexport */ src_useShallowCompareEffect),
  useSize: () => (/* reexport */ src_useSize),
  useSlider: () => (/* reexport */ src_useSlider),
  useSpeech: () => (/* reexport */ src_useSpeech),
  useStartTyping: () => (/* reexport */ src_useStartTyping),
  useStateList: () => (/* reexport */ useStateList),
  useStateValidator: () => (/* reexport */ useStateValidator),
  useStateWithHistory: () => (/* reexport */ useStateWithHistory),
  useThrottle: () => (/* reexport */ src_useThrottle),
  useThrottleFn: () => (/* reexport */ src_useThrottleFn),
  useTimeout: () => (/* reexport */ useTimeout),
  useTimeoutFn: () => (/* reexport */ useTimeoutFn),
  useTitle: () => (/* reexport */ src_useTitle),
  useToggle: () => (/* reexport */ src_useToggle),
  useTween: () => (/* reexport */ src_useTween),
  useUnmount: () => (/* reexport */ src_useUnmount),
  useUnmountPromise: () => (/* reexport */ src_useUnmountPromise),
  useUpdate: () => (/* reexport */ useUpdate),
  useUpdateEffect: () => (/* reexport */ src_useUpdateEffect),
  useUpsert: () => (/* reexport */ useUpsert),
  useVibrate: () => (/* reexport */ src_useVibrate),
  useVideo: () => (/* reexport */ src_useVideo),
  useWindowScroll: () => (/* reexport */ src_useWindowScroll),
  useWindowSize: () => (/* reexport */ src_useWindowSize)
});

// EXTERNAL MODULE: external "React"
var external_React_ = __webpack_require__(24);
;// CONCATENATED MODULE: ./src/factory/createMemo.ts

const createMemo = (fn) => (...args) => (0,external_React_.useMemo)(() => fn(...args), args);
/* harmony default export */ const factory_createMemo = (createMemo);

;// CONCATENATED MODULE: ./src/factory/createReducerContext.ts

const createReducerContext = (reducer, defaultInitialState) => {
    const context = (0,external_React_.createContext)(undefined);
    const providerFactory = (props, children) => (0,external_React_.createElement)(context.Provider, props, children);
    const ReducerProvider = ({ children, initialState, }) => {
        const state = (0,external_React_.useReducer)(reducer, initialState !== undefined ? initialState : defaultInitialState);
        return providerFactory({ value: state }, children);
    };
    const useReducerContext = () => {
        const state = (0,external_React_.useContext)(context);
        if (state == null) {
            throw new Error(`useReducerContext must be used inside a ReducerProvider.`);
        }
        return state;
    };
    return [useReducerContext, ReducerProvider, context];
};
/* harmony default export */ const factory_createReducerContext = (createReducerContext);

;// CONCATENATED MODULE: ./src/useFirstMountState.ts

function useFirstMountState() {
    const isFirst = (0,external_React_.useRef)(true);
    if (isFirst.current) {
        isFirst.current = false;
        return true;
    }
    return isFirst.current;
}

;// CONCATENATED MODULE: ./src/useUpdateEffect.ts


const useUpdateEffect = (effect, deps) => {
    const isFirstMount = useFirstMountState();
    (0,external_React_.useEffect)(() => {
        if (!isFirstMount) {
            return effect();
        }
    }, deps);
};
/* harmony default export */ const src_useUpdateEffect = (useUpdateEffect);

;// CONCATENATED MODULE: ./src/factory/createReducer.ts


function composeMiddleware(chain) {
    return (context, dispatch) => {
        return chain.reduceRight((res, middleware) => {
            return middleware(context)(res);
        }, dispatch);
    };
}
const createReducer = (...middlewares) => {
    const composedMiddleware = composeMiddleware(middlewares);
    return (reducer, initialState, initializer = (value) => value) => {
        const ref = (0,external_React_.useRef)(initializer(initialState));
        const [, setState] = (0,external_React_.useState)(ref.current);
        const dispatch = (0,external_React_.useCallback)((action) => {
            ref.current = reducer(ref.current, action);
            setState(ref.current);
            return action;
        }, [reducer]);
        const dispatchRef = (0,external_React_.useRef)(composedMiddleware({
            getState: () => ref.current,
            dispatch: (...args) => dispatchRef.current(...args),
        }, dispatch));
        src_useUpdateEffect(() => {
            dispatchRef.current = composedMiddleware({
                getState: () => ref.current,
                dispatch: (...args) => dispatchRef.current(...args),
            }, dispatch);
        }, [dispatch]);
        return [ref.current, dispatchRef.current];
    };
};
/* harmony default export */ const factory_createReducer = (createReducer);

;// CONCATENATED MODULE: ./src/factory/createStateContext.ts

const createStateContext = (defaultInitialValue) => {
    const context = (0,external_React_.createContext)(undefined);
    const providerFactory = (props, children) => (0,external_React_.createElement)(context.Provider, props, children);
    const StateProvider = ({ children, initialValue, }) => {
        const state = (0,external_React_.useState)(initialValue !== undefined ? initialValue : defaultInitialValue);
        return providerFactory({ value: state }, children);
    };
    const useStateContext = () => {
        const state = (0,external_React_.useContext)(context);
        if (state == null) {
            throw new Error(`useStateContext must be used inside a StateProvider.`);
        }
        return state;
    };
    return [useStateContext, StateProvider, context];
};
/* harmony default export */ const factory_createStateContext = (createStateContext);

;// CONCATENATED MODULE: ./src/useMountedState.ts

function useMountedState() {
    const mountedRef = (0,external_React_.useRef)(false);
    const get = (0,external_React_.useCallback)(() => mountedRef.current, []);
    (0,external_React_.useEffect)(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);
    return get;
}

;// CONCATENATED MODULE: ./src/useAsyncFn.ts


function useAsyncFn(fn, deps = [], initialState = { loading: false }) {
    const lastCallId = (0,external_React_.useRef)(0);
    const isMounted = useMountedState();
    const [state, set] = (0,external_React_.useState)(initialState);
    const callback = (0,external_React_.useCallback)((...args) => {
        const callId = ++lastCallId.current;
        if (!state.loading) {
            set((prevState) => ({ ...prevState, loading: true }));
        }
        return fn(...args).then((value) => {
            isMounted() && callId === lastCallId.current && set({ value, loading: false });
            return value;
        }, (error) => {
            isMounted() && callId === lastCallId.current && set({ error, loading: false });
            return error;
        });
    }, deps);
    return [state, callback];
}

;// CONCATENATED MODULE: ./src/useAsync.ts


function useAsync(fn, deps = []) {
    const [state, callback] = useAsyncFn(fn, deps, {
        loading: true,
    });
    (0,external_React_.useEffect)(() => {
        callback();
    }, [callback]);
    return state;
}

;// CONCATENATED MODULE: ./src/useAsyncRetry.ts


const useAsyncRetry = (fn, deps = []) => {
    const [attempt, setAttempt] = (0,external_React_.useState)(0);
    const state = useAsync(fn, [...deps, attempt]);
    const stateLoading = state.loading;
    const retry = (0,external_React_.useCallback)(() => {
        if (stateLoading) {
            if (false) {}
            return;
        }
        setAttempt((currentAttempt) => currentAttempt + 1);
    }, [...deps, stateLoading]);
    return { ...state, retry };
};
/* harmony default export */ const src_useAsyncRetry = (useAsyncRetry);

;// CONCATENATED MODULE: ./src/useSetState.ts

const useSetState = (initialState = {}) => {
    const [state, set] = (0,external_React_.useState)(initialState);
    const setState = (0,external_React_.useCallback)((patch) => {
        set((prevState) => Object.assign({}, prevState, patch instanceof Function ? patch(prevState) : patch));
    }, []);
    return [state, setState];
};
/* harmony default export */ const src_useSetState = (useSetState);

;// CONCATENATED MODULE: ./src/misc/parseTimeRanges.ts
function parseTimeRanges(ranges) {
    const result = [];
    for (let i = 0; i < ranges.length; i++) {
        result.push({
            start: ranges.start(i),
            end: ranges.end(i),
        });
    }
    return result;
}

;// CONCATENATED MODULE: ./src/factory/createHTMLMediaHook.ts




function createHTMLMediaHook(tag) {
    return (elOrProps) => {
        let element;
        let props;
        if (external_React_.isValidElement(elOrProps)) {
            element = elOrProps;
            props = element.props;
        }
        else {
            props = elOrProps;
        }
        const [state, setState] = src_useSetState({
            buffered: [],
            time: 0,
            duration: 0,
            paused: true,
            muted: false,
            volume: 1,
            playing: false,
        });
        const ref = (0,external_React_.useRef)(null);
        const wrapEvent = (userEvent, proxyEvent) => {
            return (event) => {
                try {
                    proxyEvent && proxyEvent(event);
                }
                finally {
                    userEvent && userEvent(event);
                }
            };
        };
        const onPlay = () => setState({ paused: false });
        const onPlaying = () => setState({ playing: true });
        const onWaiting = () => setState({ playing: false });
        const onPause = () => setState({ paused: true, playing: false });
        const onVolumeChange = () => {
            const el = ref.current;
            if (!el) {
                return;
            }
            setState({
                muted: el.muted,
                volume: el.volume,
            });
        };
        const onDurationChange = () => {
            const el = ref.current;
            if (!el) {
                return;
            }
            const { duration, buffered } = el;
            setState({
                duration,
                buffered: parseTimeRanges(buffered),
            });
        };
        const onTimeUpdate = () => {
            const el = ref.current;
            if (!el) {
                return;
            }
            setState({ time: el.currentTime });
        };
        const onProgress = () => {
            const el = ref.current;
            if (!el) {
                return;
            }
            setState({ buffered: parseTimeRanges(el.buffered) });
        };
        if (element) {
            element = external_React_.cloneElement(element, {
                controls: false,
                ...props,
                ref,
                onPlay: wrapEvent(props.onPlay, onPlay),
                onPlaying: wrapEvent(props.onPlaying, onPlaying),
                onWaiting: wrapEvent(props.onWaiting, onWaiting),
                onPause: wrapEvent(props.onPause, onPause),
                onVolumeChange: wrapEvent(props.onVolumeChange, onVolumeChange),
                onDurationChange: wrapEvent(props.onDurationChange, onDurationChange),
                onTimeUpdate: wrapEvent(props.onTimeUpdate, onTimeUpdate),
                onProgress: wrapEvent(props.onProgress, onProgress),
            });
        }
        else {
            element = external_React_.createElement(tag, {
                controls: false,
                ...props,
                ref,
                onPlay: wrapEvent(props.onPlay, onPlay),
                onPlaying: wrapEvent(props.onPlaying, onPlaying),
                onWaiting: wrapEvent(props.onWaiting, onWaiting),
                onPause: wrapEvent(props.onPause, onPause),
                onVolumeChange: wrapEvent(props.onVolumeChange, onVolumeChange),
                onDurationChange: wrapEvent(props.onDurationChange, onDurationChange),
                onTimeUpdate: wrapEvent(props.onTimeUpdate, onTimeUpdate),
                onProgress: wrapEvent(props.onProgress, onProgress),
            }); // TODO: fix this typing.
        }
        // Some browsers return `Promise` on `.play()` and may throw errors
        // if one tries to execute another `.play()` or `.pause()` while that
        // promise is resolving. So we prevent that with this lock.
        // See: https://bugs.chromium.org/p/chromium/issues/detail?id=593273
        let lockPlay = false;
        const controls = {
            play: () => {
                const el = ref.current;
                if (!el) {
                    return undefined;
                }
                if (!lockPlay) {
                    const promise = el.play();
                    const isPromise = typeof promise === 'object';
                    if (isPromise) {
                        lockPlay = true;
                        const resetLock = () => {
                            lockPlay = false;
                        };
                        promise.then(resetLock, resetLock);
                    }
                    return promise;
                }
                return undefined;
            },
            pause: () => {
                const el = ref.current;
                if (el && !lockPlay) {
                    return el.pause();
                }
            },
            seek: (time) => {
                const el = ref.current;
                if (!el || state.duration === undefined) {
                    return;
                }
                time = Math.min(state.duration, Math.max(0, time));
                el.currentTime = time;
            },
            volume: (volume) => {
                const el = ref.current;
                if (!el) {
                    return;
                }
                volume = Math.min(1, Math.max(0, volume));
                el.volume = volume;
                setState({ volume });
            },
            mute: () => {
                const el = ref.current;
                if (!el) {
                    return;
                }
                el.muted = true;
            },
            unmute: () => {
                const el = ref.current;
                if (!el) {
                    return;
                }
                el.muted = false;
            },
        };
        (0,external_React_.useEffect)(() => {
            const el = ref.current;
            if (!el) {
                if (false) {}
                return;
            }
            setState({
                volume: el.volume,
                muted: el.muted,
                paused: el.paused,
            });
            // Start media, if autoPlay requested.
            if (props.autoPlay && el.paused) {
                controls.play();
            }
        }, [props.src]);
        return [element, state, controls, ref];
    };
}

;// CONCATENATED MODULE: ./src/useAudio.ts

const useAudio = createHTMLMediaHook('audio');
/* harmony default export */ const src_useAudio = (useAudio);

;// CONCATENATED MODULE: ./src/misc/util.ts
const noop = () => { };
function on(obj, ...args) {
    if (obj && obj.addEventListener) {
        obj.addEventListener(...args);
    }
}
function off(obj, ...args) {
    if (obj && obj.removeEventListener) {
        obj.removeEventListener(...args);
    }
}
const isBrowser = typeof window !== 'undefined';
const isNavigator = typeof navigator !== 'undefined';

// EXTERNAL MODULE: ./node_modules/fast-deep-equal/react.js
var react = __webpack_require__(252);
var react_default = /*#__PURE__*/__webpack_require__.n(react);
;// CONCATENATED MODULE: ./src/misc/isDeepEqual.ts

/* harmony default export */ const isDeepEqual = ((react_default()));

;// CONCATENATED MODULE: ./src/useBattery.ts



const nav = isNavigator ? navigator : undefined;
const isBatteryApiSupported = nav && typeof nav.getBattery === 'function';
function useBatteryMock() {
    return { isSupported: false };
}
function useBattery() {
    const [state, setState] = (0,external_React_.useState)({ isSupported: true, fetched: false });
    (0,external_React_.useEffect)(() => {
        let isMounted = true;
        let battery = null;
        const handleChange = () => {
            if (!isMounted || !battery) {
                return;
            }
            const newState = {
                isSupported: true,
                fetched: true,
                level: battery.level,
                charging: battery.charging,
                dischargingTime: battery.dischargingTime,
                chargingTime: battery.chargingTime,
            };
            !isDeepEqual(state, newState) && setState(newState);
        };
        nav.getBattery().then((bat) => {
            if (!isMounted) {
                return;
            }
            battery = bat;
            on(battery, 'chargingchange', handleChange);
            on(battery, 'chargingtimechange', handleChange);
            on(battery, 'dischargingtimechange', handleChange);
            on(battery, 'levelchange', handleChange);
            handleChange();
        });
        return () => {
            isMounted = false;
            if (battery) {
                off(battery, 'chargingchange', handleChange);
                off(battery, 'chargingtimechange', handleChange);
                off(battery, 'dischargingtimechange', handleChange);
                off(battery, 'levelchange', handleChange);
            }
        };
    }, []);
    return state;
}
/* harmony default export */ const src_useBattery = (isBatteryApiSupported ? useBattery : useBatteryMock);

;// CONCATENATED MODULE: ./src/useBeforeUnload.ts


const useBeforeUnload = (enabled = true, message) => {
    const handler = (0,external_React_.useCallback)((event) => {
        const finalEnabled = typeof enabled === 'function' ? enabled() : true;
        if (!finalEnabled) {
            return;
        }
        event.preventDefault();
        if (message) {
            event.returnValue = message;
        }
        return message;
    }, [enabled, message]);
    (0,external_React_.useEffect)(() => {
        if (!enabled) {
            return;
        }
        on(window, 'beforeunload', handler);
        return () => off(window, 'beforeunload', handler);
    }, [enabled, handler]);
};
/* harmony default export */ const src_useBeforeUnload = (useBeforeUnload);

;// CONCATENATED MODULE: ./src/useToggle.ts

const toggleReducer = (state, nextValue) => typeof nextValue === 'boolean' ? nextValue : !state;
const useToggle = (initialValue) => {
    return (0,external_React_.useReducer)(toggleReducer, initialValue);
};
/* harmony default export */ const src_useToggle = (useToggle);

;// CONCATENATED MODULE: ./src/useBoolean.ts

/* harmony default export */ const useBoolean = (src_useToggle);

;// CONCATENATED MODULE: ./src/useClickAway.ts


const defaultEvents = ['mousedown', 'touchstart'];
const useClickAway = (ref, onClickAway, events = defaultEvents) => {
    const savedCallback = (0,external_React_.useRef)(onClickAway);
    (0,external_React_.useEffect)(() => {
        savedCallback.current = onClickAway;
    }, [onClickAway]);
    (0,external_React_.useEffect)(() => {
        const handler = (event) => {
            const { current: el } = ref;
            el && !el.contains(event.target) && savedCallback.current(event);
        };
        for (const eventName of events) {
            on(document, eventName, handler);
        }
        return () => {
            for (const eventName of events) {
                off(document, eventName, handler);
            }
        };
    }, [events, ref]);
};
/* harmony default export */ const src_useClickAway = (useClickAway);

// EXTERNAL MODULE: ./node_modules/js-cookie/src/js.cookie.js
var js_cookie = __webpack_require__(808);
var js_cookie_default = /*#__PURE__*/__webpack_require__.n(js_cookie);
;// CONCATENATED MODULE: ./src/useCookie.ts


const useCookie = (cookieName) => {
    const [value, setValue] = (0,external_React_.useState)(() => js_cookie_default().get(cookieName) || null);
    const updateCookie = (0,external_React_.useCallback)((newValue, options) => {
        js_cookie_default().set(cookieName, newValue, options);
        setValue(newValue);
    }, [cookieName]);
    const deleteCookie = (0,external_React_.useCallback)(() => {
        js_cookie_default().remove(cookieName);
        setValue(null);
    }, [cookieName]);
    return [value, updateCookie, deleteCookie];
};
/* harmony default export */ const src_useCookie = (useCookie);

// EXTERNAL MODULE: ./node_modules/copy-to-clipboard/index.js
var copy_to_clipboard = __webpack_require__(640);
var copy_to_clipboard_default = /*#__PURE__*/__webpack_require__.n(copy_to_clipboard);
;// CONCATENATED MODULE: ./src/useCopyToClipboard.ts




const useCopyToClipboard = () => {
    const isMounted = useMountedState();
    const [state, setState] = src_useSetState({
        value: undefined,
        error: undefined,
        noUserInteraction: true,
    });
    const copyToClipboard = (0,external_React_.useCallback)((value) => {
        if (!isMounted()) {
            return;
        }
        let noUserInteraction;
        let normalizedValue;
        try {
            // only strings and numbers casted to strings can be copied to clipboard
            if (typeof value !== 'string' && typeof value !== 'number') {
                const error = new Error(`Cannot copy typeof ${typeof value} to clipboard, must be a string`);
                if (false)
                    {}
                setState({
                    value,
                    error,
                    noUserInteraction: true,
                });
                return;
            }
            // empty strings are also considered invalid
            else if (value === '') {
                const error = new Error(`Cannot copy empty string to clipboard.`);
                if (false)
                    {}
                setState({
                    value,
                    error,
                    noUserInteraction: true,
                });
                return;
            }
            normalizedValue = value.toString();
            noUserInteraction = copy_to_clipboard_default()(normalizedValue);
            setState({
                value: normalizedValue,
                error: undefined,
                noUserInteraction,
            });
        }
        catch (error) {
            setState({
                value: normalizedValue,
                error,
                noUserInteraction,
            });
        }
    }, []);
    return [state, copyToClipboard];
};
/* harmony default export */ const src_useCopyToClipboard = (useCopyToClipboard);

;// CONCATENATED MODULE: ./src/useUpdate.ts

const updateReducer = (num) => (num + 1) % 1000000;
function useUpdate() {
    const [, update] = (0,external_React_.useReducer)(updateReducer, 0);
    return update;
}

;// CONCATENATED MODULE: ./src/misc/hookState.ts
function resolveHookState(nextState, currentState) {
    if (typeof nextState === 'function') {
        return nextState.length ? nextState(currentState) : nextState();
    }
    return nextState;
}

;// CONCATENATED MODULE: ./src/useGetSet.ts



function useGetSet(initialState) {
    const state = (0,external_React_.useRef)(resolveHookState(initialState));
    const update = useUpdate();
    return (0,external_React_.useMemo)(() => [
        () => state.current,
        (newState) => {
            state.current = resolveHookState(newState, state.current);
            update();
        },
    ], []);
}

;// CONCATENATED MODULE: ./src/useCounter.ts



function useCounter(initialValue = 0, max = null, min = null) {
    let init = resolveHookState(initialValue);
    typeof init !== 'number' &&
        console.error('initialValue has to be a number, got ' + typeof initialValue);
    if (typeof min === 'number') {
        init = Math.max(init, min);
    }
    else if (min !== null) {
        console.error('min has to be a number, got ' + typeof min);
    }
    if (typeof max === 'number') {
        init = Math.min(init, max);
    }
    else if (max !== null) {
        console.error('max has to be a number, got ' + typeof max);
    }
    const [get, setInternal] = useGetSet(init);
    return [
        get(),
        (0,external_React_.useMemo)(() => {
            const set = (newState) => {
                const prevState = get();
                let rState = resolveHookState(newState, prevState);
                if (prevState !== rState) {
                    if (typeof min === 'number') {
                        rState = Math.max(rState, min);
                    }
                    if (typeof max === 'number') {
                        rState = Math.min(rState, max);
                    }
                    prevState !== rState && setInternal(rState);
                }
            };
            return {
                get,
                set,
                inc: (delta = 1) => {
                    const rDelta = resolveHookState(delta, get());
                    if (typeof rDelta !== 'number') {
                        console.error('delta has to be a number or function returning a number, got ' + typeof rDelta);
                    }
                    set((num) => num + rDelta);
                },
                dec: (delta = 1) => {
                    const rDelta = resolveHookState(delta, get());
                    if (typeof rDelta !== 'number') {
                        console.error('delta has to be a number or function returning a number, got ' + typeof rDelta);
                    }
                    set((num) => num - rDelta);
                },
                reset: (value = init) => {
                    const rValue = resolveHookState(value, get());
                    if (typeof rValue !== 'number') {
                        console.error('value has to be a number or function returning a number, got ' + typeof rValue);
                    }
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    init = rValue;
                    set(rValue);
                },
            };
        }, [init, min, max]),
    ];
}

// EXTERNAL MODULE: ./node_modules/nano-css/index.js
var nano_css = __webpack_require__(818);
// EXTERNAL MODULE: ./node_modules/nano-css/addon/cssom.js
var cssom = __webpack_require__(142);
// EXTERNAL MODULE: ./node_modules/nano-css/addon/vcssom.js
var vcssom = __webpack_require__(99);
// EXTERNAL MODULE: ./node_modules/nano-css/addon/vcssom/cssToTree.js
var cssToTree = __webpack_require__(749);
;// CONCATENATED MODULE: ./src/useIsomorphicLayoutEffect.ts


const useIsomorphicLayoutEffect = isBrowser ? external_React_.useLayoutEffect : external_React_.useEffect;
/* harmony default export */ const src_useIsomorphicLayoutEffect = (useIsomorphicLayoutEffect);

;// CONCATENATED MODULE: ./src/useCss.ts






const nano = (0,nano_css/* create */.U)();
(0,cssom/* addon */.I)(nano);
(0,vcssom/* addon */.I)(nano);
let counter = 0;
const useCss = (css) => {
    const className = (0,external_React_.useMemo)(() => 'react-use-css-' + (counter++).toString(36), []);
    const sheet = (0,external_React_.useMemo)(() => new nano.VSheet(), []);
    src_useIsomorphicLayoutEffect(() => {
        const tree = {};
        (0,cssToTree/* cssToTree */.z)(tree, css, '.' + className, '');
        sheet.diff(tree);
        return () => {
            sheet.diff({});
        };
    });
    return className;
};
/* harmony default export */ const src_useCss = (useCss);

;// CONCATENATED MODULE: ./src/useCustomCompareEffect.ts

const isPrimitive = (val) => val !== Object(val);
const useCustomCompareEffect = (effect, deps, depsEqual) => {
    if (false) {}
    const ref = (0,external_React_.useRef)(undefined);
    if (!ref.current || !depsEqual(deps, ref.current)) {
        ref.current = deps;
    }
    (0,external_React_.useEffect)(effect, ref.current);
};
/* harmony default export */ const src_useCustomCompareEffect = (useCustomCompareEffect);

;// CONCATENATED MODULE: ./src/useTimeoutFn.ts

function useTimeoutFn(fn, ms = 0) {
    const ready = (0,external_React_.useRef)(false);
    const timeout = (0,external_React_.useRef)();
    const callback = (0,external_React_.useRef)(fn);
    const isReady = (0,external_React_.useCallback)(() => ready.current, []);
    const set = (0,external_React_.useCallback)(() => {
        ready.current = false;
        timeout.current && clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            ready.current = true;
            callback.current();
        }, ms);
    }, [ms]);
    const clear = (0,external_React_.useCallback)(() => {
        ready.current = null;
        timeout.current && clearTimeout(timeout.current);
    }, []);
    // update ref when function changes
    (0,external_React_.useEffect)(() => {
        callback.current = fn;
    }, [fn]);
    // set on mount, clear on unmount
    (0,external_React_.useEffect)(() => {
        set();
        return clear;
    }, [ms]);
    return [isReady, clear, set];
}

;// CONCATENATED MODULE: ./src/useDebounce.ts


function useDebounce(fn, ms = 0, deps = []) {
    const [isReady, cancel, reset] = useTimeoutFn(fn, ms);
    (0,external_React_.useEffect)(reset, deps);
    return [isReady, cancel];
}

;// CONCATENATED MODULE: ./src/useDeepCompareEffect.ts


const useDeepCompareEffect_isPrimitive = (val) => val !== Object(val);
const useDeepCompareEffect = (effect, deps) => {
    if (false) {}
    src_useCustomCompareEffect(effect, deps, isDeepEqual);
};
/* harmony default export */ const src_useDeepCompareEffect = (useDeepCompareEffect);

;// CONCATENATED MODULE: ./src/useDefault.ts

const useDefault = (defaultValue, initialValue) => {
    const [value, setValue] = (0,external_React_.useState)(initialValue);
    if (value === undefined || value === null) {
        return [defaultValue, setValue];
    }
    return [value, setValue];
};
/* harmony default export */ const src_useDefault = (useDefault);

;// CONCATENATED MODULE: ./src/useDrop.ts


const createProcess = (options) => (dataTransfer, event) => {
    const uri = dataTransfer.getData('text/uri-list');
    if (uri) {
        (options.onUri || noop)(uri, event);
        return;
    }
    if (dataTransfer.files && dataTransfer.files.length) {
        (options.onFiles || noop)(Array.from(dataTransfer.files), event);
        return;
    }
    if (event.clipboardData) {
        const text = event.clipboardData.getData('text');
        (options.onText || noop)(text, event);
        return;
    }
};
const useDrop = (options = {}, args = []) => {
    const { onFiles, onText, onUri } = options;
    const [over, setOverRaw] = (0,external_React_.useState)(false);
    const setOver = (0,external_React_.useCallback)(setOverRaw, []);
    const process = (0,external_React_.useMemo)(() => createProcess(options), [onFiles, onText, onUri]);
    (0,external_React_.useEffect)(() => {
        const onDragOver = (event) => {
            event.preventDefault();
            setOver(true);
        };
        const onDragEnter = (event) => {
            event.preventDefault();
            setOver(true);
        };
        const onDragLeave = () => {
            setOver(false);
        };
        const onDragExit = () => {
            setOver(false);
        };
        const onDrop = (event) => {
            event.preventDefault();
            setOver(false);
            process(event.dataTransfer, event);
        };
        const onPaste = (event) => {
            process(event.clipboardData, event);
        };
        on(document, 'dragover', onDragOver);
        on(document, 'dragenter', onDragEnter);
        on(document, 'dragleave', onDragLeave);
        on(document, 'dragexit', onDragExit);
        on(document, 'drop', onDrop);
        if (onText) {
            on(document, 'paste', onPaste);
        }
        return () => {
            off(document, 'dragover', onDragOver);
            off(document, 'dragenter', onDragEnter);
            off(document, 'dragleave', onDragLeave);
            off(document, 'dragexit', onDragExit);
            off(document, 'drop', onDrop);
            off(document, 'paste', onPaste);
        };
    }, [process, ...args]);
    return { over };
};
/* harmony default export */ const src_useDrop = (useDrop);

;// CONCATENATED MODULE: ./src/useDropArea.ts



/*
const defaultState: DropAreaState = {
  over: false,
};
*/
const useDropArea_createProcess = (options, mounted) => (dataTransfer, event) => {
    const uri = dataTransfer.getData('text/uri-list');
    if (uri) {
        (options.onUri || noop)(uri, event);
        return;
    }
    if (dataTransfer.files && dataTransfer.files.length) {
        (options.onFiles || noop)(Array.from(dataTransfer.files), event);
        return;
    }
    if (dataTransfer.items && dataTransfer.items.length) {
        dataTransfer.items[0].getAsString((text) => {
            if (mounted) {
                (options.onText || noop)(text, event);
            }
        });
    }
};
const createBond = (process, setOver) => ({
    onDragOver: (event) => {
        event.preventDefault();
    },
    onDragEnter: (event) => {
        event.preventDefault();
        setOver(true);
    },
    onDragLeave: () => {
        setOver(false);
    },
    onDrop: (event) => {
        event.preventDefault();
        event.persist();
        setOver(false);
        process(event.dataTransfer, event);
    },
    onPaste: (event) => {
        event.persist();
        process(event.clipboardData, event);
    },
});
const useDropArea = (options = {}) => {
    const { onFiles, onText, onUri } = options;
    const isMounted = useMountedState();
    const [over, setOver] = (0,external_React_.useState)(false);
    const process = (0,external_React_.useMemo)(() => useDropArea_createProcess(options, isMounted()), [onFiles, onText, onUri]);
    const bond = (0,external_React_.useMemo)(() => createBond(process, setOver), [process, setOver]);
    return [bond, { over }];
};
/* harmony default export */ const src_useDropArea = (useDropArea);

;// CONCATENATED MODULE: ./src/useEffectOnce.ts

const useEffectOnce = (effect) => {
    (0,external_React_.useEffect)(effect, []);
};
/* harmony default export */ const src_useEffectOnce = (useEffectOnce);

;// CONCATENATED MODULE: ./src/useEnsuredForwardedRef.ts

function useEnsuredForwardedRef(forwardedRef) {
    const ensuredRef = (0,external_React_.useRef)(forwardedRef && forwardedRef.current);
    (0,external_React_.useEffect)(() => {
        if (!forwardedRef) {
            return;
        }
        forwardedRef.current = ensuredRef.current;
    }, [forwardedRef]);
    return ensuredRef;
}
function ensuredForwardRef(Component) {
    return (0,external_React_.forwardRef)((props, ref) => {
        const ensuredRef = useEnsuredForwardedRef(ref);
        return Component(props, ensuredRef);
    });
}

;// CONCATENATED MODULE: ./src/useEvent.ts


const defaultTarget = isBrowser ? window : null;
const isListenerType1 = (target) => {
    return !!target.addEventListener;
};
const isListenerType2 = (target) => {
    return !!target.on;
};
const useEvent = (name, handler, target = defaultTarget, options) => {
    (0,external_React_.useEffect)(() => {
        if (!handler) {
            return;
        }
        if (!target) {
            return;
        }
        if (isListenerType1(target)) {
            on(target, name, handler, options);
        }
        else if (isListenerType2(target)) {
            target.on(name, handler, options);
        }
        return () => {
            if (isListenerType1(target)) {
                off(target, name, handler, options);
            }
            else if (isListenerType2(target)) {
                target.off(name, handler, options);
            }
        };
    }, [name, handler, target, JSON.stringify(options)]);
};
/* harmony default export */ const src_useEvent = (useEvent);

;// CONCATENATED MODULE: ./src/useError.ts

const useError = () => {
    const [error, setError] = (0,external_React_.useState)(null);
    (0,external_React_.useEffect)(() => {
        if (error) {
            throw error;
        }
    }, [error]);
    const dispatchError = (0,external_React_.useCallback)((err) => {
        setError(err);
    }, []);
    return dispatchError;
};
/* harmony default export */ const src_useError = (useError);

;// CONCATENATED MODULE: ./src/useFavicon.ts

const useFavicon = (href) => {
    (0,external_React_.useEffect)(() => {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = href;
        document.getElementsByTagName('head')[0].appendChild(link);
    }, [href]);
};
/* harmony default export */ const src_useFavicon = (useFavicon);

// EXTERNAL MODULE: ./node_modules/screenfull/dist/screenfull.js
var screenfull = __webpack_require__(577);
var screenfull_default = /*#__PURE__*/__webpack_require__.n(screenfull);
;// CONCATENATED MODULE: ./src/useFullscreen.ts




const useFullscreen = (ref, enabled, options = {}) => {
    const { video, onClose = noop } = options;
    const [isFullscreen, setIsFullscreen] = (0,external_React_.useState)(enabled);
    src_useIsomorphicLayoutEffect(() => {
        if (!enabled) {
            return;
        }
        if (!ref.current) {
            return;
        }
        const onWebkitEndFullscreen = () => {
            if (video?.current) {
                off(video.current, 'webkitendfullscreen', onWebkitEndFullscreen);
            }
            onClose();
        };
        const onChange = () => {
            if ((screenfull_default()).isEnabled) {
                const isScreenfullFullscreen = (screenfull_default()).isFullscreen;
                setIsFullscreen(isScreenfullFullscreen);
                if (!isScreenfullFullscreen) {
                    onClose();
                }
            }
        };
        if ((screenfull_default()).isEnabled) {
            try {
                screenfull_default().request(ref.current);
                setIsFullscreen(true);
            }
            catch (error) {
                onClose(error);
                setIsFullscreen(false);
            }
            screenfull_default().on('change', onChange);
        }
        else if (video && video.current && video.current.webkitEnterFullscreen) {
            video.current.webkitEnterFullscreen();
            on(video.current, 'webkitendfullscreen', onWebkitEndFullscreen);
            setIsFullscreen(true);
        }
        else {
            onClose();
            setIsFullscreen(false);
        }
        return () => {
            setIsFullscreen(false);
            if ((screenfull_default()).isEnabled) {
                try {
                    screenfull_default().off('change', onChange);
                    screenfull_default().exit();
                }
                catch { }
            }
            else if (video && video.current && video.current.webkitExitFullscreen) {
                off(video.current, 'webkitendfullscreen', onWebkitEndFullscreen);
                video.current.webkitExitFullscreen();
            }
        };
    }, [enabled, video, ref]);
    return isFullscreen;
};
/* harmony default export */ const src_useFullscreen = (useFullscreen);

;// CONCATENATED MODULE: ./src/useGeolocation.ts

const useGeolocation = (options) => {
    const [state, setState] = (0,external_React_.useState)({
        loading: true,
        accuracy: null,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: null,
        longitude: null,
        speed: null,
        timestamp: Date.now(),
    });
    let mounted = true;
    let watchId;
    const onEvent = (event) => {
        if (mounted) {
            setState({
                loading: false,
                accuracy: event.coords.accuracy,
                altitude: event.coords.altitude,
                altitudeAccuracy: event.coords.altitudeAccuracy,
                heading: event.coords.heading,
                latitude: event.coords.latitude,
                longitude: event.coords.longitude,
                speed: event.coords.speed,
                timestamp: event.timestamp,
            });
        }
    };
    const onEventError = (error) => mounted && setState((oldState) => ({ ...oldState, loading: false, error }));
    (0,external_React_.useEffect)(() => {
        navigator.geolocation.getCurrentPosition(onEvent, onEventError, options);
        watchId = navigator.geolocation.watchPosition(onEvent, onEventError, options);
        return () => {
            mounted = false;
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);
    return state;
};
/* harmony default export */ const src_useGeolocation = (useGeolocation);

;// CONCATENATED MODULE: ./src/useGetSetState.ts


const useGetSetState = (initialState = {}) => {
    if (false) {}
    const update = useUpdate();
    const state = (0,external_React_.useRef)({ ...initialState });
    const get = (0,external_React_.useCallback)(() => state.current, []);
    const set = (0,external_React_.useCallback)((patch) => {
        if (!patch) {
            return;
        }
        if (false) {}
        Object.assign(state.current, patch);
        update();
    }, []);
    return [get, set];
};
/* harmony default export */ const src_useGetSetState = (useGetSetState);

;// CONCATENATED MODULE: ./node_modules/set-harmonic-interval/lib/index.esm.js
var index_esm_counter = 0;
var buckets = {};
var setHarmonicInterval = function (fn, ms) {
    var _a;
    var id = index_esm_counter++;
    if (buckets[ms]) {
        buckets[ms].listeners[id] = fn;
    }
    else {
        var timer = setInterval(function () {
            var listeners = buckets[ms].listeners;
            var didThrow = false;
            var lastError;
            for (var _i = 0, _a = Object.values(listeners); _i < _a.length; _i++) {
                var listener = _a[_i];
                try {
                    listener();
                }
                catch (error) {
                    didThrow = true;
                    lastError = error;
                }
            }
            if (didThrow)
                throw lastError;
        }, ms);
        buckets[ms] = {
            ms: ms,
            timer: timer,
            listeners: (_a = {},
                _a[id] = fn,
                _a),
        };
    }
    return {
        bucket: buckets[ms],
        id: id,
    };
};
var clearHarmonicInterval = function (_a) {
    var bucket = _a.bucket, id = _a.id;
    delete bucket.listeners[id];
    var hasListeners = false;
    for (var listener in bucket.listeners) {
        hasListeners = true;
        break;
    }
    if (!hasListeners) {
        clearInterval(bucket.timer);
        delete buckets[bucket.ms];
    }
};



;// CONCATENATED MODULE: ./src/useHarmonicIntervalFn.ts


const useHarmonicIntervalFn = (fn, delay = 0) => {
    const latestCallback = (0,external_React_.useRef)(() => { });
    (0,external_React_.useEffect)(() => {
        latestCallback.current = fn;
    });
    (0,external_React_.useEffect)(() => {
        if (delay !== null) {
            const interval = setHarmonicInterval(() => latestCallback.current(), delay);
            return () => clearHarmonicInterval(interval);
        }
        return undefined;
    }, [delay]);
};
/* harmony default export */ const src_useHarmonicIntervalFn = (useHarmonicIntervalFn);

;// CONCATENATED MODULE: ./src/useHover.ts


const { useState } = external_React_;
const useHover = (element) => {
    const [state, setState] = useState(false);
    const onMouseEnter = (originalOnMouseEnter) => (event) => {
        (originalOnMouseEnter || noop)(event);
        setState(true);
    };
    const onMouseLeave = (originalOnMouseLeave) => (event) => {
        (originalOnMouseLeave || noop)(event);
        setState(false);
    };
    if (typeof element === 'function') {
        element = element(state);
    }
    const el = external_React_.cloneElement(element, {
        onMouseEnter: onMouseEnter(element.props.onMouseEnter),
        onMouseLeave: onMouseLeave(element.props.onMouseLeave),
    });
    return [el, state];
};
/* harmony default export */ const src_useHover = (useHover);

;// CONCATENATED MODULE: ./src/useHoverDirty.ts


// kudos: https://usehooks.com/
const useHoverDirty = (ref, enabled = true) => {
    if (false) {}
    const [value, setValue] = (0,external_React_.useState)(false);
    (0,external_React_.useEffect)(() => {
        const onMouseOver = () => setValue(true);
        const onMouseOut = () => setValue(false);
        if (enabled && ref && ref.current) {
            on(ref.current, 'mouseover', onMouseOver);
            on(ref.current, 'mouseout', onMouseOut);
        }
        // fixes react-hooks/exhaustive-deps warning about stale ref elements
        const { current } = ref;
        return () => {
            if (enabled && current) {
                off(current, 'mouseover', onMouseOver);
                off(current, 'mouseout', onMouseOut);
            }
        };
    }, [enabled, ref]);
    return value;
};
/* harmony default export */ const src_useHoverDirty = (useHoverDirty);

;// CONCATENATED MODULE: ./node_modules/throttle-debounce/esm/index.js
/* eslint-disable no-undefined,no-param-reassign,no-shadow */

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param  {number}    delay -          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {boolean}   [noTrailing] -   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
 *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
 *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
 *                                    the internal counter is reset).
 * @param  {Function}  callback -       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                    to `callback` when the throttled-function is executed.
 * @param  {boolean}   [debounceMode] - If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
 *                                    schedule `callback` to execute after `delay` ms.
 *
 * @returns {Function}  A new, throttled, function.
 */
function throttle (delay, noTrailing, callback, debounceMode) {
  /*
   * After wrapper has stopped being called, this timeout ensures that
   * `callback` is executed at the proper times in `throttle` and `end`
   * debounce modes.
   */
  var timeoutID;
  var cancelled = false; // Keep track of the last time `callback` was executed.

  var lastExec = 0; // Function to clear existing timeout

  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  } // Function to cancel next exec


  function cancel() {
    clearExistingTimeout();
    cancelled = true;
  } // `noTrailing` defaults to falsy.


  if (typeof noTrailing !== 'boolean') {
    debounceMode = callback;
    callback = noTrailing;
    noTrailing = undefined;
  }
  /*
   * The `wrapper` function encapsulates all of the throttling / debouncing
   * functionality and when executed will limit the rate at which `callback`
   * is executed.
   */


  function wrapper() {
    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
      arguments_[_key] = arguments[_key];
    }

    var self = this;
    var elapsed = Date.now() - lastExec;

    if (cancelled) {
      return;
    } // Execute `callback` and update the `lastExec` timestamp.


    function exec() {
      lastExec = Date.now();
      callback.apply(self, arguments_);
    }
    /*
     * If `debounceMode` is true (at begin) this is used to clear the flag
     * to allow future `callback` executions.
     */


    function clear() {
      timeoutID = undefined;
    }

    if (debounceMode && !timeoutID) {
      /*
       * Since `wrapper` is being called for the first time and
       * `debounceMode` is true (at begin), execute `callback`.
       */
      exec();
    }

    clearExistingTimeout();

    if (debounceMode === undefined && elapsed > delay) {
      /*
       * In throttle mode, if `delay` time has been exceeded, execute
       * `callback`.
       */
      exec();
    } else if (noTrailing !== true) {
      /*
       * In trailing throttle mode, since `delay` time has not been
       * exceeded, schedule `callback` to execute `delay` ms after most
       * recent execution.
       *
       * If `debounceMode` is true (at begin), schedule `clear` to execute
       * after `delay` ms.
       *
       * If `debounceMode` is false (at end), schedule `callback` to
       * execute after `delay` ms.
       */
      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
    }
  }

  wrapper.cancel = cancel; // Return the wrapper function.

  return wrapper;
}

/* eslint-disable no-undefined */
/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @param  {number}   delay -         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {boolean}  [atBegin] -     Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
 *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
 *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
 * @param  {Function} callback -      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                  to `callback` when the debounced-function is executed.
 *
 * @returns {Function} A new, debounced function.
 */

function debounce (delay, atBegin, callback) {
  return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
}


//# sourceMappingURL=index.js.map

;// CONCATENATED MODULE: ./src/useIdle.ts



const useIdle_defaultEvents = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel'];
const oneMinute = 60e3;
const useIdle = (ms = oneMinute, initialState = false, events = useIdle_defaultEvents) => {
    const [state, setState] = (0,external_React_.useState)(initialState);
    (0,external_React_.useEffect)(() => {
        let mounted = true;
        let timeout;
        let localState = state;
        const set = (newState) => {
            if (mounted) {
                localState = newState;
                setState(newState);
            }
        };
        const onEvent = throttle(50, () => {
            if (localState) {
                set(false);
            }
            clearTimeout(timeout);
            timeout = setTimeout(() => set(true), ms);
        });
        const onVisibility = () => {
            if (!document.hidden) {
                onEvent();
            }
        };
        for (let i = 0; i < events.length; i++) {
            on(window, events[i], onEvent);
        }
        on(document, 'visibilitychange', onVisibility);
        timeout = setTimeout(() => set(true), ms);
        return () => {
            mounted = false;
            for (let i = 0; i < events.length; i++) {
                off(window, events[i], onEvent);
            }
            off(document, 'visibilitychange', onVisibility);
        };
    }, [ms, events]);
    return state;
};
/* harmony default export */ const src_useIdle = (useIdle);

;// CONCATENATED MODULE: ./src/useIntersection.ts

const useIntersection = (ref, options) => {
    const [intersectionObserverEntry, setIntersectionObserverEntry] = (0,external_React_.useState)(null);
    (0,external_React_.useEffect)(() => {
        if (ref.current && typeof IntersectionObserver === 'function') {
            const handler = (entries) => {
                setIntersectionObserverEntry(entries[0]);
            };
            const observer = new IntersectionObserver(handler, options);
            observer.observe(ref.current);
            return () => {
                setIntersectionObserverEntry(null);
                observer.disconnect();
            };
        }
        return () => { };
    }, [ref.current, options.threshold, options.root, options.rootMargin]);
    return intersectionObserverEntry;
};
/* harmony default export */ const src_useIntersection = (useIntersection);

;// CONCATENATED MODULE: ./src/useInterval.ts

const useInterval = (callback, delay) => {
    const savedCallback = (0,external_React_.useRef)(() => { });
    (0,external_React_.useEffect)(() => {
        savedCallback.current = callback;
    });
    (0,external_React_.useEffect)(() => {
        if (delay !== null) {
            const interval = setInterval(() => savedCallback.current(), delay || 0);
            return () => clearInterval(interval);
        }
        return undefined;
    }, [delay]);
};
/* harmony default export */ const src_useInterval = (useInterval);

;// CONCATENATED MODULE: ./src/useKey.ts



const createKeyPredicate = (keyFilter) => typeof keyFilter === 'function'
    ? keyFilter
    : typeof keyFilter === 'string'
        ? (event) => event.key === keyFilter
        : keyFilter
            ? () => true
            : () => false;
const useKey = (key, fn = noop, opts = {}, deps = [key]) => {
    const { event = 'keydown', target, options } = opts;
    const useMemoHandler = (0,external_React_.useMemo)(() => {
        const predicate = createKeyPredicate(key);
        const handler = (handlerEvent) => {
            if (predicate(handlerEvent)) {
                return fn(handlerEvent);
            }
        };
        return handler;
    }, deps);
    src_useEvent(event, useMemoHandler, target, options);
};
/* harmony default export */ const src_useKey = (useKey);

;// CONCATENATED MODULE: ./src/factory/createBreakpoint.ts


const createBreakpoint = (breakpoints = { laptopL: 1440, laptop: 1024, tablet: 768 }) => () => {
    const [screen, setScreen] = (0,external_React_.useState)(isBrowser ? window.innerWidth : 0);
    (0,external_React_.useEffect)(() => {
        const setSideScreen = () => {
            setScreen(window.innerWidth);
        };
        setSideScreen();
        on(window, 'resize', setSideScreen);
        return () => {
            off(window, 'resize', setSideScreen);
        };
    });
    const sortedBreakpoints = (0,external_React_.useMemo)(() => Object.entries(breakpoints).sort((a, b) => (a[1] >= b[1] ? 1 : -1)), [breakpoints]);
    const result = sortedBreakpoints.reduce((acc, [name, width]) => {
        if (screen >= width) {
            return name;
        }
        else {
            return acc;
        }
    }, sortedBreakpoints[0][0]);
    return result;
};
/* harmony default export */ const factory_createBreakpoint = (createBreakpoint);

;// CONCATENATED MODULE: ./src/useKeyPress.ts


const useKeyPress = (keyFilter) => {
    const [state, set] = (0,external_React_.useState)([false, null]);
    src_useKey(keyFilter, (event) => set([true, event]), { event: 'keydown' }, [state]);
    src_useKey(keyFilter, (event) => set([false, event]), { event: 'keyup' }, [state]);
    return state;
};
/* harmony default export */ const src_useKeyPress = (useKeyPress);

;// CONCATENATED MODULE: ./src/useKeyPressEvent.ts


const useKeyPressEvent = (key, keydown, keyup, useKeyPress = src_useKeyPress) => {
    const [pressed, event] = useKeyPress(key);
    src_useUpdateEffect(() => {
        if (!pressed && keyup) {
            keyup(event);
        }
        else if (pressed && keydown) {
            keydown(event);
        }
    }, [pressed]);
};
/* harmony default export */ const src_useKeyPressEvent = (useKeyPressEvent);

;// CONCATENATED MODULE: ./src/useLatest.ts

const useLatest = (value) => {
    const ref = (0,external_React_.useRef)(value);
    ref.current = value;
    return ref;
};
/* harmony default export */ const src_useLatest = (useLatest);

;// CONCATENATED MODULE: ./src/useLifecycles.ts

const useLifecycles = (mount, unmount) => {
    (0,external_React_.useEffect)(() => {
        if (mount) {
            mount();
        }
        return () => {
            if (unmount) {
                unmount();
            }
        };
    }, []);
};
/* harmony default export */ const src_useLifecycles = (useLifecycles);

;// CONCATENATED MODULE: ./src/useList.ts



function useList(initialList = []) {
    const list = (0,external_React_.useRef)(resolveHookState(initialList));
    const update = useUpdate();
    const actions = (0,external_React_.useMemo)(() => {
        const a = {
            set: (newList) => {
                list.current = resolveHookState(newList, list.current);
                update();
            },
            push: (...items) => {
                items.length && actions.set((curr) => curr.concat(items));
            },
            updateAt: (index, item) => {
                actions.set((curr) => {
                    const arr = curr.slice();
                    arr[index] = item;
                    return arr;
                });
            },
            insertAt: (index, item) => {
                actions.set((curr) => {
                    const arr = curr.slice();
                    index > arr.length ? (arr[index] = item) : arr.splice(index, 0, item);
                    return arr;
                });
            },
            update: (predicate, newItem) => {
                actions.set((curr) => curr.map((item) => (predicate(item, newItem) ? newItem : item)));
            },
            updateFirst: (predicate, newItem) => {
                const index = list.current.findIndex((item) => predicate(item, newItem));
                index >= 0 && actions.updateAt(index, newItem);
            },
            upsert: (predicate, newItem) => {
                const index = list.current.findIndex((item) => predicate(item, newItem));
                index >= 0 ? actions.updateAt(index, newItem) : actions.push(newItem);
            },
            sort: (compareFn) => {
                actions.set((curr) => curr.slice().sort(compareFn));
            },
            filter: (callbackFn, thisArg) => {
                actions.set((curr) => curr.slice().filter(callbackFn, thisArg));
            },
            removeAt: (index) => {
                actions.set((curr) => {
                    const arr = curr.slice();
                    arr.splice(index, 1);
                    return arr;
                });
            },
            clear: () => {
                actions.set([]);
            },
            reset: () => {
                actions.set(resolveHookState(initialList).slice());
            },
        };
        /**
         * @deprecated Use removeAt method instead
         */
        a.remove = a.removeAt;
        return a;
    }, []);
    return [list.current, actions];
}
/* harmony default export */ const src_useList = (useList);

;// CONCATENATED MODULE: ./src/useLocalStorage.ts


const useLocalStorage = (key, initialValue, options) => {
    if (!isBrowser) {
        return [initialValue, noop, noop];
    }
    if (!key) {
        throw new Error('useLocalStorage key may not be falsy');
    }
    const deserializer = options
        ? options.raw
            ? (value) => value
            : options.deserializer
        : JSON.parse;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const initializer = (0,external_React_.useRef)((key) => {
        try {
            const serializer = options ? (options.raw ? String : options.serializer) : JSON.stringify;
            const localStorageValue = localStorage.getItem(key);
            if (localStorageValue !== null) {
                return deserializer(localStorageValue);
            }
            else {
                initialValue && localStorage.setItem(key, serializer(initialValue));
                return initialValue;
            }
        }
        catch {
            // If user is in private mode or has storage restriction
            // localStorage can throw. JSON.parse and JSON.stringify
            // can throw, too.
            return initialValue;
        }
    });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [state, setState] = (0,external_React_.useState)(() => initializer.current(key));
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (0,external_React_.useLayoutEffect)(() => setState(initializer.current(key)), [key]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const set = (0,external_React_.useCallback)((valOrFunc) => {
        try {
            const newState = typeof valOrFunc === 'function' ? valOrFunc(state) : valOrFunc;
            if (typeof newState === 'undefined')
                return;
            let value;
            if (options)
                if (options.raw)
                    if (typeof newState === 'string')
                        value = newState;
                    else
                        value = JSON.stringify(newState);
                else if (options.serializer)
                    value = options.serializer(newState);
                else
                    value = JSON.stringify(newState);
            else
                value = JSON.stringify(newState);
            localStorage.setItem(key, value);
            setState(deserializer(value));
        }
        catch {
            // If user is in private mode or has storage restriction
            // localStorage can throw. Also JSON.stringify can throw.
        }
    }, [key, setState]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const remove = (0,external_React_.useCallback)(() => {
        try {
            localStorage.removeItem(key);
            setState(undefined);
        }
        catch {
            // If user is in private mode or has storage restriction
            // localStorage can throw.
        }
    }, [key, setState]);
    return [state, set, remove];
};
/* harmony default export */ const src_useLocalStorage = (useLocalStorage);

;// CONCATENATED MODULE: ./src/useLocation.ts


const patchHistoryMethod = (method) => {
    const history = window.history;
    const original = history[method];
    history[method] = function (state) {
        const result = original.apply(this, arguments);
        const event = new Event(method.toLowerCase());
        event.state = state;
        window.dispatchEvent(event);
        return result;
    };
};
if (isBrowser) {
    patchHistoryMethod('pushState');
    patchHistoryMethod('replaceState');
}
const useLocationServer = () => ({
    trigger: 'load',
    length: 1,
});
const buildState = (trigger) => {
    const { state, length } = window.history;
    const { hash, host, hostname, href, origin, pathname, port, protocol, search } = window.location;
    return {
        trigger,
        state,
        length,
        hash,
        host,
        hostname,
        href,
        origin,
        pathname,
        port,
        protocol,
        search,
    };
};
const useLocationBrowser = () => {
    const [state, setState] = (0,external_React_.useState)(buildState('load'));
    (0,external_React_.useEffect)(() => {
        const onPopstate = () => setState(buildState('popstate'));
        const onPushstate = () => setState(buildState('pushstate'));
        const onReplacestate = () => setState(buildState('replacestate'));
        on(window, 'popstate', onPopstate);
        on(window, 'pushstate', onPushstate);
        on(window, 'replacestate', onReplacestate);
        return () => {
            off(window, 'popstate', onPopstate);
            off(window, 'pushstate', onPushstate);
            off(window, 'replacestate', onReplacestate);
        };
    }, []);
    return state;
};
const hasEventConstructor = typeof Event === 'function';
/* harmony default export */ const useLocation = (isBrowser && hasEventConstructor ? useLocationBrowser : useLocationServer);

;// CONCATENATED MODULE: ./src/useLockBodyScroll.ts


function getClosestBody(el) {
    if (!el) {
        return null;
    }
    else if (el.tagName === 'BODY') {
        return el;
    }
    else if (el.tagName === 'IFRAME') {
        const document = el.contentDocument;
        return document ? document.body : null;
    }
    else if (!el.offsetParent) {
        return null;
    }
    return getClosestBody(el.offsetParent);
}
function preventDefault(rawEvent) {
    const e = rawEvent || window.event;
    // Do not prevent if the event has more than one touch (usually meaning this is a multi touch gesture like pinch to zoom).
    if (e.touches.length > 1)
        return true;
    if (e.preventDefault)
        e.preventDefault();
    return false;
}
const isIosDevice = isBrowser &&
    window.navigator &&
    window.navigator.platform &&
    /iP(ad|hone|od)/.test(window.navigator.platform);
const bodies = new Map();
const doc = typeof document === 'object' ? document : undefined;
let documentListenerAdded = false;
/* harmony default export */ const useLockBodyScroll = (!doc
    ? function useLockBodyMock(_locked = true, _elementRef) { }
    : function useLockBody(locked = true, elementRef) {
        const bodyRef = (0,external_React_.useRef)(doc.body);
        elementRef = elementRef || bodyRef;
        const lock = (body) => {
            const bodyInfo = bodies.get(body);
            if (!bodyInfo) {
                bodies.set(body, { counter: 1, initialOverflow: body.style.overflow });
                if (isIosDevice) {
                    if (!documentListenerAdded) {
                        on(document, 'touchmove', preventDefault, { passive: false });
                        documentListenerAdded = true;
                    }
                }
                else {
                    body.style.overflow = 'hidden';
                }
            }
            else {
                bodies.set(body, {
                    counter: bodyInfo.counter + 1,
                    initialOverflow: bodyInfo.initialOverflow,
                });
            }
        };
        const unlock = (body) => {
            const bodyInfo = bodies.get(body);
            if (bodyInfo) {
                if (bodyInfo.counter === 1) {
                    bodies.delete(body);
                    if (isIosDevice) {
                        body.ontouchmove = null;
                        if (documentListenerAdded) {
                            off(document, 'touchmove', preventDefault);
                            documentListenerAdded = false;
                        }
                    }
                    else {
                        body.style.overflow = bodyInfo.initialOverflow;
                    }
                }
                else {
                    bodies.set(body, {
                        counter: bodyInfo.counter - 1,
                        initialOverflow: bodyInfo.initialOverflow,
                    });
                }
            }
        };
        (0,external_React_.useEffect)(() => {
            const body = getClosestBody(elementRef.current);
            if (!body) {
                return;
            }
            if (locked) {
                lock(body);
            }
            else {
                unlock(body);
            }
        }, [locked, elementRef.current]);
        // clean up, on un-mount
        (0,external_React_.useEffect)(() => {
            const body = getClosestBody(elementRef.current);
            if (!body) {
                return;
            }
            return () => {
                unlock(body);
            };
        }, []);
    });

;// CONCATENATED MODULE: ./src/useLogger.ts


const useLogger = (componentName, ...rest) => {
    src_useEffectOnce(() => {
        console.log(`${componentName} mounted`, ...rest);
        return () => console.log(`${componentName} unmounted`);
    });
    src_useUpdateEffect(() => {
        console.log(`${componentName} updated`, ...rest);
    });
};
/* harmony default export */ const src_useLogger = (useLogger);

;// CONCATENATED MODULE: ./src/useLongPress.ts


const isTouchEvent = (ev) => {
    return 'touches' in ev;
};
const useLongPress_preventDefault = (ev) => {
    if (!isTouchEvent(ev))
        return;
    if (ev.touches.length < 2 && ev.preventDefault) {
        ev.preventDefault();
    }
};
const useLongPress = (callback, { isPreventDefault = true, delay = 300 } = {}) => {
    const timeout = (0,external_React_.useRef)();
    const target = (0,external_React_.useRef)();
    const start = (0,external_React_.useCallback)((event) => {
        // prevent ghost click on mobile devices
        if (isPreventDefault && event.target) {
            on(event.target, 'touchend', useLongPress_preventDefault, { passive: false });
            target.current = event.target;
        }
        timeout.current = setTimeout(() => callback(event), delay);
    }, [callback, delay, isPreventDefault]);
    const clear = (0,external_React_.useCallback)(() => {
        // clearTimeout and removeEventListener
        timeout.current && clearTimeout(timeout.current);
        if (isPreventDefault && target.current) {
            off(target.current, 'touchend', useLongPress_preventDefault);
        }
    }, [isPreventDefault]);
    return {
        onMouseDown: (e) => start(e),
        onTouchStart: (e) => start(e),
        onMouseUp: clear,
        onMouseLeave: clear,
        onTouchEnd: clear,
    };
};
/* harmony default export */ const src_useLongPress = (useLongPress);

;// CONCATENATED MODULE: ./src/useMap.ts

const useMap = (initialMap = {}) => {
    const [map, set] = (0,external_React_.useState)(initialMap);
    const stableActions = (0,external_React_.useMemo)(() => ({
        set: (key, entry) => {
            set((prevMap) => ({
                ...prevMap,
                [key]: entry,
            }));
        },
        setAll: (newMap) => {
            set(newMap);
        },
        remove: (key) => {
            set((prevMap) => {
                const { [key]: omit, ...rest } = prevMap;
                return rest;
            });
        },
        reset: () => set(initialMap),
    }), [set]);
    const utils = {
        get: (0,external_React_.useCallback)((key) => map[key], [map]),
        ...stableActions,
    };
    return [map, utils];
};
/* harmony default export */ const src_useMap = (useMap);

;// CONCATENATED MODULE: ./src/useMedia.ts


const getInitialState = (query, defaultState) => {
    // Prevent a React hydration mismatch when a default value is provided by not defaulting to window.matchMedia(query).matches.
    if (defaultState !== undefined) {
        return defaultState;
    }
    if (isBrowser) {
        return window.matchMedia(query).matches;
    }
    // A default value has not been provided, and you are rendering on the server, warn of a possible hydration mismatch when defaulting to false.
    if (false) {}
    return false;
};
const useMedia = (query, defaultState) => {
    const [state, setState] = (0,external_React_.useState)(getInitialState(query, defaultState));
    (0,external_React_.useEffect)(() => {
        let mounted = true;
        const mql = window.matchMedia(query);
        const onChange = () => {
            if (!mounted) {
                return;
            }
            setState(!!mql.matches);
        };
        mql.addEventListener('change', onChange);
        setState(mql.matches);
        return () => {
            mounted = false;
            mql.removeEventListener('change', onChange);
        };
    }, [query]);
    return state;
};
/* harmony default export */ const src_useMedia = (useMedia);

;// CONCATENATED MODULE: ./src/useMediaDevices.ts


const useMediaDevices = () => {
    const [state, setState] = (0,external_React_.useState)({});
    (0,external_React_.useEffect)(() => {
        let mounted = true;
        const onChange = () => {
            navigator.mediaDevices
                .enumerateDevices()
                .then((devices) => {
                if (mounted) {
                    setState({
                        devices: devices.map(({ deviceId, groupId, kind, label }) => ({
                            deviceId,
                            groupId,
                            kind,
                            label,
                        })),
                    });
                }
            })
                .catch(noop);
        };
        on(navigator.mediaDevices, 'devicechange', onChange);
        onChange();
        return () => {
            mounted = false;
            off(navigator.mediaDevices, 'devicechange', onChange);
        };
    }, []);
    return state;
};
const useMediaDevicesMock = () => ({});
/* harmony default export */ const src_useMediaDevices = (isNavigator && !!navigator.mediaDevices ? useMediaDevices : useMediaDevicesMock);

;// CONCATENATED MODULE: ./src/useMediatedState.ts

function useMediatedState(mediator, initialState) {
    const mediatorFn = (0,external_React_.useRef)(mediator);
    const [state, setMediatedState] = (0,external_React_.useState)(initialState);
    const setState = (0,external_React_.useCallback)((newState) => {
        if (mediatorFn.current.length === 2) {
            mediatorFn.current(newState, setMediatedState);
        }
        else {
            setMediatedState(mediatorFn.current(newState));
        }
    }, [state]);
    return [state, setState];
}

;// CONCATENATED MODULE: ./src/useMethods.ts

const useMethods = (createMethods, initialState) => {
    const reducer = (0,external_React_.useMemo)(() => (reducerState, action) => {
        return createMethods(reducerState)[action.type](...action.payload);
    }, [createMethods]);
    const [state, dispatch] = (0,external_React_.useReducer)(reducer, initialState);
    const wrappedMethods = (0,external_React_.useMemo)(() => {
        const actionTypes = Object.keys(createMethods(initialState));
        return actionTypes.reduce((acc, type) => {
            acc[type] = (...payload) => dispatch({ type, payload });
            return acc;
        }, {});
    }, [createMethods, initialState]);
    return [state, wrappedMethods];
};
/* harmony default export */ const src_useMethods = (useMethods);

;// CONCATENATED MODULE: ./src/useMotion.ts


const defaultState = {
    acceleration: {
        x: null,
        y: null,
        z: null,
    },
    accelerationIncludingGravity: {
        x: null,
        y: null,
        z: null,
    },
    rotationRate: {
        alpha: null,
        beta: null,
        gamma: null,
    },
    interval: 16,
};
const useMotion = (initialState = defaultState) => {
    const [state, setState] = (0,external_React_.useState)(initialState);
    (0,external_React_.useEffect)(() => {
        const handler = (event) => {
            const { acceleration, accelerationIncludingGravity, rotationRate, interval } = event;
            setState({
                acceleration: {
                    x: acceleration.x,
                    y: acceleration.y,
                    z: acceleration.z,
                },
                accelerationIncludingGravity: {
                    x: accelerationIncludingGravity.x,
                    y: accelerationIncludingGravity.y,
                    z: accelerationIncludingGravity.z,
                },
                rotationRate: {
                    alpha: rotationRate.alpha,
                    beta: rotationRate.beta,
                    gamma: rotationRate.gamma,
                },
                interval,
            });
        };
        on(window, 'devicemotion', handler);
        return () => {
            off(window, 'devicemotion', handler);
        };
    }, []);
    return state;
};
/* harmony default export */ const src_useMotion = (useMotion);

;// CONCATENATED MODULE: ./src/useMount.ts

const useMount = (fn) => {
    src_useEffectOnce(() => {
        fn();
    });
};
/* harmony default export */ const src_useMount = (useMount);

;// CONCATENATED MODULE: ./src/useUnmount.ts


const useUnmount = (fn) => {
    const fnRef = (0,external_React_.useRef)(fn);
    // update the ref each render so if it change the newest callback will be invoked
    fnRef.current = fn;
    src_useEffectOnce(() => () => fnRef.current());
};
/* harmony default export */ const src_useUnmount = (useUnmount);

;// CONCATENATED MODULE: ./src/useRafState.ts


const useRafState = (initialState) => {
    const frame = (0,external_React_.useRef)(0);
    const [state, setState] = (0,external_React_.useState)(initialState);
    const setRafState = (0,external_React_.useCallback)((value) => {
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
            setState(value);
        });
    }, []);
    src_useUnmount(() => {
        cancelAnimationFrame(frame.current);
    });
    return [state, setRafState];
};
/* harmony default export */ const src_useRafState = (useRafState);

;// CONCATENATED MODULE: ./src/useMouse.ts



const useMouse = (ref) => {
    if (false) {}
    const [state, setState] = src_useRafState({
        docX: 0,
        docY: 0,
        posX: 0,
        posY: 0,
        elX: 0,
        elY: 0,
        elH: 0,
        elW: 0,
    });
    (0,external_React_.useEffect)(() => {
        const moveHandler = (event) => {
            if (ref && ref.current) {
                const { left, top, width: elW, height: elH } = ref.current.getBoundingClientRect();
                const posX = left + window.pageXOffset;
                const posY = top + window.pageYOffset;
                const elX = event.pageX - posX;
                const elY = event.pageY - posY;
                setState({
                    docX: event.pageX,
                    docY: event.pageY,
                    posX,
                    posY,
                    elX,
                    elY,
                    elH,
                    elW,
                });
            }
        };
        on(document, 'mousemove', moveHandler);
        return () => {
            off(document, 'mousemove', moveHandler);
        };
    }, [ref]);
    return state;
};
/* harmony default export */ const src_useMouse = (useMouse);

;// CONCATENATED MODULE: ./src/useMouseHovered.ts


const nullRef = { current: null };
const useMouseHovered = (ref, options = {}) => {
    const whenHovered = !!options.whenHovered;
    const bound = !!options.bound;
    const isHovered = src_useHoverDirty(ref, whenHovered);
    const state = src_useMouse(whenHovered && !isHovered ? nullRef : ref);
    if (bound) {
        state.elX = Math.max(0, Math.min(state.elX, state.elW));
        state.elY = Math.max(0, Math.min(state.elY, state.elH));
    }
    return state;
};
/* harmony default export */ const src_useMouseHovered = (useMouseHovered);

;// CONCATENATED MODULE: ./src/useMouseWheel.ts


/* harmony default export */ const useMouseWheel = (() => {
    const [mouseWheelScrolled, setMouseWheelScrolled] = (0,external_React_.useState)(0);
    (0,external_React_.useEffect)(() => {
        const updateScroll = (e) => {
            setMouseWheelScrolled(e.deltaY + mouseWheelScrolled);
        };
        on(window, 'wheel', updateScroll, false);
        return () => off(window, 'wheel', updateScroll);
    });
    return mouseWheelScrolled;
});

;// CONCATENATED MODULE: ./src/useNetworkState.ts


const useNetworkState_nav = isNavigator ? navigator : undefined;
const conn = useNetworkState_nav && (useNetworkState_nav.connection || useNetworkState_nav.mozConnection || useNetworkState_nav.webkitConnection);
function getConnectionState(previousState) {
    const online = useNetworkState_nav?.onLine;
    const previousOnline = previousState?.online;
    return {
        online,
        previous: previousOnline,
        since: online !== previousOnline ? new Date() : previousState?.since,
        downlink: conn?.downlink,
        downlinkMax: conn?.downlinkMax,
        effectiveType: conn?.effectiveType,
        rtt: conn?.rtt,
        saveData: conn?.saveData,
        type: conn?.type,
    };
}
function useNetworkState(initialState) {
    const [state, setState] = (0,external_React_.useState)(initialState ?? getConnectionState);
    (0,external_React_.useEffect)(() => {
        const handleStateChange = () => {
            setState(getConnectionState);
        };
        on(window, 'online', handleStateChange, { passive: true });
        on(window, 'offline', handleStateChange, { passive: true });
        if (conn) {
            on(conn, 'change', handleStateChange, { passive: true });
        }
        return () => {
            off(window, 'online', handleStateChange);
            off(window, 'offline', handleStateChange);
            if (conn) {
                off(conn, 'change', handleStateChange);
            }
        };
    }, []);
    return state;
}

;// CONCATENATED MODULE: ./src/useNumber.ts

/* harmony default export */ const useNumber = (useCounter);

;// CONCATENATED MODULE: ./src/useObservable.ts


function useObservable(observable$, initialValue) {
    const [value, update] = (0,external_React_.useState)(initialValue);
    src_useIsomorphicLayoutEffect(() => {
        const s = observable$.subscribe(update);
        return () => s.unsubscribe();
    }, [observable$]);
    return value;
}
/* harmony default export */ const src_useObservable = (useObservable);

;// CONCATENATED MODULE: ./src/useOrientation.ts


const useOrientation_defaultState = {
    angle: 0,
    type: 'landscape-primary',
};
const useOrientation = (initialState = useOrientation_defaultState) => {
    const [state, setState] = (0,external_React_.useState)(initialState);
    (0,external_React_.useEffect)(() => {
        const screen = window.screen;
        let mounted = true;
        const onChange = () => {
            if (mounted) {
                const { orientation } = screen;
                if (orientation) {
                    const { angle, type } = orientation;
                    setState({ angle, type });
                }
                else if (window.orientation !== undefined) {
                    setState({
                        angle: typeof window.orientation === 'number' ? window.orientation : 0,
                        type: '',
                    });
                }
                else {
                    setState(initialState);
                }
            }
        };
        on(window, 'orientationchange', onChange);
        onChange();
        return () => {
            mounted = false;
            off(window, 'orientationchange', onChange);
        };
    }, []);
    return state;
};
/* harmony default export */ const src_useOrientation = (useOrientation);

;// CONCATENATED MODULE: ./src/usePageLeave.ts


const usePageLeave = (onPageLeave, args = []) => {
    (0,external_React_.useEffect)(() => {
        if (!onPageLeave) {
            return;
        }
        const handler = (event) => {
            event = event ? event : window.event;
            const from = event.relatedTarget || event.toElement;
            if (!from || from.nodeName === 'HTML') {
                onPageLeave();
            }
        };
        on(document, 'mouseout', handler);
        return () => {
            off(document, 'mouseout', handler);
        };
    }, args);
};
/* harmony default export */ const src_usePageLeave = (usePageLeave);

;// CONCATENATED MODULE: ./src/usePermission.ts


// const usePermission = <T extends PermissionDescriptor>(permissionDesc: T): IState => {
const usePermission = (permissionDesc) => {
    const [state, setState] = (0,external_React_.useState)('');
    (0,external_React_.useEffect)(() => {
        let mounted = true;
        let permissionStatus = null;
        const onChange = () => {
            if (!mounted) {
                return;
            }
            setState(() => permissionStatus?.state ?? '');
        };
        navigator.permissions
            .query(permissionDesc)
            .then((status) => {
            permissionStatus = status;
            on(permissionStatus, 'change', onChange);
            onChange();
        })
            .catch(noop);
        return () => {
            permissionStatus && off(permissionStatus, 'change', onChange);
            mounted = false;
            permissionStatus = null;
        };
    }, [permissionDesc]);
    return state;
};
/* harmony default export */ const src_usePermission = (usePermission);

;// CONCATENATED MODULE: ./src/usePrevious.ts

function usePrevious(state) {
    const ref = (0,external_React_.useRef)();
    (0,external_React_.useEffect)(() => {
        ref.current = state;
    });
    return ref.current;
}

;// CONCATENATED MODULE: ./src/usePreviousDistinct.ts


const strictEquals = (prev, next) => prev === next;
function usePreviousDistinct(value, compare = strictEquals) {
    const prevRef = (0,external_React_.useRef)();
    const curRef = (0,external_React_.useRef)(value);
    const isFirstMount = useFirstMountState();
    if (!isFirstMount && !compare(curRef.current, value)) {
        prevRef.current = curRef.current;
        curRef.current = value;
    }
    return prevRef.current;
}

;// CONCATENATED MODULE: ./src/usePromise.ts


const usePromise = () => {
    const isMounted = useMountedState();
    return (0,external_React_.useCallback)((promise) => new Promise((resolve, reject) => {
        const onValue = (value) => {
            isMounted() && resolve(value);
        };
        const onError = (error) => {
            isMounted() && reject(error);
        };
        promise.then(onValue, onError);
    }), []);
};
/* harmony default export */ const src_usePromise = (usePromise);

;// CONCATENATED MODULE: ./src/useQueue.ts

const useQueue = (initialValue = []) => {
    const [state, set] = (0,external_React_.useState)(initialValue);
    return {
        add: (value) => {
            set((queue) => [...queue, value]);
        },
        remove: () => {
            let result;
            set(([first, ...rest]) => {
                result = first;
                return rest;
            });
            return result;
        },
        get first() {
            return state[0];
        },
        get last() {
            return state[state.length - 1];
        },
        get size() {
            return state.length;
        },
    };
};
/* harmony default export */ const src_useQueue = (useQueue);

;// CONCATENATED MODULE: ./src/useRaf.ts


const useRaf = (ms = 1e12, delay = 0) => {
    const [elapsed, set] = (0,external_React_.useState)(0);
    src_useIsomorphicLayoutEffect(() => {
        let raf;
        let timerStop;
        let start;
        const onFrame = () => {
            const time = Math.min(1, (Date.now() - start) / ms);
            set(time);
            loop();
        };
        const loop = () => {
            raf = requestAnimationFrame(onFrame);
        };
        const onStart = () => {
            timerStop = setTimeout(() => {
                cancelAnimationFrame(raf);
                set(1);
            }, ms);
            start = Date.now();
            loop();
        };
        const timerDelay = setTimeout(onStart, delay);
        return () => {
            clearTimeout(timerStop);
            clearTimeout(timerDelay);
            cancelAnimationFrame(raf);
        };
    }, [ms, delay]);
    return elapsed;
};
/* harmony default export */ const src_useRaf = (useRaf);

;// CONCATENATED MODULE: ./src/useRafLoop.ts

function useRafLoop(callback, initiallyActive = true) {
    const raf = (0,external_React_.useRef)(null);
    const rafActivity = (0,external_React_.useRef)(false);
    const rafCallback = (0,external_React_.useRef)(callback);
    rafCallback.current = callback;
    const step = (0,external_React_.useCallback)((time) => {
        if (rafActivity.current) {
            rafCallback.current(time);
            raf.current = requestAnimationFrame(step);
        }
    }, []);
    const result = (0,external_React_.useMemo)(() => [
        () => {
            // stop
            if (rafActivity.current) {
                rafActivity.current = false;
                raf.current && cancelAnimationFrame(raf.current);
            }
        },
        () => {
            // start
            if (!rafActivity.current) {
                rafActivity.current = true;
                raf.current = requestAnimationFrame(step);
            }
        },
        () => rafActivity.current,
    ], []);
    (0,external_React_.useEffect)(() => {
        if (initiallyActive) {
            result[1]();
        }
        return result[0];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return result;
}

;// CONCATENATED MODULE: ./src/useSearchParam.ts


const getValue = (search, param) => new URLSearchParams(search).get(param);
const useSearchParam = (param) => {
    const location = window.location;
    const [value, setValue] = (0,external_React_.useState)(() => getValue(location.search, param));
    (0,external_React_.useEffect)(() => {
        const onChange = () => {
            setValue(getValue(location.search, param));
        };
        on(window, 'popstate', onChange);
        on(window, 'pushstate', onChange);
        on(window, 'replacestate', onChange);
        return () => {
            off(window, 'popstate', onChange);
            off(window, 'pushstate', onChange);
            off(window, 'replacestate', onChange);
        };
    }, []);
    return value;
};
const useSearchParamServer = () => null;
/* harmony default export */ const src_useSearchParam = (isBrowser ? useSearchParam : useSearchParamServer);

// EXTERNAL MODULE: ./node_modules/react-universal-interface/lib/index.js
var lib = __webpack_require__(260);
;// CONCATENATED MODULE: ./src/useScratch.ts




const useScratch = (params = {}) => {
    const { disabled } = params;
    const paramsRef = src_useLatest(params);
    const [state, setState] = (0,external_React_.useState)({ isScratching: false });
    const refState = (0,external_React_.useRef)(state);
    const refScratching = (0,external_React_.useRef)(false);
    const refAnimationFrame = (0,external_React_.useRef)(null);
    const [el, setEl] = (0,external_React_.useState)(null);
    (0,external_React_.useEffect)(() => {
        if (disabled)
            return;
        if (!el)
            return;
        const onMoveEvent = (docX, docY) => {
            cancelAnimationFrame(refAnimationFrame.current);
            refAnimationFrame.current = requestAnimationFrame(() => {
                const { left, top } = el.getBoundingClientRect();
                const elX = left + window.scrollX;
                const elY = top + window.scrollY;
                const x = docX - elX;
                const y = docY - elY;
                setState((oldState) => {
                    const newState = {
                        ...oldState,
                        dx: x - (oldState.x || 0),
                        dy: y - (oldState.y || 0),
                        end: Date.now(),
                        isScratching: true,
                    };
                    refState.current = newState;
                    (paramsRef.current.onScratch || noop)(newState);
                    return newState;
                });
            });
        };
        const onMouseMove = (event) => {
            onMoveEvent(event.pageX, event.pageY);
        };
        const onTouchMove = (event) => {
            onMoveEvent(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
        };
        let onMouseUp;
        let onTouchEnd;
        const stopScratching = () => {
            if (!refScratching.current)
                return;
            refScratching.current = false;
            refState.current = { ...refState.current, isScratching: false };
            (paramsRef.current.onScratchEnd || noop)(refState.current);
            setState({ isScratching: false });
            off(window, 'mousemove', onMouseMove);
            off(window, 'touchmove', onTouchMove);
            off(window, 'mouseup', onMouseUp);
            off(window, 'touchend', onTouchEnd);
        };
        onMouseUp = stopScratching;
        onTouchEnd = stopScratching;
        const startScratching = (docX, docY) => {
            if (!refScratching.current)
                return;
            const { left, top } = el.getBoundingClientRect();
            const elX = left + window.scrollX;
            const elY = top + window.scrollY;
            const x = docX - elX;
            const y = docY - elY;
            const time = Date.now();
            const newState = {
                isScratching: true,
                start: time,
                end: time,
                docX,
                docY,
                x,
                y,
                dx: 0,
                dy: 0,
                elH: el.offsetHeight,
                elW: el.offsetWidth,
                elX,
                elY,
            };
            refState.current = newState;
            (paramsRef.current.onScratchStart || noop)(newState);
            setState(newState);
            on(window, 'mousemove', onMouseMove);
            on(window, 'touchmove', onTouchMove);
            on(window, 'mouseup', onMouseUp);
            on(window, 'touchend', onTouchEnd);
        };
        const onMouseDown = (event) => {
            refScratching.current = true;
            startScratching(event.pageX, event.pageY);
        };
        const onTouchStart = (event) => {
            refScratching.current = true;
            startScratching(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
        };
        on(el, 'mousedown', onMouseDown);
        on(el, 'touchstart', onTouchStart);
        return () => {
            off(el, 'mousedown', onMouseDown);
            off(el, 'touchstart', onTouchStart);
            off(window, 'mousemove', onMouseMove);
            off(window, 'touchmove', onTouchMove);
            off(window, 'mouseup', onMouseUp);
            off(window, 'touchend', onTouchEnd);
            if (refAnimationFrame.current)
                cancelAnimationFrame(refAnimationFrame.current);
            refAnimationFrame.current = null;
            refScratching.current = false;
            refState.current = { isScratching: false };
            setState(refState.current);
        };
    }, [el, disabled, paramsRef]);
    return [setEl, state];
};
const ScratchSensor = (props) => {
    const { children, ...params } = props;
    const [ref, state] = useScratch(params);
    const element = render(props, state);
    return cloneElement(element, {
        ...element.props,
        ref: (el) => {
            if (element.props.ref) {
                if (typeof element.props.ref === 'object')
                    element.props.ref.current = el;
                if (typeof element.props.ref === 'function')
                    element.props.ref(el);
            }
            ref(el);
        },
    });
};
/* harmony default export */ const src_useScratch = (useScratch);

;// CONCATENATED MODULE: ./src/useScroll.ts



const useScroll = (ref) => {
    if (false) {}
    const [state, setState] = src_useRafState({
        x: 0,
        y: 0,
    });
    (0,external_React_.useEffect)(() => {
        const handler = () => {
            if (ref.current) {
                setState({
                    x: ref.current.scrollLeft,
                    y: ref.current.scrollTop,
                });
            }
        };
        if (ref.current) {
            on(ref.current, 'scroll', handler, {
                capture: false,
                passive: true,
            });
        }
        return () => {
            if (ref.current) {
                off(ref.current, 'scroll', handler);
            }
        };
    }, [ref]);
    return state;
};
/* harmony default export */ const src_useScroll = (useScroll);

;// CONCATENATED MODULE: ./src/useScrolling.ts


const useScrolling = (ref) => {
    const [scrolling, setScrolling] = (0,external_React_.useState)(false);
    (0,external_React_.useEffect)(() => {
        if (ref.current) {
            let scrollingTimeout;
            const handleScrollEnd = () => {
                setScrolling(false);
            };
            const handleScroll = () => {
                setScrolling(true);
                clearTimeout(scrollingTimeout);
                scrollingTimeout = setTimeout(() => handleScrollEnd(), 150);
            };
            on(ref.current, 'scroll', handleScroll, false);
            return () => {
                if (ref.current) {
                    off(ref.current, 'scroll', handleScroll, false);
                }
            };
        }
        return () => { };
    }, [ref]);
    return scrolling;
};
/* harmony default export */ const src_useScrolling = (useScrolling);

;// CONCATENATED MODULE: ./src/useSessionStorage.ts


const useSessionStorage = (key, initialValue, raw) => {
    if (!isBrowser) {
        return [initialValue, () => { }];
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [state, setState] = (0,external_React_.useState)(() => {
        try {
            const sessionStorageValue = sessionStorage.getItem(key);
            if (typeof sessionStorageValue !== 'string') {
                sessionStorage.setItem(key, raw ? String(initialValue) : JSON.stringify(initialValue));
                return initialValue;
            }
            else {
                return raw ? sessionStorageValue : JSON.parse(sessionStorageValue || 'null');
            }
        }
        catch {
            // If user is in private mode or has storage restriction
            // sessionStorage can throw. JSON.parse and JSON.stringify
            // can throw, too.
            return initialValue;
        }
    });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (0,external_React_.useEffect)(() => {
        try {
            const serializedState = raw ? String(state) : JSON.stringify(state);
            sessionStorage.setItem(key, serializedState);
        }
        catch {
            // If user is in private mode or has storage restriction
            // sessionStorage can throw. Also JSON.stringify can throw.
        }
    });
    return [state, setState];
};
/* harmony default export */ const src_useSessionStorage = (useSessionStorage);

// EXTERNAL MODULE: ./node_modules/fast-shallow-equal/index.js
var fast_shallow_equal = __webpack_require__(376);
;// CONCATENATED MODULE: ./src/useShallowCompareEffect.ts


const useShallowCompareEffect_isPrimitive = (val) => val !== Object(val);
const shallowEqualDepsList = (prevDeps, nextDeps) => prevDeps.every((dep, index) => (0,fast_shallow_equal/* equal */.D)(dep, nextDeps[index]));
const useShallowCompareEffect = (effect, deps) => {
    if (false) {}
    src_useCustomCompareEffect(effect, deps, shallowEqualDepsList);
};
/* harmony default export */ const src_useShallowCompareEffect = (useShallowCompareEffect);

;// CONCATENATED MODULE: ./src/useSize.tsx


const { useState: useSize_useState, useEffect, useRef } = external_React_;
const DRAF = (callback) => setTimeout(callback, 35);
const useSize = (element, { width = Infinity, height = Infinity } = {}) => {
    if (!isBrowser) {
        return [
            typeof element === 'function' ? element({ width, height }) : element,
            { width, height },
        ];
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [state, setState] = useSize_useState({ width, height });
    if (typeof element === 'function') {
        element = element(state);
    }
    const style = element.props.style || {};
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ref = useRef(null);
    let window = null;
    const setSize = () => {
        const iframe = ref.current;
        const size = iframe
            ? {
                width: iframe.offsetWidth,
                height: iframe.offsetHeight,
            }
            : { width, height };
        setState(size);
    };
    const onWindow = (windowToListenOn) => {
        on(windowToListenOn, 'resize', setSize);
        DRAF(setSize);
    };
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const iframe = ref.current;
        if (!iframe) {
            // iframe will be undefined if component is already unmounted
            return;
        }
        if (iframe.contentWindow) {
            window = iframe.contentWindow;
            onWindow(window);
        }
        else {
            const onLoad = () => {
                on(iframe, 'load', onLoad);
                window = iframe.contentWindow;
                onWindow(window);
            };
            off(iframe, 'load', onLoad);
        }
        return () => {
            if (window && window.removeEventListener) {
                off(window, 'resize', setSize);
            }
        };
    }, []);
    style.position = 'relative';
    const sized = external_React_.cloneElement(element, { style }, ...[
        external_React_.createElement('iframe', {
            ref,
            style: {
                background: 'transparent',
                border: 'none',
                height: '100%',
                left: 0,
                position: 'absolute',
                top: 0,
                width: '100%',
                zIndex: -1,
            },
        }),
        ...external_React_.Children.toArray(element.props.children),
    ]);
    return [sized, state];
};
/* harmony default export */ const src_useSize = (useSize);

;// CONCATENATED MODULE: ./src/useSlider.ts




const useSlider = (ref, options = {}) => {
    const isMounted = useMountedState();
    const isSliding = (0,external_React_.useRef)(false);
    const valueRef = (0,external_React_.useRef)(0);
    const frame = (0,external_React_.useRef)(0);
    const [state, setState] = src_useSetState({
        isSliding: false,
        value: 0,
    });
    valueRef.current = state.value;
    (0,external_React_.useEffect)(() => {
        if (isBrowser) {
            const styles = options.styles === undefined ? true : options.styles;
            const reverse = options.reverse === undefined ? false : options.reverse;
            if (ref.current && styles) {
                ref.current.style.userSelect = 'none';
            }
            const startScrubbing = () => {
                if (!isSliding.current && isMounted()) {
                    (options.onScrubStart || noop)();
                    isSliding.current = true;
                    setState({ isSliding: true });
                    bindEvents();
                }
            };
            const stopScrubbing = () => {
                if (isSliding.current && isMounted()) {
                    (options.onScrubStop || noop)(valueRef.current);
                    isSliding.current = false;
                    setState({ isSliding: false });
                    unbindEvents();
                }
            };
            const onMouseDown = (event) => {
                startScrubbing();
                onMouseMove(event);
            };
            const onMouseMove = options.vertical
                ? (event) => onScrub(event.clientY)
                : (event) => onScrub(event.clientX);
            const onTouchStart = (event) => {
                startScrubbing();
                onTouchMove(event);
            };
            const onTouchMove = options.vertical
                ? (event) => onScrub(event.changedTouches[0].clientY)
                : (event) => onScrub(event.changedTouches[0].clientX);
            const bindEvents = () => {
                on(document, 'mousemove', onMouseMove);
                on(document, 'mouseup', stopScrubbing);
                on(document, 'touchmove', onTouchMove);
                on(document, 'touchend', stopScrubbing);
            };
            const unbindEvents = () => {
                off(document, 'mousemove', onMouseMove);
                off(document, 'mouseup', stopScrubbing);
                off(document, 'touchmove', onTouchMove);
                off(document, 'touchend', stopScrubbing);
            };
            const onScrub = (clientXY) => {
                cancelAnimationFrame(frame.current);
                frame.current = requestAnimationFrame(() => {
                    if (isMounted() && ref.current) {
                        const rect = ref.current.getBoundingClientRect();
                        const pos = options.vertical ? rect.top : rect.left;
                        const length = options.vertical ? rect.height : rect.width;
                        // Prevent returning 0 when element is hidden by CSS
                        if (!length) {
                            return;
                        }
                        let value = (clientXY - pos) / length;
                        if (value > 1) {
                            value = 1;
                        }
                        else if (value < 0) {
                            value = 0;
                        }
                        if (reverse) {
                            value = 1 - value;
                        }
                        setState({
                            value,
                        });
                        (options.onScrub || noop)(value);
                    }
                });
            };
            on(ref.current, 'mousedown', onMouseDown);
            on(ref.current, 'touchstart', onTouchStart);
            return () => {
                off(ref.current, 'mousedown', onMouseDown);
                off(ref.current, 'touchstart', onTouchStart);
            };
        }
        else {
            return undefined;
        }
    }, [ref, options.vertical]);
    return state;
};
/* harmony default export */ const src_useSlider = (useSlider);

;// CONCATENATED MODULE: ./src/useSpeech.ts

var Status;
(function (Status) {
    Status[Status["init"] = 0] = "init";
    Status[Status["play"] = 1] = "play";
    Status[Status["pause"] = 2] = "pause";
    Status[Status["end"] = 3] = "end";
})(Status || (Status = {}));
const useSpeech = (text, options) => {
    let mounted = (0,external_React_.useRef)(false);
    const [state, setState] = (0,external_React_.useState)(() => {
        const { lang = 'default', name = '' } = options.voice || {};
        return {
            isPlaying: false,
            status: Status[Status.init],
            lang: options.lang || 'default',
            voiceInfo: { lang, name },
            rate: options.rate || 1,
            pitch: options.pitch || 1,
            volume: options.volume || 1,
        };
    });
    const handlePlay = (0,external_React_.useCallback)(() => {
        if (!mounted.current) {
            return;
        }
        setState((preState) => {
            return { ...preState, isPlaying: true, status: Status[Status.play] };
        });
    }, []);
    const handlePause = (0,external_React_.useCallback)(() => {
        if (!mounted.current) {
            return;
        }
        setState((preState) => {
            return { ...preState, isPlaying: false, status: Status[Status.pause] };
        });
    }, []);
    const handleEnd = (0,external_React_.useCallback)(() => {
        if (!mounted.current) {
            return;
        }
        setState((preState) => {
            return { ...preState, isPlaying: false, status: Status[Status.end] };
        });
    }, []);
    (0,external_React_.useEffect)(() => {
        mounted.current = true;
        const utterance = new SpeechSynthesisUtterance(text);
        options.lang && (utterance.lang = options.lang);
        options.voice && (utterance.voice = options.voice);
        utterance.rate = options.rate || 1;
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;
        utterance.onstart = handlePlay;
        utterance.onpause = handlePause;
        utterance.onresume = handlePlay;
        utterance.onend = handleEnd;
        window.speechSynthesis.speak(utterance);
        return () => {
            mounted.current = false;
        };
    }, []);
    return state;
};
/* harmony default export */ const src_useSpeech = (useSpeech);

;// CONCATENATED MODULE: ./src/useStartTyping.ts


const isFocusedElementEditable = () => {
    const { activeElement, body } = document;
    if (!activeElement) {
        return false;
    }
    // If not element has focus, we assume it is not editable, too.
    if (activeElement === body) {
        return false;
    }
    // Assume <input> and <textarea> elements are editable.
    switch (activeElement.tagName) {
        case 'INPUT':
        case 'TEXTAREA':
            return true;
    }
    // Check if any other focused element id editable.
    return activeElement.hasAttribute('contenteditable');
};
const isTypedCharGood = ({ keyCode, metaKey, ctrlKey, altKey }) => {
    if (metaKey || ctrlKey || altKey) {
        return false;
    }
    // 0...9
    if (keyCode >= 48 && keyCode <= 57) {
        return true;
    }
    // a...z
    if (keyCode >= 65 && keyCode <= 90) {
        return true;
    }
    // All other keys.
    return false;
};
const useStartTyping = (onStartTyping) => {
    src_useIsomorphicLayoutEffect(() => {
        const keydown = (event) => {
            !isFocusedElementEditable() && isTypedCharGood(event) && onStartTyping(event);
        };
        on(document, 'keydown', keydown);
        return () => {
            off(document, 'keydown', keydown);
        };
    }, []);
};
/* harmony default export */ const src_useStartTyping = (useStartTyping);

;// CONCATENATED MODULE: ./src/useStateWithHistory.ts



function useStateWithHistory(initialState, capacity = 10, initialHistory) {
    if (capacity < 1) {
        throw new Error(`Capacity has to be greater than 1, got '${capacity}'`);
    }
    const isFirstMount = useFirstMountState();
    const [state, innerSetState] = (0,external_React_.useState)(initialState);
    const history = (0,external_React_.useRef)((initialHistory ?? []));
    const historyPosition = (0,external_React_.useRef)(0);
    // do the states manipulation only on first mount, no sense to load re-renders with useless calculations
    if (isFirstMount) {
        if (history.current.length) {
            // if last element of history !== initial - push initial to history
            if (history.current[history.current.length - 1] !== initialState) {
                history.current.push(initialState);
            }
            // if initial history bigger that capacity - crop the first elements out
            if (history.current.length > capacity) {
                history.current = history.current.slice(history.current.length - capacity);
            }
        }
        else {
            // initiate the history with initial state
            history.current.push(initialState);
        }
        historyPosition.current = history.current.length && history.current.length - 1;
    }
    const setState = (0,external_React_.useCallback)((newState) => {
        innerSetState((currentState) => {
            newState = resolveHookState(newState, currentState);
            // is state has changed
            if (newState !== currentState) {
                // if current position is not the last - pop element to the right
                if (historyPosition.current < history.current.length - 1) {
                    history.current = history.current.slice(0, historyPosition.current + 1);
                }
                historyPosition.current = history.current.push(newState) - 1;
                // if capacity is reached - shift first elements
                if (history.current.length > capacity) {
                    history.current = history.current.slice(history.current.length - capacity);
                }
            }
            return newState;
        });
    }, [state, capacity]);
    const historyState = (0,external_React_.useMemo)(() => ({
        history: history.current,
        position: historyPosition.current,
        capacity,
        back: (amount = 1) => {
            // don't do anything if we already at the left border
            if (!historyPosition.current) {
                return;
            }
            innerSetState(() => {
                historyPosition.current -= Math.min(amount, historyPosition.current);
                return history.current[historyPosition.current];
            });
        },
        forward: (amount = 1) => {
            // don't do anything if we already at the right border
            if (historyPosition.current === history.current.length - 1) {
                return;
            }
            innerSetState(() => {
                historyPosition.current = Math.min(historyPosition.current + amount, history.current.length - 1);
                return history.current[historyPosition.current];
            });
        },
        go: (position) => {
            if (position === historyPosition.current) {
                return;
            }
            innerSetState(() => {
                historyPosition.current =
                    position < 0
                        ? Math.max(history.current.length + position, 0)
                        : Math.min(history.current.length - 1, position);
                return history.current[historyPosition.current];
            });
        },
    }), [state]);
    return [state, setState, historyState];
}

;// CONCATENATED MODULE: ./src/useStateList.ts




function useStateList(stateSet = []) {
    const isMounted = useMountedState();
    const update = useUpdate();
    const index = (0,external_React_.useRef)(0);
    // If new state list is shorter that before - switch to the last element
    src_useUpdateEffect(() => {
        if (stateSet.length <= index.current) {
            index.current = stateSet.length - 1;
            update();
        }
    }, [stateSet.length]);
    const actions = (0,external_React_.useMemo)(() => ({
        next: () => actions.setStateAt(index.current + 1),
        prev: () => actions.setStateAt(index.current - 1),
        setStateAt: (newIndex) => {
            // do nothing on unmounted component
            if (!isMounted())
                return;
            // do nothing on empty states list
            if (!stateSet.length)
                return;
            // in case new index is equal current - do nothing
            if (newIndex === index.current)
                return;
            // it gives the ability to travel through the left and right borders.
            // 4ex: if list contains 5 elements, attempt to set index 9 will bring use to 5th element
            // in case of negative index it will start counting from the right, so -17 will bring us to 4th element
            index.current =
                newIndex >= 0
                    ? newIndex % stateSet.length
                    : stateSet.length + (newIndex % stateSet.length);
            update();
        },
        setState: (state) => {
            // do nothing on unmounted component
            if (!isMounted())
                return;
            const newIndex = stateSet.length ? stateSet.indexOf(state) : -1;
            if (newIndex === -1) {
                throw new Error(`State '${state}' is not a valid state (does not exist in state list)`);
            }
            index.current = newIndex;
            update();
        },
    }), [stateSet]);
    return {
        state: stateSet[index.current],
        currentIndex: index.current,
        ...actions,
    };
}

;// CONCATENATED MODULE: ./src/useThrottle.ts


const useThrottle = (value, ms = 200) => {
    const [state, setState] = (0,external_React_.useState)(value);
    const timeout = (0,external_React_.useRef)();
    const nextValue = (0,external_React_.useRef)(null);
    const hasNextValue = (0,external_React_.useRef)(0);
    (0,external_React_.useEffect)(() => {
        if (!timeout.current) {
            setState(value);
            const timeoutCallback = () => {
                if (hasNextValue.current) {
                    hasNextValue.current = false;
                    setState(nextValue.current);
                    timeout.current = setTimeout(timeoutCallback, ms);
                }
                else {
                    timeout.current = undefined;
                }
            };
            timeout.current = setTimeout(timeoutCallback, ms);
        }
        else {
            nextValue.current = value;
            hasNextValue.current = true;
        }
    }, [value]);
    src_useUnmount(() => {
        timeout.current && clearTimeout(timeout.current);
    });
    return state;
};
/* harmony default export */ const src_useThrottle = (useThrottle);

;// CONCATENATED MODULE: ./src/useThrottleFn.ts


const useThrottleFn = (fn, ms = 200, args) => {
    const [state, setState] = (0,external_React_.useState)(null);
    const timeout = (0,external_React_.useRef)();
    const nextArgs = (0,external_React_.useRef)();
    (0,external_React_.useEffect)(() => {
        if (!timeout.current) {
            setState(fn(...args));
            const timeoutCallback = () => {
                if (nextArgs.current) {
                    setState(fn(...nextArgs.current));
                    nextArgs.current = undefined;
                    timeout.current = setTimeout(timeoutCallback, ms);
                }
                else {
                    timeout.current = undefined;
                }
            };
            timeout.current = setTimeout(timeoutCallback, ms);
        }
        else {
            nextArgs.current = args;
        }
    }, args);
    src_useUnmount(() => {
        timeout.current && clearTimeout(timeout.current);
    });
    return state;
};
/* harmony default export */ const src_useThrottleFn = (useThrottleFn);

;// CONCATENATED MODULE: ./src/useTimeout.ts


function useTimeout(ms = 0) {
    const update = useUpdate();
    return useTimeoutFn(update, ms);
}

;// CONCATENATED MODULE: ./src/useTitle.ts

const DEFAULT_USE_TITLE_OPTIONS = {
    restoreOnUnmount: false,
};
function useTitle(title, options = DEFAULT_USE_TITLE_OPTIONS) {
    const prevTitleRef = (0,external_React_.useRef)(document.title);
    if (document.title !== title)
        document.title = title;
    (0,external_React_.useEffect)(() => {
        if (options && options.restoreOnUnmount) {
            return () => {
                document.title = prevTitleRef.current;
            };
        }
        else {
            return;
        }
    }, []);
}
/* harmony default export */ const src_useTitle = (typeof document !== 'undefined' ? useTitle : (_title) => { });

// EXTERNAL MODULE: ./node_modules/ts-easing/lib/index.js
var ts_easing_lib = __webpack_require__(534);
;// CONCATENATED MODULE: ./src/useTween.ts


const useTween = (easingName = 'inCirc', ms = 200, delay = 0) => {
    const fn = ts_easing_lib/* easing */.U[easingName];
    const t = src_useRaf(ms, delay);
    if (false) {}
    return fn(t);
};
/* harmony default export */ const src_useTween = (useTween);

;// CONCATENATED MODULE: ./src/useUnmountPromise.ts


const useUnmountPromise = () => {
    const refUnmounted = (0,external_React_.useRef)(false);
    src_useEffectOnce(() => () => {
        refUnmounted.current = true;
    });
    const wrapper = (0,external_React_.useMemo)(() => {
        const race = (promise, onError) => {
            const newPromise = new Promise((resolve, reject) => {
                promise.then((result) => {
                    if (!refUnmounted.current)
                        resolve(result);
                }, (error) => {
                    if (!refUnmounted.current)
                        reject(error);
                    else if (onError)
                        onError(error);
                    else
                        console.error('useUnmountPromise', error);
                });
            });
            return newPromise;
        };
        return race;
    }, []);
    return wrapper;
};
/* harmony default export */ const src_useUnmountPromise = (useUnmountPromise);

;// CONCATENATED MODULE: ./src/useUpsert.ts

/**
 * @deprecated Use `useList` hook's upsert action instead
 */
function useUpsert(predicate, initialList = []) {
    const [list, listActions] = src_useList(initialList);
    return [
        list,
        {
            ...listActions,
            upsert: (newItem) => {
                listActions.upsert(predicate, newItem);
            },
        },
    ];
}

;// CONCATENATED MODULE: ./src/useVibrate.ts


const isVibrationApiSupported = isNavigator && 'vibrate' in navigator;
function useVibrate(enabled = true, pattern = [1000, 1000], loop = true) {
    (0,external_React_.useEffect)(() => {
        let interval;
        if (enabled) {
            navigator.vibrate(pattern);
            if (loop) {
                const duration = pattern instanceof Array ? pattern.reduce((a, b) => a + b) : pattern;
                interval = setInterval(() => {
                    navigator.vibrate(pattern);
                }, duration);
            }
        }
        return () => {
            if (enabled) {
                navigator.vibrate(0);
                if (loop) {
                    clearInterval(interval);
                }
            }
        };
    }, [enabled]);
}
/* harmony default export */ const src_useVibrate = (isVibrationApiSupported ? useVibrate : noop);

;// CONCATENATED MODULE: ./src/useVideo.ts

const useVideo = createHTMLMediaHook('video');
/* harmony default export */ const src_useVideo = (useVideo);

;// CONCATENATED MODULE: ./src/useStateValidator.ts

function useStateValidator(state, validator, initialState = [undefined]) {
    const validatorInner = (0,external_React_.useRef)(validator);
    const stateInner = (0,external_React_.useRef)(state);
    validatorInner.current = validator;
    stateInner.current = state;
    const [validity, setValidity] = (0,external_React_.useState)(initialState);
    const validate = (0,external_React_.useCallback)(() => {
        if (validatorInner.current.length >= 2) {
            validatorInner.current(stateInner.current, setValidity);
        }
        else {
            setValidity(validatorInner.current(stateInner.current));
        }
    }, [setValidity]);
    (0,external_React_.useEffect)(() => {
        validate();
    }, [state]);
    return [validity, validate];
}

;// CONCATENATED MODULE: ./node_modules/@xobotyi/scrollbar-width/dist/index.esm.js
var e=function(t){if("undefined"==typeof document)return 0;if(document.body&&(!document.readyState||"loading"!==document.readyState)){if(!0!==t&&"number"==typeof e.__cache)return e.__cache;var o=document.createElement("div"),d=o.style;d.display="block",d.position="absolute",d.width="100px",d.height="100px",d.left="-999px",d.top="-999px",d.overflow="scroll",document.body.insertBefore(o,null);var n=o.clientWidth;if(0!==n)return e.__cache=100-n,document.body.removeChild(o),e.__cache;document.body.removeChild(o)}};

;// CONCATENATED MODULE: ./src/useScrollbarWidth.ts


function useScrollbarWidth() {
    const [sbw, setSbw] = (0,external_React_.useState)(e());
    // this needed to ensure the scrollbar width in case hook called before the DOM is ready
    (0,external_React_.useEffect)(() => {
        if (typeof sbw !== 'undefined') {
            return;
        }
        const raf = requestAnimationFrame(() => {
            setSbw(e());
        });
        return () => cancelAnimationFrame(raf);
    }, []);
    return sbw;
}

;// CONCATENATED MODULE: ./src/useMultiStateValidator.ts

function useMultiStateValidator(states, validator, initialValidity = [undefined]) {
    if (typeof states !== 'object') {
        throw new Error('states expected to be an object or array, got ' + typeof states);
    }
    const validatorInner = (0,external_React_.useRef)(validator);
    const statesInner = (0,external_React_.useRef)(states);
    validatorInner.current = validator;
    statesInner.current = states;
    const [validity, setValidity] = (0,external_React_.useState)(initialValidity);
    const validate = (0,external_React_.useCallback)(() => {
        if (validatorInner.current.length >= 2) {
            validatorInner.current(statesInner.current, setValidity);
        }
        else {
            setValidity(validatorInner.current(statesInner.current));
        }
    }, [setValidity]);
    (0,external_React_.useEffect)(() => {
        validate();
    }, Object.values(states));
    return [validity, validate];
}

;// CONCATENATED MODULE: ./src/useWindowScroll.ts



const useWindowScroll = () => {
    const [state, setState] = src_useRafState(() => ({
        x: isBrowser ? window.pageXOffset : 0,
        y: isBrowser ? window.pageYOffset : 0,
    }));
    (0,external_React_.useEffect)(() => {
        const handler = () => {
            setState((state) => {
                const { pageXOffset, pageYOffset } = window;
                //Check state for change, return same state if no change happened to prevent rerender
                //(see useState/setState documentation). useState/setState is used internally in useRafState/setState.
                return state.x !== pageXOffset || state.y !== pageYOffset
                    ? {
                        x: pageXOffset,
                        y: pageYOffset,
                    }
                    : state;
            });
        };
        //We have to update window scroll at mount, before subscription.
        //Window scroll may be changed between render and effect handler.
        handler();
        on(window, 'scroll', handler, {
            capture: false,
            passive: true,
        });
        return () => {
            off(window, 'scroll', handler);
        };
    }, []);
    return state;
};
/* harmony default export */ const src_useWindowScroll = (useWindowScroll);

;// CONCATENATED MODULE: ./src/useWindowSize.ts



const useWindowSize = (initialWidth = Infinity, initialHeight = Infinity) => {
    const [state, setState] = src_useRafState({
        width: isBrowser ? window.innerWidth : initialWidth,
        height: isBrowser ? window.innerHeight : initialHeight,
    });
    (0,external_React_.useEffect)(() => {
        if (isBrowser) {
            const handler = () => {
                setState({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            };
            on(window, 'resize', handler);
            return () => {
                off(window, 'resize', handler);
            };
        }
    }, []);
    return state;
};
/* harmony default export */ const src_useWindowSize = (useWindowSize);

;// CONCATENATED MODULE: ./src/useMeasure.ts



const useMeasure_defaultState = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
};
function useMeasure() {
    const [element, ref] = (0,external_React_.useState)(null);
    const [rect, setRect] = (0,external_React_.useState)(useMeasure_defaultState);
    const observer = (0,external_React_.useMemo)(() => new window.ResizeObserver((entries) => {
        if (entries[0]) {
            const { x, y, width, height, top, left, bottom, right } = entries[0].contentRect;
            setRect({ x, y, width, height, top, left, bottom, right });
        }
    }), []);
    src_useIsomorphicLayoutEffect(() => {
        if (!element)
            return;
        observer.observe(element);
        return () => {
            observer.disconnect();
        };
    }, [element]);
    return [ref, rect];
}
/* harmony default export */ const src_useMeasure = (isBrowser && typeof window.ResizeObserver !== 'undefined'
    ? useMeasure
    : (() => [noop, useMeasure_defaultState]));

;// CONCATENATED MODULE: ./src/usePinchZoom.ts

var ZoomState;
(function (ZoomState) {
    ZoomState["ZOOMING_IN"] = "ZOOMING_IN";
    ZoomState["ZOOMING_OUT"] = "ZOOMING_OUT";
})(ZoomState || (ZoomState = {}));
const usePinchZoom = (ref) => {
    const cacheRef = (0,external_React_.useMemo)(() => ({
        evCache: [],
        prevDiff: -1,
    }), [ref.current]);
    const [zoomingState, setZoomingState] = (0,external_React_.useState)();
    const pointermove_handler = (ev) => {
        // This function implements a 2-pointer horizontal pinch/zoom gesture.
        //
        // If the distance between the two pointers has increased (zoom in),
        // the target element's background is changed to 'pink' and if the
        // distance is decreasing (zoom out), the color is changed to 'lightblue'.
        //
        // This function sets the target element's border to 'dashed' to visually
        // indicate the pointer's target received a move event.
        // Find this event in the cache and update its record with this event
        for (let i = 0; i < cacheRef.evCache.length; i++) {
            if (ev.pointerId == cacheRef.evCache[i].pointerId) {
                cacheRef.evCache[i] = ev;
                break;
            }
        }
        // If two pointers are down, check for pinch gestures
        if (cacheRef.evCache.length == 2) {
            // console.log(prevDiff)
            // Calculate the distance between the two pointers
            const curDiff = Math.abs(cacheRef.evCache[0].clientX - cacheRef.evCache[1].clientX);
            if (cacheRef.prevDiff > 0) {
                if (curDiff > cacheRef.prevDiff) {
                    // The distance between the two pointers has increased
                    setZoomingState([ZoomState.ZOOMING_IN, curDiff]);
                }
                if (curDiff < cacheRef.prevDiff) {
                    // The distance between the two pointers has decreased
                    setZoomingState([ZoomState.ZOOMING_OUT, curDiff]);
                }
            }
            // Cache the distance for the next move event
            cacheRef.prevDiff = curDiff;
        }
    };
    const pointerdown_handler = (ev) => {
        // The pointerdown event signals the start of a touch interaction.
        // This event is cached to support 2-finger gestures
        cacheRef.evCache.push(ev);
        // console.log('pointerDown', ev);
    };
    const pointerup_handler = (ev) => {
        // Remove this pointer from the cache and reset the target's
        // background and border
        remove_event(ev);
        // If the number of pointers down is less than two then reset diff tracker
        if (cacheRef.evCache.length < 2) {
            cacheRef.prevDiff = -1;
        }
    };
    const remove_event = (ev) => {
        // Remove this event from the target's cache
        for (let i = 0; i < cacheRef.evCache.length; i++) {
            if (cacheRef.evCache[i].pointerId == ev.pointerId) {
                cacheRef.evCache.splice(i, 1);
                break;
            }
        }
    };
    (0,external_React_.useEffect)(() => {
        if (ref?.current) {
            ref.current.onpointerdown = pointerdown_handler;
            ref.current.onpointermove = pointermove_handler;
            ref.current.onpointerup = pointerup_handler;
            ref.current.onpointercancel = pointerup_handler;
            ref.current.onpointerout = pointerup_handler;
            ref.current.onpointerleave = pointerup_handler;
        }
    }, [ref?.current]);
    return zoomingState
        ? { zoomingState: zoomingState[0], pinchState: zoomingState[1] }
        : { zoomingState: null, pinchState: 0 };
};
/* harmony default export */ const src_usePinchZoom = (usePinchZoom);

;// CONCATENATED MODULE: ./src/useRendersCount.ts

function useRendersCount() {
    return ++(0,external_React_.useRef)(0).current;
}

;// CONCATENATED MODULE: ./src/useSet.ts

const useSet = (initialSet = new Set()) => {
    const [set, setSet] = (0,external_React_.useState)(initialSet);
    const stableActions = (0,external_React_.useMemo)(() => {
        const add = (item) => setSet((prevSet) => new Set([...Array.from(prevSet), item]));
        const remove = (item) => setSet((prevSet) => new Set(Array.from(prevSet).filter((i) => i !== item)));
        const toggle = (item) => setSet((prevSet) => prevSet.has(item)
            ? new Set(Array.from(prevSet).filter((i) => i !== item))
            : new Set([...Array.from(prevSet), item]));
        return { add, remove, toggle, reset: () => setSet(initialSet), clear: () => setSet(new Set()) };
    }, [setSet]);
    const utils = {
        has: (0,external_React_.useCallback)((item) => set.has(item), [set]),
        ...stableActions,
    };
    return [set, utils];
};
/* harmony default export */ const src_useSet = (useSet);

;// CONCATENATED MODULE: ./src/factory/createGlobalState.ts




function createGlobalState(initialState) {
    const store = {
        state: initialState instanceof Function ? initialState() : initialState,
        setState(nextState) {
            store.state = resolveHookState(nextState, store.state);
            store.setters.forEach((setter) => setter(store.state));
        },
        setters: [],
    };
    return () => {
        const [globalState, stateSetter] = (0,external_React_.useState)(store.state);
        src_useEffectOnce(() => () => {
            store.setters = store.setters.filter((setter) => setter !== stateSetter);
        });
        src_useIsomorphicLayoutEffect(() => {
            if (!store.setters.includes(stateSetter)) {
                store.setters.push(stateSetter);
            }
        });
        return [globalState, store.setState];
    };
}
/* harmony default export */ const factory_createGlobalState = ((/* unused pure expression or super */ null && (createGlobalState)));

;// CONCATENATED MODULE: ./src/useHash.ts



/**
 * read and write url hash, response to url hash change
 */
const useHash = () => {
    const [hash, setHash] = (0,external_React_.useState)(() => window.location.hash);
    const onHashChange = (0,external_React_.useCallback)(() => {
        setHash(window.location.hash);
    }, []);
    src_useLifecycles(() => {
        on(window, 'hashchange', onHashChange);
    }, () => {
        off(window, 'hashchange', onHashChange);
    });
    const _setHash = (0,external_React_.useCallback)((newHash) => {
        if (newHash !== hash) {
            window.location.hash = newHash;
        }
    }, [hash]);
    return [hash, _setHash];
};

;// CONCATENATED MODULE: ./src/index.ts








































// not exported because of peer dependency
// export { default as useKeyboardJs } from './useKeyboardJs';












































// not exported because of peer dependency
// export { default as useSpring } from './useSpring';






























})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map