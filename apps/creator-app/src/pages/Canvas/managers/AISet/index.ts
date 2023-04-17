import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import { NodeManagerConfigV2 } from '../types';
import { Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const AISetManager: NodeManagerConfigV2<Realtime.NodeData.AISet, Realtime.NodeData.AISetBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Set AI',

  step: Step,
  editorV2: Editor,

  tooltipText: 'Apply AI response to variables',
  tooltipLink: Documentation.TEXT_STEP,
};

export default AISetManager;
