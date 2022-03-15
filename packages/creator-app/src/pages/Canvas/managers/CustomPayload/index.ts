import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import CustomPayloadEditor from './CustomPayloadEditor';
import CustomPayloadStep from './CustomPayloadStep';

const CustomPayloadManager: NodeManagerConfig<Realtime.NodeData.CustomPayload, Realtime.NodeData.CustomPayloadBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Custom Response',
  platforms: [VoiceflowConstants.PlatformType.DIALOGFLOW_ES],

  step: CustomPayloadStep,
  editor: CustomPayloadEditor,
};

export default CustomPayloadManager;
