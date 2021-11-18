import { CUSTOM_SLOT_TYPE, LEGACY_CUSTOM_SLOT_TYPE } from '@realtime-sdk/constants';
import { Slot, SlotInput } from '@realtime-sdk/models';
import { Models as BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import createAdapter from 'bidirectional-adapter';

export const slotInputAdapter = createAdapter<string, SlotInput>(
  (input) => {
    const synonyms = input.split(',');

    return {
      id: Utils.id.cuid.slug(),
      value: synonyms[0],
      synonyms: synonyms.slice(1).join(','),
    };
  },
  ({ value, synonyms }) => (synonyms ? `${value},${synonyms}` : value)
);

const slotAdapter = createAdapter<BaseModels.Slot, Slot>(
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

export const spreadSynonyms = (slot: BaseModels.Slot) => ({
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
