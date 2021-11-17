import { Constants } from '@voiceflow/general-types';
import { extend } from 'cooky-cutter';

import { NodeData } from '@/models';

import * as Base from '../base';

export const CommandNodeData = extend<ReturnType<typeof Base.CommandNodeData>, NodeData.Command>(Base.CommandNodeData, {
  [Constants.PlatformType.GENERAL]: () => Base.CommandPlatformData(),
});
