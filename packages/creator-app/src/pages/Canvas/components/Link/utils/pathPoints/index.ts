import { PathPoints } from '@/types';

import { LinkedRects } from '../types';
import getCurvePathPointsV2 from './curve';
import getStraightConnectedPoints from './straightConnected';
import getStraightUnconnectedPoints from './straightUnconnected';
import { GetPathPointsOptions } from './types';

export * from './helpers';
export type { GetPathPointsOptions } from './types';

export const getPathPointsV2 = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => {
  if (!options.isStraight) {
    return getCurvePathPointsV2(linkedRects, options);
  }

  if (options.isConnected) {
    return getStraightConnectedPoints(linkedRects, options);
  }

  return getStraightUnconnectedPoints(linkedRects, options);
};
