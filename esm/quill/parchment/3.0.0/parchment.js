var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/scope.ts
var Scope = /* @__PURE__ */ ((Scope2) => {
  Scope2[Scope2["TYPE"] = 3] = "TYPE";
  Scope2[Scope2["LEVEL"] = 12] = "LEVEL";
  Scope2[Scope2["ATTRIBUTE"] = 13] = "ATTRIBUTE";
  Scope2[Scope2["BLOT"] = 14] = "BLOT";
  Scope2[Scope2["INLINE"] = 7] = "INLINE";
  Scope2[Scope2["BLOCK"] = 11] = "BLOCK";
  Scope2[Scope2["BLOCK_BLOT"] = 10] = "BLOCK_BLOT";
  Scope2[Scope2["INLINE_BLOT"] = 6] = "INLINE_BLOT";
  Scope2[Scope2["BLOCK_ATTRIBUTE"] = 9] = "BLOCK_ATTRIBUTE";
  Scope2[Scope2["INLINE_ATTRIBUTE"] = 5] = "INLINE_ATTRIBUTE";
  Scope2[Scope2["ANY"] = 15] = "ANY";
  return Scope2;
})(Scope || {});
var scope_default = Scope;

// src/attributor/attributor.ts
var Attributor = class {
  constructor(attrName, keyName, options = {}) {
    this.attrName = attrName;
    this.keyName = keyName;
    const attributeBit = scope_default.TYPE & scope_default.ATTRIBUTE;
    this.scope = options.scope != null ? (
      // Ignore type bits, force attribute bit
      options.scope & scope_default.LEVEL | attributeBit
    ) : scope_default.ATTRIBUTE;
    if (options.whitelist != null) {
      this.whitelist = options.whitelist;
    }
  }
  static {
    __name(this, "Attributor");
  }
  static keys(node) {
    return Array.from(node.attributes).map((item) => item.name);
  }
  add(node, value) {
    if (!this.canAdd(node, value)) {
      return false;
    }
    node.setAttribute(this.keyName, value);
    return true;
  }
  canAdd(_node, value) {
    if (this.whitelist == null) {
      return true;
    }
    if (typeof value === "string") {
      return this.whitelist.indexOf(value.replace(/["']/g, "")) > -1;
    } else {
      return this.whitelist.indexOf(value) > -1;
    }
  }
  remove(node) {
    node.removeAttribute(this.keyName);
  }
  value(node) {
    const value = node.getAttribute(this.keyName);
    if (this.canAdd(node, value) && value) {
      return value;
    }
    return "";
  }
};

// src/error.ts
var ParchmentError = class extends Error {
  static {
    __name(this, "ParchmentError");
  }
  constructor(message) {
    message = "[Parchment] " + message;
    super(message);
    this.message = message;
    this.name = this.constructor.name;
  }
};

// src/registry.ts
var Registry = class _Registry {
  constructor() {
    this.attributes = {};
    this.classes = {};
    this.tags = {};
    this.types = {};
  }
  static {
    __name(this, "Registry");
  }
  static {
    this.blots = /* @__PURE__ */ new WeakMap();
  }
  static find(node, bubble = false) {
    if (node == null) {
      return null;
    }
    if (this.blots.has(node)) {
      return this.blots.get(node) || null;
    }
    if (bubble) {
      let parentNode = null;
      try {
        parentNode = node.parentNode;
      } catch (err) {
        return null;
      }
      return this.find(parentNode, bubble);
    }
    return null;
  }
  create(scroll, input, value) {
    const match2 = this.query(input);
    if (match2 == null) {
      throw new ParchmentError(`Unable to create ${input} blot`);
    }
    const blotClass = match2;
    const node = (
      // @ts-expect-error Fix me later
      input instanceof Node || input.nodeType === Node.TEXT_NODE ? input : blotClass.create(value)
    );
    const blot = new blotClass(scroll, node, value);
    _Registry.blots.set(blot.domNode, blot);
    return blot;
  }
  find(node, bubble = false) {
    return _Registry.find(node, bubble);
  }
  query(query, scope = scope_default.ANY) {
    let match2;
    if (typeof query === "string") {
      match2 = this.types[query] || this.attributes[query];
    } else if (query instanceof Text || query.nodeType === Node.TEXT_NODE) {
      match2 = this.types.text;
    } else if (typeof query === "number") {
      if (query & scope_default.LEVEL & scope_default.BLOCK) {
        match2 = this.types.block;
      } else if (query & scope_default.LEVEL & scope_default.INLINE) {
        match2 = this.types.inline;
      }
    } else if (query instanceof Element) {
      const names = (query.getAttribute("class") || "").split(/\s+/);
      names.some((name) => {
        match2 = this.classes[name];
        if (match2) {
          return true;
        }
        return false;
      });
      match2 = match2 || this.tags[query.tagName];
    }
    if (match2 == null) {
      return null;
    }
    if ("scope" in match2 && scope & scope_default.LEVEL & match2.scope && scope & scope_default.TYPE & match2.scope) {
      return match2;
    }
    return null;
  }
  register(...definitions) {
    return definitions.map((definition) => {
      const isBlot = "blotName" in definition;
      const isAttr = "attrName" in definition;
      if (!isBlot && !isAttr) {
        throw new ParchmentError("Invalid definition");
      } else if (isBlot && definition.blotName === "abstract") {
        throw new ParchmentError("Cannot register abstract class");
      }
      const key = isBlot ? definition.blotName : isAttr ? definition.attrName : void 0;
      this.types[key] = definition;
      if (isAttr) {
        if (typeof definition.keyName === "string") {
          this.attributes[definition.keyName] = definition;
        }
      } else if (isBlot) {
        if (definition.className) {
          this.classes[definition.className] = definition;
        }
        if (definition.tagName) {
          if (Array.isArray(definition.tagName)) {
            definition.tagName = definition.tagName.map((tagName) => {
              return tagName.toUpperCase();
            });
          } else {
            definition.tagName = definition.tagName.toUpperCase();
          }
          const tagNames = Array.isArray(definition.tagName) ? definition.tagName : [definition.tagName];
          tagNames.forEach((tag) => {
            if (this.tags[tag] == null || definition.className == null) {
              this.tags[tag] = definition;
            }
          });
        }
      }
      return definition;
    });
  }
};

// src/attributor/class.ts
function match(node, prefix) {
  const className = node.getAttribute("class") || "";
  return className.split(/\s+/).filter((name) => name.indexOf(`${prefix}-`) === 0);
}
__name(match, "match");
var ClassAttributor = class extends Attributor {
  static {
    __name(this, "ClassAttributor");
  }
  static keys(node) {
    return (node.getAttribute("class") || "").split(/\s+/).map((name) => name.split("-").slice(0, -1).join("-"));
  }
  add(node, value) {
    if (!this.canAdd(node, value)) {
      return false;
    }
    this.remove(node);
    node.classList.add(`${this.keyName}-${value}`);
    return true;
  }
  remove(node) {
    const matches = match(node, this.keyName);
    matches.forEach((name) => {
      node.classList.remove(name);
    });
    if (node.classList.length === 0) {
      node.removeAttribute("class");
    }
  }
  value(node) {
    const result = match(node, this.keyName)[0] || "";
    const value = result.slice(this.keyName.length + 1);
    return this.canAdd(node, value) ? value : "";
  }
};
var class_default = ClassAttributor;

// src/attributor/style.ts
function camelize(name) {
  const parts = name.split("-");
  const rest = parts.slice(1).map((part) => part[0].toUpperCase() + part.slice(1)).join("");
  return parts[0] + rest;
}
__name(camelize, "camelize");
var StyleAttributor = class extends Attributor {
  static {
    __name(this, "StyleAttributor");
  }
  static keys(node) {
    return (node.getAttribute("style") || "").split(";").map((value) => {
      const arr = value.split(":");
      return arr[0].trim();
    });
  }
  add(node, value) {
    if (!this.canAdd(node, value)) {
      return false;
    }
    node.style[camelize(this.keyName)] = value;
    return true;
  }
  remove(node) {
    node.style[camelize(this.keyName)] = "";
    if (!node.getAttribute("style")) {
      node.removeAttribute("style");
    }
  }
  value(node) {
    const value = node.style[camelize(this.keyName)];
    return this.canAdd(node, value) ? value : "";
  }
};
var style_default = StyleAttributor;

// src/attributor/store.ts
var AttributorStore = class {
  constructor(domNode) {
    this.attributes = {};
    this.domNode = domNode;
    this.build();
  }
  static {
    __name(this, "AttributorStore");
  }
  attribute(attribute, value) {
    if (value) {
      if (attribute.add(this.domNode, value)) {
        if (attribute.value(this.domNode) != null) {
          this.attributes[attribute.attrName] = attribute;
        } else {
          delete this.attributes[attribute.attrName];
        }
      }
    } else {
      attribute.remove(this.domNode);
      delete this.attributes[attribute.attrName];
    }
  }
  build() {
    this.attributes = {};
    const blot = Registry.find(this.domNode);
    if (blot == null) {
      return;
    }
    const attributes = Attributor.keys(this.domNode);
    const classes = class_default.keys(this.domNode);
    const styles = style_default.keys(this.domNode);
    attributes.concat(classes).concat(styles).forEach((name) => {
      const attr = blot.scroll.query(name, scope_default.ATTRIBUTE);
      if (attr instanceof Attributor) {
        this.attributes[attr.attrName] = attr;
      }
    });
  }
  copy(target) {
    Object.keys(this.attributes).forEach((key) => {
      const value = this.attributes[key].value(this.domNode);
      target.format(key, value);
    });
  }
  move(target) {
    this.copy(target);
    Object.keys(this.attributes).forEach((key) => {
      this.attributes[key].remove(this.domNode);
    });
    this.attributes = {};
  }
  values() {
    return Object.keys(this.attributes).reduce(
      (attributes, name) => {
        attributes[name] = this.attributes[name].value(this.domNode);
        return attributes;
      },
      {}
    );
  }
};
var store_default = AttributorStore;

// src/blot/abstract/shadow.ts
var ShadowBlot = class {
  constructor(scroll, domNode) {
    this.scroll = scroll;
    this.domNode = domNode;
    Registry.blots.set(domNode, this);
    this.prev = null;
    this.next = null;
  }
  static {
    __name(this, "ShadowBlot");
  }
  static {
    this.blotName = "abstract";
  }
  static create(rawValue) {
    if (this.tagName == null) {
      throw new ParchmentError("Blot definition missing tagName");
    }
    let node;
    let value;
    if (Array.isArray(this.tagName)) {
      if (typeof rawValue === "string") {
        value = rawValue.toUpperCase();
        if (parseInt(value, 10).toString() === value) {
          value = parseInt(value, 10);
        }
      } else if (typeof rawValue === "number") {
        value = rawValue;
      }
      if (typeof value === "number") {
        node = document.createElement(this.tagName[value - 1]);
      } else if (value && this.tagName.indexOf(value) > -1) {
        node = document.createElement(value);
      } else {
        node = document.createElement(this.tagName[0]);
      }
    } else {
      node = document.createElement(this.tagName);
    }
    if (this.className) {
      node.classList.add(this.className);
    }
    return node;
  }
  // Hack for accessing inherited static methods
  get statics() {
    return this.constructor;
  }
  attach() {
  }
  clone() {
    const domNode = this.domNode.cloneNode(false);
    return this.scroll.create(domNode);
  }
  detach() {
    if (this.parent != null) {
      this.parent.removeChild(this);
    }
    Registry.blots.delete(this.domNode);
  }
  deleteAt(index, length) {
    const blot = this.isolate(index, length);
    blot.remove();
  }
  formatAt(index, length, name, value) {
    const blot = this.isolate(index, length);
    if (this.scroll.query(name, scope_default.BLOT) != null && value) {
      blot.wrap(name, value);
    } else if (this.scroll.query(name, scope_default.ATTRIBUTE) != null) {
      const parent = this.scroll.create(this.statics.scope);
      blot.wrap(parent);
      parent.format(name, value);
    }
  }
  insertAt(index, value, def) {
    const blot = def == null ? this.scroll.create("text", value) : this.scroll.create(value, def);
    const ref = this.split(index);
    this.parent.insertBefore(blot, ref || void 0);
  }
  isolate(index, length) {
    const target = this.split(index);
    if (target == null) {
      throw new Error("Attempt to isolate at end");
    }
    target.split(length);
    return target;
  }
  length() {
    return 1;
  }
  offset(root = this.parent) {
    if (this.parent == null || this === root) {
      return 0;
    }
    return this.parent.children.offset(this) + this.parent.offset(root);
  }
  optimize(_context) {
    if (this.statics.requiredContainer && !(this.parent instanceof this.statics.requiredContainer)) {
      this.wrap(this.statics.requiredContainer.blotName);
    }
  }
  remove() {
    if (this.domNode.parentNode != null) {
      this.domNode.parentNode.removeChild(this.domNode);
    }
    this.detach();
  }
  replaceWith(name, value) {
    const replacement = typeof name === "string" ? this.scroll.create(name, value) : name;
    if (this.parent != null) {
      this.parent.insertBefore(replacement, this.next || void 0);
      this.remove();
    }
    return replacement;
  }
  split(index, _force) {
    return index === 0 ? this : this.next;
  }
  update(_mutations, _context) {
  }
  wrap(name, value) {
    const wrapper = typeof name === "string" ? this.scroll.create(name, value) : name;
    if (this.parent != null) {
      this.parent.insertBefore(wrapper, this.next || void 0);
    }
    if (typeof wrapper.appendChild !== "function") {
      throw new ParchmentError(`Cannot wrap ${name}`);
    }
    wrapper.appendChild(this);
    return wrapper;
  }
};
var shadow_default = ShadowBlot;

// src/blot/abstract/leaf.ts
var LeafBlot = class extends shadow_default {
  static {
    __name(this, "LeafBlot");
  }
  static {
    this.scope = scope_default.INLINE_BLOT;
  }
  /**
   * Returns the value represented by domNode if it is this Blot's type
   * No checking that domNode can represent this Blot type is required so
   * applications needing it should check externally before calling.
   */
  static value(_domNode) {
    return true;
  }
  /**
   * Given location represented by node and offset from DOM Selection Range,
   * return index to that location.
   */
  index(node, offset) {
    if (this.domNode === node || this.domNode.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      return Math.min(offset, 1);
    }
    return -1;
  }
  /**
   * Given index to location within blot, return node and offset representing
   * that location, consumable by DOM Selection Range
   */
  position(index, _inclusive) {
    const childNodes = Array.from(this.parent.domNode.childNodes);
    let offset = childNodes.indexOf(this.domNode);
    if (index > 0) {
      offset += 1;
    }
    return [this.parent.domNode, offset];
  }
  /**
   * Return value represented by this blot
   * Should not change without interaction from API or
   * user change detectable by update()
   */
  value() {
    return {
      [this.statics.blotName]: this.statics.value(this.domNode) || true
    };
  }
};
var leaf_default = LeafBlot;

// src/collection/linked-list.ts
var LinkedList = class {
  static {
    __name(this, "LinkedList");
  }
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  append(...nodes) {
    this.insertBefore(nodes[0], null);
    if (nodes.length > 1) {
      const rest = nodes.slice(1);
      this.append(...rest);
    }
  }
  at(index) {
    const next = this.iterator();
    let cur = next();
    while (cur && index > 0) {
      index -= 1;
      cur = next();
    }
    return cur;
  }
  contains(node) {
    const next = this.iterator();
    let cur = next();
    while (cur) {
      if (cur === node) {
        return true;
      }
      cur = next();
    }
    return false;
  }
  indexOf(node) {
    const next = this.iterator();
    let cur = next();
    let index = 0;
    while (cur) {
      if (cur === node) {
        return index;
      }
      index += 1;
      cur = next();
    }
    return -1;
  }
  insertBefore(node, refNode) {
    if (node == null) {
      return;
    }
    this.remove(node);
    node.next = refNode;
    if (refNode != null) {
      node.prev = refNode.prev;
      if (refNode.prev != null) {
        refNode.prev.next = node;
      }
      refNode.prev = node;
      if (refNode === this.head) {
        this.head = node;
      }
    } else if (this.tail != null) {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    } else {
      node.prev = null;
      this.head = this.tail = node;
    }
    this.length += 1;
  }
  offset(target) {
    let index = 0;
    let cur = this.head;
    while (cur != null) {
      if (cur === target) {
        return index;
      }
      index += cur.length();
      cur = cur.next;
    }
    return -1;
  }
  remove(node) {
    if (!this.contains(node)) {
      return;
    }
    if (node.prev != null) {
      node.prev.next = node.next;
    }
    if (node.next != null) {
      node.next.prev = node.prev;
    }
    if (node === this.head) {
      this.head = node.next;
    }
    if (node === this.tail) {
      this.tail = node.prev;
    }
    this.length -= 1;
  }
  iterator(curNode = this.head) {
    return () => {
      const ret = curNode;
      if (curNode != null) {
        curNode = curNode.next;
      }
      return ret;
    };
  }
  find(index, inclusive = false) {
    const next = this.iterator();
    let cur = next();
    while (cur) {
      const length = cur.length();
      if (index < length || inclusive && index === length && (cur.next == null || cur.next.length() !== 0)) {
        return [cur, index];
      }
      index -= length;
      cur = next();
    }
    return [null, 0];
  }
  forEach(callback) {
    const next = this.iterator();
    let cur = next();
    while (cur) {
      callback(cur);
      cur = next();
    }
  }
  forEachAt(index, length, callback) {
    if (length <= 0) {
      return;
    }
    const [startNode, offset] = this.find(index);
    let curIndex = index - offset;
    const next = this.iterator(startNode);
    let cur = next();
    while (cur && curIndex < index + length) {
      const curLength = cur.length();
      if (index > curIndex) {
        callback(
          cur,
          index - curIndex,
          Math.min(length, curIndex + curLength - index)
        );
      } else {
        callback(cur, 0, Math.min(curLength, index + length - curIndex));
      }
      curIndex += curLength;
      cur = next();
    }
  }
  map(callback) {
    return this.reduce((memo, cur) => {
      memo.push(callback(cur));
      return memo;
    }, []);
  }
  reduce(callback, memo) {
    const next = this.iterator();
    let cur = next();
    while (cur) {
      memo = callback(memo, cur);
      cur = next();
    }
    return memo;
  }
};
var linked_list_default = LinkedList;

// src/blot/abstract/parent.ts
function makeAttachedBlot(node, scroll) {
  const found = scroll.find(node);
  if (found)
    return found;
  try {
    return scroll.create(node);
  } catch (e) {
    const blot = scroll.create(scope_default.INLINE);
    Array.from(node.childNodes).forEach((child) => {
      blot.domNode.appendChild(child);
    });
    if (node.parentNode) {
      node.parentNode.replaceChild(blot.domNode, node);
    }
    blot.attach();
    return blot;
  }
}
__name(makeAttachedBlot, "makeAttachedBlot");
var ParentBlot = class _ParentBlot extends shadow_default {
  constructor(scroll, domNode) {
    super(scroll, domNode);
    this.uiNode = null;
    this.build();
  }
  static {
    __name(this, "ParentBlot");
  }
  static {
    this.uiClass = "";
  }
  appendChild(other) {
    this.insertBefore(other);
  }
  attach() {
    super.attach();
    this.children.forEach((child) => {
      child.attach();
    });
  }
  attachUI(node) {
    if (this.uiNode != null) {
      this.uiNode.remove();
    }
    this.uiNode = node;
    if (_ParentBlot.uiClass) {
      this.uiNode.classList.add(_ParentBlot.uiClass);
    }
    this.uiNode.setAttribute("contenteditable", "false");
    this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
  }
  /**
   * Called during construction, should fill its own children LinkedList.
   */
  build() {
    this.children = new linked_list_default();
    Array.from(this.domNode.childNodes).filter((node) => node !== this.uiNode).reverse().forEach((node) => {
      try {
        const child = makeAttachedBlot(node, this.scroll);
        this.insertBefore(child, this.children.head || void 0);
      } catch (err) {
        if (err instanceof ParchmentError) {
          return;
        } else {
          throw err;
        }
      }
    });
  }
  deleteAt(index, length) {
    if (index === 0 && length === this.length()) {
      return this.remove();
    }
    this.children.forEachAt(index, length, (child, offset, childLength) => {
      child.deleteAt(offset, childLength);
    });
  }
  descendant(criteria, index = 0) {
    const [child, offset] = this.children.find(index);
    if (criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria) {
      return [child, offset];
    } else if (child instanceof _ParentBlot) {
      return child.descendant(criteria, offset);
    } else {
      return [null, -1];
    }
  }
  descendants(criteria, index = 0, length = Number.MAX_VALUE) {
    let descendants = [];
    let lengthLeft = length;
    this.children.forEachAt(
      index,
      length,
      (child, childIndex, childLength) => {
        if (criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria) {
          descendants.push(child);
        }
        if (child instanceof _ParentBlot) {
          descendants = descendants.concat(
            child.descendants(criteria, childIndex, lengthLeft)
          );
        }
        lengthLeft -= childLength;
      }
    );
    return descendants;
  }
  detach() {
    this.children.forEach((child) => {
      child.detach();
    });
    super.detach();
  }
  enforceAllowedChildren() {
    let done = false;
    this.children.forEach((child) => {
      if (done) {
        return;
      }
      const allowed = this.statics.allowedChildren.some(
        (def) => child instanceof def
      );
      if (allowed) {
        return;
      }
      if (child.statics.scope === scope_default.BLOCK_BLOT) {
        if (child.next != null) {
          this.splitAfter(child);
        }
        if (child.prev != null) {
          this.splitAfter(child.prev);
        }
        child.parent.unwrap();
        done = true;
      } else if (child instanceof _ParentBlot) {
        child.unwrap();
      } else {
        child.remove();
      }
    });
  }
  formatAt(index, length, name, value) {
    this.children.forEachAt(index, length, (child, offset, childLength) => {
      child.formatAt(offset, childLength, name, value);
    });
  }
  insertAt(index, value, def) {
    const [child, offset] = this.children.find(index);
    if (child) {
      child.insertAt(offset, value, def);
    } else {
      const blot = def == null ? this.scroll.create("text", value) : this.scroll.create(value, def);
      this.appendChild(blot);
    }
  }
  insertBefore(childBlot, refBlot) {
    if (childBlot.parent != null) {
      childBlot.parent.children.remove(childBlot);
    }
    let refDomNode = null;
    this.children.insertBefore(childBlot, refBlot || null);
    childBlot.parent = this;
    if (refBlot != null) {
      refDomNode = refBlot.domNode;
    }
    if (this.domNode.parentNode !== childBlot.domNode || this.domNode.nextSibling !== refDomNode) {
      this.domNode.insertBefore(childBlot.domNode, refDomNode);
    }
    childBlot.attach();
  }
  length() {
    return this.children.reduce((memo, child) => {
      return memo + child.length();
    }, 0);
  }
  moveChildren(targetParent, refNode) {
    this.children.forEach((child) => {
      targetParent.insertBefore(child, refNode);
    });
  }
  optimize(context) {
    super.optimize(context);
    this.enforceAllowedChildren();
    if (this.uiNode != null && this.uiNode !== this.domNode.firstChild) {
      this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
    }
    if (this.children.length === 0) {
      if (this.statics.defaultChild != null) {
        const child = this.scroll.create(this.statics.defaultChild.blotName);
        this.appendChild(child);
      } else {
        this.remove();
      }
    }
  }
  path(index, inclusive = false) {
    const [child, offset] = this.children.find(index, inclusive);
    const position = [[this, index]];
    if (child instanceof _ParentBlot) {
      return position.concat(child.path(offset, inclusive));
    } else if (child != null) {
      position.push([child, offset]);
    }
    return position;
  }
  removeChild(child) {
    this.children.remove(child);
  }
  replaceWith(name, value) {
    const replacement = typeof name === "string" ? this.scroll.create(name, value) : name;
    if (replacement instanceof _ParentBlot) {
      this.moveChildren(replacement);
    }
    return super.replaceWith(replacement);
  }
  split(index, force = false) {
    if (!force) {
      if (index === 0) {
        return this;
      }
      if (index === this.length()) {
        return this.next;
      }
    }
    const after = this.clone();
    if (this.parent) {
      this.parent.insertBefore(after, this.next || void 0);
    }
    this.children.forEachAt(index, this.length(), (child, offset, _length) => {
      const split = child.split(offset, force);
      if (split != null) {
        after.appendChild(split);
      }
    });
    return after;
  }
  splitAfter(child) {
    const after = this.clone();
    while (child.next != null) {
      after.appendChild(child.next);
    }
    if (this.parent) {
      this.parent.insertBefore(after, this.next || void 0);
    }
    return after;
  }
  unwrap() {
    if (this.parent) {
      this.moveChildren(this.parent, this.next || void 0);
    }
    this.remove();
  }
  update(mutations, _context) {
    const addedNodes = [];
    const removedNodes = [];
    mutations.forEach((mutation) => {
      if (mutation.target === this.domNode && mutation.type === "childList") {
        addedNodes.push(...mutation.addedNodes);
        removedNodes.push(...mutation.removedNodes);
      }
    });
    removedNodes.forEach((node) => {
      if (node.parentNode != null && // @ts-expect-error Fix me later
      node.tagName !== "IFRAME" && document.body.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        return;
      }
      const blot = this.scroll.find(node);
      if (blot == null) {
        return;
      }
      if (blot.domNode.parentNode == null || blot.domNode.parentNode === this.domNode) {
        blot.detach();
      }
    });
    addedNodes.filter((node) => {
      return node.parentNode === this.domNode && node !== this.uiNode;
    }).sort((a, b) => {
      if (a === b) {
        return 0;
      }
      if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) {
        return 1;
      }
      return -1;
    }).forEach((node) => {
      let refBlot = null;
      if (node.nextSibling != null) {
        refBlot = this.scroll.find(node.nextSibling);
      }
      const blot = makeAttachedBlot(node, this.scroll);
      if (blot.next !== refBlot || blot.next == null) {
        if (blot.parent != null) {
          blot.parent.removeChild(this);
        }
        this.insertBefore(blot, refBlot || void 0);
      }
    });
    this.enforceAllowedChildren();
  }
};
var parent_default = ParentBlot;

// src/blot/inline.ts
function isEqual(obj1, obj2) {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  for (const prop in obj1) {
    if (obj1[prop] !== obj2[prop]) {
      return false;
    }
  }
  return true;
}
__name(isEqual, "isEqual");
var InlineBlot = class _InlineBlot extends parent_default {
  static {
    __name(this, "InlineBlot");
  }
  static {
    this.allowedChildren = [_InlineBlot, leaf_default];
  }
  static {
    this.blotName = "inline";
  }
  static {
    this.scope = scope_default.INLINE_BLOT;
  }
  static {
    this.tagName = "SPAN";
  }
  static create(value) {
    return super.create(value);
  }
  static formats(domNode, scroll) {
    const match2 = scroll.query(_InlineBlot.blotName);
    if (match2 != null && domNode.tagName === match2.tagName) {
      return void 0;
    } else if (typeof this.tagName === "string") {
      return true;
    } else if (Array.isArray(this.tagName)) {
      return domNode.tagName.toLowerCase();
    }
    return void 0;
  }
  constructor(scroll, domNode) {
    super(scroll, domNode);
    this.attributes = new store_default(this.domNode);
  }
  format(name, value) {
    if (name === this.statics.blotName && !value) {
      this.children.forEach((child) => {
        if (!(child instanceof _InlineBlot)) {
          child = child.wrap(_InlineBlot.blotName, true);
        }
        this.attributes.copy(child);
      });
      this.unwrap();
    } else {
      const format = this.scroll.query(name, scope_default.INLINE);
      if (format == null) {
        return;
      }
      if (format instanceof Attributor) {
        this.attributes.attribute(format, value);
      } else if (value && (name !== this.statics.blotName || this.formats()[name] !== value)) {
        this.replaceWith(name, value);
      }
    }
  }
  formats() {
    const formats = this.attributes.values();
    const format = this.statics.formats(this.domNode, this.scroll);
    if (format != null) {
      formats[this.statics.blotName] = format;
    }
    return formats;
  }
  formatAt(index, length, name, value) {
    if (this.formats()[name] != null || this.scroll.query(name, scope_default.ATTRIBUTE)) {
      const blot = this.isolate(index, length);
      blot.format(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }
  optimize(context) {
    super.optimize(context);
    const formats = this.formats();
    if (Object.keys(formats).length === 0) {
      return this.unwrap();
    }
    const next = this.next;
    if (next instanceof _InlineBlot && next.prev === this && isEqual(formats, next.formats())) {
      next.moveChildren(this);
      next.remove();
    }
  }
  replaceWith(name, value) {
    const replacement = super.replaceWith(name, value);
    this.attributes.copy(replacement);
    return replacement;
  }
  update(mutations, context) {
    super.update(mutations, context);
    const attributeChanged = mutations.some(
      (mutation) => mutation.target === this.domNode && mutation.type === "attributes"
    );
    if (attributeChanged) {
      this.attributes.build();
    }
  }
  wrap(name, value) {
    const wrapper = super.wrap(name, value);
    if (wrapper instanceof _InlineBlot) {
      this.attributes.move(wrapper);
    }
    return wrapper;
  }
};
var inline_default = InlineBlot;

// src/blot/block.ts
var BlockBlot = class _BlockBlot extends parent_default {
  static {
    __name(this, "BlockBlot");
  }
  static {
    this.blotName = "block";
  }
  static {
    this.scope = scope_default.BLOCK_BLOT;
  }
  static {
    this.tagName = "P";
  }
  static {
    this.allowedChildren = [
      inline_default,
      _BlockBlot,
      leaf_default
    ];
  }
  static create(value) {
    return super.create(value);
  }
  static formats(domNode, scroll) {
    const match2 = scroll.query(_BlockBlot.blotName);
    if (match2 != null && domNode.tagName === match2.tagName) {
      return void 0;
    } else if (typeof this.tagName === "string") {
      return true;
    } else if (Array.isArray(this.tagName)) {
      return domNode.tagName.toLowerCase();
    }
  }
  constructor(scroll, domNode) {
    super(scroll, domNode);
    this.attributes = new store_default(this.domNode);
  }
  format(name, value) {
    const format = this.scroll.query(name, scope_default.BLOCK);
    if (format == null) {
      return;
    } else if (format instanceof Attributor) {
      this.attributes.attribute(format, value);
    } else if (name === this.statics.blotName && !value) {
      this.replaceWith(_BlockBlot.blotName);
    } else if (value && (name !== this.statics.blotName || this.formats()[name] !== value)) {
      this.replaceWith(name, value);
    }
  }
  formats() {
    const formats = this.attributes.values();
    const format = this.statics.formats(this.domNode, this.scroll);
    if (format != null) {
      formats[this.statics.blotName] = format;
    }
    return formats;
  }
  formatAt(index, length, name, value) {
    if (this.scroll.query(name, scope_default.BLOCK) != null) {
      this.format(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }
  insertAt(index, value, def) {
    if (def == null || this.scroll.query(value, scope_default.INLINE) != null) {
      super.insertAt(index, value, def);
    } else {
      const after = this.split(index);
      if (after != null) {
        const blot = this.scroll.create(value, def);
        after.parent.insertBefore(blot, after);
      } else {
        throw new Error("Attempt to insertAt after block boundaries");
      }
    }
  }
  replaceWith(name, value) {
    const replacement = super.replaceWith(name, value);
    this.attributes.copy(replacement);
    return replacement;
  }
  update(mutations, context) {
    super.update(mutations, context);
    const attributeChanged = mutations.some(
      (mutation) => mutation.target === this.domNode && mutation.type === "attributes"
    );
    if (attributeChanged) {
      this.attributes.build();
    }
  }
};
var block_default = BlockBlot;

// src/blot/abstract/container.ts
var ContainerBlot = class extends parent_default {
  static {
    __name(this, "ContainerBlot");
  }
  static {
    this.blotName = "container";
  }
  static {
    this.scope = scope_default.BLOCK_BLOT;
  }
  checkMerge() {
    return this.next !== null && this.next.statics.blotName === this.statics.blotName;
  }
  deleteAt(index, length) {
    super.deleteAt(index, length);
    this.enforceAllowedChildren();
  }
  formatAt(index, length, name, value) {
    super.formatAt(index, length, name, value);
    this.enforceAllowedChildren();
  }
  insertAt(index, value, def) {
    super.insertAt(index, value, def);
    this.enforceAllowedChildren();
  }
  optimize(context) {
    super.optimize(context);
    if (this.children.length > 0 && this.next != null && this.checkMerge()) {
      this.next.moveChildren(this);
      this.next.remove();
    }
  }
};
var container_default = ContainerBlot;

// src/blot/embed.ts
var EmbedBlot = class extends leaf_default {
  static {
    __name(this, "EmbedBlot");
  }
  static formats(_domNode, _scroll) {
    return void 0;
  }
  format(name, value) {
    super.formatAt(0, this.length(), name, value);
  }
  formatAt(index, length, name, value) {
    if (index === 0 && length === this.length()) {
      this.format(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }
  formats() {
    return this.statics.formats(this.domNode, this.scroll);
  }
};
var embed_default = EmbedBlot;

// src/blot/scroll.ts
var OBSERVER_CONFIG = {
  attributes: true,
  characterData: true,
  characterDataOldValue: true,
  childList: true,
  subtree: true
};
var MAX_OPTIMIZE_ITERATIONS = 100;
var ScrollBlot = class extends parent_default {
  constructor(registry, node) {
    super(null, node);
    this.registry = registry;
    this.scroll = this;
    this.build();
    this.observer = new MutationObserver((mutations) => {
      this.update(mutations);
    });
    this.observer.observe(this.domNode, OBSERVER_CONFIG);
    this.attach();
  }
  static {
    __name(this, "ScrollBlot");
  }
  static {
    this.blotName = "scroll";
  }
  static {
    this.defaultChild = block_default;
  }
  static {
    this.allowedChildren = [block_default, container_default];
  }
  static {
    this.scope = scope_default.BLOCK_BLOT;
  }
  static {
    this.tagName = "DIV";
  }
  create(input, value) {
    return this.registry.create(this, input, value);
  }
  find(node, bubble = false) {
    const blot = this.registry.find(node, bubble);
    if (!blot) {
      return null;
    }
    if (blot.scroll === this) {
      return blot;
    }
    return bubble ? this.find(blot.scroll.domNode.parentNode, true) : null;
  }
  query(query, scope = scope_default.ANY) {
    return this.registry.query(query, scope);
  }
  register(...definitions) {
    return this.registry.register(...definitions);
  }
  build() {
    if (this.scroll == null) {
      return;
    }
    super.build();
  }
  detach() {
    super.detach();
    this.observer.disconnect();
  }
  deleteAt(index, length) {
    this.update();
    if (index === 0 && length === this.length()) {
      this.children.forEach((child) => {
        child.remove();
      });
    } else {
      super.deleteAt(index, length);
    }
  }
  formatAt(index, length, name, value) {
    this.update();
    super.formatAt(index, length, name, value);
  }
  insertAt(index, value, def) {
    this.update();
    super.insertAt(index, value, def);
  }
  optimize(mutations = [], context = {}) {
    super.optimize(context);
    const mutationsMap = context.mutationsMap || /* @__PURE__ */ new WeakMap();
    let records = Array.from(this.observer.takeRecords());
    while (records.length > 0) {
      mutations.push(records.pop());
    }
    const mark = /* @__PURE__ */ __name((blot, markParent = true) => {
      if (blot == null || blot === this) {
        return;
      }
      if (blot.domNode.parentNode == null) {
        return;
      }
      if (!mutationsMap.has(blot.domNode)) {
        mutationsMap.set(blot.domNode, []);
      }
      if (markParent) {
        mark(blot.parent);
      }
    }, "mark");
    const optimize = /* @__PURE__ */ __name((blot) => {
      if (!mutationsMap.has(blot.domNode)) {
        return;
      }
      if (blot instanceof parent_default) {
        blot.children.forEach(optimize);
      }
      mutationsMap.delete(blot.domNode);
      blot.optimize(context);
    }, "optimize");
    let remaining = mutations;
    for (let i = 0; remaining.length > 0; i += 1) {
      if (i >= MAX_OPTIMIZE_ITERATIONS) {
        throw new Error("[Parchment] Maximum optimize iterations reached");
      }
      remaining.forEach((mutation) => {
        const blot = this.find(mutation.target, true);
        if (blot == null) {
          return;
        }
        if (blot.domNode === mutation.target) {
          if (mutation.type === "childList") {
            mark(this.find(mutation.previousSibling, false));
            Array.from(mutation.addedNodes).forEach((node) => {
              const child = this.find(node, false);
              mark(child, false);
              if (child instanceof parent_default) {
                child.children.forEach((grandChild) => {
                  mark(grandChild, false);
                });
              }
            });
          } else if (mutation.type === "attributes") {
            mark(blot.prev);
          }
        }
        mark(blot);
      });
      this.children.forEach(optimize);
      remaining = Array.from(this.observer.takeRecords());
      records = remaining.slice();
      while (records.length > 0) {
        mutations.push(records.pop());
      }
    }
  }
  update(mutations, context = {}) {
    mutations = mutations || this.observer.takeRecords();
    const mutationsMap = /* @__PURE__ */ new WeakMap();
    mutations.map((mutation) => {
      const blot = this.find(mutation.target, true);
      if (blot == null) {
        return null;
      }
      if (mutationsMap.has(blot.domNode)) {
        mutationsMap.get(blot.domNode).push(mutation);
        return null;
      } else {
        mutationsMap.set(blot.domNode, [mutation]);
        return blot;
      }
    }).forEach((blot) => {
      if (blot != null && blot !== this && mutationsMap.has(blot.domNode)) {
        blot.update(mutationsMap.get(blot.domNode) || [], context);
      }
    });
    context.mutationsMap = mutationsMap;
    if (mutationsMap.has(this.domNode)) {
      super.update(mutationsMap.get(this.domNode), context);
    }
    this.optimize(mutations, context);
  }
};
var scroll_default = ScrollBlot;

// src/blot/text.ts
var TextBlot = class _TextBlot extends leaf_default {
  static {
    __name(this, "TextBlot");
  }
  static {
    this.blotName = "text";
  }
  static {
    this.scope = scope_default.INLINE_BLOT;
  }
  static create(value) {
    return document.createTextNode(value);
  }
  static value(domNode) {
    return domNode.data;
  }
  constructor(scroll, node) {
    super(scroll, node);
    this.text = this.statics.value(this.domNode);
  }
  deleteAt(index, length) {
    this.domNode.data = this.text = this.text.slice(0, index) + this.text.slice(index + length);
  }
  index(node, offset) {
    if (this.domNode === node) {
      return offset;
    }
    return -1;
  }
  insertAt(index, value, def) {
    if (def == null) {
      this.text = this.text.slice(0, index) + value + this.text.slice(index);
      this.domNode.data = this.text;
    } else {
      super.insertAt(index, value, def);
    }
  }
  length() {
    return this.text.length;
  }
  optimize(context) {
    super.optimize(context);
    this.text = this.statics.value(this.domNode);
    if (this.text.length === 0) {
      this.remove();
    } else if (this.next instanceof _TextBlot && this.next.prev === this) {
      this.insertAt(this.length(), this.next.value());
      this.next.remove();
    }
  }
  position(index, _inclusive = false) {
    return [this.domNode, index];
  }
  split(index, force = false) {
    if (!force) {
      if (index === 0) {
        return this;
      }
      if (index === this.length()) {
        return this.next;
      }
    }
    const after = this.scroll.create(this.domNode.splitText(index));
    this.parent.insertBefore(after, this.next || void 0);
    this.text = this.statics.value(this.domNode);
    return after;
  }
  update(mutations, _context) {
    if (mutations.some((mutation) => {
      return mutation.type === "characterData" && mutation.target === this.domNode;
    })) {
      this.text = this.statics.value(this.domNode);
    }
  }
  value() {
    return this.text;
  }
};
var text_default = TextBlot;
export {
  Attributor,
  store_default as AttributorStore,
  block_default as BlockBlot,
  class_default as ClassAttributor,
  container_default as ContainerBlot,
  embed_default as EmbedBlot,
  inline_default as InlineBlot,
  leaf_default as LeafBlot,
  parent_default as ParentBlot,
  Registry,
  scope_default as Scope,
  scroll_default as ScrollBlot,
  style_default as StyleAttributor,
  text_default as TextBlot
};
//# sourceMappingURL=parchment.js.map
