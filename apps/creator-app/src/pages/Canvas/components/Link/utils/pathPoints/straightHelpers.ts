import { PathPoints } from '@/types';

import { DOUBLE_STRAIGHT_PATH_OFFSET, MIN_Y_POINTS_OFFSET, STRAIGHT_PATH_OFFSET } from '../../constants';
import { createPoint, getPointsOffset } from '../helpers';
import { LinkedRects } from '../types';
import {
  getSourceStartLeftX,
  getSourceStartLeftY,
  getSourceStartRightX,
  getSourceStartRightY,
  getSourceStartY,
  getTargetEndLeftX,
  getTargetEndLeftY,
  getTargetEndRightX,
  getTargetEndRightY,
  getTargetEndTopX,
  getTargetEndTopY,
  getTargetEndY,
} from './helpers';
import { GetPathPointsOptions } from './types';

export const isStraightLine = (linkedRects: LinkedRects, options: GetPathPointsOptions): boolean =>
  Math.abs(getTargetEndY(linkedRects, options) - getSourceStartY(linkedRects)) <= MIN_Y_POINTS_OFFSET;

/**
 * returns points for the right straight line, can be used in curve line
 * * @example
 * ```
 * ➡️  ----  ➡️
 * ```
 */
export const getRightStraightLinePoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => [
  createPoint(getSourceStartRightX(linkedRects, options), getSourceStartRightY(linkedRects)),
  createPoint(getTargetEndLeftX(linkedRects, options), getTargetEndLeftY(linkedRects, options)),
];

/**
 * returns points for the left straight line
 * * @example
 * ```
 * ⬅️  ----  ⬅️
 * ```
 */
export const getLeftStraightLinePoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => [
  createPoint(getSourceStartLeftX(linkedRects, options), getSourceStartLeftY(linkedRects), { reversed: true }),
  createPoint(getTargetEndRightX(linkedRects, options), getTargetEndRightY(linkedRects, options), { reversed: true }),
];

/**
 * returns points for Z-like right path
 * @example
 * ```
 * ➡️  ----
 *         |
 *         |
 *          ----  ➡️
 * ```
 * @example
 * ```
 *          ----  ➡️
 *         |
 *         |
 * ➡️  ----
 * ```
 */
export const getRightZLikePoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => {
  const startX = getSourceStartRightX(linkedRects, options);
  const startY = getSourceStartRightY(linkedRects);
  const endX = getTargetEndLeftX(linkedRects, options);
  const endY = getTargetEndLeftY(linkedRects, options);
  const offsetX = getPointsOffset(startX, endX);

  if (Math.abs(offsetX) < DOUBLE_STRAIGHT_PATH_OFFSET) {
    const startXWithOffset = startX + STRAIGHT_PATH_OFFSET;

    return [
      createPoint(startX, startY),
      createPoint(startXWithOffset, startY),
      createPoint(startXWithOffset, endY),
      createPoint(endX, endY, { allowedToTop: options.targetNodeIsCombined }),
    ];
  }

  const halfOffsetX = offsetX / 2;

  return [
    createPoint(startX, startY),
    createPoint(startX + halfOffsetX, startY),
    createPoint(startX + halfOffsetX, endY),
    createPoint(endX, endY, { allowedToTop: options.targetNodeIsCombined }),
  ];
};

/**
 * returns points for Z-like left path
 * @example
 * ```
 * ⬅️  ----
 *         |
 *         |
 *          ----  ⬅️
 * ```
 * @example
 * ```
 *          ----  ⬅️
 *         |
 *         |
 * ⬅️  ----
 * ```
 */
export const getLeftZLikePoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => {
  const startX = getSourceStartLeftX(linkedRects, options);
  const startY = getSourceStartLeftY(linkedRects);
  const endX = getTargetEndRightX(linkedRects, options);
  const endY = getTargetEndRightY(linkedRects, options);
  const offsetX = getPointsOffset(startX, endX);

  if (Math.abs(offsetX) < DOUBLE_STRAIGHT_PATH_OFFSET) {
    const startXWithoutOffset = startX - STRAIGHT_PATH_OFFSET;

    return [
      createPoint(startX, startY, { reversed: true }),
      createPoint(startXWithoutOffset, startY),
      createPoint(startXWithoutOffset, endY),
      createPoint(endX, endY, { reversed: true, allowedToTop: options.targetNodeIsCombined }),
    ];
  }

  const halfOffsetX = offsetX / 2;

  return [
    createPoint(startX, startY, { reversed: true }),
    createPoint(startX + halfOffsetX, startY),
    createPoint(startX + halfOffsetX, endY),
    createPoint(endX, endY, { reversed: true, allowedToTop: options.targetNodeIsCombined }),
  ];
};

/**
 * returns points for L-like top-right path
 * @example
 * ```
 *  ➡️  ----
 *         |
 *         |
 *         |
 *
 *         ⬇️
 * ```
 */
export const getTopRightLLikePoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => {
  const startX = getSourceStartRightX(linkedRects, options);
  const startY = getSourceStartRightY(linkedRects);
  const endX = getTargetEndTopX(linkedRects);
  const endY = getTargetEndTopY(linkedRects);

  return [createPoint(startX, startY), createPoint(endX, startY), createPoint(endX, endY, { toTop: true, allowedToTop: true })];
};

/**
 * returns points for L-like top-left path
 * @example
 * ```
 *    ----  ⬅️
 *   |
 *   |
 *   |
 *
 *   ⬇️
 * ```
 */
export const getTopLeftLLikePoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => {
  const startX = getSourceStartLeftX(linkedRects, options);
  const startY = getSourceStartLeftY(linkedRects);
  const endX = getTargetEndTopX(linkedRects);
  const endY = getTargetEndTopY(linkedRects);

  return [createPoint(startX, startY, { reversed: true }), createPoint(endX, startY), createPoint(endX, endY, { toTop: true, allowedToTop: true })];
};

/**
 * returns points for S-like right path
 * @example
 * ```
 *  ➡️  ----
 *         |
 *         |
 *     ----
 *    |
 *    |
 *     ----  ➡️
 * ```
 */
export const getRightSLikePoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => {
  const startX = getSourceStartRightX(linkedRects, options);
  const startY = getSourceStartRightY(linkedRects);
  const endX = getTargetEndLeftX(linkedRects, options);
  const endY = getTargetEndLeftY(linkedRects, options);
  const halfOffsetY = getPointsOffset(startY, endY) / 2;

  return [
    createPoint(startX, startY),
    createPoint(startX + STRAIGHT_PATH_OFFSET, startY),
    createPoint(startX + STRAIGHT_PATH_OFFSET, startY + halfOffsetY),
    createPoint(endX - STRAIGHT_PATH_OFFSET, startY + halfOffsetY),
    createPoint(endX - STRAIGHT_PATH_OFFSET, endY),
    createPoint(endX, endY, { allowedToTop: options.targetNodeIsCombined }),
  ];
};

/**
 * returns points for S-like right path
 * @example
 * ```
 *     ----  ⬅️
 *    |
 *    |
 *     ----
 *         |
 *         |
 *  ⬅️  ----
 * ```
 */

export const getLeftSLikePoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => {
  const startX = getSourceStartLeftX(linkedRects, options);
  const startY = getSourceStartLeftY(linkedRects);
  const endX = getTargetEndRightX(linkedRects, options);
  const endY = getTargetEndRightY(linkedRects, options);
  const halfOffsetY = getPointsOffset(startY, endY) / 2;

  return [
    createPoint(startX, startY, { reversed: true }),
    createPoint(startX - STRAIGHT_PATH_OFFSET, startY),
    createPoint(startX - STRAIGHT_PATH_OFFSET, startY + halfOffsetY),
    createPoint(endX + STRAIGHT_PATH_OFFSET, startY + halfOffsetY),
    createPoint(endX + STRAIGHT_PATH_OFFSET, endY),
    createPoint(endX, endY, { reversed: true, allowedToTop: options.targetNodeIsCombined }),
  ];
};

/**
 * returns points for S-like top-right path
 * @example
 * ```
 *  ➡️  ----
 *         |
 *         |
 *     ----
 *    |
 *    |
 *
 *    ⬇️
 * ```
 */
export const getTopRightSLikePoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => {
  const startX = getSourceStartRightX(linkedRects, options);
  const startY = getSourceStartRightY(linkedRects);
  const endX = getTargetEndTopX(linkedRects);
  const endY = getTargetEndTopY(linkedRects);
  const halfOffsetY = getPointsOffset(startY, endY) / 2;

  let middleY = startY + halfOffsetY;

  if (options.sourceParentNodeRect !== null && middleY < options.sourceParentNodeRect.bottom + STRAIGHT_PATH_OFFSET) {
    middleY = Math.min(options.sourceParentNodeRect.bottom + STRAIGHT_PATH_OFFSET, endY - STRAIGHT_PATH_OFFSET);
  }

  return [
    createPoint(startX, startY),
    createPoint(startX + STRAIGHT_PATH_OFFSET, startY),
    createPoint(startX + STRAIGHT_PATH_OFFSET, middleY),
    createPoint(endX, middleY),
    createPoint(endX, endY, { toTop: true, allowedToTop: true }),
  ];
};

/**
 * returns points for S-like top-left path
 * @example
 * ```
 *     ---- ⬅️
 *    |
      |
 *     ----
 *         |
 *         |
 *
 *         ⬇️
 * ```
 */
export const getTopLeftSLikePoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => {
  const startX = getSourceStartLeftX(linkedRects, options);
  const startY = getSourceStartLeftY(linkedRects);
  const endX = getTargetEndTopX(linkedRects);
  const endY = getTargetEndTopY(linkedRects);
  const halfOffsetY = getPointsOffset(startY, endY) / 2;

  let middleY = startY + halfOffsetY;

  if (options.sourceParentNodeRect !== null && middleY < options.sourceParentNodeRect.bottom + STRAIGHT_PATH_OFFSET) {
    middleY = Math.min(options.sourceParentNodeRect.bottom + STRAIGHT_PATH_OFFSET, endY - STRAIGHT_PATH_OFFSET);
  }

  return [
    createPoint(startX, startY, { reversed: true }),
    createPoint(startX - STRAIGHT_PATH_OFFSET, startY),
    createPoint(startX - STRAIGHT_PATH_OFFSET, middleY),
    createPoint(endX, middleY),
    createPoint(endX, endY, { toTop: true, allowedToTop: true }),
  ];
};

/**
 * returns points for J-like right path
 * @example
 * ```
 *  ➡️  ------
 *           |
 *           |
 *    ⬅️  ----
 * ```
 * @example
 * ```
 *    ⬅️  ----
 *           |
 *           |
 *  ➡️  ------
 * ```
 */
export const getRightJLikePoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => {
  const startX = getSourceStartRightX(linkedRects, options);
  const startY = getSourceStartRightY(linkedRects);
  const endX = getTargetEndRightX(linkedRects, options);
  const endY = getTargetEndRightY(linkedRects, options);

  const middleX = Math.max(startX, endX) + STRAIGHT_PATH_OFFSET;

  return [
    createPoint(startX, startY),
    createPoint(middleX, startY),
    createPoint(middleX, endY),
    createPoint(endX, endY, { allowedToTop: options.targetNodeIsCombined, reversed: true }),
  ];
};

/**
 * returns points for J-like left path
 * @example
 * ```
 *    ------ ➡️
 *   |
 *   |
 *    ----  ⬅️
 * ```
 * @example
 * ```
 *    ----  ⬅️
 *   |
 *   |
 *    ------ ➡️
 * ```
 */
export const geLeftJLikePoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => {
  const startX = getSourceStartLeftX(linkedRects, options);
  const startY = getSourceStartLeftY(linkedRects);
  const endX = getTargetEndLeftX(linkedRects, options);
  const endY = getTargetEndLeftY(linkedRects, options);

  const middleX = Math.min(startX, endX) - STRAIGHT_PATH_OFFSET;

  return [
    createPoint(startX, startY, { reversed: true }),
    createPoint(middleX, startY),
    createPoint(middleX, endY),
    createPoint(endX, endY, { allowedToTop: options.targetNodeIsCombined }),
  ];
};
