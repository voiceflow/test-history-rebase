import * as Realtime from '@voiceflow/realtime-sdk';

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
};

export default VisualManager;
