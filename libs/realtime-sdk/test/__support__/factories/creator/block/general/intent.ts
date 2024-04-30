import { extend } from 'cooky-cutter';

import type { NodeData } from '@/models';

import * as Base from '../base';

export const IntentNodeData = extend<ReturnType<typeof Base.IntentNodeData>, NodeData.Intent>(Base.IntentNodeData, {
  ...Base.IntentNodeData(),
});
