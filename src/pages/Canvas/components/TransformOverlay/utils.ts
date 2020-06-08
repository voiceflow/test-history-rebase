/* eslint-disable max-params */
import { Pair, Point } from '@/types';

import { HORIZONTAL_HANDLES, HandlePosition, SCALE_HANDLES, VERTICAL_HANDLES, X_INVERTED_HANDLES, Y_INVERTED_HANDLES } from './constants';
import { AxialTransformation } from './types';

export const getScaleTransformations = (
  rect: DOMRect,
  [originX, originY]: Point,
  [left, top]: Point,
  [width, height]: Pair<number>,
  [mouseX, mouseY]: Pair<number>,
  isXInverted: boolean,
  isYInverted: boolean
): AxialTransformation => {
  const maxWidth = Math.abs(mouseX - originX);
  const maxHeight = Math.abs(mouseY - originY);
  const scaleX = maxWidth / rect.width;
  const scaleY = maxHeight / rect.height;
  const minScale = Math.max(0, Math.min(scaleX, scaleY));
  const nextWidth = rect.width * minScale;
  const nextHeight = rect.height * minScale;
  const offsetX = isXInverted ? width - nextWidth : 0;
  const offsetY = isYInverted ? height - nextHeight : 0;
  const nextLeft = left + offsetX;
  const nextTop = top + offsetY;

  return {
    scale: [minScale, minScale],
    offset: [offsetX, offsetY],
    position: [nextLeft, nextTop],
    size: [nextWidth, nextHeight],
  };
};

export const getStretchTransformations = (
  rect: DOMRect,
  [left, top]: Point,
  [width, height]: Pair<number>,
  [moveX, moveY]: Pair<number>,
  isXInverted: boolean,
  isYInverted: boolean
): AxialTransformation => {
  const deltaX = isXInverted ? -moveX : moveX;
  const deltaY = isYInverted ? -moveY : moveY;
  const nextWidth = Math.max(0, width + deltaX);
  const nextHeight = Math.max(0, height + deltaY);
  const offsetX = isXInverted ? moveX : 0;
  const offsetY = isYInverted ? moveY : 0;
  const nextLeft = left + offsetX;
  const nextTop = top + offsetY;
  const scaleX = nextWidth / rect.width;
  const scaleY = nextHeight / rect.height;

  return {
    scale: [scaleX, scaleY],
    offset: [offsetX, offsetY],
    position: [nextLeft, nextTop],
    size: [nextWidth, nextHeight],
  };
};

export const getResizeTransformations = (
  rect: DOMRect,
  handle: HandlePosition,
  [left, top]: Point,
  [width, height]: Pair<number>,
  [mouseX, mouseY]: Point,
  event: MouseEvent
) => {
  const isXInverted = X_INVERTED_HANDLES.includes(handle);
  const isYInverted = Y_INVERTED_HANDLES.includes(handle);
  const preserveRatio = SCALE_HANDLES.includes(handle);
  let moveX = event.movementX;
  let moveY = event.movementY;

  if (HORIZONTAL_HANDLES.includes(handle)) {
    moveY = 0;
  } else if (VERTICAL_HANDLES.includes(handle)) {
    moveX = 0;
  } else if (preserveRatio) {
    const transformOrigin: Point = [isXInverted ? rect.right : rect.left, isYInverted ? rect.bottom : rect.top];

    return getScaleTransformations(rect, transformOrigin, [left, top], [width, height], [mouseX, mouseY], isXInverted, isYInverted);
  }

  return getStretchTransformations(rect, [left, top], [width, height], [moveX, moveY], isXInverted, isYInverted);
};
