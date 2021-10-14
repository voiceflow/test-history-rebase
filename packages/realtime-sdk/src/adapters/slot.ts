import { Slot as DBSlot } from '@voiceflow/api-sdk';
import cuid from 'cuid';

import { CUSTOM_SLOT_TYPE, LEGACY_CUSTOM_SLOT_TYPE } from '../constants';
import { Slot, SlotInput } from '../models';
import { createAdapter } from './utils';

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

export const spreadSynonyms = (slot: DBSlot) => ({
  ...slot,
  inputs: slot.inputs.reduce<string[]>(
    (acc, input) => [
      ...acc,
      ...input
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    ],
    []
  ),
});

export default slotAdapter;
