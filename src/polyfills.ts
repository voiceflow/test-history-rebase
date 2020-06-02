import 'core-js/stable';

import ResizeObserver from 'resize-observer-polyfill';

if (window) {
  window.ResizeObserver = window.ResizeObserver || ResizeObserver;
}
