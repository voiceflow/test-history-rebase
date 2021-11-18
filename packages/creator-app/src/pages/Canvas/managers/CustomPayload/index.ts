import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import CustomPayloadEditor from './CustomPayloadEditor';
import CustomPayloadStep from './CustomPayloadStep';

const CustomPayloadManager: NodeManagerConfig<Realtime.NodeData.CustomPayload, Realtime.NodeData.CustomPayloadBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Custom Response',
  platforms: [Constants.PlatformType.DIALOGFLOW_ES_CHAT, Constants.PlatformType.DIALOGFLOW_ES_VOICE],

  step: CustomPayloadStep,
  editor: CustomPayloadEditor,
};

export default CustomPayloadManager;
