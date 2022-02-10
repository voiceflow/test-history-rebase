import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { baseCommandAdapter } from '../base';
import { createBlockAdapter } from '../utils';

const commandAdapter = createBlockAdapter<BaseNode.Command.StepData, NodeData.Command>(
  (data) => baseCommandAdapter.fromDB(data, { platform: VoiceflowConstants.PlatformType.GENERAL }),
  (data) => baseCommandAdapter.toDB(data, { platform: VoiceflowConstants.PlatformType.GENERAL })
);

export default commandAdapter;
