import type { PathPoints } from '@/types';

import type { LinkedRects } from '../types';
import {
  isSourceRectsReversed,
  isTargetEndLeftXToRightOfSourceNodeXCenter,
  isTargetEndLeftXToRightOfSourceStartRightXWithDoubleStraightOffset,
  isTargetEndRightXToRightOfSourceStartLeftXWithoutDoubleStraightOffset,
  isTargetEndTopYUnderSourceStartYWithDoubleStraightOffset,
  isTargetNodeXCenterToLeftOfSourceStartRightXWithStraightOffset,
  isTargetNodeXCenterToRightOfSourceNodeXCenter,
  isTargetNodeXCenterToRightOfSourceStartLeftXWithoutStraightOffset,
} from './helpers';
import {
  geLeftJLikePoints,
  getLeftSLikePoints,
  getLeftStraightLinePoints,
  getLeftZLikePoints,
  getRightJLikePoints,
  getRightSLikePoints,
  getRightStraightLinePoints,
  getRightZLikePoints,
  getTopLeftLLikePoints,
  getTopLeftSLikePoints,
  getTopRightLLikePoints,
  getTopRightSLikePoints,
  isStraightLine,
} from './straightHelpers';
import type { GetPathPointsOptions } from './types';

const getStraightConnectedPoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => {
  if (isStraightLine(linkedRects, options)) {
    return isTargetEndLeftXToRightOfSourceNodeXCenter(linkedRects, options)
      ? getRightStraightLinePoints(linkedRects, options)
      : getLeftStraightLinePoints(linkedRects, options);
  }

  const isNotReversedActions = !options.sourceNodeIsAction || !isSourceRectsReversed(linkedRects);

  if (
    isNotReversedActions &&
    isTargetEndLeftXToRightOfSourceStartRightXWithDoubleStraightOffset(linkedRects, options)
  ) {
    return getRightZLikePoints(linkedRects, options);
  }

  if (isNotReversedActions && isTargetNodeXCenterToLeftOfSourceStartRightXWithStraightOffset(linkedRects, options)) {
    if (options.targetNodeIsCombined && isTargetEndTopYUnderSourceStartYWithDoubleStraightOffset(linkedRects)) {
      return getTopRightLLikePoints(linkedRects, options);
    }

    return getRightSLikePoints(linkedRects, options);
  }

  if (isTargetNodeXCenterToRightOfSourceNodeXCenter(linkedRects)) {
    if (options.targetNodeIsCombined && isTargetEndTopYUnderSourceStartYWithDoubleStraightOffset(linkedRects)) {
      return getTopRightSLikePoints(linkedRects, options);
    }

    return getRightJLikePoints(linkedRects, options);
  }

  if (isTargetNodeXCenterToRightOfSourceStartLeftXWithoutStraightOffset(linkedRects, options)) {
    if (options.targetNodeIsCombined && isTargetEndTopYUnderSourceStartYWithDoubleStraightOffset(linkedRects)) {
      return getTopLeftSLikePoints(linkedRects, options);
    }

    return geLeftJLikePoints(linkedRects, options);
  }

  if (isTargetEndRightXToRightOfSourceStartLeftXWithoutDoubleStraightOffset(linkedRects, options)) {
    if (options.targetNodeIsCombined && isTargetEndTopYUnderSourceStartYWithDoubleStraightOffset(linkedRects)) {
      return getTopLeftLLikePoints(linkedRects, options);
    }

    return getLeftSLikePoints(linkedRects, options);
  }

  return getLeftZLikePoints(linkedRects, options);
};

export default getStraightConnectedPoints;
