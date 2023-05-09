import { Point } from '@/types';

import { MAX_ZOOM, MIN_ZOOM, PINCH_SCROLL_FACTOR, SCROLL_FACTOR, ZOOM_FACTOR } from '../constants';
import { ControlAction } from './types';

export abstract class BaseControls {
  constructor(protected handle: (action: ControlAction) => void) {}
}

export const transformStyle = (position: Point, zoom: number, offsetX = 0, offsetY = 0) =>
  `translate(${position[0] - offsetX}px, ${position[1] - offsetY}px) scale(${zoom / ZOOM_FACTOR})`;

export const backgroundPositionStyle = (position: Point) => `${position[0]}px ${position[1]}px`;
export const backgroundSizeStyle = (zoom: number) => `${zoom / 5}px ${zoom / 5}px`;

export function getScrollDelta(event: WheelEvent) {
  const scrollDelta = event.deltaY;

  // check if it is pinch gesture
  if (event.ctrlKey && scrollDelta % 1 !== 0) {
    return scrollDelta / PINCH_SCROLL_FACTOR;
  }

  return scrollDelta / SCROLL_FACTOR;
}

export const normalizeZoom = (zoom: number) => Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);

// eslint-disable-next-line max-params
export function calculateScrollTranslation(
  [originX, originY]: Point,
  prevZoom: number,
  nextZoom: number,
  [canvasX, canvasY]: Point,
  { width: canvasWidth, height: canvasHeight }: DOMRect,
  zoomDiffFactor: number
): [number, number, number] {
  const zoomDelta = nextZoom / ZOOM_FACTOR - prevZoom;

  // compute width and height increment factor
  const xFactor = (originX - canvasX) / prevZoom / canvasWidth;
  const yFactor = (originY - canvasY) / prevZoom / canvasHeight;

  // compute difference between rect before and after scroll
  const deltaX = canvasWidth * zoomDelta * xFactor;
  const deltaY = canvasHeight * zoomDelta * yFactor;

  return [-deltaX, -deltaY, zoomDiffFactor];
}
