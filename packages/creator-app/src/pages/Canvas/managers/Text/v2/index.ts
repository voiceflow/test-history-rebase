import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../../types';
import { TEXT_STEP_ICON, TEXT_STEP_PLACEHOLDER } from './constants';
import TextStepV2 from './TextStep';

const TextManagerV2: Partial<NodeManagerConfig<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts>> = {
  icon: TEXT_STEP_ICON,
  label: TEXT_STEP_PLACEHOLDER,
  step: TextStepV2,
};

export default TextManagerV2;
