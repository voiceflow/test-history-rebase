import { PathPoints } from '@/types';

import { STRAIGHT_PATH_OFFSET } from '../../constants';
import { createPoint } from '../helpers';
import { LinkedRects } from '../types';
import {
  getSourceStartLeftX,
  getSourceStartLeftY,
  getSourceStartRightX,
  getSourceStartRightY,
  getTargetEndLeftX,
  getTargetEndLeftY,
  isSourceRectsReversed,
  isTargetEndLeftXToRightOfSourceNodeXCenter,
  isTargetEndLeftXToRightOfSourceStartLeftWithoutStraightOffset,
  isTargetEndLeftXToRightOfSourceStartRightXWithStraightOffset,
} from './helpers';
import { getLeftStraightLinePoints, getLeftZLikePoints, getRightStraightLinePoints, getRightZLikePoints, isStraightLine } from './straightHelpers';
import { GetPathPointsOptions } from './types';

/**
 * returns points for J-like right path
 * @example
 * ```
 *    ➡️  ----
 *           |
 *           |
 *  ⬅️  ------
 * ```
 * @example
 * ```
 *  ⬅️  ------
 *           |
 *           |
 *    ➡️  ----
 * ```
 */
const getUnconnectedRightJLikePathPoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => {
  const startX = getSourceStartRightX(linkedRects, options);
  const startY = getSourceStartRightY(linkedRects);
  const endX = getTargetEndLeftX(linkedRects, options);
  const endY = getTargetEndLeftY(linkedRects, options);

  return [
    createPoint(startX, startY),
    createPoint(startX + STRAIGHT_PATH_OFFSET, startY),
    createPoint(startX + STRAIGHT_PATH_OFFSET, endY),
    createPoint(endX, endY, { reversed: true }),
  ];
};

/**
 * returns points for unbalanced J-like left path
 * @example
 * ```
 *    ----  ⬅️
 *   |
 *   |
 *    ------  ➡️
 * ```
 * @example
 * ```
 *     ------  ➡️
 *   |
 *   |
 *    ----  ⬅️
 * ```
 */
const getUnconnectedLeftJLikePathPoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => {
  const startX = getSourceStartLeftX(linkedRects, options);
  const startY = getSourceStartLeftY(linkedRects);
  const endX = getTargetEndLeftX(linkedRects, options);
  const endY = getTargetEndLeftY(linkedRects, options);

  return [
    createPoint(startX, startY, { reversed: true }),
    createPoint(startX - STRAIGHT_PATH_OFFSET, startY),
    createPoint(startX - STRAIGHT_PATH_OFFSET, endY),
    createPoint(endX, endY),
  ];
};

const getStraightUnconnectedPathPoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => {
  if (isStraightLine(linkedRects, options)) {
    return isTargetEndLeftXToRightOfSourceNodeXCenter(linkedRects, options)
      ? getRightStraightLinePoints(linkedRects, options)
      : getLeftStraightLinePoints(linkedRects, options);
  }

  const isActionReversed = options.sourceNodeIsAction && isSourceRectsReversed(linkedRects);

  if (!isActionReversed && isTargetEndLeftXToRightOfSourceStartRightXWithStraightOffset(linkedRects, options)) {
    return getRightZLikePoints(linkedRects, options);
  }

  if (isTargetEndLeftXToRightOfSourceNodeXCenter(linkedRects, options)) {
    return getUnconnectedRightJLikePathPoints(linkedRects, options);
  }

  if (isTargetEndLeftXToRightOfSourceStartLeftWithoutStraightOffset(linkedRects, options)) {
    return getUnconnectedLeftJLikePathPoints(linkedRects, options);
  }

  return getLeftZLikePoints(linkedRects, options);
};

export default getStraightUnconnectedPathPoints;
