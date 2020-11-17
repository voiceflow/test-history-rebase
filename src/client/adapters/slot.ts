import { Slot as DBSlot } from '@voiceflow/general-types';
import cuid from 'cuid';

import { createAdapter } from '@/client/adapters/utils';
import { CUSTOM_SLOT_TYPE, LEGACY_CUSTOM_SLOT_TYPE } from '@/constants';
import { Slot, SlotInput } from '@/models';

export const slotInputAdapter = createAdapter<string, SlotInput>(
  (input) => {
    const synonyms = input.split(',');

    return {
      id: cuid.slug(),
      value: synonyms[0],
      synonyms: synonyms.slice(1).join(','),
    };
  },
  ({ value, synonyms }) => (synonyms ? `${value},${synonyms}` : value)
);

const slotAdapter = createAdapter<DBSlot, Slot>(
  ({ key, name, type, color, inputs }) => ({
    id: key,
    name,
    type: (type?.value === LEGACY_CUSTOM_SLOT_TYPE ? CUSTOM_SLOT_TYPE : type?.value) || null,
    color,
    inputs: slotInputAdapter.mapFromDB(inputs),
  }),
  ({ id, name, inputs, color, type }) => ({
    key: id,
    name,
    type: { value: type || CUSTOM_SLOT_TYPE },
    color,
    inputs: slotInputAdapter.mapToDB(inputs),
  })
);

export default slotAdapter;
