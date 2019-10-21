import { CUSTOM_SLOT_TYPE, LEGACY_CUSTOM_SLOT_TYPE } from '@/constants';

import { createAdapter } from './utils';

const slotAdapter = createAdapter(
  ({ key, name, inputs, open, type }) => ({
    id: key,
    name,
    inputs,
    open,
    selected: type ? (type.value === LEGACY_CUSTOM_SLOT_TYPE ? CUSTOM_SLOT_TYPE : type.value) : null,
  }),
  ({ id, name, inputs, open, selected }) => ({
    key: id,
    name,
    inputs,
    open,
    type: {
      value: selected || CUSTOM_SLOT_TYPE,
    },
  })
);

export default slotAdapter;
