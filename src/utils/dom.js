import _ from 'lodash';

export const getNodePosition = (node) => {
  const box = node.getBoundingClientRect();
  const body = document.body;
  const docElem = document.documentElement;

  const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
  const clientTop = docElem.clientTop || body.clientTop || 0;
  const clientLeft = docElem.clientLeft || body.clientLeft || 0;

  const top = box.top + scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;

  return {
    left: Math.round(left),
    top: Math.round(top),
  };
};

export const getCursorPosition = (e) => {
  const x = e.pageX;

  const y = e.pageY;

  return [x < 0 ? 0 : x, y < 0 ? 0 : y];
};

export const getNodeSize = (node) => {
  return {
    height: node.offsetHeight,
    width: node.offsetWidth,
  };
};

/**
 * Get the width of the browser scrollbar
 * @return {number}
 */
export const getScrollbarWidth = () => {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';

  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;

  outer.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;

  outer.parentNode.removeChild(outer);

  return widthNoScroll - widthWithScroll;
};

/**
 * Get the CSS Value
 * @param {node} node
 * @param {string} property (CSS Property, not Style Object)
 * @return {string}
 */
export function getCSSValue(node, property) {
  if (!node) {
    return '';
  }

  return window.getComputedStyle(node).getPropertyValue(property);
}

/**
 * Find the closest node which has a scroll (overflow: auto)
 * @param {node} node
 * @return {node}
 */
// eslint-disable-next-line no-underscore-dangle
const _findScrollableParent = (node) => {
  if (node == null || node === '' || node === document.body) {
    return { node: document.body, axis: 'xy' };
  }

  const xy = getCSSValue(node, 'overflow');
  const x = getCSSValue(node, 'overflow-x');
  const y = getCSSValue(node, 'overflow-y');

  if (xy === 'auto' || xy === 'scroll') {
    return { node, axis: 'xy' };
  }
  if (x === 'auto' || x === 'scroll') {
    return { node, axis: 'x' };
  }
  if (y === 'auto' || y === 'scroll') {
    return { node, axis: 'y' };
  }
  return _findScrollableParent(node.parentNode);
};

export const findScrollableParent = (node) => {
  return _findScrollableParent(node).node;
};

export const findScrollableParents = (node) => {
  const first = _findScrollableParent(node);
  if (first.axis === 'xy') {
    return [first.node];
  }

  return [first.node, ...findScrollableParents(first.node.parentNode)];
};

/**
 * Find the closest node
 * @param {node} currentNode
 * @param {string} name (node localName or class)
 * @return {node}
 */
export const findClosestNode = (currentNode, name) => {
  if (currentNode == null || currentNode === '' || currentNode === document) {
    return false;
  }

  const { parentNode, classList, localName } = currentNode;
  if ((classList && classList.contains(name)) || localName === name) {
    return currentNode;
  }
  return findClosestNode(parentNode, name);
};

/**
 * Set the offset of the element depending on the width of the scroll
 * @param {node} scrollableNode
 * @param {node} offsetNode
 * @param {string} property (CSS Style Object)
 * @param {boolean} styleImportant (if style should be !important)
 * @param {number} initialValue (if the property already has some value)
 * @return {void}
 */
export const setScrollbarOffset = (scrollableNode, offsetNode, property = 'margin-right', styleImportant, initialValue = 0) => {
  const SCROLLBAR_WIDTH = getScrollbarWidth();

  if (scrollableNode && offsetNode && SCROLLBAR_WIDTH) {
    let offset = initialValue;
    const important = styleImportant ? 'important' : '';

    const [offsetProp, scrollProp] = property.match(/(margin-right|margin-left)/) ? ['offsetHeight', 'scrollHeight'] : ['offsetWidth', 'scrollWidth'];

    if (scrollableNode[offsetProp] < scrollableNode[scrollProp]) {
      offsetNode.style.removeProperty(property);
    } else {
      offset = `${!!initialValue && initialValue > SCROLLBAR_WIDTH ? initialValue - SCROLLBAR_WIDTH : SCROLLBAR_WIDTH}px`;
      offsetNode.style.setProperty(property, offset, important);
    }
  }
};

// eslint-disable-next-line no-underscore-dangle
const _getOffsetToNode = (node, body, key) => {
  let obj = node;
  let offset = 0;

  if (!obj) {
    return offset;
  }

  while (obj !== body) {
    offset += obj[key];
    obj = obj.offsetParent;
  }

  return offset;
};

export const getOffsetToNode = (node, body) => {
  return _getOffsetToNode(node, body, 'offsetTop');
};

export const getOffsetLeftToNode = (node, body) => {
  return _getOffsetToNode(node, body, 'offsetLeft');
};

/**
 * Smart scroll to the node, uses scrollTo method or scrollTop|scrollLeft
 * @param {node} node
 * @param {options} offsetNode
 * @return {void}
 */
export const scrollTo = (node, { top = 0, left = 0, ...opts } = {}) => {
  if (node.scrollTo) {
    node.scrollTo({ top, left, ...opts });
  } else {
    if (typeof top === 'number') {
      node.scrollTop = top;
    }

    if (typeof left === 'number') {
      node.scrollLeft = left;
    }
  }
};

export const withHandler = (task) =>
  // eslint-disable-next-line consistent-return
  (cb, options) => (event) => {
    task(event, options);

    if (cb) {
      return cb(event);
    }
  };

export const stopPropagation = withHandler((e, stopNativePropagation) => {
  e.stopPropagation();

  if (stopNativePropagation) {
    e.nativeEvent.stopImmediatePropagation();
  }
});

export const stopImmediatePropagation = withHandler((e) => e.nativeEvent.stopImmediatePropagation());

export const preventDefault = withHandler((e) => e.preventDefault());

export const swallowEvent = withHandler((e, stopNativePropagation) => {
  e.stopPropagation();
  e.preventDefault();

  if (stopNativePropagation) {
    e.stopImmediatePropagation?.();
    e.nativeEvent?.stopImmediatePropagation();
  }
});

export const withKeyPress = (charCode, cb) => (event) => {
  if (event.charCode === charCode) {
    return cb(event);
  }
};

export const swallowKeyPress = (charCode) => withKeyPress(charCode, preventDefault());

export const copyJSONPath = (copy_event) => {
  const total_path = copy_event.namespace.slice();

  if (copy_event.name !== '') {
    total_path.push(copy_event.name);
  }

  // Copy to clipboard
  const el = document.createElement('textarea');
  el.value = total_path.join('.');
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export const moveCursorToEnd = (el) => {
  if (_.isNumber(el.selectionStart)) {
    const valueLength = el.value.length;
    el.selectionStart = valueLength;
    el.selectionEnd = valueLength;
  } else if (_.isUndefined(el.createTextRange)) {
    el.focus();
    const range = el.createTextRange();
    range.collapse(false);
    range.select();
  }
};

export const withTargetValue = (task) => (e) => task(e.target.value);

export const DataTypes = {
  TEXT: 'text/plain;charset=utf-8',
  JSON: 'text/json;charset=utf-8',
};

export const download = (filename, text, data = DataTypes.TEXT) => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${data},${encodeURIComponent(text)}`);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};
