/* eslint-disable max-params */
import { MarkupTransform } from '@/pages/Canvas/types';
import { Pair, Point } from '@/types';

import { HandlePosition, HORIZONTAL_HANDLES, SCALE_HANDLES, VERTICAL_HANDLES, X_INVERTED_HANDLES, Y_INVERTED_HANDLES } from './constants';
import { AxialTransformation } from './types';

export const calculateRotatedBoundingRect = (rect: DOMRect, rad: number) => {
  const absSin = Math.abs(Math.sin(rad));
  const absCos = Math.abs(Math.cos(rad));

  const height = (rect.height * absCos - rect.width * absSin) / (absCos ** 2 - absSin ** 2);
  const width = -(rect.height * absSin - rect.width * absCos) / (absCos ** 2 - absSin ** 2);
  const top = rect.top + (rect.height - height) / 2;
  const left = rect.left + (rect.width - width) / 2;

  return new DOMRect(left, top, width, height);
};

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
  const scaleX = maxWidth / transform.rect.width;
  const scaleY = maxHeight / transform.rect.height;
  const maxScale = Math.max(0, Math.max(scaleX, scaleY));

  const nextWidth = transform.rect.width * maxScale;
  const nextHeight = transform.rect.height * maxScale;

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

  const scaleX = newWidth / transform.rect.width;
  const scaleY = newHeight / transform.rect.height;
  const maxScale = Math.max(0, Math.max(scaleX, scaleY));

  const nextWidth = transform.rect.width * maxScale;
  const nextHeight = transform.rect.height * maxScale;

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

  const scaleX = nextWidth / transform.rect.width;
  const scaleY = nextHeight / transform.rect.height;

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
  const right = originX + transform.rect.width;
  const bottom = originY + transform.rect.height;
  let moveX = event.movementX;
  let moveY = event.movementY;

  if (HORIZONTAL_HANDLES.includes(handle)) {
    moveY = 0;
  } else if (VERTICAL_HANDLES.includes(handle)) {
    moveX = 0;
  } else if (preserveRatio) {
    if (isCentered) {
      const transformOrigin: Point = [originX + transform.rect.width / 2, originY + transform.rect.height / 2];

      return getCenteredScaleTransformations(transform, transformOrigin, [left, top], [width, height], [mouseX, mouseY]);
    }

    const transformOrigin: Point = [invertX ? right : originX, invertY ? bottom : originY];

    return getScaleTransformations(transform, transformOrigin, [left, top], [width, height], [mouseX, mouseY], invertX, invertY);
  }

  return getStretchTransformations(transform, [left, top], [width, height], [moveX, moveY], invertX, invertY);
};
