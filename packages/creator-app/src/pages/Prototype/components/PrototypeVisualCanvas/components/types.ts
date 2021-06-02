import { DeviceType } from '@voiceflow/general-types';
import { StepData } from '@voiceflow/general-types/build/nodes/visual';

import { PlatformType } from '@/constants';
import { Pair } from '@/types';

export type VisualRenderProps<T extends StepData> = {
  zoom: number;
  data: null | T;
  device: null | DeviceType;
  platform: PlatformType;
  dimensions: Pair<number>;
};
