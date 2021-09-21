import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';

import { Pair } from '@/types';

export interface VisualRenderProps<T extends Node.Visual.StepData> {
  zoom: number;
  data: null | T;
  device: null | Node.Visual.DeviceType;
  platform: Constants.PlatformType;
  dimensions: Pair<number>;
}
