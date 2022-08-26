import { getScrollbarWidth } from '@voiceflow/ui';
import _isNumber from 'lodash/isNumber';
import _isString from 'lodash/isString';

import { IS_E2E_TEST } from '@/config';
import { Point } from '@/types';

export { swallowKeyPress, withEnterPress, withInputBlur, withKeyPress, withTargetValue } from '@voiceflow/ui';

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

const rootPosition = { left: 0, top: 0 };

export const getBoundingClientOffset = (element: HTMLElement | Window | Document) => {
  if (element === window || element === document || element === document.body) {
    return rootPosition;
  }

  return (element as HTMLElement).getBoundingClientRect();
};

export const mouseEventOffset = (
  event: { clientX?: number; clientY?: number; currentTarget: EventTarget | null; srcElement?: EventTarget | null },
  overrideTarget?: HTMLElement
): Point => {
  // eslint-disable-next-line xss/no-mixed-html
  const target = (overrideTarget || event.currentTarget || event.srcElement) as HTMLElement;

  const cx = event.clientX ?? 0;
  const cy = event.clientY ?? 0;
  const rect = getBoundingClientOffset(target!);

  return [cx - rect.left, cy - rect.top];
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
  scrollableNode: HTMLElement | null,
  offsetNode: HTMLElement | null,
  property = 'margin-right',
  styleImportant = false,
  initialValue = 0
) => {
  const SCROLLBAR_WIDTH = getScrollbarWidth();

  if (scrollableNode && offsetNode && SCROLLBAR_WIDTH) {
    let offset = String(initialValue);
    const important = styleImportant ? 'important' : '';

    const [offsetProp, scrollProp] = property.match(/(margin-right|margin-left)/) ? ['offsetHeight', 'scrollHeight'] : ['offsetWidth', 'scrollWidth'];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (scrollableNode[offsetProp] < scrollableNode[scrollProp]) {
      offsetNode.style.removeProperty(property);
    } else {
      offset = `${!!initialValue && initialValue > SCROLLBAR_WIDTH ? initialValue - SCROLLBAR_WIDTH : SCROLLBAR_WIDTH}px`;
      offsetNode.style.setProperty(property, offset, important);
    }
  }
};

const _getOffsetToNode = (node: HTMLElement | null, body: HTMLElement | null, key: keyof HTMLElement) => {
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

export const getOffsetToNode = (node: HTMLElement | null, body: HTMLElement | null) => _getOffsetToNode(node, body, 'offsetTop');

export const getOffsetLeftToNode = (node: HTMLElement | null, body: HTMLElement | null) => _getOffsetToNode(node, body, 'offsetLeft');

/**
 * Smart scroll to the node, uses scrollTo method or scrollTop|scrollLeft
 */
export const scrollTo = (node: HTMLElement | null, { top = 0, left = 0, ...opts } = {}) => {
  if (!node) {
    return;
  }

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
  if (_isNumber(el.selectionStart)) {
    const valueLength = el.value.length;
    el.selectionStart = valueLength;
    el.selectionEnd = valueLength;
  } else if (el.createTextRange === undefined) {
    el.focus();
    const range = el.createTextRange!();
    range.collapse(false);
    range.select();
  }
};

export enum DataTypes {
  TEXT = 'text/plain;charset=utf-8',
  JSON = 'text/json;charset=utf-8',
  CSV = 'text/csv;encoding:utf-8',
}

export const readFileAsync = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (_isString(reader.result)) {
        resolve(reader.result);
      } else {
        reject();
      }
    };

    reader.onerror = reject;

    reader.readAsText(file);
  });

export const upload = (onChange: (files: FileList) => void, options: { accept?: string; multiple?: boolean } = {}) => {
  const element = document.createElement('input');

  element.setAttribute('id', 'vf-upload');
  element.setAttribute('type', 'file');
  element.setAttribute('multiple', `${!!options.multiple}`);

  if (options.accept) {
    element.setAttribute('accept', options.accept);
  }

  element.style.display = 'none';

  const onChangeHandler = () => {
    if (element.files?.length) {
      onChange(element.files);
    }

    element.removeEventListener('change', onChangeHandler);
  };

  element.addEventListener('change', onChangeHandler);

  document.body.appendChild(element);

  if (!IS_E2E_TEST) {
    element.click();

    document.body.removeChild(element);
  }
};

export const downloadFromURL = (filename: string, url: string) => {
  const element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const download = (filename: string, text: string, data = DataTypes.TEXT) => {
  downloadFromURL(filename, `data:${data},${encodeURIComponent(text)}`);
};

export const unhighlightAllText = () => {
  if (window.getSelection) {
    window.getSelection()?.removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
};

export const loadImage = (src: string) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });

export const importScript = (id: string, uri: string, callbackName: string) =>
  new Promise<void>((resolve) => {
    // TODO: handle errors
    if (document.getElementById(id)) {
      return resolve();
    }

    const firstJS = document.getElementsByTagName('script')[0];
    const js = document.createElement('script');

    js.src = uri;
    js.id = id;
    js.async = true;

    (window as any)[callbackName] = () => {
      resolve();
    };

    (firstJS?.parentNode ?? document.head).appendChild(js);
  });

/**
 * useful to determinate when select file window is opened/closed
 */
export const windowRefocused = (): Promise<void> =>
  new Promise<void>((resolve) => {
    window.addEventListener('blur', () => window.addEventListener('focus', () => resolve(), { once: true }), { once: true });
  });

export const getRectCenter = (rect: DOMRect): Point => {
  return [rect.left + rect.width / 2, rect.top + rect.height / 2];
};

export const isRectsEqual = (rect1: DOMRect | null, rect2: DOMRect | null): boolean =>
  (rect1 === null && rect2 === null) ||
  (rect1 !== null &&
    rect2 !== null &&
    rect1.left === rect2.left &&
    rect1.top === rect2.top &&
    rect1.width === rect2.width &&
    rect1.height === rect2.height &&
    rect1.bottom === rect2.bottom &&
    rect1.right === rect2.right);
