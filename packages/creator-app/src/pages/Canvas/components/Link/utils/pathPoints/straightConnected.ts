import { PathPoints } from '@/types';

import { LinkedRects } from '../types';
import {
  isTargetEndLeftXToRightOfSourceNodeXCenter,
  isTargetEndLeftXToRightOfSourceStartRightXWithDoubleStraightOffset,
  isTargetEndRightXToRightOfSourceStartLeftXWithoutDoubleStraightOffset,
  isTargetEndTopYUnderSourceStartYWithDoubleStraightOffset,
  isTargetNodeXCenterToRightOfSourceNodeXCenter,
  isTargetNodeXCenterToRightOfSourceStartLeftXWithoutStraightOffset,
  isTargetNodeXCenterToRightOfSourceStartLeftXWithStraightOffset,
  isTargetNodeXCenterToRightOfSourceStartRightXWithStraightOffset,
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
import { GetPathPointsOptions } from './types';

const getStraightConnectedPoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => {
  if (isStraightLine(linkedRects, options)) {
    return isTargetEndLeftXToRightOfSourceNodeXCenter(linkedRects, options)
      ? getRightStraightLinePoints(linkedRects, options)
      : getLeftStraightLinePoints(linkedRects, options);
  }

  if (isTargetEndLeftXToRightOfSourceStartRightXWithDoubleStraightOffset(linkedRects, options)) {
    return getRightZLikePoints(linkedRects, options);
  }

  if (isTargetNodeXCenterToRightOfSourceStartRightXWithStraightOffset(linkedRects, options)) {
    if (options.targetNodeIsCombined && isTargetEndTopYUnderSourceStartYWithDoubleStraightOffset(linkedRects)) {
      return getTopRightLLikePoints(linkedRects, options);
    }

    return getRightSLikePoints(linkedRects, options);
  }

  if (isTargetEndLeftXToRightOfSourceNodeXCenter(linkedRects, options)) {
    if (options.targetNodeIsCombined && isTargetEndTopYUnderSourceStartYWithDoubleStraightOffset(linkedRects)) {
      return getTopRightSLikePoints(linkedRects, options);
    }

    return getRightJLikePoints(linkedRects, options);
  }

  if (isTargetNodeXCenterToRightOfSourceStartLeftXWithStraightOffset(linkedRects, options)) {
    if (options.targetNodeIsCombined && isTargetEndTopYUnderSourceStartYWithDoubleStraightOffset(linkedRects)) {
      return isTargetNodeXCenterToRightOfSourceNodeXCenter(linkedRects)
        ? getTopRightSLikePoints(linkedRects, options)
        : getTopLeftSLikePoints(linkedRects, options);
    }

    return geLeftJLikePoints(linkedRects, options);
  }

  if (isTargetEndRightXToRightOfSourceStartLeftXWithoutDoubleStraightOffset(linkedRects, options)) {
    if (options.targetNodeIsCombined && isTargetEndTopYUnderSourceStartYWithDoubleStraightOffset(linkedRects)) {
      return isTargetNodeXCenterToRightOfSourceStartLeftXWithoutStraightOffset(linkedRects, options)
        ? getTopLeftSLikePoints(linkedRects, options)
        : getTopLeftLLikePoints(linkedRects, options);
    }

    return getLeftSLikePoints(linkedRects, options);
  }

  return getLeftZLikePoints(linkedRects, options);
};

export default getStraightConnectedPoints;
