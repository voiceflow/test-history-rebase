import { PathPoints } from '@/types';

import { LinkedRects } from '../types';
import { getRightStraightLinePoints } from './straightHelpers';
import { GetPathPointsOptions } from './types';

const getCurvePathPoints = (linkedRects: LinkedRects, options: GetPathPointsOptions): PathPoints => getRightStraightLinePoints(linkedRects, options);

export default getCurvePathPoints;
