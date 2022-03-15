import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import VisualEditor from './VisualEditor';
import VisualStep from './VisualStep';

const VisualManager: NodeManagerConfig<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Visuals',
  platforms: [VoiceflowConstants.PlatformType.VOICEFLOW, VoiceflowConstants.PlatformType.DIALOGFLOW_ES],

  step: VisualStep,
  editor: VisualEditor,
};

export default VisualManager;
