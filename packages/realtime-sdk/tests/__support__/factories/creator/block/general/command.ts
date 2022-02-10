import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { extend } from 'cooky-cutter';

import { NodeData } from '@/models';

import * as Base from '../base';

export const CommandNodeData = extend<ReturnType<typeof Base.CommandNodeData>, NodeData.Command>(Base.CommandNodeData, {
  [VoiceflowConstants.PlatformType.GENERAL]: () => Base.CommandPlatformData(),
});
