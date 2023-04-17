import { NodeData } from '@realtime-sdk/models';
import { extend } from 'cooky-cutter';

import * as Base from '../base';

export const CommandNodeData = extend<ReturnType<typeof Base.CommandNodeData>, NodeData.Command>(Base.CommandNodeData, {
  ...Base.CommandPlatformData(),
});
