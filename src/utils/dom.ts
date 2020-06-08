import _ from 'lodash';

import { KeyCode } from '@/constants';
import { Pair, Point } from '@/types';

declare global {
  interface HTMLElement {
    createTextRange?: () => {
      collapse: (option: boolean) => void;
      select: () => void;
    };
  }

  interface Document {
    selection?: {
      empty: () => void;
    };
  }
}

/**
 * Get the width of the browser scrollbar
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

  outer.parentNode?.removeChild(outer);

  return widthNoScroll - widthWithScroll;
};

/**
 * Get the CSS Value
 */
export function getCSSValue(node: Element | null, property: string) {
  if (!node) {
    return '';
  }

  return window.getComputedStyle(node).getPropertyValue(property);
}

/**
 * Set the offset of the element depending on the width of the scroll
 */
export const setScrollbarOffset = (
  scrollableNode: HTMLElement,
  offsetNode: HTMLElement,
  property = 'margin-right',
  styleImportant: boolean,
  initialValue = 0
) => {
  const SCROLLBAR_WIDTH = getScrollbarWidth();

  if (scrollableNode && offsetNode && SCROLLBAR_WIDTH) {
    let offset = String(initialValue);
    const important = styleImportant ? 'important' : '';

    const [offsetProp, scrollProp] = property.match(/(margin-right|margin-left)/) ? ['offsetHeight', 'scrollHeight'] : ['offsetWidth', 'scrollWidth'];

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if (scrollableNode[offsetProp] < scrollableNode[scrollProp]) {
      offsetNode.style.removeProperty(property);
    } else {
      offset = `${!!initialValue && initialValue > SCROLLBAR_WIDTH ? initialValue - SCROLLBAR_WIDTH : SCROLLBAR_WIDTH}px`;
      offsetNode.style.setProperty(property, offset, important);
    }
  }
};

// eslint-disable-next-line no-underscore-dangle
const _getOffsetToNode = (node: HTMLElement, body: HTMLElement, key: keyof HTMLElement) => {
  let obj: HTMLElement | null = node;
  let offset = 0;

  if (!obj) {
    return offset;
  }

  while (obj !== body) {
    offset += obj![key] as number;
    // eslint-disable-next-line xss/no-mixed-html
    obj = obj!.offsetParent as HTMLElement;
  }

  return offset;
};

export const getOffsetToNode = (node: HTMLElement, body: HTMLElement) => {
  return _getOffsetToNode(node, body, 'offsetTop');
};

export const getOffsetLeftToNode = (node: HTMLElement, body: HTMLElement) => {
  return _getOffsetToNode(node, body, 'offsetLeft');
};

/**
 * Smart scroll to the node, uses scrollTo method or scrollTop|scrollLeft
 */
export const scrollTo = (node: HTMLElement, { top = 0, left = 0, ...opts } = {}) => {
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

export const withHandler = <E extends Event | React.BaseSyntheticEvent, O = never>(task: (event: E, options?: O) => void) =>
  // eslint-disable-next-line consistent-return
  <T extends E>(cb?: ((event: T) => void) | null, options?: O) => (event: T) => {
    task(event, options);

    if (cb) {
      return cb(event);
    }
  };

export const stopPropagation = withHandler<React.SyntheticEvent, boolean>((e, stopNativePropagation) => {
  e.stopPropagation();

  if (stopNativePropagation) {
    e.nativeEvent.stopImmediatePropagation();
  }
});

export const stopImmediatePropagation = withHandler<React.SyntheticEvent>((e) => e.nativeEvent.stopImmediatePropagation());

export const preventDefault = withHandler((e) => e.preventDefault());

export const swallowEvent = withHandler<Event | React.SyntheticEvent, boolean>((e, stopNativePropagation) => {
  e.stopPropagation();
  e.preventDefault();

  if (stopNativePropagation) {
    (e as Event).stopImmediatePropagation?.();
    (e as React.SyntheticEvent).nativeEvent?.stopImmediatePropagation();
  }
});

export const withKeyPress = <E extends KeyboardEvent | React.KeyboardEvent>(charCode: number, cb: (event: E) => void) => (event: E) => {
  if (event.charCode === charCode) {
    return cb(event);
  }
};

export const swallowKeyPress = (charCode: number) => withKeyPress(charCode, preventDefault());

export const withEnterPress = <E extends KeyboardEvent | React.KeyboardEvent>(cb: (event: E) => void) => withKeyPress(KeyCode.ENTER, cb);

export const copyJSONPath = (copy_event: { name: string; namespace: string[] }) => {
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

export const moveCursorToEnd = (el: HTMLInputElement) => {
  if (_.isNumber(el.selectionStart)) {
    const valueLength = el.value.length;
    el.selectionStart = valueLength;
    el.selectionEnd = valueLength;
  } else if (_.isUndefined(el.createTextRange)) {
    el.focus();
    const range = el.createTextRange!();
    range.collapse(false);
    range.select();
  }
};

export const withTargetValue = (task: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  task(e.target.value);

export enum DataTypes {
  TEXT = 'text/plain;charset=utf-8',
  JSON = 'text/json;charset=utf-8',
}

export const download = (filename: string, text: string, data = DataTypes.TEXT) => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${data},${encodeURIComponent(text)}`);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const buildVirtualDOMRect = ([x, y]: Point, [width, height]: Pair<number> = [0, 0]) => ({
  x,
  y,
  width,
  height,
  left: x,
  right: x + width,
  top: y,
  bottom: y + height,

  toJSON() {
    return JSON.stringify(this);
  },
});

export const buildVirtualElement = (point: Point) => {
  const virtualRect = buildVirtualDOMRect(point);

  return {
    getBoundingClientRect: () => virtualRect,
    clientWidth: 0,
    clientHeight: 0,
  };
};

export const unhighlightAllText = () => {
  if (window.getSelection) {
    window.getSelection()?.removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
};
