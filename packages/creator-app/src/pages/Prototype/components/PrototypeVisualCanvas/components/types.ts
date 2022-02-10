import { BaseNode } from '@voiceflow/base-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { Pair } from '@/types';

export interface VisualRenderProps<T extends BaseNode.Visual.StepData> {
  zoom: number;
  data: null | T;
  device: null | BaseNode.Visual.DeviceType;
  platform: VoiceflowConstants.PlatformType;
  dimensions: Pair<number>;
}
