import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import VisualEditor from '@/pages/Canvas/managers/Visual/Editor';
import VisualStep from '@/pages/Canvas/managers/Visual/VisualStep';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';

const DisplayManager: NodeManagerConfig<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Display',
  platforms: [VoiceflowConstants.PlatformType.ALEXA],

  step: VisualStep,
  editor: VisualEditor,
};

export default DisplayManager;
