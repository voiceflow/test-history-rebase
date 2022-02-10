import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { baseIntentAdapter } from '../base';
import { createBlockAdapter } from '../utils';

const intentAdapter = createBlockAdapter<BaseNode.Intent.StepData, NodeData.Intent>(
  (data) => baseIntentAdapter.fromDB(data, { platform: VoiceflowConstants.PlatformType.GOOGLE }),
  (data) => baseIntentAdapter.toDB(data, { platform: VoiceflowConstants.PlatformType.GOOGLE })
);

export default intentAdapter;
