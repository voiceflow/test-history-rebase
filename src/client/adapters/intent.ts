import { PlatformType } from '@/constants';
import { Intent, IntentInput, IntentSlot } from '@/models';
import { denormalize, normalize } from '@/utils/normalized';

import { createAdapter } from './utils';

export interface RawIntent {
  key: string;
  name: string;
  slots?: IntentSlot[];
  inputs: IntentInput[];
  _platform: PlatformType;
}

const intentAdapter = createAdapter<RawIntent, Intent>(
  ({ key, name, inputs, slots = [], _platform }) => ({
    id: key,
    name,
    slots: normalize(slots),
    inputs: inputs.map(({ text = '', slots = [] }) => ({ text, slots })),
    platform: _platform,
  }),
  ({ id, name, slots, inputs, platform }) => ({
    key: id,
    name,
    slots: denormalize(slots),
    inputs,
    _platform: platform,
  })
);

export default intentAdapter;
