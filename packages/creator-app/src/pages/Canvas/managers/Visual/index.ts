import * as Realtime from '@voiceflow/realtime-sdk';
import { SVG } from '@voiceflow/ui';

import { RESPONSE_STEPS_LINK } from '@/constants';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import VisualEditor from './Editor';
import VisualManagerV2 from './v2';
import VisualStep from './VisualStep';

const VisualManager: NodeManagerConfig<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Visuals',

  step: VisualStep,
  editor: VisualEditor,

  v2: VisualManagerV2,

  stepsMenuIcon: SVG.systemImage,
  tooltipText: 'Add images and gifs to your assistant.',
  tooltipLink: RESPONSE_STEPS_LINK,
};

export default VisualManager;
