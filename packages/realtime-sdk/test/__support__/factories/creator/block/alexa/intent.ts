import { NodeData } from '@realtime-sdk/models';
import { extend } from 'cooky-cutter';

import * as Base from '../base';

export const IntentNodeData = extend<ReturnType<typeof Base.IntentNodeData>, NodeData.Intent>(Base.IntentNodeData, {
  ...Base.IntentNodeData(),
});
