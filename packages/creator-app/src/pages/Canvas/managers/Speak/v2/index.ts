import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../../types';
import SpeakStep from './SpeakStep';

const SpeakManagerV2: Partial<NodeManagerConfig<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts>> = {
  icon: undefined,
  step: SpeakStep,
};

export default SpeakManagerV2;
