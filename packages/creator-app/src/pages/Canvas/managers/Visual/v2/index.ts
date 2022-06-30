import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../../types';
import VisualEditor from './Editor';
import VisualStep from './VisualStep';

const VisualManagerV2: Partial<NodeManagerConfig<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts>> = {
  step: VisualStep,
  editorV2: VisualEditor,
  label: 'Image',
};

export default VisualManagerV2;
