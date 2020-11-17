import { Intent as DBIntent } from '@voiceflow/general-types';

import { createAdapter } from '@/client/adapters/utils';
import { PlatformType } from '@/constants';
import { Intent } from '@/models';
import { denormalize, normalize } from '@/utils/normalized';

const intentAdapter = (platform: PlatformType) =>
  createAdapter<DBIntent, Intent>(
    ({ key, name, inputs, slots = [] }) => ({
      id: key,
      name,
      slots: normalize(slots),
      inputs: inputs.map(({ text = '', slots = [] }) => ({ text, slots })),
      platform,
    }),
    ({ id, name, slots, inputs }) => ({
      key: id,
      name,
      slots: denormalize(slots),
      inputs,
    })
  );

export default intentAdapter;
