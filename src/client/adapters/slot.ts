import cuid from 'cuid';

import { CUSTOM_SLOT_TYPE, LEGACY_CUSTOM_SLOT_TYPE } from '@/constants';

import { createAdapter } from './utils';

export interface RawSlot {
  key: string;
  name: string;
  type?: { value?: string };
  color?: string;
  inputs: string[];
}

export interface Slot {
  id: string;
  name: string;
  type: string | null;
  inputs: { id: string; value: string; synonyms: string }[];
  color: string | undefined;
}

const slotAdapter = createAdapter<RawSlot, Slot>(
  ({ key, name, inputs, color, type }) => ({
    id: key,
    name,
    type: (type && (type.value === LEGACY_CUSTOM_SLOT_TYPE ? CUSTOM_SLOT_TYPE : type.value)) || null,
    color,
    inputs: inputs.map((input) => {
      const synonyms = input.split(',');
      return {
        id: cuid.slug(),
        value: synonyms[0],
        synonyms: synonyms.slice(1).join(','),
      };
    }),
  }),
  ({ id, name, inputs, color, type }) => ({
    key: id,
    name,
    type: { value: type || CUSTOM_SLOT_TYPE },
    color,
    inputs: inputs.map(({ value, synonyms }) => (synonyms ? `${value},${synonyms}` : value)),
  })
);

export const spreadSynonyms = (slot: RawSlot) => {
  return {
    ...slot,
    inputs: slot.inputs.reduce<string[]>((acc, input) => {
      return [
        ...acc,
        ...input
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
      ];
    }, []),
  };
};

export default slotAdapter;
