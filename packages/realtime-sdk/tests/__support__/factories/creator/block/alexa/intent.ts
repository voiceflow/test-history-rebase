import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { extend } from 'cooky-cutter';

import { NodeData } from '@/models';

import * as Base from '../base';

export const IntentNodeData = extend<ReturnType<typeof Base.IntentNodeData>, NodeData.Intent>(Base.IntentNodeData, {
  [VoiceflowConstants.PlatformType.ALEXA]: () => Base.IntentPlatformData(),
});
