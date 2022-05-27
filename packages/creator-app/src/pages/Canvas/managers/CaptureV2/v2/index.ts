import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfig } from '../../types';
import CaptureStep from './CaptureStep';
import { CAPTURE_STEP_ICON } from './constants';

const CaptureV2Config: Partial<NodeManagerConfig<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts>> = {
  icon: CAPTURE_STEP_ICON,
  step: CaptureStep,
};

export default CaptureV2Config;
