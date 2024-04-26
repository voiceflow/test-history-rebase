import type { NodeData } from '@realtime-sdk/models';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { extend } from 'cooky-cutter';

import * as Base from '../base';

export const CommandNodeData = extend<ReturnType<typeof Base.CommandNodeData>, NodeData.Command>(Base.CommandNodeData, {
  ...Base.CommandPlatformData(),
});
