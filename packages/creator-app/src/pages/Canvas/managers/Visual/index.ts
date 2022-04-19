import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../types';
import { NODE_CONFIG } from './constants';
import VisualEditor from './VisualEditor';
import VisualStep from './VisualStep';

const VisualManager: NodeManagerConfig<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Visuals',

  step: VisualStep,
  editor: VisualEditor,
};

export default VisualManager;
