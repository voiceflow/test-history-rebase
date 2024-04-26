import type * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import type { NodeManagerConfigV2 } from '../types';
import { Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const VisualManager: NodeManagerConfigV2<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Image',

  step: Step,
  editorV2: Editor,

  tooltipText: 'Displays an image or gif.',
  tooltipLink: Documentation.IMAGE_STEP,
};

export default VisualManager;
