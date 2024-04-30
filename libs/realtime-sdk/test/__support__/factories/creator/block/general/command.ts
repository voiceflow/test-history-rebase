import { extend } from 'cooky-cutter';

import type { NodeData } from '@/models';

import * as Base from '../base';

export const CommandNodeData = extend<ReturnType<typeof Base.CommandNodeData>, NodeData.Command>(Base.CommandNodeData, {
  ...Base.CommandPlatformData(),
});
