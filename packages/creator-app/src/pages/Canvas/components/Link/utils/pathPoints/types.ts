export interface GetPathPointsOptions {
  isStraight: boolean;
  isConnected: boolean;
  sourceNodeIsStart: boolean;
  sourceNodeIsAction: boolean;
  targetNodeIsCombined: boolean;
  sourceParentNodeRect: DOMRect | null;
}
