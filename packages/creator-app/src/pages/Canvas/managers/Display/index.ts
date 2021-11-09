import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import VisualEditor from '../Visual/VisualEditor';
import VisualStep from '../Visual/VisualStep';
import { NODE_CONFIG } from './constants';

const DisplayManager: NodeManagerConfig<Realtime.NodeData.Visual> = {
  ...NODE_CONFIG,

  tip: 'Show a Multimodal Display on the screen using APL',
  label: 'Display',
  platforms: [Constants.PlatformType.ALEXA],

  step: VisualStep,
  editor: VisualEditor,
};

export default DisplayManager;
