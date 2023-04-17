import { NODE_LINK_WIDTH } from '@/pages/Canvas/components/Port/constants';

import { DOUBLE_STRAIGHT_PATH_OFFSET, STRAIGHT_PATH_OFFSET } from '../../constants';
import { LinkedRects } from '../types';
import { GetPathPointsOptions } from './types';

export const getRectYCenter = (rect: DOMRect): number => rect.top + rect.height / 2;
export const getRectXCenter = (rect: DOMRect): number => rect.left + rect.width / 2;

export const isSourceRectsReversed = ({ sourceNodeRect, sourcePortRect }: LinkedRects) => sourcePortRect.left < sourceNodeRect.right;

export const getSourceXOffset = ({ sourceNodeIsChip, sourceNodeIsAction }: { sourceNodeIsChip: boolean; sourceNodeIsAction: boolean }): number =>
  sourceNodeIsAction || sourceNodeIsChip ? 0 : NODE_LINK_WIDTH;

export const getSourceLeftXOffset = (options: GetPathPointsOptions): number => (options.sourceNodeIsStart ? 0 : getSourceXOffset(options));

export const getSourceStartY = ({ sourcePortRect }: LinkedRects): number => getRectYCenter(sourcePortRect);

export const getTargetXOffset = ({ isConnected, targetNodeIsCombined }: GetPathPointsOptions): number =>
  !isConnected || targetNodeIsCombined ? 0 : NODE_LINK_WIDTH;

export const getTargetEndY = ({ targetPortRect }: LinkedRects, options: { isConnected: boolean }): number =>
  options.isConnected ? targetPortRect.top + 27 : getRectYCenter(targetPortRect);

export const getTargetNodeXCenter = ({ targetNodeRect }: LinkedRects): number => getRectXCenter(targetNodeRect);

export const getSourceNodeXCenter = ({ sourceNodeRect }: LinkedRects): number => getRectXCenter(sourceNodeRect);

export const getActionsSourceStartLeftX = ({ sourcePortRect, sourceNodeRect }: LinkedRects, options: GetPathPointsOptions): number =>
  (options.sourceNodeIsAction ? sourcePortRect.left : sourceNodeRect.left) - getSourceLeftXOffset(options);

export const getSourceStartNormalLeftX = ({ sourceNodeRect }: LinkedRects, options: GetPathPointsOptions): number =>
  sourceNodeRect.left - getSourceLeftXOffset(options);

export const getSourceStartActionReversedLeftX = ({ sourcePortRect }: LinkedRects, options: GetPathPointsOptions): number =>
  sourcePortRect.left - getSourceXOffset(options);

export const getSourceStartActionLeftX = (linkedRects: LinkedRects, options: GetPathPointsOptions): number =>
  isSourceRectsReversed(linkedRects) ? getSourceStartActionReversedLeftX(linkedRects, options) : getSourceStartNormalLeftX(linkedRects, options);

export const getSourceStartLeftX = (linkedRects: LinkedRects, options: GetPathPointsOptions): number =>
  options.sourceNodeIsAction ? getSourceStartActionLeftX(linkedRects, options) : getSourceStartNormalLeftX(linkedRects, options);

export const getSourceStartLeftY = (linkedRects: LinkedRects): number => getSourceStartY(linkedRects);

export const getSourceStartRightX = ({ sourcePortRect }: LinkedRects, options: GetPathPointsOptions): number =>
  sourcePortRect.right + getSourceXOffset(options);

export const getSourceStartRightY = (linkedRects: LinkedRects): number => getSourceStartY(linkedRects);

export const getTargetEndTopX = (linkedRects: LinkedRects): number => getTargetNodeXCenter(linkedRects);

export const getTargetEndTopY = ({ targetPortRect }: LinkedRects): number => targetPortRect.top;

export const getTargetEndLeftX = ({ targetPortRect }: LinkedRects, options: GetPathPointsOptions): number =>
  targetPortRect.left - getTargetXOffset(options);

export const getTargetEndLeftY = (linkedRects: LinkedRects, options: GetPathPointsOptions): number => getTargetEndY(linkedRects, options);

export const getTargetEndRightX = ({ targetPortRect }: LinkedRects, options: GetPathPointsOptions): number =>
  targetPortRect.right + getTargetXOffset(options);

export const getTargetEndRightY = (linkedRects: LinkedRects, options: GetPathPointsOptions): number => getTargetEndY(linkedRects, options);

export const getSourceWith = (linkedRects: LinkedRects, options: GetPathPointsOptions): number =>
  getSourceStartRightX(linkedRects, options) - getSourceStartLeftX(linkedRects, options);

export const isTargetEndLeftXToRightOfSourceNodeXCenter = (linkedRects: LinkedRects, options: GetPathPointsOptions): boolean =>
  getTargetEndLeftX(linkedRects, options) > getSourceNodeXCenter(linkedRects);

export const isTargetEndLeftXToRightOfSourceStartRightXWithStraightOffset = (linkedRects: LinkedRects, options: GetPathPointsOptions): boolean =>
  getTargetEndLeftX(linkedRects, options) > getSourceStartRightX(linkedRects, options) + STRAIGHT_PATH_OFFSET;

export const isTargetEndLeftXToRightOfSourceStartLeftWithoutStraightOffset = (linkedRects: LinkedRects, options: GetPathPointsOptions): boolean =>
  getTargetEndLeftX(linkedRects, options) > getSourceStartLeftX(linkedRects, options) - STRAIGHT_PATH_OFFSET;

export const isTargetEndLeftXToRightOfSourceXCenterWithStraightOffset = (linkedRects: LinkedRects, options: GetPathPointsOptions): boolean =>
  getTargetEndLeftX(linkedRects, options) > getSourceNodeXCenter(linkedRects) + STRAIGHT_PATH_OFFSET;

export const isTargetEndLeftXToRightOfSourceStartRightXWithDoubleStraightOffset = (
  linkedRects: LinkedRects,
  options: GetPathPointsOptions
): boolean => getTargetEndLeftX(linkedRects, options) > getSourceStartRightX(linkedRects, options) + DOUBLE_STRAIGHT_PATH_OFFSET;

export const isTargetEndRightXToRightOfSourceStartLeftXWithoutDoubleStraightOffset = (
  linkedRects: LinkedRects,
  options: GetPathPointsOptions
): boolean => getTargetEndRightX(linkedRects, options) > getSourceStartLeftX(linkedRects, options) - DOUBLE_STRAIGHT_PATH_OFFSET;

export const isTargetEndTopYUnderSourceStartYWithDoubleStraightOffset = (linkedRects: LinkedRects): boolean =>
  getTargetEndTopY(linkedRects) > getSourceStartY(linkedRects) + DOUBLE_STRAIGHT_PATH_OFFSET;

export const isTargetEndLeftXToRightOfSourceNodeXCenterWithStraightOffset = (linkedRects: LinkedRects, options: GetPathPointsOptions): boolean =>
  getTargetNodeXCenter(linkedRects) > getSourceStartRightX(linkedRects, options) + STRAIGHT_PATH_OFFSET;

export const isTargetNodeXCenterToLeftOfSourceStartRightXWithStraightOffset = (linkedRects: LinkedRects, options: GetPathPointsOptions): boolean =>
  getTargetNodeXCenter(linkedRects) > getSourceStartRightX(linkedRects, options) + STRAIGHT_PATH_OFFSET;

export const isTargetNodeXCenterToRightOfSourceStartLeftXWithStraightOffset = (linkedRects: LinkedRects, options: GetPathPointsOptions): boolean =>
  getTargetNodeXCenter(linkedRects) > getSourceStartLeftX(linkedRects, options) + STRAIGHT_PATH_OFFSET;

export const isTargetNodeXCenterToRightOfSourceNodeXCenter = (linkedRects: LinkedRects): boolean =>
  getTargetNodeXCenter(linkedRects) > getSourceNodeXCenter(linkedRects);

export const isTargetNodeXCenterToRightOfSourceStartLeftXWithoutStraightOffset = (linkedRects: LinkedRects, options: GetPathPointsOptions): boolean =>
  getTargetNodeXCenter(linkedRects) > getSourceStartLeftX(linkedRects, options) - STRAIGHT_PATH_OFFSET;
