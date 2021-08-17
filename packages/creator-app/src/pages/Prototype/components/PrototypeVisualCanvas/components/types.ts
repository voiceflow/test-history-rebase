import { Node } from '@voiceflow/base-types';
import { PlatformType } from '@voiceflow/internal';

import { Pair } from '@/types';

export interface VisualRenderProps<T extends Node.Visual.StepData> {
  zoom: number;
  data: null | T;
  device: null | Node.Visual.DeviceType;
  platform: PlatformType;
  dimensions: Pair<number>;
}
