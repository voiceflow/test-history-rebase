import { Constants } from '@voiceflow/general-types';

import { NodeData } from '@/models';

import { NodeManagerConfig } from '../types';
import VisualEditor from '../Visual/VisualEditor';
import VisualStep from '../Visual/VisualStep';
import { NODE_CONFIG } from './constants';

const DisplayManager: NodeManagerConfig<NodeData.Visual> = {
  ...NODE_CONFIG,

  tip: 'Show a Multimodal Display on the screen using APL',
  label: 'Display',
  platforms: [Constants.PlatformType.ALEXA],

  step: VisualStep,
  editor: VisualEditor,
};

export default DisplayManager;
