import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import * as Documentation from '@/config/documentation';

import { NodeManagerConfigV2 } from '../types';
import { NODE_CONFIG } from './constants';
import VisualEditor from './Editor';
import VisualStep from './Step';

const DisplayManager: NodeManagerConfigV2<Realtime.NodeData<BaseNode.Visual.APLStepData>, Realtime.NodeData.VisualBuiltInPorts> = {
  ...NODE_CONFIG,
  label: 'Display',

  tooltipText: 'Display',
  tooltipLink: Documentation.DISPLAY_STEP,
  platforms: [VoiceflowConstants.PlatformType.ALEXA],

  step: VisualStep,
  editorV2: VisualEditor,
};

export default DisplayManager;
