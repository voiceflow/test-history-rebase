import { CUSTOM_SLOT_TYPE, LEGACY_CUSTOM_SLOT_TYPE } from '@realtime-sdk/constants';
import { Slot, SlotInput } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { createMultiAdapter, createSmartMultiAdapter } from 'bidirectional-adapter';

import { hasValue } from './utils';

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

export const slotInputAdapter = createMultiAdapter<string, SlotInput>(
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

type FromDBKeyRemap = [['key', 'id']];

export const slotSmartAdapter = createSmartMultiAdapter<BaseModels.Slot, Slot, [], [], FromDBKeyRemap>(
  (dbSlot) => ({
    ...(hasValue(dbSlot, 'key') && { id: dbSlot.key }),
    ...(hasValue(dbSlot, 'name') && { name: dbSlot.name }),
    ...(hasValue(dbSlot, 'type') && { type: (dbSlot.type?.value === LEGACY_CUSTOM_SLOT_TYPE ? CUSTOM_SLOT_TYPE : dbSlot.type?.value) || null }),
    ...(hasValue(dbSlot, 'color') && { color: dbSlot.color }),
    ...(hasValue(dbSlot, 'inputs') && { inputs: slotInputAdapter.mapFromDB(dbSlot.inputs) }),
  }),
  (slot) => ({
    ...(hasValue(slot, 'id') && { key: slot.id }),
    ...(hasValue(slot, 'name') && { name: slot.name }),
    ...(hasValue(slot, 'type') && { type: { value: slot.type || CUSTOM_SLOT_TYPE } }),
    ...(hasValue(slot, 'color') && { color: slot.color }),
    ...(hasValue(slot, 'inputs') && { inputs: slotInputAdapter.mapToDB(slot.inputs) }),
  })
);

export const slotAdapter = createMultiAdapter<BaseModels.Slot, Slot>(
  ({ type = {}, ...dbSlot }) => slotSmartAdapter.fromDB({ ...dbSlot, type }),
  slotSmartAdapter.toDB
);
