import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../../types';
import CaptureStep from './CaptureStep';

const CaptureV2Config: Partial<NodeManagerConfig<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts>> = {
  step: CaptureStep,
};

export default CaptureV2Config;
