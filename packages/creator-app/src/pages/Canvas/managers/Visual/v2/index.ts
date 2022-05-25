import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../../types';
import VisualStep from './VisualStep';

const VisualManagerV2: Partial<NodeManagerConfig<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts>> = {
  step: VisualStep,
};

export default VisualManagerV2;
