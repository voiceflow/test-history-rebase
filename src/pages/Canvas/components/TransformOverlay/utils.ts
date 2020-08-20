/* eslint-disable max-params */
import { MarkupTransform } from '@/pages/Canvas/types';
import { Pair, Point } from '@/types';

import { HORIZONTAL_HANDLES, HandlePosition, SCALE_HANDLES, VERTICAL_HANDLES, X_INVERTED_HANDLES, Y_INVERTED_HANDLES } from './constants';
import { AxialTransformation } from './types';

export const getScaleTransformations = (
  transform: MarkupTransform,
  [originX, originY]: Point,
  [left, top]: Point,
  [width, height]: Pair<number>,
  [mouseX, mouseY]: Pair<number>,
  invertX: boolean,
  invertY: boolean
): AxialTransformation => {
  const maxWidth = Math.abs(mouseX - originX);
  const maxHeight = Math.abs(mouseY - originY);
  const scaleX = maxWidth / transform.width;
  const scaleY = maxHeight / transform.height;
  const maxScale = Math.max(0, Math.max(scaleX, scaleY));

  const nextWidth = transform.width * maxScale;
  const nextHeight = transform.height * maxScale;

  const shiftX = invertX ? width - nextWidth : 0;
  const shiftY = invertY ? height - nextHeight : 0;

  const nextLeft = left + shiftX;
  const nextTop = top + shiftY;

  return {
    scale: [maxScale, maxScale],
    shift: [shiftX, shiftY],
    position: [nextLeft, nextTop],
    size: [nextWidth, nextHeight],
  };
};

export const getCenteredScaleTransformations = (
  transform: MarkupTransform,
  [originX, originY]: Point,
  [left, top]: Point,
  [width, height]: Pair<number>,
  [mouseX, mouseY]: Pair<number>
): AxialTransformation => {
  const newWidth = Math.abs(mouseX - originX) * 2;
  const newHeight = Math.abs(mouseY - originY) * 2;

  const scaleX = newWidth / transform.width;
  const scaleY = newHeight / transform.height;
  const maxScale = Math.max(0, Math.max(scaleX, scaleY));

  const nextWidth = transform.width * maxScale;
  const nextHeight = transform.height * maxScale;

  const shiftX = (width - nextWidth) / 2;
  const shiftY = (height - nextHeight) / 2;

  const nextLeft = left + shiftX;
  const nextTop = top + shiftY;

  return {
    scale: [maxScale, maxScale],
    shift: [shiftX, shiftY],
    position: [nextLeft, nextTop],
    size: [nextWidth, nextHeight],
  };
};

export const getStretchTransformations = (
  transform: MarkupTransform,
  [left, top]: Point,
  [width, height]: Pair<number>,
  [moveX, moveY]: Pair<number>,
  invertX: boolean,
  invertY: boolean
): AxialTransformation => {
  const deltaX = invertX ? -moveX : moveX;
  const deltaY = invertY ? -moveY : moveY;
  const nextWidth = Math.max(0, width + deltaX);
  const nextHeight = Math.max(0, height + deltaY);

  const shiftX = invertX ? moveX : 0;
  const shiftY = invertY ? moveY : 0;

  const nextLeft = left + shiftX;
  const nextTop = top + shiftY;

  const scaleX = nextWidth / transform.width;
  const scaleY = nextHeight / transform.height;

  return {
    scale: [scaleX, scaleY],
    shift: [shiftX, shiftY],
    position: [nextLeft, nextTop],
    size: [nextWidth, nextHeight],
  };
};

export const getResizeTransformations = (
  transform: MarkupTransform,
  handle: HandlePosition,
  [left, top]: Point,
  [width, height]: Pair<number>,
  [mouseX, mouseY]: Point,
  event: MouseEvent,
  isCentered?: boolean
) => {
  const [originX, originY] = transform.origin.point;

  const invertX = X_INVERTED_HANDLES.includes(handle);
  const invertY = Y_INVERTED_HANDLES.includes(handle);
  const preserveRatio = SCALE_HANDLES.includes(handle);
  const right = originX + transform.width;
  const bottom = originY + transform.height;
  let moveX = event.movementX;
  let moveY = event.movementY;

  if (HORIZONTAL_HANDLES.includes(handle)) {
    moveY = 0;
  } else if (VERTICAL_HANDLES.includes(handle)) {
    moveX = 0;
  } else if (preserveRatio) {
    if (isCentered) {
      const transformOrigin: Point = [originX + transform.width / 2, originY + transform.height / 2];

      return getCenteredScaleTransformations(transform, transformOrigin, [left, top], [width, height], [mouseX, mouseY]);
    }

    const transformOrigin: Point = [invertX ? right : originX, invertY ? bottom : originY];

    return getScaleTransformations(transform, transformOrigin, [left, top], [width, height], [mouseX, mouseY], invertX, invertY);
  }

  return getStretchTransformations(transform, [left, top], [width, height], [moveX, moveY], invertX, invertY);
};
