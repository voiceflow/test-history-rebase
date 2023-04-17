import { GetPathPointsOptions } from '../pathPoints';

export interface SyncPointsOptions extends GetPathPointsOptions {
  isPathLocked: boolean;
  syncOnlySource: boolean;
  syncOnlyTarget: boolean;
  sourceAndTargetSelected: boolean;
}
