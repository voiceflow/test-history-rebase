import { denormalize, normalize } from '@/utils/normalized';

import { createAdapter } from './utils';

const intentAdapter = createAdapter(
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
