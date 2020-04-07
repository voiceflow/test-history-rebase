import { MAX_ZOOM, MIN_ZOOM, PINCH_SCROLL_FACTOR, SCROLL_FACTOR, ZOOM_FACTOR } from '../constants';

export function transformStyle(pos, zoom) {
  return `translate(${pos[0]}px, ${pos[1]}px) scale(${zoom / ZOOM_FACTOR})`;
}

export function getScrollDelta(event) {
  const scrollDelta = event.deltaY;

  // check if it is pinch gesture
  if (event.ctrlKey && scrollDelta % 1 !== 0) {
    return scrollDelta / PINCH_SCROLL_FACTOR;
  }

  return scrollDelta / SCROLL_FACTOR;
}

export function normalizeZoom(zoom) {
  return Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);
}

export function calculateScrollTranslation([originX, originY], prevZoom, nextZoom, [canvasX, canvasY], { width: canvasWidth, height: canvasHeight }) {
  const zoomDelta = nextZoom / ZOOM_FACTOR - prevZoom;

  // compute width and height increment factor
  const xFactor = (originX - canvasX) / prevZoom / canvasWidth;
  const yFactor = (originY - canvasY) / prevZoom / canvasHeight;

  // compute difference between rect before and after scroll
  const deltaX = canvasWidth * zoomDelta * xFactor;
  const deltaY = canvasHeight * zoomDelta * yFactor;

  return [-deltaX, -deltaY];
}
