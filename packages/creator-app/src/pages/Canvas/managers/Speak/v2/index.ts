import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../../types';
// eslint-disable-next-line import/no-named-as-default
import SpeakStep from './SpeakStep';

const SpeakManagerV2: Partial<NodeManagerConfig<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts>> = {
  step: SpeakStep,
};

export default SpeakManagerV2;
