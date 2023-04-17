import { MarkupTransform } from '@/pages/Canvas/types';
import { Pair, Point } from '@/types';
import { getRectCenter } from '@/utils/dom';
import { Coords, Vector } from '@/utils/geometry';
import { getHypotenuse, pivotPoint, scalePoint } from '@/utils/math';

import { HandlePosition, X_INVERTED_HANDLES, Y_INVERTED_HANDLES } from './constants';

export const calculateRotatedBoundingRect = (rect: DOMRect, rad: number) => {
  const absSin = Math.abs(Math.sin(rad));
  const absCos = Math.abs(Math.cos(rad));

  const height = (rect.height * absCos - rect.width * absSin) / (absCos ** 2 - absSin ** 2);
  const width = -(rect.height * absSin - rect.width * absCos) / (absCos ** 2 - absSin ** 2);
  const top = rect.top + (rect.height - height) / 2;
  const left = rect.left + (rect.width - width) / 2;

  return new DOMRect(left, top, width, height);
};

// get projection of line 2 (origin-pointB) to to line 1 (origin-pointA): (a·b/b·b)b
const getProjection = (origin: Point, pointA: Point, pointB: Point) => {
  const originCoords = new Coords(origin);
  const startVector = new Vector(pointA).sub(originCoords);
  const projectionVector = new Vector(pointB).sub(originCoords);
  const projectedVector = startVector.scalarMul(projectionVector.dot(startVector) / startVector.dot(startVector));

  return projectedVector.add(originCoords).raw();
};

const getRotatedCornerOrigins = (transform: MarkupTransform, handle: HandlePosition) => {
  const center: Point = getRectCenter(transform.rect);

  const invertX = X_INVERTED_HANDLES.includes(handle);
  const invertY = Y_INVERTED_HANDLES.includes(handle);
  const preRotateOrigin: Point = [
    invertX ? transform.rect.left + transform.rect.width : transform.rect.left,
    invertY ? transform.rect.top + transform.rect.height : transform.rect.top,
  ];

  return pivotPoint(preRotateOrigin, center, transform.rotate);
};

export const getScaleTransformations = (
  handle: HandlePosition,
  startTransform: MarkupTransform,
  currentTransform: MarkupTransform,
  mouseStart: Point,
  mousePosition: Point
): { scale: Point; shift: Pair<number> } => {
  const startOrigin = getRotatedCornerOrigins(startTransform, handle);

  const projectionPoint = getProjection(startOrigin, mouseStart, mousePosition);

  const scale = getHypotenuse(projectionPoint, startOrigin) / getHypotenuse(mouseStart, startOrigin);

  const center: Point = getRectCenter(startTransform.rect);

  // TODO: fix this shift code to not calculate based on center, this code can be a bit confusing
  // get simulate the next origin point based on scale
  const scaledOrigin = scalePoint(startOrigin, center, scale);

  const targetCenter: Point = [center[0] + startOrigin[0] - scaledOrigin[0], center[1] + startOrigin[1] - scaledOrigin[1]];
  const currentCenter = getRectCenter(currentTransform.rect);

  return {
    scale: [scale, scale],
    shift: [targetCenter[0] - currentCenter[0], targetCenter[1] - currentCenter[1]],
  };
};

const getHandles = ({ rect, rotate }: MarkupTransform) => {
  const center: Point = getRectCenter(rect);
  const halfwayHeight = rect.top + rect.height / 2;
  return {
    leftHandlePosition: pivotPoint([rect.left, halfwayHeight], center, rotate),
    rightHandlePosition: pivotPoint([rect.left + rect.width, halfwayHeight], center, rotate),
  };
};

const MIN_WIDTH = 50;
export const getStretchTransformations = (
  handle: HandlePosition,
  startTransform: MarkupTransform,
  currentTransform: MarkupTransform,
  mousePosition: Point
) => {
  let startOrigin: Point;
  let currentOrigin: Point;
  let startPosition: Point;

  const { leftHandlePosition, rightHandlePosition } = getHandles(startTransform);
  const currentHandles = getHandles(currentTransform);
  if (handle === HandlePosition.RIGHT) {
    startOrigin = leftHandlePosition;
    currentOrigin = currentHandles.leftHandlePosition;
    startPosition = rightHandlePosition;
  } else if (handle === HandlePosition.LEFT) {
    startOrigin = rightHandlePosition;
    currentOrigin = currentHandles.rightHandlePosition;
    startPosition = leftHandlePosition;
  } else {
    return null;
  }

  const projectionPoint = getProjection(startOrigin, startPosition, mousePosition);

  const width = Math.max(getHypotenuse(projectionPoint, startOrigin), MIN_WIDTH);
  const shift: Point = [startOrigin[0] - currentOrigin[0], startOrigin[1] - currentOrigin[1]];

  // calculate new center with additional width
  return { width, shift };
};
