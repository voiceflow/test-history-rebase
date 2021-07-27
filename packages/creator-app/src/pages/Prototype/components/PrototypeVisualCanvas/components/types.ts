import { DeviceType } from '@voiceflow/general-types';
import { StepData } from '@voiceflow/general-types/build/nodes/visual';
import { PlatformType } from '@voiceflow/internal';

import { Pair } from '@/types';

export interface VisualRenderProps<T extends StepData> {
  zoom: number;
  data: null | T;
  device: null | DeviceType;
  platform: PlatformType;
  dimensions: Pair<number>;
}
