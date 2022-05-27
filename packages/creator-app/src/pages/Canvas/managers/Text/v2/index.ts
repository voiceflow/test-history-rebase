import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../../types';
import { TEXT_STEP_ICON } from './constants';
import TextStepV2 from './TextStep';

const TextManagerV2: Partial<NodeManagerConfig<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts>> = {
  icon: TEXT_STEP_ICON,
  label: 'Text',
  step: TextStepV2,
};

export default TextManagerV2;
