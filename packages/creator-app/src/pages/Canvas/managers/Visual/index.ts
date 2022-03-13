import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import VisualEditor from './VisualEditor';
import VisualStep from './VisualStep';

const VisualManager: NodeManagerConfig<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Visuals',
  platforms: [
    VoiceflowConstants.PlatformType.GENERAL,
    VoiceflowConstants.PlatformType.IVR,
    VoiceflowConstants.PlatformType.MOBILE_APP,
    VoiceflowConstants.PlatformType.CHATBOT,
    VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT,
  ],

  step: VisualStep,
  editor: VisualEditor,
};

export default VisualManager;
